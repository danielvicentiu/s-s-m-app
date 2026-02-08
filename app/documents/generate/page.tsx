// app/documents/generate/page.tsx
// Generator Documente SSM — Server Component
// Acces: consultant_ssm, firma_admin, super_admin

import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import { hasRole, getMyOrgIds } from '@/lib/rbac'
import DocumentGeneratorClient from './DocumentGeneratorClient'

export default async function DocumentGeneratePage() {
  // GUARD: Verificare acces (consultant, firma_admin, super_admin)
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const isConsultant = await hasRole('consultant_ssm')
  const isFirmaAdmin = await hasRole('firma_admin')
  const isSuperAdmin = await hasRole('super_admin')

  if (!isConsultant && !isFirmaAdmin && !isSuperAdmin) {
    redirect('/unauthorized')
  }

  // Fetch organizații accesibile
  const myOrgIds = await getMyOrgIds()

  const { data: organizations, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, cui, address, county')
    .in('id', myOrgIds)
    .order('name', { ascending: true })

  if (orgError) {
    console.error('Error fetching organizations:', orgError)
  }

  // Fetch angajați din organizațiile accesibile
  const { data: employees, error: empError } = await supabase
    .from('employees')
    .select('id, full_name, job_title, cor_code, organization_id, organizations (name)')
    .in('organization_id', myOrgIds)
    .order('full_name', { ascending: true })

  if (empError) {
    console.error('Error fetching employees:', empError)
  }

  return (
    <DocumentGeneratorClient
      user={user}
      organizations={organizations || []}
      employees={employees || []}
    />
  )
}
