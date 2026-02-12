'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, X, Users, BookOpen, Package, FileText, Loader2 } from 'lucide-react'

export interface SearchResult {
  id: string
  title: string
  subtitle?: string
  category: 'angajati' | 'instruiri' | 'echipamente' | 'documente'
  url: string
}

interface SearchBarProps {
  onSearch: (query: string) => Promise<SearchResult[]>
  onResultClick?: (result: SearchResult) => void
  placeholder?: string
  debounceMs?: number
}

const CATEGORY_CONFIG = {
  angajati: { icon: Users, label: 'Angajați', color: 'text-blue-600' },
  instruiri: { icon: BookOpen, label: 'Instruiri', color: 'text-green-600' },
  echipamente: { icon: Package, label: 'Echipamente', color: 'text-orange-600' },
  documente: { icon: FileText, label: 'Documente', color: 'text-purple-600' },
}

export function SearchBar({
  onSearch,
  onResultClick,
  placeholder = 'Caută... (Ctrl+K)',
  debounceMs = 300,
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Keyboard shortcut Ctrl+K pentru focus
  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      inputRef.current?.focus()
      setIsOpen(true)
    }
  }, [])

  // Escape pentru închidere
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
        setQuery('')
        setResults([])
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
      }

      if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
        e.preventDefault()
        handleResultClick(results[selectedIndex])
      }
    },
    [results, selectedIndex]
  )

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (query.trim().length === 0) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const searchResults = await onSearch(query.trim())
        setResults(searchResults)
        setSelectedIndex(-1)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, debounceMs)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [query, onSearch, debounceMs])

  // Click outside pentru închidere
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Global keyboard shortcut
  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [handleGlobalKeyDown])

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false)
    setQuery('')
    setResults([])
    onResultClick?.(result)
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }

  // Grupare rezultate pe categorii
  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.category]) {
        acc[result.category] = []
      }
      acc[result.category].push(result)
      return acc
    },
    {} as Record<string, SearchResult[]>
  )

  const hasResults = results.length > 0

  return (
    <div className="relative w-full max-w-2xl">
      {/* Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : query.length > 0 ? (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Șterge căutare"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Dropdown rezultate */}
      {isOpen && (query.trim().length > 0 || hasResults) && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50"
        >
          {!isLoading && !hasResults && query.trim().length > 0 && (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              Nu s-au găsit rezultate pentru &quot;{query}&quot;
            </div>
          )}

          {hasResults &&
            Object.entries(groupedResults).map(([category, categoryResults]) => {
              const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG]
              const Icon = config.icon

              return (
                <div key={category} className="py-2">
                  {/* Categorie header */}
                  <div className="px-4 py-2 flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${config.color}`} />
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {config.label}
                    </span>
                    <span className="text-xs text-gray-400">({categoryResults.length})</span>
                  </div>

                  {/* Rezultate */}
                  <div>
                    {categoryResults.map((result, idx) => {
                      const globalIndex = results.indexOf(result)
                      const isSelected = globalIndex === selectedIndex

                      return (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result)}
                          className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                            isSelected ? 'bg-blue-50' : ''
                          }`}
                        >
                          <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${config.color}`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {result.title}
                            </div>
                            {result.subtitle && (
                              <div className="text-xs text-gray-500 truncate">{result.subtitle}</div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}
