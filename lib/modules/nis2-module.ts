/**
 * NIS2 Module (Network and Information Systems Security Directive)
 *
 * Comprehensive cybersecurity compliance management for EU NIS2 Directive
 * Handles cybersecurity risk assessment, incident reporting (24h/72h deadlines),
 * supply chain security, encryption requirements, access control audits, and training tracking.
 *
 * Dependencies: ssm-core, gdpr
 */

import { ModuleDefinition, ModuleCapability, ModuleHook } from './types';

// ===========================
// NIS2-SPECIFIC TYPES
// ===========================

export type NIS2EntityType =
  | 'essential'           // Essential entities (stricter requirements)
  | 'important';          // Important entities

export type NIS2Sector =
  | 'energy'
  | 'transport'
  | 'banking'
  | 'financial_market_infrastructure'
  | 'health'
  | 'drinking_water'
  | 'wastewater'
  | 'digital_infrastructure'
  | 'ict_service_management'
  | 'public_administration'
  | 'space'
  | 'postal_courier'
  | 'waste_management'
  | 'chemicals'
  | 'food'
  | 'manufacturing'
  | 'digital_providers'
  | 'research';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type IncidentSeverity = 'minor' | 'significant' | 'major' | 'critical';

export type IncidentStatus =
  | 'detected'
  | 'initial_assessment'
  | 'early_warning_sent'        // within 24h
  | 'under_investigation'
  | 'notification_sent'          // within 72h
  | 'contained'
  | 'remediated'
  | 'final_report_submitted'
  | 'closed';

export type ControlStatus = 'not_implemented' | 'partial' | 'implemented' | 'verified';

export type AuditStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue';

export type SupplyChainRiskLevel = 'low' | 'medium' | 'high' | 'critical';

// ===========================
// DATA STRUCTURES
// ===========================

/**
 * NIS2 Cybersecurity Assessment Checklist
 */
export interface NIS2Assessment {
  id: string;
  organizationId: string;
  assessmentName: string;
  entityType: NIS2EntityType;
  sector: NIS2Sector;
  assessmentDate: Date;
  assessorName: string;
  assessorRole: string;
  overallRiskLevel: RiskLevel;
  complianceScore: number; // 0-100

  // Risk management measures (Art. 21 NIS2)
  riskManagement: {
    controlId: string;
    category: 'risk_analysis' | 'incident_handling' | 'business_continuity' |
              'supply_chain' | 'security_acquisition' | 'effectiveness_testing' |
              'cryptography' | 'human_resources' | 'access_control' | 'asset_management';
    control: string;
    description: string;
    status: ControlStatus;
    implementationDate?: Date;
    evidenceUrl?: string;
    notes?: string;
    lastReviewDate?: Date;
    nextReviewDate?: Date;
  }[];

  // Technical controls
  technicalControls: {
    multiFactorAuth: boolean;
    encryptionAtRest: boolean;
    encryptionInTransit: boolean;
    secureVoiceCommunications: boolean;
    secureCommunicationsSystems: boolean;
    patchManagementProcess: boolean;
    vulnerabilityManagement: boolean;
    networkSegmentation: boolean;
    intrusionDetectionSystem: boolean;
    securityInformationEventManagement: boolean;
    dataBackupStrategy: boolean;
    disasterRecoveryPlan: boolean;
  };

  // Organizational controls
  organizationalControls: {
    cyberSecurityPolicy: boolean;
    incidentResponsePlan: boolean;
    businessContinuityPlan: boolean;
    supplyChainSecurityPolicy: boolean;
    securityAwarenessTraining: boolean;
    managementApproval: boolean;
    csirtEstablished: boolean;
    thirdPartyRiskAssessment: boolean;
  };

  gaps: {
    gapId: string;
    control: string;
    description: string;
    riskLevel: RiskLevel;
    remediationPlan: string;
    targetDate?: Date;
    assignedTo?: string;
    status: 'open' | 'in_progress' | 'resolved';
  }[];

  recommendations: string[];
  nextAssessmentDate: Date;

  approvedBy?: string;
  approvedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * NIS2 Incident (Art. 23 - Reporting obligations)
 */
export interface NIS2Incident {
  id: string;
  organizationId: string;
  incidentReference: string;

