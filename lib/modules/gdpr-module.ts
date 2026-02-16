/**
 * GDPR Module
 *
 * Comprehensive GDPR compliance management system for SSM platform
 * Handles data processing registers, consent management, data subject rights,
 * DPIA templates, breach notifications, and DPO dashboard.
 *
 * Dependencies: ssm-core, documents
 */

import { ModuleDefinition, ModuleCapability, ModuleHook } from './types';

// ===========================
// GDPR-SPECIFIC TYPES
// ===========================

export type DataProcessingPurpose =
  | 'employee_management'
  | 'training_records'
  | 'medical_surveillance'
  | 'equipment_tracking'
  | 'compliance_reporting'
  | 'document_management'
  | 'legal_obligations'
  | 'contract_performance'
  | 'legitimate_interest'
  | 'other';

export type LegalBasis =
  | 'consent'
  | 'contract'
  | 'legal_obligation'
  | 'vital_interests'
  | 'public_task'
  | 'legitimate_interests';

export type DataCategory =
  | 'identification_data'
  | 'contact_data'
  | 'employment_data'
  | 'health_data'
  | 'training_data'
  | 'financial_data'
  | 'technical_data'
  | 'location_data'
  | 'other';

export type ConsentStatus = 'granted' | 'withdrawn' | 'pending' | 'expired';

export type DataSubjectRightType =
  | 'access'
  | 'rectification'
  | 'erasure'
  | 'restrict_processing'
  | 'data_portability'
  | 'object'
  | 'automated_decision';

export type RequestStatus =
  | 'submitted'
  | 'under_review'
  | 'in_progress'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export type BreachSeverity = 'low' | 'medium' | 'high' | 'critical';

export type BreachStatus =
  | 'detected'
  | 'under_investigation'
  | 'contained'
  | 'notified_dpa'
  | 'notified_subjects'
  | 'resolved'
  | 'closed';

// ===========================
// DATA STRUCTURES
// ===========================

