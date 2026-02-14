/**
 * LEGISLATION PIPELINE TESTS
 *
 * Comprehensive test suite for legislation-pipeline.ts service
 * Covers M1-M4 stages, full pipeline execution, error handling, and edge cases
 *
 * TEST COVERAGE:
 * 1. M1 scraper returns entries
 * 2. M2 parser splits articles
 * 3. M3 extractor returns obligations
 * 4. M4 validator checks completeness
 * 5. Full pipeline runs end to end
 * 6. Handles empty input
 * 7. Handles malformed text
 * 8. Pipeline supports stopAtStage
 * 9. Pipeline tracks progress
 * 10. Batch pipeline processes multiple countries
 */

import {
  runPipeline,
  runBatchPipeline,
  type PipelineResult,
  type PipelineOptions,
  type PipelineProgressUpdate
} from '@/lib/services/legislation-pipeline'
import type { CountryCode } from '@/lib/types'

// ══════════════════════════════════════════════════════════════
// MOCKS
// ══════════════════════════════════════════════════════════════

// Mock M1 Scraper
jest.mock('@/lib/services/m1-legislation-scraper', () => ({
  scrapeLegislatie: jest.fn()
}))

// Mock M2 Parser
jest.mock('@/lib/services/m2-legislation-parser', () => ({
  parseLegislation: jest.fn(),
  getArticlesWithObligations: jest.fn()
}))

// Mock M3 Extractor (including Claude API)
jest.mock('@/lib/services/m3-obligation-extractor', () => ({
  extractObligations: jest.fn()
}))

// Mock M4 Validator
jest.mock('@/lib/services/m4-validator', () => ({
  validateObligations: jest.fn(),
  publishObligations: jest.fn(),
  generateValidationReport: jest.fn()
}))

// Mock fetch for Claude API
global.fetch = jest.fn()

import { scrapeLegislatie } from '@/lib/services/m1-legislation-scraper'
import { parseLegislation } from '@/lib/services/m2-legislation-parser'
import { extractObligations } from '@/lib/services/m3-obligation-extractor'
import {
  validateObligations,
  publishObligations,
  generateValidationReport
} from '@/lib/services/m4-validator'

// ══════════════════════════════════════════════════════════════
// TEST DATA FACTORIES
// ══════════════════════════════════════════════════════════════

function createMockLegislationEntry(overrides: any = {}) {
  return {
    title: 'Legea nr. 319 din 2006 privind securitatea și sănătatea în muncă',
    link: 'https://legislatie.just.ro/Public/DetaliiDocument/73850',
    pubDate: '2024-01-15T10:00:00Z',
    domain: 'SSM',
    countryCode: 'RO',
    ...overrides
  }
}

function createMockParsedLegislation() {
  return {
    articles: [
      {
        articleNumber: '1',
        content: 'Art. 1. Angajatorul trebuie să asigure evaluarea riscurilor.',
        hasObligations: true,
        obligationKeywords: ['trebuie'],
        isPenaltySection: false,
        references: []
      },
      {
        articleNumber: '2',
        content: 'Art. 2. Angajatul are obligația să respecte normele de securitate.',
        hasObligations: true,
        obligationKeywords: ['obligația'],
        isPenaltySection: false,
        references: []
      }
    ],
    sections: [],
    allReferences: [],
    totalObligations: 2,
    totalPenalties: 0
  }
}

function createMockObligation(overrides: any = {}) {
  return {
    source_legal_act: 'L 319/2006',
    source_article_number: '1',
    country_code: 'RO',
    obligation_text: 'Angajatorul trebuie să asigure evaluarea riscurilor',
    who: ['angajator'],
    deadline: '30 zile',
    frequency: 'annual',
    penalty: 'Amendă 5000-10000 RON',
    penalty_min: 5000,
    penalty_max: 10000,
    penalty_currency: 'RON',
    evidence_required: ['Document de evaluare a riscurilor'],
    confidence: 0.85,
    validation_score: 0,
    status: 'draft',
    published: false,
    caen_codes: [],
    industry_tags: [],
    extracted_at: new Date().toISOString(),
    language: 'ro',
    metadata: {},
    ...overrides
  }
}

