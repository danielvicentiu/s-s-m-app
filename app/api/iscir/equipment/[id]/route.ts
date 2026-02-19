/**
 * API Route: /api/iscir/equipment/[id]
 * GET - Get single ISCIR equipment
 * PUT - Update ISCIR equipment
 * DELETE - Delete ISCIR equipment
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
    }

    const { data: equipment, error } = await supabase
      .from('iscir_equipment')
      .select('*, organizations(id, name, cui)')
      .eq('id', id)
      .single();

    if (error || !equipment) {
      return NextResponse.json({ error: 'Echipament ISCIR negăsit' }, { status: 404 });
    }

    return NextResponse.json({ equipment });
  } catch (error) {
    console.error('Error in GET /api/iscir/equipment/[id]:', error);
    return NextResponse.json(
      { error: 'Eroare la încărcarea echipamentului ISCIR' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
    }

    const body = await request.json();

    // Check if equipment exists and user has access
    const { data: existingEquipment } = await supabase
      .from('iscir_equipment')
      .select('organization_id')
      .eq('id', id)
      .single();

    if (!existingEquipment) {
      return NextResponse.json({ error: 'Echipament ISCIR negăsit' }, { status: 404 });
    }

    // Check permissions
    const { data: membership } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', existingEquipment.organization_id)
      .single();

    if (!membership || !['consultant', 'firma_admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Nu aveți permisiunea de a modifica acest echipament ISCIR' },
        { status: 403 }
      );
    }

    // Update equipment
    const { data: equipment, error } = await supabase
      .from('iscir_equipment')
      .update({
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
        verification_interval_months: body.verification_interval_months,
        authorization_number: body.authorization_number,
        authorization_expiry: body.authorization_expiry,
        status: body.status,
        notes: body.notes,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating ISCIR equipment:', error);
      return NextResponse.json(
        { error: 'Eroare la actualizarea echipamentului ISCIR' },
        { status: 500 }
      );
    }

    return NextResponse.json({ equipment });
  } catch (error) {
    console.error('Error in PUT /api/iscir/equipment/[id]:', error);
    return NextResponse.json(
      { error: 'Eroare la actualizarea echipamentului ISCIR' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
    }

    // Check if equipment exists and user has access
    const { data: existingEquipment } = await supabase
      .from('iscir_equipment')
      .select('organization_id')
      .eq('id', id)
      .single();

    if (!existingEquipment) {
      return NextResponse.json({ error: 'Echipament ISCIR negăsit' }, { status: 404 });
    }

    // Check permissions
    const { data: membership } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', existingEquipment.organization_id)
      .single();

    if (!membership || !['consultant', 'firma_admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Nu aveți permisiunea de a șterge acest echipament ISCIR' },
        { status: 403 }
      );
    }

    // Delete equipment (cascade will delete verifications)
    const { error } = await supabase
      .from('iscir_equipment')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting ISCIR equipment:', error);
      return NextResponse.json(
        { error: 'Eroare la ștergerea echipamentului ISCIR' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/iscir/equipment/[id]:', error);
    return NextResponse.json(
      { error: 'Eroare la ștergerea echipamentului ISCIR' },
      { status: 500 }
    );
  }
}
