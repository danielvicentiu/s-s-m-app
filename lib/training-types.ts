// ============================================================
// S-S-M.RO — Training Module Types
// File: lib/training-types.ts
// ============================================================

// ============================================================
// DATABASE TABLE TYPES
// ============================================================

export interface TrainingModule {
  id: string;
  code: string;
  title: string;
  description: string | null;
  category: TrainingCategory;
  training_type: TrainingType;
  legal_basis: string[];
  duration_minutes_required: number;
  periodicity_months: number | null;
  is_mandatory: boolean;
  is_active: boolean;
  min_test_questions: number;
  min_pass_score: number;
  content_json: Record<string, any> | null;
  available_languages: string[];
  applicable_risk_categories: string[];
  created_at: string;
  updated_at: string;
}

export interface TrainingAssignment {
  id: string;
  organization_id: string;
  worker_id: string;
  module_id: string;
  assigned_by: string;
  assigned_at: string;
  due_date: string | null;
  status: AssignmentStatus;
  completed_at: string | null;
  session_id: string | null;
  next_due_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrainingSession {
  id: string;
  organization_id: string;
  module_id: string;
  worker_id: string;
  instructor_name: string;
  session_date: string;
  duration_minutes: number;
  language: string;
  location: string | null;
  test_score: number | null;
  test_questions_total: number | null;
  test_questions_correct: number | null;
  verification_result: VerificationResult;
  fisa_document_id: string | null;
  fisa_generated_at: string | null;
  quickvalid_timestamp: string | null;
  quickvalid_confidence: number | null;
  quickvalid_photo_url: string | null;
  audit_trail: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface TestQuestion {
  id: string;
  module_id: string;
  question_text: string;
  question_text_translations: Record<string, string>;
  question_type: 'single_choice' | 'multiple_choice' | 'true_false';
  options: string[];
  correct_answer: string;
  explanation: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  legal_reference: string | null;
  is_active: boolean;
  created_at: string;
}

// ============================================================
// ENUMS
// ============================================================

export type TrainingCategory = 'ssm' | 'psi' | 'su' | 'nis2' | 'custom';
export type TrainingType =
  | 'introductiv_general'
  | 'la_locul_de_munca'
  | 'periodic'
  | 'suplimentar'
  | 'psi'
  | 'situatii_urgenta'
  | 'custom';
export type AssignmentStatus =
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'overdue'
  | 'expired'
  | 'exempted';
export type VerificationResult = 'pending' | 'admis' | 'respins';

// ============================================================
// VIEW / COMPUTED TYPES
// ============================================================

export interface TrainingDashboardRow {
  assignment_id: string;
  organization_id: string;
  worker_id: string;
  worker_name: string;
  module_id: string;
  module_code: string;
  module_title: string;
  category: TrainingCategory;
  training_type: TrainingType;
  is_mandatory: boolean;
  status: AssignmentStatus;
  due_date: string | null;
  completed_at: string | null;
  session_id: string | null;
  session_date: string | null;
  instructor_name: string | null;
  test_score: number | null;
  verification_result: VerificationResult | null;
  duration_minutes: number | null;
  next_due_date: string | null;
  days_until_due: number | null;
  alert_type: 'DEPĂȘIT' | 'URGENT' | 'REÎNNOIRE' | null;
}

export interface TrainingStats {
  total_assigned: number;
  completed: number;
  in_progress: number;
  overdue: number;
  completion_rate: number;
  avg_test_score: number;
  upcoming_due: number;
}

export interface WorkerTrainingStatus {
  worker_id: string;
  worker_name: string;
  total_required: number;
  completed: number;
  overdue: number;
  compliance_percentage: number;
  next_due: string | null;
  last_training_date: string | null;
}

// ============================================================
// API PAYLOADS
// ============================================================

export interface AssignTrainingPayload {
  organization_id: string;
  module_id: string;
  worker_ids: string[];
  assigned_by: string;
  due_date?: string;
}

export interface RecordSessionPayload {
  organization_id: string;
  module_id: string;
  worker_id: string;
  instructor_name: string;
  session_date: string;
  duration_minutes: number;
  language?: string;
  location?: string;
  test_score?: number;
  test_questions_total?: number;
  test_questions_correct?: number;
}

// ============================================================
// VISUAL CONFIGS (for UI)
// ============================================================

export const STATUS_CONFIG: Record<AssignmentStatus, { label: string; color: string; bgColor: string }> = {
  assigned: { label: 'Atribuit', color: '#3B82F6', bgColor: '#1E3A5F' },
  in_progress: { label: 'În Curs', color: '#F59E0B', bgColor: '#422006' },
  completed: { label: 'Completat', color: '#10B981', bgColor: '#064E3B' },
  overdue: { label: 'Depășit', color: '#EF4444', bgColor: '#450A0A' },
  expired: { label: 'Expirat', color: '#6B7280', bgColor: '#1F2937' },
  exempted: { label: 'Exceptat', color: '#8B5CF6', bgColor: '#2E1065' },
};

export const CATEGORY_CONFIG: Record<TrainingCategory, { label: string; color: string }> = {
  ssm: { label: 'SSM', color: '#3B82F6' },
  psi: { label: 'PSI', color: '#EF4444' },
  su: { label: 'SU', color: '#F59E0B' },
  nis2: { label: 'NIS2', color: '#8B5CF6' },
  custom: { label: 'Custom', color: '#6B7280' },
};

export const VERIFICATION_CONFIG: Record<VerificationResult, { label: string; color: string }> = {
  pending: { label: 'În Așteptare', color: '#F59E0B' },
  admis: { label: 'ADMIS', color: '#10B981' },
  respins: { label: 'RESPINS', color: '#EF4444' },
};