function createMockValidatedObligation(obligation: any) {
  return {
    ...obligation,
    status: 'validated',
    validation_score: 0.9,
    validation_issues: [],
    deduplication_hash: 'hash_123',
    similar_obligations: []
  }
}

// ══════════════════════════════════════════════════════════════
// TESTS
// ══════════════════════════════════════════════════════════════

describe('Legislation Pipeline', () => {
  // Silence console logs during tests
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ──────────────────────────────────────────────────────────
  // TEST 1: M1 Scraper returns entries
  // ──────────────────────────────────────────────────────────

  test('M1 scraper successfully returns legislation entries', async () => {
    // Arrange
    const mockEntries = [
      createMockLegislationEntry(),
      createMockLegislationEntry({ domain: 'PSI' })
    ]

    const mockedScraper = scrapeLegislatie as jest.MockedFunction<typeof scrapeLegislatie>
    mockedScraper.mockResolvedValue(mockEntries)

    const mockedExtractor = extractObligations as jest.MockedFunction<typeof extractObligations>
    mockedExtractor.mockResolvedValue([createMockObligation()])

    const mockedValidator = validateObligations as jest.MockedFunction<typeof validateObligations>
    mockedValidator.mockResolvedValue([createMockValidatedObligation(createMockObligation())])

    const mockedPublisher = publishObligations as jest.MockedFunction<typeof publishObligations>
    mockedPublisher.mockResolvedValue({
      success: true,
      publishedCount: 1,
      failedCount: 0,
      publishedIds: ['OBL_1'],
      errors: [],
      notifiedOrganizations: 0
    })

    const mockedReportGenerator = generateValidationReport as jest.MockedFunction<typeof generateValidationReport>
    mockedReportGenerator.mockReturnValue({
      totalObligations: 1,
      validObligations: 1,
      invalidObligations: 0,
      duplicatesRemoved: 0,
      avgConfidenceScore: 0.85,
      avgValidationScore: 0.9,
      issuesByType: {}
    })

    // Act
    const result = await runPipeline('RO', 'legislatie.just.ro', {
      verbose: false
    })

    // Assert
    expect(mockedScraper).toHaveBeenCalledWith('RO', {
      sinceDays: undefined,
      maxEntries: undefined,
      filterDomains: undefined
    })
    expect(result.stages.M1.success).toBe(true)
    expect(result.stages.M1.data).toHaveLength(2)
    expect(result.summary.entriesScraped).toBe(2)
  })

  // ──────────────────────────────────────────────────────────
  // TEST 2: M2 Parser splits articles
  // ──────────────────────────────────────────────────────────

  test('M2 parser splits legislation text into structured articles', async () => {
    // Arrange
    const mockEntries = [createMockLegislationEntry()]
    const mockParsed = createMockParsedLegislation()

    const mockedScraper = scrapeLegislatie as jest.MockedFunction<typeof scrapeLegislatie>
    mockedScraper.mockResolvedValue(mockEntries)

    const mockedParser = parseLegislation as jest.MockedFunction<typeof parseLegislation>
    mockedParser.mockReturnValue(mockParsed)

    const mockedExtractor = extractObligations as jest.MockedFunction<typeof extractObligations>
    mockedExtractor.mockResolvedValue([createMockObligation()])

    const mockedValidator = validateObligations as jest.MockedFunction<typeof validateObligations>
    mockedValidator.mockResolvedValue([createMockValidatedObligation(createMockObligation())])

    const mockedPublisher = publishObligations as jest.MockedFunction<typeof publishObligations>
    mockedPublisher.mockResolvedValue({
      success: true,
      publishedCount: 1,
      failedCount: 0,
      publishedIds: ['OBL_1'],
      errors: [],
      notifiedOrganizations: 0
    })

    const mockedReportGenerator = generateValidationReport as jest.MockedFunction<typeof generateValidationReport>
    mockedReportGenerator.mockReturnValue({
      totalObligations: 1,
      validObligations: 1,
      invalidObligations: 0,
      duplicatesRemoved: 0,
      avgConfidenceScore: 0.85,
      avgValidationScore: 0.9,
      issuesByType: {}
    })

    // Act
    const result = await runPipeline('RO', 'legislatie.just.ro', {
      verbose: false
    })

    // Assert
    expect(result.stages.M2.success).toBe(true)
    expect(result.stages.M2.data).toHaveLength(1)
    expect(result.summary.documentsParsed).toBe(1)

    // Verify M2 created articles
    const parsed = result.stages.M2.data![0]
    expect(parsed.structure.articles).toBeDefined()
    expect(parsed.structure.articles.length).toBeGreaterThan(0)
  })

  // ──────────────────────────────────────────────────────────
  // TEST 3: M3 Extractor returns obligations
  // ──────────────────────────────────────────────────────────

  test('M3 extractor successfully extracts obligations using Claude API', async () => {
    // Arrange
    const mockEntries = [createMockLegislationEntry()]
    const mockObligations = [
      createMockObligation({ obligation_text: 'First obligation' }),
      createMockObligation({ obligation_text: 'Second obligation' })
    ]

    const mockedScraper = scrapeLegislatie as jest.MockedFunction<typeof scrapeLegislatie>
    mockedScraper.mockResolvedValue(mockEntries)

    const mockedExtractor = extractObligations as jest.MockedFunction<typeof extractObligations>
    mockedExtractor.mockResolvedValue(mockObligations)

    const mockedValidator = validateObligations as jest.MockedFunction<typeof validateObligations>
    mockedValidator.mockResolvedValue(mockObligations.map(createMockValidatedObligation))

    const mockedPublisher = publishObligations as jest.MockedFunction<typeof publishObligations>
    mockedPublisher.mockResolvedValue({
      success: true,
      publishedCount: 2,
      failedCount: 0,
      publishedIds: ['OBL_1', 'OBL_2'],
      errors: [],
      notifiedOrganizations: 5
    })

    const mockedReportGenerator = generateValidationReport as jest.MockedFunction<typeof generateValidationReport>
    mockedReportGenerator.mockReturnValue({
      totalObligations: 2,
      validObligations: 2,
      invalidObligations: 0,
      duplicatesRemoved: 0,
      avgConfidenceScore: 0.85,
      avgValidationScore: 0.9,
      issuesByType: {}
    })

    // Act
    const result = await runPipeline('RO', 'legislatie.just.ro', {
      verbose: false,
      anthropicApiKey: 'test-api-key'
    })

    // Assert
    expect(mockedExtractor).toHaveBeenCalled()
    expect(result.stages.M3.success).toBe(true)
    expect(result.stages.M3.data).toHaveLength(2)
    expect(result.summary.obligationsExtracted).toBe(2)
  })

  // ──────────────────────────────────────────────────────────
  // TEST 4: M4 Validator checks completeness
  // ──────────────────────────────────────────────────────────

  test('M4 validator checks obligation completeness and assigns validation scores', async () => {
    // Arrange
    const mockEntries = [createMockLegislationEntry()]
    const mockObligation = createMockObligation()
    const mockValidated = createMockValidatedObligation(mockObligation)

    const mockedScraper = scrapeLegislatie as jest.MockedFunction<typeof scrapeLegislatie>
    mockedScraper.mockResolvedValue(mockEntries)

    const mockedExtractor = extractObligations as jest.MockedFunction<typeof extractObligations>
    mockedExtractor.mockResolvedValue([mockObligation])

    const mockedValidator = validateObligations as jest.MockedFunction<typeof validateObligations>
    mockedValidator.mockResolvedValue([mockValidated])

    const mockedPublisher = publishObligations as jest.MockedFunction<typeof publishObligations>
    mockedPublisher.mockResolvedValue({
      success: true,
      publishedCount: 1,
      failedCount: 0,
      publishedIds: ['OBL_1'],
      errors: [],
      notifiedOrganizations: 0
    })

    const mockedReportGenerator = generateValidationReport as jest.MockedFunction<typeof generateValidationReport>
    mockedReportGenerator.mockReturnValue({
      totalObligations: 1,
      validObligations: 1,
      invalidObligations: 0,
      duplicatesRemoved: 0,
      avgConfidenceScore: 0.85,
      avgValidationScore: 0.9,
      issuesByType: {}
    })

    // Act
    const result = await runPipeline('RO', 'legislatie.just.ro', {
      verbose: false
    })

    // Assert
    expect(mockedValidator).toHaveBeenCalledWith([mockObligation])
    expect(result.stages.M4.success).toBe(true)
    expect(result.stages.M4.data?.validated).toHaveLength(1)
    expect(result.stages.M4.data?.validated[0].status).toBe('validated')
    expect(result.stages.M4.data?.validated[0].validation_score).toBe(0.9)
    expect(result.summary.obligationsValidated).toBe(1)
  })

  // ──────────────────────────────────────────────────────────
  // TEST 5: Full pipeline runs end to end
  // ──────────────────────────────────────────────────────────

  test('full pipeline executes all stages (M1→M2→M3→M4) successfully', async () => {
    // Arrange
    const mockEntries = [createMockLegislationEntry()]
    const mockObligations = [createMockObligation()]
    const mockValidated = mockObligations.map(createMockValidatedObligation)

    const mockedScraper = scrapeLegislatie as jest.MockedFunction<typeof scrapeLegislatie>
    mockedScraper.mockResolvedValue(mockEntries)

    const mockedExtractor = extractObligations as jest.MockedFunction<typeof extractObligations>
    mockedExtractor.mockResolvedValue(mockObligations)

    const mockedValidator = validateObligations as jest.MockedFunction<typeof validateObligations>
    mockedValidator.mockResolvedValue(mockValidated)

    const mockedPublisher = publishObligations as jest.MockedFunction<typeof publishObligations>
    mockedPublisher.mockResolvedValue({
      success: true,
      publishedCount: 1,
      failedCount: 0,
      publishedIds: ['OBL_1'],
      errors: [],
      notifiedOrganizations: 3
    })

    const mockedReportGenerator = generateValidationReport as jest.MockedFunction<typeof generateValidationReport>
    mockedReportGenerator.mockReturnValue({
      totalObligations: 1,
      validObligations: 1,
      invalidObligations: 0,
      duplicatesRemoved: 0,
      avgConfidenceScore: 0.85,
      avgValidationScore: 0.9,
      issuesByType: {}
    })

    // Act
    const result = await runPipeline('RO', 'legislatie.just.ro', {
      verbose: false
    })

    // Assert - All stages executed
    expect(result.stages.M1.success).toBe(true)
    expect(result.stages.M2.success).toBe(true)
    expect(result.stages.M3.success).toBe(true)
    expect(result.stages.M4.success).toBe(true)

    // Assert - Pipeline status
    expect(result.status).toBe('completed')
    expect(result.completedAt).toBeTruthy()
    expect(result.totalDuration).toBeGreaterThanOrEqual(0)

    // Assert - Summary
    expect(result.summary.entriesScraped).toBe(1)
    expect(result.summary.documentsParsed).toBe(1)
    expect(result.summary.obligationsExtracted).toBe(1)
    expect(result.summary.obligationsValidated).toBe(1)
    expect(result.summary.obligationsPublished).toBe(1)
    expect(result.summary.errors).toHaveLength(0)

    // Assert - All mocks called
    expect(mockedScraper).toHaveBeenCalledTimes(1)
    expect(mockedExtractor).toHaveBeenCalledTimes(1)
    expect(mockedValidator).toHaveBeenCalledTimes(1)
    expect(mockedPublisher).toHaveBeenCalledTimes(1)
    expect(mockedReportGenerator).toHaveBeenCalledTimes(1)
  })

  // ──────────────────────────────────────────────────────────
  // TEST 6: Pipeline handles empty input
  // ──────────────────────────────────────────────────────────

  test('pipeline handles empty input when M1 returns no entries', async () => {
    // Arrange
    const mockedScraper = scrapeLegislatie as jest.MockedFunction<typeof scrapeLegislatie>
    mockedScraper.mockResolvedValue([])

    // Act
    const result = await runPipeline('RO', 'legislatie.just.ro', {
      verbose: false
    })

    // Assert
    expect(result.stages.M1.success).toBe(true)
    expect(result.stages.M1.data).toHaveLength(0)
    expect(result.status).toBe('failed')
    expect(result.summary.entriesScraped).toBe(0)
    expect(result.summary.errors).toContain('M1 stage failed or returned no data')

    // Assert - Pipeline stopped, subsequent stages not executed
    expect(result.stages.M2.success).toBe(false)
    expect(result.stages.M3.success).toBe(false)
    expect(result.stages.M4.success).toBe(false)
  })

  // ──────────────────────────────────────────────────────────
  // TEST 7: Pipeline handles malformed text
  // ──────────────────────────────────────────────────────────

  test('pipeline handles malformed text when M3 extractor fails', async () => {
    // Arrange
    const mockEntries = [createMockLegislationEntry()]

    const mockedScraper = scrapeLegislatie as jest.MockedFunction<typeof scrapeLegislatie>
    mockedScraper.mockResolvedValue(mockEntries)

    const mockedExtractor = extractObligations as jest.MockedFunction<typeof extractObligations>
    mockedExtractor.mockRejectedValue(new Error('Claude API error: Invalid JSON response'))

    // Act
    const result = await runPipeline('RO', 'legislatie.just.ro', {
      verbose: false
    })

    // Assert - M1 and M2 succeed
    expect(result.stages.M1.success).toBe(true)
    expect(result.stages.M2.success).toBe(true)

    // Assert - M3 fails but pipeline continues
    expect(result.stages.M3.success).toBe(true)
    expect(result.stages.M3.data).toHaveLength(0)
    expect(result.summary.obligationsExtracted).toBe(0)

    // Assert - Pipeline stops with partial success
    expect(result.status).toBe('partial_success')
    expect(result.summary.errors.length).toBeGreaterThan(0)
  })

  // ──────────────────────────────────────────────────────────
  // TEST 8: Pipeline supports stopAtStage option
  // ──────────────────────────────────────────────────────────

  test('pipeline stops at specified stage when stopAtStage option is provided', async () => {
    // Arrange
    const mockEntries = [createMockLegislationEntry()]

    const mockedScraper = scrapeLegislatie as jest.MockedFunction<typeof scrapeLegislatie>
    mockedScraper.mockResolvedValue(mockEntries)

    // Act
    const result = await runPipeline('RO', 'legislatie.just.ro', {
      verbose: false,
      stopAtStage: 'M1'
    })

    // Assert - Only M1 executed
    expect(result.stages.M1.success).toBe(true)
    expect(result.stages.M1.data).toHaveLength(1)

    // Assert - Subsequent stages not executed
    expect(result.stages.M2.success).toBe(false)
    expect(result.stages.M3.success).toBe(false)
    expect(result.stages.M4.success).toBe(false)

    // Assert - Pipeline completed successfully at M1
    expect(result.status).toBe('completed')
    expect(result.summary.entriesScraped).toBe(1)
    expect(result.summary.documentsParsed).toBe(0)
  })

  // ──────────────────────────────────────────────────────────
  // TEST 9: Pipeline tracks progress with onProgress callback
  // ──────────────────────────────────────────────────────────

  test('pipeline tracks progress with onProgress callback', async () => {
    // Arrange
    const mockEntries = [createMockLegislationEntry()]
    const mockObligations = [createMockObligation()]

    const mockedScraper = scrapeLegislatie as jest.MockedFunction<typeof scrapeLegislatie>
    mockedScraper.mockResolvedValue(mockEntries)

    const mockedExtractor = extractObligations as jest.MockedFunction<typeof extractObligations>
    mockedExtractor.mockResolvedValue(mockObligations)

    const mockedValidator = validateObligations as jest.MockedFunction<typeof validateObligations>
    mockedValidator.mockResolvedValue(mockObligations.map(createMockValidatedObligation))

    const mockedPublisher = publishObligations as jest.MockedFunction<typeof publishObligations>
    mockedPublisher.mockResolvedValue({
      success: true,
      publishedCount: 1,
      failedCount: 0,
      publishedIds: ['OBL_1'],
      errors: [],
      notifiedOrganizations: 0
    })

    const mockedReportGenerator = generateValidationReport as jest.MockedFunction<typeof generateValidationReport>
    mockedReportGenerator.mockReturnValue({
      totalObligations: 1,
      validObligations: 1,
      invalidObligations: 0,
      duplicatesRemoved: 0,
      avgConfidenceScore: 0.85,
      avgValidationScore: 0.9,
      issuesByType: {}
    })

    const progressUpdates: PipelineProgressUpdate[] = []
    const onProgress = jest.fn((update: PipelineProgressUpdate) => {
      progressUpdates.push(update)
    })

    // Act
    const result = await runPipeline('RO', 'legislatie.just.ro', {
      verbose: false,
      onProgress
    })

    // Assert - Progress callback called for all stages
    expect(onProgress).toHaveBeenCalled()
    expect(progressUpdates.length).toBeGreaterThan(0)

    // Assert - Progress updates contain all stages
    const stages = progressUpdates.map(u => u.stage)
    expect(stages).toContain('M1')
    expect(stages).toContain('M2')
    expect(stages).toContain('M3')
    expect(stages).toContain('M4')

    // Assert - Progress updates have timestamps
    progressUpdates.forEach(update => {
      expect(update.timestamp).toBeTruthy()
      expect(update.stage).toBeTruthy()
      expect(update.status).toBeTruthy()
      expect(update.message).toBeTruthy()
    })

    // Assert - Pipeline completed
    expect(result.status).toBe('completed')
  })

  // ──────────────────────────────────────────────────────────
  // TEST 10: Batch pipeline processes multiple countries
  // ──────────────────────────────────────────────────────────

  test('batch pipeline processes multiple countries in parallel', async () => {
    // Arrange
    const mockEntries = [createMockLegislationEntry()]
    const mockObligations = [createMockObligation()]

    const mockedScraper = scrapeLegislatie as jest.MockedFunction<typeof scrapeLegislatie>
    mockedScraper.mockResolvedValue(mockEntries)

    const mockedExtractor = extractObligations as jest.MockedFunction<typeof extractObligations>
    mockedExtractor.mockResolvedValue(mockObligations)

    const mockedValidator = validateObligations as jest.MockedFunction<typeof validateObligations>
    mockedValidator.mockResolvedValue(mockObligations.map(createMockValidatedObligation))

    const mockedPublisher = publishObligations as jest.MockedFunction<typeof publishObligations>
    mockedPublisher.mockResolvedValue({
      success: true,
      publishedCount: 1,
      failedCount: 0,
      publishedIds: ['OBL_1'],
      errors: [],
      notifiedOrganizations: 0
    })

    const mockedReportGenerator = generateValidationReport as jest.MockedFunction<typeof generateValidationReport>
    mockedReportGenerator.mockReturnValue({
      totalObligations: 1,
      validObligations: 1,
      invalidObligations: 0,
      duplicatesRemoved: 0,
      avgConfidenceScore: 0.85,
      avgValidationScore: 0.9,
      issuesByType: {}
    })

    const countries: CountryCode[] = ['RO', 'BG', 'HU']

    // Act
    const batchResult = await runBatchPipeline(countries, {
      verbose: false
    })

    // Assert - Batch result structure
    expect(batchResult.totalCountries).toBe(3)
    expect(batchResult.successfulCountries).toBe(3)
    expect(batchResult.failedCountries).toBe(0)
    expect(batchResult.completedAt).toBeTruthy()
    expect(batchResult.totalDuration).toBeGreaterThan(0)

    // Assert - Individual country results
    expect(Object.keys(batchResult.results)).toHaveLength(3)
    expect(batchResult.results['RO']).toBeDefined()
    expect(batchResult.results['BG']).toBeDefined()
    expect(batchResult.results['HU']).toBeDefined()

    // Assert - All countries completed
    countries.forEach(country => {
      const countryResult = batchResult.results[country]
      expect(countryResult.status).toBe('completed')
      expect(countryResult.country).toBe(country)
    })

    // Assert - Scraper called for each country (3 times)
    expect(mockedScraper).toHaveBeenCalledTimes(3)
  })
})
