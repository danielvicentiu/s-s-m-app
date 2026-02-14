'use client'

import { useState, useEffect } from 'react'

interface TrainingProgressBarProps {
  completed: number
  total: number
  label: string
  variant?: 'linear' | 'circular'
}

export default function TrainingProgressBar({
  completed,
  total,
  label,
  variant = 'linear'
}: TrainingProgressBarProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)

  const percentage = total > 0 ? Math.min((completed / total) * 100, 100) : 0

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedProgress(percentage)
    }, 100)

    return () => clearTimeout(timeout)
  }, [percentage])

  const getGradientColor = (progress: number) => {
    if (progress === 100) return 'from-green-500 to-emerald-600'
    if (progress >= 75) return 'from-green-400 to-green-600'
    if (progress >= 50) return 'from-yellow-400 to-green-500'
    if (progress >= 25) return 'from-orange-400 to-yellow-500'
    return 'from-red-400 to-orange-500'
  }

  const getStrokeColor = (progress: number) => {
    if (progress === 100) return '#10b981'
    if (progress >= 75) return '#22c55e'
    if (progress >= 50) return '#84cc16'
    if (progress >= 25) return '#eab308'
    return '#f97316'
  }

  if (variant === 'circular') {
    const size = 120
    const strokeWidth = 8
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (animatedProgress / 100) * circumference

    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={getStrokeColor(percentage)}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.3s ease'
              }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {Math.round(percentage)}%
            </span>
            <span className="text-xs text-gray-500">
              {completed}/{total}
            </span>
          </div>

          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                <div className="font-medium">{label}</div>
                <div className="text-gray-300">
                  {completed} din {total} completate
                </div>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                <div className="border-4 border-transparent border-t-gray-900" />
              </div>
            </div>
          )}
        </div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">
          {completed}/{total}
        </span>
      </div>
      <div
        className="relative h-3 bg-gray-200 rounded-full overflow-hidden"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div
          className={`h-full bg-gradient-to-r ${getGradientColor(percentage)} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${animatedProgress}%` }}
        />

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              <div className="font-medium">{Math.round(percentage)}% completat</div>
              <div className="text-gray-300">
                {completed} din {total} finalizate
              </div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
