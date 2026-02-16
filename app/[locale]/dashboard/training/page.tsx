// app/dashboard/training/page.tsx
// Server Component — Training Management with proper multi-org support
// 🆕 OP-LEGO Sprint 4.7: ModuleGate wrapping (modulul 'ssm' necesar)

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TrainingClient from './TrainingClient'
import ModuleGate from '@/components/ModuleGate'

interface TrainingPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ org?: string }>
}

export default async function TrainingPage({ params, searchParams }: TrainingPageProps) {
  const { locale } = await params
  const { org: urlOrgParam } = await searchParams
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

  // Priority: URL param > DB preference > first org
  if (urlOrgParam && (urlOrgParam === 'all' || organizations.some((o: any) => o.id === urlOrgParam))) {
    savedSelectedOrg = urlOrgParam
  } else if (prefsRows) {
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

  // OP-LEGO: orgId pentru ModuleGate
  const orgId = savedSelectedOrg || organizations[0]?.id || null

  return (
    <ModuleGate orgId={orgId} moduleKey="ssm" locale={locale}>
      <TrainingClient
        user={{ id: user.id, email: user.email || '' }}
        organizations={organizations}
        initialSelectedOrg={savedSelectedOrg}
      />
    </ModuleGate>
  )
}
