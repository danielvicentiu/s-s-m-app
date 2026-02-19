// app/api/ai-kb/import/route.ts
// AI Knowledge Base — Import Claude JSON export → ai_conversations + ai_artifacts

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

// Claude.ai export format interfaces
interface ClaudeAttachment {
  file_name: string
  file_type: string
  extracted_content?: string
}

interface ClaudeMessage {
  uuid: string
  text: string
  sender: 'human' | 'assistant'
  created_at: string
  updated_at?: string
  attachments?: ClaudeAttachment[]
  files?: Array<{ file_name: string }>
}

interface ClaudeConversation {
  uuid: string
  name: string
  created_at: string
  updated_at: string
  chat_messages: ClaudeMessage[]
}

interface ParsedMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface ExtractedArtifact {
  artifact_type: string
  title: string
  content: string
  language?: string
}

function parseMessages(chatMessages: ClaudeMessage[]): ParsedMessage[] {
  return (chatMessages || [])
    .filter(m => m.text && m.text.trim().length > 0)
    .map(m => ({
      role: m.sender === 'human' ? 'user' : 'assistant',
      content: m.text,
      timestamp: m.created_at,
    }))
}

function extractCodeArtifacts(chatMessages: ClaudeMessage[]): ExtractedArtifact[] {
  const artifacts: ExtractedArtifact[] = []
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g

  for (const msg of chatMessages) {
    if (msg.sender !== 'assistant' || !msg.text) continue

    let match: RegExpExecArray | null
    let codeIndex = 0
    codeBlockRegex.lastIndex = 0

    while ((match = codeBlockRegex.exec(msg.text)) !== null) {
      const language = match[1] || 'text'
      const content = match[2]?.trim() || ''
      if (content.length > 50) {
        codeIndex++
        const firstLine = content.split('\n')[0] || ''
        artifacts.push({
          artifact_type: 'code',
          title: firstLine.length > 5 && firstLine.length < 80
            ? firstLine
            : `Bloc ${language} #${codeIndex}`,
          content,
          language,
        })
      }
    }
  }

  return artifacts
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { conversations: rawConversations, organization_id } = body as {
      conversations: unknown
      organization_id: string
    }

    if (!Array.isArray(rawConversations) || rawConversations.length === 0) {
      return NextResponse.json(
        { error: 'Fișierul JSON nu conține conversații valide.' },
        { status: 400 }
      )
    }

    if (!organization_id) {
      return NextResponse.json(
        { error: 'organization_id este obligatoriu.' },
        { status: 400 }
      )
    }

    // Verify user has access to this organization
    const { data: membership } = await supabase
      .from('memberships')
      .select('id')
      .eq('user_id', user.id)
      .eq('organization_id', organization_id)
      .eq('is_active', true)
      .single()

    if (!membership) {
      return NextResponse.json(
        { error: 'Acces interzis la această organizație.' },
        { status: 403 }
      )
    }

    let importedConversations = 0
    let importedArtifacts = 0
    const errors: string[] = []

    // Limit to 200 conversations per import
    const conversationsToImport = (rawConversations as ClaudeConversation[]).slice(0, 200)

    for (const conv of conversationsToImport) {
      try {
        if (!conv.uuid || !conv.name) continue

        const messages = parseMessages(conv.chat_messages || [])
        if (messages.length === 0) continue

        const { data: savedConv, error: convError } = await supabase
          .from('ai_conversations')
          .insert({
            organization_id,
            user_id: user.id,
            title: conv.name || 'Conversație importată',
            messages,
            created_at: conv.created_at || new Date().toISOString(),
            updated_at: conv.updated_at || new Date().toISOString(),
          })
          .select('id')
          .single()

        if (convError) {
          errors.push(`"${conv.name}": ${convError.message}`)
          continue
        }

        importedConversations++

        // Extract code artifacts from assistant messages
        const artifacts = extractCodeArtifacts(conv.chat_messages || [])
        for (const artifact of artifacts) {
          const { error: artError } = await supabase
            .from('ai_artifacts')
            .insert({
              conversation_id: savedConv.id,
              user_id: user.id,
              artifact_type: artifact.artifact_type,
              title: artifact.title,
              content: artifact.content,
              language: artifact.language || null,
            })

          if (!artError) {
            importedArtifacts++
          }
        }
      } catch (e) {
        errors.push(
          `Conversație "${conv?.name || '?'}": ${e instanceof Error ? e.message : 'Eroare necunoscută'}`
        )
      }
    }

    return NextResponse.json({
      success: true,
      imported: importedConversations,
      artifacts: importedArtifacts,
      total: rawConversations.length,
      errors: errors.slice(0, 10),
    })
  } catch (error) {
    console.error('[AI-KB Import] Unexpected error:', error)
    return NextResponse.json({ error: 'Eroare internă de server.' }, { status: 500 })
  }
}
