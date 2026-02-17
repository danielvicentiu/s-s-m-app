// app/api/dashboard/obligations/route.ts
// Dashboard API — Obligații publicate pentru organizația curentă
// GET: lista obligații per org + stats
// PATCH: update org_status

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(request: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin()
  const supabase = supabaseAdmin

  const searchParams = request.nextUrl.searchParams
  const orgId = searchParams.get('org_id')
  const status = searchParams.get('status')
  const severity = searchParams.get('severity')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    let query = supabase
      .from('v_org_obligations')
      .select('*', { count: 'exact' })

    if (orgId) {
      query = query.eq('organization_id', orgId)
    }

    if (status) {
      query = query.eq('org_status', status)
    }

    if (severity) {
      query = query.eq('severity', severity)
    }

    query = query
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) throw error

    // Stats summary
    let statsQuery = supabase
      .from('organization_obligations')
      .select('org_status')
    
    if (orgId) {
      statsQuery = statsQuery.eq('organization_id', orgId)
    }

    const { data: allStatuses } = await statsQuery

    const stats = {
      total: (allStatuses || []).length,
      new: (allStatuses || []).filter((s: any) => s.org_status === 'new').length,
      seen: (allStatuses || []).filter((s: any) => s.org_status === 'seen').length,
      in_progress: (allStatuses || []).filter((s: any) => s.org_status === 'in_progress').length,
      compliant: (allStatuses || []).filter((s: any) => s.org_status === 'compliant').length,
      non_compliant: (allStatuses || []).filter((s: any) => s.org_status === 'non_compliant').length,
      not_applicable: (allStatuses || []).filter((s: any) => s.org_status === 'not_applicable').length,
    }

    return NextResponse.json({
      obligations: data || [],
      stats,
      pagination: { total: count, limit, offset }
    })

  } catch (error: any) {
    console.error('Dashboard obligations error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin()
  const supabase = supabaseAdmin

  try {
    const body = await request.json()
    const { id, org_status, org_notes } = body

    if (!id || !org_status) {
      return NextResponse.json({ error: 'id and org_status required' }, { status: 400 })
    }

    const validStatuses = ['new', 'seen', 'in_progress', 'compliant', 'non_compliant', 'not_applicable']
    if (!validStatuses.includes(org_status)) {
      return NextResponse.json({ error: `Invalid status. Valid: ${validStatuses.join(', ')}` }, { status: 400 })
    }

    const updateData: any = {
      org_status,
      org_status_updated_at: new Date().toISOString(),
    }
    if (org_notes !== undefined) {
      updateData.org_notes = org_notes
    }

    const { data, error } = await supabase
      .from('organization_obligations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })

  } catch (error: any) {
    console.error('Dashboard obligation update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
