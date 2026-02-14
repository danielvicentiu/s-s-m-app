'use client'

import React from 'react'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md'
}: ToggleSwitchProps) {
  const sizeClasses = {
    sm: {
      switch: 'w-9 h-5',
      toggle: 'w-4 h-4',
      translate: checked ? 'translate-x-4' : 'translate-x-0.5',
      label: 'text-sm',
      description: 'text-xs'
    },
    md: {
      switch: 'w-11 h-6',
      toggle: 'w-5 h-5',
      translate: checked ? 'translate-x-5' : 'translate-x-0.5',
      label: 'text-base',
      description: 'text-sm'
    }
  }

  const currentSize = sizeClasses[size]

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault()
      onChange(!checked)
    }
  }

  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`
          relative inline-flex shrink-0 rounded-full transition-colors duration-200 ease-in-out
          ${currentSize.switch}
          ${checked ? 'bg-green-600' : 'bg-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        `}
      >
        <span
          className={`
            inline-block rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out
            ${currentSize.toggle}
            ${currentSize.translate}
          `}
        />
      </button>

      <div className="flex flex-col">
        <label
          className={`
            font-medium text-gray-900
            ${currentSize.label}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onClick={handleClick}
        >
          {label}
        </label>
        {description && (
          <p
            className={`
              text-gray-500 mt-0.5
              ${currentSize.description}
              ${disabled ? 'opacity-50' : ''}
            `}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
