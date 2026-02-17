-- GDPR Module Migration
-- Created: 2026-02-17
-- Purpose: Registru prelucrări date personale, consimțăminte, DPO management

-- Table: gdpr_processing_activities
-- Descriere: Registru activități de prelucrare date personale (art. 30 GDPR)
CREATE TABLE IF NOT EXISTS gdpr_processing_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    activity_name TEXT NOT NULL,
    purpose TEXT NOT NULL,
    legal_basis TEXT NOT NULL CHECK (legal_basis IN ('consent', 'contract', 'legal_obligation', 'vital_interest', 'public_interest', 'legitimate_interest')),
    data_categories TEXT[] NOT NULL DEFAULT '{}',
    data_subjects TEXT[] NOT NULL DEFAULT '{}',
    recipients TEXT[] DEFAULT '{}',
    retention_period TEXT,
    cross_border_transfer BOOLEAN DEFAULT false,
    transfer_safeguards TEXT,
    technical_measures TEXT[] DEFAULT '{}',
    organizational_measures TEXT[] DEFAULT '{}',
    dpia_required BOOLEAN DEFAULT false,
    dpia_completed BOOLEAN DEFAULT false,
    dpia_date DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'under_review', 'archived')),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table: gdpr_consents
-- Descriere: Registru consimțăminte pentru prelucrare date personale
CREATE TABLE IF NOT EXISTS gdpr_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    person_name TEXT NOT NULL,
    person_email TEXT,
    person_cnp_hash TEXT,
    consent_type TEXT NOT NULL CHECK (consent_type IN ('processing', 'marketing', 'profiling', 'transfer', 'special_categories', 'other')),
    purpose TEXT NOT NULL,
    given_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    withdrawn_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    evidence_path TEXT,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: gdpr_dpo
-- Descriere: Date DPO (Data Protection Officer) - unic per organizație
CREATE TABLE IF NOT EXISTS gdpr_dpo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    dpo_name TEXT NOT NULL,
    dpo_email TEXT,
    dpo_phone TEXT,
    is_internal BOOLEAN DEFAULT true,
    company_name TEXT,
    appointment_date DATE,
    contract_expiry DATE,
    anspdcp_notified BOOLEAN DEFAULT false,
    anspdcp_notification_date DATE,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(organization_id)
);

-- Enable RLS
ALTER TABLE gdpr_processing_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_dpo ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "gdpr_processing_org" ON gdpr_processing_activities FOR ALL USING (
    organization_id IN (SELECT organization_id FROM memberships WHERE user_id = auth.uid())
);

CREATE POLICY "gdpr_consents_org" ON gdpr_consents FOR ALL USING (
    organization_id IN (SELECT organization_id FROM memberships WHERE user_id = auth.uid())
);

CREATE POLICY "gdpr_dpo_org" ON gdpr_dpo FOR ALL USING (
    organization_id IN (SELECT organization_id FROM memberships WHERE user_id = auth.uid())
);

-- Indexes
CREATE INDEX idx_gdpr_processing_org ON gdpr_processing_activities(organization_id);
CREATE INDEX idx_gdpr_processing_status ON gdpr_processing_activities(status);
CREATE INDEX idx_gdpr_consents_org ON gdpr_consents(organization_id);
CREATE INDEX idx_gdpr_consents_active ON gdpr_consents(is_active);
CREATE INDEX idx_gdpr_dpo_org ON gdpr_dpo(organization_id);

-- Trigger pentru updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gdpr_processing_updated_at
    BEFORE UPDATE ON gdpr_processing_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gdpr_dpo_updated_at
    BEFORE UPDATE ON gdpr_dpo
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
