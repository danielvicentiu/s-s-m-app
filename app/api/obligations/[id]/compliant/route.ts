// app/api/obligations/[id]/compliant/route.ts
// API: Mark organization obligation as compliant

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { markCompliant } from '@/lib/services/obligation-publisher';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const obligationId = params.id;
    const body = await request.json();
    const { userId, notes, evidenceUrls } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Verify user has access to this obligation's organization
    const supabase = await createSupabaseServer();
    const { data: orgObligation } = await supabase
      .from('organization_obligations')
      .select('organization_id')
      .eq('id', obligationId)
      .single();

    if (!orgObligation) {
      return NextResponse.json(
        { error: 'Obligation not found' },
        { status: 404 }
      );
    }

    // Check if user is member of this organization with consultant or firma_admin role
    const { data: membership } = await supabase
      .from('memberships')
      .select('id, role')
      .eq('user_id', userId)
      .eq('organization_id', orgObligation.organization_id)
      .eq('is_active', true)
      .single();

    if (!membership || !['consultant', 'firma_admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Mark as compliant
    await markCompliant(obligationId, userId, notes, evidenceUrls);

    return NextResponse.json({
      success: true,
      message: 'Obligation marked as compliant successfully'
    });

  } catch (error) {
    console.error('Error marking obligation compliant:', error);
    return NextResponse.json(
      { error: 'Failed to mark obligation as compliant' },
      { status: 500 }
    );
  }
}
