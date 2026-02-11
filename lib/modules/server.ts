// lib/supabase/server.ts
// Client Supabase pentru Server Components (SSR)
// Folosește cookies pentru a menține sesiunea auth
// Respectă Code Contract: camelCase funcții, error handling obligatoriu

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServer() {
  const cookieStore = await cookies()

  return createServerClient(
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
            // Ignoră erori în Server Components (read-only)
          }
        },
      },
    }
  )
}

// Helper: ia organizațiile userului curent (prin memberships)
export async function getCurrentUserOrgs() {
  const supabase = await createSupabaseServer()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { user: null, orgs: [], error: authError?.message || 'Nu ești autentificat' }
  }

  const { data: memberships, error: memError } = await supabase
    .from('memberships')
    .select(`
      role,
      organization:organizations (
        id, name, cui, data_completeness, cooperation_status
      )
    `)
    .eq('user_id', user.id)
    .eq('is_active', true)

  if (memError) {
    return { user, orgs: [], error: memError.message }
  }

  return { user, orgs: memberships || [], error: null }
}
