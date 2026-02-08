-- ============================================================================
-- s-s-m.ro — MIGRARE RBAC DINAMIC (CORECTAT pe baza DOC1 v8.1)
-- Versiune: 1.1.0 | Data: 2026-02-08
-- ============================================================================
-- CORECȚII vs v1.0:
--   - Tabele reale: organizations (nu companies), memberships, profiles
--   - field_restrictions format: {"cnp":"masked","salary":"hidden"} 
--   - Migrare din memberships.role (nu profiles.role)
--   - Resources mapate pe cele 25 tabele existente
-- ============================================================================
-- ORDINE EXECUȚIE: 
--   1. BACKUP (pg_dump sau Supabase Dashboard)
--   2. SECȚIUNILE 1-4: Schema + Funcții (safe, nu atinge date existente)
--   3. SECȚIUNEA 5: Populare roluri (idempotent cu ON CONFLICT)
--   4. SECȚIUNEA 6: Populare permisiuni (idempotent)
--   5. SECȚIUNEA 7: RLS pe tabelele RBAC noi
--   6. SECȚIUNEA 8: Migrare date (DUPĂ VERIFICARE MANUALĂ)
--   7. SECȚIUNEA 9: Actualizare RLS pe tabelele existente (ATENT!)
-- ============================================================================

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ SECȚIUNEA 0: EXTENSII                                                  ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ SECȚIUNEA 1: TABEL ROLES                                               ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS public.roles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_key        TEXT NOT NULL,
    role_name       TEXT NOT NULL,
    description     TEXT,
    country_code    TEXT DEFAULT NULL,       -- NULL = global, 'RO'/'BG'/'HU'/'DE'/'PL'
    is_system       BOOLEAN NOT NULL DEFAULT false,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_by      UUID REFERENCES auth.users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    metadata        JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT roles_key_country_unique UNIQUE (role_key, country_code)
);

CREATE INDEX IF NOT EXISTS idx_roles_key ON public.roles(role_key);
CREATE INDEX IF NOT EXISTS idx_roles_country ON public.roles(country_code);
CREATE INDEX IF NOT EXISTS idx_roles_active ON public.roles(is_active) WHERE is_active = true;

-- Trigger updated_at (reusable)
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_roles_updated_at ON public.roles;
CREATE TRIGGER set_roles_updated_at
    BEFORE UPDATE ON public.roles
    FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ SECȚIUNEA 2: TABEL PERMISSIONS                                         ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS public.permissions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id             UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    resource            TEXT NOT NULL,
    action              TEXT NOT NULL,       -- create/read/update/delete/export/delegate/approve/sign
    field_restrictions  JSONB DEFAULT NULL,  -- Format DOC1: {"cnp":"masked","salary":"hidden","email":"read_only"}
    conditions          JSONB DEFAULT NULL,  -- {"own_company_only":true,"assigned_orgs_only":true}
    country_code        TEXT DEFAULT NULL,
    is_active           BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT permissions_unique UNIQUE (role_id, resource, action, country_code)
);

CREATE INDEX IF NOT EXISTS idx_perm_role ON public.permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_perm_resource_action ON public.permissions(resource, action);
CREATE INDEX IF NOT EXISTS idx_perm_active ON public.permissions(is_active) WHERE is_active = true;

DROP TRIGGER IF EXISTS set_permissions_updated_at ON public.permissions;
CREATE TRIGGER set_permissions_updated_at
    BEFORE UPDATE ON public.permissions
    FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ SECȚIUNEA 3: TABEL USER_ROLES                                          ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS public.user_roles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id         UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    organization_id UUID DEFAULT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    location_id     UUID DEFAULT NULL REFERENCES public.locations(id) ON DELETE SET NULL,
    granted_by      UUID REFERENCES auth.users(id),
    granted_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at      TIMESTAMPTZ DEFAULT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    metadata        JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT user_roles_unique UNIQUE (user_id, role_id, organization_id, location_id)
);

CREATE INDEX IF NOT EXISTS idx_ur_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_ur_role ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_ur_org ON public.user_roles(organization_id);
CREATE INDEX IF NOT EXISTS idx_ur_user_active ON public.user_roles(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_ur_expires ON public.user_roles(expires_at) WHERE expires_at IS NOT NULL;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ SECȚIUNEA 4: FUNCȚII HELPER RBAC                                       ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- 4.1: has_permission — verifică permisiune curentă
CREATE OR REPLACE FUNCTION public.has_permission(
    p_resource TEXT,
    p_action TEXT,
    p_organization_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.roles r ON r.id = ur.role_id AND r.is_active = true
        JOIN public.permissions p ON p.role_id = r.id AND p.is_active = true
        WHERE ur.user_id = auth.uid()
          AND ur.is_active = true
          AND (ur.expires_at IS NULL OR ur.expires_at > now())
          AND p.resource = p_resource
          AND p.action = p_action
          AND (ur.organization_id IS NULL OR ur.organization_id = p_organization_id OR p_organization_id IS NULL)
    );
$$;

-- 4.2: has_role — verifică rol specific
CREATE OR REPLACE FUNCTION public.has_role(p_role_key TEXT)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.roles r ON r.id = ur.role_id
        WHERE ur.user_id = auth.uid()
          AND r.role_key = p_role_key
          AND r.is_active = true
          AND ur.is_active = true
          AND (ur.expires_at IS NULL OR ur.expires_at > now())
    );
