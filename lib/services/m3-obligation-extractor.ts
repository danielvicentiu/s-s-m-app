/**
 * M3 OBLIGATION EXTRACTOR SERVICE
 *
 * Procesează legislație parsată (output M2) și extrage obligații structurate
 * folosind Claude API pentru înțelegere semantică avansată.
 *
 * FEATURES:
 * - Batch processing: procesează articole în loturi de 5-10 pentru eficiență
 * - Prompt engineering: instructează Claude să extragă:
 *   - Textul obligației (ce trebuie făcut)
 *   - Cine trebuie să îndeplinească (angajator, angajat, ITM, etc.)
 *   - Termen limită / frecvență (anual, lunar, la angajare, etc.)
 *   - Penalitate dacă nu se respectă
 *   - Dovezi necesare (documente, certificate, registre)
 * - Filtrare: procesează doar articolele cu hasObligations = true
 * - Validare: verifică răspunsuri Claude și returnează doar obligații valide
 *
 * USAGE:
 * const parsed = parseLegislation(rawText)
 * const obligations = await extractObligations(parsed, 'L 319/2006')
 */

import type { CountryCode, Obligation, ObligationFrequency } from '@/lib/types'
import type { LegislationParsed, LegislationArticle } from './m2-legislation-parser'

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

// Extended frequencies for internal processing (mapped to lib/types.ts ObligationFrequency)
export type ExtendedFrequency = ObligationFrequency | 'weekly' | 'daily' | 'at_hire' | 'at_termination' | 'continuous' | 'unknown'

// ══════════════════════════════════════════════════════════════
// CONFIGURATION
// ══════════════════════════════════════════════════════════════

const BATCH_SIZE = 7  // Procesează 7 articole simultan
const MAX_RETRIES = 2
const CLAUDE_MODEL = 'claude-sonnet-4-5-20250929'

// ══════════════════════════════════════════════════════════════
// MAIN EXTRACTION FUNCTION
// ══════════════════════════════════════════════════════════════

export async function extractObligations(
  parsedLegislation: LegislationParsed,
  legalActName: string,
  countryCode: CountryCode = 'RO',
  apiKey?: string
): Promise<Partial<Obligation>[]> {
  const startTime = Date.now()
  const obligations: Partial<Obligation>[] = []

  // Validare API key
  const key = apiKey || process.env.ANTHROPIC_API_KEY
  if (!key) {
    throw new Error('ANTHROPIC_API_KEY not found in environment variables')
  }

  // Filtrare articole cu obligații
  const articlesWithObligations = parsedLegislation.articles.filter(
    article => article.hasObligations
  )

  console.log(`[M3] Processing ${articlesWithObligations.length} articles with obligations from ${legalActName}`)

  if (articlesWithObligations.length === 0) {
    console.log('[M3] No articles with obligations found')
    return []
  }

  // Batch processing
  const batches = createBatches(articlesWithObligations, BATCH_SIZE)
  console.log(`[M3] Split into ${batches.length} batches of ~${BATCH_SIZE} articles`)

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    console.log(`[M3] Processing batch ${i + 1}/${batches.length} (${batch.length} articles)`)

    try {
      const batchObligations = await extractObligationsFromBatch(
        batch,
        legalActName,
        countryCode,
        key
      )

      obligations.push(...batchObligations)
      console.log(`[M3] Extracted ${batchObligations.length} obligations from batch ${i + 1}`)

      // Rate limiting: pauză între batch-uri
      if (i < batches.length - 1) {
        await sleep(500)  // 500ms între batch-uri
      }
    } catch (error) {
      console.error(`[M3] Error processing batch ${i + 1}:`, error)
      // Continue cu următorul batch
    }
  }

  const duration = Date.now() - startTime
  console.log(`[M3] Extraction complete: ${obligations.length} obligations in ${duration}ms`)

  return obligations
}

// ══════════════════════════════════════════════════════════════
// BATCH PROCESSING
// ══════════════════════════════════════════════════════════════

function createBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = []
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }
  return batches
}

async function extractObligationsFromBatch(
  articles: LegislationArticle[],
  legalActName: string,
  countryCode: CountryCode,
  apiKey: string
): Promise<Partial<Obligation>[]> {
  const language = countryCode === 'RO' ? 'ro' : countryCode === 'BG' ? 'bg' : countryCode === 'HU' ? 'hu' : countryCode === 'DE' ? 'de' : 'en'
  const prompt = buildPrompt(articles, legalActName, language)

  let lastError: Error | null = null

  // Retry logic
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await callClaudeAPI(prompt, apiKey)
      const obligations = parseClaudeResponse(response, articles, legalActName, countryCode)
      return obligations
    } catch (error) {
      lastError = error as Error
      console.error(`[M3] Attempt ${attempt}/${MAX_RETRIES} failed:`, error)

      if (attempt < MAX_RETRIES) {
        await sleep(1000 * attempt)  // Exponential backoff
      }
    }
  }

  throw new Error(`Failed after ${MAX_RETRIES} attempts: ${lastError?.message}`)
}

