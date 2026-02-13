/**
 * Generic API Response wrapper
 * Used for standardizing all API responses across the platform
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated API Response
 * Used for endpoints that return paginated data
 */
export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Detailed API Error structure
 * Provides structured error information for better error handling
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

/**
 * Query filters for list/search endpoints
 * Standardizes filtering, sorting, and pagination parameters
 */
export interface QueryFilters {
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}
