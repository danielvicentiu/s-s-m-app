// hooks/useSubscription.ts
// Hook client-side pentru statusul abonamentului cu realtime updates

'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'

export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled' | 'expired' | null

interface SubscriptionData {
  status: SubscriptionStatus
  planType: string | null
  trialEndsAt: string | null
  currentPeriodEnd: string | null
  loading: boolean
  isActive: boolean
}

export function useSubscription(organizationId?: string | null): SubscriptionData {
  const [status, setStatus] = useState<SubscriptionStatus>(null)
  const [planType, setPlanType] = useState<string | null>(null)
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null)
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!organizationId) {
      setLoading(false)
      return
    }

    const supabase = createSupabaseBrowser()

    const fetchSubscription = async () => {
      const { data } = await supabase
        .from('subscriptions')
        .select('status, plan_type, current_period_end, trial_ends_at')
        .eq('organization_id', organizationId)
        .single()

      setStatus((data?.status as SubscriptionStatus) ?? null)
      setPlanType(data?.plan_type ?? null)
      setTrialEndsAt(data?.trial_ends_at ?? null)
      setCurrentPeriodEnd(data?.current_period_end ?? null)
      setLoading(false)
    }

    fetchSubscription()

    // Realtime updates pe schimbări abonament
    const channel = supabase
      .channel(`sub-${organizationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `organization_id=eq.${organizationId}`,
        },
        () => fetchSubscription()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [organizationId])

  const isActive = status === 'active' || status === 'trial'

  return { status, planType, trialEndsAt, currentPeriodEnd, loading, isActive }
}
