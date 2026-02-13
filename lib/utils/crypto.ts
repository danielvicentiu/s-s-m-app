/**
 * Cryptographic utility functions using Web Crypto API
 * All functions are async and use secure random generation
 */

/**
 * Generates a cryptographically secure random ID
 * @param length - Length of the ID in characters (default: 16)
 * @returns Random hex string
 */
export async function generateId(length: number = 16): Promise<string> {
  const bytes = new Uint8Array(Math.ceil(length / 2));
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length);
}

/**
 * Generates a cryptographically secure random token
 * @param length - Length of the token in characters (default: 32)
 * @returns Random base64url string
 */
export async function generateToken(length: number = 32): Promise<string> {
  const bytes = new Uint8Array(Math.ceil((length * 3) / 4));
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
    .slice(0, length);
}

/**
 * Hashes a string using SHA-256
 * @param str - String to hash
 * @returns Hex-encoded hash string
 */
export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Compares a string with a hash (constant-time comparison)
 * @param str - Original string
 * @param hash - Hash to compare against
 * @returns True if the hash matches
 */
export async function compareHash(str: string, hash: string): Promise<boolean> {
  const newHash = await hashString(str);

  // Constant-time comparison to prevent timing attacks
  if (newHash.length !== hash.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < newHash.length; i++) {
    result |= newHash.charCodeAt(i) ^ hash.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Generates an API key with a prefix
 * @param prefix - Prefix for the API key (e.g., 'sk', 'pk')
 * @returns API key in format: prefix_randomToken
 */
export async function generateApiKey(prefix: string = 'sk'): Promise<string> {
  const token = await generateToken(32);
  return `${prefix}_${token}`;
}
