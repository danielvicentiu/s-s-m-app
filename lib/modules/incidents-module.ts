// lib/modules/incidents-module.ts
// OP-LEGO — Incidents Module (Accidents, Near-miss, Investigation, ITM Notification)
// Accident reporting, near-miss tracking, investigation workflow, root cause analysis, corrective actions
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
  getDefaultConfig: () => IncidentsModuleConfig
  validateConfig: (config: any) => boolean
}

// ── Incident Types ──
export type IncidentType =
  | 'accident_fatal'           // Fatal accident
  | 'accident_serious'         // Serious injury (hospitalization, disability)
  | 'accident_minor'           // Minor injury (first aid)
  | 'near_miss'                // Near-miss event
  | 'property_damage'          // Property/equipment damage only
  | 'environmental'            // Environmental incident
  | 'security'                 // Security incident

export type IncidentSeverity =
  | 'critical'                 // Fatal or life-threatening
  | 'high'                     // Serious injury, significant damage
  | 'medium'                   // Minor injury, moderate damage
  | 'low'                      // Near-miss, no injury

export type IncidentStatus =
  | 'reported'                 // Initial report submitted
  | 'under_investigation'      // Investigation in progress
  | 'awaiting_corrective_actions' // Investigation complete, actions pending
  | 'corrective_actions_in_progress' // Actions being implemented
  | 'closed'                   // All actions completed
  | 'archived'                 // Archived for records

export type InjuryType =
  | 'laceration'               // Tăietură
  | 'fracture'                 // Fractură
  | 'burn'                     // Arsură
  | 'contusion'                // Contuzie
  | 'sprain_strain'            // Entorsă/Luxație
  | 'amputation'               // Amputație
  | 'head_injury'              // Traumatism cranian
  | 'back_injury'              // Traumatism spinal
  | 'chemical_exposure'        // Expunere chimică
  | 'electric_shock'           // Electrocutare
  | 'respiratory'              // Probleme respiratorii
  | 'other'                    // Altele

export type BodyPart =
  | 'head'
  | 'eyes'
  | 'ears'
  | 'neck'
  | 'chest'
  | 'back'
  | 'arms'
  | 'hands'
  | 'fingers'
  | 'legs'
  | 'feet'
  | 'multiple'
  | 'internal'

export type RootCauseCategory =
  | 'human_error'              // Eroare umană
  | 'inadequate_training'      // Instruire insuficientă
  | 'inadequate_supervision'   // Supraveghere insuficientă
  | 'equipment_failure'        // Defecțiune echipament
  | 'maintenance_failure'      // Lipsă întreținere
  | 'inadequate_ppe'           // EIP inadecvat
  | 'unsafe_conditions'        // Condiții nesigure
  | 'procedure_violation'      // Încălcare proceduri
  | 'inadequate_procedures'    // Proceduri inadecvate
  | 'environmental_factors'    // Factori de mediu
  | 'communication_failure'    // Comunicare defectuoasă
  | 'management_failure'       // Lipsă management
  | 'other'

export type CorrectiveActionStatus =
  | 'planned'                  // Planned
  | 'in_progress'              // In progress
  | 'completed'                // Completed
  | 'verified'                 // Verified effective
  | 'cancelled'                // Cancelled

export type CorrectiveActionType =
  | 'immediate'                // Immediate action (within 24h)
  | 'short_term'               // Short-term (within 1 week)
  | 'long_term'                // Long-term (>1 week)
  | 'preventive'               // Preventive measure

// ── Incidents Module Configuration ──
export interface IncidentsModuleConfig {
  // Incident Reporting Configuration
  reportingConfig: {
    enableNearMissReporting: boolean          // Enable near-miss reporting
    anonymousReportingAllowed: boolean        // Allow anonymous reports
    requireWitnessStatements: boolean         // Require witness statements
    requirePhotographicEvidence: boolean      // Photos required
    requireImmediateNotification: boolean     // Immediate notification to supervisor
    autoNotifyConsultant: boolean            // Auto-notify SSM consultant
    requiresMedicalEvaluation: boolean       // Medical evaluation required
  }

  // Investigation Configuration
  investigationConfig: {
    requiresFormalInvestigation: boolean     // All incidents require investigation
    investigationTimeframeDays: number       // Investigation must start within X days
    requiresRootCauseAnalysis: boolean       // Root cause analysis mandatory
    requires5WhyAnalysis: boolean            // 5-Why method required
    requiresFishboneDiagram: boolean         // Fishbone diagram required
    requiresInvestigationTeam: boolean       // Team investigation required
    minInvestigationTeamSize: number         // Min team members
    requiresExternalExpert: boolean          // External expert for serious incidents
  }

