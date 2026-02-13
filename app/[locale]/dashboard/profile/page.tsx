// app/[locale]/dashboard/profile/page.tsx
// Pagina profil utilizator — avatar, date personale, preferințe
// Server component — fetch date profil

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileClient from './ProfileClient'

export default async function ProfilePage() {
  const supabase = await createSupabaseServer()

  // Verifică user autentificat
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (!user || authError) {
    redirect('/login')
  }

  // Fetch profil din tabela profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch preferințe user din user_preferences
  const { data: prefsRows } = await supabase
    .from('user_preferences')
    .select('key, value')
    .eq('user_id', user.id)

  const preferences: Record<string, any> = {}
  if (prefsRows) {
    for (const row of prefsRows) {
      try {
        preferences[row.key] = JSON.parse(row.value)
      } catch {
        preferences[row.key] = row.value
      }
    }
  }

  return (
    <ProfileClient
      user={user}
      profile={profile}
      preferences={preferences}
    />
  )
}
