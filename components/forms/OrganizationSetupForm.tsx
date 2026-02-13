// components/forms/OrganizationSetupForm.tsx
// Formular setup organizație nouă cu auto-lookup ANAF, search CAEN, și creare automată departamente
// Include: CUI, denumire, adresă, județ, localitate, CAEN principal, nr angajați, contact
// La submit: creează organization + membership admin + departamente default bazate pe CAEN

'use client'

import { useState, useEffect, useRef } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import {
  Building2,
  Search,
  MapPin,
  Users,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
  FileText
} from 'lucide-react'

// ========== TYPES ==========

interface CAENActivity {
  id: string
  caen: string
  name: string
  synonyms: string[]
  riskLevel: 'scazut' | 'mediu' | 'ridicat' | 'critic'
  category: string
}

interface ANAFData {
  cui: string
  denumire: string
  adresa: string
  judet: string
  localitate: string
  cod_postal?: string
  telefon?: string
  email?: string
  caen_principal?: string
  data_inregistrare?: string
  stare?: string
}

interface Props {
  userId: string
  onSuccess?: (organizationId: string) => void
  onCancel?: () => void
}

// ========== CONSTANTS ==========

const JUDETE_ROMANIA = [
  'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani',
  'Brașov', 'Brăila', 'București', 'Buzău', 'Caraș-Severin', 'Călărași',
  'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
  'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
  'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Satu Mare', 'Sălaj',
  'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vaslui', 'Vâlcea', 'Vrancea'
].sort()

const EMPLOYEE_RANGES = [
  { value: '1-9', label: '1-9 angajați (microîntreprindere)' },
  { value: '10-49', label: '10-49 angajați (mică)' },
  { value: '50-249', label: '50-249 angajați (medie)' },
  { value: '250+', label: '250+ angajați (mare)' },
]

// Mapare CAEN → Departamente default
const CAEN_DEFAULT_DEPARTMENTS: Record<string, string[]> = {
  '4520': ['Service Auto', 'Vulcanizare', 'Administrativ'],
  '5610': ['Bucătărie', 'Sala', 'Bar', 'Administrativ'],
  '5630': ['Bar', 'Sala', 'Administrativ'],
  '1071': ['Producție', 'Depozit', 'Vânzări', 'Administrativ'],
  '4120': ['Șantier', 'Utilaje', 'Administrativ'],
  '4399': ['Șantier', 'Utilaje', 'Administrativ'],
  '6201': ['Dezvoltare', 'Testare', 'Suport', 'Administrativ'],
  '4711': ['Vânzări', 'Depozit', 'Casa', 'Administrativ'],
  'default': ['Producție', 'Administrativ']
}

// ========== MOCK ANAF LOOKUP ==========

async function mockAnafLookup(cui: string): Promise<ANAFData | null> {
  // Simulare delay API
  await new Promise(resolve => setTimeout(resolve, 800))

  // Mock data pentru demo
  const mockDatabase: Record<string, ANAFData> = {
    '35678901': {
      cui: 'RO35678901',
      denumire: 'BuildMax SRL',
      adresa: 'Calea Bucureștilor nr. 120',
      judet: 'Ilfov',
      localitate: 'Voluntari',
      cod_postal: '077190',
      telefon: '+40 21 456 7890',
      email: 'office@buildmax.ro',
      caen_principal: '4120',
      data_inregistrare: '2018-03-15',
      stare: 'ACTIVA'
    },
    '12345678': {
      cui: 'RO12345678',
      denumire: 'Tech Solutions SRL',
      adresa: 'Str. Libertății nr. 45',
      judet: 'Cluj',
      localitate: 'Cluj-Napoca',
      cod_postal: '400001',
      telefon: '+40 264 123 456',
      email: 'contact@techsolutions.ro',
      caen_principal: '6201',
      data_inregistrare: '2015-06-20',
      stare: 'ACTIVA'
    },
    '98765432': {
      cui: 'RO98765432',
      denumire: 'Restaurant Gustos SRL',
      adresa: 'Piața Unirii nr. 10',
      judet: 'București',
      localitate: 'Sector 3',
      telefon: '+40 21 333 4444',
      email: 'contact@gustos.ro',
      caen_principal: '5610',
      data_inregistrare: '2020-01-10',
      stare: 'ACTIVA'
    }
  }

  // Normalizare CUI (elimină RO, spații, etc)
  const normalizedCui = cui.replace(/[^0-9]/g, '')

  return mockDatabase[normalizedCui] || null
}

// ========== COMPONENT ==========

