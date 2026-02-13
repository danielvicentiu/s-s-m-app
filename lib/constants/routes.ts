/**
 * Route constants for the application
 * Provides centralized route management with localization support
 */

// Base route paths (without locale prefix)
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PRICING: '/pricing',
  CONTACT: '/contact',
  ABOUT: '/about',
  TERMS: '/terms',
  PRIVACY: '/privacy',

  // Dashboard routes
  DASHBOARD: '/dashboard',

  // Employee management
  EMPLOYEES: '/dashboard/employees',
  EMPLOYEE_DETAILS: '/dashboard/employees/[id]',
  EMPLOYEE_ADD: '/dashboard/employees/add',

  // Training management
  TRAININGS: '/dashboard/trainings',
  TRAINING_DETAILS: '/dashboard/trainings/[id]',
  TRAINING_ADD: '/dashboard/trainings/add',
  TRAINING_SESSIONS: '/dashboard/trainings/sessions',

  // Medical records
  MEDICAL: '/dashboard/medical',
  MEDICAL_DETAILS: '/dashboard/medical/[id]',
  MEDICAL_ADD: '/dashboard/medical/add',

  // Equipment management
  EQUIPMENT: '/dashboard/equipment',
  EQUIPMENT_DETAILS: '/dashboard/equipment/[id]',
  EQUIPMENT_ADD: '/dashboard/equipment/add',

  // Documents
  DOCUMENTS: '/dashboard/documents',
  DOCUMENT_DETAILS: '/dashboard/documents/[id]',
  DOCUMENT_UPLOAD: '/dashboard/documents/upload',

  // Alerts & notifications
  ALERTS: '/dashboard/alerts',
  ALERT_DETAILS: '/dashboard/alerts/[id]',

  // Penalties
  PENALTIES: '/dashboard/penalties',
  PENALTY_DETAILS: '/dashboard/penalties/[id]',
  PENALTY_ADD: '/dashboard/penalties/add',

  // Reports
  REPORTS: '/dashboard/reports',
  REPORTS_SSM: '/dashboard/reports/ssm',
  REPORTS_PSI: '/dashboard/reports/psi',
  REPORTS_CUSTOM: '/dashboard/reports/custom',

  // Settings
  SETTINGS: '/dashboard/settings',
  SETTINGS_PROFILE: '/dashboard/settings/profile',
  SETTINGS_ORGANIZATION: '/dashboard/settings/organization',
  SETTINGS_BILLING: '/dashboard/settings/billing',
  SETTINGS_INTEGRATIONS: '/dashboard/settings/integrations',

  // Admin routes
  ADMIN: '/admin',
  ADMIN_ORGANIZATIONS: '/admin/organizations',
  ADMIN_USERS: '/admin/users',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_PERMISSIONS: '/admin/permissions',
  ADMIN_AUDIT: '/admin/audit',
  ADMIN_PIPELINE: '/admin/pipeline',
  ADMIN_PIPELINE_JOBS: '/admin/pipeline/jobs',
  ADMIN_PIPELINE_MONITOR: '/admin/pipeline/monitor',

  // API routes
  API_AUTH_CALLBACK: '/api/auth/callback',
  API_WEBHOOKS: '/api/webhooks',
  API_UPLOAD: '/api/upload',
} as const;

// Type for route keys
export type RouteKey = keyof typeof ROUTES;

/**
 * Get localized route path
 * @param locale - Locale code (ro, en, bg, hu, de)
 * @param route - Route path
 * @param params - Optional dynamic parameters for route interpolation
 * @returns Localized route path
 *
 * @example
 * getLocalizedRoute('ro', ROUTES.EMPLOYEES) // '/ro/dashboard/employees'
 * getLocalizedRoute('en', ROUTES.EMPLOYEE_DETAILS, { id: '123' }) // '/en/dashboard/employees/123'
 */
export function getLocalizedRoute(
  locale: string,
  route: string,
  params?: Record<string, string | number>
): string {
  let path = route;

  // Replace dynamic parameters if provided
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`[${key}]`, String(value));
    });
  }

  // Add locale prefix
  return `/${locale}${path}`;
}

/**
 * Check if a route is a public route (doesn't require authentication)
 */
