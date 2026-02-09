// lib/dashboard-helpers.ts
// Helpers dinamici pentru dashboard — citesc din tabelele de configurare

import { createSupabaseServer } from './supabase/server'
import { createSupabaseBrowser } from './supabase/client'
import { getCountryFromLocale } from './country-utils'
import type { EquipmentType, AlertCategory, ObligationType } from './types'

/**
 * Fetch equipment types pentru o țară (server-side)
 */
export async function getEquipmentTypesForCountry(countryCode: string) {
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from('equipment_types')
    .select('*')
    .eq('country_code', countryCode)
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching equipment types:', error)
    return []
  }

  return (data as EquipmentType[]) || []
}

/**
 * Fetch equipment types pentru o țară (client-side)
 */
export async function getEquipmentTypesForCountryClient(countryCode: string) {
  const supabase = createSupabaseBrowser()

  const { data, error } = await supabase
    .from('equipment_types')
    .select('*')
    .eq('country_code', countryCode)
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching equipment types:', error)
    return []
  }

  return (data as EquipmentType[]) || []
}

/**
 * Fetch alert categories pentru o țară (server-side)
 */
export async function getAlertCategoriesForCountry(countryCode: string) {
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from('alert_categories')
    .select('*, obligation_types(*)')
    .eq('country_code', countryCode)
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching alert categories:', error)
    return []
  }

  return (data as AlertCategory[]) || []
}

/**
 * Fetch toate alert categories (toate țările) — pentru cron job
 */
export async function getAllAlertCategories() {
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('alert_categories')
    .select('*, obligation_types(*)')
    .eq('is_active', true)
    .order('country_code', { ascending: true })
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching all alert categories:', error)
    return []
  }

  return (data as AlertCategory[]) || []
}

/**
 * Fetch obligation types pentru o țară (server-side)
 */
export async function getObligationTypesForCountry(countryCode: string) {
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from('obligation_types')
    .select('*')
    .eq('country_code', countryCode)
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching obligation types:', error)
    return []
  }

  return (data as ObligationType[]) || []
}

/**
 * Helper pentru formatare tip echipament dinamic (fallback pe hardcoded dacă lipsește din DB)
 */
export function formatEquipmentType(type: string, equipmentTypes: EquipmentType[]): string {
  // Încearcă să găsească în DB
  const found = equipmentTypes.find(et =>
    et.name.toLowerCase() === type.toLowerCase() ||
    et.id === type
  )

  if (found) return found.name

  // Fallback pe mapare hardcodată (backward compatibility)
  const fallback: Record<string, string> = {
    stingator: 'Stingător',
    trusa_prim_ajutor: 'Trusă prim ajutor',
    hidrant: 'Hidrant',
    detector_fum: 'Detector fum',
    detector_gaz: 'Detector gaz',
    iluminat_urgenta: 'Iluminat urgență',
    panou_semnalizare: 'Panou semnalizare',
    trusa_scule: 'Trusă scule',
    eip: 'EIP',
    altul: 'Altul',
  }

  return fallback[type] || type
}

/**
 * Calculează urgency din zile rămase și alert_category config
 */
export function calculateAlertUrgency(
  daysLeft: number,
  alertCategory: AlertCategory
): 'info' | 'warning' | 'critical' | 'expired' {
  if (daysLeft <= 0) return 'expired'
  if (daysLeft <= alertCategory.critical_days_before) return 'critical'
  if (daysLeft <= alertCategory.warning_days_before) return 'warning'
  return 'info'
}
