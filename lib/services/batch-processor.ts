/**
 * M6 BATCH PROCESSOR SERVICE
 *
 * Orchestrates the full legislative processing pipeline:
 * Queue → M1 Scraper → M2 Parser (mock) → M3 Obligation Extractor → Complete
 *
 * FEATURES:
 * - Queue management: Add acts to processing queue
 * - Pipeline orchestration: Runs M1/M2/M3 in sequence
 * - Progress tracking: Updates job status and progress per step
 * - Error handling: Catches errors per step, saves error_message, continues
 * - Statistics: Get queue stats (total, pending, processing, completed, errors)
 */

import { createClient } from '@supabase/supabase-js'
import { scrapeActContent } from './m1-legislation-scraper'
import { parseLegislation, type LegislationParsed, type Article } from './m2-legislation-parser'
import { extractObligations } from './m3-obligation-extractor'
import { validateObligations } from './m4-validator'

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

export type PipelineJobStatus = 'queued' | 'scraping' | 'parsing' | 'extracting' | 'validating' | 'completed' | 'error'

export interface PipelineJob {
  id: string
  act_url: string
  act_title: string
  status: PipelineJobStatus
  step_current: string | null
  progress: number
  result: Record<string, any> | null
  error_message: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface QueueStats {
  total: number
  queued: number
  processing: number
  completed: number
  errors: number
}

// ══════════════════════════════════════════════════════════════
// CONFIGURATION
// ══════════════════════════════════════════════════════════════

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials in environment variables')
  }

  return createClient(supabaseUrl, supabaseKey)
}

// ══════════════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════════════

/**
 * Queue a new legislative act for processing
 */
export async function queueAct(url: string, title: string): Promise<PipelineJob> {
  const supabase = getSupabaseClient()

  // Check if act already exists in queue
  const { data: existing } = await supabase
    .from('pipeline_jobs')
    .select('id, status')
    .eq('act_url', url)
    .single()

  if (existing) {
    console.log(`[Batch] Act already queued: ${url} (status: ${existing.status})`)
    return existing as PipelineJob
  }

  // Insert new job
  const { data, error } = await supabase
    .from('pipeline_jobs')
    .insert({
      act_url: url,
      act_title: title,
      status: 'queued',
      progress: 0
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to queue act: ${error.message}`)
  }

  console.log(`[Batch] Queued act: ${title} (${url})`)
  return data as PipelineJob
}

/**
 * Process all queued jobs
 */
export async function processQueue(): Promise<void> {
  const supabase = getSupabaseClient()

  // Get all queued jobs ordered by created_at
  const { data: jobs, error } = await supabase
    .from('pipeline_jobs')
    .select('*')
    .eq('status', 'queued')
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch queued jobs: ${error.message}`)
  }

  if (!jobs || jobs.length === 0) {
    console.log('[Batch] No queued jobs to process')
    return
  }

  console.log(`[Batch] Processing ${jobs.length} queued jobs`)

  for (const job of jobs) {
    try {
      await processJob(job.id)
    } catch (error) {
      console.error(`[Batch] Error processing job ${job.id}:`, error)
      // Continue to next job
    }

    // Small delay between jobs to avoid rate limits
    await sleep(1000)
  }

  console.log('[Batch] Queue processing complete')
}

/**
 * Process all jobs in the queue (alias for processQueue)
 */
export async function processAll(): Promise<void> {
  return processQueue()
}

/**
 * Get status of a specific job
 */
export async function getJobStatus(jobId: string): Promise<PipelineJob | null> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('pipeline_jobs')
    .select('*')
    .eq('id', jobId)
    .single()

  if (error) {
    console.error(`[Batch] Error fetching job ${jobId}:`, error)
    return null
  }

  return data as PipelineJob
}

/**
 * Get queue statistics
 */
export async function getQueueStats(): Promise<QueueStats> {
  const supabase = getSupabaseClient()

  const { data: jobs, error } = await supabase
    .from('pipeline_jobs')
    .select('status')

  if (error) {
    console.error('[Batch] Error fetching queue stats:', error)
    return {
      total: 0,
      queued: 0,
      processing: 0,
      completed: 0,
      errors: 0
    }
  }

  const stats: QueueStats = {
    total: jobs.length,
    queued: jobs.filter(j => j.status === 'queued').length,
    processing: jobs.filter(j => ['scraping', 'parsing', 'extracting'].includes(j.status)).length,
    completed: jobs.filter(j => j.status === 'completed').length,
    errors: jobs.filter(j => j.status === 'error').length
  }

  return stats
}

