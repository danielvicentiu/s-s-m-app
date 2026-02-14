import { z } from 'zod';

/**
 * Environment validation schema using Zod
 * Validates all required and optional environment variables at startup
 */

// Client-side environment variables (NEXT_PUBLIC_*)
const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url({ message: 'NEXT_PUBLIC_SUPABASE_URL must be a valid URL' })
    .min(1, { message: 'NEXT_PUBLIC_SUPABASE_URL is required' }),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, { message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required' }),

  NEXT_PUBLIC_APP_URL: z
    .string()
    .url({ message: 'NEXT_PUBLIC_APP_URL must be a valid URL' })
    .optional()
    .default('http://localhost:3000'),
});

// Server-side environment variables
const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, { message: 'SUPABASE_SERVICE_ROLE_KEY is required on server' }),

  STRIPE_SECRET_KEY: z
    .string()
    .optional(),

  RESEND_API_KEY: z
    .string()
    .optional(),

  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

// Combined schema for full validation
const envSchema = clientSchema.merge(serverSchema);

// Type exports
export type ClientEnv = z.infer<typeof clientSchema>;
export type ServerEnv = z.infer<typeof serverSchema>;
export type Env = z.infer<typeof envSchema>;

/**
 * Validates client-side environment variables
 * Can be called from browser or server
 */
export function validateClientEnv(): ClientEnv {
  try {
    return clientSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => {
        return `  - ${issue.path.join('.')}: ${issue.message}`;
      }).join('\n');

      throw new Error(
        `❌ Invalid client environment variables:\n${issues}\n\n` +
        `Please check your .env.local file and ensure all required variables are set.`
      );
    }
    throw error;
  }
}

/**
 * Validates server-side environment variables
 * Should only be called on the server
 */
export function validateServerEnv(): ServerEnv {
  if (typeof window !== 'undefined') {
    throw new Error('validateServerEnv() should only be called on the server');
  }

  try {
    return serverSchema.parse({
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      NODE_ENV: process.env.NODE_ENV,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => {
        return `  - ${issue.path.join('.')}: ${issue.message}`;
      }).join('\n');

      throw new Error(
        `❌ Invalid server environment variables:\n${issues}\n\n` +
        `Please check your .env.local file and ensure all required server variables are set.`
      );
    }
    throw error;
  }
}

/**
 * Validates all environment variables (client + server)
 * Should be called at application startup on the server
 */
export function validateEnv(): Env {
  if (typeof window !== 'undefined') {
    throw new Error('validateEnv() should only be called on the server during startup');
  }

  try {
    return envSchema.parse({
      // Client variables
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

      // Server variables
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      NODE_ENV: process.env.NODE_ENV,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => {
        return `  - ${issue.path.join('.')}: ${issue.message}`;
      }).join('\n');

      throw new Error(
        `❌ Invalid environment variables:\n${issues}\n\n` +
        `Please check your .env.local file and ensure all required variables are set.\n` +
        `Required variables:\n` +
        `  - NEXT_PUBLIC_SUPABASE_URL (must be a valid URL)\n` +
        `  - NEXT_PUBLIC_SUPABASE_ANON_KEY\n` +
        `  - SUPABASE_SERVICE_ROLE_KEY (server-only)\n\n` +
        `Optional variables:\n` +
        `  - NEXT_PUBLIC_APP_URL (defaults to http://localhost:3000)\n` +
        `  - STRIPE_SECRET_KEY\n` +
        `  - RESEND_API_KEY`
      );
    }
    throw error;
  }
}

/**
 * Type-safe access to environment variables
 * Validates on first access and caches the result
 */
let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  cachedEnv = validateEnv();
  return cachedEnv;
}

// Export schemas for external use
export { clientSchema, serverSchema, envSchema };
