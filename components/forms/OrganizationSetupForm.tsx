// components/forms/OrganizationSetupForm.tsx
// Formular setup organizatie: CUI cu auto-lookup ANAF (mock), denumire, adresa sediu,
// judet, localitate, CAEN principal cu search din seed, nr angajati range,
// persoana contact, telefon, email
// La submit: creaza organization + membership admin + default departments based on CAEN

'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import {
  Building2,
  MapPin,
  Users,
  Phone,
  Mail,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react'
import activitiesData from '@/src/data/caen-activities.json'

// ========== TYPES ==========

interface Activity {
  id: string
  caen: string
  name: string
  synonyms: string[]
  riskLevel: string
  category: string
}

interface OrganizationFormData {
  cui: string
  name: string
  address: string
  county: string
  city: string
  caen: string
  caenName: string
  employeeCountRange: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
}

interface Props {
  userId: string
  userEmail: string
  onSuccess?: (organizationId: string) => void
  onCancel?: () => void
}

// ========== CONSTANTS ==========

const RO_COUNTIES = [
  'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud',
  'Botoșani', 'Brăila', 'Brașov', 'București', 'Buzău', 'Călărași',
  'Caraș-Severin', 'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj',
  'Galați', 'Giurgiu', 'Gorj', 'Harghita', 'Hunedoara', 'Ialomița',
  'Iași', 'Ilfov', 'Maramureș', 'Mehedinți', 'Mureș', 'Neamț',
  'Olt', 'Prahova', 'Sălaj', 'Satu Mare', 'Sibiu', 'Suceava',
  'Teleorman', 'Timiș', 'Tulcea', 'Vâlcea', 'Vaslui', 'Vrancea',
]

const EMPLOYEE_COUNT_RANGES = [
  { value: '1-9', label: '1-9 angajați (micro)' },
  { value: '10-49', label: '10-49 angajați (mică)' },
  { value: '50-249', label: '50-249 angajați (medie)' },
  { value: '250+', label: '250+ angajați (mare)' },
]

// Departamente default pe bază de categorie CAEN
const DEFAULT_DEPARTMENTS_BY_CATEGORY: Record<string, string[]> = {
  construction: ['Administrativ', 'Șantier', 'Utilaje', 'Transport'],
  automotive: ['Administrativ', 'Service', 'Piese', 'Vânzări'],
  horeca: ['Administrativ', 'Bucătărie', 'Sală', 'Bar'],
  food: ['Administrativ', 'Producție', 'Ambalare', 'Vânzări'],
  manufacturing: ['Administrativ', 'Producție', 'Depozit', 'Logistică'],
  services: ['Administrativ', 'Operațional', 'Suport Clienți'],
  retail: ['Administrativ', 'Vânzări', 'Depozit', 'Logistică'],
  office: ['Administrativ', 'Operațional'],
  other: ['Administrativ', 'Operațional'],
}

// ========== MOCK ANAF API ==========

interface ANAFCompanyData {
  cui: string
  name: string
  address: string
  county: string
  city: string
  phone: string
}

async function mockANAFLookup(cui: string): Promise<ANAFCompanyData | null> {
  // Simulare delay API
  await new Promise(resolve => setTimeout(resolve, 800))

  // Mock data pentru demo
  const mockCompanies: Record<string, ANAFCompanyData> = {
    '12345678': {
      cui: '12345678',
      name: 'BUILD MAX CONSTRUCT SRL',
      address: 'Str. Constructorilor nr. 45',
      county: 'București',
      city: 'Sector 3',
      phone: '0723456789',
    },
    '87654321': {
      cui: '87654321',
      name: 'TECH SOLUTIONS EXPERT SRL',
      address: 'Bd. Revoluției nr. 12, et. 4',
      county: 'Cluj',
      city: 'Cluj-Napoca',
      phone: '0734567890',
    },
    '11223344': {
      cui: '11223344',
      name: 'RESTAURANT LA MAMA SRL',
      address: 'Str. Unirii nr. 78',
      county: 'Brașov',
      city: 'Brașov',
      phone: '0745678901',
    },
  }

  return mockCompanies[cui] || null
}

function validateCUI(cui: string): { valid: boolean; message: string } {
  const cleaned = cui.replace(/\s/g, '').replace(/^RO/i, '')

  if (!/^\d{6,10}$/.test(cleaned)) {
    return { valid: false, message: 'CUI-ul trebuie să conțină între 6-10 cifre' }
  }

  // Simplified validation (in production, use full algorithm)
  if (cleaned.length < 6) {
    return { valid: false, message: 'CUI invalid' }
  }

  return { valid: true, message: 'CUI valid' }
}

