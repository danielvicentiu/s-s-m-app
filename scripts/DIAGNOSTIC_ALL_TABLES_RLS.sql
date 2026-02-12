-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ DIAGNOSTIC: Verifică RLS pe TOATE tabelele din schema public            ║
-- ║ Rulează în Supabase SQL Editor și trimite rezultatele                   ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Query 1: Lista completă de tabele cu status RLS și număr de policies
SELECT
    t.tablename AS "Tabel",
    CASE
        WHEN t.rowsecurity THEN '✅ DA'
        ELSE '❌ NU'
    END AS "RLS Activat",
    COUNT(DISTINCT p.policyname) AS "Nr Policies",
    STRING_AGG(DISTINCT p.policyname, ', ' ORDER BY p.policyname) AS "Nume Policies"
FROM pg_tables t
LEFT JOIN pg_policies p ON p.tablename = t.tablename AND p.schemaname = t.schemaname
WHERE t.schemaname = 'public'
    AND t.tablename NOT LIKE 'pg_%'
    AND t.tablename NOT LIKE 'sql_%'
    AND t.tablename NOT LIKE '_prisma%'
GROUP BY t.tablename, t.rowsecurity
ORDER BY
    CASE WHEN t.rowsecurity THEN 1 ELSE 0 END,
    t.tablename;

-- Query 2: Tabele FĂRĂ RLS (cele care necesită fix)
SELECT
    tablename AS "⚠️ Tabel FĂRĂ RLS"
FROM pg_tables
WHERE schemaname = 'public'
    AND rowsecurity = false
    AND tablename NOT LIKE 'pg_%'
    AND tablename NOT LIKE 'sql_%'
ORDER BY tablename;

-- Query 3: Tabele cu RLS dar FĂRĂ policies (RLS activat dar inutil)
SELECT
    t.tablename AS "⚠️ Tabel cu RLS dar FĂRĂ policies"
FROM pg_tables t
WHERE t.schemaname = 'public'
    AND t.rowsecurity = true
    AND NOT EXISTS (
        SELECT 1 FROM pg_policies p
        WHERE p.tablename = t.tablename AND p.schemaname = 'public'
    )
ORDER BY t.tablename;

-- Query 4: Verifică dacă funcțiile RBAC există
SELECT
    proname AS "Funcție RBAC",
    CASE
        WHEN proname IS NOT NULL THEN '✅ Există'
        ELSE '❌ Lipsește'
    END AS "Status"
FROM (
    VALUES
        ('is_super_admin'),
        ('get_user_org_ids'),
        ('has_permission')
) AS required_funcs(fname)
LEFT JOIN pg_proc ON pg_proc.proname = fname
ORDER BY fname;

-- Query 5: Structura tabelelor (pentru a identifica coloanele organization_id)
SELECT
    t.tablename AS "Tabel",
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns c
            WHERE c.table_name = t.tablename
                AND c.table_schema = 'public'
                AND c.column_name = 'organization_id'
        ) THEN '✅ DA'
        ELSE '❌ NU'
    END AS "Are organization_id",
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns c
            WHERE c.table_name = t.tablename
                AND c.table_schema = 'public'
                AND c.column_name = 'company_id'
        ) THEN '✅ DA'
        ELSE '❌ NU'
    END AS "Are company_id",
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns c
            WHERE c.table_name = t.tablename
                AND c.table_schema = 'public'
                AND c.column_name = 'user_id'
        ) THEN '✅ DA'
        ELSE '❌ NU'
    END AS "Are user_id"
FROM pg_tables t
WHERE t.schemaname = 'public'
    AND t.tablename NOT LIKE 'pg_%'
    AND t.tablename NOT LIKE 'sql_%'
ORDER BY t.tablename;
