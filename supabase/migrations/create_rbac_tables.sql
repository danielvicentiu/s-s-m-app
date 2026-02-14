-- =====================================================
-- RBAC Dynamic System - Migration
-- Created: 2026-02-14
-- Description: Tables for dynamic role-based access control
-- =====================================================

-- =====================================================
-- 1. CUSTOM ROLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS custom_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Ensure unique role names per organization
    CONSTRAINT unique_role_per_org UNIQUE (org_id, name)
);

-- Index for performance
CREATE INDEX idx_custom_roles_org_id ON custom_roles(org_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_custom_roles_is_system ON custom_roles(is_system) WHERE deleted_at IS NULL;

-- Updated_at trigger
CREATE TRIGGER update_custom_roles_updated_at
    BEFORE UPDATE ON custom_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. ROLE PERMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES custom_roles(id) ON DELETE CASCADE,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    allowed BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure unique permission per role+resource+action
    CONSTRAINT unique_permission_per_role UNIQUE (role_id, resource, action)
);

-- Index for performance
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_resource ON role_permissions(resource);

-- Updated_at trigger
CREATE TRIGGER update_role_permissions_updated_at
    BEFORE UPDATE ON role_permissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. USER CUSTOM ROLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_custom_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES custom_roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id),

    -- Ensure one role per user per organization
    CONSTRAINT unique_user_role_per_org UNIQUE (user_id, org_id, role_id)
);

-- Index for performance
CREATE INDEX idx_user_custom_roles_user_id ON user_custom_roles(user_id);
CREATE INDEX idx_user_custom_roles_org_id ON user_custom_roles(org_id);
CREATE INDEX idx_user_custom_roles_role_id ON user_custom_roles(role_id);

-- =====================================================
-- 4. SEED DEFAULT SYSTEM ROLES
-- =====================================================

-- Helper function to create system roles for all existing organizations
CREATE OR REPLACE FUNCTION seed_system_roles_for_org(target_org_id UUID)
RETURNS VOID AS $$
DECLARE
    role_owner_id UUID;
    role_admin_id UUID;
    role_manager_id UUID;
    role_user_id UUID;
    role_viewer_id UUID;
