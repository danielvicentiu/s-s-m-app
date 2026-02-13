// lib/monitoring/health-checks.ts
// Health check system pentru monitorizare servicii critice
// Verifică starea: Database (Supabase), Storage, Email (Resend), Stripe
// Export: checkDatabase, checkStorage, checkEmail, checkStripe, checkAll

import { createClient } from '@supabase/supabase-js'

// ==============================
// TYPES
// ==============================

export type HealthStatus = 'ok' | 'degraded' | 'down'

export interface ServiceHealth {
  status: HealthStatus
  responseTime: number // milliseconds
  message: string
  timestamp: string
  details?: Record<string, unknown>
}

export interface HealthReport {
  overall: HealthStatus
  services: {
    database: ServiceHealth
    storage: ServiceHealth
    email: ServiceHealth
    stripe: ServiceHealth
  }
  checkedAt: string
}

// ==============================
// HELPERS
// ==============================

function getOverallStatus(services: ServiceHealth[]): HealthStatus {
  const hasDown = services.some(s => s.status === 'down')
  const hasDegraded = services.some(s => s.status === 'degraded')

  if (hasDown) return 'down'
  if (hasDegraded) return 'degraded'
  return 'ok'
}

// ==============================
// DATABASE CHECK (Supabase)
// ==============================

export async function checkDatabase(): Promise<ServiceHealth> {
  const startTime = Date.now()

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Ping database cu query simplu
    const { error, count } = await supabase
      .from('organizations')
      .select('id', { count: 'exact', head: true })

    const responseTime = Date.now() - startTime

    if (error) {
      return {
        status: 'down',
        responseTime,
        message: `Database error: ${error.message}`,
        timestamp: new Date().toISOString(),
        details: { error: error.message, code: error.code }
      }
    }

    // Degraded dacă răspunde prea lent (> 2s)
    if (responseTime > 2000) {
      return {
        status: 'degraded',
        responseTime,
        message: `Database slow: ${responseTime}ms`,
        timestamp: new Date().toISOString(),
        details: { count }
      }
    }

    return {
      status: 'ok',
      responseTime,
      message: 'Database operational',
      timestamp: new Date().toISOString(),
      details: { count }
    }
  } catch (err) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      message: `Database unreachable: ${err instanceof Error ? err.message : 'Unknown error'}`,
      timestamp: new Date().toISOString(),
      details: { error: String(err) }
    }
  }
}

// ==============================
// STORAGE CHECK (Supabase Storage)
// ==============================

export async function checkStorage(): Promise<ServiceHealth> {
  const startTime = Date.now()

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Încearcă să listeze bucket-ul documents (standard în aplicație)
    const { data, error } = await supabase.storage.listBuckets()

    const responseTime = Date.now() - startTime

    if (error) {
      return {
        status: 'down',
        responseTime,
        message: `Storage error: ${error.message}`,
        timestamp: new Date().toISOString(),
        details: { error: error.message }
      }
    }

    // Verifică dacă bucket-urile critice există
    const criticalBuckets = ['documents', 'training-materials']
    const bucketNames = data?.map(b => b.name) || []
    const missingBuckets = criticalBuckets.filter(b => !bucketNames.includes(b))

    if (missingBuckets.length > 0) {
      return {
        status: 'degraded',
        responseTime,
        message: `Missing buckets: ${missingBuckets.join(', ')}`,
        timestamp: new Date().toISOString(),
        details: { available: bucketNames, missing: missingBuckets }
      }
    }

    if (responseTime > 2000) {
      return {
        status: 'degraded',
        responseTime,
        message: `Storage slow: ${responseTime}ms`,
        timestamp: new Date().toISOString(),
        details: { buckets: bucketNames.length }
      }
    }

    return {
      status: 'ok',
      responseTime,
      message: 'Storage operational',
      timestamp: new Date().toISOString(),
      details: { buckets: bucketNames.length }
    }
  } catch (err) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      message: `Storage unreachable: ${err instanceof Error ? err.message : 'Unknown error'}`,
      timestamp: new Date().toISOString(),
      details: { error: String(err) }
    }
  }
}

