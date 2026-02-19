import { FileText, ExternalLink } from "lucide-react"

export interface SourceChip {
  label: string
  href?: string
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: SourceChip[]
  timestamp: string
}

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
          VA
        </div>
      )}

      <div className={`max-w-[75%] min-w-0 ${isUser ? "items-end" : "items-start"}`}>
        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "rounded-br-md bg-primary text-primary-foreground"
              : "rounded-bl-md border border-border bg-muted/60 text-foreground"
          }`}
        >
          {message.content.split("\n").map((line, i) => (
            <p key={i} className={i > 0 ? "mt-1.5" : ""}>
              {line}
            </p>
          ))}
        </div>

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {message.sources.map((s, i) => (
              <a
                key={i}
                href={s.href || "#"}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
              >
                <FileText className="h-3 w-3" />
                {s.label}
                <ExternalLink className="h-2.5 w-2.5 opacity-50" />
              </a>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p
          className={`mt-1 text-[10px] text-muted-foreground/60 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {message.timestamp}
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
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-muted/60 px-4 py-3">
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "0ms" }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "150ms" }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  )
}
