/**
 * M6 BATCH PROCESSOR SERVICE
 *
 * Orchestrează pipeline-ul complet M1→M2→M3 pentru procesare batch de legislație:
 * - M1: Scraping (sau preluare din DB)
 * - M2: Parsing structură legislativă
 * - M3: Extracție obligații cu Claude API
 *
 * FEATURES:
 * - Queue management: procesează legislație în loturi controlate
 * - Concurrency limit: maximum 3 procese paralele (limitare API Claude)
 * - Retry logic: reîncearcă procesare max 3 ori la erori
 * - Progress tracking: callback pentru progress percentage
 * - Final report: sumar detaliat cu statistici succese/eșecuri
 * - Error isolation: dacă un item eșuează, restul continuă
 *
 * USAGE:
 * ```ts
 * const report = await processLegislationBatch(
 *   ['uuid-1', 'uuid-2', 'uuid-3'],
 *   {
 *     onProgress: (percent, current, total) => {
 *       console.log(`Progress: ${percent}% (${current}/${total})`)
 *     }
 *   }
 * )
 * ```
 */

import { scrapeLegislatie } from './m1-legislation-scraper'
import { parseLegislation } from './m2-legislation-parser'
import { extractObligations, getObligationStats } from './m3-obligation-extractor'
import type {
  LegislationEntry,
  LegislationParsed,
  CountryCode
} from '@/lib/types'
import type { Obligation } from './m3-obligation-extractor'

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

export interface BatchProcessingOptions {
  /**
   * Callback apelat la fiecare update de progres
   * @param percent - Procentaj completare (0-100)
   * @param current - Număr items procesate
   * @param total - Total items de procesat
   */
  onProgress?: (percent: number, current: number, total: number) => void

  /**
   * Maximum procese paralele (default: 3)
   * IMPORTANT: API Claude are rate limits, nu depăși 5
   */
  concurrencyLimit?: number

  /**
   * Maximum retry attempts per item (default: 3)
   */
  maxRetries?: number

  /**
   * Anthropic API key (fallback la process.env.ANTHROPIC_API_KEY)
   */
  anthropicApiKey?: string

  /**
   * Skip M3 obligation extraction (doar M1+M2, folosit pentru testare)
   */
  skipObligationExtraction?: boolean
}

export interface LegislationProcessingResult {
  // Input
  legislationId: string
  legislationEntry: LegislationEntry | null

  // Processing status
  status: 'success' | 'partial' | 'failed'
  stage: 'm1' | 'm2' | 'm3' | 'complete'  // La ce etapă s-a oprit

  // Outputs
  parsed: LegislationParsed | null
  obligations: Obligation[]

  // Metadata
  attemptsCount: number
  processingTimeMs: number
  errors: string[]
}

export interface BatchProcessingReport {
  // Summary
  totalItems: number
  successCount: number
  partialCount: number
  failedCount: number
  totalProcessingTimeMs: number

  // Detailed results
  results: LegislationProcessingResult[]

  // Aggregated stats
  totalObligations: number
  totalArticles: number
  avgObligationsPerLaw: number
  avgProcessingTimePerItem: number

  // Errors summary
  failedItems: string[]  // IDs items care au eșuat complet
  errorsByType: Record<string, number>
}

interface QueueItem {
  legislationId: string
  retryCount: number
}

// ══════════════════════════════════════════════════════════════
// CONFIGURATION
// ══════════════════════════════════════════════════════════════

const DEFAULT_CONCURRENCY_LIMIT = 3
const DEFAULT_MAX_RETRIES = 3
const RETRY_DELAY_MS = 2000  // 2 secunde între retry-uri

// ══════════════════════════════════════════════════════════════
// MAIN BATCH PROCESSING FUNCTION
// ══════════════════════════════════════════════════════════════

