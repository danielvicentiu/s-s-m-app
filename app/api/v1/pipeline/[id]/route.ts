/**
 * API: /api/v1/pipeline/[id]
 *
 * GET   - Get job details
 * PATCH - Update job (retry, cancel, etc.)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getJobStatus, retryJob } from '@/lib/services/batch-processor'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials')
  }

  return createClient(supabaseUrl, supabaseKey)
}

/**
 * GET /api/v1/pipeline/[id]
 * Get job details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    const job = await getJobStatus(jobId)

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      job
    })

  } catch (error) {
    console.error('[API Pipeline] GET job error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch job',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/v1/pipeline/[id]
 * Update job (retry, cancel, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { action } = body

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    // Handle different actions
    switch (action) {
      case 'retry':
        await retryJob(jobId)
        return NextResponse.json({
          success: true,
          message: 'Job queued for retry'
        })

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('[API Pipeline] PATCH job error:', error)
    return NextResponse.json(
      {
        error: 'Failed to update job',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
