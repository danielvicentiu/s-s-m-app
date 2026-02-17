// app/api/ai-assistant/conversations/route.ts
// VA-AI: List and delete conversations

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

// GET /api/ai-assistant/conversations?organization_id=...
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const organizationId = request.nextUrl.searchParams.get('organization_id')

    let query = supabase
      .from('ai_conversations')
      .select('id, title, created_at, updated_at, organization_id')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(20)

    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    }

    const { data, error } = await query

    if (error) {
      console.error('[AI Conversations GET] Error:', error)
      return NextResponse.json({ error: 'Eroare la preluarea conversațiilor' }, { status: 500 })
    }

    return NextResponse.json({ conversations: data || [] })
  } catch (error) {
    console.error('[AI Conversations GET] Unexpected error:', error)
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 })
  }
}

// DELETE /api/ai-assistant/conversations?id=...
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const conversationId = request.nextUrl.searchParams.get('id')
    if (!conversationId) {
      return NextResponse.json({ error: 'id este obligatoriu' }, { status: 400 })
    }

    const { error } = await supabase
      .from('ai_conversations')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', user.id)

    if (error) {
      console.error('[AI Conversations DELETE] Error:', error)
      return NextResponse.json({ error: 'Eroare la ștergerea conversației' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[AI Conversations DELETE] Unexpected error:', error)
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 })
  }
}
