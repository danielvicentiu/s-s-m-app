'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { PricingToggle } from './pricing-toggle'
import { PlanCard } from './plan-card'
import type { PlanData } from './plan-card'

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true)
  const t = useTranslations('pricing')

  const plans: PlanData[] = [
    {
      name: t('starter.name'),
      monthlyPrice: 146,
      annualPrice: 1750,
      audience: t('starter.audience'),
      features: t.raw('starter.features') as string[],
      cta: t('starter.cta'),
      ctaHref: '/onboarding',
    },
    {
      name: t('professional.name'),
      monthlyPrice: 292,
      annualPrice: 3500,
      audience: t('professional.audience'),
      highlighted: true,
      badge: t('professional.badge'),
      features: t.raw('professional.features') as string[],
      cta: t('professional.cta'),
      ctaHref: '/onboarding',
    },
    {
      name: t('enterprise.name'),
      monthlyPrice: 500,
      annualPrice: 6000,
      audience: t('enterprise.audience'),
      features: t.raw('enterprise.features') as string[],
      cta: t('enterprise.cta'),
      ctaHref: 'mailto:contact@s-s-m.ro?subject=Solicitare plan Enterprise',
    },
  ]

  return (
    <section id="preturi" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            {t('title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        <div className="mb-10">
          <PricingToggle isAnnual={isAnnual} onToggle={setIsAnnual} />
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} isAnnual={isAnnual} />
          ))}
        </div>
      </div>
    </section>
  )
}
