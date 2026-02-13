// components/dashboard/ModuleStatusCards.tsx
// Mini status cards pentru 6 module principale pe dashboard
// Afișează metrici rapide + mini progress bar
// Click pe card navighează la modul respectiv
// Data: 13 Februarie 2026

'use client'

import { useRouter } from 'next/navigation'

interface ModuleStatusCardsProps {
  // Metrici pentru fiecare modul
  stats: {
    ssm: { trained: number; total: number }
    equipment: { verified: number; total: number }
    documents: { complete: number; total: number }
    alerts: { active: number }
    medical: { valid: number; total: number }
    training: { completed: number; total: number }
  }
  locale?: string
}

interface ModuleCardData {
  key: string
  icon: string
  label: string
  value: string
  progress: number
  color: string
  bgColor: string
  link: string
}

export default function ModuleStatusCards({ stats, locale = 'ro' }: ModuleStatusCardsProps) {
  const router = useRouter()

  // Construiește date pentru carduri
  const modules: ModuleCardData[] = [
    {
      key: 'ssm',
      icon: '🛡️',
      label: 'SSM',
      value: `${stats.ssm.trained}/${stats.ssm.total}`,
      progress: stats.ssm.total > 0 ? (stats.ssm.trained / stats.ssm.total) * 100 : 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: `/${locale}/dashboard/training`
    },
    {
      key: 'equipment',
      icon: '🔧',
      label: 'Echipamente',
      value: `${stats.equipment.verified}/${stats.equipment.total}`,
      progress: stats.equipment.total > 0 ? (stats.equipment.verified / stats.equipment.total) * 100 : 0,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      link: `/${locale}/dashboard/equipment`
    },
    {
      key: 'documents',
      icon: '📄',
      label: 'Documente',
      value: `${stats.documents.complete}/${stats.documents.total}`,
      progress: stats.documents.total > 0 ? (stats.documents.complete / stats.documents.total) * 100 : 0,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      link: `/${locale}/documents/generate`
    },
    {
      key: 'alerts',
      icon: '🔔',
      label: 'Alerte',
      value: `${stats.alerts.active}`,
      progress: stats.alerts.active > 0 ? 100 : 0,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      link: `/${locale}/dashboard/alerts`
    },
    {
      key: 'medical',
      icon: '🏥',
      label: 'Medical',
      value: `${stats.medical.valid}/${stats.medical.total}`,
      progress: stats.medical.total > 0 ? (stats.medical.valid / stats.medical.total) * 100 : 0,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      link: `/${locale}/dashboard/medical`
    },
    {
      key: 'training',
      icon: '📚',
      label: 'Instruiri',
      value: `${stats.training.completed}/${stats.training.total}`,
      progress: stats.training.total > 0 ? (stats.training.completed / stats.training.total) * 100 : 0,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      link: `/${locale}/dashboard/training`
    }
  ]

  function handleCardClick(link: string) {
    router.push(link)
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          📊 <span>Status Module</span>
        </h2>
      </div>

      <div className="px-6 pb-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {modules.map((module) => (
            <button
              key={module.key}
              onClick={() => handleCardClick(module.link)}
              className="rounded-xl border border-gray-200 bg-white p-3 transition hover:shadow-md hover:border-gray-300 text-left group"
            >
              {/* Icon + Label */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-2xl ${module.bgColor} rounded-lg w-10 h-10 flex items-center justify-center`}>
                  {module.icon}
                </span>
              </div>

              {/* Label */}
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                {module.label}
              </div>

              {/* Value */}
              <div className={`text-xl font-black ${module.color} mb-2`}>
                {module.value}
              </div>

              {/* Mini Progress Bar */}
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${module.bgColor} transition-all duration-300 group-hover:opacity-80`}
                  style={{ width: `${Math.min(100, module.progress)}%` }}
                />
              </div>

              {/* Progress percentage */}
              <div className="text-[10px] text-gray-400 mt-1 text-right">
                {Math.round(module.progress)}%
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
