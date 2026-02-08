// middleware.ts (în RĂDĂCINA proiectului, NU în app/)
// Redirect la /login dacă userul nu e autentificat
// Protejează /dashboard și toate sub-rutele
// RBAC: Verificare dinamică roluri din user_roles cu fallback pe memberships

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'

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
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Dacă nu e autentificat și încearcă pagină protejată → /login
  const protectedPaths = ['/dashboard', '/onboarding', '/admin', '/consultant', '/firma', '/angajat', '/inspector']
  const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // RBAC: Verificare roluri pentru rute protejate
  if (user && isProtected) {
    const userRoles = await getRolesFromSupabase(supabase, user.id)
    const pathname = request.nextUrl.pathname

    // Definire roluri necesare per rută
    let requiredRoles: string[] = []
    let needsRoleCheck = true

    if (pathname.startsWith('/admin')) {
      requiredRoles = ['super_admin']
    } else if (pathname.startsWith('/consultant')) {
      requiredRoles = [
        'consultant_ssm', 'super_admin',
        'zbut_consultant_bg', 'munkavedelmi_hu',
        'sicherheitsingenieur_de', 'specjalista_bhp_pl'
      ]
    } else if (pathname.startsWith('/firma')) {
      requiredRoles = [
        'firma_admin', 'super_admin',
        'lucrator_desemnat', 'responsabil_ssm_intern'
      ]
    } else if (pathname.startsWith('/inspector')) {
      requiredRoles = [
        'inspector_itm', 'inspector_igsu', 'inspector_anspdcp', 'super_admin',
        'inspector_git_bg', 'inspector_ommf_hu', 'berufsgenossenschaft_de', 'inspector_pip_pl'
      ]
    } else if (pathname.startsWith('/angajat')) {
      requiredRoles = ['angajat', 'super_admin', 'firma_admin', 'consultant_ssm']
    } else if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding')) {
      // Dashboard și onboarding: orice user autentificat
      needsRoleCheck = false
    }

    // Verifică dacă userul are rolul necesar
    if (needsRoleCheck && requiredRoles.length > 0) {
      if (!hasAnyRole(userRoles, requiredRoles)) {
        const url = request.nextUrl.clone()
        url.pathname = '/unauthorized'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/admin/:path*',
    '/consultant/:path*',
    '/firma/:path*',
    '/angajat/:path*',
    '/inspector/:path*'
  ],
}
