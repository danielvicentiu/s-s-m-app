'use client'

import { useMemo } from 'react'

interface ComplianceMeterProps {
  percentage: number
  label: string
  size?: 'sm' | 'md' | 'lg'
}

export default function ComplianceMeter({
  percentage,
  label,
  size = 'md'
}: ComplianceMeterProps) {
  // Normalize percentage to 0-100 range
  const normalizedPercentage = Math.min(100, Math.max(0, percentage))

  // Calculate color based on percentage
  const color = useMemo(() => {
    if (normalizedPercentage < 50) {
      return {
        stroke: '#DC2626', // red-600
        text: 'text-red-600',
        bg: 'bg-red-50'
      }
    } else if (normalizedPercentage < 80) {
      return {
        stroke: '#F59E0B', // amber-500
        text: 'text-amber-600',
        bg: 'bg-amber-50'
      }
    } else {
      return {
        stroke: '#16A34A', // green-600
        text: 'text-green-600',
        bg: 'bg-green-50'
      }
    }
  }, [normalizedPercentage])

  // Size configurations
  const sizeConfig = useMemo(() => {
    switch (size) {
      case 'sm':
        return {
          width: 80,
          height: 80,
          strokeWidth: 6,
          fontSize: 'text-lg',
          labelSize: 'text-xs'
        }
      case 'lg':
        return {
          width: 160,
          height: 160,
          strokeWidth: 10,
          fontSize: 'text-4xl',
          labelSize: 'text-base'
        }
      case 'md':
      default:
        return {
          width: 120,
          height: 120,
          strokeWidth: 8,
          fontSize: 'text-2xl',
          labelSize: 'text-sm'
        }
    }
  }, [size])

  // SVG circle calculations
  const radius = (sizeConfig.width - sizeConfig.strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (normalizedPercentage / 100) * circumference
  const center = sizeConfig.width / 2

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${color.bg} rounded-full p-4`}>
        <svg
          width={sizeConfig.width}
          height={sizeConfig.height}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={sizeConfig.strokeWidth}
            fill="none"
          />

          {/* Progress circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={color.stroke}
            strokeWidth={sizeConfig.strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              animation: 'complianceMeterFill 1s ease-out'
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${color.text} ${sizeConfig.fontSize}`}>
            {Math.round(normalizedPercentage)}%
          </span>
        </div>
      </div>

      {/* Label */}
      <p className={`text-gray-700 font-medium text-center ${sizeConfig.labelSize}`}>
        {label}
      </p>

      <style jsx>{`
        @keyframes complianceMeterFill {
          from {
            stroke-dashoffset: ${circumference};
          }
          to {
            stroke-dashoffset: ${strokeDashoffset};
          }
        }
      `}</style>
    </div>
  )
}
