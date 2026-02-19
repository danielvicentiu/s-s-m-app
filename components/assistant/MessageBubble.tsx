// components/assistant/MessageBubble.tsx
// v0 message bubble design for VA-AI Assistant

import Link from 'next/link'
import { FileText, ExternalLink } from 'lucide-react'

export interface Source {
  act_title?: string
  act_id?: string
  label?: string
  href?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  sources?: Source[]
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  const formattedTime = (() => {
    try {
      const d = new Date(message.timestamp)
      if (isNaN(d.getTime())) return message.timestamp
      return d.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return message.timestamp
    }
  })()

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
          VA
        </div>
      )}

      <div className={`max-w-[78%] min-w-0 ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'rounded-br-md bg-primary text-primary-foreground'
            : 'rounded-bl-md border border-border bg-card text-foreground shadow-sm'
        }`}>
          {message.content.split('\n').map((line, i) => (
            <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{line}</p>
          ))}
        </div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {message.sources.map((s, i) => {
              const label = s.label || s.act_title || 'Sursă'
              const href = s.href || (s.act_id ? `/admin/legal-acts/${s.act_id}` : '#')
              return (
                <Link
                  key={i}
                  href={href}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <FileText className="h-3 w-3" />
                  <span className="max-w-[140px] truncate">{label}</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </Link>
              )
            })}
          </div>
        )}

        <p className={`text-[10px] text-muted-foreground/60 ${isUser ? 'text-right' : 'text-left'}`}>
          {formattedTime}
        </p>
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
        VA
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3 shadow-sm">
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: '0ms' }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: '150ms' }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}
