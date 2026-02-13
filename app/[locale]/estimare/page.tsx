'use client'

import { useState } from 'react'
import { Calculator, TrendingDown, Check, Globe, Users, Building2, Package, Award } from 'lucide-react'
import Link from 'next/link'

interface Country {
  code: string
  name: string
  currency: string
  flag: string
}

interface Sector {
  code: string
  name: string
  riskLevel: 'low' | 'medium' | 'high'
}

interface Module {
  id: string
  name: string
  description: string
  basePrice: number
  required: boolean
}

const countries: Country[] = [
  { code: 'RO', name: 'România', currency: 'RON', flag: '🇷🇴' },
  { code: 'BG', name: 'Bulgaria', currency: 'BGN', flag: '🇧🇬' },
  { code: 'HU', name: 'Ungaria', currency: 'HUF', flag: '🇭🇺' },
  { code: 'DE', name: 'Germania', currency: 'EUR', flag: '🇩🇪' },
  { code: 'PL', name: 'Polonia', currency: 'PLN', flag: '🇵🇱' },
]

const sectors: Sector[] = [
  { code: '4120', name: 'Construcții de clădiri rezidențiale și nerezidențiale', riskLevel: 'high' },
  { code: '4312', name: 'Lucrări de pregătire a terenului', riskLevel: 'high' },
  { code: '4941', name: 'Transporturi rutiere de mărfuri', riskLevel: 'medium' },
  { code: '5610', name: 'Restaurante', riskLevel: 'medium' },
  { code: '4711', name: 'Comerț cu amănuntul în magazine nespecializate', riskLevel: 'low' },
  { code: '6201', name: 'Activități de realizare a soft-ului la comandă', riskLevel: 'low' },
  { code: '6202', name: 'Activități de consultanță în tehnologia informației', riskLevel: 'low' },
  { code: '7022', name: 'Activități de consultanță în management', riskLevel: 'low' },
  { code: '4520', name: 'Întreținerea și repararea autovehiculelor', riskLevel: 'medium' },
  { code: '2511', name: 'Fabricarea de construcții metalice și părți componente', riskLevel: 'high' },
]

const modules: Module[] = [
  {
    id: 'ssm',
    name: 'SSM (Securitatea și Sănătatea în Muncă)',
    description: 'Management complet SSM, evaluări de risc, fișe de protecție',
    basePrice: 150,
    required: true,
  },
  {
    id: 'psi',
    name: 'PSI (Prevenire și Stingere Incendii)',
    description: 'Documentație PSI, scenarii de securitate la incendiu',
    basePrice: 100,
    required: true,
  },
  {
    id: 'medical',
    name: 'Monitorizare Medicală',
    description: 'Urmărire examene medicale, fișe aptitudine, planificare controale',
    basePrice: 50,
    required: false,
  },
  {
    id: 'trainings',
    name: 'Instruiri și Training-uri',
    description: 'Planificare și monitorizare instruiri SSM/PSI obligatorii',
    basePrice: 40,
    required: false,
  },
  {
    id: 'equipment',
    name: 'Echipamente de Protecție',
    description: 'Gestiune EIP/EPI, dotări obligatorii, verificări tehnice',
    basePrice: 40,
    required: false,
  },
  {
    id: 'documents',
    name: 'Management Documente',
    description: 'Arhivă digitală securizată, autorizații, certificate, rapoarte',
    basePrice: 30,
    required: false,
  },
]

