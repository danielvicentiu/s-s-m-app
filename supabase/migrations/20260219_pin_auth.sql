-- Migration: PIN rapid authentication for workers
-- Date: 2026-02-19
-- Description: Creates user_pin_auth table for fast re-authentication via PIN

-- Check if user_profiles exists and add columns if so
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'user_profiles'
  ) THEN
    -- Add PIN columns to existing user_profiles table
    ALTER TABLE user_profiles
      ADD COLUMN IF NOT EXISTS pin_hash TEXT,
      ADD COLUMN IF NOT EXISTS pin_attempts INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS pin_locked_until TIMESTAMPTZ;

    RAISE NOTICE 'Added PIN columns to existing user_profiles table';
  ELSE
    -- Create minimal user_pin_auth table
    CREATE TABLE IF NOT EXISTS user_pin_auth (
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      pin_hash TEXT,
      pin_attempts INT DEFAULT 0,
      pin_locked_until TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    -- Index for email lookup
    CREATE INDEX IF NOT EXISTS idx_user_pin_auth_email ON user_pin_auth(email);

    -- RLS
    ALTER TABLE user_pin_auth ENABLE ROW LEVEL SECURITY;

    -- Users can only read/update their own PIN record
    CREATE POLICY "user_pin_auth_own_select" ON user_pin_auth
      FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "user_pin_auth_own_update" ON user_pin_auth
      FOR UPDATE USING (auth.uid() = user_id);

    CREATE POLICY "user_pin_auth_own_insert" ON user_pin_auth
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    -- Updated_at trigger
    CREATE OR REPLACE FUNCTION update_user_pin_auth_updated_at()
    RETURNS TRIGGER AS $func$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trg_user_pin_auth_updated_at ON user_pin_auth;
    CREATE TRIGGER trg_user_pin_auth_updated_at
      BEFORE UPDATE ON user_pin_auth
      FOR EACH ROW EXECUTE FUNCTION update_user_pin_auth_updated_at();

    RAISE NOTICE 'Created user_pin_auth table';
  END IF;
END;
$$;
