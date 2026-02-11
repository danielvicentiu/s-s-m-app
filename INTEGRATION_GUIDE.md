# OP-LEGO Sprint 4.7 — TypeScript Middleware
## Ghid Integrare ModuleGate + ModuleNav în Layout Existent

**Data:** 11 Feb 2026 | **Estimare:** 2-3h | **Risc:** LOW (fișiere noi, zero breaking changes)

---

## 📁 FIȘIERE GENERATE (6 — total ~960 linii)

```
C:\Dev\s-s-m-app\
├── lib/
│   └── modules/
│       ├── types.ts          ← TypeScript types (ModuleKey, ModuleStatus, etc.)
│       ├── constants.ts      ← MODULE_ROUTES, MODULE_NAV_ITEMS, MODULE_DISPLAY_NAMES
│       └── server.ts         ← checkOrgModuleServer, getOrgModulesServer, checkRouteModuleAccess
├── hooks/
│   └── useOrgModules.ts      ← Client hook cu realtime Supabase subscription
└── components/
    ├── ModuleGate.tsx         ← Conditional rendering + TrialBanner + UpgradeCTA
    └── navigation/
        └── ModuleNav.tsx      ← Meniu dinamic filtrat pe module active
```

---

## 🔧 PAȘI INTEGRARE (în ordine)

### PAS 1: Copiază fișierele (5 min)

Copiază cele 6 fișiere din arhiva generată în `C:\Dev\s-s-m-app\` respectând structura de mai sus.

### PAS 2: Verifică/creează dependențele (10 min)

Fișierele presupun că există:

**a) `@/lib/supabase-browser`** — un export `createClient()` pentru Supabase browser client.
- Dacă ai deja un helper Supabase client-side (ex: `lib/supabase.ts` sau `utils/supabase/client.ts`), 
  ajustează importul din `hooks/useOrgModules.ts` linia 7:
  ```ts
  // SCHIMBĂ ASTA:
  import { createClient } from '@/lib/supabase-browser';
  // CU CALEA TA REALĂ, ex:
  import { createClient } from '@/utils/supabase/client';
  ```

**b) `@/hooks/useOrganization`** — un hook care returnează `{ orgId: string | null }`.
- Dacă ai deja un hook/context care dă organizația curentă, ajustează importul.
- Dacă NU ai, creează un placeholder rapid:

```ts
// hooks/useOrganization.ts (PLACEHOLDER — înlocuiește cu logica ta reală)
'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser'; // adjust path

export function useOrganization() {
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    async function getOrg() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get first org from memberships (or user_roles)
      const { data } = await supabase
        .from('memberships')
        .select('organization_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (data) setOrgId(data.organization_id);
    }
    getOrg();
  }, []);

  return { orgId };
}
```

### PAS 3: Integrare ModuleNav în Sidebar (30 min)

Localizează fișierul tău de sidebar/layout. Probabil e ceva gen:
- `app/[locale]/dashboard/layout.tsx` sau
- `app/[locale]/layout.tsx` (dacă sidebar-ul e la nivel global) sau
- `components/Sidebar.tsx`

**Adaugă ModuleNav în sidebar:**

```tsx
// ÎNAINTE (exemplu — adaptează la structura ta reală):
<aside className="w-64 border-r">
  <nav>
    <Link href="/dashboard">Dashboard</Link>
    <Link href="/dashboard/training">Instruire</Link>
    <Link href="/dashboard/equipment">Echipamente</Link>
    {/* ... link-uri statice ... */}
  </nav>
</aside>

// DUPĂ:
import { ModuleNav } from '@/components/navigation/ModuleNav';

<aside className="w-64 border-r overflow-y-auto">
  {/* Link-uri fixe (dashboard home, profile, settings) */}
  <div className="p-3">
    <Link href={`/${locale}/dashboard`} className="...">
      Dashboard
    </Link>
  </div>
  
  {/* ═══ MODULE NAV DINAMIC ═══ */}
  <div className="px-1">
    <ModuleNav />
  </div>
  
  {/* Link-uri admin (rămân statice, gated by RBAC nu module) */}
  <div className="mt-auto p-3 border-t">
    <Link href={`/${locale}/admin/roles`}>Admin Roluri</Link>
  </div>
</aside>
```

### PAS 4: Wrap pagini cu ModuleGate (30 min per modul)

Pentru fiecare pagină care aparține unui modul, adaugă `<ModuleGate>`:

```tsx
// app/[locale]/dashboard/training/page.tsx
// ÎNAINTE:
export default function TrainingPage() {
  return <TrainingDashboard />;
}

// DUPĂ:
import { ModuleGate } from '@/components/ModuleGate';

