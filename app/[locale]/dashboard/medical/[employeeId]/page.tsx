// app/[locale]/dashboard/medical/[employeeId]/page.tsx
// Profil medical complet al unui angajat:
//   - Status medical curent (apt/expirat/fără fișă)
//   - Restricții active cu badge-uri
//   - Istoric examene medicale (timeline)
//   - Programări viitoare
//   - Formular adăugare fișă nouă

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ModuleGate from '@/components/ModuleGate'
import MedicalEmployeeClient from './MedicalEmployeeClient'

interface PageProps {
  params: Promise<{ locale: string; employeeId: string }>
}

export default async function MedicalEmployeePage({ params }: PageProps) {
  const { locale, employeeId } = await params
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch employee (with organization join)
  const { data: employee, error: empError } = await supabase
    .from('employees')
    .select('id, full_name, job_title, department, organization_id, is_active, hire_date, organizations(id, name, cui)')
    .eq('id', employeeId)
    .single()

  if (empError || !employee) {
    notFound()
  }

  // Fetch ALL medical examinations for this employee (linked via employee_id FK)
  const { data: examinations } = await supabase
    .from('medical_examinations')
    .select('*')
    .eq('employee_id', employeeId)
    .order('examination_date', { ascending: false })

  // Fetch ALL appointments for this employee
  const { data: appointments } = await supabase
    .from('medical_appointments')
    .select('*')
    .eq('employee_id', employeeId)
    .order('appointment_date', { ascending: false })

  // Fetch organizations list (for the "add record" form dropdown)
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui')
    .order('name')

  const orgId = employee.organization_id

  return (
    <ModuleGate orgId={orgId} moduleKey="ssm" locale={locale}>
      <MedicalEmployeeClient
        employee={employee as EmployeeWithOrg}
        examinations={examinations || []}
        appointments={appointments || []}
        organizations={organizations || []}
        locale={locale}
      />
    </ModuleGate>
  )
}

// Type exported so client can import it
export interface EmployeeWithOrg {
  id: string
  full_name: string
  job_title: string | null
  department: string | null
  organization_id: string
  is_active: boolean
  hire_date: string | null
  organizations: { id: string; name: string; cui: string | null } | null
}
