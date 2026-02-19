-- Migration: 20260219_capabilities.sql
-- Capabilities + role_capabilities — decuplare rol/permisiune
-- Task 2: Tabel cu coduri semantice de permisiune, mapate pe roluri
-- Data: 19 Februarie 2026

-- ─────────────────────────────────────────────
-- 1. capabilities — catalog de coduri semantice
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS capabilities (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  category    VARCHAR(50) CHECK (
    category IN ('training', 'medical', 'documents', 'employees', 'reports', 'admin')
  ),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE capabilities IS 'Catalog de permisiuni semantice (capabilities) independente de rol';
COMMENT ON COLUMN capabilities.code IS 'Identificator unic, ex: can_sign_training';
COMMENT ON COLUMN capabilities.category IS 'Categoria funcțională a permisiunii';

-- ─────────────────────────────────────────────
-- 2. role_capabilities — mapare rol → capability
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS role_capabilities (
  role_id         UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  capability_code VARCHAR(100) NOT NULL REFERENCES capabilities(code) ON DELETE CASCADE,
  PRIMARY KEY (role_id, capability_code)
);

COMMENT ON TABLE role_capabilities IS 'Mapare many-to-many între roluri și capabilities';

-- Indexes pentru query rapid
CREATE INDEX IF NOT EXISTS idx_role_capabilities_role ON role_capabilities(role_id);
CREATE INDEX IF NOT EXISTS idx_role_capabilities_code ON role_capabilities(capability_code);

-- ─────────────────────────────────────────────
-- 3. RLS — capabilities (read pentru toți autentificați)
-- ─────────────────────────────────────────────
ALTER TABLE capabilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_read_capabilities" ON capabilities
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "super_admin_manage_capabilities" ON capabilities
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND r.role_key = 'super_admin'
        AND ur.is_active = true
        AND (ur.expires_at IS NULL OR ur.expires_at > now())
    )
  );

-- ─────────────────────────────────────────────
-- 4. RLS — role_capabilities
-- ─────────────────────────────────────────────
ALTER TABLE role_capabilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_read_role_capabilities" ON role_capabilities
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "super_admin_manage_role_capabilities" ON role_capabilities
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND r.role_key = 'super_admin'
        AND ur.is_active = true
        AND (ur.expires_at IS NULL OR ur.expires_at > now())
    )
  );

-- ─────────────────────────────────────────────
-- 5. Seed: 8 capabilities de bază
-- ─────────────────────────────────────────────
INSERT INTO capabilities (code, description, category) VALUES
  ('can_sign_training',     'Poate semna procesele verbale de instruire SSM/PSI',         'training'),
  ('can_view_medical',      'Poate vizualiza fișele de medicină a muncii (confidențial)',  'medical'),
  ('can_edit_employees',    'Poate adăuga și modifica angajați în organizație',            'employees'),
  ('can_approve_incidents', 'Poate aproba și închide rapoarte de incidente/near-miss',     'documents'),
  ('can_export_reports',    'Poate genera și exporta rapoarte PDF/Excel',                  'reports'),
  ('can_manage_users',      'Poate gestiona utilizatori și atribui roluri',                'admin'),
  ('can_view_legislation',  'Poate accesa monitorul de legislație și obligații',           'documents'),
  ('can_manage_equipment',  'Poate adăuga și actualiza echipamente PSI/ISCIR/EIP',        'documents')
ON CONFLICT (code) DO NOTHING;

-- ─────────────────────────────────────────────
-- 6. Mapare capabilities → roluri existente
-- Folosim role_key pentru robustețe (nu hardcodăm UUID)
-- ─────────────────────────────────────────────
DO $$
DECLARE
  v_role_id UUID;
