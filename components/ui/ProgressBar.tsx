'use client'

import React from 'react'

interface ProgressBarProps {
  value: number // 0-100
  label?: string
  showPercent?: boolean
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

const colorClasses = {
  blue: 'bg-blue-600',
  green: 'bg-green-600',
  yellow: 'bg-yellow-500',
  red: 'bg-red-600',
  gray: 'bg-gray-400'
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4'
}

export function ProgressBar({
  value,
  label,
  showPercent = false,
  color = 'blue',
  size = 'md',
  animated = false,
  className = ''
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercent && (
            <span className="text-sm font-semibold text-gray-900">{Math.round(clampedValue)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300 ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}

interface ComplianceScoreProps {
  value: number // 0-100
  label?: string
  threshold?: number // Default 80 - below this shows warning
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

export function ComplianceScore({
  value,
  label = 'Scor Conformitate',
  threshold = 80,
  size = 'md',
  showIcon = true,
  className = ''
}: ComplianceScoreProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const isCompliant = clampedValue >= threshold
  const color = isCompliant ? 'green' : clampedValue >= 50 ? 'yellow' : 'red'

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {showIcon && (
            <div
              className={`flex items-center justify-center w-5 h-5 rounded-full ${
                isCompliant ? 'bg-green-100' : 'bg-yellow-100'
              }`}
            >
              {isCompliant ? (
                <svg
                  className="w-3.5 h-3.5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-3.5 h-3.5 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}
            </div>
          )}
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">{Math.round(clampedValue)}%</span>
      </div>
      <ProgressBar value={clampedValue} color={color} size={size} />
    </div>
  )
}
