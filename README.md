# s-s-m.ro — Platformă SSM/PSI Digitală

> Platformă modernă de digitalizare a compliance-ului SSM (Securitate și Sănătate în Muncă) și PSI (Prevenire și Stingere Incendii) pentru consultanți și firme din România, Bulgaria, Ungaria și Germania.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/yourusername/s-s-m-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](package.json)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

---

## 📸 Screenshots

_Screenshots vor fi adăugate în curând_

<!--
![Dashboard Overview](docs/screenshots/dashboard.png)
![Medical Management](docs/screenshots/medical.png)
![Equipment Tracking](docs/screenshots/equipment.png)
-->

---

## ✨ Features

### Pentru Consultanți SSM/PSI
- 📊 **Dashboard centralizat** — vizualizare completă a tuturor clienților și alertelor
- 👥 **Gestionare multi-organizații** — administrare simultană a 100+ clienți
- 📋 **Raportare automată** — generare documente de conformitate
- 🔔 **Sistem de alerte** — notificări pentru scadențe și obligații

### Pentru Firme
- 👨‍💼 **Gestionare angajați** — dosare complete cu instruiri și avize medicale
- 🏥 **Management medical** — urmărire avize medicale, programări, istorice
- 🔧 **Evidență echipamente** — tracking echipamente de protecție și inspecții ISCIR
- 📚 **Instruire SSM** — planificare și urmărire instruiri periodice
- 📄 **Biblioteca documente** — stocare securizată fișe de post, proceduri, documente

