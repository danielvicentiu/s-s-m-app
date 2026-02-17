// app/api/batch/run/route.ts
// M6 BATCH PROCESSING — Manual Batch Run Endpoint
// POST endpoint pentru rulare manuală batch expiry check + alert generation
// Data: 17 Februarie 2026

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { runExpiryCheck } from '@/lib/batch/batch-processor'
import { generateAlerts } from '@/lib/batch/alert-generator'

/**
 * POST /api/batch/run
 * Runs batch expiry check + alert generation
 * Protected: Consultants only
 *
 * Body (optional):
 * {
 *   "organizationId": "uuid" // Optional: specific org, or omit for all orgs
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Neautentificat' },
        { status: 401 }
      )
    }

    // Check if user is consultant
    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'consultant')
      .maybeSingle()

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: 'Acces interzis. Doar consultanții pot rula batch-uri.' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json().catch(() => ({}))
    const organizationId = body.organizationId || null

    console.log('[API /api/batch/run] Starting batch run', {
      userId: user.id,
      organizationId: organizationId || 'ALL'
    })

    // Run expiry check
    const batchResult = await runExpiryCheck(organizationId)

    // Generate alerts from results
    const alertSummary = await generateAlerts(batchResult)

    console.log('[API /api/batch/run] ✓ Batch completed', {
      jobId: batchResult.jobId,
      totalExpired: batchResult.totalExpired,
      totalExpiring: batchResult.totalExpiring,
      totalAlerts: alertSummary.totalAlerts
    })

    return NextResponse.json({
      success: true,
      batch: {
        jobId: batchResult.jobId,
        totalOrgs: batchResult.totalOrgs,
        totalExpired: batchResult.totalExpired,
        totalExpiring: batchResult.totalExpiring,
        errors: batchResult.errors
      },
      alerts: {
        totalAlerts: alertSummary.totalAlerts,
        perOrg: alertSummary.perOrg
      }
    })
  } catch (error) {
    console.error('[API /api/batch/run] Error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Eroare necunoscută'

    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      },
      { status: 500 }
    )
  }
}
