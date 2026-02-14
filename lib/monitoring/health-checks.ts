// S-S-M.RO — HEALTH CHECK SYSTEM
// Monitorizare health status pentru servicii critice: DB, Storage, Email, Stripe
// Data: 14 Februarie 2026

import { createSupabaseServer } from '@/lib/supabase/server'
import Stripe from 'stripe'

// ── TIPURI ──

export type ServiceStatus = 'ok' | 'degraded' | 'down'

export interface ServiceHealth {
  status: ServiceStatus
  responseTime?: number // ms
  message?: string
  lastChecked: string // ISO timestamp
  metadata?: Record<string, any>
}

export interface HealthReport {
  database: ServiceHealth
  storage: ServiceHealth
  email: ServiceHealth
  stripe: ServiceHealth
  overall: ServiceStatus
  timestamp: string
}

// ── CONFIGURARE ──

const TIMEOUT_MS = 5000 // 5 secunde timeout pentru fiecare check
const SLOW_RESPONSE_THRESHOLD = 1000 // 1 secundă considerată "degraded"

// ── FUNCȚII HELPER ──

/**
 * Măsoară timpul de execuție pentru un health check
 */
async function measureTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
  const start = performance.now()
  const result = await fn()
  const duration = Math.round(performance.now() - start)
  return { result, duration }
}

/**
 * Wrapper pentru timeout pe orice promisiune
 */
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Health check timeout')), timeoutMs)
  )
  return Promise.race([promise, timeoutPromise])
}

/**
 * Determină statusul pe baza response time
 */
function getStatusFromResponseTime(duration: number): ServiceStatus {
  if (duration > SLOW_RESPONSE_THRESHOLD) {
    return 'degraded'
  }
  return 'ok'
}

// ── HEALTH CHECKS INDIVIDUALE ──

/**
 * Verifică health-ul bazei de date Supabase
 * Face un query simplu pentru a testa conexiunea și response time
 */
export async function checkDatabase(): Promise<ServiceHealth> {
  const lastChecked = new Date().toISOString()

  try {
    const { result, duration } = await measureTime(async () => {
      const supabase = await createSupabaseServer()

      // Query simplu pentru test conexiune
      const { data, error } = await withTimeout(
        supabase.from('organizations').select('id').limit(1).single(),
        TIMEOUT_MS
      )

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned (ok pentru test)
        throw new Error(`Database query failed: ${error.message}`)
      }

      return { connected: true, rowCount: data ? 1 : 0 }
    })

    const status = getStatusFromResponseTime(duration)

    return {
      status,
      responseTime: duration,
      message: status === 'ok' ? 'Database operational' : 'Database responding slowly',
      lastChecked,
      metadata: {
        connected: result.connected,
        queryType: 'simple_select',
      },
    }
  } catch (error) {
    console.error('Database health check failed:', error)
    return {
      status: 'down',
      message: error instanceof Error ? error.message : 'Database connection failed',
      lastChecked,
      metadata: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    }
  }
}

/**
 * Verifică health-ul Supabase Storage
 * Lista bucket-uri pentru a testa conexiunea
 */
export async function checkStorage(): Promise<ServiceHealth> {
  const lastChecked = new Date().toISOString()

  try {
    const { result, duration } = await measureTime(async () => {
      const supabase = await createSupabaseServer()

      // Test conexiune storage prin listare bucket
      const { data, error } = await withTimeout(
        supabase.storage.listBuckets(),
        TIMEOUT_MS
      )

      if (error) {
        throw new Error(`Storage access failed: ${error.message}`)
      }

      return { buckets: data?.length || 0 }
    })

    const status = getStatusFromResponseTime(duration)

    return {
      status,
      responseTime: duration,
      message: status === 'ok' ? 'Storage operational' : 'Storage responding slowly',
      lastChecked,
      metadata: {
        bucketCount: result.buckets,
      },
    }
  } catch (error) {
    console.error('Storage health check failed:', error)
    return {
      status: 'down',
      message: error instanceof Error ? error.message : 'Storage connection failed',
      lastChecked,
      metadata: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    }
  }
}

/**
 * Verifică health-ul serviciului Resend Email
 * Folosește API key pentru a verifica conexiunea (fără trimitere email efectiv)
 */
