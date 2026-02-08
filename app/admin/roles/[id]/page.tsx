// app/admin/roles/[id]/page.tsx
// Admin UI: Editare rol + matrice permisiuni
// Acces: DOAR super_admin

import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import { isSuperAdmin } from '@/lib/rbac'
import EditRoleForm from './EditRoleForm'

interface Props {
  params: { id: string }
}

export default async function EditRolePage({ params }: Props) {
  // GUARD: Verificare super_admin (server-side)
  const admin = await isSuperAdmin()
  if (!admin) redirect('/unauthorized')

  const supabase = await createSupabaseServer()

  // Fetch rol cu permisiuni
  const { data: role, error } = await supabase
    .from('roles')
    .select(`
      *,
      permissions (
        id,
        resource,
        action,
        field_restrictions,
        conditions,
        is_active
      )
    `)
    .eq('id', params.id)
    .single()

  if (error || !role) {
    redirect('/admin/roles')
  }

  return <EditRoleForm role={role} />
}
