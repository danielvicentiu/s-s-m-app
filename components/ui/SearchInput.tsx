'use client'

import { Search, X, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface SearchInputProps {
  placeholder?: string
  onSearch: (value: string) => void
  debounceMs?: number
  isLoading?: boolean
}

export default function SearchInput({
  placeholder = 'Căutare...',
  onSearch,
  debounceMs = 300,
  isLoading = false,
}: SearchInputProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout>()

  // Debounce logic
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearch(value)
    }, debounceMs)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [value, debounceMs, onSearch])

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleClear = () => {
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        {/* Search icon */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
        />

        {/* Right side: Loading spinner or Clear button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && (
            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
          )}
          {value && !isLoading && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {/* Keyboard hint */}
          {!value && !isLoading && (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded">
              <span>Ctrl</span>
              <span>K</span>
            </kbd>
          )}
        </div>
      </div>
    </div>
  )
}
