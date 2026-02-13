'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, Users, BookOpen, Wrench, FileText } from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  subtitle?: string
  category: 'angajati' | 'instruiri' | 'echipamente' | 'documente'
  url: string
}

interface SearchBarProps {
  onSearch?: (query: string) => Promise<SearchResult[]>
  placeholder?: string
  className?: string
}

const CATEGORY_CONFIG = {
  angajati: { label: 'Angajați', icon: Users, color: 'text-blue-600' },
  instruiri: { label: 'Instruiri', icon: BookOpen, color: 'text-green-600' },
  echipamente: { label: 'Echipamente', icon: Wrench, color: 'text-orange-600' },
  documente: { label: 'Documente', icon: FileText, color: 'text-purple-600' },
}

export function SearchBar({ onSearch, placeholder = 'Caută...', className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Debounced search
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim() || !onSearch) {
        setResults([])
        setIsOpen(false)
        return
      }

      setIsLoading(true)
      try {
        const searchResults = await onSearch(searchQuery)
        setResults(searchResults)
        setIsOpen(searchResults.length > 0)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    },
    [onSearch]
  )

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      performSearch(newQuery)
    }, 300)
  }

  // Handle clear
  const handleClear = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  // Ctrl+K to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Group results by category
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = []
    }
    acc[result.category].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-24 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs text-gray-500 font-mono">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-96 overflow-y-auto z-50"
        >
          {isLoading ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              Se caută...
            </div>
          ) : Object.keys(groupedResults).length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              Niciun rezultat găsit
            </div>
          ) : (
            <div className="py-2">
              {Object.entries(groupedResults).map(([category, items]) => {
                const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG]
                const Icon = config.icon

                return (
                  <div key={category} className="mb-2 last:mb-0">
                    {/* Category Header */}
                    <div className="px-4 py-2 flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${config.color}`} />
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {config.label}
                      </span>
                      <span className="text-xs text-gray-400">({items.length})</span>
                    </div>

                    {/* Category Items */}
                    {items.map((result) => (
                      <a
                        key={result.id}
                        href={result.url}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2.5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.color}`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {result.title}
                            </div>
                            {result.subtitle && (
                              <div className="text-xs text-gray-500 truncate mt-0.5">
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