export async function processLegislationBatch(
  legislationIds: string[],
  options: BatchProcessingOptions = {}
): Promise<BatchProcessingReport> {
  const startTime = Date.now()

  const {
    onProgress,
    concurrencyLimit = DEFAULT_CONCURRENCY_LIMIT,
    maxRetries = DEFAULT_MAX_RETRIES,
    anthropicApiKey,
    skipObligationExtraction = false
  } = options

  console.log(`[M6 Batch] Starting batch processing: ${legislationIds.length} items`)
  console.log(`[M6 Batch] Concurrency: ${concurrencyLimit}, Max retries: ${maxRetries}`)

  if (skipObligationExtraction) {
    console.log('[M6 Batch] ⚠️  Skipping M3 obligation extraction (test mode)')
  }

  // Initialize queue
  const queue: QueueItem[] = legislationIds.map(id => ({
    legislationId: id,
    retryCount: 0
  }))

  const results: LegislationProcessingResult[] = []
  const activeProcesses: Set<Promise<void>> = new Set()

  let completed = 0
  const total = legislationIds.length

  // Process queue with concurrency limit
  while (queue.length > 0 || activeProcesses.size > 0) {
    // Start new processes if under concurrency limit
    while (queue.length > 0 && activeProcesses.size < concurrencyLimit) {
      const item = queue.shift()!

      const processPromise = (async () => {
        try {
          const result = await processLegislationItem(
            item.legislationId,
            {
              anthropicApiKey,
              skipObligationExtraction
            }
          )

          // Check if retry needed
          if (result.status === 'failed' && item.retryCount < maxRetries) {
            console.log(
              `[M6 Batch] Retry ${item.retryCount + 1}/${maxRetries} for ${item.legislationId}`
            )

            // Add back to queue with retry count
            queue.push({
              legislationId: item.legislationId,
              retryCount: item.retryCount + 1
            })

            // Delay before retry
            await sleep(RETRY_DELAY_MS * (item.retryCount + 1))
          } else {
            // Final result
            results.push(result)
            completed++

            // Progress callback
            const percent = Math.round((completed / total) * 100)
            if (onProgress) {
              onProgress(percent, completed, total)
            }

            console.log(
              `[M6 Batch] Progress: ${completed}/${total} (${percent}%) - ` +
              `${item.legislationId}: ${result.status}`
            )
          }
        } catch (error) {
          console.error(`[M6 Batch] Unexpected error for ${item.legislationId}:`, error)

          // Add failed result
          results.push({
            legislationId: item.legislationId,
            legislationEntry: null,
            status: 'failed',
            stage: 'm1',
            parsed: null,
            obligations: [],
            attemptsCount: item.retryCount + 1,
            processingTimeMs: 0,
            errors: [error instanceof Error ? error.message : 'Unknown error']
          })

          completed++
        }
      })()

      activeProcesses.add(processPromise)
      processPromise.finally(() => {
        activeProcesses.delete(processPromise)
      })
    }

    // Wait for at least one process to complete
    if (activeProcesses.size > 0) {
      await Promise.race(activeProcesses)
    }
  }

  // Generate final report
  const totalTime = Date.now() - startTime
  const report = generateReport(results, totalTime)

  console.log(`[M6 Batch] ✅ Batch processing complete in ${totalTime}ms`)
  console.log(`[M6 Batch] Success: ${report.successCount}, Partial: ${report.partialCount}, Failed: ${report.failedCount}`)
  console.log(`[M6 Batch] Total obligations extracted: ${report.totalObligations}`)

  return report
}

// ══════════════════════════════════════════════════════════════
// SINGLE ITEM PROCESSING
// ══════════════════════════════════════════════════════════════

async function processLegislationItem(
  legislationId: string,
  options: {
    anthropicApiKey?: string
    skipObligationExtraction?: boolean
  }
): Promise<LegislationProcessingResult> {
  const startTime = Date.now()
  const errors: string[] = []

  console.log(`[M6 Item] Processing ${legislationId}`)

  let legislationEntry: LegislationEntry | null = null
  let parsed: LegislationParsed | null = null
  let obligations: Obligation[] = []
  let stage: LegislationProcessingResult['stage'] = 'm1'

  try {
    // ═══ M1: Fetch legislation data ═══
    // În producție, aici ar trebui să facă fetch din Supabase
    // Pentru test, simulăm cu date mock sau scraping direct
    legislationEntry = await fetchLegislationById(legislationId)

    if (!legislationEntry) {
      throw new Error(`Legislation entry not found: ${legislationId}`)
    }

    console.log(`[M6 Item] M1 ✓ Fetched: ${legislationEntry.title}`)

    // ═══ M2: Parse legislation structure ═══
    stage = 'm2'

    // Fetch raw text (în producție din Supabase sau scraping URL)
    const rawText = await fetchLegislationRawText(legislationEntry)

    if (!rawText) {
      throw new Error('No raw text available for parsing')
    }

    parsed = parseLegislation(rawText)

    console.log(
      `[M6 Item] M2 ✓ Parsed: ${parsed.structure.articles.length} articles, ` +
      `${parsed.structure.chapters.length} chapters`
    )

    // ═══ M3: Extract obligations (optional) ═══
    if (!options.skipObligationExtraction) {
      stage = 'm3'

      const apiKey = options.anthropicApiKey || process.env.ANTHROPIC_API_KEY
      if (!apiKey) {
        errors.push('ANTHROPIC_API_KEY not available')
        throw new Error('Cannot extract obligations without API key')
      }

      const legalActName = legislationEntry.act_number || legislationEntry.title

      obligations = await extractObligations(parsed, legalActName, apiKey)

      console.log(`[M6 Item] M3 ✓ Extracted: ${obligations.length} obligations`)
    }

    stage = 'complete'

    const processingTime = Date.now() - startTime

    return {
      legislationId,
      legislationEntry,
      status: 'success',
      stage,
      parsed,
      obligations,
      attemptsCount: 1,
      processingTimeMs: processingTime,
      errors
    }

  } catch (error) {
    const processingTime = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    errors.push(errorMessage)

    console.error(`[M6 Item] ❌ Failed at stage ${stage}:`, errorMessage)

    // Determine status
    let status: LegislationProcessingResult['status'] = 'failed'
    if (stage === 'm3' && parsed) {
      // M2 succeeded but M3 failed
      status = 'partial'
    }

    return {
      legislationId,
      legislationEntry,
      status,
      stage,
      parsed,
      obligations,
      attemptsCount: 1,
      processingTimeMs: processingTime,
      errors
    }
  }
}

