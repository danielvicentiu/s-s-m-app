// lib/modules/equipment-module.ts
// OP-LEGO — Equipment Module (Echipamente SSM)
// EIP tracking, ISCIR equipment, inspections, certifications
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
  // EIP (Personal Protective Equipment) categories
  eipCategories: {
    category_key: string                   // Ex: 'head', 'eyes', 'hands', 'feet', 'respiratory', 'hearing'
    category_name: string                  // Display name
    icon: string                           // Lucide icon name
    mandatory_fields: string[]             // Required fields for this category
    expiry_type: 'date' | 'usage' | 'condition' | 'none'
    default_validity_days: number | null   // Default expiry period (if expiry_type === 'date')
    requires_certification: boolean        // CE marking, EN standards
    inspection_required: boolean           // Periodic inspection required
    inspection_interval: number | null     // Days between inspections
  }[]

  // ISCIR equipment categories
  iscirCategories: {
    category_key: string                   // Ex: 'pressure_vessel', 'lifting_equipment', 'industrial_installation'
    category_name: string                  // Display name
    registration_required: boolean         // ISCIR registration mandatory
    registration_validity: number          // Years
    periodic_inspection_required: boolean  // ISCIR periodic inspection
    inspection_interval: number            // Days
    operator_license_required: boolean     // Operator must have ISCIR license
    technical_documentation: string[]      // Required technical docs
  }[]

  // Inspection configuration
  inspectionConfig: {
    pre_inspection_alert_days: number      // Alert before inspection due (default: 30)
    inspection_overdue_escalation: number  // Days after due to escalate (default: 7)
    requires_external_inspector: boolean   // External certified inspector required
    inspection_report_mandatory: boolean   // Inspection report upload required
    photo_documentation_required: boolean  // Photo evidence required
  }

  // Certification configuration
  certificationConfig: {
    ce_marking_required: boolean           // CE marking for EIP
    en_standards_tracking: boolean         // Track EN standards compliance
    batch_number_tracking: boolean         // Track batch numbers for recalls
    supplier_certification: boolean        // Supplier certification required
    certificate_validity_check: boolean    // Check certificate expiry
  }

  // Maintenance configuration
  maintenanceConfig: {
    preventive_maintenance_enabled: boolean
    maintenance_schedule_types: ('daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual')[]
    maintenance_log_required: boolean
    spare_parts_tracking: boolean
    maintenance_cost_tracking: boolean
  }

  // Alert thresholds
  alertThresholds: {
    expiring_warning_days: number          // Default: 30 days
    expiring_critical_days: number         // Default: 15 days
    low_stock_threshold: number            // Min quantity alert (default: 2)
    overdue_escalation_days: number        // Default: 7 days
  }

  // Country-specific settings
  countrySpecific: {
    legalReferences: string[]              // Legal acts references
    competentAuthority: string             // Ex: 'ISCIR', 'Inspectoratul Muncii'
    authorityUrl: string | null
    registrationRequired: boolean          // ISCIR registration required
    mandatoryDocuments: string[]           // Required documentation
    inspectionAuthorities: string[]        // Authorized inspection bodies
  }
}

