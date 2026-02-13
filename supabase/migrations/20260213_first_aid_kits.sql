-- Migration: First Aid Kits Management
-- Date: 2026-02-13
-- Description: Tabele pentru gestionarea truselor de prim ajutor și conținutul lor

-- ══════════════════════════════════════════════════════════════════════════════
-- 1. TRUSE PRIM AJUTOR
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS first_aid_kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Identificare trusă
  name VARCHAR(255) NOT NULL,  -- ex: "Trusă Depozit", "Trusă Producție A"
  location VARCHAR(500) NOT NULL,  -- locație precisă
  kit_code VARCHAR(100),  -- cod intern (opțional)

  -- Verificare/Inspecție
  last_check_date DATE,
  next_check_date DATE,
  checked_by VARCHAR(255),  -- nume persoana care a verificat

  -- Status
  is_complete BOOLEAN DEFAULT true,  -- toate articolele sunt prezente?
  is_accessible BOOLEAN DEFAULT true,  -- accesibilă ușor?
  needs_restocking BOOLEAN DEFAULT false,  -- necesită recompletare?

  -- Conformitate
  meets_standards BOOLEAN DEFAULT true,  -- conform cu standardele
  standard_reference VARCHAR(255),  -- ex: "OUG 195/2022", "Ordinul 1030/2007"

  -- Note
  notes TEXT,

  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Index-uri
CREATE INDEX idx_first_aid_kits_org ON first_aid_kits(organization_id);
CREATE INDEX idx_first_aid_kits_next_check ON first_aid_kits(next_check_date);
CREATE INDEX idx_first_aid_kits_needs_restock ON first_aid_kits(needs_restocking) WHERE needs_restocking = true;

-- ══════════════════════════════════════════════════════════════════════════════
-- 2. CONȚINUT TRUSE (ARTICOLE)
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS first_aid_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id UUID NOT NULL REFERENCES first_aid_kits(id) ON DELETE CASCADE,

  -- Articol
  item_name VARCHAR(255) NOT NULL,  -- ex: "Comprese sterile", "Bandaj elastic"
  item_category VARCHAR(100),  -- ex: "Pansamente", "Medicamente", "Instrumente"

  -- Cantitate
  quantity_required INTEGER DEFAULT 1,  -- cantitate obligatorie
  quantity_current INTEGER DEFAULT 0,  -- cantitate curentă
  unit VARCHAR(50) DEFAULT 'buc',  -- buc, cutie, flacon, etc.

  -- Expirare
  expiry_date DATE,
  batch_number VARCHAR(100),

  -- Status
  is_present BOOLEAN DEFAULT true,  -- prezent în trusă?
  is_expired BOOLEAN DEFAULT false,  -- expirat?
  condition VARCHAR(100),  -- ex: "bun", "deteriorat", "lipsă"

  -- Verificare
  last_checked_at TIMESTAMP WITH TIME ZONE,
  checked_by VARCHAR(255),

  -- Note
  notes TEXT,

  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index-uri
CREATE INDEX idx_first_aid_items_kit ON first_aid_items(kit_id);
CREATE INDEX idx_first_aid_items_expiry ON first_aid_items(expiry_date);
CREATE INDEX idx_first_aid_items_missing ON first_aid_items(is_present) WHERE is_present = false;
CREATE INDEX idx_first_aid_items_expired ON first_aid_items(is_expired) WHERE is_expired = true;

-- ══════════════════════════════════════════════════════════════════════════════
-- 3. RLS (ROW LEVEL SECURITY)
-- ══════════════════════════════════════════════════════════════════════════════

ALTER TABLE first_aid_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE first_aid_items ENABLE ROW LEVEL SECURITY;

-- Policy pentru first_aid_kits: accesează doar trusele organizațiilor la care aparține
CREATE POLICY "Users can view kits from their organizations"
  ON first_aid_kits FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can insert kits for their organizations"
  ON first_aid_kits FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can update kits from their organizations"
  ON first_aid_kits FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can delete kits from their organizations"
  ON first_aid_kits FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Policy pentru first_aid_items: accesează doar articolele din trusele organizațiilor
CREATE POLICY "Users can view items from their organization kits"
  ON first_aid_items FOR SELECT
  USING (
    kit_id IN (
      SELECT id FROM first_aid_kits
      WHERE organization_id IN (
        SELECT organization_id FROM memberships
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

CREATE POLICY "Users can insert items for their organization kits"
  ON first_aid_items FOR INSERT
  WITH CHECK (
    kit_id IN (
      SELECT id FROM first_aid_kits
      WHERE organization_id IN (
        SELECT organization_id FROM memberships
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

CREATE POLICY "Users can update items from their organization kits"
  ON first_aid_items FOR UPDATE
  USING (
    kit_id IN (
      SELECT id FROM first_aid_kits
      WHERE organization_id IN (
        SELECT organization_id FROM memberships
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

CREATE POLICY "Users can delete items from their organization kits"
  ON first_aid_items FOR DELETE
  USING (
    kit_id IN (
      SELECT id FROM first_aid_kits
      WHERE organization_id IN (
        SELECT organization_id FROM memberships
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

-- ══════════════════════════════════════════════════════════════════════════════
-- 4. TRIGGER PENTRU UPDATED_AT
-- ══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_first_aid_kits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_first_aid_kits_updated_at
  BEFORE UPDATE ON first_aid_kits
  FOR EACH ROW
  EXECUTE FUNCTION update_first_aid_kits_updated_at();

CREATE OR REPLACE FUNCTION update_first_aid_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_first_aid_items_updated_at
  BEFORE UPDATE ON first_aid_items
  FOR EACH ROW
  EXECUTE FUNCTION update_first_aid_items_updated_at();

-- ══════════════════════════════════════════════════════════════════════════════
-- 5. COMENTARII
-- ══════════════════════════════════════════════════════════════════════════════

COMMENT ON TABLE first_aid_kits IS 'Truse prim ajutor cu locații și date verificare';
COMMENT ON TABLE first_aid_items IS 'Conținut truse prim ajutor (articole individuale)';

COMMENT ON COLUMN first_aid_kits.needs_restocking IS 'TRUE dacă necesită recompletare (articole lipsă sau expirate)';
COMMENT ON COLUMN first_aid_kits.is_accessible IS 'TRUE dacă trusa este ușor accesibilă (nesigurată, vizibilă)';
COMMENT ON COLUMN first_aid_items.quantity_required IS 'Cantitate minimă obligatorie conform standardelor';
COMMENT ON COLUMN first_aid_items.quantity_current IS 'Cantitate efectiv prezentă la ultima verificare';
