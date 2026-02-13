// lib/services/document.service.ts
// Document Service — CRUD operations for GeneratedDocument entity
// Handles PDF generation, file uploads to Supabase Storage, and document templates
// Respectă Code Contract: TypeScript strict, camelCase, error handling

import { createSupabaseBrowser } from '@/lib/supabase/client'
import { createSupabaseServer } from '@/lib/supabase/server'
import type { GeneratedDocument } from '@/lib/types'
import type { SupabaseClient } from '@supabase/supabase-js'

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface CreateDocumentInput {
  organization_id: string
  document_type: GeneratedDocument['document_type']
  file_name: string
  storage_path: string
  file_size_bytes?: number | null
  content_version?: number
  legal_basis_version?: string
  sha256_hash?: string | null
  is_locked?: boolean
  generated_by?: string | null
  generation_context?: Record<string, any>
  ignored_notifications_count?: number
}

export interface UpdateDocumentInput {
  document_type?: GeneratedDocument['document_type']
  file_name?: string
  storage_path?: string
  file_size_bytes?: number | null
  content_version?: number
  legal_basis_version?: string
  sha256_hash?: string | null
  is_locked?: boolean
  generation_context?: Record<string, any>
  ignored_notifications_count?: number
}

export interface DocumentTemplate {
  id: string
  name: string
  document_type: GeneratedDocument['document_type']
  description: string | null
  is_active: boolean
}

export interface UploadFileOptions {
  upsert?: boolean
  cacheControl?: string
  contentType?: string
}

// ═══════════════════════════════════════════════════════════════════
// DOCUMENT SERVICE CLASS
// ═══════════════════════════════════════════════════════════════════

