// app/admin/roles/page.tsx
// Admin UI: Lista rolurilor RBAC cu filtrare și statistici
// Acces: DOAR super_admin

import { Plus, Shield, Globe, Lock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isSuperAdmin } from '@/lib/rbac'
import { createSupabaseServer } from '@/lib/supabase/server'

export default async function AdminRolesPage() {
  // GUARD: Verificare super_admin (server-side)
  const admin = await isSuperAdmin()
  if (!admin) {redirect('/unauthorized')}

  const supabase = await createSupabaseServer()

  // Fetch toate rolurile cu număr permisiuni
  const { data: roles, error } = await supabase
    .from('roles')
    .select(`
      id,
      role_key,
      role_name,
      description,
      country_code,
      is_system,
      is_active,
      metadata,
      created_at,
      permissions (count)
    `)
    .order('is_system', { ascending: false })
    .order('country_code', { ascending: true, nullsFirst: true })
    .order('role_key', { ascending: true })

  if (error) {
    console.error('Error fetching roles:', error)
  }

  // Procesare date pentru afișare
  const rolesData = (roles || []).map((r: any) => ({
    ...r,
    permissions_count: r.permissions?.[0]?.count || 0,
    tier: r.metadata?.tier || 0,
  }))

  // Statistici
  const stats = {
    total: rolesData.length,
    active: rolesData.filter(r => r.is_active).length,
    system: rolesData.filter(r => r.is_system).length,
    countries: [...new Set(rolesData.map(r => r.country_code).filter(Boolean))].length,
  }

  // Țări unice pentru filtru
  const countries = [...new Set(rolesData.map(r => r.country_code).filter(Boolean))].sort()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="h-7 w-7 text-blue-600" />
                Administrare Roluri RBAC
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Gestionare roluri, permisiuni și asignări utilizatori
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/roles/assign"
                className="px-4 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Asignare Roluri
              </Link>
              <Link
                href="/admin/roles/new"
                className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Rol Nou
              </Link>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
              <div className="text-3xl font-black text-blue-600">{stats.total}</div>
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">
                Total Roluri
              </div>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-100 p-4">
              <div className="text-3xl font-black text-green-600">{stats.active}</div>
              <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">
                Active
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl border border-purple-100 p-4">
              <div className="text-3xl font-black text-purple-600">{stats.system}</div>
              <div className="text-xs font-semibold text-purple-600 uppercase tracking-widest mt-1">
                System Roles
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl border border-orange-100 p-4">
              <div className="text-3xl font-black text-orange-600">{stats.countries}</div>
              <div className="text-xs font-semibold text-orange-600 uppercase tracking-widest mt-1">
                Țări
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6">
        {/* TABEL ROLURI */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Țară
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Permisiuni
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rolesData.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {role.is_system && (
                          <span title="System role">
                            <Lock className="h-4 w-4 text-purple-500" />
                          </span>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{role.role_name}</div>
                          <div className="text-sm text-gray-500 font-mono">{role.role_key}</div>
                          {role.description && (
                            <div className="text-xs text-gray-400 mt-1 max-w-md">
                              {role.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {role.country_code ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">
                          <Globe className="h-3.5 w-3.5" />
                          {role.country_code}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">Global</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                        Tier {role.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-sm font-semibold">
                        {role.permissions_count} permisiuni
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {role.is_active ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-sm font-medium">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Activ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-sm font-medium">
                            <XCircle className="h-3.5 w-3.5" />
                            Inactiv
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/roles/${role.id}`}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Editează →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rolesData.length === 0 && (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Niciun rol găsit</p>
            </div>
          )}
        </div>

        {/* LINK ÎNAPOI */}
        <div className="mt-6">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Înapoi la Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
