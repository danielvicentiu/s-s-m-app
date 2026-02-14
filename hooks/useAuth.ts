// hooks/useAuth.ts
// React hook pentru autentificare Supabase cu session management
// onAuthStateChange listener + persist session + auto redirect on expiry
// Return: {user, session, isLoading, isAuthenticated, role, orgId, login, logout, signUp}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { useRouter } from '@/i18n/navigation'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  role: string | null
  orgId: string | null
}

interface UseAuthReturn extends AuthState {
  login: (email: string, password: string) => Promise<{ error: Error | null }>
  logout: () => Promise<void>
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: Error | null }>
}

export default function useAuth(): UseAuthReturn {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    role: null,
    orgId: null,
  })

  // Fetch role și orgId din memberships (cu fallback la user_roles)
  const fetchRoleAndOrg = useCallback(async (userId: string) => {
    try {
      const supabase = createSupabaseBrowser()

      // 1. Încearcă user_roles (RBAC dinamic)
      const { data: userRoles, error: userRolesError } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          company_id,
          is_active,
          roles!inner (
            role_key,
            is_active
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .eq('roles.is_active', true)
        .limit(1)
        .single()

      if (!userRolesError && userRoles) {
        return {
          role: (userRoles.roles as any).role_key,
          orgId: userRoles.company_id,
        }
      }

      // 2. FALLBACK: memberships (sistem vechi)
      const { data: membership, error: membershipError } = await supabase
        .from('memberships')
        .select('role, organization_id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .limit(1)
        .single()

      if (!membershipError && membership) {
        // Mapare rol vechi → RBAC
        const roleMap: Record<string, string> = {
          'consultant': 'consultant_ssm',
          'firma_admin': 'firma_admin',
          'angajat': 'angajat',
        }

        return {
          role: roleMap[membership.role] || membership.role,
          orgId: membership.organization_id,
        }
      }

      return { role: null, orgId: null }
    } catch (err) {
      console.error('[useAuth] Error fetching role/org:', err)
      return { role: null, orgId: null }
    }
  }, [])

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      const supabase = createSupabaseBrowser()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('[useAuth] Login error:', error)
        return { error: new Error(error.message) }
      }

      // State va fi actualizat automat de onAuthStateChange
      return { error: null }
    } catch (err) {
      console.error('[useAuth] Login exception:', err)
      return { error: err instanceof Error ? err : new Error('Login failed') }
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    try {
      const supabase = createSupabaseBrowser()
      await supabase.auth.signOut()

      // State va fi actualizat automat de onAuthStateChange
      // Redirect la login
      router.push('/login')
    } catch (err) {
      console.error('[useAuth] Logout error:', err)
    }
  }, [router])

  // SignUp function
  const signUp = useCallback(async (
    email: string,
    password: string,
    metadata?: Record<string, any>
  ) => {
    try {
      const supabase = createSupabaseBrowser()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) {
        console.error('[useAuth] SignUp error:', error)
        return { error: new Error(error.message) }
      }

      // State va fi actualizat automat de onAuthStateChange
      return { error: null }
    } catch (err) {
      console.error('[useAuth] SignUp exception:', err)
      return { error: err instanceof Error ? err : new Error('SignUp failed') }
    }
  }, [])

  // Setup Supabase auth listener + session persistence
  useEffect(() => {
    const supabase = createSupabaseBrowser()
    let mounted = true

    // Funcție pentru actualizare state
    const updateAuthState = async (session: Session | null) => {
      if (!mounted) return

      if (!session || !session.user) {
        setState({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
          role: null,
          orgId: null,
        })
        return
      }

      // Fetch role și orgId
      const { role, orgId } = await fetchRoleAndOrg(session.user.id)

      setState({
        user: session.user,
        session,
        isLoading: false,
        isAuthenticated: true,
        role,
        orgId,
      })
    }

    // Initial session check
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('[useAuth] getSession error:', error)
      }
      updateAuthState(session)
    })

    // Setup listener pentru auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[useAuth] Auth event:', event)

        // Handle session expiry
        if (event === 'TOKEN_REFRESHED') {
          console.log('[useAuth] Token refreshed successfully')
          updateAuthState(session)
        } else if (event === 'SIGNED_OUT') {
          console.log('[useAuth] User signed out')
          updateAuthState(null)
          // Auto redirect to login
          router.push('/login')
        } else if (event === 'SIGNED_IN') {
          console.log('[useAuth] User signed in')
          updateAuthState(session)
        } else if (event === 'USER_UPDATED') {
          console.log('[useAuth] User updated')
          updateAuthState(session)
        } else {
          // Pentru alte evenimente (INITIAL_SESSION, PASSWORD_RECOVERY, etc.)
          updateAuthState(session)
        }
      }
    )

    // Cleanup
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router, fetchRoleAndOrg])

  return {
    ...state,
    login,
    logout,
    signUp,
  }
}
