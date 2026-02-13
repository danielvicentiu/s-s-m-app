// lib/modules/alerts-module.ts
// OP-LEGO — Alerts Module
// Multi-channel notification system: expiry monitoring, escalation rules, digest scheduling, custom alert rules
// Data: 13 Februarie 2026

import type { ModuleKey } from './types'

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
  getDefaultConfig: () => AlertsModuleConfig
  validateConfig: (config: any) => boolean
}

// ── Notification Channels ──
export type NotificationChannel = 'email' | 'push' | 'sms' | 'whatsapp'
export type AlertPriority = 'info' | 'warning' | 'critical' | 'urgent'
export type AlertCategory =
  | 'medical_exam_expiry'
  | 'training_expiry'
  | 'equipment_inspection'
  | 'document_expiry'
  | 'compliance_score'
  | 'legislation_update'
  | 'custom'

// ── Alert Rule Configuration ──
export interface AlertRule {
  id: string
  name: string
  category: AlertCategory
  isActive: boolean
  priority: AlertPriority
  triggerConditions: {
    daysBeforeExpiry?: number          // Days before expiration
    complianceScoreBelow?: number      // Trigger if score below threshold
    customCondition?: string           // Custom SQL/logic condition
  }
  channels: NotificationChannel[]      // Channels to use for this rule
  recipients: {
    includeOrgAdmins: boolean          // Send to org admins
    includeConsultants: boolean        // Send to assigned consultants
    includeEmployees: boolean          // Send to affected employees
    customEmails: string[]             // Additional email addresses
    customPhones: string[]             // Additional phone numbers
  }
  escalation?: {
    enabled: boolean
    escalateAfterDays: number          // Days to wait before escalation
    escalatePriority: AlertPriority    // New priority after escalation
    escalateChannels: NotificationChannel[]  // Additional channels for escalation
    escalateRecipients: string[]       // Additional recipients for escalation
  }
}

// ── Channel Configuration ──
export interface ChannelConfig {
  channel: NotificationChannel
  isEnabled: boolean
  priority: number                     // 1 = highest, used for fallback order
  provider?: string                    // Ex: 'resend', 'twilio', 'vonage'
  rateLimits: {
    maxPerHour: number
    maxPerDay: number
    cooldownMinutes: number            // Minimum time between same alerts
  }
  retryPolicy: {
    maxRetries: number
    retryDelaySeconds: number[]        // Exponential backoff: [30, 60, 120, 300]
    fallbackChannel?: NotificationChannel  // Fallback if all retries fail
  }
  templates: {
    subject?: string                   // Email/SMS subject template
    body: string                       // Message body template
    variables: string[]                // Available template variables
  }
}

// ── Digest Configuration ──
export interface DigestConfig {
  enabled: boolean
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  dayOfWeek?: number                   // 0-6 for weekly/biweekly (0 = Sunday)
  dayOfMonth?: number                  // 1-31 for monthly
  time: string                         // HH:MM format (24h)
  timezone: string                     // Ex: 'Europe/Bucharest'
  channels: NotificationChannel[]
  includeCategories: AlertCategory[]
  minPriority: AlertPriority           // Minimum priority to include
  groupBy: 'category' | 'priority' | 'organization'
  maxItemsPerDigest: number
}

// ── Alerts Module Configuration ──
export interface AlertsModuleConfig {
  // General alert settings
  generalSettings: {
    enableAlerts: boolean              // Master switch for all alerts
    defaultChannels: NotificationChannel[]  // Default channels for new rules
    defaultTimezone: string            // Default timezone for scheduling
    alertRetentionDays: number         // Days to keep alert logs
    allowUserPreferences: boolean      // Allow users to customize their preferences
  }

  // Channel configurations
  channels: {
    email: ChannelConfig
    push: ChannelConfig
    sms: ChannelConfig
    whatsapp: ChannelConfig
  }

  // Alert rules
  alertRules: AlertRule[]

  // Digest settings
  digestSettings: DigestConfig