### Funcționalități Tehnice
- 🌍 **Multilingv** — RO, BG, EN, HU, DE (next-intl)
- 🔐 **RBAC dinamic** — sistem avansat de roluri și permisiuni
- 📱 **Responsive design** — optimizat pentru desktop, tabletă, mobile
- 🔒 **Securitate** — Row Level Security (RLS) pe toate tabelele
- 📊 **Analytics** — rapoarte și statistici detaliate
- 🚀 **Performance** — optimizat pentru viteza și scalabilitate

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** — React framework cu App Router
- **[TypeScript](https://www.typescriptlang.org/)** — Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first CSS
- **[next-intl](https://next-intl-docs.vercel.app/)** — Internationalization

### Backend & Database
- **[Supabase](https://supabase.com/)** — Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Storage

### Deployment & Tools
- **[Vercel](https://vercel.com/)** — Hosting și CI/CD
- **[ESLint](https://eslint.org/)** — Code linting
- **[Prettier](https://prettier.io/)** — Code formatting
- **[Husky](https://typicode.github.io/husky/)** — Git hooks

---

## 📋 Prerequisites

Asigură-te că ai instalate următoarele pe sistemul tău:

- **Node.js** — versiunea 20.x sau mai recentă
  ```bash
  node --version  # trebuie să fie >= 20.0.0
  ```
- **npm** — versiunea 9.x sau mai recentă
  ```bash
  npm --version
  ```
- **Git** — pentru version control
  ```bash
  git --version
  ```

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/s-s-m-app.git
cd s-s-m-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Creează un fișier `.env.local` în root-ul proiectului:

```bash
cp .env.local.example .env.local
```

Completează variabilele de mediu în `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Analytics, Monitoring
# NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

**Unde găsești cheile Supabase:**
1. Du-te la [Supabase Dashboard](https://app.supabase.com/)
2. Selectează proiectul tău
3. Settings → API → Project URL și anon/service_role keys

### 4. Database Setup

Migrările sunt gestionate prin Supabase. Pentru a aplica migrările:

```bash
# Instalează Supabase CLI (dacă nu e deja instalat)
npm install -g supabase

# Link project
supabase link --project-ref uhccxfyvhjeudkexcgiq

# Aplică migrările
supabase db push
```

---

## 💻 Development Commands

### Start Development Server

```bash
npm run dev
```

Aplicația va fi disponibilă la [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format with Prettier
npm run format

# Check formatting
npm run format:check
```

### Type Checking

```bash
# Check TypeScript types
npm run type-check
```

### Database Commands

```bash
# Generate TypeScript types from Supabase
npm run supabase:types

# Create new migration
supabase migration new migration_name

# Apply migrations
supabase db push

# Reset database (⚠️ DANGER: sterge toate datele)
supabase db reset
```

---

## 📁 Project Structure

```
s-s-m-app/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Internationalized routes
│   │   ├── (public)/             # Public pages (landing, blog, FAQ)
│   │   ├── admin/                # Admin dashboard
│   │   │   ├── organizations/    # Organization management
│   │   │   ├── roles/            # RBAC role management
│   │   │   ├── users/            # User management
│   │   │   └── audit/            # Audit logs
│   │   ├── dashboard/            # Main app dashboard
│   │   │   ├── medical/          # Medical records management
│   │   │   ├── equipment/        # Equipment tracking
│   │   │   ├── trainings/        # Training management
│   │   │   ├── employees/        # Employee management
│   │   │   ├── documents/        # Document library
│   │   │   ├── alerts/           # Alert management
│   │   │   └── settings/         # User settings
│   │   ├── login/                # Authentication
│   │   ├── register/             # Registration
│   │   └── onboarding/           # User onboarding
│   └── api/                      # API routes
│       ├── v1/                   # Versioned API endpoints
│       └── stripe/               # Payment integration
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   ├── dashboard/                # Dashboard-specific components
│   ├── forms/                    # Form components
│   ├── navigation/               # Navigation components
│   └── landing/                  # Landing page components
├── lib/                          # Utility libraries
│   ├── supabase/                 # Supabase clients
│   │   ├── server.ts             # Server-side client
│   │   └── client.ts             # Browser client
│   ├── services/                 # Business logic services
│   ├── types.ts                  # TypeScript type definitions
│   ├── rbac.ts                   # RBAC utilities
│   └── utils.ts                  # Helper functions
├── hooks/                        # Custom React hooks
├── contexts/                     # React contexts
├── messages/                     # Internationalization messages
│   ├── ro/                       # Romanian (default)
│   ├── bg/                       # Bulgarian
│   ├── en/                       # English
│   ├── hu/                       # Hungarian
│   └── de/                       # German
├── supabase/                     # Supabase configuration
│   ├── migrations/               # Database migrations
│   └── kong.yml                  # API gateway config
├── docs/                         # Documentation
│   ├── DOC1_*.md                 # Feature specifications
│   └── DOC3_*.md                 # Implementation plans
├── public/                       # Static assets
├── scripts/                      # Utility scripts
├── .env.local.example            # Environment variables template
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── CLAUDE.md                     # AI assistant instructions
└── README.md                     # This file
```

---

## 🚢 Deployment

### Deploy to Vercel

Această aplicație este optimizată pentru Vercel și se poate deploya în câțiva pași simpli:

#### Method 1: Vercel Dashboard (Recommended)

1. **Push codul pe GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import în Vercel**
   - Du-te la [Vercel Dashboard](https://vercel.com/dashboard)
   - Click pe "Add New..." → "Project"
   - Selectează repository-ul tău GitHub
   - Vercel va detecta automat că e Next.js

3. **Configure Environment Variables**
   - În Vercel Dashboard → Settings → Environment Variables
   - Adaugă toate variabilele din `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `NEXT_PUBLIC_APP_URL` (URL-ul Vercel)

4. **Deploy**
   - Click "Deploy"
   - Vercel va builda și deploya automat
   - Primești un URL: `https://your-app.vercel.app`

#### Method 2: Vercel CLI

```bash
# Instalează Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Post-Deployment Checklist

- [ ] Verifică că toate variabilele de mediu sunt setate
- [ ] Configurează domeniul custom (dacă există)
- [ ] Verifică că Supabase permite origin-ul Vercel în RLS policies
- [ ] Testează autentificarea
- [ ] Verifică că toate paginile se încarcă corect

### Continuous Deployment

Odată configurat, Vercel va deploya automat:
- **Production** — când faci push pe branch-ul `main`
- **Preview** — pentru fiecare pull request

---

## 🤝 Contributing

Contribuțiile sunt binevenite! Pentru a contribui:

### 1. Fork & Clone

```bash
# Fork repository-ul pe GitHub, apoi:
git clone https://github.com/yourusername/s-s-m-app.git
cd s-s-m-app
```

### 2. Create Branch

```bash
git checkout -b feature/amazing-feature
# sau
git checkout -b fix/bug-description
```

### 3. Make Changes

- Respectă [coding guidelines](#reguli-cod) din CLAUDE.md
- Scrie commit messages descriptive:
  - `feat: add new feature`
  - `fix: resolve bug in component`
  - `refactor: improve code structure`
  - `docs: update documentation`
  - `chore: update dependencies`

### 4. Test

```bash
# Run linting
npm run lint

# Type check
npm run type-check

# Build
npm run build
```

### 5. Commit & Push

```bash
git add .
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
```

### 6. Create Pull Request

- Du-te pe GitHub și creează un Pull Request
- Descrie ce schimbări ai făcut
- Menționează issue-ul rezolvat (dacă există)

### Code Style Guidelines

- **TypeScript strict mode** — toate tipurile trebuie definite
- **camelCase** — pentru funcții și variabile
- **PascalCase** — pentru componente React
- **Limba cod** — engleză (variabile, funcții, comentarii)
- **Limba UI** — română (default)
- **Imports** — folosește alias `@/` pentru path-uri absolute
- **Components** — marchează client components cu `'use client'`
- **Error handling** — folosește try-catch, mesaje în română pentru UI

---

## 📄 License

Acest proiect este licențiat sub **MIT License**.

```
MIT License

Copyright (c) 2024-2026 s-s-m.ro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact

**Proprietar:** Daniel — Consultant SSM/PSI cu 20+ ani experiență

- 🌐 **Website:** [https://s-s-m.ro](https://s-s-m.ro)
- 📱 **App:** [https://app.s-s-m.ro](https://app.s-s-m.ro)
- 📧 **Email:** contact@s-s-m.ro
- 💼 **LinkedIn:** [linkedin.com/company/s-s-m-ro](https://linkedin.com/company/s-s-m-ro)

### Support

Pentru întrebări tehnice sau probleme:
1. Verifică [Issues](https://github.com/yourusername/s-s-m-app/issues) existente
2. Creează un Issue nou cu:
   - Descriere detaliată a problemei
   - Pași pentru reproducere
   - Environment (browser, OS, versiune Node.js)
   - Screenshots (dacă e relevant)

---

## 🙏 Acknowledgments

- **Daniel** — pentru viziune și expertise în domeniul SSM/PSI
- **Supabase** — pentru backend infrastructure
- **Vercel** — pentru hosting și deployment
- **Next.js** — pentru React framework
- **Comunitatea open-source** — pentru toate instrumentele folosite

---

## 📊 Project Status

- ✅ **MVP** — Deployed și funcțional
- 🚧 **Sprint 1** — Implementare RBAC dinamic (în curs)
- 📋 **Roadmap** — Vezi [docs/DOC3_PLAN_EXECUTIE_v4.0.md](docs/DOC3_PLAN_EXECUTIE_v4.0.md)

### Recent Updates

- ✨ Adăugat suport multi-lingv (RO, BG, EN, HU, DE)
- 🔐 Implementare sistem RBAC dinamic
- 📊 Dashboard îmbunătățit cu analytics
- 🏥 Management medical complet
- 🔧 Tracking echipamente și inspecții ISCIR
- 📚 Bibliotecă documente cu categorii

---

<div align="center">

**[⬆ Back to Top](#s-s-mro--platformă-ssmpsi-digitală)**

Made with ❤️ in România

</div>
