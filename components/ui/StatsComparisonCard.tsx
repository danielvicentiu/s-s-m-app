'use client'

import { ArrowDown, ArrowUp, Minus } from 'lucide-react'

interface StatsComparisonCardProps {
  title: string
  currentValue: number
  previousValue: number
  unit?: string
}

export function StatsComparisonCard({
  title,
  currentValue,
  previousValue,
  unit = '',
}: StatsComparisonCardProps) {
  // Calculate percentage change
  const percentageChange =
    previousValue === 0
      ? currentValue > 0
        ? 100
        : 0
      : ((currentValue - previousValue) / previousValue) * 100

  const isPositive = percentageChange > 0
  const isNeutral = percentageChange === 0
  const absoluteChange = Math.abs(percentageChange)

  // Generate sparkline data (simple trend visualization)
  const generateSparkline = () => {
    const points = 8
    const values: number[] = []

    for (let i = 0; i < points; i++) {
      const ratio = i / (points - 1)
      const value = previousValue + (currentValue - previousValue) * ratio
      values.push(value)
    }

    const max = Math.max(...values, 1)
    const min = Math.min(...values, 0)
    const range = max - min || 1

    return values.map((v, i) => {
      const normalizedHeight = ((v - min) / range) * 100
      return (
        <div
          key={i}
          className="flex-1 bg-blue-200 rounded-sm"
          style={{ height: `${Math.max(normalizedHeight, 5)}%` }}
        />
      )
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Title */}
      <h3 className="text-sm font-medium text-gray-500 mb-4">{title}</h3>

      {/* Main Stats */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-3xl font-bold text-gray-900">
            {currentValue.toLocaleString('ro-RO')}
            {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Anterior: {previousValue.toLocaleString('ro-RO')}
            {unit && ` ${unit}`}
          </div>
        </div>

        {/* Trend Badge */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium ${
            isNeutral
              ? 'bg-gray-100 text-gray-600'
              : isPositive
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {isNeutral ? (
            <Minus className="h-4 w-4" />
          ) : isPositive ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
          <span>
            {absoluteChange.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Sparkline */}
      <div className="h-12 flex items-end gap-1">
        {generateSparkline()}
      </div>
    </div>
  )
}
