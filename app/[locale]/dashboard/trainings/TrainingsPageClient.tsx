// app/[locale]/dashboard/trainings/TrainingsPageClient.tsx
// Pagină Instruiri — live fetch Supabase cu stats, filtre, sortare, paginare
// Afișare: angajat, tip instruire, data, durata, instructor, status, următoarea instruire

'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from '@/i18n/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { FormModal } from '@/components/ui/FormModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import {
  GraduationCap,
  Search,
  Plus,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  Download
} from 'lucide-react'

// ========== TYPES ==========

interface TrainingSession {
  id: string
  organization_id: string
  employee_id: string | null
  employee_name: string
  training_type: string
  training_date: string
  duration_minutes: number
  instructor_name: string | null
  status: 'completed' | 'scheduled' | 'cancelled'
  expiry_date: string | null
  frequency: 'annual' | 'biannual' | 'triannual' | 'once' | null
  notes: string | null
  created_at: string
  updated_at: string
  // Relations
  employees?: { full_name: string; job_title: string | null }
  organizations?: { name: string; cui: string }
}

interface Employee {
  id: string
  full_name: string
  job_title: string | null
  organization_id: string
}

interface Organization {
  id: string
  name: string
  cui: string
}

type ExpiryStatus = 'valid' | 'expiring' | 'expired' | 'incomplete'
type SortDirection = 'asc' | 'desc'

// ========== EMPTY FORM ==========

const emptyForm = {
  organization_id: '',
  employee_id: '',
  employee_name: '',
  training_type: 'periodic',
  training_date: '',
  duration_minutes: 60,
  instructor_name: '',
  status: 'completed' as const,
  expiry_date: '',
  frequency: null as 'annual' | 'biannual' | 'triannual' | 'once' | null,
  notes: '',
}

// ========== COMPONENT ==========

