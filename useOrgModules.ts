// hooks/useOrgModules.ts
// OP-LEGO Module System — Client Hook
// Sprint 4.7 | 11 Feb 2026
// Usage: Client Components for module-aware UI

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase-browser'; // adjust path to your browser client
import type { ModuleKey, ModuleAccessResult, OrgModuleWithStatus } from '@/lib/modules/types';
import { CORE_MODULES } from '@/lib/modules/constants';

// ═══════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════

interface UseOrgModulesReturn {
  modules: OrgModuleWithStatus[];
  loading: boolean;
  error: string | null;
  /** Check if a specific module is accessible */
  hasModule: (moduleKey: ModuleKey) => boolean;
  /** Get full access details for a module */
  getModuleAccess: (moduleKey: ModuleKey) => ModuleAccessResult;
  /** Get only accessible modules */
  accessibleModules: OrgModuleWithStatus[];
  /** Refresh modules from DB */
  refresh: () => Promise<void>;
}

// ═══════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════

export function useOrgModules(orgId: string | null): UseOrgModulesReturn {
  const [modules, setModules] = useState<OrgModuleWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all modules with status
  const fetchModules = useCallback(async () => {
    if (!orgId) {
      setModules([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      // Get all active module definitions
      const { data: allModules, error: modError } = await supabase
        .from('module_definitions')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (modError) throw modError;

      // Get org's activated modules
      const { data: orgModules, error: orgError } = await supabase
        .from('organization_modules')
        .select(`
          id,
          module_key,
          status,
          is_trial,
          trial_expires_at,
          organization_module_countries(country_code)
        `)
        .eq('organization_id', orgId)
        .in('status', ['active', 'trial']);

      if (orgError) throw orgError;

      // Build active map
      const activeMap = new Map<string, {
        status: string;
        is_trial: boolean;
        trial_expires_at: string | null;
        countries: string[];
      }>();

      for (const om of orgModules || []) {
        const countries = (om.organization_module_countries as { country_code: string }[])
          .map((c) => c.country_code);
        activeMap.set(om.module_key, {
          status: om.status,
          is_trial: om.is_trial,
          trial_expires_at: om.trial_expires_at,
          countries,
        });
      }

      // Merge into unified list
      const merged: OrgModuleWithStatus[] = (allModules || []).map((mod) => {
        const active = activeMap.get(mod.module_key);
        const isCore = CORE_MODULES.includes(mod.module_key as ModuleKey);

        // Check trial expiry
        let isAccessible = isCore || !!active;
        if (active?.is_trial && active.trial_expires_at) {
          isAccessible = new Date(active.trial_expires_at) > new Date();
        }

        return {
          module_key: mod.module_key as ModuleKey,
          module_name: mod.module_name,
          category: mod.category as 'core' | 'standalone' | 'premium',
          icon: mod.icon,
          sort_order: mod.sort_order,
          is_included_in_base: mod.is_included_in_base,
          status: isCore ? 'active' as const : (active?.status as ModuleKey | null) ?? null,
          is_trial: active?.is_trial ?? false,
          trial_expires_at: active?.trial_expires_at ?? null,
          is_accessible: isAccessible,
          countries: active?.countries ?? [],
        };
      });

      setModules(merged);
    } catch (err) {
      console.error('[OP-LEGO] useOrgModules error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load modules');
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  // Initial fetch
  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  // Realtime subscription on organization_modules changes
  useEffect(() => {
    if (!orgId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`org-modules-${orgId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'organization_modules',
          filter: `organization_id=eq.${orgId}`,
        },
        () => {
          // Refetch on any change
          fetchModules();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orgId, fetchModules]);

  // ═══════════════════════════════════════════
  // DERIVED STATE
  // ═══════════════════════════════════════════

  const hasModule = useCallback(
    (moduleKey: ModuleKey): boolean => {
      if (CORE_MODULES.includes(moduleKey)) return true;
      const mod = modules.find((m) => m.module_key === moduleKey);
      return mod?.is_accessible ?? false;
    },
    [modules]
  );

  const getModuleAccess = useCallback(
    (moduleKey: ModuleKey): ModuleAccessResult => {
      if (CORE_MODULES.includes(moduleKey)) {
        return { has_access: true, status: 'active', is_trial: false, trial_days_remaining: null };
      }

      const mod = modules.find((m) => m.module_key === moduleKey);
      if (!mod || !mod.is_accessible) {
        return { has_access: false, status: null, is_trial: false, trial_days_remaining: null };
      }

      let trialDaysRemaining: number | null = null;
      if (mod.is_trial && mod.trial_expires_at) {
        const diff = new Date(mod.trial_expires_at).getTime() - Date.now();
        trialDaysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      }

      return {
        has_access: true,
        status: mod.status,
        is_trial: mod.is_trial,
        trial_days_remaining: trialDaysRemaining,
      };
    },
    [modules]
  );

  const accessibleModules = useMemo(
    () => modules.filter((m) => m.is_accessible),
    [modules]
  );

  return {
    modules,
    loading,
    error,
    hasModule,
    getModuleAccess,
    accessibleModules,
    refresh: fetchModules,
  };
}