// ══════════════════════════════════════════════════════════════
// PROMPT ENGINEERING
// ══════════════════════════════════════════════════════════════

function buildPrompt(articles: LegislationArticle[], legalActName: string, language: string): string {
  const articlesText = articles.map(article => {
    return `
ARTICOLUL ${article.articleNumber}
${article.content}
---`.trim()
  }).join('\n\n')

  const languageInstruction = language === 'ro'
    ? 'Text în limba română.'
    : `Text în limba ${language}. Răspunde tot în ${language}.`

  return `Ești un expert în legislație SSM (securitate și sănătate în muncă) și PSI (prevenire și stingere incendii).

Analizează următoarele articole din ${legalActName} și extrage TOATE obligațiile specifice.

${languageInstruction}

ARTICOLE DE ANALIZAT:
${articlesText}

INSTRUCȚIUNI:
Pentru fiecare obligație identificată, extrage:

1. **obligationText**: Textul exact al obligației (ce trebuie făcut)
2. **who**: Cine trebuie să o îndeplinească (lista: angajator, angajat, ITM, medic medicina muncii, pompieri, etc.)
3. **deadline**: Termenul sau frecvența (ex: "30 zile de la angajare", "anual", "lunar", "la cerere", "permanent")
4. **frequency**: Standardizat ca: annual, biannual, quarterly, monthly, weekly, daily, on_demand, once, at_hire, at_termination, continuous, unknown
5. **penalty**: Sancțiunea dacă nu se respectă (ex: "Amendă 5.000-10.000 RON", "Contravenție 2000 EUR")
6. **evidenceRequired**: Lista de documente/dovezi necesare (ex: "Fișa medicală", "Registrul de instruire", "Certificat PSI")
7. **sourceArticleNumber**: Numărul articolului (ex: "5", "12", "23")
8. **confidence**: Nivelul de încredere în extracție (0.0 - 1.0)

IMPORTANT:
- Extrage DOAR obligații clare și specifice
- Dacă un articol conține multiple obligații, extrage-le separat
- Dacă nu există penalitate explicită, pune null
- Dacă termenul nu e clar, pune "unknown" la frequency
- Dacă nu se specifică cine trebuie să execute, deduce logic (ex: "angajatorul trebuie" → ["angajator"])

FORMAT RĂSPUNS:
Returnează DOAR un JSON array valid, fără text suplimentar:

[
  {
    "obligationText": "...",
    "who": ["angajator"],
    "deadline": "anual",
    "frequency": "annual",
    "penalty": "Amendă 5.000-10.000 RON",
    "evidenceRequired": ["Fișa medicală", "Registrul de instruire"],
    "sourceArticleNumber": "5",
    "confidence": 0.95
  },
  {
    "obligationText": "...",
    "who": ["angajat"],
    "deadline": "la angajare",
    "frequency": "at_hire",
    "penalty": null,
    "evidenceRequired": ["Declarație pe propria răspundere"],
    "sourceArticleNumber": "12",
    "confidence": 0.85
  }
]

Începe analiza:`
}

// ══════════════════════════════════════════════════════════════
// CLAUDE API CALL
// ══════════════════════════════════════════════════════════════

async function callClaudeAPI(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      temperature: 0.2,  // Low temperature pentru consistență
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Claude API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()

  if (!data.content || data.content.length === 0) {
    throw new Error('Empty response from Claude API')
  }

  return data.content[0].text
}

// ══════════════════════════════════════════════════════════════
// RESPONSE PARSING & VALIDATION
// ══════════════════════════════════════════════════════════════

interface ClaudeObligationResponse {
  obligationText: string
  who: string[]
  deadline: string | null
  frequency: string
  penalty: string | null
  evidenceRequired: string[]
  sourceArticleNumber: string
  confidence: number
}

