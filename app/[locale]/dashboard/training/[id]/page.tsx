// app/[locale]/dashboard/training/[id]/page.tsx
// Training Detail Server Component — Full training session details
// 🆕 OP-LEGO Sprint 4.7: ModuleGate wrapping (modulul 'ssm' necesar)

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TrainingDetailClient from './TrainingDetailClient'
import ModuleGate from '@/components/ModuleGate'

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const supabase = await createSupabaseServer()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch training session with all related data
  const { data: session, error: sessionError } = await supabase
    .from('training_sessions')
    .select(
      `
      *,
      training_modules (
        id,
        code,
        title,
        description,
        category,
        training_type,
        legal_basis,
        duration_minutes_required,
        min_pass_score,
        available_languages
      ),
      organizations (
        id,
        name,
        cui
      )
    `
    )
    .eq('id', id)
    .single()

  if (sessionError || !session) {
    redirect('/dashboard/training')
  }

  // Get the worker (employee) who completed this training
  const { data: worker } = await supabase
    .from('employees')
    .select('id, full_name, job_title, email')
    .eq('id', session.worker_id)
    .single()

  // Get all participants for this session (if group training)
  // For now, we'll just get the assignment linked to this session
  const { data: assignment } = await supabase
    .from('training_assignments')
    .select('*, employees(id, full_name, job_title, email)')
    .eq('session_id', id)
    .single()

  // Get any documents attached to this training
  const { data: documents } = await supabase
    .from('generated_documents')
    .select('*')
    .eq('generation_context->>session_id', id)
    .eq('document_type', 'fisa_instruire')
    .order('created_at', { ascending: false })

  return (
    <ModuleGate orgId={session.organization_id} moduleKey="ssm" locale={locale}>
      <TrainingDetailClient
        session={session}
        worker={worker}
        assignment={assignment}
        documents={documents || []}
        user={{ id: user.id, email: user.email || '' }}
      />
    </ModuleGate>
  )
}