// ── Equipment Module Definition ──
export const equipmentModule: IModule = {
  key: 'echipamente',
  name_en: 'Equipment (EIP & ISCIR)',
  name_localized: {
    ro: 'Echipamente (EIP & ISCIR)',
    bg: 'Оборудване (ЛПС и ИАРА)',
    hu: 'Felszerelések (EBV & ISZIR)',
    de: 'Ausrüstung (PSA & ISCIR)',
    pl: 'Wyposażenie (ŚOI i ISCIR)',
    en: 'Equipment (EIP & ISCIR)',
  },
  description_en: 'Personal protective equipment (PPE/EIP) tracking, ISCIR equipment registration, inspections, and certifications',
  icon: 'HardHat',
  category: 'core',
  is_base: false,
  depends_on: ['ssm'], // Depends on SSM core module
  incompatible: [], // Compatible with all other modules

  /**
   * Returns default Equipment module configuration
   */
  getDefaultConfig(): EquipmentModuleConfig {
    return {
      eipCategories: [
        {
          category_key: 'head',
          category_name: 'Protecția capului',
          icon: 'HardHat',
          mandatory_fields: ['manufacturer', 'model', 'ce_marking', 'en_standard'],
          expiry_type: 'date',
          default_validity_days: 1825, // 5 years
          requires_certification: true,
          inspection_required: true,
          inspection_interval: 180, // 6 months
        },
        {
          category_key: 'eyes',
          category_name: 'Protecția ochilor',
          icon: 'Eye',
          mandatory_fields: ['manufacturer', 'model', 'ce_marking', 'en_standard'],
          expiry_type: 'condition',
          default_validity_days: null,
          requires_certification: true,
          inspection_required: true,
          inspection_interval: 90, // 3 months
        },
        {
          category_key: 'hearing',
          category_name: 'Protecția auzului',
          icon: 'Ear',
          mandatory_fields: ['manufacturer', 'model', 'ce_marking', 'noise_reduction_rating'],
          expiry_type: 'date',
          default_validity_days: 730, // 2 years
          requires_certification: true,
          inspection_required: true,
          inspection_interval: 180, // 6 months
        },
        {
          category_key: 'respiratory',
          category_name: 'Protecția respiratorie',
          icon: 'Wind',
          mandatory_fields: ['manufacturer', 'model', 'ce_marking', 'filter_type', 'protection_class'],
          expiry_type: 'date',
          default_validity_days: 1095, // 3 years
          requires_certification: true,
          inspection_required: true,
          inspection_interval: 90, // 3 months
        },
        {
          category_key: 'hands',
          category_name: 'Protecția mâinilor',
          icon: 'Hand',
          mandatory_fields: ['manufacturer', 'model', 'ce_marking', 'protection_type'],
          expiry_type: 'usage',
          default_validity_days: null,
          requires_certification: true,
          inspection_required: false,
          inspection_interval: null,
        },
        {
          category_key: 'feet',
          category_name: 'Protecția picioarelor',
          icon: 'Footprints',
          mandatory_fields: ['manufacturer', 'model', 'ce_marking', 'safety_class'],
          expiry_type: 'date',
          default_validity_days: 730, // 2 years
          requires_certification: true,
          inspection_required: true,
          inspection_interval: 180, // 6 months
        },
        {
          category_key: 'body',
          category_name: 'Protecția corpului',
          icon: 'ShieldCheck',
          mandatory_fields: ['manufacturer', 'model', 'ce_marking', 'protection_type'],
          expiry_type: 'date',
          default_validity_days: 1095, // 3 years
          requires_certification: true,
          inspection_required: true,
          inspection_interval: 365, // 1 year
        },
        {
          category_key: 'fall_protection',
          category_name: 'Protecție căderi de la înălțime',
          icon: 'Anchor',
          mandatory_fields: ['manufacturer', 'model', 'ce_marking', 'max_load', 'rope_length'],
          expiry_type: 'date',
          default_validity_days: 1825, // 5 years
          requires_certification: true,
          inspection_required: true,
          inspection_interval: 90, // 3 months (critical safety)
        },
      ],

      iscirCategories: [
        {
          category_key: 'pressure_vessel',
          category_name: 'Recipient sub presiune',
          registration_required: true,
          registration_validity: 10, // years
          periodic_inspection_required: true,
          inspection_interval: 1825, // 5 years
          operator_license_required: true,
          technical_documentation: [
            'Documentație tehnică',
            'Carte de identitate',
            'Certificat de înregistrare ISCIR',
            'Autorizație de funcționare',
            'Proces verbal de verificare tehnică',
          ],
        },
        {
          category_key: 'lifting_equipment',
          category_name: 'Echipament de ridicat',
          registration_required: true,
          registration_validity: 10, // years
          periodic_inspection_required: true,
          inspection_interval: 365, // 1 year
          operator_license_required: true,
          technical_documentation: [
            'Documentație tehnică',
            'Carte de identitate',
            'Certificat de înregistrare ISCIR',
            'Autorizație de funcționare',
            'Proces verbal de verificare tehnică',
            'Registru de verificări',
          ],
        },
        {
          category_key: 'industrial_installation',
          category_name: 'Instalație industrială',
          registration_required: true,
          registration_validity: 10, // years
          periodic_inspection_required: true,
          inspection_interval: 1825, // 5 years
          operator_license_required: false,
          technical_documentation: [
            'Documentație tehnică',
            'Autorizație de funcționare',
            'Proces verbal de verificare tehnică',
          ],
        },
      ],

      inspectionConfig: {
        pre_inspection_alert_days: 30,
        inspection_overdue_escalation: 7,
        requires_external_inspector: true,
        inspection_report_mandatory: true,
        photo_documentation_required: true,
      },

      certificationConfig: {
        ce_marking_required: true,
        en_standards_tracking: true,
        batch_number_tracking: true,
        supplier_certification: true,
        certificate_validity_check: true,
      },

      maintenanceConfig: {
        preventive_maintenance_enabled: true,
        maintenance_schedule_types: ['daily', 'weekly', 'monthly', 'quarterly', 'annual'],
        maintenance_log_required: true,
        spare_parts_tracking: true,
        maintenance_cost_tracking: true,
      },

      alertThresholds: {
        expiring_warning_days: 30,
        expiring_critical_days: 15,
        low_stock_threshold: 2,
        overdue_escalation_days: 7,
      },

      countrySpecific: {
        legalReferences: [
          'Legea nr. 319/2006 a securității și sănătății în muncă',
          'HG nr. 1146/2006 - cerințe minime EIP',
          'Ordinul MLPDA nr. 1876/2022 - norme ISCIR',
        ],
        competentAuthority: 'ISCIR / Inspectoratul de Stat în Construcții',
        authorityUrl: 'https://www.iscir.ro',
        registrationRequired: true,
        mandatoryDocuments: [
          'Fișă de evidență EIP',
          'Certificat de conformitate CE',
          'Certificat ISCIR (pentru echipamente)',
          'Proces verbal de verificare tehnică',
          'Registru de inspecții',
        ],
        inspectionAuthorities: [
          'ISCIR',
          'Organisme de inspecție notificate',
          'Personal tehnic autorizat',
        ],
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

    // Validate EIP categories
    if (!Array.isArray(config.eipCategories)) return false
    for (const category of config.eipCategories) {
      if (
        !category.category_key ||
        !category.category_name ||
        !category.icon ||
        !Array.isArray(category.mandatory_fields) ||
        !['date', 'usage', 'condition', 'none'].includes(category.expiry_type) ||
        typeof category.requires_certification !== 'boolean' ||
        typeof category.inspection_required !== 'boolean'
      ) {
        return false
      }

      // If inspection required, interval must be positive
      if (category.inspection_required && (!category.inspection_interval || category.inspection_interval <= 0)) {
        return false
      }
    }

    // Validate ISCIR categories
    if (!Array.isArray(config.iscirCategories)) return false
    for (const category of config.iscirCategories) {
      if (
        !category.category_key ||
        !category.category_name ||
        typeof category.registration_required !== 'boolean' ||
        typeof category.registration_validity !== 'number' ||
        typeof category.periodic_inspection_required !== 'boolean' ||
        typeof category.inspection_interval !== 'number' ||
        typeof category.operator_license_required !== 'boolean' ||
        !Array.isArray(category.technical_documentation) ||
        category.registration_validity <= 0 ||
        category.inspection_interval <= 0
      ) {
        return false
      }
    }

    // Validate inspection config
    if (!config.inspectionConfig) return false
    const inspection = config.inspectionConfig
    if (
      typeof inspection.pre_inspection_alert_days !== 'number' ||
      typeof inspection.inspection_overdue_escalation !== 'number' ||
      typeof inspection.requires_external_inspector !== 'boolean' ||
      typeof inspection.inspection_report_mandatory !== 'boolean' ||
      typeof inspection.photo_documentation_required !== 'boolean' ||
      inspection.pre_inspection_alert_days <= 0 ||
      inspection.inspection_overdue_escalation <= 0
    ) {
      return false
    }

    // Validate certification config
    if (!config.certificationConfig) return false
    const cert = config.certificationConfig
    if (
      typeof cert.ce_marking_required !== 'boolean' ||
      typeof cert.en_standards_tracking !== 'boolean' ||
      typeof cert.batch_number_tracking !== 'boolean' ||
      typeof cert.supplier_certification !== 'boolean' ||
      typeof cert.certificate_validity_check !== 'boolean'
    ) {
      return false
    }

    // Validate maintenance config
    if (!config.maintenanceConfig) return false
    const maintenance = config.maintenanceConfig
    if (
      typeof maintenance.preventive_maintenance_enabled !== 'boolean' ||
      !Array.isArray(maintenance.maintenance_schedule_types) ||
      typeof maintenance.maintenance_log_required !== 'boolean' ||
      typeof maintenance.spare_parts_tracking !== 'boolean' ||
      typeof maintenance.maintenance_cost_tracking !== 'boolean'
    ) {
      return false
    }

    // Validate alert thresholds
    if (!config.alertThresholds) return false
    const alerts = config.alertThresholds
    if (
      typeof alerts.expiring_warning_days !== 'number' ||
      typeof alerts.expiring_critical_days !== 'number' ||
      typeof alerts.low_stock_threshold !== 'number' ||
      typeof alerts.overdue_escalation_days !== 'number' ||
      alerts.expiring_warning_days <= 0 ||
      alerts.expiring_critical_days <= 0 ||
      alerts.low_stock_threshold < 0 ||
      alerts.overdue_escalation_days <= 0
    ) {
      return false
    }

    // Validate country specific
    if (!config.countrySpecific) return false
    const country = config.countrySpecific
    if (
      !Array.isArray(country.legalReferences) ||
      !country.competentAuthority ||
      typeof country.registrationRequired !== 'boolean' ||
      !Array.isArray(country.mandatoryDocuments) ||
      !Array.isArray(country.inspectionAuthorities)
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
        'Legea nr. 319/2006 a securității și sănătății în muncă',
        'HG nr. 1146/2006 - cerințe minime EIP',
        'Ordinul MLPDA nr. 1876/2022 - norme ISCIR',
        'HG nr. 1029/2008 - echipamente de muncă',
      ],
      competentAuthority: 'ISCIR / Inspectoratul de Stat în Construcții',
      authorityUrl: 'https://www.iscir.ro',
      registrationRequired: true,
      mandatoryDocuments: [
        'Fișă de evidență EIP',
        'Certificat de conformitate CE',
        'Declarație de conformitate',
        'Certificat ISCIR (pentru echipamente sub presiune/ridicat)',
        'Proces verbal de verificare tehnică',
        'Registru de inspecții',
        'Carte de identitate echipament (ISCIR)',
      ],
      inspectionAuthorities: [
        'ISCIR',
        'ISC (Inspectoratul de Stat în Construcții)',
        'Organisme de inspecție notificate',
        'Personal tehnic autorizat ISCIR',
      ],
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
        'Закон за здравословни и безопасни условия на труд (ЗЗБУТ)',
        'Наредба № 3 за минималните изисквания за ЛПС',
        'Наредба № РД-07-2 за техническата експлоатация',
      ],
      competentAuthority: 'Изпълнителна агенция "Главна инспекция по труда"',
      authorityUrl: 'https://www.gli.government.bg',
      registrationRequired: true,
      mandatoryDocuments: [
        'Регистрационен лист за ЛПС',
        'Сертификат за съответствие CE',
        'Декларация за съответствие',
        'Протокол от технически преглед',
        'Регистър на проверките',
      ],
      inspectionAuthorities: [
        'Главна инспекция по труда',
        'Нотифицирани органи за оценяване на съответствието',
        'Оторизиран технически персонал',
      ],
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
        '1993. évi XCIII. törvény a munkavédelemről',
        '5/1993. (XII. 26.) MüM rendelet - egyéni védőeszközök',
        '14/2004. (IV. 19.) FMM rendelet - munkavédelmi követelmények',
      ],
      competentAuthority: 'Nemzeti Munkaügyi Hivatal',
      authorityUrl: 'https://www.munkaugy.gov.hu',
      registrationRequired: true,
      mandatoryDocuments: [
        'Egyéni védőeszköz nyilvántartó lap',
        'CE megfelelőségi tanúsítvány',
        'Megfelelőségi nyilatkozat',
        'Műszaki ellenőrzési jegyzőkönyv',
        'Ellenőrzési napló',
      ],
      inspectionAuthorities: [
        'Nemzeti Munkaügyi Hivatal',
        'Bejelentett megfelelőségértékelő szervezetek',
        'Felhatalmazott műszaki szakértők',
      ],
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
        'Arbeitsschutzgesetz (ArbSchG)',
        'PSA-Benutzungsverordnung (PSA-BV)',
        'Betriebssicherheitsverordnung (BetrSichV)',
        'DGUV Vorschrift 1 - Grundsätze der Prävention',
      ],
      competentAuthority: 'Bundesanstalt für Arbeitsschutz und Arbeitsmedizin (BAuA)',
      authorityUrl: 'https://www.baua.de',
      registrationRequired: false,
      mandatoryDocuments: [
        'PSA-Bestandsliste',
        'CE-Konformitätserklärung',
        'Betriebsanleitung',
        'Prüfprotokoll',
        'Prüfbuch',
        'Gefährdungsbeurteilung',
      ],
      inspectionAuthorities: [
        'TÜV (Technischer Überwachungsverein)',
        'DEKRA',
        'Notifizierte Stellen',
        'Befähigte Personen',
      ],
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
        'Ustawa z dnia 26 czerwca 1974 r. - Kodeks pracy',
        'Rozporządzenie w sprawie środków ochrony indywidualnej',
        'Rozporządzenie w sprawie dozoru technicznego',
      ],
      competentAuthority: 'Urząd Dozoru Technicznego (UDT)',
      authorityUrl: 'https://www.udt.gov.pl',
      registrationRequired: true,
      mandatoryDocuments: [
        'Karta ewidencyjna ŚOI',
        'Certyfikat zgodności CE',
        'Deklaracja zgodności',
        'Protokół przeglądu technicznego UDT',
        'Rejestr przeglądów',
        'Książka urządzenia (UDT)',
      ],
      inspectionAuthorities: [
        'Urząd Dozoru Technicznego (UDT)',
        'Państwowa Inspekcja Pracy (PIP)',
        'Jednostki notyfikowane',
        'Upoważniony personel techniczny',
      ],
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
 * @param lastInspectionDate - Last inspection date (ISO string)
 * @param inspectionInterval - Inspection interval in days
 * @returns Next inspection date (ISO string)
 */
