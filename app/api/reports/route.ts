// app/api/reports/route.ts
// API pentru listarea rapoartelor generate
// Data: 17 Februarie 2026

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

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
    const reportType = searchParams.get('report_type')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabase
      .from('reports')
      .select(
        `
        *,
        organizations(id, name, cui)
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (organizationId && organizationId !== 'all') {
      query = query.eq('organization_id', organizationId)
    }

    if (reportType) {
      query = query.eq('report_type', reportType)
    }

    // Execute query
    const { data, error, count } = await query

    if (error) {
      console.error('[API] Reports GET error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch reports', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      reports: data || [],
      count: count || 0,
      limit,
      offset,
    })
  } catch (err: any) {
    console.error('[API] Reports GET exception:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    )
  }
}
