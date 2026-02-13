/**
 * types/ssm.ts
 * TypeScript types for SSM (Occupational Health & Safety) domain
 * Covers: trainings, medical exams, equipment, risk assessments, incidents,
 * obligations, penalties, legal acts, compliance scoring, and alerts
 */

import { CountryCode, Currency, AlertSeverity as BaseSeverity } from '@/lib/types'

// ============================================================================
// TRAINING TYPES
// ============================================================================

/**
 * Type of safety training
 */
export type TrainingType =
  | 'initial' // Initial training for new employees
  | 'periodic' // Periodic refresher training
  | 'change_of_job' // Training when job role changes
  | 'new_equipment' // Training for new equipment/machinery
  | 'new_technology' // Training for new technology/process
  | 'post_incident' // Training after incident/accident
  | 'fire_safety' // Fire safety specific training
  | 'first_aid' // First aid training
  | 'evacuation' // Evacuation procedures
  | 'hazmat' // Hazardous materials handling
  | 'work_at_height' // Work at height training
  | 'confined_space' // Confined space entry
  | 'electrical_safety' // Electrical safety
  | 'manual_handling' // Manual handling of loads
  | 'custom' // Custom training type

/**
 * Training record for an employee
 */
export interface TrainingRecord {
  id: string
  organization_id: string
  employee_id?: string
  employee_name: string
  employee_cnp_hash?: string | null
  job_title?: string | null
  training_type: TrainingType
  training_title: string
  training_description?: string | null
  trainer_name?: string | null
  trainer_certification?: string | null
  training_date: string
  expiry_date?: string | null
  duration_hours?: number | null
  location?: string | null
  attendance_confirmed: boolean
  certificate_number?: string | null
  certificate_url?: string | null
  score?: number | null // Evaluation score
  passed: boolean
  notes?: string | null
  legal_reference?: string | null
  content_version: number
  legal_basis_version: string
  created_at: string
  updated_at: string
}

// ============================================================================
// MEDICAL EXAMINATION TYPES
// ============================================================================

/**
 * Type of medical examination
 */
export type MedicalExamType =
  | 'periodic' // Regular periodic exam
  | 'angajare' // Pre-employment exam
  | 'reluare' // Return to work exam
  | 'la_cerere' // On-request exam
  | 'supraveghere' // Medical surveillance

/**
 * Medical examination result
 */
export type MedicalExamResult =
  | 'apt' // Fit for work
  | 'apt_conditionat' // Fit with restrictions
  | 'inapt_temporar' // Temporarily unfit
  | 'inapt' // Permanently unfit

/**
 * Medical examination record (extends existing MedicalExamination)
 */
export interface MedicalExam {
  id: string
  organization_id: string
  employee_id?: string
  employee_name: string
  cnp_hash?: string | null
  job_title?: string | null
  examination_type: MedicalExamType
  examination_date: string
  expiry_date: string
  result: MedicalExamResult
  restrictions?: string | null
  recommendations?: string | null
  doctor_name?: string | null
  doctor_license?: string | null
  clinic_name?: string | null
  clinic_address?: string | null
  certificate_number?: string | null
  notes?: string | null
  content_version: number
  legal_basis_version: string
  created_at: string
  updated_at: string
}

// ============================================================================
// EQUIPMENT TYPES
// ============================================================================

/**
 * Safety equipment type
 */
export type EquipmentType =
  | 'stingator' // Fire extinguisher
  | 'trusa_prim_ajutor' // First aid kit
  | 'hidrant' // Fire hydrant
  | 'detector_fum' // Smoke detector
  | 'detector_gaz' // Gas detector
  | 'iluminat_urgenta' // Emergency lighting
  | 'panou_semnalizare' // Warning/safety sign
  | 'trusa_scule' // Tool kit
  | 'eip' // PPE (Personal Protective Equipment)
  | 'echipament_presiune' // Pressure equipment
  | 'echipament_ridicare' // Lifting equipment
  | 'scara_mobila' // Mobile ladder
  | 'schela' // Scaffolding
  | 'altul' // Other

/**
 * Equipment inspection status
 */
export type EquipmentStatus =
  | 'compliant' // In compliance
  | 'needs_inspection' // Inspection due
  | 'needs_maintenance' // Maintenance required
  | 'non_compliant' // Not in compliance
  | 'expired' // Expired certification
  | 'out_of_service' // Out of service

/**
 * Safety equipment record (extends existing SafetyEquipment)
 */
