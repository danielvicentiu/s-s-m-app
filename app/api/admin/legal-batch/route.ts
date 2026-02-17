// FIȘIER: app/api/admin/legal-batch/route.ts
// M6: Batch Processing — procesare automată M2 (extracție AI) + M3 (validare) pe toate actele eligibile
//
// Endpoint: POST /api/admin/legal-batch
// Body: { steps?: ['m2', 'm3'] } — implicit ambele
//
// Flow:
//   1. Identifică acte per step:
//      - M2: acte cu full_text dar fără ai_extraction_date
//      - M3: acte cu ai_extraction_date dar fără validation_date
//   2. Procesează secvențial (rate limits Claude API)
//   3. Returnează raport complet per act

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ==========================================
// SYSTEM PROMPT PENTRU EXTRACȚIE LEGISLATIVĂ
// (identic cu legal-extract/route.ts)
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
  if (text.length <= maxChars) return [text]

  const chunks: string[] = []
  let remaining = text

  while (remaining.length > 0) {
    if (remaining.length <= maxChars) {
      chunks.push(remaining)
      break
    }

    let cutPoint = maxChars
    const searchArea = remaining.substring(maxChars - 2000, maxChars + 2000)

    const chapterBreak = searchArea.lastIndexOf('\nCAPITOLUL')
    if (chapterBreak > 0) {
      cutPoint = maxChars - 2000 + chapterBreak
    } else {
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

  let cleaned = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const jsonStart = cleaned.indexOf('{')
  const jsonEnd = cleaned.lastIndexOf('}')

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error(`Claude nu a returnat JSON valid.`)
  }

  cleaned = cleaned.substring(jsonStart, jsonEnd + 1)

  const parseStrategies = [
    () => JSON.parse(cleaned),
    () => JSON.parse(cleaned.replace(/,\s*([}\]])/g, '$1')),
    () => {
      const fixed = cleaned.replace(/[\x00-\x1F\x7F]/g, (match) => {
        if (match === '\n') return '\\n'
        if (match === '\r') return '\\r'
        if (match === '\t') return '\\t'
        return ''
      })
      return JSON.parse(fixed)
    },
    () => {
      const fixed = cleaned
        .replace(/,\s*([}\]])/g, '$1')
        .replace(/[\x00-\x1F\x7F]/g, (match) => {
          if (match === '\n') return '\\n'
          if (match === '\r') return '\\r'
          if (match === '\t') return '\\t'
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
        throw new Error(`Claude a returnat JSON invalid.`)
      }
    }
  }

  throw new Error('JSON parse failed unexpectedly')
}

// ==========================================
// MERGE CHUNKS
// ==========================================

function mergeExtractions(extractions: any[]): any {
  if (extractions.length === 1) return extractions[0]

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

    if (ext.metadata?.has_penalties) merged.metadata.has_penalties = true
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

  const crSet = new Set<string>()
  merged.cross_references = merged.cross_references.filter((cr: any) => {
    const key = `${cr.target_act_type}-${cr.target_act_number}-${cr.target_act_year}-${cr.reference_type}`
    if (crSet.has(key)) return false
    crSet.add(key)
    return true
  })

  merged.metadata.total_obligations_employer = merged.obligations.filter((o: any) => o.obligation_type === 'employer').length
  merged.metadata.total_obligations_employee = merged.obligations.filter((o: any) => o.obligation_type === 'employee').length
  merged.metadata.total_penalties = merged.penalties.length
  merged.metadata.total_cross_references = merged.cross_references.length

  return merged
}

// ==========================================
// SAVE EXTRACTION TO DB (reutilizat din M2)
// ==========================================

async function saveExtractionToDB(actId: string, extraction: any, supabaseAdmin: ReturnType<typeof getSupabaseAdmin>): Promise<string[]> {
  const errors: string[] = []

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

  if (actError) errors.push(`legal_acts update: ${actError.message}`)

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

    await supabaseAdmin.from('legal_obligations').delete().eq('legal_act_id', actId)
    const { error: oblError } = await supabaseAdmin.from('legal_obligations').insert(obligationsRows)
    if (oblError) errors.push(`legal_obligations: ${oblError.message}`)
  }

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

    await supabaseAdmin.from('legal_penalties').delete().eq('legal_act_id', actId)
    const { error: penError } = await supabaseAdmin.from('legal_penalties').insert(penaltyRows)
    if (penError) errors.push(`legal_penalties: ${penError.message}`)
  }

  if (extraction.cross_references.length > 0) {
    const crRows = extraction.cross_references.map((cr: any) => ({
      act_a_id: actId,
      act_b_id: null,
      source_article: cr.source_article,
      target_act_type: cr.target_act_type,
      target_act_number: cr.target_act_number,
      target_act_year: cr.target_act_year,
      target_article: cr.target_article,
      relationship_type: cr.reference_type,
      description: cr.description,
    }))

    await supabaseAdmin.from('legal_cross_references').delete().eq('act_a_id', actId)
    const { error: crError } = await supabaseAdmin.from('legal_cross_references').insert(crRows)
    if (crError) errors.push(`legal_cross_references: ${crError.message}`)
  }

  return errors
}

