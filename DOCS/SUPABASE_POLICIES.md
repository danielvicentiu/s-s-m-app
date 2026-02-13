# SUPABASE RLS POLICIES — DOCUMENTAȚIE COMPLETĂ

**Proiect:** S-S-M.RO — Platformă SSM/PSI Digitală
**Ultima actualizare:** 13 februarie 2026
**Stare:** RBAC Hybrid (Legacy Memberships + Dynamic Roles)
**Tabele cu RLS:** 30+

---

## Cuprins

1. [Prezentare Generală](#1-prezentare-generală)
2. [Funcții Helper RLS](#2-funcții-helper-rls)
3. [Tabele Core (Operaționale)](#3-tabele-core-operaționale)
4. [Tabele RBAC (Sistem Dinamic)](#4-tabele-rbac-sistem-dinamic)
5. [Tabele Configurare & Lookup](#5-tabele-configurare--lookup)
6. [Tabele Integrare REGES](#6-tabele-integrare-reges)
7. [Storage Buckets](#7-storage-buckets)
8. [Matrice Completă Acces](#8-matrice-completă-acces)
9. [Patternuri RLS & Best Practices](#9-patternuri-rls--best-practices)
10. [Referințe & Fișiere Sursă](#10-referințe--fișiere-sursă)

---

## 1. Prezentare Generală

### 1.1 Arhitectură RLS

Platforma folosește **Row Level Security (RLS)** activat pe TOATE tabelele pentru izolare multi-tenancy strictă:

- **Nivel organizație:** Fiecare utilizator vede doar datele organizațiilor sale (via `memberships` sau `user_roles`)
- **Nivel rol:** Permisiuni diferențiate pe bază de rol (consultant, firma_admin, angajat, etc.)
- **Nivel date:** Field-level restrictions (ex: CNP mascat pentru anumite roluri)
- **Audit complet:** Toate operațiunile loggate în `audit_log`

### 1.2 Roluri Sistem

**Legacy (via `memberships.role`):**
- `consultant` — Consultant SSM/PSI cu acces complet la clienți
- `firma_admin` — Administrator firmă client (CRUD propria organizație)
- `angajat` — Angajat firmă (READ only date proprii)

**RBAC (via `user_roles` + `roles` table — 27 roluri):**

| Tier | Rol | Descriere |
|------|-----|-----------|
| **Sistem (4)** | `super_admin` | Acces complet platformă |
| | `consultant_ssm` | Consultant SSM cu multi-clienți |
| | `firma_admin` | Admin firmă client |
| | `angajat` | Angajat firmă |
| **România (13)** | `partener_contabil` | Partener contabilitate |
| | `furnizor_psi` | Furnizor servicii PSI |
| | `furnizor_iscir` | Furnizor servicii ISCIR |
| | `medic_mm` | Medic medicina muncii |
| | `auditor_extern` | Auditor extern SSM |
| | `inspector_itm` | Inspector ITM (Inspecția Muncii) |
| | `inspector_igsu` | Inspector IGSU (Pompieri) |
| | `inspector_anspdcp` | Inspector ANSPDCP (Protecția Datelor) |
| | `lucrator_desemnat` | Lucrător desemnat SSM |
| | `white_label_stm` | Partener white-label STM |
| | `responsabil_ssm_intern` | Responsabil SSM intern firmă |
| | `training_provider` | Furnizor cursuri SSM |
| | `responsabil_nis2` | Responsabil securitate NIS2 |
| **Bulgaria (3)** | `zbut_consultant_bg` | Consultant ZBUT (Bulgaria) |
| | `inspector_git_bg` | Inspector GIT Bulgaria |
| | `stm_partner_bg` | Partener STM Bulgaria |
| **Ungaria (2)** | `munkavedelmi_hu` | Consultant protecție muncă Ungaria |
| | `inspector_ommf_hu` | Inspector OMMF Ungaria |
| **Germania (3)** | `sicherheitsingenieur_de` | Inginer siguranță Germania |
| | `betriebsarzt_de` | Medic firmă Germania |
| | `berufsgenossenschaft_de` | Asociație profesională Germania |
| **Polonia (2)** | `specjalista_bhp_pl` | Specialist BHP Polonia |
| | `inspector_pip_pl` | Inspector PIP Polonia |

---

## 2. Funcții Helper RLS

### 2.1 Funcții PostgreSQL (Supabase)

#### `is_super_admin()`
```sql
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
      AND r.role_key = 'super_admin'
      AND ur.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Utilizare:**
```sql
-- În RLS policy
USING (public.is_super_admin() OR organization_id IN (...))
```

---

#### `get_user_org_ids()`
```sql
CREATE OR REPLACE FUNCTION public.get_user_org_ids()
RETURNS TABLE(organization_id UUID) AS $$
BEGIN
  -- Super admin sees all
  IF public.is_super_admin() THEN
    RETURN QUERY SELECT id FROM public.organizations;
  END IF;

  -- RBAC: use user_roles.company_id
  RETURN QUERY
    SELECT DISTINCT ur.company_id
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
      AND ur.company_id IS NOT NULL;

  -- Fallback: legacy memberships
  IF NOT FOUND THEN
    RETURN QUERY
      SELECT DISTINCT m.organization_id
      FROM public.memberships m
      WHERE m.user_id = auth.uid() AND m.is_active = true;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Utilizare:**
```sql
-- În RLS policy
USING (organization_id IN (SELECT public.get_user_org_ids()))
```

---

#### `has_role_in_org(org_id UUID, role_text TEXT)`
```sql
CREATE OR REPLACE FUNCTION public.has_role_in_org(
  org_id UUID,
  role_text TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check RBAC first
  IF EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
      AND ur.company_id = org_id
      AND r.role_key = role_text
      AND ur.is_active = true
  ) THEN
    RETURN TRUE;
  END IF;

  -- Fallback: legacy memberships
  RETURN EXISTS (
    SELECT 1 FROM public.memberships
    WHERE user_id = auth.uid()
      AND organization_id = org_id
      AND role = role_text
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

#### `is_consultant()`
```sql
CREATE OR REPLACE FUNCTION public.is_consultant()
RETURNS BOOLEAN AS $$
BEGIN
  -- RBAC: check for consultant_ssm role
  IF EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
      AND r.role_key = 'consultant_ssm'
      AND ur.is_active = true
  ) THEN
    RETURN TRUE;
  END IF;

  -- Legacy: check memberships
  RETURN EXISTS (
    SELECT 1 FROM public.memberships
    WHERE user_id = auth.uid()
      AND role = 'consultant'
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### 2.2 Funcții TypeScript (Aplicație)

**Fișier:** `/lib/rbac.ts`

#### `getMyRoles()`
```typescript
/**
 * Returnează rolurile active ale utilizatorului curent
 * Cu fallback la memberships dacă RBAC nu e populat
 */
export async function getMyRoles(): Promise<UserRole[]> {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Try RBAC first
  const { data: rbacRoles } = await supabase
    .from('user_roles')
    .select('*, role:roles(*)')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())

  if (rbacRoles && rbacRoles.length > 0) {
    return rbacRoles.map(ur => ({
      role_key: ur.role.role_key,
      role_name: ur.role.role_name,
      company_id: ur.company_id,
      location_id: ur.location_id,
      expires_at: ur.expires_at,
      is_active: ur.is_active,
      country_code: ur.role.country_code,
    }))
  }

  // Fallback to memberships
  const { data: memberships } = await supabase
    .from('memberships')
    .select('role, organization_id')
    .eq('user_id', user.id)
    .eq('is_active', true)

  return (memberships || []).map(m => ({
    role_key: m.role === 'consultant' ? 'consultant_ssm' : m.role,
    role_name: m.role,
    company_id: m.organization_id,
    location_id: null,
    expires_at: null,
    is_active: true,
    country_code: null,
  }))
}
```

#### `hasRole(roleKey: RoleKey)`
```typescript
export async function hasRole(roleKey: RoleKey): Promise<boolean> {
  const roles = await getMyRoles()
  return roles.some(r => r.role_key === roleKey)
}
```

#### `isSuperAdmin()`
```typescript
export async function isSuperAdmin(): Promise<boolean> {
  return hasRole('super_admin')
}
```

#### `hasPermission(resource: Resource, action: Action)`
```typescript
export async function hasPermission(
  resource: Resource,
  action: Action
): Promise<boolean> {
  const supabase = await createSupabaseServer()
  const roles = await getMyRoles()

  if (roles.some(r => r.role_key === 'super_admin')) return true

  const roleIds = await supabase
    .from('roles')
    .select('id')
    .in('role_key', roles.map(r => r.role_key))

  const { data: permissions } = await supabase
    .from('permissions')
    .select('*')
    .in('role_id', roleIds.map(r => r.id))
    .eq('resource', resource)
    .eq('action', action)
    .eq('is_active', true)

  return (permissions || []).length > 0
}
```

#### `getMyOrgIds()`
```typescript
export async function getMyOrgIds(): Promise<string[]> {
  if (await isSuperAdmin()) {
    const supabase = await createSupabaseServer()
    const { data } = await supabase.from('organizations').select('id')
    return (data || []).map(o => o.id)
  }

  const roles = await getMyRoles()
  return roles
    .map(r => r.company_id)
    .filter((id): id is string => id !== null)
}
```

---

## 3. Tabele Core (Operaționale)

### 3.1 `organizations`

**Scop:** Firme client cu care lucrează consultanții SSM/PSI

**Coloane principale:**
- `id` (UUID, PK)
- `name`, `cui`, `address`, `county`, `country_code`
- `contact_email`, `contact_phone`
- `data_completeness` (0-100%)
- `employee_count`, `exposure_score`, `cooperation_status`
- `preferred_channels` (ARRAY)
- `created_at`, `updated_at`

#### Politici RLS

##### SELECT
```sql
CREATE POLICY "organizations_select_policy"
  ON public.organizations FOR SELECT
  USING (
    public.is_super_admin()
    OR
    id IN (SELECT public.get_user_org_ids())
  );
```

**Acces:**
- ✅ Super admin: TOATE organizațiile
- ✅ Consultant/Firma admin: Organizațiile lor
- ❌ Angajat: Doar organizația proprie

**Exemplu SQL:**
```sql
-- Consultant vede clienții săi
SELECT * FROM organizations;
-- RLS aplică automat: WHERE id IN (user's org_ids)
```

---

##### INSERT
```sql
CREATE POLICY "organizations_insert_policy"
  ON public.organizations FOR INSERT
  WITH CHECK (
    public.is_super_admin()
    OR
    public.is_consultant()
  );
```

**Acces:**
- ✅ Super admin: ✓
- ✅ Consultant: ✓
- ❌ Firma admin: ✗ (nu poate crea alte firme)
- ❌ Angajat: ✗

---

##### UPDATE
```sql
CREATE POLICY "organizations_update_policy"
  ON public.organizations FOR UPDATE
  USING (
    public.is_super_admin()
    OR
    (id IN (SELECT public.get_user_org_ids())
     AND public.has_role_in_org(id, 'consultant_ssm'))
    OR
    (id IN (SELECT public.get_user_org_ids())
     AND public.has_role_in_org(id, 'firma_admin'))
  );
```

**Acces:**
- ✅ Super admin: TOATE
- ✅ Consultant: Clienții săi
- ✅ Firma admin: Doar firma proprie
- ❌ Angajat: ✗

---

##### DELETE
```sql
CREATE POLICY "organizations_delete_policy"
  ON public.organizations FOR DELETE
  USING (
    public.is_super_admin()
    OR
    public.is_consultant()
  );
```

**Acces:**
- ✅ Super admin: ✓
- ✅ Consultant: ✓ (soft delete preferat)
- ❌ Firma admin: ✗
- ❌ Angajat: ✗

---

### 3.2 `profiles`

**Scop:** Date profil utilizator (full_name, phone, avatar_url)

**Coloane:**
- `id` (UUID, FK → auth.users)
- `full_name`
- `phone`
- `avatar_url`
- `created_at`

#### Politici RLS

##### SELECT
```sql
CREATE POLICY "profiles_select_policy"
  ON public.profiles FOR SELECT
  USING (
    -- Own profile
    id = auth.uid()
    OR
    -- Colleagues in same org
    id IN (
      SELECT m2.user_id FROM memberships m1
      JOIN memberships m2 ON m1.organization_id = m2.organization_id
      WHERE m1.user_id = auth.uid() AND m1.is_active = true AND m2.is_active = true
    )
    OR
    -- Super admin
    public.is_super_admin()
  );
```

**Acces:**
- ✅ Propriu profil: ✓
- ✅ Colegi din aceeași organizație: ✓
- ✅ Super admin: TOATE

---

##### UPDATE
```sql
CREATE POLICY "profiles_update_policy"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());
```

**Acces:**
- ✅ Doar propriul profil

---

### 3.3 `memberships` (Legacy — în migrare)

**Scop:** Relație utilizator ↔ organizație cu rol hardcodat

**Coloane:**
- `id` (UUID)
- `user_id` (FK → auth.users)
- `organization_id` (FK → organizations)
- `role` (consultant | firma_admin | angajat)
- `is_active` (BOOLEAN)
- `joined_at`

**IMPORTANT:** Tabel menținut pentru compatibilitate. Noul sistem RBAC folosește `user_roles`.

#### Politici RLS

##### SELECT
```sql
CREATE POLICY "memberships_select_policy"
  ON public.memberships FOR SELECT
  USING (
    user_id = auth.uid()
    OR
    public.is_consultant()
    OR
    public.is_super_admin()
  );
```

**Acces:**
- ✅ Proprii memberships: ✓
- ✅ Consultant: TOATE (vede toți membrii)
- ✅ Super admin: TOATE

---

##### INSERT / UPDATE / DELETE
```sql
CREATE POLICY "memberships_write_policy"
  ON public.memberships FOR ALL
  USING (
    public.is_consultant()
    OR
    public.is_super_admin()
  );
```

**Acces:**
- ✅ Consultant: ✓ (poate adăuga/șterge membri)
- ✅ Super admin: ✓
- ❌ Firma admin: ✗ (trebuie să contacteze consultantul)

---

### 3.4 `employees`

**Scop:** Angajați firmă cu date contract, COR, medical

**Coloane principale:**
- `id` (UUID)
- `organization_id` (FK)
- `user_id` (FK → auth.users, nullable)
- `full_name`, `cnp_hash` (SHA-256)
- `job_title`, `cor_code` (Clasificarea Ocupațiilor)
- `employment_status` (active | departed | suspended)
- `hiring_date`
- `created_at`, `updated_at`

#### Politici RLS (Updated Feb 8, 2026)

##### SELECT
```sql
CREATE POLICY "employees_select_policy"
  ON public.employees FOR SELECT TO authenticated
  USING (
    public.is_super_admin()
    OR
    organization_id IN (SELECT public.get_user_org_ids())
    OR
    (user_id IS NOT NULL AND user_id = auth.uid())
  );
```

**Acces:**
- ✅ Super admin: TOȚI angajații
- ✅ Consultant: Angajații clienților săi
- ✅ Firma admin: Angajații firmei proprii
- ✅ Angajat: Propriul profil de angajat

**Exemplu:**
```sql
-- Angajat vede doar propriul record
SELECT * FROM employees WHERE user_id = auth.uid();

-- Consultant vede toți angajații clienților
SELECT * FROM employees; -- RLS aplică filtru automat
```

---

##### INSERT
```sql
CREATE POLICY "employees_insert_policy"
  ON public.employees FOR INSERT TO authenticated
  WITH CHECK (
    public.is_super_admin()
    OR
    organization_id IN (SELECT public.get_user_org_ids())
  );
```

**Acces:**
- ✅ Super admin: ✓
- ✅ Consultant: ✓ (clienții săi)
- ✅ Firma admin: ✓ (firma proprie)
- ❌ Angajat: ✗

---

##### UPDATE / DELETE
```sql
CREATE POLICY "employees_update_policy"
  ON public.employees FOR UPDATE TO authenticated
  USING (
    public.is_super_admin()
    OR
    organization_id IN (SELECT public.get_user_org_ids())
  );

CREATE POLICY "employees_delete_policy"
  ON public.employees FOR DELETE TO authenticated
  USING (
    public.is_super_admin()
    OR
    organization_id IN (SELECT public.get_user_org_ids())
  );
```

**Acces:** Identic cu INSERT

---

### 3.5 `locations`

**Scop:** Locații de muncă (sedii, șantiere, depozite)

**Coloane:**
- `id`, `organization_id`
- `name`, `address`, `county`
- `latitude`, `longitude`
- `capacity`, `hazard_level`

#### Politici RLS

##### SELECT
```sql
CREATE POLICY "locations_select_policy"
  ON public.locations FOR SELECT
  USING (
    organization_id IN (SELECT public.get_user_org_ids())
  );
```

##### INSERT / UPDATE
```sql
CREATE POLICY "locations_write_policy"
  ON public.locations FOR INSERT
  WITH CHECK (
    organization_id IN (SELECT public.get_user_org_ids())
    AND (
      public.has_role_in_org(organization_id, 'consultant_ssm')
      OR public.has_role_in_org(organization_id, 'firma_admin')
    )
  );
```

##### DELETE
```sql
CREATE POLICY "locations_delete_policy"
  ON public.locations FOR DELETE
  USING (
    organization_id IN (SELECT public.get_user_org_ids())
    AND public.is_consultant()
  );
```

**Acces:**
- ✅ SELECT: Membrii organizației
- ✅ INSERT/UPDATE: Consultant + Firma admin
- ✅ DELETE: Doar consultant

---

### 3.6 `medical_records`

**Scop:** Controale medicale medicina muncii (periodic, angajare, supraveghere)

**Coloane:**
- `id`, `organization_id`
- `employee_name`, `cnp_hash`, `job_title`
- `examination_type` (periodic | angajare | reluare | la_cerere | supraveghere)
- `examination_date`, `expiry_date`
- `result` (apt | apt_conditionat | inapt_temporar | inapt)
- `restrictions`, `doctor_name`, `clinic_name`
- `content_version`, `legal_basis_version`

#### Politici RLS

##### SELECT
```sql
CREATE POLICY "medical_records_select_policy"
  ON public.medical_records FOR SELECT
  USING (
    organization_id IN (SELECT public.get_user_org_ids())
    OR
    public.is_super_admin()
  );
```

**Acces:**
- ✅ Membrii organizației: ✓
- ✅ Super admin: ✓

**Note securitate:**
- CNP este SHA-256 hash (nu plaintext)
- Field-level restrictions aplicate în app layer pentru angajați (ei nu văd CNP-uri colegi)

---

##### INSERT / UPDATE
```sql
CREATE POLICY "medical_records_write_policy"
  ON public.medical_records FOR INSERT
  WITH CHECK (
    organization_id IN (SELECT public.get_user_org_ids())
    AND (
      public.has_role_in_org(organization_id, 'consultant_ssm')
      OR public.has_role_in_org(organization_id, 'firma_admin')
      OR public.has_role_in_org(organization_id, 'medic_mm')
    )
  );
```

**Acces:**
- ✅ Consultant: ✓
- ✅ Firma admin: ✓
- ✅ Medic medicina muncii: ✓
- ❌ Angajat: ✗

---

##### DELETE
```sql
CREATE POLICY "medical_records_delete_policy"
  ON public.medical_records FOR DELETE
  USING (
    organization_id IN (SELECT public.get_user_org_ids())
    AND public.is_consultant()
  );
```

**Acces:**
- ✅ Doar consultant (soft delete preferat)

---

### 3.7 `safety_equipment`

**Scop:** Echipamente PSI (stingătoare, trusă, hidranți, detectoare, etc.)

**Coloane:**
- `id`, `organization_id`
- `equipment_type` (stingator | trusa_prim_ajutor | hidrant | detector_fum | etc.)
- `description`, `location`, `serial_number`
- `last_inspection_date`, `expiry_date`, `next_inspection_date`
- `inspector_name`, `is_compliant`
- `content_version`, `legal_basis_version`

#### Politici RLS

Identice cu `medical_records`:
- SELECT: Membrii organizației
- INSERT/UPDATE: Consultant + Firma admin + Furnizor PSI
- DELETE: Consultant only

---

### 3.8 `notification_log`

**Scop:** Audit trail alerte trimise (email, SMS, WhatsApp, push)

**Coloane:**
- `id`, `organization_id`, `notification_type`
- `channel` (email | sms | whatsapp | push | calendar)
- `recipient`, `status` (sent | delivered | opened | actioned | ignored | failed)
- `sent_at`, `delivered_at`, `opened_at`, `actioned_at`
- `metadata` (JSONB)

#### Politici RLS

##### SELECT
```sql
CREATE POLICY "notification_log_select_policy"
  ON public.notification_log FOR SELECT
  USING (
    organization_id IN (SELECT public.get_user_org_ids())
    OR
    public.is_consultant()
  );
```

**Acces:**
- ✅ Membrii organizației: Propriile notificări
- ✅ Consultant: TOATE (monitor global)

---

##### INSERT
```sql
CREATE POLICY "notification_log_insert_policy"
  ON public.notification_log FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
  );
```

**Acces:**
- ✅ Service role only (inserate automat de Edge Functions)

---

### 3.9 `training_modules`

**Scop:** 9 cursuri standard SSM/PSI (General, PSI, Echipamente, Periodic, etc.)

**Coloane:**
- `id`, `name`, `description`
- `duration_minutes`
- `content_version`, `legal_basis_version`

#### Politici RLS

##### SELECT
```sql
CREATE POLICY "training_modules_select_policy"
  ON public.training_modules FOR SELECT
  USING (auth.role() = 'authenticated');
```

**Acces:**
- ✅ Toți utilizatorii autentificați (catalog public)

---

##### INSERT / UPDATE / DELETE
```sql
CREATE POLICY "training_modules_write_policy"
  ON public.training_modules FOR ALL
  USING (
    public.is_consultant()
    OR
    public.has_role(auth.uid(), 'training_provider')
  );
```

**Acces:**
- ✅ Consultant: ✓
- ✅ Training provider: ✓

---

### 3.10 `training_assignments`

**Scop:** Alocare cursuri către angajați

**Coloane:**
- `id`, `organization_id`, `employee_id`, `module_id`
- `assigned_by`, `assigned_at`, `due_date`
- `is_required`

#### Politici RLS

##### SELECT
```sql
CREATE POLICY "training_assignments_select_policy"
  ON public.training_assignments FOR SELECT
  USING (
    organization_id IN (SELECT public.get_user_org_ids())
  );
```

##### INSERT / UPDATE
```sql
CREATE POLICY "training_assignments_write_policy"
  ON public.training_assignments FOR INSERT
  WITH CHECK (
    organization_id IN (SELECT public.get_user_org_ids())
    AND (
      public.has_role_in_org(organization_id, 'consultant_ssm')
      OR public.has_role_in_org(organization_id, 'firma_admin')
    )
  );
```

**Acces:**
- ✅ SELECT: Membrii organizației
- ✅ INSERT/UPDATE: Consultant + Firma admin

---

### 3.11 `training_sessions`

**Scop:** Progres angajat pe curs (status, quiz, certificat)

**Coloane:**
- `id`, `assignment_id`, `employee_id`, `organization_id`
- `status` (not_started | in_progress | completed | passed | failed)
- `started_at`, `completed_at`, `score`
- `certificate_issued_at`

#### Politici RLS

##### SELECT
```sql
CREATE POLICY "training_sessions_select_policy"
  ON public.training_sessions FOR SELECT
  USING (
    -- Employee sees own
    employee_id = (SELECT id FROM employees WHERE user_id = auth.uid())
    OR
    -- Organization members see all
    organization_id IN (SELECT public.get_user_org_ids())
  );
```

**Acces:**
- ✅ Angajat: Propriile sesiuni
- ✅ Consultant/Firma admin: Toate sesiunile organizației

---

##### INSERT / UPDATE
```sql
CREATE POLICY "training_sessions_write_policy"
  ON public.training_sessions FOR INSERT
  WITH CHECK (
    -- Auto-save progress: any authenticated user
    auth.role() = 'authenticated'
  );
```

**Acces:**
- ✅ Orice utilizator autentificat (auto-save progres)
- RLS la nivel SELECT garantează că nu vezi altele

---

## 4. Tabele RBAC (Sistem Dinamic)

### 4.1 `roles`

**Scop:** Definiții roluri (27 roluri: 4 sistem + 13 RO + 10 multi-țară)

**Coloane:**
- `id` (UUID)
- `role_key` (UNIQUE: consultant_ssm, firma_admin, super_admin, etc.)
- `role_name`, `description`
- `country_code` (NULL = global, 'RO'/'BG'/'HU'/'DE'/'PL')
- `is_system` (protejat de ștergere)
- `is_active`
- `metadata` (JSONB: tier, color, icon)

#### Politici RLS

##### SELECT
```sql
CREATE POLICY "roles_select_policy"
  ON public.roles FOR SELECT
  USING (auth.role() = 'authenticated');
```

**Acces:**
- ✅ Toți utilizatorii (catalog roluri public)

---

##### INSERT / UPDATE / DELETE
```sql
CREATE POLICY "roles_write_policy"
  ON public.roles FOR ALL
  USING (public.is_super_admin());
```

**Acces:**
- ✅ Doar super_admin

---

### 4.2 `permissions`

**Scop:** Permisiuni granulare (resource × action + field restrictions)

**Coloane:**
- `id`, `role_id` (FK → roles)
- `resource` (employees, equipment, medical, documents, etc.)
- `action` (create | read | update | delete | export | delegate)
- `field_restrictions` (JSONB: {cnp: 'masked', salary: 'hidden'})
- `conditions` (JSONB: {own_company: true, own_user: true})
- `country_code`, `is_active`

**210+ permisiuni definite:**
- super_admin: 114 (toate resursele × toate acțiunile)
- consultant_ssm: 75 (CRUD + export pe resurse operaționale)
- firma_admin: 16 (read + create/update limitate, condiție own_company)
- angajat: 5 (read doar date proprii)

#### Politici RLS

##### SELECT
```sql
CREATE POLICY "permissions_select_policy"
  ON public.permissions FOR SELECT
  USING (auth.role() = 'authenticated');
```

**Acces:**
- ✅ Toți utilizatorii (pentru verificare permisiuni în app)

---

##### INSERT / UPDATE / DELETE
```sql
CREATE POLICY "permissions_write_policy"
  ON public.permissions FOR ALL
  USING (public.is_super_admin());
```

**Acces:**
- ✅ Doar super_admin

---

### 4.3 `user_roles`

**Scop:** Asignări user ↔ role ↔ organization (înlocuiește memberships.role hardcodat)

**Coloane:**
- `id`, `user_id` (FK → auth.users)
- `role_id` (FK → roles)
- `company_id` (FK → organizations)
- `location_id` (FK → locations, optional)
- `granted_by`, `granted_at`
- `expires_at` (NULL = permanent, DATE = temporar)
- `is_active`

**Constraint unic:** (user_id, role_id, company_id)

#### Politici RLS

##### SELECT
```sql
CREATE POLICY "user_roles_select_policy"
  ON public.user_roles FOR SELECT
  USING (
    user_id = auth.uid()
    OR
    public.is_consultant()
    OR
    public.is_super_admin()
  );
```

**Acces:**
- ✅ Propriile roluri: ✓
- ✅ Consultant: TOATE (vede toți membrii)
- ✅ Super admin: TOATE

---

##### INSERT / UPDATE / DELETE
```sql
CREATE POLICY "user_roles_write_policy"
  ON public.user_roles FOR ALL
  USING (public.is_super_admin());
```

**Acces:**
- ✅ Doar super_admin (grant/revoke roluri)

---

## 5. Tabele Configurare & Lookup

### 5.1 `alert_categories`

**Scop:** Categorii alerte configurabile (60 records: 12 types × 5 țări)

**Coloane:**
- `id`, `country_code`, `name`, `description`
- `severity` (info | warning | critical | expired)
- `warning_days_before`, `critical_days_before`
- `obligation_id` (FK optional)
- `notify_channels` (ARRAY: email | whatsapp | sms | push)
- `is_active`, `is_system`, `display_order`

#### Politici RLS

##### SELECT
```sql
CREATE POLICY "alert_categories_select_policy"
  ON public.alert_categories FOR SELECT
  USING (auth.role() = 'authenticated');
```

##### INSERT / UPDATE / DELETE
```sql
CREATE POLICY "alert_categories_write_policy"
  ON public.alert_categories FOR ALL
  USING (public.is_super_admin());
```

---

### 5.2 `obligation_types`

**Scop:** Obligații legale SSM/PSI (60 records: 12 types × 5 țări)

**Coloane:**
- `id`, `country_code`, `name`, `description`
- `frequency` (annual | biannual | monthly | quarterly | on_demand | once)
- `authority_name`, `legal_reference`
- `penalty_min`, `penalty_max`, `currency`
- `is_active`, `is_system`, `display_order`

#### Politici RLS

Identice cu `alert_categories`:
- SELECT: Toți autentificați
- WRITE: Super admin only

---

### 5.3 `equipment_types`

**Scop:** Categorii echipamente (103 records: ~20 types × 5 țări)

**Coloane:**
- `id`, `country_code`, `name`, `description`
- `category` (fire_safety | first_aid | ppe | emergency_exit | detection | pressure_equipment | lifting_equipment | other)
- `subcategory`, `inspection_frequency`, `legal_standard`
- `obligation_id`, `max_lifespan_years`
- `requires_certification`, `certification_authority`
- `is_active`, `is_system`, `display_order`

#### Politici RLS

Identice cu `alert_categories`

---

## 6. Tabele Integrare REGES

**Context:** Integrare REGES (Registrul Electronic General pentru Evidența Salariaților) — API ANRE (România)

### 6.1 `reges_connections`

**Scop:** Configurare conexiuni API REGES per organizație

**Coloane:**
- `id`, `organization_id`, `cui`
- `reges_user_id`, `reges_employer_id` (credențiale ANRE)
- `status` (active | inactive | error)
- `last_sync_at`, `error_message`
- `encrypted_credentials` (AES-256-GCM)
- `encryption_key_version` (v1)

#### Politici RLS

##### SELECT
```sql
CREATE POLICY "Users can view connections for their organizations"
  ON reges_connections FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );
```

**Acces:**
- ✅ Membrii organizației

---

##### INSERT / UPDATE
```sql
CREATE POLICY "Users can insert connections for their organizations"
  ON reges_connections FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true AND role IN ('consultant', 'firma_admin')
    )
  );

CREATE POLICY "Users can update connections for their organizations"
  ON reges_connections FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true AND role IN ('consultant', 'firma_admin')
    )
  );
```

**Acces:**
- ✅ Consultant: ✓
- ✅ Firma admin: ✓
- ❌ Angajat: ✗

---

##### DELETE
```sql
-- No explicit DELETE policy — implicit deny
-- În practică: doar consultant sau super_admin (via service_role)
```

---

### 6.2 `reges_outbox`

**Scop:** Coadă mesaje de trimis către REGES (employee_create, contract_update, etc.)

**Coloane:**
- `id`, `organization_id`, `connection_id`
- `message_type` (employee_create | employee_update | employee_delete | contract_create | contract_update | contract_end)
- `payload` (JSONB — format REGES)
- `status` (queued | sending | sent | accepted | rejected | error)
- `priority` (1-10, 1=highest)
- `attempts`, `max_attempts`
- `scheduled_at`, `sent_at`, `completed_at`
- `error_message`, `receipt_id`

#### Politici RLS

##### SELECT
```sql
CREATE POLICY "Users can view outbox for their organizations"
  ON reges_outbox FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );
```

**Acces:**
- ✅ Membrii organizației (view queue status)

---

##### INSERT / UPDATE / DELETE
```sql
-- Implicit: service_role only (API background job)
-- Utilizatorii nu inserează manual în outbox
```

---

### 6.3 `reges_receipts`

**Scop:** Confirmări primite de la REGES pentru mesaje trimise

**Coloane:**
- `id`, `outbox_id` (FK)
- `receipt_number`, `receipt_date`
- `status` (accepted | rejected | pending_validation)
- `validation_errors` (JSONB)
- `raw_response` (JSONB)

#### Politici RLS

##### SELECT
```sql
CREATE POLICY "Users can view receipts for their outbox"
  ON reges_receipts FOR SELECT
  USING (
    outbox_id IN (
      SELECT id FROM reges_outbox
      WHERE organization_id IN (
        SELECT organization_id FROM memberships
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );
```

**Acces:**
- ✅ Membrii organizației (via outbox)

---

### 6.4 `reges_results`

**Scop:** Rezultate procesare REGES (success/failure + ID-uri generate)

**Coloane:**
- `id`, `receipt_id` (FK)
- `result_type` (success | partial_success | failure)
- `employee_external_id`, `contract_external_id`
- `reges_employee_id`, `reges_contract_id`
- `details` (JSONB)

#### Politici RLS

##### SELECT
```sql
CREATE POLICY "Users can view results for their receipts"
  ON reges_results FOR SELECT
  USING (
    receipt_id IN (
      SELECT r.id FROM reges_receipts r
      JOIN reges_outbox o ON r.outbox_id = o.id
      WHERE o.organization_id IN (
        SELECT organization_id FROM memberships
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );
```

**Acces:**
- ✅ Membrii organizației (via receipts → outbox)

---

### 6.5 `reges_employee_snapshots`

**Scop:** Snapshots angajați sincronizați din REGES (historical data)

**Coloane:**
- `id`, `connection_id`, `organization_id`
- `cnp`, `full_name`, `reges_employee_id`
- `position`, `contract_type`
- `employment_status` (active | departed | suspended)
- `start_date`, `end_date`, `snapshot_date`
- `raw_data` (JSONB)

**Constraint:** UNIQUE (connection_id, cnp, snapshot_date)

#### Politici RLS

##### SELECT
```sql
CREATE POLICY "Users can view snapshots for their organizations"
  ON reges_employee_snapshots FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );
```

##### INSERT / UPDATE / DELETE
```sql
-- Service role only (API sync job)
```

---

### 6.6 `audit_log`

**Scop:** Audit trail complet toate operațiuni (REGES + general platform)

**Coloane:**
- `id`, `organization_id`, `user_id`
- `action`, `entity_type` (reges_connection | employee | contract | organization | user)
- `entity_id`, `old_values` (JSONB), `new_values` (JSONB)
- `metadata` (JSONB: source, trigger, etc.)
- `ip_address`, `user_agent`

#### Politici RLS

##### SELECT (Consultants)
```sql
CREATE POLICY "Consultants can view all audit logs"
  ON audit_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE user_id = auth.uid() AND role = 'consultant' AND is_active = true
    )
  );
```

**Acces:**
- ✅ Consultant: TOATE (monitor global platformă)

---

##### SELECT (Others)
```sql
CREATE POLICY "Users can view audit logs for their organizations"
  ON audit_log FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );
```

**Acces:**
- ✅ Membrii organizației: Doar audit-ul firmei lor

---

##### INSERT
```sql
-- Service role only (triggers, Edge Functions)
```

---

## 7. Storage Buckets

### 7.1 `avatars` (Public)

**Scop:** Avatar-uri utilizatori (profile pictures)

**Created:** Feb 13, 2026

#### Politici RLS (storage.objects)

##### SELECT
```sql
CREATE POLICY "Public avatar access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
```

**Acces:**
- ✅ Public (oricine poate vedea avatare)

---

##### INSERT
```sql
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

**Acces:**
- ✅ Utilizatori autentificați (doar în folder propriu: `avatars/{user_id}/...`)

---

##### UPDATE
```sql
CREATE POLICY "Users can update own avatars"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

##### DELETE
```sql
CREATE POLICY "Users can delete own avatars"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

### 7.2 `fisa-documents` (Private)

**Scop:** Documente Fișă Aptitudine (PDF-uri medicina muncii)

**Created:** Feb 7, 2026

**Structură folder:** `fisa-documents/{org_id}/{employee_id}/{filename}.pdf`

#### Politici RLS (storage.objects)

##### SELECT
```sql
CREATE POLICY "Users can view fisa documents for their organizations"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'fisa-documents'
    AND (storage.foldername(name))[1] IN (
      SELECT organization_id::text FROM memberships
      WHERE user_id = auth.uid() AND is_active = true
    )
  );
```

**Acces:**
- ✅ Membrii organizației (doar folder-ul organizației lor)

**Exemplu:**
```typescript
// Consultant cu org_id = '123' vede:
// fisa-documents/123/emp-456/fisa.pdf ✓
// fisa-documents/999/emp-789/fisa.pdf ✗ (altă organizație)
```

---

##### INSERT / UPDATE / DELETE
```sql
CREATE POLICY "Service role can manage fisa documents"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'fisa-documents'
    AND auth.role() = 'service_role'
  );
```

**Acces:**
- ✅ Service role only (upload automat via Edge Function)
- ❌ Utilizatori: nu pot șterge manual (doar view/download)

---

## 8. Matrice Completă Acces

### 8.1 Resurse Operaționale (Core)

| Tabel | Super Admin | Consultant | Firma Admin | Angajat |
|-------|-------------|------------|-------------|---------|
| **organizations** | | | | |
| SELECT | ✅ TOATE | ✅ Clienți | ✅ Firma proprie | ✅ Firma proprie |
| INSERT | ✅ | ✅ | ❌ | ❌ |
| UPDATE | ✅ TOATE | ✅ Clienți | ✅ Firma proprie | ❌ |
| DELETE | ✅ | ✅ | ❌ | ❌ |
| **employees** | | | | |
| SELECT | ✅ TOȚI | ✅ Clienți | ✅ Firma proprie | ✅ Profil propriu |
| INSERT | ✅ | ✅ | ✅ | ❌ |
| UPDATE | ✅ | ✅ | ✅ | ❌ |
| DELETE | ✅ | ✅ | ✅ | ❌ |
| **locations** | | | | |
| SELECT | ✅ | ✅ | ✅ | ✅ |
| INSERT/UPDATE | ✅ | ✅ | ✅ | ❌ |
| DELETE | ✅ | ✅ | ❌ | ❌ |
| **medical_records** | | | | |
| SELECT | ✅ TOATE | ✅ Clienți | ✅ Firma proprie | ✅ Firma proprie* |
| INSERT/UPDATE | ✅ | ✅ | ✅ | ❌ |
| DELETE | ✅ | ✅ | ❌ | ❌ |
| **safety_equipment** | | | | |
| SELECT | ✅ | ✅ | ✅ | ✅ |
| INSERT/UPDATE | ✅ | ✅ | ✅ | ❌ |
| DELETE | ✅ | ✅ | ❌ | ❌ |
| **training_sessions** | | | | |
| SELECT | ✅ | ✅ | ✅ | ✅ Proprii |
| INSERT/UPDATE | ✅ | ✅ AUTO-SAVE | ✅ AUTO-SAVE | ✅ AUTO-SAVE |

*Field-level restrictions: angajatul NU vede CNP colegi (mascat în app layer)

---

### 8.2 Resurse RBAC & Config

| Tabel | Super Admin | Consultant | Firma Admin | Angajat |
|-------|-------------|------------|-------------|---------|
| **roles** | | | | |
| SELECT | ✅ | ✅ Catalog | ✅ Catalog | ✅ Catalog |
| INSERT/UPDATE/DELETE | ✅ | ❌ | ❌ | ❌ |
| **permissions** | | | | |
| SELECT | ✅ | ✅ Catalog | ✅ Catalog | ✅ Catalog |
| INSERT/UPDATE/DELETE | ✅ | ❌ | ❌ | ❌ |
| **user_roles** | | | | |
| SELECT | ✅ TOATE | ✅ TOATE | ✅ Proprii | ✅ Proprii |
| INSERT/UPDATE/DELETE | ✅ | ❌ | ❌ | ❌ |
| **alert_categories** | | | | |
| SELECT | ✅ | ✅ | ✅ | ✅ |
| INSERT/UPDATE/DELETE | ✅ | ❌ | ❌ | ❌ |

---

### 8.3 Resurse REGES

| Tabel | Super Admin | Consultant | Firma Admin | Angajat |
|-------|-------------|------------|-------------|---------|
| **reges_connections** | | | | |
| SELECT | ✅ | ✅ Clienți | ✅ Firma proprie | ❌ |
| INSERT/UPDATE | ✅ | ✅ | ✅ | ❌ |
| DELETE | ✅ | ✅ | ❌ | ❌ |
| **reges_outbox** | | | | |
| SELECT | ✅ | ✅ Clienți | ✅ Firma proprie | ❌ |
| INSERT/UPDATE/DELETE | 🤖 Service role | 🤖 Service role | 🤖 Service role | 🤖 Service role |
| **reges_receipts** | | | | |
| SELECT | ✅ | ✅ Via outbox | ✅ Via outbox | ❌ |
| **reges_results** | | | | |
| SELECT | ✅ | ✅ Via receipts | ✅ Via receipts | ❌ |
| **audit_log** | | | | |
| SELECT | ✅ TOATE | ✅ TOATE | ✅ Firma proprie | ✅ Firma proprie |
| INSERT | 🤖 Service role | 🤖 Service role | 🤖 Service role | 🤖 Service role |

🤖 = Automat (triggers, Edge Functions, CRON jobs)

---

### 8.4 Storage Buckets

| Bucket | Super Admin | Consultant | Firma Admin | Angajat |
|--------|-------------|------------|-------------|---------|
| **avatars** (public) | | | | |
| SELECT | ✅ Public | ✅ Public | ✅ Public | ✅ Public |
| INSERT | ✅ Folder propriu | ✅ Folder propriu | ✅ Folder propriu | ✅ Folder propriu |
| UPDATE/DELETE | ✅ Folder propriu | ✅ Folder propriu | ✅ Folder propriu | ✅ Folder propriu |
| **fisa-documents** (private) | | | | |
| SELECT | ✅ TOATE | ✅ Org-uri clienți | ✅ Firma proprie | ✅ Firma proprie |
| INSERT/UPDATE/DELETE | 🤖 Service role | 🤖 Service role | 🤖 Service role | 🤖 Service role |

---

## 9. Patternuri RLS & Best Practices

### 9.1 Patternuri Comune

#### Pattern 1: Organization-Scoped (cel mai folosit)
```sql
-- SELECT/INSERT/UPDATE/DELETE
USING (
  organization_id IN (SELECT public.get_user_org_ids())
)
```

**Când se folosește:**
- Toate tabelele cu `organization_id` FK
- Asigură izolare multi-tenancy strictă

---

#### Pattern 2: Role-Based Access
```sql
-- Doar anumite roluri pot face INSERT/UPDATE/DELETE
WITH CHECK (
  organization_id IN (SELECT public.get_user_org_ids())
  AND (
    public.has_role_in_org(organization_id, 'consultant_ssm')
    OR public.has_role_in_org(organization_id, 'firma_admin')
  )
)
```

**Când se folosește:**
- CREATE/UPDATE/DELETE pe resurse critice (employees, medical_records)
- Previne angajații să modifice date

---

#### Pattern 3: Own User Access
```sql
-- SELECT
USING (
  user_id = auth.uid()
  OR
  organization_id IN (SELECT public.get_user_org_ids())
)
```

**Când se folosește:**
- `profiles` (user vede profil propriu + colegi)
- `training_sessions` (angajat vede progres propriu)
- `employees` (employee record legat de user_id)

---

#### Pattern 4: Service Role (Background Jobs)
```sql
-- INSERT (pentru audit_log, notification_log, reges_outbox)
WITH CHECK (auth.role() = 'service_role')
```

**Când se folosește:**
- Triggers (log changes)
- Edge Functions (send emails, REGES sync)
- CRON jobs (scheduled alerts)

---

#### Pattern 5: Storage Folder-Based
```sql
-- SELECT storage.objects
USING (
  bucket_id = 'fisa-documents'
  AND (storage.foldername(name))[1] IN (
    SELECT organization_id::text FROM memberships
    WHERE user_id = auth.uid() AND is_active = true
  )
)
```

**Când se folosește:**
- Storage buckets organizate pe `{org_id}/{entity_id}/file.pdf`
- Garantează că user nu accesează folder-e alte organizații

---

### 9.2 Optimizări Performanță

#### Indexuri Critice
```sql
-- Tabele cu RLS bazat pe organization_id
CREATE INDEX idx_employees_org ON employees(organization_id);
CREATE INDEX idx_medical_records_org ON medical_records(organization_id);
CREATE INDEX idx_equipment_org ON safety_equipment(organization_id);

-- Tabele cu RLS bazat pe user_id
CREATE INDEX idx_memberships_user ON memberships(user_id) WHERE is_active = true;
CREATE INDEX idx_user_roles_user ON user_roles(user_id) WHERE is_active = true;

-- Tabele cu RLS bazat pe status/date
CREATE INDEX idx_reges_outbox_status ON reges_outbox(status, scheduled_at);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);
```

---

#### Evitare N+1 Queries
```typescript
// BAD: query per employee (RLS verifies org per employee)
for (const employee of employees) {
  const medical = await supabase
    .from('medical_records')
    .select('*')
    .eq('employee_id', employee.id)
}

// GOOD: batch query (RLS verifies org once)
const employeeIds = employees.map(e => e.id)
const { data: medical } = await supabase
  .from('medical_records')
  .select('*')
  .in('employee_id', employeeIds)
```

---

### 9.3 Securitate

#### ✅ DO
- **Enable RLS pe TOATE tabelele** (ENABLE ROW LEVEL SECURITY)
- **Folosește funcții SECURITY DEFINER** pentru helper-e RLS (is_super_admin, get_user_org_ids)
- **Hash sensitive data** (CNP → SHA-256, passwords → bcrypt)
- **Encrypt credentials** (REGES credentials → AES-256-GCM)
- **Audit trail complet** (log ALL writes în audit_log)
- **Soft delete preferat** (deleted_at timestamp în loc de DELETE)
- **Field-level restrictions** (CNP mascat pentru angajați, salary hidden)

---

#### ❌ DON'T
- ❌ **NU dezactiva RLS** niciodată (nici pentru debugging)
- ❌ **NU folosi `USING (true)`** (bypass complet RLS)
- ❌ **NU expune service_role key** în client-side (doar în Edge Functions/Backend)
- ❌ **NU stoca plaintext secrets** (CNP, passwords, API keys)
- ❌ **NU folosi `ON DELETE CASCADE`** fără confirmare (risc ștergere masivă)
- ❌ **NU lăsa tabele fără indexuri** pe `organization_id` / `user_id`

---

### 9.4 Testing RLS

#### Verificare Politici
```sql
-- Test 1: Verifică RLS activat
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = false;
-- Result: 0 rows (toate cu RLS = true)

-- Test 2: Listează toate politicile
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;

-- Test 3: Simulează user fără consultant role
SET SESSION ROLE authenticated;
SET request.jwt.claims.sub = 'test-user-uuid';
SELECT * FROM organizations; -- Ar trebui să vadă doar org-urile sale
RESET ROLE;
```

---

#### Testing în Aplicație
```typescript
// Test: Firma admin NU poate vedea alte organizații
const { data: orgs } = await supabase.from('organizations').select('*')
console.log(orgs.length) // 1 (doar firma sa)

// Test: Consultant vede toți clienții
const { data: orgs } = await supabase.from('organizations').select('*')
console.log(orgs.length) // 10+ (toți clienții)

// Test: Angajat NU poate șterge employees
const { error } = await supabase.from('employees').delete().eq('id', 'xyz')
console.log(error) // "new row violates row-level security policy"
```

---

## 10. Referințe & Fișiere Sursă

### 10.1 Migrări SQL

| Fișier | Data | Descriere |
|--------|------|-----------|
| `supabase/migrations/20260206_reges_integration.sql` | 6 Feb 2026 | REGES tables (connections, outbox, receipts, results, audit_log) + 12 RLS policies |
| `supabase/migrations/20260207_add_cor_code_to_employees.sql` | 7 Feb 2026 | Add cor_code column to employees |
| `supabase/migrations/20260207_reges_credentials.sql` | 7 Feb 2026 | Encrypted credentials + employee_snapshots + 2 RLS policies |
| `supabase/migrations/20260207_storage_fisa.sql` | 7 Feb 2026 | Storage bucket fisa-documents + 4 RLS policies |
| `supabase/migrations/20260208_fix_employees_rls.sql` | 8 Feb 2026 | Fix employees RLS (4 policies: SELECT/INSERT/UPDATE/DELETE) |
| `supabase/migrations/20260213_user_profile_preferences.sql` | 13 Feb 2026 | User preferences + avatars storage bucket + 8 RLS policies |

---

### 10.2 Cod Aplicație

| Fișier | Scop |
|--------|------|
| `/lib/rbac.ts` | Funcții RBAC: getMyRoles, hasRole, isSuperAdmin, hasPermission, getMyOrgIds (cu fallback la memberships) |
| `/lib/types.ts` | TypeScript interfaces pentru toate tabelele |
| `/lib/supabase/server.ts` | Server-side Supabase client + getCurrentUserOrgs (SSR, Server Components) |
| `/lib/supabase/client.ts` | Browser Supabase client (Client Components) |

---

### 10.3 Documentație

| Fișier | Scop |
|--------|------|
| `/docs/DOC1_CONSOLIDARE_v9.2.md` | Prezentare completă platformă (secțiuni 2.4-2.6: DB schema, RBAC, RLS) |
| `/docs/DOC3_PLAN_EXECUTIE_v4.3.md` | Sprint history (Sprint 3: RBAC deployment Feb 8) |
| `/docs/RBAC_MIGRATION_COMPLETE.md` | SQL complet RBAC (8 secțiuni: tabele, permisiuni, policies, helpers, triggers) |
| `/DOCS/QUERY_DIAGNOSTIC_SUPABASE.sql` | Diagnostic queries (verify RLS, count policies, check indexes) |
| `/FIX_EMPLOYEES_RLS.sql` | Script fix manual employees RLS (4 policies) |

---

### 10.4 Quick Links

**Supabase Dashboard:**
- Project: `uhccxfyvhjeudkexcgiq`
- URL: https://supabase.com/dashboard/project/uhccxfyvhjeudkexcgiq
- RLS Policies: Table Editor → Select table → Settings → Policies

**Live App:**
- Production: https://app.s-s-m.ro
- Vercel Dashboard: https://vercel.com/your-org/s-s-m-ro

---

## Changelog

| Versiune | Data | Modificări |
|----------|------|------------|
| v1.0 | 13 Feb 2026 | Documentație inițială completă — 30+ tabele, 27 roluri, 210+ permisiuni |

---

**FIN DOCUMENTAȚIE SUPABASE_POLICIES.md**
