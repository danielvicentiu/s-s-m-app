// lib/supabase/client.ts
// Client Supabase pentru Browser (Client Components)
// Singleton pattern — o singură instanță per browser tab
// Respectă Code Contract: camelCase, error handling

import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
