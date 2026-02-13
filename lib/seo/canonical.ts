/**
 * SEO Canonical URL utilities
 * Handles canonical URLs and hreflang tags for multi-locale support
 */

import { routing } from '@/i18n/routing'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.s-s-m.ro'

export type Locale = (typeof routing.locales)[number]

/**
 * Generates the canonical URL for a given path and locale
 * @param path - The path without locale prefix (e.g., '/dashboard', '/employees')
 * @param locale - The locale code (e.g., 'ro', 'en', 'bg')
 * @returns Full canonical URL
 * @example
 * getCanonicalUrl('/dashboard', 'ro') // 'https://app.s-s-m.ro/ro/dashboard'
 * getCanonicalUrl('/dashboard', 'en') // 'https://app.s-s-m.ro/en/dashboard'
 */
export function getCanonicalUrl(path: string, locale: Locale): string {
  // Remove trailing slash from path if present
  const cleanPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path

  // Ensure path starts with /
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`

  // For default locale, we can optionally exclude the locale prefix
  // Currently including it for consistency
  return `${SITE_URL}/${locale}${normalizedPath}`
}

/**
 * Generates alternate URLs for all available locales
 * @param path - The path without locale prefix
 * @returns Array of objects with locale and URL for each available locale
 * @example
 * getAlternateUrls('/dashboard')
 * // Returns:
 * // [
 * //   { locale: 'ro', url: 'https://app.s-s-m.ro/ro/dashboard' },
 * //   { locale: 'bg', url: 'https://app.s-s-m.ro/bg/dashboard' },
 * //   { locale: 'hu', url: 'https://app.s-s-m.ro/hu/dashboard' },
 * //   ...
 * // ]
 */
export function getAlternateUrls(path: string): Array<{ locale: Locale; url: string }> {
  return routing.locales.map((locale) => ({
    locale,
    url: getCanonicalUrl(path, locale),
  }))
}

/**
 * Generates hreflang link tags for all locales
 * @param path - The path without locale prefix
 * @returns Object with languages property containing hreflang metadata
 * @example
 * generateHreflang('/dashboard')
 * // Returns object ready to be spread into Next.js metadata:
 * // {
 * //   languages: {
 * //     'ro-RO': 'https://app.s-s-m.ro/ro/dashboard',
 * //     'bg-BG': 'https://app.s-s-m.ro/bg/dashboard',
 * //     ...
 * //     'x-default': 'https://app.s-s-m.ro/ro/dashboard'
 * //   }
 * // }
 */
export function generateHreflang(path: string): {
  languages: Record<string, string>
} {
  const alternateUrls = getAlternateUrls(path)

  // Map locale codes to proper hreflang format
  const localeToHreflang: Record<string, string> = {
    ro: 'ro-RO',
    bg: 'bg-BG',
    hu: 'hu-HU',
    de: 'de-DE',
    pl: 'pl-PL',
    en: 'en-US',
  }

  const languages: Record<string, string> = {}

  // Add all locale variants
  alternateUrls.forEach(({ locale, url }) => {
    const hreflangCode = localeToHreflang[locale] || locale
    languages[hreflangCode] = url
  })

  // Add x-default pointing to default locale
  languages['x-default'] = getCanonicalUrl(path, routing.defaultLocale)

  return { languages }
}

/**
 * Helper to get the base path without locale prefix
 * @param pathname - Full pathname including locale (e.g., '/ro/dashboard')
 * @returns Path without locale prefix (e.g., '/dashboard')
 */
export function getPathWithoutLocale(pathname: string): string {
  // Check if pathname starts with any of our locales
  for (const locale of routing.locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return pathname.slice(`/${locale}`.length) || '/'
    }
  }
  return pathname
}

/**
 * Complete metadata helper for Next.js pages
 * Generates canonical URL and alternates for metadata
 * @param path - The path without locale prefix
 * @param locale - Current locale
 * @returns Object ready to be spread into Next.js metadata
 * @example
 * export async function generateMetadata({ params }: PageProps) {
 *   return {
 *     title: 'Dashboard',
 *     ...getMetadataAlternates('/dashboard', params.locale),
 *   }
 * }
 */
export function getMetadataAlternates(path: string, locale: Locale) {
  const canonicalUrl = getCanonicalUrl(path, locale)
  const hreflang = generateHreflang(path)

  return {
    alternates: {
      canonical: canonicalUrl,
      ...hreflang,
    },
  }
}
