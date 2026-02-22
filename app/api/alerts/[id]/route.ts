// app/api/alerts/[id]/route.ts
// PATCH: modifică statusul unei alerte (acknowledge / dismiss / resolve)
// Verifică că alerta aparține organizației utilizatorului (RLS aplicat manual)

import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

const VALID_ACTIONS = ['acknowledge', 'dismiss', 'resolve'] as const
type Action = (typeof VALID_ACTIONS)[number]

const STATUS_MAP: Record<Action, string> = {
  acknowledge: 'acknowledged',
  dismiss: 'dismissed',
  resolve: 'resolved',
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Parsează body
  const body = await request.json().catch(() => ({}))
  const action = body?.action as Action

  if (!VALID_ACTIONS.includes(action)) {
    return NextResponse.json(
      { error: `Acțiune invalidă. Valori acceptate: ${VALID_ACTIONS.join(', ')}` },
      { status: 400 }
    )
  }

  // Fetch org-urile userului pentru verificare acces
  const { data: memberships } = await supabase
    .from('memberships')
    .select('organization_id')
    .eq('user_id', user.id)

  const orgIds = memberships?.map((m) => m.organization_id).filter(Boolean) ?? []
  if (!orgIds.length) {
    return NextResponse.json({ error: 'Nicio organizație asociată' }, { status: 403 })
  }

  // Update alertă — doar dacă aparține org-ului userului
  const { data: alert, error } = await supabase
    .from('alerts')
    .update({ status: STATUS_MAP[action] })
    .eq('id', id)
    .in('organization_id', orgIds)
    .select('id, status, alert_type, title')
    .single()

  if (error || !alert) {
    return NextResponse.json(
      { error: 'Alertă negăsită sau acces refuzat' },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true, alert })
}
