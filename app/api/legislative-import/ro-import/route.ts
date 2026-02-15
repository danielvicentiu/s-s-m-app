import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkAndImportAct, type MonitoredAct } from '@/lib/legislative-import/adapters/ro-adapter';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const actKey = req.nextUrl.searchParams.get('act');
  if (!actKey) {
    return NextResponse.json({ error: 'Missing ?act= parameter' }, { status: 400 });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: act, error } = await supabase
      .from('legal_acts_monitor')
      .select('*')
      .eq('key', actKey)
      .single();

    if (error || !act) {
      return NextResponse.json({ error: `Act "${actKey}" not found in monitor` }, { status: 404 });
    }

    await supabase
      .from('legal_acts_monitor')
      .update({ last_content_hash: null })
      .eq('key', actKey);

    const result = await checkAndImportAct({ ...act, last_content_hash: null } as MonitoredAct);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('[M7 ro-import] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
