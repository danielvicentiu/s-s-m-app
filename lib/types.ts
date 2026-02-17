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
  country_code?: CountryCode
  caen_codes?: string[]
  industry_tags?: string[]
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
  employee_id?: string | null // NEW: FK to employees (nullable for backward compatibility)
  employee_name: string
  cnp_hash: string | null
  job_title: string | null
  examination_type: 'periodic' | 'angajare' | 'reluare' | 'la_cerere' | 'supraveghere' | 'fisa_aptitudine' | 'fisa_psihologica' | 'control_periodic' | 'control_angajare' | 'control_reluare' | 'vaccinare' | 'altul'
  examination_date: string
  expiry_date: string
  result: 'apt' | 'apt_conditionat' | 'inapt_temporar' | 'inapt' | 'in_asteptare'
  restrictions: string | null
  doctor_name: string | null
  clinic_name: string | null
  notes: string | null
  // M3 MEDICAL tracking fields
  validity_months?: number // Default 12
  risk_factors?: string[] | null // Array of risk factors
  next_examination_date?: string | null // Calculated expiry date
  document_number?: string | null // Certificate/document number
  document_storage_path?: string | null // Path to stored PDF
  location_id?: string | null
  file_url?: string | null // Legacy field for backward compatibility
  content_version: number
  legal_basis_version: string
  created_at: string
  updated_at: string
  // Relations (populated by joins)
  employees?: {
    id: string
    full_name: string
    job_title: string | null
    cor_code: string | null
  }
  organizations?: {
    id: string
    name: string
    cui: string | null
  }
}

