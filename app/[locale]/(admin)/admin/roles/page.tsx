// app/[locale]/admin/roles/page.tsx
// Admin UI: Permissions Matrix Editor - Full RBAC management
// Acces: DOAR super_admin

import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';
import { isSuperAdmin } from '@/lib/rbac';
import { RolesManagementClient } from './RolesManagementClient';

export default async function AdminRolesPage() {
  // GUARD: Verificare super_admin (server-side)
  const admin = await isSuperAdmin();
  if (!admin) redirect('/unauthorized');

  const supabase = await createSupabaseServer();

  // Fetch toate rolurile cu permisiuni
  const { data: roles, error: rolesError } = await supabase
    .from('roles')
    .select(`
      id,
      role_key,
      role_name,
      description,
      country_code,
      is_system,
      is_active,
      metadata,
      created_at
    `)
    .order('is_system', { ascending: false })
    .order('role_name', { ascending: true });

  if (rolesError) {
    console.error('Error fetching roles:', rolesError);
  }

  // Fetch toate permisiunile
  const { data: permissions, error: permissionsError } = await supabase
    .from('permissions')
    .select('id, role_id, resource, action, is_active')
    .eq('is_active', true);

  if (permissionsError) {
    console.error('Error fetching permissions:', permissionsError);
  }

  // Map permissions to roles
  const rolesWithPermissions = (roles || []).map((role: any) => ({
    ...role,
    permissions: (permissions || [])
      .filter((p: any) => p.role_id === role.id)
      .map((p: any) => ({
        id: p.id,
        resource: p.resource,
        action: p.action,
      })),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <RolesManagementClient initialRoles={rolesWithPermissions} />
    </div>
  );
}
