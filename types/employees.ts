/**
 * Employee Types
 * TypeScript interfaces and enums for employee management
 */

// ==================== ENUMS ====================

export enum ContractType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  TEMPORARY = 'temporary',
  INTERNSHIP = 'internship',
  CONTRACTOR = 'contractor',
  SEASONAL = 'seasonal'
}

export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  SUSPENDED = 'suspended',
  TERMINATED = 'terminated'
}

export enum Department {
  ADMINISTRATION = 'administration',
  PRODUCTION = 'production',
  MAINTENANCE = 'maintenance',
  WAREHOUSE = 'warehouse',
  SALES = 'sales',
  IT = 'it',
  HR = 'hr',
  FINANCE = 'finance',
  LOGISTICS = 'logistics',
  QUALITY_CONTROL = 'quality_control',
  SECURITY = 'security',
  OTHER = 'other'
}

// ==================== BASE INTERFACES ====================

/**
 * Core Employee interface - matches database schema
 */
export interface Employee {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  cnp: string | null; // CNP (Cod Numeric Personal) - Romanian personal ID
  position: string;
  department: Department;
  contractType: ContractType;
  status: EmployeeStatus;
  hireDate: string; // ISO date string
  terminationDate: string | null; // ISO date string
  workLocation: string | null;
  directManager: string | null;
  emergencyContact: string | null;
  emergencyPhone: string | null;
  notes: string | null;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  deletedAt: string | null; // ISO timestamp - soft delete
}

/**
 * Employee creation payload - required fields only
 */
export interface EmployeeCreate {
  organizationId: string;
  firstName: string;
  lastName: string;
  position: string;
  department: Department;
  contractType: ContractType;
  hireDate: string; // ISO date string
  email?: string | null;
  phone?: string | null;
  cnp?: string | null;
  status?: EmployeeStatus;
  workLocation?: string | null;
  directManager?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  notes?: string | null;
}

/**
 * Employee update payload - all fields optional
 */
export interface EmployeeUpdate {
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phone?: string | null;
  cnp?: string | null;
  position?: string;
  department?: Department;
  contractType?: ContractType;
  status?: EmployeeStatus;
  hireDate?: string;
  terminationDate?: string | null;
  workLocation?: string | null;
  directManager?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  notes?: string | null;
}

// ==================== FILTERS & QUERIES ====================

/**
 * Employee filters for search and filtering
 */
export interface EmployeeFilters {
  search?: string; // Search in firstName, lastName, email, position
  status?: EmployeeStatus | EmployeeStatus[];
  department?: Department | Department[];
  contractType?: ContractType | ContractType[];
  workLocation?: string;
  hiredAfter?: string; // ISO date string
  hiredBefore?: string; // ISO date string
  hasExpiredMedical?: boolean;
  hasExpiredTraining?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'firstName' | 'lastName' | 'hireDate' | 'department' | 'position';
  sortOrder?: 'asc' | 'desc';
}

// ==================== STATISTICS ====================

/**
 * Employee statistics aggregation
 */
export interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
  onLeave: number;
  suspended: number;
  terminated: number;
  byDepartment: Record<Department, number>;
  byContractType: Record<ContractType, number>;
  avgTenureDays: number;
  newHiresLast30Days: number;
  terminationsLast30Days: number;
  expiredMedicalCount: number;
  expiredTrainingCount: number;
  missingDocumentsCount: number;
}

// ==================== RELATIONS ====================

/**
 * Training record (simplified)
 */
export interface EmployeeTraining {
  id: string;
  employeeId: string;
  trainingType: string;
  trainingName: string;
  completedAt: string; // ISO date string
  expiresAt: string | null; // ISO date string
  certificateNumber: string | null;
  issuedBy: string | null;
  status: 'valid' | 'expired' | 'expiring_soon';
  createdAt: string;
}

/**
 * Medical record (simplified)
 */
export interface EmployeeMedicalRecord {
  id: string;
  employeeId: string;
  examType: string;
  examDate: string; // ISO date string
  expiresAt: string; // ISO date string
  result: 'apt' | 'apt_cu_restrictii' | 'inapt';
  restrictions: string | null;
  doctorName: string | null;
  clinicName: string | null;
  status: 'valid' | 'expired' | 'expiring_soon';
  createdAt: string;
}

/**
 * Equipment assignment (simplified)
 */
export interface EmployeeEquipment {
  id: string;
  employeeId: string;
  equipmentType: string;
  equipmentName: string;
  serialNumber: string | null;
  assignedAt: string; // ISO date string
  returnedAt: string | null; // ISO date string
  status: 'assigned' | 'returned' | 'damaged' | 'lost';
  condition: string | null;
  createdAt: string;
}

/**
 * Document reference (simplified)
 */
export interface EmployeeDocument {
  id: string;
  employeeId: string;
  documentType: string;
  documentName: string;
  uploadedAt: string; // ISO date string
  expiresAt: string | null; // ISO date string
  fileUrl: string | null;
  status: 'active' | 'expired' | 'pending';
  createdAt: string;
}

/**
 * Employee with related data
 */
export interface EmployeeWithRelations extends Employee {
  trainings?: EmployeeTraining[];
  medicalRecords?: EmployeeMedicalRecord[];
  equipment?: EmployeeEquipment[];
  documents?: EmployeeDocument[];
  organization?: {
    id: string;
    name: string;
    cui: string;
  };
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
  };
}

// ==================== UTILITY TYPES ====================

/**
 * Employee list item - lightweight for tables/lists
 */
export interface EmployeeListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  position: string;
  department: Department;
  status: EmployeeStatus;
  hireDate: string;
  hasExpiredMedical: boolean;
  hasExpiredTraining: boolean;
}

/**
 * Employee summary - for dashboards and quick views
 */
export interface EmployeeSummary {
  id: string;
  fullName: string;
  position: string;
  department: Department;
  status: EmployeeStatus;
  trainingsCount: number;
  medicalRecordsCount: number;
  equipmentCount: number;
  alerts: Array<{
    type: 'medical_expired' | 'training_expired' | 'document_missing';
    message: string;
  }>;
}

// ==================== EXPORT ALL ====================

export type {
  Employee,
  EmployeeCreate,
  EmployeeUpdate,
  EmployeeFilters,
  EmployeeStats,
  EmployeeWithRelations,
  EmployeeTraining,
  EmployeeMedicalRecord,
  EmployeeEquipment,
  EmployeeDocument,
  EmployeeListItem,
  EmployeeSummary
};
