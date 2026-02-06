'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { Check, ArrowRight, ArrowLeft, Building2, ClipboardList, CheckCircle } from 'lucide-react'

interface Props {
  user: { id: string; email: string }
}

export default function OnboardingClient({ user }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Step 1: Date firmă
  const [formData, setFormData] = useState({
    name: '',
    cui: '',
    caen: '',
    employeeCount: '',
    address: '',
    county: '',
    contactEmail: user.email,
    contactPhone: '',
  })

  // Step 2: Servicii
  const [services, setServices] = useState({
    ssm: true,
    psi: true,
    medicinaMuncii: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleServiceToggle = (service: keyof typeof services) => {
    setServices(prev => ({ ...prev, [service]: !prev[service] }))
  }

  const canProceedStep1 = formData.name && formData.cui && formData.caen && formData.employeeCount
  const canProceedStep2 = services.ssm || services.psi || services.medicinaMuncii

  async function handleSubmit() {
    if (!canProceedStep2) return

    setLoading(true)
    const supabase = createSupabaseBrowser()

    try {
      // 1. Insert organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.name,
          cui: formData.cui,
          address: formData.address || null,
          county: formData.county || null,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone || null,
          data_completeness: 50,
          exposure_score: 'necalculat',
          preferred_channels: ['email'],
          cooperation_status: 'active',
        })
        .select()
        .single()

      if (orgError) throw orgError

      // 2. Create membership (user → organization)
      const { error: memberError } = await supabase.from('memberships').insert({
        user_id: user.id,
        organization_id: org.id,
        role: 'firma_admin',
        is_active: true,
      })

      if (memberError) throw memberError

      // 3. Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Onboarding error:', error)
      alert('Eroare la salvare. Verifică datele și încearcă din nou.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-black text-gray-900">s-s-m.ro</h1>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-6">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Date firmă', icon: Building2 },
            { num: 2, label: 'Servicii', icon: ClipboardList },
            { num: 3, label: 'Confirmare', icon: CheckCircle },
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step >= s.num
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step > s.num ? <Check className="w-6 h-6" /> : <s.icon className="w-6 h-6" />}
                </div>
                <span
                  className={`text-xs font-semibold mt-2 ${
                    step >= s.num ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < 2 && (
                <div
                  className={`h-1 flex-1 mx-2 rounded transition-all ${
                    step > s.num ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
          {/* Step 1: Date firmă */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Date firmă</h2>
              <p className="text-gray-600 mb-8">Completează informațiile despre organizația ta</p>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Denumire firmă <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Ex: S.C. EXEMPLE S.R.L."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      CUI <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cui"
                      value={formData.cui}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="RO12345678"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Cod CAEN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="caen"
                      value={formData.caen}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Ex: 4120"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Număr angajați <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="employeeCount"
                      value={formData.employeeCount}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Ex: 25"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Adresă</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Ex: Strada Exemplului nr. 1, București"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Județ</label>
                    <input
                      type="text"
                      name="county"
                      value={formData.county}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Ex: București"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Telefon</label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="+40 700 000 000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email contact</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
                    placeholder="contact@firma.ro"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Servicii */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Selectează serviciile</h2>
              <p className="text-gray-600 mb-8">
                Ce module de conformitate vrei să activezi pentru firma ta?
              </p>

              <div className="space-y-4">
                {[
                  {
                    key: 'ssm' as const,
                    title: 'Siguranța și Sănătatea Muncii (SSM)',
                    description: 'Gestionare evaluări riscuri, instruiri SSM, documentație ITM',
                    icon: '🛡️',
                  },
                  {
                    key: 'psi' as const,
                    title: 'Prevenirea și Stingerea Incendiilor (PSI)',
                    description: 'Tracking echipamente PSI (stingătoare, hidranți), verificări periodice',
                    icon: '🧯',
                  },
                  {
                    key: 'medicinaMuncii' as const,
                    title: 'Medicina Muncii',
                    description: 'Fișe medicale, alerte expirare, programare controale periodice',
                    icon: '🏥',
                  },
                ].map((service) => (
                  <button
                    key={service.key}
                    onClick={() => handleServiceToggle(service.key)}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                      services[service.key]
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{service.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              services[service.key]
                                ? 'bg-blue-600 border-blue-600'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {services[service.key] && <Check className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-6 text-center">
                Poți activa/dezactiva oricând aceste servicii din dashboard
              </p>
            </div>
          )}

          {/* Step 3: Confirmare */}
          {step === 3 && (
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Confirmare</h2>
              <p className="text-gray-600 mb-8">Verifică datele înainte de finalizare</p>

              <div className="space-y-6">
                {/* Date firmă */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Date firmă
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Denumire:</span>
                      <p className="font-semibold text-gray-900">{formData.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">CUI:</span>
                      <p className="font-semibold text-gray-900">{formData.cui}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">CAEN:</span>
                      <p className="font-semibold text-gray-900">{formData.caen}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Angajați:</span>
                      <p className="font-semibold text-gray-900">{formData.employeeCount}</p>
                    </div>
                    {formData.address && (
                      <div className="md:col-span-2">
                        <span className="text-gray-500">Adresă:</span>
                        <p className="font-semibold text-gray-900">{formData.address}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Servicii */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                    Servicii activate
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {services.ssm && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        <Check className="w-4 h-4" /> SSM
                      </span>
                    )}
                    {services.psi && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                        <Check className="w-4 h-4" /> PSI
                      </span>
                    )}
                    {services.medicinaMuncii && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        <Check className="w-4 h-4" /> Medicina Muncii
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-semibold transition disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5" />
                Înapoi
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuă
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-lg"
              >
                {loading ? 'Se salvează...' : 'Finalizează și intră în dashboard'}
                <CheckCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