export function isPublicRoute(path: string): boolean {
  // Remove locale prefix for comparison
  const cleanPath = path.replace(/^\/[a-z]{2}\//, '/');

  return PUBLIC_ROUTES.some(route => {
    if (route.includes('[')) {
      // Handle dynamic routes
      const pattern = route.replace(/\[.*?\]/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(cleanPath);
    }
    return cleanPath === route || cleanPath.startsWith(route + '/');
  });
}

/**
 * Check if a route is a protected route (requires authentication)
 */
export function isProtectedRoute(path: string): boolean {
  const cleanPath = path.replace(/^\/[a-z]{2}\//, '/');

  return PROTECTED_ROUTES.some(route => {
    if (route.includes('[')) {
      const pattern = route.replace(/\[.*?\]/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(cleanPath);
    }
    return cleanPath === route || cleanPath.startsWith(route + '/');
  });
}

/**
 * Check if a route is an admin route (requires admin role)
 */
export function isAdminRoute(path: string): boolean {
  const cleanPath = path.replace(/^\/[a-z]{2}\//, '/');

  return ADMIN_ROUTES.some(route => {
    if (route.includes('[')) {
      const pattern = route.replace(/\[.*?\]/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(cleanPath);
    }
    return cleanPath === route || cleanPath.startsWith(route + '/');
  });
}

/**
 * Get the base route without dynamic parameters
 */
export function getBaseRoute(path: string): string {
  return path.replace(/\/\[.*?\]/g, '');
}

/**
 * Extract locale from path
 */
export function extractLocale(path: string): string | null {
  const match = path.match(/^\/([a-z]{2})\//);
  return match ? match[1] : null;
}

// Public routes (no authentication required)
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.PRICING,
  ROUTES.CONTACT,
  ROUTES.ABOUT,
  ROUTES.TERMS,
  ROUTES.PRIVACY,
  ROUTES.API_AUTH_CALLBACK,
] as const;

// Protected routes (authentication required)
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.EMPLOYEES,
  ROUTES.EMPLOYEE_DETAILS,
  ROUTES.EMPLOYEE_ADD,
  ROUTES.TRAININGS,
  ROUTES.TRAINING_DETAILS,
  ROUTES.TRAINING_ADD,
  ROUTES.TRAINING_SESSIONS,
  ROUTES.MEDICAL,
  ROUTES.MEDICAL_DETAILS,
  ROUTES.MEDICAL_ADD,
  ROUTES.EQUIPMENT,
  ROUTES.EQUIPMENT_DETAILS,
  ROUTES.EQUIPMENT_ADD,
  ROUTES.DOCUMENTS,
  ROUTES.DOCUMENT_DETAILS,
  ROUTES.DOCUMENT_UPLOAD,
  ROUTES.ALERTS,
  ROUTES.ALERT_DETAILS,
  ROUTES.PENALTIES,
  ROUTES.PENALTY_DETAILS,
  ROUTES.PENALTY_ADD,
  ROUTES.REPORTS,
  ROUTES.REPORTS_SSM,
  ROUTES.REPORTS_PSI,
  ROUTES.REPORTS_CUSTOM,
  ROUTES.SETTINGS,
  ROUTES.SETTINGS_PROFILE,
  ROUTES.SETTINGS_ORGANIZATION,
  ROUTES.SETTINGS_BILLING,
  ROUTES.SETTINGS_INTEGRATIONS,
] as const;

// Admin routes (admin role required)
export const ADMIN_ROUTES = [
  ROUTES.ADMIN,
  ROUTES.ADMIN_ORGANIZATIONS,
  ROUTES.ADMIN_USERS,
  ROUTES.ADMIN_ROLES,
  ROUTES.ADMIN_PERMISSIONS,
  ROUTES.ADMIN_AUDIT,
  ROUTES.ADMIN_PIPELINE,
  ROUTES.ADMIN_PIPELINE_JOBS,
  ROUTES.ADMIN_PIPELINE_MONITOR,
] as const;

// Route groups for easier management
export const ROUTE_GROUPS = {
  public: PUBLIC_ROUTES,
  protected: PROTECTED_ROUTES,
  admin: ADMIN_ROUTES,
} as const;

// Supported locales
export const SUPPORTED_LOCALES = ['ro', 'en', 'bg', 'hu', 'de'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

// Default locale
export const DEFAULT_LOCALE: SupportedLocale = 'ro';
