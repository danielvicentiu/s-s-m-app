-- Migration: Create audits and audit_items tables
-- Purpose: Track SSM/PSI/GDPR/ISO45001 audits with detailed questionnaire responses
-- Author: Claude + Daniel
-- Date: 2026-02-14

-- =====================================================
-- TABLE: audits
-- =====================================================
CREATE TABLE IF NOT EXISTS audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    audit_type VARCHAR(50) NOT NULL CHECK (audit_type IN ('ssm', 'psi', 'gdpr', 'iso45001')),
    auditor_name VARCHAR(255) NOT NULL,
    audit_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed')),
    overall_score INT CHECK (overall_score >= 0 AND overall_score <= 100),
    findings_count INT DEFAULT 0 CHECK (findings_count >= 0),
    non_conformities_count INT DEFAULT 0 CHECK (non_conformities_count >= 0),
    report_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Indexes for performance
    CONSTRAINT audits_org_id_idx CHECK (org_id IS NOT NULL)
);

-- Indexes
CREATE INDEX IF NOT EXISTS audits_org_id_idx ON audits(org_id);
CREATE INDEX IF NOT EXISTS audits_audit_type_idx ON audits(audit_type);
CREATE INDEX IF NOT EXISTS audits_status_idx ON audits(status);
CREATE INDEX IF NOT EXISTS audits_audit_date_idx ON audits(audit_date DESC);
CREATE INDEX IF NOT EXISTS audits_created_at_idx ON audits(created_at DESC);

-- =====================================================
-- TABLE: audit_items
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    question_id VARCHAR(50) NOT NULL, -- Reference to questionnaire item (e.g., "SSM-1.1")
    question_text TEXT NOT NULL, -- Store question text for historical reference
    category VARCHAR(100), -- Question category (e.g., "Organizarea muncii")
    response VARCHAR(50) NOT NULL CHECK (response IN ('yes', 'no', 'partial', 'na')),
    comment TEXT,
    evidence_url TEXT,
    non_conformity_level VARCHAR(50) NOT NULL DEFAULT 'none' CHECK (non_conformity_level IN ('none', 'minor', 'major', 'critical')),
    score INT CHECK (score >= 0 AND score <= 100), -- Score for this item
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Ensure unique question per audit
    CONSTRAINT audit_items_unique_question UNIQUE (audit_id, question_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS audit_items_audit_id_idx ON audit_items(audit_id);
CREATE INDEX IF NOT EXISTS audit_items_response_idx ON audit_items(response);
CREATE INDEX IF NOT EXISTS audit_items_non_conformity_idx ON audit_items(non_conformity_level);

-- =====================================================
-- TRIGGERS: updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_audits_updated_at
    BEFORE UPDATE ON audits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audit_items_updated_at
    BEFORE UPDATE ON audit_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS POLICIES: audits
-- =====================================================
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view audits from their organization(s)
CREATE POLICY "Users can view audits from their organization"
    ON audits
    FOR SELECT
    USING (
        org_id IN (
            SELECT org_id
            FROM memberships
            WHERE user_id = auth.uid()
        )
    );

-- Policy: Consultants and admins can create audits
CREATE POLICY "Consultants and admins can create audits"
    ON audits
    FOR INSERT
    WITH CHECK (
        org_id IN (
            SELECT m.org_id
            FROM memberships m
            WHERE m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
    );

-- Policy: Consultants and admins can update audits in their org
CREATE POLICY "Consultants and admins can update audits"
    ON audits
    FOR UPDATE
    USING (
        org_id IN (
            SELECT m.org_id
            FROM memberships m
            WHERE m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
    )
    WITH CHECK (
        org_id IN (
            SELECT m.org_id
            FROM memberships m
            WHERE m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
    );

-- Policy: Only consultants can delete audits
CREATE POLICY "Only consultants can delete audits"
    ON audits
    FOR DELETE
    USING (
        org_id IN (
            SELECT m.org_id
            FROM memberships m
            WHERE m.user_id = auth.uid()
            AND m.role = 'consultant'
        )
    );

-- =====================================================
-- RLS POLICIES: audit_items
-- =====================================================
ALTER TABLE audit_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view audit items if they can view the parent audit
CREATE POLICY "Users can view audit items from their organization"
    ON audit_items
    FOR SELECT
    USING (
        audit_id IN (
            SELECT a.id
            FROM audits a
            INNER JOIN memberships m ON a.org_id = m.org_id
            WHERE m.user_id = auth.uid()
        )
    );

-- Policy: Consultants and admins can create audit items
CREATE POLICY "Consultants and admins can create audit items"
    ON audit_items
    FOR INSERT
    WITH CHECK (
        audit_id IN (
            SELECT a.id
            FROM audits a
            INNER JOIN memberships m ON a.org_id = m.org_id
            WHERE m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
    );

-- Policy: Consultants and admins can update audit items
CREATE POLICY "Consultants and admins can update audit items"
    ON audit_items
    FOR UPDATE
    USING (
        audit_id IN (
            SELECT a.id
            FROM audits a
            INNER JOIN memberships m ON a.org_id = m.org_id
            WHERE m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
    )
    WITH CHECK (
        audit_id IN (
            SELECT a.id
            FROM audits a
            INNER JOIN memberships m ON a.org_id = m.org_id
            WHERE m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
    );

-- Policy: Only consultants can delete audit items
CREATE POLICY "Only consultants can delete audit items"
    ON audit_items
    FOR DELETE
    USING (
        audit_id IN (
            SELECT a.id
            FROM audits a
            INNER JOIN memberships m ON a.org_id = m.org_id
            WHERE m.user_id = auth.uid()
            AND m.role = 'consultant'
        )
    );

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE audits IS 'Stores audit records (SSM, PSI, GDPR, ISO45001) with overall scores and status';
COMMENT ON TABLE audit_items IS 'Stores individual questionnaire responses for each audit';
COMMENT ON COLUMN audits.audit_type IS 'Type of audit: ssm, psi, gdpr, iso45001';
COMMENT ON COLUMN audits.status IS 'Audit status: draft, in_progress, completed';
COMMENT ON COLUMN audits.overall_score IS 'Overall audit score (0-100)';
COMMENT ON COLUMN audit_items.response IS 'Response type: yes, no, partial, na (not applicable)';
COMMENT ON COLUMN audit_items.non_conformity_level IS 'Severity: none, minor, major, critical';
