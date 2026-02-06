-- Migration: REGES Integration Tables
-- Created: 2026-02-06
-- Description: Tabele pentru integrarea REGES (ANRE) - conexiuni, transmiteri, receipts, results, audit

-- =====================================================
-- 1. REGES Connections (configurare client REGES)
-- =====================================================
CREATE TABLE IF NOT EXISTS reges_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  cui TEXT NOT NULL,
  reges_user_id TEXT NOT NULL,
  reges_employer_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  last_sync_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, cui)
);

CREATE INDEX idx_reges_connections_org ON reges_connections(organization_id);
CREATE INDEX idx_reges_connections_status ON reges_connections(status);

COMMENT ON TABLE reges_connections IS 'Conexiuni REGES configurate per organizație';
COMMENT ON COLUMN reges_connections.cui IS 'CUI firma pentru care se face conectarea REGES';
COMMENT ON COLUMN reges_connections.reges_user_id IS 'User ID din REGES (primit de la ANRE)';
COMMENT ON COLUMN reges_connections.reges_employer_id IS 'Employer ID din REGES (primit de la ANRE)';

-- =====================================================
-- 2. REGES Outbox (coada de transmitere date)
-- =====================================================
CREATE TABLE IF NOT EXISTS reges_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  connection_id UUID NOT NULL REFERENCES reges_connections(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL CHECK (message_type IN ('employee_create', 'employee_update', 'employee_delete', 'contract_create', 'contract_update', 'contract_end')),
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sending', 'sent', 'accepted', 'rejected', 'error')),
  priority INTEGER NOT NULL DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  scheduled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  receipt_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reges_outbox_org ON reges_outbox(organization_id);
CREATE INDEX idx_reges_outbox_status ON reges_outbox(status);
CREATE INDEX idx_reges_outbox_scheduled ON reges_outbox(scheduled_at) WHERE status = 'queued';
CREATE INDEX idx_reges_outbox_connection ON reges_outbox(connection_id);

COMMENT ON TABLE reges_outbox IS 'Coada mesaje de trimis către REGES';
COMMENT ON COLUMN reges_outbox.priority IS 'Prioritate 1-10 (1=highest, 10=lowest)';
COMMENT ON COLUMN reges_outbox.payload IS 'Date JSON conform schema REGES';

-- =====================================================
-- 3. REGES Receipts (confirmări primite de la REGES)
-- =====================================================
CREATE TABLE IF NOT EXISTS reges_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outbox_id UUID NOT NULL REFERENCES reges_outbox(id) ON DELETE CASCADE,
  receipt_number TEXT,
  receipt_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('accepted', 'rejected', 'pending_validation')),
  validation_errors JSONB,
  raw_response JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reges_receipts_outbox ON reges_receipts(outbox_id);
CREATE INDEX idx_reges_receipts_status ON reges_receipts(status);
CREATE INDEX idx_reges_receipts_number ON reges_receipts(receipt_number);

COMMENT ON TABLE reges_receipts IS 'Confirmări primite de la REGES pentru mesaje trimise';
COMMENT ON COLUMN reges_receipts.validation_errors IS 'Erori de validare returnate de REGES (dacă status=rejected)';

-- =====================================================
-- 4. REGES Results (rezultate procesare REGES)
-- =====================================================
CREATE TABLE IF NOT EXISTS reges_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id UUID NOT NULL REFERENCES reges_receipts(id) ON DELETE CASCADE,
  result_type TEXT NOT NULL CHECK (result_type IN ('success', 'partial_success', 'failure')),
  employee_external_id TEXT,
  contract_external_id TEXT,
  reges_employee_id TEXT,
  reges_contract_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reges_results_receipt ON reges_results(receipt_id);
CREATE INDEX idx_reges_results_type ON reges_results(result_type);
CREATE INDEX idx_reges_results_employee_ext ON reges_results(employee_external_id);

COMMENT ON TABLE reges_results IS 'Rezultate procesare REGES (ID-uri generate, succese, erori)';
COMMENT ON COLUMN reges_results.employee_external_id IS 'ID angajat din sistemul nostru';
COMMENT ON COLUMN reges_results.reges_employee_id IS 'ID angajat generat de REGES';

-- =====================================================
-- 5. Audit Log (istoric operațiuni REGES)
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('reges_connection', 'reges_outbox', 'reges_receipt', 'reges_result', 'employee', 'contract', 'organization', 'user')),
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_org ON audit_log(organization_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);

COMMENT ON TABLE audit_log IS 'Audit trail complet pentru toate operațiunile din platformă';
COMMENT ON COLUMN audit_log.action IS 'Acțiune efectuată: create, update, delete, sync, send, etc.';
COMMENT ON COLUMN audit_log.metadata IS 'Context suplimentar (ex: source=reges_api, trigger=auto_sync)';

-- =====================================================
-- 6. RLS (Row Level Security) Policies
-- =====================================================

-- Enable RLS
ALTER TABLE reges_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE reges_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE reges_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reges_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- reges_connections: doar membri activi ai organizației pot vedea conexiunile
CREATE POLICY "Users can view connections for their organizations"
  ON reges_connections FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can insert connections for their organizations"
  ON reges_connections FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true AND role IN ('consultant', 'firma_admin')
    )
  );

CREATE POLICY "Users can update connections for their organizations"
  ON reges_connections FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true AND role IN ('consultant', 'firma_admin')
    )
  );

-- reges_outbox: doar membri ai organizației pot vedea outbox-ul
CREATE POLICY "Users can view outbox for their organizations"
  ON reges_outbox FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- reges_receipts: acces via outbox
CREATE POLICY "Users can view receipts for their outbox"
  ON reges_receipts FOR SELECT
  USING (
    outbox_id IN (
      SELECT id FROM reges_outbox
      WHERE organization_id IN (
        SELECT organization_id FROM memberships
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

-- reges_results: acces via receipts
CREATE POLICY "Users can view results for their receipts"
  ON reges_results FOR SELECT
  USING (
    receipt_id IN (
      SELECT r.id FROM reges_receipts r
      JOIN reges_outbox o ON r.outbox_id = o.id
      WHERE o.organization_id IN (
        SELECT organization_id FROM memberships
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

-- audit_log: doar consultanți pot vedea audit-ul complet
CREATE POLICY "Consultants can view all audit logs"
  ON audit_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE user_id = auth.uid() AND role = 'consultant' AND is_active = true
    )
  );

CREATE POLICY "Users can view audit logs for their organizations"
  ON audit_log FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- =====================================================
-- 7. Triggers pentru updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reges_connections_updated_at
  BEFORE UPDATE ON reges_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reges_outbox_updated_at
  BEFORE UPDATE ON reges_outbox
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. Sample Data (pentru development)
-- =====================================================

-- Comentat pentru producție, decomentează pentru testing local:
-- INSERT INTO reges_connections (organization_id, cui, reges_user_id, reges_employer_id, status)
-- SELECT id, cui, 'REGES_USER_DEMO', 'REGES_EMP_DEMO', 'active'
-- FROM organizations LIMIT 1;
