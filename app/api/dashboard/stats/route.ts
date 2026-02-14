import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60;

interface DashboardStats {
  totalEmployees: number;
  activeAlerts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  upcomingTrainings: number;
  expiringMedicals: number;
  complianceScore: number;
  recentActivity: Array<{
    id: string;
    action: string;
    entity_type: string;
    entity_name: string | null;
    created_at: string;
  }>;
}

export async function GET() {
  try {
    const supabase = await createSupabaseServer();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      );
    }

    // Get user's organization
    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .select('organization_id')
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: 'Organizație negăsită' },
        { status: 404 }
      );
    }

    const organizationId = membership.organization_id;
    const now = new Date().toISOString();
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // Execute all queries in parallel for optimal performance
    const [
      employeesResult,
      alertsResult,
      trainingsResult,
      medicalsResult,
      activityResult,
    ] = await Promise.all([
      // Total employees (active only)
      supabase
        .from('employees')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .is('deleted_at', null),

      // Active alerts grouped by severity
      supabase
        .from('alerts')
        .select('severity')
        .eq('organization_id', organizationId)
        .eq('status', 'active')
        .is('deleted_at', null),

      // Upcoming trainings (next 30 days)
      supabase
        .from('trainings')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .gte('scheduled_date', now)
        .lte('scheduled_date', thirtyDaysFromNow)
        .is('deleted_at', null),

      // Expiring medical records (expired or expiring in 30 days)
      supabase
        .from('medical_records')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .lte('expiry_date', thirtyDaysFromNow)
        .is('deleted_at', null),

      // Recent activity (last 10 entries)
      supabase
        .from('audit_log')
        .select('id, action, entity_type, entity_name, created_at')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    // Check for errors
    if (employeesResult.error) throw employeesResult.error;
    if (alertsResult.error) throw alertsResult.error;
    if (trainingsResult.error) throw trainingsResult.error;
    if (medicalsResult.error) throw medicalsResult.error;
    if (activityResult.error) throw activityResult.error;

    // Calculate active alerts by severity
    const activeAlerts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    alertsResult.data?.forEach((alert) => {
      const severity = alert.severity?.toLowerCase();
      if (severity === 'critical') activeAlerts.critical++;
      else if (severity === 'high') activeAlerts.high++;
      else if (severity === 'medium') activeAlerts.medium++;
      else if (severity === 'low') activeAlerts.low++;
    });

    // Calculate compliance score (simplified formula)
    // Base score of 100, deduct points for issues
    const totalEmployees = employeesResult.count || 0;
    const totalAlerts = (alertsResult.data?.length || 0);
    const expiringMedicals = medicalsResult.count || 0;

    let complianceScore = 100;

    // Deduct points for alerts (critical = 5 points, high = 3, medium = 2, low = 1)
    complianceScore -= activeAlerts.critical * 5;
    complianceScore -= activeAlerts.high * 3;
    complianceScore -= activeAlerts.medium * 2;
    complianceScore -= activeAlerts.low * 1;

    // Deduct points for expiring medicals (1 point per employee with expiring medical)
    if (totalEmployees > 0) {
      const expiringPercentage = (expiringMedicals / totalEmployees) * 100;
      complianceScore -= Math.floor(expiringPercentage / 5); // 1 point per 5% of employees
    }

    // Ensure score is between 0 and 100
    complianceScore = Math.max(0, Math.min(100, complianceScore));

    const stats: DashboardStats = {
      totalEmployees,
      activeAlerts,
      upcomingTrainings: trainingsResult.count || 0,
      expiringMedicals,
      complianceScore,
      recentActivity: activityResult.data || [],
    };

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': `private, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Eroare la încărcarea statisticilor' },
      { status: 500 }
    );
  }
}