  // Expiry monitoring thresholds
  expiryThresholds: {
    // Medical exams
    medicalExamWarningDays: number     // Default: 30 days
    medicalExamCriticalDays: number    // Default: 15 days
    medicalExamUrgentDays: number      // Default: 7 days

    // Trainings
    trainingWarningDays: number        // Default: 30 days
    trainingCriticalDays: number       // Default: 15 days
    trainingUrgentDays: number         // Default: 7 days

    // Equipment inspections
    equipmentWarningDays: number       // Default: 30 days
    equipmentCriticalDays: number      // Default: 15 days
    equipmentUrgentDays: number        // Default: 7 days

    // Documents
    documentWarningDays: number        // Default: 30 days
    documentCriticalDays: number       // Default: 15 days
    documentUrgentDays: number         // Default: 7 days
  }

  // Escalation rules
  escalationRules: {
    enableAutoEscalation: boolean
    escalationLevels: {
      level: number                    // 1, 2, 3
      afterDays: number                // Days overdue before this level
      priority: AlertPriority
      additionalChannels: NotificationChannel[]
      notifyManagement: boolean        // Escalate to upper management
    }[]
  }

  // Custom alert rules engine
  customRules: {
    enableCustomRules: boolean
    rules: {
      id: string
      name: string
      description: string
      sqlCondition: string             // SQL WHERE clause condition
      checkFrequency: 'hourly' | 'daily' | 'weekly'
      priority: AlertPriority
      channels: NotificationChannel[]
      messageTemplate: string
    }[]
  }

  // Quiet hours (do not disturb)
  quietHours: {
    enabled: boolean
    startTime: string                  // HH:MM format
    endTime: string                    // HH:MM format
    timezone: string
    allowUrgentAlerts: boolean         // Allow urgent alerts during quiet hours
    exemptDays: number[]               // Days of week to exempt (0-6)
  }

  // Smart notifications
  smartNotifications: {
    enableSmartBatching: boolean       // Batch similar alerts together
    batchWindowMinutes: number         // Time window for batching
    enableDeduplication: boolean       // Prevent duplicate alerts
    deduplicationWindowHours: number   // Deduplication time window
    enablePredictiveAlerts: boolean    // Predict future issues
    predictionHorizonDays: number      // Days ahead to predict
  }

  // Country-specific settings
  countrySpecific: {
    legalReferences: string[]          // Legal acts references
    competentAuthority: string         // Ex: 'Inspecția Muncii'
    authorityUrl: string | null
    emergencyNumber: string            // Ex: '112'
    mandatoryAlerts: AlertCategory[]   // Legally required alerts
    mandatoryChannels: NotificationChannel[]  // Legally required channels
    dataRetentionYears: number         // Legal data retention period
  }
}

