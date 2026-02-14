// components/forms/RiskAssessmentForm.tsx
// Formular evaluare riscuri per loc de muncă
// Include: selectare loc muncă/departament, adăugare pericole (din chemical-hazards sau custom)
// Per pericol: probabilitate 1-5, severitate 1-5, auto-calc nivel risc, măsuri control, risc rezidual
// Tabel summary cu toate pericolele și niveluri risc

'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { CHEMICAL_HAZARDS, ChemicalHazard } from '@/lib/data/chemical-hazards'
import {
  AlertTriangle,
  MapPin,
  Building2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Activity,
  FileText,
  Save,
  X,
} from 'lucide-react'

// ========== TYPES ==========

interface Location {
  id: string
  name: string
  address: string | null
  organization_id: string
}

interface Organization {
  id: string
  name: string
}

interface Hazard {
  id: string // Temporary ID for form management
  hazard_name: string
  hazard_description: string
  hazard_source: 'chemical' | 'physical' | 'ergonomic' | 'psychosocial' | 'biological' | 'custom'
  chemical_id: string | null
  probability: number
  severity: number
  risk_level: number
  control_measures: string
  residual_probability: number | null
  residual_severity: number | null
  residual_risk_level: number | null
}

interface Props {
  locations: Location[]
  organizations: Organization[]
  onSuccess?: () => void
  onCancel?: () => void
  editingId?: string | null
  initialData?: any
}

// ========== CONSTANTS ==========

const HAZARD_SOURCES = [
  { value: 'chemical', label: 'Chimic', icon: '🧪', color: 'purple' },
  { value: 'physical', label: 'Fizic', icon: '⚡', color: 'blue' },
  { value: 'ergonomic', label: 'Ergonomic', icon: '🪑', color: 'orange' },
  { value: 'psychosocial', label: 'Psihosocial', icon: '🧠', color: 'pink' },
  { value: 'biological', label: 'Biologic', icon: '🦠', color: 'green' },
  { value: 'custom', label: 'Personalizat', icon: '✏️', color: 'gray' },
] as const

const PHYSICAL_HAZARDS = [
  'Zgomot',
  'Vibrații',
  'Temperatură extremă (căldură)',
  'Temperatură extremă (frig)',
  'Radiații ionizante',
  'Radiații neionizante (UV, IR)',
  'Iluminat inadecvat',
  'Electricitate',
  'Presiune atmosferică anormală',
  'Suprafețe fierbinți/reci',
]

const ERGONOMIC_HAZARDS = [
  'Mișcări repetitive',
  'Manipulare manuală sarcini',
  'Poziții inconfortabile',
  'Efort fizic susținut',
  'Poziție statică prelungită',
  'Ecran calculator prelungit',
  'Design inadecvat loc de muncă',
]

const PSYCHOSOCIAL_HAZARDS = [
  'Stres legat de muncă',
  'Hărțuire/bullying',
  'Violență la locul de muncă',
  'Program de lucru excesiv',
  'Muncă în ture de noapte',
  'Lipsă control asupra sarcinilor',
  'Cerințe conflictuale',
  'Izolare socială',
]

const BIOLOGICAL_HAZARDS = [
  'Bacterii',
  'Virusuri',
  'Fungi/mucegaiuri',
  'Paraziți',
  'Expunere sânge/fluide corporale',
  'Deșeuri biologice',
  'Animale vii/mușcături',
]

const ASSESSMENT_STATUS = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'approved', label: 'Aprobat', color: 'green' },
  { value: 'archived', label: 'Arhivat', color: 'slate' },
]

// ========== HELPER FUNCTIONS ==========

function calculateRiskLevel(probability: number, severity: number): number {
  return probability * severity
}

function getRiskColor(riskLevel: number): string {
  if (riskLevel >= 20) return 'red' // Critical (20-25)
  if (riskLevel >= 15) return 'orange' // High (15-19)
  if (riskLevel >= 10) return 'yellow' // Medium (10-14)
  if (riskLevel >= 5) return 'blue' // Low (5-9)
  return 'green' // Minimal (1-4)
}

