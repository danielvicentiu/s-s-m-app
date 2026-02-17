// app/api/client/obligations/route.ts
// M7 CLIENT API: Lista obligații legislative per organizație
// GET /api/client/obligations?org_id=xxx&domain=SSM&severity=critical&search=text

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

// Helper: Determină domeniul din sursa legală
function inferDomain(sourceLegalAct: string): string {
  const act = sourceLegalAct.toUpperCase()

  if (act.includes('L-319') || act.includes('HG-1425') || act.includes('SECURITATE') || act.includes('SSM')) {
    return 'SSM'
  }
  if (act.includes('L-307') || act.includes('HG-115') || act.includes('INCENDIU') || act.includes('PSI') || act.includes('APĂRARE ÎMPOTRIVA INCENDIILOR')) {
    return 'PSI'
  }
  if (act.includes('GDPR') || act.includes('L-190-2018') || act.includes('PROTECȚIA DATELOR')) {
    return 'GDPR'
  }
  if (act.includes('COD FISCAL') || act.includes('L-227-2015') || act.includes('FISCAL')) {
    return 'Fiscal'
  }

  return 'Altele'
}

// Helper: Determină severitatea din penalități
function inferSeverity(penaltyMax: number | null): string {
  if (!penaltyMax || penaltyMax === 0) return 'minor'
  if (penaltyMax > 50000) return 'critical'
  if (penaltyMax > 10000) return 'major'
  return 'minor'
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const searchParams = request.nextUrl.searchParams

    const orgId = searchParams.get('org_id')
    const domainFilter = searchParams.get('domain') // SSM | PSI | GDPR | Fiscal | Altele
    const severityFilter = searchParams.get('severity') // critical | major | minor
    const searchText = searchParams.get('search') || ''
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!orgId) {
      return NextResponse.json(
        { error: 'org_id is required' },
        { status: 400 }
      )
    }

    // Verifică accesul user la organizație
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: membership } = await supabase
      .from('memberships')
      .select('id')
      .eq('user_id', user.id)
      .eq('organization_id', orgId)
      .eq('is_active', true)
      .single()

    if (!membership) {
      return NextResponse.json(
        { error: 'Access denied to this organization' },
        { status: 403 }
      )
    }

    // Fetch organization_obligations cu JOIN la obligations
    let query = supabase
      .from('organization_obligations')
      .select(`
        id,
        organization_id,
        obligation_id,
        status,
        assigned_at,
        acknowledged_at,
        acknowledged_by,
        compliant_at,
        compliant_by,
        notes,
        evidence_urls,
        match_score,
        match_reason,
        obligation:obligations (
          id,
          source_legal_act,
          source_article_id,
          source_article_number,
          country_code,
          obligation_text,
          who,
          deadline,
          frequency,
          penalty,
          penalty_min,
          penalty_max,
          penalty_currency,
          evidence_required,
          published_at
        )
      `)
      .eq('organization_id', orgId)
      .order('assigned_at', { ascending: false })

    const { data: rawObligations, error } = await query

    if (error) {
      console.error('Error fetching obligations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch obligations' },
        { status: 500 }
      )
    }

    if (!rawObligations) {
      return NextResponse.json({
        obligations: [],
        total: 0,
        limit,
        offset
      })
    }

    // Enrichește cu domain și severity, aplică filtrele
    let enrichedObligations = rawObligations
      .filter(obl => obl.obligation) // Exclude NULL obligations
      .map(obl => {
        const obligation = obl.obligation as any
        const domain = inferDomain(obligation.source_legal_act || '')
        const severity = inferSeverity(obligation.penalty_max)

        return {
          ...obl,
          obligation: {
            ...obligation,
            domain,
            severity
          }
        }
      })

    // Filtrare domeniu
    if (domainFilter && domainFilter !== 'all') {
      enrichedObligations = enrichedObligations.filter(
        obl => (obl.obligation as any).domain === domainFilter
      )
    }

    // Filtrare severitate
    if (severityFilter && severityFilter !== 'all') {
      enrichedObligations = enrichedObligations.filter(
        obl => (obl.obligation as any).severity === severityFilter
      )
    }

    // Filtrare search text
    if (searchText) {
      const searchLower = searchText.toLowerCase()
      enrichedObligations = enrichedObligations.filter(obl => {
        const obligation = obl.obligation as any
        return (
          obligation.obligation_text?.toLowerCase().includes(searchLower) ||
          obligation.source_legal_act?.toLowerCase().includes(searchLower) ||
          obligation.source_article_number?.toLowerCase().includes(searchLower)
        )
      })
    }

    // Paginare
    const total = enrichedObligations.length
    const paginatedObligations = enrichedObligations.slice(offset, offset + limit)

    return NextResponse.json({
      obligations: paginatedObligations,
      total,
      limit,
      offset
    })

  } catch (error: any) {
    console.error('Client obligations API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
