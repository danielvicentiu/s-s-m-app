-- S-S-M.RO — PUSH SUBSCRIPTIONS TABLE
-- Tabel pentru salvarea subscription-urilor Web Push
-- Data: 13 Februarie 2026

-- Creare tabel push_subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  user_agent TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pentru căutare rapidă
CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX idx_push_subscriptions_is_active ON push_subscriptions(is_active);
CREATE INDEX idx_push_subscriptions_user_active ON push_subscriptions(user_id, is_active) WHERE is_active = true;

-- Trigger pentru updated_at
CREATE OR REPLACE FUNCTION update_push_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_push_subscriptions_updated_at
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_push_subscriptions_updated_at();

-- RLS Policies
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Utilizatorii pot vedea doar propriile subscription-uri
CREATE POLICY "Users can view own subscriptions"
  ON push_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Utilizatorii pot crea propriile subscription-uri
CREATE POLICY "Users can create own subscriptions"
  ON push_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Utilizatorii pot actualiza propriile subscription-uri
CREATE POLICY "Users can update own subscriptions"
  ON push_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Utilizatorii pot șterge propriile subscription-uri
CREATE POLICY "Users can delete own subscriptions"
  ON push_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Consultanții pot vedea subscription-urile organizațiilor lor
CREATE POLICY "Consultants can view org subscriptions"
  ON push_subscriptions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.user_id = auth.uid()
        AND m.role = 'consultant'
        AND m.is_active = true
        AND EXISTS (
          SELECT 1 FROM memberships m2
          WHERE m2.user_id = push_subscriptions.user_id
            AND m2.organization_id = m.organization_id
            AND m2.is_active = true
        )
    )
  );

-- Comentarii
COMMENT ON TABLE push_subscriptions IS 'Tabel pentru salvarea subscription-urilor Web Push ale utilizatorilor';
COMMENT ON COLUMN push_subscriptions.endpoint IS 'URL-ul endpoint-ului push subscription';
COMMENT ON COLUMN push_subscriptions.p256dh_key IS 'Cheia publică P256DH pentru encryption';
COMMENT ON COLUMN push_subscriptions.auth_key IS 'Cheia de autentificare';
COMMENT ON COLUMN push_subscriptions.user_agent IS 'Browser user agent pentru tracking';
COMMENT ON COLUMN push_subscriptions.is_active IS 'Dacă subscription-ul este activ';