  // Incident Classification
  incidentClassification: {
    type: IncidentType
    name: string
    requiresITMNotification: boolean         // ITM notification required
    notificationTimeframeHours: number       // Notify ITM within X hours
    requiresFormalInvestigation: boolean     // Formal investigation required
    requiresCorrectiveActions: boolean       // Corrective actions mandatory
    workStoppage: boolean                    // Work must stop immediately
    autoSeverity: IncidentSeverity          // Auto-assigned severity
  }[]

  // ITM (Inspectoratul Teritorial de Muncă) Notification Requirements
  itmNotificationConfig: {
    enableITMNotification: boolean           // Enable ITM notification
    fatalAccidentNotificationHours: number   // Fatal: notify within X hours
    seriousAccidentNotificationHours: number // Serious: notify within X hours
    collectiveAccidentThreshold: number      // Collective if X+ employees affected
    collectiveNotificationHours: number      // Collective: notify within X hours
    requiresWrittenReport: boolean           // Written report required
    reportSubmissionDeadlineDays: number     // Submit report within X days
    requiresFollowUpReport: boolean          // Follow-up report required
    followUpReportDays: number               // Follow-up within X days
  }

  // Corrective Actions Configuration
  correctiveActionsConfig: {
    requiresCorrectiveActions: boolean       // All incidents require actions
    requiresResponsiblePerson: boolean       // Assign responsible person
    requiresDeadline: boolean                // Deadline required
    requiresVerification: boolean            // Verification required
    verificationByDifferentPerson: boolean   // Different person verifies
    requiresEffectivenessReview: boolean     // Review effectiveness after X days
    effectivenessReviewDays: number          // Review after X days
    escalateOverdueActions: boolean          // Escalate overdue actions
    escalationDays: number                   // Escalate after X days overdue
  }

  // Root Cause Analysis Configuration
  rootCauseConfig: {
    enableRootCauseAnalysis: boolean         // Enable root cause analysis
    requiresMultipleRootCauses: boolean      // Multiple causes can be identified
    requires5WhyMethod: boolean              // 5-Why method
    requiresFishbone: boolean                // Fishbone (Ishikawa) diagram
    requiresContributingFactors: boolean     // Identify contributing factors
    requiresSystemicAnalysis: boolean        // Analyze systemic issues
  }

  // Near-Miss Configuration
  nearMissConfig: {
    enableNearMissTracking: boolean          // Track near-miss events
    anonymousReportsAllowed: boolean         // Anonymous reporting
    requiresInvestigation: boolean           // Near-miss investigation
    rewardReporting: boolean                 // Reward program for reporting
    nearMissToAccidentRatio: number          // Target ratio (e.g., 10:1)
    trendAnalysisEnabled: boolean            // Trend analysis
    trendAnalysisIntervalDays: number        // Analyze trends every X days
  }

  // Documentation Requirements
  documentationConfig: {
    requiresIncidentReport: boolean          // Incident report mandatory
    requiresInvestigationReport: boolean     // Investigation report mandatory
    requiresWitnessStatements: boolean       // Witness statements
    requiresPhotos: boolean                  // Photos required
    requiresMedicalReports: boolean          // Medical reports
    requiresPoliceReport: boolean            // Police report (serious incidents)
    requiresITMReport: boolean               // ITM report
    retentionPeriodYears: number             // Document retention period
  }

  // Alert Thresholds
  alertThresholds: {
    highIncidentRateThreshold: number        // Alert if X incidents per month
    repeatedIncidentThreshold: number        // Alert if same type X times
    nearMissPatternThreshold: number         // Alert if X near-miss in same area
    overdueActionThreshold: number           // Alert if action overdue X days
    investigationOverdueThreshold: number    // Alert if investigation overdue X days
  }

  // Severity Matrix (auto-calculate severity)
  severityMatrix: {
    injuryLevel: 'fatal' | 'permanent_disability' | 'temporary_disability' | 'first_aid' | 'none'
    propertyDamage: 'catastrophic' | 'critical' | 'moderate' | 'minor' | 'none'
    resultingSeverity: IncidentSeverity
  }[]

  // Country-Specific Settings
  countrySpecific: {
    legalReferences: string[]                // Legal acts references
    competentAuthority: string               // Ex: 'ITM București'
    authorityUrl: string | null
    emergencyNumber: string                  // Ex: '112'
    itmNotificationMandatory: boolean        // ITM notification required by law
    itmContactEmail: string | null           // ITM email
    itmContactPhone: string | null           // ITM phone
    mandatoryDocuments: string[]             // Required documentation
    accidentRegisterRequired: boolean        // Accident register mandatory
    nearMissRegisterRequired: boolean        // Near-miss register mandatory
  }
}

