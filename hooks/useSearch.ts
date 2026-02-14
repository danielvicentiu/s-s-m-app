// hooks/useSearch.ts
// React hook pentru search global cu debounce și keyboard shortcuts
// Fetch /api/search cu debounce 300ms, minimum 2 chars
// Ctrl+K shortcut pentru focus pe search input

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// Tipuri pentru rezultatele search-ului grupate
export interface SearchResultItem {
  id: string
  title: string
  subtitle?: string
  type: string
  url?: string
  metadata?: Record<string, any>
}

export interface GroupedSearchResults {
  employees?: SearchResultItem[]
  trainings?: SearchResultItem[]
  equipment?: SearchResultItem[]
  documents?: SearchResultItem[]
  medical_records?: SearchResultItem[]
  organizations?: SearchResultItem[]
  alerts?: SearchResultItem[]
  [key: string]: SearchResultItem[] | undefined
}

export interface UseSearchReturn {
  results: GroupedSearchResults
  isSearching: boolean
  query: string
  setQuery: (query: string) => void
  clearResults: () => void
  error: string | null
}

export default function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GroupedSearchResults>({})
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Ref pentru debounce timeout
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // Ref pentru AbortController pentru a anula request-uri anterioare
  const abortControllerRef = useRef<AbortController | null>(null)

  // Funcție pentru a efectua search-ul
  const performSearch = useCallback(async (searchQuery: string) => {
    // Minimum 2 caractere pentru search
    if (searchQuery.trim().length < 2) {
      setResults({})
      setIsSearching(false)
      setError(null)
      return
    }

    try {
      setIsSearching(true)
      setError(null)

      // Anulează request-ul anterior dacă există
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Creează nou AbortController
      abortControllerRef.current = new AbortController()

      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`)
      }

      const data = await response.json()

      // Așteaptă ca răspunsul să fie în format grupat
      setResults(data.results || data || {})
    } catch (err) {
      // Ignoră erori de abort
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }

      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'Eroare la căutare')
      setResults({})
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Effect pentru debounce la schimbarea query-ului
  useEffect(() => {
    // Curăță timeout-ul anterior
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // Dacă query e gol sau sub 2 caractere, curăță rezultatele imediat
    if (query.trim().length < 2) {
      setResults({})
      setIsSearching(false)
      setError(null)
      return
    }

    // Setează loading state imediat
    setIsSearching(true)

    // Debounce 300ms înainte de a efectua search-ul
    debounceTimeout.current = setTimeout(() => {
      performSearch(query)
    }, 300)

    // Cleanup
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [query, performSearch])

  // Keyboard shortcut Ctrl+K pentru focus pe search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K (sau Cmd+K pe Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()

        // Dispatch custom event pentru a notifica componenta search
        // Componenta care folosește acest hook va trebui să asculte acest event
        const searchFocusEvent = new CustomEvent('search:focus')
        window.dispatchEvent(searchFocusEvent)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Funcție pentru a curăța rezultatele
  const clearResults = useCallback(() => {
    setQuery('')
    setResults({})
    setError(null)
    setIsSearching(false)

    // Anulează request-ul în curs dacă există
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Curăță debounce timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }
  }, [])

  // Cleanup la unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [])

  return {
    results,
    isSearching,
    query,
    setQuery,
    clearResults,
  }
}
