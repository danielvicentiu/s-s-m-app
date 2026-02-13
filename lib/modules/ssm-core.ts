// lib/modules/ssm-core.ts
// OP-LEGO — SSM Core Module (Securitatea și Sănătatea în Muncă - Core)
// Occupational health and safety compliance: employees, trainings, medical exams, compliance scoring
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
  getDefaultConfig: () => SsmCoreModuleConfig
  validateConfig: (config: any) => boolean
}

// ── SSM Core Module Configuration ──
export interface SsmCoreModuleConfig {
  // Employee management
  employeeConfig: {
    requiresCnp: boolean                  // CNP hash required
    requiresJobTitle: boolean             // Job title mandatory
    requiresHireDate: boolean             // Hire date tracking
    autoCreateMedicalRecord: boolean      // Auto-create medical exam on hire
    autoCreateTraining: boolean           // Auto-create SSM training on hire
  }

  // Training frequencies (days)
  trainingFrequencies: {
    initialSsmTraining: number            // Initial SSM training (default: upon hire)
    refreshSsmTraining: number            // Refresh training (default: 365 days)
    specializedTraining: number           // Specialized by job role (default: 365 days)
    instructorRefresh: number             // SSM instructor refresh (default: 730 days)
    firstAidTraining: number              // First aid training (default: 365 days)
    emergencyResponseTraining: number     // Emergency procedures (default: 365 days)
  }

  // Medical examination frequencies (days)
  medicalFrequencies: {
    initialExam: number                   // Exam on hire (default: 0 = immediate)
    periodicExam: number                  // Periodic exam (default: 365 days)
    resumptionExam: number                // After illness >30 days (default: on demand)
    specialConditionsExam: number         // Special working conditions (default: 180 days)
    nightWorkExam: number                 // Night shift workers (default: 180 days)
    hazardousWorkExam: number             // Hazardous environments (default: 180 days)
  }

  // Medical exam types configuration
  examTypes: {
    type: 'periodic' | 'angajare' | 'reluare' | 'la_cerere' | 'supraveghere'
    name: string
    requiresDoctor: boolean
    requiresClinic: boolean
    validityPeriod: number                // Days
    mandatoryTests: string[]              // Ex: ['blood_test', 'audiometry', 'spirometry']
  }[]

  // Alert thresholds
  alertThresholds: {
    trainingExpiringWarningDays: number   // Default: 30 days
    trainingExpiringCriticalDays: number  // Default: 15 days
    medicalExpiringWarningDays: number    // Default: 30 days
    medicalExpiringCriticalDays: number   // Default: 15 days
    overdueEscalationDays: number         // Default: 7 days
    complianceScoreThreshold: number      // Default: 75 (below = warning)
  }

  // Compliance scoring weights
  complianceWeights: {
    medicalExamsWeight: number            // Default: 40% (0.4)
    trainingWeight: number                // Default: 40% (0.4)
    documentationWeight: number           // Default: 10% (0.1)
    equipmentWeight: number               // Default: 10% (0.1)
  }

  // Country-specific settings
  countrySpecific: {
    legalReferences: string[]             // Legal acts references
    competentAuthority: string            // Ex: 'Inspecția Muncii'
    authorityUrl: string | null
    emergencyNumber: string               // Ex: '112'
    mandatoryDocuments: string[]          // Required documentation
    requiresOccupationalPhysician: boolean // Dedicated occupational doctor required
    requiresSsmResponsible: boolean       // SSM responsible person required
  }
}

