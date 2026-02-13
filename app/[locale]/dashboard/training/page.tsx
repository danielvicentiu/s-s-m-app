// app/[locale]/dashboard/training/page.tsx
// Training Sessions List — Server Component with multi-org support
// 🆕 OP-LEGO Sprint 4.7: ModuleGate wrapping (modulul 'ssm' necesar)

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TrainingSessionsClient from './TrainingSessionsClient'
import ModuleGate from '@/components/ModuleGate'

export default async function TrainingSessionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
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

  // Fetch training modules for dropdowns
  const { data: modules } = await supabase
    .from('training_modules')
    .select('id, code, title, category, training_type, duration_minutes_required')
    .eq('is_active', true)
    .order('code')

  // Fetch training sessions with joins
  const { data: sessions } = await supabase
    .from('training_sessions')
    .select(`
      *,
      training_modules(code, title, category, training_type),
      profiles!training_sessions_worker_id_fkey(full_name),
      organizations(name)
    `)
    .order('session_date', { ascending: false })

  // Fetch workers for the "Programează instruire" form
  const { data: workers } = await supabase
    .from('memberships')
    .select(`
      user_id,
      profiles!inner(full_name)
    `)
    .eq('is_active', true)

  // OP-LEGO: orgId pentru ModuleGate
  const orgId = savedSelectedOrg || organizations[0]?.id || null

  return (
    <ModuleGate orgId={orgId} moduleKey="ssm" locale={locale}>
      <TrainingSessionsClient
        user={{ id: user.id, email: user.email || '' }}
        organizations={organizations}
        initialSelectedOrg={savedSelectedOrg}
        sessions={sessions || []}
        modules={modules || []}
        workers={workers || []}
      />
    </ModuleGate>
  )
}
