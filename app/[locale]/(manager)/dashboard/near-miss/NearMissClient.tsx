// ============================================================
// S-S-M.RO — Near-Miss Reporting Client Component
// File: app/[locale]/dashboard/near-miss/NearMissClient.tsx
// ============================================================
'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'

// ============================================================
// TYPES
// ============================================================

type NearMissStatus = 'raportat' | 'in_investigare' | 'masuri_aplicate' | 'inchis' | 'anulat'
type NearMissSeverity = 'minor' | 'moderate' | 'major' | 'critical' | 'fatal'
type NearMissCategory =
  | 'cadere_nivel'
  | 'cadere_inaltime'
  | 'lovire'
  | 'taiere'
  | 'electrocutare'
  | 'substante_chimice'
  | 'incendiu'
  | 'explozie'
  | 'alunecare'
  | 'prindere_echipament'
  | 'ergonomic'
  | 'psihosocial'
  | 'transport'
  | 'altul'

interface NearMissReport {
  id: string
  organization_id: string
  report_number: string
  reported_by: string
  reported_by_user_id: string | null
  incident_date: string
  incident_time: string | null
  location: string
  description: string
  potential_severity: NearMissSeverity
  category: NearMissCategory
  witnesses: string[]
  immediate_actions: string | null
  root_cause: string | null
  corrective_actions: string | null
  responsible_person: string | null
  deadline: string | null
  status: NearMissStatus
  photos_paths: string[]
  investigation_notes: string | null
  closed_by: string | null
  closed_at: string | null
  created_at: string
  updated_at: string
}

interface NearMissStats {
  summary: {
    total: number
    open: number
    inInvestigation: number
    closedThisMonth: number
  }
  byCategory: Array<{ category: string; count: number }>
  bySeverity: Array<{ severity: string; count: number }>
  byStatus: Array<{ status: string; count: number }>
  monthlyTrend: Array<{ month: string; count: number }>
}

// ============================================================
// LABELS
// ============================================================

const CATEGORY_LABELS: Record<NearMissCategory, string> = {
  cadere_nivel: 'Cădere la același nivel',
  cadere_inaltime: 'Cădere de la înălțime',
  lovire: 'Lovire de/cu obiecte',
  taiere: 'Tăiere/Înțepare',
  electrocutare: 'Electrocutare',
  substante_chimice: 'Substanțe chimice',
  incendiu: 'Incendiu',
  explozie: 'Explozie',
  alunecare: 'Alunecare',
  prindere_echipament: 'Prindere în echipament',
  ergonomic: 'Ergonomic/Suprasolicitate',
  psihosocial: 'Risc psihosocial',
  transport: 'Transport/Circulație',
  altul: 'Altul',
}

const STATUS_LABELS: Record<NearMissStatus, string> = {
  raportat: 'Raportat',
  in_investigare: 'În investigare',
  masuri_aplicate: 'Măsuri aplicate',
  inchis: 'Închis',
  anulat: 'Anulat',
}

const SEVERITY_LABELS: Record<NearMissSeverity, string> = {
  minor: 'Minor',
  moderate: 'Moderat',
  major: 'Major',
  critical: 'Critic',
  fatal: 'Fatal',
}

// ============================================================
// COLORS
// ============================================================

const STATUS_COLORS: Record<NearMissStatus, string> = {
  raportat: 'bg-blue-100 text-blue-800 border-blue-200',
  in_investigare: 'bg-orange-100 text-orange-800 border-orange-200',
  masuri_aplicate: 'bg-green-100 text-green-800 border-green-200',
  inchis: 'bg-gray-100 text-gray-800 border-gray-200',
  anulat: 'bg-red-100 text-red-800 border-red-200',
}

const SEVERITY_COLORS: Record<NearMissSeverity, string> = {
  minor: 'bg-green-100 text-green-800 border-green-200',
  moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  major: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200',
  fatal: 'bg-gray-900 text-white border-gray-900',
}

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

// ============================================================
// PROPS
// ============================================================

interface Props {
  user: { id: string; email: string }
  organizations: Array<{ id: string; name: string; cui?: string }>
  initialSelectedOrg: string
}

// ============================================================
// COMPONENT
// ============================================================

