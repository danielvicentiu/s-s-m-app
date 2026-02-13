/**
 * Medical Examination Types
 * Tipuri pentru gestionarea examinarilor medicale SSM
 */

/**
 * Tipuri de examinari medicale
 */
export enum ExamType {
  ANGAJARE = 'angajare',
  PERIODIC = 'periodic',
  RELUARE = 'reluare',
  SPECIAL = 'special'
}

/**
 * Rezultate posibile ale examinarii medicale
 */
export enum ExamResult {
  APT = 'apt',
  APT_CONDITIONAT = 'apt_conditionat',
  INAPT = 'inapt',
  AMANAT = 'amanat'
}

/**
 * Examinare medicala completa (din baza de date)
 */
export interface MedicalExam {
  id: string;
  employeeId: string;
  organizationId: string;
  examType: ExamType;
  examDate: string;
  expiryDate: string | null;
  result: ExamResult;
  restrictions: string | null;
  notes: string | null;
  documentUrl: string | null;
  medicalCenter: string | null;
  doctorName: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
}

/**
 * Date pentru crearea unei examinari medicale noi
 */
export interface MedicalExamCreate {
  employeeId: string;
  organizationId: string;
  examType: ExamType;
  examDate: string;
  expiryDate?: string | null;
  result: ExamResult;
  restrictions?: string | null;
  notes?: string | null;
  documentUrl?: string | null;
  medicalCenter?: string | null;
  doctorName?: string | null;
}

/**
 * Filtre pentru interogarea examinarilor medicale
 */
export interface MedicalFilters {
  organizationId?: string;
  employeeId?: string;
  examType?: ExamType | ExamType[];
  result?: ExamResult | ExamResult[];
  startDate?: string;
  endDate?: string;
  isExpired?: boolean;
  expiresInDays?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Statistici agregare pentru examinari medicale
 */
export interface MedicalStats {
  total: number;
  byExamType: {
    [ExamType.ANGAJARE]: number;
    [ExamType.PERIODIC]: number;
    [ExamType.RELUARE]: number;
    [ExamType.SPECIAL]: number;
  };
  byResult: {
    [ExamResult.APT]: number;
    [ExamResult.APT_CONDITIONAT]: number;
    [ExamResult.INAPT]: number;
    [ExamResult.AMANAT]: number;
  };
  expired: number;
  expiringInMonth: number;
  expiringInWeek: number;
  withRestrictions: number;
}
