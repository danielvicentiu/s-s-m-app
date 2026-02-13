# Contributing to s-s-m.ro

Thank you for your interest in contributing to the s-s-m.ro platform! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Development Setup](#development-setup)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Commit Message Conventions](#commit-message-conventions)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Database Changes](#database-changes)

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account (for local development)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd s-s-m-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Verify the build**

   Before making changes, ensure everything works:
   ```bash
   npm run build
   ```

## Branch Naming Conventions

We use a structured branch naming system to organize work:

### Branch Prefixes

- **`bg/`** - For background agents and automated tasks
  - Example: `bg/contributing`, `bg/cleanup-logs`

- **`feature/`** - For new features and enhancements
  - Example: `feature/user-profile`, `feature/rbac-migration`

- **`fix/`** - For bug fixes
  - Example: `fix/login-redirect`, `fix/email-validation`

- **`refactor/`** - For code refactoring without changing functionality
  - Example: `refactor/api-routes`, `refactor/components`

- **`docs/`** - For documentation updates
  - Example: `docs/api-reference`, `docs/setup-guide`

### Naming Guidelines

- Use lowercase letters
- Use hyphens (-) to separate words
- Keep names descriptive but concise
- Examples:
  - ✅ `feature/medical-records-export`
  - ✅ `fix/dashboard-loading-state`
  - ✅ `bg/database-cleanup`
  - ❌ `myFeature`
  - ❌ `fix_bug`
  - ❌ `feature/this-is-a-very-long-branch-name-that-should-be-shorter`

## Commit Message Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>: <description>

[optional body]

[optional footer]
```

### Types

- **`feat:`** - New feature or enhancement
  - Example: `feat: add user profile page with avatar upload`

- **`fix:`** - Bug fix
  - Example: `fix: resolve login redirect issue`

- **`docs:`** - Documentation changes
  - Example: `docs: update API documentation`

- **`chore:`** - Maintenance tasks (dependencies, config, etc.)
  - Example: `chore: update dependencies`

- **`refactor:`** - Code refactoring without changing functionality
  - Example: `refactor: simplify authentication logic`

- **`style:`** - Code style changes (formatting, missing semicolons, etc.)
  - Example: `style: format code with prettier`

- **`test:`** - Adding or updating tests
  - Example: `test: add unit tests for RBAC functions`

- **`perf:`** - Performance improvements
  - Example: `perf: optimize database queries`

### Guidelines

- Use present tense ("add feature" not "added feature")
- Keep the description concise (max 72 characters)
- Capitalize the first letter after the colon
- No period at the end of the description
- Use the body to explain *what* and *why*, not *how*

### Examples

```bash
feat: add Polish SSM legislative acts database

fix: correct email validation in registration form

docs: add CONTRIBUTING.md with contribution guidelines

chore: update Next.js to version 14.2

refactor: extract form validation logic to utility functions
```

## Pull Request Process

### Before Creating a PR

1. **Create your branch from `main`**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the code style guidelines
   - Write clear, descriptive commit messages
   - Test your changes thoroughly

3. **Ensure the build passes**
   ```bash
   npm run build
   ```
   ⚠️ **IMPORTANT**: The build must pass without errors before creating a PR.

4. **Update documentation if needed**
   - Update README.md if adding new features
   - Add JSDoc comments to new functions
   - Update CLAUDE.md if changing architecture

### Creating the PR

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create the Pull Request**
   - Go to GitHub and create a new Pull Request
   - Set the base branch to `main`
   - Write a clear, descriptive title
   - Fill out the PR description template

### PR Description Template

```markdown
## Summary
Brief description of what this PR does.

## Changes
- List of main changes
- Another change
- One more change

## Testing
- [ ] Tested locally
- [ ] Build passes (`npm run build`)
- [ ] No console errors
- [ ] Tested on mobile/tablet (if UI changes)

## Screenshots (if applicable)
Add screenshots for UI changes

## Notes
Any additional context or notes for reviewers
```

### Review Requirements

- **All PRs require at least one approval** before merging
- Address all review comments
- Keep PRs focused - one feature/fix per PR
- Be responsive to feedback

### Merging

- Use **"Squash and merge"** for feature branches
- Use **"Rebase and merge"** for small fixes
- Delete the branch after merging

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** - no implicit `any`, proper typing required
- **Naming conventions:**
  - Variables and functions: `camelCase`
  - Components and types: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Files: `PascalCase.tsx` for components, `camelCase.ts` for utilities

```typescript
// ✅ Good
const userName = 'John';
function getUserData() { }
type UserProfile = { };
const MAX_RETRY_COUNT = 3;

// ❌ Bad
const UserName = 'John';
function get_user_data() { }
type userProfile = { };
const max_retry_count = 3;
```

### React Components

- Use **functional components** only (no class components)
- Use **React hooks** for state and side effects
- Mark client components with `'use client'` directive explicitly
- Keep components small and focused (single responsibility)

```typescript
// ✅ Good - Client component
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}

