// hooks/useCapabilities.ts
// Hook React client-side pentru verificarea capabilities (permisiuni semantice)
// Citește din JWT app_metadata.permissions (fast path, O(1))
// Fallback: query DB pe role_capabilities JOIN user_roles (dacă JWT nu e sync)
// Pattern identic cu hooks/usePermission.ts
// Data: 19 Februarie 2026

'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'

// ── Tipuri ──
export type CapabilityCode =
  | 'can_sign_training'
  | 'can_view_medical'
  | 'can_edit_employees'
  | 'can_approve_incidents'
  | 'can_export_reports'
  | 'can_manage_users'
  | 'can_view_legislation'
  | 'can_manage_equipment'
  | string // extensibil pentru capabilities custom

// ── 1. useCapabilities() — returnează lista de capability codes ale userului ──
// Citește din JWT app_metadata.permissions cu fallback la DB
export function useCapabilities() {
  const [capabilities, setCapabilities] = useState<CapabilityCode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchCapabilities() {
      try {
        setIsLoading(true)
        setError(null)

        const supabase = createSupabaseBrowser()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          if (mounted) {
            setCapabilities([])
            setIsLoading(false)
          }
          return
        }

        // ── Fast path: citește din JWT app_metadata.permissions ──
        const jwtPermissions = user.app_metadata?.permissions
        if (Array.isArray(jwtPermissions) && jwtPermissions.length > 0) {
          if (mounted) {
            setCapabilities(jwtPermissions as CapabilityCode[])
            setIsLoading(false)
          }
          return
        }

        // ── Super admin check din JWT ──
        const jwtRole = user.app_metadata?.role
        if (jwtRole === 'super_admin') {
          // Super admin are toate capabilities — fetch-uiește lista completă
          const { data: allCaps } = await supabase
            .from('capabilities')
            .select('code')

          if (mounted) {
            setCapabilities(allCaps?.map((c) => c.code as CapabilityCode) ?? [])
            setIsLoading(false)
          }
          return
        }

        // ── Fallback: DB query pentru userii fără JWT sync ──
        // 1. Ia role_ids din user_roles
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role_id, expires_at')
          .eq('user_id', user.id)
          .eq('is_active', true)

        if (rolesError) throw rolesError

        if (!userRoles || userRoles.length === 0) {
          if (mounted) {
            setCapabilities([])
            setIsLoading(false)
          }
          return
        }

        // Filtrează rolurile expirate
        const activeRoleIds = userRoles
          .filter((ur) => !ur.expires_at || new Date(ur.expires_at) > new Date())
          .map((ur) => ur.role_id)

        if (activeRoleIds.length === 0) {
          if (mounted) {
            setCapabilities([])
            setIsLoading(false)
          }
          return
        }

        // 2. Ia capabilities pentru aceste roluri
        const { data: roleCaps, error: capsError } = await supabase
          .from('role_capabilities')
          .select('capability_code')
          .in('role_id', activeRoleIds)

        if (capsError) throw capsError

        const uniqueCaps = [
          ...new Set((roleCaps ?? []).map((rc) => rc.capability_code as CapabilityCode)),
        ]

        if (mounted) {
          setCapabilities(uniqueCaps)
          setIsLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Eroare la încărcarea capabilities'))
          setIsLoading(false)
        }
      }
    }

    fetchCapabilities()

    return () => {
      mounted = false
    }
  }, [])

  return { capabilities, isLoading, error }
}

// ── 2. hasCapability(code) — verifică dacă userul are o capability specifică ──
export function useHasCapability(code: CapabilityCode): boolean {
  const { capabilities, isLoading } = useCapabilities()

  // Returnează false în timp ce se încarcă (fail-safe)
  if (isLoading) return false
  return capabilities.includes(code)
}

// ── 3. useCapabilityGate — returnează { allowed, isLoading } pentru UI gating ──
export function useCapabilityGate(code: CapabilityCode): {
  allowed: boolean
  isLoading: boolean
} {
  const { capabilities, isLoading } = useCapabilities()
  return {
    allowed: isLoading ? false : capabilities.includes(code),
    isLoading,
  }
}

// ── 4. Hook-uri specifice pentru capabilities frecvent utilizate ──

export function useCanSignTraining(): boolean {
  return useHasCapability('can_sign_training')
}

export function useCanViewMedical(): boolean {
  return useHasCapability('can_view_medical')
}

export function useCanEditEmployees(): boolean {
  return useHasCapability('can_edit_employees')
}

export function useCanApproveIncidents(): boolean {
  return useHasCapability('can_approve_incidents')
}

export function useCanExportReports(): boolean {
  return useHasCapability('can_export_reports')
}

export function useCanManageUsers(): boolean {
  return useHasCapability('can_manage_users')
}

export function useCanViewLegislation(): boolean {
  return useHasCapability('can_view_legislation')
}

export function useCanManageEquipment(): boolean {
  return useHasCapability('can_manage_equipment')
}
