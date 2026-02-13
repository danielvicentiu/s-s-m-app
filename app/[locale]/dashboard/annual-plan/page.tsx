// app/[locale]/dashboard/annual-plan/page.tsx
// Plan Anual SSM — 12 luni cu activități planificate și realizate
// Activities: instruiri, exerciții evacuare, verificări echipamente, examene medicale
// Status per lună: planificat/realizat/restant + progress bar anual

'use client'

import { useState } from 'react'
import {
  CalendarDays,
  ClipboardCheck,
  Users,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Download,
  Plus
} from 'lucide-react'

type ActivityType = 'training' | 'evacuation' | 'equipment' | 'medical'
type MonthStatus = 'planned' | 'completed' | 'overdue' | 'partial'

interface MonthlyActivity {
  month: number
  year: number
  training: {
    planned: number
    completed: number
    overdue: number
  }
  evacuation: {
    planned: number
    completed: number
    overdue: number
  }
  equipment: {
    planned: number
    completed: number
    overdue: number
  }
  medical: {
    planned: number
    completed: number
    overdue: number
  }
}

const MONTHS_RO = [
  'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
  'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
]

const ACTIVITY_TYPES = [
  { type: 'training' as ActivityType, label: 'Instruiri SSM', icon: Users, color: 'blue' },
  { type: 'evacuation' as ActivityType, label: 'Exerciții Evacuare', icon: AlertTriangle, color: 'orange' },
  { type: 'equipment' as ActivityType, label: 'Verificări Echipamente', icon: Shield, color: 'green' },
  { type: 'medical' as ActivityType, label: 'Examene Medicale', icon: Activity, color: 'purple' }
]