// ── Incidents Module Definition ──
export const incidentsModule: IModule = {
  key: 'near_miss',
  name_en: 'Incidents & Near-Miss',
  name_localized: {
    ro: 'Incidente și Aproape-Accidente',
    bg: 'Инциденти и близки пропуски',
    hu: 'Balesetek és majdnem balesetek',
    de: 'Unfälle und Beinahe-Unfälle',
    pl: 'Wypadki i incydenty',
    en: 'Incidents & Near-Miss',
  },
  description_en: 'Accident reporting, near-miss tracking, investigation workflow, root cause analysis, corrective actions, ITM notification',
  icon: 'AlertTriangle',
  category: 'standalone',
  is_base: false,
  depends_on: ['ssm-core'], // Requires SSM Core for employee data
  incompatible: [], // Compatible with all modules

  /**
   * Returns default Incidents module configuration
   */
  getDefaultConfig(): IncidentsModuleConfig {
    return {
      reportingConfig: {
        enableNearMissReporting: true,
        anonymousReportingAllowed: true,
        requireWitnessStatements: true,
        requirePhotographicEvidence: false,
        requireImmediateNotification: true,
        autoNotifyConsultant: true,
        requiresMedicalEvaluation: true,
      },

      investigationConfig: {
        requiresFormalInvestigation: true,
        investigationTimeframeDays: 3,
        requiresRootCauseAnalysis: true,
        requires5WhyAnalysis: true,
        requiresFishboneDiagram: false,
        requiresInvestigationTeam: true,
        minInvestigationTeamSize: 2,
        requiresExternalExpert: false,
      },

      incidentClassification: [
        {
          type: 'accident_fatal',
          name: 'Accident mortal',
          requiresITMNotification: true,
          notificationTimeframeHours: 8,
          requiresFormalInvestigation: true,
          requiresCorrectiveActions: true,
          workStoppage: true,
          autoSeverity: 'critical',
        },
        {
          type: 'accident_serious',
          name: 'Accident grav (spitalizare, incapacitate)',
          requiresITMNotification: true,
          notificationTimeframeHours: 24,
          requiresFormalInvestigation: true,
          requiresCorrectiveActions: true,
          workStoppage: false,
          autoSeverity: 'high',
        },
        {
          type: 'accident_minor',
          name: 'Accident ușor (prim ajutor)',
          requiresITMNotification: false,
          notificationTimeframeHours: 0,
          requiresFormalInvestigation: false,
          requiresCorrectiveActions: true,
          workStoppage: false,
          autoSeverity: 'medium',
        },
        {
          type: 'near_miss',
          name: 'Aproape-accident (near-miss)',
          requiresITMNotification: false,
          notificationTimeframeHours: 0,
          requiresFormalInvestigation: false,
          requiresCorrectiveActions: true,
          workStoppage: false,
          autoSeverity: 'low',
        },
        {
          type: 'property_damage',
          name: 'Deteriorare echipament/proprietate',
          requiresITMNotification: false,
          notificationTimeframeHours: 0,
          requiresFormalInvestigation: false,
          requiresCorrectiveActions: true,
          workStoppage: false,
          autoSeverity: 'low',
        },
        {
          type: 'environmental',
          name: 'Incident de mediu',
          requiresITMNotification: false,
          notificationTimeframeHours: 0,
          requiresFormalInvestigation: true,
          requiresCorrectiveActions: true,
          workStoppage: false,
          autoSeverity: 'medium',
        },
        {
          type: 'security',
          name: 'Incident de securitate',
          requiresITMNotification: false,
          notificationTimeframeHours: 0,
          requiresFormalInvestigation: true,
          requiresCorrectiveActions: true,
          workStoppage: false,
          autoSeverity: 'medium',
        },
      ],

      itmNotificationConfig: {
        enableITMNotification: true,
        fatalAccidentNotificationHours: 8,
        seriousAccidentNotificationHours: 24,
        collectiveAccidentThreshold: 3,
        collectiveNotificationHours: 8,
        requiresWrittenReport: true,
        reportSubmissionDeadlineDays: 5,
        requiresFollowUpReport: true,
        followUpReportDays: 30,
      },

      correctiveActionsConfig: {
        requiresCorrectiveActions: true,
        requiresResponsiblePerson: true,
        requiresDeadline: true,
        requiresVerification: true,
        verificationByDifferentPerson: true,
        requiresEffectivenessReview: true,
        effectivenessReviewDays: 30,
        escalateOverdueActions: true,
        escalationDays: 7,
      },

      rootCauseConfig: {
        enableRootCauseAnalysis: true,
        requiresMultipleRootCauses: true,
        requires5WhyMethod: true,
        requiresFishbone: false,
        requiresContributingFactors: true,
        requiresSystemicAnalysis: true,
      },

      nearMissConfig: {
        enableNearMissTracking: true,
        anonymousReportsAllowed: true,
        requiresInvestigation: false,
        rewardReporting: true,
        nearMissToAccidentRatio: 10,
        trendAnalysisEnabled: true,
        trendAnalysisIntervalDays: 30,
      },

      documentationConfig: {
        requiresIncidentReport: true,
        requiresInvestigationReport: true,
        requiresWitnessStatements: true,
        requiresPhotos: true,
        requiresMedicalReports: true,
        requiresPoliceReport: false,
        requiresITMReport: true,
        retentionPeriodYears: 10,
      },

      alertThresholds: {
        highIncidentRateThreshold: 5,
        repeatedIncidentThreshold: 3,
        nearMissPatternThreshold: 5,
        overdueActionThreshold: 7,
        investigationOverdueThreshold: 5,
      },

      severityMatrix: [
        {
          injuryLevel: 'fatal',
          propertyDamage: 'none',
          resultingSeverity: 'critical',
        },
        {
          injuryLevel: 'permanent_disability',
          propertyDamage: 'none',
          resultingSeverity: 'critical',
        },
        {
          injuryLevel: 'temporary_disability',
          propertyDamage: 'none',
          resultingSeverity: 'high',
        },
        {
          injuryLevel: 'first_aid',
          propertyDamage: 'none',
          resultingSeverity: 'medium',
        },
        {
          injuryLevel: 'none',
          propertyDamage: 'catastrophic',
          resultingSeverity: 'high',
        },
        {
          injuryLevel: 'none',
          propertyDamage: 'critical',
          resultingSeverity: 'medium',
        },
        {
          injuryLevel: 'none',
          propertyDamage: 'moderate',
          resultingSeverity: 'low',
        },
        {
          injuryLevel: 'none',
          propertyDamage: 'minor',
          resultingSeverity: 'low',
        },
        {
          injuryLevel: 'none',
          propertyDamage: 'none',
          resultingSeverity: 'low',
        },
      ],

      countrySpecific: {
        legalReferences: [
          'Legea 319/2006 - Legea securității și sănătății în muncă',
          'HG 1425/2006 - Normele metodologice de aplicare a Legii 319/2006',
          'Ordinul 1091/2016 - Registrul general de evidență a salariaților',
        ],
        competentAuthority: 'Inspectoratul Teritorial de Muncă (ITM)',
        authorityUrl: 'https://www.inspectiamuncii.ro',
        emergencyNumber: '112',
        itmNotificationMandatory: true,
        itmContactEmail: null,
        itmContactPhone: null,
        mandatoryDocuments: [
          'Declarație accident de muncă',
          'Raport de investigare',
          'Declarații martor',
          'Rapoarte medicale',
          'Proces verbal de cercetare',
          'Plan de măsuri corective',
        ],
        accidentRegisterRequired: true,
        nearMissRegisterRequired: false,
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

    // Validate reporting config
    if (!config.reportingConfig) return false
    const reporting = config.reportingConfig
    if (
      typeof reporting.enableNearMissReporting !== 'boolean' ||
      typeof reporting.anonymousReportingAllowed !== 'boolean' ||
      typeof reporting.requireWitnessStatements !== 'boolean' ||
      typeof reporting.requirePhotographicEvidence !== 'boolean' ||
      typeof reporting.requireImmediateNotification !== 'boolean' ||
      typeof reporting.autoNotifyConsultant !== 'boolean' ||
      typeof reporting.requiresMedicalEvaluation !== 'boolean'
    ) {
      return false
    }

    // Validate investigation config
    if (!config.investigationConfig) return false
    const investigation = config.investigationConfig
    if (
      typeof investigation.requiresFormalInvestigation !== 'boolean' ||
      typeof investigation.investigationTimeframeDays !== 'number' ||
      typeof investigation.requiresRootCauseAnalysis !== 'boolean' ||
      typeof investigation.requires5WhyAnalysis !== 'boolean' ||
      typeof investigation.requiresFishboneDiagram !== 'boolean' ||
      typeof investigation.requiresInvestigationTeam !== 'boolean' ||
      typeof investigation.minInvestigationTeamSize !== 'number' ||
      typeof investigation.requiresExternalExpert !== 'boolean' ||
      investigation.investigationTimeframeDays <= 0 ||
      investigation.minInvestigationTeamSize < 1
    ) {
      return false
    }

    // Validate incident classification
    if (!Array.isArray(config.incidentClassification)) return false
    const validTypes: IncidentType[] = [
      'accident_fatal',
      'accident_serious',
      'accident_minor',
      'near_miss',
      'property_damage',
      'environmental',
      'security',
    ]
    for (const classification of config.incidentClassification) {
      if (
        !validTypes.includes(classification.type) ||
        !classification.name ||
        typeof classification.requiresITMNotification !== 'boolean' ||
        typeof classification.notificationTimeframeHours !== 'number' ||
        typeof classification.requiresFormalInvestigation !== 'boolean' ||
        typeof classification.requiresCorrectiveActions !== 'boolean' ||
        typeof classification.workStoppage !== 'boolean' ||
        !['critical', 'high', 'medium', 'low'].includes(classification.autoSeverity) ||
        classification.notificationTimeframeHours < 0
      ) {
        return false
      }
    }

    // Validate ITM notification config
    if (!config.itmNotificationConfig) return false
    const itm = config.itmNotificationConfig
    if (
      typeof itm.enableITMNotification !== 'boolean' ||
      typeof itm.fatalAccidentNotificationHours !== 'number' ||
      typeof itm.seriousAccidentNotificationHours !== 'number' ||
      typeof itm.collectiveAccidentThreshold !== 'number' ||
      typeof itm.collectiveNotificationHours !== 'number' ||
      typeof itm.requiresWrittenReport !== 'boolean' ||
      typeof itm.reportSubmissionDeadlineDays !== 'number' ||
      typeof itm.requiresFollowUpReport !== 'boolean' ||
      typeof itm.followUpReportDays !== 'number' ||
      itm.fatalAccidentNotificationHours <= 0 ||
      itm.seriousAccidentNotificationHours <= 0 ||
      itm.collectiveAccidentThreshold <= 0 ||
      itm.collectiveNotificationHours <= 0 ||
      itm.reportSubmissionDeadlineDays <= 0 ||
      itm.followUpReportDays <= 0
    ) {
      return false
    }

    // Validate corrective actions config
    if (!config.correctiveActionsConfig) return false
    const actions = config.correctiveActionsConfig
    if (
      typeof actions.requiresCorrectiveActions !== 'boolean' ||
      typeof actions.requiresResponsiblePerson !== 'boolean' ||
      typeof actions.requiresDeadline !== 'boolean' ||
      typeof actions.requiresVerification !== 'boolean' ||
      typeof actions.verificationByDifferentPerson !== 'boolean' ||
      typeof actions.requiresEffectivenessReview !== 'boolean' ||
      typeof actions.effectivenessReviewDays !== 'number' ||
      typeof actions.escalateOverdueActions !== 'boolean' ||
      typeof actions.escalationDays !== 'number' ||
      actions.effectivenessReviewDays <= 0 ||
      actions.escalationDays <= 0
    ) {
      return false
    }

    // Validate root cause config
    if (!config.rootCauseConfig) return false
    const rootCause = config.rootCauseConfig
    if (
      typeof rootCause.enableRootCauseAnalysis !== 'boolean' ||
      typeof rootCause.requiresMultipleRootCauses !== 'boolean' ||
      typeof rootCause.requires5WhyMethod !== 'boolean' ||
      typeof rootCause.requiresFishbone !== 'boolean' ||
      typeof rootCause.requiresContributingFactors !== 'boolean' ||
      typeof rootCause.requiresSystemicAnalysis !== 'boolean'
    ) {
      return false
    }

    // Validate near-miss config
    if (!config.nearMissConfig) return false
    const nearMiss = config.nearMissConfig
    if (
      typeof nearMiss.enableNearMissTracking !== 'boolean' ||
      typeof nearMiss.anonymousReportsAllowed !== 'boolean' ||
      typeof nearMiss.requiresInvestigation !== 'boolean' ||
      typeof nearMiss.rewardReporting !== 'boolean' ||
      typeof nearMiss.nearMissToAccidentRatio !== 'number' ||
      typeof nearMiss.trendAnalysisEnabled !== 'boolean' ||
      typeof nearMiss.trendAnalysisIntervalDays !== 'number' ||
      nearMiss.nearMissToAccidentRatio <= 0 ||
      nearMiss.trendAnalysisIntervalDays <= 0
    ) {
      return false
    }

    // Validate documentation config
    if (!config.documentationConfig) return false
    const docs = config.documentationConfig
    if (
      typeof docs.requiresIncidentReport !== 'boolean' ||
      typeof docs.requiresInvestigationReport !== 'boolean' ||
      typeof docs.requiresWitnessStatements !== 'boolean' ||
      typeof docs.requiresPhotos !== 'boolean' ||
      typeof docs.requiresMedicalReports !== 'boolean' ||
      typeof docs.requiresPoliceReport !== 'boolean' ||
      typeof docs.requiresITMReport !== 'boolean' ||
      typeof docs.retentionPeriodYears !== 'number' ||
      docs.retentionPeriodYears <= 0
    ) {
      return false
    }

    // Validate alert thresholds
    if (!config.alertThresholds) return false
    const alerts = config.alertThresholds
    if (
      typeof alerts.highIncidentRateThreshold !== 'number' ||
      typeof alerts.repeatedIncidentThreshold !== 'number' ||
      typeof alerts.nearMissPatternThreshold !== 'number' ||
      typeof alerts.overdueActionThreshold !== 'number' ||
      typeof alerts.investigationOverdueThreshold !== 'number' ||
      alerts.highIncidentRateThreshold <= 0 ||
      alerts.repeatedIncidentThreshold <= 0 ||
      alerts.nearMissPatternThreshold <= 0 ||
      alerts.overdueActionThreshold <= 0 ||
      alerts.investigationOverdueThreshold <= 0
    ) {
      return false
    }

    // Validate severity matrix
    if (!Array.isArray(config.severityMatrix)) return false
    const validInjuryLevels = ['fatal', 'permanent_disability', 'temporary_disability', 'first_aid', 'none']
    const validPropertyDamage = ['catastrophic', 'critical', 'moderate', 'minor', 'none']
    const validSeverities: IncidentSeverity[] = ['critical', 'high', 'medium', 'low']
    for (const matrix of config.severityMatrix) {
      if (
        !validInjuryLevels.includes(matrix.injuryLevel) ||
        !validPropertyDamage.includes(matrix.propertyDamage) ||
        !validSeverities.includes(matrix.resultingSeverity)
      ) {
        return false
      }
    }

    // Validate country specific
    if (!config.countrySpecific) return false
    const country = config.countrySpecific
    if (
      !Array.isArray(country.legalReferences) ||
      !country.competentAuthority ||
      !country.emergencyNumber ||
      typeof country.itmNotificationMandatory !== 'boolean' ||
      !Array.isArray(country.mandatoryDocuments) ||
      typeof country.accidentRegisterRequired !== 'boolean' ||
      typeof country.nearMissRegisterRequired !== 'boolean'
    ) {
      return false
    }

    return true
  },
}

// ── Country-Specific Incident Configurations ──

/**
 * Romania Incidents configuration
 */
export function getRomaniaIncidentsConfig(): Partial<IncidentsModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Legea 319/2006 - Legea securității și sănătății în muncă',
        'HG 1425/2006 - Normele metodologice de aplicare a Legii 319/2006',
        'Ordinul 1091/2016 - Registrul general de evidență a salariaților',
        'HG 955/2010 - Procedura de cercetare a accidentelor de muncă',
      ],
      competentAuthority: 'Inspectoratul Teritorial de Muncă (ITM)',
      authorityUrl: 'https://www.inspectiamuncii.ro',
      emergencyNumber: '112',
      itmNotificationMandatory: true,
      itmContactEmail: null, // Set per ITM region
      itmContactPhone: null, // Set per ITM region
      mandatoryDocuments: [
        'Declarație accident de muncă (anexa la HG 1425/2006)',
        'Raport de investigare',
        'Declarații martori',
        'Rapoarte medicale',
        'Proces verbal de cercetare',
        'Plan de măsuri corective',
        'Registru de evidență accidente de muncă',
      ],
      accidentRegisterRequired: true,
      nearMissRegisterRequired: false,
    },
  }
}

