// app/dashboard/training/page.tsx
// Server Component — Training Management with proper multi-org support

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TrainingClient from './TrainingClient'

export default async function TrainingPage() {
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Extract organizations from memberships
  const organizations = (orgs || [])
    .map((m: any) => m.organization)
    .filter(Boolean)

  // If no organizations, redirect to onboarding
  if (organizations.length === 0) {
    redirect('/onboarding')
  }

  // Get user preferences for selected org
  const { data: prefsRows } = await supabase
    .from('user_preferences')
    .select('key, value')
    .eq('user_id', user.id)

  let savedSelectedOrg = organizations[0]?.id || ''
  if (prefsRows) {
    const selectedOrgPref = prefsRows.find((r: any) => r.key === 'selected_org')
    if (selectedOrgPref) {
      try {
        const parsed = JSON.parse(selectedOrgPref.value)
        if (parsed !== 'all' && organizations.some((o: any) => o.id === parsed)) {
          savedSelectedOrg = parsed
        }
      } catch {
        // Use default
      }
    }
  }

  return (
    <TrainingClient
      user={{ id: user.id, email: user.email || '' }}
      organizations={organizations}
      initialSelectedOrg={savedSelectedOrg}
    />
  )
}
