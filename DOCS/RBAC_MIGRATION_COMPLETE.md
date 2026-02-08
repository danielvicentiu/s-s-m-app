# RBAC MIGRATION COMPLETE — S-S-M.RO
> **Versiune:** 1.0 | **Data:** 8 Februarie 2026
> **Scop:** SQL complet migrare memberships → RBAC dinamic + instrucțiuni Claude Code Next.js
> **Bazat pe:** DOC1 v9.1, DOC3 v4.1, 3 CSV-uri diagnostic Supabase

---

## GLOSAR AUTOMAT

| Termen | Explicație | Context |
|--------|-----------|---------|
| **RBAC** | Role-Based Access Control | Sistem control acces bazat pe roluri dinamice |
| **RLS** | Row Level Security | Politici PostgreSQL care restricționează accesul la nivel de rând |
| **JSONB** | JSON Binary | Tip PostgreSQL indexabil — folosit pentru conditions/field_restrictions |
| **CTE** | Common Table Expression | Subquery reutilizabilă — `WITH ... AS (...)` |
| **SECURITY DEFINER** | Funcție SQL executată cu privilegiile creatorului | Permite bypass RLS controlat |
| **SECURITY INVOKER** | Funcție SQL executată cu privilegiile apelantului | Respectă RLS-ul normal |
| **pg_has_role** | Funcție PostgreSQL nativă | Verifică dacă user are un anumit rol PostgreSQL |
| **auth.uid()** | Funcție Supabase Auth | Returnează UUID-ul userului autentificat curent |
| **gen_random_uuid()** | Funcție PostgreSQL | Generează UUID v4 random |
| **ON DELETE CASCADE** | Constraint FK | Șterge automat rândurile copil când părintele e șters |
| **COALESCE** | Funcție SQL | Returnează prima valoare non-NULL din argumente |
| **Fallback** | Strategie backward-compat | Dacă user_roles gol, verifică memberships.role vechi |
| **GRANT** | Comandă SQL | Acordă permisiuni pe obiecte DB |

---

## DIAGNOSTIC — STARE ACTUALĂ (din CSV-uri)

### Tabel `memberships` — Schema
```
column_name       | data_type                | is_nullable | column_default
------------------+--------------------------+-------------+----------------
id                | uuid                     | NO          | gen_random_uuid()
user_id           | uuid                     | NO          | null
organization_id   | uuid                     | NO          | null
role              | text                     | NO          | null
is_active         | boolean                  | NO          | true
joined_at         | timestamp with time zone | NO          | now()
```

### Date existente `memberships`
```
role          | nr_useri
--------------+---------
consultant    | 1
firma_admin   | 1
```
⚠️ **DOAR 2 useri de migrat** — migrare cu risc minim.

### Funcții helper existente (utilizate în RLS policies)
Din analiza query3_result.csv, funcțiile folosite actual sunt:
- `has_role_in_org(org_id, role_text)` — verifică memberships.role
- `is_consultant()` — verifică dacă userul e consultant
- `get_my_org_ids()` — returnează org_id-urile userului
- `auth.uid()` — Supabase built-in

### RLS Policies — Pattern-uri identificate (25 tabele, 60+ policies)

| Pattern | Tabele | Exemplu policy |
|---------|--------|---------------|
| `has_role_in_org(org_id, 'consultant')` | organizations, employees, locations, medical_examinations, safety_equipment, memberships, fraud_alerts, alert_preferences | DELETE/UPDATE policies |
| `get_my_org_ids()` | organizations, employees, locations, medical_examinations, safety_equipment, generated_documents, notification_log, alert_preferences | SELECT policies |
| `is_consultant()` | jurisdictions | UPDATE/DELETE policies |
| Direct `memberships` JOIN | audit_log, organized_training_sessions, penalty_rules, penalty_visibility, reges_*, test_questions, training_*, profiles, notification_log | SELECT/ALL policies |
| `true` (public read) | authorities, penalty_rules(read), test_questions(read), training_modules(read), jurisdictions(select) | SELECT policies |
| `auth.uid()` (own data) | profiles(update), employees(select fallback) | UPDATE/SELECT |

---

## SECȚIUNEA 8 — SQL MIGRARE COMPLET

### 8.1 Creare tabele RBAC (roles, permissions, user_roles)

```sql
-- ============================================================
-- SECȚIUNEA 8.1: CREARE TABELE RBAC DINAMIC
-- Execută în Supabase SQL Editor, ca o singură tranzacție
-- ============================================================

BEGIN;

-- ────────────────────────────────────────────
-- 8.1.1 Tabel: roles
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.roles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_key     TEXT UNIQUE NOT NULL,
  role_name    TEXT NOT NULL,
  description  TEXT,
  country_code TEXT,            -- NULL = global, 'RO'/'BG'/'HU'/'DE'/'PL' = specific
  is_system    BOOLEAN DEFAULT false,  -- true = nu poate fi șters din UI
  is_active    BOOLEAN DEFAULT true,
  created_by   UUID REFERENCES auth.users(id),
  created_at   TIMESTAMPTZ DEFAULT now(),
  metadata     JSONB DEFAULT '{}'::jsonb
);

COMMENT ON TABLE public.roles IS 'Roluri dinamice RBAC — orice rol, orice țară, creabile din Admin UI';
COMMENT ON COLUMN public.roles.country_code IS 'NULL = rol global, cod ISO = specific țară';
COMMENT ON COLUMN public.roles.is_system IS 'true = protejat la ștergere (super_admin, consultant_ssm, etc.)';
COMMENT ON COLUMN public.roles.metadata IS 'JSONB flexibil: dashboard_config, color, icon, etc.';

-- ────────────────────────────────────────────
-- 8.1.2 Tabel: permissions
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.permissions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id            UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  resource           TEXT NOT NULL,       -- 'employees', 'equipment', 'trainings', 'dashboard', etc.
  action             TEXT NOT NULL,       -- 'create', 'read', 'update', 'delete', 'export', 'delegate'
  field_restrictions JSONB DEFAULT '{}'::jsonb,  -- {"cnp": "masked", "salary": "hidden"}
  conditions         JSONB DEFAULT '{}'::jsonb,  -- {"own_company": true, "own_user": true}
  country_code       TEXT,
  is_active          BOOLEAN DEFAULT true,
  UNIQUE(role_id, resource, action, country_code)
);

COMMENT ON TABLE public.permissions IS 'Permisiuni per rol: resource × action × restricții JSONB';
COMMENT ON COLUMN public.permissions.field_restrictions IS 'Câmpuri mascate/ascunse per rol';
COMMENT ON COLUMN public.permissions.conditions IS 'Condiții suplimentare: own_company, own_user, supplier_category';

-- ────────────────────────────────────────────
-- 8.1.3 Tabel: user_roles
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id     UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  company_id  UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  granted_by  UUID REFERENCES auth.users(id),
  granted_at  TIMESTAMPTZ DEFAULT now(),
  expires_at  TIMESTAMPTZ,     -- NULL = permanent, dată = temporar (auditor extern)
  is_active   BOOLEAN DEFAULT true,
  UNIQUE(user_id, role_id, company_id)
);

COMMENT ON TABLE public.user_roles IS 'Asignare user → rol, opțional scoped la company/location';
COMMENT ON COLUMN public.user_roles.expires_at IS 'NULL = permanent. Data = expirare automată (auditor extern, inspector temporar)';

-- ────────────────────────────────────────────
-- 8.1.4 Indexuri performanță
-- ────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_company_id ON public.user_roles(company_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON public.user_roles(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_permissions_role_id ON public.permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_permissions_resource_action ON public.permissions(resource, action);
CREATE INDEX IF NOT EXISTS idx_roles_role_key ON public.roles(role_key);
CREATE INDEX IF NOT EXISTS idx_roles_country ON public.roles(country_code);

COMMIT;
```

### 8.2 Populare roluri (27 roluri: 17 core + 10 per țară)