// ── Alerts Module Definition ──
export const alertsModule: IModule = {
  key: 'alerte',
  name_en: 'Alerts & Notifications',
  name_localized: {
    ro: 'Alerte și Notificări',
    bg: 'Сигнали и уведомления',
    hu: 'Riasztások és értesítések',
    de: 'Warnungen und Benachrichtigungen',
    pl: 'Alerty i powiadomienia',
    en: 'Alerts & Notifications',
  },
  description_en: 'Multi-channel alert system: expiry monitoring, escalation rules, digest scheduling, custom alert rules (email, SMS, WhatsApp, push)',
  icon: 'Bell',
  category: 'core',
  is_base: false,
  depends_on: ['ssm-core'], // Depends on SSM Core for monitoring entities
  incompatible: [],

  /**
   * Returns default Alerts module configuration
   */
  getDefaultConfig(): AlertsModuleConfig {
    return {
      generalSettings: {
        enableAlerts: true,
        defaultChannels: ['email'],
        defaultTimezone: 'Europe/Bucharest',
        alertRetentionDays: 365,
        allowUserPreferences: true,
      },

      channels: {
        email: {
          channel: 'email',
          isEnabled: true,
          priority: 1,
          provider: 'resend',
          rateLimits: {
            maxPerHour: 100,
            maxPerDay: 500,
            cooldownMinutes: 15,
          },
          retryPolicy: {
            maxRetries: 3,
            retryDelaySeconds: [30, 120, 300],
            fallbackChannel: undefined,
          },
          templates: {
            subject: '[{priority}] {category} - {organization}',
            body: 'Bună ziua,\n\n{message}\n\n{details}\n\nCu respect,\nEchipa S-S-M.ro',
            variables: ['priority', 'category', 'organization', 'message', 'details', 'actionUrl'],
          },
        },
        push: {
          channel: 'push',
          isEnabled: false,
          priority: 2,
          rateLimits: {
            maxPerHour: 50,
            maxPerDay: 200,
            cooldownMinutes: 30,
          },
          retryPolicy: {
            maxRetries: 2,
            retryDelaySeconds: [60, 180],
            fallbackChannel: 'email',
          },
          templates: {
            subject: '{category}',
            body: '{message}',
            variables: ['category', 'message', 'actionUrl'],
          },
        },
        sms: {
          channel: 'sms',
          isEnabled: false,
          priority: 3,
          provider: 'twilio',
          rateLimits: {
            maxPerHour: 20,
            maxPerDay: 100,
            cooldownMinutes: 60,
          },
          retryPolicy: {
            maxRetries: 2,
            retryDelaySeconds: [120, 300],
            fallbackChannel: 'email',
          },
          templates: {
            body: '[{priority}] {category}: {message}. Detalii: {actionUrl}',
            variables: ['priority', 'category', 'message', 'actionUrl'],
          },
        },
        whatsapp: {
          channel: 'whatsapp',
          isEnabled: false,
          priority: 4,
          provider: 'twilio',
          rateLimits: {
            maxPerHour: 30,
            maxPerDay: 150,
            cooldownMinutes: 30,
          },
          retryPolicy: {
            maxRetries: 2,
            retryDelaySeconds: [60, 180],
            fallbackChannel: 'sms',
          },
          templates: {
            body: '🔔 *{category}*\n\n{message}\n\n{details}\n\n👉 {actionUrl}',
            variables: ['category', 'message', 'details', 'actionUrl'],
          },
        },
      },

      alertRules: [
        {
          id: 'medical-exam-30d',
          name: 'Control medical expiră în 30 zile',
          category: 'medical_exam_expiry',
          isActive: true,
          priority: 'warning',
          triggerConditions: {
            daysBeforeExpiry: 30,
          },
          channels: ['email'],
          recipients: {
            includeOrgAdmins: true,
            includeConsultants: true,
            includeEmployees: false,
            customEmails: [],
            customPhones: [],
          },
        },
        {
          id: 'medical-exam-15d',
          name: 'Control medical expiră în 15 zile',
          category: 'medical_exam_expiry',
          isActive: true,
          priority: 'critical',
          triggerConditions: {
            daysBeforeExpiry: 15,
          },
          channels: ['email', 'push'],
          recipients: {
            includeOrgAdmins: true,
            includeConsultants: true,
            includeEmployees: true,
            customEmails: [],
            customPhones: [],
          },
        },
        {
          id: 'medical-exam-7d',
          name: 'Control medical expiră în 7 zile',
          category: 'medical_exam_expiry',
          isActive: true,
          priority: 'urgent',
          triggerConditions: {
            daysBeforeExpiry: 7,
          },
          channels: ['email', 'push', 'sms'],
          recipients: {
            includeOrgAdmins: true,
            includeConsultants: true,
            includeEmployees: true,
            customEmails: [],
            customPhones: [],
          },
          escalation: {
            enabled: true,
            escalateAfterDays: 3,
            escalatePriority: 'urgent',
            escalateChannels: ['sms', 'whatsapp'],
            escalateRecipients: [],
          },
        },
        {
          id: 'training-30d',
          name: 'Instruire SSM expiră în 30 zile',
          category: 'training_expiry',
          isActive: true,
          priority: 'warning',
          triggerConditions: {
            daysBeforeExpiry: 30,
          },
          channels: ['email'],
          recipients: {
            includeOrgAdmins: true,
            includeConsultants: true,
            includeEmployees: false,
            customEmails: [],
            customPhones: [],
          },
        },
        {
          id: 'equipment-30d',
          name: 'Verificare echipament în 30 zile',
          category: 'equipment_inspection',
          isActive: true,
          priority: 'warning',
          triggerConditions: {
            daysBeforeExpiry: 30,
          },
          channels: ['email'],
          recipients: {
            includeOrgAdmins: true,
            includeConsultants: true,
            includeEmployees: false,
            customEmails: [],
            customPhones: [],
          },
        },
        {
          id: 'compliance-score-low',
          name: 'Scor conformitate scăzut',
          category: 'compliance_score',
          isActive: true,
          priority: 'critical',
          triggerConditions: {
            complianceScoreBelow: 75,
          },
          channels: ['email', 'push'],
          recipients: {
            includeOrgAdmins: true,
            includeConsultants: true,
            includeEmployees: false,
            customEmails: [],
            customPhones: [],
          },
        },
      ],

      digestSettings: {
        enabled: true,
        frequency: 'weekly',
        dayOfWeek: 1, // Monday
        time: '08:00',
        timezone: 'Europe/Bucharest',
        channels: ['email'],
        includeCategories: [
          'medical_exam_expiry',
          'training_expiry',
          'equipment_inspection',
          'document_expiry',
        ],
        minPriority: 'info',
        groupBy: 'category',
        maxItemsPerDigest: 50,
      },

      expiryThresholds: {
        medicalExamWarningDays: 30,
        medicalExamCriticalDays: 15,
        medicalExamUrgentDays: 7,
        trainingWarningDays: 30,
        trainingCriticalDays: 15,
        trainingUrgentDays: 7,
        equipmentWarningDays: 30,
        equipmentCriticalDays: 15,
        equipmentUrgentDays: 7,
        documentWarningDays: 30,
        documentCriticalDays: 15,
        documentUrgentDays: 7,
      },

      escalationRules: {
        enableAutoEscalation: true,
        escalationLevels: [
          {
            level: 1,
            afterDays: 7,
            priority: 'critical',
            additionalChannels: ['push'],
            notifyManagement: false,
          },
          {
            level: 2,
            afterDays: 14,
            priority: 'urgent',
            additionalChannels: ['push', 'sms'],
            notifyManagement: true,
          },
          {
            level: 3,
            afterDays: 21,
            priority: 'urgent',
            additionalChannels: ['push', 'sms', 'whatsapp'],
            notifyManagement: true,
          },
        ],
      },

      customRules: {
        enableCustomRules: false,
        rules: [],
      },

      quietHours: {
        enabled: true,
        startTime: '20:00',
        endTime: '08:00',
        timezone: 'Europe/Bucharest',
        allowUrgentAlerts: true,
        exemptDays: [0, 6], // Sunday, Saturday
      },

      smartNotifications: {
        enableSmartBatching: true,
        batchWindowMinutes: 60,
        enableDeduplication: true,
        deduplicationWindowHours: 24,
        enablePredictiveAlerts: false,
        predictionHorizonDays: 90,
      },

      countrySpecific: {
        legalReferences: [
          'Legea nr. 319/2006 privind sănătatea și securitatea în muncă',
          'GDPR - Regulamentul (UE) 2016/679',
        ],
        competentAuthority: 'Inspecția Muncii',
        authorityUrl: 'https://www.inspectiamuncii.ro',
        emergencyNumber: '112',
        mandatoryAlerts: ['medical_exam_expiry', 'training_expiry'],
        mandatoryChannels: ['email'],
        dataRetentionYears: 5,
      },
    }
  },

  /**
   * Validates Alerts module configuration
   * @param config - Configuration object to validate
   * @returns true if valid, false otherwise
   */
  validateConfig(config: any): boolean {
    if (!config || typeof config !== 'object') return false

    // Validate general settings
    if (!config.generalSettings) return false
    const general = config.generalSettings
    if (
      typeof general.enableAlerts !== 'boolean' ||
      !Array.isArray(general.defaultChannels) ||
      !general.defaultTimezone ||
      typeof general.alertRetentionDays !== 'number' ||
      general.alertRetentionDays < 0
    ) {
      return false
    }

    // Validate channels
    if (!config.channels) return false
    const requiredChannels: NotificationChannel[] = ['email', 'push', 'sms', 'whatsapp']
    for (const channelName of requiredChannels) {
      const channel = config.channels[channelName]
      if (!channel) return false
      if (
        typeof channel.isEnabled !== 'boolean' ||
        typeof channel.priority !== 'number' ||
        !channel.rateLimits ||
        !channel.retryPolicy ||
        !channel.templates
      ) {
        return false
      }
    }

    // Validate alert rules
    if (!Array.isArray(config.alertRules)) return false
    for (const rule of config.alertRules) {
      if (
        !rule.id ||
        !rule.name ||
        !rule.category ||
        typeof rule.isActive !== 'boolean' ||
        !rule.priority ||
        !Array.isArray(rule.channels) ||
        !rule.recipients
      ) {
        return false
      }
    }

    // Validate digest settings
    if (!config.digestSettings) return false
    const digest = config.digestSettings
    if (
      typeof digest.enabled !== 'boolean' ||
      !digest.frequency ||
      !digest.time ||
      !digest.timezone ||
      !Array.isArray(digest.channels) ||
      !Array.isArray(digest.includeCategories)
    ) {
      return false
    }

    // Validate expiry thresholds
    if (!config.expiryThresholds) return false
    const thresholds = config.expiryThresholds
    const requiredThresholds = [
      'medicalExamWarningDays',
      'medicalExamCriticalDays',
      'medicalExamUrgentDays',
      'trainingWarningDays',
      'trainingCriticalDays',
      'trainingUrgentDays',
      'equipmentWarningDays',
      'equipmentCriticalDays',
      'equipmentUrgentDays',
      'documentWarningDays',
      'documentCriticalDays',
      'documentUrgentDays',
    ]
    for (const threshold of requiredThresholds) {
      if (typeof thresholds[threshold] !== 'number' || thresholds[threshold] < 0) {
        return false
      }
    }

    // Validate escalation rules
    if (!config.escalationRules) return false
    const escalation = config.escalationRules
    if (
      typeof escalation.enableAutoEscalation !== 'boolean' ||
      !Array.isArray(escalation.escalationLevels)
    ) {
      return false
    }

    // Validate quiet hours
    if (!config.quietHours) return false
    const quiet = config.quietHours
    if (
      typeof quiet.enabled !== 'boolean' ||
      !quiet.startTime ||
      !quiet.endTime ||
      !quiet.timezone ||
      typeof quiet.allowUrgentAlerts !== 'boolean' ||
      !Array.isArray(quiet.exemptDays)
    ) {
      return false
    }

    // Validate smart notifications
    if (!config.smartNotifications) return false
    const smart = config.smartNotifications
    if (
      typeof smart.enableSmartBatching !== 'boolean' ||
      typeof smart.batchWindowMinutes !== 'number' ||
      typeof smart.enableDeduplication !== 'boolean' ||
      typeof smart.deduplicationWindowHours !== 'number' ||
      typeof smart.enablePredictiveAlerts !== 'boolean' ||
      typeof smart.predictionHorizonDays !== 'number'
    ) {
      return false
    }

    // Validate country specific
    if (!config.countrySpecific) return false
    const country = config.countrySpecific
    if (
      !Array.isArray(country.legalReferences) ||
      !country.competentAuthority ||
      !country.emergencyNumber ||
      !Array.isArray(country.mandatoryAlerts) ||
      !Array.isArray(country.mandatoryChannels) ||
      typeof country.dataRetentionYears !== 'number'
    ) {
      return false
    }

    return true
  },
}

