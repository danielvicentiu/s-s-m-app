/**
 * Training Types and Interfaces
 * Tipuri și interfețe pentru modulul de instruiri SSM/PSI
 */

// Training Type Enum - Tipuri de instruire conform legislației SSM/PSI
export enum TrainingType {
  INTRODUCTIV_GENERAL = 'introductiv_general',
  INTRODUCTIV_LOC = 'introductiv_loc',
  PERIODIC = 'periodic',
  SUPLIMENTAR = 'suplimentar',
  PSI = 'psi',
  PRIM_AJUTOR = 'prim_ajutor',
}

// Training Status Enum - Statusuri bazate pe validitate
export enum TrainingStatus {
  VALID = 'valid',
  EXPIRING = 'expiring',
  EXPIRED = 'expired',
}

// Main Training Interface
export interface Training {
  id: string;
  employee_id: string;
  organization_id: string;
  training_type: TrainingType;
  training_date: string; // ISO date string
  expiry_date: string | null; // ISO date string, null for non-expiring trainings
  instructor_name: string;
  instructor_license: string | null;
  duration_hours: number;
  topics_covered: string[];
  attendance_confirmed: boolean;
  certificate_number: string | null;
  notes: string | null;
  document_url: string | null; // URL to certificate/document in storage
  created_at: string;
  updated_at: string;
  deleted_at: string | null; // Soft delete
}

// Training Create Interface - pentru crearea unei noi instruiri
export interface TrainingCreate {
  employee_id: string;
  organization_id: string;
  training_type: TrainingType;
  training_date: string;
  expiry_date?: string | null;
  instructor_name: string;
  instructor_license?: string | null;
  duration_hours: number;
  topics_covered: string[];
  attendance_confirmed?: boolean;
  certificate_number?: string | null;
  notes?: string | null;
  document_url?: string | null;
}

// Training Update Interface - pentru actualizarea unei instruiri existente
export interface TrainingUpdate {
  training_type?: TrainingType;
  training_date?: string;
  expiry_date?: string | null;
  instructor_name?: string;
  instructor_license?: string | null;
  duration_hours?: number;
  topics_covered?: string[];
  attendance_confirmed?: boolean;
  certificate_number?: string | null;
  notes?: string | null;
  document_url?: string | null;
}

// Training with Employee Details - pentru afișare cu detalii angajat
export interface TrainingWithEmployee extends Training {
  employee?: {
    id: string;
    first_name: string;
    last_name: string;
    cnp: string;
    email: string | null;
    position: string | null;
    department: string | null;
  };
}

// Training Filters - pentru filtrare și căutare
export interface TrainingFilters {
  employee_id?: string;
  organization_id?: string;
  training_type?: TrainingType | TrainingType[];
  status?: TrainingStatus | TrainingStatus[];
  date_from?: string; // ISO date string
  date_to?: string; // ISO date string
  expiring_within_days?: number; // Ex: 30 pentru instruiri care expiră în 30 zile
  search?: string; // Search în instructor_name, certificate_number, notes
  include_deleted?: boolean;
}

// Training Statistics - pentru dashboard și rapoarte
export interface TrainingStats {
  total: number;
  by_type: Record<TrainingType, number>;
  by_status: Record<TrainingStatus, number>;
  expiring_soon: number; // Expiră în următoarele 30 zile
  expired: number;
  valid: number;
  compliance_rate: number; // Procent angajați cu instruiri valide
  avg_duration_hours: number;
  last_updated: string;
}

// Training Compliance Check - pentru verificare conformitate
export interface TrainingComplianceCheck {
  employee_id: string;
  is_compliant: boolean;
  missing_trainings: TrainingType[];
  expiring_trainings: Array<{
    training_id: string;
    training_type: TrainingType;
    expiry_date: string;
    days_until_expiry: number;
  }>;
  expired_trainings: Array<{
    training_id: string;
    training_type: TrainingType;
    expiry_date: string;
    days_since_expiry: number;
  }>;
}

// Training Reminder - pentru sistem de alertă
export interface TrainingReminder {
  id: string;
  training_id: string;
  employee_id: string;
  organization_id: string;
  reminder_type: 'expiring' | 'expired' | 'missing';
  days_before_expiry: number;
  sent_at: string | null;
  acknowledged_at: string | null;
  created_at: string;
}

// Training Validation Rules - pentru validare conform legislației
export interface TrainingValidationRules {
  training_type: TrainingType;
  is_mandatory: boolean;
  validity_period_months: number | null; // null = nu expiră
  min_duration_hours: number;
  requires_license: boolean; // Instructor trebuie să aibă licență
  frequency_months: number | null; // Pentru instruiri periodice
}

// Helper type pentru mapare training type → label română
export const TrainingTypeLabels: Record<TrainingType, string> = {
  [TrainingType.INTRODUCTIV_GENERAL]: 'Instruire Introductivă-Generală',
  [TrainingType.INTRODUCTIV_LOC]: 'Instruire Introductivă la Locul de Muncă',
  [TrainingType.PERIODIC]: 'Instruire Periodică',
  [TrainingType.SUPLIMENTAR]: 'Instruire Suplimentară',
  [TrainingType.PSI]: 'Instruire PSI (Prevenire și Stingere Incendii)',
  [TrainingType.PRIM_AJUTOR]: 'Instruire Prim Ajutor',
};

// Helper type pentru mapare status → label română
export const TrainingStatusLabels: Record<TrainingStatus, string> = {
  [TrainingStatus.VALID]: 'Valabil',
  [TrainingStatus.EXPIRING]: 'Expiră Curând',
  [TrainingStatus.EXPIRED]: 'Expirat',
};

// Helper type pentru culori status badges
export const TrainingStatusColors: Record<
  TrainingStatus,
  'success' | 'warning' | 'error'
> = {
  [TrainingStatus.VALID]: 'success',
  [TrainingStatus.EXPIRING]: 'warning',
  [TrainingStatus.EXPIRED]: 'error',
};
