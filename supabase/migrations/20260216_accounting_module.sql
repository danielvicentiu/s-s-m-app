-- Accounting Module Migration
-- Created: 2026-02-16
-- Purpose: Create tables for accounting/fiscal management module

-- =====================================================
-- Table: accounting_contracts
-- =====================================================
CREATE TABLE IF NOT EXISTS accounting_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_cui TEXT,
  client_j_number TEXT,
  contract_number TEXT,
  contract_date DATE,
  services JSONB DEFAULT '[]'::jsonb,
  monthly_fee NUMERIC(12,2),
  currency TEXT DEFAULT 'RON' CHECK (currency IN ('RON', 'EUR', 'HUF')),
  payment_day INTEGER CHECK (payment_day BETWEEN 1 AND 31),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'terminated')),
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- Table: accounting_deadlines
-- =====================================================
CREATE TABLE IF NOT EXISTS accounting_deadlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES accounting_contracts(id) ON DELETE CASCADE,
  deadline_type TEXT NOT NULL CHECK (deadline_type IN (
    'D112', 'D394', 'D300', 'D100', 'D101', 'D390', 'D205',
    'declaratie_unica', 'bilant', 'raportare_semestriala',
    'TVA', 'impozit_profit', 'impozit_micro', 'CIM_registru',
    'pontaj', 'alte'
  )),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  recurrence TEXT CHECK (recurrence IN ('monthly', 'quarterly', 'semi_annual', 'annual', 'one_time')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue', 'not_applicable')),
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES auth.users(id),
  reminder_days INTEGER[] DEFAULT ARRAY[14, 7, 3, 1],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- Table: accounting_activity_log
-- =====================================================
CREATE TABLE IF NOT EXISTS accounting_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES accounting_contracts(id) ON DELETE CASCADE,
  deadline_id UUID REFERENCES accounting_deadlines(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  performed_by UUID REFERENCES auth.users(id),
  performed_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- Indexes
-- =====================================================
CREATE INDEX idx_accounting_contracts_org_status ON accounting_contracts(org_id, status);
CREATE INDEX idx_accounting_deadlines_org_due_status ON accounting_deadlines(org_id, due_date, status);
CREATE INDEX idx_accounting_deadlines_contract ON accounting_deadlines(contract_id);
CREATE INDEX idx_accounting_activity_log_org_time ON accounting_activity_log(org_id, performed_at DESC);
CREATE INDEX idx_accounting_deadlines_due_date ON accounting_deadlines(due_date);

-- =====================================================
-- RLS Policies: accounting_contracts
-- =====================================================
ALTER TABLE accounting_contracts ENABLE ROW LEVEL SECURITY;

-- Users can view contracts from their organization
CREATE POLICY accounting_contracts_select ON accounting_contracts
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM memberships WHERE user_id = auth.uid()
    )
  );

-- Admin/manager can insert contracts
CREATE POLICY accounting_contracts_insert ON accounting_contracts
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT m.org_id FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- Admin/manager can update contracts
CREATE POLICY accounting_contracts_update ON accounting_contracts
  FOR UPDATE
  USING (
    org_id IN (
      SELECT m.org_id FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- Admin/manager can delete contracts
CREATE POLICY accounting_contracts_delete ON accounting_contracts
  FOR DELETE
  USING (
    org_id IN (
      SELECT m.org_id FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- =====================================================
-- RLS Policies: accounting_deadlines
-- =====================================================
ALTER TABLE accounting_deadlines ENABLE ROW LEVEL SECURITY;

-- Users can view deadlines from their organization
CREATE POLICY accounting_deadlines_select ON accounting_deadlines
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM memberships WHERE user_id = auth.uid()
    )
  );

-- Admin/manager can insert deadlines
CREATE POLICY accounting_deadlines_insert ON accounting_deadlines
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT m.org_id FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- Admin/manager can update deadlines
CREATE POLICY accounting_deadlines_update ON accounting_deadlines
  FOR UPDATE
  USING (
    org_id IN (
      SELECT m.org_id FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- Admin/manager can delete deadlines
CREATE POLICY accounting_deadlines_delete ON accounting_deadlines
  FOR DELETE
  USING (
    org_id IN (
      SELECT m.org_id FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- =====================================================
-- RLS Policies: accounting_activity_log
-- =====================================================
ALTER TABLE accounting_activity_log ENABLE ROW LEVEL SECURITY;

-- Users can view activity log from their organization
CREATE POLICY accounting_activity_log_select ON accounting_activity_log
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM memberships WHERE user_id = auth.uid()
    )
  );

-- Admin/manager can insert activity log
CREATE POLICY accounting_activity_log_insert ON accounting_activity_log
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT m.org_id FROM memberships m
      WHERE m.user_id = auth.uid()
      AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- =====================================================
-- View: v_upcoming_deadlines
-- =====================================================
CREATE OR REPLACE VIEW v_upcoming_deadlines AS
SELECT
  d.*,
  c.client_name,
  c.client_cui,
  c.contract_number
FROM accounting_deadlines d
LEFT JOIN accounting_contracts c ON d.contract_id = c.id
WHERE d.status IN ('pending', 'in_progress')
  AND d.due_date >= CURRENT_DATE
ORDER BY d.due_date ASC;

-- =====================================================
-- View: v_overdue_deadlines
-- =====================================================
CREATE OR REPLACE VIEW v_overdue_deadlines AS
SELECT
  d.*,
  c.client_name,
  c.client_cui,
  c.contract_number
FROM accounting_deadlines d
LEFT JOIN accounting_contracts c ON d.contract_id = c.id
WHERE d.due_date < CURRENT_DATE
  AND d.status NOT IN ('completed', 'not_applicable')
ORDER BY d.due_date ASC;

-- =====================================================
-- Function: auto_mark_overdue
-- =====================================================
CREATE OR REPLACE FUNCTION auto_mark_overdue()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE accounting_deadlines
  SET status = 'overdue'
  WHERE due_date < CURRENT_DATE
    AND status = 'pending';

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Trigger: updated_at on accounting_contracts
-- =====================================================
CREATE OR REPLACE FUNCTION update_accounting_contracts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_accounting_contracts_updated_at
  BEFORE UPDATE ON accounting_contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_accounting_contracts_updated_at();

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON TABLE accounting_contracts IS 'Contracte de contabilitate și servicii fiscale per organizație';
COMMENT ON TABLE accounting_deadlines IS 'Termene fiscale și obligații contabile cu alertare';
COMMENT ON TABLE accounting_activity_log IS 'Jurnal activități pentru urmărire audit';
COMMENT ON FUNCTION auto_mark_overdue() IS 'Marchează automat termenele expirate ca overdue';
