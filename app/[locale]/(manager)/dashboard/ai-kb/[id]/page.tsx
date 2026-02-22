// app/[locale]/(manager)/dashboard/ai-kb/[id]/page.tsx
// AI Knowledge Base — Conversation detail (Server Component)

import { createSupabaseServer } from '@/lib/supabase/server'
import { isSuperAdmin } from '@/lib/rbac'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Brain, Code2, MessageSquare } from 'lucide-react'
import type { Metadata } from 'next'

interface StoredMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

interface Artifact {
  id: string
  artifact_type: string
  title: string
  content: string
  language: string | null
}

interface PageProps {
  params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createSupabaseServer()
  const { data } = await supabase
    .from('ai_conversations')
    .select('title')
    .eq('id', id)
    .single()
  return {
    title: data?.title ? `${data.title} | AI-KB | s-s-m.ro` : 'Conversație AI | s-s-m.ro',
  }
}

export default async function AIKBConversationPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = await isSuperAdmin()
  if (!admin) redirect('/dashboard')

  const { data: conversation, error } = await supabase
    .from('ai_conversations')
    .select('id, title, messages, created_at, updated_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !conversation) notFound()

  const { data: artifactsData } = await supabase
    .from('ai_artifacts')
    .select('id, artifact_type, title, content, language')
    .eq('conversation_id', id)
    .order('id')

  const messages: StoredMessage[] = Array.isArray(conversation.messages)
    ? (conversation.messages as StoredMessage[])
    : []

  const artifacts: Artifact[] = (artifactsData || []) as Artifact[]

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-1">
      {/* Back + Header */}
      <div>
        <Link
          href="/dashboard/ai-kb"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Înapoi la Baza de Cunoștințe
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <Brain className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 leading-snug">
              {conversation.title || 'Conversație fără titlu'}
            </h1>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-3">
              <span>
                {new Date(conversation.created_at).toLocaleDateString('ro-RO', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {messages.length} mesaje
              </span>
              {artifacts.length > 0 && (
                <span className="flex items-center gap-1">
                  <Code2 className="h-3 w-3" />
                  {artifacts.length} artefacte
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center py-16 text-center">
          <MessageSquare className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">Această conversație nu conține mesaje.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {msg.role === 'user' ? 'U' : 'AI'}
              </div>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                }`}
              >
                <pre
                  className={`whitespace-pre-wrap font-sans leading-relaxed text-sm ${
                    msg.role === 'user' ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {msg.content}
                </pre>
                {msg.timestamp && (
                  <p
                    className={`text-[10px] mt-2 ${
                      msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString('ro-RO', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Artifacts */}
      {artifacts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-purple-600" />
              Artefacte extrase ({artifacts.length})
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Blocuri de cod extrase din răspunsurile asistentului
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {artifacts.map((art) => (
              <div key={art.id} className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-600 uppercase tracking-wide">
                    {art.language || art.artifact_type}
                  </span>
                  <span className="text-sm font-medium text-gray-700 truncate">{art.title}</span>
                </div>
                <pre className="text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl p-4 overflow-x-auto max-h-72 overflow-y-auto font-mono leading-relaxed">
                  {art.content}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
