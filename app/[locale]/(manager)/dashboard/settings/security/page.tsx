// app/[locale]/(manager)/dashboard/settings/security/page.tsx
// Security settings server page — TOTP setup, trusted devices, OTP preferences

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SecurityClient from './SecurityClient'

export const metadata = {
  title: 'Securitate Autentificare | s-s-m.ro',
  description: 'Autentificare cu doi factori și dispozitive de încredere',
}

export default async function SecurityPage() {
  const supabase = await createSupabaseServer()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (!user || authError) {
    redirect('/login')
  }

  // Check if TOTP is already configured and active
  const { data: totpRow } = await supabase
    .from('totp_secrets')
    .select('is_active, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Fetch trusted devices
  const { data: devices } = await supabase
    .from('trusted_devices')
    .select('id, device_name, trusted_until, created_at, last_seen_at')
    .eq('user_id', user.id)
    .order('last_seen_at', { ascending: false })

  return (
    <SecurityClient
      userEmail={user.email || ''}
      totpEnabled={totpRow?.is_active ?? false}
      trustedDevices={devices || []}
    />
  )
}