function getRiskLabel(riskLevel: number): string {
  if (riskLevel >= 20) return 'CRITIC'
  if (riskLevel >= 15) return 'RIDICAT'
  if (riskLevel >= 10) return 'MEDIU'
  if (riskLevel >= 5) return 'SCĂZUT'
  return 'MINIMAL'
}

// ========== COMPONENT ==========

export default function RiskAssessmentForm({
  locations,
  organizations,
  onSuccess,
  onCancel,
  editingId,
  initialData,
}: Props) {
  const supabase = createSupabaseBrowser()

  // ========== STATE ==========

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    organization_id: '',
    workplace_name: '',
    department: '',
    assessment_date: new Date().toISOString().split('T')[0],
    review_date: '',
    status: 'draft',
    notes: '',
  })

  const [hazards, setHazards] = useState<Hazard[]>([])
  const [showAddHazard, setShowAddHazard] = useState(false)
  const [currentHazard, setCurrentHazard] = useState<Partial<Hazard>>({
    hazard_source: 'physical',
    probability: 3,
    severity: 3,
    residual_probability: null,
    residual_severity: null,
  })

  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  // ========== EFFECTS ==========

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        organization_id: initialData.organization_id || '',
        workplace_name: initialData.workplace_name || '',
        department: initialData.department || '',
        assessment_date: initialData.assessment_date || new Date().toISOString().split('T')[0],
        review_date: initialData.review_date || '',
        status: initialData.status || 'draft',
        notes: initialData.notes || '',
      })
      // Load hazards if editing
      if (editingId) {
        loadHazards(editingId)
      }
    }
  }, [initialData, editingId])

  // Auto-fill workplace name when location is selected
  useEffect(() => {
    if (selectedLocation) {
      const location = locations.find((l) => l.id === selectedLocation)
      if (location) {
        setFormData((prev) => ({
          ...prev,
          workplace_name: location.name,
          organization_id: location.organization_id,
        }))
      }
    }
  }, [selectedLocation, locations])

  // Auto-calculate review date (1 year from assessment date)
  useEffect(() => {
    if (formData.assessment_date) {
      const assessmentDate = new Date(formData.assessment_date)
      assessmentDate.setFullYear(assessmentDate.getFullYear() + 1)
      setFormData((prev) => ({
        ...prev,
        review_date: assessmentDate.toISOString().split('T')[0],
      }))
    }
  }, [formData.assessment_date])

  // ========== HANDLERS ==========

  const loadHazards = async (assessmentId: string) => {
    try {
      const { data, error } = await supabase
        .from('risk_assessment_hazards')
        .select('*')
        .eq('risk_assessment_id', assessmentId)

      if (error) throw error

      if (data) {
        const loadedHazards: Hazard[] = data.map((h) => ({
          id: h.id,
          hazard_name: h.hazard_name,
          hazard_description: h.hazard_description || '',
          hazard_source: h.hazard_source,
          chemical_id: h.chemical_id,
          probability: h.probability,
          severity: h.severity,
          risk_level: h.risk_level,
          control_measures: h.control_measures || '',
          residual_probability: h.residual_probability,
          residual_severity: h.residual_severity,
          residual_risk_level: h.residual_risk_level,
        }))
        setHazards(loadedHazards)
      }
    } catch (err: any) {
      console.error('Error loading hazards:', err)
      setError('Eroare la încărcarea pericolelor: ' + err.message)
    }
  }

  const handleAddHazardClick = () => {
    setShowAddHazard(true)
    setCurrentHazard({
      hazard_source: 'physical',
      probability: 3,
      severity: 3,
      residual_probability: null,
      residual_severity: null,
      hazard_name: '',
      hazard_description: '',
      chemical_id: null,
      control_measures: '',
    })
  }

  const handleSelectChemical = (chemical: ChemicalHazard) => {
    setCurrentHazard((prev) => ({
      ...prev,
      hazard_source: 'chemical',
      hazard_name: chemical.nameRo,
      hazard_description: `CAS: ${chemical.casNumber} - ${chemical.hazardStatements.join(', ')}`,
      chemical_id: chemical.id,
    }))
    setSearchTerm('')
  }

  const handleSelectPredefinedHazard = (name: string, source: Hazard['hazard_source']) => {
    setCurrentHazard((prev) => ({
      ...prev,
      hazard_source: source,
      hazard_name: name,
      hazard_description: '',
      chemical_id: null,
    }))
  }

  const handleAddHazard = () => {
    if (!currentHazard.hazard_name || !currentHazard.hazard_name.trim()) {
      setError('Nume pericol este obligatoriu')
      return
    }

    const newHazard: Hazard = {
      id: `temp-${Date.now()}`, // Temporary ID
      hazard_name: currentHazard.hazard_name,
      hazard_description: currentHazard.hazard_description || '',
      hazard_source: currentHazard.hazard_source as Hazard['hazard_source'],
      chemical_id: currentHazard.chemical_id || null,
      probability: currentHazard.probability || 3,
      severity: currentHazard.severity || 3,
      risk_level: calculateRiskLevel(
        currentHazard.probability || 3,
        currentHazard.severity || 3
      ),
      control_measures: currentHazard.control_measures || '',
      residual_probability: currentHazard.residual_probability || null,
      residual_severity: currentHazard.residual_severity || null,
      residual_risk_level:
        currentHazard.residual_probability && currentHazard.residual_severity
          ? calculateRiskLevel(
              currentHazard.residual_probability,
              currentHazard.residual_severity
            )
          : null,
    }

    setHazards((prev) => [...prev, newHazard])
    setShowAddHazard(false)
    setError(null)
  }

  const handleRemoveHazard = (hazardId: string) => {
    setHazards((prev) => prev.filter((h) => h.id !== hazardId))
  }

  const handleUpdateHazard = (hazardId: string, updates: Partial<Hazard>) => {
    setHazards((prev) =>
      prev.map((h) => {
        if (h.id !== hazardId) return h

        const updatedHazard = { ...h, ...updates }

        // Recalculate risk levels
        if (updates.probability !== undefined || updates.severity !== undefined) {
          updatedHazard.risk_level = calculateRiskLevel(
            updatedHazard.probability,
            updatedHazard.severity
          )
        }

        if (
          updates.residual_probability !== undefined ||
          updates.residual_severity !== undefined
        ) {
          updatedHazard.residual_risk_level =
            updatedHazard.residual_probability && updatedHazard.residual_severity
              ? calculateRiskLevel(
                  updatedHazard.residual_probability,
                  updatedHazard.residual_severity
                )
              : null
        }

        return updatedHazard
      })
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validation
      if (!formData.organization_id) {
        throw new Error('Organizația este obligatorie')
      }
      if (!formData.workplace_name.trim()) {
        throw new Error('Locul de muncă este obligatoriu')
      }
      if (hazards.length === 0) {
        throw new Error('Adăugați cel puțin un pericol')
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Utilizator neautentificat')

      if (editingId) {
        // UPDATE existing risk assessment
        const { error: updateError } = await supabase
          .from('risk_assessments')
          .update({
            workplace_name: formData.workplace_name,
            department: formData.department || null,
            assessment_date: formData.assessment_date,
            review_date: formData.review_date || null,
            status: formData.status,
            notes: formData.notes || null,
          })
          .eq('id', editingId)

        if (updateError) throw updateError

        // Delete existing hazards and insert new ones
        const { error: deleteError } = await supabase
          .from('risk_assessment_hazards')
          .delete()
          .eq('risk_assessment_id', editingId)

        if (deleteError) throw deleteError

        // Insert updated hazards
        const hazardsToInsert = hazards.map((h) => ({
          risk_assessment_id: editingId,
          hazard_name: h.hazard_name,
          hazard_description: h.hazard_description || null,
          hazard_source: h.hazard_source,
          chemical_id: h.chemical_id,
          probability: h.probability,
          severity: h.severity,
          control_measures: h.control_measures || null,
          residual_probability: h.residual_probability,
          residual_severity: h.residual_severity,
        }))

        const { error: hazardsError } = await supabase
          .from('risk_assessment_hazards')
          .insert(hazardsToInsert)

        if (hazardsError) throw hazardsError
      } else {
        // INSERT new risk assessment
        const { data: newAssessment, error: insertError } = await supabase
          .from('risk_assessments')
          .insert({
            organization_id: formData.organization_id,
            workplace_name: formData.workplace_name,
            department: formData.department || null,
            assessed_by: user.id,
            assessment_date: formData.assessment_date,
            review_date: formData.review_date || null,
            status: formData.status,
            notes: formData.notes || null,
          })
          .select()
          .single()

        if (insertError) throw insertError
        if (!newAssessment) throw new Error('Eroare la crearea evaluării')

        // Insert hazards
        const hazardsToInsert = hazards.map((h) => ({
          risk_assessment_id: newAssessment.id,
          hazard_name: h.hazard_name,
          hazard_description: h.hazard_description || null,
          hazard_source: h.hazard_source,
          chemical_id: h.chemical_id,
          probability: h.probability,
          severity: h.severity,
          control_measures: h.control_measures || null,
          residual_probability: h.residual_probability,
          residual_severity: h.residual_severity,
        }))

        const { error: hazardsError } = await supabase
          .from('risk_assessment_hazards')
          .insert(hazardsToInsert)

        if (hazardsError) throw hazardsError
      }

      setSuccess(true)
      setTimeout(() => {
        if (onSuccess) onSuccess()
      }, 1500)
    } catch (err: any) {
      console.error('Error saving risk assessment:', err)
      setError(err.message || 'Eroare la salvarea evaluării de risc')
    } finally {
      setLoading(false)
    }
  }

  // ========== RENDER HELPERS ==========

  const filteredChemicals = searchTerm.trim()
    ? CHEMICAL_HAZARDS.filter(
        (c) =>
          c.nameRo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.casNumber.includes(searchTerm)
      )
    : []

  const getPredefinedHazards = (source: string) => {
    switch (source) {
      case 'physical':
        return PHYSICAL_HAZARDS
      case 'ergonomic':
        return ERGONOMIC_HAZARDS
      case 'psychosocial':
        return PSYCHOSOCIAL_HAZARDS
      case 'biological':
        return BIOLOGICAL_HAZARDS
      default:
        return []
    }
  }

  const criticalHazards = hazards.filter((h) => h.risk_level >= 20)
  const highHazards = hazards.filter((h) => h.risk_level >= 15 && h.risk_level < 20)
  const mediumHazards = hazards.filter((h) => h.risk_level >= 10 && h.risk_level < 15)
  const lowHazards = hazards.filter((h) => h.risk_level < 10)

  // ========== RENDER ==========

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingId ? 'Editare Evaluare Riscuri' : 'Evaluare Riscuri Noi'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Identificare pericole și evaluare nivel risc per loc de muncă
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Eroare</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-sm font-medium text-green-900">
            Evaluare de risc salvată cu succes!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Informații Generale
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selectare Locație (opțional)
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">-- Selectează locație --</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                    {location.address ? ` - ${location.address}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Organization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organizație <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.organization_id}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, organization_id: e.target.value }))
                }
                disabled={!!selectedLocation}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
              >
                <option value="">-- Selectează organizație --</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Workplace Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loc de Muncă <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.workplace_name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, workplace_name: e.target.value }))
                }
                placeholder="ex: Atelier Mecanic, Birou Contabilitate"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departament
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, department: e.target.value }))
                }
                placeholder="ex: Producție, Administrație"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Assessment Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Evaluării <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.assessment_date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, assessment_date: e.target.value }))
                }
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Review Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Revizuire
              </label>
              <input
                type="date"
                value={formData.review_date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, review_date: e.target.value }))
                }
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex gap-3">
                {ASSESSMENT_STATUS.map((status) => (
                  <label
                    key={status.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status.value}
                      checked={formData.status === status.value}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, status: e.target.value }))
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hazards Section */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Pericole Identificate ({hazards.length})
            </h3>
            <button
              type="button"
              onClick={handleAddHazardClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Adaugă Pericol
            </button>
          </div>

          {/* Add Hazard Form */}
          {showAddHazard && (
            <div className="bg-white rounded-xl p-6 border-2 border-blue-200 space-y-4">
              <h4 className="font-semibold text-gray-900">Adaugă Pericol Nou</h4>

              {/* Hazard Source Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tip Pericol
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {HAZARD_SOURCES.map((source) => (
                    <button
                      key={source.value}
                      type="button"
                      onClick={() =>
                        setCurrentHazard((prev) => ({
                          ...prev,
                          hazard_source: source.value,
                          hazard_name: '',
                          hazard_description: '',
                          chemical_id: null,
                        }))
                      }
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        currentHazard.hazard_source === source.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{source.icon}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {source.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chemical Hazard Search */}
              {currentHazard.hazard_source === 'chemical' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Căutare Substanță Chimică
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Caută după nume sau CAS..."
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {filteredChemicals.length > 0 && (
                    <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-xl bg-white">
                      {filteredChemicals.map((chemical) => (
                        <button
                          key={chemical.id}
                          type="button"
                          onClick={() => handleSelectChemical(chemical)}
                          className="w-full p-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{chemical.nameRo}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            CAS: {chemical.casNumber}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Predefined Hazards */}
              {currentHazard.hazard_source &&
                currentHazard.hazard_source !== 'chemical' &&
                currentHazard.hazard_source !== 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pericole Predefinite
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {getPredefinedHazards(currentHazard.hazard_source).map((hazard) => (
                        <button
                          key={hazard}
                          type="button"
                          onClick={() =>
                            handleSelectPredefinedHazard(
                              hazard,
                              currentHazard.hazard_source as Hazard['hazard_source']
                            )
                          }
                          className={`p-2 rounded-lg border text-left text-sm transition-all ${
                            currentHazard.hazard_name === hazard
                              ? 'border-blue-500 bg-blue-50 text-blue-900'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          {hazard}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Hazard Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nume Pericol <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={currentHazard.hazard_name || ''}
                  onChange={(e) =>
                    setCurrentHazard((prev) => ({ ...prev, hazard_name: e.target.value }))
                  }
                  placeholder="Denumire pericol"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Hazard Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descriere Pericol
                </label>
                <textarea
                  value={currentHazard.hazard_description || ''}
                  onChange={(e) =>
                    setCurrentHazard((prev) => ({
                      ...prev,
                      hazard_description: e.target.value,
                    }))
                  }
                  rows={2}
                  placeholder="Detalii suplimentare despre pericol"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Probability and Severity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Probabilitate (1-5)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={currentHazard.probability || 3}
                    onChange={(e) =>
                      setCurrentHazard((prev) => ({
                        ...prev,
                        probability: parseInt(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Rar (1)</span>
                    <span className="font-semibold text-blue-600 text-base">
                      {currentHazard.probability || 3}
                    </span>
                    <span>Foarte probabil (5)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severitate (1-5)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={currentHazard.severity || 3}
                    onChange={(e) =>
                      setCurrentHazard((prev) => ({
                        ...prev,
                        severity: parseInt(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Minoră (1)</span>
                    <span className="font-semibold text-orange-600 text-base">
                      {currentHazard.severity || 3}
                    </span>
                    <span>Catastrofală (5)</span>
                  </div>
                </div>
              </div>

              {/* Initial Risk Level Display */}
              <div className="bg-gray-100 rounded-xl p-4">
                <div className="text-sm text-gray-700 mb-2">Nivel Risc Inițial:</div>
                <div className="flex items-center gap-3">
                  <div
                    className={`px-4 py-2 rounded-lg font-bold text-white ${
                      getRiskColor(
                        calculateRiskLevel(
                          currentHazard.probability || 3,
                          currentHazard.severity || 3
                        )
                      ) === 'red'
                        ? 'bg-red-600'
                        : getRiskColor(
                            calculateRiskLevel(
                              currentHazard.probability || 3,
                              currentHazard.severity || 3
                            )
                          ) === 'orange'
                        ? 'bg-orange-600'
                        : getRiskColor(
                            calculateRiskLevel(
                              currentHazard.probability || 3,
                              currentHazard.severity || 3
                            )
                          ) === 'yellow'
                        ? 'bg-yellow-600'
                        : getRiskColor(
                            calculateRiskLevel(
                              currentHazard.probability || 3,
                              currentHazard.severity || 3
                            )
                          ) === 'blue'
                        ? 'bg-blue-600'
                        : 'bg-green-600'
                    }`}
                  >
                    {calculateRiskLevel(
                      currentHazard.probability || 3,
                      currentHazard.severity || 3
                    )}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {getRiskLabel(
                      calculateRiskLevel(
                        currentHazard.probability || 3,
                        currentHazard.severity || 3
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Control Measures */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Măsuri de Control
                </label>
                <textarea
                  value={currentHazard.control_measures || ''}
                  onChange={(e) =>
                    setCurrentHazard((prev) => ({
                      ...prev,
                      control_measures: e.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="Descrieți măsurile de control implementate sau planificate..."
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Residual Risk */}
              <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                <h5 className="font-semibold text-gray-900">Risc Rezidual (după măsuri)</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Probabilitate Reziduală
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={currentHazard.residual_probability || 1}
                      onChange={(e) =>
                        setCurrentHazard((prev) => ({
                          ...prev,
                          residual_probability: parseInt(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                    <div className="text-center text-sm font-semibold text-blue-600 mt-1">
                      {currentHazard.residual_probability || '-'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severitate Reziduală
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={currentHazard.residual_severity || 1}
                      onChange={(e) =>
                        setCurrentHazard((prev) => ({
                          ...prev,
                          residual_severity: parseInt(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                    <div className="text-center text-sm font-semibold text-orange-600 mt-1">
                      {currentHazard.residual_severity || '-'}
                    </div>
                  </div>
                </div>

                {currentHazard.residual_probability && currentHazard.residual_severity && (
                  <div className="flex items-center gap-3 mt-3">
                    <div className="text-sm text-gray-700">Nivel Risc Rezidual:</div>
                    <div
                      className={`px-4 py-2 rounded-lg font-bold text-white ${
                        getRiskColor(
                          calculateRiskLevel(
                            currentHazard.residual_probability,
                            currentHazard.residual_severity
                          )
                        ) === 'red'
                          ? 'bg-red-600'
                          : getRiskColor(
                              calculateRiskLevel(
                                currentHazard.residual_probability,
                                currentHazard.residual_severity
                              )
                            ) === 'orange'
                          ? 'bg-orange-600'
                          : getRiskColor(
                              calculateRiskLevel(
                                currentHazard.residual_probability,
                                currentHazard.residual_severity
                              )
                            ) === 'yellow'
                          ? 'bg-yellow-600'
                          : getRiskColor(
                              calculateRiskLevel(
                                currentHazard.residual_probability,
                                currentHazard.residual_severity
                              )
                            ) === 'blue'
                          ? 'bg-blue-600'
                          : 'bg-green-600'
                      }`}
                    >
                      {calculateRiskLevel(
                        currentHazard.residual_probability,
                        currentHazard.residual_severity
                      )}
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {getRiskLabel(
                        calculateRiskLevel(
                          currentHazard.residual_probability,
                          currentHazard.residual_severity
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddHazard}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  Adaugă Pericol
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddHazard(false)}
                  className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                >
                  Anulează
                </button>
              </div>
            </div>
          )}

          {/* Hazards List */}
          {hazards.length > 0 && (
            <div className="space-y-3">
              {hazards.map((hazard) => (
                <div
                  key={hazard.id}
                  className="bg-white rounded-xl p-4 border border-gray-200 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">
                          {HAZARD_SOURCES.find((s) => s.value === hazard.hazard_source)
                            ?.icon || '⚠️'}
                        </span>
                        <h4 className="font-semibold text-gray-900">{hazard.hazard_name}</h4>
                      </div>
                      {hazard.hazard_description && (
                        <p className="text-sm text-gray-600 ml-8">
                          {hazard.hazard_description}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveHazard(hazard.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Șterge pericol"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Probability */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Probabilitate
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={hazard.probability}
                        onChange={(e) =>
                          handleUpdateHazard(hazard.id, {
                            probability: parseInt(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                      <div className="text-center text-sm font-semibold text-blue-600">
                        {hazard.probability}
                      </div>
                    </div>

                    {/* Severity */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Severitate
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={hazard.severity}
                        onChange={(e) =>
                          handleUpdateHazard(hazard.id, {
                            severity: parseInt(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                      <div className="text-center text-sm font-semibold text-orange-600">
                        {hazard.severity}
                      </div>
                    </div>

                    {/* Risk Level */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Nivel Risc
                      </label>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <div
                          className={`px-3 py-1.5 rounded-lg font-bold text-white ${
                            getRiskColor(hazard.risk_level) === 'red'
                              ? 'bg-red-600'
                              : getRiskColor(hazard.risk_level) === 'orange'
                              ? 'bg-orange-600'
                              : getRiskColor(hazard.risk_level) === 'yellow'
                              ? 'bg-yellow-600'
                              : getRiskColor(hazard.risk_level) === 'blue'
                              ? 'bg-blue-600'
                              : 'bg-green-600'
                          }`}
                        >
                          {hazard.risk_level}
                        </div>
                        <div className="text-sm font-semibold text-gray-700">
                          {getRiskLabel(hazard.risk_level)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Control Measures */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Măsuri de Control
                    </label>
                    <textarea
                      value={hazard.control_measures}
                      onChange={(e) =>
                        handleUpdateHazard(hazard.id, {
                          control_measures: e.target.value,
                        })
                      }
                      rows={2}
                      placeholder="Măsuri de control..."
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Residual Risk */}
                  <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                    <h6 className="text-xs font-semibold text-gray-700">Risc Rezidual</h6>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Prob. Reziduală
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={hazard.residual_probability || ''}
                          onChange={(e) =>
                            handleUpdateHazard(hazard.id, {
                              residual_probability: e.target.value
                                ? parseInt(e.target.value)
                                : null,
                            })
                          }
                          placeholder="1-5"
                          className="w-full px-2 py-1 text-sm bg-white border border-gray-200 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Sev. Reziduală
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={hazard.residual_severity || ''}
                          onChange={(e) =>
                            handleUpdateHazard(hazard.id, {
                              residual_severity: e.target.value
                                ? parseInt(e.target.value)
                                : null,
                            })
                          }
                          placeholder="1-5"
                          className="w-full px-2 py-1 text-sm bg-white border border-gray-200 rounded"
                        />
                      </div>
                      {hazard.residual_risk_level && (
                        <div className="flex items-center gap-2">
                          <div
                            className={`px-2 py-1 rounded font-bold text-sm text-white ${
                              getRiskColor(hazard.residual_risk_level) === 'red'
                                ? 'bg-red-600'
                                : getRiskColor(hazard.residual_risk_level) === 'orange'
                                ? 'bg-orange-600'
                                : getRiskColor(hazard.residual_risk_level) === 'yellow'
                                ? 'bg-yellow-600'
                                : getRiskColor(hazard.residual_risk_level) === 'blue'
                                ? 'bg-blue-600'
                                : 'bg-green-600'
                            }`}
                          >
                            {hazard.residual_risk_level}
                          </div>
                          <div className="text-xs font-semibold text-gray-700">
                            {getRiskLabel(hazard.residual_risk_level)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Risk Summary Table */}
        {hazards.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Sumar Evaluare Riscuri
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-red-200">
                <div className="text-2xl font-bold text-red-600">
                  {criticalHazards.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Risc CRITIC (≥20)</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">{highHazards.length}</div>
                <div className="text-sm text-gray-600 mt-1">Risc RIDICAT (15-19)</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">
                  {mediumHazards.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Risc MEDIU (10-14)</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{lowHazards.length}</div>
                <div className="text-sm text-gray-600 mt-1">Risc SCĂZUT (&lt;10)</div>
              </div>
            </div>

            {/* Priority Actions */}
            {criticalHazards.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900">Acțiuni Prioritare Necesare</p>
                    <p className="text-sm text-red-700 mt-1">
                      {criticalHazards.length} pericol(e) cu risc CRITIC identificat(e). Măsuri
                      de control imediate obligatorii!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observații Generale
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            rows={3}
            placeholder="Notițe, observații sau recomandări suplimentare..."
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading || success}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvare...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {editingId ? 'Actualizare Evaluare' : 'Salvare Evaluare'}
              </>
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Anulare
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
