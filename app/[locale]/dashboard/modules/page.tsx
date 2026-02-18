// app/[locale]/dashboard/modules/page.tsx
// Pagina Module — vizualizare module disponibile și status per organizație
// Admin org poate vedea ce module sunt active/trial/inactive
// Activarea/dezactivarea se face DOAR de super-admin

import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import ModulesClient from './ModulesClient'

interface ModulesPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ org?: string }>
}

export default async function ModulesPage({ params, searchParams }: ModulesPageProps) {
  const { locale } = await params
  const { org: selectedOrgId } = await searchParams

  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get user's organizations via memberships
  const { data: memberships } = await supabase
    .from('memberships')
    .select('organization_id, role, organizations(id, name, cui)')
    .eq('user_id', user.id)
    .eq('is_active', true)

  if (!memberships || memberships.length === 0) {
    redirect('/unauthorized')
  }

  // Determine active org: URL param > first membership
  const orgIds = memberships.map((m: any) => m.organization_id)
  const orgId = (selectedOrgId && orgIds.includes(selectedOrgId))
    ? selectedOrgId
    : orgIds[0]

  const orgData = memberships.find((m: any) => m.organization_id === orgId)
  const orgName = (orgData?.organizations as any)?.name || 'Organizația mea'

  // Fetch all module definitions (catalogul complet)
  const { data: definitions } = await supabase
    .from('module_definitions')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  // Fetch modules active/trial pentru această organizație
  const { data: activeModules } = await supabase
    .from('organization_modules')
    .select('module_key, status, activated_at, expires_at, trial_started_at, trial_expires_at')
    .eq('organization_id', orgId)

  return (
    <ModulesClient
      locale={locale}
      orgId={orgId}
      orgName={orgName}
      definitions={definitions || []}
      activeModules={activeModules || []}
    />
  )
}