export default function EstimarePage() {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0])
  const [employeeCount, setEmployeeCount] = useState(10)
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null)
  const [selectedModules, setSelectedModules] = useState<string[]>(['ssm', 'psi'])

  const toggleModule = (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId)
    if (module?.required) return

    if (selectedModules.includes(moduleId)) {
      setSelectedModules(selectedModules.filter((id) => id !== moduleId))
    } else {
      setSelectedModules([...selectedModules, moduleId])
    }
  }

  // Calculate pricing
  const calculatePrice = () => {
    let basePrice = 0

    selectedModules.forEach((moduleId) => {
      const module = modules.find((m) => m.id === moduleId)
      if (module) {
        basePrice += module.basePrice
      }
    })

    // Employee multiplier
    let employeeMultiplier = 1
    if (employeeCount <= 10) employeeMultiplier = 1
    else if (employeeCount <= 25) employeeMultiplier = 1.3
    else if (employeeCount <= 50) employeeMultiplier = 1.6
    else if (employeeCount <= 100) employeeMultiplier = 2.0
    else if (employeeCount <= 250) employeeMultiplier = 2.5
    else employeeMultiplier = 3.0

    // Risk level multiplier
    let riskMultiplier = 1.0
    if (selectedSector) {
      if (selectedSector.riskLevel === 'medium') riskMultiplier = 1.2
      else if (selectedSector.riskLevel === 'high') riskMultiplier = 1.5
    }

    const monthlyPrice = Math.round(basePrice * employeeMultiplier * riskMultiplier)

    // Traditional consultant estimate (much higher)
    const traditionalMonthly = Math.round(monthlyPrice * 3.5)
    const savings = traditionalMonthly - monthlyPrice
    const savingsPercentage = Math.round((savings / traditionalMonthly) * 100)

    return {
      monthly: monthlyPrice,
      yearly: monthlyPrice * 12,
      traditionalMonthly,
      traditionalYearly: traditionalMonthly * 12,
      savings,
      savingsYearly: savings * 12,
      savingsPercentage,
    }
  }

  const pricing = calculatePrice()

  const formatPrice = (amount: number) => {
    const currencySymbols: { [key: string]: string } = {
      RON: 'lei',
      BGN: 'лв',
      HUF: 'Ft',
      EUR: '€',
      PLN: 'zł',
    }
    return `${amount.toLocaleString()} ${currencySymbols[selectedCountry.currency]}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black text-white">
            s-s-m.ro
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-gray-300 hover:text-white transition-colors">
              Preț
            </Link>
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Intră în platformă
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-2 mb-6">
            <Calculator className="w-4 h-4 text-blue-300" />
            <span className="text-sm font-semibold text-blue-200">
              Estimare instant • Fără obligații • 100% gratuit
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Calculează prețul
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              conformității SSM/PSI
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Descoperă în 60 de secunde cât costă să fii în regulă cu legislația muncii,
            ce module ai nevoie și cât economisești față de un consultant tradițional.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              ZERO date personale
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              ZERO login necesar
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Rezultat instant
            </div>
          </div>
        </div>
      </section>

      {/* Main Calculator */}
      <section className="px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl">

            {/* Step 1: Country Selector */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-black flex items-center justify-center text-lg shadow-lg">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Țara de operare</h2>
                  <p className="text-sm text-gray-400">Selectează țara în care activezi</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => setSelectedCountry(country)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedCountry.code === country.code
                        ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="text-4xl mb-2">{country.flag}</div>
                    <div className="text-sm font-bold text-white">{country.name}</div>
                    <div className="text-xs text-gray-400">{country.currency}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Employee Count Slider */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white font-black flex items-center justify-center text-lg shadow-lg">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Număr angajați</h2>
                  <p className="text-sm text-gray-400">Ajustează numărul total de angajați</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Angajați:</span>
                  <span className="text-4xl font-black text-white">{employeeCount}</span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="500"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(parseInt(e.target.value))}
                  className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${(employeeCount / 500) * 100}%, rgba(255,255,255,0.1) ${(employeeCount / 500) * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />

                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1</span>
                  <span>100</span>
                  <span>250</span>
                  <span>500</span>
                </div>
              </div>
            </div>

            {/* Step 3: CAEN Sector */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white font-black flex items-center justify-center text-lg shadow-lg">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Sector CAEN</h2>
                  <p className="text-sm text-gray-400">Selectează domeniul tău de activitate</p>
                </div>
              </div>

              <select
                value={selectedSector?.code || ''}
                onChange={(e) => {
                  const sector = sectors.find((s) => s.code === e.target.value)
                  setSelectedSector(sector || null)
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition"
              >
                <option value="" className="bg-gray-900">Selectează un sector...</option>
                {sectors.map((sector) => (
                  <option key={sector.code} value={sector.code} className="bg-gray-900">
                    {sector.code} - {sector.name}
                  </option>
                ))}
              </select>

              {selectedSector && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-gray-400">Nivel risc:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      selectedSector.riskLevel === 'low'
                        ? 'bg-green-500/20 text-green-300'
                        : selectedSector.riskLevel === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {selectedSector.riskLevel === 'low' ? 'Scăzut' : selectedSector.riskLevel === 'medium' ? 'Mediu' : 'Ridicat'}
                  </span>
                </div>
              )}
            </div>

            {/* Step 4: Modules */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white font-black flex items-center justify-center text-lg shadow-lg">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Module necesare</h2>
                  <p className="text-sm text-gray-400">Selectează funcționalitățile de care ai nevoie</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {modules.map((module) => {
                  const isSelected = selectedModules.includes(module.id)
                  const isRequired = module.required

                  return (
                    <button
                      key={module.id}
                      onClick={() => toggleModule(module.id)}
                      disabled={isRequired}
                      className={`text-left p-5 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      } ${isRequired ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected ? 'bg-blue-500 border-blue-500' : 'border-white/30'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <h3 className="font-bold text-white">{module.name}</h3>
                        </div>
                        {isRequired && (
                          <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                            Obligatoriu
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{module.description}</p>
                      <div className="text-lg font-bold text-blue-400">
                        +{module.basePrice} {selectedCountry.currency}/lună
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Pricing Result */}
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border-2 border-blue-500/30">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white font-black flex items-center justify-center text-2xl shadow-lg">
                  ✓
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Rezultatul tău</h2>
                  <p className="text-sm text-gray-400">Prețuri estimate pentru configurația selectată</p>
                </div>
              </div>

              {/* Price Comparison */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* s-s-m.ro Price */}
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/40 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-green-400" />
                    <h3 className="text-sm font-bold text-green-300 uppercase">Platformă s-s-m.ro</h3>
                  </div>
                  <div className="text-5xl font-black text-white mb-2">
                    {formatPrice(pricing.monthly)}
                  </div>
                  <div className="text-gray-400 text-sm mb-4">/lună</div>
                  <div className="text-xl font-bold text-green-300">
                    {formatPrice(pricing.yearly)} /an
                  </div>
                </div>

                {/* Traditional Consultant Price */}
                <div className="bg-white/5 border-2 border-white/10 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-red-500/20 text-red-300 text-xs font-bold px-3 py-1 rounded-full">
                    3.5x mai scump
                  </div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Consultant Tradițional</h3>
                  <div className="text-5xl font-black text-gray-400 mb-2 line-through opacity-60">
                    {formatPrice(pricing.traditionalMonthly)}
                  </div>
                  <div className="text-gray-500 text-sm mb-4">/lună</div>
                  <div className="text-xl font-bold text-gray-500 line-through opacity-60">
                    {formatPrice(pricing.traditionalYearly)} /an
                  </div>
                </div>
              </div>

              {/* Savings Highlight */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <TrendingDown className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">
                      Economisești {formatPrice(pricing.savings)}/lună
                    </h3>
                    <p className="text-yellow-200 text-lg mb-3">
                      Adică <strong>{formatPrice(pricing.savingsYearly)} pe an</strong> ({pricing.savingsPercentage}% economie)
                    </p>
                    <p className="text-gray-300 text-sm">
                      Investiția în conformitate digitală se amortizează instant.
                      O singură amendă ITM/ISU poate costa mai mult decât abonamentul anual.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-3xl mb-2">⚡</div>
                  <h4 className="font-bold text-white mb-1">Actualizare automată</h4>
                  <p className="text-sm text-gray-400">Legislație mereu la zi, fără costuri suplimentare</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-3xl mb-2">📱</div>
                  <h4 className="font-bold text-white mb-1">Disponibil 24/7</h4>
                  <p className="text-sm text-gray-400">Acces nelimitat, oricând și de oriunde</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-3xl mb-2">🔒</div>
                  <h4 className="font-bold text-white mb-1">Date securizate</h4>
                  <p className="text-sm text-gray-400">Cloud backup automat, zero risc pierdere date</p>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-purple-700 transition shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30"
                >
                  <Award className="w-5 h-5" />
                  Începe acum cu {formatPrice(pricing.monthly)}/lună
                </Link>
                <p className="text-sm text-gray-400 mt-4">
                  Primele 14 zile gratuit • Anulare oricând • Fără card necesar la înregistrare
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 px-8 py-6">
              <div>
                <div className="text-3xl font-black text-white">100+</div>
                <div className="text-sm text-gray-400">Clienți activi</div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div>
                <div className="text-3xl font-black text-white">5,000+</div>
                <div className="text-sm text-gray-400">Angajați monitorizați</div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div>
                <div className="text-3xl font-black text-white">20+</div>
                <div className="text-sm text-gray-400">Ani experiență SSM</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>© 2026 s-s-m.ro — Platformă digitală pentru conformitate SSM & PSI</p>
          <div className="mt-4 flex items-center justify-center gap-6">
            <Link href="/" className="hover:text-white transition-colors">
              Acasă
            </Link>
            <Link href="/pricing" className="hover:text-white transition-colors">
              Preț
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Login
            </Link>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, rgb(59 130 246), rgb(147 51 234));
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
          transition: transform 0.2s;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, rgb(59 130 246), rgb(147 51 234));
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
          border: none;
          transition: transform 0.2s;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  )
}