// ── SSM Core Module Definition ──
export const ssmCoreModule: IModule = {
  key: 'ssm-core',
  name_en: 'SSM Core',
  name_localized: {
    ro: 'SSM Core (Securitate și Sănătate în Muncă)',
    bg: 'ЗБУТ Core (Здраве и безопасност при работа)',
    hu: 'Munkavédelem Core',
    de: 'Arbeitsschutz Core',
    pl: 'BHP Core (Bezpieczeństwo i higiena pracy)',
    en: 'Occupational Health & Safety Core',
  },
  description_en: 'Core SSM module: employee management, medical examinations, SSM trainings, compliance scoring',
  icon: 'Shield',
  category: 'core',
  is_base: true, // Base module - always active
  depends_on: [], // No dependencies - this IS the base
  incompatible: [], // Compatible with all other modules

  /**
   * Returns default SSM Core module configuration
   */
  getDefaultConfig(): SsmCoreModuleConfig {
    return {
      employeeConfig: {
        requiresCnp: true,
        requiresJobTitle: true,
        requiresHireDate: true,
        autoCreateMedicalRecord: true,
        autoCreateTraining: true,
      },

      trainingFrequencies: {
        initialSsmTraining: 0, // Upon hire
        refreshSsmTraining: 365,
        specializedTraining: 365,
        instructorRefresh: 730,
        firstAidTraining: 365,
        emergencyResponseTraining: 365,
      },

      medicalFrequencies: {
        initialExam: 0, // Upon hire
        periodicExam: 365,
        resumptionExam: 0, // On demand
        specialConditionsExam: 180,
        nightWorkExam: 180,
        hazardousWorkExam: 180,
      },

      examTypes: [
        {
          type: 'angajare',
          name: 'Control medical la angajare',
          requiresDoctor: true,
          requiresClinic: true,
          validityPeriod: 365,
          mandatoryTests: ['examen_clinic', 'test_sanguin', 'radiografie_toracica'],
        },
        {
          type: 'periodic',
          name: 'Control medical periodic',
          requiresDoctor: true,
          requiresClinic: true,
          validityPeriod: 365,
          mandatoryTests: ['examen_clinic', 'test_sanguin'],
        },
        {
          type: 'reluare',
          name: 'Control medical la reluarea activității',
          requiresDoctor: true,
          requiresClinic: true,
          validityPeriod: 180,
          mandatoryTests: ['examen_clinic'],
        },
        {
          type: 'la_cerere',
          name: 'Control medical la cerere',
          requiresDoctor: true,
          requiresClinic: false,
          validityPeriod: 180,
          mandatoryTests: ['examen_clinic'],
        },
        {
          type: 'supraveghere',
          name: 'Control medical de supraveghere (condiții speciale)',
          requiresDoctor: true,
          requiresClinic: true,
          validityPeriod: 180,
          mandatoryTests: ['examen_clinic', 'test_sanguin', 'audiometrie', 'spirometrie'],
        },
      ],

      alertThresholds: {
        trainingExpiringWarningDays: 30,
        trainingExpiringCriticalDays: 15,
        medicalExpiringWarningDays: 30,
        medicalExpiringCriticalDays: 15,
        overdueEscalationDays: 7,
        complianceScoreThreshold: 75,
      },

      complianceWeights: {
        medicalExamsWeight: 0.4,
        trainingWeight: 0.4,
        documentationWeight: 0.1,
        equipmentWeight: 0.1,
      },

      countrySpecific: {
        legalReferences: [
          'Legea nr. 319/2006 privind sănătatea și securitatea în muncă',
          'HG nr. 1425/2006 - Normele metodologice de aplicare',
          'Ordinul 355/2007 - Supravegherea sănătății lucrătorilor',
        ],
        competentAuthority: 'Inspecția Muncii',
        authorityUrl: 'https://www.inspectiamuncii.ro',
        emergencyNumber: '112',
        mandatoryDocuments: [
          'Plan de prevenire și protecție',
          'Fișe individuale de protecție',
          'Registru de instruire SSM',
          'Avize medicale de medicina muncii',
          'Evaluare de risc',
        ],
        requiresOccupationalPhysician: true,
        requiresSsmResponsible: true,
      },
    }
  },

  /**
   * Validates SSM Core module configuration
   * @param config - Configuration object to validate
   * @returns true if valid, false otherwise
   */
  validateConfig(config: any): boolean {
    if (!config || typeof config !== 'object') return false

    // Validate employee config
    if (!config.employeeConfig) return false
    const empConfig = config.employeeConfig
    if (
      typeof empConfig.requiresCnp !== 'boolean' ||
      typeof empConfig.requiresJobTitle !== 'boolean' ||
      typeof empConfig.requiresHireDate !== 'boolean' ||
      typeof empConfig.autoCreateMedicalRecord !== 'boolean' ||
      typeof empConfig.autoCreateTraining !== 'boolean'
    ) {
      return false
    }

    // Validate training frequencies
    if (!config.trainingFrequencies) return false
    const trainFreq = config.trainingFrequencies
    if (
      typeof trainFreq.initialSsmTraining !== 'number' ||
      typeof trainFreq.refreshSsmTraining !== 'number' ||
      typeof trainFreq.specializedTraining !== 'number' ||
      trainFreq.initialSsmTraining < 0 ||
      trainFreq.refreshSsmTraining <= 0 ||
      trainFreq.specializedTraining <= 0
    ) {
      return false
    }

    // Validate medical frequencies
    if (!config.medicalFrequencies) return false
    const medFreq = config.medicalFrequencies
    if (
      typeof medFreq.initialExam !== 'number' ||
      typeof medFreq.periodicExam !== 'number' ||
      typeof medFreq.resumptionExam !== 'number' ||
      medFreq.initialExam < 0 ||
      medFreq.periodicExam <= 0 ||
      medFreq.resumptionExam < 0
    ) {
      return false
    }

    // Validate exam types
    if (!Array.isArray(config.examTypes)) return false
    for (const examType of config.examTypes) {
      if (
        !examType.type ||
        !examType.name ||
        typeof examType.requiresDoctor !== 'boolean' ||
        typeof examType.requiresClinic !== 'boolean' ||
        typeof examType.validityPeriod !== 'number' ||
        !Array.isArray(examType.mandatoryTests) ||
        examType.validityPeriod <= 0
      ) {
        return false
      }
    }

    // Validate alert thresholds
    if (!config.alertThresholds) return false
    const alerts = config.alertThresholds
    if (
      typeof alerts.trainingExpiringWarningDays !== 'number' ||
      typeof alerts.trainingExpiringCriticalDays !== 'number' ||
      typeof alerts.medicalExpiringWarningDays !== 'number' ||
      typeof alerts.medicalExpiringCriticalDays !== 'number' ||
      typeof alerts.overdueEscalationDays !== 'number' ||
      typeof alerts.complianceScoreThreshold !== 'number' ||
      alerts.trainingExpiringWarningDays <= 0 ||
      alerts.trainingExpiringCriticalDays <= 0 ||
      alerts.medicalExpiringWarningDays <= 0 ||
      alerts.medicalExpiringCriticalDays <= 0 ||
      alerts.overdueEscalationDays <= 0 ||
      alerts.complianceScoreThreshold < 0 ||
      alerts.complianceScoreThreshold > 100
    ) {
      return false
    }

    // Validate compliance weights
    if (!config.complianceWeights) return false
    const weights = config.complianceWeights
    if (
      typeof weights.medicalExamsWeight !== 'number' ||
      typeof weights.trainingWeight !== 'number' ||
      typeof weights.documentationWeight !== 'number' ||
      typeof weights.equipmentWeight !== 'number' ||
      weights.medicalExamsWeight < 0 ||
      weights.trainingWeight < 0 ||
      weights.documentationWeight < 0 ||
      weights.equipmentWeight < 0
    ) {
      return false
    }

    // Validate weights sum to 1.0 (100%)
    const totalWeight =
      weights.medicalExamsWeight +
      weights.trainingWeight +
      weights.documentationWeight +
      weights.equipmentWeight
    if (Math.abs(totalWeight - 1.0) > 0.001) {
      return false
    }

    // Validate country specific
    if (!config.countrySpecific) return false
    const country = config.countrySpecific
    if (
      !Array.isArray(country.legalReferences) ||
      !country.competentAuthority ||
      !country.emergencyNumber ||
      !Array.isArray(country.mandatoryDocuments) ||
      typeof country.requiresOccupationalPhysician !== 'boolean' ||
      typeof country.requiresSsmResponsible !== 'boolean'
    ) {
      return false
    }

    return true
  },
}

