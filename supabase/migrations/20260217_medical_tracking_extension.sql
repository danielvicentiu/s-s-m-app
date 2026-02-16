-- ============================================================
-- M3_MEDICAL TRACKING EXTENSION
-- Migration: 20260217_medical_tracking_extension.sql
-- Purpose: Extend medical_examinations + add medical_appointments
-- Strategy: Backward compatible - keep existing employee_name field
-- ============================================================

-- ============================================================
-- 1. EXTEND medical_examinations TABLE
-- ============================================================

-- Add employee_id FK (nullable for backward compatibility)
ALTER TABLE medical_examinations
ADD COLUMN IF NOT EXISTS employee_id UUID REFERENCES employees(id) ON DELETE SET NULL;

-- Add new tracking fields from M3 requirements
ALTER TABLE medical_examinations
ADD COLUMN IF NOT EXISTS validity_months INTEGER DEFAULT 12,
ADD COLUMN IF NOT EXISTS risk_factors TEXT[],
ADD COLUMN IF NOT EXISTS next_examination_date DATE,
ADD COLUMN IF NOT EXISTS document_number TEXT,
ADD COLUMN IF NOT EXISTS document_storage_path TEXT;

-- Add location_id if not exists (may already exist from previous migrations)
ALTER TABLE medical_examinations
ADD COLUMN IF NOT EXISTS location_id UUID;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_medical_examinations_employee_id
  ON medical_examinations(employee_id);

CREATE INDEX IF NOT EXISTS idx_medical_examinations_next_exam
  ON medical_examinations(next_examination_date);

CREATE INDEX IF NOT EXISTS idx_medical_examinations_org_expiry
  ON medical_examinations(organization_id, expiry_date);

-- Add comment
COMMENT ON COLUMN medical_examinations.employee_id IS
  'FK to employees table. Nullable for backward compatibility with employee_name field.';

-- ============================================================
-- 2. CREATE medical_appointments TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS medical_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Appointment details
  appointment_date DATE NOT NULL,
  appointment_time TIME,
  clinic_name TEXT,
  clinic_address TEXT,

  -- Examination type - same values as medical_examinations
  examination_type TEXT NOT NULL CHECK (examination_type IN (
    'fisa_aptitudine',
    'fisa_psihologica',
    'control_periodic',
    'control_angajare',
    'control_reluare',
    'vaccinare',
    'periodic',
    'angajare',
    'reluare',
    'la_cerere',
    'supraveghere',
    'altul'
  )),

  -- Status workflow
  status TEXT NOT NULL DEFAULT 'programat' CHECK (status IN (
    'programat',
    'confirmat',
    'efectuat',
    'anulat',
    'reprogramat'
  )),

  notes TEXT,

  -- Audit fields
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add comments
COMMENT ON TABLE medical_appointments IS
  'Medical examination appointments scheduling for employees';

COMMENT ON COLUMN medical_appointments.status IS
  'Appointment status: programat (scheduled), confirmat (confirmed), efectuat (completed), anulat (cancelled), reprogramat (rescheduled)';

-- ============================================================
-- 3. CREATE INDEXES for medical_appointments
-- ============================================================

CREATE INDEX idx_medical_appointments_employee
  ON medical_appointments(employee_id);

CREATE INDEX idx_medical_appointments_org
  ON medical_appointments(organization_id);

CREATE INDEX idx_medical_appointments_date
  ON medical_appointments(appointment_date);

CREATE INDEX idx_medical_appointments_status
  ON medical_appointments(status);

CREATE INDEX idx_medical_appointments_org_date
  ON medical_appointments(organization_id, appointment_date);

-- ============================================================
-- 4. ROW LEVEL SECURITY for medical_appointments
-- ============================================================

ALTER TABLE medical_appointments ENABLE ROW LEVEL SECURITY;

-- Policy: Users see appointments from their organizations
CREATE POLICY "Users see own org medical appointments"
  ON medical_appointments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM memberships m
      WHERE m.organization_id = medical_appointments.organization_id
        AND m.user_id = auth.uid()
    )
  );

-- Policy: Users can insert appointments for their organizations
CREATE POLICY "Users create appointments for own org"
  ON medical_appointments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM memberships m
      WHERE m.organization_id = medical_appointments.organization_id
        AND m.user_id = auth.uid()
    )
  );

-- ============================================================
-- 5. CREATE VIEW v_medical_expiring
-- ============================================================

