// app/api/training/calendar/stats/route.ts
// Training Calendar Stats API: Get aggregate statistics

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

// ============================================================
// GET /api/training/calendar/stats - Get training calendar statistics
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
    const organizationId = searchParams.get('org_id')
    const month = searchParams.get('month') // Format: YYYY-MM (optional, defaults to current month)

    // Get current month if not provided
    const now = new Date()
    const currentMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const [year, monthNum] = currentMonth.split('-')
    const startDate = `${year}-${monthNum}-01`
    const endDate = `${year}-${monthNum}-${new Date(parseInt(year), parseInt(monthNum), 0).getDate()}`

    // Get user's organization IDs for filtering
    let orgIdsToFilter: string[] = []

    if (organizationId && organizationId !== 'all') {
      orgIdsToFilter = [organizationId]
    } else {
      // User can only see their organizations
      const { data: memberships } = await supabase
        .from('memberships')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (memberships && memberships.length > 0) {
        orgIdsToFilter = memberships.map((m) => m.organization_id)
      } else {
        // No organizations, return zeros
        return NextResponse.json({
          data: {
            total_programate_luna_curenta: 0,
            total_efectuate: 0,
            total_expirate: 0,
            upcoming_7_zile: 0,
          },
        })
      }
    }

    // Calculate stats
    const today = new Date().toISOString().split('T')[0]
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // 1. Total programate luna curenta (scheduled in current month)
    const { count: totalProgramateLunaCurenta } = await supabase
      .from('training_sessions')
      .select('*', { count: 'exact', head: true })
      .in('organization_id', orgIdsToFilter)
      .gte('scheduled_date', startDate)
      .lte('scheduled_date', endDate)
      .eq('status', 'programat')

    // 2. Total efectuate (completed, all time)
    const { count: totalEfectuate } = await supabase
      .from('training_sessions')
      .select('*', { count: 'exact', head: true })
      .in('organization_id', orgIdsToFilter)
      .eq('status', 'efectuat')

    // 3. Total expirate (expired)
    const { count: totalExpirate } = await supabase
      .from('training_sessions')
      .select('*', { count: 'exact', head: true })
      .in('organization_id', orgIdsToFilter)
      .eq('status', 'expirat')

    // 4. Upcoming 7 zile (scheduled in next 7 days, status programat)
    const { count: upcoming7Zile } = await supabase
      .from('training_sessions')
      .select('*', { count: 'exact', head: true })
      .in('organization_id', orgIdsToFilter)
      .gte('scheduled_date', today)
      .lte('scheduled_date', sevenDaysFromNow)
      .eq('status', 'programat')

    const stats = {
      total_programate_luna_curenta: totalProgramateLunaCurenta || 0,
      total_efectuate: totalEfectuate || 0,
      total_expirate: totalExpirate || 0,
      upcoming_7_zile: upcoming7Zile || 0,
    }

    return NextResponse.json({ data: stats }, { status: 200 })
  } catch (error) {
    console.error('Unexpected error in GET /api/training/calendar/stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
