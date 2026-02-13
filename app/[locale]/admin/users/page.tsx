// app/[locale]/admin/users/page.tsx
// Pagina Admin: Listă utilizatori (doar pentru super admin)
// Pattern: server component → client component (DataTable)

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UsersClient from './UsersClient'

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServer()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Verifică dacă user este super admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_super_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_super_admin) {
    redirect('/dashboard')
  }

  // Fetch toate profilurile cu membership activ
  const { data: profiles } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      phone,
      avatar_url,
      is_super_admin,
      is_blocked,
      created_at
    `)
    .order('created_at', { ascending: false })

  // Fetch memberships separat
  const { data: memberships } = await supabase
    .from('memberships')
    .select(`
      user_id,
      role,
      is_active,
      organization:organizations (
        id,
        name
      )
    `)

  // Combinăm datele
  const usersWithMemberships = (profiles || []).map(profile => {
    const userMemberships = (memberships || [])
      .filter((m: any) => m.user_id === profile.id)
      .map((m: any) => ({
        role: m.role,
        is_active: m.is_active,
        organization: Array.isArray(m.organization) ? m.organization[0] : m.organization
      }))

    return {
      ...profile,
      memberships: userMemberships
    }
  })

  // Fetch auth data pentru fiecare user
  const usersWithAuth = await Promise.all(
    usersWithMemberships.map(async (profile) => {
      const { data: authData } = await supabase.auth.admin.getUserById(profile.id)
      return {
        ...profile,
        email: authData?.user?.email || '',
        last_sign_in_at: authData?.user?.last_sign_in_at || null,
      }
    })
  )

  return <UsersClient users={usersWithAuth} />
}
