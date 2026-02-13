// lib/modules/legislation-module.ts
// OP-LEGO — Legislation Module
// Legislation tracking, obligation mapping, compliance checking, AI extraction integration
// Data: 13 Februarie 2026

import type { ModuleKey } from './types'

// ── Type Definitions ──
export type CountryCode = 'RO' | 'BG' | 'HU' | 'DE' | 'PL'

export type LegislationDomain =
  | 'ssm'                      // SSM (work safety)
  | 'psi'                      // PSI (fire safety)
  | 'gdpr'                     // GDPR
  | 'labor'                    // Labor law
  | 'environmental'            // Environmental
  | 'construction'             // Construction
  | 'transport'                // Transport
  | 'food_safety'              // Food safety
  | 'other'

// ── Module Interface ──
export interface IModule {
  key: ModuleKey
  name_en: string
  name_localized: Record<string, string>
  description_en: string
  icon: string
  category: 'core' | 'standalone' | 'premium'
  is_base: boolean
  depends_on: ModuleKey[]
  incompatible: ModuleKey[]
  getDefaultConfig: () => LegislationModuleConfig
  validateConfig: (config: any) => boolean
}

// ── Legislation Module Configuration ──
export interface LegislationModuleConfig {
  // Active countries to monitor
  activeCountries: {
    countryCode: CountryCode
    isActive: boolean
    priority: 'high' | 'medium' | 'low'
    customSources?: string[]
  }[]

  // Legislation domains to monitor
  domainsMonitored: {
    domain: LegislationDomain
    isActive: boolean
    keywords: string[]
    autoExtract: boolean
  }[]

  // Auto-check frequency configuration
  autoCheckConfig: {
    enableAutoCheck: boolean
    checkFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
    checkTime: string // HH:MM format (UTC)
    onlyWorkdays: boolean
    maxEntriesPerCheck: number
    sinceDays: number // How many days back to check
  }

  // AI Extraction configuration
  aiExtractionConfig: {
    enableAiExtraction: boolean
    autoExtractOnNewLegislation: boolean
    minConfidenceScore: number // 0-1
    batchSize: number // How many documents to process at once
    requiresManualReview: boolean
    anthropicApiKey?: string // Optional override
  }

  // Obligation mapping configuration
  obligationMappingConfig: {
    enableObligationMapping: boolean
    autoMapToModules: boolean // Auto-map obligations to relevant modules
    autoCreateAlerts: boolean // Auto-create alerts for new obligations
    defaultAlertDaysBefore: number // Default warning days
    requiresApproval: boolean // Requires consultant approval before publishing
  }

  // Compliance checking configuration
  complianceCheckConfig: {
    enableComplianceChecks: boolean
    checkFrequency: 'weekly' | 'monthly' | 'quarterly'
    autoNotifyNonCompliance: boolean
    escalationThresholdDays: number // Days before escalation
    notificationChannels: ('email' | 'whatsapp' | 'sms' | 'push')[]
  }

  // RSS Feed sources per country
  rssSources: {
    countryCode: CountryCode
    sources: {
      name: string
      url: string
      domain: LegislationDomain
      isActive: boolean
      checkFrequency: number // minutes
    }[]
  }[]

  // Legislation parsing configuration
  parsingConfig: {
    enableStructuredParsing: boolean // M2 parser
    extractArticles: boolean
    extractChapters: boolean
    extractAnnexes: boolean
    extractCrossReferences: boolean
    detectObligationKeywords: boolean
    detectPenalties: boolean
  }

  // Validation and publishing configuration
  validationConfig: {
    enableValidation: boolean
    minValidationScore: number // 0-100
    requiresLegalReview: boolean
    autoPublishThreshold: number // Score above which auto-publish
    notifyOrganizationsOnPublish: boolean
  }

  // Alert thresholds for legislation changes
  alertThresholds: {
    newLegislationAlert: boolean
    legislationUpdateAlert: boolean
    repealedLegislationAlert: boolean
    urgentChangesEscalationDays: number
    majorChangesWarningDays: number
  }

  // Country-specific settings
  countrySpecific: {
    legalReferences: string[] // Key legislation acts
    competentAuthority: string // Ex: 'Monitorul Oficial'
    authorityUrl: string | null
    emergencyNumber: string
    mandatoryCompliance: string[] // List of mandatory compliance areas
    reportingRequirements: string[] // Mandatory reporting to authorities
  }
}

