-- ============================================================
-- s-s-m.ro — 3 QUERY-URI DIAGNOSTIC (rulează în Supabase SQL Editor)
-- Copiază TOTUL, paste în SQL Editor, click RUN
-- Trimite rezultatele lui Claude
-- ============================================================

-- ═══ QUERY 1: Structura tabelului memberships ═══
-- (Am nevoie să știu exact ce câmpuri are și cum se numește câmpul de rol)
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'memberships' 
ORDER BY ordinal_position;

-- ═══ QUERY 2: Valorile distincte ale rolurilor din memberships ═══
-- (Am nevoie să știu exact ce valori există: 'consultant', 'admin', 'angajat'?)
SELECT 
    role, 
    count(*) as nr_useri
FROM public.memberships 
GROUP BY role 
ORDER BY count(*) DESC;

-- ═══ QUERY 3: Toate RLS policies existente pe toate tabelele ═══
-- (Am nevoie să știu ce trebuie DROP-uit și înlocuit)
SELECT 
    tablename, 
    policyname, 
    cmd,
    LEFT(qual::text, 120) as policy_condition
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- ═══ BONUS: UUID-ul tău de auth (pentru super_admin) ═══
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at 
LIMIT 5;
