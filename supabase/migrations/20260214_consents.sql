-- GDPR Consent Management
-- Created: 2026-02-14
-- Purpose: Store user consent records for data processing, marketing, analytics, and third-party sharing

-- Create consents table
CREATE TABLE IF NOT EXISTS consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL CHECK (purpose IN ('data_processing', 'marketing', 'analytics', 'third_party')),
  granted BOOLEAN NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Ensure we track consent history chronologically
  CONSTRAINT consents_user_purpose_timestamp_key UNIQUE (user_id, purpose, created_at)
);

-- Create index for fast lookups by user
CREATE INDEX idx_consents_user_id ON consents(user_id);

-- Create index for purpose lookups
CREATE INDEX idx_consents_purpose ON consents(purpose);

-- Create index for getting latest consent per user/purpose
CREATE INDEX idx_consents_user_purpose_created ON consents(user_id, purpose, created_at DESC);

-- Enable Row Level Security
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own consents
CREATE POLICY "Users can view own consents"
  ON consents
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own consents
CREATE POLICY "Users can insert own consents"
  ON consents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Admins can view all consents (for compliance audits)
CREATE POLICY "Admins can view all consents"
  ON consents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()
      AND memberships.role = 'consultant'
    )
  );

-- Add comment for documentation
COMMENT ON TABLE consents IS 'GDPR consent records for tracking user permissions for data processing, marketing, analytics, and third-party sharing';
COMMENT ON COLUMN consents.purpose IS 'Type of consent: data_processing, marketing, analytics, third_party';
COMMENT ON COLUMN consents.granted IS 'Whether consent was granted (true) or withdrawn (false)';
COMMENT ON COLUMN consents.ip_address IS 'IP address from which consent was given/withdrawn';
COMMENT ON COLUMN consents.user_agent IS 'Browser user agent string for audit trail';
