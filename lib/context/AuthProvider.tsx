// lib/context/AuthProvider.tsx
// React Context pentru autentificare Supabase
// Gestionează starea auth globală: user, session, loading
// Listener onAuthStateChange pentru sincronizare automată
// Respectă Code Contract: camelCase, TypeScript strict, 'use client'

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createSupabaseBrowser()

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('[AuthProvider] Error getting session:', error.message)
          setSession(null)
          setUser(null)
        } else {
          setSession(currentSession)
          setUser(currentSession?.user ?? null)
        }
      } catch (err) {
        console.error('[AuthProvider] Unexpected error during initialization:', err)
        setSession(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('[AuthProvider] Auth state changed:', event)

      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      setLoading(false)

      // Redirect logic
      if (event === 'SIGNED_IN') {
        // Extract locale from pathname (e.g., /ro/login -> ro)
        const locale = pathname?.split('/')[1] || 'ro'
        router.push(`/${locale}/dashboard`)
      } else if (event === 'SIGNED_OUT') {
        const locale = pathname?.split('/')[1] || 'ro'
        router.push(`/${locale}/login`)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, pathname])

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = createSupabaseBrowser()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (err) {
      console.error('[AuthProvider] Sign in error:', err)
      return { error: err as Error }
    }
  }

  const signOut = async () => {
    try {
      const supabase = createSupabaseBrowser()
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('[AuthProvider] Sign out error:', error.message)
        throw error
      }
    } catch (err) {
      console.error('[AuthProvider] Sign out error:', err)
      throw err
    }
  }

  const isAuthenticated = !!user && !!session

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAuthenticated,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook pentru a consuma contextul
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
