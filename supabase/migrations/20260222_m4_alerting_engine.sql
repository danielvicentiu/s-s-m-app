-- ============================================================
-- M4 ALERTING ENGINE — Sprint 1 Infrastructure
-- supabase/migrations/20260222_m4_alerting_engine.sql
-- Data: 22 februarie 2026
--
-- Conține:
--   1. Sprint 1 alert_categories (8 sluguri noi pentru RO)
--   2. Indexuri deduplicare pe tabelul alerts
--   3. Default alert_configurations pentru org-uri fără config
--   4. CREATE OR REPLACE VIEW v_active_alerts (extins: training + ISCIR)
-- ============================================================


-- ─── 1. Sprint 1 Alert Categories (RO) ──────────────────────────────────────
-- Folosim WHERE NOT EXISTS (safe indiferent de constraint-uri)

INSERT INTO alert_categories (
  country_code, slug, name, name_local,
  severity, warning_days_before, critical_days_before,
  notify_email, notify_push, notify_sms, notify_whatsapp,
  is_active, is_system
)
SELECT 'RO', 'medical_expiry', 'Medical Exam Expiring', 'Fișă medicală expiră',
       'warning', 30, 7, true, true, false, false, true, true
WHERE NOT EXISTS (
  SELECT 1 FROM alert_categories WHERE country_code = 'RO' AND slug = 'medical_expiry'
);

INSERT INTO alert_categories (
  country_code, slug, name, name_local,
  severity, warning_days_before, critical_days_before,
  notify_email, notify_push, notify_sms, notify_whatsapp,
  is_active, is_system
)
SELECT 'RO', 'medical_missing', 'Medical Exam Missing', 'Fișă medicală lipsă',
       'critical', NULL, NULL, true, true, false, false, true, true
WHERE NOT EXISTS (
  SELECT 1 FROM alert_categories WHERE country_code = 'RO' AND slug = 'medical_missing'
);

INSERT INTO alert_categories (
  country_code, slug, name, name_local,
  severity, warning_days_before, critical_days_before,
  notify_email, notify_push, notify_sms, notify_whatsapp,
  is_active, is_system
)
SELECT 'RO', 'osh_training_expiry', 'OSH Training Expiring', 'Instruire SSM expiră',
       'warning', 30, 7, true, true, false, false, true, true
WHERE NOT EXISTS (
  SELECT 1 FROM alert_categories WHERE country_code = 'RO' AND slug = 'osh_training_expiry'
);

INSERT INTO alert_categories (
  country_code, slug, name, name_local,
  severity, warning_days_before, critical_days_before,
  notify_email, notify_push, notify_sms, notify_whatsapp,
  is_active, is_system
)
SELECT 'RO', 'osh_training_missing', 'OSH Training Missing', 'Instruire SSM lipsă',
       'critical', NULL, NULL, true, true, false, false, true, true
WHERE NOT EXISTS (
  SELECT 1 FROM alert_categories WHERE country_code = 'RO' AND slug = 'osh_training_missing'
);

INSERT INTO alert_categories (
  country_code, slug, name, name_local,
  severity, warning_days_before, critical_days_before,
  notify_email, notify_push, notify_sms, notify_whatsapp,
  is_active, is_system
)
SELECT 'RO', 'fire_training_expiry', 'Fire Training Expiring', 'Instruire PSI expiră',
       'warning', 30, 7, true, true, false, false, true, true
WHERE NOT EXISTS (
  SELECT 1 FROM alert_categories WHERE country_code = 'RO' AND slug = 'fire_training_expiry'
);

INSERT INTO alert_categories (
  country_code, slug, name, name_local,
  severity, warning_days_before, critical_days_before,
  notify_email, notify_push, notify_sms, notify_whatsapp,
  is_active, is_system
)
SELECT 'RO', 'fire_training_missing', 'Fire Training Missing', 'Instruire PSI lipsă',
       'critical', NULL, NULL, true, true, false, false, true, true
WHERE NOT EXISTS (
  SELECT 1 FROM alert_categories WHERE country_code = 'RO' AND slug = 'fire_training_missing'
);

INSERT INTO alert_categories (
  country_code, slug, name, name_local,
  severity, warning_days_before, critical_days_before,
  notify_email, notify_push, notify_sms, notify_whatsapp,
  is_active, is_system
)
SELECT 'RO', 'iscir_verification_expiry', 'ISCIR Verification Expiring', 'Verificare ISCIR expiră',
       'warning', 30, 7, true, true, true, false, true, true
