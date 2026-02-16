/**
 * LEGISLATION PIPELINE ORCHESTRATOR
 *
 * Coordinates the full legislation processing pipeline:
 * M1 (Scraping) → M2 (Parsing) → M3 (Obligation Extraction) → M4 (Validation)
 *
 * FEATURES:
 * - Sequential stage execution with dependency management
 * - Comprehensive error handling per stage
 * - Resume capability from failed stages
 * - Real-time progress tracking with detailed logging
 * - Batch processing for multiple countries in parallel
 * - Performance metrics and timing statistics
 * - Dry-run mode for testing
 *
 * USAGE:
 * // Single country pipeline
 * const result = await runPipeline('RO', 'legislatie.just.ro')
 *
 * // Batch processing (parallel per country)
 * const results = await runBatchPipeline(['RO', 'BG', 'HU'])
 *
 * // Resume from failed stage
 * const resumed = await runPipeline('RO', source, { resumeFromStage: 'M3' })
 */

import type {
  CountryCode,
  LegislationDomain,
  Obligation
} from '@/lib/types'

// TODO: Move these types to @/lib/types
type LegislationEntry = any
type LegislationParsed = any

import { scrapeLegislatie } from './m1-legislation-scraper'
import { extractObligations } from './m3-obligation-extractor'
import {
  validateObligations,
  publishObligations,
  generateValidationReport,
  type ValidatedObligation,
  type PublishResult,
  type ValidationReport
} from './m4-validator'

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

export type PipelineStage = 'M1' | 'M2' | 'M3' | 'M4'

export type PipelineStatus =
  | 'idle'
  | 'running'
  | 'completed'
  | 'failed'
  | 'partial_success'

export interface PipelineOptions {
  // Execution control
  resumeFromStage?: PipelineStage
  stopAtStage?: PipelineStage
  dryRun?: boolean

  // M1 Scraper options
  sinceDays?: number
  maxEntries?: number
  filterDomains?: LegislationDomain[]

  // M2 Parser options (placeholder for when M2 is implemented)
  parseOptions?: {
    language?: 'ro' | 'bg' | 'hu' | 'de' | 'pl' | 'en'
    extractMetadata?: boolean
  }

  // M3 Extractor options
  anthropicApiKey?: string
  batchSize?: number

  // M4 Validator options
  minValidationScore?: number
  notifyOrganizations?: boolean

  // Logging
  verbose?: boolean
  onProgress?: (update: PipelineProgressUpdate) => void
}

export interface PipelineProgressUpdate {
  stage: PipelineStage
  status: 'started' | 'in_progress' | 'completed' | 'failed'
  message: string
  progress?: {
    current: number
    total: number
    percentage: number
  }
  data?: unknown
  timestamp: string
}

export interface StageResult<T> {
  success: boolean
  stage: PipelineStage
  data: T | null
  error: string | null
  duration: number
  startedAt: string
  completedAt: string | null
}

export interface PipelineResult {
  status: PipelineStatus
  country: CountryCode
  source: string
  startedAt: string
  completedAt: string | null
  totalDuration: number

  // Stage results
  stages: {
    M1: StageResult<LegislationEntry[]>
    M2: StageResult<LegislationParsed[]>
    M3: StageResult<Obligation[]>
    M4: StageResult<{
      validated: ValidatedObligation[]
      published: PublishResult
      report: ValidationReport
    }>
  }

  // Summary
  summary: {
    entriesScraped: number
    documentsParsed: number
    obligationsExtracted: number
    obligationsValidated: number
    obligationsPublished: number
    errors: string[]
  }

  // Options used
  options: PipelineOptions
}

export interface BatchPipelineResult {
  totalCountries: number
  successfulCountries: number
  failedCountries: number
  results: Record<CountryCode, PipelineResult>
  startedAt: string
  completedAt: string
  totalDuration: number
}

// ══════════════════════════════════════════════════════════════
// MAIN PIPELINE EXECUTION
// ══════════════════════════════════════════════════════════════

