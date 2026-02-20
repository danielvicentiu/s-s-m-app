'use client'

// app/[locale]/(manager)/dashboard/ai-kb/AIKBClient.tsx
// AI Knowledge Base — Upload, search, results

import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  Upload, Search, Brain, MessageSquare, Code2,
  FileJson, Loader2, CheckCircle, AlertCircle, X,
  ChevronRight, BookOpen,
} from 'lucide-react'

interface Conversation {
  id: string
  title: string | null
  updated_at: string
  created_at: string
  organization_id: string
  snippet?: string
}

interface Stats {
  totalConversations: number
  totalArtifacts: number
}

interface ImportResult {
  imported: number
  artifacts: number
  total: number
  errors: string[]
}

interface Props {
  userId: string
  organizations: Array<{ id: string; name: string }>
  activeOrgId: string
  initialConversations: Conversation[]
  initialQuery: string
  stats: Stats
}

export default function AIKBClient({
  organizations,
  activeOrgId: initialOrgId,
  initialConversations,
  initialQuery,
  stats: initialStats,
}: Props) {
  const t = useTranslations('aiKnowledgeBase')
  const [selectedOrgId, setSelectedOrgId] = useState(initialOrgId)
  const [query, setQuery] = useState(initialQuery)
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [stats, setStats] = useState<Stats>(initialStats)
  const [searching, setSearching] = useState(false)
  const [totalResults, setTotalResults] = useState(0)

  // Upload state
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [importError, setImportError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Search handler
  const doSearch = useCallback(async (q: string) => {
    setSearching(true)
    try {
      const res = await fetch(`/api/ai-kb/search?q=${encodeURIComponent(q)}&per_page=30`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setConversations(data.conversations || [])
      setTotalResults(data.total || 0)
    } catch {
      // keep existing results on error
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    if (query.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => doSearch(query), 350)
    } else if (query.trim().length === 0) {
      setConversations(initialConversations)
      setTotalResults(initialStats.totalConversations)
    }
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    }
  }, [query, doSearch, initialConversations, initialStats.totalConversations])

  // File processing
  const processFile = async (file: File) => {
    if (!file.name.endsWith('.json')) {
      setImportError(t('selectJsonFile'))
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      setImportError(t('fileTooLarge'))
      return
    }

    setUploading(true)
    setImportError(null)
    setImportResult(null)

    try {
      const text = await file.text()
      let parsed: unknown
      try {
        parsed = JSON.parse(text)
      } catch {
        setImportError(t('invalidJson'))
        setUploading(false)
        return
      }

      // Claude export can be an array at root or { conversations: [...] }
      let conversationsArray: unknown[]
      if (Array.isArray(parsed)) {
        conversationsArray = parsed
      } else if (
        parsed &&
        typeof parsed === 'object' &&
        'conversations' in parsed &&
        Array.isArray((parsed as Record<string, unknown>).conversations)
      ) {
        conversationsArray = (parsed as Record<string, unknown>).conversations as unknown[]
      } else {
        setImportError(t('unknownFormat'))
        setUploading(false)
        return
      }

      const res = await fetch('/api/ai-kb/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversations: conversationsArray,
          organization_id: selectedOrgId,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setImportError(data.error || t('importError'))
      } else {
        setImportResult(data)
        // Refresh stats
        setStats(prev => ({
          totalConversations: prev.totalConversations + data.imported,
          totalArtifacts: prev.totalArtifacts + data.artifacts,
        }))
        // Refresh list
        doSearch('')
      }
    } catch (e) {
      setImportError(e instanceof Error ? e.message : t('unknownError'))
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Baza de Cunoștințe AI
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Importă și caută în conversațiile exportate din Claude.ai
          </p>
        </div>

        {/* Org selector */}
        {organizations.length > 1 && (
          <select
            value={selectedOrgId}
            onChange={e => setSelectedOrgId(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {organizations.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <MessageSquare className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalConversations}</p>
            <p className="text-xs text-gray-500">Conversații importate</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
            <Code2 className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalArtifacts}</p>
            <p className="text-xs text-gray-500">Artefacte extrase</p>
          </div>
        </div>
      </div>

      {/* Upload zone */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileJson className="h-4 w-4 text-blue-600" />
            Import Export Claude.ai
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Exportă conversațiile din Claude.ai (Settings → Export Data) și încarcă fișierul <code className="bg-gray-100 px-1 rounded">conversations.json</code>
          </p>
        </div>

        <div className="p-6">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : uploading
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />

            {uploading ? (
              <>
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-3" />
                <p className="text-sm font-medium text-gray-700">Se procesează fișierul...</p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-700">
                  Trage fișierul JSON aici sau <span className="text-blue-600">alege din calculator</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">conversations.json · max 50 MB</p>
              </>
            )}
          </div>

          {/* Import result */}
          {importResult && (
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-green-50 border border-green-200 p-4">
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-800">
                  Import finalizat: {importResult.imported} conversații, {importResult.artifacts} artefacte
                  {importResult.total > importResult.imported && (
                    <span className="text-green-600"> (din {importResult.total} total)</span>
                  )}
                </p>
                {importResult.errors.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    {importResult.errors.length} erori ignorate.
                  </p>
                )}
              </div>
              <button onClick={() => setImportResult(null)}>
                <X className="h-4 w-4 text-green-600" />
              </button>
            </div>
          )}

          {/* Import error */}
          {importError && (
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 flex-1">{importError}</p>
              <button onClick={() => setImportError(null)}>
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search + Results */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Caută în conversații..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
            )}
          </div>
        </div>

        <div>
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="h-10 w-10 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">
                {query.length >= 2
                  ? `Niciun rezultat pentru „${query}"`
                  : t('noConversations')}
              </p>
            </div>
          ) : (
            <>
              {query.length >= 2 && (
                <div className="px-6 py-2 border-b border-gray-50 bg-gray-50">
                  <p className="text-xs text-gray-500">
                    {totalResults} {totalResults === 1 ? 'rezultat' : 'rezultate'} pentru „{query}"
                  </p>
                </div>
              )}
              <ul className="divide-y divide-gray-100">
                {conversations.map(conv => (
                  <li key={conv.id}>
                    <Link
                      href={`/dashboard/ai-kb/${conv.id}`}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conv.title || t('untitledConversation')}
                        </p>
                        {conv.snippet ? (
                          <p className="text-xs text-gray-400 truncate mt-0.5">{conv.snippet}</p>
                        ) : (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(conv.updated_at).toLocaleDateString('ro-RO', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
