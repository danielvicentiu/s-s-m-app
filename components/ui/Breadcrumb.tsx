'use client'

import { usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href: string
}

export function Breadcrumb() {
  const pathname = usePathname()
  const t = useTranslations('breadcrumb')

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    // Remove locale prefix and split path
    const pathSegments = pathname.split('/').filter(segment => segment !== '')

    const breadcrumbs: BreadcrumbItem[] = [
      {
        label: t('home'),
        href: '/'
      }
    ]

    // Build breadcrumbs from path segments
    let currentPath = ''
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`

      // Try to get translation for segment, fallback to capitalized segment
      const translationKey = segment.replace(/-/g, '_')
      let label: string

      try {
        label = t(translationKey)
      } catch {
        // Fallback: capitalize and replace dashes with spaces
        label = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }

      breadcrumbs.push({
        label,
        href: currentPath
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Don't render on home page
  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1
        const isHome = index === 0

        return (
          <div key={item.href} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}

            {isLast ? (
              <span className="font-medium text-gray-900 flex items-center gap-1.5">
                {isHome && <Home className="w-4 h-4" />}
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
              >
                {isHome && <Home className="w-4 h-4" />}
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
