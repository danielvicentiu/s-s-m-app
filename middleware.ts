// middleware.ts
// 1) next-intl: detectează/redirectează locale (ro, bg, en, hu, de)
// 2) Supabase Auth: redirect la /login dacă userul nu e autentificat

import createMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  // Skip API routes — they don't need locale or auth redirect
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Step 1: Run next-intl middleware (handles locale detection + redirect)
  const intlResponse = intlMiddleware(request)

  // Step 2: Supabase Auth check for protected paths
  // Extract locale from the URL (first segment after /)
  const pathname = request.nextUrl.pathname
  const localeMatch = pathname.match(/^\/(ro|bg|en|hu|de)\//)
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale

  const protectedSegments = ['/dashboard', '/onboarding']
  const pathWithoutLocale = localeMatch
    ? pathname.replace(/^\/(ro|bg|en|hu|de)/, '')
    : pathname
  const isProtected = protectedSegments.some(segment =>
    pathWithoutLocale.startsWith(segment)
  )

  if (isProtected) {
    // Create a Supabase client to check auth
    let supabaseResponse = intlResponse

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            // Copy cookies to the intl response
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/login`
      return NextResponse.redirect(url)
    }
  }

  return intlResponse
}

export const config = {
  matcher: [
    // Match all pathnames except: _next, api, static files
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
