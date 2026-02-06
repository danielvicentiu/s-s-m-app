# CLAUDE.md

PROIECT: s-s-m.ro — Platformă SSM/PSI management
STACK: Next.js 14 (App Router) + Supabase + TypeScript + Tailwind CSS
DEPLOY: Vercel (TBD)

## STRUCTURĂ:
- app/dashboard/ — pagini protejate (medical, equipment)
- components/ui/ — componente reutilizabile (StatusBadge, EmptyState, ConfirmDialog, ValuePreview)
- lib/supabase/ — server.ts (SSR) + client.ts (browser, funcția createSupabaseBrowser)

## BAZA DE DATE:
Supabase cu RLS activ pe toate tabelele. 20+ tabele. Migrările se scriu în fișiere SQL separate.

## REGULI COD:
- TypeScript strict, camelCase
- Componente client: 'use client' explicit
- Supabase browser: import { createSupabaseBrowser } from '@/lib/supabase/client'
- Supabase server: import { createSupabaseServer } from '@/lib/supabase/server'
- pip: nu se folosește (nu e Python)
- Styling: Tailwind CSS, design consistent cu dashboard-ul existent (rounded-2xl, gray-50 bg, blue-600 accent)
- Limba UI: Română
- Fiecare feature nouă: commit separat cu prefix (feat:, fix:, refactor:)

## NU FACE FĂRĂ CONFIRMARE:
- Nu șterge fișiere existente
- Nu schimba schema DB fără a genera fișier SQL separat
- Nu modifica lib/supabase/server.ts sau client.ts
