// components/ModuleGate.tsx
// OP-LEGO Module System — Conditional Rendering Component
// Sprint 4.7 | 11 Feb 2026
//
// Usage:
//   <ModuleGate moduleKey="ssm">
//     <TrainingDashboard />
//   </ModuleGate>
//
//   <ModuleGate moduleKey="nis2" showUpgradeCTA>
//     <NIS2Dashboard />
//   </ModuleGate>

'use client';

import React from 'react';
import { useOrgModules } from '@/hooks/useOrgModules';
import { useOrganization } from '@/hooks/useOrganization'; // adjust to your existing org hook
import type { ModuleGateProps, ModuleKey } from '@/lib/modules/types';
import { MODULE_DISPLAY_NAMES } from '@/lib/modules/constants';
import { useLocale } from 'next-intl';

// ═══════════════════════════════════════════
// TRIAL BANNER
// ═══════════════════════════════════════════

function TrialBanner({
  moduleKey,
  daysRemaining,
}: {
  moduleKey: ModuleKey;
  daysRemaining: number;
}) {
  const locale = useLocale();
  const moduleName = MODULE_DISPLAY_NAMES[moduleKey]?.[locale] ?? moduleKey;

  const messages: Record<string, string> = {
    ro: `Perioadă de probă ${moduleName}: ${daysRemaining} zile rămase`,
    bg: `Пробен период ${moduleName}: ${daysRemaining} дни остават`,
    hu: `${moduleName} próbaidőszak: ${daysRemaining} nap van hátra`,
    de: `${moduleName} Testphase: ${daysRemaining} Tage verbleibend`,
    pl: `Okres próbny ${moduleName}: ${daysRemaining} dni pozostało`,
    en: `${moduleName} trial: ${daysRemaining} days remaining`,
  };

  return (
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{messages[locale] || messages.en}</span>
        </div>
        <a
          href="/pricing"
          className="font-medium text-amber-900 underline hover:text-amber-700 dark:text-amber-100"
        >
          {locale === 'ro' ? 'Activează' : locale === 'bg' ? 'Активирай' : 'Upgrade'}
        </a>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// UPGRADE CTA (when module not activated)
// ═══════════════════════════════════════════

function UpgradeCTA({ moduleKey }: { moduleKey: ModuleKey }) {
  const locale = useLocale();
  const moduleName = MODULE_DISPLAY_NAMES[moduleKey]?.[locale] ?? moduleKey;

  const messages: Record<string, { title: string; desc: string; cta: string }> = {
    ro: {
      title: `Modulul ${moduleName} nu este activat`,
      desc: 'Activați acest modul pentru a accesa funcționalitățile.',
      cta: 'Activează modulul',
    },
    bg: {
      title: `Модулът ${moduleName} не е активиран`,
      desc: 'Активирайте този модул, за да получите достъп.',
      cta: 'Активирай модул',
    },
    hu: {
      title: `A(z) ${moduleName} modul nincs aktiválva`,
      desc: 'Aktiválja ezt a modult a funkciók eléréséhez.',
      cta: 'Modul aktiválása',
    },
    de: {
      title: `Modul ${moduleName} ist nicht aktiviert`,
      desc: 'Aktivieren Sie dieses Modul für den Zugang.',
      cta: 'Modul aktivieren',
    },
    pl: {
      title: `Moduł ${moduleName} nie jest aktywny`,
      desc: 'Aktywuj ten moduł, aby uzyskać dostęp.',
      cta: 'Aktywuj moduł',
    },
    en: {
      title: `${moduleName} module is not activated`,
      desc: 'Activate this module to access its features.',
      cta: 'Activate module',
    },
  };

  const msg = messages[locale] || messages.en;

  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {msg.title}
        </h3>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {msg.desc}
        </p>
        <a
          href="/pricing"
          className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          {msg.cta}
        </a>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// LOADING SKELETON
// ═══════════════════════════════════════════

function ModuleGateSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-32 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════

export function ModuleGate({
  moduleKey,
  children,
  fallback,
  showUpgradeCTA = true,
  showTrialBanner = true,
}: ModuleGateProps) {
  const { orgId } = useOrganization(); // Your existing hook — adjust if needed
  const { hasModule, getModuleAccess, loading } = useOrgModules(orgId);

  // Loading state
  if (loading) {
    return <ModuleGateSkeleton />;
  }

  // No org context (e.g., not logged in or no org selected)
  if (!orgId) {
    return fallback ? <>{fallback}</> : null;
  }

  const access = getModuleAccess(moduleKey);

  // Module not accessible → show upgrade CTA or fallback
  if (!access.has_access) {
    if (fallback) return <>{fallback}</>;
    if (showUpgradeCTA) return <UpgradeCTA moduleKey={moduleKey} />;
    return null;
  }

  // Module accessible
  return (
    <>
      {showTrialBanner && access.is_trial && access.trial_days_remaining !== null && (
        <TrialBanner moduleKey={moduleKey} daysRemaining={access.trial_days_remaining} />
      )}
      {children}
    </>
  );
}

// ═══════════════════════════════════════════
// UTILITY: useModuleAccess hook (shortcut)
// ═══════════════════════════════════════════

export function useModuleAccess(moduleKey: ModuleKey) {
  const { orgId } = useOrganization();
  const { hasModule, getModuleAccess, loading } = useOrgModules(orgId);

  return {
    loading,
    hasAccess: hasModule(moduleKey),
    ...getModuleAccess(moduleKey),
  };
}
