'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, X, ChevronDown, Loader2, Plus } from 'lucide-react'
import { searchCaenActivities, type CaenActivity } from '@/data/caen-activities'
import { StepWrapper } from './StepWrapper'

interface Props {
  selected: CaenActivity[]
  onChange: (activities: CaenActivity[]) => void
  onNext: () => void
}

export function StepActivity({ selected, onChange, onNext }: Props) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<CaenActivity[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [showFreeText, setShowFreeText] = useState(false)
  const [freeText, setFreeText] = useState('')
  const [loadingDetect, setLoadingDetect] = useState(false)
  const [detectError, setDetectError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Search when query changes
  useEffect(() => {
    if (query.length >= 2) {
      const results = searchCaenActivities(query)
      setSuggestions(results)
      setShowDropdown(results.length > 0)
    } else {
      setSuggestions([])
      setShowDropdown(false)
    }
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectActivity = useCallback(
    (activity: CaenActivity) => {
      if (!selected.find((a) => a.code === activity.code)) {
        onChange([...selected, activity])
      }
      setQuery('')
      setSuggestions([])
      setShowDropdown(false)
      inputRef.current?.focus()
    },
    [selected, onChange]
  )

  const removeActivity = useCallback(
    (code: string) => {
      onChange(selected.filter((a) => a.code !== code))
    },
    [selected, onChange]
  )

  const handleDetectCaen = async () => {
    if (!freeText.trim() || freeText.trim().length < 10) {
      setDetectError('Descrieți activitatea în cel puțin 10 caractere.')
      return
    }
    setLoadingDetect(true)
    setDetectError('')
    try {
      const res = await fetch('/api/onboarding/detect-caen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: freeText }),
      })
      const data = await res.json()
      if (data.suggestions && data.suggestions.length > 0) {
        const newActivities = data.suggestions.filter(
          (s: CaenActivity) => !selected.find((a) => a.code === s.code)
        )
        onChange([...selected, ...newActivities])
        setShowFreeText(false)
        setFreeText('')
      } else {
        setDetectError('Nu am putut identifica o activitate CAEN. Descrieți mai detaliat.')
      }
    } catch {
      setDetectError('Eroare la detectare. Încercați din nou.')
    } finally {
      setLoadingDetect(false)
    }
  }

  return (
    <StepWrapper
      title="Ce activitate desfășurați?"
      subtitle="Selectați activitatea principală a firmei dvs. Puteți alege mai multe."
      onNext={onNext}
      nextDisabled={selected.length === 0}
      nextLabel="Continuă"
    >
      <div className="space-y-4">
        {/* Selected chips */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selected.map((activity) => (
              <span
                key={activity.code}
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 border border-blue-200"
              >
                <span className="font-mono text-xs text-blue-500">{activity.code}</span>
                <span className="max-w-[200px] truncate">{activity.label_ro}</span>
                <button
                  onClick={() => removeActivity(activity.code)}
                  className="ml-1 text-blue-400 hover:text-blue-700 transition-colors"
                  aria-label={`Elimină ${activity.label_ro}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Search input */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true)
              }}
              placeholder="Scrie activitatea (ex: cofetărie, construcții, IT...)"
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              autoComplete="off"
            />
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden"
            >
              {suggestions.map((activity) => {
                const isSelected = selected.some((a) => a.code === activity.code)
                return (
                  <button
                    key={activity.code}
                    onClick={() => selectActivity(activity)}
                    disabled={isSelected}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                      isSelected
                        ? 'bg-blue-50 cursor-default'
                        : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-xs text-gray-400 w-10">
                      {activity.code}
                    </span>
                    <span className="flex-1 text-sm text-gray-700 leading-snug">
                      {activity.label_ro}
                    </span>
                    {isSelected && (
                      <span className="shrink-0 text-xs text-blue-600 font-medium">Adăugat</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Free text fallback */}
        {!showFreeText ? (
          <button
            type="button"
            onClick={() => setShowFreeText(true)}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronDown className="h-4 w-4" />
            Nu găsești? Descrie activitatea cu cuvintele tale
          </button>
        ) : (
          <div className="space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <label className="block text-sm font-medium text-gray-700">
              Descrieți activitatea firmei
            </label>
            <textarea
              value={freeText}
              onChange={(e) => {
                setFreeText(e.target.value)
                setDetectError('')
              }}
              placeholder="Ex: facem prăjituri și le vindem în magazinele noastre din București"
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {detectError && (
              <p className="text-xs text-red-600">{detectError}</p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDetectCaen}
                disabled={loadingDetect || freeText.trim().length < 10}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loadingDetect ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {loadingDetect ? 'Detectez...' : 'Detectează codul CAEN'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowFreeText(false)
                  setFreeText('')
                  setDetectError('')
                }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Anulează
              </button>
            </div>
          </div>
        )}

        {selected.length === 0 && (
          <p className="text-xs text-gray-400">
            Selectați cel puțin o activitate pentru a continua.
          </p>
        )}
      </div>
    </StepWrapper>
  )
}
