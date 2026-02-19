// lib/modules/psi-module.ts
// OP-LEGO — PSI Module (Prevenirea și Stingerea Incendiilor)
// Fire safety compliance tracking: equipment, trainings, evacuation plans, authorizations
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
  getDefaultConfig: () => PsiModuleConfig
  validateConfig: (config: any) => boolean
}

// ── PSI Module Configuration ──
export interface PsiModuleConfig {
  // Inspection frequencies (days)
  inspectionFrequencies: {
    fireExtinguisher: number          // Standard: 365 days
    fireHydrant: number                // Standard: 180 days
    smokeDetector: number              // Standard: 180 days
    fireAlarmSystem: number            // Standard: 365 days
    emergencyLighting: number          // Standard: 180 days
    evacuationSignage: number          // Standard: 365 days
    fireHose: number                   // Standard: 365 days
    fireBlanket: number                // Standard: 365 days
    fireProofDoors: number             // Standard: 365 days
  }

  // Extinguisher types configuration
  extinguisherTypes: {
    code: string                       // Ex: 'ABC-6kg', 'CO2-5kg'
    name: string                       // Display name
    agent: 'powder' | 'co2' | 'foam' | 'water' | 'other'
    capacity: number                   // kg or liters
    suitableFor: string[]              // Fire classes: A, B, C, D, F
    inspectionInterval: number         // Days
    maxLifespan: number                // Years
  }[]

  // Training configuration
  trainingConfig: {
    initialTrainingRequired: boolean   // Initial PSI training for new employees
    refreshInterval: number            // Days (standard: 365)
    minimumDuration: number            // Hours
    requiresExternalTrainer: boolean   // External certified trainer required
    certificateValidity: number        // Days
  }

  // Evacuation plan configuration
  evacuationConfig: {
    planReviewInterval: number         // Days (standard: 365)
    drillFrequency: number             // Days (standard: 180)
    requiresFloorPlan: boolean         // Floor plan diagram required
    requiresAssemblyPoints: boolean    // Assembly points identification
    requiresEvacuationLeader: boolean  // Designated evacuation leader
  }

  // Fire authorization configuration
  authorizationConfig: {
    requiresPsiAuthorization: boolean  // PSI authorization from fire dept
    authValidityPeriod: number         // Days (standard: 365)
    annualInspectionRequired: boolean  // Annual fire dept inspection
    requiresFireSafetyManager: boolean // Designated fire safety manager
  }

  // Alert thresholds
  alertThresholds: {
    expiringWarningDays: number        // Default: 30 days
    expiringCriticalDays: number       // Default: 15 days
    overdueEscalationDays: number      // Default: 7 days
  }

  // Country-specific settings
  countrySpecific: {
    legalReferences: string[]          // Legal acts references
    competentAuthority: string         // Ex: 'ISU București'
    authorityUrl: string | null
    emergencyNumber: string            // Ex: '112', '0800...'
    mandatoryDocuments: string[]       // Required documentation
  }
}

