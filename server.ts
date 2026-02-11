// lib/modules/server.ts
// OP-LEGO Module System — Server-side functions
// Sprint 4.7 | 11 Feb 2026
// Usage: Server Components, API routes, middleware

import { createClient } from '@supabase/supabase-js';
import { cache } from 'react';
import type { ModuleKey, ModuleAccessResult, OrgModuleWithStatus } from './types';
import { CORE_MODULES } from './constants';

// ═══════════════════════════════════════════
// SUPABASE CLIENT (server-side, service role)
// ═══════════════════════════════════════════

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey);
}

// ═══════════════════════════════════════════
// CHECK SINGLE MODULE ACCESS
// Uses DB function check_org_module() for consistency
// ═══════════════════════════════════════════

export const checkOrgModuleServer = cache(
  async (orgId: string, moduleKey: ModuleKey): Promise<ModuleAccessResult> => {
    // Core modules are always accessible
    if (CORE_MODULES.includes(moduleKey)) {
      return {
        has_access: true,
        status: 'active',
        is_trial: false,
        trial_days_remaining: null,
      };
    }

    const supabase = getSupabaseAdmin();

    // Use the DB function for consistency with RLS
    const { data, error } = await supabase.rpc('check_org_module', {
      p_org_id: orgId,
      p_module_key: moduleKey,
    });

    if (error) {
      console.error(`[OP-LEGO] check_org_module error for ${orgId}/${moduleKey}:`, error);
      return {
        has_access: false,
        status: null,
        is_trial: false,
        trial_days_remaining: null,
      };
    }

    // check_org_module returns boolean
    const hasAccess = data === true;

    if (!hasAccess) {
      return {
        has_access: false,
        status: null,
        is_trial: false,
        trial_days_remaining: null,
      };
    }

    // If has access, get full details
    const { data: moduleData } = await supabase
      .from('organization_modules')
      .select('status, is_trial, trial_expires_at')
      .eq('organization_id', orgId)
      .eq('module_key', moduleKey)
      .single();

    if (!moduleData) {
      return { has_access: true, status: 'active', is_trial: false, trial_days_remaining: null };
    }

    let trialDaysRemaining: number | null = null;
    if (moduleData.is_trial && moduleData.trial_expires_at) {
      const diff = new Date(moduleData.trial_expires_at).getTime() - Date.now();
      trialDaysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    return {
      has_access: true,
      status: moduleData.status,
      is_trial: moduleData.is_trial,
      trial_days_remaining: trialDaysRemaining,
    };
  }
);

// ═══════════════════════════════════════════
// GET ALL MODULES WITH STATUS FOR ORG
// Uses DB function get_org_active_modules()
// ═══════════════════════════════════════════

export const getOrgModulesServer = cache(
  async (orgId: string): Promise<OrgModuleWithStatus[]> => {
    const supabase = getSupabaseAdmin();

    // Get all module definitions
    const { data: allModules, error: modError } = await supabase
      .from('module_definitions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (modError || !allModules) {
      console.error('[OP-LEGO] getOrgModulesServer - module_definitions error:', modError);
      return [];
    }

    // Get active modules for this org via DB function
    const { data: activeModules, error: activeError } = await supabase.rpc(
      'get_org_active_modules',
      { p_org_id: orgId }
    );

    if (activeError) {
      console.error('[OP-LEGO] getOrgModulesServer - get_org_active_modules error:', activeError);
    }

    // Get country bindings
    const { data: orgModuleRows } = await supabase
      .from('organization_modules')
      .select('id, module_key, organization_module_countries(country_code)')
      .eq('organization_id', orgId);

    // Build map of active modules
    const activeMap = new Map<string, {
      status: string;
      is_trial: boolean;
      expires_at: string | null;
    }>();

    if (activeModules) {
      for (const am of activeModules) {
        activeMap.set(am.module_key, {
          status: am.status,
          is_trial: am.is_trial,
          expires_at: am.expires_at,
        });
      }
    }

    // Build country map
    const countryMap = new Map<string, string[]>();
    if (orgModuleRows) {
      for (const row of orgModuleRows) {
        const countries = (row.organization_module_countries as { country_code: string }[])
          .map((c) => c.country_code);
        countryMap.set(row.module_key, countries);
      }
    }

    // Merge
    return allModules.map((mod) => {
      const active = activeMap.get(mod.module_key);
      const isCore = CORE_MODULES.includes(mod.module_key as ModuleKey);

      return {
        module_key: mod.module_key as ModuleKey,
        module_name: mod.module_name,
        category: mod.category,
        icon: mod.icon,
        sort_order: mod.sort_order,
        is_included_in_base: mod.is_included_in_base,
        status: isCore ? 'active' : (active?.status as ModuleKey | null) ?? null,
        is_trial: active?.is_trial ?? false,
        trial_expires_at: active?.expires_at ?? null,
        is_accessible: isCore || !!active,
        countries: countryMap.get(mod.module_key) ?? [],
      };
    });
  }
);

// ═══════════════════════════════════════════
// CHECK ROUTE ACCESS (for middleware/layouts)
// ═══════════════════════════════════════════

export async function checkRouteModuleAccess(
  orgId: string,
  pathname: string
): Promise<{ allowed: boolean; moduleKey: ModuleKey | null; reason?: string }> {
  // Import here to avoid circular dependency
  const { getModuleForRoute } = await import('./constants');

  const moduleKey = getModuleForRoute(pathname);

  // Route doesn't belong to any module → allow
  if (!moduleKey) {
    return { allowed: true, moduleKey: null };
  }

  // Core modules always allowed
  if (CORE_MODULES.includes(moduleKey)) {
    return { allowed: true, moduleKey };
  }

  const access = await checkOrgModuleServer(orgId, moduleKey);

  if (!access.has_access) {
    return {
      allowed: false,
      moduleKey,
      reason: `Module "${moduleKey}" not activated for this organization`,
    };
  }

  return { allowed: true, moduleKey };
}
