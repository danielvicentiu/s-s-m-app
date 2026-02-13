// lib/modules/legislation-module.ts
// OP-LEGO — Legislation Module
// Legislation tracking, obligation mapping, compliance checking, AI extraction integration
// Data: 13 Februarie 2026

import type { ModuleKey, CountryModuleConfig } from './types'
import type { CountryCode, LegislationDomain } from '@/lib/types'

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
  // Active countries monitoring
  activeCountries: CountryCode[]

  // Domains to monitor
  monitoredDomains: {
    domain: LegislationDomain
    enabled: boolean
    keywords: string[]              // Custom keywords per domain
    priority: 'high' | 'medium' | 'low'
  }[]

  // Auto-check configuration
  autoCheckConfig: {
    enabled: boolean
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
    checkHour: number               // 0-23 (UTC)
    checkDay: number | null         // 0-6 for weekly (0=Sunday), 1-31 for monthly
    sinceDays: number               // Scrape legislation from last N days
    maxEntriesPerCountry: number    // Limit entries per country
  }

  // AI extraction configuration
  aiExtractionConfig: {
    enabled: boolean
    autoExtractOnNewLegislation: boolean   // Auto-extract obligations from new legislation
    batchSize: number                       // Articles per batch
    minConfidence: number                   // Minimum confidence threshold (0.0-1.0)
    useClaudeModel: string                  // Claude model to use
  }

  // Compliance checking
  complianceConfig: {
    autoMapToOrganization: boolean          // Auto-map new obligations to organization
    generateComplianceAlerts: boolean       // Generate alerts for new obligations
    trackImplementationStatus: boolean      // Track which obligations are implemented
    requireEvidenceUpload: boolean          // Require evidence uploads for compliance
  }

  // Notification settings
  notificationConfig: {
    notifyOnNewLegislation: boolean         // Notify when new legislation detected
    notifyOnNewObligations: boolean         // Notify when new obligations extracted
    notifyOnComplianceGaps: boolean         // Notify about compliance gaps
    channels: ('email' | 'whatsapp' | 'push')[]
    recipients: string[]                    // Email addresses or user IDs
  }

  // Alert thresholds
  alertThresholds: {
    newLegislationWarningDays: number       // Days before notifying about new legislation
    obligationImplementationDays: number    // Days to implement new obligation
    complianceCheckFrequency: number        // Days between compliance checks
  }

  // Country-specific settings
  countrySpecific: {
    rssEndpoints: Record<CountryCode, string>     // Override default RSS endpoints
    customDomainKeywords: Record<LegislationDomain, string[]>  // Country-specific keywords
    legalFramework: string[]                      // Legal framework references
    competentAuthority: string                    // Regulatory authority
    authorityUrl: string | null
  }
}

