// S-S-M.RO — TIPURI TYPESCRIPT
// Mapate 1:1 pe cele 8 tabele Supabase MVP
// Data: 4 Februarie 2026

export interface Organization {
  id: string
  name: string
  cui: string | null
  address: string | null
  county: string | null
  contact_email: string | null
  contact_phone: string | null
  data_completeness: number
  employee_count?: number
  exposure_score: 'necalculat' | 'scazut' | 'mediu' | 'ridicat' | 'critic'
  preferred_channels: string[]
  cooperation_status: 'active' | 'warning' | 'uncooperative'
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string
  phone: string | null
  avatar_url: string | null
  created_at: string
}

export interface Membership {
  id: string
  user_id: string
  organization_id: string
  role: 'consultant' | 'firma_admin' | 'angajat'
  is_active: boolean
  joined_at: string
}

export interface MedicalExamination {
  id: string
  organization_id: string
  employee_name: string
  cnp_hash: string | null
  job_title: string | null
  examination_type: 'periodic' | 'angajare' | 'reluare' | 'la_cerere' | 'supraveghere'
  examination_date: string
  expiry_date: string
  result: 'apt' | 'apt_conditionat' | 'inapt_temporar' | 'inapt'
  restrictions: string | null
  doctor_name: string | null
  clinic_name: string | null
  notes: string | null
  content_version: number
  legal_basis_version: string
  created_at: string
  updated_at: string
}

export interface SafetyEquipment {
  id: string
  organization_id: string
  equipment_type: 'stingator' | 'trusa_prim_ajutor' | 'hidrant' | 'detector_fum' |
    'detector_gaz' | 'iluminat_urgenta' | 'panou_semnalizare' | 'trusa_scule' | 'eip' | 'altul'
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
  legal_basis_version: string
  created_at: string
  updated_at: string
}

export interface NotificationLogEntry {
  id: string
  organization_id: string
  notification_type: 'alert_mm_30d' | 'alert_mm_15d' | 'alert_mm_7d' | 'alert_mm_expired' |
    'alert_psi_30d' | 'alert_psi_15d' | 'alert_psi_expired' |
    'report_monthly' | 'fraud_alert' | 'system_alert'
  channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'calendar'
  recipient: string
  status: 'sent' | 'delivered' | 'opened' | 'actioned' | 'ignored' | 'failed'
  sent_at: string
  delivered_at: string | null
  opened_at: string | null
  actioned_at: string | null
  metadata: Record<string, any>
}

export interface FraudAlert {
  id: string
  organization_id: string
  trigger_type: 'rapid_submissions' | 'same_ip' | 'same_user_agent' | 'same_gps' | 'combined'
  evidence: Record<string, any>
  affected_session_ids: string[] | null
  resolution_status: 'pending' | 'confirmed_fraud' | 'false_positive' | 'reviewed'
  resolved_by: string | null
  resolved_at: string | null
  resolution_notes: string | null
  created_at: string
}

export interface GeneratedDocument {
  id: string
  organization_id: string
  document_type: 'fisa_medicina_muncii' | 'fisa_echipamente' | 'raport_conformitate' |
    'fisa_instruire' | 'raport_neactiune' | 'altul'
  storage_path: string
  file_name: string
  file_size_bytes: number | null
  content_version: number
  legal_basis_version: string
  sha256_hash: string | null
  is_locked: boolean
  generated_by: string | null
  generation_context: Record<string, any>
  ignored_notifications_count: number
  created_at: string
}

// Helper: Status calculat pentru fișe medicale și echipamente
export type ExpiryStatus = 'valid' | 'expiring' | 'expired'

export function getExpiryStatus(expiryDate: string): ExpiryStatus {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilExpiry < 0) return 'expired'
  if (daysUntilExpiry <= 30) return 'expiring'
  return 'valid'
}

export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

// ── ADMIN CONFIGURABIL: Tabele master date per țară ──

export type CountryCode = 'RO' | 'BG' | 'HU' | 'DE' | 'PL'
export type Currency = 'RON' | 'BGN' | 'HUF' | 'EUR' | 'PLN'
export type ObligationFrequency = 'annual' | 'biannual' | 'monthly' | 'quarterly' | 'on_demand' | 'once'
export type AlertSeverity = 'info' | 'warning' | 'critical' | 'expired'
export type NotificationChannel = 'email' | 'whatsapp' | 'sms' | 'push'
export type EquipmentCategory =
  | 'fire_safety'
  | 'first_aid'
  | 'ppe'
  | 'emergency_exit'
  | 'detection'
  | 'pressure_equipment'
  | 'lifting_equipment'
  | 'other'

