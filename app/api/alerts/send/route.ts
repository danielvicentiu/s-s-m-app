/**
 * app/api/alerts/send/route.ts
 * API endpoint pentru trimitere manuală de emailuri de alertă
 * POST /api/alerts/send - trimite alerte pending
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { sendPendingAlerts } from '@/lib/email/alert-sender';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'consultant' && profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acces interzis' },
        { status: 403 }
      );
    }

    console.log('[POST /api/alerts/send] Starting alert email batch...');
    
    const result = await sendPendingAlerts();
    
    console.log('[POST /api/alerts/send] Completed:', result);

    return NextResponse.json({
      success: true,
      message: `Procesare completă: ${result.sent} trimise, ${result.failed} eșuate din ${result.total} total`,
      stats: {
        total: result.total,
        sent: result.sent,
        failed: result.failed,
      },
      results: result.results,
    });
  } catch (error) {
    console.error('[POST /api/alerts/send] Error:', error);
    
    return NextResponse.json(
      {
        error: 'Eroare la trimiterea alertelor',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Folosește POST pentru a trimite alerte pending',
    endpoint: '/api/alerts/send',
    method: 'POST',
  });
}
