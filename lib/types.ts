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

// ── API KEYS ──

export type ApiKeyPermission =
  | 'read:employees'
  | 'write:employees'
  | 'read:trainings'
  | 'write:trainings'
  | 'read:medical'
  | 'write:medical'
  | 'read:equipment'
  | 'write:equipment'
  | 'read:alerts'
  | 'write:alerts'
  | 'read:documents'
  | 'write:documents'
  | 'read:reports'
  | 'webhook:manage'
  | 'admin:all'

export interface ApiKey {
  id: string
  organization_id: string
  name: string
  description: string | null
  key_hash: string
  key_prefix: string
  permissions: ApiKeyPermission[]
  rate_limit_per_minute: number
  last_used_at: string | null
  total_requests: number
  is_active: boolean
  expires_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  revoked_at: string | null
  revoked_by: string | null
}

export const COUNTRY_CURRENCIES: Record<CountryCode, Currency> = {
  'RO': 'RON',
  'BG': 'BGN',
  'HU': 'HUF',
  'DE': 'EUR',
  'PL': 'PLN'
}

// ── BLOG ARTICLES ──

export type BlogCategory = 'SSM' | 'PSI' | 'GDPR' | 'Legislatie' | 'Tips'

export interface BlogArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: BlogCategory
  author: string
  author_avatar?: string
  published_date: string
  read_time_minutes: number
  thumbnail_url?: string
  tags?: string[]
  is_published: boolean
  created_at: string
  updated_at: string
}

// ── WEBHOOKS ──

export type WebhookEventType =
  | 'employee.created'
  | 'employee.updated'
  | 'employee.deleted'
  | 'training.created'
  | 'training.completed'
  | 'medical.created'
  | 'medical.expiring'
  | 'medical.expired'
  | 'equipment.created'
  | 'equipment.expiring'
  | 'equipment.expired'
  | 'alert.created'
  | 'incident.created'
  | 'penalty.created'
  | 'compliance.status_changed'

export type WebhookStatus = 'pending' | 'success' | 'failed'

export interface Webhook {
  id: string
  organization_id: string
  url: string
  events: string[]
  secret: string
  is_active: boolean
  created_by: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface WebhookDeliveryLog {
  id: string
  webhook_id: string
  event_type: string
  payload: Record<string, any>
  status: WebhookStatus
  http_status_code: number | null
  response_body: string | null
  error_message: string | null
  attempts: number
  created_at: string
  delivered_at: string | null
}

// ── API KEYS ──

export type ApiKeyPermission =
  | 'read:employees'
  | 'write:employees'
  | 'read:trainings'
  | 'write:trainings'
  | 'read:medical'
  | 'write:medical'
  | 'read:equipment'
  | 'write:equipment'
  | 'read:documents'
  | 'write:documents'
  | 'read:alerts'
  | 'read:incidents'
  | 'write:incidents'
  | 'read:compliance'
  | 'admin:all'

export interface ApiKey {
  id: string
  organization_id: string
  name: string
  description: string | null
  key_hash: string
  key_prefix: string
  permissions: ApiKeyPermission[]
  rate_limit_per_minute: number
  last_used_at: string | null
  total_requests: number
  is_active: boolean
  expires_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  revoked_at: string | null
  revoked_by: string | null
}

export interface ApiKeyUsageLog {
  id: string
  api_key_id: string
  endpoint: string
  method: string
  status_code: number | null
  ip_address: string | null
  user_agent: string | null
  request_size_bytes: number | null
  response_size_bytes: number | null
  duration_ms: number | null
  error_message: string | null
  created_at: string
}

// ── OBLIGATIONS (M5 Publishing Module) ──

export type ObligationStatus = 'draft' | 'validated' | 'approved' | 'published' | 'archived'
export type OrgObligationStatus = 'pending' | 'acknowledged' | 'compliant' | 'non_compliant'

export interface Obligation {
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
  metadata: Record<string, any>
}

export interface OrganizationObligation {
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

// ── AUDIT INTERN ──

export type AuditType = 'ssm_general' | 'psi' | 'gdpr' | 'iso_45001'
export type AuditStatus = 'draft' | 'in_progress' | 'completed' | 'archived'
export type AuditAnswer = 'compliant' | 'non_compliant' | 'partial' | 'na'
export type ActionStatus = 'pending' | 'in_progress' | 'completed' | 'overdue'

export interface AuditQuestion {
  id: string
  audit_type: AuditType
  category: string
  question_text: string
  legal_reference: string | null
  weight: number
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Audit {
  id: string
  organization_id: string
  audit_type: AuditType
  audit_date: string
  auditor_name: string
  auditor_id: string | null

  // Status and progress
  status: AuditStatus
  progress_percentage: number

  // Scoring
  total_questions: number
  answered_questions: number
  compliant_answers: number
  partial_answers: number
  non_compliant_answers: number
  na_answers: number
  compliance_score: number
  weighted_score: number

  // Results summary
  findings: string[]
  non_conformities: string[]
  corrective_actions: string[]
  recommendations: string[]

  // Report
  report_generated_at: string | null
  report_url: string | null

  // Metadata
  notes: string | null
  started_at: string
  completed_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string

  // Relations
  organizations?: Organization
}

export interface AuditResponse {
  id: string
  audit_id: string
  question_id: string

  // Response
  answer: AuditAnswer
  comment: string | null

