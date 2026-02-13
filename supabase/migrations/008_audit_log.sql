-- Migration: 008_audit_log.sql
-- Description: Create audit_log table with JSONB changes, IP tracking, and RLS
-- Author: Claude
-- Date: 2026-02-13

-- =============================================
-- 1. CREATE audit_log TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- User and organization context
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,

    -- Action details
    action VARCHAR(100) NOT NULL, -- e.g., 'create', 'update', 'delete', 'login', 'export'
    resource_type VARCHAR(100) NOT NULL, -- e.g., 'employee', 'training', 'document', 'user'
    resource_id UUID, -- ID of the affected resource (nullable for actions like 'login')

    -- Change tracking
    changes JSONB, -- Stores before/after state or action-specific data
    -- Example: {"before": {"status": "active"}, "after": {"status": "inactive"}}
    -- Example: {"exported_records": 150, "format": "xlsx"}

    -- Request metadata
    ip_address INET, -- Client IP address
    user_agent TEXT, -- Browser/client user agent

    -- Additional context
    description TEXT, -- Human-readable description of the action
    metadata JSONB, -- Additional flexible data

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 2. CREATE INDEXES
-- =============================================

-- Primary query patterns: time-based filtering and user/org filtering
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at DESC);
CREATE INDEX idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_organization_id ON public.audit_log(organization_id) WHERE organization_id IS NOT NULL;

-- Action and resource filtering
CREATE INDEX idx_audit_log_action ON public.audit_log(action);
CREATE INDEX idx_audit_log_resource_type ON public.audit_log(resource_type);
CREATE INDEX idx_audit_log_resource_id ON public.audit_log(resource_id) WHERE resource_id IS NOT NULL;

-- Composite index for common query patterns (org + time)
CREATE INDEX idx_audit_log_org_created ON public.audit_log(organization_id, created_at DESC)
    WHERE organization_id IS NOT NULL;

-- GIN index for JSONB columns to enable efficient queries on changes and metadata
CREATE INDEX idx_audit_log_changes ON public.audit_log USING GIN (changes);
CREATE INDEX idx_audit_log_metadata ON public.audit_log USING GIN (metadata);

-- =============================================
-- 3. ENABLE ROW LEVEL SECURITY (READ-ONLY)
-- =============================================

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Users can READ audit logs for their organizations (read-only access)
-- Only users with appropriate permissions should see audit logs
CREATE POLICY "Users can view audit logs for their organizations"
    ON public.audit_log
    FOR SELECT
    USING (
        -- User can see logs for organizations they belong to
        EXISTS (
            SELECT 1
            FROM public.memberships m
            WHERE m.user_id = auth.uid()
            AND m.organization_id = audit_log.organization_id
            AND m.deleted_at IS NULL
        )
        OR
        -- User can see their own personal logs (where organization_id is NULL)
        (user_id = auth.uid() AND organization_id IS NULL)
    );

-- Policy: NO INSERT, UPDATE, or DELETE via RLS
-- Audit logs should only be written by backend functions/triggers
-- This ensures data integrity and prevents tampering

-- =============================================
-- 4. GRANT PERMISSIONS
-- =============================================

-- Grant SELECT to authenticated users (subject to RLS)
GRANT SELECT ON public.audit_log TO authenticated;

-- Service role has full access (for backend operations)
-- This is implicit via service_role key

-- =============================================
-- 5. HELPER FUNCTION FOR LOGGING
-- =============================================

-- Function to insert audit log entries (callable by backend)
-- This bypasses RLS since it's a SECURITY DEFINER function
CREATE OR REPLACE FUNCTION public.log_audit_event(
    p_user_id UUID,
    p_organization_id UUID,
    p_action VARCHAR(100),
    p_resource_type VARCHAR(100),
    p_resource_id UUID,
    p_changes JSONB,
    p_ip_address INET,
    p_user_agent TEXT,
    p_description TEXT,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO public.audit_log (
        user_id,
        organization_id,
        action,
        resource_type,
        resource_id,
        changes,
        ip_address,
        user_agent,
        description,
        metadata
    ) VALUES (
        p_user_id,
        p_organization_id,
        p_action,
        p_resource_type,
        p_resource_id,
        p_changes,
        p_ip_address,
        p_user_agent,
        p_description,
        p_metadata
    )
    RETURNING id INTO v_log_id;

    RETURN v_log_id;
END;
$$;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.log_audit_event TO authenticated;

-- =============================================
-- 6. COMMENTS
-- =============================================

COMMENT ON TABLE public.audit_log IS 'Audit trail for all significant actions in the system. Read-only access via RLS.';
COMMENT ON COLUMN public.audit_log.changes IS 'JSONB field storing before/after state or action-specific data';
COMMENT ON COLUMN public.audit_log.ip_address IS 'Client IP address from which the action was performed';
COMMENT ON COLUMN public.audit_log.metadata IS 'Additional flexible data for context-specific information';
COMMENT ON FUNCTION public.log_audit_event IS 'Helper function to insert audit log entries from application code';
