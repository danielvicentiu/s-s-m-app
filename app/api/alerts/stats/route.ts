// app/api/alerts/stats/route.ts
// GET: statistici alerte pentru dashboard (counts by severity/type)
// Query param: organizationId (required)

import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const organizationId = searchParams.get('organizationId')
  if (!organizationId) {
    return NextResponse.json({ error: 'organizationId este obligatoriu' }, { status: 400 })
  }

  // Verifică că userul aparține organizației
  const { data: membership } = await supabase
    .from('memberships')
    .select('organization_id')
    .eq('user_id', user.id)
    .eq('organization_id', organizationId)
    .single()

  if (!membership) {
    return NextResponse.json({ error: 'Acces refuzat' }, { status: 403 })
  }

  // Fetch alertele active (non-rezolvate)
  const { data: alerts, error } = await supabase
    .from('alerts')
    .select('id, alert_type, status, expiry_date, created_at')
    .eq('organization_id', organizationId)
    .not('status', 'in', '("resolved","dismissed")')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const allAlerts = alerts ?? []
  const today = new Date().toISOString().split('T')[0]

  const expired = allAlerts.filter(
    (a) => a.expiry_date && a.expiry_date < today
  ).length

  const urgent = allAlerts.filter((a) => {
    if (!a.expiry_date || a.expiry_date < today) return false
    const days = Math.ceil(
      (new Date(a.expiry_date).getTime() - new Date(today).getTime()) / 86400000
    )
    return days <= 7
  }).length

  const warning = allAlerts.filter((a) => {
    if (!a.expiry_date || a.expiry_date < today) return false
    const days = Math.ceil(
      (new Date(a.expiry_date).getTime() - new Date(today).getTime()) / 86400000
    )
    return days > 7 && days <= 30
  }).length

  const missing = allAlerts.filter((a) => !a.expiry_date).length

  // Counts by type
  const byType: Record<string, number> = {}
  for (const a of allAlerts) {
    byType[a.alert_type] = (byType[a.alert_type] ?? 0) + 1
  }

  return NextResponse.json({
    total: allAlerts.length,
    active: allAlerts.filter((a) => a.status === 'active').length,
    acknowledged: allAlerts.filter((a) => a.status === 'acknowledged').length,
    expired,
    urgent,
    warning,
    missing,
    byType,
  })
}
