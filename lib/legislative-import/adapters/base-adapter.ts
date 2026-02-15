// lib/legislative-import/adapters/base-adapter.ts
// Abstract base class for all legislative source adapters

import type {
  LegislativeAdapter,
  AdapterType,
  CountryCode,
  RawLegislation,
  SearchParams,
  UpdateCheckResult,
} from '../types';
import { RateLimiter } from '../utils/rate-limiter';

export abstract class BaseAdapter implements LegislativeAdapter {
  abstract readonly adapterType: AdapterType;
  abstract readonly countryCode: CountryCode;

  protected rateLimiter: RateLimiter;

  constructor(maxConcurrent: number = 1, minDelayMs: number = 1000) {
    this.rateLimiter = new RateLimiter(maxConcurrent, minDelayMs);
  }

  abstract fetchAct(sourceId: string): Promise<RawLegislation>;
  abstract searchActs(params: SearchParams): Promise<RawLegislation[]>;
  abstract checkForUpdates(sourceId: string, lastHash: string): Promise<UpdateCheckResult>;
  abstract getPriorityActs(): Promise<string[]>;

  protected log(message: string, data?: Record<string, unknown>): void {
    console.log(`[${this.adapterType}] ${message}`, data ? JSON.stringify(data) : '');
  }

  protected warn(message: string, data?: Record<string, unknown>): void {
    console.warn(`[${this.adapterType}] ⚠️ ${message}`, data ? JSON.stringify(data) : '');
  }

  protected error(message: string, error?: unknown): void {
    console.error(`[${this.adapterType}] ❌ ${message}`, error);
  }

  /**
   * Rate-limited fetch wrapper
   */
  protected async fetchWithLimit(url: string, options?: RequestInit): Promise<Response> {
    return this.rateLimiter.withLimit(async () => {
      const response = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': 'SSM-Legislative-Bot/1.0 (+https://s-s-m.ro/bot)',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText} for ${url}`);
      }

      return response;
    });
  }
}