export interface Equipment {
  id: string
  organization_id: string
  equipment_type: EquipmentType
  equipment_name: string
  description?: string | null
  location: string
  building?: string | null
  floor?: string | null
  room?: string | null
  serial_number?: string | null
  manufacturer?: string | null
  model?: string | null
  manufacture_date?: string | null
  installation_date?: string | null
  last_inspection_date?: string | null
  next_inspection_date?: string | null
  expiry_date?: string | null
  inspector_name?: string | null
  inspector_certification?: string | null
  inspection_company?: string | null
  is_compliant: boolean
  status: EquipmentStatus
  capacity?: string | null // e.g., "6kg" for extinguisher
  quantity?: number | null
  barcode?: string | null
  qr_code?: string | null
  notes?: string | null
  content_version: number
  legal_basis_version: string
  created_at: string
  updated_at: string
}

// ============================================================================
// RISK ASSESSMENT TYPES
// ============================================================================

/**
 * Risk level/severity
 */
export type RiskLevel =
  | 'trivial' // Trivial risk
  | 'low' // Low risk
  | 'medium' // Medium risk
  | 'high' // High risk
  | 'very_high' // Very high risk

/**
 * Risk assessment status
 */
export type RiskAssessmentStatus =
  | 'draft' // Draft
  | 'under_review' // Under review
  | 'approved' // Approved
  | 'implemented' // Control measures implemented
  | 'expired' // Needs update

/**
 * Risk assessment record
 */
export interface RiskAssessment {
  id: string
  organization_id: string
  assessment_code: string
  workplace_area: string
  job_role?: string | null
  process_activity: string
  hazard_description: string
  hazard_category?: string | null
  persons_at_risk?: string | null // e.g., "operators, maintenance staff"
  probability_score: number // 1-5
  severity_score: number // 1-5
  risk_score: number // probability × severity
  risk_level: RiskLevel
  existing_controls?: string | null
  residual_risk_score?: number | null
  residual_risk_level?: RiskLevel | null
  control_measures: string
  responsible_person?: string | null
  implementation_deadline?: string | null
  implementation_status?: 'pending' | 'in_progress' | 'completed' | null
  assessment_date: string
  review_date: string
  assessor_name: string
  assessor_role?: string | null
  approved_by?: string | null
  approved_at?: string | null
  status: RiskAssessmentStatus
  notes?: string | null
  legal_reference?: string | null
  created_at: string
  updated_at: string
}

// ============================================================================
// INCIDENT & NEAR MISS TYPES
// ============================================================================

/**
 * Incident severity
 */
export type IncidentSeverity =
  | 'fatal' // Fatal
  | 'major' // Major injury
  | 'serious' // Serious injury
  | 'minor' // Minor injury
  | 'first_aid' // First aid only
  | 'property_damage' // Property damage only
  | 'environmental' // Environmental incident

/**
 * Incident type
 */
export type IncidentType =
  | 'accident' // Work accident
  | 'occupational_disease' // Occupational disease
  | 'fire' // Fire
  | 'explosion' // Explosion
  | 'chemical_spill' // Chemical spill
  | 'electrical' // Electrical incident
  | 'fall' // Fall from height
  | 'struck_by' // Struck by object
  | 'caught_in' // Caught in/between
  | 'exposure' // Exposure to hazard
  | 'other' // Other

/**
 * Incident status
 */
export type IncidentStatus =
  | 'reported' // Reported
  | 'under_investigation' // Under investigation
  | 'investigated' // Investigation completed
  | 'closed' // Closed
  | 'pending_authority' // Pending authority report

/**
 * Incident/accident record
 */
export interface Incident {
  id: string
  organization_id: string
  incident_number: string
  incident_type: IncidentType
  severity: IncidentSeverity
  incident_date: string
  incident_time?: string | null
  location: string
  location_details?: string | null
  description: string
  injured_person_name?: string | null
  injured_person_cnp_hash?: string | null
  injured_person_job_title?: string | null
  witness_names?: string[] | null
  immediate_cause?: string | null
  root_cause?: string | null
  contributing_factors?: string[] | null
  corrective_actions: string
  preventive_actions?: string | null
  responsible_for_actions?: string | null
  action_deadline?: string | null
  action_completed_at?: string | null
  reported_by: string
  reported_by_role?: string | null
  reported_at: string
  investigated_by?: string | null
  investigation_completed_at?: string | null
  status: IncidentStatus
  work_days_lost?: number | null
  authority_notified: boolean
  authority_name?: string | null
  authority_notification_date?: string | null
  authority_reference?: string | null
  insurance_notified: boolean
  insurance_claim_number?: string | null
  notes?: string | null
  attachments?: string[] | null
  created_at: string
  updated_at: string
}

/**
 * Near miss event
 */
