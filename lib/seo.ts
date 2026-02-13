// S-S-M.RO — SEO UTILITY
// Generare Metadata Next.js pentru multilingv (RO, BG, HU, DE, PL, EN)
// Data: 13 Februarie 2026

import type { Metadata } from 'next'

// Limbile suportate - sync cu i18n/routing.ts
export type SupportedLocale = 'ro' | 'bg' | 'hu' | 'de' | 'pl' | 'en'

// URL-ul de bază al aplicației (production)
const BASE_URL = 'https://app.s-s-m.ro'

// Mapare locales la coduri de limbă
const LOCALE_TO_LANG: Record<SupportedLocale, string> = {
  ro: 'ro_RO',
  bg: 'bg_BG',
  hu: 'hu_HU',
  de: 'de_DE',
  pl: 'pl_PL',
  en: 'en_US',
}

// Configurare per pagină
export interface PageSeoConfig {
  // Titlu pagină (va fi completat cu " | s-s-m.ro" automat)
  title: string
  // Descriere scurtă (150-160 caractere recomandat)
  description: string
  // Cuvinte cheie relevante (opțional)
  keywords?: string[]
  // URL canonical relativ (ex: "/dashboard", "/pricing")
  canonicalPath: string
  // Image pentru OpenGraph/Twitter (opțional, URL absolut sau relativ)
  ogImage?: string
  // Tip OpenGraph (default: "website")
  ogType?: 'website' | 'article' | 'profile'
  // Autor (pentru articole)
  author?: string
  // Dacă pagina este noindex (default: false)
  noIndex?: boolean
}

/**
 * Generează Next.js Metadata object complet pentru SEO
 *
 * @param config - Configurare specifică paginii
 * @param locale - Limba curentă (ro, bg, hu, de, pl, en)
 * @returns Metadata object pentru export în layout/page
 *
 * @example
 * ```tsx
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   const { locale } = await params
 *   return generateMetadata({
 *     title: 'Dashboard SSM',
 *     description: 'Platformă digitală pentru conformitate SSM & PSI',
 *     canonicalPath: '/dashboard',
 *   }, locale)
 * }
 * ```
 */
export function generateMetadata(
  config: PageSeoConfig,
  locale: SupportedLocale
): Metadata {
  const {
    title,
    description,
    keywords,
    canonicalPath,
    ogImage,
    ogType = 'website',
    author,
    noIndex = false,
  } = config

  // Titlu complet cu branding
  const fullTitle = `${title} | s-s-m.ro`

  // URL canonical absolut
  const canonicalUrl = `${BASE_URL}/${locale}${canonicalPath}`

  // URL imagine OpenGraph (default: logo)
  const imageUrl = ogImage || `${BASE_URL}/og-image.png`

  // Alternate languages (toate limbile suportate minus curenta)
  const locales: SupportedLocale[] = ['ro', 'bg', 'hu', 'de', 'pl', 'en']
  const alternateLanguages: Record<string, string> = {}

  locales.forEach((loc) => {
    if (loc !== locale) {
      alternateLanguages[loc] = `${BASE_URL}/${loc}${canonicalPath}`
    }
  })

  // Construiește metadata object
  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords?.join(', '),
    authors: author ? [{ name: author }] : undefined,

    // Robots
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },

    // OpenGraph
    openGraph: {
      type: ogType,
      locale: LOCALE_TO_LANG[locale],
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName: 's-s-m.ro',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  }

  return metadata
}

/**
 * Configurări SEO predefinite pentru paginile principale
 * Extinde cu configurări custom per pagină după necesitate
 */
