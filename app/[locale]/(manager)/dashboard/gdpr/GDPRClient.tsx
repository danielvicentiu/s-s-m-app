// app/[locale]/dashboard/gdpr/GDPRClient.tsx
// GDPR Module Client Component
// Created: 2026-02-17
// Registru prelucrări, consimțăminte, DPO management

'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import { FormModal } from '@/components/ui/FormModal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import {
  Shield,
  Plus,
  Pencil,
  Trash2,
  FileCheck,
  UserCheck,
  Building,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react'
import type { ProcessingActivity, Consent, DPO, LegalBasis, ProcessingActivityStatus, ConsentType } from '@/lib/gdpr/types'

// ========== TYPES ==========

interface Organization {
  id: string
  name: string
  cui: string
}

interface Props {
  user: { id: string; email: string }
  organizations: Organization[]
  selectedOrgId?: string
}

type TabType = 'processing' | 'consents' | 'dpo'

// ========== CONSTANTS ==========

const emptyProcessingForm = {
  activity_name: '',
  purpose: '',
  legal_basis: 'consent' as LegalBasis,
  data_categories: [] as string[],
  data_subjects: [] as string[],
  recipients: [] as string[],
  retention_period: '',
  cross_border_transfer: false,
  transfer_safeguards: '',
  technical_measures: [] as string[],
  organizational_measures: [] as string[],
  dpia_required: false,
  dpia_completed: false,
  dpia_date: '',
  status: 'active' as ProcessingActivityStatus,
  notes: '',
}

const emptyConsentForm = {
  person_name: '',
  person_email: '',
  person_cnp_hash: '',
  consent_type: 'processing' as ConsentType,
  purpose: '',
  given_at: new Date().toISOString().split('T')[0],
  is_active: true,
  notes: '',
}

const emptyDPOForm = {
  dpo_name: '',
  dpo_email: '',
  dpo_phone: '',
  is_internal: true,
  company_name: '',
  appointment_date: '',
  contract_expiry: '',
  anspdcp_notified: false,
  anspdcp_notification_date: '',
  notes: '',
}

// ========== MAIN COMPONENT ==========

export default function GDPRClient({ user, organizations, selectedOrgId }: Props) {
  const router = useRouter()
  const t = useTranslations('gdpr')

  const legalBasisLabels: Record<LegalBasis, string> = {
    consent: t('legalBasis.consent'),
    contract: t('legalBasis.contract'),
    legal_obligation: t('legalBasis.legalObligation'),
    vital_interest: t('legalBasis.vitalInterest'),
    public_interest: t('legalBasis.publicInterest'),
    legitimate_interest: t('legalBasis.legitimateInterest'),
  }

  const consentTypeLabels: Record<ConsentType, string> = {
    processing: t('consentType.processing'),
    marketing: t('consentType.marketing'),
    profiling: t('consentType.profiling'),
    transfer: t('consentType.transfer'),
    special_categories: t('consentType.specialCategories'),
    other: t('consentType.other'),
  }

  const statusLabels: Record<ProcessingActivityStatus, string> = {
    active: t('status.active'),
    inactive: t('status.inactive'),
    under_review: t('status.underReview'),
    archived: t('status.archived'),
  }
  const [activeTab, setActiveTab] = useState<TabType>('processing')
  const [loading, setLoading] = useState(false)

  // Processing Activities State
  const [processingActivities, setProcessingActivities] = useState<ProcessingActivity[]>([])
  const [processingModal, setProcessingModal] = useState(false)
  const [processingForm, setProcessingForm] = useState(emptyProcessingForm)
  const [editingProcessing, setEditingProcessing] = useState<string | null>(null)
  const [deleteProcessingId, setDeleteProcessingId] = useState<string | null>(null)

  // Consents State
  const [consents, setConsents] = useState<Consent[]>([])
  const [consentModal, setConsentModal] = useState(false)
  const [consentForm, setConsentForm] = useState(emptyConsentForm)
  const [editingConsent, setEditingConsent] = useState<string | null>(null)
  const [deleteConsentId, setDeleteConsentId] = useState<string | null>(null)

  // DPO State
  const [dpo, setDPO] = useState<DPO | null>(null)
  const [dpoForm, setDPOForm] = useState(emptyDPOForm)

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [legalBasisFilter, setLegalBasisFilter] = useState<string>('all')
  const [consentActiveFilter, setConsentActiveFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // ========== FETCH DATA ==========

  useEffect(() => {
    if (activeTab === 'processing') {
      fetchProcessingActivities()
    } else if (activeTab === 'consents') {
      fetchConsents()
    } else if (activeTab === 'dpo') {
      fetchDPO()
    }
  }, [activeTab, statusFilter, legalBasisFilter, consentActiveFilter, searchTerm])

  const fetchProcessingActivities = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (legalBasisFilter !== 'all') params.append('legal_basis', legalBasisFilter)
      if (searchTerm) params.append('search', searchTerm)

      const res = await fetch(`/api/gdpr/processing?${params}`)
      if (res.ok) {
        const data = await res.json()
        setProcessingActivities(data)
      }
    } catch (error) {
      console.error('Error fetching processing activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchConsents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (consentActiveFilter !== 'all') params.append('is_active', consentActiveFilter)
      if (searchTerm) params.append('search', searchTerm)

      const res = await fetch(`/api/gdpr/consents?${params}`)
      if (res.ok) {
        const data = await res.json()
        setConsents(data)
      }
    } catch (error) {
      console.error('Error fetching consents:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDPO = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/gdpr/dpo')
      if (res.ok) {
        const data = await res.json()
        if (data) {
          setDPO(data)
          setDPOForm(data)
        }
      }
    } catch (error) {
      console.error('Error fetching DPO:', error)
    } finally {
      setLoading(false)
    }
  }

  // ========== PROCESSING ACTIVITIES CRUD ==========

  const handleCreateProcessing = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/gdpr/processing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processingForm),
      })

      if (res.ok) {
        setProcessingModal(false)
        setProcessingForm(emptyProcessingForm)
        fetchProcessingActivities()
      } else {
        alert(t('errors.createError'))
      }
    } catch (error) {
      console.error('Error creating processing activity:', error)
      alert(t('errors.createError'))
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProcessing = async () => {
    if (!editingProcessing) return
    setLoading(true)
    try {
      const res = await fetch(`/api/gdpr/processing/${editingProcessing}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processingForm),
      })

      if (res.ok) {
        setProcessingModal(false)
        setProcessingForm(emptyProcessingForm)
        setEditingProcessing(null)
        fetchProcessingActivities()
      } else {
        alert(t('errors.updateError'))
      }
    } catch (error) {
      console.error('Error updating processing activity:', error)
      alert(t('errors.updateError'))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProcessing = async () => {
    if (!deleteProcessingId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/gdpr/processing/${deleteProcessingId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setDeleteProcessingId(null)
        fetchProcessingActivities()
      } else {
        alert(t('errors.deleteError'))
      }
    } catch (error) {
      console.error('Error deleting processing activity:', error)
      alert(t('errors.deleteError'))
    } finally {
      setLoading(false)
    }
  }

  // ========== CONSENTS CRUD ==========

  const handleCreateConsent = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/gdpr/consents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consentForm),
      })

      if (res.ok) {
        setConsentModal(false)
        setConsentForm(emptyConsentForm)
        fetchConsents()
      } else {
        alert(t('errors.createError'))
      }
    } catch (error) {
      console.error('Error creating consent:', error)
      alert(t('errors.createError'))
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateConsent = async () => {
    if (!editingConsent) return
    setLoading(true)
    try {
      const res = await fetch(`/api/gdpr/consents/${editingConsent}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consentForm),
      })

      if (res.ok) {
        setConsentModal(false)
        setConsentForm(emptyConsentForm)
        setEditingConsent(null)
        fetchConsents()
      } else {
        alert(t('errors.updateError'))
      }
    } catch (error) {
      console.error('Error updating consent:', error)
      alert(t('errors.updateError'))
    } finally {
      setLoading(false)
    }
  }

  const handleWithdrawConsent = async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/gdpr/consents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          withdrawn_at: new Date().toISOString(),
          is_active: false,
        }),
      })

      if (res.ok) {
        fetchConsents()
      } else {
        alert(t('errors.withdrawError'))
      }
    } catch (error) {
      console.error('Error withdrawing consent:', error)
      alert(t('errors.withdrawError'))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteConsent = async () => {
    if (!deleteConsentId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/gdpr/consents/${deleteConsentId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setDeleteConsentId(null)
        fetchConsents()
      } else {
        alert(t('errors.deleteError'))
      }
    } catch (error) {
      console.error('Error deleting consent:', error)
      alert(t('errors.deleteError'))
    } finally {
      setLoading(false)
    }
  }

  // ========== DPO UPSERT ==========

  const handleSaveDPO = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/gdpr/dpo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dpoForm),
      })

      if (res.ok) {
        const data = await res.json()
        setDPO(data)
        alert(t('dpo.savedSuccess'))
        fetchDPO()
      } else {
        alert(t('errors.saveError'))
      }
    } catch (error) {
      console.error('Error saving DPO:', error)
      alert(t('errors.saveError'))
    } finally {
      setLoading(false)
    }
  }

  // ========== STATS ==========

  const stats = {
    totalActivities: processingActivities.length,
    activeConsents: consents.filter((c) => c.is_active).length,
    dpiaRequired: processingActivities.filter((p) => p.dpia_required && !p.dpia_completed).length,
    dpoSet: dpo !== null,
  }

  // ========== TABLE COLUMNS ==========

  const processingColumns: DataTableColumn<ProcessingActivity>[] = [
    {
      key: 'activity_name',
      label: t('table.activity'),
      render: (row) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {row.activity_name}
        </div>
      ),
    },
    {
      key: 'purpose',
      label: t('table.purpose'),
      render: (row) => (
        <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
          {row.purpose}
        </div>
      ),
    },
    {
      key: 'legal_basis',
      label: t('table.legalBasis'),
      render: (row) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {legalBasisLabels[row.legal_basis]}
        </span>
      ),
    },
    {
      key: 'status',
      label: t('table.status'),
      render: (row) => {
        const variant =
          row.status === 'active'
            ? 'success'
            : row.status === 'inactive'
            ? 'danger'
            : row.status === 'under_review'
            ? 'warning'
            : 'default'
        return <StatusBadge status={statusLabels[row.status]} variant={variant} />
      },
    },
    {
      key: 'dpia_required',
      label: 'DPIA',
      render: (row) => {
        if (!row.dpia_required) return <span className="text-gray-400">—</span>
        return row.dpia_completed ? (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        ) : (
          <AlertCircle className="w-5 h-5 text-amber-600" />
        )
      },
    },
    {
      key: 'actions',
      label: t('table.actions'),
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingProcessing(row.id)
              setProcessingForm(row)
              setProcessingModal(true)
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded dark:hover:bg-blue-900/20"
            title={t('actions.edit')}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteProcessingId(row.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded dark:hover:bg-red-900/20"
            title={t('actions.delete')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  const consentColumns: DataTableColumn<Consent>[] = [
    {
      key: 'person_name',
      label: t('table.person'),
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {row.person_name}
          </div>
          {row.person_email && (
            <div className="text-xs text-gray-500">{row.person_email}</div>
          )}
        </div>
      ),
    },
    {
      key: 'consent_type',
      label: t('table.type'),
      render: (row) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {consentTypeLabels[row.consent_type]}
        </span>
      ),
    },
    {
      key: 'purpose',
      label: t('table.purpose'),
      render: (row) => (
        <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
          {row.purpose}
        </div>
      ),
    },
    {
      key: 'given_at',
      label: t('table.givenAt'),
      render: (row) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {new Date(row.given_at).toLocaleDateString('ro-RO')}
        </span>
      ),
    },
    {
      key: 'is_active',
      label: t('table.status'),
      render: (row) => {
        if (row.is_active) {
          return <StatusBadge status={t('consent.active')} variant="success" />
        }
        return (
          <div className="flex flex-col">
            <StatusBadge status={t('consent.withdrawn')} variant="danger" />
            {row.withdrawn_at && (
              <span className="text-xs text-gray-500 mt-1">
                {new Date(row.withdrawn_at).toLocaleDateString('ro-RO')}
              </span>
            )}
          </div>
        )
      },
    },
    {
      key: 'actions',
      label: t('table.actions'),
      render: (row) => (
        <div className="flex gap-2">
          {row.is_active && (
            <button
              onClick={() => handleWithdrawConsent(row.id)}
              className="px-2 py-1 text-xs text-amber-600 hover:bg-amber-50 rounded dark:hover:bg-amber-900/20"
              title={t('consent.withdrawTitle')}
            >
              {t('consent.withdraw')}
            </button>
          )}
          <button
            onClick={() => {
              setEditingConsent(row.id)
              setConsentForm({
                person_name: row.person_name,
                person_email: row.person_email || '',
                person_cnp_hash: row.person_cnp_hash || '',
                consent_type: row.consent_type,
                purpose: row.purpose,
                given_at: row.given_at.split('T')[0],
                is_active: row.is_active,
                notes: row.notes || '',
              })
              setConsentModal(true)
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded dark:hover:bg-blue-900/20"
            title={t('actions.edit')}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteConsentId(row.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded dark:hover:bg-red-900/20"
            title={t('actions.delete')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  // ========== RENDER ==========

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('title')}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {t('subtitle')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <FileCheck className="w-8 h-8 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalActivities}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('stats.processingActivities')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <UserCheck className="w-8 h-8 text-green-600" />
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.activeConsents}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('stats.activeConsents')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-amber-600" />
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.dpiaRequired}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('stats.dpiaRequired')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Building className="w-8 h-8 text-purple-600" />
            {stats.dpoSet ? (
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            ) : (
              <XCircle className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {stats.dpoSet ? t('stats.dpoConfigured') : t('stats.dpoNotConfigured')}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('processing')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'processing'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileCheck className="w-5 h-5" />
              <span>{t('tabs.processingRegistry')}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('consents')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'consents'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <UserCheck className="w-5 h-5" />
              <span>{t('tabs.consents')}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('dpo')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'dpo'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Building className="w-5 h-5" />
              <span>DPO</span>
            </div>
          </button>
        </div>

        <div className="p-6">
          {/* TAB: Processing Activities */}
          {activeTab === 'processing' && (
            <div>
              {/* Filters & Search */}
              <div className="flex gap-4 mb-6 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t('processing.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">{t('filter.allStatuses')}</option>
                  <option value="active">{t('status.active')}</option>
                  <option value="inactive">{t('status.inactive')}</option>
                  <option value="under_review">{t('status.underReview')}</option>
                  <option value="archived">{t('status.archived')}</option>
                </select>

                <select
                  value={legalBasisFilter}
                  onChange={(e) => setLegalBasisFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">{t('filter.allLegalBases')}</option>
                  {Object.entries(legalBasisLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setEditingProcessing(null)
                    setProcessingForm(emptyProcessingForm)
                    setProcessingModal(true)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t('processing.addActivity')}
                </button>
              </div>

              {/* Table */}
              {processingActivities.length === 0 ? (
                <EmptyState
                  icon={FileCheck}
                  title={t('processing.emptyTitle')}
                  message={t('processing.emptyMessage')}
                />
              ) : (
                <DataTable
                  data={processingActivities}
                  columns={processingColumns}
                />
              )}
            </div>
          )}

          {/* TAB: Consents */}
          {activeTab === 'consents' && (
            <div>
              {/* Filters & Search */}
              <div className="flex gap-4 mb-6 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t('consent.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <select
                  value={consentActiveFilter}
                  onChange={(e) => setConsentActiveFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">{t('filter.all')}</option>
                  <option value="true">{t('filter.active')}</option>
                  <option value="false">{t('filter.withdrawn')}</option>
                </select>

                <button
                  onClick={() => {
                    setEditingConsent(null)
                    setConsentForm(emptyConsentForm)
                    setConsentModal(true)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t('consent.addConsent')}
                </button>
              </div>

              {/* Table */}
              {consents.length === 0 ? (
                <EmptyState
                  icon={UserCheck}
                  title={t('consent.emptyTitle')}
                  message={t('consent.emptyMessage')}
                />
              ) : (
                <DataTable data={consents} columns={consentColumns} />
              )}
            </div>
          )}

          {/* TAB: DPO */}
          {activeTab === 'dpo' && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('dpo.title')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('dpo.subtitle')}
                </p>
              </div>

              <div className="space-y-6">
                {/* DPO Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dpo.nameLabel')}
                  </label>
                  <input
                    type="text"
                    value={dpoForm.dpo_name}
                    onChange={(e) =>
                      setDPOForm({ ...dpoForm, dpo_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={t('dpo.namePlaceholder')}
                  />
                </div>

                {/* DPO Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dpo.typeLabel')}
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={dpoForm.is_internal}
                        onChange={() =>
                          setDPOForm({ ...dpoForm, is_internal: true })
                        }
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {t('dpo.internal')}
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!dpoForm.is_internal}
                        onChange={() =>
                          setDPOForm({ ...dpoForm, is_internal: false })
                        }
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {t('dpo.external')}
                      </span>
                    </label>
                  </div>
                </div>

                {/* External Company */}
                {!dpoForm.is_internal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('dpo.companyLabel')}
                    </label>
                    <input
                      type="text"
                      value={dpoForm.company_name || ''}
                      onChange={(e) =>
                        setDPOForm({ ...dpoForm, company_name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder={t('dpo.companyPlaceholder')}
                    />
                  </div>
                )}

                {/* Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('dpo.emailLabel')}
                    </label>
                    <input
                      type="email"
                      value={dpoForm.dpo_email || ''}
                      onChange={(e) =>
                        setDPOForm({ ...dpoForm, dpo_email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="dpo@firma.ro"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('dpo.phoneLabel')}
                    </label>
                    <input
                      type="tel"
                      value={dpoForm.dpo_phone || ''}
                      onChange={(e) =>
                        setDPOForm({ ...dpoForm, dpo_phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="0712345678"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('dpo.appointmentDateLabel')}
                    </label>
                    <input
                      type="date"
                      value={dpoForm.appointment_date || ''}
                      onChange={(e) =>
                        setDPOForm({
                          ...dpoForm,
                          appointment_date: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('dpo.contractExpiryLabel')}
                    </label>
                    <input
                      type="date"
                      value={dpoForm.contract_expiry || ''}
                      onChange={(e) =>
                        setDPOForm({
                          ...dpoForm,
                          contract_expiry: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                {/* ANSPDCP */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={dpoForm.anspdcp_notified}
                      onChange={(e) =>
                        setDPOForm({
                          ...dpoForm,
                          anspdcp_notified: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t('dpo.anspdcpNotified')}
                    </span>
                  </label>
                </div>

                {dpoForm.anspdcp_notified && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('dpo.anspdcpNotificationDateLabel')}
                    </label>
                    <input
                      type="date"
                      value={dpoForm.anspdcp_notification_date || ''}
                      onChange={(e) =>
                        setDPOForm({
                          ...dpoForm,
                          anspdcp_notification_date: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dpo.notesLabel')}
                  </label>
                  <textarea
                    value={dpoForm.notes || ''}
                    onChange={(e) =>
                      setDPOForm({ ...dpoForm, notes: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={t('dpo.notesPlaceholder')}
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveDPO}
                    disabled={loading || !dpoForm.dpo_name}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? t('dpo.saving') : t('dpo.save')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Processing Activity Modal */}
      {processingModal && (
        <FormModal
          title={
            editingProcessing
              ? t('processing.editTitle')
              : t('processing.newTitle')
          }
          isOpen={processingModal}
          onClose={() => {
            setProcessingModal(false)
            setProcessingForm(emptyProcessingForm)
            setEditingProcessing(null)
          }}
          onSubmit={
            editingProcessing ? handleUpdateProcessing : handleCreateProcessing
          }
          submitLabel={editingProcessing ? t('actions.update') : t('actions.create')}
          loading={loading}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('processing.activityNameLabel')}
              </label>
              <input
                type="text"
                value={processingForm.activity_name}
                onChange={(e) =>
                  setProcessingForm({
                    ...processingForm,
                    activity_name: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder={t('processing.activityNamePlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('processing.purposeLabel')}
              </label>
              <textarea
                value={processingForm.purpose}
                onChange={(e) =>
                  setProcessingForm({ ...processingForm, purpose: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder={t('processing.purposePlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('processing.legalBasisLabel')}
              </label>
              <select
                value={processingForm.legal_basis}
                onChange={(e) =>
                  setProcessingForm({
                    ...processingForm,
                    legal_basis: e.target.value as LegalBasis,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {Object.entries(legalBasisLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('processing.dataCategoriesLabel')}
              </label>
              <input
                type="text"
                value={processingForm.data_categories.join(', ')}
                onChange={(e) =>
                  setProcessingForm({
                    ...processingForm,
                    data_categories: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder={t('processing.dataCategoriesPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('processing.dataSubjectsLabel')}
              </label>
              <input
                type="text"
                value={processingForm.data_subjects.join(', ')}
                onChange={(e) =>
                  setProcessingForm({
                    ...processingForm,
                    data_subjects: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder={t('processing.dataSubjectsPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('processing.retentionPeriodLabel')}
              </label>
              <input
                type="text"
                value={processingForm.retention_period}
                onChange={(e) =>
                  setProcessingForm({
                    ...processingForm,
                    retention_period: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder={t('processing.retentionPeriodPlaceholder')}
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={processingForm.cross_border_transfer}
                  onChange={(e) =>
                    setProcessingForm({
                      ...processingForm,
                      cross_border_transfer: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('processing.crossBorderTransfer')}
                </span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={processingForm.dpia_required}
                  onChange={(e) =>
                    setProcessingForm({
                      ...processingForm,
                      dpia_required: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('processing.dpiaRequired')}
                </span>
              </label>
            </div>

            {processingForm.dpia_required && (
              <>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={processingForm.dpia_completed}
                      onChange={(e) =>
                        setProcessingForm({
                          ...processingForm,
                          dpia_completed: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t('processing.dpiaCompleted')}
                    </span>
                  </label>
                </div>

                {processingForm.dpia_completed && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('processing.dpiaDateLabel')}
                    </label>
                    <input
                      type="date"
                      value={processingForm.dpia_date}
                      onChange={(e) =>
                        setProcessingForm({
                          ...processingForm,
                          dpia_date: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('processing.statusLabel')}
              </label>
              <select
                value={processingForm.status}
                onChange={(e) =>
                  setProcessingForm({
                    ...processingForm,
                    status: e.target.value as ProcessingActivityStatus,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {Object.entries(statusLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </FormModal>
      )}

      {/* Consent Modal */}
      {consentModal && (
        <FormModal
          title={
            editingConsent ? t('consent.editTitle') : t('consent.newTitle')
          }
          isOpen={consentModal}
          onClose={() => {
            setConsentModal(false)
            setConsentForm(emptyConsentForm)
            setEditingConsent(null)
          }}
          onSubmit={editingConsent ? handleUpdateConsent : handleCreateConsent}
          submitLabel={editingConsent ? t('actions.update') : t('actions.create')}
          loading={loading}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('consent.personNameLabel')}
              </label>
              <input
                type="text"
                value={consentForm.person_name}
                onChange={(e) =>
                  setConsentForm({ ...consentForm, person_name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder={t('consent.personNamePlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('consent.emailLabel')}
              </label>
              <input
                type="email"
                value={consentForm.person_email}
                onChange={(e) =>
                  setConsentForm({ ...consentForm, person_email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="email@exemplu.ro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('consent.typeLabel')}
              </label>
              <select
                value={consentForm.consent_type}
                onChange={(e) =>
                  setConsentForm({
                    ...consentForm,
                    consent_type: e.target.value as ConsentType,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {Object.entries(consentTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('consent.purposeLabel')}
              </label>
              <textarea
                value={consentForm.purpose}
                onChange={(e) =>
                  setConsentForm({ ...consentForm, purpose: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder={t('consent.purposePlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('consent.givenAtLabel')}
              </label>
              <input
                type="date"
                value={consentForm.given_at}
                onChange={(e) =>
                  setConsentForm({ ...consentForm, given_at: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('consent.notesLabel')}
              </label>
              <textarea
                value={consentForm.notes}
                onChange={(e) =>
                  setConsentForm({ ...consentForm, notes: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder={t('consent.notesPlaceholder')}
              />
            </div>
          </div>
        </FormModal>
      )}

      {/* Delete Processing Confirm Dialog */}
      {deleteProcessingId && (
        <ConfirmDialog
          isOpen={!!deleteProcessingId}
          onClose={() => setDeleteProcessingId(null)}
          onConfirm={handleDeleteProcessing}
          title={t('confirm.deleteTitle')}
          message={t('confirm.deleteProcessingMessage')}
          confirmLabel={t('actions.delete')}
          cancelLabel={t('actions.cancel')}
          variant="danger"
        />
      )}

      {/* Delete Consent Confirm Dialog */}
      {deleteConsentId && (
        <ConfirmDialog
          isOpen={!!deleteConsentId}
          onClose={() => setDeleteConsentId(null)}
          onConfirm={handleDeleteConsent}
          title={t('confirm.deleteTitle')}
          message={t('confirm.deleteConsentMessage')}
          confirmLabel={t('actions.delete')}
          cancelLabel={t('actions.cancel')}
          variant="danger"
        />
      )}
    </div>
  )
}
