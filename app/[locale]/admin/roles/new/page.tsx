// app/admin/roles/new/page.tsx
// Admin UI: Creare rol nou RBAC
// Acces: DOAR super_admin

import { redirect } from 'next/navigation'
import { isSuperAdmin } from '@/lib/rbac'
import NewRoleForm from './NewRoleForm'

export default async function NewRolePage() {
  // GUARD: Verificare super_admin (server-side)
  const admin = await isSuperAdmin()
  if (!admin) {redirect('/unauthorized')}

  return <NewRoleForm />
}
