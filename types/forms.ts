/**
 * Form Type Definitions
 * Interfețe TypeScript pentru sistemul de formulare din platformă
 */

// ============================================================================
// Base Form Types
// ============================================================================

/**
 * Tipuri de validare disponibile pentru câmpuri
 */
export type ValidationRuleType =
  | 'required'
  | 'email'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'min'
  | 'max'
  | 'custom';

/**
 * Regulă de validare pentru un câmp de formular
 */
export interface ValidationRule {
  type: ValidationRuleType;
  value?: string | number | RegExp;
  message: string;
}

/**
 * Opțiune pentru câmpuri de tip select/radio/checkbox
 */
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  description?: string;
}

/**
 * Tipuri de câmpuri de formular suportate
 */
export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'date'
  | 'datetime-local'
  | 'time'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'switch'
  | 'hidden';

/**
 * Definiție câmp de formular
 */
export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  validation?: ValidationRule[];
  placeholder?: string;
  defaultValue?: any;
  options?: SelectOption[];
  disabled?: boolean;
  helpText?: string;
  accept?: string; // pentru type='file'
  multiple?: boolean; // pentru file/select
  rows?: number; // pentru textarea
  min?: number | string; // pentru number/date
  max?: number | string; // pentru number/date
  step?: number; // pentru number
  pattern?: string; // pentru text/tel
  autoComplete?: string;
  className?: string;
  dependsOn?: string; // numele câmpului de care depinde
  showWhen?: (formData: any) => boolean; // condiție de afișare
}

/**
 * Pas într-un formular multi-step
 */
export interface FormStep {
  title: string;
  fields: FormField[];
  description?: string;
  icon?: string;
  optional?: boolean;
  validationSchema?: any; // pentru Zod/Yup schema
}

// ============================================================================
// Employee Form Types
// ============================================================================

/**
 * Date formular adăugare/editare angajat
 */
export interface EmployeeFormData {
  // Informații personale
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  cnp?: string; // Cod Numeric Personal
  birthDate?: string;
  gender?: 'M' | 'F' | 'other';

  // Informații profesionale
  position: string;
  department?: string;
  employmentType?: 'full_time' | 'part_time' | 'contract' | 'intern';
  startDate: string;
  endDate?: string;
  workSchedule?: string;

  // Contact și locație
  address?: string;
  city?: string;
  county?: string;
  postalCode?: string;
  emergencyContact?: string;
  emergencyPhone?: string;

  // SSM/PSI specifice
  riskLevel?: 'low' | 'medium' | 'high';
  requiresMedicalExam?: boolean;
  requiresSSMTraining?: boolean;
  requiresPSITraining?: boolean;

  // Status
  status?: 'active' | 'inactive' | 'suspended';
  notes?: string;

  // Relații
  organizationId: string;
  managerId?: string;
}

// ============================================================================
// Training Form Types
// ============================================================================

/**
 * Date formular instruire SSM/PSI
 */
export interface TrainingFormData {
  // Informații generale
  title: string;
  type: 'ssm' | 'psi' | 'combined' | 'specific' | 'periodic';
  category?: string;
  description?: string;

  // Detalii instruire
  trainingDate: string;
  duration?: number; // în ore
  location?: string;
  trainerName?: string;
  trainerQualification?: string;

  // Participanți
  employeeIds: string[];
  organizationId: string;

  // Conținut
  topics?: string[];
  materials?: string[];
  evaluationMethod?: 'test' | 'practical' | 'observation' | 'none';

  // Rezultate
  passed?: boolean;
  score?: number;
  certificateNumber?: string;
  certificateIssueDate?: string;
  certificateExpiryDate?: string;

  // Periodicitate
  isRecurring?: boolean;
  recurringInterval?: number; // în luni
  nextTrainingDate?: string;

  // Documente
  documents?: File[];
  documentUrls?: string[];