```sql
-- ============================================================
-- SECȚIUNEA 8.2: POPULARE ROLURI
-- ============================================================

BEGIN;

-- ── TIER 1: CORE (4 roluri, is_system = true) ──
INSERT INTO public.roles (role_key, role_name, description, country_code, is_system, metadata) VALUES
  ('super_admin',        'Super Admin',          'Acces complet la tot sistemul. Daniel.', NULL, true,  '{"tier": 1, "color": "#DC2626", "icon": "shield"}'),
  ('consultant_ssm',     'Consultant SSM',       'Consultant autorizat SSM/PSI — vede toate firmele alocate.', NULL, true,  '{"tier": 1, "color": "#2563EB", "icon": "briefcase"}'),
  ('firma_admin',        'Firma Admin',          'Administrator firmă client — doar datele firmei sale.', NULL, true,  '{"tier": 1, "color": "#059669", "icon": "building"}'),
  ('angajat',            'Angajat',              'Angajat — doar datele proprii, instruiri, certificate.', NULL, true,  '{"tier": 1, "color": "#6B7280", "icon": "user"}');

-- ── TIER 2: PLANIFICATE RO (13 roluri) ──
INSERT INTO public.roles (role_key, role_name, description, country_code, is_system, metadata) VALUES
  ('partener_contabil',       'Partener Contabil',          'Read-only firme afiliate: scor, expirări, alerte.', 'RO', false, '{"tier": 2}'),
  ('furnizor_psi',            'Furnizor PSI',               'Echipamente din categoria lui la firmele selectate.', 'RO', false, '{"tier": 2}'),
  ('furnizor_iscir',          'Furnizor ISCIR/RSVTI',       'Echipamente sub supraveghere ISCIR.', 'RO', false, '{"tier": 2}'),
  ('medic_mm',                'Medic Medicina Muncii',      'Programări examene, fișe aptitudine.', 'RO', false, '{"tier": 2}'),
  ('auditor_extern',          'Auditor Extern',             'Read-only temporar (expires_at!), scor + documente.', NULL, false, '{"tier": 2}'),
  ('inspector_itm',           'Inspector ITM',              'Dashboard special: rapoarte conformitate.', 'RO', false, '{"tier": 2}'),
  ('inspector_igsu',          'Inspector IGSU (PSI)',       'Doar PSI: stingătoare, PRAM, evacuare.', 'RO', false, '{"tier": 2}'),
  ('inspector_anspdcp',       'Inspector ANSPDCP',          'Doar GDPR: registre, DPO.', 'RO', false, '{"tier": 2}'),
  ('lucrator_desemnat',       'Lucrător Desemnat',          'Mai mult decât angajat, mai puțin decât consultant.', 'RO', false, '{"tier": 2}'),
  ('white_label_stm',         'White-Label / STM',          'Clienții lui, sub brandul lui.', NULL, false, '{"tier": 2}'),
  ('responsabil_ssm_intern',  'Responsabil SSM Intern',     'Firma lui + raportare consultant.', 'RO', false, '{"tier": 2}'),
  ('training_provider',       'Training Provider',          'Module instruire proprii + statistici.', NULL, false, '{"tier": 2}'),
  ('responsabil_nis2',        'Responsabil NIS2',           'Modul NIS2: audit, plan conformitate.', NULL, false, '{"tier": 2}');

-- ── TIER 3: PER ȚARĂ (10 roluri) ──
INSERT INTO public.roles (role_key, role_name, description, country_code, is_system, metadata) VALUES
  ('zbut_consultant_bg',      'Consultant ЗБУТ',            'Consultant SSM Bulgaria.', 'BG', false, '{"tier": 3}'),
  ('inspector_git_bg',        'Inspector ГИТ',              'Inspector Muncii Bulgaria.', 'BG', false, '{"tier": 3}'),
  ('stm_partner_bg',          'STM Partner BG',             'Partener STM Bulgaria (Mediko etc.).', 'BG', false, '{"tier": 3}'),
  ('munkavedelmi_hu',         'Munkavédelmi szakember',     'Consultant SSM Ungaria.', 'HU', false, '{"tier": 3}'),
  ('inspector_ommf_hu',       'Inspector OMMF',             'Inspector Muncii Ungaria.', 'HU', false, '{"tier": 3}'),
  ('sicherheitsingenieur_de', 'Sicherheitsingenieur',       'Consultant SSM Germania.', 'DE', false, '{"tier": 3}'),
  ('betriebsarzt_de',         'Betriebsarzt',               'Medic Muncii Germania.', 'DE', false, '{"tier": 3}'),
  ('berufsgenossenschaft_de', 'Berufsgenossenschaft',       'Auditor/Inspector Germania.', 'DE', false, '{"tier": 3}'),
  ('specjalista_bhp_pl',      'Specjalista BHP',            'Consultant SSM Polonia.', 'PL', false, '{"tier": 3}'),
  ('inspector_pip_pl',        'Inspector PIP',              'Inspector Muncii Polonia.', 'PL', false, '{"tier": 3}');

COMMIT;
```

### 8.3 Populare permisiuni TIER 1 (4 roluri core)

```sql
-- ============================================================
-- SECȚIUNEA 8.3: PERMISIUNI TIER 1
-- Resurse: organizations, employees, locations, equipment,
--   medical, trainings, documents, alerts, dashboard, reports,
--   fraud, jurisdictions, roles_admin, reges
-- ============================================================

BEGIN;

-- ── SUPER_ADMIN: ALL × ALL × no restrictions ──
INSERT INTO public.permissions (role_id, resource, action, conditions)
SELECT r.id, res.resource, act.action, '{}'::jsonb
FROM public.roles r
CROSS JOIN (VALUES
  ('organizations'), ('employees'), ('locations'), ('equipment'),
  ('medical'), ('trainings'), ('documents'), ('alerts'),
  ('dashboard'), ('reports'), ('fraud'), ('jurisdictions'),
  ('roles_admin'), ('reges'), ('memberships'), ('profiles'),
  ('notifications'), ('penalties'), ('audit_log')
) AS res(resource)
CROSS JOIN (VALUES
  ('create'), ('read'), ('update'), ('delete'), ('export'), ('delegate')
) AS act(action)
WHERE r.role_key = 'super_admin';

-- ── CONSULTANT_SSM: CRUD+export pe resurse operaționale ──
INSERT INTO public.permissions (role_id, resource, action, conditions)
SELECT r.id, res.resource, act.action, '{}'::jsonb
FROM public.roles r
CROSS JOIN (VALUES
  ('employees'), ('locations'), ('equipment'), ('medical'),
  ('trainings'), ('documents'), ('alerts'), ('dashboard'),
  ('reports'), ('fraud'), ('jurisdictions'), ('reges'),
  ('notifications'), ('memberships'), ('organizations')
) AS res(resource)
CROSS JOIN (VALUES
  ('create'), ('read'), ('update'), ('delete'), ('export')
) AS act(action)
WHERE r.role_key = 'consultant_ssm';

-- ── FIRMA_ADMIN: Read + create limitat, condiție own_company ──
-- Read pe majoritatea resurselor
INSERT INTO public.permissions (role_id, resource, action, conditions)
SELECT r.id, res.resource, 'read', '{"own_company": true}'::jsonb
FROM public.roles r
CROSS JOIN (VALUES
  ('employees'), ('locations'), ('equipment'), ('medical'),
  ('trainings'), ('documents'), ('alerts'), ('dashboard'),
  ('reports'), ('notifications'), ('organizations')
) AS res(resource)
WHERE r.role_key = 'firma_admin';

-- Create/Update pe unele resurse
INSERT INTO public.permissions (role_id, resource, action, conditions)
SELECT r.id, res.resource, act.action, '{"own_company": true}'::jsonb
FROM public.roles r
CROSS JOIN (VALUES ('employees'), ('locations')) AS res(resource)
CROSS JOIN (VALUES ('create'), ('update')) AS act(action)
WHERE r.role_key = 'firma_admin';

-- Update pe organizația proprie
INSERT INTO public.permissions (role_id, resource, action, conditions)
SELECT r.id, 'organizations', 'update', '{"own_company": true}'::jsonb
FROM public.roles r WHERE r.role_key = 'firma_admin';

-- ── ANGAJAT: Read-only pe datele proprii ──
INSERT INTO public.permissions (role_id, resource, action, conditions)
SELECT r.id, res.resource, 'read', '{"own_user": true}'::jsonb
FROM public.roles r
CROSS JOIN (VALUES
  ('trainings'), ('medical'), ('documents'), ('dashboard'), ('alerts')
) AS res(resource)
WHERE r.role_key = 'angajat';

COMMIT;
```

