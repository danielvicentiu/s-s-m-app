/**
 * API Route: /api/iscir/alerts
 * GET - Get expiring ISCIR equipment alerts
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
    }

    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const orgId = searchParams.get('org_id');
    const alertLevel = searchParams.get('alert_level'); // expirat, urgent, atentie

    // Build query - use the view for alerts
    let query = supabase
      .from('v_iscir_expiring')
      .select('*')
      .order('days_until_expiry', { ascending: true });

    if (orgId && orgId !== 'all') {
      query = query.eq('organization_id', orgId);
    }

    if (alertLevel) {
      query = query.eq('alert_level', alertLevel);
    }

    const { data: alerts, error } = await query;

    if (error) {
      console.error('Error fetching ISCIR alerts:', error);
      return NextResponse.json(
        { error: 'Eroare la încărcarea alertelor ISCIR' },
        { status: 500 }
      );
    }

    // Calculate statistics
    const stats = {
      expirat: alerts?.filter((a) => a.alert_level === 'expirat').length || 0,
      urgent: alerts?.filter((a) => a.alert_level === 'urgent').length || 0,
      atentie: alerts?.filter((a) => a.alert_level === 'atentie').length || 0,
      total: alerts?.length || 0,
    };

    return NextResponse.json({ alerts, stats });
  } catch (error) {
    console.error('Error in GET /api/iscir/alerts:', error);
    return NextResponse.json(
      { error: 'Eroare la încărcarea alertelor ISCIR' },
      { status: 500 }
    );
  }
}
