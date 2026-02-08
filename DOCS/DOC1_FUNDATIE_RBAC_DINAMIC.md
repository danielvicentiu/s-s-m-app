# DOC1 — FUNDAȚIE RBAC DINAMIC s-s-m.ro
## Actualizare: 8 februarie 2026
## Sursa: Consolidare din chat-urile anterioare (Analiza detaliată MVP→SaaS, Runda 4 SQL, Partea D RLS, Consolidare 107, Multi-Country)

---

# 1. DE CE RBAC DINAMIC ACUM — BLOCANT #1

Dacă construiești platforma cu un singur tip de utilizator (patron/firmă) și peste 3 luni vrei să adaugi Contabil, Furnizor, Consultant — trebuie să refactorizezi: schema de date, logica de autentificare, RLS policies, navigarea, dashboard-urile. E ca și cum construiești o casă fără fundație pentru etaj.

**Principiul stabilit:** Schema de date și RBAC acum. UI-ul per rol — când e nevoie.

**Effort estimat:** 3-5 zile pentru schema completă + RLS + middleware de autorizare.

---

# 2. SCHEMA SQL RBAC — TABELE NOI

## 2.1 Tabelul `roles`

```sql
-- ============================================================
-- RBAC DINAMIC — FUNDAȚIE
-- Creat: 8 feb 2026 | Sursa: Consolidare 70+ chaturi
-- ============================================================

CREATE TABLE IF NOT EXISTS roles (
  role_key TEXT PRIMARY KEY,
  role_name TEXT NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false,  -- roluri sistem (admin) nu pot fi șterse
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed roles inițiale
INSERT INTO roles (role_key, role_name, description, is_system) VALUES
  ('admin',              'Administrator',         'Daniel — vede tot, gestionează tot',                    true),
  ('consultant',         'Consultant SSM',        'Gestionează firmele alocate, creează cursuri',          true),
  ('company_admin',      'Administrator Firmă',   'Patronul — vede firma lui, managementul angajaților',   false),
  ('company_employee',   'Angajat',               'Read-only pe datele proprii, completează instruiri',    false),
  ('partner_accountant', 'Partener Contabil',     'Read-only pe firmele afiliate, export date',            false),
  ('partner_supplier',   'Partener Furnizor',     'Vede doar echipamentele din categoria lui',             false),
  ('auditor',            'Auditor Extern',        'Read-only temporar, cu expirare',                       false)
ON CONFLICT (role_key) DO NOTHING;
```

## 2.2 Tabelul `user_roles` (PIVOT — relația user ↔ rol ↔ firmă)

```sql
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_key TEXT NOT NULL REFERENCES roles(role_key),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,      -- nullable (admin = global)
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,    -- nullable (scoping per sediu)
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,                                          -- NULL = permanent, SET = temporar (auditor)
  is_active BOOLEAN DEFAULT true,
  
  -- Un user nu poate avea același rol de 2 ori pe aceeași firmă
  UNIQUE(user_id, role_key, company_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_company ON user_roles(company_id);
CREATE INDEX idx_user_roles_active ON user_roles(user_id, is_active) WHERE is_active = true;
CREATE INDEX idx_user_roles_expires ON user_roles(expires_at) WHERE expires_at IS NOT NULL;
```

## 2.3 Tabelul `permissions` (ce poate face fiecare rol)

