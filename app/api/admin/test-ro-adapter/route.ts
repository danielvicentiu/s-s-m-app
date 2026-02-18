// ============================================================
// app/api/admin/test-ro-adapter/route.ts
// M7 Legislative Monitor — Test Endpoint
//
// GET /api/admin/test-ro-adapter
// Testează conexiunea la SOAP + HTML fallback
// Fetchează HG 1425/2006 (act SSM de referință) și returnează rezultat
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { fetchActFromLegislatie, checkActUpdate } from '@/lib/legislative/ro-adapter'

// HG 1425/2006 — Normele metodologice de aplicare a Legii SSM 319/2006
const TEST_ACT = { numar: '1425', an: '2006', tip: 'HG' } as const

export async function GET(request: NextRequest) {
  try {
    // ─── Auth: super_admin, admin sau consultant ─────────────────────────────────
    const supabase = await createSupabaseServer()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Neautentificat' }, { status: 401 })
    }

    // Verifică super_admin în user_roles
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('roles!inner(role_key)')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .eq('roles.role_key', 'super_admin')
      .maybeSingle()

    const isSuperAdmin = !!userRole

    // Dacă NU e super_admin, verifică membership (admin/consultant)
    if (!isSuperAdmin) {
      const { data: membership, error: membershipError } = await supabase
        .from('memberships')
        .select('role')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()

      if (membershipError || !membership || !['consultant', 'admin'].includes(membership.role)) {
        return NextResponse.json(
          { error: 'Acces permis doar super_admin/admin/consultant' },
          { status: 403 }
        )
      }
    }

    // ─── Parse optional overrides from query params ────────────
    const url = new URL(request.url)
    const numar = url.searchParams.get('numar') ?? TEST_ACT.numar
    const an = url.searchParams.get('an') ?? TEST_ACT.an
    const tip = url.searchParams.get('tip') ?? TEST_ACT.tip

    console.log(`[test-ro-adapter] Testing fetchAct: ${tip} ${numar}/${an}`)

    const startTime = Date.now()

    // ─── Try fetchActFromLegislatie ────────────────────────────
    let fetchResult: Awaited<ReturnType<typeof fetchActFromLegislatie>> | null = null
    let fetchError: string | null = null

    try {
      fetchResult = await fetchActFromLegislatie(numar, an, tip)
    } catch (err) {
      fetchError = err instanceof Error ? err.message : String(err)
      console.error('[test-ro-adapter] fetchAct error:', fetchError)
    }

    // ─── Try checkActUpdate if portal URL found ────────────────
    let updateCheck: Awaited<ReturnType<typeof checkActUpdate>> = null

    if (fetchResult?.meta.portalId) {
      try {
        updateCheck = await checkActUpdate(fetchResult.meta.portalId)
      } catch (err) {
        console.warn('[test-ro-adapter] checkActUpdate error:', err)
      }
    }

    const durationMs = Date.now() - startTime

    // ─── Build response ────────────────────────────────────────
    if (fetchResult) {
      return NextResponse.json({
        success: true,
        act: `${tip} ${numar}/${an}`,
        duration_ms: durationMs,
        result: {
          titlu: fetchResult.titlu,
          continut_preview: fetchResult.continut.substring(0, 500) + '…',
          continut_length: fetchResult.continut.length,
          meta: fetchResult.meta,
        },
        update_check: updateCheck,
        soap_endpoint:
          'http://legislatie.just.ro/Public/WebServices/LegislativeWebService.asmx',
      })
    }

    // Fetch failed — return diagnostic info
    return NextResponse.json(
      {
        success: false,
        act: `${tip} ${numar}/${an}`,
        duration_ms: durationMs,
        error: fetchError,
        soap_endpoint:
          'http://legislatie.just.ro/Public/WebServices/LegislativeWebService.asmx',
        suggestion:
          'Verifică că legislatie.just.ro este accesibil din Vercel (IP allowlisting sau SOAP endpoint indisponibil)',
      },
      { status: 502 }
    )
  } catch (err) {
    console.error('[test-ro-adapter] Unexpected error:', err)

    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
