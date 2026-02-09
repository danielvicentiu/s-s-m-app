-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ FIX: Setează is_active = TRUE pentru angajații existenți               ║
-- ║ Aplicare: Supabase Dashboard → SQL Editor → Copy/Paste → Run           ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Verifică câți angajați au is_active NULL sau FALSE
SELECT
    'Angajați cu is_active NULL' AS status,
    COUNT(*)::text AS count
FROM public.employees
WHERE is_active IS NULL

UNION ALL

SELECT
    'Angajați cu is_active FALSE' AS status,
    COUNT(*)::text AS count
FROM public.employees
WHERE is_active = FALSE

UNION ALL

SELECT
    'Angajați cu is_active TRUE' AS status,
    COUNT(*)::text AS count
FROM public.employees
WHERE is_active = TRUE;

-- Update: Setează is_active = TRUE pentru toți angajații existenți
UPDATE public.employees
SET
    is_active = TRUE,
    updated_at = now()
WHERE is_active IS NULL OR is_active = FALSE;

-- Verifică rezultatul
SELECT
    id,
    full_name,
    job_title,
    organization_id,
    is_active,
    created_at
FROM public.employees
ORDER BY created_at DESC
LIMIT 10;
