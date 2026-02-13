// lib/modules/documents-module.ts
// OP-LEGO — Documents Module
// Template management, document generation, version control, expiry tracking, digital signatures placeholder
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

// ── Document Types ──
export type DocumentType =
  | 'employee_contract'              // Contract de muncă
  | 'medical_certificate'            // Adeverință medicală
  | 'training_certificate'           // Adeverință instruire SSM/PSI
  | 'work_permit'                    // Permis de lucru (spații confinate, lucru la înălțime, etc.)
  | 'safety_instruction'             // Instrucțiune SSM
  | 'fire_evacuation_plan'           // Plan de evacuare PSI
  | 'risk_assessment'                // Evaluare de risc
  | 'equipment_certificate'          // Certificat echipament (EIP, ISCIR)
  | 'inspection_report'              // Raport verificare/inspecție
  | 'incident_report'                // Raport incident/accident
  | 'audit_report'                   // Raport audit
  | 'compliance_declaration'         // Declarație de conformitate
  | 'authority_correspondence'       // Coresponență cu autorități
  | 'gdpr_consent'                   // Consimțământ GDPR
  | 'dpia_report'                    // Raport DPIA (Data Protection Impact Assessment)
  | 'custom'                         // Document personalizat

export type DocumentStatus = 'draft' | 'active' | 'expired' | 'archived' | 'revoked'
export type DocumentFormat = 'pdf' | 'docx' | 'html' | 'markdown'
export type SignatureStatus = 'unsigned' | 'pending' | 'signed' | 'rejected' | 'expired'
export type TemplateCategory = 'ssm' | 'psi' | 'gdpr' | 'contracts' | 'reports' | 'authorities' | 'custom'

// ── Documents Module Configuration ──
export interface DocumentsModuleConfig {
  // Active document types
  activeDocumentTypes: {
    employeeContracts: boolean
    medicalCertificates: boolean
    trainingCertificates: boolean
    workPermits: boolean
    safetyInstructions: boolean
    fireEvacuationPlans: boolean
    riskAssessments: boolean
    equipmentCertificates: boolean
    inspectionReports: boolean
    incidentReports: boolean
    auditReports: boolean
    complianceDeclarations: boolean
    authorityCorrespondence: boolean
    gdprConsents: boolean
    dpiaReports: boolean
    customDocuments: boolean
  }

  // Template management
  templateManagement: {
    enableTemplates: boolean
    maxTemplatesPerOrg: number         // Default: 50
    allowCustomTemplates: boolean
    requireTemplateApproval: boolean   // Consultant must approve custom templates
    templateCategories: TemplateCategory[]
    defaultLanguage: string            // Default: "ro"
    supportedLanguages: string[]       // ["ro", "bg", "hu", "de", "en"]
    enableVersionControl: boolean
    maxVersionsPerTemplate: number     // Default: 10
  }

  // Document generation
  documentGeneration: {
    enableAutoGeneration: boolean      // Auto-generate based on events
    autoGenerationTriggers: {
      onEmployeeHire: boolean          // Generate contract on hire
      onTrainingCompletion: boolean    // Generate certificate on training completion
      onMedicalExam: boolean           // Generate certificate on medical exam
      onEquipmentPurchase: boolean     // Generate equipment certificate
      onIncident: boolean              // Generate incident report
    }
    enableBatchGeneration: boolean     // Generate multiple documents at once
    maxConcurrentGenerations: number   // Default: 5
    generationTimeout: number          // Seconds, default: 120
    includeWatermark: boolean
    watermarkText: string | null
    includeQRCode: boolean             // QR code for document verification
    qrCodeUrl: string | null           // Base URL for QR verification
  }

  // Version control
  versionControl: {
    enabled: boolean
    trackChanges: boolean              // Track who changed what
    requireChangeNotes: boolean        // Require notes on version changes
    maxVersionsPerDocument: number     // Default: 20
    autoArchiveOldVersions: boolean    // Archive old versions after N days
    archiveAfterDays: number           // Default: 365
    allowVersionComparison: boolean    // Side-by-side version comparison
    enableRollback: boolean            // Allow reverting to previous version
  }

