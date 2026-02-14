-- Migration: Push Subscriptions Table
-- Data: 14 Februarie 2026
-- Descriere: Tabel pentru stocarea subscription-urilor Web Push

-- Tabel: push_subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  keys JSONB NOT NULL, -- { "p256dh": "...", "auth": "..." }
  user_agent TEXT,
  platform TEXT, -- 'android', 'ios', 'windows', 'macos', 'linux', 'unknown'
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Constraints
  UNIQUE(user_id, endpoint)
);

-- Index-uri pentru performanță
CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX idx_push_subscriptions_organization_id ON push_subscriptions(organization_id);
CREATE INDEX idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);
CREATE INDEX idx_push_subscriptions_last_used_at ON push_subscriptions(last_used_at);

-- Trigger pentru updated_at
CREATE TRIGGER update_push_subscriptions_updated_at
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON push_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own subscriptions
CREATE POLICY "Users can insert own subscriptions"
  ON push_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own subscriptions
CREATE POLICY "Users can update own subscriptions"
  ON push_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own subscriptions
CREATE POLICY "Users can delete own subscriptions"
  ON push_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Consultants can view all subscriptions in their organizations
CREATE POLICY "Consultants can view org subscriptions"
  ON push_subscriptions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()
        AND memberships.organization_id = push_subscriptions.organization_id
        AND memberships.role = 'consultant'
        AND memberships.is_active = true
    )
  );

-- Funcție pentru curățarea subscription-urilor expirate (nefolosite > 90 zile)
CREATE OR REPLACE FUNCTION cleanup_expired_push_subscriptions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM push_subscriptions
  WHERE last_used_at < NOW() - INTERVAL '90 days'
    OR (last_used_at IS NULL AND created_at < NOW() - INTERVAL '90 days');
END;
$$;

-- Comentarii
COMMENT ON TABLE push_subscriptions IS 'Stochează subscription-urile Web Push ale utilizatorilor pentru notificări browser';
COMMENT ON COLUMN push_subscriptions.endpoint IS 'URL-ul endpoint-ului push service-ului browser';
COMMENT ON COLUMN push_subscriptions.keys IS 'Cheile de criptare pentru push notifications (p256dh și auth)';
COMMENT ON COLUMN push_subscriptions.user_agent IS 'User agent string al browser-ului';
COMMENT ON COLUMN push_subscriptions.platform IS 'Platforma device-ului (android, ios, windows, etc.)';
COMMENT ON COLUMN push_subscriptions.last_used_at IS 'Ultima dată când a fost trimisă o notificare pe acest subscription';
