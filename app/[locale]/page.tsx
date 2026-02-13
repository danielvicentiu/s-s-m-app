// app/[locale]/page.tsx
// Landing page DINAMIC per țară
// Citește obligation_types din DB pentru penalties calculator

import { createClient } from '@supabase/supabase-js'
import { getCountryFromLocale } from '@/lib/country-utils'
import LandingClient from './LandingClient'
import type { ObligationType } from '@/lib/types'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.landing' })

  const title = t('title')
  const description = t('description')
  const siteUrl = 'https://app.s-s-m.ro'
  const canonicalUrl = `${siteUrl}/${locale}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'ro': `${siteUrl}/ro`,
        'en': `${siteUrl}/en`,
        'bg': `${siteUrl}/bg`,
        'de': `${siteUrl}/de`,
        'hu': `${siteUrl}/hu`,
        'pl': `${siteUrl}/pl`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 's-s-m.ro',
      locale,
      type: 'website',
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
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
