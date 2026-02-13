// ============================================================
// S-S-M.RO — API Route: Audit Log
// File: app/api/audit/route.ts
//
// GET: Retrieve audit logs with pagination and filtering
// POST: Create new audit log entry
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

// ============================================================
// GET /api/audit
// Query params:
//   - page: number (default: 1)
//   - limit: number (default: 50, max: 100)
//   - action: string (filter by action type)
//   - user_id: UUID (filter by user)
//   - organization_id: UUID (filter by organization)
//   - entity_type: string (filter by entity type)
//   - date_from: ISO date string (filter from date)
//   - date_to: ISO date string (filter to date)
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const action = searchParams.get('action');
    const userId = searchParams.get('user_id');
    const organizationId = searchParams.get('organization_id');
    const entityType = searchParams.get('entity_type');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build query with RLS (policies will automatically filter based on user permissions)
    let query = supabase
      .from('audit_log')
      .select(
        `
        *,
        profiles!audit_log_user_id_fkey(full_name, avatar_url),
        organizations(name)
      `,
        { count: 'exact' }
      );

    // Apply filters
    if (action) {
      query = query.eq('action', action);
    }
    if (userId) {
      query = query.eq('user_id', userId);
    }
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }
    if (entityType) {
      query = query.eq('entity_type', entityType);
    }
    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }

    // Apply pagination and ordering
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('[Audit API] Error fetching audit logs:', error);
      return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
    }

    // Calculate pagination metadata
    const totalPages = count ? Math.ceil(count / limit) : 0;

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error('[Audit API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/audit
// Body:
//   - action: string (required)
//   - entity_type: string (required)
//   - entity_id: UUID (optional)
//   - old_values: object (optional)
//   - new_values: object (optional)
//   - metadata: object (optional)
//   - organization_id: UUID (optional)
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const {
      action,
      entity_type,
      entity_id,
      old_values,
      new_values,
      metadata,
      organization_id,
    } = body;

    // Validate required fields
    if (!action || !entity_type) {
      return NextResponse.json(
        { error: 'Missing required fields: action, entity_type' },
        { status: 400 }
      );
    }

    // Validate entity_type against allowed values
    const allowedEntityTypes = [
      'reges_connection',
      'reges_outbox',
      'reges_receipt',
      'reges_result',
      'employee',
      'contract',
      'organization',
      'user',
    ];

    if (!allowedEntityTypes.includes(entity_type)) {
      return NextResponse.json(
        { error: `Invalid entity_type. Allowed values: ${allowedEntityTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Get client IP and user agent
    const ip_address = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                      request.headers.get('x-real-ip') ||
                      null;
    const user_agent = request.headers.get('user-agent') || null;

    // Create audit log entry
    const { data, error } = await supabase
      .from('audit_log')
      .insert({
        organization_id,
        user_id: user.id,
        action,
        entity_type,
        entity_id,
        old_values,
        new_values,
        metadata,
        ip_address,
        user_agent,
      })
      .select()
      .single();

    if (error) {
      console.error('[Audit API] Error creating audit log:', error);
      return NextResponse.json(
        { error: 'Failed to create audit log entry' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('[Audit API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