export function calculateNextInspectionDate(
  lastInspectionDate: string,
  inspectionInterval: number
): string {
  const lastDate = new Date(lastInspectionDate)
  const nextDate = new Date(lastDate.getTime() + inspectionInterval * 24 * 60 * 60 * 1000)
  return nextDate.toISOString().split('T')[0]
}

/**
 * Calculate equipment expiry date based on purchase date and validity period
 * @param purchaseDate - Purchase date (ISO string)
 * @param validityDays - Validity period in days
 * @returns Expiry date (ISO string)
 */
export function calculateEquipmentExpiryDate(
  purchaseDate: string,
  validityDays: number
): string {
  const purchase = new Date(purchaseDate)
  const expiry = new Date(purchase.getTime() + validityDays * 24 * 60 * 60 * 1000)
  return expiry.toISOString().split('T')[0]
}

/**
 * Calculate ISCIR registration expiry date
 * @param registrationDate - Registration date (ISO string)
 * @param validityYears - Validity period in years
 * @returns Expiry date (ISO string)
 */
export function calculateIscirExpiryDate(
  registrationDate: string,
  validityYears: number
): string {
  const registration = new Date(registrationDate)
  const expiry = new Date(registration)
  expiry.setFullYear(expiry.getFullYear() + validityYears)
  return expiry.toISOString().split('T')[0]
}

