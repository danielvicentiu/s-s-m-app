// types/equipment.ts
// TypeScript interfaces and enums for equipment management module

/**
 * Equipment categories based on Romanian compliance requirements
 */
export enum EquipmentCategory {
  EIP = 'EIP', // Echipamente Individuale de Protecție (Personal Protective Equipment)
  ISCIR = 'ISCIR', // Instalații Sub Controlul ISCIR (Pressure vessels, lifts, etc.)
  UTILAJ = 'utilaj', // Utilaje/Mașini (Machinery)
  INSTRUMENT = 'instrument', // Instrumente de măsură (Measuring instruments)
}

/**
 * Equipment operational status
 */
export enum EquipmentStatus {
  ACTIVE = 'active', // În uz activ
  MAINTENANCE = 'maintenance', // În mentenanță/service
  RETIRED = 'retired', // Scos din uz/retras
}

/**
 * Inspection status for compliance tracking
 */
export enum InspectionStatus {
  CURRENT = 'current', // La zi cu inspecțiile
  DUE_SOON = 'due_soon', // Expiră în următoarele 30 zile
  OVERDUE = 'overdue', // Expirat - necesită inspecție urgentă
  NOT_REQUIRED = 'not_required', // Nu necesită inspecție periodică
}

/**
 * Main Equipment interface
 * Represents a single piece of equipment tracked in the system
 */
export interface Equipment {
  id: string;
  organization_id: string;
  employee_id?: string | null; // Assignment to specific employee (optional)

  // Basic information
  name: string;
  category: EquipmentCategory;
  manufacturer?: string | null;
  model?: string | null;
  serial_number?: string | null;
  inventory_code?: string | null; // Internal tracking code

  // Status and compliance
  status: EquipmentStatus;
  inspection_status: InspectionStatus;

  // Dates
  purchase_date?: string | null; // ISO date string
  installation_date?: string | null; // ISO date string
  last_inspection_date?: string | null; // ISO date string
  next_inspection_date?: string | null; // ISO date string
  retirement_date?: string | null; // ISO date string (for retired equipment)

  // Compliance and certification
  certificate_number?: string | null;
  certification_body?: string | null; // e.g., "ISCIR", "Organisme notificat"

  // Additional details
  location?: string | null; // Physical location/department
  notes?: string | null;

  // Metadata
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  deleted_at?: string | null; // Soft delete timestamp
}

/**
 * Interface for creating new equipment
 * Omits auto-generated fields
 */
export interface EquipmentCreate {
  organization_id: string;
  employee_id?: string | null;

  // Required fields
  name: string;
  category: EquipmentCategory;

  // Optional fields
  manufacturer?: string | null;
  model?: string | null;
  serial_number?: string | null;
  inventory_code?: string | null;
  status?: EquipmentStatus; // Defaults to 'active'

  // Dates
  purchase_date?: string | null;
  installation_date?: string | null;
  last_inspection_date?: string | null;
  next_inspection_date?: string | null;

  // Compliance
  certificate_number?: string | null;
  certification_body?: string | null;

  // Additional
  location?: string | null;
  notes?: string | null;
}

/**
 * Interface for updating existing equipment
 * All fields optional except id
 */
export interface EquipmentUpdate {
  id: string;
  employee_id?: string | null;

  name?: string;
  category?: EquipmentCategory;
  manufacturer?: string | null;
  model?: string | null;
  serial_number?: string | null;
  inventory_code?: string | null;
  status?: EquipmentStatus;

  purchase_date?: string | null;
  installation_date?: string | null;
  last_inspection_date?: string | null;
  next_inspection_date?: string | null;
  retirement_date?: string | null;

  certificate_number?: string | null;
  certification_body?: string | null;

  location?: string | null;
  notes?: string | null;
}

/**
 * Filters for equipment queries
 */
export interface EquipmentFilters {
  organization_id?: string;
  employee_id?: string | null;
  category?: EquipmentCategory | EquipmentCategory[];
  status?: EquipmentStatus | EquipmentStatus[];
  inspection_status?: InspectionStatus | InspectionStatus[];
  location?: string;
  search?: string; // Search in name, model, serial_number, inventory_code

  // Date range filters
  purchase_date_from?: string;
  purchase_date_to?: string;
  next_inspection_from?: string;
  next_inspection_to?: string;

  // Pagination
  limit?: number;
  offset?: number;
  sort_by?: 'name' | 'category' | 'status' | 'next_inspection_date' | 'created_at';
  sort_order?: 'asc' | 'desc';

  // Soft delete filter
  include_deleted?: boolean;
}

/**
 * Statistics for equipment overview
 */
export interface EquipmentStats {
  total_count: number;

  // By status
  active_count: number;
  maintenance_count: number;
  retired_count: number;

  // By category
  eip_count: number;
  iscir_count: number;
  utilaj_count: number;
  instrument_count: number;

  // By inspection status
  current_inspections: number;
  due_soon_inspections: number;
  overdue_inspections: number;

  // Assigned vs unassigned
  assigned_count: number;
  unassigned_count: number;
}

/**
 * Equipment with related employee information
 */
export interface EquipmentWithEmployee extends Equipment {
  employee?: {
    id: string;
    first_name: string;
    last_name: string;
    employee_code?: string | null;
    department?: string | null;
  } | null;
}

/**
 * Equipment inspection record (for future use)
 */
export interface EquipmentInspection {
  id: string;
  equipment_id: string;
  organization_id: string;

  inspection_date: string; // ISO date string
  inspector_name?: string | null;
  certification_body?: string | null;

  result: 'passed' | 'failed' | 'conditional';
  certificate_number?: string | null;
  next_inspection_date?: string | null;

  findings?: string | null; // Issues found during inspection
  notes?: string | null;

  created_at: string;
  updated_at: string;
}