```sql
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_key TEXT NOT NULL REFERENCES roles(role_key) ON DELETE CASCADE,
  resource TEXT NOT NULL,       -- 'companies', 'employees', 'equipment', 'trainings', etc.
  action TEXT NOT NULL,         -- 'read', 'create', 'update', 'delete', 'export'
  conditions JSONB DEFAULT '{}', -- ex: {"affiliated": true}, {"own_data_only": true}
  
  UNIQUE(role_key, resource, action)
);

-- Seed permisiuni per rol
INSERT INTO permissions (role_key, resource, action, conditions) VALUES
  -- ADMIN: totul
  ('admin', '*', '*', '{}'),
  
  -- CONSULTANT: CRUD pe firmele alocate
  ('consultant', 'companies',    'read',   '{}'),
  ('consultant', 'companies',    'update', '{}'),
  ('consultant', 'employees',    '*',      '{}'),
  ('consultant', 'equipment',    '*',      '{}'),
  ('consultant', 'trainings',    '*',      '{}'),
  ('consultant', 'medical_exams','*',      '{}'),
  ('consultant', 'documents',    '*',      '{}'),
  ('consultant', 'risk_evaluations', '*',  '{}'),
  ('consultant', 'incidents',    '*',      '{}'),
  
  -- COMPANY_ADMIN: vede firma lui, managementul angajaților
  ('company_admin', 'companies',     'read',   '{"own_company": true}'),
  ('company_admin', 'employees',     'read',   '{"own_company": true}'),
  ('company_admin', 'employees',     'create', '{"own_company": true}'),
  ('company_admin', 'equipment',     'read',   '{"own_company": true}'),
  ('company_admin', 'trainings',     'read',   '{"own_company": true}'),
  ('company_admin', 'medical_exams', 'read',   '{"own_company": true}'),
  ('company_admin', 'documents',     'read',   '{"own_company": true}'),
  ('company_admin', 'documents',     'export', '{"own_company": true}'),
  
  -- COMPANY_EMPLOYEE: read-only pe datele proprii
  ('company_employee', 'trainings',     'read', '{"own_data_only": true}'),
  ('company_employee', 'medical_exams', 'read', '{"own_data_only": true}'),
  ('company_employee', 'documents',     'read', '{"own_data_only": true}'),
  
  -- PARTNER_ACCOUNTANT: read-only pe firmele afiliate
  ('partner_accountant', 'companies',     'read',   '{"affiliated": true}'),
  ('partner_accountant', 'employees',     'read',   '{"affiliated": true}'),
  ('partner_accountant', 'documents',     'read',   '{"affiliated": true}'),
  ('partner_accountant', 'documents',     'export', '{"affiliated": true}'),
  
  -- PARTNER_SUPPLIER: doar echipamente din categoria lui
  ('partner_supplier', 'equipment', 'read',   '{"own_category": true}'),
  ('partner_supplier', 'equipment', 'update', '{"own_category": true}'),
  
  -- AUDITOR: read-only temporar
  ('auditor', 'companies',     'read', '{}'),
  ('auditor', 'employees',     'read', '{}'),
  ('auditor', 'equipment',     'read', '{}'),
  ('auditor', 'trainings',     'read', '{}'),
  ('auditor', 'medical_exams', 'read', '{}'),
  ('auditor', 'documents',     'read', '{}'),
  ('auditor', 'incidents',     'read', '{}')
ON CONFLICT (role_key, resource, action) DO NOTHING;
```

## 2.4 Tabele de relații (create ACUM, goale, populate la activare)

```sql
-- Relații firmă ↔ partener contabil
CREATE TABLE IF NOT EXISTS company_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  partner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_type TEXT NOT NULL CHECK (partner_type IN ('accountant', 'supplier', 'consultant')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(company_id, partner_user_id, partner_type)
);

CREATE INDEX idx_company_partners_company ON company_partners(company_id);
CREATE INDEX idx_company_partners_partner ON company_partners(partner_user_id);

-- Relații firmă ↔ furnizor (cu categorii echipamente)
CREATE TABLE IF NOT EXISTS company_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  supplier_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  equipment_categories TEXT[] DEFAULT '{}',  -- ['stingatoare', 'hidranți', 'EIP']
  contract_start DATE,
  contract_end DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(company_id, supplier_user_id)
);

CREATE INDEX idx_company_suppliers_company ON company_suppliers(company_id);
CREATE INDEX idx_company_suppliers_supplier ON company_suppliers(supplier_user_id);
```

---

# 3. RLS POLICIES BAZATE PE RBAC

## 3.1 Funcție helper — verificare rol curent

```sql
-- Funcție: ce roluri are user-ul curent?
CREATE OR REPLACE FUNCTION get_user_roles(p_user_id UUID DEFAULT auth.uid())
RETURNS TABLE(role_key TEXT, company_id UUID, location_id UUID) AS $$
  SELECT ur.role_key, ur.company_id, ur.location_id
  FROM user_roles ur
  WHERE ur.user_id = p_user_id
    AND ur.is_active = true
    AND (ur.expires_at IS NULL OR ur.expires_at > now())
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Funcție: este admin?
CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = p_user_id 
      AND role_key = 'admin' 
      AND is_active = true
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Funcție: user are acces la firma X?
CREATE OR REPLACE FUNCTION has_company_access(p_company_id UUID, p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = p_user_id
      AND (company_id = p_company_id OR role_key = 'admin')
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Funcție: user e partener afiliat la firma X?
CREATE OR REPLACE FUNCTION is_affiliated_partner(p_company_id UUID, p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM company_partners
    WHERE company_id = p_company_id
      AND partner_user_id = p_user_id
      AND is_active = true
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

## 3.2 RLS pe `companies`

```sql
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Admin vede tot
CREATE POLICY "companies_admin_all" ON companies
  FOR ALL USING (is_admin());

