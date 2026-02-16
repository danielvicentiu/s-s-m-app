// app/api/medical/appointments/[id]/route.ts
// M3_MEDICAL API: Get, update, delete specific medical appointment

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

// ============================================================
// GET /api/medical/appointments/[id] - Get single appointment
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

    // Fetch appointment
    const { data, error } = await supabase
      .from('medical_appointments')
      .select(
        `
        *,
        employees(id, full_name, job_title, cor_code),
        organizations(id, name, cui)
      `
      )
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Appointment not found' },
          { status: 404 }
        )
      }
      console.error('[API] Appointment GET error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch appointment', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ appointment: data })
  } catch (err: any) {
    console.error('[API] Appointment GET exception:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// PUT /api/medical/appointments/[id] - Update appointment
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

    // Prepare update payload
    const payload: any = {
      updated_at: new Date().toISOString(),
    }

    // Conditionally add fields if present in body
    if (body.appointment_date !== undefined)
      payload.appointment_date = body.appointment_date
    if (body.appointment_time !== undefined)
      payload.appointment_time = body.appointment_time
    if (body.clinic_name !== undefined) payload.clinic_name = body.clinic_name
    if (body.clinic_address !== undefined)
      payload.clinic_address = body.clinic_address
    if (body.examination_type !== undefined)
      payload.examination_type = body.examination_type
    if (body.status !== undefined) payload.status = body.status
    if (body.notes !== undefined) payload.notes = body.notes

    // Update appointment
    const { data, error } = await supabase
      .from('medical_appointments')
      .update(payload)
      .eq('id', id)
      .select(
        `
        *,
        employees(id, full_name, job_title),
        organizations(id, name)
      `
      )
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Appointment not found' },
          { status: 404 }
        )
      }
      console.error('[API] Appointment PUT error:', error)
      return NextResponse.json(
        { error: 'Failed to update appointment', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      appointment: data,
      message: 'Appointment updated successfully',
    })
  } catch (err: any) {
    console.error('[API] Appointment PUT exception:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// DELETE /api/medical/appointments/[id] - Delete appointment
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

    // Delete appointment
    const { error } = await supabase
      .from('medical_appointments')
      .delete()
      .eq('id', id)

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Appointment not found' },
          { status: 404 }
        )
      }
      console.error('[API] Appointment DELETE error:', error)
      return NextResponse.json(
        { error: 'Failed to delete appointment', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Appointment deleted successfully',
    })
  } catch (err: any) {
    console.error('[API] Appointment DELETE exception:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    )
  }
}
