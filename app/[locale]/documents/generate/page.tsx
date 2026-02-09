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

  console.log('🔍 [DocumentGenerate] User roles:', {
    isConsultant,
    isFirmaAdmin,
    isSuperAdmin,
    userId: user.id
  })

  if (!isConsultant && !isFirmaAdmin && !isSuperAdmin) {
    redirect('/unauthorized')
  }

  // Fetch organizații accesibile
  let organizations, employees

  if (isSuperAdmin) {
    // Super admin: fetch TOATE organizațiile și angajații (fără filtru RLS)
    const { data: orgsData, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, cui, address, county')
      .order('name', { ascending: true })

    if (orgError) {
      console.error('❌ [DocumentGenerate] Error fetching organizations:', orgError)
    }
    organizations = orgsData

    console.log('🔍 [DocumentGenerate] Organizations (super_admin):', {
      count: organizations?.length || 0,
      sample: organizations?.[0]
    })

    const { data: empsData, error: empError } = await supabase
      .from('employees')
      .select('id, full_name, job_title, cor_code, organization_id, is_active, organizations (name)')
      .eq('is_active', true)
      .order('full_name', { ascending: true })

    if (empError) {
      console.error('❌ [DocumentGenerate] Error fetching employees (super_admin):', empError)
      console.error('❌ [DocumentGenerate] Error details:', JSON.stringify(empError, null, 2))
      console.error('❌ [DocumentGenerate] Error code:', empError?.code)
      console.error('❌ [DocumentGenerate] Error message:', empError?.message)
      console.error('❌ [DocumentGenerate] Error hint:', empError?.hint)
      console.error('❌ [DocumentGenerate] Error details obj:', empError?.details)
    }
    employees = empsData

    console.log('🔍 [DocumentGenerate] Employees query (super_admin):', {
      count: employees?.length || 0,
      hasError: !!empError,
      errorCode: empError?.code,
      sample: employees?.[0],
      allData: employees
    })
  } else {
    // Non-super-admin: filtrează după organizațiile accesibile
    const myOrgIds = await getMyOrgIds()

    console.log('🔍 [DocumentGenerate] My org IDs:', {
      myOrgIds,
      count: myOrgIds?.length || 0
    })

    const { data: orgsData, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, cui, address, county')
      .in('id', myOrgIds)
      .order('name', { ascending: true })

    if (orgError) {
      console.error('❌ [DocumentGenerate] Error fetching organizations:', orgError)
    }
    organizations = orgsData

    console.log('🔍 [DocumentGenerate] Organizations (non-admin):', {
      count: organizations?.length || 0,
      sample: organizations?.[0]
    })

    const { data: empsData, error: empError } = await supabase
      .from('employees')
      .select('id, full_name, job_title, cor_code, organization_id, is_active, organizations (name)')
      .in('organization_id', myOrgIds)
      .eq('is_active', true)
      .order('full_name', { ascending: true })

    if (empError) {
      console.error('❌ [DocumentGenerate] Error fetching employees (non-admin):', empError)
      console.error('❌ [DocumentGenerate] Error details:', JSON.stringify(empError, null, 2))
      console.error('❌ [DocumentGenerate] Error code:', empError?.code)
      console.error('❌ [DocumentGenerate] Error message:', empError?.message)
      console.error('❌ [DocumentGenerate] Error hint:', empError?.hint)
      console.error('❌ [DocumentGenerate] Error details obj:', empError?.details)
    }
    employees = empsData

    console.log('🔍 [DocumentGenerate] Employees query (non-admin):', {
      count: employees?.length || 0,
      hasError: !!empError,
      errorCode: empError?.code,
      sample: employees?.[0],
      allData: employees,
      filterOrgIds: myOrgIds
    })
  }

  return (
    <DocumentGeneratorClient
      user={user}
      organizations={organizations || []}
      employees={employees || []}
    />
  )
}
