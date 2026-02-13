// app/[locale]/dashboard/import-export/page.tsx
// Centru Import/Export — CSV, PDF, JSON
// Data: 13 Februarie 2026

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ImportExportClient from './ImportExportClient'

export default async function ImportExportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch organizations
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui, country_code')

  // Fetch employees count
  const { count: employeesCount } = await supabase
    .from('employees')
    .select('*', { count: 'exact', head: true })

  // Fetch equipment count
  const { count: equipmentCount } = await supabase
    .from('safety_equipment')
    .select('*', { count: 'exact', head: true })

  // Fetch trainings count
  const { count: trainingsCount } = await supabase
    .from('safety_trainings')
    .select('*', { count: 'exact', head: true })

  return (
    <ImportExportClient
      user={{ email: user.email || '' }}
      organizations={organizations || []}
      stats={{
        employees: employeesCount || 0,
        equipment: equipmentCount || 0,
        trainings: trainingsCount || 0
      }}
      locale={locale}
    />
  )
}