### 8.4 Migrare date memberships → user_roles

```sql
-- ============================================================
-- SECȚIUNEA 8.4: MIGRARE DATE MEMBERSHIPS → USER_ROLES
-- ATENȚIE: Doar 2 useri (1 consultant, 1 firma_admin)
-- ============================================================

BEGIN;

-- Pasul 1: Migrare automată
INSERT INTO public.user_roles (user_id, role_id, company_id, granted_by, is_active)
SELECT
  m.user_id,
  r.id AS role_id,
  m.organization_id AS company_id,
  m.user_id AS granted_by,  -- self-granted la migrare
  m.is_active
FROM public.memberships m
JOIN public.roles r ON r.role_key = CASE
  WHEN m.role = 'consultant' THEN 'consultant_ssm'
  WHEN m.role = 'firma_admin' THEN 'firma_admin'
  WHEN m.role = 'angajat' THEN 'angajat'
  ELSE m.role  -- fallback exact match
END
WHERE m.is_active = true
ON CONFLICT (user_id, role_id, company_id) DO NOTHING;

-- Pasul 2: Daniel primește și super_admin
-- ⚠️ ÎNLOCUIEȘTE cu UUID-ul real al lui Daniel
-- Găsește-l cu: SELECT user_id FROM memberships WHERE role = 'consultant';
INSERT INTO public.user_roles (user_id, role_id, company_id, granted_by)
SELECT
  m.user_id,
  r.id,
  NULL,  -- super_admin e global, fără company_id
  m.user_id
FROM public.memberships m
CROSS JOIN public.roles r
WHERE m.role = 'consultant'
  AND r.role_key = 'super_admin'
ON CONFLICT (user_id, role_id, company_id) DO NOTHING;

-- Pasul 3: Verificare
-- Rulează DUPĂ migrare:
-- SELECT ur.*, r.role_key, r.role_name
-- FROM user_roles ur
-- JOIN roles r ON r.id = ur.role_id
-- ORDER BY ur.user_id, r.role_key;

COMMIT;
```

### 8.5 Funcții helper RBAC (înlocuiesc has_role_in_org, is_consultant, get_my_org_ids)

```sql
-- ============================================================
-- SECȚIUNEA 8.5: FUNCȚII HELPER RBAC DINAMICE
-- Înlocuiesc funcțiile vechi bazate pe memberships
-- Strategie: FALLBACK pe memberships dacă user_roles gol
-- ============================================================

-- ────────────────────────────────────────────
-- 8.5.1 rbac_get_user_role_keys(uid) → TEXT[]
-- Returnează array cu toate role_key-urile active ale userului
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.rbac_get_user_role_keys(p_user_id UUID DEFAULT auth.uid())
RETURNS TEXT[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    array_agg(DISTINCT r.role_key),
    -- FALLBACK: citește din memberships dacă nu are nimic în user_roles
    (SELECT array_agg(DISTINCT
      CASE
        WHEN m.role = 'consultant' THEN 'consultant_ssm'
        WHEN m.role = 'firma_admin' THEN 'firma_admin'
        WHEN m.role = 'angajat' THEN 'angajat'
        ELSE m.role
      END
    ) FROM public.memberships m WHERE m.user_id = p_user_id AND m.is_active = true)
  )
  FROM public.user_roles ur
  JOIN public.roles r ON r.id = ur.role_id
  WHERE ur.user_id = p_user_id
    AND ur.is_active = true
    AND r.is_active = true
    AND (ur.expires_at IS NULL OR ur.expires_at > now());
$$;

-- ────────────────────────────────────────────
-- 8.5.2 rbac_has_role(role_key) → BOOLEAN
-- Verifică dacă userul curent are un rol specific
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.rbac_has_role(p_role_key TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND r.role_key = p_role_key
      AND ur.is_active = true
      AND r.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
  )
  OR
  -- FALLBACK pe memberships
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
      AND m.is_active = true
      AND (
        (p_role_key = 'consultant_ssm' AND m.role = 'consultant') OR
        (p_role_key = 'firma_admin'    AND m.role = 'firma_admin') OR
        (p_role_key = 'angajat'        AND m.role = 'angajat') OR
        (p_role_key = 'super_admin'    AND m.role = 'consultant')
      )
  );
$$;

-- ────────────────────────────────────────────
-- 8.5.3 rbac_has_role_in_org(org_id, role_key) → BOOLEAN
-- Înlocuiește has_role_in_org() — verifică rol + org
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.rbac_has_role_in_org(p_org_id UUID, p_role_key TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND r.role_key = p_role_key
      AND ur.is_active = true
      AND r.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
      AND (ur.company_id = p_org_id OR ur.company_id IS NULL)  -- NULL = acces global
  )
  OR
  -- FALLBACK
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
      AND m.organization_id = p_org_id
      AND m.is_active = true
      AND (
        (p_role_key = 'consultant_ssm' AND m.role = 'consultant') OR
        (p_role_key = 'firma_admin'    AND m.role = 'firma_admin') OR
        (p_role_key = 'angajat'        AND m.role = 'angajat')
      )
  );
$$;

-- ────────────────────────────────────────────
-- 8.5.4 rbac_get_my_org_ids() → UUID[]
-- Înlocuiește get_my_org_ids() — returnează organizațiile accesibile
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.rbac_get_my_org_ids()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Super admin: vede TOT
  SELECT o.id FROM public.organizations o
  WHERE EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND r.role_key = 'super_admin'
      AND ur.is_active = true AND r.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
  )

  UNION

  -- Alte roluri: doar org-urile alocate
  SELECT ur.company_id FROM public.user_roles ur
  JOIN public.roles r ON r.id = ur.role_id
  WHERE ur.user_id = auth.uid()
    AND ur.company_id IS NOT NULL
    AND ur.is_active = true
    AND r.is_active = true
    AND (ur.expires_at IS NULL OR ur.expires_at > now())

  UNION

  -- FALLBACK pe memberships
  SELECT m.organization_id FROM public.memberships m
  WHERE m.user_id = auth.uid()
    AND m.is_active = true
    AND NOT EXISTS (
      SELECT 1 FROM public.user_roles ur2
      WHERE ur2.user_id = auth.uid() AND ur2.is_active = true
    );
$$;

-- ────────────────────────────────────────────
-- 8.5.5 rbac_is_super_admin() → BOOLEAN
-- Shortcut pentru verificări admin
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.rbac_is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.rbac_has_role('super_admin');
$$;

-- ────────────────────────────────────────────
-- 8.5.6 rbac_has_permission(resource, action) → BOOLEAN
-- Verifică permisiune granulară din tabelul permissions
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.rbac_has_permission(p_resource TEXT, p_action TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    JOIN public.permissions p ON p.role_id = r.id
    WHERE ur.user_id = auth.uid()
      AND ur.is_active = true
      AND r.is_active = true
      AND p.is_active = true
      AND p.resource = p_resource
      AND p.action = p_action
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
  );
$$;

-- ────────────────────────────────────────────
-- 8.5.7 rbac_can_access_org(org_id) → BOOLEAN
-- Verifică dacă userul curent poate accesa o organizație
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.rbac_can_access_org(p_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p_org_id IN (SELECT public.rbac_get_my_org_ids());
$$;

-- ────────────────────────────────────────────
-- 8.5.8 GRANTs
-- ────────────────────────────────────────────
GRANT EXECUTE ON FUNCTION public.rbac_get_user_role_keys TO authenticated;
GRANT EXECUTE ON FUNCTION public.rbac_has_role TO authenticated;
GRANT EXECUTE ON FUNCTION public.rbac_has_role_in_org TO authenticated;
GRANT EXECUTE ON FUNCTION public.rbac_get_my_org_ids TO authenticated;
GRANT EXECUTE ON FUNCTION public.rbac_is_super_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.rbac_has_permission TO authenticated;
GRANT EXECUTE ON FUNCTION public.rbac_can_access_org TO authenticated;
```

### 8.6 RLS pe tabelele RBAC noi (roles, permissions, user_roles)