export default function NearMissClient({ user, organizations, initialSelectedOrg }: Props) {
  const [selectedOrgId, setSelectedOrgId] = useState(initialSelectedOrg)
  const [activeTab, setActiveTab] = useState<'reports' | 'statistics'>('reports')
  const [reports, setReports] = useState<NearMissReport[]>([])
  const [stats, setStats] = useState<NearMissStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterSeverity, setFilterSeverity] = useState<string>('')
  const [filterPeriod, setFilterPeriod] = useState<string>('30')

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<NearMissReport | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    reported_by: '',
    incident_date: new Date().toISOString().split('T')[0],
    incident_time: '',
    location: '',
    description: '',
    potential_severity: 'moderate' as NearMissSeverity,
    category: 'altul' as NearMissCategory,
    witnesses: [] as string[],
    immediate_actions: '',
  })

  // ============================================================
  // DATA LOADING
  // ============================================================

  const loadReports = useCallback(async () => {
    if (!selectedOrgId) {
      setError('Selectează o organizație pentru a vizualiza rapoartele.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Calculate date range based on filter
      const dateTo = new Date().toISOString().split('T')[0]
      const dateFrom = new Date()
      dateFrom.setDate(dateFrom.getDate() - parseInt(filterPeriod))
      const dateFromStr = dateFrom.toISOString().split('T')[0]

      const params = new URLSearchParams({
        organization_id: selectedOrgId,
        date_from: dateFromStr,
        date_to: dateTo,
      })

      if (filterStatus) params.append('status', filterStatus)
      if (filterSeverity) params.append('severity', filterSeverity)

      const [reportsRes, statsRes] = await Promise.all([
        fetch(`/api/near-miss?${params.toString()}`),
        fetch(`/api/near-miss/stats?organization_id=${selectedOrgId}`),
      ])

      if (!reportsRes.ok) throw new Error('Failed to fetch reports')
      if (!statsRes.ok) throw new Error('Failed to fetch stats')

      const reportsJson = await reportsRes.json()
      const statsJson = await statsRes.json()

      setReports(reportsJson.reports || [])
      setStats(statsJson)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută')
    } finally {
      setLoading(false)
    }
  }, [selectedOrgId, filterStatus, filterSeverity, filterPeriod])

  useEffect(() => {
    loadReports()
  }, [loadReports])

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.reported_by ||
      !formData.incident_date ||
      !formData.location ||
      !formData.description
    ) {
      alert('Te rog completează toate câmpurile obligatorii.')
      return
    }

    try {
      const payload = {
        organization_id: selectedOrgId,
        ...formData,
      }

      const res = await fetch('/api/near-miss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to create report')

      alert('Raport creat cu succes!')
      setShowAddModal(false)
      setFormData({
        reported_by: '',
        incident_date: new Date().toISOString().split('T')[0],
        incident_time: '',
        location: '',
        description: '',
        potential_severity: 'moderate',
        category: 'altul',
        witnesses: [],
        immediate_actions: '',
      })
      loadReports()
    } catch (err) {
      alert('Eroare la crearea raportului: ' + (err instanceof Error ? err.message : 'Eroare necunoscută'))
    }
  }

  const handleUpdateReport = async (updatedData: Partial<NearMissReport>) => {
    if (!selectedReport) return

    try {
      const res = await fetch(`/api/near-miss/${selectedReport.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      })

      if (!res.ok) throw new Error('Failed to update report')

      alert('Raport actualizat cu succes!')
      setShowDetailModal(false)
      setSelectedReport(null)
      loadReports()
    } catch (err) {
      alert('Eroare la actualizarea raportului: ' + (err instanceof Error ? err.message : 'Eroare necunoscută'))
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Ești sigur că vrei să ștergi acest raport?')) return

    try {
      const res = await fetch(`/api/near-miss/${reportId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete report')

      alert('Raport șters cu succes!')
      setShowDetailModal(false)
      setSelectedReport(null)
      loadReports()
    } catch (err) {
      alert('Eroare la ștergerea raportului: ' + (err instanceof Error ? err.message : 'Eroare necunoscută'))
    }
  }

  const handleRowClick = (report: NearMissReport) => {
    setSelectedReport(report)
    setShowDetailModal(true)
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Near-Miss Reporting</h1>
          <p className="text-gray-600 mt-1">Raportare incidente aproape-accidente SSM</p>
        </div>

        {/* Organization Selector */}
        <div className="flex items-center gap-4">
          <select
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Toate organizațiile</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
          >
            + Raportează Incident
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <p className="text-sm text-gray-600">Total rapoarte</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.summary.total}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <p className="text-sm text-gray-600">Deschise</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{stats.summary.open}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <p className="text-sm text-gray-600">În investigare</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.summary.inInvestigation}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <p className="text-sm text-gray-600">Închise luna aceasta</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.summary.closedThisMonth}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-3 font-medium transition ${
                activeTab === 'reports'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rapoarte
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`px-6 py-3 font-medium transition ${
                activeTab === 'statistics'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Statistici
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'reports' ? (
            <ReportsTab
              reports={reports}
              loading={loading}
              error={error}
              filterStatus={filterStatus}
              filterSeverity={filterSeverity}
              filterPeriod={filterPeriod}
              onFilterStatusChange={setFilterStatus}
              onFilterSeverityChange={setFilterSeverity}
              onFilterPeriodChange={setFilterPeriod}
              onRowClick={handleRowClick}
            />
          ) : (
            <StatisticsTab stats={stats} loading={loading} error={error} />
          )}
        </div>
      </div>

      {/* Add Report Modal */}
      {showAddModal && (
        <AddReportModal
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmitReport}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedReport && (
        <DetailModal
          report={selectedReport}
          onUpdate={handleUpdateReport}
          onDelete={handleDeleteReport}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedReport(null)
          }}
        />
      )}
    </div>
  )
}

// ============================================================
// REPORTS TAB
// ============================================================

interface ReportsTabProps {
  reports: NearMissReport[]
  loading: boolean
  error: string | null
  filterStatus: string
  filterSeverity: string
  filterPeriod: string
  onFilterStatusChange: (value: string) => void
  onFilterSeverityChange: (value: string) => void
  onFilterPeriodChange: (value: string) => void
  onRowClick: (report: NearMissReport) => void
}

function ReportsTab({
  reports,
  loading,
  error,
  filterStatus,
  filterSeverity,
  filterPeriod,
  onFilterStatusChange,
  onFilterSeverityChange,
  onFilterPeriodChange,
  onRowClick,
}: ReportsTabProps) {
  if (loading) {
    return <div className="text-center py-12 text-gray-500">Se încarcă...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">Eroare: {error}</div>
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={filterStatus}
          onChange={(e) => onFilterStatusChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Toate statusurile</option>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={filterSeverity}
          onChange={(e) => onFilterSeverityChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Toate severitățile</option>
          {Object.entries(SEVERITY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={filterPeriod}
          onChange={(e) => onFilterPeriodChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="30">Ultimele 30 zile</option>
          <option value="90">Ultimele 90 zile</option>
          <option value="365">Ultimul an</option>
        </select>
      </div>

      {/* Table */}
      {reports.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Nu există rapoarte în această perioadă.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nr. raport
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data incident
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Locație
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categorie
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severitate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Raportat de
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr
                  key={report.id}
                  onClick={() => onRowClick(report)}
                  className="hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.report_number}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(report.incident_date).toLocaleDateString('ro-RO')}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{report.location}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {CATEGORY_LABELS[report.category]}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${
                        SEVERITY_COLORS[report.potential_severity]
                      }`}
                    >
                      {SEVERITY_LABELS[report.potential_severity]}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${
                        STATUS_COLORS[report.status]
                      }`}
                    >
                      {STATUS_LABELS[report.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{report.reported_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ============================================================
// STATISTICS TAB
// ============================================================

interface StatisticsTabProps {
  stats: NearMissStats | null
  loading: boolean
  error: string | null
}

function StatisticsTab({ stats, loading, error }: StatisticsTabProps) {
  if (loading) {
    return <div className="text-center py-12 text-gray-500">Se încarcă...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">Eroare: {error}</div>
  }

  if (!stats) {
    return <div className="text-center py-12 text-gray-500">Nu există date disponibile.</div>
  }

  // Prepare category chart data with labels
  const categoryData = stats.byCategory.slice(0, 5).map((item) => ({
    name: CATEGORY_LABELS[item.category as NearMissCategory] || item.category,
    count: item.count,
  }))

  // Prepare severity chart data
  const severityData = stats.bySeverity.map((item) => ({
    name: SEVERITY_LABELS[item.severity as NearMissSeverity] || item.severity,
    value: item.count,
  }))

  // Prepare monthly trend data
  const monthlyData = stats.monthlyTrend.map((item) => ({
    month: item.month,
    count: item.count,
  }))

  return (
    <div className="space-y-8">
      {/* Category Distribution */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 categorii incidente</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Trend */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend lunar (ultimele 12 luni)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} name="Rapoarte" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Severity Distribution */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuție severitate</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={severityData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {severityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ============================================================
// ADD REPORT MODAL
// ============================================================

interface AddReportModalProps {
  formData: {
    reported_by: string
    incident_date: string
    incident_time: string
    location: string
    description: string
    potential_severity: NearMissSeverity
    category: NearMissCategory
    witnesses: string[]
    immediate_actions: string
  }
  onFormDataChange: (data: any) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

function AddReportModal({ formData, onFormDataChange, onSubmit, onClose }: AddReportModalProps) {
  const [witnessInput, setWitnessInput] = useState('')

  const addWitness = () => {
    if (witnessInput.trim()) {
      onFormDataChange({
        ...formData,
        witnesses: [...formData.witnesses, witnessInput.trim()],
      })
      setWitnessInput('')
    }
  }

  const removeWitness = (index: number) => {
    onFormDataChange({
      ...formData,
      witnesses: formData.witnesses.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Raportează Incident Near-Miss</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Reported By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Raportat de <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.reported_by}
              onChange={(e) => onFormDataChange({ ...formData, reported_by: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data incident <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.incident_date}
                onChange={(e) => onFormDataChange({ ...formData, incident_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ora incident</label>
              <input
                type="time"
                value={formData.incident_time}
                onChange={(e) => onFormDataChange({ ...formData, incident_time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Locație <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => onFormDataChange({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ex: Hală producție, linia 2"
              required
            />
          </div>

          {/* Category and Severity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categorie <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  onFormDataChange({ ...formData, category: e.target.value as NearMissCategory })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severitate potențială <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.potential_severity}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    potential_severity: e.target.value as NearMissSeverity,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {Object.entries(SEVERITY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descriere <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Descrie incidentul în detaliu..."
              required
            />
          </div>

          {/* Witnesses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Martori</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={witnessInput}
                onChange={(e) => setWitnessInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addWitness())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nume martor"
              />
              <button
                type="button"
                onClick={addWitness}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Adaugă
              </button>
            </div>
            {formData.witnesses.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.witnesses.map((witness, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                  >
                    {witness}
                    <button
                      type="button"
                      onClick={() => removeWitness(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Immediate Actions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Acțiuni imediate</label>
            <textarea
              value={formData.immediate_actions}
              onChange={(e) => onFormDataChange({ ...formData, immediate_actions: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Ce acțiuni au fost luate imediat după incident?"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Salvează raport
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Anulează
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================================
// DETAIL MODAL
// ============================================================

interface DetailModalProps {
  report: NearMissReport
  onUpdate: (data: Partial<NearMissReport>) => void
  onDelete: (id: string) => void
  onClose: () => void
}

function DetailModal({ report, onUpdate, onDelete, onClose }: DetailModalProps) {
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState(report)

  const handleSave = () => {
    onUpdate(editData)
    setEditMode(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{report.report_number}</h2>
            <p className="text-sm text-gray-600">
              {new Date(report.incident_date).toLocaleDateString('ro-RO')}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Severity Badges */}
          <div className="flex gap-2">
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full border ${
                STATUS_COLORS[report.status]
              }`}
            >
              {STATUS_LABELS[report.status]}
            </span>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full border ${
                SEVERITY_COLORS[report.potential_severity]
              }`}
            >
              {SEVERITY_LABELS[report.potential_severity]}
            </span>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Raportat de</p>
              <p className="font-medium">{report.reported_by}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Locație</p>
              <p className="font-medium">{report.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Categorie</p>
              <p className="font-medium">{CATEGORY_LABELS[report.category]}</p>
            </div>
            {report.incident_time && (
              <div>
                <p className="text-sm text-gray-600">Ora</p>
                <p className="font-medium">{report.incident_time}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Descriere</p>
            <p className="text-gray-900">{report.description}</p>
          </div>

          {/* Witnesses */}
          {report.witnesses && report.witnesses.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Martori</p>
              <div className="flex flex-wrap gap-2">
                {report.witnesses.map((witness, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {witness}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Immediate Actions */}
          {report.immediate_actions && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Acțiuni imediate</p>
              <p className="text-gray-900">{report.immediate_actions}</p>
            </div>
          )}

          {/* Edit mode fields */}
          {editMode ? (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value as NearMissStatus })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cauză rădăcină</label>
                <textarea
                  value={editData.root_cause || ''}
                  onChange={(e) => setEditData({ ...editData, root_cause: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Acțiuni corective</label>
                <textarea
                  value={editData.corrective_actions || ''}
                  onChange={(e) => setEditData({ ...editData, corrective_actions: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsabil</label>
                  <input
                    type="text"
                    value={editData.responsible_person || ''}
                    onChange={(e) => setEditData({ ...editData, responsible_person: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Termen limită</label>
                  <input
                    type="date"
                    value={editData.deadline || ''}
                    onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            report.root_cause ||
            report.corrective_actions ||
            report.responsible_person ||
            report.deadline ? (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                {report.root_cause && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Cauză rădăcină</p>
                    <p className="text-gray-900">{report.root_cause}</p>
                  </div>
                )}
                {report.corrective_actions && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Acțiuni corective</p>
                    <p className="text-gray-900">{report.corrective_actions}</p>
                  </div>
                )}
                {report.responsible_person && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Responsabil</p>
                    <p className="text-gray-900">{report.responsible_person}</p>
                  </div>
                )}
                {report.deadline && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Termen limită</p>
                    <p className="text-gray-900">
                      {new Date(report.deadline).toLocaleDateString('ro-RO')}
                    </p>
                  </div>
                )}
              </div>
            ) : null
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Salvează modificări
                </button>
                <button
                  onClick={() => {
                    setEditMode(false)
                    setEditData(report)
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Anulează
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Editează
                </button>
                <button
                  onClick={() => onDelete(report.id)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                >
                  Șterge
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
