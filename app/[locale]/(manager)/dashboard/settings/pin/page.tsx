// app/[locale]/(manager)/dashboard/settings/pin/page.tsx
// PIN Settings — server component, checks if user already has PIN configured

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PinSettingsClient from './PinSettingsClient'

export const metadata = {
  title: 'Securitate PIN | s-s-m.ro',
  description: 'Configurare PIN rapid pentru autentificare',
}

export default async function PinSettingsPage() {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user || authError) {
    redirect('/login')
  }

  // Check if user already has a PIN configured
  const { data: pinRecord } = await supabase
    .from('user_pin_auth')
    .select('pin_hash')
    .eq('email', user.email!.toLowerCase().trim())
    .maybeSingle()

  const hasPin = !!pinRecord?.pin_hash

  return <PinSettingsClient hasPin={hasPin} />
}
