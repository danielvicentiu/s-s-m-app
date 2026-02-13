'use client'

import { Check, AlertTriangle, X, Clock, Minus } from 'lucide-react'

interface StatusBadgeProps {
  status: 'valid' | 'expiring' | 'expired' | 'pending' | 'na'
  size?: 'sm' | 'md'
  showIcon?: boolean
  label?: string
}

const CONFIG = {
  valid: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
    icon: Check,
    default: 'Valid',
  },
  expiring: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    icon: AlertTriangle,
    default: 'Expiră curând',
  },
  expired: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: X,
    default: 'Expirat',
  },
  pending: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: Clock,
    default: 'În așteptare',
  },
  na: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200',
    icon: Minus,
    default: 'N/A',
  },
}

const SIZE_CONFIG = {
  sm: {
    padding: 'px-2 py-0.5',
    text: 'text-xs',
    iconSize: 12,
    gap: 'gap-1',
  },
  md: {
    padding: 'px-2.5 py-1',
    text: 'text-sm',
    iconSize: 14,
    gap: 'gap-1.5',
  },
}

function StatusBadge({
  status,
  size = 'md',
  showIcon = true,
  label,
}: StatusBadgeProps) {
  const config = CONFIG[status] || CONFIG.na
  const sizeConfig = SIZE_CONFIG[size]
  const Icon = config.icon

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium border
        ${config.bg} ${config.text} ${config.border}
        ${sizeConfig.padding} ${sizeConfig.text} ${sizeConfig.gap}
      `}
    >
      {showIcon && <Icon size={sizeConfig.iconSize} strokeWidth={2.5} />}
      {label || config.default}
    </span>
  )
}

// Named export for existing imports
export { StatusBadge }

// Default export as requested
export default StatusBadge
