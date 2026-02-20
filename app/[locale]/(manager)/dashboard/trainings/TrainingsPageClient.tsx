// app/[locale]/dashboard/trainings/TrainingsPageClient.tsx
// Pagină Instruiri — live fetch din Supabase cu filtrare, sortare, paginare
// Stats cards, status badges, calcul următoarea instruire

'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  GraduationCap,
  Search,
  Plus,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Calendar
} from 'lucide-react'

// ========== TYPES ==========

interface Training {
  id: string
  employee_id: string | null
  training_type: 'ssm_initial' | 'ssm_periodic' | 'psi_initial' | 'psi_periodic' | 'primul_ajutor' | 'lucru_inaltime' | 'echipamente' | 'altul'
  completion_date: string
  expiry_date: string | null
  duration_hours: number | null
  instructor_name: string | null
  location: string | null
  notes: string | null
  frequency: 'annual' | 'biannual' | 'triannual' | 'once' | null
  organization_id: string
  employees?: {
    id: string
    full_name: string
    job_title: string | null
  }
  organizations?: {
    name: string
    cui: string
  }
}

type ExpiryStatus = 'valid' | 'expiring' | 'expired' | 'incomplete'
type SortDirection = 'asc' | 'desc'

// ========== COMPONENT ==========

export default function TrainingsPageClient() {
  const router = useRouter()
  const t = useTranslations('trainingsPage')
  const supabase = createSupabaseBrowser()

  // State
  const [trainings, setTrainings] = useState<Training[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortColumn, setSortColumn] = useState<string | null>('completion_date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  // ========== FETCH DATA ==========

  useEffect(() => {
    async function fetchTrainings() {
      try {
        setLoading(true)

        const { data, error } = await supabase
          .from('training_sessions')
          .select(`
            *,
            employees!inner(id, full_name, job_title),
            organizations(name, cui)
          `)
          .order('completion_date', { ascending: false })

        if (error) throw error

        setTrainings(data || [])
      } catch (err) {
        console.error('[TRAININGS] Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrainings()
  }, [])

  // ========== DEBOUNCE SEARCH ==========

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // ========== STATUS HELPERS ==========

  function getExpiryStatus(training: Training): ExpiryStatus {
    if (!training.expiry_date) {
      // No expiry means once-off training
      return training.frequency === 'once' ? 'valid' : 'incomplete'
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiry = new Date(training.expiry_date)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return 'expired'
    if (daysUntilExpiry <= 30) return 'expiring'
    return 'valid'
  }

  function getNextTrainingDate(training: Training): string | null {
    if (!training.expiry_date || training.frequency === 'once') return null

    const expiry = new Date(training.expiry_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // If expired or expiring, next date is expiry date
    if (expiry <= today || getExpiryStatus(training) === 'expiring') {
      return training.expiry_date
    }

    return training.expiry_date
  }

  function calculateNextTraining(training: Training): { date: string | null; daysUntil: number | null } {
    const nextDate = getNextTrainingDate(training)
    if (!nextDate) return { date: null, daysUntil: null }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const next = new Date(nextDate)
    const daysUntil = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    return { date: nextDate, daysUntil }
  }

  function fmtDate(d: string | null): string {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const trainingTypes: Record<string, string> = {
    ssm_initial: 'SSM ' + t('typeInitial'),
    ssm_periodic: 'SSM ' + t('typePeriodic'),
    psi_initial: 'PSI ' + t('typeInitial'),
    psi_periodic: 'PSI ' + t('typePeriodic'),
    primul_ajutor: t('typeFirstAid'),
    lucru_inaltime: t('typeHeightWork'),
    echipamente: t('typeEquipment'),
    altul: t('typeOther')
  }

  // ========== STATS ==========

  const stats = useMemo(() => {
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()

    const thisMonthTrainings = trainings.filter(t => {
      const date = new Date(t.completion_date)
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear
    }).length

    const expiring30Days = trainings.filter(t => {
      if (!t.expiry_date) return false
      const expiry = new Date(t.expiry_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const daysUntil = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntil > 0 && daysUntil <= 30
    }).length

    const expired = trainings.filter(t => {
      if (!t.expiry_date) return false
      const status = getExpiryStatus(t)
      return status === 'expired'
    }).length

    return {
      thisMonth: thisMonthTrainings,
      expiring: expiring30Days,
      expired
    }
  }, [trainings])

  // ========== FILTERING & SORTING ==========

  const filteredAndSorted = useMemo(() => {
    let result = [...trainings]

    // Filter by search
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase()
      result = result.filter(t => {
        const empName = t.employees?.full_name?.toLowerCase() || ''
        const empJob = t.employees?.job_title?.toLowerCase() || ''
        const instructor = t.instructor_name?.toLowerCase() || ''
        const location = t.location?.toLowerCase() || ''
        const type = trainingTypes[t.training_type]?.toLowerCase() || ''

        return empName.includes(query) || empJob.includes(query) ||
               instructor.includes(query) || location.includes(query) ||
               type.includes(query)
      })
    }

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter(t => t.training_type === filterType)
    }

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(t => getExpiryStatus(t) === filterStatus)
    }

    // Sort
    if (sortColumn) {
      result.sort((a, b) => {
        let aVal: any
        let bVal: any

        if (sortColumn === 'employee_name') {
          aVal = a.employees?.full_name || ''
          bVal = b.employees?.full_name || ''
        } else if (sortColumn === 'status') {
          aVal = getExpiryStatus(a)
          bVal = getExpiryStatus(b)
        } else if (sortColumn === 'next_training') {
          const aNext = calculateNextTraining(a)
          const bNext = calculateNextTraining(b)
          aVal = aNext.date || '9999-12-31'
          bVal = bNext.date || '9999-12-31'
        } else {
          aVal = (a as any)[sortColumn] || ''
          bVal = (b as any)[sortColumn] || ''
        }

        if (aVal === null || aVal === undefined) return 1
        if (bVal === null || bVal === undefined) return -1

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'asc'
            ? aVal.localeCompare(bVal, 'ro')
            : bVal.localeCompare(aVal, 'ro')
        }

        return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
      })
    }

    return result
  }, [trainings, debouncedSearch, filterType, filterStatus, sortColumn, sortDirection])

  // ========== PAGINATION ==========

  const totalPages = Math.ceil(filteredAndSorted.length / pageSize)
  const paginatedData = filteredAndSorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // ========== HANDLERS ==========

  function handleSort(column: string) {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  function getSortIcon(column: string) {
    if (sortColumn !== column) return null
    return sortDirection === 'asc'
      ? <ChevronUp className="h-4 w-4 inline ml-1" />
      : <ChevronDown className="h-4 w-4 inline ml-1" />
  }

  // ========== RENDER ==========

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                {t('pageTitle')}
              </h1>
              <p className="text-sm text-gray-400">
                {loading ? t('loading') : t('recordsCount', { count: filteredAndSorted.length })}
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard/trainings/new')}
            className="bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-900 transition flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('addTraining')}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6 space-y-5">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-3xl font-black text-gray-900">{stats.thisMonth}</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
              {t('statThisMonth')}
            </div>
          </div>
          <div className="bg-orange-50 rounded-xl border border-orange-100 p-4 text-center">
            <div className="text-3xl font-black text-orange-500">{stats.expiring}</div>
            <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest mt-1">
              {t('statExpiring30')}
            </div>
          </div>
          <div className="bg-red-50 rounded-xl border border-red-100 p-4 text-center">
            <div className="text-3xl font-black text-red-600">{stats.expired}</div>
            <div className="text-xs font-semibold text-red-500 uppercase tracking-widest mt-1">
              {t('statExpired')}
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value)
                setCurrentPage(1)
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="all">{t('filterAllTypes')}</option>
              {Object.entries(trainingTypes).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value)
                setCurrentPage(1)
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="all">{t('filterAllStatuses')}</option>
              <option value="valid">{t('filterValid')}</option>
              <option value="expiring">{t('filterExpiringSoon')}</option>
              <option value="expired">{t('filterExpired')}</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            // LOADING SKELETON
            <div className="space-y-3 p-4">
              {Array.from({ length: pageSize }).map((_, idx) => (
                <div key={idx} className="flex gap-4 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded flex-1" />
                  <div className="h-5 bg-gray-200 rounded w-32" />
                  <div className="h-5 bg-gray-200 rounded w-24" />
                  <div className="h-5 bg-gray-200 rounded w-28" />
                  <div className="h-5 bg-gray-200 rounded w-24" />
                  <div className="h-5 bg-gray-200 rounded w-24" />
                </div>
              ))}
            </div>
          ) : filteredAndSorted.length === 0 ? (
            // EMPTY STATE
            <EmptyState
              icon={GraduationCap}
              title={trainings.length === 0 ? t('emptyTitle') : t('emptySearchTitle')}
              description={
                trainings.length === 0
                  ? t('emptyDesc')
                  : t('emptySearchDesc')
              }
              actionLabel={trainings.length === 0 ? t('addTraining') : undefined}
              onAction={trainings.length === 0 ? () => router.push('/dashboard/trainings/new') : undefined}
            />
          ) : (
            <>
              {/* TABLE HEADER */}
              <div className="hidden md:grid md:grid-cols-[2fr,1.5fr,1fr,1fr,1fr,1.2fr,1fr] gap-4 px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('employee_name')}
                  className="text-left hover:text-gray-900 transition"
                >
                  {t('colEmployee')} {getSortIcon('employee_name')}
                </button>
                <button
                  onClick={() => handleSort('training_type')}
                  className="text-left hover:text-gray-900 transition"
                >
                  {t('colType')} {getSortIcon('training_type')}
                </button>
                <button
                  onClick={() => handleSort('completion_date')}
                  className="text-left hover:text-gray-900 transition"
                >
                  {t('colDate')} {getSortIcon('completion_date')}
                </button>
                <button
                  onClick={() => handleSort('duration_hours')}
                  className="text-left hover:text-gray-900 transition"
                >
                  {t('colDuration')} {getSortIcon('duration_hours')}
                </button>
                <button
                  onClick={() => handleSort('instructor_name')}
                  className="text-left hover:text-gray-900 transition"
                >
                  {t('colInstructor')} {getSortIcon('instructor_name')}
                </button>
                <button
                  onClick={() => handleSort('next_training')}
                  className="text-left hover:text-gray-900 transition"
                >
                  {t('colNext')} {getSortIcon('next_training')}
                </button>
                <button
                  onClick={() => handleSort('status')}
                  className="text-left hover:text-gray-900 transition"
                >
                  {t('colStatus')} {getSortIcon('status')}
                </button>
              </div>

              {/* TABLE ROWS */}
              <div className="divide-y divide-gray-100">
                {paginatedData.map((training) => {
                  const status = getExpiryStatus(training)
                  const nextTraining = calculateNextTraining(training)

                  return (
                    <div
                      key={training.id}
                      className="grid md:grid-cols-[2fr,1.5fr,1fr,1fr,1fr,1.2fr,1fr] gap-4 px-6 py-4 hover:bg-gray-50 transition"
                    >
                      {/* Angajat */}
                      <div>
                        <div className="font-medium text-gray-900">
                          {training.employees?.full_name || '—'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {training.employees?.job_title || '—'}
                        </div>
                      </div>

                      {/* Tip instruire */}
                      <div>
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                          {trainingTypes[training.training_type] || training.training_type}
                        </span>
                      </div>

                      {/* Data */}
                      <div className="text-sm text-gray-600">
                        {fmtDate(training.completion_date)}
                      </div>

                      {/* Durata */}
                      <div className="text-sm text-gray-600">
                        {training.duration_hours ? `${training.duration_hours}h` : '—'}
                      </div>

                      {/* Instructor */}
                      <div className="text-sm text-gray-600">
                        {training.instructor_name || '—'}
                      </div>

                      {/* Următoarea instruire */}
                      <div className="text-sm">
                        {nextTraining.date ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            <span className={`font-medium ${
                              nextTraining.daysUntil !== null && nextTraining.daysUntil < 0
                                ? 'text-red-600'
                                : nextTraining.daysUntil !== null && nextTraining.daysUntil <= 30
                                ? 'text-orange-500'
                                : 'text-gray-600'
                            }`}>
                              {fmtDate(nextTraining.date)}
                            </span>
                            {nextTraining.daysUntil !== null && (
                              <span className="text-xs text-gray-400">
                                ({nextTraining.daysUntil > 0
                                  ? t('daysLeft', { count: nextTraining.daysUntil })
                                  : t('daysOverdue', { count: Math.abs(nextTraining.daysUntil) })})
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>

                      {/* Status */}
                      <div>
                        <StatusBadge status={status} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Page size selector */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{t('show')}:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value))
                        setCurrentPage(1)
                      }}
                      className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span>/ {filteredAndSorted.length} {t('total')}</span>
                  </div>

                  {/* Page navigation */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronUp className="h-4 w-4 rotate-[-90deg]" />
                    </button>
                    <span className="text-sm text-gray-600 min-w-[100px] text-center">
                      {t('page', { current: currentPage, total: totalPages })}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronUp className="h-4 w-4 rotate-90" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
