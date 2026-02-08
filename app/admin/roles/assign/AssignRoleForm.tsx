// app/admin/roles/assign/AssignRoleForm.tsx
// Formular asignare roluri la utilizatori

'use client'

import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, UserPlus, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

interface Props {
  roles: any[]
  organizations: any[]
  profiles: any[]
  assignments: any[]
}

export default function AssignRoleForm({ roles, organizations, profiles, assignments: initialAssignments }: Props) {
  const supabase = createSupabaseBrowser()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [assignments, setAssignments] = useState(initialAssignments)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const [form, setForm] = useState({
    user_id: '',
    role_id: '',
    company_id: '',
    expires_at: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (!form.user_id || !form.role_id) {
        throw new Error('Selectează utilizator și rol')
      }

      // Verifică duplicate
      const { data: existing } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', form.user_id)
        .eq('role_id', form.role_id)
        .eq('company_id', form.company_id || null)
        .eq('is_active', true)
        .maybeSingle()

      if (existing) {
        throw new Error('Asignarea există deja')
      }

      // Inserare
      const { error: insertError } = await supabase.from('user_roles').insert({
        user_id: form.user_id,
        role_id: form.role_id,
        company_id: form.company_id || null,
        expires_at: form.expires_at || null,
        is_active: true,
        granted_at: new Date().toISOString(),
      })

      if (insertError) throw insertError

      // Refresh assignments
      const { data: newAssignments } = await supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          role_id,
          company_id,
          expires_at,
          is_active,
          granted_at,
          profiles!inner (email, full_name),
          roles!inner (role_name, role_key),
          organizations (name)
        `)
        .eq('is_active', true)
        .order('granted_at', { ascending: false })
        .limit(50)

      setAssignments(newAssignments || [])
      setSuccess('Rol asignat cu succes!')
      setForm({ user_id: '', role_id: '', company_id: '', expires_at: '' })

      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Eroare la asignare')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return

    setLoading(true)
    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from('user_roles')
        .update({ is_active: false })
        .eq('id', deleteTarget)

      if (deleteError) throw deleteError

      setAssignments(assignments.filter((a) => a.id !== deleteTarget))
      setDeleteTarget(null)
      setSuccess('Asignare revocată')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Eroare la revocare')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/admin/roles" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Asignare Roluri Utilizatori</h1>
            <p className="text-sm text-gray-500">
              Asignează roluri RBAC la utilizatori, opțional scoped la organizație
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-6 space-y-6">
        {/* SUCCESS/ERROR */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-sm font-semibold text-green-800">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* FORMULAR ASIGNARE */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-bold text-gray-900">Asignare Nouă</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* USER */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Utilizator <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.user_id}
                onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selectează utilizator</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.email} {p.full_name && `(${p.full_name})`}
                  </option>
                ))}
              </select>
            </div>

            {/* ROLE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rol <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.role_id}
                onChange={(e) => setForm({ ...form, role_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selectează rol</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.role_name} ({r.role_key}) {r.country_code && `— ${r.country_code}`}
                  </option>
                ))}
              </select>
            </div>

            {/* ORGANIZATION (optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Organizație (opțional)
              </label>
              <select
                value={form.company_id}
                onChange={(e) => setForm({ ...form, company_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Global (toate organizațiile)</option>
                {organizations.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.cui})
                  </option>
                ))}
              </select>
            </div>

            {/* EXPIRES AT (optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expiră la (opțional)
              </label>
              <input
                type="date"
                value={form.expires_at}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Lasă gol pentru asignare permanentă</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                'Se asignează...'
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Asignează Rol
                </>
              )}
            </button>
          </div>
        </form>

        {/* TABEL ASIGNĂRI */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              Asignări Recente ({assignments.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Utilizator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Organizație
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Expiră
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {assignments.map((a: any) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {a.profiles?.email || 'N/A'}
                      </div>
                      {a.profiles?.full_name && (
                        <div className="text-xs text-gray-500">{a.profiles.full_name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {a.roles?.role_name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">{a.roles?.role_key}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {a.organizations?.name || (
                          <span className="text-gray-400 italic">Global</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {a.expires_at ? (
                          new Date(a.expires_at).toLocaleDateString('ro-RO')
                        ) : (
                          <span className="text-gray-400 italic">Permanent</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setDeleteTarget(a.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"
                        title="Revocă asignare"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {assignments.length === 0 && (
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nicio asignare găsită</p>
            </div>
          )}
        </div>
      </main>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Revocă asignare?"
        message="Utilizatorul va pierde accesul conferit de acest rol. Poți reasigna rolul oricând."
        confirmLabel="Revocă"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isDestructive={true}
        loading={loading}
      />
    </div>
  )
}
