// app/onboarding/page.tsx
// Server Component — verifică auth și pasează user info către client

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OnboardingClient from './OnboardingClient'

export default async function OnboardingPage() {
  const supabase = await createSupabaseServer()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return <OnboardingClient user={{ id: user.id, email: user.email || '' }} />
}