/**
 * Bulgaria Incidents configuration
 */
export function getBulgariaIncidentsConfig(): Partial<IncidentsModuleConfig> {
  return {
    itmNotificationConfig: {
      enableITMNotification: true,
      fatalAccidentNotificationHours: 24,
      seriousAccidentNotificationHours: 24,
      collectiveAccidentThreshold: 2,
      collectiveNotificationHours: 24,
      requiresWrittenReport: true,
      reportSubmissionDeadlineDays: 7,
      requiresFollowUpReport: true,
      followUpReportDays: 30,
    },
    countrySpecific: {
      legalReferences: [
        'Кодекс на труда - Глава осма (Здравословни и безопасни условия на труд)',
        'Наредба № 4 за разследване и отчитане на трудовите злополуки',
      ],
      competentAuthority: 'Изпълнителна агенция "Главна инспекция по труда" (ГИТ)',
      authorityUrl: 'https://www.gli.government.bg',
      emergencyNumber: '112',
      itmNotificationMandatory: true,
      itmContactEmail: null,
      itmContactPhone: null,
      mandatoryDocuments: [
        'Протокол за трудова злополука',
        'Свидетелски показания',
        'Медицински документи',
        'Разследващ доклад',
        'Коригиращи мерки',
        'Регистър на трудовите злополуки',
      ],
      accidentRegisterRequired: true,
      nearMissRegisterRequired: false,
    },
  }
}

