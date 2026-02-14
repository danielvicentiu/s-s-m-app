import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

interface HealthCheck {
  name: string;
  status: 'ok' | 'degraded' | 'down';
  responseTime?: number;
  message?: string;
  details?: unknown;
}

interface HealthResponse {
  status: 'ok' | 'degraded' | 'down';
  checks: HealthCheck[];
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
}

const startTime = Date.now();

async function checkDatabase(): Promise<HealthCheck> {
  try {
    const supabase = await createSupabaseServer();
    const start = Date.now();
    const { data, error } = await supabase.rpc('select', { query: '1' }).single();
    const responseTime = Date.now() - start;

    if (error) {
      // Fallback to a simple query
      const { error: fallbackError } = await supabase
        .from('organizations')
        .select('id')
        .limit(1)
        .single();

      const fallbackResponseTime = Date.now() - start;

      if (fallbackError) {
        return {
          name: 'Database',
          status: 'down',
          responseTime: fallbackResponseTime,
          message: fallbackError.message,
        };
      }

      return {
        name: 'Database',
        status: fallbackResponseTime < 500 ? 'ok' : 'degraded',
        responseTime: fallbackResponseTime,
        message: 'Connected (fallback query)',
      };
    }

    return {
      name: 'Database',
      status: responseTime < 500 ? 'ok' : 'degraded',
      responseTime,
      message: 'Connected',
      details: { result: data },
    };
  } catch (error) {
    return {
      name: 'Database',
      status: 'down',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function checkStorage(): Promise<HealthCheck> {
  try {
    const supabase = await createSupabaseServer();
    const start = Date.now();
    const { data, error } = await supabase.storage.listBuckets();
    const responseTime = Date.now() - start;

    if (error) {
      return {
        name: 'Storage',
        status: 'down',
        responseTime,
        message: error.message,
      };
    }

    return {
      name: 'Storage',
      status: responseTime < 1000 ? 'ok' : 'degraded',
      responseTime,
      message: 'Connected',
      details: { bucketCount: data?.length || 0 },
    };
  } catch (error) {
    return {
      name: 'Storage',
      status: 'down',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function checkTime(): HealthCheck {
  const now = new Date();
  return {
    name: 'System Time',
    status: 'ok',
    message: now.toISOString(),
    details: {
      iso: now.toISOString(),
      unix: Math.floor(now.getTime() / 1000),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };
}

function checkUptime(): HealthCheck {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const uptimeMinutes = Math.floor(uptimeSeconds / 60);
  const uptimeHours = Math.floor(uptimeMinutes / 60);
  const uptimeDays = Math.floor(uptimeHours / 24);

  let message = '';
  if (uptimeDays > 0) {
    message = `${uptimeDays}d ${uptimeHours % 24}h ${uptimeMinutes % 60}m ${uptimeSeconds % 60}s`;
  } else if (uptimeHours > 0) {
    message = `${uptimeHours}h ${uptimeMinutes % 60}m ${uptimeSeconds % 60}s`;
  } else if (uptimeMinutes > 0) {
    message = `${uptimeMinutes}m ${uptimeSeconds % 60}s`;
  } else {
    message = `${uptimeSeconds}s`;
  }

  return {
    name: 'Uptime',
    status: 'ok',
    message,
    details: {
      seconds: uptimeSeconds,
      minutes: uptimeMinutes,
      hours: uptimeHours,
      days: uptimeDays,
    },
  };
}

function checkEnvironment(): HealthCheck {
  const env = process.env.NODE_ENV || 'unknown';
  const isProduction = env === 'production';

  return {
    name: 'Environment',
    status: 'ok',
    message: env,
    details: {
      nodeEnv: env,
      isProduction,
      nextVersion: process.env.npm_package_version || 'unknown',
      nodeVersion: process.version,
    },
  };
}

export async function GET() {
  try {
    // Run all checks in parallel
    const [dbCheck, storageCheck] = await Promise.all([checkDatabase(), checkStorage()]);

    const timeCheck = checkTime();
    const uptimeCheck = checkUptime();
    const envCheck = checkEnvironment();

    const checks = [dbCheck, storageCheck, timeCheck, uptimeCheck, envCheck];

    // Determine overall status
    let overallStatus: 'ok' | 'degraded' | 'down' = 'ok';
    const hasDown = checks.some((check) => check.status === 'down');
    const hasDegraded = checks.some((check) => check.status === 'degraded');

    if (hasDown) {
      overallStatus = 'down';
    } else if (hasDegraded) {
      overallStatus = 'degraded';
    }

    const response: HealthResponse = {
      status: overallStatus,
      checks,
      timestamp: new Date().toISOString(),
      version: '0.1.0', // from package.json
      environment: process.env.NODE_ENV || 'unknown',
      uptime: Math.floor((Date.now() - startTime) / 1000),
    };

    // Return appropriate HTTP status code
    const httpStatus = overallStatus === 'down' ? 503 : overallStatus === 'degraded' ? 200 : 200;

    return NextResponse.json(response, { status: httpStatus });
  } catch (error) {
    console.error('Health check error:', error);

    const errorResponse: HealthResponse = {
      status: 'down',
      checks: [
        {
          name: 'System',
          status: 'down',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      ],
      timestamp: new Date().toISOString(),
      version: '0.1.0',
      environment: process.env.NODE_ENV || 'unknown',
      uptime: Math.floor((Date.now() - startTime) / 1000),
    };

    return NextResponse.json(errorResponse, { status: 503 });
  }
}
