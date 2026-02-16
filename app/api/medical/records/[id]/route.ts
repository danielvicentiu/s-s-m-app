// app/api/medical/records/[id]/route.ts
// M3_MEDICAL API: Get, update, delete specific medical examination

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

// ============================================================
// GET /api/medical/records/[id] - Get single medical examination
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
      .from('medical_examinations')
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
          { error: 'Medical record not found' },
          { status: 404 }
        )
      }
      console.error('[API] Medical record GET error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch medical record', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ record: data })
  } catch (err: any) {
    console.error('[API] Medical record GET exception:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// PUT /api/medical/records/[id] - Update medical examination
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

    // If employee_id provided, fetch employee details
    let employeeName = body.employee_name
    let jobTitle = body.job_title

    if (body.employee_id && !employeeName) {
      const { data: employee } = await supabase
        .from('employees')
        .select('full_name, job_title')
        .eq('id', body.employee_id)
        .single()

      if (employee) {
        employeeName = employee.full_name
        jobTitle = employee.job_title
      }
    }

    // Prepare update payload (only include fields that are provided)
    const payload: any = {
      updated_at: new Date().toISOString(),
    }

    // Conditionally add fields if present in body
    if (body.organization_id !== undefined)
      payload.organization_id = body.organization_id
    if (body.employee_id !== undefined) payload.employee_id = body.employee_id
    if (employeeName) payload.employee_name = employeeName
    if (jobTitle !== undefined) payload.job_title = jobTitle
    if (body.examination_type !== undefined)
      payload.examination_type = body.examination_type
    if (body.examination_date !== undefined)
      payload.examination_date = body.examination_date
    if (body.expiry_date !== undefined) payload.expiry_date = body.expiry_date
    if (body.result !== undefined) payload.result = body.result
    if (body.restrictions !== undefined) payload.restrictions = body.restrictions
    if (body.doctor_name !== undefined) payload.doctor_name = body.doctor_name
    if (body.clinic_name !== undefined) payload.clinic_name = body.clinic_name
    if (body.notes !== undefined) payload.notes = body.notes
    if (body.validity_months !== undefined)
      payload.validity_months = body.validity_months
    if (body.risk_factors !== undefined) payload.risk_factors = body.risk_factors
    if (body.next_examination_date !== undefined)
      payload.next_examination_date = body.next_examination_date
    if (body.document_number !== undefined)
      payload.document_number = body.document_number
    if (body.document_storage_path !== undefined)
      payload.document_storage_path = body.document_storage_path
    if (body.location_id !== undefined) payload.location_id = body.location_id
    if (body.cnp_hash !== undefined) payload.cnp_hash = body.cnp_hash

    // Update record
    const { data, error } = await supabase
      .from('medical_examinations')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Medical record not found' },
          { status: 404 }
        )
      }
      console.error('[API] Medical record PUT error:', error)
      return NextResponse.json(
        { error: 'Failed to update medical record', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      record: data,
      message: 'Medical record updated successfully',
    })
  } catch (err: any) {
    console.error('[API] Medical record PUT exception:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// DELETE /api/medical/records/[id] - Delete medical examination
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
      .from('medical_examinations')
      .delete()
      .eq('id', id)

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Medical record not found' },
          { status: 404 }
        )
      }
      console.error('[API] Medical record DELETE error:', error)
      return NextResponse.json(
        { error: 'Failed to delete medical record', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Medical record deleted successfully',
    })
  } catch (err: any) {
    console.error('[API] Medical record DELETE exception:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    )
  }
}
