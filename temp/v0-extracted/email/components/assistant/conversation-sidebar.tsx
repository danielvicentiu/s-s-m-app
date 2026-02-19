"use client"

import { useState } from "react"
import {
  Plus,
  MessageSquare,
  Search,
  X,
  Menu,
} from "lucide-react"

export interface Conversation {
  id: string
  title: string
  date: string
  preview: string
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "Verificare conformitate SSM",
    date: "Azi",
    preview: "Care sunt cerințele minime pentru...",
  },
  {
    id: "2",
    title: "Documentație PSI necesară",
    date: "Azi",
    preview: "Am nevoie de lista completă de...",
  },
  {
    id: "3",
    title: "Obligații GDPR angajator",
    date: "Ieri",
    preview: "Ce registre trebuie să mențin...",
  },
  {
    id: "4",
    title: "Instruire periodică SSM",
    date: "Ieri",
    preview: "La ce interval se face instruirea...",
  },
  {
    id: "5",
    title: "Cerințe NIS2 pentru IMM",
    date: "15 Feb",
    preview: "Compania noastră intră sub...",
  },
  {
    id: "6",
    title: "Fișa postului — inspector SSM",
    date: "14 Feb",
    preview: "Ce trebuie să conțină fișa...",
  },
  {
    id: "7",
    title: "Simulare control ITM",
    date: "12 Feb",
    preview: "Vreau să simulez un control...",
  },
]

interface ConversationSidebarProps {
  activeId: string
  onSelect: (id: string) => void
  onNewConversation: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export function ConversationSidebar({
  activeId,
  onSelect,
  onNewConversation,
  mobileOpen,
  onMobileClose,
}: ConversationSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = mockConversations.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.preview.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group by date label
  const groups: Record<string, Conversation[]> = {}
  for (const c of filtered) {
    if (!groups[c.date]) groups[c.date] = []
    groups[c.date].push(c)
  }

  const panelContent = (
    <div className="flex h-full flex-col">
      {/* New conversation */}
      <div className="p-3">
        <button
          onClick={() => {
            onNewConversation()
            onMobileClose()
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          {"Conversație Nouă"}
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Caută conversații..."
            className="h-8 w-full rounded-md border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {Object.entries(groups).map(([date, convos]) => (
          <div key={date}>
            <p className="px-2 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {date}
            </p>
            {convos.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onSelect(c.id)
                  onMobileClose()
                }}
                className={`group mb-0.5 flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                  activeId === c.id
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                <MessageSquare className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${activeId === c.id ? "text-primary" : "text-muted-foreground"}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium leading-tight">
                    {c.title}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] leading-tight text-muted-foreground">
                    {c.preview}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="px-3 pt-6 text-center text-xs text-muted-foreground">
            {"Nicio conversație găsită."}
          </p>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden h-full w-[250px] shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
        {panelContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <aside className="relative flex h-full w-[280px] flex-col bg-card shadow-xl" style={{ animation: "slideInLeft 0.2s ease-out" }}>
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <span className="text-sm font-semibold text-foreground">Conversații</span>
              <button
                onClick={onMobileClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Închide"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {panelContent}
          </aside>
        </div>
      )}
    </>
  )
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
      aria-label="Deschide conversațiile"
    >
      <Menu className="h-5 w-5" />
    </button>
  )
}
