/**
 * Error Handling Utilities
 *
 * Provides centralized error handling for the application with consistent
 * error formatting for API routes and server actions.
 */

import { NextResponse } from 'next/server';

/**
 * Custom Application Error class with additional metadata
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Type guard to check if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Creates a validation error (400)
 */
export function createValidationError(
  message: string,
  details?: unknown
): AppError {
  return new AppError(
    message,
    'VALIDATION_ERROR',
    400,
    details
  );
}

/**
 * Creates a not found error (404)
 */
export function createNotFoundError(
  message: string = 'Resursa nu a fost găsită',
  details?: unknown
): AppError {
  return new AppError(
    message,
    'NOT_FOUND',
    404,
    details
  );
}

/**
 * Creates an unauthorized error (401)
 */
export function createUnauthorizedError(
  message: string = 'Autentificare necesară',
  details?: unknown
): AppError {
  return new AppError(
    message,
    'UNAUTHORIZED',
    401,
    details
  );
}

/**
 * Creates a forbidden error (403)
 */
export function createForbiddenError(
  message: string = 'Acces interzis',
  details?: unknown
): AppError {
  return new AppError(
    message,
    'FORBIDDEN',
    403,
    details
  );
}

/**
 * Standard error response format
 */
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Handles errors in API routes and returns a NextResponse
 *
 * @param error - The error to handle
 * @returns NextResponse with standardized error format
 */
export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  console.error('API Error:', error);

  if (isAppError(error)) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle generic errors
  const message = error instanceof Error ? error.message : 'Eroare internă de server';

  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message,
      },
    },
    { status: 500 }
  );
}

/**
 * Server action error response format
 */
interface ServerActionErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Handles errors in server actions and returns a standardized error object
 *
 * @param error - The error to handle
 * @returns Object with success: false and error details
 */
export function handleServerActionError(error: unknown): ServerActionErrorResponse {
  console.error('Server Action Error:', error);

  if (isAppError(error)) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    };
  }

  // Handle generic errors
  const message = error instanceof Error ? error.message : 'Eroare internă de server';

  return {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message,
    },
  };
}
