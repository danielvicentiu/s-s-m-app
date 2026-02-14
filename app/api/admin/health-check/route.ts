// S-S-M.RO — HEALTH CHECK API ENDPOINT
// GET: Runs all health checks, returns JSON report with status per service
// Auth: super_admin OR CRON_SECRET header
// Cache: 60 seconds
// Data: 14 Februarie 2026

import { NextResponse } from 'next/server'
import { isSuperAdmin } from '@/lib/rbac'
import { checkAll } from '@/lib/monitoring/health-checks'
import type { HealthReport } from '@/lib/monitoring/health-checks'

// ── CACHE ──
// In-memory cache pentru a evita check-uri repetate în 60s
let cachedReport: HealthReport | null = null
let cacheTimestamp: number | null = null
const CACHE_TTL_MS = 60 * 1000 // 60 secunde

/**
 * Returnează raport din cache dacă e valid (< 60s vechi)
 */
function getCachedReport(): HealthReport | null {
  if (!cachedReport || !cacheTimestamp) return null

  const now = Date.now()
  const age = now - cacheTimestamp

  if (age > CACHE_TTL_MS) {
    // Cache expirat
    cachedReport = null
    cacheTimestamp = null
    return null
  }

  return cachedReport
}

/**
 * Salvează raport în cache
 */
function setCachedReport(report: HealthReport): void {
  cachedReport = report
  cacheTimestamp = Date.now()
}

/**
 * Verifică autorizare: fie super_admin, fie CRON_SECRET header
 */
async function isAuthorized(request: Request): Promise<boolean> {
  // 1. Verifică CRON_SECRET header (pentru cron jobs Vercel)
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    return true
  }

  // 2. Verifică dacă e super_admin
  try {
    const admin = await isSuperAdmin()
    return admin
  } catch (error) {
    console.error('Health check auth error:', error)
    return false
  }
}

// ── API HANDLER ──

/**
 * GET /api/admin/health-check
 * Rulează toate health checks și returnează raport JSON
 *
 * Auth: super_admin SAU Authorization: Bearer CRON_SECRET
 * Cache: 60 secunde in-memory
 *
 * Response:
 * {
 *   "database": { "status": "ok", "responseTime": 45, "message": "...", ... },
 *   "storage": { "status": "ok", "responseTime": 123, "message": "...", ... },
 *   "email": { "status": "ok", "responseTime": 234, "message": "...", ... },
 *   "stripe": { "status": "ok", "responseTime": 156, "message": "...", ... },
 *   "overall": "ok",
 *   "timestamp": "2026-02-14T10:30:00.000Z",
 *   "cached": false,
 *   "cacheAge": 0
 * }
 */
export async function GET(request: Request) {
  try {
    // Verifică autorizare
    const authorized = await isAuthorized(request)

    if (!authorized) {
      return NextResponse.json(
        { error: 'Unauthorized - super_admin or CRON_SECRET required' },
        { status: 403 }
      )
    }

    // Verifică cache
    const cached = getCachedReport()
    if (cached) {
      const cacheAge = cacheTimestamp ? Date.now() - cacheTimestamp : 0

      return NextResponse.json(
        {
          ...cached,
          cached: true,
          cacheAge: Math.round(cacheAge / 1000), // secunde
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'private, max-age=60',
            'X-Cache-Status': 'HIT',
          },
        }
      )
    }

    // Rulează toate health checks
    const report = await checkAll()

    // Salvează în cache
    setCachedReport(report)

    // Determină HTTP status code bazat pe overall health
    let statusCode = 200
    if (report.overall === 'degraded') {
      statusCode = 200 // Still OK, but degraded
    } else if (report.overall === 'down') {
      statusCode = 503 // Service Unavailable
    }

    return NextResponse.json(
      {
        ...report,
        cached: false,
        cacheAge: 0,
      },
      {
        status: statusCode,
        headers: {
          'Cache-Control': 'private, max-age=60',
          'X-Cache-Status': 'MISS',
        },
      }
    )

  } catch (error) {
    console.error('Health check endpoint error:', error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
        overall: 'down',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
