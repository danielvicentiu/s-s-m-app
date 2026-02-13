import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const startTime = Date.now();

export async function GET() {
  try {
    const timestamp = new Date().toISOString();
    const uptime = Math.floor((Date.now() - startTime) / 1000); // seconds

    // Check required environment variables
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    const allEnvVarsPresent = Object.values(envVars).every(Boolean);

    // Check Supabase connection
    let supabaseConnected = false;
    let supabaseError: string | null = null;

    try {
      const supabase = await createSupabaseServer();

      // Simple ping query to verify connection
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
        .single();

      // Connection is OK if no error or if error is just "no rows" (PGRST116)
      supabaseConnected = !error || error.code === 'PGRST116';

      if (error && error.code !== 'PGRST116') {
        supabaseError = error.message;
      }
    } catch (err) {
      supabaseError = err instanceof Error ? err.message : 'Unknown error';
      supabaseConnected = false;
    }

    // Determine overall status
    const status = supabaseConnected && allEnvVarsPresent ? 'ok' : 'degraded';

    const healthData = {
      status,
      version: process.env.npm_package_version || '1.0.0',
      uptime,
      timestamp,
      checks: {
        supabase: {
          connected: supabaseConnected,
          error: supabaseError,
        },
        environment: {
          allPresent: allEnvVarsPresent,
          variables: envVars,
        },
      },
    };

    // Return 200 for ok, 503 for degraded
    const statusCode = status === 'ok' ? 200 : 503;

    return NextResponse.json(healthData, { status: statusCode });
  } catch (error) {
    console.error('Health check error:', error);

    return NextResponse.json(
      {
        status: 'error',
        version: process.env.npm_package_version || '1.0.0',
        uptime: Math.floor((Date.now() - startTime) / 1000),
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