// ==========================================
// VALIDATE ACT (reutilizat din M3)
// ==========================================

function countArticlesInText(fullText: string): { total: number; articles: string[] } {
  const articlePattern = /\bArt\.\s*(\d+)/gi
  const found = new Set<number>()
  let match
  while ((match = articlePattern.exec(fullText)) !== null) {
    found.add(parseInt(match[1]))
  }
  return {
    total: found.size,
    articles: Array.from(found).sort((a, b) => a - b).map(n => `Art. ${n}`),
  }
}

function getArticlesFromObligations(obligations: any[]): { total: number; articles: string[] } {
  const found = new Set<string>()
  for (const o of obligations) {
    if (o.article_ref) {
      const match = o.article_ref.match(/Art\.\s*(\d+)/i)
      if (match) found.add(`Art. ${match[1]}`)
    }
  }
  return {
    total: found.size,
    articles: Array.from(found).sort((a, b) => {
      const numA = parseInt(a.replace('Art. ', ''))
      const numB = parseInt(b.replace('Art. ', ''))
      return numA - numB
    }),
  }
}

interface ValidationCheck {
  name: string
  status: 'ok' | 'warning' | 'error'
  message: string
  details?: any
}

interface ValidationResult {
  act_id: string
  act_short_name: string
  overall_status: 'ok' | 'warning' | 'error'
  score: number
  checks: ValidationCheck[]
  validated_at: string
}

