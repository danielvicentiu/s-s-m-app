// lib/modules/equipment-module.ts
// OP-LEGO — Equipment Module (Echipamente - EIP și ISCIR)
// Equipment tracking: EIP (Individual Protection Equipment), ISCIR equipment, inspections, certifications
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
  getDefaultConfig: () => EquipmentModuleConfig
  validateConfig: (config: any) => boolean
}

// ── Equipment Module Configuration ──
export interface EquipmentModuleConfig {
  // EIP (Echipamente Individuale de Protecție) Configuration
  eipConfig: {
    requiresPersonalAssignment: boolean      // Assign EIP to specific employees
    requiresSizeTracking: boolean            // Track sizes (clothing, shoes, gloves)
    autoReplaceOnExpiry: boolean            // Auto-generate replacement alert
    trackingMethod: 'per_employee' | 'pool' | 'both'  // Assignment method
    requiresSignature: boolean              // Employee signature required on receipt
  }

  // EIP Categories with replacement intervals (days)
  eipCategories: {
    category: string                        // Ex: 'helmet', 'gloves', 'boots', 'vest'
    name: string                            // Display name
    replacementInterval: number             // Days until replacement
    isMandatory: boolean                    // Required for all employees
    requiresCertification: boolean          // CE certification required
    validityTracking: 'expiry_date' | 'usage_time' | 'both'
  }[]

  // ISCIR Equipment Configuration
  iscirConfig: {
    enableIscirTracking: boolean            // Enable ISCIR equipment tracking
    requiresIscirAuthorization: boolean     // ISCIR authorization required
    requiresOperatorLicense: boolean        // Operator license required
    requiresPeriodicInspection: boolean     // Periodic ISCIR inspections
    inspectionGracePeriodDays: number       // Grace period before overdue
  }

  // ISCIR Equipment Types
  iscirEquipmentTypes: {
    code: string                            // Ex: 'TL-A', 'RL-C', 'RU-D'
    name: string                            // Ex: 'Lift de persoane', 'Cazane termice'
    category: 'pressure_vessels' | 'lifting_equipment' | 'gas_installations' | 'other'
    inspectionInterval: number              // Days
    requiresExternalInspector: boolean      // External certified inspector required
    requiresIscirCertificate: boolean       // ISCIR certificate required
    maxOperatingPressure?: number           // bar (for pressure vessels)
    maxLiftingCapacity?: number             // kg (for lifting equipment)
  }[]

  // Inspection frequencies (days)
  inspectionFrequencies: {
    eipVisualInspection: number             // Visual inspection of EIP (default: 30 days)
    eipFunctionalTest: number               // Functional test (default: 90 days)
    iscirPressureVessels: number            // Pressure vessels (default: 365 days)
    iscirLiftingEquipment: number           // Cranes, lifts (default: 365 days)
    iscirGasInstallations: number           // Gas installations (default: 365 days)
    toolsAndMachinery: number               // General tools (default: 180 days)
  }

  // Certification requirements
  certificationConfig: {
    requiresCertificate: boolean            // Equipment certificate required
    certificateValidityPeriod: number       // Days
    requiresCEMarking: boolean              // CE marking required
    requiresConformityDeclaration: boolean  // Declaration of conformity required
  }

  // Alert thresholds
  alertThresholds: {
    expiringWarningDays: number             // Default: 30 days
    expiringCriticalDays: number            // Default: 15 days
    overdueEscalationDays: number           // Default: 7 days
    maintenanceDueSoonDays: number          // Default: 14 days
  }

  // Inventory tracking
  inventoryConfig: {
    trackSerialNumbers: boolean             // Track individual serial numbers
    trackLocation: boolean                  // Track equipment location
    enableQRCode: boolean                   // Enable QR code scanning
    requiresPhotoDocumentation: boolean     // Photo upload for equipment
    enableMaintenanceLog: boolean           // Maintenance history log
  }

  // Country-specific settings
  countrySpecific: {
    legalReferences: string[]               // Legal acts references
    competentAuthority: string              // Ex: 'ISCIR'
    authorityUrl: string | null
    emergencyNumber: string                 // Ex: '112'
    mandatoryDocuments: string[]            // Required documentation
    requiresIscir: boolean                  // ISCIR applies to this country
    iscirAuthorityName: string | null       // ISCIR or equivalent authority name
  }
}

