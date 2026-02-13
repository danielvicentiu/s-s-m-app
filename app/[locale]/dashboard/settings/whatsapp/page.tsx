// app/[locale]/dashboard/settings/whatsapp/page.tsx
// Configurare notificări WhatsApp — verificare număr, preferințe, GDPR
// Server component — fetch date utilizator și preferințe

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WhatsAppSettingsClient from './WhatsAppSettingsClient'

export default async function WhatsAppSettingsPage() {
  const supabase = await createSupabaseServer()

  // Verifică user autentificat
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (!user || authError) {
    redirect('/login')
  }

  // Fetch profil utilizator (include phone dacă există)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch preferințe notificări WhatsApp
  const { data: prefsRows } = await supabase
    .from('user_preferences')
    .select('key, value')
    .eq('user_id', user.id)
    .in('key', [
      'whatsapp_phone',
      'whatsapp_verified',
      'whatsapp_notifications',
      'whatsapp_language',
      'whatsapp_opt_in'
    ])

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
    <WhatsAppSettingsClient
      userId={user.id}
      userEmail={user.email || ''}
      profile={profile}
      preferences={preferences}
    />
  )
}
