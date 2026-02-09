// app/admin/alert-categories/page.tsx
// Admin UI: Lista categorii alerte per țară
// Acces: super_admin și consultant_ssm

import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import { isSuperAdmin, hasRole } from '@/lib/rbac'
import AlertCategoriesClient from './AlertCategoriesClient'

export default async function AdminAlertCategoriesPage() {
  // GUARD: Verificare super_admin sau consultant_ssm
  const admin = await isSuperAdmin()
  const consultant = await hasRole('consultant_ssm')

  if (!admin && !consultant) redirect('/unauthorized')

  const supabase = await createSupabaseServer()

  // Fetch toate categoriile cu obligațiile asociate
  const { data: alertCategories, error } = await supabase
    .from('alert_categories')
    .select(`
      *,
      obligation_types (
        id,
        name,
        country_code
      )
    `)
    .order('display_order', { ascending: true })
    .order('country_code', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching alert categories:', error)
  }

  // Statistici
  const categoriesData = alertCategories || []
  const stats = {
    total: categoriesData.length,
    active: categoriesData.filter(c => c.is_active).length,
    system: categoriesData.filter(c => c.is_system).length,
    countries: [...new Set(categoriesData.map(c => c.country_code))].length,
  }

  return (
    <AlertCategoriesClient
      alertCategories={categoriesData}
      stats={stats}
      canDelete={admin} // Doar super_admin poate șterge
    />
  )
}
