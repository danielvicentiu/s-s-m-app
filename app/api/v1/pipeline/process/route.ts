/**
 * API: /api/v1/pipeline/process
 *
 * POST - Process all queued jobs
 */

import { NextRequest, NextResponse } from 'next/server'
import { processQueue } from '@/lib/services/batch-processor'

/**
 * POST /api/v1/pipeline/process
 * Start processing all queued jobs
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[API Pipeline] Starting queue processing')

    // Start processing in background
    // Note: In production, this should be handled by a worker or background job
    processQueue().catch(error => {
      console.error('[API Pipeline] Background processing error:', error)
    })

    return NextResponse.json({
      success: true,
      message: 'Queue processing started'
    })

  } catch (error) {
    console.error('[API Pipeline] Process error:', error)
    return NextResponse.json(
      {
        error: 'Failed to start queue processing',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

// Allow longer execution time for processing
export const maxDuration = 60