// ── Equipment Module Definition ──
export const equipmentModule: IModule = {
  key: 'echipamente',
  name_en: 'Equipment (EIP & ISCIR)',
  name_localized: {
    ro: 'Echipamente (EIP și ISCIR)',
    bg: 'Оборудване (ЛПС и регулирана техника)',
    hu: 'Felszerelések (EEM és műszaki felügyelet)',
    de: 'Ausrüstung (PSA und technische Überwachung)',
    pl: 'Wyposażenie (ŚOI i nadzór techniczny)',
    en: 'Equipment (PPE & Technical Supervision)',
  },
  description_en: 'Equipment management: individual protection equipment (EIP/PPE), ISCIR equipment tracking, inspections, certifications',
  icon: 'Wrench',
  category: 'standalone',
  is_base: false,
  depends_on: ['ssm-core'], // Depends on SSM Core for employee assignments
  incompatible: [], // Compatible with all other modules

  /**
   * Returns default Equipment module configuration
   */
  getDefaultConfig(): EquipmentModuleConfig {
    return {
      eipConfig: {
        requiresPersonalAssignment: true,
        requiresSizeTracking: true,
        autoReplaceOnExpiry: true,
        trackingMethod: 'per_employee',
        requiresSignature: true,
      },

      eipCategories: [
        {
          category: 'helmet',
          name: 'Cască de protecție',
          replacementInterval: 730, // 2 years
          isMandatory: true,
          requiresCertification: true,
          validityTracking: 'expiry_date',
        },
        {
          category: 'safety_boots',
          name: 'Încălțăminte de protecție',
          replacementInterval: 365, // 1 year
          isMandatory: true,
          requiresCertification: true,
          validityTracking: 'both',
        },
        {
          category: 'gloves',
          name: 'Mănuși de protecție',
          replacementInterval: 90, // 3 months
          isMandatory: true,
          requiresCertification: true,
          validityTracking: 'usage_time',
        },
        {
          category: 'vest',
          name: 'Vestă de protecție / Uniformă',
          replacementInterval: 365, // 1 year
          isMandatory: true,
          requiresCertification: false,
          validityTracking: 'usage_time',
        },
        {
          category: 'goggles',
          name: 'Ochelari de protecție',
          replacementInterval: 365, // 1 year
          isMandatory: false,
          requiresCertification: true,
          validityTracking: 'expiry_date',
        },
        {
          category: 'respirator',
          name: 'Mască / Respirator',
          replacementInterval: 180, // 6 months
          isMandatory: false,
          requiresCertification: true,
          validityTracking: 'expiry_date',
        },
        {
          category: 'ear_protection',
          name: 'Protecție auditivă',
          replacementInterval: 365, // 1 year
          isMandatory: false,
          requiresCertification: true,
          validityTracking: 'expiry_date',
        },
        {
          category: 'harness',
          name: 'Ham de siguranță (lucru la înălțime)',
          replacementInterval: 365, // 1 year
          isMandatory: false,
          requiresCertification: true,
          validityTracking: 'expiry_date',
        },
      ],

      iscirConfig: {
        enableIscirTracking: true,
        requiresIscirAuthorization: true,
        requiresOperatorLicense: true,
        requiresPeriodicInspection: true,
        inspectionGracePeriodDays: 7,
      },

      iscirEquipmentTypes: [
        {
          code: 'TL-A',
          name: 'Lift de persoane',
          category: 'lifting_equipment',
          inspectionInterval: 365,
          requiresExternalInspector: true,
          requiresIscirCertificate: true,
          maxLiftingCapacity: 1000,
        },
        {
          code: 'TL-M',
          name: 'Lift de marfă',
          category: 'lifting_equipment',
          inspectionInterval: 365,
          requiresExternalInspector: true,
          requiresIscirCertificate: true,
          maxLiftingCapacity: 2000,
        },
        {
          code: 'MC',
          name: 'Macara / Elevator',
          category: 'lifting_equipment',
          inspectionInterval: 180,
          requiresExternalInspector: true,
          requiresIscirCertificate: true,
          maxLiftingCapacity: 5000,
        },
        {
          code: 'RL-C',
          name: 'Cazan termic (abur/apă caldă)',
          category: 'pressure_vessels',
          inspectionInterval: 365,
          requiresExternalInspector: true,
          requiresIscirCertificate: true,
          maxOperatingPressure: 16,
        },
        {
          code: 'RU-D',
          name: 'Rezervor sub presiune',
          category: 'pressure_vessels',
          inspectionInterval: 730, // 2 years
          requiresExternalInspector: true,
          requiresIscirCertificate: true,
          maxOperatingPressure: 10,
        },
        {
          code: 'IG-GPL',
          name: 'Instalație GPL/Gaze naturale',
          category: 'gas_installations',
          inspectionInterval: 365,
          requiresExternalInspector: true,
          requiresIscirCertificate: true,
        },
        {
          code: 'IG-OXIGEN',
          name: 'Instalație oxigen/gaze medicale',
          category: 'gas_installations',
          inspectionInterval: 365,
          requiresExternalInspector: true,
          requiresIscirCertificate: true,
        },
      ],

      inspectionFrequencies: {
        eipVisualInspection: 30,
        eipFunctionalTest: 90,
        iscirPressureVessels: 365,
        iscirLiftingEquipment: 365,
        iscirGasInstallations: 365,
        toolsAndMachinery: 180,
      },

      certificationConfig: {
        requiresCertificate: true,
        certificateValidityPeriod: 365,
        requiresCEMarking: true,
        requiresConformityDeclaration: true,
      },

      alertThresholds: {
        expiringWarningDays: 30,
        expiringCriticalDays: 15,
        overdueEscalationDays: 7,
        maintenanceDueSoonDays: 14,
      },

      inventoryConfig: {
        trackSerialNumbers: true,
        trackLocation: true,
        enableQRCode: true,
        requiresPhotoDocumentation: true,
        enableMaintenanceLog: true,
      },

      countrySpecific: {
        legalReferences: [
          'HG nr. 1146/2006 - Cerințe minime de securitate și sănătate pentru EIP',
          'Legea nr. 144/2016 - Inspecția Tehnică (ISCIR)',
          'NTPEE 2018 - Normativ tehnic pentru producerea energiei electrice',
        ],
        competentAuthority: 'ISCIR (Inspecția de Stat pentru Controlul Cazanelor)',
        authorityUrl: 'https://www.iscir.ro',
        emergencyNumber: '112',
        mandatoryDocuments: [
          'Fișe EIP per angajat',
          'Certificate de conformitate EIP',
          'Autorizație ISCIR (dacă aplicabil)',
          'Carte de identitate echipament ISCIR',
          'Proces verbal de verificare periodică',
          'Autorizație operator echipament',
        ],
        requiresIscir: true,
        iscirAuthorityName: 'ISCIR',
      },
    }
  },

  /**
   * Validates Equipment module configuration
   * @param config - Configuration object to validate
   * @returns true if valid, false otherwise
   */
  validateConfig(config: any): boolean {
    if (!config || typeof config !== 'object') return false

    // Validate EIP config
    if (!config.eipConfig) return false
    const eipConfig = config.eipConfig
    if (
      typeof eipConfig.requiresPersonalAssignment !== 'boolean' ||
      typeof eipConfig.requiresSizeTracking !== 'boolean' ||
      typeof eipConfig.autoReplaceOnExpiry !== 'boolean' ||
      typeof eipConfig.requiresSignature !== 'boolean' ||
      !['per_employee', 'pool', 'both'].includes(eipConfig.trackingMethod)
    ) {
      return false
    }

    // Validate EIP categories
    if (!Array.isArray(config.eipCategories)) return false
    for (const category of config.eipCategories) {
      if (
        !category.category ||
        !category.name ||
        typeof category.replacementInterval !== 'number' ||
        typeof category.isMandatory !== 'boolean' ||
        typeof category.requiresCertification !== 'boolean' ||
        category.replacementInterval <= 0 ||
        !['expiry_date', 'usage_time', 'both'].includes(category.validityTracking)
      ) {
        return false
      }
    }

    // Validate ISCIR config
    if (!config.iscirConfig) return false
    const iscirConfig = config.iscirConfig
    if (
      typeof iscirConfig.enableIscirTracking !== 'boolean' ||
      typeof iscirConfig.requiresIscirAuthorization !== 'boolean' ||
      typeof iscirConfig.requiresOperatorLicense !== 'boolean' ||
      typeof iscirConfig.requiresPeriodicInspection !== 'boolean' ||
      typeof iscirConfig.inspectionGracePeriodDays !== 'number' ||
      iscirConfig.inspectionGracePeriodDays < 0
    ) {
      return false
    }

    // Validate ISCIR equipment types
    if (!Array.isArray(config.iscirEquipmentTypes)) return false
    for (const type of config.iscirEquipmentTypes) {
      if (
        !type.code ||
        !type.name ||
        !['pressure_vessels', 'lifting_equipment', 'gas_installations', 'other'].includes(type.category) ||
        typeof type.inspectionInterval !== 'number' ||
        typeof type.requiresExternalInspector !== 'boolean' ||
        typeof type.requiresIscirCertificate !== 'boolean' ||
        type.inspectionInterval <= 0
      ) {
        return false
      }
    }

    // Validate inspection frequencies
    if (!config.inspectionFrequencies) return false
    const frequencies = config.inspectionFrequencies
    if (
      typeof frequencies.eipVisualInspection !== 'number' ||
      typeof frequencies.eipFunctionalTest !== 'number' ||
      typeof frequencies.iscirPressureVessels !== 'number' ||
      typeof frequencies.iscirLiftingEquipment !== 'number' ||
      typeof frequencies.iscirGasInstallations !== 'number' ||
      typeof frequencies.toolsAndMachinery !== 'number' ||
      frequencies.eipVisualInspection <= 0 ||
      frequencies.eipFunctionalTest <= 0 ||
      frequencies.iscirPressureVessels <= 0 ||
      frequencies.iscirLiftingEquipment <= 0 ||
      frequencies.iscirGasInstallations <= 0 ||
      frequencies.toolsAndMachinery <= 0
    ) {
      return false
    }

    // Validate certification config
    if (!config.certificationConfig) return false
    const certConfig = config.certificationConfig
    if (
      typeof certConfig.requiresCertificate !== 'boolean' ||
      typeof certConfig.certificateValidityPeriod !== 'number' ||
      typeof certConfig.requiresCEMarking !== 'boolean' ||
      typeof certConfig.requiresConformityDeclaration !== 'boolean' ||
      certConfig.certificateValidityPeriod <= 0
    ) {
      return false
    }

    // Validate alert thresholds
    if (!config.alertThresholds) return false
    const alerts = config.alertThresholds
    if (
      typeof alerts.expiringWarningDays !== 'number' ||
      typeof alerts.expiringCriticalDays !== 'number' ||
      typeof alerts.overdueEscalationDays !== 'number' ||
      typeof alerts.maintenanceDueSoonDays !== 'number' ||
      alerts.expiringWarningDays <= 0 ||
      alerts.expiringCriticalDays <= 0 ||
      alerts.overdueEscalationDays <= 0 ||
      alerts.maintenanceDueSoonDays <= 0
    ) {
      return false
    }

    // Validate inventory config
    if (!config.inventoryConfig) return false
    const inventory = config.inventoryConfig
    if (
      typeof inventory.trackSerialNumbers !== 'boolean' ||
      typeof inventory.trackLocation !== 'boolean' ||
      typeof inventory.enableQRCode !== 'boolean' ||
      typeof inventory.requiresPhotoDocumentation !== 'boolean' ||
      typeof inventory.enableMaintenanceLog !== 'boolean'
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
      !Array.isArray(country.mandatoryDocuments) ||
      typeof country.requiresIscir !== 'boolean'
    ) {
      return false
    }

    return true
  },
}