async function validateAct(actId: string, supabaseAdmin: ReturnType<typeof getSupabaseAdmin>): Promise<ValidationResult> {
  const checks: ValidationCheck[] = []

  const { data: act, error: actError } = await supabaseAdmin
    .from('legal_acts')
    .select('id, act_short_name, act_type, full_text, full_text_metadata, ai_extraction_result, ai_extraction_date')
    .eq('id', actId)
    .single()

  if (actError || !act) {
    return {
      act_id: actId, act_short_name: 'NECUNOSCUT', overall_status: 'error', score: 0,
      checks: [{ name: 'act_exists', status: 'error', message: `Act negăsit: ${actError?.message || 'ID invalid'}` }],
      validated_at: new Date().toISOString(),
    }
  }

  if (!act.ai_extraction_result || !act.ai_extraction_date) {
    return {
      act_id: actId, act_short_name: act.act_short_name, overall_status: 'error', score: 0,
      checks: [{ name: 'has_extraction', status: 'error', message: 'Actul nu a fost extras cu AI.' }],
      validated_at: new Date().toISOString(),
    }
  }

  const extraction = act.ai_extraction_result

  // CHECK 1: Acoperire articole
  const textArticles = countArticlesInText(act.full_text || '')
  const extractedArticles = getArticlesFromObligations(extraction.obligations || [])
  const coveragePercent = textArticles.total > 0
    ? Math.round((extractedArticles.total / textArticles.total) * 100) : 0
  const missingArticles = textArticles.articles.filter(a => !extractedArticles.articles.includes(a))
  const coverageStatus = coveragePercent >= 20 ? 'ok' : coveragePercent >= 10 ? 'warning' : 'error'

  checks.push({
    name: 'article_coverage', status: coverageStatus,
    message: `${extractedArticles.total}/${textArticles.total} articole au obligații extrase (${coveragePercent}%)`,
    details: { text_articles: textArticles.total, extracted_articles: extractedArticles.total, coverage_percent: coveragePercent, missing_articles: missingArticles.slice(0, 30), missing_total: missingArticles.length },
  })

  // CHECK 2: Consistență numărare articole
  const aiArticleCount = extraction.total_articles_found || 0
  const m1ArticleCount = act.full_text_metadata?.articles || 0
  const regexArticleCount = textArticles.total
  const articleCountDiff = Math.abs(aiArticleCount - regexArticleCount)
  const articleCountStatus = articleCountDiff <= 5 ? 'ok' : articleCountDiff <= 20 ? 'warning' : 'error'

  checks.push({
    name: 'article_count_consistency', status: articleCountStatus,
    message: `Articole: AI=${aiArticleCount}, M1=${m1ArticleCount}, M3=${regexArticleCount} (dif: ${articleCountDiff})`,
    details: { ai_count: aiArticleCount, m1_count: m1ArticleCount, m3_count: regexArticleCount, difference: articleCountDiff },
  })

  // CHECK 3: Calitate obligații
  const obligations = extraction.obligations || []
  const oblWithoutArticle = obligations.filter((o: any) => !o.article_ref || o.article_ref.trim() === '')
  const oblWithoutSeverity = obligations.filter((o: any) => !o.severity)
  const oblWithoutType = obligations.filter((o: any) => !o.obligation_type)
  const oblLowConfidence = obligations.filter((o: any) => o.confidence === 'low')
  const oblIssues = oblWithoutArticle.length + oblWithoutSeverity.length + oblWithoutType.length
  const oblStatus = oblIssues === 0 ? 'ok' : oblIssues <= 3 ? 'warning' : 'error'

  checks.push({
    name: 'obligations_quality', status: oblStatus,
    message: `${obligations.length} obligații: ${oblWithoutArticle.length} fără articol, ${oblWithoutSeverity.length} fără severity, ${oblLowConfidence.length} low confidence`,
    details: {
      total: obligations.length, without_article: oblWithoutArticle.length, without_severity: oblWithoutSeverity.length,
      without_type: oblWithoutType.length, low_confidence: oblLowConfidence.length,
      by_type: {
        employer: obligations.filter((o: any) => o.obligation_type === 'employer').length,
        employee: obligations.filter((o: any) => o.obligation_type === 'employee').length,
        sepp: obligations.filter((o: any) => o.obligation_type === 'sepp').length,
        authority: obligations.filter((o: any) => o.obligation_type === 'authority').length,
        general: obligations.filter((o: any) => o.obligation_type === 'general').length,
      },
      by_severity: {
        critical: obligations.filter((o: any) => o.severity === 'critical').length,
        important: obligations.filter((o: any) => o.severity === 'important').length,
        informative: obligations.filter((o: any) => o.severity === 'informative').length,
      },
    },
  })

  // CHECK 4: Sancțiuni validitate
  const penalties = extraction.penalties || []
  const penaltyIssues: string[] = []
  for (const p of penalties) {
    if (p.min_amount_lei != null && p.min_amount_lei < 0) penaltyIssues.push(`${p.article_ref}: min negativ`)
    if (p.max_amount_lei != null && p.max_amount_lei < 0) penaltyIssues.push(`${p.article_ref}: max negativ`)
    if (p.min_amount_lei != null && p.max_amount_lei != null && p.min_amount_lei > p.max_amount_lei) penaltyIssues.push(`${p.article_ref}: min > max`)
    if (p.max_amount_lei != null && p.max_amount_lei > 1_000_000) penaltyIssues.push(`${p.article_ref}: sumă suspect mare`)
    if (p.min_amount_lei != null && p.min_amount_lei > 0 && p.min_amount_lei < 100) penaltyIssues.push(`${p.article_ref}: sumă suspect mică`)
  }
  const penStatus = penaltyIssues.length === 0 ? 'ok' : penaltyIssues.length <= 2 ? 'warning' : 'error'

  checks.push({
    name: 'penalties_validity',
    status: penalties.length === 0 ? 'ok' : penStatus,
    message: penalties.length === 0 ? 'Fără sancțiuni' : `${penalties.length} sancțiuni, ${penaltyIssues.length} probleme`,
    details: { total: penalties.length, issues: penaltyIssues },
  })

  // CHECK 5: Referințe — target acts în DB?
  const crossRefs = extraction.cross_references || []
  let refsInDB = 0
  let refsMissing = 0
  const missingRefs: any[] = []

  if (crossRefs.length > 0) {
    const { data: allActs } = await supabaseAdmin.from('legal_acts').select('id, act_type, act_number, act_year')
    const actMap = new Map<string, string>()
    for (const a of allActs || []) {
      actMap.set(`${a.act_type}-${a.act_number}-${a.act_year}`, a.id)
    }
    for (const cr of crossRefs) {
      const key = `${cr.target_act_type}-${cr.target_act_number}-${cr.target_act_year}`
      if (actMap.has(key)) refsInDB++
      else {
        refsMissing++
        missingRefs.push({ target: `${cr.target_act_type} ${cr.target_act_number}/${cr.target_act_year}`, source_article: cr.source_article, type: cr.reference_type })
      }
    }
  }
  const refsStatus = crossRefs.length === 0 ? 'ok' : refsMissing === 0 ? 'ok' : refsMissing <= crossRefs.length * 0.5 ? 'warning' : 'error'

  checks.push({
    name: 'cross_references', status: refsStatus,
    message: crossRefs.length === 0 ? 'Fără referințe' : `${crossRefs.length} referințe: ${refsInDB} în DB, ${refsMissing} lipsă`,
    details: { total: crossRefs.length, in_db: refsInDB, missing: refsMissing, missing_acts: missingRefs.slice(0, 20) },
  })

  // CHECK 6: Definiții
  const definitions = extraction.key_definitions || []
  const defsWithoutArticle = definitions.filter((d: any) => !d.article_ref)
  const defsWithoutDefinition = definitions.filter((d: any) => !d.definition || d.definition.trim().length < 10)

  checks.push({
    name: 'definitions_quality',
    status: defsWithoutArticle.length === 0 && defsWithoutDefinition.length === 0 ? 'ok' : 'warning',
    message: `${definitions.length} definiții: ${defsWithoutArticle.length} fără articol, ${defsWithoutDefinition.length} incomplete`,
    details: { total: definitions.length, without_article: defsWithoutArticle.length, incomplete: defsWithoutDefinition.length },
  })

  // SCOR
  const weights: Record<string, number> = {
    article_coverage: 25, article_count_consistency: 15, obligations_quality: 25,
    penalties_validity: 15, cross_references: 10, definitions_quality: 10,
  }
  let score = 0
  let overallStatus: 'ok' | 'warning' | 'error' = 'ok'
  for (const check of checks) {
    const weight = weights[check.name] || 10
    if (check.status === 'ok') score += weight
    else if (check.status === 'warning') score += weight * 0.5
    if (check.status === 'error') overallStatus = 'error'
    else if (check.status === 'warning' && overallStatus !== 'error') overallStatus = 'warning'
  }
  score = Math.round(score)

  const result: ValidationResult = {
    act_id: actId, act_short_name: act.act_short_name, overall_status: overallStatus,
    score, checks, validated_at: new Date().toISOString(),
  }

  await supabaseAdmin.from('legal_acts').update({
    validation_result: result, validation_date: result.validated_at, updated_at: new Date().toISOString(),
  }).eq('id', actId)

  return result
}

