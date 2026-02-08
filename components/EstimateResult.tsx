'use client'

import { useState, useEffect } from 'react'
import { Check, X, AlertTriangle, Shield } from 'lucide-react'
import obligationsData from '@/src/data/obligations-matrix.json'

interface Obligation {
  id: string
  name: string
  frequency: string
  costMin: number
  costMax: number
  costPerEmployee?: boolean
  fineMin: number
  fineMax: number
  law: string
  description: string
  mandatory: boolean
  appliesToZeroEmployees?: boolean
  riskBased?: boolean
  spaceBased?: boolean
  employeeThreshold?: number
}

interface Props {
  activity: any
  employeeCount: string
  orgType: string
  selectedRoles: string[]
}

export default function EstimateResult({ activity, employeeCount, orgType, selectedRoles }: Props) {
  const [checkedObligations, setCheckedObligations] = useState<Record<string, boolean>>({})
  const [allObligations, setAllObligations] = useState<Obligation[]>([])

  useEffect(() => {
    if (!activity) return

    // Combine all obligations
    const ssm = obligationsData.baseObligations.ssm as Obligation[]
    const psi = obligationsData.baseObligations.psi as Obligation[]
    const medicina = obligationsData.baseObligations.medicinaMuncii as Obligation[]

    let obligations = [...ssm, ...psi, ...medicina]

    // Filter based on employee count
    const hasEmployees = employeeCount !== '0'
    obligations = obligations.filter((obl) => {
      if (!hasEmployees && !obl.appliesToZeroEmployees) return false
      if (obl.employeeThreshold && getEmployeeMax(employeeCount) < obl.employeeThreshold)
        return false
      return true
    })

    setAllObligations(obligations)

    // Initialize all as checked (default)
    const initial: Record<string, boolean> = {}
    obligations.forEach((obl) => {
      initial[obl.id] = true
    })
    setCheckedObligations(initial)
  }, [activity, employeeCount])

  const getEmployeeMax = (range: string): number => {
    if (range === '0') return 0
    if (range === '50+') return 100
    const parts = range.split('-')
    return parseInt(parts[parts.length - 1])
  }

  const getEmployeeAvg = (range: string): number => {
    if (range === '0') return 0
    if (range === '50+') return 75
    const parts = range.split('-')
    if (parts.length === 1) return parseInt(parts[0])
    return (parseInt(parts[0]) + parseInt(parts[1])) / 2
  }

  const calculateTotals = () => {
    const employeeAvg = getEmployeeAvg(employeeCount)
    let costMin = 0
    let costMax = 0
    let fineMin = 0
    let fineMax = 0

    allObligations.forEach((obl) => {
      if (checkedObligations[obl.id]) {
        if (obl.costPerEmployee) {
          costMin += obl.costMin * employeeAvg
          costMax += obl.costMax * employeeAvg
        } else {
          costMin += obl.costMin
          costMax += obl.costMax
        }
      }

      // Fines always counted (even if checked - it's the risk)
      if (obl.costPerEmployee) {
        fineMin += obl.fineMin * employeeAvg
        fineMax += obl.fineMax * employeeAvg
      } else {
        fineMin += obl.fineMin
        fineMax += obl.fineMax
      }
    })

    return { costMin, costMax, fineMin, fineMax }
  }

  const toggleObligation = (id: string) => {
    setCheckedObligations((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (!activity) return null

  const { costMin, costMax, fineMin, fineMax } = calculateTotals()
  const ratio = costMin > 0 ? Math.round(fineMin / costMin) : 0

  const categoryMap: Record<string, string> = {
    ssm: 'SSM',
    psi: 'PSI',
    medicinaMuncii: 'Medicina Muncii',
  }

  const getCategory = (obl: Obligation): string => {
    if (obligationsData.baseObligations.ssm.find((o: any) => o.id === obl.id)) return 'ssm'
    if (obligationsData.baseObligations.psi.find((o: any) => o.id === obl.id)) return 'psi'
    return 'medicinaMuncii'
  }

  const groupedObligations = allObligations.reduce(
    (acc, obl) => {
      const cat = getCategory(obl)
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(obl)
      return acc
    },
    {} as Record<string, Obligation[]>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white mb-2">Estimarea ta personalizată</h2>
        <p className="text-gray-400">
          Servicii OBLIGATORII pentru <span className="text-blue-400">{activity.name}</span>
        </p>
      </div>

      {/* Obligations list */}
      <div className="space-y-6">
        {Object.entries(groupedObligations).map(([category, obligations]) => (
          <div key={category} className="bg-[#1a2332] rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              {categoryMap[category]}
            </h3>

            <div className="space-y-3">
              {obligations.map((obl) => (
                <div
                  key={obl.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    checkedObligations[obl.id]
                      ? 'bg-[#0B1120] border-blue-500/30'
                      : 'bg-[#0B1120]/50 border-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleObligation(obl.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all mt-0.5 ${
                        checkedObligations[obl.id]
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-600 hover:border-blue-500'
                      }`}
                    >
                      {checkedObligations[obl.id] && <Check className="w-4 h-4 text-white" />}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-white">{obl.name}</h4>
                          <p className="text-sm text-gray-400 mt-1">{obl.description}</p>
                          <div className="flex flex-wrap gap-3 mt-2 text-xs">
                            <span className="text-gray-500">
                              📅 {obl.frequency}
                            </span>
                            <span className="text-gray-500">
                              📋 {obl.law}
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="text-sm text-gray-400">Cost</div>
                          <div className="font-bold text-blue-400">
                            {obl.costPerEmployee ? (
                              <>
                                {obl.costMin}-{obl.costMax} RON
                                <div className="text-xs text-gray-500">per angajat</div>
                              </>
                            ) : (
                              <>
                                {obl.costMin.toLocaleString()}-{obl.costMax.toLocaleString()} RON
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-800">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-xs text-red-400">
                          Risc amendă:{' '}
                          <strong>
                            {obl.fineMin.toLocaleString()}-{obl.fineMax.toLocaleString()} RON
                          </strong>
                        </span>
                        {!checkedObligations[obl.id] && (
                          <span className="ml-auto text-xs text-green-400">✓ Acoperit</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Fixed bottom bar with totals */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0B1120] border-t-2 border-blue-600 p-4 md:p-6 shadow-2xl z-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-[#1a2332] rounded-xl p-4 border border-gray-700">
              <div className="text-sm text-gray-400 mb-1">Cost prevenție (anual)</div>
              <div className="text-2xl font-black text-blue-400">
                {costMin.toLocaleString()} - {costMax.toLocaleString()} RON
              </div>
            </div>

            <div className="bg-[#1a2332] rounded-xl p-4 border border-red-900">
              <div className="text-sm text-gray-400 mb-1">Risc amenzi (total)</div>
              <div className="text-2xl font-black text-red-400">
                {fineMin.toLocaleString()} - {fineMax.toLocaleString()} RON
              </div>
            </div>

            <div className="bg-[#1a2332] rounded-xl p-4 border border-green-900">
              <div className="text-sm text-gray-400 mb-1">Raport</div>
              <div className="text-xl font-black text-green-400">
                Amenzile costă {ratio}x mai mult
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white font-bold text-lg mb-3">
              Noi ne ocupăm de tot. Tu ai liniște.
            </p>
            <div className="text-sm text-gray-400">
              Zero dosare. Zero griji. Zero surprize la control.
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed bottom bar */}
      <div className="h-64"></div>
    </div>
  )
}
