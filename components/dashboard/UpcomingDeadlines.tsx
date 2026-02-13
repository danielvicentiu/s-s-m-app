'use client'

import { Calendar, User, Wrench, GraduationCap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Deadline {
  id: string
  type: 'medical' | 'equipment' | 'training'
  name: string
  date: string
  daysRemaining: number
  organizationId: string
}

interface UpcomingDeadlinesProps {
  medicalExams?: Array<{
    id: string
    employee_name: string
    expiry_date: string
    organization_id: string
  }>
  equipment?: Array<{
    id: string
    equipment_type: string
    description: string | null
    expiry_date: string
    organization_id: string
  }>
  trainings?: Array<{
    id: string
    employee_name: string
    expiry_date: string | null
    next_training_date: string | null
    organization_id: string
  }>
}

const EQUIPMENT_LABELS: Record<string, string> = {
  stingator: 'Stingător',
  trusa_prim_ajutor: 'Trusă prim ajutor',
  hidrant: 'Hidrant',
  detector_fum: 'Detector fum',
  detector_gaz: 'Detector gaz',
  iluminat_urgenta: 'Iluminat urgență',
  panou_semnalizare: 'Panou semnalizare',
  trusa_scule: 'Trusă scule',
  eip: 'EIP',
  altul: 'Echipament'
}

function calculateDaysRemaining(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadline = new Date(dateStr)
  return Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function getDaysBadgeColor(days: number): string {
  if (days < 0) return 'bg-red-100 text-red-700'
  if (days <= 7) return 'bg-red-100 text-red-700'
  if (days <= 15) return 'bg-orange-100 text-orange-700'
  if (days <= 30) return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

function getDaysBadgeLabel(days: number): string {
  if (days < 0) return `Expirat (${Math.abs(days)} zile)`
  if (days === 0) return 'Astăzi'
  if (days === 1) return '1 zi'
  return `${days} zile`
}

export function UpcomingDeadlines({
  medicalExams = [],
  equipment = [],
  trainings = []
}: UpcomingDeadlinesProps) {
  // Agregăm toate deadline-urile
  const deadlines: Deadline[] = []

  // Medical exams
  medicalExams.forEach(exam => {
    if (exam.expiry_date) {
      deadlines.push({
        id: exam.id,
        type: 'medical',
        name: exam.employee_name,
        date: exam.expiry_date,
        daysRemaining: calculateDaysRemaining(exam.expiry_date),
        organizationId: exam.organization_id
      })
    }
  })

  // Equipment
  equipment.forEach(eq => {
    if (eq.expiry_date) {
      const label = EQUIPMENT_LABELS[eq.equipment_type] || 'Echipament'
      const name = eq.description ? `${label}: ${eq.description}` : label
      deadlines.push({
        id: eq.id,
        type: 'equipment',
        name,
        date: eq.expiry_date,
        daysRemaining: calculateDaysRemaining(eq.expiry_date),
        organizationId: eq.organization_id
      })
    }
  })

  // Trainings
  trainings.forEach(training => {
    const trainingDate = training.next_training_date || training.expiry_date
    if (trainingDate) {
      deadlines.push({
        id: training.id,
        type: 'training',
        name: training.employee_name,
        date: trainingDate,
        daysRemaining: calculateDaysRemaining(trainingDate),
        organizationId: training.organization_id
      })
    }
  })

  // Sortăm după urgență (mai puține zile = mai urgent)
  const sortedDeadlines = deadlines
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 5)

  if (sortedDeadlines.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Deadline-uri apropiate</h2>
        </div>
        <div className="text-center py-8 text-gray-500 text-sm">
          Nu există deadline-uri în următoarele 90 de zile
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <Calendar className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Deadline-uri apropiate</h2>
      </div>

      {/* Lista de deadline-uri */}
      <div className="space-y-3">
        {sortedDeadlines.map((deadline) => {
          const Icon = deadline.type === 'medical' ? User :
                      deadline.type === 'equipment' ? Wrench :
                      GraduationCap

          const typeLabel = deadline.type === 'medical' ? 'Control medical' :
                           deadline.type === 'equipment' ? 'Verificare echipament' :
                           'Instruire SSM'

          const actionLabel = deadline.type === 'medical' ? 'Programează' :
                             deadline.type === 'equipment' ? 'Verifică' :
                             'Programează'

          const actionHref = deadline.type === 'medical' ? '/dashboard/medical' :
                            deadline.type === 'equipment' ? '/dashboard/equipment' :
                            '/dashboard/training'

          return (
            <div
              key={`${deadline.type}-${deadline.id}`}
              className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              {/* Icon + Info */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icon className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-500 mb-0.5">
                    {typeLabel}
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {deadline.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {new Date(deadline.date).toLocaleDateString('ro-RO', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              {/* Badge + Button */}
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getDaysBadgeColor(deadline.daysRemaining)}`}>
                  {getDaysBadgeLabel(deadline.daysRemaining)}
                </span>
                <Link
                  href={actionHref}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {actionLabel}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