```sql
-- ============================================================
-- SECȚIUNEA 8.6: RLS PE TABELELE RBAC
-- ============================================================

-- ── roles: toți autentificați citesc, doar super_admin modifică ──
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY rbac_roles_select ON public.roles
  FOR SELECT TO authenticated
  USING (true);  -- oricine autentificat poate vedea lista roluri

CREATE POLICY rbac_roles_insert ON public.roles
  FOR INSERT TO authenticated
  WITH CHECK (public.rbac_is_super_admin());

CREATE POLICY rbac_roles_update ON public.roles
  FOR UPDATE TO authenticated
  USING (public.rbac_is_super_admin());

CREATE POLICY rbac_roles_delete ON public.roles
  FOR DELETE TO authenticated
  USING (public.rbac_is_super_admin() AND is_system = false);  -- nu șterge system roles

-- ── permissions: toți citesc, doar super_admin modifică ──
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY rbac_permissions_select ON public.permissions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY rbac_permissions_insert ON public.permissions
  FOR INSERT TO authenticated
  WITH CHECK (public.rbac_is_super_admin());

CREATE POLICY rbac_permissions_update ON public.permissions
  FOR UPDATE TO authenticated
  USING (public.rbac_is_super_admin());

CREATE POLICY rbac_permissions_delete ON public.permissions
  FOR DELETE TO authenticated
  USING (public.rbac_is_super_admin());

-- ── user_roles: userul vede rolurile lui, super_admin vede tot ──
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY rbac_user_roles_select ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.rbac_is_super_admin());

CREATE POLICY rbac_user_roles_insert ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.rbac_is_super_admin() OR public.rbac_has_role('consultant_ssm'));

CREATE POLICY rbac_user_roles_update ON public.user_roles
  FOR UPDATE TO authenticated
  USING (public.rbac_is_super_admin());

CREATE POLICY rbac_user_roles_delete ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.rbac_is_super_admin());

-- ── GRANTs pe tabele ──
GRANT SELECT ON public.roles TO authenticated;
GRANT SELECT ON public.permissions TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.roles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.permissions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
```

---

## SECȚIUNEA 9 — ACTUALIZARE RLS PE 25 TABELE EXISTENTE

### 9.0 Strategie

**Principiu:** NU ștergem policies vechi încă. Adăugăm policies noi cu prefix `rbac_`. Funcțiile `rbac_*` au fallback pe `memberships`, deci totul funcționează ÎN PARALEL. După 30 zile de testare, ștergem policies vechi.

**Pattern-uri noi aplicate:**
- `rbac_get_my_org_ids()` înlocuiește `get_my_org_ids()` + JOIN-uri directe pe memberships
- `rbac_has_role_in_org()` înlocuiește `has_role_in_org()`
- `rbac_is_super_admin()` înlocuiește `is_consultant()`
- `rbac_has_permission()` pentru granularitate fină

### 9.1 Tabele cu organization_id direct (14 tabele — pattern identic)

Aceste tabele au `organization_id` direct și folosesc pattern-ul standard:

```sql
-- ============================================================
-- SECȚIUNEA 9.1: RLS RBAC PE TABELE CU organization_id
-- Pattern: SELECT → rbac_get_my_org_ids()
--          INSERT → rbac_has_permission(resource, 'create')
--          UPDATE → rbac_has_role_in_org(org, 'consultant_ssm') OR firma_admin own
--          DELETE → rbac_has_role_in_org(org, 'consultant_ssm') OR super_admin
-- ============================================================

-- ────────────────────────────────────────────
-- 9.1.1 organizations
-- ────────────────────────────────────────────
CREATE POLICY rbac_org_select ON public.organizations
  FOR SELECT TO authenticated
  USING (id IN (SELECT public.rbac_get_my_org_ids()));

CREATE POLICY rbac_org_insert ON public.organizations
  FOR INSERT TO authenticated
  WITH CHECK (
    public.rbac_has_permission('organizations', 'create')
  );

CREATE POLICY rbac_org_update ON public.organizations
  FOR UPDATE TO authenticated
  USING (
    public.rbac_has_role_in_org(id, 'consultant_ssm')
    OR public.rbac_has_role_in_org(id, 'firma_admin')
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_org_delete ON public.organizations
  FOR DELETE TO authenticated
  USING (
    public.rbac_has_role_in_org(id, 'consultant_ssm')
    OR public.rbac_is_super_admin()
  );

-- ────────────────────────────────────────────
-- 9.1.2 employees
-- ────────────────────────────────────────────
CREATE POLICY rbac_employees_select ON public.employees
  FOR SELECT TO authenticated
  USING (
    organization_id IN (SELECT public.rbac_get_my_org_ids())
    OR user_id = auth.uid()  -- angajatul vede datele proprii
  );

CREATE POLICY rbac_employees_insert ON public.employees
  FOR INSERT TO authenticated
  WITH CHECK (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_has_role_in_org(organization_id, 'firma_admin')
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_employees_update ON public.employees
  FOR UPDATE TO authenticated
  USING (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_has_role_in_org(organization_id, 'firma_admin')
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_employees_delete ON public.employees
  FOR DELETE TO authenticated
  USING (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_is_super_admin()
  );

-- ────────────────────────────────────────────
-- 9.1.3 locations
-- ────────────────────────────────────────────
CREATE POLICY rbac_locations_select ON public.locations
  FOR SELECT TO authenticated
  USING (organization_id IN (SELECT public.rbac_get_my_org_ids()));

CREATE POLICY rbac_locations_insert ON public.locations
  FOR INSERT TO authenticated
  WITH CHECK (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_has_role_in_org(organization_id, 'firma_admin')
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_locations_update ON public.locations
  FOR UPDATE TO authenticated
  USING (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_has_role_in_org(organization_id, 'firma_admin')
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_locations_delete ON public.locations
  FOR DELETE TO authenticated
  USING (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_is_super_admin()
  );

-- ────────────────────────────────────────────
-- 9.1.4 medical_examinations
-- ────────────────────────────────────────────
CREATE POLICY rbac_medical_select ON public.medical_examinations
  FOR SELECT TO authenticated
  USING (organization_id IN (SELECT public.rbac_get_my_org_ids()));

CREATE POLICY rbac_medical_insert ON public.medical_examinations
  FOR INSERT TO authenticated
  WITH CHECK (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_has_role_in_org(organization_id, 'firma_admin')
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_medical_update ON public.medical_examinations
  FOR UPDATE TO authenticated
  USING (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_has_role_in_org(organization_id, 'firma_admin')
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_medical_delete ON public.medical_examinations
  FOR DELETE TO authenticated
  USING (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_is_super_admin()
  );

-- ────────────────────────────────────────────
-- 9.1.5 safety_equipment
-- ────────────────────────────────────────────
CREATE POLICY rbac_safety_select ON public.safety_equipment
  FOR SELECT TO authenticated
  USING (organization_id IN (SELECT public.rbac_get_my_org_ids()));

CREATE POLICY rbac_safety_insert ON public.safety_equipment
  FOR INSERT TO authenticated
  WITH CHECK (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_has_role_in_org(organization_id, 'firma_admin')
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_safety_update ON public.safety_equipment
  FOR UPDATE TO authenticated
  USING (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_has_role_in_org(organization_id, 'firma_admin')
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_safety_delete ON public.safety_equipment
  FOR DELETE TO authenticated
  USING (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_is_super_admin()
  );

-- ────────────────────────────────────────────
-- 9.1.6 memberships (backward compat — rămâne activ)
-- ────────────────────────────────────────────
CREATE POLICY rbac_memberships_select ON public.memberships
  FOR SELECT TO authenticated
  USING (organization_id IN (SELECT public.rbac_get_my_org_ids()));

CREATE POLICY rbac_memberships_insert ON public.memberships
  FOR INSERT TO authenticated
  WITH CHECK (
    public.rbac_has_role('consultant_ssm')
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_memberships_update ON public.memberships
  FOR UPDATE TO authenticated
  USING (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_memberships_delete ON public.memberships
  FOR DELETE TO authenticated
  USING (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_is_super_admin()
  );

-- ────────────────────────────────────────────
-- 9.1.7 notification_log
-- ────────────────────────────────────────────
CREATE POLICY rbac_notif_select ON public.notification_log
  FOR SELECT TO authenticated
  USING (organization_id IN (SELECT public.rbac_get_my_org_ids()));

CREATE POLICY rbac_notif_insert ON public.notification_log
  FOR INSERT TO authenticated
  WITH CHECK (
    public.rbac_has_permission('notifications', 'create')
    OR public.rbac_has_role('consultant_ssm')
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_notif_update ON public.notification_log
  FOR UPDATE TO authenticated
  USING (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_is_super_admin()
  );

-- ────────────────────────────────────────────
-- 9.1.8 alert_preferences
-- ────────────────────────────────────────────
CREATE POLICY rbac_alert_prefs_select ON public.alert_preferences
  FOR SELECT TO authenticated
  USING (organization_id IN (SELECT public.rbac_get_my_org_ids()));

CREATE POLICY rbac_alert_prefs_insert ON public.alert_preferences
  FOR INSERT TO authenticated
  WITH CHECK (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_has_role_in_org(organization_id, 'firma_admin')
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_alert_prefs_update ON public.alert_preferences
  FOR UPDATE TO authenticated
  USING (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_has_role_in_org(organization_id, 'firma_admin')
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_alert_prefs_delete ON public.alert_preferences
  FOR DELETE TO authenticated
  USING (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_is_super_admin()
  );

-- ────────────────────────────────────────────
-- 9.1.9 generated_documents
-- ────────────────────────────────────────────
CREATE POLICY rbac_docs_select ON public.generated_documents
  FOR SELECT TO authenticated
  USING (organization_id IN (SELECT public.rbac_get_my_org_ids()));

CREATE POLICY rbac_docs_insert ON public.generated_documents
  FOR INSERT TO authenticated
  WITH CHECK (
    public.rbac_has_permission('documents', 'create')
    OR public.rbac_has_role('consultant_ssm')
    OR public.rbac_is_super_admin()
  );

-- ────────────────────────────────────────────
-- 9.1.10 fraud_alerts
-- ────────────────────────────────────────────
CREATE POLICY rbac_fraud_select ON public.fraud_alerts
  FOR SELECT TO authenticated
  USING (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_fraud_insert ON public.fraud_alerts
  FOR INSERT TO authenticated
  WITH CHECK (true);  -- system-generated

CREATE POLICY rbac_fraud_update ON public.fraud_alerts
  FOR UPDATE TO authenticated
  USING (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_is_super_admin()
  );

-- ────────────────────────────────────────────
-- 9.1.11 organized_training_sessions
-- ────────────────────────────────────────────
CREATE POLICY rbac_ots_select ON public.organized_training_sessions
  FOR SELECT TO authenticated
  USING (organization_id IN (SELECT public.rbac_get_my_org_ids()));

CREATE POLICY rbac_ots_insert ON public.organized_training_sessions
  FOR INSERT TO authenticated
  WITH CHECK (
    public.rbac_has_role_in_org(organization_id, 'consultant_ssm')
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_ots_update ON public.organized_training_sessions
  FOR UPDATE TO authenticated
  USING (organization_id IN (SELECT public.rbac_get_my_org_ids()));

-- ────────────────────────────────────────────
-- 9.1.12 penalty_visibility
-- ────────────────────────────────────────────
CREATE POLICY rbac_pv_select ON public.penalty_visibility
  FOR SELECT TO authenticated
  USING (organization_id IN (SELECT public.rbac_get_my_org_ids()));

CREATE POLICY rbac_pv_write ON public.penalty_visibility
  FOR ALL TO authenticated
  USING (organization_id IN (SELECT public.rbac_get_my_org_ids()));

-- ────────────────────────────────────────────
-- 9.1.13 reges_connections
-- ────────────────────────────────────────────
CREATE POLICY rbac_reges_conn_select ON public.reges_connections
  FOR SELECT TO authenticated
  USING (organization_id IN (SELECT public.rbac_get_my_org_ids()));

CREATE POLICY rbac_reges_conn_insert ON public.reges_connections
  FOR INSERT TO authenticated
  WITH CHECK (organization_id IN (SELECT public.rbac_get_my_org_ids()));

CREATE POLICY rbac_reges_conn_update ON public.reges_connections
  FOR UPDATE TO authenticated
  USING (organization_id IN (SELECT public.rbac_get_my_org_ids()));
```

