// components/ActiveModulesCard.tsx
// OP-LEGO — Card pe dashboard care arată modulele active ale organizației
// Înlocuiește feature cards statice cu module reale din DB
// Data: 11 Februarie 2026

'use client'

import { useOrgModules } from '@/hooks/useOrgModules'
import type { ModuleKey } from '@/lib/modules/types'
import { MODULE_ICONS, CATEGORY_COLORS } from '@/lib/modules/constants'

// Module nav links — unde duce click-ul pe fiecare modul
const MODULE_LINKS: Partial<Record<ModuleKey, string>> = {
  ssm: '/dashboard/training',
  psi: '/dashboard/equipment',
  echipamente: '/dashboard/equipment',
  gdpr: '/dashboard/gdpr',
  nis2: '/dashboard/nis2',
  near_miss: '/dashboard/near-miss',
  mediu: '/dashboard/environmental',
  comunicare_autoritati: '/dashboard/authorities',
  relatii_munca: '/dashboard/labor',
}

// Icons mapping simplu (emoji fallback)
const MODULE_EMOJI: Record<ModuleKey, string> = {
  alerte: '🔔',
  legislatie: '⚖️',
  ssm: '🛡️',
  psi: '🔥',
  gdpr: '🔒',
  nis2: '🛡️',
  echipamente: '🔧',
  near_miss: '⚠️',
  mediu: '🌿',
  comunicare_autoritati: '🏛️',
  relatii_munca: '👥',
}

interface ActiveModulesCardProps {
  orgId: string | null
  locale: string
}

export default function ActiveModulesCard({ orgId, locale }: ActiveModulesCardProps) {
  const { modules, activeModuleKeys, isLoading } = useOrgModules(orgId, locale)

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 animate-pulse">
        <div className="h-5 w-40 rounded bg-gray-200 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  // Împarte în active vs disponibile
  const activeNonCore = modules.filter(m => m.category !== 'core')
  const coreModules = modules.filter(m => m.category === 'core')

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="px-6 py-4 flex justify-between items-center">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          🧩 <span>Module Active</span>
        </h2>
        <span className="text-sm text-gray-400">
          {activeModuleKeys.length} / 11 module
        </span>
      </div>

      <div className="px-6 pb-5">
        {/* Core modules - mereu vizibile */}
        <div className="flex gap-2 mb-3">
          {coreModules.map(mod => (
            <span
              key={mod.module_key}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
            >
              {MODULE_EMOJI[mod.module_key]} {mod.name_localized}
              <span className="text-blue-400">• inclus</span>
            </span>
          ))}
        </div>

        {/* Standalone/premium modules */}
        {activeNonCore.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeNonCore.map(mod => {
              const link = MODULE_LINKS[mod.module_key]
              const colors = CATEGORY_COLORS[mod.category]

              return (
                <a
                  key={mod.module_key}
                  href={link ? `/${locale}${link}` : '#'}
                  className={`rounded-xl border p-4 transition hover:shadow-md ${colors.border} ${colors.bg}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{MODULE_EMOJI[mod.module_key]}</span>
                    <div>
                      <div className={`font-bold ${colors.text}`}>{mod.name_localized}</div>
                      {mod.is_trial && (
                        <span className="text-[10px] font-medium text-amber-600 bg-amber-100 rounded-full px-1.5 py-0.5">
                          Trial
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {mod.status === 'active' ? '✅ Activ' : mod.is_trial ? '⏳ Perioadă de probă' : ''}
                  </div>
                </a>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center">
            <p className="text-sm text-gray-400 mb-3">
              {locale === 'ro' ? 'Nu ai module suplimentare active. Activează module pentru funcționalități extinse.' :
               'No additional modules active. Activate modules for extended features.'}
            </p>
            <a
              href={`/${locale}/pricing`}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              {locale === 'ro' ? 'Vezi module disponibile' : 'View available modules'}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
