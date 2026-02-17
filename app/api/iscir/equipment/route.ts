/**
 * API Route: /api/iscir/equipment
 * GET - List ISCIR equipment
 * POST - Create ISCIR equipment
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
    const status = searchParams.get('status');
    const equipmentType = searchParams.get('equipment_type');

    // Build query
    let query = supabase
      .from('iscir_equipment')
      .select('*, organizations(id, name, cui)')
      .order('next_verification_date', { ascending: true });

    if (orgId && orgId !== 'all') {
      query = query.eq('organization_id', orgId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (equipmentType) {
      query = query.eq('equipment_type', equipmentType);
    }

    const { data: equipment, error } = await query;

    if (error) {
      console.error('Error fetching ISCIR equipment:', error);
      return NextResponse.json(
        { error: 'Eroare la încărcarea echipamentelor ISCIR' },
        { status: 500 }
      );
    }

    return NextResponse.json({ equipment });
  } catch (error) {
    console.error('Error in GET /api/iscir/equipment:', error);
    return NextResponse.json(
      { error: 'Eroare la încărcarea echipamentelor ISCIR' },
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

    // Validate organization membership
    const { data: membership } = await supabase
      .from('memberships')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .eq('organization_id', body.organization_id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Organizație negăsită' }, { status: 404 });
    }

    // Check permissions
    if (!['consultant', 'firma_admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Nu aveți permisiunea de a adăuga echipamente ISCIR' },
        { status: 403 }
      );
    }

    // Insert equipment
    const { data: equipment, error } = await supabase
      .from('iscir_equipment')
      .insert({
        organization_id: body.organization_id,
        equipment_type: body.equipment_type,
        registration_number: body.registration_number,
        identifier: body.identifier,
        manufacturer: body.manufacturer,
        model: body.model,
        serial_number: body.serial_number,
        manufacture_year: body.manufacture_year,
        installation_date: body.installation_date,
        location: body.location,
        capacity: body.capacity,
        rsvti_responsible: body.rsvti_responsible,
        last_verification_date: body.last_verification_date,
        next_verification_date: body.next_verification_date,
        verification_interval_months: body.verification_interval_months || 12,
        authorization_number: body.authorization_number,
        authorization_expiry: body.authorization_expiry,
        status: body.status || 'activ',
        notes: body.notes,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating ISCIR equipment:', error);
      return NextResponse.json(
        { error: 'Eroare la crearea echipamentului ISCIR' },
        { status: 500 }
      );
    }

    return NextResponse.json({ equipment }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/iscir/equipment:', error);
    return NextResponse.json(
      { error: 'Eroare la crearea echipamentului ISCIR' },
      { status: 500 }
    );
  }
}