/**
 * Hungary Incidents configuration
 */
export function getHungaryIncidentsConfig(): Partial<IncidentsModuleConfig> {
  return {
    itmNotificationConfig: {
      enableITMNotification: true,
      fatalAccidentNotificationHours: 8,
      seriousAccidentNotificationHours: 24,
      collectiveAccidentThreshold: 3,
      collectiveNotificationHours: 8,
      requiresWrittenReport: true,
      reportSubmissionDeadlineDays: 8,
      requiresFollowUpReport: true,
      followUpReportDays: 30,
    },
    countrySpecific: {
      legalReferences: [
        'Munka törvénykönyve (2012. évi I. törvény)',
        '5/1993. (XII. 26.) MüM rendelet - Munkahelyi balesetek nyilvántartása',
      ],
      competentAuthority: 'Nemzeti Munkaügyi Hivatal (munkavédelmi felügyelőség)',
      authorityUrl: 'https://www.munkaugy.hu',
      emergencyNumber: '112',
      itmNotificationMandatory: true,
      itmContactEmail: null,
      itmContactPhone: null,
      mandatoryDocuments: [
        'Baleseti jegyzőkönyv',
        'Tanúvallomások',
        'Orvosi dokumentáció',
        'Vizsgálati jelentés',
        'Intézkedési terv',
        'Munkahelyi balesetek nyilvántartása',
      ],
      accidentRegisterRequired: true,
      nearMissRegisterRequired: false,
    },
  }
}