// ==========================================
// M2: EXTRACT A SINGLE ACT
// ==========================================

async function extractAct(act: { id: string; act_type: string; act_short_name: string; full_text: string }, supabaseAdmin: ReturnType<typeof getSupabaseAdmin>): Promise<{
  success: boolean
  act_short_name: string
  stats?: any
  error?: string
}> {
  try {
    const chunks = splitTextIntoChunks(act.full_text, 50000)
    console.log(`[M6/M2] ${act.act_short_name}: ${act.full_text.length} chars, ${chunks.length} chunk(s)`)

    const extractions: any[] = []
    for (let i = 0; i < chunks.length; i++) {
      const chunkLabel = chunks.length > 1 ? ` (parte ${i + 1}/${chunks.length})` : ''
      const userMessage = EXTRACTION_USER_PROMPT(act.act_short_name + chunkLabel, act.act_type) + chunks[i]
      console.log(`[M6/M2] ${act.act_short_name} chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)`)
      const result = await callClaudeAPI(EXTRACTION_SYSTEM_PROMPT, userMessage)
      extractions.push(result)
    }

    const finalExtraction = mergeExtractions(extractions)
    const saveErrors = await saveExtractionToDB(act.id, finalExtraction, supabaseAdmin)

    return {
      success: true,
      act_short_name: act.act_short_name,
      stats: {
        obligations: finalExtraction.obligations.length,
        penalties: finalExtraction.penalties.length,
        cross_references: finalExtraction.cross_references.length,
        key_definitions: finalExtraction.key_definitions.length,
        save_errors: saveErrors.length > 0 ? saveErrors : null,
      },
    }
  } catch (err: any) {
    console.error(`[M6/M2] Error extracting ${act.act_short_name}:`, err.message)
    return {
      success: false,
      act_short_name: act.act_short_name,
      error: err.message,
    }
  }
}