### 9.2 Tabele fără organization_id direct (pattern-uri speciale)

```sql
-- ============================================================
-- SECȚIUNEA 9.2: RLS PE TABELE CU PATTERN-URI SPECIALE
-- ============================================================

-- ────────────────────────────────────────────
-- 9.2.1 profiles — user vede profilul propriu + colegii din org
-- ────────────────────────────────────────────
CREATE POLICY rbac_profiles_select ON public.profiles
  FOR SELECT TO authenticated
  USING (
    id = auth.uid()
    OR id IN (
      SELECT ur2.user_id FROM public.user_roles ur2
      WHERE ur2.company_id IN (SELECT public.rbac_get_my_org_ids())
        AND ur2.is_active = true
    )
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_profiles_update ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- ────────────────────────────────────────────
-- 9.2.2 jurisdictions — toți citesc, consultant/admin modifică
-- ────────────────────────────────────────────
CREATE POLICY rbac_jurisdictions_select ON public.jurisdictions
  FOR SELECT TO authenticated
  USING (true);  -- date publice (ITM-uri)

CREATE POLICY rbac_jurisdictions_insert ON public.jurisdictions
  FOR INSERT TO authenticated
  WITH CHECK (
    public.rbac_has_role('consultant_ssm')
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_jurisdictions_update ON public.jurisdictions
  FOR UPDATE TO authenticated
  USING (
    public.rbac_has_role('consultant_ssm')
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_jurisdictions_delete ON public.jurisdictions
  FOR DELETE TO authenticated
  USING (
    public.rbac_has_role('consultant_ssm')
    OR public.rbac_is_super_admin()
  );

-- ────────────────────────────────────────────
-- 9.2.3 authorities — read-only public (date referință)
-- ────────────────────────────────────────────
CREATE POLICY rbac_authorities_select ON public.authorities
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY rbac_authorities_write ON public.authorities
  FOR ALL TO authenticated
  USING (public.rbac_is_super_admin());

-- ────────────────────────────────────────────
-- 9.2.4 penalty_rules — read public, write consultant/admin
-- ────────────────────────────────────────────
CREATE POLICY rbac_penalty_rules_select ON public.penalty_rules
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY rbac_penalty_rules_write ON public.penalty_rules
  FOR ALL TO authenticated
  USING (
    public.rbac_has_role('consultant_ssm')
    OR public.rbac_is_super_admin()
  );

-- ────────────────────────────────────────────
-- 9.2.5 training_modules — read public, write consultant/admin
-- ────────────────────────────────────────────
CREATE POLICY rbac_training_modules_select ON public.training_modules
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY rbac_training_modules_write ON public.training_modules
  FOR ALL TO authenticated
  USING (
    public.rbac_has_role('consultant_ssm')
    OR public.rbac_is_super_admin()
  );

-- ────────────────────────────────────────────
-- 9.2.6 test_questions — read public, write consultant/admin
-- ────────────────────────────────────────────
CREATE POLICY rbac_test_questions_select ON public.test_questions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY rbac_test_questions_write ON public.test_questions
  FOR ALL TO authenticated
  USING (
    public.rbac_has_role('consultant_ssm')
    OR public.rbac_is_super_admin()
  );

-- ────────────────────────────────────────────
-- 9.2.7 training_assignments — acces prin organization_id JOIN
-- ────────────────────────────────────────────
CREATE POLICY rbac_training_assignments_select ON public.training_assignments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.id = training_assignments.employee_id
        AND e.organization_id IN (SELECT public.rbac_get_my_org_ids())
    )
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_training_assignments_write ON public.training_assignments
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.id = training_assignments.employee_id
        AND e.organization_id IN (SELECT public.rbac_get_my_org_ids())
    )
    OR public.rbac_is_super_admin()
  );

-- ────────────────────────────────────────────
-- 9.2.8 training_sessions — acces prin organization_id JOIN
-- ────────────────────────────────────────────
CREATE POLICY rbac_training_sessions_select ON public.training_sessions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.training_assignments ta
      JOIN public.employees e ON e.id = ta.employee_id
      WHERE ta.id = training_sessions.assignment_id
        AND e.organization_id IN (SELECT public.rbac_get_my_org_ids())
    )
    OR public.rbac_is_super_admin()
  );

CREATE POLICY rbac_training_sessions_write ON public.training_sessions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.training_assignments ta
      JOIN public.employees e ON e.id = ta.employee_id
      WHERE ta.id = training_sessions.assignment_id
        AND e.organization_id IN (SELECT public.rbac_get_my_org_ids())
    )
    OR public.rbac_is_super_admin()
  );

-- ────────────────────────────────────────────
-- 9.2.9 audit_log
-- ────────────────────────────────────────────
CREATE POLICY rbac_audit_log_select ON public.audit_log
  FOR SELECT TO authenticated
  USING (
    organization_id IN (SELECT public.rbac_get_my_org_ids())
    OR public.rbac_is_super_admin()
  );

-- ────────────────────────────────────────────
-- 9.2.10 REGES — tabele cu JOIN-uri nested
-- ────────────────────────────────────────────

-- reges_transmissions (dacă are organization_id)
-- ⚠️ VERIFICĂ schema reală. Dacă are organization_id:
-- CREATE POLICY rbac_reges_trans_select ON public.reges_transmissions
--   FOR SELECT TO authenticated
--   USING (organization_id IN (SELECT public.rbac_get_my_org_ids()));

-- reges_nomenclatures — date referință, read public
CREATE POLICY rbac_reges_nomenclatures_select ON public.reges_nomenclatures
  FOR SELECT TO authenticated
  USING (true);

-- reges_employee_snapshots — prin organization_id
-- ⚠️ VERIFICĂ dacă tabelul are organization_id direct
-- CREATE POLICY rbac_reges_snapshots_select ON public.reges_employee_snapshots
--   FOR SELECT TO authenticated
--   USING (organization_id IN (SELECT public.rbac_get_my_org_ids()));

-- reges_audit_log — prin organization_id
-- ⚠️ VERIFICĂ dacă tabelul are organization_id direct
-- CREATE POLICY rbac_reges_audit_select ON public.reges_audit_log
--   FOR SELECT TO authenticated
--   USING (organization_id IN (SELECT public.rbac_get_my_org_ids()));
```

