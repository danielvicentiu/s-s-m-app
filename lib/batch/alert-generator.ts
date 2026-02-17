// lib/batch/alert-generator.ts
// M6 BATCH PROCESSING — Alert Generator
// Generează alerte din rezultatele batch expiry check
// Data: 17 Februarie 2026

import { createSupabaseServer } from '@/lib/supabase/server'
import type { BatchResult, AlertSummary, ExpiryCheckResult } from '@/lib/types'

/**
 * Generates alerts from batch expiry check results
 * Since there's no dedicated 'alerts' table yet, we store alerts in batch_jobs.results
 * In the future, this can be extended to write to a dedicated alerts table
 *
 * @param batchResult - Result from runExpiryCheck()
 * @returns AlertSummary with total alerts and per-org breakdown
 */
export async function generateAlerts(batchResult: BatchResult): Promise<AlertSummary> {
  const supabase = await createSupabaseServer()

  console.log('[ALERTS] Generating alerts for batch job:', batchResult.jobId)

  // Get the full batch job with organization details
  const { data: batchJob, error: batchError } = await supabase
    .from('batch_jobs')
    .select('*')
    .eq('id', batchResult.jobId)
    .single()

  if (batchError || !batchJob) {
    console.error('[ALERTS] Failed to fetch batch job:', batchError)
    throw new Error('Nu s-a putut citi job-ul batch')
  }

  const results = batchJob.results as any
  const organizations: ExpiryCheckResult[] = results.organizations || []

  let totalAlerts = 0
  const perOrg: Record<string, number> = {}
  const alertDetails: Array<{
    organizationId: string
    organizationName: string
    alertCount: number
    categories: {
      medical: { expired: number; expiring: number }
      equipment: { expired: number; expiring: number }
      iscir: { expired: number; expiring: number }
      psi: { expired: number; expiring: number }
    }
    priority: 'info' | 'warning' | 'critical' | 'urgent'
  }> = []

  for (const org of organizations) {
    const orgAlertCount =
      org.totalExpired + org.totalExpiring

    if (orgAlertCount > 0) {
      totalAlerts += orgAlertCount
      perOrg[org.organizationId] = orgAlertCount

      // Determine priority based on expired items
      let priority: 'info' | 'warning' | 'critical' | 'urgent' = 'info'
      if (org.totalExpired > 10) {
        priority = 'urgent'
      } else if (org.totalExpired > 5) {
        priority = 'critical'
      } else if (org.totalExpired > 0) {
        priority = 'warning'
      } else if (org.totalExpiring > 0) {
        priority = 'info'
      }

      alertDetails.push({
        organizationId: org.organizationId,
        organizationName: org.organizationName,
        alertCount: orgAlertCount,
        categories: {
          medical: {
            expired: org.medicalExpired,
            expiring: org.medicalExpiring
          },
          equipment: {
            expired: org.equipmentExpired,
            expiring: org.equipmentExpiring
          },
          iscir: {
            expired: org.iscirExpired,
            expiring: org.iscirExpiring
          },
          psi: {
            expired: org.psiExpired,
            expiring: org.psiExpiring
          }
        },
        priority
      })

      console.log(`[ALERTS] ${org.organizationName}: ${orgAlertCount} alerts (${priority})`)
    }
  }

  // Create an alert generation batch job to track these alerts
  const { error: alertJobError } = await supabase
    .from('batch_jobs')
    .insert({
      organization_id: batchJob.organization_id,
      job_type: 'alert_generation',
      status: 'completed',
      total_items: totalAlerts,
      processed_items: totalAlerts,
      failed_items: 0,
      results: {
        sourceJobId: batchResult.jobId,
        totalAlerts,
        perOrg,
        alertDetails,
        generatedAt: new Date().toISOString()
      },
      completed_at: new Date().toISOString()
    })

  if (alertJobError) {
    console.error('[ALERTS] Failed to create alert job:', alertJobError)
    // Don't throw - this is not critical
  }

  console.log('[ALERTS] ✓ Alert generation completed', {
    totalAlerts,
    organizations: Object.keys(perOrg).length
  })

  return {
    totalAlerts,
    perOrg
  }
}

/**
 * Get alerts for a specific organization from the latest batch
 */
export async function getOrganizationAlerts(organizationId: string): Promise<any> {
  const supabase = await createSupabaseServer()

  // Get the latest alert_generation job for this org
  const { data: alertJob, error } = await supabase
    .from('batch_jobs')
    .select('*')
    .eq('job_type', 'alert_generation')
    .or(`organization_id.eq.${organizationId},organization_id.is.null`)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !alertJob) {
    console.warn('[ALERTS] No alerts found for org:', organizationId)
    return null
  }

  const results = alertJob.results as any
  const alertDetails = results.alertDetails || []

  // Find this org's alerts
  const orgAlert = alertDetails.find((a: any) => a.organizationId === organizationId)

  return orgAlert || null
}

/**
 * Get summary of all recent alerts (last 24 hours)
 */
export async function getRecentAlertsSummary(): Promise<{
  totalAlerts: number
  criticalOrgs: number
  timestamp: string
}> {
  const supabase = await createSupabaseServer()

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const { data: recentJobs, error } = await supabase
    .from('batch_jobs')
    .select('*')
    .eq('job_type', 'alert_generation')
    .eq('status', 'completed')
    .gte('created_at', yesterday.toISOString())
    .order('created_at', { ascending: false })
    .limit(1)

  if (error || !recentJobs || recentJobs.length === 0) {
    return {
      totalAlerts: 0,
      criticalOrgs: 0,
      timestamp: new Date().toISOString()
    }
  }

  const latestJob = recentJobs[0]
  const results = latestJob.results as any
  const alertDetails = results.alertDetails || []

  const criticalOrgs = alertDetails.filter(
    (a: any) => a.priority === 'critical' || a.priority === 'urgent'
  ).length

  return {
    totalAlerts: results.totalAlerts || 0,
    criticalOrgs,
    timestamp: latestJob.created_at
  }
}