// M3 MEDICAL: Appointment scheduling interface
export interface MedicalAppointment {
  id: string
  employee_id: string
  organization_id: string
  appointment_date: string // DATE
  appointment_time?: string | null // TIME
  clinic_name?: string | null
  clinic_address?: string | null
  examination_type: 'periodic' | 'angajare' | 'reluare' | 'la_cerere' | 'supraveghere' | 'fisa_aptitudine' | 'fisa_psihologica' | 'control_periodic' | 'control_angajare' | 'control_reluare' | 'vaccinare' | 'altul'
  status: 'programat' | 'confirmat' | 'efectuat' | 'anulat' | 'reprogramat'
  notes?: string | null
  created_by?: string | null
  created_at: string
  updated_at: string
  // Relations (populated by joins)
  employees?: {
    id: string
    full_name: string
    job_title: string | null
    cor_code: string | null
  }
  organizations?: {
    id: string
    name: string
    cui: string | null
  }
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
export type LegislationDomain = 'SSM' | 'PSI' | 'GDPR' | 'LABOR' | 'OTHER'
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
  | 'read:incidents'
  | 'write:incidents'
  | 'read:compliance'
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
  | 'training.due'
  | 'medical.created'
  | 'medical.expiring'
  | 'medical.expired'
  | 'equipment.created'
  | 'equipment.expiring'
  | 'equipment.expired'
  | 'equipment.inspection_due'
  | 'alert.created'
  | 'alert.triggered'
  | 'incident.created'
  | 'penalty.created'
  | 'compliance.status_changed'
  | 'compliance.changed'
  | 'document.uploaded'
  | 'organization.updated'

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

// ── M2_PSI: Fire Safety Equipment Tracking ──

export type PSIEquipmentType =
  | 'stingator'
  | 'hidrant_interior'
  | 'hidrant_exterior'
  | 'detector_fum'
  | 'detector_co'
  | 'alarma_incendiu'
  | 'iluminat_urgenta'
  | 'sistem_stingere'
  | 'altul'

export type PSIEquipmentStatus =
  | 'operational'
  | 'needs_inspection'
  | 'needs_repair'
  | 'out_of_service'

export type PSIInspectionResult =
  | 'conform'
  | 'conform_cu_observatii'
  | 'neconform'

export type PSIAlertLevel =
  | 'expired'
  | 'critical'
  | 'warning'
  | 'info'
  | 'ok'

export interface PSIEquipment {
  id: string
  organization_id: string
  equipment_type: PSIEquipmentType
  identifier: string
  location: string | null
  manufacturer: string | null
  model: string | null
  manufacture_date: string | null
  installation_date: string | null
  last_inspection_date: string | null
  next_inspection_date: string | null
  capacity: string | null
  agent_type: string | null
  status: PSIEquipmentStatus
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  // Joined data (optional)
  organizations?: {
    id: string
    name: string
    cui: string | null
  }
}

export interface PSIInspection {
  id: string
  equipment_id: string
  organization_id: string
  inspection_date: string
  inspector_name: string
  inspector_license: string | null
  result: PSIInspectionResult
  findings: string | null
  next_inspection_date: string
  bulletin_number: string | null
  bulletin_storage_path: string | null
  created_by: string | null
  created_at: string
  // Joined data (optional)
  psi_equipment?: PSIEquipment
}

export interface PSIAlertItem {
  id: string
  equipment_id: string
  equipment_type: PSIEquipmentType
  identifier: string
  location: string | null
  next_inspection_date: string
  days_until_due: number
  alert_level: PSIAlertLevel
  organization_id: string
  organization_name: string
  organization_cui: string | null
}

// Helper: Romanian labels for PSI equipment types
export const PSI_EQUIPMENT_TYPE_LABELS: Record<PSIEquipmentType, string> = {
  'stingator': 'Stingător',
  'hidrant_interior': 'Hidrant interior',
  'hidrant_exterior': 'Hidrant exterior',
  'detector_fum': 'Detector fum',
  'detector_co': 'Detector CO',
  'alarma_incendiu': 'Alarmă incendiu',
  'iluminat_urgenta': 'Iluminat urgență',
  'sistem_stingere': 'Sistem stingere',
  'altul': 'Altul'
}

// Helper: Romanian labels for PSI equipment status
export const PSI_EQUIPMENT_STATUS_LABELS: Record<PSIEquipmentStatus, string> = {
  'operational': 'Operațional',
  'needs_inspection': 'Necesită inspecție',
  'needs_repair': 'Necesită reparație',
  'out_of_service': 'Scos din funcțiune'
}

// Helper: Romanian labels for PSI inspection results
export const PSI_INSPECTION_RESULT_LABELS: Record<PSIInspectionResult, string> = {
  'conform': 'Conform',
  'conform_cu_observatii': 'Conform cu observații',
  'neconform': 'Neconform'
}

// Helper: Romanian labels for PSI alert levels
export const PSI_ALERT_LEVEL_LABELS: Record<PSIAlertLevel, string> = {
  'expired': 'Expirat',
  'critical': '30 zile',
  'warning': '60 zile',
  'info': '90 zile',
  'ok': 'La zi'
}

// ── TRAINING CALENDAR (Calendar Instruiri SSM) ──

export type TrainingType = 'ig' | 'llm' | 'periodica' | 'tematica'
export type TrainingSessionStatus = 'programat' | 'efectuat' | 'expirat' | 'anulat'

export interface TrainingSession {
  id: string
  organization_id: string
  employee_id: string
  training_type: TrainingType
  scheduled_date: string // DATE
  completed_date: string | null // DATE
  instructor: string
  duration_hours: number
  topics: string | null
  status: TrainingSessionStatus
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  // Relations (populated by joins)
  employees?: {
    id: string
    full_name: string
    job_title: string | null
  }
  organizations?: {
    id: string
    name: string
    cui: string | null
  }
}

// ── REPORTS: Automated PDF/HTML Reports ──

export type ReportType =
  | 'situatie_ssm'
  | 'situatie_psi'
  | 'instruiri_luna'
  | 'documente_expirate'

export interface Report {
  id: string
  organization_id: string
  report_type: ReportType
  title: string
  html_content: string
  metadata: Record<string, any>
  generated_by: string | null
  created_at: string
  // Joined data (optional)
  organizations?: {
    id: string
    name: string
    cui: string | null
  }
}

export interface TrainingCalendarItem {
  id: string
  organization_id: string
  organization_name: string
  organization_cui: string | null
  employee_id: string
  employee_name: string
  job_title: string | null
  training_type: TrainingType
  scheduled_date: string
  completed_date: string | null
  instructor: string
  duration_hours: number
  topics: string | null
  status: TrainingSessionStatus
  notes: string | null
  next_training_date: string | null
  days_until_scheduled: number
}

export interface TrainingCalendarStats {
  total_programate_luna_curenta: number
  total_efectuate: number
  total_expirate: number
  upcoming_7_zile: number
}

// Helper: Romanian labels for training types
export const TRAINING_TYPE_LABELS: Record<TrainingType, string> = {
  'ig': 'IG (Introductiv Generală)',
  'llm': 'LLM (La Locul de Muncă)',
  'periodica': 'Periodică',
  'tematica': 'Tematică'
}

// Helper: Romanian labels for training session status
export const TRAINING_SESSION_STATUS_LABELS: Record<TrainingSessionStatus, string> = {
  'programat': 'Programat',
  'efectuat': 'Efectuat',
  'expirat': 'Expirat',
  'anulat': 'Anulat'
}

// Helper: Romanian labels for report types
export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  'situatie_ssm': 'Situație SSM Completă',
  'situatie_psi': 'Situație PSI Completă',
  'instruiri_luna': 'Instruiri Luna Curentă',
  'documente_expirate': 'Documente Expirate'
}


