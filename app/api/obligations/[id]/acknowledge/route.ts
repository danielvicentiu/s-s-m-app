// app/api/obligations/[id]/acknowledge/route.ts
// API: Acknowledge organization obligation

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { acknowledgeObligation } from '@/lib/services/obligation-publisher';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const obligationId = params.id;
    const body = await request.json();
    const { userId, notes } = body;

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

    // Check if user is member of this organization
    const { data: membership } = await supabase
      .from('memberships')
      .select('id')
      .eq('user_id', userId)
      .eq('organization_id', orgObligation.organization_id)
      .eq('is_active', true)
      .single();

    if (!membership) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Acknowledge the obligation
    await acknowledgeObligation(obligationId, userId, notes);

    return NextResponse.json({
      success: true,
      message: 'Obligation acknowledged successfully'
    });

  } catch (error) {
    console.error('Error acknowledging obligation:', error);
    return NextResponse.json(
      { error: 'Failed to acknowledge obligation' },
      { status: 500 }
    );
  }
}
