-- Tenant Provisioning Support Tables
-- Created: 2026-02-13
-- Purpose: Tables needed for automated tenant setup

-- ============================================================
-- DEPARTMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  code VARCHAR(50) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, code)
);

-- Enable RLS
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view departments in their organization"
  ON departments FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can insert departments"
  ON departments FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid()
        AND role IN ('consultant', 'firma_admin')
        AND is_active = true
    )
  );

CREATE POLICY "Admins can update departments"
  ON departments FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid()
        AND role IN ('consultant', 'firma_admin')
        AND is_active = true
    )
  );

CREATE POLICY "Admins can delete departments"
  ON departments FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid()
        AND role IN ('consultant', 'firma_admin')
        AND is_active = true
    )
  );

-- Indexes
CREATE INDEX idx_departments_organization ON departments(organization_id);
CREATE INDEX idx_departments_active ON departments(is_active) WHERE is_active = true;

-- ============================================================
-- ALERT RULES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  alert_type VARCHAR(100) NOT NULL,
  days_before INTEGER NOT NULL,
  severity VARCHAR(50) NOT NULL CHECK (severity IN ('info', 'warning', 'critical', 'expired')),
  is_enabled BOOLEAN DEFAULT true,
  notify_channels TEXT[] DEFAULT ARRAY['email']::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, alert_type, days_before)
);

-- Enable RLS
ALTER TABLE alert_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view alert rules in their organization"
  ON alert_rules FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can manage alert rules"
  ON alert_rules FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid()
        AND role IN ('consultant', 'firma_admin')
        AND is_active = true
    )
  );

-- Indexes
CREATE INDEX idx_alert_rules_organization ON alert_rules(organization_id);
CREATE INDEX idx_alert_rules_enabled ON alert_rules(is_enabled) WHERE is_enabled = true;

-- ============================================================
-- COMPLIANCE CHECKLIST TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS compliance_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL CHECK (category IN ('SSM', 'PSI', 'GDPR', 'ADMIN', 'OTHER')),
  title VARCHAR(300) NOT NULL,
  description TEXT,
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked', 'cancelled')),
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE compliance_checklist ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view compliance items in their organization"
  ON compliance_checklist FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can insert compliance items"
  ON compliance_checklist FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid()
        AND role IN ('consultant', 'firma_admin')
        AND is_active = true
    )
  );

CREATE POLICY "Users can update compliance items"
  ON compliance_checklist FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can delete compliance items"
  ON compliance_checklist FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid()
        AND role IN ('consultant', 'firma_admin')
        AND is_active = true
    )
  );

-- Indexes
CREATE INDEX idx_compliance_organization ON compliance_checklist(organization_id);
CREATE INDEX idx_compliance_status ON compliance_checklist(status);
CREATE INDEX idx_compliance_priority ON compliance_checklist(priority);
CREATE INDEX idx_compliance_due_date ON compliance_checklist(due_date) WHERE status != 'completed';

-- ============================================================
-- COMMENTS
-- ============================================================
COMMENT ON TABLE departments IS 'Departamente organizaționale pentru structurarea angajaților';
COMMENT ON TABLE alert_rules IS 'Reguli personalizabile de alertare per organizație';
COMMENT ON TABLE compliance_checklist IS 'Lista de verificare conformitate SSM/PSI per organizație';
