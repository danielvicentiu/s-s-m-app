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