// ── Country-Specific Equipment Configurations ──

/**
 * Romania Equipment configuration
 */
export function getRomaniaEquipmentConfig(): Partial<EquipmentModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'HG nr. 1146/2006 - Cerințe minime de securitate și sănătate pentru EIP',
        'Legea nr. 144/2016 - Inspecția Tehnică (ISCIR)',
        'NTPEE 2018 - Normativ tehnic pentru producerea energiei electrice',
        'HG nr. 1058/2006 - Cerințe de utilizare a echipamentelor de muncă',
      ],
      competentAuthority: 'ISCIR (Inspecția de Stat pentru Controlul Cazanelor)',
      authorityUrl: 'https://www.iscir.ro',
      emergencyNumber: '112',
      mandatoryDocuments: [
        'Fișe EIP per angajat',
        'Certificate de conformitate EIP',
        'Autorizație ISCIR',
        'Carte de identitate echipament ISCIR',
        'Proces verbal de verificare periodică',
        'Autorizație operator echipament',
      ],
      requiresIscir: true,
      iscirAuthorityName: 'ISCIR',
    },
  }
}

/**
 * Bulgaria Equipment configuration
 */
export function getBulgariaEquipmentConfig(): Partial<EquipmentModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Наредба № 3 за минималните изисквания за ЛПС',
        'Закон за техническите изисквания към продуктите',
      ],
      competentAuthority: 'Изпълнителна агенция "Главна инспекция по труда"',
      authorityUrl: 'https://www.gli.government.bg',
      emergencyNumber: '112',
      mandatoryDocuments: [
        'Документи за ЛПС',
        'Сертификати за съответствие',
        'Технически паспорт',
        'Протоколи за проверка',
      ],
      requiresIscir: false, // Different system in Bulgaria
      iscirAuthorityName: null,
    },
  }
}

