-- Migration: Stripe Billing — alterare tabel subscriptions existent
-- Data: 22 Februarie 2026
-- Descriere: Adaugă câmpuri Stripe la tabelul subscriptions existent,
--            migrează schema fără a distruge date.

-- ── 1. Fă plan_id nullable (Stripe subscriptions nu au plan_id) ──
ALTER TABLE subscriptions
  ALTER COLUMN plan_id DROP NOT NULL;

-- ── 2. Adaugă câmpuri Stripe ──
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
  ADD COLUMN IF NOT EXISTS plan_type TEXT,
  ADD COLUMN IF NOT EXISTS billing_owner TEXT DEFAULT 'patron',
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS amount_ron INTEGER;

-- ── 3. Migrează status enum ──
-- Șterge constraint vechi și recreează cu valorile noi + pe cele vechi (backwards compat)
ALTER TABLE subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_status_check;

ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_status_check
  CHECK (status IN ('trial', 'active', 'past_due', 'canceled', 'expired', 'cancelled', 'suspended'));

-- ── 4. Adaugă constraints pentru câmpurile noi ──
ALTER TABLE subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_billing_owner_check;

ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_billing_owner_check
  CHECK (billing_owner IN ('patron', 'sepp'));

ALTER TABLE subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_plan_type_check
  CHECK (plan_type IN ('direct', 'partner_billed', 'self_service') OR plan_type IS NULL);

-- ── 5. Unique constraints pentru Stripe IDs (parțiale — permit NULL) ──
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id
  ON subscriptions(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id
  ON subscriptions(stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

-- ── 6. Index pe organization_id (dacă nu există deja) ──
CREATE INDEX IF NOT EXISTS idx_subscriptions_organization_id
  ON subscriptions(organization_id);

-- ── 7. Unique constraint pe organization_id pentru upsert ──
-- O organizație → un singur abonament activ
ALTER TABLE subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_organization_id_unique;

ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_organization_id_unique
  UNIQUE (organization_id);

-- ── 8. Trigger updated_at (dacă nu există deja din migrarea precedentă) ──
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at_v2()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS subscriptions_updated_at ON subscriptions;

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_subscriptions_updated_at_v2();

-- ── 9. RLS: adaugă policy super_admin (webhooks folosesc service role — bypass) ──
DROP POLICY IF EXISTS "super_admin_manage_subscriptions" ON subscriptions;

CREATE POLICY "super_admin_manage_subscriptions" ON subscriptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'consultant'
        AND is_active = true
    )
  );

-- RLS e deja activat din migrarea precedentă — nu re-activăm

COMMENT ON COLUMN subscriptions.stripe_customer_id IS 'Stripe Customer ID (cus_...)';
COMMENT ON COLUMN subscriptions.stripe_subscription_id IS 'Stripe Subscription ID (sub_...)';
COMMENT ON COLUMN subscriptions.stripe_price_id IS 'Stripe Price ID (price_...)';
COMMENT ON COLUMN subscriptions.plan_type IS 'direct | partner_billed | self_service';
COMMENT ON COLUMN subscriptions.billing_owner IS 'patron | sepp';
COMMENT ON COLUMN subscriptions.amount_ron IS 'Preț în bani RON (99 RON = 9900)';
COMMENT ON COLUMN subscriptions.trial_ends_at IS 'Sfârșitul perioadei trial (14 zile)';
