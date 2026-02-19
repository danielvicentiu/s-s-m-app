"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { AlerteConformitate } from "@/components/email-templates/alerte-conformitate"
import { InstruireProgramata } from "@/components/email-templates/instruire-programata"
import { BunVenit } from "@/components/email-templates/bun-venit"
import { AlertTriangle, CalendarDays, PartyPopper, Monitor, Smartphone } from "lucide-react"

const templates = [
  {
    id: "alerte",
    label: "Alerte Conformitate",
    icon: AlertTriangle,
    accent: "#dc2626",
    component: AlerteConformitate,
  },
  {
    id: "instruire",
    label: "Instruire Programată",
    icon: CalendarDays,
    accent: "#2563eb",
    component: InstruireProgramata,
  },
  {
    id: "bun-venit",
    label: "Bun Venit",
    icon: PartyPopper,
    accent: "#16a34a",
    component: BunVenit,
  },
] as const

type ViewMode = "desktop" | "mobile"

export default function EmailTemplatesPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [activeTemplate, setActiveTemplate] = useState<string>("alerte")
  const [viewMode, setViewMode] = useState<ViewMode>("desktop")

  const current = templates.find((t) => t.id === activeTemplate)!
  const CurrentComponent = current.component

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />

      <div
        className="flex flex-1 flex-col transition-all duration-300"
        style={{ paddingLeft: sidebarExpanded ? 240 : 68 }}
      >
        <Topbar />

        <main className="flex-1 overflow-y-auto px-6 py-6">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Șabloane Email
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Previzualizare șabloane de notificare trimise automat de platformă.
            </p>
          </div>

          {/* Tabs + View toggle */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Template tabs */}
            <div className="flex gap-2 overflow-x-auto">
              {templates.map((t) => {
                const active = activeTemplate === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTemplate(t.id)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all ${
                      active
                        ? "bg-foreground text-background shadow-sm"
                        : "bg-card text-muted-foreground border border-border hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <t.icon className="h-4 w-4" />
                    {t.label}
                  </button>
                )
              })}
            </div>

            {/* View mode toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
              {[
                { mode: "desktop" as ViewMode, icon: Monitor, label: "Desktop" },
                { mode: "mobile" as ViewMode, icon: Smartphone, label: "Mobil" },
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                    viewMode === mode
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview area */}
          <div className="rounded-xl border border-border bg-muted/30 p-6">
            {/* Browser chrome bar */}
            <div className="mb-4 flex items-center gap-3 rounded-t-lg border border-border bg-card px-4 py-2.5">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/30" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/40" />
                <div className="h-3 w-3 rounded-full bg-green-400/40" />
              </div>
              <div className="flex-1">
                <div className="mx-auto max-w-sm rounded-md bg-muted px-3 py-1 text-center text-xs text-muted-foreground">
                  mail.google.com
                </div>
              </div>
            </div>

            {/* Template render */}
            <div
              className="mx-auto transition-all duration-300"
              style={{ maxWidth: viewMode === "mobile" ? 375 : 640 }}
            >
              <CurrentComponent />
            </div>
          </div>

          {/* Info bar */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: current.accent }}
              />
              {"Culoare accent: "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">
                {current.accent}
              </code>
            </span>
            <span>{"Lățime maximă: 600px"}</span>
            <span>{"Format: HTML inline styles (compatibil email)"}</span>
          </div>
        </main>
      </div>
    </div>
  )
}
