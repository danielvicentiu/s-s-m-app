-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ Migration: Add/Update RLS policies on ALL tables                         ║
-- ║ Created: 2026-02-12                                                      ║
-- ║ Description: Ensure ALL tables have RLS enabled with modern RBAC         ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- This migration:
-- 1. Enables RLS on all tables that don't have it
-- 2. Replaces old policies (memberships-based) with new RBAC policies
-- 3. Uses modern functions: is_super_admin(), get_user_org_ids()
-- 4. Follows the pattern from fix_employees_rls.sql

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: organizations
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "organizations_select_policy" ON public.organizations;
DROP POLICY IF EXISTS "organizations_insert_policy" ON public.organizations;
DROP POLICY IF EXISTS "organizations_update_policy" ON public.organizations;
DROP POLICY IF EXISTS "organizations_delete_policy" ON public.organizations;
DROP POLICY IF EXISTS "Users can view their organizations" ON public.organizations;
DROP POLICY IF EXISTS "Users can insert organizations" ON public.organizations;
DROP POLICY IF EXISTS "Users can update their organizations" ON public.organizations;

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Super admins see all, users see only their assigned organizations
CREATE POLICY "organizations_select_policy" ON public.organizations
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "organizations_insert_policy" ON public.organizations
    FOR INSERT TO authenticated
    WITH CHECK (public.is_super_admin());

CREATE POLICY "organizations_update_policy" ON public.organizations
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "organizations_delete_policy" ON public.organizations
    FOR DELETE TO authenticated
    USING (public.is_super_admin());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: memberships
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "memberships_select_policy" ON public.memberships;
DROP POLICY IF EXISTS "memberships_insert_policy" ON public.memberships;
DROP POLICY IF EXISTS "memberships_update_policy" ON public.memberships;
DROP POLICY IF EXISTS "memberships_delete_policy" ON public.memberships;

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "memberships_select_policy" ON public.memberships
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
        OR user_id = auth.uid()
    );

CREATE POLICY "memberships_insert_policy" ON public.memberships
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "memberships_update_policy" ON public.memberships
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "memberships_delete_policy" ON public.memberships
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.memberships TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: profiles
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can see all profiles (for mentions, assignments, etc.)
-- But can only edit their own
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "profiles_insert_policy" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid() OR public.is_super_admin());

CREATE POLICY "profiles_delete_policy" ON public.profiles
    FOR DELETE TO authenticated
    USING (public.is_super_admin());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: employees (already fixed, but ensuring consistency)
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "employees_select_policy" ON public.employees;
DROP POLICY IF EXISTS "employees_insert_policy" ON public.employees;
DROP POLICY IF EXISTS "employees_update_policy" ON public.employees;
DROP POLICY IF EXISTS "employees_delete_policy" ON public.employees;
DROP POLICY IF EXISTS "employees_select_dynamic" ON public.employees;

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "employees_select_policy" ON public.employees
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
        OR (user_id IS NOT NULL AND user_id = auth.uid())
    );

CREATE POLICY "employees_insert_policy" ON public.employees
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "employees_update_policy" ON public.employees
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "employees_delete_policy" ON public.employees
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: trainings
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "trainings_select_policy" ON public.trainings;
DROP POLICY IF EXISTS "trainings_insert_policy" ON public.trainings;
DROP POLICY IF EXISTS "trainings_update_policy" ON public.trainings;
DROP POLICY IF EXISTS "trainings_delete_policy" ON public.trainings;

ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trainings_select_policy" ON public.trainings
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "trainings_insert_policy" ON public.trainings
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "trainings_update_policy" ON public.trainings
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "trainings_delete_policy" ON public.trainings
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.trainings TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: training_sessions
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "training_sessions_select_policy" ON public.training_sessions;
DROP POLICY IF EXISTS "training_sessions_insert_policy" ON public.training_sessions;
DROP POLICY IF EXISTS "training_sessions_update_policy" ON public.training_sessions;
DROP POLICY IF EXISTS "training_sessions_delete_policy" ON public.training_sessions;

ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "training_sessions_select_policy" ON public.training_sessions
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "training_sessions_insert_policy" ON public.training_sessions
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "training_sessions_update_policy" ON public.training_sessions
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "training_sessions_delete_policy" ON public.training_sessions
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.training_sessions TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: training_participants
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "training_participants_select_policy" ON public.training_participants;
DROP POLICY IF EXISTS "training_participants_insert_policy" ON public.training_participants;
DROP POLICY IF EXISTS "training_participants_update_policy" ON public.training_participants;
DROP POLICY IF EXISTS "training_participants_delete_policy" ON public.training_participants;

