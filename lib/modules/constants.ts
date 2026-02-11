// lib/modules/constants.ts
// OP-LEGO — Constante pentru rutarea și configurarea modulelor
// Data: 11 Februarie 2026

import type { ModuleKey } from './types'

// ── Module de bază (incluse automat în pachetul de bază) ──
export const BASE_MODULES: ModuleKey[] = ['alerte', 'legislatie']

// ── Rute protejate per modul ──
// Când un user accesează o rută, verificăm dacă organizația are modulul activ
export const MODULE_ROUTES: Record<string, ModuleKey> = {
  // SSM
  '/dashboard/training': 'ssm',
  '/dashboard/employees': 'ssm',
  '/dashboard/risk-assessment': 'ssm',
  '/admin/training': 'ssm',

  // PSI
  '/dashboard/fire-safety': 'psi',
  '/dashboard/evacuation': 'psi',
  '/dashboard/extinguishers': 'psi',

  // GDPR
  '/dashboard/gdpr': 'gdpr',
  '/dashboard/dpo': 'gdpr',
  '/dashboard/dpia': 'gdpr',
  '/dashboard/breach': 'gdpr',

  // NIS2
  '/dashboard/nis2': 'nis2',
  '/dashboard/cyber-risk': 'nis2',

  // Echipamente
  '/dashboard/equipment': 'echipamente',
  '/dashboard/iscir': 'echipamente',
  '/admin/equipment-types': 'echipamente',

  // Near-miss
  '/dashboard/near-miss': 'near_miss',
  '/dashboard/incidents': 'near_miss',

  // Mediu
  '/dashboard/environmental': 'mediu',
  '/dashboard/waste': 'mediu',

  // Comunicare autorități
  '/dashboard/authorities': 'comunicare_autoritati',
  '/dashboard/correspondence': 'comunicare_autoritati',

  // Relații de muncă
  '/dashboard/labor': 'relatii_munca',
  '/dashboard/contracts': 'relatii_munca',
  '/dashboard/leave': 'relatii_munca',
  '/dashboard/revisal': 'relatii_munca',
}

// ── Rute care NU necesită verificare modul (accesibile mereu) ──
export const PUBLIC_MODULE_ROUTES: string[] = [
  '/dashboard',
  '/dashboard/overview',
  '/dashboard/alerts',
  '/dashboard/notifications',
  '/dashboard/legislation',
  '/admin',
  '/admin/roles',
  '/admin/legal-acts',
  '/admin/legal-import',
  '/admin/countries',
  '/admin/obligations',
  '/admin/alert-categories',
  '/settings',
  '/profile',
]

// ── Lucide icons per modul (pentru navigare și UI) ──
export const MODULE_ICONS: Record<ModuleKey, string> = {
  alerte: 'Bell',
  legislatie: 'Scale',
  ssm: 'ShieldCheck',
  psi: 'Flame',
  gdpr: 'Lock',
  nis2: 'ShieldAlert',
  echipamente: 'Wrench',
  near_miss: 'AlertTriangle',
  mediu: 'Leaf',
  comunicare_autoritati: 'Building2',
  relatii_munca: 'Users',
}

// ── Culori per categorie (pentru badges UI) ──
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  core: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  standalone: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  premium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
}

// ── Language Tier colors (pentru UI colapsabil) ──
export const LANGUAGE_TIER_COLORS: Record<number, { bg: string; text: string; label: string }> = {
  1: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Oficială' },
  2: { bg: 'bg-green-100', text: 'text-green-800', label: 'Co-oficială / Minoritară' },
  3: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Regională / Protejată' },
}

// ── Helper: verifică dacă o rută necesită un modul ──
export function getRequiredModule(pathname: string): ModuleKey | null {
  // Elimină locale prefix (ex: /ro/dashboard/training → /dashboard/training)
  const cleanPath = pathname.replace(/^\/(ro|bg|hu|de|pl|en)/, '')

  // Verifică match exact
  if (MODULE_ROUTES[cleanPath]) return MODULE_ROUTES[cleanPath]

  // Verifică match prefix (ex: /dashboard/training/session/123 → ssm)
  for (const [route, moduleKey] of Object.entries(MODULE_ROUTES)) {
    if (cleanPath.startsWith(route)) return moduleKey
  }

  return null
}

// ── Helper: verifică dacă o rută e publică (fără modul necesar) ──
export function isPublicModuleRoute(pathname: string): boolean {
  const cleanPath = pathname.replace(/^\/(ro|bg|hu|de|pl|en)/, '')
  return PUBLIC_MODULE_ROUTES.some(route => cleanPath.startsWith(route))
}
