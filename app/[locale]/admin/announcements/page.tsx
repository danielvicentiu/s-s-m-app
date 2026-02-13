// app/[locale]/admin/announcements/page.tsx
// Pagină administrare anunțuri banner pentru dashboard
// RBAC: doar super_admin poate accesa
// Features: creare, editare, preview, listă anunțuri active

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { hasRole } from '@/lib/rbac'
import AnnouncementsClient from './AnnouncementsClient'

export default async function AnnouncementsPage() {
  const supabase = await createSupabaseServer()

  // RBAC: Verifică dacă user e super_admin
  const isSuperAdmin = await hasRole('super_admin')

  if (!isSuperAdmin) {
    redirect('/dashboard')
  }

  // Fetch toate anunțurile (inclusiv inactive)
  const { data: announcements, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching announcements:', error)
  }

  // Fetch organizații pentru target dropdown
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui')
    .order('name', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administrare Anunțuri</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gestionează banner-ele de anunțuri care apar în dashboard pentru utilizatori
          </p>
        </div>

        <AnnouncementsClient
          announcements={announcements || []}
          organizations={organizations || []}
        />
      </div>
    </div>
  )
}
