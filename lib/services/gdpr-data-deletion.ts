// S-S-M.RO — GDPR DATA DELETION SERVICE
// GDPR Article 17 - Right to Erasure ("Right to be Forgotten")
// Handles deletion requests with grace periods, anonymization, and audit trails
// Data: 14 Februarie 2026

import { createSupabaseServer } from '@/lib/supabase/server'
import crypto from 'crypto'

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type DeletionRequestStatus = 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'

export interface DeletionRequest {
  id: string
  user_id: string
  organization_id: string
  requested_by: string
  status: DeletionRequestStatus
  grace_period_days: number
  scheduled_execution_at: string
  executed_at: string | null
  executed_by: string | null
  records_anonymized: number
  files_deleted: number
  reason: string | null
  cancellation_reason: string | null
  cancelled_at: string | null
  cancelled_by: string | null
  created_at: string
  updated_at: string
}

export interface DeletionResult {
  success: boolean
  requestId?: string
  scheduledAt?: string
  recordsAnonymized?: number
  filesDeleted?: number
  error?: string
}

export interface DeletionSummary {
  recordsAnonymized: number
  filesDeleted: number
  retainedForCompliance: string[]
  anonymizationMap: Record<string, string>
}

// ─────────────────────────────────────────────────────────────
// MAIN FUNCTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Request data deletion (GDPR Article 17)
 * Creates a deletion request and schedules it after grace period
 */
