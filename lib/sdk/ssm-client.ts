/**
 * s-s-m.ro JavaScript/TypeScript SDK
 *
 * Official SDK for interacting with the s-s-m.ro REST API
 * Provides type-safe methods for managing organizations, employees, trainings, and compliance data.
 *
 * @example
 * ```typescript
 * import { SSMClient } from '@/lib/sdk/ssm-client'
 *
 * const client = new SSMClient({
 *   apiKey: 'your-api-key',
 *   baseUrl: 'https://app.s-s-m.ro'
 * })
 *
 * // List organizations
 * const orgs = await client.organizations.list({ page: 1, limit: 20 })
 *
 * // Create employee
 * const employee = await client.employees.create({
 *   organization_id: 'org-uuid',
 *   full_name: 'John Doe',
 *   email: 'john@example.com'
 * })
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

export interface SSMClientConfig {
  /** API key obtained from s-s-m.ro dashboard */
  apiKey: string
  /** Base URL for the API (default: https://app.s-s-m.ro) */
  baseUrl?: string
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number
}

export interface ApiError {
  error: string
  message: string
  code: string
  details?: any
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

// Organization types
export type CooperationStatus = 'active' | 'warning' | 'uncooperative'
export type ExposureScore = 'necalculat' | 'scazut' | 'mediu' | 'ridicat' | 'critic'
export type PreferredChannel = 'email' | 'whatsapp' | 'sms' | 'push'

export interface Organization {
  id: string
  name: string
  cui?: string | null
  address?: string | null
  county?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  preferred_channels?: PreferredChannel[]
  cooperation_status?: CooperationStatus
  exposure_score?: ExposureScore
  data_completeness?: number
  created_at: string
  updated_at: string
}

export interface CreateOrganizationInput {
  name: string
  cui?: string | null
  address?: string | null
  county?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  preferred_channels?: PreferredChannel[]
  cooperation_status?: CooperationStatus
  exposure_score?: ExposureScore
}

export interface UpdateOrganizationInput {
  name?: string
  cui?: string | null
  address?: string | null
  county?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  preferred_channels?: PreferredChannel[]
  cooperation_status?: CooperationStatus
  exposure_score?: ExposureScore
}

export interface ListOrganizationsParams {
  page?: number
  limit?: number
  sort_by?: 'name' | 'created_at' | 'updated_at' | 'cooperation_status' | 'exposure_score'
  sort_order?: 'asc' | 'desc'
  cooperation_status?: CooperationStatus
  exposure_score?: ExposureScore
  county?: string
  search?: string
}

// Employee types
export interface Employee {
  id: string
  organization_id: string
  full_name: string
  cnp?: string | null
  email?: string | null
  phone?: string | null
  job_title?: string | null
  cor_code?: string | null
  nationality?: string
  hire_date?: string | null
  termination_date?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateEmployeeInput {
  organization_id: string
  full_name: string
  cnp?: string | null
  email?: string | null
  phone?: string | null
  job_title?: string | null
  cor_code?: string | null
  nationality?: string
  hire_date?: string | null
  is_active?: boolean
}

export interface UpdateEmployeeInput {
  full_name?: string
  cnp?: string | null
  email?: string | null
  phone?: string | null
  job_title?: string | null
  cor_code?: string | null
  nationality?: string
  hire_date?: string | null
  termination_date?: string | null
  is_active?: boolean
}

export interface ListEmployeesParams {
  page?: number
  limit?: number
  sort_by?: 'full_name' | 'hire_date' | 'created_at' | 'job_title' | 'nationality'
  sort_order?: 'asc' | 'desc'
  organization_id?: string
  is_active?: boolean
  nationality?: string
  search?: string
}

// Training types
export type TrainingStatus = 'assigned' | 'in_progress' | 'completed' | 'overdue' | 'expired' | 'exempted'
export type TrainingCategory = 'ssm' | 'psi' | 'su' | 'nis2' | 'custom'

export interface TrainingAssignment {
  id: string
  organization_id: string
  worker_id: string
  module_id: string
  assigned_by: string
  assigned_at: string
  due_date?: string | null
  completed_at?: string | null
  status: TrainingStatus
  notes?: string | null
}

export interface CreateTrainingAssignmentsInput {
  organization_id: string
  module_id: string
  worker_ids: string[]
  assigned_by: string
  due_date?: string | null
  notes?: string | null
}

export interface ListTrainingsParams {
  organization_id: string
  page?: number
  limit?: number
  sort_by?: 'assigned_at' | 'due_date' | 'completed_at' | 'created_at' | 'status'
  worker_id?: string
  status?: TrainingStatus
  category?: TrainingCategory
}

// Compliance types
export interface ComplianceScore {
  organization_id: string
  compliance_score: number
  last_updated: string
}

// ============================================================================
// SDK CLIENT
// ============================================================================

export class SSMClient {
  private apiKey: string
  private baseUrl: string
  private timeout: number

