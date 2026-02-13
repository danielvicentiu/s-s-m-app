// lib/supabase/clients.ts
// Centralized Supabase Client Factory
// 3 exports: Browser (client components), Server (SSR/API routes), Service (admin, bypasses RLS)
// TypeScript typed cu Database schema

import { createBrowserClient as createBrowserSupabase } from '@supabase/ssr'
import { createServerClient as createServerSupabase } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// TODO: Generate Database types from Supabase CLI
// Run: npx supabase gen types typescript --project-id uhccxfyvhjeudkexcgiq > lib/types/database.ts
type Database = any

/**
 * Browser Client — pentru Client Components
 * Folosește NEXT_PUBLIC_SUPABASE_ANON_KEY
 * RLS activ, context user din browser
 */
export function createBrowserClient() {
  return createBrowserSupabase<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Server Client — pentru Server Components și API Routes
 * Folosește cookies pentru sesiune auth
 * RLS activ, context user din cookies
 */
export async function createServerClient() {
  const cookieStore = await cookies()

  return createServerSupabase<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignoră erori în Server Components (read-only context)
          }
        },
      },
    }
  )
}

/**
 * Service Client — pentru operațiuni admin
 * Folosește SUPABASE_SERVICE_ROLE_KEY
 * BYPASSES RLS — folosește doar pentru operațiuni admin sigure
 * Nu expune niciodată în browser
 */
export function createServiceClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables')
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
