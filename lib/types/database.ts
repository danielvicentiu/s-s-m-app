// S-S-M.RO — DATABASE TYPES
// Complete TypeScript types for all Supabase tables
// Generated: 14 February 2026
// Includes: Row, Insert, Update types for all tables + Database interface

// ══════════════════════════════════════════════════════════════
// ENUMS
// ══════════════════════════════════════════════════════════════

export type RoleType = 'consultant' | 'firma_admin' | 'angajat'
export type AlertSeverity = 'info' | 'warning' | 'critical' | 'expired'
export type ComplianceStatus = 'valid' | 'expiring' | 'expired'
export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'push' | 'in_app' | 'calendar'
export type NotificationStatus = 'sent' | 'delivered' | 'failed' | 'bounced'
export type ExaminationType = 'periodic' | 'angajare' | 'reluare' | 'la_cerere' | 'supraveghere'
export type MedicalResult = 'apt' | 'apt_conditionat' | 'inapt_temporar' | 'inapt'
export type EquipmentType =
  | 'stingator'
  | 'trusa_prim_ajutor'
  | 'hidrant'
  | 'detector_fum'
  | 'detector_gaz'
  | 'iluminat_urgenta'
  | 'panou_semnalizare'
  | 'trusa_scule'
  | 'eip'
  | 'altul'
export type DocumentType =
  | 'fisa_medicina_muncii'
  | 'fisa_echipamente'
  | 'raport_conformitate'
  | 'fisa_instruire'
  | 'raport_neactiune'
  | 'altul'
export type TrainingStatus = 'assigned' | 'in_progress' | 'completed' | 'overdue' | 'expired' | 'exempted'
export type TrainingVerificationResult = 'passed' | 'failed' | 'pending' | 'exempt'
export type TrainingCategory = 'ssm' | 'psi' | 'su' | 'nis2' | 'custom'
export type ObligationFrequency =
  | 'annual'
  | 'biannual'
  | 'quarterly'
  | 'monthly'
  | 'weekly'
  | 'daily'
  | 'on_demand'
  | 'once'
  | 'at_hire'
  | 'at_termination'
  | 'continuous'
  | 'unknown'
export type ObligationStatus = 'draft' | 'validated' | 'approved' | 'published' | 'archived'
export type OrgObligationStatus = 'pending' | 'acknowledged' | 'compliant' | 'non_compliant'
export type CooperationStatus = 'active' | 'warning' | 'uncooperative'
export type ExposureScore = 'necalculat' | 'scazut' | 'mediu' | 'ridicat' | 'critic'
export type CountryCode = 'RO' | 'BG' | 'HU' | 'DE' | 'PL' | 'EN'

// ══════════════════════════════════════════════════════════════
// ORGANIZATIONS
// ══════════════════════════════════════════════════════════════

export interface OrganizationsRow {
  id: string
  name: string
  cui: string | null
  address: string | null
  county: string | null
  contact_email: string | null
  contact_phone: string | null
  data_completeness: number
  employee_count: number | null
  exposure_score: ExposureScore
  preferred_channels: NotificationChannel[]
  cooperation_status: CooperationStatus
  country_code: CountryCode
  caen_codes: string[]
  industry_tags: string[]
  created_at: string
  updated_at: string
}

export interface OrganizationsInsert {
  id?: string
  name: string
  cui?: string | null
  address?: string | null
  county?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  data_completeness?: number
  employee_count?: number | null
  exposure_score?: ExposureScore
  preferred_channels?: NotificationChannel[]
  cooperation_status?: CooperationStatus
  country_code?: CountryCode
  caen_codes?: string[]
  industry_tags?: string[]
  created_at?: string
  updated_at?: string
}

export interface OrganizationsUpdate {
  name?: string
  cui?: string | null
  address?: string | null
  county?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  data_completeness?: number
  employee_count?: number | null
  exposure_score?: ExposureScore
  preferred_channels?: NotificationChannel[]
  cooperation_status?: CooperationStatus
  country_code?: CountryCode
  caen_codes?: string[]
  industry_tags?: string[]
  updated_at?: string
}

// ══════════════════════════════════════════════════════════════
// USER_PROFILES
// ══════════════════════════════════════════════════════════════

export interface UserProfilesRow {
  id: string
  full_name: string
  phone: string | null
  avatar_url: string | null
  created_at: string
}