  // Expiry tracking
  expiryTracking: {
    enabled: boolean
    defaultValidityPeriod: number      // Days, default: 365
    validityPeriods: {
      employeeContracts: number | null  // null = indefinite
      medicalCertificates: number       // Default: 365
      trainingCertificates: number      // Default: 730 (2 years)
      workPermits: number               // Default: 1 (1 day)
      safetyInstructions: number | null
      fireEvacuationPlans: number       // Default: 365
      riskAssessments: number           // Default: 365
      equipmentCertificates: number     // Default: 365
      inspectionReports: number         // Default: 90
      incidentReports: number | null
      auditReports: number | null
      complianceDeclarations: number    // Default: 365
      authorityCorrespondence: number | null
      gdprConsents: number              // Default: 730 (2 years)
      dpiaReports: number               // Default: 1095 (3 years)
    }
    alertBeforeExpiryDays: number[]    // Alert at [90, 60, 30, 15, 7, 1] days before expiry
    autoArchiveExpired: boolean        // Auto-archive expired documents
    autoArchiveAfterDays: number       // Default: 30
    requireRenewalApproval: boolean    // Consultant must approve renewals
  }

  // Digital signatures (placeholder for future implementation)
  digitalSignatures: {
    enabled: boolean
    provider: 'internal' | 'docusign' | 'adobe_sign' | 'qualified_eu' | null
    requireSignature: {
      employeeContracts: boolean
      medicalCertificates: boolean
      trainingCertificates: boolean
      workPermits: boolean
      safetyInstructions: boolean
      fireEvacuationPlans: boolean
      riskAssessments: boolean
      equipmentCertificates: boolean
      inspectionReports: boolean
      incidentReports: boolean
      auditReports: boolean
      complianceDeclarations: boolean
      authorityCorrespondence: boolean
      gdprConsents: boolean
      dpiaReports: boolean
    }
    signatureTimeout: number           // Days, default: 7
    allowBulkSignature: boolean        // Sign multiple documents at once
    requireWitness: boolean            // Require witness signature
    enableTimestamp: boolean           // Add trusted timestamp
    qualifiedSignature: boolean        // Use qualified electronic signature (EU regulation)
  }

  // Storage and retention
  storageRetention: {
    storageProvider: 'supabase' | 's3' | 'local'
    storagePath: string                // Base path for document storage
    retentionPeriods: {
      employeeContracts: number        // Years, default: 10
      medicalCertificates: number      // Years, default: 5
      trainingCertificates: number     // Years, default: 5
      workPermits: number              // Years, default: 3
      safetyInstructions: number       // Years, default: 5
      fireEvacuationPlans: number      // Years, default: 5
      riskAssessments: number          // Years, default: 5
      equipmentCertificates: number    // Years, default: 5
      inspectionReports: number        // Years, default: 3
      incidentReports: number          // Years, default: 10
      auditReports: number             // Years, default: 7
      complianceDeclarations: number   // Years, default: 5
      authorityCorrespondence: number  // Years, default: 10
      gdprConsents: number             // Years, default: 7
      dpiaReports: number              // Years, default: 5
    }
    autoDeleteAfterRetention: boolean  // Auto-delete after retention period
    requireApprovalBeforeDeletion: boolean
    enableBackups: boolean
    backupFrequency: 'daily' | 'weekly' | 'monthly'
    backupRetentionDays: number        // Default: 90
  }

  // Access control
  accessControl: {
    enableDocumentPermissions: boolean
    defaultVisibility: 'private' | 'organization' | 'public'
    allowEmployeeAccess: boolean       // Employees can view their own documents
    allowDownload: boolean
    allowPrint: boolean
    requireWatermarkOnDownload: boolean
    trackAccess: boolean               // Log document access
    accessLogRetentionDays: number     // Default: 365
  }

  // Search and organization
  searchOrganization: {
    enableFullTextSearch: boolean
    enableTagging: boolean
    maxTagsPerDocument: number         // Default: 10
    enableCategories: boolean
    customCategories: string[]         // Custom category names
    enableFolders: boolean
    maxFolderDepth: number             // Default: 3
    sortOptions: ('name' | 'date' | 'type' | 'status' | 'expiry')[]
  }

  // Notifications
  notifications: {
    enableEmailNotifications: boolean
    enableInAppNotifications: boolean
    notifyOnGeneration: boolean
    notifyOnExpiry: boolean
    notifyOnSignatureRequest: boolean
    notifyOnSignatureComplete: boolean
    notifyOnVersionChange: boolean
    notificationRecipients: 'owner' | 'consultant' | 'both'
  }

