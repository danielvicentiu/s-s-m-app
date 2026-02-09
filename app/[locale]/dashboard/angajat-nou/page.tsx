'use client'
import { useState, useEffect } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { useRouter } from '@/i18n/navigation'
import { ArrowLeft, UserPlus, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const supabase = createSupabaseBrowser()

// Coduri COR (Clasificarea Ocupațiilor din România) - selecție comuni
const COR_CODES = [
  { code: '1120', name: 'Director general' },
  { code: '1210', name: 'Director financiar-contabil' },
  { code: '1330', name: 'Director IT' },
  { code: '1420', name: 'Director comercial' },
  { code: '2141', name: 'Inginer industrial' },
  { code: '2142', name: 'Inginer civil' },
  { code: '2143', name: 'Inginer agronom' },
  { code: '2144', name: 'Inginer mecanic' },
  { code: '2145', name: 'Inginer chimist' },
  { code: '2149', name: 'Inginer în alte domenii' },
  { code: '2221', name: 'Asistent medical generalist' },
  { code: '2230', name: 'Medic medicina muncii' },
  { code: '2411', name: 'Contabil' },
  { code: '2412', name: 'Consilier financiar' },
  { code: '2511', name: 'Analist de sistem informatic' },
  { code: '2512', name: 'Dezvoltator de software' },
  { code: '2513', name: 'Programator web' },
  { code: '3119', name: 'Tehnician' },
  { code: '3311', name: 'Expert în domeniul protecției muncii' },
  { code: '3312', name: 'Expert prevenire și stingere incendii' },
  { code: '3324', name: 'Agent de securitate' },
  { code: '4110', name: 'Secretar' },
  { code: '4120', name: 'Operator introducere, validare și prelucrare date' },
  { code: '4211', name: 'Casier' },
  { code: '4321', name: 'Gestionar depozit' },
  { code: '5120', name: 'Bucătar' },
  { code: '5223', name: 'Vânzător' },
  { code: '7111', name: 'Zidar' },
  { code: '7112', name: 'Tencuitor' },
  { code: '7115', name: 'Dulgher' },
  { code: '7121', name: 'Acoperitor' },
  { code: '7131', name: 'Zugrav' },
  { code: '7211', name: 'Sudor' },
  { code: '7233', name: 'Lăcătuș mecanic' },
  { code: '7411', name: 'Electrician' },
  { code: '7421', name: 'Electronist' },
  { code: '8111', name: 'Miner' },
  { code: '8157', name: 'Operator mașini de curățare' },
  { code: '8322', name: 'Șofer auto' },
  { code: '9111', name: 'Îngrijitor clădiri' },
  { code: '9112', name: 'Muncitor necalificat' },
  { code: '9329', name: 'Muncitor auxiliar' },
]

// Țări pentru naționalitate
const COUNTRIES = [
  { code: 'RO', name: 'România' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'HU', name: 'Ungaria' },
  { code: 'DE', name: 'Germania' },
  { code: 'PL', name: 'Polonia' },
  { code: 'MD', name: 'Republica Moldova' },
  { code: 'UA', name: 'Ucraina' },
  { code: 'IT', name: 'Italia' },
  { code: 'ES', name: 'Spania' },
  { code: 'FR', name: 'Franța' },
  { code: 'GB', name: 'Marea Britanie' },
  { code: 'NL', name: 'Olanda' },
  { code: 'BE', name: 'Belgia' },
  { code: 'AT', name: 'Austria' },
  { code: 'CH', name: 'Elveția' },
  { code: 'TR', name: 'Turcia' },
  { code: 'GR', name: 'Grecia' },
  { code: 'RS', name: 'Serbia' },
  { code: 'OTHER', name: 'Altă țară' },
]

// Format date to DD/MM/YYYY
function formatDateToRO(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// Convert DD/MM/YYYY to YYYY-MM-DD for database
function convertRODateToISO(roDate: string): string {
  const [day, month, year] = roDate.split('/')
  return `${year}-${month}-${day}`
}

// Get today's date in DD/MM/YYYY format
function getTodayRO(): string {
  return formatDateToRO(new Date())
}

export default function AngajatNou() {
  const router = useRouter()
  const [organizations, setOrganizations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    full_name: '',
    cor_code: '',
    job_title: '',
    nationality: 'RO',
    email: '',
    phone: '',
    hire_date: getTodayRO(), // Default: astăzi
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

  // Update job_title when COR code is selected
  function handleCORChange(code: string) {
    const cor = COR_CODES.find((c) => c.code === code)
    setFormData({
      ...formData,
      cor_code: code,
      job_title: cor?.name || formData.job_title,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (!formData.full_name || !formData.organization_id) {
        throw new Error('Nume și organizație sunt obligatorii')
      }

      // Validate and convert hire_date
      let hireDateISO = null
      if (formData.hire_date) {
        try {
          hireDateISO = convertRODateToISO(formData.hire_date)
        } catch {
          throw new Error('Format dată incorect. Folosește ZZ/LL/AAAA (ex: 15/01/2024)')
        }
      }

      const { error: insertError } = await supabase.from('employees').insert([
        {
          full_name: formData.full_name,
          cor_code: formData.cor_code || null,
          job_title: formData.job_title || null,
          nationality: formData.nationality || 'RO',
          email: formData.email || null,
          phone: formData.phone || null,
          hire_date: hireDateISO,
          organization_id: formData.organization_id,
          is_active: true, // CRITICAL: Altfel nu apar în dashboard
        },
      ])

      if (insertError) throw insertError

      setSuccess(true)
      setFormData({
        full_name: '',
        cor_code: '',
        job_title: '',
        nationality: 'RO',
        email: '',
        phone: '',
        hire_date: getTodayRO(),
        organization_id: '',
      })

      // Redirect after 2 seconds to localized dashboard
      setTimeout(() => {
        router.push('/ro/dashboard')
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
            {/* COR Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cod COR (Clasificarea Ocupațiilor)
              </label>
              <select
                value={formData.cor_code}
                onChange={(e) => handleCORChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selectează ocupația</option>
                {COR_CODES.map((cor) => (
                  <option key={cor.code} value={cor.code}>
                    {cor.code} — {cor.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Selectează din listă sau lasă gol pentru funcție personalizată
              </p>
            </div>

            {/* Job Title (auto-filled or custom) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Funcția (titlul postului)
              </label>
              <input
                type="text"
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                placeholder="Se completează automat din COR sau editează manual"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Hire Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Data Angajării
              </label>
              <input
                type="text"
                value={formData.hire_date}
                onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                placeholder="ZZ/LL/AAAA (ex: 15/01/2024)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: ZZ/LL/AAAA (ex: 15/01/2024) — Default: astăzi
              </p>
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
