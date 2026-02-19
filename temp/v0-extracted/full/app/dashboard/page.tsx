"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { StatCards } from "@/components/dashboard/stat-cards"
import { ComplianceChart } from "@/components/dashboard/compliance-chart"
import { UrgentActions } from "@/components/dashboard/urgent-actions"
import { ActiveModules } from "@/components/dashboard/active-modules"
import { ActivityTimeline } from "@/components/dashboard/activity-timeline"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Bună dimineața"
  if (hour < 18) return "Bună ziua"
  return "Bună seara"
}

export default function DashboardPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const greeting = getGreeting()
  const userName = "Andrei"

  return (
    <div className="flex h-screen bg-background">
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />

      <div
        className="flex flex-1 flex-col transition-all duration-300"
        style={{ paddingLeft: sidebarExpanded ? 240 : 68 }}
      >
        <Topbar />

        <main className="flex-1 overflow-y-auto px-6 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Panou de Control
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {greeting}, <span className="font-medium text-foreground">{userName}</span>. Iată situația actuală.
            </p>
          </div>

          {/* Row 1 — Stat Cards */}
          <StatCards />

          {/* Row 2 — Chart + Urgent Actions */}
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ComplianceChart />
            </div>
            <div className="lg:col-span-2">
              <UrgentActions />
            </div>
          </div>

          {/* Row 3 — Modules + Activity */}
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <ActiveModules />
            </div>
            <div className="lg:col-span-3">
              <ActivityTimeline />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