  // Detection and classification
  detectedAt: Date;
  detectedBy: string;
  detectionMethod: string;
  severity: IncidentSeverity;
  status: IncidentStatus;

  // Incident details
  incidentType: 'cyber_attack' | 'system_failure' | 'data_breach' | 'ransomware' |
                'ddos' | 'malware' | 'phishing' | 'unauthorized_access' |
                'supply_chain_compromise' | 'other';
  description: string;
  affectedSystems: string[];
  affectedServices: string[];
  potentialImpact: string;

  // NIS2 specific impact assessment
  impactAssessment: {
    servicesDisrupted: boolean;
    durationOfDisruption?: number; // hours
    numberOfUsersAffected?: number;
    economicImpact?: number;
    reputationalDamage: 'none' | 'minor' | 'moderate' | 'severe';
    cascadingEffects: boolean;
    crossBorderImpact: boolean;
    affectedCountries?: string[];
    criticalInfrastructureImpact: boolean;
  };

  // Reporting timeline (Art. 23)
  earlyWarning: {
    required: boolean;
    deadline: Date; // within 24h of detection
    sentAt?: Date;
    recipientAuthority: string;
    notificationMethod: string;
  };

  incidentNotification: {
    required: boolean;
    deadline: Date; // within 72h of detection
    sentAt?: Date;
    recipientAuthority: string;
    notificationMethod: string;
    notificationContent?: string;
  };

  intermediateReport: {
    required: boolean;
    deadline?: Date; // if requested by authority
    sentAt?: Date;
  };

  finalReport: {
    required: boolean;
    deadline: Date; // within 1 month of incident notification
    sentAt?: Date;
    reportUrl?: string;
  };

  // Incident response
  responseActions: {
    actionId: string;
    timestamp: Date;
    action: string;
    performedBy: string;
    result?: string;
  }[];

  containmentMeasures: string[];
  remediationSteps: string[];
  rootCause?: string;
  lessonsLearned?: string;

  // Cross-reporting requirements
  gdprBreachReported: boolean;
  gdprBreachId?: string;
  lawEnforcementNotified: boolean;

  closedAt?: Date;
  closedBy?: string;

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * Supply Chain Security (Art. 21.2(e))
 */
export interface SupplyChainVendor {
  id: string;
  organizationId: string;
  vendorName: string;
  vendorType: 'software' | 'hardware' | 'cloud_service' | 'managed_service' |
              'consultant' | 'subcontractor' | 'other';

  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;

  servicesProvided: string[];
  criticalityLevel: 'low' | 'medium' | 'high' | 'critical';

  // Security assessment
  securityAssessment: {
    assessmentDate: Date;
    assessorName: string;
    riskLevel: SupplyChainRiskLevel;

    // Key criteria
    iso27001Certified: boolean;
    nis2Compliant: boolean;
    gdprCompliant: boolean;
    hasSecurityPolicy: boolean;
    hasIncidentResponsePlan: boolean;
    conductsPenetrationTests: boolean;
    hasDataProtectionAgreement: boolean;

    findings: string[];
    gaps: string[];
    mitigationMeasures: string[];

    nextReviewDate: Date;
  };

  // Contract management
  contractStartDate?: Date;
  contractEndDate?: Date;
  contractUrl?: string;

  // Incident tracking
  incidentHistory: {
    incidentId: string;
    date: Date;
    description: string;
    impact: string;
    resolved: boolean;
  }[];

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * Encryption & Cryptography Compliance
 */
export interface EncryptionInventory {
  id: string;
  organizationId: string;

  dataAtRest: {
    systemId: string;
    systemName: string;
    location: 'on_premise' | 'cloud' | 'hybrid';
    dataTypes: string[];
    encryptionEnabled: boolean;
    encryptionMethod?: string; // e.g., "AES-256"
    keyManagement?: string;
    lastAuditDate?: Date;
    compliant: boolean;
    notes?: string;
  }[];

  dataInTransit: {
    systemId: string;
    systemName: string;
    communicationType: 'internet' | 'internal' | 'vpn' | 'api';
    encryptionEnabled: boolean;
    protocol?: string; // e.g., "TLS 1.3"
    certificateExpiry?: Date;
    lastAuditDate?: Date;
    compliant: boolean;
    notes?: string;
  }[];

