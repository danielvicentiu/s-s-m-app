// components/navigation/BottomNav.tsx
// Navigare bottom pentru mobil - 5 icoane principale
// Dashboard | Angajați | Instruiri | Alerte | Meniu
// Ascuns pe desktop (md:hidden), Fixed bottom, Badge pe Alerte

'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Bell,
  Menu
} from 'lucide-react'

interface BottomNavProps {
  locale?: string
  alertCount?: number
}

export default function BottomNav({
  locale = 'ro',
  alertCount = 0
}: BottomNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      label: 'Dashboard',
      href: `/${locale}/dashboard`,
      icon: LayoutDashboard,
      active: pathname === `/${locale}/dashboard` || pathname?.startsWith(`/${locale}/dashboard/`) && !pathname.includes('/employees') && !pathname.includes('/training') && !pathname.includes('/alerts')
    },
    {
      label: 'Angajați',
      href: `/${locale}/dashboard/employees`,
      icon: Users,
      active: pathname?.includes('/employees') || pathname?.includes('/angajat')
    },
    {
      label: 'Instruiri',
      href: `/${locale}/dashboard/training`,
      icon: GraduationCap,
      active: pathname?.includes('/training') || pathname?.includes('/instruire')
    },
    {
      label: 'Alerte',
      href: `/${locale}/dashboard/alerts`,
      icon: Bell,
      active: pathname?.includes('/alerts') || pathname?.includes('/alerte'),
      badge: alertCount
    },
    {
      label: 'Meniu',
      href: `/${locale}/dashboard/menu`,
      icon: Menu,
      active: pathname?.includes('/menu')
    }
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.active

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-1 relative
                transition-colors duration-200
                ${isActive
                  ? 'text-blue-600'
                  : 'text-gray-400 active:text-gray-600'
                }
              `}
            >
              <div className="relative">
                <Icon
                  className={`h-6 w-6 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`}
                />

                {/* Badge pentru alerte */}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>

              {/* Active indicator line */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
