// lib/legislative-import/utils/rate-limiter.ts
// Simple rate limiter for API calls

export class RateLimiter {
  private queue: Array<{ resolve: () => void }> = [];
  private running = 0;
  private lastCallTime = 0;

  constructor(
    private readonly maxConcurrent: number = 1,
    private readonly minDelayMs: number = 1000,
  ) {}

  async acquire(): Promise<void> {
    // Wait for concurrency slot
    if (this.running >= this.maxConcurrent) {
      await new Promise<void>((resolve) => {
        this.queue.push({ resolve });
      });
    }

    // Enforce minimum delay between calls
    const now = Date.now();
    const elapsed = now - this.lastCallTime;
    if (elapsed < this.minDelayMs) {
      await sleep(this.minDelayMs - elapsed);
    }

    this.running++;
    this.lastCallTime = Date.now();
  }

  release(): void {
    this.running--;
    const next = this.queue.shift();
    if (next) next.resolve();
  }

  async withLimit<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Retry with exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000,
  label: string = 'operation',
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        console.warn(
          `[${label}] Attempt ${attempt + 1}/${maxRetries + 1} failed: ${lastError.message}. Retrying in ${delay}ms...`
        );
        await sleep(delay);
      }
    }
  }

  throw lastError;
}
