// app/dashboard/medical/page.tsx
// M2 Medicina Muncii — Pagină dedicată cu CRUD complet
// Dashboard principal LOCKED — aceasta e pagina separată de management
// 🆕 OP-LEGO Sprint 4.7: ModuleGate wrapping (modulul 'ssm' necesar)

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MedicalClient from './MedicalClient'
import ModuleGate from '@/components/ModuleGate'

interface MedicalPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ org?: string }>
}

export default async function MedicalPage({ params, searchParams }: MedicalPageProps) {
  const { locale } = await params
  const { org: selectedOrgId } = await searchParams
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Build query with optional org filter
  let medicalQuery = supabase
    .from('medical_examinations')
    .select('*, organizations(name, cui)')
    .order('expiry_date', { ascending: true })

  if (selectedOrgId && selectedOrgId !== 'all') {
    medicalQuery = medicalQuery.eq('organization_id', selectedOrgId)
  }

  const { data: medicalExams, error } = await medicalQuery

  // Fetch employees filtered by org if selected
  let employeesQuery = supabase
    .from('employees')
    .select('id, full_name, job_title, organization_id, organizations(name)')
    .eq('is_active', true)
    .order('full_name')

  if (selectedOrgId && selectedOrgId !== 'all') {
    employeesQuery = employeesQuery.eq('organization_id', selectedOrgId)
  }

  const { data: employees } = await employeesQuery

  // Fetch organizations pentru filtru
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui')
    .order('name')

  // OP-LEGO: orgId pentru ModuleGate
  const orgId = organizations?.[0]?.id || null

  return (
    <ModuleGate orgId={orgId} moduleKey="ssm" locale={locale}>
      <MedicalClient
        user={{ id: user.id, email: user.email || '' }}
        medicalExams={medicalExams || []}
        employees={employees || []}
        organizations={organizations || []}
        selectedOrgId={selectedOrgId}
      />
    </ModuleGate>
  )
}
