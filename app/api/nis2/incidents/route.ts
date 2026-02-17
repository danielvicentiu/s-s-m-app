// app/api/nis2/incidents/route.ts
// NIS2 Incidents — GET list, POST create

import { createSupabaseServer } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    const orgId = request.nextUrl.searchParams.get('org_id')
    const severity = request.nextUrl.searchParams.get('severity')
    const status = request.nextUrl.searchParams.get('status')

    let query = supabase
      .from('nis2_incidents')
      .select('*')
      .order('incident_date', { ascending: false })

    if (orgId) query = query.eq('organization_id', orgId)
    if (severity) query = query.eq('severity', severity)
    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) {
      console.error('Error fetching NIS2 incidents:', error)
      return NextResponse.json({ error: 'Eroare la încărcarea datelor' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    const body = await request.json()

    let organizationId = body.organization_id
    if (!organizationId) {
      const { data: membership } = await supabase
        .from('memberships')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()
      if (!membership) {
        return NextResponse.json({ error: 'Organizație negăsită' }, { status: 404 })
      }
      organizationId = membership.organization_id
    }

    const { data, error } = await supabase
      .from('nis2_incidents')
      .insert({
        organization_id: organizationId,
        incident_number: '', // Will be set by trigger
        title: body.title,
        description: body.description,
        incident_date: body.incident_date,
        detected_date: body.detected_date || body.incident_date,
        reported_date: body.reported_date || null,
        incident_type: body.incident_type,
        severity: body.severity,
        is_significant: body.is_significant || false,
        affected_systems: body.affected_systems || [],
        affected_users_count: body.affected_users_count || 0,
        root_cause: body.root_cause || null,
        immediate_actions: body.immediate_actions || null,
        corrective_actions: body.corrective_actions || null,
        reported_to_authority: body.reported_to_authority || false,
        authority_report_date: body.authority_report_date || null,
        status: body.status || 'detected',
        reported_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating NIS2 incident:', error)
      return NextResponse.json({ error: 'Eroare la creare incident' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 })
  }
}
