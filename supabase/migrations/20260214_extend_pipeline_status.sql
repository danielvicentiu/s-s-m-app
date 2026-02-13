-- Migration: Extend pipeline_job_status enum to include 'validating' status
-- Date: 2026-02-14
-- Purpose: Add M4 validation step to pipeline status flow

-- Add 'validating' status to pipeline_job_status enum
-- Note: This runs only if the value doesn't already exist (PostgreSQL 12+)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'validating'
    AND enumtypid = (
      SELECT oid FROM pg_type WHERE typname = 'pipeline_job_status'
    )
  ) THEN
    ALTER TYPE pipeline_job_status ADD VALUE 'validating';
  END IF;
END $$;

-- Add comment to document all status values
COMMENT ON TYPE pipeline_job_status IS 'Pipeline job status: queued → scraping → parsing → extracting → validating → completed (or error at any step)';