$$;

-- 4.3: is_super_admin — shortcut (folosit intens în RLS)
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.roles r ON r.id = ur.role_id
        WHERE ur.user_id = auth.uid()
          AND r.role_key = 'super_admin'
          AND r.is_active = true
          AND ur.is_active = true
          AND (ur.expires_at IS NULL OR ur.expires_at > now())
    );
$$;

-- 4.4: get_user_permissions — toate permisiunile (pentru frontend)
CREATE OR REPLACE FUNCTION public.get_user_permissions()
RETURNS TABLE (
    role_key TEXT,
    role_name TEXT,
    resource TEXT,
    action TEXT,
    field_restrictions JSONB,
    conditions JSONB,
    organization_id UUID,
    location_id UUID
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT r.role_key, r.role_name, p.resource, p.action,
           p.field_restrictions, p.conditions, ur.organization_id, ur.location_id
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id AND r.is_active = true
    JOIN public.permissions p ON p.role_id = r.id AND p.is_active = true
    WHERE ur.user_id = auth.uid()
      AND ur.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > now());
$$;

-- 4.5: check_permission — debug/admin detaliat
CREATE OR REPLACE FUNCTION public.check_permission(
    p_user_id UUID,
    p_resource TEXT,
    p_action TEXT
)
RETURNS TABLE (
    has_access BOOLEAN,
    via_role TEXT,
    field_restrictions JSONB,
    conditions JSONB,
    organization_scope UUID,
    expires_at TIMESTAMPTZ
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT true, r.role_key, p.field_restrictions, p.conditions,
           ur.organization_id, ur.expires_at
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id AND r.is_active = true
    JOIN public.permissions p ON p.role_id = r.id AND p.is_active = true
    WHERE ur.user_id = p_user_id
      AND ur.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
      AND p.resource = p_resource
      AND p.action = p_action;
$$;

-- 4.6: get_user_org_ids — organizațiile la care userul are acces
CREATE OR REPLACE FUNCTION public.get_user_org_ids()
RETURNS SETOF UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT DISTINCT ur.organization_id
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id AND r.is_active = true
    WHERE ur.user_id = auth.uid()
      AND ur.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
      AND ur.organization_id IS NOT NULL;
$$;

-- 4.7: cleanup_expired_roles — pentru cron job
CREATE OR REPLACE FUNCTION public.cleanup_expired_roles()
RETURNS INTEGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_count INTEGER;
BEGIN
    UPDATE public.user_roles SET is_active = false
    WHERE expires_at IS NOT NULL AND expires_at < now() AND is_active = true;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ SECȚIUNEA 5: POPULARE 17 ROLURI GLOBALE + ROLURI PER ȚARĂ             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

INSERT INTO public.roles (role_key, role_name, description, country_code, is_system, metadata) VALUES

-- TIER 1 — LIVE (4 existente, migrate la dinamic)
('super_admin',         'Super Admin',              'Acces total platformă, CRUD roluri + permisiuni',  NULL, true,  '{"icon":"shield","color":"#DC2626","sort":1}'::jsonb),
('consultant_ssm',      'Consultant SSM',           'Consultant extern — gestionează multiple organizații client', NULL, true,  '{"icon":"hard-hat","color":"#2563EB","sort":2}'::jsonb),
('firma_admin',         'Firma Admin',              'Administrator organizație — acces complet org proprie', NULL, true,  '{"icon":"building","color":"#059669","sort":3}'::jsonb),
('angajat',             'Angajat',                  'Angajat — read-only documente proprii + training', NULL, true,  '{"icon":"user","color":"#6B7280","sort":4}'::jsonb),

-- TIER 2 — PLANIFICATE (13 noi)
('partener_contabil',   'Partener Contabil',        'Acces rapoarte financiare firme afiliate',         NULL, false, '{"icon":"calculator","color":"#8B5CF6","sort":5}'::jsonb),
('furnizor_psi',        'Furnizor PSI',             'Furnizor echipamente PSI — acces stingătoare, hidranți', NULL, false, '{"icon":"flame","color":"#F97316","sort":6}'::jsonb),
('furnizor_iscir_rsvti', 'Furnizor ISCIR/RSVTI',   'Responsabil ISCIR — verificare echipamente sub presiune', NULL, false, '{"icon":"gauge","color":"#EF4444","sort":7}'::jsonb),
('medic_mm',            'Medic Medicina Muncii',    'Programări examene, fișe aptitudine',              NULL, false, '{"icon":"stethoscope","color":"#10B981","sort":8}'::jsonb),
('auditor_extern',      'Auditor Extern',           'Read-only temporar cu expirare automată',          NULL, false, '{"icon":"search","color":"#6366F1","sort":9}'::jsonb),
('inspector_itm',       'Inspector ITM',            'Inspector Inspectoratul Teritorial de Muncă',      NULL, false, '{"icon":"clipboard-check","color":"#B91C1C","sort":10}'::jsonb),
('inspector_igsu',      'Inspector IGSU',           'Inspector General Situații de Urgență — PSI',      NULL, false, '{"icon":"siren","color":"#DC2626","sort":11}'::jsonb),
('inspector_anspdcp',   'Inspector ANSPDCP',        'Inspector protecția datelor — audit GDPR',         NULL, false, '{"icon":"lock","color":"#7C3AED","sort":12}'::jsonb),
('lucrator_desemnat',   'Lucrător Desemnat',        'Angajat desemnat SSM intern (<50 ang.)',           NULL, false, '{"icon":"user-check","color":"#0891B2","sort":13}'::jsonb),
('white_label_stm',     'White-Label / STM',        'Partener STM — acces propriii clienți, branding propriu', NULL, false, '{"icon":"layers","color":"#4F46E5","sort":14}'::jsonb),
('responsabil_ssm_intern', 'Responsabil SSM Intern', 'SSM intern firmă mare cu dept. dedicat',          NULL, false, '{"icon":"shield-check","color":"#0D9488","sort":15}'::jsonb),
('training_provider',   'Training Provider',        'Furnizor extern instruire — marketplace cursuri',  NULL, false, '{"icon":"graduation-cap","color":"#A855F7","sort":16}'::jsonb),
('responsabil_nis2',    'Responsabil NIS2',         'Conformitate NIS2/cybersecurity',                  NULL, false, '{"icon":"wifi","color":"#1D4ED8","sort":17}'::jsonb)

ON CONFLICT (role_key, country_code) DO UPDATE SET
    role_name = EXCLUDED.role_name, description = EXCLUDED.description,
    metadata = EXCLUDED.metadata, is_active = true;

-- ROLURI PER ȚARĂ
INSERT INTO public.roles (role_key, role_name, description, country_code, is_system, metadata) VALUES
-- BG
('consultant_zbut',     'Консултант ЗБУТ',          'Consultant BG ЗБУТ',                'BG', false, '{"icon":"hard-hat","color":"#2563EB","sort":100}'::jsonb),
('inspector_git',       'Инспектор ГИТ',            'Inspector BG ГИТ',                  'BG', false, '{"icon":"clipboard-check","color":"#B91C1C","sort":101}'::jsonb),
('stm_partner_bg',      'STM Партньор',             'Partener STM BG',                   'BG', false, '{"icon":"layers","color":"#4F46E5","sort":102}'::jsonb),
-- HU
('munkavedelmi',        'Munkavédelmi Szakember',   'Specialist protecția muncii HU',    'HU', false, '{"icon":"hard-hat","color":"#2563EB","sort":110}'::jsonb),
('inspector_ommf',      'OMMF Felügyelő',           'Inspector HU OMMF',                 'HU', false, '{"icon":"clipboard-check","color":"#B91C1C","sort":111}'::jsonb),
-- DE
('sicherheitsingenieur', 'Sicherheitsingenieur',    'Inginer siguranță DE',              'DE', false, '{"icon":"hard-hat","color":"#2563EB","sort":120}'::jsonb),
('betriebsarzt',        'Betriebsarzt',             'Medic întreprindere DE',            'DE', false, '{"icon":"stethoscope","color":"#10B981","sort":121}'::jsonb),
('bg_pruefer',          'BG Prüfer',                'Auditor Berufsgenossenschaft DE',   'DE', false, '{"icon":"search","color":"#6366F1","sort":122}'::jsonb),
-- PL
('specjalista_bhp',     'Specjalista BHP',          'Specialist BHP PL',                 'PL', false, '{"icon":"hard-hat","color":"#2563EB","sort":130}'::jsonb),
('inspector_pip',       'Inspektor PIP',            'Inspector PIP PL',                  'PL', false, '{"icon":"clipboard-check","color":"#B91C1C","sort":131}'::jsonb)
ON CONFLICT (role_key, country_code) DO UPDATE SET
    role_name = EXCLUDED.role_name, description = EXCLUDED.description,
    metadata = EXCLUDED.metadata, is_active = true;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ SECȚIUNEA 6: PERMISIUNI — MAPATE PE CELE 25 TABELE REALE              ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- Resursele = tabelele din DOC1 §4:
-- organizations, profiles, memberships, employees, locations, jurisdictions,
-- medical_examinations, safety_equipment, training_modules, training_assignments,
-- training_sessions, test_questions, notification_log, alert_preferences,
-- generated_documents, fraud_alerts, organized_training_sessions,
-- authorities, penalty_rules, penalty_visibility,
-- reges_connections, reges_transmissions, reges_nomenclatures,
-- reges_employee_snapshots, reges_audit_log
-- + module viitoare: psi_documents, iscir_records, gdpr_records, nis2_compliance
-- + admin: roles, permissions, user_roles

-- ═════ SUPER ADMIN: ACCES TOTAL ═════
INSERT INTO public.permissions (role_id, resource, action)
SELECT r.id, res.r, act.a
FROM public.roles r
CROSS JOIN (VALUES 
    ('organizations'),('profiles'),('memberships'),('employees'),('locations'),
    ('jurisdictions'),('medical_examinations'),('safety_equipment'),
    ('training_modules'),('training_assignments'),('training_sessions'),
    ('test_questions'),('notification_log'),('alert_preferences'),
    ('generated_documents'),('fraud_alerts'),('organized_training_sessions'),
    ('authorities'),('penalty_rules'),('penalty_visibility'),
    ('reges_connections'),('reges_transmissions'),('reges_nomenclatures'),
    ('reges_employee_snapshots'),('reges_audit_log'),
    ('roles'),('permissions'),('user_roles')
) AS res(r)
CROSS JOIN (VALUES ('create'),('read'),('update'),('delete'),('export'),('approve')) AS act(a)
WHERE r.role_key = 'super_admin' AND r.country_code IS NULL
ON CONFLICT (role_id, resource, action, country_code) DO NOTHING;


-- ═════ CONSULTANT SSM ═════
INSERT INTO public.permissions (role_id, resource, action, conditions)
SELECT r.id, v.resource, v.action, v.cond::jsonb
FROM public.roles r, (VALUES 
    ('organizations',       'read',   '{"assigned_orgs_only": true}'),
    ('organizations',       'update', '{"assigned_orgs_only": true}'),
    ('employees',           'create', '{"assigned_orgs_only": true}'),
    ('employees',           'read',   '{"assigned_orgs_only": true}'),
    ('employees',           'update', '{"assigned_orgs_only": true}'),
    ('employees',           'export', '{"assigned_orgs_only": true}'),
    ('locations',           'read',   '{"assigned_orgs_only": true}'),
    ('locations',           'create', '{"assigned_orgs_only": true}'),
    ('medical_examinations','create', '{"assigned_orgs_only": true}'),
    ('medical_examinations','read',   '{"assigned_orgs_only": true}'),
    ('medical_examinations','update', '{"assigned_orgs_only": true}'),
    ('safety_equipment',    'create', '{"assigned_orgs_only": true}'),
    ('safety_equipment',    'read',   '{"assigned_orgs_only": true}'),
    ('safety_equipment',    'update', '{"assigned_orgs_only": true}'),
    ('training_modules',    'create', '{"assigned_orgs_only": true}'),
    ('training_modules',    'read',   '{"assigned_orgs_only": true}'),
    ('training_modules',    'update', '{"assigned_orgs_only": true}'),
    ('training_modules',    'delete', '{"assigned_orgs_only": true}'),
    ('training_assignments','create', '{"assigned_orgs_only": true}'),
    ('training_assignments','read',   '{"assigned_orgs_only": true}'),
    ('training_sessions',   'create', '{"assigned_orgs_only": true}'),
    ('training_sessions',   'read',   '{"assigned_orgs_only": true}'),
    ('training_sessions',   'update', '{"assigned_orgs_only": true}'),
    ('test_questions',      'create', '{"assigned_orgs_only": true}'),
    ('test_questions',      'read',   '{"assigned_orgs_only": true}'),
    ('test_questions',      'update', '{"assigned_orgs_only": true}'),
    ('notification_log',    'read',   '{"assigned_orgs_only": true}'),
    ('alert_preferences',   'read',   '{"assigned_orgs_only": true}'),
    ('alert_preferences',   'update', '{"assigned_orgs_only": true}'),
    ('generated_documents', 'create', '{"assigned_orgs_only": true}'),
    ('generated_documents', 'read',   '{"assigned_orgs_only": true}'),
    ('generated_documents', 'export', '{"assigned_orgs_only": true}'),
    ('fraud_alerts',        'read',   '{"assigned_orgs_only": true}'),
    ('organized_training_sessions','create', '{"assigned_orgs_only": true}'),
    ('organized_training_sessions','read',   '{"assigned_orgs_only": true}'),
    ('organized_training_sessions','update', '{"assigned_orgs_only": true}'),
    ('authorities',         'read',   NULL),
    ('penalty_rules',       'read',   NULL),
    ('penalty_visibility',  'read',   '{"assigned_orgs_only": true}'),
    ('reges_connections',   'create', '{"assigned_orgs_only": true}'),
    ('reges_connections',   'read',   '{"assigned_orgs_only": true}'),
    ('reges_transmissions', 'read',   '{"assigned_orgs_only": true}'),
    ('profiles',            'read',   '{"own_profile": true}'),
    ('profiles',            'update', '{"own_profile": true}')
) AS v(resource, action, cond)
WHERE r.role_key = 'consultant_ssm' AND r.country_code IS NULL
ON CONFLICT (role_id, resource, action, country_code) DO NOTHING;


-- ═════ FIRMA ADMIN ═════
INSERT INTO public.permissions (role_id, resource, action, conditions)
SELECT r.id, v.resource, v.action, v.cond::jsonb
FROM public.roles r, (VALUES 
    ('organizations',       'read',   '{"own_org_only": true}'),
    ('organizations',       'update', '{"own_org_only": true}'),
    ('employees',           'create', '{"own_org_only": true}'),
    ('employees',           'read',   '{"own_org_only": true}'),
    ('employees',           'update', '{"own_org_only": true}'),
    ('employees',           'delete', '{"own_org_only": true}'),
    ('employees',           'export', '{"own_org_only": true}'),
    ('locations',           'read',   '{"own_org_only": true}'),
    ('locations',           'create', '{"own_org_only": true}'),
    ('medical_examinations','read',   '{"own_org_only": true}'),
    ('safety_equipment',    'read',   '{"own_org_only": true}'),
    ('safety_equipment',    'create', '{"own_org_only": true}'),
    ('training_modules',    'read',   '{"own_org_only": true}'),
    ('training_assignments','read',   '{"own_org_only": true}'),
    ('training_sessions',   'read',   '{"own_org_only": true}'),
    ('notification_log',    'read',   '{"own_org_only": true}'),
    ('alert_preferences',   'read',   '{"own_org_only": true}'),
    ('alert_preferences',   'update', '{"own_org_only": true}'),
    ('generated_documents', 'read',   '{"own_org_only": true}'),
    ('generated_documents', 'export', '{"own_org_only": true}'),
    ('organized_training_sessions','read', '{"own_org_only": true}'),
    ('penalty_visibility',  'read',   '{"own_org_only": true}'),
    ('profiles',            'read',   '{"own_profile": true}'),
    ('profiles',            'update', '{"own_profile": true}'),
    ('user_roles',          'read',   '{"own_org_only": true}'),
    ('memberships',         'read',   '{"own_org_only": true}')
) AS v(resource, action, cond)
WHERE r.role_key = 'firma_admin' AND r.country_code IS NULL
ON CONFLICT (role_id, resource, action, country_code) DO NOTHING;


-- ═════ ANGAJAT ═════
INSERT INTO public.permissions (role_id, resource, action, conditions)
SELECT r.id, v.resource, v.action, v.cond::jsonb
FROM public.roles r, (VALUES 
    ('employees',           'read',   '{"own_record_only": true}'),
    ('training_assignments','read',   '{"own_record_only": true}'),
    ('training_sessions',   'read',   '{"own_record_only": true}'),
    ('test_questions',      'read',   '{"assigned_to_self": true}'),
    ('medical_examinations','read',   '{"own_record_only": true}'),
    ('generated_documents', 'read',   '{"own_record_only": true}'),
    ('notification_log',    'read',   '{"own_record_only": true}'),
    ('profiles',            'read',   '{"own_profile": true}'),
    ('profiles',            'update', '{"own_profile": true}')
) AS v(resource, action, cond)
WHERE r.role_key = 'angajat' AND r.country_code IS NULL
ON CONFLICT (role_id, resource, action, country_code) DO NOTHING;


-- ═════ MEDIC MEDICINA MUNCII ═════
INSERT INTO public.permissions (role_id, resource, action, conditions)
SELECT r.id, v.resource, v.action, v.cond::jsonb
FROM public.roles r, (VALUES 
    ('medical_examinations','create', '{"assigned_orgs_only": true}'),
    ('medical_examinations','read',   '{"assigned_orgs_only": true}'),
    ('medical_examinations','update', '{"assigned_orgs_only": true}'),
    ('employees',           'read',   '{"assigned_orgs_only": true}'),
    ('organizations',       'read',   '{"assigned_orgs_only": true}'),
    ('locations',           'read',   '{"assigned_orgs_only": true}')
) AS v(resource, action, cond)
WHERE r.role_key = 'medic_mm' AND r.country_code IS NULL
ON CONFLICT (role_id, resource, action, country_code) DO NOTHING;

-- Medic: restricții câmp pe employees (doar ce-i relevant medical)
UPDATE public.permissions SET field_restrictions = '{"name":"visible","cnp":"visible","position":"visible","hire_date":"visible","salary":"hidden"}'::jsonb
WHERE role_id = (SELECT id FROM public.roles WHERE role_key = 'medic_mm' AND country_code IS NULL)
  AND resource = 'employees' AND action = 'read';


-- ═════ AUDITOR EXTERN (read-only cu expirare) ═════
INSERT INTO public.permissions (role_id, resource, action, conditions)
SELECT r.id, v.resource, v.action, v.cond::jsonb
FROM public.roles r, (VALUES 
    ('organizations',       'read',   '{"assigned_orgs_only": true}'),
    ('employees',           'read',   '{"assigned_orgs_only": true}'),
    ('locations',           'read',   '{"assigned_orgs_only": true}'),
    ('medical_examinations','read',   '{"assigned_orgs_only": true}'),
    ('safety_equipment',    'read',   '{"assigned_orgs_only": true}'),
    ('training_modules',    'read',   '{"assigned_orgs_only": true}'),
    ('training_sessions',   'read',   '{"assigned_orgs_only": true}'),
    ('generated_documents', 'read',   '{"assigned_orgs_only": true}'),
    ('fraud_alerts',        'read',   '{"assigned_orgs_only": true}'),
    ('generated_documents', 'export', '{"assigned_orgs_only": true}')
) AS v(resource, action, cond)
WHERE r.role_key = 'auditor_extern' AND r.country_code IS NULL
ON CONFLICT (role_id, resource, action, country_code) DO NOTHING;


-- ═════ INSPECTOR ITM (read-only verificare) ═════
INSERT INTO public.permissions (role_id, resource, action, conditions)
SELECT r.id, v.resource, v.action, '{"inspection_scope": true}'::jsonb
FROM public.roles r, (VALUES 
    ('organizations','read'),('employees','read'),('locations','read'),
    ('medical_examinations','read'),('safety_equipment','read'),
    ('training_modules','read'),('training_sessions','read'),
    ('generated_documents','read'),('fraud_alerts','read'),
    ('organized_training_sessions','read'),('penalty_visibility','read')
) AS v(resource, action)
WHERE r.role_key = 'inspector_itm' AND r.country_code IS NULL
ON CONFLICT (role_id, resource, action, country_code) DO NOTHING;


-- ═════ FURNIZOR PSI ═════
INSERT INTO public.permissions (role_id, resource, action, conditions)
SELECT r.id, v.resource, v.action, v.cond::jsonb
FROM public.roles r, (VALUES 
    ('safety_equipment',    'read',   '{"assigned_orgs_only": true, "type": ["fire_extinguisher","hydrant","fire_alarm"]}'),
    ('safety_equipment',    'update', '{"assigned_orgs_only": true, "type": ["fire_extinguisher","hydrant","fire_alarm"]}'),
    ('organizations',       'read',   '{"assigned_orgs_only": true}'),
    ('locations',           'read',   '{"assigned_orgs_only": true}'),
    ('generated_documents', 'read',   '{"assigned_orgs_only": true, "category": "psi"}')
) AS v(resource, action, cond)
WHERE r.role_key = 'furnizor_psi' AND r.country_code IS NULL
ON CONFLICT (role_id, resource, action, country_code) DO NOTHING;


-- ═════ LUCRĂTOR DESEMNAT ═════
INSERT INTO public.permissions (role_id, resource, action, conditions)
SELECT r.id, v.resource, v.action, v.cond::jsonb
FROM public.roles r, (VALUES 
    ('employees',           'read',   '{"own_org_only": true}'),
    ('employees',           'update', '{"own_org_only": true}'),
    ('training_modules',    'read',   '{"own_org_only": true}'),
    ('training_sessions',   'create', '{"own_org_only": true}'),
    ('training_sessions',   'read',   '{"own_org_only": true}'),
    ('training_assignments','create', '{"own_org_only": true}'),
    ('training_assignments','read',   '{"own_org_only": true}'),
    ('safety_equipment',    'read',   '{"own_org_only": true}'),
    ('medical_examinations','read',   '{"own_org_only": true}'),
    ('generated_documents', 'read',   '{"own_org_only": true}'),
    ('notification_log',    'read',   '{"own_org_only": true}'),
    ('locations',           'read',   '{"own_org_only": true}')
) AS v(resource, action, cond)
WHERE r.role_key = 'lucrator_desemnat' AND r.country_code IS NULL
ON CONFLICT (role_id, resource, action, country_code) DO NOTHING;


-- ═════ WHITE-LABEL / STM ═════
INSERT INTO public.permissions (role_id, resource, action, conditions)
SELECT r.id, v.resource, v.action, v.cond::jsonb
FROM public.roles r, (VALUES 
    ('organizations',       'create', '{"own_tenant_only": true}'),
    ('organizations',       'read',   '{"own_tenant_only": true}'),
    ('organizations',       'update', '{"own_tenant_only": true}'),
    ('employees',           'create', '{"own_tenant_only": true}'),
    ('employees',           'read',   '{"own_tenant_only": true}'),
    ('employees',           'update', '{"own_tenant_only": true}'),
    ('employees',           'export', '{"own_tenant_only": true}'),
    ('training_modules',    'create', '{"own_tenant_only": true}'),
    ('training_modules',    'read',   '{"own_tenant_only": true}'),
    ('training_sessions',   'create', '{"own_tenant_only": true}'),
    ('training_sessions',   'read',   '{"own_tenant_only": true}'),
    ('generated_documents', 'create', '{"own_tenant_only": true}'),
    ('generated_documents', 'read',   '{"own_tenant_only": true}'),
    ('generated_documents', 'export', '{"own_tenant_only": true}'),
    ('user_roles',          'create', '{"own_tenant_only": true}'),
    ('user_roles',          'read',   '{"own_tenant_only": true}'),
    ('memberships',         'create', '{"own_tenant_only": true}'),
    ('memberships',         'read',   '{"own_tenant_only": true}')
) AS v(resource, action, cond)
WHERE r.role_key = 'white_label_stm' AND r.country_code IS NULL
ON CONFLICT (role_id, resource, action, country_code) DO NOTHING;

-- Permisiunile pentru restul rolurilor (training_provider, responsabil_ssm_intern, 
-- partener_contabil, furnizor_iscir_rsvti, inspector_igsu, inspector_anspdcp, 
-- responsabil_nis2) urmează același pattern. Le completez după confirmarea ta.
-- PRINCIPIU: este mai bine să le adaugi din Admin UI după implementare.


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ SECȚIUNEA 7: RLS PE TABELELE RBAC NOI                                  ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ROLES: oricine autentificat citește roluri active
CREATE POLICY "roles_select" ON public.roles FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "roles_admin" ON public.roles FOR ALL TO authenticated
    USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- PERMISSIONS: oricine autentificat citește
CREATE POLICY "permissions_select" ON public.permissions FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "permissions_admin" ON public.permissions FOR ALL TO authenticated
    USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- USER_ROLES: user vede propriile + admin vede tot
CREATE POLICY "user_roles_select" ON public.user_roles FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR public.is_super_admin() OR public.has_permission('user_roles', 'read'));
CREATE POLICY "user_roles_insert" ON public.user_roles FOR INSERT TO authenticated
    WITH CHECK (public.is_super_admin() OR public.has_permission('user_roles', 'create'));