// ── Country-Specific Alert Configurations ──

/**
 * Romania Alerts configuration
 */
export function getRomaniaAlertsConfig(): Partial<AlertsModuleConfig> {
  return {
    generalSettings: {
      enableAlerts: true,
      defaultChannels: ['email'],
      defaultTimezone: 'Europe/Bucharest',
      alertRetentionDays: 365,
      allowUserPreferences: true,
    },
    countrySpecific: {
      legalReferences: [
        'Legea nr. 319/2006 privind sănătatea și securitatea în muncă',
        'GDPR - Regulamentul (UE) 2016/679',
        'Legea nr. 53/2003 - Codul muncii',
      ],
      competentAuthority: 'Inspecția Muncii',
      authorityUrl: 'https://www.inspectiamuncii.ro',
      emergencyNumber: '112',
      mandatoryAlerts: ['medical_exam_expiry', 'training_expiry'],
      mandatoryChannels: ['email'],
      dataRetentionYears: 5,
    },
  }
}

/**
 * Bulgaria Alerts configuration
 */
export function getBulgariaAlertsConfig(): Partial<AlertsModuleConfig> {
  return {
    generalSettings: {
      enableAlerts: true,
      defaultChannels: ['email'],
      defaultTimezone: 'Europe/Sofia',
      alertRetentionDays: 365,
      allowUserPreferences: true,
    },
    countrySpecific: {
      legalReferences: [
        'Закон за здравословни и безопасни условия на труд (ЗЗБУТ)',
        'GDPR - Регламент (ЕС) 2016/679',
      ],
      competentAuthority: 'Изпълнителна агенция "Главна инспекция по труда"',
      authorityUrl: 'https://www.gli.government.bg',
      emergencyNumber: '112',
      mandatoryAlerts: ['medical_exam_expiry', 'training_expiry'],
      mandatoryChannels: ['email'],
      dataRetentionYears: 5,
    },
  }
}

