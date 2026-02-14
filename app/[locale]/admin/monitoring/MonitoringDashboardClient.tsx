'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Database,
  HardDrive,
  Mail,
  CreditCard,
  Server,
  Shield,
  Clock,
  AlertCircle,
  Users,
  TrendingUp,
  BarChart3,
  RefreshCw,
} from 'lucide-react';

interface ServiceHealth {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  responseTime?: number;
  message?: string;
}

interface SystemMetrics {
  activeUsers: number;
  apiCallsToday: number;
  errorRate24h: number;
  storageUsedMB: number;
  storageQuotaMB: number;
}

interface MonitoringDashboardClientProps {
  initialServices: ServiceHealth[];
  initialMetrics: SystemMetrics;
}

const SERVICE_ICONS: Record<string, any> = {
  Database: Database,
  Storage: HardDrive,
  Authentication: Shield,
  Email: Mail,
  Stripe: CreditCard,
  API: Server,
};

const STATUS_CONFIG = {
  operational: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    dot: 'bg-green-500',
    label: 'Operațional',
  },
  degraded: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    dot: 'bg-orange-500',
    label: 'Performanță redusă',
  },
  down: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    dot: 'bg-red-500',
    label: 'Offline',
  },
};

export function MonitoringDashboardClient({
  initialServices,
  initialMetrics,
}: MonitoringDashboardClientProps) {
  const router = useRouter();
  const [services, setServices] = useState<ServiceHealth[]>(initialServices);
  const [metrics, setMetrics] = useState<SystemMetrics>(initialMetrics);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [countdown, setCountdown] = useState(60);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    router.refresh();
    setLastRefresh(new Date());
    setCountdown(60);
    setTimeout(() => setIsRefreshing(false), 500);
  }, [router]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 60000);

    return () => clearInterval(interval);
  }, [refreshData]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 60));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update services and metrics when props change
  useEffect(() => {
    setServices(initialServices);
    setMetrics(initialMetrics);
  }, [initialServices, initialMetrics]);

  const overallStatus = services.every((s) => s.status === 'operational')
    ? 'operational'
    : services.some((s) => s.status === 'down')
      ? 'down'
      : 'degraded';

  const storagePercentage = (metrics.storageUsedMB / metrics.storageQuotaMB) * 100;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-600" />
            System Monitoring
          </h1>
          <p className="text-gray-600 mt-1">
            Monitorizare în timp real a serviciilor și performanței sistemului
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Actualizare în {countdown}s
            </div>
            <div className="text-xs text-gray-500">
              Ultima: {lastRefresh.toLocaleTimeString('ro-RO')}
            </div>
          </div>
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Reîmprospătare
          </button>
        </div>
      </div>

      {/* Overall Status Banner */}
      <div
        className={`mb-8 p-6 rounded-2xl border-2 ${STATUS_CONFIG[overallStatus].bg} ${STATUS_CONFIG[overallStatus].border}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`w-4 h-4 rounded-full ${STATUS_CONFIG[overallStatus].dot} animate-pulse`} />
            <div>
              <h2 className={`text-xl font-semibold ${STATUS_CONFIG[overallStatus].text}`}>
                Status General: {STATUS_CONFIG[overallStatus].label}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {services.filter((s) => s.status === 'operational').length} din {services.length}{' '}
                servicii operaționale
              </p>
            </div>
          </div>
          <Activity className={`w-12 h-12 ${STATUS_CONFIG[overallStatus].text}`} />
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Utilizatori activi"
          value={metrics.activeUsers}
          subtitle="Ultimele 15 minute"
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Apeluri API azi"
          value={metrics.apiCallsToday.toLocaleString('ro-RO')}
          subtitle="De la miezul nopții"
          icon={TrendingUp}
          color="green"
        />
        <MetricCard
          title="Rata de erori"
          value={`${metrics.errorRate24h}%`}
          subtitle="Ultimele 24 ore"
          icon={AlertCircle}
          color={metrics.errorRate24h > 5 ? 'red' : 'green'}
        />
        <MetricCard
          title="Stocare utilizată"
          value={`${metrics.storageUsedMB} MB`}
          subtitle={`${storagePercentage.toFixed(1)}% din ${metrics.storageQuotaMB} MB`}
          icon={HardDrive}
          color={storagePercentage > 80 ? 'red' : 'blue'}
        />
      </div>

      {/* Service Status Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-gray-600" />
          Stare Servicii
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </div>
      </div>

      {/* Response Time Graph Placeholder */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          Timp de răspuns (ultimele 24h)
        </h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Grafic timp de răspuns</p>
              <p className="text-sm text-gray-500 mt-1">În curs de implementare</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Error Rate Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Detalii erori (24h)
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rata de erori</span>
              <span className="font-semibold text-gray-900">{metrics.errorRate24h}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${metrics.errorRate24h > 5 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(metrics.errorRate24h * 10, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {metrics.errorRate24h < 1
                ? '✓ Excelent - sistem stabil'
                : metrics.errorRate24h < 5
                  ? '✓ Bine - în limite normale'
                  : '⚠ Atenție - verificare necesară'}
            </p>
          </div>
        </div>

        {/* Storage Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-blue-600" />
            Detalii stocare
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Utilizat / Total</span>
              <span className="font-semibold text-gray-900">
                {metrics.storageUsedMB} MB / {metrics.storageQuotaMB} MB
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${storagePercentage > 80 ? 'bg-red-500' : storagePercentage > 60 ? 'bg-orange-500' : 'bg-blue-500'}`}
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {storagePercentage < 60
                ? '✓ Disponibil'
                : storagePercentage < 80
                  ? '⚠ Atenție - peste 60%'
                  : '🔴 Critic - peste 80%'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ServiceCardProps {
  service: ServiceHealth;
}

function ServiceCard({ service }: ServiceCardProps) {
  const config = STATUS_CONFIG[service.status];
  const Icon = SERVICE_ICONS[service.name] || Server;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border-2 ${config.border} p-6 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${config.bg}`}>
            <Icon className={`w-5 h-5 ${config.text}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{service.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
              <span className={`text-sm font-medium ${config.text}`}>{config.label}</span>
            </div>
          </div>
        </div>
      </div>

      {service.responseTime !== undefined && (
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Timp răspuns:</span>
          <span className="font-semibold text-gray-900">{service.responseTime}ms</span>
        </div>
      )}

      {service.message && (
        <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded-lg">{service.message}</p>
      )}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  color: 'blue' | 'green' | 'red' | 'orange';
}

function MetricCard({ title, value, subtitle, icon: Icon, color }: MetricCardProps) {
  const colorConfig = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-xl border ${colorConfig[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}
