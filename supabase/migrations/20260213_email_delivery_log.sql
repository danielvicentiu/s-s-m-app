-- Migration: Create email_delivery_log table
-- Description: Stores email delivery logs from send-email-batch Edge Function
-- Date: 2026-02-13
-- Author: Claude (Edge Function: send-email-batch)

-- Create email_delivery_log table
CREATE TABLE IF NOT EXISTS email_delivery_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  template_name text NOT NULL,
  message_id text NOT NULL,
  batch_id text NOT NULL,
  status text NOT NULL,
  error_message text,
  sent_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add indexes for common queries
CREATE INDEX idx_email_log_email ON email_delivery_log(email);
CREATE INDEX idx_email_log_template ON email_delivery_log(template_name);
CREATE INDEX idx_email_log_message_id ON email_delivery_log(message_id);
CREATE INDEX idx_email_log_batch_id ON email_delivery_log(batch_id);
CREATE INDEX idx_email_log_status ON email_delivery_log(status);
CREATE INDEX idx_email_log_sent_at ON email_delivery_log(sent_at DESC);

-- Enable RLS
ALTER TABLE email_delivery_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow service role to insert logs (from Edge Function)
CREATE POLICY "Edge Function can insert email logs"
  ON email_delivery_log
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- RLS Policy: Allow authenticated users to view logs
CREATE POLICY "Authenticated users can view email logs"
  ON email_delivery_log
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policy: Allow consultants to view all logs
CREATE POLICY "Consultants can view all email logs"
  ON email_delivery_log
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
CREATE OR REPLACE FUNCTION update_email_delivery_log_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_email_delivery_log_updated_at
  BEFORE UPDATE ON email_delivery_log
  FOR EACH ROW
  EXECUTE FUNCTION update_email_delivery_log_updated_at();

-- Add comments
COMMENT ON TABLE email_delivery_log IS 'Stores email delivery logs from Resend API via send-email-batch Edge Function';
COMMENT ON COLUMN email_delivery_log.email IS 'Recipient email address';
COMMENT ON COLUMN email_delivery_log.template_name IS 'Name of the email template used (training_reminder, medical_expiry, etc.)';
COMMENT ON COLUMN email_delivery_log.message_id IS 'Resend message ID for tracking';
COMMENT ON COLUMN email_delivery_log.batch_id IS 'Batch ID for grouping emails sent together';
COMMENT ON COLUMN email_delivery_log.status IS 'Resend delivery status (sent, delivered, failed, etc.)';
COMMENT ON COLUMN email_delivery_log.error_message IS 'Error message if delivery failed';
COMMENT ON COLUMN email_delivery_log.sent_at IS 'Timestamp when email was sent via Resend';
