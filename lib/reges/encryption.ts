// ============================================================
// S-S-M.RO — REGES Encryption Utilities
// File: lib/reges/encryption.ts
//
// Criptare credențiale REGES (username + password) cu AES-256-GCM
// Folosește Node.js crypto nativ (fără dependențe externe)
// ============================================================

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32; // 256 bits

// ============================================================
// Get encryption key from environment
// ============================================================
function getEncryptionKey(): Buffer {
  const key = process.env.REGES_ENCRYPTION_KEY;

  if (!key) {
    throw new Error(
      'REGES_ENCRYPTION_KEY not set in environment. ' +
      'Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"'
    );
  }

  try {
    const keyBuffer = Buffer.from(key, 'base64');

    if (keyBuffer.length !== KEY_LENGTH) {
      throw new Error(
        `REGES_ENCRYPTION_KEY must be ${KEY_LENGTH} bytes (base64 encoded). ` +
        `Got ${keyBuffer.length} bytes.`
      );
    }

    return keyBuffer;
  } catch (error) {
    throw new Error(
      `Invalid REGES_ENCRYPTION_KEY format. Must be base64 encoded 32-byte key. ` +
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// ============================================================
// Encrypt credentials
// ============================================================
/**
 * Criptează credențiale REGES cu AES-256-GCM
 *
 * @param data - Obiect cu username și password
 * @returns String criptat în format: iv:tag:encrypted (toate base64)
 *
 * @example
 * const encrypted = encryptCredentials({
 *   username: 'user_reges_001',
 *   password: 'parola_secreta'
 * });
 */
export function encryptCredentials(data: {
  username: string;
  password: string;
}): string {
  const key = getEncryptionKey();

  // Generate random IV (initialization vector)
  const iv = crypto.randomBytes(IV_LENGTH);

  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  // Encrypt data
  const jsonData = JSON.stringify(data);
  const encrypted = Buffer.concat([
    cipher.update(jsonData, 'utf8'),
    cipher.final(),
  ]);

  // Get authentication tag
  const tag = cipher.getAuthTag();

  // Return format: iv:tag:encrypted (all base64)
  return [
    iv.toString('base64'),
    tag.toString('base64'),
    encrypted.toString('base64'),
  ].join(':');
}

// ============================================================
// Decrypt credentials
// ============================================================
/**
 * Decriptează credențiale REGES
 *
 * @param encrypted - String criptat (format: iv:tag:encrypted)
 * @returns Obiect cu username și password decriptate
 *
 * @example
 * const { username, password } = decryptCredentials(encryptedString);
 */
export function decryptCredentials(encrypted: string): {
  username: string;
  password: string;
} {
  const parts = encrypted.split(':');

  if (parts.length !== 3) {
    throw new Error(
      'Invalid encrypted credentials format. Expected format: iv:tag:encrypted'
    );
  }

  const [ivB64, tagB64, encryptedB64] = parts;

  try {
    const key = getEncryptionKey();
    const iv = Buffer.from(ivB64, 'base64');
    const tag = Buffer.from(tagB64, 'base64');
    const encryptedData = Buffer.from(encryptedB64, 'base64');

    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    // Decrypt data
    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    const jsonData = decrypted.toString('utf8');
    const data = JSON.parse(jsonData);

    // Validate structure
    if (!data.username || !data.password) {
      throw new Error('Decrypted data missing username or password');
    }

    return {
      username: data.username,
      password: data.password,
    };
  } catch (error) {
    throw new Error(
      `Failed to decrypt credentials: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

// ============================================================
// Generate new encryption key (helper for CLI)
// ============================================================
/**
 * Generează o cheie nouă de criptare (32 bytes, base64)
 * Folosește în .env.local ca REGES_ENCRYPTION_KEY
 *
 * @returns Cheie în format base64
 *
 * @example
 * const key = generateEncryptionKey();
 * console.log(`REGES_ENCRYPTION_KEY=${key}`);
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('base64');
}
