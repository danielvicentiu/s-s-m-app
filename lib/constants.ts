/**
 * Application-wide constants
 * Centralized configuration for SSM/PSI compliance platform
 */

// ============================================================================
// COMPLIANCE & ALERTS
// ============================================================================

/**
 * Compliance thresholds for various checks
 */
export const COMPLIANCE_THRESHOLDS = {
  /** Medical exam validity period in months */
  MEDICAL_EXAM_VALIDITY_MONTHS: 12,
  /** PSI (fire safety) training validity in months */
  PSI_TRAINING_VALIDITY_MONTHS: 12,
  /** SSM (work safety) training validity in months */
  SSM_TRAINING_VALIDITY_MONTHS: 24,
  /** Equipment inspection validity in months */
  EQUIPMENT_INSPECTION_VALIDITY_MONTHS: 12,
  /** First aid kit inspection in months */
  FIRST_AID_KIT_VALIDITY_MONTHS: 6,
  /** Fire extinguisher validity in months */
  FIRE_EXTINGUISHER_VALIDITY_MONTHS: 12,
  /** Minimum attendance percentage for training completion */
  MIN_ATTENDANCE_PERCENTAGE: 80,
} as const;

/**
 * Alert notification days before expiration
 */
export const ALERT_DAYS = {
  /** Critical alert - expiring today */
  CRITICAL: 0,
  /** Warning alert - expiring in 7 days */
  WARNING: 7,
  /** Info alert - expiring in 30 days */
  INFO: 30,
} as const;

/**
 * Alert severity levels
 */
export const ALERT_SEVERITY = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// ============================================================================
// MODULES & FEATURES
// ============================================================================

/**
 * Application module names
 */
export const MODULE_NAMES = {
  DASHBOARD: 'dashboard',
  MEDICAL: 'medical',
  TRAININGS: 'trainings',
  EQUIPMENT: 'equipment',
  DOCUMENTS: 'documents',
  EMPLOYEES: 'employees',
  TEAM: 'team',
  ALERTS: 'alerts',
  PROFILE: 'profile',
  ADMIN: 'admin',
  QUICK_CHECK: 'quick-check',
  ONBOARDING: 'onboarding',
} as const;

// ============================================================================
// ROLES & PERMISSIONS
// ============================================================================

/**
 * Legacy role names (pre-RBAC migration)
 * @deprecated Use RBAC roles from database instead
 */
export const LEGACY_ROLE_NAMES = {
  CONSULTANT: 'consultant',
  FIRMA_ADMIN: 'firma_admin',
  ANGAJAT: 'angajat',
} as const;

/**
 * Role display names (Romanian)
 */
export const ROLE_DISPLAY_NAMES = {
  consultant: 'Consultant SSM',
  firma_admin: 'Administrator firmă',
  angajat: 'Angajat',
  super_admin: 'Super Administrator',
  viewer: 'Vizualizator',
} as const;

// ============================================================================
// LOCALIZATION
// ============================================================================

/**
 * Supported application locales
 */
export const SUPPORTED_LOCALES = {
  RO: 'ro',
  EN: 'en',
  BG: 'bg',
  HU: 'hu',
  DE: 'de',
} as const;

/**
 * Default locale
 */
export const DEFAULT_LOCALE = SUPPORTED_LOCALES.RO;

/**
 * Locale display names
 */
export const LOCALE_NAMES = {
  [SUPPORTED_LOCALES.RO]: 'Română',
  [SUPPORTED_LOCALES.EN]: 'English',
  [SUPPORTED_LOCALES.BG]: 'Български',
  [SUPPORTED_LOCALES.HU]: 'Magyar',
  [SUPPORTED_LOCALES.DE]: 'Deutsch',
} as const;

/**
 * Date format patterns per locale
 */
export const DATE_FORMATS = {
  [SUPPORTED_LOCALES.RO]: {
    short: 'dd.MM.yyyy',
    medium: 'dd MMM yyyy',
    long: 'dd MMMM yyyy',
    full: 'EEEE, dd MMMM yyyy',
    time: 'HH:mm',
    datetime: 'dd.MM.yyyy HH:mm',
  },
  [SUPPORTED_LOCALES.EN]: {
    short: 'MM/dd/yyyy',
    medium: 'MMM dd, yyyy',
    long: 'MMMM dd, yyyy',
    full: 'EEEE, MMMM dd, yyyy',
    time: 'h:mm a',
    datetime: 'MM/dd/yyyy h:mm a',
  },
  [SUPPORTED_LOCALES.BG]: {
    short: 'dd.MM.yyyy',
    medium: 'dd MMM yyyy',
    long: 'dd MMMM yyyy',
    full: 'EEEE, dd MMMM yyyy',
    time: 'HH:mm',
    datetime: 'dd.MM.yyyy HH:mm',
  },
  [SUPPORTED_LOCALES.HU]: {
    short: 'yyyy.MM.dd.',
    medium: 'yyyy MMM dd.',
    long: 'yyyy MMMM dd.',
    full: 'yyyy MMMM dd., EEEE',
    time: 'HH:mm',
    datetime: 'yyyy.MM.dd. HH:mm',
  },
  [SUPPORTED_LOCALES.DE]: {
    short: 'dd.MM.yyyy',
    medium: 'dd. MMM yyyy',
    long: 'dd. MMMM yyyy',
    full: 'EEEE, dd. MMMM yyyy',
    time: 'HH:mm',
    datetime: 'dd.MM.yyyy HH:mm',
  },
} as const;

