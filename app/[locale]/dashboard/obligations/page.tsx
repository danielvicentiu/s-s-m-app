// app/[locale]/dashboard/obligations/page.tsx
// Pagină Obligații Legale — Lista obligațiilor pentru organizație
// Pattern identic cu /dashboard/medical și /dashboard/equipment

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ObligationsClient from './ObligationsClient'

export default async function ObligationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch organizații cu country_code
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui, country_code')
    .order('name')

  const orgIds = (organizations || []).map(o => o.id)
  const countryCodes = [...new Set(
    (organizations || [])
      .map((o: any) => o.country_code || 'RO')
  )]

  // Fetch tipuri de obligații pentru țările relevante
  const { data: obligationTypes } = await supabase
    .from('obligation_types')
    .select('*')
    .in('country_code', countryCodes)
    .eq('is_active', true)
    .order('country_code', { ascending: true })
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  // Fetch obligațiile organizațiilor (dacă există tabel organization_obligations)
  // Pentru MVP, vom folosi doar obligation_types și le vom mapa manual
  // În viitor, se poate adăuga tabel organization_obligations cu tracking status

  // Fetch profiles pentru dropdown responsabili
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .order('full_name')

  // Calculăm statistici de conformitate
  // Pentru MVP, vom folosi date mock bazate pe obligation_types
  const stats = {
    total: obligationTypes?.length || 0,
    fulfilled: 0,
    in_progress: 0,
    not_fulfilled: obligationTypes?.length || 0,
  }

  return (
    <ObligationsClient
      user={{ id: user.id, email: user.email || '' }}
      organizations={organizations || []}
      obligationTypes={obligationTypes || []}
      profiles={profiles || []}
      stats={stats}
    />
  )
}
