-- Migration: API Keys Management
-- Description: Creates table for managing API keys with rate limiting and permissions
-- Author: Claude
-- Date: 2026-02-13

-- Create api_keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash TEXT NOT NULL,
    key_prefix VARCHAR(8) NOT NULL,
    permissions JSONB DEFAULT '[]'::jsonb,
    last_used_at TIMESTAMPTZ,
    usage_count INTEGER DEFAULT 0,
    rate_limit INTEGER DEFAULT 1000, -- requests per hour
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create unique index on key_hash
CREATE UNIQUE INDEX idx_api_keys_key_hash ON public.api_keys(key_hash);

-- Create indexes for performance
CREATE INDEX idx_api_keys_org_id ON public.api_keys(org_id);
CREATE INDEX idx_api_keys_is_active ON public.api_keys(is_active);
CREATE INDEX idx_api_keys_created_by ON public.api_keys(created_by);
CREATE INDEX idx_api_keys_expires_at ON public.api_keys(expires_at) WHERE expires_at IS NOT NULL;

-- Create trigger for updated_at
CREATE TRIGGER update_api_keys_updated_at
    BEFORE UPDATE ON public.api_keys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admin users can manage API keys for their organization
CREATE POLICY "Admin users can view API keys for their organization"
    ON public.api_keys
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = api_keys.org_id
            AND memberships.role IN ('consultant', 'firma_admin')
        )
    );

CREATE POLICY "Admin users can create API keys for their organization"
    ON public.api_keys
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = api_keys.org_id
            AND memberships.role IN ('consultant', 'firma_admin')
        )
    );

CREATE POLICY "Admin users can update API keys for their organization"
    ON public.api_keys
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = api_keys.org_id
            AND memberships.role IN ('consultant', 'firma_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = api_keys.org_id
            AND memberships.role IN ('consultant', 'firma_admin')
        )
    );

CREATE POLICY "Admin users can delete API keys for their organization"
    ON public.api_keys
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = api_keys.org_id
            AND memberships.role IN ('consultant', 'firma_admin')
        )
    );

-- Add comment to table
COMMENT ON TABLE public.api_keys IS 'Stores API keys for programmatic access with rate limiting and permissions';
COMMENT ON COLUMN public.api_keys.key_hash IS 'SHA-256 hash of the API key';
COMMENT ON COLUMN public.api_keys.key_prefix IS 'First 8 characters of the key for identification';
COMMENT ON COLUMN public.api_keys.permissions IS 'JSON array of allowed permissions/scopes';
COMMENT ON COLUMN public.api_keys.rate_limit IS 'Maximum requests per hour';
