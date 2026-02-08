import { createSupabaseServer } from '@/lib/supabase/server';
import { cache } from 'react';

// ── Tipuri ──
export type RoleKey =
  | 'super_admin' | 'consultant_ssm' | 'firma_admin' | 'angajat'
  | 'partener_contabil' | 'furnizor_psi' | 'furnizor_iscir'
  | 'medic_mm' | 'auditor_extern' | 'inspector_itm' | 'inspector_igsu'
  | 'inspector_anspdcp' | 'lucrator_desemnat' | 'white_label_stm'
  | 'responsabil_ssm_intern' | 'training_provider' | 'responsabil_nis2'
  | 'zbut_consultant_bg' | 'inspector_git_bg' | 'stm_partner_bg'
  | 'munkavedelmi_hu' | 'inspector_ommf_hu'
  | 'sicherheitsingenieur_de' | 'betriebsarzt_de' | 'berufsgenossenschaft_de'
  | 'specjalista_bhp_pl' | 'inspector_pip_pl'
  | string;  // extensibil pentru roluri viitoare

export type Resource =
  | 'organizations' | 'employees' | 'locations' | 'equipment'
  | 'medical' | 'trainings' | 'documents' | 'alerts'
  | 'dashboard' | 'reports' | 'fraud' | 'jurisdictions'
  | 'roles_admin' | 'reges' | 'memberships' | 'profiles'
  | 'notifications' | 'penalties' | 'audit_log'
  | string;

export type Action = 'create' | 'read' | 'update' | 'delete' | 'export' | 'delegate';

export interface UserRole {
  role_key: RoleKey;
  role_name: string;
  company_id: string | null;
  location_id: string | null;
  expires_at: string | null;
  is_active: boolean;
  country_code: string | null;
}

export interface Permission {
  resource: Resource;
  action: Action;
  field_restrictions: Record<string, string>;
  conditions: Record<string, any>;
}

// ── Funcții server-side (React cache per request) ──

// Returnează rolurile active ale userului curent
export const getMyRoles = cache(async (): Promise<UserRole[]> => {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
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

  if (error || !data) {
    // FALLBACK pe memberships
    const { data: memberships } = await supabase
      .from('memberships')
      .select('role, organization_id, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (!memberships) return [];

    return memberships.map(m => ({
      role_key: m.role === 'consultant' ? 'consultant_ssm' : m.role as RoleKey,
      role_name: m.role,
      company_id: m.organization_id,
      location_id: null,
      expires_at: null,
      is_active: true,
      country_code: null,
    }));
  }

  return data
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
});

// Verifică dacă userul are un rol specific
export const hasRole = cache(async (roleKey: RoleKey): Promise<boolean> => {
  const roles = await getMyRoles();
  return roles.some(r => r.role_key === roleKey);
});

// Verifică dacă userul e super admin
export const isSuperAdmin = cache(async (): Promise<boolean> => {
  return hasRole('super_admin');
});

// Verifică permisiune granulară (resource × action)
export const hasPermission = cache(async (resource: Resource, action: Action): Promise<boolean> => {
  if (await isSuperAdmin()) return true;

  const supabase = await createSupabaseServer();
  const roles = await getMyRoles();
  const roleKeys = roles.map(r => r.role_key);

  const { data } = await supabase
    .from('permissions')
    .select('id, role_id, roles!inner(role_key)')
    .eq('resource', resource)
    .eq('action', action)
    .eq('is_active', true)
    .in('roles.role_key', roleKeys);

  return (data?.length ?? 0) > 0;
});

// Returnează field_restrictions pentru un resource
export const getFieldRestrictions = cache(async (resource: Resource): Promise<Record<string, string>> => {
  if (await isSuperAdmin()) return {};

  const supabase = await createSupabaseServer();
  const roles = await getMyRoles();
  const roleKeys = roles.map(r => r.role_key);

  const { data } = await supabase
    .from('permissions')
    .select('field_restrictions, roles!inner(role_key)')
    .eq('resource', resource)
    .eq('is_active', true)
    .in('roles.role_key', roleKeys);

  // Merge restrictions — cel mai permisiv câștigă
  const merged: Record<string, string> = {};
  data?.forEach(d => {
    const fr = d.field_restrictions as Record<string, string>;
    Object.entries(fr).forEach(([field, level]) => {
      if (!merged[field] || level === 'visible') {
        merged[field] = level;
      }
    });
  });

  return merged;
});

// Returnează organizațiile accesibile
export const getMyOrgIds = cache(async (): Promise<string[]> => {
  const roles = await getMyRoles();
  if (roles.some(r => r.role_key === 'super_admin')) {
    const supabase = await createSupabaseServer();
    const { data } = await supabase.from('organizations').select('id');
    return data?.map(o => o.id) ?? [];
  }
  return [...new Set(roles.map(r => r.company_id).filter(Boolean) as string[])];
});