  // Status și note
  status?: 'scheduled' | 'completed' | 'cancelled' | 'postponed';
  notes?: string;

  // Compliance
  legislationReference?: string;
  mandatoryByLaw?: boolean;
}

// ============================================================================
// Medical Record Form Types
// ============================================================================

/**
 * Date formular control medical
 */
export interface MedicalFormData {
  // Referință angajat
  employeeId: string;
  organizationId: string;

  // Informații examen
  examType: 'initial' | 'periodic' | 'reintegration' | 'change_position' | 'at_request';
  examDate: string;
  nextExamDate?: string;
  medicalFacility?: string;
  doctorName?: string;

  // Rezultate
  aptitude: 'apt' | 'apt_with_recommendations' | 'temporarily_unfit' | 'permanently_unfit';
  restrictions?: string[];
  recommendations?: string[];
  diagnosis?: string; // confidențial, doar pentru medic

  // Măsurători
  bloodPressure?: string;
  heartRate?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  visualAcuity?: string;
  hearingTest?: string;

  // Analize și investigații
  bloodTests?: boolean;
  urineTests?: boolean;
  xRay?: boolean;
  ecg?: boolean;
  spirometry?: boolean;
  audiometry?: boolean;
  otherTests?: string[];

  // Vaccinări
  vaccinations?: {
    type: string;
    date: string;
    nextDue?: string;
  }[];

  // Avize și documente
  certificateNumber?: string;
  certificateIssueDate?: string;
  certificateExpiryDate?: string;

  // Documente atașate
  documents?: File[];
  documentUrls?: string[];

  // Risc ocupațional
  exposureToRisks?: string[];
  riskAssessmentId?: string;

  // Note și observații
  notes?: string;
  confidentialNotes?: string; // doar pentru medical/admin

  // Status
  status?: 'scheduled' | 'completed' | 'cancelled' | 'expired';

  // Compliance
  mandatoryByLaw?: boolean;
  legislationReference?: string;
}

// ============================================================================
// Additional Form Types
// ============================================================================

/**
 * Date formular echipament de protecție
 */
export interface EquipmentFormData {
  name: string;
  type: string;
  category?: string;
  description?: string;
  quantity: number;
  unit?: string;
  assignedToEmployeeId?: string;
  assignedDate?: string;
  returnDate?: string;
  status?: 'available' | 'assigned' | 'maintenance' | 'retired';
  organizationId: string;
  serialNumber?: string;
  manufacturer?: string;
  purchaseDate?: string;
  expiryDate?: string;
  certificationNumber?: string;
  notes?: string;
}

/**
 * Date formular document
 */
export interface DocumentFormData {
  title: string;
  type: string;
  category?: string;
  description?: string;
  file?: File;
  fileUrl?: string;
  organizationId: string;
  relatedToEmployeeId?: string;
  relatedToEquipmentId?: string;
  issueDate?: string;
  expiryDate?: string;
  documentNumber?: string;
  issuedBy?: string;
  status?: 'active' | 'expired' | 'archived';
  tags?: string[];
  notes?: string;
}

/**
 * Date formular alertă/notificare
 */
export interface AlertFormData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  targetUsers?: string[];
  targetRoles?: string[];
  organizationId?: string;
  scheduledFor?: string;
  expiresAt?: string;
  actionUrl?: string;
  actionLabel?: string;
  dismissible?: boolean;
  persistent?: boolean;
}

// ============================================================================
// Form State & Validation
// ============================================================================

/**
 * Stare formular
 */
export interface FormState<T = any> {
  data: Partial<T>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

/**
 * Rezultat validare
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Configurație formular
 */
export interface FormConfig {
  onSubmit: (data: any) => Promise<void> | void;
  onCancel?: () => void;
  onValidate?: (data: any) => ValidationResult | Promise<ValidationResult>;
  submitLabel?: string;
  cancelLabel?: string;
  resetOnSubmit?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}
