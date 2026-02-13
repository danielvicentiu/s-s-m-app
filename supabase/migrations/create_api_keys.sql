-- Migration: Create API Keys table for programmatic access
-- Purpose: Enable secure API key management for organizations
-- Author: Claude Code
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
    rate_limit INTEGER DEFAULT 1000,
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create unique index on key_hash for fast lookups and prevent duplicates
CREATE UNIQUE INDEX idx_api_keys_key_hash ON public.api_keys(key_hash);

-- Create index on org_id for organization-based queries
CREATE INDEX idx_api_keys_org_id ON public.api_keys(org_id);

-- Create index on key_prefix for API key verification
CREATE INDEX idx_api_keys_key_prefix ON public.api_keys(key_prefix);

-- Create index on is_active for filtering active keys
CREATE INDEX idx_api_keys_is_active ON public.api_keys(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "api_keys_select_policy" ON public.api_keys;
DROP POLICY IF EXISTS "api_keys_insert_policy" ON public.api_keys;
DROP POLICY IF EXISTS "api_keys_update_policy" ON public.api_keys;
DROP POLICY IF EXISTS "api_keys_delete_policy" ON public.api_keys;

-- RLS Policy: Admins can view all API keys in their organization
CREATE POLICY "api_keys_select_policy" ON public.api_keys
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships m
            WHERE m.org_id = api_keys.org_id
            AND m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
    );

-- RLS Policy: Admins can create API keys for their organization
CREATE POLICY "api_keys_insert_policy" ON public.api_keys
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.memberships m
            WHERE m.org_id = api_keys.org_id
            AND m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
        AND created_by = auth.uid()
    );

-- RLS Policy: Admins can update API keys in their organization
CREATE POLICY "api_keys_update_policy" ON public.api_keys
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships m
            WHERE m.org_id = api_keys.org_id
            AND m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
    );

-- RLS Policy: Admins can delete API keys in their organization
CREATE POLICY "api_keys_delete_policy" ON public.api_keys
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships m
            WHERE m.org_id = api_keys.org_id
            AND m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_api_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_api_keys_updated_at_trigger
    BEFORE UPDATE ON public.api_keys
    FOR EACH ROW
    EXECUTE FUNCTION public.update_api_keys_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.api_keys IS 'API keys for programmatic access to the platform';
COMMENT ON COLUMN public.api_keys.id IS 'Primary key';
COMMENT ON COLUMN public.api_keys.org_id IS 'Organization that owns this API key';
COMMENT ON COLUMN public.api_keys.name IS 'Friendly name for the API key';
COMMENT ON COLUMN public.api_keys.key_hash IS 'Hashed API key (bcrypt or similar)';
COMMENT ON COLUMN public.api_keys.key_prefix IS 'First 8 characters of key for identification';
COMMENT ON COLUMN public.api_keys.permissions IS 'JSON array of permitted operations';
COMMENT ON COLUMN public.api_keys.last_used_at IS 'Timestamp of last API key usage';
COMMENT ON COLUMN public.api_keys.usage_count IS 'Total number of times this key was used';
COMMENT ON COLUMN public.api_keys.rate_limit IS 'Maximum requests per hour';
COMMENT ON COLUMN public.api_keys.is_active IS 'Whether the key is currently active';
COMMENT ON COLUMN public.api_keys.created_by IS 'User who created this API key';
COMMENT ON COLUMN public.api_keys.expires_at IS 'Optional expiration timestamp';
COMMENT ON COLUMN public.api_keys.created_at IS 'Timestamp when key was created';
COMMENT ON COLUMN public.api_keys.updated_at IS 'Timestamp when key was last updated';
