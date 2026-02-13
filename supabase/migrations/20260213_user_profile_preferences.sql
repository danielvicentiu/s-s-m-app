-- Migration: User profile preferences support
-- Created: 2026-02-13
-- Descriere: Tabela pentru preferințe user (limba, timezone, notificări)
--            + Storage bucket pentru avatare

-- ============================================================
-- 1. CREATE TABLE user_preferences (dacă nu există deja)
-- ============================================================

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_preferences_unique UNIQUE (user_id, key)
);

-- Index pentru căutări rapide
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- RLS policies
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: user poate citi doar propriile preferințe
CREATE POLICY "Users can read own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: user poate insera propriile preferințe
CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: user poate actualiza propriile preferințe
CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: user poate șterge propriile preferințe
CREATE POLICY "Users can delete own preferences"
  ON user_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 2. ENSURE profiles table has avatar_url column
-- ============================================================

-- Adaugă coloana avatar_url dacă nu există
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- ============================================================
-- 3. STORAGE BUCKET pentru avatare
-- ============================================================

-- Creare bucket "avatars" (dacă nu există)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: oricine poate vedea avatarele (public bucket)
CREATE POLICY IF NOT EXISTS "Public avatar access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Policy: user autentificat poate uploada avatar
CREATE POLICY IF NOT EXISTS "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );

-- Policy: user poate actualiza propriul avatar
CREATE POLICY IF NOT EXISTS "Users can update own avatars"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );

-- Policy: user poate șterge propriul avatar
CREATE POLICY IF NOT EXISTS "Users can delete own avatars"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );

-- ============================================================
-- 4. COMENTARII
-- ============================================================

COMMENT ON TABLE user_preferences IS 'Preferințe user: limba, timezone, notificări on/off, toggle-uri dashboard';
COMMENT ON COLUMN user_preferences.key IS 'Cheie preferință (ex: preferred_locale, timezone, email_notifications)';
COMMENT ON COLUMN user_preferences.value IS 'Valoare JSON stringified';
