-- S-S-M.RO — OBLIGATIONS AND PUBLISHING SYSTEM
-- M5 Publishing Module: Store extracted obligations and publish to organizations
-- Data: 13 Februarie 2026

-- ══════════════════════════════════════════════════════════════
-- ENUMS
-- ══════════════════════════════════════════════════════════════

DO $$ BEGIN
  CREATE TYPE obligation_frequency AS ENUM (
    'annual',
    'biannual',
    'quarterly',
    'monthly',
    'weekly',
    'daily',
    'on_demand',
    'once',
    'at_hire',
    'at_termination',
    'continuous',
    'unknown'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE obligation_status AS ENUM (
    'draft',
    'validated',
    'approved',
    'published',
    'archived'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE org_obligation_status AS ENUM (
    'pending',
    'acknowledged',
    'compliant',
    'non_compliant'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ══════════════════════════════════════════════════════════════
-- TABLE: obligations
-- Stores extracted obligations from legislation (M3/M4 output)
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS obligations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source reference
  source_legal_act VARCHAR(255) NOT NULL,
  source_article_id VARCHAR(100),
  source_article_number VARCHAR(50),
  country_code VARCHAR(2) NOT NULL,

  -- Obligation content
  obligation_text TEXT NOT NULL,
  who TEXT[] NOT NULL DEFAULT '{}', -- ["angajator", "angajat", "ITM"]
  deadline VARCHAR(255),
  frequency obligation_frequency,

  -- Penalties
  penalty TEXT,
  penalty_min NUMERIC(10,2),
  penalty_max NUMERIC(10,2),
  penalty_currency VARCHAR(3),

  -- Evidence required
  evidence_required TEXT[] DEFAULT '{}',

  -- Quality metrics
  confidence NUMERIC(3,2) DEFAULT 0.0 CHECK (confidence >= 0 AND confidence <= 1),
  validation_score NUMERIC(3,2) DEFAULT 0.0 CHECK (validation_score >= 0 AND validation_score <= 1),

  -- Status management
  status obligation_status NOT NULL DEFAULT 'draft',
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,

  -- CAEN/Industry matching (for organization targeting)
  caen_codes TEXT[] DEFAULT '{}',
  industry_tags TEXT[] DEFAULT '{}',

  -- Audit
  extracted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  validated_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  -- Metadata
  language VARCHAR(2) DEFAULT 'ro',
  deduplication_hash VARCHAR(64),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for obligations
CREATE INDEX idx_obligations_country_code ON obligations(country_code);
CREATE INDEX idx_obligations_status ON obligations(status);
CREATE INDEX idx_obligations_published ON obligations(published) WHERE published = true;
CREATE INDEX idx_obligations_caen_codes ON obligations USING GIN(caen_codes);
CREATE INDEX idx_obligations_industry_tags ON obligations USING GIN(industry_tags);
CREATE INDEX idx_obligations_dedup_hash ON obligations(deduplication_hash);
CREATE INDEX idx_obligations_source_legal_act ON obligations(source_legal_act);

-- ══════════════════════════════════════════════════════════════
-- TABLE: organization_obligations
-- Published obligations assigned to organizations
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS organization_obligations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- References
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  obligation_id UUID NOT NULL REFERENCES obligations(id) ON DELETE CASCADE,

  -- Status tracking
  status org_obligation_status NOT NULL DEFAULT 'pending',

  -- Timestamps
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID REFERENCES profiles(id),
  compliant_at TIMESTAMP WITH TIME ZONE,
  compliant_by UUID REFERENCES profiles(id),

  -- Notes and evidence
  notes TEXT,
  evidence_urls TEXT[] DEFAULT '{}',

  -- Assignment metadata
  assigned_by UUID REFERENCES profiles(id),
  match_score NUMERIC(3,2) DEFAULT 1.0, -- How well this obligation matches the org
  match_reason VARCHAR(255), -- "country_match", "caen_match", "manual_assignment"

  -- Constraints
  UNIQUE(organization_id, obligation_id)
);

-- Indexes for organization_obligations
CREATE INDEX idx_org_obligations_org_id ON organization_obligations(organization_id);
CREATE INDEX idx_org_obligations_obligation_id ON organization_obligations(obligation_id);
CREATE INDEX idx_org_obligations_status ON organization_obligations(status);
CREATE INDEX idx_org_obligations_assigned_at ON organization_obligations(assigned_at);

-- ══════════════════════════════════════════════════════════════
-- RLS POLICIES
-- ══════════════════════════════════════════════════════════════

-- Enable RLS
ALTER TABLE obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_obligations ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────
-- RLS: obligations
-- ────────────────────────────────────────────────────────────

-- Consultants can view all published obligations for their country
CREATE POLICY "Consultants can view published obligations"
  ON obligations
  FOR SELECT
  USING (
    published = true
    AND status = 'published'
    AND (
      -- Super admin sees all
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = auth.uid()
          AND r.role_key = 'super_admin'
          AND ur.is_active = true
      )
      OR
      -- Users see obligations for their country
      country_code IN (
        SELECT DISTINCT o.country_code
        FROM organizations o
        JOIN memberships m ON m.organization_id = o.id
        WHERE m.user_id = auth.uid()
          AND m.is_active = true
      )
    )
  );

-- Super admin can view all obligations (including drafts)
CREATE POLICY "Super admin can view all obligations"
  ON obligations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND r.role_key = 'super_admin'
        AND ur.is_active = true
    )
  );

