// lib/modules/alerts-module.ts
// OP-LEGO — Alerts Module
// Expiry monitoring, multi-channel notifications (email/push/SMS/WhatsApp), escalation rules, digest scheduling
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

// ── Alert Types ──
export type AlertType =
  | 'medical_expiring'              // Medical exam expiring soon
  | 'medical_expired'               // Medical exam expired
  | 'equipment_expiring'            // Equipment inspection expiring
  | 'equipment_expired'             // Equipment inspection expired
  | 'training_expiring'             // Training certificate expiring
  | 'training_expired'              // Training certificate expired
  | 'authorization_expiring'        // PSI/other authorization expiring
  | 'authorization_expired'         // Authorization expired
  | 'deadline_approaching'          // Legal obligation deadline approaching
  | 'deadline_missed'               // Legal obligation deadline missed
  | 'compliance_issue'              // General compliance issue
  | 'fraud_detected'                // Fraud detection alert
  | 'system_alert'                  // System/platform alert
  | 'custom'                        // Custom user-defined alert

export type AlertSeverity = 'info' | 'warning' | 'critical' | 'expired'
export type NotificationChannel = 'email' | 'push' | 'sms' | 'whatsapp' | 'in_app'
export type AlertStatus = 'pending' | 'sent' | 'acknowledged' | 'resolved' | 'dismissed' | 'escalated'
export type DigestFrequency = 'immediate' | 'hourly' | 'daily' | 'weekly' | 'monthly'
export type EscalationLevel = 1 | 2 | 3 | 4 | 5

// ── Alerts Module Configuration ──
export interface AlertsModuleConfig {
  // Active notification channels
  channels: {
    email: {
      enabled: boolean
      provider: 'supabase' | 'resend' | 'sendgrid' | 'ses'
      fromAddress: string
      fromName: string
      replyTo: string | null
      maxRecipientsPerAlert: number      // Default: 10
      batchSize: number                   // Default: 50
      rateLimit: {
        maxPerHour: number                // Default: 1000
        maxPerDay: number                 // Default: 10000
      }
    }
    push: {
      enabled: boolean
      provider: 'fcm' | 'apns' | 'web_push'
      allowBrowserNotifications: boolean
      allowMobileNotifications: boolean
      soundEnabled: boolean
      badgeEnabled: boolean
    }
    sms: {
      enabled: boolean
      provider: 'twilio' | 'vonage' | 'aws_sns' | 'custom'
      maxRecipientsPerAlert: number      // Default: 5
      maxLengthChars: number              // Default: 160
      allowInternational: boolean
      rateLimit: {
        maxPerHour: number                // Default: 100
        maxPerDay: number                 // Default: 500
      }
      costPerSms: number                  // Cost tracking
    }
    whatsapp: {
      enabled: boolean
      provider: 'twilio' | 'vonage' | 'meta' | 'custom'
      businessAccountId: string | null
      templateIds: Record<AlertType, string>  // Pre-approved template IDs
      allowMedia: boolean                 // Allow images/documents
      maxRecipientsPerAlert: number      // Default: 5
      rateLimit: {
        maxPerHour: number                // Default: 200
        maxPerDay: number                 // Default: 1000
      }
    }
    in_app: {
      enabled: boolean
      showBadge: boolean
      playSound: boolean
      persistDays: number                 // Default: 30 days
      maxStoredPerUser: number            // Default: 100
    }
  }

  // Alert thresholds (in days before expiry)
  thresholds: {
    medical: {
      info: number                        // Default: 60 days
      warning: number                     // Default: 30 days
      critical: number                    // Default: 15 days
      expired: number                     // Default: 0 days
    }
    equipment: {
      info: number                        // Default: 45 days
      warning: number                     // Default: 30 days
      critical: number                    // Default: 15 days
      expired: number                     // Default: 0 days
    }
    training: {
      info: number                        // Default: 45 days
      warning: number                     // Default: 30 days
      critical: number                    // Default: 15 days
      expired: number                     // Default: 0 days
    }
    authorization: {
      info: number                        // Default: 60 days
      warning: number                     // Default: 45 days
      critical: number                    // Default: 30 days
      expired: number                     // Default: 0 days
    }
    deadline: {
      info: number                        // Default: 30 days
      warning: number                     // Default: 14 days
      critical: number                    // Default: 7 days
      expired: number                     // Default: 0 days
    }
  }

