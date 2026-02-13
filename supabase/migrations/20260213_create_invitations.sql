-- Migration: Create invitations table for organization member invitations
-- Date: 2026-02-13
-- Description: Allows org admins to invite new members via email with role assignment

-- Create invitations table
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('consultant', 'firma_admin', 'angajat')),
  invited_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  accepted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on token for fast lookup
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);

-- Create index on org_id for org-based queries
CREATE INDEX IF NOT EXISTS idx_invitations_org_id ON invitations(org_id);

-- Create index on email for checking existing invitations
CREATE INDEX IF NOT EXISTS idx_invitations_email ON invitations(email);

-- Create index on status for filtering active invitations
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);

-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Organization admins can view all invitations for their org
CREATE POLICY "org_admins_view_invitations" ON invitations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.org_id = invitations.org_id
        AND memberships.user_id = auth.uid()
        AND memberships.role IN ('consultant', 'firma_admin')
        AND memberships.deleted_at IS NULL
    )
  );

-- RLS Policy: Organization admins can create invitations for their org
CREATE POLICY "org_admins_create_invitations" ON invitations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.org_id = invitations.org_id
        AND memberships.user_id = auth.uid()
        AND memberships.role IN ('consultant', 'firma_admin')
        AND memberships.deleted_at IS NULL
    )
    AND invited_by = auth.uid()
  );

-- RLS Policy: Organization admins can update invitations for their org
CREATE POLICY "org_admins_update_invitations" ON invitations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.org_id = invitations.org_id
        AND memberships.user_id = auth.uid()
        AND memberships.role IN ('consultant', 'firma_admin')
        AND memberships.deleted_at IS NULL
    )
  );

-- RLS Policy: Anyone with valid token can view their invitation (for acceptance)
CREATE POLICY "token_holders_view_invitation" ON invitations
  FOR SELECT
  USING (token IS NOT NULL);

-- RLS Policy: Anyone with valid token can accept their invitation
CREATE POLICY "token_holders_accept_invitation" ON invitations
  FOR UPDATE
  USING (
    token IS NOT NULL
    AND status = 'pending'
    AND expires_at > NOW()
  )
  WITH CHECK (
    status IN ('accepted', 'expired')
  );

-- RLS Policy: Organization admins can delete invitations for their org
CREATE POLICY "org_admins_delete_invitations" ON invitations
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.org_id = invitations.org_id
        AND memberships.user_id = auth.uid()
        AND memberships.role IN ('consultant', 'firma_admin')
        AND memberships.deleted_at IS NULL
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_invitations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_invitations_updated_at
  BEFORE UPDATE ON invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_invitations_updated_at();

-- Create function to automatically expire old invitations
CREATE OR REPLACE FUNCTION expire_old_invitations()
RETURNS void AS $$
BEGIN
  UPDATE invitations
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE invitations IS 'Stores organization member invitations sent via email';
COMMENT ON COLUMN invitations.token IS 'Unique token used in invitation link for acceptance';
COMMENT ON COLUMN invitations.expires_at IS 'Invitation expiration time (default 7 days from creation)';
COMMENT ON COLUMN invitations.invited_by IS 'User ID of the admin who created the invitation';
