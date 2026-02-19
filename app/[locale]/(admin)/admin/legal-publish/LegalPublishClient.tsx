'use client'

// app/[locale]/admin/legal-publish/LegalPublishClient.tsx
// M5 Publishing — Hibrid: Auto-match preview + Manual override + Publish
// Pipeline: Select obligations → Choose match mode → Preview → Adjust → Publish

import { useState, useMemo, useCallback } from 'react'

interface Obligation {
  id: string
  article_ref: string | null
  obligation_type: string
  description: string
  severity: string | null
  confidence: string | null
  review_status: string
  legal_acts: {
    id: string
    act_type: string
    act_number: string
    act_year: number
    act_full_name: string
    act_short_name: string | null
    country_code: string
    domain: string
  }
}

interface Organization {
  id: string
  name: string
  cui: string | null
  country_code: string
  caen_code: string | null
  industry_domain: string | null
  county: string | null
}

interface MatchPreview {
  obligation_id: string
  organization_id: string
  org_name: string
  org_cui: string | null
  org_country_code: string
  match_type: string
  match_reason: string
  already_published: boolean
}

interface PublishBatch {
  id: string
  title: string | null
  total_obligations: number
  total_organizations: number
  total_assignments: number
  published_at: string
}

interface Props {
  obligations: Obligation[]
  organizations: Organization[]
  recentBatches: PublishBatch[]
  publishedMap: Record<string, number>
  locale: string
  userId: string
}

type Step = 'select' | 'preview' | 'publish' | 'done'

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200',
}

const MATCH_MODE_LABELS: Record<string, { label: string; desc: string }> = {
  country: { 
    label: '🏳️ Per Țară', 
    desc: 'Publică la toate organizațiile din aceeași țară cu actul legislativ' 
  },
  domain: { 
    label: '🏭 Per Domeniu', 
    desc: 'Match pe țară + domeniu industrial (necesită industry_domain pe organizații)' 
  },
  broadcast: { 
    label: '📢 Broadcast', 
    desc: 'Publică la TOATE organizațiile, indiferent de țară' 
  },
}

