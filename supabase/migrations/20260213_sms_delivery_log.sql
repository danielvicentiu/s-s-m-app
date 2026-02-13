-- Migration: Create sms_delivery_log and sms_cost_tracking tables
-- Description: Stores SMS delivery logs and cost tracking per organization
-- Date: 2026-02-13
-- Author: Claude (Edge Function: send-sms)

-- Create sms_delivery_log table
CREATE TABLE IF NOT EXISTS sms_delivery_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  phone text NOT NULL,
  message text NOT NULL,
  message_id text NOT NULL,
  country_code text NOT NULL,
  status text NOT NULL,
  error_message text,
  cost_usd numeric(10, 6) DEFAULT 0,
  sent_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add indexes for common queries
CREATE INDEX idx_sms_log_organization ON sms_delivery_log(organization_id);
CREATE INDEX idx_sms_log_phone ON sms_delivery_log(phone);
CREATE INDEX idx_sms_log_message_id ON sms_delivery_log(message_id);
CREATE INDEX idx_sms_log_status ON sms_delivery_log(status);
CREATE INDEX idx_sms_log_sent_at ON sms_delivery_log(sent_at DESC);
CREATE INDEX idx_sms_log_country_code ON sms_delivery_log(country_code);

-- Create sms_cost_tracking table (aggregated costs per organization)
CREATE TABLE IF NOT EXISTS sms_cost_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  total_sms_sent integer DEFAULT 0,
  total_cost_usd numeric(10, 2) DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(organization_id, period_start, period_end)
);

-- Add indexes for cost tracking
CREATE INDEX idx_sms_cost_organization ON sms_cost_tracking(organization_id);
CREATE INDEX idx_sms_cost_period ON sms_cost_tracking(period_start, period_end);

-- Enable RLS
ALTER TABLE sms_delivery_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_cost_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow service role to insert logs (from Edge Function)
CREATE POLICY "Edge Function can insert SMS logs"
  ON sms_delivery_log
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- RLS Policy: Allow authenticated users to view logs for their organization
CREATE POLICY "Users can view SMS logs for their org"
  ON sms_delivery_log
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Allow consultants to view all SMS logs
CREATE POLICY "Consultants can view all SMS logs"
  ON sms_delivery_log
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()
      AND memberships.role = 'consultant'
    )
  );

-- RLS Policy: Allow service role to manage cost tracking
CREATE POLICY "Edge Function can manage cost tracking"
  ON sms_cost_tracking
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policy: Allow users to view cost tracking for their organization
CREATE POLICY "Users can view cost tracking for their org"
  ON sms_cost_tracking
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Allow consultants to view all cost tracking
CREATE POLICY "Consultants can view all cost tracking"
  ON sms_cost_tracking
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()
      AND memberships.role = 'consultant'
    )
  );

-- Trigger: Update updated_at timestamp for sms_delivery_log
CREATE OR REPLACE FUNCTION update_sms_delivery_log_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_sms_delivery_log_updated_at
  BEFORE UPDATE ON sms_delivery_log
  FOR EACH ROW
  EXECUTE FUNCTION update_sms_delivery_log_updated_at();

-- Trigger: Update updated_at timestamp for sms_cost_tracking
CREATE OR REPLACE FUNCTION update_sms_cost_tracking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_sms_cost_tracking_updated_at
  BEFORE UPDATE ON sms_cost_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_sms_cost_tracking_updated_at();

-- Function: Update cost tracking when SMS is sent
CREATE OR REPLACE FUNCTION update_sms_cost_tracking()
RETURNS TRIGGER AS $$
DECLARE
  current_month_start timestamptz;
  current_month_end timestamptz;
BEGIN
  -- Calculate current month period
  current_month_start := date_trunc('month', NEW.sent_at);
  current_month_end := (current_month_start + interval '1 month' - interval '1 second');

  -- Upsert cost tracking
  INSERT INTO sms_cost_tracking (
    organization_id,
    period_start,
    period_end,
    total_sms_sent,
    total_cost_usd
  )
  VALUES (
    NEW.organization_id,
    current_month_start,
    current_month_end,
    1,
    COALESCE(NEW.cost_usd, 0)
  )
  ON CONFLICT (organization_id, period_start, period_end)
  DO UPDATE SET
    total_sms_sent = sms_cost_tracking.total_sms_sent + 1,
    total_cost_usd = sms_cost_tracking.total_cost_usd + COALESCE(NEW.cost_usd, 0),
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update cost tracking when SMS is logged
CREATE TRIGGER trigger_update_sms_cost_tracking
  AFTER INSERT ON sms_delivery_log
  FOR EACH ROW
  WHEN (NEW.organization_id IS NOT NULL AND NEW.status = 'sent')
  EXECUTE FUNCTION update_sms_cost_tracking();

-- Add comments
COMMENT ON TABLE sms_delivery_log IS 'Stores SMS delivery logs from Twilio API via send-sms Edge Function';
COMMENT ON COLUMN sms_delivery_log.organization_id IS 'Organization ID for cost tracking';
COMMENT ON COLUMN sms_delivery_log.phone IS 'Recipient phone number in international format (+40712345678)';
COMMENT ON COLUMN sms_delivery_log.message IS 'SMS message content (max 160 characters)';
COMMENT ON COLUMN sms_delivery_log.message_id IS 'Twilio message SID (e.g., SM1234567890abcdef)';
COMMENT ON COLUMN sms_delivery_log.country_code IS 'ISO country code detected from phone (RO, BG, HU, DE, etc.)';
COMMENT ON COLUMN sms_delivery_log.status IS 'Twilio delivery status (queued, sent, delivered, failed, etc.)';
COMMENT ON COLUMN sms_delivery_log.error_message IS 'Error message if delivery failed';
COMMENT ON COLUMN sms_delivery_log.cost_usd IS 'Estimated cost in USD (Twilio pricing per country)';

COMMENT ON TABLE sms_cost_tracking IS 'Aggregated SMS costs per organization per month';
COMMENT ON COLUMN sms_cost_tracking.organization_id IS 'Organization ID';
COMMENT ON COLUMN sms_cost_tracking.period_start IS 'Start of billing period (usually month start)';
COMMENT ON COLUMN sms_cost_tracking.period_end IS 'End of billing period (usually month end)';
COMMENT ON COLUMN sms_cost_tracking.total_sms_sent IS 'Total number of SMS messages sent in period';
COMMENT ON COLUMN sms_cost_tracking.total_cost_usd IS 'Total cost in USD for period';
