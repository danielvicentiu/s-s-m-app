'use client'

// app/[locale]/dashboard/modules/ModulesClient.tsx
// Vizualizare module disponibile — status per organizație
// Read-only: activarea se face exclusiv de super-admin

// ── Iconuri SVG inline per modul ──
const MODULE_ICONS_SVG: Record<string, React.ReactNode> = {
  Bell: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Scale: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
  ShieldCheck: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Flame: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    </svg>
  ),
  Heart: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Wrench: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  AlertTriangle: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Lock: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  ShieldAlert: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v4m0 4h.01" />
    </svg>
  ),
  Leaf: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Building2: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Users: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  DollarSign: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ScanLine: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  FileText: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  FolderOpen: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
    </svg>
  ),
  Package: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
}

// ── Tipuri ──
interface ModuleDefinition {
  module_key: string
  module_name_en: string
  module_name_keys: Record<string, string>
  description_en: string | null
  icon: string | null
  category: string
  is_base: boolean
  sort_order: number
}

interface ActiveModule {
  module_key: string
  status: string
  activated_at: string | null
  expires_at: string | null
  trial_started_at: string | null
  trial_expires_at: string | null
}

interface ModulesClientProps {
  locale: string
  orgId: string
  orgName: string
  definitions: ModuleDefinition[]
  activeModules: ActiveModule[]
}

// ── Status badge ──
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-green-100 text-green-800 border border-green-200',
    trial: 'bg-amber-100 text-amber-800 border border-amber-200',
    suspended: 'bg-red-100 text-red-800 border border-red-200',
    inactive: 'bg-gray-100 text-gray-500 border border-gray-200',
  }

  const labels: Record<string, string> = {
    active: 'Activ',
    trial: 'Trial',
    suspended: 'Suspendat',
    inactive: 'Inactiv',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.inactive}`}>
      {labels[status] || status}
    </span>
  )
}

// ── Category badge ──
function CategoryBadge({ category }: { category: string }) {
  const styles: Record<string, string> = {
    core: 'bg-blue-50 text-blue-700 border border-blue-200',
    standalone: 'bg-gray-50 text-gray-600 border border-gray-200',
    premium: 'bg-amber-50 text-amber-700 border border-amber-200',
  }

  const labels: Record<string, string> = {
    core: 'Inclus',
    standalone: 'Standard',
    premium: 'Premium',
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[category] || styles.standalone}`}>
      {labels[category] || category}
    </span>
  )
}

// ── Componenta principală ──
export default function ModulesClient({
  locale,
  orgId: _orgId,
  orgName,
  definitions,
  activeModules,
}: ModulesClientProps) {
  // Construiește un map rapid module_key → status
  const activeMap = new Map(activeModules.map(m => [m.module_key, m]))

  // Grupează definițiile pe categorii
  const coreModules = definitions.filter(d => d.category === 'core')
  const standaloneModules = definitions.filter(d => d.category === 'standalone')
  const premiumModules = definitions.filter(d => d.category === 'premium')

  const totalActive = activeModules.filter(m => m.status === 'active').length
  const totalTrial = activeModules.filter(m => m.status === 'trial').length

  function getLocaleName(def: ModuleDefinition) {
    return def.module_name_keys?.[locale] || def.module_name_keys?.['ro'] || def.module_name_en
  }

  function getIcon(iconName: string | null) {
    if (!iconName) return MODULE_ICONS_SVG['Package']
    return MODULE_ICONS_SVG[iconName] || MODULE_ICONS_SVG['Package']
  }

  function renderModuleCard(def: ModuleDefinition) {
    const activeEntry = activeMap.get(def.module_key)
    const status = activeEntry?.status || 'inactive'
    const isActive = status === 'active' || status === 'trial'

    return (
      <div
        key={def.module_key}
        className={`rounded-xl border p-5 transition-all ${
          isActive
            ? 'bg-white border-gray-200 shadow-sm'
            : 'bg-gray-50 border-gray-200 opacity-70'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className={`p-2.5 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
            {getIcon(def.icon)}
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusBadge status={status} />
            <CategoryBadge category={def.category} />
          </div>
        </div>

        <div className="mt-3">
          <h3 className={`font-semibold text-sm ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
            {getLocaleName(def)}
          </h3>
          {def.description_en && (
            <p className="mt-1 text-xs text-gray-500 leading-relaxed">
              {def.description_en}
            </p>
          )}
        </div>

        {/* Trial expiry info */}
        {status === 'trial' && activeEntry?.trial_expires_at && (
          <div className="mt-3 pt-3 border-t border-amber-100">
            <p className="text-xs text-amber-700">
              Trial expiră: {new Date(activeEntry.trial_expires_at).toLocaleDateString('ro-RO')}
            </p>
          </div>
        )}

        {/* Activated info */}
        {status === 'active' && activeEntry?.activated_at && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Activ din: {new Date(activeEntry.activated_at).toLocaleDateString('ro-RO')}
            </p>
          </div>
        )}

        {/* Inactive CTA */}
        {status === 'inactive' && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 italic">
              Contactați administratorul pentru activare
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="max-w-5xl mx-auto py-2">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <a href={`/${locale}/dashboard`} className="hover:text-blue-600 transition-colors">
              Dashboard
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium">Module</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Module disponibile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Modulele active pentru <span className="font-medium text-gray-700">{orgName}</span>.
            Activarea modulelor se face de administratorul platformei.
          </p>
        </div>

        {/* Statistici rapide */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{totalActive}</div>
            <div className="text-xs text-gray-500 mt-1">Module active</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{totalTrial}</div>
            <div className="text-xs text-gray-500 mt-1">În trial</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-gray-400">
              {definitions.length - totalActive - totalTrial}
            </div>
            <div className="text-xs text-gray-500 mt-1">Disponibile</div>
          </div>
        </div>

        {/* Notă informativă */}
        <div className="mb-8 rounded-lg bg-blue-50 border border-blue-200 p-4 flex gap-3">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800">Informație</p>
            <p className="text-sm text-blue-700 mt-0.5">
              Această pagină este doar pentru vizualizare. Pentru a activa sau dezactiva module,
              contactați echipa s-s-m.ro la{' '}
              <a href="mailto:support@s-s-m.ro" className="underline font-medium">support@s-s-m.ro</a>.
            </p>
          </div>
        </div>

        {/* Secțiune: Module de bază */}
        {coreModules.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base font-semibold text-gray-900">Module de bază</h2>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                Incluse
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coreModules.map(renderModuleCard)}
            </div>
          </section>
        )}

        {/* Secțiune: Module standard */}
        {standaloneModules.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base font-semibold text-gray-900">Module standard</h2>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                Standard
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {standaloneModules.map(renderModuleCard)}
            </div>
          </section>
        )}

        {/* Secțiune: Module premium */}
        {premiumModules.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base font-semibold text-gray-900">Module premium</h2>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                Premium
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {premiumModules.map(renderModuleCard)}
            </div>
          </section>
        )}

        {/* Footer contact */}
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            Vrei să activezi un modul nou?
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Contactați-ne pentru a activa module suplimentare sau pentru a obține o perioadă de trial.
          </p>
          <a
            href="mailto:support@s-s-m.ro"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Contactați administratorul
          </a>
        </div>
      </div>
    </div>
  )
}
