# Contributing to s-s-m.ro Platform

Mulțumim pentru interesul de a contribui la platforma s-s-m.ro! Acest document oferă ghiduri clare pentru a contribui eficient la proiect.

## 📋 Cuprins

- [Cum să contribui](#cum-să-contribui)
- [Setup local](#setup-local)
- [Convenții de cod](#convenții-de-cod)
- [Branch naming](#branch-naming)
- [Commit messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Testing](#testing)
- [Proces de review](#proces-de-review)

## Cum să contribui

### 1. Fork și Clone

```bash
# Fork repository-ul pe GitHub, apoi:
git clone https://github.com/YOUR-USERNAME/s-s-m-app.git
cd s-s-m-app

# Adaugă upstream remote
git remote add upstream https://github.com/ORIGINAL-OWNER/s-s-m-app.git
```

### 2. Sincronizare cu upstream

```bash
# Actualizează branch-ul main local
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### 3. Creează branch nou

```bash
# Folosește convenția de naming (vezi mai jos)
git checkout -b bg/feature-name
```

## Setup local

### Cerințe

- Node.js 18+ și npm/pnpm
- Supabase account (pentru database)
- Git configurat cu numele și email-ul tău

### Instalare

```bash
# Instalează dependințele
npm install

# Copiază fișierul de environment
cp .env.local.example .env.local

# Configurează variabilele în .env.local:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY

# Rulează development server
npm run dev
```

Aplicația va rula la `http://localhost:3000`

### Verificare setup

```bash
# Verifică linting
npm run lint

# Verifică build-ul
npm run build
```

**IMPORTANT**: Build-ul TREBUIE să treacă fără erori înainte de orice commit.

## Convenții de cod

### TypeScript & Styling

- **TypeScript strict mode** activat
- **camelCase** pentru funcții și variabile
- **PascalCase** pentru componente (ex: `DashboardCard.tsx`)
- **Imports**: folosește alias `@/` pentru path-uri absolute
  ```typescript
  import { createSupabaseBrowser } from '@/lib/supabase/client'
  import { Button } from '@/components/ui/Button'
  ```

### Componente

```typescript
// Componente client — marchează explicit
'use client'

import { useState } from 'react'

export default function MyComponent() {
  // ...
}
```

```typescript
// Componente server — nu necesită directive
import { createSupabaseServer } from '@/lib/supabase/server'

export default async function ServerComponent() {
  // ...
}
```

### Supabase

- **Browser**: `import { createSupabaseBrowser } from '@/lib/supabase/client'`
- **Server**: `import { createSupabaseServer } from '@/lib/supabase/server'`
- **Nu modifica** `lib/supabase/server.ts` sau `client.ts` fără aprobare

### Database

- **Row Level Security (RLS)** activ pe TOATE tabelele — nu dezactiva
- **Soft delete**: folosește `deleted_at` timestamp, nu șterge hard
- **Migrări SQL**: creează fișiere separate în `supabase/migrations/`
- **Naming**: `YYYYMMDD_descriptive_name.sql`

### Styling

- **Tailwind CSS** pentru toate stilurile
- **Design consistent**:
  - Rounded corners: `rounded-2xl`
  - Background: `bg-gray-50`
  - Accent color: `text-blue-600`, `bg-blue-600`
- **Responsive**: mobile-first approach

### Limba

- **Cod**: engleză (funcții, variabile, comentarii)
- **UI**: română (default), multilingv prin `next-intl`
- **Erori**: română pentru UI, engleză pentru console.log

### Error Handling

```typescript
try {
  // operație
} catch (error) {
  console.error('English error message for logs', error)
  toast.error('Mesaj română pentru utilizator')
}
```

## Branch Naming

Folosește convenția: `bg/feature-name` (unde `bg` = initiale contributor)

### Format

```
<initiale>/<tip>-<descriere>
```

### Exemple

```bash
# Features noi
bg/add-medical-alerts
bg/dashboard-statistics

# Bug fixes
bg/fix-login-redirect
bg/fix-date-formatting

# Refactoring
bg/refactor-auth-flow
bg/cleanup-unused-imports

# Documentation
bg/update-readme
bg/add-api-docs
```

## Commit Messages

### Format

```
<tip>: <descriere concisă>

[corp opțional cu detalii]

[footer opțional cu refs]
```

### Tipuri

- **feat**: feature nou
- **fix**: bug fix
- **refactor**: refactorizare cod
- **docs**: documentație
- **style**: formatare cod (fără schimbări funcționale)
- **test**: adăugare/modificare teste
- **chore**: task-uri auxiliare (dependencies, config)
- **perf**: îmbunătățiri performanță

### Exemple

```bash
# Feature simplu
git commit -m "feat: add medical appointment reminders"

# Bug fix cu detalii
git commit -m "fix: resolve login redirect loop

Users were stuck in redirect loop when accessing /dashboard
directly. Fixed by checking auth state before redirect."

# Refactoring
git commit -m "refactor: extract equipment validation logic"

# Documentation
git commit -m "docs: update API documentation for alerts endpoint"

# Multiple fișiere
git commit -m "feat: implement RBAC permissions system

- Add roles, user_roles, permissions tables
- Create RBAC helper functions
- Update middleware to check permissions
- Add tests for permission checking

Refs: DOC3_PLAN_EXECUTIE_v4.0.md"
```

### Reguli

- ✅ Prima linie: max 72 caractere
- ✅ Folosește imperativul ("add" nu "added")
- ✅ Prima linie în engleză
- ✅ Fără punct la final
- ✅ Corp opțional pentru context
- ❌ Nu include fișiere generate (build/, .next/)

## Pull Requests

### Înainte de PR

1. **Sync cu main**
   ```bash
   git checkout main
   git pull upstream main
   git checkout bg/your-feature
   git rebase main
   ```

2. **Verifică codul**
   ```bash
   npm run lint
   npm run build  # TREBUIE să treacă
   ```

3. **Testează manual** funcționalitatea

### Creare PR

1. Push branch-ul:
   ```bash
   git push origin bg/your-feature
   ```

2. Deschide PR pe GitHub către `main`

3. Completează template-ul (vezi `.github/PULL_REQUEST_TEMPLATE.md`)

### Titlu PR

Folosește același format ca pentru commit-uri:

```
feat: add medical appointment calendar view
fix: resolve equipment list filtering issue
docs: add contributing guidelines
```

### Descriere PR

Template-ul va include automat:
- ✅ Checklist de verificare
- 📝 Descriere schimbări
- 🧪 Plan testare
- 📸 Screenshots (dacă UI)
- 🔗 Issue links

## Testing

### Manual Testing

Testează următoarele înainte de PR:

#### Funcționalitate
- [ ] Feature-ul funcționează conform cerințelor
- [ ] Nu apar erori în console
- [ ] Comportament corect pentru edge cases

#### UI/UX (dacă aplicabil)
- [ ] Design consistent cu dashboard-ul
- [ ] Responsive pe mobile/tablet/desktop
- [ ] Accesibilitate (keyboard navigation, contrast)

#### Database
- [ ] RLS funcționează corect (users văd doar datele lor)
- [ ] Nu apar erori de permissions
- [ ] Migrările rulează fără erori

#### Cross-browser (dacă UI major)
- [ ] Chrome
- [ ] Firefox
- [ ] Safari (dacă posibil)

### Automated Testing

Când sunt disponibile:
```bash
npm run test        # Unit tests
npm run test:e2e    # E2E tests
```

## Proces de Review

### Timeline

- **Review inițial**: 1-2 zile lucrătoare
- **Re-review după changes**: 24 ore

### Criterii Review

Reviewers vor verifica:

1. **Funcționalitate**
   - Feature-ul funcționează corect
   - Edge cases sunt acoperite
   - Nu introduce regressions

2. **Cod**
   - Respectă convenții proiect
   - TypeScript strict, fără `any`
   - Cod curat și lizibil
   - Performance OK

3. **Database**
   - RLS corect implementat
   - Migrări testate
   - Indexuri adecvate

4. **Security**
   - Nu expune date sensibile
   - Input validation
   - Proper authentication/authorization

5. **Documentation**
   - Comentarii pentru logică complexă
   - README actualizat (dacă e cazul)
   - CLAUDE.md actualizat (dacă schimbări majore)

### Addressing Feedback

```bash
# Fă modificările solicitate
git add .
git commit -m "fix: address review feedback"
git push origin bg/your-feature
```

### Approval & Merge

- ✅ Necesită **1-2 approvals** (în funcție de complexitate)
- ✅ Toate CI checks trebuie să fie verzi
- ✅ Merge va fi făcut de maintainer
- ✅ Branch-ul va fi șters automat după merge

## ⚠️ Nu face fără confirmare

- ❌ Nu șterge fișiere existente
- ❌ Nu schimba schema DB fără SQL migration separat
- ❌ Nu modifica `lib/supabase/server.ts` sau `client.ts`
- ❌ Nu dezactiva RLS pe nicio tabelă
- ❌ Nu modifica tabela `profiles` (are trigger auth)
- ❌ Nu șterge date — folosește soft delete
- ❌ Nu schimba structura `memberships` (migrare RBAC în curs)
- ❌ Nu folosi `localStorage`/`sessionStorage` în server components

## 📚 Resurse

- **CLAUDE.md**: context proiect, reguli cod
- **docs/DOC1_SCHEMA_COMPLET.md**: documentație completă database
- **docs/DOC3_PLAN_EXECUTIE_v4.0.md**: plan migrare RBAC
- **README.md**: overview proiect și setup
- **Supabase Dashboard**: https://supabase.com/dashboard/project/uhccxfyvhjeudkexcgiq

## 💬 Întrebări?

- Deschide un **Discussion** pe GitHub pentru întrebări generale
- Deschide un **Issue** pentru bug reports sau feature requests
- Contactează maintainers pentru clarificări urgente

---

**Mulțumim pentru contribuție! 🚀**

Fiecare PR ne ajută să construim o platformă mai bună pentru consultanții SSM/PSI din România și nu numai.
