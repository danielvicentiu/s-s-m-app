# CODE CONTRACT — S-S-M.RO
## Versiune: 1.0 | Data: 6 Februarie 2026
## Acest fișier se dă ca context la FIECARE prompt v0 și Cursor.

---

## 1. NAMING CONVENTIONS

| Ce | Convenție | Exemplu |
|----|-----------|---------|
| Componente React | PascalCase | `DataTable`, `FormModal`, `StatusBadge` |
| Fișiere componente | PascalCase.tsx | `DataTable.tsx`, `FormModal.tsx` |
| Funcții | camelCase | `getOrganizations()`, `updateMembership()` |
| Fișiere utilitare | camelCase.ts | `supabaseClient.ts`, `formatDate.ts` |
| Tabele Supabase | snake_case | `medical_examinations`, `safety_equipment` |
| Coloane Supabase | snake_case | `expiry_date`, `organization_id` |
| Constante | UPPER_SNAKE | `MAX_RETRIES`, `ALERT_THRESHOLD_DAYS` |
| Variabile env | UPPER_SNAKE cu prefix | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| CSS classes | Tailwind utility | `bg-blue-800`, `text-white` |
| Types/Interfaces | PascalCase cu prefix I sau T | `IOrganization`, `TMedicalExam` |

---

## 2. STRUCTURA FOLDERELOR

```
/app                          — pagini Next.js (App Router)
  /login                      — pagina login
  /dashboard                  — dashboard principal
    /training                 — modul instruire
    /medical                  — medicina muncii (M2)
    /equipment                — echipamente PSI (M3)
    /documents                — documente generate (M5d)
    /quick-valid              — validare rapidă (M9a)
  /api
    /alerts                   — endpoint-uri alerte
    /generate-pdf             — generare PDF
    /auth                     — callback-uri auth
/components
  /ui                         — componente reutilizabile (DataTable, FormModal, etc.)
    index.ts                  — barrel export
  /features                   — componente specifice modulelor
    /medical                  — componente medicina muncii
    /equipment                — componente PSI
    /training                 — componente instruire
    /dashboard                — componente dashboard
/lib                          — utilitare
  supabaseClient.ts           — client browser Supabase
  supabaseServer.ts           — client server Supabase
  types.ts                    — tipuri TypeScript globale
  utils.ts                    — funcții helper (formatDate, calcStatus, etc.)
  constants.ts                — constante globale
/docs                         — documentație
  code-contract.md            — ACEST FIȘIER
/public                       — assets statice
```

---

## 3. FETCH PATTERN (SINGUR — FĂRĂ VARIAȚII!)

```typescript
// BROWSER (componente client — 'use client')
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('organization_id', orgId)

if (error) throw error

// SERVER (API routes, Server Components)
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const supabase = createRouteHandlerClient({ cookies })

// SERVICE ROLE (bypass RLS — DOAR în API routes interne, NICIODATĂ client-side)
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
```

**REGULĂ:** Nu se creează alt pattern de fetch. TOATE operațiunile Supabase urmează exact structura de mai sus.

---

## 4. ERROR HANDLING (OBLIGATORIU pe fiecare operațiune)

```typescript
// Pattern standard — COPY-PASTE pe fiecare operațiune
try {
  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .eq('organization_id', orgId)

  if (error) throw error

  // procesare data
} catch (error) {
  console.error('[CONTEXT_CLAR] Descriere ce încercam:', error)
  // UI: toast sau setError state
  toast.error('Mesaj vizibil utilizator în română')
}
```

**Context clar** = unde în aplicație + ce operațiune. Exemple:
- `[Dashboard] Fetch organizație:`
- `[Medical] Adăugare examinare:`
- `[Alerts] Trimitere email:`
- `[PDF] Generare document:`

---

## 5. LOADING / EMPTY / ERROR STATES (OBLIGATORII pe fiecare pagină)

```typescript
// FIECARE pagină cu date trebuie să aibă toate 3:

// 1. LOADING
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800" />
    </div>
  )
}

// 2. ERROR
if (error) {
  return (
    <div className="text-center py-12">
      <p className="text-red-600 text-lg">Eroare la încărcare</p>
      <p className="text-gray-500 mt-2">{error}</p>
      <button onClick={retry} className="mt-4 px-4 py-2 bg-blue-800 text-white rounded">
        Reîncearcă
      </button>
    </div>
  )
}

// 3. EMPTY
if (!data || data.length === 0) {
  return <EmptyState
    icon="FileX"
    title="Nu există date"
    description="Adaugă prima înregistrare pentru a începe."
    actionLabel="Adaugă"
    onAction={() => setShowModal(true)}
  />
}
```

---

## 6. SUPABASE RULES (NENEGOCIABIL)

| Regulă | Detalii |
|--------|---------|
| **Singura sursă de adevăr** | TOATE datele în Supabase. Zero date în localStorage, fișiere, alt DB |
| **RLS activ pe TOATE tabelele** | Fără excepție. Test: user A NU vede datele user B |
| **Acces prin memberships** | NU `organization_id` direct pe `profiles`. Folosește `memberships` table |
| **CNP** | DOAR hash SHA-256. NICIODATĂ plaintext în DB sau logs |
| **Service role key** | DOAR server-side (API routes). NICIODATĂ în componente client |
| **content_version** | Integer, pe TOATE tabelele cu conținut. Crește la fiecare edit |
| **legal_basis_version** | Text, format: `'HG1425/2006_v2024-06'`. Pe TOATE tabelele SSM |
| **created_at** | `timestamptz DEFAULT now()` pe TOATE tabelele |
| **Object Lock** | Pe Storage bucket 'documents' — PDF-urile NU se pot modifica/șterge |