WHERE NOT EXISTS (
  SELECT 1 FROM alert_categories WHERE country_code = 'RO' AND slug = 'iscir_verification_expiry'
);

INSERT INTO alert_categories (
  country_code, slug, name, name_local,
  severity, warning_days_before, critical_days_before,
  notify_email, notify_push, notify_sms, notify_whatsapp,
  is_active, is_system
)
SELECT 'RO', 'iscir_authorization_expiry', 'ISCIR Authorization Expiring', 'Autorizare ISCIR expiră',
       'critical', 60, 14, true, true, true, false, true, true
WHERE NOT EXISTS (
  SELECT 1 FROM alert_categories WHERE country_code = 'RO' AND slug = 'iscir_authorization_expiry'
);


-- ─── 2. Indexuri deduplicare pe tabelul alerts ───────────────────────────────

CREATE INDEX IF NOT EXISTS idx_alerts_org_status_expiry
  ON alerts(organization_id, status, expiry_date);

-- Index parțial pentru deduplicare (ignoră alertele rezolvate/respinse)
CREATE INDEX IF NOT EXISTS idx_alerts_dedup
  ON alerts(organization_id, alert_type, employee_name, item_name, expiry_date)
  WHERE status NOT IN ('resolved', 'dismissed');

CREATE INDEX IF NOT EXISTS idx_alert_logs_org_created
  ON alert_logs(organization_id, created_at DESC);


-- ─── 3. Default alert_configurations pentru org-uri fără config ─────────────

INSERT INTO alert_configurations (
  organization_id,
  email_enabled,
  sms_enabled,
  whatsapp_enabled,
  alert_days,
  escalation_enabled,
  escalation_after_hours,
  monthly_report_enabled,
  monthly_report_day
)
SELECT
  o.id,
  true,   -- email activat implicit
  false,
  false,
  ARRAY[30, 14, 7, 3, 1, 0],
  false,
  48,
  false,
  1
FROM organizations o
WHERE NOT EXISTS (
  SELECT 1 FROM alert_configurations ac WHERE ac.organization_id = o.id
);


-- ─── 4. v_active_alerts — extinsă cu ISCIR + Training SSM/PSI ───────────────
-- Adaugă 4 surse noi față de view-ul original (medical + safety_equipment)
-- Coloane păstrate identice: organization_id, alert_type, severity, source_id,
--   employee_name, examination_type, expiry_date, days_remaining,
--   location_name, organization_name

CREATE OR REPLACE VIEW v_active_alerts AS

-- 1. Medical examinations
SELECT
  me.organization_id,
  'medical_expiry'::text                                AS alert_type,
  CASE
    WHEN me.expiry_date < CURRENT_DATE                          THEN 'expired'
    WHEN me.expiry_date <= CURRENT_DATE + INTERVAL '7 days'    THEN 'critical'
    WHEN me.expiry_date <= CURRENT_DATE + INTERVAL '30 days'   THEN 'warning'
    ELSE 'info'
  END                                                   AS severity,
  me.id                                                 AS source_id,
  COALESCE(emp.full_name, me.employee_name)             AS employee_name,
  me.examination_type,
  me.expiry_date,
  (me.expiry_date - CURRENT_DATE)::integer              AS days_remaining,
  loc.name                                              AS location_name,
  org.name                                              AS organization_name
FROM  medical_examinations me
JOIN  organizations org  ON org.id  = me.organization_id
LEFT JOIN employees emp  ON emp.id  = me.employee_id
LEFT JOIN locations loc  ON loc.id  = me.location_id
WHERE me.expiry_date <= CURRENT_DATE + INTERVAL '60 days'

UNION ALL

-- 2. Safety equipment (EIP)
SELECT
  se.organization_id,
  'safety_equipment_expiry'::text                       AS alert_type,
  CASE
    WHEN se.expiry_date < CURRENT_DATE                          THEN 'expired'
    WHEN se.expiry_date <= CURRENT_DATE + INTERVAL '7 days'    THEN 'critical'
    WHEN se.expiry_date <= CURRENT_DATE + INTERVAL '30 days'   THEN 'warning'
    ELSE 'info'
  END                                                   AS severity,
  se.id                                                 AS source_id,
  NULL::text                                            AS employee_name,
  se.equipment_type                                     AS examination_type,
  se.expiry_date,
  (se.expiry_date - CURRENT_DATE)::integer              AS days_remaining,
  loc2.name                                             AS location_name,
  org2.name                                             AS organization_name
