// components/navigation/ModuleNav.tsx
// OP-LEGO — Meniu dinamic filtrat pe modulele active ale organizației
// Afișează doar secțiunile pentru module activate
// Data: 11 Februarie 2026

'use client'

import { useMemo } from 'react'
import { useOrgModules } from '@/hooks/useOrgModules'
import type { ModuleKey } from '@/lib/modules/types'
import { MODULE_ICONS, CATEGORY_COLORS } from '@/lib/modules/constants'

// ── Structura navigare per modul ──
interface NavItem {
  label: Record<string, string>  // per locale
  href: string
  icon?: string
}

// Definim rutele de navigare per modul
const MODULE_NAV_ITEMS: Record<ModuleKey, NavItem[]> = {
  alerte: [
    { label: { ro: 'Alerte', en: 'Alerts', bg: 'Известия', hu: 'Riasztások', de: 'Warnungen', pl: 'Alerty' }, href: '/dashboard/alerts' },
    { label: { ro: 'Notificări', en: 'Notifications', bg: 'Нотификации', hu: 'Értesítések', de: 'Benachrichtigungen', pl: 'Powiadomienia' }, href: '/dashboard/notifications' },
  ],
  legislatie: [
    { label: { ro: 'Legislație', en: 'Legislation', bg: 'Законодателство', hu: 'Jogszabályok', de: 'Gesetzgebung', pl: 'Legislacja' }, href: '/dashboard/legislation' },
  ],
  ssm: [
    { label: { ro: 'Instruire', en: 'Training', bg: 'Обучение', hu: 'Képzés', de: 'Schulung', pl: 'Szkolenie' }, href: '/dashboard/training' },
    { label: { ro: 'Angajați', en: 'Employees', bg: 'Служители', hu: 'Munkavállalók', de: 'Mitarbeiter', pl: 'Pracownicy' }, href: '/dashboard/employees' },
    { label: { ro: 'Evaluare risc', en: 'Risk Assessment', bg: 'Оценка на риска', hu: 'Kockázatértékelés', de: 'Gefährdungsbeurteilung', pl: 'Ocena ryzyka' }, href: '/dashboard/risk-assessment' },
  ],
  psi: [
    { label: { ro: 'PSI / SU', en: 'Fire Safety', bg: 'Пожарна безопасност', hu: 'Tűzvédelem', de: 'Brandschutz', pl: 'PPOŻ' }, href: '/dashboard/fire-safety' },
    { label: { ro: 'Plan evacuare', en: 'Evacuation Plan', bg: 'План за евакуация', hu: 'Evakuációs terv', de: 'Fluchtplan', pl: 'Plan ewakuacji' }, href: '/dashboard/evacuation' },
  ],
  gdpr: [
    { label: { ro: 'GDPR', en: 'GDPR', bg: 'GDPR', hu: 'GDPR', de: 'DSGVO', pl: 'RODO' }, href: '/dashboard/gdpr' },
    { label: { ro: 'DPO', en: 'DPO', bg: 'DPO', hu: 'DPO', de: 'DSB', pl: 'IOD' }, href: '/dashboard/dpo' },
  ],
  nis2: [
    { label: { ro: 'NIS2', en: 'NIS2', bg: 'NIS2', hu: 'NIS2', de: 'NIS2', pl: 'NIS2' }, href: '/dashboard/nis2' },
    { label: { ro: 'Risc Cyber', en: 'Cyber Risk', bg: 'Кибер риск', hu: 'Kiberkockázat', de: 'Cyberrisiko', pl: 'Ryzyko cyber' }, href: '/dashboard/cyber-risk' },
  ],
  echipamente: [
    { label: { ro: 'Echipamente', en: 'Equipment', bg: 'Оборудване', hu: 'Felszerelések', de: 'Ausrüstung', pl: 'Wyposażenie' }, href: '/dashboard/equipment' },
  ],
  near_miss: [
    { label: { ro: 'Near-miss', en: 'Near-Miss', bg: 'Почти инциденти', hu: 'Majdnem-balesetek', de: 'Beinaheunfälle', pl: 'Zdarzenia' }, href: '/dashboard/near-miss' },
  ],
  mediu: [
    { label: { ro: 'Mediu', en: 'Environmental', bg: 'Околна среда', hu: 'Környezet', de: 'Umwelt', pl: 'Środowisko' }, href: '/dashboard/environmental' },
  ],
  comunicare_autoritati: [
    { label: { ro: 'Autorități', en: 'Authorities', bg: 'Органи', hu: 'Hatóságok', de: 'Behörden', pl: 'Urzędy' }, href: '/dashboard/authorities' },
  ],
  relatii_munca: [
    { label: { ro: 'Relații de muncă', en: 'Labor', bg: 'Трудови отношения', hu: 'Munkaügy', de: 'Arbeitsrecht', pl: 'Prawo pracy' }, href: '/dashboard/labor' },
    { label: { ro: 'Concedii', en: 'Leave', bg: 'Отпуски', hu: 'Szabadságok', de: 'Urlaub', pl: 'Urlopy' }, href: '/dashboard/leave' },
  ],
  reports: [
    { label: { ro: 'Rapoarte', en: 'Reports', bg: 'Доклади', hu: 'Jelentések', de: 'Berichte', pl: 'Raporty' }, href: '/dashboard/reports' },
  ],
  documents: [
    { label: { ro: 'Documente', en: 'Documents', bg: 'Документи', hu: 'Dokumentumok', de: 'Dokumente', pl: 'Dokumenty' }, href: '/dashboard/documents' },
  ],
  'ssm-core': [
    { label: { ro: 'SSM Core', en: 'SSM Core', bg: 'SSM Core', hu: 'SSM Core', de: 'SSM Core', pl: 'SSM Core' }, href: '/dashboard/ssm-core' },
  ],
}

