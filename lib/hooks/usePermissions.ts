'use client';

import { useEffect, useState, useCallback } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import type { RoleKey, Resource, Action, UserRole } from '@/lib/rbac';

/**
 * Hook client-side pentru verificare permisiuni RBAC
 *
 * Metodă:
 * 1. canCreate(resource) — verifică permisiunea CREATE pe resursa specificată
 * 2. canRead(resource) — verifică permisiunea READ pe resursa specificată
 * 3. canUpdate(resource) — verifică permisiunea UPDATE pe resursa specificată
 * 4. canDelete(resource) — verifică permisiunea DELETE pe resursa specificată
 * 5. canExport(resource) — verifică permisiunea EXPORT pe resursa specificată
 * 6. hasRole(roleKey) — verifică dacă userul are rolul specificat
 *
 * Toate funcțiile returnează Promise<boolean>
 *
 * @example
 * ```tsx
 * const { canCreate, hasRole, loading } = usePermissions();
 *
 * const canAddEmployee = await canCreate('employees');
 * const isAdmin = await hasRole('super_admin');
 * ```
 */

export interface UsePermissionsReturn {
  canCreate: (resource: Resource) => Promise<boolean>;
  canRead: (resource: Resource) => Promise<boolean>;
  canUpdate: (resource: Resource) => Promise<boolean>;
  canDelete: (resource: Resource) => Promise<boolean>;
  canExport: (resource: Resource) => Promise<boolean>;
  hasRole: (roleKey: RoleKey) => Promise<boolean>;
  isSuperAdmin: () => Promise<boolean>;
  roles: UserRole[];
  loading: boolean;
  refreshPermissions: () => Promise<void>;
}

export function usePermissions(): UsePermissionsReturn {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowser();

  // Încarcă rolurile userului curent
  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setRoles([]);
        return;
      }

      // Încarcă rolurile din user_roles cu join pe roles
      const { data: userRolesData, error } = await supabase
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
        .eq('roles.is_active', true);

      if (error || !userRolesData || userRolesData.length === 0) {
        // FALLBACK: verifică memberships pentru backwards compatibility
        const { data: memberships } = await supabase
          .from('memberships')
          .select('role, organization_id, is_active')
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (memberships && memberships.length > 0) {
          const fallbackRoles = memberships.map(m => ({
            role_key: m.role === 'consultant' ? 'consultant_ssm' : (m.role as RoleKey),
            role_name: m.role,
            company_id: m.organization_id,
            location_id: null,
            expires_at: null,
            is_active: true,
            country_code: null,
          }));
          setRoles(fallbackRoles);
          return;
        }

        setRoles([]);
        return;
      }

      // Filtrare roluri expirate și mapare la UserRole
      const activeRoles = userRolesData
        .filter(d => !d.expires_at || new Date(d.expires_at) > new Date())
        .map(d => ({
          role_key: (d.roles as any).role_key,
          role_name: (d.roles as any).role_name,
          company_id: d.company_id,
          location_id: d.location_id,
          expires_at: d.expires_at,
          is_active: d.is_active,
          country_code: (d.roles as any).country_code,
        }));

      setRoles(activeRoles);
    } catch (error) {
      console.error('Error loading user roles:', error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Încarcă rolurile la mount
  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  // Verifică dacă userul are un rol specific
  const hasRole = useCallback(async (roleKey: RoleKey): Promise<boolean> => {
    return roles.some(r => r.role_key === roleKey);
  }, [roles]);

  // Verifică dacă userul e super admin
  const isSuperAdmin = useCallback(async (): Promise<boolean> => {
    return hasRole('super_admin');
  }, [hasRole]);

  // Verifică permisiune granulară (resource × action)
  const checkPermission = useCallback(async (resource: Resource, action: Action): Promise<boolean> => {
    // Super admin are acces la tot
    if (await isSuperAdmin()) {
      return true;
    }

    if (roles.length === 0) {
      return false;
    }

    const roleKeys = roles.map(r => r.role_key);

    // Query permissions table pentru verificare
    const { data, error } = await supabase
      .from('permissions')
      .select('id, role_id, roles!inner(role_key)')
      .eq('resource', resource)
      .eq('action', action)
      .eq('is_active', true)
      .in('roles.role_key', roleKeys);

    if (error) {
      console.error(`Error checking permission for ${resource}.${action}:`, error);
      return false;
    }

    return (data?.length ?? 0) > 0;
  }, [roles, supabase, isSuperAdmin]);

  // Helper functions pentru acțiuni specifice
  const canCreate = useCallback(async (resource: Resource): Promise<boolean> => {
    return checkPermission(resource, 'create');
  }, [checkPermission]);

  const canRead = useCallback(async (resource: Resource): Promise<boolean> => {
    return checkPermission(resource, 'read');
  }, [checkPermission]);

  const canUpdate = useCallback(async (resource: Resource): Promise<boolean> => {
    return checkPermission(resource, 'update');
  }, [checkPermission]);

  const canDelete = useCallback(async (resource: Resource): Promise<boolean> => {
    return checkPermission(resource, 'delete');
  }, [checkPermission]);

  const canExport = useCallback(async (resource: Resource): Promise<boolean> => {
    return checkPermission(resource, 'export');
  }, [checkPermission]);

  // Refresh permissions manual
  const refreshPermissions = useCallback(async () => {
    await loadRoles();
  }, [loadRoles]);

  return {
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canExport,
    hasRole,
    isSuperAdmin,
    roles,
    loading,
    refreshPermissions,
  };
}
