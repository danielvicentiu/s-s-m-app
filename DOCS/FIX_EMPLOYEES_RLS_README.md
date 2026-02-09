# FIX: Angajații nu apar în Dashboard și Documents

## ❌ PROBLEMA

Angajații adăugați prin `/ro/dashboard/angajat-nou` nu apar în:
- Dashboard tab "Angajați" — arată "0 angajați"
- Pagina `/ro/documents/generate` — arată "0 ANGAJAȚI"

**Cauza:** Tabela `employees` are **RLS activat dar FĂRĂ politici** → blochează toate query-urile.

## 🔍 DIAGNOSTIC

Rulează `DIAGNOSTIC_EMPLOYEES_RLS.sql` în Supabase SQL Editor pentru a verifica:

```bash
# În Supabase Dashboard → SQL Editor
# Copy/Paste conținutul din DIAGNOSTIC_EMPLOYEES_RLS.sql
```

### Ce ar trebui să vezi:

1. **RLS activat:** `rls_enabled = true`
2. **0 politici active** sau politici comentate
3. **Funcțiile RBAC există:** `is_super_admin()`, `get_user_org_ids()`
4. **User are organizații alocate** prin `user_roles` sau `memberships`

## ✅ SOLUȚIE

### Pas 1: Aplică fix-ul RLS

Deschide **Supabase Dashboard → SQL Editor** și execută:

```
https://supabase.com/dashboard/project/uhccxfyvhjeudkexcgiq/sql
```

Copy/Paste conținutul din `FIX_EMPLOYEES_RLS.sql` și click **RUN**.

### Pas 2: Verifică politicile create

După aplicare, ar trebui să vezi 4 politici noi:
- `employees_select_policy` — permite citire angajați
- `employees_insert_policy` — permite adăugare angajați
- `employees_update_policy` — permite editare angajați
- `employees_delete_policy` — permite ștergere angajați

### Pas 3: Testează în browser

1. Deschide https://app.s-s-m.ro/ro/dashboard
2. Apasă **F12** → Console
3. Click pe tab-ul **"Angajați"**
4. Ar trebui să vezi angajații adăugați

## 📋 POLITICI RLS CREATE

### SELECT Policy
```sql
USING (
    public.is_super_admin()                              -- Super admin vede tot
    OR organization_id IN (SELECT get_user_org_ids())    -- User vede org-urile alocate
    OR (user_id = auth.uid())                            -- Angajat vede propriul record
)
```

### INSERT/UPDATE/DELETE Policies
```sql
USING (
    public.is_super_admin()
    OR organization_id IN (SELECT get_user_org_ids())
)
```

## 🧪 TEST MANUAL

După aplicarea fix-ului, testează:

```sql
-- Test 1: Verifică că poți citi angajați
SELECT id, full_name, job_title, organization_id
FROM public.employees
WHERE is_active = true
LIMIT 5;

-- Test 2: Verifică funcția get_user_org_ids()
SELECT * FROM public.get_user_org_ids();

-- Test 3: Verifică dacă ești super_admin
SELECT public.is_super_admin();
```

## 📝 FIȘIERE IMPLICATE

| Fișier | Scop |
|--------|------|
| `FIX_EMPLOYEES_RLS.sql` | SQL de executat pentru fix |
| `DIAGNOSTIC_EMPLOYEES_RLS.sql` | Verifică starea RLS actuală |
| `supabase/migrations/20260208_fix_employees_rls.sql` | Migrația permanentă (backup) |
| `app/[locale]/dashboard/page.tsx` | Fetch employees pentru dashboard |
| `app/[locale]/dashboard/DashboardClient.tsx` | Afișează tab "Angajați" |
| `app/[locale]/documents/generate/page.tsx` | Fetch employees pentru documente |

## 🚨 TROUBLESHOOTING

### Angajații încă nu apar după fix

1. **Verifică în Supabase Table Editor:**
   - Database → employees → verifică că există date cu `is_active = true`

2. **Verifică organizațiile alocate:**
   ```sql
   SELECT * FROM public.get_user_org_ids();
   ```
   Ar trebui să returneze cel puțin un `organization_id`.

3. **Verifică user_roles sau memberships:**
   ```sql
   -- RBAC nou (user_roles)
   SELECT * FROM public.user_roles WHERE user_id = auth.uid();

   -- Sistem vechi (memberships) — fallback
   SELECT * FROM public.memberships WHERE user_id = auth.uid();
   ```

4. **Verifică dacă funcțiile RBAC există:**
   ```sql
   SELECT proname FROM pg_proc
   WHERE proname IN ('is_super_admin', 'get_user_org_ids');
   ```

5. **Verifică Console Errors (F12):**
   - Erori de tip "new row violates RLS" → politicile nu sunt aplicate corect
   - Erori de tip "function does not exist" → funcțiile RBAC lipsesc

### Funcțiile RBAC lipsesc

Dacă `is_super_admin()` sau `get_user_org_ids()` nu există, aplică mai întâi:

```
DOCS/002_RBAC_DINAMIC_CORECTAT_v1.1.sql (secțiunea 4)
```

## ✅ COMMIT

După aplicare și testare:

```bash
git add .
git commit -m "[FIX] Enable RLS policies for employees table

- Create 4 RLS policies: SELECT, INSERT, UPDATE, DELETE
- Use get_user_org_ids() to filter by assigned organizations
- Super admins bypass all restrictions
- Employees can see their own record

Fixes: Employees not appearing in dashboard and documents page"

git push origin main
```

## 📞 SUPORT

Dacă problema persistă:
1. Rulează `DIAGNOSTIC_EMPLOYEES_RLS.sql` și trimite output-ul
2. Verifică Console errors (F12 → Console) pe /ro/dashboard
3. Verifică Network tab (F12 → Network) pentru request-ul către `employees`
