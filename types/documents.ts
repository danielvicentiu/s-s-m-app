/**
 * Document Management Types
 *
 * TypeScript interfaces and enums for document handling in the SSM/PSI platform.
 * Covers document lifecycle, categorization, templates, and filtering.
 */

/**
 * Document Categories
 * Categorizes documents by their primary compliance or business domain
 */
export enum DocumentCategory {
  SSM = 'ssm',           // Securitate și Sănătate în Muncă
  PSI = 'psi',           // Prevenire și Stingere Incendii
  GDPR = 'gdpr',         // General Data Protection Regulation
  INTERN = 'intern',     // Internal company documents
  MEDICAL = 'medical',   // Medical records and documentation
  LEGAL = 'legal'        // Legal documents and contracts
}

/**
 * Document Status
 * Tracks the lifecycle state of a document
 */
export enum DocumentStatus {
  DRAFT = 'draft',         // Document in draft state, not yet finalized
  ACTIVE = 'active',       // Active document in use
  EXPIRED = 'expired',     // Document has expired and needs renewal
  ARCHIVED = 'archived'    // Document archived for historical purposes
}

/**
 * File Type
 * Supported file formats for document storage
 */
export enum FileType {
  PDF = 'pdf',
  DOCX = 'docx',
  DOC = 'doc',
  XLSX = 'xlsx',
  XLS = 'xls',
  PNG = 'png',
  JPG = 'jpg',
  JPEG = 'jpeg',
  TXT = 'txt',
  CSV = 'csv'
}

/**
 * Document Interface
 * Main document entity with full metadata
 */
export interface Document {
  id: string;
  organizationId: string;
  category: DocumentCategory;
  status: DocumentStatus;

  // Document metadata
  title: string;
  description?: string;
  fileType: FileType;
  fileUrl: string;
  fileName: string;
  fileSize?: number; // in bytes

  // Version control
  version?: string;
  isTemplate?: boolean;
  templateId?: string; // Reference to template if generated from one

  // Date tracking
  issueDate?: Date | string;
  expiryDate?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string; // Soft delete

  // Relations
  createdBy: string; // User ID
  assignedTo?: string; // User ID or employee ID
  employeeId?: string; // If document is specific to an employee

  // Additional metadata
  tags?: string[];
  metadata?: Record<string, any>; // Flexible metadata storage

  // Audit
  lastModifiedBy?: string;
  approvedBy?: string;
  approvedAt?: Date | string;
}

/**
 * Document Create Interface
 * Payload for creating a new document (omits system-generated fields)
 */
export interface DocumentCreate {
  organizationId: string;
  category: DocumentCategory;
  status?: DocumentStatus; // Defaults to DRAFT

  // Document metadata
  title: string;
  description?: string;
  fileType: FileType;
  fileUrl: string;
  fileName: string;
  fileSize?: number;

  // Version control
  version?: string;
  isTemplate?: boolean;
  templateId?: string;

  // Date tracking
  issueDate?: Date | string;
  expiryDate?: Date | string;

  // Relations
  createdBy: string;
  assignedTo?: string;
  employeeId?: string;

  // Additional metadata
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Document Filters Interface
 * Filter criteria for document queries
 */
export interface DocumentFilters {
  // Basic filters
  organizationId?: string;
  category?: DocumentCategory | DocumentCategory[];
  status?: DocumentStatus | DocumentStatus[];

  // Search
  searchTerm?: string; // Searches in title, description, tags

  // Relations
  createdBy?: string;
  assignedTo?: string;
  employeeId?: string;

  // Date filters
  createdAfter?: Date | string;
  createdBefore?: Date | string;
  expiryAfter?: Date | string;
  expiryBefore?: Date | string;
  isExpired?: boolean; // Filter for expired documents
  expiresWithinDays?: number; // Documents expiring within X days

  // Type filters
  fileType?: FileType | FileType[];
  isTemplate?: boolean;
  templateId?: string;

  // Tags
  tags?: string[]; // Filter by one or more tags

  // Soft delete
  includeDeleted?: boolean;

  // Pagination
  limit?: number;
  offset?: number;

  // Sorting
  sortBy?: 'createdAt' | 'updatedAt' | 'expiryDate' | 'title' | 'fileSize';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Document Template Interface
 * Template for generating standardized documents
 */
export interface DocumentTemplate {
  id: string;
  organizationId?: string; // If null, it's a global/system template

  // Template metadata
  name: string;
  description?: string;
  category: DocumentCategory;

  // Template content
  fileUrl?: string; // Template file URL
  fileName?: string;
  fileType?: FileType;

  // Template structure
  fields?: DocumentTemplateField[]; // Dynamic fields for the template
  defaultMetadata?: Record<string, any>;

  // Configuration
  isActive: boolean;
  isGlobal: boolean; // System-wide template vs organization-specific

  // Validation rules
  requiredFields?: string[];
  validationRules?: Record<string, any>;

  // Auto-expiry settings
  defaultExpiryDays?: number; // Auto-set expiry date X days from issue

  // Date tracking
  createdAt: Date | string;
  updatedAt: Date | string;
  createdBy: string;

  // Usage tracking
  usageCount?: number;
  lastUsedAt?: Date | string;
}

/**
 * Document Template Field Interface
 * Defines dynamic fields within a document template
 */
export interface DocumentTemplateField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean' | 'textarea';
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  options?: string[]; // For select/multiselect types
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  order?: number; // Display order
}

/**
 * Document Upload Response Interface
 * Response from file upload operation
 */
export interface DocumentUploadResponse {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

/**
 * Document Statistics Interface
 * Aggregated statistics for document management
 */
export interface DocumentStatistics {
  total: number;
  byCategory: Record<DocumentCategory, number>;
  byStatus: Record<DocumentStatus, number>;
  expiringSoon: number; // Count of documents expiring within 30 days
  expired: number;
  totalFileSize: number; // Total storage in bytes
}
