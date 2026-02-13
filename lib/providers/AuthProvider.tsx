'use client';

import { useState, useEffect, ReactNode } from 'react';
import { AuthContext, AuthContextValue } from '@/lib/contexts/AuthContext';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { UserRole } from '@/lib/rbac';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [orgId, setOrgId] = useState<string | null>(null);

  const supabase = createSupabaseBrowser();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setRoles([]);
        setPermissions([]);
        setOrgId(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Load user roles from user_roles table
      const { data: userRolesData, error: rolesError } = await supabase
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
        .eq('user_id', userId)
        .eq('is_active', true)
        .eq('roles.is_active', true);

      let userRoles: UserRole[] = [];

      if (rolesError || !userRolesData || userRolesData.length === 0) {
        // FALLBACK: Load from memberships table
        const { data: membershipsData } = await supabase
          .from('memberships')
          .select('role, organization_id, is_active')
          .eq('user_id', userId)
          .eq('is_active', true);

        if (membershipsData && membershipsData.length > 0) {
          userRoles = membershipsData.map((m: any) => ({
            role_key: m.role === 'consultant' ? 'consultant_ssm' : m.role,
            role_name: m.role,
            company_id: m.organization_id,
            location_id: null,
            expires_at: null,
            is_active: true,
            country_code: null,
          }));
        }
      } else {
        userRoles = userRolesData
          .filter((d: any) => !d.expires_at || new Date(d.expires_at) > new Date())
          .map((d: any) => ({
            role_key: d.roles.role_key,
            role_name: d.roles.role_name,
            company_id: d.company_id,
            location_id: d.location_id,
            expires_at: d.expires_at,
            is_active: d.is_active,
            country_code: d.roles.country_code,
          }));
      }

      setRoles(userRoles);

      // Set primary role and orgId
      const primaryRole = userRoles[0];
      if (primaryRole) {
        setOrgId(primaryRole.company_id);
      }

      // Load permissions for the user's roles
      if (userRoles.length > 0) {
        const roleKeys = userRoles.map((r) => r.role_key);
        const { data: permissionsData } = await supabase
          .from('permissions')
          .select('resource, action, roles!inner(role_key)')
          .eq('is_active', true)
          .in('roles.role_key', roleKeys);

        if (permissionsData) {
          const permList = permissionsData.map(
            (p: any) => `${p.resource}:${p.action}`
          );
          setPermissions([...new Set(permList)]);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextValue = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    role: roles[0]?.role_key ?? null,
    permissions,
    orgId,
    roles,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