// ==========================================
// POST: BATCH PROCESSING M2 + M3
// ==========================================

export async function POST(request: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin()
  const startTime = Date.now()

  try {
    const body = await request.json()
    const steps = body.steps || ['m2', 'm3']
    const doM2 = steps.includes('m2')
    const doM3 = steps.includes('m3')

    const report: {
      m2_results: any[]
      m3_results: any[]
      summary: any
      duration_seconds: number
    } = {
      m2_results: [],
      m3_results: [],
      summary: {},
      duration_seconds: 0,
    }

    // ==========================================
    // STEP M2: Extracție AI pe acte cu text dar fără extracție
    // ==========================================
    if (doM2) {
      // Găsește acte cu full_text dar fără ai_extraction_date
      const { data: actsForM2, error: m2FetchError } = await supabaseAdmin
        .from('legal_acts')
        .select('id, act_type, act_short_name, full_text, full_text_metadata, ai_extraction_date')
        .is('ai_extraction_date', null)
        .order('hierarchy_order', { ascending: true })

      if (m2FetchError) {
        return NextResponse.json({ error: `Eroare citire acte M2: ${m2FetchError.message}` }, { status: 500 })
      }

      // Filtrează doar actele cu text valid
      const eligibleM2 = (actsForM2 || []).filter(
        (a) => a.full_text && a.full_text.length >= 100
      )

      console.log(`[M6] M2: ${eligibleM2.length} acte eligibile pentru extracție`)

      // Procesare secvențială (rate limits Claude API)
      for (const act of eligibleM2) {
        const result = await extractAct(act, supabaseAdmin)
        report.m2_results.push(result)

        // Delay între acte (respectă rate limits)
        if (eligibleM2.indexOf(act) < eligibleM2.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
    }

    // ==========================================
    // STEP M3: Validare pe acte extrase dar nevalidate
    // ==========================================
    if (doM3) {
      // Găsește acte cu ai_extraction_date dar fără validation_date
      const { data: actsForM3, error: m3FetchError } = await supabaseAdmin
        .from('legal_acts')
        .select('id, act_short_name')
        .not('ai_extraction_date', 'is', null)
        .is('validation_date', null)
        .order('hierarchy_order', { ascending: true })

      if (m3FetchError) {
        return NextResponse.json({ error: `Eroare citire acte M3: ${m3FetchError.message}` }, { status: 500 })
      }

      // Include și actele tocmai extrase în M2 (care acum au ai_extraction_date)
      const m2SuccessIds = report.m2_results
        .filter(r => r.success)
        .map(r => r.act_short_name)

      const allM3Eligible = actsForM3 || []
      console.log(`[M6] M3: ${allM3Eligible.length} acte eligibile pentru validare`)

      for (const act of allM3Eligible) {
        const result = await validateAct(act.id, supabaseAdmin)
        report.m3_results.push({
          act_short_name: act.act_short_name,
          score: result.score,
          overall_status: result.overall_status,
        })
      }
    }

    // ==========================================
    // SUMMARY
    // ==========================================
    const durationSeconds = Math.round((Date.now() - startTime) / 1000)

    report.summary = {
      m2_total: report.m2_results.length,
      m2_success: report.m2_results.filter(r => r.success).length,
      m2_failed: report.m2_results.filter(r => !r.success).length,
      m3_total: report.m3_results.length,
      m3_ok: report.m3_results.filter(r => r.overall_status === 'ok').length,
      m3_warning: report.m3_results.filter(r => r.overall_status === 'warning').length,
      m3_error: report.m3_results.filter(r => r.overall_status === 'error').length,
      m3_avg_score: report.m3_results.length > 0
        ? Math.round(report.m3_results.reduce((sum: number, r: any) => sum + r.score, 0) / report.m3_results.length)
        : 0,
    }
    report.duration_seconds = durationSeconds

    console.log(`[M6] Batch complet în ${durationSeconds}s:`, report.summary)

    return NextResponse.json({
      success: true,
      ...report,
    })

  } catch (err: any) {
    console.error('[M6] Batch error:', err)
    return NextResponse.json(
      { error: err.message || 'Eroare la batch processing.' },
      { status: 500 }
    )
  }
}
