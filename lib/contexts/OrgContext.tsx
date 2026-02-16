// lib/contexts/OrgContext.tsx
// Organization Context — Manages current organization selection for multi-client consultants
// Provides: currentOrg, setCurrentOrg, allOrgs, isAllView
// Used across all dashboard pages for consistent filtering

'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'

export interface OrgOption {
  id: string
  name: string
  cui: string | null
  employee_count?: number
  logo_url?: string | null
  data_completeness?: number
  cooperation_status?: string
}

interface OrgContextValue {
  currentOrg: string // 'all' or org UUID
  setCurrentOrg: (orgId: string) => void
  allOrgs: OrgOption[]
  isAllView: boolean
  selectedOrgData: OrgOption | null
  isLoading: boolean
}

const OrgContext = createContext<OrgContextValue | undefined>(undefined)

interface OrgProviderProps {
  children: ReactNode
  initialOrgs: OrgOption[]
  initialSelectedOrg?: string
  userId: string
}

export function OrgProvider({
  children,
  initialOrgs,
  initialSelectedOrg = 'all',
  userId
}: OrgProviderProps) {
  const [currentOrg, setCurrentOrgState] = useState<string>(initialSelectedOrg)
  const [allOrgs, setAllOrgs] = useState<OrgOption[]>(initialOrgs)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Compute derived values
  const isAllView = currentOrg === 'all'
  const selectedOrgData = isAllView ? null : allOrgs.find(o => o.id === currentOrg) || null

  // Persist selection to DB and URL
  const setCurrentOrg = async (orgId: string) => {
    setCurrentOrgState(orgId)

    // Save preference to Supabase
    const supabase = createSupabaseBrowser()
    await supabase.from('user_preferences').upsert(
      {
        user_id: userId,
        key: 'selected_org',
        value: JSON.stringify(orgId),
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id,key' }
    )

    // Update URL (remove param for 'all', add param for specific org)
    const newUrl = orgId === 'all'
      ? pathname
      : `${pathname}?org=${orgId}`

    router.push(newUrl, { scroll: false })
  }

  // Sync with URL changes (browser back/forward)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const orgParam = params.get('org')

    if (orgParam && orgParam !== currentOrg) {
      if (orgParam === 'all' || allOrgs.some(o => o.id === orgParam)) {
        setCurrentOrgState(orgParam)
      }
    }
  }, [pathname])

  return (
    <OrgContext.Provider
      value={{
        currentOrg,
        setCurrentOrg,
        allOrgs,
        isAllView,
        selectedOrgData,
        isLoading,
      }}
    >
      {children}
    </OrgContext.Provider>
  )
}

// Hook to use the organization context
export function useOrg() {
  const context = useContext(OrgContext)
  if (context === undefined) {
    throw new Error('useOrg must be used within an OrgProvider')
  }
  return context
}
