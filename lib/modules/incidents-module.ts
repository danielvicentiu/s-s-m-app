// lib/modules/incidents-module.ts
// OP-LEGO — Incidents Module
// Accident reporting, near-miss tracking, investigation workflow, root cause analysis, corrective actions, ITM notification
// Data: 13 Februarie 2026

import type { ModuleKey, CountryModuleConfig } from './types'
import type { CountryCode } from '@/lib/types'

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
  getDefaultConfig: () => IncidentsModuleConfig
  validateConfig: (config: any) => boolean
}

// ── Incident Types ──
export type IncidentType =
  | 'accident_work'           // Accident de muncă
  | 'accident_commute'        // Accident în deplasare
  | 'near_miss'               // Near-miss / Aproape accident
  | 'dangerous_occurrence'    // Situație periculoasă
  | 'occupational_disease'    // Boală profesională
  | 'property_damage'         // Deteriorare echipament/proprietate
  | 'environmental'           // Incident mediu
  | 'security'                // Incident securitate
  | 'other'                   // Altele

export type IncidentSeverity =
  | 'minor'                   // Minor: fără absență
  | 'first_aid'               // Prim ajutor
  | 'medical_treatment'       // Tratament medical
  | 'lost_time'               // Accident cu pierdere zile lucru
  | 'permanent_disability'    | 'fatal'                   // Fatal
  | 'potential_serious'       // Near-miss cu potențial grav

export type InvestigationStatus =
  | 'pending'                 // Așteptare investigație
  | 'in_progress'             // În investigație
  | 'completed'               // Finalizat
  | 'requires_action'         // Necesită acțiuni corective
  | 'closed'                  // Închis

export type RootCauseCategory =
  | 'human_error'             // Eroare umană
  | 'equipment_failure'       // Defecțiune echipament
  | 'procedure_inadequate'    // Procedură inadecvată
  | 'training_insufficient'   // Instruire insuficientă
  | 'supervision_lack'        // Lipsă supraveghere
  | 'ppe_inadequate'          // EIP inadecvat
  | 'environmental_hazard'    // Pericol din mediu
  | 'organizational'          // Cauză organizațională
  | 'multiple_causes'         // Cauze multiple

export type CorrectiveActionType =
  | 'immediate'               // Acțiune imediată (izolare pericol)
  | 'short_term'              // Termen scurt (< 30 zile)
  | 'long_term'               // Termen lung (> 30 zile)
  | 'preventive'              // Preventiv

export type NotificationAuthority =
  | 'ITM'                     // Inspectoratul Teritorial de Muncă
  | 'police'                  // Poliție
  | 'prosecutor'              // Parchet
  | 'health_authority'        // Autoritate sănătate publică
  | 'environmental_authority' // Autoritate mediu
  | 'none'                    // Fără notificare obligatorie

// ── Incidents Module Configuration ──
export interface IncidentsModuleConfig {
  // Reporting configuration
  reportingConfig: {
    enableAnonymousReporting: boolean           // Anonymous near-miss reporting
    enableMobileReporting: boolean              // Mobile app reporting
    enablePhotoUpload: boolean                  // Photo evidence upload
    enableWitnessStatements: boolean            // Witness statements
    requireImmediateNotification: boolean       // Immediate notification for serious incidents
    enableGeotagging: boolean                   // GPS location capture
  }

  // Near-miss tracking
  nearMissConfig: {
    enableNearMissTracking: boolean             // Enable near-miss module
    requireRiskAssessment: boolean              // Require risk assessment for near-miss
    anonymousReportingOnly: boolean             // Force anonymous reporting
    incentivizeReporting: boolean               // Incentive program for reporting
    minimumSeverityToTrack: IncidentSeverity    // Minimum severity to track
  }