// ============================================================================
// FILE UPLOADS
// ============================================================================

/**
 * Maximum file size in bytes (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Maximum file size display name
 */
export const MAX_FILE_SIZE_MB = 10;

/**
 * Allowed file MIME types for uploads
 */
export const ALLOWED_FILE_TYPES = {
  // Documents
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS: 'application/vnd.ms-excel',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

  // Images
  JPEG: 'image/jpeg',
  JPG: 'image/jpg',
  PNG: 'image/png',
  WEBP: 'image/webp',

  // Other
  TXT: 'text/plain',
  CSV: 'text/csv',
} as const;

/**
 * Allowed file extensions
 */
export const ALLOWED_FILE_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.txt',
  '.csv',
] as const;

/**
 * File type categories
 */
export const FILE_TYPE_CATEGORIES = {
  DOCUMENTS: [
    ALLOWED_FILE_TYPES.PDF,
    ALLOWED_FILE_TYPES.DOC,
    ALLOWED_FILE_TYPES.DOCX,
    ALLOWED_FILE_TYPES.XLS,
    ALLOWED_FILE_TYPES.XLSX,
  ],
  IMAGES: [
    ALLOWED_FILE_TYPES.JPEG,
    ALLOWED_FILE_TYPES.JPG,
    ALLOWED_FILE_TYPES.PNG,
    ALLOWED_FILE_TYPES.WEBP,
  ],
  TEXT: [
    ALLOWED_FILE_TYPES.TXT,
    ALLOWED_FILE_TYPES.CSV,
  ],
} as const;

// ============================================================================
// PAGINATION
// ============================================================================

/**
 * Default pagination settings
 */
export const PAGINATION = {
  /** Default items per page */
  DEFAULT_PAGE_SIZE: 10,
  /** Available page size options */
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100] as const,
  /** Maximum items per page */
  MAX_PAGE_SIZE: 100,
  /** Default page number */
  DEFAULT_PAGE: 1,
} as const;

// ============================================================================
// UI & DISPLAY
// ============================================================================

/**
 * Status badge colors
 */
export const STATUS_COLORS = {
  active: 'green',
  inactive: 'gray',
  expired: 'red',
  pending: 'yellow',
  completed: 'blue',
  cancelled: 'red',
  valid: 'green',
  invalid: 'red',
} as const;

/**
 * Priority levels
 */
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

/**
 * Toast notification duration in milliseconds
 */
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 4000,
  LONG: 6000,
} as const;

// ============================================================================
// API & NETWORK
// ============================================================================

/**
 * API request timeout in milliseconds
 */
export const API_TIMEOUT = 30000; // 30 seconds

/**
 * Retry configuration
 */
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  BACKOFF_MULTIPLIER: 2,
} as const;

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Password validation rules
 */
export const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL_CHAR: false,
} as const;

/**
 * Email validation pattern
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone number validation pattern (Romanian format)
 */
export const PHONE_PATTERN = /^(\+40|0)[0-9]{9}$/;

// ============================================================================
// BUSINESS RULES
// ============================================================================

/**
 * Employee CNP (Personal Identification Number) validation
 */
export const CNP_LENGTH = 13;

/**
 * Organization CUI (Unique Registration Code) validation
 */
export const CUI_PATTERN = /^[0-9]{2,10}$/;

/**
 * Default organization settings
 */
export const DEFAULT_ORG_SETTINGS = {
  ENABLE_NOTIFICATIONS: true,
  NOTIFICATION_DAYS_BEFORE: ALERT_DAYS.WARNING,
  AUTO_ARCHIVE_EXPIRED: false,
  REQUIRE_DOCUMENT_APPROVAL: false,
} as const;

// ============================================================================
// CACHE & PERFORMANCE
// ============================================================================

/**
 * Cache durations in seconds
 */
export const CACHE_DURATION = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const;

/**
 * Debounce delays in milliseconds
 */
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 150,
} as const;

// ============================================================================
// ROUTES
// ============================================================================

/**
 * Protected route paths
 */
export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  MEDICAL: '/dashboard/medical',
  TRAININGS: '/dashboard/trainings',
  EQUIPMENT: '/dashboard/equipment',
  DOCUMENTS: '/dashboard/documents',
  EMPLOYEES: '/dashboard/employees',
  TEAM: '/dashboard/team',
  ALERTS: '/dashboard/alerts',
  PROFILE: '/dashboard/profile',
  ADMIN: '/admin',
  QUICK_CHECK: '/quick-check',
} as const;

/**
 * Public route paths
 */
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  PRIVACY: '/privacy',
  TERMS: '/terms',
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Locale = typeof SUPPORTED_LOCALES[keyof typeof SUPPORTED_LOCALES];
export type ModuleName = typeof MODULE_NAMES[keyof typeof MODULE_NAMES];
export type LegacyRole = typeof LEGACY_ROLE_NAMES[keyof typeof LEGACY_ROLE_NAMES];
export type AlertSeverity = typeof ALERT_SEVERITY[keyof typeof ALERT_SEVERITY];
export type PriorityLevel = typeof PRIORITY_LEVELS[keyof typeof PRIORITY_LEVELS];
export type StatusColor = keyof typeof STATUS_COLORS;
