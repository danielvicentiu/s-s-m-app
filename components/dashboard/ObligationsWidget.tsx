'use client'

// components/dashboard/ObligationsWidget.tsx
// Widget obligații legale pe dashboard-ul organizației
// Compact = widget mic pe dashboard principal
// Full = pagină dedicată /dashboard/obligations

import { useState, useEffect } from 'react'

interface OrgObligation {
  id: string
  organization_id: string
  obligation_id: string
  org_status: string
  org_notes: string | null
  due_date: string | null
  published_at: string
  article_ref: string | null
  obligation_type: string
  obligation_text: string
  severity: string | null
  deadline_type: string | null
  deadline_details: string | null
  act_type: string
  act_number: string
  act_year: number
  act_full_name: string
  act_country: string
  act_domain: string
}

interface Stats {
  total: number
  new: number
  seen: number
  in_progress: number
  compliant: number
  non_compliant: number
  not_applicable: number
  [key: string]: number
}

interface Props {
  organizationId: string
  locale?: string
  compact?: boolean
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  new: { label: 'Nouă', color: 'bg-blue-100 text-blue-800', icon: '🆕' },
  seen: { label: 'Văzut', color: 'bg-gray-100 text-gray-700', icon: '👁️' },
  in_progress: { label: 'În lucru', color: 'bg-yellow-100 text-yellow-800', icon: '🔧' },
  compliant: { label: 'Conform', color: 'bg-green-100 text-green-800', icon: '✅' },
  non_compliant: { label: 'Neconform', color: 'bg-red-100 text-red-800', icon: '❌' },
  not_applicable: { label: 'N/A', color: 'bg-gray-50 text-gray-500', icon: '➖' },
}

const SEVERITY_BADGE: Record<string, string> = {
  critical: 'bg-red-500 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-400 text-yellow-900',
  low: 'bg-green-400 text-green-900',
}