export default function TrainingsPageClient() {
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  // State
  const [trainings, setTrainings] = useState<TrainingSession[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<TrainingSession | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // ========== FETCH DATA ==========

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch trainings with employee and org relations
        const { data: trainData, error: trainError } = await supabase
          .from('training_sessions')
          .select('*, employees(full_name, job_title), organizations(name, cui)')
          .order('training_date', { ascending: false })

        if (trainError) throw trainError

        // Fetch employees for dropdown
        const { data: empData } = await supabase
          .from('employees')
          .select('id, full_name, job_title, organization_id')
          .eq('is_active', true)
          .order('full_name')

        // Fetch organizations for filter
        const { data: orgData } = await supabase
          .from('organizations')
          .select('id, name, cui')
          .order('name')

        setTrainings(trainData || [])
        setEmployees(empData || [])
        setOrganizations(orgData || [])
      } catch (err) {
        console.error('[TRAININGS] Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // ========== DEBOUNCE SEARCH ==========

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // ========== HELPERS ==========

  function getExpiryStatus(expiryDate: string | null, frequency: string | null): ExpiryStatus {
    if (!expiryDate || frequency === 'once') return 'incomplete'

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return 'expired'
    if (daysUntilExpiry <= 30) return 'expiring'
    return 'valid'
  }

  function getNextTrainingDate(trainingDate: string, frequency: string | null): string | null {
    if (!frequency || frequency === 'once') return null

    const date = new Date(trainingDate)
    const monthsToAdd = frequency === 'annual' ? 12 : frequency === 'biannual' ? 6 : 4

    date.setMonth(date.getMonth() + monthsToAdd)
    return date.toISOString().split('T')[0]
  }

  function fmtDate(d: string | null): string {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const trainingTypes: Record<string, string> = {
    introductiv_general: 'Introductiv general',
    la_locul_de_munca: 'La locul de muncă',
    periodic: 'Periodic',
    suplimentar: 'Suplimentar',
    psi: 'PSI (Prevenire incendii)',
    situatii_urgenta: 'Situații de urgență',
    custom: 'Altul',
  }

  // ========== FILTERING & SORTING ==========

  const filteredAndSorted = useMemo(() => {
    let result = [...trainings]

    // Filter by search
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase()
      result = result.filter(t =>
        t.employee_name.toLowerCase().includes(query) ||
        t.instructor_name?.toLowerCase().includes(query) ||
        trainingTypes[t.training_type]?.toLowerCase().includes(query)
      )
    }

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter(t => t.training_type === filterType)
    }

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(t => {
        const status = getExpiryStatus(t.expiry_date, t.frequency)
        return status === filterStatus
      })
    }

    // Sort
    if (sortColumn) {
      result.sort((a, b) => {
        let aVal: any
        let bVal: any

        if (sortColumn === 'expiry_status') {
          aVal = getExpiryStatus(a.expiry_date, a.frequency)
          bVal = getExpiryStatus(b.expiry_date, b.frequency)
        } else {
          aVal = (a as any)[sortColumn]
          bVal = (b as any)[sortColumn]
        }

        // Handle nulls
        if (aVal === null || aVal === undefined) return 1
        if (bVal === null || bVal === undefined) return -1

        // Compare
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

  // ========== STATS CALCULATION ==========

  const stats = useMemo(() => {
    const now = new Date()
    const thisMonth = trainings.filter(t => {
      const tDate = new Date(t.training_date)
      return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear()
    })

    const expiring = trainings.filter(t => getExpiryStatus(t.expiry_date, t.frequency) === 'expiring')
    const expired = trainings.filter(t => getExpiryStatus(t.expiry_date, t.frequency) === 'expired')

    return {
      thisMonth: thisMonth.length,
      expiring: expiring.length,
      expired: expired.length,
    }
  }, [trainings])

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

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(training: TrainingSession) {
    setEditingId(training.id)
    setForm({
      organization_id: training.organization_id,
      employee_id: training.employee_id || '',
      employee_name: training.employee_name,
      training_type: training.training_type,
      training_date: training.training_date,
      duration_minutes: training.duration_minutes,
      instructor_name: training.instructor_name || '',
      status: training.status,
      expiry_date: training.expiry_date || '',
      frequency: training.frequency,
      notes: training.notes || '',
    })
    setShowForm(true)
  }

  function handleEmployeeSelect(employeeId: string) {
    const emp = employees.find(e => e.id === employeeId)
    if (emp) {
      setForm(f => ({
        ...f,
        employee_id: employeeId,
        employee_name: emp.full_name,
        organization_id: emp.organization_id || f.organization_id,
      }))
    } else {
      setForm(f => ({ ...f, employee_id: employeeId }))
    }
  }

  async function handleSubmit() {
    try {
      setFormLoading(true)

      // Calculate expiry_date based on training_date and frequency
      let expiryDate = form.expiry_date
      if (!expiryDate && form.frequency && form.frequency !== 'once') {
        expiryDate = getNextTrainingDate(form.training_date, form.frequency) || ''
      }

      const payload = {
        organization_id: form.organization_id || null,
        employee_id: form.employee_id || null,
        employee_name: form.employee_name,
        training_type: form.training_type,
        training_date: form.training_date,
        duration_minutes: form.duration_minutes,
        instructor_name: form.instructor_name || null,
        status: form.status,
        expiry_date: expiryDate || null,
        frequency: form.frequency,
        notes: form.notes || null,
        updated_at: new Date().toISOString(),
      }

      if (editingId) {
        const { error } = await supabase
          .from('training_sessions')
          .update(payload)
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('training_sessions')
          .insert(payload)

        if (error) throw error
      }

      setShowForm(false)
      setEditingId(null)
      setForm(emptyForm)
      router.refresh()
    } catch (err) {
      console.error('[TRAININGS] Save error:', err)
      alert('Eroare la salvare. Verifică datele și încearcă din nou.')
    } finally {
      setFormLoading(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      setDeleteLoading(true)
      const { error } = await supabase
        .from('training_sessions')
        .delete()
        .eq('id', deleteTarget.id)

      if (error) throw error
      setDeleteTarget(null)
      router.refresh()
    } catch (err) {
      console.error('[TRAININGS] Delete error:', err)
      alert('Eroare la ștergere.')
    } finally {
      setDeleteLoading(false)
    }
  }

  function handleExportCSV() {
    const headers = ['Angajat', 'Tip instruire', 'Data', 'Durata (min)', 'Instructor', 'Status', 'Următoarea instruire']
    const rows = filteredAndSorted.map(t => [
      t.employee_name,
      trainingTypes[t.training_type] || t.training_type,
      fmtDate(t.training_date),
      t.duration_minutes.toString(),
      t.instructor_name || '—',
      getExpiryStatus(t.expiry_date, t.frequency),
      fmtDate(getNextTrainingDate(t.training_date, t.frequency))
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `instruiri_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
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
                Instruiri SSM
              </h1>
              <p className="text-sm text-gray-400">
                {loading ? 'Se încarcă...' : `${filteredAndSorted.length} instruiri înregistrate`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              disabled={filteredAndSorted.length === 0}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={openAdd}
              className="bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-900 transition flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Adaugă instruire
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6 space-y-5">
        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-3xl font-black text-blue-600">{stats.thisMonth}</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">
              Instruiri luna aceasta
            </div>
          </div>
          <div className="bg-orange-50 rounded-xl border border-orange-100 p-4 text-center">
            <div className="text-3xl font-black text-orange-600">{stats.expiring}</div>
            <div className="text-xs font-semibold text-orange-600 uppercase tracking-widest mt-1">
              Expiră în 30 zile
            </div>
          </div>
          <div className="bg-red-50 rounded-xl border border-red-100 p-4 text-center">
            <div className="text-3xl font-black text-red-600">{stats.expired}</div>
            <div className="text-xs font-semibold text-red-600 uppercase tracking-widest mt-1">
              Expirate
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Caută după nume angajat, instructor, tip instruire..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="all">Toate tipurile</option>
              {Object.entries(trainingTypes).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="all">Toate statusurile</option>
              <option value="expired">Expirate</option>
              <option value="expiring">Expiră curând</option>
              <option value="valid">Valide</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            // LOADING SKELETON
            <div className="space-y-3 p-4">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div key={idx} className="flex gap-4 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded flex-1" />
                  <div className="h-5 bg-gray-200 rounded w-32" />
                  <div className="h-5 bg-gray-200 rounded w-24" />
                  <div className="h-5 bg-gray-200 rounded w-20" />
                  <div className="h-5 bg-gray-200 rounded w-28" />
                  <div className="h-5 bg-gray-200 rounded w-24" />
                  <div className="h-5 bg-gray-200 rounded w-28" />
                </div>
              ))}
            </div>
          ) : filteredAndSorted.length === 0 ? (
            // EMPTY STATE
            <EmptyState
              icon={GraduationCap}
              title={trainings.length === 0 ? 'Nicio instruire' : 'Niciun rezultat'}
              description={
                trainings.length === 0
                  ? 'Adaugă prima instruire pentru angajați.'
                  : 'Nu există instruiri care să corespundă filtrelor selectate.'
              }
              actionLabel={trainings.length === 0 ? 'Adaugă instruire' : undefined}
              onAction={trainings.length === 0 ? openAdd : undefined}
            />
          ) : (
            <>
              {/* TABLE HEADER */}
              <div className="hidden lg:grid lg:grid-cols-[2fr,1.5fr,1fr,0.8fr,1.5fr,1fr,1fr,0.5fr] gap-4 px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('employee_name')}
                  className="text-left hover:text-gray-900 transition"
                >
                  Angajat {getSortIcon('employee_name')}
                </button>
                <button
                  onClick={() => handleSort('training_type')}
                  className="text-left hover:text-gray-900 transition"
                >
                  Tip instruire {getSortIcon('training_type')}
                </button>
                <button
                  onClick={() => handleSort('training_date')}
                  className="text-left hover:text-gray-900 transition"
                >
                  Data {getSortIcon('training_date')}
                </button>
                <button
                  onClick={() => handleSort('duration_minutes')}
                  className="text-left hover:text-gray-900 transition"
                >
                  Durata {getSortIcon('duration_minutes')}
                </button>
                <button
                  onClick={() => handleSort('instructor_name')}
                  className="text-left hover:text-gray-900 transition"
                >
                  Instructor {getSortIcon('instructor_name')}
                </button>
                <button
                  onClick={() => handleSort('expiry_status')}
                  className="text-left hover:text-gray-900 transition"
                >
                  Status {getSortIcon('expiry_status')}
                </button>
                <div className="text-left">Următoarea</div>
                <div className="text-left">Acțiuni</div>
              </div>

              {/* TABLE ROWS */}
              <div className="divide-y divide-gray-100">
                {paginatedData.map((training) => {
                  const expiryStatus = getExpiryStatus(training.expiry_date, training.frequency)
                  const nextTraining = getNextTrainingDate(training.training_date, training.frequency)

                  return (
                    <div
                      key={training.id}
                      className="grid lg:grid-cols-[2fr,1.5fr,1fr,0.8fr,1.5fr,1fr,1fr,0.5fr] gap-4 px-6 py-4 hover:bg-gray-50 transition"
                    >
                      {/* Angajat */}
                      <div>
                        <div className="font-medium text-gray-900">{training.employee_name}</div>
                        <div className="text-xs text-gray-400">
                          {training.employees?.job_title || '—'}
                        </div>
                      </div>

                      {/* Tip instruire */}
                      <div className="text-sm text-gray-600">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                          {trainingTypes[training.training_type] || training.training_type}
                        </span>
                      </div>

                      {/* Data */}
                      <div className="text-sm text-gray-600">
                        {fmtDate(training.training_date)}
                      </div>

                      {/* Durata */}
                      <div className="text-sm text-gray-600">
                        {training.duration_minutes} min
                      </div>

                      {/* Instructor */}
                      <div className="text-sm text-gray-600">
                        {training.instructor_name || '—'}
                      </div>

                      {/* Status */}
                      <div>
                        {expiryStatus !== 'incomplete' && (
                          <StatusBadge status={expiryStatus} />
                        )}
                      </div>

                      {/* Următoarea instruire */}
                      <div className="text-sm text-gray-600">
                        {nextTraining ? fmtDate(nextTraining) : '—'}
                      </div>

                      {/* Acțiuni */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(training)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"
                          title="Editează"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(training)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600"
                          title="Șterge"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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

      {/* ========== FORM MODAL ========== */}
      <FormModal
        title={editingId ? 'Editează instruirea' : 'Adaugă instruire'}
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingId(null); setForm(emptyForm) }}
        onSubmit={handleSubmit}
        loading={formLoading}
        submitLabel={editingId ? 'Salvează modificările' : 'Adaugă instruirea'}
      >
        {/* Organizație */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organizație *</label>
          <select
            value={form.organization_id}
            onChange={(e) => setForm(f => ({ ...f, organization_id: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          >
            <option value="">Selectează organizația</option>
            {organizations.map(o => (
              <option key={o.id} value={o.id}>{o.name} ({o.cui})</option>
            ))}
          </select>
        </div>

        {/* Angajat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Angajat</label>
          <select
            value={form.employee_id}
            onChange={(e) => handleEmployeeSelect(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
          >
            <option value="">Selectează sau completează manual ↓</option>
            {employees
              .filter(e => !form.organization_id || e.organization_id === form.organization_id)
              .map(e => (
                <option key={e.id} value={e.id}>{e.full_name} — {e.job_title || 'fără funcție'}</option>
              ))}
          </select>
        </div>

        {/* Nume angajat (manual) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nume angajat *</label>
          <input
            type="text"
            value={form.employee_name}
            onChange={(e) => setForm(f => ({ ...f, employee_name: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            placeholder="Popescu Ion"
            required
          />
        </div>

        {/* Tip instruire + Frecvență */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tip instruire *</label>
            <select
              value={form.training_type}
              onChange={(e) => setForm(f => ({ ...f, training_type: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              {Object.entries(trainingTypes).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frecvență</label>
            <select
              value={form.frequency || ''}
              onChange={(e) => setForm(f => ({ ...f, frequency: e.target.value as any }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              <option value="">Nicio reînnoire</option>
              <option value="once">O singură dată</option>
              <option value="annual">Anual</option>
              <option value="biannual">Biannual (6 luni)</option>
              <option value="triannual">Triannual (4 luni)</option>
            </select>
          </div>
        </div>

        {/* Data + Durata */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data instruirii *</label>
            <input
              type="date"
              value={form.training_date}
              onChange={(e) => setForm(f => ({ ...f, training_date: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durata (minute) *</label>
            <input
              type="number"
              value={form.duration_minutes}
              onChange={(e) => setForm(f => ({ ...f, duration_minutes: Number(e.target.value) }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              min="1"
              required
            />
          </div>
        </div>

        {/* Instructor + Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
            <input
              type="text"
              value={form.instructor_name}
              onChange={(e) => setForm(f => ({ ...f, instructor_name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Nume instructor"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select
              value={form.status}
              onChange={(e) => setForm(f => ({ ...f, status: e.target.value as any }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              <option value="completed">Completată</option>
              <option value="scheduled">Programată</option>
              <option value="cancelled">Anulată</option>
            </select>
          </div>
        </div>

        {/* Data expirare (opțional — se calculează automat) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data expirare (opțional — se calculează automat din frecvență)
          </label>
          <input
            type="date"
            value={form.expiry_date}
            onChange={(e) => setForm(f => ({ ...f, expiry_date: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observații</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none"
            placeholder="Note suplimentare..."
          />
        </div>
      </FormModal>

      {/* ========== DELETE CONFIRM ========== */}
      <ConfirmDialog
        title="Șterge instruirea"
        message={`Sigur vrei să ștergi instruirea pentru "${deleteTarget?.employee_name || ''}"? Acțiunea este ireversibilă.`}
        confirmLabel="Șterge definitiv"
        isOpen={deleteTarget !== null}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isDestructive={true}
        loading={deleteLoading}
      />
    </div>
  )
}
