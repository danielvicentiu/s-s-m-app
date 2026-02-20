'use client'

// app/[locale]/dashboard/obligations/ObligationsClient.tsx
// M7 CLIENT: Dashboard obligații legislative pentru organizații
// Features: selector org, stats, filtre (domeniu, severitate, search), expand detalii

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {
  ChevronDown,
  ChevronUp,
  Search,
  Scale,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  Building2,
  Flame,
  Lock,
  FileStack,
  TrendingUp
} from 'lucide-react'

interface Obligation {
  id: string
  source_legal_act: string
  source_article_id: string | null
  source_article_number: string | null
  country_code: string
  obligation_text: string
  who: string[]
  deadline: string | null
  frequency: string | null
  penalty: string | null
  penalty_min: number | null
  penalty_max: number | null
  penalty_currency: string | null
  evidence_required: string[]
  published_at: string | null
  domain: string // Enriched
  severity: string // Enriched
}

interface OrganizationObligation {
  id: string
  organization_id: string
  obligation_id: string
  status: 'pending' | 'acknowledged' | 'compliant' | 'non_compliant'
  assigned_at: string
  acknowledged_at: string | null
  compliant_at: string | null
  notes: string | null
  evidence_urls: string[]
  match_score: number
  match_reason: string | null
  obligation: Obligation
}

interface Stats {
  total: number
  byDomain: {
    SSM: number
    PSI: number
    GDPR: number
    Fiscal: number
    Altele: number
  }
  criticalCount: number
  newCount: number
}

interface ObligationsClientProps {
  initialOrgId: string
  organizations: Array<{ id: string; name: string }>
}

