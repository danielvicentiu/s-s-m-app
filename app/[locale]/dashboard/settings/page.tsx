// app/[locale]/dashboard/settings/page.tsx
// Setări organizație — server component
// Fetch organizația curentă, detalii, module active

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsClient from './SettingsClient'
import { hasRole } from '@/lib/rbac'

export default async function SettingsPage() {
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Check if user has admin permissions
  const isSuperAdmin = await hasRole('super_admin')
  const isConsultant = await hasRole('consultant_ssm')
  const isFirmaAdmin = await hasRole('firma_admin')

  // Backward compatibility: verifică și în memberships
  let hasAdminAccess = isSuperAdmin || isConsultant || isFirmaAdmin

  if (!hasAdminAccess) {
    const { data: userMembership } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (userMembership?.role === 'consultant' || userMembership?.role === 'firma_admin') {
      hasAdminAccess = true
    }
  }

  // Dacă nu are acces admin, redirect la dashboard
  if (!hasAdminAccess) {
    redirect('/dashboard')
  }

  // Get first organization (or from query param in future)
  const firstOrg = orgs?.[0]?.organization
  if (!firstOrg) {
    redirect('/dashboard')
  }

  // Fetch full organization details
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', firstOrg.id)
    .single()

  if (orgError || !organization) {
    console.error('Error fetching organization:', orgError)
    redirect('/dashboard')
  }

  // Fetch organization preferences/settings
  const { data: orgPrefs } = await supabase
    .from('organization_settings')
    .select('*')
    .eq('organization_id', organization.id)
    .maybeSingle()

  return (
    <SettingsClient
      organization={organization}
      organizationSettings={orgPrefs || {}}
      userEmail={user.email || ''}
    />
  )
}
