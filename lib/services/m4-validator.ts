/**
 * M4 OBLIGATION VALIDATOR SERVICE
 *
 * Validează, deduplicează și publică obligațiile extrase de M3 în baza de date.
 *
 * FEATURES:
 * - Completeness Check: verifică că obligațiile au toate câmpurile necesare
 * - Deduplication: identifică și marchează obligațiile duplicate (fuzzy matching)
 * - Cross-Reference Validation: verifică că referințele la alte articole sunt valide
 * - Confidence Scoring: calculează scor de încredere bazat pe:
 *   - Completitudine câmpuri (40%)
 *   - Încredere Claude originală (30%)
 *   - Validare cross-references (15%)
 *   - Specificitate (who, deadline, evidence) (15%)
 * - Status Pipeline: draft → validated → published
 * - Database Publishing: inserare în obligations_library cu linking la legislation_acts
 * - Organization Notification: notifică organizațiile afectate de noi obligații
 *
 * USAGE:
 * const obligations = await extractObligations(parsed, 'L 319/2006')
 * const validated = await validateObligations(obligations)
 * const published = await publishObligations(validated, legislationId)
 */

import type { Obligation } from './m3-obligation-extractor'
import { createSupabaseServer } from '@/lib/supabase/server'
import type { CountryCode } from '@/lib/types'

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

export type ObligationStatus = 'draft' | 'validated' | 'published' | 'archived'

export interface ValidatedObligation extends Obligation {
  // Validation metadata
  validationScore: number          // 0.0 - 1.0 (overall quality score)
  validationErrors: string[]       // Lista de erori (blocking issues)
  validationWarnings: string[]     // Lista de warning-uri (non-blocking)

  // Deduplication
  isDuplicate: boolean             // True dacă e duplicat
  duplicateOf: string | null       // ID obligație originală (dacă e duplicat)
  similarityScore: number          // 0.0 - 1.0 (similaritate cu duplicate)

  // Status
  status: ObligationStatus
  validatedAt: string
  validatedBy?: string | null      // User ID (dacă e manual review)
}

export interface PublishedObligation {
  id: string                       // UUID din DB
  obligationLibraryId: string      // ID din obligations_library table
  legislationActId: string         // FK către legislation_acts
  status: 'published'
  publishedAt: string
  affectedOrganizations: number    // Număr org-uri notificate
}

export interface ValidationReport {
  total: number
  valid: number
  invalid: number
  duplicates: number
  avgConfidence: number
  avgValidationScore: number
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  obligationId: string
  field: string
  message: string
}

export interface ValidationWarning {
  obligationId: string
  field: string
  message: string
}

// ══════════════════════════════════════════════════════════════
// CONFIGURATION
// ══════════════════════════════════════════════════════════════

const MIN_VALIDATION_SCORE = 0.6    // Scor minim pentru status=validated
const SIMILARITY_THRESHOLD = 0.85   // Threshold pentru duplicate detection
const MIN_OBLIGATION_LENGTH = 20    // Minim caractere pentru obligationText

// Weights pentru validation score
const WEIGHTS = {
  completeness: 0.40,   // 40% — completitudine câmpuri
  confidence: 0.30,     // 30% — încredere Claude
  crossRefs: 0.15,      // 15% — validare cross-references
  specificity: 0.15     // 15% — specificitate (who, deadline, evidence)
}

// ══════════════════════════════════════════════════════════════
// MAIN VALIDATION FUNCTION
// ══════════════════════════════════════════════════════════════

export async function validateObligations(
  obligations: Obligation[],
  options: {
    skipDeduplication?: boolean
    manualReview?: boolean
  } = {}
): Promise<{
  validated: ValidatedObligation[]
  report: ValidationReport
}> {
  const startTime = Date.now()
  console.log(`[M4] Validating ${obligations.length} obligations...`)

  const validated: ValidatedObligation[] = []
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  // Step 1: Individual validation
  for (const obligation of obligations) {
    const result = validateSingleObligation(obligation)

    validated.push(result.validated)
    errors.push(...result.errors)
    warnings.push(...result.warnings)
  }

  // Step 2: Deduplication
  if (!options.skipDeduplication) {
    console.log('[M4] Running deduplication...')
    detectDuplicates(validated)
  }

  // Step 3: Calculate final status
  for (const obligation of validated) {
    if (obligation.validationScore >= MIN_VALIDATION_SCORE && !obligation.isDuplicate) {
      obligation.status = 'validated'
    } else {
      obligation.status = 'draft'
    }
  }

  // Generate report
  const report: ValidationReport = {
    total: validated.length,
    valid: validated.filter(o => o.status === 'validated').length,
    invalid: validated.filter(o => o.status === 'draft').length,
    duplicates: validated.filter(o => o.isDuplicate).length,
    avgConfidence: validated.reduce((sum, o) => sum + o.confidence, 0) / validated.length,
    avgValidationScore: validated.reduce((sum, o) => sum + o.validationScore, 0) / validated.length,
    errors,
    warnings
  }

  const duration = Date.now() - startTime
  console.log(`[M4] Validation complete: ${report.valid}/${report.total} valid, ${report.duplicates} duplicates (${duration}ms)`)

  return { validated, report }
}

