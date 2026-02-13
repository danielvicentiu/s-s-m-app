'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Activity,
  Database,
  HardDrive,
  Mail,
  CreditCard,
  Zap,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react'

interface MonitoringData {
  dbStatus: 'healthy' | 'error'
  activeUsers: number
  apiCallsToday: number
  storageUsedMB: string
  errorCount24h: number
}

interface MonitoringClientProps {
  initialData: MonitoringData
}

interface ServiceStatus {
  name: string
  status: 'online' | 'offline' | 'degraded'
  icon: any
  color: string
  message: string
}

export function MonitoringClient({ initialData }: MonitoringClientProps) {
  const [data, setData] = useState<MonitoringData>(initialData)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, 60000) // 60 seconds

    return () => clearInterval(interval)
  }, [])

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/admin/monitoring/stats')
      if (response.ok) {
        const newData = await response.json()
        setData(newData)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Failed to refresh monitoring data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const manualRefresh = () => {
    refreshData()
  }

  // Service status cards
  const services: ServiceStatus[] = [
    {
      name: 'Database',
      status: data.dbStatus === 'healthy' ? 'online' : 'offline',
      icon: Database,
      color: data.dbStatus === 'healthy' ? 'green' : 'red',
      message: data.dbStatus === 'healthy' ? 'Healthy' : 'Error',
    },
    {
      name: 'Storage',
      status: 'online',
      icon: HardDrive,
      color: 'green',
      message: 'Operational',
    },
    {
      name: 'Email',
      status: 'online',
      icon: Mail,
      color: 'green',
      message: 'Operational',
    },
    {
      name: 'Stripe',
      status: 'online',
      icon: CreditCard,
      color: 'green',
      message: 'Operational',
    },
    {
      name: 'API',
      status: 'online',
      icon: Zap,
      color: 'green',
      message: 'Operational',
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-5 w-5" />
      case 'offline':
        return <XCircle className="h-5 w-5" />
      case 'degraded':
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <CheckCircle className="h-5 w-5" />
    }
  }

  const getStatusColor = (color: string) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-700',
          dot: 'bg-green-500',
          icon: 'text-green-600',
        }
      case 'red':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          dot: 'bg-red-500',
          icon: 'text-red-600',
        }
      case 'yellow':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          dot: 'bg-yellow-500',
          icon: 'text-yellow-600',
        }
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          dot: 'bg-gray-500',
          icon: 'text-gray-600',
        }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Activity className="h-7 w-7 text-blue-600" />
                System Monitoring
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Monitorizare în timp real a tuturor serviciilor și sistemelor
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Ultimul update: {lastUpdate.toLocaleTimeString('ro-RO')}
              </div>
              <button
                onClick={manualRefresh}
                disabled={isRefreshing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-all ${
                  isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6 space-y-6">
        {/* SERVICE STATUS CARDS */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Service Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {services.map((service) => {
              const colors = getStatusColor(service.color)
              const Icon = service.icon

              return (
                <div
                  key={service.name}
                  className={`${colors.bg} border-2 ${colors.border} rounded-2xl p-6`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`h-8 w-8 ${colors.icon}`} />
                    <div className={colors.icon}>{getStatusIcon(service.status)}</div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{service.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    <span className={`text-sm font-medium ${colors.text}`}>
                      {service.message}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* METRICS GRID */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Active Users */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Active Users</span>
              </div>
              <div className="text-3xl font-black text-gray-900">{data.activeUsers}</div>
              <div className="text-xs text-gray-500 mt-1">Ultimele 24h</div>
            </div>

            {/* API Calls Today */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-6 w-6 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">API Calls</span>
              </div>
              <div className="text-3xl font-black text-gray-900">
                {data.apiCallsToday.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">Astăzi</div>
            </div>

            {/* Storage Used */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <HardDrive className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Storage Used</span>
              </div>
              <div className="text-3xl font-black text-gray-900">{data.storageUsedMB}</div>
              <div className="text-xs text-gray-500 mt-1">MB</div>
            </div>

            {/* Errors (24h) */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <span className="text-sm font-medium text-gray-600">Errors</span>
              </div>
              <div className="text-3xl font-black text-gray-900">{data.errorCount24h}</div>
              <div className="text-xs text-gray-500 mt-1">Ultimele 24h</div>
            </div>
          </div>
        </section>

        {/* RESPONSE TIME GRAPH PLACEHOLDER */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Response Time</h2>
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg font-medium">Response Time Graph</p>
                <p className="text-sm mt-2">Chart placeholder — to be implemented</p>
              </div>
            </div>
          </div>
        </section>

        {/* ERROR RATE PLACEHOLDER */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Error Rate (Last 24h)</h2>
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
            <div className="flex items-center justify-center h-48 text-gray-400">
              <div className="text-center">
                <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg font-medium">Error Rate Graph</p>
                <p className="text-sm mt-2">Chart placeholder — to be implemented</p>
              </div>
            </div>
          </div>
        </section>

        {/* INFO BOX */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Auto-refresh activat
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Dashboard-ul se actualizează automat la fiecare 60 de secunde. Poți folosi și
                butonul &quot;Refresh&quot; pentru update manual.
              </p>
            </div>
          </div>
        </div>

        {/* LINK ÎNAPOI */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Înapoi la Dashboard
          </Link>
          <Link
            href="/admin/countries"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Admin Țări →
          </Link>
        </div>
      </main>
    </div>
  )
}
