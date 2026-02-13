'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  FileText,
  Download,
  ChevronLeft,
  Activity,
  Users,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileWarning
} from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import type { MedicalExamination } from '@/lib/types'

interface Props {
  user: { id: string; email: string }
  organizations: any[]
  medicalExams: any[]
  employees: any[]
}

interface MonthlyStats {
  month: string
  total: number
  apt: number
  aptConditionat: number
  inapt: number
  cost: number
}

interface ResultStats {
  apt: number
  aptConditionat: number
  inaptTemporal: number
  inapt: number
}

export default function MedicalReportClient({
  user,
  organizations,
  medicalExams,
  employees
}: Props) {
  const [selectedOrg, setSelectedOrg] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<'3' | '6' | '12'>('12')
  const [isExporting, setIsExporting] = useState(false)

  // Filtrare date
  const filteredData = useMemo(() => {
    const filterByOrg = (items: any[]) =>
      selectedOrg === 'all' ? items : items.filter(i => i.organization_id === selectedOrg)

    return {
      exams: filterByOrg(medicalExams),
      employees: filterByOrg(employees)
    }
  }, [selectedOrg, medicalExams, employees])

  // Calculare statistici per lună
  const monthlyStats = useMemo<MonthlyStats[]>(() => {
    const months = parseInt(selectedPeriod)
    const stats: MonthlyStats[] = []
    const now = new Date()

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthExams = filteredData.exams.filter((exam: any) => {
        const examDate = new Date(exam.examination_date)
        return examDate >= monthStart && examDate <= monthEnd
      })

      const monthLabel = date.toLocaleDateString('ro-RO', { month: 'short', year: 'numeric' })

      stats.push({
        month: monthLabel,
        total: monthExams.length,
        apt: monthExams.filter((e: any) => e.result === 'apt').length,
        aptConditionat: monthExams.filter((e: any) => e.result === 'apt_conditionat').length,
        inapt: monthExams.filter((e: any) =>
          e.result === 'inapt' || e.result === 'inapt_temporar'
        ).length,
        cost: monthExams.reduce((sum: number, e: any) => sum + (e.cost || 150), 0) // 150 RON cost mediu
      })
    }

    return stats
  }, [filteredData.exams, selectedPeriod])

  // Statistici rezultate totale
  const resultStats = useMemo<ResultStats>(() => {
    return {
      apt: filteredData.exams.filter((e: any) => e.result === 'apt').length,
      aptConditionat: filteredData.exams.filter((e: any) => e.result === 'apt_conditionat').length,
      inaptTemporal: filteredData.exams.filter((e: any) => e.result === 'inapt_temporar').length,
      inapt: filteredData.exams.filter((e: any) => e.result === 'inapt').length
    }
  }, [filteredData.exams])

  // Angajați cu examene expirate
  const expiredExams = useMemo(() => {
    const today = new Date()
    return filteredData.exams
      .filter((exam: any) => {
        const expiry = new Date(exam.expiry_date)
        return expiry < today
      })
      .sort((a: any, b: any) =>
        new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()
      )
  }, [filteredData.exams])

  // Programări următoarele 30 zile
  const upcomingExams = useMemo(() => {
    const today = new Date()
    const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

    return filteredData.exams
      .filter((exam: any) => {
        const expiry = new Date(exam.expiry_date)
        return expiry >= today && expiry <= in30Days
      })
      .sort((a: any, b: any) =>
        new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()
      )
  }, [filteredData.exams])

  // Cost total examene (perioada selectată)
  const totalCost = useMemo(() => {
    return monthlyStats.reduce((sum, month) => sum + month.cost, 0)
  }, [monthlyStats])

  // Export funcție
  const handleExport = async () => {
    setIsExporting(true)

    try {
      // Generare CSV
      const headers = [
        'Luna',
        'Total Examene',
        'Apt',
        'Apt Conditionat',
        'Inapt',
        'Cost (RON)'
      ]

      const rows = monthlyStats.map(stat => [
        stat.month,
        stat.total,
        stat.apt,
        stat.aptConditionat,
        stat.inapt,
        stat.cost.toFixed(2)
      ])

      const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n')

      // Download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `raport-medical-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Export error:', error)
      alert('Eroare la exportul raportului')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/dashboard/reports"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Raport Medical</h1>
            <p className="text-sm text-gray-500">
              Statistici examene medicina muncii
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting || filteredData.exams.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exportare...' : 'Export CSV'}
          </button>
        </div>

        {/* Filtre */}
        <div className="flex gap-4 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organizație
            </label>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toate organizațiile</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} {org.cui ? `(${org.cui})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Perioadă
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as '3' | '6' | '12')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="3">Ultimele 3 luni</option>
              <option value="6">Ultimele 6 luni</option>
              <option value="12">Ultimele 12 luni</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredData.exams.length === 0 ? (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm">
            <EmptyState
              icon={FileWarning}
              title="Nu există examene medicale"
              description="Nu au fost găsite examene medicale pentru organizația selectată."
            />
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Statistici generale */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total examene */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {monthlyStats.reduce((sum, m) => sum + m.total, 0)}
              </div>
              <div className="text-sm text-gray-500">Total examene</div>
            </div>

            {/* Apt */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {resultStats.apt}
              </div>
              <div className="text-sm text-gray-500">Apt</div>
            </div>

            {/* Conditionat */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {resultStats.aptConditionat}
              </div>
              <div className="text-sm text-gray-500">Apt Condiționat</div>
            </div>

            {/* Inapt */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {resultStats.inapt + resultStats.inaptTemporal}
              </div>
              <div className="text-sm text-gray-500">Inapt / Temporar</div>
            </div>
          </div>

          {/* Examene per lună */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Examene efectuate per lună
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Luna</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Total</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Apt</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Condiționat</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Inapt</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Cost (RON)</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyStats.map((stat, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{stat.month}</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-900">{stat.total}</td>
                      <td className="py-3 px-4 text-sm text-right text-green-600">{stat.apt}</td>
                      <td className="py-3 px-4 text-sm text-right text-orange-600">{stat.aptConditionat}</td>
                      <td className="py-3 px-4 text-sm text-right text-red-600">{stat.inapt}</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-900 font-medium">
                        {stat.cost.toLocaleString('ro-RO', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="py-3 px-4 text-sm text-gray-900">TOTAL</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-900">
                      {monthlyStats.reduce((sum, m) => sum + m.total, 0)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-green-600">
                      {monthlyStats.reduce((sum, m) => sum + m.apt, 0)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-orange-600">
                      {monthlyStats.reduce((sum, m) => sum + m.aptConditionat, 0)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-red-600">
                      {monthlyStats.reduce((sum, m) => sum + m.inapt, 0)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-900">
                      {totalCost.toLocaleString('ro-RO', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Examene expirate */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Angajați cu examene expirate
              <span className="ml-auto text-sm font-normal text-gray-500">
                {expiredExams.length} {expiredExams.length === 1 ? 'angajat' : 'angajați'}
              </span>
            </h2>

            {expiredExams.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm">Nu există examene expirate</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Angajat</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Funcție</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Data expirare</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Zile expirat</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Rezultat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiredExams.slice(0, 20).map((exam: any) => {
                      const daysExpired = Math.abs(
                        Math.floor((new Date().getTime() - new Date(exam.expiry_date).getTime()) / (1000 * 60 * 60 * 24))
                      )
                      return (
                        <tr key={exam.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-900">{exam.employee_name}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{exam.job_title || '-'}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(exam.expiry_date).toLocaleDateString('ro-RO')}
                          </td>
                          <td className="py-3 px-4 text-sm text-red-600 font-medium">
                            {daysExpired} {daysExpired === 1 ? 'zi' : 'zile'}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <StatusBadge
                              status={exam.result === 'apt' ? 'valid' : 'expired'}
                              label={exam.result === 'apt' ? 'Apt' : exam.result.replace('_', ' ')}
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {expiredExams.length > 20 && (
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Se afișează primele 20 din {expiredExams.length} examene expirate
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Programări următoarele 30 zile */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Programări următoarele 30 zile
              <span className="ml-auto text-sm font-normal text-gray-500">
                {upcomingExams.length} {upcomingExams.length === 1 ? 'examen' : 'examene'}
              </span>
            </h2>

            {upcomingExams.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm">Nu există examene programate în următoarele 30 zile</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Angajat</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Funcție</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Data expirare</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Zile rămase</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Clinică</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingExams.map((exam: any) => {
                      const daysLeft = Math.ceil(
                        (new Date(exam.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                      )
                      return (
                        <tr key={exam.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-900">{exam.employee_name}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{exam.job_title || '-'}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(exam.expiry_date).toLocaleDateString('ro-RO')}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`font-medium ${
                              daysLeft <= 7 ? 'text-red-600' :
                              daysLeft <= 15 ? 'text-orange-600' :
                              'text-blue-600'
                            }`}>
                              {daysLeft} {daysLeft === 1 ? 'zi' : 'zile'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{exam.clinic_name || '-'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Cost total */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-6 w-6" />
                  <h2 className="text-lg font-semibold">Cost total examene</h2>
                </div>
                <p className="text-blue-100 text-sm">
                  Perioada: {selectedPeriod === '3' ? 'Ultimele 3 luni' : selectedPeriod === '6' ? 'Ultimele 6 luni' : 'Ultimele 12 luni'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold mb-1">
                  {totalCost.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} RON
                </div>
                <div className="text-blue-100 text-sm">
                  ~{(totalCost / Math.max(monthlyStats.reduce((sum, m) => sum + m.total, 0), 1)).toFixed(0)} RON/examen
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
