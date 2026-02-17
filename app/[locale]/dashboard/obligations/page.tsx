// app/[locale]/dashboard/obligations/page.tsx
// M7 CLIENT: Server component pentru dashboard obligații legislative
// Fetchează organizațiile user-ului și pasează către ObligationsClient

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ObligationsClient from './ObligationsClient'

export default async function ObligationsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createSupabaseServer()

  // Verifică autentificarea
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  // Fetch toate organizațiile user-ului
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

  // Mapează organizațiile
  const organizations = memberships
    .filter(m => m.organizations)
    .map(m => ({
      id: (m.organizations as any).id,
      name: (m.organizations as any).name
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

  // Selectează prima organizație ca default
  const initialOrgId = organizations[0].id

  return (
    <ObligationsClient
      initialOrgId={initialOrgId}
      organizations={organizations}
    />
  )
}
