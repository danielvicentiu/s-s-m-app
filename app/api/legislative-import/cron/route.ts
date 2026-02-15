// app/api/legislative-import/cron/route.ts
// Vercel Cron endpoint — weekly update check
// vercel.json config: { "crons": [{ "path": "/api/legislative-import/cron", "schedule": "0 3 * * 1" }] }

import { NextRequest, NextResponse } from 'next/server';
import { UpdateCheckPipeline } from '@/lib/legislative-import';
import { checkAllMonitoredActs } from '@/lib/legislative-import/adapters/ro-adapter';
import { sendChangeNotification } from '@/lib/legislative-import/notification-service';

export const maxDuration = 300; // 5 min max for Vercel Pro

export async function GET(req: NextRequest) {
  // Verify cron secret (Vercel sends this header)
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[cron] Starting weekly legislation update check...');
    
    const pipeline = new UpdateCheckPipeline();
    const results = await pipeline.checkAll();

    const summary = results.map((r) => ({
      country: r.countryCode,
      checked: r.totalChecked,
      updates: r.updatesFound,
      applied: r.updatesApplied,
      errors: r.errors.length,
      durationSec: Math.round(r.duration / 1000),
    }));

    console.log('[cron] Update check complete:', JSON.stringify(summary));

    try {
      const roResults = await checkAllMonitoredActs();
      await sendChangeNotification(roResults);
    } catch (roError) {
      console.error('[M7 Cron] RO monitoring error:', roError);
    }

    return NextResponse.json({ success: true, results: summary });
  } catch (err) {
    console.error('[cron] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Cron failed' },
      { status: 500 }
    );
  }
}
