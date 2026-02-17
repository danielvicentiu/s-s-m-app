// app/[locale]/dashboard/near-miss/page.tsx
// Near-Miss Reporting — Pagină dedicată raportare incidente aproape-accidente SSM

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NearMissClient from './NearMissClient'
import ModuleGate from '@/components/ModuleGate'

interface NearMissPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ org?: string }>
}

export default async function NearMissPage({ params, searchParams }: NearMissPageProps) {
  const { locale } = await params
  const { org: selectedOrgId } = await searchParams
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch organizations pentru filtru
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui')
    .order('name')

  // Use first org or selected org
  const orgId = selectedOrgId || organizations?.[0]?.id || null

  return (
    <ModuleGate orgId={orgId} moduleKey="ssm" locale={locale}>
      <NearMissClient
        user={{ id: user.id, email: user.email || '' }}
        organizations={organizations || []}
        initialSelectedOrg={selectedOrgId || organizations?.[0]?.id || 'all'}
      />
    </ModuleGate>
  )
}
