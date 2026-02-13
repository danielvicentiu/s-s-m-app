// app/[locale]/dashboard/settings/notifications/page.tsx
// Pagină preferințe notificări — server component pentru fetch date

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NotificationsClient from './NotificationsClient'

export default async function NotificationsPage() {
  const supabase = await createSupabaseServer()

  // Verifică user autentificat
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (!user || authError) {
    redirect('/login')
  }

  // Fetch preferințe notificări per tip
  const { data: preferences } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', user.id)
    .order('notification_type')

  return (
    <NotificationsClient
      user={user}
      preferences={preferences || []}
    />
  )
}