  // Escalation rules
  escalation: {
    enabled: boolean
    levels: {
      level: EscalationLevel
      delayDays: number                   // Days after initial alert
      channels: NotificationChannel[]     // Channels to use at this level
      recipients: 'owner' | 'admin' | 'consultant' | 'all'
      requiresAcknowledgement: boolean
      autoResolveIfAcked: boolean
    }[]
    maxEscalationLevel: EscalationLevel   // Default: 3
    stopOnAcknowledgement: boolean        // Stop escalation if acknowledged
    stopOnResolution: boolean             // Stop escalation if resolved
  }

  // Digest scheduling
  digest: {
    enabled: boolean
    frequency: DigestFrequency
    defaultFrequency: DigestFrequency     // Default: 'daily'
    allowUserPreference: boolean          // Users can choose their digest frequency
    deliveryTime: string                  // HH:MM format, e.g., "09:00"
    timezone: string                      // Default: "Europe/Bucharest"
    includeSummary: boolean               // Include summary stats
    groupByType: boolean                  // Group alerts by type
    groupBySeverity: boolean              // Group alerts by severity
    maxAlertsPerDigest: number            // Default: 100
    channels: NotificationChannel[]       // Channels for digest delivery
  }

  // Custom alert rules
  customRules: {
    enabled: boolean
    maxRulesPerOrg: number                // Default: 20
    allowedTriggers: AlertTrigger[]
    allowedConditions: AlertCondition[]
    allowedActions: AlertAction[]
    allowScheduledRules: boolean          // Rules that run on schedule
    allowEventBasedRules: boolean         // Rules that run on events
  }

  // Notification preferences
  preferences: {
    allowUserOverrides: boolean           // Users can override org settings
    defaultChannels: NotificationChannel[] // Default channels for alerts
    quietHours: {
      enabled: boolean
      start: string                       // HH:MM format, e.g., "22:00"
      end: string                         // HH:MM format, e.g., "07:00"
      exceptCritical: boolean             // Send critical alerts during quiet hours
    }
    doNotDisturb: {
      enabled: boolean
      allowedSeverities: AlertSeverity[]  // Severities allowed during DND
    }
  }

  // Alert deduplication
  deduplication: {
    enabled: boolean
    windowMinutes: number                 // Default: 60 minutes
    mergeIdenticalAlerts: boolean         // Merge identical alerts within window
    maxDuplicatesBeforeSuppression: number // Default: 3
  }

  // Delivery tracking
  tracking: {
    trackEmailOpens: boolean
    trackEmailClicks: boolean
    trackPushOpens: boolean
    trackSmsDelivery: boolean
    trackWhatsappDelivery: boolean
    trackAcknowledgements: boolean
    trackTimeToAcknowledge: boolean
    trackTimeToResolve: boolean
    retentionDays: number                 // Default: 90 days
  }

  // Auto-resolution rules
  autoResolution: {
    enabled: boolean
    rules: {
      ruleType: 'expiry_renewed' | 'deadline_met' | 'compliance_restored' | 'custom'
      autoResolve: boolean
      notifyOnResolution: boolean
      channels: NotificationChannel[]
    }[]
  }

  // Alert routing
  routing: {
    enabled: boolean
    rules: {
      alertType: AlertType
      severity: AlertSeverity
      recipientRoles: string[]            // Roles to notify
      channels: NotificationChannel[]     // Channels to use
      escalateAfterDays: number | null
    }[]
  }

  // Rate limiting
  rateLimiting: {
    enabled: boolean
    globalLimits: {
      maxAlertsPerHour: number            // Default: 500
      maxAlertsPerDay: number             // Default: 5000
    }
    perUserLimits: {
      maxAlertsPerHour: number            // Default: 20
      maxAlertsPerDay: number             // Default: 100
    }
    perOrgLimits: {
      maxAlertsPerHour: number            // Default: 200
      maxAlertsPerDay: number             // Default: 2000
    }
  }

