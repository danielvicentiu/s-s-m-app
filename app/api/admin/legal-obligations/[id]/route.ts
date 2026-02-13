// app/api/admin/legal-obligations/[id]/route.ts
import { type NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

// PATCH - Update review status or edit obligation
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
      'description', 'original_text', 'article_ref', 'obligation_type',
      'deadline_type', 'deadline_details', 'severity', 'applies_to'
    ]

    const updateData: Record<string, any> = {}
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key]
      }
    }

    // Auto-set review metadata
    if (body.review_status) {
      updateData.reviewed_at = new Date().toISOString()
      updateData.reviewed_by = body.reviewed_by || 'admin'
      // If editing content, set status to 'edited'
      if (body.description && body.review_status !== 'rejected') {
        updateData.review_status = 'edited'
      }
    }

    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('legal_obligations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating obligation:', error)
      return NextResponse.json(
        { error: 'Eroare la actualizare obligație' },
        { status: 500 }
      )
    }

    return NextResponse.json({ obligation: data })
  } catch (error) {
    console.error('Error in PATCH obligation:', error)
    return NextResponse.json(
      { error: 'Eroare server' },
      { status: 500 }
    )
  }
}