export async function checkEmail(): Promise<ServiceHealth> {
  const lastChecked = new Date().toISOString()

  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    return {
      status: 'down',
      message: 'Resend API key not configured',
      lastChecked,
      metadata: {
        configured: false,
      },
    }
  }

  try {
    const { result, duration } = await measureTime(async () => {
      // Verifică API key prin request simplu la endpoint-ul Resend
      const response = await withTimeout(
        fetch('https://api.resend.com/emails', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }),
        TIMEOUT_MS
      )

      // 200-299 sau 404 (no emails) = API funcțional
      // 401/403 = API key invalid
      // 5xx = server down
      if (response.status >= 500) {
        throw new Error(`Resend API error: ${response.status}`)
      }

      if (response.status === 401 || response.status === 403) {
        throw new Error('Invalid Resend API key')
      }

      return {
        apiAccessible: true,
        statusCode: response.status,
      }
    })

    const status = getStatusFromResponseTime(duration)

    return {
      status,
      responseTime: duration,
      message: status === 'ok' ? 'Email service operational' : 'Email service responding slowly',
      lastChecked,
      metadata: {
        provider: 'Resend',
        configured: true,
        statusCode: result.statusCode,
      },
    }
  } catch (error) {
    console.error('Email health check failed:', error)
    return {
      status: 'down',
      message: error instanceof Error ? error.message : 'Email service unavailable',
      lastChecked,
      metadata: {
        provider: 'Resend',
        configured: true,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    }
  }
}

/**
 * Verifică health-ul serviciului Stripe
 * Face un request simplu la API pentru a testa conexiunea
 */
export async function checkStripe(): Promise<ServiceHealth> {
  const lastChecked = new Date().toISOString()

  const apiKey = process.env.STRIPE_SECRET_KEY

  if (!apiKey) {
    return {
      status: 'down',
      message: 'Stripe API key not configured',
      lastChecked,
      metadata: {
        configured: false,
      },
    }
  }

  try {
    const stripe = new Stripe(apiKey, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    })

    const { result, duration } = await measureTime(async () => {
      // Retrieve balance - endpoint rapid și lightweight pentru health check
      const balance = await withTimeout(
        stripe.balance.retrieve(),
        TIMEOUT_MS
      )

      return {
        available: balance.available?.length || 0,
        pending: balance.pending?.length || 0,
        livemode: balance.livemode,
      }
    })

    const status = getStatusFromResponseTime(duration)

    return {
      status,
      responseTime: duration,
      message: status === 'ok' ? 'Stripe operational' : 'Stripe responding slowly',
      lastChecked,
      metadata: {
        configured: true,
        livemode: result.livemode,
        balanceAvailable: result.available > 0,
      },
    }
  } catch (error) {
    console.error('Stripe health check failed:', error)
    return {
      status: 'down',
      message: error instanceof Error ? error.message : 'Stripe connection failed',
      lastChecked,
      metadata: {
        configured: true,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    }
  }
}

// ── HEALTH CHECK AGREGAT ──

/**
 * Rulează toate health check-urile și returnează raport agregat
 * Determină overall status pe baza rezultatelor individuale
 */
export async function checkAll(): Promise<HealthReport> {
  const timestamp = new Date().toISOString()

  // Rulează toate check-urile în paralel
  const [database, storage, email, stripe] = await Promise.all([
    checkDatabase(),
    checkStorage(),
    checkEmail(),
    checkStripe(),
  ])

  // Determină overall status
  const services = [database, storage, email, stripe]
  const hasDown = services.some((s) => s.status === 'down')
  const hasDegraded = services.some((s) => s.status === 'degraded')

  let overall: ServiceStatus = 'ok'
  if (hasDown) {
    overall = 'down'
  } else if (hasDegraded) {
    overall = 'degraded'
  }

  return {
    database,
    storage,
    email,
    stripe,
    overall,
    timestamp,
  }
}

/**
 * Helper pentru formatare raport în text readable (pentru logging)
 */
export function formatHealthReport(report: HealthReport): string {
  const statusEmoji = (status: ServiceStatus) => {
    switch (status) {
      case 'ok':
        return '✅'
      case 'degraded':
        return '⚠️'
      case 'down':
        return '❌'
    }
  }

  const lines = [
    `Health Report - ${new Date(report.timestamp).toLocaleString('ro-RO')}`,
    `Overall: ${statusEmoji(report.overall)} ${report.overall.toUpperCase()}`,
    '',
    `Database: ${statusEmoji(report.database.status)} ${report.database.status} (${report.database.responseTime}ms)`,
    `  ${report.database.message}`,
    '',
    `Storage: ${statusEmoji(report.storage.status)} ${report.storage.status} (${report.storage.responseTime}ms)`,
    `  ${report.storage.message}`,
    '',
    `Email: ${statusEmoji(report.email.status)} ${report.email.status} (${report.email.responseTime || 'N/A'}ms)`,
    `  ${report.email.message}`,
    '',
    `Stripe: ${statusEmoji(report.stripe.status)} ${report.stripe.status} (${report.stripe.responseTime || 'N/A'}ms)`,
    `  ${report.stripe.message}`,
  ]

  return lines.join('\n')
}

// ── EXPORT ──

export { TIMEOUT_MS, SLOW_RESPONSE_THRESHOLD }