/**
 * Germany Incidents configuration
 */
export function getGermanyIncidentsConfig(): Partial<IncidentsModuleConfig> {
  return {
    itmNotificationConfig: {
      enableITMNotification: true,
      fatalAccidentNotificationHours: 24,
      seriousAccidentNotificationHours: 72,
      collectiveAccidentThreshold: 3,
      collectiveNotificationHours: 24,
      requiresWrittenReport: true,
      reportSubmissionDeadlineDays: 3,
      requiresFollowUpReport: false,
      followUpReportDays: 0,
    },
    countrySpecific: {
      legalReferences: [
        'Sozialgesetzbuch VII (SGB VII) - Gesetzliche Unfallversicherung',
        'DGUV Vorschrift 1 - Grundsätze der Prävention',
        'DGUV Information 204-020 - Verbandbuch',
      ],
      competentAuthority: 'Berufsgenossenschaft / Unfallkasse',
      authorityUrl: 'https://www.dguv.de',
      emergencyNumber: '112',
      itmNotificationMandatory: true,
      itmContactEmail: null,
      itmContactPhone: null,
      mandatoryDocuments: [
        'Unfallanzeige',
        'Zeugenaussagen',
        'Ärztliche Berichte',
        'Untersuchungsbericht',
        'Maßnahmenplan',
        'Verbandbuch',
      ],
      accidentRegisterRequired: true,
      nearMissRegisterRequired: true, // Recommended in Germany
    },
  }
}