BEGIN

  -- ── super_admin: acces la toate capabilities ──
  SELECT id INTO v_role_id
  FROM roles WHERE role_key = 'super_admin' AND is_active = true LIMIT 1;

  IF v_role_id IS NOT NULL THEN
    INSERT INTO role_capabilities (role_id, capability_code) VALUES
      (v_role_id, 'can_sign_training'),
      (v_role_id, 'can_view_medical'),
      (v_role_id, 'can_edit_employees'),
      (v_role_id, 'can_approve_incidents'),
      (v_role_id, 'can_export_reports'),
      (v_role_id, 'can_manage_users'),
      (v_role_id, 'can_view_legislation'),
      (v_role_id, 'can_manage_equipment')
    ON CONFLICT DO NOTHING;
    RAISE NOTICE 'Capabilities asignate pentru super_admin (id: %)', v_role_id;
  ELSE
    RAISE NOTICE 'Rolul super_admin nu a fost găsit — capabilities omise';
  END IF;

  -- ── consultant_ssm: toate capabilities ──
  SELECT id INTO v_role_id
  FROM roles WHERE role_key = 'consultant_ssm' AND is_active = true LIMIT 1;

  IF v_role_id IS NOT NULL THEN
    INSERT INTO role_capabilities (role_id, capability_code) VALUES
      (v_role_id, 'can_sign_training'),
      (v_role_id, 'can_view_medical'),
      (v_role_id, 'can_edit_employees'),
      (v_role_id, 'can_approve_incidents'),
      (v_role_id, 'can_export_reports'),
      (v_role_id, 'can_manage_users'),
      (v_role_id, 'can_view_legislation'),
      (v_role_id, 'can_manage_equipment')
    ON CONFLICT DO NOTHING;
    RAISE NOTICE 'Capabilities asignate pentru consultant_ssm (id: %)', v_role_id;
  ELSE
    RAISE NOTICE 'Rolul consultant_ssm nu a fost găsit — capabilities omise';
  END IF;

  -- ── firma_admin: subset operațional (fără can_manage_users / can_sign_training) ──
  SELECT id INTO v_role_id
  FROM roles WHERE role_key = 'firma_admin' AND is_active = true LIMIT 1;

  IF v_role_id IS NOT NULL THEN
    INSERT INTO role_capabilities (role_id, capability_code) VALUES
      (v_role_id, 'can_view_medical'),
      (v_role_id, 'can_edit_employees'),
      (v_role_id, 'can_export_reports'),
      (v_role_id, 'can_view_legislation'),
      (v_role_id, 'can_manage_equipment')
    ON CONFLICT DO NOTHING;
    RAISE NOTICE 'Capabilities asignate pentru firma_admin (id: %)', v_role_id;
  ELSE
    RAISE NOTICE 'Rolul firma_admin nu a fost găsit — capabilities omise';
  END IF;

  -- ── angajat: read-only capabilities ──
  SELECT id INTO v_role_id
  FROM roles WHERE role_key = 'angajat' AND is_active = true LIMIT 1;

  IF v_role_id IS NOT NULL THEN
    INSERT INTO role_capabilities (role_id, capability_code) VALUES
      (v_role_id, 'can_view_medical'),
      (v_role_id, 'can_view_legislation')
    ON CONFLICT DO NOTHING;
    RAISE NOTICE 'Capabilities asignate pentru angajat (id: %)', v_role_id;
  ELSE
    RAISE NOTICE 'Rolul angajat nu a fost găsit — capabilities omise';
  END IF;

  -- ── lucrator_desemnat: similar firma_admin ──
  SELECT id INTO v_role_id
  FROM roles WHERE role_key = 'lucrator_desemnat' AND is_active = true LIMIT 1;

  IF v_role_id IS NOT NULL THEN
    INSERT INTO role_capabilities (role_id, capability_code) VALUES
      (v_role_id, 'can_view_medical'),
      (v_role_id, 'can_edit_employees'),
      (v_role_id, 'can_view_legislation'),
      (v_role_id, 'can_manage_equipment')
    ON CONFLICT DO NOTHING;
    RAISE NOTICE 'Capabilities asignate pentru lucrator_desemnat (id: %)', v_role_id;
  ELSE
    RAISE NOTICE 'Rolul lucrator_desemnat nu a fost găsit — omis (opțional)';
  END IF;

  -- ── responsabil_ssm_intern: similar lucrator_desemnat + approve ──
  SELECT id INTO v_role_id
  FROM roles WHERE role_key = 'responsabil_ssm_intern' AND is_active = true LIMIT 1;

  IF v_role_id IS NOT NULL THEN
    INSERT INTO role_capabilities (role_id, capability_code) VALUES
      (v_role_id, 'can_sign_training'),
      (v_role_id, 'can_view_medical'),
      (v_role_id, 'can_edit_employees'),
      (v_role_id, 'can_approve_incidents'),
      (v_role_id, 'can_view_legislation'),
      (v_role_id, 'can_manage_equipment')
    ON CONFLICT DO NOTHING;
    RAISE NOTICE 'Capabilities asignate pentru responsabil_ssm_intern (id: %)', v_role_id;
  ELSE
    RAISE NOTICE 'Rolul responsabil_ssm_intern nu a fost găsit — omis (opțional)';
  END IF;

END $$;
