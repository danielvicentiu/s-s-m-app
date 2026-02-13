-- Migration: Create webhook_logs table
-- Description: Stores all inbound and outbound webhook requests/responses for audit and debugging
-- Created: 2026-02-13

-- Create webhook_logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    url TEXT NOT NULL,
    method TEXT NOT NULL,
    headers JSONB,
    payload JSONB,
    status_code INTEGER,
    response_body TEXT,
    duration_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for efficient queries by organization and time
CREATE INDEX idx_webhook_logs_org_created
ON webhook_logs(org_id, created_at DESC);

-- Create index for direction filtering
CREATE INDEX idx_webhook_logs_direction
ON webhook_logs(direction);

-- Create index for status code filtering (useful for error tracking)
CREATE INDEX idx_webhook_logs_status
ON webhook_logs(status_code)
WHERE status_code IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view webhook logs for their organization
CREATE POLICY "Users can view webhook logs for their organization"
ON webhook_logs
FOR SELECT
USING (
    org_id IN (
        SELECT organization_id
        FROM memberships
        WHERE user_id = auth.uid()
    )
);

-- RLS Policy: System can insert webhook logs (for service operations)
CREATE POLICY "System can insert webhook logs"
ON webhook_logs
FOR INSERT
WITH CHECK (true);

-- RLS Policy: Only admins/consultants can delete old logs
CREATE POLICY "Admins can delete webhook logs"
ON webhook_logs
FOR DELETE
USING (
    org_id IN (
        SELECT organization_id
        FROM memberships
        WHERE user_id = auth.uid()
        AND role IN ('consultant', 'firma_admin')
    )
);

-- Add comment to table
COMMENT ON TABLE webhook_logs IS 'Audit log for all webhook requests (inbound and outbound)';
COMMENT ON COLUMN webhook_logs.direction IS 'inbound: received webhooks, outbound: sent webhooks';
COMMENT ON COLUMN webhook_logs.duration_ms IS 'Request duration in milliseconds';
COMMENT ON COLUMN webhook_logs.status_code IS 'HTTP status code of the response';