CREATE OR REPLACE VIEW v_medical_expiring AS
SELECT
  me.id,
  me.organization_id,
  me.employee_id,
  me.employee_name,
  me.cnp_hash,
  me.job_title,
  me.examination_type,
  me.examination_date,
  me.expiry_date,
  me.next_examination_date,
  me.result,
  me.restrictions,
  me.doctor_name,
  me.clinic_name,
  me.document_number,
  me.validity_months,
  me.risk_factors,
  me.notes,

  -- Join employee details (if employee_id exists)
  e.full_name,
  e.cor_code,

  -- Join organization details
  o.name AS org_name,
  o.cui AS org_cui,

  -- Calculate days until expiry
  (me.expiry_date - CURRENT_DATE) AS days_until_expiry,

  -- Calculate alert level
  CASE
    WHEN me.expiry_date IS NULL THEN 'nedefinit'
    WHEN me.expiry_date < CURRENT_DATE THEN 'expirat'
    WHEN (me.expiry_date - CURRENT_DATE) <= 30 THEN 'urgent'
    WHEN (me.expiry_date - CURRENT_DATE) <= 60 THEN 'atentie'
    ELSE 'ok'
  END AS alert_level,

  -- Metadata
  me.created_at,
  me.updated_at

FROM medical_examinations me
LEFT JOIN employees e ON e.id = me.employee_id
JOIN organizations o ON o.id = me.organization_id

-- Exclude permanently unfit employees
WHERE me.result != 'inapt'

-- Order by urgency (most urgent first)
ORDER BY
  CASE
    WHEN me.expiry_date IS NULL THEN 3
    WHEN me.expiry_date < CURRENT_DATE THEN 0
    WHEN (me.expiry_date - CURRENT_DATE) <= 30 THEN 1
    ELSE 2
  END,
  me.expiry_date ASC;

-- Add comment
COMMENT ON VIEW v_medical_expiring IS
  'Medical examinations with expiry alerts. Excludes permanently unfit employees. Ordered by urgency.';

-- ============================================================
-- 6. GRANT PERMISSIONS
-- ============================================================

-- Grant select on view to authenticated users (RLS on base table still applies)
GRANT SELECT ON v_medical_expiring TO authenticated;

-- ============================================================
-- 7. TRIGGER: Update updated_at on medical_appointments
-- ============================================================

CREATE OR REPLACE FUNCTION update_medical_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER medical_appointments_updated_at
  BEFORE UPDATE ON medical_appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_medical_appointments_updated_at();

-- ============================================================
-- 8. HELPER FUNCTION: Get expiring medical records
-- ============================================================

CREATE OR REPLACE FUNCTION get_expiring_medical_records(
  org_id UUID,
  days_threshold INTEGER DEFAULT 30
)
RETURNS TABLE (
  id UUID,
  employee_name TEXT,
  full_name TEXT,
  job_title TEXT,
  examination_type TEXT,
  expiry_date DATE,
  days_until_expiry INTEGER,
  alert_level TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id,
    v.employee_name,
    v.full_name,
    v.job_title,
    v.examination_type,
    v.expiry_date,
    v.days_until_expiry,
    v.alert_level
  FROM v_medical_expiring v
  WHERE v.organization_id = org_id
    AND (v.days_until_expiry IS NULL OR v.days_until_expiry <= days_threshold)
    AND v.alert_level IN ('urgent', 'expirat', 'atentie')
  ORDER BY v.days_until_expiry ASC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON FUNCTION get_expiring_medical_records IS
  'Returns medical records expiring within threshold days for a specific organization';

-- ============================================================
-- 9. DATA MIGRATION: Update existing records
-- ============================================================

-- Auto-populate employee_id where employee_name matches
-- This is a best-effort migration - manual review recommended
UPDATE medical_examinations me
SET employee_id = e.id
FROM employees e
WHERE me.employee_id IS NULL
  AND me.organization_id = e.organization_id
  AND LOWER(TRIM(me.employee_name)) = LOWER(TRIM(e.full_name));

-- Log migration results
DO $$
DECLARE
  matched_count INTEGER;
  total_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO matched_count
  FROM medical_examinations
  WHERE employee_id IS NOT NULL;

  SELECT COUNT(*) INTO total_count
  FROM medical_examinations;

  RAISE NOTICE 'Medical records migration: % out of % records matched with employees',
    matched_count, total_count;
END $$;

-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================
-- Summary:
-- ✅ Extended medical_examinations with employee_id FK + tracking fields
-- ✅ Created medical_appointments table with RLS
-- ✅ Created v_medical_expiring view for alerts
-- ✅ Added indexes for performance
-- ✅ Created helper functions
-- ✅ Auto-migrated existing data (best effort)
--
-- Next steps:
-- - Update API routes to use new fields
-- - Update UI to support appointments
-- - Test RLS policies
-- ============================================================