  voiceVideoComms: {
    systemId: string;
    systemName: string;
    commsType: 'voice' | 'video' | 'both';
    encryptionEnabled: boolean;
    encryptionMethod?: string;
    compliant: boolean;
    notes?: string;
  }[];

  overallCompliance: number; // 0-100

  lastReviewDate: Date;
  nextReviewDate: Date;
  reviewedBy: string;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Access Control Audit
 */
export interface AccessControlAudit {
  id: string;
  organizationId: string;
  auditName: string;
  auditDate: Date;
  auditorName: string;
  status: AuditStatus;

  // User access review
  userAccounts: {
    userId: string;
    userName: string;
    email: string;
    department?: string;
    role: string;
    privilegeLevel: 'standard' | 'elevated' | 'admin' | 'super_admin';
    mfaEnabled: boolean;
    lastLogin?: Date;
    accountStatus: 'active' | 'inactive' | 'locked' | 'disabled';
    reviewStatus: 'approved' | 'revoke_access' | 'reduce_privileges' | 'pending';
    reviewNotes?: string;
  }[];

  // Privileged accounts review
  privilegedAccounts: {
    accountId: string;
    accountName: string;
    accountType: 'admin' | 'service' | 'root' | 'emergency';
    systemsAccessed: string[];
    lastUsed?: Date;
    justification: string;
    reviewStatus: 'approved' | 'remove' | 'pending';
    reviewNotes?: string;
  }[];

  // Access rights matrix
  rolePermissions: {
    roleId: string;
    roleName: string;
    permissions: string[];
    justification: string;
    reviewStatus: 'approved' | 'modify' | 'pending';
  }[];

  // Findings
  findings: {
    findingId: string;
    severity: RiskLevel;
    category: 'orphaned_account' | 'excessive_privileges' | 'no_mfa' |
              'inactive_account' | 'shared_account' | 'weak_password_policy' | 'other';
    description: string;
    affectedUsers: string[];
    remediationAction: string;
    targetDate?: Date;
    status: 'open' | 'in_progress' | 'resolved';
  }[];

  nextAuditDate: Date;

  approvedBy?: string;
  approvedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * Cybersecurity Training Tracking
 */
export interface NIS2Training {
  id: string;
  organizationId: string;
  employeeId?: string;
  employeeName: string;
  employeeEmail: string;
  department?: string;
  role: string;

  trainingType: 'awareness' | 'phishing_simulation' | 'incident_response' |
                'secure_coding' | 'data_protection' | 'management' | 'technical';
  trainingName: string;
  trainingProvider?: string;

  scheduledDate?: Date;
  completedDate?: Date;
  expiryDate?: Date;

  status: 'scheduled' | 'completed' | 'failed' | 'expired' | 'overdue';

  // Assessment
  assessmentScore?: number; // 0-100
  assessmentPassed?: boolean;
  certificate?: string; // URL to certificate

  // Phishing simulation specific
  simulationResults?: {
    emailsSent: number;
    emailsOpened: number;
    linksClicked: number;
    credentialsSubmitted: number;
    reported: number;
  };

  notes?: string;

  nextTrainingDate?: Date;

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * NIS2 Compliance Dashboard Metrics
 */
export interface NIS2DashboardMetrics {
  organizationId: string;
  period: {
    start: Date;
    end: Date;
  };

  overallComplianceScore: number; // 0-100

  riskManagement: {
    controlsTotal: number;
    controlsImplemented: number;
    controlsVerified: number;
    gapsOpen: number;
    gapsCritical: number;
  };

  incidentManagement: {
    totalIncidents: number;
    activeIncidents: number;
    criticalIncidents: number;
    earlyWarningsOnTime: number;
    earlyWarningsLate: number;
    notificationsOnTime: number;
    notificationsLate: number;
    finalReportsPending: number;
  };

  supplyChain: {
    totalVendors: number;
    criticalVendors: number;
    vendorsAssessed: number;
    highRiskVendors: number;
    reviewsOverdue: number;
  };

  encryption: {
    systemsTotal: number;
    systemsEncrypted: number;
    nonCompliantSystems: number;
    certificatesExpiringSoon: number;
  };

