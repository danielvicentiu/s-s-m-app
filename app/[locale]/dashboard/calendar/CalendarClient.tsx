// app/[locale]/dashboard/calendar/CalendarClient.tsx
// Calendar Client Component — Monthly calendar with color-coded events
// Blue: trainings, Green: medical exams, Orange: equipment inspections, Red: deadlines

'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react'

interface CalendarEvent {
  id: string
  type: 'training' | 'medical' | 'equipment' | 'deadline'
  title: string
  date: string
  details: string
  organization_id: string
  metadata?: any
}

interface Props {
  user: { id: string; email: string }
  organizations: any[]
  medicalExams: any[]
  equipment: any[]
  trainings: any[]
  alerts: any[]
}

const MONTHS_RO = [
  'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
  'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
]

const DAYS_RO = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export default function CalendarClient({ user, organizations, medicalExams, equipment, trainings, alerts }: Props) {
  const router = useRouter()
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [filterOrg, setFilterOrg] = useState<string>('all')

  // Convert all data to unified calendar events
  const allEvents: CalendarEvent[] = [
    // Medical examinations (green) - use examination_date and expiry_date
    ...medicalExams.flatMap((exam: any) => {
      const events: CalendarEvent[] = []

      if (exam.examination_date) {
        events.push({
          id: `med-exam-${exam.id}`,
          type: 'medical',
          title: `Examen: ${exam.employee_name}`,
          date: exam.examination_date,
          details: `Tip: ${exam.examination_type || 'N/A'}\nAngajat: ${exam.employee_name}`,
          organization_id: exam.organization_id,
          metadata: exam
        })
      }

      if (exam.expiry_date) {
        events.push({
          id: `med-exp-${exam.id}`,
          type: 'medical',
          title: `Expiră: ${exam.employee_name}`,
          date: exam.expiry_date,
          details: `Fișă medicală expiră\nAngajat: ${exam.employee_name}`,
          organization_id: exam.organization_id,
          metadata: exam
        })
      }

      return events
    }),

    // Equipment inspections (orange)
    ...equipment.flatMap((eq: any) => {
      const events: CalendarEvent[] = []

      if (eq.last_check_date) {
        events.push({
          id: `eq-check-${eq.id}`,
          type: 'equipment',
          title: `Verificat: ${eq.equipment_type}`,
          date: eq.last_check_date,
          details: `Ultima verificare\n${eq.description || eq.equipment_type}\nLocație: ${eq.location || 'N/A'}`,
          organization_id: eq.organization_id,
          metadata: eq
        })
      }

      if (eq.expiry_date) {
        events.push({
          id: `eq-exp-${eq.id}`,
          type: 'equipment',
          title: `Expiră: ${eq.equipment_type}`,
          date: eq.expiry_date,
          details: `Echipament expiră\n${eq.description || eq.equipment_type}\nLocație: ${eq.location || 'N/A'}`,
          organization_id: eq.organization_id,
          metadata: eq
        })
      }

      if (eq.next_inspection_date) {
        events.push({
          id: `eq-next-${eq.id}`,
          type: 'equipment',
          title: `Inspecție: ${eq.equipment_type}`,
          date: eq.next_inspection_date,
          details: `Inspecție programată\n${eq.description || eq.equipment_type}\nLocație: ${eq.location || 'N/A'}`,
          organization_id: eq.organization_id,
          metadata: eq
        })
      }

      return events
    }),

    // Training sessions (blue)
    ...trainings.flatMap((tr: any) => {
      const events: CalendarEvent[] = []

      if (tr.training_date) {
        events.push({
          id: `tr-date-${tr.id}`,
          type: 'training',
          title: `Instruire: ${tr.employee_name || 'Grup'}`,
          date: tr.training_date,
          details: `Tip: ${tr.training_type || 'SSM'}\nAngajat: ${tr.employee_name || 'Grup'}`,
          organization_id: tr.organization_id,
          metadata: tr
        })
      }

      if (tr.expiry_date) {
        events.push({
          id: `tr-exp-${tr.id}`,
          type: 'training',
          title: `Reînnoiește: ${tr.employee_name || 'Grup'}`,
          date: tr.expiry_date,
          details: `Instruire expiră\nTip: ${tr.training_type || 'SSM'}\nAngajat: ${tr.employee_name || 'Grup'}`,
          organization_id: tr.organization_id,
          metadata: tr
        })
      }

      return events
    }),

    // Alerts as deadlines (red)
    ...alerts.map((alert: any) => ({
      id: `alert-${alert.id}`,
      type: 'deadline' as const,
      title: `Alertă: ${alert.alert_type}`,
      date: alert.due_date || new Date().toISOString().split('T')[0],
      details: `${alert.message}\nSeveritate: ${alert.severity}`,
      organization_id: alert.organization_id,
      metadata: alert
    }))
  ]

  // Filter events by organization
  const filteredEvents = filterOrg === 'all'
    ? allEvents
    : allEvents.filter(e => e.organization_id === filterOrg)

  // Get events for a specific date
  function getEventsForDate(year: number, month: number, day: number): CalendarEvent[] {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return filteredEvents.filter(e => e.date?.startsWith(dateStr))
  }

  // Calendar calculations
  function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate()
  }

  function getFirstDayOfMonth(year: number, month: number): number {
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1 // Convert Sunday=0 to Monday=0
  }

  function previousMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  function goToToday() {
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
  const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1)

  // Build calendar grid
  const calendarDays: Array<{ day: number; isCurrentMonth: boolean; date: Date }> = []

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(prevYear, prevMonth, daysInPrevMonth - i)
    })
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(currentYear, currentMonth, i)
    })
  }

  // Next month days to complete the grid
  const remainingDays = 42 - calendarDays.length // 6 weeks × 7 days
  const followingMonth = currentMonth === 11 ? 0 : currentMonth + 1
  const followingYear = currentMonth === 11 ? currentYear + 1 : currentYear
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(followingYear, followingMonth, i)
    })
  }

  // Event type colors
  const eventColors = {
    training: 'bg-blue-500',
    medical: 'bg-green-500',
    equipment: 'bg-orange-500',
    deadline: 'bg-red-500'
  }

  const eventBgColors = {
    training: 'bg-blue-50 border-blue-200',
    medical: 'bg-green-50 border-green-200',
    equipment: 'bg-orange-50 border-orange-200',
    deadline: 'bg-red-50 border-red-200'
  }

  // Stats
  const stats = {
    total: filteredEvents.length,
    training: filteredEvents.filter(e => e.type === 'training').length,
    medical: filteredEvents.filter(e => e.type === 'medical').length,
    equipment: filteredEvents.filter(e => e.type === 'equipment').length,
    deadline: filteredEvents.filter(e => e.type === 'deadline').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-8 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Calendar evenimente
              </h1>
              <p className="text-sm text-gray-500">Instruiri, examene medicale, inspecții echipamente</p>
            </div>
          </div>
          <button
            onClick={goToToday}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
          >
            Astăzi
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 py-4 text-center">
            <div className="text-3xl font-black text-gray-900">{stats.total}</div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total</div>
          </div>
          <div className="bg-blue-50 rounded-xl border border-blue-100 py-4 text-center">
            <div className="text-3xl font-black text-blue-600">{stats.training}</div>
            <div className="text-[11px] font-bold text-blue-500 uppercase tracking-widest">Instruiri</div>
          </div>
          <div className="bg-green-50 rounded-xl border border-green-100 py-4 text-center">
            <div className="text-3xl font-black text-green-600">{stats.medical}</div>
            <div className="text-[11px] font-bold text-green-500 uppercase tracking-widest">Examene</div>
          </div>
          <div className="bg-orange-50 rounded-xl border border-orange-100 py-4 text-center">
            <div className="text-3xl font-black text-orange-500">{stats.equipment}</div>
            <div className="text-[11px] font-bold text-orange-500 uppercase tracking-widest">Echipamente</div>
          </div>
          <div className="bg-red-50 rounded-xl border border-red-100 py-4 text-center">
            <div className="text-3xl font-black text-red-600">{stats.deadline}</div>
            <div className="text-[11px] font-bold text-red-600 uppercase tracking-widest">Alerte</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <select
              value={filterOrg}
              onChange={e => setFilterOrg(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Toate organizațiile</option>
              {organizations.map((o: any) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
            <div className="flex-1" />
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-gray-600">Instruiri</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-gray-600">Examene</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-gray-600">Echipamente</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-gray-600">Alerte</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Month navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <button
              onClick={previousMonth}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-gray-900">
              {MONTHS_RO[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar grid */}
          <div className="p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {DAYS_RO.map((day, i) => (
                <div key={i} className="text-center text-xs font-bold text-gray-400 uppercase py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((calDay, idx) => {
                const events = getEventsForDate(
                  calDay.date.getFullYear(),
                  calDay.date.getMonth(),
                  calDay.date.getDate()
                )
                const isToday =
                  calDay.date.getDate() === today.getDate() &&
                  calDay.date.getMonth() === today.getMonth() &&
                  calDay.date.getFullYear() === today.getFullYear()

                return (
                  <div
                    key={idx}
                    className={`min-h-[100px] border rounded-lg p-2 ${
                      calDay.isCurrentMonth ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
                    } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${
                      calDay.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    } ${isToday ? 'text-blue-600' : ''}`}>
                      {calDay.day}
                    </div>
                    <div className="space-y-1">
                      {events.slice(0, 3).map(event => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`w-full text-left text-[10px] px-1.5 py-0.5 rounded border ${eventBgColors[event.type]} hover:shadow-sm transition truncate`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${eventColors[event.type]} inline-block mr-1`} />
                          {event.title}
                        </button>
                      ))}
                      {events.length > 3 && (
                        <div className="text-[10px] text-gray-400 font-medium px-1.5">
                          +{events.length - 3} mai multe
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Detalii eveniment</h2>
              <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${eventColors[selectedEvent.type]}`} />
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    {selectedEvent.type === 'training' && 'Instruire'}
                    {selectedEvent.type === 'medical' && 'Examen medical'}
                    {selectedEvent.type === 'equipment' && 'Echipament'}
                    {selectedEvent.type === 'deadline' && 'Alertă'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{selectedEvent.title}</h3>
              </div>
              <div>
                <div className="text-sm text-gray-500">Data</div>
                <div className="text-base font-medium text-gray-900">
                  {new Date(selectedEvent.date).toLocaleDateString('ro-RO', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Detalii</div>
                <div className="text-sm text-gray-900 whitespace-pre-line">
                  {selectedEvent.details}
                </div>
              </div>
              {selectedEvent.metadata && (
                <div className="pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-400">ID: {selectedEvent.metadata.id}</div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Închide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
