// app/api/near-miss/[id]/route.ts
// Near-Miss API: Get, update, delete specific near-miss report

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

// ============================================================
// GET /api/near-miss/[id] - Get single near-miss report
// ============================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServer()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch record
    const { data, error } = await supabase
      .from('near_miss_reports')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Near-miss report not found' },
          { status: 404 }
        )
      }
      console.error('[API] Near-miss GET error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch near-miss report', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ report: data })
  } catch (err: any) {
    console.error('[API] Near-miss GET exception:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// PUT /api/near-miss/[id] - Update near-miss report
// ============================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServer()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()

    // Prepare update payload (only include fields that are provided)
    const payload: any = {
      updated_at: new Date().toISOString(),
    }

    // Conditionally add fields if present in body
    if (body.reported_by !== undefined) payload.reported_by = body.reported_by
    if (body.incident_date !== undefined)
      payload.incident_date = body.incident_date
    if (body.incident_time !== undefined)
      payload.incident_time = body.incident_time
    if (body.location !== undefined) payload.location = body.location
    if (body.description !== undefined) payload.description = body.description
    if (body.potential_severity !== undefined)
      payload.potential_severity = body.potential_severity
    if (body.category !== undefined) payload.category = body.category
    if (body.witnesses !== undefined) payload.witnesses = body.witnesses
    if (body.immediate_actions !== undefined)
      payload.immediate_actions = body.immediate_actions
    if (body.root_cause !== undefined) payload.root_cause = body.root_cause
    if (body.corrective_actions !== undefined)
      payload.corrective_actions = body.corrective_actions
    if (body.responsible_person !== undefined)
      payload.responsible_person = body.responsible_person
    if (body.deadline !== undefined) payload.deadline = body.deadline
    if (body.status !== undefined) {
      payload.status = body.status
      // If closing the report, set closed_at and closed_by
      if (body.status === 'inchis') {
        payload.closed_at = new Date().toISOString()
        payload.closed_by = user.id
      }
    }
    if (body.photos_paths !== undefined) payload.photos_paths = body.photos_paths
    if (body.investigation_notes !== undefined)
      payload.investigation_notes = body.investigation_notes

    // Update record
    const { data, error } = await supabase
      .from('near_miss_reports')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Near-miss report not found' },
          { status: 404 }
        )
      }
      console.error('[API] Near-miss PUT error:', error)
      return NextResponse.json(
        { error: 'Failed to update near-miss report', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      report: data,
      message: 'Near-miss report updated successfully',
    })
  } catch (err: any) {
    console.error('[API] Near-miss PUT exception:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// DELETE /api/near-miss/[id] - Delete near-miss report
// ============================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServer()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete record
    const { error } = await supabase
      .from('near_miss_reports')
      .delete()
      .eq('id', id)

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Near-miss report not found' },
          { status: 404 }
        )
      }
      console.error('[API] Near-miss DELETE error:', error)
      return NextResponse.json(
        { error: 'Failed to delete near-miss report', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Near-miss report deleted successfully',
    })
  } catch (err: any) {
    console.error('[API] Near-miss DELETE exception:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    )
  }
}