-- Super admin can create obligations
CREATE POLICY "Super admin can create obligations"
  ON obligations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND r.role_key = 'super_admin'
        AND ur.is_active = true
    )
  );

-- Super admin can update obligations
CREATE POLICY "Super admin can update obligations"
  ON obligations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND r.role_key = 'super_admin'
        AND ur.is_active = true
    )
  );

-- ────────────────────────────────────────────────────────────
-- RLS: organization_obligations
-- ────────────────────────────────────────────────────────────

-- Users can view obligations for their organizations
CREATE POLICY "Users can view org obligations"
  ON organization_obligations
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

-- Consultants and firma_admin can acknowledge/update org obligations
CREATE POLICY "Users can update org obligations"
  ON organization_obligations
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- Super admin can create org obligations (manual assignment)
CREATE POLICY "Super admin can create org obligations"
  ON organization_obligations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND r.role_key = 'super_admin'
        AND ur.is_active = true
    )
  );

-- Service role can insert (for automated publishing)
CREATE POLICY "Service role can insert org obligations"
  ON organization_obligations
  FOR INSERT
  WITH CHECK (true);

-- ══════════════════════════════════════════════════════════════
-- TRIGGERS
-- ══════════════════════════════════════════════════════════════

-- Update updated_at on obligations
CREATE OR REPLACE FUNCTION update_obligations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_obligations_updated_at
  BEFORE UPDATE ON obligations
  FOR EACH ROW
  EXECUTE FUNCTION update_obligations_updated_at();

-- Auto-set published_at when status changes to published
CREATE OR REPLACE FUNCTION set_obligation_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.published = true;
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_obligation_published_at
  BEFORE UPDATE ON obligations
  FOR EACH ROW
  EXECUTE FUNCTION set_obligation_published_at();

-- ══════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS
-- ══════════════════════════════════════════════════════════════

-- Function to get obligations for an organization
CREATE OR REPLACE FUNCTION get_organization_obligations(org_id UUID)
RETURNS TABLE (
  id UUID,
  obligation_text TEXT,
  status org_obligation_status,
  frequency obligation_frequency,
  deadline VARCHAR,
  penalty TEXT,
  assigned_at TIMESTAMP WITH TIME ZONE,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  source_legal_act VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    oo.id,
    o.obligation_text,
    oo.status,
    o.frequency,
    o.deadline,
    o.penalty,
    oo.assigned_at,
    oo.acknowledged_at,
    o.source_legal_act
  FROM organization_obligations oo
  JOIN obligations o ON o.id = oo.obligation_id
  WHERE oo.organization_id = org_id
  ORDER BY oo.assigned_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to count obligations by status for an organization
CREATE OR REPLACE FUNCTION count_organization_obligations_by_status(org_id UUID)
RETURNS TABLE (
  status org_obligation_status,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    oo.status,
    COUNT(*)::BIGINT
  FROM organization_obligations oo
  WHERE oo.organization_id = org_id
  GROUP BY oo.status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ══════════════════════════════════════════════════════════════
-- COMMENTS
-- ══════════════════════════════════════════════════════════════

COMMENT ON TABLE obligations IS 'Extracted obligations from legislation (M3/M4 pipeline output)';
COMMENT ON COLUMN obligations.confidence IS 'Claude AI confidence score in extraction (0.0-1.0)';
COMMENT ON COLUMN obligations.validation_score IS 'M4 validation score (0.0-1.0)';
COMMENT ON COLUMN obligations.deduplication_hash IS 'Hash for identifying duplicate obligations';
COMMENT ON COLUMN obligations.caen_codes IS 'CAEN codes for targeting specific industries';

COMMENT ON TABLE organization_obligations IS 'Published obligations assigned to organizations';
COMMENT ON COLUMN organization_obligations.match_score IS 'How well this obligation matches the organization (0.0-1.0)';
COMMENT ON COLUMN organization_obligations.match_reason IS 'Why this obligation was assigned (country_match, caen_match, manual)';
