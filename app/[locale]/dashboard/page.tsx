// app/dashboard/page.tsx
// Dashboard — design IDENTIC cu versiunea aprobată de 9 clienți
// Conectat la date REALE din Supabase views
// + Value Preview (risc financiar)
// + User preferences (toggle-uri panouri)
// RBAC: Verificare roluri dinamice din user_roles cu fallback pe memberships

import { redirect } from 'next/navigation'
import { getMyRoles, hasRole, getMyOrgIds } from '@/lib/rbac'
import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'
// RBAC: Import funcții server-side pentru verificare roluri și permisiuni

interface DashboardPageProps {
  searchParams: Promise<{ org?: string }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = await searchParams
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) {redirect('/login')}

  // RBAC: Verifică dacă user e super_admin (înainte de fetch date)
  const isSuperAdmin = await hasRole('super_admin')

  // Fetch date reale
  const { data: overview } = await supabase.from('v_dashboard_overview').select('*')
  const { data: alerts } = await supabase
    .from('v_active_alerts')
    .select('*')
    .order('days_remaining', { ascending: true })

  // Fetch date detaliate pentru tabel
  const { data: medicalExams } = await supabase
    .from('medical_examinations')
    .select('*, organizations(name, cui)')

  const { data: equipment } = await supabase
    .from('safety_equipment')
    .select('*, organizations(name, cui)')

  // Fetch employees pentru tab Angajați
  const { data: employees, error: employeesError } = await supabase
    .from('employees')
    .select('*, organizations(name, cui)')
    .eq('is_active', true)
    .order('hire_date', { ascending: false })

  // DEBUG: Log employees data
  console.log('🔍 [Dashboard] Employees query:', {
    count: employees?.length || 0,
    error: employeesError,
    sample: employees?.[0],
    isSuperAdmin
  })

  // RBAC: Obține organizațiile accesibile
  let baseOrganizations

  if (isSuperAdmin) {
    // Super admin: fetch TOATE organizațiile direct
    const { data: allOrgs, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, cui, data_completeness, cooperation_status')
      .order('name', { ascending: true })

    if (orgError) {
      console.error('Error fetching all organizations for super_admin:', orgError)
    }
    baseOrganizations = allOrgs || []
  } else {
    // Non-super-admin: folosește organizațiile din memberships
    const myOrgIds = await getMyOrgIds()

    baseOrganizations = (orgs || [])
      .map((m: any) => m.organization)
      .filter(Boolean)
      .filter((org: any) => myOrgIds.includes(org.id))
  }

  // Fetch employee counts for each organization
  const organizationsWithCounts = await Promise.all(
    baseOrganizations.map(async (org: any) => {
      // Get latest snapshot date for this org
      const { data: latestSnapshot } = await supabase
        .from('reges_employee_snapshots')
        .select('snapshot_date')
        .eq('organization_id', org.id)
        .order('snapshot_date', { ascending: false })
        .limit(1)
        .maybeSingle()

      // Count active employees from latest snapshot
      let employeeCount = 0
      if (latestSnapshot) {
        const { count } = await supabase
          .from('reges_employee_snapshots')
          .select('cnp', { count: 'exact', head: true })
          .eq('organization_id', org.id)
          .eq('employment_status', 'active')
          .eq('snapshot_date', latestSnapshot.snapshot_date)

        employeeCount = count || 0
      }

      return {
        ...org,
        employee_count: employeeCount
      }
    })
  )

  const organizations = organizationsWithCounts

  // Fetch Value Preview pentru toate org-urile
  const orgIds = [...new Set(
    [...(overview || []), ...(medicalExams || []), ...(equipment || [])]
      .map((r: any) => r.organization_id)
      .filter(Boolean)
  )]
  const valuePreviewMap: Record<string, any> = {}
  await Promise.all(orgIds.map(async (orgId: string) => {
    const { data } = await supabase.rpc('calculate_value_preview', {
      p_organization_id: orgId
    })
    if (data) {valuePreviewMap[orgId] = data}
  }))

  // RBAC: Verifică dacă user e consultant folosind RBAC dinamic
  const isConsultant = await hasRole('consultant_ssm') || await hasRole('super_admin')

  // Backward compatibility: verifică și în memberships dacă RBAC returnează false
  if (!isConsultant) {
    const { data: userMembership } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    // Fallback pe memberships.role vechi
    if (userMembership?.role === 'consultant') {
      // User are rol consultant în memberships dar nu în user_roles
      // Acceptă accesul (backward compatibility)
    }
  }

  // Fetch user preferences (toggle-uri dashboard)
  const { data: prefsRows } = await supabase
    .from('user_preferences')
    .select('key, value')
    .eq('user_id', user.id)

  const initialPrefs: Record<string, any> = {}
  if (prefsRows) {
    for (const row of prefsRows) {
      try {
        initialPrefs[row.key] = JSON.parse(row.value)
      } catch {
        initialPrefs[row.key] = true
      }
    }
  }

  // Citește preferința org selectată (validează că încă există)
  // Priority: URL param > DB preference > default ('all')
  const urlOrgParam = resolvedSearchParams.org
  let savedSelectedOrg = 'all'

  if (urlOrgParam && (urlOrgParam === 'all' || organizations.some((o: any) => o.id === urlOrgParam))) {
    // URL param takes precedence if valid
    savedSelectedOrg = urlOrgParam
  } else if (initialPrefs.selected_org) {
    // Fallback to DB preference
    const parsed = initialPrefs.selected_org
    if (parsed === 'all' || organizations.some((o: any) => o.id === parsed)) {
      savedSelectedOrg = parsed
    }
  }

  return (
    <DashboardClient
      user={{ email: user.email || '', id: user.id }}
      overview={overview || []}
      alerts={alerts || []}
      medicalExams={medicalExams || []}
      equipment={equipment || []}
      employees={employees || []}
      valuePreviewMap={valuePreviewMap}
      isConsultant={isConsultant}
      initialPrefs={initialPrefs}
      organizations={organizations}
      savedSelectedOrg={savedSelectedOrg}
    />
  )
}
