// components/dashboard-v0/subscription-status.tsx
// Widget status abonament — afișat în sidebar/topbar

'use client'

import { useSubscription } from '@/hooks/useSubscription'

const STATUS_CONFIG = {
  trial: {
    label: 'Trial activ',
    className: 'text-blue-700 bg-blue-50 border-blue-200',
    dot: 'bg-blue-500',
  },
  active: {
    label: 'Abonament activ',
    className: 'text-green-700 bg-green-50 border-green-200',
    dot: 'bg-green-500',
  },
  past_due: {
    label: 'Plată restantă',
    className: 'text-orange-700 bg-orange-50 border-orange-200',
    dot: 'bg-orange-500',
  },
  canceled: {
    label: 'Anulat',
    className: 'text-red-700 bg-red-50 border-red-200',
    dot: 'bg-red-500',
  },
  expired: {
    label: 'Expirat',
    className: 'text-gray-600 bg-gray-50 border-gray-200',
    dot: 'bg-gray-400',
  },
}

interface SubscriptionStatusProps {
  organizationId: string
  showUpgradeLink?: boolean
}

export function SubscriptionStatus({
  organizationId,
  showUpgradeLink = false,
}: SubscriptionStatusProps) {
  const { status, loading } = useSubscription(organizationId)

  if (loading) {
    return <div className="animate-pulse h-6 w-32 bg-gray-200 rounded-full" />
  }

  if (!status) return null

  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.expired
  const needsAttention = status === 'past_due' || status === 'canceled' || status === 'expired'

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </div>

      {needsAttention && showUpgradeLink && (
        <a
          href="/ro/pricing"
          className="text-xs text-blue-600 hover:underline font-medium"
        >
          Reactivează
        </a>
      )}
    </div>
  )
}
