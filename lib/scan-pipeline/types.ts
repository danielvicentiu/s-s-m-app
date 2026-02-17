/**
 * Scan Pipeline Types
 * Type definitions for Universal Document Scan Pipeline
 */

export interface TemplateField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'select' | 'cnp' | 'cui';
  validation?: string;
  options?: string[];
}

export interface ScanTemplate {
  id: string;
  template_key: string;
  name_ro: string;
  name_en: string;
  category: 'ssm' | 'psi' | 'medical' | 'equipment' | 'general' | 'accounting';
  fields: TemplateField[];
  extraction_prompt: string | null;
  is_active: boolean;
}

export interface ExtractionResult {
  fields: Record<string, string>;
  confidence: number;
  raw_response: string;
  errors?: Record<string, string>; // Validation errors per field (key -> error message)
}

export type ScanStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'reviewed';

export interface DocumentScan {
  id: string;
  org_id: string;
  template_key: string;
  original_filename: string;
  storage_path?: string;
  extracted_data: Record<string, string> | null;
  confidence_score: number | null;
  status: ScanStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  created_by?: string;
  created_at: string;
}

export interface CreateScanRequest {
  imageBase64: string;
  templateKey: string;
  orgId: string;
  filename: string;
}

export interface CreateScanResponse {
  success: boolean;
  scan_id?: string;
  extracted_data?: Record<string, string>;
  confidence_score?: number;
  validation_errors?: Record<string, string>;
  error?: string;
}

export interface TemplateCategory {
  key: string;
  label_ro: string;
  label_en: string;
  templates: ScanTemplate[];
}
