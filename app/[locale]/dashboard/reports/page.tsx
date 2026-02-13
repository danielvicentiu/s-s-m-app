// app/dashboard/reports/page.tsx
// Pagină Rapoarte — Server component cu fetch organizații
// Pattern identic cu alte pagini dashboard

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ReportsClient from './ReportsClient'

export default async function ReportsPage() {
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch organizații accesibile
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui')
    .order('name', { ascending: true })

  return (
    <ReportsClient
      user={{ id: user.id, email: user.email || '' }}
      organizations={organizations || []}
    />
  )
}
