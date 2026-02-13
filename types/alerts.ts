/**
 * Alert Types and Interfaces
 * Defines the structure for the alerts system in the SSM/PSI platform
 */

/**
 * Alert Severity Levels
 * Determines the urgency and visual priority of alerts
 */
export enum AlertSeverity {
  CRITICAL = 'critical', // Urgent action required (e.g., expired certificates)
  WARNING = 'warning',   // Important but not immediate (e.g., expiring soon)
  INFO = 'info'          // Informational only (e.g., reminders)
}

/**
 * Alert Status
 * Tracks the lifecycle state of an alert
 */
export enum AlertStatus {
  NEW = 'new',                   // Newly created, not yet seen
  ACKNOWLEDGED = 'acknowledged', // Seen by user, action pending
  RESOLVED = 'resolved',         // Issue has been resolved
  DISMISSED = 'dismissed'        // User chose to dismiss without action
}

/**
 * Alert Categories
 * Groups alerts by the domain they relate to
 */
export enum AlertCategory {
  TRAINING = 'training',       // Training-related alerts (expired, upcoming)
  MEDICAL = 'medical',         // Medical examination alerts
  EQUIPMENT = 'equipment',     // Equipment inspection/verification alerts
  DOCUMENT = 'document',       // Document expiration/compliance alerts
  LEGISLATION = 'legislation'  // New legislation or regulatory changes
}

/**
 * Main Alert Interface
 * Represents a complete alert record from the database
 */
export interface Alert {
  id: string;
  organization_id: string;
  user_id: string | null;          // Assigned user, null for org-wide alerts
  category: AlertCategory;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  metadata: Record<string, any> | null; // Additional context (employee_id, equipment_id, etc.)
  action_url: string | null;       // Deep link to resolve the issue
  due_date: string | null;         // When action is required by (ISO 8601)
  acknowledged_at: string | null;  // When user acknowledged (ISO 8601)
  acknowledged_by: string | null;  // User ID who acknowledged
  resolved_at: string | null;      // When alert was resolved (ISO 8601)
  resolved_by: string | null;      // User ID who resolved
  dismissed_at: string | null;     // When alert was dismissed (ISO 8601)
  dismissed_by: string | null;     // User ID who dismissed
  created_at: string;              // Creation timestamp (ISO 8601)
  updated_at: string;              // Last update timestamp (ISO 8601)
}

/**
 * Alert Creation Interface
 * Data required to create a new alert
 */
export interface AlertCreate {
  organization_id: string;
  user_id?: string | null;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  message: string;
  metadata?: Record<string, any> | null;
  action_url?: string | null;
  due_date?: string | null;
}

/**
 * Alert Update Interface
 * Fields that can be updated on an existing alert
 */
export interface AlertUpdate {
  status?: AlertStatus;
  severity?: AlertSeverity;
  title?: string;
  message?: string;
  metadata?: Record<string, any> | null;
  action_url?: string | null;
  due_date?: string | null;
}

/**
 * Alert Filters
 * Query parameters for filtering alerts
 */
export interface AlertFilters {
  organization_id?: string;
  user_id?: string | null;
  category?: AlertCategory | AlertCategory[];
  severity?: AlertSeverity | AlertSeverity[];
  status?: AlertStatus | AlertStatus[];
  from_date?: string;           // Filter alerts created after this date
  to_date?: string;             // Filter alerts created before this date
  due_before?: string;          // Filter alerts due before this date
  search?: string;              // Search in title/message
  limit?: number;
  offset?: number;
}

/**
 * Alert Settings
 * User/organization preferences for alert notifications
 */
export interface AlertSettings {
  id: string;
  organization_id: string;
  user_id: string | null;       // null = org-wide settings
  email_enabled: boolean;       // Send email notifications
  email_frequency: 'immediate' | 'daily' | 'weekly';
  push_enabled: boolean;        // Browser push notifications
  severity_threshold: AlertSeverity; // Only notify for this severity and above
  categories_enabled: AlertCategory[]; // Which categories to receive
  quiet_hours_start: string | null;  // HH:MM format (e.g., "22:00")
  quiet_hours_end: string | null;    // HH:MM format (e.g., "08:00")
  created_at: string;
  updated_at: string;
}

/**
 * Alert Settings Update Interface
 * Fields that can be updated in alert settings
 */
export interface AlertSettingsUpdate {
  email_enabled?: boolean;
  email_frequency?: 'immediate' | 'daily' | 'weekly';
  push_enabled?: boolean;
  severity_threshold?: AlertSeverity;
  categories_enabled?: AlertCategory[];
  quiet_hours_start?: string | null;
  quiet_hours_end?: string | null;
}

/**
 * Alert Statistics
 * Aggregated counts for dashboard display
 */
export interface AlertStats {
  total: number;
  by_severity: Record<AlertSeverity, number>;
  by_status: Record<AlertStatus, number>;
  by_category: Record<AlertCategory, number>;
  overdue: number;              // Alerts past due_date
  unacknowledged: number;       // Status = 'new'
}

/**
 * Alert Summary
 * Lightweight version for lists and counts
 */
export interface AlertSummary {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  due_date: string | null;
  created_at: string;
}