/**
 * Poland Incidents configuration
 */
export function getPolandIncidentsConfig(): Partial<IncidentsModuleConfig> {
  return {
    itmNotificationConfig: {
      enableITMNotification: true,
      fatalAccidentNotificationHours: 24,
      seriousAccidentNotificationHours: 24,
      collectiveAccidentThreshold: 2,
      collectiveNotificationHours: 24,
      requiresWrittenReport: true,
      reportSubmissionDeadlineDays: 14,
      requiresFollowUpReport: false,
      followUpReportDays: 0,
    },
    countrySpecific: {
      legalReferences: [
        'Kodeks pracy - Dział dziesiąty (BHP)',
        'Rozporządzenie w sprawie postępowania przy ustalaniu okoliczności i przyczyn wypadków przy pracy',
      ],
      competentAuthority: 'Państwowa Inspekcja Pracy (PIP)',
      authorityUrl: 'https://www.pip.gov.pl',
      emergencyNumber: '112',
      itmNotificationMandatory: true,
      itmContactEmail: null,
      itmContactPhone: null,
      mandatoryDocuments: [
        'Protokół powypadkowy',
        'Zeznania świadków',
        'Dokumentacja medyczna',
        'Raport z dochodzenia',
        'Plan działań korygujących',
        'Rejestr wypadków przy pracy',
      ],
      accidentRegisterRequired: true,
      nearMissRegisterRequired: false,
    },
  }
}

// ── Helper Functions ──

/**
 * Get Incidents configuration for a specific country
 * @param countryCode - Country code (RO, BG, HU, DE, PL)
 * @returns Merged configuration with country-specific settings
 */
export function getIncidentsConfigForCountry(countryCode: string): IncidentsModuleConfig {
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
      countrySpecific: {
        ...baseConfig.countrySpecific,
        ...countrySpecific.countrySpecific,
      },
      itmNotificationConfig: {
        ...baseConfig.itmNotificationConfig,
        ...countrySpecific.itmNotificationConfig,
      },
    }
  }

  return baseConfig
}

/**
 * Calculate incident severity based on injury level and property damage
 * @param injuryLevel - Injury level
 * @param propertyDamage - Property damage level
 * @param config - Incidents module configuration
 * @returns Calculated severity
 */
export function calculateIncidentSeverity(
  injuryLevel: 'fatal' | 'permanent_disability' | 'temporary_disability' | 'first_aid' | 'none',
  propertyDamage: 'catastrophic' | 'critical' | 'moderate' | 'minor' | 'none',
  config: IncidentsModuleConfig
): IncidentSeverity {
  const match = config.severityMatrix.find(
    m => m.injuryLevel === injuryLevel && m.propertyDamage === propertyDamage
  )
  return match?.resultingSeverity ?? 'low'
}

/**
 * Check if incident requires ITM notification
 * @param incidentType - Type of incident
 * @param config - Incidents module configuration
 * @returns true if ITM notification required
 */
