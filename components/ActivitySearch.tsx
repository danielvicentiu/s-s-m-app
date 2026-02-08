'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import activitiesData from '@/src/data/caen-activities.json'

interface Activity {
  id: string
  caen: string
  name: string
  synonyms: string[]
  riskLevel: string
  category: string
}

interface Props {
  onSelect: (activity: Activity) => void
  selected: Activity | null
}

export default function ActivitySearch({ onSelect, selected }: Props) {
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState<Activity[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    if (search.length < 2) {
      setSuggestions([])
      return
    }

    const searchLower = search.toLowerCase()
    const filtered = activitiesData.activities.filter((activity) => {
      const nameMatch = activity.name.toLowerCase().includes(searchLower)
      const synonymMatch = activity.synonyms.some((syn) =>
        syn.toLowerCase().includes(searchLower)
      )
      const caenMatch = activity.caen.includes(searchLower)
      return nameMatch || synonymMatch || caenMatch
    })

    setSuggestions(filtered.slice(0, 10))
    setShowSuggestions(true)
  }, [search])

  const handleSelect = (activity: Activity) => {
    setSearch(activity.name)
    setShowSuggestions(false)
    onSelect(activity)
  }

  return (
    <div className="relative">
      <label className="block text-sm font-bold text-gray-300 mb-2">
        Ce activitate ai? <span className="text-blue-400">*</span>
      </label>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => search.length >= 2 && setShowSuggestions(true)}
          placeholder="Scrie primele litere (ex: cof, friz, con...)"
          className="w-full bg-[#1a2332] border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-[#1a2332] border border-gray-700 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
          {suggestions.map((activity) => (
            <button
              key={activity.id}
              onClick={() => handleSelect(activity)}
              className="w-full text-left px-4 py-3 hover:bg-[#242e3f] transition-colors border-b border-gray-800 last:border-b-0"
            >
              <div className="font-semibold text-white">{activity.name}</div>
              <div className="text-xs text-gray-400 mt-1">
                CAEN {activity.caen}
                {activity.synonyms.length > 0 && (
                  <span className="ml-2">• {activity.synonyms.slice(0, 3).join(', ')}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected activity */}
      {selected && (
        <div className="mt-3 bg-blue-600/20 border border-blue-500/30 rounded-lg px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">{selected.name}</div>
              <div className="text-xs text-gray-400">CAEN {selected.caen}</div>
            </div>
            <button
              onClick={() => {
                onSelect(null as any)
                setSearch('')
              }}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Schimbă
            </button>
          </div>
        </div>
      )}

      {/* Free text fallback */}
      {search.length > 0 && suggestions.length === 0 && showSuggestions && (
        <div className="mt-3 bg-[#1a2332] border border-gray-700 rounded-lg px-4 py-3">
          <div className="text-sm text-gray-400">
            Nu găsim exact ce cauți. Descrie-ne activitatea în câteva cuvinte:
          </div>
          <textarea
            placeholder="Ex: Fac pizza la domiciliu..."
            className="w-full mt-2 bg-[#0B1120] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
          <div className="text-xs text-gray-500 mt-1">
            Vom deduce automat obligațiile tale pe baza descrierii
          </div>
        </div>
      )}
    </div>
  )
}
