'use client'

// app/[locale]/dashboard/employees/EmployeesClient.tsx
// Lista angajaților cu search, filtre, sortare și paginare

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from '@/i18n/navigation'
import {
  Search,
  Users,
  Building2,
  Upload,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { DataTable, type DataTableColumn, type DataTablePagination, type DataTableSort } from '@/components/ui/DataTable'

const PAGE_SIZE = 20

interface Employee {
  id: string
  organization_id: string
  full_name: string
  cnp_hash: string | null
  nationality: string | null
  job_title: string | null
  department: string | null
  hire_date: string | null
  phone: string | null
  email: string | null
  is_active: boolean
  cor_code: string | null
  termination_date: string | null
  medical_exam_months: number | null
  osh_training_months: number | null
  fire_training_months: number | null
  created_at: string
  updated_at: string
}

interface EmployeesClientProps {
  initialOrgId: string
  organizations: Array<{ id: string; name: string }>
}

export default function EmployeesClient({
  initialOrgId,
  organizations,
}: EmployeesClientProps) {
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  const [selectedOrgId, setSelectedOrgId] = useState(initialOrgId)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Filtre
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [departments, setDepartments] = useState<string[]>([])

  // Sortare
  const [sort, setSort] = useState<DataTableSort>({ column: 'full_name', direction: 'asc' })

  // Paginare
  const [currentPage, setCurrentPage] = useState(1)

  const selectedOrgName = organizations.find(o => o.id === selectedOrgId)?.name || ''

  // Fetch departments pentru dropdown
  const fetchDepartments = useCallback(async (orgId: string) => {
    const { data } = await supabase
      .from('employees')
      .select('department')
      .eq('organization_id', orgId)
      .not('department', 'is', null)

    if (data) {
      const unique = [...new Set(data.map(r => r.department).filter(Boolean))] as string[]
      setDepartments(unique.sort())
    }
  }, [supabase])

  // Fetch employees cu filtre, sortare și paginare
  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    try {
      const sortCol = sort.column || 'full_name'
      const sortAsc = sort.direction === 'asc'

      // Count query
      let countQuery = supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', selectedOrgId)

      if (statusFilter === 'active') countQuery = countQuery.eq('is_active', true)
      if (statusFilter === 'inactive') countQuery = countQuery.eq('is_active', false)
      if (departmentFilter !== 'all') countQuery = countQuery.eq('department', departmentFilter)
      if (searchText.trim()) {
        countQuery = countQuery.or(
          `full_name.ilike.%${searchText}%,job_title.ilike.%${searchText}%,department.ilike.%${searchText}%`
        )
      }

      const { count } = await countQuery

      // Data query
      let dataQuery = supabase
        .from('employees')
        .select('*')
        .eq('organization_id', selectedOrgId)
        .order(sortCol, { ascending: sortAsc })
        .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1)

      if (statusFilter === 'active') dataQuery = dataQuery.eq('is_active', true)
      if (statusFilter === 'inactive') dataQuery = dataQuery.eq('is_active', false)
      if (departmentFilter !== 'all') dataQuery = dataQuery.eq('department', departmentFilter)
      if (searchText.trim()) {
        dataQuery = dataQuery.or(
          `full_name.ilike.%${searchText}%,job_title.ilike.%${searchText}%,department.ilike.%${searchText}%`
        )
      }

      const { data, error } = await dataQuery

      if (error) {
        console.error('Error fetching employees:', error)
        return
      }

      setEmployees(data || [])
      setTotalCount(count || 0)
    } finally {
      setLoading(false)
    }
  }, [supabase, selectedOrgId, statusFilter, departmentFilter, searchText, sort, currentPage])

  // Refetch when org changes — also reset departments
  useEffect(() => {
    fetchDepartments(selectedOrgId)
    setDepartmentFilter('all')
    setCurrentPage(1)
  }, [selectedOrgId, fetchDepartments])

  // Refetch when filters/sort/page change
  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  // Reset page on filter/search change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchText, statusFilter, departmentFilter, selectedOrgId])

  const handleSort = (column: string) => {
    setSort(prev =>
      prev.column === column
        ? { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: 'asc' }
    )
    setCurrentPage(1)
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const columns: DataTableColumn<Employee>[] = [
    {
      key: 'full_name',
      label: 'Nume complet',
      sortable: true,
      render: (row) => (
        <span className="font-medium text-gray-900">{row.full_name}</span>
      ),
    },
    {
      key: 'job_title',
      label: 'Funcție',
      sortable: true,
      render: (row) => (
        <span className="text-gray-700">{row.job_title || '—'}</span>
      ),
    },
    {
      key: 'department',
      label: 'Departament',
      sortable: true,
      render: (row) => (
        <span className="text-gray-700">{row.department || '—'}</span>
      ),
    },
    {
      key: 'cor_code',
      label: 'COR',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-gray-600">{row.cor_code || '—'}</span>
      ),
    },
    {
      key: 'hire_date',
      label: 'Data angajării',
      sortable: true,
      render: (row) => (
        <span className="text-gray-700 text-sm">{formatDate(row.hire_date)}</span>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (row) =>
        row.is_active ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Activ
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Inactiv
          </span>
        ),
    },
    {
      key: 'cnp_hash',
      label: 'CNP',
      sortable: false,
      render: (row) =>
        row.cnp_hash ? (
          <span className="inline-flex items-center gap-1 text-green-700 text-xs font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
            CNP înregistrat
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-amber-700 text-xs font-medium">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            Lipsă CNP
          </span>
        ),
    },
    {
      key: 'phone',
      label: 'Telefon',
      sortable: false,
      render: (row) => (
        <span className="text-gray-700 text-sm">{row.phone || '—'}</span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: false,
      render: (row) =>
        row.email ? (
          <a
            href={`mailto:${row.email}`}
            className="text-blue-600 hover:underline text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {row.email}
          </a>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        ),
    },
  ]

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const pagination: DataTablePagination = {
    currentPage,
    pageSize: PAGE_SIZE,
    totalItems: totalCount,
    totalPages,
  }

  const isEmpty = !loading && employees.length === 0 && statusFilter === 'all' && departmentFilter === 'all' && !searchText.trim()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="h-7 w-7 text-blue-600" />
                Angajați
              </h1>
              {selectedOrgName && (
                <p className="text-sm text-gray-500 mt-1">{selectedOrgName}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Selector organizație */}
              {organizations.length > 1 && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-gray-400 shrink-0" />
                  <select
                    value={selectedOrgId}
                    onChange={(e) => setSelectedOrgId(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Buton Import */}
              <button
                onClick={() => router.push('/dashboard/import')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-800 text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition-colors"
              >
                <Upload className="h-4 w-4" />
                Import angajați
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* FILTRE */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caută angajat
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Nume, funcție, departament..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filtru status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toți</option>
                <option value="active">Activi</option>
                <option value="inactive">Inactivi</option>
              </select>
            </div>

            {/* Filtru departament */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departament
              </label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toate departamentele</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* CONȚINUT */}
      <main className="max-w-7xl mx-auto px-8 pb-8">
        {/* Total counter */}
        {!loading && (
          <div className="mb-4 text-sm text-gray-600">
            {totalCount === 0
              ? 'Niciun angajat găsit'
              : `${totalCount} ${totalCount === 1 ? 'angajat' : 'angajați'}`}
          </div>
        )}

        {/* Empty state — niciun angajat importat */}
        {isEmpty ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Nu ai angajați încă
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Importă angajații din REGES sau adaugă-i manual pentru a gestiona
              documentația SSM/PSI.
            </p>
            <button
              onClick={() => router.push('/dashboard/import')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-800 text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Importă din REGES
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <DataTable
              columns={columns}
              data={employees}
              loading={loading}
              emptyMessage="Niciun angajat găsit"
              emptyDescription="Încearcă să modifici filtrele sau termenul de căutare."
              pagination={totalPages > 1 ? pagination : undefined}
              sort={sort}
              onSort={handleSort}
              onPageChange={setCurrentPage}
              rowKey={(row) => row.id}
            />
          </div>
        )}
      </main>
    </div>
  )
}
