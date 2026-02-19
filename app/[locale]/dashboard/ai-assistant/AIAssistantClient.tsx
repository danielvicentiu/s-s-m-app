'use client'

// app/[locale]/dashboard/ai-assistant/AIAssistantClient.tsx
// VA-AI: Main chat interface with RAG, org context, compliance checker, ITM simulation

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Source {
  act_title: string
  act_id: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  sources?: Source[]
}

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

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-bold">AI</span>
      </div>
      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return iso
  }
}

export default function AIAssistantClient({ organizations, activeOrgId: initialOrgId, initialConversations }: Props) {
  const [selectedOrgId, setSelectedOrgId] = useState(initialOrgId)
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

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
    setInputValue('')
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

  // Send a message
  const sendMessage = async (messageText?: string) => {
    const text = (messageText || inputValue).trim()
    if (!text || isLoading || !selectedOrgId) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationId: activeConversationId,
          organizationId: selectedOrgId
        })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Eroare la server')
      }

      const data = await res.json()

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        sources: data.sources || []
      }

      setMessages(prev => [...prev, assistantMessage])

      // Update conversation tracking
      if (data.conversationId && data.conversationId !== activeConversationId) {
        setActiveConversationId(data.conversationId)
        // Add to sidebar list if new
        const newConv: Conversation = {
          id: data.conversationId,
          title: text.slice(0, 60) + (text.length > 60 ? '...' : ''),
          updated_at: new Date().toISOString(),
          organization_id: selectedOrgId
        }
        setConversations(prev => {
          const exists = prev.find(c => c.id === data.conversationId)
          if (exists) return prev
          return [newConv, ...prev]
        })
      } else if (data.conversationId) {
        // Update the updated_at of existing conversation
        setConversations(prev => prev.map(c =>
          c.id === data.conversationId
            ? { ...c, updated_at: new Date().toISOString() }
            : c
        ))
      }
    } catch (error) {
      const errMessage: ChatMessage = {
        role: 'assistant',
        content: `⚠️ Eroare: ${error instanceof Error ? error.message : 'Nu am putut procesa cererea.'}`,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickActions = [
    { label: '🔍 Verifică Conformitatea', message: 'Verifică conformitatea organizației mele' },
    { label: '📋 Simulare Control ITM', message: 'Simulează un control ITM pentru firma mea' },
    { label: '📊 Rezumat Situație', message: 'Care este situația generală a firmei mele?' }
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={startNewConversation}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Conversație Nouă
        </button>
      </div>

      {/* Org selector */}
      {organizations.length > 1 && (
        <div className="px-4 py-3 border-b border-gray-200">
          <label className="block text-xs font-medium text-gray-500 mb-1">Organizație</label>
          <select
            value={selectedOrgId}
            onChange={e => {
              setSelectedOrgId(e.target.value)
              startNewConversation()
            }}
            className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {organizations.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {conversations.length === 0 ? (
          <p className="text-xs text-gray-400 text-center px-4 py-6">
            Nicio conversație anterioară.<br />Începe una nouă!
          </p>
        ) : (
          <div className="space-y-1">
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => loadConversation(conv)}
                className={`group flex items-start gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                  activeConversationId === conv.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{conv.title || 'Conversație'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(conv.updated_at)}</p>
                </div>
                <button
                  onClick={e => deleteConversation(conv.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-red-500 transition-all"
                  title="Șterge"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-[calc(100vh-8rem)] -mx-4 sm:-mx-6 lg:-mx-8 -my-6">
      {/* Mobile sidebar overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Left sidebar — desktop always visible, mobile slide-in */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
          w-64 bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:flex-shrink-0
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <SidebarContent />
      </aside>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        {/* Chat header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* VA-AI avatar + title */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">VA-AI Assistant</h1>
            <p className="text-xs text-gray-500">Asistent SSM/PSI cu legislație actualizată</p>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-4">
                <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Bun venit la VA-AI!</h2>
              <p className="text-sm text-gray-500 max-w-sm mb-6">
                Sunt asistentul virtual pentru SSM și PSI. Pot verifica conformitatea organizației,
                simula un control ITM sau răspunde la întrebări despre legislația în vigoare.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
                {quickActions.map(action => (
                  <button
                    key={action.label}
                    onClick={() => sendMessage(action.message)}
                    disabled={isLoading}
                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm text-gray-700 hover:text-blue-700 disabled:opacity-50"
                  >
                    <span className="text-xl">{action.label.split(' ')[0]}</span>
                    <span className="text-xs font-medium text-center leading-tight">
                      {action.label.slice(action.label.indexOf(' ') + 1)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-end gap-2 mb-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
              )}

              <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                {/* Bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Sources */}
                {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {msg.sources.map((source, sIdx) => (
                      <Link
                        key={sIdx}
                        href={`/admin/legal-acts/${source.act_id}`}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors border border-blue-200"
                      >
                        <span>📄</span>
                        <span className="max-w-[150px] truncate">{source.act_title}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <p className="text-xs text-gray-400 px-1">
                  {formatDate(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
          {/* Quick actions (shown when there are messages) */}
          {messages.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {quickActions.map(action => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.message)}
                  disabled={isLoading}
                  className="flex-shrink-0 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-blue-50 hover:text-blue-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Text input row */}
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Întrebați despre legislația SSM, verificări de conformitate..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32 overflow-y-auto"
              style={{ lineHeight: '1.5' }}
              onInput={e => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = Math.min(target.scrollHeight, 128) + 'px'
              }}
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !inputValue.trim()}
              className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              {isLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            VA-AI poate face greșeli. Verificați informațiile importante cu un specialist SSM.
          </p>
        </div>
      </div>
    </div>
  )
}
