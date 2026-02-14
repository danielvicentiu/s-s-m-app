-- Migration: Create whatsapp_delivery_log table
-- Description: Stores WhatsApp message delivery logs from send-whatsapp Edge Function
-- Date: 2026-02-13
-- Author: Claude (Edge Function: send-whatsapp)

-- Create whatsapp_delivery_log table
CREATE TABLE IF NOT EXISTS whatsapp_delivery_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  template_name text NOT NULL,
  message_id text NOT NULL,
  status text NOT NULL,
  error_message text,
  sent_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add indexes for common queries
CREATE INDEX idx_whatsapp_log_phone ON whatsapp_delivery_log(phone);
CREATE INDEX idx_whatsapp_log_template ON whatsapp_delivery_log(template_name);
CREATE INDEX idx_whatsapp_log_message_id ON whatsapp_delivery_log(message_id);
CREATE INDEX idx_whatsapp_log_status ON whatsapp_delivery_log(status);
CREATE INDEX idx_whatsapp_log_sent_at ON whatsapp_delivery_log(sent_at DESC);

-- Enable RLS
ALTER TABLE whatsapp_delivery_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow service role to insert logs (from Edge Function)
CREATE POLICY "Edge Function can insert logs"
  ON whatsapp_delivery_log
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- RLS Policy: Allow authenticated users to view logs for their organization
-- (Requires organization_id to be added if needed, or restrict by phone)
CREATE POLICY "Authenticated users can view logs"
  ON whatsapp_delivery_log
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policy: Allow admins to view all logs
CREATE POLICY "Admins can view all logs"
  ON whatsapp_delivery_log
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()
      AND memberships.role = 'consultant'
    )
  );

-- Trigger: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_whatsapp_delivery_log_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_whatsapp_delivery_log_updated_at
  BEFORE UPDATE ON whatsapp_delivery_log
  FOR EACH ROW
  EXECUTE FUNCTION update_whatsapp_delivery_log_updated_at();

-- Add comments
COMMENT ON TABLE whatsapp_delivery_log IS 'Stores WhatsApp message delivery logs from Twilio API via send-whatsapp Edge Function';
COMMENT ON COLUMN whatsapp_delivery_log.phone IS 'Recipient phone number in international format (+40712345678)';
COMMENT ON COLUMN whatsapp_delivery_log.template_name IS 'Name of the WhatsApp template used (training_reminder, medical_expiry, etc.)';
COMMENT ON COLUMN whatsapp_delivery_log.message_id IS 'Twilio message SID (e.g., SM1234567890abcdef)';
COMMENT ON COLUMN whatsapp_delivery_log.status IS 'Twilio delivery status (queued, sent, delivered, failed, etc.)';
COMMENT ON COLUMN whatsapp_delivery_log.error_message IS 'Error message if delivery failed';
COMMENT ON COLUMN whatsapp_delivery_log.sent_at IS 'Timestamp when message was sent via Twilio';
