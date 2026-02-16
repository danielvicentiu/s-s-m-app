// app/api/medical/records/route.ts
// M3_MEDICAL API: List and create medical examinations
// Uses medical_examinations table (extended with employee_id)

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

// ============================================================
// GET /api/medical/records - List medical examinations
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
    const status = searchParams.get('status') // 'valid', 'expiring', 'expired'
    const employeeId = searchParams.get('employee_id')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabase
      .from('medical_examinations')
      .select(
        `
        *,
        employees(id, full_name, job_title, cor_code),
        organizations(id, name, cui)
      `,
        { count: 'exact' }
      )
      .order('examination_date', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (organizationId && organizationId !== 'all') {
      query = query.eq('organization_id', organizationId)
    }

    if (employeeId) {
      query = query.eq('employee_id', employeeId)
    }

    // Status filter (calculated on client, but we can pre-filter by expiry_date)
    if (status === 'expired') {
      query = query.lt('expiry_date', new Date().toISOString().split('T')[0])
    } else if (status === 'expiring') {
      const today = new Date()
      const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      query = query
        .gte('expiry_date', today.toISOString().split('T')[0])
        .lte('expiry_date', in30Days.toISOString().split('T')[0])
    } else if (status === 'valid') {
      const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      query = query.gt('expiry_date', in30Days.toISOString().split('T')[0])
    }

    // Execute query
    const { data, error, count } = await query

    if (error) {
      console.error('[API] Medical records GET error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch medical records', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      records: data || [],
      count: count || 0,
      limit,
      offset,
    })
  } catch (err: any) {
    console.error('[API] Medical records GET exception:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// POST /api/medical/records - Create medical examination
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

    if (!body.employee_name && !body.employee_id) {
      return NextResponse.json(
        { error: 'Either employee_name or employee_id is required' },
        { status: 400 }
      )
    }

    if (!body.examination_type) {
      return NextResponse.json(
        { error: 'examination_type is required' },
        { status: 400 }
      )
    }

    if (!body.examination_date) {
      return NextResponse.json(
        { error: 'examination_date is required' },
        { status: 400 }
      )
    }

    if (!body.expiry_date) {
      return NextResponse.json(
        { error: 'expiry_date is required' },
        { status: 400 }
      )
    }

    if (!body.result) {
      return NextResponse.json(
        { error: 'result is required' },
        { status: 400 }
      )
    }

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

    // Prepare payload
    const payload = {
      organization_id: body.organization_id,
      employee_id: body.employee_id || null,
      employee_name: employeeName || 'Unknown',
      job_title: jobTitle || body.job_title || null,
      examination_type: body.examination_type,
      examination_date: body.examination_date,
      expiry_date: body.expiry_date,
      result: body.result,
      restrictions: body.restrictions || null,
      doctor_name: body.doctor_name || null,
      clinic_name: body.clinic_name || null,
      notes: body.notes || null,
      validity_months: body.validity_months || 12,
      risk_factors: body.risk_factors || null,
      next_examination_date: body.next_examination_date || body.expiry_date,
      document_number: body.document_number || null,
      document_storage_path: body.document_storage_path || null,
      content_version: 1,
      legal_basis_version: 'HG1425/2006',
      location_id: body.location_id || null,
      cnp_hash: body.cnp_hash || null,
      updated_at: new Date().toISOString(),
    }

    // Insert record
    const { data, error } = await supabase
      .from('medical_examinations')
      .insert([payload])
      .select()
      .single()

    if (error) {
      console.error('[API] Medical record POST error:', error)
      return NextResponse.json(
        { error: 'Failed to create medical record', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { record: data, message: 'Medical record created successfully' },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('[API] Medical record POST exception:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    )
  }
}