BEGIN
    -- 1. OWNER ROLE
    INSERT INTO custom_roles (org_id, name, description, is_system)
    VALUES (
        target_org_id,
        'owner',
        'Proprietar organizație - acces complet la toate resursele și setări',
        true
    )
    RETURNING id INTO role_owner_id;

    -- Owner permissions (full access)
    INSERT INTO role_permissions (role_id, resource, action, allowed) VALUES
    (role_owner_id, 'organization', 'read', true),
    (role_owner_id, 'organization', 'update', true),
    (role_owner_id, 'organization', 'delete', true),
    (role_owner_id, 'users', 'read', true),
    (role_owner_id, 'users', 'create', true),
    (role_owner_id, 'users', 'update', true),
    (role_owner_id, 'users', 'delete', true),
    (role_owner_id, 'roles', 'read', true),
    (role_owner_id, 'roles', 'create', true),
    (role_owner_id, 'roles', 'update', true),
    (role_owner_id, 'roles', 'delete', true),
    (role_owner_id, 'employees', 'read', true),
    (role_owner_id, 'employees', 'create', true),
    (role_owner_id, 'employees', 'update', true),
    (role_owner_id, 'employees', 'delete', true),
    (role_owner_id, 'trainings', 'read', true),
    (role_owner_id, 'trainings', 'create', true),
    (role_owner_id, 'trainings', 'update', true),
    (role_owner_id, 'trainings', 'delete', true),
    (role_owner_id, 'medical', 'read', true),
    (role_owner_id, 'medical', 'create', true),
    (role_owner_id, 'medical', 'update', true),
    (role_owner_id, 'medical', 'delete', true),
    (role_owner_id, 'equipment', 'read', true),
    (role_owner_id, 'equipment', 'create', true),
    (role_owner_id, 'equipment', 'update', true),
    (role_owner_id, 'equipment', 'delete', true),
    (role_owner_id, 'documents', 'read', true),
    (role_owner_id, 'documents', 'create', true),
    (role_owner_id, 'documents', 'update', true),
    (role_owner_id, 'documents', 'delete', true),
    (role_owner_id, 'alerts', 'read', true),
    (role_owner_id, 'alerts', 'create', true),
    (role_owner_id, 'alerts', 'update', true),
    (role_owner_id, 'alerts', 'delete', true),
    (role_owner_id, 'audit_log', 'read', true);

    -- 2. ADMIN ROLE
    INSERT INTO custom_roles (org_id, name, description, is_system)
    VALUES (
        target_org_id,
        'admin',
        'Administrator - acces extins, poate gestiona utilizatori și majoritatea resurselor',
        true
    )
    RETURNING id INTO role_admin_id;

    -- Admin permissions (most access, except org deletion and role management)
    INSERT INTO role_permissions (role_id, resource, action, allowed) VALUES
    (role_admin_id, 'organization', 'read', true),
    (role_admin_id, 'organization', 'update', true),
    (role_admin_id, 'users', 'read', true),
    (role_admin_id, 'users', 'create', true),
    (role_admin_id, 'users', 'update', true),
    (role_admin_id, 'roles', 'read', true),
    (role_admin_id, 'employees', 'read', true),
    (role_admin_id, 'employees', 'create', true),
    (role_admin_id, 'employees', 'update', true),
    (role_admin_id, 'employees', 'delete', true),
    (role_admin_id, 'trainings', 'read', true),
    (role_admin_id, 'trainings', 'create', true),
    (role_admin_id, 'trainings', 'update', true),
    (role_admin_id, 'trainings', 'delete', true),
    (role_admin_id, 'medical', 'read', true),
    (role_admin_id, 'medical', 'create', true),
    (role_admin_id, 'medical', 'update', true),
    (role_admin_id, 'medical', 'delete', true),
    (role_admin_id, 'equipment', 'read', true),
    (role_admin_id, 'equipment', 'create', true),
    (role_admin_id, 'equipment', 'update', true),
    (role_admin_id, 'equipment', 'delete', true),
    (role_admin_id, 'documents', 'read', true),
    (role_admin_id, 'documents', 'create', true),
    (role_admin_id, 'documents', 'update', true),
    (role_admin_id, 'documents', 'delete', true),
    (role_admin_id, 'alerts', 'read', true),
    (role_admin_id, 'alerts', 'create', true),
    (role_admin_id, 'alerts', 'update', true),
    (role_admin_id, 'alerts', 'delete', true),
    (role_admin_id, 'audit_log', 'read', true);

    -- 3. MANAGER ROLE
    INSERT INTO custom_roles (org_id, name, description, is_system)
    VALUES (
        target_org_id,
        'manager',
        'Manager - poate gestiona angajați, trainings și documente',
        true
    )
    RETURNING id INTO role_manager_id;

    -- Manager permissions
    INSERT INTO role_permissions (role_id, resource, action, allowed) VALUES
    (role_manager_id, 'organization', 'read', true),
    (role_manager_id, 'users', 'read', true),
    (role_manager_id, 'employees', 'read', true),
    (role_manager_id, 'employees', 'create', true),
    (role_manager_id, 'employees', 'update', true),
    (role_manager_id, 'trainings', 'read', true),
    (role_manager_id, 'trainings', 'create', true),
    (role_manager_id, 'trainings', 'update', true),
    (role_manager_id, 'medical', 'read', true),
    (role_manager_id, 'medical', 'create', true),
    (role_manager_id, 'medical', 'update', true),
    (role_manager_id, 'equipment', 'read', true),
    (role_manager_id, 'equipment', 'create', true),
    (role_manager_id, 'equipment', 'update', true),
    (role_manager_id, 'documents', 'read', true),
    (role_manager_id, 'documents', 'create', true),
    (role_manager_id, 'documents', 'update', true),
    (role_manager_id, 'alerts', 'read', true),
    (role_manager_id, 'alerts', 'create', true);

    -- 4. USER ROLE
    INSERT INTO custom_roles (org_id, name, description, is_system)
    VALUES (
        target_org_id,
        'user',
        'Utilizator standard - poate vizualiza și adăuga date',
        true
    )
    RETURNING id INTO role_user_id;

    -- User permissions
    INSERT INTO role_permissions (role_id, resource, action, allowed) VALUES
    (role_user_id, 'organization', 'read', true),
    (role_user_id, 'employees', 'read', true),
    (role_user_id, 'employees', 'create', true),
    (role_user_id, 'trainings', 'read', true),
    (role_user_id, 'trainings', 'create', true),
    (role_user_id, 'medical', 'read', true),
    (role_user_id, 'equipment', 'read', true),
    (role_user_id, 'documents', 'read', true),
    (role_user_id, 'documents', 'create', true),
    (role_user_id, 'alerts', 'read', true);

    -- 5. VIEWER ROLE
    INSERT INTO custom_roles (org_id, name, description, is_system)
    VALUES (
        target_org_id,
        'viewer',
        'Vizualizator - acces doar la citire',
        true
    )
    RETURNING id INTO role_viewer_id;

    -- Viewer permissions (read-only)
    INSERT INTO role_permissions (role_id, resource, action, allowed) VALUES
    (role_viewer_id, 'organization', 'read', true),
    (role_viewer_id, 'employees', 'read', true),
    (role_viewer_id, 'trainings', 'read', true),
    (role_viewer_id, 'medical', 'read', true),
    (role_viewer_id, 'equipment', 'read', true),
    (role_viewer_id, 'documents', 'read', true),
    (role_viewer_id, 'alerts', 'read', true);