/**
 * Hungary Equipment configuration
 */
export function getHungaryEquipmentConfig(): Partial<EquipmentModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        '63/1999. (XII. 8.) EüM rendelet - Egyéni védőeszközök',
        'Munka törvénykönyve - Munkavédelmi előírások',
      ],
      competentAuthority: 'Nemzeti Munkaügyi Hivatal',
      authorityUrl: 'https://www.munkaugy.hu',
      emergencyNumber: '112',
      mandatoryDocuments: [
        'EEM nyilvántartás',
        'Megfelelőségi tanúsítványok',
        'Karbantartási napló',
        'Vizsgálati jegyzőkönyvek',
      ],
      requiresIscir: false, // Different system in Hungary
      iscirAuthorityName: null,
    },
  }
}

/**
 * Germany Equipment configuration
 */
export function getGermanyEquipmentConfig(): Partial<EquipmentModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'PSA-Benutzungsverordnung (PSA-BV)',
        'Betriebssicherheitsverordnung (BetrSichV)',
        'DGUV Vorschrift 1 - PSA-Regelungen',
      ],
      competentAuthority: 'Gewerbeaufsichtsamt / TÜV',
      authorityUrl: null,
      emergencyNumber: '112',
      mandatoryDocuments: [
        'PSA-Nachweis',
        'CE-Kennzeichnung',
        'Prüfprotokoll',
        'Betriebsanweisung',
      ],
      requiresIscir: false, // TÜV system instead
      iscirAuthorityName: 'TÜV',
    },
  }
}

