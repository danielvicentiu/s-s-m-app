// lib/batch/batch-processor.ts
// M6 BATCH PROCESSING — Expiry Check Processor
// Verifică expirări în medical_examinations, equipment_checks, iscir_equipment, psi_equipment
// Data: 17 Februarie 2026

import { createSupabaseServer } from '@/lib/supabase/server'
import type { BatchResult, ExpiryCheckResult } from '@/lib/types'

const EXPIRY_WARNING_DAYS = 30
const ORGANIZATION_TIMEOUT_MS = 30000 // 30 seconds per org

interface TableExpiryResult {
  expired: number
  expiring: number
}

/**
 * Main batch processor: runs expiry check for all organizations or specific org
 * @param organizationId - Optional: specific org ID, or null for all orgs
 * @returns BatchResult with job ID, totals, and errors
 */
export async function runExpiryCheck(
  organizationId?: string | null
): Promise<BatchResult> {
  const supabase = await createSupabaseServer()

  console.log('[BATCH] Starting expiry check', { organizationId: organizationId || 'ALL' })

  // Create batch job record
  const { data: batchJob, error: batchError } = await supabase
    .from('batch_jobs')
    .insert({
      organization_id: organizationId || null,
      job_type: 'expiry_check',
      status: 'processing',
      total_items: 0,
      processed_items: 0,
      failed_items: 0,
      results: {}
    })
    .select()
    .single()

  if (batchError || !batchJob) {
    console.error('[BATCH] Failed to create batch job:', batchError)
    throw new Error('Nu s-a putut crea job batch')
  }

  const jobId = batchJob.id

  try {
    // Get organizations to process
    let orgsQuery = supabase.from('organizations').select('id, name, cui')

    if (organizationId) {
      orgsQuery = orgsQuery.eq('id', organizationId)
    }

    const { data: organizations, error: orgsError } = await orgsQuery

    if (orgsError) {
      throw new Error(`Eroare la citire organizații: ${orgsError.message}`)
    }

    if (!organizations || organizations.length === 0) {
      console.warn('[BATCH] No organizations found')
      await supabase
        .from('batch_jobs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          results: {
            message: 'No organizations to process'
          }
        })
        .eq('id', jobId)

      return {
        jobId,
        totalOrgs: 0,
        totalExpired: 0,
        totalExpiring: 0,
        errors: []
      }
    }

    console.log(`[BATCH] Processing ${organizations.length} organizations`)

    // Update total items
    await supabase
      .from('batch_jobs')
      .update({ total_items: organizations.length })
      .eq('id', jobId)

    const results: ExpiryCheckResult[] = []
    const errors: BatchResult['errors'] = []
    let totalExpired = 0
    let totalExpiring = 0
    let processedCount = 0

    // Process each organization
    for (const org of organizations) {
      try {
        console.log(`[BATCH] Processing org: ${org.name} (${org.id})`)

        const result = await Promise.race([
          checkOrganizationExpiry(org.id, org.name),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), ORGANIZATION_TIMEOUT_MS)
          )
        ])

        results.push(result)
        totalExpired += result.totalExpired
        totalExpiring += result.totalExpiring
        processedCount++

        // Update progress
        await supabase
          .from('batch_jobs')
          .update({ processed_items: processedCount })
          .eq('id', jobId)

        console.log(`[BATCH] ✓ ${org.name}: ${result.totalExpired} expired, ${result.totalExpiring} expiring`)
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        console.error(`[BATCH] ✗ Error processing ${org.name}:`, errorMsg)

        errors.push({
          organizationId: org.id,
          organizationName: org.name,
          error: errorMsg
        })

        // Increment failed items but continue
        await supabase
          .from('batch_jobs')
          .update({
            processed_items: processedCount,
            failed_items: errors.length
          })
          .eq('id', jobId)
      }
    }

    // Mark batch as completed
    const finalResults = {
      totalOrgs: organizations.length,
      totalExpired,
      totalExpiring,
      processedOrgs: processedCount,
      failedOrgs: errors.length,
      organizations: results,
      errors
    }

    await supabase
      .from('batch_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        results: finalResults
      })
      .eq('id', jobId)

    console.log('[BATCH] ✓ Expiry check completed', {
      totalOrgs: organizations.length,
      totalExpired,
      totalExpiring,
      errors: errors.length
    })

    return {
      jobId,
      totalOrgs: organizations.length,
      totalExpired,
      totalExpiring,
      errors
    }
  } catch (error) {
    // Mark batch as failed
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[BATCH] Batch job failed:', errorMsg)

    await supabase
      .from('batch_jobs')
      .update({
        status: 'failed',
        error_message: errorMsg,
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId)

    throw error
  }
}

