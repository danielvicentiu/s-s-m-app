-- =====================================================
-- RBAC MIGRATION: Dynamic Role-Based Access Control
-- Created: 2026-02-13
-- Purpose: Migrate from hardcoded memberships.role to dynamic RBAC system
-- =====================================================

-- =====================================================
-- 1. CUSTOM ROLES TABLE
-- Stores organization-specific roles (both system and custom)
-- =====================================================
CREATE TABLE IF NOT EXISTS custom_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE, -- TRUE for default roles, FALSE for custom
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    -- Ensure unique role names per organization
    CONSTRAINT unique_role_per_org UNIQUE (org_id, name)
);

-- Indexes for performance
CREATE INDEX idx_custom_roles_org_id ON custom_roles(org_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_custom_roles_is_system ON custom_roles(is_system) WHERE deleted_at IS NULL;

-- Updated_at trigger
CREATE TRIGGER update_custom_roles_updated_at
    BEFORE UPDATE ON custom_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. ROLE PERMISSIONS TABLE
-- Defines what actions each role can perform on resources
-- =====================================================
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES custom_roles(id) ON DELETE CASCADE,
    resource VARCHAR(100) NOT NULL, -- e.g., 'employees', 'trainings', 'medical_records'
    action VARCHAR(50) NOT NULL, -- e.g., 'view', 'create', 'edit', 'delete', 'export'
    allowed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Ensure unique permission per role/resource/action
    CONSTRAINT unique_permission UNIQUE (role_id, resource, action)
);

-- Indexes for permission lookups
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_resource ON role_permissions(resource);
CREATE INDEX idx_role_permissions_lookup ON role_permissions(role_id, resource, action);

-- =====================================================
-- 3. USER CUSTOM ROLES TABLE
-- Maps users to their roles within organizations
-- =====================================================
CREATE TABLE IF NOT EXISTS user_custom_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES custom_roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID REFERENCES profiles(id),

    -- A user can have only one role per organization
    CONSTRAINT unique_user_role_per_org UNIQUE (user_id, org_id)
);

-- Indexes for user role lookups
CREATE INDEX idx_user_custom_roles_user_id ON user_custom_roles(user_id);
CREATE INDEX idx_user_custom_roles_org_id ON user_custom_roles(org_id);
CREATE INDEX idx_user_custom_roles_role_id ON user_custom_roles(role_id);
CREATE INDEX idx_user_custom_roles_lookup ON user_custom_roles(user_id, org_id);

-- =====================================================
-- 4. SEED DEFAULT SYSTEM ROLES
-- Create system roles for each organization
-- =====================================================

-- Function to create default roles for an organization
CREATE OR REPLACE FUNCTION create_default_roles_for_org(target_org_id UUID)
RETURNS VOID AS $$
DECLARE
    role_owner_id UUID;
    role_admin_id UUID;
    role_manager_id UUID;
    role_user_id UUID;
    role_viewer_id UUID;
