// app/[locale]/dashboard/activity/ActivityClient.tsx
// Jurnal activitate — Component client cu filtre și timeline interactiv

'use client'

import { useState, useMemo } from 'react'
import { useRouter } from '@/i18n/navigation'
import { ArrowLeft, Filter, X, User, Building2, Calendar, Activity, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import type { AuditLog } from '@/lib/types'

interface Props {
  user: { id: string; email: string }
  auditLogs: any[]
  users: { id: string; full_name: string }[]
  organizations: { id: string; name: string }[]
  uniqueActions: string[]
  uniqueEntityTypes: string[]
}

// Helper: Formatare dată și oră
function formatDateTime(dateStr: string): { date: string; time: string } {
  const d = new Date(dateStr)
  const date = d.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' })
  const time = d.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
  return { date, time }
}

// Helper: Formatare acțiune (prettify)
function formatAction(action: string): string {
  const actionMap: Record<string, string> = {
    'create': 'Creare',
    'update': 'Modificare',
    'delete': 'Ștergere',
    'login': 'Autentificare',
    'logout': 'Deconectare',
    'export': 'Export',
    'import': 'Import',
    'sync': 'Sincronizare',
    'send': 'Trimitere',
    'receive': 'Primire',
  }
  return actionMap[action.toLowerCase()] || action
}

// Helper: Formatare tip entitate (prettify)
function formatEntityType(entityType: string): string {
  const entityMap: Record<string, string> = {
    'employee': 'Angajat',
    'organization': 'Organizație',
    'contract': 'Contract',
    'medical_examination': 'Control medical',
    'equipment': 'Echipament',
    'training': 'Instruire',
    'document': 'Document',
    'user': 'Utilizator',
    'reges_connection': 'Conexiune REGES',
    'reges_outbox': 'Mesaj REGES trimis',
    'reges_receipt': 'Confirmare REGES',
    'reges_result': 'Rezultat REGES',
  }
  return entityMap[entityType] || entityType
}

// Helper: Culoare badge pentru acțiune
function getActionBadgeVariant(action: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
  const lowerAction = action.toLowerCase()
  if (lowerAction.includes('create') || lowerAction.includes('login')) return 'success'
  if (lowerAction.includes('update') || lowerAction.includes('sync')) return 'info'
  if (lowerAction.includes('delete') || lowerAction.includes('logout')) return 'danger'
  if (lowerAction.includes('export') || lowerAction.includes('send')) return 'warning'
  return 'neutral'
}

export default function ActivityClient({
  user,
  auditLogs,
  users,
  organizations,
  uniqueActions,
  uniqueEntityTypes,
}: Props) {
  const router = useRouter()

  // Filtre
  const [filterAction, setFilterAction] = useState<string>('')
  const [filterEntityType, setFilterEntityType] = useState<string>('')
  const [filterUser, setFilterUser] = useState<string>('')
  const [filterOrg, setFilterOrg] = useState<string>('')
  const [filterDateFrom, setFilterDateFrom] = useState<string>('')
  const [filterDateTo, setFilterDateTo] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)

  // Paginare
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  // Filtrare date
  const filteredLogs = useMemo(() => {
    let result = [...auditLogs]

    if (filterAction) {
      result = result.filter(log => log.action === filterAction)
    }

    if (filterEntityType) {
      result = result.filter(log => log.entity_type === filterEntityType)
    }

    if (filterUser) {
      result = result.filter(log => log.user_id === filterUser)
    }

    if (filterOrg) {
      result = result.filter(log => log.organization_id === filterOrg)
    }

    if (filterDateFrom) {
      const fromDate = new Date(filterDateFrom)
      fromDate.setHours(0, 0, 0, 0)
      result = result.filter(log => new Date(log.created_at) >= fromDate)
    }

    if (filterDateTo) {
      const toDate = new Date(filterDateTo)
      toDate.setHours(23, 59, 59, 999)
      result = result.filter(log => new Date(log.created_at) <= toDate)
    }

    return result
  }, [auditLogs, filterAction, filterEntityType, filterUser, filterOrg, filterDateFrom, filterDateTo])

  // Paginare
  const totalPages = Math.ceil(filteredLogs.length / pageSize)
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Reset paginare când se schimbă filtrele
  const handleFilterChange = (setter: (value: string) => void, value: string) => {
    setter(value)
    setCurrentPage(1)
  }

  // Clear all filters
  const clearAllFilters = () => {
    setFilterAction('')
    setFilterEntityType('')
    setFilterUser('')
    setFilterOrg('')
    setFilterDateFrom('')
    setFilterDateTo('')
    setCurrentPage(1)
  }

  const hasActiveFilters = filterAction || filterEntityType || filterUser || filterOrg || filterDateFrom || filterDateTo

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              aria-label="Înapoi la dashboard"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Jurnal activitate
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Istoric complet al acțiunilor din platformă
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-600'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filtre</span>
            {hasActiveFilters && (
              <span className="bg-white text-blue-600 px-1.5 py-0.5 rounded-full text-xs font-bold">
                {[filterAction, filterEntityType, filterUser, filterOrg, filterDateFrom, filterDateTo].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 bg-white border border-gray-200 rounded-2xl p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Filtrare</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <X className="h-3.5 w-3.5" />
                  Șterge toate
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Filtru acțiune */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tip acțiune
                </label>
                <select
                  value={filterAction}
                  onChange={(e) => handleFilterChange(setFilterAction, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toate acțiunile</option>
                  {uniqueActions.map(action => (
                    <option key={action} value={action}>
                      {formatAction(action)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtru entitate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tip entitate
                </label>
                <select
                  value={filterEntityType}
                  onChange={(e) => handleFilterChange(setFilterEntityType, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toate entitățile</option>
                  {uniqueEntityTypes.map(type => (
                    <option key={type} value={type}>
                      {formatEntityType(type)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtru utilizator */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Utilizator
                </label>
                <select
                  value={filterUser}
                  onChange={(e) => handleFilterChange(setFilterUser, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toți utilizatorii</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.full_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtru organizație */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Organizație
                </label>
                <select
                  value={filterOrg}
                  onChange={(e) => handleFilterChange(setFilterOrg, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toate organizațiile</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtru dată de la */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  De la dată
                </label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => handleFilterChange(setFilterDateFrom, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filtru dată până la */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Până la dată
                </label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => handleFilterChange(setFilterDateTo, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-gray-400" />
            <span>
              <strong className="text-gray-900">{filteredLogs.length}</strong> {filteredLogs.length === 1 ? 'acțiune' : 'acțiuni'}
              {hasActiveFilters && ` (din ${auditLogs.length} total)`}
            </span>
          </div>
        </div>

        {/* Timeline */}
        {paginatedLogs.length === 0 ? (
          <EmptyState
            title={hasActiveFilters ? 'Nicio acțiune găsită' : 'Nicio activitate înregistrată'}
            description={hasActiveFilters ? 'Încearcă să modifici filtrele aplicate' : 'Activitatea va apărea aici când vor fi înregistrate acțiuni în platformă'}
          />
        ) : (
          <>
            <div className="space-y-3">
              {paginatedLogs.map((log, index) => {
                const { date, time } = formatDateTime(log.created_at)
                const userName = log.profiles?.full_name || 'Utilizator necunoscut'
                const orgName = log.organizations?.name || 'N/A'

                return (
                  <div
                    key={log.id}
                    className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      {/* Timeline dot */}
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                        {index < paginatedLogs.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mx-auto mt-2" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              label={formatAction(log.action)}
                              variant={getActionBadgeVariant(log.action)}
                              size="sm"
                            />
                            <span className="text-sm text-gray-500">→</span>
                            <Badge
                              label={formatEntityType(log.entity_type)}
                              variant="neutral"
                              size="sm"
                            />
                          </div>
                          <div className="text-xs text-gray-500">
                            {date} • {time}
                          </div>
                        </div>

                        <div className="space-y-1.5 text-sm">
                          {/* User info */}
                          <div className="flex items-center gap-2 text-gray-700">
                            <User className="h-3.5 w-3.5 text-gray-400" />
                            <span className="font-medium">{userName}</span>
                          </div>

                          {/* Organization info */}
                          {log.organization_id && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Building2 className="h-3.5 w-3.5 text-gray-400" />
                              <span>{orgName}</span>
                            </div>
                          )}

                          {/* Metadata preview */}
                          {log.metadata && Object.keys(log.metadata).length > 0 && (
                            <details className="mt-2">
                              <summary className="cursor-pointer text-xs text-blue-600 hover:text-blue-700">
                                Vezi detalii suplimentare
                              </summary>
                              <pre className="mt-2 p-3 bg-gray-50 rounded-lg text-xs overflow-x-auto">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  {((currentPage - 1) * pageSize) + 1}–
                  {Math.min(currentPage * pageSize, filteredLogs.length)} din{' '}
                  {filteredLogs.length} rezultate
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Pagina anterioară"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <span className="text-sm text-gray-700 font-medium min-w-[60px] text-center">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Pagina următoare"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
