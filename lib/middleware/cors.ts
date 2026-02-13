import { NextRequest, NextResponse } from 'next/server';

/**
 * CORS Configuration Options
 */
export interface CORSOptions {
  allowedOrigins?: string[] | '*';
  allowedMethods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  maxAge?: number;
  credentials?: boolean;
}

/**
 * Default CORS configuration for s-s-m.ro domains
 */
const DEFAULT_CORS_OPTIONS: CORSOptions = {
  allowedOrigins: [
    'https://app.s-s-m.ro',
    'https://s-s-m.ro',
    'https://www.s-s-m.ro',
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
  ].filter(Boolean),
  allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400, // 24 hours
  credentials: true,
};

/**
 * API Route Handler Type
 */
export type APIRouteHandler = (
  request: NextRequest,
  context?: { params: Record<string, string> }
) => Promise<NextResponse> | NextResponse;

/**
 * Check if origin is allowed based on CORS configuration
 */
function isOriginAllowed(origin: string | null, allowedOrigins: string[] | '*'): boolean {
  if (!origin) return false;
  if (allowedOrigins === '*') return true;
  return allowedOrigins.includes(origin);
}

/**
 * Set CORS headers on the response
 */
function setCORSHeaders(
  response: NextResponse,
  origin: string | null,
  options: CORSOptions
): NextResponse {
  const { allowedOrigins, allowedMethods, allowedHeaders, exposedHeaders, maxAge, credentials } =
    options;

  // Set Access-Control-Allow-Origin
  if (allowedOrigins === '*') {
    response.headers.set('Access-Control-Allow-Origin', '*');
  } else if (origin && isOriginAllowed(origin, allowedOrigins || [])) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  // Set Access-Control-Allow-Methods
  if (allowedMethods && allowedMethods.length > 0) {
    response.headers.set('Access-Control-Allow-Methods', allowedMethods.join(', '));
  }

  // Set Access-Control-Allow-Headers
  if (allowedHeaders && allowedHeaders.length > 0) {
    response.headers.set('Access-Control-Allow-Headers', allowedHeaders.join(', '));
  }

  // Set Access-Control-Expose-Headers
  if (exposedHeaders && exposedHeaders.length > 0) {
    response.headers.set('Access-Control-Expose-Headers', exposedHeaders.join(', '));
  }

  // Set Access-Control-Max-Age
  if (maxAge) {
    response.headers.set('Access-Control-Max-Age', maxAge.toString());
  }

  // Set Access-Control-Allow-Credentials
  if (credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

/**
 * CORS middleware wrapper for API route handlers
 *
 * Usage:
 * ```ts
 * export const GET = withCORS(async (request) => {
 *   // Your handler logic
 *   return NextResponse.json({ data: 'example' });
 * });
 *
 * // With custom options
 * export const POST = withCORS(
 *   async (request) => {
 *     // Your handler logic
 *   },
 *   { allowedOrigins: ['https://custom-domain.com'] }
 * );
 * ```
 */
export function withCORS(
  handler: APIRouteHandler,
  options: CORSOptions = {}
): APIRouteHandler {
  const corsOptions = { ...DEFAULT_CORS_OPTIONS, ...options };

  return async (request: NextRequest, context?: { params: Record<string, string> }) => {
    const origin = request.headers.get('origin');

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 });
      return setCORSHeaders(response, origin, corsOptions);
    }

    // Check if origin is allowed
    const { allowedOrigins } = corsOptions;
    if (allowedOrigins !== '*' && origin && !isOriginAllowed(origin, allowedOrigins || [])) {
      return new NextResponse(
        JSON.stringify({
          error: 'Origin not allowed',
          message: 'CORS policy does not allow access from this origin',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    try {
      // Execute the actual handler
      const response = await handler(request, context);

      // Add CORS headers to the response
      return setCORSHeaders(response, origin, corsOptions);
    } catch (error) {
      console.error('Error in CORS-wrapped handler:', error);

      // Return error response with CORS headers
      const errorResponse = new NextResponse(
        JSON.stringify({
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      return setCORSHeaders(errorResponse, origin, corsOptions);
    }
  };
}

/**
 * Create a custom CORS middleware with specific options
 *
 * Usage:
 * ```ts
 * const customCORS = createCORSMiddleware({
 *   allowedOrigins: ['https://partner-domain.com'],
 *   allowedMethods: ['GET', 'POST'],
 * });
 *
 * export const GET = customCORS(async (request) => {
 *   // Your handler logic
 * });
 * ```
 */
export function createCORSMiddleware(options: CORSOptions) {
  return (handler: APIRouteHandler): APIRouteHandler => {
    return withCORS(handler, options);
  };
}
