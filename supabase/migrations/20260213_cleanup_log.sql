-- Migration: Create cleanup_log table
-- Description: Stores execution logs from scheduled-cleanup Edge Function
-- Date: 2026-02-13
-- Author: Claude (Edge Function: scheduled-cleanup)
-- Optional: This table is not required for the Edge Function to work

-- Create cleanup_log table
CREATE TABLE IF NOT EXISTS cleanup_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_timestamp timestamptz NOT NULL,
  total_records_deleted int NOT NULL DEFAULT 0,
  total_errors int NOT NULL DEFAULT 0,
  results jsonb NOT NULL,
  execution_time_ms int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add indexes for common queries
CREATE INDEX idx_cleanup_log_execution_timestamp ON cleanup_log(execution_timestamp DESC);
CREATE INDEX idx_cleanup_log_total_errors ON cleanup_log(total_errors);
CREATE INDEX idx_cleanup_log_created_at ON cleanup_log(created_at DESC);

-- Enable RLS
ALTER TABLE cleanup_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow service role to insert logs (from Edge Function)
CREATE POLICY "Edge Function can insert cleanup logs"
  ON cleanup_log
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- RLS Policy: Allow consultants to view all logs
CREATE POLICY "Consultants can view cleanup logs"
  ON cleanup_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()
      AND memberships.role = 'consultant'
    )
  );

-- Add comments
COMMENT ON TABLE cleanup_log IS 'Stores execution logs from scheduled-cleanup Edge Function (weekly cleanup tasks)';
COMMENT ON COLUMN cleanup_log.execution_timestamp IS 'Timestamp when cleanup job started';
COMMENT ON COLUMN cleanup_log.total_records_deleted IS 'Total number of records deleted across all cleanup tasks';
COMMENT ON COLUMN cleanup_log.total_errors IS 'Number of cleanup tasks that encountered errors';
COMMENT ON COLUMN cleanup_log.results IS 'Detailed results from each cleanup task (JSON array)';
COMMENT ON COLUMN cleanup_log.execution_time_ms IS 'Total execution time in milliseconds';