BEGIN
    -- 1. OWNER (full control, organization management)
    INSERT INTO custom_roles (org_id, name, description, is_system)
    VALUES (
        target_org_id,
        'owner',
        'Organization owner with full administrative access',
        TRUE
    ) RETURNING id INTO role_owner_id;

    -- Owner permissions (full access to all resources)
    INSERT INTO role_permissions (role_id, resource, action, allowed) VALUES
    (role_owner_id, 'organizations', 'view', TRUE),
    (role_owner_id, 'organizations', 'edit', TRUE),
    (role_owner_id, 'organizations', 'delete', TRUE),
    (role_owner_id, 'users', 'view', TRUE),
    (role_owner_id, 'users', 'create', TRUE),
    (role_owner_id, 'users', 'edit', TRUE),
    (role_owner_id, 'users', 'delete', TRUE),
    (role_owner_id, 'roles', 'view', TRUE),
    (role_owner_id, 'roles', 'create', TRUE),
    (role_owner_id, 'roles', 'edit', TRUE),
    (role_owner_id, 'roles', 'delete', TRUE),
    (role_owner_id, 'employees', 'view', TRUE),
    (role_owner_id, 'employees', 'create', TRUE),
    (role_owner_id, 'employees', 'edit', TRUE),
    (role_owner_id, 'employees', 'delete', TRUE),
    (role_owner_id, 'trainings', 'view', TRUE),
    (role_owner_id, 'trainings', 'create', TRUE),
    (role_owner_id, 'trainings', 'edit', TRUE),
    (role_owner_id, 'trainings', 'delete', TRUE),
    (role_owner_id, 'medical_records', 'view', TRUE),
    (role_owner_id, 'medical_records', 'create', TRUE),
    (role_owner_id, 'medical_records', 'edit', TRUE),
    (role_owner_id, 'medical_records', 'delete', TRUE),
    (role_owner_id, 'equipment', 'view', TRUE),
    (role_owner_id, 'equipment', 'create', TRUE),
    (role_owner_id, 'equipment', 'edit', TRUE),
    (role_owner_id, 'equipment', 'delete', TRUE),
    (role_owner_id, 'documents', 'view', TRUE),
    (role_owner_id, 'documents', 'create', TRUE),
    (role_owner_id, 'documents', 'edit', TRUE),
    (role_owner_id, 'documents', 'delete', TRUE),
    (role_owner_id, 'alerts', 'view', TRUE),
    (role_owner_id, 'alerts', 'create', TRUE),
    (role_owner_id, 'alerts', 'edit', TRUE),
    (role_owner_id, 'alerts', 'delete', TRUE),
    (role_owner_id, 'audit_log', 'view', TRUE),
    (role_owner_id, 'reports', 'view', TRUE),
    (role_owner_id, 'reports', 'export', TRUE);

    -- 2. ADMIN (administrative access, cannot manage organization)
    INSERT INTO custom_roles (org_id, name, description, is_system)
    VALUES (
        target_org_id,
        'admin',
        'Administrator with full access to users and data',
        TRUE
    ) RETURNING id INTO role_admin_id;

    -- Admin permissions (all except org management)
    INSERT INTO role_permissions (role_id, resource, action, allowed) VALUES
    (role_admin_id, 'users', 'view', TRUE),
    (role_admin_id, 'users', 'create', TRUE),
    (role_admin_id, 'users', 'edit', TRUE),
    (role_admin_id, 'users', 'delete', TRUE),
    (role_admin_id, 'employees', 'view', TRUE),
    (role_admin_id, 'employees', 'create', TRUE),
    (role_admin_id, 'employees', 'edit', TRUE),
    (role_admin_id, 'employees', 'delete', TRUE),
    (role_admin_id, 'trainings', 'view', TRUE),
    (role_admin_id, 'trainings', 'create', TRUE),
    (role_admin_id, 'trainings', 'edit', TRUE),
    (role_admin_id, 'trainings', 'delete', TRUE),
    (role_admin_id, 'medical_records', 'view', TRUE),
    (role_admin_id, 'medical_records', 'create', TRUE),
    (role_admin_id, 'medical_records', 'edit', TRUE),
    (role_admin_id, 'medical_records', 'delete', TRUE),
    (role_admin_id, 'equipment', 'view', TRUE),
    (role_admin_id, 'equipment', 'create', TRUE),
    (role_admin_id, 'equipment', 'edit', TRUE),
    (role_admin_id, 'equipment', 'delete', TRUE),
    (role_admin_id, 'documents', 'view', TRUE),
    (role_admin_id, 'documents', 'create', TRUE),
    (role_admin_id, 'documents', 'edit', TRUE),
    (role_admin_id, 'documents', 'delete', TRUE),
    (role_admin_id, 'alerts', 'view', TRUE),
    (role_admin_id, 'alerts', 'create', TRUE),
    (role_admin_id, 'alerts', 'edit', TRUE),
    (role_admin_id, 'alerts', 'delete', TRUE),
    (role_admin_id, 'audit_log', 'view', TRUE),
    (role_admin_id, 'reports', 'view', TRUE),
    (role_admin_id, 'reports', 'export', TRUE);

    -- 3. MANAGER (can manage employees and their data)
    INSERT INTO custom_roles (org_id, name, description, is_system)
    VALUES (
        target_org_id,
        'manager',
        'Manager with access to employee data and operations',
        TRUE
    ) RETURNING id INTO role_manager_id;

    -- Manager permissions
    INSERT INTO role_permissions (role_id, resource, action, allowed) VALUES
    (role_manager_id, 'employees', 'view', TRUE),
    (role_manager_id, 'employees', 'create', TRUE),
    (role_manager_id, 'employees', 'edit', TRUE),
    (role_manager_id, 'trainings', 'view', TRUE),
    (role_manager_id, 'trainings', 'create', TRUE),
    (role_manager_id, 'trainings', 'edit', TRUE),
    (role_manager_id, 'medical_records', 'view', TRUE),
    (role_manager_id, 'medical_records', 'create', TRUE),
    (role_manager_id, 'medical_records', 'edit', TRUE),
    (role_manager_id, 'equipment', 'view', TRUE),
    (role_manager_id, 'equipment', 'create', TRUE),
    (role_manager_id, 'equipment', 'edit', TRUE),
    (role_manager_id, 'documents', 'view', TRUE),
    (role_manager_id, 'documents', 'create', TRUE),
    (role_manager_id, 'alerts', 'view', TRUE),
    (role_manager_id, 'alerts', 'create', TRUE),
    (role_manager_id, 'reports', 'view', TRUE),
    (role_manager_id, 'reports', 'export', TRUE);

    -- 4. USER (standard access, can view and edit assigned data)
    INSERT INTO custom_roles (org_id, name, description, is_system)
    VALUES (
        target_org_id,
        'user',
        'Standard user with basic access rights',
        TRUE
    ) RETURNING id INTO role_user_id;

    -- User permissions
    INSERT INTO role_permissions (role_id, resource, action, allowed) VALUES
    (role_user_id, 'employees', 'view', TRUE),
    (role_user_id, 'trainings', 'view', TRUE),
    (role_user_id, 'trainings', 'create', TRUE),
    (role_user_id, 'medical_records', 'view', TRUE),
    (role_user_id, 'equipment', 'view', TRUE),
    (role_user_id, 'documents', 'view', TRUE),
    (role_user_id, 'alerts', 'view', TRUE),
    (role_user_id, 'reports', 'view', TRUE);

    -- 5. VIEWER (read-only access)
    INSERT INTO custom_roles (org_id, name, description, is_system)
    VALUES (
        target_org_id,
        'viewer',
        'Read-only access to organization data',
        TRUE
    ) RETURNING id INTO role_viewer_id;

    -- Viewer permissions
    INSERT INTO role_permissions (role_id, resource, action, allowed) VALUES
    (role_viewer_id, 'employees', 'view', TRUE),
    (role_viewer_id, 'trainings', 'view', TRUE),
    (role_viewer_id, 'medical_records', 'view', TRUE),
    (role_viewer_id, 'equipment', 'view', TRUE),
    (role_viewer_id, 'documents', 'view', TRUE),
    (role_viewer_id, 'alerts', 'view', TRUE),
    (role_viewer_id, 'reports', 'view', TRUE);

