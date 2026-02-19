-- Migration: 20260219_onboarding_tables.sql
-- Zero-friction onboarding: anaf_cache table + optional column additions

-- =============================================
-- 1. ANAF Cache table
-- =============================================
CREATE TABLE IF NOT EXISTS anaf_cache (
  cui TEXT PRIMARY KEY,
  response JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for cleanup queries by date
CREATE INDEX IF NOT EXISTS idx_anaf_cache_created ON anaf_cache(created_at);

-- RLS: serviciu intern, fără acces direct utilizatori
ALTER TABLE anaf_cache ENABLE ROW LEVEL SECURITY;

-- Doar service role poate accesa (API routes folosesc service role implicit prin createSupabaseServer)
CREATE POLICY "Service only access for anaf_cache"
  ON anaf_cache
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- =============================================
-- 2. Adaugă coloane lipsă în organizations (dacă nu există)
-- =============================================
DO $$
BEGIN
  -- caen_codes: array de coduri CAEN (poate fi null dacă coloana există deja)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'organizations' AND column_name = 'caen_codes'
  ) THEN
    ALTER TABLE organizations ADD COLUMN caen_codes TEXT[] DEFAULT '{}';
  END IF;

  -- employee_count: număr angajați estimat
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'organizations' AND column_name = 'employee_count'
  ) THEN
    ALTER TABLE organizations ADD COLUMN employee_count INTEGER;
  END IF;
END $$;

-- =============================================
-- 3. Insert plan Trial în subscription_plans (dacă nu există)
-- =============================================
INSERT INTO subscription_plans (name, description, price_ron, price_eur, max_users, max_organizations, features, is_active, display_order)
VALUES (
  'Trial',
  'Trial gratuit 14 zile — toate funcționalitățile incluse',
  0.00,
  0.00,
  999,
  1,
  '["basic_compliance", "document_storage", "email_support", "api_access", "priority_support", "advanced_reporting"]',
  true,
  0
)
ON CONFLICT (name) DO NOTHING;
