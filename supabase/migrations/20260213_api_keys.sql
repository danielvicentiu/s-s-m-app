-- Migration: API Keys Management
-- Descriere: Tabela pentru gestionarea cheilor API ale utilizatorilor
-- Data: 2026-02-13

-- Creare tabelă api_keys
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,

  -- Metadata cheie
  name VARCHAR(255) NOT NULL, -- Nume descriptiv pentru cheie (ex: "Cheie producție", "Cheie dev")
  key_hash TEXT NOT NULL UNIQUE, -- Hash SHA-256 al cheii (nu salvăm cheia în clear text!)
  key_prefix VARCHAR(16) NOT NULL, -- Primele caractere ale cheii (ex: "sk_live_abc123") pentru afișare

  -- Status și audit
  is_active BOOLEAN DEFAULT true NOT NULL, -- Active/Revoked
  last_used_at TIMESTAMP WITH TIME ZONE, -- Ultima utilizare
  revoked_at TIMESTAMP WITH TIME ZONE, -- Data revocării
  revoked_by UUID REFERENCES auth.users(id), -- Cine a revocat cheia

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT api_keys_name_length CHECK (char_length(name) >= 3),
  CONSTRAINT api_keys_key_prefix_length CHECK (char_length(key_prefix) >= 8)
);

-- Index pentru performanță
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_organization_id ON api_keys(organization_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active);

-- RLS (Row Level Security)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Policy: Utilizatorii pot vedea doar propriile chei
CREATE POLICY "Users can view own API keys"
  ON api_keys
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Utilizatorii pot crea propriile chei
CREATE POLICY "Users can create own API keys"
  ON api_keys
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Utilizatorii pot actualiza propriile chei (revoke)
CREATE POLICY "Users can update own API keys"
  ON api_keys
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Utilizatorii pot șterge propriile chei
CREATE POLICY "Users can delete own API keys"
  ON api_keys
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger pentru updated_at
CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentarii
COMMENT ON TABLE api_keys IS 'Chei API pentru acces programatic la platformă';
COMMENT ON COLUMN api_keys.key_hash IS 'SHA-256 hash al cheii complete (securitate)';
COMMENT ON COLUMN api_keys.key_prefix IS 'Primele caractere ale cheii pentru afișare (ex: sk_live_abc1...)';
COMMENT ON COLUMN api_keys.last_used_at IS 'Timestamp ultima utilizare (actualizat la fiecare API call)';