-- Consultant/Company_admin vede firmele alocate
CREATE POLICY "companies_member_read" ON companies
  FOR SELECT USING (
    has_company_access(id)
  );

-- Partener contabil vede firmele afiliate
CREATE POLICY "companies_partner_read" ON companies
  FOR SELECT USING (
    is_affiliated_partner(id)
  );
```

## 3.3 RLS pe `employees`

```sql
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Admin vede tot
CREATE POLICY "employees_admin_all" ON employees
  FOR ALL USING (is_admin());

-- Membrii firmei (consultant + company_admin) văd angajații firmei lor
CREATE POLICY "employees_company_read" ON employees
  FOR SELECT USING (
    has_company_access(company_id)
  );

-- Consultant poate CRUD
CREATE POLICY "employees_consultant_write" ON employees
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role_key IN ('consultant', 'company_admin')
        AND company_id = employees.company_id
        AND is_active = true
    )
  );

-- Angajatul vede doar datele proprii
CREATE POLICY "employees_self_read" ON employees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role_key = 'company_employee'
        AND company_id = employees.company_id
        AND is_active = true
    )
    AND user_id = auth.uid()  -- presupune legătură employee ↔ auth.users
  );
```

## 3.4 RLS pe `equipment`

```sql
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Admin vede tot
CREATE POLICY "equipment_admin_all" ON equipment
  FOR ALL USING (is_admin());

-- Membrii firmei văd echipamentele firmei lor
CREATE POLICY "equipment_company_read" ON equipment
  FOR SELECT USING (
    has_company_access(company_id)
  );

-- Furnizor vede doar echipamentele din categoria lui
CREATE POLICY "equipment_supplier_read" ON equipment
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM company_suppliers cs
      WHERE cs.company_id = equipment.company_id
        AND cs.supplier_user_id = auth.uid()
        AND cs.is_active = true
        AND equipment.category = ANY(cs.equipment_categories)
    )
  );

-- Furnizor poate actualiza echipamentele din categoria lui
CREATE POLICY "equipment_supplier_update" ON equipment
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM company_suppliers cs
      WHERE cs.company_id = equipment.company_id
        AND cs.supplier_user_id = auth.uid()
        AND cs.is_active = true
        AND equipment.category = ANY(cs.equipment_categories)
    )
  );
```

## 3.5 RLS pe `trainings` (training_sessions, training_assignments)

```sql
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_assignments ENABLE ROW LEVEL SECURITY;

-- Admin vede tot
CREATE POLICY "trainings_admin_all" ON training_sessions FOR ALL USING (is_admin());
CREATE POLICY "assignments_admin_all" ON training_assignments FOR ALL USING (is_admin());

-- Membrii organizației
CREATE POLICY "trainings_org_read" ON training_sessions
  FOR SELECT USING (
    has_company_access(organization_id)
  );

CREATE POLICY "assignments_org_read" ON training_assignments
  FOR SELECT USING (
    has_company_access(organization_id)
  );

-- Consultant poate CRUD
CREATE POLICY "trainings_consultant_write" ON training_sessions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role_key = 'consultant'
        AND company_id = training_sessions.organization_id
        AND is_active = true
    )
  );

-- Angajatul vede doar sesiunile proprii
CREATE POLICY "trainings_employee_self" ON training_sessions
  FOR SELECT USING (
    worker_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role_key = 'company_employee'
        AND is_active = true
    )
  );
```

## 3.6 RLS pe `medical_exams` / `medical_examinations`

```sql
ALTER TABLE medical_examinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "medical_admin_all" ON medical_examinations FOR ALL USING (is_admin());

CREATE POLICY "medical_company_read" ON medical_examinations
  FOR SELECT USING (
    has_company_access(company_id)
  );

