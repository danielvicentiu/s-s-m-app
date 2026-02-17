/**
 * API Route: /api/iscir/verifications
 * GET - List ISCIR verifications
 * POST - Create ISCIR verification
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
    const equipmentId = searchParams.get('equipment_id');
    const orgId = searchParams.get('org_id');

    // Build query
    let query = supabase
      .from('iscir_verifications')
      .select('*, iscir_equipment(identifier, equipment_type)')
      .order('verification_date', { ascending: false });

    if (equipmentId) {
      query = query.eq('equipment_id', equipmentId);
    }

    if (orgId && orgId !== 'all') {
      query = query.eq('organization_id', orgId);
    }

    const { data: verifications, error } = await query;

    if (error) {
      console.error('Error fetching ISCIR verifications:', error);
      return NextResponse.json(
        { error: 'Eroare la încărcarea verificărilor ISCIR' },
        { status: 500 }
      );
    }

    return NextResponse.json({ verifications });
  } catch (error) {
    console.error('Error in GET /api/iscir/verifications:', error);
    return NextResponse.json(
      { error: 'Eroare la încărcarea verificărilor ISCIR' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
    }

    const body = await request.json();

    // Validate equipment exists and get organization_id
    const { data: equipment } = await supabase
      .from('iscir_equipment')
      .select('organization_id')
      .eq('id', body.equipment_id)
      .single();

    if (!equipment) {
      return NextResponse.json({ error: 'Echipament ISCIR negăsit' }, { status: 404 });
    }

    // Check permissions
    const { data: membership } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', equipment.organization_id)
      .single();

    if (!membership || !['consultant', 'firma_admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Nu aveți permisiunea de a adăuga verificări ISCIR' },
        { status: 403 }
      );
    }

    // Insert verification
    const { data: verification, error: verificationError } = await supabase
      .from('iscir_verifications')
      .insert({
        equipment_id: body.equipment_id,
        organization_id: equipment.organization_id,
        verification_date: body.verification_date,
        verification_type: body.verification_type,
        inspector_name: body.inspector_name,
        inspector_legitimation: body.inspector_legitimation,
        result: body.result,
        next_verification_date: body.next_verification_date,
        bulletin_number: body.bulletin_number,
        bulletin_storage_path: body.bulletin_storage_path,
        observations: body.observations,
        prescriptions: body.prescriptions,
        deadline_prescriptions: body.deadline_prescriptions,
        created_by: user.id,
      })
      .select()
      .single();

    if (verificationError) {
      console.error('Error creating ISCIR verification:', verificationError);
      return NextResponse.json(
        { error: 'Eroare la crearea verificării ISCIR' },
        { status: 500 }
      );
    }

    // Update equipment with new verification dates
    if (body.next_verification_date) {
      await supabase
        .from('iscir_equipment')
        .update({
          last_verification_date: body.verification_date,
          next_verification_date: body.next_verification_date,
          status: body.result === 'admis' ? 'activ' : 'oprit',
        })
        .eq('id', body.equipment_id);
    }

    return NextResponse.json({ verification }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/iscir/verifications:', error);
    return NextResponse.json(
      { error: 'Eroare la crearea verificării ISCIR' },
      { status: 500 }
    );
  }
}