/**
 * Poland Equipment configuration
 */
export function getPolandEquipmentConfig(): Partial<EquipmentModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Rozporządzenie w sprawie środków ochrony indywidualnej',
        'Kodeks pracy - Dział X (BHP)',
      ],
      competentAuthority: 'Państwowa Inspekcja Pracy',
      authorityUrl: 'https://www.pip.gov.pl',
      emergencyNumber: '112',
      mandatoryDocuments: [
        'Karty przydziału ŚOI',
        'Certyfikaty zgodności',
        'Dziennik konserwacji',
        'Protokoły kontroli',
      ],
      requiresIscir: false, // UDT system in Poland
      iscirAuthorityName: 'UDT',
    },
  }
}

// ── Helper Functions ──

/**
 * Get Equipment configuration for a specific country
 * @param countryCode - Country code (RO, BG, HU, DE, PL)
 * @returns Merged configuration with country-specific settings
 */
export function getEquipmentConfigForCountry(countryCode: string): EquipmentModuleConfig {
  const baseConfig = equipmentModule.getDefaultConfig()

  let countrySpecific: Partial<EquipmentModuleConfig> | undefined

  switch (countryCode) {
    case 'RO':
      countrySpecific = getRomaniaEquipmentConfig()
      break
    case 'BG':
      countrySpecific = getBulgariaEquipmentConfig()
      break
    case 'HU':
      countrySpecific = getHungaryEquipmentConfig()
      break
    case 'DE':
      countrySpecific = getGermanyEquipmentConfig()
      break
    case 'PL':
      countrySpecific = getPolandEquipmentConfig()
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
 * Calculate next inspection date for equipment
 * @param equipmentType - Type of equipment
 * @param lastInspectionDate - Last inspection date (ISO string)
 * @param config - Equipment module configuration
 * @returns Next inspection date (ISO string)
 */
export function calculateNextInspectionDate(
  equipmentType: keyof EquipmentModuleConfig['inspectionFrequencies'],
  lastInspectionDate: string,
  config: EquipmentModuleConfig
): string {
  const lastDate = new Date(lastInspectionDate)
  const intervalDays = config.inspectionFrequencies[equipmentType]
  const nextDate = new Date(lastDate.getTime() + intervalDays * 24 * 60 * 60 * 1000)
  return nextDate.toISOString().split('T')[0]
}

/**
 * Calculate EIP replacement date
 * @param assignmentDate - Date when EIP was assigned (ISO string)
 * @param eipCategory - EIP category object
 * @returns Replacement due date (ISO string)
 */
export function calculateEipReplacementDate(
  assignmentDate: string,
  eipCategory: EquipmentModuleConfig['eipCategories'][0]
): string {
  const assignment = new Date(assignmentDate)
  const intervalDays = eipCategory.replacementInterval
  const replacementDate = new Date(assignment.getTime() + intervalDays * 24 * 60 * 60 * 1000)
  return replacementDate.toISOString().split('T')[0]
}

/**
 * Check if equipment requires ISCIR certification
 * @param equipmentCode - Equipment code (e.g., 'TL-A', 'RL-C')
 * @param config - Equipment module configuration
 * @returns true if ISCIR certification required
 */
export function requiresIscirCertification(
  equipmentCode: string,
  config: EquipmentModuleConfig
): boolean {
  const equipmentType = config.iscirEquipmentTypes.find(type => type.code === equipmentCode)
  return equipmentType?.requiresIscirCertificate ?? false
}

/**
 * Get inspection interval for ISCIR equipment
 * @param equipmentCode - Equipment code
 * @param config - Equipment module configuration
 * @returns Inspection interval in days, or null if not found
 */
export function getIscirInspectionInterval(
  equipmentCode: string,
  config: EquipmentModuleConfig
): number | null {
  const equipmentType = config.iscirEquipmentTypes.find(type => type.code === equipmentCode)
  return equipmentType?.inspectionInterval ?? null
}

/**
 * Calculate equipment compliance score
 * @param stats - Equipment statistics
 * @returns Compliance score (0-100)
 */
export function calculateEquipmentComplianceScore(stats: {
  totalEipAssignments: number
  validEipAssignments: number
  totalIscirEquipment: number
  validIscirCertificates: number
  overdueInspections: number
}): number {
  if (stats.totalEipAssignments === 0 && stats.totalIscirEquipment === 0) return 100

  let score = 0
  let totalWeight = 0

  // EIP compliance (50% weight if applicable)
  if (stats.totalEipAssignments > 0) {
    const eipScore = (stats.validEipAssignments / stats.totalEipAssignments) * 100
    score += eipScore * 0.5
    totalWeight += 0.5
  }

  // ISCIR compliance (40% weight if applicable)
  if (stats.totalIscirEquipment > 0) {
    const iscirScore = (stats.validIscirCertificates / stats.totalIscirEquipment) * 100
    score += iscirScore * 0.4
    totalWeight += 0.4
  }

  // Inspection compliance (10% weight)
  const inspectionPenalty = Math.min(stats.overdueInspections * 5, 10) // -5 points per overdue, max -10
  score += Math.max(0, 10 - inspectionPenalty)
  totalWeight += 0.1

  // Normalize if not all categories apply
  return totalWeight > 0 ? Math.round(score / totalWeight * 100) : 100
}

// ── Exports ──
export default equipmentModule