// ── Country-Specific SSM Core Configurations ──

/**
 * Romania SSM Core configuration
 */
export function getRomaniaSsmCoreConfig(): Partial<SsmCoreModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Legea nr. 319/2006 privind sănătatea și securitatea în muncă',
        'HG nr. 1425/2006 - Normele metodologice de aplicare a Legii 319/2006',
        'Ordinul 355/2007 - Supravegherea sănătății lucrătorilor',
        'Legea nr. 53/2003 - Codul muncii (art. 175-184)',
      ],
      competentAuthority: 'Inspecția Muncii',
      authorityUrl: 'https://www.inspectiamuncii.ro',
      emergencyNumber: '112',
      mandatoryDocuments: [
        'Plan de prevenire și protecție (PPP)',
        'Fișe individuale de protecție',
        'Registru de instruire SSM',
        'Avize medicale medicina muncii',
        'Evaluare de risc profesional',
        'Fișe de aptitudini',
      ],
      requiresOccupationalPhysician: true,
      requiresSsmResponsible: true,
    },
  }
}

/**
 * Bulgaria SSM Core configuration
 */
export function getBulgariaSsmCoreConfig(): Partial<SsmCoreModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Закон за здравословни и безопасни условия на труд (ЗЗБУТ)',
        'Наредба № 3 за минималните изисквания за безопасност',
      ],
      competentAuthority: 'Изпълнителна агенция "Главна инспекция по труда"',
      authorityUrl: 'https://www.gli.government.bg',
      emergencyNumber: '112',
      mandatoryDocuments: [
        'План за осигуряване на здравословни и безопасни условия на труд',
        'Оценка на риска',
        'Инструктажи по безопасност',
        'Медицински прегледи',
      ],
      requiresOccupationalPhysician: true,
      requiresSsmResponsible: true,
    },
  }
}

