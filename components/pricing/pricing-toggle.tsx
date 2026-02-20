'use client'

import { useTranslations } from 'next-intl'

interface PricingToggleProps {
  isAnnual: boolean
  onToggle: (annual: boolean) => void
}

export function PricingToggle({ isAnnual, onToggle }: PricingToggleProps) {
  const t = useTranslations('pricing')

  return (
    <div className="flex items-center justify-center gap-3">
      <span
        className={`text-sm font-medium transition-colors ${
          !isAnnual ? 'text-foreground' : 'text-muted-foreground'
        }`}
      >
        {t('monthly')}
      </span>
      <button
        onClick={() => onToggle(!isAnnual)}
        className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full bg-muted transition-colors"
        role="switch"
        aria-checked={isAnnual}
        aria-label={t('switchLabel')}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-primary shadow-sm transition-transform ${
            isAnnual ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span
        className={`text-sm font-medium transition-colors ${
          isAnnual ? 'text-foreground' : 'text-muted-foreground'
        }`}
      >
        {t('annual')}{' '}
        <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          {t('save20')}
        </span>
      </span>
    </div>
  )
}
