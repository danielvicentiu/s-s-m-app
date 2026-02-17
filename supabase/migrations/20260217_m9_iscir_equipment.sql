-- M9_ISCIR Equipment Tracking Migration
-- Created: 2026-02-17
-- Purpose: Create tables for ISCIR (pressure equipment) tracking and verification

-- =====================================================
-- Table: iscir_equipment
-- =====================================================
CREATE TABLE IF NOT EXISTS iscir_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  equipment_type TEXT NOT NULL CHECK (equipment_type IN (
    'cazan',
    'recipient_presiune',
    'lift',
    'macara',
    'stivuitor',
    'instalatie_gpl',
    'compresor',
    'autoclave',
    'altul'
  )),
  registration_number TEXT,
  identifier TEXT NOT NULL,
  manufacturer TEXT,
  model TEXT,
  serial_number TEXT,
  manufacture_year INTEGER,
  installation_date DATE,
  location TEXT,
  capacity TEXT,
  rsvti_responsible TEXT,
  last_verification_date DATE,
  next_verification_date DATE NOT NULL,
  verification_interval_months INTEGER NOT NULL DEFAULT 12,
  authorization_number TEXT,
  authorization_expiry DATE,
  status TEXT NOT NULL DEFAULT 'activ' CHECK (status IN (
    'activ',
    'expirat',
    'in_verificare',
    'oprit',
    'casat'
  )),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- Table: iscir_verifications
-- =====================================================
CREATE TABLE IF NOT EXISTS iscir_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID NOT NULL REFERENCES iscir_equipment(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  verification_date DATE NOT NULL,
  verification_type TEXT NOT NULL CHECK (verification_type IN (
    'periodica',
    'accidentala',
    'punere_in_functiune',
    'reparatie',
    'modernizare'
  )),
  inspector_name TEXT NOT NULL,
  inspector_legitimation TEXT,
  result TEXT NOT NULL CHECK (result IN (
    'admis',
    'respins',
    'admis_conditionat'
  )),
  next_verification_date DATE,
  bulletin_number TEXT NOT NULL,
  bulletin_storage_path TEXT,
  observations TEXT,
  prescriptions TEXT,
  deadline_prescriptions DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- View: v_iscir_expiring
-- =====================================================
CREATE OR REPLACE VIEW v_iscir_expiring AS
SELECT
  e.*,
  o.name AS org_name,
  o.cui AS org_cui,
  e.next_verification_date - CURRENT_DATE AS days_until_expiry,
  CASE
    WHEN e.next_verification_date < CURRENT_DATE THEN 'expirat'
    WHEN e.next_verification_date - CURRENT_DATE <= 30 THEN 'urgent'
    WHEN e.next_verification_date - CURRENT_DATE <= 90 THEN 'atentie'
    ELSE 'ok'
  END AS alert_level
FROM iscir_equipment e
JOIN organizations o ON o.id = e.organization_id
WHERE e.status IN ('activ', 'in_verificare')
ORDER BY e.next_verification_date ASC;

-- =====================================================
-- Indexes
-- =====================================================
CREATE INDEX idx_iscir_equipment_org ON iscir_equipment(organization_id);
CREATE INDEX idx_iscir_equipment_next ON iscir_equipment(next_verification_date)
  WHERE status IN ('activ', 'in_verificare');
CREATE INDEX idx_iscir_equipment_org_status ON iscir_equipment(organization_id, status);
CREATE INDEX idx_iscir_verifications_eq ON iscir_verifications(equipment_id);
CREATE INDEX idx_iscir_verifications_org_date ON iscir_verifications(organization_id, verification_date DESC);

-- =====================================================
-- RLS Policies: iscir_equipment
-- =====================================================
ALTER TABLE iscir_equipment ENABLE ROW LEVEL SECURITY;

-- Users can view equipment from their organizations
CREATE POLICY iscir_equipment_select ON iscir_equipment
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships WHERE user_id = auth.uid()
    )
  );

-- Consultants and admins can insert equipment
CREATE POLICY iscir_equipment_insert ON iscir_equipment
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT m.organization_id FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- Consultants and admins can update equipment
CREATE POLICY iscir_equipment_update ON iscir_equipment
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT m.organization_id FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- Consultants and admins can delete equipment
CREATE POLICY iscir_equipment_delete ON iscir_equipment
  FOR DELETE
  USING (
    organization_id IN (
      SELECT m.organization_id FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- =====================================================
-- RLS Policies: iscir_verifications
-- =====================================================
ALTER TABLE iscir_verifications ENABLE ROW LEVEL SECURITY;

-- Users can view verifications from their organizations
CREATE POLICY iscir_verifications_select ON iscir_verifications
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships WHERE user_id = auth.uid()
    )
  );

-- Consultants and admins can insert verifications
CREATE POLICY iscir_verifications_insert ON iscir_verifications
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT m.organization_id FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- Consultants and admins can update verifications
CREATE POLICY iscir_verifications_update ON iscir_verifications
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT m.organization_id FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- Consultants and admins can delete verifications
CREATE POLICY iscir_verifications_delete ON iscir_verifications
  FOR DELETE
  USING (
    organization_id IN (
      SELECT m.organization_id FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- =====================================================
-- Trigger: updated_at on iscir_equipment
-- =====================================================
CREATE OR REPLACE FUNCTION update_iscir_equipment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_iscir_equipment_updated_at
  BEFORE UPDATE ON iscir_equipment
  FOR EACH ROW
  EXECUTE FUNCTION update_iscir_equipment_updated_at();

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON TABLE iscir_equipment IS 'Echipamente sub presiune ISCIR (cazane, recipiente, lifturi, etc.) cu date verificări și alertare expirare';
COMMENT ON TABLE iscir_verifications IS 'Înregistrări verificări ISCIR cu rezultate admis/respins și buletine verificare';
COMMENT ON VIEW v_iscir_expiring IS 'View cu nivel alertă (expirat, urgent, atentie, ok) pentru echipamente ISCIR';
COMMENT ON FUNCTION update_iscir_equipment_updated_at() IS 'Actualizează automat updated_at la modificare echipament ISCIR';