/**
 * Hungary Alerts configuration
 */
export function getHungaryAlertsConfig(): Partial<AlertsModuleConfig> {
  return {
    generalSettings: {
      enableAlerts: true,
      defaultChannels: ['email'],
      defaultTimezone: 'Europe/Budapest',
      alertRetentionDays: 365,
      allowUserPreferences: true,
    },
    countrySpecific: {
      legalReferences: [
        'Munka törvénykönyve (2012. évi I. törvény)',
        'GDPR - (EU) 2016/679 rendelet',
      ],
      competentAuthority: 'Nemzeti Munkaügyi Hivatal',
      authorityUrl: 'https://www.munkaugy.hu',
      emergencyNumber: '112',
      mandatoryAlerts: ['medical_exam_expiry', 'training_expiry'],
      mandatoryChannels: ['email'],
      dataRetentionYears: 5,
    },
  }
}

/**
 * Germany Alerts configuration
 */
export function getGermanyAlertsConfig(): Partial<AlertsModuleConfig> {
  return {
    generalSettings: {
      enableAlerts: true,
      defaultChannels: ['email'],
      defaultTimezone: 'Europe/Berlin',
      alertRetentionDays: 730, // 2 years - German data retention
      allowUserPreferences: true,
    },
    countrySpecific: {
      legalReferences: [
        'Arbeitsschutzgesetz (ArbSchG)',
        'DSGVO - Verordnung (EU) 2016/679',
      ],
      competentAuthority: 'Gewerbeaufsichtsamt',
      authorityUrl: null,
      emergencyNumber: '112',
      mandatoryAlerts: ['medical_exam_expiry', 'training_expiry'],
      mandatoryChannels: ['email'],
      dataRetentionYears: 10, // German requirement
    },
  }
}

