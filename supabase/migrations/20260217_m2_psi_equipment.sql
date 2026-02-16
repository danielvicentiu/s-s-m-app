-- M2_PSI Equipment Tracking Migration
-- Created: 2026-02-17
-- Purpose: Create tables for PSI (fire safety) equipment and inspection tracking

-- =====================================================
-- Table: psi_equipment
-- =====================================================
CREATE TABLE IF NOT EXISTS psi_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  equipment_type TEXT NOT NULL CHECK (equipment_type IN (
    'stingator',
    'hidrant_interior',
    'hidrant_exterior',
    'detector_fum',
    'detector_co',
    'alarma_incendiu',
    'iluminat_urgenta',
    'sistem_stingere',
    'altul'
  )),
  identifier TEXT NOT NULL,
  location TEXT,
  manufacturer TEXT,
  model TEXT,
  manufacture_date DATE,
  installation_date DATE,
  last_inspection_date DATE,
  next_inspection_date DATE,
  capacity TEXT,
  agent_type TEXT,
  status TEXT NOT NULL DEFAULT 'operational' CHECK (status IN (
    'operational',
    'needs_inspection',
    'needs_repair',
    'out_of_service'
  )),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- Table: psi_inspections
-- =====================================================
CREATE TABLE IF NOT EXISTS psi_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID NOT NULL REFERENCES psi_equipment(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  inspection_date DATE NOT NULL,
  inspector_name TEXT NOT NULL,
  inspector_license TEXT,
  result TEXT NOT NULL CHECK (result IN (
    'conform',
    'conform_cu_observatii',
    'neconform'
  )),
  findings TEXT,
  next_inspection_date DATE NOT NULL,
  bulletin_number TEXT,
  bulletin_storage_path TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- View: v_psi_expiring
-- =====================================================
CREATE OR REPLACE VIEW v_psi_expiring AS
SELECT
  e.*,
  o.name AS organization_name,
  o.cui AS organization_cui,
  e.next_inspection_date - CURRENT_DATE AS days_until_due,
  CASE
    WHEN e.next_inspection_date < CURRENT_DATE THEN 'expired'
    WHEN e.next_inspection_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'critical'
    WHEN e.next_inspection_date <= CURRENT_DATE + INTERVAL '60 days' THEN 'warning'
    WHEN e.next_inspection_date <= CURRENT_DATE + INTERVAL '90 days' THEN 'info'
    ELSE 'ok'
  END AS alert_level
FROM psi_equipment e
JOIN organizations o ON o.id = e.organization_id
WHERE e.status != 'out_of_service'
  AND e.next_inspection_date IS NOT NULL
ORDER BY e.next_inspection_date ASC;

-- =====================================================
-- Indexes
-- =====================================================
CREATE INDEX idx_psi_equipment_org_status ON psi_equipment(organization_id, status);
CREATE INDEX idx_psi_equipment_next_inspection ON psi_equipment(next_inspection_date)
  WHERE status != 'out_of_service' AND next_inspection_date IS NOT NULL;
CREATE INDEX idx_psi_inspections_equipment ON psi_inspections(equipment_id);
CREATE INDEX idx_psi_inspections_org_date ON psi_inspections(organization_id, inspection_date DESC);

-- =====================================================
-- RLS Policies: psi_equipment
-- =====================================================
ALTER TABLE psi_equipment ENABLE ROW LEVEL SECURITY;

-- Users can view equipment from their organizations
CREATE POLICY psi_equipment_select ON psi_equipment
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships WHERE user_id = auth.uid()
    )
  );

-- Consultants and admins can insert equipment
CREATE POLICY psi_equipment_insert ON psi_equipment
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT m.organization_id FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- Consultants and admins can update equipment
CREATE POLICY psi_equipment_update ON psi_equipment
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT m.organization_id FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- Consultants and admins can delete equipment
CREATE POLICY psi_equipment_delete ON psi_equipment
  FOR DELETE
  USING (
    organization_id IN (
      SELECT m.organization_id FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- =====================================================
-- RLS Policies: psi_inspections
-- =====================================================
ALTER TABLE psi_inspections ENABLE ROW LEVEL SECURITY;

-- Users can view inspections from their organizations
CREATE POLICY psi_inspections_select ON psi_inspections
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships WHERE user_id = auth.uid()
    )
  );

-- Consultants and admins can insert inspections
CREATE POLICY psi_inspections_insert ON psi_inspections
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT m.organization_id FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- Consultants and admins can update inspections
CREATE POLICY psi_inspections_update ON psi_inspections
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT m.organization_id FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- Consultants and admins can delete inspections
CREATE POLICY psi_inspections_delete ON psi_inspections
  FOR DELETE
  USING (
    organization_id IN (
      SELECT m.organization_id FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- =====================================================
-- Trigger: updated_at on psi_equipment
-- =====================================================
CREATE OR REPLACE FUNCTION update_psi_equipment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_psi_equipment_updated_at
  BEFORE UPDATE ON psi_equipment
  FOR EACH ROW
  EXECUTE FUNCTION update_psi_equipment_updated_at();

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON TABLE psi_equipment IS 'Echipamente PSI (stingătoare, hidranți, detectori) cu date inspecție și alertare expirare';
COMMENT ON TABLE psi_inspections IS 'Înregistrări inspecții PSI cu rezultate conform/neconform și buletine verificare';
COMMENT ON VIEW v_psi_expiring IS 'View cu nivel alertă (expired, critical, warning, info, ok) pentru echipamente PSI';
COMMENT ON FUNCTION update_psi_equipment_updated_at() IS 'Actualizează automat updated_at la modificare echipament PSI';
