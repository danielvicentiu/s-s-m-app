'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { Check, ArrowRight, ArrowLeft, Building2, Users, Upload, CheckCircle, X, Loader2, Search } from 'lucide-react'
import { validateCUI, formatCUI } from '@/lib/utils/cuiValidation'
import { fetchCompanyDataFromANAF } from '@/lib/services/anafApi'

interface Props {
  user: { id: string; email: string }
}

interface Employee {
  fullName: string
  cnp: string
  jobTitle: string
  corCode: string
}

export default function OnboardingClient({ user }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Step 1: Date firmă
  const [formData, setFormData] = useState({
    name: '',
    cui: '',
    caen: '',
    address: '',
    county: '',
    contactEmail: user.email,
    contactPhone: '',
  })

  // CUI validation and ANAF autocomplete
  const [cuiError, setCuiError] = useState<string>('')
  const [loadingANAF, setLoadingANAF] = useState(false)
  const [anafSuggestion, setAnafSuggestion] = useState<string>('')

  // Step 2: Angajați
  const [employees, setEmployees] = useState<Employee[]>([])
  const [currentEmployee, setCurrentEmployee] = useState<Employee>({
    fullName: '',
    cnp: '',
    jobTitle: '',
    corCode: '',
  })

  // Step 3: Documente (optional)
  const [documents, setDocuments] = useState<File[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Reset CUI error când user modifică câmpul
    if (name === 'cui') {
      setCuiError('')
      setAnafSuggestion('')
    }
  }

  // Validare CUI în timp real (blur event)
  const handleCUIBlur = async () => {
    const cui = formData.cui.trim()
    if (!cui) {
      setCuiError('')
      return
    }

    // Validare check digit
    const validation = validateCUI(cui)
    if (!validation.valid) {
      setCuiError(validation.message)
      return
    }

    setCuiError('')

    // Interogare ANAF pentru autocomplete
    setLoadingANAF(true)
    setAnafSuggestion('')

    try {
      const anafData = await fetchCompanyDataFromANAF(validation.cleanedCUI || cui)

      if (anafData) {
        setAnafSuggestion('Firmă găsită în registrul ANAF')

        // Completare automată dacă câmpurile sunt goale
        setFormData(prev => ({
          ...prev,
          cui: formatCUI(anafData.cui),
          name: prev.name || anafData.name,
          address: prev.address || anafData.address,
          county: prev.county || anafData.county,
          contactPhone: prev.contactPhone || anafData.phone,
        }))
      } else {
        setAnafSuggestion('CUI valid, dar nu a fost găsit în registrul ANAF')
      }
    } catch (error) {
      console.error('ANAF error:', error)
      setAnafSuggestion('Eroare la verificarea ANAF (vei putea completa manual)')
    } finally {
      setLoadingANAF(false)
    }
  }

  // Tranziție animată între pași
  const transitionToStep = (newStep: number) => {
    setIsAnimating(true)
    setTimeout(() => {
      setStep(newStep)
      setIsAnimating(false)
    }, 300)
  }

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentEmployee(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const addEmployee = () => {
    if (!currentEmployee.fullName || !currentEmployee.cnp || !currentEmployee.jobTitle) {
      alert('Completează toate câmpurile obligatorii')
      return
    }

    const cnpRegex = /^[0-9]{13}$/
    if (!cnpRegex.test(currentEmployee.cnp)) {
      alert('CNP-ul trebuie să conțină exact 13 cifre')
      return
    }

    setEmployees([...employees, currentEmployee])
    setCurrentEmployee({ fullName: '', cnp: '', jobTitle: '', corCode: '' })
  }

  const removeEmployee = (index: number) => {
    setEmployees(employees.filter((_, i) => i !== index))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files))
    }
  }

  const canProceedStep1 = formData.name && formData.cui && formData.caen && formData.address && !cuiError

  async function handleStep1Complete() {
    // Validare finală CUI înainte de salvare
    if (formData.cui) {
      const validation = validateCUI(formData.cui)
      if (!validation.valid) {
        setCuiError(validation.message)
        alert('CUI invalid. Corectează eroarea înainte de a continua.')
        return
      }
    }

    setLoading(true)
    const supabase = createSupabaseBrowser()

    try{
      // 1. Insert organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.name,
          cui: formData.cui,
          address: formData.address,
          county: formData.county || null,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone || null,
          data_completeness: 25,
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

      setOrgId(org.id)
      transitionToStep(2)
    } catch (error) {
      console.error('Onboarding error:', error)
      alert('Eroare la salvare. Verifică datele și încearcă din nou.')
    } finally {
      setLoading(false)
    }
  }

  async function handleStep2Complete() {
    if (employees.length === 0) {
      alert('Adaugă cel puțin un angajat pentru a continua')
      return
    }

    setLoading(true)
    const supabase = createSupabaseBrowser()

    try {
      // Insert employees
      const employeesToInsert = employees.map(emp => ({
        organization_id: orgId,
        full_name: emp.fullName,
        cnp: emp.cnp,
        job_title: emp.jobTitle,
        cor_code: emp.corCode || null,
        is_active: true,
      }))

      const { error: empError } = await supabase.from('employees').insert(employeesToInsert)

      if (empError) throw empError

      transitionToStep(3)
    } catch (error) {
      console.error('Error saving employees:', error)
      alert('Eroare la salvarea angajaților. Încearcă din nou.')
    } finally {
      setLoading(false)
    }
  }

  async function handleFinalSubmit() {
    setLoading(true)
    const supabase = createSupabaseBrowser()

    try {
      // Upload documents if any
      if (documents.length > 0) {
        for (const file of documents) {
          const fileName = `${orgId}/${Date.now()}_${file.name}`
          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, file)

          if (uploadError) {
            console.warn('Document upload warning:', uploadError)
          }
        }
      }

      // Update organization completeness
      await supabase
        .from('organizations')
        .update({ data_completeness: 75 })
        .eq('id', orgId)

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Final submit error:', error)
      alert('Eroare la finalizare. Redirecționăm către dashboard...')
      router.push('/dashboard')
    } finally {
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

      {/* Progress Stepper - Îmbunătățit */}
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-6">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Date firmă', icon: Building2 },
            { num: 2, label: 'Angajați', icon: Users },
            { num: 3, label: 'Documente', icon: Upload },
            { num: 4, label: 'Confirmare', icon: CheckCircle },
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                {/* Circle with number or check */}
                <div className="relative">
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-black text-lg transition-all duration-300 ${
                      step >= s.num
                        ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-100'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step > s.num ? (
                      <Check className="w-6 h-6 md:w-7 md:h-7" />
                    ) : (
                      <span className="text-lg md:text-xl">{s.num}</span>
                    )}
                  </div>
                  {/* Active pulse animation */}
                  {step === s.num && (
                    <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-25" />
                  )}
                </div>
                {/* Label */}
                <span
                  className={`text-xs md:text-sm font-bold mt-2 text-center transition-colors duration-300 ${
                    step >= s.num ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {/* Connector line */}
              {idx < 3 && (
                <div
                  className={`h-1.5 flex-1 mx-2 md:mx-3 rounded-full transition-all duration-300 ${
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
            <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Date firmă</h2>
              <p className="text-gray-600 mb-8">Completează informațiile despre organizația ta</p>

              <div className="space-y-4">
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      CUI <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cui"
                        value={formData.cui}
                        onChange={handleInputChange}
                        onBlur={handleCUIBlur}
                        className={`w-full border rounded-lg px-4 py-3 pr-10 text-sm font-mono focus:outline-none focus:ring-2 transition-all ${
                          cuiError
                            ? 'border-red-500 focus:ring-red-500'
                            : anafSuggestion
                            ? 'border-green-500 focus:ring-green-500'
                            : 'border-gray-300 focus:ring-blue-600'
                        }`}
                        placeholder="RO12345678"
                        maxLength={12}
                      />
                      {loadingANAF && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        </div>
                      )}
                      {!loadingANAF && anafSuggestion && !cuiError && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      )}
                    </div>
                    {cuiError && (
                      <p className="text-xs text-red-600 mt-1 font-semibold">{cuiError}</p>
                    )}
                    {anafSuggestion && !cuiError && (
                      <p className="text-xs text-green-600 mt-1 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> {anafSuggestion}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Validare automată cu check digit și ANAF
                    </p>
                  </div>

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
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Adresă <span className="text-red-500">*</span>
                  </label>
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

          {/* Step 2: Angajați */}
          {step === 2 && (
            <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Adaugă primii angajați</h2>
              <p className="text-gray-600 mb-8">
                Adaugă angajații pentru gestionarea conformității SSM
              </p>

              {/* Form adăugare angajat */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6 border-2 border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Nume complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={currentEmployee.fullName}
                      onChange={handleEmployeeChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Ex: Popescu Ion"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        CNP <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="cnp"
                        value={currentEmployee.cnp}
                        onChange={handleEmployeeChange}
                        maxLength={13}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                        placeholder="1234567890123"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Funcția <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={currentEmployee.jobTitle}
                        onChange={handleEmployeeChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Ex: Electrician"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Cod COR (Clasificarea Ocupațiilor din România)
                    </label>
                    <input
                      type="text"
                      name="corCode"
                      value={currentEmployee.corCode}
                      onChange={handleEmployeeChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Ex: 742101"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addEmployee}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                  >
                    Adaugă angajat
                  </button>
                </div>
              </div>

              {/* Listă angajați adăugați */}
              {employees.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">
                    Angajați adăugați ({employees.length})
                  </h3>
                  <div className="space-y-3">
                    {employees.map((emp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{emp.fullName}</div>
                          <div className="text-sm text-gray-600">
                            {emp.jobTitle} {emp.corCode && `• COR: ${emp.corCode}`}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEmployee(idx)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {employees.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-6">
                  Nu ai adăugat niciun angajat încă
                </p>
              )}
            </div>
          )}

          {/* Step 3: Documente (optional) */}
          {step === 3 && (
            <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Încarcă documente existente</h2>
              <p className="text-gray-600 mb-8">
                Opțional: Încarcă documente SSM/PSI existente (contracte, fișe medicale, evaluări de risc)
              </p>

              <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300 text-center">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <label className="cursor-pointer">
                  <span className="text-blue-600 font-semibold hover:text-blue-700">
                    Selectează fișiere
                  </span>
                  <span className="text-gray-600"> sau trage-le aici</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  PDF, DOC, DOCX, JPG, PNG (max 10MB per fișier)
                </p>
              </div>

              {documents.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Fișiere selectate ({documents.length})
                  </h3>
                  <div className="space-y-2">
                    {documents.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
                      >
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-500 mt-6 text-center">
                Poți sări acest pas și adăuga documente mai târziu din dashboard
              </p>
            </div>
          )}

          {/* Step 4: Confirmare */}
          {step === 4 && (
            <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
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
                    <div className="md:col-span-2">
                      <span className="text-gray-500">Adresă:</span>
                      <p className="font-semibold text-gray-900">{formData.address}</p>
                    </div>
                  </div>
                </div>

                {/* Angajați */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Angajați ({employees.length})
                  </h3>
                  <div className="space-y-2">
                    {employees.map((emp, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-semibold text-gray-900">{emp.fullName}</span>
                        <span className="text-gray-600"> — {emp.jobTitle}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documente */}
                {documents.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-blue-600" />
                      Documente încărcate ({documents.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {documents.map((doc, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
                        >
                          <Check className="w-4 h-4" /> {doc.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 ? (
              <button
                onClick={() => transitionToStep(step - 1)}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-semibold transition disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5" />
                Înapoi
              </button>
            ) : (
              <div />
            )}

            {step === 1 && (
              <button
                onClick={handleStep1Complete}
                disabled={!canProceedStep1 || loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Se salvează...' : 'Continuă'}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            {step === 2 && (
              <button
                onClick={handleStep2Complete}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Se salvează...' : 'Continuă'}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            {step === 3 && (
              <button
                onClick={() => transitionToStep(4)}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {documents.length > 0 ? 'Continuă' : 'Sari peste'}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            {step === 4 && (
              <button
                onClick={handleFinalSubmit}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-lg"
              >
                {loading ? 'Se finalizează...' : 'Finalizează și intră în dashboard'}
                <CheckCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
