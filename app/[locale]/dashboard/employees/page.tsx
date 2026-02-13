// ============================================================
// S-S-M.RO — Pagina: Lista Angajați
// Path: /dashboard/employees
// ============================================================

import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import EmployeesClient from './EmployeesClient'

export const metadata = {
  title: 'Angajați | S-S-M.ro',
  description: 'Gestionare angajați — lista completă'
}

export default async function EmployeesPage() {
  const supabase = await createSupabaseServer()

  // 1. Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // 2. Get user's active organization via memberships
  const { data: memberships, error: membershipError } = await supabase
    .from('memberships')
    .select('organization_id, role, is_active')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .limit(1)
    .single()

  if (membershipError || !memberships) {
    console.error('[EMPLOYEES PAGE] No active membership:', membershipError)
    redirect('/dashboard')
  }

  const organizationId = memberships.organization_id

  // 3. Fetch employees for this organization
  const { data: employees, error: employeesError } = await supabase
    .from('employees')
    .select('*')
    .eq('organization_id', organizationId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (employeesError) {
    console.error('[EMPLOYEES PAGE] Error fetching employees:', employeesError)
  }

  return (
    <EmployeesClient
      employees={employees || []}
      organizationId={organizationId}
    />
  )
}
