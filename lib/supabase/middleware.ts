// lib/supabase/middleware.ts
// Middleware helper pentru Next.js - gestionează sesiunile Supabase
// Trebuie folosit în middleware.ts root pentru a actualiza token-urile auth
// Respectă Code Contract: camelCase, error handling, TypeScript strict

import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import type { Database } from './clients'

/**
 * Update Supabase session în middleware
 * Actualizează automat token-urile auth și setează cookies
 * Trebuie apelat în middleware.ts pentru fiecare request
 *
 * @param request - Next.js request object
 * @returns NextResponse cu cookies actualizate
 *
 * @example
 * ```ts
 * // în middleware.ts
 * import { updateSession } from '@/lib/supabase/middleware'
 *
 * export async function middleware(request: NextRequest) {
 *   return await updateSession(request)
 * }
 * ```
 */
export async function updateSession(request: NextRequest) {
  // Creează response object care va fi modificat cu cookies noi
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Creează Supabase client pentru middleware
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Setează cookies în request pentru server components
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )

          // Actualizează response pentru a trimite cookies înapoi la browser
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Apelează getUser() pentru a triggui refresh de token dacă e necesar
  // Nu folosi getSession() sau getUser() din server-side code în alte locuri
  // Pentru auth checks, folosește întotdeauna getUser() în server components/actions
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // Optional: redirectează user-ii neautentificați de pe rute protejate
  // Poți customiza logica de protecție aici
  if (error || !user) {
    // User nu este autentificat
    // Poți adăuga redirect logic aici dacă vrei să protejezi anumite rute
    // Exemplu:
    // if (request.nextUrl.pathname.startsWith('/dashboard')) {
    //   return NextResponse.redirect(new URL('/login', request.url))
    // }
  }

  return response
}

/**
 * Matcher configuration pentru middleware
 * Include toate rutele care necesită session management
 * Exclude fișiere statice și API routes care nu necesită auth
 *
 * @example
 * ```ts
 * // în middleware.ts
 * export const config = {
 *   matcher: MIDDLEWARE_MATCHER
 * }
 * ```
 */
export const MIDDLEWARE_MATCHER = [
  /*
   * Match toate rutele EXCEPT:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - public folder
   */
  '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
]
