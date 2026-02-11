// app/api/admin/legal-penalties/[id]/route.ts
import { createSupabaseServer } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = await createSupabaseServer()

    const allowedFields = [
      'review_status', 'review_notes', 'reviewed_at', 'reviewed_by',
      'violation_description', 'penalty_type', 'min_amount_lei', 'max_amount_lei',
      'recipient', 'authority', 'article_ref'
    ]

    const updateData: Record<string, any> = {}
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key]
      }
    }

    if (body.review_status) {
      updateData.reviewed_at = new Date().toISOString()
      updateData.reviewed_by = body.reviewed_by || 'admin'
    }

    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('legal_penalties')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating penalty:', error)
      return NextResponse.json(
        { error: 'Eroare la actualizare sancțiune' },
        { status: 500 }
      )
    }

    return NextResponse.json({ penalty: data })
  } catch (error) {
    console.error('Error in PATCH penalty:', error)
    return NextResponse.json(
      { error: 'Eroare server' },
      { status: 500 }
    )
  }
}