ALTER TABLE public.training_participants ENABLE ROW LEVEL SECURITY;

-- Access via organization_id (assuming it exists on this table)
-- If not, will need to join with training_sessions
CREATE POLICY "training_participants_select_policy" ON public.training_participants
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM training_sessions ts
            WHERE ts.id = training_participants.session_id
            AND ts.organization_id IN (SELECT public.get_user_org_ids())
        )
    );

CREATE POLICY "training_participants_insert_policy" ON public.training_participants
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM training_sessions ts
            WHERE ts.id = training_participants.session_id
            AND ts.organization_id IN (SELECT public.get_user_org_ids())
        )
    );

CREATE POLICY "training_participants_update_policy" ON public.training_participants
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM training_sessions ts
            WHERE ts.id = training_participants.session_id
            AND ts.organization_id IN (SELECT public.get_user_org_ids())
        )
    );

CREATE POLICY "training_participants_delete_policy" ON public.training_participants
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM training_sessions ts
            WHERE ts.id = training_participants.session_id
            AND ts.organization_id IN (SELECT public.get_user_org_ids())
        )
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.training_participants TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: medical_records
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "medical_records_select_policy" ON public.medical_records;
DROP POLICY IF EXISTS "medical_records_insert_policy" ON public.medical_records;
DROP POLICY IF EXISTS "medical_records_update_policy" ON public.medical_records;
DROP POLICY IF EXISTS "medical_records_delete_policy" ON public.medical_records;

ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "medical_records_select_policy" ON public.medical_records
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "medical_records_insert_policy" ON public.medical_records
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "medical_records_update_policy" ON public.medical_records
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "medical_records_delete_policy" ON public.medical_records
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.medical_records TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: medical_examinations
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "medical_examinations_select_policy" ON public.medical_examinations;
DROP POLICY IF EXISTS "medical_examinations_insert_policy" ON public.medical_examinations;
DROP POLICY IF EXISTS "medical_examinations_update_policy" ON public.medical_examinations;
DROP POLICY IF EXISTS "medical_examinations_delete_policy" ON public.medical_examinations;

ALTER TABLE public.medical_examinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "medical_examinations_select_policy" ON public.medical_examinations
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "medical_examinations_insert_policy" ON public.medical_examinations
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "medical_examinations_update_policy" ON public.medical_examinations
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "medical_examinations_delete_policy" ON public.medical_examinations
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.medical_examinations TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: equipment
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "equipment_select_policy" ON public.equipment;
DROP POLICY IF EXISTS "equipment_insert_policy" ON public.equipment;
DROP POLICY IF EXISTS "equipment_update_policy" ON public.equipment;
DROP POLICY IF EXISTS "equipment_delete_policy" ON public.equipment;

ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "equipment_select_policy" ON public.equipment
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "equipment_insert_policy" ON public.equipment
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "equipment_update_policy" ON public.equipment
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "equipment_delete_policy" ON public.equipment
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.equipment TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: equipment_inspections
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "equipment_inspections_select_policy" ON public.equipment_inspections;
DROP POLICY IF EXISTS "equipment_inspections_insert_policy" ON public.equipment_inspections;
DROP POLICY IF EXISTS "equipment_inspections_update_policy" ON public.equipment_inspections;
DROP POLICY IF EXISTS "equipment_inspections_delete_policy" ON public.equipment_inspections;

