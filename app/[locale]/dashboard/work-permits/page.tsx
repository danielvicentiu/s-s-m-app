// app/[locale]/dashboard/work-permits/page.tsx
// Pagină permise de lucru (work permits) pentru lucrări periculoase
// Gestionare permise: lucru la înălțime, spații confinate, foc deschis, etc.

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WorkPermitsClient from './WorkPermitsClient'

export default async function WorkPermitsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch work permits cu join pe organizations și profiles
  const { data: workPermits, error } = await supabase
    .from('work_permits')
    .select(`
      *,
      organizations(name, cui),
      creator:profiles!work_permits_created_by_fkey(full_name),
      canceler:profiles!work_permits_canceled_by_fkey(full_name)
    `)
    .order('start_datetime', { ascending: false })

  // Fetch organizations pentru dropdown
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui')
    .order('name')

  // Fetch employees pentru dropdown echipă
  const { data: employees } = await supabase
    .from('employees')
    .select('id, full_name, job_title, organization_id')
    .eq('is_active', true)
    .order('full_name')

  return (
    <WorkPermitsClient
      user={{ id: user.id, email: user.email || '' }}
      workPermits={workPermits || []}
      organizations={organizations || []}
      employees={employees || []}
    />
  )
}
