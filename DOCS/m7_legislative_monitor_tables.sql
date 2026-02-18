-- ============================================================
-- Migration: M7 Legislative Monitor Tables
-- Created: 2026-02-18
--
-- Creează două tabele:
--   ro_monitor_log  — log per-act (folosit de lib/legal-monitor/ro-checker.ts)
--   ro_cron_log     — log per-run (folosit de app/api/cron/legislative-monitor)
--
-- Rulează direct în Supabase SQL Editor
-- ============================================================

-- ─── 1. ro_monitor_log (per-act check log) ─────────────────────

CREATE TABLE IF NOT EXISTS ro_monitor_log (
  id               uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  act_key          text        NOT NULL,
  checked_at       timestamptz DEFAULT now(),
  status           text        NOT NULL
                   CHECK (status IN ('success', 'error', 'no_change', 'changed')),
  details          text,
  version_date_found text,
  error_message    text,
  duration_ms      int,
  created_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ro_monitor_log_act_key
  ON ro_monitor_log (act_key);

CREATE INDEX IF NOT EXISTS idx_ro_monitor_log_checked_at
  ON ro_monitor_log (checked_at DESC);

CREATE INDEX IF NOT EXISTS idx_ro_monitor_log_status
  ON ro_monitor_log (status);

-- RLS
ALTER TABLE ro_monitor_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "ro_monitor_log: service role full access"
  ON ro_monitor_log FOR ALL TO service_role USING (true);

CREATE POLICY IF NOT EXISTS "ro_monitor_log: consultants can read"
  ON ro_monitor_log FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.user_id = auth.uid()
        AND m.role    = 'consultant'
        AND m.is_active = true
    )
  );

-- ─── 2. ro_cron_log (per-run summary) ──────────────────────────

CREATE TABLE IF NOT EXISTS ro_cron_log (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  run_at         timestamptz DEFAULT now(),
  acts_checked   int         DEFAULT 0,
  acts_updated   int         DEFAULT 0,
  acts_new       int         DEFAULT 0,
  errors         jsonb       DEFAULT '[]',
  duration_ms    int,
  triggered_by   text        DEFAULT 'cron'
                 CHECK (triggered_by IN ('cron', 'manual', 'test'))
);

CREATE INDEX IF NOT EXISTS idx_ro_cron_log_run_at
  ON ro_cron_log (run_at DESC);

-- RLS
ALTER TABLE ro_cron_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "ro_cron_log: service role full access"
  ON ro_cron_log FOR ALL TO service_role USING (true);

CREATE POLICY IF NOT EXISTS "ro_cron_log: consultants can read"
  ON ro_cron_log FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.user_id = auth.uid()
        AND m.role    = 'consultant'
        AND m.is_active = true
    )
  );

-- ─── 3. Verification queries ────────────────────────────────────

-- SELECT table_name FROM information_schema.tables
--   WHERE table_schema = 'public'
--     AND table_name IN ('ro_monitor_log', 'ro_cron_log');