export default function OrganizationSetupForm({ userId, onSuccess, onCancel }: Props) {
  const supabase = createSupabaseBrowser()
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  // ========== STATE ==========

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [lookingUpCUI, setLookingUpCUI] = useState(false)
  const [searchingCAEN, setSearchingCAEN] = useState(false)

  const [caenActivities, setCAENActivities] = useState<CAENActivity[]>([])
  const [filteredCAEN, setFilteredCAEN] = useState<CAENActivity[]>([])
  const [showCAENDropdown, setShowCAENDropdown] = useState(false)
  const [caenSearchTerm, setCAENSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    cui: '',
    name: '',
    address: '',
    county: '',
    locality: '',
    caen_code: '',
    caen_name: '',
    employee_range: '1-9',
    contact_person: '',
    contact_phone: '',
    contact_email: '',
  })

  // ========== EFFECTS ==========

  // Load CAEN activities
  useEffect(() => {
    async function loadCAENActivities() {
      try {
        const response = await fetch('/src/data/caen-activities.json')
        if (response.ok) {
          const data = await response.json()
          setCAENActivities(data.activities || [])
        }
      } catch (err) {
        console.error('Failed to load CAEN activities:', err)
      }
    }
    loadCAENActivities()
  }, [])

  // Filter CAEN on search
  useEffect(() => {
    if (!caenSearchTerm || caenSearchTerm.length < 2) {
      setFilteredCAEN([])
      setShowCAENDropdown(false)
      return
    }

    const searchLower = caenSearchTerm.toLowerCase()
    const filtered = caenActivities.filter(activity => {
      return (
        activity.caen.includes(searchLower) ||
        activity.name.toLowerCase().includes(searchLower) ||
        activity.synonyms.some(syn => syn.toLowerCase().includes(searchLower))
      )
    }).slice(0, 10)

    setFilteredCAEN(filtered)
    setShowCAENDropdown(filtered.length > 0)
  }, [caenSearchTerm, caenActivities])

  // ========== HANDLERS ==========

  const handleCUILookup = async () => {
    if (!formData.cui || formData.cui.length < 6) {
      setError('CUI invalid. Introduceți un CUI valid (minim 6 cifre).')
      return
    }

    setLookingUpCUI(true)
    setError(null)

    try {
      const anafData = await mockAnafLookup(formData.cui)

      if (!anafData) {
        setError('CUI negăsit în registrul ANAF. Verificați CUI-ul sau completați manual.')
        setLookingUpCUI(false)
        return
      }

      if (anafData.stare !== 'ACTIVA') {
        setError(`Firmă cu stare: ${anafData.stare}. Verificați datele.`)
      }

      // Auto-completare formular
      setFormData(prev => ({
        ...prev,
        name: anafData.denumire,
        address: anafData.adresa,
        county: anafData.judet,
        locality: anafData.localitate,
        contact_phone: anafData.telefon || prev.contact_phone,
        contact_email: anafData.email || prev.contact_email,
      }))

      // Auto-select CAEN dacă există
      if (anafData.caen_principal) {
        const caenActivity = caenActivities.find(a => a.caen === anafData.caen_principal)
        if (caenActivity) {
          setFormData(prev => ({
            ...prev,
            caen_code: caenActivity.caen,
            caen_name: caenActivity.name,
          }))
          setCAENSearchTerm(`${caenActivity.caen} - ${caenActivity.name}`)
        }
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('ANAF lookup error:', err)
      setError('Eroare la interogare ANAF. Încercați din nou sau completați manual.')
    } finally {
      setLookingUpCUI(false)
    }
  }

  const handleCAENSearch = (value: string) => {
    setCAENSearchTerm(value)

    // Clear selected CAEN if user is typing
    if (formData.caen_code) {
      setFormData(prev => ({ ...prev, caen_code: '', caen_name: '' }))
    }
  }

  const handleCAENSelect = (activity: CAENActivity) => {
    setFormData(prev => ({
      ...prev,
      caen_code: activity.caen,
      caen_name: activity.name,
    }))
    setCAENSearchTerm(`${activity.caen} - ${activity.name}`)
    setShowCAENDropdown(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validări
      if (!formData.name || !formData.cui) {
        throw new Error('Denumire și CUI sunt obligatorii.')
      }

      if (!formData.caen_code) {
        throw new Error('Selectați codul CAEN principal.')
      }

      if (!formData.contact_email) {
        throw new Error('Email contact este obligatoriu.')
      }

      // 1. Creează organizația
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.name,
          cui: formData.cui.replace(/[^0-9]/g, ''), // Normalizare CUI
          address: formData.address || null,
          county: formData.county || null,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone || null,
          employee_count: parseInt(formData.employee_range.split('-')[0]) || 1,
          data_completeness: 60,
          exposure_score: 'necalculat',
          preferred_channels: ['email'],
          cooperation_status: 'active',
        })
        .select()
        .single()

      if (orgError) throw orgError
      if (!orgData) throw new Error('Failed to create organization')

      const organizationId = orgData.id

      // 2. Creează membership admin pentru user
      const { error: membershipError } = await supabase
        .from('memberships')
        .insert({
          user_id: userId,
          organization_id: organizationId,
          role: 'firma_admin',
          is_active: true,
        })

      if (membershipError) throw membershipError

      // 3. Creează departamente default bazate pe CAEN
      const defaultDepartments = CAEN_DEFAULT_DEPARTMENTS[formData.caen_code]
        || CAEN_DEFAULT_DEPARTMENTS['default']

      const departmentInserts = defaultDepartments.map(deptName => ({
        organization_id: organizationId,
        name: deptName,
        description: `Departament ${deptName}`,
        is_active: true,
      }))

      // Verifică dacă tabela departments există
      const { error: deptError } = await supabase
        .from('departments')
        .insert(departmentInserts)

      // Ignorăm eroarea dacă tabela nu există (va fi creată în viitor)
      if (deptError && !deptError.message.includes('relation "departments" does not exist')) {
        console.warn('Department creation warning:', deptError)
      }

      // 4. Log audit
      await supabase
        .from('audit_log')
        .insert({
          organization_id: organizationId,
          user_id: userId,
          action: 'organization.created',
          entity_type: 'organization',
          entity_id: organizationId,
          metadata: {
            cui: formData.cui,
            caen: formData.caen_code,
            employee_range: formData.employee_range,
            departments: defaultDepartments,
          },
        })

      setSuccess(true)

      // Success callback
      if (onSuccess) {
        setTimeout(() => onSuccess(organizationId), 1500)
      }
    } catch (err: any) {
      console.error('Organization setup error:', err)
      setError(err.message || 'Eroare la crearea organizației. Încercați din nou.')
    } finally {
      setLoading(false)
    }
  }

  // ========== RENDER ==========

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Setup Organizație Nouă</h2>
              <p className="text-sm text-gray-600">
                Configurare profil firmă cu auto-completare ANAF și departamente default
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Eroare</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">Success!</p>
              <p className="text-sm text-green-700 mt-1">
                Organizație creată cu succes. Redirecționare...
              </p>
            </div>
          </div>
        )}

        {/* CUI Lookup Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Date Identificare ANAF</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CUI Firmă (fără RO)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.cui}
                  onChange={(e) => setFormData(prev => ({ ...prev, cui: e.target.value }))}
                  placeholder="Ex: 35678901"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={lookingUpCUI}
                />
                <button
                  type="button"
                  onClick={handleCUILookup}
                  disabled={lookingUpCUI || !formData.cui}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
                >
                  {lookingUpCUI ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verificare...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Verifică ANAF
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Introduceți CUI-ul și apăsați "Verifică ANAF" pentru auto-completare
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Denumire Firmă *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: BuildMax SRL"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Adresă Sediu Social</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresă Completă
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Ex: Calea Bucureștilor nr. 120"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Județ
              </label>
              <select
                value={formData.county}
                onChange={(e) => setFormData(prev => ({ ...prev, county: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selectează județul</option>
                {JUDETE_ROMANIA.map(judet => (
                  <option key={judet} value={judet}>{judet}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localitate
              </label>
              <input
                type="text"
                value={formData.locality}
                onChange={(e) => setFormData(prev => ({ ...prev, locality: e.target.value }))}
                placeholder="Ex: Voluntari"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* CAEN & Employees Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Activitate & Dimensiune</h3>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CAEN Principal *
              </label>
              <input
                type="text"
                value={caenSearchTerm}
                onChange={(e) => handleCAENSearch(e.target.value)}
                onFocus={() => caenSearchTerm.length >= 2 && setShowCAENDropdown(true)}
                placeholder="Caută după cod CAEN sau denumire activitate..."
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* CAEN Dropdown */}
              {showCAENDropdown && filteredCAEN.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {filteredCAEN.map((activity) => (
                    <button
                      key={activity.id}
                      type="button"
                      onClick={() => handleCAENSelect(activity)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {activity.caen} - {activity.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.synonyms.slice(0, 3).join(', ')}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          activity.riskLevel === 'scazut' ? 'bg-green-100 text-green-800' :
                          activity.riskLevel === 'mediu' ? 'bg-yellow-100 text-yellow-800' :
                          activity.riskLevel === 'ridicat' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {activity.riskLevel}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500 mt-1">
                Introduceți minim 2 caractere pentru a căuta
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Număr Angajați
              </label>
              <select
                value={formData.employee_range}
                onChange={(e) => setFormData(prev => ({ ...prev, employee_range: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {EMPLOYEE_RANGES.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Date Contact</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Persoană Contact
              </label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))}
                placeholder="Ex: Ion Popescu"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon Contact
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                  placeholder="+40 21 123 4567"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Contact *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                  placeholder="office@firma.ro"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info Box - Departamente Default */}
        {formData.caen_code && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Departamente default pentru CAEN {formData.caen_code}:
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  {(CAEN_DEFAULT_DEPARTMENTS[formData.caen_code] || CAEN_DEFAULT_DEPARTMENTS['default']).join(', ')}
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  Aceste departamente vor fi create automat și pot fi modificate ulterior.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Anulează
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !formData.name || !formData.cui || !formData.caen_code || !formData.contact_email}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creare organizație...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Creează Organizație
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
