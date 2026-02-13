-- Migration: Create notification_log table
-- Purpose: Track all notifications sent through various channels (email, SMS, WhatsApp, push, in-app)
-- Date: 2026-02-13

-- Create enum for notification channels
CREATE TYPE notification_channel AS ENUM ('email', 'sms', 'whatsapp', 'push', 'in_app');

-- Create enum for notification status
CREATE TYPE notification_status AS ENUM ('sent', 'delivered', 'failed', 'bounced');

-- Create notification_log table
CREATE TABLE notification_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    channel notification_channel NOT NULL,
    template_name TEXT NOT NULL,
    status notification_status NOT NULL DEFAULT 'sent',
    external_id TEXT, -- ID from external service (SendGrid, Twilio, etc.)
    error_message TEXT,
    cost_units INTEGER DEFAULT 0, -- Cost in internal units for tracking
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for org_id + created_at (most common query pattern)
CREATE INDEX idx_notification_log_org_created ON notification_log(org_id, created_at DESC);

-- Create additional useful indexes
CREATE INDEX idx_notification_log_user ON notification_log(user_id);
CREATE INDEX idx_notification_log_status ON notification_log(status);
CREATE INDEX idx_notification_log_channel ON notification_log(channel);
CREATE INDEX idx_notification_log_external_id ON notification_log(external_id) WHERE external_id IS NOT NULL;

-- Enable RLS
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view notification logs for their organization
CREATE POLICY "Users can view notification logs for their organization"
    ON notification_log
    FOR SELECT
    USING (
        org_id IN (
            SELECT organization_id
            FROM memberships
            WHERE user_id = auth.uid()
        )
    );

-- RLS Policy: System can insert notification logs (for service role)
CREATE POLICY "Service role can insert notification logs"
    ON notification_log
    FOR INSERT
    WITH CHECK (true);

-- RLS Policy: System can update notification logs (for service role)
CREATE POLICY "Service role can update notification logs"
    ON notification_log
    FOR UPDATE
    USING (true);

-- Add comment
COMMENT ON TABLE notification_log IS 'Tracks all notifications sent through various channels with delivery status and cost tracking';
