-- S-S-M.RO — SCHEDULED REPORTS MIGRATION
-- Automated report scheduling system
-- Data: 13 Februarie 2026

-- ══════════════════════════════════════════════════════════════
-- SCHEDULED REPORTS TABLE
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS scheduled_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Report configuration
  report_type VARCHAR(100) NOT NULL,
  frequency VARCHAR(50) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),

  -- Recipients
  recipients JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of email addresses

  -- Schedule configuration
  schedule_config JSONB NOT NULL DEFAULT '{}'::jsonb, -- day_of_week, day_of_month, hour, etc.

  -- Last run tracking
  last_run_at TIMESTAMPTZ,
  last_run_status VARCHAR(50), -- 'success', 'failed', 'skipped'
  last_run_error TEXT,

  -- Next scheduled run (computed)
  next_run_at TIMESTAMPTZ,

  -- Report filters/parameters
  report_filters JSONB DEFAULT '{}'::jsonb,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT valid_recipients CHECK (jsonb_array_length(recipients) > 0)
);

-- Indexes
CREATE INDEX idx_scheduled_reports_org ON scheduled_reports(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_scheduled_reports_next_run ON scheduled_reports(next_run_at) WHERE is_active = true AND deleted_at IS NULL;
CREATE INDEX idx_scheduled_reports_type ON scheduled_reports(report_type) WHERE deleted_at IS NULL;

-- Updated timestamp trigger
CREATE TRIGGER set_scheduled_reports_updated_at
  BEFORE UPDATE ON scheduled_reports
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- ══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ══════════════════════════════════════════════════════════════

ALTER TABLE scheduled_reports ENABLE ROW LEVEL SECURITY;

-- Users can view schedules for their organizations
CREATE POLICY "Users can view org scheduled reports"
  ON scheduled_reports
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

-- Admins/consultants can create schedules
CREATE POLICY "Admins can create scheduled reports"
  ON scheduled_reports
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- Admins/consultants can update schedules
CREATE POLICY "Admins can update scheduled reports"
  ON scheduled_reports
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- Admins/consultants can soft delete schedules
CREATE POLICY "Admins can delete scheduled reports"
  ON scheduled_reports
  FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- ══════════════════════════════════════════════════════════════
-- REPORT EXECUTION LOG TABLE
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS report_execution_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES scheduled_reports(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Execution details
  executed_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(50) NOT NULL CHECK (status IN ('success', 'failed', 'skipped')),

  -- Results
  report_file_path TEXT,
  recipients_sent JSONB, -- Array of emails that were sent successfully
  error_message TEXT,

  -- Metadata
  execution_duration_ms INTEGER,
  record_count INTEGER,
  file_size_bytes INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_report_execution_log_schedule ON report_execution_log(schedule_id);
CREATE INDEX idx_report_execution_log_org ON report_execution_log(organization_id);
CREATE INDEX idx_report_execution_log_executed_at ON report_execution_log(executed_at DESC);

-- RLS for execution log
ALTER TABLE report_execution_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view org report execution logs"
  ON report_execution_log
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

-- ══════════════════════════════════════════════════════════════
-- HELPER FUNCTION: Calculate next run time
-- ══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION calculate_next_run_time(
  p_frequency VARCHAR,
  p_schedule_config JSONB,
  p_last_run_at TIMESTAMPTZ
)
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
AS $$
DECLARE
  v_next_run TIMESTAMPTZ;
  v_hour INTEGER;
  v_day_of_week INTEGER;
  v_day_of_month INTEGER;
BEGIN
  -- Extract hour from config (default to 9 AM)
  v_hour := COALESCE((p_schedule_config->>'hour')::INTEGER, 9);

  -- Base timestamp
  v_next_run := COALESCE(p_last_run_at, NOW());

  CASE p_frequency
    WHEN 'daily' THEN
      v_next_run := DATE_TRUNC('day', v_next_run) + INTERVAL '1 day' + (v_hour || ' hours')::INTERVAL;

    WHEN 'weekly' THEN
      v_day_of_week := COALESCE((p_schedule_config->>'day_of_week')::INTEGER, 1); -- Monday
      v_next_run := DATE_TRUNC('week', v_next_run) + INTERVAL '1 week' + (v_day_of_week || ' days')::INTERVAL + (v_hour || ' hours')::INTERVAL;

    WHEN 'monthly' THEN
      v_day_of_month := COALESCE((p_schedule_config->>'day_of_month')::INTEGER, 1); -- 1st of month
      v_next_run := DATE_TRUNC('month', v_next_run) + INTERVAL '1 month' + ((v_day_of_month - 1) || ' days')::INTERVAL + (v_hour || ' hours')::INTERVAL;

    WHEN 'quarterly' THEN
      v_day_of_month := COALESCE((p_schedule_config->>'day_of_month')::INTEGER, 1);
      v_next_run := DATE_TRUNC('quarter', v_next_run) + INTERVAL '3 months' + ((v_day_of_month - 1) || ' days')::INTERVAL + (v_hour || ' hours')::INTERVAL;

    WHEN 'yearly' THEN
      v_day_of_month := COALESCE((p_schedule_config->>'day_of_month')::INTEGER, 1);
      v_next_run := DATE_TRUNC('year', v_next_run) + INTERVAL '1 year' + ((v_day_of_month - 1) || ' days')::INTERVAL + (v_hour || ' hours')::INTERVAL;

    ELSE
      v_next_run := NULL;
  END CASE;

  -- Ensure next run is in the future
  IF v_next_run IS NOT NULL AND v_next_run <= NOW() THEN
    v_next_run := calculate_next_run_time(p_frequency, p_schedule_config, v_next_run);
  END IF;

  RETURN v_next_run;
END;
$$;

-- ══════════════════════════════════════════════════════════════
-- TRIGGER: Auto-calculate next_run_at on insert/update
-- ══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION trigger_calculate_next_run()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_active AND NEW.deleted_at IS NULL THEN
    NEW.next_run_at := calculate_next_run_time(
      NEW.frequency,
      NEW.schedule_config,
      NEW.last_run_at
    );
  ELSE
    NEW.next_run_at := NULL;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER set_scheduled_reports_next_run
  BEFORE INSERT OR UPDATE ON scheduled_reports
  FOR EACH ROW
  EXECUTE FUNCTION trigger_calculate_next_run();

-- ══════════════════════════════════════════════════════════════
-- COMMENTS
-- ══════════════════════════════════════════════════════════════

COMMENT ON TABLE scheduled_reports IS 'Automated report scheduling configuration';
COMMENT ON TABLE report_execution_log IS 'Log of scheduled report executions';
COMMENT ON FUNCTION calculate_next_run_time IS 'Calculate next scheduled run time based on frequency and config';
