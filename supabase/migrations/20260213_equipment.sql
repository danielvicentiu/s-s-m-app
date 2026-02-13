-- Migration: Equipment and Equipment Inspections Tables
-- Created: 2026-02-13
-- Description: Tabele pentru gestionarea echipamentelor SSM/PSI și inspecțiile acestora

-- =====================================================
-- 1. EQUIPMENT (echipamente SSM/PSI)
-- =====================================================
CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  equipment_type TEXT NOT NULL CHECK (equipment_type IN (
    'stingator',
    'trusa_prim_ajutor',
    'hidrant',
    'detector_fum',
    'detector_gaz',
    'iluminat_urgenta',
    'panou_semnalizare',
    'trusa_scule',
    'eip',
    'altul'
  )),
  description TEXT,
  location TEXT,
  serial_number TEXT,
  manufacturer TEXT,
  model TEXT,
  purchase_date DATE,
  installation_date DATE,
  warranty_expiry_date DATE,
  last_inspection_date DATE,
  next_inspection_date DATE,
  expiry_date DATE,
  inspection_frequency_months INTEGER DEFAULT 12,
  is_compliant BOOLEAN DEFAULT true,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'decommissioned')),
  notes TEXT,
  content_version INTEGER NOT NULL DEFAULT 1,
  legal_basis_version TEXT NOT NULL DEFAULT '1.0',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Indexuri pentru equipment
CREATE INDEX idx_equipment_organization ON equipment(organization_id);
CREATE INDEX idx_equipment_type ON equipment(equipment_type);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_next_inspection ON equipment(next_inspection_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_equipment_expiry ON equipment(expiry_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_equipment_deleted ON equipment(deleted_at);
CREATE INDEX idx_equipment_org_active ON equipment(organization_id, status) WHERE deleted_at IS NULL;

-- Comentarii pentru equipment
COMMENT ON TABLE equipment IS 'Echipamente SSM/PSI (stingătoare, trusă prim ajutor, detectori, etc.)';
COMMENT ON COLUMN equipment.equipment_type IS 'Tip echipament: stingator, trusa_prim_ajutor, hidrant, detector_fum, detector_gaz, iluminat_urgenta, panou_semnalizare, trusa_scule, eip, altul';
COMMENT ON COLUMN equipment.description IS 'Descriere detaliată echipament';
COMMENT ON COLUMN equipment.location IS 'Locația fizică a echipamentului (depozit, hală, birouri, etc.)';
COMMENT ON COLUMN equipment.serial_number IS 'Număr de serie unic';
COMMENT ON COLUMN equipment.inspection_frequency_months IS 'Frecvența inspecțiilor în luni (default: 12)';
COMMENT ON COLUMN equipment.is_compliant IS 'Flag dacă echipamentul este conform la ultima inspecție';
COMMENT ON COLUMN equipment.status IS 'Status: active, inactive, maintenance, decommissioned';
COMMENT ON COLUMN equipment.content_version IS 'Versiune conținut pentru audit trail';
COMMENT ON COLUMN equipment.legal_basis_version IS 'Versiune bază legală aplicabilă';
COMMENT ON COLUMN equipment.deleted_at IS 'Soft delete timestamp';

-- =====================================================
-- 2. EQUIPMENT_INSPECTIONS (istoricul inspecțiilor)
-- =====================================================
CREATE TABLE IF NOT EXISTS equipment_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  inspection_date DATE NOT NULL,
  inspection_type TEXT NOT NULL CHECK (inspection_type IN (
    'periodic',
    'initial',
    'repair',
    'incident',
    'audit',
    'decommission'
  )),
  inspector_name TEXT NOT NULL,
  inspector_company TEXT,
  inspector_license TEXT,
  result TEXT NOT NULL CHECK (result IN ('conform', 'neconform', 'conditii', 'casare')),
  findings TEXT,
  deficiencies JSONB,
  actions_required TEXT,
  next_inspection_date DATE,
  certificate_number TEXT,
  certificate_issued_date DATE,
  certificate_expiry_date DATE,
  cost DECIMAL(10,2),
  attachments JSONB,
  notes TEXT,
  content_version INTEGER NOT NULL DEFAULT 1,
  legal_basis_version TEXT NOT NULL DEFAULT '1.0',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Indexuri pentru equipment_inspections
CREATE INDEX idx_equipment_inspections_equipment ON equipment_inspections(equipment_id);
CREATE INDEX idx_equipment_inspections_organization ON equipment_inspections(organization_id);
CREATE INDEX idx_equipment_inspections_date ON equipment_inspections(inspection_date DESC);
CREATE INDEX idx_equipment_inspections_type ON equipment_inspections(inspection_type);
CREATE INDEX idx_equipment_inspections_result ON equipment_inspections(result);
CREATE INDEX idx_equipment_inspections_next_date ON equipment_inspections(next_inspection_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_equipment_inspections_deleted ON equipment_inspections(deleted_at);

-- Comentarii pentru equipment_inspections
COMMENT ON TABLE equipment_inspections IS 'Istoricul inspecțiilor pentru echipamente SSM/PSI';
COMMENT ON COLUMN equipment_inspections.inspection_type IS 'Tip inspecție: periodic, initial, repair, incident, audit, decommission';
COMMENT ON COLUMN equipment_inspections.inspector_name IS 'Nume inspector/tehnician autorizat';
COMMENT ON COLUMN equipment_inspections.inspector_license IS 'Număr licență/autorizație inspector';
COMMENT ON COLUMN equipment_inspections.result IS 'Rezultat: conform, neconform, conditii, casare';
COMMENT ON COLUMN equipment_inspections.deficiencies IS 'JSON cu lista deficiențelor identificate';
COMMENT ON COLUMN equipment_inspections.attachments IS 'JSON cu fișiere atașate (certificate, rapoarte, fotografii)';

-- =====================================================
-- 3. RLS POLICIES pentru EQUIPMENT
-- =====================================================

-- Enable RLS
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Policy: Consultanți pot vedea toate echipamentele organizațiilor lor
CREATE POLICY "Consultants can view all equipment of their organizations"
  ON equipment
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'consultant'
        AND is_active = true
    )
  );

-- Policy: Admini firmă pot vedea echipamentele organizației lor
CREATE POLICY "Firm admins can view their organization equipment"
  ON equipment
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'firma_admin'
        AND is_active = true
    )
  );