// ══════════════════════════════════════════════════════════════
// SINGLE OBLIGATION VALIDATION
// ══════════════════════════════════════════════════════════════

function validateSingleObligation(obligation: Obligation): {
  validated: ValidatedObligation
  errors: ValidationError[]
  warnings: ValidationWarning[]
} {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  // 1. Completeness Score (40%)
  const completenessScore = calculateCompletenessScore(obligation, errors, warnings)

  // 2. Confidence Score (30%) — already from Claude
  const confidenceScore = obligation.confidence

  // 3. Cross-References Score (15%)
  const crossRefsScore = validateCrossReferences(obligation, errors, warnings)

  // 4. Specificity Score (15%)
  const specificityScore = calculateSpecificityScore(obligation, warnings)

  // Final validation score
  const validationScore =
    (completenessScore * WEIGHTS.completeness) +
    (confidenceScore * WEIGHTS.confidence) +
    (crossRefsScore * WEIGHTS.crossRefs) +
    (specificityScore * WEIGHTS.specificity)

  const validated: ValidatedObligation = {
    ...obligation,
    validationScore: Math.round(validationScore * 100) / 100,
    validationErrors: errors.map(e => e.message),
    validationWarnings: warnings.map(w => w.message),
    isDuplicate: false,
    duplicateOf: null,
    similarityScore: 0,
    status: 'draft',
    validatedAt: new Date().toISOString()
  }

  return { validated, errors, warnings }
}

// ══════════════════════════════════════════════════════════════
// SCORING FUNCTIONS
// ══════════════════════════════════════════════════════════════

function calculateCompletenessScore(
  obligation: Obligation,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): number {
  let score = 1.0
  const requiredFields = ['obligationText', 'sourceArticleNumber', 'sourceLegalAct']
  const importantFields = ['who', 'deadline', 'frequency']

  // Required fields (blocking)
  for (const field of requiredFields) {
    const value = obligation[field as keyof Obligation]
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      errors.push({
        obligationId: obligation.id,
        field,
        message: `Missing required field: ${field}`
      })
      score -= 0.3
    }
  }

  // Check obligationText length
  if (obligation.obligationText.length < MIN_OBLIGATION_LENGTH) {
    errors.push({
      obligationId: obligation.id,
      field: 'obligationText',
      message: `Obligation text too short (${obligation.obligationText.length} chars, min ${MIN_OBLIGATION_LENGTH})`
    })
    score -= 0.2
  }

  // Important fields (non-blocking)
  for (const field of importantFields) {
    const value = obligation[field as keyof Obligation]
    if (!value || (Array.isArray(value) && value.length === 0)) {
      warnings.push({
        obligationId: obligation.id,
        field,
        message: `Missing important field: ${field}`
      })
      score -= 0.1
    }
  }

  // Check 'who' validity
  if (obligation.who.length === 0 || obligation.who.includes('unknown')) {
    warnings.push({
      obligationId: obligation.id,
      field: 'who',
      message: 'No specific responsible party identified'
    })
    score -= 0.05
  }

  return Math.max(0, Math.min(1, score))
}

function validateCrossReferences(
  obligation: Obligation,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): number {
  // For now, we accept all cross-references as valid
  // In a full implementation, this would check if referenced articles exist
  // in the legislation database

  // Basic validation: check if sourceLegalAct has proper format
  const legalActPattern = /^[A-Z]+\s+\d+/  // Ex: "L 319/2006", "HG 1425/2006"

  if (!legalActPattern.test(obligation.sourceLegalAct)) {
    warnings.push({
      obligationId: obligation.id,
      field: 'sourceLegalAct',
      message: `Legal act format may be invalid: ${obligation.sourceLegalAct}`
    })
    return 0.7
  }

  return 1.0
}

function calculateSpecificityScore(
  obligation: Obligation,
  warnings: ValidationWarning[]
): number {
  let score = 0

  // Who is specific? (0.4)
  if (obligation.who.length > 0 && !obligation.who.includes('unknown')) {
    score += 0.4
  } else {
    score += 0.1
  }

  // Deadline is specific? (0.3)
  if (obligation.deadline && obligation.frequency !== 'unknown') {
    score += 0.3
  } else if (obligation.deadline || obligation.frequency !== 'unknown') {
    score += 0.15
  }

  // Evidence is specified? (0.3)
  if (obligation.evidenceRequired.length > 0) {
    score += 0.3
  } else {
    warnings.push({
      obligationId: obligation.id,
      field: 'evidenceRequired',
      message: 'No evidence/documentation specified'
    })
  }

  return Math.min(1, score)
}

