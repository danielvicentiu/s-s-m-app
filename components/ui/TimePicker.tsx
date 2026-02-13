'use client'

import { useState, useEffect } from 'react'

interface TimePickerProps {
  value?: string // Format: "HH:MM"
  onChange: (time: string) => void
  label?: string
  disabled?: boolean
  minTime?: string // Format: "HH:MM"
  maxTime?: string // Format: "HH:MM"
  error?: string
}

export function TimePicker({
  value = '',
  onChange,
  label,
  disabled = false,
  minTime,
  maxTime,
  error,
}: TimePickerProps) {
  const [hours, setHours] = useState<string>('00')
  const [minutes, setMinutes] = useState<string>('00')

  // Parse value into hours and minutes
  useEffect(() => {
    if (value && value.includes(':')) {
      const [h, m] = value.split(':')
      setHours(h.padStart(2, '0'))
      setMinutes(m.padStart(2, '0'))
    }
  }, [value])

  // Generate hours array (00-23)
  const hoursOptions = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0')
  )

  // Generate minutes array (00-59)
  const minutesOptions = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0')
  )

  // Check if a time is within the allowed range
  const isTimeValid = (h: string, m: string): boolean => {
    const currentTime = `${h}:${m}`

    if (minTime && currentTime < minTime) return false
    if (maxTime && currentTime > maxTime) return false

    return true
  }

  // Handle hour change
  const handleHourChange = (newHour: string) => {
    setHours(newHour)
    const newTime = `${newHour}:${minutes}`

    if (isTimeValid(newHour, minutes)) {
      onChange(newTime)
    }
  }

  // Handle minute change
  const handleMinuteChange = (newMinute: string) => {
    setMinutes(newMinute)
    const newTime = `${hours}:${newMinute}`

    if (isTimeValid(hours, newMinute)) {
      onChange(newTime)
    }
  }

  // Check if an option should be disabled
  const isHourDisabled = (h: string): boolean => {
    if (minTime) {
      const [minH] = minTime.split(':')
      if (h < minH) return true
    }
    if (maxTime) {
      const [maxH] = maxTime.split(':')
      if (h > maxH) return true
    }
    return false
  }

  const isMinuteDisabled = (m: string): boolean => {
    if (minTime) {
      const [minH, minM] = minTime.split(':')
      if (hours === minH && m < minM) return true
    }
    if (maxTime) {
      const [maxH, maxM] = maxTime.split(':')
      if (hours === maxH && m > maxM) return true
    }
    return false
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="flex items-center gap-2">
        {/* Hours dropdown */}
        <select
          value={hours}
          onChange={(e) => handleHourChange(e.target.value)}
          disabled={disabled}
          className={`
            flex-1 px-3 py-2 rounded-lg border
            bg-white text-gray-900
            focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
        >
          {hoursOptions.map((hour) => (
            <option
              key={hour}
              value={hour}
              disabled={isHourDisabled(hour)}
            >
              {hour}
            </option>
          ))}
        </select>

        <span className="text-gray-500 text-lg font-medium">:</span>

        {/* Minutes dropdown */}
        <select
          value={minutes}
          onChange={(e) => handleMinuteChange(e.target.value)}
          disabled={disabled}
          className={`
            flex-1 px-3 py-2 rounded-lg border
            bg-white text-gray-900
            focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
        >
          {minutesOptions.map((minute) => (
            <option
              key={minute}
              value={minute}
              disabled={isMinuteDisabled(minute)}
            >
              {minute}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