-- Policy: Angajați pot vedea echipamentele organizației lor
CREATE POLICY "Employees can view their organization equipment"
  ON equipment
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'angajat'
        AND is_active = true
    )
  );

-- Policy: Consultanți pot crea echipamente pentru organizațiile lor
CREATE POLICY "Consultants can create equipment for their organizations"
  ON equipment
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'consultant'
        AND is_active = true
    )
  );

-- Policy: Admini firmă pot crea echipamente pentru organizația lor
CREATE POLICY "Firm admins can create equipment for their organization"
  ON equipment
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'firma_admin'
        AND is_active = true
    )
  );

-- Policy: Consultanți pot actualiza echipamentele organizațiilor lor
CREATE POLICY "Consultants can update equipment of their organizations"
  ON equipment
  FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'consultant'
        AND is_active = true
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'consultant'
        AND is_active = true
    )
  );

-- Policy: Admini firmă pot actualiza echipamentele organizației lor
CREATE POLICY "Firm admins can update equipment of their organization"
  ON equipment
  FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'firma_admin'
        AND is_active = true
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'firma_admin'
        AND is_active = true
    )
  );

-- Policy: Consultanți pot șterge (soft delete) echipamente
CREATE POLICY "Consultants can delete equipment of their organizations"
  ON equipment
  FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'consultant'
        AND is_active = true
    )
  );

-- =====================================================
-- 4. RLS POLICIES pentru EQUIPMENT_INSPECTIONS
-- =====================================================

-- Enable RLS
ALTER TABLE equipment_inspections ENABLE ROW LEVEL SECURITY;

-- Policy: Consultanți pot vedea toate inspecțiile echipamentelor organizațiilor lor
CREATE POLICY "Consultants can view all inspections of their organizations"
  ON equipment_inspections
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'consultant'
        AND is_active = true
    )
  );

-- Policy: Admini firmă pot vedea inspecțiile organizației lor
CREATE POLICY "Firm admins can view their organization inspections"
  ON equipment_inspections
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'firma_admin'
        AND is_active = true
    )
  );

-- Policy: Angajați pot vedea inspecțiile organizației lor
CREATE POLICY "Employees can view their organization inspections"
  ON equipment_inspections
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'angajat'
        AND is_active = true
    )
  );

-- Policy: Consultanți pot crea inspecții pentru organizațiile lor
CREATE POLICY "Consultants can create inspections for their organizations"
  ON equipment_inspections
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'consultant'
        AND is_active = true
    )
  );

