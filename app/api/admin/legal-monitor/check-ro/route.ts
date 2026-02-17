// ============================================================
// app/api/admin/legal-monitor/check-ro/route.ts
// M7 Legislative Monitor — RO Check API Endpoint
//
// POST /api/admin/legal-monitor/check-ro
// Verifică acte legislative RO pentru modificări
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { runRomanianMonitorCheck } from '@/lib/legal-monitor/ro-checker'

export async function POST(request: NextRequest) {
  try {
    // Step 1: Autentificare și verificare rol
    const supabase = await createSupabaseServer()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Neautentificat' }, { status: 401 })
    }

    // Step 2: Verifică rol consultant din memberships
    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: 'Membership nu a fost găsit' },
        { status: 403 }
      )
    }

    if (membership.role !== 'consultant') {
      return NextResponse.json(
        { error: 'Acces permis doar pentru consultanți' },
        { status: 403 }
      )
    }

    // Step 3: Rulează monitorizarea
    console.log(`[API] RO monitor check triggered by user ${user.email}`)

    const summary = await runRomanianMonitorCheck()

    // Step 4: Returnează rezultatul
    return NextResponse.json({
      success: true,
      summary,
      message: `Verificare completă: ${summary.checked} acte verificate, ${summary.changed} modificări detectate, ${summary.errors} erori`,
    })
  } catch (error) {
    console.error('[API] RO monitor check error:', error)

    const errorMessage = error instanceof Error ? error.message : String(error)

    return NextResponse.json(
      {
        success: false,
        error: 'Eroare la verificarea actelor legislative',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}

// GET pentru status (opțional, pentru debugging)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Neautentificat' }, { status: 401 })
    }

    // Returnează ultimele log-uri
    const { data: logs, error: logsError } = await supabase
      .from('ro_monitor_log')
      .select('*')
      .order('checked_at', { ascending: false })
      .limit(20)

    if (logsError) {
      throw logsError
    }

    // Returnează acte monitorizate
    const { data: acts, error: actsError } = await supabase
      .from('legal_acts_monitor')
      .select('*')
      .eq('country_code', 'RO')
      .order('priority', { ascending: true })
      .order('act_key', { ascending: true })

    if (actsError) {
      throw actsError
    }

    return NextResponse.json({
      monitored_acts: acts || [],
      recent_logs: logs || [],
    })
  } catch (error) {
    console.error('[API] RO monitor status error:', error)

    return NextResponse.json(
      { error: 'Eroare la citirea statusului' },
      { status: 500 }
    )
  }
}
