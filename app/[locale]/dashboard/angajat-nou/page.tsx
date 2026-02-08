'use client'
import { useState, useEffect } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { useRouter } from '@/i18n/navigation'
import { ArrowLeft, UserPlus, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const supabase = createSupabaseBrowser()

export default function AngajatNou() {
  const router = useRouter()
  const [organizations, setOrganizations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    full_name: '',
    job_title: '',
    nationality: 'RO',
    email: '',
    phone: '',
    hire_date: '',
    organization_id: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (!formData.full_name || !formData.organization_id) {
        throw new Error('Nume și organizație sunt obligatorii')
      }

      const { error: insertError } = await supabase.from('employees').insert([
        {
          full_name: formData.full_name,
          job_title: formData.job_title || null,
          nationality: formData.nationality || 'RO',
          email: formData.email || null,
          phone: formData.phone || null,
          hire_date: formData.hire_date || null,
          organization_id: formData.organization_id,
        },
      ])

      if (insertError) throw insertError

      setSuccess(true)
      setFormData({
        full_name: '',
        job_title: '',
        nationality: 'RO',
        email: '',
        phone: '',
        hire_date: '',
        organization_id: '',
      })

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Eroare la salvare angajat')
    } finally {
      setLoading(false)
    }
  }

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
            <h1 className="text-xl font-bold text-gray-900">Adaugă Angajat Nou</h1>
            <p className="text-sm text-gray-500">Înregistrare angajat în baza de date</p>
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
                Angajat înregistrat cu succes!
              </p>
              <p className="text-xs text-green-600 mt-1">
                Vei fi redirecționat către dashboard...
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
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-bold text-gray-900">Date Angajat</h2>

          {/* Organization */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Organizație <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.organization_id}
              onChange={(e) => setFormData({ ...formData, organization_id: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selectează organizația</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} {org.cui && `(CUI: ${org.cui})`}
                </option>
              ))}
            </select>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nume Complet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="ex: Popescu Ion Marian"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Funcția
              </label>
              <input
                type="text"
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                placeholder="ex: Inginer, Muncitor, Contabil"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Naționalitate
              </label>
              <select
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="RO">România</option>
                <option value="BG">Bulgaria</option>
                <option value="HU">Ungaria</option>
                <option value="DE">Germania</option>
                <option value="PL">Polonia</option>
                <option value="MD">Moldova</option>
                <option value="UA">Ucraina</option>
                <option value="OTHER">Altă țară</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="angajat@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+40 721 234 567"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Hire Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Data Angajării
            </label>
            <input
              type="date"
              value={formData.hire_date}
              onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Opțional — data începerii activității în organizație
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Anulează
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                'Se salvează...'
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Adaugă Angajat
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