-- Policy: Admini firmă pot crea inspecții pentru organizația lor
CREATE POLICY "Firm admins can create inspections for their organization"
  ON equipment_inspections
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'firma_admin'
        AND is_active = true
    )
  );

-- Policy: Consultanți pot actualiza inspecțiile organizațiilor lor
CREATE POLICY "Consultants can update inspections of their organizations"
  ON equipment_inspections
  FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'consultant'
        AND is_active = true
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'consultant'
        AND is_active = true
    )
  );

-- Policy: Admini firmă pot actualiza inspecțiile organizației lor
CREATE POLICY "Firm admins can update inspections of their organization"
  ON equipment_inspections
  FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'firma_admin'
        AND is_active = true
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'firma_admin'
        AND is_active = true
    )
  );

-- Policy: Consultanți pot șterge (soft delete) inspecții
CREATE POLICY "Consultants can delete inspections of their organizations"
  ON equipment_inspections
  FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'consultant'
        AND is_active = true
    )
  );

-- =====================================================
-- 5. TRIGGERS pentru updated_at
-- =====================================================

-- Trigger pentru equipment
CREATE OR REPLACE FUNCTION update_equipment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_equipment_updated_at
  BEFORE UPDATE ON equipment
  FOR EACH ROW
  EXECUTE FUNCTION update_equipment_updated_at();

-- Trigger pentru equipment_inspections
CREATE OR REPLACE FUNCTION update_equipment_inspections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_equipment_inspections_updated_at
  BEFORE UPDATE ON equipment_inspections
  FOR EACH ROW
  EXECUTE FUNCTION update_equipment_inspections_updated_at();

-- =====================================================
-- 6. TRIGGER pentru actualizare automată equipment
-- =====================================================

-- Trigger care actualizează automat câmpurile echipamentului după o inspecție nouă
CREATE OR REPLACE FUNCTION update_equipment_after_inspection()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizează echipamentul cu datele din ultima inspecție
  UPDATE equipment
  SET
    last_inspection_date = NEW.inspection_date,
    next_inspection_date = NEW.next_inspection_date,
    is_compliant = (NEW.result = 'conform'),
    updated_at = now()
  WHERE id = NEW.equipment_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_equipment_after_inspection
  AFTER INSERT ON equipment_inspections
  FOR EACH ROW
  EXECUTE FUNCTION update_equipment_after_inspection();

-- =====================================================
-- 7. FUNCȚII HELPER
-- =====================================================

-- Funcție pentru a obține echipamente cu inspecții expirate
CREATE OR REPLACE FUNCTION get_expired_equipment(org_id UUID DEFAULT NULL)
RETURNS TABLE (
  equipment_id UUID,
  equipment_type TEXT,
  description TEXT,
  location TEXT,
  next_inspection_date DATE,
  days_overdue INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.equipment_type,
    e.description,
    e.location,
    e.next_inspection_date,
    (CURRENT_DATE - e.next_inspection_date)::INTEGER as days_overdue
  FROM equipment e
  WHERE
    e.deleted_at IS NULL
    AND e.status = 'active'
    AND e.next_inspection_date < CURRENT_DATE
    AND (org_id IS NULL OR e.organization_id = org_id)
  ORDER BY e.next_inspection_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funcție pentru a obține echipamente cu inspecții ce expiră în N zile
CREATE OR REPLACE FUNCTION get_upcoming_inspections(days_ahead INTEGER DEFAULT 30, org_id UUID DEFAULT NULL)
RETURNS TABLE (
  equipment_id UUID,
  equipment_type TEXT,
  description TEXT,
  location TEXT,
  next_inspection_date DATE,
  days_until_inspection INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.equipment_type,
    e.description,
    e.location,
    e.next_inspection_date,
    (e.next_inspection_date - CURRENT_DATE)::INTEGER as days_until_inspection
  FROM equipment e
  WHERE
    e.deleted_at IS NULL
    AND e.status = 'active'
    AND e.next_inspection_date BETWEEN CURRENT_DATE AND CURRENT_DATE + days_ahead
    AND (org_id IS NULL OR e.organization_id = org_id)
  ORDER BY e.next_inspection_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. GRANT PERMISSIONS
-- =====================================================

-- Grant permissions pentru tabele
GRANT SELECT, INSERT, UPDATE, DELETE ON equipment TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON equipment_inspections TO authenticated;

-- Grant execute pentru funcții helper
GRANT EXECUTE ON FUNCTION get_expired_equipment(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_upcoming_inspections(INTEGER, UUID) TO authenticated;