export default function TrainingPage() {
  return (
    <ModuleGate moduleKey="ssm" showUpgradeCTA>
      <TrainingDashboard />
    </ModuleGate>
  );
}
```

**Pagini de wrap (prioritate):**

| Pagină | ModuleKey | Prioritate |
|--------|-----------|-----------|
| `/dashboard/training` | `ssm` | P1 (există) |
| `/dashboard/equipment` | `psi` sau `echipamente` | P1 (există) |
| `/dashboard/employees` | `ssm` | P1 (există) |
| `/admin/legal-acts` | `legislatie` | Core (always on) |
| `/admin/legal-import` | `legislatie` | Core (always on) |
| `/dashboard/gdpr` | `gdpr` | P2 (nu există încă) |
| `/dashboard/nis2` | `nis2` | P3 (nu există încă) |

**Notă:** Paginile core (`alerte`, `legislatie`) nu au nevoie de ModuleGate — sunt always-on. 
Dar poți adăuga oricum ca safety net — ModuleGate le va arăta automat.

### PAS 5: (OPȚIONAL) Route protection server-side

Dacă vrei protecție la nivel de rută (redirect dacă modulul nu e activ), adaugă în layout-ul dashboard:

```tsx
// app/[locale]/dashboard/layout.tsx (Server Component)
import { checkRouteModuleAccess } from '@/lib/modules/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function DashboardLayout({ children, params }: { 
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Get orgId from session/cookie (adjust to your auth flow)
  const orgId = await getOrgIdFromSession(); // implement this
  
  if (orgId) {
    // This is optional — ModuleGate already handles client-side
    // Server-side is belt-and-suspenders
  }
  
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

⚠️ **NU modifica middleware.ts** — laptop B lucrează acolo pe M4 Preview.

### PAS 6: Build & Test (15 min)

```powershell
cmd /c "cd C:\Dev\s-s-m-app && npx next build 2>&1 | findstr /i /c:error /c:warning /c:compiled"
```

Dacă build e clean, testează:
1. Dashboard-ul — ModuleNav apare în sidebar
2. Click pe un modul neactivat → apare UpgradeCTA
3. Module core (alerte, legislatie) → mereu vizibile

### PAS 7: Git commit

```powershell
cmd /c "cd C:\Dev\s-s-m-app && git add -A && git status && git commit -m ""feat: OP-LEGO TypeScript middleware - ModuleGate + ModuleNav (Sprint 4.7)"" && git push origin main"
```

---

## ⚠️ ATENȚIE — CE NU FAC ACESTE FIȘIERE

1. **NU modifică `middleware.ts`** — zero conflict cu laptop B
2. **NU modifică niciun fișier existent** — totul e NOU
3. **NU activează module automat** — organizațiile încep cu 0 module standalone (doar core)
4. **NU implementează plăți** — pricing seed e task separat
5. **NU implementează admin UI pentru module** — e Sprint separat (4.8 sau 51)

---

## 🔗 DEPENDENȚE EXISTENTE FOLOSITE

| Pachet | Folosit în | Deja instalat? |
|--------|-----------|:---:|
| `@supabase/supabase-js` | server.ts, useOrgModules.ts | ✅ Da |
| `next-intl` | ModuleGate.tsx, ModuleNav.tsx (useLocale) | ✅ Da |
| `lucide-react` | ModuleNav.tsx (icons) | ✅ Da |
| `react` | Toate componentele | ✅ Da |
| `next` | Link, usePathname | ✅ Da |

**Zero pachete noi de instalat.**

---

## 📝 LABELS NAVIGAȚIE (cheile din next-intl)

ModuleNav folosește chei de traducere (ex: `nav.training`, `nav.employees`). 
Trebuie adăugate în `messages/{locale}.json`. Exemplu `messages/ro.json`:

```json
{
  "nav": {
    "alerts": "Alerte",
    "notifications": "Notificări",
    "legislation": "Legislație",
    "legalActs": "Acte legislative",
    "legalImport": "Import legi",
    "training": "Instruire",
    "employees": "Angajați",
    "riskAssessment": "Evaluare risc",
    "fireSafety": "Securitate incendiu",
    "equipment": "Echipamente",
    "evacuation": "Evacuare",
    "gdpr": "GDPR",
    "gdprRegisters": "Registre GDPR",
    "nis2": "NIS2",
    "cyberRisk": "Risc cybersecurity",
    "equipmentRegistry": "Registru echipamente",
    "revisions": "Revizii",
    "nearMiss": "Near-miss",
    "report": "Raportare",
    "environment": "Mediu",
    "waste": "Deșeuri",
    "authorities": "Autorități",
    "templates": "Template-uri",
    "labor": "Relații de muncă",
    "contracts": "Contracte"
  }
}
```

⚠️ Adaugă echivalentul și în bg.json, hu.json, de.json, pl.json, en.json.

---

## 🧪 TEST CHECKLIST

- [ ] `npm run build` — 0 erori
- [ ] ModuleNav apare în sidebar
- [ ] Module core (alerte, legislatie) — mereu vizibile, expanded by default
- [ ] Module standalone (ssm, psi) — vizibile doar dacă activate
- [ ] Click pe modul neactivat → UpgradeCTA cu lock icon
- [ ] Trial banner apare cu countdown zile
- [ ] Realtime: activez modul din Supabase → apare instant în nav (fără refresh)
- [ ] Mobile: nav funcționează (responsive)
