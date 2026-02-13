// app/[locale]/dashboard/first-aid/page.tsx
// Truse Prim Ajutor — Gestiune truse și conținut
// Pattern identic cu /dashboard/equipment și /dashboard/medical

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FirstAidClient from './FirstAidClient'
import ModuleGate from '@/components/ModuleGate'

export default async function FirstAidPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch truse prim ajutor cu join pe organizations
  const { data: kits } = await supabase
    .from('first_aid_kits')
    .select('*, organizations(name, cui)')
    .order('next_check_date', { ascending: true, nullsFirst: false })

  // Fetch organizations pentru filtru
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui')
    .order('name')

  // orgId pentru ModuleGate (folosim prima organizație sau null)
  const orgId = organizations?.[0]?.id || null

  return (
    <ModuleGate orgId={orgId} moduleKey="psi" locale={locale}>
      <FirstAidClient
        user={{ email: user.email || '' }}
        kits={kits || []}
        organizations={organizations || []}
      />
    </ModuleGate>
  )
}