/**
 * Hungary SSM Core configuration
 */
export function getHungarySsmCoreConfig(): Partial<SsmCoreModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Munka törvénykönyve (2012. évi I. törvény)',
        '63/1999. (XII. 8.) EüM rendelet - Munkavédelmi szabályok',
      ],
      competentAuthority: 'Nemzeti Munkaügyi Hivatal',
      authorityUrl: 'https://www.munkaugy.hu',
      emergencyNumber: '112',
      mandatoryDocuments: [
        'Kockázatértékelés',
        'Munkavédelmi oktatási nyilvántartás',
        'Orvosi alkalmassági vizsgálatok',
        'Munkavédelmi szabályzat',
      ],
      requiresOccupationalPhysician: true,
      requiresSsmResponsible: true,
    },
  }
}

/**
 * Germany SSM Core configuration
 */
export function getGermanySsmCoreConfig(): Partial<SsmCoreModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Arbeitsschutzgesetz (ArbSchG)',
        'Arbeitssicherheitsgesetz (ASiG)',
        'Arbeitsstättenverordnung (ArbStättV)',
        'DGUV Vorschrift 1 - Grundsätze der Prävention',
      ],
      competentAuthority: 'Gewerbeaufsichtsamt / Berufsgenossenschaft',
      authorityUrl: null,
      emergencyNumber: '112',
      mandatoryDocuments: [
        'Gefährdungsbeurteilung',
        'Betriebsanweisung',
        'Unterweisungsnachweise',
        'Vorsorgeuntersuchungen',
        'Arbeitsschutzausschuss-Protokolle',
      ],
      requiresOccupationalPhysician: true,
      requiresSsmResponsible: true,
    },
  }
}

/**
 * Poland SSM Core configuration
 */
export function getPolandSsmCoreConfig(): Partial<SsmCoreModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Kodeks pracy - dział X (BHP)',
        'Ustawa o Państwowej Inspekcji Pracy',
        'Rozporządzenie w sprawie ogólnych przepisów BHP',
      ],
      competentAuthority: 'Państwowa Inspekcja Pracy',
      authorityUrl: 'https://www.pip.gov.pl',
      emergencyNumber: '112',
      mandatoryDocuments: [
        'Ocena ryzyka zawodowego',
        'Rejestr szkoleń BHP',
        'Badania lekarskie pracowników',
        'Instrukcje BHP',
      ],
      requiresOccupationalPhysician: true,
      requiresSsmResponsible: true,
    },
  }
}

// ── Helper Functions ──

/**
 * Get SSM Core configuration for a specific country
 * @param countryCode - Country code (RO, BG, HU, DE, PL)
 * @returns Merged configuration with country-specific settings
 */