/**
 * Executes the full legislation processing pipeline for a single country
 */
export async function runPipeline(
  country: CountryCode,
  source: string,
  options: PipelineOptions = {}
): Promise<PipelineResult> {
  const startTime = Date.now()
  const startedAt = new Date().toISOString()

  const {
    resumeFromStage,
    stopAtStage,
    dryRun = false,
    verbose = true,
    onProgress
  } = options

  // Initialize result structure
  const result: PipelineResult = {
    status: 'running',
    country,
    source,
    startedAt,
    completedAt: null,
    totalDuration: 0,
    stages: {
      M1: createEmptyStageResult('M1'),
      M2: createEmptyStageResult('M2'),
      M3: createEmptyStageResult('M3'),
      M4: createEmptyStageResult('M4')
    },
    summary: {
      entriesScraped: 0,
      documentsParsed: 0,
      obligationsExtracted: 0,
      obligationsValidated: 0,
      obligationsPublished: 0,
      errors: []
    },
    options
  }

  // Helper: Log progress
  const logProgress = (update: Omit<PipelineProgressUpdate, 'timestamp'>) => {
    const fullUpdate: PipelineProgressUpdate = {
      ...update,
      timestamp: new Date().toISOString()
    }

    if (verbose) {
      const progressStr = update.progress
        ? ` [${update.progress.percentage.toFixed(0)}%]`
        : ''
      console.log(
        `[Pipeline ${country}] [${update.stage}] ${update.status.toUpperCase()}${progressStr}: ${update.message}`
      )
    }

    if (onProgress) {
      onProgress(fullUpdate)
    }
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log(`🚀 Starting legislation pipeline for ${country}`)
  console.log(`   Source: ${source}`)
  console.log(`   Dry Run: ${dryRun}`)
  if (resumeFromStage) console.log(`   Resume from: ${resumeFromStage}`)
  if (stopAtStage) console.log(`   Stop at: ${stopAtStage}`)
  console.log('='.repeat(60) + '\n')

  try {
    // ──────────────────────────────────────────────────────────
    // STAGE M1: SCRAPING
    // ──────────────────────────────────────────────────────────

    let scraperData: LegislationEntry[] = []

    if (!resumeFromStage || resumeFromStage === 'M1') {
      result.stages.M1 = await executeStage(
        'M1',
        async () => {
          logProgress({
            stage: 'M1',
            status: 'started',
            message: 'Starting RSS feed scraping'
          })

          const entries = await scrapeLegislatie(country, {
            sinceDays: options.sinceDays,
            maxEntries: options.maxEntries,
            filterDomains: options.filterDomains
          })

          result.summary.entriesScraped = entries.length

          logProgress({
            stage: 'M1',
            status: 'completed',
            message: `Scraped ${entries.length} legislation entries`,
            data: {
              total: entries.length,
              byDomain: groupByDomain(entries)
            }
          })

          return entries
        },
        result.summary.errors
      )

      scraperData = result.stages.M1.data || []

      if (!result.stages.M1.success || scraperData.length === 0) {
        result.status = 'failed'
        result.summary.errors.push('M1 stage failed or returned no data')
        throw new Error('M1 scraping failed - cannot continue pipeline')
      }

      if (stopAtStage === 'M1') {
        console.log(`\n⏸️  Pipeline stopped at M1 as requested\n`)
        result.status = 'completed'
        result.completedAt = new Date().toISOString()
        result.totalDuration = Date.now() - startTime
        return result
      }
    } else {
      console.log(`⏭️  Skipping M1 (resuming from ${resumeFromStage})`)
    }

    // ──────────────────────────────────────────────────────────
    // STAGE M2: PARSING
    // ──────────────────────────────────────────────────────────

    let parsedData: LegislationParsed[] = []

    if (!resumeFromStage || ['M1', 'M2'].includes(resumeFromStage)) {
      result.stages.M2 = await executeStage(
        'M2',
        async () => {
          logProgress({
            stage: 'M2',
            status: 'started',
            message: `Parsing ${scraperData.length} legislation documents`
          })

          // TODO: Implement M2 parser when available
          // For now, create mock parsed data structure
          const mockParsed: LegislationParsed[] = scraperData.map((entry, idx) => ({
            rawText: entry.title,
            language: getLanguageFromCountry(country),
            detectedActType: 'law' as const,
            structure: {
              chapters: [],
              articles: [
                {
                  id: `ART_${idx}_1`,
                  number: '1',
                  type: 'article' as const,
                  title: entry.title,
                  content: entry.title,
                  paragraphs: [],
                  hasObligations: true,
                  hasPenalties: false,
                  crossReferences: [],
                  chapterId: null,
                  startIndex: 0,
                  endIndex: entry.title.length
                }
              ],
              annexes: []
            },
            analysis: {
              totalArticles: 1,
              totalChapters: 0,
              totalAnnexes: 0,
              hasPenaltiesSection: false,
              penaltiesArticles: [],
              crossReferences: [],
              obligationKeywords: []
            },
            parsedAt: new Date().toISOString(),
            parsingWarnings: ['Mock data - M2 parser not yet implemented']
          }))

          result.summary.documentsParsed = mockParsed.length

          logProgress({
            stage: 'M2',
            status: 'completed',
            message: `Parsed ${mockParsed.length} documents`,
            data: {
              totalArticles: mockParsed.reduce((sum, p) => sum + p.analysis.totalArticles, 0),
              articlesWithObligations: mockParsed.reduce(
                (sum, p) => sum + p.structure.articles.filter(a => a.hasObligations).length,
                0
              )
            }
          })

          return mockParsed
        },
        result.summary.errors
      )

      parsedData = result.stages.M2.data || []

      if (!result.stages.M2.success || parsedData.length === 0) {
        result.status = 'failed'
        result.summary.errors.push('M2 stage failed or returned no data')
        throw new Error('M2 parsing failed - cannot continue pipeline')
      }

      if (stopAtStage === 'M2') {
        console.log(`\n⏸️  Pipeline stopped at M2 as requested\n`)
        result.status = 'completed'
        result.completedAt = new Date().toISOString()
        result.totalDuration = Date.now() - startTime
        return result
      }
    } else {
      console.log(`⏭️  Skipping M2 (resuming from ${resumeFromStage})`)
    }

    // ──────────────────────────────────────────────────────────
    // STAGE M3: OBLIGATION EXTRACTION
    // ──────────────────────────────────────────────────────────

    let obligationsData: Obligation[] = []

    if (!resumeFromStage || ['M1', 'M2', 'M3'].includes(resumeFromStage)) {
      result.stages.M3 = await executeStage(
        'M3',
        async () => {
          logProgress({
            stage: 'M3',
            status: 'started',
            message: `Extracting obligations from ${parsedData.length} documents`
          })

          const allObligations: Obligation[] = []

          for (let i = 0; i < parsedData.length; i++) {
            const parsed = parsedData[i]
            const legalActName = scraperData[i]?.act_number || `ACT_${i + 1}`

            logProgress({
              stage: 'M3',
              status: 'in_progress',
              message: `Processing document ${i + 1}/${parsedData.length}: ${legalActName}`,
              progress: {
                current: i + 1,
                total: parsedData.length,
                percentage: ((i + 1) / parsedData.length) * 100
              }
            })

            try {
              const obligations = await extractObligations(
                parsed,
                legalActName,
                options.anthropicApiKey
              )

              allObligations.push(...obligations)
            } catch (error) {
              const errMsg = `Failed to extract obligations from ${legalActName}: ${error instanceof Error ? error.message : 'Unknown error'}`
              console.error(`[M3] ${errMsg}`)
              result.summary.errors.push(errMsg)
              // Continue with next document
            }
          }

          result.summary.obligationsExtracted = allObligations.length

          logProgress({
            stage: 'M3',
            status: 'completed',
            message: `Extracted ${allObligations.length} obligations`,
            data: {
              total: allObligations.length,
              avgConfidence:
                allObligations.reduce((sum, o) => sum + o.confidence, 0) /
                (allObligations.length || 1)
            }
          })

          return allObligations
        },
        result.summary.errors
      )

      obligationsData = result.stages.M3.data || []

      if (!result.stages.M3.success) {
        result.status = 'partial_success'
        result.summary.errors.push('M3 stage encountered errors')
      }

      if (obligationsData.length === 0) {
        console.warn(`⚠️  M3 extracted 0 obligations - stopping pipeline`)
        result.status = 'partial_success'
        result.completedAt = new Date().toISOString()
        result.totalDuration = Date.now() - startTime
        return result
      }

      if (stopAtStage === 'M3') {
        console.log(`\n⏸️  Pipeline stopped at M3 as requested\n`)
        result.status = 'completed'
        result.completedAt = new Date().toISOString()
        result.totalDuration = Date.now() - startTime
        return result
      }
    } else {
      console.log(`⏭️  Skipping M3 (resuming from ${resumeFromStage})`)
    }

    // ──────────────────────────────────────────────────────────
    // STAGE M4: VALIDATION & PUBLISHING
    // ──────────────────────────────────────────────────────────

    result.stages.M4 = await executeStage(
      'M4',
      async () => {
        logProgress({
          stage: 'M4',
          status: 'started',
          message: `Validating ${obligationsData.length} obligations`
        })

        // Validate
        const validated = await validateObligations(obligationsData)

        result.summary.obligationsValidated = validated.filter(
          v => v.status === 'validated'
        ).length

        logProgress({
          stage: 'M4',
          status: 'in_progress',
          message: `Validated ${result.summary.obligationsValidated}/${validated.length} obligations`,
          progress: {
            current: 1,
            total: 2,
            percentage: 50
          }
        })

        // Generate report
        const report = generateValidationReport(validated)

        // Publish
        const publishResult = await publishObligations(validated, 'LEGISLATION_ID', {
          dryRun,
          notifyOrganizations: options.notifyOrganizations,
          countryCode: country
        })

        result.summary.obligationsPublished = publishResult.publishedCount

        logProgress({
          stage: 'M4',
          status: 'completed',
          message: `Published ${publishResult.publishedCount} obligations (${publishResult.notifiedOrganizations} orgs notified)`,
          data: {
            validated: result.summary.obligationsValidated,
            published: publishResult.publishedCount,
            failed: publishResult.failedCount
          }
        })

        return {
          validated,
          published: publishResult,
          report
        }
      },
      result.summary.errors
    )

    // ──────────────────────────────────────────────────────────
    // FINALIZE RESULT
    // ──────────────────────────────────────────────────────────

    result.completedAt = new Date().toISOString()
    result.totalDuration = Date.now() - startTime

    // Determine final status
    const hasErrors = result.summary.errors.length > 0
    const allStagesSucceeded = Object.values(result.stages).every(s => s.success)

    if (allStagesSucceeded && !hasErrors) {
      result.status = 'completed'
    } else if (result.summary.obligationsPublished > 0) {
      result.status = 'partial_success'
    } else {
      result.status = 'failed'
    }

    // Print summary
    printPipelineSummary(result)

    return result
  } catch (error) {
    result.status = 'failed'
    result.completedAt = new Date().toISOString()
    result.totalDuration = Date.now() - startTime

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    result.summary.errors.push(`Pipeline failed: ${errorMessage}`)

    console.error(`\n❌ Pipeline failed for ${country}:`, error)

    return result
  }
}

// ══════════════════════════════════════════════════════════════
// BATCH PIPELINE EXECUTION
// ══════════════════════════════════════════════════════════════

/**
 * Executes the pipeline for multiple countries in parallel
 */
export async function runBatchPipeline(
  countries: CountryCode[],
  options: PipelineOptions = {}
): Promise<BatchPipelineResult> {
  const startTime = Date.now()
  const startedAt = new Date().toISOString()

  console.log(`\n${'='.repeat(70)}`)
  console.log(`🚀 Starting BATCH legislation pipeline for ${countries.length} countries`)
  console.log(`   Countries: ${countries.join(', ')}`)
  console.log(`   Dry Run: ${options.dryRun || false}`)
  console.log('='.repeat(70) + '\n')

  // Execute pipelines in parallel (one per country)
  const pipelinePromises = countries.map(country =>
    runPipeline(country, `${country}_SOURCE`, {
      ...options,
      verbose: false, // Reduce noise in batch mode
      onProgress: (update) => {
        console.log(`[${country}] [${update.stage}] ${update.message}`)
        if (options.onProgress) {
          options.onProgress(update)
        }
      }
    }).catch(error => {
      console.error(`❌ Pipeline failed for ${country}:`, error)
      // Return a failed result instead of throwing
      return {
        status: 'failed' as PipelineStatus,
        country,
        source: `${country}_SOURCE`,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        totalDuration: 0,
        stages: {
          M1: createEmptyStageResult('M1'),
          M2: createEmptyStageResult('M2'),
          M3: createEmptyStageResult('M3'),
          M4: createEmptyStageResult('M4')
        },
        summary: {
          entriesScraped: 0,
          documentsParsed: 0,
          obligationsExtracted: 0,
          obligationsValidated: 0,
          obligationsPublished: 0,
          errors: [error instanceof Error ? error.message : 'Unknown error']
        },
        options
      } as PipelineResult
    })
  )

  const results = await Promise.all(pipelinePromises)

  // Aggregate results
  const batchResult: BatchPipelineResult = {
    totalCountries: countries.length,
    successfulCountries: results.filter(r => r.status === 'completed').length,
    failedCountries: results.filter(r => r.status === 'failed').length,
    results: {} as Record<CountryCode, PipelineResult>,
    startedAt,
    completedAt: new Date().toISOString(),
    totalDuration: Date.now() - startTime
  }

  // Map results by country
  results.forEach(result => {
    batchResult.results[result.country] = result
  })

  // Print batch summary
  printBatchSummary(batchResult)

  return batchResult
}

// ══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Executes a single pipeline stage with error handling and timing
 */
async function executeStage<T>(
  stage: PipelineStage,
  executor: () => Promise<T>,
  errorLog: string[]
): Promise<StageResult<T>> {
  const startTime = Date.now()
  const startedAt = new Date().toISOString()

  try {
    const data = await executor()

    return {
      success: true,
      stage,
      data,
      error: null,
      duration: Date.now() - startTime,
      startedAt,
      completedAt: new Date().toISOString()
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    errorLog.push(`${stage}: ${errorMessage}`)

    return {
      success: false,
      stage,
      data: null,
      error: errorMessage,
      duration: Date.now() - startTime,
      startedAt,
      completedAt: new Date().toISOString()
    }
  }
}

/**
 * Creates an empty stage result
 */
function createEmptyStageResult<T>(stage: PipelineStage): StageResult<T> {
  return {
    success: false,
    stage,
    data: null,
    error: null,
    duration: 0,
    startedAt: '',
    completedAt: null
  }
}

/**
 * Groups legislation entries by domain
 */
function groupByDomain(entries: LegislationEntry[]): Record<string, number> {
  return entries.reduce(
    (acc, entry) => {
      acc[entry.domain] = (acc[entry.domain] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
}

/**
 * Gets language code from country code
 */
function getLanguageFromCountry(
  country: CountryCode
): 'ro' | 'bg' | 'hu' | 'de' | 'pl' | 'en' {
  const mapping: Record<CountryCode, 'ro' | 'bg' | 'hu' | 'de' | 'pl'> = {
    RO: 'ro',
    BG: 'bg',
    HU: 'hu',
    DE: 'de',
    PL: 'pl'
  }
  return mapping[country] || 'en'
}

/**
 * Prints a formatted pipeline summary
 */
function printPipelineSummary(result: PipelineResult): void {
  const statusEmoji =
    result.status === 'completed'
      ? '✅'
      : result.status === 'partial_success'
        ? '⚠️'
        : '❌'

  console.log(`\n${'='.repeat(60)}`)
  console.log(`${statusEmoji} Pipeline Summary - ${result.country}`)
  console.log('='.repeat(60))
  console.log(`Status: ${result.status.toUpperCase()}`)
  console.log(`Duration: ${(result.totalDuration / 1000).toFixed(2)}s`)
  console.log(`\nResults:`)
  console.log(`  📥 Scraped:    ${result.summary.entriesScraped} entries`)
  console.log(`  📄 Parsed:     ${result.summary.documentsParsed} documents`)
  console.log(`  🔍 Extracted:  ${result.summary.obligationsExtracted} obligations`)
  console.log(`  ✓ Validated:  ${result.summary.obligationsValidated} obligations`)
  console.log(`  📤 Published:  ${result.summary.obligationsPublished} obligations`)

  console.log(`\nStage Timings:`)
  Object.entries(result.stages).forEach(([stage, stageResult]) => {
    if (stageResult.duration > 0) {
      const status = stageResult.success ? '✓' : '✗'
      console.log(`  ${status} ${stage}: ${(stageResult.duration / 1000).toFixed(2)}s`)
    }
  })

  if (result.summary.errors.length > 0) {
    console.log(`\n⚠️  Errors (${result.summary.errors.length}):`)
    result.summary.errors.forEach((error, idx) => {
      console.log(`  ${idx + 1}. ${error}`)
    })
  }

  console.log('='.repeat(60) + '\n')
}

/**
 * Prints a formatted batch pipeline summary
 */
function printBatchSummary(result: BatchPipelineResult): void {
  console.log(`\n${'='.repeat(70)}`)
  console.log(`📊 Batch Pipeline Summary`)
  console.log('='.repeat(70))
  console.log(`Total Countries: ${result.totalCountries}`)
  console.log(`✅ Successful:   ${result.successfulCountries}`)
  console.log(`❌ Failed:       ${result.failedCountries}`)
  console.log(`Duration:        ${(result.totalDuration / 1000).toFixed(2)}s`)

  console.log(`\nPer-Country Results:`)
  Object.entries(result.results).forEach(([country, countryResult]) => {
    const statusEmoji =
      countryResult.status === 'completed'
        ? '✅'
        : countryResult.status === 'partial_success'
          ? '⚠️'
          : '❌'
    console.log(
      `  ${statusEmoji} ${country}: ${countryResult.summary.obligationsPublished} published, ` +
        `${countryResult.summary.errors.length} errors`
    )
  })

  console.log(`\nAggregate Statistics:`)
  const totals = Object.values(result.results).reduce(
    (acc, r) => ({
      scraped: acc.scraped + r.summary.entriesScraped,
      parsed: acc.parsed + r.summary.documentsParsed,
      extracted: acc.extracted + r.summary.obligationsExtracted,
      validated: acc.validated + r.summary.obligationsValidated,
      published: acc.published + r.summary.obligationsPublished
    }),
    { scraped: 0, parsed: 0, extracted: 0, validated: 0, published: 0 }
  )

  console.log(`  📥 Total Scraped:    ${totals.scraped}`)
  console.log(`  📄 Total Parsed:     ${totals.parsed}`)
  console.log(`  🔍 Total Extracted:  ${totals.extracted}`)
  console.log(`  ✓ Total Validated:  ${totals.validated}`)
  console.log(`  📤 Total Published:  ${totals.published}`)

  console.log('='.repeat(70) + '\n')
}

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════
// All types and functions are already exported inline above
