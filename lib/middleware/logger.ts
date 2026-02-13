import { NextRequest, NextResponse } from 'next/server';

export interface LogEntry {
  timestamp: string;
  method: string;
  path: string;
  status: number;
  duration: number;
  userId?: string;
  error?: string;
}

/**
 * Logs API request details to console in development or as structured JSON in production
 */
function logRequest(entry: LogEntry): void {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    // Readable format for development
    const userInfo = entry.userId ? ` | User: ${entry.userId}` : '';
    const errorInfo = entry.error ? ` | Error: ${entry.error}` : '';
    console.log(
      `[${entry.timestamp}] ${entry.method} ${entry.path} - ${entry.status} (${entry.duration}ms)${userInfo}${errorInfo}`
    );
  } else {
    // Structured JSON for production
    console.log(JSON.stringify(entry));
  }
}

/**
 * Extracts user ID from the request context
 * This is a placeholder - adjust based on your auth implementation
 */
async function extractUserId(request: NextRequest): Promise<string | undefined> {
  try {
    // Try to get user from Supabase session
    const { createSupabaseServer } = await import('@/lib/supabase/server');
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
  } catch (error) {
    // Silent fail - user might not be authenticated
    return undefined;
  }
}

/**
 * Higher-order function that wraps API route handlers with request logging
 *
 * @example
 * ```ts
 * export const GET = withLogging(async (request: NextRequest) => {
 *   // Your handler logic
 *   return NextResponse.json({ data: 'example' });
 * });
 * ```
 */
export function withLogging<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    const method = request.method;
    const path = new URL(request.url).pathname;

    let response: NextResponse;
    let userId: string | undefined;
    let error: string | undefined;

    try {
      // Extract user ID before handling request
      userId = await extractUserId(request);

      // Execute the actual handler
      response = await handler(request, ...args);

      // Log successful request
      logRequest({
        timestamp,
        method,
        path,
        status: response.status,
        duration: Date.now() - startTime,
        userId,
      });

      return response;
    } catch (err) {
      // Log failed request
      error = err instanceof Error ? err.message : 'Unknown error';
      const status = 500;

      logRequest({
        timestamp,
        method,
        path,
        status,
        duration: Date.now() - startTime,
        userId,
        error,
      });

      // Re-throw the error to be handled by Next.js error handling
      throw err;
    }
  };
}

/**
 * Standalone logging function for manual use in API routes
 * Use this when you need more control over logging
 */
export async function logApiRequest(
  request: NextRequest,
  response: NextResponse,
  startTime: number,
  error?: Error
): Promise<void> {
  const timestamp = new Date().toISOString();
  const method = request.method;
  const path = new URL(request.url).pathname;
  const userId = await extractUserId(request);

  logRequest({
    timestamp,
    method,
    path,
    status: response.status,
    duration: Date.now() - startTime,
    userId,
    error: error?.message,
  });
}
