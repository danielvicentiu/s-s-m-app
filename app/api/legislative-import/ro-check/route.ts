// ============================================================
// app/api/legislative-import/ro-check/route.ts
// Manual trigger: check all monitored RO acts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { checkAllMonitoredActs } from '@/lib/legislative-import/adapters/ro-adapter';
import { sendChangeNotification } from '@/lib/legislative-import/notification-service';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  // Auth: cron secret or admin
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = await checkAllMonitoredActs();
    await sendChangeNotification(results);

    return NextResponse.json({
      success: true,
      total: results.length,
      updated: results.filter((r) => r.status === 'updated').length,
      new_acts: results.filter((r) => r.status === 'new').length,
      errors: results.filter((r) => r.status === 'error').length,
      results,
    });
  } catch (error) {
    console.error('[M7 ro-check] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
