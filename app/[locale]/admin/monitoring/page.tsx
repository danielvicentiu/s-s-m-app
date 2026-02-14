// app/[locale]/admin/monitoring/page.tsx
// System Monitoring Dashboard - Service health, metrics & real-time monitoring
// Acces: DOAR super_admin
// Auto-refresh: 60s

import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';
import { isSuperAdmin } from '@/lib/rbac';
import { MonitoringDashboardClient } from './MonitoringDashboardClient';

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

async function checkDatabaseHealth(): Promise<ServiceHealth> {
  try {
    const supabase = await createSupabaseServer();
    const start = Date.now();
    const { error } = await supabase.from('profiles').select('id').limit(1).single();
    const responseTime = Date.now() - start;

    if (error && error.code !== 'PGRST116') {
      return { name: 'Database', status: 'down', message: error.message };
    }

    return {
      name: 'Database',
      status: responseTime < 200 ? 'operational' : 'degraded',
      responseTime,
    };
  } catch (error) {
    return { name: 'Database', status: 'down', message: 'Connection failed' };
  }
}

async function checkStorageHealth(): Promise<ServiceHealth> {
  try {
    const supabase = await createSupabaseServer();
    const start = Date.now();
    const { data, error } = await supabase.storage.listBuckets();
    const responseTime = Date.now() - start;

    if (error) {
      return { name: 'Storage', status: 'down', message: error.message };
    }

    return {
      name: 'Storage',
      status: responseTime < 500 ? 'operational' : 'degraded',
      responseTime,
    };
  } catch (error) {
    return { name: 'Storage', status: 'down', message: 'Connection failed' };
  }
}

async function checkAuthHealth(): Promise<ServiceHealth> {
  try {
    const supabase = await createSupabaseServer();
    const start = Date.now();
    const { data, error } = await supabase.auth.getSession();
    const responseTime = Date.now() - start;

    if (error) {
      return { name: 'Authentication', status: 'down', message: error.message };
    }

    return {
      name: 'Authentication',
      status: responseTime < 200 ? 'operational' : 'degraded',
      responseTime,
    };
  } catch (error) {
    return { name: 'Authentication', status: 'down', message: 'Connection failed' };
  }
}

async function getSystemMetrics(): Promise<SystemMetrics> {
  const supabase = await createSupabaseServer();

  // Active users (last 15 minutes)
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const { count: activeUsers } = await supabase
    .from('audit_log')
    .select('user_id', { count: 'exact', head: true })
    .gte('created_at', fifteenMinutesAgo);

  // API calls today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count: apiCallsToday } = await supabase
    .from('audit_log')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());

  // Error rate last 24h
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: totalCalls } = await supabase
    .from('audit_log')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', twentyFourHoursAgo);

  const { count: errorCalls } = await supabase
    .from('audit_log')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', twentyFourHoursAgo)
    .like('action', '%error%');

  const errorRate24h = totalCalls ? ((errorCalls || 0) / totalCalls) * 100 : 0;

  // Storage used (approximation based on generated_documents)
  const { data: documents } = await supabase
    .from('generated_documents')
    .select('file_size_bytes')
    .not('file_size_bytes', 'is', null);

  const storageUsedBytes = documents?.reduce((sum, doc) => sum + (doc.file_size_bytes || 0), 0) || 0;
  const storageUsedMB = Math.round(storageUsedBytes / (1024 * 1024));
  const storageQuotaMB = 10240; // 10GB default for most Supabase plans

  return {
    activeUsers: activeUsers || 0,
    apiCallsToday: apiCallsToday || 0,
    errorRate24h: Math.round(errorRate24h * 100) / 100,
    storageUsedMB,
    storageQuotaMB,
  };
}

export default async function AdminMonitoringPage() {
  // GUARD: Verificare super_admin (server-side)
  const admin = await isSuperAdmin();
  if (!admin) redirect('/unauthorized');

  // Check all services
  const [database, storage, auth] = await Promise.all([
    checkDatabaseHealth(),
    checkStorageHealth(),
    checkAuthHealth(),
  ]);

  // External services (no direct check, assumed operational)
  const email: ServiceHealth = {
    name: 'Email',
    status: 'operational',
    message: 'No direct health check available',
  };

  const stripe: ServiceHealth = {
    name: 'Stripe',
    status: 'operational',
    message: 'No direct health check available',
  };

  const api: ServiceHealth = {
    name: 'API',
    status: database.status === 'operational' ? 'operational' : 'degraded',
    message: 'Status based on database connectivity',
  };

  const services = [database, storage, auth, email, stripe, api];

  // Get metrics
  const metrics = await getSystemMetrics();

  return (
    <div className="min-h-screen bg-gray-50">
      <MonitoringDashboardClient initialServices={services} initialMetrics={metrics} />
    </div>
  );
}
