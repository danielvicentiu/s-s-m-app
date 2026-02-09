-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ FIX: RLS Policies pentru tabela employees                              ║
-- ║ Aplicare: Deschide Supabase Dashboard → SQL Editor → Copy/Paste → Run ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Step 1: Drop any existing policies
DROP POLICY IF EXISTS "employees_select_policy" ON public.employees;
DROP POLICY IF EXISTS "employees_select_dynamic" ON public.employees;
DROP POLICY IF EXISTS "employees_insert_policy" ON public.employees;
DROP POLICY IF EXISTS "employees_update_policy" ON public.employees;
DROP POLICY IF EXISTS "employees_delete_policy" ON public.employees;

-- Step 2: Ensure RLS is enabled
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Step 3: Create SELECT policy
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
CREATE POLICY "employees_insert_policy" ON public.employees
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR
        organization_id IN (SELECT public.get_user_org_ids())
    );

-- Step 5: Create UPDATE policy
CREATE POLICY "employees_update_policy" ON public.employees
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin()
        OR
        organization_id IN (SELECT public.get_user_org_ids())
    );

-- Step 6: Create DELETE policy
CREATE POLICY "employees_delete_policy" ON public.employees
    FOR DELETE TO authenticated
    USING (
        public.is_super_admin()
        OR
        organization_id IN (SELECT public.get_user_org_ids())
    );

-- Step 7: Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;

-- Step 8: Verify policies were created
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'employees'
ORDER BY policyname;