// ✅ Good - Server component (default)
export function UserProfile({ userId }: { userId: string }) {
  // Server component logic
  return <div>Profile</div>;
}
```

### Supabase Usage

- **Server components:** Use `createSupabaseServer()`
- **Client components:** Use `createSupabaseBrowser()`
- **Never mix** server and client Supabase instances

```typescript
// Server component
import { createSupabaseServer } from '@/lib/supabase/server';

export async function ServerComponent() {
  const supabase = createSupabaseServer();
  const { data } = await supabase.from('users').select();
  return <div>{/* render data */}</div>;
}

// Client component
'use client';

import { createSupabaseBrowser } from '@/lib/supabase/client';

export function ClientComponent() {
  const supabase = createSupabaseBrowser();
  // Use supabase in client-side code
}
```

### Styling

- Use **Tailwind CSS** exclusively (no CSS modules or styled-components)
- Follow existing design patterns:
  - Rounded corners: `rounded-2xl`
  - Background: `bg-gray-50`
  - Accent color: `bg-blue-600`, `text-blue-600`
  - Consistent spacing: `p-6`, `gap-4`

```typescript
// ✅ Good
<div className="rounded-2xl bg-white p-6 shadow-sm">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
</div>

// ❌ Bad - inconsistent styling
<div className="rounded bg-white p-4">
  <h2 className="text-lg font-bold">Title</h2>
</div>
```

### Imports

- Use **`@/` alias** for absolute imports
- Group imports: external → internal → types
- Order alphabetically within groups

```typescript
// ✅ Good
import { useState } from 'react';
import { redirect } from 'next/navigation';

import { createSupabaseBrowser } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

import type { User } from '@/lib/types';

// ❌ Bad - relative imports, unordered
import type { User } from '../../lib/types';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
```

### Error Handling

- Use `try-catch` blocks for async operations
- Display errors in Romanian for UI
- Log errors in English for console
- Never expose sensitive error details to users

```typescript
try {
  await submitForm(data);
  toast.success('Formularul a fost trimis cu succes');
} catch (error) {
  console.error('Form submission failed:', error);
  toast.error('A apărut o eroare la trimiterea formularului');
}
```

### Language Conventions

- **Code:** English (variables, functions, comments)
- **UI:** Romanian (default), with i18n support for BG, EN, HU, DE
- **Documentation:** English or Romanian (depending on audience)

```typescript
// ✅ Good
function calculateTotalHours(entries: TimeEntry[]): number {
  // Calculate total hours worked
  return entries.reduce((sum, entry) => sum + entry.hours, 0);
}

// UI text in Romanian
<button>Salvează modificările</button>

// ❌ Bad - mixed languages
function calculeazaTotalOre(entries: TimeEntry[]): number {
  // Calculeaza orele totale
  return entries.reduce((sum, entry) => sum + entry.ore, 0);
}
```

## Testing

- Test all new features locally before committing
- Verify that `npm run build` passes without errors
- Test on different screen sizes for UI changes
- Check browser console for errors
- Test with different user roles if applicable

## Database Changes

### Rules

- **Never modify database schema directly** in production
- Write SQL migrations in separate files
- Store migrations in `docs/` or `supabase/migrations/`
- Test migrations on development environment first
- **Never disable RLS** on any table
- Use **soft delete** (`deleted_at` timestamp) instead of hard delete

### Migration Process

1. Create migration file: `docs/migration_YYYY_MM_DD_description.sql`
2. Write idempotent SQL (safe to run multiple times)
3. Test locally
4. Document changes in CLAUDE.md if needed
5. Get approval before running in production

### Example Migration

```sql
-- File: docs/migration_2024_01_15_add_user_preferences.sql

-- Add user_preferences column (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'preferences'
  ) THEN
    ALTER TABLE profiles ADD COLUMN preferences JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Add RLS policy
DROP POLICY IF EXISTS "Users can update own preferences" ON profiles;
CREATE POLICY "Users can update own preferences"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

## Do Not

⚠️ **Without confirmation, DO NOT:**

- Delete existing files
- Modify `lib/supabase/server.ts` or `lib/supabase/client.ts`
- Change database schema without creating SQL migration
- Disable RLS on any table
- Modify the `profiles` table (has auth trigger)
- Delete data (use soft delete instead)
- Use `localStorage` or `sessionStorage` in components
- Change `memberships` structure (RBAC migration in progress)

## Getting Help

- Check `CLAUDE.md` for project-specific guidelines
- Review `docs/` folder for detailed documentation
- Ask questions in PR comments
- Contact project maintainers

## Current Priority

🎯 **Sprint 1: RBAC Migration**

We're currently migrating from hardcoded roles (`memberships.role`) to dynamic RBAC system (`roles`, `user_roles`, `permissions` tables). See `docs/DOC3_PLAN_EXECUTIE_v4.0.md` for details.

---

Thank you for contributing to s-s-m.ro! 🚀
