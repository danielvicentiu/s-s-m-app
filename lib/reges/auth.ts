// ============================================================
// S-S-M.RO — REGES OpenID Connect Authentication
// File: lib/reges/auth.ts
//
// Autentificare REGES API prin OpenID Connect (password grant)
// Token cache în memorie pentru performanță
// ============================================================

import { decryptCredentials } from './encryption';

// REGES OpenID endpoints
const REGES_TOKEN_URL =
  'https://reges.anre.ro/auth/realms/reges/protocol/openid-connect/token';
const CLIENT_ID = 'reges-api';

// Token cache (in-memory, cleared on app restart)
const tokenCache = new Map<
  string,
  { token: string; expiresAt: number; refreshToken?: string }
>();

// ============================================================
// Types
// ============================================================
interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  token_type: 'Bearer';
  scope?: string;
}

// ============================================================
// Get Access Token
// ============================================================
/**
 * Obține access token pentru REGES API
 *
 * Flow:
 * 1. Verifică cache (dacă token încă valid)
 * 2. Dacă nu, decriptează credențialele
 * 3. Apelează OpenID Connect token endpoint
 * 4. Cache token pentru refolosire
 *
 * @param connectionId - ID conexiune REGES (pentru cache)
 * @param encryptedCreds - Credențiale criptate (din DB)
 * @returns JWT access token
 *
 * @throws Error dacă autentificarea fail
 */
export async function getAccessToken(
  connectionId: string,
  encryptedCreds: string
): Promise<string> {
  // Check cache
  const cached = tokenCache.get(connectionId);
  if (cached && cached.expiresAt > Date.now()) {
    console.log(`[REGES Auth] Using cached token for connection ${connectionId}`);
    return cached.token;
  }

  console.log(`[REGES Auth] Fetching new token for connection ${connectionId}`);

  // Decrypt credentials
  const { username, password } = decryptCredentials(encryptedCreds);

  const clientSecret = process.env.REGES_CLIENT_SECRET;
  if (!clientSecret) {
    throw new Error(
      'REGES_CLIENT_SECRET not set in environment. ' +
        'Get it from official REGES documentation.'
    );
  }

  // Request token from REGES OpenID
  try {
    const response = await fetch(REGES_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: CLIENT_ID,
        client_secret: clientSecret,
        username,
        password,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `REGES authentication failed: ${response.status} ${response.statusText}. ` +
          `Details: ${errorText}`
      );
    }

    const data: TokenResponse = await response.json();

    // Validate response
    if (!data.access_token || !data.expires_in) {
      throw new Error('Invalid token response from REGES (missing access_token or expires_in)');
    }

    // Calculate expiry (with 5 min safety margin)
    const expiresIn = data.expires_in - 300; // subtract 5 minutes
    const expiresAt = Date.now() + expiresIn * 1000;

    // Cache token
    tokenCache.set(connectionId, {
      token: data.access_token,
      expiresAt,
      refreshToken: data.refresh_token,
    });

    console.log(
      `[REGES Auth] Token obtained successfully. Expires in ${Math.floor(expiresIn / 60)} minutes.`
    );

    return data.access_token;
  } catch (error) {
    console.error('[REGES Auth] Error fetching token:', error);

    // Clear cache on error
    tokenCache.delete(connectionId);

    throw new Error(
      `Failed to authenticate with REGES: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

// ============================================================
// Clear Token Cache
// ============================================================
/**
 * Șterge token din cache (util când se schimbă credențialele)
 *
 * @param connectionId - ID conexiune REGES
 */
export function clearTokenCache(connectionId: string): void {
  const deleted = tokenCache.delete(connectionId);
  if (deleted) {
    console.log(`[REGES Auth] Cleared token cache for connection ${connectionId}`);
  }
}

/**
 * Șterge toate token-urile din cache
 */
export function clearAllTokens(): void {
  const size = tokenCache.size;
  tokenCache.clear();
  console.log(`[REGES Auth] Cleared all tokens (${size} entries)`);
}

// ============================================================
// Get Cache Stats (pentru debugging)
// ============================================================
/**
 * Obține statistici cache (pentru debugging)
 */
export function getCacheStats(): {
  totalEntries: number;
  activeTokens: number;
  expiredTokens: number;
} {
  const now = Date.now();
  let activeTokens = 0;
  let expiredTokens = 0;

  for (const [, value] of tokenCache) {
    if (value.expiresAt > now) {
      activeTokens++;
    } else {
      expiredTokens++;
    }
  }

  return {
    totalEntries: tokenCache.size,
    activeTokens,
    expiredTokens,
  };
}
