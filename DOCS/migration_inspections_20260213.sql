-- Migration: Adăugare tabele pentru Inspecții Interne SSM
-- Data: 13 Februarie 2026
-- Feature: Checklist-uri 30 puncte verificare conformitate SSM

-- 1. Tabela pentru inspecții SSM
CREATE TABLE IF NOT EXISTS ssm_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  inspection_date DATE NOT NULL DEFAULT CURRENT_DATE,
  inspector_name TEXT NOT NULL,
  inspector_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed', 'approved')),
  score INTEGER,
  total_points INTEGER NOT NULL DEFAULT 30,
  conformity_percentage NUMERIC(5,2),
  general_observations TEXT,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabela pentru checkpoint-uri inspecție
CREATE TABLE IF NOT EXISTS inspection_checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID NOT NULL REFERENCES ssm_inspections(id) ON DELETE CASCADE,
  checkpoint_number INTEGER NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('conform', 'neconform', 'neaplicabil')),
  observations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indecși pentru performanță
CREATE INDEX idx_ssm_inspections_org ON ssm_inspections(organization_id);
CREATE INDEX idx_ssm_inspections_date ON ssm_inspections(inspection_date DESC);
CREATE INDEX idx_ssm_inspections_status ON ssm_inspections(status);
CREATE INDEX idx_inspection_checkpoints_inspection ON inspection_checkpoints(inspection_id);

-- Trigger pentru updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ssm_inspections_updated_at
  BEFORE UPDATE ON ssm_inspections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inspection_checkpoints_updated_at
  BEFORE UPDATE ON inspection_checkpoints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE ssm_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_checkpoints ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view inspections for their organizations
CREATE POLICY "Users can view inspections for their organizations"
  ON ssm_inspections FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Policy: Consultants can insert inspections
CREATE POLICY "Consultants can insert inspections"
  ON ssm_inspections FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE user_id = auth.uid()
        AND organization_id = ssm_inspections.organization_id
        AND is_active = true
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- Policy: Consultants can update inspections
CREATE POLICY "Consultants can update inspections"
  ON ssm_inspections FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE user_id = auth.uid()
        AND organization_id = ssm_inspections.organization_id
        AND is_active = true
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- Policy: Users can view checkpoints for their inspections
CREATE POLICY "Users can view checkpoints for their inspections"
  ON inspection_checkpoints FOR SELECT
  USING (
    inspection_id IN (
      SELECT id FROM ssm_inspections
      WHERE organization_id IN (
        SELECT organization_id
        FROM memberships
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

-- Policy: Consultants can insert checkpoints
CREATE POLICY "Consultants can insert checkpoints"
  ON inspection_checkpoints FOR INSERT
  WITH CHECK (
    inspection_id IN (
      SELECT id FROM ssm_inspections
      WHERE organization_id IN (
        SELECT organization_id
        FROM memberships
        WHERE user_id = auth.uid() AND is_active = true
          AND role IN ('consultant', 'firma_admin')
      )
    )
  );

-- Policy: Consultants can update checkpoints
CREATE POLICY "Consultants can update checkpoints"
  ON inspection_checkpoints FOR UPDATE
  USING (
    inspection_id IN (
      SELECT id FROM ssm_inspections
      WHERE organization_id IN (
        SELECT organization_id
        FROM memberships
        WHERE user_id = auth.uid() AND is_active = true
          AND role IN ('consultant', 'firma_admin')
      )
    )
  );

-- Comentarii
COMMENT ON TABLE ssm_inspections IS 'Inspecții interne SSM cu checklist 30 puncte verificare';
COMMENT ON TABLE inspection_checkpoints IS 'Detalii checkpoint-uri per inspecție SSM';
COMMENT ON COLUMN ssm_inspections.conformity_percentage IS 'Procent conformitate calculat automat';
COMMENT ON COLUMN inspection_checkpoints.status IS 'conform | neconform | neaplicabil';
