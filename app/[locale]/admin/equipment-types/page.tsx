// app/admin/equipment-types/page.tsx
// Admin UI: Lista tipuri echipamente per țară
// Acces: super_admin și consultant_ssm

import { redirect } from 'next/navigation'
import { isSuperAdmin, hasRole } from '@/lib/rbac'
import { createSupabaseServer } from '@/lib/supabase/server'
import EquipmentTypesClient from './EquipmentTypesClient'

export default async function AdminEquipmentTypesPage() {
  // GUARD: Verificare super_admin sau consultant_ssm
  const admin = await isSuperAdmin()
  const consultant = await hasRole('consultant_ssm')

  if (!admin && !consultant) {redirect('/unauthorized')}

  const supabase = await createSupabaseServer()

  // Fetch toate tipurile cu obligațiile asociate
  const { data: equipmentTypes, error } = await supabase
    .from('equipment_types')
    .select(`
      *,
      obligation_types (
        id,
        name,
        country_code
      )
    `)
    .order('display_order', { ascending: true })
    .order('category', { ascending: true })
    .order('country_code', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching equipment types:', error)
  }

  // Statistici
  const equipmentData = equipmentTypes || []
  const stats = {
    total: equipmentData.length,
    active: equipmentData.filter(e => e.is_active).length,
    system: equipmentData.filter(e => e.is_system).length,
    countries: [...new Set(equipmentData.map(e => e.country_code))].length,
    categories: [...new Set(equipmentData.map(e => e.category))].length,
  }

  return (
    <EquipmentTypesClient
      equipmentTypes={equipmentData}
      stats={stats}
      canDelete={admin} // Doar super_admin poate șterge
    />
  )
}