⚠️ **ATENȚIE REGES:** Din query3_result.csv, tabelele REGES actuale sunt: `reges_connections`, `reges_outbox`, `reges_receipts`, `reges_results`. Schema din DOC1 menționează: `reges_connections`, `reges_transmissions`, `reges_nomenclatures`, `reges_employee_snapshots`, `reges_audit_log`. **Discrepanță** — rulează `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'reges%';` pentru a verifica care tabele REGES există efectiv.

### 9.3 Script cleanup — ștergere policies vechi (DUPĂ 30 ZILE TESTARE)

```sql
-- ============================================================
-- SECȚIUNEA 9.3: CLEANUP POLICIES VECHI
-- ⚠️ EXECUTĂ DOAR DUPĂ 30 ZILE DE TESTARE CU RBAC NOU
-- ⚠️ VERIFICĂ CĂ TOTUL FUNCȚIONEAZĂ ÎNAINTE
-- ============================================================

-- Generare automată — listare policies vechi (non-rbac):
-- SELECT tablename, policyname
-- FROM pg_policies
-- WHERE schemaname = 'public'
--   AND policyname NOT LIKE 'rbac_%'
-- ORDER BY tablename, policyname;

-- Apoi DROP POLICY <name> ON <table>; pentru fiecare

-- Exemplu (NU executa acum):
-- DROP POLICY IF EXISTS org_select_own ON public.organizations;
-- DROP POLICY IF EXISTS org_insert_consultant ON public.organizations;
-- DROP POLICY IF EXISTS org_update_admin ON public.organizations;
-- DROP POLICY IF EXISTS org_delete_consultant ON public.organizations;
-- ... etc pentru TOATE cele 60+ policies vechi
```

### 9.4 Script verificare post-migrare

```sql
-- ============================================================
-- SECȚIUNEA 9.4: VERIFICARE POST-MIGRARE
-- Rulează DUPĂ executarea secțiunilor 8.1-9.2
-- ============================================================

-- 1. Verifică tabelele RBAC create
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('roles', 'permissions', 'user_roles')
ORDER BY table_name;
-- Așteptat: 3 rânduri

-- 2. Verifică rolurile populate
SELECT role_key, role_name, country_code, is_system
FROM public.roles ORDER BY is_system DESC, country_code NULLS FIRST, role_key;
-- Așteptat: 27 rânduri

-- 3. Verifică permisiunile
SELECT r.role_key, COUNT(p.id) as nr_permissions
FROM public.roles r
LEFT JOIN public.permissions p ON p.role_id = r.id
GROUP BY r.role_key
ORDER BY nr_permissions DESC;
-- Așteptat: super_admin ~114, consultant_ssm ~75, firma_admin ~13, angajat ~5

-- 4. Verifică migrarea user_roles
SELECT ur.user_id, r.role_key, ur.company_id, ur.is_active
FROM public.user_roles ur
JOIN public.roles r ON r.id = ur.role_id
ORDER BY ur.user_id;
-- Așteptat: 3 rânduri (consultant→consultant_ssm, consultant→super_admin, firma_admin→firma_admin)

-- 5. Verifică funcțiile helper
SELECT public.rbac_is_super_admin();
SELECT public.rbac_has_role('consultant_ssm');
SELECT * FROM public.rbac_get_my_org_ids();

-- 6. Verifică RLS ENABLED pe tabelele noi
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('roles', 'permissions', 'user_roles');
-- Așteptat: toate cu rowsecurity = true

-- 7. Verifică policies rbac_ create
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND policyname LIKE 'rbac_%'
ORDER BY tablename, policyname;
-- Așteptat: 50+ policies noi

-- 8. Test cross-org isolation (CRITICAL)
-- Conectează-te ca firma_admin și verifică că NU vede alte organizații:
-- SELECT * FROM organizations; → trebuie să returneze DOAR firma lui
```

---

## SECȚIUNEA 10 — INSTRUCȚIUNI CLAUDE CODE PENTRU NEXT.JS

### 10.1 Ordine execuție

```
ZIUA 1 (Luni 10 Feb):
  → Secțiunile 8.1-8.6 în Supabase SQL Editor
  → Secțiunea 8.4 (migrare date)
  → Secțiunea 9.4 (verificare)
  → Task 10.2 (lib/rbac.ts)

ZIUA 2 (Marți 11 Feb):
  → Task 10.3 (middleware.ts)
  → Task 10.4 (hook usePermission)

ZIUA 3 (Miercuri 12 Feb):
  → Secțiunile 9.1-9.2 în Supabase SQL Editor
  → Secțiunea 9.4 (re-verificare)
  → Task 10.5 (actualizare componente existente)

ZIUA 4 (Joi 13 Feb):
  → Task 10.6 (Admin UI /admin/roles)

ZIUA 5 (Vineri 14 Feb):
  → Teste complete (DOC3 checklist)
  → Cleanup + documentare
```

### 10.2 Claude Code — lib/rbac.ts

