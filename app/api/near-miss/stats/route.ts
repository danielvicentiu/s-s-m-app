// app/api/near-miss/stats/route.ts
// Near-Miss API: Statistics and analytics

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

// ============================================================
// GET /api/near-miss/stats - Get near-miss statistics
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const organizationId = searchParams.get('organization_id')

    if (!organizationId) {
      return NextResponse.json(
        { error: 'organization_id is required' },
        { status: 400 }
      )
    }

    // Base query for organization
    const baseQuery = supabase
      .from('near_miss_reports')
      .select('*')
      .eq('organization_id', organizationId)

    // Get all reports for this organization
    const { data: allReports, error } = await baseQuery

    if (error) {
      console.error('[API] Near-miss stats error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch statistics', details: error.message },
        { status: 500 }
      )
    }

    const reports = allReports || []

    // Calculate basic stats
    const totalReports = reports.length
    const openReports = reports.filter(
      (r) => r.status === 'raportat' || r.status === 'in_investigare'
    ).length
    const inInvestigation = reports.filter(
      (r) => r.status === 'in_investigare'
    ).length

    // Reports closed this month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const closedThisMonth = reports.filter((r) => {
      if (!r.closed_at) return false
      const closedDate = new Date(r.closed_at)
      return closedDate >= startOfMonth
    }).length

    // Category distribution (top categories)
    const categoryCount: { [key: string]: number } = {}
    reports.forEach((r) => {
      categoryCount[r.category] = (categoryCount[r.category] || 0) + 1
    })
    const categoryStats = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Top 10 categories

    // Severity distribution
    const severityCount: { [key: string]: number } = {}
    reports.forEach((r) => {
      severityCount[r.potential_severity] =
        (severityCount[r.potential_severity] || 0) + 1
    })
    const severityStats = Object.entries(severityCount).map(
      ([severity, count]) => ({ severity, count })
    )

    // Monthly trend (last 12 months)
    const monthlyTrend: { [key: string]: number } = {}
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    reports
      .filter((r) => new Date(r.incident_date) >= twelveMonthsAgo)
      .forEach((r) => {
        const date = new Date(r.incident_date)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        monthlyTrend[monthKey] = (monthlyTrend[monthKey] || 0) + 1
      })

    const monthlyStats = Object.entries(monthlyTrend)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // Status distribution
    const statusCount: { [key: string]: number } = {}
    reports.forEach((r) => {
      statusCount[r.status] = (statusCount[r.status] || 0) + 1
    })
    const statusStats = Object.entries(statusCount).map(([status, count]) => ({
      status,
      count,
    }))

    return NextResponse.json({
      summary: {
        total: totalReports,
        open: openReports,
        inInvestigation,
        closedThisMonth,
      },
      byCategory: categoryStats,
      bySeverity: severityStats,
      byStatus: statusStats,
      monthlyTrend: monthlyStats,
    })
  } catch (err: any) {
    console.error('[API] Near-miss stats exception:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    )
  }
}
