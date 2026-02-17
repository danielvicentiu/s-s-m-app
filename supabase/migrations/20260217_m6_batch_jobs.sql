-- M6_BATCH PROCESSING Migration
-- Created: 2026-02-17
-- Purpose: Create batch_jobs table for automated expiry checking and alert generation

-- =====================================================
-- Table: batch_jobs
-- =====================================================
CREATE TABLE IF NOT EXISTS batch_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL CHECK (job_type IN (
    'expiry_check',
    'alert_generation',
    'compliance_check',
    'data_cleanup',
    'report_generation'
  )),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled'
  )),
  total_items INTEGER DEFAULT 0,
  processed_items INTEGER DEFAULT 0,
  failed_items INTEGER DEFAULT 0,
  results JSONB DEFAULT '{}',
  error_message TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- =====================================================
-- Indexes
-- =====================================================
CREATE INDEX idx_batch_jobs_org ON batch_jobs(organization_id);
CREATE INDEX idx_batch_jobs_status ON batch_jobs(status);
CREATE INDEX idx_batch_jobs_type ON batch_jobs(job_type);
CREATE INDEX idx_batch_jobs_created ON batch_jobs(created_at DESC);
CREATE INDEX idx_batch_jobs_org_status ON batch_jobs(organization_id, status);

-- =====================================================
-- RLS Policies: batch_jobs
-- =====================================================
ALTER TABLE batch_jobs ENABLE ROW LEVEL SECURITY;

-- Consultants can view all batch jobs
-- Org admins can view their org's batch jobs
CREATE POLICY batch_jobs_select ON batch_jobs
  FOR SELECT
  USING (
    -- Consultants see all
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role = 'consultant'
    )
    OR
    -- Org admins see their org's jobs
    (
      organization_id IS NOT NULL
      AND organization_id IN (
        SELECT organization_id FROM memberships
        WHERE user_id = auth.uid()
        AND role IN ('firma_admin', 'consultant')
      )
    )
    OR
    -- Global jobs (organization_id IS NULL) visible to consultants
    (
      organization_id IS NULL
      AND EXISTS (
        SELECT 1 FROM memberships m
        WHERE m.user_id = auth.uid()
        AND m.role = 'consultant'
      )
    )
  );

-- Only consultants can create batch jobs
CREATE POLICY batch_jobs_insert ON batch_jobs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role = 'consultant'
    )
  );

-- Only consultants can update batch jobs
CREATE POLICY batch_jobs_update ON batch_jobs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role = 'consultant'
    )
  );

-- Only consultants can delete batch jobs
CREATE POLICY batch_jobs_delete ON batch_jobs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role = 'consultant'
    )
  );

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON TABLE batch_jobs IS 'Batch processing jobs pentru verificări expirări, generare alerte, rapoarte compliance';
COMMENT ON COLUMN batch_jobs.organization_id IS 'NULL pentru batch-uri globale (toate organizațiile), UUID pentru batch specific organizație';
COMMENT ON COLUMN batch_jobs.results IS 'JSONB cu detalii rezultate: { totalExpired, totalExpiring, perOrg: {}, errors: [] }';
