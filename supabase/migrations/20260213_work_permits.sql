-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRARE: Permise de lucru (Work Permits)
-- Data: 13 Februarie 2026
-- ═══════════════════════════════════════════════════════════════════════════

-- Creare tabela work_permits
CREATE TABLE IF NOT EXISTS work_permits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  permit_number TEXT NOT NULL,
  work_type TEXT NOT NULL CHECK (work_type IN (
    'lucru_inaltime',
    'spatii_confinate',
    'foc_deschis',
    'electrice',
    'excavare',
    'lucru_calte',
    'radiatii',
    'substante_periculoase',
    'altul'
  )),
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  team_members TEXT[] NOT NULL DEFAULT '{}',
  team_leader TEXT,
  additional_measures TEXT,
  authorized_by TEXT,
  status TEXT NOT NULL DEFAULT 'activ' CHECK (status IN ('activ', 'expirat', 'anulat', 'finalizat')),
  canceled_reason TEXT,
  canceled_by UUID REFERENCES auth.users(id),
  canceled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_datetime CHECK (end_datetime > start_datetime),
  CONSTRAINT valid_cancel CHECK (
    (status = 'anulat' AND canceled_reason IS NOT NULL AND canceled_by IS NOT NULL AND canceled_at IS NOT NULL)
    OR (status != 'anulat' AND canceled_reason IS NULL AND canceled_by IS NULL AND canceled_at IS NULL)
  )
);

-- Creare index pentru performanță
CREATE INDEX idx_work_permits_organization ON work_permits(organization_id);
CREATE INDEX idx_work_permits_status ON work_permits(status);
CREATE INDEX idx_work_permits_start_datetime ON work_permits(start_datetime DESC);
CREATE INDEX idx_work_permits_created_by ON work_permits(created_by);
CREATE UNIQUE INDEX idx_work_permits_permit_number ON work_permits(organization_id, permit_number);

-- Trigger pentru updated_at
CREATE TRIGGER update_work_permits_updated_at
  BEFORE UPDATE ON work_permits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE work_permits ENABLE ROW LEVEL SECURITY;

-- Policy: Users pot vedea permisele organizațiilor din care fac parte
CREATE POLICY "Users can view work permits from their organizations"
  ON work_permits
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

-- Policy: Consultanții și admins pot crea permise
CREATE POLICY "Consultants and admins can create work permits"
  ON work_permits
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

-- Policy: Consultanții și admins pot actualiza permise
CREATE POLICY "Consultants and admins can update work permits"
  ON work_permits
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

-- Policy: Doar consultanții pot șterge permise
CREATE POLICY "Consultants can delete work permits"
  ON work_permits
  FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role = 'consultant'
    )
  );

-- ═══════════════════════════════════════════════════════════════════════════
-- FUNCȚIE: Actualizare automată status expirat
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_expired_work_permits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE work_permits
  SET status = 'expirat',
      updated_at = NOW()
  WHERE status = 'activ'
    AND end_datetime < NOW();
END;
$$;

-- Comentarii tabela
COMMENT ON TABLE work_permits IS 'Permise de lucru pentru lucrări periculoase (lucru la înălțime, spații confinate, etc.)';
COMMENT ON COLUMN work_permits.permit_number IS 'Număr unic permis (ex: WP-2026-001)';
COMMENT ON COLUMN work_permits.work_type IS 'Tip lucrare periculoasă';
COMMENT ON COLUMN work_permits.team_members IS 'Array cu numele membrilor echipei';
COMMENT ON COLUMN work_permits.additional_measures IS 'Măsuri suplimentare de siguranță specifice';
COMMENT ON COLUMN work_permits.authorized_by IS 'Persoana care a autorizat permisul';
