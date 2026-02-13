# S-S-M.ro — Digital SSM/PSI Compliance Platform

![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat&logo=supabase)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)
![License](https://img.shields.io/badge/License-Proprietary-red)

A comprehensive digital platform for occupational health and safety (SSM - Securitate și Sănătate în Muncă) and fire safety (PSI - Prevenirea și Stingerea Incendiilor) compliance management, designed for safety consultants and their client companies across Romania, Bulgaria, Hungary, and Germany.

🌐 **Live Platform**: [https://app.s-s-m.ro](https://app.s-s-m.ro)

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Multi-Country Support](#multi-country-support)
- [Database Schema](#database-schema)
- [Development Guidelines](#development-guidelines)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About the Project

S-S-M.ro is a full-stack SaaS platform built to digitize and streamline workplace safety compliance for professional SSM/PSI consultants managing 100+ active clients. The platform replaces manual paper-based processes with a centralized, role-based system for:

- **Safety Consultants** — Manage multiple client organizations, generate compliance reports, track deadlines
- **Company Administrators** — Oversee employee safety records, equipment certifications, training schedules
- **Employees** — Access personal safety documents, medical records, training certificates

**Created by**: Daniel, SSM/PSI consultant with 20+ years of experience
**Active Users**: 100+ client companies across 4 countries

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16.1.4 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom component library with Lucide React icons
- **State Management**: React Server Components + Client Components pattern
- **Internationalization**: next-intl (Romanian, Bulgarian, English, Hungarian, German)

### Backend
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **Authentication**: Supabase Auth (email/password)
- **API**: Next.js API Routes + Server Actions
- **File Storage**: Supabase Storage
- **Email**: Resend API

### Additional Tools
- **PDF Generation**: jsPDF + jsPDF-AutoTable
- **Excel Export**: XLSX
- **Payments**: Stripe integration
- **Deployment**: Vercel
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint, TypeScript strict mode

## ✨ Key Features

### Core Modules
- 📊 **Dashboard** — Real-time compliance metrics, alerts, and activity overview
- 👥 **Employee Management** — Complete employee database with organizational hierarchy
- 🏥 **Medical Records** — Track medical examinations, certificates, and expiration alerts
- 📚 **Training Management** — Schedule and track SSM/PSI training sessions, generate certificates
- 🛡️ **Equipment & PPE** — Manage personal protective equipment, certifications, and inspections
- 📄 **Document Generation** — Automated compliance reports, work permits, inspection checklists
- 🔔 **Alert System** — Proactive notifications for expiring documents, upcoming deadlines
- 📋 **Incidents & Accidents** — Record workplace incidents, generate ITM notifications
- 💰 **Penalties Tracking** — Monitor and document labor inspectorate penalties
- 🔍 **Audit Log** — Complete activity tracking for compliance verification

### Advanced Features
- 🌍 **Multi-country Support** — Tailored compliance rules for RO, BG, HU, DE
- 🔐 **Role-Based Access Control (RBAC)** — Dynamic permissions system with granular access
- 📱 **Responsive Design** — Fully mobile-optimized interface
- 🔄 **Real-time Updates** — Instant synchronization across all users
- 📊 **Export & Reporting** — PDF and Excel export for all major modules
- 🎨 **Professional Templates** — Pre-built templates for common compliance documents

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **yarn** package manager
- **Supabase account** (for database and authentication)
- **Vercel account** (optional, for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/s-s-m-app.git
   cd s-s-m-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (optional, for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Resend (optional, for emails)
RESEND_API_KEY=your_resend_api_key
```

**Important**: Never commit `.env.local` to version control. This file is already in `.gitignore`.

### Running the Application

1. **Development mode**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

2. **Production build**
   ```bash
   npm run build
   npm start
   ```

3. **Linting**
   ```bash
   npm run lint
   ```

4. **Testing**
   ```bash
   npm test
   npm run test:watch
   ```

## 📁 Project Structure

```
s-s-m-app/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Internationalized routes
│   │   ├── (auth)/              # Authentication pages (login, register)
│   │   ├── (public)/            # Public pages (landing, marketing)
│   │   └── dashboard/           # Protected dashboard routes
│   ├── admin/                   # Admin-only pages (roles, organizations)
│   ├── api/                     # API routes and server actions
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   │   ├── StatusBadge.tsx     # Status indicators
│   │   ├── EmptyState.tsx      # Empty state placeholders
│   │   ├── ConfirmDialog.tsx   # Confirmation dialogs
│   │   └── ValuePreview.tsx    # Data preview components
│   ├── dashboard/               # Dashboard-specific components
│   ├── forms/                   # Form components
│   └── layouts/                 # Layout components
├── lib/                         # Utility libraries
│   ├── supabase/               # Supabase clients
│   │   ├── client.ts           # Browser client
│   │   └── server.ts           # Server client (SSR)
│   ├── types.ts                # TypeScript type definitions
│   ├── rbac.ts                 # Role-based access control utilities
│   ├── utils.ts                # General utilities
│   └── validations.ts          # Form validation schemas
├── hooks/                       # Custom React hooks
├── messages/                    # Internationalization message files
│   ├── ro.json                 # Romanian (default)
│   ├── bg.json                 # Bulgarian
│   ├── en.json                 # English
│   ├── hu.json                 # Hungarian
│   └── de.json                 # German
├── public/                      # Static assets
├── scripts/                     # Utility scripts
├── supabase/                    # Supabase configuration
│   └── migrations/             # Database migrations
├── __tests__/                   # Test files
├── CLAUDE.md                    # AI assistant instructions
├── middleware.ts                # Next.js middleware (auth, i18n)
└── package.json                # Project dependencies
```

## 🏗 Architecture Overview

### Authentication Flow
1. Users authenticate via Supabase Auth (email/password)
2. JWT tokens are stored in HTTP-only cookies
3. Middleware validates authentication on protected routes
4. User profile is linked via `profiles` table (automatic trigger on signup)

### Data Access Pattern
```
User → Middleware → Server Component → Supabase (RLS enabled) → PostgreSQL
```

- **Row Level Security (RLS)** is enabled on ALL tables
- Users can only access data for organizations they belong to
- Access is controlled via `memberships` table (linking users to organizations)

### Role-Based Access Control (RBAC)
The platform is transitioning from hardcoded roles to a dynamic RBAC system:

**Current Roles** (legacy, via `memberships.role`):
- `consultant` — Full access, manages multiple client organizations
- `firma_admin` — Company administrator, manages their organization
- `angajat` — Employee, view-only access to personal data

**New RBAC System** (in implementation):
- `roles` table — Define custom roles per organization
- `user_roles` table — Assign roles to users
- `permissions` table — Granular permission definitions
- See `docs/DOC3_PLAN_EXECUTIE_v4.0.md` for migration details

### Database Design
- **25+ core tables** including:
  - `organizations` — Client companies
  - `employees` — Workforce database
  - `trainings` — Training sessions and certificates
  - `medical_records` — Medical examination tracking
  - `equipment` — PPE and equipment certifications
  - `documents` — Document management
  - `alerts` — Automated compliance alerts
  - `audit_log` — Activity tracking
  - `penalties` — Labor inspectorate penalties
  - `incidents` — Workplace accident reporting

## 🌍 Multi-Country Support

The platform supports compliance regulations for multiple countries:

- 🇷🇴 **Romania** (default) — Primary market, full regulatory compliance
- 🇧🇬 **Bulgaria** — Localized rules and translations
- 🇭🇺 **Hungary** — Hungarian labor law compliance
- 🇩🇪 **Germany** — German occupational safety regulations
- 🇬🇧 **English** — International fallback

### Internationalization (i18n)
- Powered by `next-intl`
- Language detection via URL prefix (`/ro`, `/bg`, `/en`, `/hu`, `/de`)
- All user-facing text is translated
- Date/time formatting localized per country
- Default language: Romanian

## 🗄 Database Schema

Key tables and their purposes:

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (linked to Supabase Auth) |
| `organizations` | Client companies managed by consultants |
| `memberships` | User-organization relationships + roles |
| `employees` | Employee records within organizations |
| `trainings` | Safety training sessions and certifications |
| `medical_records` | Medical examination tracking |
| `equipment` | Equipment and PPE certifications |
| `documents` | Generated compliance documents |
| `alerts` | Automated expiration and deadline alerts |
| `audit_log` | Complete activity audit trail |
| `incidents` | Workplace incident/accident reports |
| `penalties` | Labor inspectorate penalty tracking |

**All tables have RLS enabled** with policies based on organization membership.

See `supabase/migrations/` for complete schema definitions.

## 💻 Development Guidelines

### Code Style
- **Language**: English for code (variables, functions, comments)
- **UI Language**: Romanian (default), other languages via i18n
- **Naming Conventions**:
  - Components: `PascalCase` (e.g., `DashboardCard.tsx`)
  - Functions/variables: `camelCase` (e.g., `fetchUserData`)
  - Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_FILE_SIZE`)
- **TypeScript**: Strict mode enabled, no `any` types
- **Imports**: Use `@/` alias for absolute imports

### Component Guidelines
- Use `'use client'` directive for client components
- Server components by default
- Browser Supabase client: `import { createSupabaseBrowser } from '@/lib/supabase/client'`
- Server Supabase client: `import { createSupabaseServer } from '@/lib/supabase/server'`

### Git Workflow
- **Commit prefixes**:
  - `feat:` — New features
  - `fix:` — Bug fixes
  - `refactor:` — Code refactoring
  - `docs:` — Documentation updates
  - `test:` — Test additions/updates
- **Build validation**: `npm run build` must pass before committing
- **Never**:
  - Disable RLS on any table
  - Commit `.env.local` or secrets
  - Modify `lib/supabase/server.ts` or `client.ts` without confirmation
  - Delete data (use soft delete with `deleted_at` timestamp)

### Database Migrations
- All schema changes require a SQL migration file
- Store migrations in `supabase/migrations/` or `docs/`
- Test migrations in development before applying to production
- Never modify the `profiles` table without approval (has auth trigger)

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode (interactive)
npm run test:watch

# Run specific test file
npm test -- EmployeeList.test.tsx
```

Test files are located in `__tests__/` directory, organized by feature.

## 🚀 Deployment

### Vercel Deployment

The application is deployed on Vercel and automatically deploys on push to `main` branch.

**Live URL**: [https://app.s-s-m.ro](https://app.s-s-m.ro)

1. **Connect GitHub repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Set build command**: `npm run build`
4. **Set output directory**: `.next`

### Manual Deployment

```bash
# Build production bundle
npm run build

# Start production server
npm start
```

### Environment Configuration

Ensure all environment variables from `.env.local` are configured in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- Stripe and Resend keys (if using those features)

## 🤝 Contributing

This is a proprietary project. Contributions are currently limited to the core development team.

### Development Process
1. Create a feature branch from `main`
2. Follow the code style guidelines
3. Write tests for new features
4. Ensure `npm run build` passes
5. Submit PR with detailed description
6. Wait for code review

### Reporting Issues
- Use GitHub Issues for bug reports
- Include steps to reproduce
- Provide screenshots for UI issues
- Mention affected browsers/devices

## 📄 License

**Proprietary License** — All rights reserved.

This software is the exclusive property of S-S-M.ro and is not open source. Unauthorized copying, distribution, or use of this software is strictly prohibited.

---

**Developed by**: Daniel, SSM/PSI Consultant
**Platform**: [https://app.s-s-m.ro](https://app.s-s-m.ro)
**Contact**: [support contact information]

---

## 📚 Additional Documentation

- `CLAUDE.md` — AI assistant instructions and project guidelines
- `docs/DOC3_PLAN_EXECUTIE_v4.0.md` — RBAC migration plan
- `supabase/migrations/` — Database schema evolution
- `AUDIT_RESULTS.md` — Security audit findings
- `FIXES_APPLIED.md` — Historical bug fixes
