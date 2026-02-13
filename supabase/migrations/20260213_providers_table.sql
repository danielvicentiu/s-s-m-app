-- Migration: Tabela providers (Furnizori servicii externe)
-- Data: 13 Februarie 2026
-- Furnizori: firma SSM, clinica medicina muncii, firma PSI, ISCIR, firma verificare

CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  provider_type TEXT NOT NULL CHECK (provider_type IN (
    'firma_ssm',
    'clinica_medicina_muncii',
    'firma_psi',
    'iscir',
    'firma_verificare',
    'altul'
  )),
  name TEXT NOT NULL,
  cui TEXT,
  address TEXT,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contract_number TEXT,
  contract_start_date DATE,
  contract_end_date DATE,
  alert_days_before INTEGER DEFAULT 30,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pentru căutări rapide
CREATE INDEX idx_providers_organization_id ON providers(organization_id);
CREATE INDEX idx_providers_type ON providers(provider_type);
CREATE INDEX idx_providers_contract_end ON providers(contract_end_date) WHERE is_active = true;

-- RLS: Enable
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- Politici RLS (bazate pe memberships)
CREATE POLICY "Users can view providers of their organizations"
  ON providers FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can insert providers for their organizations"
  ON providers FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can update providers of their organizations"
  ON providers FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can delete providers of their organizations"
  ON providers FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Trigger pentru updated_at
CREATE OR REPLACE FUNCTION update_providers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER providers_updated_at
  BEFORE UPDATE ON providers
  FOR EACH ROW
  EXECUTE FUNCTION update_providers_updated_at();

-- Comentarii
COMMENT ON TABLE providers IS 'Furnizori servicii externe SSM/PSI - contracte și contacte';
COMMENT ON COLUMN providers.provider_type IS 'Tipul furnizorului: firma_ssm, clinica_medicina_muncii, firma_psi, iscir, firma_verificare, altul';
COMMENT ON COLUMN providers.alert_days_before IS 'Cu câte zile înainte de expirarea contractului să alerteze (default 30)';