// ── Legislation Module Definition ──
export const legislationModule: IModule = {
  key: 'legislatie',
  name_en: 'Legislation & Compliance Tracking',
  name_localized: {
    ro: 'Legislație și Conformitate',
    bg: 'Законодателство и съответствие',
    hu: 'Jogszabályok és megfelelőség',
    de: 'Gesetzgebung und Compliance',
    pl: 'Prawodawstwo i zgodność',
    en: 'Legislation & Compliance Tracking',
  },
  description_en: 'Legislation tracking, obligation mapping, AI-powered compliance checking, automatic monitoring of regulatory changes',
  icon: 'Scale',
  category: 'core',
  is_base: true, // Base module - included automatically
  depends_on: ['ssm-core'], // Depends on SSM Core for employee and organization context
  incompatible: [], // Compatible with all modules

  /**
   * Returns default Legislation module configuration
   */
  getDefaultConfig(): LegislationModuleConfig {
    return {
      activeCountries: [
        {
          countryCode: 'RO',
          isActive: true,
          priority: 'high',
          customSources: ['https://legislatie.just.ro/Public/RssFS/RSS'],
        },
        {
          countryCode: 'BG',
          isActive: false,
          priority: 'medium',
        },
        {
          countryCode: 'HU',
          isActive: false,
          priority: 'medium',
        },
        {
          countryCode: 'DE',
          isActive: false,
          priority: 'low',
        },
        {
          countryCode: 'PL',
          isActive: false,
          priority: 'low',
        },
      ],

      domainsMonitored: [
        {
          domain: 'ssm',
          isActive: true,
          keywords: [
            'securitate',
            'sănătate',
            'muncă',
            'protecție',
            'salariat',
            'angajat',
            'medicina muncii',
          ],
          autoExtract: true,
        },
        {
          domain: 'psi',
          isActive: true,
          keywords: [
            'incendiu',
            'apărare',
            'pompieri',
            'stingere',
            'evacuare',
            'situații de urgență',
          ],
          autoExtract: true,
        },
        {
          domain: 'gdpr',
          isActive: true,
          keywords: [
            'date personale',
            'GDPR',
            'protecția datelor',
            'prelucrare',
            'ANSPDCP',
          ],
          autoExtract: true,
        },
        {
          domain: 'labor',
          isActive: true,
          keywords: [
            'codul muncii',
            'contract',
            'concediu',
            'salariu',
            'ITM',
            'revisal',
          ],
          autoExtract: true,
        },
        {
          domain: 'other',
          isActive: false,
          keywords: [],
          autoExtract: false,
        },
      ],

      autoCheckConfig: {
        enableAutoCheck: true,
        checkFrequency: 'daily',
        checkTime: '06:00', // 6 AM UTC
        onlyWorkdays: true,
        maxEntriesPerCheck: 100,
        sinceDays: 7, // Check last 7 days
      },

      aiExtractionConfig: {
        enableAiExtraction: true,
        autoExtractOnNewLegislation: false, // Manual trigger by default
        minConfidenceScore: 0.7,
        batchSize: 5,
        requiresManualReview: true,
      },

      obligationMappingConfig: {
        enableObligationMapping: true,
        autoMapToModules: true,
        autoCreateAlerts: true,
        defaultAlertDaysBefore: 30,
        requiresApproval: true,
      },

      complianceCheckConfig: {
        enableComplianceChecks: true,
        checkFrequency: 'monthly',
        autoNotifyNonCompliance: true,
        escalationThresholdDays: 30,
        notificationChannels: ['email', 'whatsapp'],
      },

      rssSources: [
        {
          countryCode: 'RO',
          sources: [
            {
              name: 'Monitorul Oficial',
              url: 'https://legislatie.just.ro/Public/RssFS/RSS',
              domain: 'ssm',
              isActive: true,
              checkFrequency: 360, // 6 hours
            },
            {
              name: 'ITM - Inspecția Muncii',
              url: 'https://www.inspectiamuncii.ro/rss',
              domain: 'ssm',
              isActive: false, // Not available
              checkFrequency: 720,
            },
          ],
        },
        {
          countryCode: 'BG',
          sources: [
            {
              name: 'Държавен вестник (State Gazette)',
              url: 'https://dv.parliament.bg/rss',
              domain: 'ssm',
              isActive: false,
              checkFrequency: 360,
            },
          ],
        },
      ],

      parsingConfig: {
        enableStructuredParsing: true,
        extractArticles: true,
        extractChapters: true,
        extractAnnexes: true,
        extractCrossReferences: true,
        detectObligationKeywords: true,
        detectPenalties: true,
      },

      validationConfig: {
        enableValidation: true,
        minValidationScore: 70,
        requiresLegalReview: true,
        autoPublishThreshold: 90,
        notifyOrganizationsOnPublish: true,
      },

      alertThresholds: {
        newLegislationAlert: true,
        legislationUpdateAlert: true,
        repealedLegislationAlert: true,
        urgentChangesEscalationDays: 7,
        majorChangesWarningDays: 30,
      },

      countrySpecific: {
        legalReferences: [
          'Legea nr. 319/2006 - Securitatea și sănătatea în muncă',
          'Legea nr. 307/2006 - Apărarea împotriva incendiilor',
          'Codul Muncii - Legea nr. 53/2003',
          'Legea nr. 190/2018 - GDPR',
        ],
        competentAuthority: 'Monitorul Oficial al României',
        authorityUrl: 'https://legislatie.just.ro',
        emergencyNumber: '112',
        mandatoryCompliance: [
          'Securitate și sănătate în muncă',
          'Apărare împotriva incendiilor',
          'Protecția datelor cu caracter personal',
          'Codul Muncii',
        ],
        reportingRequirements: [
          'Raportări ITM (Inspecția Muncii)',
          'Raportări IGSU (Pompieri)',
          'Raportări ANSPDCP (GDPR)',
          'Revisal (evidența salariaților)',
        ],
      },
    }
  },

  /**
   * Validates Legislation module configuration
   * @param config - Configuration object to validate
   * @returns true if valid, false otherwise
   */
  validateConfig(config: any): boolean {
    if (!config || typeof config !== 'object') return false

    // Validate activeCountries
    if (!Array.isArray(config.activeCountries)) return false
    for (const country of config.activeCountries) {
      if (
        !country.countryCode ||
        typeof country.isActive !== 'boolean' ||
        !['high', 'medium', 'low'].includes(country.priority)
      ) {
        return false
      }
    }

    // Validate domainsMonitored
    if (!Array.isArray(config.domainsMonitored)) return false
    for (const domain of config.domainsMonitored) {
      if (
        !['SSM', 'PSI', 'GDPR', 'LABOR', 'OTHER'].includes(domain.domain) ||
        typeof domain.isActive !== 'boolean' ||
        !Array.isArray(domain.keywords) ||
        typeof domain.autoExtract !== 'boolean'
      ) {
        return false
      }
    }

    // Validate autoCheckConfig
    if (!config.autoCheckConfig) return false
    const autoCheck = config.autoCheckConfig
    if (
      typeof autoCheck.enableAutoCheck !== 'boolean' ||
      !['daily', 'weekly', 'biweekly', 'monthly'].includes(autoCheck.checkFrequency) ||
      typeof autoCheck.checkTime !== 'string' ||
      typeof autoCheck.onlyWorkdays !== 'boolean' ||
      typeof autoCheck.maxEntriesPerCheck !== 'number' ||
      typeof autoCheck.sinceDays !== 'number' ||
      autoCheck.maxEntriesPerCheck <= 0 ||
      autoCheck.sinceDays <= 0
    ) {
      return false
    }

    // Validate aiExtractionConfig
    if (!config.aiExtractionConfig) return false
    const aiConfig = config.aiExtractionConfig
    if (
      typeof aiConfig.enableAiExtraction !== 'boolean' ||
      typeof aiConfig.autoExtractOnNewLegislation !== 'boolean' ||
      typeof aiConfig.minConfidenceScore !== 'number' ||
      typeof aiConfig.batchSize !== 'number' ||
      typeof aiConfig.requiresManualReview !== 'boolean' ||
      aiConfig.minConfidenceScore < 0 ||
      aiConfig.minConfidenceScore > 1 ||
      aiConfig.batchSize <= 0
    ) {
      return false
    }

    // Validate obligationMappingConfig
    if (!config.obligationMappingConfig) return false
    const mappingConfig = config.obligationMappingConfig
    if (
      typeof mappingConfig.enableObligationMapping !== 'boolean' ||
      typeof mappingConfig.autoMapToModules !== 'boolean' ||
      typeof mappingConfig.autoCreateAlerts !== 'boolean' ||
      typeof mappingConfig.defaultAlertDaysBefore !== 'number' ||
      typeof mappingConfig.requiresApproval !== 'boolean' ||
      mappingConfig.defaultAlertDaysBefore <= 0
    ) {
      return false
    }

    // Validate complianceCheckConfig
    if (!config.complianceCheckConfig) return false
    const complianceConfig = config.complianceCheckConfig
    if (
      typeof complianceConfig.enableComplianceChecks !== 'boolean' ||
      !['weekly', 'monthly', 'quarterly'].includes(complianceConfig.checkFrequency) ||
      typeof complianceConfig.autoNotifyNonCompliance !== 'boolean' ||
      typeof complianceConfig.escalationThresholdDays !== 'number' ||
      !Array.isArray(complianceConfig.notificationChannels) ||
      complianceConfig.escalationThresholdDays <= 0
    ) {
      return false
    }

    // Validate rssSources
    if (!Array.isArray(config.rssSources)) return false
    for (const rssCountry of config.rssSources) {
      if (!rssCountry.countryCode || !Array.isArray(rssCountry.sources)) {
        return false
      }
      for (const source of rssCountry.sources) {
        if (
          !source.name ||
          !source.url ||
          !['SSM', 'PSI', 'GDPR', 'LABOR', 'OTHER'].includes(source.domain) ||
          typeof source.isActive !== 'boolean' ||
          typeof source.checkFrequency !== 'number' ||
          source.checkFrequency <= 0
        ) {
          return false
        }
      }
    }

    // Validate parsingConfig
    if (!config.parsingConfig) return false
    const parsingConfig = config.parsingConfig
    if (
      typeof parsingConfig.enableStructuredParsing !== 'boolean' ||
      typeof parsingConfig.extractArticles !== 'boolean' ||
      typeof parsingConfig.extractChapters !== 'boolean' ||
      typeof parsingConfig.extractAnnexes !== 'boolean' ||
      typeof parsingConfig.extractCrossReferences !== 'boolean' ||
      typeof parsingConfig.detectObligationKeywords !== 'boolean' ||
      typeof parsingConfig.detectPenalties !== 'boolean'
    ) {
      return false
    }

    // Validate validationConfig
    if (!config.validationConfig) return false
    const validationConfig = config.validationConfig
    if (
      typeof validationConfig.enableValidation !== 'boolean' ||
      typeof validationConfig.minValidationScore !== 'number' ||
      typeof validationConfig.requiresLegalReview !== 'boolean' ||
      typeof validationConfig.autoPublishThreshold !== 'number' ||
      typeof validationConfig.notifyOrganizationsOnPublish !== 'boolean' ||
      validationConfig.minValidationScore < 0 ||
      validationConfig.minValidationScore > 100 ||
      validationConfig.autoPublishThreshold < 0 ||
      validationConfig.autoPublishThreshold > 100
    ) {
      return false
    }

    // Validate alertThresholds
    if (!config.alertThresholds) return false
    const alerts = config.alertThresholds
    if (
      typeof alerts.newLegislationAlert !== 'boolean' ||
      typeof alerts.legislationUpdateAlert !== 'boolean' ||
      typeof alerts.repealedLegislationAlert !== 'boolean' ||
      typeof alerts.urgentChangesEscalationDays !== 'number' ||
      typeof alerts.majorChangesWarningDays !== 'number' ||
      alerts.urgentChangesEscalationDays <= 0 ||
      alerts.majorChangesWarningDays <= 0
    ) {
      return false
    }

    // Validate countrySpecific
    if (!config.countrySpecific) return false
    const country = config.countrySpecific
    if (
      !Array.isArray(country.legalReferences) ||
      !country.competentAuthority ||
      !country.emergencyNumber ||
      !Array.isArray(country.mandatoryCompliance) ||
      !Array.isArray(country.reportingRequirements)
    ) {
      return false
    }

    return true
  },
}