  // Templates
  templates: {
    email: {
      subjectPrefix: string               // Ex: "[S-S-M Alert]"
      includeLogo: boolean
      includeActionButtons: boolean
      includeUnsubscribeLink: boolean
      customTemplates: Record<AlertType, string>
    }
    sms: {
      includeOrgName: boolean
      includeActionLink: boolean
      customTemplates: Record<AlertType, string>
    }
    whatsapp: {
      useOfficialTemplates: boolean
      customTemplates: Record<AlertType, string>
    }
    push: {
      includeIcon: boolean
      includeActionButtons: boolean
      customTemplates: Record<AlertType, string>
    }
  }

  // Country-specific settings
  countrySpecific: {
    legalReferences: string[]             // Legal basis for alerts
    mandatoryAlerts: AlertType[]          // Legally required alerts
    alertAuthority: string | null         // Authority to notify
    dataRetentionDays: number             // GDPR compliance
    requiresConsent: boolean              // Explicit consent required
    consentTypes: NotificationChannel[]   // Channels requiring consent
  }
}

// ── Alert Trigger Types ──
export type AlertTrigger =
  | 'date_threshold'                      // Date approaching/passed
  | 'value_threshold'                     // Numeric value threshold
  | 'status_change'                       // Status changed
  | 'missing_data'                        // Required data missing
  | 'schedule'                            // Scheduled trigger
  | 'manual'                              // Manual trigger
  | 'api_event'                           // External API event

// ── Alert Condition Types ──
export type AlertCondition =
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'less_than'
  | 'contains'
  | 'not_contains'
  | 'is_null'
  | 'is_not_null'
  | 'in_list'
  | 'not_in_list'
  | 'matches_pattern'

