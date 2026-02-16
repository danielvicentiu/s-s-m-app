/**
 * API Route: /api/accounting/dashboard
 * GET - Get dashboard statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { AccountingService } from '@/lib/services/accounting-service';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
    }

    // Get user's organization
    const { data: membership } = await supabase
      .from('memberships')
      .select('organization_id')
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Organizație negăsită' }, { status: 404 });
    }

    const accountingService = new AccountingService(supabase);
    const stats = await accountingService.getDashboardStats(membership.organization_id);

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error in GET /api/accounting/dashboard:', error);
    return NextResponse.json(
      { error: 'Eroare la încărcarea statisticilor' },
      { status: 500 }
    );
  }
}
