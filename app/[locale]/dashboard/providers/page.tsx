// app/[locale]/dashboard/providers/page.tsx
// Furnizori servicii externe — Pagina dedicată CRUD
// Furnizori: firma SSM, clinica medicina muncii, firma PSI, ISCIR, firma verificare

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProvidersClient from './ProvidersClient'

export default async function ProvidersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch organizații
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui')

  // Fetch furnizori cu organizații
  const { data: providers } = await supabase
    .from('providers')
    .select('*, organizations(name, cui)')
    .order('contract_end_date', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true })

  return (
    <ProvidersClient
      user={{ email: user.email || '' }}
      organizations={organizations || []}
      providers={providers || []}
    />
  )
}
