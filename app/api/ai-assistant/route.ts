// app/api/ai-assistant/route.ts
// VA-AI: Main AI Assistant endpoint with RAG legislation, org context, conversation history

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

// Split message into keywords and build a Supabase OR filter for legal_acts
function buildLegalActsFilter(message: string): string {
  const stopwords = new Set([
    'și', 'sau', 'dar', 'pentru', 'cu', 'la', 'în', 'de', 'pe', 'că',
    'este', 'sunt', 'the', 'and', 'or', 'for', 'with', 'in', 'is', 'are',
    'a', 'an', 'to', 'of', 'at', 'by', 'this', 'that', 'from',
    'care', 'care', 'cum', 'când', 'ce', 'cine', 'unde', 'cum'
  ])

  const words = message
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopwords.has(w))
    .slice(0, 5) // top 5 keywords

  if (words.length === 0) return ''

  return words
    .map(w => `act_short_name.ilike.%${w}%,act_full_name.ilike.%${w}%`)
    .join(',')
}

async function getRagContext(supabase: Awaited<ReturnType<typeof createSupabaseServer>>, message: string): Promise<{ text: string; sources: Array<{ act_title: string; act_id: string }> }> {
  const filter = buildLegalActsFilter(message)
  if (!filter) return { text: '', sources: [] }

  const { data: acts, error } = await supabase
    .from('legal_acts')
    .select('id, act_short_name, act_full_name, act_type, act_number, act_year, ai_extraction_result')
    .or(filter)
    .limit(3)

  if (error || !acts || acts.length === 0) return { text: '', sources: [] }

  const sources: Array<{ act_title: string; act_id: string }> = []
  const ragLines: string[] = ['LEGISLAȚIE RELEVANTĂ:']

  for (const act of acts) {
    const title = act.act_short_name || act.act_full_name || `${act.act_type} ${act.act_number}/${act.act_year}`
    sources.push({ act_title: title, act_id: act.id })

    // Extract text content from ai_extraction_result (JSONB) or use title only
    let content = ''
    if (act.ai_extraction_result && typeof act.ai_extraction_result === 'object') {
      const extraction = act.ai_extraction_result as Record<string, unknown>
      content = String(extraction.summary || extraction.text || extraction.content || '').slice(0, 500)
    } else if (typeof act.ai_extraction_result === 'string') {
      content = act.ai_extraction_result.slice(0, 500)
    }

    ragLines.push(`- ${title}${content ? ': ' + content : ''}`)
  }

  return { text: ragLines.join('\n'), sources }
}

