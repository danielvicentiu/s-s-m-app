// app/[locale]/dashboard/activity/page.tsx
// Jurnal activitate — Timeline cu acțiuni recente din audit_log
// Afișează cine a făcut ce acțiune, când și pe ce entitate
// Filtrare: tip acțiune, utilizator, dată + paginare

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ActivityClient from './ActivityClient'

export default async function ActivityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch audit log cu relații (profiles pentru user_id, organizations pentru organization_id)
  const { data: auditLogs, error } = await supabase
    .from('audit_log')
    .select(`
      *,
      profiles!audit_log_user_id_fkey(id, full_name, avatar_url),
      organizations(id, name)
    `)
    .order('created_at', { ascending: false })
    .limit(500) // Limită rezonabilă pentru încărcare inițială

  // Fetch lista utilizatori pentru filtru
  const { data: users } = await supabase
    .from('profiles')
    .select('id, full_name')
    .order('full_name')

  // Fetch lista organizații pentru filtru
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name')
    .order('name')

  // Extrage tipuri unice de acțiuni din datele existente
  const uniqueActions = auditLogs
    ? Array.from(new Set(auditLogs.map(log => log.action))).sort()
    : []

  // Extrage tipuri unice de entități
  const uniqueEntityTypes = auditLogs
    ? Array.from(new Set(auditLogs.map(log => log.entity_type))).sort()
    : []

  return (
    <ActivityClient
      user={{ id: user.id, email: user.email || '' }}
      auditLogs={auditLogs || []}
      users={users || []}
      organizations={organizations || []}
      uniqueActions={uniqueActions}
      uniqueEntityTypes={uniqueEntityTypes}
    />
  )
}
