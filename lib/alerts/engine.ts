// lib/alerts/engine.ts
// M4 Alerting Engine — config-driven, idempotent
// Generează alerte în tabelul `alerts`, loghează în `alert_logs`

import { createClient } from '@supabase/supabase-js'
import { getMedicalExpiryItems, getMedicalMissingItems } from './sources/medical'
import { getTrainingExpiryItems, getTrainingMissingItems } from './sources/training'
import { getIscirVerificationItems, getIscirAuthorizationItems } from './sources/iscir'
import type { AlertSourceItem, GenerateResult } from './engine-types'

const SPRINT1_SLUGS = [
  'medical_expiry',
  'medical_missing',
  'osh_training_expiry',
  'osh_training_missing',
  'fire_training_expiry',
  'fire_training_missing',
  'iscir_verification_expiry',
  'iscir_authorization_expiry',
] as const

const DEFAULT_ALERT_DAYS = [30, 14, 7, 3, 1, 0]

// Mapare slug detaliat → alert_type acceptat de DB constraint
const SLUG_TO_ALERT_TYPE: Record<string, string> = {
  medical_expiry:              'medical',
  medical_missing:             'medical',
  osh_training_expiry:         'training',
  osh_training_missing:        'training',
  fire_training_expiry:        'training',
  fire_training_missing:       'training',
  iscir_verification_expiry:   'equipment',
  iscir_authorization_expiry:  'equipment',
}