export interface NearMiss {
  id: string
  organization_id: string
  near_miss_number: string
  event_date: string
  event_time?: string | null
  location: string
  location_details?: string | null
  description: string
  potential_severity: IncidentSeverity
  potential_consequence?: string | null
  immediate_action_taken?: string | null
  corrective_actions?: string | null
  preventive_actions?: string | null
  responsible_for_actions?: string | null
  action_deadline?: string | null
  action_completed_at?: string | null
  reported_by: string
  reported_by_role?: string | null
  reported_at: string
  reviewed_by?: string | null
  reviewed_at?: string | null
  status: 'reported' | 'reviewed' | 'actions_taken' | 'closed'
  notes?: string | null
  created_at: string
  updated_at: string
}

// ============================================================================
// OBLIGATION & COMPLIANCE TYPES
// ============================================================================

/**
 * Obligation frequency
 */
export type ObligationFrequency =
  | 'annual' // Annual
  | 'biannual' // Twice per year
  | 'quarterly' // Quarterly
  | 'monthly' // Monthly
  | 'weekly' // Weekly
  | 'on_demand' // On demand
  | 'once' // One-time
  | 'continuous' // Continuous

/**
 * Obligation status
 */
export type ObligationStatus =
  | 'compliant' // In compliance
  | 'pending' // Pending action
  | 'overdue' // Overdue
  | 'not_applicable' // Not applicable
  | 'in_progress' // In progress

/**
 * SSM/PSI legal obligation
 */
export interface Obligation {
  id: string
  organization_id?: string | null // null for master obligations
  country_code: CountryCode
  obligation_category: 'ssm' | 'psi' | 'medical' | 'training' | 'equipment' | 'documentation' | 'reporting' | 'other'
  obligation_name: string
  obligation_description: string
  legal_reference: string
  authority_name: string
  frequency: ObligationFrequency
  due_date?: string | null
  last_completed_date?: string | null
  next_due_date?: string | null
  responsible_person?: string | null
  status: ObligationStatus
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimated_cost?: number | null
  currency?: Currency | null
  penalty_min?: number | null
  penalty_max?: number | null
  reminder_days_before?: number | null
  is_active: boolean
  is_system: boolean // System-defined vs custom
  notes?: string | null
  created_at: string
  updated_at: string
}

// ============================================================================
// PENALTY TYPES
// ============================================================================

/**
 * Penalty/sanction type
 */
export type PenaltyType =
  | 'fine' // Fine
  | 'warning' // Written warning
  | 'suspension' // Activity suspension
  | 'closure' // Temporary closure
  | 'criminal' // Criminal prosecution

/**
 * Penalty status
 */
export type PenaltyStatus =
  | 'pending' // Pending
  | 'paid' // Paid
  | 'appealed' // Under appeal
  | 'cancelled' // Cancelled
  | 'reduced' // Reduced amount

/**
 * Penalty/sanction record
 */
export interface Penalty {
  id: string
  organization_id: string
  penalty_type: PenaltyType
  authority_name: string
  authority_representative?: string | null
  inspection_date?: string | null
  penalty_date: string
  penalty_number?: string | null
  violation_description: string
  legal_reference: string
  article_violated?: string | null
  penalty_amount?: number | null
  currency?: Currency | null
  payment_deadline?: string | null
  paid_amount?: number | null
  paid_date?: string | null
  status: PenaltyStatus
  appeal_date?: string | null
  appeal_outcome?: string | null
  corrective_action_required?: string | null
  corrective_action_deadline?: string | null
  corrective_action_completed_at?: string | null
  responsible_person?: string | null
  notes?: string | null
  document_url?: string | null
  created_at: string
  updated_at: string
}

// ============================================================================
// LEGAL ACT TYPES
// ============================================================================

/**
 * Legal act type
 */
export type LegalActType =
  | 'law' // Law (Lege)
  | 'emergency_ordinance' // Emergency ordinance (OUG)
  | 'government_decision' // Government decision (HG)
  | 'ministerial_order' // Ministerial order (Ordin)
  | 'norm' // Technical norm (Normă)
  | 'directive' // EU directive
  | 'regulation' // EU regulation
  | 'standard' // Standard (SR, ISO, EN)
  | 'guide' // Technical guide
  | 'other' // Other

/**
 * Legal act status
 */
export type LegalActStatus =
  | 'in_force' // In force
  | 'amended' // Amended
  | 'repealed' // Repealed
  | 'draft' // Draft

/**
 * Legal act record
 */
export interface LegalAct {
  id: string
  country_code: CountryCode
  act_type: LegalActType
  act_number: string
  act_year: number
  act_title: string
  act_description?: string | null
  issuing_authority: string
  publication_date?: string | null
  effective_date?: string | null
  status: LegalActStatus
  scope: 'ssm' | 'psi' | 'both' | 'general'
  official_url?: string | null
  pdf_url?: string | null
  full_text?: string | null
  summary?: string | null
  key_obligations?: string[] | null
  related_acts?: string[] | null // IDs of related legal acts
  amendments?: string[] | null
  repeals?: string[] | null
  is_system: boolean
  created_at: string
  updated_at: string
}

