-- Migration: Create documents table
-- Description: Table for storing document metadata with JSONB content, file storage, versioning, and status tracking
-- Author: Claude
-- Date: 2026-02-13

-- Create enum for document status
CREATE TYPE document_status AS ENUM (
  'draft',
  'active',
  'archived',
  'pending_approval'
);

-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,

  -- Document metadata
  title VARCHAR(255) NOT NULL,
  description TEXT,
  document_type VARCHAR(100) NOT NULL, -- e.g., 'ssm_policy', 'psi_plan', 'training_material', etc.

  -- Content storage (flexible JSONB for structured data)
  content JSONB,

  -- File storage (URL to Supabase Storage or external)
  file_url TEXT,
  file_name VARCHAR(255),
  file_size BIGINT, -- in bytes
  file_mime_type VARCHAR(100),

  -- Versioning
  version INTEGER NOT NULL DEFAULT 1,
  parent_document_id UUID REFERENCES documents(id) ON DELETE SET NULL, -- for version history

  -- Status tracking
  status document_status NOT NULL DEFAULT 'draft',

  -- Approval workflow (optional)
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,

  -- Metadata
  tags TEXT[], -- array of tags for categorization
  metadata JSONB, -- additional flexible metadata

  -- Soft delete
  deleted_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_version CHECK (version > 0),
  CONSTRAINT valid_file_size CHECK (file_size IS NULL OR file_size >= 0),
  CONSTRAINT file_url_or_content CHECK (file_url IS NOT NULL OR content IS NOT NULL)
);

-- Create indexes for performance
CREATE INDEX idx_documents_organization_id ON documents(organization_id);
CREATE INDEX idx_documents_created_by ON documents(created_by);
CREATE INDEX idx_documents_document_type ON documents(document_type);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_parent_document_id ON documents(parent_document_id);
CREATE INDEX idx_documents_deleted_at ON documents(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);

-- Create GIN index for JSONB columns for faster queries
CREATE INDEX idx_documents_content_gin ON documents USING GIN(content);
CREATE INDEX idx_documents_metadata_gin ON documents USING GIN(metadata);
CREATE INDEX idx_documents_tags_gin ON documents USING GIN(tags);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view documents from their organization (non-deleted)
CREATE POLICY "Users can view organization documents"
  ON documents
  FOR SELECT
  USING (
    deleted_at IS NULL
    AND organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
      AND deleted_at IS NULL
    )
  );

-- RLS Policy: Users can create documents for their organization
CREATE POLICY "Users can create organization documents"
  ON documents
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
      AND deleted_at IS NULL
    )
    AND created_by = auth.uid()
  );

-- RLS Policy: Users can update documents they created or if they have admin role
CREATE POLICY "Users can update own documents or admins can update all"
  ON documents
  FOR UPDATE
  USING (
    deleted_at IS NULL
    AND organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
      AND deleted_at IS NULL
    )
    AND (
      created_by = auth.uid()
      OR EXISTS (
        SELECT 1
        FROM memberships
        WHERE user_id = auth.uid()
        AND organization_id = documents.organization_id
        AND role IN ('consultant', 'firma_admin')
        AND deleted_at IS NULL
      )
    )
  );

-- RLS Policy: Only admins can soft-delete documents
CREATE POLICY "Admins can delete organization documents"
  ON documents
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
      AND role IN ('consultant', 'firma_admin')
      AND deleted_at IS NULL
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_documents_updated_at();

-- Add comments for documentation
COMMENT ON TABLE documents IS 'Stores document metadata with flexible JSONB content, file storage URLs, versioning, and status tracking';
COMMENT ON COLUMN documents.content IS 'JSONB field for storing structured document content';
COMMENT ON COLUMN documents.file_url IS 'URL to file stored in Supabase Storage or external storage';
COMMENT ON COLUMN documents.version IS 'Version number for document versioning';
COMMENT ON COLUMN documents.parent_document_id IS 'Reference to parent document for version history';
COMMENT ON COLUMN documents.status IS 'Current status: draft, active, archived, or pending_approval';
COMMENT ON COLUMN documents.metadata IS 'Additional flexible metadata in JSONB format';
COMMENT ON COLUMN documents.tags IS 'Array of tags for document categorization';
