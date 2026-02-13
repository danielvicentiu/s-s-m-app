# s-s-m.ro — Platformă SSM/PSI Digitală

Platformă web modernă pentru gestionarea compliance-ului SSM (Securitate și Sănătate în Muncă) și PSI (Prevenire și Stingere Incendii) destinată consultanților SSM și firmelor lor din România, Bulgaria, Ungaria și Germania.

🌐 **Live:** [https://app.s-s-m.ro](https://app.s-s-m.ro)

## 📋 Descriere

Această platformă digitizează procesele de compliance SSM și PSI, oferind o soluție completă pentru:
- Consultanți SSM cu experiență în management al clienților corporativi
- Firme care trebuie să gestioneze dosare medicale, echipamente de protecție, instruiri și documente de conformitate
- Suport multilingv: Română (default), Bulgară, Engleză, Maghiară, Germană

Proiectul este construit cu tehnologii moderne și scalabile, având la bază arhitectura Next.js App Router și Supabase pentru backend și autentificare.

## 🚀 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Internationalization:** [next-intl](https://next-intl.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **PDF Generation:** jsPDF + jsPDF-AutoTable
- **Email:** [Resend](https://resend.com/)
- **Deployment:** [Vercel](https://vercel.com/)

## ✨ Features

### Core Features
- 🔐 **Autentificare și autorizare** — sistem complet cu Supabase Auth și RBAC dinamic
- 🏢 **Management organizații** — gestionare multiplă organizații și membri
- 👥 **Gestionare angajați** — date complete, istoric, status activ/inactiv
- 📋 **Dosare medicale** — avize medicale, scadențe, notificări automate
- 🎓 **Instruiri SSM/PSI** — planificare, urmărire participanți, certificate
- 🧯 **Echipamente de protecție** — inventar, distribuire, scadențe verificări
- 📄 **Documente** — stocare organizată, categorii, acces controlat
- 🔔 **Alerte și notificări** — sistem automat pentru scadențe și evenimente
- 📊 **Dashboard interactiv** — statistici, grafice, overview complet
- 🌍 **Multilingv** — suport pentru 5 limbi (RO, BG, EN, HU, DE)

### Advanced Features
- 📝 **Audit log** — urmărire completă activități utilizatori
- ⚠️ **Management penalități** — înregistrare și raportare non-conformități
- 🎯 **RBAC (Role-Based Access Control)** — sistem de permisiuni granular
- 📱 **Responsive design** — optimizat pentru desktop, tabletă și mobil
- 🔒 **Row Level Security** — securitate la nivel de rând în baza de date
- 💾 **Soft delete** — ștergere reversibilă pentru toate entitățile

## 📦 Getting Started

### Prerequisite

- Node.js 20+ și npm
- Cont Supabase (pentru baza de date)
- Git

### Instalare

1. **Clone repository:**
```bash
git clone https://github.com/yourusername/s-s-m-app.git
cd s-s-m-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment setup:**

Creează fișierul `.env.local` în rădăcina proiectului:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Optional - Resend)
RESEND_API_KEY=your_resend_api_key
```

**Obținere credențiale Supabase:**
- Accesează [https://supabase.com](https://supabase.com)
- Creează un proiect nou sau folosește unul existent
- Mergi la Settings → API
- Copiază `Project URL` și `anon/public key`

4. **Database setup:**

Rulează migrările SQL din directorul `docs/` sau `supabase/migrations/` în Supabase SQL Editor:
- Creează tabelele necesare
- Configurează Row Level Security policies
- Configurează trigger-uri și funcții

5. **Run development server:**
```bash
npm run dev
```

Accesează [http://localhost:3000](http://localhost:3000) în browser.

## 📁 Folder Structure

```
s-s-m-app/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Internationalization routes
│   ├── admin/                    # Admin pages (roles, organizations)
│   ├── dashboard/                # Protected dashboard pages
│   │   ├── medical/              # Medical records management
│   │   ├── equipment/            # Equipment management
│   │   ├── trainings/            # Training sessions
│   │   └── alerts/               # Alerts and notifications
│   ├── api/                      # API routes
│   └── auth/                     # Authentication pages
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── StatusBadge.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── Modal.tsx
│   │   └── form/                 # Form components
│   └── dashboard/                # Dashboard-specific components
├── lib/
│   ├── supabase/
│   │   ├── server.ts             # Server-side Supabase client
│   │   └── client.ts             # Browser Supabase client
│   ├── types.ts                  # TypeScript type definitions
│   ├── rbac.ts                   # RBAC functions
│   └── utils.ts                  # Utility functions
├── docs/                         # Documentation and SQL migrations
│   ├── DOC1_*.md                 # Technical documentation
│   ├── DOC3_*.md                 # Execution plans
│   └── *.sql                     # Database migrations
├── public/                       # Static assets
├── supabase/                     # Supabase configuration
│   └── migrations/               # Database migrations
└── CLAUDE.md                     # AI assistant instructions
```

## 🛠️ Available Scripts

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

**Important:** Rulează întotdeauna `npm run build` înainte de commit pentru a verifica că nu există erori TypeScript sau de build.

## 🗄️ Database

Proiectul folosește **Supabase** (PostgreSQL) cu următoarele caracteristici:

- **25+ tabele principale:** organizations, memberships, profiles, employees, trainings, medical_records, equipment, documents, alerts, audit_log, penalties, roles, user_roles, permissions, etc.
- **Row Level Security (RLS)** activ pe TOATE tabelele
- **Soft delete** — folosește `deleted_at` timestamp în loc de ștergere fizică
- **Audit log** — tracking automat pentru toate operațiunile critice
- **Triggers și Functions** — pentru automatizări și validări

### Relații principale:
- User ↔ Organization prin tabela `memberships`
- RBAC dinamic prin `roles`, `user_roles`, `permissions`
- Toate entitățile legate de `organization_id`

## 🔐 Authentication & Authorization

- **Autentificare:** Supabase Auth (email/password)
- **Autorizare:** RBAC dinamic în curs de implementare
  - Migrare de la roluri hardcodate (consultant, firma_admin, angajat)
  - Către sistem flexibil cu permisiuni granulare
  - Vezi `docs/DOC3_PLAN_EXECUTIE_v4.0.md` pentru detalii

## 🌍 Internationalization

Suport multilingv implementat cu **next-intl**:
- 🇷🇴 Română (default)
- 🇧🇬 Bulgară
- 🇬🇧 Engleză
- 🇭🇺 Maghiară
- 🇩🇪 Germană

Traducerile sunt gestionate în fișiere JSON separate per limbă.

## 🎨 Design System

- **Tailwind CSS** cu configurare personalizată
- **Color scheme:** Blue accent (#2563eb), Gray backgrounds
- **Border radius:** rounded-2xl pentru carduri
- **Spacing:** Consistent cu Tailwind defaults
- **Icons:** Lucide React pentru consistență
- **Responsive:** Mobile-first approach

## 🤝 Contributing

### Cod de conduită

1. **TypeScript strict** — toate fișierele .ts/.tsx
2. **Naming conventions:**
   - Components: PascalCase (DashboardCard.tsx)
   - Functions/variables: camelCase
   - Files: PascalCase pentru componente, camelCase pentru utils
3. **Imports:** Folosește alias `@/` pentru import-uri absolute
4. **Client components:** Adaugă explicit `'use client'` la începutul fișierului
5. **Limba:**
   - Cod: Engleză (variabile, funcții, comentarii)
   - UI/mesaje utilizator: Română (default)
6. **Commit messages:**
   - `feat:` — feature nou
   - `fix:` — bug fix
   - `refactor:` — refactorizare fără schimbare funcționalitate
   - `docs:` — modificări documentație
   - `style:` — formatare, styling

### Reguli importante

❌ **NU face fără confirmare:**
- Nu șterge fișiere existente
- Nu modifica schema DB fără fișier SQL separat
- Nu dezactiva RLS pe nicio tabelă
- Nu folosi localStorage/sessionStorage în server components
- Nu modifica `lib/supabase/server.ts` sau `client.ts`

✅ **Obligatoriu:**
- `npm run build` trebuie să treacă fără erori
- Try-catch pentru toate operațiunile async
- Mesaje de eroare în română pentru UI
- Testing înainte de commit
- Commit separat pentru fiecare feature

### Workflow

1. Creează branch nou: `git checkout -b feature/nume-feature`
2. Dezvoltă și testează local
3. Rulează `npm run build` pentru verificare
4. Commit cu mesaj descriptiv
5. Push și creează Pull Request
6. Code review și merge

## 📄 License

Acest proiect este proprietate privată. Toate drepturile rezervate.

**Proprietar:** Daniel — Consultant SSM/PSI

Pentru întrebări sau colaborări, contactează echipa de dezvoltare.

---

**Built with ❤️ for SSM/PSI professionals**

Dezvoltat cu Next.js și Supabase | Deployed on Vercel
