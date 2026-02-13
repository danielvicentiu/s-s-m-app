/**
 * types/shared.ts
 * Common TypeScript types used across the application
 */

// ============================================================================
// INTERNATIONALIZATION
// ============================================================================

/**
 * Supported locales in the application
 */
export type Locale = 'ro' | 'en' | 'bg' | 'hu' | 'de';

/**
 * Supported countries
 */
export type Country = 'RO' | 'BG' | 'HU' | 'DE';

/**
 * Supported currencies
 */
export type Currency = 'RON' | 'EUR' | 'BGN' | 'HUF';

// ============================================================================
// DATE & TIME
// ============================================================================

/**
 * Date range for filtering
 */
export interface DateRange {
  from: Date | null;
  to: Date | null;
}

// ============================================================================
// PAGINATION & SORTING
// ============================================================================

/**
 * Pagination parameters for API requests
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Generic paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Sort order for table columns
 */
export type SortOrder = 'asc' | 'desc';

// ============================================================================
// FILTERING
// ============================================================================

/**
 * Filter operators for query building
 */
export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'in'
  | 'is'
  | 'contains';

// ============================================================================
// API RESPONSES
// ============================================================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

/**
 * API error structure
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp?: string;
}

// ============================================================================
// UI COMPONENTS
// ============================================================================

/**
 * Option for select/dropdown components
 */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  description?: string;
}

/**
 * Table column definition
 */
export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
}
