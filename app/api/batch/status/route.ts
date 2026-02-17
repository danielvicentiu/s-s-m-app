// app/api/batch/status/route.ts
// M6 BATCH PROCESSING — Batch Status Endpoint
// GET endpoint pentru verificare status batch jobs
// Data: 17 Februarie 2026

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

/**
 * GET /api/batch/status
 * Returns batch job status
 *
 * Query params:
 * - jobId: specific job ID to fetch
 * - If no jobId, returns last 10 batch jobs
 *
 * Protected: Consultants see all, org admins see their org's jobs
 */
export async function GET(request: NextRequest) {
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

    // Get user's role
    const { data: membership } = await supabase
      .from('memberships')
      .select('role, organization_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!membership) {
      return NextResponse.json(
        { error: 'Nu aveți access la batch jobs' },
        { status: 403 }
      )
    }

    const isConsultant = membership.role === 'consultant'
    const searchParams = request.nextUrl.searchParams
    const jobId = searchParams.get('jobId')

    // If specific jobId requested
    if (jobId) {
      const { data: job, error: jobError } = await supabase
        .from('batch_jobs')
        .select('*')
        .eq('id', jobId)
        .single()

      if (jobError || !job) {
        return NextResponse.json(
          { error: 'Job nu a fost găsit' },
          { status: 404 }
        )
      }

      // Check access: consultants see all, others see only their org
      if (!isConsultant && job.organization_id !== membership.organization_id) {
        return NextResponse.json(
          { error: 'Acces interzis' },
          { status: 403 }
        )
      }

      return NextResponse.json({
        success: true,
        job
      })
    }

    // Return last 10 jobs
    let query = supabase
      .from('batch_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    // If not consultant, filter by org
    if (!isConsultant) {
      query = query.or(`organization_id.eq.${membership.organization_id},organization_id.is.null`)
    }

    const { data: jobs, error: jobsError } = await query

    if (jobsError) {
      throw new Error(jobsError.message)
    }

    return NextResponse.json({
      success: true,
      jobs: jobs || [],
      count: jobs?.length || 0
    })
  } catch (error) {
    console.error('[API /api/batch/status] Error:', error)

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
