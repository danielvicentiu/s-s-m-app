/**
 * SSM Platform JavaScript SDK Client
 * External API client for programmatic access to SSM/PSI compliance platform
 */

// ============================================================================
// Types
// ============================================================================

export interface SSMClientConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface SSMError {
  error: string;
  message: string;
  statusCode: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Organization types
export interface Organization {
  id: string;
  name: string;
  cui: string;
  country: 'RO' | 'BG' | 'HU' | 'DE';
  created_at: string;
  updated_at: string;
}

export interface CreateOrganizationParams {
  name: string;
  cui: string;
  country: 'RO' | 'BG' | 'HU' | 'DE';
  address?: string;
  phone?: string;
  email?: string;
}

// Employee types
export interface Employee {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  hire_date?: string;
  status: 'active' | 'inactive' | 'on_leave';
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeParams {
  organization_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  hire_date?: string;
}

export interface UpdateEmployeeParams {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  hire_date?: string;
  status?: 'active' | 'inactive' | 'on_leave';
}

// Training types
export interface Training {
  id: string;
  organization_id: string;
  employee_id: string;
  training_type: 'ssm' | 'psi' | 'periodic' | 'specific';
  completed_at: string;
  expires_at?: string;
  instructor?: string;
  duration_hours?: number;
  created_at: string;
}

export interface CreateTrainingParams {
  organization_id: string;
  employee_id: string;
  training_type: 'ssm' | 'psi' | 'periodic' | 'specific';
  completed_at: string;
  expires_at?: string;
  instructor?: string;
  duration_hours?: number;
}

export interface TrainingListParams extends PaginationParams {
  organization_id: string;
  employee_id?: string;
  training_type?: string;
}

// Compliance types
export interface ComplianceScore {
  organization_id: string;
  overall_score: number;
  scores: {
    trainings: number;
    medical_records: number;
    equipment: number;
    documents: number;
  };
  issues: {
    expired_trainings: number;
    expired_medical: number;
    missing_equipment: number;
    missing_documents: number;
  };
  calculated_at: string;
}

// ============================================================================
// SSM Client
// ============================================================================

export class SSMClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: SSMClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://app.s-s-m.ro/api/v1';
  }

  /**
   * Make HTTP request to API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        const error: SSMError = {
          error: data.error || 'API Error',
          message: data.message || 'An error occurred',
          statusCode: response.status,
        };
        throw error;
      }

      return data;
    } catch (error) {
      // If it's already an SSMError, rethrow it
      if (error && typeof error === 'object' && 'statusCode' in error) {
        throw error;
      }

      // Otherwise, wrap it in an SSMError
      throw {
        error: 'Network Error',
        message: error instanceof Error ? error.message : 'Failed to connect to API',
        statusCode: 0,
      } as SSMError;
    }
  }

  // ==========================================================================
  // Organizations
  // ==========================================================================

  public organizations = {
    /**
     * List all organizations
     */
    list: async (params?: PaginationParams): Promise<PaginatedResponse<Organization>> => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const query = queryParams.toString();
      const endpoint = `/organizations${query ? `?${query}` : ''}`;

      return this.request<PaginatedResponse<Organization>>(endpoint);
    },

    /**
     * Get organization by ID
     */
    get: async (id: string): Promise<Organization> => {
      return this.request<Organization>(`/organizations/${id}`);
    },

    /**
     * Create new organization
     */
    create: async (params: CreateOrganizationParams): Promise<Organization> => {
      return this.request<Organization>('/organizations', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    },
  };

  // ==========================================================================
  // Employees
  // ==========================================================================

  public employees = {
    /**
     * List employees for an organization
     */
    list: async (organizationId: string, params?: PaginationParams): Promise<PaginatedResponse<Employee>> => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const query = queryParams.toString();
      const endpoint = `/organizations/${organizationId}/employees${query ? `?${query}` : ''}`;

      return this.request<PaginatedResponse<Employee>>(endpoint);
    },

    /**
     * Get employee by ID
     */
    get: async (organizationId: string, employeeId: string): Promise<Employee> => {
      return this.request<Employee>(`/organizations/${organizationId}/employees/${employeeId}`);
    },

    /**
     * Create new employee
     */
    create: async (params: CreateEmployeeParams): Promise<Employee> => {
      const { organization_id, ...body } = params;
      return this.request<Employee>(`/organizations/${organization_id}/employees`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
    },

    /**
     * Update employee
     */
    update: async (
      organizationId: string,
      employeeId: string,
      params: UpdateEmployeeParams
    ): Promise<Employee> => {
      return this.request<Employee>(
        `/organizations/${organizationId}/employees/${employeeId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(params),
        }
      );
    },

    /**
     * Delete employee (soft delete)
     */
    delete: async (organizationId: string, employeeId: string): Promise<{ success: boolean }> => {
      return this.request<{ success: boolean }>(
        `/organizations/${organizationId}/employees/${employeeId}`,
        {
          method: 'DELETE',
        }
      );
    },
  };

  // ==========================================================================
  // Trainings
  // ==========================================================================

  public trainings = {
    /**
     * List trainings
     */
    list: async (params: TrainingListParams): Promise<PaginatedResponse<Training>> => {
      const { organization_id, employee_id, training_type, page, limit } = params;
      const queryParams = new URLSearchParams();

      if (employee_id) queryParams.append('employee_id', employee_id);
      if (training_type) queryParams.append('training_type', training_type);
      if (page) queryParams.append('page', page.toString());
      if (limit) queryParams.append('limit', limit.toString());

      const query = queryParams.toString();
      const endpoint = `/organizations/${organization_id}/trainings${query ? `?${query}` : ''}`;

      return this.request<PaginatedResponse<Training>>(endpoint);
    },

    /**
     * Create new training record
     */
    create: async (params: CreateTrainingParams): Promise<Training> => {
      const { organization_id, ...body } = params;
      return this.request<Training>(`/organizations/${organization_id}/trainings`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
    },
  };

  // ==========================================================================
  // Compliance
  // ==========================================================================

  public compliance = {
    /**
     * Get compliance score for organization
     */
    getScore: async (organizationId: string): Promise<ComplianceScore> => {
      return this.request<ComplianceScore>(`/organizations/${organizationId}/compliance/score`);
    },
  };
}

// ============================================================================
// Export
// ============================================================================

export default SSMClient;
