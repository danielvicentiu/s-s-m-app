// components/ui/InlineEdit.tsx
// Inline Edit — Click pe text transformă în input, Enter save, Escape cancel
// Editare inline cu hint icon pe hover

'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Pencil, Check, X } from 'lucide-react'

interface InlineEditProps {
  value: string | number
  onSave: (newValue: string | number) => void | Promise<void>
  type?: 'text' | 'number' | 'select'
  options?: { value: string; label: string }[]
  placeholder?: string
  className?: string
  inputClassName?: string
}

export function InlineEdit({
  value,
  onSave,
  type = 'text',
  options = [],
  placeholder = 'Click pentru editare',
  className = '',
  inputClassName = '',
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(String(value))
  const [isHovered, setIsHovered] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null)

  // Focus input când intră în modul editare
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select()
      }
    }
  }, [isEditing])

  const handleStartEdit = () => {
    setEditValue(String(value))
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditValue(String(value))
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (editValue === String(value)) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      const finalValue = type === 'number' ? Number(editValue) : editValue
      await onSave(finalValue)
      setIsEditing(false)
    } catch (error) {
      console.error('Eroare salvare inline edit:', error)
      // Resetează la valoarea originală dacă salvarea eșuează
      setEditValue(String(value))
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  // Mod vizualizare — afișează valoarea cu icon edit pe hover
  if (!isEditing) {
    const displayValue = type === 'select' && options.length > 0
      ? options.find(opt => opt.value === String(value))?.label || value
      : value || placeholder

    return (
      <div
        className={`group relative inline-flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-50 transition ${className}`}
        onClick={handleStartEdit}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className={`${!value ? 'text-gray-400 italic' : 'text-gray-900'}`}>
          {displayValue}
        </span>
        <Pencil
          className={`h-3.5 w-3.5 text-gray-400 transition ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
    )
  }

  // Mod editare — input/select cu butoane save/cancel
  return (
    <div className="inline-flex items-center gap-2">
      {type === 'select' ? (
        <select
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          className={`rounded-lg border border-blue-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${inputClassName}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          className={`rounded-lg border border-blue-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${inputClassName}`}
          placeholder={placeholder}
        />
      )}

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="rounded-lg p-2 hover:bg-green-100 text-green-600 transition disabled:opacity-50"
        title="Salvează (Enter)"
      >
        <Check className="h-4 w-4" />
      </button>

      <button
        onClick={handleCancel}
        disabled={isSaving}
        className="rounded-lg p-2 hover:bg-red-100 text-red-600 transition disabled:opacity-50"
        title="Anulează (Escape)"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
