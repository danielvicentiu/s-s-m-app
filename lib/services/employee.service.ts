// lib/services/employee.service.ts
// Employee Service — CRUD operations for employees table
// Respectă Code Contract: camelCase, TypeScript strict, error handling

import { createSupabaseServer } from '@/lib/supabase/server'
import type {
  Employee,
  EmployeeFilters,
  EmployeeComplianceStatus,
  EmployeeCSVRow,
} from '@/lib/types'

export class EmployeeService {
  /**
   * Get all employees for an organization with optional filters
   * @param orgId - Organization ID
   * @param filters - Optional filters (is_active, nationality, cor_code, search)
   * @returns Array of employees with organization info
   */
  static async getAll(
    orgId: string,
    filters?: EmployeeFilters
  ): Promise<{ data: Employee[] | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      let query = supabase
        .from('employees')
        .select('*, organizations(id, name, cui)')
        .eq('organization_id', orgId)

      // Apply filters
      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }

      if (filters?.nationality) {
        query = query.eq('nationality', filters.nationality)
      }

      if (filters?.cor_code) {
        query = query.eq('cor_code', filters.cor_code)
      }

      if (filters?.search) {
        query = query.or(
          `full_name.ilike.%${filters.search}%,job_title.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        )
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('[EmployeeService.getAll] Error:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (err: any) {
      console.error('[EmployeeService.getAll] Exception:', err)
      return { data: null, error: err.message || 'Unknown error' }
    }
  }

  /**
   * Get employee by ID
   * @param id - Employee ID
   * @returns Single employee with organization info
   */
  static async getById(id: string): Promise<{ data: Employee | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      const { data, error } = await supabase
        .from('employees')
        .select('*, organizations(id, name, cui)')
        .eq('id', id)
        .single()

      if (error) {
        console.error('[EmployeeService.getById] Error:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (err: any) {
      console.error('[EmployeeService.getById] Exception:', err)
      return { data: null, error: err.message || 'Unknown error' }
    }
  }

  /**
   * Create new employee
   * @param data - Employee data (without id, created_at, updated_at)
   * @returns Created employee
   */
  static async create(
    data: Omit<Employee, 'id' | 'created_at' | 'updated_at' | 'organizations'>
  ): Promise<{ data: Employee | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      // Ensure is_active defaults to true
      const employeeData = {
        ...data,
        is_active: data.is_active ?? true,
      }

      const { data: employee, error } = await supabase
        .from('employees')
        .insert([employeeData])
        .select('*, organizations(id, name, cui)')
        .single()

      if (error) {
        console.error('[EmployeeService.create] Error:', error)
        return { data: null, error: error.message }
      }

      return { data: employee, error: null }
    } catch (err: any) {
      console.error('[EmployeeService.create] Exception:', err)
      return { data: null, error: err.message || 'Unknown error' }
    }
  }

  /**
   * Update employee
   * @param id - Employee ID
   * @param data - Partial employee data to update
   * @returns Updated employee
   */
  static async update(
    id: string,
    data: Partial<Omit<Employee, 'id' | 'created_at' | 'updated_at' | 'organizations'>>
  ): Promise<{ data: Employee | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      const { data: employee, error } = await supabase
        .from('employees')
        .update(data)
        .eq('id', id)
        .select('*, organizations(id, name, cui)')
        .single()

      if (error) {
        console.error('[EmployeeService.update] Error:', error)
        return { data: null, error: error.message }
      }

      return { data: employee, error: null }
    } catch (err: any) {
      console.error('[EmployeeService.update] Exception:', err)
      return { data: null, error: err.message || 'Unknown error' }
    }
  }

  /**
   * Soft delete employee (sets is_active = false and termination_date = now)
   * @param id - Employee ID
   * @returns Success status
   */
  static async delete(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      const { error } = await supabase
        .from('employees')
        .update({
          is_active: false,
          termination_date: new Date().toISOString().split('T')[0],
        })
        .eq('id', id)

      if (error) {
        console.error('[EmployeeService.delete] Error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (err: any) {
      console.error('[EmployeeService.delete] Exception:', err)
      return { success: false, error: err.message || 'Unknown error' }
    }
  }

  /**
   * Search employees across all organizations user has access to
   * @param orgId - Organization ID
   * @param query - Search query (searches full_name, job_title, email)
   * @returns Array of matching employees
   */
  static async search(
    orgId: string,
    query: string
  ): Promise<{ data: Employee[] | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      const { data, error } = await supabase
        .from('employees')
        .select('*, organizations(id, name, cui)')
        .eq('organization_id', orgId)
        .eq('is_active', true)
        .or(`full_name.ilike.%${query}%,job_title.ilike.%${query}%,email.ilike.%${query}%`)
        .order('full_name', { ascending: true })
        .limit(50) // Limit search results

      if (error) {
        console.error('[EmployeeService.search] Error:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (err: any) {
      console.error('[EmployeeService.search] Exception:', err)
      return { data: null, error: err.message || 'Unknown error' }
    }
  }

  /**
   * Get employees with compliance status (medical exams, trainings)
   * @param orgId - Organization ID
   * @returns Array of employees with compliance info
   */
  static async getWithCompliance(
    orgId: string
  ): Promise<{ data: EmployeeComplianceStatus[] | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      // Get all active employees
      const { data: employees, error: empError } = await supabase
        .from('employees')
        .select('*, organizations(id, name, cui)')
        .eq('organization_id', orgId)
        .eq('is_active', true)
        .order('full_name', { ascending: true })

      if (empError) {
        console.error('[EmployeeService.getWithCompliance] Employee error:', empError)
        return { data: null, error: empError.message }
      }

      if (!employees || employees.length === 0) {
        return { data: [], error: null }
      }

      // Get medical exams for all employees
      const { data: medicalExams, error: medError } = await supabase
        .from('medical_examinations')
        .select('employee_name, examination_date, expiry_date, result')
        .eq('organization_id', orgId)
        .order('examination_date', { ascending: false })

      if (medError) {
        console.error('[EmployeeService.getWithCompliance] Medical error:', medError)
      }

      // Get trainings count for each employee
      const { data: trainings, error: trainError } = await supabase
        .from('trainings')
        .select('employee_id, training_date')
        .eq('organization_id', orgId)
        .order('training_date', { ascending: false })

      if (trainError) {
        console.error('[EmployeeService.getWithCompliance] Training error:', trainError)
      }

      // Combine data
      const complianceData: EmployeeComplianceStatus[] = employees.map((employee) => {
        // Find latest medical exam for this employee
        const latestMedical = medicalExams?.find(
          (exam) => exam.employee_name.toLowerCase() === employee.full_name.toLowerCase()
        )

        let medicalStatus: 'valid' | 'expiring' | 'expired' | 'missing' = 'missing'
        let medicalExpiryDate: string | null = null

        if (latestMedical) {
          medicalExpiryDate = latestMedical.expiry_date
          const today = new Date()
          const expiryDate = new Date(latestMedical.expiry_date)
          const daysUntilExpiry = Math.ceil(
            (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          )

          if (daysUntilExpiry < 0) {
            medicalStatus = 'expired'
          } else if (daysUntilExpiry <= 30) {
            medicalStatus = 'expiring'
          } else {
            medicalStatus = 'valid'
          }
        }

        // Count trainings for this employee
        const employeeTrainings = trainings?.filter((t) => t.employee_id === employee.id) || []
        const trainingsCount = employeeTrainings.length
        const lastTrainingDate =
          employeeTrainings.length > 0 ? employeeTrainings[0].training_date : null

        return {
          employee,
          medical_status: medicalStatus,
          medical_expiry_date: medicalExpiryDate,
          trainings_count: trainingsCount,
          last_training_date: lastTrainingDate,
        }
      })

      return { data: complianceData, error: null }
    } catch (err: any) {
      console.error('[EmployeeService.getWithCompliance] Exception:', err)
      return { data: null, error: err.message || 'Unknown error' }
    }
  }

  /**
   * Import employees from CSV data
   * @param orgId - Organization ID
   * @param rows - Array of CSV row objects
   * @returns Success count and errors
   */
  static async importCSV(
    orgId: string,
    rows: EmployeeCSVRow[]
  ): Promise<{
    success: boolean
    imported: number
    failed: number
    errors: string[]
  }> {
    try {
      const supabase = await createSupabaseServer()

      let imported = 0
      let failed = 0
      const errors: string[] = []

      for (const row of rows) {
        try {
          // Validate required fields
          if (!row.full_name || row.full_name.trim() === '') {
            errors.push(`Row skipped: Missing full_name`)
            failed++
            continue
          }

          // Prepare employee data
          const employeeData: Omit<
            Employee,
            'id' | 'created_at' | 'updated_at' | 'organizations'
          > = {
            organization_id: orgId,
            user_id: null,
            full_name: row.full_name.trim(),
            cor_code: row.cor_code?.trim() || null,
            job_title: row.job_title?.trim() || null,
            nationality: row.nationality?.trim() || 'RO',
            email: row.email?.trim() || null,
            phone: row.phone?.trim() || null,
            hire_date: row.hire_date || null,
            termination_date: null,
            is_active: true,
          }

          const { error } = await supabase.from('employees').insert([employeeData])

          if (error) {
            errors.push(`${row.full_name}: ${error.message}`)
            failed++
          } else {
            imported++
          }
        } catch (err: any) {
          errors.push(`${row.full_name}: ${err.message || 'Unknown error'}`)
          failed++
        }
      }

      return {
        success: imported > 0,
        imported,
        failed,
        errors,
      }
    } catch (err: any) {
      console.error('[EmployeeService.importCSV] Exception:', err)
      return {
        success: false,
        imported: 0,
        failed: rows.length,
        errors: [err.message || 'Unknown error'],
      }
    }
  }

  /**
   * Hard delete employee (permanent delete - use with caution)
   * @param id - Employee ID
   * @returns Success status
   */
  static async hardDelete(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      const { error } = await supabase.from('employees').delete().eq('id', id)

      if (error) {
        console.error('[EmployeeService.hardDelete] Error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (err: any) {
      console.error('[EmployeeService.hardDelete] Exception:', err)
      return { success: false, error: err.message || 'Unknown error' }
    }
  }

  /**
   * Get employee count by organization
   * @param orgId - Organization ID
   * @returns Count of active employees
   */
  static async getCount(
    orgId: string
  ): Promise<{ count: number | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      const { count, error } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId)
        .eq('is_active', true)

      if (error) {
        console.error('[EmployeeService.getCount] Error:', error)
        return { count: null, error: error.message }
      }

      return { count, error: null }
    } catch (err: any) {
      console.error('[EmployeeService.getCount] Exception:', err)
      return { count: null, error: err.message || 'Unknown error' }
    }
  }

  /**
   * Reactivate a terminated employee
   * @param id - Employee ID
   * @returns Updated employee
   */
  static async reactivate(id: string): Promise<{ data: Employee | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      const { data: employee, error } = await supabase
        .from('employees')
        .update({
          is_active: true,
          termination_date: null,
        })
        .eq('id', id)
        .select('*, organizations(id, name, cui)')
        .single()

      if (error) {
        console.error('[EmployeeService.reactivate] Error:', error)
        return { data: null, error: error.message }
      }

      return { data: employee, error: null }
    } catch (err: any) {
      console.error('[EmployeeService.reactivate] Exception:', err)
      return { data: null, error: err.message || 'Unknown error' }
    }
  }
}
