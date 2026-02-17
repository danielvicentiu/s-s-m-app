-- ================================================================
-- S-S-M.RO — MIGRATION: Training Calendar & Scheduling
-- File: 20260217_training_calendar.sql
-- Date: 2026-02-17
-- ================================================================
-- Adds training_sessions table with scheduling and auto-calculation
-- Supports IG (introductiv generala), LLM (la locul de munca), Periodica
-- ================================================================

-- ================================================================
-- 1. CREATE TABLE: training_sessions
-- ================================================================
CREATE TABLE IF NOT EXISTS training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,

  -- Training type: IG, LLM, Periodica (6/12 months), Tematica (ad-hoc)
  training_type TEXT NOT NULL CHECK (training_type IN ('ig', 'llm', 'periodica', 'tematica')),

  -- Scheduling
  scheduled_date DATE NOT NULL,
  completed_date DATE,

  -- Session details
  instructor TEXT NOT NULL,
  duration_hours NUMERIC(4,2) NOT NULL DEFAULT 1.0,
  topics TEXT, -- Teme abordate

  -- Status
  status TEXT NOT NULL DEFAULT 'programat' CHECK (status IN ('programat', 'efectuat', 'expirat', 'anulat')),

  -- Additional info
  notes TEXT,

  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================================
-- 2. INDEXES
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_training_sessions_org_date
  ON training_sessions(organization_id, scheduled_date DESC);

CREATE INDEX IF NOT EXISTS idx_training_sessions_employee
  ON training_sessions(employee_id, scheduled_date DESC);

CREATE INDEX IF NOT EXISTS idx_training_sessions_status
  ON training_sessions(status, scheduled_date);

CREATE INDEX IF NOT EXISTS idx_training_sessions_type
  ON training_sessions(training_type, scheduled_date);

-- ================================================================
-- 3. RLS POLICIES
-- ================================================================
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;

-- Users can view training sessions for their organizations
CREATE POLICY "Users can view training sessions in their orgs"
  ON training_sessions
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Consultants and admins can insert training sessions
CREATE POLICY "Consultants can insert training sessions"
  ON training_sessions
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

-- Consultants and admins can update training sessions
CREATE POLICY "Consultants can update training sessions"
  ON training_sessions
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

-- Consultants and admins can delete training sessions
CREATE POLICY "Consultants can delete training sessions"
  ON training_sessions
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

-- ================================================================
-- 4. TRIGGER: Auto-update updated_at
-- ================================================================
CREATE OR REPLACE FUNCTION update_training_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_training_sessions_updated_at
  BEFORE UPDATE ON training_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_training_sessions_updated_at();

-- ================================================================
-- 5. FUNCTION: Auto-update status based on scheduled_date
-- ================================================================
CREATE OR REPLACE FUNCTION update_training_session_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If completed_date is set, mark as efectuat
  IF NEW.completed_date IS NOT NULL AND NEW.status = 'programat' THEN
    NEW.status = 'efectuat';
  END IF;

  -- If scheduled_date is in the past and not completed, mark as expirat
  IF NEW.scheduled_date < CURRENT_DATE
     AND NEW.completed_date IS NULL
     AND NEW.status = 'programat' THEN
    NEW.status = 'expirat';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_training_session_status
  BEFORE INSERT OR UPDATE ON training_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_training_session_status();

-- ================================================================
-- 6. ORGANIZATION CONFIG: Training periodicity settings
-- ================================================================
-- Add column to organizations for training periodicity configuration
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS training_periodicity_months INTEGER DEFAULT 12
    CHECK (training_periodicity_months IN (6, 12));

-- ================================================================
-- 7. FUNCTION: Calculate next training date for employee
-- ================================================================
CREATE OR REPLACE FUNCTION get_next_training_date(
  p_employee_id UUID,
  p_training_type TEXT,
  p_organization_id UUID
) RETURNS DATE AS $$
DECLARE
  v_last_training_date DATE;
  v_periodicity_months INTEGER;
BEGIN
  -- Get organization periodicity setting
  SELECT training_periodicity_months INTO v_periodicity_months
  FROM organizations
  WHERE id = p_organization_id;

  -- Default to 12 months if not set
  IF v_periodicity_months IS NULL THEN
    v_periodicity_months := 12;
  END IF;

  -- For IG and LLM, only once at hire (no recurrence)
  IF p_training_type IN ('ig', 'llm') THEN
    -- Check if already done
    SELECT completed_date INTO v_last_training_date
    FROM training_sessions
    WHERE employee_id = p_employee_id
      AND training_type = p_training_type
      AND status = 'efectuat'
    ORDER BY completed_date DESC
    LIMIT 1;

    -- If never done, return NULL (needs to be scheduled)
    IF v_last_training_date IS NULL THEN
      RETURN NULL;
    ELSE
      -- Already done, no next date needed
      RETURN NULL;
    END IF;
  END IF;

  -- For Periodica, calculate based on last completed training
  IF p_training_type = 'periodica' THEN
    SELECT completed_date INTO v_last_training_date
    FROM training_sessions
    WHERE employee_id = p_employee_id
      AND training_type = 'periodica'
      AND status = 'efectuat'
    ORDER BY completed_date DESC
    LIMIT 1;

    -- If no previous training, return NULL (needs initial scheduling)
    IF v_last_training_date IS NULL THEN
      RETURN NULL;
    ELSE
      -- Add periodicity months to last training date
      RETURN v_last_training_date + (v_periodicity_months || ' months')::INTERVAL;
    END IF;
  END IF;

  -- For tematica, no automatic scheduling
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- 8. VIEW: Training calendar overview
-- ================================================================
CREATE OR REPLACE VIEW training_calendar_view AS
SELECT
  ts.id,
  ts.organization_id,
  ts.employee_id,
  e.full_name AS employee_name,
  e.job_title,
  ts.training_type,
  ts.scheduled_date,
  ts.completed_date,
  ts.instructor,
  ts.duration_hours,
  ts.topics,
  ts.status,
  ts.notes,
  ts.created_at,
  o.name AS organization_name,
  o.cui AS organization_cui,
  -- Calculate next training date for periodica
  CASE
    WHEN ts.training_type = 'periodica' AND ts.status = 'efectuat' THEN
      ts.completed_date + (COALESCE(o.training_periodicity_months, 12) || ' months')::INTERVAL
    ELSE NULL
  END AS next_training_date,
  -- Days until scheduled
  ts.scheduled_date - CURRENT_DATE AS days_until_scheduled
FROM training_sessions ts
JOIN employees e ON e.id = ts.employee_id
JOIN organizations o ON o.id = ts.organization_id;

-- ================================================================
-- COMMENTS
-- ================================================================
COMMENT ON TABLE training_sessions IS 'Training sessions for employees - supports IG, LLM, Periodica, Tematica';
COMMENT ON COLUMN training_sessions.training_type IS 'IG (introductiv generala), LLM (la locul de munca), Periodica (6/12 months), Tematica (ad-hoc)';
COMMENT ON COLUMN training_sessions.status IS 'programat, efectuat, expirat, anulat';
COMMENT ON COLUMN organizations.training_periodicity_months IS 'Periodicity for Periodica trainings (6 or 12 months)';
COMMENT ON FUNCTION get_next_training_date IS 'Calculates next training date based on type and last completion';