// ========== COMPONENT ==========

export default function OrganizationSetupForm({
  userId,
  userEmail,
  onSuccess,
  onCancel,
}: Props) {
  const supabase = createSupabaseBrowser()

  // ========== STATE ==========

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<OrganizationFormData>({
    cui: '',
    name: '',
    address: '',
    county: '',
    city: '',
    caen: '',
    caenName: '',
    employeeCountRange: '1-9',
    contactPerson: '',
    contactPhone: '',
    contactEmail: userEmail,
  })

  // CUI lookup state
  const [cuiError, setCuiError] = useState<string>('')
  const [loadingANAF, setLoadingANAF] = useState(false)
  const [anafFound, setAnafFound] = useState(false)

  // CAEN search state
  const [caenSearch, setCaenSearch] = useState('')
  const [caenSuggestions, setCaenSuggestions] = useState<Activity[]>([])
  const [showCaenSuggestions, setShowCaenSuggestions] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

  // ========== CUI VALIDATION & ANAF LOOKUP ==========

  const handleCUIBlur = async () => {
    const cui = formData.cui.trim()
    if (!cui) {
      setCuiError('')
      return
    }

    // Validare CUI
    const validation = validateCUI(cui)
    if (!validation.valid) {
      setCuiError(validation.message)
      setAnafFound(false)
      return
    }

    setCuiError('')

    // Mock ANAF lookup
    setLoadingANAF(true)
    setAnafFound(false)

    try {
      const cleanedCUI = cui.replace(/\s/g, '').replace(/^RO/i, '')
      const anafData = await mockANAFLookup(cleanedCUI)

      if (anafData) {
        setAnafFound(true)

        // Auto-fill form
        setFormData((prev) => ({
          ...prev,
          cui: anafData.cui,
          name: prev.name || anafData.name,
          address: prev.address || anafData.address,
          county: prev.county || anafData.county,
          city: prev.city || anafData.city,
          contactPhone: prev.contactPhone || anafData.phone,
        }))
      } else {
        setCuiError('CUI valid, dar nu a fost găsit în registrul ANAF')
      }
    } catch (err) {
      console.error('ANAF error:', err)
      setCuiError('Eroare la verificarea ANAF')
    } finally {
      setLoadingANAF(false)
    }
  }

  // ========== CAEN SEARCH ==========

  useEffect(() => {
    if (caenSearch.length < 2) {
      setCaenSuggestions([])
      return
    }

    const searchLower = caenSearch.toLowerCase()
    const filtered = activitiesData.activities.filter((activity) => {
      const nameMatch = activity.name.toLowerCase().includes(searchLower)
      const synonymMatch = activity.synonyms.some((syn) =>
        syn.toLowerCase().includes(searchLower)
      )
      const caenMatch = activity.caen.includes(searchLower)
      return nameMatch || synonymMatch || caenMatch
    })

    setCaenSuggestions(filtered.slice(0, 8))
    setShowCaenSuggestions(true)
  }, [caenSearch])

  const handleSelectActivity = (activity: Activity) => {
    setSelectedActivity(activity)
    setCaenSearch(activity.name)
    setShowCaenSuggestions(false)
    setFormData((prev) => ({
      ...prev,
      caen: activity.caen,
      caenName: activity.name,
    }))
  }

  // ========== FORM HANDLERS ==========

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === 'cui') {
      setCuiError('')
      setAnafFound(false)
    }
  }

  // ========== SUBMIT ==========

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validation
      if (!formData.cui || !formData.name || !formData.caen) {
        throw new Error('Completează toate câmpurile obligatorii')
      }

      if (cuiError) {
        throw new Error('Corectează erorile de validare înainte de salvare')
      }

      // 1. Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.name,
          cui: formData.cui,
          address: formData.address || null,
          county: formData.county || null,
          contact_email: formData.contactEmail || null,
          contact_phone: formData.contactPhone || null,
          employee_count: getEmployeeCountFromRange(formData.employeeCountRange),
          data_completeness: 75,
          exposure_score: 'necalculat',
          preferred_channels: ['email'],
          cooperation_status: 'active',
        })
        .select()
        .single()

      if (orgError) throw orgError

      const organizationId = org.id

      // 2. Create membership (admin role)
      const { error: membershipError } = await supabase
        .from('memberships')
        .insert({
          user_id: userId,
          organization_id: organizationId,
          role: 'firma_admin',
          is_active: true,
        })

      if (membershipError) throw membershipError

      // 3. Create default departments based on CAEN category
      const departments = getDefaultDepartments(selectedActivity?.category || 'other')

      const { error: deptError } = await supabase.from('employees').insert(
        departments.map((dept) => ({
          organization_id: organizationId,
          full_name: `Departament: ${dept}`,
          cnp_hash: `dept_${dept.toLowerCase().replace(/\s/g, '_')}`,
          job_title: 'Department',
          department: dept,
          employment_start_date: new Date().toISOString().split('T')[0],
          employment_type: 'full_time',
          cor_code: '0000',
          is_active: true,
        }))
      )

      // Note: Department creation might fail if employees table doesn't allow it
      // This is just a placeholder for the structure
      if (deptError) {
        console.warn('Could not create departments:', deptError)
      }

      setSuccess(true)

      // Redirect after success
      setTimeout(() => {
        onSuccess?.(organizationId)
      }, 1500)
    } catch (err: any) {
      console.error('Submit error:', err)
      setError(err.message || 'Eroare la salvarea organizației')
    } finally {
      setLoading(false)
    }
  }

  // ========== HELPERS ==========

  function getEmployeeCountFromRange(range: string): number {
    const map: Record<string, number> = {
      '1-9': 5,
      '10-49': 25,
      '50-249': 150,
      '250+': 300,
    }
    return map[range] || 5
  }

  function getDefaultDepartments(category: string): string[] {
    return DEFAULT_DEPARTMENTS_BY_CATEGORY[category] || DEFAULT_DEPARTMENTS_BY_CATEGORY.other
  }

  // ========== RENDER ==========

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-green-600/10 border border-green-600/30 rounded-2xl p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            Organizație creată cu succes!
          </h3>
          <p className="text-gray-400">Redirecționare către dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                Setup Organizație Nouă
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Completează datele firmei pentru a începe
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-400">{error}</div>
            </div>
          )}

          {/* CUI Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              CUI (Cod Unic de Identificare) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="cui"
                value={formData.cui}
                onChange={handleInputChange}
                onBlur={handleCUIBlur}
                placeholder="Ex: 12345678 sau RO12345678"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {loadingANAF && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
              )}
              {anafFound && !loadingANAF && (
                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
            </div>
            {cuiError && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {cuiError}
              </p>
            )}
            {anafFound && !cuiError && (
              <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Firmă găsită în registrul ANAF - câmpurile au fost completate automat
              </p>
            )}
          </div>

          {/* Organization Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Denumire Firmă <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ex: BUILD MAX CONSTRUCT SRL"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Adresa Sediu
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Ex: Str. Constructorilor nr. 45"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* County and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Județ
              </label>
              <select
                name="county"
                value={formData.county}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selectează județul</option>
                {RO_COUNTIES.map((county) => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Localitate
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Ex: București"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* CAEN Search */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              CAEN Principal <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={caenSearch}
                onChange={(e) => setCaenSearch(e.target.value)}
                onFocus={() => caenSearch.length >= 2 && setShowCaenSuggestions(true)}
                placeholder="Caută activitatea principală (ex: construcții, restaurant...)"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* CAEN Suggestions */}
            {showCaenSuggestions && caenSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                {caenSuggestions.map((activity) => (
                  <button
                    key={activity.id}
                    type="button"
                    onClick={() => handleSelectActivity(activity)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
                  >
                    <div className="font-semibold text-white">{activity.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      CAEN {activity.caen}
                      {activity.synonyms.length > 0 && (
                        <span className="ml-2">• {activity.synonyms.slice(0, 3).join(', ')}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Selected CAEN */}
            {selectedActivity && (
              <div className="mt-3 bg-blue-600/20 border border-blue-500/30 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{selectedActivity.name}</div>
                    <div className="text-xs text-gray-400">CAEN {selectedActivity.caen}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedActivity(null)
                      setCaenSearch('')
                      setFormData((prev) => ({ ...prev, caen: '', caenName: '' }))
                    }}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Schimbă
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Employee Count Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Număr Angajați
            </label>
            <select
              name="employeeCountRange"
              value={formData.employeeCountRange}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {EMPLOYEE_COUNT_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Persoană Contact
            </label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              placeholder="Ex: Ion Popescu"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contact Phone and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Telefon Contact
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="Ex: 0723456789"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email Contact
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="contact@firma.ro"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-800">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                disabled={loading}
              >
                Anulează
              </button>
            )}

            <button
              type="submit"
              disabled={loading || !formData.cui || !formData.name || !formData.caen}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Se salvează...
                </>
              ) : (
                <>
                  Creează Organizația
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
