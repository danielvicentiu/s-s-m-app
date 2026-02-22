// app/api/alerts/generate/route.ts
// POST: trigger manual sau cron pentru generarea alertelor (M4 engine)
// Auth: Bearer CRON_SECRET SAU user autentificat cu rol consultant/super_admin

import { NextResponse } from 'next/server'
import { generateAlertsForOrg, generateAlertsForAllOrgs } from '@/lib/alerts/engine'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function POST(request: Request) {
  // 1. Auth: CRON_SECRET (cron Vercel) sau user autentificat
  const authHeader = request.headers.get('authorization')
  const isCron =
    process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`

  if (!isCron) {
    const supabase = await createSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verifică rol: consultant, super_admin sau consultant_ssm
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const allowedRoles = ['consultant', 'super_admin', 'consultant_ssm']
    if (!profile || !allowedRoles.includes(profile.role ?? '')) {
      return NextResponse.json({ error: 'Forbidden — rol insuficient' }, { status: 403 })
    }
  }

  // 2. Parsează body opțional { organizationId?: string }
  let organizationId: string | undefined
  try {
    const body = await request.json()
    organizationId = body?.organizationId
  } catch {
    // body absent — OK, generăm pentru toate org-urile
  }

  // 3. Rulează engine
  const start = Date.now()
  try {
    if (organizationId) {
      const result = await generateAlertsForOrg(organizationId)
      return NextResponse.json({
        success: true,
        duration_ms: Date.now() - start,
        organizations: 1,
        results: [result],
        total_generated: result.generated,
        total_skipped: result.skipped,
        total_errors: result.errors.length,
      })
    }

    const results = await generateAlertsForAllOrgs()
    return NextResponse.json({
      success: true,
      duration_ms: Date.now() - start,
      organizations: results.length,
      results,
      total_generated: results.reduce((s, r) => s + r.generated, 0),
      total_skipped: results.reduce((s, r) => s + r.skipped, 0),
      total_errors: results.reduce((s, r) => s + r.errors.length, 0),
    })
  } catch (err) {
    console.error('[POST /api/alerts/generate]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