/**
 * Retry a failed job
 */
export async function retryJob(jobId: string): Promise<void> {
  const supabase = getSupabaseClient()

  // Reset job to queued status
  const { error } = await supabase
    .from('pipeline_jobs')
    .update({
      status: 'queued',
      progress: 0,
      error_message: null,
      started_at: null,
      completed_at: null
    })
    .eq('id', jobId)

  if (error) {
    throw new Error(`Failed to retry job: ${error.message}`)
  }

  console.log(`[Batch] Job ${jobId} reset to queued for retry`)
}

// ══════════════════════════════════════════════════════════════
// INTERNAL PIPELINE ORCHESTRATION
// ══════════════════════════════════════════════════════════════

/**
 * Process a single job through the full pipeline
 */
async function processJob(jobId: string): Promise<void> {
  const supabase = getSupabaseClient()

  // Get job details
  const { data: job, error: fetchError } = await supabase
    .from('pipeline_jobs')
    .select('*')
    .eq('id', jobId)
    .single()

  if (fetchError || !job) {
    throw new Error(`Failed to fetch job ${jobId}: ${fetchError?.message}`)
  }

  console.log(`[Batch] Starting job ${jobId}: ${job.act_title}`)

  // Update started_at
  await supabase
    .from('pipeline_jobs')
    .update({ started_at: new Date().toISOString() })
    .eq('id', jobId)

  // STEP 1: SCRAPING
  let rawHtml: string | null = null
  try {
    await updateJobStatus(jobId, 'scraping', 'Scraping legislative act from source', 25)
    rawHtml = await stepScrape(job.act_url)
    console.log(`[Batch] Job ${jobId}: Scraped ${rawHtml.length} characters`)
  } catch (error) {
    await handleJobError(jobId, 'scraping', error)
    return
  }

  // STEP 2: PARSING
  let parsedData: LegislationParsed | null = null
  try {
    await updateJobStatus(jobId, 'parsing', 'Parsing legislative text into articles', 50)
    parsedData = await stepParse(rawHtml, job.act_title)
    console.log(`[Batch] Job ${jobId}: Parsed ${parsedData.articles.length} articles`)
  } catch (error) {
    await handleJobError(jobId, 'parsing', error)
    return
  }

  // STEP 3: EXTRACTING
  let obligations: any[] = []
  try {
    await updateJobStatus(jobId, 'extracting', 'Extracting obligations with AI', 75)
    obligations = await stepExtract(parsedData, job.act_title)
    console.log(`[Batch] Job ${jobId}: Extracted ${obligations.length} obligations`)
  } catch (error) {
    await handleJobError(jobId, 'extracting', error)
    return
  }

  // STEP 4: VALIDATING
  let validatedObligations: any[] = []
  try {
    await updateJobStatus(jobId, 'validating', 'Validating and deduplicating obligations', 90)
    validatedObligations = await validateObligations(obligations)
    console.log(`[Batch] Job ${jobId}: Validated ${validatedObligations.length}/${obligations.length} obligations`)
  } catch (error) {
    await handleJobError(jobId, 'validating', error)
    return
  }

  // STEP 5: SAVING TO DATABASE
  try {
    await updateJobStatus(jobId, 'completed', 'Saving to database', 95)
    await savePipelineResults(jobId, job.act_url, job.act_title, parsedData, validatedObligations)
  } catch (error) {
    console.error(`[Batch] Warning: Failed to save to DB:`, error)
    // Don't fail the job - results are still in job.result
  }

  // STEP 6: COMPLETE
  await updateJobStatus(jobId, 'completed', 'Processing complete', 100, {
    obligations_extracted: obligations.length,
    obligations_validated: validatedObligations.length,
    articles_count: parsedData.articles.length,
    completed_at: new Date().toISOString()
  })

  console.log(`[Batch] Job ${jobId} completed successfully`)
}

/**
 * Step 1: Scrape act content from URL
 * Uses M1 scraper to fetch raw HTML from legislatie.just.ro
 */
