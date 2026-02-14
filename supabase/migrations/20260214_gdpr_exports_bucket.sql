-- S-S-M.RO — GDPR EXPORTS STORAGE BUCKET
-- Creates private bucket for GDPR data exports (JSON + PDF)
-- Files auto-expire after 7 days via cleanup cron
-- Data: 14 Februarie 2026

-- =====================================================
-- 1. Create storage bucket (private)
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gdpr-exports',
  'gdpr-exports',
  false,  -- Private bucket (signed URLs only)
  52428800,  -- 50MB limit per file
  ARRAY['application/json', 'application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE storage.buckets IS 'Private bucket for GDPR Article 15 data exports';

-- =====================================================
-- 2. RLS Policies pentru storage.objects
-- =====================================================

-- Policy: Users can view their own exports
CREATE POLICY "Users can view their own GDPR exports"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'gdpr-exports' AND
    -- Path format: gdpr-exports/{org_id}/{user_id}/{export_id}/...
    (storage.foldername(name))[2] = auth.uid()::text
  );

-- Policy: Users can create their own exports
CREATE POLICY "Users can create GDPR exports"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'gdpr-exports' AND
    (storage.foldername(name))[2] = auth.uid()::text
  );

-- Policy: Service role can delete expired exports (cleanup cron)
CREATE POLICY "Service role can delete expired GDPR exports"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'gdpr-exports' AND
    auth.role() = 'service_role'
  );

-- =====================================================
-- 3. Folder structure convention
-- =====================================================
-- Path format: {org_id}/{user_id}/{export_id}/data-export-{timestamp}.json
-- Example: org-uuid/user-uuid/export-uuid/data-export-2026-02-14T12-00-00.json
--
-- This structure enables:
-- - User-level RLS filtering (foldername[2] = user_id)
-- - Organization-level grouping
-- - Easy cleanup per user or organization
-- - Signed URLs for 7-day secure access
