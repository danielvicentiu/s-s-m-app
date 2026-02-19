// app/[locale]/(manager)/dashboard/ai-kb/page.tsx
// AI Knowledge Base — Server Component

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AIKBClient from './AIKBClient'

export const metadata = {
  title: 'Baza de Cunoștințe AI | s-s-m.ro',
  description: 'Import și căutare conversații exportate din Claude AI',
}

interface AIKBPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ org?: string; q?: string }>
}

export default async function AIKBPage({ params, searchParams }: AIKBPageProps) {
  await params
  const { q: initialQuery, org: selectedOrgId } = await searchParams

  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { orgs } = await getCurrentUserOrgs()
  const organizations = (orgs || [])
    .map((m: Record<string, unknown>) => {
      const org = m.organization as Record<string, unknown> | null
      return { id: String(org?.id || ''), name: String(org?.name || '') }
    })
    .filter(o => o.id)

  const activeOrgId = selectedOrgId && organizations.find(o => o.id === selectedOrgId)
    ? selectedOrgId
    : organizations[0]?.id || ''

  // Fetch recent conversations server-side
  const { data: recentConversations } = await supabase
    .from('ai_conversations')
    .select('id, title, updated_at, created_at, organization_id')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(30)

  // Fetch total stats
  const { count: totalConversations } = await supabase
    .from('ai_conversations')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: totalArtifacts } = await supabase
    .from('ai_artifacts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <AIKBClient
      userId={user.id}
      organizations={organizations}
      activeOrgId={activeOrgId}
      initialConversations={recentConversations || []}
      initialQuery={initialQuery || ''}
      stats={{
        totalConversations: totalConversations || 0,
        totalArtifacts: totalArtifacts || 0,
      }}
    />
  )
}