// ── M7 LEGAL MONITOR: Legislative monitoring ──

export type LegalActStatus = 'active' | 'inactive' | 'pending'
export type MonitorLogStatus = 'success' | 'error' | 'no_change' | 'changed'

export interface LegalActMonitor {
  id: string
  act_key: string
  title: string
  act_type: string
  act_number: string | null
  act_year: number | null
  country_code: CountryCode
  domain: LegislationDomain
  current_version_date: string | null
  last_checked_at: string | null
  check_frequency_days: number
  status: LegalActStatus
  priority: 'critical' | 'high' | 'normal' | 'low'
  needs_review: boolean
  source_url: string | null
  created_at: string
  updated_at: string
}

export interface RoMonitorLog {
  id: string
  act_key: string
  checked_at: string
  status: MonitorLogStatus
  details: string | null
  version_date_found: string | null
  error_message: string | null
  duration_ms: number | null

// ── BATCH PROCESSING (M6) ──

export type BatchJobType =
  | 'expiry_check'
  | 'alert_generation'
  | 'compliance_check'
  | 'data_cleanup'
  | 'report_generation'

export type BatchJobStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'

export interface BatchJob {
  id: string
  organization_id: string | null
  job_type: BatchJobType
  status: BatchJobStatus
  total_items: number
  processed_items: number
  failed_items: number
  results: Record<string, any>
  error_message: string | null
  created_by: string | null
  created_at: string
  completed_at: string | null
}

export interface BatchResult {
  jobId: string
  totalOrgs: number
  totalExpired: number
  totalExpiring: number
  errors: Array<{
    organizationId: string
    organizationName: string
    error: string
  }>
}

export interface AlertSummary {
  totalAlerts: number
  perOrg: Record<string, number>
}

export interface ExpiryCheckResult {
  organizationId: string
  organizationName: string
  medicalExpired: number
  medicalExpiring: number
  equipmentExpired: number
  equipmentExpiring: number
  iscirExpired: number
  iscirExpiring: number
  psiExpired: number
  psiExpiring: number
  totalExpired: number
  totalExpiring: number
}

// Helper: Romanian labels for batch job types
export const BATCH_JOB_TYPE_LABELS: Record<BatchJobType, string> = {
  'expiry_check': 'Verificare Expirări',
  'alert_generation': 'Generare Alerte',
  'compliance_check': 'Verificare Conformitate',
  'data_cleanup': 'Curățare Date',
  'report_generation': 'Generare Rapoarte'
}

// Helper: Romanian labels for batch job status
export const BATCH_JOB_STATUS_LABELS: Record<BatchJobStatus, string> = {
  'pending': 'În așteptare',
  'processing': 'În procesare',
  'completed': 'Finalizat',
  'failed': 'Eșuat',
  'cancelled': 'Anulat'

}