// ==============================
// EMAIL CHECK (Resend API)
// ==============================

export async function checkEmail(): Promise<ServiceHealth> {
  const startTime = Date.now()

  try {
    if (!process.env.RESEND_API_KEY) {
      return {
        status: 'down',
        responseTime: 0,
        message: 'Resend API key not configured',
        timestamp: new Date().toISOString(),
        details: { error: 'Missing RESEND_API_KEY' }
      }
    }

    // Ping Resend API - verifică status cu API Keys endpoint
    const response = await fetch('https://api.resend.com/api-keys', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const responseTime = Date.now() - startTime

    if (!response.ok) {
      const errorText = await response.text()
      return {
        status: 'down',
        responseTime,
        message: `Email service error: ${response.status} ${response.statusText}`,
        timestamp: new Date().toISOString(),
        details: { status: response.status, error: errorText }
      }
    }

    const data = await response.json()

    if (responseTime > 3000) {
      return {
        status: 'degraded',
        responseTime,
        message: `Email service slow: ${responseTime}ms`,
        timestamp: new Date().toISOString(),
        details: { keys: data?.data?.length || 0 }
      }
    }

    return {
      status: 'ok',
      responseTime,
      message: 'Email service operational',
      timestamp: new Date().toISOString(),
      details: { keys: data?.data?.length || 0 }
    }
  } catch (err) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      message: `Email service unreachable: ${err instanceof Error ? err.message : 'Unknown error'}`,
      timestamp: new Date().toISOString(),
      details: { error: String(err) }
    }
  }
}

// ==============================
// STRIPE CHECK (Stripe API)
// ==============================

export async function checkStripe(): Promise<ServiceHealth> {
  const startTime = Date.now()

  try {
    // Importăm Stripe dinamic pentru a evita erori când nu e configurat
    const Stripe = (await import('stripe')).default

    const stripeKey = process.env.STRIPE_SECRET_KEY

    if (!stripeKey) {
      // Stripe e opțional în dev, nu e critical failure
      return {
        status: 'degraded',
        responseTime: 0,
        message: 'Stripe not configured (optional in development)',
        timestamp: new Date().toISOString(),
        details: { error: 'Missing STRIPE_SECRET_KEY' }
      }
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2026-01-28.clover'
    })

    // Ping Stripe - list products (minimal request)
    const products = await stripe.products.list({ limit: 1 })

    const responseTime = Date.now() - startTime

    if (responseTime > 3000) {
      return {
        status: 'degraded',
        responseTime,
        message: `Stripe slow: ${responseTime}ms`,
        timestamp: new Date().toISOString(),
        details: { hasProducts: products.data.length > 0 }
      }
    }

    return {
      status: 'ok',
      responseTime,
      message: 'Stripe operational',
      timestamp: new Date().toISOString(),
      details: { hasProducts: products.data.length > 0 }
    }
  } catch (err) {
    // Stripe down sau invalid key
    const message = err instanceof Error ? err.message : 'Unknown error'

    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      message: `Stripe error: ${message}`,
      timestamp: new Date().toISOString(),
      details: { error: message }
    }
  }
}

// ==============================
// AGGREGATE CHECK
// ==============================

export async function checkAll(): Promise<HealthReport> {
  const checkedAt = new Date().toISOString()

  // Rulează toate check-urile în paralel pentru speed
  const [database, storage, email, stripe] = await Promise.all([
    checkDatabase(),
    checkStorage(),
    checkEmail(),
    checkStripe()
  ])

  const overall = getOverallStatus([database, storage, email, stripe])

  return {
    overall,
    services: {
      database,
      storage,
      email,
      stripe
    },
    checkedAt
  }
}
