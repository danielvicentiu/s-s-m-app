/**
 * M6 BATCH PROCESSOR
 *
 * Processes multiple legislation entries through the full pipeline with:
 * - Queue management with concurrency control (max 3 parallel)
 * - Automatic retry logic (max 3 attempts per item)
 * - Progress percentage tracking with callbacks
 * - Comprehensive summary reporting
 * - Failed item tracking and recovery
 *
 * USAGE:
 * const result = await processLegislationBatch(['leg-1', 'leg-2', 'leg-3'], {
 *   onProgress: (progress) => console.log(`${progress.percentage}% complete`),
 *   concurrency: 3,
 *   maxRetries: 3
 * })
 */

// TODO: Re-enable when legislation-pipeline is implemented
// import { runPipeline, type PipelineResult, type PipelineOptions } from './legislation-pipeline'
import type { CountryCode } from '@/lib/types'

// Temporary placeholder types and functions
type PipelineResult = any
type PipelineOptions = any
const runPipeline = async (...args: any[]): Promise<any> => {
  throw new Error('legislation-pipeline not yet implemented')
}

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

export interface BatchProcessOptions {
  // Pipeline options (passed through to individual pipelines)
  pipelineOptions?: Omit<PipelineOptions, 'onProgress'>

  // Concurrency control
  concurrency?: number           // Max parallel executions (default: 3)
  maxRetries?: number           // Max retry attempts per item (default: 3)
  retryDelay?: number           // Delay between retries in ms (default: 1000)

  // Progress tracking
  onProgress?: (progress: BatchProgress) => void
  onItemComplete?: (result: BatchItemResult) => void
  onItemError?: (error: BatchItemError) => void
}

export interface BatchProgress {
  total: number
  completed: number
  failed: number
  inProgress: number
  pending: number
  percentage: number
  startedAt: string
  elapsedMs: number
  estimatedRemainingMs: number | null
}

export interface BatchItemResult {
  legislationId: string
  country: CountryCode
  source: string
  status: 'success' | 'failed' | 'partial_success'
  attempts: number
  result: PipelineResult | null
  error: string | null
  startedAt: string
  completedAt: string
  duration: number
}

export interface BatchItemError {
  legislationId: string
  attempt: number
  error: string
  timestamp: string
  willRetry: boolean
}

export interface BatchProcessResult {
  status: 'completed' | 'partial_failure' | 'failed'

  // Counts
  totalItems: number
  successCount: number
  failedCount: number
  partialSuccessCount: number

  // Results
  items: BatchItemResult[]

  // Summary statistics
  summary: {
    totalEntriesScraped: number
    totalDocumentsParsed: number
    totalObligationsExtracted: number
    totalObligationsValidated: number
    totalObligationsPublished: number
    totalErrors: number
  }

  // Timing
  startedAt: string
  completedAt: string
  totalDuration: number
  averageItemDuration: number

  // Failed items for retry
  failedItems: Array<{
    legislationId: string
    lastError: string
    attempts: number
  }>
}

interface QueueItem {
  legislationId: string
  country: CountryCode
  source: string
  attempts: number
  lastError: string | null
}

// ══════════════════════════════════════════════════════════════
// MAIN BATCH PROCESSOR
// ══════════════════════════════════════════════════════════════

/**
 * Process multiple legislation entries through the pipeline with queue management
 */
