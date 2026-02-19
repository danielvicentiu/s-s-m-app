// app/api/ai-kb/search/route.ts
// AI Knowledge Base — Full-text search on ai_conversations using search_vector

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

interface StoredMessage {
  role: string
  content: string
  timestamp?: string
}

function extractSnippet(messages: unknown, query: string): string {
  if (!Array.isArray(messages)) return ''

  const searchTerm = query.toLowerCase()
  for (const msg of messages as StoredMessage[]) {
    if (typeof msg?.content !== 'string') continue
    const idx = msg.content.toLowerCase().indexOf(searchTerm)
    if (idx >= 0) {
      const start = Math.max(0, idx - 60)
      const end = Math.min(msg.content.length, idx + 140)
      const prefix = start > 0 ? '...' : ''
      const suffix = end < msg.content.length ? '...' : ''
      return prefix + msg.content.slice(start, end) + suffix
    }
  }
  return ''
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const q = (searchParams.get('q') || '').trim()
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get('per_page') || '20')))
    const offset = (page - 1) * perPage

    if (q.length < 2) {
      // Return latest conversations when no query
      const { data: latest, count } = await supabase
        .from('ai_conversations')
        .select('id, title, updated_at, created_at, organization_id', { count: 'exact' })
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .range(offset, offset + perPage - 1)

      return NextResponse.json({
        conversations: (latest || []).map(c => ({ ...c, snippet: '' })),
        total: count || 0,
        page,
        perPage,
        query: q,
      })
    }

    // Attempt full-text search via search_vector
    const { data: conversations, error, count } = await supabase
      .from('ai_conversations')
      .select('id, title, updated_at, created_at, organization_id, messages', { count: 'exact' })
      .eq('user_id', user.id)
      .textSearch('search_vector', q, { type: 'websearch', config: 'simple' })
      .order('updated_at', { ascending: false })
      .range(offset, offset + perPage - 1)

    if (!error) {
      return NextResponse.json({
        conversations: (conversations || []).map(c => ({
          id: c.id,
          title: c.title,
          updated_at: c.updated_at,
          created_at: c.created_at,
          organization_id: c.organization_id,
          snippet: extractSnippet(c.messages, q),
        })),
        total: count || 0,
        page,
        perPage,
        query: q,
      })
    }

    // Fallback: search by title only (when search_vector is unavailable)
    console.error('[AI-KB Search] search_vector unavailable, using title fallback:', error.message)

    const { data: fallback, error: fallbackError, count: fallbackCount } = await supabase
      .from('ai_conversations')
      .select('id, title, updated_at, created_at, organization_id, messages', { count: 'exact' })
      .eq('user_id', user.id)
      .ilike('title', `%${q}%`)
      .order('updated_at', { ascending: false })
      .range(offset, offset + perPage - 1)

    if (fallbackError) {
      throw fallbackError
    }

    return NextResponse.json({
      conversations: (fallback || []).map(c => ({
        id: c.id,
        title: c.title,
        updated_at: c.updated_at,
        created_at: c.created_at,
        organization_id: c.organization_id,
        snippet: extractSnippet(c.messages, q),
      })),
      total: fallbackCount || 0,
      page,
      perPage,
      query: q,
    })
  } catch (error) {
    console.error('[AI-KB Search] Unexpected error:', error)
    return NextResponse.json({ error: 'Eroare internă de server.' }, { status: 500 })
  }
}
