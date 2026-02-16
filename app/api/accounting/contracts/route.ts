/**
 * API Route: /api/accounting/contracts
 * GET - List contracts
 * POST - Create contract
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { AccountingService } from '@/lib/services/accounting-service';
import { CreateContractInput } from '@/lib/services/accounting-types';

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

    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const currency = searchParams.get('currency');

    const filters: any = {};
    if (status) filters.status = status;
    if (search) filters.search = search;
    if (currency) filters.currency = currency;

    const accountingService = new AccountingService(supabase);
    const contracts = await accountingService.getContracts(membership.organization_id, filters);

    return NextResponse.json({ contracts });
  } catch (error) {
    console.error('Error in GET /api/accounting/contracts:', error);
    return NextResponse.json(
      { error: 'Eroare la încărcarea contractelor' },
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

    // Get user's organization
    const { data: membership } = await supabase
      .from('memberships')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Organizație negăsită' }, { status: 404 });
    }

    // Check permissions
    if (!['consultant', 'firma_admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Nu aveți permisiunea de a crea contracte' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const contractInput: CreateContractInput = {
      org_id: membership.organization_id,
      client_name: body.client_name,
      client_cui: body.client_cui,
      client_j_number: body.client_j_number,
      contract_number: body.contract_number,
      contract_date: body.contract_date,
      services: body.services || [],
      monthly_fee: body.monthly_fee,
      currency: body.currency || 'RON',
      payment_day: body.payment_day,
      start_date: body.start_date,
      end_date: body.end_date,
      notes: body.notes,
      created_by: user.id,
    };

    const accountingService = new AccountingService(supabase);
    const contract = await accountingService.createContract(contractInput);

    // Auto-generate standard deadlines if services are provided
    if (contractInput.services && contractInput.services.length > 0) {
      try {
        await accountingService.generateStandardDeadlines(
          contract.id,
          membership.organization_id,
          contractInput.services
        );
      } catch (error) {
        console.error('Error generating deadlines:', error);
        // Don't fail the contract creation if deadline generation fails
      }
    }

    return NextResponse.json({ contract }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/accounting/contracts:', error);
    return NextResponse.json(
      { error: 'Eroare la crearea contractului' },
      { status: 500 }
    );
  }
}
