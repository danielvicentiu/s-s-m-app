// middleware.ts
// 1) next-intl: detectează/redirectează locale (ro, bg, hu, de, pl)
// 2) Supabase Auth: redirect la /login dacă userul nu e autentificat
// 3) RBAC: Verificare dinamică roluri din user_roles cu fallback pe memberships
// 4) Domain-based locale detection: DOMAIN_CONFIG pentru viitor

import createMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { routing } from './i18n/routing'

// DOMAIN_CONFIG: Mapare domenii viitoare → locale
// Când se cumpără domeniile, middleware-ul va detecta automat limba bazată pe domeniu
const DOMAIN_CONFIG: Record<string, string> = {
  'bzr24.bg': 'bg',      // Bulgaria - ZBUT (Zakon za Bezopasnost i Usloviya na Trud)
  'sst24.hu': 'hu',      // Hungary - Munkavédelem
  'as-dig.de': 'de',     // Germany - Arbeitssicherheit
  'bhp24.pl': 'pl',      // Poland - BHP (Bezpieczeństwo i Higiena Pracy)
  's-s-m.ro': 'ro',      // Romania - SSM (Securitate și Sănătate în Muncă)
}

const intlMiddleware = createMiddleware(routing)

// RBAC: Helper pentru obținerea rolurilor userului din user_roles cu fallback pe memberships
async function getRolesFromSupabase(supabase: SupabaseClient, userId: string): Promise<string[]> {
  // 1. Încearcă să obții roluri din user_roles
  const { data: userRoles, error } = await supabase
    .from('user_roles')
    .select(`
      role_id,
      expires_at,
      is_active,
      roles!inner (
        role_key,
        is_active
      )
    `)
    .eq('user_id', userId)
    .eq('is_active', true)
    .eq('roles.is_active', true)

  if (!error && userRoles && userRoles.length > 0) {
    // Filtrează rolurile expirate
    const activeRoles = userRoles.filter(ur => {
      if (!ur.expires_at) return true
      return new Date(ur.expires_at) > new Date()
    })

    if (activeRoles.length > 0) {
      return activeRoles.map(ur => (ur.roles as any).role_key)
    }
  }

  // 2. FALLBACK: Dacă user_roles returnează gol, citește din memberships
  const { data: memberships } = await supabase
    .from('memberships')
    .select('role')
    .eq('user_id', userId)
    .eq('is_active', true)

  if (memberships && memberships.length > 0) {
    // Mapare roluri vechi → noi
    return memberships.map(m => {
      switch (m.role) {
        case 'consultant': return 'consultant_ssm'
        case 'firma_admin': return 'firma_admin'
        case 'angajat': return 'angajat'
        default: return m.role
      }
    })
  }

  return []
}

// RBAC: Verificare dacă user are unul din rolurile necesare
function hasAnyRole(userRoles: string[], requiredRoles: string[]): boolean {
  return requiredRoles.some(role => userRoles.includes(role))
}

export async function middleware(request: NextRequest) {
  // Skip API routes — they don't need locale or auth redirect
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Step 1: Run next-intl middleware (handles locale detection + redirect)
  const intlResponse = intlMiddleware(request)

  // Step 2: Extract locale from the URL (first segment after /)
  // Also detect from domain if configured
  const pathname = request.nextUrl.pathname
  const hostname = request.headers.get('host') || ''
  const domainLocale = DOMAIN_CONFIG[hostname]

  const localeMatch = pathname.match(/^\/(ro|bg|hu|de|pl)\//)
  const locale = localeMatch ? localeMatch[1] : (domainLocale || routing.defaultLocale)

  // Strip locale prefix for path matching
  const pathWithoutLocale = localeMatch
    ? pathname.replace(/^\/(ro|bg|hu|de|pl)/, '')
    : pathname

  // Set x-country-code header for downstream API routes and components
  const countryCodeMap: Record<string, string> = {
    'ro': 'RO',
    'bg': 'BG',
    'hu': 'HU',
    'de': 'DE',
    'pl': 'PL',
  }
  const countryCode = countryCodeMap[locale] || 'RO'

  // Protected paths that need auth + optional RBAC
  const protectedSegments = ['/dashboard', '/onboarding', '/admin', '/consultant', '/firma', '/angajat', '/inspector']
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

    // Dacă nu e autentificat → redirect la /login
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/login`
      return NextResponse.redirect(url)
    }

    // RBAC: Verificare roluri pentru rute protejate
    const userRoles = await getRolesFromSupabase(supabase, user.id)

    let requiredRoles: string[] = []
    let needsRoleCheck = true

    if (pathWithoutLocale.startsWith('/admin')) {
      requiredRoles = ['super_admin']
    } else if (pathWithoutLocale.startsWith('/consultant')) {
      requiredRoles = [
        'consultant_ssm', 'super_admin',
        'zbut_consultant_bg', 'munkavedelmi_hu',
        'sicherheitsingenieur_de', 'specjalista_bhp_pl'
      ]
    } else if (pathWithoutLocale.startsWith('/firma')) {
      requiredRoles = [
        'firma_admin', 'super_admin',
        'lucrator_desemnat', 'responsabil_ssm_intern'
      ]
    } else if (pathWithoutLocale.startsWith('/inspector')) {
      requiredRoles = [
        'inspector_itm', 'inspector_igsu', 'inspector_anspdcp', 'super_admin',
        'inspector_git_bg', 'inspector_ommf_hu', 'berufsgenossenschaft_de', 'inspector_pip_pl'
      ]
    } else if (pathWithoutLocale.startsWith('/angajat')) {
      requiredRoles = ['angajat', 'super_admin', 'firma_admin', 'consultant_ssm']
    } else if (pathWithoutLocale.startsWith('/dashboard') || pathWithoutLocale.startsWith('/onboarding')) {
      // Dashboard și onboarding: orice user autentificat
      needsRoleCheck = false
    }

    // Verifică dacă userul are rolul necesar
    if (needsRoleCheck && requiredRoles.length > 0) {
      if (!hasAnyRole(userRoles, requiredRoles)) {
        const url = request.nextUrl.clone()
        url.pathname = `/${locale}/unauthorized`
        return NextResponse.redirect(url)
      }
    }
  }

  // Add x-country-code header to response
  const response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  })
  response.headers.set('x-country-code', countryCode)

  // Copy intlResponse cookies and headers to our response
  intlResponse.cookies.getAll().forEach(cookie => {
    response.cookies.set(cookie.name, cookie.value, cookie)
  })
  intlResponse.headers.forEach((value, key) => {
    if (!response.headers.has(key)) {
      response.headers.set(key, value)
    }
  })

  return response
}

export const config = {
  matcher: [
    // Match all pathnames except: _next, api, static files
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
