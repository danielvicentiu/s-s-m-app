// app/[locale]/changelog/page.tsx
// Changelog page with vertical timeline design

import { Badge } from '@/components/ui/Badge'

interface ChangelogEntry {
  version: string
  date: string
  type: 'feature' | 'fix' | 'improvement'
  description: string
}

const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    version: '1.5.0',
    date: '2026-02-13',
    type: 'feature',
    description: 'Adăugat sistem de notificări în timp real și panou de module active cu configurare personalizată'
  },
  {
    version: '1.4.2',
    date: '2026-02-10',
    type: 'fix',
    description: 'Rezolvat bug la filtrarea echipamentelor expirate în dashboard-ul consultantului'
  },
  {
    version: '1.4.1',
    date: '2026-02-08',
    type: 'improvement',
    description: 'Optimizată performanța încărcării datelor pentru organizații cu peste 100 de angajați'
  },
  {
    version: '1.4.0',
    date: '2026-02-05',
    type: 'feature',
    description: 'Implementat sistem RBAC dinamic cu roluri și permisiuni configurabile'
  },
  {
    version: '1.3.3',
    date: '2026-02-01',
    type: 'fix',
    description: 'Corectat problema de sincronizare la actualizarea profilului utilizatorului'
  },
  {
    version: '1.3.2',
    date: '2026-01-28',
    type: 'improvement',
    description: 'Îmbunătățit design-ul paginii de echipamente cu filtre avansate și sortare'
  },
  {
    version: '1.3.1',
    date: '2026-01-25',
    type: 'fix',
    description: 'Rezolvat eroare la exportul PDF pentru rapoarte de instruire SSM'
  },
  {
    version: '1.3.0',
    date: '2026-01-20',
    type: 'feature',
    description: 'Adăugat modul de gestionare documente cu upload, preview și organizare pe categorii'
  },
  {
    version: '1.2.1',
    date: '2026-01-15',
    type: 'improvement',
    description: 'Actualizat interfața de administrare membri echipă cu permisiuni granulare'
  },
  {
    version: '1.2.0',
    date: '2026-01-10',
    type: 'feature',
    description: 'Implementat dashboard interactiv cu statistici live și grafice pentru consultanți SSM'
  }
]

const TYPE_BADGE_CONFIG = {
  feature: { variant: 'success' as const, label: 'Feature' },
  fix: { variant: 'danger' as const, label: 'Fix' },
  improvement: { variant: 'info' as const, label: 'Improvement' }
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Changelog
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Istoric complet al actualizărilor și îmbunătățirilor platformei SSM
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

          {/* Entries */}
          <div className="space-y-8">
            {CHANGELOG_ENTRIES.map((entry, index) => {
              const badgeConfig = TYPE_BADGE_CONFIG[entry.type]

              return (
                <div key={`${entry.version}-${index}`} className="relative pl-20">
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-white dark:bg-gray-800 border-4 border-blue-600 dark:border-blue-500" />

                  {/* Content card */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          v{entry.version}
                        </h2>
                        <Badge
                          label={badgeConfig.label}
                          variant={badgeConfig.variant}
                          size="sm"
                        />
                      </div>
                      <time className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(entry.date).toLocaleDateString('ro-RO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {entry.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Pentru sugestii sau raportare probleme, contactați echipa de suport.
          </p>
        </div>
      </div>
    </div>
  )
}