  // Investigation workflow
  investigationConfig: {
    autoAssignInvestigator: boolean             // Auto-assign based on severity
    investigatorRoles: string[]                 // User roles that can investigate
    deadlineDays: {
      minor: number                             // Days to investigate minor incidents
      moderate: number                          // Days to investigate moderate incidents
      serious: number                           // Days to investigate serious incidents
      fatal: number                             // Days to investigate fatal incidents
    }
    requireWitnessInterviews: boolean           // Mandatory witness interviews
    requirePhotographicEvidence: boolean        // Mandatory photos
    require5WhyAnalysis: boolean                // 5 Whys root cause analysis
    requireFishboneDiagram: boolean             // Ishikawa diagram
    requireTimelineReconstruction: boolean      // Event timeline
  }

  // Root cause analysis
  rootCauseConfig: {
    enableMultipleRootCauses: boolean           // Allow multiple root causes
    requireContributingFactors: boolean         // Track contributing factors
    useSwissCheeseModel: boolean                // Swiss cheese model analysis
    minimumCausesToIdentify: number             // Min root causes to identify
    requireValidationByManager: boolean         // Manager must validate analysis
  }

  // Corrective actions
  correctiveActionsConfig: {
    requireCorrectiveActions: boolean           // Mandatory corrective actions
    requirePreventiveActions: boolean           // Preventive actions
    trackActionEffectiveness: boolean           // Track if actions prevented recurrence
    requireResponsiblePerson: boolean           // Assign responsible person
    requireDeadline: boolean                    // Mandatory deadline
    requireEvidenceOfCompletion: boolean        // Evidence upload (photos, docs)
    escalateOverdueActions: boolean             // Auto-escalate overdue actions
    escalationDaysAfterDeadline: number         // Days after deadline to escalate
  }

  // Authority notification
  notificationConfig: {
    autoNotifyAuthorities: boolean              // Auto-send to ITM based on rules
    notificationDeadlineHours: number           // Hours to notify (default: 24h)
    requireManagerApproval: boolean             // Manager approval before sending
    notificationTemplate: string                // Template ID for notification
    authorities: {
      authority: NotificationAuthority
      enabled: boolean
      whenToNotify: IncidentSeverity[]          // Trigger severities
      contactEmail: string | null
      contactPhone: string | null
    }[]
  }

  // Statistics & analytics
  statisticsConfig: {
    calculateIncidentRate: boolean              // LTIFR, TRIFR calculations
    trackTrendsByDepartment: boolean            // Department trends
    trackTrendsByLocation: boolean              // Location trends
    trackTrendsByShift: boolean                 // Shift trends
    generateMonthlyReports: boolean             // Auto-generate monthly reports
    benchmarkAgainstIndustry: boolean           // Industry benchmarking
  }

  // Alert thresholds
  alertThresholds: {
    nearMissClusterDays: number                 // Days to detect near-miss clusters
    nearMissClusterCount: number                // Min incidents to trigger cluster alert
    incidentRateThreshold: number               // LTIFR threshold to alert
    investigationOverdueDays: number            // Days overdue to escalate
    correctiveActionOverdueDays: number         // Days overdue for corrective action
  }

  // Country-specific settings
  countrySpecific: {
    legalReferences: string[]                   // Legal framework references
    competentAuthority: string                  // ITM or equivalent
    authorityUrl: string | null
    emergencyNumber: string                     // 112 or local emergency
    notificationDeadline: number                // Hours to notify authorities
    fatalIncidentProtocol: string               // Special protocol for fatal accidents
    mandatoryDocuments: string[]                // Required documentation
  }
}

