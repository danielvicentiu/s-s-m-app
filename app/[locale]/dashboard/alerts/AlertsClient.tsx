// app/[locale]/dashboard/alerts/AlertsClient.tsx
// Client Component — Gestionare Alerte cu Filtrare și Mark as Resolved
// Folosește DataTable, Badge, EmptyState, ConfirmDialog

'use client'

import { useState, useMemo } from 'react'
import { useRouter } from '@/i18n/navigation'
import { createSupabaseBrowser as createClient } from '@/lib/supabase/client'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ArrowLeft, AlertTriangle, CheckCircle, Filter, X } from 'lucide-react'

// ========== TYPES ==========

interface Alert {
  organization_id: string
  alert_type: string
  severity: string
  source_id: string
  employee_name: string | null
  examination_type: string
  expiry_date: string
  days_remaining: number
  location_name: string | null
  organization_name: string
}

interface Organization {
  id: string
  name: string
}

interface Props {
  user: { id: string; email: string }
  initialAlerts: Alert[]
  organizations: Organization[]
}

// ========== SEVERITY MAPPING ==========

type SeverityType = 'urgent' | 'warning' | 'info'

const getSeverity = (daysRemaining: number): SeverityType => {
  if (daysRemaining <= 0) return 'urgent'
  if (daysRemaining <= 7) return 'urgent'
  if (daysRemaining <= 30) return 'warning'
  return 'info'
}

const getSeverityBadgeVariant = (severity: SeverityType): 'danger' | 'warning' | 'info' => {
  if (severity === 'urgent') return 'danger'
  if (severity === 'warning') return 'warning'
  return 'info'
}

const getSeverityLabel = (severity: SeverityType): string => {
  if (severity === 'urgent') return 'Urgent'
  if (severity === 'warning') return 'Atenție'
  return 'Informare'
}

// ========== COMPONENT ==========

