"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react"

export function Topbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-sm">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Caută angajați, documente, module..."
          className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Notificări"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              AM
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium leading-tight text-foreground">
                Andrei Mihai
              </p>
              <p className="text-xs leading-tight text-muted-foreground">
                Administrator
              </p>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground md:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-48 rounded-lg border border-border bg-card py-1 shadow-lg">
              <a
                href="#"
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                Profilul meu
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                Setări
              </a>
              <div className="my-1 border-t border-border" />
              <a
                href="#"
                className="flex items-center gap-2 px-3 py-2 text-sm text-destructive transition-colors hover:bg-accent"
              >
                <LogOut className="h-4 w-4" />
                Deconectare
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