/**
 * Poland Alerts configuration
 */
export function getPolandAlertsConfig(): Partial<AlertsModuleConfig> {
  return {
    generalSettings: {
      enableAlerts: true,
      defaultChannels: ['email'],
      defaultTimezone: 'Europe/Warsaw',
      alertRetentionDays: 365,
      allowUserPreferences: true,
    },
    countrySpecific: {
      legalReferences: [
        'Kodeks pracy - dział X (BHP)',
        'RODO - Rozporządzenie (UE) 2016/679',
      ],
      competentAuthority: 'Państwowa Inspekcja Pracy',
      authorityUrl: 'https://www.pip.gov.pl',
      emergencyNumber: '112',
      mandatoryAlerts: ['medical_exam_expiry', 'training_expiry'],
      mandatoryChannels: ['email'],
      dataRetentionYears: 5,
    },
  }
}

// ── Helper Functions ──

/**
 * Get Alerts configuration for a specific country
 * @param countryCode - Country code (RO, BG, HU, DE, PL)
 * @returns Merged configuration with country-specific settings
 */
export function getAlertsConfigForCountry(countryCode: string): AlertsModuleConfig {
  const baseConfig = alertsModule.getDefaultConfig()

  let countrySpecific: Partial<AlertsModuleConfig> | undefined

  switch (countryCode) {
    case 'RO':
      countrySpecific = getRomaniaAlertsConfig()
      break
    case 'BG':
      countrySpecific = getBulgariaAlertsConfig()
      break
    case 'HU':
      countrySpecific = getHungaryAlertsConfig()
      break
    case 'DE':
      countrySpecific = getGermanyAlertsConfig()
      break
    case 'PL':
      countrySpecific = getPolandAlertsConfig()
      break
  }

  if (countrySpecific) {
    return {
      ...baseConfig,
      ...countrySpecific,
      generalSettings: {
        ...baseConfig.generalSettings,
        ...(countrySpecific.generalSettings || {}),
      },
      countrySpecific: {
        ...baseConfig.countrySpecific,
        ...countrySpecific.countrySpecific,
      },
    }
  }

  return baseConfig
}