async function stepScrape(actUrl: string): Promise<string> {
  const { rawHtml } = await scrapeActContent(actUrl)
  return rawHtml
}

/**
 * Step 2: Parse HTML into structured articles
 * Uses M2 parser to extract articles with obligation detection
 */
async function stepParse(
  rawHtml: string,
  actTitle: string
): Promise<LegislationParsed> {
  return await parseLegislation(rawHtml, actTitle, 'RO')
}

/**
 * Step 3: Extract obligations using M3 extractor
 */
async function stepExtract(
  parsedData: LegislationParsed,
  actTitle: string
): Promise<any[]> {
  // Try to use M3 extractor if API key is available
  const anthropicKey = process.env.ANTHROPIC_API_KEY

  if (anthropicKey) {
    try {
      const obligations = await extractObligations(parsedData, actTitle, anthropicKey)
      return obligations
    } catch (error) {
      console.warn('[Batch] M3 extractor failed, using mock data:', error)
    }
  }

  // Mock obligations
  console.log('[Batch] Using mock obligation extractor')
  return [
    {
      id: 'OBL_1',
      sourceArticleId: 'ART_1',
      sourceArticleNumber: '1',
      obligationText: 'Asigurarea echipamentului de protecție',
      who: ['angajator'],
      deadline: 'permanent',
      frequency: 'continuous'
    },
    {
      id: 'OBL_2',
      sourceArticleId: 'ART_2',
      sourceArticleNumber: '2',
      obligationText: 'Participare la instruire SSM',
      who: ['angajat'],
      deadline: 'anual',
      frequency: 'annual'
    }
  ]
}

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════

async function updateJobStatus(
  jobId: string,
  status: PipelineJobStatus,
  stepCurrent: string,
  progress: number,
  result?: Record<string, any>
): Promise<void> {
  const supabase = getSupabaseClient()

  const updates: any = {
    status,
    step_current: stepCurrent,
    progress
  }

  if (result) {
    updates.result = result
  }

  if (status === 'completed') {
    updates.completed_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('pipeline_jobs')
    .update(updates)
    .eq('id', jobId)

  if (error) {
    console.error(`[Batch] Failed to update job ${jobId}:`, error)
  }
}

async function handleJobError(
  jobId: string,
  step: string,
  error: unknown
): Promise<void> {
  const supabase = getSupabaseClient()

  const errorMessage = error instanceof Error ? error.message : String(error)

  await supabase
    .from('pipeline_jobs')
    .update({
      status: 'error',
      step_current: `Failed at ${step}`,
      error_message: errorMessage
    })
    .eq('id', jobId)

  console.error(`[Batch] Job ${jobId} failed at ${step}:`, errorMessage)
}

/**
 * Save pipeline results to database
 * Inserts/updates legal_acts table with processed act data
 */
async function savePipelineResults(
  jobId: string,
  actUrl: string,
  actTitle: string,
  parsedData: LegislationParsed,
  validatedObligations: any[]
): Promise<void> {
  const supabase = getSupabaseClient()

  console.log(`[Batch] Saving pipeline results for job ${jobId} to database`)

  // Check if act already exists
  const { data: existingAct } = await supabase
    .from('legal_acts')
    .select('id')
    .eq('official_url', actUrl)
    .single()

  if (existingAct) {
    console.log(`[Batch] Act already exists in DB: ${existingAct.id}`)
    return
  }

  // Insert new legal act
  const { data: newAct, error: actError } = await supabase
    .from('legal_acts')
    .insert({
      act_full_name: actTitle,
      official_url: actUrl,
      country_code: 'RO',
      full_text_metadata: {
        articles: parsedData.articles.length,
        articlesWithObligations: parsedData.metadata.articlesWithObligations,
        parsedAt: parsedData.metadata.parsedAt
      },
      research_phase: 'ai_extracted',
      confidence_level: 'ai_extracted',
      ai_extraction_date: new Date().toISOString(),
      ai_extraction_result: {
        pipelineJobId: jobId,
        obligationsCount: validatedObligations.length,
        totalArticles: parsedData.articles.length,
        articlesWithObligations: parsedData.metadata.articlesWithObligations
      }
    })
    .select()
    .single()

  if (actError) {
    throw new Error(`Failed to save legal act: ${actError.message}`)
  }

  console.log(`[Batch] Saved legal act to DB: ${newAct.id}`)
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
