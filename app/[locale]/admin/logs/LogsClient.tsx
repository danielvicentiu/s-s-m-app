'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
  Info,
  Calendar,
  X
} from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase/client'

interface SystemLog {
  id: string
  timestamp: string
  level: 'info' | 'warn' | 'error'
  source: string
  message: string
  stack_trace?: string | null
  user_id?: string | null
  organization_id?: string | null
  metadata?: any
  profiles?: {
    full_name: string
    avatar_url?: string | null
  } | null
  organizations?: {
    name: string
    cui?: string | null
  } | null
}

interface LogsClientProps {
  logs: SystemLog[]
  locale: string
}

const LEVEL_CONFIG = {
  info: {
    label: 'Info',
    icon: Info,
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    border: 'border-blue-200'
  },
  warn: {
    label: 'Warn',
    icon: AlertTriangle,
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    dot: 'bg-orange-500',
    border: 'border-orange-200'
  },
  error: {
    label: 'Error',
    icon: AlertCircle,
    bg: 'bg-red-100',
    text: 'text-red-700',
    dot: 'bg-red-500',
    border: 'border-red-200'
  }
}

export default function LogsClient({ logs: initialLogs, locale }: LogsClientProps) {
  const [logs, setLogs] = useState<SystemLog[]>(initialLogs)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<string[]>([])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(30)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  // Auto-refresh logic
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(async () => {
      await fetchLogs()
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const supabase = createSupabaseBrowser()
      const { data, error } = await supabase
        .from('system_logs')
        .select(`
          *,
          profiles(full_name, avatar_url),
          organizations(name, cui)
        `)
        .order('timestamp', { ascending: false })
        .limit(200)

      if (error) throw error
      setLogs(data || [])
    } catch (err) {
      console.error('Error fetching logs:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filtrare și căutare
  const filteredLogs = useMemo(() => {
    let result = logs

    // Filtrare per nivel
    if (levelFilter.length > 0) {
      result = result.filter(log => levelFilter.includes(log.level))
    }

    // Filtrare per dată
    if (dateFrom) {
      result = result.filter(log => new Date(log.timestamp) >= new Date(dateFrom))
    }
    if (dateTo) {
      const endDate = new Date(dateTo)
      endDate.setHours(23, 59, 59, 999)
      result = result.filter(log => new Date(log.timestamp) <= endDate)
    }

    // Căutare text
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(log =>
        log.message.toLowerCase().includes(q) ||
        log.source.toLowerCase().includes(q) ||
        log.profiles?.full_name?.toLowerCase().includes(q) ||
        log.organizations?.name?.toLowerCase().includes(q)
      )
    }

    return result
  }, [logs, levelFilter, dateFrom, dateTo, search])

  // Export CSV
  const handleExport = () => {
    const headers = ['Timestamp', 'Level', 'Source', 'Message', 'User', 'Organization', 'Stack Trace']
    const rows = filteredLogs.map(log => [
      new Date(log.timestamp).toLocaleString('ro-RO'),
      log.level.toUpperCase(),
      log.source,
      log.message,
      log.profiles?.full_name || '—',
      log.organizations?.name || '—',
      log.stack_trace || '—'
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // Toggle expandare stack trace
  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Toggle level filter
  const toggleLevelFilter = (level: string) => {
    setLevelFilter(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    )
  }

  // Clear all filters
  const clearFilters = () => {
    setSearch('')
    setLevelFilter([])
    setDateFrom('')
    setDateTo('')
  }

  const hasActiveFilters = search || levelFilter.length > 0 || dateFrom || dateTo

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredLogs.length} {filteredLogs.length === 1 ? 'înregistrare' : 'înregistrări'}
            {hasActiveFilters && ` (filtrate din ${logs.length})`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 space-y-4">
        {/* Row 1: Search + Level filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Caută în mesaj, sursă, utilizator..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Level filters */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Level:</span>
            {(['info', 'warn', 'error'] as const).map(level => {
              const config = LEVEL_CONFIG[level]
              const Icon = config.icon
              const isActive = levelFilter.includes(level)

              return (
                <button
                  key={level}
                  onClick={() => toggleLevelFilter(level)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    isActive
                      ? `${config.bg} ${config.text} ${config.border}`
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {config.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Row 2: Date filters + Auto-refresh */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-600">De la:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">Până la:</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
                Clear filters
              </button>
            )}
          </div>

          {/* Auto-refresh */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span className="font-medium text-gray-700">Auto-refresh</span>
            </label>

            {autoRefresh && (
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value={10}>10s</option>
                <option value={30}>30s</option>
                <option value={60}>1min</option>
                <option value={300}>5min</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium">Nu există logs</p>
            <p className="text-sm mt-1">
              {hasActiveFilters ? 'Încearcă să ajustezi filtrele' : 'Nu s-au înregistrat logs încă'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 w-[180px]">Timestamp</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 w-[100px]">Level</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 w-[140px]">Source</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Message</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 w-[150px]">User</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 w-[150px]">Organization</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700 w-[80px]">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map((log) => {
                  const config = LEVEL_CONFIG[log.level]
                  const Icon = config.icon
                  const isExpanded = expandedIds.has(log.id)
                  const hasStackTrace = log.stack_trace && log.stack_trace.trim().length > 0
                  const hasMetadata = log.metadata && Object.keys(log.metadata).length > 0

                  return (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-600 font-mono whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('ro-RO', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </td>

                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                          <Icon className="h-3.5 w-3.5" />
                          {config.label}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono">
                          {log.source}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-gray-900">
                        <div className="max-w-md">
                          {log.message}
                        </div>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div className="mt-3 space-y-2">
                            {hasStackTrace && (
                              <div>
                                <p className="text-xs font-semibold text-gray-700 mb-1">Stack Trace:</p>
                                <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto">
                                  {log.stack_trace}
                                </pre>
                              </div>
                            )}

                            {hasMetadata && (
                              <div>
                                <p className="text-xs font-semibold text-gray-700 mb-1">Metadata:</p>
                                <pre className="text-xs bg-gray-100 text-gray-800 p-3 rounded-lg overflow-x-auto">
                                  {JSON.stringify(log.metadata, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {log.profiles?.full_name || '—'}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {log.organizations?.name || '—'}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {(hasStackTrace || hasMetadata) && (
                          <button
                            onClick={() => toggleExpanded(log.id)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-gray-600" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-600" />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
