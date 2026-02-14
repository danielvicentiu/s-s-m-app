'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, ChevronDown, Check } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  icon?: React.ReactNode
  group?: string
}

export interface SelectDropdownProps {
  options: SelectOption[]
  value?: string | string[]
  onChange: (value: string | string[]) => void
  placeholder?: string
  searchable?: boolean
  multi?: boolean
  disabled?: boolean
  className?: string
}

export default function SelectDropdown({
  options,
  value,
  onChange,
  placeholder = 'Selectează...',
  searchable = false,
  multi = false,
  disabled = false,
  className = ''
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Convert value to array for consistent handling
  const selectedValues = multi
    ? Array.isArray(value)
      ? value
      : value
      ? [value]
      : []
    : value
    ? [String(value)]
    : []

  // Filter options based on search term
  const filteredOptions = searchTerm
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  // Group options if any have a group property
  const hasGroups = options.some(opt => opt.group)
  const groupedOptions = hasGroups
    ? filteredOptions.reduce((acc, option) => {
        const group = option.group || 'Altele'
        if (!acc[group]) acc[group] = []
        acc[group].push(option)
        return acc
      }, {} as Record<string, SelectOption[]>)
    : { '': filteredOptions }

  // Get selected option labels for display
  const getSelectedLabels = () => {
    return options
      .filter(opt => selectedValues.includes(opt.value))
      .map(opt => opt.label)
  }

  // Handle option selection
  const handleSelect = (optionValue: string) => {
    if (multi) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue]
      onChange(newValues)
    } else {
      onChange(optionValue)
      setIsOpen(false)
      setSearchTerm('')
    }
  }

  // Handle clear all
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(multi ? [] : '')
    setSearchTerm('')
  }

  // Handle remove single chip in multi-select
  const handleRemoveChip = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (multi) {
      const newValues = selectedValues.filter(v => v !== optionValue)
      onChange(newValues)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, searchable])

  const selectedLabels = getSelectedLabels()
  const hasSelection = selectedValues.length > 0

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full min-h-[42px] px-4 py-2 text-left
          bg-white border border-gray-300 rounded-lg
          hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-colors duration-150
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 flex items-center flex-wrap gap-1.5">
            {!hasSelection && (
              <span className="text-gray-500">{placeholder}</span>
            )}

            {/* Multi-select chips */}
            {multi && hasSelection && (
              <>
                {selectedLabels.map((label, index) => {
                  const option = options.find(opt => opt.label === label)
                  return (
                    <span
                      key={selectedValues[index]}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-md"
                    >
                      {option?.icon && <span className="w-4 h-4">{option.icon}</span>}
                      {label}
                      <button
                        type="button"
                        onClick={(e) => handleRemoveChip(selectedValues[index], e)}
                        className="hover:bg-blue-200 rounded p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )
                })}
              </>
            )}

            {/* Single select display */}
            {!multi && hasSelection && (
              <span className="flex items-center gap-2">
                {options.find(opt => opt.value === selectedValues[0])?.icon && (
                  <span className="w-4 h-4">
                    {options.find(opt => opt.value === selectedValues[0])?.icon}
                  </span>
                )}
                {selectedLabels[0]}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Clear button */}
            {hasSelection && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}

            {/* Dropdown arrow */}
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Caută..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-[300px] overflow-y-auto py-1">
            {Object.keys(groupedOptions).length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                Nu s-au găsit rezultate
              </div>
            ) : (
              Object.entries(groupedOptions).map(([group, groupOptions]) => (
                <div key={group}>
                  {/* Group Header */}
                  {hasGroups && group && (
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {group}
                    </div>
                  )}

                  {/* Group Options */}
                  {groupOptions.map((option) => {
                    const isSelected = selectedValues.includes(option.value)
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        className={`
                          w-full px-4 py-2 text-left flex items-center gap-3
                          hover:bg-gray-50 transition-colors
                          ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                        `}
                      >
                        {/* Checkbox for multi-select or checkmark for single */}
                        {multi && (
                          <div
                            className={`
                              w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0
                              ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}
                            `}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        )}

                        {/* Option Icon */}
                        {option.icon && (
                          <span className="w-5 h-5 flex-shrink-0">{option.icon}</span>
                        )}

                        {/* Option Label */}
                        <span className="flex-1 text-sm">{option.label}</span>

                        {/* Selected indicator for single select */}
                        {!multi && isSelected && (
                          <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
