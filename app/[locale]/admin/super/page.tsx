// app/admin/super/page.tsx
// Super Admin Dashboard: Analytics și monitorizare sistem
// Acces: DOAR super_admin
// Afișează: total organizații, utilizatori, activitate, revenue, growth, top orgs, alerte sistem

import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import { isSuperAdmin } from '@/lib/rbac'
import Link from 'next/link'
import {
  Building2,
  Users,
  Activity,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Calendar,
  BarChart3,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from 'lucide-react'

export default async function SuperAdminDashboardPage() {
  // GUARD: Verificare super_admin (server-side)
  const admin = await isSuperAdmin()
  if (!admin) redirect('/unauthorized')

  const supabase = await createSupabaseServer()

  // ── STATISTICI GENERALE ──

  // Total organizații
  const { count: totalOrganizations } = await supabase
    .from('organizations')
    .select('*', { count: 'exact', head: true })

  // Total utilizatori (profiles)
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // Utilizatori activi azi (cu activitate în audit_log sau last_sign_in)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString()

  const { data: activeUsersData } = await supabase
    .from('profiles')
    .select('id')
    .gte('last_sign_in_at', todayISO)

  const activeUsersToday = activeUsersData?.length || 0

  // Organizații noi luna aceasta
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const { count: newOrgsThisMonth } = await supabase
    .from('organizations')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString())

  // ── REVENUE (MRR) ──
  // Calculăm pe baza subscriptions sau un field fictiv (demo)
  // Pentru demo, presupunem că fiecare org = 100 RON/lună
  const monthlyRecurringRevenue = (totalOrganizations || 0) * 100

  // ── GRAFIC CREȘTERE (ultimi 6 luni) ──
  const growthData = []
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const nextMonthDate = new Date(today.getFullYear(), today.getMonth() - i + 1, 1)

    const { count: orgsInMonth } = await supabase
      .from('organizations')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', nextMonthDate.toISOString())

    growthData.push({
      month: monthDate.toLocaleDateString('ro-RO', { month: 'short', year: 'numeric' }),
      count: orgsInMonth || 0,
    })
  }

  // Calcul variație față de luna trecută
  const currentMonthOrgs = growthData[growthData.length - 1]?.count || 0
  const lastMonthOrgs = growthData[growthData.length - 2]?.count || 0
  const orgGrowthPercent =
    lastMonthOrgs > 0 ? (((currentMonthOrgs - lastMonthOrgs) / lastMonthOrgs) * 100).toFixed(1) : '0.0'
  const orgGrowthPositive = currentMonthOrgs >= lastMonthOrgs

  // ── TOP ORGANIZAȚII PER ANGAJAȚI ──
  const { data: topOrgs } = await supabase
    .from('organizations')
    .select('id, name, cui')
    .order('created_at', { ascending: true })
    .limit(10)

  // Pentru fiecare org, contorizăm angajații din snapshot-ul cel mai recent
  const topOrgsWithEmployees = await Promise.all(
    (topOrgs || []).map(async (org) => {
      const { data: latestSnapshot } = await supabase
        .from('reges_employee_snapshots')
        .select('snapshot_date')
        .eq('organization_id', org.id)
        .order('snapshot_date', { ascending: false })
        .limit(1)
        .maybeSingle()

      let employeeCount = 0
      if (latestSnapshot) {
        const { count } = await supabase
          .from('reges_employee_snapshots')
          .select('cnp', { count: 'exact', head: true })
          .eq('organization_id', org.id)
          .eq('employment_status', 'active')
          .eq('snapshot_date', latestSnapshot.snapshot_date)

        employeeCount = count || 0
      }

      return {
        ...org,
        employee_count: employeeCount,
      }
    })
  )

  // Sortăm descrescător după employee_count
  topOrgsWithEmployees.sort((a, b) => b.employee_count - a.employee_count)

  // ── ALERTE SISTEM ──
  // Exemple: organizații fără angajați, utilizatori inactivi >30 zile, etc.
  const systemAlerts: { type: string; message: string; severity: 'low' | 'medium' | 'high' }[] = []

  // Organizații fără angajați
  const orgsWithoutEmployees = topOrgsWithEmployees.filter((o) => o.employee_count === 0).length
  if (orgsWithoutEmployees > 0) {
    systemAlerts.push({
      type: 'Organizații fără angajați',
      message: `${orgsWithoutEmployees} organizații nu au angajați înregistrați`,
      severity: 'medium',
    })
  }

  // Utilizatori inactivi >30 zile
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const { count: inactiveUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .lt('last_sign_in_at', thirtyDaysAgo.toISOString())

  if ((inactiveUsers || 0) > 10) {
    systemAlerts.push({
      type: 'Utilizatori inactivi',
      message: `${inactiveUsers} utilizatori nu s-au autentificat în ultimele 30 zile`,
      severity: 'low',
    })
  }

  // Verificare alerte critice din tabela alerts
  const { count: criticalAlerts } = await supabase
    .from('alerts')
    .select('*', { count: 'exact', head: true })
    .eq('severity', 'critical')
    .eq('is_resolved', false)

  if ((criticalAlerts || 0) > 0) {
    systemAlerts.push({
      type: 'Alerte critice nerezolvate',
      message: `${criticalAlerts} alerte critice necesită atenție imediată`,
      severity: 'high',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Shield className="h-8 w-8" />
                Super Admin Dashboard
              </h1>
              <p className="text-blue-100 mt-2">
                Monitorizare sistem, analytics și management global
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/roles"
                className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20 transition border border-white/20"
              >
                Administrare Roluri
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-white text-blue-600 hover:bg-blue-50 transition"
              >
                Dashboard Principal
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Organizații */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-50">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold">
                {orgGrowthPositive ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
                <span className={orgGrowthPositive ? 'text-green-600' : 'text-red-600'}>
                  {orgGrowthPercent}%
                </span>
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900">{totalOrganizations || 0}</div>
            <div className="text-sm font-semibold text-gray-500 mt-1">Total Organizații</div>
            <div className="text-xs text-gray-400 mt-2">
              +{newOrgsThisMonth || 0} în luna aceasta
            </div>
          </div>

          {/* Total Utilizatori */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-50">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900">{totalUsers || 0}</div>
            <div className="text-sm font-semibold text-gray-500 mt-1">Total Utilizatori</div>
            <div className="text-xs text-gray-400 mt-2">Profiluri înregistrate</div>
          </div>

          {/* Utilizatori Activi Azi */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-50">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <Zap className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-black text-gray-900">{activeUsersToday}</div>
            <div className="text-sm font-semibold text-gray-500 mt-1">Utilizatori Activi Azi</div>
            <div className="text-xs text-gray-400 mt-2">
              {totalUsers ? ((activeUsersToday / totalUsers) * 100).toFixed(1) : 0}% din total
            </div>
          </div>

          {/* Organizații Noi Luna */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-orange-50">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900">{newOrgsThisMonth || 0}</div>
            <div className="text-sm font-semibold text-gray-500 mt-1">Organizații Noi Luna</div>
            <div className="text-xs text-gray-400 mt-2">
              {startOfMonth.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })}
            </div>
          </div>

          {/* Revenue MRR */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-emerald-50">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900">
              {monthlyRecurringRevenue.toLocaleString('ro-RO')} RON
            </div>
            <div className="text-sm font-semibold text-gray-500 mt-1">MRR (Monthly Recurring)</div>
            <div className="text-xs text-gray-400 mt-2">Revenue estimat lunar</div>
          </div>

          {/* Alerte Sistem */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-red-50">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900">{systemAlerts.length}</div>
            <div className="text-sm font-semibold text-gray-500 mt-1">Alerte Sistem</div>
            <div className="text-xs text-gray-400 mt-2">
              {systemAlerts.filter((a) => a.severity === 'high').length} critice
            </div>
          </div>
        </div>

        {/* GRAFIC CREȘTERE */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Creștere Organizații (Ultimi 6 Luni)
              </h2>
              <p className="text-sm text-gray-500 mt-1">Evoluție număr organizații înregistrate</p>
            </div>
            <BarChart3 className="h-6 w-6 text-gray-400" />
          </div>

          {/* Simple bar chart */}
          <div className="flex items-end gap-4 h-48">
            {growthData.map((item, idx) => {
              const maxCount = Math.max(...growthData.map((d) => d.count))
              const heightPercent = maxCount > 0 ? (item.count / maxCount) * 100 : 0

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end h-40">
                    <div className="text-xs font-semibold text-gray-600 mb-2">{item.count}</div>
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500"
                      style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                    />
                  </div>
                  <div className="text-xs font-medium text-gray-500">{item.month}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* TOP ORGANIZAȚII PER ANGAJAȚI */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Top Organizații per Angajați
              </h2>
              <p className="text-sm text-gray-500 mt-1">Primele 10 organizații după număr angajați</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Organizație
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    CUI
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                    Angajați
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topOrgsWithEmployees.slice(0, 10).map((org, idx) => (
                  <tr key={org.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-500">#{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{org.name}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{org.cui || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold">
                        {org.employee_count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {topOrgsWithEmployees.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nicio organizație găsită</p>
            </div>
          )}
        </div>

        {/* ALERTE SISTEM */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Alerte Sistem
              </h2>
              <p className="text-sm text-gray-500 mt-1">Notificări și avertismente importante</p>
            </div>
          </div>

          <div className="space-y-3">
            {systemAlerts.length === 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-semibold">Toate sistemele funcționează normal</span>
                </div>
              </div>
            )}

            {systemAlerts.map((alert, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-4 rounded-xl border ${
                  alert.severity === 'high'
                    ? 'bg-red-50 border-red-200'
                    : alert.severity === 'medium'
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <AlertTriangle
                  className={`h-5 w-5 mt-0.5 ${
                    alert.severity === 'high'
                      ? 'text-red-600'
                      : alert.severity === 'medium'
                      ? 'text-orange-600'
                      : 'text-yellow-600'
                  }`}
                />
                <div className="flex-1">
                  <div
                    className={`text-sm font-semibold ${
                      alert.severity === 'high'
                        ? 'text-red-900'
                        : alert.severity === 'medium'
                        ? 'text-orange-900'
                        : 'text-yellow-900'
                    }`}
                  >
                    {alert.type}
                  </div>
                  <div
                    className={`text-sm mt-1 ${
                      alert.severity === 'high'
                        ? 'text-red-700'
                        : alert.severity === 'medium'
                        ? 'text-orange-700'
                        : 'text-yellow-700'
                    }`}
                  >
                    {alert.message}
                  </div>
                </div>
                <div
                  className={`text-xs font-bold uppercase tracking-wider ${
                    alert.severity === 'high'
                      ? 'text-red-600'
                      : alert.severity === 'medium'
                      ? 'text-orange-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {alert.severity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            ← Înapoi la Dashboard Principal
          </Link>
        </div>
      </main>
    </div>
  )
}
