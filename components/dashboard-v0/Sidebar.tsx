'use client'

// components/dashboard-v0/Sidebar.tsx
// v0 collapsible sidebar - design refreshed with all existing links

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { useOrg } from '@/lib/contexts/OrgContext'
import { useModuleGate } from '@/lib/hooks/useModuleGate'
import type { ModuleKey } from '@/lib/modules/types'
import NotificationBell from '@/components/notifications/NotificationBell'
import {
  LayoutDashboard, BrainCircuit, Brain, Users, BookOpen, AlertTriangle, CalendarDays,
  ClipboardList, Flame, Cog, CheckSquare, Wrench, HeartPulse, FileBarChart2,
  Coins, Lock, Network, ScanLine, Upload, Bell, Database, UserCircle, KeyRound,
  Layers, ChevronLeft, ChevronRight, Shield, X, Menu,
} from 'lucide-react'

interface NavLink {
  href: string
  label: string
  icon: React.ElementType
  moduleKey?: ModuleKey | null
}

interface NavGroup {
  title: string
  links: NavLink[]
}

interface SidebarProps {
  user: User
  expanded: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

function SidebarNav({
  expanded,
  filteredGroups,
  isActive,
  getModuleAccess,
}: {
  expanded: boolean
  filteredGroups: NavGroup[]
  isActive: (href: string) => boolean
  getModuleAccess: (key: ModuleKey) => any
}) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      <ul className="flex flex-col gap-0.5">
        {filteredGroups.map((group, gi) => (
          <li key={gi}>
            {expanded && (
              <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground first:pt-0">
                {group.title}
              </p>
            )}
            {!expanded && gi > 0 && <div className="my-1 border-t border-border/50" />}
            {group.links.map((link) => {
              const active = isActive(link.href)
              const moduleAccess = link.moduleKey ? getModuleAccess(link.moduleKey as ModuleKey) : null
              const isTrialMode = moduleAccess?.is_trial ?? false
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={!expanded ? link.label : undefined}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    expanded ? '' : 'justify-center'
                  } ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-primary' : ''}`} />
                  {expanded && (
                    <>
                      <span className="flex-1 truncate">{link.label}</span>
                      {link.href === '/dashboard/ai-assistant' && (
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                          AI
                        </span>
                      )}
                      {isTrialMode && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                          Trial
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function Sidebar({ user, expanded, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const t = useTranslations('sidebar')
  const pathname = usePathname()
  const { currentOrg } = useOrg()
  const { hasModule, getModuleAccess, isLoading } = useModuleGate(
    currentOrg !== 'all' ? currentOrg : null
  )

  const navGroups: NavGroup[] = [
    {
      title: t('groups.main'),
      links: [
        { href: '/dashboard', label: t('links.dashboard'), moduleKey: null, icon: LayoutDashboard },
        { href: '/dashboard/ai-assistant', label: t('links.aiAssistant'), moduleKey: null, icon: BrainCircuit },
        { href: '/dashboard/ai-kb', label: t('links.aiKnowledgeBase'), moduleKey: null, icon: Brain },
        { href: '/dashboard/employees', label: t('links.employees'), moduleKey: 'ssm', icon: Users },
      ],
    },
    {
      title: t('groups.ssm'),
      links: [
        { href: '/dashboard/training', label: t('links.ssmTraining'), moduleKey: 'ssm', icon: BookOpen },
        { href: '/dashboard/near-miss', label: t('links.nearMiss'), moduleKey: 'near_miss', icon: AlertTriangle },
        { href: '/dashboard/training/calendar', label: t('links.trainingCalendar'), moduleKey: null, icon: CalendarDays },
        { href: '/dashboard/obligations', label: t('links.obligations'), moduleKey: 'legislatie', icon: ClipboardList },
      ],
    },
    {
      title: t('groups.psi'),
      links: [
        { href: '/dashboard/psi', label: t('links.psiEquipment'), moduleKey: 'psi', icon: Flame },
        { href: '/dashboard/iscir', label: t('links.iscir'), moduleKey: 'echipamente', icon: Cog },
        { href: '/dashboard/iscir/daily', label: t('links.dailyChecks'), moduleKey: 'echipamente', icon: CheckSquare },
        { href: '/dashboard/equipment', label: t('links.equipment'), moduleKey: 'echipamente', icon: Wrench },
      ],
    },
    {
      title: t('groups.medical'),
      links: [
        { href: '/dashboard/medical', label: t('links.occupationalMedicine'), moduleKey: 'ssm', icon: HeartPulse },
      ],
    },
    {
      title: t('groups.management'),
      links: [
        { href: '/dashboard/reports', label: t('links.pdfReports'), moduleKey: 'reports', icon: FileBarChart2 },
        { href: '/dashboard/contabilitate', label: t('links.accounting'), moduleKey: null, icon: Coins },
        { href: '/dashboard/gdpr', label: t('links.gdpr'), moduleKey: 'gdpr', icon: Lock },
        { href: '/dashboard/nis2', label: t('links.nis2'), moduleKey: 'nis2', icon: Network },
        { href: '/dashboard/scan', label: t('links.documentScan'), moduleKey: 'documents', icon: ScanLine },
        { href: '/dashboard/import', label: t('links.dataImport'), moduleKey: null, icon: Upload },
      ],
    },
    {
      title: t('groups.alerts'),
      links: [
        { href: '/dashboard/alerts', label: t('links.alertsNotifications'), moduleKey: null, icon: Bell },
      ],
    },
    {
      title: t('groups.admin'),
      links: [
        { href: '/dashboard/reges', label: t('links.reges'), moduleKey: null, icon: Database },
        { href: '/dashboard/profile', label: t('links.profile'), moduleKey: null, icon: UserCircle },
        { href: '/dashboard/settings/notifications', label: t('links.notifications'), moduleKey: null, icon: Bell },
        { href: '/dashboard/settings/roles', label: t('links.roles'), moduleKey: null, icon: Shield },
        { href: '/dashboard/settings/api-keys', label: t('links.apiKeys'), moduleKey: null, icon: KeyRound },
        { href: '/dashboard/batch', label: t('links.batchJobs'), moduleKey: null, icon: Layers },
      ],
    },
  ]

  const filteredGroups = navGroups
    .map(group => ({
      ...group,
      links: group.links.filter(link => {
        if (link.moduleKey === null || link.moduleKey === undefined) return true
        if (isLoading || currentOrg === 'all') return true
        return hasModule(link.moduleKey as ModuleKey)
      }),
    }))
    .filter(group => group.links.length > 0)

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href || pathname === '/dashboard/'
    return pathname.startsWith(href)
  }

  const userInitials = user.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'U'

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={`flex h-16 items-center border-b border-border ${expanded ? 'gap-2 px-4' : 'justify-center px-2'}`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Shield className="h-4 w-4 text-primary-foreground" />
        </div>
        {expanded && (
          <Link href="/dashboard" className="text-base font-bold tracking-tight text-foreground hover:opacity-80">
            s-s-m.ro
          </Link>
        )}
      </div>

      {/* Nav */}
      <SidebarNav
        expanded={expanded}
        filteredGroups={filteredGroups}
        isActive={isActive}
        getModuleAccess={getModuleAccess}
      />

      {/* User + Notification */}
      <div className="border-t border-border p-3">
        {expanded ? (
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">{user.email}</p>
              <p className="text-[10px] text-muted-foreground">{t('user')}</p>
            </div>
            <NotificationBell userId={user.id} />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground" title={user.email}>
              {userInitials}
            </div>
            <NotificationBell userId={user.id} />
          </div>
        )}

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label={expanded ? 'Restrânge meniul' : 'Extinde meniul'}
        >
          {expanded ? (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Restrânge</span>
            </>
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-40 border-r border-border bg-card transition-all duration-300 ${
          expanded ? 'lg:w-60' : 'lg:w-[68px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border bg-card transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">s-s-m.ro</span>
          </div>
          <button
            onClick={onMobileClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <SidebarNav
            expanded={true}
            filteredGroups={filteredGroups}
            isActive={isActive}
            getModuleAccess={getModuleAccess}
          />
        </div>
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">{user.email}</p>
            </div>
            <NotificationBell userId={user.id} />
          </div>
        </div>
      </aside>
    </>
  )
}
