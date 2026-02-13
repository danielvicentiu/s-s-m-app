// app/dashboard/designated-workers/page.tsx
// Lucrători Desemnați SSM — Pagină dedicată cu CRUD complet
// Pattern identic cu /dashboard/medical și /dashboard/equipment
// 🆕 OP-LEGO Sprint 4.7: ModuleGate wrapping (modulul 'ssm' necesar)

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DesignatedWorkersClient from './DesignatedWorkersClient'
import ModuleGate from '@/components/ModuleGate'

export default async function DesignatedWorkersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch designated workers cu join pe organizations
  const { data: designatedWorkers, error } = await supabase
    .from('designated_workers')
    .select('*, organizations(name, cui)')
    .order('designation_date', { ascending: false })

  // Fetch employees pentru dropdown în formular
  const { data: employees } = await supabase
    .from('employees')
    .select('id, full_name, job_title, organization_id, organizations(name)')
    .eq('is_active', true)
    .order('full_name')

  // Fetch organizations pentru filtru
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui')
    .order('name')

  // OP-LEGO: orgId pentru ModuleGate
  const orgId = organizations?.[0]?.id || null

  return (
    <ModuleGate orgId={orgId} moduleKey="ssm" locale={locale}>
      <DesignatedWorkersClient
        user={{ id: user.id, email: user.email || '' }}
        designatedWorkers={designatedWorkers || []}
        employees={employees || []}
        organizations={organizations || []}
      />
    </ModuleGate>
  )
}
