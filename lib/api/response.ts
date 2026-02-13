/**
 * API Response Helpers
 *
 * Standard response formats for API routes
 * Provides consistent JSON structure across the application
 */

import { NextResponse } from 'next/server';

// Base response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Paginated response type
export interface PaginatedApiResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Validation error type
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrorResponse extends ApiResponse {
  errors: ValidationError[];
}

/**
 * Success response with data
 * @param data - Response data
 * @param status - HTTP status code (default: 200)
 * @returns NextResponse with success format
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  return NextResponse.json(response, { status });
}

/**
 * Error response with message
 * @param message - Error message
 * @param status - HTTP status code (default: 400)
 * @returns NextResponse with error format
 */
export function errorResponse(message: string, status: number = 400): NextResponse {
  const response: ApiResponse = {
    success: false,
    error: message,
  };

  return NextResponse.json(response, { status });
}

/**
 * Paginated response with data and pagination metadata
 * @param data - Array of items
 * @param total - Total number of items
 * @param page - Current page number
 * @param pageSize - Number of items per page
 * @returns NextResponse with paginated format
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): NextResponse {
  const totalPages = Math.ceil(total / pageSize);

  const response: PaginatedApiResponse<T[]> = {
    success: true,
    data,
    pagination: {
      total,
      page,
      pageSize,
      totalPages,
    },
  };

  return NextResponse.json(response, { status: 200 });
}

/**
 * Not found response (404)
 * @param message - Optional custom message (default: "Resource not found")
 * @returns NextResponse with 404 status
 */
export function notFoundResponse(message: string = 'Resursa nu a fost găsită'): NextResponse {
  const response: ApiResponse = {
    success: false,
    error: message,
  };

  return NextResponse.json(response, { status: 404 });
}

/**
 * Unauthorized response (401)
 * @param message - Optional custom message (default: "Unauthorized")
 * @returns NextResponse with 401 status
 */
export function unauthorizedResponse(
  message: string = 'Neautorizat. Autentificare necesară.'
): NextResponse {
  const response: ApiResponse = {
    success: false,
    error: message,
  };

  return NextResponse.json(response, { status: 401 });
}

/**
 * Validation error response (422)
 * @param errors - Array of validation errors
 * @param message - Optional custom message
 * @returns NextResponse with 422 status
 */
export function validationErrorResponse(
  errors: ValidationError[],
  message: string = 'Erori de validare'
): NextResponse {
  const response: ValidationErrorResponse = {
    success: false,
    error: message,
    errors,
  };

  return NextResponse.json(response, { status: 422 });
}

/**
 * Forbidden response (403)
 * @param message - Optional custom message
 * @returns NextResponse with 403 status
 */
export function forbiddenResponse(
  message: string = 'Acces interzis. Nu aveți permisiunile necesare.'
): NextResponse {
  const response: ApiResponse = {
    success: false,
    error: message,
  };

  return NextResponse.json(response, { status: 403 });
}

/**
 * Internal server error response (500)
 * @param message - Optional custom message
 * @returns NextResponse with 500 status
 */
export function serverErrorResponse(
  message: string = 'Eroare internă a serverului'
): NextResponse {
  const response: ApiResponse = {
    success: false,
    error: message,
  };

  return NextResponse.json(response, { status: 500 });
}

/**
 * Created response (201)
 * @param data - Created resource data
 * @param message - Optional success message
 * @returns NextResponse with 201 status
 */
export function createdResponse<T>(data: T, message?: string): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };

  return NextResponse.json(response, { status: 201 });
}

/**
 * No content response (204)
 * @returns NextResponse with 204 status and no body
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

/**
 * Bad request response (400)
 * @param message - Error message
 * @returns NextResponse with 400 status
 */
export function badRequestResponse(message: string = 'Cerere invalidă'): NextResponse {
  return errorResponse(message, 400);
}