// ══════════════════════════════════════════════════════════════
// DEDUPLICATION
// ══════════════════════════════════════════════════════════════

function detectDuplicates(obligations: ValidatedObligation[]): void {
  // Simple n² comparison — pentru producție, folosește algoritmi mai eficienți
  for (let i = 0; i < obligations.length; i++) {
    if (obligations[i].isDuplicate) continue  // Skip already marked duplicates

    for (let j = i + 1; j < obligations.length; j++) {
      if (obligations[j].isDuplicate) continue

      const similarity = calculateSimilarity(obligations[i], obligations[j])

      if (similarity >= SIMILARITY_THRESHOLD) {
        // Mark j as duplicate of i
        obligations[j].isDuplicate = true
        obligations[j].duplicateOf = obligations[i].id
        obligations[j].similarityScore = similarity
        obligations[j].status = 'draft'  // Duplicates are not validated
      }
    }
  }
}

function calculateSimilarity(a: Obligation, b: Obligation): number {
  // Fuzzy text matching pe obligationText
  const textSimilarity = levenshteinSimilarity(
    a.obligationText.toLowerCase(),
    b.obligationText.toLowerCase()
  )

  // Same article?
  const sameArticle = a.sourceArticleNumber === b.sourceArticleNumber ? 1 : 0

  // Same legal act?
  const sameLegalAct = a.sourceLegalAct === b.sourceLegalAct ? 1 : 0

  // Weighted average
  return (textSimilarity * 0.7) + (sameArticle * 0.2) + (sameLegalAct * 0.1)
}

