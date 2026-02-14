/**
 * Feature Flags Configuration
 *
 * Central configuration for feature flags with context-aware enablement logic.
 * Supports role-based, country-based, and organization-based feature access.
 */

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description: string;
  enabledForRoles?: string[];
  enabledForCountries?: string[];
}

export interface FeatureFlagContext {
  role?: string;
  country?: string;
  organizationId?: string;
  userId?: string;
}

/**
 * Feature Flags Registry
 *
 * All feature flags should be defined here with their default settings.
 */
export const FEATURE_FLAGS: Record<string, FeatureFlag> = {
  // Module M5 - Publishing/Reporting
  M5_PUBLISHING: {
    key: 'M5_PUBLISHING',
    enabled: false,
    description: 'Enable M5 publishing and reporting module for compliance documents',
    enabledForRoles: ['consultant', 'firma_admin'],
  },

  // Module M6 - Batch Operations
  M6_BATCH: {
    key: 'M6_BATCH',
    enabled: false,
    description: 'Enable M6 batch operations for bulk employee and document management',
    enabledForRoles: ['consultant', 'firma_admin'],
  },

  // NIS2 Compliance Module
  NIS2_MODULE: {
    key: 'NIS2_MODULE',
    enabled: false,
    description: 'Enable NIS2 cybersecurity compliance module for critical infrastructure',
    enabledForRoles: ['consultant'],
    enabledForCountries: ['RO', 'BG', 'HU', 'DE'],
  },

  // Payment Integration
  STRIPE_PAYMENTS: {
    key: 'STRIPE_PAYMENTS',
    enabled: false,
    description: 'Enable Stripe payment integration for subscription management',
    enabledForRoles: ['consultant', 'firma_admin'],
  },

  // AI Features
  AI_RISK_ASSESSMENT: {
    key: 'AI_RISK_ASSESSMENT',
    enabled: false,
    description: 'Enable AI-powered risk assessment and recommendations',
    enabledForRoles: ['consultant', 'firma_admin'],
  },

  // Multi-language Support
  MULTI_LANGUAGE: {
    key: 'MULTI_LANGUAGE',
    enabled: true,
    description: 'Enable multi-language support (RO, BG, EN, HU, DE)',
    enabledForCountries: ['RO', 'BG', 'HU', 'DE'],
  },

  // UI Features
  DARK_MODE: {
    key: 'DARK_MODE',
    enabled: true,
    description: 'Enable dark mode theme toggle',
  },

  // Export Features
  EXPORT_PDF: {
    key: 'EXPORT_PDF',
    enabled: true,
    description: 'Enable PDF export for reports and documents',
    enabledForRoles: ['consultant', 'firma_admin'],
  },

  EXPORT_EXCEL: {
    key: 'EXPORT_EXCEL',
    enabled: true,
    description: 'Enable Excel export for data tables and reports',
    enabledForRoles: ['consultant', 'firma_admin'],
  },

  // Import Features
  BULK_IMPORT: {
    key: 'BULK_IMPORT',
    enabled: false,
    description: 'Enable bulk import of employees and equipment from CSV/Excel',
    enabledForRoles: ['consultant', 'firma_admin'],
  },

  // Real-time Features
  REALTIME_NOTIFICATIONS: {
    key: 'REALTIME_NOTIFICATIONS',
    enabled: true,
    description: 'Enable real-time push notifications for alerts and updates',
  },

  REALTIME_COLLABORATION: {
    key: 'REALTIME_COLLABORATION',
    enabled: false,
    description: 'Enable real-time collaboration features (live cursors, presence)',
    enabledForRoles: ['consultant', 'firma_admin'],
  },

  // Advanced Analytics
  ADVANCED_ANALYTICS: {
    key: 'ADVANCED_ANALYTICS',
    enabled: false,
    description: 'Enable advanced analytics dashboard with custom reports',
    enabledForRoles: ['consultant', 'firma_admin'],
  },

  // Audit & Compliance
  AUDIT_LOG_VIEWER: {
    key: 'AUDIT_LOG_VIEWER',
    enabled: true,
    description: 'Enable audit log viewer for tracking changes and compliance',
    enabledForRoles: ['consultant', 'firma_admin'],
  },

  GDPR_TOOLS: {
    key: 'GDPR_TOOLS',
    enabled: true,
    description: 'Enable GDPR compliance tools (data export, deletion requests)',
    enabledForCountries: ['RO', 'BG', 'HU', 'DE'],
  },

  // Mobile Features
  MOBILE_APP: {
    key: 'MOBILE_APP',
    enabled: false,
    description: 'Enable mobile app features and offline sync',
  },

  // Integration Features
  API_WEBHOOKS: {
    key: 'API_WEBHOOKS',
    enabled: false,
    description: 'Enable webhook integrations for external systems',
    enabledForRoles: ['consultant'],
  },

  API_PUBLIC: {
    key: 'API_PUBLIC',
    enabled: false,
    description: 'Enable public API access for third-party integrations',
    enabledForRoles: ['consultant'],
  },

  // Training Features
  TRAINING_CERTIFICATES: {
    key: 'TRAINING_CERTIFICATES',
    enabled: true,
    description: 'Enable automatic training certificate generation',
    enabledForRoles: ['consultant', 'firma_admin'],
  },

  // Equipment Management
  EQUIPMENT_QR_CODES: {
    key: 'EQUIPMENT_QR_CODES',
    enabled: false,
    description: 'Enable QR code generation for equipment tracking',
    enabledForRoles: ['consultant', 'firma_admin'],
  },
};

