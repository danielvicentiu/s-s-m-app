// FIȘIER: app/api/admin/legal-extract/route.ts
// M2: Claude Extraction — trimite full_text la Claude API, returnează obligații/sancțiuni/referințe structurate
//
// DEPENDENȚE: npm install @anthropic-ai/sdk (sau folosim fetch direct)
// ENV: ANTHROPIC_API_KEY în .env.local

import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ==========================================
// SYSTEM PROMPT PENTRU EXTRACȚIE LEGISLATIVĂ
// ==========================================

const EXTRACTION_SYSTEM_PROMPT = `Ești un expert juridic specializat în legislația românească de Securitate și Sănătate în Muncă (SSM), Prevenirea și Stingerea Incendiilor (PSI), GDPR și NIS2.

Primești textul integral al unui act normativ românesc. Trebuie să extragi TOATE informațiile structurate în format JSON strict.

REGULI CRITICE:
1. Extrage FIECARE obligație, nu omite niciuna
2. Fiecare obligație trebuie legată de articolul/alineatul exact
3. Sancțiunile trebuie să aibă sumele exacte în LEI
4. Referințele între acte trebuie complete (tip + număr + an)
5. Folosește DOAR informații din textul primit, nu inventa
6. Dacă o informație nu e clară, marchează cu "unclear" în câmpul confidence

RETURNEAZĂ EXCLUSIV JSON valid, fără text înainte sau după. Structura:`

const EXTRACTION_USER_PROMPT = (actShortName: string, actType: string) => `Analizează următorul act normativ (${actShortName}) și extrage TOATE obligațiile, sancțiunile și referințele.

Returnează JSON cu această structură exactă:

{
  "summary": "Descriere scurtă a actului (max 200 caractere)",
  "total_articles_found": <număr>,
  
  "obligations": [
    {
      "article_ref": "Art. X alin. (Y) lit. z)",
      "obligation_type": "employer" | "employee" | "sepp" | "authority" | "general",
      "description": "Textul obligației reformulat clar (max 300 char)",
      "original_text": "Citatul exact din lege (max 500 char)", 
      "deadline_type": "permanent" | "periodic" | "one_time" | "conditional",
      "deadline_details": "ex: la fiecare 6 luni / în termen de 30 zile / la angajare",
      "applies_to": ["toate firmele"] | ["construcții", "industrie"] | etc,
      "severity": "critical" | "important" | "informative",
      "confidence": "high" | "medium" | "low"
    }
  ],
  
  "penalties": [
    {
      "article_ref": "Art. X alin. (Y)",
      "violation_description": "Ce încălcare atrage sancțiunea",
      "penalty_type": "amenda_contraventionala" | "amenda_penala" | "suspendare_activitate" | "avertisment",
      "min_amount_lei": <număr sau null>,
      "max_amount_lei": <număr sau null>,
      "recipient": "angajator" | "angajat" | "persoana_fizica" | "persoana_juridica",
      "authority": "ITM" | "ISU" | "ANSPDCP" | "DSP" | "alt",
      "confidence": "high" | "medium" | "low"
    }
  ],
  
  "cross_references": [
    {
      "source_article": "Art. X din actul curent",
      "target_act_type": "LEGE" | "HG" | "OUG" | "OG" | "ORDIN" | "NORMA",
      "target_act_number": "319",
      "target_act_year": 2006,
      "target_article": "Art. Y" | null,
      "reference_type": "transpune" | "modifica" | "completeaza" | "abroga" | "trimite_la",
      "description": "Context scurt al referinței"
    }
  ],
  
  "key_definitions": [
    {
      "term": "Termenul definit",
      "definition": "Definiția din lege",
      "article_ref": "Art. X"
    }
  ],
  
  "metadata": {
    "has_penalties": true | false,
    "penalty_min_lei": <cel mai mic minim din toate sancțiunile>,
    "penalty_max_lei": <cel mai mare maxim din toate sancțiunile>,
    "total_obligations_employer": <număr>,
    "total_obligations_employee": <număr>,
    "total_penalties": <număr>,
    "total_cross_references": <număr>,
    "extraction_notes": "Observații ale AI despre calitatea textului sau probleme întâlnite"
  }
}

TEXTUL ACTULUI NORMATIV (${actType}):
`

// ==========================================
// CHUNK LOGIC — pentru texte >100k caractere
// ==========================================

