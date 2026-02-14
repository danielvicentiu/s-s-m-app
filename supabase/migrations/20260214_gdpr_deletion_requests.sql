-- S-S-M.RO — GDPR DATA DELETION REQUESTS
-- GDPR Article 17 - Right to Erasure
-- Tracks deletion requests with grace periods and audit trail
-- Data: 14 Februarie 2026

-- =====================================================
-- 1. Create gdpr_deletion_requests table
-- =====================================================

CREATE TABLE IF NOT EXISTS gdpr_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User and organization
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES auth.users(id),

  -- Status tracking
  status TEXT NOT NULL CHECK (status IN ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  grace_period_days INTEGER NOT NULL DEFAULT 30,
  scheduled_execution_at TIMESTAMPTZ NOT NULL,

  -- Execution details
  executed_at TIMESTAMPTZ,
  executed_by UUID REFERENCES auth.users(id),
  records_anonymized INTEGER DEFAULT 0,
  files_deleted INTEGER DEFAULT 0,

  -- Request metadata
  reason TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES auth.users(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_gdpr_deletion_requests_user ON gdpr_deletion_requests(user_id);
CREATE INDEX idx_gdpr_deletion_requests_org ON gdpr_deletion_requests(organization_id);
CREATE INDEX idx_gdpr_deletion_requests_status ON gdpr_deletion_requests(status);
CREATE INDEX idx_gdpr_deletion_requests_scheduled ON gdpr_deletion_requests(scheduled_execution_at) WHERE status = 'scheduled';

-- Comments
COMMENT ON TABLE gdpr_deletion_requests IS 'GDPR Article 17 - Right to Erasure deletion requests with grace periods';
COMMENT ON COLUMN gdpr_deletion_requests.grace_period_days IS 'Default 30 days grace period before execution';
COMMENT ON COLUMN gdpr_deletion_requests.scheduled_execution_at IS 'When the deletion will be executed (after grace period)';
COMMENT ON COLUMN gdpr_deletion_requests.records_anonymized IS 'Number of database records anonymized';
COMMENT ON COLUMN gdpr_deletion_requests.files_deleted IS 'Number of files deleted from storage';

-- =====================================================
-- 2. Add personal_data_anonymized flags to existing tables
-- =====================================================

-- Add flag to employees table (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'employees' AND column_name = 'personal_data_anonymized'
  ) THEN
    ALTER TABLE employees ADD COLUMN personal_data_anonymized BOOLEAN DEFAULT FALSE;
    CREATE INDEX idx_employees_anonymized ON employees(personal_data_anonymized);
  END IF;
END $$;

-- Add flag to medical_records table (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'medical_records' AND column_name = 'personal_data_anonymized'
  ) THEN
    ALTER TABLE medical_records ADD COLUMN personal_data_anonymized BOOLEAN DEFAULT FALSE;
    CREATE INDEX idx_medical_records_anonymized ON medical_records(personal_data_anonymized);
  END IF;
END $$;

-- Add deleted_at to memberships (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'memberships' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE memberships ADD COLUMN deleted_at TIMESTAMPTZ;
    CREATE INDEX idx_memberships_deleted_at ON memberships(deleted_at) WHERE deleted_at IS NOT NULL;
  END IF;
END $$;

-- Add deleted_at to generated_documents (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generated_documents' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE generated_documents ADD COLUMN deleted_at TIMESTAMPTZ;
    CREATE INDEX idx_generated_documents_deleted_at ON generated_documents(deleted_at) WHERE deleted_at IS NOT NULL;
  END IF;
END $$;

-- =====================================================
-- 3. RLS Policies
-- =====================================================

ALTER TABLE gdpr_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own deletion requests
CREATE POLICY "Users can view own deletion requests"
  ON gdpr_deletion_requests FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() = requested_by
  );

-- Policy: Users can create deletion requests for themselves
CREATE POLICY "Users can create own deletion requests"
  ON gdpr_deletion_requests FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    auth.uid() = requested_by
  );

-- Policy: Admins can view all deletion requests in their org
CREATE POLICY "Admins can view org deletion requests"
  ON gdpr_deletion_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
        AND ur.organization_id = gdpr_deletion_requests.organization_id
        AND r.name IN ('super_admin', 'consultant_ssm', 'firma_admin')
    )
  );

-- Policy: Admins can update deletion requests in their org
CREATE POLICY "Admins can update deletion requests"
  ON gdpr_deletion_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
        AND ur.organization_id = gdpr_deletion_requests.organization_id
        AND r.name IN ('super_admin', 'consultant_ssm')
    )
  );

-- Policy: Service role can execute scheduled deletions (cron job)
CREATE POLICY "Service role can execute deletions"
  ON gdpr_deletion_requests FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- 4. Function: Update updated_at timestamp
-- =====================================================

CREATE OR REPLACE FUNCTION update_gdpr_deletion_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_gdpr_deletion_requests_updated_at
  BEFORE UPDATE ON gdpr_deletion_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_gdpr_deletion_requests_updated_at();

-- =====================================================
-- 5. Function: Prevent deletion of completed requests
-- =====================================================

CREATE OR REPLACE FUNCTION prevent_deletion_of_completed_requests()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'completed' THEN
    RAISE EXCEPTION 'Cannot delete or modify completed deletion requests (audit trail)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_deletion_of_completed
  BEFORE UPDATE OR DELETE ON gdpr_deletion_requests
  FOR EACH ROW
  EXECUTE FUNCTION prevent_deletion_of_completed_requests();

-- =====================================================
-- 6. View: Active deletion requests (admin dashboard)
-- =====================================================

CREATE OR REPLACE VIEW vw_active_deletion_requests AS
SELECT
  dr.id,
  dr.user_id,
  dr.organization_id,
  p.full_name AS user_name,
  p.email AS user_email,
  dr.status,
  dr.grace_period_days,
  dr.scheduled_execution_at,
  dr.reason,
  dr.created_at,
  -- Calculate days remaining
  CASE
    WHEN dr.status = 'scheduled' THEN
      EXTRACT(DAYS FROM (dr.scheduled_execution_at - NOW()))::INTEGER
    ELSE NULL
  END AS days_remaining,
  -- Requester info
  req_p.full_name AS requested_by_name,
  req_p.email AS requested_by_email
FROM gdpr_deletion_requests dr
LEFT JOIN profiles p ON dr.user_id = p.id
LEFT JOIN profiles req_p ON dr.requested_by = req_p.id
WHERE dr.status IN ('pending', 'scheduled', 'in_progress')
ORDER BY dr.scheduled_execution_at ASC;

COMMENT ON VIEW vw_active_deletion_requests IS 'Active GDPR deletion requests with user details';

-- =====================================================
-- 7. Grant permissions
-- =====================================================

-- Grant access to authenticated users
GRANT SELECT, INSERT ON gdpr_deletion_requests TO authenticated;
GRANT SELECT ON vw_active_deletion_requests TO authenticated;

-- Service role has full access (for cron jobs)
GRANT ALL ON gdpr_deletion_requests TO service_role;

-- =====================================================
-- 8. Sample data (for testing in dev only)
-- =====================================================

-- Uncomment for development testing:
-- INSERT INTO gdpr_deletion_requests (user_id, organization_id, requested_by, status, grace_period_days, scheduled_execution_at, reason)
-- VALUES (
--   'sample-user-id',
--   'sample-org-id',
--   'sample-user-id',
--   'scheduled',
--   30,
--   NOW() + INTERVAL '30 days',
--   'User requested data deletion per GDPR Article 17'
-- );
