// hooks/usePermission.ts
// Hook-uri React client-side pentru verificare permisiuni RBAC
// Folosește Supabase browser client cu useState + useEffect
// Toate hook-urile includ loading states și error handling

'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import type { UserRole, Resource, Action, RoleKey } from '@/lib/rbac'

// ── 1. useMyRoles() — fetch roluri user curent cu fallback pe memberships ──
export function useMyRoles() {
  const [roles, setRoles] = useState<UserRole[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchRoles() {
      try {
        setIsLoading(true)
        setError(null)

        const supabase = createSupabaseBrowser()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          if (mounted) {
            setRoles([])
            setIsLoading(false)
          }
          return
        }

        // 1. Încearcă user_roles
        const { data: userRoles, error: userRolesError } = await supabase
          .from('user_roles')
          .select(`
            role_id,
            company_id,
            location_id,
            expires_at,
            is_active,
            roles!inner (
              role_key,
              role_name,
              country_code,
              is_active
            )
          `)
          .eq('user_id', user.id)
          .eq('is_active', true)
          .eq('roles.is_active', true)

        if (!userRolesError && userRoles && userRoles.length > 0) {
          // Filtrează rolurile expirate și mapează la format UserRole
          const activeRoles = userRoles
            .filter(ur => !ur.expires_at || new Date(ur.expires_at) > new Date())
            .map(ur => ({
              role_key: (ur.roles as any).role_key,
              role_name: (ur.roles as any).role_name,
              company_id: ur.company_id,
              location_id: ur.location_id,
              expires_at: ur.expires_at,
              is_active: ur.is_active,
              country_code: (ur.roles as any).country_code,
            }))

          if (mounted) {
            setRoles(activeRoles)
            setIsLoading(false)
          }
          return
        }

        // 2. FALLBACK pe memberships
        const { data: memberships, error: membershipsError } = await supabase
          .from('memberships')
          .select('role, organization_id, is_active')
          .eq('user_id', user.id)
          .eq('is_active', true)

        if (membershipsError) throw membershipsError

        if (memberships && memberships.length > 0) {
          const fallbackRoles = memberships.map(m => ({
            role_key: (m.role === 'consultant' ? 'consultant_ssm' : m.role) as RoleKey,
            role_name: m.role,
            company_id: m.organization_id,
            location_id: null,
            expires_at: null,
            is_active: true,
            country_code: null,
          }))

          if (mounted) {
            setRoles(fallbackRoles)
            setIsLoading(false)
          }
          return
        }

        // Niciun rol găsit
        if (mounted) {
          setRoles([])
          setIsLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch roles'))
          setIsLoading(false)
        }
      }
    }

    fetchRoles()

    // Revalidare la fiecare 5 minute (300000ms)
    const interval = setInterval(fetchRoles, 300000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  return { roles, isLoading, error }
}

// ── 2. useHasRole() — verifică dacă user are un rol specific ──
export function useHasRole(roleKey: RoleKey): boolean {
  const { roles, isLoading } = useMyRoles()

  if (isLoading) return false
  return roles.some(r => r.role_key === roleKey)
}

// ── 3. useIsSuperAdmin() — verifică dacă user e super admin ──
export function useIsSuperAdmin(): boolean {
  return useHasRole('super_admin')
}

// ── 4. useHasPermission() — verifică permisiune granulară (resource × action) ──
export function useHasPermission(resource: Resource, action: Action): boolean {
  const { roles, isLoading } = useMyRoles()
  const [hasPermission, setHasPermission] = useState(false)
  const [permissionsLoading, setPermissionsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function checkPermission() {
      if (isLoading) {
        setPermissionsLoading(true)
        return
      }

      try {
        // Super admin bypass
        if (roles.some(r => r.role_key === 'super_admin')) {
          if (mounted) {
            setHasPermission(true)
            setPermissionsLoading(false)
          }
          return
        }

        if (roles.length === 0) {
          if (mounted) {
            setHasPermission(false)
            setPermissionsLoading(false)
          }
          return
        }

        const supabase = createSupabaseBrowser()
        const roleKeys = roles.map(r => r.role_key)

        const { data, error } = await supabase
          .from('permissions')
          .select('id, role_id, roles!inner(role_key)')
          .eq('resource', resource)
          .eq('action', action)
          .eq('is_active', true)
          .in('roles.role_key', roleKeys)

        if (mounted) {
          setHasPermission(!error && (data?.length ?? 0) > 0)
          setPermissionsLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setHasPermission(false)
          setPermissionsLoading(false)
        }
      }
    }

    checkPermission()

    return () => {
      mounted = false
    }
  }, [roles, isLoading, resource, action])

  // Returnează false în timpul loading pentru siguranță
  if (permissionsLoading) return false
  return hasPermission
}

