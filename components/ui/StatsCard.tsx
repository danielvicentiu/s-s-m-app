// components/ui/StatsCard.tsx
// Reusable stats card component used in dashboard counters
// Supports different color variants (green, red, yellow, blue)

'use client'

import { ArrowUp, ArrowDown, Minus } from 'lucide-react'

export type StatsCardVariant = 'green' | 'red' | 'yellow' | 'blue'
export type TrendDirection = 'up' | 'down' | 'neutral'

interface StatsCardProps {
  value: number | string
  label: string
  variant?: StatsCardVariant
  trend?: TrendDirection
  className?: string
}

const variantStyles: Record<StatsCardVariant, { bg: string; text: string; label: string }> = {
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    label: 'text-green-600'
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    label: 'text-red-500'
  },
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    label: 'text-yellow-600'
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    label: 'text-blue-600'
  }
}

const trendIcons = {
  up: ArrowUp,
  down: ArrowDown,
  neutral: Minus
}

export default function StatsCard({
  value,
  label,
  variant = 'blue',
  trend,
  className = ''
}: StatsCardProps) {
  const styles = variantStyles[variant]
  const TrendIcon = trend ? trendIcons[trend] : null

  return (
    <div className={`${styles.bg} rounded-xl py-6 text-center ${className}`}>
      <div className="flex items-center justify-center gap-2">
        <div className={`text-5xl font-black ${styles.text}`}>
          {value}
        </div>
        {TrendIcon && (
          <TrendIcon className={`h-6 w-6 ${styles.text}`} />
        )}
      </div>
      <div className={`text-[11px] font-bold ${styles.label} uppercase tracking-widest mt-1`}>
        {label}
      </div>
    </div>
  )
}
