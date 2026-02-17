-- Migration: Upload Links - Portal client pentru upload documente fara login
-- Created: 2026-02-17
-- Description: Permite consultantilor sa genereze link-uri unice pentru clienti
--              sa trimita documente fara autentificare

-- =====================================================
-- 1. Create upload_links table
-- =====================================================
CREATE TABLE IF NOT EXISTS upload_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    label TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    scan_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast token validation
CREATE INDEX IF NOT EXISTS idx_upload_links_token ON upload_links(token);
CREATE INDEX IF NOT EXISTS idx_upload_links_organization ON upload_links(organization_id);
CREATE INDEX IF NOT EXISTS idx_upload_links_created_by ON upload_links(created_by);

-- =====================================================
-- 2. RLS Policies
-- =====================================================
ALTER TABLE upload_links ENABLE ROW LEVEL SECURITY;

-- Members can view their organization's upload links
CREATE POLICY "Members can view org upload links" ON upload_links
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM memberships
            WHERE memberships.organization_id = upload_links.organization_id
            AND memberships.user_id = auth.uid()
            AND memberships.is_active = true
        )
    );

-- Members can create upload links for their organizations
CREATE POLICY "Members can create upload links" ON upload_links
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM memberships
            WHERE memberships.organization_id = upload_links.organization_id
            AND memberships.user_id = auth.uid()
            AND memberships.is_active = true
        )
    );

-- Members can update (deactivate) links in their organization
CREATE POLICY "Members can update org upload links" ON upload_links
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM memberships
            WHERE memberships.organization_id = upload_links.organization_id
            AND memberships.user_id = auth.uid()
            AND memberships.is_active = true
        )
    );

-- =====================================================
-- 3. Helper function: atomic increment scan_count
-- =====================================================
CREATE OR REPLACE FUNCTION increment_upload_link_count(link_id UUID)
RETURNS void
LANGUAGE SQL
SECURITY DEFINER
AS $$
    UPDATE upload_links SET scan_count = scan_count + 1 WHERE id = link_id;
$$;

-- =====================================================
-- 4. Create uploads storage bucket (private)
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'uploads',
    'uploads',
    false,      -- Private bucket (RLS controlled)
    10485760,   -- 10MB limit per file
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/gif']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Service role can INSERT files (used by API route for anonymous uploads)
CREATE POLICY "Service role can insert to uploads"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'uploads' AND
        auth.role() = 'service_role'
    );

-- Members can view files from their organization
CREATE POLICY "Members can view org uploads"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'uploads' AND
        (storage.foldername(name))[1] IN (
            SELECT organization_id::text FROM memberships
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Service role can delete files (for cleanup)
CREATE POLICY "Service role can delete uploads"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'uploads' AND
        auth.role() = 'service_role'
    );

-- =====================================================
-- 5. Storage path convention
-- =====================================================
-- Path format: {organization_id}/{token}/{timestamp}.{ext}
-- Example: dde85119-fb9f.../a1b2c3d4.../1708177200000.jpg
-- Enables:
--   - Organization-level RLS filtering (foldername[1] = org_id)
--   - Link-level grouping (foldername[2] = token)
--   - Timestamp for ordering
