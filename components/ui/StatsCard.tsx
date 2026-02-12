import { type LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'green' | 'red' | 'yellow' | 'blue'
}

const COLOR_CONFIG = {
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-100 text-green-600',
    text: 'text-green-600',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'bg-red-100 text-red-600',
    text: 'text-red-600',
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'bg-yellow-100 text-yellow-600',
    text: 'text-yellow-600',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-100 text-blue-600',
    text: 'text-blue-600',
  },
}

const TREND_CONFIG = {
  up: { icon: TrendingUp, color: 'text-green-600' },
  down: { icon: TrendingDown, color: 'text-red-600' },
  neutral: { icon: Minus, color: 'text-gray-500' },
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'blue',
}: StatsCardProps) {
  const colorConfig = COLOR_CONFIG[color]
  const TrendIcon = trend ? TREND_CONFIG[trend].icon : null

  return (
    <div
      className={`${colorConfig.bg} rounded-2xl p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-2">
              {TrendIcon && (
                <TrendIcon className={`h-4 w-4 ${TREND_CONFIG[trend].color}`} />
              )}
              <span
                className={`text-sm font-medium ${TREND_CONFIG[trend].color}`}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div
          className={`${colorConfig.icon} p-3 rounded-xl flex items-center justify-center`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
