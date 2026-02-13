// S-S-M.RO — STRIPE USAGE-BASED BILLING METERING SERVICE
// Urmărire și raportare utilizare resurse pe organizație pentru billing Stripe
// Data: 13 Februarie 2026

import Stripe from 'stripe'
import { createSupabaseServer } from '@/lib/supabase/server'
import type { SubscriptionPlan } from './stripe-lifecycle'

// ── CONFIGURARE STRIPE ──

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-01-28.clover',
  typescript: true,
})

// ── PLAN LIMITS & THRESHOLDS ──

export interface PlanLimits {
  employees: number
  documentsPerMonth: number
  storageGB: number
  meterEvents: {
    employees: string    // Stripe meter event ID
    documents: string
    storage: string
  }
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  starter: {
    employees: 50,
    documentsPerMonth: 100,
    storageGB: 5,
    meterEvents: {
      employees: process.env.STRIPE_METER_EMPLOYEES_STARTER || 'mtr_employees_starter',
      documents: process.env.STRIPE_METER_DOCUMENTS_STARTER || 'mtr_documents_starter',
      storage: process.env.STRIPE_METER_STORAGE_STARTER || 'mtr_storage_starter',
    },
  },
  professional: {
    employees: 200,
    documentsPerMonth: 500,
    storageGB: 20,
    meterEvents: {
      employees: process.env.STRIPE_METER_EMPLOYEES_PRO || 'mtr_employees_pro',
      documents: process.env.STRIPE_METER_DOCUMENTS_PRO || 'mtr_documents_pro',
      storage: process.env.STRIPE_METER_STORAGE_PRO || 'mtr_storage_pro',
    },
  },
  enterprise: {
    employees: 999999, // Unlimited
    documentsPerMonth: 999999,
    storageGB: 200,
    meterEvents: {
      employees: process.env.STRIPE_METER_EMPLOYEES_ENT || 'mtr_employees_ent',
      documents: process.env.STRIPE_METER_DOCUMENTS_ENT || 'mtr_documents_ent',
      storage: process.env.STRIPE_METER_STORAGE_ENT || 'mtr_storage_ent',
    },
  },
}

// ── TIPURI ──

export interface UsageMetrics {
  employeeCount: number
  documentsGenerated: number
  storageUsedGB: number
  periodStart: Date
  periodEnd: Date
}

export interface UsageSummary {
  organizationId: string
  plan: SubscriptionPlan
  currentUsage: UsageMetrics
  limits: PlanLimits
  utilizationPercent: {
    employees: number
    documents: number
    storage: number
  }
  isOverLimit: {
    employees: boolean
    documents: boolean
    storage: boolean
  }
}

export interface TrackResult {
  success: boolean
  meterEventId?: string
  error?: string
}

export interface ReportResult {
  success: boolean
  eventsReported: number
  error?: string
}

// ── FUNCȚII HELPER ──

/**
 * Obține planul și customer ID Stripe pentru o organizație
 */
async function getOrganizationPlan(organizationId: string): Promise<{
  plan: SubscriptionPlan
  customerId: string | null
  subscriptionId: string | null
} | null> {
  const supabase = await createSupabaseServer()

  const { data: org, error } = await supabase
    .from('organizations')
    .select('plan_type, stripe_customer_id, stripe_subscription_id')
    .eq('id', organizationId)
    .single()

  if (error || !org) {
    console.error('Error fetching organization plan:', error)
    return null
  }

  return {
    plan: (org.plan_type as SubscriptionPlan) || 'starter',
    customerId: org.stripe_customer_id,
    subscriptionId: org.stripe_subscription_id,
  }
}

/**
 * Calculează perioada de facturare curentă
 */
function getCurrentBillingPeriod(): { start: Date; end: Date } {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

  return { start, end }
}

/**
 * Convertește bytes în GB
 */
function bytesToGB(bytes: number): number {
  return Math.round((bytes / 1024 / 1024 / 1024) * 100) / 100
}

// ── FUNCȚII TRACKING ──

/**
 * Urmărește numărul de angajați activi pentru o organizație
 * Se apelează când se adaugă/șterge un angajat
 */
