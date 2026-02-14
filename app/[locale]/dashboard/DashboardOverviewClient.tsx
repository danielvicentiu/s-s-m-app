// app/[locale]/dashboard/DashboardOverviewClient.tsx
// Dashboard Overview — KPI cards, active alerts, trainings chart, quick actions
// Live data from Supabase: employees count, expired trainings, medical exams due, compliance score

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  Users,
  GraduationCap,
  Stethoscope,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  Plus,
  ArrowRight,
  BarChart3,
  Calendar
} from 'lucide-react'

// ========== TYPES ==========

interface KPIStats {
  totalEmployees: number
  expiredTrainings: number
  medicalExamsDue: number
  complianceScore: number
}

interface Alert {
  id: string
  title: string
  description: string | null
  severity: 'info' | 'warning' | 'critical' | 'expired'
  category: string
  due_date: string | null
  created_at: string
  organization_id: string
  resolved: boolean
}

interface TrainingMonthData {
  month: string
  count: number
  label: string
}

type AlertSeverity = 'info' | 'warning' | 'critical' | 'expired'

// ========== COMPONENT ==========

export default function DashboardOverviewClient() {
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  // State
  const [stats, setStats] = useState<KPIStats>({
    totalEmployees: 0,
    expiredTrainings: 0,
    medicalExamsDue: 0,
    complianceScore: 0,
  })
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [trainingData, setTrainingData] = useState<TrainingMonthData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ========== FETCH ALL DATA ==========

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        setError(null)

        // Parallel fetch all data
        const [
          employeesResult,
          trainingsResult,
          medicalResult,
          alertsResult,
          trainingStatsResult
        ] = await Promise.all([
          // 1. Total employees count
          supabase
            .from('employees')
            .select('id', { count: 'exact', head: true }),

          // 2. Expired trainings count
          supabase
            .from('training_sessions')
            .select('id', { count: 'exact', head: true })
            .lt('expiry_date', new Date().toISOString())
            .eq('frequency', 'periodic'),

          // 3. Medical exams due (expiring within 30 days or expired)
          supabase
            .from('medical_exams')
            .select('id', { count: 'exact', head: true })
            .lte('expiry_date', getDatePlusDays(30)),

          // 4. Active alerts (top 5 by severity)
          supabase
            .from('alerts')
            .select('*')
            .eq('resolved', false)
            .order('severity', { ascending: true })
            .order('created_at', { ascending: false })
            .limit(5),

          // 5. Trainings per month (last 6 months)
          supabase
            .from('training_sessions')
            .select('completion_date')
            .gte('completion_date', getMonthsAgo(6))
        ])

        // Process results
        const totalEmployees = employeesResult.count || 0
        const expiredTrainings = trainingsResult.count || 0
        const medicalExamsDue = medicalResult.count || 0

        // Calculate compliance score
        const complianceScore = calculateComplianceScore({
          totalEmployees,
          expiredTrainings,
          medicalExamsDue,
        })

        setStats({
          totalEmployees,
          expiredTrainings,
          medicalExamsDue,
          complianceScore,
        })

        // Set alerts
        if (alertsResult.data) {
          setAlerts(alertsResult.data)
        }

        // Process training data for chart
        if (trainingStatsResult.data) {
          const monthlyData = processTrainingsByMonth(trainingStatsResult.data)
          setTrainingData(monthlyData)
        }

      } catch (err) {
        console.error('[DASHBOARD] Fetch error:', err)
        setError('Eroare la încărcarea datelor dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // ========== HELPERS ==========

  function getDatePlusDays(days: number): string {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString()
  }

  function getMonthsAgo(months: number): string {
    const date = new Date()
    date.setMonth(date.getMonth() - months)
    return date.toISOString()
  }

  function calculateComplianceScore(data: {
    totalEmployees: number
    expiredTrainings: number
    medicalExamsDue: number
  }): number {
    if (data.totalEmployees === 0) return 100

    const trainingCompliance = data.totalEmployees > 0
      ? ((data.totalEmployees - data.expiredTrainings) / data.totalEmployees) * 100
      : 100

    const medicalCompliance = data.totalEmployees > 0
      ? ((data.totalEmployees - data.medicalExamsDue) / data.totalEmployees) * 100
      : 100

    // Average of both compliance metrics
    const score = (trainingCompliance + medicalCompliance) / 2
    return Math.max(0, Math.min(100, Math.round(score)))
  }

  function processTrainingsByMonth(trainings: any[]): TrainingMonthData[] {
    const monthCounts: Record<string, number> = {}
    const months: string[] = []

    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      months.push(monthKey)
      monthCounts[monthKey] = 0
    }

    // Count trainings per month
    trainings.forEach(training => {
      const date = new Date(training.completion_date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (monthCounts.hasOwnProperty(monthKey)) {
        monthCounts[monthKey]++
      }
    })

    // Convert to array with labels
    return months.map(monthKey => {
      const [year, month] = monthKey.split('-')
      const monthNames = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const label = `${monthNames[parseInt(month) - 1]} ${year}`

      return {
        month: monthKey,
        count: monthCounts[monthKey],
        label,
      }
    })
  }

  function getAlertSeverityConfig(severity: AlertSeverity) {
    const configs = {
      info: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', label: 'Info' },
      warning: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', label: 'Atenție' },
      critical: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Critic' },
      expired: { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500', label: 'Expirat' },
    }
    return configs[severity] || configs.info
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ro-RO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  // ========== RENDER LOADING ==========

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header skeleton */}
          <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse" />

          {/* KPI Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-96">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-96">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ========== RENDER ERROR ==========

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <EmptyState
            icon={AlertTriangle}
            title="Eroare la încărcare"
            description={error}
            actionLabel="Reîncearcă"
            onAction={() => window.location.reload()}
          />
        </div>
      </div>
    )
  }

  // ========== RENDER MAIN ==========

  const maxTrainingCount = Math.max(...trainingData.map(d => d.count), 1)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Privire de ansamblu asupra activității SSM/PSI</p>
          </div>
          <div className="text-sm text-gray-500">
            <Calendar className="inline-block w-4 h-4 mr-1" />
            Actualizat acum
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Total Employees */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Total Angajați</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalEmployees}</p>
            </div>
          </div>

          {/* Expired Trainings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Instruiri Expirate</p>
              <p className="text-3xl font-bold text-red-600">{stats.expiredTrainings}</p>
            </div>
          </div>

          {/* Medical Exams Due */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Examene Scadente</p>
              <p className="text-3xl font-bold text-orange-600">{stats.medicalExamsDue}</p>
            </div>
          </div>

          {/* Compliance Score */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stats.complianceScore >= 90 ? 'bg-green-100' :
                stats.complianceScore >= 70 ? 'bg-orange-100' : 'bg-red-100'
              }`}>
                <CheckCircle className={`w-6 h-6 ${
                  stats.complianceScore >= 90 ? 'text-green-600' :
                  stats.complianceScore >= 70 ? 'text-orange-600' : 'text-red-600'
                }`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Scor Conformitate</p>
              <p className={`text-3xl font-bold ${
                stats.complianceScore >= 90 ? 'text-green-600' :
                stats.complianceScore >= 70 ? 'text-orange-600' : 'text-red-600'
              }`}>
                {stats.complianceScore}%
              </p>
            </div>
          </div>

        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Active Alerts */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Alerte Active
              </h2>
              <button
                onClick={() => router.push('/dashboard/alerts')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Vezi toate
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {alerts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">Nicio alertă activă</p>
                <p className="text-xs text-gray-500">Toate obligațiile sunt la zi</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map(alert => {
                  const severityConfig = getAlertSeverityConfig(alert.severity)
                  return (
                    <div
                      key={alert.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                      onClick={() => router.push('/dashboard/alerts')}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${severityConfig.bg} ${severityConfig.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${severityConfig.dot}`} />
                              {severityConfig.label}
                            </span>
                            <span className="text-xs text-gray-500">{alert.category}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">{alert.title}</p>
                          {alert.description && (
                            <p className="text-xs text-gray-600 line-clamp-2">{alert.description}</p>
                          )}
                        </div>
                        {alert.due_date && (
                          <div className="text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(alert.due_date)}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Trainings Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Instruiri per Lună
              </h2>
              <button
                onClick={() => router.push('/dashboard/trainings')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Vezi toate
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {trainingData.map((data, idx) => {
                const percentage = (data.count / maxTrainingCount) * 100
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-medium">{data.label}</span>
                      <span className="text-gray-900 font-semibold">{data.count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {trainingData.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">Fără date disponibile</p>
                <p className="text-xs text-gray-500">Nu există instruiri în ultimele 6 luni</p>
              </div>
            )}
          </div>

        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Acțiuni Rapide</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <button
              onClick={() => router.push('/dashboard/employees')}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Users className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Angajați</p>
                <p className="text-xs text-gray-500">Gestionează personal</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/dashboard/trainings')}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <GraduationCap className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Instruiri</p>
                <p className="text-xs text-gray-500">SSM/PSI/Prim Ajutor</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/dashboard/medical')}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Stethoscope className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Examene Medicale</p>
                <p className="text-xs text-gray-500">Medicina muncii</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/dashboard/equipment')}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <FileText className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Echipamente</p>
                <p className="text-xs text-gray-500">EIP & dotări PSI</p>
              </div>
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}