export default function ObligationsClient({
  initialOrgId,
  organizations
}: ObligationsClientProps) {
  const t = useTranslations('obligations')
  const [selectedOrgId, setSelectedOrgId] = useState(initialOrgId)
  const [obligations, setObligations] = useState<OrganizationObligation[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  // Filtre
  const [domainFilter, setDomainFilter] = useState<string>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [searchText, setSearchText] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Fetch obligations și stats
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Fetch obligations
        const oblUrl = `/api/client/obligations?org_id=${selectedOrgId}&domain=${domainFilter}&severity=${severityFilter}&search=${encodeURIComponent(searchText)}`
        const oblRes = await fetch(oblUrl)
        const oblData = await oblRes.json()

        if (oblRes.ok) {
          setObligations(oblData.obligations || [])
        } else {
          console.error('Error fetching obligations:', oblData.error)
        }

        // Fetch stats
        const statsUrl = `/api/client/obligations/stats?org_id=${selectedOrgId}`
        const statsRes = await fetch(statsUrl)
        const statsData = await statsRes.json()

        if (statsRes.ok) {
          setStats(statsData)
        } else {
          console.error('Error fetching stats:', statsData.error)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedOrgId, domainFilter, severityFilter, searchText])

  // Get selected org name
  const selectedOrgName = organizations.find(o => o.id === selectedOrgId)?.name || t('yourOrganization')

  // Domain badge helper
  const getDomainBadge = (domain: string) => {
    const badges: Record<string, { bg: string; text: string; icon: any }> = {
      SSM: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Shield },
      PSI: { bg: 'bg-orange-100', text: 'text-orange-800', icon: Flame },
      GDPR: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Lock },
      Fiscal: { bg: 'bg-green-100', text: 'text-green-800', icon: FileStack },
      Altele: { bg: 'bg-gray-100', text: 'text-gray-800', icon: FileText }
    }

    const badge = badges[domain] || badges.Altele
    const Icon = badge.icon

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${badge.bg} ${badge.text} text-xs font-medium`}>
        <Icon className="h-3.5 w-3.5" />
        {domain}
      </span>
    )
  }

  // Severity badge helper
  const getSeverityBadge = (severity: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      critical: { bg: 'bg-red-100', text: 'text-red-800', label: t('severityCritical') },
      major: { bg: 'bg-amber-100', text: 'text-amber-800', label: t('severityMajor') },
      minor: { bg: 'bg-gray-100', text: 'text-gray-800', label: t('severityMinor') }
    }

    const badge = badges[severity] || badges.minor

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${badge.bg} ${badge.text} text-xs font-medium`}>
        <AlertTriangle className="h-3.5 w-3.5" />
        {badge.label}
      </span>
    )
  }

  // Status badge helper
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: any; label: string }> = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock, label: t('statusPending') },
      acknowledged: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle2, label: t('statusAcknowledged') },
      compliant: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2, label: t('statusCompliant') },
      non_compliant: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertTriangle, label: t('statusNonCompliant') }
    }

    const badge = badges[status] || badges.pending
    const Icon = badge.icon

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${badge.bg} ${badge.text} text-xs font-medium`}>
        <Icon className="h-3.5 w-3.5" />
        {badge.label}
      </span>
    )
  }

  // Empty state
  if (!loading && obligations.length === 0 && domainFilter === 'all' && severityFilter === 'all' && !searchText) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Scale className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {t('noObligationsTitle')}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {t('noObligationsDesc')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Scale className="h-7 w-7 text-blue-600" />
                {t('title')}
              </h1>
            </div>

            {/* Selector organizație */}
            {organizations.length > 1 && (
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gray-500" />
                <select
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-6">{selectedOrgName}</p>

          {/* STAT CARDS */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('totalObligations')}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
              </div>

              {/* Pe domenii */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">SSM / PSI / GDPR</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      {stats.byDomain.SSM + stats.byDomain.PSI + stats.byDomain.GDPR}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              {/* Severitate critică */}
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-700">{t('criticalSeverity')}</p>
                    <p className="text-2xl font-bold text-red-900 mt-1">{stats.criticalCount}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </div>

              {/* Noi (ultima lună) */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">{t('newLastMonth')}</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">{stats.newCount}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* FILTRE */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtru domeniu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('domain')}
              </label>
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('all')}</option>
                <option value="SSM">SSM</option>
                <option value="PSI">PSI</option>
                <option value="GDPR">GDPR</option>
                <option value="Fiscal">{t('fiscal')}</option>
                <option value="Altele">{t('others')}</option>
              </select>
            </div>

            {/* Filtru severitate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('severity')}
              </label>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('all')}</option>
                <option value="critical">{t('severityCritical')}</option>
                <option value="major">{t('severityMajor')}</option>
                <option value="minor">{t('severityMinor')}</option>
              </select>
            </div>

            {/* Search text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('searchLabel')}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LISTA OBLIGAȚII */}
      <main className="max-w-7xl mx-auto px-8 pb-8">
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('loading')}</p>
          </div>
        ) : obligations.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Scale className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('noResultsTitle')}
            </h3>
            <p className="text-sm text-gray-500">
              {t('noResultsDesc')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {obligations.map((obl) => {
              const isExpanded = expandedId === obl.id

              return (
                <div
                  key={obl.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Card header - clickable pentru expand */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : obl.id)}
                    className="p-6 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {getStatusBadge(obl.status)}
                          {getDomainBadge(obl.obligation.domain)}
                          {getSeverityBadge(obl.obligation.severity)}
                        </div>

                        {/* Referință legislativă */}
                        <div className="mb-2">
                          <span className="text-xs font-medium text-gray-500">
                            {t('legalReference')}:
                          </span>{' '}
                          <span className="text-sm font-semibold text-blue-600">
                            {obl.obligation.source_legal_act}
                            {obl.obligation.source_article_number && `, Art. ${obl.obligation.source_article_number}`}
                          </span>
                        </div>

                        {/* Text obligație */}
                        <p className="text-base text-gray-900 leading-relaxed">
                          {obl.obligation.obligation_text}
                        </p>

                        {/* Quick info */}
                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                          {obl.obligation.frequency && (
                            <span>{t('frequency')}: {obl.obligation.frequency}</span>
                          )}
                          {obl.obligation.deadline && (
                            <span>{t('deadline')}: {obl.obligation.deadline}</span>
                          )}
                          <span>{t('published')}: {new Date(obl.assigned_at).toLocaleDateString('ro-RO')}</span>
                        </div>
                      </div>

                      {/* Expand icon */}
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="h-6 w-6" />
                        ) : (
                          <ChevronDown className="h-6 w-6" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">
                        {t('obligationDetails')}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Textul complet */}
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            {t('fullText')}:
                          </p>
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <p className="text-sm text-gray-900 leading-relaxed">
                              {obl.obligation.obligation_text}
                            </p>
                          </div>
                        </div>

                        {/* Articol exact */}
                        {obl.obligation.source_article_id && (
                          <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              {t('exactArticle')}:
                            </p>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <p className="text-sm text-gray-600">
                                {obl.obligation.source_legal_act}, Art. {obl.obligation.source_article_number}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                ID: {obl.obligation.source_article_id}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Responsabil */}
                        {obl.obligation.who && obl.obligation.who.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              {t('responsible')}:
                            </p>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <p className="text-sm text-gray-900">
                                {obl.obligation.who.join(', ')}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Frecvență + Termen */}
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            {t('frequencyAndDeadline')}:
                          </p>
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            {obl.obligation.frequency && (
                              <p className="text-sm text-gray-900">
                                {t('frequency')}: {obl.obligation.frequency}
                              </p>
                            )}
                            {obl.obligation.deadline && (
                              <p className="text-sm text-gray-900 mt-1">
                                {t('deadline')}: {obl.obligation.deadline}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Sancțiuni */}
                        {obl.obligation.penalty && (
                          <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              {t('associatedPenalties')}:
                            </p>
                            <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                              <p className="text-sm text-red-900 font-medium">
                                {obl.obligation.penalty}
                              </p>
                              {obl.obligation.penalty_min && obl.obligation.penalty_max && (
                                <p className="text-xs text-red-700 mt-2">
                                  Interval amenzi: {obl.obligation.penalty_min.toLocaleString()} - {obl.obligation.penalty_max.toLocaleString()} {obl.obligation.penalty_currency}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Dovezi necesare */}
                        {obl.obligation.evidence_required && obl.obligation.evidence_required.length > 0 && (
                          <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              {t('requiredEvidence')}:
                            </p>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <ul className="list-disc list-inside text-sm text-gray-900 space-y-1">
                                {obl.obligation.evidence_required.map((evidence, idx) => (
                                  <li key={idx}>{evidence}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Note consultant */}
                        {obl.notes && (
                          <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              {t('notes')}:
                            </p>
                            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                              <p className="text-sm text-blue-900">{obl.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Dates */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          <span>
                            {t('assignedAt')}: {new Date(obl.assigned_at).toLocaleDateString('ro-RO')}
                          </span>
                          {obl.acknowledged_at && (
                            <span>
                              {t('acknowledgedAt')}: {new Date(obl.acknowledged_at).toLocaleDateString('ro-RO')}
                            </span>
                          )}
                          {obl.compliant_at && (
                            <span>
                              {t('compliantAt')}: {new Date(obl.compliant_at).toLocaleDateString('ro-RO')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