export function requiresITMNotification(
  incidentType: IncidentType,
  config: IncidentsModuleConfig
): boolean {
  if (!config.itmNotificationConfig.enableITMNotification) return false
  if (!config.countrySpecific.itmNotificationMandatory) return false

  const classification = config.incidentClassification.find(c => c.type === incidentType)
  return classification?.requiresITMNotification ?? false
}

/**
 * Get ITM notification deadline
 * @param incidentType - Type of incident
 * @param incidentDate - Date of incident (ISO string)
 * @param config - Incidents module configuration
 * @returns ITM notification deadline (ISO string), or null if not required
 */
export function getITMNotificationDeadline(
  incidentType: IncidentType,
  incidentDate: string,
  config: IncidentsModuleConfig
): string | null {
  if (!requiresITMNotification(incidentType, config)) return null

  const classification = config.incidentClassification.find(c => c.type === incidentType)
  if (!classification) return null

  const incidentDateObj = new Date(incidentDate)
  const deadlineHours = classification.notificationTimeframeHours
  const deadline = new Date(incidentDateObj.getTime() + deadlineHours * 60 * 60 * 1000)

  return deadline.toISOString()
}

/**
 * Check if incident requires formal investigation
 * @param incidentType - Type of incident
 * @param config - Incidents module configuration
 * @returns true if formal investigation required
 */
export function requiresFormalInvestigation(
  incidentType: IncidentType,
  config: IncidentsModuleConfig
): boolean {
  const classification = config.incidentClassification.find(c => c.type === incidentType)
  return classification?.requiresFormalInvestigation ?? false
}

/**
 * Get investigation deadline
 * @param incidentDate - Date of incident (ISO string)
 * @param config - Incidents module configuration
 * @returns Investigation start deadline (ISO string)
 */
export function getInvestigationDeadline(
  incidentDate: string,
  config: IncidentsModuleConfig
): string {
  const incidentDateObj = new Date(incidentDate)
  const deadlineDays = config.investigationConfig.investigationTimeframeDays
  const deadline = new Date(incidentDateObj.getTime() + deadlineDays * 24 * 60 * 60 * 1000)
  return deadline.toISOString().split('T')[0]
}

/**
 * Check if work stoppage is required
 * @param incidentType - Type of incident
 * @param config - Incidents module configuration
 * @returns true if work must stop immediately
 */
export function requiresWorkStoppage(
  incidentType: IncidentType,
  config: IncidentsModuleConfig
): boolean {
  const classification = config.incidentClassification.find(c => c.type === incidentType)
  return classification?.workStoppage ?? false
}

/**
 * Calculate incident rate (OSHA methodology)
 * @param numberOfIncidents - Total incidents in period
 * @param totalHoursWorked - Total hours worked by all employees
 * @returns Incident rate per 100 employees (200,000 hours)
 */
export function calculateIncidentRate(
  numberOfIncidents: number,
  totalHoursWorked: number
): number {
  if (totalHoursWorked === 0) return 0
  // OSHA formula: (Number of incidents x 200,000) / Total hours worked by all employees
  return (numberOfIncidents * 200000) / totalHoursWorked
}

/**
 * Calculate lost time injury frequency rate (LTIFR)
 * @param numberOfLostTimeInjuries - Lost time injuries
 * @param totalHoursWorked - Total hours worked
 * @returns LTIFR per million hours worked
 */
export function calculateLTIFR(
  numberOfLostTimeInjuries: number,
  totalHoursWorked: number
): number {
  if (totalHoursWorked === 0) return 0
  return (numberOfLostTimeInjuries * 1000000) / totalHoursWorked
}

/**
 * Calculate near-miss to accident ratio
 * @param nearMissCount - Number of near-miss events
 * @param accidentCount - Number of actual accidents
 * @returns Ratio (e.g., 10:1 = 10)
 */
export function calculateNearMissRatio(nearMissCount: number, accidentCount: number): number {
  if (accidentCount === 0) return nearMissCount > 0 ? Infinity : 0
  return nearMissCount / accidentCount
}

/**
 * Generate ITM notification text (Romanian template)
 * @param incident - Incident details
 * @returns Formatted ITM notification text
 */
export function generateITMNotificationText(incident: {
  type: IncidentType
  date: string
  time: string
  location: string
  victimName: string
  victimRole: string
  description: string
}): string {
  return `NOTIFICARE ACCIDENT DE MUNCĂ

Conform Legii 319/2006 și HG 1425/2006, vă notificăm următorul accident de muncă:

Data: ${incident.date}
Ora: ${incident.time}
Locația: ${incident.location}

Victimă:
Nume: ${incident.victimName}
Funcție: ${incident.victimRole}

Descriere sumară:
${incident.description}

Această notificare este transmisă în termenul legal.
Raportul detaliat va fi transmis conform reglementărilor.

Cu respect,`
}

// ── Exports ──
export default incidentsModule