// ── Country-Specific Legislation Configurations ──

/**
 * Romania Legislation configuration
 */
export function getRomaniaLegislationConfig(): Partial<LegislationModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Legea nr. 319/2006 - Securitatea și sănătatea în muncă',
        'Legea nr. 307/2006 - Apărarea împotriva incendiilor',
        'Codul Muncii - Legea nr. 53/2003',
        'Legea nr. 190/2018 - GDPR',
        'HG nr. 1425/2006 - Evaluarea riscurilor',
      ],
      competentAuthority: 'Monitorul Oficial al României',
      authorityUrl: 'https://legislatie.just.ro',
      emergencyNumber: '112',
      mandatoryCompliance: [
        'Securitate și sănătate în muncă',
        'Apărare împotriva incendiilor',
        'Protecția datelor cu caracter personal',
        'Codul Muncii',
      ],
      reportingRequirements: [
        'Raportări ITM (Inspecția Muncii)',
        'Raportări IGSU (Pompieri)',
        'Raportări ANSPDCP (GDPR)',
        'Revisal (evidența salariaților)',
      ],
    },
  }
}

/**
 * Bulgaria Legislation configuration
 */
export function getBulgariaLegislationConfig(): Partial<LegislationModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Закон за здравословни и безопасни условия на труд',
        'Кодекс на труда',
        'Закон за защита на личните данни',
      ],
      competentAuthority: 'Държавен вестник',
      authorityUrl: 'https://dv.parliament.bg',
      emergencyNumber: '112',
      mandatoryCompliance: [
        'Безопасност на труда',
        'Пожарна безопасност',
        'Защита на данните',
        'Трудов кодекс',
      ],
      reportingRequirements: [
        'Главна инспекция по труда',
        'Пожарна безопасност',
        'КЗЛД (GDPR)',
      ],
    },
  }
}