ALTER TABLE public.equipment_inspections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "equipment_inspections_select_policy" ON public.equipment_inspections
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "equipment_inspections_insert_policy" ON public.equipment_inspections
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "equipment_inspections_update_policy" ON public.equipment_inspections
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "equipment_inspections_delete_policy" ON public.equipment_inspections
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.equipment_inspections TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: documents
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "documents_select_policy" ON public.documents;
DROP POLICY IF EXISTS "documents_insert_policy" ON public.documents;
DROP POLICY IF EXISTS "documents_update_policy" ON public.documents;
DROP POLICY IF EXISTS "documents_delete_policy" ON public.documents;

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "documents_select_policy" ON public.documents
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "documents_insert_policy" ON public.documents
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "documents_update_policy" ON public.documents
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "documents_delete_policy" ON public.documents
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: document_templates
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "document_templates_select_policy" ON public.document_templates;
DROP POLICY IF EXISTS "document_templates_insert_policy" ON public.document_templates;
DROP POLICY IF EXISTS "document_templates_update_policy" ON public.document_templates;
DROP POLICY IF EXISTS "document_templates_delete_policy" ON public.document_templates;

ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

-- Templates can be global or org-specific
CREATE POLICY "document_templates_select_policy" ON public.document_templates
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IS NULL  -- Global templates
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "document_templates_insert_policy" ON public.document_templates
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "document_templates_update_policy" ON public.document_templates
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "document_templates_delete_policy" ON public.document_templates
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.document_templates TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: alerts
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "alerts_select_policy" ON public.alerts;
DROP POLICY IF EXISTS "alerts_insert_policy" ON public.alerts;
DROP POLICY IF EXISTS "alerts_update_policy" ON public.alerts;
DROP POLICY IF EXISTS "alerts_delete_policy" ON public.alerts;

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "alerts_select_policy" ON public.alerts
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "alerts_insert_policy" ON public.alerts
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "alerts_update_policy" ON public.alerts
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "alerts_delete_policy" ON public.alerts
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.alerts TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: penalties
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "penalties_select_policy" ON public.penalties;
DROP POLICY IF EXISTS "penalties_insert_policy" ON public.penalties;
DROP POLICY IF EXISTS "penalties_update_policy" ON public.penalties;
DROP POLICY IF EXISTS "penalties_delete_policy" ON public.penalties;

ALTER TABLE public.penalties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "penalties_select_policy" ON public.penalties
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "penalties_insert_policy" ON public.penalties
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "penalties_update_policy" ON public.penalties
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "penalties_delete_policy" ON public.penalties
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.penalties TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: incidents
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "incidents_select_policy" ON public.incidents;
DROP POLICY IF EXISTS "incidents_insert_policy" ON public.incidents;
DROP POLICY IF EXISTS "incidents_update_policy" ON public.incidents;
DROP POLICY IF EXISTS "incidents_delete_policy" ON public.incidents;

ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "incidents_select_policy" ON public.incidents
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "incidents_insert_policy" ON public.incidents
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "incidents_update_policy" ON public.incidents
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "incidents_delete_policy" ON public.incidents
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.incidents TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: risk_assessments
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "risk_assessments_select_policy" ON public.risk_assessments;
DROP POLICY IF EXISTS "risk_assessments_insert_policy" ON public.risk_assessments;
DROP POLICY IF EXISTS "risk_assessments_update_policy" ON public.risk_assessments;
DROP POLICY IF EXISTS "risk_assessments_delete_policy" ON public.risk_assessments;

ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "risk_assessments_select_policy" ON public.risk_assessments
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "risk_assessments_insert_policy" ON public.risk_assessments
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "risk_assessments_update_policy" ON public.risk_assessments
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "risk_assessments_delete_policy" ON public.risk_assessments
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.risk_assessments TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- RBAC Tables: roles, user_roles, permissions, role_permissions
-- ═══════════════════════════════════════════════════════════════════════════

