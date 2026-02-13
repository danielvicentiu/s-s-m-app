-- Migration: Organizations table
-- Created: 2026-02-13
-- Descriere: Tabela principală pentru organizații (firme client)
--            cu CUI, setări, plan subscripție, module activate

-- ============================================================
-- 1. CREATE TYPE pentru plan subscripție
-- ============================================================

DO $$ BEGIN
  CREATE TYPE subscription_plan AS ENUM ('free', 'basic', 'professional', 'enterprise');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- 2. CREATE TABLE organizations
-- ============================================================

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Date de identificare
  name TEXT NOT NULL,
  cui TEXT UNIQUE,
  address TEXT,
  county TEXT,
  contact_email TEXT,
  contact_phone TEXT,

  -- Subscripție și module
  plan subscription_plan NOT NULL DEFAULT 'free',
  modules TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['medical', 'equipment', 'trainings', 'documents']

  -- Setări organizație (JSONB flexibil)
  settings JSONB DEFAULT '{
    "notifications": {
      "email": true,
      "sms": false,
      "whatsapp": false
    },
    "alerts": {
      "medical_30d": true,
      "medical_15d": true,
      "medical_7d": true,
      "equipment_30d": true,
      "equipment_15d": true
    },
    "preferences": {
      "default_locale": "ro",
      "timezone": "Europe/Bucharest"
    }
  }'::JSONB,

  -- Metadata și statistici
  data_completeness DECIMAL(5,2) DEFAULT 0.00 CHECK (data_completeness >= 0 AND data_completeness <= 100),
  employee_count INTEGER DEFAULT 0,
  exposure_score TEXT DEFAULT 'necalculat' CHECK (
    exposure_score IN ('necalculat', 'scazut', 'mediu', 'ridicat', 'critic')
  ),
  preferred_channels TEXT[] DEFAULT ARRAY['email']::TEXT[],
  cooperation_status TEXT DEFAULT 'active' CHECK (
    cooperation_status IN ('active', 'warning', 'uncooperative')
  ),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ -- soft delete
);

-- ============================================================
-- 3. INDEXES pentru performanță
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_organizations_cui ON organizations(cui) WHERE cui IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_organizations_plan ON organizations(plan);
CREATE INDEX IF NOT EXISTS idx_organizations_deleted_at ON organizations(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_organizations_created_at ON organizations(created_at DESC);

-- Index GIN pentru căutări în JSONB settings
CREATE INDEX IF NOT EXISTS idx_organizations_settings ON organizations USING GIN (settings);

-- Index GIN pentru căutări în array modules
CREATE INDEX IF NOT EXISTS idx_organizations_modules ON organizations USING GIN (modules);

-- ============================================================
-- 4. TRIGGER pentru updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Policy: Consultant poate vedea toate organizațiile la care are acces prin memberships
CREATE POLICY "Users can read orgs they belong to"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Policy: Consultant poate crea organizații noi
CREATE POLICY "Consultants can create organizations"
  ON organizations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Consultant și firma_admin pot actualiza organizația
CREATE POLICY "Authorized users can update organization"
  ON organizations FOR UPDATE
  USING (
    id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- Policy: Doar consultant poate șterge (soft delete) organizații
CREATE POLICY "Only consultants can delete organizations"
  ON organizations FOR DELETE
  USING (
    id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role = 'consultant'
    )
  );

-- ============================================================
-- 6. COMENTARII pentru documentație
-- ============================================================

COMMENT ON TABLE organizations IS 'Organizații (firme client) cu subscripții, module și setări';
COMMENT ON COLUMN organizations.cui IS 'Cod Unic de Înregistrare (RO) - unic per firmă';
COMMENT ON COLUMN organizations.plan IS 'Plan subscripție: free, basic, professional, enterprise';
COMMENT ON COLUMN organizations.modules IS 'Module activate: medical, equipment, trainings, documents, etc.';
COMMENT ON COLUMN organizations.settings IS 'Setări JSONB: notificări, alerte, preferințe locale';
COMMENT ON COLUMN organizations.data_completeness IS 'Procent completare date (0-100)';
COMMENT ON COLUMN organizations.exposure_score IS 'Scor risc SSM: necalculat, scazut, mediu, ridicat, critic';
COMMENT ON COLUMN organizations.deleted_at IS 'Timestamp pentru soft delete';