/**
 * Hungary Legislation configuration
 */
export function getHungaryLegislationConfig(): Partial<LegislationModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Munka törvénykönyve (2012. évi I. törvény)',
        '93/1993. (VII. 5.) Korm. rendelet - Munkavédelem',
        'GDPR - Adatvédelmi rendelet',
      ],
      competentAuthority: 'Magyar Közlöny',
      authorityUrl: 'https://magyarkozlony.hu',
      emergencyNumber: '112',
      mandatoryCompliance: [
        'Munkavédelem',
        'Tűzvédelem',
        'Adatvédelem',
        'Munka törvénykönyve',
      ],
      reportingRequirements: [
        'Munkaügyi Hatóság',
        'Tűzvédelmi jelentések',
        'NAIH (Adatvédelem)',
      ],
    },
  }
}

/**
 * Germany Legislation configuration
 */
export function getGermanyLegislationConfig(): Partial<LegislationModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Arbeitsschutzgesetz (ArbSchG)',
        'Arbeitsstättenverordnung (ArbStättV)',
        'DSGVO - Datenschutz-Grundverordnung',
        'Arbeitszeitgesetz (ArbZG)',
      ],
      competentAuthority: 'Bundesgesetzblatt',
      authorityUrl: 'https://www.bgbl.de',
      emergencyNumber: '112',
      mandatoryCompliance: [
        'Arbeitsschutz',
        'Brandschutz',
        'Datenschutz',
        'Arbeitsrecht',
      ],
      reportingRequirements: [
        'Gewerbeaufsichtsamt',
        'Brandschutzbehörde',
        'Datenschutzbehörde',
      ],
    },
  }
}

