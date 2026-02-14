-- Migration: Documents Table
-- Description: Create documents table for SSM/PSI/GDPR/NIS2 compliance documents
-- Author: Claude
-- Date: 2026-02-14

-- Create enum for document categories
CREATE TYPE document_category AS ENUM ('SSM', 'PSI', 'GDPR', 'NIS2');

-- Create enum for document status
CREATE TYPE document_status AS ENUM ('active', 'expiring_soon', 'expired', 'draft', 'archived');

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category document_category NOT NULL,
  type TEXT NOT NULL,
  file_url TEXT,
  expiry_date DATE,
  status document_status NOT NULL DEFAULT 'draft',
  version INTEGER NOT NULL DEFAULT 1,
  tags TEXT[] DEFAULT '{}',

  -- Metadata
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT documents_title_check CHECK (char_length(title) >= 3),
  CONSTRAINT documents_type_check CHECK (char_length(type) >= 2),
  CONSTRAINT documents_version_check CHECK (version >= 1)
);

-- Create indexes for better performance
CREATE INDEX idx_documents_org_id ON documents(org_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_category ON documents(category) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_status ON documents(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_expiry_date ON documents(expiry_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_tags ON documents USING GIN(tags) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_created_at ON documents(created_at DESC) WHERE deleted_at IS NULL;

-- Create trigger function to auto-update status based on expiry_date
CREATE OR REPLACE FUNCTION update_document_status()
RETURNS TRIGGER AS $$
DECLARE
  days_until_expiry INTEGER;
BEGIN
  -- Only process if expiry_date exists and document is not deleted
  IF NEW.expiry_date IS NOT NULL AND NEW.deleted_at IS NULL THEN
    -- Calculate days until expiry
    days_until_expiry := NEW.expiry_date - CURRENT_DATE;

    -- Update status based on expiry
    IF days_until_expiry < 0 THEN
      NEW.status := 'expired';
    ELSIF days_until_expiry <= 30 THEN
      -- Document expires in 30 days or less
      IF NEW.status NOT IN ('draft', 'archived') THEN
        NEW.status := 'expiring_soon';
      END IF;
    ELSE
      -- Document is valid
      IF NEW.status NOT IN ('draft', 'archived') THEN
        NEW.status := 'active';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update status on INSERT and UPDATE
CREATE TRIGGER trigger_update_document_status
  BEFORE INSERT OR UPDATE OF expiry_date, status, deleted_at
  ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_document_status();

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_documents_updated_at();

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view documents from their organizations
CREATE POLICY "Users can view documents from their organizations"
  ON documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()
        AND memberships.org_id = documents.org_id
        AND memberships.deleted_at IS NULL
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Consultants and admins can insert documents
CREATE POLICY "Consultants and admins can insert documents"
  ON documents
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()
        AND memberships.org_id = documents.org_id
        AND memberships.role IN ('consultant', 'firma_admin')
        AND memberships.deleted_at IS NULL
    )
  );

-- RLS Policy: Consultants and admins can update documents
CREATE POLICY "Consultants and admins can update documents"
  ON documents
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()
        AND memberships.org_id = documents.org_id
        AND memberships.role IN ('consultant', 'firma_admin')
        AND memberships.deleted_at IS NULL
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()
        AND memberships.org_id = documents.org_id
        AND memberships.role IN ('consultant', 'firma_admin')
        AND memberships.deleted_at IS NULL
    )
  );

-- RLS Policy: Only consultants can soft delete documents
CREATE POLICY "Consultants can soft delete documents"
  ON documents
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()
        AND memberships.org_id = documents.org_id
        AND memberships.role = 'consultant'
        AND memberships.deleted_at IS NULL
    )
  );

-- Create function to periodically update expired documents statuses
-- This can be called by a cron job or scheduled task
CREATE OR REPLACE FUNCTION refresh_document_statuses()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE documents
  SET status = CASE
    WHEN expiry_date < CURRENT_DATE THEN 'expired'::document_status
    WHEN expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'expiring_soon'::document_status
    ELSE 'active'::document_status
  END
  WHERE expiry_date IS NOT NULL
    AND deleted_at IS NULL
    AND status NOT IN ('draft', 'archived')
    AND status != CASE
      WHEN expiry_date < CURRENT_DATE THEN 'expired'::document_status
      WHEN expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'expiring_soon'::document_status
      ELSE 'active'::document_status
    END;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment to table
COMMENT ON TABLE documents IS 'Stores compliance documents for SSM, PSI, GDPR, and NIS2 categories';
COMMENT ON COLUMN documents.category IS 'Document category: SSM (workplace safety), PSI (fire safety), GDPR (data protection), NIS2 (cybersecurity)';
COMMENT ON COLUMN documents.status IS 'Auto-calculated based on expiry_date: active (>30 days), expiring_soon (≤30 days), expired (<0 days), or manual: draft, archived';
COMMENT ON COLUMN documents.tags IS 'Array of tags for categorization and search';
COMMENT ON FUNCTION refresh_document_statuses() IS 'Batch updates document statuses based on expiry dates. Can be called by cron job.';