// ══════════════════════════════════════════════════════════════
// DATA FETCHING (MOCK - în producție folosește Supabase)
// ══════════════════════════════════════════════════════════════

/**
 * Fetch legislation entry by ID
 * În producție: query Supabase table `legislation`
 */
async function fetchLegislationById(id: string): Promise<LegislationEntry | null> {
  // MOCK IMPLEMENTATION
  // TODO: Replace with real Supabase query
  console.log(`[M6 Mock] Fetching legislation ${id} from database...`)

  // Simulare delay
  await sleep(100)

  // Mock data
  return {
    id,
    country_code: 'RO',
    domain: 'SSM',
    act_number: 'L 319/2006',
    act_date: '2006-07-14',
    title: 'Legea securității și sănătății în muncă nr. 319/2006',
    official_journal_ref: 'MO 646/2006',
    source_url: 'https://legislatie.just.ro/Public/DetaliiDocument/73937',
    raw_metadata: {},
    scraped_at: new Date().toISOString()
  }
}

/**
 * Fetch raw text pentru o legislație
 * În producție: query Supabase sau scrape URL
 */
async function fetchLegislationRawText(entry: LegislationEntry): Promise<string | null> {
  // MOCK IMPLEMENTATION
  // TODO: Replace with real text fetching (Supabase sau web scraping)
  console.log(`[M6 Mock] Fetching raw text for ${entry.act_number}...`)

  await sleep(200)

  // Mock text legislativ
  return `
LEGE nr. 319 din 14 iulie 2006
privind securitatea și sănătatea în muncă

CAPITOLUL I
Dispoziții generale

Art. 1. - Prezenta lege stabilește principii generale privind prevenirea riscurilor profesionale, protecția sănătății și securitatea lucrătorilor, eliminarea factorilor de risc și accidentare.

Art. 2. - Angajatorul are obligația de a asigura securitatea și sănătatea lucrătorilor în toate aspectele legate de muncă.

Art. 5. - (1) Angajatorul trebuie să efectueze evaluarea riscurilor pentru securitate și sănătate în muncă, inclusiv la alegerea echipamentelor de muncă.
(2) Evaluarea riscurilor se revizuiește periodic, cel puțin anual și ori de câte ori intervin modificări ale condițiilor de muncă.

Art. 12. - Angajatorul trebuie să organizeze instructajul angajaților în domeniul securității și sănătății în muncă.

CAPITOLUL V
Sancțiuni

Art. 45. - Nerespectarea prevederilor art. 5 referitoare la evaluarea riscurilor constituie contravenție și se sancționează cu amendă de la 5.000 lei la 10.000 lei.
`.trim()
}

// ══════════════════════════════════════════════════════════════
// REPORT GENERATION
// ══════════════════════════════════════════════════════════════

function generateReport(
  results: LegislationProcessingResult[],
  totalTimeMs: number
): BatchProcessingReport {
  const successCount = results.filter(r => r.status === 'success').length
  const partialCount = results.filter(r => r.status === 'partial').length
  const failedCount = results.filter(r => r.status === 'failed').length

  const totalObligations = results.reduce((sum, r) => sum + r.obligations.length, 0)
  const totalArticles = results.reduce((sum, r) => {
    return sum + (r.parsed?.structure.articles.length || 0)
  }, 0)

  const failedItems = results
    .filter(r => r.status === 'failed')
    .map(r => r.legislationId)

  // Count errors by type
  const errorsByType: Record<string, number> = {}
  results.forEach(r => {
    r.errors.forEach(error => {
      const errorType = extractErrorType(error)
      errorsByType[errorType] = (errorsByType[errorType] || 0) + 1
    })
  })

  return {
    totalItems: results.length,
    successCount,
    partialCount,
    failedCount,
    totalProcessingTimeMs: totalTimeMs,
    results,
    totalObligations,
    totalArticles,
    avgObligationsPerLaw: results.length > 0 ? totalObligations / results.length : 0,
    avgProcessingTimePerItem: results.length > 0 ? totalTimeMs / results.length : 0,
    failedItems,
    errorsByType
  }
}

function extractErrorType(errorMessage: string): string {
  if (errorMessage.includes('not found')) return 'NOT_FOUND'
  if (errorMessage.includes('API')) return 'API_ERROR'
  if (errorMessage.includes('parse') || errorMessage.includes('JSON')) return 'PARSE_ERROR'
  if (errorMessage.includes('timeout')) return 'TIMEOUT'
  if (errorMessage.includes('rate limit')) return 'RATE_LIMIT'
  return 'UNKNOWN'
}

// ══════════════════════════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════════════════════════

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ══════════════════════════════════════════════════════════════
// EXPORT PUBLIC API
// ══════════════════════════════════════════════════════════════

export {
  processLegislationBatch,
  type BatchProcessingOptions,
  type LegislationProcessingResult,
  type BatchProcessingReport
}
