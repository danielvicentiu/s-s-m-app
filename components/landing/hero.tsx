'use client'

import {
  Shield,
  Users,
  FileCheck,
  TrendingUp,
  ArrowRight,
  Play,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

type TranslationFn = (key: string) => string

function DashboardMockup({ t }: { t: TranslationFn }) {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      {/* Main dashboard card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-card-foreground">
            {t('dashboardTitle')}
          </h3>
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
            {t('dashboardCompliant')}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted p-3">
            <div className="mb-1 text-xs text-muted-foreground">{t('dashboardEmployees')}</div>
            <div className="text-xl font-bold text-card-foreground">247</div>
          </div>
          <div className="rounded-xl bg-muted p-3">
            <div className="mb-1 text-xs text-muted-foreground">{t('dashboardTrainings')}</div>
            <div className="text-xl font-bold text-card-foreground">98%</div>
          </div>
          <div className="rounded-xl bg-muted p-3">
            <div className="mb-1 text-xs text-muted-foreground">{t('dashboardDocuments')}</div>
            <div className="text-xl font-bold text-card-foreground">1.240</div>
          </div>
          <div className="rounded-xl bg-muted p-3">
            <div className="mb-1 text-xs text-muted-foreground">{t('dashboardRisks')}</div>
            <div className="text-xl font-bold text-card-foreground">3</div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{t('dashboardCompliance')}</span>
            <span className="font-semibold text-primary">94%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div className="h-2 rounded-full bg-primary" style={{ width: '94%' }} />
          </div>
        </div>
      </div>

      {/* Floating card - top right */}
      <div className="absolute -right-4 -top-4 rounded-xl border border-border bg-card px-4 py-3 shadow-lg md:-right-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-xs font-semibold text-card-foreground">{t('dashboardSSM')}</div>
            <div className="text-xs text-muted-foreground">{t('dashboardModules')}</div>
          </div>
        </div>
      </div>

      {/* Floating card - bottom left */}
      <div className="absolute -bottom-4 -left-4 rounded-xl border border-border bg-card px-4 py-3 shadow-lg md:-left-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <div className="text-xs font-semibold text-card-foreground">{t('dashboardScore')}</div>
            <div className="text-xs text-green-600 font-medium">{t('dashboardScoreChange')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  const t = useTranslations('hero')

  return (
    <section className="relative overflow-hidden bg-background px-6 pb-20 pt-16 lg:pb-28 lg:pt-24">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(37,99,235,0.08),transparent)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left: Copy */}
        <div>
          <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {t('title1')}{' '}
            <span className="text-primary">{t('titleHighlight')}</span>{' '}
            {t('title2')}
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {t('subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t('cta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#functionalitati"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Play className="h-4 w-4" />
              {t('ctaSecondary')}
            </a>
          </div>
          {/* Mini trust indicators */}
          <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {t('trustCompanies')}
            </span>
            <span className="flex items-center gap-1.5">
              <FileCheck className="h-4 w-4" />
              {t('trustNoCard')}
            </span>
          </div>
        </div>

        {/* Right: Dashboard mockup */}
        <div className="flex justify-center lg:justify-end">
          <DashboardMockup t={t} />
        </div>
      </div>
    </section>
  )
}
