'use client'

// lib/context/OrganizationProvider.tsx
// React Context pentru gestionarea organizațiilor user-ului
// Oferă: currentOrg, lista de org-uri, switchOrg(), loading state
// Persistență: localStorage (doar browser, cu checks)

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { Organization, Membership } from '@/lib/types'

interface OrganizationWithRole extends Organization {
  role?: 'consultant' | 'firma_admin' | 'angajat'
}

interface OrganizationContextType {
  currentOrg: OrganizationWithRole | null
  organizations: OrganizationWithRole[]
  switchOrg: (orgId: string) => void
  loading: boolean
  refetch: () => Promise<void>
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

const STORAGE_KEY = 'ssm_selected_org_id'

interface OrganizationProviderProps {
  children: ReactNode
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const [organizations, setOrganizations] = useState<OrganizationWithRole[]>([])
  const [currentOrg, setCurrentOrg] = useState<OrganizationWithRole | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch organizations pentru user curent
  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      const supabase = createSupabaseBrowser()

      // Verifică auth
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error('[OrganizationProvider] Auth error:', authError?.message)
        setOrganizations([])
        setCurrentOrg(null)
        return
      }

      // Fetch memberships + organizations
      const { data: memberships, error: memError } = await supabase
        .from('memberships')
        .select(`
          role,
          organization_id,
          organizations (
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
        .order('created_at', { ascending: false })

      if (memError) {
        console.error('[OrganizationProvider] Memberships error:', memError.message)
        setOrganizations([])
        setCurrentOrg(null)
        return
      }

      // Map organizations cu rolul din membership
      const orgsWithRole: OrganizationWithRole[] = (memberships || [])
        .map((m: any) => {
          if (!m.organizations) return null
          return {
            ...m.organizations,
            role: m.role as 'consultant' | 'firma_admin' | 'angajat'
          }
        })
        .filter(Boolean) as OrganizationWithRole[]

      setOrganizations(orgsWithRole)

      // Determină org curentă: localStorage > prima din listă > null
      let selectedOrgId: string | null = null

      // Încearcă să citești din localStorage (doar în browser)
      if (typeof window !== 'undefined') {
        try {
          selectedOrgId = localStorage.getItem(STORAGE_KEY)
        } catch (err) {
          console.warn('[OrganizationProvider] localStorage read error:', err)
        }
      }

      // Validează că org-ul salvat încă există în listă
      let selectedOrg = orgsWithRole.find(o => o.id === selectedOrgId)

      // Fallback: prima organizație din listă
      if (!selectedOrg && orgsWithRole.length > 0) {
        selectedOrg = orgsWithRole[0]
      }

      setCurrentOrg(selectedOrg || null)

      // Salvează în localStorage
      if (selectedOrg && typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, selectedOrg.id)
        } catch (err) {
          console.warn('[OrganizationProvider] localStorage write error:', err)
        }
      }

    } catch (error) {
      console.error('[OrganizationProvider] Unexpected error:', error)
      setOrganizations([])
      setCurrentOrg(null)
    } finally {
      setLoading(false)
    }
  }

  // Fetch la mount
  useEffect(() => {
    fetchOrganizations()
  }, [])

  // Switch organizație curentă
  const switchOrg = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId)
    if (!org) {
      console.warn('[OrganizationProvider] Organization not found:', orgId)
      return
    }

    setCurrentOrg(org)

    // Salvează în localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, orgId)
      } catch (err) {
        console.warn('[OrganizationProvider] localStorage write error:', err)
      }
    }
  }

  const value: OrganizationContextType = {
    currentOrg,
    organizations,
    switchOrg,
    loading,
    refetch: fetchOrganizations
  }

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  )
}

// Hook pentru a consuma context-ul
export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider')
  }
  return context
}
