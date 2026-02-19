// components/forms/PreventionPlanForm.tsx
// Plan de Prevenire și Protecție
// Auto-populate din risk assessment results
// Per risc: măsură tehnică, organizatorică, igienico-sanitară, responsabil, termen, resurse
// Tabel editabil cu Export PDF

'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import {
  Shield,
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  FileDown,
  User,
  Target,
  ClipboardList,
  Wrench,
  Users,
  Heart,
  Clock,
  DollarSign,
} from 'lucide-react'

// ========== TYPES ==========

interface Organization {
  id: string
  name: string
}

interface RiskAssessment {
  id: string
  workplace_name: string
  department: string | null
  assessment_date: string
  organization_id: string
}

interface PreventionMeasure {
  id: string // Temporary ID for form management
  risk_assessment_hazard_id: string | null
  risk_name: string
  risk_level: number | null
  risk_level_label: string
  technical_measure: string
  organizational_measure: string
  hygiene_measure: string
  responsible_person: string
  responsible_title: string
  deadline: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  resources_needed: string
  estimated_cost: string
  implementation_status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'cancelled'
  completion_date: string
  completion_notes: string
  display_order: number
}

interface Props {
  organizations: Organization[]
  onSuccess?: () => void
  onCancel?: () => void
  editingId?: string | null
  initialData?: any
}

// ========== CONSTANTS ==========

const PRIORITY_OPTIONS = [
  { value: 'urgent', label: 'Urgent', color: 'red', icon: '🔴' },
  { value: 'high', label: 'Ridicat', color: 'orange', icon: '🟠' },
  { value: 'medium', label: 'Mediu', color: 'yellow', icon: '🟡' },
  { value: 'low', label: 'Scăzut', color: 'green', icon: '🟢' },
] as const

const STATUS_OPTIONS = [
  { value: 'pending', label: 'În așteptare', color: 'gray' },
  { value: 'in_progress', label: 'În curs', color: 'blue' },
  { value: 'completed', label: 'Finalizat', color: 'green' },
  { value: 'delayed', label: 'Întârziat', color: 'orange' },
  { value: 'cancelled', label: 'Anulat', color: 'red' },
] as const

const PLAN_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'approved', label: 'Aprobat', color: 'green' },
  { value: 'active', label: 'Activ', color: 'blue' },
  { value: 'archived', label: 'Arhivat', color: 'slate' },
] as const

// ========== HELPER FUNCTIONS ==========

function getRiskLevelLabel(riskLevel: number): string {
  if (riskLevel >= 20) return 'CRITIC'
  if (riskLevel >= 15) return 'RIDICAT'
  if (riskLevel >= 10) return 'MEDIU'
  if (riskLevel >= 5) return 'SCĂZUT'
  return 'MINIMAL'
}

function getRiskColor(riskLevel: number): string {
  if (riskLevel >= 20) return 'red'
  if (riskLevel >= 15) return 'orange'
  if (riskLevel >= 10) return 'yellow'
  if (riskLevel >= 5) return 'blue'
  return 'green'
}

function getDefaultPriority(riskLevel: number): 'urgent' | 'high' | 'medium' | 'low' {
  if (riskLevel >= 20) return 'urgent'
  if (riskLevel >= 15) return 'high'
  if (riskLevel >= 10) return 'medium'
  return 'low'
}

// ========== COMPONENT ==========

