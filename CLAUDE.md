# CLAUDE.md

PROIECT: s-s-m.ro — Platformă SSM/PSI digitală pentru consultanți și firme
PROPRIETAR: Daniel — consultant SSM/PSI cu 20+ ani experiență, 100+ clienți activi
STACK: Next.js 14 (App Router) + Supabase + TypeScript + Tailwind CSS
DEPLOY: Vercel — LIVE la https://app.s-s-m.ro
SUPABASE PROJECT ID: uhccxfyvhjeudkexcgiq

## CONTEXT

Platforma digitizează compliance SSM (securitate muncă) și PSI (incendiu)
pentru consultanți SSM și firmele lor din România, Bulgaria, Ungaria, Germania.
Multilingv: RO (default), BG, EN, HU, DE (next-intl în implementare).

## STRUCTURĂ

- app/dashboard/ — pagini protejate (medical, equipment, trainings, alerts)
- app/admin/ — pagini administrare (roluri, organizații)
- components/ui/ — componente reutilizabile (StatusBadge, EmptyState, ConfirmDialog, ValuePreview)
- lib/supabase/ — server.ts (SSR) + client.ts (browser)
- lib/types.ts — tipuri TypeScript centrale
- lib/rbac.ts — funcții RBAC (NOU, în implementare)
- docs/ — DOC1, DOC3, SQL migrations, manuale

## BAZA DE DATE

Supabase cu RLS activ pe TOATE tabelele. 25+ tabele principale:
organizations, memberships, profiles, employees, trainings,
medical_records, equipment, documents, alerts, audit_log, penalties, etc.

Auth: Supabase Auth (email/password)
Relația user↔org: prin tabela `memberships` (memberships.role = rol curent)

MIGRARE ÎN CURS: de la memberships.role hardcodat (consultant/firma_admin/angajat)
→ RBAC dinamic (tabele noi: roles, user_roles, permissions).
Vezi docs/DOC3_PLAN_EXECUTIE_v4.0.md pentru detalii.

Migrările se scriu în fișiere SQL separate în docs/ sau supabase/migrations/.

## REGULI COD

- TypeScript strict, camelCase pentru funcții/variabile
- Componente: PascalCase (DashboardCard.tsx)
- Componente client: 'use client' explicit
- Supabase browser: import { createSupabaseBrowser } from '@/lib/supabase/client'
- Supabase server: import { createSupabaseServer } from '@/lib/supabase/server'
- Imports: folosește alias @/ (configurat în proiect)
- Styling: Tailwind CSS, design consistent cu dashboard-ul existent
  (rounded-2xl, gray-50 bg, blue-600 accent)
- Limba cod: engleză (variabile, funcții, comentarii)
- Limba UI: română (default)
- Erori: try-catch, mesaje română pentru UI, engleză pentru console
- Fiecare feature nouă: commit separat cu prefix (feat:, fix:, refactor:)
- npm run build trebuie să treacă MEREU fără erori înainte de commit

## NU FACE FĂRĂ CONFIRMARE

- Nu șterge fișiere existente
- Nu schimba schema DB fără a genera fișier SQL separat
- Nu modifica lib/supabase/server.ts sau client.ts
- Nu dezactiva RLS pe nicio tabelă
- Nu modifica tabela `profiles` fără confirmare (are trigger auth)
- Nu șterge date — folosește soft delete (deleted_at timestamp)
- Nu schimba structura memberships până nu se finalizează migrarea RBAC
- Nu folosi localStorage/sessionStorage în componente

## PRIORITATE CURENTĂ

Sprint 1: RBAC dinamic — migrare de la memberships.role la tabele
roles/user_roles/permissions. Detalii în docs/DOC3_PLAN_EXECUTIE_v4.0.md