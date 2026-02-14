/**
 * Global constants for s-s-m.ro platform
 * Centralized configuration for app-wide settings
 */

// ============================================================================
// APPLICATION
// ============================================================================

export const APP_NAME = 's-s-m.ro';
export const APP_URL = 'https://app.s-s-m.ro';
export const SUPPORT_EMAIL = 'suport@s-s-m.ro';

// ============================================================================
// LOCALIZATION
// ============================================================================

export const DEFAULT_LOCALE = 'ro';

export const SUPPORTED_LOCALES = ['ro', 'bg', 'en', 'hu', 'de'] as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  ro: 'Română',
  bg: 'Български',
  en: 'English',
  hu: 'Magyar',
  de: 'Deutsch',
};

// ============================================================================
// CURRENCY
// ============================================================================

export const DEFAULT_CURRENCY_BY_COUNTRY: Record<string, string> = {
  RO: 'RON', // România
  BG: 'BGN', // Bulgaria
  HU: 'HUF', // Ungaria
  DE: 'EUR', // Germania
  default: 'EUR',
};

// ============================================================================
// PAGINATION
// ============================================================================

export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  PAGE_SIZES: [10, 25, 50, 100] as const,
  MAX_PAGE_SIZE: 100,
};

// ============================================================================
// DATE & TIME FORMATS
// ============================================================================

export const DATE_FORMATS: Record<SupportedLocale, string> = {
  ro: 'dd.MM.yyyy',
  bg: 'dd.MM.yyyy',
  en: 'MM/dd/yyyy',
  hu: 'yyyy.MM.dd',
  de: 'dd.MM.yyyy',
};

export const DATETIME_FORMATS: Record<SupportedLocale, string> = {
  ro: 'dd.MM.yyyy HH:mm',
  bg: 'dd.MM.yyyy HH:mm',
  en: 'MM/dd/yyyy hh:mm a',
  hu: 'yyyy.MM.dd HH:mm',
  de: 'dd.MM.yyyy HH:mm',
};

export const TIME_FORMATS: Record<SupportedLocale, string> = {
  ro: 'HH:mm',
  bg: 'HH:mm',
  en: 'hh:mm a',
  hu: 'HH:mm',
  de: 'HH:mm',
};

// ============================================================================
// FILE UPLOADS
// ============================================================================

export const FILE_SIZE_LIMITS = {
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  IMAGE: 5 * 1024 * 1024, // 5MB
  AVATAR: 2 * 1024 * 1024, // 2MB
  BULK_IMPORT: 20 * 1024 * 1024, // 20MB
} as const;

export const ALLOWED_FILE_TYPES = {
  DOCUMENT: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  IMAGE: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  AVATAR: ['image/jpeg', 'image/png', 'image/webp'],
  BULK_IMPORT: [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
} as const;

export const FILE_EXTENSIONS = {
  DOCUMENT: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
  IMAGE: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  AVATAR: ['.jpg', '.jpeg', '.png', '.webp'],
  BULK_IMPORT: ['.csv', '.xls', '.xlsx'],
} as const;

// ============================================================================
// SECURITY & SESSION
// ============================================================================

export const SESSION_TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8 hours

export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL: false,
} as const;

// ============================================================================
// SUBSCRIPTION TIERS
// ============================================================================

export const MAX_EMPLOYEES_PER_TIER = {
  free: 5,
  starter: 25,
  professional: 100,
  enterprise: Infinity,
} as const;

export const MAX_ORGANIZATIONS_PER_TIER = {
  free: 1,
  starter: 3,
  professional: 10,
  enterprise: Infinity,
} as const;

export const MAX_STORAGE_PER_TIER = {
  free: 500 * 1024 * 1024, // 500MB
  starter: 5 * 1024 * 1024 * 1024, // 5GB
  professional: 20 * 1024 * 1024 * 1024, // 20GB
  enterprise: Infinity,
} as const;

// ============================================================================
// FEATURES
// ============================================================================

export const FEATURES_PER_TIER = {
  free: ['employees', 'trainings', 'medical_records'],
  starter: ['employees', 'trainings', 'medical_records', 'equipment', 'alerts'],
  professional: [
    'employees',
    'trainings',
    'medical_records',
    'equipment',
    'alerts',
    'documents',
    'penalties',
    'audit_log',
  ],
  enterprise: [
    'employees',
    'trainings',
    'medical_records',
    'equipment',
    'alerts',
    'documents',
    'penalties',
    'audit_log',
    'custom_fields',
    'api_access',
    'sso',
  ],
} as const;

// ============================================================================
// VALIDATION
// ============================================================================

export const VALIDATION_LIMITS = {
  NAME_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 2000,
  NOTES_MAX_LENGTH: 5000,
  EMAIL_MAX_LENGTH: 255,
  PHONE_MAX_LENGTH: 20,
  ADDRESS_MAX_LENGTH: 500,
} as const;

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export const NOTIFICATION_DEFAULTS = {
  AUTO_DISMISS_MS: 5000,
  MAX_VISIBLE: 3,
} as const;

// ============================================================================
// CACHE
// ============================================================================

export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const;

// ============================================================================
// API
// ============================================================================

export const API_DEFAULTS = {
  TIMEOUT_MS: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
} as const;

// ============================================================================
// ALERTS & REMINDERS
// ============================================================================

export const ALERT_THRESHOLDS = {
  TRAINING_EXPIRY_DAYS: [30, 14, 7, 3, 1], // Days before expiry to send alerts
  MEDICAL_EXPIRY_DAYS: [60, 30, 14, 7],
  EQUIPMENT_INSPECTION_DAYS: [30, 14, 7],
} as const;

// ============================================================================
// AUDIT LOG
// ============================================================================

export const AUDIT_LOG_RETENTION_DAYS = {
  free: 30,
  starter: 90,
  professional: 365,
  enterprise: 1825, // 5 years
} as const;

// ============================================================================
// DEFAULTS
// ============================================================================

export const DEFAULT_VALUES = {
  TRAINING_DURATION_HOURS: 8,
  MEDICAL_VALIDITY_YEARS: 1,
  EQUIPMENT_INSPECTION_INTERVAL_MONTHS: 12,
} as const;
