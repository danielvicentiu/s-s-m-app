'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import LanguageSelector from '@/components/LanguageSelector'
import { useTranslations } from 'next-intl'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useTranslations('nav')

  const navLinks = [
    { href: '#functionalitati', label: t('features') },
    { href: '#preturi', label: t('pricing') },
    { href: '#contact', label: t('contact') },
  ]

  return (
    <header className="sticky top-0 z-50 bg-header-bg text-header-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-header-foreground hover:opacity-90 transition-opacity">
          s-s-m<span className="text-primary">.ro</span>
        </Link>

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
          <LanguageSelector />
          <Link
            href="/login"
            className="rounded-md px-4 py-2 text-sm font-medium text-header-foreground/80 transition-colors hover:text-header-foreground"
          >
            {t('login')}
          </Link>
          <Link
            href="/onboarding"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t('trialCta')}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-header-foreground"
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
            <div className="py-1">
              <LanguageSelector />
            </div>
            <Link
              href="/login"
              className="text-sm font-medium text-header-foreground/80 hover:text-header-foreground"
            >
              {t('login')}
            </Link>
            <Link
              href="/onboarding"
              className="rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              {t('trialCta')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
