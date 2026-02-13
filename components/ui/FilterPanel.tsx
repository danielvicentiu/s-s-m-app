'use client'

import { X, Filter, Calendar, Search } from 'lucide-react'
import { useState, useEffect } from 'react'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterConfig {
  id: string
  label: string
  type: 'select' | 'daterange' | 'search'
  options?: FilterOption[] // pentru type='select'
  placeholder?: string
}

export interface ActiveFilter {
  filterId: string
  label: string
  value: string | { from: string; to: string }
  displayValue: string
}

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterConfig[]
  onApply: (activeFilters: ActiveFilter[]) => void
  onReset: () => void
}

export function FilterPanel({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
}: FilterPanelProps) {
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])

  // Reset filter values when panel closes
  useEffect(() => {
    if (!isOpen) {
      setFilterValues({})
    }
  }, [isOpen])

  const handleFilterChange = (filterId: string, value: any) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterId]: value,
    }))
  }

  const handleApply = () => {
    const newActiveFilters: ActiveFilter[] = []

    filters.forEach((filter) => {
      const value = filterValues[filter.id]
      if (!value) return

      if (filter.type === 'daterange') {
        if (value.from || value.to) {
          newActiveFilters.push({
            filterId: filter.id,
            label: filter.label,
            value,
            displayValue: `${value.from || '...'} - ${value.to || '...'}`,
          })
        }
      } else if (filter.type === 'search') {
        if (value.trim()) {
          newActiveFilters.push({
            filterId: filter.id,
            label: filter.label,
            value,
            displayValue: value,
          })
        }
      } else if (filter.type === 'select') {
        const option = filter.options?.find((opt) => opt.value === value)
        if (option) {
          newActiveFilters.push({
            filterId: filter.id,
            label: filter.label,
            value,
            displayValue: option.label,
          })
        }
      }
    })

    setActiveFilters(newActiveFilters)
    onApply(newActiveFilters)
    onClose()
  }

  const handleReset = () => {
    setFilterValues({})
    setActiveFilters([])
    onReset()
    onClose()
  }

  const removeFilter = (filterId: string) => {
    const newActiveFilters = activeFilters.filter((f) => f.filterId !== filterId)
    setActiveFilters(newActiveFilters)

    const newFilterValues = { ...filterValues }
    delete newFilterValues[filterId]
    setFilterValues(newFilterValues)

    onApply(newActiveFilters)
  }

  if (!isOpen) {
    return (
      <>
        {/* Active filter chips - visible when panel is closed */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map((filter) => (
              <span
                key={filter.filterId}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
              >
                <span className="text-xs text-blue-600">{filter.label}:</span>
                {filter.displayValue}
                <button
                  onClick={() => removeFilter(filter.filterId)}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  aria-label={`Elimină filtru ${filter.label}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {activeFilters.length > 0 && (
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Resetează tot
              </button>
            )}
          </div>
        )}
      </>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Filter Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:relative lg:translate-x-0 lg:w-80 lg:shadow-lg lg:rounded-2xl
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filtrare</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            aria-label="Închide panoul de filtrare"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filters.map((filter) => (
            <div key={filter.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {filter.label}
              </label>

              {filter.type === 'select' && (
                <select
                  value={filterValues[filter.id] || ''}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">
                    {filter.placeholder || 'Selectează...'}
                  </option>
                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {filter.type === 'search' && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={filterValues[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    placeholder={filter.placeholder || 'Caută...'}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              )}

              {filter.type === 'daterange' && (
                <div className="space-y-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={filterValues[filter.id]?.from || ''}
                      onChange={(e) =>
                        handleFilterChange(filter.id, {
                          ...filterValues[filter.id],
                          from: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="De la..."
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={filterValues[filter.id]?.to || ''}
                      onChange={(e) =>
                        handleFilterChange(filter.id, {
                          ...filterValues[filter.id],
                          to: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Până la..."
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={handleApply}
            className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Aplică filtre
          </button>
          <button
            onClick={handleReset}
            className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Resetează
          </button>
        </div>
      </div>
    </>
  )
}