export const PAGE_SEO_CONFIGS: Record<string, Omit<PageSeoConfig, 'canonicalPath'>> = {
  // Landing page
  home: {
    title: 'Platformă SSM & PSI',
    description: 'Platformă digitală pentru conformitate SSM (securitate și sănătate în muncă) și PSI (prevenire și stingere incendii) pentru consultanți și firme din România, Bulgaria, Ungaria, Germania și Polonia.',
    keywords: ['SSM', 'PSI', 'securitate muncă', 'sănătate muncă', 'protecție muncă', 'conformitate', 'legislație SSM'],
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard SSM',
    description: 'Panou de control pentru gestionarea conformității SSM & PSI: controale medicale, echipamente, instruiri, alerte și rapoarte.',
    keywords: ['dashboard SSM', 'panou control', 'conformitate', 'rapoarte'],
    noIndex: true, // Pagină protejată
  },

  // Medical
  medical: {
    title: 'Controale Medicale',
    description: 'Gestionare fișe medicale de medicina muncii: examene periodice, angajare, reluare, supraveghere.',
    keywords: ['medicina muncii', 'controale medicale', 'examen medical', 'fișă medicală'],
    noIndex: true,
  },

  // Equipment
  equipment: {
    title: 'Echipamente PSI & SSM',
    description: 'Evidență echipamente de siguranță: stingătoare, trusă prim ajutor, hidranti, detectori, EIP, iluminat urgență.',
    keywords: ['echipamente PSI', 'stingătoare', 'EIP', 'prim ajutor', 'echipamente protecție'],
    noIndex: true,
  },

  // Training
  training: {
    title: 'Instruiri SSM & PSI',
    description: 'Evidență și planificare instruiri: instruire periodică, instruire la angajare, instruire PSI.',
    keywords: ['instruire SSM', 'instruire PSI', 'training', 'formare'],
    noIndex: true,
  },

  // Pricing
  pricing: {
    title: 'Prețuri & Planuri',
    description: 'Planuri de abonament pentru platformă SSM & PSI: Starter, Professional, Enterprise. Încercați gratuit 14 zile.',
    keywords: ['prețuri SSM', 'abonament SSM', 'tarife consultanță', 'planuri'],
  },

  // Login
  login: {
    title: 'Autentificare',
    description: 'Autentificare în platformă s-s-m.ro pentru consultanți SSM și administratori firme.',
    noIndex: true,
  },

  // Onboarding
  onboarding: {
    title: 'Configurare Inițială',
    description: 'Configurare inițială cont și organizație pe platformă s-s-m.ro.',
    noIndex: true,
  },

  // Admin - Roles
  adminRoles: {
    title: 'Administrare Roluri',
    description: 'Gestionare roluri și permisiuni utilizatori în organizație.',
    noIndex: true,
  },

  // Admin - Alert Categories
  adminAlertCategories: {
    title: 'Categorii Alerte',
    description: 'Configurare categorii alerte și notificări pentru conformitate SSM & PSI.',
    noIndex: true,
  },

  // Admin - Equipment Types
  adminEquipmentTypes: {
    title: 'Tipuri Echipamente',
    description: 'Configurare tipuri echipamente PSI & SSM specifice per țară.',
    noIndex: true,
  },

  // Admin - Obligations
  adminObligations: {
    title: 'Obligații Legale',
    description: 'Configurare obligații legale SSM & PSI specifice per țară.',
    noIndex: true,
  },

  // Documents Generator
  documentsGenerate: {
    title: 'Generator Documente',
    description: 'Generare automată documente SSM & PSI: fișe, rapoarte, certificate.',
    noIndex: true,
  },

  // Profile
  profile: {
    title: 'Profil Utilizator',
    description: 'Gestionare profil utilizator, avatar și preferințe.',
    noIndex: true,
  },
}

/**
 * Helper: Generare metadata rapidă folosind configurare predefinită
 *
 * @param pageKey - Cheia paginii din PAGE_SEO_CONFIGS
 * @param canonicalPath - URL canonical relativ
 * @param locale - Limba curentă
 * @param overrides - Configurări custom care suprascriu default-urile
 * @returns Metadata object
 *
 * @example
 * ```tsx
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   const { locale } = await params
 *   return getPageMetadata('dashboard', '/dashboard', locale)
 * }
 * ```
 */
export function getPageMetadata(
  pageKey: keyof typeof PAGE_SEO_CONFIGS,
  canonicalPath: string,
  locale: SupportedLocale,
  overrides?: Partial<PageSeoConfig>
): Metadata {
  const baseConfig = PAGE_SEO_CONFIGS[pageKey]

  if (!baseConfig) {
    throw new Error(`SEO config not found for page: ${pageKey}`)
  }

  const finalConfig: PageSeoConfig = {
    ...baseConfig,
    canonicalPath,
    ...overrides,
  }

  return generateMetadata(finalConfig, locale)
}
