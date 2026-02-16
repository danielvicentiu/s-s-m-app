/**
 * API Route: /api/accounting/contracts/[id]
 * GET - Get contract details
 * PATCH - Update contract
 * DELETE - Soft delete contract
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { AccountingService } from '@/lib/services/accounting-service';
import { UpdateContractInput } from '@/lib/services/accounting-types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
    }

    const accountingService = new AccountingService(supabase);
    const contract = await accountingService.getContractById(params.id);

    if (!contract) {
      return NextResponse.json({ error: 'Contract negăsit' }, { status: 404 });
    }

    // Get deadlines for this contract
    const deadlines = await accountingService.getDeadlines(contract.org_id, {
      contract_id: params.id,
    });

    return NextResponse.json({ contract, deadlines });
  } catch (error) {
    console.error('Error in GET /api/accounting/contracts/[id]:', error);
    return NextResponse.json(
      { error: 'Eroare la încărcarea contractului' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
    }

    // Get user's organization and role
    const { data: membership } = await supabase
      .from('memberships')
      .select('org_id, role')
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Organizație negăsită' }, { status: 404 });
    }

    // Check permissions
    if (!['consultant', 'firma_admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Nu aveți permisiunea de a modifica contracte' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const updateInput: UpdateContractInput = {};
    if (body.client_name !== undefined) updateInput.client_name = body.client_name;
    if (body.client_cui !== undefined) updateInput.client_cui = body.client_cui;
    if (body.client_j_number !== undefined) updateInput.client_j_number = body.client_j_number;
    if (body.contract_number !== undefined) updateInput.contract_number = body.contract_number;
    if (body.contract_date !== undefined) updateInput.contract_date = body.contract_date;
    if (body.services !== undefined) updateInput.services = body.services;
    if (body.monthly_fee !== undefined) updateInput.monthly_fee = body.monthly_fee;
    if (body.currency !== undefined) updateInput.currency = body.currency;
    if (body.payment_day !== undefined) updateInput.payment_day = body.payment_day;
    if (body.status !== undefined) updateInput.status = body.status;
    if (body.start_date !== undefined) updateInput.start_date = body.start_date;
    if (body.end_date !== undefined) updateInput.end_date = body.end_date;
    if (body.notes !== undefined) updateInput.notes = body.notes;

    const accountingService = new AccountingService(supabase);
    const contract = await accountingService.updateContract(params.id, updateInput);

    return NextResponse.json({ contract });
  } catch (error) {
    console.error('Error in PATCH /api/accounting/contracts/[id]:', error);
    return NextResponse.json(
      { error: 'Eroare la actualizarea contractului' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
    }

    // Get user's organization and role
    const { data: membership } = await supabase
      .from('memberships')
      .select('org_id, role')
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Organizație negăsită' }, { status: 404 });
    }

    // Check permissions
    if (!['consultant', 'firma_admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Nu aveți permisiunea de a șterge contracte' },
        { status: 403 }
      );
    }

    const accountingService = new AccountingService(supabase);
    await accountingService.deleteContract(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/accounting/contracts/[id]:', error);
    return NextResponse.json(
      { error: 'Eroare la ștergerea contractului' },
      { status: 500 }
    );
  }
}