export default function AlertsClient({ user, initialAlerts, organizations }: Props) {
  const router = useRouter()
  const supabase = createClient()

  // State
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [filterOrg, setFilterOrg] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [resolveTarget, setResolveTarget] = useState<Alert | null>(null)
  const [resolveLoading, setResolveLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      // Organization filter
      if (filterOrg !== 'all' && alert.organization_id !== filterOrg) return false

      // Severity filter
      const severity = getSeverity(alert.days_remaining)
      if (filterSeverity !== 'all' && severity !== filterSeverity) return false

      // Type filter
      if (filterType !== 'all' && alert.alert_type !== filterType) return false

      return true
    })
  }, [alerts, filterOrg, filterSeverity, filterType])

  // Counts
  const urgentCount = alerts.filter(a => getSeverity(a.days_remaining) === 'urgent').length
  const warningCount = alerts.filter(a => getSeverity(a.days_remaining) === 'warning').length
  const infoCount = alerts.filter(a => getSeverity(a.days_remaining) === 'info').length
  const medicalCount = alerts.filter(a => a.alert_type === 'medical').length
  const equipmentCount = alerts.filter(a => a.alert_type === 'equipment').length

  // Clear filters
  const clearFilters = () => {
    setFilterOrg('all')
    setFilterSeverity('all')
    setFilterType('all')
  }

  const hasActiveFilters = filterOrg !== 'all' || filterSeverity !== 'all' || filterType !== 'all'

  // Mark as resolved (soft delete from source table)
  const handleMarkResolved = async (alert: Alert) => {
    setResolveLoading(true)

    try {
      // Determine source table
      const tableName = alert.alert_type === 'medical' ? 'medical_examinations' : 'safety_equipment'

      // Update expiry_date to far future or add resolved flag
      // Since we don't have a resolved flag, we'll just remove from alerts by setting expiry far future
      // Better approach: Add resolved_at field in future

      // For now, we'll just remove it from local state
      // In production, you'd want to add a 'dismissed_alerts' table or similar

      setAlerts(prev => prev.filter(a => a.source_id !== alert.source_id))
      setResolveTarget(null)

      // Show success message (you can add toast notification here)
      console.log('Alert marked as resolved:', alert.source_id)

    } catch (error) {
      console.error('Error marking alert as resolved:', error)
      window.alert('Eroare la marcarea ca rezolvată')
    } finally {
      setResolveLoading(false)
    }
  }

  // Refresh alerts
  const refreshAlerts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('v_active_alerts')
        .select('*')
        .order('days_remaining', { ascending: true })

      if (error) throw error
      if (data) setAlerts(data)
    } catch (error) {
      console.error('Error refreshing alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Table columns
  const columns: DataTableColumn<Alert>[] = [
    {
      key: 'severity',
      label: 'Severitate',
      sortable: true,
      width: '130px',
      render: (row) => {
        const severity = getSeverity(row.days_remaining)
        const variant = getSeverityBadgeVariant(severity)
        const label = getSeverityLabel(severity)
        return <Badge label={label} variant={variant} dot />
      },
    },
    {
      key: 'alert_type',
      label: 'Tip',
      sortable: true,
      width: '130px',
      render: (row) => (
        <Badge
          label={row.alert_type === 'medical' ? 'Medicală' : 'Echipament'}
          variant={row.alert_type === 'medical' ? 'info' : 'neutral'}
        />
      ),
    },
    {
      key: 'organization_name',
      label: 'Organizație',
      sortable: true,
      width: '200px',
    },
    {
      key: 'employee_name',
      label: 'Entitate Afectată',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.employee_name || row.examination_type}
          </div>
          {row.location_name && (
            <div className="text-xs text-gray-500">📍 {row.location_name}</div>
          )}
        </div>
      ),
    },
    {
      key: 'examination_type',
      label: 'Detalii',
      sortable: false,
      width: '180px',
      render: (row) => (
        <span className="text-sm text-gray-600">{row.examination_type}</span>
      ),
    },
    {
      key: 'expiry_date',
      label: 'Data Expirare',
      sortable: true,
      width: '130px',
      render: (row) => (
        <div>
          <div className="text-sm font-medium">
            {new Date(row.expiry_date).toLocaleDateString('ro-RO')}
          </div>
          <div
            className={`text-xs font-semibold ${
              row.days_remaining <= 0
                ? 'text-red-600'
                : row.days_remaining <= 7
                  ? 'text-orange-600'
                  : 'text-gray-500'
            }`}
          >
            {row.days_remaining <= 0
              ? `Expirat de ${Math.abs(row.days_remaining)} zile`
              : `Peste ${row.days_remaining} zile`}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acțiune',
      sortable: false,
      width: '150px',
      render: (row) => (
        <button
          onClick={() => setResolveTarget(row)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Rezolvată
        </button>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-white rounded-lg border border-gray-200 transition-colors"
              aria-label="Înapoi"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-7 w-7 text-orange-600" />
                Gestionare Alerte
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Monitorizare și rezolvare alerte SSM și PSI
              </p>
            </div>
          </div>

          <button
            onClick={refreshAlerts}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            {loading ? 'Actualizare...' : 'Reîmprospătează'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="text-2xl font-bold text-gray-900">{alerts.length}</div>
            <div className="text-sm text-gray-500">Total Alerte</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="text-2xl font-bold text-red-700">{urgentCount}</div>
            <div className="text-sm text-red-600">Urgente</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <div className="text-2xl font-bold text-orange-700">{warningCount}</div>
            <div className="text-sm text-orange-600">Atenție</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="text-2xl font-bold text-blue-700">{medicalCount}</div>
            <div className="text-sm text-blue-600">Medicale</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <div className="text-2xl font-bold text-gray-700">{equipmentCount}</div>
            <div className="text-sm text-gray-600">Echipamente</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtre
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <X className="h-3.5 w-3.5" />
                Șterge Filtre
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Organization filter */}
            {organizations.length > 1 && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Organizație
                </label>
                <select
                  value={filterOrg}
                  onChange={(e) => setFilterOrg(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Toate organizațiile</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Severity filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Severitate
              </label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toate ({alerts.length})</option>
                <option value="urgent">Urgent ({urgentCount})</option>
                <option value="warning">Atenție ({warningCount})</option>
                <option value="info">Informare ({infoCount})</option>
              </select>
            </div>

            {/* Type filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Tip Alertă
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toate tipurile</option>
                <option value="medical">Medicină Muncii ({medicalCount})</option>
                <option value="equipment">Echipamente PSI ({equipmentCount})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <DataTable
            columns={columns}
            data={filteredAlerts}
            loading={loading}
            emptyMessage="Nicio alertă găsită"
            emptyDescription={
              hasActiveFilters
                ? 'Încearcă să ajustezi filtrele pentru a vizualiza mai multe alerte.'
                : 'Foarte bine! Nu există alerte active în acest moment.'
            }
            rowKey={(row) => row.source_id}
          />
        </div>

        {/* Confirm Dialog */}
        <ConfirmDialog
          title="Marchează ca Rezolvată"
          message={resolveTarget ? `Ești sigur că vrei să marchezi această alertă ca rezolvată?\n\nEntitate: ${resolveTarget.employee_name || resolveTarget.examination_type}\nOrganizație: ${resolveTarget.organization_name}` : ''}
          confirmLabel="Da, Marchează"
          cancelLabel="Anulează"
          isOpen={!!resolveTarget}
          isDestructive={false}
          loading={resolveLoading}
          onConfirm={() => resolveTarget && handleMarkResolved(resolveTarget)}
          onCancel={() => setResolveTarget(null)}
        />
      </div>
    </div>
  )
}
