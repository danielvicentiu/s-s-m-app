'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { StepWrapper } from './StepWrapper'

const JUDETE = [
  'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani', 'Brăila', 'Brașov',
  'București', 'Buzău', 'Călărași', 'Caraș-Severin', 'Cluj', 'Constanța', 'Covasna', 'Dâmbovița',
  'Dolj', 'Galați', 'Giurgiu', 'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov',
  'Maramureș', 'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Sălaj', 'Satu Mare', 'Sibiu',
  'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vâlcea', 'Vaslui', 'Vrancea',
]

export interface CompanyFormData {
  name: string
  cui: string
  address: string
  county: string
  caen_code: string
  tva: boolean
  email: string
  phone: string
}

interface Props {
  data: CompanyFormData
  onChange: (data: CompanyFormData) => void
  onNext: () => void
  onBack: () => void
  userEmail: string
}

export function StepCompany({ data, onChange, onNext, onBack, userEmail }: Props) {
  const [cuiInput, setCuiInput] = useState(data.cui || '')
  const [loadingAnaf, setLoadingAnaf] = useState(false)
  const [anafSuccess, setAnafSuccess] = useState(false)
  const [anafError, setAnafError] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Initialize email from user
  useEffect(() => {
    if (!data.email && userEmail) {
      onChange({ ...data, email: userEmail })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const lookupAnaf = async (cui: string) => {
    const cleanCui = cui.replace(/\D/g, '')
    if (!cleanCui || cleanCui.length < 4) return

    setLoadingAnaf(true)
    setAnafError('')
    setAnafSuccess(false)

    try {
      const res = await fetch('/api/onboarding/anaf-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cui: cleanCui }),
      })
      const result = await res.json()

      if (result.error) {
        setAnafError(result.error)
      } else if (result.denumire) {
        onChange({
          ...data,
          cui: cleanCui,
          name: result.denumire || '',
          address: result.adresa || '',
          county: result.judet || '',
          caen_code: result.caen_code || '',
          tva: result.tva || false,
        })
        setAnafSuccess(true)
      } else {
        setAnafError('CUI neidentificat în registrul ANAF.')
      }
    } catch {
      setAnafError('Serviciul ANAF nu răspunde. Completați manual.')
    } finally {
      setLoadingAnaf(false)
    }
  }

  const handleCuiChange = (val: string) => {
    setCuiInput(val)
    onChange({ ...data, cui: val.replace(/\D/g, '') })
    setAnafSuccess(false)
    setAnafError('')

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      lookupAnaf(val)
    }, 500)
  }

  const handleManualChange = (field: keyof CompanyFormData, value: string | boolean) => {
    onChange({ ...data, [field]: value })
  }

  const canProceed = data.email.trim().includes('@')

  return (
    <StepWrapper
      title="Date firmă (opțional)"
      subtitle="Puteți completa mai târziu din dashboard. Singurul câmp obligatoriu este emailul."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!canProceed}
    >
      <div className="space-y-5">
        {/* CUI lookup */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            CUI (Cod Unic de Înregistrare)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={cuiInput}
              onChange={(e) => handleCuiChange(e.target.value)}
              placeholder="Ex: 12345678 sau RO12345678"
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="button"
              onClick={() => lookupAnaf(cuiInput)}
              disabled={loadingAnaf || cuiInput.length < 4}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-100 border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loadingAnaf ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Completare automată</span>
            </button>
          </div>

          {anafSuccess && (
            <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Date completate automat din ANAF
            </div>
          )}
          {anafError && (
            <div className="mt-2 flex items-center gap-2 text-sm text-amber-600">
              <AlertCircle className="h-4 w-4" />
              {anafError}
            </div>
          )}
        </div>

        {/* Denumire */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Denumire firmă
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => handleManualChange('name', e.target.value)}
            readOnly={anafSuccess && !!data.name}
            placeholder="Ex: ACME SRL"
            className={`w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
              anafSuccess && data.name ? 'bg-gray-50 cursor-default' : 'bg-white'
            }`}
          />
        </div>

        {/* Adresă + Județ */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Adresă sediu</label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => handleManualChange('address', e.target.value)}
              readOnly={anafSuccess && !!data.address}
              placeholder="Str. Exemplu nr. 1"
              className={`w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                anafSuccess && data.address ? 'bg-gray-50 cursor-default' : 'bg-white'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Județ</label>
            <select
              value={data.county}
              onChange={(e) => handleManualChange('county', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Selectați județul</option>
              {JUDETE.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-100" />

        {/* Email — obligatoriu */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleManualChange('email', e.target.value)}
            placeholder="email@firma.ro"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Telefon — opțional */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Telefon</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => handleManualChange('phone', e.target.value)}
            placeholder="0721 234 567"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <p className="mt-1 text-xs text-gray-400">
            Opțional — doar pentru WhatsApp. Nu sunăm.
          </p>
        </div>
      </div>
    </StepWrapper>
  )
}
