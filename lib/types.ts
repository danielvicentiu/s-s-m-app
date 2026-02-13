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

export interface SafetySignage {
  id: string
  organization_id: string
  sign_type: 'interdictie' | 'avertizare' | 'obligatie' | 'salvare' | 'psi'
  sign_name: string
  location: string
  quantity: number
  condition: 'bun' | 'deteriorat' | 'lipsa'
  installation_date: string | null
  last_inspection_date: string | null
  next_inspection_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type IncidentStatus = 'nou' | 'in_investigare' | 'rezolvat' | 'respins'
export type IncidentSeverity = 'minor' | 'moderat' | 'grav' | 'critic'

export interface Incident {
  id: string
  organization_id: string
  incident_date: string
  location: string
  description: string
  victim_name: string | null
  witness_name: string | null
  severity: IncidentSeverity
  status: IncidentStatus
  reported_by: string
  reported_at: string
  investigation_notes: string | null
  resolution_notes: string | null
  resolved_by: string | null
  resolved_at: string | null
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

// ── COMITET SSM ──

export type CssmMemberRole = 'presedinte' | 'membru' | 'secretar'
export type CssmMeetingStatus = 'planificata' | 'finalizata' | 'anulata'
export type CssmDecisionStatus = 'propusa' | 'aprobata' | 'respinsa' | 'in_implementare' | 'implementata'

export interface CssmMember {
  id: string
  organization_id: string
  employee_name: string
  role: CssmMemberRole
  department: string | null
  appointed_date: string
  mandate_end_date: string | null
  is_active: boolean
  phone: string | null
  email: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface CssmMeeting {
  id: string
  organization_id: string
  meeting_date: string
  location: string
  status: CssmMeetingStatus
  agenda: string | null
  attendees: string[] | null
  minutes_summary: string | null
  decisions_count: number
  protocol_number: string | null
  protocol_file_url: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface CssmDecision {
  id: string
  organization_id: string
  meeting_id: string | null
  decision_number: string
  decision_date: string
  title: string
  description: string
  status: CssmDecisionStatus
  responsible_person: string | null
  deadline: string | null
  implementation_date: string | null
  implementation_notes: string | null
  created_at: string
  updated_at: string
}

// ── LUCRĂTORI DESEMNAȚI SSM ──

export interface DesignatedWorker {
  id: string
  organization_id: string
  employee_name: string
  job_title: string | null
  designation_date: string
  certificate_number: string | null
  certificate_expiry_date: string | null
  certificate_authority: string | null
  responsibilities: string | null
  is_active: boolean
  notes: string | null
  created_at: string
  updated_at: string
  // Relație
  organizations?: { name: string; cui: string }
}
