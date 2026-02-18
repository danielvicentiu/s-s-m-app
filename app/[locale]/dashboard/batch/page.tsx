// app/[locale]/dashboard/batch/page.tsx
// M6 BATCH PROCESSING — Dashboard batch jobs (server component)
// Fetches last 20 jobs and passes to BatchPageClient
// Data: 18 Februarie 2026

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BatchPageClient from './BatchPageClient'
import type { BatchJob } from '@/components/dashboard/BatchJobCard'

export default async function BatchPage() {
  const supabase = await createSupabaseServer()
  const { user } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  const { data: jobs } = await supabase
    .from('batch_jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <BatchPageClient
      user={{ id: user.id, email: user.email ?? '' }}
      initialJobs={(jobs ?? []) as BatchJob[]}
    />
  )
}