export class DocumentService {
  private supabase: SupabaseClient

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase
  }

  // ─────────────────────────────────────────────────────────────────
  // CRUD OPERATIONS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Get all documents for an organization
   * @param organizationId - Organization UUID
   * @returns Array of GeneratedDocument or error
   */
  async getAll(organizationId: string): Promise<{
    data: GeneratedDocument[] | null
    error: string | null
  }> {
    try {
      const { data, error } = await this.supabase
        .from('generated_documents')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[DocumentService] getAll error:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[DocumentService] getAll exception:', message)
      return { data: null, error: message }
    }
  }

  /**
   * Get a single document by ID
   * @param id - Document UUID
   * @returns GeneratedDocument or error
   */
  async getById(id: string): Promise<{
    data: GeneratedDocument | null
    error: string | null
  }> {
    try {
      const { data, error } = await this.supabase
        .from('generated_documents')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('[DocumentService] getById error:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[DocumentService] getById exception:', message)
      return { data: null, error: message }
    }
  }

  /**
   * Create a new document record
   * @param input - CreateDocumentInput
   * @returns Created GeneratedDocument or error
   */
  async create(input: CreateDocumentInput): Promise<{
    data: GeneratedDocument | null
    error: string | null
  }> {
    try {
      const documentData = {
        organization_id: input.organization_id,
        document_type: input.document_type,
        file_name: input.file_name,
        storage_path: input.storage_path,
        file_size_bytes: input.file_size_bytes ?? null,
        content_version: input.content_version ?? 1,
        legal_basis_version: input.legal_basis_version ?? 'v1.0',
        sha256_hash: input.sha256_hash ?? null,
        is_locked: input.is_locked ?? false,
        generated_by: input.generated_by ?? null,
        generation_context: input.generation_context ?? {},
        ignored_notifications_count: input.ignored_notifications_count ?? 0,
      }

      const { data, error } = await this.supabase
        .from('generated_documents')
        .insert(documentData)
        .select()
        .single()

      if (error) {
        console.error('[DocumentService] create error:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[DocumentService] create exception:', message)
      return { data: null, error: message }
    }
  }

  /**
   * Update an existing document record
   * @param id - Document UUID
   * @param input - UpdateDocumentInput
   * @returns Updated GeneratedDocument or error
   */
  async update(
    id: string,
    input: UpdateDocumentInput
  ): Promise<{
    data: GeneratedDocument | null
    error: string | null
  }> {
    try {
      // Filter out undefined values
      const updateData = Object.fromEntries(
        Object.entries(input).filter(([_, v]) => v !== undefined)
      )

      const { data, error } = await this.supabase
        .from('generated_documents')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('[DocumentService] update error:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[DocumentService] update exception:', message)
      return { data: null, error: message }
    }
  }

  /**
   * Delete a document record (soft delete recommended in production)
   * @param id - Document UUID
   * @returns Success status or error
   */
  async delete(id: string): Promise<{
    success: boolean
    error: string | null
  }> {
    try {
      const { error } = await this.supabase
        .from('generated_documents')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('[DocumentService] delete error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[DocumentService] delete exception:', message)
      return { success: false, error: message }
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // PDF GENERATION
  // ─────────────────────────────────────────────────────────────────

  /**
   * Generate a PDF document (placeholder for PDF generation logic)
   * @param documentType - Type of document to generate
   * @param data - Data for PDF generation
   * @returns PDF buffer or error
   */
  async generatePDF(
    documentType: GeneratedDocument['document_type'],
    data: Record<string, any>
  ): Promise<{
    data: Buffer | null
    error: string | null
  }> {
    try {
      // TODO: Implement actual PDF generation logic using libraries like:
      // - @react-pdf/renderer
      // - pdfmake
      // - puppeteer
      // This is a placeholder that should be replaced with actual implementation

      console.log(`[DocumentService] generatePDF called for type: ${documentType}`)
      console.log('[DocumentService] PDF generation data:', data)

      // Placeholder: return error for now
      return {
        data: null,
        error: 'PDF generation not yet implemented. Integrate @react-pdf/renderer or similar.',
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[DocumentService] generatePDF exception:', message)
      return { data: null, error: message }
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // TEMPLATES
  // ─────────────────────────────────────────────────────────────────

  /**
   * Get available document templates
   * @returns Array of DocumentTemplate or error
   */
  async getTemplates(): Promise<{
    data: DocumentTemplate[] | null
    error: string | null
  }> {
    try {
      // TODO: If you have a 'document_templates' table, query it here
      // For now, return hardcoded templates based on document_type enum

      const templates: DocumentTemplate[] = [
        {
          id: 'template-fisa-medicina-muncii',
          name: 'Fișă Medicină Muncii',
          document_type: 'fisa_medicina_muncii',
          description: 'Fișă medicală pentru angajați conform legislației SSM',
          is_active: true,
        },
        {
          id: 'template-fisa-echipamente',
          name: 'Fișă Echipamente',
          document_type: 'fisa_echipamente',
          description: 'Registru echipamente de protecție și siguranță',
          is_active: true,
        },
        {
          id: 'template-raport-conformitate',
          name: 'Raport Conformitate',
          document_type: 'raport_conformitate',
          description: 'Raport conformitate SSM/PSI',
          is_active: true,
        },
        {
          id: 'template-fisa-instruire',
          name: 'Fișă Instruire',
          document_type: 'fisa_instruire',
          description: 'Fișă instruire SSM/PSI pentru angajați',
          is_active: true,
        },
        {
          id: 'template-raport-neactiune',
          name: 'Raport Neacțiune',
          document_type: 'raport_neactiune',
          description: 'Raport neacțiune client (penalități, riscuri)',
          is_active: true,
        },
      ]

      return { data: templates, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[DocumentService] getTemplates exception:', message)
      return { data: null, error: message }
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // STORAGE / FILE UPLOAD
  // ─────────────────────────────────────────────────────────────────

  /**
   * Upload a file to Supabase Storage
   * @param bucket - Storage bucket name
   * @param path - File path within bucket (e.g., 'org_id/session_id/file.pdf')
   * @param file - File data (Buffer, Blob, File, or ArrayBuffer)
   * @param options - Upload options (upsert, cacheControl, contentType)
   * @returns Storage path or error
   */
  async uploadFile(
    bucket: string,
    path: string,
    file: Buffer | Blob | File | ArrayBuffer,
    options?: UploadFileOptions
  ): Promise<{
    data: { path: string } | null
    error: string | null
  }> {
    try {
      const uploadOptions = {
        upsert: options?.upsert ?? false,
        cacheControl: options?.cacheControl ?? '3600',
        contentType: options?.contentType ?? 'application/pdf',
      }

      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(path, file, uploadOptions)

      if (error) {
        console.error('[DocumentService] uploadFile error:', error)
        return { data: null, error: error.message }
      }

      return { data: { path: data.path }, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[DocumentService] uploadFile exception:', message)
      return { data: null, error: message }
    }
  }

  /**
   * Get public URL for a file in storage
   * @param bucket - Storage bucket name
   * @param path - File path within bucket
   * @returns Public URL or error
   */
  getPublicUrl(bucket: string, path: string): {
    data: { publicUrl: string } | null
    error: string | null
  } {
    try {
      const { data } = this.supabase.storage.from(bucket).getPublicUrl(path)

      return { data: { publicUrl: data.publicUrl }, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[DocumentService] getPublicUrl exception:', message)
      return { data: null, error: message }
    }
  }

  /**
   * Download a file from storage
   * @param bucket - Storage bucket name
   * @param path - File path within bucket
   * @returns File blob or error
   */
  async downloadFile(
    bucket: string,
    path: string
  ): Promise<{
    data: Blob | null
    error: string | null
  }> {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .download(path)

      if (error) {
        console.error('[DocumentService] downloadFile error:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[DocumentService] downloadFile exception:', message)
      return { data: null, error: message }
    }
  }

  /**
   * Delete a file from storage
   * @param bucket - Storage bucket name
   * @param path - File path within bucket
   * @returns Success status or error
   */
  async deleteFile(
    bucket: string,
    path: string
  ): Promise<{
    success: boolean
    error: string | null
  }> {
    try {
      const { error } = await this.supabase.storage.from(bucket).remove([path])

      if (error) {
        console.error('[DocumentService] deleteFile error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[DocumentService] deleteFile exception:', message)
      return { success: false, error: message }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
// FACTORY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Create DocumentService instance for browser (Client Components)
 */
export function createDocumentServiceBrowser(): DocumentService {
  const supabase = createSupabaseBrowser()
  return new DocumentService(supabase)
}

/**
 * Create DocumentService instance for server (Server Components, API Routes)
 */
export async function createDocumentServiceServer(): Promise<DocumentService> {
  const supabase = await createSupabaseServer()
  return new DocumentService(supabase)
}
