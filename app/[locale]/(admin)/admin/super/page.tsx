// app/[locale]/admin/super/page.tsx
// Super Admin Dashboard — Global Platform Metrics & System Health
// Acces: DOAR super_admin
// KPIs: Organizations, Revenue (MRR/ARR), Employees, System Health, Churn Risk

import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import { isSuperAdmin } from '@/lib/rbac'
import Link from 'next/link'
import {
  Building2,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Server,
  Database,
  Mail,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
} from 'lucide-react'

export default async function SuperAdminDashboard() {
  // GUARD: Verificare super_admin (server-side)
  const admin = await isSuperAdmin()
  if (!admin) redirect('/unauthorized')

  const supabase = await createSupabaseServer()

  // ═══════════════════════════════════════════════════════════════
  // FETCH DATA: Organizations, Employees, Revenue, System Health
  // ═══════════════════════════════════════════════════════════════

  // 1. ORGANIZATIONS METRICS
  const { data: organizations, error: orgsError } = await supabase
    .from('organizations')
    .select('id, name, cui, created_at, cooperation_status, data_completeness')
    .order('created_at', { ascending: false })

  const totalOrgs = organizations?.length || 0
  const activeOrgs = organizations?.filter(o => o.cooperation_status === 'active').length || 0
  const warningOrgs = organizations?.filter(o => o.cooperation_status === 'warning').length || 0
  const uncooperativeOrgs = organizations?.filter(o => o.cooperation_status === 'uncooperative').length || 0

  // Recent signups (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentSignups = organizations?.filter(
    o => new Date(o.created_at) >= thirtyDaysAgo
  ) || []

  // 2. EMPLOYEES METRICS (across all organizations)
  const { data: employeesData } = await supabase
    .from('reges_employee_snapshots')
    .select('organization_id, employment_status, snapshot_date')
    .eq('employment_status', 'active')
    .order('snapshot_date', { ascending: false })

  // Get latest snapshot per organization
  const latestSnapshots = new Map<string, Date>()
  employeesData?.forEach(emp => {
    const orgId = emp.organization_id
    const snapshotDate = new Date(emp.snapshot_date)
    if (!latestSnapshots.has(orgId) || snapshotDate > latestSnapshots.get(orgId)!) {
      latestSnapshots.set(orgId, snapshotDate)
    }
  })

  // Count active employees from latest snapshots
  const activeEmployees = employeesData?.filter(emp => {
    const latestDate = latestSnapshots.get(emp.organization_id)
    return latestDate && new Date(emp.snapshot_date).getTime() === latestDate.getTime()
  }).length || 0

  // 3. REVENUE METRICS (MOCK DATA — replace with Stripe API integration)
  // MRR = Monthly Recurring Revenue, ARR = Annual Recurring Revenue
  const mockMRR = totalOrgs * 49 // assuming 49 RON/month per org
  const mockARR = mockMRR * 12
  const mockGrowthRate = 12.5 // % growth month-over-month

  // 4. SYSTEM HEALTH METRICS (MOCK DATA — replace with real monitoring)
  const systemHealth = {
    apiLatency: 45, // ms
    errorRate: 0.12, // %
    uptime: 99.97, // %
    databaseConnections: 12,
    activeUsers: 47,
    requestsPerMinute: 234,
  }

  // 5. CHURN RISK ORGANIZATIONS (low compliance + inactive 30d)
  const { data: auditLogs } = await supabase
    .from('audit_log')
    .select('organization_id, created_at')
    .gte('created_at', thirtyDaysAgo.toISOString())

  const activeOrgIds = new Set(auditLogs?.map(log => log.organization_id) || [])
  const churnRiskOrgs = organizations?.filter(org =>
    org.data_completeness < 50 && !activeOrgIds.has(org.id)
  ) || []

  // 6. RECENT SIGNUPS (last 7 for preview)
  const recentSignupsPreview = organizations?.slice(0, 7) || []

  // ═══════════════════════════════════════════════════════════════
  // RENDER DASHBOARD
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black flex items-center gap-3">
                <Activity className="h-8 w-8" />
                Super Admin Dashboard
              </h1>
              <p className="text-blue-100 mt-1 text-sm font-medium">
                Monitorizare globală platformă S-S-M.RO
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20 transition border border-white/20"
            >
              ← Dashboard Principal
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* ═══ TOP-LEVEL KPI CARDS ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Organizations */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Total Organizații
                </p>
                <p className="text-4xl font-black text-gray-900 mt-2">{totalOrgs}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold">
                    <ArrowUpRight className="h-3 w-3" />
                    +{recentSignups.length} ultima lună
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-blue-50">
                <Building2 className="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </div>

          {/* MRR/ARR */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  MRR / ARR
                </p>
                <p className="text-4xl font-black text-gray-900 mt-2">
                  {mockMRR.toLocaleString()} RON
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ARR: {mockARR.toLocaleString()} RON
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold">
                    <TrendingUp className="h-3 w-3" />
                    +{mockGrowthRate}% MoM
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-green-50">
                <DollarSign className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Employees */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Total Angajați
                </p>
                <p className="text-4xl font-black text-gray-900 mt-2">
                  {activeEmployees.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Across {totalOrgs} organizații
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50">
                <Users className="h-7 w-7 text-purple-600" />
              </div>
            </div>
          </div>

          {/* System Uptime */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  System Uptime
                </p>
                <p className="text-4xl font-black text-gray-900 mt-2">
                  {systemHealth.uptime}%
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold">
                    <CheckCircle className="h-3 w-3" />
                    Operational
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-green-50">
                <Zap className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SYSTEM HEALTH STATUS ═══ */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-600" />
            System Health Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* API Latency */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">API Latency</p>
                  <p className="text-xs text-gray-500">Average response time</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-gray-900">{systemHealth.apiLatency}ms</p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold mt-1">
                  <CheckCircle className="h-3 w-3" />
                  Good
                </span>
              </div>
            </div>

            {/* Error Rate */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Error Rate</p>
                  <p className="text-xs text-gray-500">Last 24 hours</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-gray-900">{systemHealth.errorRate}%</p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold mt-1">
                  <CheckCircle className="h-3 w-3" />
                  Low
                </span>
              </div>
            </div>

            {/* Database Connections */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Database className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">DB Connections</p>
                  <p className="text-xs text-gray-500">Active connections</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-gray-900">{systemHealth.databaseConnections}</p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold mt-1">
                  <CheckCircle className="h-3 w-3" />
                  Healthy
                </span>
              </div>
            </div>

            {/* Active Users */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Active Users</p>
                  <p className="text-xs text-gray-500">Currently online</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-gray-900">{systemHealth.activeUsers}</p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold mt-1">
                  <Activity className="h-3 w-3" />
                  Live
                </span>
              </div>
            </div>

            {/* Requests per Minute */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100">
                  <Zap className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Requests/min</p>
                  <p className="text-xs text-gray-500">Current throughput</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-gray-900">{systemHealth.requestsPerMinute}</p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold mt-1">
                  <TrendingUp className="h-3 w-3" />
                  Normal
                </span>
              </div>
            </div>

            {/* Uptime */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Uptime</p>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-gray-900">{systemHealth.uptime}%</p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold mt-1">
                  <CheckCircle className="h-3 w-3" />
                  Excellent
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ TWO-COLUMN LAYOUT: Recent Signups + Churn Risk ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* RECENT SIGNUPS */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-green-600" />
              Recent Signups
              <span className="ml-auto text-sm font-normal text-gray-500">
                Last 30 days: {recentSignups.length}
              </span>
            </h2>
            <div className="space-y-3">
              {recentSignupsPreview.length > 0 ? (
                recentSignupsPreview.map(org => {
                  const daysAgo = Math.floor(
                    (Date.now() - new Date(org.created_at).getTime()) / (1000 * 60 * 60 * 24)
                  )
                  return (
                    <div
                      key={org.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{org.name}</p>
                          <p className="text-xs text-gray-500">{org.cui || 'CUI lipsă'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {org.data_completeness}% complete
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <UserPlus className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No recent signups</p>
                </div>
              )}
            </div>
          </div>

          {/* CHURN RISK ORGANIZATIONS */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-600" />
              Churn Risk Organizations
              <span className="ml-auto text-sm font-normal text-gray-500">
                {churnRiskOrgs.length} at risk
              </span>
            </h2>
            <div className="space-y-3">
              {churnRiskOrgs.length > 0 ? (
                churnRiskOrgs.slice(0, 7).map(org => (
                  <div
                    key={org.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100 hover:border-red-200 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-100">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{org.name}</p>
                        <p className="text-xs text-gray-500">{org.cui || 'CUI lipsă'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-100 text-red-700 text-xs font-semibold">
                        <ArrowDownRight className="h-3 w-3" />
                        {org.data_completeness}% complete
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Inactive 30d+</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No organizations at risk</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ ORGANIZATIONS STATUS BREAKDOWN ═══ */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Organizations Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active */}
            <div className="p-4 rounded-xl bg-green-50 border border-green-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-semibold text-green-900">Active</p>
                </div>
                <p className="text-2xl font-black text-green-600">{activeOrgs}</p>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(activeOrgs / totalOrgs) * 100}%` }}
                />
              </div>
              <p className="text-xs text-green-700 mt-2 font-medium">
                {((activeOrgs / totalOrgs) * 100).toFixed(1)}% of total
              </p>
            </div>

            {/* Warning */}
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <p className="text-sm font-semibold text-orange-900">Warning</p>
                </div>
                <p className="text-2xl font-black text-orange-600">{warningOrgs}</p>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full"
                  style={{ width: `${(warningOrgs / totalOrgs) * 100}%` }}
                />
              </div>
              <p className="text-xs text-orange-700 mt-2 font-medium">
                {((warningOrgs / totalOrgs) * 100).toFixed(1)}% of total
              </p>
            </div>

            {/* Uncooperative */}
            <div className="p-4 rounded-xl bg-red-50 border border-red-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <p className="text-sm font-semibold text-red-900">Uncooperative</p>
                </div>
                <p className="text-2xl font-black text-red-600">{uncooperativeOrgs}</p>
              </div>
              <div className="w-full bg-red-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${(uncooperativeOrgs / totalOrgs) * 100}%` }}
                />
              </div>
              <p className="text-xs text-red-700 mt-2 font-medium">
                {((uncooperativeOrgs / totalOrgs) * 100).toFixed(1)}% of total
              </p>
            </div>
          </div>
        </div>

        {/* BACK LINK */}
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Înapoi la Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