-- Table: roles
DROP POLICY IF EXISTS "roles_select_policy" ON public.roles;
DROP POLICY IF EXISTS "roles_insert_policy" ON public.roles;
DROP POLICY IF EXISTS "roles_update_policy" ON public.roles;
DROP POLICY IF EXISTS "roles_delete_policy" ON public.roles;

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read roles
CREATE POLICY "roles_select_policy" ON public.roles
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "roles_insert_policy" ON public.roles
    FOR INSERT TO authenticated
    WITH CHECK (public.is_super_admin());

CREATE POLICY "roles_update_policy" ON public.roles
    FOR UPDATE TO authenticated
    USING (public.is_super_admin());

CREATE POLICY "roles_delete_policy" ON public.roles
    FOR DELETE TO authenticated
    USING (public.is_super_admin());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.roles TO authenticated;

-- Table: user_roles
DROP POLICY IF EXISTS "user_roles_select_policy" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_insert_policy" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_update_policy" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_delete_policy" ON public.user_roles;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_roles_select_policy" ON public.user_roles
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR user_id = auth.uid()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "user_roles_insert_policy" ON public.user_roles
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "user_roles_update_policy" ON public.user_roles
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "user_roles_delete_policy" ON public.user_roles
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;

-- Table: permissions
DROP POLICY IF EXISTS "permissions_select_policy" ON public.permissions;
DROP POLICY IF EXISTS "permissions_insert_policy" ON public.permissions;
DROP POLICY IF EXISTS "permissions_update_policy" ON public.permissions;
DROP POLICY IF EXISTS "permissions_delete_policy" ON public.permissions;

ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "permissions_select_policy" ON public.permissions
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "permissions_insert_policy" ON public.permissions
    FOR INSERT TO authenticated
    WITH CHECK (public.is_super_admin());

CREATE POLICY "permissions_update_policy" ON public.permissions
    FOR UPDATE TO authenticated
    USING (public.is_super_admin());

CREATE POLICY "permissions_delete_policy" ON public.permissions
    FOR DELETE TO authenticated
    USING (public.is_super_admin());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.permissions TO authenticated;

-- Table: role_permissions
DROP POLICY IF EXISTS "role_permissions_select_policy" ON public.role_permissions;
DROP POLICY IF EXISTS "role_permissions_insert_policy" ON public.role_permissions;
DROP POLICY IF EXISTS "role_permissions_update_policy" ON public.role_permissions;
DROP POLICY IF EXISTS "role_permissions_delete_policy" ON public.role_permissions;

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_permissions_select_policy" ON public.role_permissions
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "role_permissions_insert_policy" ON public.role_permissions
    FOR INSERT TO authenticated
    WITH CHECK (public.is_super_admin());

CREATE POLICY "role_permissions_update_policy" ON public.role_permissions
    FOR UPDATE TO authenticated
    USING (public.is_super_admin());

CREATE POLICY "role_permissions_delete_policy" ON public.role_permissions
    FOR DELETE TO authenticated
    USING (public.is_super_admin());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.role_permissions TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- REGES Tables: Update to use modern RBAC functions
-- ═══════════════════════════════════════════════════════════════════════════

-- Table: reges_connections
DROP POLICY IF EXISTS "reges_connections_select_policy" ON public.reges_connections;
DROP POLICY IF EXISTS "reges_connections_insert_policy" ON public.reges_connections;
DROP POLICY IF EXISTS "reges_connections_update_policy" ON public.reges_connections;
DROP POLICY IF EXISTS "reges_connections_delete_policy" ON public.reges_connections;
DROP POLICY IF EXISTS "Users can view connections for their organizations" ON public.reges_connections;
DROP POLICY IF EXISTS "Users can insert connections for their organizations" ON public.reges_connections;
DROP POLICY IF EXISTS "Users can update connections for their organizations" ON public.reges_connections;

ALTER TABLE public.reges_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reges_connections_select_policy" ON public.reges_connections
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "reges_connections_insert_policy" ON public.reges_connections
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "reges_connections_update_policy" ON public.reges_connections
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "reges_connections_delete_policy" ON public.reges_connections
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reges_connections TO authenticated;

