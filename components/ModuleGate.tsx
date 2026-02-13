// components/ModuleGate.tsx
// OP-LEGO — Conditional rendering bazat pe modulele active ale organizației
// Includes: TrialBanner (zilele rămase), UpgradeCTA (modul indisponibil)
// Data: 11 Februarie 2026

'use client'

import { type ReactNode } from 'react'
import { useOrgModules } from '@/hooks/useOrgModules'
import { MODULE_ICONS, CATEGORY_COLORS } from '@/lib/modules/constants'
import type { ModuleKey } from '@/lib/modules/types'

// ── Props ──
interface ModuleGateProps {
  orgId: string | null
  moduleKey: ModuleKey
  children: ReactNode
  // Opțional: ce să afișeze dacă modulul nu e activ
  fallback?: ReactNode
  // Opțional: ascunde complet (fără UpgradeCTA)
  hideIfNoAccess?: boolean
  // Opțional: locale pentru traduceri
  locale?: string
}

// ── Componenta principală ──
export default function ModuleGate({
  orgId,
  moduleKey,
  children,
  fallback,
  hideIfNoAccess = false,
  locale = 'en',
}: ModuleGateProps) {
  const { hasModule, getModuleAccess, isLoading } = useOrgModules(orgId, locale)

  // Loading state
  if (isLoading) {
    return (
      <div className="animate-pulse rounded-lg bg-gray-100 p-4">
        <div className="h-4 w-32 rounded bg-gray-200" />
      </div>
    )
  }

  const access = getModuleAccess(moduleKey)

  // Modul activ — afișează conținutul
  if (access.has_access) {
    return (
      <>
        {access.is_trial && access.trial_days_remaining !== null && (
          <TrialBanner
            moduleKey={moduleKey}
            daysRemaining={access.trial_days_remaining}
            locale={locale}
          />
        )}
        {children}
      </>
    )
  }

  // Modul inactiv — fallback custom sau UpgradeCTA
  if (hideIfNoAccess) {return null}

  if (fallback) {return <>{fallback}</>}

  return <UpgradeCTA moduleKey={moduleKey} locale={locale} />
}

// ── Trial Banner ──
interface TrialBannerProps {
  moduleKey: ModuleKey
  daysRemaining: number
  locale: string
}

function TrialBanner({ moduleKey, daysRemaining, locale }: TrialBannerProps) {
  const urgency = daysRemaining <= 3 ? 'critical' : daysRemaining <= 7 ? 'warning' : 'info'

  const colors = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    critical: 'bg-red-50 border-red-200 text-red-800',
  }

  const messages: Record<string, Record<string, string>> = {
    ro: {
      info: `Perioadă de probă: ${daysRemaining} zile rămase`,
      warning: `Atenție: doar ${daysRemaining} zile rămase din perioada de probă`,
      critical: `Urgent: ${daysRemaining} ${daysRemaining === 1 ? 'zi rămasă' : 'zile rămase'} din perioada de probă!`,
    },
    en: {
      info: `Trial period: ${daysRemaining} days remaining`,
      warning: `Warning: only ${daysRemaining} days remaining in trial`,
      critical: `Urgent: ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining in trial!`,
    },
    bg: {
      info: `Пробен период: ${daysRemaining} дни остават`,
      warning: `Внимание: само ${daysRemaining} дни остават`,
      critical: `Спешно: ${daysRemaining} ${daysRemaining === 1 ? 'ден остава' : 'дни остават'}!`,
    },
    hu: {
      info: `Próbaidőszak: ${daysRemaining} nap van hátra`,
      warning: `Figyelem: csak ${daysRemaining} nap van hátra`,
      critical: `Sürgős: ${daysRemaining} nap van hátra!`,
    },
    de: {
      info: `Testphase: ${daysRemaining} Tage verbleibend`,
      warning: `Achtung: nur noch ${daysRemaining} Tage`,
      critical: `Dringend: ${daysRemaining} ${daysRemaining === 1 ? 'Tag' : 'Tage'} verbleibend!`,
    },
    pl: {
      info: `Okres próbny: ${daysRemaining} dni pozostało`,
      warning: `Uwaga: tylko ${daysRemaining} dni pozostało`,
      critical: `Pilne: ${daysRemaining} ${daysRemaining === 1 ? 'dzień' : 'dni'} pozostało!`,
    },
  }

  const msg = messages[locale]?.[urgency] || messages['en'][urgency]

  return (
    <div className={`mb-4 rounded-lg border p-3 text-sm ${colors[urgency]}`}>
      <div className="flex items-center justify-between">
        <span>{msg}</span>
        <button className="ml-4 rounded-md bg-white px-3 py-1 text-xs font-medium shadow-sm hover:bg-gray-50">
          {locale === 'ro' ? 'Upgradează' :
           locale === 'bg' ? 'Надградете' :
           locale === 'hu' ? 'Frissítés' :
           locale === 'de' ? 'Upgrade' :
           locale === 'pl' ? 'Uaktualnij' :
           'Upgrade'}
        </button>
      </div>
    </div>
  )
}

// ── Upgrade CTA (modul indisponibil) ──
interface UpgradeCTAProps {
  moduleKey: ModuleKey
  locale: string
}

function UpgradeCTA({ moduleKey, locale }: UpgradeCTAProps) {
  const icon = MODULE_ICONS[moduleKey] || 'Package'

  const titles: Record<string, string> = {
    ro: 'Modul indisponibil',
    en: 'Module unavailable',
    bg: 'Модулът не е наличен',
    hu: 'Modul nem elérhető',
    de: 'Modul nicht verfügbar',
    pl: 'Moduł niedostępny',
  }

  const descriptions: Record<string, string> = {
    ro: 'Acest modul nu este inclus în abonamentul curent. Activează-l pentru a debloca funcționalitățile.',
    en: 'This module is not included in your current plan. Activate it to unlock its features.',
    bg: 'Този модул не е включен в текущия ви план. Активирайте го, за да отключите функциите.',
    hu: 'Ez a modul nem része az aktuális előfizetésnek. Aktiválja a funkciók feloldásához.',
    de: 'Dieses Modul ist nicht in Ihrem aktuellen Plan enthalten. Aktivieren Sie es, um die Funktionen freizuschalten.',
    pl: 'Ten moduł nie jest uwzględniony w bieżącym planie. Aktywuj go, aby odblokować funkcje.',
  }

  const buttons: Record<string, { trial: string; details: string }> = {
    ro: { trial: 'Încearcă 14 zile gratuit', details: 'Vezi detalii' },
    en: { trial: 'Try 14 days free', details: 'View details' },
    bg: { trial: 'Пробвайте 14 дни безплатно', details: 'Вижте детайли' },
    hu: { trial: 'Próbálja ki 14 napig ingyen', details: 'Részletek' },
    de: { trial: '14 Tage kostenlos testen', details: 'Details ansehen' },
    pl: { trial: 'Wypróbuj 14 dni za darmo', details: 'Zobacz szczegóły' },
  }

  return (
    <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
        <span className="text-xl text-gray-500">🔒</span>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-700">
        {titles[locale] || titles['en']}
      </h3>
      <p className="mb-6 text-sm text-gray-500">
        {descriptions[locale] || descriptions['en']}
      </p>
      <div className="flex items-center justify-center gap-3">
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          {buttons[locale]?.trial || buttons['en'].trial}
        </button>
        <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          {buttons[locale]?.details || buttons['en'].details}
        </button>
      </div>
    </div>
  )
}

// ── Export sub-componente pentru uz individual ──
export { TrialBanner, UpgradeCTA }
