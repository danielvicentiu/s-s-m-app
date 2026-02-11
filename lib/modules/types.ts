// lib/modules/types.ts
// OP-LEGO — Tipuri TypeScript pentru arhitectura modulară
// Mapate 1:1 pe tabelele OP-LEGO din Supabase
// Data: 11 Februarie 2026

// ── Module Keys ──
export const MODULE_KEYS = [
  'alerte',
  'legislatie',
  'ssm',
  'psi',
  'gdpr',
  'nis2',
  'echipamente',
  'near_miss',
  'mediu',
  'comunicare_autoritati',
  'relatii_munca',
] as const

export type ModuleKey = typeof MODULE_KEYS[number]

// ── Module Categories ──
export type ModuleCategory = 'core' | 'standalone' | 'premium'

// ── Module Status (per organizație) ──
export type ModuleStatus = 'active' | 'inactive' | 'trial' | 'suspended' | 'expired'

// ── DB: module_definitions ──
export interface ModuleDefinition {
  module_key: ModuleKey
  module_name_en: string
  module_name_keys: Record<string, string>  // {"ro": "SSM", "bg": "ЗБУТ", ...}
  description_en: string | null
  icon: string | null  // Lucide icon name
  category: ModuleCategory
  is_base: boolean
  depends_on: ModuleKey[]
  incompatible: ModuleKey[]
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// ── DB: countries ──
export interface Country {
  country_code: string
  country_name_en: string
  country_name_native: string
  official_languages: string[]      // Tier 1 (albastru)
  co_official_languages: string[]   // Tier 2 (verde)
  regional_languages: string[]      // Tier 3 (galben)
  primary_locale: string
  supported_locales: string[]
  currency_code: string
  ssm_authority: string | null
  ssm_authority_url: string | null
  eu_member: boolean
  eea_member: boolean
  region: string | null
  timezone: string | null
  phone_prefix: string | null
  is_available: boolean
  translation_quality: Record<string, 'professional' | 'community' | 'ai'>
  created_at: string
  updated_at: string
}

// ── DB: country_module_config ──
export interface CountryModuleConfig {
  id: string
  country_code: string
  module_key: ModuleKey
  local_name: string | null
  local_authority: string | null
  local_authority_url: string | null
  legal_framework: string | null
  is_available: boolean
  available_from: string | null
  local_config: Record<string, any>
  created_at: string
  updated_at: string
}

// ── DB: organization_modules ──
export interface OrganizationModule {
  id: string
  organization_id: string
  module_key: ModuleKey
  status: ModuleStatus
  trial_started_at: string | null
  trial_expires_at: string | null
  activated_at: string | null
  expires_at: string | null
  config: Record<string, any>
  activated_by: string | null
  created_at: string
  updated_at: string
}

// ── DB: organization_module_countries ──
export interface OrganizationModuleCountry {
  id: string
  organization_module_id: string
  country_code: string
  config: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
}

// ── Tipuri derivate (pentru UI) ──

export interface ActiveModule {
  module_key: ModuleKey
  status: ModuleStatus
  category: ModuleCategory
  is_trial: boolean
  expires_at: string | null
  // Enriched din module_definitions
  name_en: string
  name_localized: string
  icon: string | null
  description_en: string | null
}

export interface ModuleAccess {
  has_access: boolean
  is_trial: boolean
  trial_days_remaining: number | null
  status: ModuleStatus
}

// ── Language Tier (pentru UI colapsabil) ──
export type LanguageTier = 1 | 2 | 3

export interface LanguageWithTier {
  code: string
  tier: LanguageTier
  quality: 'professional' | 'community' | 'ai' | null
}

// ── Translation quality badge ──
export const TRANSLATION_QUALITY_LABELS: Record<string, { label: string; emoji: string }> = {
  professional: { label: 'Profesional', emoji: '✅' },
  community: { label: 'Comunitate', emoji: '🤝' },
  ai: { label: 'AI', emoji: '🤖' },
}

// ── Helpers ──

export function isModuleActive(module: OrganizationModule): boolean {
  if (module.status === 'active') {
    return !module.expires_at || new Date(module.expires_at) > new Date()
  }
  if (module.status === 'trial') {
    return !module.trial_expires_at || new Date(module.trial_expires_at) > new Date()
  }
  return false
}

export function getTrialDaysRemaining(module: OrganizationModule): number | null {
  if (module.status !== 'trial' || !module.trial_expires_at) return null
  const now = new Date()
  const expires = new Date(module.trial_expires_at)
  const days = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, days)
}
