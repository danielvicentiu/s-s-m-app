// components/psi/AlertBadge.tsx
// M2_PSI: Colored badge showing alert level for PSI equipment expiry

import { PSIAlertLevel, PSI_ALERT_LEVEL_LABELS } from '@/lib/types'

interface AlertBadgeProps {
  alertLevel: PSIAlertLevel
  daysUntilDue?: number
  showDays?: boolean
}

const ALERT_CONFIG = {
  expired: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    dot: 'bg-red-500',
    label: PSI_ALERT_LEVEL_LABELS.expired
  },
  critical: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    label: PSI_ALERT_LEVEL_LABELS.critical
  },
  warning: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    dot: 'bg-yellow-500',
    label: PSI_ALERT_LEVEL_LABELS.warning
  },
  info: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    label: PSI_ALERT_LEVEL_LABELS.info
  },
  ok: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'bg-green-500',
    label: PSI_ALERT_LEVEL_LABELS.ok
  }
}

export default function AlertBadge({ alertLevel, daysUntilDue, showDays = false }: AlertBadgeProps) {
  const config = ALERT_CONFIG[alertLevel] || ALERT_CONFIG.ok

  const displayLabel = showDays && daysUntilDue !== undefined
    ? `${config.label} (${Math.abs(daysUntilDue)} ${daysUntilDue < 0 ? 'zile depășit' : 'zile'})`
    : config.label

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {displayLabel}
    </span>
  )
}
