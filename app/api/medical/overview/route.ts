// app/api/medical/overview/route.ts
// M3_MEDICAL API: Aggregate overview from medical_status_overview view
// GET /api/medical/overview — statistici per angajat + carduri dashboard

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

// ============================================================
// GET /api/medical/overview
// ============================================================
// Query params:
//   organization_id  — filtrează pe org (sau 'all')
//   status           — 'valid' | 'expira_curand' | 'expirat' | 'fara_fisa' | 'all'
//   limit            — max rows (default 200)
// Response:
//   overview: MedicalStatusRow[]  — rows from view
//   stats: { total, valid, expira_curand, expirat, fara_fisa, cu_restrictii }
//   count: number

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const organizationId = searchParams.get('organization_id')
    const status = searchParams.get('status')
    const limit = Math.min(parseInt(searchParams.get('limit') || '200'), 500)

    // Build query against the view
    let query = supabase
      .from('medical_status_overview')
      .select('*', { count: 'exact' })
      .limit(limit)

    if (organizationId && organizationId !== 'all') {
      query = query.eq('org_id', organizationId)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('[API] Medical overview GET error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch medical overview', details: error.message },
        { status: 500 }
      )
    }

    const rows = data || []

    // Aggregate stats (calculated from returned rows)
    const stats = {
      total: count ?? rows.length,
      valid: rows.filter((r) => r.status === 'valid').length,
      expira_curand: rows.filter((r) => r.status === 'expira_curand').length,
      expirat: rows.filter((r) => r.status === 'expirat').length,
      fara_fisa: rows.filter((r) => r.status === 'fara_fisa').length,
      cu_restrictii: rows.filter(
        (r) => r.restrictions && String(r.restrictions).trim().length > 0
      ).length,
    }

    return NextResponse.json({
      overview: rows,
      stats,
      count: count ?? rows.length,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[API] Medical overview GET exception:', message)
    return NextResponse.json(
      { error: 'Internal server error', details: message },
      { status: 500 }
    )
  }
}
