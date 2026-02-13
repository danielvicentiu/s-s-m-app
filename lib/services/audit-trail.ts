// AUDIT TRAIL SERVICE
// GDPR Article 30 compliant audit logging
// Retention: 2 years minimum
// Created: 2026-02-13

import { createSupabaseServer } from '@/lib/supabase/server';
import { createSupabaseBrowser } from '@/lib/supabase/client';

// ── Action Types ──
export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  IMPERSONATE = 'IMPERSONATE',
  SYNC = 'SYNC',
  SEND = 'SEND',
  RECEIVE = 'RECEIVE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  ARCHIVE = 'ARCHIVE',
  RESTORE = 'RESTORE',
}

// ── Entity Types ──
export type AuditEntityType =
  | 'organization'
  | 'employee'
  | 'user'
  | 'profile'
  | 'membership'
  | 'role'
  | 'medical_record'
  | 'equipment'
  | 'training'
  | 'document'
  | 'alert'
  | 'penalty'
  | 'notification'
  | 'webhook'
  | 'api_key'
  | 'reges_connection'
  | 'reges_outbox'
  | 'reges_receipt'
  | 'reges_result'
  | 'contract'
  | 'location'
  | 'report'
  | 'feature_flag'
  | 'email_delivery'
  | 'whatsapp_delivery'
  | 'stripe_subscription'
  | 'stripe_invoice'
  | 'impersonation_session';

// ── Audit Log Entry ──
export interface AuditLogEntry {
  id: string;
  organization_id: string | null;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  metadata: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// ── Filter Options ──
export interface AuditTrailFilters {
  userId?: string;
  action?: AuditAction | string;
  entityType?: AuditEntityType | string;
  entityId?: string;
  dateFrom?: string; // ISO date string
  dateTo?: string;   // ISO date string
  limit?: number;
  offset?: number;
}

// ── Export Format ──
export type AuditExportFormat = 'json' | 'csv' | 'pdf';

// ── Export Options ──
export interface AuditExportOptions {
  organizationId: string;
  dateFrom: string;
  dateTo: string;
  format: AuditExportFormat;
  filters?: AuditTrailFilters;
  includeMetadata?: boolean;
}

// ── RETENTION POLICY ──
// GDPR Article 30 requires minimum 2 years retention for processing records
export const AUDIT_RETENTION_YEARS = 2;
export const AUDIT_RETENTION_DAYS = AUDIT_RETENTION_YEARS * 365;

// ═══════════════════════════════════════════════════════════
// SERVER-SIDE FUNCTIONS (for server components & API routes)
// ═══════════════════════════════════════════════════════════

/**
 * Log an audit action (server-side)
 *
 * @param userId - User performing the action
 * @param action - Action type (CREATE, UPDATE, etc.)
 * @param resource - Resource/entity type
 * @param details - Additional details (entityId, oldValues, newValues, metadata)
 * @returns Audit log entry ID or null on failure
 */
export async function logAction(
  userId: string | null,
  action: AuditAction | string,
  resource: AuditEntityType | string,
  details?: {
    entityId?: string | null;
    organizationId?: string | null;
    oldValues?: Record<string, any> | null;
    newValues?: Record<string, any> | null;
    metadata?: Record<string, any> | null;
    ipAddress?: string | null;
    userAgent?: string | null;
  }
): Promise<string | null> {
  try {
    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
      .from('audit_log')
      .insert({
        user_id: userId,
        action: action.toString(),
        entity_type: resource,
        entity_id: details?.entityId || null,
        organization_id: details?.organizationId || null,
        old_values: details?.oldValues || null,
        new_values: details?.newValues || null,
        metadata: details?.metadata || null,
        ip_address: details?.ipAddress || null,
        user_agent: details?.userAgent || null,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Failed to log audit action:', error);
      return null;
    }

    return data?.id || null;
  } catch (err) {
    console.error('Audit logging error:', err);
    return null;
  }
}

/**
 * Log authentication events (LOGIN, LOGOUT)
 */
export async function logAuthEvent(
  userId: string,
  action: AuditAction.LOGIN | AuditAction.LOGOUT,
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    method?: string; // 'email', 'oauth', 'magic_link'
  }
): Promise<string | null> {
  return logAction(userId, action, 'user', {
    entityId: userId,
    metadata: {
      event: action,
      method: metadata?.method || 'email',
      session_id: metadata?.sessionId,
      timestamp: new Date().toISOString(),
    },
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
  });
}

/**
 * Log impersonation events (GDPR compliance critical)
 */
export async function logImpersonation(
  adminUserId: string,
  targetUserId: string,
  action: 'start' | 'end',
  metadata?: {
    organizationId?: string;
    reason?: string;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
  }
): Promise<string | null> {
  return logAction(adminUserId, AuditAction.IMPERSONATE, 'impersonation_session', {
    entityId: metadata?.sessionId || targetUserId,
    organizationId: metadata?.organizationId,
    metadata: {
      action,
      admin_user_id: adminUserId,
      target_user_id: targetUserId,
      reason: metadata?.reason,
      timestamp: new Date().toISOString(),
    },
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
  });
}

/**
 * Log data export events (GDPR Article 15 - Right to access)
 */
export async function logExport(
  userId: string,
  entityType: AuditEntityType | string,
  details: {
    organizationId?: string;
    recordCount?: number;
    format?: string;
    dateRange?: { from: string; to: string };
    filters?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }
): Promise<string | null> {
  return logAction(userId, AuditAction.EXPORT, entityType, {
    organizationId: details.organizationId,
    metadata: {
      record_count: details.recordCount,
      format: details.format || 'json',
      date_range: details.dateRange,
      filters: details.filters,
      timestamp: new Date().toISOString(),
    },
    ipAddress: details.ipAddress,
    userAgent: details.userAgent,
  });
}

/**
 * Get audit trail for organization (server-side)
 *
 * @param organizationId - Organization ID
 * @param filters - Optional filters
 * @returns Array of audit log entries
 */
export async function getAuditTrail(
  organizationId: string,
  filters?: AuditTrailFilters
): Promise<{ data: AuditLogEntry[]; count: number; error: string | null }> {
  try {
    const supabase = await createSupabaseServer();

    let query = supabase
      .from('audit_log')
      .select('*', { count: 'exact' })
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters?.action) {
      query = query.eq('action', filters.action);
    }

    if (filters?.entityType) {
      query = query.eq('entity_type', filters.entityType);
    }

    if (filters?.entityId) {
      query = query.eq('entity_id', filters.entityId);
    }

    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }

