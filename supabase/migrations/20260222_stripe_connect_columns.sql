-- Migration: Stripe Connect — coloane billing entity pe subscriptions
-- Data: 22 Februarie 2026
-- Rulează DUPĂ 20260222_stripe_billing_migration.sql

-- Adaugă coloane pentru tracking billing entity per abonament
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS billing_entity_id TEXT,
  ADD COLUMN IF NOT EXISTS billing_entity_cui TEXT;

-- Constraint pe billing_entity_id
ALTER TABLE subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_billing_entity_id_check;

ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_billing_entity_id_check
  CHECK (billing_entity_id IN ('URIEL', 'FAIRY', 'AUM') OR billing_entity_id IS NULL);

-- Index pentru lookup rapid
CREATE INDEX IF NOT EXISTS idx_subscriptions_billing_entity_id
  ON subscriptions(billing_entity_id);

COMMENT ON COLUMN subscriptions.billing_entity_id IS 'URIEL | FAIRY | AUM — firma emitentă (Stripe Connected Account)';
COMMENT ON COLUMN subscriptions.billing_entity_cui IS 'CUI-ul firmei emitente (copiat din billing entity la checkout)';
