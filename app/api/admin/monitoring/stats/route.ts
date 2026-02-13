// app/api/admin/monitoring/stats/route.ts
// API Endpoint: System monitoring statistics
// Acces: super_admin only

import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { isSuperAdmin } from '@/lib/rbac'

export async function GET() {
  try {
    // GUARD: Verificare super_admin
    const admin = await isSuperAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const supabase = await createSupabaseServer()

    // Fetch statistici
    const [
      dbCheck,
      activeUsers,
      apiCallsCount,
      storageUsage,
      errorLogsCount,
    ] = await Promise.all([
      // Database health check
      supabase.from('profiles').select('id', { count: 'exact', head: true }),

      // Active users (profiles created in last 24h)
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),

      // API calls (webhook delivery logs in last 24h)
      supabase
        .from('webhook_delivery_logs')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),

      // Storage usage (generated documents)
      supabase
        .from('generated_documents')
        .select('file_size_bytes'),

      // Error logs (failed webhooks in last 24h)
      supabase
        .from('webhook_delivery_logs')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'failed')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    ])

    // Calculate storage used in MB
    const totalStorageBytes = storageUsage.data?.reduce(
      (sum, doc) => sum + (doc.file_size_bytes || 0),
      0
    ) || 0
    const storageMB = (totalStorageBytes / (1024 * 1024)).toFixed(2)

    const data = {
      dbStatus: dbCheck.error ? 'error' : 'healthy',
      activeUsers: activeUsers.count || 0,
      apiCallsToday: apiCallsCount.count || 0,
      storageUsedMB: storageMB,
      errorCount24h: errorLogsCount.count || 0,
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching monitoring stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