    // Pagination
    const limit = filters?.limit || 100;
    const offset = filters?.offset || 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Failed to fetch audit trail:', error);
      return { data: [], count: 0, error: error.message };
    }

    return {
      data: data || [],
      count: count || 0,
      error: null,
    };
  } catch (err) {
    console.error('Audit trail fetch error:', err);
    return {
      data: [],
      count: 0,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Get audit trail for current user across all organizations
 */
export async function getMyAuditTrail(
  filters?: AuditTrailFilters
): Promise<{ data: AuditLogEntry[]; count: number; error: string | null }> {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: [], count: 0, error: 'Not authenticated' };
    }

    let query = supabase
      .from('audit_log')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply filters (same as getAuditTrail)
    if (filters?.action) {
      query = query.eq('action', filters.action);
    }

    if (filters?.entityType) {
      query = query.eq('entity_type', filters.entityType);
    }

    if (filters?.entityId) {
      query = query.eq('entity_id', filters.entityId);
    }

    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }

    const limit = filters?.limit || 100;
    const offset = filters?.offset || 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Failed to fetch user audit trail:', error);
      return { data: [], count: 0, error: error.message };
    }

    return {
      data: data || [],
      count: count || 0,
      error: null,
    };
  } catch (err) {
    console.error('User audit trail fetch error:', err);
    return {
      data: [],
      count: 0,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Export audit trail to various formats
 * GDPR Article 30 compliance: Processing records must be exportable
 *
 * @param options - Export options
 * @returns Export data in requested format
 */
export async function exportAuditTrail(
  options: AuditExportOptions
): Promise<{ data: any; filename: string; mimeType: string; error: string | null }> {
  try {
    // Log the export action first
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch audit data
    const { data: auditData, count, error } = await getAuditTrail(
      options.organizationId,
      {
        ...options.filters,
        dateFrom: options.dateFrom,
        dateTo: options.dateTo,
        limit: 10000, // Max export limit
      }
    );

    if (error) {
      return {
        data: null,
        filename: '',
        mimeType: '',
        error,
      };
    }

    // Log the export
    if (user) {
      await logExport(user.id, 'audit_log', {
        organizationId: options.organizationId,
        recordCount: count,
        format: options.format,
        dateRange: {
          from: options.dateFrom,
          to: options.dateTo,
        },
        filters: options.filters,
      });
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `audit_trail_${options.organizationId}_${timestamp}`;

    // Format conversion
    switch (options.format) {
      case 'json':
        return {
          data: JSON.stringify(auditData, null, 2),
          filename: `${filename}.json`,
          mimeType: 'application/json',
          error: null,
        };

      case 'csv':
        const csvData = convertToCSV(auditData, options.includeMetadata);
        return {
          data: csvData,
          filename: `${filename}.csv`,
          mimeType: 'text/csv',
          error: null,
        };

      case 'pdf':
        // PDF generation would require a library like pdfmake or puppeteer
        // For now, return JSON with a note
        return {
          data: JSON.stringify(auditData, null, 2),
          filename: `${filename}.json`,
          mimeType: 'application/json',
          error: 'PDF export not yet implemented. Exported as JSON instead.',
        };

      default:
        return {
          data: null,
          filename: '',
          mimeType: '',
          error: 'Unsupported export format',
        };
    }
  } catch (err) {
    console.error('Audit export error:', err);
    return {
      data: null,
      filename: '',
      mimeType: '',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Convert audit data to CSV format
 */
function convertToCSV(
  data: AuditLogEntry[],
  includeMetadata: boolean = false
): string {
  if (!data || data.length === 0) {
    return 'No data available';
  }

  const headers = [
    'ID',
    'Created At',
    'User ID',
    'Organization ID',
    'Action',
    'Entity Type',
    'Entity ID',
    'IP Address',
    'User Agent',
  ];

  if (includeMetadata) {
    headers.push('Old Values', 'New Values', 'Metadata');
  }

  const rows = data.map(entry => {
    const row = [
      entry.id,
      entry.created_at,
      entry.user_id || '',
      entry.organization_id || '',
      entry.action,
      entry.entity_type,
      entry.entity_id || '',
      entry.ip_address || '',
      entry.user_agent || '',
    ];

    if (includeMetadata) {
      row.push(
        entry.old_values ? JSON.stringify(entry.old_values) : '',
        entry.new_values ? JSON.stringify(entry.new_values) : '',
        entry.metadata ? JSON.stringify(entry.metadata) : ''
      );
    }

    return row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Clean up old audit logs (retention policy)
 * Should be run periodically (e.g., monthly cron job)
 * Keeps records for AUDIT_RETENTION_YEARS (2 years minimum for GDPR)
 */
export async function cleanupOldAuditLogs(): Promise<{
  deletedCount: number;
  error: string | null;
}> {
  try {
    const supabase = await createSupabaseServer();

    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - AUDIT_RETENTION_DAYS);

    const { data, error } = await supabase
      .from('audit_log')
      .delete()
      .lt('created_at', retentionDate.toISOString())
      .select('id');

    if (error) {
      console.error('Failed to cleanup old audit logs:', error);
      return { deletedCount: 0, error: error.message };
    }

    const deletedCount = data?.length || 0;
    console.log(`Cleaned up ${deletedCount} old audit log entries`);

    return { deletedCount, error: null };
  } catch (err) {
    console.error('Audit cleanup error:', err);
    return {
      deletedCount: 0,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ═══════════════════════════════════════════════════════════
// CLIENT-SIDE FUNCTIONS (for client components)
// ═══════════════════════════════════════════════════════════

/**
 * Log an audit action (client-side)
 */
export async function logActionClient(
  userId: string | null,
  action: AuditAction | string,
  resource: AuditEntityType | string,
  details?: {
    entityId?: string | null;
    organizationId?: string | null;
    oldValues?: Record<string, any> | null;
    newValues?: Record<string, any> | null;
    metadata?: Record<string, any> | null;
  }
): Promise<string | null> {
  try {
    const supabase = createSupabaseBrowser();

    const { data, error } = await supabase
      .from('audit_log')
      .insert({
        user_id: userId,
        action: action.toString(),
        entity_type: resource,
        entity_id: details?.entityId || null,
        organization_id: details?.organizationId || null,
        old_values: details?.oldValues || null,
        new_values: details?.newValues || null,
        metadata: details?.metadata || null,
        // IP and user agent would be set by DB trigger or API route
      })
      .select('id')
      .single();

    if (error) {
      console.error('Failed to log audit action (client):', error);
      return null;
    }

    return data?.id || null;
  } catch (err) {
    console.error('Audit logging error (client):', err);
    return null;
  }
}

/**
 * Get audit trail (client-side)
 */
export async function getAuditTrailClient(
  organizationId: string,
  filters?: AuditTrailFilters
): Promise<{ data: AuditLogEntry[]; count: number; error: string | null }> {
  try {
    const supabase = createSupabaseBrowser();

    let query = supabase
      .from('audit_log')
      .select('*', { count: 'exact' })
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    // Apply filters (same logic as server version)
    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters?.action) {
      query = query.eq('action', filters.action);
    }

    if (filters?.entityType) {
      query = query.eq('entity_type', filters.entityType);
    }

    if (filters?.entityId) {
      query = query.eq('entity_id', filters.entityId);
    }

    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }

    const limit = filters?.limit || 100;
    const offset = filters?.offset || 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Failed to fetch audit trail (client):', error);
      return { data: [], count: 0, error: error.message };
    }

    return {
      data: data || [],
      count: count || 0,
      error: null,
    };
  } catch (err) {
    console.error('Audit trail fetch error (client):', err);
    return {
      data: [],
      count: 0,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Get human-readable action description in Romanian
 */
export function getActionLabel(action: string): string {
  const labels: Record<string, string> = {
    CREATE: 'Creare',
    READ: 'Vizualizare',
    UPDATE: 'Modificare',
    DELETE: 'Ștergere',
    LOGIN: 'Autentificare',
    LOGOUT: 'Deconectare',
    EXPORT: 'Export',
    IMPORT: 'Import',
    IMPERSONATE: 'Impersonare',
    SYNC: 'Sincronizare',
    SEND: 'Trimitere',
    RECEIVE: 'Primire',
    APPROVE: 'Aprobare',
    REJECT: 'Respingere',
    ARCHIVE: 'Arhivare',
    RESTORE: 'Restaurare',
  };

  return labels[action] || action;
}

/**
 * Get human-readable entity type in Romanian
 */
export function getEntityTypeLabel(entityType: string): string {
  const labels: Record<string, string> = {
    organization: 'Organizație',
    employee: 'Angajat',
    user: 'Utilizator',
    profile: 'Profil',
    membership: 'Membru',
    role: 'Rol',
    medical_record: 'Fișă medicală',
    equipment: 'Echipament',
    training: 'Instruire',
    document: 'Document',
    alert: 'Alertă',
    penalty: 'Sancțiune',
    notification: 'Notificare',
    webhook: 'Webhook',
    api_key: 'Cheie API',
    reges_connection: 'Conexiune RegeS',
    reges_outbox: 'RegeS Outbox',
    reges_receipt: 'Recipisă RegeS',
    reges_result: 'Rezultat RegeS',
    contract: 'Contract',
    location: 'Locație',
    report: 'Raport',
    feature_flag: 'Feature Flag',
    email_delivery: 'Livrare Email',
    whatsapp_delivery: 'Livrare WhatsApp',
    stripe_subscription: 'Abonament Stripe',
    stripe_invoice: 'Factură Stripe',
    impersonation_session: 'Sesiune Impersonare',
  };

  return labels[entityType] || entityType;
}
