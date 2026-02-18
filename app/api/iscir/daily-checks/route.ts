/**
 * API Route: /api/iscir/daily-checks
 * GET  – List daily checks (filterable by equipment_id, org_id, date, from_date)
 * POST – Create or update daily check (upserts on equipment_id + check_date)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    const sp = request.nextUrl.searchParams
    const equipmentId = sp.get('equipment_id')
    const orgId = sp.get('org_id')
    const date = sp.get('date')
    const fromDate = sp.get('from_date')

    let query = supabase
      .from('iscir_daily_checks')
      .select(
        '*, iscir_equipment(id, identifier, equipment_type, location, organization_id)'
      )
      .order('check_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (equipmentId) query = query.eq('equipment_id', equipmentId)
    if (orgId && orgId !== 'all') query = query.eq('organization_id', orgId)
    if (date) query = query.eq('check_date', date)
    if (fromDate) query = query.gte('check_date', fromDate)

    const { data: checks, error } = await query

    if (error) {
      console.error('Error fetching ISCIR daily checks:', error)
      return NextResponse.json(
        { error: 'Eroare la încărcarea verificărilor zilnice' },
        { status: 500 }
      )
    }

    return NextResponse.json({ checks })
  } catch (error) {
    console.error('Error in GET /api/iscir/daily-checks:', error)
    return NextResponse.json(
      { error: 'Eroare la încărcarea verificărilor zilnice' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    const body = await request.json()
    const {
      equipment_id,
      organization_id,
      operator_name,
      check_date,
      check_items,
      issues_found,
      signed,
    } = body

    if (!equipment_id || !organization_id || !operator_name || !check_items) {
      return NextResponse.json(
        {
          error:
            'Câmpuri obligatorii lipsă: equipment_id, organization_id, operator_name, check_items',
        },
        { status: 400 }
      )
    }

    // Validate membership
    const { data: membership } = await supabase
      .from('memberships')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .eq('organization_id', organization_id)
      .eq('is_active', true)
      .single()

    if (!membership) {
      return NextResponse.json(
        { error: 'Nu aveți acces la această organizație' },
        { status: 403 }
      )
    }

    // Verify equipment exists and belongs to org
    const { data: equipment } = await supabase
      .from('iscir_equipment')
      .select('id, daily_check_required')
      .eq('id', equipment_id)
      .eq('organization_id', organization_id)
      .single()

    if (!equipment) {
      return NextResponse.json(
        { error: 'Echipament negăsit sau nu aparține organizației' },
        { status: 404 }
      )
    }

    const today = new Date().toISOString().split('T')[0]

    // Upsert: handles UNIQUE(equipment_id, check_date) gracefully
    const { data: check, error } = await supabase
      .from('iscir_daily_checks')
      .upsert(
        {
          equipment_id,
          organization_id,
          operator_name,
          check_date: check_date || today,
          check_items,
          issues_found: issues_found || null,
          signed: signed ?? false,
        },
        { onConflict: 'equipment_id,check_date' }
      )
      .select()
      .single()

    if (error) {
      console.error('Error upserting ISCIR daily check:', error)
      return NextResponse.json(
        { error: 'Eroare la salvarea verificării zilnice' },
        { status: 500 }
      )
    }

    return NextResponse.json({ check }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/iscir/daily-checks:', error)
    return NextResponse.json(
      { error: 'Eroare la salvarea verificării zilnice' },
      { status: 500 }
    )
  }
}
