// ============================================================
// S-S-M.RO — API Route: Dashboard Statistics
// Endpoint: /api/stats
// Cache: 5 minutes (pentru optimizare query-uri agregate)
// ============================================================

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase client cu service role pentru bypass RLS
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, serviceRoleKey)
}

// ============================================================
// Tipuri
// ============================================================

interface StatsResponse {
  totalEmployees: number
  activeEmployees: number
  activeTrainings: number
  expiredTrainings: number
  pendingMedical: number
  expiredMedical: number
  equipmentDueInspection: number
  complianceScore: number
  generatedAt: string
}

// ============================================================
// Cache în memorie (5 minute)
// ============================================================

interface CacheEntry {
  data: StatsResponse
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()
const CACHE_DURATION_MS = 5 * 60 * 1000 // 5 minute

function getCacheKey(organizationId: string): string {
  return `stats:${organizationId}`
}

function getCachedStats(organizationId: string): StatsResponse | null {
  const key = getCacheKey(organizationId)
  const entry = cache.get(key)

  if (!entry) return null

  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return null
  }

  return entry.data
}

function setCachedStats(organizationId: string, stats: StatsResponse): void {
  const key = getCacheKey(organizationId)
  cache.set(key, {
    data: stats,
    expiresAt: Date.now() + CACHE_DURATION_MS
  })
}

// ============================================================
// GET /api/stats
// Query params: organization_id (required)
// ============================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organization_id')

    // Validare organization_id obligatoriu
    if (!organizationId) {
      return NextResponse.json(
        { error: 'organization_id este obligatoriu' },
        { status: 400 }
      )
    }

    // Verificare cache
    const cachedStats = getCachedStats(organizationId)
    if (cachedStats) {
      return NextResponse.json({
        success: true,
        data: cachedStats,
        fromCache: true
      })
    }

    const supabase = getSupabase()
    const today = new Date().toISOString().split('T')[0]
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]

    // ============================================================
    // Query 1: Total și angajați activi
    // ============================================================
    const [employeesResult, activeEmployeesResult] = await Promise.all([
      supabase
        .from('employees')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId),

      supabase
        .from('employees')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .eq('is_active', true)
    ])

    const totalEmployees = employeesResult.count || 0
    const activeEmployees = activeEmployeesResult.count || 0

    // ============================================================
    // Query 2: Instruiri active și expirate
    // ============================================================
    const [activeTrainingsResult, expiredTrainingsResult] = await Promise.all([
      supabase
        .from('trainings')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .gte('expiry_date', today),

      supabase
        .from('trainings')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .lt('expiry_date', today)
    ])

    const activeTrainings = activeTrainingsResult.count || 0
    const expiredTrainings = expiredTrainingsResult.count || 0

    // ============================================================
    // Query 3: Examene medicale pendinte (expirând în 30 zile) și expirate
    // ============================================================
    const [pendingMedicalResult, expiredMedicalResult] = await Promise.all([
      supabase
        .from('medical_records')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .gte('expiry_date', today)
        .lte('expiry_date', thirtyDaysFromNow)
        .eq('result', 'apt'),

      supabase
        .from('medical_records')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .lt('expiry_date', today)
    ])

    const pendingMedical = pendingMedicalResult.count || 0
    const expiredMedical = expiredMedicalResult.count || 0

    // ============================================================
    // Query 4: Echipamente cu inspecție scadentă (în următoarele 30 zile sau expirate)
    // ============================================================
    const equipmentDueResult = await supabase
      .from('equipment')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .or(`next_inspection_date.lte.${thirtyDaysFromNow},expiry_date.lte.${thirtyDaysFromNow}`)

    const equipmentDueInspection = equipmentDueResult.count || 0

    // ============================================================
    // Calculare compliance score (0-100)
    // ============================================================
    const complianceScore = calculateComplianceScore({
      totalEmployees,
      activeTrainings,
      expiredTrainings,
      pendingMedical,
      expiredMedical,
      equipmentDueInspection
    })

    // ============================================================
    // Construire răspuns
    // ============================================================
    const stats: StatsResponse = {
      totalEmployees,
      activeEmployees,
      activeTrainings,
      expiredTrainings,
      pendingMedical,
      expiredMedical,
      equipmentDueInspection,
      complianceScore,
      generatedAt: new Date().toISOString()
    }

    // Salvare în cache
    setCachedStats(organizationId, stats)

    return NextResponse.json({
      success: true,
      data: stats,
      fromCache: false
    })

  } catch (err: any) {
    console.error('[GET /api/stats] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Eroare server', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// Funcție calculare compliance score (0-100)
// ============================================================

interface ComplianceParams {
  totalEmployees: number
  activeTrainings: number
  expiredTrainings: number
  pendingMedical: number
  expiredMedical: number
  equipmentDueInspection: number
}

function calculateComplianceScore(params: ComplianceParams): number {
  const {
    totalEmployees,
    activeTrainings,
    expiredTrainings,
    pendingMedical,
    expiredMedical,
    equipmentDueInspection
  } = params

  // Scor inițial: 100
  let score = 100

  // Penalizări:
  // - Instruiri expirate: -5 puncte per instruire expirată (max -30)
  score -= Math.min(expiredTrainings * 5, 30)

  // - Examene medicale expirate: -10 puncte per examen expirat (max -40)
  score -= Math.min(expiredMedical * 10, 40)

  // - Examene medicale pendinte: -2 puncte per examen (max -10)
  score -= Math.min(pendingMedical * 2, 10)

  // - Echipamente cu inspecție scadentă: -3 puncte per echipament (max -20)
  score -= Math.min(equipmentDueInspection * 3, 20)

  // Bonus pentru instruiri active (max +10)
  if (totalEmployees > 0) {
    const trainingCoverage = (activeTrainings / totalEmployees) * 100
    if (trainingCoverage >= 90) {
      score += 10
    } else if (trainingCoverage >= 70) {
      score += 5
    }
  }

  // Asigurare că scorul este între 0 și 100
  return Math.max(0, Math.min(100, Math.round(score)))
}
