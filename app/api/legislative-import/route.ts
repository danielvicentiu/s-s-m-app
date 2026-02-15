// app/api/legislative-import/route.ts
// Manual import trigger — POST to start import, GET for status

import { NextRequest, NextResponse } from 'next/server';
import { ImportPipeline } from '@/lib/legislative-import';
import type { CountryCode } from '@/lib/legislative-import';

const VALID_COUNTRIES: CountryCode[] = ['EU', 'BG', 'HU', 'DE', 'PL', 'RO'];

// POST /api/legislative-import — trigger import
export async function POST(req: NextRequest) {
  try {
    // TODO: Add admin auth check
    // const session = await getServerSession();
    // if (!session?.user?.role === 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { countryCode, sourceId, mode = 'initial' } = body;

    if (!countryCode || !VALID_COUNTRIES.includes(countryCode)) {
      return NextResponse.json(
        { error: `Invalid countryCode. Must be one of: ${VALID_COUNTRIES.join(', ')}` },
        { status: 400 }
      );
    }

    const pipeline = new ImportPipeline();

    // Single act import
    if (sourceId) {
      const result = await pipeline.importSingleAct(countryCode, sourceId);
      return NextResponse.json({
        success: true,
        act: {
          sourceId: result.sourceId,
          titleRo: result.titleRo,
          domains: result.domains,
          ssmRelevanceScore: result.ssmRelevanceScore,
          obligationsCount: result.obligations.length,
        },
      });
    }

    // Full initial import (runs async, returns logId immediately)
    // For production: use a queue (e.g., Inngest, QStash) instead of blocking
    if (mode === 'initial') {
      // Non-blocking: start import and return logId
      const result = await pipeline.runInitialImport(countryCode);
      return NextResponse.json({
        success: true,
        result: {
          logId: result.logId,
          status: result.status,
          actsNew: result.actsNew,
          actsSkipped: result.actsSkipped,
          errors: result.errors.length,
          costEur: result.estimatedCostEur,
          durationSeconds: Math.round(result.duration / 1000),
        },
      });
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  } catch (err) {
    console.error('[api/legislative-import] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}

// GET /api/legislative-import — list recent imports
export async function GET(req: NextRequest) {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const countryCode = req.nextUrl.searchParams.get('country');

    let query = supabase
      .from('legislation_import_log')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(20);

    if (countryCode) {
      query = query.eq('country_code', countryCode);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ imports: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}
