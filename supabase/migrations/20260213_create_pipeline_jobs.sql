-- Migration: Create pipeline_jobs table for M6 Batch Processing
-- Description: Tracks legislative act processing through scraping, parsing, and extraction pipeline

-- Create enum for job status
CREATE TYPE pipeline_job_status AS ENUM (
  'queued',
  'scraping',
  'parsing',
  'extracting',
  'completed',
  'error'
);

-- Create pipeline_jobs table
CREATE TABLE IF NOT EXISTS pipeline_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  act_url TEXT NOT NULL,
  act_title TEXT NOT NULL,
  status pipeline_job_status NOT NULL DEFAULT 'queued',
  step_current TEXT,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  result JSONB,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on status for efficient queue processing
CREATE INDEX idx_pipeline_jobs_status ON pipeline_jobs(status);

-- Create index on created_at for ordering
CREATE INDEX idx_pipeline_jobs_created_at ON pipeline_jobs(created_at);

-- Create index on act_url to prevent duplicates
CREATE INDEX idx_pipeline_jobs_act_url ON pipeline_jobs(act_url);

-- Enable RLS
ALTER TABLE pipeline_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only admins can view and manage pipeline jobs
CREATE POLICY "Admin full access to pipeline_jobs"
ON pipeline_jobs
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.user_id = auth.uid()
    AND memberships.role = 'consultant'
  )
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_pipeline_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pipeline_jobs_updated_at
BEFORE UPDATE ON pipeline_jobs
FOR EACH ROW
EXECUTE FUNCTION update_pipeline_jobs_updated_at();

-- Add comment
COMMENT ON TABLE pipeline_jobs IS 'Tracks batch processing of legislative acts through M1/M2/M3 pipeline';