// ── PSI Module Definition ──
export const psiModule: IModule = {
  key: 'psi',
  name_en: 'Fire Safety (PSI)',
  name_localized: {
    ro: 'PSI (Prevenirea și Stingerea Incendiilor)',
    bg: 'ПБЗ (Пожарна безопасност)',
    hu: 'Tűzvédelem',
    de: 'Brandschutz',
    pl: 'Ochrona przeciwpożarowa',
    en: 'Fire Safety (PSI)',
  },
  description_en: 'Fire safety compliance: equipment tracking, PSI trainings, evacuation plans, fire authorizations',
  icon: 'Flame',
  category: 'standalone',
  is_base: false,
  depends_on: ['ssm-core'], // Depends on SSM Core for employee and training infrastructure
  incompatible: [], // Compatible with all other modules

  /**
   * Returns default PSI module configuration
   */
  getDefaultConfig(): PsiModuleConfig {
    return {
      inspectionFrequencies: {
        fireExtinguisher: 365,
        fireHydrant: 180,
        smokeDetector: 180,
        fireAlarmSystem: 365,
        emergencyLighting: 180,
        evacuationSignage: 365,
        fireHose: 365,
        fireBlanket: 365,
        fireProofDoors: 365,
      },

      extinguisherTypes: [
        {
          code: 'ABC-6kg',
          name: 'Pulbere ABC 6kg',
          agent: 'powder',
          capacity: 6,
          suitableFor: ['A', 'B', 'C'],
          inspectionInterval: 365,
          maxLifespan: 20,
        },
        {
          code: 'CO2-5kg',
          name: 'Dioxid de carbon CO2 5kg',
          agent: 'co2',
          capacity: 5,
          suitableFor: ['B', 'C'],
          inspectionInterval: 365,
          maxLifespan: 20,
        },
        {
          code: 'FOAM-9L',
          name: 'Spumă 9L',
          agent: 'foam',
          capacity: 9,
          suitableFor: ['A', 'B'],
          inspectionInterval: 365,
          maxLifespan: 20,
        },
        {
          code: 'WATER-9L',
          name: 'Apă 9L',
          agent: 'water',
          capacity: 9,
          suitableFor: ['A'],
          inspectionInterval: 365,
          maxLifespan: 20,
        },
      ],

      trainingConfig: {
        initialTrainingRequired: true,
        refreshInterval: 365,
        minimumDuration: 4,
        requiresExternalTrainer: false,
        certificateValidity: 365,
      },

      evacuationConfig: {
        planReviewInterval: 365,
        drillFrequency: 180,
        requiresFloorPlan: true,
        requiresAssemblyPoints: true,
        requiresEvacuationLeader: true,
      },

      authorizationConfig: {
        requiresPsiAuthorization: true,
        authValidityPeriod: 365,
        annualInspectionRequired: true,
        requiresFireSafetyManager: true,
      },

      alertThresholds: {
        expiringWarningDays: 30,
        expiringCriticalDays: 15,
        overdueEscalationDays: 7,
      },

      countrySpecific: {
        legalReferences: [
          'Legea nr. 307/2006 privind apărarea împotriva incendiilor',
          'HG nr. 1492/2006 - Normele generale de apărare împotriva incendiilor',
        ],
        competentAuthority: 'Inspectoratul pentru Situații de Urgență (ISU)',
        authorityUrl: 'https://www.igsu.ro',
        emergencyNumber: '112',
        mandatoryDocuments: [
          'Autorizație PSI',
          'Plan de evacuare',
          'Registru de evidență echipamente PSI',
          'Certificate instruire PSI',
        ],
      },
    }
  },

  /**
   * Validates PSI module configuration
   * @param config - Configuration object to validate
   * @returns true if valid, false otherwise
   */
  validateConfig(config: any): boolean {
    if (!config || typeof config !== 'object') return false

    // Validate inspection frequencies
    if (!config.inspectionFrequencies) return false
    const frequencies = config.inspectionFrequencies
    if (
      typeof frequencies.fireExtinguisher !== 'number' ||
      typeof frequencies.fireHydrant !== 'number' ||
      typeof frequencies.smokeDetector !== 'number' ||
      frequencies.fireExtinguisher <= 0 ||
      frequencies.fireHydrant <= 0 ||
      frequencies.smokeDetector <= 0
    ) {
      return false
    }

    // Validate extinguisher types
    if (!Array.isArray(config.extinguisherTypes)) return false
    for (const type of config.extinguisherTypes) {
      if (
        !type.code ||
        !type.name ||
        !type.agent ||
        typeof type.capacity !== 'number' ||
        !Array.isArray(type.suitableFor) ||
        type.capacity <= 0
      ) {
        return false
      }
    }

    // Validate training config
    if (!config.trainingConfig) return false
    const training = config.trainingConfig
    if (
      typeof training.initialTrainingRequired !== 'boolean' ||
      typeof training.refreshInterval !== 'number' ||
      typeof training.minimumDuration !== 'number' ||
      training.refreshInterval <= 0 ||
      training.minimumDuration <= 0
    ) {
      return false
    }

    // Validate evacuation config
    if (!config.evacuationConfig) return false
    const evacuation = config.evacuationConfig
    if (
      typeof evacuation.planReviewInterval !== 'number' ||
      typeof evacuation.drillFrequency !== 'number' ||
      typeof evacuation.requiresFloorPlan !== 'boolean' ||
      evacuation.planReviewInterval <= 0 ||
      evacuation.drillFrequency <= 0
    ) {
      return false
    }

    // Validate authorization config
    if (!config.authorizationConfig) return false
    const auth = config.authorizationConfig
    if (
      typeof auth.requiresPsiAuthorization !== 'boolean' ||
      typeof auth.authValidityPeriod !== 'number' ||
      typeof auth.annualInspectionRequired !== 'boolean' ||
      auth.authValidityPeriod <= 0
    ) {
      return false
    }

    // Validate alert thresholds
    if (!config.alertThresholds) return false
    const alerts = config.alertThresholds
    if (
      typeof alerts.expiringWarningDays !== 'number' ||
      typeof alerts.expiringCriticalDays !== 'number' ||
      alerts.expiringWarningDays <= 0 ||
      alerts.expiringCriticalDays <= 0
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
      !Array.isArray(country.mandatoryDocuments)
    ) {
      return false
    }

    return true
  },
}

// ── Country-Specific PSI Configurations ──

/**
 * Romania PSI configuration
 */
export function getRomaniaPsiConfig(): Partial<PsiModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Legea nr. 307/2006 privind apărarea împotriva incendiilor',
        'HG nr. 1492/2006 - Normele generale de apărare împotriva incendiilor',
        'Ordinul MAI nr. 163/2007 - Normele metodologice',
      ],
      competentAuthority: 'Inspectoratul pentru Situații de Urgență (ISU)',
      authorityUrl: 'https://www.igsu.ro',
      emergencyNumber: '112',
      mandatoryDocuments: [
        'Autorizație PSI',
        'Plan de evacuare',
        'Registru de evidență echipamente PSI',
        'Certificate instruire PSI',
        'Raport anual de verificare',
      ],
    },
  }
}

