"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ConversationSidebar, MobileMenuButton } from "@/components/assistant/conversation-sidebar"
import { ChatArea } from "@/components/assistant/chat-area"
import { Shield, ArrowLeft } from "lucide-react"

export default function AssistantPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [activeConversation, setActiveConversation] = useState("3")
  const [mobileConvoOpen, setMobileConvoOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Dashboard sidebar */}
      <Sidebar
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />

      {/* Content area */}
      <div
        className="flex h-screen flex-1 flex-col transition-all duration-300"
        style={{ paddingLeft: sidebarExpanded ? 240 : 68 }}
      >
        {/* Mobile top bar */}
        <div className="flex h-12 items-center gap-2 border-b border-border bg-card px-3 lg:hidden">
          <MobileMenuButton onClick={() => setMobileConvoOpen(true)} />
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <Shield className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              Asistent VA-AI
            </span>
          </div>
        </div>

        {/* Desktop top bar */}
        <div className="hidden h-12 items-center gap-3 border-b border-border bg-card px-4 lg:flex">
          <a
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Panou de Control
          </a>
          <span className="text-muted-foreground/30">/</span>
          <span className="text-xs font-medium text-foreground">
            Asistent VA-AI
          </span>
        </div>

        {/* Main split: conversations | chat */}
        <div className="flex flex-1 overflow-hidden">
          <ConversationSidebar
            activeId={activeConversation}
            onSelect={setActiveConversation}
            onNewConversation={() => setActiveConversation("new")}
            mobileOpen={mobileConvoOpen}
            onMobileClose={() => setMobileConvoOpen(false)}
          />

          <div className="flex flex-1 flex-col overflow-hidden">
            <ChatArea />
          </div>
        </div>
      </div>
    </div>
  )
}
