import { MetadataRoute } from 'next'

// Configurare limbaje suportate
const locales = ['ro', 'bg', 'hu', 'de', 'pl', 'en'] as const
const defaultLocale = 'ro'
const baseUrl = 'https://app.s-s-m.ro'

// Pagini publice disponibile
const publicPages = [
  '', // landing page
  '/pricing',
  '/about',
  '/quick-check',
  '/calculator-risc',
  // Adaugă când vor fi create:
  // '/contact',
  // '/faq',
  // '/terms',
  // '/privacy',
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = []

  // Generează URL-uri pentru fiecare pagină în fiecare limbă
  publicPages.forEach((page) => {
    locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${page}`])
          ),
        },
      })
    })
  })

  // Adaugă redirect de la root la locale default
  sitemap.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}`])
      ),
    },
  })

  return sitemap
}
