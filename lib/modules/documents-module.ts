// lib/modules/documents-module.ts
// OP-LEGO — Documents Module
// Document management: templates, generation, version control, expiry tracking, digital signatures
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
  getDefaultConfig: () => DocumentsModuleConfig
  validateConfig: (config: any) => boolean
}

// ── Document Template Types ──
export type DocumentTemplateCategory =
  | 'ssm'          // SSM documents (fișe medical, instruire, etc)
  | 'psi'          // PSI documents (planuri evacuare, autorizații)
  | 'medical'      // Medical records
  | 'training'     // Training certificates
  | 'equipment'    // Equipment documentation
  | 'compliance'   // Compliance reports
  | 'contract'     // Contracts and agreements
  | 'policy'       // Internal policies
  | 'procedure'    // Procedures and protocols
  | 'other'        // Other documents

export type DocumentFormat =
  | 'pdf'
  | 'docx'
  | 'xlsx'
  | 'html'
  | 'txt'

export type DocumentStatus =
  | 'draft'        // Draft version
  | 'active'       // Active template/document
  | 'archived'     // Archived (old version)
  | 'expired'      // Expired document

export type SignatureStatus =
  | 'unsigned'     // Not signed yet
  | 'pending'      // Awaiting signature
  | 'signed'       // Fully signed
  | 'rejected'     // Signature rejected

// ── Documents Module Configuration ──
export interface DocumentsModuleConfig {
  // Template configuration
  templateConfig: {
    allowCustomTemplates: boolean         // Allow organizations to create custom templates
    defaultLanguage: string               // Default document language
    supportedFormats: DocumentFormat[]    // Supported export formats
    maxTemplateVersions: number           // Maximum template versions to keep
    autoArchiveOldVersions: boolean       // Auto-archive old template versions
  }

  // Document generation configuration
  generationConfig: {
    includeWatermark: boolean             // Add watermark to generated documents
    watermarkText: string | null          // Custom watermark text
    includeGenerationDate: boolean        // Add generation timestamp
    includeDigitalId: boolean             // Add unique digital identifier
    autoNumbering: boolean                // Auto-number documents
    numberingFormat: string               // Format: "DOC-{YYYY}-{####}"
  }

  // Version control configuration
  versionControl: {
    enabled: boolean                      // Enable version control
    maxVersionsPerDocument: number        // Maximum versions to keep
    autoBackup: boolean                   // Auto-backup on edit
    compareVersionsEnabled: boolean       // Enable version comparison
    trackChanges: boolean                 // Track all changes
  }

  // Expiry tracking configuration
  expiryTracking: {
    enabled: boolean                      // Enable expiry tracking
    defaultValidityDays: number           // Default document validity (days)
    documentExpiryRules: {
      category: DocumentTemplateCategory
      validityDays: number                // Validity period for category
      requiresRenewal: boolean            // Requires manual renewal
      autoExtendable: boolean             // Can be auto-extended
    }[]
    alertThresholds: {
      expiringWarningDays: number         // Warning threshold (default: 30 days)
      expiringCriticalDays: number        // Critical threshold (default: 15 days)
      overdueEscalationDays: number       // Escalation after overdue (default: 7 days)
    }
  }

  // Digital signatures configuration
  digitalSignatures: {
    enabled: boolean                      // Enable digital signatures
    provider: 'internal' | 'docusign' | 'adobesign' | 'other'
    requireSignatureForCategories: DocumentTemplateCategory[]
    signatureWorkflow: {
      allowMultipleSigners: boolean       // Allow multiple signers
      requireSequentialSigning: boolean   // Sequential vs parallel signing
      notifyOnCompletion: boolean         // Notify when all signed
      reminderIntervalDays: number        // Reminder interval (days)
    }
    timestampConfig: {
      enabled: boolean                    // Add timestamp to signatures
      trustServiceProvider: string | null // TSP (Time Stamp Provider)
    }
  }

  // Storage and retention configuration
  storageConfig: {
    retentionPolicies: {
      category: DocumentTemplateCategory
      retentionYears: number              // Years to retain documents
      autoDeleteAfterRetention: boolean   // Auto-delete after retention period
    }[]
    archivingRules: {
      archiveAfterDays: number            // Archive inactive docs after N days
      compressArchived: boolean           // Compress archived documents
    }
    quotaLimits: {
      maxStorageMB: number                // Storage quota per organization
      maxDocumentsPerOrg: number          // Max documents per organization
      alertAtPercentage: number           // Alert when quota reaches %
    }
  }

