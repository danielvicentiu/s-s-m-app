'use client'

import { useState, useMemo } from 'react'
import { COUNTRY_FLAGS, COUNTRY_NAMES, CountryCode, COUNTRY_CURRENCIES } from '@/lib/types'
import { Calculator, TrendingDown } from 'lucide-react'

interface PricingPlan {
  name: string
  maxEmployees: number
  monthlyPrice: Record<CountryCode, number>
  features: string[]
  recommended?: boolean
}

const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Starter',
    maxEmployees: 10,
    monthlyPrice: { RO: 99, BG: 40, HU: 8000, DE: 29, PL: 120 },
    features: ['Evidență medicală', 'Alerte automate', 'Rapoarte basic']
  },
  {
    name: 'Business',
    maxEmployees: 50,
    monthlyPrice: { RO: 249, BG: 100, HU: 20000, DE: 69, PL: 280 },
    features: ['Toate din Starter', 'Echipamente PSI', 'API Access', 'White-label'],
    recommended: true
  },
  {
    name: 'Enterprise',
    maxEmployees: 200,
    monthlyPrice: { RO: 599, BG: 240, HU: 48000, DE: 159, PL: 650 },
    features: ['Toate din Business', 'SSO/SAML', 'Suport dedicat', 'SLA 99.9%']
  },
  {
    name: 'Corporate',
    maxEmployees: 1000,
    monthlyPrice: { RO: 1499, BG: 600, HU: 120000, DE: 399, PL: 1600 },
    features: ['Toate din Enterprise', 'Multi-țară', 'Manager dedicat', 'Consultanță inclusă']
  }
]

const INDUSTRIES = [
  { value: 'construction', label: 'Construcții', riskMultiplier: 1.5 },
  { value: 'manufacturing', label: 'Producție industrială', riskMultiplier: 1.4 },
  { value: 'transport', label: 'Transport/Logistică', riskMultiplier: 1.3 },
  { value: 'services', label: 'Servicii/IT', riskMultiplier: 1.0 },
  { value: 'retail', label: 'Retail/Comerț', riskMultiplier: 1.1 },
  { value: 'healthcare', label: 'Sănătate', riskMultiplier: 1.2 },
  { value: 'education', label: 'Educație', riskMultiplier: 1.0 },
  { value: 'other', label: 'Altele', riskMultiplier: 1.0 }
]

const MODULES = [
  { id: 'medical', label: 'Medicina muncii', mandatory: true },
  { id: 'fire', label: 'Prevenire incendii (PSI)', mandatory: false },
  { id: 'training', label: 'Instruiri SSM', mandatory: false },
  { id: 'equipment', label: 'Echipamente protecție', mandatory: false },
  { id: 'incidents', label: 'Gestionare incidente', mandatory: false },
  { id: 'compliance', label: 'Monitorizare conformitate', mandatory: false }
]

const PENALTY_RANGES: Record<CountryCode, { min: number; max: number }> = {
  RO: { min: 5000, max: 50000 },
  BG: { min: 2000, max: 20000 },
  HU: { min: 400000, max: 4000000 },
  DE: { min: 1000, max: 25000 },
  PL: { min: 8000, max: 80000 }
}

