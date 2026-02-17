-- Near-Miss Reporting Module Migration
-- Created: 2026-02-17
-- Purpose: Enable near-miss incident reporting for SSM/PSI compliance

-- Create near_miss_reports table
CREATE TABLE IF NOT EXISTS near_miss_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  report_number TEXT NOT NULL,
  reported_by TEXT NOT NULL,
  reported_by_user_id UUID REFERENCES auth.users(id),
  incident_date DATE NOT NULL,
  incident_time TIME,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  potential_severity TEXT NOT NULL CHECK (potential_severity IN ('minor', 'moderate', 'major', 'critical', 'fatal')),
  category TEXT NOT NULL CHECK (category IN (
    'cadere_nivel', 'cadere_inaltime', 'lovire', 'taiere', 'electrocutare',
    'substante_chimice', 'incendiu', 'explozie', 'alunecare', 'prindere_echipament',
    'ergonomic', 'psihosocial', 'transport', 'altul'
  )),
  witnesses TEXT[] DEFAULT '{}',
  immediate_actions TEXT,
  root_cause TEXT,
  corrective_actions TEXT,
  responsible_person TEXT,
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'raportat' CHECK (status IN (
    'raportat', 'in_investigare', 'masuri_aplicate', 'inchis', 'anulat'
  )),
  photos_paths TEXT[] DEFAULT '{}',
  investigation_notes TEXT,
  closed_by UUID REFERENCES auth.users(id),
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE near_miss_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policy: users can access reports from their organizations
CREATE POLICY "near_miss_org" ON near_miss_reports FOR ALL USING (
  organization_id IN (SELECT organization_id FROM memberships WHERE user_id = auth.uid())
);

-- Indexes for performance
CREATE INDEX idx_near_miss_org ON near_miss_reports(organization_id);
CREATE INDEX idx_near_miss_date ON near_miss_reports(incident_date DESC);
CREATE INDEX idx_near_miss_status ON near_miss_reports(status);
CREATE INDEX idx_near_miss_severity ON near_miss_reports(potential_severity);

-- Function to auto-generate report number
CREATE OR REPLACE FUNCTION generate_near_miss_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.report_number := 'NM-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(
    (SELECT COUNT(*) + 1 FROM near_miss_reports
     WHERE organization_id = NEW.organization_id
     AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW()))::TEXT,
    4, '0'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate report number on insert
CREATE TRIGGER trigger_near_miss_number
BEFORE INSERT ON near_miss_reports
FOR EACH ROW
WHEN (NEW.report_number IS NULL OR NEW.report_number = '')
EXECUTE FUNCTION generate_near_miss_number();

-- Trigger to update updated_at timestamp
CREATE TRIGGER trigger_near_miss_updated_at
BEFORE UPDATE ON near_miss_reports
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
