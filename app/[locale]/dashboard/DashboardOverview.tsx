// app/[locale]/dashboard/DashboardOverview.tsx
// Dashboard Overview — Real-time statistics and quick actions
// Shows: Total employees, expired trainings, upcoming trainings, PSI equipment, recent alerts

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  Calendar,
  AlertTriangle,
  FileText,
  Shield,
  CalendarCheck,
  ScanLine,
  TrendingUp
} from 'lucide-react'

interface DashboardStats {
  totalEmployees: number
  expiredTrainings: number
  upcomingTrainings: number
  psiEquipmentCount: number
  expiredDocuments: number
  recentAlerts?: Alert[]
}

interface Alert {
  id: string
  message: string
  severity: 'info' | 'warning' | 'error'
  created_at: string
}

interface DashboardOverviewProps {
  selectedOrg: string
}

export default function DashboardOverview({ selectedOrg }: DashboardOverviewProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    expiredTrainings: 0,
    upcomingTrainings: 0,
    psiEquipmentCount: 0,
    expiredDocuments: 0
  })
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [selectedOrg])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedOrg !== 'all') {
        params.set('org_id', selectedOrg)
      }

      const response = await fetch(`/api/dashboard/stats?${params}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
        // Set alerts from stats response
        if (data.recentAlerts) {
          setAlerts(data.recentAlerts)
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Employees */}
        <StatCard
          icon={<Users className="h-6 w-6" />}
          title="Total Angajați"
          value={stats.totalEmployees}
          iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
          loading={loading}
        />

        {/* Expired Trainings */}
        <StatCard
          icon={<AlertTriangle className="h-6 w-6" />}
          title="Instruiri Expirate"
          value={stats.expiredTrainings}
          iconBgColor="bg-red-100 dark:bg-red-900/30"
          iconColor="text-red-600 dark:text-red-400"
          loading={loading}
          alert={stats.expiredTrainings > 0}
        />

        {/* Upcoming Trainings */}
        <StatCard
          icon={<Calendar className="h-6 w-6" />}
          title="Instruiri Următoarele 7 Zile"
          value={stats.upcomingTrainings}
          iconBgColor="bg-orange-100 dark:bg-orange-900/30"
          iconColor="text-orange-600 dark:text-orange-400"
          loading={loading}
        />

        {/* Expired Documents */}
        <StatCard
          icon={<FileText className="h-6 w-6" />}
          title="Documente Expirate"
          value={stats.expiredDocuments}
          iconBgColor="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
          loading={loading}
        />

        {/* PSI Equipment */}
        <StatCard
          icon={<Shield className="h-6 w-6" />}
          title="Echipamente PSI"
          value={stats.psiEquipmentCount}
          iconBgColor="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
          loading={loading}
        />
      </div>

      {/* Recent Alerts Section */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Alerte Recente
          </h2>
        </div>
        <div className="p-6">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nicio alertă recentă</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border ${
                    alert.severity === 'error'
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      : alert.severity === 'warning'
                      ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        alert.severity === 'error'
                          ? 'bg-red-500'
                          : alert.severity === 'warning'
                          ? 'bg-orange-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(alert.created_at).toLocaleDateString('ro-RO', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Acțiuni Rapide
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Calendar Instruiri */}
            <Link
              href="/ro/dashboard/calendar-instruiri"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <CalendarCheck className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  Calendar Instruiri
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Programează sesiuni
                </div>
              </div>
            </Link>

            {/* Rapoarte */}
            <Link
              href="/ro/reports"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400 group-hover:text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  Rapoarte
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Generează rapoarte
                </div>
              </div>
            </Link>

            {/* Scan Documente */}
            <Link
              href="/ro/documents/scan"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-600 transition-colors">
                <ScanLine className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  Scan Documente
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Upload & procesare
                </div>
              </div>
            </Link>

            {/* Angajați */}
            <Link
              href="/ro/dashboard/angajat-nou"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400 group-hover:text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  Angajați
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Adaugă angajat nou
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== STAT CARD COMPONENT =====
interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: number
  iconBgColor: string
  iconColor: string
  loading?: boolean
  alert?: boolean
}

function StatCard({ icon, title, value, iconBgColor, iconColor, loading, alert }: StatCardProps) {
  return (
    <div className={`rounded-2xl border bg-white dark:bg-gray-800 p-5 ${alert ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-xl ${iconBgColor} flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {title}
        </div>
        <div className={`text-3xl font-black ${alert ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
          {loading ? (
            <div className="h-9 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : (
            value
          )}
        </div>
      </div>
    </div>
  )
}