function toAlertType(slug: string): string {
  return SLUG_TO_ALERT_TYPE[slug] ?? 'other'
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ─── Source dispatcher ───────────────────────────────────────────────────────

async function getSourceItems(
  organizationId: string,
  slug: string,
  alertDays: number[]
): Promise<AlertSourceItem[]> {
  switch (slug) {
    case 'medical_expiry':
      return getMedicalExpiryItems(organizationId, alertDays)
    case 'medical_missing':
      return getMedicalMissingItems(organizationId)
    case 'osh_training_expiry':
      return getTrainingExpiryItems(organizationId, 'ssm', alertDays)
    case 'osh_training_missing':
      return getTrainingMissingItems(organizationId, 'ssm')
    case 'fire_training_expiry':
      return getTrainingExpiryItems(organizationId, 'psi', alertDays)
    case 'fire_training_missing':
      return getTrainingMissingItems(organizationId, 'psi')
    case 'iscir_verification_expiry':
      return getIscirVerificationItems(organizationId, alertDays)
    case 'iscir_authorization_expiry':
      return getIscirAuthorizationItems(organizationId, alertDays)
    default:
      return []
  }
}

// ─── Deduplicare in-memory ───────────────────────────────────────────────────

function isDuplicate(existing: any[], item: AlertSourceItem): boolean {
  const isMissing = item.alertType.endsWith('_missing')
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  return existing.some((e) => {
    if (e.alert_type !== toAlertType(item.alertType)) return false

    // Potrivire angajat (pt alerte per-persoană)
    if (item.employeeName !== undefined && e.employee_name !== item.employeeName) return false

    // Potrivire echipament (pt alerte per-echipament)
    if (item.itemName !== undefined && e.item_name !== item.itemName) return false

    // Pt alerte cu dată expirare: verifică data exactă
    if (!isMissing && item.expiryDate) {
      if (e.expiry_date !== item.expiryDate) return false
    }

    // Pt alerte "missing": re-alertăm doar dacă ultima alertă e mai veche de 7 zile
    if (isMissing && e.created_at) {
      if (new Date(e.created_at) < sevenDaysAgo) return false
    }

    return true
  })
}

// ─── Engine principal ────────────────────────────────────────────────────────

export async function generateAlertsForOrg(organizationId: string): Promise<GenerateResult> {
  const supabase = getSupabase()
  const result: GenerateResult = {
    organizationId,
    orgName: '',
    generated: 0,
    skipped: 0,
    errors: [],
  }

  // 1. Verifică modul 'alerte' activ
  const { data: moduleCheck } = await supabase
    .from('organization_modules')
    .select('status')
    .eq('organization_id', organizationId)
    .eq('module_key', 'alerte')
    .single()

  if (!moduleCheck || !['active', 'trial'].includes(moduleCheck.status ?? '')) {
    result.errors.push('Modulul alerte nu este activ pentru această organizație')
    return result
  }

  // 2. Fetch organizație
  const { data: org } = await supabase
    .from('organizations')
    .select('id, name, country_code, contact_email')
    .eq('id', organizationId)
    .single()

  if (!org) {
    result.errors.push('Organizație negăsită')
    return result
  }
  result.orgName = org.name

  // 3. Fetch alert_configuration (fallback la default dacă lipsește)
  const { data: config } = await supabase
    .from('alert_configurations')
    .select('*')
    .eq('organization_id', organizationId)
    .single()

  const alertDays: number[] = config?.alert_days ?? DEFAULT_ALERT_DAYS
  const emailEnabled: boolean = config?.email_enabled ?? true

  // 4. Fetch categorii active Sprint 1 pentru țara organizației
  const countryCode = org.country_code ?? 'RO'
  const { data: categories } = await supabase
    .from('alert_categories')
    .select('id, slug, notify_email')
    .eq('country_code', countryCode)
    .eq('is_active', true)
    .in('slug', SPRINT1_SLUGS)

  if (!categories?.length) {
    result.errors.push(`Nicio categorie alertă activă pentru ${countryCode}`)
    return result
  }

  // 5. Fetch alertele existente (pentru dedup in-memory)
  const { data: existingAlerts } = await supabase
    .from('alerts')
    .select('alert_type, employee_name, item_name, expiry_date, created_at')
    .eq('organization_id', organizationId)
    .not('status', 'in', '("resolved","dismissed")')

  const existing = existingAlerts ?? []

  // 6. Procesează fiecare categorie
  for (const category of categories) {
    try {
      const items = await getSourceItems(organizationId, category.slug, alertDays)

      for (const item of items) {
        // Deduplicare
        if (isDuplicate(existing, item)) {
          result.skipped++
          continue
        }

        // INSERT în alerts
        const { error: insertError } = await supabase.from('alerts').insert({
          organization_id: organizationId,
          alert_type: toAlertType(category.slug),
          title: item.title,
          description: item.description ?? null,
          expiry_date: item.expiryDate ?? null,
          employee_name: item.employeeName ?? null,
          item_name: item.itemName ?? null,
          status: 'active',
        })

        if (insertError) {
          console.error(`[engine] Insert failed ${category.slug}:`, insertError)
          result.errors.push(`${category.slug}: ${insertError.message}`)
          continue
        }

        result.generated++

        // Adaugă în existing (pt dedup intrasesiune)
        existing.push({
          alert_type: toAlertType(category.slug),
          employee_name: item.employeeName ?? null,
          item_name: item.itemName ?? null,
          expiry_date: item.expiryDate ?? null,
          created_at: new Date().toISOString(),
        })

        // Log în alert_logs cu status queued (email-ul se trimite separat de cron)
        if (emailEnabled && category.notify_email) {
          await supabase.from('alert_logs').insert({
            organization_id: organizationId,
            alert_type: category.slug,
            channel: 'email',
            recipient_email: org.contact_email,
            message_content: item.title,
            related_entity_type: category.slug,
            related_entity_id: item.sourceId,
            expiry_date: item.expiryDate ?? null,
            days_until_expiry: item.daysRemaining ?? null,
            delivery_status: 'queued',
            created_at: new Date().toISOString(),
          })
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[engine] Error processing ${category.slug}:`, err)
      result.errors.push(`${category.slug}: ${msg}`)
    }
  }

  return result
}

export async function generateAlertsForAllOrgs(): Promise<GenerateResult[]> {
  const supabase = getSupabase()

  const { data: activeModules } = await supabase
    .from('organization_modules')
    .select('organization_id, organizations(id, name)')
    .in('status', ['active', 'trial'])
    .eq('module_key', 'alerte')

  if (!activeModules?.length) return []

  const results: GenerateResult[] = []

  for (const mod of activeModules) {
    const org = Array.isArray(mod.organizations) ? mod.organizations[0] : mod.organizations
    if (!org?.id) continue

    try {
      const result = await generateAlertsForOrg(org.id)
      results.push(result)
    } catch (err) {
      console.error(`[engine] generateAlertsForOrg failed for ${org.id}:`, err)
      results.push({
        organizationId: org.id,
        orgName: org.name ?? org.id,
        generated: 0,
        skipped: 0,
        errors: [err instanceof Error ? err.message : String(err)],
      })
    }
  }

  return results
}
