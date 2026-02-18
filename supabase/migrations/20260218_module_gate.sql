-- Migration: 20260218_module_gate.sql
-- ModuleGate — Tabele pentru module active per organizație
-- Creează: organization_modules, module_definitions
-- RLS via memberships, seed data pentru prima organizație

-- ─────────────────────────────────────────────
-- 1. module_definitions — catalogul tuturor modulelor posibile
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS module_definitions (
  module_key            text PRIMARY KEY,
  module_name_en        text NOT NULL,
  module_name_keys      jsonb NOT NULL DEFAULT '{}',
  description_en        text,
  icon                  text,
  category              text NOT NULL DEFAULT 'standalone'
                          CHECK (category IN ('core', 'standalone', 'premium')),
  is_base               boolean NOT NULL DEFAULT false,
  depends_on            text[] NOT NULL DEFAULT '{}',
  incompatible          text[] NOT NULL DEFAULT '{}',
  sort_order            int NOT NULL DEFAULT 0,
  is_active             boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- Seed module_definitions — toate modulele posibile
INSERT INTO module_definitions
  (module_key, module_name_en, module_name_keys, description_en, icon, category, is_base, sort_order)
VALUES
  ('alerte',                'Alerts',                     '{"ro":"Alerte","bg":"Известия","hu":"Riasztások","de":"Warnungen","pl":"Alerty"}',                           'Alerte și notificări SSM/PSI în timp real',                          'Bell',          'core',       true,  1),
  ('legislatie',            'Legislation',                '{"ro":"Legislație","bg":"Законодателство","hu":"Jogszabályok","de":"Gesetzgebung","pl":"Legislacja"}',         'Monitorizare obligații legale și acte normative',                    'Scale',         'core',       true,  2),
  ('ssm',                   'SSM',                        '{"ro":"SSM","bg":"ЗБУТ","hu":"SSM","de":"ASchutz","pl":"BHP"}',                                               'Securitate și sănătate în muncă — instruiri, angajați, risc',        'ShieldCheck',   'standalone', false, 3),
  ('psi',                   'PSI / Fire Safety',          '{"ro":"PSI / SU","bg":"Пожарна безопасност","hu":"Tűzvédelem","de":"Brandschutz","pl":"PPOŻ"}',               'Prevenire și stingere incendii, planuri evacuare',                   'Flame',         'standalone', false, 4),
  ('medical',               'Occupational Medicine',      '{"ro":"Medicină Muncă","bg":"Медицина на труда","hu":"Munkaegészségügy","de":"Arbeitsmedizin","pl":"Medycyna"}','Medicina muncii — fișe, scadențe, examinări',                       'Heart',         'standalone', false, 5),
  ('echipamente',           'Equipment',                  '{"ro":"Echipamente","bg":"Оборудване","hu":"Felszerelések","de":"Ausrüstung","pl":"Wyposażenie"}',             'Gestiune echipamente PSI, ISCIR, EIP',                               'Wrench',        'standalone', false, 6),
  ('near_miss',             'Near-Miss',                  '{"ro":"Near-Miss","bg":"Почти инциденти","hu":"Majdnem-balesetek","de":"Beinaheunfälle","pl":"Zdarzenia"}',   'Raportare și analiză incidente near-miss',                           'AlertTriangle', 'standalone', false, 7),
  ('gdpr',                  'GDPR',                       '{"ro":"GDPR","bg":"GDPR","hu":"GDPR","de":"DSGVO","pl":"RODO"}',                                              'Conformitate GDPR — DPO, DPIA, breach-uri',                         'Lock',          'premium',    false, 8),
  ('nis2',                  'NIS2 Cybersecurity',         '{"ro":"NIS2","bg":"NIS2","hu":"NIS2","de":"NIS2","pl":"NIS2"}',                                                'Conformitate NIS2 — evaluare risc cibernetic',                      'ShieldAlert',   'premium',    false, 9),
  ('mediu',                 'Environmental',              '{"ro":"Mediu","bg":"Околна среда","hu":"Környezet","de":"Umwelt","pl":"Środowisko"}',                          'Managementul mediului — deșeuri, emisii',                            'Leaf',          'premium',    false, 10),
  ('comunicare_autoritati', 'Authority Communication',    '{"ro":"Autorități","bg":"Органи","hu":"Hatóságok","de":"Behörden","pl":"Urzędy"}',                            'Comunicare oficială cu ITM, ISU, DSP, etc.',                         'Building2',     'premium',    false, 11),
  ('relatii_munca',         'Labor Relations',            '{"ro":"Relații Muncă","bg":"Трудови отношения","hu":"Munkaügy","de":"Arbeitsrecht","pl":"Prawo pracy"}',       'Contracte, concedii, REVISAL, relații de muncă',                     'Users',         'premium',    false, 12),
  ('contabilitate',         'Accounting',                 '{"ro":"Contabilitate","bg":"Счетоводство","hu":"Számvitel","de":"Buchhaltung","pl":"Księgowość"}',             'Facturare, plăți, raportare financiară',                             'DollarSign',    'premium',    false, 13),
  ('scan',                  'Document Scan',              '{"ro":"Scanare Documente","bg":"Сканиране","hu":"Szkennelés","de":"Dokumentenscan","pl":"Skanowanie"}',        'Scanare și OCR documente SSM/PSI',                                   'ScanLine',      'standalone', false, 14),
  ('reports',               'Reports',                    '{"ro":"Rapoarte","bg":"Доклади","hu":"Jelentések","de":"Berichte","pl":"Raporty"}',                            'Generare rapoarte PDF și export date',                               'FileText',      'core',       true,  15),
  ('documents',             'Documents',                  '{"ro":"Documente","bg":"Документи","hu":"Dokumentumok","de":"Dokumente","pl":"Dokumenty"}',                   'Gestiune documente și fișiere SSM/PSI',                              'FolderOpen',    'standalone', false, 16),
  ('ssm-core',              'SSM Core',                   '{"ro":"SSM Core","bg":"SSM Core","hu":"SSM Core","de":"SSM Core","pl":"SSM Core"}',                           'Nucleul SSM — funcționalități de bază',                              'ShieldCheck',   'core',       true,  0)
ON CONFLICT (module_key) DO UPDATE SET
  module_name_en   = EXCLUDED.module_name_en,
  module_name_keys = EXCLUDED.module_name_keys,
  description_en   = EXCLUDED.description_en,
  icon             = EXCLUDED.icon,
  category         = EXCLUDED.category,
  is_base          = EXCLUDED.is_base,
  sort_order       = EXCLUDED.sort_order,
  updated_at       = now();

-- ─────────────────────────────────────────────
-- 2. organization_modules — modulele activate per organizație
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS organization_modules (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  module_key        text NOT NULL REFERENCES module_definitions(module_key) ON DELETE RESTRICT,
  status            text NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active', 'trial', 'suspended', 'inactive')),
  trial_started_at  timestamptz,
  trial_expires_at  timestamptz,
  activated_at      timestamptz DEFAULT now(),
  expires_at        timestamptz,
  config            jsonb NOT NULL DEFAULT '{}',
  activated_by      uuid REFERENCES auth.users(id),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, module_key)
);