-- Table: reges_outbox
DROP POLICY IF EXISTS "reges_outbox_select_policy" ON public.reges_outbox;
DROP POLICY IF EXISTS "reges_outbox_insert_policy" ON public.reges_outbox;
DROP POLICY IF EXISTS "reges_outbox_update_policy" ON public.reges_outbox;
DROP POLICY IF EXISTS "reges_outbox_delete_policy" ON public.reges_outbox;
DROP POLICY IF EXISTS "Users can view outbox for their organizations" ON public.reges_outbox;

ALTER TABLE public.reges_outbox ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reges_outbox_select_policy" ON public.reges_outbox
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "reges_outbox_insert_policy" ON public.reges_outbox
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "reges_outbox_update_policy" ON public.reges_outbox
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "reges_outbox_delete_policy" ON public.reges_outbox
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reges_outbox TO authenticated;

-- Table: reges_receipts
DROP POLICY IF EXISTS "reges_receipts_select_policy" ON public.reges_receipts;
DROP POLICY IF EXISTS "reges_receipts_insert_policy" ON public.reges_receipts;
DROP POLICY IF EXISTS "reges_receipts_update_policy" ON public.reges_receipts;
DROP POLICY IF EXISTS "reges_receipts_delete_policy" ON public.reges_receipts;
DROP POLICY IF EXISTS "Users can view receipts for their outbox" ON public.reges_receipts;

ALTER TABLE public.reges_receipts ENABLE ROW LEVEL SECURITY;

-- Access via reges_outbox organization_id
CREATE POLICY "reges_receipts_select_policy" ON public.reges_receipts
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM reges_outbox o
            WHERE o.id = reges_receipts.outbox_id
            AND o.organization_id IN (SELECT public.get_user_org_ids())
        )
    );

CREATE POLICY "reges_receipts_insert_policy" ON public.reges_receipts
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM reges_outbox o
            WHERE o.id = reges_receipts.outbox_id
            AND o.organization_id IN (SELECT public.get_user_org_ids())
        )
    );

CREATE POLICY "reges_receipts_update_policy" ON public.reges_receipts
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM reges_outbox o
            WHERE o.id = reges_receipts.outbox_id
            AND o.organization_id IN (SELECT public.get_user_org_ids())
        )
    );

CREATE POLICY "reges_receipts_delete_policy" ON public.reges_receipts
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM reges_outbox o
            WHERE o.id = reges_receipts.outbox_id
            AND o.organization_id IN (SELECT public.get_user_org_ids())
        )
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reges_receipts TO authenticated;

-- Table: reges_results
DROP POLICY IF EXISTS "reges_results_select_policy" ON public.reges_results;
DROP POLICY IF EXISTS "reges_results_insert_policy" ON public.reges_results;
DROP POLICY IF EXISTS "reges_results_update_policy" ON public.reges_results;
DROP POLICY IF EXISTS "reges_results_delete_policy" ON public.reges_results;
DROP POLICY IF EXISTS "Users can view results for their receipts" ON public.reges_results;

ALTER TABLE public.reges_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reges_results_select_policy" ON public.reges_results
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM reges_receipts r
            JOIN reges_outbox o ON r.outbox_id = o.id
            WHERE r.id = reges_results.receipt_id
            AND o.organization_id IN (SELECT public.get_user_org_ids())
        )
    );

CREATE POLICY "reges_results_insert_policy" ON public.reges_results
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM reges_receipts r
            JOIN reges_outbox o ON r.outbox_id = o.id
            WHERE r.id = reges_results.receipt_id
            AND o.organization_id IN (SELECT public.get_user_org_ids())
        )
    );

CREATE POLICY "reges_results_update_policy" ON public.reges_results
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM reges_receipts r
            JOIN reges_outbox o ON r.outbox_id = o.id
            WHERE r.id = reges_results.receipt_id
            AND o.organization_id IN (SELECT public.get_user_org_ids())
        )
    );

