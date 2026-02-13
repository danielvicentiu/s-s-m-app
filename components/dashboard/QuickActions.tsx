'use client'

import Link from 'next/link'
import {
  UserPlus,
  GraduationCap,
  Wrench,
  FileText,
  Download,
  Calendar,
  type LucideIcon,
} from 'lucide-react'

interface QuickAction {
  icon: LucideIcon
  label: string
  href: string
  color: string
}

const quickActions: QuickAction[] = [
  {
    icon: UserPlus,
    label: 'Adaugă angajat',
    href: '/dashboard/employees/new',
    color: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
  },
  {
    icon: GraduationCap,
    label: 'Programează instruire',
    href: '/dashboard/trainings/new',
    color: 'bg-green-50 text-green-600 hover:bg-green-100',
  },
  {
    icon: Wrench,
    label: 'Înregistrează echipament',
    href: '/dashboard/equipment/new',
    color: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
  },
  {
    icon: FileText,
    label: 'Generează raport PDF',
    href: '/dashboard/reports',
    color: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
  },
  {
    icon: Download,
    label: 'Exportă date CSV',
    href: '/dashboard/exports',
    color: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100',
  },
  {
    icon: Calendar,
    label: 'Vizualizare calendar',
    href: '/dashboard/calendar',
    color: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
  },
]

export function QuickActions() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Acțiuni rapide
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${action.color}`}
            >
              <div className="flex-shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
