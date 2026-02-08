// app/admin/roles/[id]/EditRoleForm.tsx
// Formular editare rol + matrice permisiuni resource × action

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Save, XCircle, AlertCircle, Lock, CheckCircle } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

const RESOURCES = [
  'organizations',
  'employees',
  'locations',
  'equipment',
  'medical',
  'trainings',
  'documents',
  'alerts',
  'dashboard',
  'reports',
  'fraud',
  'jurisdictions',
  'reges',
  'notifications',
  'memberships',
  'profiles',
  'penalties',
  'audit_log',
  'roles_admin',
]

const ACTIONS = ['create', 'read', 'update', 'delete', 'export', 'delegate']

interface Props {
  role: any
}

export default function EditRoleForm({ role: initialRole }: Props) {
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)

  const [form, setForm] = useState({
    role_name: initialRole.role_name,
    description: initialRole.description || '',
    country_code: initialRole.country_code || '',
    is_active: initialRole.is_active,
  })

  // Matrice permisiuni: { resource: { action: boolean } }
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>(() => {
    const matrix: Record<string, Record<string, boolean>> = {}
    RESOURCES.forEach((resource) => {
      matrix[resource] = {}
      ACTIONS.forEach((action) => {
        matrix[resource][action] = false
      })
    })

    // Populare cu permisiunile existente
    if (initialRole.permissions) {
      initialRole.permissions.forEach((perm: any) => {
        if (matrix[perm.resource]) {
          matrix[perm.resource][perm.action] = perm.is_active
        }
      })
    }

    return matrix
  })

  function togglePermission(resource: string, action: string) {
    setPermissions({
      ...permissions,
      [resource]: {
        ...permissions[resource],
        [action]: !permissions[resource][action],
      },
    })
  }

  // Toggle întreg rând (toate acțiunile pentru o resursă)
  function toggleResourceRow(resource: string) {
    const allEnabled = ACTIONS.every((action) => permissions[resource][action])
    const newState = !allEnabled

    setPermissions({
      ...permissions,
      [resource]: Object.fromEntries(ACTIONS.map((action) => [action, newState])),
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // 1. Update rol
      const { error: roleError } = await supabase
        .from('roles')
        .update({
          role_name: form.role_name,
          description: form.description || null,
          country_code: form.country_code || null,
          is_active: form.is_active,
        })
        .eq('id', initialRole.id)

      if (roleError) throw roleError

      // 2. Șterge permisiunile vechi
      const { error: deleteError } = await supabase
        .from('permissions')
        .delete()
        .eq('role_id', initialRole.id)

      if (deleteError) throw deleteError

      // 3. Inserează permisiunile noi
      const permissionsToInsert: any[] = []
      Object.entries(permissions).forEach(([resource, actions]) => {
        Object.entries(actions).forEach(([action, enabled]) => {
          if (enabled) {
            permissionsToInsert.push({
              role_id: initialRole.id,
              resource,
              action,
              is_active: true,
              field_restrictions: {},
              conditions: {},
            })
          }
        })
      })

      if (permissionsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('permissions')
          .insert(permissionsToInsert)

        if (insertError) throw insertError
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Eroare la salvare')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeactivate() {
    setLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('roles')
        .update({ is_active: false })
        .eq('id', initialRole.id)

      if (updateError) throw updateError

      setShowDeactivateDialog(false)
      router.push('/admin/roles')
    } catch (err: any) {
      setError(err.message || 'Eroare la dezactivare')
      setLoading(false)
    }
  }

  const permissionsCount = Object.values(permissions).reduce(
    (sum, actions) => sum + Object.values(actions).filter(Boolean).length,
    0
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/roles" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900">{initialRole.role_name}</h1>
                {initialRole.is_system && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold">
                    <Lock className="h-3 w-3" />
                    System
                  </span>
                )}
                {form.is_active ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-semibold">
                    <CheckCircle className="h-3 w-3" />
                    Activ
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-semibold">
                    <XCircle className="h-3 w-3" />
                    Inactiv
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 font-mono mt-0.5">{initialRole.role_key}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!initialRole.is_system && form.is_active && (
              <button
                onClick={() => setShowDeactivateDialog(true)}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-red-300 text-red-700 bg-white hover:bg-red-50 transition"
              >
                Dezactivează rol
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'Se salvează...' : <><Save className="h-4 w-4" />Salvează</>}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6 space-y-6">
        {/* SUCCESS/ERROR MESSAGES */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-sm font-semibold text-green-800">
              Rol salvat cu succes! ({permissionsCount} permisiuni active)
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">Eroare</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DETALII ROL */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Detalii Rol</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role Name
                </label>
                <input
                  type="text"
                  value={form.role_name}
                  onChange={(e) => setForm({ ...form, role_name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Țară
                </label>
                <input
                  type="text"
                  value={form.country_code}
                  onChange={(e) => setForm({ ...form, country_code: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="RO, BG, HU, DE, PL sau gol pentru global"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descriere
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {!initialRole.is_system && (
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm font-semibold text-gray-700">
                  Rol activ
                </label>
              </div>
            )}
          </div>

          {/* MATRICE PERMISIUNI */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                Matrice Permisiuni ({permissionsCount} active)
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Bifează permisiunile pentru fiecare resursă × acțiune
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-64">
                      Resursă
                    </th>
                    {ACTIONS.map((action) => (
                      <th key={action} className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                        {action}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {RESOURCES.map((resource) => (
                    <tr key={resource} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <button
                          type="button"
                          onClick={() => toggleResourceRow(resource)}
                          className="text-sm font-semibold text-gray-900 hover:text-blue-600 text-left"
                        >
                          {resource}
                        </button>
                      </td>
                      {ACTIONS.map((action) => (
                        <td key={action} className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={permissions[resource]?.[action] || false}
                            onChange={() => togglePermission(resource, action)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                💡 Tip: Click pe numele resursei pentru a selecta/deselecta toate acțiunile
              </p>
            </div>
          </div>
        </form>
      </main>

      {/* CONFIRM DEACTIVATE DIALOG */}
      <ConfirmDialog
        isOpen={showDeactivateDialog}
        title="Dezactivează rol?"
        message={`Rolul "${initialRole.role_name}" va deveni inactiv și utilizatorii cu acest rol vor pierde accesul. Poți reactiva rolul oricând.`}
        confirmLabel="Dezactivează"
        onConfirm={handleDeactivate}
        onCancel={() => setShowDeactivateDialog(false)}
        isDestructive={true}
        loading={loading}
      />
    </div>
  )
}
