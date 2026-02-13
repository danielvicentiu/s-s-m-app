/**
 * ISO 45001:2018 Occupational Health and Safety Management System
 * Comprehensive Checklist - Clauses 4-10
 */

export type ConformityLevel = 'full' | 'partial' | 'non_conformity' | 'not_applicable';

export interface ISO45001Requirement {
  id: string;
  clause: string;
  requirement: string;
  evidenceNeeded: string[];
  auditQuestion: string;
  conformityLevel?: ConformityLevel;
  notes?: string;
}

export const iso45001Checklist: ISO45001Requirement[] = [
  // Clause 4: Context of the Organization
  {
    id: 'iso45001-4.1',
    clause: '4.1',
    requirement: 'Understanding the organization and its context',
    evidenceNeeded: [
      'Documentation of internal and external issues',
      'Risk assessment related to organizational context',
      'SWOT analysis or similar strategic documentation'
    ],
    auditQuestion: 'Has the organization determined external and internal issues relevant to its purpose and that affect its ability to achieve the intended outcomes of its OH&S management system?'
  },
  {
    id: 'iso45001-4.2',
    clause: '4.2',
    requirement: 'Understanding the needs and expectations of workers and other interested parties',
    evidenceNeeded: [
      'List of interested parties',
      'Documentation of their needs and expectations',
      'Evidence of consultation with workers'
    ],
    auditQuestion: 'Has the organization identified the interested parties relevant to the OH&S management system and their requirements?'
  },
  {
    id: 'iso45001-4.3',
    clause: '4.3',
    requirement: 'Determining the scope of the OH&S management system',
    evidenceNeeded: [
      'Documented scope statement',
      'Consideration of clause 4.1 and 4.2 issues',
      'List of activities, products and services covered'
    ],
    auditQuestion: 'Has the organization defined and documented the boundaries and applicability of the OH&S management system?'
  },
  {
    id: 'iso45001-4.4',
    clause: '4.4',
    requirement: 'OH&S management system and its processes',
    evidenceNeeded: [
      'Process map or flowchart',
      'Documented processes and their interactions',
      'Process performance indicators'
    ],
    auditQuestion: 'Has the organization established, implemented, maintained and continually improved an OH&S management system including the needed processes and their interactions?'
  },

  // Clause 5: Leadership and Worker Participation
  {
    id: 'iso45001-5.1',
    clause: '5.1',
    requirement: 'Leadership and commitment',
    evidenceNeeded: [
      'Management meeting minutes',
      'Resource allocation records',
      'Communication from top management on OH&S'
    ],
    auditQuestion: 'Does top management demonstrate leadership and commitment to the OH&S management system?'
  },
  {
    id: 'iso45001-5.2',
    clause: '5.2',
    requirement: 'OH&S policy',
    evidenceNeeded: [
      'Documented OH&S policy',
      'Evidence of communication to all workers',
      'Policy review records'
    ],
    auditQuestion: 'Has top management established, implemented and maintained an OH&S policy that is appropriate to the organization?'
  },
  {
    id: 'iso45001-5.3',
    clause: '5.3',
    requirement: 'Organizational roles, responsibilities and authorities',
    evidenceNeeded: [
      'Job descriptions with OH&S responsibilities',
      'Organizational chart',
      'Delegation of authority documentation'
    ],
    auditQuestion: 'Has top management assigned and communicated responsibilities and authorities for relevant roles within the OH&S management system?'
  },
  {
    id: 'iso45001-5.4',
    clause: '5.4',
    requirement: 'Consultation and participation of workers',
    evidenceNeeded: [
      'Records of worker consultation',
      'Safety committee meeting minutes',
      'Evidence of worker involvement in hazard identification'
    ],
    auditQuestion: 'Has the organization established processes for consultation and participation of workers at all applicable levels and functions?'
  },

  // Clause 6: Planning
  {
    id: 'iso45001-6.1.1',
    clause: '6.1.1',
    requirement: 'General - Actions to address risks and opportunities',
    evidenceNeeded: [
      'Risk and opportunity register',
      'Action plans to address risks',
      'Integration into OH&S processes'
    ],
    auditQuestion: 'Has the organization established processes to identify and assess risks and opportunities relevant to the OH&S management system?'
  },
  {
    id: 'iso45001-6.1.2',
    clause: '6.1.2',
    requirement: 'Hazard identification and assessment of risks and opportunities',
    evidenceNeeded: [
      'Hazard identification methodology',
      'Hazard register',
      'Risk assessment documentation',
      'Records of worker participation'
    ],
    auditQuestion: 'Does the organization have a systematic process for ongoing hazard identification that considers routine and non-routine activities?'
  },
  {
    id: 'iso45001-6.1.3',
    clause: '6.1.3',
    requirement: 'Determination of legal requirements and other requirements',
    evidenceNeeded: [
      'Legal register',
      'Procedure for updating legal requirements',
      'Evidence of compliance monitoring'
    ],
    auditQuestion: 'Has the organization established a process to identify and have access to applicable legal and other OH&S requirements?'
  },
  {
    id: 'iso45001-6.1.4',
    clause: '6.1.4',
    requirement: 'Planning action',
    evidenceNeeded: [
      'Action plans to address risks and opportunities',
      'Integration plan into business processes',
      'Effectiveness evaluation records'
    ],
    auditQuestion: 'Has the organization planned actions to address risks and opportunities, legal requirements, and prepared for emergencies?'
  },
  {
    id: 'iso45001-6.2.1',
    clause: '6.2.1',
    requirement: 'OH&S objectives',
    evidenceNeeded: [
      'Documented OH&S objectives',
      'Alignment with policy',
      'Measurable indicators'
    ],
    auditQuestion: 'Has the organization established OH&S objectives at relevant functions and levels that are consistent with the OH&S policy?'
  },
  {
    id: 'iso45001-6.2.2',
    clause: '6.2.2',
    requirement: 'Planning to achieve OH&S objectives',
    evidenceNeeded: [
      'Action plans for each objective',
      'Resource allocation',
      'Timelines and responsible persons',
      'Monitoring and review records'
    ],
    auditQuestion: 'Has the organization planned how to achieve its OH&S objectives including what will be done, resources needed, responsibilities, and evaluation of results?'
  },

  // Clause 7: Support
  {
    id: 'iso45001-7.1',
    clause: '7.1',
    requirement: 'Resources',
    evidenceNeeded: [
      'Budget allocation for OH&S',
      'Resource availability records',
      'Infrastructure and equipment lists'
    ],
    auditQuestion: 'Has the organization determined and provided the resources needed for the establishment, implementation, maintenance and continual improvement of the OH&S management system?'
  },
  {
    id: 'iso45001-7.2',
    clause: '7.2',
    requirement: 'Competence',
    evidenceNeeded: [
      'Competency requirements for each role',
      'Training records',
      'Qualifications and certifications',
      'Competency evaluation records'
    ],
    auditQuestion: 'Has the organization determined necessary competence of workers affecting OH&S performance and ensured they are competent based on education, training or experience?'
  },
  {
    id: 'iso45001-7.3',
    clause: '7.3',
    requirement: 'Awareness',
    evidenceNeeded: [
      'Evidence of awareness training',
      'Communication records on OH&S policy and objectives',
      'Worker feedback on awareness'
    ],
    auditQuestion: 'Are workers aware of the OH&S policy, their contribution to the effectiveness of the system, and the implications of not conforming with requirements?'
  },
  {
    id: 'iso45001-7.4',
    clause: '7.4',
    requirement: 'Communication',
    evidenceNeeded: [
      'Communication procedure',
      'Records of internal and external communications',
      'Evidence of responses to relevant communications'
    ],
    auditQuestion: 'Has the organization established processes for internal and external communications relevant to the OH&S management system?'
  },
  {
    id: 'iso45001-7.5.1',
    clause: '7.5.1',
    requirement: 'Documented information - General',
    evidenceNeeded: [
      'List of documented information',
      'Document control procedure',
      'Version control records'
    ],
    auditQuestion: 'Does the OH&S management system include documented information required by ISO 45001 and determined necessary for effectiveness?'
  },
  {
    id: 'iso45001-7.5.2',
    clause: '7.5.2',
    requirement: 'Creating and updating documented information',
    evidenceNeeded: [
      'Document templates',
      'Review and approval records',
      'Update procedures'
    ],
    auditQuestion: 'When creating and updating documented information, does the organization ensure appropriate identification, format, and review?'
  },
  {
    id: 'iso45001-7.5.3',
    clause: '7.5.3',
    requirement: 'Control of documented information',
    evidenceNeeded: [
      'Document control procedure',
      'Access control records',
      'Distribution and retrieval records'
    ],
    auditQuestion: 'Is documented information controlled to ensure it is available, suitable for use, and adequately protected?'
  },

  // Clause 8: Operation
  {
    id: 'iso45001-8.1.1',
    clause: '8.1.1',
    requirement: 'Operational planning and control - General',
    evidenceNeeded: [
      'Operational procedures',
      'Process controls documentation',
      'Criteria for operations'
    ],
    auditQuestion: 'Has the organization planned, implemented and controlled processes needed to meet OH&S requirements and implement actions determined in clause 6?'
  },
  {
    id: 'iso45001-8.1.2',
    clause: '8.1.2',
    requirement: 'Eliminating hazards and reducing OH&S risks',
    evidenceNeeded: [
      'Hierarchy of controls implementation evidence',
      'Hazard elimination records',
      'Substitution analysis',
      'Engineering controls documentation'
    ],
    auditQuestion: 'Has the organization established processes for hazard elimination and risk reduction using the hierarchy of controls?'
  },
  {
    id: 'iso45001-8.1.3',
    clause: '8.1.3',
    requirement: 'Management of change',
    evidenceNeeded: [
      'Change management procedure',
      'Risk assessments for changes',
      'Records of implemented changes'
    ],
    auditQuestion: 'Has the organization established a process for implementing and controlling planned temporary and permanent changes that impact OH&S performance?'
  },
  {
    id: 'iso45001-8.1.4',
    clause: '8.1.4',
    requirement: 'Procurement',
    evidenceNeeded: [
      'Procurement procedure including OH&S criteria',
      'Supplier evaluation records',
      'Purchase specifications with OH&S requirements'
    ],
    auditQuestion: 'Has the organization established processes to control procurement of products and services to ensure conformity with the OH&S management system?'
  },
  {
    id: 'iso45001-8.1.4.2',
    clause: '8.1.4.2',
    requirement: 'Contractors',
    evidenceNeeded: [
      'Contractor selection criteria',
      'Contractor OH&S requirements',
      'Contractor performance monitoring',
      'Coordination records'
    ],
    auditQuestion: 'Has the organization established processes to ensure contractors and their workers comply with the OH&S management system requirements?'
  },
  {
    id: 'iso45001-8.1.4.3',
    clause: '8.1.4.3',
    requirement: 'Outsourcing',
    evidenceNeeded: [
      'Outsourcing agreements with OH&S requirements',
      'Control procedures for outsourced processes',
      'Performance monitoring records'
    ],
    auditQuestion: 'Does the organization ensure that outsourced functions and processes are controlled and align with legal requirements and OH&S objectives?'
  },
  {
    id: 'iso45001-8.2',
    clause: '8.2',
    requirement: 'Emergency preparedness and response',
    evidenceNeeded: [
      'Emergency response procedures',
      'Emergency drill records',
      'Emergency equipment maintenance records',
      'Post-drill evaluation reports'
    ],
    auditQuestion: 'Has the organization established processes to prepare for and respond to potential emergency situations including drills and testing?'
  },

  // Clause 9: Performance Evaluation
  {
    id: 'iso45001-9.1.1',
    clause: '9.1.1',
    requirement: 'Monitoring, measurement, analysis and performance evaluation - General',
    evidenceNeeded: [
      'Monitoring and measurement plan',
      'Performance indicators',
      'Analysis reports',
      'Calibration records for equipment'
    ],
    auditQuestion: 'Has the organization established processes to monitor, measure, analyze and evaluate OH&S performance?'
  },
  {
    id: 'iso45001-9.1.2',
    clause: '9.1.2',
    requirement: 'Evaluation of compliance',
    evidenceNeeded: [
      'Compliance evaluation procedure',
      'Compliance audit records',
      'Legal register with compliance status',
      'Corrective actions for non-compliances'
    ],
    auditQuestion: 'Has the organization established a process to evaluate compliance with legal and other requirements at planned intervals?'
  },
  {
    id: 'iso45001-9.2.1',
    clause: '9.2.1',
    requirement: 'Internal audit - General',
    evidenceNeeded: [
      'Audit program',
      'Audit schedule',
      'Auditor competency records',
      'Audit reports'
    ],
    auditQuestion: 'Does the organization conduct internal audits at planned intervals to provide information on whether the OH&S management system conforms to requirements?'
  },
  {
    id: 'iso45001-9.2.2',
    clause: '9.2.2',
    requirement: 'Internal audit programme',
    evidenceNeeded: [
      'Annual audit plan',
      'Audit criteria and scope',
      'Audit frequency justification',
      'Previous audit results consideration'
    ],
    auditQuestion: 'Has the organization planned, established, implemented and maintained an audit programme including frequency, methods, responsibilities, and reporting?'
  },
  {
    id: 'iso45001-9.3',
    clause: '9.3',
    requirement: 'Management review',
    evidenceNeeded: [
      'Management review meeting minutes',
      'Input data for review',
      'Decisions and action items',
      'Review schedule'
    ],
    auditQuestion: 'Does top management review the OH&S management system at planned intervals to ensure its continuing suitability, adequacy and effectiveness?'
  },

  // Clause 10: Improvement
  {
    id: 'iso45001-10.1',
    clause: '10.1',
    requirement: 'General - Continual improvement',
    evidenceNeeded: [
      'Improvement initiatives',
      'Trend analysis',
      'Effectiveness of improvements',
      'Worker participation in improvements'
    ],
    auditQuestion: 'Has the organization determined opportunities for improvement and implemented necessary actions to achieve intended outcomes of the OH&S management system?'
  },
  {
    id: 'iso45001-10.2',
    clause: '10.2',
    requirement: 'Incident, nonconformity and corrective action',
    evidenceNeeded: [
      'Incident investigation reports',
      'Nonconformity records',
      'Root cause analysis',
      'Corrective action plans',
      'Effectiveness verification'
    ],
    auditQuestion: 'Has the organization established a process to manage incidents and nonconformities including reaction, investigation, root cause analysis, and corrective actions?'
  },
  {
    id: 'iso45001-10.3',
    clause: '10.3',
    requirement: 'Continual improvement of the OH&S management system',
    evidenceNeeded: [
      'Evidence of system improvements',
      'Performance trend analysis',
      'Achievement of OH&S objectives',
      'Audit results and actions taken'
    ],
    auditQuestion: 'Does the organization continually improve the suitability, adequacy and effectiveness of the OH&S management system to enhance OH&S performance?'
  },

  // Additional Critical Requirements
  {
    id: 'iso45001-5.4.1',
    clause: '5.4',
    requirement: 'Worker consultation in hazard identification and risk assessment',
    evidenceNeeded: [
      'Records of worker involvement in hazard ID',
      'Worker feedback mechanisms',
      'Safety suggestion system records'
    ],
    auditQuestion: 'Are workers consulted in the development, planning, implementation and evaluation of the OH&S management system?'
  },
  {
    id: 'iso45001-8.1.5',
    clause: '8.1',
    requirement: 'OH&S management system integration with business processes',
    evidenceNeeded: [
      'Integration plan',
      'Process maps showing OH&S integration',
      'Evidence of OH&S in business decisions'
    ],
    auditQuestion: 'Has the organization integrated OH&S management system requirements into its overall business processes?'
  },
  {
    id: 'iso45001-9.1.3',
    clause: '9.1',
    requirement: 'OH&S performance indicators and targets',
    evidenceNeeded: [
      'KPI dashboard',
      'Leading and lagging indicators',
      'Performance trend reports',
      'Target achievement records'
    ],
    auditQuestion: 'Has the organization established, monitored and reviewed OH&S performance indicators aligned with objectives and targets?'
  },
  {
    id: 'iso45001-6.1.2.3',
    clause: '6.1.2.3',
    requirement: 'Assessment of OH&S opportunities',
    evidenceNeeded: [
      'Opportunity register',
      'OH&S opportunity evaluation',
      'Implementation of improvement opportunities'
    ],
    auditQuestion: 'Has the organization assessed OH&S opportunities to improve OH&S performance, taking into account planned changes and opportunities for improvement?'
  }
];

