'use client'

import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')

  const footerLinks = [
    {
      title: t('platform'),
      links: [
        { label: t('featuresLink'), href: '#functionalitati' },
        { label: t('pricingLink'), href: '#preturi' },
      ],
    },
    {
      title: t('resources'),
      links: [
        { label: t('blog'), href: '#' },
        { label: t('guides'), href: '#' },
        { label: t('legislation'), href: '#' },
      ],
    },
    {
      title: t('company'),
      links: [
        { label: t('about'), href: '#' },
        { label: t('contactLink'), href: '#contact' },
        { label: t('partnerships'), href: '#' },
      ],
    },
  ]

  return (
    <footer id="contact" className="bg-header-bg px-6 pb-8 pt-16 text-header-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <a href="#" className="text-xl font-bold tracking-tight">
              s-s-m<span className="text-primary">.ro</span>
            </a>
            <p className="mt-3 text-sm leading-relaxed text-header-foreground/60">
              {t('description')}
            </p>
            <div className="mt-4 space-y-1 text-sm text-header-foreground/60">
              <div>📧 {t('email')}</div>
              <div>📞 {t('phone')}</div>
              <div>📍 {t('address')}</div>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-header-foreground/40">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-header-foreground/60 transition-colors hover:text-header-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-header-foreground/10 pt-8 md:flex-row">
          <p className="text-xs text-header-foreground/40">
            {t('copyright')}
          </p>
          <div className="flex items-center gap-6 text-xs text-header-foreground/40">
            <a href="#" className="transition-colors hover:text-header-foreground/60">
              {t('terms')}
            </a>
            <a href="#" className="transition-colors hover:text-header-foreground/60">
              {t('privacy')}
            </a>
            <a href="#" className="transition-colors hover:text-header-foreground/60">
              {t('cookies')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
