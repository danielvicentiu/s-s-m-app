'use client'

import { useState, useEffect, useCallback } from 'react'

export type NumberInputFormat = 'number' | 'currency' | 'percent'

interface NumberInputProps {
  label?: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  format?: NumberInputFormat
  currency?: string
  disabled?: boolean
  error?: string
  placeholder?: string
  required?: boolean
  className?: string
}

export function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  format = 'number',
  currency = 'RON',
  disabled = false,
  error,
  placeholder,
  required = false,
  className = '',
}: NumberInputProps) {
  const [inputValue, setInputValue] = useState<string>(formatValue(value, format, currency))
  const [isFocused, setIsFocused] = useState(false)

  // Update input value when prop value changes externally
  useEffect(() => {
    if (!isFocused) {
      setInputValue(formatValue(value, format, currency))
    }
  }, [value, format, currency, isFocused])

  function formatValue(val: number, fmt: NumberInputFormat, curr: string): string {
    if (isNaN(val)) return ''

    switch (fmt) {
      case 'currency':
        return new Intl.NumberFormat('ro-RO', {
          style: 'currency',
          currency: curr,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(val)

      case 'percent':
        return `${val.toFixed(2)}%`

      case 'number':
      default:
        return val.toString()
    }
  }

  function parseValue(str: string): number {
    // Remove currency symbols, spaces, and other formatting
    const cleaned = str.replace(/[^\d.,-]/g, '').replace(',', '.')
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
  }

  const clampValue = useCallback((val: number): number => {
    return Math.min(Math.max(val, min), max)
  }, [min, max])

  const handleIncrement = () => {
    if (disabled) return
    const newValue = clampValue(value + step)
    onChange(newValue)
  }

  const handleDecrement = () => {
    if (disabled) return
    const newValue = clampValue(value - step)
    onChange(newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    setInputValue(rawValue)
  }

  const handleBlur = () => {
    setIsFocused(false)
    const parsed = parseValue(inputValue)
    const clamped = clampValue(parsed)
    onChange(clamped)
    setInputValue(formatValue(clamped, format, currency))
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    // Show raw number when focused for easier editing
    setInputValue(value.toString())
    e.target.select()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        handleIncrement()
        break
      case 'ArrowDown':
        e.preventDefault()
        handleDecrement()
        break
      case 'Enter':
        e.currentTarget.blur()
        break
    }
  }

  const canDecrement = !disabled && value > min
  const canIncrement = !disabled && value < max

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div className="flex items-center gap-0.5">
          {/* Decrement Button */}
          <button
            type="button"
            onClick={handleDecrement}
            disabled={!canDecrement}
            className={`
              flex items-center justify-center w-10 h-10 rounded-l-lg border border-r-0
              transition-colors
              ${canDecrement
                ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              }
              ${error ? 'border-red-300' : ''}
            `}
            aria-label="Scade valoarea"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          {/* Input Field */}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className={`
              flex-1 h-10 px-3 text-center border-y border-gray-300
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
              ${error ? 'border-red-300 focus:ring-red-500' : ''}
            `}
            aria-label={label}
            aria-invalid={!!error}
            aria-describedby={error ? `${label}-error` : undefined}
          />

          {/* Increment Button */}
          <button
            type="button"
            onClick={handleIncrement}
            disabled={!canIncrement}
            className={`
              flex items-center justify-center w-10 h-10 rounded-r-lg border border-l-0
              transition-colors
              ${canIncrement
                ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              }
              ${error ? 'border-red-300' : ''}
            `}
            aria-label="Crește valoarea"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p id={`${label}-error`} className="mt-1.5 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Helper Text for Min/Max */}
        {!error && (min !== 0 || max !== Infinity) && (
          <p className="mt-1 text-xs text-gray-500">
            {min !== 0 && max !== Infinity && `Interval: ${min} - ${max}`}
            {min !== 0 && max === Infinity && `Minim: ${min}`}
            {min === 0 && max !== Infinity && `Maxim: ${max}`}
          </p>
        )}
      </div>
    </div>
  )
}
