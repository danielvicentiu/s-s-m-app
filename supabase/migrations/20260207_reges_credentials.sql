-- Migration: Add encrypted credentials to REGES + employee snapshots table
-- Created: 2026-02-07
-- Description: Extinde reges_connections cu credențiale criptate și creează tabel pentru sync angajați

-- =====================================================
-- 1. Add encrypted credentials to reges_connections
-- =====================================================
ALTER TABLE reges_connections
  ADD COLUMN IF NOT EXISTS encrypted_credentials TEXT,
  ADD COLUMN IF NOT EXISTS encryption_key_version TEXT DEFAULT 'v1';

COMMENT ON COLUMN reges_connections.encrypted_credentials IS 'Credențiale REGES criptate (username + password) cu AES-256-GCM';
COMMENT ON COLUMN reges_connections.encryption_key_version IS 'Versiunea cheii de criptare (pentru key rotation)';

-- =====================================================
-- 2. Create employee snapshots table for REGES sync
-- =====================================================
CREATE TABLE IF NOT EXISTS reges_employee_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES reges_connections(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Employee identifiers
  cnp TEXT NOT NULL,
  full_name TEXT NOT NULL,
  reges_employee_id TEXT,

  -- Employment data
  position TEXT,
  contract_type TEXT,
  employment_status TEXT NOT NULL CHECK (employment_status IN ('active', 'departed', 'suspended')),
  start_date DATE,
  end_date DATE,

  -- Sync metadata
  snapshot_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  raw_data JSONB NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Unique: same CNP can have multiple snapshots over time
  UNIQUE(connection_id, cnp, snapshot_date)
);

-- Indexes for performance
CREATE INDEX idx_reges_emp_snap_conn ON reges_employee_snapshots(connection_id);
CREATE INDEX idx_reges_emp_snap_org ON reges_employee_snapshots(organization_id);
CREATE INDEX idx_reges_emp_snap_cnp ON reges_employee_snapshots(cnp);
CREATE INDEX idx_reges_emp_snap_status ON reges_employee_snapshots(employment_status);
CREATE INDEX idx_reges_emp_snap_date ON reges_employee_snapshots(snapshot_date DESC);

COMMENT ON TABLE reges_employee_snapshots IS 'Snapshots angajați sincronizați din REGES (permite diff calculation)';
COMMENT ON COLUMN reges_employee_snapshots.cnp IS 'Cod Numeric Personal (cheie unică pentru upsert)';
COMMENT ON COLUMN reges_employee_snapshots.employment_status IS 'Status angajare: active (activ), departed (plecat), suspended (suspendat)';
COMMENT ON COLUMN reges_employee_snapshots.raw_data IS 'Date complete din REGES (JSON original)';

-- =====================================================
-- 3. RLS Policies for reges_employee_snapshots
-- =====================================================
ALTER TABLE reges_employee_snapshots ENABLE ROW LEVEL SECURITY;

-- Users can view snapshots for their active organizations
CREATE POLICY "Users can view snapshots for their orgs"
  ON reges_employee_snapshots FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Service role can insert/update snapshots (API sync)
CREATE POLICY "Service role can manage snapshots"
  ON reges_employee_snapshots FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 4. Trigger for updated_at
-- =====================================================
CREATE TRIGGER update_reges_employee_snapshots_updated_at
  BEFORE UPDATE ON reges_employee_snapshots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. Audit log integration
-- =====================================================
-- Add REGES snapshot events to audit_log
-- (Se va popula automat când sync-ul inserează date)
