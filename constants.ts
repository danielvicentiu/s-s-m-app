// lib/modules/constants.ts
// OP-LEGO Module System — Constants & Route Mapping
// Sprint 4.7 | 11 Feb 2026

import type { ModuleKey, ModuleNavItem } from './types';

// ═══════════════════════════════════════════
// CORE MODULES (always accessible, included in base)
// ═══════════════════════════════════════════

export const CORE_MODULES: ModuleKey[] = ['alerte', 'legislatie'];

// ═══════════════════════════════════════════
// MODULE → ROUTES MAPPING
// Each module gates specific routes in the app
// ═══════════════════════════════════════════

export const MODULE_ROUTES: Record<ModuleKey, string[]> = {
  alerte: ['/dashboard/alerts', '/dashboard/notifications'],
  legislatie: ['/admin/legal-acts', '/admin/legal-import', '/dashboard/legislation'],
  ssm: [
    '/dashboard/training',
    '/dashboard/employees',
    '/dashboard/risk-assessment',
    '/admin/training-modules',
  ],
  psi: [
    '/dashboard/fire-safety',
    '/dashboard/equipment',
    '/dashboard/evacuation',
    '/admin/equipment-types',
  ],
  gdpr: ['/dashboard/gdpr', '/dashboard/gdpr/registers', '/dashboard/gdpr/dpo'],
  nis2: ['/dashboard/nis2', '/dashboard/nis2/risk', '/dashboard/nis2/incidents'],
  echipamente: [
    '/dashboard/equipment-registry',
    '/dashboard/equipment-revisions',
    '/admin/equipment-types',
  ],
  near_miss: ['/dashboard/near-miss', '/dashboard/near-miss/report', '/dashboard/near-miss/investigate'],
  mediu: ['/dashboard/environment', '/dashboard/environment/waste', '/dashboard/environment/reports'],
  comunicare_autoritati: ['/dashboard/authorities', '/dashboard/authorities/templates'],
  relatii_munca: ['/dashboard/labor', '/dashboard/labor/contracts', '/dashboard/labor/leaves'],
};

// ═══════════════════════════════════════════
// MODULE → ICON MAPPING (Lucide icon names)
// ═══════════════════════════════════════════

export const MODULE_ICONS: Record<ModuleKey, string> = {
  alerte: 'Bell',
  legislatie: 'Scale',
  ssm: 'HardHat',
  psi: 'Flame',
  gdpr: 'ShieldCheck',
  nis2: 'ShieldAlert',
  echipamente: 'Wrench',
  near_miss: 'AlertTriangle',
  mediu: 'Leaf',
  comunicare_autoritati: 'FileText',
  relatii_munca: 'Users',
};

// ═══════════════════════════════════════════
// NAVIGATION STRUCTURE per module
// Used by ModuleNav to build dynamic sidebar
// ═══════════════════════════════════════════