// ── Alert Action Types ──
export type AlertAction =
  | 'send_notification'                   // Send notification
  | 'create_task'                         // Create follow-up task
  | 'send_webhook'                        // Send webhook
  | 'update_status'                       // Update record status
  | 'create_audit_log'                    // Create audit log entry
  | 'escalate'                            // Escalate to higher level
  | 'custom_script'                       // Run custom script

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
  description_en: 'Comprehensive alert system: expiry monitoring, multi-channel notifications (email/push/SMS/WhatsApp), escalation rules, digest scheduling',
  icon: 'Bell',
  category: 'core',
  is_base: false,
  depends_on: ['ssm-core'], // Requires SSM core data for monitoring
  incompatible: [], // Compatible with all modules

  /**
   * Returns default Alerts module configuration
   */
  getDefaultConfig(): AlertsModuleConfig {
    return {
      channels: {
        email: {
          enabled: true,
          provider: 'supabase',
          fromAddress: 'alerte@s-s-m.ro',
          fromName: 'S-S-M.RO Alerte',
          replyTo: null,
          maxRecipientsPerAlert: 10,
          batchSize: 50,
          rateLimit: {
            maxPerHour: 1000,
            maxPerDay: 10000,
          },
        },
        push: {
          enabled: true,
          provider: 'fcm',
          allowBrowserNotifications: true,
          allowMobileNotifications: true,
          soundEnabled: true,
          badgeEnabled: true,
        },
        sms: {
          enabled: false,
          provider: 'twilio',
          maxRecipientsPerAlert: 5,
          maxLengthChars: 160,
          allowInternational: false,
          rateLimit: {
            maxPerHour: 100,
            maxPerDay: 500,
          },
          costPerSms: 0.05,
        },
        whatsapp: {
          enabled: false,
          provider: 'twilio',
          businessAccountId: null,
          templateIds: {} as Record<AlertType, string>,
          allowMedia: true,
          maxRecipientsPerAlert: 5,
          rateLimit: {
            maxPerHour: 200,
            maxPerDay: 1000,
          },
        },
        in_app: {
          enabled: true,
          showBadge: true,
          playSound: true,
          persistDays: 30,
          maxStoredPerUser: 100,
        },
      },

      thresholds: {
        medical: {
          info: 60,
          warning: 30,
          critical: 15,
          expired: 0,
        },
        equipment: {
          info: 45,
          warning: 30,
          critical: 15,
          expired: 0,
        },
        training: {
          info: 45,
          warning: 30,
          critical: 15,
          expired: 0,
        },
        authorization: {
          info: 60,
          warning: 45,
          critical: 30,
          expired: 0,
        },
        deadline: {
          info: 30,
          warning: 14,
          critical: 7,
          expired: 0,
        },
      },

      escalation: {
        enabled: true,
        levels: [
          {
            level: 1,
            delayDays: 0,
            channels: ['email', 'in_app'],
            recipients: 'admin',
            requiresAcknowledgement: false,
            autoResolveIfAcked: false,
          },
          {
            level: 2,
            delayDays: 3,
            channels: ['email', 'push', 'in_app'],
            recipients: 'admin',
            requiresAcknowledgement: true,
            autoResolveIfAcked: false,
          },
          {
            level: 3,
            delayDays: 7,
            channels: ['email', 'push', 'sms', 'in_app'],
            recipients: 'consultant',
            requiresAcknowledgement: true,
            autoResolveIfAcked: false,
          },
        ],
        maxEscalationLevel: 3,
        stopOnAcknowledgement: true,
        stopOnResolution: true,
      },

      digest: {
        enabled: true,
        frequency: 'daily',
        defaultFrequency: 'daily',
        allowUserPreference: true,
        deliveryTime: '09:00',
        timezone: 'Europe/Bucharest',
        includeSummary: true,
        groupByType: true,
        groupBySeverity: true,
        maxAlertsPerDigest: 100,
        channels: ['email'],
      },

      customRules: {
        enabled: true,
        maxRulesPerOrg: 20,
        allowedTriggers: [
          'date_threshold',
          'value_threshold',
          'status_change',
          'missing_data',
          'schedule',
        ],
        allowedConditions: [
          'equals',
          'not_equals',
          'greater_than',
          'less_than',
          'is_null',
          'is_not_null',
        ],
        allowedActions: [
          'send_notification',
          'create_task',
          'update_status',
          'create_audit_log',
          'escalate',
        ],
        allowScheduledRules: true,
        allowEventBasedRules: true,
      },

      preferences: {
        allowUserOverrides: true,
        defaultChannels: ['email', 'in_app'],
        quietHours: {
          enabled: true,
          start: '22:00',
          end: '07:00',
          exceptCritical: true,
        },
        doNotDisturb: {
          enabled: false,
          allowedSeverities: ['critical', 'expired'],
        },
      },

      deduplication: {
        enabled: true,
        windowMinutes: 60,
        mergeIdenticalAlerts: true,
        maxDuplicatesBeforeSuppression: 3,
      },

      tracking: {
        trackEmailOpens: true,
        trackEmailClicks: true,
        trackPushOpens: true,
        trackSmsDelivery: true,
        trackWhatsappDelivery: true,
        trackAcknowledgements: true,
        trackTimeToAcknowledge: true,
        trackTimeToResolve: true,
        retentionDays: 90,
      },

      autoResolution: {
        enabled: true,
        rules: [
          {
            ruleType: 'expiry_renewed',
            autoResolve: true,
            notifyOnResolution: true,
            channels: ['email', 'in_app'],
          },
          {
            ruleType: 'deadline_met',
            autoResolve: true,
            notifyOnResolution: true,
            channels: ['in_app'],
          },
          {
            ruleType: 'compliance_restored',
            autoResolve: true,
            notifyOnResolution: true,
            channels: ['email', 'in_app'],
          },
        ],
      },

      routing: {
        enabled: true,
        rules: [
          {
            alertType: 'medical_expired',
            severity: 'expired',
            recipientRoles: ['consultant', 'firma_admin'],
            channels: ['email', 'push', 'in_app'],
            escalateAfterDays: 3,
          },
          {
            alertType: 'equipment_expired',
            severity: 'expired',
            recipientRoles: ['consultant', 'firma_admin'],
            channels: ['email', 'in_app'],
            escalateAfterDays: 7,
          },
          {
            alertType: 'fraud_detected',
            severity: 'critical',
            recipientRoles: ['consultant'],
            channels: ['email', 'push', 'sms'],
            escalateAfterDays: null,
          },
        ],
      },

      rateLimiting: {
        enabled: true,
        globalLimits: {
          maxAlertsPerHour: 500,
          maxAlertsPerDay: 5000,
        },
        perUserLimits: {
          maxAlertsPerHour: 20,
          maxAlertsPerDay: 100,
        },
        perOrgLimits: {
          maxAlertsPerHour: 200,
          maxAlertsPerDay: 2000,
        },
      },

      templates: {
        email: {
          subjectPrefix: '[S-S-M Alertă]',
          includeLogo: true,
          includeActionButtons: true,
          includeUnsubscribeLink: true,
          customTemplates: {} as Record<AlertType, string>,
        },
        sms: {
          includeOrgName: true,
          includeActionLink: true,
          customTemplates: {} as Record<AlertType, string>,
        },
        whatsapp: {
          useOfficialTemplates: true,
          customTemplates: {} as Record<AlertType, string>,
        },
        push: {
          includeIcon: true,
          includeActionButtons: true,
          customTemplates: {} as Record<AlertType, string>,
        },
      },

      countrySpecific: {
        legalReferences: [
          'Legea 319/2006 - Securitatea și sănătatea în muncă',
          'Legea 307/2006 - Apărarea împotriva incendiilor',
          'GDPR - Regulamentul (UE) 2016/679',
        ],
        mandatoryAlerts: [
          'medical_expired',
          'equipment_expired',
          'authorization_expired',
        ],
        alertAuthority: 'Inspectoratul Teritorial de Muncă',
        dataRetentionDays: 365,
        requiresConsent: true,
        consentTypes: ['sms', 'whatsapp', 'push'],
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

    // Validate channels
    if (!config.channels || typeof config.channels !== 'object') return false
    const channels = config.channels

    // Validate email channel
    if (channels.email) {
      if (
        typeof channels.email.enabled !== 'boolean' ||
        !channels.email.provider ||
        !channels.email.fromAddress ||
        typeof channels.email.maxRecipientsPerAlert !== 'number' ||
        channels.email.maxRecipientsPerAlert <= 0
      ) {
        return false
      }
    }

    // Validate push channel
    if (channels.push) {
      if (
        typeof channels.push.enabled !== 'boolean' ||
        !channels.push.provider ||
        typeof channels.push.allowBrowserNotifications !== 'boolean'
      ) {
        return false
      }
    }

    // Validate thresholds
    if (!config.thresholds || typeof config.thresholds !== 'object') return false
    for (const [key, thresholds] of Object.entries(config.thresholds)) {
      if (typeof thresholds !== 'object') return false
      const t = thresholds as any
      if (
        typeof t.info !== 'number' ||
        typeof t.warning !== 'number' ||
        typeof t.critical !== 'number' ||
        t.info < t.warning ||
        t.warning < t.critical ||
        t.critical < 0
      ) {
        return false
      }
    }

    // Validate escalation
    if (!config.escalation || typeof config.escalation !== 'object') return false
    const escalation = config.escalation
    if (
      typeof escalation.enabled !== 'boolean' ||
      !Array.isArray(escalation.levels) ||
      typeof escalation.maxEscalationLevel !== 'number' ||
      escalation.maxEscalationLevel < 1 ||
      escalation.maxEscalationLevel > 5
    ) {
      return false
    }

    // Validate escalation levels
    for (const level of escalation.levels) {
      if (
        typeof level.level !== 'number' ||
        typeof level.delayDays !== 'number' ||
        !Array.isArray(level.channels) ||
        level.delayDays < 0
      ) {
        return false
      }
    }

    // Validate digest
    if (!config.digest || typeof config.digest !== 'object') return false
    const digest = config.digest
    if (
      typeof digest.enabled !== 'boolean' ||
      !digest.frequency ||
      !digest.deliveryTime ||
      typeof digest.maxAlertsPerDigest !== 'number' ||
      digest.maxAlertsPerDigest <= 0
    ) {
      return false
    }

    // Validate custom rules
    if (!config.customRules || typeof config.customRules !== 'object') return false
    const customRules = config.customRules
    if (
      typeof customRules.enabled !== 'boolean' ||
      typeof customRules.maxRulesPerOrg !== 'number' ||
      !Array.isArray(customRules.allowedTriggers) ||
      customRules.maxRulesPerOrg <= 0
    ) {
      return false
    }

    // Validate preferences
    if (!config.preferences || typeof config.preferences !== 'object') return false
    const prefs = config.preferences
    if (
      typeof prefs.allowUserOverrides !== 'boolean' ||
      !Array.isArray(prefs.defaultChannels) ||
      !prefs.quietHours ||
      typeof prefs.quietHours !== 'object'
    ) {
      return false
    }

    // Validate deduplication
    if (!config.deduplication || typeof config.deduplication !== 'object') return false
    const dedup = config.deduplication
    if (
      typeof dedup.enabled !== 'boolean' ||
      typeof dedup.windowMinutes !== 'number' ||
      dedup.windowMinutes <= 0
    ) {
      return false
    }

    // Validate tracking
    if (!config.tracking || typeof config.tracking !== 'object') return false
    const tracking = config.tracking
    if (
      typeof tracking.trackEmailOpens !== 'boolean' ||
      typeof tracking.trackAcknowledgements !== 'boolean' ||
      typeof tracking.retentionDays !== 'number' ||
      tracking.retentionDays <= 0
    ) {
      return false
    }

    // Validate auto-resolution
    if (!config.autoResolution || typeof config.autoResolution !== 'object') return false
    if (
      typeof config.autoResolution.enabled !== 'boolean' ||
      !Array.isArray(config.autoResolution.rules)
    ) {
      return false
    }

    // Validate routing
    if (!config.routing || typeof config.routing !== 'object') return false
    if (
      typeof config.routing.enabled !== 'boolean' ||
      !Array.isArray(config.routing.rules)
    ) {
      return false
    }

    // Validate rate limiting
    if (!config.rateLimiting || typeof config.rateLimiting !== 'object') return false
    const rateLimiting = config.rateLimiting
    if (
      typeof rateLimiting.enabled !== 'boolean' ||
      !rateLimiting.globalLimits ||
      typeof rateLimiting.globalLimits.maxAlertsPerHour !== 'number' ||
      rateLimiting.globalLimits.maxAlertsPerHour <= 0
    ) {
      return false
    }

    // Validate templates
    if (!config.templates || typeof config.templates !== 'object') return false
    const templates = config.templates
    if (
      !templates.email ||
      !templates.sms ||
      !templates.whatsapp ||
      !templates.push
    ) {
      return false
    }

    // Validate country specific
    if (!config.countrySpecific || typeof config.countrySpecific !== 'object') return false
    const country = config.countrySpecific
    if (
      !Array.isArray(country.legalReferences) ||
      !Array.isArray(country.mandatoryAlerts) ||
      typeof country.dataRetentionDays !== 'number' ||
      country.dataRetentionDays <= 0
    ) {
      return false
    }

    return true
  },
}

// ── Alert Instance Interfaces ──

/**
 * Alert instance (stored in database)
 */
export interface Alert {
  id: string
  organization_id: string
  alert_type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  reference_type: 'medical' | 'equipment' | 'training' | 'authorization' | 'deadline' | 'other' | null
  reference_id: string | null
  status: AlertStatus
  escalation_level: EscalationLevel | null
  acknowledged_by: string | null
  acknowledged_at: string | null
  resolved_by: string | null
  resolved_at: string | null
  dismissed_by: string | null
  dismissed_at: string | null
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  expires_at: string | null
}

/**
 * Alert notification delivery log
 */
export interface AlertNotification {
  id: string
  alert_id: string
  recipient_id: string
  recipient_email: string | null
  recipient_phone: string | null
  channel: NotificationChannel
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'opened' | 'clicked'
  sent_at: string | null
  delivered_at: string | null
  opened_at: string | null
  clicked_at: string | null
  failed_at: string | null
  failure_reason: string | null
  provider_message_id: string | null
  metadata: Record<string, any>
  created_at: string
}

/**
 * Custom alert rule definition
 */
export interface CustomAlertRule {
  id: string
  organization_id: string
  rule_name: string
  description: string | null
  is_active: boolean
  trigger: AlertTrigger
  trigger_config: Record<string, any>
  conditions: {
    field: string
    condition: AlertCondition
    value: any
  }[]
  actions: {
    action: AlertAction
    config: Record<string, any>
  }[]
  schedule: string | null              // Cron expression for scheduled rules
  last_run_at: string | null
  next_run_at: string | null
  created_by: string
  created_at: string
  updated_at: string
}

/**
 * Alert digest schedule (per user)
 */
export interface AlertDigestSchedule {
  id: string
  user_id: string
  organization_id: string
  frequency: DigestFrequency
  delivery_time: string                // HH:MM format
  channels: NotificationChannel[]
  alert_types: AlertType[]             // Alert types to include
  min_severity: AlertSeverity          // Minimum severity to include
  is_active: boolean
  last_sent_at: string | null
  next_send_at: string | null
  created_at: string
  updated_at: string
}

// ── Helper Functions ──

/**
 * Calculate alert severity based on days until expiry and thresholds
 * @param daysUntilExpiry - Days until expiry (negative if expired)
 * @param thresholds - Threshold configuration for alert type
 * @returns Alert severity
 */
export function calculateAlertSeverity(
  daysUntilExpiry: number,
  thresholds: { info: number; warning: number; critical: number; expired: number }
): AlertSeverity {
  if (daysUntilExpiry <= thresholds.expired) return 'expired'
  if (daysUntilExpiry <= thresholds.critical) return 'critical'
  if (daysUntilExpiry <= thresholds.warning) return 'warning'
  if (daysUntilExpiry <= thresholds.info) return 'info'
  return 'info'
}

/**
 * Get notification channels for alert based on severity and config
 * @param severity - Alert severity
 * @param config - Alerts module configuration
 * @returns Array of channels to use
 */
export function getChannelsForSeverity(
  severity: AlertSeverity,
  config: AlertsModuleConfig
): NotificationChannel[] {
  const channels: NotificationChannel[] = []

  if (config.channels.email.enabled) channels.push('email')
  if (config.channels.in_app.enabled) channels.push('in_app')

  if (severity === 'critical' || severity === 'expired') {
    if (config.channels.push.enabled) channels.push('push')
    if (config.channels.sms.enabled) channels.push('sms')
  }

  return channels
}

/**
 * Check if alert should be sent during quiet hours
 * @param severity - Alert severity
 * @param config - Alerts module configuration
 * @returns true if alert should be sent
 */
export function shouldSendDuringQuietHours(
  severity: AlertSeverity,
  config: AlertsModuleConfig
): boolean {
  if (!config.preferences.quietHours.enabled) return true
  if (config.preferences.quietHours.exceptCritical) {
    return severity === 'critical' || severity === 'expired'
  }
  return false
}

/**
 * Format alert message for specific channel
 * @param alert - Alert instance
 * @param channel - Notification channel
 * @param config - Alerts module configuration
 * @returns Formatted message
 */
export function formatAlertMessage(
  alert: Alert,
  channel: NotificationChannel,
  config: AlertsModuleConfig
): string {
  // Check for custom template
  const templates = config.templates[channel === 'email' ? 'email' : channel === 'sms' ? 'sms' : channel === 'whatsapp' ? 'whatsapp' : 'push']
  const customTemplate = templates.customTemplates?.[alert.alert_type]

  if (customTemplate) {
    // Use custom template with variable substitution
    return customTemplate
      .replace('{title}', alert.title)
      .replace('{message}', alert.message)
      .replace('{severity}', alert.severity)
  }

  // Default formatting based on channel
  switch (channel) {
    case 'sms':
      return `${config.templates.sms.includeOrgName ? '[S-S-M] ' : ''}${alert.title}: ${alert.message.substring(0, 100)}`
    case 'push':
      return alert.message
    case 'email':
    case 'whatsapp':
    case 'in_app':
    default:
      return alert.message
  }
}

/**
 * Get escalation level for alert based on days since creation
 * @param alert - Alert instance
 * @param config - Alerts module configuration
 * @returns Escalation level (or null if no escalation needed)
 */
export function getEscalationLevel(
  alert: Alert,
  config: AlertsModuleConfig
): EscalationLevel | null {
  if (!config.escalation.enabled) return null
  if (alert.status === 'resolved' && config.escalation.stopOnResolution) return null
  if (alert.status === 'acknowledged' && config.escalation.stopOnAcknowledgement) return null

  const daysSinceCreation = Math.floor(
    (Date.now() - new Date(alert.created_at).getTime()) / (1000 * 60 * 60 * 24)
  )

  for (let i = config.escalation.levels.length - 1; i >= 0; i--) {
    const level = config.escalation.levels[i]
    if (daysSinceCreation >= level.delayDays) {
      return level.level
    }
  }

  return null
}

// ── Exports ──
export default alertsModule