export async function processLegislationBatch(
  legislationIds: string[],
  options: BatchProcessOptions = {}
): Promise<BatchProcessResult> {
  const startTime = Date.now()
  const startedAt = new Date().toISOString()

  const {
    concurrency = 3,
    maxRetries = 3,
    retryDelay = 1000,
    onProgress,
    onItemComplete,
    onItemError,
    pipelineOptions = {}
  } = options

  console.log(`\n${'='.repeat(70)}`)
  console.log(`🔄 Starting M6 Batch Processor`)
  console.log(`   Total Items: ${legislationIds.length}`)
  console.log(`   Concurrency: ${concurrency}`)
  console.log(`   Max Retries: ${maxRetries}`)
  console.log('='.repeat(70) + '\n')

  // Initialize state
  const queue: QueueItem[] = legislationIds.map(id => ({
    legislationId: id,
    country: extractCountryFromId(id),
    source: extractSourceFromId(id),
    attempts: 0,
    lastError: null
  }))

  const results: BatchItemResult[] = []
  const inProgress = new Set<string>()
  const completed = new Set<string>()
  const failed = new Set<string>()

  // Progress tracking helper
  const reportProgress = () => {
    const elapsedMs = Date.now() - startTime
    const completedCount = completed.size
    const avgDuration = completedCount > 0
      ? elapsedMs / completedCount
      : null

    const remaining = legislationIds.length - completedCount
    const estimatedRemainingMs = avgDuration && remaining > 0
      ? avgDuration * remaining
      : null

    const progress: BatchProgress = {
      total: legislationIds.length,
      completed: completedCount,
      failed: failed.size,
      inProgress: inProgress.size,
      pending: queue.length,
      percentage: (completedCount / legislationIds.length) * 100,
      startedAt,
      elapsedMs,
      estimatedRemainingMs
    }

    if (onProgress) {
      onProgress(progress)
    }

    // Log progress
    console.log(
      `[Progress] ${progress.percentage.toFixed(1)}% | ` +
      `Completed: ${completedCount}/${legislationIds.length} | ` +
      `Failed: ${failed.size} | ` +
      `In Progress: ${inProgress.size} | ` +
      `Queue: ${queue.length}`
    )
  }

  // Worker function that processes items from the queue
  const worker = async (): Promise<void> => {
    while (queue.length > 0 || inProgress.size > 0) {
      // Wait if we're at max concurrency
      if (inProgress.size >= concurrency) {
        await sleep(100)
        continue
      }

      // Get next item from queue
      const item = queue.shift()
      if (!item) {
        await sleep(100)
        continue
      }

      const { legislationId, country, source, attempts, lastError } = item

      // Mark as in progress
      inProgress.add(legislationId)
      reportProgress()

      const itemStartTime = Date.now()
      const itemStartedAt = new Date().toISOString()

      try {
        console.log(
          `\n[Item ${completed.size + 1}/${legislationIds.length}] ` +
          `Processing: ${legislationId} (attempt ${attempts + 1}/${maxRetries + 1})`
        )

        // Run pipeline for this legislation
        const pipelineResult = await runPipeline(country, source, {
          ...pipelineOptions,
          verbose: false,
          onProgress: (update) => {
            console.log(`  [${legislationId}] [${update.stage}] ${update.message}`)
          }
        })

        // Determine status
        const status =
          pipelineResult.status === 'completed' ? 'success' :
          pipelineResult.status === 'partial_success' ? 'partial_success' :
          'failed'

        // Create result
        const result: BatchItemResult = {
          legislationId,
          country,
          source,
          status,
          attempts: attempts + 1,
          result: pipelineResult,
          error: pipelineResult.summary.errors.length > 0
            ? pipelineResult.summary.errors.join('; ')
            : null,
          startedAt: itemStartedAt,
          completedAt: new Date().toISOString(),
          duration: Date.now() - itemStartTime
        }

        // Handle result
        if (status === 'failed' && attempts < maxRetries) {
          // Retry
          console.log(`  ⚠️  Failed, will retry (attempt ${attempts + 2}/${maxRetries + 1})`)

          if (onItemError) {
            onItemError({
              legislationId,
              attempt: attempts + 1,
              error: result.error || 'Unknown error',
              timestamp: new Date().toISOString(),
              willRetry: true
            })
          }

          // Re-add to queue after delay
          await sleep(retryDelay)
          queue.push({
            legislationId,
            country,
            source,
            attempts: attempts + 1,
            lastError: result.error
          })
        } else {
          // Final result (success or max retries reached)
          results.push(result)
          completed.add(legislationId)

          if (status === 'failed') {
            failed.add(legislationId)
            console.log(`  ❌ Failed after ${attempts + 1} attempts`)

            if (onItemError) {
              onItemError({
                legislationId,
                attempt: attempts + 1,
                error: result.error || 'Unknown error',
                timestamp: new Date().toISOString(),
                willRetry: false
              })
            }
          } else {
            console.log(`  ✅ ${status === 'success' ? 'Success' : 'Partial success'}`)
          }

          if (onItemComplete) {
            onItemComplete(result)
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error(`  ❌ Error processing ${legislationId}:`, errorMessage)

        // Retry or fail
        if (attempts < maxRetries) {
          console.log(`  ⚠️  Will retry (attempt ${attempts + 2}/${maxRetries + 1})`)

          if (onItemError) {
            onItemError({
              legislationId,
              attempt: attempts + 1,
              error: errorMessage,
              timestamp: new Date().toISOString(),
              willRetry: true
            })
          }

          await sleep(retryDelay)
          queue.push({
            legislationId,
            country,
            source,
            attempts: attempts + 1,
            lastError: errorMessage
          })
        } else {
          // Max retries reached
          const result: BatchItemResult = {
            legislationId,
            country,
            source,
            status: 'failed',
            attempts: attempts + 1,
            result: null,
            error: errorMessage,
            startedAt: itemStartedAt,
            completedAt: new Date().toISOString(),
            duration: Date.now() - itemStartTime
          }

          results.push(result)
          completed.add(legislationId)
          failed.add(legislationId)

          if (onItemError) {
            onItemError({
              legislationId,
              attempt: attempts + 1,
              error: errorMessage,
              timestamp: new Date().toISOString(),
              willRetry: false
            })
          }
          if (onItemComplete) {
            onItemComplete(result)
          }
        }
      } finally {
        inProgress.delete(legislationId)
        reportProgress()
      }
    }
  }

  // Start workers
  const workers = Array.from({ length: concurrency }, () => worker())
  await Promise.all(workers)

  // ──────────────────────────────────────────────────────────
  // BUILD FINAL RESULT
  // ──────────────────────────────────────────────────────────

  const completedAt = new Date().toISOString()
  const totalDuration = Date.now() - startTime

  // Calculate summary statistics
  const summary = {
    totalEntriesScraped: 0,
    totalDocumentsParsed: 0,
    totalObligationsExtracted: 0,
    totalObligationsValidated: 0,
    totalObligationsPublished: 0,
    totalErrors: 0
  }

  const successCount = results.filter(r => r.status === 'success').length
  const partialSuccessCount = results.filter(r => r.status === 'partial_success').length
  const failedCount = results.filter(r => r.status === 'failed').length

  results.forEach(result => {
    if (result.result) {
      summary.totalEntriesScraped += result.result.summary.entriesScraped
      summary.totalDocumentsParsed += result.result.summary.documentsParsed
      summary.totalObligationsExtracted += result.result.summary.obligationsExtracted
      summary.totalObligationsValidated += result.result.summary.obligationsValidated
      summary.totalObligationsPublished += result.result.summary.obligationsPublished
      summary.totalErrors += result.result.summary.errors.length
    }
    if (result.error) {
      summary.totalErrors++
    }
  })

  // Determine overall status
  const status =
    failedCount === 0 ? 'completed' :
    successCount > 0 || partialSuccessCount > 0 ? 'partial_failure' :
    'failed'

  // Build failed items list
  const failedItems = results
    .filter(r => r.status === 'failed')
    .map(r => ({
      legislationId: r.legislationId,
      lastError: r.error || 'Unknown error',
      attempts: r.attempts
    }))

  const batchResult: BatchProcessResult = {
    status,
    totalItems: legislationIds.length,
    successCount,
    failedCount,
    partialSuccessCount,
    items: results,
    summary,
    startedAt,
    completedAt,
    totalDuration,
    averageItemDuration: results.length > 0
      ? results.reduce((sum, r) => sum + r.duration, 0) / results.length
      : 0,
    failedItems
  }

  // Print final summary
  printBatchSummary(batchResult)

  return batchResult
}

// ══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Extract country code from legislation ID
 * Expected format: "LEG_RO_123" or similar
 */
function extractCountryFromId(legislationId: string): CountryCode {
  // Try to extract country code from ID
  const match = legislationId.match(/_(RO|BG|HU|DE|PL)_/)
  if (match) {
    return match[1] as CountryCode
  }

  // Default to RO if can't extract
  console.warn(`Could not extract country from ${legislationId}, defaulting to RO`)
  return 'RO'
}

/**
 * Extract source URL from legislation ID
 * In production, this would look up from database
 */
function extractSourceFromId(legislationId: string): string {
  // In production, look up from legislation_entries table
  // For now, return a mock source based on country
  const country = extractCountryFromId(legislationId)
  const sources: Record<CountryCode, string> = {
    RO: 'legislatie.just.ro',
    BG: 'lex.bg',
    HU: 'njt.hu',
    DE: 'gesetze-im-internet.de',
    PL: 'isap.sejm.gov.pl'
  }
  return sources[country]
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Print formatted batch summary
 */
function printBatchSummary(result: BatchProcessResult): void {
  const statusEmoji =
    result.status === 'completed' ? '✅' :
    result.status === 'partial_failure' ? '⚠️' :
    '❌'

  console.log(`\n${'='.repeat(70)}`)
  console.log(`${statusEmoji} M6 Batch Processing Summary`)
  console.log('='.repeat(70))
  console.log(`Status: ${result.status.toUpperCase()}`)
  console.log(`Duration: ${(result.totalDuration / 1000).toFixed(2)}s`)
  console.log(`Avg per item: ${(result.averageItemDuration / 1000).toFixed(2)}s`)

  console.log(`\n📊 Results:`)
  console.log(`  Total Items:      ${result.totalItems}`)
  console.log(`  ✅ Successful:    ${result.successCount}`)
  console.log(`  ⚠️  Partial:       ${result.partialSuccessCount}`)
  console.log(`  ❌ Failed:        ${result.failedCount}`)

  console.log(`\n📈 Aggregate Statistics:`)
  console.log(`  📥 Scraped:       ${result.summary.totalEntriesScraped} entries`)
  console.log(`  📄 Parsed:        ${result.summary.totalDocumentsParsed} documents`)
  console.log(`  🔍 Extracted:     ${result.summary.totalObligationsExtracted} obligations`)
  console.log(`  ✓ Validated:     ${result.summary.totalObligationsValidated} obligations`)
  console.log(`  📤 Published:     ${result.summary.totalObligationsPublished} obligations`)
  console.log(`  ⚠️  Total Errors:  ${result.summary.totalErrors}`)

  if (result.failedItems.length > 0) {
    console.log(`\n❌ Failed Items (${result.failedItems.length}):`)
    result.failedItems.forEach((item, idx) => {
      console.log(
        `  ${idx + 1}. ${item.legislationId} ` +
        `(${item.attempts} attempts) - ${item.lastError}`
      )
    })
  }

  console.log('='.repeat(70) + '\n')
}

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════
// All types and functions are already exported inline above
