'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  FileText,
  Download,
  ChevronLeft,
  Flame,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  DollarSign,
  Package,
  Shield,
  Clock
} from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import type { SafetyEquipment, EquipmentType } from '@/lib/types'

interface Props {
  user: { id: string; email: string }
  organizations: any[]
  equipment: SafetyEquipment[]
  equipmentTypes: EquipmentType[]
}

interface EquipmentStats {
  total: number
  byType: Record<string, number>
  verificationsThisMonth: number
  overdueCount: number
  validCount: number
  expiringCount: number
  totalMaintenanceCost: number
}

interface EquipmentStatus {
  valid: number
  expiring: number
  expired: number
}

export default function EquipmentReportClient({
  user,
  organizations,
  equipment,
  equipmentTypes
}: Props) {
  const [selectedOrg, setSelectedOrg] = useState<string>('all')
  const [isExporting, setIsExporting] = useState(false)

  // Calculare statistici echipamente
  const stats = useMemo<EquipmentStats>(() => {
    const filterByOrg = (items: SafetyEquipment[]) =>
      selectedOrg === 'all' ? items : items.filter(i => i.organization_id === selectedOrg)

    const filteredEquipment = filterByOrg(equipment)
    const today = new Date()
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    // Total echipamente per tip
    const byType: Record<string, number> = {}
    filteredEquipment.forEach(e => {
      byType[e.equipment_type] = (byType[e.equipment_type] || 0) + 1
    })

    // Verificări efectuate luna aceasta (bazat pe last_inspection_date)
    const verificationsThisMonth = filteredEquipment.filter(e => {
      if (!e.last_inspection_date) return false
      const inspectionDate = new Date(e.last_inspection_date)
      return inspectionDate >= thisMonthStart && inspectionDate <= thisMonthEnd
    }).length

    // Echipamente cu verificare depășită (expiry_date sau next_inspection_date trecut)
    const overdueCount = filteredEquipment.filter(e => {
      const expiry = new Date(e.expiry_date)
      return expiry < today
    }).length

    // Echipamente valide (expiry_date > azi + conforme)
    const validCount = filteredEquipment.filter(e => {
      const expiry = new Date(e.expiry_date)
      return expiry > today && e.is_compliant
    }).length

    // Echipamente în expirare (< 30 zile)
    const expiringCount = filteredEquipment.filter(e => {
      const expiry = new Date(e.expiry_date)
      const daysUntil = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntil >= 0 && daysUntil <= 30
    }).length

    // Cost mentenanță (simulat - în producție ar veni din BD sau calcul real)
    // Estimare: verificare = 50 RON, reparație = 200 RON
    const totalMaintenanceCost = verificationsThisMonth * 50 + overdueCount * 200

    return {
      total: filteredEquipment.length,
      byType,
      verificationsThisMonth,
      overdueCount,
      validCount,
      expiringCount,
      totalMaintenanceCost
    }
  }, [selectedOrg, equipment])

  // Calculare stare echipamente pentru grafic
  const equipmentStatus = useMemo<EquipmentStatus>(() => {
    return {
      valid: stats.validCount,
      expiring: stats.expiringCount,
      expired: stats.overdueCount
    }
  }, [stats])

  // Mapare nume tipuri echipamente
  const equipmentTypeNames: Record<string, string> = {
    stingator: 'Stingătoare',
    trusa_prim_ajutor: 'Truse prim ajutor',
    hidrant: 'Hidranți',
    detector_fum: 'Detectoare fum',
    detector_gaz: 'Detectoare gaz',
    iluminat_urgenta: 'Iluminat urgență',
    panou_semnalizare: 'Panouri semnalizare',
    trusa_scule: 'Truse scule',
    eip: 'EIP',
    altul: 'Altele'
  }

  // Handler export PDF
  async function handleExportPDF() {
    setIsExporting(true)
    try {
      // Create CSV export as intermediate solution
      const csvContent = generateCSVReport()
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `raport-echipamente-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } finally {
      setIsExporting(false)
    }
  }

  // Generare CSV pentru export
  function generateCSVReport(): string {
    const headers = [
      'Organizație',
      'Tip echipament',
      'Descriere',
      'Locație',
      'Serie',
      'Ultima verificare',
      'Data expirare',
      'Următoarea verificare',
      'Conforme',
      'Inspector',
      'Observații'
    ]

    const filterByOrg = (items: SafetyEquipment[]) =>
      selectedOrg === 'all' ? items : items.filter(i => i.organization_id === selectedOrg)

    const filteredEquipment = filterByOrg(equipment)

    const rows = filteredEquipment.map(e => {
      const org = organizations.find(o => o.id === e.organization_id)
      return [
        org?.name || 'N/A',
        equipmentTypeNames[e.equipment_type] || e.equipment_type,
        e.description || '',
        e.location || '',
        e.serial_number || '',
        e.last_inspection_date || '',
        e.expiry_date,
        e.next_inspection_date || '',
        e.is_compliant ? 'Da' : 'Nu',
        e.inspector_name || '',
        e.notes || ''
      ].map(cell => `"${cell}"`).join(',')
    })

    return [headers.join(','), ...rows].join('\n')
  }

  // Determinare culoare stare
  function getStatusColor(status: 'valid' | 'expiring' | 'expired'): string {
    if (status === 'valid') return 'text-green-600'
    if (status === 'expiring') return 'text-orange-600'
    return 'text-red-600'
  }

  function getStatusBg(status: 'valid' | 'expiring' | 'expired'): string {
    if (status === 'valid') return 'bg-green-50'
    if (status === 'expiring') return 'bg-orange-50'
    return 'bg-red-50'
  }

  function getStatusLabel(status: 'valid' | 'expiring' | 'expired'): string {
    if (status === 'valid') return 'Valabile'
    if (status === 'expiring') return 'În expirare'
    return 'Expirate'
  }

  // Calculare procent pentru grafic
  const totalForChart = equipmentStatus.valid + equipmentStatus.expiring + equipmentStatus.expired
  const validPercent = totalForChart > 0 ? Math.round((equipmentStatus.valid / totalForChart) * 100) : 0
  const expiringPercent = totalForChart > 0 ? Math.round((equipmentStatus.expiring / totalForChart) * 100) : 0
  const expiredPercent = totalForChart > 0 ? Math.round((equipmentStatus.expired / totalForChart) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Raport Echipamente PSI</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Analiză completă echipamente securitate și PSI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Selector organizație */}
              <select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toate organizațiile</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.name} {org.cui ? `(${org.cui})` : ''}
                  </option>
                ))}
              </select>

              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                {isExporting ? 'Exportare...' : 'Export CSV'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Statistici principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Total echipamente</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.total}
            </div>
            <p className="text-sm text-gray-500 mt-2">În toate categoriile</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Verificări luna aceasta</h3>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {stats.verificationsThisMonth}
            </div>
            <p className="text-sm text-gray-500 mt-2">Efectuate în {new Date().toLocaleDateString('ro-RO', { month: 'long' })}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Verificări depășite</h3>
            </div>
            <div className="text-3xl font-bold text-red-600">
              {stats.overdueCount}
            </div>
            <p className="text-sm text-gray-500 mt-2">Necesită atenție urgentă</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Cost mentenanță</h3>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {stats.totalMaintenanceCost.toLocaleString('ro-RO')}
            </div>
            <p className="text-sm text-gray-500 mt-2">RON (estimat luna curentă)</p>
          </div>
        </div>

        {/* Total echipamente per tip */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Flame className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Echipamente per tip
              </h2>
            </div>
          </div>

          <div className="p-6">
            {Object.keys(stats.byType).length === 0 ? (
              <EmptyState
                icon={Package}
                title="Nicio echipament înregistrat"
                description="Adăugați echipamente din modulul Echipamente PSI"
              />
            ) : (
              <div className="space-y-3">
                {Object.entries(stats.byType)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, count]) => (
                    <div key={type} className="flex items-center gap-4">
                      <div className="w-40 text-sm text-gray-700 font-medium">
                        {equipmentTypeNames[type] || type}
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                        <div
                          className="h-full flex items-center justify-end px-3 text-xs font-medium text-white bg-blue-600 transition-all"
                          style={{ width: `${Math.min(100, (count / stats.total) * 100)}%` }}
                        >
                          {count}
                        </div>
                      </div>
                      <div className="w-16 text-right text-sm text-gray-500">
                        {Math.round((count / stats.total) * 100)}%
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Grafic stare echipamente */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Stare echipamente
              </h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`rounded-xl border border-green-200 p-4 ${getStatusBg('valid')}`}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-gray-900">Valabile</span>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {equipmentStatus.valid}
                </div>
                <p className="text-sm text-gray-600 mt-1">{validPercent}% din total</p>
              </div>

              <div className={`rounded-xl border border-orange-200 p-4 ${getStatusBg('expiring')}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold text-gray-900">În expirare</span>
                </div>
                <div className="text-3xl font-bold text-orange-600">
                  {equipmentStatus.expiring}
                </div>
                <p className="text-sm text-gray-600 mt-1">{expiringPercent}% din total</p>
              </div>

              <div className={`rounded-xl border border-red-200 p-4 ${getStatusBg('expired')}`}>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-gray-900">Expirate</span>
                </div>
                <div className="text-3xl font-bold text-red-600">
                  {equipmentStatus.expired}
                </div>
                <p className="text-sm text-gray-600 mt-1">{expiredPercent}% din total</p>
              </div>
            </div>

            {/* Bare stivuite pentru vizualizare */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Distribuție stări echipamente</span>
              </div>
              <div className="h-12 flex rounded-lg overflow-hidden">
                {validPercent > 0 && (
                  <div
                    className="bg-green-500 flex items-center justify-center text-white text-sm font-medium"
                    style={{ width: `${validPercent}%` }}
                  >
                    {validPercent > 15 && `${validPercent}%`}
                  </div>
                )}
                {expiringPercent > 0 && (
                  <div
                    className="bg-orange-500 flex items-center justify-center text-white text-sm font-medium"
                    style={{ width: `${expiringPercent}%` }}
                  >
                    {expiringPercent > 15 && `${expiringPercent}%`}
                  </div>
                )}
                {expiredPercent > 0 && (
                  <div
                    className="bg-red-500 flex items-center justify-center text-white text-sm font-medium"
                    style={{ width: `${expiredPercent}%` }}
                  >
                    {expiredPercent > 15 && `${expiredPercent}%`}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Echipamente cu verificare depășită - detalii */}
        {stats.overdueCount > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Echipamente cu verificare depășită ({stats.overdueCount})
                </h2>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {equipment
                .filter(e => {
                  const filterByOrg = selectedOrg === 'all' || e.organization_id === selectedOrg
                  const isOverdue = new Date(e.expiry_date) < new Date()
                  return filterByOrg && isOverdue
                })
                .slice(0, 10)
                .map(e => {
                  const org = organizations.find(o => o.id === e.organization_id)
                  const daysOverdue = Math.ceil((new Date().getTime() - new Date(e.expiry_date).getTime()) / (1000 * 60 * 60 * 24))

                  return (
                    <div key={e.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {equipmentTypeNames[e.equipment_type] || e.equipment_type}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                              Expirat cu {daysOverdue} zile
                            </span>
                          </div>
                          {e.description && (
                            <p className="text-sm text-gray-600">{e.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>{org?.name || 'N/A'}</span>
                            {e.location && <span>Locație: {e.location}</span>}
                            {e.serial_number && <span>Serie: {e.serial_number}</span>}
                            <span>Expirat: {new Date(e.expiry_date).toLocaleDateString('ro-RO')}</span>
                          </div>
                        </div>
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      </div>
                    </div>
                  )
                })}
            </div>

            {stats.overdueCount > 10 && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  + încă {stats.overdueCount - 10} echipamente cu verificare depășită
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4">
          <p className="text-sm text-blue-900">
            <strong>Notă:</strong> Acest raport este generat automat pe baza echipamentelor introduse în platformă.
            Costurile de mentenanță sunt estimate. Pentru detalii complete, consultați modulul Echipamente PSI.
          </p>
        </div>
      </div>
    </div>
  )
}
