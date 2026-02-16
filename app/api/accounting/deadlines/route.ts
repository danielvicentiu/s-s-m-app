/**
 * API Route: /api/accounting/deadlines
 * GET - List deadlines
 * POST - Create deadline
 * PATCH - Update deadline status
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { AccountingService } from '@/lib/services/accounting-service';
import { CreateDeadlineInput, DeadlineFilters } from '@/lib/services/accounting-types';

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
    const contractId = searchParams.get('contract_id');
    const fromDate = searchParams.get('from_date');
    const toDate = searchParams.get('to_date');
    const deadlineType = searchParams.get('deadline_type');
    const view = searchParams.get('view'); // 'upcoming', 'overdue', 'all'

    const accountingService = new AccountingService(supabase);

    // Handle special views
    if (view === 'upcoming') {
      const days = parseInt(searchParams.get('days') || '7', 10);
      const deadlines = await accountingService.getUpcomingDeadlines(membership.organization_id, days);
      return NextResponse.json({ deadlines });
    }

    if (view === 'overdue') {
      const deadlines = await accountingService.getOverdueDeadlines(membership.organization_id);
      return NextResponse.json({ deadlines });
    }

    // Standard filtered query
    const filters: DeadlineFilters = {};
    if (status) {
      filters.status = status.split(',') as any;
    }
    if (contractId) filters.contract_id = contractId;
    if (fromDate) filters.from_date = fromDate;
    if (toDate) filters.to_date = toDate;
    if (deadlineType) filters.deadline_type = deadlineType as any;

    const deadlines = await accountingService.getDeadlines(membership.organization_id, filters);

    return NextResponse.json({ deadlines });
  } catch (error) {
    console.error('Error in GET /api/accounting/deadlines:', error);
    return NextResponse.json(
      { error: 'Eroare la încărcarea termenelor' },
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
        { error: 'Nu aveți permisiunea de a crea termene' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const deadlineInput: CreateDeadlineInput = {
      org_id: membership.organization_id,
      contract_id: body.contract_id,
      deadline_type: body.deadline_type,
      title: body.title,
      description: body.description,
      due_date: body.due_date,
      recurrence: body.recurrence,
      reminder_days: body.reminder_days || [14, 7, 3, 1],
    };

    const accountingService = new AccountingService(supabase);
    const deadline = await accountingService.createDeadline(deadlineInput);

    return NextResponse.json({ deadline }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/accounting/deadlines:', error);
    return NextResponse.json(
      { error: 'Eroare la crearea termenului' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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
      .select('organization_id, role')
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Organizație negăsită' }, { status: 404 });
    }

    // Check permissions
    if (!['consultant', 'firma_admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Nu aveți permisiunea de a modifica termene' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID și status sunt obligatorii' },
        { status: 400 }
      );
    }

    const accountingService = new AccountingService(supabase);
    const deadline = await accountingService.updateDeadlineStatus(id, status, user.id);

    return NextResponse.json({ deadline });
  } catch (error) {
    console.error('Error in PATCH /api/accounting/deadlines:', error);
    return NextResponse.json(
      { error: 'Eroare la actualizarea termenului' },
      { status: 500 }
    );
  }
}
