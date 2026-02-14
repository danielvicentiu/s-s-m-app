/**
 * Audit Event Types
 *
 * Defines all event types tracked in the audit log system.
 * Used for logging user actions, system events, and compliance tracking.
 */

export type AuditEventCategory =
  | 'auth'
  | 'user'
  | 'org'
  | 'document'
  | 'training'
  | 'employee'
  | 'compliance'
  | 'system';

export type AuditEventSeverity = 'info' | 'warning' | 'critical';

export interface AuditEventType {
  id: string;
  name: string;
  category: AuditEventCategory;
  severity: AuditEventSeverity;
  description: string;
  retentionDays: number;
  isGDPRRelevant: boolean;
}

/**
 * All audit event types supported by the system
 */
export const AUDIT_EVENT_TYPES: readonly AuditEventType[] = [
  // Auth Events
  {
    id: 'auth.login',
    name: 'Login',
    category: 'auth',
    severity: 'info',
    description: 'User logged into the system',
    retentionDays: 90,
    isGDPRRelevant: true,
  },
  {
    id: 'auth.logout',
    name: 'Logout',
    category: 'auth',
    severity: 'info',
    description: 'User logged out of the system',
    retentionDays: 90,
    isGDPRRelevant: true,
  },
  {
    id: 'auth.login_failed',
    name: 'Login Failed',
    category: 'auth',
    severity: 'warning',
    description: 'Failed login attempt',
    retentionDays: 180,
    isGDPRRelevant: true,
  },
  {
    id: 'auth.password_reset',
    name: 'Password Reset',
    category: 'auth',
    severity: 'warning',
    description: 'User requested password reset',
    retentionDays: 365,
    isGDPRRelevant: true,
  },
  {
    id: 'auth.password_changed',
    name: 'Password Changed',
    category: 'auth',
    severity: 'warning',
    description: 'User changed their password',
    retentionDays: 365,
    isGDPRRelevant: true,
  },

  // User Events
  {
    id: 'user.create',
    name: 'User Created',
    category: 'user',
    severity: 'info',
    description: 'New user account created',
    retentionDays: 365,
    isGDPRRelevant: true,
  },
  {
    id: 'user.update',
    name: 'User Updated',
    category: 'user',
    severity: 'info',
    description: 'User profile updated',
    retentionDays: 365,
    isGDPRRelevant: true,
  },
  {
    id: 'user.delete',
    name: 'User Deleted',
    category: 'user',
    severity: 'critical',
    description: 'User account deleted',
    retentionDays: 2555,
    isGDPRRelevant: true,
  },
  {
    id: 'user.role_change',
    name: 'Role Changed',
    category: 'user',
    severity: 'warning',
    description: 'User role or permissions changed',
    retentionDays: 365,
    isGDPRRelevant: false,
  },
  {
    id: 'user.data_export',
    name: 'Data Export',
    category: 'user',
    severity: 'warning',
    description: 'User requested GDPR data export',
    retentionDays: 2555,
    isGDPRRelevant: true,
  },

  // Organization Events
  {
    id: 'org.create',
    name: 'Organization Created',
    category: 'org',
    severity: 'info',
    description: 'New organization created',
    retentionDays: 2555,
    isGDPRRelevant: false,
  },
  {
    id: 'org.update',
    name: 'Organization Updated',
    category: 'org',
    severity: 'info',
    description: 'Organization details updated',
    retentionDays: 365,
    isGDPRRelevant: false,
  },
  {
    id: 'org.delete',
    name: 'Organization Deleted',
    category: 'org',
    severity: 'critical',
    description: 'Organization deleted',
    retentionDays: 2555,
    isGDPRRelevant: true,
  },
  {
    id: 'org.settings_change',
    name: 'Settings Changed',
    category: 'org',
    severity: 'warning',
    description: 'Organization settings modified',
    retentionDays: 365,
    isGDPRRelevant: false,
  },
  {
    id: 'org.member_add',
    name: 'Member Added',
    category: 'org',
    severity: 'info',
    description: 'New member added to organization',
    retentionDays: 365,
    isGDPRRelevant: true,
  },
  {
    id: 'org.member_remove',
    name: 'Member Removed',
    category: 'org',
    severity: 'warning',
    description: 'Member removed from organization',
    retentionDays: 365,
    isGDPRRelevant: true,
  },

  // Document Events
  {
    id: 'document.upload',
    name: 'Document Uploaded',
    category: 'document',
    severity: 'info',
    description: 'Document uploaded to system',
    retentionDays: 2555,
    isGDPRRelevant: false,
  },
  {
    id: 'document.download',
    name: 'Document Downloaded',
    category: 'document',
    severity: 'info',
    description: 'Document downloaded by user',
    retentionDays: 365,
    isGDPRRelevant: true,
  },
  {
    id: 'document.delete',
    name: 'Document Deleted',
    category: 'document',
    severity: 'warning',
    description: 'Document deleted from system',
    retentionDays: 2555,
    isGDPRRelevant: false,
  },
  {
    id: 'document.share',
    name: 'Document Shared',
    category: 'document',
    severity: 'info',
    description: 'Document shared with another user',
    retentionDays: 365,
    isGDPRRelevant: true,
  },
  {
    id: 'document.expire',
    name: 'Document Expired',
    category: 'document',
    severity: 'warning',
    description: 'Document reached expiration date',
    retentionDays: 365,
    isGDPRRelevant: false,
  },

  // Training Events
  {
    id: 'training.create',
    name: 'Training Created',
    category: 'training',
    severity: 'info',
    description: 'New training session created',
    retentionDays: 2555,
    isGDPRRelevant: false,
  },
  {
    id: 'training.assign',
    name: 'Training Assigned',
    category: 'training',
    severity: 'info',
    description: 'Training assigned to employee',
    retentionDays: 2555,
    isGDPRRelevant: true,
  },
  {
    id: 'training.complete',
    name: 'Training Completed',
    category: 'training',
    severity: 'info',
    description: 'Employee completed training',
    retentionDays: 2555,
    isGDPRRelevant: true,
  },
  {
    id: 'training.expire',
    name: 'Training Expired',
    category: 'training',
    severity: 'warning',
    description: 'Training certification expired',
    retentionDays: 2555,
    isGDPRRelevant: true,
  },
  {
    id: 'training.cancel',
    name: 'Training Cancelled',
    category: 'training',
    severity: 'warning',
    description: 'Training session cancelled',
    retentionDays: 365,
    isGDPRRelevant: false,
  },

  // Employee Events
  {
    id: 'employee.add',
    name: 'Employee Added',
    category: 'employee',
    severity: 'info',
    description: 'New employee added to system',
    retentionDays: 2555,
    isGDPRRelevant: true,
  },
  {
    id: 'employee.update',
    name: 'Employee Updated',
    category: 'employee',
    severity: 'info',
    description: 'Employee information updated',
    retentionDays: 2555,
    isGDPRRelevant: true,
  },
  {
    id: 'employee.remove',
    name: 'Employee Removed',
    category: 'employee',
    severity: 'warning',
    description: 'Employee removed from system',
    retentionDays: 2555,
    isGDPRRelevant: true,
  },
  {
    id: 'employee.medical_check',
    name: 'Medical Check',
    category: 'employee',
    severity: 'info',
    description: 'Medical check recorded for employee',
    retentionDays: 2555,
    isGDPRRelevant: true,
  },

  // Compliance Events
  {
    id: 'compliance.violation',
    name: 'Compliance Violation',
    category: 'compliance',
    severity: 'critical',
    description: 'Compliance violation detected',
    retentionDays: 2555,
    isGDPRRelevant: false,
  },
  {
    id: 'compliance.alert_create',
    name: 'Alert Created',
    category: 'compliance',
    severity: 'warning',
    description: 'Compliance alert created',
    retentionDays: 365,
    isGDPRRelevant: false,
  },
  {
    id: 'compliance.alert_resolve',
    name: 'Alert Resolved',
    category: 'compliance',
    severity: 'info',
    description: 'Compliance alert resolved',
    retentionDays: 365,
    isGDPRRelevant: false,
  },
  {
    id: 'compliance.penalty_applied',
    name: 'Penalty Applied',
    category: 'compliance',
    severity: 'critical',
    description: 'Penalty applied for violation',
    retentionDays: 2555,
    isGDPRRelevant: false,
  },

  // System Events
  {
    id: 'system.settings_change',
    name: 'Settings Changed',
    category: 'system',
    severity: 'warning',
    description: 'System settings modified',
    retentionDays: 365,
    isGDPRRelevant: false,
  },
  {
    id: 'system.backup',
    name: 'Backup Created',
    category: 'system',
    severity: 'info',
    description: 'System backup created',
    retentionDays: 90,
    isGDPRRelevant: false,
  },
  {
    id: 'system.migration',
    name: 'Migration Executed',
    category: 'system',
    severity: 'warning',
    description: 'Database migration executed',
    retentionDays: 2555,
    isGDPRRelevant: false,
  },
  {
    id: 'system.integration',
    name: 'Integration Action',
    category: 'system',
    severity: 'info',
    description: 'External integration action performed',
    retentionDays: 365,
    isGDPRRelevant: false,
  },
  {
    id: 'system.error',
    name: 'System Error',
    category: 'system',
    severity: 'critical',
    description: 'System error occurred',
    retentionDays: 90,
    isGDPRRelevant: false,
  },
] as const;

/**
 * Get audit event type by ID
 */
export function getAuditEventType(id: string): AuditEventType | undefined {
  return AUDIT_EVENT_TYPES.find((type) => type.id === id);
}

/**
 * Get audit event types by category
 */
export function getAuditEventTypesByCategory(
  category: AuditEventCategory
): AuditEventType[] {
  return AUDIT_EVENT_TYPES.filter((type) => type.category === category);
}

/**
 * Get audit event types by severity
 */
export function getAuditEventTypesBySeverity(
  severity: AuditEventSeverity
): AuditEventType[] {
  return AUDIT_EVENT_TYPES.filter((type) => type.severity === severity);
}

/**
 * Get GDPR-relevant audit event types
 */
export function getGDPRRelevantEventTypes(): AuditEventType[] {
  return AUDIT_EVENT_TYPES.filter((type) => type.isGDPRRelevant);
}