  // Access and permissions
  accessConfig: {
    defaultVisibility: 'private' | 'organization' | 'public'
    allowExternalSharing: boolean         // Allow sharing outside org
    requirePasswordForDownload: boolean   // Password-protect downloads
    watermarkOnDownload: boolean          // Add watermark on download
    auditAllAccess: boolean               // Log all document access
  }

  // Integration settings
  integrationConfig: {
    allowApiAccess: boolean               // Allow API access to documents
    webhooksEnabled: boolean              // Enable webhooks for doc events
    exportToCloudStorage: boolean         // Export to external storage
    cloudProviders: ('dropbox' | 'gdrive' | 'onedrive' | 's3')[]
  }

  // Country-specific settings
  countrySpecific: {
    legalReferences: string[]             // Legal acts references
    competentAuthority: string            // Ex: 'Ministerul Muncii'
    authorityUrl: string | null
    mandatoryDocumentTypes: string[]      // Required document types
    documentRetentionYears: number        // Legal retention period
    digitalSignatureLegal: boolean        // Digital signatures legally valid
  }
}

// ── Documents Module Definition ──
export const documentsModule: IModule = {
  key: 'ssm', // Documents module is part of SSM core
  name_en: 'Document Management',
  name_localized: {
    ro: 'Gestionare Documente',
    bg: 'Управление на документи',
    hu: 'Dokumentumkezelés',
    de: 'Dokumentenverwaltung',
    pl: 'Zarządzanie dokumentami',
    en: 'Document Management',
  },
  description_en: 'Document management system with templates, generation, version control, expiry tracking, and digital signatures',
  icon: 'FileText',
  category: 'core',
  is_base: true,
  depends_on: ['ssm'], // Depends on SSM core module
  incompatible: [],

  /**
   * Returns default Documents module configuration
   */
  getDefaultConfig(): DocumentsModuleConfig {
    return {
      templateConfig: {
        allowCustomTemplates: true,
        defaultLanguage: 'ro',
        supportedFormats: ['pdf', 'docx', 'html'],
        maxTemplateVersions: 10,
        autoArchiveOldVersions: true,
      },

      generationConfig: {
        includeWatermark: false,
        watermarkText: null,
        includeGenerationDate: true,
        includeDigitalId: true,
        autoNumbering: true,
        numberingFormat: 'DOC-{YYYY}-{####}',
      },

      versionControl: {
        enabled: true,
        maxVersionsPerDocument: 20,
        autoBackup: true,
        compareVersionsEnabled: true,
        trackChanges: true,
      },

      expiryTracking: {
        enabled: true,
        defaultValidityDays: 365,
        documentExpiryRules: [
          {
            category: 'medical',
            validityDays: 365,
            requiresRenewal: true,
            autoExtendable: false,
          },
          {
            category: 'training',
            validityDays: 365,
            requiresRenewal: true,
            autoExtendable: false,
          },
          {
            category: 'psi',
            validityDays: 365,
            requiresRenewal: true,
            autoExtendable: false,
          },
          {
            category: 'equipment',
            validityDays: 180,
            requiresRenewal: true,
            autoExtendable: false,
          },
          {
            category: 'compliance',
            validityDays: 365,
            requiresRenewal: true,
            autoExtendable: false,
          },
          {
            category: 'contract',
            validityDays: 1095, // 3 years
            requiresRenewal: true,
            autoExtendable: false,
          },
          {
            category: 'policy',
            validityDays: 730, // 2 years
            requiresRenewal: true,
            autoExtendable: true,
          },
          {
            category: 'procedure',
            validityDays: 365,
            requiresRenewal: true,
            autoExtendable: true,
          },
        ],
        alertThresholds: {
          expiringWarningDays: 30,
          expiringCriticalDays: 15,
          overdueEscalationDays: 7,
        },
      },

      digitalSignatures: {
        enabled: true,
        provider: 'internal',
        requireSignatureForCategories: ['contract', 'compliance', 'policy'],
        signatureWorkflow: {
          allowMultipleSigners: true,
          requireSequentialSigning: false,
          notifyOnCompletion: true,
          reminderIntervalDays: 3,
        },
        timestampConfig: {
          enabled: true,
          trustServiceProvider: null,
        },
      },

      storageConfig: {
        retentionPolicies: [
          {
            category: 'medical',
            retentionYears: 10,
            autoDeleteAfterRetention: false,
          },
          {
            category: 'training',
            retentionYears: 5,
            autoDeleteAfterRetention: false,
          },
          {
            category: 'psi',
            retentionYears: 5,
            autoDeleteAfterRetention: false,
          },
          {
            category: 'equipment',
            retentionYears: 3,
            autoDeleteAfterRetention: false,
          },
          {
            category: 'compliance',
            retentionYears: 10,
            autoDeleteAfterRetention: false,
          },
          {
            category: 'contract',
            retentionYears: 10,
            autoDeleteAfterRetention: false,
          },
          {
            category: 'policy',
            retentionYears: 5,
            autoDeleteAfterRetention: false,
          },
          {
            category: 'procedure',
            retentionYears: 5,
            autoDeleteAfterRetention: false,
          },
        ],
        archivingRules: {
          archiveAfterDays: 365,
          compressArchived: true,
        },
        quotaLimits: {
          maxStorageMB: 5000, // 5 GB default
          maxDocumentsPerOrg: 10000,
          alertAtPercentage: 80,
        },
      },

      accessConfig: {
        defaultVisibility: 'organization',
        allowExternalSharing: false,
        requirePasswordForDownload: false,
        watermarkOnDownload: false,
        auditAllAccess: true,
      },

      integrationConfig: {
        allowApiAccess: true,
        webhooksEnabled: true,
        exportToCloudStorage: false,
        cloudProviders: [],
      },

      countrySpecific: {
        legalReferences: [
          'Legea nr. 319/2006 - Legea securității și sănătății în muncă',
          'Codul Muncii - Legea nr. 53/2003',
        ],
        competentAuthority: 'Ministerul Muncii și Solidarității Sociale',
        authorityUrl: 'https://mmuncii.ro',
        mandatoryDocumentTypes: [
          'Fișe medicale',
          'Fișe de instruire SSM',
          'Registru evidență SSM',
          'Plan de prevenire și protecție',
        ],
        documentRetentionYears: 10,
        digitalSignatureLegal: true,
      },
    }
  },

  /**
   * Validates Documents module configuration
   * @param config - Configuration object to validate
   * @returns true if valid, false otherwise
   */
  validateConfig(config: any): boolean {
    if (!config || typeof config !== 'object') return false

    // Validate template config
    if (!config.templateConfig) return false
    const template = config.templateConfig
    if (
      typeof template.allowCustomTemplates !== 'boolean' ||
      typeof template.defaultLanguage !== 'string' ||
      !Array.isArray(template.supportedFormats) ||
      typeof template.maxTemplateVersions !== 'number' ||
      template.maxTemplateVersions <= 0
    ) {
      return false
    }

    // Validate generation config
    if (!config.generationConfig) return false
    const generation = config.generationConfig
    if (
      typeof generation.includeWatermark !== 'boolean' ||
      typeof generation.includeGenerationDate !== 'boolean' ||
      typeof generation.autoNumbering !== 'boolean'
    ) {
      return false
    }

    // Validate version control
    if (!config.versionControl) return false
    const version = config.versionControl
    if (
      typeof version.enabled !== 'boolean' ||
      typeof version.maxVersionsPerDocument !== 'number' ||
      version.maxVersionsPerDocument <= 0
    ) {
      return false
    }

    // Validate expiry tracking
    if (!config.expiryTracking) return false
    const expiry = config.expiryTracking
    if (
      typeof expiry.enabled !== 'boolean' ||
      typeof expiry.defaultValidityDays !== 'number' ||
      !Array.isArray(expiry.documentExpiryRules) ||
      expiry.defaultValidityDays <= 0
    ) {
      return false
    }

    // Validate expiry rules
    for (const rule of expiry.documentExpiryRules) {
      if (
        !rule.category ||
        typeof rule.validityDays !== 'number' ||
        typeof rule.requiresRenewal !== 'boolean' ||
        rule.validityDays <= 0
      ) {
        return false
      }
    }

    // Validate alert thresholds
    if (!expiry.alertThresholds) return false
    const alerts = expiry.alertThresholds
    if (
      typeof alerts.expiringWarningDays !== 'number' ||
      typeof alerts.expiringCriticalDays !== 'number' ||
      alerts.expiringWarningDays <= 0 ||
      alerts.expiringCriticalDays <= 0
    ) {
      return false
    }

    // Validate digital signatures
    if (!config.digitalSignatures) return false
    const signatures = config.digitalSignatures
    if (
      typeof signatures.enabled !== 'boolean' ||
      !signatures.provider ||
      !Array.isArray(signatures.requireSignatureForCategories)
    ) {
      return false
    }

    // Validate storage config
    if (!config.storageConfig) return false
    const storage = config.storageConfig
    if (
      !Array.isArray(storage.retentionPolicies) ||
      !storage.archivingRules ||
      !storage.quotaLimits
    ) {
      return false
    }

    // Validate retention policies
    for (const policy of storage.retentionPolicies) {
      if (
        !policy.category ||
        typeof policy.retentionYears !== 'number' ||
        policy.retentionYears <= 0
      ) {
        return false
      }
    }

    // Validate quota limits
    if (
      typeof storage.quotaLimits.maxStorageMB !== 'number' ||
      typeof storage.quotaLimits.maxDocumentsPerOrg !== 'number' ||
      storage.quotaLimits.maxStorageMB <= 0 ||
      storage.quotaLimits.maxDocumentsPerOrg <= 0
    ) {
      return false
    }

    // Validate access config
    if (!config.accessConfig) return false
    const access = config.accessConfig
    if (
      !access.defaultVisibility ||
      typeof access.allowExternalSharing !== 'boolean' ||
      typeof access.auditAllAccess !== 'boolean'
    ) {
      return false
    }

    // Validate country specific
    if (!config.countrySpecific) return false
    const country = config.countrySpecific
    if (
      !Array.isArray(country.legalReferences) ||
      !country.competentAuthority ||
      !Array.isArray(country.mandatoryDocumentTypes) ||
      typeof country.documentRetentionYears !== 'number' ||
      country.documentRetentionYears <= 0
    ) {
      return false
    }

    return true
  },
}