/**
 * Check if a feature flag is enabled based on context
 *
 * @param key - Feature flag key
 * @param context - Context object with role, country, organizationId, userId
 * @returns boolean - Whether the feature is enabled for the given context
 */
export function isFeatureEnabled(
  key: string,
  context?: FeatureFlagContext
): boolean {
  const flag = FEATURE_FLAGS[key];

  // If flag doesn't exist, return false
  if (!flag) {
    console.warn(`Feature flag "${key}" not found`);
    return false;
  }

  // If flag is globally disabled, return false
  if (!flag.enabled) {
    return false;
  }

  // If no context provided, return global enabled state
  if (!context) {
    return flag.enabled;
  }

  // Check role-based access
  if (flag.enabledForRoles && flag.enabledForRoles.length > 0) {
    if (!context.role || !flag.enabledForRoles.includes(context.role)) {
      return false;
    }
  }

  // Check country-based access
  if (flag.enabledForCountries && flag.enabledForCountries.length > 0) {
    if (!context.country || !flag.enabledForCountries.includes(context.country)) {
      return false;
    }
  }

  // All checks passed
  return true;
}

/**
 * Get all enabled feature flags for a given context
 *
 * @param context - Context object with role, country, organizationId, userId
 * @returns Array of enabled feature flag keys
 */
export function getEnabledFeatures(context?: FeatureFlagContext): string[] {
  return Object.keys(FEATURE_FLAGS).filter((key) =>
    isFeatureEnabled(key, context)
  );
}

/**
 * Get feature flag configuration
 *
 * @param key - Feature flag key
 * @returns FeatureFlag object or undefined if not found
 */
export function getFeatureFlag(key: string): FeatureFlag | undefined {
  return FEATURE_FLAGS[key];
}

/**
 * Check multiple feature flags at once
 *
 * @param keys - Array of feature flag keys
 * @param context - Context object with role, country, organizationId, userId
 * @returns Record of feature keys and their enabled status
 */
export function checkFeatureFlags(
  keys: string[],
  context?: FeatureFlagContext
): Record<string, boolean> {
  const result: Record<string, boolean> = {};

  for (const key of keys) {
    result[key] = isFeatureEnabled(key, context);
  }

  return result;
}

// Export all feature flag keys for type safety
export const FEATURE_FLAG_KEYS = Object.keys(FEATURE_FLAGS) as Array<
  keyof typeof FEATURE_FLAGS
>;

// Type guard for feature flag keys
export function isValidFeatureFlagKey(key: string): key is keyof typeof FEATURE_FLAGS {
  return key in FEATURE_FLAGS;
}
