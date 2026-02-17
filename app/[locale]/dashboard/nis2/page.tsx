// app/[locale]/dashboard/nis2/page.tsx
// NIS2 Cybersecurity Compliance Module — Server Component
// Created: 2026-02-17

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NIS2Client from './NIS2Client'
import ModuleGate from '@/components/ModuleGate'

interface NIS2PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ org?: string }>
}

export default async function NIS2Page({ params, searchParams }: NIS2PageProps) {
  const { locale } = await params
  const { org: selectedOrgId } = await searchParams
  const supabase = await createSupabaseServer()
  const { user } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch organizations
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui')
    .order('name')

  const orgId = selectedOrgId || organizations?.[0]?.id || null

  return (
    <ModuleGate orgId={orgId} moduleKey="nis2" locale={locale}>
      <NIS2Client
        user={{ id: user.id, email: user.email || '' }}
        organizations={organizations || []}
        initialSelectedOrg={selectedOrgId || organizations?.[0]?.id || ''}
      />
    </ModuleGate>
  )
}
