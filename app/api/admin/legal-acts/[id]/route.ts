// app/api/admin/legal-acts/[id]/route.ts
import { createSupabaseServer } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServer()

    // Get the act with all details
    const { data: act, error: actError } = await supabase
      .from('legal_acts')
      .select('*')
      .eq('id', id)
      .single()

    if (actError || !act) {
      return NextResponse.json(
        { error: 'Act legislativ negăsit' },
        { status: 404 }
      )
    }

    // Get obligations
    const { data: obligations } = await supabase
      .from('legal_obligations')
      .select('*')
      .eq('legal_act_id', id)
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true })

    // Get penalties
    const { data: penalties } = await supabase
      .from('legal_penalties')
      .select('*')
      .eq('legal_act_id', id)
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true })

    // Get cross references (where this act is source)
    const { data: crossRefs } = await supabase
      .from('legal_cross_references')
      .select('*')
      .eq('act_a_id', id)
      .order('created_at', { ascending: true })

    // Compute pipeline status
    const pipelineStatus = computePipelineStatus(act)

    // Compute review stats
    const reviewStats = {
      obligations: {
        total: obligations?.length || 0,
        pending: obligations?.filter(o => (o.review_status || 'pending') === 'pending').length || 0,
        approved: obligations?.filter(o => o.review_status === 'approved').length || 0,
        rejected: obligations?.filter(o => o.review_status === 'rejected').length || 0,
        edited: obligations?.filter(o => o.review_status === 'edited').length || 0,
      },
      penalties: {
        total: penalties?.length || 0,
        pending: penalties?.filter(p => (p.review_status || 'pending') === 'pending').length || 0,
        approved: penalties?.filter(p => p.review_status === 'approved').length || 0,
        rejected: penalties?.filter(p => p.review_status === 'rejected').length || 0,
      },
      crossRefs: {
        total: crossRefs?.length || 0,
      }
    }

    return NextResponse.json({
      act,
      obligations: obligations || [],
      penalties: penalties || [],
      crossReferences: crossRefs || [],
      pipelineStatus,
      reviewStats,
    })
  } catch (error) {
    console.error('Error fetching legal act detail:', error)
    return NextResponse.json(
      { error: 'Eroare server' },
      { status: 500 }
    )
  }
}

function computePipelineStatus(act: any): {
  step: number
  label: string
  color: string
} {
  if (act.validation_date) {
    return { step: 4, label: 'Validat M3', color: 'green' }
  }
  if (act.ai_extraction_date) {
    return { step: 3, label: 'Extras AI', color: 'blue' }
  }
  if (act.full_text) {
    return { step: 2, label: 'Text importat', color: 'yellow' }
  }
  return { step: 1, label: 'Fără text', color: 'gray' }
}
