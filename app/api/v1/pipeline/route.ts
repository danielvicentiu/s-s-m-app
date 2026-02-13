/**
 * API: /api/v1/pipeline
 *
 * GET  - List all pipeline jobs
 * POST - Queue a new act for processing
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { queueAct, getQueueStats } from '@/lib/services/batch-processor'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials')
  }

  return createClient(supabaseUrl, supabaseKey)
}

/**
 * GET /api/v1/pipeline
 * List all pipeline jobs with stats
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()

    // Fetch all jobs ordered by created_at descending
    const { data: jobs, error } = await supabase
      .from('pipeline_jobs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch jobs: ${error.message}`)
    }

    // Get queue stats
    const stats = await getQueueStats()

    return NextResponse.json({
      success: true,
      jobs: jobs || [],
      stats
    })

  } catch (error) {
    console.error('[API Pipeline] GET error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch pipeline data',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/v1/pipeline
 * Queue a new act for processing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, title } = body

    // Validation
    if (!url || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: url and title' },
        { status: 400 }
      )
    }

    if (typeof url !== 'string' || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Invalid field types: url and title must be strings' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Queue the act
    const job = await queueAct(url, title)

    return NextResponse.json({
      success: true,
      message: 'Act queued successfully',
      job
    })

  } catch (error) {
    console.error('[API Pipeline] POST error:', error)
    return NextResponse.json(
      {
        error: 'Failed to queue act',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
