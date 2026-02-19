'use client'

// components/assistant/ConversationSidebar.tsx
// v0 conversation sidebar - adapted for real data from existing API

import { useState } from 'react'
import { Plus, MessageSquare, Search, X } from 'lucide-react'

interface Conversation {
  id: string
  title: string | null
  updated_at: string
  organization_id: string
}

interface ConversationSidebarProps {
  conversations: Conversation[]
  activeConversationId?: string
  onSelect: (conv: Conversation) => void
  onNewConversation: () => void
  onDelete: (convId: string, e: React.MouseEvent) => void
  mobileOpen: boolean
  onMobileClose: () => void
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  } catch {
    return iso
  }
}

export function ConversationSidebar({
  conversations,
  activeConversationId,
  onSelect,
  onNewConversation,
  onDelete,
  mobileOpen,
  onMobileClose,
}: ConversationSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = conversations.filter((c) =>
    (c.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const panelContent = (
    <div className="flex h-full flex-col">
      {/* New conversation */}
      <div className="p-3">
        <button
          onClick={() => { onNewConversation(); onMobileClose() }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Conversație Nouă
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
        {filtered.length === 0 ? (
          <p className="px-3 pt-6 text-center text-xs text-muted-foreground">
            {searchQuery ? 'Nicio conversație găsită.' : 'Nicio conversație anterioară.\nÎncepe una nouă!'}
          </p>
        ) : (
          filtered.map((conv) => (
            <button
              key={conv.id}
              onClick={() => { onSelect(conv); onMobileClose() }}
              className={`group mb-0.5 flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                activeConversationId === conv.id ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent'
              }`}
            >
              <MessageSquare className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${activeConversationId === conv.id ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium leading-tight">{conv.title || 'Conversație'}</p>
                <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{formatDate(conv.updated_at)}</p>
              </div>
              <button
                onClick={(e) => onDelete(conv.id, e)}
                className="opacity-0 group-hover:opacity-100 flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-destructive transition-all"
                title="Șterge"
              >
                <X className="h-3 w-3" />
              </button>
            </button>
          ))
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
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="relative flex h-full w-[280px] flex-col bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <span className="text-sm font-semibold text-foreground">Conversații</span>
              <button
                onClick={onMobileClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
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
