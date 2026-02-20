// app/[locale]/dashboard/nis2/NIS2Client.tsx
// NIS2 Cybersecurity Compliance — Client Component
// Three tabs: Evaluare NIS2, Incidente Cyber, Raport NIS2

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import type {
  NIS2Assessment,
  NIS2ChecklistItem,
  NIS2Incident,
  NIS2Category,
  NIS2ChecklistCategory,
  NIS2IncidentType,
  NIS2IncidentSeverity,
  NIS2IncidentStatus,
  NIS2Priority,
} from '@/lib/types'
import {
  NIS2_CATEGORY_LABELS,
  NIS2_ASSESSMENT_STATUS_LABELS,
  NIS2_CHECKLIST_CATEGORY_LABELS,
  NIS2_INCIDENT_TYPE_LABELS,
  NIS2_INCIDENT_SEVERITY_LABELS,
  NIS2_INCIDENT_STATUS_LABELS,
  NIS2_PRIORITY_LABELS,
} from '@/lib/types'

// ============================================================
// TYPES
// ============================================================

interface Organization {
  id: string
  name: string
  cui?: string | null
}

interface Props {
  user: { id: string; email: string }
  organizations: Organization[]
  initialSelectedOrg: string
}

type TabType = 'assessment' | 'incidents' | 'report'
type WizardStep = 1 | 2 | 3

// ============================================================
// CONSTANTS
// ============================================================

const SEVERITY_COLORS: Record<NIS2IncidentSeverity, string> = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200',
}

const STATUS_COLORS: Record<NIS2IncidentStatus, string> = {
  detected: 'bg-blue-100 text-blue-800',
  investigating: 'bg-purple-100 text-purple-800',
  contained: 'bg-yellow-100 text-yellow-800',
  eradicated: 'bg-orange-100 text-orange-800',
  recovered: 'bg-teal-100 text-teal-800',
  closed: 'bg-gray-100 text-gray-800',
}

const PRIORITY_COLORS: Record<NIS2Priority, string> = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
}

const CHECKLIST_CATEGORIES: NIS2ChecklistCategory[] = [
  'governance', 'risk_management', 'incident_handling', 'business_continuity',
  'supply_chain', 'network_security', 'vulnerability_management', 'crypto_encryption',
  'hr_security', 'access_control', 'asset_management', 'training_awareness',
]

