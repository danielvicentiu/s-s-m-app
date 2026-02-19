-- Migration: 20260219_jwt_metadata_sync.sql
-- JWT app_metadata sync — optimizare RLS cu date din JWT
-- Task 1: Trigger pe user_roles + backfill + RLS employees optimizat
-- Data: 19 Februarie 2026
--
-- IMPORTANT: Rulați 20260219_capabilities.sql ÎNAINTE de această migrație
-- deoarece funcția sync_user_app_metadata citește din role_capabilities

-- ─────────────────────────────────────────────
-- 1. Funcție helper: sync_user_app_metadata
-- SECURITY DEFINER — rulează ca owner, are acces la auth.users
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.sync_user_app_metadata(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_primary_role TEXT;
  v_org_ids      TEXT[];
  v_permissions  TEXT[];
BEGIN
  -- 1. Citește rolul primar cu ordine de prioritate
  SELECT r.role_key INTO v_primary_role
  FROM user_roles ur
  JOIN roles r ON r.id = ur.role_id
  WHERE ur.user_id = p_user_id
    AND ur.is_active = true
    AND r.is_active = true
    AND (ur.expires_at IS NULL OR ur.expires_at > now())
  ORDER BY CASE r.role_key
    WHEN 'super_admin'          THEN 1
    WHEN 'consultant_ssm'       THEN 2
    WHEN 'white_label_stm'      THEN 3
    WHEN 'firma_admin'          THEN 4
    WHEN 'responsabil_ssm_intern' THEN 5
    WHEN 'lucrator_desemnat'    THEN 6
    ELSE 99
  END
  LIMIT 1;

  -- 2. Citește org_ids din AMBELE surse (user_roles.company_id + memberships.organization_id)
  SELECT ARRAY_AGG(DISTINCT org_id::text)
  INTO v_org_ids
  FROM (
    -- Sursa 1: user_roles.company_id (sistemul RBAC dinamic)
    SELECT company_id AS org_id
    FROM user_roles
    WHERE user_id = p_user_id
      AND is_active = true
      AND company_id IS NOT NULL

    UNION

    -- Sursa 2: memberships (sistemul legacy — fallback)
    SELECT organization_id AS org_id
    FROM memberships
    WHERE user_id = p_user_id
      AND is_active = true
      AND deleted_at IS NULL
  ) AS combined;

  -- 3. Citește capability codes din role_capabilities
  -- (dacă tabelul nu există sau e gol, v_permissions va fi NULL → se stochează '[]')
  BEGIN
    SELECT ARRAY_AGG(DISTINCT rc.capability_code)
    INTO v_permissions
    FROM user_roles ur
    JOIN role_capabilities rc ON rc.role_id = ur.role_id
    WHERE ur.user_id = p_user_id
      AND ur.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > now());
  EXCEPTION WHEN undefined_table THEN
    v_permissions := NULL;
  END;

  -- 4. Actualizează auth.users.raw_app_meta_data (merge — nu suprascrie alte câmpuri)
  UPDATE auth.users
  SET raw_app_meta_data =
    COALESCE(raw_app_meta_data, '{}'::jsonb) ||
    jsonb_build_object(
      'role',        COALESCE(v_primary_role, 'angajat'),
      'org_id',      CASE WHEN v_org_ids IS NOT NULL AND array_length(v_org_ids, 1) > 0
                       THEN v_org_ids[1]
                       ELSE NULL
                     END,
      'org_ids',     COALESCE(to_jsonb(v_org_ids), '[]'::jsonb),
      'permissions', COALESCE(to_jsonb(v_permissions), '[]'::jsonb),
      'metadata_synced_at', to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
    )
  WHERE id = p_user_id;

END;
$$;

COMMENT ON FUNCTION public.sync_user_app_metadata IS
  'Sincronizează auth.users.app_metadata cu rolul primar, org_ids și capabilities ale unui user. '
  'SECURITY DEFINER — rulează cu privilegii de owner pentru a scrie în auth.users.';

