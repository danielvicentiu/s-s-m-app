'use client'
import { useState, useEffect, useMemo } from 'react'
import {
  Database,
  Brain,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  AlertTriangle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Activity,
  Search,
  Filter,
  Link,
  X,
} from 'lucide-react'

// ==========================================
// TIPURI
// ==========================================

interface LegalAct {
  id: string
  act_type: string
  act_number: string
  act_year: number
  act_short_name: string
  act_full_name: string
  domain: string
  domains: string[] | null
  subdomains: string[] | null
  status: string
  country_code: string
  confidence_level: string
  research_phase: string
  full_text_metadata: any
  ai_extraction_date: string | null
  ai_extraction_result: any
  has_penalties: boolean
  penalty_min_lei: number | null
  penalty_max_lei: number | null
  validation_result: ValidationResult | null
  validation_date: string | null
  display_mode: string | null
  parent_act_id: string | null
  hierarchy_order: number | null
}

interface ExtractionStats {
  obligations: number
  obligations_employer: number
  obligations_employee: number
  penalties: number
  cross_references: number
  key_definitions: number
  has_penalties: boolean
  penalty_range: string | null
}

interface ValidationCheck {
  name: string
  status: 'ok' | 'warning' | 'error'
  message: string
  details?: any
}

interface ValidationResult {
  act_id: string
  act_short_name: string
  overall_status: 'ok' | 'warning' | 'error'
  score: number
  checks: ValidationCheck[]
  validated_at: string
}

interface TaxonomyItem {
  id: string
  domain_code: string
  domain_name: string
  subdomain_code: string
  subdomain_name: string
  description: string | null
  sort_order: number
  is_active: boolean
}

// ==========================================
// CONSTANTE — TRADUCERI RO
// ==========================================

/** Traduceri check names EN → RO */
const CHECK_NAMES_RO: Record<string, string> = {
  article_coverage: 'Acoperire articole',
  article_count_consistency: 'Consistență numărare',
  obligations_quality: 'Calitate obligații',
  penalties_validity: 'Validitate sancțiuni',
  cross_references: 'Referințe încrucișate',
  definitions_quality: 'Calitate definiții',
}

/** Ponderi pentru afișare */
const CHECK_WEIGHTS: Record<string, number> = {
  article_coverage: 25,
  article_count_consistency: 15,
  obligations_quality: 25,
  penalties_validity: 15,
  cross_references: 10,
  definitions_quality: 10,
}

/** Culori domenii */
const DOMAIN_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  SSM: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300' },
  PSI: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  MUNCA: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  GDPR: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  NIS2: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' },
  MEDIU: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  FISCAL: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  ALTELE: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' },
}

/** Tipuri act cu labels RO + ordine ierarhică */
const ACT_TYPES: Record<string, { label: string; order: number }> = {
  LEGE: { label: 'Lege', order: 1 },
  OUG: { label: 'Ordonanță de urgență', order: 2 },
  OG: { label: 'Ordonanță', order: 3 },
  HG: { label: 'Hotărâre de Guvern', order: 4 },
  ORDIN: { label: 'Ordin', order: 5 },
  NORMA: { label: 'Normă', order: 6 },
  COD: { label: 'Cod', order: 1 },
  REGULAMENT: { label: 'Regulament', order: 7 },
}

/** Status-uri pipeline */
type PipelineStatus = 'no_text' | 'text_imported' | 'ai_extracted' | 'validated'

