'use client'

// lib/hooks/useEmployees.ts
// Hook React pentru gestionarea angajaților
// Oferă operațiuni CRUD, căutare și paginare folosind EmployeeService

import { useState, useCallback, useEffect } from 'react'
import {
  employeeService,
  type Employee,
  type CreateEmployeeInput,
  type UpdateEmployeeInput,
  type SearchParams,
  type PaginatedResponse,
} from '@/lib/services/EmployeeService'

// ========== TYPES ==========

export interface UseEmployeesOptions {
  /** ID-ul organizației pentru care se încarcă angajații */
  organizationId?: string
  /** Încarcă automat angajații la mount */
  autoFetch?: boolean
  /** Parametri inițiali de căutare și paginare */
  initialParams?: SearchParams
}

export interface UseEmployeesReturn {
  // Date
  employees: Employee[]
  total: number
  page: number
  pageSize: number
  totalPages: number

  // Stări
  loading: boolean
  error: string | null

  // Operațiuni CRUD
  addEmployee: (input: CreateEmployeeInput) => Promise<Employee>
  updateEmployee: (id: string, input: UpdateEmployeeInput) => Promise<Employee>
  deleteEmployee: (id: string) => Promise<void>
  hardDeleteEmployee: (id: string) => Promise<void>

  // Căutare și filtrare
  searchEmployees: (searchTerm: string) => Promise<void>
  setFilters: (filters: Partial<SearchParams>) => void
  clearFilters: () => void

  // Paginare
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  nextPage: () => void
  previousPage: () => void

  // Refresh
  refetch: () => Promise<void>

  // Helper
  getEmployeeById: (id: string) => Promise<Employee | null>
  checkDuplicateCNP: (cnpHash: string, excludeId?: string) => Promise<boolean>
}

// ========== HOOK ==========

