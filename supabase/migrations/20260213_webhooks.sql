-- Create webhooks table for organization webhook subscriptions
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL DEFAULT '{}', -- Array of event types to subscribe to
  secret TEXT NOT NULL, -- Secret key for HMAC signature verification
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT valid_url CHECK (url ~* '^https?://'),
  CONSTRAINT valid_events CHECK (array_length(events, 1) > 0)
);

-- Create webhook_delivery_log table for tracking webhook deliveries
CREATE TABLE IF NOT EXISTS webhook_delivery_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed')),
  http_status_code INTEGER,
  response_body TEXT,
  error_message TEXT,
  attempts INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_webhooks_organization ON webhooks(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_webhooks_active ON webhooks(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_webhook_delivery_log_webhook ON webhook_delivery_log(webhook_id);
CREATE INDEX idx_webhook_delivery_log_status ON webhook_delivery_log(status);
CREATE INDEX idx_webhook_delivery_log_created ON webhook_delivery_log(created_at DESC);

-- Enable RLS
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_delivery_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for webhooks table
-- Admin can view webhooks for their organization
CREATE POLICY "Admin can view organization webhooks"
  ON webhooks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.user_id = auth.uid()
        AND m.organization_id = webhooks.organization_id
        AND m.role IN ('consultant', 'firma_admin')
        AND m.deleted_at IS NULL
    )
    AND deleted_at IS NULL
  );

-- Admin can create webhooks for their organization
CREATE POLICY "Admin can create organization webhooks"
  ON webhooks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.user_id = auth.uid()
        AND m.organization_id = organization_id
        AND m.role IN ('consultant', 'firma_admin')
        AND m.deleted_at IS NULL
    )
  );

-- Admin can update webhooks for their organization
CREATE POLICY "Admin can update organization webhooks"
  ON webhooks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.user_id = auth.uid()
        AND m.organization_id = webhooks.organization_id
        AND m.role IN ('consultant', 'firma_admin')
        AND m.deleted_at IS NULL
    )
    AND deleted_at IS NULL
  );

-- RLS Policies for webhook_delivery_log table
-- Admin can view delivery logs for their organization's webhooks
CREATE POLICY "Admin can view webhook delivery logs"
  ON webhook_delivery_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM webhooks w
      INNER JOIN memberships m ON m.organization_id = w.organization_id
      WHERE w.id = webhook_delivery_log.webhook_id
        AND m.user_id = auth.uid()
        AND m.role IN ('consultant', 'firma_admin')
        AND m.deleted_at IS NULL
        AND w.deleted_at IS NULL
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_webhooks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER webhooks_updated_at
  BEFORE UPDATE ON webhooks
  FOR EACH ROW
  EXECUTE FUNCTION update_webhooks_updated_at();

-- Comments
COMMENT ON TABLE webhooks IS 'Webhook subscriptions for organizations';
COMMENT ON TABLE webhook_delivery_log IS 'Log of webhook delivery attempts';
COMMENT ON COLUMN webhooks.events IS 'Array of event types: employee.created, employee.updated, training.completed, etc.';
COMMENT ON COLUMN webhooks.secret IS 'Secret key used to generate HMAC signature for webhook verification';
COMMENT ON COLUMN webhook_delivery_log.status IS 'Delivery status: pending, success, failed';