// ── 5. useFieldRestrictions() — returnează câmpuri mascate/ascunse ──
export function useFieldRestrictions(resource: Resource): Record<string, string> {
  const { roles, isLoading } = useMyRoles()
  const [restrictions, setRestrictions] = useState<Record<string, string>>({})

  useEffect(() => {
    let mounted = true

    async function fetchRestrictions() {
      if (isLoading) return

      try {
        // Super admin: fără restricții
        if (roles.some(r => r.role_key === 'super_admin')) {
          if (mounted) setRestrictions({})
          return
        }

        if (roles.length === 0) {
          if (mounted) setRestrictions({})
          return
        }

        const supabase = createSupabaseBrowser()
        const roleKeys = roles.map(r => r.role_key)

        const { data, error } = await supabase
          .from('permissions')
          .select('field_restrictions, roles!inner(role_key)')
          .eq('resource', resource)
          .eq('is_active', true)
          .in('roles.role_key', roleKeys)

        if (error || !data) {
          if (mounted) setRestrictions({})
          return
        }

        // Merge restrictions — cel mai permisiv câștigă
        const merged: Record<string, string> = {}
        data.forEach(d => {
          const fr = d.field_restrictions as Record<string, string>
          if (fr) {
            Object.entries(fr).forEach(([field, level]) => {
              if (!merged[field] || level === 'visible') {
                merged[field] = level
              }
            })
          }
        })

        if (mounted) setRestrictions(merged)
      } catch (err) {
        if (mounted) setRestrictions({})
      }
    }

    fetchRestrictions()

    return () => {
      mounted = false
    }
  }, [roles, isLoading, resource])

  return restrictions
}

// ── Hook-uri helper suplimentare ──

// Verifică dacă un câmp specific este mascat
export function useIsFieldMasked(resource: Resource, fieldName: string): boolean {
  const restrictions = useFieldRestrictions(resource)
  return restrictions[fieldName] === 'masked'
}

// Verifică dacă un câmp specific este ascuns
export function useIsFieldHidden(resource: Resource, fieldName: string): boolean {
  const restrictions = useFieldRestrictions(resource)
  return restrictions[fieldName] === 'hidden'
}

// Verifică dacă un câmp specific este vizibil (nu are restricții sau e setat la 'visible')
export function useIsFieldVisible(resource: Resource, fieldName: string): boolean {
  const restrictions = useFieldRestrictions(resource)
  return !restrictions[fieldName] || restrictions[fieldName] === 'visible'
}

// Hook pentru a obține organizațiile accesibile
export function useMyOrgIds(): string[] {
  const { roles, isLoading } = useMyRoles()
  const [orgIds, setOrgIds] = useState<string[]>([])

  useEffect(() => {
    let mounted = true

    async function fetchOrgIds() {
      if (isLoading) return

      try {
        // Super admin: toate organizațiile
        if (roles.some(r => r.role_key === 'super_admin')) {
          const supabase = createSupabaseBrowser()
          const { data } = await supabase.from('organizations').select('id')

          if (mounted && data) {
            setOrgIds(data.map(o => o.id))
          }
          return
        }

        // Alte roluri: doar company_id-urile din roluri
        const companyIds = [...new Set(roles.map(r => r.company_id).filter(Boolean) as string[])]
        if (mounted) setOrgIds(companyIds)
      } catch (err) {
        if (mounted) setOrgIds([])
      }
    }

    fetchOrgIds()

    return () => {
      mounted = false
    }
  }, [roles, isLoading])

  return orgIds
}

// Hook pentru a obține rolul principal (pentru rutare)
export function usePrimaryRole(): RoleKey | null {
  const { roles, isLoading } = useMyRoles()

  if (isLoading || roles.length === 0) return null

  // Prioritate: super_admin > consultant > firma_admin > angajat > restul
  const priority: RoleKey[] = ['super_admin', 'consultant_ssm', 'firma_admin', 'angajat']
  for (const p of priority) {
    if (roles.some(r => r.role_key === p)) return p
  }

  return roles[0].role_key
}
