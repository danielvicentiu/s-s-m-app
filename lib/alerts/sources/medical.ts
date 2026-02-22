// lib/alerts/sources/medical.ts
// Surse date pentru alertele medicale: expirări + lipsă fișă medicală

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

export async function getMedicalExpiryItems(
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
    .from('medical_examinations')
    .select('id, employee_name, expiry_date, examination_type')
    .eq('organization_id', organizationId)
    .lte('expiry_date', cutoff.toISOString().split('T')[0])
    .order('expiry_date', { ascending: true })

  if (error) {
    console.error('[medical.getMedicalExpiryItems]', error)
    return []
  }

  const items: AlertSourceItem[] = []
  for (const row of data ?? []) {
    const days = daysUntil(row.expiry_date)
    if (!alertDays.includes(days) && days > 0) continue

    items.push({
      sourceId: row.id,
      alertType: 'medical_expiry',
      title: `Fișă medicală expiră — ${row.employee_name ?? 'Angajat'}`,
      description: row.examination_type ? `Tip: ${row.examination_type}` : undefined,
      expiryDate: row.expiry_date,
      employeeName: row.employee_name ?? undefined,
      daysRemaining: days,
    })
  }

  return items
}

export async function getMedicalMissingItems(
  organizationId: string
): Promise<AlertSourceItem[]> {
  const supabase = getSupabase()
  const today = new Date().toISOString().split('T')[0]

  const [{ data: employees }, { data: withExams }] = await Promise.all([
    supabase
      .from('employees')
      .select('id, full_name')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .is('termination_date', null),
    supabase
      .from('medical_examinations')
      .select('employee_id')
      .eq('organization_id', organizationId)
      .gte('expiry_date', today)
      .not('employee_id', 'is', null),
  ])

  if (!employees?.length) return []

  const employeesWithExams = new Set(withExams?.map((e) => e.employee_id) ?? [])

  return employees
    .filter((emp) => !employeesWithExams.has(emp.id))
    .map((emp) => ({
      sourceId: emp.id,
      alertType: 'medical_missing',
      title: `Fișă medicală lipsă — ${emp.full_name}`,
      description: 'Angajat activ fără examen medical valid',
      employeeName: emp.full_name,
    }))
}
