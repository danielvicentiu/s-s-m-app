// app/admin/roles/assign/page.tsx
// Admin UI: Asignare roluri la utilizatori
// Acces: DOAR super_admin

import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import { isSuperAdmin } from '@/lib/rbac'
import AssignRoleForm from './AssignRoleForm'

export default async function AssignRolePage() {
  // GUARD: Verificare super_admin (server-side)
  const admin = await isSuperAdmin()
  if (!admin) redirect('/unauthorized')

  const supabase = await createSupabaseServer()

  // Fetch date necesare pentru formular
  const [rolesData, orgsData, profilesData, assignmentsData] = await Promise.all([
    supabase.from('roles').select('id, role_key, role_name, country_code').eq('is_active', true).order('role_name'),
    supabase.from('organizations').select('id, name, cui').order('name'),
    supabase.from('profiles').select('id, email, full_name').order('email'),
    supabase
      .from('user_roles')
      .select(`
        id,
        user_id,
        role_id,
        company_id,
        location_id,
        expires_at,
        is_active,
        granted_at,
        profiles!inner (email, full_name),
        roles!inner (role_name, role_key),
        organizations (name)
      `)
      .eq('is_active', true)
      .order('granted_at', { ascending: false })
      .limit(50),
  ])

  return (
    <AssignRoleForm
      roles={rolesData.data || []}
      organizations={orgsData.data || []}
      profiles={profilesData.data || []}
      assignments={assignmentsData.data || []}
    />
  )
}