export interface UserProfilesInsert {
  id: string
  full_name: string
  phone?: string | null
  avatar_url?: string | null
  created_at?: string
}

export interface UserProfilesUpdate {
  full_name?: string
  phone?: string | null
  avatar_url?: string | null
}

// ══════════════════════════════════════════════════════════════
// MEMBERSHIPS
// ══════════════════════════════════════════════════════════════

export interface MembershipsRow {
  id: string
  user_id: string
  organization_id: string
  role: RoleType
  is_active: boolean
  joined_at: string
  deleted_at: string | null
}

export interface MembershipsInsert {
  id?: string
  user_id: string
  organization_id: string
  role: RoleType
  is_active?: boolean
  joined_at?: string
  deleted_at?: string | null
}

export interface MembershipsUpdate {
  role?: RoleType
  is_active?: boolean
  deleted_at?: string | null
}

// ══════════════════════════════════════════════════════════════
// EMPLOYEES
// ══════════════════════════════════════════════════════════════

export interface EmployeesRow {
  id: string
  organization_id: string
  full_name: string
  cnp: string | null
  cnp_hash: string | null
  email: string | null
  phone: string | null
  job_title: string | null
  cor_code: string | null
  nationality: string
  hire_date: string | null
  termination_date: string | null
  is_active: boolean
  user_id: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface EmployeesInsert {
  id?: string
  organization_id: string
  full_name: string
  cnp?: string | null
  cnp_hash?: string | null
  email?: string | null
  phone?: string | null
  job_title?: string | null
  cor_code?: string | null
  nationality?: string
  hire_date?: string | null
  termination_date?: string | null
  is_active?: boolean
  user_id?: string | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface EmployeesUpdate {
  full_name?: string
  cnp?: string | null
  cnp_hash?: string | null
  email?: string | null
  phone?: string | null
  job_title?: string | null
  cor_code?: string | null
  nationality?: string
  hire_date?: string | null
  termination_date?: string | null
  is_active?: boolean
  user_id?: string | null
  updated_at?: string
  deleted_at?: string | null
}

// ══════════════════════════════════════════════════════════════
// TRAININGS (Training Modules)
// ══════════════════════════════════════════════════════════════

export interface TrainingModulesRow {
  id: string
  code: string
  title: string
  description: string | null
  category: TrainingCategory
  training_type: string | null
  duration_minutes_required: number | null
  is_mandatory: boolean
  content_version: number
  legal_basis_version: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TrainingModulesInsert {
  id?: string
  code: string
  title: string
  description?: string | null
  category: TrainingCategory
  training_type?: string | null
  duration_minutes_required?: number | null
  is_mandatory?: boolean
  content_version?: number
  legal_basis_version?: string | null
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface TrainingModulesUpdate {
  code?: string
  title?: string
  description?: string | null
  category?: TrainingCategory
  training_type?: string | null
  duration_minutes_required?: number | null
  is_mandatory?: boolean
  content_version?: number
  legal_basis_version?: string | null
  is_active?: boolean
  updated_at?: string
}

// ══════════════════════════════════════════════════════════════
// TRAINING_ASSIGNMENTS
// ══════════════════════════════════════════════════════════════

export interface TrainingAssignmentsRow {
  id: string
  organization_id: string
  worker_id: string
  module_id: string
  session_id: string | null
  assigned_by: string | null
  assigned_at: string
  due_date: string | null
  completed_at: string | null
  status: TrainingStatus
  notes: string | null
  next_due_date: string | null
  created_at: string
  updated_at: string
}

export interface TrainingAssignmentsInsert {
  id?: string
  organization_id: string
  worker_id: string
  module_id: string
  session_id?: string | null
  assigned_by?: string | null
  assigned_at?: string
  due_date?: string | null
  completed_at?: string | null
  status?: TrainingStatus
  notes?: string | null
  next_due_date?: string | null
  created_at?: string
  updated_at?: string
}

export interface TrainingAssignmentsUpdate {
  session_id?: string | null
  due_date?: string | null
  completed_at?: string | null
  status?: TrainingStatus
  notes?: string | null
  next_due_date?: string | null
  updated_at?: string
}

// ══════════════════════════════════════════════════════════════
// TRAINING_SESSIONS
// ══════════════════════════════════════════════════════════════

export interface TrainingSessionsRow {
  id: string
  organization_id: string
  module_id: string
  employee_id: string
  session_date: string
  instructor_name: string | null
  verification_result: TrainingVerificationResult
  test_score: number | null
  certificate_issued_at: string | null
  certificate_hash: string | null
  fisa_generated_at: string | null
  content_version: number
  legal_basis_version: string | null
  created_at: string
  updated_at: string
}

export interface TrainingSessionsInsert {
  id?: string
  organization_id: string
  module_id: string
  employee_id: string
  session_date: string
  instructor_name?: string | null
  verification_result: TrainingVerificationResult
  test_score?: number | null
  certificate_issued_at?: string | null
  certificate_hash?: string | null
  fisa_generated_at?: string | null
  content_version?: number
  legal_basis_version?: string | null
  created_at?: string
  updated_at?: string
}

export interface TrainingSessionsUpdate {
  session_date?: string
  instructor_name?: string | null
  verification_result?: TrainingVerificationResult
  test_score?: number | null
  certificate_issued_at?: string | null
  certificate_hash?: string | null
  fisa_generated_at?: string | null
  content_version?: number
  legal_basis_version?: string | null
  updated_at?: string
}

// ══════════════════════════════════════════════════════════════
// TRAINING_PARTICIPANTS (View - derived from training_assignments)
// ══════════════════════════════════════════════════════════════

export interface TrainingParticipantsView {
  assignment_id: string
  organization_id: string
  employee_id: string
  employee_name: string
  module_id: string
  module_title: string
  status: TrainingStatus
  assigned_at: string
  completed_at: string | null
  due_date: string | null
}

// ══════════════════════════════════════════════════════════════
// MEDICAL_CHECKS (Medical Examinations)
// ══════════════════════════════════════════════════════════════

export interface MedicalChecksRow {
  id: string
  organization_id: string
  employee_name: string
  cnp_hash: string | null
  job_title: string | null
  examination_type: ExaminationType
  examination_date: string
  expiry_date: string
  result: MedicalResult
  restrictions: string | null
  doctor_name: string | null
  clinic_name: string | null
  notes: string | null
  content_version: number
  legal_basis_version: string | null
  created_at: string
  updated_at: string
}

export interface MedicalChecksInsert {
  id?: string
  organization_id: string
  employee_name: string
  cnp_hash?: string | null
  job_title?: string | null
  examination_type: ExaminationType
  examination_date: string
  expiry_date: string
  result: MedicalResult
  restrictions?: string | null
  doctor_name?: string | null
  clinic_name?: string | null
  notes?: string | null
  content_version?: number
  legal_basis_version?: string | null
  created_at?: string
  updated_at?: string
}

export interface MedicalChecksUpdate {
  employee_name?: string
  cnp_hash?: string | null
  job_title?: string | null
  examination_type?: ExaminationType
  examination_date?: string
  expiry_date?: string
  result?: MedicalResult
  restrictions?: string | null
  doctor_name?: string | null
  clinic_name?: string | null
  notes?: string | null
  content_version?: number
  legal_basis_version?: string | null
  updated_at?: string
}

// ══════════════════════════════════════════════════════════════
// EQUIPMENT (Safety Equipment)
// ══════════════════════════════════════════════════════════════

export interface EquipmentRow {
  id: string
  organization_id: string
  equipment_type: EquipmentType
  description: string | null
  location: string | null
  serial_number: string | null
  last_inspection_date: string | null
  expiry_date: string
  next_inspection_date: string | null
  inspector_name: string | null
  is_compliant: boolean
  notes: string | null
  content_version: number
  legal_basis_version: string | null
  created_at: string
  updated_at: string
}

export interface EquipmentInsert {
  id?: string
  organization_id: string
  equipment_type: EquipmentType
  description?: string | null
  location?: string | null
  serial_number?: string | null
  last_inspection_date?: string | null
  expiry_date: string
  next_inspection_date?: string | null
  inspector_name?: string | null
  is_compliant?: boolean
  notes?: string | null
  content_version?: number
  legal_basis_version?: string | null
  created_at?: string
  updated_at?: string
}

export interface EquipmentUpdate {
  equipment_type?: EquipmentType
  description?: string | null
  location?: string | null
  serial_number?: string | null
  last_inspection_date?: string | null
  expiry_date?: string
  next_inspection_date?: string | null
  inspector_name?: string | null
  is_compliant?: boolean
  notes?: string | null
  content_version?: number
  legal_basis_version?: string | null
  updated_at?: string
}

// ══════════════════════════════════════════════════════════════
// DOCUMENTS (Generated Documents)
// ══════════════════════════════════════════════════════════════

export interface DocumentsRow {
  id: string
  organization_id: string
  document_type: DocumentType
  storage_path: string
  file_name: string
  file_size_bytes: number | null
  content_version: number
  legal_basis_version: string | null
  sha256_hash: string | null
  is_locked: boolean
  generated_by: string | null
  generation_context: Record<string, unknown>
  ignored_notifications_count: number
  created_at: string
}

export interface DocumentsInsert {
  id?: string
  organization_id: string
  document_type: DocumentType
  storage_path: string
  file_name: string
  file_size_bytes?: number | null
  content_version?: number
  legal_basis_version?: string | null
  sha256_hash?: string | null
  is_locked?: boolean
  generated_by?: string | null
  generation_context?: Record<string, unknown>
  ignored_notifications_count?: number
  created_at?: string
}

export interface DocumentsUpdate {
  document_type?: DocumentType
  storage_path?: string
  file_name?: string
  file_size_bytes?: number | null
  content_version?: number
  legal_basis_version?: string | null
  sha256_hash?: string | null
  is_locked?: boolean
  generation_context?: Record<string, unknown>
  ignored_notifications_count?: number
}

// ══════════════════════════════════════════════════════════════
// ALERTS (Alert Categories & Preferences)
// ══════════════════════════════════════════════════════════════

export interface AlertsRow {
  id: string
  country_code: CountryCode
  name: string
  description: string | null
  severity: AlertSeverity
  warning_days_before: number
  critical_days_before: number
  obligation_id: string | null
  notify_channels: NotificationChannel[]
  is_active: boolean
  is_system: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface AlertsInsert {
  id?: string
  country_code: CountryCode
  name: string
  description?: string | null
  severity: AlertSeverity
  warning_days_before: number
  critical_days_before: number
  obligation_id?: string | null
  notify_channels?: NotificationChannel[]
  is_active?: boolean
  is_system?: boolean
  display_order?: number
  created_at?: string
  updated_at?: string
}

export interface AlertsUpdate {
  country_code?: CountryCode
  name?: string
  description?: string | null
  severity?: AlertSeverity
  warning_days_before?: number
  critical_days_before?: number
  obligation_id?: string | null
  notify_channels?: NotificationChannel[]
  is_active?: boolean
  is_system?: boolean
  display_order?: number
  updated_at?: string
}

// ══════════════════════════════════════════════════════════════
// AUDIT_LOGS
// ══════════════════════════════════════════════════════════════

export interface AuditLogsRow {
  id: string
  organization_id: string | null
  user_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface AuditLogsInsert {
  id?: string
  organization_id?: string | null
  user_id?: string | null
  action: string
  entity_type: string
  entity_id?: string | null
  old_values?: Record<string, unknown> | null
  new_values?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
  ip_address?: string | null
  user_agent?: string | null
  created_at?: string
}

export interface AuditLogsUpdate {
  // Audit logs are immutable
}

// ══════════════════════════════════════════════════════════════
// OBLIGATIONS
// ══════════════════════════════════════════════════════════════

export interface ObligationsRow {
  id: string
  source_legal_act: string
  source_article_id: string | null
  source_article_number: string | null
  country_code: CountryCode
  obligation_text: string
  who: string[]
  deadline: string | null
  frequency: ObligationFrequency | null
  penalty: string | null
  penalty_min: number | null
  penalty_max: number | null
  penalty_currency: string | null
  evidence_required: string[]
  confidence: number
  validation_score: number
  status: ObligationStatus
  published: boolean
  published_at: string | null
  caen_codes: string[]
  industry_tags: string[]
  extracted_at: string
  validated_at: string | null
  approved_at: string | null
  approved_by: string | null
  created_at: string
  updated_at: string
  language: string
  deduplication_hash: string | null
  metadata: Record<string, unknown>
}

export interface ObligationsInsert {
  id?: string
  source_legal_act: string
  source_article_id?: string | null
  source_article_number?: string | null
  country_code: CountryCode
  obligation_text: string
  who?: string[]
  deadline?: string | null
  frequency?: ObligationFrequency | null
  penalty?: string | null
  penalty_min?: number | null
  penalty_max?: number | null
  penalty_currency?: string | null
  evidence_required?: string[]
  confidence?: number
  validation_score?: number
  status?: ObligationStatus
  published?: boolean
  published_at?: string | null
  caen_codes?: string[]
  industry_tags?: string[]
  extracted_at?: string
  validated_at?: string | null
  approved_at?: string | null
  approved_by?: string | null
  created_at?: string
  updated_at?: string
  language?: string
  deduplication_hash?: string | null
  metadata?: Record<string, unknown>
}

export interface ObligationsUpdate {
  source_legal_act?: string
  source_article_id?: string | null
  source_article_number?: string | null
  country_code?: CountryCode
  obligation_text?: string
  who?: string[]
  deadline?: string | null
  frequency?: ObligationFrequency | null
  penalty?: string | null
  penalty_min?: number | null
  penalty_max?: number | null
  penalty_currency?: string | null
  evidence_required?: string[]
  confidence?: number
  validation_score?: number
  status?: ObligationStatus
  published?: boolean
  published_at?: string | null
  caen_codes?: string[]
  industry_tags?: string[]
  validated_at?: string | null
  approved_at?: string | null
  approved_by?: string | null
  updated_at?: string
  language?: string
  deduplication_hash?: string | null
  metadata?: Record<string, unknown>
}

// ══════════════════════════════════════════════════════════════
// ORG_OBLIGATIONS (Organization Obligations)
// ══════════════════════════════════════════════════════════════

export interface OrgObligationsRow {
  id: string
  organization_id: string
  obligation_id: string
  status: OrgObligationStatus
  assigned_at: string
  acknowledged_at: string | null
  acknowledged_by: string | null
  compliant_at: string | null
  compliant_by: string | null
  notes: string | null
  evidence_urls: string[]
  assigned_by: string | null
  match_score: number
  match_reason: string | null
}

export interface OrgObligationsInsert {
  id?: string
  organization_id: string
  obligation_id: string
  status?: OrgObligationStatus
  assigned_at?: string
  acknowledged_at?: string | null
  acknowledged_by?: string | null
  compliant_at?: string | null
  compliant_by?: string | null
  notes?: string | null
  evidence_urls?: string[]
  assigned_by?: string | null
  match_score?: number
  match_reason?: string | null
}

export interface OrgObligationsUpdate {
  status?: OrgObligationStatus
  acknowledged_at?: string | null
  acknowledged_by?: string | null
  compliant_at?: string | null
  compliant_by?: string | null
  notes?: string | null
  evidence_urls?: string[]
  match_score?: number
  match_reason?: string | null
}

// ══════════════════════════════════════════════════════════════
// NOTIFICATIONS (Notification Log)
// ══════════════════════════════════════════════════════════════

export interface NotificationsRow {
  id: string
  org_id: string
  user_id: string | null
  channel: NotificationChannel
  template_name: string
  status: NotificationStatus
  external_id: string | null
  error_message: string | null
  cost_units: number
  created_at: string
}

export interface NotificationsInsert {
  id?: string
  org_id: string
  user_id?: string | null
  channel: NotificationChannel
  template_name: string
  status?: NotificationStatus
  external_id?: string | null
  error_message?: string | null
  cost_units?: number
  created_at?: string
}

export interface NotificationsUpdate {
  // Notifications are immutable logs - no updates allowed
}

// ══════════════════════════════════════════════════════════════
// CUSTOM_ROLES (RBAC)
// ══════════════════════════════════════════════════════════════

export interface CustomRolesRow {
  id: string
  org_id: string
  name: string
  description: string | null
  is_system: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CustomRolesInsert {
  id?: string
  org_id: string
  name: string
  description?: string | null
  is_system?: boolean
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface CustomRolesUpdate {
  name?: string
  description?: string | null
  updated_at?: string
  deleted_at?: string | null
}

// ══════════════════════════════════════════════════════════════
// ROLE_PERMISSIONS (RBAC)
// ══════════════════════════════════════════════════════════════

export interface RolePermissionsRow {
  id: string
  role_id: string
  resource: string
  action: string
  allowed: boolean
  created_at: string
  updated_at: string
}

export interface RolePermissionsInsert {
  id?: string
  role_id: string
  resource: string
  action: string
  allowed?: boolean
  created_at?: string
  updated_at?: string
}

export interface RolePermissionsUpdate {
  resource?: string
  action?: string
  allowed?: boolean
  updated_at?: string
}

// ══════════════════════════════════════════════════════════════
// USER_CUSTOM_ROLES (RBAC)
// ══════════════════════════════════════════════════════════════

export interface UserCustomRolesRow {
  id: string
  user_id: string
  org_id: string
  role_id: string
  assigned_at: string
  assigned_by: string | null
}

export interface UserCustomRolesInsert {
  id?: string
  user_id: string
  org_id: string
  role_id: string
  assigned_at?: string
  assigned_by?: string | null
}

export interface UserCustomRolesUpdate {
  role_id?: string
  assigned_by?: string | null
}

// ══════════════════════════════════════════════════════════════
// DATABASE INTERFACE (Main Export)
// ══════════════════════════════════════════════════════════════

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: OrganizationsRow
        Insert: OrganizationsInsert
        Update: OrganizationsUpdate
      }
      user_profiles: {
        Row: UserProfilesRow
        Insert: UserProfilesInsert
        Update: UserProfilesUpdate
      }
      memberships: {
        Row: MembershipsRow
        Insert: MembershipsInsert
        Update: MembershipsUpdate
      }
      employees: {
        Row: EmployeesRow
        Insert: EmployeesInsert
        Update: EmployeesUpdate
      }
      training_modules: {
        Row: TrainingModulesRow
        Insert: TrainingModulesInsert
        Update: TrainingModulesUpdate
      }
      training_assignments: {
        Row: TrainingAssignmentsRow
        Insert: TrainingAssignmentsInsert
        Update: TrainingAssignmentsUpdate
      }
      training_sessions: {
        Row: TrainingSessionsRow
        Insert: TrainingSessionsInsert
        Update: TrainingSessionsUpdate
      }
      medical_checks: {
        Row: MedicalChecksRow
        Insert: MedicalChecksInsert
        Update: MedicalChecksUpdate
      }
      equipment: {
        Row: EquipmentRow
        Insert: EquipmentInsert
        Update: EquipmentUpdate
      }
      documents: {
        Row: DocumentsRow
        Insert: DocumentsInsert
        Update: DocumentsUpdate
      }
      alerts: {
        Row: AlertsRow
        Insert: AlertsInsert
        Update: AlertsUpdate
      }
      audit_logs: {
        Row: AuditLogsRow
        Insert: AuditLogsInsert
        Update: AuditLogsUpdate
      }
      obligations: {
        Row: ObligationsRow
        Insert: ObligationsInsert
        Update: ObligationsUpdate
      }
      org_obligations: {
        Row: OrgObligationsRow
        Insert: OrgObligationsInsert
        Update: OrgObligationsUpdate
      }
      notifications: {
        Row: NotificationsRow
        Insert: NotificationsInsert
        Update: NotificationsUpdate
      }
      custom_roles: {
        Row: CustomRolesRow
        Insert: CustomRolesInsert
        Update: CustomRolesUpdate
      }
      role_permissions: {
        Row: RolePermissionsRow
        Insert: RolePermissionsInsert
        Update: RolePermissionsUpdate
      }
      user_custom_roles: {
        Row: UserCustomRolesRow
        Insert: UserCustomRolesInsert
        Update: UserCustomRolesUpdate
      }
    }
    Views: {
      training_participants: {
        Row: TrainingParticipantsView
      }
    }
    Functions: {
      // Database functions can be added here as needed
    }
    Enums: {
      role_type: RoleType
      alert_severity: AlertSeverity
      compliance_status: ComplianceStatus
      notification_channel: NotificationChannel
      notification_status: NotificationStatus
      examination_type: ExaminationType
      medical_result: MedicalResult
      equipment_type: EquipmentType
      document_type: DocumentType
      training_status: TrainingStatus
      training_verification_result: TrainingVerificationResult
      training_category: TrainingCategory
      obligation_frequency: ObligationFrequency
      obligation_status: ObligationStatus
      org_obligation_status: OrgObligationStatus
      cooperation_status: CooperationStatus
      exposure_score: ExposureScore
      country_code: CountryCode
    }
  }
}

// ══════════════════════════════════════════════════════════════
// TYPE HELPERS
// ══════════════════════════════════════════════════════════════

// Helper type for table names
export type TableName = keyof Database['public']['Tables']

// Helper type for getting Row type from table name
export type RowType<T extends TableName> = Database['public']['Tables'][T]['Row']

// Helper type for getting Insert type from table name
export type InsertType<T extends TableName> = Database['public']['Tables'][T]['Insert']

// Helper type for getting Update type from table name
export type UpdateType<T extends TableName> = Database['public']['Tables'][T]['Update']
