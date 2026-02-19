// app/onboarding/page.tsx
// Server Component — verifică auth și pasează user info către client

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { hasRole } from '@/lib/rbac'
import OnboardingClient from './OnboardingClient'

export default async function OnboardingPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Check if user is consultant (server-side)
  const isConsultant = await hasRole('consultant_ssm')

  return (
    <OnboardingClient
      user={{ id: user.id, email: user.email || '' }}
      isConsultant={isConsultant}
    />
  )
}