END;
$$ LANGUAGE plpgsql;

-- Create default roles for all existing organizations
DO $$
DECLARE
    org_record RECORD;
BEGIN
    FOR org_record IN SELECT id FROM organizations LOOP
        PERFORM create_default_roles_for_org(org_record.id);
    END LOOP;
END $$;

-- Trigger to automatically create default roles for new organizations
CREATE OR REPLACE FUNCTION create_default_roles_on_org_insert()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM create_default_roles_for_org(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_default_roles
    AFTER INSERT ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION create_default_roles_on_org_insert();

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all RBAC tables
ALTER TABLE custom_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_custom_roles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CUSTOM_ROLES POLICIES
-- =====================================================

-- Users can view roles in their organizations
CREATE POLICY "Users can view roles in their orgs"
    ON custom_roles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = custom_roles.org_id
        )
    );

-- Only owners and admins can create custom roles
CREATE POLICY "Owners and admins can create roles"
    ON custom_roles
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = custom_roles.org_id
            AND memberships.role IN ('consultant', 'firma_admin')
        )
    );

-- Only owners and admins can update custom roles (not system roles)
CREATE POLICY "Owners and admins can update custom roles"
    ON custom_roles
    FOR UPDATE
    USING (
        is_system = FALSE
        AND EXISTS (
            SELECT 1 FROM memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = custom_roles.org_id
            AND memberships.role IN ('consultant', 'firma_admin')
        )
    );