/**
 * Determine alert priority based on days until expiry
 * @param daysUntilExpiry - Number of days until expiration
 * @param thresholds - Expiry thresholds configuration
 * @returns Alert priority
 */
export function calculateAlertPriority(
  daysUntilExpiry: number,
  thresholds: {
    warningDays: number
    criticalDays: number
    urgentDays: number
  }
): AlertPriority {
  if (daysUntilExpiry < 0) return 'urgent' // Already expired
  if (daysUntilExpiry <= thresholds.urgentDays) return 'urgent'
  if (daysUntilExpiry <= thresholds.criticalDays) return 'critical'
  if (daysUntilExpiry <= thresholds.warningDays) return 'warning'
  return 'info'
}

/**
 * Check if current time is within quiet hours
 * @param quietHours - Quiet hours configuration
 * @param currentTime - Current date/time (defaults to now)
 * @returns true if within quiet hours
 */
export function isWithinQuietHours(
  quietHours: AlertsModuleConfig['quietHours'],
  currentTime: Date = new Date()
): boolean {
  if (!quietHours.enabled) return false

  const dayOfWeek = currentTime.getDay()
  if (quietHours.exemptDays.includes(dayOfWeek)) return false

  const currentHour = currentTime.getHours()
  const currentMinute = currentTime.getMinutes()
  const currentTimeMinutes = currentHour * 60 + currentMinute

  const [startHour, startMinute] = quietHours.startTime.split(':').map(Number)
  const startTimeMinutes = startHour * 60 + startMinute

  const [endHour, endMinute] = quietHours.endTime.split(':').map(Number)
  const endTimeMinutes = endHour * 60 + endMinute

  // Handle overnight quiet hours (e.g., 20:00 - 08:00)
  if (startTimeMinutes > endTimeMinutes) {
    return currentTimeMinutes >= startTimeMinutes || currentTimeMinutes <= endTimeMinutes
  }

  return currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes
}

/**
 * Get appropriate channels for an alert based on priority and quiet hours
 * @param priority - Alert priority
 * @param configuredChannels - Configured channels for the alert
 * @param quietHours - Quiet hours configuration
 * @param currentTime - Current date/time (defaults to now)
 * @returns Array of channels to use
 */
export function getAlertChannels(
  priority: AlertPriority,
  configuredChannels: NotificationChannel[],
  quietHours: AlertsModuleConfig['quietHours'],
  currentTime: Date = new Date()
): NotificationChannel[] {
  const isQuietTime = isWithinQuietHours(quietHours, currentTime)

  if (!isQuietTime) {
    return configuredChannels
  }

  // During quiet hours, only allow urgent alerts if configured
  if (quietHours.allowUrgentAlerts && priority === 'urgent') {
    return configuredChannels
  }

  // During quiet hours, only use email for non-urgent alerts
  return configuredChannels.filter(channel => channel === 'email')
}

/**
 * Build alert message from template
 * @param template - Message template with variables
 * @param variables - Variable values to replace
 * @returns Rendered message
 */
export function renderAlertTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let rendered = template

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{${key}}`
    rendered = rendered.replace(new RegExp(placeholder, 'g'), value)
  }

  return rendered
}

// ── Exports ──
export default alertsModule
