// app/api/nis2/checklist/route.ts
// NIS2 Checklist Items — GET by assessment, PUT bulk update

import { createSupabaseServer } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    const assessmentId = request.nextUrl.searchParams.get('assessment_id')
    if (!assessmentId) {
      return NextResponse.json({ error: 'assessment_id este obligatoriu' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('nis2_checklist_items')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('item_code')

    if (error) {
      console.error('Error fetching checklist items:', error)
      return NextResponse.json({ error: 'Eroare la încărcarea datelor' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    const body = await request.json()
    const { assessment_id, items } = body

    if (!assessment_id || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Date invalide' }, { status: 400 })
    }

    // Update each item individually
    const updates = items.map((item: { id: string; is_compliant?: boolean; evidence?: string; responsible_person?: string; deadline?: string; priority?: string; notes?: string }) =>
      supabase
        .from('nis2_checklist_items')
        .update({
          is_compliant: item.is_compliant,
          evidence: item.evidence || null,
          responsible_person: item.responsible_person || null,
          deadline: item.deadline || null,
          priority: item.priority || 'medium',
          notes: item.notes || null,
        })
        .eq('id', item.id)
        .eq('assessment_id', assessment_id)
    )

    await Promise.all(updates)

    // Recalculate overall score
    const { data: allItems } = await supabase
      .from('nis2_checklist_items')
      .select('is_compliant')
      .eq('assessment_id', assessment_id)

    if (allItems && allItems.length > 0) {
      const compliantCount = allItems.filter(i => i.is_compliant).length
      const score = Math.round((compliantCount / allItems.length) * 100)

      await supabase
        .from('nis2_assessments')
        .update({ overall_score: score, status: score === 100 ? 'completed' : 'in_progress' })
        .eq('id', assessment_id)
    }

    // Fetch updated items
    const { data: updatedItems } = await supabase
      .from('nis2_checklist_items')
      .select('*')
      .eq('assessment_id', assessment_id)
      .order('item_code')

    return NextResponse.json(updatedItems)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 })
  }
}
