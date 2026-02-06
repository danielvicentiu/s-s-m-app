// app/dashboard/medical/page.tsx
// M2 Medicina Muncii — Pagină dedicată cu CRUD complet
// Dashboard principal LOCKED — aceasta e pagina separată de management

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MedicalClient from './MedicalClient'

export default async function MedicalPage() {
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch medical examinations cu join pe organizations + employees
  const { data: medicalExams, error } = await supabase
    .from('medical_examinations')
    .select('*, organizations(name, cui)')
    .order('expiry_date', { ascending: true })

  // Fetch employees pentru dropdown în formular
  const { data: employees } = await supabase
    .from('employees')
    .select('id, full_name, job_title, organization_id, organizations(name)')
    .eq('is_active', true)
    .order('full_name')

  // Fetch organizations pentru filtru
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui')
    .order('name')

  return (
    <MedicalClient
      user={{ id: user.id, email: user.email || '' }}
      medicalExams={medicalExams || []}
      employees={employees || []}
      organizations={organizations || []}
    />
  )
}
