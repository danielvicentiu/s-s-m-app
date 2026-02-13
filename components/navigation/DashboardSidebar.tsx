// components/navigation/DashboardSidebar.tsx
// Sidebar îmbunătățit cu iconițe, badges, collapse mobile, active states, grupare secțiuni
// Data: 13 Februarie 2026

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Package,
  GraduationCap,
  Bell,
  FileText,
  Settings,
  Building2,
  Shield,
  AlertTriangle,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Home
} from 'lucide-react'

// ── Tipuri ──
interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  badgeColor?: 'red' | 'orange' | 'blue' | 'green'
}

interface NavSection {
  title: string
  items: NavItem[]
  collapsed?: boolean
}

interface DashboardSidebarProps {
  alertsCount?: number
  locale?: string
  organizationName?: string
}

// ── Componenta principală ──
export default function DashboardSidebar({
  alertsCount = 0,
  locale = 'ro',
  organizationName = 'Dashboard'
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

  // Închide mobile menu când se navighează
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Închide mobile menu pe ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileOpen(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  // Toggle secțiune collapse
  const toggleSection = (sectionTitle: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }))
  }

  // ── Definirea secțiunilor de navigare ──
  const sections: NavSection[] = [
    {
      title: locale === 'ro' ? 'Principal' : 'Main',
      items: [
        {
          label: locale === 'ro' ? 'Dashboard' : 'Dashboard',
          href: `/${locale}/dashboard`,
          icon: LayoutDashboard,
        },
        {
          label: locale === 'ro' ? 'Profil' : 'Profile',
          href: `/${locale}/dashboard/profile`,
          icon: Home,
        },
      ]
    },
    {
      title: locale === 'ro' ? 'Module' : 'Modules',
      items: [
        {
          label: locale === 'ro' ? 'Medicina Muncii' : 'Occupational Health',
          href: `/${locale}/dashboard/medical`,
          icon: Stethoscope,
        },
        {
          label: locale === 'ro' ? 'Echipamente PSI' : 'Fire Equipment',
          href: `/${locale}/dashboard/equipment`,
          icon: Package,
        },
        {
          label: locale === 'ro' ? 'Angajați' : 'Employees',
          href: `/${locale}/dashboard/angajat-nou`,
          icon: Users,
        },
        {
          label: locale === 'ro' ? 'Instruiri SSM' : 'OSH Training',
          href: `/${locale}/dashboard/training`,
          icon: GraduationCap,
        },
        {
          label: locale === 'ro' ? 'Alerte' : 'Alerts',
          href: `/${locale}/dashboard/alerts`,
          icon: Bell,
          badge: alertsCount,
          badgeColor: 'red',
        },
        {
          label: locale === 'ro' ? 'Documente' : 'Documents',
          href: `/${locale}/dashboard/documents`,
          icon: FileText,
        },
        {
          label: locale === 'ro' ? 'Evaluare Risc' : 'Risk Assessment',
          href: `/${locale}/dashboard/reges`,
          icon: AlertTriangle,
        },
      ]
    },
    {
      title: locale === 'ro' ? 'Admin' : 'Admin',
      items: [
        {
          label: locale === 'ro' ? 'Organizații' : 'Organizations',
          href: `/${locale}/admin/organizations`,
          icon: Building2,
        },
        {
          label: locale === 'ro' ? 'Utilizatori & Roluri' : 'Users & Roles',
          href: `/${locale}/admin/users`,
          icon: Shield,
        },
        {
          label: locale === 'ro' ? 'Setări' : 'Settings',
          href: `/${locale}/dashboard/settings`,
          icon: Settings,
        },
      ]
    }
  ]

  // ── Helper: verifică dacă ruta este activă ──
  const isActive = (href: string) => {
    if (href === `/${locale}/dashboard`) {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  // ── Helper: randează badge ──
  const renderBadge = (badge?: number, color?: string) => {
    if (!badge || badge === 0) return null

    const colorClasses = {
      red: 'bg-red-500 text-white',
      orange: 'bg-orange-500 text-white',
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
    }

    return (
      <span className={`ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
        {badge > 99 ? '99+' : badge}
      </span>
    )
  }

  // ── Randare sidebar ──
  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900">s-s-m.ro</h2>
            <p className="text-xs text-gray-500 mt-0.5">{organizationName}</p>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-6">
          {sections.map((section) => {
            const isCollapsed = collapsedSections[section.title]

            return (
              <div key={section.title}>
                {/* Section header */}
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex w-full items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span>{section.title}</span>
                  {isCollapsed ? (
                    <ChevronRight className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>

                {/* Section items */}
                {!isCollapsed && (
                  <div className="mt-1 space-y-0.5">
                    {section.items.map((item) => {
                      const active = isActive(item.href)
                      const Icon = item.icon

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                            active
                              ? 'bg-blue-50 text-blue-700 shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <Icon className={`h-5 w-5 flex-shrink-0 ${
                            active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                          }`} />
                          <span className="flex-1">{item.label}</span>
                          {renderBadge(item.badge, item.badgeColor)}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4">
        <div className="text-xs text-gray-400">
          {locale === 'ro' ? '© 2026 s-s-m.ro' : '© 2026 s-s-m.ro'}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-white p-2 shadow-lg lg:hidden border border-gray-200 hover:bg-gray-50"
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200">
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile (slide in) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
