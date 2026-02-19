"use client"

import {
  LayoutDashboard,
  Shield,
  Flame,
  Lock,
  Network,
  HeartPulse,
  Cog,
  AlertTriangle,
  CalendarDays,
  FileText,
  DatabaseZap,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Panou Control", href: "/dashboard", active: true },
  { icon: Shield, label: "SSM", href: "#" },
  { icon: Flame, label: "PSI", href: "#" },
  { icon: Lock, label: "GDPR", href: "#" },
  { icon: Network, label: "NIS2", href: "#" },
  { icon: HeartPulse, label: "Medical", href: "#" },
  { icon: Cog, label: "ISCIR", href: "#" },
  { icon: AlertTriangle, label: "Near-Miss", href: "#" },
  { icon: CalendarDays, label: "Instruiri", href: "#" },
  { icon: FileText, label: "Rapoarte", href: "#" },
  { icon: DatabaseZap, label: "Import Date", href: "#" },
  { icon: Settings, label: "Setări", href: "#" },
]

interface SidebarProps {
  expanded: boolean
  onToggle: () => void
}

export function Sidebar({ expanded, onToggle }: SidebarProps) {

  return (
    <aside
      className={`fixed top-0 left-0 z-40 flex h-screen flex-col border-r border-border bg-card transition-all duration-300 ${
        expanded ? "w-60" : "w-[68px]"
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Shield className="h-4 w-4 text-primary-foreground" />
        </div>
        {expanded && (
          <span className="text-base font-bold tracking-tight text-foreground">
            s-s-m.ro
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                } ${!expanded ? "justify-center" : ""}`}
                title={!expanded ? item.label : undefined}
              >
                <item.icon className={`h-[18px] w-[18px] shrink-0 ${item.active ? "text-primary" : ""}`} />
                {expanded && <span>{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-border p-3">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label={expanded ? "Restrânge meniul" : "Extinde meniul"}
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
    </aside>
  )
}
