/**
 * Application-wide constants
 * Centralized configuration for file uploads, pagination, localization, and business rules
 */

// File Upload Constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export const ALLOWED_FILE_TYPES = {
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  all: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
} as const;

export const FILE_TYPE_EXTENSIONS = {
  documents: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
  images: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  all: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png', '.gif', '.webp'],
} as const;

// Pagination Constants
export const PAGINATION_DEFAULT = 10;
export const PAGINATION_OPTIONS = [10, 25, 50, 100] as const;

// UI Constants
export const DEBOUNCE_DELAY = 300; // milliseconds

// Internationalization Constants
export const SUPPORTED_LOCALES = ['ro', 'bg', 'en', 'hu', 'de'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'ro';

export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  ro: 'Română',
  bg: 'Български',
  en: 'English',
  hu: 'Magyar',
  de: 'Deutsch',
} as const;

// Countries and Regions
export const SUPPORTED_COUNTRIES = ['RO', 'BG', 'HU', 'DE'] as const;
export type SupportedCountry = (typeof SUPPORTED_COUNTRIES)[number];

export const COUNTRY_NAMES: Record<SupportedCountry, string> = {
  RO: 'România',
  BG: 'Bulgaria',
  HU: 'Ungaria',
  DE: 'Germania',
} as const;

// Currency Configuration per Country
export const CURRENCY: Record<SupportedCountry, { code: string; symbol: string }> = {
  RO: { code: 'RON', symbol: 'RON' },
  BG: { code: 'BGN', symbol: 'лв' },
  HU: { code: 'HUF', symbol: 'Ft' },
  DE: { code: 'EUR', symbol: '€' },
} as const;

// Date Format Configuration per Locale
export const DATE_FORMATS: Record<
  SupportedLocale,
  {
    short: string; // e.g., 13/02/2026
    long: string; // e.g., 13 februarie 2026
    dateTime: string; // e.g., 13/02/2026 14:30
    time: string; // e.g., 14:30
  }
> = {
  ro: {
    short: 'dd/MM/yyyy',
    long: 'dd MMMM yyyy',
    dateTime: 'dd/MM/yyyy HH:mm',
    time: 'HH:mm',
  },
  bg: {
    short: 'dd.MM.yyyy',
    long: 'dd MMMM yyyy',
    dateTime: 'dd.MM.yyyy HH:mm',
    time: 'HH:mm',
  },
  en: {
    short: 'MM/dd/yyyy',
    long: 'MMMM dd, yyyy',
    dateTime: 'MM/dd/yyyy hh:mm a',
    time: 'hh:mm a',
  },
  hu: {
    short: 'yyyy.MM.dd',
    long: 'yyyy. MMMM dd.',
    dateTime: 'yyyy.MM.dd HH:mm',
    time: 'HH:mm',
  },
  de: {
    short: 'dd.MM.yyyy',
    long: 'dd. MMMM yyyy',
    dateTime: 'dd.MM.yyyy HH:mm',
    time: 'HH:mm',
  },
} as const;

// Business Rules - Training and Compliance
export const TRAINING_EXPIRY_WARNING_DAYS = 30; // Show warning 30 days before expiry
export const MEDICAL_EXPIRY_WARNING_DAYS = 30; // Show warning 30 days before medical exam expiry
export const EQUIPMENT_INSPECTION_WARNING_DAYS = 30; // Show warning 30 days before equipment inspection due

// Session and Cache Constants
export const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// API Rate Limiting
export const API_RATE_LIMIT = 100; // requests per window
export const API_RATE_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds

// Validation Constants
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;
export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 50;

// Status Types
export const STATUS_TYPES = {
  active: 'active',
  inactive: 'inactive',
  pending: 'pending',
  expired: 'expired',
  archived: 'archived',
} as const;

export type StatusType = (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];

// Alert Severity Levels
export const ALERT_SEVERITY = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  critical: 'critical',
} as const;

export type AlertSeverity = (typeof ALERT_SEVERITY)[keyof typeof ALERT_SEVERITY];

// Organization Types
export const ORGANIZATION_TYPES = {
  consultant: 'consultant',
  company: 'company',
} as const;

export type OrganizationType = (typeof ORGANIZATION_TYPES)[keyof typeof ORGANIZATION_TYPES];
