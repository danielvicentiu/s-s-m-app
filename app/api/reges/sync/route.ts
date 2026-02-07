// ============================================================
// S-S-M.RO — API Route: REGES Employee Sync
// File: app/api/reges/sync/route.ts
//
// Trigger sincronizare angajați REGES → Supabase
// Poate fi apelat manual sau prin cron job
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { syncEmployees } from '@/lib/reges/sync';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { connection_id } = body;

    if (!connection_id) {
      return NextResponse.json(
        { error: 'Missing required field: connection_id' },
        { status: 400 }
      );
    }

    // Verify user has access
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify connection exists and user has access to it
    const { data: connection, error: connError } = await supabase
      .from('reges_connections')
      .select('*, organizations!inner(*)')
      .eq('id', connection_id)
      .single();

    if (connError || !connection) {
      return NextResponse.json(
        { error: 'Connection not found or access denied' },
        { status: 404 }
      );
    }

    // Verify user is member of organization
    const { data: membership } = await supabase
      .from('memberships')
      .select('*')
      .eq('user_id', user.id)
      .eq('organization_id', connection.organization_id)
      .eq('is_active', true)
      .single();

    if (!membership) {
      return NextResponse.json(
        { error: 'User is not a member of this organization' },
        { status: 403 }
      );
    }

    // Trigger sync
    console.log(`[REGES Sync API] Starting sync for connection ${connection_id}`);

    const result = await syncEmployees(connection_id);

    // Log to audit
    await supabase.from('audit_log').insert({
      organization_id: connection.organization_id,
      user_id: user.id,
      action: 'sync',
      entity_type: 'reges_connection',
      entity_id: connection_id,
      metadata: {
        totalEmployees: result.totalEmployees,
        newEmployees: result.newEmployees,
        departedEmployees: result.departedEmployees,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[REGES Sync API] Sync error:', error);

    return NextResponse.json(
      {
        error: `Sync failed: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 }
    );
  }
}

// ============================================================
// GET - Get sync status for a connection
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const connection_id = searchParams.get('connection_id');

    if (!connection_id) {
      return NextResponse.json(
        { error: 'Missing query parameter: connection_id' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServer();

    // Get connection status
    const { data: connection } = await supabase
      .from('reges_connections')
      .select('last_sync_at, status, error_message')
      .eq('id', connection_id)
      .single();

    if (!connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    // Get latest snapshot count
    const { count } = await supabase
      .from('reges_employee_snapshots')
      .select('*', { count: 'exact', head: true })
      .eq('connection_id', connection_id)
      .order('snapshot_date', { ascending: false })
      .limit(1000);

    return NextResponse.json({
      last_sync_at: connection.last_sync_at,
      status: connection.status,
      error_message: connection.error_message,
      total_employees: count || 0,
    });
  } catch (error) {
    console.error('[REGES Sync API] Get status error:', error);

    return NextResponse.json(
      {
        error: `Failed to get sync status: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