const PIPELINE_STATUSES: Record<PipelineStatus, { label: string; color: string }> = {
  no_text: { label: 'Fără text', color: 'text-slate-400' },
  text_imported: { label: 'Text importat', color: 'text-blue-600' },
  ai_extracted: { label: 'AI extras', color: 'text-emerald-600' },
  validated: { label: 'Validat', color: 'text-indigo-600' },
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getActPipelineStatus(act: LegalAct): PipelineStatus {
  if (act.validation_date) return 'validated'
  if (act.ai_extraction_date) return 'ai_extracted'
  if (act.full_text_metadata?.characters > 0) return 'text_imported'
  return 'no_text'
}

function getActDomains(act: LegalAct): string[] {
  // Preferă domains (JSONB array nou), fallback pe domain (text vechi)
  if (act.domains && Array.isArray(act.domains) && act.domains.length > 0) {
    return act.domains
  }
  if (act.domain) return [act.domain.toUpperCase()]
  return ['ALTELE']
}

// ==========================================
// COMPONENT PRINCIPAL
// ==========================================

export default function LegalActsListClient() {
  // State — date
  const [acts, setActs] = useState<LegalAct[]>([])
  const [taxonomy, setTaxonomy] = useState<TaxonomyItem[]>([])
  const [loading, setLoading] = useState(true)

  // State — extracție M2
  const [extractingId, setExtractingId] = useState<string | null>(null)
  const [extractionResults, setExtractionResults] = useState<Record<string, { success: boolean; stats?: ExtractionStats; error?: string }>>({})
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // State — validare M3
  const [validatingId, setValidatingId] = useState<string | null>(null)
  const [validatingBatch, setValidatingBatch] = useState(false)
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({})
  const [expandedValidation, setExpandedValidation] = useState<string | null>(null)

  // State — filtre
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [selectedSubdomains, setSelectedSubdomains] = useState<string[]>([])
  const [selectedActTypes, setSelectedActTypes] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<PipelineStatus[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // State — sidebar mobile
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // State — import URL modal
  const [importModalOpen, setImportModalOpen] = useState(false)

  // ==========================================
  // DATA FETCHING
  // ==========================================

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    try {
      const [actsRes, taxRes] = await Promise.all([
        fetch('/api/admin/legal-acts'),
        fetch('/api/admin/legal-taxonomy'),
      ])
      const actsData = await actsRes.json()
      const taxData = await taxRes.json().catch(() => ({ taxonomy: [] }))

      if (actsData.acts) {
        setActs(actsData.acts)
        // Pre-populate validation results from DB
        const vr: Record<string, ValidationResult> = {}
        for (const act of actsData.acts) {
          if (act.validation_result) {
            vr[act.id] = act.validation_result
          }
        }
        setValidationResults(vr)
      }

      if (taxData.taxonomy) {
        setTaxonomy(taxData.taxonomy)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // FILTRARE — COMPUTED
  // ==========================================

  /** Domenii disponibile din taxonomie sau fallback din acte */
  const availableDomains = useMemo(() => {
    if (taxonomy.length > 0) {
      const domains = new Map<string, { code: string; name: string; count: number }>()
      for (const t of taxonomy) {
        if (!domains.has(t.domain_code)) {
          domains.set(t.domain_code, { code: t.domain_code, name: t.domain_name, count: 0 })
        }
      }
      // Numără acte per domeniu
      for (const act of acts) {
        for (const d of getActDomains(act)) {
          const domain = domains.get(d)
          if (domain) domain.count++
        }
      }
      return Array.from(domains.values()).sort((a, b) => {
        const order = ['SSM', 'PSI', 'MUNCA', 'GDPR', 'NIS2', 'MEDIU', 'FISCAL', 'ALTELE']
        return order.indexOf(a.code) - order.indexOf(b.code)
      })
    }
    // Fallback: extrage din acte
    const domainSet = new Map<string, number>()
    for (const act of acts) {
      for (const d of getActDomains(act)) {
        domainSet.set(d, (domainSet.get(d) || 0) + 1)
      }
    }
    return Array.from(domainSet.entries()).map(([code, count]) => ({
      code,
      name: code,
      count,
    }))
  }, [acts, taxonomy])

  /** Subdomenii pentru domeniul selectat */
  const availableSubdomains = useMemo(() => {
    if (!selectedDomain || taxonomy.length === 0) return []
    return taxonomy
      .filter((t) => t.domain_code === selectedDomain && t.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
  }, [selectedDomain, taxonomy])

  /** Tipuri act existente */
  const availableActTypes = useMemo(() => {
    const types = new Set<string>()
    for (const act of acts) {
      if (act.act_type) types.add(act.act_type.toUpperCase())
    }
    return Array.from(types).sort((a, b) => {
      const orderA = ACT_TYPES[a]?.order ?? 99
      const orderB = ACT_TYPES[b]?.order ?? 99
      return orderA - orderB
    })
  }, [acts])

  /** Acte filtrate */
  const filteredActs = useMemo(() => {
    let result = [...acts]

    // Filtru domeniu
    if (selectedDomain) {
      result = result.filter((act) => getActDomains(act).includes(selectedDomain))
    }

    // Filtru subdomenii
    if (selectedSubdomains.length > 0) {
      result = result.filter((act) => {
        const actSubs = act.subdomains || []
        return selectedSubdomains.some((s) => actSubs.includes(s))
      })
    }

    // Filtru tip act
    if (selectedActTypes.length > 0) {
      result = result.filter((act) =>
        selectedActTypes.includes(act.act_type?.toUpperCase())
      )
    }

    // Filtru status pipeline
    if (selectedStatuses.length > 0) {
      result = result.filter((act) => selectedStatuses.includes(getActPipelineStatus(act)))
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (act) =>
          act.act_short_name?.toLowerCase().includes(q) ||
          act.act_full_name?.toLowerCase().includes(q) ||
          `${act.act_number}/${act.act_year}`.includes(q)
      )
    }

    return result
  }, [acts, selectedDomain, selectedSubdomains, selectedActTypes, selectedStatuses, searchQuery])

  /** Statistici pentru header */
  const stats = useMemo(() => {
    const total = acts.length
    const withText = acts.filter((a) => a.full_text_metadata?.characters > 0).length
    const extracted = acts.filter((a) => a.ai_extraction_date).length
    const validated = Object.keys(validationResults).length
    return { total, withText, extracted, validated }
  }, [acts, validationResults])

  const hasActiveFilters = selectedDomain || selectedSubdomains.length > 0 || selectedActTypes.length > 0 || selectedStatuses.length > 0 || searchQuery.trim()

  function clearAllFilters() {
    setSelectedDomain(null)
    setSelectedSubdomains([])
    setSelectedActTypes([])
    setSelectedStatuses([])
    setSearchQuery('')
  }

  // ==========================================
  // M2: EXTRACȚIE
  // ==========================================

  async function handleExtract(actId: string) {
    setExtractingId(actId)
    setExtractionResults((prev) => ({ ...prev, [actId]: undefined as any }))

    try {
      const res = await fetch('/api/admin/legal-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ act_id: actId }),
      })
      const data = await res.json()

      if (data.success) {
        setExtractionResults((prev) => ({
          ...prev,
          [actId]: { success: true, stats: data.stats },
        }))
        fetchAll()
      } else {
        setExtractionResults((prev) => ({
          ...prev,
          [actId]: { success: false, error: data.error },
        }))
      }
    } catch (err: any) {
      setExtractionResults((prev) => ({
        ...prev,
        [actId]: { success: false, error: err.message },
      }))
    } finally {
      setExtractingId(null)
    }
  }

  // ==========================================
  // M3: VALIDARE
  // ==========================================

  async function handleValidate(actId: string) {
    setValidatingId(actId)
    try {
      const res = await fetch('/api/admin/legal-validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ act_id: actId }),
      })
      const data = await res.json()
      if (data.success && data.result) {
        setValidationResults((prev) => ({ ...prev, [actId]: data.result }))
      }
    } catch (err) {
      console.error('Validation error:', err)
    } finally {
      setValidatingId(null)
    }
  }

  async function handleValidateBatch() {
    setValidatingBatch(true)
    try {
      const res = await fetch('/api/admin/legal-validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batch: true }),
      })
      const data = await res.json()
      if (data.success && data.results) {
        const vr: Record<string, ValidationResult> = {}
        for (const r of data.results) {
          vr[r.act_id] = r
        }
        setValidationResults((prev) => ({ ...prev, ...vr }))
      }
    } catch (err) {
      console.error('Batch validation error:', err)
    } finally {
      setValidatingBatch(false)
    }
  }

  // ==========================================
  // BADGE-URI
  // ==========================================

  function getStatusBadge(act: LegalAct) {
    const pipelineStatus = getActPipelineStatus(act)
    const config = {
      no_text: { icon: AlertTriangle, bg: 'bg-slate-100', text: 'text-slate-500', label: 'Fără text' },
      text_imported: { icon: FileText, bg: 'bg-blue-100', text: 'text-blue-700', label: 'Text importat' },
      ai_extracted: { icon: CheckCircle, bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'AI extras' },
      validated: { icon: ShieldCheck, bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Validat' },
    }
    const c = config[pipelineStatus]
    const Icon = c.icon
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        <Icon className="w-3 h-3" /> {c.label}
      </span>
    )
  }

  function getDomainBadges(act: LegalAct) {
    const domains = getActDomains(act)
    return domains.map((d) => {
      const colors = DOMAIN_COLORS[d] || DOMAIN_COLORS.ALTELE
      return (
        <span key={d} className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
          {d}
        </span>
      )
    })
  }

  function getValidationBadge(actId: string) {
    const vr = validationResults[actId]
    if (!vr) return null

    const config = {
      ok: { icon: ShieldCheck, bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Valid' },
      warning: { icon: ShieldAlert, bg: 'bg-amber-100', text: 'text-amber-700', label: 'Atenție' },
      error: { icon: ShieldX, bg: 'bg-red-100', text: 'text-red-700', label: 'Probleme' },
    }

    const c = config[vr.overall_status]
    const Icon = c.icon

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        <Icon className="w-3 h-3" />
        {c.label} ({vr.score}%)
      </span>
    )
  }

  // ==========================================
  // VALIDATION PANEL — cu traduceri RO
  // ==========================================

  function getCheckIcon(status: 'ok' | 'warning' | 'error') {
    switch (status) {
      case 'ok': return <span className="text-emerald-500">🟢</span>
      case 'warning': return <span className="text-amber-500">🟡</span>
      case 'error': return <span className="text-red-500">🔴</span>
    }
  }

  function renderValidationPanel(actId: string) {
    const vr = validationResults[actId]
    if (!vr) return null

    return (
      <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm space-y-3">
        {/* Score bar */}
        <div className="flex items-center gap-3">
          <span className="text-slate-600 font-medium">Scor validare:</span>
          <div className="flex-1 bg-slate-200 rounded-full h-3 max-w-xs">
            <div
              className={`h-3 rounded-full transition-all ${
                vr.score >= 70 ? 'bg-emerald-500' : vr.score >= 40 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${vr.score}%` }}
            />
          </div>
          <span className={`font-bold text-lg ${
            vr.score >= 70 ? 'text-emerald-600' : vr.score >= 40 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {vr.score}%
          </span>
        </div>

        {/* Checks list — CU TRADUCERI RO */}
        <div className="space-y-2">
          {vr.checks.map((check, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2 bg-white rounded border">
              <span className="mt-0.5">{getCheckIcon(check.status)}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700 text-xs">
                    {CHECK_NAMES_RO[check.name] || check.name.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({CHECK_WEIGHTS[check.name] || 10}%)
                  </span>
                </div>
                <p className="text-slate-600 text-xs mt-0.5">{check.message}</p>

                {/* Detalii specifice per check */}
                {check.name === 'article_coverage' && check.details?.missing_total > 0 && (
                  <details className="mt-1">
                    <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">
                      {check.details.missing_total} articole fără obligații extrase
                    </summary>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      {check.details.missing_articles?.join(', ')}
                      {check.details.missing_total > 30 && ` ... și încă ${check.details.missing_total - 30}`}
                    </p>
                  </details>
                )}

                {check.name === 'obligations_quality' && check.details && (
                  <div className="flex gap-3 mt-1 text-xs text-slate-400">
                    <span>angajator: {check.details.by_type?.employer || 0}</span>
                    <span>angajat: {check.details.by_type?.employee || 0}</span>
                    <span>SEPP: {check.details.by_type?.sepp || 0}</span>
                    <span>autoritate: {check.details.by_type?.authority || 0}</span>
                  </div>
                )}

                {check.name === 'penalties_validity' && check.details?.issues?.length > 0 && (
                  <div className="mt-1 text-xs text-red-500">
                    {check.details.issues.map((issue: string, i: number) => (
                      <div key={i}>⚠ {issue}</div>
                    ))}
                  </div>
                )}

                {check.name === 'cross_references' && check.details?.missing_acts?.length > 0 && (
                  <details className="mt-1">
                    <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">
                      {check.details.missing} acte referențiate lipsă din DB
                    </summary>
                    <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                      {check.details.missing_acts.map((ma: any, i: number) => (
                        <div key={i} className="font-mono">
                          {ma.target} ← {ma.source_article} ({ma.type})
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-400">
          Validat: {new Date(vr.validated_at).toLocaleString('ro-RO')}
        </p>
      </div>
    )
  }

  // ==========================================
  // RENDER — SIDEBAR
  // ==========================================

  function renderSidebar() {
    return (
      <div className="space-y-5">
        {/* Search */}
        <div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Caută act..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Domenii */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Domenii
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => {
                setSelectedDomain(null)
                setSelectedSubdomains([])
              }}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition ${
                !selectedDomain
                  ? 'bg-teal-50 text-teal-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Toate ({acts.length})
            </button>
            {availableDomains.map((d) => {
              const colors = DOMAIN_COLORS[d.code] || DOMAIN_COLORS.ALTELE
              const isSelected = selectedDomain === d.code
              return (
                <button
                  key={d.code}
                  onClick={() => {
                    setSelectedDomain(isSelected ? null : d.code)
                    setSelectedSubdomains([])
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition flex items-center justify-between ${
                    isSelected
                      ? `${colors.bg} ${colors.text} font-medium`
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{d.name || d.code}</span>
                  <span className={`text-xs ${isSelected ? colors.text : 'text-slate-400'}`}>
                    {d.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Subdomenii — doar dacă e selectat un domeniu */}
        {selectedDomain && availableSubdomains.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Subdomenii {selectedDomain}
            </h3>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {availableSubdomains.map((sub) => {
                const isChecked = selectedSubdomains.includes(sub.subdomain_code)
                return (
                  <label
                    key={sub.subdomain_code}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setSelectedSubdomains((prev) =>
                          isChecked
                            ? prev.filter((s) => s !== sub.subdomain_code)
                            : [...prev, sub.subdomain_code]
                        )
                      }}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="truncate">{sub.subdomain_name}</span>
                  </label>
                )
              })}
            </div>
          </div>
        )}

        {/* Tip act */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Tip act
          </h3>
          <div className="space-y-1">
            {availableActTypes.map((type) => {
              const isChecked = selectedActTypes.includes(type)
              return (
                <label
                  key={type}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      setSelectedActTypes((prev) =>
                        isChecked ? prev.filter((t) => t !== type) : [...prev, type]
                      )
                    }}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>{ACT_TYPES[type]?.label || type}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Status pipeline */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Status pipeline
          </h3>
          <div className="space-y-1">
            {(Object.entries(PIPELINE_STATUSES) as [PipelineStatus, { label: string; color: string }][]).map(
              ([key, val]) => {
                const isChecked = selectedStatuses.includes(key)
                return (
                  <label
                    key={key}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setSelectedStatuses((prev) =>
                          isChecked ? prev.filter((s) => s !== key) : [...prev, key]
                        )
                      }}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className={val.color}>{val.label}</span>
                  </label>
                )
              }
            )}
          </div>
        </div>

        {/* Resetare filtre */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-3.5 h-3.5" />
            Resetează filtrele
          </button>
        )}
      </div>
    )
  }

  // ==========================================
  // RENDER — ACT CARD
  // ==========================================

  function renderActCard(act: LegalAct) {
    const isExtracting = extractingId === act.id
    const result = extractionResults[act.id]
    const isExpanded = expandedId === act.id
    const isValidating = validatingId === act.id
    const isValidationExpanded = expandedValidation === act.id
    const hasText = act.full_text_metadata?.characters > 0
    const hasAI = !!act.ai_extraction_date

    return (
      <div
        key={act.id}
        className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-semibold text-slate-800">{act.act_short_name}</span>
              {getDomainBadges(act)}
              {getStatusBadge(act)}
              {getValidationBadge(act.id)}
            </div>
            <p className="text-xs text-slate-500 truncate">
              {act.act_full_name}
            </p>
            {hasText && (
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                <span>{act.full_text_metadata?.characters?.toLocaleString()} chars</span>
                <span>~{act.full_text_metadata?.estimatedTokens?.toLocaleString()} tokens</span>
                <span>{act.full_text_metadata?.articles} articole</span>
                {act.ai_extraction_date && (
                  <span className="text-emerald-600">
                    Extras: {new Date(act.ai_extraction_date).toLocaleDateString('ro-RO')}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-3 flex-shrink-0">
            {/* Buton Validare M3 */}
            {hasAI && (
              <button
                onClick={() => {
                  if (validationResults[act.id]) {
                    setExpandedValidation(isValidationExpanded ? null : act.id)
                    setExpandedId(null)
                  } else {
                    handleValidate(act.id)
                  }
                }}
                disabled={isValidating || validatingBatch}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition
                  ${isValidating
                    ? 'bg-amber-100 text-amber-700 cursor-wait'
                    : validationResults[act.id]
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }
                `}
                title={validationResults[act.id] ? 'Vezi / ascunde validare' : 'Validează extracția'}
              >
                {isValidating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
                {isValidating ? 'Validez...' : validationResults[act.id] ? 'Validare' : 'Validează'}
              </button>
            )}

            {/* Expand/Collapse extracție */}
            {act.ai_extraction_result && (
              <button
                onClick={() => {
                  setExpandedId(isExpanded ? null : act.id)
                  setExpandedValidation(null)
                }}
                className="p-2 text-slate-400 hover:text-slate-600 transition"
                title="Vezi rezultate extracție"
              >
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            )}

            {/* Buton Extract */}
            {hasText && (
              <button
                onClick={() => handleExtract(act.id)}
                disabled={isExtracting || extractingId !== null}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
                  ${isExtracting
                    ? 'bg-amber-100 text-amber-700 cursor-wait'
                    : extractingId !== null
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : hasAI
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-teal-600 text-white hover:bg-teal-700 shadow'
                  }
                `}
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Extrag...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    {hasAI ? 'Re-extrage' : 'Extrage cu AI'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Rezultat extracție inline */}
        {result && (
          <div
            className={`mt-3 p-3 rounded-lg text-sm ${
              result.success
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {result.success && result.stats ? (
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Extras cu succes!
                </span>
                <span><strong>{result.stats.obligations}</strong> obligații</span>
                <span><strong>{result.stats.obligations_employer}</strong> angajator</span>
                <span><strong>{result.stats.penalties}</strong> sancțiuni</span>
                <span><strong>{result.stats.cross_references}</strong> referințe</span>
                <span><strong>{result.stats.key_definitions}</strong> definiții</span>
                {result.stats.penalty_range && (
                  <span className="text-red-600">Amenzi: {result.stats.penalty_range}</span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                {result.error}
              </div>
            )}
          </div>
        )}

        {/* M3: Validation panel */}
        {isValidationExpanded && renderValidationPanel(act.id)}

        {/* Expanded view — detalii extracție */}
        {isExpanded && act.ai_extraction_result && (
          <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm space-y-3">
            <p className="text-slate-600">{act.ai_extraction_result.summary}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-lg text-center border">
                <div className="text-2xl font-bold text-teal-600">{act.ai_extraction_result.obligations?.length || 0}</div>
                <div className="text-xs text-slate-500">Obligații</div>
              </div>
              <div className="bg-white p-3 rounded-lg text-center border">
                <div className="text-2xl font-bold text-red-600">{act.ai_extraction_result.penalties?.length || 0}</div>
                <div className="text-xs text-slate-500">Sancțiuni</div>
              </div>
              <div className="bg-white p-3 rounded-lg text-center border">
                <div className="text-2xl font-bold text-blue-600">{act.ai_extraction_result.cross_references?.length || 0}</div>
                <div className="text-xs text-slate-500">Referințe</div>
              </div>
              <div className="bg-white p-3 rounded-lg text-center border">
                <div className="text-2xl font-bold text-purple-600">{act.ai_extraction_result.key_definitions?.length || 0}</div>
                <div className="text-xs text-slate-500">Definiții</div>
              </div>
            </div>

            {/* Lista obligații */}
            {act.ai_extraction_result.obligations?.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">
                  Obligații ({act.ai_extraction_result.obligations.length})
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {act.ai_extraction_result.obligations.map((o: any, idx: number) => (
                    <div key={idx} className="bg-white p-2 rounded border text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-teal-600">{o.article_ref}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          o.obligation_type === 'employer' ? 'bg-teal-100 text-teal-700' :
                          o.obligation_type === 'employee' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {o.obligation_type}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          o.severity === 'critical' ? 'bg-red-100 text-red-700' :
                          o.severity === 'important' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {o.severity}
                        </span>
                      </div>
                      <p className="text-slate-700">{o.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // ==========================================
  // RENDER PRINCIPAL
  // ==========================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    )
  }

  const actsExtracted = acts.filter((a) => a.ai_extraction_date)

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Database className="w-7 h-7 text-teal-600" />
            Legislație — Pipeline & Filtrare
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {stats.total} acte · {stats.withText} cu text · {stats.extracted} extrase AI
            {stats.validated > 0 && <> · {stats.validated} validate</>}
            {hasActiveFilters && (
              <span className="text-teal-600 font-medium"> · {filteredActs.length} afișate</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Buton Import URL */}
          <button
            onClick={() => setImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition font-medium"
          >
            <Link className="w-4 h-4" />
            Import URL
          </button>

          {/* Buton: Validează toate */}
          {actsExtracted.length > 0 && (
            <button
              onClick={handleValidateBatch}
              disabled={validatingBatch || extractingId !== null}
              className={`
                flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg font-medium transition
                ${validatingBatch
                  ? 'bg-amber-100 text-amber-700 cursor-wait'
                  : 'bg-teal-600 text-white hover:bg-teal-700 shadow'
                }
              `}
            >
              {validatingBatch ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Validez...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  Validează ({actsExtracted.length})
                </>
              )}
            </button>
          )}

          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
          >
            <Filter className="w-4 h-4" />
            Filtre
          </button>

          <button
            onClick={fetchAll}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* LAYOUT: Sidebar + Content */}
      <div className="flex gap-6">
        {/* SIDEBAR — desktop: always visible (md = 768px+) */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          {renderSidebar()}
        </aside>

        {/* SIDEBAR — mobile: fullscreen overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Filtre</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderSidebar()}
          </div>
        )}

        {/* CONTENT */}
        <main className="flex-1 min-w-0">
          {filteredActs.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">Niciun act găsit</p>
              <p className="text-sm mt-1">
                {hasActiveFilters
                  ? 'Încearcă alte filtre sau resetează-le.'
                  : 'Nu există acte în baza de date.'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="mt-3 text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Resetează filtrele
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActs.map((act) => renderActCard(act))}
            </div>
          )}
        </main>
      </div>

      {/* MODAL — Import URL (placeholder, va fi implementat complet în Task 3) */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Link className="w-5 h-5 text-blue-600" />
                Import legislație din URL
              </h2>
              <button onClick={() => setImportModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Se va implementa în sesiunea următoare — input URL legislatie.just.ro → auto-fetch text → selector domenii la import.
            </p>
            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 space-y-2">
              <p>Funcționalități planificate:</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-500">
                <li>Input URL de pe legislatie.just.ro</li>
                <li>Auto-fetch și parsare text legislativ</li>
                <li>Selector domenii + subdomenii (din taxonomie)</li>
                <li>Previzualizare text importat</li>
                <li>Validare automată post-import</li>
              </ul>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
              >
                Închide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