CREATE POLICY "user_roles_update" ON public.user_roles FOR UPDATE TO authenticated
    USING (public.is_super_admin());
CREATE POLICY "user_roles_delete" ON public.user_roles FOR DELETE TO authenticated
    USING (public.is_super_admin());


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ SECȚIUNEA 8: MIGRARE DATE DIN memberships → user_roles                 ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- ⚠️ ATENȚIE: Rulează DOAR după ce verifici manual structura memberships!
-- DOC1 §4 spune: memberships = "Relația user ↔ organizație + rol"
-- 
-- Daniel: CONFIRMĂ care câmp din memberships conține rolul (role/role_type/etc.)
-- și cum e maparea: 'consultant' → consultant_ssm, 'admin' → firma_admin, etc.
--
-- EXEMPLU (decomentează și adaptează):

-- DO $$
-- DECLARE
--     v_consultant_id UUID := (SELECT id FROM public.roles WHERE role_key = 'consultant_ssm' AND country_code IS NULL);
--     v_firma_admin_id UUID := (SELECT id FROM public.roles WHERE role_key = 'firma_admin' AND country_code IS NULL);
--     v_angajat_id UUID := (SELECT id FROM public.roles WHERE role_key = 'angajat' AND country_code IS NULL);
-- BEGIN
--     -- Consultant SSM (organization_id = NULL → acces la toate organizațiile alocate)
--     INSERT INTO public.user_roles (user_id, role_id, organization_id, granted_by, metadata)
--     SELECT m.user_id, v_consultant_id, m.organization_id, m.user_id, 
--            jsonb_build_object('migrated_from', 'memberships', 'original_role', m.role)
--     FROM public.memberships m
--     WHERE m.role = 'consultant'  -- ← CONFIRMĂ valoarea exactă
--     ON CONFLICT (user_id, role_id, organization_id, location_id) DO NOTHING;
--
--     -- Firma Admin
--     INSERT INTO public.user_roles (user_id, role_id, organization_id, granted_by, metadata)
--     SELECT m.user_id, v_firma_admin_id, m.organization_id, m.user_id,
--            jsonb_build_object('migrated_from', 'memberships', 'original_role', m.role)
--     FROM public.memberships m
--     WHERE m.role = 'firma_admin'  -- ← CONFIRMĂ
--     ON CONFLICT (user_id, role_id, organization_id, location_id) DO NOTHING;
--
--     -- Angajat
--     INSERT INTO public.user_roles (user_id, role_id, organization_id, granted_by, metadata)
--     SELECT m.user_id, v_angajat_id, m.organization_id, m.user_id,
--            jsonb_build_object('migrated_from', 'memberships', 'original_role', m.role)
--     FROM public.memberships m
--     WHERE m.role = 'angajat'  -- ← CONFIRMĂ
--     ON CONFLICT (user_id, role_id, organization_id, location_id) DO NOTHING;
-- END;
-- $$;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ SECȚIUNEA 9: ACTUALIZARE RLS PE TABELELE EXISTENTE                     ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- ⚠️ ATENȚIE MAXIMĂ: Această secțiune ÎNLOCUIEȘTE policy-uri existente.
-- Daniel: Rulează NUMAI după ce Secțiunea 8 (migrare) e completă!
-- 
-- PRINCIPIU: Fiecare tabel existent primește 4 policies noi:
--   _select_dynamic, _insert_dynamic, _update_dynamic, _delete_dynamic
-- Care verifică has_permission() + is_super_admin() în loc de rol hardcodat.
--
-- EXEMPLU PENTRU employees (aplică similar pe celelalte 24 tabele):

