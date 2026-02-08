// app/admin/roles/new/NewRoleForm.tsx
// Formular client-side pentru creare rol nou

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'

const COUNTRIES = ['RO', 'BG', 'HU', 'DE', 'PL']

export default function NewRoleForm() {
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    role_key: '',
    role_name: '',
    description: '',
    country_code: '',
    tier: '2',
    is_system: false,
  })

  // Auto-generate role_key din role_name
  function handleRoleNameChange(name: string) {
    setForm({
      ...form,
      role_name: name,
      role_key: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, ''),
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validare
      if (!form.role_key || !form.role_name) {
        throw new Error('Role key și Role name sunt obligatorii')
      }

      // Verifică unicitate role_key
      const { data: existing } = await supabase
        .from('roles')
        .select('id')
        .eq('role_key', form.role_key)
        .maybeSingle()

      if (existing) {
        throw new Error(`Role key "${form.role_key}" există deja`)
      }

      // Creare rol
      const { data: newRole, error: insertError } = await supabase
        .from('roles')
        .insert({
          role_key: form.role_key,
          role_name: form.role_name,
          description: form.description || null,
          country_code: form.country_code || null,
          is_system: form.is_system,
          is_active: true,
          metadata: {
            tier: parseInt(form.tier),
          },
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Redirect la editare pentru a seta permisiuni
      router.push(`/admin/roles/${newRole.id}`)
    } catch (err: any) {
      setError(err.message || 'Eroare la crearea rolului')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            href="/admin/roles"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Rol Nou</h1>
            <p className="text-sm text-gray-500">
              Creează un rol nou RBAC — după salvare vei putea seta permisiunile
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CARD FORMULAR */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">Eroare</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* ROLE NAME */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.role_name}
                onChange={(e) => handleRoleNameChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ex: Inspector ANSPDCP"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Numele user-friendly al rolului (va genera automat role_key)
              </p>
            </div>

            {/* ROLE KEY */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role Key <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.role_key}
                onChange={(e) => setForm({ ...form, role_key: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ex: inspector_anspdcp"
                pattern="^[a-z0-9_]+$"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Identificator unic (lowercase, doar litere, cifre, underscore)
              </p>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descriere
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Scurtă descriere a rolului și responsabilităților..."
              />
            </div>

            {/* COUNTRY CODE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Țară
              </label>
              <select
                value={form.country_code}
                onChange={(e) => setForm({ ...form, country_code: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Global (toate țările)</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1.5">
                Lasă gol pentru roluri globale (RO, BG, HU, DE, PL)
              </p>
            </div>

            {/* TIER */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tier
              </label>
              <select
                value={form.tier}
                onChange={(e) => setForm({ ...form, tier: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">Tier 1 — Core (super_admin, consultant, firma_admin, angajat)</option>
                <option value="2">Tier 2 — Planificate RO</option>
                <option value="3">Tier 3 — Per țară (BG, HU, DE, PL)</option>
              </select>
            </div>

            {/* IS SYSTEM */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="is_system"
                checked={form.is_system}
                onChange={(e) => setForm({ ...form, is_system: e.target.checked })}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <label htmlFor="is_system" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  Rol system (protejat la ștergere)
                </label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Rolurile system nu pot fi șterse din UI (doar dezactivate)
                </p>
              </div>
            </div>
          </div>

          {/* BUTOANE ACȚIUNI */}
          <div className="flex justify-between items-center">
            <Link
              href="/admin/roles"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Anulează
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>Se salvează...</>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Creează Rol
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            După creare vei fi redirecționat la pagina de editare pentru a seta permisiunile
          </p>
        </form>
      </main>
    </div>
  )
}