function parseClaudeResponse(
  responseText: string,
  articles: LegislationArticle[],
  legalActName: string,
  countryCode: CountryCode
): Partial<Obligation>[] {
  // Extract JSON from response (Claude poate adăuga text înainte/după)
  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.warn('[M3] No JSON array found in Claude response')
    return []
  }

  let parsed: ClaudeObligationResponse[]
  try {
    parsed = JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('[M3] Failed to parse Claude JSON response:', error)
    return []
  }

  if (!Array.isArray(parsed)) {
    console.warn('[M3] Claude response is not an array')
    return []
  }

  // Convert to Obligation objects
  const obligations: Partial<Obligation>[] = []

  for (const item of parsed) {
    try {
      // Validare câmpuri obligatorii
      if (!item.obligationText || !item.sourceArticleNumber) {
        console.warn('[M3] Skipping obligation with missing required fields')
        continue
      }

      // Find source article
      const sourceArticle = articles.find(a => a.articleNumber === item.sourceArticleNumber)
      if (!sourceArticle) {
        console.warn(`[M3] Article ${item.sourceArticleNumber} not found in batch`)
        continue
      }

      // Parse penalty amounts (ex: "Amendă 5.000-10.000 RON")
      let penaltyMin: number | null = null
      let penaltyMax: number | null = null
      let penaltyCurrency: string | null = null

      if (item.penalty) {
        const penaltyParsed = parsePenalty(item.penalty)
        penaltyMin = penaltyParsed.min
        penaltyMax = penaltyParsed.max
        penaltyCurrency = penaltyParsed.currency
      }

      // Normalize frequency
      const frequency = normalizeFrequency(item.frequency)

      const obligation: Partial<Obligation> = {
        source_legal_act: legalActName,
        source_article_number: sourceArticle.articleNumber,
        country_code: countryCode,
        obligation_text: item.obligationText.trim(),
        who: Array.isArray(item.who) ? item.who : [item.who || 'unknown'],
        deadline: item.deadline || null,
        frequency,
        penalty: item.penalty || null,
        penalty_min: penaltyMin,
        penalty_max: penaltyMax,
        penalty_currency: penaltyCurrency,
        evidence_required: Array.isArray(item.evidenceRequired) ? item.evidenceRequired : [],
        confidence: typeof item.confidence === 'number' ? item.confidence : 0.5,
        validation_score: 0,
        status: 'draft',
        published: false,
        caen_codes: [],
        industry_tags: [],
        extracted_at: new Date().toISOString(),
        language: countryCode === 'RO' ? 'ro' : countryCode === 'BG' ? 'bg' : countryCode === 'HU' ? 'hu' : countryCode === 'DE' ? 'de' : 'en',
        metadata: {
          extraction_method: 'claude_api',
          model: CLAUDE_MODEL
        }
      }

      // Validare minimă confidence
      if ((obligation.confidence || 0) >= 0.5) {
        obligations.push(obligation)
      } else {
        console.warn(`[M3] Skipping low-confidence obligation (${obligation.confidence})`)
      }

    } catch (error) {
      console.error('[M3] Error processing obligation item:', error)
    }
  }

  return obligations
}

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════

function parsePenalty(penaltyText: string): {
  min: number | null
  max: number | null
  currency: string | null
} {
  // Extract numbers (ex: "5.000-10.000 RON" → [5000, 10000])
  const numbers = penaltyText
    .replace(/\./g, '')  // Remove thousand separators
    .match(/\d+/g)

  // Extract currency
  const currencyMatch = penaltyText.match(/\b(RON|EUR|BGN|HUF|PLN|USD)\b/i)
  const currency = currencyMatch ? currencyMatch[1].toUpperCase() : null

  if (!numbers || numbers.length === 0) {
    return { min: null, max: null, currency }
  }

  if (numbers.length === 1) {
    const value = parseInt(numbers[0], 10)
    return { min: value, max: value, currency }
  }

  return {
    min: parseInt(numbers[0], 10),
    max: parseInt(numbers[1], 10),
    currency
  }
}

function normalizeFrequency(freq: string): ObligationFrequency | null {
  const normalized = freq.toLowerCase().trim()

  const mapping: Record<string, ObligationFrequency | 'once'> = {
    'annual': 'annual',
    'anual': 'annual',
    'yearly': 'annual',
    'biannual': 'biannual',
    'semestrial': 'biannual',
    'quarterly': 'quarterly',
    'trimestrial': 'quarterly',
    'monthly': 'monthly',
    'lunar': 'monthly',
    'on_demand': 'on_demand',
    'la_cerere': 'on_demand',
    'once': 'once',
    'o_dată': 'once'
  }

  const result = mapping[normalized]

  // Map extended frequencies to standard ones
  if (normalized === 'weekly' || normalized === 'săptămânal') return 'monthly'
  if (normalized === 'daily' || normalized === 'zilnic') return 'monthly'
  if (normalized === 'at_hire' || normalized === 'la_angajare') return 'once'
  if (normalized === 'at_termination' || normalized === 'la_încetare') return 'once'
  if (normalized === 'continuous' || normalized === 'permanent') return 'annual'

  return result || null
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ══════════════════════════════════════════════════════════════
// STATISTICS & HELPERS
// ══════════════════════════════════════════════════════════════

export function getObligationStats(obligations: Partial<Obligation>[]) {
  return {
    total: obligations.length,
    byFrequency: groupBy(obligations, o => o.frequency || 'unknown'),
    byWho: groupBy(obligations, o => (o.who || []).join(', ')),
    withPenalty: obligations.filter(o => o.penalty).length,
    avgConfidence: obligations.length > 0
      ? obligations.reduce((sum, o) => sum + (o.confidence || 0), 0) / obligations.length
      : 0,
    byArticle: groupBy(obligations, o => o.source_article_number || 'unknown')
  }
}

function groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, number> {
  return items.reduce((acc, item) => {
    const key = keyFn(item)
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}

// ══════════════════════════════════════════════════════════════
// EXPORT PUBLIC API
// ══════════════════════════════════════════════════════════════
// Note: Types are already exported above (Obligation, ObligationFrequency)
