// S-S-M.RO — AUTH CALLBACK HANDLER
// Supabase auth callback: exchange code for session
// Create user profile if first login, assign default role
// Data: 14 Februarie 2026

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

/**
 * GET /api/auth/callback
 *
 * Callback URL pentru Supabase Auth (email confirmation, magic links, OAuth)
 *
 * Flow:
 * 1. Extrage code din query string
 * 2. Exchange code pentru session
 * 3. Verifică dacă există profil user (profiles table)
 * 4. Dacă nu există → creează profil + user_roles cu rol default 'angajat'
 * 5. Redirect la /dashboard sau returnUrl din query
 *
 * Error handling:
 * - Missing code → redirect la /login cu error
 * - Invalid code → redirect la /login cu error
 * - DB errors → logare + redirect cu mesaj generic
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const returnUrl = requestUrl.searchParams.get('returnUrl') || '/dashboard'

  // Validare: code este obligatoriu
  if (!code) {
    console.error('[Auth Callback] Missing code parameter')
    return NextResponse.redirect(
      new URL('/login?error=missing_code&message=Link invalid sau expirat', requestUrl.origin)
    )
  }

  try {
    const supabase = await createSupabaseServer()

    // Exchange code pentru session
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('[Auth Callback] Code exchange failed:', exchangeError)
      return NextResponse.redirect(
        new URL(
          `/login?error=auth_failed&message=${encodeURIComponent('Autentificare eșuată. Te rugăm să încerci din nou.')}`,
          requestUrl.origin
        )
      )
    }

    if (!data.user) {
      console.error('[Auth Callback] No user in session after exchange')
      return NextResponse.redirect(
        new URL('/login?error=no_user&message=Nu s-a putut crea sesiunea', requestUrl.origin)
      )
    }

    const userId = data.user.id
    const userEmail = data.user.email || 'Unknown'

    // Verifică dacă există profil
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (expected pentru user nou)
      console.error('[Auth Callback] Profile check error:', profileCheckError)
      // Nu blocăm autentificarea pentru erori de citire
    }

    // Dacă nu există profil → creează profil
    if (!existingProfile) {
      console.log(`[Auth Callback] Creating profile for new user: ${userId}`)

      // Extrage nume din email (fallback)
      const emailName = userEmail.split('@')[0]
      const fullName = data.user.user_metadata?.full_name || emailName || 'Utilizator'

      const { error: profileInsertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: fullName,
          phone: data.user.user_metadata?.phone || null,
          avatar_url: data.user.user_metadata?.avatar_url || null,
        })

      if (profileInsertError) {
        console.error('[Auth Callback] Profile creation failed:', profileInsertError)
        // Nu blocăm — profilul poate fi creat de trigger sau ulterior
      } else {
        console.log(`[Auth Callback] Profile created successfully for: ${userId}`)
      }

      // Verifică dacă există deja rol în user_roles
      const { data: existingRole, error: roleCheckError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (roleCheckError && roleCheckError.code !== 'PGRST116') {
        console.error('[Auth Callback] Role check error:', roleCheckError)
      }

      // Dacă nu există rol → assign default role 'angajat'
      if (!existingRole) {
        console.log(`[Auth Callback] Assigning default role 'angajat' to user: ${userId}`)

        // Găsește role_id pentru 'angajat'
        const { data: angajatRole, error: roleQueryError } = await supabase
          .from('roles')
          .select('id')
          .eq('role_key', 'angajat')
          .eq('is_active', true)
          .single()

        if (roleQueryError || !angajatRole) {
          console.error('[Auth Callback] Could not find angajat role:', roleQueryError)
          // Fallback: nu blocăm autentificarea, dar logăm warning
          console.warn('[Auth Callback] User authenticated without default role assignment')
        } else {
          // Assign rol
          const { error: roleAssignError } = await supabase
            .from('user_roles')
            .insert({
              user_id: userId,
              role_id: angajatRole.id,
              company_id: null,
              location_id: null,
              is_active: true,
            })

          if (roleAssignError) {
            console.error('[Auth Callback] Role assignment failed:', roleAssignError)
            // Nu blocăm — rolul poate fi atribuit manual mai târziu
          } else {
            console.log(`[Auth Callback] Default role assigned successfully to: ${userId}`)
          }
        }
      }
    } else {
      console.log(`[Auth Callback] Existing user authenticated: ${userId}`)
    }

    // Redirect la dashboard sau returnUrl
    const redirectUrl = new URL(returnUrl, requestUrl.origin)
    console.log(`[Auth Callback] Redirecting to: ${redirectUrl.toString()}`)

    return NextResponse.redirect(redirectUrl)

  } catch (error) {
    console.error('[Auth Callback] Unexpected error:', error)
    return NextResponse.redirect(
      new URL(
        `/login?error=internal_error&message=${encodeURIComponent('Eroare internă. Te rugăm să încerci din nou.')}`,
        requestUrl.origin
      )
    )
  }
}
