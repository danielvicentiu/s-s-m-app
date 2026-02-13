-- Migration: Create alerts table
-- Description: Alert system for SSM/PSI compliance monitoring
-- Created: 2026-02-13

-- Create severity enum
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Create alert_type enum
CREATE TYPE alert_type AS ENUM (
  'medical_exam_expiring',
  'medical_exam_expired',
  'training_expiring',
  'training_expired',
  'equipment_inspection_due',
  'equipment_inspection_overdue',
  'document_expiring',
  'document_expired',
  'penalty_warning',
  'compliance_issue',
  'other'
);

-- Create alerts table
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Alert details
  type alert_type NOT NULL,
  severity alert_severity NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Entity references (flexible - at least one should be set)
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  medical_record_id UUID REFERENCES medical_records(id) ON DELETE CASCADE,
  training_id UUID REFERENCES trainings(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,

  -- Resolution tracking
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  resolution_notes TEXT,

  -- Notification tracking
  is_notified BOOLEAN NOT NULL DEFAULT false,
  notified_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT valid_severity CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  CONSTRAINT resolved_fields_consistency CHECK (
    (is_resolved = false AND resolved_at IS NULL AND resolved_by IS NULL) OR
    (is_resolved = true AND resolved_at IS NOT NULL AND resolved_by IS NOT NULL)
  )
);

-- Add updated_at trigger
CREATE TRIGGER set_alerts_updated_at
  BEFORE UPDATE ON alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_alerts_organization_id ON alerts(organization_id);
CREATE INDEX idx_alerts_type ON alerts(type);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_is_resolved ON alerts(is_resolved);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX idx_alerts_employee_id ON alerts(employee_id) WHERE employee_id IS NOT NULL;
CREATE INDEX idx_alerts_medical_record_id ON alerts(medical_record_id) WHERE medical_record_id IS NOT NULL;
CREATE INDEX idx_alerts_training_id ON alerts(training_id) WHERE training_id IS NOT NULL;
CREATE INDEX idx_alerts_equipment_id ON alerts(equipment_id) WHERE equipment_id IS NOT NULL;
CREATE INDEX idx_alerts_document_id ON alerts(document_id) WHERE document_id IS NOT NULL;

-- Composite indexes for common queries
CREATE INDEX idx_alerts_org_unresolved ON alerts(organization_id, is_resolved) WHERE is_resolved = false;
CREATE INDEX idx_alerts_org_severity ON alerts(organization_id, severity, created_at DESC);

-- Enable Row Level Security
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view alerts for their organization
CREATE POLICY "Users can view alerts for their organization"
  ON alerts
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Admins and consultants can insert alerts
CREATE POLICY "Admins and consultants can create alerts"
  ON alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- RLS Policy: Admins and consultants can update alerts (resolve them)
CREATE POLICY "Admins and consultants can update alerts"
  ON alerts
  FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role IN ('consultant', 'firma_admin')
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- RLS Policy: Only consultants can delete alerts
CREATE POLICY "Consultants can delete alerts"
  ON alerts
  FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'consultant'
    )
  );

-- Add helpful comment
COMMENT ON TABLE alerts IS 'Alert system for SSM/PSI compliance monitoring and notifications';
COMMENT ON COLUMN alerts.severity IS 'Alert severity level: low, medium, high, critical';
COMMENT ON COLUMN alerts.type IS 'Alert type category for filtering and routing';
COMMENT ON COLUMN alerts.metadata IS 'Additional flexible data storage (e.g., expiry dates, thresholds)';