/**
 * Poland Legislation configuration
 */
export function getPolandLegislationConfig(): Partial<LegislationModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Kodeks pracy',
        'Ustawa o ochronie danych osobowych',
        'Prawo budowlane - przepisy p.poż.',
      ],
      competentAuthority: 'Monitor Polski',
      authorityUrl: 'https://monitorpolski.gov.pl',
      emergencyNumber: '112',
      mandatoryCompliance: [
        'Bezpieczeństwo pracy',
        'Ochrona przeciwpożarowa',
        'Ochrona danych osobowych',
        'Kodeks pracy',
      ],
      reportingRequirements: [
        'Państwowa Inspekcja Pracy',
        'Straż Pożarna',
        'UODO (GDPR)',
      ],
    },
  }
}

// ── Helper Functions ──

/**
 * Get Legislation configuration for a specific country
 * @param countryCode - Country code (RO, BG, HU, DE, PL)
 * @returns Merged configuration with country-specific settings
 */
export function getLegislationConfigForCountry(countryCode: string): LegislationModuleConfig {
  const baseConfig = legislationModule.getDefaultConfig()

  let countrySpecific: Partial<LegislationModuleConfig> | undefined

  switch (countryCode) {
    case 'RO':
      countrySpecific = getRomaniaLegislationConfig()
      break
    case 'BG':
      countrySpecific = getBulgariaLegislationConfig()
      break
    case 'HU':
      countrySpecific = getHungaryLegislationConfig()
      break
    case 'DE':
      countrySpecific = getGermanyLegislationConfig()
      break
    case 'PL':
      countrySpecific = getPolandLegislationConfig()
      break
  }

  if (countrySpecific) {
    return {
      ...baseConfig,
      ...countrySpecific,
    }
  }

  return baseConfig
}

