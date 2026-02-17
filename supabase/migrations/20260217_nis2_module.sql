-- ============================================================
-- S-S-M.RO — NIS2 Cybersecurity Compliance Module
-- Migration: 20260217_nis2_module.sql
-- Created: 2026-02-17
-- ============================================================

-- NIS2 Self-Assessment
CREATE TABLE IF NOT EXISTS nis2_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  nis2_category TEXT NOT NULL CHECK (nis2_category IN ('essential', 'important', 'out_of_scope')),
  sector TEXT,
  sub_sector TEXT,
  employee_count_range TEXT CHECK (employee_count_range IN ('1-49', '50-249', '250+')),
  annual_turnover_range TEXT CHECK (annual_turnover_range IN ('under_10m', '10m_50m', 'over_50m')),
  overall_score INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'approved')),
  completed_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- NIS2 Checklist Items (per assessment)
CREATE TABLE IF NOT EXISTS nis2_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES nis2_assessments(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN (
    'governance', 'risk_management', 'incident_handling',
    'business_continuity', 'supply_chain', 'network_security',
    'vulnerability_management', 'crypto_encryption', 'hr_security',
    'access_control', 'asset_management', 'training_awareness'
  )),
  item_code TEXT NOT NULL,
  item_text TEXT NOT NULL,
  is_compliant BOOLEAN DEFAULT false,
  evidence TEXT,
  evidence_path TEXT,
  responsible_person TEXT,
  deadline DATE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- NIS2 Incidents (cyber security incidents)
CREATE TABLE IF NOT EXISTS nis2_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  incident_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  incident_date TIMESTAMPTZ NOT NULL,
  detected_date TIMESTAMPTZ NOT NULL,
  reported_date TIMESTAMPTZ,
  incident_type TEXT NOT NULL CHECK (incident_type IN (
    'ransomware', 'data_breach', 'ddos', 'phishing',
    'malware', 'insider_threat', 'supply_chain_attack',
    'unauthorized_access', 'system_failure', 'other'
  )),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  is_significant BOOLEAN DEFAULT false,
  affected_systems TEXT[] DEFAULT '{}',
  affected_users_count INTEGER DEFAULT 0,
  root_cause TEXT,
  immediate_actions TEXT,
  corrective_actions TEXT,
  reported_to_authority BOOLEAN DEFAULT false,
  authority_report_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'detected' CHECK (status IN (
    'detected', 'investigating', 'contained', 'eradicated', 'recovered', 'closed'
  )),
  reported_by UUID REFERENCES auth.users(id),
  closed_by UUID REFERENCES auth.users(id),
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE nis2_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE nis2_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE nis2_incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nis2_assessments_org" ON nis2_assessments FOR ALL USING (
  organization_id IN (SELECT organization_id FROM memberships WHERE user_id = auth.uid())
);

CREATE POLICY "nis2_checklist_org" ON nis2_checklist_items FOR ALL USING (
  assessment_id IN (SELECT id FROM nis2_assessments WHERE organization_id IN (
    SELECT organization_id FROM memberships WHERE user_id = auth.uid()
  ))
);

CREATE POLICY "nis2_incidents_org" ON nis2_incidents FOR ALL USING (
  organization_id IN (SELECT organization_id FROM memberships WHERE user_id = auth.uid())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_nis2_assessments_org ON nis2_assessments(organization_id);
CREATE INDEX IF NOT EXISTS idx_nis2_checklist_assessment ON nis2_checklist_items(assessment_id);
CREATE INDEX IF NOT EXISTS idx_nis2_checklist_category ON nis2_checklist_items(category);
CREATE INDEX IF NOT EXISTS idx_nis2_incidents_org ON nis2_incidents(organization_id);
CREATE INDEX IF NOT EXISTS idx_nis2_incidents_date ON nis2_incidents(incident_date DESC);
CREATE INDEX IF NOT EXISTS idx_nis2_incidents_severity ON nis2_incidents(severity);

-- Auto-generate incident number
CREATE OR REPLACE FUNCTION generate_nis2_incident_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.incident_number := 'NIS2-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(
    (SELECT COUNT(*) + 1 FROM nis2_incidents
     WHERE organization_id = NEW.organization_id
     AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW()))::TEXT,
    4, '0'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_nis2_incident_number
BEFORE INSERT ON nis2_incidents
FOR EACH ROW
WHEN (NEW.incident_number IS NULL OR NEW.incident_number = '')
EXECUTE FUNCTION generate_nis2_incident_number();

-- Updated_at triggers (uses existing update_updated_at_column function)
CREATE TRIGGER update_nis2_assessments_updated_at
BEFORE UPDATE ON nis2_assessments FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nis2_checklist_updated_at
BEFORE UPDATE ON nis2_checklist_items FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nis2_incidents_updated_at
BEFORE UPDATE ON nis2_incidents FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
