-- Migration: Fix RLS policies for employees table
-- Created: 2026-02-08
-- Description: Enable proper RLS policies for employees table to allow authenticated users to read/write employees

-- Step 1: Drop any existing policies
DROP POLICY IF EXISTS "employees_select_policy" ON public.employees;
DROP POLICY IF EXISTS "employees_select_dynamic" ON public.employees;
DROP POLICY IF EXISTS "employees_insert_policy" ON public.employees;
DROP POLICY IF EXISTS "employees_update_policy" ON public.employees;
DROP POLICY IF EXISTS "employees_delete_policy" ON public.employees;

-- Step 2: Ensure RLS is enabled
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Step 3: Create SELECT policy
-- Users can read employees from:
-- - Their assigned organizations (via get_user_org_ids)
-- - Super admins can see all
-- - Employees can see their own record
CREATE POLICY "employees_select_policy" ON public.employees
    FOR SELECT TO authenticated
    USING (
        -- Super admin sees all
        public.is_super_admin()
        OR
        -- User's assigned organizations
        organization_id IN (SELECT public.get_user_org_ids())
        OR
        -- Employee sees own record (if user_id exists)
        (user_id IS NOT NULL AND user_id = auth.uid())
    );

-- Step 4: Create INSERT policy
-- Users can insert employees for their assigned organizations
CREATE POLICY "employees_insert_policy" ON public.employees
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR
        organization_id IN (SELECT public.get_user_org_ids())
    );

-- Step 5: Create UPDATE policy
-- Users can update employees from their assigned organizations
CREATE POLICY "employees_update_policy" ON public.employees
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR
        organization_id IN (SELECT public.get_user_org_ids())
    );

-- Step 6: CREATE DELETE policy (soft delete preferred)
-- Users can delete employees from their assigned organizations
CREATE POLICY "employees_delete_policy" ON public.employees
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR
        organization_id IN (SELECT public.get_user_org_ids())
    );

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;

-- Add comment
COMMENT ON POLICY "employees_select_policy" ON public.employees IS 'Allow users to read employees from assigned organizations';