export default function LegalPublishClient({
  obligations,
  organizations,
  recentBatches,
  publishedMap,
  locale,
  userId,
}: Props) {
  // State
  const [step, setStep] = useState<Step>('select')
  const [selectedOblIds, setSelectedOblIds] = useState<Set<string>>(new Set())
  const [matchMode, setMatchMode] = useState<string>('country')
  const [preview, setPreview] = useState<MatchPreview[]>([])
  const [excludedPairs, setExcludedPairs] = useState<Set<string>>(new Set())
  const [manualAdditions, setManualAdditions] = useState<Array<{ obligation_id: string; organization_id: string }>>([])
  const [loading, setLoading] = useState(false)
  const [publishResult, setPublishResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [filterAct, setFilterAct] = useState<string>('all')
  const [publishTitle, setPublishTitle] = useState('')
  const [globalDueDate, setGlobalDueDate] = useState('')

  // Group obligations by act
  const actGroups = useMemo(() => {
    const groups: Record<string, { act: Obligation['legal_acts']; obligations: Obligation[] }> = {}
    obligations.forEach(obl => {
      const actKey = obl.legal_acts.id
      if (!groups[actKey]) {
        groups[actKey] = { act: obl.legal_acts, obligations: [] }
      }
      groups[actKey].obligations.push(obl)
    })
    return groups
  }, [obligations])

  // Filtered obligations
  const filteredObligations = useMemo(() => {
    if (filterAct === 'all') return obligations
    return obligations.filter(o => o.legal_acts.id === filterAct)
  }, [obligations, filterAct])

  // Toggle obligation selection
  const toggleObligation = useCallback((id: string) => {
    setSelectedOblIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // Select/deselect all visible
  const toggleAll = useCallback(() => {
    const allIds = filteredObligations.map(o => o.id)
    const allSelected = allIds.every(id => selectedOblIds.has(id))
    if (allSelected) {
      setSelectedOblIds(prev => {
        const next = new Set(prev)
        allIds.forEach(id => next.delete(id))
        return next
      })
    } else {
      setSelectedOblIds(prev => {
        const next = new Set(prev)
        allIds.forEach(id => next.add(id))
        return next
      })
    }
  }, [filteredObligations, selectedOblIds])

  // Fetch preview from API
  const fetchPreview = async () => {
    if (selectedOblIds.size === 0) {
      setError('Selectează cel puțin o obligație')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const ids = Array.from(selectedOblIds).join(',')
      const res = await fetch(`/api/admin/legal-publish?mode=${matchMode}&obligation_ids=${ids}`)
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Preview failed')

      setPreview(data.preview || [])
      setExcludedPairs(new Set())
      setManualAdditions([])
      setStep('preview')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Toggle exclude pair from preview
  const toggleExclude = (oblId: string, orgId: string) => {
    const key = `${oblId}::${orgId}`
    setExcludedPairs(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  // Add manual assignment
  const addManualAssignment = (oblId: string, orgId: string) => {
    const exists = manualAdditions.some(
      a => a.obligation_id === oblId && a.organization_id === orgId
    )
    const existsInPreview = preview.some(
      p => p.obligation_id === oblId && p.organization_id === orgId
    )
    if (!exists && !existsInPreview) {
      setManualAdditions(prev => [...prev, { obligation_id: oblId, organization_id: orgId }])
    }
  }

  // Final assignments = preview (minus excluded) + manual additions
  const finalAssignments = useMemo(() => {
    const fromPreview = preview
      .filter(p => !p.already_published && !excludedPairs.has(`${p.obligation_id}::${p.organization_id}`))
      .map(p => ({
        obligation_id: p.obligation_id,
        organization_id: p.organization_id,
        match_type: p.match_type,
        match_confidence: 1.0
      }))

    const fromManual = manualAdditions.map(a => ({
      obligation_id: a.obligation_id,
      organization_id: a.organization_id,
      match_type: 'manual' as string,
      match_confidence: 1.0
    }))

    return [...fromPreview, ...fromManual]
  }, [preview, excludedPairs, manualAdditions])

  // Publish
  const doPublish = async () => {
    if (finalAssignments.length === 0) {
      setError('Nu există atribuiri de publicat')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/legal-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignments: finalAssignments,
          title: publishTitle || undefined,
          due_date: globalDueDate || undefined
        })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Publish failed')

      setPublishResult(data)
      setStep('done')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Preview stats
  const previewStats = useMemo(() => {
    const newMatches = preview.filter(p => !p.already_published)
    const excluded = newMatches.filter(p => excludedPairs.has(`${p.obligation_id}::${p.organization_id}`))
    return {
      total: preview.length,
      alreadyPublished: preview.filter(p => p.already_published).length,
      new: newMatches.length,
      excluded: excluded.length,
      manual: manualAdditions.length,
      final: finalAssignments.length
    }
  }, [preview, excludedPairs, manualAdditions, finalAssignments])

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          M5 — Publicare Obligații
        </h1>
        <p className="text-gray-600 mt-1">
          Publică obligațiile aprobate din M4 către organizațiile clienți
        </p>
        {/* Stepper */}
        <div className="flex items-center gap-2 mt-4">
          {(['select', 'preview', 'publish', 'done'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s ? 'bg-blue-600 text-white' : 
                (['select', 'preview', 'publish', 'done'].indexOf(step) > i) ? 'bg-green-500 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {(['select', 'preview', 'publish', 'done'].indexOf(step) > i) ? '✓' : i + 1}
              </div>
              <span className={`text-sm ${step === s ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                {s === 'select' ? 'Selectare' : s === 'preview' ? 'Preview' : s === 'publish' ? 'Confirmare' : 'Finalizat'}
              </span>
              {i < 3 && <div className="w-8 h-px bg-gray-300" />}
            </div>
          ))}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">✕</button>
        </div>
      )}

      {/* STEP 1: Select obligations + match mode */}
      {step === 'select' && (
        <div className="space-y-6">
          {/* Match mode selector */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Mod de matching</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(MATCH_MODE_LABELS).map(([key, { label, desc }]) => (
                <button
                  key={key}
                  onClick={() => setMatchMode(key)}
                  className={`text-left p-3 rounded-lg border-2 transition-colors ${
                    matchMode === key 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-gray-500 mt-1">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Filter by act */}
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">
                Obligații aprobate ({obligations.length} total)
              </h3>
              <div className="flex items-center gap-3">
                <select
                  value={filterAct}
                  onChange={(e) => setFilterAct(e.target.value)}
                  className="text-sm border rounded-md px-2 py-1"
                >
                  <option value="all">Toate actele</option>
                  {Object.entries(actGroups).map(([actId, { act, obligations: obls }]) => (
                    <option key={actId} value={actId}>
                      {act.act_type} {act.act_number}/{act.act_year} ({obls.length} obl.)
                    </option>
                  ))}
                </select>
                <button
                  onClick={toggleAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {filteredObligations.every(o => selectedOblIds.has(o.id)) 
                    ? 'Deselectează toate' : 'Selectează toate'}
                </button>
              </div>
            </div>

            {/* Obligations list */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredObligations.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  Nu există obligații aprobate pentru publicare. Aprobă obligații în M4 mai întâi.
                </p>
              )}
              {filteredObligations.map(obl => {
                const pubCount = publishedMap[obl.id] || 0
                return (
                  <label
                    key={obl.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedOblIds.has(obl.id) 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedOblIds.has(obl.id)}
                      onChange={() => toggleObligation(obl.id)}
                      className="mt-1 rounded border-gray-300"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                          {obl.legal_acts.act_type} {obl.legal_acts.act_number}/{obl.legal_acts.act_year}
                        </span>
                        {obl.article_ref && (
                          <span className="text-xs text-gray-500">Art. {obl.article_ref}</span>
                        )}
                        {obl.severity && (
                          <span className={`text-xs px-1.5 py-0.5 rounded border ${SEVERITY_COLORS[obl.severity] || 'bg-gray-100 text-gray-600'}`}>
                            {obl.severity}
                          </span>
                        )}
                        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                          {obl.obligation_type}
                        </span>
                        {pubCount > 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                            Publicat la {pubCount} org.
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                        {obl.description}
                      </p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Action */}
          <div className="flex items-center justify-between bg-gray-50 border rounded-lg p-4">
            <div className="text-sm text-gray-600">
              <strong>{selectedOblIds.size}</strong> obligații selectate · 
              <strong> {organizations.length}</strong> organizații disponibile · 
              Mod: <strong>{MATCH_MODE_LABELS[matchMode]?.label}</strong>
            </div>
            <button
              onClick={fetchPreview}
              disabled={selectedOblIds.size === 0 || loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⟳</span> Se calculează...
                </>
              ) : (
                <>Preview Matching →</>
              )}
            </button>
          </div>

          {/* Recent batches */}
          {recentBatches.length > 0 && (
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Publicări recente</h3>
              <div className="space-y-2">
                {recentBatches.map(batch => (
                  <div key={batch.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <div>
                      <span className="font-medium">{batch.title || 'Batch fără titlu'}</span>
                      <span className="text-gray-500 ml-2">
                        {batch.total_obligations} obl. → {batch.total_organizations} org. = {batch.total_assignments} atribuiri
                      </span>
                    </div>
                    <span className="text-gray-400 text-xs">
                      {new Date(batch.published_at).toLocaleDateString('ro-RO', { 
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Preview + Override */}
      {step === 'preview' && (
        <div className="space-y-6">
          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[
              { label: 'Total match-uri', value: previewStats.total, color: 'blue' },
              { label: 'Deja publicate', value: previewStats.alreadyPublished, color: 'gray' },
              { label: 'Noi', value: previewStats.new, color: 'green' },
              { label: 'Excluse', value: previewStats.excluded, color: 'red' },
              { label: 'Adăugate manual', value: previewStats.manual, color: 'purple' },
              { label: 'FINAL', value: previewStats.final, color: 'blue' },
            ].map(stat => (
              <div key={stat.label} className={`p-3 rounded-lg border bg-${stat.color}-50 border-${stat.color}-200`}>
                <div className={`text-2xl font-bold text-${stat.color}-700`}>{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Preview table */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-800">
                Preview atribuiri — Click pentru a exclude/include
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Rândurile gri = deja publicate. Rândurile tăiate = excluse manual. 
                Poți exclude/include cu click.
              </p>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-2 pl-4">Organizație</th>
                    <th className="text-left p-2">CUI</th>
                    <th className="text-left p-2">Țară</th>
                    <th className="text-left p-2">Obligație</th>
                    <th className="text-left p-2">Match</th>
                    <th className="text-center p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((match, i) => {
                    const isExcluded = excludedPairs.has(`${match.obligation_id}::${match.organization_id}`)
                    const obl = obligations.find(o => o.id === match.obligation_id)
                    return (
                      <tr
                        key={i}
                        onClick={() => !match.already_published && toggleExclude(match.obligation_id, match.organization_id)}
                        className={`border-t cursor-pointer transition-colors ${
                          match.already_published 
                            ? 'bg-gray-100 text-gray-400 cursor-default' 
                            : isExcluded 
                              ? 'bg-red-50 line-through text-gray-400' 
                              : 'hover:bg-blue-50'
                        }`}
                      >
                        <td className="p-2 pl-4 font-medium">{match.org_name}</td>
                        <td className="p-2 font-mono text-xs">{match.org_cui || '—'}</td>
                        <td className="p-2">
                          <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                            {match.org_country_code}
                          </span>
                        </td>
                        <td className="p-2 max-w-xs truncate" title={obl?.description}>
                          <span className="text-xs font-mono mr-1">
                            {obl?.legal_acts.act_number}/{obl?.legal_acts.act_year}
                          </span>
                          {obl?.article_ref && <span className="text-xs text-gray-500">Art.{obl.article_ref}</span>}
                        </td>
                        <td className="p-2">
                          <span className="text-xs">{match.match_reason}</span>
                        </td>
                        <td className="p-2 text-center">
                          {match.already_published ? (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">✓ Publicat</span>
                          ) : isExcluded ? (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">✕ Exclus</span>
                          ) : (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">● Include</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                  {/* Manual additions */}
                  {manualAdditions.map((ma, i) => {
                    const org = organizations.find(o => o.id === ma.organization_id)
                    const obl = obligations.find(o => o.id === ma.obligation_id)
                    return (
                      <tr key={`manual-${i}`} className="border-t bg-purple-50">
                        <td className="p-2 pl-4 font-medium">{org?.name}</td>
                        <td className="p-2 font-mono text-xs">{org?.cui || '—'}</td>
                        <td className="p-2">
                          <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                            {org?.country_code}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className="text-xs font-mono mr-1">
                            {obl?.legal_acts.act_number}/{obl?.legal_acts.act_year}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className="text-xs text-purple-600">Manual adăugat</span>
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setManualAdditions(prev => prev.filter((_, j) => j !== i))
                            }}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            Șterge
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Manual add section */}
          <ManualAddSection
            obligations={obligations.filter(o => selectedOblIds.has(o.id))}
            organizations={organizations}
            onAdd={addManualAssignment}
            preview={preview}
            manualAdditions={manualAdditions}
          />

          {/* Actions */}
          <div className="flex items-center justify-between bg-gray-50 border rounded-lg p-4">
            <button
              onClick={() => setStep('select')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Înapoi la selecție
            </button>
            <button
              onClick={() => { const oblIds = Array.from(selectedOblIds); const acts = [...new Set(obligations.filter(o => oblIds.includes(o.id)).map(o => o.legal_acts.act_type + " " + o.legal_acts.act_number + "/" + o.legal_acts.act_year))]; if (!publishTitle) setPublishTitle("Publicare " + acts.join(", ") + " - " + oblIds.length + " obl."); setStep("publish") }}
              disabled={finalAssignments.length === 0}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmă publicarea ({finalAssignments.length} atribuiri) →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Confirm publish */}
      {step === 'publish' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmă publicarea</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titlu batch (opțional)
                </label>
                <input
                  type="text"
                  value={publishTitle}
                  onChange={(e) => setPublishTitle(e.target.value)}
                  placeholder="ex: Publicare HG 1425/2006 - obligații SSM"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Termen limită global (opțional)
                </label>
                <input
                  type="date"
                  value={globalDueDate}
                  onChange={(e) => setGlobalDueDate(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="font-medium text-blue-800 mb-2">Rezumat publicare:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• <strong>{finalAssignments.length}</strong> atribuiri noi</li>
                  <li>• <strong>{new Set(finalAssignments.map(a => a.obligation_id)).size}</strong> obligații unice</li>
                  <li>• <strong>{new Set(finalAssignments.map(a => a.organization_id)).size}</strong> organizații afectate</li>
                  <li>• Match types: {[...new Set(finalAssignments.map(a => a.match_type))].join(', ')}</li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                ⚠️ Această acțiune va face obligațiile vizibile pe dashboard-ul organizațiilor selectate. 
                Acțiunea nu poate fi anulată automat (dar poți șterge manual din DB).
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep('preview')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Înapoi la preview
            </button>
            <button
              onClick={doPublish}
              disabled={loading}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⟳</span> Se publică...
                </>
              ) : (
                <>✓ PUBLICĂ ACUM</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Done */}
      {step === 'done' && publishResult && (
        <div className="max-w-xl mx-auto">
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-green-800 mb-2">Publicare completă!</h3>
            <p className="text-green-700 mb-4">{publishResult.message}</p>
            <div className="text-sm text-green-600 space-y-1">
              <p>Batch ID: <code className="bg-green-100 px-1 rounded">{publishResult.batch_id}</code></p>
              <p>Inserate: <strong>{publishResult.inserted}</strong> | Duplicate ignorate: <strong>{publishResult.skipped}</strong></p>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => {
                  setStep('select')
                  setSelectedOblIds(new Set())
                  setPreview([])
                  setPublishResult(null)
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Publică mai multe
              </button>
              <a
                href={`/${locale}/admin/legal-acts`}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Înapoi la acte
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// Sub-component: Manual add organizations
// ============================================================
function ManualAddSection({
  obligations,
  organizations,
  onAdd,
  preview,
  manualAdditions,
}: {
  obligations: Obligation[]
  organizations: Organization[]
  onAdd: (oblId: string, orgId: string) => void
  preview: MatchPreview[]
  manualAdditions: Array<{ obligation_id: string; organization_id: string }>
}) {
  const [selectedObl, setSelectedObl] = useState<string>('')
  const [selectedOrg, setSelectedOrg] = useState<string>('')
  const [expanded, setExpanded] = useState(false)

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full text-left p-3 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        + Adaugă manual organizații la obligații (override)
      </button>
    )
  }

  // Filter out already matched/added orgs for selected obligation
  const availableOrgs = organizations.filter(org => {
    if (!selectedObl) return true
    const inPreview = preview.some(p => p.obligation_id === selectedObl && p.organization_id === org.id)
    const inManual = manualAdditions.some(m => m.obligation_id === selectedObl && m.organization_id === org.id)
    return !inPreview && !inManual
  })

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <h4 className="font-medium text-purple-800 mb-3">Adăugare manuală</h4>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-xs text-gray-600 mb-1">Obligație</label>
          <select
            value={selectedObl}
            onChange={(e) => setSelectedObl(e.target.value)}
            className="w-full border rounded-md px-2 py-1.5 text-sm"
          >
            <option value="">Alege obligația...</option>
            {obligations.map(obl => (
              <option key={obl.id} value={obl.id}>
                {obl.legal_acts.act_number}/{obl.legal_acts.act_year} Art.{obl.article_ref} — {obl.description.substring(0, 60)}...
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-600 mb-1">Organizație</label>
          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="w-full border rounded-md px-2 py-1.5 text-sm"
          >
            <option value="">Alege organizația...</option>
            {availableOrgs.map(org => (
              <option key={org.id} value={org.id}>
                {org.name} ({org.cui || 'fără CUI'}) — {org.country_code}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            if (selectedObl && selectedOrg) {
              onAdd(selectedObl, selectedOrg)
              setSelectedOrg('')
            }
          }}
          disabled={!selectedObl || !selectedOrg}
          className="px-4 py-1.5 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 disabled:opacity-50"
        >
          + Adaugă
        </button>
      </div>
    </div>
  )
}
