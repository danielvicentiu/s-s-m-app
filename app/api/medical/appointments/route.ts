// app/api/medical/appointments/route.ts
// M3_MEDICAL API: List and create medical appointments

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

// ============================================================
// GET /api/medical/appointments - List medical appointments
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const organizationId = searchParams.get('organization_id')
    const status = searchParams.get('status')
    const employeeId = searchParams.get('employee_id')
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabase
      .from('medical_appointments')
      .select(
        `
        *,
        employees(id, full_name, job_title, cor_code),
        organizations(id, name, cui)
      `,
        { count: 'exact' }
      )
      .order('appointment_date', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (organizationId && organizationId !== 'all') {
      query = query.eq('organization_id', organizationId)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (employeeId) {
      query = query.eq('employee_id', employeeId)
    }

    if (dateFrom) {
      query = query.gte('appointment_date', dateFrom)
    }

    if (dateTo) {
      query = query.lte('appointment_date', dateTo)
    }

    // Execute query
    const { data, error, count } = await query

    if (error) {
      console.error('[API] Appointments GET error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch appointments', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      appointments: data || [],
      count: count || 0,
      limit,
      offset,
    })
  } catch (err: any) {
    console.error('[API] Appointments GET exception:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// POST /api/medical/appointments - Create medical appointment
// ============================================================

export async function POST(request: NextRequest) {
  try {
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

    // Validate required fields
    if (!body.organization_id) {
      return NextResponse.json(
        { error: 'organization_id is required' },
        { status: 400 }
      )
    }

    if (!body.employee_id) {
      return NextResponse.json(
        { error: 'employee_id is required' },
        { status: 400 }
      )
    }

    if (!body.appointment_date) {
      return NextResponse.json(
        { error: 'appointment_date is required' },
        { status: 400 }
      )
    }

    if (!body.examination_type) {
      return NextResponse.json(
        { error: 'examination_type is required' },
        { status: 400 }
      )
    }

    // Verify employee exists and belongs to organization
    const { data: employee, error: empError } = await supabase
      .from('employees')
      .select('id, organization_id')
      .eq('id', body.employee_id)
      .eq('organization_id', body.organization_id)
      .single()

    if (empError || !employee) {
      return NextResponse.json(
        { error: 'Employee not found or does not belong to organization' },
        { status: 400 }
      )
    }

    // Prepare payload
    const payload = {
      organization_id: body.organization_id,
      employee_id: body.employee_id,
      appointment_date: body.appointment_date,
      appointment_time: body.appointment_time || null,
      clinic_name: body.clinic_name || null,
      clinic_address: body.clinic_address || null,
      examination_type: body.examination_type,
      status: body.status || 'programat',
      notes: body.notes || null,
      created_by: user.id,
    }

    // Insert appointment
    const { data, error } = await supabase
      .from('medical_appointments')
      .insert([payload])
      .select(
        `
        *,
        employees(id, full_name, job_title),
        organizations(id, name)
      `
      )
      .single()

    if (error) {
      console.error('[API] Appointment POST error:', error)
      return NextResponse.json(
        { error: 'Failed to create appointment', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { appointment: data, message: 'Appointment created successfully' },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('[API] Appointment POST exception:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    )
  }
}
