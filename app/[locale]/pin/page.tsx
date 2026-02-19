// app/[locale]/pin/page.tsx
// PIN lock screen — requires auth session, bypasses PIN itself

import { createSupabaseServer } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import PinClient from './PinClient'

export const metadata = {
  title: 'Verificare PIN | s-s-m.ro',
  description: 'Introduceți PIN-ul pentru acces rapid',
}

export default async function PinPage() {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // If already PIN-verified in this session, skip to dashboard
  const cookieStore = await cookies()
  const pinVerified = cookieStore.get('pin_verified')?.value
  if (pinVerified === 'true') {
    redirect('/dashboard')
  }

  return <PinClient email={user.email!} />
}
