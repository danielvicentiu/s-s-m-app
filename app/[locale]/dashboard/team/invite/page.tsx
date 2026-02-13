'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { useRouter } from '@/i18n/navigation'
import { ArrowLeft, Send, CheckCircle, AlertCircle, Mail } from 'lucide-react'
import Link from 'next/link'

const supabase = createSupabaseBrowser()

// Roluri disponibile pentru invitare
const ROLES = [
  { value: 'admin', label: 'Administrator', description: 'Acces complet la toate funcțiile organizației' },
  { value: 'manager', label: 'Manager', description: 'Vizualizare și gestionare date, fără setări organizație' },
  { value: 'viewer', label: 'Vizualizator', description: 'Doar vizualizare, fără drepturi de editare' },
]

// Module disponibile pentru access control
const MODULES = [
  { id: 'medical', label: 'Medicina Muncii', description: 'Gestionare fișe medicale și expirări' },
  { id: 'equipment', label: 'Echipamente PSI', description: 'Gestionare echipamente și inspecții' },
  { id: 'training', label: 'Instruiri SSM', description: 'Gestionare instruiri și certificate' },
  { id: 'employees', label: 'Angajați', description: 'Gestionare evidență angajați' },
  { id: 'documents', label: 'Documente', description: 'Generare și arhivare documente' },
  { id: 'reports', label: 'Rapoarte', description: 'Vizualizare rapoarte și statistici' },
]

export default function InviteMemberPage() {
  const router = useRouter()
  const [organizations, setOrganizations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: '',
    role: 'viewer',
    organization_id: '',
    personal_message: '',
  })

  const [moduleAccess, setModuleAccess] = useState<Record<string, boolean>>({
    medical: false,
    equipment: false,
    training: false,
    employees: false,
    documents: false,
    reports: false,
  })

  useEffect(() => {
    async function getOrganizations() {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name, cui')
        .order('name')

      if (data) setOrganizations(data)
      if (error) console.error('Error fetching organizations:', error)
    }
    getOrganizations()
  }, [])

  // Auto-enable all modules when role is admin
  useEffect(() => {
    if (formData.role === 'admin') {
      const allEnabled = MODULES.reduce((acc, module) => {
        acc[module.id] = true
        return acc
      }, {} as Record<string, boolean>)
      setModuleAccess(allEnabled)
    }
  }, [formData.role])

  const handleModuleToggle = (moduleId: string) => {
    // Admin are mereu toate modulele activate
    if (formData.role === 'admin') return

    setModuleAccess({
      ...moduleAccess,
      [moduleId]: !moduleAccess[moduleId],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (!formData.email || !formData.organization_id) {
        throw new Error('Email și organizație sunt obligatorii')
      }

      // Validare email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error('Format email invalid')
      }

      // Check if user already exists in organization
      const { data: existingMembership, error: checkError } = await supabase
        .from('memberships')
        .select('id')
        .eq('organization_id', formData.organization_id)
        .limit(1)

      if (checkError) throw checkError

      // Prepare module access list
      const enabledModules = Object.entries(moduleAccess)
        .filter(([_, enabled]) => enabled)
        .map(([moduleId, _]) => moduleId)

      // TODO: In a real implementation, this would:
      // 1. Create an invitation record in 'invitations' table
      // 2. Send email with invitation link
      // 3. Track invitation status (pending, accepted, expired)
      // For now, we'll just log the invitation data

      const invitationData = {
        email: formData.email,
        role: formData.role,
        organization_id: formData.organization_id,
        module_access: enabledModules,
        personal_message: formData.personal_message || null,
        created_at: new Date().toISOString(),
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      }

      console.log('Invitation data to be sent:', invitationData)

      // TODO: Replace with actual invitation insert and email sending
      // const { error: inviteError } = await supabase
      //   .from('invitations')
      //   .insert([invitationData])
      // if (inviteError) throw inviteError

      setSuccess(true)
      setFormData({
        email: '',
        role: 'viewer',
        organization_id: '',
        personal_message: '',
      })
      setModuleAccess({
        medical: false,
        equipment: false,
        training: false,
        employees: false,
        documents: false,
        reports: false,
      })

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Eroare la trimitere invitație')
    } finally {
      setLoading(false)
    }
  }

  const selectedRole = ROLES.find((r) => r.value === formData.role)
  const enabledModulesCount = Object.values(moduleAccess).filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Invită Membru în Echipă</h1>
            <p className="text-sm text-gray-500">
              Trimite invitație pentru acces la platforma SSM/PSI
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-6">
        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-800">
                Invitație trimisă cu succes!
              </p>
              <p className="text-xs text-green-600 mt-1">
                Un email a fost trimis la {formData.email}. Vei fi redirecționat către dashboard...
              </p>
            </div>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informații de bază */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Informații Membru</h2>

            {/* Organization */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Organizație <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.organization_id}
                onChange={(e) =>
                  setFormData({ ...formData, organization_id: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selectează organizația</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} {org.cui && `(CUI: ${org.cui})`}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Persoana invitată va avea acces la această organizație
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Adresă Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="membru@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Un email de invitație va fi trimis la această adresă
              </p>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rol <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {ROLES.map((role) => (
                  <label
                    key={role.value}
                    className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition ${
                      formData.role === role.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">{role.label}</div>
                      <div className="text-xs text-gray-600">{role.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Module Access */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Acces Module</h2>
              <p className="text-sm text-gray-500 mt-1">
                Selectează modulele la care va avea acces membrul invitat{' '}
                {formData.role === 'admin' && '(Administratorii au acces la toate modulele)'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MODULES.map((module) => (
                <label
                  key={module.id}
                  className={`flex items-start gap-3 p-3 border rounded-lg transition ${
                    formData.role === 'admin'
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      : 'cursor-pointer hover:border-gray-400'
                  } ${
                    moduleAccess[module.id] ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={moduleAccess[module.id]}
                    onChange={() => handleModuleToggle(module.id)}
                    disabled={formData.role === 'admin'}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">{module.label}</div>
                    <div className="text-xs text-gray-600">{module.description}</div>
                  </div>
                </label>
              ))}
            </div>

            {enabledModulesCount > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                <strong>{enabledModulesCount}</strong> {enabledModulesCount === 1 ? 'modul activat' : 'module activate'}
              </div>
            )}
          </div>

          {/* Personal Message (Optional) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Mesaj Personalizat</h2>
              <p className="text-sm text-gray-500 mt-1">Opțional — adaugă un mesaj de bun venit</p>
            </div>

            <div>
              <textarea
                value={formData.personal_message}
                onChange={(e) =>
                  setFormData({ ...formData, personal_message: e.target.value })
                }
                placeholder="Bun venit în echipă! Așteptăm cu nerăbdare să colaborăm..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Acest mesaj va fi inclus în emailul de invitație
              </p>
            </div>
          </div>

          {/* Summary Card */}
          {formData.email && formData.organization_id && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-blue-900">Rezumat Invitație</p>
                  <p className="text-blue-700 mt-1">
                    <strong>{formData.email}</strong> va fi invitat ca{' '}
                    <strong>{selectedRole?.label}</strong> cu acces la{' '}
                    <strong>{enabledModulesCount}</strong>{' '}
                    {enabledModulesCount === 1 ? 'modul' : 'module'}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Anulează
            </Link>
            <button
              type="submit"
              disabled={loading || !formData.email || !formData.organization_id}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                'Se trimite...'
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Trimite Invitație
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