  public organizations: OrganizationsResource
  public employees: EmployeesResource
  public trainings: TrainingsResource
  public compliance: ComplianceResource

  constructor(config: SSMClientConfig) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl || 'https://app.s-s-m.ro'
    this.timeout = config.timeout || 30000

    // Initialize resource endpoints
    this.organizations = new OrganizationsResource(this)
    this.employees = new EmployeesResource(this)
    this.trainings = new TrainingsResource(this)
    this.compliance = new ComplianceResource(this)
  }

  /**
   * Internal method to make HTTP requests
   */
  async request<T>(
    method: string,
    path: string,
    options?: {
      body?: any
      params?: Record<string, any>
    }
  ): Promise<T> {
    // Build URL with query parameters
    const url = new URL(`${this.baseUrl}${path}`)
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    // Build request options
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(this.timeout),
    }

    if (options?.body) {
      requestOptions.body = JSON.stringify(options.body)
    }

    try {
      const response = await fetch(url.toString(), requestOptions)

      // Parse response
      const data = await response.json()

      // Handle error responses
      if (!response.ok) {
        throw new SSMAPIError(
          data.message || data.error || 'Unknown error',
          response.status,
          data.code,
          data.details
        )
      }

      return data as T
    } catch (error) {
      // Handle network errors
      if (error instanceof SSMAPIError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === 'TimeoutError' || error.name === 'AbortError') {
          throw new SSMAPIError(
            'Request timeout exceeded',
            408,
            'TIMEOUT_ERROR'
          )
        }

        throw new SSMAPIError(
          `Network error: ${error.message}`,
          0,
          'NETWORK_ERROR'
        )
      }

      throw new SSMAPIError(
        'Unknown error occurred',
        0,
        'UNKNOWN_ERROR'
      )
    }
  }
}

// ============================================================================
// RESOURCE CLASSES
// ============================================================================

class OrganizationsResource {
  constructor(private client: SSMClient) {}

  /**
   * List organizations with pagination and filters
   */
  async list(params?: ListOrganizationsParams): Promise<PaginatedResponse<Organization>> {
    return this.client.request<PaginatedResponse<Organization>>(
      'GET',
      '/api/v1/organizations',
      { params }
    )
  }

  /**
   * Get organization by ID
   */
  async get(id: string): Promise<{ data: Organization }> {
    return this.client.request<{ data: Organization }>(
      'GET',
      `/api/v1/organizations/${id}`
    )
  }

  /**
   * Create a new organization
   */
  async create(input: CreateOrganizationInput): Promise<Organization> {
    return this.client.request<Organization>(
      'POST',
      '/api/v1/organizations',
      { body: input }
    )
  }

  /**
   * Update organization by ID
   */
  async update(id: string, input: UpdateOrganizationInput): Promise<{ data: Organization; message: string }> {
    return this.client.request<{ data: Organization; message: string }>(
      'PATCH',
      `/api/v1/organizations/${id}`,
      { body: input }
    )
  }

  /**
   * Delete organization (soft delete)
   */
  async delete(id: string): Promise<{ message: string; id: string; name: string }> {
    return this.client.request<{ message: string; id: string; name: string }>(
      'DELETE',
      `/api/v1/organizations/${id}`
    )
  }
}

