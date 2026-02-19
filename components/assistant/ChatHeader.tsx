// components/assistant/ChatHeader.tsx
// v0 chat header for VA-AI Assistant

import { Bot, Menu } from 'lucide-react'

interface ChatHeaderProps {
  onMobileMenuToggle?: () => void
}

export function ChatHeader({ onMobileMenuToggle }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:px-6 flex-shrink-0">
      {onMobileMenuToggle && (
        <button
          onClick={onMobileMenuToggle}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent lg:hidden"
          aria-label="Deschide conversații"
        >
          <Menu className="h-4 w-4" />
        </button>
      )}
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
        <Bot className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-foreground">VA-AI Assistant</h2>
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Online
          </span>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          Bazat pe legislația SSM/PSI/GDPR/NIS2 în vigoare
        </p>
      </div>
    </div>
  )
}
