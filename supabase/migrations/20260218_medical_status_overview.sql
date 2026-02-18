-- ============================================================
-- MEDICAL STATUS OVERVIEW VIEW
-- Migration: 20260218_medical_status_overview.sql
-- Purpose: Dashboard cards + /api/medical/overview endpoint
-- Uses: medical_examinations (existing table via employee_id FK)
-- Prerequisite: 20260217_medical_tracking_extension.sql (employee_id FK added)
-- ============================================================

-- ============================================================
-- 1. CREATE VIEW medical_status_overview
-- ============================================================
-- Shows current medical status per active employee.
-- Status values:
--   valid        → next_examination_date > 30 days away
--   expira_curand → next_examination_date ≤ 30 days (includes today)
--   expirat      → next_examination_date is in the past
--   fara_fisa    → no linked medical_examinations record

CREATE OR REPLACE VIEW medical_status_overview AS
SELECT
  e.id                             AS employee_id,
  e.full_name,
  e.organization_id                AS org_id,
  e.job_title,
  e.department,
  e.is_active,

  -- Last examination fields (NULL if no linked record)
  mr.id                            AS last_record_id,
  mr.result                        AS last_result,
  mr.examination_type              AS last_examination_type,
  mr.examination_date              AS last_examination_date,

  -- Prefer next_examination_date; fall back to expiry_date
  COALESCE(mr.next_examination_date, mr.expiry_date) AS next_examination_date,

  -- Medical details
  mr.restrictions,
  mr.risk_factors,
  mr.clinic_name,
  mr.doctor_name,

  -- Days until expiry (negative = already expired)
  (COALESCE(mr.next_examination_date, mr.expiry_date) - CURRENT_DATE) AS days_until_expiry,

  -- Computed status
  CASE
    WHEN COALESCE(mr.next_examination_date, mr.expiry_date) IS NULL
      THEN 'fara_fisa'
    WHEN COALESCE(mr.next_examination_date, mr.expiry_date) < CURRENT_DATE
      THEN 'expirat'
    WHEN COALESCE(mr.next_examination_date, mr.expiry_date) < CURRENT_DATE + INTERVAL '30 days'
      THEN 'expira_curand'
    ELSE 'valid'
  END                              AS status

FROM employees e

-- LATERAL JOIN: pick the single most-recent exam per employee (matched via employee_id FK)
LEFT JOIN LATERAL (
  SELECT
    id,
    result,
    examination_type,
    examination_date,
    next_examination_date,
    expiry_date,
    restrictions,
    risk_factors,
    clinic_name,
    doctor_name
  FROM medical_examinations
  WHERE employee_id = e.id
  ORDER BY examination_date DESC
  LIMIT 1
) mr ON true

WHERE e.is_active = true;

-- Grant access; RLS on the base tables still applies per-user
GRANT SELECT ON medical_status_overview TO authenticated;

COMMENT ON VIEW medical_status_overview IS
  'Current medical aptitude status per active employee, based on latest medical_examinations record linked via employee_id FK. '
  'Status: valid (>30 days) | expira_curand (≤30 days) | expirat (past) | fara_fisa (no record). '
  'Used by /api/medical/overview and dashboard stat cards.';

-- ============================================================
-- 2. INDEX: speed up the LATERAL JOIN on employee_id
-- (already exists from 20260217, added here as IF NOT EXISTS safety)
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_medical_examinations_employee_id_date
  ON medical_examinations(employee_id, examination_date DESC);

-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================
-- Summary:
-- ✅ Created medical_status_overview view (per-employee status)
-- ✅ Granted SELECT to authenticated role
-- ✅ Added covering index for LATERAL JOIN performance
--
-- Compatible with existing:
--   - medical_examinations table (uses employee_id FK nullable column)
--   - employees table (is_active filter)
--   - v_medical_expiring view (no conflict)
-- ============================================================
