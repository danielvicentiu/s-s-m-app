'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import type { Organization } from '@/lib/types'

export interface OrganizationSettings {
  timezone?: string
  dateFormat?: string
  language?: string
  notifications?: {
    email?: boolean
    sms?: boolean
    whatsapp?: boolean
    push?: boolean
  }
}

export interface OrganizationModules {
  medical?: boolean
  equipment?: boolean
  trainings?: boolean
  documents?: boolean
  alerts?: boolean
  reports?: boolean
}

export interface OrganizationPlan {
  name: 'free' | 'basic' | 'professional' | 'enterprise'
  maxEmployees?: number
  maxOrganizations?: number
  features?: string[]
}

export interface OrganizationWithDetails extends Organization {
  plan?: OrganizationPlan
  modules?: OrganizationModules
  settings?: OrganizationSettings
}

interface OrganizationContextValue {
  currentOrg: OrganizationWithDetails | null
  organizations: OrganizationWithDetails[]
  switchOrg: (orgId: string) => Promise<void>
  refreshOrganizations: () => Promise<void>
  isLoading: boolean
  error: string | null
  // Helper getters
  orgId: string | null
  orgName: string | null
  plan: OrganizationPlan | null
  modules: OrganizationModules | null
  settings: OrganizationSettings | null
}

const OrganizationContext = createContext<OrganizationContextValue | undefined>(undefined)

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [currentOrg, setCurrentOrg] = useState<OrganizationWithDetails | null>(null)
  const [organizations, setOrganizations] = useState<OrganizationWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createSupabaseBrowser()

  const fetchOrganizations = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error('Utilizator neautentificat')
      }

      // Get user's memberships with organization details
      const { data: memberships, error: membershipsError } = await supabase
        .from('memberships')
        .select(`
          organization_id,
          is_active,
          organizations:organization_id (
            id,
            name,
            cui,
            address,
            county,
            contact_email,
            contact_phone,
            data_completeness,
            employee_count,
            exposure_score,
            preferred_channels,
            cooperation_status,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (membershipsError) {
        throw membershipsError
      }

      // Transform data and add mock plan/modules/settings
      // TODO: Replace with actual data from database when tables are ready
      const orgsWithDetails: OrganizationWithDetails[] = (memberships || [])
        .filter(m => m.organizations)
        .map(m => {
          const org = Array.isArray(m.organizations) ? m.organizations[0] : m.organizations
          return {
            ...org,
            plan: {
              name: 'professional' as const,
              maxEmployees: 100,
              maxOrganizations: 5,
              features: ['medical', 'equipment', 'trainings', 'alerts']
            },
            modules: {
              medical: true,
              equipment: true,
              trainings: true,
              documents: true,
              alerts: true,
              reports: true
            },
            settings: {
              timezone: 'Europe/Bucharest',
              dateFormat: 'DD.MM.YYYY',
              language: 'ro',
              notifications: {
                email: true,
                sms: false,
                whatsapp: false,
                push: true
              }
            }
          }
        })

      setOrganizations(orgsWithDetails)

      // Set current org: try localStorage first, then first org
      if (typeof window !== 'undefined') {
        const savedOrgId = localStorage.getItem('currentOrgId')
        const savedOrg = orgsWithDetails.find(o => o.id === savedOrgId)

        if (savedOrg) {
          setCurrentOrg(savedOrg)
        } else if (orgsWithDetails.length > 0) {
          setCurrentOrg(orgsWithDetails[0])
          localStorage.setItem('currentOrgId', orgsWithDetails[0].id)
        }
      } else if (orgsWithDetails.length > 0) {
        setCurrentOrg(orgsWithDetails[0])
      }

    } catch (err) {
      console.error('Error fetching organizations:', err)
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea organizațiilor')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  const switchOrg = useCallback(async (orgId: string) => {
    const org = organizations.find(o => o.id === orgId)

    if (!org) {
      setError('Organizația nu a fost găsită')
      return
    }

    setCurrentOrg(org)

    if (typeof window !== 'undefined') {
      localStorage.setItem('currentOrgId', orgId)
    }
  }, [organizations])

  const refreshOrganizations = useCallback(async () => {
    await fetchOrganizations()
  }, [fetchOrganizations])

  // Initial load
  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        fetchOrganizations()
      } else if (event === 'SIGNED_OUT') {
        setCurrentOrg(null)
        setOrganizations([])
        if (typeof window !== 'undefined') {
          localStorage.removeItem('currentOrgId')
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchOrganizations])

  const value: OrganizationContextValue = {
    currentOrg,
    organizations,
    switchOrg,
    refreshOrganizations,
    isLoading,
    error,
    // Helper getters
    orgId: currentOrg?.id || null,
    orgName: currentOrg?.name || null,
    plan: currentOrg?.plan || null,
    modules: currentOrg?.modules || null,
    settings: currentOrg?.settings || null
  }

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganizationContext() {
  const context = useContext(OrganizationContext)

  if (context === undefined) {
    throw new Error('useOrganizationContext must be used within an OrganizationProvider')
  }

  return context
}
