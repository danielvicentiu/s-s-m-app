-- migration_iscir_daily_checks.sql
-- Adds daily_check_required to existing iscir_equipment table
-- Creates iscir_daily_checks table with RLS
-- Creates/refreshes v_iscir_expiring view
-- Run in Supabase SQL Editor (project: uhccxfyvhjeudkexcgiq)

-- ============================================================
-- 1. ALTER existing iscir_equipment: add daily_check_required
-- ============================================================
ALTER TABLE iscir_equipment
  ADD COLUMN IF NOT EXISTS daily_check_required boolean NOT NULL DEFAULT false;

-- Auto-flag equipment types that require daily operator checks
UPDATE iscir_equipment
SET daily_check_required = true
WHERE equipment_type IN ('macara', 'stivuitor')
  AND daily_check_required = false;

COMMENT ON COLUMN iscir_equipment.daily_check_required IS
  'Echipamentele din categoria macara/stivuitor necesită verificare zilnică de către operator (PT R1, PT CR1)';

-- ============================================================
-- 2. CREATE TABLE iscir_daily_checks
-- ============================================================
CREATE TABLE IF NOT EXISTS iscir_daily_checks (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id    uuid        NOT NULL REFERENCES iscir_equipment(id) ON DELETE CASCADE,
  organization_id uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  operator_name   text        NOT NULL,
  check_date      date        NOT NULL DEFAULT CURRENT_DATE,
  -- jsonb with boolean flags, e.g. {"frane_functionale": true, "cabluri_ok": true}
  check_items     jsonb       NOT NULL DEFAULT '{}',
  issues_found    text,
  signed          boolean     NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),

  -- Only one check per equipment per day
  UNIQUE (equipment_id, check_date)
);

CREATE INDEX IF NOT EXISTS idx_iscir_daily_checks_equipment_id
  ON iscir_daily_checks (equipment_id);

CREATE INDEX IF NOT EXISTS idx_iscir_daily_checks_check_date
  ON iscir_daily_checks (check_date);

CREATE INDEX IF NOT EXISTS idx_iscir_daily_checks_org_id
  ON iscir_daily_checks (organization_id);

COMMENT ON TABLE iscir_daily_checks IS
  'Verificări zilnice operator pentru macarale, stivuitoare și alte echipamente ISCIR cu verificare zilnică obligatorie';

-- ============================================================
-- 3. RLS for iscir_daily_checks
-- ============================================================
ALTER TABLE iscir_daily_checks ENABLE ROW LEVEL SECURITY;

-- SELECT: members of the organization can view daily checks
CREATE POLICY "iscir_daily_checks_select"
  ON iscir_daily_checks FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

-- INSERT: members can insert daily checks for their orgs
CREATE POLICY "iscir_daily_checks_insert"
  ON iscir_daily_checks FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

-- UPDATE: only consultant / firma_admin can update checks
CREATE POLICY "iscir_daily_checks_update"
  ON iscir_daily_checks FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- DELETE: only consultant / firma_admin
CREATE POLICY "iscir_daily_checks_delete"
  ON iscir_daily_checks FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- ============================================================
-- 4. CREATE OR REPLACE VIEW v_iscir_expiring
--    Used by GET /api/iscir/alerts
-- ============================================================
CREATE OR REPLACE VIEW v_iscir_expiring AS
SELECT
  e.id,
  e.organization_id,
  e.equipment_type,
  e.identifier,
  e.registration_number,
  e.location,
  e.rsvti_responsible,
  e.next_verification_date,
  e.status,
  e.daily_check_required,
  o.name  AS organization_name,
  o.cui   AS organization_cui,
  -- positive = days overdue, negative = days remaining
  (CURRENT_DATE - e.next_verification_date)              AS days_overdue,
  (e.next_verification_date - CURRENT_DATE)              AS days_until_expiry,
  CASE
    WHEN e.next_verification_date <  CURRENT_DATE                      THEN 'expirat'
    WHEN e.next_verification_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'urgent'
    WHEN e.next_verification_date <= CURRENT_DATE + INTERVAL '90 days' THEN 'atentie'
    ELSE 'ok'
  END AS alert_level
FROM  iscir_equipment  e
LEFT JOIN organizations o ON o.id = e.organization_id
WHERE e.status = 'activ'
  AND e.next_verification_date <= CURRENT_DATE + INTERVAL '90 days'
ORDER BY e.next_verification_date ASC;

COMMENT ON VIEW v_iscir_expiring IS
  'Echipamente ISCIR active cu verificarea scadentă în următoarele 90 zile sau deja expirată';










