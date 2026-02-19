-- Migration: FCM Tokens Table
-- Data: 19 Februarie 2026
-- Scop: Stocare token-uri Firebase Cloud Messaging pentru push notifications

CREATE TABLE IF NOT EXISTS fcm_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  device_info JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_used TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(token)
);

CREATE INDEX IF NOT EXISTS idx_fcm_tokens_user_id ON fcm_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_token ON fcm_tokens(token);
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_active ON fcm_tokens(user_id, is_active) WHERE is_active = true;

ALTER TABLE fcm_tokens ENABLE ROW LEVEL SECURITY;

-- Utilizatorii pot vedea propriile token-uri
CREATE POLICY "Users can view own fcm tokens"
  ON fcm_tokens FOR SELECT USING (auth.uid() = user_id);

-- Utilizatorii pot insera propriile token-uri
CREATE POLICY "Users can insert own fcm tokens"
  ON fcm_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Utilizatorii pot actualiza propriile token-uri
CREATE POLICY "Users can update own fcm tokens"
  ON fcm_tokens FOR UPDATE
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Utilizatorii pot șterge propriile token-uri
CREATE POLICY "Users can delete own fcm tokens"
  ON fcm_tokens FOR DELETE USING (auth.uid() = user_id);

-- Service role poate citi toate token-urile (pentru trimitere notificări)
CREATE POLICY "Service role can read all fcm tokens"
  ON fcm_tokens FOR SELECT USING (auth.role() = 'service_role');

-- Service role poate actualiza token-uri (pentru marcare inactive)
CREATE POLICY "Service role can update all fcm tokens"
  ON fcm_tokens FOR UPDATE USING (auth.role() = 'service_role');