/**
 * Check expiry for a single organization across all tables
 */
async function checkOrganizationExpiry(
  organizationId: string,
  organizationName: string
): Promise<ExpiryCheckResult> {
  const supabase = await createSupabaseServer()
  const today = new Date().toISOString().split('T')[0]
  const warningDate = new Date()
  warningDate.setDate(warningDate.getDate() + EXPIRY_WARNING_DAYS)
  const warningDateStr = warningDate.toISOString().split('T')[0]

  // Check medical_examinations
  const medical = await checkTableExpiry(supabase, 'medical_examinations', {
    organizationId,
    expiryColumn: 'expiry_date',
    today,
    warningDate: warningDateStr
  })

  // Check equipment_checks (safety_equipment)
  const equipment = await checkTableExpiry(supabase, 'safety_equipment', {
    organizationId,
    expiryColumn: 'expiry_date',
    today,
    warningDate: warningDateStr
  })

  // Check iscir_equipment
  const iscir = await checkTableExpiry(supabase, 'iscir_equipment', {
    organizationId,
    expiryColumn: 'next_verification_date',
    today,
    warningDate: warningDateStr
  })

  // Check psi_equipment
  const psi = await checkTableExpiry(supabase, 'psi_equipment', {
    organizationId,
    expiryColumn: 'next_inspection_date',
    today,
    warningDate: warningDateStr
  })

  const totalExpired = medical.expired + equipment.expired + iscir.expired + psi.expired
  const totalExpiring = medical.expiring + equipment.expiring + iscir.expiring + psi.expiring

  return {
    organizationId,
    organizationName,
    medicalExpired: medical.expired,
    medicalExpiring: medical.expiring,
    equipmentExpired: equipment.expired,
    equipmentExpiring: equipment.expiring,
    iscirExpired: iscir.expired,
    iscirExpiring: iscir.expiring,
    psiExpired: psi.expired,
    psiExpiring: psi.expiring,
    totalExpired,
    totalExpiring
  }
}

/**
 * Generic helper to check expiry in any table
 */
async function checkTableExpiry(
  supabase: any,
  tableName: string,
  params: {
    organizationId: string
    expiryColumn: string
    today: string
    warningDate: string
  }
): Promise<TableExpiryResult> {
  try {
    // Check if table exists and has the expiry column
    const { data: expiredData, error: expiredError } = await supabase
      .from(tableName)
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', params.organizationId)
      .lt(params.expiryColumn, params.today)

    const { data: expiringData, error: expiringError } = await supabase
      .from(tableName)
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', params.organizationId)
      .gte(params.expiryColumn, params.today)
      .lte(params.expiryColumn, params.warningDate)

    // If table doesn't exist or column doesn't exist, return zeros
    if (expiredError || expiringError) {
      console.warn(`[BATCH] Table ${tableName} check skipped:`, expiredError?.message || expiringError?.message)
      return { expired: 0, expiring: 0 }
    }

    return {
      expired: expiredData?.length || 0,
      expiring: expiringData?.length || 0
    }
  } catch (error) {
    console.warn(`[BATCH] Error checking ${tableName}:`, error)
    return { expired: 0, expiring: 0 }
  }
}
