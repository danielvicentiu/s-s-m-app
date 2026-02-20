'use client'

import {
  Shield,
  Flame,
  Lock,
  Network,
  HeartPulse,
  Cog,
  AlertTriangle,
  CalendarDays,
  FileText,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Features() {
  const t = useTranslations('features')

  const features = [
    {
      id: 'ssm',
      icon: Shield,
      title: t('ssm'),
      description: t('ssmDesc'),
    },
    {
      id: 'psi',
      icon: Flame,
      title: t('psi'),
      description: t('psiDesc'),
    },
    {
      id: 'gdpr',
      icon: Lock,
      title: t('gdpr'),
      description: t('gdprDesc'),
    },
    {
      id: 'nis2',
      icon: Network,
      title: t('nis2'),
      description: t('nis2Desc'),
    },
    {
      id: 'medical',
      icon: HeartPulse,
      title: t('medical'),
      description: t('medicalDesc'),
    },
    {
      id: 'iscir',
      icon: Cog,
      title: t('iscir'),
      description: t('iscirDesc'),
    },
    {
      id: 'nearMiss',
      icon: AlertTriangle,
      title: t('nearMiss'),
      description: t('nearMissDesc'),
    },
    {
      id: 'training',
      icon: CalendarDays,
      title: t('training'),
      description: t('trainingDesc'),
    },
    {
      id: 'reports',
      icon: FileText,
      title: t('reports'),
      description: t('reportsDesc'),
    },
  ]

  return (
    <section id="functionalitati" className="bg-background px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