// ── Incidents Module Definition ──
export const incidentsModule: IModule = {
  key: 'near_miss',  // Using existing module key from types.ts
  name_en: 'Incidents & Near-Miss',
  name_localized: {
    ro: 'Incidente și Aproape Accidente',
    bg: 'Инциденти и близки аварии',
    hu: 'Balesetek és majdnem balesetek',
    de: 'Vorfälle und Beinahe-Unfälle',
    pl: 'Wypadki i zdarzenia potencjalnie wypadkowe',
    en: 'Incidents & Near-Miss',
  },
  description_en: 'Accident reporting, near-miss tracking, investigation workflow, root cause analysis, corrective actions, and authority notification',
  icon: 'AlertTriangle',
  category: 'core',
  is_base: false,
  depends_on: ['ssm'], // Depends on SSM core module
  incompatible: [], // Compatible with all modules

  /**
   * Returns default Incidents module configuration
   */
  getDefaultConfig(): IncidentsModuleConfig {
    return {
      reportingConfig: {
        enableAnonymousReporting: true,
        enableMobileReporting: true,
        enablePhotoUpload: true,
        enableWitnessStatements: true,
        requireImmediateNotification: true,
        enableGeotagging: false,
      },

      nearMissConfig: {
        enableNearMissTracking: true,
        requireRiskAssessment: true,
        anonymousReportingOnly: false,
        incentivizeReporting: true,
        minimumSeverityToTrack: 'potential_serious',
      },

      investigationConfig: {
        autoAssignInvestigator: true,
        investigatorRoles: ['consultant', 'ssm_manager', 'safety_officer'],
        deadlineDays: {
          minor: 7,
          moderate: 5,
          serious: 3,
          fatal: 1,
        },
        requireWitnessInterviews: true,
        requirePhotographicEvidence: true,
        require5WhyAnalysis: true,
        requireFishboneDiagram: false,
        requireTimelineReconstruction: true,
      },

      rootCauseConfig: {
        enableMultipleRootCauses: true,
        requireContributingFactors: true,
        useSwissCheeseModel: false,
        minimumCausesToIdentify: 1,
        requireValidationByManager: true,
      },

      correctiveActionsConfig: {
        requireCorrectiveActions: true,
        requirePreventiveActions: true,
        trackActionEffectiveness: true,
        requireResponsiblePerson: true,
        requireDeadline: true,
        requireEvidenceOfCompletion: true,
        escalateOverdueActions: true,
        escalationDaysAfterDeadline: 7,
      },

      notificationConfig: {
        autoNotifyAuthorities: false,
        notificationDeadlineHours: 24,
        requireManagerApproval: true,
        notificationTemplate: 'itm_accident_notification',
        authorities: [
          {
            authority: 'ITM',
            enabled: true,
            whenToNotify: ['lost_time', 'permanent_disability', 'fatal'],
            contactEmail: null,
            contactPhone: null,
          },
          {
            authority: 'police',
            enabled: false,
            whenToNotify: ['fatal'],
            contactEmail: null,
            contactPhone: null,
          },
          {
            authority: 'prosecutor',
            enabled: false,
            whenToNotify: ['fatal'],
            contactEmail: null,
            contactPhone: null,
          },
        ],
      },

      statisticsConfig: {
        calculateIncidentRate: true,
        trackTrendsByDepartment: true,
        trackTrendsByLocation: true,
        trackTrendsByShift: false,
        generateMonthlyReports: true,
        benchmarkAgainstIndustry: false,
      },

      alertThresholds: {
        nearMissClusterDays: 30,
        nearMissClusterCount: 3,
        incidentRateThreshold: 5.0,
        investigationOverdueDays: 3,
        correctiveActionOverdueDays: 7,
      },

      countrySpecific: {
        legalReferences: [
          'Legea nr. 319/2006 - Securitate și sănătate în muncă',
          'HG nr. 1425/2006 - Normele metodologice de aplicare',
        ],
        competentAuthority: 'Inspectoratul Teritorial de Muncă (ITM)',
        authorityUrl: 'https://www.inspectiamuncii.ro',
        emergencyNumber: '112',
        notificationDeadline: 24,
        fatalIncidentProtocol: 'Notify ITM, Police, Prosecutor within 24h. Preserve accident scene.',
        mandatoryDocuments: [
          'Declarație accident de muncă',
          'Proces verbal de cercetare',
          'Fișa de investigație',
          'Plan acțiuni corective',
          'Registru de evidență accidente',
        ],
      },
    }
  },

  /**
   * Validates Incidents module configuration
   * @param config - Configuration object to validate
   * @returns true if valid, false otherwise
   */
  validateConfig(config: any): boolean {
    if (!config || typeof config !== 'object') return false

    // Validate reportingConfig
    if (!config.reportingConfig) return false
    const reporting = config.reportingConfig
    if (
      typeof reporting.enableAnonymousReporting !== 'boolean' ||
      typeof reporting.enableMobileReporting !== 'boolean' ||
      typeof reporting.enablePhotoUpload !== 'boolean' ||
      typeof reporting.enableWitnessStatements !== 'boolean' ||
      typeof reporting.requireImmediateNotification !== 'boolean' ||
      typeof reporting.enableGeotagging !== 'boolean'
    ) {
      return false
    }

    // Validate nearMissConfig
    if (!config.nearMissConfig) return false
    const nearMiss = config.nearMissConfig
    const validSeverities = [
      'minor', 'first_aid', 'medical_treatment', 'lost_time',
      'permanent_disability', 'fatal', 'potential_serious'
    ]
    if (
      typeof nearMiss.enableNearMissTracking !== 'boolean' ||
      typeof nearMiss.requireRiskAssessment !== 'boolean' ||
      typeof nearMiss.anonymousReportingOnly !== 'boolean' ||
      typeof nearMiss.incentivizeReporting !== 'boolean' ||
      !validSeverities.includes(nearMiss.minimumSeverityToTrack)
    ) {
      return false
    }

    // Validate investigationConfig
    if (!config.investigationConfig) return false
    const investigation = config.investigationConfig
    if (
      typeof investigation.autoAssignInvestigator !== 'boolean' ||
      !Array.isArray(investigation.investigatorRoles) ||
      !investigation.deadlineDays ||
      typeof investigation.deadlineDays.minor !== 'number' ||
      typeof investigation.deadlineDays.moderate !== 'number' ||
      typeof investigation.deadlineDays.serious !== 'number' ||
      typeof investigation.deadlineDays.fatal !== 'number' ||
      investigation.deadlineDays.minor <= 0 ||
      investigation.deadlineDays.moderate <= 0 ||
      investigation.deadlineDays.serious <= 0 ||
      investigation.deadlineDays.fatal <= 0
    ) {
      return false
    }

    // Validate rootCauseConfig
    if (!config.rootCauseConfig) return false
    const rootCause = config.rootCauseConfig
    if (
      typeof rootCause.enableMultipleRootCauses !== 'boolean' ||
      typeof rootCause.requireContributingFactors !== 'boolean' ||
      typeof rootCause.useSwissCheeseModel !== 'boolean' ||
      typeof rootCause.minimumCausesToIdentify !== 'number' ||
      rootCause.minimumCausesToIdentify < 0 ||
      typeof rootCause.requireValidationByManager !== 'boolean'
    ) {
      return false
    }

    // Validate correctiveActionsConfig
    if (!config.correctiveActionsConfig) return false
    const actions = config.correctiveActionsConfig
    if (
      typeof actions.requireCorrectiveActions !== 'boolean' ||
      typeof actions.requirePreventiveActions !== 'boolean' ||
      typeof actions.trackActionEffectiveness !== 'boolean' ||
      typeof actions.requireResponsiblePerson !== 'boolean' ||
      typeof actions.requireDeadline !== 'boolean' ||
      typeof actions.requireEvidenceOfCompletion !== 'boolean' ||
      typeof actions.escalateOverdueActions !== 'boolean' ||
      typeof actions.escalationDaysAfterDeadline !== 'number' ||
      actions.escalationDaysAfterDeadline <= 0
    ) {
      return false
    }

    // Validate notificationConfig
    if (!config.notificationConfig) return false
    const notification = config.notificationConfig
    if (
      typeof notification.autoNotifyAuthorities !== 'boolean' ||
      typeof notification.notificationDeadlineHours !== 'number' ||
      notification.notificationDeadlineHours <= 0 ||
      typeof notification.requireManagerApproval !== 'boolean' ||
      typeof notification.notificationTemplate !== 'string' ||
      !Array.isArray(notification.authorities)
    ) {
      return false
    }

    // Validate authorities array
    const validAuthorities = ['ITM', 'police', 'prosecutor', 'health_authority', 'environmental_authority', 'none']
    for (const auth of notification.authorities) {
      if (
        !validAuthorities.includes(auth.authority) ||
        typeof auth.enabled !== 'boolean' ||
        !Array.isArray(auth.whenToNotify)
      ) {
        return false
      }
    }

    // Validate statisticsConfig
    if (!config.statisticsConfig) return false
    const stats = config.statisticsConfig
    if (
      typeof stats.calculateIncidentRate !== 'boolean' ||
      typeof stats.trackTrendsByDepartment !== 'boolean' ||
      typeof stats.trackTrendsByLocation !== 'boolean' ||
      typeof stats.trackTrendsByShift !== 'boolean' ||
      typeof stats.generateMonthlyReports !== 'boolean' ||
      typeof stats.benchmarkAgainstIndustry !== 'boolean'
    ) {
      return false
    }

    // Validate alertThresholds
    if (!config.alertThresholds) return false
    const thresholds = config.alertThresholds
    if (
      typeof thresholds.nearMissClusterDays !== 'number' ||
      typeof thresholds.nearMissClusterCount !== 'number' ||
      typeof thresholds.incidentRateThreshold !== 'number' ||
      typeof thresholds.investigationOverdueDays !== 'number' ||
      typeof thresholds.correctiveActionOverdueDays !== 'number' ||
      thresholds.nearMissClusterDays <= 0 ||
      thresholds.nearMissClusterCount <= 0 ||
      thresholds.incidentRateThreshold <= 0 ||
      thresholds.investigationOverdueDays <= 0 ||
      thresholds.correctiveActionOverdueDays <= 0
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
      typeof country.notificationDeadline !== 'number' ||
      country.notificationDeadline <= 0 ||
      !country.fatalIncidentProtocol ||
      !Array.isArray(country.mandatoryDocuments)
    ) {
      return false
    }

    return true
  },
}

