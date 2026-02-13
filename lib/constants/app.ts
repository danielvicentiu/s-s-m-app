/**
 * Application-wide constants
 * Centralized configuration for the SSM/PSI platform
 */

// Application identity
export const APP_NAME = 's-s-m.ro';
export const APP_URL = 'https://app.s-s-m.ro';
export const SUPPORT_EMAIL = 'support@s-s-m.ro';

// Internationalization
export const SUPPORTED_LOCALES = ['ro', 'en', 'bg', 'hu', 'de'] as const;
export const DEFAULT_LOCALE = 'ro' as const;

export type Locale = typeof SUPPORTED_LOCALES[number];

// Geographic coverage
export const SUPPORTED_COUNTRIES = [
  { code: 'RO', name: 'România', locale: 'ro' },
  { code: 'BG', name: 'Bulgaria', locale: 'bg' },
  { code: 'HU', name: 'Ungaria', locale: 'hu' },
  { code: 'DE', name: 'Germania', locale: 'de' },
] as const;

// Pagination
export const ITEMS_PER_PAGE = 20;

// File upload limits
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ALLOWED_FILE_TYPES = [
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;

export const ALLOWED_FILE_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
] as const;

// API routes
export const API_ROUTES = {
  auth: {
    signIn: '/api/auth/signin',
    signUp: '/api/auth/signup',
    signOut: '/api/auth/signout',
    resetPassword: '/api/auth/reset-password',
  },
  organizations: {
    list: '/api/organizations',
    create: '/api/organizations',
    byId: (id: string) => `/api/organizations/${id}`,
    members: (id: string) => `/api/organizations/${id}/members`,
  },
  employees: {
    list: '/api/employees',
    create: '/api/employees',
    byId: (id: string) => `/api/employees/${id}`,
  },
  trainings: {
    list: '/api/trainings',
    create: '/api/trainings',
    byId: (id: string) => `/api/trainings/${id}`,
  },
  medical: {
    list: '/api/medical',
    create: '/api/medical',
    byId: (id: string) => `/api/medical/${id}`,
  },
  equipment: {
    list: '/api/equipment',
    create: '/api/equipment',
    byId: (id: string) => `/api/equipment/${id}`,
  },
  documents: {
    list: '/api/documents',
    upload: '/api/documents/upload',
    byId: (id: string) => `/api/documents/${id}`,
  },
  alerts: {
    list: '/api/alerts',
    markAsRead: (id: string) => `/api/alerts/${id}/read`,
  },
} as const;

// Dashboard routes
export const DASHBOARD_ROUTES = {
  home: '/dashboard',
  profile: '/dashboard/profile',
  organizations: '/dashboard/organizations',
  employees: '/dashboard/employees',
  trainings: '/dashboard/trainings',
  medical: '/dashboard/medical',
  equipment: '/dashboard/equipment',
  documents: '/dashboard/documents',
  alerts: '/dashboard/alerts',
  legislation: '/dashboard/legislation',
  admin: {
    home: '/admin',
    users: '/admin/users',
    organizations: '/admin/organizations',
    roles: '/admin/roles',
    permissions: '/admin/permissions',
    audit: '/admin/audit',
  },
} as const;

// Date formats
export const DATE_FORMAT = 'dd.MM.yyyy';
export const DATE_TIME_FORMAT = 'dd.MM.yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Alert thresholds (days before expiration)
export const ALERT_THRESHOLDS = {
  critical: 7, // red alert
  warning: 30, // yellow alert
  info: 60, // blue alert
} as const;

// Session/cache durations (in seconds)
export const CACHE_DURATION = {
  short: 60, // 1 minute
  medium: 300, // 5 minutes
  long: 3600, // 1 hour
  day: 86400, // 24 hours
} as const;
