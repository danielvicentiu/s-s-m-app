-- Create notification_log table for tracking all notification deliveries
-- Part of the centralized notification system

CREATE TYPE notification_channel AS ENUM (
  'email',
  'sms',
  'whatsapp',
  'push',
  'in_app'
);

CREATE TYPE notification_status AS ENUM (
  'sent',
  'delivered',
  'failed',
  'bounced'
);

CREATE TABLE IF NOT EXISTS notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  channel notification_channel NOT NULL,
  template_name TEXT NOT NULL,
  status notification_status NOT NULL DEFAULT 'sent',
  external_id TEXT, -- External provider ID (Resend, Twilio, etc.)
  error_message TEXT,
  cost_units INTEGER DEFAULT 0, -- Cost tracking in units (e.g., 1 unit = 1 credit)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Index for efficient querying by organization and date
CREATE INDEX idx_notification_log_org_created ON notification_log(org_id, created_at DESC);

-- Index for user-specific notification history
CREATE INDEX idx_notification_log_user ON notification_log(user_id, created_at DESC);

-- Index for filtering by channel
CREATE INDEX idx_notification_log_channel ON notification_log(channel, created_at DESC);

-- Index for status monitoring and analytics
CREATE INDEX idx_notification_log_status ON notification_log(status, created_at DESC);

-- Index for external provider tracking
CREATE INDEX idx_notification_log_external ON notification_log(external_id) WHERE external_id IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view notification logs for their organization
CREATE POLICY "Users can view org notification logs"
  ON notification_log
  FOR SELECT
  USING (
    org_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
      AND deleted_at IS NULL
    )
  );

-- Policy: Only system/admin can insert notification logs
CREATE POLICY "System can insert notification logs"
  ON notification_log
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM memberships
      WHERE user_id = auth.uid()
      AND organization_id = org_id
      AND role IN ('consultant', 'firma_admin')
      AND deleted_at IS NULL
    )
  );

-- Policy: No updates allowed (immutable log)
CREATE POLICY "No updates to notification logs"
  ON notification_log
  FOR UPDATE
  USING (false);

-- Policy: No deletes allowed (permanent audit trail)
CREATE POLICY "No deletes from notification logs"
  ON notification_log
  FOR DELETE
  USING (false);

-- Add helpful comments
COMMENT ON TABLE notification_log IS 'Audit log for all notification deliveries across all channels';
COMMENT ON COLUMN notification_log.org_id IS 'Organization that owns this notification';
COMMENT ON COLUMN notification_log.user_id IS 'Recipient user (nullable for system notifications)';
COMMENT ON COLUMN notification_log.channel IS 'Delivery channel: email, sms, whatsapp, push, in_app';
COMMENT ON COLUMN notification_log.template_name IS 'Name of the notification template used';
COMMENT ON COLUMN notification_log.status IS 'Delivery status: sent, delivered, failed, bounced';
COMMENT ON COLUMN notification_log.external_id IS 'Provider-specific message ID for tracking';
COMMENT ON COLUMN notification_log.error_message IS 'Error details if status is failed or bounced';
COMMENT ON COLUMN notification_log.cost_units IS 'Cost in credits/units for billing tracking';
