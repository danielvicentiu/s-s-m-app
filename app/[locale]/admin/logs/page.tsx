// app/[locale]/admin/logs/page.tsx
// System logs - monitorizare și debugging pentru consultanți

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogsClient from './LogsClient'

export default async function SystemLogsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createSupabaseServer()

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check role - doar consultanți pot vedea logs
  const { data: membership } = await supabase
    .from('memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  if (!membership || membership.role !== 'consultant') {
    redirect('/dashboard')
  }

  // Fetch system logs cu join pe profiles și organizations
  const { data: logs, error } = await supabase
    .from('system_logs')
    .select(`
      *,
      profiles(full_name, avatar_url),
      organizations(name, cui)
    `)
    .order('timestamp', { ascending: false })
    .limit(200)

  if (error) {
    console.error('Error fetching system logs:', error)
  }

  return (
    <LogsClient
      logs={logs || []}
      locale={locale}
    />
  )
}
