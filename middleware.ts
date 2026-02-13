// middleware.ts
// 1) next-intl: detectează/redirectează locale (ro, bg, hu, de, pl, en)
// 2) Supabase Auth: redirect la /login dacă userul nu e autentificat
// 3) RBAC: Verificare dinamică roluri din user_roles cu fallback pe memberships
// 4) Domain-based locale detection: DOMAIN_CONFIG pentru viitor

import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// DOMAIN_CONFIG: Mapare domenii viitoare → locale
const DOMAIN_CONFIG: Record<string, string> = {
  'bzr24.bg': 'bg',
  'sst24.hu': 'hu',
  'as-dig.de': 'de',
  'bhp24.pl': 'pl',
  's-s-m.ro': 'ro',
}

const intlMiddleware = createMiddleware(routing)

// RBAC: Helper pentru obținerea rolurilor userului din user_roles cu fallback pe memberships
async function getRolesFromSupabase(supabase: SupabaseClient, userId: string): Promise<string[]> {
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
    const activeRoles = userRoles.filter(ur => {
      if (!ur.expires_at) {return true}
      return new Date(ur.expires_at) > new Date()
    })

    if (activeRoles.length > 0) {
      return activeRoles.map(ur => (ur.roles as any).role_key)
    }
  }

  // FALLBACK: memberships
  const { data: memberships } = await supabase
    .from('memberships')
    .select('role')
    .eq('user_id', userId)
    .eq('is_active', true)

  if (memberships && memberships.length > 0) {
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

function hasAnyRole(userRoles: string[], requiredRoles: string[]): boolean {
  return requiredRoles.some(role => userRoles.includes(role))
}

export async function middleware(request: NextRequest) {
  // Skip API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Run next-intl middleware FIRST — this handles locale detection and sets headers
  const intlResponse = intlMiddleware(request)

  const pathname = request.nextUrl.pathname
  const hostname = request.headers.get('host') || ''
  const domainLocale = DOMAIN_CONFIG[hostname]

  // Extract locale from path
  const localeMatch = pathname.match(/^\/(ro|bg|hu|de|pl|en)(\/|$)/)
  const locale = localeMatch ? localeMatch[1] : (domainLocale || routing.defaultLocale)

  const pathWithoutLocale = localeMatch
    ? pathname.replace(/^\/(ro|bg|hu|de|pl|en)/, '')
    : pathname

  // Country code for x-country-code header
  const countryCodeMap: Record<string, string> = {
    'ro': 'RO',
    'bg': 'BG',
    'hu': 'HU',
    'de': 'DE',
    'pl': 'PL',
    'en': 'GB',
  }
  const countryCode = countryCodeMap[locale] || 'RO'

  // Check if route is protected
  const protectedSegments = ['/dashboard', '/onboarding', '/admin', '/consultant', '/firma', '/angajat', '/inspector']
  const isProtected = protectedSegments.some(segment =>
    pathWithoutLocale.startsWith(segment)
  )

  // For NON-protected routes: return intlResponse directly (preserves locale)
  if (!isProtected) {
    intlResponse.headers.set('x-country-code', countryCode)
    return intlResponse
  }

  // For PROTECTED routes: add auth + RBAC checks
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
          cookiesToSet.forEach(({ name, value, options }) =>
            intlResponse.cookies.set(name, value, options)
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

  const userRoles = await getRolesFromSupabase(supabase, user.id)

  let requiredRoles: string[] = []
  let needsRoleCheck = true

  if (pathWithoutLocale.startsWith('/admin')) {
    requiredRoles = ['super_admin', 'consultant_ssm']
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
    needsRoleCheck = false
  }

  if (needsRoleCheck && requiredRoles.length > 0) {
    if (!hasAnyRole(userRoles, requiredRoles)) {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/unauthorized`
      return NextResponse.redirect(url)
    }
  }

  // Return intlResponse with added headers (preserves locale set by next-intl)
  intlResponse.headers.set('x-country-code', countryCode)
  return intlResponse
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
