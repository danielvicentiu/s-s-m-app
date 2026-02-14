// app/[locale]/admin/legal-publish/page.tsx
// M5 Publishing — Admin page
// Obligații aprobate → Preview matching → Override → Publish

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LegalPublishClient from './LegalPublishClient'

export default async function LegalPublishPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  // Fetch approved obligations (unpublished = not in organization_obligations for ALL orgs)
  const { data: approvedObligations } = await supabase
    .from('legal_obligations')
    .select(`
      id, article_ref, obligation_type, description, severity, confidence, review_status,
      legal_acts!inner(id, act_type, act_number, act_year, act_full_name, act_short_name, country_code, domain)
    `)
    .eq('review_status', 'approved')
    .order('created_at', { ascending: false })

  // Fetch organizations
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui, country_code, caen_code, industry_domain, county')
    .order('name')

  // Fetch recent publish batches
  const { data: recentBatches } = await supabase
    .from('publish_batches')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(10)

  // Fetch already published counts per obligation
  const { data: publishedCounts } = await supabase
    .from('organization_obligations')
    .select('obligation_id')

  // Build a map: obligation_id -> count of orgs it's published to
  const publishedMap: Record<string, number> = {}
  ;(publishedCounts || []).forEach((pc: any) => {
    publishedMap[pc.obligation_id] = (publishedMap[pc.obligation_id] || 0) + 1
  })

  return (
    <LegalPublishClient
      obligations={approvedObligations || []}
      organizations={organizations || []}
      recentBatches={recentBatches || []}
      publishedMap={publishedMap}
      locale={locale}
      userId={user.id}
    />
  )
}