```
Prompt Claude Code:

Creează fișierul lib/rbac.ts în proiectul Next.js s-s-m-app.
Stack: Next.js 14 App Router + Supabase.
Supabase client: @supabase/ssr (createServerClient / createBrowserClient).

FIȘIER: lib/rbac.ts

Conținut:

import { createServerClient } from '@/lib/supabase/server';
import { cache } from 'react';

// ── Tipuri ──
export type RoleKey = 
  | 'super_admin' | 'consultant_ssm' | 'firma_admin' | 'angajat'
  | 'partener_contabil' | 'furnizor_psi' | 'furnizor_iscir'
  | 'medic_mm' | 'auditor_extern' | 'inspector_itm' | 'inspector_igsu'
  | 'inspector_anspdcp' | 'lucrator_desemnat' | 'white_label_stm'
  | 'responsabil_ssm_intern' | 'training_provider' | 'responsabil_nis2'
  | 'zbut_consultant_bg' | 'inspector_git_bg' | 'stm_partner_bg'
  | 'munkavedelmi_hu' | 'inspector_ommf_hu'
  | 'sicherheitsingenieur_de' | 'betriebsarzt_de' | 'berufsgenossenschaft_de'
  | 'specjalista_bhp_pl' | 'inspector_pip_pl'
  | string;  // extensibil pentru roluri viitoare

export type Resource = 
  | 'organizations' | 'employees' | 'locations' | 'equipment'
  | 'medical' | 'trainings' | 'documents' | 'alerts'
  | 'dashboard' | 'reports' | 'fraud' | 'jurisdictions'
  | 'roles_admin' | 'reges' | 'memberships' | 'profiles'
  | 'notifications' | 'penalties' | 'audit_log'
  | string;

export type Action = 'create' | 'read' | 'update' | 'delete' | 'export' | 'delegate';

export interface UserRole {
  role_key: RoleKey;
  role_name: string;
  company_id: string | null;
  location_id: string | null;
  expires_at: string | null;
  is_active: boolean;
  country_code: string | null;
}

export interface Permission {
  resource: Resource;
  action: Action;
  field_restrictions: Record<string, string>;
  conditions: Record<string, any>;
}

// ── Funcții server-side (React cache per request) ──

// Returnează rolurile active ale userului curent
export const getMyRoles = cache(async (): Promise<UserRole[]> => {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      role_id,
      company_id,
      location_id,
      expires_at,
      is_active,
      roles!inner (
        role_key,
        role_name,
        country_code,
        is_active
      )
    `)
    .eq('user_id', user.id)
    .eq('is_active', true)
    .eq('roles.is_active', true);

  if (error || !data) {
    // FALLBACK pe memberships
    const { data: memberships } = await supabase
      .from('memberships')
      .select('role, organization_id, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (!memberships) return [];

    return memberships.map(m => ({
      role_key: m.role === 'consultant' ? 'consultant_ssm' : m.role as RoleKey,
      role_name: m.role,
      company_id: m.organization_id,
      location_id: null,
      expires_at: null,
      is_active: true,
      country_code: null,
    }));
  }

  return data
    .filter(d => !d.expires_at || new Date(d.expires_at) > new Date())
    .map(d => ({
      role_key: (d.roles as any).role_key,
      role_name: (d.roles as any).role_name,
      company_id: d.company_id,
      location_id: d.location_id,
      expires_at: d.expires_at,
      is_active: d.is_active,
      country_code: (d.roles as any).country_code,
    }));
});

// Verifică dacă userul are un rol specific
export const hasRole = cache(async (roleKey: RoleKey): Promise<boolean> => {
  const roles = await getMyRoles();
  return roles.some(r => r.role_key === roleKey);
});

// Verifică dacă userul e super admin
export const isSuperAdmin = cache(async (): Promise<boolean> => {
  return hasRole('super_admin');
});

// Verifică permisiune granulară (resource × action)
export const hasPermission = cache(async (resource: Resource, action: Action): Promise<boolean> => {
  if (await isSuperAdmin()) return true;

  const supabase = await createServerClient();
  const roles = await getMyRoles();
  const roleKeys = roles.map(r => r.role_key);

  const { data } = await supabase
    .from('permissions')
    .select('id, role_id, roles!inner(role_key)')
    .eq('resource', resource)
    .eq('action', action)
    .eq('is_active', true)
    .in('roles.role_key', roleKeys);

  return (data?.length ?? 0) > 0;
});

// Returnează field_restrictions pentru un resource
export const getFieldRestrictions = cache(async (resource: Resource): Promise<Record<string, string>> => {
  if (await isSuperAdmin()) return {};

  const supabase = await createServerClient();
  const roles = await getMyRoles();
  const roleKeys = roles.map(r => r.role_key);

  const { data } = await supabase
    .from('permissions')
    .select('field_restrictions, roles!inner(role_key)')
    .eq('resource', resource)
    .eq('is_active', true)
    .in('roles.role_key', roleKeys);

  // Merge restrictions — cel mai permisiv câștigă
  const merged: Record<string, string> = {};
  data?.forEach(d => {
    const fr = d.field_restrictions as Record<string, string>;
    Object.entries(fr).forEach(([field, level]) => {
      if (!merged[field] || level === 'visible') {
        merged[field] = level;
      }
    });
  });

  return merged;
});

// Returnează organizațiile accesibile
export const getMyOrgIds = cache(async (): Promise<string[]> => {
  const roles = await getMyRoles();
  if (roles.some(r => r.role_key === 'super_admin')) {
    const supabase = await createServerClient();
    const { data } = await supabase.from('organizations').select('id');
    return data?.map(o => o.id) ?? [];
  }
  return [...new Set(roles.map(r => r.company_id).filter(Boolean) as string[])];
});

// Returnează rolul principal (pentru rutare)
export const getPrimaryRole = cache(async (): Promise<RoleKey | null> => {
  const roles = await getMyRoles();
  if (!roles.length) return null;
  
  // Prioritate: super_admin > consultant > firma_admin > angajat > restul
  const priority: RoleKey[] = ['super_admin', 'consultant_ssm', 'firma_admin', 'angajat'];
  for (const p of priority) {
    if (roles.some(r => r.role_key === p)) return p;
  }
  return roles[0].role_key;
});
```

### 10.3 Claude Code — middleware.ts actualizare

```
Prompt Claude Code:

Actualizează middleware.ts în proiectul s-s-m-app pentru autorizare dinamică RBAC.
NU șterge logica existentă — adaugă verificare ÎN PARALEL.

PRINCIPIU:
1. Verifică sesiunea Supabase (existent)
2. Dacă rută protejată → verifică rol din user_roles (NOU)
3. Fallback pe memberships dacă user_roles returnează gol
4. Redirect 403 dacă fără acces

