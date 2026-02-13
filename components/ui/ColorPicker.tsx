'use client'

import { useState, useEffect } from 'react'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  presets?: string[]
}

const DEFAULT_PRESETS = [
  '#3B82F6', // blue-600
  '#10B981', // green-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#06B6D4', // cyan-500
  '#84CC16', // lime-500
  '#F97316', // orange-500
  '#6366F1', // indigo-500
  '#14B8A6', // teal-500
  '#A855F7', // purple-500
]

export function ColorPicker({ value, onChange, presets = DEFAULT_PRESETS }: ColorPickerProps) {
  const [hexInput, setHexInput] = useState(value)
  const [error, setError] = useState('')

  useEffect(() => {
    setHexInput(value)
  }, [value])

  const isValidHex = (color: string): boolean => {
    return /^#[0-9A-Fa-f]{6}$/.test(color)
  }

  const handlePresetClick = (color: string) => {
    setHexInput(color)
    onChange(color)
    setError('')
  }

  const handleHexInputChange = (input: string) => {
    let formatted = input.trim()

    // Add # if missing
    if (formatted && !formatted.startsWith('#')) {
      formatted = '#' + formatted
    }

    setHexInput(formatted)
    setError('')

    // Validate and apply if valid
    if (isValidHex(formatted)) {
      onChange(formatted.toUpperCase())
    } else if (formatted.length > 7) {
      setError('Format invalid. Folosește #RRGGBB')
    }
  }

  const handleHexInputBlur = () => {
    if (!hexInput) {
      setHexInput(value)
      setError('')
      return
    }

    if (!isValidHex(hexInput)) {
      setError('Format invalid. Folosește #RRGGBB')
      setHexInput(value)
    }
  }

  return (
    <div className="space-y-4">
      {/* Color Preview */}
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-xl border-2 border-gray-200 shadow-sm transition-all"
          style={{ backgroundColor: value }}
          aria-label="Previzualizare culoare selectată"
        />
        <div>
          <p className="text-sm font-medium text-gray-900">Culoare selectată</p>
          <p className="text-sm text-gray-500">{value.toUpperCase()}</p>
        </div>
      </div>

      {/* Preset Colors Grid */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Culori predefinite
        </label>
        <div className="grid grid-cols-6 gap-2">
          {presets.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handlePresetClick(color)}
              className={`
                w-full h-10 rounded-lg border-2 transition-all
                hover:scale-110 hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${value.toUpperCase() === color.toUpperCase()
                  ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2 scale-110'
                  : 'border-gray-200'
                }
              `}
              style={{ backgroundColor: color }}
              aria-label={`Selectează culoarea ${color}`}
              title={color.toUpperCase()}
            />
          ))}
        </div>
      </div>

      {/* Manual Hex Input */}
      <div>
        <label htmlFor="hex-input" className="block text-sm font-medium text-gray-700 mb-2">
          Culoare personalizată (HEX)
        </label>
        <input
          id="hex-input"
          type="text"
          value={hexInput}
          onChange={(e) => handleHexInputChange(e.target.value)}
          onBlur={handleHexInputBlur}
          placeholder="#3B82F6"
          maxLength={7}
          className={`
            w-full px-4 py-2 border rounded-lg font-mono text-sm
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${error
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
            }
          `}
          aria-describedby={error ? 'hex-error' : undefined}
        />
        {error && (
          <p id="hex-error" className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Introduceți codul HEX al culorii (ex: #3B82F6)
        </p>
      </div>
    </div>
  )
}
