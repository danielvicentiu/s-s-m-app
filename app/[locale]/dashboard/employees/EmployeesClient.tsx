'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  Users,
  Plus,
  Search,
  Download,
  Eye,
  Filter,
  X
} from 'lucide-react'
import type { Employee } from '@/lib/types'

interface EmployeesClientProps {
  employees: Employee[]
  organizationId: string
}

// Calculate training status for an employee
function getTrainingStatus(employee: Employee): 'success' | 'warning' | 'danger' {
  // TODO: Implement actual training status logic when trainings are linked
  // For now, return a random status for demo purposes
  const rand = Math.random()
  if (rand > 0.7) return 'danger'
  if (rand > 0.4) return 'warning'
  return 'success'
}

function getTrainingStatusLabel(status: 'success' | 'warning' | 'danger'): string {
  const labels = {
    success: 'La zi',
    warning: 'Expiră curând',
    danger: 'Expirat'
  }
  return labels[status]
}

export default function EmployeesClient({ employees, organizationId }: EmployeesClientProps) {
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique departments
  const departments = useMemo(() => {
    const depts = new Set<string>()
    employees.forEach(emp => {
      if (emp.department) depts.add(emp.department)
    })
    return Array.from(depts).sort()
  }, [employees])

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // Search filter
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = !searchTerm ||
        emp.full_name.toLowerCase().includes(searchLower) ||
        emp.job_title?.toLowerCase().includes(searchLower) ||
        emp.email?.toLowerCase().includes(searchLower) ||
        emp.department?.toLowerCase().includes(searchLower)

      // Department filter
      const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter

      return matchesSearch && matchesDepartment
    })
  }, [employees, searchTerm, departmentFilter])

  // Statistics
  const stats = {
    total: employees.length,
    active: employees.filter(e => e.is_active).length,
    inactive: employees.filter(e => !e.is_active).length,
    filtered: filteredEmployees.length
  }

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Nume Complet', 'Funcție', 'Departament', 'Email', 'Telefon', 'Data Angajare', 'Status']
    const rows = filteredEmployees.map(emp => [
      emp.full_name,
      emp.job_title || '',
      emp.department || '',
      emp.email || '',
      emp.phone || '',
      emp.hire_date ? new Date(emp.hire_date).toLocaleDateString('ro-RO') : '',
      emp.is_active ? 'Activ' : 'Inactiv'
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `angajati_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Table columns
  const columns: DataTableColumn<Employee>[] = [
    {
      key: 'full_name',
      label: 'Angajat',
      render: (row) => (
        <div className="flex items-center gap-3">
          {/* Avatar placeholder */}
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-700 font-semibold text-sm">
              {row.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.full_name}</div>
            {row.email && (
              <div className="text-xs text-gray-500">{row.email}</div>
            )}
          </div>
        </div>
      ),
      width: '280px'
    },
    {
      key: 'job_title',
      label: 'Funcție',
      render: (row) => (
        <span className="text-sm text-gray-900">
          {row.job_title || <span className="text-gray-400">—</span>}
        </span>
      ),
      width: '180px'
    },
    {
      key: 'department',
      label: 'Departament',
      render: (row) => (
        <span className="text-sm text-gray-900">
          {row.department || <span className="text-gray-400">—</span>}
        </span>
      ),
      width: '150px'
    },
    {
      key: 'hire_date',
      label: 'Data Angajare',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.hire_date ? new Date(row.hire_date).toLocaleDateString('ro-RO') : <span className="text-gray-400">—</span>}
        </span>
      ),
      width: '130px'
    },
    {
      key: 'training_status',
      label: 'Status Instruiri',
      sortable: false,
      render: (row) => {
        const status = getTrainingStatus(row)
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            status === 'success' ? 'bg-green-100 text-green-700' :
            status === 'warning' ? 'bg-orange-100 text-orange-700' :
            'bg-red-100 text-red-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              status === 'success' ? 'bg-green-500' :
              status === 'warning' ? 'bg-orange-500' :
              'bg-red-500'
            }`} />
            {getTrainingStatusLabel(status)}
          </span>
        )
      },
      width: '140px'
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (row) => (
        <StatusBadge
          status={row.is_active ? 'active' : 'inactive'}
          size="sm"
        />
      ),
      width: '100px'
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      render: (row) => (
        <button
          onClick={() => router.push(`/dashboard/employees/${row.id}`)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
          title="Vezi detalii"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
      width: '60px'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Angajați
            </h1>
            <p className="text-sm text-gray-400">
              Gestionare angajați — {stats.total} {stats.total === 1 ? 'angajat' : 'angajați'}
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/employees/new')}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adaugă Angajat
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6 space-y-5">
        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-3xl font-black text-gray-900">{stats.total}</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
              Total
            </div>
          </div>
          <div className="bg-green-50 rounded-xl border border-green-100 p-4 text-center">
            <div className="text-3xl font-black text-green-600">{stats.active}</div>
            <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">
              Activi
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-3xl font-black text-gray-500">{stats.inactive}</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">
              Inactivi
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 text-center">
            <div className="text-3xl font-black text-blue-600">{stats.filtered}</div>
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">
              Afișați
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Caută după nume, funcție, email, departament..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
              showFilters
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            Filtre
            {departmentFilter !== 'all' && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                1
              </span>
            )}
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            disabled={filteredEmployees.length === 0}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Filtrare</h3>
              {departmentFilter !== 'all' && (
                <button
                  onClick={() => setDepartmentFilter('all')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Resetează filtre
                </button>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Departament
              </label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full sm:w-64 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toate departamentele</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {employees.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Niciun angajat"
              description="Adaugă primul angajat pentru a începe."
              actionLabel="+ Adaugă Angajat"
              onAction={() => router.push('/dashboard/employees/new')}
            />
          ) : filteredEmployees.length === 0 ? (
            <div className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Niciun rezultat
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Nu am găsit angajați care să corespundă criteriilor de căutare.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setDepartmentFilter('all')
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Resetează filtrele
              </button>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredEmployees}
              rowKey={(row) => row.id}
            />
          )}
        </div>
      </main>
    </div>
  )
}