-- Index pentru query rapid pe org + status
CREATE INDEX IF NOT EXISTS idx_org_modules_org_status
  ON organization_modules(organization_id, status);

-- ─────────────────────────────────────────────
-- 3. RLS — organization_modules
-- ─────────────────────────────────────────────
ALTER TABLE organization_modules ENABLE ROW LEVEL SECURITY;

-- Membrii organizației pot citi modulele propriei organizații
CREATE POLICY "org_members_can_read_modules" ON organization_modules
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

-- Doar super_admin poate modifica (insert/update/delete) — activarea se face manual
CREATE POLICY "super_admin_can_manage_modules" ON organization_modules
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND r.name = 'super_admin'
        AND (ur.expires_at IS NULL OR ur.expires_at > now())
    )
  );

-- ─────────────────────────────────────────────
-- 4. RLS — module_definitions (read-only pentru toți autentificați)
-- ─────────────────────────────────────────────
ALTER TABLE module_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_can_read_module_definitions" ON module_definitions
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "super_admin_can_manage_module_definitions" ON module_definitions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND r.name = 'super_admin'
        AND (ur.expires_at IS NULL OR ur.expires_at > now())
    )
  );

-- ─────────────────────────────────────────────
-- 5. Seed data — modulele de bază pentru PRIMA organizație existentă
-- Astfel sidebar-ul nu dispare la prima testare
-- ─────────────────────────────────────────────
DO $$
DECLARE
  v_org_id uuid;
BEGIN
  -- Ia prima organizație din sistem
  SELECT id INTO v_org_id
  FROM organizations
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_org_id IS NULL THEN
    RAISE NOTICE 'No organizations found — skipping seed data';
    RETURN;
  END IF;

  RAISE NOTICE 'Seeding modules for organization: %', v_org_id;

  -- Insert module-uri active (ssm, psi, medical, legislatie, echipamente, alerte, reports)
  INSERT INTO organization_modules (organization_id, module_key, status, activated_at)
  VALUES
    (v_org_id, 'ssm',                   'active', now()),
    (v_org_id, 'psi',                   'active', now()),
    (v_org_id, 'medical',               'active', now()),
    (v_org_id, 'legislatie',            'active', now()),
    (v_org_id, 'echipamente',           'active', now()),
    (v_org_id, 'alerte',                'active', now()),
    (v_org_id, 'reports',               'active', now()),
    (v_org_id, 'near_miss',             'trial',  now()),
    (v_org_id, 'gdpr',                  'trial',  now())
  ON CONFLICT (organization_id, module_key) DO NOTHING;

  RAISE NOTICE 'Seed complete for organization: %', v_org_id;
END;
$$;

-- ─────────────────────────────────────────────
-- 6. Trigger updated_at pe organization_modules
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_org_modules_updated_at ON organization_modules;
CREATE TRIGGER set_org_modules_updated_at
  BEFORE UPDATE ON organization_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
