# RBAC Hooks — Documentație

Hook-uri React client-side pentru verificare permisiuni RBAC în componente.

## Hook-uri Disponibile

### 1. `useMyRoles()`
Returnează rolurile active ale userului curent.

```tsx
const { roles, isLoading, error } = useMyRoles()

// roles: UserRole[] - array cu toate rolurile active
// isLoading: boolean - true în timpul fetch-ului
// error: Error | null - eroare dacă fetch-ul eșuează
```

**Features:**
- Fetch din `user_roles` cu JOIN pe `roles`
- Fallback automat pe `memberships` dacă `user_roles` gol
- Filtrare roluri expirate (verifică `expires_at`)
- Auto-revalidare la fiecare 5 minute
- Cleanup automat la unmount

**Exemplu:**
```tsx
'use client'
import { useMyRoles } from '@/hooks/usePermission'

export function MyRolesList() {
  const { roles, isLoading, error } = useMyRoles()

  if (isLoading) return <div>Se încarcă...</div>
  if (error) return <div>Eroare: {error.message}</div>

  return (
    <ul>
      {roles.map((role, idx) => (
        <li key={idx}>
          {role.role_name} {role.country_code && `(${role.country_code})`}
        </li>
      ))}
    </ul>
  )
}
```

---

### 2. `useHasRole(roleKey)`
Verifică dacă userul are un rol specific.

```tsx
const isConsultant = useHasRole('consultant_ssm')
const isFirmaAdmin = useHasRole('firma_admin')
```

**Exemplu:**
```tsx
'use client'
import { useHasRole } from '@/hooks/usePermission'

export function AdminPanel() {
  const isSuperAdmin = useHasRole('super_admin')

  if (!isSuperAdmin) {
    return <div>Nu aveți acces la acest panou.</div>
  }

  return <div>Panou Admin...</div>
}
```

---

### 3. `useIsSuperAdmin()`
Verifică dacă userul este super admin. Shortcut pentru `useHasRole('super_admin')`.

```tsx
const isSuperAdmin = useIsSuperAdmin()
```

---

### 4. `useHasPermission(resource, action)`
Verifică permisiune granulară (resource × action).

```tsx
const canCreateEmployees = useHasPermission('employees', 'create')
const canDeleteEquipment = useHasPermission('equipment', 'delete')
const canExportReports = useHasPermission('reports', 'export')
```

**Features:**
- Query `permissions` tabel pentru verificare granulară
- Super admin bypass automat
- Returnează `false` în timpul loading pentru siguranță

**Exemplu:**
```tsx
'use client'
import { useHasPermission } from '@/hooks/usePermission'

export function EmployeeActions() {
  const canCreate = useHasPermission('employees', 'create')
  const canDelete = useHasPermission('employees', 'delete')

  return (
    <div>
      {canCreate && <button>Adaugă Angajat</button>}
      {canDelete && <button>Șterge Angajat</button>}
    </div>
  )
}
```

---

### 5. `useFieldRestrictions(resource)`
Returnează restricții la nivel de câmp (masked/hidden/visible).

```tsx
const restrictions = useFieldRestrictions('employees')
// { "cnp": "masked", "salary": "hidden", "name": "visible" }
```

**Exemplu:**
```tsx
'use client'
import { useFieldRestrictions } from '@/hooks/usePermission'

export function EmployeeDetails({ employee }) {
  const restrictions = useFieldRestrictions('employees')

  return (
    <div>
      <p>Nume: {employee.name}</p>

      {restrictions['cnp'] === 'hidden' ? null : (
        <p>CNP: {restrictions['cnp'] === 'masked' ? '***********' : employee.cnp}</p>
      )}

      {restrictions['salary'] !== 'hidden' && (
        <p>Salariu: {restrictions['salary'] === 'masked' ? '****' : employee.salary}</p>
      )}
    </div>
  )
}
```

---

## Hook-uri Helper Suplimentare

### `useIsFieldMasked(resource, fieldName)`
```tsx
const isCnpMasked = useIsFieldMasked('employees', 'cnp')
// true dacă field_restrictions["cnp"] === "masked"
```

### `useIsFieldHidden(resource, fieldName)`
```tsx
const isSalaryHidden = useIsFieldHidden('employees', 'salary')
// true dacă field_restrictions["salary"] === "hidden"
```

### `useIsFieldVisible(resource, fieldName)`
```tsx
const isNameVisible = useIsFieldVisible('employees', 'name')
// true dacă nu are restricții SAU e setat la "visible"
```

### `useMyOrgIds()`
Returnează ID-urile organizațiilor accesibile userului.

```tsx
const orgIds = useMyOrgIds()
// string[] - array cu UUID-uri organizații
// Super admin: TOATE organizațiile
// Alte roluri: doar company_id-urile din user_roles
```