/**
 * Check if a country is actively monitored
 * @param config - Legislation module configuration
 * @param countryCode - Country code to check
 * @returns true if country is actively monitored
 */
export function isCountryMonitored(
  config: LegislationModuleConfig,
  countryCode: CountryCode
): boolean {
  const country = config.activeCountries.find((c) => c.countryCode === countryCode)
  return country?.isActive ?? false
}

/**
 * Check if a domain is actively monitored
 * @param config - Legislation module configuration
 * @param domain - Domain to check
 * @returns true if domain is actively monitored
 */
export function isDomainMonitored(
  config: LegislationModuleConfig,
  domain: LegislationDomain
): boolean {
  const domainConfig = config.domainsMonitored.find((d) => d.domain === domain)
  return domainConfig?.isActive ?? false
}

/**
 * Get active RSS sources for a country
 * @param config - Legislation module configuration
 * @param countryCode - Country code
 * @returns Array of active RSS sources
 */
export function getActiveRssSources(
  config: LegislationModuleConfig,
  countryCode: CountryCode
): LegislationModuleConfig['rssSources'][0]['sources'] {
  const countryRss = config.rssSources.find((r) => r.countryCode === countryCode)
  return countryRss?.sources.filter((s) => s.isActive) ?? []
}

/**
 * Calculate compliance score based on legislation tracking
 * @param stats - Legislation statistics
 * @returns Compliance score (0-100)
 */
export function calculateLegislationComplianceScore(stats: {
  totalObligations: number
  compliantObligations: number
  pendingReview: number
  overdueLegislation: number
}): number {
  if (stats.totalObligations === 0) return 100

  // Base compliance score
  const baseScore = (stats.compliantObligations / stats.totalObligations) * 100

  // Penalties
  const pendingPenalty = Math.min(stats.pendingReview * 2, 10) // -2 points per pending, max -10
  const overduePenalty = Math.min(stats.overdueLegislation * 5, 20) // -5 points per overdue, max -20

  const finalScore = Math.max(0, baseScore - pendingPenalty - overduePenalty)

  return Math.round(finalScore)
}

/**
 * Determine next auto-check time based on frequency
 * @param config - Auto-check configuration
 * @param lastCheckTime - Last check timestamp (ISO string)
 * @returns Next check time (ISO string)
 */
export function calculateNextCheckTime(
  config: LegislationModuleConfig['autoCheckConfig'],
  lastCheckTime: string
): string {
  const lastCheck = new Date(lastCheckTime)
  const [hours, minutes] = config.checkTime.split(':').map(Number)

  let nextCheck = new Date(lastCheck)

  switch (config.checkFrequency) {
    case 'daily':
      nextCheck.setDate(nextCheck.getDate() + 1)
      break
    case 'weekly':
      nextCheck.setDate(nextCheck.getDate() + 7)
      break
    case 'biweekly':
      nextCheck.setDate(nextCheck.getDate() + 14)
      break
    case 'monthly':
      nextCheck.setMonth(nextCheck.getMonth() + 1)
      break
  }

  nextCheck.setHours(hours, minutes, 0, 0)

  // Skip weekends if onlyWorkdays is true
  if (config.onlyWorkdays) {
    const dayOfWeek = nextCheck.getDay()
    if (dayOfWeek === 0) {
      // Sunday -> Monday
      nextCheck.setDate(nextCheck.getDate() + 1)
    } else if (dayOfWeek === 6) {
      // Saturday -> Monday
      nextCheck.setDate(nextCheck.getDate() + 2)
    }
  }

  return nextCheck.toISOString()
}

// ── Exports ──
export default legislationModule