export function getSsmCoreConfigForCountry(countryCode: string): SsmCoreModuleConfig {
  const baseConfig = ssmCoreModule.getDefaultConfig()

  let countrySpecific: Partial<SsmCoreModuleConfig> | undefined

  switch (countryCode) {
    case 'RO':
      countrySpecific = getRomaniaSsmCoreConfig()
      break
    case 'BG':
      countrySpecific = getBulgariaSsmCoreConfig()
      break
    case 'HU':
      countrySpecific = getHungarySsmCoreConfig()
      break
    case 'DE':
      countrySpecific = getGermanySsmCoreConfig()
      break
    case 'PL':
      countrySpecific = getPolandSsmCoreConfig()
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
 * Calculate compliance score for an organization
 * @param stats - Organization statistics
 * @param config - SSM Core module configuration
 * @returns Compliance score (0-100)
 */
export function calculateComplianceScore(
  stats: {
    totalEmployees: number
    validMedicalExams: number
    validTrainings: number
    requiredDocuments: number
    completedDocuments: number
    compliantEquipment: number
    totalEquipment: number
  },
  config: SsmCoreModuleConfig
): number {
  if (stats.totalEmployees === 0) return 0

  const weights = config.complianceWeights

  // Medical exams score
  const medicalScore = (stats.validMedicalExams / stats.totalEmployees) * 100

  // Training score
  const trainingScore = (stats.validTrainings / stats.totalEmployees) * 100

  // Documentation score
  const documentationScore =
    stats.requiredDocuments > 0
      ? (stats.completedDocuments / stats.requiredDocuments) * 100
      : 100

  // Equipment score
  const equipmentScore =
    stats.totalEquipment > 0
      ? (stats.compliantEquipment / stats.totalEquipment) * 100
      : 100

  // Weighted total
  const totalScore =
    medicalScore * weights.medicalExamsWeight +
    trainingScore * weights.trainingWeight +
    documentationScore * weights.documentationWeight +
    equipmentScore * weights.equipmentWeight

  return Math.round(totalScore)
}

/**
 * Calculate next medical exam date based on exam type and config
 * @param examType - Type of medical examination
 * @param lastExamDate - Last exam date (ISO string)
 * @param config - SSM Core module configuration
 * @returns Next exam date (ISO string)
 */
export function calculateNextMedicalExamDate(
  examType: keyof SsmCoreModuleConfig['medicalFrequencies'],
  lastExamDate: string,
  config: SsmCoreModuleConfig
): string {
  const lastDate = new Date(lastExamDate)
  const intervalDays = config.medicalFrequencies[examType]
  const nextDate = new Date(lastDate.getTime() + intervalDays * 24 * 60 * 60 * 1000)
  return nextDate.toISOString().split('T')[0]
}

/**
 * Calculate next training date based on training type and config
 * @param trainingType - Type of training
 * @param completionDate - Training completion date (ISO string)
 * @param config - SSM Core module configuration
 * @returns Next training date (ISO string)
 */
export function calculateNextTrainingDate(
  trainingType: keyof SsmCoreModuleConfig['trainingFrequencies'],
  completionDate: string,
  config: SsmCoreModuleConfig
): string {
  const completion = new Date(completionDate)
  const intervalDays = config.trainingFrequencies[trainingType]
  const nextDate = new Date(completion.getTime() + intervalDays * 24 * 60 * 60 * 1000)
  return nextDate.toISOString().split('T')[0]
}

/**
 * Determine if an employee requires special medical surveillance
 * @param jobTitle - Employee job title
 * @param workConditions - Array of work condition flags
 * @returns true if special surveillance required
 */
export function requiresSpecialMedicalSurveillance(
  jobTitle: string,
  workConditions: {
    nightWork: boolean
    hazardousSubstances: boolean
    heavyLifting: boolean
    extremeTemperatures: boolean
    vibration: boolean
    noise: boolean
  }
): boolean {
  // Check if any hazardous condition is present
  return (
    workConditions.nightWork ||
    workConditions.hazardousSubstances ||
    workConditions.heavyLifting ||
    workConditions.extremeTemperatures ||
    workConditions.vibration ||
    workConditions.noise
  )
}

// ── Exports ──
export default ssmCoreModule
