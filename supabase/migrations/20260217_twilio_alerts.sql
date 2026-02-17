-- ============================================================
-- MIGRARE: Twilio Alerts System
-- Tabele: alert_configurations, alert_logs, alert_usage
-- Data: 2026-02-17
-- ============================================================

-- Alert configuration per organization
CREATE TABLE IF NOT EXISTS alert_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  whatsapp_enabled BOOLEAN DEFAULT false,
  sms_enabled BOOLEAN DEFAULT false,
  email_enabled BOOLEAN DEFAULT true, -- implicit activ
  alert_days INTEGER[] DEFAULT '{30, 14, 7, 1}', -- zile înainte de expirare
  escalation_enabled BOOLEAN DEFAULT false,
  escalation_after_hours INTEGER DEFAULT 48,
  escalation_contact_name TEXT,
  escalation_contact_phone TEXT,
  escalation_contact_email TEXT,
  monthly_report_enabled BOOLEAN DEFAULT true,
  monthly_report_day INTEGER DEFAULT 1, -- ziua din lună
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(organization_id)
);

-- Alert log (audit trail complet)
CREATE TABLE IF NOT EXISTS alert_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN (
    'training_expiry', 'medical_expiry', 'psi_expiry', 'iscir_expiry',
    'monthly_report', 'escalation', 'compliance_warning'
  )),
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'sms', 'email')),
  recipient_name TEXT,
  recipient_phone TEXT,
  recipient_email TEXT,
  message_content TEXT NOT NULL,
  related_entity_type TEXT, -- 'employee', 'equipment', etc.
  related_entity_id UUID,
  expiry_date DATE,
  days_until_expiry INTEGER,
  -- Delivery tracking
  twilio_message_sid TEXT,
  delivery_status TEXT DEFAULT 'queued' CHECK (delivery_status IN (
    'queued', 'sent', 'delivered', 'read', 'failed', 'undelivered'
  )),
  delivery_updated_at TIMESTAMPTZ,
  -- Escalation
  is_escalation BOOLEAN DEFAULT false,
  escalated_from_id UUID REFERENCES alert_logs(id),
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Monthly usage counter (pentru billing)
CREATE TABLE IF NOT EXISTS alert_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  month DATE NOT NULL, -- prima zi a lunii
  whatsapp_count INTEGER DEFAULT 0,
  sms_count INTEGER DEFAULT 0,
  email_count INTEGER DEFAULT 0,
  total_cost_eur DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(organization_id, month)
);

-- RLS
ALTER TABLE alert_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_usage ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "alert_config_org" ON alert_configurations FOR ALL USING (
  organization_id IN (SELECT organization_id FROM memberships WHERE user_id = auth.uid())
);
CREATE POLICY "alert_logs_org" ON alert_logs FOR ALL USING (
  organization_id IN (SELECT organization_id FROM memberships WHERE user_id = auth.uid())
);
CREATE POLICY "alert_usage_org" ON alert_usage FOR ALL USING (
  organization_id IN (SELECT organization_id FROM memberships WHERE user_id = auth.uid())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_alert_logs_org ON alert_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_alert_logs_date ON alert_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alert_logs_status ON alert_logs(delivery_status);
CREATE INDEX IF NOT EXISTS idx_alert_logs_type ON alert_logs(alert_type);
CREATE INDEX IF NOT EXISTS idx_alert_usage_org_month ON alert_usage(organization_id, month);

-- Trigger updated_at
CREATE TRIGGER update_alert_config_updated_at
BEFORE UPDATE ON alert_configurations FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