export default function EstimarePage() {
  const [employees, setEmployees] = useState(25)
  const [country, setCountry] = useState<CountryCode>('RO')
  const [industry, setIndustry] = useState('services')
  const [selectedModules, setSelectedModules] = useState<string[]>(['medical'])

  const industryData = INDUSTRIES.find(i => i.value === industry) || INDUSTRIES[3]
  const currency = COUNTRY_CURRENCIES[country]
  const penaltyRange = PENALTY_RANGES[country]

  const recommendedPlan = useMemo(() => {
    return PRICING_PLANS.find(p => employees <= p.maxEmployees) || PRICING_PLANS[PRICING_PLANS.length - 1]
  }, [employees])

  const monthlyPrice = recommendedPlan.monthlyPrice[country]

  // Calcul modul addon (10% per modul extra)
  const moduleAddons = selectedModules.length - 1 // medical e inclus
  const totalPrice = Math.round(monthlyPrice * (1 + moduleAddons * 0.1))

  // Calcul economie vs amenzi
  const avgPenalty = (penaltyRange.min + penaltyRange.max) / 2
  const annualRisk = avgPenalty * industryData.riskMultiplier * 0.3 // 30% șansă incident/an
  const annualCost = totalPrice * 12
  const savings = Math.round(annualRisk - annualCost)
  const roiMonths = annualRisk > 0 ? Math.round((annualCost / annualRisk) * 12) : 0

  // Calcul cost manual
  const manualCostPerEmployee = country === 'RO' ? 50 : country === 'DE' ? 15 : 20
  const manualMonthlyEstimate = employees * manualCostPerEmployee

  const toggleModule = (moduleId: string) => {
    const module = MODULES.find(m => m.id === moduleId)
    if (module?.mandatory) return

    if (selectedModules.includes(moduleId)) {
      setSelectedModules(selectedModules.filter(id => id !== moduleId))
    } else {
      setSelectedModules([...selectedModules, moduleId])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-black text-gray-900">
            s-s-m.ro
          </a>
          <div className="flex items-center gap-4">
            <a href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Preț
            </a>
            <a
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Intră în platformă
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-2 mb-4">
            <Calculator className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">
              Calculator interactiv — rezultate instant
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Calculează prețul pentru platforma ta SSM/PSI
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Configurează parametrii și vezi live costurile, economia vs amenzi și ROI
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Panel - Inputs */}
            <div className="lg:col-span-1 space-y-6">
              {/* Employees Slider */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Număr angajați
                </label>
                <div className="mb-4">
                  <input
                    type="range"
                    min="1"
                    max="500"
                    value={employees}
                    onChange={(e) => setEmployees(Number(e.target.value))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div className="text-center">
                  <span className="text-4xl font-bold text-blue-600">{employees}</span>
                  <span className="text-gray-500 ml-2">angajați</span>
                </div>
              </div>

              {/* Country Selector */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Selectați țara
                </label>
                <div className="space-y-2">
                  {(Object.keys(COUNTRY_NAMES) as CountryCode[]).map((code) => (
                    <button
                      key={code}
                      onClick={() => setCountry(code)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                        country === code
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="text-2xl">{COUNTRY_FLAGS[code]}</span>
                      <span>{COUNTRY_NAMES[code]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Industry Dropdown */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Industrie
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind.value} value={ind.value}>
                      {ind.label}
                    </option>
                  ))}
                </select>
                {industryData.riskMultiplier > 1.1 && (
                  <p className="mt-2 text-xs text-orange-600">
                    ⚠️ Industrie cu risc crescut ({industryData.riskMultiplier}x)
                  </p>
                )}
              </div>

              {/* Modules Checkboxes */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Module necesare
                </label>
                <div className="space-y-3">
                  {MODULES.map((module) => (
                    <label
                      key={module.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedModules.includes(module.id)
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${module.mandatory ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedModules.includes(module.id)}
                        onChange={() => toggleModule(module.id)}
                        disabled={module.mandatory}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {module.label}
                        {module.mandatory && <span className="text-blue-600 ml-1">(inclus)</span>}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recommended Plan */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 shadow-xl text-white">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-blue-200 text-sm font-medium mb-1">Plan recomandat</p>
                    <h2 className="text-4xl font-bold">{recommendedPlan.name}</h2>
                  </div>
                  {recommendedPlan.recommended && (
                    <span className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold">
                      ⭐ Popular
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{totalPrice.toLocaleString()}</span>
                    <span className="text-2xl font-medium">{currency}</span>
                    <span className="text-blue-200">/lună</span>
                  </div>
                  {moduleAddons > 0 && (
                    <p className="text-blue-200 text-sm mt-2">
                      Include {moduleAddons} modul{moduleAddons > 1 ? 'e' : ''} adițional{moduleAddons > 1 ? 'e' : ''} (+{moduleAddons * 10}%)
                    </p>
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  {recommendedPlan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-blue-100">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-white text-blue-600 font-bold py-4 px-6 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl">
                  Abonează-te acum →
                </button>
              </div>

              {/* ROI & Savings */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Economie anuală</p>
                      <p className="text-2xl font-bold text-green-600">
                        {savings > 0 ? `+${savings.toLocaleString()}` : savings.toLocaleString()} {currency}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    vs. risc amenzi și incidente în industria {industryData.label.toLowerCase()}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ROI estimat</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {roiMonths < 12 ? `${roiMonths} luni` : `${Math.round(roiMonths / 12)} ani`}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Timp de recuperare investiție prin reducerea riscurilor
                  </p>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Comparație: Digital vs. Manual
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Caracteristică</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-blue-700">Digital (S-S-M.ro)</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-500">Manual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-3 px-4 text-sm text-gray-700">Cost lunar</td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-blue-600">{totalPrice} {currency}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-gray-700">{manualMonthlyEstimate} {currency}</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-sm text-gray-700">Timp procesare/angajat</td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-green-600 font-semibold">2 min</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-orange-600 font-semibold">30 min</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-sm text-gray-700">Alerte automate</td>
                        <td className="py-3 px-4 text-center text-green-600 font-bold">✓</td>
                        <td className="py-3 px-4 text-center text-red-500 font-bold">✗</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-sm text-gray-700">Rapoarte instant</td>
                        <td className="py-3 px-4 text-center text-green-600 font-bold">✓</td>
                        <td className="py-3 px-4 text-center text-red-500 font-bold">✗</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-sm text-gray-700">Conformitate legislație</td>
                        <td className="py-3 px-4 text-center text-green-600 font-bold">✓ Auto-update</td>
                        <td className="py-3 px-4 text-center text-orange-600 font-bold">Manual</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-sm text-gray-700">Risc erori umane</td>
                        <td className="py-3 px-4 text-center text-green-600 font-bold">Scăzut</td>
                        <td className="py-3 px-4 text-center text-red-500 font-bold">Ridicat</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* All Plans Comparison */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Toate planurile disponibile
                </h3>
                <div className="grid md:grid-cols-4 gap-4">
                  {PRICING_PLANS.map((plan) => (
                    <div
                      key={plan.name}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        plan.name === recommendedPlan.name
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h4 className="font-bold text-gray-900 mb-1">{plan.name}</h4>
                      <p className="text-sm text-gray-500 mb-2">până la {plan.maxEmployees} angajați</p>
                      <p className="text-2xl font-bold text-blue-600 mb-2">
                        {plan.monthlyPrice[country]} {currency}
                        <span className="text-sm text-gray-500 font-normal">/lună</span>
                      </p>
                      {plan.name === recommendedPlan.name && (
                        <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                          Recomandat
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Penalty Risk Warning */}
              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-900 mb-2">Atenție la amenzi!</h4>
                    <p className="text-sm text-orange-700 mb-2">
                      În {COUNTRY_NAMES[country]}, amenzile pentru neconformitate SSM/PSI variază între{' '}
                      <strong>{penaltyRange.min.toLocaleString()} - {penaltyRange.max.toLocaleString()} {currency}</strong>.
                    </p>
                    <p className="text-sm text-orange-700">
                      Sectorul {industryData.label.toLowerCase()} are un risc de {industryData.riskMultiplier}x peste medie.
                      Investiția în digitizare se poate amortiza la primul incident evitat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <div className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Gata să începi?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Peste 100+ consultanți SSM și 500+ companii au digitizat deja procesele de conformitate.
              Începe cu o perioadă de probă gratuită de 14 zile.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/login"
                className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl inline-block"
              >
                Încearcă gratuit 14 zile
              </a>
              <a
                href="/contact"
                className="bg-blue-700 text-white font-bold py-4 px-8 rounded-xl hover:bg-blue-800 transition-all border-2 border-blue-400 inline-block"
              >
                Programează demo
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>© 2026 s-s-m.ro — Platformă digitală pentru conformitate SSM & PSI</p>
          <div className="mt-4 flex items-center justify-center gap-6">
            <a href="/" className="hover:text-gray-900 transition-colors">
              Acasă
            </a>
            <a href="/pricing" className="hover:text-gray-900 transition-colors">
              Preț
            </a>
            <a href="/login" className="hover:text-gray-900 transition-colors">
              Login
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