---

## 7. CÂMPURI OBLIGATORII PE TABELE SSM

Fiecare tabel care conține date SSM (medical_examinations, safety_equipment, training_sessions, generated_documents) TREBUIE să aibă:

```sql
content_version      INTEGER NOT NULL DEFAULT 1,
legal_basis_version  TEXT NOT NULL DEFAULT 'HG1425/2006_v2024',
created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

---

## 8. COMPONENTE UI STANDARD

Toate paginile folosesc componentele din `/components/ui/`. NU se creează variante noi fără motiv.

| Componentă | Folosire |
|------------|----------|
| `DataTable` | Orice tabel de date (sortare, filtrare, paginare, responsive) |
| `FormModal` | Orice formular add/edit (overlay, ESC close, loading submit) |
| `StatusBadge` | Status vizual: `valid` (verde), `expiring` (orange), `expired` (roșu), `incomplete` (gri) |
| `EmptyState` | Când nu există date (icon, titlu, descriere, CTA) |
| `ConfirmDialog` | Confirmare ștergere/acțiuni distructive |

---

## 9. STILIZARE

| Element | Valoare |
|---------|---------|
| **Culoare primară** | `#1e40af` (blue-800) |
| **Culoare pericol** | `#dc2626` (red-600) |
| **Culoare warning** | `#ea580c` (orange-600) |
| **Culoare succes** | `#16a34a` (green-600) |
| **Font** | System font stack (Tailwind default) |
| **Border radius** | `rounded-xl` pe carduri, `rounded-lg` pe butoane |
| **Shadow** | `shadow-sm` pe carduri |
| **Spacing** | Tailwind standard (p-4, p-6, gap-4, gap-6) |
| **Framework CSS** | DOAR Tailwind. Zero CSS custom. Zero styled-components |
| **Iconuri** | DOAR `lucide-react` |
| **Responsive** | Desktop: tabel. Mobil: carduri stacked. Breakpoint: `md:` (768px) |

---

## 10. NOTIFICATION LOG (DOAR EVENIMENT)

```typescript
// CE SE LOGUIEAZĂ:
{
  organization_id: uuid,
  notification_type: 'alert_mm_30d' | 'alert_mm_15d' | 'alert_psi' | 'report' | 'fraud_alert',
  channel: 'email' | 'sms' | 'whatsapp' | 'push',
  recipient: 'email@...' | '+40...',
  status: 'sent' | 'delivered' | 'opened' | 'actioned' | 'ignored' | 'failed',
  sent_at: timestamptz,
  actioned_at: timestamptz | null,
  metadata: { org_name, count_items, severity }  // FĂRĂ conținut email/mesaj!
}

// CE NU SE LOGUIEAZĂ NICIODATĂ:
// - Conținutul email-ului / mesajului
// - Date personale angajați
// - CNP (nici hash)
```

---

## 11. REGULI PROMPT (pentru v0 și Cursor)

La FIECARE prompt către v0 sau Cursor, include:

```
Respectă regulile din Code Contract:
- Naming: PascalCase componente, camelCase funcții, snake_case Supabase
- Fetch: pattern-ul standard cu error handling try/catch
- Componente: folosește DataTable, FormModal, StatusBadge, EmptyState din /components/ui/
- Loading/Empty/Error states obligatorii
- Supabase RLS prin memberships table
- CNP: doar SHA-256 hash
- legal_basis_version pe tabele SSM
- Tailwind only, lucide-react iconuri, blue #1e40af
- FĂRĂ localStorage, FĂRĂ CSS custom, FĂRĂ alt DB
```

---

## 12. GIT COMMIT CONVENTIONS

```
Format: [MODUL] Descriere scurtă

Exemple:
[AUTH] Add memberships table + RLS policies
[M2] Medical examinations CRUD + status badges
[M5d] PDF generation with legal_basis_version
[M10p] Alert batch system + notification_log
[M9a] Quick-Valid + Entropy Check
[UI] Add EmptyState component
[FIX] Dashboard column mapping correction
[DOCS] Update code contract v1.1
```

---

## 13. NEACȚIUNE VIZIBILĂ (PROTOCOL)

```
Alertă trimisă → status = 'sent'
15 zile fără acțiune → status = 'ignored' (cron job automat)
PDF conformitate include: "⚠️ Notificări trimise și neacționate: [N]"
Dashboard consultant: "[N] firme au alerte ignorate 15+ zile"
```

---

## 14. ENTROPY CHECK (M9a — ANTI-FRAUDĂ)

```
La submit Quick-Valid:
1. Query: câte teste din aceeași organizație în ultimele 5 minute?
2. DACĂ > 3:
   - NU genera fișa
   - Status = 'pending_review'
   - INSERT notification_log: type='fraud_alert'
   - Email Daniel
   - UI: "Validarea a fost înregistrată și va fi verificată de consultant."
3. Log suplimentar (fără blocare): IP, user_agent, GPS
```

---

*Code Contract v1.0 — 6 Februarie 2026*
*Actualizat conform DOC1_CONSOLIDARE_v3 + DOC3_PLAN_EXECUTIE_v3*
