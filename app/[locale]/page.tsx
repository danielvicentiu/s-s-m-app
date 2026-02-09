// app/[locale]/page.tsx
// Landing page DINAMIC per țară
// Citește obligation_types din DB pentru penalties calculator

import { createClient } from '@supabase/supabase-js'
import { getCountryFromLocale } from '@/lib/country-utils'
import LandingClient from './LandingClient'
import type { ObligationType } from '@/lib/types'

interface PageProps {
  params: Promise<{ locale: string }>
}

// Create Supabase client for server-side data fetching
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export default async function LandingPage({ params }: PageProps) {
  const { locale } = await params
  const countryCode = getCountryFromLocale(locale)
  const supabase = getSupabase()

  // Fetch obligation_types pentru țara curentă (pentru penalties calculator)
  const { data: obligations } = await supabase
    .from('obligation_types')
    .select('*')
    .eq('country_code', countryCode)
    .eq('is_active', true)
    .not('penalty_min', 'is', null)
    .not('penalty_max', 'is', null)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  return <LandingClient obligations={(obligations as ObligationType[]) || []} />
}
