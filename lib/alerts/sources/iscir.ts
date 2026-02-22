// lib/alerts/sources/iscir.ts
// Surse date pentru alertele ISCIR: verificare periodică + autorizație

import { createClient } from '@supabase/supabase-js'
import type { AlertSourceItem } from '../engine-types'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export async function getIscirVerificationItems(
  organizationId: string,
  alertDays: number[]
): Promise<AlertSourceItem[]> {
  const supabase = getSupabase()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const maxDays = Math.max(...alertDays, 0)
  const cutoff = new Date(today)
  cutoff.setDate(today.getDate() + maxDays)

  const { data, error } = await supabase
    .from('iscir_equipment')
    .select('id, equipment_type, identifier, next_verification_date, location')
    .eq('organization_id', organizationId)
    .not('next_verification_date', 'is', null)
    .lte('next_verification_date', cutoff.toISOString().split('T')[0])
    .order('next_verification_date', { ascending: true })

  if (error) {
    console.error('[iscir.getIscirVerificationItems]', error)
    return []
  }

  const items: AlertSourceItem[] = []
  for (const row of data ?? []) {
    const days = daysUntil(row.next_verification_date)
    if (!alertDays.includes(days) && days > 0) continue

    const itemLabel = `${row.equipment_type ?? 'Echipament'} — ${row.identifier ?? 'N/A'}`
    items.push({
      sourceId: row.id,
      alertType: 'iscir_verification_expiry',
      title: `Verificare ISCIR expiră — ${itemLabel}`,
      description: row.location ? `Locație: ${row.location}` : undefined,
      expiryDate: row.next_verification_date,
      itemName: itemLabel,
      daysRemaining: days,
    })
  }

  return items
}

export async function getIscirAuthorizationItems(
  organizationId: string,
  alertDays: number[]
): Promise<AlertSourceItem[]> {
  const supabase = getSupabase()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const maxDays = Math.max(...alertDays, 0)
  const cutoff = new Date(today)
  cutoff.setDate(today.getDate() + maxDays)

  const { data, error } = await supabase
    .from('iscir_equipment')
    .select('id, equipment_type, identifier, authorization_expiry, location')
    .eq('organization_id', organizationId)
    .not('authorization_expiry', 'is', null)
    .lte('authorization_expiry', cutoff.toISOString().split('T')[0])
    .order('authorization_expiry', { ascending: true })

  if (error) {
    console.error('[iscir.getIscirAuthorizationItems]', error)
    return []
  }

  const items: AlertSourceItem[] = []
  for (const row of data ?? []) {
    const days = daysUntil(row.authorization_expiry)
    if (!alertDays.includes(days) && days > 0) continue

    const itemLabel = `${row.equipment_type ?? 'Echipament'} — ${row.identifier ?? 'N/A'}`
    items.push({
      sourceId: row.id,
      alertType: 'iscir_authorization_expiry',
      title: `Autorizare ISCIR expiră — ${itemLabel}`,
      description: row.location ? `Locație: ${row.location}` : undefined,
      expiryDate: row.authorization_expiry,
      itemName: itemLabel,
      daysRemaining: days,
    })
  }

  return items
}
