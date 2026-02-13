-- Two-Factor Authentication Migration
-- Adds 2FA TOTP support with backup codes to the platform

-- Add 2FA fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS two_factor_secret TEXT;

-- Create table for backup codes
CREATE TABLE IF NOT EXISTS two_factor_backup_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT unique_user_code UNIQUE(user_id, code)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_backup_codes_user_id ON two_factor_backup_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_backup_codes_user_unused ON two_factor_backup_codes(user_id, used) WHERE used = FALSE;

-- Enable RLS on backup codes table
ALTER TABLE two_factor_backup_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own backup codes
CREATE POLICY "Users can manage their own backup codes"
  ON two_factor_backup_codes
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add comment documentation
COMMENT ON TABLE two_factor_backup_codes IS 'Stores backup codes for 2FA recovery. Each code can only be used once.';
COMMENT ON COLUMN profiles.two_factor_enabled IS 'Whether 2FA is enabled for this user';
COMMENT ON COLUMN profiles.two_factor_secret IS 'Base32-encoded TOTP secret for 2FA (encrypted at rest by Supabase)';
COMMENT ON COLUMN two_factor_backup_codes.code IS 'Backup code (stored as plain text, rely on RLS and encryption at rest)';
COMMENT ON COLUMN two_factor_backup_codes.used IS 'Whether this backup code has been used';
COMMENT ON COLUMN two_factor_backup_codes.used_at IS 'Timestamp when the code was used';

-- Create a function to automatically set used_at when a code is marked as used
CREATE OR REPLACE FUNCTION set_backup_code_used_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.used = TRUE AND OLD.used = FALSE THEN
    NEW.used_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic used_at timestamp
DROP TRIGGER IF EXISTS trigger_set_backup_code_used_at ON two_factor_backup_codes;
CREATE TRIGGER trigger_set_backup_code_used_at
  BEFORE UPDATE ON two_factor_backup_codes
  FOR EACH ROW
  EXECUTE FUNCTION set_backup_code_used_at();