CREATE POLICY "medical_consultant_write" ON medical_examinations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role_key = 'consultant'
        AND company_id = medical_examinations.company_id
        AND is_active = true
    )
  );

-- Angajat: doar propriile examene
CREATE POLICY "medical_employee_self" ON medical_examinations
  FOR SELECT USING (
    employee_id IN (
      SELECT id FROM employees WHERE user_id = auth.uid()
    )
  );
```

## 3.7 RLS pe `documents` (generated_documents)

```sql
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "docs_admin_all" ON generated_documents FOR ALL USING (is_admin());

CREATE POLICY "docs_company_read" ON generated_documents
  FOR SELECT USING (
    has_company_access(company_id)
  );

-- Contabil afiliat: read + export
CREATE POLICY "docs_accountant_read" ON generated_documents
  FOR SELECT USING (
    is_affiliated_partner(company_id)
  );

CREATE POLICY "docs_consultant_write" ON generated_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role_key = 'consultant'
        AND company_id = generated_documents.company_id
        AND is_active = true
    )
  );
```

---

# 4. MIDDLEWARE NEXT.js — AUTORIZARE PER ROL

## 4.1 Verificare rol pe server (server action / API route)

```typescript
// lib/rbac.ts

import { createClient } from '@/lib/supabase/server'

export type RoleKey = 
  | 'admin' 
  | 'consultant' 
  | 'company_admin' 
  | 'company_employee'
  | 'partner_accountant' 
  | 'partner_supplier' 
  | 'auditor'

export interface UserRole {
  role_key: RoleKey
  company_id: string | null
  location_id: string | null
}

// Obține rolurile user-ului curent
export async function getUserRoles(): Promise<UserRole[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data: roles } = await supabase
    .rpc('get_user_roles', { p_user_id: user.id })
  
  return roles || []
}

// Verificare: are rolul X?
export async function hasRole(roleKey: RoleKey): Promise<boolean> {
  const roles = await getUserRoles()
  return roles.some(r => r.role_key === roleKey)
}

// Verificare: are acces la firma X?
export async function hasCompanyAccess(companyId: string): Promise<boolean> {
  const roles = await getUserRoles()
  return roles.some(r => 
    r.role_key === 'admin' || r.company_id === companyId
  )
}

// Verificare: e admin?
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin')
}

