-- Migration: Supabase Storage pentru Fișe de Instruire
-- Created: 2026-02-07
-- Description: Creează bucket privat pentru PDF-uri + RLS policies

-- =====================================================
-- 1. Create storage bucket (private)
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'fisa-documents',
  'fisa-documents',
  false,  -- Private bucket (RLS controlled)
  5242880,  -- 5MB limit per file
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE storage.buckets IS 'Bucket pentru fișe de instruire SSM/PSI (PDF)';

-- =====================================================
-- 2. RLS Policies pentru storage.objects
-- =====================================================

-- Policy: Users can SELECT files from their organization
CREATE POLICY "Users can view fisa documents for their organizations"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'fisa-documents' AND
    (storage.foldername(name))[1] IN (
      SELECT organization_id::text FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Policy: Service role can INSERT (used by API route)
CREATE POLICY "Service role can insert fisa documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'fisa-documents' AND
    auth.role() = 'service_role'
  );

-- Policy: Service role can UPDATE (for re-uploads with upsert)
CREATE POLICY "Service role can update fisa documents"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'fisa-documents' AND
    auth.role() = 'service_role'
  );

-- Policy: Service role can DELETE (for cleanup)
CREATE POLICY "Service role can delete fisa documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'fisa-documents' AND
    auth.role() = 'service_role'
  );

-- =====================================================
-- 3. Folder structure convention
-- =====================================================
-- Path format: {organization_id}/{session_id}/fisa.pdf
-- Example: dde85119-fb9f-4f72-9b3d-3900072bbba0/a1b2c3d4.../fisa.pdf
--
-- This structure enables:
-- - Organization-level RLS filtering (foldername[1] = org_id)
-- - Session-level file identification
-- - Easy cleanup per organization or session