// ── Legislation Module Definition ──
export const legislationModule: IModule = {
  key: 'legislatie',
  name_en: 'Legislation Tracking',
  name_localized: {
    ro: 'Monitorizare Legislație',
    bg: 'Проследяване на законодателството',
    hu: 'Jogszabálykövetés',
    de: 'Gesetzesüberwachung',
    pl: 'Śledzenie legislacji',
    en: 'Legislation Tracking',
  },
  description_en: 'Automated legislation tracking, obligation extraction, compliance checking, and AI-powered legal intelligence',
  icon: 'Scale',
  category: 'core',
  is_base: false,
  depends_on: ['alerte'], // Depends on core alerts module for notifications
  incompatible: [], // Compatible with all modules

  /**
   * Returns default Legislation module configuration
   */
  getDefaultConfig(): LegislationModuleConfig {
    return {
      activeCountries: ['RO'],

      monitoredDomains: [
        {
          domain: 'SSM',
          enabled: true,
          keywords: [
            'securitate muncă',
            'securitatea și sănătatea',
            'protecția muncii',
            'sanatate ocupationala',
            'accidente de munca',
            'boli profesionale',
            'echipament protectie',
            'evaluare riscuri',
            'medicina muncii',
            'igienă muncă',
          ],
          priority: 'high',
        },
        {
          domain: 'PSI',
          enabled: true,
          keywords: [
            'prevenire incendii',
            'securitate la incendiu',
            'apărare împotriva incendiilor',
            'PSI',
            'protecție incendii',
            'pompieri',
          ],
          priority: 'high',
        },
        {
          domain: 'GDPR',
          enabled: true,
          keywords: [
            'protecția datelor',
            'date cu caracter personal',
            'prelucrare date',
            'GDPR',
            'RGPD',
          ],
          priority: 'medium',
        },
        {
          domain: 'LABOR',
          enabled: false,
          keywords: [
            'codul muncii',
            'contractul individual',
            'relații de muncă',
            'salarizare',
            'concedii',
            'timpul de muncă',
          ],
          priority: 'low',
        },
        {
          domain: 'OTHER',
          enabled: false,
          keywords: [],
          priority: 'low',
        },
      ],

      autoCheckConfig: {
        enabled: true,
        frequency: 'weekly',
        checkHour: 6,         // 6 AM UTC
        checkDay: 1,          // Monday for weekly
        sinceDays: 30,
        maxEntriesPerCountry: 100,
      },

      aiExtractionConfig: {
        enabled: true,
        autoExtractOnNewLegislation: false,  // Manual review recommended
        batchSize: 7,
        minConfidence: 0.7,
        useClaudeModel: 'claude-sonnet-4-5-20250929',
      },

      complianceConfig: {
        autoMapToOrganization: false,        // Manual mapping recommended
        generateComplianceAlerts: true,
        trackImplementationStatus: true,
        requireEvidenceUpload: false,
      },

      notificationConfig: {
        notifyOnNewLegislation: true,
        notifyOnNewObligations: true,
        notifyOnComplianceGaps: true,
        channels: ['email'],
        recipients: [],
      },

      alertThresholds: {
        newLegislationWarningDays: 7,
        obligationImplementationDays: 90,
        complianceCheckFrequency: 30,
      },

      countrySpecific: {
        rssEndpoints: {
          RO: 'https://legislatie.just.ro/RSS/MonitorulOficial',
          BG: 'https://www.lex.bg/rss',
          HU: 'https://njt.hu/rss',
          DE: 'https://www.gesetze-im-internet.de/rss',
          PL: 'https://dziennikustaw.gov.pl/rss',
        },
        customDomainKeywords: {
          SSM: [],
          PSI: [],
          GDPR: [],
          LABOR: [],
          OTHER: [],
        },
        legalFramework: [
          'Legea nr. 319/2006 - Securitate și sănătate în muncă',
          'Legea nr. 307/2006 - Apărare împotriva incendiilor',
          'Regulamentul (UE) 2016/679 - GDPR',
        ],
        competentAuthority: 'Inspectoratul Teritorial de Muncă (ITM)',
        authorityUrl: 'https://www.inspectiamuncii.ro',
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
    const validCountries = ['RO', 'BG', 'HU', 'DE', 'PL']
    for (const country of config.activeCountries) {
      if (!validCountries.includes(country)) return false
    }

    // Validate monitoredDomains
    if (!Array.isArray(config.monitoredDomains)) return false
    const validDomains = ['SSM', 'PSI', 'GDPR', 'LABOR', 'OTHER']
    for (const domainConfig of config.monitoredDomains) {
      if (
        !validDomains.includes(domainConfig.domain) ||
        typeof domainConfig.enabled !== 'boolean' ||
        !Array.isArray(domainConfig.keywords) ||
        !['high', 'medium', 'low'].includes(domainConfig.priority)
      ) {
        return false
      }
    }

    // Validate autoCheckConfig
    if (!config.autoCheckConfig) return false
    const autoCheck = config.autoCheckConfig
    if (
      typeof autoCheck.enabled !== 'boolean' ||
      !['daily', 'weekly', 'biweekly', 'monthly'].includes(autoCheck.frequency) ||
      typeof autoCheck.checkHour !== 'number' ||
      autoCheck.checkHour < 0 ||
      autoCheck.checkHour > 23 ||
      typeof autoCheck.sinceDays !== 'number' ||
      autoCheck.sinceDays <= 0 ||
      typeof autoCheck.maxEntriesPerCountry !== 'number' ||
      autoCheck.maxEntriesPerCountry <= 0
    ) {
      return false
    }

    // Validate aiExtractionConfig
    if (!config.aiExtractionConfig) return false
    const ai = config.aiExtractionConfig
    if (
      typeof ai.enabled !== 'boolean' ||
      typeof ai.autoExtractOnNewLegislation !== 'boolean' ||
      typeof ai.batchSize !== 'number' ||
      ai.batchSize <= 0 ||
      typeof ai.minConfidence !== 'number' ||
      ai.minConfidence < 0 ||
      ai.minConfidence > 1 ||
      typeof ai.useClaudeModel !== 'string'
    ) {
      return false
    }

    // Validate complianceConfig
    if (!config.complianceConfig) return false
    const compliance = config.complianceConfig
    if (
      typeof compliance.autoMapToOrganization !== 'boolean' ||
      typeof compliance.generateComplianceAlerts !== 'boolean' ||
      typeof compliance.trackImplementationStatus !== 'boolean' ||
      typeof compliance.requireEvidenceUpload !== 'boolean'
    ) {
      return false
    }

    // Validate notificationConfig
    if (!config.notificationConfig) return false
    const notif = config.notificationConfig
    if (
      typeof notif.notifyOnNewLegislation !== 'boolean' ||
      typeof notif.notifyOnNewObligations !== 'boolean' ||
      typeof notif.notifyOnComplianceGaps !== 'boolean' ||
      !Array.isArray(notif.channels) ||
      !Array.isArray(notif.recipients)
    ) {
      return false
    }

    // Validate alertThresholds
    if (!config.alertThresholds) return false
    const thresholds = config.alertThresholds
    if (
      typeof thresholds.newLegislationWarningDays !== 'number' ||
      typeof thresholds.obligationImplementationDays !== 'number' ||
      typeof thresholds.complianceCheckFrequency !== 'number' ||
      thresholds.newLegislationWarningDays <= 0 ||
      thresholds.obligationImplementationDays <= 0 ||
      thresholds.complianceCheckFrequency <= 0
    ) {
      return false
    }

    // Validate countrySpecific
    if (!config.countrySpecific) return false
    const countrySpec = config.countrySpecific
    if (
      !countrySpec.rssEndpoints ||
      typeof countrySpec.rssEndpoints !== 'object' ||
      !countrySpec.customDomainKeywords ||
      typeof countrySpec.customDomainKeywords !== 'object' ||
      !Array.isArray(countrySpec.legalFramework) ||
      !countrySpec.competentAuthority
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
    activeCountries: ['RO'],
    countrySpecific: {
      rssEndpoints: {
        RO: 'https://legislatie.just.ro/RSS/MonitorulOficial',
        BG: '',
        HU: '',
        DE: '',
        PL: '',
      },
      customDomainKeywords: {
        SSM: [
          'securitate muncă',
          'securitatea și sănătatea',
          'protecția muncii',
          'sanatate ocupationala',
          'ITM',
          'Inspectoratul Teritorial de Muncă',
        ],
        PSI: [
          'prevenire incendii',
          'securitate la incendiu',
          'apărare împotriva incendiilor',
          'ISU',
          'Inspectoratul pentru Situații de Urgență',
        ],
        GDPR: [
          'protecția datelor',
          'date cu caracter personal',
          'ANSPDCP',
        ],
        LABOR: [
          'codul muncii',
          'contractul individual',
          'relații de muncă',
        ],
        OTHER: [],
      },
      legalFramework: [
        'Legea nr. 319/2006 - Securitate și sănătate în muncă',
        'Legea nr. 307/2006 - Apărare împotriva incendiilor',
        'Regulamentul (UE) 2016/679 - GDPR',
        'Legea nr. 53/2003 - Codul Muncii',
      ],
      competentAuthority: 'Inspectoratul Teritorial de Muncă (ITM)',
      authorityUrl: 'https://www.inspectiamuncii.ro',
    },
  }
}

/**
 * Bulgaria Legislation configuration
 */
export function getBulgariaLegislationConfig(): Partial<LegislationModuleConfig> {
  return {
    activeCountries: ['BG'],
    countrySpecific: {
      rssEndpoints: {
        RO: '',
        BG: 'https://www.lex.bg/rss',
        HU: '',
        DE: '',
        PL: '',
      },
      customDomainKeywords: {
        SSM: [
          'здраве и безопасност',
          'условия на труд',
          'трудова медицина',
        ],
        PSI: [
          'противопожарна безопасност',
          'пожарна охрана',
        ],
        GDPR: [
          'защита на данни',
          'лични данни',
        ],
        LABOR: [
          'кодекс на труда',
          'трудови отношения',
        ],
        OTHER: [],
      },
      legalFramework: [
        'Закон за здравословни и безопасни условия на труд',
        'Закон за защита при бедствия',
        'Регламент (ЕС) 2016/679 - GDPR',
      ],
      competentAuthority: 'Изпълнителна агенция "Главна инспекция по труда"',
      authorityUrl: 'https://www.gli.government.bg',
    },
  }
}

/**
 * Hungary Legislation configuration
 */
export function getHungaryLegislationConfig(): Partial<LegislationModuleConfig> {
  return {
    activeCountries: ['HU'],
    countrySpecific: {
      rssEndpoints: {
        RO: '',
        BG: '',
        HU: 'https://njt.hu/rss',
        DE: '',
        PL: '',
      },
      customDomainKeywords: {
        SSM: [
          'munkavédelem',
          'munkaegészségügy',
          'munkabiztonság',
        ],
        PSI: [
          'tűzvédelem',
          'katasztrófavédelem',
        ],
        GDPR: [
          'adatvédelem',
          'személyes adatok',
        ],
        LABOR: [
          'munka törvénykönyve',
          'munkajog',
        ],
        OTHER: [],
      },
      legalFramework: [
        '1993. évi XCIII. törvény a munkavédelemről',
        '2011. évi CXXVIII. törvény a katasztrófavédelemről',
        '679/2016/EU rendelet - GDPR',
      ],
      competentAuthority: 'Országos Munkavédelmi és Munkaügyi Főfelügyelőség',
      authorityUrl: 'https://www.ommf.gov.hu',
    },
  }
}

/**
 * Germany Legislation configuration
 */
export function getGermanyLegislationConfig(): Partial<LegislationModuleConfig> {
  return {
    activeCountries: ['DE'],
    countrySpecific: {
      rssEndpoints: {
        RO: '',
        BG: '',
        HU: '',
        DE: 'https://www.gesetze-im-internet.de/rss',
        PL: '',
      },
      customDomainKeywords: {
        SSM: [
          'Arbeitsschutz',
          'Gesundheitsschutz',
          'Arbeitssicherheit',
          'Betriebsarzt',
        ],
        PSI: [
          'Brandschutz',
          'Feuerwehr',
        ],
        GDPR: [
          'Datenschutz',
          'personenbezogene Daten',
          'DSGVO',
        ],
        LABOR: [
          'Arbeitsrecht',
          'Arbeitsverhältnis',
        ],
        OTHER: [],
      },
      legalFramework: [
        'Arbeitsschutzgesetz (ArbSchG)',
        'Arbeitsstättenverordnung (ArbStättV)',
        'Datenschutz-Grundverordnung (DSGVO)',
      ],
      competentAuthority: 'Gewerbeaufsicht / Berufsgenossenschaften',
      authorityUrl: null,
    },
  }
}

/**
 * Poland Legislation configuration
 */
export function getPolandLegislationConfig(): Partial<LegislationModuleConfig> {
  return {
    activeCountries: ['PL'],
    countrySpecific: {
      rssEndpoints: {
        RO: '',
        BG: '',
        HU: '',
        DE: '',
        PL: 'https://dziennikustaw.gov.pl/rss',
      },
      customDomainKeywords: {
        SSM: [
          'bhp',
          'bezpieczeństwo i higiena pracy',
          'ochrona zdrowia pracowników',
        ],
        PSI: [
          'ochrona przeciwpożarowa',
          'straż pożarna',
        ],
        GDPR: [
          'ochrona danych osobowych',
          'RODO',
        ],
        LABOR: [
          'kodeks pracy',
          'prawo pracy',
        ],
        OTHER: [],
      },
      legalFramework: [
        'Ustawa z dnia 26 czerwca 1974 r. - Kodeks pracy',
        'Ustawa o ochronie przeciwpożarowej',
        'Rozporządzenie (UE) 2016/679 - RODO',
      ],
      competentAuthority: 'Państwowa Inspekcja Pracy (PIP)',
      authorityUrl: 'https://www.pip.gov.pl',
    },
  }
}

// ── Helper Functions ──

/**
 * Get Legislation configuration for a specific country
 * @param countryCode - Country code (RO, BG, HU, DE, PL)
 * @returns Merged configuration with country-specific settings
 */
export function getLegislationConfigForCountry(countryCode: CountryCode): LegislationModuleConfig {
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
      countrySpecific: {
        ...baseConfig.countrySpecific,
        ...countrySpecific.countrySpecific,
      },
    }
  }

  return baseConfig
}

/**
 * Calculate next check date based on frequency
 * @param lastCheckDate - Last check date (ISO string)
 * @param config - Legislation module configuration
 * @returns Next check date (ISO string)
 */
export function calculateNextCheckDate(
  lastCheckDate: string,
  config: LegislationModuleConfig
): string {
  const lastDate = new Date(lastCheckDate)
  const { frequency } = config.autoCheckConfig

  let daysToAdd = 0
  switch (frequency) {
    case 'daily':
      daysToAdd = 1
      break
    case 'weekly':
      daysToAdd = 7
      break
    case 'biweekly':
      daysToAdd = 14
      break
    case 'monthly':
      daysToAdd = 30
      break
  }

  const nextDate = new Date(lastDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
  return nextDate.toISOString().split('T')[0]
}

/**
 * Check if a legislation entry should trigger notification
 * @param entryDate - Entry date (ISO string)
 * @param config - Legislation module configuration
 * @returns true if notification should be sent
 */
export function shouldNotifyNewLegislation(
  entryDate: string,
  config: LegislationModuleConfig
): boolean {
  if (!config.notificationConfig.notifyOnNewLegislation) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const entry = new Date(entryDate)
  const daysSinceEntry = Math.ceil((today.getTime() - entry.getTime()) / (1000 * 60 * 60 * 24))

  return daysSinceEntry <= config.alertThresholds.newLegislationWarningDays
}

/**
 * Get enabled domains from configuration
 * @param config - Legislation module configuration
 * @returns Array of enabled domain names
 */
export function getEnabledDomains(config: LegislationModuleConfig): LegislationDomain[] {
  return config.monitoredDomains
    .filter(d => d.enabled)
    .map(d => d.domain)
}

/**
 * Get priority domains from configuration
 * @param config - Legislation module configuration
 * @param priority - Priority level to filter
 * @returns Array of domain names matching priority
 */
export function getDomainsByPriority(
  config: LegislationModuleConfig,
  priority: 'high' | 'medium' | 'low'
): LegislationDomain[] {
  return config.monitoredDomains
    .filter(d => d.enabled && d.priority === priority)
    .map(d => d.domain)
}

// ── Exports ──
export default legislationModule
