// lib/supabase/clients.ts
// Unified Supabase client utilities with TypeScript types
// 3 client types: Browser, Server (with cookies), Service (admin)
// Respectă Code Contract: camelCase, error handling, TypeScript strict

import { createBrowserClient as createBrowserClientSSR } from '@supabase/ssr'
import { createServerClient as createServerClientSSR } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Database type placeholder - can be replaced with generated types
// Run: npx supabase gen types typescript --project-id uhccxfyvhjeudkexcgiq
export type Database = any

/**
 * Browser Client - pentru Client Components
 * Singleton pattern, folosește cookies automat din browser
 * @returns Supabase client cu auth context din browser
 */
export function createBrowserClient() {
  return createBrowserClientSSR<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Server Client - pentru Server Components și Server Actions
 * Folosește Next.js cookies() pentru a menține sesiunea auth
 * @param cookieStore - Next.js cookies() object (trebuie awaitat înainte)
 * @returns Supabase client cu auth context din server
 */
export async function createServerClient() {
  const cookieStore = await cookies()

  return createServerClientSSR<Database>(
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
            // Ignoră erori în Server Components (read-only în unele contexte)
          }
        },
      },
    }
  )
}

/**
 * Service Client - pentru Admin Operations
 * Folosește service_role key cu bypass RLS
 * ⚠️ ATENȚIE: Nu expune niciodată în client-side code!
 * Folosește doar în Server Actions, API Routes, sau cron jobs
 * @returns Supabase client cu privilegii admin (bypass RLS)
 */
export function createServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY nu este setat în environment variables. ' +
      'Acest client necesită service role key pentru operații admin.'
    )
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

// Type exports pentru convenience
export type SupabaseClient = ReturnType<typeof createBrowserClient>
export type SupabaseServerClient = Awaited<ReturnType<typeof createServerClient>>
export type SupabaseServiceClient = ReturnType<typeof createServiceClient>
