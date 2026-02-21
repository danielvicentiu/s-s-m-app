// ============================================================
// S-S-M.RO — Training Calendar Client Component
// File: app/[locale]/dashboard/training/calendar/TrainingCalendarClient.tsx
// ============================================================
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import type {
  TrainingCalendarItem,
  TrainingCalendarStats,
  TrainingType,
  TrainingSessionStatus,
  TRAINING_TYPE_LABELS as TrainingTypeLabelsType,
  TRAINING_SESSION_STATUS_LABELS as TrainingSessionStatusLabelsType,
} from '@/lib/types'
import {
  TRAINING_TYPE_LABELS,
  TRAINING_SESSION_STATUS_LABELS,
} from '@/lib/types'

type ViewMode = 'calendar' | 'list'

interface Props {
  user: { id: string; email: string }
  organizations: Array<{ id: string; name: string; cui?: string }>
  initialSelectedOrg: string
}

interface CalendarDay {
  date: Date
  dateStr: string
  isCurrentMonth: boolean
  trainings: TrainingCalendarItem[]
}

export default function TrainingCalendarClient({ user, organizations, initialSelectedOrg }: Props) {
  const t = useTranslations('trainingCalendar')
  // Organization selector
  const [selectedOrgId, setSelectedOrgId] = useState(initialSelectedOrg)

  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarData, setCalendarData] = useState<TrainingCalendarItem[]>([])
  const [stats, setStats] = useState<TrainingCalendarStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [filterType, setFilterType] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedDayTrainings, setSelectedDayTrainings] = useState<TrainingCalendarItem[]>([])
  const [showDayModal, setShowDayModal] = useState(false)

  // Form state
  const [formEmployeeId, setFormEmployeeId] = useState('')
  const [formTrainingType, setFormTrainingType] = useState<TrainingType>('ig')
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0])
  const [formInstructor, setFormInstructor] = useState('')
  const [formInstructorMode, setFormInstructorMode] = useState<'select' | 'custom'>('select')
  const [formDuration, setFormDuration] = useState(2)
  const [formTopics, setFormTopics] = useState('')
  const [formNotes, setFormNotes] = useState('')

  // Employees list
  const [employees, setEmployees] = useState<Array<{ id: string; full_name: string }>>([])

  // Instructors list (unique from previous trainings)
  const [instructors, setInstructors] = useState<string[]>([])

  // ============================================================
  // DATA LOADING
  // ============================================================
  const loadData = useCallback(async () => {
    if (!selectedOrgId) {
      setError(t('selectOrgMessage'))
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const year = currentMonth.getFullYear()
      const month = String(currentMonth.getMonth() + 1).padStart(2, '0')
      const monthParam = `${year}-${month}`

      // Fetch calendar data and stats
      const [calendarRes, statsRes, employeesRes] = await Promise.all([
        fetch(`/api/training/calendar?org_id=${selectedOrgId}&month=${monthParam}`),
        fetch(`/api/training/calendar/stats?org_id=${selectedOrgId}&month=${monthParam}`),
        fetch(`/api/v1/employees?organization_id=${selectedOrgId}`),
      ])

      if (!calendarRes.ok) throw new Error('Failed to fetch calendar data')
      if (!statsRes.ok) throw new Error('Failed to fetch stats')
      if (!employeesRes.ok) throw new Error('Failed to fetch employees')

      const calendarJson = await calendarRes.json()
      const statsJson = await statsRes.json()
      const employeesJson = await employeesRes.json()

      const calendarItems = calendarJson.data || []
      setCalendarData(calendarItems)
      setStats(statsJson.data || null)
      setEmployees(employeesJson.data || [])

      // Extract unique instructors from calendar data
      const uniqueInstructors = Array.from(
        new Set(calendarItems.map((item: TrainingCalendarItem) => item.instructor).filter(Boolean))
      ).filter((x): x is string => typeof x === 'string').sort()
      setInstructors(uniqueInstructors)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('unknownError'))
    } finally {
      setLoading(false)
    }
  }, [selectedOrgId, currentMonth])

  useEffect(() => {
    loadData()
  }, [loadData])

  // ============================================================
  // CALENDAR HELPERS
  // ============================================================
  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear()
    const month = date.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay() // 0 = Sunday
    const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1 // Monday = 0

    const days: CalendarDay[] = []

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = adjustedStartDay - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i
      const d = new Date(year, month - 1, day)
      days.push({
        date: d,
        dateStr: d.toISOString().split('T')[0],
        isCurrentMonth: false,
        trainings: [],
      })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day)
      const dateStr = d.toISOString().split('T')[0]
      const trainings = calendarData.filter((t) => t.scheduled_date === dateStr)
      days.push({
        date: d,
        dateStr,
        isCurrentMonth: true,
        trainings,
      })
    }

    // Next month padding (fill to 6 weeks = 42 days)
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      const d = new Date(year, month + 1, day)
      days.push({
        date: d,
        dateStr: d.toISOString().split('T')[0],
        isCurrentMonth: false,
        trainings: [],
      })
    }

    return days
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDayClick = (day: CalendarDay) => {
    if (day.trainings.length > 0) {
      setSelectedDayTrainings(day.trainings)
      setSelectedDate(day.dateStr)
      setShowDayModal(true)
    } else {
      setFormDate(day.dateStr)
      setShowAddModal(true)
    }
  }

  // ============================================================
  // FORM HANDLERS
  // ============================================================
  const handleAddTraining = async () => {
    if (!formEmployeeId || !formInstructor) {
      alert(t('errorRequiredFields'))
      return
    }

    try {
      const res = await fetch('/api/training/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: selectedOrgId,
          employee_id: formEmployeeId,
          training_type: formTrainingType,
          scheduled_date: formDate,
          instructor: formInstructor,
          duration_hours: formDuration,
          topics: formTopics || null,
          notes: formNotes || null,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || t('errorAddTraining'))
      }

      setShowAddModal(false)
      resetForm()
      await loadData()
    } catch (err) {
      alert(`${t('errorPrefix')}: ${err instanceof Error ? err.message : t('unknownError')}`)
    }
  }

  const resetForm = () => {
    setFormEmployeeId('')
    setFormTrainingType('ig')
    setFormDate(new Date().toISOString().split('T')[0])
    setFormInstructor('')
    setFormInstructorMode('select')
    setFormDuration(2)
    setFormTopics('')
    setFormNotes('')
  }

  // Predefined topics
  const PREDEFINED_TOPICS = [
    t('topicPeriodic'),
    t('topicIG'),
    t('topicLLM'),
    t('topicPSI'),
    t('topicFirstAid'),
    t('topicRisks'),
    t('topicPPE'),
    t('topicSignage'),
    t('topicEvacuation'),
    t('topicHazardous'),
  ]

  const handleTopicSelect = (topic: string) => {
    if (formTopics) {
      setFormTopics(formTopics + '\n' + topic)
    } else {
      setFormTopics(topic)
    }
  }

  // ============================================================
  // FILTERS
  // ============================================================
  const getFilteredTrainings = (): TrainingCalendarItem[] => {
    let filtered = [...calendarData]

    if (filterType) {
      filtered = filtered.filter((t) => t.training_type === filterType)
    }

    if (filterStatus) {
      filtered = filtered.filter((t) => t.status === filterStatus)
    }

    return filtered
  }

  const getUpcomingTrainings = (): TrainingCalendarItem[] => {
    const today = new Date().toISOString().split('T')[0]
    const in90Days = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    return calendarData
      .filter((t) => t.scheduled_date >= today && t.scheduled_date <= in90Days && t.status === 'programat')
      .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date))
  }

  // ============================================================
  // HELPERS
  // ============================================================
  const getStatusColor = (status: TrainingSessionStatus): string => {
    switch (status) {
      case 'efectuat':
        return 'bg-emerald-500/20 text-emerald-400'
      case 'programat':
        return 'bg-blue-500/20 text-blue-400'
      case 'expirat':
        return 'bg-red-500/20 text-red-400'
      case 'anulat':
        return 'bg-slate-500/20 text-slate-400'
      default:
        return 'bg-slate-500/20 text-slate-400'
    }
  }

  const getTrainingTypeColor = (type: TrainingType): string => {
    switch (type) {
      case 'ig':
        return 'bg-purple-500/20 text-purple-400'
      case 'llm':
        return 'bg-blue-500/20 text-blue-400'
      case 'periodica':
        return 'bg-amber-500/20 text-amber-400'
      case 'tematica':
        return 'bg-teal-500/20 text-teal-400'
      default:
        return 'bg-slate-500/20 text-slate-400'
    }
  }

  const getDaysUntilColor = (days: number): string => {
    if (days < 0) return 'text-red-400'
    if (days <= 7) return 'text-orange-400'
    if (days <= 30) return 'text-amber-400'
    return 'text-slate-400'
  }

  // ============================================================
  // RENDER
  // ============================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-lg">{t('loadingCalendar')}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-red-900/30 border border-red-800 rounded-xl p-6 max-w-lg">
          <h2 className="text-red-400 font-bold text-lg mb-2">{t('errorTitle')}</h2>
          <p className="text-red-300 text-sm">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg text-sm"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    )
  }

  const calendarDays = getDaysInMonth(currentMonth)
  const upcomingTrainings = getUpcomingTrainings()

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{t('pageTitle')}</h1>
              <p className="text-slate-400 text-sm mt-1">
                {t('pageSubtitle')}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-medium text-sm transition-colors"
            >
              {t('addTraining')}
            </button>
          </div>

          {/* Organization Selector */}
          {organizations.length > 1 && (
            <div className="flex items-center gap-2">
              <label className="text-slate-400 text-sm">{t('orgLabel')}</label>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} {org.cui ? `(${org.cui})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* STATS CARDS */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <StatCard
              label={t('statScheduled')}
              value={stats.total_programate_luna_curenta}
              color="text-blue-400"
            />
            <StatCard label={t('statCompleted')} value={stats.total_efectuate} color="text-emerald-400" />
            <StatCard label={t('statExpired')} value={stats.total_expirate} color="text-red-400" />
            <StatCard label={t('statUpcoming7')} value={stats.upcoming_7_zile} color="text-amber-400" />
          </div>
        )}

        {/* VIEW MODE TOGGLE */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 bg-slate-900 rounded-xl p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📅 {t('viewCalendar')}
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              📋 {t('viewList')}
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="">{t('allTypes')}</option>
              <option value="ig">IG</option>
              <option value="llm">LLM</option>
              <option value="periodica">{t('typePeriodica')}</option>
              <option value="tematica">{t('typeTematica')}</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="">{t('allStatuses')}</option>
              <option value="programat">{t('statusScheduled')}</option>
              <option value="efectuat">{t('statusCompleted')}</option>
              <option value="expirat">{t('statusExpired')}</option>
              <option value="anulat">{t('statusCancelled')}</option>
            </select>
          </div>
        </div>

        {/* CALENDAR VIEW */}
        {viewMode === 'calendar' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                ← {t('prevMonth')}
              </button>
              <h2 className="text-xl font-bold">
                {currentMonth.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={handleNextMonth}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                {t('nextMonth')} →
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Weekday headers */}
              {[t('dayMon'), t('dayTue'), t('dayWed'), t('dayThu'), t('dayFri'), t('daySat'), t('daySun')].map((day) => (
                <div key={day} className="text-center text-slate-500 text-sm font-medium py-2">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((day, idx) => (
                <div
                  key={idx}
                  onClick={() => handleDayClick(day)}
                  className={`
                    min-h-[100px] p-2 rounded-lg border cursor-pointer transition-colors
                    ${
                      day.isCurrentMonth
                        ? 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                        : 'bg-slate-900 border-slate-800 opacity-50'
                    }
                    ${day.trainings.length > 0 ? 'ring-2 ring-teal-500/50' : ''}
                  `}
                >
                  <div className="text-sm font-medium text-slate-300 mb-1">
                    {day.date.getDate()}
                  </div>
                  {day.trainings.length > 0 && (
                    <div className="space-y-1">
                      {day.trainings.slice(0, 2).map((training) => (
                        <div
                          key={training.id}
                          className={`text-xs px-2 py-1 rounded ${getStatusColor(training.status)}`}
                        >
                          {training.employee_name.split(' ')[0]}
                        </div>
                      ))}
                      {day.trainings.length > 2 && (
                        <div className="text-xs text-slate-500 px-2">
                          +{day.trainings.length - 2} {t('moreItems')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800">
              <h2 className="text-lg font-bold">{t('listViewTitle')}</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-6 py-3 text-slate-400 font-medium">{t('colDate')}</th>
                  <th className="text-left px-6 py-3 text-slate-400 font-medium">{t('colEmployee')}</th>
                  <th className="text-left px-6 py-3 text-slate-400 font-medium">{t('colTrainingType')}</th>
                  <th className="text-left px-6 py-3 text-slate-400 font-medium">{t('colCompany')}</th>
                  <th className="text-left px-6 py-3 text-slate-400 font-medium">{t('colStatus')}</th>
                  <th className="text-left px-6 py-3 text-slate-400 font-medium">{t('colInstructor')}</th>
                </tr>
              </thead>
              <tbody>
                {upcomingTrainings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      {t('noUpcomingTrainings')}
                    </td>
                  </tr>
                ) : (
                  upcomingTrainings.map((training) => (
                    <tr key={training.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="px-6 py-3">
                        <div className="font-medium text-white">
                          {new Date(training.scheduled_date).toLocaleDateString('ro-RO')}
                        </div>
                        <div className={`text-xs ${getDaysUntilColor(training.days_until_scheduled)}`}>
                          {training.days_until_scheduled === 0
                            ? t('today')
                            : training.days_until_scheduled === 1
                            ? t('tomorrow')
                            : t('inDays', { count: training.days_until_scheduled })}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="font-medium text-white">{training.employee_name}</div>
                        <div className="text-xs text-slate-500">{training.job_title || '—'}</div>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`text-xs px-2 py-1 rounded ${getTrainingTypeColor(training.training_type)}`}>
                          {TRAINING_TYPE_LABELS[training.training_type]}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-400">
                        {training.organization_name}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(training.status)}`}>
                          {TRAINING_SESSION_STATUS_LABELS[training.status]}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-400">{training.instructor}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL: ADD TRAINING */}
        {/* ============================================================ */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">{t('modalAddTitle')}</h2>

                <div className="space-y-4">
                  {/* Employee */}
                  <div>
                    <label className="block text-slate-400 text-sm mb-1.5">
                      {t('labelEmployee')} <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formEmployeeId}
                      onChange={(e) => setFormEmployeeId(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm"
                    >
                      <option value="">{t('selectEmployee')}</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.full_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Training Type */}
                  <div>
                    <label className="block text-slate-400 text-sm mb-1.5">
                      {t('labelTrainingType')} <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formTrainingType}
                      onChange={(e) => setFormTrainingType(e.target.value as TrainingType)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm"
                    >
                      <option value="ig">{t('typeIGFull')}</option>
                      <option value="llm">{t('typeLLMFull')}</option>
                      <option value="periodica">{t('typePeriodica')}</option>
                      <option value="tematica">{t('typeTematica')}</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-slate-400 text-sm mb-1.5">
                      {t('labelDate')} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm"
                    />
                  </div>

                  {/* Instructor */}
                  <div>
                    <label className="block text-slate-400 text-sm mb-1.5">
                      {t('labelInstructor')} <span className="text-red-400">*</span>
                    </label>
                    {formInstructorMode === 'select' ? (
                      <select
                        value={formInstructor}
                        onChange={(e) => {
                          if (e.target.value === '__custom__') {
                            setFormInstructorMode('custom')
                            setFormInstructor('')
                          } else {
                            setFormInstructor(e.target.value)
                          }
                        }}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm"
                      >
                        <option value="">{t('selectInstructor')}</option>
                        {instructors.map((instructor) => (
                          <option key={instructor} value={instructor}>
                            {instructor}
                          </option>
                        ))}
                        <option value="__custom__">✏️ {t('otherInstructor')}</option>
                      </select>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formInstructor}
                          onChange={(e) => setFormInstructor(e.target.value)}
                          placeholder={t('instructorPlaceholder')}
                          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormInstructorMode('select')
                            setFormInstructor('')
                          }}
                          className="px-3 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
                          title={t('backToList')}
                        >
                          ↩
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-slate-400 text-sm mb-1.5">{t('labelDuration')}</label>
                    <select
                      value={formDuration}
                      onChange={(e) => setFormDuration(parseInt(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm"
                    >
                      <option value={1}>{t('hour', { count: 1 })}</option>
                      <option value={2}>{t('hours', { count: 2 })}</option>
                      <option value={3}>{t('hours', { count: 3 })}</option>
                      <option value={4}>{t('hours', { count: 4 })}</option>
                      <option value={5}>{t('hours', { count: 5 })}</option>
                      <option value={6}>{t('hours', { count: 6 })}</option>
                      <option value={7}>{t('hours', { count: 7 })}</option>
                      <option value={8}>{t('hours', { count: 8 })}</option>
                    </select>
                  </div>

                  {/* Topics */}
                  <div>
                    <label className="block text-slate-400 text-sm mb-1.5">{t('labelTopics')}</label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleTopicSelect(e.target.value)
                          e.target.value = ''
                        }
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm mb-2"
                    >
                      <option value="">{t('addPredefinedTopic')}</option>
                      {PREDEFINED_TOPICS.map((topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={formTopics}
                      onChange={(e) => setFormTopics(e.target.value)}
                      placeholder={t('topicsPlaceholder')}
                      rows={3}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-slate-400 text-sm mb-1.5">{t('labelNotes')}</label>
                    <textarea
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      placeholder={t('notesPlaceholder')}
                      rows={2}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowAddModal(false)
                      resetForm()
                    }}
                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleAddTraining}
                    disabled={!formEmployeeId || !formInstructor}
                    className="flex-1 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl text-sm font-medium"
                  >
                    {t('add')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL: DAY TRAININGS */}
        {/* ============================================================ */}
        {showDayModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  {t('modalDayTitle', { date: selectedDate ? new Date(selectedDate).toLocaleDateString('ro-RO') : '' })}
                </h2>

                <div className="space-y-3">
                  {selectedDayTrainings.map((training) => (
                    <div
                      key={training.id}
                      className="bg-slate-800 rounded-lg p-4 border border-slate-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-white">{training.employee_name}</div>
                          <div className="text-xs text-slate-500">{training.job_title || '—'}</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(training.status)}`}>
                          {TRAINING_SESSION_STATUS_LABELS[training.status]}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-500">{t('detailType')}:</span>{' '}
                          <span className={`text-xs px-1.5 py-0.5 rounded ${getTrainingTypeColor(training.training_type)}`}>
                            {TRAINING_TYPE_LABELS[training.training_type]}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">{t('detailInstructor')}:</span>{' '}
                          <span className="text-white">{training.instructor}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">{t('detailDuration')}:</span>{' '}
                          <span className="text-white">{training.duration_hours}h</span>
                        </div>
                        {training.topics && (
                          <div className="col-span-2">
                            <span className="text-slate-500">{t('detailTopics')}:</span>{' '}
                            <span className="text-white">{training.topics}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setShowDayModal(false)}
                    className="w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm"
                  >
                    {t('close')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// STAT CARD COMPONENT
// ============================================================
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
      <div className="text-slate-500 text-xs mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  )
}
