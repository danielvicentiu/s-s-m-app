'use client'

// app/[locale]/dashboard/obligations/ObligationsClient.tsx
// Client component cu tabel obligații, filtre, progress bar

import { useState, useMemo } from 'react'
import { FileText, Filter, CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import type { ObligationType, CountryCode } from '@/lib/types'
import { COUNTRY_FLAGS, COUNTRY_NAMES } from '@/lib/types'

interface ObligationsClientProps {
  user: { id: string; email: string }
  organizations: Array<{ id: string; name: string; cui: string | null; country_code?: CountryCode }>
  obligationTypes: ObligationType[]
  profiles: Array<{ id: string; full_name: string }>
  stats: {
    total: number
    fulfilled: number
    in_progress: number
    not_fulfilled: number
  }
}

type StatusFilter = 'all' | 'fulfilled' | 'in_progress' | 'not_fulfilled'
type CategoryFilter = 'all' | 'medicina_muncii' | 'psi' | 'ssm' | 'altele'

export default function ObligationsClient({
  user,
  organizations,
  obligationTypes,
  profiles,
  stats,
}: ObligationsClientProps) {
  const [selectedOrg, setSelectedOrg] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mapare categorii (pentru MVP, folosim name-based categorization)
  const getCategoryFromName = (name: string): CategoryFilter => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('medicina') || lowerName.includes('medical')) return 'medicina_muncii'
    if (lowerName.includes('psi') || lowerName.includes('incendi') || lowerName.includes('stingat')) return 'psi'
    if (lowerName.includes('ssm') || lowerName.includes('securitate') || lowerName.includes('protecție')) return 'ssm'
    return 'altele'
  }

  // Mock status pentru demo (în viitor, din organization_obligations)
  const getObligationStatus = (obligationId: string): StatusFilter => {
    // Pentru demo, distribuim aleatoriu bazat pe id
    const hash = obligationId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const rand = hash % 100
    if (rand < 30) return 'fulfilled'
    if (rand < 60) return 'in_progress'
    return 'not_fulfilled'
  }

  // Filtrare obligații
  const filteredObligations = useMemo(() => {
    let filtered = [...obligationTypes]

    // Filtru organizație (prin country_code)
    if (selectedOrg !== 'all') {
      const org = organizations.find(o => o.id === selectedOrg)
      if (org?.country_code) {
        filtered = filtered.filter(o => o.country_code === org.country_code)
      }
    }

    // Filtru categorie
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(o => getCategoryFromName(o.name) === categoryFilter)
    }

    // Filtru status (mock pentru demo)
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => getObligationStatus(o.id) === statusFilter)
    }

    // Căutare text
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(o =>
        o.name.toLowerCase().includes(term) ||
        o.description?.toLowerCase().includes(term) ||
        o.legal_reference?.toLowerCase().includes(term)
      )
    }

    return filtered
  }, [obligationTypes, selectedOrg, categoryFilter, statusFilter, searchTerm, organizations])

  // Calculăm conformitate (pentru demo)
  const compliancePercentage = stats.total > 0
    ? Math.round((stats.fulfilled / stats.total) * 100)
    : 0

  const getStatusBadge = (status: StatusFilter) => {
    const config = {
      fulfilled: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2, label: 'Îndeplinit' },
      in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock, label: 'În lucru' },
      not_fulfilled: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Neîndeplinit' },
    }

    const c = config[status as keyof typeof config]
    if (!c) return null

    const Icon = c.icon

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        <Icon className="h-3 w-3" />
        {c.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Obligații Legale</h1>
          <p className="text-gray-600">Monitorizare conformitate SSM și PSI</p>
        </div>

        {/* Progress Bar Conformitate */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Gradul de conformitate</h2>
            <span className="text-2xl font-bold text-blue-600">{compliancePercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${compliancePercentage}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.fulfilled}</div>
              <div className="text-sm text-gray-600">Îndeplinite</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.in_progress}</div>
              <div className="text-sm text-gray-600">În lucru</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.not_fulfilled}</div>
              <div className="text-sm text-gray-600">Neîndeplinite</div>
            </div>
          </div>
        </div>

        {/* Filtre */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Filtre</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Organizație */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organizație
              </label>
              <select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toate organizațiile</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>
                    {COUNTRY_FLAGS[org.country_code || 'RO']} {org.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Categorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorie
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toate categoriile</option>
                <option value="medicina_muncii">Medicina Muncii</option>
                <option value="psi">PSI (Incendii)</option>
                <option value="ssm">SSM (Securitate)</option>
                <option value="altele">Altele</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toate statusurile</option>
                <option value="fulfilled">Îndeplinit</option>
                <option value="in_progress">În lucru</option>
                <option value="not_fulfilled">Neîndeplinit</option>
              </select>
            </div>

            {/* Căutare */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Căutare
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nume obligație..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Tabel Obligații */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {filteredObligations.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Nicio obligație găsită"
              description="Nu există obligații care să corespundă filtrelor selectate."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Țară
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Obligație
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bază Legală
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frecvență
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Penalități
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredObligations.map((obligation) => {
                    const status = getObligationStatus(obligation.id)
                    const category = getCategoryFromName(obligation.name)

                    return (
                      <tr key={obligation.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-2xl" title={COUNTRY_NAMES[obligation.country_code]}>
                            {COUNTRY_FLAGS[obligation.country_code]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{obligation.name}</div>
                          {obligation.description && (
                            <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {obligation.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{obligation.authority_name}</div>
                          {obligation.legal_reference && (
                            <div className="text-xs text-gray-500 mt-1">
                              {obligation.legal_reference}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 capitalize">
                            {obligation.frequency === 'annual' && 'Anual'}
                            {obligation.frequency === 'biannual' && 'Semestrial'}
                            {obligation.frequency === 'quarterly' && 'Trimestrial'}
                            {obligation.frequency === 'monthly' && 'Lunar'}
                            {obligation.frequency === 'on_demand' && 'La cerere'}
                            {obligation.frequency === 'once' && 'O dată'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {obligation.penalty_min && obligation.penalty_max ? (
                            <div className="text-sm">
                              <div className="font-medium text-red-600">
                                {obligation.penalty_min.toLocaleString()} - {obligation.penalty_max.toLocaleString()} {obligation.currency}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            className="text-blue-600 hover:text-blue-800 font-medium"
                            onClick={() => {
                              // TODO: Implementare marcare status
                              alert('Funcționalitate în dezvoltare: marcare status obligație')
                            }}
                          >
                            Actualizează
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {filteredObligations.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Afișare {filteredObligations.length} din {obligationTypes.length} obligații
          </div>
        )}

        {/* Alert info pentru utilizatori */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Informație</p>
            <p>
              Această pagină afișează obligațiile legale standard per țară. Pentru tracking detaliat al obligațiilor
              organizației dvs. și atribuirea responsabililor, vă rugăm să contactați echipa de suport pentru activarea
              modulului complet de management obligații.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
