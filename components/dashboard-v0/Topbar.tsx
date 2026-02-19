'use client'

// components/dashboard-v0/Topbar.tsx
// v0 topbar - search, notifications, user menu

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Search, User, Settings, LogOut, ChevronDown, Menu } from 'lucide-react'
import NotificationBell from '@/components/notifications/NotificationBell'

interface TopbarProps {
  userEmail: string
  userId: string
  onMobileMenuOpen: () => void
}

export default function Topbar({ userEmail, userId, onMobileMenuOpen }: TopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const userInitials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : 'U'

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleLogout() {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-sm lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuOpen}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
        aria-label="Deschide meniu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Caută angajați, documente, module..."
          className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        {/* NotificationBell */}
        <div className="flex h-9 w-9 items-center justify-center rounded-lg">
          <NotificationBell userId={userId} />
        </div>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {userInitials}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium leading-tight text-foreground max-w-[150px] truncate">
                {userEmail}
              </p>
              <p className="text-xs leading-tight text-muted-foreground">Utilizator</p>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground md:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-48 rounded-lg border border-border bg-card py-1 shadow-lg z-50">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                onClick={() => setDropdownOpen(false)}
              >
                <User className="h-4 w-4 text-muted-foreground" />
                Profilul meu
              </Link>
              <Link
                href="/dashboard/settings/notifications"
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                Setări
              </Link>
              <div className="my-1 border-t border-border" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive transition-colors hover:bg-accent"
              >
                <LogOut className="h-4 w-4" />
                Deconectare
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