  // Country-specific settings
  countrySpecific: {
    legalReferences: string[]          // Relevant legal acts
    mandatoryDocuments: DocumentType[] // Legally required documents
    authoritySubmissionRequired: boolean
    authoritySubmissionEndpoint: string | null
    language: string                   // Default document language for country
    dateFormat: string                 // Date format (DD/MM/YYYY, MM/DD/YYYY, etc.)
    officialTemplates: string[]        // URLs to official template sources
  }
}

// ── Documents Module Definition ──
export const documentsModule: IModule = {
  key: 'documents',
  name_en: 'Documents',
  name_localized: {
    ro: 'Documente',
    bg: 'Документи',
    hu: 'Dokumentumok',
    de: 'Dokumente',
    pl: 'Dokumenty',
    en: 'Documents',
  },
  description_en: 'Template management, document generation, version control, expiry tracking, digital signatures placeholder',
  icon: 'Files',
  category: 'premium',
  is_base: false,
  depends_on: ['ssm-core'], // Requires core SSM functionality
  incompatible: [], // Compatible with all modules

  /**
   * Returns default Documents module configuration
   */
  getDefaultConfig(): DocumentsModuleConfig {
    return {
      activeDocumentTypes: {
        employeeContracts: true,
        medicalCertificates: true,
        trainingCertificates: true,
        workPermits: true,
        safetyInstructions: true,
        fireEvacuationPlans: true,
        riskAssessments: true,
        equipmentCertificates: true,
        inspectionReports: true,
        incidentReports: true,
        auditReports: false,
        complianceDeclarations: true,
        authorityCorrespondence: true,
        gdprConsents: false,
        dpiaReports: false,
        customDocuments: true,
      },

      templateManagement: {
        enableTemplates: true,
        maxTemplatesPerOrg: 50,
        allowCustomTemplates: true,
        requireTemplateApproval: false,
        templateCategories: ['ssm', 'psi', 'contracts', 'reports', 'authorities', 'custom'],
        defaultLanguage: 'ro',
        supportedLanguages: ['ro', 'bg', 'hu', 'de', 'en'],
        enableVersionControl: true,
        maxVersionsPerTemplate: 10,
      },

      documentGeneration: {
        enableAutoGeneration: true,
        autoGenerationTriggers: {
          onEmployeeHire: false,
          onTrainingCompletion: true,
          onMedicalExam: true,
          onEquipmentPurchase: false,
          onIncident: false,
        },
        enableBatchGeneration: true,
        maxConcurrentGenerations: 5,
        generationTimeout: 120,
        includeWatermark: false,
        watermarkText: null,
        includeQRCode: true,
        qrCodeUrl: 'https://app.s-s-m.ro/verify',
      },

      versionControl: {
        enabled: true,
        trackChanges: true,
        requireChangeNotes: false,
        maxVersionsPerDocument: 20,
        autoArchiveOldVersions: true,
        archiveAfterDays: 365,
        allowVersionComparison: true,
        enableRollback: true,
      },

      expiryTracking: {
        enabled: true,
        defaultValidityPeriod: 365,
        validityPeriods: {
          employeeContracts: null,       // Indefinite
          medicalCertificates: 365,
          trainingCertificates: 730,     // 2 years
          workPermits: 1,                // 1 day
          safetyInstructions: null,
          fireEvacuationPlans: 365,
          riskAssessments: 365,
          equipmentCertificates: 365,
          inspectionReports: 90,
          incidentReports: null,
          auditReports: null,
          complianceDeclarations: 365,
          authorityCorrespondence: null,
          gdprConsents: 730,             // 2 years
          dpiaReports: 1095,             // 3 years
        },
        alertBeforeExpiryDays: [90, 60, 30, 15, 7, 1],
        autoArchiveExpired: true,
        autoArchiveAfterDays: 30,
        requireRenewalApproval: false,
      },

      digitalSignatures: {
        enabled: false,                  // Placeholder for future implementation
        provider: null,
        requireSignature: {
          employeeContracts: false,
          medicalCertificates: false,
          trainingCertificates: false,
          workPermits: false,
          safetyInstructions: false,
          fireEvacuationPlans: false,
          riskAssessments: false,
          equipmentCertificates: false,
          inspectionReports: false,
          incidentReports: false,
          auditReports: false,
          complianceDeclarations: false,
          authorityCorrespondence: false,
          gdprConsents: false,
          dpiaReports: false,
        },
        signatureTimeout: 7,
        allowBulkSignature: false,
        requireWitness: false,
        enableTimestamp: false,
        qualifiedSignature: false,
      },

      storageRetention: {
        storageProvider: 'supabase',
        storagePath: 'documents/{org_id}/{year}/{document_type}/',
        retentionPeriods: {
          employeeContracts: 10,
          medicalCertificates: 5,
          trainingCertificates: 5,
          workPermits: 3,
          safetyInstructions: 5,
          fireEvacuationPlans: 5,
          riskAssessments: 5,
          equipmentCertificates: 5,
          inspectionReports: 3,
          incidentReports: 10,
          auditReports: 7,
          complianceDeclarations: 5,
          authorityCorrespondence: 10,
          gdprConsents: 7,
          dpiaReports: 5,
        },
        autoDeleteAfterRetention: false,
        requireApprovalBeforeDeletion: true,
        enableBackups: true,
        backupFrequency: 'weekly',
        backupRetentionDays: 90,
      },

      accessControl: {
        enableDocumentPermissions: true,
        defaultVisibility: 'organization',
        allowEmployeeAccess: true,
        allowDownload: true,
        allowPrint: true,
        requireWatermarkOnDownload: false,
        trackAccess: true,
        accessLogRetentionDays: 365,
      },

      searchOrganization: {
        enableFullTextSearch: true,
        enableTagging: true,
        maxTagsPerDocument: 10,
        enableCategories: true,
        customCategories: [],
        enableFolders: true,
        maxFolderDepth: 3,
        sortOptions: ['name', 'date', 'type', 'status', 'expiry'],
      },

      notifications: {
        enableEmailNotifications: true,
        enableInAppNotifications: true,
        notifyOnGeneration: true,
        notifyOnExpiry: true,
        notifyOnSignatureRequest: false,
        notifyOnSignatureComplete: false,
        notifyOnVersionChange: false,
        notificationRecipients: 'both',
      },

      countrySpecific: {
        legalReferences: [
          'Legea 319/2006 - SSM',
          'Legea 307/2006 - PSI',
          'Codul Muncii - Legea 53/2003',
          'GDPR - Regulamentul 679/2016',
        ],
        mandatoryDocuments: [
          'training_certificate',
          'medical_certificate',
          'fire_evacuation_plan',
          'risk_assessment',
        ],
        authoritySubmissionRequired: false,
        authoritySubmissionEndpoint: null,
        language: 'ro',
        dateFormat: 'DD/MM/YYYY',
        officialTemplates: [],
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

    // Validate active document types
    if (!config.activeDocumentTypes || typeof config.activeDocumentTypes !== 'object') return false

    // Validate template management
    if (!config.templateManagement) return false
    const templates = config.templateManagement
    if (
      typeof templates.enableTemplates !== 'boolean' ||
      typeof templates.maxTemplatesPerOrg !== 'number' ||
      !Array.isArray(templates.templateCategories) ||
      !Array.isArray(templates.supportedLanguages) ||
      templates.maxTemplatesPerOrg <= 0
    ) {
      return false
    }

    // Validate document generation
    if (!config.documentGeneration) return false
    const generation = config.documentGeneration
    if (
      typeof generation.enableAutoGeneration !== 'boolean' ||
      !generation.autoGenerationTriggers ||
      typeof generation.autoGenerationTriggers !== 'object' ||
      typeof generation.maxConcurrentGenerations !== 'number' ||
      typeof generation.generationTimeout !== 'number' ||
      generation.maxConcurrentGenerations <= 0 ||
      generation.generationTimeout <= 0
    ) {
      return false
    }

    // Validate version control
    if (!config.versionControl) return false
    const versionControl = config.versionControl
    if (
      typeof versionControl.enabled !== 'boolean' ||
      typeof versionControl.trackChanges !== 'boolean' ||
      typeof versionControl.maxVersionsPerDocument !== 'number' ||
      versionControl.maxVersionsPerDocument <= 0
    ) {
      return false
    }

    // Validate expiry tracking
    if (!config.expiryTracking) return false
    const expiry = config.expiryTracking
    if (
      typeof expiry.enabled !== 'boolean' ||
      typeof expiry.defaultValidityPeriod !== 'number' ||
      !expiry.validityPeriods ||
      typeof expiry.validityPeriods !== 'object' ||
      !Array.isArray(expiry.alertBeforeExpiryDays) ||
      expiry.defaultValidityPeriod <= 0
    ) {
      return false
    }

    // Validate digital signatures
    if (!config.digitalSignatures) return false
    const signatures = config.digitalSignatures
    if (
      typeof signatures.enabled !== 'boolean' ||
      !signatures.requireSignature ||
      typeof signatures.requireSignature !== 'object' ||
      typeof signatures.signatureTimeout !== 'number' ||
      signatures.signatureTimeout <= 0
    ) {
      return false
    }

    // Validate storage retention
    if (!config.storageRetention) return false
    const storage = config.storageRetention
    if (
      !storage.storageProvider ||
      typeof storage.storagePath !== 'string' ||
      !storage.retentionPeriods ||
      typeof storage.retentionPeriods !== 'object' ||
      typeof storage.enableBackups !== 'boolean'
    ) {
      return false
    }

    // Validate retention periods are positive numbers
    const retentionPeriods = Object.values(storage.retentionPeriods)
    if (!retentionPeriods.every((period) => typeof period === 'number' && period > 0)) {
      return false
    }

    // Validate access control
    if (!config.accessControl) return false
    const access = config.accessControl
    if (
      typeof access.enableDocumentPermissions !== 'boolean' ||
      !['private', 'organization', 'public'].includes(access.defaultVisibility) ||
      typeof access.trackAccess !== 'boolean' ||
      typeof access.accessLogRetentionDays !== 'number' ||
      access.accessLogRetentionDays <= 0
    ) {
      return false
    }

    // Validate search and organization
    if (!config.searchOrganization) return false
    const search = config.searchOrganization
    if (
      typeof search.enableFullTextSearch !== 'boolean' ||
      typeof search.enableTagging !== 'boolean' ||
      typeof search.maxTagsPerDocument !== 'number' ||
      !Array.isArray(search.customCategories) ||
      !Array.isArray(search.sortOptions) ||
      search.maxTagsPerDocument <= 0
    ) {
      return false
    }

    // Validate notifications
    if (!config.notifications) return false
    const notifications = config.notifications
    if (
      typeof notifications.enableEmailNotifications !== 'boolean' ||
      typeof notifications.enableInAppNotifications !== 'boolean' ||
      !['owner', 'consultant', 'both'].includes(notifications.notificationRecipients)
    ) {
      return false
    }

    // Validate country specific
    if (!config.countrySpecific) return false
    const country = config.countrySpecific
    if (
      !Array.isArray(country.legalReferences) ||
      !Array.isArray(country.mandatoryDocuments) ||
      typeof country.authoritySubmissionRequired !== 'boolean' ||
      typeof country.language !== 'string' ||
      typeof country.dateFormat !== 'string' ||
      !Array.isArray(country.officialTemplates)
    ) {
      return false
    }

    return true
  },
}

// ── Document Template Interfaces ──

/**
 * Document template definition
 */
export interface DocumentTemplate {
  id: string
  organization_id: string
  template_name: string
  template_type: DocumentType
  category: TemplateCategory
  description: string | null
  language: string                       // ISO 639-1 code
  content: string                        // Template content (HTML, Markdown, or custom format)
  content_format: DocumentFormat
  variables: TemplateVariable[]          // Dynamic variables in template
  is_official: boolean                   // Official template (not editable)
  is_active: boolean
  version: string                        // Semantic version (1.0.0)
  parent_template_id: string | null     // For version control
  created_by: string
  created_at: string
  updated_at: string
}

/**
 * Template variable definition
 */
export interface TemplateVariable {
  key: string                            // Variable key in template (e.g., {{employee_name}})
  label: string                          // Display label
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect'
  required: boolean
  default_value: any | null
  options?: string[]                     // For select/multiselect
  validation?: {
    min?: number
    max?: number
    pattern?: string                     // Regex pattern
    custom?: string                      // Custom validation function name
  }
}

/**
 * Generated document instance
 */
export interface GeneratedDocument {
  id: string
  organization_id: string
  template_id: string | null
  document_type: DocumentType
  document_name: string
  document_number: string | null         // Auto-generated document number
  description: string | null
  content: string                        // Generated content
  content_format: DocumentFormat
  file_path: string | null               // Storage path
  file_size_bytes: number | null
  status: DocumentStatus
  version: string                        // Document version
  parent_document_id: string | null      // For version control
  version_notes: string | null
  employee_id: string | null             // Related employee
  equipment_id: string | null            // Related equipment
  training_id: string | null             // Related training
  tags: string[]
  metadata: Record<string, any>          // Additional metadata
  generated_at: string
  generated_by: string
  valid_from: string | null
  valid_until: string | null             // Expiry date
  expires_at: string | null              // Calculated expiry
  is_archived: boolean
  archived_at: string | null
  signature_status: SignatureStatus
  signature_required_from: string[]      // User IDs
  signatures: DocumentSignature[]
  created_at: string
  updated_at: string
}

/**
 * Document signature (placeholder for future implementation)
 */
export interface DocumentSignature {
  id: string
  document_id: string
  signer_id: string
  signer_name: string
  signer_email: string
  signer_role: 'employee' | 'consultant' | 'witness' | 'authority'
  signature_type: 'simple' | 'advanced' | 'qualified'
  signature_data: string | null          // Base64 signature image or certificate
  signature_timestamp: string | null
  ip_address: string | null
  user_agent: string | null
  status: SignatureStatus
  signed_at: string | null
  rejected_at: string | null
  rejection_reason: string | null
  expires_at: string | null
  created_at: string
}

/**
 * Document access log
 */
export interface DocumentAccessLog {
  id: string
  document_id: string
  user_id: string
  action: 'view' | 'download' | 'print' | 'edit' | 'delete' | 'sign'
  ip_address: string | null
  user_agent: string | null
  accessed_at: string
}

// ── Helper Functions ──

/**
 * Get document type display name
 * @param documentType - Document type
 * @param locale - Locale (ro, en, etc.)
 * @returns Localized display name
 */
export function getDocumentTypeName(documentType: DocumentType, locale: string = 'ro'): string {
  const names: Record<DocumentType, Record<string, string>> = {
    employee_contract: {
      ro: 'Contract de muncă',
      en: 'Employment Contract',
      bg: 'Трудов договор',
      hu: 'Munkaszerződés',
      de: 'Arbeitsvertrag',
    },
    medical_certificate: {
      ro: 'Adeverință medicală',
      en: 'Medical Certificate',
      bg: 'Медицинско свидетелство',
      hu: 'Orvosi igazolás',
      de: 'Ärztliches Attest',
    },
    training_certificate: {
      ro: 'Adeverință instruire',
      en: 'Training Certificate',
      bg: 'Сертификат за обучение',
      hu: 'Képzési igazolás',
      de: 'Schulungsnachweis',
    },
    work_permit: {
      ro: 'Permis de lucru',
      en: 'Work Permit',
      bg: 'Разрешение за работа',
      hu: 'Munkavégzési engedély',
      de: 'Arbeitserlaubnis',
    },
    safety_instruction: {
      ro: 'Instrucțiune SSM',
      en: 'Safety Instruction',
      bg: 'Инструкция за безопасност',
      hu: 'Biztonsági utasítás',
      de: 'Sicherheitsanweisung',
    },
    fire_evacuation_plan: {
      ro: 'Plan de evacuare PSI',
      en: 'Fire Evacuation Plan',
      bg: 'План за евакуация при пожар',
      hu: 'Tűzriadó terv',
      de: 'Brandschutz-Evakuierungsplan',
    },
    risk_assessment: {
      ro: 'Evaluare de risc',
      en: 'Risk Assessment',
      bg: 'Оценка на риска',
      hu: 'Kockázatértékelés',
      de: 'Gefährdungsbeurteilung',
    },
    equipment_certificate: {
      ro: 'Certificat echipament',
      en: 'Equipment Certificate',
      bg: 'Сертификат за оборудване',
      hu: 'Felszerelés tanúsítvány',
      de: 'Gerätezertifikat',
    },
    inspection_report: {
      ro: 'Raport verificare',
      en: 'Inspection Report',
      bg: 'Доклад от проверка',
      hu: 'Ellenőrzési jelentés',
      de: 'Prüfbericht',
    },
    incident_report: {
      ro: 'Raport incident',
      en: 'Incident Report',
      bg: 'Доклад за инцидент',
      hu: 'Incidens jelentés',
      de: 'Vorfallbericht',
    },
    audit_report: {
      ro: 'Raport audit',
      en: 'Audit Report',
      bg: 'Одитен доклад',
      hu: 'Audit jelentés',
      de: 'Auditbericht',
    },
    compliance_declaration: {
      ro: 'Declarație de conformitate',
      en: 'Compliance Declaration',
      bg: 'Декларация за съответствие',
      hu: 'Megfelelőségi nyilatkozat',
      de: 'Konformitätserklärung',
    },
    authority_correspondence: {
      ro: 'Coresponență cu autorități',
      en: 'Authority Correspondence',
      bg: 'Кореспонденция с власти',
      hu: 'Hatósági levelezés',
      de: 'Behördenkorrespondenz',
    },
    gdpr_consent: {
      ro: 'Consimțământ GDPR',
      en: 'GDPR Consent',
      bg: 'GDPR съгласие',
      hu: 'GDPR hozzájárulás',
      de: 'DSGVO-Einwilligung',
    },
    dpia_report: {
      ro: 'Raport DPIA',
      en: 'DPIA Report',
      bg: 'DPIA доклад',
      hu: 'DPIA jelentés',
      de: 'DSFA-Bericht',
    },
    custom: {
      ro: 'Document personalizat',
      en: 'Custom Document',
      bg: 'Персонализиран документ',
      hu: 'Egyéni dokumentum',
      de: 'Benutzerdefiniertes Dokument',
    },
  }

  return names[documentType]?.[locale] || names[documentType]?.['en'] || documentType
}

/**
 * Get document status display name
 * @param status - Document status
 * @param locale - Locale (ro, en, etc.)
 * @returns Localized display name
 */
export function getDocumentStatusName(status: DocumentStatus, locale: string = 'ro'): string {
  const names: Record<DocumentStatus, Record<string, string>> = {
    draft: {
      ro: 'Ciornă',
      en: 'Draft',
      bg: 'Чернова',
      hu: 'Tervezet',
      de: 'Entwurf',
    },
    active: {
      ro: 'Activ',
      en: 'Active',
      bg: 'Активен',
      hu: 'Aktív',
      de: 'Aktiv',
    },
    expired: {
      ro: 'Expirat',
      en: 'Expired',
      bg: 'Изтекъл',
      hu: 'Lejárt',
      de: 'Abgelaufen',
    },
    archived: {
      ro: 'Arhivat',
      en: 'Archived',
      bg: 'Архивиран',
      hu: 'Archivált',
      de: 'Archiviert',
    },
    revoked: {
      ro: 'Revocat',
      en: 'Revoked',
      bg: 'Анулиран',
      hu: 'Visszavont',
      de: 'Widerrufen',
    },
  }

  return names[status]?.[locale] || names[status]?.['en'] || status
}

/**
 * Calculate document expiry date
 * @param validFrom - Valid from date (ISO string)
 * @param validityPeriodDays - Validity period in days (null = indefinite)
 * @returns Expiry date (ISO string) or null if indefinite
 */
export function calculateDocumentExpiry(
  validFrom: string,
  validityPeriodDays: number | null
): string | null {
  if (validityPeriodDays === null) return null

  const from = new Date(validFrom)
  const expiry = new Date(from)
  expiry.setDate(from.getDate() + validityPeriodDays)

  return expiry.toISOString()
}

/**
 * Check if document is expiring soon
 * @param expiresAt - Expiry date (ISO string)
 * @param alertDays - Alert threshold in days
 * @returns true if expiring within alert threshold
 */
export function isDocumentExpiringSoon(
  expiresAt: string | null,
  alertDays: number = 30
): boolean {
  if (!expiresAt) return false

  const now = new Date()
  const expiry = new Date(expiresAt)
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return daysUntilExpiry > 0 && daysUntilExpiry <= alertDays
}

/**
 * Generate document number
 * @param documentType - Document type
 * @param organizationId - Organization ID
 * @param sequence - Sequential number
 * @returns Generated document number (e.g., "SSM-2026-001234")
 */
export function generateDocumentNumber(
  documentType: DocumentType,
  organizationId: string,
  sequence: number
): string {
  const year = new Date().getFullYear()
  const prefix = documentType.toUpperCase().split('_')[0].substring(0, 4)
  const orgCode = organizationId.substring(0, 4).toUpperCase()
  const seq = sequence.toString().padStart(6, '0')

  return `${prefix}-${orgCode}-${year}-${seq}`
}

// ── Exports ──
export default documentsModule
