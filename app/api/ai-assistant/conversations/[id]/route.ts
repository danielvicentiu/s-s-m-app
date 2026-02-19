// app/api/ai-assistant/conversations/[id]/route.ts
// VA-AI: Get a single conversation with its messages

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServer()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const { data, error } = await supabase
      .from('ai_conversations')
      .select('id, title, messages, created_at, updated_at, organization_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Conversație negăsită' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[AI Conversation GET by ID] Unexpected error:', error)
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 })
  }
}
