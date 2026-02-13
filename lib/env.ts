import { z } from 'zod';

/**
 * Environment variables validation schema
 * Validates all required environment variables at startup
 */
const envSchema = z.object({
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL')
    .min(1, 'NEXT_PUBLIC_SUPABASE_URL is required'),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),

  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),

  // Resend API (Email Service)
  RESEND_API_KEY: z
    .string()
    .min(1, 'RESEND_API_KEY is required'),

  // Anthropic API (AI Features)
  ANTHROPIC_API_KEY: z
    .string()
    .min(1, 'ANTHROPIC_API_KEY is required'),

  // Node Environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

/**
 * Validates environment variables and returns typed object
 * @throws {Error} If validation fails with descriptive error message
 */
function validateEnv() {
  try {
    const env = envSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      NODE_ENV: process.env.NODE_ENV,
    });

    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => {
        const path = err.path.join('.');
        return `  ❌ ${path}: ${err.message}`;
      });

      const errorMessage = [
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '⚠️  Environment Validation Failed',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        'The following environment variables are missing or invalid:',
        '',
        ...missingVars,
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '📝 Please check your .env.local file and ensure all required',
        '   variables are set correctly.',
        '',
        '   Required variables:',
        '   - NEXT_PUBLIC_SUPABASE_URL',
        '   - NEXT_PUBLIC_SUPABASE_ANON_KEY',
        '   - SUPABASE_SERVICE_ROLE_KEY',
        '   - RESEND_API_KEY',
        '   - ANTHROPIC_API_KEY',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      ].join('\n');

      throw new Error(errorMessage);
    }
    throw error;
  }
}

// Validate environment variables at module load
export const env = validateEnv();

// Export types for TypeScript
export type Env = z.infer<typeof envSchema>;

// Console log success in development
if (env.NODE_ENV === 'development') {
  console.log('✅ Environment variables validated successfully');
}
