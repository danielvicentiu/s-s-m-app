// components/layout/PageHeader.tsx
// Header standard pentru paginile dashboard
// Include: breadcrumb, titlu, descriere opțională, butoane acțiune (dreapta)
// Responsive: pe mobile butoanele se stivuiesc sub titlu
// Data: 13 Februarie 2026

'use client'

import { type ReactNode } from 'react'
import AutoBreadcrumb from '@/components/navigation/AutoBreadcrumb'

// ── Tipuri ──

export interface BreadcrumbItem {
  label: string
  href: string
}

export interface PageHeaderAction {
  label: string
  icon?: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  disabled?: boolean
  className?: string
}

interface PageHeaderProps {
  // Titlu principal
  title: string

  // Descriere opțională (subtitlu)
  description?: string

  // Breadcrumb personalizat (opțional, default: AutoBreadcrumb)
  breadcrumbItems?: BreadcrumbItem[]
  showBreadcrumb?: boolean

  // Butoane acțiune (dreapta)
  actions?: PageHeaderAction[]

  // Clase CSS personalizate
  className?: string
}

// ── Componenta principală ──

export default function PageHeader({
  title,
  description,
  breadcrumbItems,
  showBreadcrumb = true,
  actions = [],
  className = ''
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      {/* Breadcrumb */}
      {showBreadcrumb && (
        <div className="mb-4">
          {breadcrumbItems && breadcrumbItems.length > 0 ? (
            // Breadcrumb personalizat
            <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-sm">
              <ol className="flex items-center space-x-1">
                {breadcrumbItems.map((item, index) => {
                  const isLast = index === breadcrumbItems.length - 1
                  return (
                    <li key={item.href} className="flex items-center space-x-1">
                      {index > 0 && (
                        <span className="text-gray-400 mx-2">/</span>
                      )}
                      {isLast ? (
                        <span className="font-semibold text-gray-900">
                          {item.label}
                        </span>
                      ) : (
                        <a
                          href={item.href}
                          className="text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  )
                })}
              </ol>
            </nav>
          ) : (
            // Breadcrumb automat
            <AutoBreadcrumb />
          )}
        </div>
      )}

      {/* Header principal: titlu + descriere + acțiuni */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Titlu + descriere */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-sm text-gray-600 max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {/* Butoane acțiune */}
        {actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:ml-4">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`
                  inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
                  transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${getActionVariantClasses(action.variant)}
                  ${action.className || ''}
                `}
              >
                {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Helper: clase CSS pentru variante butoane ──

function getActionVariantClasses(variant: PageHeaderAction['variant'] = 'primary'): string {
  switch (variant) {
    case 'primary':
      return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
    case 'secondary':
      return 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
    case 'outline':
      return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
    default:
      return 'bg-blue-600 text-white hover:bg-blue-700'
  }
}
