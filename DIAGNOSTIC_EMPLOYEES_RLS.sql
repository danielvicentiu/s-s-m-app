-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ DIAGNOSTIC: Verifică starea RLS pe tabela employees                    ║
-- ║ Rulează în Supabase SQL Editor pentru a vedea problema                 ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- 1. Verifică dacă RLS este activat
SELECT
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE tablename = 'employees';

-- 2. Verifică politicile RLS existente
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd AS command,
    qual AS using_expression,
    with_check AS with_check_expression
FROM pg_policies
WHERE tablename = 'employees'
ORDER BY policyname;

-- 3. Verifică dacă funcțiile RBAC există
SELECT
    proname AS function_name,
    pg_get_functiondef(oid) AS definition_preview
FROM pg_proc
WHERE proname IN ('is_super_admin', 'get_user_org_ids', 'has_permission')
ORDER BY proname;

-- 4. Testează get_user_org_ids() pentru userul curent
SELECT
    'User ID' AS info_type,
    auth.uid()::text AS value
UNION ALL
SELECT
    'Organizations accessible' AS info_type,
    COUNT(*)::text AS value
FROM public.get_user_org_ids();

-- 5. Verifică câți angajați există în DB
SELECT
    'Total employees in DB' AS metric,
    COUNT(*)::text AS value
FROM public.employees
WHERE is_active = true;

-- 6. Verifică user_roles pentru userul curent (RBAC)
SELECT
    ur.user_id,
    r.role_key,
    r.role_name,
    ur.organization_id,
    ur.is_active,
    ur.expires_at
FROM public.user_roles ur
JOIN public.roles r ON r.id = ur.role_id
WHERE ur.user_id = auth.uid()
  AND ur.is_active = true;

-- 7. FALLBACK: Verifică memberships (sistem vechi)
SELECT
    m.user_id,
    m.role,
    m.organization_id,
    o.name AS org_name,
    m.is_active
FROM public.memberships m
LEFT JOIN public.organizations o ON o.id = m.organization_id
WHERE m.user_id = auth.uid()
  AND m.is_active = true;
