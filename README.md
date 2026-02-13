# s-s-m.ro — SSM/PSI Digital Compliance Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

Modern SaaS platform for digitizing workplace safety (SSM - Securitate și Sănătate în Muncă) and fire safety (PSI - Prevenirea și Stingerea Incendiilor) compliance across Romania, Bulgaria, Hungary, and Germany.

🌐 **Live:** [app.s-s-m.ro](https://app.s-s-m.ro)

## About the Project

s-s-m.ro is a comprehensive digital platform designed for SSM/PSI consultants and companies to manage workplace safety compliance efficiently. The platform serves 100+ active clients and provides tools for:

- **Employee Management** — Medical records, training certificates, safety equipment tracking
- **Training Programs** — Scheduled sessions, attendance tracking, certification management
- **Medical Surveillance** — Expiry alerts, health monitoring, document storage
- **Equipment Management** — PPE tracking, maintenance schedules, compliance verification
- **Alerts & Notifications** — Proactive compliance reminders and deadline tracking
- **Audit Logging** — Complete activity tracking for compliance reporting
- **Multi-Organization** — Support for consultants managing multiple client companies
- **Multilingual** — Romanian (default), Bulgarian, English, Hungarian, German (next-intl integration)

Built by SSM consultants with 20+ years of field experience, the platform addresses real-world compliance challenges in multi-country operations.

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, React Server Components)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security)
- **Authentication:** Supabase Auth (email/password, role-based access control)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (utility-first, custom design system)
- **Deployment:** [Vercel](https://vercel.com/) (edge network, automatic CI/CD)
- **Internationalization:** next-intl (multi-language support)
- **UI Components:** Custom component library (shadcn/ui inspired)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/s-s-m-app.git
   cd s-s-m-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Optional: AI Features
   ANTHROPIC_API_KEY=your_anthropic_api_key

   # Optional: Stripe (usage-based billing)
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

4. **Set up the database**

   Run the SQL migrations from the `docs/` folder in your Supabase SQL Editor:
   - Start with the base schema migrations
   - Apply RBAC migrations (see `docs/DOC3_PLAN_EXECUTIE_v4.0.md`)
   - Ensure Row Level Security (RLS) is enabled on all tables

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
s-s-m-app/
├── app/
│   ├── [locale]/          # Internationalized routes
│   │   ├── dashboard/     # Protected dashboard pages
│   │   ├── admin/         # Admin pages (user management, organizations)
│   │   ├── blog/          # Blog/resources
│   │   ├── careers/       # Career pages
│   │   └── partners/      # Partner pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/
│   └── ui/                # Reusable UI components
│       ├── StatusBadge.tsx
│       ├── EmptyState.tsx
│       ├── ConfirmDialog.tsx
│       ├── AccordionV2.tsx
│       └── ...
├── lib/
│   ├── supabase/          # Supabase clients
│   │   ├── server.ts      # Server-side client (SSR)
│   │   └── client.ts      # Browser client
│   ├── services/          # Business logic services
│   │   ├── m3-obligation-extractor.ts
│   │   └── stripe-metering.ts
│   ├── types.ts           # Central TypeScript types
│   └── rbac.ts            # Role-based access control
├── docs/                  # Documentation & SQL migrations
│   ├── DOC1_*.md          # Requirements documentation
│   ├── DOC3_*.md          # RBAC migration plan
│   └── *.sql              # Database migrations
├── types/                 # Additional TypeScript definitions
└── CLAUDE.md              # AI assistant project context
```

## Available Scripts

- `npm run dev` — Start development server (localhost:3000)
- `npm run build` — Create production build (must pass before commits)
- `npm start` — Run production server
- `npm run lint` — Run ESLint
- `npm run type-check` — Run TypeScript compiler checks

## Deployment

The application is automatically deployed to Vercel on push to the `main` branch.

### Manual Deployment

1. **Connect to Vercel**
   ```bash
   vercel
   ```

2. **Set environment variables** in Vercel dashboard

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Database Migrations

Database migrations are managed manually through Supabase:
1. Create SQL migration files in `docs/` or `supabase/migrations/`
2. Test in development project
3. Apply to production via Supabase dashboard SQL Editor
4. Document changes in commit message

## Contributing

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**
   - Follow TypeScript strict mode
   - Use camelCase for functions/variables
   - Use PascalCase for components
   - Add `'use client'` directive for client components
   - Use Tailwind CSS for styling
   - Code in English, UI text in Romanian (default)

3. **Test your changes**
   ```bash
   npm run build  # Must pass before commit
   npm run lint
   ```

4. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add new feature description"
   # Prefixes: feat:, fix:, refactor:, docs:, style:, test:, chore:
   ```

5. **Push and create PR**
   ```bash
   git push origin feat/your-feature-name
   ```

### Code Standards

- **TypeScript:** Strict mode enabled, no implicit any
- **Imports:** Use `@/` alias for absolute imports
- **Components:** One component per file, named export
- **Error Handling:** Try-catch with Romanian UI messages, English console logs
- **Database:** Never disable RLS, use soft deletes (`deleted_at` timestamp)
- **Security:** Validate all user inputs, sanitize SQL parameters
- **Testing:** Write tests for critical business logic

### Before You Start

- Read `CLAUDE.md` for detailed project guidelines
- Review `docs/DOC3_PLAN_EXECUTIE_v4.0.md` for RBAC migration context
- Check existing issues and PRs to avoid duplicate work
- Join discussions for architectural decisions

## License

MIT License

Copyright (c) 2025 s-s-m.ro

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

---

**Built with ❤️ for workplace safety professionals**