-- Only owners and admins can delete custom roles (not system roles)
CREATE POLICY "Owners and admins can delete custom roles"
    ON custom_roles
    FOR DELETE
    USING (
        is_system = FALSE
        AND EXISTS (
            SELECT 1 FROM memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = custom_roles.org_id
            AND memberships.role IN ('consultant', 'firma_admin')
        )
    );

-- =====================================================
-- ROLE_PERMISSIONS POLICIES
-- =====================================================

-- Users can view permissions for roles in their organizations
CREATE POLICY "Users can view role permissions"
    ON role_permissions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM custom_roles
            JOIN memberships ON memberships.org_id = custom_roles.org_id
            WHERE custom_roles.id = role_permissions.role_id
            AND memberships.user_id = auth.uid()
        )
    );

-- Only owners and admins can manage permissions for custom roles
CREATE POLICY "Owners and admins can manage permissions"
    ON role_permissions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM custom_roles
            JOIN memberships ON memberships.org_id = custom_roles.org_id
            WHERE custom_roles.id = role_permissions.role_id
            AND custom_roles.is_system = FALSE
            AND memberships.user_id = auth.uid()
            AND memberships.role IN ('consultant', 'firma_admin')
        )
    );

-- =====================================================
-- USER_CUSTOM_ROLES POLICIES
-- =====================================================

-- Users can view their own role assignments
CREATE POLICY "Users can view their own roles"
    ON user_custom_roles
    FOR SELECT
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = user_custom_roles.org_id
            AND memberships.role IN ('consultant', 'firma_admin')
        )
    );

-- Only owners and admins can assign roles
CREATE POLICY "Owners and admins can assign roles"
    ON user_custom_roles
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = user_custom_roles.org_id
            AND memberships.role IN ('consultant', 'firma_admin')
        )
    );

-- Only owners and admins can update role assignments
CREATE POLICY "Owners and admins can update role assignments"
    ON user_custom_roles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = user_custom_roles.org_id
            AND memberships.role IN ('consultant', 'firma_admin')
        )
    );

-- Only owners and admins can remove role assignments
CREATE POLICY "Owners and admins can remove role assignments"
    ON user_custom_roles
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = user_custom_roles.org_id
            AND memberships.role IN ('consultant', 'firma_admin')
        )
    );

-- =====================================================
-- 6. HELPER FUNCTIONS FOR RBAC
-- =====================================================

-- Function to check if a user has a specific permission
CREATE OR REPLACE FUNCTION user_has_permission(
    p_user_id UUID,
    p_org_id UUID,
    p_resource VARCHAR,
    p_action VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    has_permission BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM user_custom_roles ucr
        JOIN role_permissions rp ON rp.role_id = ucr.role_id
        WHERE ucr.user_id = p_user_id
        AND ucr.org_id = p_org_id
        AND rp.resource = p_resource
        AND rp.action = p_action
        AND rp.allowed = TRUE
    ) INTO has_permission;

    RETURN has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all permissions for a user in an organization
CREATE OR REPLACE FUNCTION get_user_permissions(
    p_user_id UUID,
    p_org_id UUID
)
RETURNS TABLE (
    resource VARCHAR,
    action VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT rp.resource, rp.action
    FROM user_custom_roles ucr
    JOIN role_permissions rp ON rp.role_id = ucr.role_id
    WHERE ucr.user_id = p_user_id
    AND ucr.org_id = p_org_id
    AND rp.allowed = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE custom_roles IS 'Stores organization-specific roles (system and custom)';
COMMENT ON TABLE role_permissions IS 'Defines permissions for each role (resource + action)';
COMMENT ON TABLE user_custom_roles IS 'Maps users to roles within organizations';

COMMENT ON COLUMN custom_roles.is_system IS 'TRUE for default roles (owner/admin/manager/user/viewer), FALSE for custom roles';
COMMENT ON COLUMN role_permissions.resource IS 'Resource type (e.g., employees, trainings, medical_records)';
COMMENT ON COLUMN role_permissions.action IS 'Action type (e.g., view, create, edit, delete, export)';
COMMENT ON COLUMN role_permissions.allowed IS 'TRUE to grant permission, FALSE to explicitly deny';

-- =====================================================
-- END OF MIGRATION
-- =====================================================
