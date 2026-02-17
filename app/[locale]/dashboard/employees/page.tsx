// app/[locale]/dashboard/employees/page.tsx
// Lista angajaților importați — server component cu metadata

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import EmployeesClient from './EmployeesClient'

export const metadata: Metadata = {
  title: 'Angajați | SSM Dashboard',
  description: 'Lista angajaților înregistrați în sistemul SSM',
}

export default async function EmployeesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createSupabaseServer()

  // Verifică autentificarea
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  // Fetch organizațiile user-ului prin memberships
  const { data: memberships, error } = await supabase
    .from('memberships')
    .select(`
      organization_id,
      organizations (
        id,
        name
      )
    `)
    .eq('user_id', user.id)
    .eq('is_active', true)

  if (error) {
    console.error('Error fetching memberships:', error)
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Eroare la încărcarea organizațiilor.</p>
          <p className="text-sm mt-2">Vă rugăm încercați din nou.</p>
        </div>
      </div>
    )
  }

  if (!memberships || memberships.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Nu ești asociat la nicio organizație.</p>
          <p className="text-sm mt-2">Contactează administratorul pentru a fi adăugat.</p>
        </div>
      </div>
    )
  }

  const organizations = memberships
    .filter(m => m.organizations)
    .map(m => ({
      id: (m.organizations as any).id as string,
      name: (m.organizations as any).name as string,
    }))

  if (organizations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Nu ești asociat la nicio organizație validă.</p>
          <p className="text-sm mt-2">Contactează administratorul pentru a fi adăugat.</p>
        </div>
      </div>
    )
  }

  const initialOrgId = organizations[0].id

  return (
    <EmployeesClient
      initialOrgId={initialOrgId}
      organizations={organizations}
    />
  )
}
