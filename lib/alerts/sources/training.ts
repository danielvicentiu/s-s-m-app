// lib/alerts/sources/training.ts
// Surse date pentru alertele de instruire SSM/PSI: expirări + lipsă instruire

import { createClient } from '@supabase/supabase-js'
import type { AlertSourceItem } from '../engine-types'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getTrainingExpiryItems(
  organizationId: string,
  category: 'ssm' | 'psi',
  alertDays: number[]
): Promise<AlertSourceItem[]> {
  const supabase = getSupabase()
  const maxDays = Math.max(...alertDays, 0)

  // training_dashboard are days_until_due pre-calculat
  const { data, error } = await supabase
    .from('training_dashboard')
    .select('assignment_id, worker_id, worker_name, module_title, category, next_due_date, days_until_due, status')
    .eq('organization_id', organizationId)
    .eq('category', category)
    .neq('status', 'completed')
    .not('next_due_date', 'is', null)
    .lte('days_until_due', maxDays)

  if (error) {
    console.error('[training.getTrainingExpiryItems]', error)
    return []
  }

  const alertType = category === 'psi' ? 'fire_training_expiry' : 'osh_training_expiry'
  const label = category === 'psi' ? 'Instruire PSI' : 'Instruire SSM'

  const items: AlertSourceItem[] = []
  for (const row of data ?? []) {
    const days: number = row.days_until_due ?? 0
    if (!alertDays.includes(days) && days > 0) continue

    items.push({
      sourceId: row.assignment_id,
      alertType,
      title: `${label} expiră — ${row.worker_name ?? 'Angajat'}`,
      description: row.module_title ? `Modul: ${row.module_title}` : undefined,
      expiryDate: row.next_due_date,
      employeeName: row.worker_name ?? undefined,
      daysRemaining: days,
    })
  }

  return items
}

export async function getTrainingMissingItems(
  organizationId: string,
  category: 'ssm' | 'psi'
): Promise<AlertSourceItem[]> {
  const supabase = getSupabase()

  const [{ data: employees }, { data: withTraining }] = await Promise.all([
    supabase
      .from('employees')
      .select('id, full_name')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .is('termination_date', null),
    supabase
      .from('training_dashboard')
      .select('worker_id')
      .eq('organization_id', organizationId)
      .eq('category', category)
      .not('worker_id', 'is', null),
  ])

  if (!employees?.length) return []

  const employeesWithTraining = new Set(withTraining?.map((a) => a.worker_id) ?? [])
  const alertType = category === 'psi' ? 'fire_training_missing' : 'osh_training_missing'
  const label = category === 'psi' ? 'Instruire PSI' : 'Instruire SSM'

  return employees
    .filter((emp) => !employeesWithTraining.has(emp.id))
    .map((emp) => ({
      sourceId: emp.id,
      alertType,
      title: `${label} lipsă — ${emp.full_name}`,
      description: `Angajat activ fără instruire ${category.toUpperCase()} atribuită`,
      employeeName: emp.full_name,
    }))
}
