// hooks/useOrgModules.ts
// OP-LEGO — Hook React client-side pentru module per organizație
// Pattern identic cu hooks/usePermission.ts: createSupabaseBrowser() + useState/useEffect
// Include realtime subscription pentru actualizări live
// Data: 11 Februarie 2026

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import type { ModuleKey, ActiveModule, ModuleAccess, ModuleDefinition } from '@/lib/modules/types'
import { isModuleActive, getTrialDaysRemaining } from '@/lib/modules/types'
import { BASE_MODULES } from '@/lib/modules/constants'

// ── 1. useOrgModules() — hook principal ──
// Fetch-uiește modulele active ale organizației cu realtime subscription
export function useOrgModules(orgId: string | null, locale: string = 'en') {
  const [modules, setModules] = useState<ActiveModule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchModules = useCallback(async () => {
    if (!orgId) {
      setModules([])
      setIsLoading(false)
      return
    }

    try {
      setError(null)
      const supabase = createSupabaseBrowser()

      const { data, error: fetchError } = await supabase
        .from('organization_modules')
        .select(`
          id,
          module_key,
          status,
          trial_started_at,
          trial_expires_at,
          activated_at,
          expires_at,
          config,
          module_definitions!inner (
            module_name_en,
            module_name_keys,
            description_en,
            icon,
            category,
            sort_order
          )
        `)
        .eq('organization_id', orgId)
        .in('status', ['active', 'trial'])

      if (fetchError) throw fetchError

      const activeModules = (data ?? [])
        .filter(om => isModuleActive(om as any))
        .map(om => {
          const md = om.module_definitions as any
          const nameKeys = md.module_name_keys as Record<string, string>

          return {
            module_key: om.module_key as ModuleKey,
            status: om.status as any,
            category: md.category,
            is_trial: om.status === 'trial',
            expires_at: om.trial_expires_at || om.expires_at,
            name_en: md.module_name_en,
            name_localized: nameKeys[locale] || nameKeys['en'] || md.module_name_en,
            icon: md.icon,
            description_en: md.description_en,
          }
        })
        .sort((a, b) => {
          const catOrder: Record<string, number> = { core: 0, standalone: 1, premium: 2 }
          return (catOrder[a.category] ?? 99) - (catOrder[b.category] ?? 99)
        })

      setModules(activeModules)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch modules'))
    } finally {
      setIsLoading(false)
    }
  }, [orgId, locale])

  // Initial fetch
  useEffect(() => {
    fetchModules()
  }, [fetchModules])

  // Realtime subscription pe organization_modules
  useEffect(() => {
    if (!orgId) return

    const supabase = createSupabaseBrowser()

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
          // Re-fetch pe orice schimbare
          fetchModules()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orgId, fetchModules])

  // ── Helper methods ──

  // Verifică dacă organizația are acces la un modul
  const hasModule = useCallback((moduleKey: ModuleKey): boolean => {
    if (BASE_MODULES.includes(moduleKey)) return true
    return modules.some(m => m.module_key === moduleKey)
  }, [modules])

  // Returnează informații detaliate despre un modul
  const getModuleAccess = useCallback((moduleKey: ModuleKey): ModuleAccess => {
    if (BASE_MODULES.includes(moduleKey)) {
      return { has_access: true, is_trial: false, trial_days_remaining: null, status: 'active' }
    }

    const mod = modules.find(m => m.module_key === moduleKey)
    if (!mod) {
      return { has_access: false, is_trial: false, trial_days_remaining: null, status: 'inactive' }
    }

    return {
      has_access: true,
      is_trial: mod.is_trial,
      trial_days_remaining: mod.is_trial && mod.expires_at
        ? Math.max(0, Math.ceil((new Date(mod.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : null,
      status: mod.status,
    }
  }, [modules])

  // Lista module keys active
  const activeModuleKeys = useMemo(
    () => [...BASE_MODULES, ...modules.map(m => m.module_key)],
    [modules]
  )

  return {
    modules,
    isLoading,
    error,
    hasModule,
    getModuleAccess,
    activeModuleKeys,
    refetch: fetchModules,
  }
}

// ── 2. useModuleDefinitions() — catalogul complet de module ──
export function useModuleDefinitions() {
  const [definitions, setDefinitions] = useState<ModuleDefinition[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function fetch() {
      try {
        const supabase = createSupabaseBrowser()

        const { data, error } = await supabase
          .from('module_definitions')
          .select('*')
          .eq('is_active', true)
          .order('sort_order')

        if (mounted && !error && data) {
          setDefinitions(data as ModuleDefinition[])
        }
      } catch {
        // Silent fail — definitions are non-critical
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    fetch()
    return () => { mounted = false }
  }, [])

  return { definitions, isLoading }
}

// ── 3. useHasModule() — shortcut hook ──
// Folosit rapid în componente: const canAccessSSM = useHasModule(orgId, 'ssm')
export function useHasModule(orgId: string | null, moduleKey: ModuleKey): boolean {
  const { hasModule, isLoading } = useOrgModules(orgId)

  if (isLoading) return false
  return hasModule(moduleKey)
}
