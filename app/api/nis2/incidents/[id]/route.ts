// app/api/nis2/incidents/[id]/route.ts
// NIS2 Single Incident — GET, PUT, DELETE

import { createSupabaseServer } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    const { id } = await params

    const { data, error } = await supabase
      .from('nis2_incidents')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Incident negăsit' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const { id: _id, organization_id: _orgId, created_at: _ca, incident_number: _num, ...updateData } = body

    // If closing, set closed_at and closed_by
    if (updateData.status === 'closed' && !updateData.closed_at) {
      updateData.closed_at = new Date().toISOString()
      updateData.closed_by = user.id
    }

    const { data, error } = await supabase
      .from('nis2_incidents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating NIS2 incident:', error)
      return NextResponse.json({ error: 'Eroare la actualizare' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    const { id } = await params

    const { error } = await supabase
      .from('nis2_incidents')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting NIS2 incident:', error)
      return NextResponse.json({ error: 'Eroare la ștergere' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 })
  }
}
