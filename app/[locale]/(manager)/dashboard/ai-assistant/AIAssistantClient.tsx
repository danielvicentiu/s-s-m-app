'use client'

// app/[locale]/dashboard/ai-assistant/AIAssistantClient.tsx
// VA-AI: v0 UI design + 100% existing API logic preserved
// Anthropic calls, RAG legislativ, conversation history, system prompt

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { ConversationSidebar } from '@/components/assistant/ConversationSidebar'
import { ChatHeader } from '@/components/assistant/ChatHeader'
import { MessageBubble, TypingIndicator } from '@/components/assistant/MessageBubble'
import { QuickActions } from '@/components/assistant/QuickActions'
import { ChatInput } from '@/components/assistant/ChatInput'
import type { ChatMessage } from '@/components/assistant/MessageBubble'
import { Bot } from 'lucide-react'

interface Conversation {
  id: string
  title: string | null
  updated_at: string
  organization_id: string
}

interface Props {
  userId: string
  organizations: Array<{ id: string; name: string }>
  activeOrgId: string
  initialConversations: Conversation[]
}

export default function AIAssistantClient({
  userId,
  organizations,
  activeOrgId: initialOrgId,
  initialConversations,
}: Props) {
  const t = useTranslations('aiAssistant')
  const [selectedOrgId, setSelectedOrgId] = useState(initialOrgId)
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

  // Start new conversation
  const startNewConversation = () => {
    setActiveConversationId(undefined)
    setMessages([])
    setIsMobileSidebarOpen(false)
  }

  // Load a conversation
  const loadConversation = async (conv: Conversation) => {
    try {
      const res = await fetch(`/api/ai-assistant/conversations/${conv.id}?organization_id=${selectedOrgId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.messages) {
          setMessages(data.messages)
          setActiveConversationId(conv.id)
          setIsMobileSidebarOpen(false)
          return
        }
      }
    } catch {
      // Fallback: just set the conversation ID and show empty (will load on next message)
    }
    setActiveConversationId(conv.id)
    setMessages([])
    setIsMobileSidebarOpen(false)
  }

  // Delete a conversation
  const deleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await fetch(`/api/ai-assistant/conversations?id=${convId}`, { method: 'DELETE' })
      setConversations(prev => prev.filter(c => c.id !== convId))
      if (activeConversationId === convId) {
        startNewConversation()
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  // Send a message — FULL API LOGIC PRESERVED
  const sendMessage = async (messageText?: string) => {
    const text = (messageText || '').trim()
    if (!text || isLoading || !selectedOrgId) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationId: activeConversationId,
          organizationId: selectedOrgId,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || t('serverError'))
      }

      const data = await res.json()

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        sources: data.sources || [],
      }

      setMessages(prev => [...prev, assistantMessage])

      // Update conversation tracking
      if (data.conversationId && data.conversationId !== activeConversationId) {
        setActiveConversationId(data.conversationId)
        const newConv: Conversation = {
          id: data.conversationId,
          title: text.slice(0, 60) + (text.length > 60 ? '...' : ''),
          updated_at: new Date().toISOString(),
          organization_id: selectedOrgId,
        }
        setConversations(prev => {
          const exists = prev.find(c => c.id === data.conversationId)
          if (exists) return prev
          return [newConv, ...prev]
        })
      } else if (data.conversationId) {
        setConversations(prev =>
          prev.map(c =>
            c.id === data.conversationId
              ? { ...c, updated_at: new Date().toISOString() }
              : c
          )
        )
      }
    } catch (error) {
      const errMessage: ChatMessage = {
        role: 'assistant',
        content: `⚠️ Eroare: ${error instanceof Error ? error.message : t('errorProcessing')}`,
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] -mx-4 sm:-mx-6 lg:-mx-8 -my-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Conversation Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelect={loadConversation}
        onNewConversation={startNewConversation}
        onDelete={deleteConversation}
        mobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Org selector (if multiple orgs) — visible above sidebar on desktop */}
      {organizations.length > 1 && (
        <div className="hidden lg:block absolute top-0 left-0 w-[250px] border-b border-border bg-card px-3 py-2 z-10">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            {t('orgLabel')}
          </label>
          <select
            value={selectedOrgId}
            onChange={e => {
              setSelectedOrgId(e.target.value)
              startNewConversation()
            }}
            className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {organizations.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex flex-1 flex-col min-w-0 bg-background">
        {/* Chat Header */}
        <ChatHeader onMobileMenuToggle={() => setIsMobileSidebarOpen(true)} />

        {/* Messages area */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-4 py-4 lg:px-6"
        >
          {messages.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-4">
                <Bot className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Bun venit la VA-AI!</h2>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                Sunt asistentul virtual pentru SSM și PSI. Pot verifica conformitatea organizației,
                simula un control ITM sau răspunde la întrebări despre legislația în vigoare.
              </p>
              {/* Org selector for mobile */}
              {organizations.length > 1 && (
                <div className="mb-4 w-full max-w-xs lg:hidden">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">{t('orgLabel')}</label>
                  <select
                    value={selectedOrgId}
                    onChange={e => { setSelectedOrgId(e.target.value); startNewConversation() }}
                    className="w-full text-sm border border-border rounded-lg px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {/* Quick actions in empty state */}
              <QuickActions onAction={sendMessage} disabled={isLoading || !selectedOrgId} />
            </div>
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              {messages.map((msg, idx) => (
                <MessageBubble key={idx} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Quick actions (shown when there are messages) */}
        {messages.length > 0 && (
          <QuickActions onAction={sendMessage} disabled={isLoading} />
        )}

        {/* Chat Input */}
        <ChatInput onSend={sendMessage} disabled={isLoading || !selectedOrgId} />
      </div>
    </div>
  )
}