export interface ObligationType {
  id: string
  country_code: CountryCode
  name: string
  description: string | null
  frequency: ObligationFrequency
  authority_name: string
  legal_reference: string | null
  penalty_min: number | null
  penalty_max: number | null
  currency: Currency
  is_active: boolean
  is_system: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface AlertCategory {
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
  // Relație
  obligation_types?: ObligationType
}

export interface EquipmentType {
  id: string
  country_code: CountryCode
  name: string
  description: string | null
  category: EquipmentCategory
  subcategory: string | null
  inspection_frequency: ObligationFrequency
  legal_standard: string | null
  obligation_id: string | null
  max_lifespan_years: number | null
  requires_certification: boolean
  certification_authority: string | null
  is_active: boolean
  is_system: boolean
  display_order: number
  created_at: string
  updated_at: string
  // Relație
  obligation_types?: ObligationType
}

// Helper: Steaguri emoji per țară
export const COUNTRY_FLAGS: Record<CountryCode | 'ALL', string> = {
  'RO': '🇷🇴',
  'BG': '🇧🇬',
  'HU': '🇭🇺',
  'DE': '🇩🇪',
  'PL': '🇵🇱',
  'ALL': '🌍'
}

export const COUNTRY_NAMES: Record<CountryCode, string> = {
  'RO': 'România',
  'BG': 'Bulgaria',
  'HU': 'Ungaria',
  'DE': 'Germania',
  'PL': 'Polonia'
}

export const COUNTRY_CURRENCIES: Record<CountryCode, Currency> = {
  'RO': 'RON',
  'BG': 'BGN',
  'HU': 'HUF',
  'DE': 'EUR',
  'PL': 'PLN'
}

// ── EMPLOYEES ──

export interface Employee {
  id: string
  organization_id: string
  user_id: string | null
  full_name: string
  cnp_hash: string | null
  email: string | null
  phone: string | null
  job_title: string | null
  department: string | null
  hire_date: string | null
  employment_type: 'full_time' | 'part_time' | 'contractor' | 'intern' | 'other' | null
  is_active: boolean
  cor_code: string | null
  location_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// ── TRAINING SYSTEM ──

export type TrainingModuleCode =
  | 'ssm_intro'
  | 'psi_intro'
  | 'first_aid'
  | 'ergonomics'
  | 'chemicals'
  | 'electrical'
  | 'heights'
  | 'machinery'
  | 'evacuation'

export type TrainingLevel = 'basic' | 'intermediate' | 'advanced'

export interface TrainingModule {
  id: string
  country_code: CountryCode
  code: TrainingModuleCode
  name: string
  description: string | null
  level: TrainingLevel
  duration_minutes: number
  is_mandatory: boolean
  legal_reference: string | null
  content_version: number
  quiz_passing_score: number
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface TrainingAssignment {
  id: string
  organization_id: string
  employee_id: string
  module_id: string
  assigned_by: string
  assigned_at: string
  due_date: string | null
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'expired'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface TrainingSession {
  id: string
  assignment_id: string
  employee_id: string
  module_id: string
  organization_id: string
  started_at: string
  completed_at: string | null
  duration_seconds: number
  progress_percent: number
  quiz_score: number | null
  quiz_attempts: number
  passed: boolean
  certificate_url: string | null
  ip_address: string | null
  user_agent: string | null
  gps_location: string | null
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

// Alias pentru MedicalExamination → MedicalRecord (consistență naming)
export type MedicalRecord = MedicalExamination

// Alias pentru SafetyEquipment → Equipment (consistență naming)
export type Equipment = SafetyEquipment

export interface EquipmentInspection {
  id: string
  equipment_id: string
  organization_id: string
  inspection_date: string
  inspector_name: string
  inspector_certification: string | null
  result: 'passed' | 'failed' | 'conditional'
  defects_found: string | null
  corrective_actions: string | null
  next_inspection_date: string | null
  certificate_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// ── ALERTS & NOTIFICATIONS ──

export interface Alert {
  id: string
  organization_id: string
  alert_category_id: string | null
  type: 'medical_expiry' | 'equipment_expiry' | 'training_due' | 'compliance_deadline' | 'custom'
  severity: AlertSeverity
  title: string
  message: string
  reference_id: string | null
  reference_type: 'medical_record' | 'equipment' | 'training' | 'obligation' | null
  due_date: string | null
  is_resolved: boolean
  resolved_at: string | null
  resolved_by: string | null
  resolution_notes: string | null
  created_at: string
  updated_at: string
  // Relații
  alert_categories?: AlertCategory
}

export type NotificationStatus = 'sent' | 'delivered' | 'opened' | 'actioned' | 'ignored' | 'failed'
export type NotificationType =
  | 'alert_mm_30d'
  | 'alert_mm_15d'
  | 'alert_mm_7d'
  | 'alert_mm_expired'
  | 'alert_psi_30d'
  | 'alert_psi_15d'
  | 'alert_psi_expired'
  | 'alert_training_due'
  | 'report_monthly'
  | 'fraud_alert'
  | 'system_alert'

export interface Notification {
  id: string
  organization_id: string
  user_id: string | null
  notification_type: NotificationType
  channel: NotificationChannel
  recipient: string
  subject: string | null
  message: string
  status: NotificationStatus
  alert_id: string | null
  sent_at: string
  delivered_at: string | null
  opened_at: string | null
  actioned_at: string | null
  metadata: Record<string, any>
  created_at: string
}

// Alias pentru NotificationLogEntry → Notification (consistență)
// NotificationLogEntry este deja exportat mai sus, păstrat pentru backward compatibility

// ── AUDIT LOG ──

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'assign_role'
  | 'remove_role'
  | 'change_permission'
  | 'export_data'
  | 'import_data'
  | 'send_notification'
  | 'generate_document'
  | 'other'

export interface AuditLog {
  id: string
  organization_id: string | null
  user_id: string | null
  action: AuditAction
  resource_type: string | null
  resource_id: string | null
  changes: Record<string, any> | null
  ip_address: string | null
  user_agent: string | null
  metadata: Record<string, any> | null
  created_at: string
}

// ── RBAC SYSTEM ──

export type RoleType = 'system' | 'country_specific' | 'custom'
export type RoleTier = 1 | 2 | 3

export interface Role {
  id: string
  code: string
  name: string
  description: string | null
  country_code: CountryCode | 'ALL'
  role_type: RoleType
  tier: RoleTier
  is_system: boolean
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Permission {
  id: string
  role_id: string
  resource: string
  action: 'create' | 'read' | 'update' | 'delete' | 'manage' | 'export' | 'import'
  conditions: Record<string, any> | null
  created_at: string
  // Relații
  roles?: Role
}

export interface UserRole {
  id: string
  user_id: string
  role_id: string
  organization_id: string | null
  granted_by: string | null
  granted_at: string
  expires_at: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  // Relații
  roles?: Role
  profiles?: Profile
}

// ── LOCATIONS ──

export interface Location {
  id: string
  organization_id: string
  name: string
  address: string | null
  city: string | null
  county: string | null
  postal_code: string | null
  country_code: CountryCode
  is_headquarters: boolean
  is_active: boolean
  employee_count: number
  notes: string | null
  created_at: string
  updated_at: string
}

// ── DOCUMENTS ──

export type DocumentType =
  | 'fisa_medicina_muncii'
  | 'fisa_echipamente'
  | 'raport_conformitate'
  | 'fisa_instruire'
  | 'raport_neactiune'
  | 'certificat_training'
  | 'proces_verbal'
  | 'plan_preventie'
  | 'plan_evacuare'
  | 'altul'

export interface Document {
  id: string
  organization_id: string
  document_type: DocumentType
  title: string
  file_name: string
  storage_path: string
  file_size_bytes: number | null
  mime_type: string | null
  sha256_hash: string | null
  content_version: number
  legal_basis_version: string
  is_locked: boolean
  generated_by: string | null
  generation_context: Record<string, any> | null
  employee_id: string | null
  related_id: string | null
  related_type: string | null
  ignored_notifications_count: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// ── PENALTIES & COMPLIANCE ──

export interface Penalty {
  id: string
  organization_id: string
  authority_id: string | null
  obligation_id: string | null
  penalty_date: string
  amount: number
  currency: Currency
  reason: string
  reference_number: string | null
  status: 'pending' | 'paid' | 'appealed' | 'cancelled'
  paid_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Authority {
  id: string
  country_code: CountryCode
  name: string
  abbreviation: string | null
  type: 'labor_inspection' | 'fire_safety' | 'health' | 'data_protection' | 'environmental' | 'other'
  jurisdiction_level: 'national' | 'regional' | 'local'
  contact_email: string | null
  contact_phone: string | null
  website: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// ── REGES INTEGRATION ──

export interface RegesConnection {
  id: string
  organization_id: string
  company_name: string
  cui: string
  username: string
  password_encrypted: string
  is_active: boolean
  last_sync_at: string | null
  sync_status: 'never' | 'success' | 'error' | 'in_progress'
  sync_error: string | null
  created_at: string
  updated_at: string
}

export interface RegesOutbox {
  id: string
  organization_id: string
  employee_id: string
  transmission_type: 'new' | 'update' | 'termination'
  status: 'pending' | 'sent' | 'confirmed' | 'error'
  payload: Record<string, any>
  sent_at: string | null
  confirmed_at: string | null
  error_message: string | null
  retry_count: number
  created_at: string
  updated_at: string
}

// ── USER PREFERENCES ──

export type Theme = 'light' | 'dark' | 'auto'
export type Language = 'ro' | 'bg' | 'hu' | 'de' | 'pl' | 'en'

export interface UserPreferences {
  id: string
  user_id: string
  theme: Theme
  language: Language
  timezone: string
  date_format: string
  notifications_enabled: boolean
  email_notifications: boolean
  sms_notifications: boolean
  whatsapp_notifications: boolean
  created_at: string
  updated_at: string
}

// ── JURISDICTIONS ──

export interface Jurisdiction {
  id: string
  country_code: CountryCode
  level: 'national' | 'regional' | 'local'
  name: string
  code: string | null
  parent_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// ── COUNTRY CONFIGURATION ──

export interface Country {
  code: CountryCode
  name: string
  native_name: string
  currency: Currency
  locale: string
  flag_emoji: string
  is_active: boolean
  vat_rate: number
  social_security_rate: number | null
  min_wage: number | null
  working_hours_per_week: number
  legal_framework_url: string | null
  created_at: string
  updated_at: string
}

// ── HELPERS & UTILITIES ──

export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface FilterParams {
  search?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  organizationId?: string
  [key: string]: any
}
