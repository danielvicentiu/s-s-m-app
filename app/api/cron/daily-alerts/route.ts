// S-S-M.RO — Daily Alerts Cron Job
// GET /api/cron/daily-alerts - rulează zilnic trimiterile automate de alerte
// Vercel Cron: luni 7:00 AM (0 7 * * 1)

import { NextResponse } from 'next/server'
import { sendAllOrganizationAlerts } from '@/lib/email/alert-sender'

export async function GET(request: Request) {
  try {
    // Verificăm Authorization header pentru securitate
    const authHeader = request.headers.get('authorization')

    if (process.env.CRON_SECRET) {
      const expectedAuth = `Bearer ${process.env.CRON_SECRET}`
      if (authHeader !== expectedAuth) {
        return NextResponse.json(
          { error: 'Unauthorized - invalid CRON_SECRET' },
          { status: 401 }
        )
      }
    }

    console.log('[CRON] Starting daily alerts job...')
    const startTime = Date.now()

    // Trimitem alertele pentru toate organizațiile
    const result = await sendAllOrganizationAlerts()

    const duration = Date.now() - startTime

    console.log('[CRON] Daily alerts job completed:', {
      duration: `${duration}ms`,
      result,
    })

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      duration,
      result,
    })
  } catch (error) {
    console.error('[CRON] Error in daily alerts job:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run daily alerts job',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
