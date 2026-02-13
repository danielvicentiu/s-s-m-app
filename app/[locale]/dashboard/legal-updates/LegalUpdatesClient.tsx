'use client'

import { useState, useMemo } from 'react'
import { FileText, ExternalLink, AlertTriangle, Info } from 'lucide-react'
import { EmptyState } from '@/components/ui'
import type { LegalUpdate, CountryCode } from '@/lib/types'
import { COUNTRY_FLAGS, COUNTRY_NAMES } from '@/lib/types'

interface LegalUpdatesClientProps {
  user: { id: string; email: string }
  legalUpdates: LegalUpdate[]
}

export default function LegalUpdatesClient({ user, legalUpdates }: LegalUpdatesClientProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | 'ALL'>('ALL')
  const [selectedImpact, setSelectedImpact] = useState<'toate' | 'mare' | 'mediu' | 'mic'>('toate')

  // Filtrare updates
  const filteredUpdates = useMemo(() => {
    return legalUpdates.filter((update) => {
      const matchesCountry = selectedCountry === 'ALL' || update.country_code === selectedCountry
      const matchesImpact = selectedImpact === 'toate' || update.impact === selectedImpact
      return matchesCountry && matchesImpact
    })
  }, [legalUpdates, selectedCountry, selectedImpact])

  // Funcție helper pentru badge NOU (ultima săptămână)
  const isNew = (date: string) => {
    const pubDate = new Date(date)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return pubDate >= oneWeekAgo
  }

  // Formatare dată
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  // Culori impact
  const getImpactConfig = (impact: string) => {
    switch (impact) {
      case 'mare':
        return { bg: 'bg-red-100', text: 'text-red-700', label: 'Impact Mare' }
      case 'mediu':
        return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Impact Mediu' }
      case 'mic':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Impact Mic' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Impact Necunoscut' }
    }
  }

  // Țări unice disponibile în updates
  const availableCountries = useMemo(() => {
    const countries = new Set(legalUpdates.map(u => u.country_code))
    return Array.from(countries).sort()
  }, [legalUpdates])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Noutăți Legislative</h1>
        <p className="text-gray-600">
          Actualizări legislative SSM și PSI din România, Bulgaria, Ungaria, Germania și Polonia
        </p>
      </div>

      {/* Filtre */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filtru Țară */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Țară
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCountry('ALL')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCountry === 'ALL'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {COUNTRY_FLAGS.ALL} Toate
              </button>
              {availableCountries.map((country) => (
                <button
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCountry === country
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {COUNTRY_FLAGS[country]} {COUNTRY_NAMES[country]}
                </button>
              ))}
            </div>
          </div>

          {/* Filtru Impact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Impact
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedImpact('toate')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedImpact === 'toate'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toate
              </button>
              <button
                onClick={() => setSelectedImpact('mare')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedImpact === 'mare'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                Impact Mare
              </button>
              <button
                onClick={() => setSelectedImpact('mediu')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedImpact === 'mediu'
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }`}
              >
                Impact Mediu
              </button>
              <button
                onClick={() => setSelectedImpact('mic')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedImpact === 'mic'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Impact Mic
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Afișate <span className="font-semibold text-gray-900">{filteredUpdates.length}</span> actualizări
            {selectedCountry !== 'ALL' && ` din ${COUNTRY_NAMES[selectedCountry]}`}
          </p>
        </div>
      </div>

      {/* Lista actualizări */}
      {filteredUpdates.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <EmptyState
            icon={FileText}
            title="Nicio actualizare găsită"
            description="Nu există actualizări legislative pentru filtrele selectate"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUpdates.map((update) => {
            const impactConfig = getImpactConfig(update.impact)
            const showNewBadge = isNew(update.publication_date)

            return (
              <div
                key={update.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{COUNTRY_FLAGS[update.country_code]}</span>
                        {showNewBadge && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            NOU
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${impactConfig.bg} ${impactConfig.text}`}>
                          {impactConfig.label}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {update.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{formatDate(update.publication_date)}</span>
                        {update.legal_act_number && (
                          <>
                            <span>•</span>
                            <span className="font-medium">{update.legal_act_number}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conținut */}
                <div className="space-y-3 ml-13">
                  {/* Rezumat */}
                  <p className="text-gray-700 leading-relaxed">
                    {update.summary}
                  </p>

                  {/* Acțiune necesară */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-900 mb-1">
                          Acțiune necesară:
                        </p>
                        <p className="text-sm text-amber-800">
                          {update.action_required}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Link sursă */}
                  {update.source_url && (
                    <div className="flex items-center gap-2">
                      <a
                        href={update.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Vizualizează sursa oficială
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Info footer */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Informații despre actualizările legislative</p>
            <p className="text-blue-800">
              Monitorizăm zilnic legislația SSM și PSI din cele 5 țări pentru a vă ține la curent cu cele mai recente schimbări.
              Actualizările marcate cu badge-ul &quot;NOU&quot; au fost publicate în ultima săptămână.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