/**
 * Get requirements by clause number
 */
export function getRequirementsByClause(clause: string): ISO45001Requirement[] {
  return iso45001Checklist.filter(req => req.clause.startsWith(clause));
}

/**
 * Get requirements by conformity level
 */
export function getRequirementsByConformity(level: ConformityLevel): ISO45001Requirement[] {
  return iso45001Checklist.filter(req => req.conformityLevel === level);
}

/**
 * Get clause summary
 */
export function getClauseSummary() {
  return {
    '4': 'Context of the Organization',
    '5': 'Leadership and Worker Participation',
    '6': 'Planning',
    '7': 'Support',
    '8': 'Operation',
    '9': 'Performance Evaluation',
    '10': 'Improvement'
  };
}

/**
 * Calculate checklist completion percentage
 */
export function calculateCompletionRate(requirements: ISO45001Requirement[]): number {
  const completed = requirements.filter(
    req => req.conformityLevel === 'full' || req.conformityLevel === 'not_applicable'
  ).length;
  return requirements.length > 0 ? Math.round((completed / requirements.length) * 100) : 0;
}

/**
 * Export checklist for audit reporting
 */
export function exportChecklistData() {
  return {
    standard: 'ISO 45001:2018',
    totalRequirements: iso45001Checklist.length,
    clauses: getClauseSummary(),
    requirements: iso45001Checklist
  };
}
