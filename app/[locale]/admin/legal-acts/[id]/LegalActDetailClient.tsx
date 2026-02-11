// app/[locale]/admin/legal-acts/[id]/LegalActDetailClient.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

// ============================================
// TYPES
// ============================================
interface LegalAct {
  id: string
  act_type: string
  act_number: string
  act_year: number
  act_full_name: string
  act_short_name: string | null
  status: string
  official_journal: string | null
  publication_date: string | null
  entry_into_force: string | null
  official_link: string | null
  domains: string[] | null
  subdomains: string[] | null
  full_text: string | null
  full_text_metadata: any
  ai_extraction_result: any
  ai_extraction_date: string | null
  validation_result: any
  validation_date: string | null
  display_mode: string | null
  hierarchy_order: number | null
  parent_act_id: string | null
  country_code: string
  confidence_level: string | null
  subject: string | null
  notes: string | null
  key_articles: any
  obligations_employer: any
  obligations_employee: any
  has_penalties: boolean | null
  penalty_min_lei: number | null
  penalty_max_lei: number | null
  penalty_currency: string | null
}

interface Obligation {
  id: string
  legal_act_id: string
  article_ref: string | null
  obligation_type: string
  description: string
  original_text: string | null
  deadline_type: string | null
  deadline_details: string | null
  applies_to: any
  severity: string | null
  confidence: string | null
  sort_order: number | null
  review_status: string
  review_notes: string | null
  reviewed_at: string | null
  reviewed_by: string | null
}

interface Penalty {
  id: string
  legal_act_id: string
  article_ref: string | null
  violation_description: string
  penalty_type: string | null
  min_amount_lei: number | null
  max_amount_lei: number | null
  recipient: string | null
  authority: string | null
  confidence: string | null
  sort_order: number | null
  review_status: string
  review_notes: string | null
}

interface CrossReference {
  id: string
  act_a_id: string
  act_b_id: string | null
  relationship_type: string
  description: string | null
  source_article: string | null
  target_act_type: string | null
  target_act_number: string | null
  target_act_year: number | null
  target_article: string | null
  reference_type: string | null
  review_status: string
}

interface PipelineStatus {
  step: number
  label: string
  color: string
}

interface ReviewStats {
  obligations: { total: number; pending: number; approved: number; rejected: number; edited: number }
  penalties: { total: number; pending: number; approved: number; rejected: number }
  crossRefs: { total: number }
}

