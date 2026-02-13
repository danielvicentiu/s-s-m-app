// app/[locale]/dashboard/reports/medical/page.tsx
// Raport Medical — statistici examene medicina muncii
// Examene per luna, rezultate, expirate, programari, cost total

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MedicalReportClient from './MedicalReportClient'

export default async function MedicalReportPage() {
  const supabase = await createSupabaseServer()

  // Verificare autentificare
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch organizații accesibile
  const { data: memberships } = await supabase
    .from('memberships')
    .select('organization_id, organizations(id, name, cui)')
    .eq('user_id', user.id)
    .eq('is_active', true)

  const organizations = (memberships || [])
    .map((m: any) => m.organizations)
    .filter(Boolean)

  const orgIds = organizations.map((o: any) => o.id)

  // Fetch examene medicale
  const { data: medicalExams } = await supabase
    .from('medical_examinations')
    .select(`
      id,
      organization_id,
      employee_name,
      job_title,
      examination_type,
      examination_date,
      expiry_date,
      result,
      restrictions,
      clinic_name,
      doctor_name
    `)
    .in('organization_id', orgIds)
    .order('examination_date', { ascending: false })

  // Fetch angajați activi pentru calcule
  const { data: employees } = await supabase
    .from('employees')
    .select('id, organization_id, full_name, job_title')
    .in('organization_id', orgIds)
    .eq('is_active', true)

  return (
    <MedicalReportClient
      user={{ id: user.id, email: user.email || '' }}
      organizations={organizations}
      medicalExams={medicalExams || []}
      employees={employees || []}
    />
  )
}