/**
 * Get EIP category by key
 * @param categoryKey - Category key
 * @param config - Equipment module configuration
 * @returns EIP category or undefined
 */
export function getEipCategoryByKey(
  categoryKey: string,
  config: EquipmentModuleConfig
): EquipmentModuleConfig['eipCategories'][0] | undefined {
  return config.eipCategories.find(cat => cat.category_key === categoryKey)
}

/**
 * Get ISCIR category by key
 * @param categoryKey - Category key
 * @param config - Equipment module configuration
 * @returns ISCIR category or undefined
 */
export function getIscirCategoryByKey(
  categoryKey: string,
  config: EquipmentModuleConfig
): EquipmentModuleConfig['iscirCategories'][0] | undefined {
  return config.iscirCategories.find(cat => cat.category_key === categoryKey)
}

/**
 * Check if equipment inspection is overdue
 * @param nextInspectionDate - Next inspection date (ISO string)
 * @param overdueThresholdDays - Days past due to consider overdue
 * @returns true if overdue, false otherwise
 */
export function isInspectionOverdue(
  nextInspectionDate: string,
  overdueThresholdDays: number = 0
): boolean {
  const today = new Date()
  const inspectionDate = new Date(nextInspectionDate)
  const threshold = new Date(inspectionDate.getTime() + overdueThresholdDays * 24 * 60 * 60 * 1000)
  return today > threshold
}

/**
 * Check if equipment is expiring soon
 * @param expiryDate - Expiry date (ISO string)
 * @param warningDays - Days before expiry to warn
 * @returns true if expiring soon, false otherwise
 */
export function isExpiringSoon(
  expiryDate: string,
  warningDays: number
): boolean {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const warningDate = new Date(expiry.getTime() - warningDays * 24 * 60 * 60 * 1000)
  return today >= warningDate && today <= expiry
}

// ── Exports ──
export default equipmentModule