// ============================================================================
// COMPLIANCE SCORE TYPES
// ============================================================================

/**
 * Compliance score level
 */
export type ComplianceLevel =
  | 'excellent' // 90-100%
  | 'good' // 75-89%
  | 'acceptable' // 60-74%
  | 'poor' // 40-59%
  | 'critical' // 0-39%

/**
 * Compliance category
 */
export type ComplianceCategory =
  | 'overall' // Overall compliance
  | 'medical' // Medical examinations
  | 'training' // Safety training
  | 'equipment' // Safety equipment
  | 'documentation' // Documentation
  | 'incidents' // Incident management
  | 'risk_assessment' // Risk assessments
  | 'obligations' // Legal obligations

/**
 * Compliance score record
 */
export interface ComplianceScore {
  id: string
  organization_id: string
  score_date: string
  category: ComplianceCategory
  score: number // 0-100
  level: ComplianceLevel
  total_items: number
  compliant_items: number
  non_compliant_items: number
  pending_items: number
  overdue_items: number
  details?: {
    category: string
    score: number
    items: number
  }[] | null
  recommendations?: string[] | null
  critical_issues?: string[] | null
  calculated_by?: string | null
  calculation_method?: string | null
  notes?: string | null
  created_at: string
}

// ============================================================================
// ALERT TYPES
// ============================================================================

/**
 * Alert severity (re-export from base types for completeness)
 */
export type AlertSeverity = BaseSeverity

/**
 * Alert type
 */
export type AlertType =
  | 'medical_expiring' // Medical exam expiring
  | 'medical_expired' // Medical exam expired
  | 'training_expiring' // Training expiring
  | 'training_expired' // Training expired
  | 'equipment_inspection_due' // Equipment inspection due
  | 'equipment_expired' // Equipment certification expired
  | 'obligation_due' // Obligation due
  | 'obligation_overdue' // Obligation overdue
  | 'incident_reported' // New incident reported
  | 'penalty_issued' // Penalty issued
  | 'compliance_low' // Low compliance score
  | 'document_missing' // Required document missing
  | 'risk_high' // High risk identified
  | 'custom' // Custom alert

/**
 * Alert status
 */
export type AlertStatus =
  | 'active' // Active
  | 'acknowledged' // Acknowledged
  | 'resolved' // Resolved
  | 'dismissed' // Dismissed
  | 'snoozed' // Snoozed

/**
 * Alert record
 */
export interface Alert {
  id: string
  organization_id: string
  alert_type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  description?: string | null
  related_entity_type?: 'medical' | 'training' | 'equipment' | 'obligation' | 'incident' | 'penalty' | null
  related_entity_id?: string | null
  due_date?: string | null
  days_until_due?: number | null
  action_required?: string | null
  action_url?: string | null
  assigned_to?: string | null
  status: AlertStatus
  acknowledged_at?: string | null
  acknowledged_by?: string | null
  resolved_at?: string | null
  resolved_by?: string | null
  resolution_notes?: string | null
  snoozed_until?: string | null
  notification_sent: boolean
  notification_sent_at?: string | null
  notification_channels?: ('email' | 'sms' | 'whatsapp' | 'push')[] | null
  created_at: string
  updated_at: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get compliance level from score
 */
export function getComplianceLevel(score: number): ComplianceLevel {
  if (score >= 90) return 'excellent'
  if (score >= 75) return 'good'
  if (score >= 60) return 'acceptable'
  if (score >= 40) return 'poor'
  return 'critical'
}

/**
 * Get risk level from risk score
 */
export function getRiskLevel(riskScore: number): RiskLevel {
  if (riskScore >= 20) return 'very_high'
  if (riskScore >= 15) return 'high'
  if (riskScore >= 10) return 'medium'
  if (riskScore >= 5) return 'low'
  return 'trivial'
}

/**
 * Calculate risk score from probability and severity
 */
export function calculateRiskScore(probability: number, severity: number): number {
  return probability * severity
}

/**
 * Check if a record is expiring soon (within days threshold)
 */
export function isExpiringSoon(expiryDate: string, daysThreshold: number = 30): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  const daysUntil = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return daysUntil > 0 && daysUntil <= daysThreshold
}

/**
 * Check if a record is expired
 */
export function isExpired(expiryDate: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  return expiry < today
}

/**
 * Get days until expiry (negative if expired)
 */
export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Get alert severity based on days until due
 */
export function getAlertSeverityFromDays(daysUntil: number): AlertSeverity {
  if (daysUntil < 0) return 'expired'
  if (daysUntil <= 7) return 'critical'
  if (daysUntil <= 15) return 'warning'
  return 'info'
}
