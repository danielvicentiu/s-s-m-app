/**
 * Centralized Error Handling System
 *
 * Provides:
 * - AppError class for operational errors
 * - withErrorHandling wrapper for API routes
 * - handleApiError function for consistent error responses
 */

/**
 * Custom error class for application errors
 * Extends native Error with statusCode and operational flag
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly for instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Error response interface
 */
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp?: string;
  path?: string;
}

/**
 * Logs error details to console with proper formatting
 */
export function logError(error: Error | AppError, context?: string): void {
  const timestamp = new Date().toISOString();

  console.error('\n=== Error Log ===');
  console.error('Timestamp:', timestamp);

  if (context) {
    console.error('Context:', context);
  }

  if (error instanceof AppError) {
    console.error('Type: AppError (Operational)');
    console.error('Status Code:', error.statusCode);
    console.error('Is Operational:', error.isOperational);
  } else {
    console.error('Type: Unexpected Error');
  }

  console.error('Message:', error.message);
  console.error('Stack:', error.stack);
  console.error('================\n');
}

/**
 * Handles API errors and returns consistent JSON response
 *
 * @param error - The error object
 * @param path - Optional request path for logging
 * @returns ErrorResponse object with error details
 */
export function handleApiError(
  error: Error | AppError | unknown,
  path?: string
): ErrorResponse {
  let statusCode = 500;
  let message = 'A ap─ârut o eroare intern─â'; // Romanian UI message
  let errorType = 'Internal Server Error';
  let isOperational = false;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorType = 'Application Error';
    isOperational = error.isOperational;
  } else if (error instanceof Error) {
    message = error.message || message;
    errorType = error.name || 'Error';
  }

  // Log the error
  const context = path ? `API Route: ${path}` : 'API Route';
  if (error instanceof Error) {
    logError(error, context);
  } else {
    console.error('Unknown error type:', error);
  }

  // Don't expose internal error details in production
  const isProduction = process.env.NODE_ENV === 'production';

  const response: ErrorResponse = {
    error: errorType,
    message: isProduction && !isOperational
      ? 'A ap─ârut o eroare intern─â'
      : message,
    statusCode,
    timestamp: new Date().toISOString(),
  };

  if (path) {
    response.path = path;
  }

  return response;
}

/**
 * Higher-order function that wraps API route handlers with error handling
 *
 * @param handler - The async API route handler function
 * @returns Wrapped handler with automatic error handling
 *
 * @example
 * export const GET = withErrorHandling(async (request: Request) => {
 *   // Your route logic here
 *   const data = await fetchData();
 *   return Response.json({ data });
 * });
 */
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      // Extract path from Request if available
      let path: string | undefined;
      const request = args[0];
      if (request && typeof request === 'object' && 'url' in request) {
        try {
          path = new URL((request as Request).url).pathname;
        } catch {
          // Ignore URL parsing errors
        }
      }

      const errorResponse = handleApiError(error, path);

      return Response.json(errorResponse, {
        status: errorResponse.statusCode,
      });
    }
  };
}

/**
 * Common HTTP error factory functions
 */
export const ErrorFactory = {
  badRequest: (message: string = 'Cerere invalid─â') =>
    new AppError(message, 400),

  unauthorized: (message: string = 'Neautorizat') =>
    new AppError(message, 401),

  forbidden: (message: string = 'Acces interzis') =>
    new AppError(message, 403),

  notFound: (message: string = 'Resursa nu a fost g─âsit─â') =>
    new AppError(message, 404),

  conflict: (message: string = 'Conflict') =>
    new AppError(message, 409),

  validationError: (message: string = 'Eroare de validare') =>
    new AppError(message, 422),

  internalError: (message: string = 'Eroare intern─â de server') =>
    new AppError(message, 500, false),

  serviceUnavailable: (message: string = 'Serviciu indisponibil') =>
    new AppError(message, 503),
};

/**
 * Async error boundary for server components
 * Catches errors and returns formatted error response
 */
export async function tryCatch<T>(
  promise: Promise<T>,
  context?: string
): Promise<[Error | null, T | null]> {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    if (error instanceof Error) {
      logError(error, context);
      return [error, null];
    }

    const unknownError = new Error('Unknown error occurred');
    logError(unknownError, context);
    return [unknownError, null];
  }
}