export interface DataProcessingRecord {
  id: string;
  organizationId: string;
  processingName: string;
  description: string;
  purpose: DataProcessingPurpose;
  legalBasis: LegalBasis;
  legalBasisDetails?: string;
  dataCategories: DataCategory[];
  dataSubjects: string[]; // e.g., "employees", "contractors", "clients"
  recipients?: string[]; // who receives the data
  transferToThirdCountries: boolean;
  thirdCountryDetails?: string;
  safeguards?: string; // for third country transfers
  retentionPeriod: string;
  technicalMeasures: string[];
  organizationalMeasures: string[];
  dpoReviewed: boolean;
  reviewedAt?: Date;
  reviewedBy?: string;
  nextReviewDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ConsentRecord {
  id: string;
  organizationId: string;
  dataSubjectId: string; // employee_id or profile_id
  dataSubjectName: string;
  dataSubjectEmail: string;
  processingActivityId?: string;
  purpose: string;
  legalBasis: LegalBasis;
  consentText: string; // what they agreed to
  status: ConsentStatus;
  grantedAt?: Date;
  withdrawnAt?: Date;
  expiresAt?: Date;
  isExplicit: boolean; // for special categories of data
  isGranular: boolean; // can be partially withdrawn
  consentMethod: 'checkbox' | 'signature' | 'verbal' | 'written' | 'electronic';
  ipAddress?: string;
  userAgent?: string;
  evidenceUrl?: string; // link to signed document
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface DataSubjectRequest {
  id: string;
  organizationId: string;
  requestType: DataSubjectRightType;
  dataSubjectId?: string; // if known
  dataSubjectName: string;
  dataSubjectEmail: string;
  dataSubjectPhone?: string;
  description: string;
  status: RequestStatus;
  submittedAt: Date;
  dueDate: Date; // 30 days from submission
  assignedTo?: string;
  identityVerified: boolean;
  identityVerifiedAt?: Date;
  identityVerificationMethod?: string;
  responseText?: string;
  responseDocumentUrl?: string;
  completedAt?: Date;
  rejectionReason?: string;
  extensionGranted: boolean;
  extensionReason?: string;
  extendedDueDate?: Date;
  internalNotes?: string;
  communicationLog: {
    timestamp: Date;
    from: string;
    to: string;
    message: string;
    method: 'email' | 'phone' | 'in_person' | 'portal';
  }[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface DPIATemplate {
  id: string;
  organizationId: string;
  templateName: string;
  description: string;
  applicableScenarios: string[];
  sections: {
    sectionId: string;
    title: string;
    description: string;
    questions: {
      questionId: string;
      question: string;
      helpText?: string;
      required: boolean;
      answerType: 'text' | 'textarea' | 'select' | 'multiselect' | 'yes_no' | 'scale';
      options?: string[];
    }[];
  }[];
  isDefault: boolean;
  isActive: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface DPIAAssessment {
  id: string;
  organizationId: string;
  templateId: string;
  assessmentName: string;
  processingActivityId?: string;
  description: string;
  status: 'draft' | 'in_progress' | 'under_review' | 'approved' | 'rejected';
  necessityAndProportionality: string;
  risksToRights: {
    riskId: string;
    description: string;
    likelihood: 'low' | 'medium' | 'high';
    severity: 'low' | 'medium' | 'high';
    impactedRights: string[];
    mitigationMeasures: string;
    residualRisk: 'low' | 'medium' | 'high';
  }[];
  responses: {
    sectionId: string;
    questionId: string;
    answer: any;
  }[];
  consultationRequired: boolean;
  dpaConsultationRequired: boolean;
  consultationDetails?: string;
  assessorName: string;
  assessorRole: string;
  dpoReviewed: boolean;
  dpoComments?: string;
  approvedBy?: string;
  approvedAt?: Date;
  nextReviewDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface BreachNotification {
  id: string;
  organizationId: string;
  breachReference: string;
  severity: BreachSeverity;
  status: BreachStatus;
  detectedAt: Date;
  detectedBy: string;
  detectionMethod: string;
  breachType: 'confidentiality' | 'integrity' | 'availability' | 'combined';
  description: string;
  affectedDataCategories: DataCategory[];
  approximateNumberOfSubjects?: number;
  approximateNumberOfRecords?: number;
  likelyConsequences: string;
  measuresToken: string;
  measuresTaken: string;
  notificationToDPARequired: boolean;
  notificationToDPAAt?: Date;
  dpaResponse?: string;
  notificationToSubjectsRequired: boolean;
  notificationToSubjectsAt?: Date;
  notificationMethod?: string;
  containmentActions: {
    actionId: string;
    action: string;
    takenAt: Date;
    takenBy: string;
  }[];
  rootCause?: string;
  preventiveMeasures: string[];
  timeline: {
    eventId: string;
    timestamp: Date;
    event: string;
    performedBy: string;
  }[];
  documentsUrls: string[];
  lessonLearned?: string;
  closedAt?: Date;
  closedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface DPODashboardMetrics {
  organizationId: string;
  period: {
    start: Date;
    end: Date;
  };
  processingActivities: {
    total: number;
    active: number;
    needingReview: number;
    withoutLegalBasis: number;
  };
  consents: {
    total: number;
    granted: number;
    withdrawn: number;
    expiring: number;
  };
  dataSubjectRequests: {
    total: number;
    pending: number;
    overdue: number;
    completed: number;
    byType: Record<DataSubjectRightType, number>;
    averageResponseTime: number; // days
  };
  dpiaAssessments: {
    total: number;
    draft: number;
    inProgress: number;
    completed: number;
    highRisk: number;
  };
  breaches: {
    total: number;
    open: number;
    criticalSeverity: number;
    notifiedToDPA: number;
    notifiedToSubjects: number;
  };
  complianceScore: number; // 0-100
  riskAreas: {
    area: string;
    riskLevel: 'low' | 'medium' | 'high';
    description: string;
    recommendedActions: string[];
  }[];
}

// ===========================
// MODULE CAPABILITIES
// ===========================

const gdprCapabilities: ModuleCapability[] = [
  {
    id: 'gdpr.processing_register',
    name: 'Data Processing Register',
    description: 'Maintain comprehensive register of all data processing activities',
    permissions: ['view', 'create', 'update', 'delete'],
  },
  {
    id: 'gdpr.consent_management',
    name: 'Consent Management',
    description: 'Manage and track data subject consents',
    permissions: ['view', 'create', 'update', 'withdraw'],
  },
  {
    id: 'gdpr.subject_rights',
    name: 'Data Subject Rights',
    description: 'Handle data subject access, rectification, erasure, and portability requests',
    permissions: ['view', 'create', 'update', 'process', 'respond'],
  },
  {
    id: 'gdpr.dpia',
    name: 'Data Protection Impact Assessments',
    description: 'Create and manage DPIA templates and assessments',
    permissions: ['view', 'create', 'update', 'approve', 'delete'],
  },
  {
    id: 'gdpr.breach_notification',
    name: 'Breach Notification',
    description: 'Track and manage data breach notifications',
    permissions: ['view', 'create', 'update', 'notify', 'close'],
  },
  {
    id: 'gdpr.dpo_dashboard',
    name: 'DPO Dashboard',
    description: 'Data Protection Officer oversight and reporting',
    permissions: ['view', 'export', 'review'],
  },
];

// ===========================
// MODULE HOOKS
// ===========================

const gdprHooks: ModuleHook[] = [
  {
    event: 'employee.created',
    handler: 'gdpr.recordProcessingActivity',
    description: 'Record new employee data processing activity',
  },
  {
    event: 'employee.deleted',
    handler: 'gdpr.logErasureRequest',
    description: 'Log data erasure compliance action',
  },
  {
    event: 'consent.withdrawn',
    handler: 'gdpr.suspendProcessing',
    description: 'Suspend processing when consent is withdrawn',
  },
  {
    event: 'breach.detected',
    handler: 'gdpr.initiateNotificationWorkflow',
    description: 'Start breach notification workflow (72h timer)',
  },
  {
    event: 'dsr.submitted',
    handler: 'gdpr.calculateDueDate',
    description: 'Calculate 30-day response deadline for data subject requests',
  },
  {
    event: 'processing.updated',
    handler: 'gdpr.validateLegalBasis',
    description: 'Validate legal basis for data processing',
  },
];

// ===========================
// BUSINESS LOGIC FUNCTIONS
// ===========================

export const gdprFunctions = {
  /**
   * Calculate compliance score for an organization
   */
  calculateComplianceScore: (metrics: Partial<DPODashboardMetrics>): number => {
    let score = 100;

    // Deduct points for processing activities issues
    if (metrics.processingActivities) {
      const { total, needingReview, withoutLegalBasis } = metrics.processingActivities;
      if (total > 0) {
        score -= (needingReview / total) * 15;
        score -= (withoutLegalBasis / total) * 20;
      }
    }

    // Deduct points for consent issues
    if (metrics.consents) {
      const { total, expiring } = metrics.consents;
      if (total > 0) {
        score -= (expiring / total) * 10;
      }
    }

    // Deduct points for overdue DSR
    if (metrics.dataSubjectRequests) {
      const { total, overdue } = metrics.dataSubjectRequests;
      if (total > 0) {
        score -= (overdue / total) * 25;
      }
    }

    // Deduct points for open breaches
    if (metrics.breaches) {
      const { open, criticalSeverity } = metrics.breaches;
      score -= open * 5;
      score -= criticalSeverity * 10;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  },

  /**
   * Determine if DPA notification is required for a breach
   */
  isDPANotificationRequired: (breach: Partial<BreachNotification>): boolean => {
    // High or critical severity always requires notification
    if (breach.severity === 'high' || breach.severity === 'critical') {
      return true;
    }

    // Health data breaches always require notification
    if (breach.affectedDataCategories?.includes('health_data')) {
      return true;
    }

    // Large number of affected subjects
    if (breach.approximateNumberOfSubjects && breach.approximateNumberOfSubjects > 100) {
      return true;
    }

    return false;
  },

  /**
   * Determine if data subjects notification is required
   */
  isSubjectNotificationRequired: (breach: Partial<BreachNotification>): boolean => {
    // Critical severity always requires notification
    if (breach.severity === 'critical') {
      return true;
    }

    // High risk to rights and freedoms
    if (breach.severity === 'high' && breach.affectedDataCategories?.includes('health_data')) {
      return true;
    }

    // Large scale breach
    if (breach.approximateNumberOfSubjects && breach.approximateNumberOfSubjects > 500) {
      return true;
    }

    return false;
  },

  /**
   * Calculate DSR due date (30 days from submission)
   */
  calculateDSRDueDate: (submittedAt: Date, extensionGranted: boolean = false): Date => {
    const dueDate = new Date(submittedAt);
    const days = extensionGranted ? 60 : 30;
    dueDate.setDate(dueDate.getDate() + days);
    return dueDate;
  },

  /**
   * Validate legal basis for processing activity
   */
  validateLegalBasis: (record: Partial<DataProcessingRecord>): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];

    if (!record.legalBasis) {
      errors.push('Bază legală lipsă');
      return { isValid: false, errors };
    }

    // Consent requires explicit documentation
    if (record.legalBasis === 'consent' && !record.legalBasisDetails) {
      errors.push('Consimțământul necesită documentare explicită');
    }

    // Third country transfers require safeguards
    if (record.transferToThirdCountries && !record.safeguards) {
      errors.push('Transferurile în țări terțe necesită garanții adecvate');
    }

    // Special categories of data require explicit legal basis
    if (record.dataCategories?.includes('health_data')) {
      if (!['consent', 'legal_obligation', 'vital_interests'].includes(record.legalBasis)) {
        errors.push('Datele medicale necesită bază legală specifică (consimțământ explicit, obligație legală sau interese vitale)');
      }
    }

    // Retention period required
    if (!record.retentionPeriod) {
      errors.push('Perioada de retenție este obligatorie');
    }

    // Technical and organizational measures required
    if (!record.technicalMeasures || record.technicalMeasures.length === 0) {
      errors.push('Măsurile tehnice de securitate sunt obligatorii');
    }

    if (!record.organizationalMeasures || record.organizationalMeasures.length === 0) {
      errors.push('Măsurile organizaționale de securitate sunt obligatorii');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Calculate risk level for DPIA
   */
  calculateDPIARisk: (risks: DPIAAssessment['risksToRights']): 'low' | 'medium' | 'high' => {
    if (!risks || risks.length === 0) return 'low';

    const riskScores = {
      low: 1,
      medium: 2,
      high: 3,
    };

    let totalScore = 0;
    let maxRisk: 'low' | 'medium' | 'high' = 'low';

    for (const risk of risks) {
      const likelihoodScore = riskScores[risk.likelihood];
      const severityScore = riskScores[risk.severity];
      const residualScore = riskScores[risk.residualRisk];

      totalScore += residualScore;

      if (residualScore >= riskScores.high) {
        maxRisk = 'high';
      } else if (residualScore >= riskScores.medium && maxRisk !== 'high') {
        maxRisk = 'medium';
      }
    }

    return maxRisk;
  },

  /**
   * Generate data portability export
   */
  generatePortabilityExport: (dataSubjectId: string, organizationId: string): {
    personalData: Record<string, any>;
    format: 'json' | 'csv' | 'xml';
    generatedAt: Date;
  } => {
    // This would collect data from various tables
    // For now, return structure
    return {
      personalData: {
        profile: {},
        employment: {},
        trainings: [],
        medicalRecords: [],
        consents: [],
      },
      format: 'json',
      generatedAt: new Date(),
    };
  },

  /**
   * Check if consent is still valid
   */
  isConsentValid: (consent: ConsentRecord): boolean => {
    if (consent.status !== 'granted') return false;
    if (consent.expiresAt && consent.expiresAt < new Date()) return false;
    if (consent.withdrawnAt) return false;
    return true;
  },

  /**
   * Generate breach notification report for DPA
   */
  generateBreachReport: (breach: BreachNotification): {
    sections: {
      title: string;
      content: string;
    }[];
  } => {
    return {
      sections: [
        {
          title: '1. Descrierea încălcării',
          content: breach.description,
        },
        {
          title: '2. Natura datelor personale afectate',
          content: breach.affectedDataCategories.join(', '),
        },
        {
          title: '3. Număr aproximativ de persoane afectate',
          content: `${breach.approximateNumberOfSubjects || 'Necunoscut'} persoane, ${breach.approximateNumberOfRecords || 'Necunoscut'} înregistrări`,
        },
        {
          title: '4. Consecințe probabile',
          content: breach.likelyConsequences,
        },
        {
          title: '5. Măsuri luate',
          content: breach.measuresTaken,
        },
        {
          title: '6. Măsuri preventive',
          content: breach.preventiveMeasures.join('\n'),
        },
      ],
    };
  },
};

// ===========================
// DEFAULT DPIA TEMPLATE
// ===========================

export const defaultDPIATemplate: Omit<DPIATemplate, 'id' | 'organizationId' | 'createdAt' | 'updatedAt' | 'createdBy'> = {
  templateName: 'DPIA Standard Template',
  description: 'Template standard pentru evaluarea impactului asupra protecției datelor',
  applicableScenarios: [
    'Prelucrare automată sistematică pentru profilare',
    'Prelucrare la scară largă a categoriilor speciale de date',
    'Monitorizare sistematică la scară largă',
  ],
  sections: [
    {
      sectionId: 'processing-description',
      title: 'Descrierea Prelucrării',
      description: 'Informații generale despre activitatea de prelucrare',
      questions: [
        {
          questionId: 'proc-name',
          question: 'Care este numele activității de prelucrare?',
          required: true,
          answerType: 'text',
        },
        {
          questionId: 'proc-purpose',
          question: 'Care este scopul prelucrării?',
          required: true,
          answerType: 'textarea',
        },
        {
          questionId: 'proc-legal-basis',
          question: 'Care este baza legală pentru prelucrare?',
          required: true,
          answerType: 'select',
          options: ['Consimțământ', 'Contract', 'Obligație legală', 'Interese vitale', 'Interes legitim'],
        },
      ],
    },
    {
      sectionId: 'necessity-proportionality',
      title: 'Necesitate și Proporționalitate',
      description: 'Evaluarea necesității și proporționalității prelucrării',
      questions: [
        {
          questionId: 'nec-justified',
          question: 'Este prelucrarea necesară și justificată pentru scopul declarat?',
          required: true,
          answerType: 'yes_no',
        },
        {
          questionId: 'nec-alternatives',
          question: 'Au fost evaluate alternative care implică mai puține date?',
          required: true,
          answerType: 'yes_no',
        },
        {
          questionId: 'nec-minimization',
          question: 'Cum este respectat principiul minimizării datelor?',
          required: true,
          answerType: 'textarea',
        },
      ],
    },
    {
      sectionId: 'risks-assessment',
      title: 'Evaluarea Riscurilor',
      description: 'Identificarea și evaluarea riscurilor pentru drepturile persoanelor',
      questions: [
        {
          questionId: 'risk-identification',
          question: 'Care sunt principalele riscuri identificate?',
          required: true,
          answerType: 'textarea',
        },
        {
          questionId: 'risk-likelihood',
          question: 'Care este probabilitatea materializării riscurilor?',
          required: true,
          answerType: 'select',
          options: ['Scăzută', 'Medie', 'Ridicată'],
        },
        {
          questionId: 'risk-severity',
          question: 'Care este severitatea potențială a impactului?',
          required: true,
          answerType: 'select',
          options: ['Scăzută', 'Medie', 'Ridicată'],
        },
      ],
    },
    {
      sectionId: 'mitigation-measures',
      title: 'Măsuri de Atenuare',
      description: 'Măsuri pentru reducerea riscurilor identificate',
      questions: [
        {
          questionId: 'mit-technical',
          question: 'Ce măsuri tehnice sunt implementate?',
          helpText: 'Ex: criptare, pseudonimizare, control acces',
          required: true,
          answerType: 'textarea',
        },
        {
          questionId: 'mit-organizational',
          question: 'Ce măsuri organizaționale sunt implementate?',
          helpText: 'Ex: politici, training, proceduri',
          required: true,
          answerType: 'textarea',
        },
        {
          questionId: 'mit-residual-risk',
          question: 'Care este nivelul riscului rezidual după aplicarea măsurilor?',
          required: true,
          answerType: 'select',
          options: ['Scăzut', 'Mediu', 'Ridicat'],
        },
      ],
    },
    {
      sectionId: 'consultation',
      title: 'Consultare',
      description: 'Consultare cu părțile interesate și DPO',
      questions: [
        {
          questionId: 'cons-dpo',
          question: 'A fost consultat DPO-ul?',
          required: true,
          answerType: 'yes_no',
        },
        {
          questionId: 'cons-subjects',
          question: 'Au fost consultate persoanele vizate sau reprezentanții acestora?',
          required: false,
          answerType: 'yes_no',
        },
        {
          questionId: 'cons-dpa-needed',
          question: 'Este necesară consultarea ANSPDCP?',
          helpText: 'Dacă riscul rezidual rămâne ridicat',
          required: true,
          answerType: 'yes_no',
        },
      ],
    },
  ],
  isDefault: true,
  isActive: true,
  version: 1,
};

// ===========================
// MODULE DEFINITION
// ===========================

export const gdprModule = {
  id: 'gdpr',
  name: 'GDPR Compliance',
  description: 'Comprehensive GDPR compliance management: data processing registers, consent management, data subject rights, DPIA, breach notifications, and DPO dashboard',
  version: '1.0.0',
  category: 'premium',
  dependencies: ['ssm-core', 'documents'],
  capabilities: gdprCapabilities,
  hooks: gdprHooks,
  settings: {
    dpoName: {
      type: 'string',
      label: 'Nume DPO (Data Protection Officer)',
      required: false,
    },
    dpoEmail: {
      type: 'string',
      label: 'Email DPO',
      required: false,
    },
    dpoPhone: {
      type: 'string',
      label: 'Telefon DPO',
      required: false,
    },
    defaultRetentionPeriod: {
      type: 'string',
      label: 'Perioadă de retenție implicită',
      defaultValue: '5 ani de la încetarea relației contractuale',
      required: true,
    },
    breachNotificationEmail: {
      type: 'string',
      label: 'Email pentru notificări încălcări',
      required: true,
    },
    autoNotifyDPO: {
      type: 'boolean',
      label: 'Notificare automată DPO la evenimente critice',
      defaultValue: true,
      required: false,
    },
    dsrResponseDeadline: {
      type: 'number',
      label: 'Termen răspuns cereri DSR (zile)',
      defaultValue: 30,
      required: true,
    },
    enableConsentReminders: {
      type: 'boolean',
      label: 'Activează reminder-e expirare consimțământ',
      defaultValue: true,
      required: false,
    },
    consentReminderDays: {
      type: 'number',
      label: 'Zile înainte de expirare pentru reminder',
      defaultValue: 30,
      required: false,
    },
    dpaContactEmail: {
      type: 'string',
      label: 'Email ANSPDCP (pentru notificări încălcări)',
      defaultValue: 'anspdcp@dataprotection.ro',
      required: false,
    },
    enableAuditLog: {
      type: 'boolean',
      label: 'Log audit pentru toate operațiunile GDPR',
      defaultValue: true,
      required: false,
    },
  },
  isActive: true,
  isCore: false,
};

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Get color for consent status
 */
export const getConsentStatusColor = (status: ConsentStatus): string => {
  switch (status) {
    case 'granted':
      return 'green';
    case 'withdrawn':
      return 'red';
    case 'pending':
      return 'yellow';
    case 'expired':
      return 'gray';
    default:
      return 'gray';
  }
};

/**
 * Get color for request status
 */
export const getRequestStatusColor = (status: RequestStatus): string => {
  switch (status) {
    case 'submitted':
      return 'blue';
    case 'under_review':
    case 'in_progress':
      return 'yellow';
    case 'completed':
      return 'green';
    case 'rejected':
      return 'red';
    case 'cancelled':
      return 'gray';
    default:
      return 'gray';
  }
};

/**
 * Get color for breach severity
 */
export const getBreachSeverityColor = (severity: BreachSeverity): string => {
  switch (severity) {
    case 'low':
      return 'green';
    case 'medium':
      return 'yellow';
    case 'high':
      return 'orange';
    case 'critical':
      return 'red';
    default:
      return 'gray';
  }
};

/**
 * Get label for data subject right type
 */
export const getDataSubjectRightLabel = (type: DataSubjectRightType): string => {
  const labels: Record<DataSubjectRightType, string> = {
    access: 'Drept de acces',
    rectification: 'Drept de rectificare',
    erasure: 'Drept la ștergere ("dreptul de a fi uitat")',
    restrict_processing: 'Drept de restricționare a prelucrării',
    data_portability: 'Drept la portabilitatea datelor',
    object: 'Drept de opoziție',
    automated_decision: 'Drept legat de deciziile automatizate',
  };
  return labels[type] || type;
};

/**
 * Get label for legal basis
 */
export const getLegalBasisLabel = (basis: LegalBasis): string => {
  const labels: Record<LegalBasis, string> = {
    consent: 'Consimțământ',
    contract: 'Executarea unui contract',
    legal_obligation: 'Obligație legală',
    vital_interests: 'Interese vitale',
    public_task: 'Misiune de interes public',
    legitimate_interests: 'Interese legitime',
  };
  return labels[basis] || basis;
};

/**
 * Get label for data category
 */
export const getDataCategoryLabel = (category: DataCategory): string => {
  const labels: Record<DataCategory, string> = {
    identification_data: 'Date de identificare',
    contact_data: 'Date de contact',
    employment_data: 'Date privind ocuparea forței de muncă',
    health_data: 'Date medicale',
    training_data: 'Date instruire/formare',
    financial_data: 'Date financiare',
    technical_data: 'Date tehnice',
    location_data: 'Date de localizare',
    other: 'Altele',
  };
  return labels[category] || category;
};

export default gdprModule;