CREATE POLICY "reges_results_delete_policy" ON public.reges_results
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM reges_receipts r
            JOIN reges_outbox o ON r.outbox_id = o.id
            WHERE r.id = reges_results.receipt_id
            AND o.organization_id IN (SELECT public.get_user_org_ids())
        )
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reges_results TO authenticated;

-- Table: reges_employee_snapshots
DROP POLICY IF EXISTS "reges_employee_snapshots_select_policy" ON public.reges_employee_snapshots;
DROP POLICY IF EXISTS "reges_employee_snapshots_insert_policy" ON public.reges_employee_snapshots;
DROP POLICY IF EXISTS "reges_employee_snapshots_update_policy" ON public.reges_employee_snapshots;
DROP POLICY IF EXISTS "reges_employee_snapshots_delete_policy" ON public.reges_employee_snapshots;

ALTER TABLE public.reges_employee_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reges_employee_snapshots_select_policy" ON public.reges_employee_snapshots
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "reges_employee_snapshots_insert_policy" ON public.reges_employee_snapshots
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "reges_employee_snapshots_update_policy" ON public.reges_employee_snapshots
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "reges_employee_snapshots_delete_policy" ON public.reges_employee_snapshots
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reges_employee_snapshots TO authenticated;

-- Table: audit_log
DROP POLICY IF EXISTS "audit_log_select_policy" ON public.audit_log;
DROP POLICY IF EXISTS "audit_log_insert_policy" ON public.audit_log;
DROP POLICY IF EXISTS "audit_log_update_policy" ON public.audit_log;
DROP POLICY IF EXISTS "audit_log_delete_policy" ON public.audit_log;
DROP POLICY IF EXISTS "Consultants can view all audit logs" ON public.audit_log;
DROP POLICY IF EXISTS "Users can view audit logs for their organizations" ON public.audit_log;

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Super admins see all, regular users see only their org's audit logs
CREATE POLICY "audit_log_select_policy" ON public.audit_log
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

-- Only super admins can insert (typically done by triggers/functions)
CREATE POLICY "audit_log_insert_policy" ON public.audit_log
    FOR INSERT TO authenticated
    WITH CHECK (public.is_super_admin());

-- Audit logs should never be updated or deleted (append-only)
CREATE POLICY "audit_log_update_policy" ON public.audit_log
    FOR UPDATE TO authenticated
    USING (false);

CREATE POLICY "audit_log_delete_policy" ON public.audit_log
    FOR DELETE TO authenticated
    USING (public.is_super_admin());

GRANT SELECT, INSERT ON public.audit_log TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: training_assignments
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "training_assignments_select_policy" ON public.training_assignments;
DROP POLICY IF EXISTS "training_assignments_insert_policy" ON public.training_assignments;
DROP POLICY IF EXISTS "training_assignments_update_policy" ON public.training_assignments;
DROP POLICY IF EXISTS "training_assignments_delete_policy" ON public.training_assignments;

ALTER TABLE public.training_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "training_assignments_select_policy" ON public.training_assignments
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "training_assignments_insert_policy" ON public.training_assignments
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "training_assignments_update_policy" ON public.training_assignments
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "training_assignments_delete_policy" ON public.training_assignments
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.training_assignments TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: safety_equipment
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "safety_equipment_select_policy" ON public.safety_equipment;
DROP POLICY IF EXISTS "safety_equipment_insert_policy" ON public.safety_equipment;
DROP POLICY IF EXISTS "safety_equipment_update_policy" ON public.safety_equipment;
DROP POLICY IF EXISTS "safety_equipment_delete_policy" ON public.safety_equipment;

ALTER TABLE public.safety_equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "safety_equipment_select_policy" ON public.safety_equipment
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "safety_equipment_insert_policy" ON public.safety_equipment
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "safety_equipment_update_policy" ON public.safety_equipment
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "safety_equipment_delete_policy" ON public.safety_equipment
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.safety_equipment TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: notifications
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "notifications_select_policy" ON public.notifications;
DROP POLICY IF EXISTS "notifications_insert_policy" ON public.notifications;
DROP POLICY IF EXISTS "notifications_update_policy" ON public.notifications;
DROP POLICY IF EXISTS "notifications_delete_policy" ON public.notifications;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users see their own notifications + org notifications
CREATE POLICY "notifications_select_policy" ON public.notifications
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR user_id = auth.uid()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "notifications_insert_policy" ON public.notifications
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "notifications_update_policy" ON public.notifications
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR user_id = auth.uid()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