export const MODULE_NAV_ITEMS: Record<ModuleKey, ModuleNavItem[]> = {
  alerte: [
    { moduleKey: 'alerte', label: 'nav.alerts', href: '/dashboard/alerts', icon: 'Bell' },
    { moduleKey: 'alerte', label: 'nav.notifications', href: '/dashboard/notifications', icon: 'BellRing' },
  ],
  legislatie: [
    { moduleKey: 'legislatie', label: 'nav.legislation', href: '/dashboard/legislation', icon: 'Scale' },
    { moduleKey: 'legislatie', label: 'nav.legalActs', href: '/admin/legal-acts', icon: 'BookOpen' },
    { moduleKey: 'legislatie', label: 'nav.legalImport', href: '/admin/legal-import', icon: 'Upload' },
  ],
  ssm: [
    { moduleKey: 'ssm', label: 'nav.training', href: '/dashboard/training', icon: 'GraduationCap' },
    { moduleKey: 'ssm', label: 'nav.employees', href: '/dashboard/employees', icon: 'Users' },
    { moduleKey: 'ssm', label: 'nav.riskAssessment', href: '/dashboard/risk-assessment', icon: 'ClipboardCheck' },
  ],
  psi: [
    { moduleKey: 'psi', label: 'nav.fireSafety', href: '/dashboard/fire-safety', icon: 'Flame' },
    { moduleKey: 'psi', label: 'nav.equipment', href: '/dashboard/equipment', icon: 'FireExtinguisher' },
    { moduleKey: 'psi', label: 'nav.evacuation', href: '/dashboard/evacuation', icon: 'DoorOpen' },
  ],
  gdpr: [
    { moduleKey: 'gdpr', label: 'nav.gdpr', href: '/dashboard/gdpr', icon: 'ShieldCheck' },
    { moduleKey: 'gdpr', label: 'nav.gdprRegisters', href: '/dashboard/gdpr/registers', icon: 'Database' },
  ],
  nis2: [
    { moduleKey: 'nis2', label: 'nav.nis2', href: '/dashboard/nis2', icon: 'ShieldAlert' },
    { moduleKey: 'nis2', label: 'nav.cyberRisk', href: '/dashboard/nis2/risk', icon: 'Bug' },
  ],
  echipamente: [
    { moduleKey: 'echipamente', label: 'nav.equipmentRegistry', href: '/dashboard/equipment-registry', icon: 'Wrench' },
    { moduleKey: 'echipamente', label: 'nav.revisions', href: '/dashboard/equipment-revisions', icon: 'Calendar' },
  ],
  near_miss: [
    { moduleKey: 'near_miss', label: 'nav.nearMiss', href: '/dashboard/near-miss', icon: 'AlertTriangle' },
    { moduleKey: 'near_miss', label: 'nav.report', href: '/dashboard/near-miss/report', icon: 'FileWarning' },
  ],
  mediu: [
    { moduleKey: 'mediu', label: 'nav.environment', href: '/dashboard/environment', icon: 'Leaf' },
    { moduleKey: 'mediu', label: 'nav.waste', href: '/dashboard/environment/waste', icon: 'Trash2' },
  ],
  comunicare_autoritati: [
    { moduleKey: 'comunicare_autoritati', label: 'nav.authorities', href: '/dashboard/authorities', icon: 'FileText' },
    { moduleKey: 'comunicare_autoritati', label: 'nav.templates', href: '/dashboard/authorities/templates', icon: 'FileEdit' },
  ],
  relatii_munca: [
    { moduleKey: 'relatii_munca', label: 'nav.labor', href: '/dashboard/labor', icon: 'Users' },
    { moduleKey: 'relatii_munca', label: 'nav.contracts', href: '/dashboard/labor/contracts', icon: 'FileSignature' },
  ],
};

// ═══════════════════════════════════════════
// HELPER: Check if a route belongs to a module
// ═══════════════════════════════════════════

export function getModuleForRoute(pathname: string): ModuleKey | null {
  // Strip locale prefix: /ro/dashboard/training → /dashboard/training
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/)/, '');

  for (const [moduleKey, routes] of Object.entries(MODULE_ROUTES)) {
    if (routes.some((route) => pathWithoutLocale.startsWith(route))) {
      return moduleKey as ModuleKey;
    }
  }
  return null;
}

// ═══════════════════════════════════════════
// HELPER: Get display name for module in locale
// ═══════════════════════════════════════════

export const MODULE_DISPLAY_NAMES: Record<ModuleKey, Record<string, string>> = {
  alerte: { ro: 'Alerte', bg: 'Известия', hu: 'Értesítések', de: 'Benachrichtigungen', pl: 'Powiadomienia', en: 'Alerts' },
  legislatie: { ro: 'Legislație', bg: 'Законодателство', hu: 'Jogszabályok', de: 'Gesetzgebung', pl: 'Legislacja', en: 'Legislation' },
  ssm: { ro: 'SSM', bg: 'ЗБУТ', hu: 'Munkavédelem', de: 'Arbeitsschutz', pl: 'BHP', en: 'OHS' },
  psi: { ro: 'PSI', bg: 'ПБ', hu: 'Tűzvédelem', de: 'Brandschutz', pl: 'PPOŻ', en: 'Fire Safety' },
  gdpr: { ro: 'GDPR', bg: 'GDPR', hu: 'GDPR', de: 'DSGVO', pl: 'RODO', en: 'GDPR' },
  nis2: { ro: 'NIS2', bg: 'NIS2', hu: 'NIS2', de: 'NIS2', pl: 'NIS2', en: 'NIS2' },
  echipamente: { ro: 'Echipamente', bg: 'Оборудване', hu: 'Berendezések', de: 'Ausrüstung', pl: 'Sprzęt', en: 'Equipment' },
  near_miss: { ro: 'Near-miss', bg: 'Инциденти', hu: 'Majdnem-balesetek', de: 'Beinahe-Unfälle', pl: 'Zdarzenia', en: 'Near-miss' },
  mediu: { ro: 'Mediu', bg: 'Околна среда', hu: 'Környezetvédelem', de: 'Umwelt', pl: 'Środowisko', en: 'Environment' },
  comunicare_autoritati: { ro: 'Comunicare autorități', bg: 'Комуникация', hu: 'Hatóság', de: 'Behörden', pl: 'Urzędy', en: 'Authorities' },
  relatii_munca: { ro: 'Relații de muncă', bg: 'Трудови отношения', hu: 'Munkaügy', de: 'Arbeitsrecht', pl: 'Prawo pracy', en: 'Labor Relations' },
};
