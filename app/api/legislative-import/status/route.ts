// app/api/legislative-import/status/route.ts
// Status endpoint — check import progress and legislation stats

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const logId = req.nextUrl.searchParams.get('logId');

    // If logId provided, return specific import status
    if (logId) {
      const { data: log } = await supabase
        .from('legislation_import_log')
        .select('*')
        .eq('id', logId)
        .single();

      return NextResponse.json({ import: log });
    }

    // Otherwise return overall stats
    const { data: stats } = await supabase
      .from('legislation_stats') // This is our VIEW
      .select('*');

    const { data: recentImports } = await supabase
      .from('legislation_import_log')
      .select('id, country_code, run_type, status, started_at, completed_at, acts_new, acts_updated, errors')
      .order('started_at', { ascending: false })
      .limit(10);

    const { count: totalActs } = await supabase
      .from('legislation')
      .select('*', { count: 'exact', head: true });

    const { count: pendingReview } = await supabase
      .from('legislation')
      .select('*', { count: 'exact', head: true })
      .eq('review_status', 'unreviewed');

    return NextResponse.json({
      overview: {
        totalActs: totalActs || 0,
        pendingReview: pendingReview || 0,
      },
      statsByCountry: stats || [],
      recentImports: recentImports || [],
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}