PS C:\Dev\s-s-m-app> cmd /c "type C:\Dev\s-s-m-app\DOCS\migration_iscir_daily_checks.sql"
-- migration_iscir_daily_checks.sql
-- Adds daily_check_required to existing iscir_equipment table
-- Creates iscir_daily_checks table with RLS
-- Creates/refreshes v_iscir_expiring view
-- Run in Supabase SQL Editor (project: uhccxfyvhjeudkexcgiq)

-- ============================================================
-- 1. ALTER existing iscir_equipment: add daily_check_required
-- ============================================================
ALTER TABLE iscir_equipment
  ADD COLUMN IF NOT EXISTS daily_check_required boolean NOT NULL DEFAULT false;

-- Auto-flag equipment types that require daily operator checks
UPDATE iscir_equipment
SET daily_check_required = true
WHERE equipment_type IN ('macara', 'stivuitor')
  AND daily_check_required = false;

COMMENT ON COLUMN iscir_equipment.daily_check_required IS
  'Echipamentele din categoria macara/stivuitor necesit─â verificare zilnic─â de c─âtre operator (PT R1, PT CR1)';

-- ============================================================
-- 2. CREATE TABLE iscir_daily_checks
-- ============================================================
CREATE TABLE IF NOT EXISTS iscir_daily_checks (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id    uuid        NOT NULL REFERENCES iscir_equipment(id) ON DELETE CASCADE,
  organization_id uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  operator_name   text        NOT NULL,
  check_date      date        NOT NULL DEFAULT CURRENT_DATE,
  -- jsonb with boolean flags, e.g. {"frane_functionale": true, "cabluri_ok": true}
  check_items     jsonb       NOT NULL DEFAULT '{}',
  issues_found    text,
  signed          boolean     NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),

  -- Only one check per equipment per day
  UNIQUE (equipment_id, check_date)
);

CREATE INDEX IF NOT EXISTS idx_iscir_daily_checks_equipment_id
  ON iscir_daily_checks (equipment_id);

CREATE INDEX IF NOT EXISTS idx_iscir_daily_checks_check_date
  ON iscir_daily_checks (check_date);

CREATE INDEX IF NOT EXISTS idx_iscir_daily_checks_org_id
  ON iscir_daily_checks (organization_id);

COMMENT ON TABLE iscir_daily_checks IS
  'Verific─âri zilnice operator pentru macarale, stivuitoare ╚Öi alte echipamente ISCIR cu verificare zilnic─â obligatorie';

-- ============================================================
-- 3. RLS for iscir_daily_checks
-- ============================================================
ALTER TABLE iscir_daily_checks ENABLE ROW LEVEL SECURITY;

-- SELECT: members of the organization can view daily checks
CREATE POLICY "iscir_daily_checks_select"
  ON iscir_daily_checks FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

-- INSERT: members can insert daily checks for their orgs
CREATE POLICY "iscir_daily_checks_insert"
  ON iscir_daily_checks FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

-- UPDATE: only consultant / firma_admin can update checks
CREATE POLICY "iscir_daily_checks_update"
  ON iscir_daily_checks FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- DELETE: only consultant / firma_admin
CREATE POLICY "iscir_daily_checks_delete"
  ON iscir_daily_checks FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- ============================================================
-- 4. CREATE OR REPLACE VIEW v_iscir_expiring
--    Used by GET /api/iscir/alerts
-- ============================================================
CREATE OR REPLACE VIEW v_iscir_expiring AS
SELECT
  e.id,
  e.organization_id,
  e.equipment_type,
  e.identifier,
  e.registration_number,
  e.location,
  e.rsvti_responsible,
  e.next_verification_date,
  e.status,
  e.daily_check_required,
  o.name  AS organization_name,
  o.cui   AS organization_cui,
  -- positive = days overdue, negative = days remaining
  (CURRENT_DATE - e.next_verification_date)              AS days_overdue,
  (e.next_verification_date - CURRENT_DATE)              AS days_until_expiry,
  CASE
    WHEN e.next_verification_date <  CURRENT_DATE                      THEN 'expirat'
    WHEN e.next_verification_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'urgent'
    WHEN e.next_verification_date <= CURRENT_DATE + INTERVAL '90 days' THEN 'atentie'
    ELSE 'ok'
  END AS alert_level
FROM  iscir_equipment  e
LEFT JOIN organizations o ON o.id = e.organization_id
WHERE e.status = 'activ'
  AND e.next_verification_date <= CURRENT_DATE + INTERVAL '90 days'
ORDER BY e.next_verification_date ASC;

COMMENT ON VIEW v_iscir_expiring IS
  'Echipamente ISCIR active cu verificarea scadent─â ├«n urm─âtoarele 90 zile sau deja expirat─â';
