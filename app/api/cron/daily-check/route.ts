// app/api/cron/daily-check/route.ts
// M6 BATCH PROCESSING — Daily Cron Job Endpoint
// GET endpoint pentru Vercel Cron Jobs - verificare zilnică expirări
// Data: 17 Februarie 2026

import { NextRequest, NextResponse } from 'next/server'
import { runExpiryCheck } from '@/lib/batch/batch-processor'
import { generateAlerts } from '@/lib/batch/alert-generator'

/**
 * GET /api/cron/daily-check
 * Daily cron job that runs expiry check + alert generation for ALL organizations
 *
 * Protected by Authorization header: Bearer CRON_SECRET
 * Configured in vercel.json crons
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    const expectedToken = `Bearer ${process.env.CRON_SECRET}`

    if (!authHeader || authHeader !== expectedToken) {
      console.warn('[CRON /api/cron/daily-check] Unauthorized attempt')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('[CRON /api/cron/daily-check] Starting daily expiry check')

    const startTime = Date.now()

    // Run expiry check for ALL organizations
    const batchResult = await runExpiryCheck(null)

    // Generate alerts from results
    const alertSummary = await generateAlerts(batchResult)

    const duration = Date.now() - startTime

    console.log('[CRON /api/cron/daily-check] ✓ Daily check completed', {
      jobId: batchResult.jobId,
      duration: `${duration}ms`,
      totalOrgs: batchResult.totalOrgs,
      totalExpired: batchResult.totalExpired,
      totalExpiring: batchResult.totalExpiring,
      totalAlerts: alertSummary.totalAlerts,
      errors: batchResult.errors.length
    })

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      duration,
      batch: {
        jobId: batchResult.jobId,
        totalOrgs: batchResult.totalOrgs,
        totalExpired: batchResult.totalExpired,
        totalExpiring: batchResult.totalExpiring,
        errors: batchResult.errors.length
      },
      alerts: {
        totalAlerts: alertSummary.totalAlerts,
        organizations: Object.keys(alertSummary.perOrg).length
      }
    })
  } catch (error) {
    console.error('[CRON /api/cron/daily-check] Error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

/**
 * Runtime configuration for Vercel
 * Increase max duration for batch processing
 */
export const maxDuration = 120 // 2 minutes
export const dynamic = 'force-dynamic'