function splitTextIntoChunks(text: string, maxChars: number = 50000): string[] {
  if (text.length <= maxChars) {return [text]}
  
  const chunks: string[] = []
  let remaining = text
  
  while (remaining.length > 0) {
    if (remaining.length <= maxChars) {
      chunks.push(remaining)
      break
    }
    
    // Caută un punct de tăiere natural (capitol, secțiune, articol)
    let cutPoint = maxChars
    const searchArea = remaining.substring(maxChars - 2000, maxChars + 2000)
    
    // Preferă tăietura la început de capitol
    const chapterBreak = searchArea.lastIndexOf('\nCAPITOLUL')
    if (chapterBreak > 0) {
      cutPoint = maxChars - 2000 + chapterBreak
    } else {
      // Sau la început de articol
      const articleBreak = searchArea.lastIndexOf('\nArt.')
      if (articleBreak > 0) {
        cutPoint = maxChars - 2000 + articleBreak
      }
    }
    
    chunks.push(remaining.substring(0, cutPoint))
    remaining = remaining.substring(cutPoint)
  }
  
  return chunks
}

// ==========================================
// CALL CLAUDE API
// ==========================================

async function callClaudeAPI(systemPrompt: string, userMessage: string): Promise<any> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY lipsește din .env.local')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      temperature: 0,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userMessage }
      ],
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Claude API error ${response.status}: ${errorBody}`)
  }

  const data = await response.json()
  const textContent = data.content?.find((c: any) => c.type === 'text')?.text

  if (!textContent) {
    throw new Error('Claude API nu a returnat text.')
  }

  // Parsare JSON — mai robustă
  // Strip markdown fences
  let cleaned = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  
  // Dacă Claude a adăugat text înainte/după JSON, extrage doar JSON-ul
  const jsonStart = cleaned.indexOf('{')
  const jsonEnd = cleaned.lastIndexOf('}')
  
  if (jsonStart === -1 || jsonEnd === -1) {
    console.error('No JSON found in response:', textContent.substring(0, 500))
    throw new Error(`Claude nu a returnat JSON. Primele 200 char: ${cleaned.substring(0, 200)}`)
  }
  
  cleaned = cleaned.substring(jsonStart, jsonEnd + 1)
  
  // Strategii de parsare în ordine
  const parseStrategies = [
    // 1. Direct parse
    () => JSON.parse(cleaned),
    // 2. Fix trailing commas
    () => JSON.parse(cleaned.replace(/,\s*([}\]])/g, '$1')),
    // 3. Fix unescaped control characters in strings
    () => {
      const fixed = cleaned.replace(/[\x00-\x1F\x7F]/g, (match) => {
        if (match === '\n') {return '\\n'}
        if (match === '\r') {return '\\r'}
        if (match === '\t') {return '\\t'}
        return ''
      })
      return JSON.parse(fixed)
    },
    // 4. Fix trailing commas + control characters
    () => {
      const fixed = cleaned
        .replace(/,\s*([}\]])/g, '$1')
        .replace(/[\x00-\x1F\x7F]/g, (match) => {
          if (match === '\n') {return '\\n'}
          if (match === '\r') {return '\\r'}
          if (match === '\t') {return '\\t'}
          return ''
        })
      return JSON.parse(fixed)
    },
  ]
  
  for (let i = 0; i < parseStrategies.length; i++) {
    try {
      return parseStrategies[i]()
    } catch (e) {
      if (i === parseStrategies.length - 1) {
        // Ultima strategie eșuată — log și throw
        console.error(`JSON parse error after ${parseStrategies.length} strategies.`)
        console.error('Raw response (first 1500 chars):', cleaned.substring(0, 1500))
        console.error('Raw response (last 500 chars):', cleaned.substring(cleaned.length - 500))
        throw new Error(`Claude a returnat JSON invalid. Primele 300 char: ${cleaned.substring(0, 300)}`)
      }
    }
  }
  
  // Typescript safety (nu ajunge aici)
  throw new Error('JSON parse failed unexpectedly')
}

// ==========================================
// MERGE CHUNKS — combină rezultatele din mai multe chunk-uri
// ==========================================

function mergeExtractions(extractions: any[]): any {
  if (extractions.length === 1) {return extractions[0]}
  
  const merged = {
    summary: extractions[0].summary,
    total_articles_found: 0,
    obligations: [] as any[],
    penalties: [] as any[],
    cross_references: [] as any[],
    key_definitions: [] as any[],
    metadata: {
      has_penalties: false,
      penalty_min_lei: null as number | null,
      penalty_max_lei: null as number | null,
      total_obligations_employer: 0,
      total_obligations_employee: 0,
      total_penalties: 0,
      total_cross_references: 0,
      extraction_notes: `Textul a fost procesat în ${extractions.length} chunk-uri.`,
    }
  }

  for (const ext of extractions) {
    merged.total_articles_found += ext.total_articles_found || 0
    merged.obligations.push(...(ext.obligations || []))
    merged.penalties.push(...(ext.penalties || []))
    merged.cross_references.push(...(ext.cross_references || []))
    merged.key_definitions.push(...(ext.key_definitions || []))
    
    if (ext.metadata?.has_penalties) {merged.metadata.has_penalties = true}
    if (ext.metadata?.penalty_min_lei != null) {
      merged.metadata.penalty_min_lei = merged.metadata.penalty_min_lei == null
        ? ext.metadata.penalty_min_lei
        : Math.min(merged.metadata.penalty_min_lei, ext.metadata.penalty_min_lei)
    }
    if (ext.metadata?.penalty_max_lei != null) {
      merged.metadata.penalty_max_lei = merged.metadata.penalty_max_lei == null
        ? ext.metadata.penalty_max_lei
        : Math.max(merged.metadata.penalty_max_lei, ext.metadata.penalty_max_lei)
    }
  }

  // Deduplicate cross_references
  const crSet = new Set<string>()
  merged.cross_references = merged.cross_references.filter((cr: any) => {
    const key = `${cr.target_act_type}-${cr.target_act_number}-${cr.target_act_year}-${cr.reference_type}`
    if (crSet.has(key)) {return false}
    crSet.add(key)
    return true
  })

  // Update totals
  merged.metadata.total_obligations_employer = merged.obligations.filter((o: any) => o.obligation_type === 'employer').length
  merged.metadata.total_obligations_employee = merged.obligations.filter((o: any) => o.obligation_type === 'employee').length
  merged.metadata.total_penalties = merged.penalties.length
  merged.metadata.total_cross_references = merged.cross_references.length

  return merged
}

// ==========================================
// SAVE TO DATABASE
// ==========================================

async function saveExtractionToDB(actId: string, extraction: any) {
  const errors: string[] = []

  // 1. Update legal_acts cu metadata extrasă
  const { error: actError } = await supabaseAdmin
    .from('legal_acts')
    .update({
      has_penalties: extraction.metadata.has_penalties,
      penalty_min_lei: extraction.metadata.penalty_min_lei,
      penalty_max_lei: extraction.metadata.penalty_max_lei,
      obligations_employer: extraction.obligations.filter((o: any) => o.obligation_type === 'employer'),
      obligations_employee: extraction.obligations.filter((o: any) => o.obligation_type === 'employee'),
      confidence_level: 'ai_extracted',
      research_phase: 'ai_extracted',
      ai_extraction_result: extraction,
      ai_extraction_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', actId)

  if (actError) {errors.push(`legal_acts update: ${actError.message}`)}

  // 2. Insert obligații în legal_obligations (dacă tabela există)
  if (extraction.obligations.length > 0) {
    const obligationsRows = extraction.obligations.map((o: any, idx: number) => ({
      legal_act_id: actId,
      article_ref: o.article_ref,
      obligation_type: o.obligation_type,
      description: o.description,
      original_text: o.original_text,
      deadline_type: o.deadline_type,
      deadline_details: o.deadline_details,
      applies_to: o.applies_to,
      severity: o.severity,
      confidence: o.confidence,
      sort_order: idx + 1,
    }))

    // Delete existing obligations for this act (re-extraction = replace)
    await supabaseAdmin
      .from('legal_obligations')
      .delete()
      .eq('legal_act_id', actId)

    const { error: oblError } = await supabaseAdmin
      .from('legal_obligations')
      .insert(obligationsRows)

    if (oblError) {errors.push(`legal_obligations: ${oblError.message}`)}
  }

  // 3. Insert sancțiuni în legal_penalties (dacă tabela există)
  if (extraction.penalties.length > 0) {
    const penaltyRows = extraction.penalties.map((p: any, idx: number) => ({
      legal_act_id: actId,
      article_ref: p.article_ref,
      violation_description: p.violation_description,
      penalty_type: p.penalty_type,
      min_amount_lei: p.min_amount_lei,
      max_amount_lei: p.max_amount_lei,
      recipient: p.recipient,
      authority: p.authority,
      confidence: p.confidence,
      sort_order: idx + 1,
    }))

    await supabaseAdmin
      .from('legal_penalties')
      .delete()
      .eq('legal_act_id', actId)

    const { error: penError } = await supabaseAdmin
      .from('legal_penalties')
      .insert(penaltyRows)

    if (penError) {errors.push(`legal_penalties: ${penError.message}`)}
  }

  // 4. Insert referințe în legal_cross_references (act_a_id = source, act_b_id = target)
  if (extraction.cross_references.length > 0) {
    const crRows = extraction.cross_references.map((cr: any) => ({
      act_a_id: actId,
      act_b_id: null, // Se populează ulterior când actul target e și el importat
      source_article: cr.source_article,
      target_act_type: cr.target_act_type,
      target_act_number: cr.target_act_number,
      target_act_year: cr.target_act_year,
      target_article: cr.target_article,
      relationship_type: cr.reference_type,
      description: cr.description,
    }))

    await supabaseAdmin
      .from('legal_cross_references')
      .delete()
      .eq('act_a_id', actId)

    const { error: crError } = await supabaseAdmin
      .from('legal_cross_references')
      .insert(crRows)

    if (crError) {errors.push(`legal_cross_references: ${crError.message}`)}
  }

  return errors
}

// ==========================================
// POST: Extrage obligații din act
// ==========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { act_id } = body

    if (!act_id) {
      return NextResponse.json(
        { error: 'act_id este obligatoriu.' },
        { status: 400 }
      )
    }

    // 1. Citește actul din DB
    const { data: act, error: fetchError } = await supabaseAdmin
      .from('legal_acts')
      .select('id, act_type, act_short_name, act_full_name, full_text, full_text_metadata')
      .eq('id', act_id)
      .single()

    if (fetchError || !act) {
      return NextResponse.json(
        { error: `Act negăsit: ${fetchError?.message || 'ID invalid'}` },
        { status: 404 }
      )
    }

    if (!act.full_text || act.full_text.length < 100) {
      return NextResponse.json(
        { error: 'Actul nu are text importat (full_text gol sau prea scurt).' },
        { status: 400 }
      )
    }

    // 2. Split în chunks dacă e necesar
    const chunks = splitTextIntoChunks(act.full_text, 50000)
    console.log(`[M2] Procesez ${act.act_short_name}: ${act.full_text.length} chars, ${chunks.length} chunk(s)`)

    // 3. Trimite fiecare chunk la Claude API
    const extractions: any[] = []
    for (let i = 0; i < chunks.length; i++) {
      const chunkLabel = chunks.length > 1 ? ` (parte ${i + 1}/${chunks.length})` : ''
      const userMessage = EXTRACTION_USER_PROMPT(
        act.act_short_name + chunkLabel,
        act.act_type
      ) + chunks[i]

      console.log(`[M2] Trimit chunk ${i + 1}/${chunks.length} la Claude (${chunks[i].length} chars)`)
      const result = await callClaudeAPI(EXTRACTION_SYSTEM_PROMPT, userMessage)
      extractions.push(result)
    }

    // 4. Merge rezultate
    const finalExtraction = mergeExtractions(extractions)

    // 5. Salvează în DB
    const saveErrors = await saveExtractionToDB(act.id, finalExtraction)

    // 6. Response
    return NextResponse.json({
      success: true,
      act_short_name: act.act_short_name,
      chunks_processed: chunks.length,
      stats: {
        obligations: finalExtraction.obligations.length,
        obligations_employer: finalExtraction.metadata.total_obligations_employer,
        obligations_employee: finalExtraction.metadata.total_obligations_employee,
        penalties: finalExtraction.penalties.length,
        cross_references: finalExtraction.cross_references.length,
        key_definitions: finalExtraction.key_definitions.length,
        has_penalties: finalExtraction.metadata.has_penalties,
        penalty_range: finalExtraction.metadata.penalty_min_lei && finalExtraction.metadata.penalty_max_lei
          ? `${finalExtraction.metadata.penalty_min_lei.toLocaleString()} - ${finalExtraction.metadata.penalty_max_lei.toLocaleString()} LEI`
          : null,
      },
      save_errors: saveErrors.length > 0 ? saveErrors : null,
      extraction: finalExtraction, // Returnăm și JSON-ul complet pentru preview
    })

  } catch (err: any) {
    console.error('[M2] Extraction error:', err)
    return NextResponse.json(
      { error: err.message || 'Eroare la extracția AI.' },
      { status: 500 }
    )
  }
}
