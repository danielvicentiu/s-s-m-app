// app/[locale]/dashboard/import/page.tsx
// Import Wizard — 4 steps: Upload → Column Mapping → Preview → Confirm Import
// Supports: employees, trainings, medical_records, safety_equipment
// Data: 2026-02-14

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ImportClient from './ImportClient'

export default async function ImportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch organizații pentru dropdown
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui, country_code')
    .order('name', { ascending: true })

  return (
    <ImportClient
      user={{ id: user.id, email: user.email || '' }}
      organizations={organizations || []}
      locale={locale}
    />
  )
}