  accessControl: {
    totalUsers: number;
    usersWithMFA: number;
    privilegedAccounts: number;
    inactiveAccounts: number;
    lastAuditDate?: Date;
    nextAuditDate?: Date;
  };

  training: {
    totalEmployees: number;
    employeesTrained: number;
    trainingsExpired: number;
    trainingsExpiringSoon: number;
    phishingSuccessRate?: number;
  };

  riskAreas: {
    area: string;
    riskLevel: RiskLevel;
    description: string;
    priority: number;
    recommendedActions: string[];
  }[];
}

// ===========================
// MODULE CAPABILITIES
// ===========================

const nis2Capabilities: ModuleCapability[] = [
  {
    id: 'nis2.risk_assessment',
    name: 'Cybersecurity Risk Assessment',
    description: 'Comprehensive NIS2 compliance assessment and risk management checklist',
    permissions: ['view', 'create', 'update', 'approve', 'export'],
  },
  {
    id: 'nis2.incident_management',
    name: 'Incident Reporting (24h/72h)',
    description: 'Manage cybersecurity incidents with 24h early warning and 72h notification deadlines',
    permissions: ['view', 'create', 'update', 'report', 'close'],
  },
  {
    id: 'nis2.supply_chain',
    name: 'Supply Chain Security',
    description: 'Vendor security assessment and supply chain risk management',
    permissions: ['view', 'create', 'update', 'assess', 'delete'],
  },
  {
    id: 'nis2.encryption',
    name: 'Encryption Compliance',
    description: 'Track encryption implementation for data at rest, in transit, and communications',
    permissions: ['view', 'create', 'update', 'audit'],
  },
  {
    id: 'nis2.access_control',
    name: 'Access Control Audit',
    description: 'User access reviews, privilege management, and MFA compliance',
    permissions: ['view', 'create', 'update', 'audit', 'approve'],
  },
  {
    id: 'nis2.training',
    name: 'Cybersecurity Training',
    description: 'Employee cybersecurity awareness and technical training tracking',
    permissions: ['view', 'create', 'update', 'delete'],
  },
  {
    id: 'nis2.dashboard',
    name: 'NIS2 Compliance Dashboard',
    description: 'Comprehensive compliance metrics and reporting',
    permissions: ['view', 'export'],
  },
];

// ===========================
// MODULE HOOKS
// ===========================

const nis2Hooks: ModuleHook[] = [
  {
    event: 'incident.detected',
    handler: 'nis2.startReportingTimeline',
    description: 'Start 24h/72h reporting countdown when incident is detected',
  },
  {
    event: 'incident.severity_updated',
    handler: 'nis2.reassessReportingRequirements',
    description: 'Reassess reporting requirements if severity changes',
  },
  {
    event: 'incident.24h_deadline',
    handler: 'nis2.alertEarlyWarningDue',
    description: 'Alert when 24h early warning deadline is approaching',
  },
  {
    event: 'incident.72h_deadline',
    handler: 'nis2.alertNotificationDue',
    description: 'Alert when 72h incident notification deadline is approaching',
  },
  {
    event: 'vendor.added',
    handler: 'nis2.scheduleSecurityAssessment',
    description: 'Schedule security assessment for new vendor',
  },
  {
    event: 'vendor.assessment_overdue',
    handler: 'nis2.alertSupplyChainReview',
    description: 'Alert when vendor security assessment is overdue',
  },
  {
    event: 'certificate.expiring',
    handler: 'nis2.alertCertificateRenewal',
    description: 'Alert when encryption certificates are expiring',
  },
  {
    event: 'training.expired',
    handler: 'nis2.scheduleRetraining',
    description: 'Schedule retraining when cybersecurity training expires',
  },
  {
    event: 'access_audit.finding',
    handler: 'nis2.createRemediationTask',
    description: 'Create remediation task for access control findings',
  },
  {
    event: 'gdpr.breach',
    handler: 'nis2.checkIncidentReporting',
    description: 'Check if GDPR breach also requires NIS2 incident reporting',
  },
];

// ===========================
// BUSINESS LOGIC FUNCTIONS
// ===========================

export const nis2Functions = {
  /**
   * Calculate overall NIS2 compliance score
   */
  calculateComplianceScore: (metrics: Partial<NIS2DashboardMetrics>): number => {
    let score = 100;

    // Risk management (30%)
    if (metrics.riskManagement) {
      const { controlsTotal, controlsVerified, gapsCritical } = metrics.riskManagement;
      if (controlsTotal > 0) {
        const controlsScore = (controlsVerified / controlsTotal) * 30;
        score -= (30 - controlsScore);
      }
      score -= gapsCritical * 5; // -5 points per critical gap
    }

    // Incident management (20%)
    if (metrics.incidentManagement) {
      const { earlyWarningsLate, notificationsLate } = metrics.incidentManagement;
      score -= earlyWarningsLate * 10; // Late early warnings are serious
      score -= notificationsLate * 10; // Late notifications are serious
    }

    // Supply chain (15%)
    if (metrics.supplyChain) {
      const { totalVendors, vendorsAssessed, highRiskVendors } = metrics.supplyChain;
      if (totalVendors > 0) {
        const assessmentScore = (vendorsAssessed / totalVendors) * 15;
        score -= (15 - assessmentScore);
      }
      score -= highRiskVendors * 3;
    }

    // Encryption (15%)
    if (metrics.encryption) {
      const { systemsTotal, systemsEncrypted } = metrics.encryption;
      if (systemsTotal > 0) {
        const encryptionScore = (systemsEncrypted / systemsTotal) * 15;
        score -= (15 - encryptionScore);
      }
    }

    // Access control (10%)
    if (metrics.accessControl) {
      const { totalUsers, usersWithMFA } = metrics.accessControl;
      if (totalUsers > 0) {
        const mfaScore = (usersWithMFA / totalUsers) * 10;
        score -= (10 - mfaScore);
      }
    }

    // Training (10%)
    if (metrics.training) {
      const { totalEmployees, employeesTrained } = metrics.training;
      if (totalEmployees > 0) {
        const trainingScore = (employeesTrained / totalEmployees) * 10;
        score -= (10 - trainingScore);
      }
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  },

  /**
   * Calculate incident reporting deadlines
   */
  calculateReportingDeadlines: (detectedAt: Date): {
    earlyWarningDeadline: Date;
    notificationDeadline: Date;
    finalReportDeadline: Date;
  } => {
    const detected = new Date(detectedAt);

    // Early warning: within 24 hours
    const earlyWarningDeadline = new Date(detected);
    earlyWarningDeadline.setHours(earlyWarningDeadline.getHours() + 24);

    // Incident notification: within 72 hours
    const notificationDeadline = new Date(detected);
    notificationDeadline.setHours(notificationDeadline.getHours() + 72);

    // Final report: within 1 month of notification
    const finalReportDeadline = new Date(notificationDeadline);
    finalReportDeadline.setDate(finalReportDeadline.getDate() + 30);

    return {
      earlyWarningDeadline,
      notificationDeadline,
      finalReportDeadline,
    };
  },

  /**
   * Determine if incident requires reporting to authorities
   */
  requiresReporting: (incident: Partial<NIS2Incident>): {
    earlyWarningRequired: boolean;
    notificationRequired: boolean;
    reason: string;
  } => {
    // Critical or major incidents always require reporting
    if (incident.severity === 'critical' || incident.severity === 'major') {
      return {
        earlyWarningRequired: true,
        notificationRequired: true,
        reason: 'Severitate critică/majoră - raportare obligatorie conform Art. 23 NIS2',
      };
    }

    // Significant incidents with service disruption
    if (incident.severity === 'significant' && incident.impactAssessment?.servicesDisrupted) {
      return {
        earlyWarningRequired: true,
        notificationRequired: true,
        reason: 'Incident semnificativ cu întrerupere de servicii',
      };
    }

    // Cross-border impact
    if (incident.impactAssessment?.crossBorderImpact) {
      return {
        earlyWarningRequired: true,
        notificationRequired: true,
        reason: 'Impact transfrontalier - notificare obligatorie',
      };
    }

    // Critical infrastructure impact
    if (incident.impactAssessment?.criticalInfrastructureImpact) {
      return {
        earlyWarningRequired: true,
        notificationRequired: true,
        reason: 'Impact asupra infrastructurii critice',
      };
    }

    return {
      earlyWarningRequired: false,
      notificationRequired: false,
      reason: 'Incident minor - raportare nu este obligatorie, dar se recomandă documentare internă',
    };
  },

  /**
   * Assess vendor risk level
   */
  assessVendorRisk: (vendor: Partial<SupplyChainVendor>): SupplyChainRiskLevel => {
    if (!vendor.securityAssessment) return 'high';

    const { securityAssessment } = vendor;
    let riskScore = 0;

    // Positive factors (reduce risk)
    if (securityAssessment.iso27001Certified) riskScore += 2;
    if (securityAssessment.nis2Compliant) riskScore += 2;
    if (securityAssessment.gdprCompliant) riskScore += 1;
    if (securityAssessment.hasSecurityPolicy) riskScore += 1;
    if (securityAssessment.hasIncidentResponsePlan) riskScore += 1;
    if (securityAssessment.conductsPenetrationTests) riskScore += 1;
    if (securityAssessment.hasDataProtectionAgreement) riskScore += 1;

    // Criticality level (increases risk if vendor is critical)
    const criticalityPenalty = vendor.criticalityLevel === 'critical' ? 0 :
                               vendor.criticalityLevel === 'high' ? 1 : 2;

    const finalScore = riskScore + criticalityPenalty;

    // Scoring: 0-3 = critical, 4-6 = high, 7-9 = medium, 10+ = low
    if (finalScore <= 3) return 'critical';
    if (finalScore <= 6) return 'high';
    if (finalScore <= 9) return 'medium';
    return 'low';
  },

  /**
   * Calculate encryption compliance percentage
   */
  calculateEncryptionCompliance: (inventory: Partial<EncryptionInventory>): number => {
    let totalSystems = 0;
    let compliantSystems = 0;

    if (inventory.dataAtRest) {
      totalSystems += inventory.dataAtRest.length;
      compliantSystems += inventory.dataAtRest.filter(s => s.compliant).length;
    }

    if (inventory.dataInTransit) {
      totalSystems += inventory.dataInTransit.length;
      compliantSystems += inventory.dataInTransit.filter(s => s.compliant).length;
    }

    if (inventory.voiceVideoComms) {
      totalSystems += inventory.voiceVideoComms.length;
      compliantSystems += inventory.voiceVideoComms.filter(s => s.compliant).length;
    }

    if (totalSystems === 0) return 0;

    return Math.round((compliantSystems / totalSystems) * 100);
  },

  /**
   * Generate NIS2 incident report
   */
  generateIncidentReport: (incident: NIS2Incident): {
    sections: {
      title: string;
      content: string;
    }[];
  } => {
    return {
      sections: [
        {
          title: '1. Identificare incident',
          content: `Referință: ${incident.incidentReference}\nTip: ${incident.incidentType}\nSeveritate: ${incident.severity}\nData detectării: ${incident.detectedAt.toISOString()}`,
        },
        {
          title: '2. Descriere incident',
          content: incident.description,
        },
        {
          title: '3. Sisteme și servicii afectate',
          content: `Sisteme: ${incident.affectedSystems.join(', ')}\nServicii: ${incident.affectedServices.join(', ')}`,
        },
        {
          title: '4. Evaluare impact',
          content: `Servicii întrerupte: ${incident.impactAssessment.servicesDisrupted ? 'Da' : 'Nu'}\n` +
                   `Durată întrerupere: ${incident.impactAssessment.durationOfDisruption || 'N/A'} ore\n` +
                   `Utilizatori afectați: ${incident.impactAssessment.numberOfUsersAffected || 'N/A'}\n` +
                   `Impact transfrontalier: ${incident.impactAssessment.crossBorderImpact ? 'Da' : 'Nu'}`,
        },
        {
          title: '5. Măsuri de răspuns',
          content: incident.responseActions.map(a => `${a.timestamp.toISOString()}: ${a.action}`).join('\n'),
        },
        {
          title: '6. Cauza de bază',
          content: incident.rootCause || 'În curs de investigare',
        },
        {
          title: '7. Măsuri corective',
          content: incident.remediationSteps.join('\n'),
        },
        {
          title: '8. Lecții învățate',
          content: incident.lessonsLearned || 'În curs de elaborare',
        },
      ],
    };
  },

  /**
   * Check MFA compliance
   */
  calculateMFACompliance: (audit: AccessControlAudit): number => {
    const totalUsers = audit.userAccounts.length;
    if (totalUsers === 0) return 0;

    const usersWithMFA = audit.userAccounts.filter(u => u.mfaEnabled).length;
    return Math.round((usersWithMFA / totalUsers) * 100);
  },
};

// ===========================
// DEFAULT NIS2 CONTROLS CHECKLIST
// ===========================

export const defaultNIS2Controls: Omit<NIS2Assessment['riskManagement'][0], 'status' | 'implementationDate' | 'evidenceUrl' | 'notes' | 'lastReviewDate' | 'nextReviewDate'>[] = [
  // Risk analysis and information system security policies
  {
    controlId: 'nis2-01',
    category: 'risk_analysis',
    control: 'Politici de analiză a riscurilor și securitate a sistemelor informatice',
    description: 'Politici documentate pentru analiza riscurilor de securitate cibernetică',
  },
  // Incident handling
  {
    controlId: 'nis2-02',
    category: 'incident_handling',
    control: 'Proceduri de gestionare a incidentelor',
    description: 'Proceduri clare pentru detectarea, raportarea și gestionarea incidentelor de securitate',
  },
  // Business continuity and crisis management
  {
    controlId: 'nis2-03',
    category: 'business_continuity',
    control: 'Continuitate operațională și managementul crizelor',
    description: 'Planuri de continuitate operațională și recuperare în caz de dezastru',
  },
  // Supply chain security
  {
    controlId: 'nis2-04',
    category: 'supply_chain',
    control: 'Securitatea lanțului de aprovizionare',
    description: 'Evaluarea și monitorizarea furnizorilor din perspectivă de securitate',
  },
  // Security in network and information systems acquisition
  {
    controlId: 'nis2-05',
    category: 'security_acquisition',
    control: 'Securitate în achiziția sistemelor',
    description: 'Cerințe de securitate în procesul de achiziție și dezvoltare',
  },
  // Security effectiveness testing
  {
    controlId: 'nis2-06',
    category: 'effectiveness_testing',
    control: 'Testarea eficacității măsurilor de securitate',
    description: 'Teste de securitate, simulări și audit-uri periodice',
  },
  // Cryptography and encryption
  {
    controlId: 'nis2-07',
    category: 'cryptography',
    control: 'Criptografie și criptare',
    description: 'Implementarea criptării pentru date în repaus și în tranzit',
  },
  // Human resources security
  {
    controlId: 'nis2-08',
    category: 'human_resources',
    control: 'Securitatea resurselor umane',
    description: 'Instruire periodică în domeniul securității cibernetice',
  },
  // Access control policies
  {
    controlId: 'nis2-09',
    category: 'access_control',
    control: 'Politici de control al accesului',
    description: 'Control strict al accesului și autentificare multi-factor',
  },
  // Asset management
  {
    controlId: 'nis2-10',
    category: 'asset_management',
    control: 'Managementul activelor',
    description: 'Inventar actualizat al tuturor activelor IT și clasificarea acestora',
  },
];

// ===========================
// MODULE DEFINITION
// ===========================

export const nis2Module: ModuleDefinition = {
  id: 'nis2',
  name: 'NIS2 Cybersecurity',
  description: 'NIS2 Directive compliance: cybersecurity risk assessment, incident reporting (24h/72h), supply chain security, encryption, access control audits, and training tracking',
  version: '1.0.0',
  category: 'compliance',
  dependencies: ['ssm-core', 'gdpr'],
  capabilities: nis2Capabilities,
  hooks: nis2Hooks,
  settings: {
    entityType: {
      type: 'select',
      label: 'Tip entitate NIS2',
      options: ['essential', 'important'],
      required: true,
    },
    sector: {
      type: 'select',
      label: 'Sector',
      options: [
        'energy', 'transport', 'banking', 'financial_market_infrastructure',
        'health', 'drinking_water', 'wastewater', 'digital_infrastructure',
        'ict_service_management', 'public_administration', 'space',
        'postal_courier', 'waste_management', 'chemicals', 'food',
        'manufacturing', 'digital_providers', 'research',
      ],
      required: true,
    },
    csirtEmail: {
      type: 'string',
      label: 'Email CSIRT național',
      defaultValue: 'cert@cert.ro',
      required: true,
    },
    csirtPhone: {
      type: 'string',
      label: 'Telefon CSIRT național',
      defaultValue: '+40 31 805 8963',
      required: false,
    },
    incidentReportingAuthority: {
      type: 'string',
      label: 'Autoritate de raportare incidente',
      defaultValue: 'DNSC - Direcția Națională de Securitate Cibernetică',
      required: true,
    },
    enableAutomaticAlerts: {
      type: 'boolean',
      label: 'Alerte automate pentru deadline-uri raportare',
      defaultValue: true,
      required: false,
    },
    assessmentFrequency: {
      type: 'number',
      label: 'Frecvență evaluare risc (zile)',
      defaultValue: 365,
      required: true,
    },
    vendorReviewFrequency: {
      type: 'number',
      label: 'Frecvență evaluare furnizori (zile)',
      defaultValue: 180,
      required: true,
    },
    accessAuditFrequency: {
      type: 'number',
      label: 'Frecvență audit control acces (zile)',
      defaultValue: 90,
      required: true,
    },
    trainingFrequency: {
      type: 'number',
      label: 'Frecvență instruire securitate (zile)',
      defaultValue: 365,
      required: true,
    },
    mfaRequired: {
      type: 'boolean',
      label: 'MFA obligatoriu pentru toți utilizatorii',
      defaultValue: true,
      required: false,
    },
    encryptionStandard: {
      type: 'string',
      label: 'Standard minim de criptare',
      defaultValue: 'AES-256',
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
 * Get color for risk level
 */
export const getRiskLevelColor = (level: RiskLevel): string => {
  switch (level) {
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
 * Get color for incident severity
 */
export const getIncidentSeverityColor = (severity: IncidentSeverity): string => {
  switch (severity) {
    case 'minor':
      return 'green';
    case 'significant':
      return 'yellow';
    case 'major':
      return 'orange';
    case 'critical':
      return 'red';
    default:
      return 'gray';
  }
};

/**
 * Get color for control status
 */
export const getControlStatusColor = (status: ControlStatus): string => {
  switch (status) {
    case 'not_implemented':
      return 'red';
    case 'partial':
      return 'yellow';
    case 'implemented':
      return 'blue';
    case 'verified':
      return 'green';
    default:
      return 'gray';
  }
};

/**
 * Get label for incident status
 */
export const getIncidentStatusLabel = (status: IncidentStatus): string => {
  const labels: Record<IncidentStatus, string> = {
    detected: 'Detectat',
    initial_assessment: 'Evaluare inițială',
    early_warning_sent: 'Avertizare precoce trimisă (24h)',
    under_investigation: 'În curs de investigare',
    notification_sent: 'Notificare trimisă (72h)',
    contained: 'Incident izolat',
    remediated: 'Remediat',
    final_report_submitted: 'Raport final trimis',
    closed: 'Închis',
  };
  return labels[status] || status;
};

/**
 * Get label for NIS2 sector
 */
export const getNIS2SectorLabel = (sector: NIS2Sector): string => {
  const labels: Record<NIS2Sector, string> = {
    energy: 'Energie',
    transport: 'Transport',
    banking: 'Bancar',
    financial_market_infrastructure: 'Infrastructură piețe financiare',
    health: 'Sănătate',
    drinking_water: 'Apă potabilă',
    wastewater: 'Apă uzată',
    digital_infrastructure: 'Infrastructură digitală',
    ict_service_management: 'Servicii ICT',
    public_administration: 'Administrație publică',
    space: 'Spațiu',
    postal_courier: 'Poștă și curierat',
    waste_management: 'Gestionare deșeuri',
    chemicals: 'Chimice',
    food: 'Alimentar',
    manufacturing: 'Producție',
    digital_providers: 'Furnizori servicii digitale',
    research: 'Cercetare',
  };
  return labels[sector] || sector;
};

/**
 * Check if incident reporting deadline is approaching
 */
export const isDeadlineApproaching = (deadline: Date, hoursThreshold: number = 6): boolean => {
  const now = new Date();
  const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursRemaining > 0 && hoursRemaining <= hoursThreshold;
};

/**
 * Check if incident reporting deadline is overdue
 */
export const isDeadlineOverdue = (deadline: Date): boolean => {
  return new Date() > deadline;
};

export default nis2Module;