async function getOrgContext(supabase: Awaited<ReturnType<typeof createSupabaseServer>>, organizationId: string): Promise<string> {
  const today = new Date().toISOString().split('T')[0]

  const [
    { data: org },
    { count: totalEmployees },
    { count: activeEmployees },
    { count: expiredTrainings },
    { count: expiredMedical },
    { count: totalPsi },
    { count: expiredPsi },
    { count: totalIscir },
    { count: expiredIscir },
    { count: gdprActivities },
    { data: dpoData },
    { count: openNearMiss }
  ] = await Promise.all([
    supabase.from('organizations').select('name').eq('id', organizationId).single(),
    supabase.from('employees').select('id', { count: 'exact', head: true }).eq('organization_id', organizationId),
    supabase.from('employees').select('id', { count: 'exact', head: true }).eq('organization_id', organizationId).eq('is_active', true),
    supabase.from('training_sessions').select('id', { count: 'exact', head: true }).eq('organization_id', organizationId).eq('status', 'expired'),
    supabase.from('medical_examinations').select('id', { count: 'exact', head: true }).eq('organization_id', organizationId).lt('expiry_date', today),
    supabase.from('psi_equipment').select('id', { count: 'exact', head: true }).eq('organization_id', organizationId),
    supabase.from('psi_equipment').select('id', { count: 'exact', head: true }).eq('organization_id', organizationId).or(`status.eq.expired,next_inspection_date.lt.${today}`),
    supabase.from('iscir_equipment').select('id', { count: 'exact', head: true }).eq('organization_id', organizationId),
    supabase.from('iscir_equipment').select('id', { count: 'exact', head: true }).eq('organization_id', organizationId).or(`status.eq.expired,next_verification_date.lt.${today}`),
    supabase.from('gdpr_processing_activities').select('id', { count: 'exact', head: true }).eq('organization_id', organizationId),
    supabase.from('gdpr_dpo').select('name').eq('organization_id', organizationId).limit(1),
    supabase.from('near_miss_reports').select('id', { count: 'exact', head: true }).eq('organization_id', organizationId).eq('status', 'open')
  ])

  const orgName = org?.name || 'Organizație'
  const lines = [`CONTEXT ORGANIZAȚIE (${orgName}):`]

  lines.push(`- ${activeEmployees ?? 0} angajați activi din ${totalEmployees ?? 0} total`)
  if ((expiredTrainings ?? 0) > 0) lines.push(`- ⚠️ ${expiredTrainings} instruiri expirate`)
  else lines.push(`- Instruiri: fără expirări`)
  if ((expiredMedical ?? 0) > 0) lines.push(`- ⚠️ ${expiredMedical} fișe medicale expirate`)
  else lines.push(`- Medicale: fără expirări`)
  if ((totalPsi ?? 0) > 0) lines.push(`- PSI: ${totalPsi} echipamente, ${expiredPsi ?? 0} necesită inspecție`)
  if ((totalIscir ?? 0) > 0) lines.push(`- ISCIR: ${totalIscir} echipamente, ${expiredIscir ?? 0} expirate`)
  lines.push(`- GDPR: ${gdprActivities ?? 0} activități de prelucrare, DPO: ${dpoData && dpoData.length > 0 ? dpoData[0].name : 'nedesemnat'}`)
  if ((openNearMiss ?? 0) > 0) lines.push(`- ⚠️ ${openNearMiss} incidente near-miss deschise`)

  return lines.join('\n')
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { message, conversationId, organizationId } = body as {
      message: string
      conversationId?: string
      organizationId: string
    }

    if (!message || !organizationId) {
      return NextResponse.json({ error: 'message și organizationId sunt obligatorii' }, { status: 400 })
    }

    // Verify user has access to this organization
    const { data: membership } = await supabase
      .from('memberships')
      .select('id')
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Acces interzis la această organizație' }, { status: 403 })
    }

    // Load existing conversation if provided
    let existingMessages: Message[] = []
    let activeConversationId = conversationId

    if (conversationId) {
      const { data: conv } = await supabase
        .from('ai_conversations')
        .select('messages')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single()

      if (conv?.messages && Array.isArray(conv.messages)) {
        existingMessages = conv.messages as Message[]
      }
    }

    // Build RAG context and org context in parallel
    const [ragResult, orgContext] = await Promise.all([
      getRagContext(supabase, message),
      getOrgContext(supabase, organizationId)
    ])

    const systemPrompt = `Ești VA-AI, asistentul virtual pentru securitatea și sănătatea în muncă al platformei s-s-m.ro.

REGULI:
- Răspunzi ÎNTOTDEAUNA în limba în care ți se scrie (română, engleză, bulgară, maghiară, germană)
- Citezi legislația exact cu articol și alineat când e disponibilă
- Dacă nu ai informația în contextul legislativ furnizat, spui clar că nu ai găsit și recomanzi consultarea unui specialist
- Când menționezi neconformități, fii specific: care angajat, ce instruire, când expiră
- NU inventezi articole de lege sau referințe legislative
- Ești profesionist dar accesibil, folosești limbaj clar nu juridic excesiv
- Poți efectua verificări de conformitate când ți se cere
- Poți simula un control ITM când ți se cere

${ragResult.text ? ragResult.text + '\n\n' : ''}${orgContext}`

    // Build conversation messages for Anthropic
    const conversationMessages = [
      ...existingMessages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: message }
    ]

    // Call Anthropic API
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: systemPrompt,
        messages: conversationMessages
      })
    })

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text()
      console.error('[AI Assistant] Anthropic API error:', errText)
      return NextResponse.json({ error: 'Eroare la generarea răspunsului AI' }, { status: 500 })
    }

    const anthropicData = await anthropicResponse.json()
    const aiResponse = anthropicData.content?.[0]?.text || 'Nu am putut genera un răspuns.'

    // Update conversation messages
    const now = new Date().toISOString()
    const updatedMessages: Message[] = [
      ...existingMessages,
      { role: 'user', content: message, timestamp: now },
      { role: 'assistant', content: aiResponse, timestamp: now }
    ]

    // Generate title from first message if new conversation
    const title = existingMessages.length === 0
      ? message.slice(0, 60) + (message.length > 60 ? '...' : '')
      : undefined

    // Save conversation
    if (activeConversationId) {
      await supabase
        .from('ai_conversations')
        .update({ messages: updatedMessages, updated_at: now })
        .eq('id', activeConversationId)
        .eq('user_id', user.id)
    } else {
      const { data: newConv } = await supabase
        .from('ai_conversations')
        .insert({
          organization_id: organizationId,
          user_id: user.id,
          title: title || 'Conversație nouă',
          messages: updatedMessages
        })
        .select('id')
        .single()

      activeConversationId = newConv?.id
    }

    return NextResponse.json({
      response: aiResponse,
      conversationId: activeConversationId,
      sources: ragResult.sources
    })
  } catch (error) {
    console.error('[AI Assistant] Unexpected error:', error)
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 })
  }
}
