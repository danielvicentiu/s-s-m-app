// S-S-M.RO — CRON: Raport lunar SSM
// GET /api/cron/monthly-report — Vercel Cron: 1 ale lunii la 08:00 (0 8 1 * *)
// Generează și trimite raport lunar pentru fiecare organizație cu rapoarte activate

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateMonthlyReport } from '@/lib/alerts/alertService'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(request: Request) {
  // Verificare CRON_SECRET
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[CRON monthly-report] Start:', new Date().toISOString())
  const startTime = Date.now()

  try {
    const supabase = getSupabase()

    // Fetch organizații cu rapoarte lunare activate
    const { data: configs, error } = await supabase
      .from('alert_configurations')
      .select('organization_id')
      .eq('monthly_report_enabled', true)

    if (error) {
      console.error('[CRON monthly-report] Config error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!configs || configs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nicio organizație cu rapoarte activate',
      })
    }

    let sent = 0
    let failed = 0

    for (const config of configs) {
      try {
        await generateMonthlyReport(config.organization_id)
        sent++
      } catch (err) {
        console.error(`[CRON monthly-report] Error for org ${config.organization_id}:`, err)
        failed++
      }
    }

    const duration = Date.now() - startTime
    console.log(`[CRON monthly-report] Done: ${sent} trimise, ${failed} eșuate, ${duration}ms`)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      reports_sent: sent,
      reports_failed: failed,
      duration_ms: duration,
    })
  } catch (error) {
    console.error('[CRON monthly-report] Fatal error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
