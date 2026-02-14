// app/[locale]/dashboard/equipment/EquipmentPageClient.tsx
// Pagină Echipamente — live fetch din Supabase cu filtrare, sortare, paginare
// Stats cards, status badges, tabel cu echipamente atribuite angajaților

'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from '@/i18n/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  Wrench,
  Search,
  Plus,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Calendar,
  Grid3x3,
  List
} from 'lucide-react'

// ========== TYPES ==========

interface Equipment {
  id: string
  employee_id: string | null
  equipment_type_id: string
  organization_id: string
  quantity: number
  assignment_date: string
  return_date: string | null
  status: 'active' | 'returned' | 'damaged' | 'lost'
  notes: string | null
  digital_signature: boolean
  created_at: string
  updated_at: string
  employees?: {
    id: string
    full_name: string
    job_title: string | null
  }
  equipment_types?: {
    id: string
    name: string
    category: string
    inspection_frequency: string | null
  }
  organizations?: {
    name: string
    cui: string
  }
}

type EquipmentStatus = 'active' | 'returned' | 'damaged' | 'lost'
type SortDirection = 'asc' | 'desc'
type ViewMode = 'table' | 'grid'

// ========== COMPONENT ==========

export default function EquipmentPageClient() {
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  // State
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortColumn, setSortColumn] = useState<string | null>('assignment_date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  // ========== FETCH DATA ==========

  useEffect(() => {
    async function fetchEquipment() {
      try {
        setLoading(true)

        const { data, error } = await supabase
          .from('employee_equipment')
          .select(`
            *,
            employees!inner(id, full_name, job_title),
            equipment_types!inner(id, name, category, inspection_frequency),
            organizations(name, cui)
          `)
          .order('assignment_date', { ascending: false })

        if (error) throw error

        setEquipment(data || [])
      } catch (err) {
        console.error('[EQUIPMENT] Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEquipment()
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

  function getStatusBadgeVariant(status: EquipmentStatus): 'success' | 'warning' | 'error' | 'default' {
    switch (status) {
      case 'active': return 'success'
      case 'returned': return 'default'
      case 'damaged': return 'warning'
      case 'lost': return 'error'
      default: return 'default'
    }
  }

  function getStatusLabel(status: EquipmentStatus): string {
    const labels: Record<EquipmentStatus, string> = {
      active: 'Activ',
      returned: 'Returnat',
      damaged: 'Deteriorat',
      lost: 'Pierdut'
    }
    return labels[status] || status
  }

  function fmtDate(d: string | null): string {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  function getNextInspectionDate(assignmentDate: string, frequency: string | null): string | null {
    if (!frequency) return null

    const assignment = new Date(assignmentDate)
    let nextInspection = new Date(assignment)

    switch (frequency) {
      case 'annual':
        nextInspection.setFullYear(nextInspection.getFullYear() + 1)
        break
      case 'biannual':
        nextInspection.setMonth(nextInspection.getMonth() + 6)
        break
      case 'quarterly':
        nextInspection.setMonth(nextInspection.getMonth() + 3)
        break
      case 'monthly':
        nextInspection.setMonth(nextInspection.getMonth() + 1)
        break
      default:
        return null
    }

    return nextInspection.toISOString().split('T')[0]
  }

  function getInspectionStatus(nextInspectionDate: string | null): 'valid' | 'expiring' | 'expired' {
    if (!nextInspectionDate) return 'valid'

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const inspection = new Date(nextInspectionDate)
    const daysUntilInspection = Math.ceil((inspection.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilInspection < 0) return 'expired'
    if (daysUntilInspection <= 30) return 'expiring'
    return 'valid'
  }

  // ========== STATS ==========

  const stats = useMemo(() => {
    const active = equipment.filter(e => e.status === 'active').length
    const needsInspection = equipment.filter(e => {
      if (e.status !== 'active') return false
      const nextInspection = getNextInspectionDate(e.assignment_date, e.equipment_types?.inspection_frequency || null)
      if (!nextInspection) return false
      return getInspectionStatus(nextInspection) === 'expiring' || getInspectionStatus(nextInspection) === 'expired'
    }).length
    const damaged = equipment.filter(e => e.status === 'damaged' || e.status === 'lost').length

    return { active, needsInspection, damaged }
  }, [equipment])

  // ========== FILTERED & SORTED DATA ==========

  const filteredEquipment = useMemo(() => {
    return equipment.filter(item => {
      // Search filter
      const searchLower = debouncedSearch.toLowerCase()
      const matchesSearch = !debouncedSearch ||
        item.employees?.full_name.toLowerCase().includes(searchLower) ||
        item.equipment_types?.name.toLowerCase().includes(searchLower) ||
        item.equipment_types?.category.toLowerCase().includes(searchLower) ||
        item.notes?.toLowerCase().includes(searchLower)

      // Category filter
      const matchesCategory = filterCategory === 'all' ||
        item.equipment_types?.category === filterCategory

      // Status filter
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [equipment, debouncedSearch, filterCategory, filterStatus])

  const sortedEquipment = useMemo(() => {
    if (!sortColumn) return filteredEquipment

    return [...filteredEquipment].sort((a, b) => {
      let valA: any, valB: any

      switch (sortColumn) {
        case 'employee':
          valA = a.employees?.full_name || ''
          valB = b.employees?.full_name || ''
          break
        case 'equipment_type':
          valA = a.equipment_types?.name || ''
          valB = b.equipment_types?.name || ''
          break
        case 'category':
          valA = a.equipment_types?.category || ''
          valB = b.equipment_types?.category || ''
          break
        case 'assignment_date':
          valA = new Date(a.assignment_date).getTime()
          valB = new Date(b.assignment_date).getTime()
          break
        case 'status':
          valA = a.status
          valB = b.status
          break
        default:
          return 0
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredEquipment, sortColumn, sortDirection])

  // ========== PAGINATION ==========

  const paginatedEquipment = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedEquipment.slice(startIndex, startIndex + pageSize)
  }, [sortedEquipment, currentPage, pageSize])

  const totalPages = Math.ceil(sortedEquipment.length / pageSize)

  // ========== SORT HANDLER ==========

  function handleSort(column: string) {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // ========== UNIQUE CATEGORIES ==========

  const uniqueCategories = useMemo(() => {
    const categories = new Set(equipment.map(e => e.equipment_types?.category).filter(Boolean))
    return Array.from(categories).sort()
  }, [equipment])

  // ========== RENDER ==========

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă echipamentele...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-white rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Echipamente</h1>
              <p className="text-sm text-gray-600 mt-1">
                {sortedEquipment.length} echipament{sortedEquipment.length !== 1 ? 'e' : ''} găsit{sortedEquipment.length !== 1 ? 'e' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard/equipment/add')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adaugă echipament
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Wrench className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Necesită verificare</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{stats.needsInspection}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Deteriorate/Pierdute</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.damaged}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <Wrench className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto mb-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Caută angajat, echipament, categorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value)
              setCurrentPage(1)
            }}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toate categoriile</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value)
              setCurrentPage(1)
            }}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toate statusurile</option>
            <option value="active">Activ</option>
            <option value="returned">Returnat</option>
            <option value="damaged">Deteriorat</option>
            <option value="lost">Pierdut</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {paginatedEquipment.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title="Niciun echipament găsit"
            description={debouncedSearch || filterCategory !== 'all' || filterStatus !== 'all'
              ? "Încercați să modificați filtrele de căutare"
              : "Adăugați primul echipament pentru a începe"}
            action={
              <button
                onClick={() => router.push('/dashboard/equipment/add')}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Adaugă echipament
              </button>
            }
          />
        ) : viewMode === 'table' ? (
          // Table View
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th
                      onClick={() => handleSort('equipment_type')}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        Denumire echipament
                        {sortColumn === 'equipment_type' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('category')}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        Categorie
                        {sortColumn === 'category' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Serie/Nr. Inventar
                    </th>
                    <th
                      onClick={() => handleSort('employee')}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        Atribuit către
                        {sortColumn === 'employee' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('assignment_date')}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        Data atribuirii
                        {sortColumn === 'assignment_date' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Ultima verificare
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Următoarea verificare
                    </th>
                    <th
                      onClick={() => handleSort('status')}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortColumn === 'status' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedEquipment.map((item) => {
                    const nextInspection = getNextInspectionDate(
                      item.assignment_date,
                      item.equipment_types?.inspection_frequency || null
                    )
                    const inspectionStatus = getInspectionStatus(nextInspection)

                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {item.equipment_types?.name || '—'}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-sm text-gray-600">Cantitate: {item.quantity}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {item.equipment_types?.category || '—'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {item.notes || '—'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {item.employees?.full_name || '—'}
                          </div>
                          {item.employees?.job_title && (
                            <div className="text-sm text-gray-600">{item.employees.job_title}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {fmtDate(item.assignment_date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {fmtDate(item.assignment_date)}
                        </td>
                        <td className="px-6 py-4">
                          {nextInspection ? (
                            <div>
                              <div className="text-sm text-gray-700">{fmtDate(nextInspection)}</div>
                              {inspectionStatus !== 'valid' && (
                                <StatusBadge
                                  variant={inspectionStatus === 'expired' ? 'error' : 'warning'}
                                  label={inspectionStatus === 'expired' ? 'Expirat' : 'Expiră curând'}
                                />
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge
                            variant={getStatusBadgeVariant(item.status)}
                            label={getStatusLabel(item.status)}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedEquipment.map((item) => {
              const nextInspection = getNextInspectionDate(
                item.assignment_date,
                item.equipment_types?.inspection_frequency || null
              )
              const inspectionStatus = getInspectionStatus(nextInspection)

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.equipment_types?.name || '—'}
                      </h3>
                      <p className="text-sm text-gray-600">{item.equipment_types?.category || '—'}</p>
                    </div>
                    <StatusBadge
                      variant={getStatusBadgeVariant(item.status)}
                      label={getStatusLabel(item.status)}
                    />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Atribuit către:</span>
                      <p className="font-medium text-gray-900">{item.employees?.full_name || '—'}</p>
                      {item.employees?.job_title && (
                        <p className="text-gray-600">{item.employees.job_title}</p>
                      )}
                    </div>

                    {item.quantity > 1 && (
                      <div>
                        <span className="text-gray-600">Cantitate: </span>
                        <span className="font-medium text-gray-900">{item.quantity}</span>
                      </div>
                    )}

                    <div>
                      <span className="text-gray-600">Data atribuirii: </span>
                      <span className="font-medium text-gray-900">{fmtDate(item.assignment_date)}</span>
                    </div>

                    {nextInspection && (
                      <div>
                        <span className="text-gray-600">Următoarea verificare: </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-medium text-gray-900">{fmtDate(nextInspection)}</span>
                          {inspectionStatus !== 'valid' && (
                            <StatusBadge
                              variant={inspectionStatus === 'expired' ? 'error' : 'warning'}
                              label={inspectionStatus === 'expired' ? 'Expirat' : 'Expiră'}
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {item.notes && (
                      <div>
                        <span className="text-gray-600">Serie/Nr.: </span>
                        <span className="font-medium text-gray-900">{item.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600">
              Pagina {currentPage} din {totalPages} ({sortedEquipment.length} total)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-xl transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Următor
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