export default function AnnualPlanPage() {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  const [selectedYear, setSelectedYear] = useState(currentYear)

  // Mock data — în producție va veni din Supabase
  const mockData: MonthlyActivity[] = Array.from({ length: 12 }, (_, i) => ({
    month: i,
    year: selectedYear,
    training: {
      planned: Math.floor(Math.random() * 10) + 5,
      completed: Math.floor(Math.random() * 8),
      overdue: Math.floor(Math.random() * 3)
    },
    evacuation: {
      planned: i % 6 === 0 ? 1 : 0, // La fiecare 6 luni
      completed: i % 6 === 0 && i < currentMonth ? 1 : 0,
      overdue: i % 6 === 0 && i < currentMonth ? Math.random() > 0.7 ? 1 : 0 : 0
    },
    equipment: {
      planned: Math.floor(Math.random() * 15) + 10,
      completed: Math.floor(Math.random() * 12),
      overdue: Math.floor(Math.random() * 4)
    },
    medical: {
      planned: Math.floor(Math.random() * 8) + 3,
      completed: Math.floor(Math.random() * 6),
      overdue: Math.floor(Math.random() * 2)
    }
  }))

  // Calculează status per lună
  const getMonthStatus = (monthData: MonthlyActivity): MonthStatus => {
    const total = {
      planned: monthData.training.planned + monthData.evacuation.planned +
                monthData.equipment.planned + monthData.medical.planned,
      completed: monthData.training.completed + monthData.evacuation.completed +
                 monthData.equipment.completed + monthData.medical.completed,
      overdue: monthData.training.overdue + monthData.evacuation.overdue +
               monthData.equipment.overdue + monthData.medical.overdue
    }

    if (total.overdue > 0) return 'overdue'
    if (total.completed === total.planned) return 'completed'
    if (total.completed > 0) return 'partial'
    return 'planned'
  }

  // Calculează progress anual
  const calculateAnnualProgress = () => {
    const totals = mockData.reduce(
      (acc, month) => {
        const monthPlanned = month.training.planned + month.evacuation.planned +
                            month.equipment.planned + month.medical.planned
        const monthCompleted = month.training.completed + month.evacuation.completed +
                              month.equipment.completed + month.medical.completed
        const monthOverdue = month.training.overdue + month.evacuation.overdue +
                            month.equipment.overdue + month.medical.overdue

        return {
          planned: acc.planned + monthPlanned,
          completed: acc.completed + monthCompleted,
          overdue: acc.overdue + monthOverdue
        }
      },
      { planned: 0, completed: 0, overdue: 0 }
    )

    const percentage = totals.planned > 0
      ? Math.round((totals.completed / totals.planned) * 100)
      : 0

    return { ...totals, percentage }
  }

  const annualProgress = calculateAnnualProgress()

  const getStatusBadge = (status: MonthStatus) => {
    const styles = {
      planned: 'bg-gray-100 text-gray-700',
      completed: 'bg-green-100 text-green-700',
      partial: 'bg-blue-100 text-blue-700',
      overdue: 'bg-red-100 text-red-700'
    }
    const labels = {
      planned: 'Planificat',
      completed: 'Finalizat',
      partial: 'În curs',
      overdue: 'Restant'
    }
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-blue-600" />
            Plan Anual SSM
          </h1>
          <p className="text-gray-600 mt-1">
            Planificare și urmărire activități securitate și sănătate în muncă
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 font-medium"
          >
            <option value={currentYear - 1}>{currentYear - 1}</option>
            <option value={currentYear}>{currentYear}</option>
            <option value={currentYear + 1}>{currentYear + 1}</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Adaugă Activitate
          </button>
        </div>
      </div>

      {/* Progress Bar Anual */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Progress Anual {selectedYear}
              </h2>
              <p className="text-sm text-gray-600">
                {annualProgress.completed} din {annualProgress.planned} activități completate
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {annualProgress.percentage}%
            </div>
            {annualProgress.overdue > 0 && (
              <div className="text-sm text-red-600 font-medium flex items-center gap-1 justify-end">
                <AlertTriangle className="w-4 h-4" />
                {annualProgress.overdue} restante
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
            style={{ width: `${annualProgress.percentage}%` }}
          />
          {annualProgress.overdue > 0 && (
            <div
              className="absolute h-full bg-red-500 right-0"
              style={{ width: `${Math.min((annualProgress.overdue / annualProgress.planned) * 100, 20)}%` }}
            />
          )}
        </div>

        {/* Legend */}
        <div className="flex gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full" />
            <span className="text-gray-700">Completate: {annualProgress.completed}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full" />
            <span className="text-gray-700">Planificate: {annualProgress.planned - annualProgress.completed - annualProgress.overdue}</span>
          </div>
          {annualProgress.overdue > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full" />
              <span className="text-gray-700">Restante: {annualProgress.overdue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Statistici pe tip activitate */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ACTIVITY_TYPES.map(({ type, label, icon: Icon, color }) => {
          const totals = mockData.reduce(
            (acc, month) => ({
              planned: acc.planned + month[type].planned,
              completed: acc.completed + month[type].completed,
              overdue: acc.overdue + month[type].overdue
            }),
            { planned: 0, completed: 0, overdue: 0 }
          )
          const percentage = totals.planned > 0
            ? Math.round((totals.completed / totals.planned) * 100)
            : 0

          const colorClasses = {
            blue: 'bg-blue-50 border-blue-200 text-blue-700',
            orange: 'bg-orange-50 border-orange-200 text-orange-700',
            green: 'bg-green-50 border-green-200 text-green-700',
            purple: 'bg-purple-50 border-purple-200 text-purple-700'
          }

          return (
            <div key={type} className={`rounded-2xl border-2 p-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-6 h-6" />
                <span className="text-2xl font-bold">{percentage}%</span>
              </div>
              <h3 className="font-semibold mb-1">{label}</h3>
              <p className="text-sm opacity-80">
                {totals.completed}/{totals.planned} completate
              </p>
              {totals.overdue > 0 && (
                <p className="text-sm font-medium mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {totals.overdue} restante
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Tabel lunar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Lună
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                {ACTIVITY_TYPES.map(({ type, label }) => (
                  <th key={type} className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    {label}
                  </th>
                ))}
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockData.map((monthData, idx) => {
                const status = getMonthStatus(monthData)
                const isPast = idx < currentMonth && selectedYear === currentYear
                const isCurrent = idx === currentMonth && selectedYear === currentYear
                const total = {
                  planned: monthData.training.planned + monthData.evacuation.planned +
                          monthData.equipment.planned + monthData.medical.planned,
                  completed: monthData.training.completed + monthData.evacuation.completed +
                            monthData.equipment.completed + monthData.medical.completed,
                  overdue: monthData.training.overdue + monthData.evacuation.overdue +
                          monthData.equipment.overdue + monthData.medical.overdue
                }

                return (
                  <tr
                    key={idx}
                    className={`hover:bg-gray-50 transition-colors ${
                      isCurrent ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {MONTHS_RO[idx]}
                        </span>
                        {isCurrent && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                            Curent
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(status)}
                    </td>
                    {ACTIVITY_TYPES.map(({ type }) => {
                      const data = monthData[type]
                      return (
                        <td key={type} className="px-6 py-4 text-center">
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-semibold text-green-700">{data.completed}</span>
                              <span className="text-gray-500"> / </span>
                              <span className="text-gray-700">{data.planned}</span>
                            </div>
                            {data.overdue > 0 && (
                              <div className="text-xs text-red-600 font-medium flex items-center justify-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                {data.overdue} restant
                              </div>
                            )}
                          </div>
                        </td>
                      )
                    })}
                    <td className="px-6 py-4 text-center">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold">
                          <span className="text-green-700">{total.completed}</span>
                          <span className="text-gray-500"> / </span>
                          <span className="text-gray-700">{total.planned}</span>
                        </div>
                        {total.overdue > 0 && (
                          <div className="text-xs text-red-600 font-medium">
                            {total.overdue} restante
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900" colSpan={2}>
                  TOTAL {selectedYear}
                </td>
                {ACTIVITY_TYPES.map(({ type }) => {
                  const totals = mockData.reduce(
                    (acc, month) => ({
                      planned: acc.planned + month[type].planned,
                      completed: acc.completed + month[type].completed,
                      overdue: acc.overdue + month[type].overdue
                    }),
                    { planned: 0, completed: 0, overdue: 0 }
                  )
                  return (
                    <td key={type} className="px-6 py-4 text-center">
                      <div className="space-y-1">
                        <div className="text-sm font-bold">
                          <span className="text-green-700">{totals.completed}</span>
                          <span className="text-gray-500"> / </span>
                          <span className="text-gray-700">{totals.planned}</span>
                        </div>
                        {totals.overdue > 0 && (
                          <div className="text-xs text-red-600 font-semibold">
                            {totals.overdue} restante
                          </div>
                        )}
                      </div>
                    </td>
                  )
                })}
                <td className="px-6 py-4 text-center">
                  <div className="space-y-1">
                    <div className="text-sm font-bold">
                      <span className="text-green-700">{annualProgress.completed}</span>
                      <span className="text-gray-500"> / </span>
                      <span className="text-gray-700">{annualProgress.planned}</span>
                    </div>
                    {annualProgress.overdue > 0 && (
                      <div className="text-xs text-red-600 font-semibold">
                        {annualProgress.overdue} restante
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Observații și Note */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <ClipboardCheck className="w-6 h-6 text-yellow-700 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-2">
              Observații Plan Anual {selectedYear}
            </h3>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>Exercițiile de evacuare sunt planificate semestrial (Iunie și Decembrie)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>Verificările echipamentelor PSI se efectuează lunar conform legislației</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>Instruirile SSM obligatorii: instruire inițială (noi angajați) și instruire periodică (anual)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>Examenele medicale periodice se programează conform fișei postului și factorilor de risc</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