// Guard: redirecționează dacă nu are rolul necesar
export async function requireRole(roleKey: RoleKey): Promise<void> {
  const has = await hasRole(roleKey)
  if (!has) {
    throw new Error(`Acces interzis: necesită rolul ${roleKey}`)
  }
}
```

## 4.2 Middleware Next.js (rutare per rol)

```typescript
// middleware.ts

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutele protejate per rol
const ROLE_ROUTES: Record<string, string[]> = {
  '/dashboard/admin':      ['admin'],
  '/dashboard/consultant': ['admin', 'consultant'],
  '/dashboard/company':    ['admin', 'consultant', 'company_admin'],
  '/dashboard/employee':   ['admin', 'company_employee'],
  '/dashboard/accountant': ['admin', 'partner_accountant'],
  '/dashboard/supplier':   ['admin', 'partner_supplier'],
  '/dashboard/auditor':    ['admin', 'auditor'],
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  // Nu e logat → login
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Verificare rute protejate
  const path = req.nextUrl.pathname
  for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (path.startsWith(route)) {
      const { data: roles } = await supabase
        .rpc('get_user_roles', { p_user_id: session.user.id })
      
      const userRoleKeys = (roles || []).map((r: any) => r.role_key)
      const hasAccess = allowedRoles.some(role => userRoleKeys.includes(role))
      
      if (!hasAccess) {
        // Redirecționează la dashboard-ul default bazat pe primul rol
        const defaultRole = userRoleKeys[0] || 'company'
        return NextResponse.redirect(
          new URL(`/dashboard/${defaultRole}`, req.url)
        )
      }
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

## 4.3 Structura foldere dashboard per rol (pregătită ACUM, populate la activare)

```
app/
├── dashboard/
│   ├── admin/          ← Daniel (toate firmele, super-admin)
│   │   └── page.tsx
│   ├── consultant/     ← Consultanți SSM (firmele alocate)
│   │   └── page.tsx
│   ├── company/        ← Patron/Admin firmă (firma lui)
│   │   └── page.tsx
│   ├── employee/       ← Angajat (datele proprii, instruiri)
│   │   └── page.tsx
│   ├── accountant/     ← Contabil (firmele afiliate, export)
│   │   └── page.tsx
│   ├── supplier/       ← Furnizor (echipamente din categoria lui)
│   │   └── page.tsx
│   └── auditor/        ← Auditor extern (read-only temporar)
│       └── page.tsx
```

---

# 5. MULTI-CLIENT SELECTOR (CONSULTANTUL VEDE TOATE FIRMELE)

```typescript
// components/CompanySelector.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Company {
  id: string
  name: string
  cui: string
}

export function CompanySelector({ 
  onSelect 
}: { 
  onSelect: (companyId: string) => void 
}) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selected, setSelected] = useState<string>('')
  const supabase = createClient()

  useEffect(() => {
    // RLS filtrează automat: admin vede tot, consultant vede firmele lui
    supabase
      .from('companies')
      .select('id, name, cui')
      .order('name')
      .then(({ data }) => {
        setCompanies(data || [])
        if (data?.[0]) {
          setSelected(data[0].id)
          onSelect(data[0].id)
        }
      })
  }, [])

  return (
    <select 
      value={selected}
      onChange={(e) => {
        setSelected(e.target.value)
        onSelect(e.target.value)
      }}
      className="border rounded px-3 py-2"
    >
      {companies.map(c => (
        <option key={c.id} value={c.id}>
          {c.name} ({c.cui})
        </option>
      ))}
    </select>
  )
}
```

---

# 6. AUDIT TRAIL (TRIGGER SIMPLU)

```sql
-- Audit trail: cine a modificat ce, când
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,          -- 'INSERT', 'UPDATE', 'DELETE'
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_table ON audit_log(table_name);
CREATE INDEX idx_audit_log_date ON audit_log(created_at);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Doar admin poate citi audit log
CREATE POLICY "audit_admin_only" ON audit_log
  FOR SELECT USING (is_admin());

-- Toți pot insera (trigger-urile scriu automat)
CREATE POLICY "audit_insert_all" ON audit_log
  FOR INSERT WITH CHECK (true);

-- Funcție trigger generică
CREATE OR REPLACE FUNCTION audit_trigger_fn()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (user_id, action, table_name, record_id, old_data, new_data)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplică trigger pe tabelele principale
CREATE TRIGGER audit_companies AFTER INSERT OR UPDATE OR DELETE ON companies
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();

CREATE TRIGGER audit_employees AFTER INSERT OR UPDATE OR DELETE ON employees
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();

CREATE TRIGGER audit_equipment AFTER INSERT OR UPDATE OR DELETE ON equipment
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();

CREATE TRIGGER audit_user_roles AFTER INSERT OR UPDATE OR DELETE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();
```

---

# 7. INTEGRARE CU MULTI-COUNTRY

RBAC-ul funcționează cross-country prin `company_id` → `companies.country_code`:

```sql
-- Adaugă country_code pe companies (dacă nu există)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'RO';

-- Consultant BG vede doar firmele din BG
-- RLS se aplică automat: user_roles.company_id → companies.country_code
-- Nu e nevoie de RLS separat pe country — ține de alocarea rolurilor
```

**Principiul:** RBAC este per-firmă, nu per-țară. Un consultant poate avea roluri pe firme din mai multe țări dacă i se acordă acces. Country_code e informație descriptivă, nu restricție de securitate.

---

# 8. CHECKLIST IMPLEMENTARE

| # | Task | Complexitate | Status |
|---|------|-------------|--------|
| 1 | Creează tabelele `roles`, `user_roles`, `permissions` | Mică | ⬜ |
| 2 | Creează tabelele `company_partners`, `company_suppliers` | Mică | ⬜ |
| 3 | Creează funcțiile helper (`get_user_roles`, `is_admin`, `has_company_access`) | Mică | ⬜ |
| 4 | Aplică RLS pe `companies` cu RBAC | Medie | ⬜ |
| 5 | Aplică RLS pe `employees` cu RBAC | Medie | ⬜ |
| 6 | Aplică RLS pe `equipment` cu RBAC | Medie | ⬜ |
| 7 | Aplică RLS pe `training_sessions` + `training_assignments` cu RBAC | Medie | ⬜ |
| 8 | Aplică RLS pe `medical_examinations` cu RBAC | Medie | ⬜ |
| 9 | Aplică RLS pe `generated_documents` cu RBAC | Medie | ⬜ |
| 10 | Creează `audit_log` + trigger-uri | Mică | ⬜ |
| 11 | Implementează `lib/rbac.ts` (Next.js) | Medie | ⬜ |
| 12 | Implementează middleware.ts cu rutare per rol | Medie | ⬜ |
| 13 | Creează structura foldere dashboard per rol | Mică | ⬜ |
| 14 | CompanySelector component | Mică | ⬜ |
| 15 | Seed: Daniel = admin + consultant pe toate firmele | Mică | ⬜ |
| 16 | Test end-to-end: login → rol → dashboard → RLS | Mare | ⬜ |

**Estimare totală:** 3-5 zile de lucru concentrat.

---

# 9. INSTRUCȚIUNI CLAUDE CODE (COPY-PASTE READY)

```
TASK: Implementează RBAC dinamic pe s-s-m.ro (Supabase + Next.js)

CONTEXT: Platforma are deja tabele: companies, employees, equipment, 
training_sessions, training_assignments, medical_examinations, 
generated_documents. Trebuie adăugat sistemul de roluri.

PAȘI:
1. Rulează SQL-ul din secțiunile 2.1-2.4 (tabele RBAC + relații)
2. Rulează SQL-ul din secțiunea 3.1 (funcții helper)
3. Aplică RLS policies din secțiunile 3.2-3.7
4. Rulează SQL-ul din secțiunea 6 (audit trail)
5. Creează lib/rbac.ts conform secțiunii 4.1
6. Actualizează middleware.ts conform secțiunii 4.2
7. Creează structura foldere din secțiunea 4.3
8. Creează CompanySelector din secțiunea 5
9. Seed: INSERT INTO user_roles VALUES (gen_random_uuid(), 
   '<DANIEL_USER_ID>', 'admin', NULL, NULL, NULL, now(), NULL, true);

REGULI: 
- gen_random_uuid() nu uuid_generate_v4()
- RLS ENABLE pe TOATE tabelele noi
- Test fiecare policy după aplicare
- NU modifica coloana existentă, doar adaugă
```

---

# 10. GLOSAR

| Termen | Explicație | Context |
|--------|-----------|---------|
| **RBAC** | Role-Based Access Control — controlul accesului bazat pe roluri | Sistem prin care fiecare utilizator primește un rol (admin, consultant, patron, etc.) și vede doar datele la care are acces |
| **RLS** | Row Level Security — securitate la nivel de rând | Funcție Supabase/PostgreSQL care filtrează automat rândurile din baza de date pe baza unor reguli (policies) |
| **Policy** | Regulă RLS care definește cine vede ce | Ex: "company_admin vede doar angajații din firma lui" |
| **SECURITY DEFINER** | Funcția SQL rulează cu permisiunile creatorului, nu ale celui care o apelează | Necesar ca funcțiile helper să poată citi user_roles indiferent de cine le apelează |
| **Middleware** | Cod Next.js care rulează ÎNAINTE de randarea paginii | Verifică rolul user-ului și redirecționează dacă nu are acces |
| **Seed** | Date inițiale inserate la setup | Rolurile din tabelul `roles` și rolul de admin pentru Daniel |
| **FK** | Foreign Key — cheie externă | Relație între tabele (ex: user_roles.company_id → companies.id) |
| **Audit Trail** | Jurnal complet al modificărilor | Cine a schimbat ce, când, de unde — obligatoriu pentru conformitate SSM/GDPR |
| **Multi-tenant** | Arhitectură unde mai mulți clienți folosesc aceeași instanță | s-s-m.ro este multi-tenant: toate firmele în aceeași DB, separate prin RLS |
| **next-intl** | Bibliotecă Next.js pentru internaționalizare | Folosită pentru multi-country (RO, BG, DE, HU) |

---

*Document generat: 8 februarie 2026 | Versiune: DOC1 RBAC v1.0*
*Sursa: Consolidare din chat-urile: Analiza detaliată MVP→SaaS, Runda 4 SQL, Partea D RLS, Consolidare 107, Multi-Country*
