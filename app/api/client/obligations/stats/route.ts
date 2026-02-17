// app/api/client/obligations/stats/route.ts
// M7 CLIENT API: Statistici obligații legislative per organizație
// GET /api/client/obligations/stats?org_id=xxx

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

    // Fetch toate organization_obligations cu JOIN la obligations
    const { data: rawObligations, error } = await supabase
      .from('organization_obligations')
      .select(`
        id,
        assigned_at,
        obligation:obligations (
          id,
          source_legal_act,
          penalty_max
        )
      `)
      .eq('organization_id', orgId)

    if (error) {
      console.error('Error fetching obligations for stats:', error)
      return NextResponse.json(
        { error: 'Failed to fetch obligations' },
        { status: 500 }
      )
    }

    if (!rawObligations) {
      return NextResponse.json({
        total: 0,
        byDomain: {
          SSM: 0,
          PSI: 0,
          GDPR: 0,
          Fiscal: 0,
          Altele: 0
        },
        criticalCount: 0,
        newCount: 0
      })
    }

    // Calculează statistici
    let total = 0
    const byDomain: Record<string, number> = {
      SSM: 0,
      PSI: 0,
      GDPR: 0,
      Fiscal: 0,
      Altele: 0
    }
    let criticalCount = 0
    let newCount = 0

    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    rawObligations.forEach(obl => {
      if (!obl.obligation) return

      total++

      const obligation = obl.obligation as any
      const domain = inferDomain(obligation.source_legal_act || '')
      const severity = inferSeverity(obligation.penalty_max)

      // Count pe domeniu
      if (byDomain[domain] !== undefined) {
        byDomain[domain]++
      } else {
        byDomain['Altele']++
      }

      // Count severitate critică
      if (severity === 'critical') {
        criticalCount++
      }

      // Count obligații noi (ultima lună)
      const assignedDate = new Date(obl.assigned_at)
      if (assignedDate >= oneMonthAgo) {
        newCount++
      }
    })

    return NextResponse.json({
      total,
      byDomain,
      criticalCount,
      newCount
    })

  } catch (error: any) {
    console.error('Client obligations stats API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
