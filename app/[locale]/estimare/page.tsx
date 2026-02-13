'use client'

import { Calculator, TrendingDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import ActivitySearch from '@/components/ActivitySearch'
import EmployeeCount from '@/components/EmployeeCount'
import EstimateResult from '@/components/EstimateResult'
import OfferLink from '@/components/OfferLink'
import OrgTypeSelector from '@/components/OrgTypeSelector'
import RoleSelector from '@/components/RoleSelector'

interface Activity {
  id: string
  caen: string
  name: string
  synonyms: string[]
  riskLevel: string
  category: string
}

interface OrgType {
  id: string
  name: string
  fullName: string
  maxEmployees: number | null
  legalPersonality: boolean
  isDefault?: boolean
  note?: string
}

export default function EstimarePage() {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [employeeCount, setEmployeeCount] = useState('1-5')
  const [orgType, setOrgType] = useState<OrgType>({
    id: 'srl',
    name: 'SRL',
    fullName: 'Societate cu Răspundere Limitată',
    maxEmployees: null,
    legalPersonality: true,
    isDefault: true,
  })
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  // Auto-adjust employee count based on org type restrictions
  useEffect(() => {
    if (orgType.maxEmployees !== null) {
      const currentMax = getEmployeeMax(employeeCount)
      if (currentMax > orgType.maxEmployees) {
        // Auto-adjust to max allowed
        if (orgType.maxEmployees === 0) {
          setEmployeeCount('0')
        } else if (orgType.maxEmployees <= 5) {
          setEmployeeCount('1-5')
        } else if (orgType.maxEmployees <= 10) {
          setEmployeeCount('6-10')
        } else if (orgType.maxEmployees <= 20) {
          setEmployeeCount('11-20')
        }
      }
    }

    // Special case for IF (Întreprindere Familială)
    if (orgType.id === 'if') {
      setEmployeeCount('0')
    }
  }, [orgType])

  const getEmployeeMax = (range: string): number => {
    if (range === '0') {return 0}
    if (range === '50+') {return 100}
    const parts = range.split('-')
    return parseInt(parts[parts.length - 1])
  }

  return (
    <div className="min-h-screen bg-[#0B1120]">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0B1120]/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-black text-white">
            s-s-m.ro
          </a>
          <div className="flex items-center gap-4">
            <a href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
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
      <section className="pt-16 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
            <Calculator className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-300">
              Estimare gratuită, fără obligații
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Cât costă conformitatea
            <br />
            <span className="text-blue-400">pentru firma ta?</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Află în 60 de secunde ce obligații ai, cât costă să fii în regulă și ce riști dacă nu
            ești.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              ZERO date personale
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              ZERO login
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Rezultat instant
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 pb-32">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Step 1: Activity */}
          <div className="bg-[#1a2332] rounded-2xl p-6 md:p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center">
                1
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Activitatea ta</h2>
                <p className="text-sm text-gray-400">Obligatoriu — restul sunt opționale</p>
              </div>
            </div>
            <ActivitySearch onSelect={setSelectedActivity} selected={selectedActivity} />
          </div>

          {/* Step 2 & 2.5: Employees + Org Type */}
          {selectedActivity && (
            <div className="bg-[#1a2332] rounded-2xl p-6 md:p-8 border border-gray-700 space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center">
                  2
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Detalii organizație</h2>
                  <p className="text-sm text-gray-400">Opțional — pentru estimare mai precisă</p>
                </div>
              </div>

              <EmployeeCount
                count={employeeCount}
                onChange={setEmployeeCount}
                maxEmployees={orgType.maxEmployees}
              />

              <div className="pt-6 border-t border-gray-800">
                <OrgTypeSelector selected={orgType.id} onChange={setOrgType} />
              </div>
            </div>
          )}

          {/* Step 3: Roles */}
          {selectedActivity && employeeCount !== '0' && (
            <div className="bg-[#1a2332] rounded-2xl p-6 md:p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-700 text-white font-black flex items-center justify-center">
                  3
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Posturi și funcții</h2>
                  <p className="text-sm text-gray-400">
                    Opțional — pentru calcul mai exact al costurilor per angajat
                  </p>
                </div>
              </div>

              <RoleSelector
                category={selectedActivity.category}
                selectedRoles={selectedRoles}
                onChange={setSelectedRoles}
              />
            </div>
          )}

          {/* Step 4: Results */}
          {selectedActivity && (
            <>
              <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-2xl p-6 md:p-8 border-2 border-blue-500/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center">
                    ✓
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">Rezultatul tău</h2>
                    <p className="text-sm text-gray-400">Live — se actualizează automat</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                  <TrendingDown className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-200">
                    <strong>Prevenția costă de Nx mai puțin decât o singură amendă.</strong>
                    <br />
                    Investiția în conformitate se amortizează instant la primul control ITM/ISU.
                  </div>
                </div>

                <EstimateResult
                  activity={selectedActivity}
                  employeeCount={employeeCount}
                  orgType={orgType.id}
                  selectedRoles={selectedRoles}
                />
              </div>

              {/* CTA Section */}
              <OfferLink
                activityId={selectedActivity.id}
                employeeCount={employeeCount}
                orgType={orgType.id}
              />
            </>
          )}

          {/* Empty state */}
          {!selectedActivity && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-400 mb-2">
                Alege o activitate pentru a începe
              </h3>
              <p className="text-gray-500">
                Scrie în câmpul de mai sus primele litere din activitatea ta
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6 bg-[#0B1120] mb-24">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2026 s-s-m.ro — Platformă digitală pentru conformitate SSM & PSI</p>
          <div className="mt-4 flex items-center justify-center gap-6">
            <a href="/" className="hover:text-white transition-colors">
              Acasă
            </a>
            <a href="/pricing" className="hover:text-white transition-colors">
              Preț
            </a>
            <a href="/login" className="hover:text-white transition-colors">
              Login
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