  // Evidence
  evidence_files: string[]
  evidence_description: string | null

  // Follow-up
  requires_action: boolean
  action_description: string | null
  action_deadline: string | null
  action_assigned_to: string | null
  action_status: ActionStatus | null

  // Metadata
  answered_by: string | null
  answered_at: string
  created_at: string
  updated_at: string

  // Relations
  audit_questions?: AuditQuestion
}

export const AUDIT_TYPE_LABELS: Record<AuditType, string> = {
  'ssm_general': 'SSM General',
  'psi': 'PSI (Prevenire Incendii)',
  'gdpr': 'GDPR (Protecția Datelor)',
  'iso_45001': 'ISO 45001'
}

export const AUDIT_STATUS_LABELS: Record<AuditStatus, string> = {
  'draft': 'Draft',
  'in_progress': 'În Progres',
  'completed': 'Finalizat',
  'archived': 'Arhivat'
}

export const AUDIT_ANSWER_LABELS: Record<AuditAnswer, string> = {
  'compliant': 'DA (Conform)',
  'non_compliant': 'NU (Neconform)',
  'partial': 'Parțial',
  'na': 'N/A (Nu se aplică)'
}

// ── CALENDAR EVENTS ──

export type CalendarEventType =
  | 'meeting'
  | 'inspection'
  | 'deadline'
  | 'training_external'
  | 'holiday'
  | 'maintenance'
  | 'other'

export interface CalendarEvent {
  id: string
  organization_id: string

  // Event details
  title: string
  description: string | null
  event_type: CalendarEventType

  // Date and time
  start_date: string
  end_date: string | null
  all_day: boolean

  // Relationships
  related_employee_id: string | null
  related_training_id: string | null
  related_equipment_id: string | null
  related_medical_id: string | null

  // Display
  color: string
  location: string | null

  // Reminders
  reminder_minutes: number[] | null

  // Metadata
  created_by: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export const CALENDAR_EVENT_TYPE_LABELS: Record<CalendarEventType, string> = {
  'meeting': 'Întâlnire',
  'inspection': 'Inspecție',
  'deadline': 'Termen limită',
  'training_external': 'Instruire externă',
  'holiday': 'Sărbătoare/Concediu',
  'maintenance': 'Mentenanță',
  'other': 'Altul'
}

export const CALENDAR_EVENT_TYPE_COLORS: Record<CalendarEventType, string> = {
  'meeting': '#3B82F6', // blue
  'inspection': '#F59E0B', // amber
  'deadline': '#EF4444', // red
  'training_external': '#8B5CF6', // purple
  'holiday': '#10B981', // green
  'maintenance': '#6B7280', // gray
  'other': '#6366F1' // indigo
}

// ── TRAINING RECORDS ──

export type TrainingStatus = 'scheduled' | 'completed' | 'cancelled' | 'expired'

export interface TrainingType {
  id: string
  name: string
  description: string | null
  frequency_months: number
  legal_reference: string | null
  is_mandatory: boolean
  default_duration_hours: number | null
  default_tematica: any[] // JSONB array
  country_code: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface TrainingTematicaItem {
  topic: string
  duration_min: number
  completed: boolean
  notes?: string
}

export interface TrainingTestQuestion {
  question: string
  type: 'multiple_choice' | 'true_false' | 'open_ended'
  options?: string[]
  correct_answer: string
  employee_answer?: string
  points?: number
}

export interface TrainingAttachment {
  name: string
  url: string
  size: number
  uploaded_at: string
}

export interface Training {
  id: string
  organization_id: string
  employee_id: string

  // Training details
  training_type_id: string
  training_type: string
  training_date: string
  duration_hours: number | null

  // Content
  tematica_content: TrainingTematicaItem[]

  // Test management
  test_questions: TrainingTestQuestion[]
  test_score: number | null
  test_passed: boolean | null
  test_taken_at: string | null

  // Certificate
  certificate_number: string | null
  certificate_url: string | null
  certificate_issued_at: string | null

  // Next training
  next_training_date: string | null

  // Location and provider
  location: string | null
  external_provider: string | null

  // Cost
  cost: number | null
  currency: string

  // Trainer
  trainer_name: string | null
  trainer_id: string | null

  // Status
  status: TrainingStatus
  is_compliant: boolean

  // Notes and attachments
  notes: string | null
  attachments: TrainingAttachment[]

  // Metadata
  created_by: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relations (populated in queries)
  training_types?: TrainingType
  employees?: any
  organizations?: Organization
}

export interface TrainingExpiringSoon extends Training {
  employee_name: string
  cnp_hash: string | null
  organization_name: string
  days_until_due: number
  frequency_months: number
}

export interface TrainingCompletionStats {
  organization_id: string
  organization_name: string
  employees_trained: number
  total_trainings: number
  completed_trainings: number
  passed_tests: number
  avg_test_score: number | null
  total_training_cost: number | null
  overdue_trainings: number
}

export const TRAINING_STATUS_LABELS: Record<TrainingStatus, string> = {
  'scheduled': 'Programat',
  'completed': 'Finalizat',
  'cancelled': 'Anulat',
  'expired': 'Expirat'
}

export const TRAINING_STATUS_COLORS: Record<TrainingStatus, string> = {
  'scheduled': 'blue',
  'completed': 'green',
  'cancelled': 'gray',
  'expired': 'red'
}
