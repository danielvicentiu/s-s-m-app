// app/[locale]/dashboard/settings/api-keys/page.tsx
// API Keys Management — Server Component
// Fetch API keys for organization and pass to client component

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ApiKeysClient from './ApiKeysClient'

export default async function ApiKeysPage() {
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user || authError) {
    redirect('/login')
  }

  // Get user's current organization
  const currentOrg = orgs?.[0]

  if (!currentOrg) {
    redirect('/dashboard')
  }

  // Fetch API keys for the organization
  const { data: apiKeys } = await supabase
    .from('api_keys')
    .select('*')
    .eq('organization_id', currentOrg.organization_id)
    .order('created_at', { ascending: false })

  return (
    <ApiKeysClient
      organizationId={currentOrg.organization_id}
      apiKeys={apiKeys || []}
      userId={user.id}
    />
  )
}