CREATE POLICY "notifications_delete_policy" ON public.notifications
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR user_id = auth.uid()
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: notification_log
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "notification_log_select_policy" ON public.notification_log;
DROP POLICY IF EXISTS "notification_log_insert_policy" ON public.notification_log;
DROP POLICY IF EXISTS "notification_log_update_policy" ON public.notification_log;
DROP POLICY IF EXISTS "notification_log_delete_policy" ON public.notification_log;

ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notification_log_select_policy" ON public.notification_log
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
    );

-- Only system/super admin can insert notification logs
CREATE POLICY "notification_log_insert_policy" ON public.notification_log
    FOR INSERT TO authenticated
    WITH CHECK (public.is_super_admin());

-- Logs should be append-only
CREATE POLICY "notification_log_update_policy" ON public.notification_log
    FOR UPDATE TO authenticated
    USING (false);

CREATE POLICY "notification_log_delete_policy" ON public.notification_log
    FOR DELETE TO authenticated
    USING (public.is_super_admin());

GRANT SELECT, INSERT ON public.notification_log TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: user_preferences
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "user_preferences_select_policy" ON public.user_preferences;
DROP POLICY IF EXISTS "user_preferences_insert_policy" ON public.user_preferences;
DROP POLICY IF EXISTS "user_preferences_update_policy" ON public.user_preferences;
DROP POLICY IF EXISTS "user_preferences_delete_policy" ON public.user_preferences;

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only access their own preferences
CREATE POLICY "user_preferences_select_policy" ON public.user_preferences
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR user_id = auth.uid()
    );

CREATE POLICY "user_preferences_insert_policy" ON public.user_preferences
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_preferences_update_policy" ON public.user_preferences
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "user_preferences_delete_policy" ON public.user_preferences
    FOR DELETE TO authenticated
    USING (user_id = auth.uid());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_preferences TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table: legal_acts
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "legal_acts_select_policy" ON public.legal_acts;
DROP POLICY IF EXISTS "legal_acts_insert_policy" ON public.legal_acts;
DROP POLICY IF EXISTS "legal_acts_update_policy" ON public.legal_acts;
DROP POLICY IF EXISTS "legal_acts_delete_policy" ON public.legal_acts;

ALTER TABLE public.legal_acts ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read legal acts (public regulatory info)
CREATE POLICY "legal_acts_select_policy" ON public.legal_acts
    FOR SELECT TO authenticated
    USING (true);

-- Only super admins can manage legal acts
CREATE POLICY "legal_acts_insert_policy" ON public.legal_acts
    FOR INSERT TO authenticated
    WITH CHECK (public.is_super_admin());

CREATE POLICY "legal_acts_update_policy" ON public.legal_acts
    FOR UPDATE TO authenticated
    USING (public.is_super_admin());

CREATE POLICY "legal_acts_delete_policy" ON public.legal_acts
    FOR DELETE TO authenticated
    USING (public.is_super_admin());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.legal_acts TO authenticated;

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ Migration completed successfully                                         ║
-- ║                                                                           ║
-- ║ All tables now have:                                                      ║
-- ║ ✅ RLS enabled                                                            ║
-- ║ ✅ Modern RBAC policies using is_super_admin() and get_user_org_ids()    ║
-- ║ ✅ Consistent SELECT/INSERT/UPDATE/DELETE policies                        ║
-- ║                                                                           ║
-- ║ Next steps:                                                               ║
-- ║ 1. Test access from different user roles                                 ║
-- ║ 2. Verify no data is leaked between organizations                        ║
-- ║ 3. Update application code to remove any client-side filters             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
