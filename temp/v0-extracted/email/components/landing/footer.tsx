const footerLinks = {
  Platformă: [
    { label: "Funcționalități", href: "#functionalitati" },
    { label: "Prețuri", href: "#preturi" },
    { label: "Integrări", href: "#" },
    { label: "API", href: "#" },
  ],
  Resurse: [
    { label: "Documentație", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Ghiduri SSM", href: "#" },
    { label: "Legislație", href: "#" },
  ],
  Companie: [
    { label: "Despre noi", href: "#" },
    { label: "Contact", href: "#contact" },
    { label: "Cariere", href: "#" },
    { label: "Parteneriate", href: "#" },
  ],
}

export function Footer() {
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
              Platformă completă pentru securitatea și sănătatea în muncă.
              Conformitate automată pentru angajatorii din România și CEE.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-header-foreground/40">
                {title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
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
            {"© 2025 s-s-m.ro. Toate drepturile rezervate."}
          </p>
          <div className="flex items-center gap-6 text-xs text-header-foreground/40">
            <a href="#" className="transition-colors hover:text-header-foreground/60">
              Termeni și condiții
            </a>
            <a href="#" className="transition-colors hover:text-header-foreground/60">
              Politica de confidențialitate
            </a>
            <a href="#" className="transition-colors hover:text-header-foreground/60">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
