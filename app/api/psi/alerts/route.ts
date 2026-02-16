// app/api/psi/alerts/route.ts
// M2_PSI API: Equipment Expiry Alerts
// GET - Get expiring equipment alerts grouped by urgency level

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { ApiError } from '@/lib/api/middleware'
import { PSIAlertItem, PSIAlertLevel } from '@/lib/types'

interface AlertsResponse {
  total: number
  by_level: {
    expired: number
    critical: number
    warning: number
    info: number
  }
  alerts: PSIAlertItem[]
}

/**
 * GET /api/psi/alerts
 * Get expiring equipment alerts
 * Query params:
 * - organization_id: filter by organization (optional)
 * - alert_level: filter by alert level (expired, critical, warning, info) (optional)
 * - days: max days ahead to look (default 90)
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { searchParams } = new URL(req.url)

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Trebuie să fii autentificat pentru a accesa această resursă',
          code: 'AUTH_REQUIRED'
        } as ApiError,
        { status: 401 }
      )
    }

    // Get user's organizations via memberships
    const { data: memberships, error: memError } = await supabase
      .from('memberships')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (memError) {
      console.error('[GET /api/psi/alerts] Membership error:', memError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la preluarea organizațiilor',
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    const orgIds = memberships?.map(m => m.organization_id) || []

    if (orgIds.length === 0) {
      return NextResponse.json({
        total: 0,
        by_level: { expired: 0, critical: 0, warning: 0, info: 0 },
        alerts: []
      } as AlertsResponse)
    }

    // Parse query params
    const organizationId = searchParams.get('organization_id')
    const alertLevel = searchParams.get('alert_level') as PSIAlertLevel | null
    const days = parseInt(searchParams.get('days') || '90', 10)

    // Verify organization access if specified
    if (organizationId && !orgIds.includes(organizationId)) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: 'Nu ai acces la această organizație',
          code: 'INSUFFICIENT_PERMISSIONS'
        } as ApiError,
        { status: 403 }
      )
    }

    // Calculate date threshold
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + days)
    const maxDateStr = maxDate.toISOString().split('T')[0]

    // Build query for v_psi_expiring view
    let query = supabase
      .from('v_psi_expiring')
      .select('*')
      .in('organization_id', organizationId ? [organizationId] : orgIds)
      .lte('next_inspection_date', maxDateStr)

    // Filter by alert level if specified
    if (alertLevel) {
      query = query.eq('alert_level', alertLevel)
    }

    // Order by next_inspection_date ASC (most urgent first)
    query = query.order('next_inspection_date', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('[GET /api/psi/alerts] Query error:', error)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la preluarea alertelor PSI',
          details: error.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    const alerts: PSIAlertItem[] = (data || []).map((item: any) => ({
      id: item.id,
      equipment_id: item.id,
      equipment_type: item.equipment_type,
      identifier: item.identifier,
      location: item.location,
      next_inspection_date: item.next_inspection_date,
      days_until_due: item.days_until_due,
      alert_level: item.alert_level,
      organization_id: item.organization_id,
      organization_name: item.organization_name,
      organization_cui: item.organization_cui
    }))

    // Count by alert level
    const byLevel = {
      expired: alerts.filter(a => a.alert_level === 'expired').length,
      critical: alerts.filter(a => a.alert_level === 'critical').length,
      warning: alerts.filter(a => a.alert_level === 'warning').length,
      info: alerts.filter(a => a.alert_level === 'info').length
    }

    return NextResponse.json({
      total: alerts.length,
      by_level: byLevel,
      alerts: alerts
    } as AlertsResponse)
  } catch (error) {
    console.error('[GET /api/psi/alerts]', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'A apărut o eroare neprevăzută',
        details: error instanceof Error ? error.message : String(error),
        code: 'INTERNAL_ERROR'
      } as ApiError,
      { status: 500 }
    )
  }
}