**Exemplu:**
```tsx
'use client'
import { useMyOrgIds } from '@/hooks/usePermission'

export function OrganizationFilter() {
  const orgIds = useMyOrgIds()

  return (
    <select>
      {orgIds.map(id => (
        <option key={id} value={id}>Organizație {id}</option>
      ))}
    </select>
  )
}
```

### `usePrimaryRole()`
Returnează rolul principal al userului (pentru rutare/afișare).

```tsx
const primaryRole = usePrimaryRole()
// 'super_admin' | 'consultant_ssm' | 'firma_admin' | 'angajat' | null
```

**Prioritate:**
1. `super_admin`
2. `consultant_ssm`
3. `firma_admin`
4. `angajat`
5. Primul rol din listă (dacă niciun rol prioritar)

---

## Reguli de Utilizare

### ✅ DO:
- Folosește hook-urile în **Client Components** (`'use client'`)
- Verifică `isLoading` înainte de a afișa UI bazat pe permisiuni
- Ascunde butoane/acțiuni pentru care userul NU are permisiuni
- Combină verificări: `isSuperAdmin || canDelete`

### ❌ DON'T:
- **NU** folosi hook-urile în Server Components (folosește `lib/rbac.ts`)
- **NU** bypassa verificările de permisiuni pe server
- **NU** afișa butoane/acțiuni dacă `!canCreate` (ghidare negativă UX)
- **NU** uita să verifici `isLoading` (poate cauza flash de conținut)

---

## Diferența între Server și Client

| Context | Folosește | Exemple |
|---------|-----------|---------|
| **Server Components** | `lib/rbac.ts` | `getMyRoles()`, `hasPermission()`, `isSuperAdmin()` |
| **Client Components** | `hooks/usePermission.ts` | `useMyRoles()`, `useHasPermission()`, `useIsSuperAdmin()` |
| **Middleware** | Direct queries | `getRolesFromSupabase()` |
| **API Routes** | `lib/rbac.ts` | Server-side verification |

---

## Pattern-uri Comune

### Pattern 1: Conditional Rendering
```tsx
'use client'
import { useHasPermission } from '@/hooks/usePermission'

export function EmployeeList() {
  const canCreate = useHasPermission('employees', 'create')
  const canDelete = useHasPermission('employees', 'delete')

  return (
    <div>
      {canCreate && <button>+ Angajat Nou</button>}
      {/* Lista angajați... */}
      {canDelete && <button>Șterge Selectați</button>}
    </div>
  )
}
```

### Pattern 2: Role-Based UI
```tsx
'use client'
import { usePrimaryRole } from '@/hooks/usePermission'

export function Dashboard() {
  const primaryRole = usePrimaryRole()

  switch (primaryRole) {
    case 'super_admin':
      return <AdminDashboard />
    case 'consultant_ssm':
      return <ConsultantDashboard />
    case 'firma_admin':
      return <FirmaDashboard />
    case 'angajat':
      return <AngajatDashboard />
    default:
      return <div>Se încarcă...</div>
  }
}
```

### Pattern 3: Field Masking
```tsx
'use client'
import { useFieldRestrictions } from '@/hooks/usePermission'

export function EmployeeCard({ employee }) {
  const restrictions = useFieldRestrictions('employees')

  const renderField = (fieldName: string, value: string) => {
    if (restrictions[fieldName] === 'hidden') return null
    if (restrictions[fieldName] === 'masked') return '***'
    return value
  }

  return (
    <div>
      <p>CNP: {renderField('cnp', employee.cnp)}</p>
      <p>Salariu: {renderField('salary', employee.salary)}</p>
    </div>
  )
}
```

---

## Performance

- **Caching:** `useMyRoles()` folosește un singur fetch per component tree (React context sharing ar fi ideal viitor)
- **Revalidare:** Auto-refresh la 5 minute (300000ms)
- **Cleanup:** Toate hook-urile fac cleanup la unmount (previne memory leaks)
- **Optimizare:** Super admin bypass reduce query-uri inutile

---

## Troubleshooting

**Q: Hook-ul returnează `isLoading: true` la infinit**
A: Verifică că tabelele `user_roles`, `roles`, `permissions` există și au RLS configurat corect.

**Q: `useHasPermission` returnează mereu `false`**
A: Verifică că:
1. Rolul userului are permisiunea în tabelul `permissions`
2. `is_active = true` pe rol și permisiune
3. `expires_at` nu este expirat

**Q: Fallback pe `memberships` nu funcționează**
A: Verifică că userul are rânduri în `memberships` cu `is_active = true`.

**Q: Eroare "Cannot use hooks in Server Component"**
A: Adaugă `'use client'` la începutul fișierului componentei.

---

## Next Steps

După implementarea hook-urilor, vezi:
- **Secțiunea 10.5:** Actualizare componente existente să folosească hook-urile
- **Secțiunea 10.6:** Admin UI pentru managementul rolurilor