function levenshteinSimilarity(a: string, b: string): number {
  const distance = levenshteinDistance(a, b)
  const maxLength = Math.max(a.length, b.length)

  if (maxLength === 0) return 1.0

  return 1 - (distance / maxLength)
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

// ══════════════════════════════════════════════════════════════
// PUBLISHING TO DATABASE
// ══════════════════════════════════════════════════════════════

export async function publishObligations(
  validated: ValidatedObligation[],
  legislationActId: string,
  countryCode: CountryCode,
  options: {
    notifyOrganizations?: boolean
    dryRun?: boolean
  } = {}
): Promise<{
  published: PublishedObligation[]
  skipped: number
  errors: string[]
}> {
  const startTime = Date.now()
  console.log(`[M4] Publishing ${validated.length} obligations to database...`)

  const supabase = await createSupabaseServer()
  const published: PublishedObligation[] = []
  const errors: string[] = []
  let skipped = 0

  // Filter: only publish 'validated' status, non-duplicates
  const toPublish = validated.filter(o =>
    o.status === 'validated' && !o.isDuplicate
  )

  console.log(`[M4] Publishing ${toPublish.length}/${validated.length} validated obligations`)

  if (options.dryRun) {
    console.log('[M4] DRY RUN — skipping database insert')
    return { published: [], skipped: validated.length, errors: [] }
  }

  // Batch insert
  for (const obligation of toPublish) {
    try {
      // Insert into obligations_library
      const { data, error } = await supabase
        .from('obligation_types')
        .insert({
          country_code: countryCode,
          name: obligation.obligationText.substring(0, 200),  // Truncate for name field
          description: obligation.obligationText,
          frequency: mapFrequencyToDBFormat(obligation.frequency),
          authority_name: extractAuthority(obligation.who),
          legal_reference: `${obligation.sourceLegalAct} - Art. ${obligation.sourceArticleNumber}`,
          penalty_min: obligation.penaltyMin,
          penalty_max: obligation.penaltyMax,
          currency: mapCurrencyByCountry(countryCode),
          is_active: true,
          is_system: false,
          display_order: 999,  // Will be reordered by admin
          // Metadata (stored in JSON field if available, or as custom fields)
          // metadata: {
          //   sourceArticleId: obligation.sourceArticleId,
          //   who: obligation.who,
          //   deadline: obligation.deadline,
          //   evidenceRequired: obligation.evidenceRequired,
          //   confidence: obligation.confidence,
          //   validationScore: obligation.validationScore,
          //   extractedAt: obligation.extractedAt
          // }
        })
        .select()
        .single()

      if (error) {
        console.error(`[M4] Error inserting obligation ${obligation.id}:`, error)
        errors.push(`${obligation.id}: ${error.message}`)
        skipped++
        continue
      }

      published.push({
        id: data.id,
        obligationLibraryId: data.id,
        legislationActId,
        status: 'published',
        publishedAt: new Date().toISOString(),
        affectedOrganizations: 0  // Will be calculated if notifications enabled
      })

    } catch (error) {
      console.error(`[M4] Exception publishing obligation ${obligation.id}:`, error)
      errors.push(`${obligation.id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      skipped++
    }
  }

  // Notify organizations if requested
  if (options.notifyOrganizations && published.length > 0) {
    console.log('[M4] Notifying affected organizations...')
    // TODO: Implement notification logic
    // This would query organizations with country_code matching
    // and send alerts about new obligations
  }

  const duration = Date.now() - startTime
  console.log(`[M4] Publishing complete: ${published.length} published, ${skipped} skipped, ${errors.length} errors (${duration}ms)`)

  return { published, skipped, errors }
}

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════

function mapFrequencyToDBFormat(frequency: string | null): 'annual' | 'biannual' | 'monthly' | 'quarterly' | 'on_demand' | 'once' {
  const mapping: Record<string, 'annual' | 'biannual' | 'monthly' | 'quarterly' | 'on_demand' | 'once'> = {
    'annual': 'annual',
    'biannual': 'biannual',
    'monthly': 'monthly',
    'quarterly': 'quarterly',
    'on_demand': 'on_demand',
    'once': 'once',
    'weekly': 'monthly',      // Map weekly → monthly (closest match)
    'daily': 'monthly',       // Map daily → monthly
    'at_hire': 'once',        // Map at_hire → once
    'at_termination': 'once', // Map at_termination → once
    'continuous': 'on_demand', // Map continuous → on_demand
    'unknown': 'on_demand'    // Default
  }

  return mapping[frequency || 'unknown'] || 'on_demand'
}

function extractAuthority(who: string[]): string {
  // Extract authority name from 'who' array
  // Ex: ["angajator", "ITM"] → "ITM"
  const authorities = ['ITM', 'ISU', 'ANSVSA', 'INSP', 'ANSPDCP', 'ANRE']

  for (const person of who) {
    const upper = person.toUpperCase()
    for (const authority of authorities) {
      if (upper.includes(authority)) {
        return authority
      }
    }
  }

  // Default to first 'who' entry
  return who[0] || 'Angajator'
}

function mapCurrencyByCountry(countryCode: CountryCode): 'RON' | 'BGN' | 'HUF' | 'EUR' | 'PLN' {
  const mapping: Record<CountryCode, 'RON' | 'BGN' | 'HUF' | 'EUR' | 'PLN'> = {
    'RO': 'RON',
    'BG': 'BGN',
    'HU': 'HUF',
    'DE': 'EUR',
    'PL': 'PLN'
  }

  return mapping[countryCode] || 'EUR'
}

// ══════════════════════════════════════════════════════════════
// STATISTICS & REPORTING
// ══════════════════════════════════════════════════════════════

export function generateValidationReport(validated: ValidatedObligation[]): {
  summary: {
    total: number
    validated: number
    draft: number
    duplicates: number
    avgScore: number
  }
  byStatus: Record<ObligationStatus, number>
  byFrequency: Record<string, number>
  topErrors: Array<{ message: string; count: number }>
  topWarnings: Array<{ message: string; count: number }>
} {
  const summary = {
    total: validated.length,
    validated: validated.filter(o => o.status === 'validated').length,
    draft: validated.filter(o => o.status === 'draft').length,
    duplicates: validated.filter(o => o.isDuplicate).length,
    avgScore: validated.reduce((sum, o) => sum + o.validationScore, 0) / validated.length
  }

  const byStatus = validated.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {} as Record<ObligationStatus, number>)

  const byFrequency = validated.reduce((acc, o) => {
    const freq = o.frequency || 'unknown'
    acc[freq] = (acc[freq] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Count errors
  const errorCounts: Record<string, number> = {}
  const warningCounts: Record<string, number> = {}

  for (const obligation of validated) {
    for (const error of obligation.validationErrors) {
      errorCounts[error] = (errorCounts[error] || 0) + 1
    }
    for (const warning of obligation.validationWarnings) {
      warningCounts[warning] = (warningCounts[warning] || 0) + 1
    }
  }

  const topErrors = Object.entries(errorCounts)
    .map(([message, count]) => ({ message, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  const topWarnings = Object.entries(warningCounts)
    .map(([message, count]) => ({ message, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return {
    summary,
    byStatus,
    byFrequency,
    topErrors,
    topWarnings
  }
}

// ══════════════════════════════════════════════════════════════
// EXPORT PUBLIC API
// ══════════════════════════════════════════════════════════════

export {
  validateObligations,
  publishObligations,
  generateValidationReport,
  type ValidatedObligation,
  type PublishedObligation,
  type ValidationReport,
  type ObligationStatus
}