// ── Props ──
interface ModuleNavProps {
  orgId: string | null
  locale: string
  // Opțional: callback la click pe item
  onNavigate?: (href: string) => void
  // Opțional: ruta curentă (pentru highlight)
  currentPath?: string
  // Opțional: clasă CSS container
  className?: string
}

// ── Componenta principală ──
export default function ModuleNav({
  orgId,
  locale,
  onNavigate,
  currentPath,
  className = '',
}: ModuleNavProps) {
  const { modules, activeModuleKeys, isLoading } = useOrgModules(orgId, locale)

  // Construiește navigarea filtrată pe module active
  const navSections = useMemo(() => {
    const sections: Array<{
      moduleKey: ModuleKey
      moduleName: string
      icon: string
      category: string
      is_trial: boolean
      items: Array<{ label: string; href: string }>
    }> = []

    for (const moduleKey of activeModuleKeys) {
      const navItems = MODULE_NAV_ITEMS[moduleKey]
      if (!navItems || navItems.length === 0) continue

      const mod = modules.find(m => m.module_key === moduleKey)

      sections.push({
        moduleKey,
        moduleName: mod?.name_localized || moduleKey,
        icon: MODULE_ICONS[moduleKey] || 'Package',
        category: mod?.category || 'core',
        is_trial: mod?.is_trial || false,
        items: navItems.map(item => ({
          label: item.label[locale] || item.label['en'] || moduleKey,
          href: `/${locale}${item.href}`,
        })),
      })
    }

    return sections
  }, [activeModuleKeys, modules, locale])

  // Loading skeleton
  if (isLoading) {
    return (
      <nav className={`space-y-4 ${className}`}>
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
            <div className="ml-4 space-y-1">
              <div className="h-3 w-32 rounded bg-gray-100" />
              <div className="h-3 w-28 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </nav>
    )
  }

  return (
    <nav className={`space-y-1 ${className}`}>
      {navSections.map(section => (
        <div key={section.moduleKey} className="mb-3">
          {/* Section header */}
          <div className="flex items-center gap-2 px-3 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {section.moduleName}
            </span>
            {section.is_trial && (
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                Trial
              </span>
            )}
          </div>

          {/* Nav items */}
          {section.items.map(item => {
            const isActive = currentPath === item.href ||
              (currentPath && currentPath.startsWith(item.href + '/'))

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault()
                    onNavigate(item.href)
                  }
                }}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 font-medium text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.label}
              </a>
            )
          })}
        </div>
      ))}

      {/* Dacă nu are module active (dincolo de base) */}
      {navSections.length <= 2 && (
        <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-4 text-center">
          <p className="text-xs text-gray-400">
            {locale === 'ro' ? 'Activează module suplimentare pentru mai multe funcționalități' :
             locale === 'bg' ? 'Активирайте допълнителни модули' :
             locale === 'hu' ? 'Aktiváljon további modulokat' :
             locale === 'de' ? 'Aktivieren Sie weitere Module' :
             locale === 'pl' ? 'Aktywuj dodatkowe moduły' :
             'Activate additional modules for more features'}
          </p>
        </div>
      )}
    </nav>
  )
}
