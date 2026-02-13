// ============================================================
// S-S-M.RO — Training Detail Client Component
// File: app/[locale]/dashboard/training/[id]/TrainingDetailClient.tsx
// ============================================================
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import {
  CATEGORY_CONFIG,
  VERIFICATION_CONFIG,
  type TrainingSession,
  type TrainingModule,
  type VerificationResult,
  type TrainingCategory,
} from '@/lib/training-types'

interface Props {
  session: TrainingSession & {
    training_modules: TrainingModule
    organizations: { id: string; name: string; cui: string | null }
  }
  worker: {
    id: string
    full_name: string
    job_title: string | null
    email: string | null
  } | null
  assignment: any
  documents: any[]
  user: { id: string; email: string }
}

export default function TrainingDetailClient({
  session,
  worker,
  assignment,
  documents,
  user,
}: Props) {
  const router = useRouter()
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const module = session.training_modules
  const organization = session.organizations

  // Calculate status badge variant based on verification result
  const getVerificationBadge = (result: VerificationResult) => {
    if (result === 'admis') return 'success'
    if (result === 'respins') return 'danger'
    return 'warning'
  }

  // Handle PDF generation
  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true)
    try {
      // TODO: Implement PDF generation API call
      // await fetch('/api/training/generate-fisa', {
      //   method: 'POST',
      //   body: JSON.stringify({ sessionId: session.id })
      // })
      alert('Funcția de generare PDF va fi implementată în curând.')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Eroare la generarea PDF-ului')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Format duration from minutes to hours:minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}min`
    }
    return `${mins} min`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* HEADER */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            ← Înapoi la Lista Instruiri
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Detaliu Instruire: {module.title}
              </h1>
              <p className="text-gray-600">
                {organization.name} {organization.cui ? `• CUI ${organization.cui}` : ''}
              </p>
            </div>
            <button
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
            >
              {isGeneratingPDF ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generare...
                </>
              ) : (
                <>
                  📄 Generare PDF Fișă
                </>
              )}
            </button>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* GENERAL INFORMATION */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-blue-600">📋</span>
                Informații Generale
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Cod Modul" value={module.code} />
                <InfoItem label="Categorie">
                  <Badge
                    label={CATEGORY_CONFIG[module.category]?.label || module.category}
                    variant="info"
                  />
                </InfoItem>
                <InfoItem label="Tip Instruire" value={formatTrainingType(module.training_type)} />
                <InfoItem
                  label="Data Sesiunii"
                  value={new Date(session.session_date).toLocaleDateString('ro-RO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                />
                <InfoItem label="Instructor" value={session.instructor_name} />
                <InfoItem label="Durata" value={formatDuration(session.duration_minutes)} />
                <InfoItem
                  label="Durata Minimă Necesară"
                  value={formatDuration(module.duration_minutes_required)}
                />
                <InfoItem label="Limba" value={formatLanguage(session.language)} />
                {session.location && <InfoItem label="Locație" value={session.location} />}
              </div>

              {/* Tematică / Descriere */}
              {module.description && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Tematică</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{module.description}</p>
                </div>
              )}

              {/* Legal Basis */}
              {module.legal_basis && module.legal_basis.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Bază Legală</h3>
                  <div className="flex flex-wrap gap-2">
                    {module.legal_basis.map((basis, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg font-medium"
                      >
                        {basis}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PARTICIPANT INFORMATION */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-blue-600">👤</span>
                Participant
              </h2>

              {worker ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900">{worker.full_name}</p>
                      {worker.job_title && (
                        <p className="text-sm text-gray-600 mt-1">{worker.job_title}</p>
                      )}
                      {worker.email && (
                        <p className="text-sm text-gray-500 mt-1">{worker.email}</p>
                      )}
                    </div>
                    <div>
                      <Badge
                        label={assignment?.status === 'completed' ? 'Prezent' : 'Absent'}
                        variant={assignment?.status === 'completed' ? 'success' : 'danger'}
                        dot
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Nu s-au găsit informații despre participant.</p>
              )}
            </div>

            {/* EVALUATION RESULTS */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-blue-600">📊</span>
                Rezultate Evaluare
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Rezultat Verificare</p>
                  <Badge
                    label={VERIFICATION_CONFIG[session.verification_result]?.label || 'Pending'}
                    variant={getVerificationBadge(session.verification_result) as any}
                    size="md"
                    dot
                  />
                </div>

                {session.test_score !== null && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Scor Test</p>
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-3xl font-bold ${
                            session.test_score >= (module.min_pass_score || 70)
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {session.test_score}%
                        </span>
                        <span className="text-sm text-gray-500">
                          (min. necesar: {module.min_pass_score || 70}%)
                        </span>
                      </div>
                    </div>

                    {session.test_questions_total && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Răspunsuri Corecte</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {session.test_questions_correct || 0} / {session.test_questions_total}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Scor Vizual</p>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            session.test_score >= (module.min_pass_score || 70)
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${session.test_score}%` }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ATTACHED DOCUMENTS */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-blue-600">📎</span>
                Documente Atașate
              </h2>

              {documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📄</span>
                        <div>
                          <p className="font-medium text-gray-900">{doc.file_name}</p>
                          <p className="text-xs text-gray-500">
                            Generat: {new Date(doc.created_at).toLocaleDateString('ro-RO')}
                          </p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                        Descarcă
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm mb-4">
                    Nu există documente generate pentru această instruire.
                  </p>
                  <button
                    onClick={handleGeneratePDF}
                    disabled={isGeneratingPDF}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium"
                  >
                    Generează Fișă PDF
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Metadata & Quick Stats */}
          <div className="space-y-6">
            {/* QUICK STATS */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Statistici Rapide</h3>
              <div className="space-y-4">
                <StatItem
                  icon="⏱"
                  label="Durata Efectivă"
                  value={formatDuration(session.duration_minutes)}
                />
                <StatItem
                  icon="📝"
                  label="Întrebări Test"
                  value={session.test_questions_total?.toString() || 'N/A'}
                />
                <StatItem
                  icon="✓"
                  label="Răspunsuri Corecte"
                  value={session.test_questions_correct?.toString() || 'N/A'}
                />
                <StatItem
                  icon="🎯"
                  label="Scor Final"
                  value={session.test_score ? `${session.test_score}%` : 'N/A'}
                />
              </div>
            </div>

            {/* METADATA */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Metadata</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">ID Sesiune</p>
                  <p className="text-gray-900 font-mono text-xs mt-1 break-all">{session.id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Creat la</p>
                  <p className="text-gray-900 mt-1">
                    {new Date(session.created_at).toLocaleDateString('ro-RO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {session.updated_at && session.updated_at !== session.created_at && (
                  <div>
                    <p className="text-gray-600">Modificat la</p>
                    <p className="text-gray-900 mt-1">
                      {new Date(session.updated_at).toLocaleDateString('ro-RO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}
                {session.fisa_generated_at && (
                  <div>
                    <p className="text-gray-600">Fișă Generată</p>
                    <p className="text-gray-900 mt-1">
                      {new Date(session.fisa_generated_at).toLocaleDateString('ro-RO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* QUICKVALID INFO (if available) */}
            {session.quickvalid_timestamp && (
              <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <span>🔐</span>
                  QuickValid Verificare
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-blue-700">Timestamp</p>
                    <p className="text-blue-900 font-medium mt-1">
                      {new Date(session.quickvalid_timestamp).toLocaleString('ro-RO')}
                    </p>
                  </div>
                  {session.quickvalid_confidence && (
                    <div>
                      <p className="text-blue-700">Confidență</p>
                      <p className="text-blue-900 font-medium mt-1">
                        {session.quickvalid_confidence}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// HELPER COMPONENTS
// ============================================================

function InfoItem({
  label,
  value,
  children,
}: {
  label: string
  value?: string
  children?: React.ReactNode
}) {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      {children || <p className="text-gray-900 font-medium">{value || '—'}</p>}
    </div>
  )
}

function StatItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  )
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function formatTrainingType(type: string): string {
  const types: Record<string, string> = {
    introductiv_general: 'Introductiv General',
    la_locul_de_munca: 'La Locul de Muncă',
    periodic: 'Periodic',
    suplimentar: 'Suplimentar',
    psi: 'PSI',
    situatii_urgenta: 'Situații de Urgență',
    custom: 'Custom',
  }
  return types[type] || type
}

function formatLanguage(lang: string): string {
  const languages: Record<string, string> = {
    ro: 'Română',
    en: 'English',
    ne: 'Nepali',
    hi: 'Hindi',
    bn: 'Bengali',
    ar: 'Arabic',
    tr: 'Turkish',
    bg: 'Български',
    hu: 'Magyar',
    de: 'Deutsch',
  }
  return languages[lang] || lang.toUpperCase()
}