// ── Country-Specific Incidents Configurations ──

/**
 * Romania Incidents configuration
 */
export function getRomaniaIncidentsConfig(): Partial<IncidentsModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Legea nr. 319/2006 - Securitate și sănătate în muncă',
        'HG nr. 1425/2006 - Normele metodologice de aplicare',
        'Ordinul nr. 1030/2007 - Cercetarea accidentelor de muncă',
      ],
      competentAuthority: 'Inspectoratul Teritorial de Muncă (ITM)',
      authorityUrl: 'https://www.inspectiamuncii.ro',
      emergencyNumber: '112',
      notificationDeadline: 24,
      fatalIncidentProtocol: 'Notificare ITM, Poliție, Parchet în max 24h. Conservare loc accident. Oprire activitate până la finalizare anchetă.',
      mandatoryDocuments: [
        'Declarație accident de muncă (formular oficial)',
        'Proces verbal de cercetare',
        'Fișa de investigație internă',
        'Plan măsuri corective și preventive',
        'Registru de evidență accidente de muncă',
        'Declarație statistică (trimestrial)',
      ],
    },
  }
}

/**
 * Bulgaria Incidents configuration
 */
export function getBulgariaIncidentsConfig(): Partial<IncidentsModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Закон за здравословни и безопасни условия на труд',
        'Наредба за разследване и регистриране на трудовите злополуки',
      ],
      competentAuthority: 'Изпълнителна агенция "Главна инспекция по труда"',
      authorityUrl: 'https://www.gli.government.bg',
      emergencyNumber: '112',
      notificationDeadline: 24,
      fatalIncidentProtocol: 'Незабавно уведомяване на ГИТ и полиция. Запазване на местопроизшествието.',
      mandatoryDocuments: [
        'Декларация за трудова злополука',
        'Протокол от разследване',
        'Вътрешен доклад',
        'План за коригиращи действия',
        'Регистър на трудовите злополуки',
      ],
    },
  }
}

