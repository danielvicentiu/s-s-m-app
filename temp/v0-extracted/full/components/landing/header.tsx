"use client"

import { useState } from "react"
import { Menu, X, ChevronDown, Globe } from "lucide-react"

const languages = [
  { code: "RO", label: "Română" },
  { code: "EN", label: "English" },
  { code: "DE", label: "Deutsch" },
  { code: "HU", label: "Magyar" },
  { code: "BG", label: "Bulgarski" },
  { code: "PL", label: "Polski" },
]

const navLinks = [
  { href: "#functionalitati", label: "Funcționalități" },
  { href: "#preturi", label: "Prețuri" },
  { href: "#contact", label: "Contact" },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [selectedLang, setSelectedLang] = useState("RO")

  return (
    <header className="sticky top-0 z-50 bg-header-bg text-header-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="text-xl font-bold tracking-tight">
          s-s-m<span className="text-primary">.ro</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigare principala">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-header-foreground/80 transition-colors hover:text-header-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-header-foreground/80 transition-colors hover:text-header-foreground"
              aria-label="Selectează limba"
            >
              <Globe className="h-4 w-4" />
              {selectedLang}
              <ChevronDown className="h-3 w-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 min-w-[140px] rounded-lg border border-border bg-card p-1 shadow-lg">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang.code)
                      setLangOpen(false)
                    }}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                      selectedLang === lang.code
                        ? "font-medium text-primary"
                        : "text-card-foreground"
                    }`}
                  >
                    {lang.code} — {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="#"
            className="rounded-md px-4 py-2 text-sm font-medium text-header-foreground/80 transition-colors hover:text-header-foreground"
          >
            Autentificare
          </a>
          <a
            href="#cta"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {"Încercare Gratuită"}
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          aria-label="Meniu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-header-foreground/10 px-6 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-header-foreground/80 hover:text-header-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            <a
              href="#"
              className="text-sm font-medium text-header-foreground/80 hover:text-header-foreground"
            >
              Autentificare
            </a>
            <a
              href="#cta"
              className="rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              {"Încercare Gratuită"}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