// NIS2_SECTORS is defined inside components using useTranslations

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function NIS2Client({ user, organizations, initialSelectedOrg }: Props) {
  const t = useTranslations('nis2')
  const [selectedOrg, setSelectedOrg] = useState(initialSelectedOrg)
  const [activeTab, setActiveTab] = useState<TabType>('assessment')
  const [loading, setLoading] = useState(false)

  // Assessment state
  const [assessments, setAssessments] = useState<NIS2Assessment[]>([])
  const [selectedAssessment, setSelectedAssessment] = useState<NIS2Assessment | null>(null)
  const [checklistItems, setChecklistItems] = useState<NIS2ChecklistItem[]>([])
  const [wizardStep, setWizardStep] = useState<WizardStep>(1)
  const [showNewAssessmentForm, setShowNewAssessmentForm] = useState(false)
  const [newAssessmentForm, setNewAssessmentForm] = useState({
    nis2_category: 'important' as NIS2Category,
    sector: '',
    employee_count_range: '50-249' as '1-49' | '50-249' | '250+',
    annual_turnover_range: 'under_10m' as 'under_10m' | '10m_50m' | 'over_50m',
    notes: '',
  })

  // Incident state
  const [incidents, setIncidents] = useState<NIS2Incident[]>([])
  const [showIncidentModal, setShowIncidentModal] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<NIS2Incident | null>(null)
  const [incidentForm, setIncidentForm] = useState({
    title: '',
    description: '',
    incident_date: new Date().toISOString().split('T')[0],
    detected_date: new Date().toISOString().split('T')[0],
    incident_type: 'other' as NIS2IncidentType,
    severity: 'medium' as NIS2IncidentSeverity,
    is_significant: false,
    affected_systems: '',
    affected_users_count: 0,
    immediate_actions: '',
    status: 'detected' as NIS2IncidentStatus,
  })

  // ============================================================
  // DATA LOADING
  // ============================================================

  const loadAssessments = useCallback(async () => {
    if (!selectedOrg) return
    setLoading(true)
    try {
      const res = await fetch(`/api/nis2?org_id=${selectedOrg}`)
      if (res.ok) {
        const data = await res.json()
        setAssessments(data)
        if (data.length > 0 && !selectedAssessment) {
          setSelectedAssessment(data[0])
        }
      }
    } catch (err) {
      console.error('Error loading assessments:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedOrg, selectedAssessment])

  const loadChecklist = useCallback(async (assessmentId: string) => {
    try {
      const res = await fetch(`/api/nis2/checklist?assessment_id=${assessmentId}`)
      if (res.ok) {
        const data = await res.json()
        setChecklistItems(data)
      }
    } catch (err) {
      console.error('Error loading checklist:', err)
    }
  }, [])

  const loadIncidents = useCallback(async () => {
    if (!selectedOrg) return
    try {
      const res = await fetch(`/api/nis2/incidents?org_id=${selectedOrg}`)
      if (res.ok) {
        const data = await res.json()
        setIncidents(data)
      }
    } catch (err) {
      console.error('Error loading incidents:', err)
    }
  }, [selectedOrg])

  useEffect(() => {
    if (activeTab === 'assessment' || activeTab === 'report') {
      loadAssessments()
    }
    if (activeTab === 'incidents' || activeTab === 'report') {
      loadIncidents()
    }
  }, [activeTab, selectedOrg])

  useEffect(() => {
    if (selectedAssessment) {
      loadChecklist(selectedAssessment.id)
    }
  }, [selectedAssessment])

  // ============================================================
  // HANDLERS — ASSESSMENTS
  // ============================================================

  const handleCreateAssessment = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/nis2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: selectedOrg,
          ...newAssessmentForm,
        }),
      })
      if (res.ok) {
        const assessment = await res.json()
        setShowNewAssessmentForm(false)
        setSelectedAssessment(assessment)
        setWizardStep(2)
        await loadAssessments()
        await loadChecklist(assessment.id)
      } else {
        alert(t('errorCreatingAssessment'))
      }
    } catch (err) {
      console.error('Error creating assessment:', err)
      alert(t('errorCreatingAssessment'))
    } finally {
      setLoading(false)
    }
  }

  const handleToggleCompliant = async (item: NIS2ChecklistItem) => {
    const updated = checklistItems.map(i =>
      i.id === item.id ? { ...i, is_compliant: !i.is_compliant } : i
    )
    setChecklistItems(updated)

    // Save to API
    if (selectedAssessment) {
      try {
        await fetch('/api/nis2/checklist', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assessment_id: selectedAssessment.id,
            items: [{ ...item, is_compliant: !item.is_compliant }],
          }),
        })
        // Refresh assessment score
        const res = await fetch(`/api/nis2/${selectedAssessment.id}`)
        if (res.ok) {
          const updatedAssessment = await res.json()
          setSelectedAssessment(updatedAssessment)
          setAssessments(prev => prev.map(a => a.id === updatedAssessment.id ? updatedAssessment : a))
        }
      } catch (err) {
        console.error('Error updating checklist item:', err)
      }
    }
  }

  const handleUpdateEvidence = async (item: NIS2ChecklistItem, evidence: string) => {
    if (!selectedAssessment) return
    try {
      await fetch('/api/nis2/checklist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessment_id: selectedAssessment.id,
          items: [{ ...item, evidence }],
        }),
      })
      setChecklistItems(prev => prev.map(i => i.id === item.id ? { ...i, evidence } : i))
    } catch (err) {
      console.error('Error updating evidence:', err)
    }
  }

  // ============================================================
  // HANDLERS — INCIDENTS
  // ============================================================

  const handleCreateIncident = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/nis2/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: selectedOrg,
          ...incidentForm,
          affected_systems: incidentForm.affected_systems
            .split(',')
            .map(s => s.trim())
            .filter(Boolean),
        }),
      })
      if (res.ok) {
        setShowIncidentModal(false)
        setIncidentForm({
          title: '',
          description: '',
          incident_date: new Date().toISOString().split('T')[0],
          detected_date: new Date().toISOString().split('T')[0],
          incident_type: 'other',
          severity: 'medium',
          is_significant: false,
          affected_systems: '',
          affected_users_count: 0,
          immediate_actions: '',
          status: 'detected',
        })
        await loadIncidents()
      } else {
        alert(t('errorCreatingIncident'))
      }
    } catch (err) {
      console.error('Error creating incident:', err)
      alert(t('errorCreatingIncident'))
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateIncidentStatus = async (incident: NIS2Incident, status: NIS2IncidentStatus) => {
    try {
      const res = await fetch(`/api/nis2/incidents/${incident.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        const updated = await res.json()
        setIncidents(prev => prev.map(i => i.id === updated.id ? updated : i))
        if (selectedIncident?.id === incident.id) {
          setSelectedIncident(updated)
        }
      }
    } catch (err) {
      console.error('Error updating incident:', err)
    }
  }

  const handleDeleteIncident = async (id: string) => {
    if (!confirm(t('confirmDeleteIncident'))) return
    try {
      await fetch(`/api/nis2/incidents/${id}`, { method: 'DELETE' })
      setIncidents(prev => prev.filter(i => i.id !== id))
      if (selectedIncident?.id === id) setSelectedIncident(null)
    } catch (err) {
      console.error('Error deleting incident:', err)
    }
  }

  // ============================================================
  // HELPERS
  // ============================================================

  const getReportingCountdown = (incident: NIS2Incident) => {
    if (!incident.is_significant || incident.reported_to_authority) return null
    const detected = new Date(incident.detected_date)
    const deadline24h = new Date(detected.getTime() + 24 * 60 * 60 * 1000)
    const now = new Date()
    const hoursLeft = Math.max(0, (deadline24h.getTime() - now.getTime()) / (1000 * 60 * 60))
    return hoursLeft
  }

  const getChecklistByCategory = (category: NIS2ChecklistCategory) =>
    checklistItems.filter(i => i.category === category)

  const getCategoryScore = (category: NIS2ChecklistCategory) => {
    const items = getChecklistByCategory(category)
    if (items.length === 0) return 0
    return Math.round((items.filter(i => i.is_compliant).length / items.length) * 100)
  }

  const getNonCompliantItems = () =>
    checklistItems
      .filter(i => !i.is_compliant)
      .sort((a, b) => {
        const order: Record<NIS2Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 }
        return order[a.priority] - order[b.priority]
      })

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">NIS2 Cybersecurity</h1>
            <p className="text-sm text-gray-500">{t('subtitle')}</p>
          </div>
        </div>

        <select
          value={selectedOrg}
          onChange={e => setSelectedOrg(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        >
          {organizations.map(org => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('complianceScore')}</p>
          <p className="text-3xl font-bold text-blue-600">
            {selectedAssessment ? selectedAssessment.overall_score : 0}%
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('assessments')}</p>
          <p className="text-3xl font-bold text-gray-900">{assessments.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('activeIncidents')}</p>
          <p className="text-3xl font-bold text-orange-600">
            {incidents.filter(i => i.status !== 'closed').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('critical24h')}</p>
          <p className="text-3xl font-bold text-red-600">
            {incidents.filter(i => i.severity === 'critical' && i.status !== 'closed').length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {([
            { key: 'assessment', label: t('tabAssessment'), icon: '📋' },
            { key: 'incidents', label: t('tabIncidents'), icon: '⚠️' },
            { key: 'report', label: t('tabReport'), icon: '📊' },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-4 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="hidden sm:inline mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* ========== TAB 1: EVALUARE NIS2 ========== */}
          {activeTab === 'assessment' && (
            <AssessmentTab
              assessments={assessments}
              selectedAssessment={selectedAssessment}
              checklistItems={checklistItems}
              wizardStep={wizardStep}
              showNewForm={showNewAssessmentForm}
              newForm={newAssessmentForm}
              loading={loading}
              onSelectAssessment={a => { setSelectedAssessment(a); setWizardStep(2) }}
              onNewAssessment={() => { setShowNewAssessmentForm(true); setWizardStep(1) }}
              onFormChange={setNewAssessmentForm}
              onCreateAssessment={handleCreateAssessment}
              onCancelNew={() => setShowNewAssessmentForm(false)}
              onToggleCompliant={handleToggleCompliant}
              onUpdateEvidence={handleUpdateEvidence}
              onWizardStep={setWizardStep}
              onChecklistByCategory={getChecklistByCategory}
            />
          )}

          {/* ========== TAB 2: INCIDENTE CYBER ========== */}
          {activeTab === 'incidents' && (
            <IncidentsTab
              incidents={incidents}
              selectedIncident={selectedIncident}
              showModal={showIncidentModal}
              form={incidentForm}
              loading={loading}
              onSelectIncident={setSelectedIncident}
              onShowModal={() => setShowIncidentModal(true)}
              onCloseModal={() => { setShowIncidentModal(false); setSelectedIncident(null) }}
              onFormChange={setIncidentForm}
              onCreateIncident={handleCreateIncident}
              onUpdateStatus={handleUpdateIncidentStatus}
              onDeleteIncident={handleDeleteIncident}
              getCountdown={getReportingCountdown}
            />
          )}

          {/* ========== TAB 3: RAPORT NIS2 ========== */}
          {activeTab === 'report' && (
            <ReportTab
              selectedAssessment={selectedAssessment}
              checklistItems={checklistItems}
              incidents={incidents}
              getNonCompliantItems={getNonCompliantItems}
              getCategoryScore={getCategoryScore}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// TAB 1: ASSESSMENT
// ============================================================

interface AssessmentTabProps {
  assessments: NIS2Assessment[]
  selectedAssessment: NIS2Assessment | null
  checklistItems: NIS2ChecklistItem[]
  wizardStep: WizardStep
  showNewForm: boolean
  newForm: {
    nis2_category: NIS2Category
    sector: string
    employee_count_range: '1-49' | '50-249' | '250+'
    annual_turnover_range: 'under_10m' | '10m_50m' | 'over_50m'
    notes: string
  }
  loading: boolean
  onSelectAssessment: (a: NIS2Assessment) => void
  onNewAssessment: () => void
  onFormChange: (form: AssessmentTabProps['newForm']) => void
  onCreateAssessment: () => void
  onCancelNew: () => void
  onToggleCompliant: (item: NIS2ChecklistItem) => void
  onUpdateEvidence: (item: NIS2ChecklistItem, evidence: string) => void
  onWizardStep: (step: WizardStep) => void
  onChecklistByCategory: (cat: NIS2ChecklistCategory) => NIS2ChecklistItem[]
}

function AssessmentTab({
  assessments, selectedAssessment, checklistItems, wizardStep,
  showNewForm, newForm, loading,
  onSelectAssessment, onNewAssessment, onFormChange, onCreateAssessment,
  onCancelNew, onToggleCompliant, onUpdateEvidence, onWizardStep, onChecklistByCategory,
}: AssessmentTabProps) {
  const t = useTranslations('nis2')
  const [activeCategory, setActiveCategory] = useState<NIS2ChecklistCategory>('governance')

  const NIS2_SECTORS = [
    t('sectorEnergy'), t('sectorTransport'), t('sectorBanking'), t('sectorFinancialMarket'),
    t('sectorHealth'), t('sectorDrinkingWater'), t('sectorWastewater'), t('sectorDigitalInfra'),
    t('sectorICT'), t('sectorPublicAdmin'), t('sectorSpace'), t('sectorPostal'),
    t('sectorWasteManagement'), t('sectorChemical'), t('sectorFood'), t('sectorManufacturing'),
    t('sectorDigitalServices'), t('sectorResearch'),
  ]

  if (showNewForm) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">{t('newAssessmentTitle')}</h2>
          <p className="text-sm text-gray-500">{t('newAssessmentStep1')}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('nis2Category')}</label>
            <select
              value={newForm.nis2_category}
              onChange={e => onFormChange({ ...newForm, nis2_category: e.target.value as NIS2Category })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {(Object.entries(NIS2_CATEGORY_LABELS) as [NIS2Category, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('activitySector')}</label>
            <select
              value={newForm.sector}
              onChange={e => onFormChange({ ...newForm, sector: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('selectSector')}</option>
              {NIS2_SECTORS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('employeeCount')}</label>
              <select
                value={newForm.employee_count_range}
                onChange={e => onFormChange({ ...newForm, employee_count_range: e.target.value as '1-49' | '50-249' | '250+' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1-49">{t('employees149')}</option>
                <option value="50-249">{t('employees50249')}</option>
                <option value="250+">{t('employees250plus')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('annualTurnover')}</label>
              <select
                value={newForm.annual_turnover_range}
                onChange={e => onFormChange({ ...newForm, annual_turnover_range: e.target.value as 'under_10m' | '10m_50m' | 'over_50m' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="under_10m">{t('turnoverUnder10m')}</option>
                <option value="10m_50m">{t('turnover10m50m')}</option>
                <option value="over_50m">{t('turnoverOver50m')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('notes')}</label>
            <textarea
              value={newForm.notes}
              onChange={e => onFormChange({ ...newForm, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder={t('notesPlaceholder')}
            />
          </div>

          {newForm.nis2_category !== 'out_of_scope' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <strong>{t('nis2InfoLabel')}</strong>{' '}
              {newForm.nis2_category === 'essential'
                ? t('nis2InfoEssential')
                : t('nis2InfoImportant')}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCreateAssessment}
            disabled={loading || !newForm.nis2_category}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? t('creating') : t('createAssessment')}
          </button>
          <button
            onClick={onCancelNew}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    )
  }

  if (!selectedAssessment || checklistItems.length === 0) {
    return (
      <div className="space-y-4">
        {assessments.length > 0 && (
          <div className="grid gap-3">
            {assessments.map(a => (
              <button
                key={a.id}
                onClick={() => onSelectAssessment(a)}
                className="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{NIS2_CATEGORY_LABELS[a.nis2_category]}</p>
                    <p className="text-sm text-gray-500">{a.assessment_date} • {a.sector || t('sectorUnspecified')}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-blue-600">{a.overall_score}%</span>
                    <p className="text-xs text-gray-500">{NIS2_ASSESSMENT_STATUS_LABELS[a.status]}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onNewAssessment}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('newAssessmentBtn')}
        </button>
      </div>
    )
  }

  // Wizard step 2: checklist
  const compliantCount = checklistItems.filter(i => i.is_compliant).length
  const score = Math.round((compliantCount / checklistItems.length) * 100)
  const categoryItems = onChecklistByCategory(activeCategory)

  return (
    <div className="space-y-6">
      {/* Assessment header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {NIS2_CATEGORY_LABELS[selectedAssessment.nis2_category]}
          </h2>
          <p className="text-sm text-gray-500">
            {selectedAssessment.assessment_date} • {selectedAssessment.sector || t('sectorUnspecified')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{score}%</p>
            <p className="text-xs text-gray-500">{t('compliance')}</p>
          </div>
          <button
            onClick={onNewAssessment}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + {t('newAssessmentBtn')}
          </button>
          {assessments.length > 1 && (
            <select
              className="text-sm border border-gray-300 rounded-lg px-2 py-2"
              value={selectedAssessment.id}
              onChange={e => {
                const a = assessments.find(x => x.id === e.target.value)
                if (a) onSelectAssessment(a)
              }}
            >
              {assessments.map(a => (
                <option key={a.id} value={a.id}>{a.assessment_date} — {a.overall_score}%</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{compliantCount} / {checklistItems.length} {t('requirementsMet')}</span>
          <span>{score}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap gap-2">
        {CHECKLIST_CATEGORIES.map(cat => {
          const items = onChecklistByCategory(cat)
          const catScore = items.length > 0 ? Math.round((items.filter(i => i.is_compliant).length / items.length) * 100) : 0
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {NIS2_CHECKLIST_CATEGORY_LABELS[cat]} ({catScore}%)
            </button>
          )
        })}
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">{NIS2_CHECKLIST_CATEGORY_LABELS[activeCategory]}</h3>
        {categoryItems.map(item => (
          <ChecklistItemRow
            key={item.id}
            item={item}
            onToggle={() => onToggleCompliant(item)}
            onUpdateEvidence={ev => onUpdateEvidence(item, ev)}
          />
        ))}
        {categoryItems.length === 0 && (
          <p className="text-gray-400 text-sm">{t('noItemsInCategory')}</p>
        )}
      </div>
    </div>
  )
}

// ============================================================
// CHECKLIST ITEM ROW
// ============================================================

function ChecklistItemRow({
  item,
  onToggle,
  onUpdateEvidence,
}: {
  item: NIS2ChecklistItem
  onToggle: () => void
  onUpdateEvidence: (ev: string) => void
}) {
  const t = useTranslations('nis2')
  const [showEvidence, setShowEvidence] = useState(false)
  const [evidence, setEvidence] = useState(item.evidence || '')

  return (
    <div className={`border rounded-xl p-4 transition ${item.is_compliant ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
            item.is_compliant
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {item.is_compliant && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-gray-400">{item.item_code}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[item.priority]}`}>
              {NIS2_PRIORITY_LABELS[item.priority]}
            </span>
          </div>
          <p className="text-sm text-gray-900 mt-1">{item.item_text}</p>
          {item.evidence && (
            <p className="text-xs text-green-700 mt-1">{t('evidence')}: {item.evidence}</p>
          )}
        </div>
        <button
          onClick={() => setShowEvidence(!showEvidence)}
          className="text-xs text-blue-600 hover:underline flex-shrink-0"
        >
          {showEvidence ? t('hide') : t('evidence')}
        </button>
      </div>
      {showEvidence && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={evidence}
            onChange={e => setEvidence(e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder={t('evidencePlaceholder')}
          />
          <button
            onClick={() => { onUpdateEvidence(evidence); setShowEvidence(false) }}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('save')}
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================================
// TAB 2: INCIDENTS
// ============================================================

interface IncidentsTabProps {
  incidents: NIS2Incident[]
  selectedIncident: NIS2Incident | null
  showModal: boolean
  form: {
    title: string
    description: string
    incident_date: string
    detected_date: string
    incident_type: NIS2IncidentType
    severity: NIS2IncidentSeverity
    is_significant: boolean
    affected_systems: string
    affected_users_count: number
    immediate_actions: string
    status: NIS2IncidentStatus
  }
  loading: boolean
  onSelectIncident: (i: NIS2Incident | null) => void
  onShowModal: () => void
  onCloseModal: () => void
  onFormChange: (form: IncidentsTabProps['form']) => void
  onCreateIncident: () => void
  onUpdateStatus: (i: NIS2Incident, status: NIS2IncidentStatus) => void
  onDeleteIncident: (id: string) => void
  getCountdown: (i: NIS2Incident) => number | null
}

function IncidentsTab({
  incidents, selectedIncident, showModal, form, loading,
  onSelectIncident, onShowModal, onCloseModal, onFormChange,
  onCreateIncident, onUpdateStatus, onDeleteIncident, getCountdown,
}: IncidentsTabProps) {
  const t = useTranslations('nis2')
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">{t('cybersecurityIncidents')}</h2>
        <button
          onClick={onShowModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition"
        >
          + {t('newIncident')}
        </button>
      </div>

      {incidents.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{t('noIncidents')}</p>
          <p className="text-sm mt-1">{t('addFirstIncident')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('colNo')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('colTitle')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('colType')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('colSeverity')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('colStatus')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('colDate')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('colActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {incidents.map(incident => {
                const countdown = getCountdown(incident)
                return (
                  <tr
                    key={incident.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onSelectIncident(incident)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      {incident.incident_number || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{incident.title}</div>
                      {incident.is_significant && countdown !== null && (
                        <div className={`text-xs mt-0.5 ${countdown < 6 ? 'text-red-600 font-medium' : 'text-orange-600'}`}>
                          ⏱ {countdown < 1 ? t('expired') : t('hoursLeft', { hours: Math.round(countdown) })}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {NIS2_INCIDENT_TYPE_LABELS[incident.incident_type]}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${SEVERITY_COLORS[incident.severity]}`}>
                        {NIS2_INCIDENT_SEVERITY_LABELS[incident.severity]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[incident.status]}`}>
                        {NIS2_INCIDENT_STATUS_LABELS[incident.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {new Date(incident.incident_date).toLocaleDateString('ro-RO')}
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1">
                        {incident.status !== 'closed' && (
                          <button
                            onClick={() => onUpdateStatus(incident, 'closed')}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                          >
                            {t('close')}
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteIncident(incident.id)}
                          className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                        >
                          {t('delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedIncident.incident_number || selectedIncident.title}</h2>
                <p className="text-sm text-gray-500">{selectedIncident.title}</p>
              </div>
              <button onClick={() => onSelectIncident(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-sm border ${SEVERITY_COLORS[selectedIncident.severity]}`}>
                  {NIS2_INCIDENT_SEVERITY_LABELS[selectedIncident.severity]}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${STATUS_COLORS[selectedIncident.status]}`}>
                  {NIS2_INCIDENT_STATUS_LABELS[selectedIncident.status]}
                </span>
                {selectedIncident.is_significant && (
                  <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">{t('significantMandatoryReport')}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">{t('incidentType')}</p>
                  <p className="font-medium">{NIS2_INCIDENT_TYPE_LABELS[selectedIncident.incident_type]}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t('incidentDate')}</p>
                  <p className="font-medium">{new Date(selectedIncident.incident_date).toLocaleString('ro-RO')}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t('detectedDate')}</p>
                  <p className="font-medium">{new Date(selectedIncident.detected_date).toLocaleString('ro-RO')}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t('affectedUsers')}</p>
                  <p className="font-medium">{selectedIncident.affected_users_count}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">{t('description')}</p>
                <p className="text-gray-900">{selectedIncident.description}</p>
              </div>

              {selectedIncident.affected_systems.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t('affectedSystems')}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedIncident.affected_systems.map((s, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedIncident.immediate_actions && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t('immediateActions')}</p>
                  <p className="text-gray-900">{selectedIncident.immediate_actions}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {selectedIncident.status !== 'closed' && (
                  <select
                    value={selectedIncident.status}
                    onChange={e => onUpdateStatus(selectedIncident, e.target.value as NIS2IncidentStatus)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    {(Object.entries(NIS2_INCIDENT_STATUS_LABELS) as [NIS2IncidentStatus, string][]).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Incident Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">{t('newCyberIncident')}</h2>
              <button onClick={onCloseModal} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('incidentTitleField')}</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => onFormChange({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={t('incidentTitlePlaceholder')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('incidentTypeField')}</label>
                  <select
                    value={form.incident_type}
                    onChange={e => onFormChange({ ...form, incident_type: e.target.value as NIS2IncidentType })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {(Object.entries(NIS2_INCIDENT_TYPE_LABELS) as [NIS2IncidentType, string][]).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('severityField')}</label>
                  <select
                    value={form.severity}
                    onChange={e => onFormChange({ ...form, severity: e.target.value as NIS2IncidentSeverity })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {(Object.entries(NIS2_INCIDENT_SEVERITY_LABELS) as [NIS2IncidentSeverity, string][]).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('incidentDateField')}</label>
                  <input
                    type="datetime-local"
                    value={form.incident_date}
                    onChange={e => onFormChange({ ...form, incident_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('detectedDateField')}</label>
                  <input
                    type="datetime-local"
                    value={form.detected_date}
                    onChange={e => onFormChange({ ...form, detected_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('descriptionField')}</label>
                <textarea
                  value={form.description}
                  onChange={e => onFormChange({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={t('descriptionPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('affectedSystemsField')}</label>
                <input
                  type="text"
                  value={form.affected_systems}
                  onChange={e => onFormChange({ ...form, affected_systems: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={t('affectedSystemsPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('immediateActionsField')}</label>
                <textarea
                  value={form.immediate_actions}
                  onChange={e => onFormChange({ ...form, immediate_actions: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={t('immediateActionsPlaceholder')}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_significant}
                    onChange={e => onFormChange({ ...form, is_significant: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {t('significantIncidentLabel')}
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onCreateIncident}
                  disabled={loading || !form.title || !form.description}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {loading ? t('saving') : t('saveIncident')}
                </button>
                <button
                  onClick={onCloseModal}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// TAB 3: REPORT
// ============================================================

interface ReportTabProps {
  selectedAssessment: NIS2Assessment | null
  checklistItems: NIS2ChecklistItem[]
  incidents: NIS2Incident[]
  getNonCompliantItems: () => NIS2ChecklistItem[]
  getCategoryScore: (cat: NIS2ChecklistCategory) => number
}

function ReportTab({
  selectedAssessment, checklistItems, incidents, getNonCompliantItems, getCategoryScore,
}: ReportTabProps) {
  const t = useTranslations('nis2')
  if (!selectedAssessment) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>{t('noAssessmentSelected')}</p>
        <p className="text-sm mt-1">{t('createAssessmentHint')}</p>
      </div>
    )
  }

  const score = selectedAssessment.overall_score
  const nonCompliant = getNonCompliantItems()
  const criticalIncidents = incidents.filter(i => i.severity === 'critical' && i.status !== 'closed')
  const significantPending = incidents.filter(i => i.is_significant && !i.reported_to_authority)

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{t('globalComplianceScore')}</h2>
            <p className="text-sm text-gray-600">
              {NIS2_CATEGORY_LABELS[selectedAssessment.nis2_category]} •{' '}
              {selectedAssessment.sector || t('sectorUnspecified')}
            </p>
          </div>
          <div className="text-center">
            <div className={`text-5xl font-bold ${score >= 80 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {score}%
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {score >= 80 ? t('complianceGood') : score >= 50 ? t('compliancePartial') : t('complianceInsufficient')}
            </p>
          </div>
        </div>

        <div className="mt-4 h-4 bg-white bg-opacity-60 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Alerts */}
      {(criticalIncidents.length > 0 || significantPending.length > 0) && (
        <div className="space-y-2">
          {criticalIncidents.length > 0 && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-red-800 font-medium">
                {t('criticalIncidentsAlert', { count: criticalIncidents.length })}
              </p>
            </div>
          )}
          {significantPending.length > 0 && (
            <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <svg className="w-5 h-5 text-orange-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-orange-800 font-medium">
                {t('significantPendingAlert', { count: significantPending.length })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Category breakdown */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">{t('complianceByCategory')}</h3>
        <div className="space-y-2">
          {CHECKLIST_CATEGORIES.map(cat => {
            const catScore = getCategoryScore(cat)
            return (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-48 flex-shrink-0">
                  {NIS2_CHECKLIST_CATEGORY_LABELS[cat]}
                </span>
                <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${catScore >= 80 ? 'bg-green-500' : catScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${catScore}%` }}
                  />
                </div>
                <span className={`text-sm font-medium w-10 text-right ${catScore >= 80 ? 'text-green-600' : catScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {catScore}%
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Action items */}
      {nonCompliant.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            {t('requiredActions', { count: nonCompliant.length })}
          </h3>
          <div className="space-y-2">
            {nonCompliant.slice(0, 10).map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${PRIORITY_COLORS[item.priority]}`}>
                  {NIS2_PRIORITY_LABELS[item.priority]}
                </span>
                <span className="text-xs font-mono text-gray-400 flex-shrink-0">{item.item_code}</span>
                <p className="text-sm text-gray-900 flex-1">{item.item_text}</p>
              </div>
            ))}
            {nonCompliant.length > 10 && (
              <p className="text-sm text-gray-500 text-center">
                {t('andMoreRequirements', { count: nonCompliant.length - 10 })}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Incidents summary */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">{t('incidentsSummary')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(['low', 'medium', 'high', 'critical'] as NIS2IncidentSeverity[]).map(sev => (
            <div key={sev} className={`p-4 rounded-xl border ${SEVERITY_COLORS[sev]}`}>
              <p className="text-xs font-medium uppercase mb-1">{NIS2_INCIDENT_SEVERITY_LABELS[sev]}</p>
              <p className="text-2xl font-bold">{incidents.filter(i => i.severity === sev).length}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
