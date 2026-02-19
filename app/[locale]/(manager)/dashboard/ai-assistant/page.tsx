// app/[locale]/dashboard/ai-assistant/page.tsx
// VA-AI Assistant page — Server Component

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AIAssistantClient from './AIAssistantClient'

export const metadata = {
  title: 'VA-AI Assistant SSM | s-s-m.ro',
  description: 'Asistent virtual pentru securitate și sănătate în muncă'
}

export default async function AIAssistantPage({
  searchParams
}: {
  searchParams: Promise<{ org?: string }>
}) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { orgs } = await getCurrentUserOrgs()
  const resolvedSearchParams = await searchParams
  const selectedOrgId = resolvedSearchParams.org

  // Get organization list
  const organizations = (orgs || [])
    .map((m: Record<string, unknown>) => {
      const org = m.organization as Record<string, unknown> | null
      return {
        id: String(org?.id || ''),
        name: String(org?.name || '')
      }
    })
    .filter((o) => o.id)

  // Determine active org
  const activeOrgId = selectedOrgId && selectedOrgId !== 'all' && organizations.find(o => o.id === selectedOrgId)
    ? selectedOrgId
    : organizations[0]?.id || ''

  // Fetch recent conversations server-side
  let recentConversations: Array<{ id: string; title: string | null; updated_at: string; organization_id: string }> = []

  if (activeOrgId) {
    const { data } = await supabase
      .from('ai_conversations')
      .select('id, title, updated_at, organization_id')
      .eq('user_id', user.id)
      .eq('organization_id', activeOrgId)
      .order('updated_at', { ascending: false })
      .limit(20)

    recentConversations = data || []
  }

  return (
    <AIAssistantClient
      userId={user.id}
      organizations={organizations}
      activeOrgId={activeOrgId}
      initialConversations={recentConversations}
    />
  )
}
