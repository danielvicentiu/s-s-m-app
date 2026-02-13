// app/admin/features/page.tsx
// Admin UI: Feature Flags Management
// Acces: DOAR super_admin

import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import { isSuperAdmin } from '@/lib/rbac'
import { Flag, Settings } from 'lucide-react'
import FeatureFlagsClient from './FeatureFlagsClient'

export default async function AdminFeaturesPage() {
  // GUARD: Verificare super_admin (server-side)
  const admin = await isSuperAdmin()
  if (!admin) redirect('/unauthorized')

  const supabase = await createSupabaseServer()

  // Fetch toate feature flags
  const { data: features, error: featuresError } = await supabase
    .from('feature_flags')
    .select('*')
    .order('feature_name', { ascending: true })

  if (featuresError) {
    console.error('Error fetching feature flags:', featuresError)
  }

  // Fetch toate organizațiile pentru target selector
  const { data: organizations, error: orgsError } = await supabase
    .from('organizations')
    .select('id, name, cui')
    .order('name', { ascending: true })

  if (orgsError) {
    console.error('Error fetching organizations:', orgsError)
  }

  // Statistici
  const stats = {
    total: features?.length || 0,
    enabled: features?.filter(f => f.is_enabled).length || 0,
    rollout: features?.filter(f => f.rollout_percentage > 0 && f.rollout_percentage < 100).length || 0,
    targeted: features?.filter(f => f.target_organizations && f.target_organizations.length > 0).length || 0,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Flag className="h-7 w-7 text-blue-600" />
                Feature Flags Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Activare/dezactivare funcționalități, rollout gradual, target organizații
              </p>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
              <div className="text-3xl font-black text-blue-600">{stats.total}</div>
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">
                Total Features
              </div>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-100 p-4">
              <div className="text-3xl font-black text-green-600">{stats.enabled}</div>
              <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">
                Active
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl border border-orange-100 p-4">
              <div className="text-3xl font-black text-orange-600">{stats.rollout}</div>
              <div className="text-xs font-semibold text-orange-600 uppercase tracking-widest mt-1">
                În Rollout
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl border border-purple-100 p-4">
              <div className="text-3xl font-black text-purple-600">{stats.targeted}</div>
              <div className="text-xs font-semibold text-purple-600 uppercase tracking-widest mt-1">
                Cu Target
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6">
        <FeatureFlagsClient
          initialFeatures={features || []}
          organizations={organizations || []}
        />
      </main>
    </div>
  )
}
