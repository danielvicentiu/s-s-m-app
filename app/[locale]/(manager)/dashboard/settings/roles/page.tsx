// app/[locale]/dashboard/settings/roles/page.tsx
// Dashboard Settings: Vizualizare Roluri și Permisiuni (read-only)
// Acces: consultant_ssm, firma_admin

import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';
import { getMyRoles, hasRole } from '@/lib/rbac';
import { RolesViewerClient } from './RolesViewerClient';

export default async function DashboardRolesPage() {
  // Check if user has access
  const myRoles = await getMyRoles();
  if (myRoles.length === 0) {
    redirect('/unauthorized');
  }

  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Get user's organization(s)
  const { data: memberships } = await supabase
    .from('memberships')
    .select('organization_id, role')
    .eq('user_id', user.id)
    .eq('is_active', true);

  if (!memberships || memberships.length === 0) {
    redirect('/unauthorized');
  }

  const orgId = memberships[0].organization_id;

  // Get organization's country_code
  const { data: org } = await supabase
    .from('organizations')
    .select('country_code, name')
    .eq('id', orgId)
    .single();

  // Fetch roles relevant to this organization
  let rolesQuery = supabase
    .from('roles')
    .select(`
      id,
      role_key,
      role_name,
      description,
      country_code,
      is_system,
      is_active,
      created_at
    `)
    .eq('is_active', true)
    .order('role_name', { ascending: true });

  // Filter by country_code if org has one
  if (org?.country_code) {
    rolesQuery = rolesQuery.or(`country_code.eq.${org.country_code},country_code.is.null`);
  }

  const { data: roles, error: rolesError } = await rolesQuery;

  if (rolesError) {
    console.error('Error fetching roles:', rolesError);
  }

  // Fetch permissions for these roles
  const roleIds = (roles || []).map((r: any) => r.id);
  const { data: permissions, error: permissionsError } = await supabase
    .from('permissions')
    .select('id, role_id, resource, action')
    .in('role_id', roleIds)
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
      <RolesViewerClient
        roles={rolesWithPermissions}
        organizationName={org?.name || 'Organizația mea'}
        userRoles={myRoles}
      />
    </div>
  );
}