class EmployeesResource {
  constructor(private client: SSMClient) {}

  /**
   * List employees with pagination and filters
   */
  async list(params?: ListEmployeesParams): Promise<PaginatedResponse<Employee>> {
    return this.client.request<PaginatedResponse<Employee>>(
      'GET',
      '/api/v1/employees',
      { params }
    )
  }

  /**
   * Get employee by ID
   */
  async get(id: string, options?: { include?: 'medical' | 'trainings' | 'all' }): Promise<Employee> {
    return this.client.request<Employee>(
      'GET',
      `/api/v1/employees/${id}`,
      { params: options }
    )
  }

  /**
   * Create a new employee
   */
  async create(input: CreateEmployeeInput): Promise<Employee> {
    return this.client.request<Employee>(
      'POST',
      '/api/v1/employees',
      { body: input }
    )
  }

  /**
   * Update employee by ID
   */
  async update(id: string, input: UpdateEmployeeInput): Promise<Employee> {
    return this.client.request<Employee>(
      'PATCH',
      `/api/v1/employees/${id}`,
      { body: input }
    )
  }

  /**
   * Delete employee (soft delete by default, or hard delete with flag)
   */
  async delete(id: string, options?: { hard_delete?: boolean }): Promise<{ message: string; deleted_at?: string; deleted_permanently?: boolean }> {
    return this.client.request<{ message: string; deleted_at?: string; deleted_permanently?: boolean }>(
      'DELETE',
      `/api/v1/employees/${id}`,
      { params: options }
    )
  }
}

class TrainingsResource {
  constructor(private client: SSMClient) {}

  /**
   * List training assignments with pagination and filters
   */
  async list(params: ListTrainingsParams): Promise<PaginatedResponse<TrainingAssignment>> {
    return this.client.request<PaginatedResponse<TrainingAssignment>>(
      'GET',
      '/api/v1/trainings',
      { params }
    )
  }

  /**
   * Create training assignments for multiple workers
   */
  async create(input: CreateTrainingAssignmentsInput): Promise<{
    message: string
    data: TrainingAssignment[]
    count: number
    skipped: number
  }> {
    return this.client.request<{
      message: string
      data: TrainingAssignment[]
      count: number
      skipped: number
    }>(
      'POST',
      '/api/v1/trainings',
      { body: input }
    )
  }
}

class ComplianceResource {
  constructor(private client: SSMClient) {}

  /**
   * Get compliance score for an organization
   */
  async getScore(organizationId: string): Promise<ComplianceScore> {
    return this.client.request<ComplianceScore>(
      'GET',
      '/api/v1/compliance',
      { params: { organization_id: organizationId } }
    )
  }
}

// ============================================================================
// ERROR CLASS
// ============================================================================

export class SSMAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'SSMAPIError'
    Object.setPrototypeOf(this, SSMAPIError.prototype)
  }

  /**
   * Check if error is a specific type
   */
  isType(errorCode: string): boolean {
    return this.code === errorCode
  }

  /**
   * Check if error is authentication related
   */
  isAuthError(): boolean {
    return this.statusCode === 401 || this.code === 'AUTH_REQUIRED'
  }

  /**
   * Check if error is permission related
   */
  isPermissionError(): boolean {
    return this.statusCode === 403 || this.code === 'INSUFFICIENT_PERMISSIONS' || this.code === 'ACCESS_DENIED'
  }

  /**
   * Check if error is validation related
   */
  isValidationError(): boolean {
    return this.statusCode === 400 || this.code === 'VALIDATION_ERROR'
  }

  /**
   * Check if error is not found
   */
  isNotFoundError(): boolean {
    return this.statusCode === 404 || this.code === 'NOT_FOUND'
  }

  /**
   * Check if error is conflict (duplicate)
   */
  isConflictError(): boolean {
    return this.statusCode === 409 || this.code?.includes('DUPLICATE')
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default SSMClient
