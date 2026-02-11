// lib/modules/types.ts
// OP-LEGO Module System — TypeScript Types
// Sprint 4.7 | 11 Feb 2026

// ═══════════════════════════════════════════
// DATABASE TYPES (mirror Supabase schema)
// ═══════════════════════════════════════════

export type ModuleKey =
  | 'alerte'
  | 'legislatie'
  | 'ssm'
  | 'psi'
  | 'gdpr'
  | 'nis2'
  | 'echipamente'
  | 'near_miss'
  | 'mediu'
  | 'comunicare_autoritati'
  | 'relatii_munca';

export type ModuleCategory = 'core' | 'standalone' | 'premium';

export type ModuleStatus = 'active' | 'inactive' | 'trial' | 'suspended' | 'expired';

export type CountryCode = 'RO' | 'BG' | 'HU' | 'DE' | 'PL';

// ═══════════════════════════════════════════
// TABLE TYPES
// ═══════════════════════════════════════════

export interface ModuleDefinition {
  module_key: ModuleKey;
  module_name: string;
  module_name_keys: Record<string, string>; // { ro: "SSM", bg: "ЗБУТ", etc. }
  description: string;
  category: ModuleCategory;
  icon: string; // Lucide icon name
  is_active: boolean;
  is_included_in_base: boolean;
  depends_on: ModuleKey[];
  incompatible_with: ModuleKey[];
  sort_order: number;
  created_at: string;
}

export interface CountryModuleConfig {
  id: string;
  country_code: CountryCode;
  module_key: ModuleKey;
  is_available: boolean;
  local_name: string;
  local_authority: string;
  legal_framework: string;
  local_config: Record<string, unknown>;
  created_at: string;
}

export interface OrganizationModule {
  id: string;
  organization_id: string;
  module_key: ModuleKey;
  status: ModuleStatus;
  is_trial: boolean;
  trial_started_at: string | null;
  trial_expires_at: string | null;
  activated_at: string;
  activated_by: string;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface OrganizationModuleCountry {
  id: string;
  organization_module_id: string;
  country_code: CountryCode;
  created_at: string;
}

// ═══════════════════════════════════════════
// DERIVED / UI TYPES
// ═══════════════════════════════════════════

/** Module with its activation status for a specific organization */
export interface OrgModuleWithStatus {
  module_key: ModuleKey;
  module_name: string;
  category: ModuleCategory;
  icon: string;
  sort_order: number;
  is_included_in_base: boolean;
  // Activation status (null if not activated)
  status: ModuleStatus | null;
  is_trial: boolean;
  trial_expires_at: string | null;
  is_accessible: boolean; // true if active OR trial (not expired)
  countries: CountryCode[];
}

/** Simplified check result */
export interface ModuleAccessResult {
  has_access: boolean;
  status: ModuleStatus | null;
  is_trial: boolean;
  trial_days_remaining: number | null;
}

/** Props for ModuleGate component */
export interface ModuleGateProps {
  moduleKey: ModuleKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradeCTA?: boolean;
  showTrialBanner?: boolean;
}

/** Navigation item filtered by module access */
export interface ModuleNavItem {
  moduleKey: ModuleKey;
  label: string;
  href: string;
  icon: string;
  badge?: string;
  children?: ModuleNavItem[];
}