// ── Country-Specific Configurations ──

/**
 * Romania documents configuration
 */
export function getRomaniaDocumentsConfig(): Partial<DocumentsModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Legea nr. 319/2006 - Legea securității și sănătății în muncă',
        'Codul Muncii - Legea nr. 53/2003',
        'HG nr. 1425/2006 - Regulamentul de aplicare',
      ],
      competentAuthority: 'Ministerul Muncii și Solidarității Sociale',
      authorityUrl: 'https://mmuncii.ro',
      mandatoryDocumentTypes: [
        'Fișe medicale',
        'Fișe de instruire SSM',
        'Registru evidență SSM',
        'Plan de prevenire și protecție',
        'Fișe de post',
      ],
      documentRetentionYears: 10,
      digitalSignatureLegal: true,
    },
  }
}

/**
 * Bulgaria documents configuration
 */
export function getBulgariaDocumentsConfig(): Partial<DocumentsModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Закон за здравословни и безопасни условия на труд (ЗЗБУТ)',
        'Кодекс на труда',
      ],
      competentAuthority: 'Изпълнителна агенция "Главна инспекция по труда"',
      authorityUrl: 'https://www.gli.government.bg',
      mandatoryDocumentTypes: [
        'Медицински документи',
        'Обучения по ЗБУТ',
        'Регистър на инструктажите',
        'План за превенция',
      ],
      documentRetentionYears: 10,
      digitalSignatureLegal: true,
    },
  }
}