export async function requestDeletion(
  userId: string,
  organizationId: string,
  reason?: string
): Promise<DeletionResult> {
  try {
    const supabase = await createSupabaseServer()

    // Get current user to verify permissions
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Verify user has permission to request deletion
    if (user.id !== userId) {
      // Check if user is admin
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('roles(name)')
        .eq('user_id', user.id)
        .eq('organization_id', organizationId)
        .single()

      const isAdmin = userRole?.roles?.name === 'super_admin' ||
                      userRole?.roles?.name === 'consultant_ssm'

      if (!isAdmin) {
        return { success: false, error: 'Unauthorized: can only request deletion of own data' }
      }
    }

    // Check for existing pending/scheduled requests
    const { data: existingRequest } = await supabase
      .from('gdpr_deletion_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('organization_id', organizationId)
      .in('status', ['pending', 'scheduled'])
      .single()

    if (existingRequest) {
      return {
        success: false,
        error: `Deletion already requested. Scheduled for ${existingRequest.scheduled_execution_at}`
      }
    }

    // Create deletion request with default 30-day grace period
    const gracePeriodDays = 30
    const scheduledAt = new Date()
    scheduledAt.setDate(scheduledAt.getDate() + gracePeriodDays)

    const { data: request, error: insertError } = await supabase
      .from('gdpr_deletion_requests')
      .insert({
        user_id: userId,
        organization_id: organizationId,
        requested_by: user.id,
        status: 'scheduled',
        grace_period_days: gracePeriodDays,
        scheduled_execution_at: scheduledAt.toISOString(),
        reason: reason || null,
      })
      .select()
      .single()

    if (insertError) {
      console.error('[GDPR Deletion] Failed to create request:', insertError)
      return { success: false, error: `Failed to create deletion request: ${insertError.message}` }
    }

    // Log in audit trail
    await logDeletionRequest(userId, organizationId, request.id, 'requested')

    console.log(`[GDPR Deletion] Request created: ${request.id} for user ${userId}`)
    console.log(`[GDPR Deletion] Scheduled execution: ${scheduledAt.toISOString()}`)

    return {
      success: true,
      requestId: request.id,
      scheduledAt: scheduledAt.toISOString(),
    }

  } catch (error) {
    console.error('[GDPR Deletion] Fatal error in requestDeletion:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Schedule deletion for a specific date (admin only)
 * Allows custom grace period
 */
export async function scheduleDeletion(
  requestId: string,
  gracePeriodDays: number = 30
): Promise<DeletionResult> {
  try {
    const supabase = await createSupabaseServer()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get deletion request
    const { data: request, error: fetchError } = await supabase
      .from('gdpr_deletion_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (fetchError || !request) {
      return { success: false, error: 'Deletion request not found' }
    }

    // Verify admin permission
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', user.id)
      .eq('organization_id', request.organization_id)
      .single()

    const isAdmin = userRole?.roles?.name === 'super_admin' ||
                    userRole?.roles?.name === 'consultant_ssm'

    if (!isAdmin) {
      return { success: false, error: 'Unauthorized: admin access required' }
    }

    // Calculate new scheduled date
    const scheduledAt = new Date()
    scheduledAt.setDate(scheduledAt.getDate() + gracePeriodDays)

    // Update request
    const { error: updateError } = await supabase
      .from('gdpr_deletion_requests')
      .update({
        status: 'scheduled',
        grace_period_days: gracePeriodDays,
        scheduled_execution_at: scheduledAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    if (updateError) {
      console.error('[GDPR Deletion] Failed to schedule:', updateError)
      return { success: false, error: `Failed to schedule deletion: ${updateError.message}` }
    }

    // Log in audit trail
    await logDeletionRequest(request.user_id, request.organization_id, requestId, 'scheduled')

    console.log(`[GDPR Deletion] Request ${requestId} scheduled for ${scheduledAt.toISOString()}`)

    return {
      success: true,
      requestId,
      scheduledAt: scheduledAt.toISOString(),
    }

  } catch (error) {
    console.error('[GDPR Deletion] Fatal error in scheduleDeletion:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Execute data deletion (anonymization + file removal)
 * This is the main deletion function that performs the actual data erasure
 */
export async function executeDeletion(requestId: string): Promise<DeletionResult> {
  try {
    const supabase = await createSupabaseServer()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get deletion request
    const { data: request, error: fetchError } = await supabase
      .from('gdpr_deletion_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (fetchError || !request) {
      return { success: false, error: 'Deletion request not found' }
    }

    // Verify status
    if (request.status === 'completed') {
      return { success: false, error: 'Deletion already completed' }
    }

    if (request.status === 'cancelled') {
      return { success: false, error: 'Deletion request was cancelled' }
    }

    // Verify admin permission
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', user.id)
      .eq('organization_id', request.organization_id)
      .single()

    const isAdmin = userRole?.roles?.name === 'super_admin' ||
                    userRole?.roles?.name === 'consultant_ssm'

    if (!isAdmin && user.id !== request.user_id) {
      return { success: false, error: 'Unauthorized: admin access required' }
    }

    // Check if grace period has elapsed
    const now = new Date()
    const scheduledDate = new Date(request.scheduled_execution_at)
    if (now < scheduledDate && !isAdmin) {
      return {
        success: false,
        error: `Cannot execute before grace period ends: ${scheduledDate.toISOString()}`
      }
    }

    console.log(`[GDPR Deletion] Executing deletion for user ${request.user_id}`)

    // Update status to in_progress
    await supabase
      .from('gdpr_deletion_requests')
      .update({
        status: 'in_progress',
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    // Perform deletion
    const summary = await performDeletion(request.user_id, request.organization_id, requestId)

    // Update request with results
    await supabase
      .from('gdpr_deletion_requests')
      .update({
        status: 'completed',
        executed_at: new Date().toISOString(),
        executed_by: user.id,
        records_anonymized: summary.recordsAnonymized,
        files_deleted: summary.filesDeleted,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    // Log completion in audit trail
    await logDeletionRequest(request.user_id, request.organization_id, requestId, 'completed', {
      recordsAnonymized: summary.recordsAnonymized,
      filesDeleted: summary.filesDeleted,
    })

    console.log(`[GDPR Deletion] Deletion completed for request ${requestId}`)
    console.log(`[GDPR Deletion] Records anonymized: ${summary.recordsAnonymized}`)
    console.log(`[GDPR Deletion] Files deleted: ${summary.filesDeleted}`)

    return {
      success: true,
      requestId,
      recordsAnonymized: summary.recordsAnonymized,
      filesDeleted: summary.filesDeleted,
    }

  } catch (error) {
    console.error('[GDPR Deletion] Fatal error in executeDeletion:', error)

    // Update request status to reflect error
    const supabase = await createSupabaseServer()
    await supabase
      .from('gdpr_deletion_requests')
      .update({
        status: 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Cancel a deletion request (before execution)
 */
export async function cancelDeletion(
  requestId: string,
  reason?: string
): Promise<DeletionResult> {
  try {
    const supabase = await createSupabaseServer()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get deletion request
    const { data: request, error: fetchError } = await supabase
      .from('gdpr_deletion_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (fetchError || !request) {
      return { success: false, error: 'Deletion request not found' }
    }

    // Verify permission (user or admin)
    if (user.id !== request.user_id) {
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('roles(name)')
        .eq('user_id', user.id)
        .eq('organization_id', request.organization_id)
        .single()

      const isAdmin = userRole?.roles?.name === 'super_admin' ||
                      userRole?.roles?.name === 'consultant_ssm'

      if (!isAdmin) {
        return { success: false, error: 'Unauthorized' }
      }
    }

    // Check if can be cancelled
    if (request.status === 'completed') {
      return { success: false, error: 'Cannot cancel completed deletion' }
    }

    if (request.status === 'in_progress') {
      return { success: false, error: 'Cannot cancel deletion in progress' }
    }

    // Cancel request
    await supabase
      .from('gdpr_deletion_requests')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancelled_by: user.id,
        cancellation_reason: reason || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    // Log cancellation
    await logDeletionRequest(request.user_id, request.organization_id, requestId, 'cancelled')

    console.log(`[GDPR Deletion] Request ${requestId} cancelled by ${user.id}`)

    return { success: true, requestId }

  } catch (error) {
    console.error('[GDPR Deletion] Fatal error in cancelDeletion:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// ─────────────────────────────────────────────────────────────
// DELETION IMPLEMENTATION
// ─────────────────────────────────────────────────────────────

/**
 * Perform the actual data deletion/anonymization
 * Anonymizes personal data, deletes files, retains statistical data
 */
async function performDeletion(
  userId: string,
  organizationId: string,
  requestId: string
): Promise<DeletionSummary> {
  const supabase = await createSupabaseServer()
  let recordsAnonymized = 0
  let filesDeleted = 0
  const retainedForCompliance: string[] = []
  const anonymizationMap: Record<string, string> = {}

  // Generate anonymized identifiers
  const anonymizedUserId = `DELETED_${crypto.randomBytes(8).toString('hex')}`
  const anonymizedEmail = `deleted_${crypto.randomBytes(6).toString('hex')}@anonymized.local`
  const anonymizedName = 'DELETED USER'
  const anonymizedPhone = null

  anonymizationMap['user_id'] = anonymizedUserId
  anonymizationMap['email'] = anonymizedEmail
  anonymizationMap['name'] = anonymizedName

  console.log(`[GDPR Deletion] Starting anonymization for user ${userId}`)

  // ═══════════════════════════════════════════════════════════
  // 1. ANONYMIZE PROFILE DATA
  // ═══════════════════════════════════════════════════════════

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      full_name: anonymizedName,
      email: anonymizedEmail,
      phone: anonymizedPhone,
      avatar_url: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (!profileError) recordsAnonymized++

  // Delete avatar from storage if exists
  const { data: avatarFiles } = await supabase.storage
    .from('avatars')
    .list(`${userId}`)

  if (avatarFiles && avatarFiles.length > 0) {
    for (const file of avatarFiles) {
      await supabase.storage.from('avatars').remove([`${userId}/${file.name}`])
      filesDeleted++
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 2. ANONYMIZE USER PREFERENCES
  // ═══════════════════════════════════════════════════════════

  await supabase
    .from('user_preferences')
    .delete()
    .eq('user_id', userId)

  // ═══════════════════════════════════════════════════════════
  // 3. SOFT DELETE MEMBERSHIPS (keep for org history)
  // ═══════════════════════════════════════════════════════════

  const { data: memberships } = await supabase
    .from('memberships')
    .update({
      is_active: false,
      deleted_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()

  recordsAnonymized += memberships?.length || 0
  retainedForCompliance.push('memberships (soft deleted for audit)')

  // ═══════════════════════════════════════════════════════════
  // 4. ANONYMIZE EMPLOYEE RECORDS
  // ═══════════════════════════════════════════════════════════

  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single()

  if (profile?.email) {
    const { data: employees } = await supabase
      .from('employees')
      .update({
        name: anonymizedName,
        email: anonymizedEmail,
        phone: anonymizedPhone,
        cnp: null,
        cnp_hash: null,
        address: null,
        personal_data_anonymized: true,
        updated_at: new Date().toISOString(),
      })
      .eq('organization_id', organizationId)
      .eq('email', profile.email)
      .select()

    recordsAnonymized += employees?.length || 0
  }

  // ═══════════════════════════════════════════════════════════
  // 5. ANONYMIZE MEDICAL RECORDS (keep for legal compliance)
  // ═══════════════════════════════════════════════════════════

  const { data: medicalRecords } = await supabase
    .from('medical_records')
    .update({
      employee_name: anonymizedName,
      cnp_hash: null,
      notes: '[ANONYMIZED PER GDPR REQUEST]',
      personal_data_anonymized: true,
      updated_at: new Date().toISOString(),
    })
    .eq('organization_id', organizationId)
    .select()

  recordsAnonymized += medicalRecords?.length || 0
  retainedForCompliance.push('medical_records (anonymized, kept for legal retention)')

  // ═══════════════════════════════════════════════════════════
  // 6. DELETE DOCUMENTS FROM STORAGE
  // ═══════════════════════════════════════════════════════════

  const { data: documents } = await supabase
    .from('generated_documents')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('generated_by', userId)

  if (documents && documents.length > 0) {
    for (const doc of documents) {
      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('documents')
        .remove([doc.storage_path])

      if (!deleteError) filesDeleted++

      // Mark as deleted in database (keep metadata for audit)
      await supabase
        .from('generated_documents')
        .update({
          deleted_at: new Date().toISOString(),
          file_name: '[DELETED]',
        })
        .eq('id', doc.id)
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 7. ANONYMIZE AUDIT LOG (keep actions, remove personal details)
  // ═══════════════════════════════════════════════════════════

  const { data: auditLogs } = await supabase
    .from('audit_log')
    .update({
      ip_address: null,
      user_agent: null,
      details: { anonymized: true, original_user_id: anonymizedUserId },
    })
    .eq('user_id', userId)
    .select()

  recordsAnonymized += auditLogs?.length || 0
  retainedForCompliance.push('audit_log (anonymized, kept for security/compliance)')

  // ═══════════════════════════════════════════════════════════
  // 8. DELETE API KEYS
  // ═══════════════════════════════════════════════════════════

  await supabase
    .from('api_keys')
    .delete()
    .eq('created_by', userId)
    .eq('organization_id', organizationId)

  // ═══════════════════════════════════════════════════════════
  // 9. DELETE WEBHOOKS
  // ═══════════════════════════════════════════════════════════

  await supabase
    .from('webhooks')
    .update({ deleted_at: new Date().toISOString() })
    .eq('created_by', userId)
    .eq('organization_id', organizationId)

  // ═══════════════════════════════════════════════════════════
  // 10. DELETE SSO SESSIONS
  // ═══════════════════════════════════════════════════════════

  await supabase
    .from('sso_sessions')
    .delete()
    .eq('user_id', userId)

  // ═══════════════════════════════════════════════════════════
  // 11. ANONYMIZE NOTIFICATION LOGS
  // ═══════════════════════════════════════════════════════════

  await supabase
    .from('notification_log')
    .update({
      recipient: anonymizedEmail,
      metadata: { anonymized: true },
    })
    .eq('organization_id', organizationId)

  await supabase
    .from('email_delivery_log')
    .delete()
    .eq('user_id', userId)

  await supabase
    .from('whatsapp_delivery_log')
    .delete()
    .eq('user_id', userId)

  // ═══════════════════════════════════════════════════════════
  // 12. DELETE GDPR EXPORTS
  // ═══════════════════════════════════════════════════════════

  const { data: exports } = await supabase.storage
    .from('gdpr-exports')
    .list(`${organizationId}/${userId}`)

  if (exports && exports.length > 0) {
    const paths = exports.map(f => `${organizationId}/${userId}/${f.name}`)
    await supabase.storage.from('gdpr-exports').remove(paths)
    filesDeleted += exports.length
  }

  // ═══════════════════════════════════════════════════════════
  // 13. REVOKE AUTH ACCESS (final step)
  // ═══════════════════════════════════════════════════════════

  // Note: This requires service_role access
  // In production, this should be done via admin API or service function
  console.log(`[GDPR Deletion] User ${userId} should be disabled in Supabase Auth`)
  console.log('[GDPR Deletion] Manual step: Revoke user via Supabase Dashboard or Admin API')

  // Log final deletion summary
  await supabase.from('audit_log').insert({
    organization_id: organizationId,
    user_id: userId,
    action: 'gdpr_data_deletion_completed',
    resource_type: 'user_data',
    resource_id: requestId,
    details: {
      recordsAnonymized,
      filesDeleted,
      retainedForCompliance,
      anonymizationMap,
      completedAt: new Date().toISOString(),
    },
  })

  return {
    recordsAnonymized,
    filesDeleted,
    retainedForCompliance,
    anonymizationMap,
  }
}

// ─────────────────────────────────────────────────────────────
// AUDIT LOGGING
// ─────────────────────────────────────────────────────────────

async function logDeletionRequest(
  userId: string,
  organizationId: string,
  requestId: string,
  action: string,
  details?: Record<string, any>
): Promise<void> {
  const supabase = await createSupabaseServer()

  await supabase.from('audit_log').insert({
    organization_id: organizationId,
    user_id: userId,
    action: `gdpr_deletion_${action}`,
    resource_type: 'deletion_request',
    resource_id: requestId,
    details: {
      ...details,
      timestamp: new Date().toISOString(),
    },
    ip_address: null,
    user_agent: null,
  })
}

// ─────────────────────────────────────────────────────────────
// QUERY FUNCTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Get deletion requests for an organization (admin view)
 */
export async function getDeletionRequests(
  organizationId: string,
  status?: DeletionRequestStatus
): Promise<DeletionRequest[]> {
  const supabase = await createSupabaseServer()

  let query = supabase
    .from('gdpr_deletion_requests')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('[GDPR Deletion] Failed to fetch requests:', error)
    return []
  }

  return data || []
}

/**
 * Get deletion request by ID
 */
export async function getDeletionRequest(requestId: string): Promise<DeletionRequest | null> {
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from('gdpr_deletion_requests')
    .select('*')
    .eq('id', requestId)
    .single()

  if (error) {
    console.error('[GDPR Deletion] Failed to fetch request:', error)
    return null
  }

  return data
}

/**
 * Check if user has pending deletion request
 */
export async function hasPendingDeletion(
  userId: string,
  organizationId: string
): Promise<boolean> {
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from('gdpr_deletion_requests')
    .select('id')
    .eq('user_id', userId)
    .eq('organization_id', organizationId)
    .in('status', ['pending', 'scheduled', 'in_progress'])
    .single()

  return !!data && !error
}

/**
 * Process scheduled deletions (cron job)
 * Executes all deletions where grace period has elapsed
 */
export async function processScheduledDeletions(): Promise<{
  processed: number
  errors: string[]
}> {
  const supabase = await createSupabaseServer()
  let processed = 0
  const errors: string[] = []

  try {
    // Find all scheduled deletions where grace period has elapsed
    const now = new Date().toISOString()
    const { data: requests, error: fetchError } = await supabase
      .from('gdpr_deletion_requests')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_execution_at', now)

    if (fetchError) {
      errors.push(`Failed to fetch scheduled requests: ${fetchError.message}`)
      return { processed: 0, errors }
    }

    // Execute each deletion
    for (const request of requests || []) {
      try {
        const result = await executeDeletion(request.id)
        if (result.success) {
          processed++
          console.log(`[GDPR Deletion Cron] Processed request ${request.id}`)
        } else {
          errors.push(`Request ${request.id}: ${result.error}`)
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        errors.push(`Request ${request.id}: ${message}`)
      }
    }

    console.log(`[GDPR Deletion Cron] Processed ${processed} scheduled deletions`)
    if (errors.length > 0) {
      console.error(`[GDPR Deletion Cron] Errors: ${errors.join(', ')}`)
    }

    return { processed, errors }

  } catch (error) {
    console.error('[GDPR Deletion Cron] Fatal error:', error)
    errors.push(error instanceof Error ? error.message : 'Unknown error')
    return { processed: 0, errors }
  }
}
