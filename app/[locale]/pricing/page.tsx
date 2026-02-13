import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import PricingClient from './PricingClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.pricing' })

  const title = t('title')
  const description = t('description')
  const siteUrl = 'https://app.s-s-m.ro'
  const canonicalUrl = `${siteUrl}/${locale}/pricing`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'ro': `${siteUrl}/ro/pricing`,
        'en': `${siteUrl}/en/pricing`,
        'bg': `${siteUrl}/bg/pricing`,
        'de': `${siteUrl}/de/pricing`,
        'hu': `${siteUrl}/hu/pricing`,
        'pl': `${siteUrl}/pl/pricing`,
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

export default function PricingPage() {
  return <PricingClient />
}