/**
 * Hungary documents configuration
 */
export function getHungaryDocumentsConfig(): Partial<DocumentsModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Munka törvénykönyve (2012. évi I. törvény)',
        'Munkavédelmi törvény (1993. évi XCIII. törvény)',
      ],
      competentAuthority: 'Nemzeti Munkaügyi Hivatal',
      authorityUrl: 'https://www.munkaugy.gov.hu',
      mandatoryDocumentTypes: [
        'Egészségügyi nyilvántartások',
        'Munkavédelmi oktatási dokumentumok',
        'Munkavédelmi napló',
        'Megelőzési terv',
      ],
      documentRetentionYears: 10,
      digitalSignatureLegal: true,
    },
  }
}

/**
 * Germany documents configuration
 */
export function getGermanyDocumentsConfig(): Partial<DocumentsModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Arbeitsschutzgesetz (ArbSchG)',
        'DGUV Vorschrift 1 - Grundsätze der Prävention',
        'Betriebssicherheitsverordnung (BetrSichV)',
      ],
      competentAuthority: 'Bundesministerium für Arbeit und Soziales',
      authorityUrl: 'https://www.bmas.de',
      mandatoryDocumentTypes: [
        'Gesundheitsakten',
        'Unterweisungsnachweise',
        'Verbandbuch',
        'Gefährdungsbeurteilungen',
      ],
      documentRetentionYears: 10,
      digitalSignatureLegal: true,
    },
  }
}

/**
 * Poland documents configuration
 */
export function getPolandDocumentsConfig(): Partial<DocumentsModuleConfig> {
  return {
    countrySpecific: {
      legalReferences: [
        'Kodeks pracy (ustawa z dnia 26 czerwca 1974 r.)',
        'Ustawa o bezpieczeństwie i higienie pracy',
      ],
      competentAuthority: 'Państwowa Inspekcja Pracy',
      authorityUrl: 'https://www.pip.gov.pl',
      mandatoryDocumentTypes: [
        'Dokumentacja medyczna',
        'Dokumentacja szkoleń BHP',
        'Rejestr wypadków',
        'Plan ochrony pracy',
      ],
      documentRetentionYears: 10,
      digitalSignatureLegal: true,
    },
  }
}

