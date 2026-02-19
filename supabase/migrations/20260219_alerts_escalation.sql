-- S-S-M.RO — Migration: Alerts Escalation Table
-- Tabelă pentru cascada de alerte (email → SMS → WhatsApp → apel vocal)
-- Creat: 2026-02-19

CREATE TABLE IF NOT EXISTS alerts_escalation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID,
  employee_id UUID,
  organization_id UUID,
  level INT DEFAULT 1 CHECK (level BETWEEN 1 AND 4),
  channel TEXT CHECK (channel IN ('email', 'sms', 'whatsapp', 'call')),
  sent_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  error_message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'confirmed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_escalation_alert ON alerts_escalation(alert_id);
CREATE INDEX IF NOT EXISTS idx_escalation_status ON alerts_escalation(status, level);
CREATE INDEX IF NOT EXISTS idx_escalation_org ON alerts_escalation(organization_id);