export default function ObligationsWidget({ organizationId, locale = 'ro', compact = true }: Props) {
  const [obligations, setObligations] = useState<OrgObligation[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ org_id: organizationId })
        if (filterStatus !== 'all') params.append('status', filterStatus)
        params.append('limit', compact ? '5' : '50')
        const res = await fetch(`/api/dashboard/obligations?${params}`)
        const data = await res.json()
        setObligations(data.obligations || [])
        setStats(data.stats || null)
      } catch (err) {
        console.error('Failed to fetch obligations:', err)
      } finally {
        setLoading(false)
      }
    }
    if (organizationId) fetchData()
  }, [organizationId, filterStatus, compact])

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id)
    try {
      const res = await fetch('/api/dashboard/obligations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, org_status: newStatus })
      })
      if (res.ok) {
        const oldObl = obligations.find(o => o.id === id)
        setObligations(prev => prev.map(o => o.id === id ? { ...o, org_status: newStatus } : o))
        if (stats && oldObl) {
          setStats(prev => prev ? {
            ...prev,
            [oldObl.org_status]: Math.max(0, (prev[oldObl.org_status] || 0) - 1),
            [newStatus]: (prev[newStatus] || 0) + 1,
          } : prev)
        }
      }
    } catch (err) {
      console.error('Update failed:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-4 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded w-2/3" />
        </div>
      </div>
    )
  }

  // ====== COMPACT WIDGET ======
  if (compact) {
    return (
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            📋 Obligații Legale
            {stats && stats.new > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                {stats.new} noi
              </span>
            )}
          </h3>
          <a href={`/${locale}/dashboard/obligations`} className="text-sm text-blue-600 hover:text-blue-800">
            Vezi toate →
          </a>
        </div>

        {stats && stats.total > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {stats.new > 0 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{stats.new} noi</span>}
            {stats.in_progress > 0 && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">{stats.in_progress} în lucru</span>}
            {stats.non_compliant > 0 && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">{stats.non_compliant} neconf.</span>}
            {stats.compliant > 0 && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">{stats.compliant} conf.</span>}
          </div>
        )}

        {obligations.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">Nicio obligație publicată.</p>
        ) : (
          <div className="space-y-2">
            {obligations.slice(0, 5).map(obl => (
              <div key={obl.id} className="flex items-start gap-2 p-2 rounded bg-gray-50 text-sm">
                <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded font-medium ${SEVERITY_BADGE[obl.severity || 'low'] || 'bg-gray-200 text-gray-600'}`}>
                  {(obl.severity || '?').charAt(0).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 line-clamp-1">{obl.obligation_text}</p>
                  <p className="text-xs text-gray-500">{obl.act_type} {obl.act_number}/{obl.act_year}</p>
                </div>
                <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded ${STATUS_CONFIG[obl.org_status]?.color || ''}`}>
                  {STATUS_CONFIG[obl.org_status]?.label || obl.org_status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ====== FULL PAGE VIEW ======
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Obligații Legale</h2>
        {stats && <span className="text-sm text-gray-500">Total: <strong>{stats.total}</strong></span>}
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 flex-wrap border-b pb-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-t text-sm ${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Toate ({stats?.total || 0})
        </button>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const count = stats?.[key] || 0
          if (count === 0 && key !== filterStatus) return null
          return (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`px-3 py-1.5 rounded-t text-sm ${filterStatus === key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {cfg.icon} {cfg.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Obligations list */}
      {obligations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {filterStatus === 'all' ? 'Nicio obligație publicată.' : `Nicio obligație cu status "${STATUS_CONFIG[filterStatus]?.label}".`}
        </div>
      ) : (
        <div className="space-y-2">
          {obligations.map(obl => {
            const isExpanded = expandedId === obl.id
            return (
              <div key={obl.id} className="bg-white border rounded-lg overflow-hidden">
                {/* Header row */}
                <div
                  className="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedId(isExpanded ? null : obl.id)}
                >
                  <span className={`shrink-0 mt-0.5 text-xs px-2 py-0.5 rounded font-medium ${SEVERITY_BADGE[obl.severity || 'low'] || 'bg-gray-200'}`}>
                    {obl.severity || '?'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium">{obl.obligation_text}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                        {obl.act_type} {obl.act_number}/{obl.act_year}
                      </span>
                      {obl.article_ref && <span className="text-xs text-gray-500">Art. {obl.article_ref}</span>}
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{obl.obligation_type}</span>
                      {obl.due_date && (
                        <>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-orange-600">
                            Termen: {new Date(obl.due_date).toLocaleDateString('ro-RO')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className={`shrink-0 text-xs px-2 py-1 rounded ${STATUS_CONFIG[obl.org_status]?.color || ''}`}>
                    {STATUS_CONFIG[obl.org_status]?.icon} {STATUS_CONFIG[obl.org_status]?.label || obl.org_status}
                  </span>
                  <span className="text-gray-400 text-sm">{isExpanded ? '▲' : '▼'}</span>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t px-4 py-3 bg-gray-50 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Act legislativ:</span>
                        <p className="font-medium">{obl.act_full_name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Publicat la:</span>
                        <p>{new Date(obl.published_at).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                      </div>
                      {obl.deadline_details && (
                        <div>
                          <span className="text-gray-500">Termen:</span>
                          <p>{obl.deadline_details}</p>
                        </div>
                      )}
                    </div>

                    {/* Status change buttons */}
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Schimbă status:</p>
                      <div className="flex gap-1 flex-wrap">
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                          <button
                            key={key}
                            onClick={() => updateStatus(obl.id, key)}
                            disabled={obl.org_status === key || updatingId === obl.id}
                            className={`text-xs px-2 py-1 rounded border transition-colors ${
                              obl.org_status === key 
                                ? 'border-blue-500 bg-blue-50 font-semibold' 
                                : 'border-gray-200 hover:border-gray-400 hover:bg-white'
                            } ${updatingId === obl.id ? 'opacity-50' : ''}`}
                          >
                            {cfg.icon} {cfg.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
