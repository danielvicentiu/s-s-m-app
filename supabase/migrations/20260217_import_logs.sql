-- Migration: Import Logs Table
-- Created: 2026-02-17
-- Purpose: Track employee data imports with profile usage and error details

CREATE TABLE IF NOT EXISTS import_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  imported_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  profile_used text CHECK (profile_used IN ('reges', 'revisal', 'manual')) NOT NULL,
  file_name text NOT NULL,
  file_size_kb numeric(10, 2),
  total_rows integer NOT NULL DEFAULT 0,
  imported_rows integer NOT NULL DEFAULT 0,
  error_rows integer NOT NULL DEFAULT 0,
  warning_rows integer NOT NULL DEFAULT 0,
  error_details jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,

  -- Indexes for performance
  CONSTRAINT import_logs_valid_rows CHECK (
    imported_rows >= 0
    AND error_rows >= 0
    AND total_rows = imported_rows + error_rows
  )
);

-- Indexes
CREATE INDEX idx_import_logs_org_id ON import_logs(organization_id);
CREATE INDEX idx_import_logs_imported_by ON import_logs(imported_by);
CREATE INDEX idx_import_logs_created_at ON import_logs(created_at DESC);
CREATE INDEX idx_import_logs_profile_used ON import_logs(profile_used);

-- Row Level Security
ALTER TABLE import_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can see imports for their organizations
CREATE POLICY "Users see own organization imports"
  ON import_logs
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can insert imports for their organizations
CREATE POLICY "Users can insert imports for own organizations"
  ON import_logs
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
    )
  );

-- Comment
COMMENT ON TABLE import_logs IS 'Tracks employee data imports with profile usage (REGES, REVISAL, manual) and error details';
COMMENT ON COLUMN import_logs.profile_used IS 'Import profile: reges (REGES Online), revisal (REVISAL XML), manual (custom mapping)';
COMMENT ON COLUMN import_logs.error_details IS 'Array of error objects: [{row: number, field: string, error: string, value: any}]';
