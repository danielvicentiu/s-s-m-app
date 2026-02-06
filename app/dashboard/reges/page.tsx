// app/dashboard/reges/page.tsx
// Server Component — REGES Integration Management

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RegesClient from './RegesClient'

export default async function RegesPage() {
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch REGES connections
  const { data: connections } = await supabase
    .from('reges_connections')
    .select('*, organizations(name, cui)')
    .order('created_at', { ascending: false })

  // Fetch REGES outbox (transmiteri)
  const { data: outbox } = await supabase
    .from('reges_outbox')
    .select('*, reges_connections(cui, reges_employer_id), organizations(name)')
    .order('created_at', { ascending: false })
    .limit(50)

  // Fetch organizations for dropdown
  const organizations = (orgs || [])
    .map((m: any) => m.organization)
    .filter(Boolean)

  return (
    <RegesClient
      user={{ id: user.id, email: user.email || '' }}
      connections={connections || []}
      outbox={outbox || []}
      organizations={organizations}
    />
  )
}