FROM  safety_equipment se
JOIN  organizations org2 ON org2.id = se.organization_id
LEFT JOIN locations  loc2 ON loc2.id = se.location_id
WHERE se.expiry_date <= CURRENT_DATE + INTERVAL '60 days'

UNION ALL

-- 3. ISCIR — verificare periodică
SELECT
  ie.organization_id,
  'iscir_verification_expiry'::text                     AS alert_type,
  CASE
    WHEN ie.next_verification_date < CURRENT_DATE                        THEN 'expired'
    WHEN ie.next_verification_date <= CURRENT_DATE + INTERVAL '7 days'  THEN 'critical'
    WHEN ie.next_verification_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'warning'
    ELSE 'info'
  END                                                   AS severity,
  ie.id                                                 AS source_id,
  NULL::text                                            AS employee_name,
  ie.equipment_type                                     AS examination_type,
  ie.next_verification_date                             AS expiry_date,
  (ie.next_verification_date - CURRENT_DATE)::integer   AS days_remaining,
  ie.location                                           AS location_name,
  org3.name                                             AS organization_name
FROM  iscir_equipment ie
JOIN  organizations org3 ON org3.id = ie.organization_id
WHERE ie.next_verification_date IS NOT NULL
  AND ie.next_verification_date <= CURRENT_DATE + INTERVAL '60 days'

UNION ALL

-- 4. ISCIR — autorizație
SELECT
  ie.organization_id,
  'iscir_authorization_expiry'::text                    AS alert_type,
  CASE
    WHEN ie.authorization_expiry < CURRENT_DATE                        THEN 'expired'
    WHEN ie.authorization_expiry <= CURRENT_DATE + INTERVAL '14 days' THEN 'critical'
    WHEN ie.authorization_expiry <= CURRENT_DATE + INTERVAL '60 days' THEN 'warning'
    ELSE 'info'
  END                                                   AS severity,
  ie.id                                                 AS source_id,
  NULL::text                                            AS employee_name,
  ie.equipment_type                                     AS examination_type,
  ie.authorization_expiry                               AS expiry_date,
  (ie.authorization_expiry - CURRENT_DATE)::integer     AS days_remaining,
  ie.location                                           AS location_name,
  org4.name                                             AS organization_name
FROM  iscir_equipment ie
JOIN  organizations org4 ON org4.id = ie.organization_id
WHERE ie.authorization_expiry IS NOT NULL
  AND ie.authorization_expiry <= CURRENT_DATE + INTERVAL '60 days'

UNION ALL

-- 5. Training SSM (osh_training_expiry) — din training_dashboard view
SELECT
  td.organization_id,
  'osh_training_expiry'::text                           AS alert_type,
  CASE
    WHEN td.days_until_due < 0   THEN 'expired'
    WHEN td.days_until_due <= 7  THEN 'critical'
    WHEN td.days_until_due <= 30 THEN 'warning'
    ELSE 'info'
  END                                                   AS severity,
  td.assignment_id                                      AS source_id,
  td.worker_name                                        AS employee_name,
  td.module_title                                       AS examination_type,
  td.next_due_date                                      AS expiry_date,
  td.days_until_due                                     AS days_remaining,
  NULL::text                                            AS location_name,
  td.organization_name
FROM training_dashboard td
WHERE td.category = 'ssm'
  AND td.status != 'completed'
  AND td.next_due_date IS NOT NULL
  AND td.next_due_date <= CURRENT_DATE + INTERVAL '60 days'

UNION ALL

-- 6. Training PSI (fire_training_expiry) — din training_dashboard view
SELECT
  td.organization_id,
  'fire_training_expiry'::text                          AS alert_type,
  CASE
    WHEN td.days_until_due < 0   THEN 'expired'
    WHEN td.days_until_due <= 7  THEN 'critical'
    WHEN td.days_until_due <= 30 THEN 'warning'
    ELSE 'info'
  END                                                   AS severity,
  td.assignment_id                                      AS source_id,
  td.worker_name                                        AS employee_name,
  td.module_title                                       AS examination_type,
  td.next_due_date                                      AS expiry_date,
  td.days_until_due                                     AS days_remaining,
  NULL::text                                            AS location_name,
  td.organization_name
FROM training_dashboard td
WHERE td.category = 'psi'
  AND td.status != 'completed'
  AND td.next_due_date IS NOT NULL
  AND td.next_due_date <= CURRENT_DATE + INTERVAL '60 days'

ORDER BY days_remaining ASC NULLS LAST;