export default function PreventionPlanForm({
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
  const [exportingPDF, setExportingPDF] = useState(false)

  const [formData, setFormData] = useState({
    organization_id: '',
    risk_assessment_id: '',
    plan_name: '',
    plan_date: new Date().toISOString().split('T')[0],
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: '',
    approved_by_name: '',
    approved_by_title: '',
    approval_date: '',
    status: 'draft',
    notes: '',
  })

  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([])
  const [measures, setMeasures] = useState<PreventionMeasure[]>([])
  const [_selectedAssessment, setSelectedAssessment] = useState<RiskAssessment | null>(null)

  // ========== EFFECTS ==========

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        organization_id: initialData.organization_id || '',
        risk_assessment_id: initialData.risk_assessment_id || '',
        plan_name: initialData.plan_name || '',
        plan_date: initialData.plan_date || new Date().toISOString().split('T')[0],
        valid_from: initialData.valid_from || new Date().toISOString().split('T')[0],
        valid_until: initialData.valid_until || '',
        approved_by_name: initialData.approved_by_name || '',
        approved_by_title: initialData.approved_by_title || '',
        approval_date: initialData.approval_date || '',
        status: initialData.status || 'draft',
        notes: initialData.notes || '',
      })
      // Load measures if editing
      if (editingId) {
        loadMeasures(editingId)
      }
    }
  }, [initialData, editingId])

  // Load risk assessments when organization is selected
  useEffect(() => {
    if (formData.organization_id) {
      loadRiskAssessments(formData.organization_id)
    }
  }, [formData.organization_id])

  // Auto-calculate valid_until (1 year from valid_from)
  useEffect(() => {
    if (formData.valid_from) {
      const validFrom = new Date(formData.valid_from)
      validFrom.setFullYear(validFrom.getFullYear() + 1)
      setFormData((prev) => ({
        ...prev,
        valid_until: validFrom.toISOString().split('T')[0],
      }))
    }
  }, [formData.valid_from])

  // ========== HANDLERS ==========

  const loadRiskAssessments = async (orgId: string) => {
    try {
      const { data, error } = await supabase
        .from('risk_assessments')
        .select('id, workplace_name, department, assessment_date, organization_id')
        .eq('organization_id', orgId)
        .is('deleted_at', null)
        .order('assessment_date', { ascending: false })

      if (error) throw error
      setRiskAssessments(data || [])
    } catch (err: any) {
      console.error('Error loading risk assessments:', err)
      setError('Eroare la încărcarea evaluărilor de risc: ' + err.message)
    }
  }

  const loadMeasures = async (planId: string) => {
    try {
      const { data, error } = await supabase
        .from('prevention_measures')
        .select('*')
        .eq('prevention_plan_id', planId)
        .order('display_order', { ascending: true })

      if (error) throw error

      if (data) {
        const loadedMeasures: PreventionMeasure[] = data.map((m) => ({
          id: m.id,
          risk_assessment_hazard_id: m.risk_assessment_hazard_id,
          risk_name: m.risk_name,
          risk_level: m.risk_level,
          risk_level_label: m.risk_level_label || '',
          technical_measure: m.technical_measure || '',
          organizational_measure: m.organizational_measure || '',
          hygiene_measure: m.hygiene_measure || '',
          responsible_person: m.responsible_person || '',
          responsible_title: m.responsible_title || '',
          deadline: m.deadline || '',
          priority: m.priority || 'medium',
          resources_needed: m.resources_needed || '',
          estimated_cost: m.estimated_cost || '',
          implementation_status: m.implementation_status || 'pending',
          completion_date: m.completion_date || '',
          completion_notes: m.completion_notes || '',
          display_order: m.display_order || 0,
        }))
        setMeasures(loadedMeasures)
      }
    } catch (err: any) {
      console.error('Error loading measures:', err)
      setError('Eroare la încărcarea măsurilor: ' + err.message)
    }
  }

  const handleLoadFromRiskAssessment = async () => {
    if (!formData.risk_assessment_id) {
      setError('Selectați o evaluare de risc')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Load hazards from selected risk assessment
      const { data: hazards, error: hazardsError } = await supabase
        .from('risk_assessment_hazards')
        .select('*')
        .eq('risk_assessment_id', formData.risk_assessment_id)
        .order('risk_level', { ascending: false })

      if (hazardsError) throw hazardsError

      if (!hazards || hazards.length === 0) {
        setError('Nu există pericole identificate în evaluarea de risc selectată')
        return
      }

      // Convert hazards to prevention measures
      const newMeasures: PreventionMeasure[] = hazards.map((hazard, index) => ({
        id: `temp-${Date.now()}-${index}`,
        risk_assessment_hazard_id: hazard.id,
        risk_name: hazard.hazard_name,
        risk_level: hazard.risk_level,
        risk_level_label: getRiskLevelLabel(hazard.risk_level),
        technical_measure: '',
        organizational_measure: '',
        hygiene_measure: '',
        responsible_person: '',
        responsible_title: '',
        deadline: '',
        priority: getDefaultPriority(hazard.risk_level),
        resources_needed: '',
        estimated_cost: '',
        implementation_status: 'pending',
        completion_date: '',
        completion_notes: '',
        display_order: index,
      }))

      setMeasures(newMeasures)

      // Update plan name with assessment info
      const assessment = riskAssessments.find((a) => a.id === formData.risk_assessment_id)
      if (assessment) {
        setSelectedAssessment(assessment)
        setFormData((prev) => ({
          ...prev,
          plan_name: `Plan Prevenire - ${assessment.workplace_name}${
            assessment.department ? ` - ${assessment.department}` : ''
          }`,
        }))
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Error loading from risk assessment:', err)
      setError('Eroare la încărcarea pericolelor: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMeasure = () => {
    const newMeasure: PreventionMeasure = {
      id: `temp-${Date.now()}`,
      risk_assessment_hazard_id: null,
      risk_name: '',
      risk_level: null,
      risk_level_label: '',
      technical_measure: '',
      organizational_measure: '',
      hygiene_measure: '',
      responsible_person: '',
      responsible_title: '',
      deadline: '',
      priority: 'medium',
      resources_needed: '',
      estimated_cost: '',
      implementation_status: 'pending',
      completion_date: '',
      completion_notes: '',
      display_order: measures.length,
    }
    setMeasures((prev) => [...prev, newMeasure])
  }

  const handleRemoveMeasure = (measureId: string) => {
    setMeasures((prev) => prev.filter((m) => m.id !== measureId))
  }

  const handleUpdateMeasure = (measureId: string, updates: Partial<PreventionMeasure>) => {
    setMeasures((prev) =>
      prev.map((m) => (m.id === measureId ? { ...m, ...updates } : m))
    )
  }

  const handleExportPDF = async () => {
    setExportingPDF(true)
    try {
      // TODO: Implement PDF export using jsPDF or similar
      // For now, just show a message
      alert('Export PDF va fi implementat în curând')
    } catch (err: any) {
      console.error('Error exporting PDF:', err)
      setError('Eroare la exportul PDF: ' + err.message)
    } finally {
      setExportingPDF(false)
    }
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
      if (!formData.plan_name.trim()) {
        throw new Error('Numele planului este obligatoriu')
      }
      if (measures.length === 0) {
        throw new Error('Adăugați cel puțin o măsură de prevenire')
      }

      // Check if all measures have risk name
      const emptyRiskNames = measures.filter((m) => !m.risk_name.trim())
      if (emptyRiskNames.length > 0) {
        throw new Error('Toate măsurile trebuie să aibă un nume de risc')
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Utilizator neautentificat')

      if (editingId) {
        // UPDATE existing prevention plan
        const { error: updateError } = await supabase
          .from('prevention_plans')
          .update({
            risk_assessment_id: formData.risk_assessment_id || null,
            plan_name: formData.plan_name,
            plan_date: formData.plan_date,
            valid_from: formData.valid_from,
            valid_until: formData.valid_until || null,
            approved_by_name: formData.approved_by_name || null,
            approved_by_title: formData.approved_by_title || null,
            approval_date: formData.approval_date || null,
            status: formData.status,
            notes: formData.notes || null,
          })
          .eq('id', editingId)

        if (updateError) throw updateError

        // Delete existing measures and insert new ones
        const { error: deleteError } = await supabase
          .from('prevention_measures')
          .delete()
          .eq('prevention_plan_id', editingId)

        if (deleteError) throw deleteError

        // Insert updated measures
        const measuresToInsert = measures.map((m, index) => ({
          prevention_plan_id: editingId,
          risk_assessment_hazard_id: m.risk_assessment_hazard_id,
          risk_name: m.risk_name,
          risk_level: m.risk_level,
          risk_level_label: m.risk_level_label || null,
          technical_measure: m.technical_measure || null,
          organizational_measure: m.organizational_measure || null,
          hygiene_measure: m.hygiene_measure || null,
          responsible_person: m.responsible_person || null,
          responsible_title: m.responsible_title || null,
          deadline: m.deadline || null,
          priority: m.priority,
          resources_needed: m.resources_needed || null,
          estimated_cost: m.estimated_cost ? parseFloat(m.estimated_cost) : null,
          implementation_status: m.implementation_status,
          completion_date: m.completion_date || null,
          completion_notes: m.completion_notes || null,
          display_order: index,
        }))

        const { error: measuresError } = await supabase
          .from('prevention_measures')
          .insert(measuresToInsert)

        if (measuresError) throw measuresError
      } else {
        // INSERT new prevention plan
        const { data: newPlan, error: insertError } = await supabase
          .from('prevention_plans')
          .insert({
            organization_id: formData.organization_id,
            risk_assessment_id: formData.risk_assessment_id || null,
            plan_name: formData.plan_name,
            plan_date: formData.plan_date,
            valid_from: formData.valid_from,
            valid_until: formData.valid_until || null,
            approved_by_name: formData.approved_by_name || null,
            approved_by_title: formData.approved_by_title || null,
            approval_date: formData.approval_date || null,
            status: formData.status,
            notes: formData.notes || null,
          })
          .select()
          .single()

        if (insertError) throw insertError
        if (!newPlan) throw new Error('Eroare la crearea planului')

        // Insert measures
        const measuresToInsert = measures.map((m, index) => ({
          prevention_plan_id: newPlan.id,
          risk_assessment_hazard_id: m.risk_assessment_hazard_id,
          risk_name: m.risk_name,
          risk_level: m.risk_level,
          risk_level_label: m.risk_level_label || null,
          technical_measure: m.technical_measure || null,
          organizational_measure: m.organizational_measure || null,
          hygiene_measure: m.hygiene_measure || null,
          responsible_person: m.responsible_person || null,
          responsible_title: m.responsible_title || null,
          deadline: m.deadline || null,
          priority: m.priority,
          resources_needed: m.resources_needed || null,
          estimated_cost: m.estimated_cost ? parseFloat(m.estimated_cost) : null,
          implementation_status: m.implementation_status,
          completion_date: m.completion_date || null,
          completion_notes: m.completion_notes || null,
          display_order: index,
        }))

        const { error: measuresError } = await supabase
          .from('prevention_measures')
          .insert(measuresToInsert)

        if (measuresError) throw measuresError
      }

      setSuccess(true)
      setTimeout(() => {
        if (onSuccess) onSuccess()
      }, 1500)
    } catch (err: any) {
      console.error('Error saving prevention plan:', err)
      setError(err.message || 'Eroare la salvarea planului de prevenire')
    } finally {
      setLoading(false)
    }
  }

  // ========== RENDER ==========

  const criticalMeasures = measures.filter((m) => m.priority === 'urgent')
  const highMeasures = measures.filter((m) => m.priority === 'high')
  const pendingMeasures = measures.filter((m) => m.implementation_status === 'pending')
  const completedMeasures = measures.filter((m) => m.implementation_status === 'completed')

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingId ? 'Editare Plan Prevenire' : 'Plan Prevenire și Protecție Nou'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Măsuri tehnice, organizatorice și igienico-sanitare per risc identificat
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
            Plan de prevenire salvat cu succes!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            Informații Plan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">-- Selectează organizație --</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Risk Assessment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evaluare Risc (opțional)
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.risk_assessment_id}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, risk_assessment_id: e.target.value }))
                  }
                  disabled={!formData.organization_id}
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
                >
                  <option value="">-- Selectează evaluare --</option>
                  {riskAssessments.map((assessment) => (
                    <option key={assessment.id} value={assessment.id}>
                      {assessment.workplace_name}
                      {assessment.department ? ` - ${assessment.department}` : ''} (
                      {assessment.assessment_date})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleLoadFromRiskAssessment}
                  disabled={!formData.risk_assessment_id || loading}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Încarcă Riscuri
                </button>
              </div>
            </div>

            {/* Plan Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nume Plan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.plan_name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, plan_name: e.target.value }))
                }
                placeholder="ex: Plan de Prevenire și Protecție - Atelier Mecanic"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Plan Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Planului <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.plan_date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, plan_date: e.target.value }))
                }
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Valid From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valabil de la <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.valid_from}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, valid_from: e.target.value }))
                }
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Valid Until */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valabil până la
              </label>
              <input
                type="date"
                value={formData.valid_until}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, valid_until: e.target.value }))
                }
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {PLAN_STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Approved By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aprobat de (nume)
              </label>
              <input
                type="text"
                value={formData.approved_by_name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, approved_by_name: e.target.value }))
                }
                placeholder="Nume persoană care aprobă"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Approved By Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funcție/Titlu
              </label>
              <input
                type="text"
                value={formData.approved_by_title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, approved_by_title: e.target.value }))
                }
                placeholder="ex: Director General, Manager SSM"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Approval Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Aprobării
              </label>
              <input
                type="date"
                value={formData.approval_date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, approval_date: e.target.value }))
                }
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Prevention Measures Section */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Măsuri de Prevenire ({measures.length})
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddMeasure}
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Adaugă Măsură
              </button>
              <button
                type="button"
                onClick={handleExportPDF}
                disabled={measures.length === 0 || exportingPDF}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileDown className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Measures Summary */}
          {measures.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-white rounded-lg p-3 border border-red-200">
                <div className="text-lg font-bold text-red-600">{criticalMeasures.length}</div>
                <div className="text-xs text-gray-600">Urgent</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-orange-200">
                <div className="text-lg font-bold text-orange-600">{highMeasures.length}</div>
                <div className="text-xs text-gray-600">Prioritate Ridicată</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-lg font-bold text-gray-600">{pendingMeasures.length}</div>
                <div className="text-xs text-gray-600">În așteptare</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <div className="text-lg font-bold text-green-600">{completedMeasures.length}</div>
                <div className="text-xs text-gray-600">Finalizate</div>
              </div>
            </div>
          )}

          {/* Measures Table */}
          {measures.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                Nu există măsuri de prevenire adăugate
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Încărcați riscurile dintr-o evaluare sau adăugați măsuri manual
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {measures.map((measure, index) => (
                <div
                  key={measure.id}
                  className="bg-white rounded-xl p-5 border border-gray-200 space-y-4"
                >
                  {/* Measure Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={measure.risk_name}
                          onChange={(e) =>
                            handleUpdateMeasure(measure.id, { risk_name: e.target.value })
                          }
                          placeholder="Nume risc identificat"
                          className="flex-1 px-3 py-1.5 text-base font-semibold bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {measure.risk_level && (
                          <div
                            className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${
                              getRiskColor(measure.risk_level) === 'red'
                                ? 'bg-red-600'
                                : getRiskColor(measure.risk_level) === 'orange'
                                ? 'bg-orange-600'
                                : getRiskColor(measure.risk_level) === 'yellow'
                                ? 'bg-yellow-600'
                                : getRiskColor(measure.risk_level) === 'blue'
                                ? 'bg-blue-600'
                                : 'bg-green-600'
                            }`}
                          >
                            {measure.risk_level_label}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMeasure(measure.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Șterge măsură"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Measures Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Technical Measure */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
                        <Wrench className="w-3.5 h-3.5 text-gray-500" />
                        Măsură Tehnică
                      </label>
                      <textarea
                        value={measure.technical_measure}
                        onChange={(e) =>
                          handleUpdateMeasure(measure.id, {
                            technical_measure: e.target.value,
                          })
                        }
                        rows={3}
                        placeholder="Măsuri tehnice de prevenire..."
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Organizational Measure */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
                        <Users className="w-3.5 h-3.5 text-gray-500" />
                        Măsură Organizatorică
                      </label>
                      <textarea
                        value={measure.organizational_measure}
                        onChange={(e) =>
                          handleUpdateMeasure(measure.id, {
                            organizational_measure: e.target.value,
                          })
                        }
                        rows={3}
                        placeholder="Măsuri organizatorice..."
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Hygiene Measure */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
                        <Heart className="w-3.5 h-3.5 text-gray-500" />
                        Măsură Igienico-Sanitară
                      </label>
                      <textarea
                        value={measure.hygiene_measure}
                        onChange={(e) =>
                          handleUpdateMeasure(measure.id, { hygiene_measure: e.target.value })
                        }
                        rows={3}
                        placeholder="Măsuri igienico-sanitare..."
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Responsibility and Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Responsible Person */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
                        <User className="w-3.5 h-3.5 text-gray-500" />
                        Responsabil
                      </label>
                      <input
                        type="text"
                        value={measure.responsible_person}
                        onChange={(e) =>
                          handleUpdateMeasure(measure.id, {
                            responsible_person: e.target.value,
                          })
                        }
                        placeholder="Nume"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Responsible Title */}
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                        Funcție
                      </label>
                      <input
                        type="text"
                        value={measure.responsible_title}
                        onChange={(e) =>
                          handleUpdateMeasure(measure.id, {
                            responsible_title: e.target.value,
                          })
                        }
                        placeholder="Funcție/Titlu"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Deadline */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        Termen
                      </label>
                      <input
                        type="date"
                        value={measure.deadline}
                        onChange={(e) =>
                          handleUpdateMeasure(measure.id, { deadline: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                        Prioritate
                      </label>
                      <select
                        value={measure.priority}
                        onChange={(e) =>
                          handleUpdateMeasure(measure.id, {
                            priority: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {PRIORITY_OPTIONS.map((priority) => (
                          <option key={priority.value} value={priority.value}>
                            {priority.icon} {priority.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Resources and Status */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Resources Needed */}
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                        Resurse Necesare
                      </label>
                      <textarea
                        value={measure.resources_needed}
                        onChange={(e) =>
                          handleUpdateMeasure(measure.id, {
                            resources_needed: e.target.value,
                          })
                        }
                        rows={2}
                        placeholder="Resurse materiale/financiare..."
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Estimated Cost */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                        Cost Estimat (RON)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={measure.estimated_cost}
                        onChange={(e) =>
                          handleUpdateMeasure(measure.id, {
                            estimated_cost: e.target.value,
                          })
                        }
                        placeholder="0.00"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Implementation Status */}
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                        Status Implementare
                      </label>
                      <select
                        value={measure.implementation_status}
                        onChange={(e) =>
                          handleUpdateMeasure(measure.id, {
                            implementation_status: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observații Generale
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            rows={3}
            placeholder="Note, observații sau informații suplimentare despre planul de prevenire..."
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading || success}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvare...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {editingId ? 'Actualizare Plan' : 'Salvare Plan'}
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
