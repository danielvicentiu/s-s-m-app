-- WEBHOOK LOGS TABLE
-- Pentru stocare audit trail webhooks primite de la provideri externi

CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(50) NOT NULL CHECK (provider IN ('stripe', 'reges', 'certsign')),
  event_type VARCHAR(100) NOT NULL,
  webhook_id VARCHAR(255),
  signature_valid BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(20) NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'processing', 'processed', 'failed', 'ignored')),
  http_method VARCHAR(10) NOT NULL DEFAULT 'POST',
  headers JSONB,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  error_message TEXT,
  processing_time_ms INTEGER,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pentru queries frecvente
CREATE INDEX idx_webhook_logs_provider ON webhook_logs(provider);
CREATE INDEX idx_webhook_logs_event_type ON webhook_logs(event_type);
CREATE INDEX idx_webhook_logs_status ON webhook_logs(status);
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs(created_at DESC);
CREATE INDEX idx_webhook_logs_organization_id ON webhook_logs(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX idx_webhook_logs_webhook_id ON webhook_logs(webhook_id) WHERE webhook_id IS NOT NULL;

-- Trigger pentru updated_at
CREATE TRIGGER set_webhook_logs_updated_at
  BEFORE UPDATE ON webhook_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS: doar consultanți pot vedea webhook logs
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Consultanți pot vedea toate webhook logs"
  ON webhook_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()
      AND memberships.role = 'consultant'
      AND memberships.is_active = true
    )
  );

-- Edge Functions pot insera webhooks (folosind service role key)
CREATE POLICY "Service role poate insera webhooks"
  ON webhook_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role poate updata webhooks"
  ON webhook_logs FOR UPDATE
  USING (true);

COMMENT ON TABLE webhook_logs IS 'Audit trail pentru toate webhooks primite de la provideri externi (Stripe, REGES, certSIGN)';
COMMENT ON COLUMN webhook_logs.provider IS 'Providerul care a trimis webhook-ul: stripe, reges, certsign';
COMMENT ON COLUMN webhook_logs.event_type IS 'Tipul evenimentului (ex: payment.succeeded, certificate.issued)';
COMMENT ON COLUMN webhook_logs.webhook_id IS 'ID-ul unic al webhook-ului de la provider (dacă există)';
COMMENT ON COLUMN webhook_logs.signature_valid IS 'Dacă signature-ul webhook-ului a fost validat cu succes';
COMMENT ON COLUMN webhook_logs.status IS 'Status procesare: received, processing, processed, failed, ignored';
COMMENT ON COLUMN webhook_logs.processing_time_ms IS 'Timp procesare în milisecunde';
