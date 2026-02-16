// app/[locale]/onboarding/OnboardingClient.tsx
// Onboarding Flow — 3 Steps: CUI Lookup → Organization Details → Confirmation
// Integrates with ANAF API for auto-complete

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { Building2, Check, ArrowRight, ArrowLeft, Loader2, Search, AlertCircle, CheckCircle, Upload, Users } from 'lucide-react'
import { validateCUI, formatCUI } from '@/lib/utils/cuiValidation'
import { fetchCompanyDataFromANAF } from '@/lib/services/anafApi'

interface Props {
  user: { id: string; email: string }
  isConsultant: boolean
}

interface OrganizationForm {
  name: string
  cui: string
  caen: string
  address: string
  county: string
  employee_count_estimate: number
  contact_email: string
  contact_phone: string
}

export default function OnboardingClient({ user, isConsultant }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)

  // Step 1: CUI Lookup
  const [cuiInput, setCuiInput] = useState('')
  const [cuiError, setCuiError] = useState('')
  const [loadingANAF, setLoadingANAF] = useState(false)
  const [anafData, setAnafData] = useState<any>(null)
  const [duplicateOrg, setDuplicateOrg] = useState<{ id: string; name: string; cui: string } | null>(null)

  // Step 2: Organization Details
  const [formData, setFormData] = useState<OrganizationForm>({
    name: '',
    cui: '',
    caen: '',
    address: '',
    county: '',
    employee_count_estimate: 10,
    contact_email: user.email,
    contact_phone: '',
  })

  // Handle CUI lookup
  const handleCUILookup = async () => {
    const cui = cuiInput.trim()
    if (!cui) {
      setCuiError('Introduceți CUI-ul firmei')
      return
    }

    // Validate CUI format
    const validation = validateCUI(cui)
    if (!validation.valid) {
      setCuiError(validation.message)
      return
    }

    setCuiError('')
    setLoadingANAF(true)
    setAnafData(null)
    setDuplicateOrg(null)

    try {
      // Check for duplicate CUI in database
      const supabase = createSupabaseBrowser()
      const cleanCUI = formatCUI(cui)

      const { data: existing } = await supabase
        .from('organizations')
        .select('id, name, cui')
        .eq('cui', cleanCUI)
        .maybeSingle()

      if (existing) {
        setDuplicateOrg(existing)
        setCuiError('Această firmă există deja în platformă')
        return
      }

      // Fetch from ANAF
      const anafResponse = await fetchCompanyDataFromANAF(cleanCUI)

      if (anafResponse) {
        setAnafData(anafResponse)
        // Pre-fill form data
        setFormData({
          ...formData,
          cui: cleanCUI,
          name: anafResponse.name || '',
          address: anafResponse.address || '',
          county: anafResponse.county || '',
          caen: anafResponse.caen_code || '',
          contact_phone: anafResponse.phone || '',
        })
        setStep(2)
      } else {
        // ANAF not found, but CUI is valid - allow manual entry
        setFormData({
          ...formData,
          cui: cleanCUI,
        })
        setCuiError('CUI valid, dar nu a fost găsit în registrul ANAF. Veți completa datele manual.')
        // Still allow to proceed
        setTimeout(() => {
          setCuiError('')
          setStep(2)
        }, 2000)
      }
    } catch (error) {
      console.error('CUI lookup error:', error)
      setCuiError('Eroare la verificarea ANAF. Încercați din nou.')
    } finally {
      setLoadingANAF(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'employee_count_estimate' ? parseInt(value) || 0 : value,
    }))
  }

  // Validate Step 2
  const canSaveOrganization =
    formData.name.trim() &&
    formData.cui.trim() &&
    formData.caen.trim() &&
    formData.address.trim() &&
    formData.employee_count_estimate > 0

  // Save organization and create membership
  const handleSaveOrganization = async () => {
    if (!canSaveOrganization) {
      alert('Completați toate câmpurile obligatorii')
      return
    }

    setLoading(true)
    const supabase = createSupabaseBrowser()

    try {
      // 1. Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.name.trim(),
          cui: formData.cui.trim(),
          address: formData.address.trim(),
          county: formData.county.trim() || null,
          contact_email: formData.contact_email.trim() || null,
          contact_phone: formData.contact_phone.trim() || null,
          data_completeness: 40,
          exposure_score: 'necalculat',
          preferred_channels: ['email'],
          cooperation_status: 'active',
          country_code: 'RO',
        })
        .select()
        .single()

      if (orgError) {
        console.error('Organization insert error:', orgError)
        throw new Error('Eroare la salvarea organizației')
      }

      // 2. Create membership
      // If consultant, role is consultant_ssm; otherwise firma_admin
      const membershipRole = isConsultant ? 'consultant_ssm' : 'firma_admin'

      const { error: memberError } = await supabase.from('memberships').insert({
        user_id: user.id,
        organization_id: org.id,
        role: membershipRole,
        is_active: true,
      })

      if (memberError) {
        console.error('Membership insert error:', memberError)
        throw new Error('Eroare la crearea accesului')
      }

      setOrgId(org.id)
      setStep(3)
    } catch (error) {
      console.error('Save organization error:', error)
      alert(error instanceof Error ? error.message : 'Eroare la salvare. Încercați din nou.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-2xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">s-s-m.ro</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Bine ați venit! Să configurăm firma dvs.</p>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center mb-12">
          {[
            { num: 1, label: 'CUI Lookup' },
            { num: 2, label: 'Detalii organizație' },
            { num: 3, label: 'Confirmare' },
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all ${
                    step >= s.num
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}
                >
                  {step > s.num ? <Check className="h-6 w-6" /> : s.num}
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-2">{s.label}</span>
              </div>
              {idx < 2 && (
                <div
                  className={`w-24 h-1 mx-2 transition-all ${
                    step > s.num ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-8">
          {/* STEP 1: CUI Lookup */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <Building2 className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Introduceți CUI-ul firmei</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Vom căuta automat datele firmei în registrul ANAF
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  CUI (Cod Unic de Înregistrare)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cuiInput}
                    onChange={(e) => {
                      setCuiInput(e.target.value)
                      setCuiError('')
                      setDuplicateOrg(null)
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleCUILookup()}
                    placeholder="Ex: RO12345678 sau 12345678"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      cuiError
                        ? 'border-red-300 dark:border-red-700'
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  />
                  {loadingANAF && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                    </div>
                  )}
                </div>
                {cuiError && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {cuiError}
                  </div>
                )}
                {duplicateOrg && (
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                      Firma există deja în platformă
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                      {duplicateOrg.name} (CUI: {duplicateOrg.cui})
                    </p>
                    <button
                      onClick={() => router.push(`/dashboard?org=${duplicateOrg.id}`)}
                      className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Accesează dashboard →
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleCUILookup}
                disabled={loadingANAF || !cuiInput.trim()}
                className="w-full px-6 py-3 rounded-lg text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {loadingANAF ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Verificare ANAF...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Caută firmă
                  </>
                )}
              </button>

              <div className="text-center pt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Vom verifica automat datele în registrul ANAF al Ministerului Finanțelor
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Organization Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Detalii organizație</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {anafData
                    ? 'Datele au fost completate automat din ANAF. Verificați și editați dacă e necesar.'
                    : 'Completați manual datele organizației.'}
                </p>
              </div>

              {anafData && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold text-green-900 dark:text-green-100">
                    Firmă găsită în registrul ANAF
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Denumire firmă */}
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Denumire firmă <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* CUI */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    CUI <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cui"
                    value={formData.cui}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>

                {/* CAEN principal */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    CAEN principal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="caen"
                    value={formData.caen}
                    onChange={handleInputChange}
                    placeholder="Ex: 7112"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Adresa sediu */}
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Adresa sediu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Județ */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Județ</label>
                  <input
                    type="text"
                    name="county"
                    value={formData.county}
                    onChange={handleInputChange}
                    placeholder="Ex: București"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Nr angajați estimat */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Nr angajați estimat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="employee_count_estimate"
                    value={formData.employee_count_estimate}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Email contact */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Email contact firmă
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Telefon contact */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Telefon contact
                  </label>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    placeholder="Ex: 0721234567"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {isConsultant && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Consultant SSM:</strong> Veți avea acces complet la această firmă ca și consultant.
                  </p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 rounded-lg text-base font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Înapoi
                </button>
                <button
                  onClick={handleSaveOrganization}
                  disabled={!canSaveOrganization || loading}
                  className="flex-1 px-6 py-3 rounded-lg text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Salvare...
                    </>
                  ) : (
                    <>
                      Salvează organizația
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirmation */}
          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Firma {formData.name} a fost adăugată cu succes!
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Contul dvs. este acum configurat și puteți începe să gestionați datele SSM/PSI.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6">
                <button
                  onClick={() => router.push(`/dashboard/import?org=${orgId}`)}
                  className="px-6 py-3 rounded-lg text-base font-semibold border border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition flex items-center justify-center gap-2"
                >
                  <Upload className="h-5 w-5" />
                  Importă angajați
                </button>
                <button
                  onClick={() => router.push(`/dashboard?org=${orgId}`)}
                  className="px-6 py-3 rounded-lg text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Users className="h-5 w-5" />
                  Mergi la dashboard
                </button>
              </div>

              <div className="pt-4 text-xs text-gray-500 dark:text-gray-400">
                Vă recomandăm să importați lista de angajați pentru a începe urmărirea conformității SSM/PSI.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