// ── Helper Functions ──

/**
 * Get documents configuration for a specific country
 * @param countryCode - Country code (RO, BG, HU, DE, PL)
 * @returns Merged configuration with country-specific settings
 */
export function getDocumentsConfigForCountry(countryCode: string): DocumentsModuleConfig {
  const baseConfig = documentsModule.getDefaultConfig()

  let countrySpecific: Partial<DocumentsModuleConfig> | undefined

  switch (countryCode) {
    case 'RO':
      countrySpecific = getRomaniaDocumentsConfig()
      break
    case 'BG':
      countrySpecific = getBulgariaDocumentsConfig()
      break
    case 'HU':
      countrySpecific = getHungaryDocumentsConfig()
      break
    case 'DE':
      countrySpecific = getGermanyDocumentsConfig()
      break
    case 'PL':
      countrySpecific = getPolandDocumentsConfig()
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
 * Calculate document expiry date based on category
 * @param category - Document category
 * @param issueDate - Document issue date (ISO string)
 * @param config - Documents module configuration
 * @returns Expiry date (ISO string)
 */
export function calculateDocumentExpiryDate(
  category: DocumentTemplateCategory,
  issueDate: string,
  config: DocumentsModuleConfig
): string {
  const issue = new Date(issueDate)

  // Find expiry rule for category
  const rule = config.expiryTracking.documentExpiryRules.find(r => r.category === category)
  const validityDays = rule?.validityDays ?? config.expiryTracking.defaultValidityDays

  const expiry = new Date(issue.getTime() + validityDays * 24 * 60 * 60 * 1000)
  return expiry.toISOString().split('T')[0]
}

/**
 * Check if document requires signature based on category
 * @param category - Document category
 * @param config - Documents module configuration
 * @returns true if signature required
 */
export function requiresSignature(
  category: DocumentTemplateCategory,
  config: DocumentsModuleConfig
): boolean {
  if (!config.digitalSignatures.enabled) return false
  return config.digitalSignatures.requireSignatureForCategories.includes(category)
}

/**
 * Calculate retention expiry date
 * @param category - Document category
 * @param creationDate - Document creation date (ISO string)
 * @param config - Documents module configuration
 * @returns Retention expiry date (ISO string)
 */
export function calculateRetentionExpiryDate(
  category: DocumentTemplateCategory,
  creationDate: string,
  config: DocumentsModuleConfig
): string {
  const creation = new Date(creationDate)

  // Find retention policy for category
  const policy = config.storageConfig.retentionPolicies.find(p => p.category === category)
  const retentionYears = policy?.retentionYears ?? config.countrySpecific.documentRetentionYears

  const expiry = new Date(creation)
  expiry.setFullYear(expiry.getFullYear() + retentionYears)

  return expiry.toISOString().split('T')[0]
}

/**
 * Generate document number based on format
 * @param format - Numbering format (e.g., "DOC-{YYYY}-{####}")
 * @param sequenceNumber - Current sequence number
 * @returns Formatted document number
 */
export function generateDocumentNumber(format: string, sequenceNumber: number): string {
  const now = new Date()

  let result = format
  result = result.replace('{YYYY}', now.getFullYear().toString())
  result = result.replace('{YY}', now.getFullYear().toString().slice(-2))
  result = result.replace('{MM}', (now.getMonth() + 1).toString().padStart(2, '0'))
  result = result.replace('{DD}', now.getDate().toString().padStart(2, '0'))
  result = result.replace('{####}', sequenceNumber.toString().padStart(4, '0'))
  result = result.replace('{###}', sequenceNumber.toString().padStart(3, '0'))
  result = result.replace('{##}', sequenceNumber.toString().padStart(2, '0'))

  return result
}

/**
 * Check document expiry status
 * @param expiryDate - Document expiry date (ISO string)
 * @param config - Documents module configuration
 * @returns Status: 'valid', 'expiring', 'expired'
 */
export function getDocumentExpiryStatus(
  expiryDate: string,
  config: DocumentsModuleConfig
): 'valid' | 'expiring' | 'expired' {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilExpiry < 0) return 'expired'
  if (daysUntilExpiry <= config.expiryTracking.alertThresholds.expiringCriticalDays) return 'expiring'
  return 'valid'
}

// ── Exports ──
export default documentsModule