/**
 * Hook pentru gestionarea angajaților cu suport CRUD, căutare și paginare
 *
 * @example
 * ```tsx
 * function EmployeesList() {
 *   const {
 *     employees,
 *     loading,
 *     error,
 *     addEmployee,
 *     updateEmployee,
 *     deleteEmployee,
 *     searchEmployees,
 *     page,
 *     totalPages,
 *     nextPage,
 *     previousPage,
 *   } = useEmployees({
 *     organizationId: 'org-123',
 *     autoFetch: true,
 *     initialParams: { pageSize: 20 }
 *   })
 *
 *   if (loading) return <div>Se încarcă...</div>
 *   if (error) return <div>Eroare: {error}</div>
 *
 *   return (
 *     <div>
 *       <input
 *         type="text"
 *         onChange={(e) => searchEmployees(e.target.value)}
 *         placeholder="Caută angajați..."
 *       />
 *       <ul>
 *         {employees.map(emp => (
 *           <li key={emp.id}>{emp.full_name} - {emp.job_title}</li>
 *         ))}
 *       </ul>
 *       <button onClick={previousPage} disabled={page === 1}>Anterior</button>
 *       <span>Pagina {page} din {totalPages}</span>
 *       <button onClick={nextPage} disabled={page === totalPages}>Următor</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useEmployees(options: UseEmployeesOptions = {}): UseEmployeesReturn {
  const {
    organizationId,
    autoFetch = true,
    initialParams = {},
  } = options

  // ========== STATE ==========

  const [employees, setEmployees] = useState<Employee[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(initialParams.page || 1)
  const [pageSize, setPageSize] = useState(initialParams.pageSize || 50)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useState<SearchParams>({
    organizationId,
    ...initialParams,
  })

  // ========== FETCH EMPLOYEES ==========

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params: SearchParams = {
        ...searchParams,
        organizationId: organizationId || searchParams.organizationId,
        page,
        pageSize,
      }

      const response: PaginatedResponse<Employee> = await employeeService.getAll(params)

      setEmployees(response.data)
      setTotal(response.total)
      setTotalPages(response.totalPages)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Eroare la încărcarea angajaților'
      setError(errorMessage)
      console.error('Error fetching employees:', err)
    } finally {
      setLoading(false)
    }
  }, [organizationId, searchParams, page, pageSize])

  // Auto-fetch la mount dacă autoFetch = true
  useEffect(() => {
    if (autoFetch) {
      fetchEmployees()
    }
  }, [autoFetch, fetchEmployees])

  // ========== CRUD OPERATIONS ==========

  const addEmployee = useCallback(
    async (input: CreateEmployeeInput): Promise<Employee> => {
      try {
        setLoading(true)
        setError(null)

        const newEmployee = await employeeService.create(input)

        // Refresh lista după adăugare
        await fetchEmployees()

        return newEmployee
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Eroare la adăugarea angajatului'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchEmployees]
  )

  const updateEmployee = useCallback(
    async (id: string, input: UpdateEmployeeInput): Promise<Employee> => {
      try {
        setLoading(true)
        setError(null)

        const updatedEmployee = await employeeService.update(id, input)

        // Actualizează lista local
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === id ? updatedEmployee : emp))
        )

        return updatedEmployee
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Eroare la actualizarea angajatului'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const deleteEmployee = useCallback(
    async (id: string): Promise<void> => {
      try {
        setLoading(true)
        setError(null)

        await employeeService.delete(id)

        // Refresh lista după ștergere
        await fetchEmployees()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Eroare la ștergerea angajatului'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchEmployees]
  )

  const hardDeleteEmployee = useCallback(
    async (id: string): Promise<void> => {
      try {
        setLoading(true)
        setError(null)

        await employeeService.hardDelete(id)

        // Refresh lista după ștergere
        await fetchEmployees()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Eroare la ștergerea definitivă a angajatului'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchEmployees]
  )

  // ========== SEARCH & FILTER ==========

  const searchEmployees = useCallback(
    async (searchTerm: string): Promise<void> => {
      setSearchParams((prev) => ({
        ...prev,
        searchTerm: searchTerm.trim(),
      }))
      setPage(1) // Reset to first page on search
    },
    []
  )

  const setFilters = useCallback((filters: Partial<SearchParams>) => {
    setSearchParams((prev) => ({
      ...prev,
      ...filters,
    }))
    setPage(1) // Reset to first page when filters change
  }, [])

  const clearFilters = useCallback(() => {
    setSearchParams({
      organizationId,
    })
    setPage(1)
  }, [organizationId])

  // ========== PAGINATION ==========

  const handleSetPage = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const handleSetPageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1) // Reset to first page when page size changes
  }, [])

  const nextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, totalPages))
  }, [totalPages])

  const previousPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1))
  }, [])

  // ========== HELPERS ==========

  const getEmployeeById = useCallback(async (id: string): Promise<Employee | null> => {
    try {
      return await employeeService.getById(id)
    } catch (err) {
      console.error('Error fetching employee by id:', err)
      return null
    }
  }, [])

  const checkDuplicateCNP = useCallback(
    async (cnpHash: string, excludeId?: string): Promise<boolean> => {
      if (!organizationId) {
        console.warn('checkDuplicateCNP: organizationId is required')
        return false
      }

      try {
        return await employeeService.checkDuplicateCNP(
          organizationId,
          cnpHash,
          excludeId
        )
      } catch (err) {
        console.error('Error checking duplicate CNP:', err)
        return false
      }
    },
    [organizationId]
  )

  const refetch = useCallback(async (): Promise<void> => {
    await fetchEmployees()
  }, [fetchEmployees])

  // ========== RETURN ==========

  return {
    // Date
    employees,
    total,
    page,
    pageSize,
    totalPages,

    // Stări
    loading,
    error,

    // CRUD
    addEmployee,
    updateEmployee,
    deleteEmployee,
    hardDeleteEmployee,

    // Căutare și filtrare
    searchEmployees,
    setFilters,
    clearFilters,

    // Paginare
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    nextPage,
    previousPage,

    // Refresh
    refetch,

    // Helpers
    getEmployeeById,
    checkDuplicateCNP,
  }
}

export default useEmployees
