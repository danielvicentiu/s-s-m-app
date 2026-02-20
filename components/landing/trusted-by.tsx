'use client'

import { useTranslations } from 'next-intl'

const companyNames = [
  'MedLife',
  'AutoTehnic Pro',
  'Construct Group SRL',
  'Alimentara Plus',
  'TransLog România',
  'Eco Steel Industries',
]

export function TrustedBy() {
  const t = useTranslations('trustedBy')

  return (
    <section className="border-y border-border bg-muted/50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {t('title')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {companyNames.map((name) => (
            <div
              key={name}
              className="text-lg font-bold tracking-tight text-muted-foreground/50"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