interface ActDetailData {
  act: LegalAct
  obligations: Obligation[]
  penalties: Penalty[]
  crossReferences: CrossReference[]
  pipelineStatus: PipelineStatus
  reviewStats: ReviewStats
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function LegalActDetailClient({
  actId,
  locale,
}: {
  actId: string
  locale: string
}) {
  const [data, setData] = useState<ActDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'obligations' | 'penalties' | 'references' | 'text' | 'validation'>('obligations')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Obligation>>({})
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/legal-acts/${actId}`)
      if (!res.ok) throw new Error('Eroare la încărcarea actului')
      const json = await res.json()
      setData(json)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [actId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ============================================
  // APPROVE / REJECT / EDIT handlers
  // ============================================
  const handleObligationAction = async (obligationId: string, action: 'approved' | 'rejected', notes?: string) => {
    setActionLoading(obligationId)
    try {
      const res = await fetch(`/api/admin/legal-obligations/${obligationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          review_status: action,
          review_notes: notes || null,
        }),
      })
      if (!res.ok) throw new Error('Eroare la actualizare')
      await fetchData()
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleObligationEdit = async (obligationId: string) => {
    setActionLoading(obligationId)
    try {
      const res = await fetch(`/api/admin/legal-obligations/${obligationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          review_status: 'edited',
        }),
      })
      if (!res.ok) throw new Error('Eroare la salvare')
      setEditingId(null)
      setEditForm({})
      await fetchData()
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  const handlePenaltyAction = async (penaltyId: string, action: 'approved' | 'rejected') => {
    setActionLoading(penaltyId)
    try {
      const res = await fetch(`/api/admin/legal-penalties/${penaltyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review_status: action }),
      })
      if (!res.ok) throw new Error('Eroare la actualizare')
      await fetchData()
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkAction = async (action: 'approved' | 'rejected', type: 'obligations' | 'penalties') => {
    if (!data) return
    const items = type === 'obligations' ? data.obligations : data.penalties
    const pending = items.filter(i => (i.review_status || 'pending') === 'pending')
    
    setActionLoading('bulk')
    for (const item of pending) {
      const endpoint = type === 'obligations' 
        ? `/api/admin/legal-obligations/${item.id}`
        : `/api/admin/legal-penalties/${item.id}`
      await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review_status: action }),
      })
    }
    await fetchData()
    setActionLoading(null)
  }

  // ============================================
  // RENDER HELPERS
  // ============================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Se încarcă actul legislativ...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error || 'Act negăsit'}</p>
          <Link href={`/${locale}/admin/legal-acts`} className="text-blue-600 hover:underline mt-2 inline-block">
            ← Înapoi la lista acte
          </Link>
        </div>
      </div>
    )
  }

  const { act, obligations, penalties, crossReferences, pipelineStatus, reviewStats } = data

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    approved: 'bg-green-100 text-green-800 border-green-300',
    rejected: 'bg-red-100 text-red-800 border-red-300',
    edited: 'bg-blue-100 text-blue-800 border-blue-300',
  }

  const statusLabels: Record<string, string> = {
    pending: 'În așteptare',
    approved: 'Aprobat',
    rejected: 'Respins',
    edited: 'Editat',
  }

  const severityColors: Record<string, string> = {
    critical: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  }

  const confidenceColors: Record<string, string> = {
    high: 'text-green-600',
    medium: 'text-yellow-600',
    low: 'text-red-600',
  }

  const pipelineSteps = [
    { step: 1, label: 'Fără text', icon: '📄' },
    { step: 2, label: 'Text importat', icon: '📥' },
    { step: 3, label: 'Extras AI', icon: '🤖' },
    { step: 4, label: 'Validat M3', icon: '✅' },
    { step: 5, label: 'Revizuit M4', icon: '👁️' },
  ]

  // Check if all reviewed
  const allObligationsReviewed = reviewStats.obligations.pending === 0 && reviewStats.obligations.total > 0
  const allPenaltiesReviewed = reviewStats.penalties.pending === 0 && reviewStats.penalties.total > 0

  // Extract definitions from ai_extraction_result if present
  const definitions = act.ai_extraction_result?.definitions || act.ai_extraction_result?.definiții || []

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* ============ HEADER ============ */}
      <div className="mb-6">
        <Link
          href={`/${locale}/admin/legal-acts`}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-3"
        >
          ← Înapoi la lista acte legislative
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {act.act_type}
                </span>
                <span className="text-gray-500 text-sm">
                  Nr. {act.act_number}/{act.act_year}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  act.status === 'În vigoare' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {act.status}
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                {act.act_full_name}
              </h1>
              {act.subject && (
                <p className="text-gray-600 text-sm mb-2">{act.subject}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {act.domains?.map((d: string) => (
                  <span key={d} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Pipeline status */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-1">
                {pipelineSteps.map((ps) => (
                  <div key={ps.step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        pipelineStatus.step >= ps.step
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                      title={ps.label}
                    >
                      {ps.icon}
                    </div>
                    {ps.step < 5 && (
                      <div className={`w-6 h-0.5 ${
                        pipelineStatus.step > ps.step ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-1">{pipelineStatus.label}</p>
            </div>
          </div>

          {/* Meta info row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
            {act.official_journal && (
              <div>
                <p className="text-xs text-gray-500">Monitorul Oficial</p>
                <p className="text-sm font-medium">{act.official_journal}</p>
              </div>
            )}
            {act.publication_date && (
              <div>
                <p className="text-xs text-gray-500">Data publicării</p>
                <p className="text-sm font-medium">{new Date(act.publication_date).toLocaleDateString('ro-RO')}</p>
              </div>
            )}
            {act.entry_into_force && (
              <div>
                <p className="text-xs text-gray-500">Intrare în vigoare</p>
                <p className="text-sm font-medium">{new Date(act.entry_into_force).toLocaleDateString('ro-RO')}</p>
              </div>
            )}
            {act.official_link && (
              <div>
                <p className="text-xs text-gray-500">Link oficial</p>
                <a href={act.official_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  legislatie.just.ro ↗
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============ REVIEW STATS CARDS ============ */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard label="Obligații" value={reviewStats.obligations.total} icon="📋" />
        <StatCard label="Aprobate" value={reviewStats.obligations.approved} icon="✅" color="green" />
        <StatCard label="Respinse" value={reviewStats.obligations.rejected} icon="❌" color="red" />
        <StatCard label="Sancțiuni" value={reviewStats.penalties.total} icon="⚖️" />
        <StatCard label="Referințe" value={reviewStats.crossRefs.total} icon="🔗" />
      </div>

      {/* ============ TABS ============ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {[
              { key: 'obligations', label: 'Obligații', count: obligations.length, badge: reviewStats.obligations.pending },
              { key: 'penalties', label: 'Sancțiuni', count: penalties.length, badge: reviewStats.penalties.pending },
              { key: 'references', label: 'Referințe', count: crossReferences.length },
              { key: 'text', label: 'Text complet' },
              { key: 'validation', label: 'Validare M3' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    {tab.count}
                  </span>
                )}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">
                    {tab.badge} pending
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* ============ TAB: OBLIGATIONS ============ */}
          {activeTab === 'obligations' && (
            <div>
              {obligations.length === 0 ? (
                <EmptyState message="Nu sunt obligații extrase. Rulează M2 Extracție AI mai întâi." />
              ) : (
                <>
                  {/* Bulk actions */}
                  {reviewStats.obligations.pending > 0 && (
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">
                        {reviewStats.obligations.pending} obligații în așteptare
                      </span>
                      <button
                        onClick={() => handleBulkAction('approved', 'obligations')}
                        disabled={actionLoading === 'bulk'}
                        className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        ✅ Aprobă toate
                      </button>
                      <button
                        onClick={() => handleBulkAction('rejected', 'obligations')}
                        disabled={actionLoading === 'bulk'}
                        className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        ❌ Respinge toate
                      </button>
                      {actionLoading === 'bulk' && (
                        <span className="text-xs text-gray-500 animate-pulse">Se procesează...</span>
                      )}
                    </div>
                  )}

                  {allObligationsReviewed && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                      ✅ Toate obligațiile au fost revizuite ({reviewStats.obligations.approved} aprobate, {reviewStats.obligations.rejected} respinse, {reviewStats.obligations.edited} editate)
                    </div>
                  )}

                  <div className="space-y-3">
                    {obligations.map((obl, index) => (
                      <div
                        key={obl.id}
                        className={`border rounded-lg p-4 transition-colors ${
                          statusColors[obl.review_status || 'pending']?.replace('text-', 'border-').split(' ')[2] || 'border-gray-200'
                        } ${obl.review_status === 'rejected' ? 'opacity-60' : ''}`}
                      >
                        {editingId === obl.id ? (
                          /* ---- EDIT MODE ---- */
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-500">Editare obligație #{index + 1}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleObligationEdit(obl.id)}
                                  disabled={actionLoading === obl.id}
                                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                  💾 Salvează
                                </button>
                                <button
                                  onClick={() => { setEditingId(null); setEditForm({}) }}
                                  className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                >
                                  Anulează
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Articol referință</label>
                                <input
                                  type="text"
                                  value={editForm.article_ref ?? obl.article_ref ?? ''}
                                  onChange={(e) => setEditForm({ ...editForm, article_ref: e.target.value })}
                                  className="w-full px-3 py-1.5 border rounded text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Tip obligație</label>
                                <select
                                  value={editForm.obligation_type ?? obl.obligation_type}
                                  onChange={(e) => setEditForm({ ...editForm, obligation_type: e.target.value })}
                                  className="w-full px-3 py-1.5 border rounded text-sm"
                                >
                                  <option value="employer">Angajator</option>
                                  <option value="employee">Angajat</option>
                                  <option value="both">Ambii</option>
                                  <option value="authority">Autoritate</option>
                                  <option value="general">General</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Severitate</label>
                                <select
                                  value={editForm.severity ?? obl.severity ?? ''}
                                  onChange={(e) => setEditForm({ ...editForm, severity: e.target.value })}
                                  className="w-full px-3 py-1.5 border rounded text-sm"
                                >
                                  <option value="critical">Critică</option>
                                  <option value="high">Ridicată</option>
                                  <option value="medium">Medie</option>
                                  <option value="low">Scăzută</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Descriere obligație</label>
                              <textarea
                                value={editForm.description ?? obl.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-1.5 border rounded text-sm"
                              />
                            </div>
                          </div>
                        ) : (
                          /* ---- VIEW MODE ---- */
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="text-xs font-mono text-gray-400">#{index + 1}</span>
                                  {obl.article_ref && (
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                      {obl.article_ref}
                                    </span>
                                  )}
                                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs">
                                    {obl.obligation_type === 'employer' ? '🏢 Angajator' :
                                     obl.obligation_type === 'employee' ? '👷 Angajat' :
                                     obl.obligation_type === 'both' ? '🏢👷 Ambii' :
                                     obl.obligation_type === 'authority' ? '🏛️ Autoritate' :
                                     '📌 ' + obl.obligation_type}
                                  </span>
                                  {obl.severity && (
                                    <span className={`px-2 py-0.5 rounded text-xs ${severityColors[obl.severity] || 'bg-gray-100 text-gray-600'}`}>
                                      {obl.severity === 'critical' ? '🔴 Critică' :
                                       obl.severity === 'high' ? '🟠 Ridicată' :
                                       obl.severity === 'medium' ? '🟡 Medie' : '🟢 Scăzută'}
                                    </span>
                                  )}
                                  {obl.confidence && (
                                    <span className={`text-xs ${confidenceColors[obl.confidence] || 'text-gray-500'}`}>
                                      {obl.confidence === 'high' ? '●●●' : obl.confidence === 'medium' ? '●●○' : '●○○'}
                                    </span>
                                  )}
                                  <span className={`px-2 py-0.5 rounded text-xs border ${statusColors[obl.review_status || 'pending']}`}>
                                    {statusLabels[obl.review_status || 'pending']}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-800 leading-relaxed">{obl.description}</p>
                                {obl.original_text && obl.original_text !== obl.description && (
                                  <details className="mt-2">
                                    <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                                      Text original din lege
                                    </summary>
                                    <p className="mt-1 text-xs text-gray-500 italic bg-gray-50 p-2 rounded">
                                      {obl.original_text}
                                    </p>
                                  </details>
                                )}
                                {obl.deadline_details && (
                                  <p className="mt-1 text-xs text-gray-500">
                                    ⏰ Termen: {obl.deadline_details}
                                    {obl.deadline_type && ` (${obl.deadline_type})`}
                                  </p>
                                )}
                                {obl.applies_to && (
                                  <div className="flex gap-1 mt-1">
                                    {(Array.isArray(obl.applies_to) ? obl.applies_to : [obl.applies_to]).map((a: string, i: number) => (
                                      <span key={i} className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-xs">
                                        {a}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {obl.review_notes && (
                                  <p className="mt-2 text-xs text-gray-500 italic">💬 {obl.review_notes}</p>
                                )}
                              </div>

                              {/* Action buttons */}
                              <div className="flex-shrink-0 flex flex-col gap-1.5">
                                {(obl.review_status || 'pending') === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleObligationAction(obl.id, 'approved')}
                                      disabled={actionLoading === obl.id}
                                      className="px-2.5 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded border border-green-200 hover:bg-green-100 disabled:opacity-50 whitespace-nowrap"
                                    >
                                      ✅ Aprobă
                                    </button>
                                    <button
                                      onClick={() => handleObligationAction(obl.id, 'rejected')}
                                      disabled={actionLoading === obl.id}
                                      className="px-2.5 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded border border-red-200 hover:bg-red-100 disabled:opacity-50 whitespace-nowrap"
                                    >
                                      ❌ Respinge
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => {
                                    setEditingId(obl.id)
                                    setEditForm({
                                      description: obl.description,
                                      article_ref: obl.article_ref,
                                      obligation_type: obl.obligation_type,
                                      severity: obl.severity,
                                    })
                                  }}
                                  className="px-2.5 py-1.5 text-xs font-medium bg-gray-50 text-gray-700 rounded border border-gray-200 hover:bg-gray-100 whitespace-nowrap"
                                >
                                  ✏️ Editează
                                </button>
                                {(obl.review_status === 'approved' || obl.review_status === 'rejected' || obl.review_status === 'edited') && (
                                  <button
                                    onClick={() => handleObligationAction(obl.id, 'approved')}
                                    disabled={actionLoading === obl.id}
                                    className="px-2.5 py-1.5 text-xs font-medium bg-yellow-50 text-yellow-700 rounded border border-yellow-200 hover:bg-yellow-100 disabled:opacity-50 whitespace-nowrap"
                                  >
                                    🔄 Resetează
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ============ TAB: PENALTIES ============ */}
          {activeTab === 'penalties' && (
            <div>
              {penalties.length === 0 ? (
                <EmptyState message="Nu sunt sancțiuni extrase din acest act." />
              ) : (
                <>
                  {reviewStats.penalties.pending > 0 && (
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">
                        {reviewStats.penalties.pending} sancțiuni în așteptare
                      </span>
                      <button
                        onClick={() => handleBulkAction('approved', 'penalties')}
                        disabled={actionLoading === 'bulk'}
                        className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        ✅ Aprobă toate
                      </button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {penalties.map((pen, index) => (
                      <div
                        key={pen.id}
                        className={`border rounded-lg p-4 ${
                          pen.review_status === 'rejected' ? 'opacity-60 border-red-200' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-xs font-mono text-gray-400">#{index + 1}</span>
                              {pen.article_ref && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                  {pen.article_ref}
                                </span>
                              )}
                              {pen.penalty_type && (
                                <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs">
                                  {pen.penalty_type === 'contravention' ? '📝 Contravenție' :
                                   pen.penalty_type === 'criminal' ? '⚖️ Penal' : pen.penalty_type}
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded text-xs border ${statusColors[pen.review_status || 'pending']}`}>
                                {statusLabels[pen.review_status || 'pending']}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800">{pen.violation_description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              {(pen.min_amount_lei || pen.max_amount_lei) && (
                                <span className="text-sm font-semibold text-red-700">
                                  💰 {pen.min_amount_lei?.toLocaleString('ro-RO')} — {pen.max_amount_lei?.toLocaleString('ro-RO')} LEI
                                </span>
                              )}
                              {pen.recipient && (
                                <span className="text-xs text-gray-500">📍 {pen.recipient}</span>
                              )}
                              {pen.authority && (
                                <span className="text-xs text-gray-500">🏛️ {pen.authority}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex-shrink-0 flex flex-col gap-1.5">
                            {(pen.review_status || 'pending') === 'pending' && (
                              <>
                                <button
                                  onClick={() => handlePenaltyAction(pen.id, 'approved')}
                                  disabled={actionLoading === pen.id}
                                  className="px-2.5 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded border border-green-200 hover:bg-green-100 disabled:opacity-50"
                                >
                                  ✅ Aprobă
                                </button>
                                <button
                                  onClick={() => handlePenaltyAction(pen.id, 'rejected')}
                                  disabled={actionLoading === pen.id}
                                  className="px-2.5 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded border border-red-200 hover:bg-red-100 disabled:opacity-50"
                                >
                                  ❌ Respinge
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ============ TAB: CROSS REFERENCES ============ */}
          {activeTab === 'references' && (
            <div>
              {crossReferences.length === 0 ? (
                <EmptyState message="Nu sunt referințe încrucișate extrase din acest act." />
              ) : (
                <div className="space-y-2">
                  {crossReferences.map((ref, index) => (
                    <div key={ref.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-gray-400">#{index + 1}</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {ref.relationship_type || ref.reference_type || 'referință'}
                        </span>
                        {ref.source_article && (
                          <span className="text-xs text-gray-500">din {ref.source_article}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-800">
                        {ref.target_act_type && `${ref.target_act_type} `}
                        {ref.target_act_number && `nr. ${ref.target_act_number}`}
                        {ref.target_act_year && `/${ref.target_act_year}`}
                        {ref.target_article && `, ${ref.target_article}`}
                      </p>
                      {ref.description && (
                        <p className="text-xs text-gray-500 mt-1">{ref.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============ TAB: FULL TEXT ============ */}
          {activeTab === 'text' && (
            <div>
              {!act.full_text ? (
                <EmptyState message="Textul complet nu a fost importat. Mergi la Import pentru a adăuga textul." />
              ) : (
                <div>
                  {act.full_text_metadata && (
                    <div className="flex gap-4 mb-4 p-3 bg-gray-50 rounded-lg text-sm">
                      {act.full_text_metadata.articles && (
                        <span>📋 {act.full_text_metadata.articles} articole</span>
                      )}
                      {act.full_text_metadata.chapters && (
                        <span>📖 {act.full_text_metadata.chapters} capitole</span>
                      )}
                      {act.full_text_metadata.tokens && (
                        <span>🎯 ~{act.full_text_metadata.tokens?.toLocaleString('ro-RO')} tokens</span>
                      )}
                      <span>📝 {act.full_text.length.toLocaleString('ro-RO')} caractere</span>
                    </div>
                  )}

                  {/* Definitions section */}
                  {definitions && definitions.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">📚 Definiții extrase ({definitions.length})</h3>
                      <div className="space-y-2">
                        {definitions.map((def: any, i: number) => (
                          <div key={i} className="border border-purple-100 bg-purple-50 rounded p-3">
                            <p className="text-sm font-medium text-purple-900">{def.term || def.termen}</p>
                            <p className="text-sm text-purple-700 mt-0.5">{def.definition || def.definiție || def.descriere}</p>
                            {(def.article_ref || def.articol) && (
                              <p className="text-xs text-purple-500 mt-1">📍 {def.article_ref || def.articol}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4 max-h-[600px] overflow-y-auto">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                      {act.full_text}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============ TAB: VALIDATION M3 ============ */}
          {activeTab === 'validation' && (
            <div>
              {!act.validation_result ? (
                <EmptyState message="Actul nu a fost validat cu M3. Rulează validarea mai întâi." />
              ) : (
                <div>
                  {/* Overall score */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white ${
                      (act.validation_result.overall_score || 0) >= 80 ? 'bg-green-500' :
                      (act.validation_result.overall_score || 0) >= 60 ? 'bg-yellow-500' :
                      (act.validation_result.overall_score || 0) >= 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`}>
                      {Math.round(act.validation_result.overall_score || 0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Scor Validare M3</h3>
                      <p className="text-sm text-gray-500">
                        Validat: {act.validation_date ? new Date(act.validation_date).toLocaleString('ro-RO') : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Individual checks */}
                  <div className="space-y-3">
                    {(act.validation_result.checks || []).map((check: any, index: number) => {
                      const checkLabels: Record<string, string> = {
                        article_coverage: 'Acoperire articole',
                        article_count_consistency: 'Consistență numărare',
                        obligations_quality: 'Calitate obligații',
                        penalties_validity: 'Validitate sancțiuni',
                        cross_references: 'Referințe încrucișate',
                        definitions_quality: 'Calitate definiții',
                      }
                      const checkWeights: Record<string, number> = {
                        article_coverage: 25,
                        article_count_consistency: 15,
                        obligations_quality: 25,
                        penalties_validity: 15,
                        cross_references: 10,
                        definitions_quality: 10,
                      }

                      return (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">
                                {checkLabels[check.name] || check.name}
                              </span>
                              <span className="text-xs text-gray-400">
                                ({checkWeights[check.name] || '?'}%)
                              </span>
                            </div>
                            <span className={`text-sm font-bold ${
                              (check.score || 0) >= 80 ? 'text-green-600' :
                              (check.score || 0) >= 60 ? 'text-yellow-600' :
                              (check.score || 0) >= 40 ? 'text-orange-600' : 'text-red-600'
                            }`}>
                              {Math.round(check.score || 0)}/100
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                (check.score || 0) >= 80 ? 'bg-green-500' :
                                (check.score || 0) >= 60 ? 'bg-yellow-500' :
                                (check.score || 0) >= 40 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(check.score || 0, 100)}%` }}
                            />
                          </div>
                          {check.details && (
                            <p className="text-xs text-gray-500 mt-2">{check.details}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Raw validation data (collapsible) */}
                  <details className="mt-4">
                    <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                      Date brute validare (JSON)
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                      {JSON.stringify(act.validation_result, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================
function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color?: string }) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    blue: 'bg-blue-50 border-blue-200',
  }
  return (
    <div className={`rounded-lg border p-3 text-center ${color ? colorClasses[color as keyof typeof colorClasses] : 'bg-white border-gray-200'}`}>
      <p className="text-2xl font-bold">{icon} {value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  )
}
