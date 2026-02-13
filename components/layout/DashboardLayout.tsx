// components/layout/DashboardLayout.tsx
// Dashboard layout wrapper with sidebar, top bar, and main content area
// Features: collapsible sidebar, mobile hamburger, search, notifications, user menu

'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  FileText,
  UserPlus,
  Home,
} from 'lucide-react'
import ModuleNav from '@/components/navigation/ModuleNav'
import LanguageSelector from '@/components/LanguageSelector'

interface DashboardLayoutProps {
  children: React.ReactNode
  user?: {
    email: string
    id: string
    name?: string
  }
  orgId?: string | null
  locale?: string
  notifications?: number
  onSearch?: (query: string) => void
  showQuickActions?: boolean
}

export default function DashboardLayout({
  children,
  user,
  orgId = null,
  locale = 'ro',
  notifications = 0,
  onSearch,
  showQuickActions = true,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setUserMenuOpen(false)
    if (userMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [userMenuOpen])

  // Persist sidebar state to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-open')
    if (saved !== null) {
      setSidebarOpen(saved === 'true')
    }
  }, [])

  const toggleSidebar = () => {
    const newState = !sidebarOpen
    setSidebarOpen(newState)
    localStorage.setItem('sidebar-open', String(newState))
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ========== SIDEBAR (Desktop) ========== */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 bg-white border-r border-gray-200 hidden lg:block ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {sidebarOpen ? (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="font-black text-lg text-gray-900">s-s-m.ro</span>
            </Link>
          ) : (
            <Link href="/dashboard" className="mx-auto">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                S
              </div>
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className={`p-1.5 rounded-lg hover:bg-gray-100 transition ${
              !sidebarOpen && 'mx-auto'
            }`}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="overflow-y-auto h-[calc(100vh-4rem)] p-4">
          {sidebarOpen ? (
            <>
              {/* Home Link */}
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-4 transition-colors ${
                  pathname === '/dashboard' || pathname.endsWith('/dashboard')
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Home className="h-5 w-5" />
                <span className="text-sm">Dashboard</span>
              </Link>

              {/* Module Navigation */}
              <div className="mb-6">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
                  Module
                </div>
                <ModuleNav
                  orgId={orgId}
                  locale={locale}
                  currentPath={pathname}
                  className="space-y-1"
                />
              </div>

              {/* Settings Link */}
              <Link
                href="/dashboard/settings"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  pathname.includes('/settings')
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span className="text-sm">Setări</span>
              </Link>
            </>
          ) : (
            // Collapsed sidebar icons
            <div className="flex flex-col items-center gap-3">
              <Link
                href="/dashboard"
                className={`p-2.5 rounded-lg transition-colors ${
                  pathname === '/dashboard' || pathname.endsWith('/dashboard')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="Dashboard"
              >
                <Home className="h-5 w-5" />
              </Link>
              <Link
                href="/dashboard/settings"
                className={`p-2.5 rounded-lg transition-colors ${
                  pathname.includes('/settings')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="Setări"
              >
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* ========== MOBILE SIDEBAR ========== */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Mobile Menu */}
          <aside className="fixed left-0 top-0 z-50 h-screen w-72 bg-white border-r border-gray-200 lg:hidden overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <Link
                href="/dashboard"
                className="flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                  S
                </div>
                <span className="font-black text-lg text-gray-900">s-s-m.ro</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Navigation */}
            <div className="p-4">
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-4 transition-colors ${
                  pathname === '/dashboard' || pathname.endsWith('/dashboard')
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span className="text-sm">Dashboard</span>
              </Link>

              <div className="mb-6">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
                  Module
                </div>
                <ModuleNav
                  orgId={orgId}
                  locale={locale}
                  currentPath={pathname}
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              </div>

              <Link
                href="/dashboard/settings"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  pathname.includes('/settings')
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span className="text-sm">Setări</span>
              </Link>
            </div>
          </aside>
        </>
      )}

      {/* ========== MAIN CONTENT AREA ========== */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
        }`}
      >
        {/* ========== TOP BAR ========== */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            {/* Left: Mobile Menu + Search */}
            <div className="flex items-center gap-4 flex-1">
              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>

              {/* Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex items-center flex-1 max-w-md"
              >
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Caută..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </form>
            </div>

            {/* Right: Quick Actions + Notifications + Language + User Menu */}
            <div className="flex items-center gap-3">
              {/* Quick Actions (Desktop Only) */}
              {showQuickActions && (
                <div className="hidden xl:flex items-center gap-2 border-r border-gray-200 pr-4">
                  <Link
                    href="/dashboard/angajat-nou"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1.5"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Angajat Nou</span>
                  </Link>
                  <Link
                    href="/documents/generate"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition flex items-center gap-1.5"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Documente</span>
                  </Link>
                </div>
              )}

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
                <Bell className="h-5 w-5 text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </button>

              {/* Language Selector */}
              <div className="hidden md:block">
                <LanguageSelector />
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setUserMenuOpen(!userMenuOpen)
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.name || user?.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-xs text-gray-500">Consultant</div>
                  </div>
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">
                        {user?.name || 'User'}
                      </div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <User className="h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Setări</span>
                    </Link>
                    <div className="border-t border-gray-100 my-2" />
                    <form action="/api/auth/signout" method="POST">
                      <button
                        type="submit"
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Ieși</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ========== PAGE CONTENT ========== */}
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  )
}
