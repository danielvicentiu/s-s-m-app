// lib/services/EmployeeService.ts
// Service pentru gestionarea angajaților
// Oferă operațiuni CRUD, căutare și paginare pentru tabela employees

import { createSupabaseBrowser } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'

// ========== TYPES ==========

export interface Employee {
  id: string
  organization_id: string
  full_name: string
  cnp_hash: string | null
  email: string | null
  phone: string | null
  job_title: string | null
  department: string | null
  hire_date: string | null
  birth_date: string | null
  gender: string | null
  address: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  is_active: boolean
  cor_code: string | null
  created_at: string
  updated_at: string
  organizations?: {
    name: string
    cui: string | null
  }
}

export interface CreateEmployeeInput {
  organization_id: string
  full_name: string
  cnp_hash?: string | null
  email?: string | null
  phone?: string | null
  job_title?: string | null
  department?: string | null
  hire_date?: string | null
  birth_date?: string | null
  gender?: string | null
  address?: string | null
  emergency_contact_name?: string | null
  emergency_contact_phone?: string | null
  is_active?: boolean
  cor_code?: string | null
}

export interface UpdateEmployeeInput {
  full_name?: string
  cnp_hash?: string | null
  email?: string | null
  phone?: string | null
  job_title?: string | null
  department?: string | null
  hire_date?: string | null
  birth_date?: string | null
  gender?: string | null
  address?: string | null
  emergency_contact_name?: string | null
  emergency_contact_phone?: string | null
  is_active?: boolean
  cor_code?: string | null
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface SearchParams extends PaginationParams {
  organizationId?: string
  searchTerm?: string
  isActive?: boolean
  department?: string
  jobTitle?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ========== SERVICE ==========

export class EmployeeService {
  private supabase: SupabaseClient

  constructor(supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || createSupabaseBrowser()
  }

  /**
   * Obține toți angajații cu relațiile organizației
   */
  async getAll(params?: SearchParams): Promise<PaginatedResponse<Employee>> {
    const {
      page = 1,
      pageSize = 50,
      organizationId,
      searchTerm,
      isActive,
      department,
      jobTitle,
    } = params || {}

    let query = this.supabase
      .from('employees')
      .select('*, organizations!inner(name, cui)', { count: 'exact' })

    // Filtre
    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    }

    if (isActive !== undefined) {
      query = query.eq('is_active', isActive)
    }

    if (department) {
      query = query.eq('department', department)
    }

    if (jobTitle) {
      query = query.eq('job_title', jobTitle)
    }

    if (searchTerm && searchTerm.trim()) {
      query = query.or(
        `full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
      )
    }

    // Paginare
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    query = query.range(from, to).order('full_name', { ascending: true })

    const { data, error, count } = await query

    if (error) {
      throw new Error(`Failed to fetch employees: ${error.message}`)
    }

    return {
      data: (data as Employee[]) || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    }
  }

  /**
   * Obține un angajat după ID
   */
  async getById(id: string): Promise<Employee | null> {
    const { data, error } = await this.supabase
      .from('employees')
      .select('*, organizations!inner(name, cui)')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw new Error(`Failed to fetch employee: ${error.message}`)
    }

    return data as Employee
  }

  /**
   * Creează un angajat nou
   */
  async create(input: CreateEmployeeInput): Promise<Employee> {
    const { data, error } = await this.supabase
      .from('employees')
      .insert({
        ...input,
        is_active: input.is_active ?? true,
      })
      .select('*, organizations!inner(name, cui)')
      .single()

    if (error) {
      throw new Error(`Failed to create employee: ${error.message}`)
    }

    return data as Employee
  }

  /**
   * Actualizează un angajat existent
   */
  async update(id: string, input: UpdateEmployeeInput): Promise<Employee> {
    const { data, error } = await this.supabase
      .from('employees')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, organizations!inner(name, cui)')
      .single()

    if (error) {
      throw new Error(`Failed to update employee: ${error.message}`)
    }

    return data as Employee
  }

  /**
   * Șterge un angajat (soft delete - marchează ca inactiv)
   */
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('employees')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete employee: ${error.message}`)
    }
  }

  /**
   * Șterge permanent un angajat (hard delete)
   */
  async hardDelete(id: string): Promise<void> {
    const { error } = await this.supabase.from('employees').delete().eq('id', id)

    if (error) {
      throw new Error(`Failed to hard delete employee: ${error.message}`)
    }
  }

  /**
   * Caută angajați după termen
   */
  async search(
    searchTerm: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Employee>> {
    return this.getAll({
      ...params,
      searchTerm,
    })
  }

  /**
   * Obține numărul de angajați activi pentru o organizație
   */
  async getActiveCount(organizationId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('is_active', true)

    if (error) {
      throw new Error(`Failed to count employees: ${error.message}`)
    }

    return count || 0
  }

  /**
   * Obține angajații pe departamente
   */
  async getByDepartment(
    organizationId: string,
    department: string
  ): Promise<Employee[]> {
    const { data, error } = await this.supabase
      .from('employees')
      .select('*, organizations!inner(name, cui)')
      .eq('organization_id', organizationId)
      .eq('department', department)
      .eq('is_active', true)
      .order('full_name', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch employees by department: ${error.message}`)
    }

    return (data as Employee[]) || []
  }

  /**
   * Verifică dacă există deja un angajat cu același CNP în organizație
   */
  async checkDuplicateCNP(
    organizationId: string,
    cnpHash: string,
    excludeId?: string
  ): Promise<boolean> {
    let query = this.supabase
      .from('employees')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('cnp_hash', cnpHash)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { count, error } = await query

    if (error) {
      throw new Error(`Failed to check duplicate CNP: ${error.message}`)
    }

    return (count || 0) > 0
  }
}

// Export instanță singleton pentru folosire în hooks
export const employeeService = new EmployeeService()
