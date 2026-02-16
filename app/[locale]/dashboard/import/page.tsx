// app/[locale]/dashboard/import/page.tsx
// CSV/Excel Employee Import Wizard
// 4 steps: Upload → Column Mapping → Validation & Preview → Import
// Integrates with organization selector via URL params

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ImportWizardClient from './ImportWizardClient'

interface ImportPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ org?: string }>
}

export default async function ImportPage({ params, searchParams }: ImportPageProps) {
  const { locale } = await params
  const { org: selectedOrgId } = await searchParams
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch organizations for user
  const organizations = (orgs || [])
    .map((m: any) => m.organization)
    .filter(Boolean)

  if (organizations.length === 0) {
    redirect('/onboarding')
  }

  // Determine selected organization
  // Priority: URL param > first org
  let currentOrgId = selectedOrgId || organizations[0]?.id

  // If URL param is invalid, use first org
  if (currentOrgId && currentOrgId !== 'all' && !organizations.some((o: any) => o.id === currentOrgId)) {
    currentOrgId = organizations[0]?.id
  }

  // Import requires a specific organization (not "all")
  if (!currentOrgId || currentOrgId === 'all') {
    redirect(`/${locale}/dashboard/import?org=${organizations[0].id}`)
  }

  return (
    <ImportWizardClient
      user={{ id: user.id, email: user.email || '' }}
      organizations={organizations}
      selectedOrgId={currentOrgId}
      locale={locale}
    />
  )
}
