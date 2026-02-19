// app/[locale]/otp/page.tsx
// OTP verification screen — server wrapper
// Fetches user phone from profile and passes to client

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OTPClient from './OTPClient'

export const metadata = {
  title: 'Verificare OTP | s-s-m.ro',
  description: 'Verificare identitate prin cod OTP',
}

export default async function OTPPage() {
  const supabase = await createSupabaseServer()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Attempt to get phone from profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('phone')
    .eq('id', user.id)
    .maybeSingle()

  const phone: string = profile?.phone || ''

  // Mask phone: +40 7** *** **3  → show first 4 and last 2 chars
  function maskPhone(p: string): string {
    if (!p || p.length < 6) return p || '—'
    return `${p.slice(0, 4)}${'*'.repeat(Math.max(0, p.length - 6))}${p.slice(-2)}`
  }

  return (
    <OTPClient
      maskedPhone={maskPhone(phone)}
      rawPhone={phone}
      userEmail={user.email || ''}
    />
  )
}
