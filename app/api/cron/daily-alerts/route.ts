/**
 * app/api/cron/daily-alerts/route.ts
 * Cron job pentru trimitere automată zilnică a alertelor
 * Configurat în vercel.json să ruleze zilnic la 08:00 AM (Europe/Bucharest)
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendPendingAlerts } from '@/lib/email/alert-sender';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[CRON daily-alerts] Starting daily alert batch...');
    const startTime = Date.now();
    
    const result = await sendPendingAlerts();
    
    const duration = Date.now() - startTime;
    
    console.log('[CRON daily-alerts] Completed in', duration, 'ms');
    console.log('[CRON daily-alerts] Stats:', {
      total: result.total,
      sent: result.sent,
      failed: result.failed,
    });

    return NextResponse.json({
      success: true,
      message: 'Daily alerts processed successfully',
      stats: {
        total: result.total,
        sent: result.sent,
        failed: result.failed,
        duration_ms: duration,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[CRON daily-alerts] Error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to process daily alerts',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