-- ─────────────────────────────────────────────
-- 2. Funcție trigger pentru user_roles
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.trg_sync_metadata_on_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.sync_user_app_metadata(OLD.user_id);
  ELSE
    -- INSERT sau UPDATE
    PERFORM public.sync_user_app_metadata(NEW.user_id);
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

COMMENT ON FUNCTION public.trg_sync_metadata_on_role_change IS
  'Trigger function: la orice modificare în user_roles, sincronizează app_metadata pentru userul afectat.';

-- ─────────────────────────────────────────────
-- 3. Trigger pe tabelul user_roles
-- ─────────────────────────────────────────────
DROP TRIGGER IF EXISTS trg_user_roles_sync_metadata ON user_roles;

CREATE TRIGGER trg_user_roles_sync_metadata
  AFTER INSERT OR UPDATE OR DELETE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_sync_metadata_on_role_change();

COMMENT ON TRIGGER trg_user_roles_sync_metadata ON user_roles IS
  'La fiecare INSERT/UPDATE/DELETE pe user_roles, actualizează auth.users.app_metadata cu noul rol, org_ids și permissions.';

-- ─────────────────────────────────────────────
-- 4. RLS Optimization: employees_select_policy
-- Adaugă fast-path JWT ÎNAINTE de get_user_org_ids() (care face JOIN la DB)
-- Fallback la funcțiile existente pentru userii fără JWT sync
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "employees_select_policy" ON public.employees;

CREATE POLICY "employees_select_policy" ON public.employees
  FOR SELECT TO authenticated
  USING (
    -- ── Fast path 1: super_admin din JWT (O(1), fără JOIN) ──
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'

    OR

    -- ── Fast path 2: org_id din JWT org_ids array ──
    -- Funcționează NUMAI după sync_user_app_metadata (JWT are org_ids populat)
    (
      jsonb_array_length(
        COALESCE(auth.jwt() -> 'app_metadata' -> 'org_ids', '[]'::jsonb)
      ) > 0
      AND
      organization_id::text = ANY(
        ARRAY(
          SELECT jsonb_array_elements_text(
            COALESCE(auth.jwt() -> 'app_metadata' -> 'org_ids', '[]'::jsonb)
          )
        )
      )
    )

    OR

    -- ── Angajat vede propriul record (via user_id pe employees) ──
    (user_id IS NOT NULL AND user_id = auth.uid())

    OR

    -- ── Fallback: JWT nu are org_ids sync → folosește funcțiile existente ──
    -- Acoperă userii care nu au trecut prin backfill
    (
      jsonb_array_length(
        COALESCE(auth.jwt() -> 'app_metadata' -> 'org_ids', '[]'::jsonb)
      ) = 0
      AND (
        public.is_super_admin()
        OR organization_id IN (SELECT public.get_user_org_ids())
      )
    )
  );

-- ─────────────────────────────────────────────
-- 5. Backfill: sincronizează app_metadata pentru TOȚI userii existenți
-- Rulează după trigger și capabilities seed
-- ─────────────────────────────────────────────
DO $$
DECLARE
  r          RECORD;
  v_count    INTEGER := 0;
  v_errors   INTEGER := 0;
BEGIN
  RAISE NOTICE 'START backfill sync_user_app_metadata...';

  -- Ia toți userii unici din user_roles (activi) + memberships (activi)
  FOR r IN
    SELECT DISTINCT user_id FROM (
      SELECT user_id FROM user_roles WHERE is_active = true
      UNION
      SELECT user_id FROM memberships WHERE is_active = true AND deleted_at IS NULL
    ) combined
  LOOP
    BEGIN
      PERFORM public.sync_user_app_metadata(r.user_id);
      v_count := v_count + 1;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Backfill error pentru user_id %: %', r.user_id, SQLERRM;
      v_errors := v_errors + 1;
    END;
  END LOOP;

  RAISE NOTICE 'Backfill complet: % useri sincronizați, % erori', v_count, v_errors;
END $$;
