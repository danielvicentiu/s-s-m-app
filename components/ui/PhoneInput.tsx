'use client'

import { useState, useRef, useEffect } from 'react'

interface Country {
  code: string
  dialCode: string
  flag: string
  format: string
}

const COUNTRIES: Country[] = [
  { code: 'RO', dialCode: '+40', flag: '🇷🇴', format: '### ### ###' },
  { code: 'BG', dialCode: '+359', flag: '🇧🇬', format: '### ### ###' },
  { code: 'HU', dialCode: '+36', flag: '🇭🇺', format: '## ### ####' },
  { code: 'DE', dialCode: '+49', flag: '🇩🇪', format: '### ### ####' },
  { code: 'PL', dialCode: '+48', flag: '🇵🇱', format: '### ### ###' },
]

interface PhoneInputProps {
  value?: string
  onChange?: (value: string) => void
  onValidationChange?: (isValid: boolean) => void
  defaultCountry?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  error?: string
}

export function PhoneInput({
  value = '',
  onChange,
  onValidationChange,
  defaultCountry = 'RO',
  placeholder = 'Introdu număr telefon',
  required = false,
  disabled = false,
  className = '',
  error,
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRIES.find((c) => c.code === defaultCountry) || COUNTRIES[0]
  )
  const [phoneNumber, setPhoneNumber] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Parse initial value
  useEffect(() => {
    if (value) {
      const country = COUNTRIES.find((c) => value.startsWith(c.dialCode))
      if (country) {
        setSelectedCountry(country)
        setPhoneNumber(value.substring(country.dialCode.length).trim())
      }
    }
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const formatPhoneNumber = (input: string, format: string): string => {
    const digits = input.replace(/\D/g, '')
    let formatted = ''
    let digitIndex = 0

    for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
      if (format[i] === '#') {
        formatted += digits[digitIndex]
        digitIndex++
      } else {
        formatted += format[i]
      }
    }

    return formatted
  }

  const validatePhoneNumber = (phone: string, country: Country): boolean => {
    const digits = phone.replace(/\D/g, '')
    const expectedLength = country.format.replace(/\D/g, '').length

    return digits.length === expectedLength
  }

  const handlePhoneChange = (input: string) => {
    const digits = input.replace(/\D/g, '')
    const maxDigits = selectedCountry.format.replace(/\D/g, '').length

    if (digits.length <= maxDigits) {
      const formatted = formatPhoneNumber(digits, selectedCountry.format)
      setPhoneNumber(formatted)

      const fullValue = `${selectedCountry.dialCode} ${formatted}`.trim()
      onChange?.(fullValue)

      const isValid = validatePhoneNumber(formatted, selectedCountry)
      onValidationChange?.(isValid)
    }
  }

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    setIsOpen(false)

    // Reformat existing number with new country format
    const digits = phoneNumber.replace(/\D/g, '')
    const formatted = formatPhoneNumber(digits, country.format)
    setPhoneNumber(formatted)

    const fullValue = `${country.dialCode} ${formatted}`.trim()
    onChange?.(fullValue)

    const isValid = validatePhoneNumber(formatted, country)
    onValidationChange?.(isValid)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && phoneNumber.length === 0) {
      e.preventDefault()
    }
  }

  const isValid = phoneNumber ? validatePhoneNumber(phoneNumber, selectedCountry) : !required

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex items-center gap-2 rounded-lg border bg-white transition-colors ${
          error
            ? 'border-red-300 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100'
            : isValid
            ? 'border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'
            : 'border-orange-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
      >
        {/* Country Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors ${
              disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'
            }`}
          >
            <span className="text-xl leading-none">{selectedCountry.flag}</span>
            <span className="text-gray-700">{selectedCountry.dialCode}</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              {COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-gray-50 ${
                    selectedCountry.code === country.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span className="text-xl leading-none">{country.flag}</span>
                  <span className="font-medium">{country.code}</span>
                  <span className="text-gray-500">{country.dialCode}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200" />

        {/* Phone Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="flex-1 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-transparent border-0 outline-none disabled:cursor-not-allowed"
        />

        {/* Validation Icon */}
        {phoneNumber && (
          <div className="pr-3">
            {isValid ? (
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}

      {/* Format Hint */}
      {!error && phoneNumber && !isValid && (
        <p className="mt-1.5 text-xs text-gray-500">
          Format așteptat: {selectedCountry.dialCode} {selectedCountry.format}
        </p>
      )}
    </div>
  )
}