-- Pasul 1: Listează policies existente
-- SELECT policyname FROM pg_policies WHERE tablename = 'employees';

-- Pasul 2: Drop policies vechi (înlocuiește cu numele reale!)
-- DROP POLICY IF EXISTS "employees_select_policy" ON public.employees;
-- DROP POLICY IF EXISTS "employees_insert_policy" ON public.employees;
-- DROP POLICY IF EXISTS "employees_update_policy" ON public.employees;
-- DROP POLICY IF EXISTS "employees_delete_policy" ON public.employees;

-- Pasul 3: Creează policies noi dinamice
-- CREATE POLICY "employees_select_dynamic" ON public.employees
--     FOR SELECT TO authenticated
--     USING (
--         public.is_super_admin()
--         OR (
--             public.has_permission('employees', 'read')
--             AND (
--                 -- Consultanți: doar organizațiile alocate
--                 organization_id IN (SELECT public.get_user_org_ids())
--                 -- Angajați: doar propriul record
--                 OR user_id = auth.uid()
--             )
--         )
--     );
-- 
-- Repetă pentru INSERT (has_permission 'create'), UPDATE, DELETE.
-- 
-- ⚠️ IMPORTANT: Fiecare tabel are structura diferită (unele au organization_id,
-- altele au user_id, altele ambele). Daniel confirmă structura exactă 
-- sau rulează: \d public.employees în psql.


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ SECȚIUNEA 10: AUDIT LOG RBAC                                           ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS public.rbac_audit_log (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action      TEXT NOT NULL,
    actor_id    UUID REFERENCES auth.users(id),
    target_type TEXT NOT NULL,
    target_id   UUID NOT NULL,
    old_value   JSONB,
    new_value   JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rbac_audit_actor ON public.rbac_audit_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_rbac_audit_created ON public.rbac_audit_log(created_at);

ALTER TABLE public.rbac_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rbac_audit_select" ON public.rbac_audit_log FOR SELECT TO authenticated
    USING (public.is_super_admin());
CREATE POLICY "rbac_audit_insert" ON public.rbac_audit_log FOR INSERT TO authenticated
    WITH CHECK (true);


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ VERIFICARE FINALĂ                                                      ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Rulează după execuție:
SELECT 'ROLES' AS tabel, count(*) AS total FROM public.roles
UNION ALL
SELECT 'PERMISSIONS', count(*) FROM public.permissions
UNION ALL
SELECT 'USER_ROLES', count(*) FROM public.user_roles;

-- Detaliu roluri:
SELECT role_key, role_name, country_code, is_system,
       (SELECT count(*) FROM public.permissions p WHERE p.role_id = r.id AND p.is_active = true) AS perm_count
FROM public.roles r
ORDER BY country_code NULLS FIRST, (metadata->>'sort')::int;