/**
 * Hungary Incidents configuration
 */
export function getHungaryIncidentsConfig(): Partial<IncidentsModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        '1993. évi XCIII. törvény a munkavédelemről',
        '5/1993. (XII. 26.) MüM rendelet - Munkabalesetek nyilvántartása',
      ],
      competentAuthority: 'Országos Munkavédelmi és Munkaügyi Főfelügyelőség (OMMF)',
      authorityUrl: 'https://www.ommf.gov.hu',
      emergencyNumber: '112',
      notificationDeadline: 24,
      fatalIncidentProtocol: 'Azonnali értesítés OMMF, rendőrség. Baleset helyszínének biztosítása.',
      mandatoryDocuments: [
        'Munkabaleset-bejelentő lap',
        'Kivizsgálási jegyzőkönyv',
        'Belső vizsgálati jelentés',
        'Megelőző intézkedések terve',
        'Munkabaleseti nyilvántartás',
      ],
    },
  }
}

/**
 * Germany Incidents configuration
 */
export function getGermanyIncidentsConfig(): Partial<IncidentsModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Sozialgesetzbuch VII (SGB VII)',
        'DGUV Vorschrift 1 - Grundsätze der Prävention',
        'Unfallverhütungsvorschrift (UVV)',
      ],
      competentAuthority: 'Berufsgenossenschaft / Unfallversicherungsträger',
      authorityUrl: null,
      emergencyNumber: '112',
      notificationDeadline: 72,  // 3 days for notification to BG
      fatalIncidentProtocol: 'Sofortige Meldung an BG und Gewerbeaufsicht. Unfallstelle sichern. Polizei bei Todesfall.',
      mandatoryDocuments: [
        'Unfallanzeige (Formular)',
        'Unfallbericht',
        'Interne Untersuchung',
        'Maßnahmenplan',
        'Verbandbuch',
        'Unfallregister',
      ],
    },
  }
}

