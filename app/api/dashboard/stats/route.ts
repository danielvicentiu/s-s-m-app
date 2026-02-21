// app/api/dashboard/stats/route.ts
// API Route: Dashboard statistics endpoint
// Returns: total employees, expired trainings, upcoming trainings, PSI equipment count

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get org_id from query params (optional)
    const searchParams = request.nextUrl.searchParams
    const orgId = searchParams.get('org_id')

    // Build base query conditions
    let employeesQuery = supabase
      .from('employees')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)

    let trainingsQuery = supabase
      .from('training_sessions')
      .select('id, status, scheduled_date, created_at')

    let psiEquipmentQuery = supabase
      .from('safety_equipment')
      .select('id', { count: 'exact', head: true })

    // Filter by organization if specified
    if (orgId && orgId !== 'all') {
      employeesQuery = employeesQuery.eq('organization_id', orgId)
      trainingsQuery = trainingsQuery.eq('organization_id', orgId)
      psiEquipmentQuery = psiEquipmentQuery.eq('organization_id', orgId)
    } else {
      // Filter by user's accessible organizations
      const { data: memberships } = await supabase
        .from('memberships')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('is_active', true)

      const accessibleOrgIds = memberships?.map(m => m.organization_id) || []

      if (accessibleOrgIds.length > 0) {
        employeesQuery = employeesQuery.in('organization_id', accessibleOrgIds)
        trainingsQuery = trainingsQuery.in('organization_id', accessibleOrgIds)
        psiEquipmentQuery = psiEquipmentQuery.in('organization_id', accessibleOrgIds)
      } else {
        // No accessible organizations
        return NextResponse.json({
          totalEmployees: 0,
          expiredTrainings: 0,
          upcomingTrainings: 0,
          psiEquipmentCount: 0,
          expiredDocuments: 0
        })
      }
    }

    // Execute queries
    const [
      { count: totalEmployees },
      { data: trainingSessions },
      { count: psiEquipmentCount }
    ] = await Promise.all([
      employeesQuery,
      trainingsQuery,
      psiEquipmentQuery
    ])

    // Calculate training statistics
    const now = new Date()
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(now.getDate() + 7)

    const expiredTrainings = trainingSessions?.filter(t => t.status === 'expirat').length || 0

    const upcomingTrainings = trainingSessions?.filter(t => {
      const scheduledDate = new Date(t.scheduled_date)
      return t.status === 'programat' && scheduledDate >= now && scheduledDate <= sevenDaysFromNow
    }).length || 0

    // For now, expiredDocuments is 0 (can be extended when documents table is ready)
    const expiredDocuments = 0

    // Fetch recent alerts (last 5) - simulate from training sessions and medical exams
    const recentAlerts: any[] = []

    // Add expired trainings as alerts
    const expiredTrainingSessions = trainingSessions?.filter(t => t.status === 'expirat').slice(0, 3) || []
    for (const training of expiredTrainingSessions) {
      recentAlerts.push({
        id: training.id,
        message: `Instruire expirată - data programată: ${new Date(training.scheduled_date).toLocaleDateString('ro-RO')}`,
        severity: 'error',
        created_at: training.created_at || new Date().toISOString()
      })
    }

    // Add upcoming trainings as alerts
    const upcomingTrainingSessions = trainingSessions?.filter(t => {
      const scheduledDate = new Date(t.scheduled_date)
      return t.status === 'programat' && scheduledDate >= now && scheduledDate <= sevenDaysFromNow
    }).slice(0, 2) || []

    for (const training of upcomingTrainingSessions) {
      recentAlerts.push({
        id: training.id,
        message: `Instruire programată în ${Math.ceil((new Date(training.scheduled_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} zile`,
        severity: 'warning',
        created_at: training.created_at || new Date().toISOString()
      })
    }

    return NextResponse.json({
      totalEmployees: totalEmployees || 0,
      expiredTrainings,
      upcomingTrainings,
      psiEquipmentCount: psiEquipmentCount || 0,
      expiredDocuments,
      recentAlerts: recentAlerts.slice(0, 5)
    })

  } catch (error) {
    console.error('[Dashboard Stats API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
