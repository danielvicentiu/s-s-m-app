// app/[locale]/dashboard/gdpr/page.tsx
// GDPR Module — Registru prelucrări date personale, consimțăminte, DPO
// Created: 2026-02-17

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GDPRClient from './GDPRClient'
import ModuleGate from '@/components/ModuleGate'

interface GDPRPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ org?: string }>
}

export default async function GDPRPage({ params, searchParams }: GDPRPageProps) {
  const { locale } = await params
  const { org: selectedOrgId } = await searchParams
  const supabase = await createSupabaseServer()
  const { user } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch organizations pentru filtru
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui')
    .order('name')

  const orgId = organizations?.[0]?.id || null

  return (
    <ModuleGate orgId={orgId} moduleKey="gdpr" locale={locale}>
      <GDPRClient
        user={{ id: user.id, email: user.email || '' }}
        organizations={organizations || []}
        selectedOrgId={selectedOrgId}
      />
    </ModuleGate>
  )
}
