# FIX: Angajații nu apar în Dashboard - Bug is_active

## ❌ PROBLEMA

Angajații adăugați prin `/ro/dashboard/angajat-nou` nu apar în:
- Dashboard tab "Angajați" — arată "Niciun angajat adăugat"
- Pagina `/ro/documents/generate` — arată "0 ANGAJAȚI"

**Verificat:**
- ✅ RLS policies sunt OK (4 politici active pe employees)
- ✅ Angajații există în Supabase (verificat în Table Editor)
- ✅ Query-ul rulează fără erori

## 🔍 ROOT CAUSE

**Bug în `app/[locale]/dashboard/angajat-nou/page.tsx`:**

```typescript
// ❌ ÎNAINTE - Insert fără is_active
const { error } = await supabase.from('employees').insert([{
  full_name: formData.full_name,
  job_title: formData.job_title,
  organization_id: formData.organization_id,
  // ❌ LIPSĂ: is_active
}])
```

**Dashboard query filtrează după `is_active = true`:**

```typescript
// app/[locale]/dashboard/page.tsx
const { data: employees } = await supabase
  .from('employees')
  .select('*, organizations(name, cui)')
  .eq('is_active', true)  // ← Query-ul exclude angajații fără is_active
  .order('hire_date', { ascending: false })
```

**Rezultat:**
- Angajații noi au `is_active = NULL` sau `FALSE` (default în DB)
- Query-ul îi exclude → nu apar în dashboard

## ✅ SOLUȚIE

### 1. Fix cod (DEJA APLICAT în commit 11285a8)

```typescript
// ✅ DUPĂ - Insert cu is_active: true
const { error } = await supabase.from('employees').insert([{
  full_name: formData.full_name,
  job_title: formData.job_title,
  organization_id: formData.organization_id,
  is_active: true,  // ✅ ADĂUGAT
}])
```

### 2. Fix angajați existenți (MANUAL în Supabase)

Deschide **Supabase Dashboard → SQL Editor** și execută:

```sql
-- Update toți angajații existenți
UPDATE public.employees
SET
    is_active = TRUE,
    updated_at = now()
WHERE is_active IS NULL OR is_active = FALSE;
```

Sau folosește fișierul `FIX_EXISTING_EMPLOYEES.sql`:

```
https://supabase.com/dashboard/project/uhccxfyvhjeudkexcgiq/sql
```

Copy/Paste conținutul și click **RUN**.

## 🧪 TESTARE

### Test 1: Verifică angajații existenți în Supabase

```sql
SELECT
    id,
    full_name,
    job_title,
    organization_id,
    is_active,
    created_at
FROM public.employees
ORDER BY created_at DESC;
```

**Expected:** Toți angajații au `is_active = TRUE`

### Test 2: Verifică în Dashboard

1. Deschide https://app.s-s-m.ro/ro/dashboard
2. Click pe tab-ul **"Angajați"**
3. Ar trebui să vezi angajații adăugați

### Test 3: Adaugă angajat nou

1. Click pe **"+ Angajat Nou"**
2. Completează formularul
3. După salvare, redirect la dashboard
4. Angajatul nou ar trebui să apară imediat în tab "Angajați"

## 📊 DEBUG LOGS

După aplicarea fix-ului, în Console (F12) vei vedea:

```
🔍 [Dashboard] Employees query: {
  count: 2,
  error: null,
  sample: { full_name: "Ion Popescu", job_title: "...", ... },
  isSuperAdmin: false
}

🔍 [DashboardClient] Employees prop: {
  count: 2,
  data: [...],
  isArray: true
}

🔍 [DashboardClient] Filtered employees: {
  selectedOrg: "all",
  totalEmployees: 2,
  filteredCount: 2,
  filteredData: [...]
}
```

Dacă `count = 0`, problema persistă.

## 🚨 TROUBLESHOOTING

### Angajații încă nu apar după fix

**1. Verifică is_active în Supabase Table Editor:**
- Database → employees → verifică coloana `is_active`
- Ar trebui să fie `TRUE` pentru toți

**2. Verifică RLS policies:**
```sql
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'employees';
```
Ar trebui să vezi 4 politici: SELECT, INSERT, UPDATE, DELETE

**3. Verifică organizațiile alocate:**
```sql
SELECT * FROM public.get_user_org_ids();
```
Ar trebui să returneze cel puțin un `organization_id`.

**4. Verifică Console errors (F12):**
- Erori RLS: "new row violates row-level security policy"
- Erori permisiuni: "permission denied for table employees"

### Angajații au is_active = NULL după update

Coloana `is_active` trebuie să aibă default TRUE în schema:

```sql
ALTER TABLE public.employees
ALTER COLUMN is_active SET DEFAULT TRUE;
```

## 📝 FIȘIERE MODIFICATE

| Fișier | Modificare |
|--------|------------|
| `app/[locale]/dashboard/angajat-nou/page.tsx` | Add `is_active: true` la insert + fix redirect |
| `app/[locale]/dashboard/page.tsx` | Add debug logging pentru employees query |
| `app/[locale]/dashboard/DashboardClient.tsx` | Add debug logging pentru employees prop |
| `FIX_EXISTING_EMPLOYEES.sql` | SQL pentru update angajați existenți |

## ✅ VERIFICARE FINALĂ

După aplicarea ambelor fix-uri (cod + SQL), verifică:

- [ ] `npm run build` trece fără erori
- [ ] Dashboard tab "Angajați" arată angajații existenți
- [ ] Angajat nou adăugat apare imediat în dashboard
- [ ] `/ro/documents/generate` arată angajații în dropdown
- [ ] Console logs (F12) arată `count > 0` pentru employees

## 📞 NEXT STEPS

După verificare, elimină debug logs din cod:

```typescript
// Șterge aceste console.log() din:
// - app/[locale]/dashboard/page.tsx (linia ~51)
// - app/[locale]/dashboard/DashboardClient.tsx (liniile ~42, ~96)
```

Apoi commit:

```bash
git add .
git commit -m "Clean up debug logs from employees fix"
git push origin main
```