END;
$$ LANGUAGE plpgsql;

-- Seed system roles for all existing organizations
DO $$
DECLARE
    org_record RECORD;
BEGIN
    FOR org_record IN SELECT id FROM organizations WHERE deleted_at IS NULL
    LOOP
        PERFORM seed_system_roles_for_org(org_record.id);
    END LOOP;
END $$;

-- =====================================================
-- 5. TRIGGER: Auto-create system roles for new orgs
-- =====================================================
CREATE OR REPLACE FUNCTION create_system_roles_for_new_org()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM seed_system_roles_for_org(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_system_roles
    AFTER INSERT ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION create_system_roles_for_new_org();

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE custom_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_custom_roles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: custom_roles
-- =====================================================

-- Users can view roles in their organizations
CREATE POLICY "Users can view roles in their organizations"
    ON custom_roles
    FOR SELECT
    USING (
        org_id IN (
            SELECT org_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND deleted_at IS NULL
        )
    );

-- Owners and admins can create custom roles (not system roles)
CREATE POLICY "Owners and admins can create custom roles"
    ON custom_roles
    FOR INSERT
    WITH CHECK (
        NOT is_system
        AND org_id IN (
            SELECT m.org_id
            FROM memberships m
            WHERE m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
            AND m.deleted_at IS NULL
        )
    );

-- Owners and admins can update custom roles (not system roles)
CREATE POLICY "Owners and admins can update custom roles"
    ON custom_roles
    FOR UPDATE
    USING (
        NOT is_system
        AND org_id IN (
            SELECT m.org_id
            FROM memberships m
            WHERE m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
            AND m.deleted_at IS NULL
        )
    );

-- Owners can delete custom roles (not system roles)
CREATE POLICY "Owners can delete custom roles"
    ON custom_roles
    FOR DELETE
    USING (
        NOT is_system
        AND org_id IN (
            SELECT m.org_id
            FROM memberships m
            WHERE m.user_id = auth.uid()
            AND m.role = 'consultant'
            AND m.deleted_at IS NULL
        )
    );

-- =====================================================
-- RLS POLICIES: role_permissions
-- =====================================================

-- Users can view permissions for roles in their organizations
CREATE POLICY "Users can view permissions for their org roles"
    ON role_permissions
    FOR SELECT
    USING (
        role_id IN (
            SELECT id
            FROM custom_roles
            WHERE org_id IN (
                SELECT org_id
                FROM memberships
                WHERE user_id = auth.uid()
                AND deleted_at IS NULL
            )
        )
    );

-- Owners and admins can manage permissions for custom roles
CREATE POLICY "Owners and admins can create permissions"
    ON role_permissions
    FOR INSERT
    WITH CHECK (
        role_id IN (
            SELECT cr.id
            FROM custom_roles cr
            INNER JOIN memberships m ON m.org_id = cr.org_id
            WHERE m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
            AND cr.is_system = false
            AND m.deleted_at IS NULL
        )
    );

CREATE POLICY "Owners and admins can update permissions"
    ON role_permissions
    FOR UPDATE
    USING (
        role_id IN (
            SELECT cr.id
            FROM custom_roles cr
            INNER JOIN memberships m ON m.org_id = cr.org_id
            WHERE m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
            AND cr.is_system = false
            AND m.deleted_at IS NULL
        )
    );

CREATE POLICY "Owners and admins can delete permissions"
    ON role_permissions
    FOR DELETE
    USING (
        role_id IN (
            SELECT cr.id
            FROM custom_roles cr
            INNER JOIN memberships m ON m.org_id = cr.org_id
            WHERE m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
            AND cr.is_system = false
            AND m.deleted_at IS NULL
        )
    );

-- =====================================================
-- RLS POLICIES: user_custom_roles
-- =====================================================

-- Users can view role assignments in their organizations
CREATE POLICY "Users can view role assignments in their orgs"
    ON user_custom_roles
    FOR SELECT
    USING (
        org_id IN (
            SELECT org_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND deleted_at IS NULL
        )
    );

-- Owners and admins can assign roles
CREATE POLICY "Owners and admins can assign roles"
    ON user_custom_roles
    FOR INSERT
    WITH CHECK (
        org_id IN (
            SELECT m.org_id
            FROM memberships m
            WHERE m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
            AND m.deleted_at IS NULL
        )
    );

-- Owners and admins can remove role assignments
CREATE POLICY "Owners and admins can remove role assignments"
    ON user_custom_roles
    FOR DELETE
    USING (
        org_id IN (
            SELECT m.org_id
            FROM memberships m
            WHERE m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
            AND m.deleted_at IS NULL
        )
    );

-- =====================================================
-- 7. HELPER FUNCTIONS
-- =====================================================

-- Function to get user permissions in an organization
CREATE OR REPLACE FUNCTION get_user_permissions(
    target_user_id UUID,
    target_org_id UUID
)
RETURNS TABLE (
    resource VARCHAR(100),
    action VARCHAR(100),
    allowed BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        rp.resource,
        rp.action,
        rp.allowed
    FROM user_custom_roles ucr
    INNER JOIN role_permissions rp ON rp.role_id = ucr.role_id
    WHERE ucr.user_id = target_user_id
    AND ucr.org_id = target_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has specific permission
CREATE OR REPLACE FUNCTION has_permission(
    target_user_id UUID,
    target_org_id UUID,
    target_resource VARCHAR(100),
    target_action VARCHAR(100)
)
RETURNS BOOLEAN AS $$
DECLARE
    has_perm BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1
        FROM user_custom_roles ucr
        INNER JOIN role_permissions rp ON rp.role_id = ucr.role_id
        WHERE ucr.user_id = target_user_id
        AND ucr.org_id = target_org_id
        AND rp.resource = target_resource
        AND rp.action = target_action
        AND rp.allowed = true
    ) INTO has_perm;

    RETURN COALESCE(has_perm, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

COMMENT ON TABLE custom_roles IS 'Dynamic RBAC roles per organization';
COMMENT ON TABLE role_permissions IS 'Permissions assigned to roles';
COMMENT ON TABLE user_custom_roles IS 'User role assignments per organization';
COMMENT ON FUNCTION seed_system_roles_for_org IS 'Seeds 5 default system roles for an organization';
COMMENT ON FUNCTION get_user_permissions IS 'Returns all permissions for a user in an organization';
COMMENT ON FUNCTION has_permission IS 'Checks if user has specific permission in an organization';