/**
 * Poland Incidents configuration
 */
export function getPolandIncidentsConfig(): Partial<IncidentsModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Ustawa z dnia 26 czerwca 1974 r. - Kodeks pracy',
        'Rozporządzenie w sprawie wypadków przy pracy',
      ],
      competentAuthority: 'Państwowa Inspekcja Pracy (PIP)',
      authorityUrl: 'https://www.pip.gov.pl',
      emergencyNumber: '112',
      notificationDeadline: 24,
      fatalIncidentProtocol: 'Natychmiastowe powiadomienie PIP i prokuratury. Zabezpieczenie miejsca wypadku.',
      mandatoryDocuments: [
        'Karta wypadku przy pracy',
        'Protokół powypadkowy',
        'Wewnętrzne dochodzenie',
        'Plan działań naprawczych',
        'Rejestr wypadków przy pracy',
      ],
    },
  }
}

// ── Helper Functions ──

/**
 * Get Incidents configuration for a specific country
 * @param countryCode - Country code (RO, BG, HU, DE, PL)
 * @returns Merged configuration with country-specific settings
 */
export function getIncidentsConfigForCountry(countryCode: CountryCode): IncidentsModuleConfig {
  const baseConfig = incidentsModule.getDefaultConfig()

  let countrySpecific: Partial<IncidentsModuleConfig> | undefined

  switch (countryCode) {
    case 'RO':
      countrySpecific = getRomaniaIncidentsConfig()
      break
    case 'BG':
      countrySpecific = getBulgariaIncidentsConfig()
      break
    case 'HU':
      countrySpecific = getHungaryIncidentsConfig()
      break
    case 'DE':
      countrySpecific = getGermanyIncidentsConfig()
      break
    case 'PL':
      countrySpecific = getPolandIncidentsConfig()
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
 * Calculate investigation deadline based on severity
 * @param incidentDate - Incident date (ISO string)
 * @param severity - Incident severity
 * @param config - Incidents module configuration
 * @returns Investigation deadline date (ISO string)
 */
export function calculateInvestigationDeadline(
  incidentDate: string,
  severity: IncidentSeverity,
  config: IncidentsModuleConfig
): string {
  const incident = new Date(incidentDate)

  let deadlineDays: number
  switch (severity) {
    case 'fatal':
    case 'permanent_disability':
      deadlineDays = config.investigationConfig.deadlineDays.fatal
      break
    case 'lost_time':
    case 'medical_treatment':
      deadlineDays = config.investigationConfig.deadlineDays.serious
      break
    case 'first_aid':
      deadlineDays = config.investigationConfig.deadlineDays.moderate
      break
    default:
      deadlineDays = config.investigationConfig.deadlineDays.minor
  }

  const deadline = new Date(incident.getTime() + deadlineDays * 24 * 60 * 60 * 1000)
  return deadline.toISOString().split('T')[0]
}

/**
 * Calculate authority notification deadline
 * @param incidentDate - Incident date (ISO string)
 * @param config - Incidents module configuration
 * @returns Notification deadline date (ISO string with time)
 */
export function calculateNotificationDeadline(
  incidentDate: string,
  config: IncidentsModuleConfig
): string {
  const incident = new Date(incidentDate)
  const deadlineHours = config.notificationConfig.notificationDeadlineHours
  const deadline = new Date(incident.getTime() + deadlineHours * 60 * 60 * 1000)
  return deadline.toISOString()
}

/**
 * Check if incident requires authority notification
 * @param severity - Incident severity
 * @param config - Incidents module configuration
 * @returns true if notification required
 */
export function requiresAuthorityNotification(
  severity: IncidentSeverity,
  config: IncidentsModuleConfig
): boolean {
  const itmAuthority = config.notificationConfig.authorities.find(
    a => a.authority === 'ITM' && a.enabled
  )

  if (!itmAuthority) return false

  return itmAuthority.whenToNotify.includes(severity)
}

/**
 * Calculate incident rate (LTIFR - Lost Time Injury Frequency Rate)
 * @param incidentsCount - Number of lost-time incidents
 * @param totalHoursWorked - Total hours worked
 * @returns LTIFR (per 1,000,000 hours)
 */
export function calculateLTIFR(incidentsCount: number, totalHoursWorked: number): number {
  if (totalHoursWorked === 0) return 0
  return (incidentsCount * 1000000) / totalHoursWorked
}

/**
 * Calculate TRIFR (Total Recordable Injury Frequency Rate)
 * @param recordableIncidents - Number of recordable incidents
 * @param totalHoursWorked - Total hours worked
 * @returns TRIFR (per 1,000,000 hours)
 */
export function calculateTRIFR(recordableIncidents: number, totalHoursWorked: number): number {
  if (totalHoursWorked === 0) return 0
  return (recordableIncidents * 1000000) / totalHoursWorked
}

/**
 * Check if there's a near-miss cluster (multiple incidents in short time)
 * @param incidentDates - Array of incident dates (ISO strings)
 * @param config - Incidents module configuration
 * @returns true if cluster detected
 */
export function detectNearMissCluster(
  incidentDates: string[],
  config: IncidentsModuleConfig
): boolean {
  if (incidentDates.length < config.alertThresholds.nearMissClusterCount) {
    return false
  }

  const dates = incidentDates.map(d => new Date(d).getTime()).sort()
  const clusterWindowMs = config.alertThresholds.nearMissClusterDays * 24 * 60 * 60 * 1000

  // Check if we have enough incidents within the cluster window
  for (let i = 0; i <= dates.length - config.alertThresholds.nearMissClusterCount; i++) {
    const windowStart = dates[i]
    const windowEnd = dates[i + config.alertThresholds.nearMissClusterCount - 1]

    if (windowEnd - windowStart <= clusterWindowMs) {
      return true
    }
  }

  return false
}

/**
 * Get incident severity label localized
 * @param severity - Incident severity
 * @param locale - Locale code
 * @returns Localized severity label
 */
export function getIncidentSeverityLabel(
  severity: IncidentSeverity,
  locale: string = 'ro'
): string {
  const labels: Record<string, Record<IncidentSeverity, string>> = {
    ro: {
      minor: 'Minor',
      first_aid: 'Prim ajutor',
      medical_treatment: 'Tratament medical',
      lost_time: 'Cu zile pierdute',
      permanent_disability: 'Invaliditate',
      fatal: 'Fatal',
      potential_serious: 'Potențial grav',
    },
    en: {
      minor: 'Minor',
      first_aid: 'First Aid',
      medical_treatment: 'Medical Treatment',
      lost_time: 'Lost Time',
      permanent_disability: 'Permanent Disability',
      fatal: 'Fatal',
      potential_serious: 'Potentially Serious',
    },
  }

  return labels[locale]?.[severity] || labels['en'][severity]
}

// ── Exports ──
export default incidentsModule
