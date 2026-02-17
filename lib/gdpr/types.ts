// GDPR Module Types
// Created: 2026-02-17

export type LegalBasis =
  | 'consent'
  | 'contract'
  | 'legal_obligation'
  | 'vital_interest'
  | 'public_interest'
  | 'legitimate_interest';

export type ProcessingActivityStatus = 'active' | 'inactive' | 'under_review' | 'archived';

export type ConsentType =
  | 'processing'
  | 'marketing'
  | 'profiling'
  | 'transfer'
  | 'special_categories'
  | 'other';

export interface ProcessingActivity {
  id: string;
  organization_id: string;
  activity_name: string;
  purpose: string;
  legal_basis: LegalBasis;
  data_categories: string[];
  data_subjects: string[];
  recipients: string[];
  retention_period?: string;
  cross_border_transfer: boolean;
  transfer_safeguards?: string;
  technical_measures: string[];
  organizational_measures: string[];
  dpia_required: boolean;
  dpia_completed: boolean;
  dpia_date?: string;
  status: ProcessingActivityStatus;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Consent {
  id: string;
  organization_id: string;
  person_name: string;
  person_email?: string;
  person_cnp_hash?: string;
  consent_type: ConsentType;
  purpose: string;
  given_at: string;
  withdrawn_at?: string;
  is_active: boolean;
  evidence_path?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
}

export interface DPO {
  id: string;
  organization_id: string;
  dpo_name: string;
  dpo_email?: string;
  dpo_phone?: string;
  is_internal: boolean;
  company_name?: string;
  appointment_date?: string;
  contract_expiry?: string;
  anspdcp_notified: boolean;
  anspdcp_notification_date?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}
