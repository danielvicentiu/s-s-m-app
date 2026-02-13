-- Migration: Create legislation table for SSM/PSI/GDPR compliance tracking
-- Author: Claude Code
-- Date: 2026-02-13
-- Description: Table for storing and tracking legislation across multiple countries and domains

-- Create legislation table
CREATE TABLE IF NOT EXISTS public.legislation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country VARCHAR(2) NOT NULL, -- ISO 3166-1 alpha-2 code (RO, BG, HU, DE, etc.)
    domain VARCHAR(20) NOT NULL CHECK (domain IN ('ssm', 'psi', 'gdpr', 'mediu', 'muncii')),
    title TEXT NOT NULL,
    number VARCHAR(100), -- Act number (e.g., "319/2006", "L 1/2018")
    year INTEGER,
    publication_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'vigoare' CHECK (status IN ('vigoare', 'modificat', 'abrogat')),
    source_url TEXT,
    full_text TEXT,
    obligations_count INTEGER DEFAULT 0,
    pipeline_status VARCHAR(20) DEFAULT 'pending' CHECK (pipeline_status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_legislation_country_domain ON public.legislation(country, domain);
CREATE INDEX idx_legislation_status ON public.legislation(status);
CREATE INDEX idx_legislation_pipeline_status ON public.legislation(pipeline_status);
CREATE INDEX idx_legislation_year ON public.legislation(year);
CREATE INDEX idx_legislation_deleted_at ON public.legislation(deleted_at) WHERE deleted_at IS NULL;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_legislation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_legislation_updated_at
    BEFORE UPDATE ON public.legislation
    FOR EACH ROW
    EXECUTE FUNCTION update_legislation_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.legislation ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow authenticated users to read all legislation
CREATE POLICY "Allow authenticated users to read legislation"
    ON public.legislation
    FOR SELECT
    TO authenticated
    USING (deleted_at IS NULL);

-- RLS Policy: Allow consultants and admins to insert/update/delete legislation
-- (Will be refined with RBAC system later)
CREATE POLICY "Allow consultants to manage legislation"
    ON public.legislation
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.role IN ('consultant', 'firma_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.role IN ('consultant', 'firma_admin')
        )
    );

-- Add comment to table
COMMENT ON TABLE public.legislation IS 'Stores legislation data for SSM/PSI/GDPR compliance tracking across multiple countries';
COMMENT ON COLUMN public.legislation.country IS 'ISO 3166-1 alpha-2 country code (RO, BG, HU, DE, etc.)';
COMMENT ON COLUMN public.legislation.domain IS 'Compliance domain: ssm (safety), psi (fire), gdpr, mediu (environment), muncii (labor)';
COMMENT ON COLUMN public.legislation.pipeline_status IS 'Processing status for scraping/parsing pipeline';
COMMENT ON COLUMN public.legislation.obligations_count IS 'Number of compliance obligations extracted from this legislation';
COMMENT ON COLUMN public.legislation.deleted_at IS 'Soft delete timestamp - NULL means active';