export async function trackEmployeeCount(
  organizationId: string,
  employeeCount: number
): Promise<TrackResult> {
  try {
    const orgPlan = await getOrganizationPlan(organizationId)
    if (!orgPlan || !orgPlan.customerId) {
      return { success: false, error: 'Organization or customer not found' }
    }

    const limits = PLAN_LIMITS[orgPlan.plan]
    const meterEventName = limits.meterEvents.employees

    // Creează meter event în Stripe
    const meterEvent = await stripe.billing.meterEvents.create({
      event_name: meterEventName,
      payload: {
        value: employeeCount.toString(),
        stripe_customer_id: orgPlan.customerId,
      },
      identifier: `${organizationId}_employees_${Date.now()}`,
      timestamp: Math.floor(Date.now() / 1000),
    })

    // Log în Supabase pentru audit
    const supabase = await createSupabaseServer()
    await supabase.from('usage_logs').insert({
      organization_id: organizationId,
      metric_type: 'employee_count',
      metric_value: employeeCount,
      stripe_meter_event_id: meterEvent.identifier,
      logged_at: new Date().toISOString(),
    })

    return {
      success: true,
      meterEventId: meterEvent.identifier,
    }
  } catch (error) {
    console.error('Error tracking employee count:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Urmărește generarea unui document
 * Se apelează când se generează un document nou
 */
export async function trackDocumentsGenerated(
  organizationId: string,
  documentCount: number = 1
): Promise<TrackResult> {
  try {
    const orgPlan = await getOrganizationPlan(organizationId)
    if (!orgPlan || !orgPlan.customerId) {
      return { success: false, error: 'Organization or customer not found' }
    }

    const limits = PLAN_LIMITS[orgPlan.plan]
    const meterEventName = limits.meterEvents.documents

    // Creează meter event în Stripe
    const meterEvent = await stripe.billing.meterEvents.create({
      event_name: meterEventName,
      payload: {
        value: documentCount.toString(),
        stripe_customer_id: orgPlan.customerId,
      },
      identifier: `${organizationId}_documents_${Date.now()}`,
      timestamp: Math.floor(Date.now() / 1000),
    })

    // Log în Supabase pentru audit
    const supabase = await createSupabaseServer()
    await supabase.from('usage_logs').insert({
      organization_id: organizationId,
      metric_type: 'documents_generated',
      metric_value: documentCount,
      stripe_meter_event_id: meterEvent.identifier,
      logged_at: new Date().toISOString(),
    })

    return {
      success: true,
      meterEventId: meterEvent.identifier,
    }
  } catch (error) {
    console.error('Error tracking documents generated:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Urmărește utilizarea storage-ului (în bytes)
 * Se apelează periodic sau când se uploadează/șterge un fișier mare
 */
export async function trackStorageUsed(
  organizationId: string,
  storageBytes: number
): Promise<TrackResult> {
  try {
    const orgPlan = await getOrganizationPlan(organizationId)
    if (!orgPlan || !orgPlan.customerId) {
      return { success: false, error: 'Organization or customer not found' }
    }

    const storageGB = bytesToGB(storageBytes)
    const limits = PLAN_LIMITS[orgPlan.plan]
    const meterEventName = limits.meterEvents.storage

    // Creează meter event în Stripe (trimite în GB)
    const meterEvent = await stripe.billing.meterEvents.create({
      event_name: meterEventName,
      payload: {
        value: Math.ceil(storageGB).toString(), // Rotunjim în sus
        stripe_customer_id: orgPlan.customerId,
      },
      identifier: `${organizationId}_storage_${Date.now()}`,
      timestamp: Math.floor(Date.now() / 1000),
    })

    // Log în Supabase pentru audit
    const supabase = await createSupabaseServer()
    await supabase.from('usage_logs').insert({
      organization_id: organizationId,
      metric_type: 'storage_used',
      metric_value: storageGB,
      stripe_meter_event_id: meterEvent.identifier,
      logged_at: new Date().toISOString(),
    })

    return {
      success: true,
      meterEventId: meterEvent.identifier,
    }
  } catch (error) {
    console.error('Error tracking storage usage:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// ── FUNCȚII RAPORTARE ──

/**
 * Raportează toate metrici de utilizare la Stripe pentru o organizație
 * Se apelează periodic (cron job zilnic/săptămânal)
 */
export async function reportUsageToStripe(organizationId: string): Promise<ReportResult> {
  try {
    const supabase = await createSupabaseServer()
    const orgPlan = await getOrganizationPlan(organizationId)

    if (!orgPlan || !orgPlan.customerId) {
      return { success: false, error: 'Organization or customer not found', eventsReported: 0 }
    }

    let eventsReported = 0

    // 1. Raportează numărul curent de angajați
    const { count: employeeCount } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .is('deleted_at', null)

    if (employeeCount !== null) {
      const result = await trackEmployeeCount(organizationId, employeeCount)
      if (result.success) eventsReported++
    }

    // 2. Raportează numărul de documente generate în luna curentă
    const { start, end } = getCurrentBillingPeriod()
    const { count: documentCount } = await supabase
      .from('generated_documents')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())

    if (documentCount !== null && documentCount > 0) {
      const result = await trackDocumentsGenerated(organizationId, documentCount)
      if (result.success) eventsReported++
    }

    // 3. Raportează utilizarea storage-ului
    const { data: documents } = await supabase
      .from('generated_documents')
      .select('file_size_bytes')
      .eq('organization_id', organizationId)

    if (documents && documents.length > 0) {
      const totalBytes = documents.reduce((sum, doc) => sum + (doc.file_size_bytes || 0), 0)
      if (totalBytes > 0) {
        const result = await trackStorageUsed(organizationId, totalBytes)
        if (result.success) eventsReported++
      }
    }

    return {
      success: true,
      eventsReported,
    }
  } catch (error) {
    console.error('Error reporting usage to Stripe:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      eventsReported: 0,
    }
  }
}

/**
 * Obține un sumar complet al utilizării pentru o organizație
 * Include metrici curente, limite, și utilizare procentuală
 */
export async function getUsageSummary(organizationId: string): Promise<UsageSummary | null> {
  try {
    const supabase = await createSupabaseServer()
    const orgPlan = await getOrganizationPlan(organizationId)

    if (!orgPlan) {
      return null
    }

    const limits = PLAN_LIMITS[orgPlan.plan]
    const { start, end } = getCurrentBillingPeriod()

    // 1. Număr angajați activi
    const { count: employeeCount } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .is('deleted_at', null)

    // 2. Documente generate în luna curentă
    const { count: documentCount } = await supabase
      .from('generated_documents')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())

    // 3. Storage utilizat
    const { data: documents } = await supabase
      .from('generated_documents')
      .select('file_size_bytes')
      .eq('organization_id', organizationId)

    const totalBytes = documents?.reduce((sum, doc) => sum + (doc.file_size_bytes || 0), 0) || 0
    const storageGB = bytesToGB(totalBytes)

    // Calculează utilizare procentuală
    const currentEmployees = employeeCount || 0
    const currentDocuments = documentCount || 0

    const employeeUtilization = Math.min(100, Math.round((currentEmployees / limits.employees) * 100))
    const documentUtilization = Math.min(100, Math.round((currentDocuments / limits.documentsPerMonth) * 100))
    const storageUtilization = Math.min(100, Math.round((storageGB / limits.storageGB) * 100))

    return {
      organizationId,
      plan: orgPlan.plan,
      currentUsage: {
        employeeCount: currentEmployees,
        documentsGenerated: currentDocuments,
        storageUsedGB: storageGB,
        periodStart: start,
        periodEnd: end,
      },
      limits,
      utilizationPercent: {
        employees: employeeUtilization,
        documents: documentUtilization,
        storage: storageUtilization,
      },
      isOverLimit: {
        employees: currentEmployees > limits.employees,
        documents: currentDocuments > limits.documentsPerMonth,
        storage: storageGB > limits.storageGB,
      },
    }
  } catch (error) {
    console.error('Error getting usage summary:', error)
    return null
  }
}

/**
 * Verifică dacă o organizație a depășit limitele planului său
 * Returnează array de limitări depășite
 */
export async function checkUsageLimits(
  organizationId: string
): Promise<{ exceeded: string[]; warnings: string[] }> {
  const summary = await getUsageSummary(organizationId)

  if (!summary) {
    return { exceeded: [], warnings: [] }
  }

  const exceeded: string[] = []
  const warnings: string[] = []

  // Verifică depășiri (100%+)
  if (summary.isOverLimit.employees) {
    exceeded.push('employees')
  }
  if (summary.isOverLimit.documents) {
    exceeded.push('documents')
  }
  if (summary.isOverLimit.storage) {
    exceeded.push('storage')
  }

  // Verifică avertizări (80%+)
  if (summary.utilizationPercent.employees >= 80 && !summary.isOverLimit.employees) {
    warnings.push('employees')
  }
  if (summary.utilizationPercent.documents >= 80 && !summary.isOverLimit.documents) {
    warnings.push('documents')
  }
  if (summary.utilizationPercent.storage >= 80 && !summary.isOverLimit.storage) {
    warnings.push('storage')
  }

  return { exceeded, warnings }
}

// ── EXPORT ──

export {
  stripe,
  PLAN_LIMITS,
}
