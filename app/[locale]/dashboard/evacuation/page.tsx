// app/[locale]/dashboard/evacuation/page.tsx
// Pagină exerciții de evacuare
// Programare exerciții, rapoarte, countdown până la următorul exercițiu

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EvacuationClient from './EvacuationClient'
import ModuleGate from '@/components/ModuleGate'

export default async function EvacuationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch evacuation drills cu join pe organizations
  const { data: drills, error } = await supabase
    .from('evacuation_drills')
    .select(`
      *,
      organizations(name, cui),
      organizer:profiles!evacuation_drills_organized_by_fkey(full_name)
    `)
    .order('scheduled_date', { ascending: false })

  // Fetch organizations pentru dropdown
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui')
    .order('name')

  // OP-LEGO: orgId pentru ModuleGate (modul psi - evacuare face parte din PSI)
  const orgId = organizations?.[0]?.id || null

  return (
    <ModuleGate orgId={orgId} moduleKey="psi" locale={locale}>
      <EvacuationClient
        user={{ id: user.id, email: user.email || '' }}
        drills={drills || []}
        organizations={organizations || []}
      />
    </ModuleGate>
  )
}