RUTE PROTEJATE:
  /admin/*     → necesită super_admin
  /consultant/* → necesită consultant_ssm SAU echivalent per țară (zbut_consultant_bg, munkavedelmi_hu, sicherheitsingenieur_de, specjalista_bhp_pl)
  /firma/*     → necesită firma_admin SAU lucrator_desemnat SAU responsabil_ssm_intern
  /angajat/*   → necesită angajat (orice user autentificat are minim acest acces)
  /inspector/* → necesită inspector_itm SAU inspector_igsu SAU inspector_anspdcp SAU echivalente
  /dashboard   → orice user autentificat

FALLBACK:
  Dacă user_roles query returnează 0 rânduri → citește memberships.role
  Mapare: 'consultant' → 'consultant_ssm', 'firma_admin' → 'firma_admin', 'angajat' → 'angajat'

IMPLEMENTARE:
  - Creează funcție getRolesFromSupabase(supabase, userId) care:
    1. Query user_roles JOIN roles WHERE is_active AND NOT expired
    2. Dacă 0 rezultate → query memberships WHERE is_active
    3. Returnează string[] cu role_keys
  - Folosește cache-ul edge cu max-age scurt (60s) pentru performance
  - La 403 → redirect la /unauthorized (creează pagina)

Creează și: app/unauthorized/page.tsx
  - Mesaj: "Nu aveți acces la această pagină"
  - Buton "Înapoi la Dashboard"
  - Tailwind, consistent cu restul aplicației
```

### 10.4 Claude Code — Hook client-side usePermission

```
Prompt Claude Code:

Creează hooks/usePermission.ts — hook React client-side pentru verificare permisiuni RBAC.

FIȘIER: hooks/usePermission.ts

Funcționalități:
1. useMyRoles() → { roles: UserRole[], isLoading: boolean, error: Error | null }
   - Fetch din Supabase client-side: user_roles JOIN roles
   - Fallback pe memberships dacă user_roles gol
   - Cache cu SWR pattern (revalidate la 5 minute)

2. useHasRole(roleKey: string) → boolean
   - Derivat din useMyRoles()

3. useHasPermission(resource: string, action: string) → boolean
   - Query permissions tabel client-side
   - Super admin bypass

4. useIsSuperAdmin() → boolean

5. useFieldRestrictions(resource: string) → Record<string, string>
   - Returnează câmpuri mascate/ascunse

REGULI:
- Folosește createBrowserClient din @/lib/supabase/client
- useSWR sau useState + useEffect (nu SWR extern dacă nu e instalat)
- Export types din lib/rbac.ts (shared)
- Toate hook-urile returnează stare de loading
```

### 10.5 Claude Code — Actualizare componente existente

```
Prompt Claude Code:

Actualizează componentele existente din s-s-m-app să folosească RBAC dinamic.

FIȘIERE DE MODIFICAT (verifică că există, raportează dacă nu):

1. Dashboard consultant (probabil app/dashboard/page.tsx sau app/consultant/page.tsx):
   - Adaugă: import { hasRole, isSuperAdmin } from '@/lib/rbac';
   - Verifică: dacă user e consultant_ssm SAU super_admin
   - Arată organizațiile din getMyOrgIds()

2. Dashboard firmă (app/firma/* sau similar):
   - Verifică: firma_admin pe organizația curentă
   - Filtrează datele cu getMyOrgIds()

3. Componente cu butoane CRUD:
   - Wrap butoanele Create/Delete cu verificare hasPermission
   - Exemplu: {await hasPermission('employees', 'delete') && <DeleteButton />}

4. Layout-uri cu navigație:
   - Menu items condiționate de rol:
     - "Admin" → doar super_admin
     - "Rapoarte" → consultant_ssm + super_admin
     - "Instrucția mea" → angajat

REGULI:
- NU șterge cod existent care funcționează
- Adaugă verificarea RBAC ÎN PLUS
- Păstrează backward compatibility cu memberships
- Comentează clar: // RBAC: verificare nouă
- Dacă un fișier nu există la calea așteptată, raportează și întreabă
```

### 10.6 Claude Code — Admin UI /admin/roles

```
Prompt Claude Code:

Creează interfața Admin pentru managementul rolurilor RBAC.
Stack: Next.js 14 App Router, Tailwind CSS, Supabase.
DOAR super_admin accesează /admin/*.

FIȘIERE DE CREAT:

1. app/admin/roles/page.tsx — Lista rolurilor
   - Tabel cu: role_key, role_name, country_code, is_system, is_active, nr_permissions
   - Filtrare per țară (dropdown: Toate / RO / BG / HU / DE / PL)
   - Filtrare per tier (din metadata.tier)
   - Buton "Adaugă Rol Nou" → /admin/roles/new
   - Click pe rol → /admin/roles/[id]
   - Badge-uri: 🟢 activ, 🔴 inactiv, 🔒 system
   - Contorizare permisiuni per rol

2. app/admin/roles/[id]/page.tsx — Editare rol
   - Formular editare: role_name, description, country_code, is_active
   - Secțiune PERMISIUNI: matrice resource × action cu checkboxes
     - Resurse pe rânduri: organizations, employees, locations, equipment, medical, trainings, documents, alerts, dashboard, reports, fraud, jurisdictions, reges, notifications, memberships
     - Acțiuni pe coloane: create, read, update, delete, export, delegate
     - Checkbox bifat = permisiune activă
   - Câmp conditions (JSONB editor simplu — textarea cu validare JSON)
   - Câmp field_restrictions (JSONB editor simplu)
   - Buton "Salvează" → update role + upsert permissions
   - Buton "Dezactivează" (is_active = false) — NU șterge
   - is_system = true → NU se poate dezactiva/șterge

3. app/admin/roles/new/page.tsx — Creare rol nou
   - Formular: role_key (auto-generated din role_name, editabil), role_name, description, country_code (dropdown), metadata
   - După creare → redirect la /admin/roles/[id] pentru setare permisiuni
   - Validare: role_key unic

4. app/admin/roles/assign/page.tsx — Asignare roluri la useri
   - Dropdown user (search din profiles)
   - Dropdown rol (din roles)
   - Dropdown company (din organizations, opțional)
   - Dropdown location (din locations, opțional, filtrat per company)
   - expires_at (date picker, opțional)
   - Tabel cu asignările existente: user, rol, company, expires_at, buton remove
   - Buton "Asignează"

DESIGN:
- Tailwind consistent cu dashboardul existent
- Responsive (mobile-friendly)
- Loading states pe toate fetch-urile
- Error handling cu toast notifications
- Confirmare pe acțiuni destructive (dezactivare, ștergere asignare)

GUARD:
- Fiecare pagină verifică: const admin = await isSuperAdmin(); if (!admin) redirect('/unauthorized');
- Server-side verification (nu doar client-side)
```

---

## SECȚIUNEA 11 — CHECKLIST POST-IMPLEMENTARE

### 11.1 Teste funcționale

| # | Test | Cum verifici | ✅/❌ |
|---|------|-------------|-------|
| 1 | Login super_admin → vede TOT | Dashboard + /admin/roles accesibil | |
| 2 | Login consultant → vede firmele alocate | Dashboard arată doar firmele din user_roles | |
| 3 | Login firma_admin → vede doar firma lui | `SELECT * FROM organizations;` returnează 1 | |
| 4 | Login angajat → vede doar datele proprii | Dashboard personal, instruiri proprii | |
| 5 | Creare rol nou din Admin UI | /admin/roles/new → salvează → apare în listă | |
| 6 | Setare permisiuni din checkboxes | /admin/roles/[id] → bifează → salvează | |
| 7 | Asignare rol la user | /admin/roles/assign → selectează → salvează | |
| 8 | Dezactivare rol → pierde acces instant | is_active = false → user pierde acces | |
| 9 | expires_at → dezactivare automată | Setează expires_at = acum → pierde acces | |
| 10 | Cross-org isolation (CRITIC) | firma_admin NU vede altă firmă (test SQL direct) | |
| 11 | Fallback pe memberships funcționează | Șterge user_roles → memberships preia | |
| 12 | RLS pe tabelele noi (roles, permissions, user_roles) | Check Supabase Dashboard | |
| 13 | Screenshot: Supabase → RLS ENABLED pe toate | 28 tabele cu ✅ | |

### 11.2 Queries verificare rapidă

```sql
-- Câte roluri sunt?
SELECT COUNT(*) FROM roles; -- 27

-- Câte permisiuni per rol?
SELECT r.role_key, COUNT(p.id) FROM roles r LEFT JOIN permissions p ON p.role_id = r.id GROUP BY r.role_key ORDER BY COUNT DESC;

-- Câte user_roles?
SELECT ur.user_id, r.role_key, ur.company_id FROM user_roles ur JOIN roles r ON r.id = ur.role_id;

-- Policies RBAC noi vs. vechi?
SELECT
  COUNT(*) FILTER (WHERE policyname LIKE 'rbac_%') AS rbac_new,
  COUNT(*) FILTER (WHERE policyname NOT LIKE 'rbac_%') AS legacy
FROM pg_policies WHERE schemaname = 'public';
```

---

## SECȚIUNEA 12 — TIMELINE EXECUȚIE

```
                    LUNI 10 FEB
                    ┌─────────────────────────────────────┐
                    │ ✅ SQL 8.1-8.6 în Supabase Editor   │
                    │ ✅ Migrare date (8.4)               │
                    │ ✅ Verificare (9.4)                  │
                    │ ✅ lib/rbac.ts (10.2)                │
                    └─────────────┬───────────────────────┘
                                  ↓
                    MARȚI 11 FEB
                    ┌─────────────────────────────────────┐
                    │ ✅ middleware.ts (10.3)              │
                    │ ✅ hooks/usePermission.ts (10.4)     │
                    │ ✅ /unauthorized page                │
                    └─────────────┬───────────────────────┘
                                  ↓
                    MIERCURI 12 FEB
                    ┌─────────────────────────────────────┐
                    │ ✅ RLS policies 9.1-9.2 în Supabase │
                    │ ✅ Re-verificare (9.4)              │
                    │ ✅ Actualizare componente (10.5)     │
                    └─────────────┬───────────────────────┘
                                  ↓
                    JOI 13 FEB
                    ┌─────────────────────────────────────┐
                    │ ✅ Admin UI /admin/roles (10.6)     │
                    │   - Lista roluri                    │
                    │   - Editare + matrice permisiuni    │
                    │   - Creare rol nou                  │
                    │   - Asignare roluri                 │
                    └─────────────┬───────────────────────┘
                                  ↓
                    VINERI 14 FEB
                    ┌─────────────────────────────────────┐
                    │ ✅ Checklist teste (11.1)           │
                    │ ✅ Cleanup + documentare            │
                    │ ✅ Screenshot RLS ENABLED           │
                    └─────────────────────────────────────┘
                                  ↓
              DUPĂ 30 ZILE → Cleanup policies vechi (9.3)
              DUPĂ 30 ZILE → DROP memberships.role fallback din funcții
```

---

> **NOTĂ:** Acest document completează DOC3 v4.1 secțiunile 8-9 cu SQL executabil + instrucțiuni Claude Code complete. Fiecare secțiune SQL se execută independent în Supabase SQL Editor. Funcțiile `rbac_*` au fallback pe `memberships` — zero downtime la migrare.
