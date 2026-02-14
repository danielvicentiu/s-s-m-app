// app/[locale]/dashboard/medical/MedicalPageClient.tsx
// Pagină Examene Medicale — live fetch din Supabase cu filtrare, sortare, paginare
// Stats cards, status badges, calcul următorul examen

'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from '@/i18n/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  Stethoscope,
  Search,
  Plus,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Calendar
} from 'lucide-react'

// ========== TYPES ==========

interface MedicalExam {
  id: string
  employee_id: string | null
  organization_id: string
  examination_type: 'periodic' | 'angajare' | 'reluare' | 'la_cerere' | 'supraveghere'
  examination_date: string
  expiry_date: string
  result: 'apt' | 'apt_conditionat' | 'inapt_temporar' | 'inapt'
  restrictions: string | null
  doctor_name: string | null
  clinic_name: string | null
  notes: string | null
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

export default function MedicalPageClient() {
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  // State
  const [exams, setExams] = useState<MedicalExam[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterResult, setFilterResult] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortColumn, setSortColumn] = useState<string | null>('examination_date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  // ========== FETCH DATA ==========

  useEffect(() => {
    async function fetchExams() {
      try {
        setLoading(true)

        const { data, error } = await supabase
          .from('medical_exams')
          .select(`
            *,
            employees!inner(id, full_name, job_title),
            organizations(name, cui)
          `)
          .order('examination_date', { ascending: false })

        if (error) throw error

        setExams(data || [])
      } catch (err) {
        console.error('[MEDICAL] Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchExams()
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

  function getExpiryStatus(exam: MedicalExam): ExpiryStatus {
    if (!exam.expiry_date) return 'incomplete'

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiry = new Date(exam.expiry_date)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return 'expired'
    if (daysUntilExpiry <= 30) return 'expiring'
    return 'valid'
  }

  function getNextExamDate(exam: MedicalExam): string | null {
    if (!exam.expiry_date) return null
    return exam.expiry_date
  }

  function calculateNextExam(exam: MedicalExam): { date: string | null; daysUntil: number | null } {
    const nextDate = getNextExamDate(exam)
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

  const examinationTypes: Record<string, string> = {
    periodic: 'Periodic',
    angajare: 'Angajare',
    reluare: 'Reluare muncă',
    la_cerere: 'La cerere',
    supraveghere: 'Supraveghere'
  }

  const resultLabels: Record<string, string> = {
    apt: 'Apt',
    apt_conditionat: 'Apt condiționat',
    inapt_temporar: 'Inapt temporar',
    inapt: 'Inapt'
  }

  const resultColors: Record<string, string> = {
    apt: 'bg-green-100 text-green-700',
    apt_conditionat: 'bg-yellow-100 text-yellow-700',
    inapt_temporar: 'bg-orange-100 text-orange-700',
    inapt: 'bg-red-100 text-red-700'
  }

  // ========== STATS ==========

  const stats = useMemo(() => {
    const total = exams.length

    const expiring30Days = exams.filter(e => {
      if (!e.expiry_date) return false
      const expiry = new Date(e.expiry_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const daysUntil = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntil > 0 && daysUntil <= 30
    }).length

    const expired = exams.filter(e => {
      if (!e.expiry_date) return false
      const status = getExpiryStatus(e)
      return status === 'expired'
    }).length

    return {
      total,
      expiring: expiring30Days,
      expired
    }
  }, [exams])

  // ========== FILTERING & SORTING ==========

  const filteredAndSorted = useMemo(() => {
    let result = [...exams]

    // Filter by search
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase()
      result = result.filter(e => {
        const empName = e.employees?.full_name?.toLowerCase() || ''
        const empJob = e.employees?.job_title?.toLowerCase() || ''
        const doctor = e.doctor_name?.toLowerCase() || ''
        const clinic = e.clinic_name?.toLowerCase() || ''
        const type = examinationTypes[e.examination_type]?.toLowerCase() || ''

        return empName.includes(query) || empJob.includes(query) ||
               doctor.includes(query) || clinic.includes(query) ||
               type.includes(query)
      })
    }

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter(e => e.examination_type === filterType)
    }

    // Filter by result
    if (filterResult !== 'all') {
      result = result.filter(e => e.result === filterResult)
    }

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(e => getExpiryStatus(e) === filterStatus)
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
        } else if (sortColumn === 'next_exam') {
          const aNext = calculateNextExam(a)
          const bNext = calculateNextExam(b)
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
  }, [exams, debouncedSearch, filterType, filterResult, filterStatus, sortColumn, sortDirection])

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
                <Stethoscope className="h-5 w-5 text-blue-600" />
                Examene Medicale
              </h1>
              <p className="text-sm text-gray-400">
                {loading ? 'Se încarcă...' : `${filteredAndSorted.length} examene înregistrate`}
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard/medical/new')}
            className="bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-900 transition flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Programează examen
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6 space-y-5">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-3xl font-black text-gray-900">{stats.total}</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
              Total examene
            </div>
          </div>
          <div className="bg-orange-50 rounded-xl border border-orange-100 p-4 text-center">
            <div className="text-3xl font-black text-orange-500">{stats.expiring}</div>
            <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest mt-1">
              Expiră în 30 zile
            </div>
          </div>
          <div className="bg-red-50 rounded-xl border border-red-100 p-4 text-center">
            <div className="text-3xl font-black text-red-600">{stats.expired}</div>
            <div className="text-xs font-semibold text-red-500 uppercase tracking-widest mt-1">
              Expirate
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
              placeholder="Caută după angajat, funcție, medic, clinică..."
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
              <option value="all">Toate tipurile</option>
              {Object.entries(examinationTypes).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <select
              value={filterResult}
              onChange={(e) => {
                setFilterResult(e.target.value)
                setCurrentPage(1)
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="all">Toate rezultatele</option>
              {Object.entries(resultLabels).map(([key, label]) => (
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
              <option value="all">Toate statusurile</option>
              <option value="valid">Valide</option>
              <option value="expiring">Expiră curând</option>
              <option value="expired">Expirate</option>
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
              icon={Stethoscope}
              title={exams.length === 0 ? 'Niciun examen' : 'Niciun rezultat'}
              description={
                exams.length === 0
                  ? 'Adaugă primul examen medical pentru a începe.'
                  : 'Nu există examene care să corespundă căutării tale.'
              }
              actionLabel={exams.length === 0 ? 'Programează examen' : undefined}
              onAction={exams.length === 0 ? () => router.push('/dashboard/medical/new') : undefined}
            />
          ) : (
            <>
              {/* TABLE HEADER */}
              <div className="hidden md:grid md:grid-cols-[2fr,1.2fr,1fr,1fr,1.2fr,1.2fr,1fr] gap-4 px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('employee_name')}
                  className="text-left hover:text-gray-900 transition"
                >
                  Angajat {getSortIcon('employee_name')}
                </button>
                <button
                  onClick={() => handleSort('examination_type')}
                  className="text-left hover:text-gray-900 transition"
                >
                  Tip examen {getSortIcon('examination_type')}
                </button>
                <button
                  onClick={() => handleSort('examination_date')}
                  className="text-left hover:text-gray-900 transition"
                >
                  Data {getSortIcon('examination_date')}
                </button>
                <button
                  onClick={() => handleSort('doctor_name')}
                  className="text-left hover:text-gray-900 transition"
                >
                  Medic {getSortIcon('doctor_name')}
                </button>
                <button
                  onClick={() => handleSort('result')}
                  className="text-left hover:text-gray-900 transition"
                >
                  Rezultat {getSortIcon('result')}
                </button>
                <button
                  onClick={() => handleSort('next_exam')}
                  className="text-left hover:text-gray-900 transition"
                >
                  Următor examen {getSortIcon('next_exam')}
                </button>
                <button
                  onClick={() => handleSort('status')}
                  className="text-left hover:text-gray-900 transition"
                >
                  Status {getSortIcon('status')}
                </button>
              </div>

              {/* TABLE ROWS */}
              <div className="divide-y divide-gray-100">
                {paginatedData.map((exam) => {
                  const status = getExpiryStatus(exam)
                  const nextExam = calculateNextExam(exam)

                  return (
                    <div
                      key={exam.id}
                      className="grid md:grid-cols-[2fr,1.2fr,1fr,1fr,1.2fr,1.2fr,1fr] gap-4 px-6 py-4 hover:bg-gray-50 transition"
                    >
                      {/* Angajat */}
                      <div>
                        <div className="font-medium text-gray-900">
                          {exam.employees?.full_name || '—'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {exam.employees?.job_title || '—'}
                        </div>
                      </div>

                      {/* Tip examen */}
                      <div>
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                          {examinationTypes[exam.examination_type] || exam.examination_type}
                        </span>
                      </div>

                      {/* Data */}
                      <div className="text-sm text-gray-600">
                        {fmtDate(exam.examination_date)}
                      </div>

                      {/* Medic */}
                      <div className="text-sm text-gray-600">
                        {exam.doctor_name || '—'}
                      </div>

                      {/* Rezultat */}
                      <div>
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${resultColors[exam.result] || 'bg-gray-100 text-gray-700'}`}>
                          {resultLabels[exam.result] || exam.result}
                        </span>
                        {exam.restrictions && (
                          <div className="text-xs text-orange-600 mt-1" title={exam.restrictions}>
                            ⚠️ Restricții
                          </div>
                        )}
                      </div>

                      {/* Următorul examen */}
                      <div className="text-sm">
                        {nextExam.date ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            <span className={`font-medium ${
                              nextExam.daysUntil !== null && nextExam.daysUntil < 0
                                ? 'text-red-600'
                                : nextExam.daysUntil !== null && nextExam.daysUntil <= 30
                                ? 'text-orange-500'
                                : 'text-gray-600'
                            }`}>
                              {fmtDate(nextExam.date)}
                            </span>
                            {nextExam.daysUntil !== null && (
                              <span className="text-xs text-gray-400">
                                ({nextExam.daysUntil > 0
                                  ? `${nextExam.daysUntil}z`
                                  : `${Math.abs(nextExam.daysUntil)}z dep.`})
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
                    <span>Afișează:</span>
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
                    <span>/ {filteredAndSorted.length} total</span>
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
                      Pagina {currentPage} din {totalPages}
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
