'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
}

/**
 * Breadcrumb component with automatic path generation
 * Features:
 * - Auto-generates breadcrumbs from pathname if items not provided
 * - Home icon for first item
 * - Chevron separators
 * - Last item bold, non-clickable
 * - Responsive: shows only last 2 items on mobile
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  const pathname = usePathname()

  // Auto-generate breadcrumb items from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname)

  if (breadcrumbItems.length === 0) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-sm">
      {breadcrumbItems.map((item, index) => {
        const isFirst = index === 0
        const isLast = index === breadcrumbItems.length - 1
        const isSecondToLast = index === breadcrumbItems.length - 2

        return (
          <div
            key={item.href}
            className={`flex items-center ${
              // Hide items on mobile except last 2
              index < breadcrumbItems.length - 2 ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Separator */}
            {!isFirst && (
              <ChevronRight
                className={`h-4 w-4 text-gray-400 mx-1 ${
                  index === breadcrumbItems.length - 2 ? 'block' : 'hidden md:block'
                }`}
              />
            )}

            {/* Breadcrumb Item */}
            {isLast ? (
              // Last item: bold, no link
              <span className="font-semibold text-gray-900 flex items-center">
                {isFirst && <Home className="h-4 w-4 mr-1" />}
                {item.label}
              </span>
            ) : (
              // Other items: clickable links
              <Link
                href={item.href}
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
              >
                {isFirst && <Home className="h-4 w-4 mr-1" />}
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

/**
 * Generate breadcrumb items from pathname
 * Example: /dashboard/medical/123 -> [Home, Dashboard, Medical, Details]
 */
function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  // Remove locale prefix if present (e.g., /ro, /en, /bg)
  const pathWithoutLocale = pathname.replace(/^\/(ro|en|bg|hu|de)/, '')

  // Split path and filter empty strings
  const segments = pathWithoutLocale.split('/').filter(Boolean)

  if (segments.length === 0) {
    return [{ label: 'Acasă', href: '/' }]
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Acasă', href: '/' }
  ]

  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`

    // Convert segment to readable label
    // Skip numeric IDs (likely detail pages)
    if (/^\d+$/.test(segment)) {
      breadcrumbs.push({
        label: 'Detalii',
        href: currentPath
      })
    } else {
      // Convert kebab-case or snake_case to Title Case
      const label = segment
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      breadcrumbs.push({
        label,
        href: currentPath
      })
    }
  })

  return breadcrumbs
}
