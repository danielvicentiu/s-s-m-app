// app/api/training/calendar/route.ts
// Training Calendar API: List and create training sessions

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

// ============================================================
// GET /api/training/calendar - List training sessions
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
    const organizationId = searchParams.get('org_id')
    const month = searchParams.get('month') // Format: YYYY-MM
    const year = searchParams.get('year')
    const trainingType = searchParams.get('training_type')
    const status = searchParams.get('status')
    const employeeId = searchParams.get('employee_id')
    const limit = parseInt(searchParams.get('limit') || '1000')

    // Build query using the training_calendar_view
    let query = supabase
      .from('training_calendar_view')
      .select('*')
      .order('scheduled_date', { ascending: true })
      .limit(limit)

    // Apply filters
    if (organizationId && organizationId !== 'all') {
      query = query.eq('organization_id', organizationId)
    }

    if (month) {
      // Filter by specific month (YYYY-MM)
      const [y, m] = month.split('-')
      const startDate = `${y}-${m}-01`
      const endDate = `${y}-${m}-${new Date(parseInt(y), parseInt(m), 0).getDate()}`
      query = query.gte('scheduled_date', startDate).lte('scheduled_date', endDate)
    } else if (year) {
      // Filter by year
      query = query.gte('scheduled_date', `${year}-01-01`).lte('scheduled_date', `${year}-12-31`)
    }

    if (trainingType) {
      query = query.eq('training_type', trainingType)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (employeeId) {
      query = query.eq('employee_id', employeeId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching training calendar:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Unexpected error in GET /api/training/calendar:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ============================================================
// POST /api/training/calendar - Create training session
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
    const {
      organization_id,
      employee_id,
      training_type,
      scheduled_date,
      instructor,
      duration_hours,
      topics,
      notes,
    } = body

    // Validate required fields
    if (!organization_id || !employee_id || !training_type || !scheduled_date || !instructor) {
      return NextResponse.json(
        { error: 'Missing required fields: organization_id, employee_id, training_type, scheduled_date, instructor' },
        { status: 400 }
      )
    }

    // Validate training_type
    if (!['ig', 'llm', 'periodica', 'tematica'].includes(training_type)) {
      return NextResponse.json(
        { error: 'Invalid training_type. Must be: ig, llm, periodica, or tematica' },
        { status: 400 }
      )
    }

    // Check if user has access to organization
    const { data: membership } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', organization_id)
      .eq('is_active', true)
      .single()

    if (!membership || !['consultant', 'firma_admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to create training sessions for this organization' },
        { status: 403 }
      )
    }

    // Create training session
    const { data: newSession, error: insertError } = await supabase
      .from('training_sessions')
      .insert({
        organization_id,
        employee_id,
        training_type,
        scheduled_date,
        instructor,
        duration_hours: duration_hours || 1.0,
        topics,
        notes,
        status: 'programat',
        created_by: user.id,
      })
      .select(
        `
        *,
        employees(id, full_name, job_title),
        organizations(id, name, cui)
      `
      )
      .single()

    if (insertError) {
      console.error('Error creating training session:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ data: newSession }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/training/calendar:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