/**
 * Bulgaria PSI configuration
 */
export function getBulgariaPsiConfig(): Partial<PsiModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Закон за защита при бедствия (ЗЗБ)',
        'Правилник за пожарната безопасност',
      ],
      competentAuthority: 'Главна дирекция "Пожарна безопасност и защита на населението"',
      authorityUrl: 'https://www.mvr.bg/gdpbzn',
      emergencyNumber: '112',
      mandatoryDocuments: [
        'Удостоверение за пожарна безопасност',
        'План за евакуация',
        'Регистър на противопожарното оборудване',
        'Сертификати за обучение',
      ],
    },
  }
}

/**
 * Hungary PSI configuration
 */
export function getHungaryPsiConfig(): Partial<PsiModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Katasztrófavédelmi törvény (2011. évi CXXVIII. törvény)',
        'Tűzvédelmi műszaki irányelvek',
      ],
      competentAuthority: 'Országos Katasztrófavédelmi Főigazgatóság',
      authorityUrl: 'https://www.katasztrofavedelem.hu',
      emergencyNumber: '112',
      mandatoryDocuments: [
        'Tűzvédelmi engedély',
        'Menekülési terv',
        'Tűzoltó berendezések nyilvántartása',
        'Tűzvédelmi oktatási bizonyítványok',
      ],
    },
  }
}

/**
 * Germany PSI configuration
 */
export function getGermanyPsiConfig(): Partial<PsiModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Arbeitsstättenverordnung (ArbStättV)',
        'ASR A2.2 - Maßnahmen gegen Brände',
        'DGUV Information 205-001',
      ],
      competentAuthority: 'Feuerwehr / Gewerbeaufsicht',
      authorityUrl: null,
      emergencyNumber: '112',
      mandatoryDocuments: [
        'Brandschutzordnung',
        'Flucht- und Rettungspläne',
        'Prüfnachweise Feuerlöscher',
        'Schulungsnachweise',
      ],
    },
  }
}

/**
 * Poland PSI configuration
 */
export function getPolandPsiConfig(): Partial<PsiModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Ustawa o ochronie przeciwpożarowej (z dnia 24 sierpnia 1991 r.)',
        'Rozporządzenie w sprawie ochrony przeciwpożarowej budynków',
      ],
      competentAuthority: 'Komenda Główna Państwowej Straży Pożarnej',
      authorityUrl: 'https://www.straz.gov.pl',
      emergencyNumber: '112',
      mandatoryDocuments: [
        'Instrukcja bezpieczeństwa pożarowego',
        'Plan ewakuacji',
        'Rejestr sprzętu przeciwpożarowego',
        'Certyfikaty szkoleń',
      ],
    },
  }
}

// ── Helper Functions ──

/**
 * Get PSI configuration for a specific country
 * @param countryCode - Country code (RO, BG, HU, DE, PL)
 * @returns Merged configuration with country-specific settings
 */
export function getPsiConfigForCountry(countryCode: string): PsiModuleConfig {
  const baseConfig = psiModule.getDefaultConfig()

  let countrySpecific: Partial<PsiModuleConfig> | undefined

  switch (countryCode) {
    case 'RO':
      countrySpecific = getRomaniaPsiConfig()
      break
    case 'BG':
      countrySpecific = getBulgariaPsiConfig()
      break
    case 'HU':
      countrySpecific = getHungaryPsiConfig()
      break
    case 'DE':
      countrySpecific = getGermanyPsiConfig()
      break
    case 'PL':
      countrySpecific = getPolandPsiConfig()
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
 * Calculate next inspection date based on equipment type and config
 * @param equipmentType - Type of fire safety equipment
 * @param lastInspectionDate - Last inspection date (ISO string)
 * @param config - PSI module configuration
 * @returns Next inspection date (ISO string)
 */
export function calculateNextInspectionDate(
  equipmentType: keyof PsiModuleConfig['inspectionFrequencies'],
  lastInspectionDate: string,
  config: PsiModuleConfig
): string {
  const lastDate = new Date(lastInspectionDate)
  const intervalDays = config.inspectionFrequencies[equipmentType]
  const nextDate = new Date(lastDate.getTime() + intervalDays * 24 * 60 * 60 * 1000)
  return nextDate.toISOString().split('T')[0]
}

/**
 * Calculate expiry date for PSI training certificate
 * @param completionDate - Training completion date (ISO string)
 * @param config - PSI module configuration
 * @returns Expiry date (ISO string)
 */
export function calculateTrainingExpiryDate(
  completionDate: string,
  config: PsiModuleConfig
): string {
  const completion = new Date(completionDate)
  const validityDays = config.trainingConfig.certificateValidity
  const expiry = new Date(completion.getTime() + validityDays * 24 * 60 * 60 * 1000)
  return expiry.toISOString().split('T')[0]
}

// ── Exports ──
export default psiModule
