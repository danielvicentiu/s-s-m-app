// S-S-M.RO — ENCRYPTION UTILITY
// AES-256-GCM encryption for sensitive data (CNP, medical records)
// Web Crypto API for secure encryption at rest

/**
 * Encrypted data structure stored in database
 */
export interface EncryptedData {
  encryptedData: string // Base64-encoded ciphertext
  iv: string // Base64-encoded initialization vector
  version: number // Encryption version for future migrations
}

/**
 * Configuration for selective field encryption
 */
export interface EncryptionConfig {
  fields: string[] // Field names to encrypt
  version?: number // Encryption version (default: 1)
}

// Encryption version for future key rotation
const ENCRYPTION_VERSION = 1

// Algorithm configuration
const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256
const IV_LENGTH = 12 // 96 bits recommended for GCM

/**
 * Derives encryption key from environment variable
 * Uses PBKDF2 for key derivation with a static salt
 *
 * IMPORTANT: Set ENCRYPTION_KEY environment variable (minimum 32 characters)
 */
async function deriveKey(): Promise<CryptoKey> {
  const keyMaterial = process.env.ENCRYPTION_KEY

  if (!keyMaterial || keyMaterial.length < 32) {
    throw new Error('ENCRYPTION_KEY must be set and at least 32 characters long')
  }

  // Convert key material to bytes
  const encoder = new TextEncoder()
  const keyBytes = encoder.encode(keyMaterial)

  // Import key material
  const importedKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    'PBKDF2',
    false,
    ['deriveKey']
  )

  // Static salt (in production, consider using a unique salt per organization)
  const salt = encoder.encode('s-s-m.ro-encryption-salt-v1')

  // Derive AES-GCM key
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    importedKey,
    {
      name: ALGORITHM,
      length: KEY_LENGTH
    },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * Encrypts plaintext string using AES-256-GCM
 *
 * @param plaintext - Data to encrypt
 * @returns Encrypted data with IV and version
 */
export async function encrypt(plaintext: string): Promise<EncryptedData> {
  if (!plaintext) {
    throw new Error('Cannot encrypt empty data')
  }

  try {
    const key = await deriveKey()
    const encoder = new TextEncoder()
    const data = encoder.encode(plaintext)

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))

    // Encrypt data
    const encrypted = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv
      },
      key,
      data
    )

    // Convert to base64 for storage
    return {
      encryptedData: Buffer.from(encrypted).toString('base64'),
      iv: Buffer.from(iv).toString('base64'),
      version: ENCRYPTION_VERSION
    }
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * Decrypts encrypted data using AES-256-GCM
 *
 * @param encrypted - Encrypted data structure
 * @returns Decrypted plaintext
 */
export async function decrypt(encrypted: EncryptedData): Promise<string> {
  if (!encrypted?.encryptedData || !encrypted?.iv) {
    throw new Error('Invalid encrypted data structure')
  }

  try {
    const key = await deriveKey()

    // Decode from base64
    const encryptedData = Buffer.from(encrypted.encryptedData, 'base64')
    const iv = Buffer.from(encrypted.iv, 'base64')

    // Decrypt data
    const decrypted = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv
      },
      key,
      encryptedData
    )

    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data - data may be corrupted or key is incorrect')
  }
}

/**
 * Encrypts specific fields in an object selectively
 * Useful for encrypting only sensitive fields (CNP, medical data)
 *
 * @param data - Object with fields to encrypt
 * @param config - Configuration specifying which fields to encrypt
 * @returns Object with encrypted fields
 */
export async function encryptSensitiveFields<T extends Record<string, any>>(
  data: T,
  config: EncryptionConfig
): Promise<T> {
  if (!data || typeof data !== 'object') {
    throw new Error('Data must be an object')
  }

  if (!config?.fields || config.fields.length === 0) {
    throw new Error('Must specify at least one field to encrypt')
  }

  const result = { ...data } as T

  for (const field of config.fields) {
    if (field in data && data[field] !== null && data[field] !== undefined) {
      const value = String(data[field])
      const encrypted = await encrypt(value)
      ;(result as any)[field] = JSON.stringify(encrypted)
    }
  }

  return result
}

/**
 * Decrypts specific fields in an object selectively
 * Counterpart to encryptSensitiveFields
 *
 * @param data - Object with encrypted fields
 * @param config - Configuration specifying which fields to decrypt
 * @returns Object with decrypted fields
 */
export async function decryptSensitiveFields<T extends Record<string, any>>(
  data: T,
  config: EncryptionConfig
): Promise<T> {
  if (!data || typeof data !== 'object') {
    throw new Error('Data must be an object')
  }

  if (!config?.fields || config.fields.length === 0) {
    throw new Error('Must specify at least one field to decrypt')
  }

  const result = { ...data } as T

  for (const field of config.fields) {
    if (field in data && data[field] !== null && data[field] !== undefined) {
      try {
        const encrypted = JSON.parse(String(data[field])) as EncryptedData
        const decrypted = await decrypt(encrypted)
        ;(result as any)[field] = decrypted
      } catch (error) {
        console.error(`Failed to decrypt field ${field}:`, error)
        // Keep original value if decryption fails
        ;(result as any)[field] = data[field]
      }
    }
  }

  return result
}

/**
 * Checks if a value is encrypted (has EncryptedData structure)
 *
 * @param value - Value to check
 * @returns True if value appears to be encrypted
 */
export function isEncrypted(value: any): value is string {
  if (typeof value !== 'string') return false

  try {
    const parsed = JSON.parse(value)
    return (
      parsed &&
      typeof parsed === 'object' &&
      'encryptedData' in parsed &&
      'iv' in parsed &&
      'version' in parsed
    )
  } catch {
    return false
  }
}

/**
 * Hashes sensitive data using SHA-256 for indexing/searching
 * Use for CNP hashing where you need to search but not decrypt
 *
 * @param data - Data to hash
 * @returns Hex-encoded hash
 */
export async function hashForIndex(data: string): Promise<string> {
  if (!data) {
    throw new Error('Cannot hash empty data')
  }

  const encoder = new TextEncoder()
  const dataBytes = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes)

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Example usage for medical records with CNP
 */
export async function encryptMedicalData(data: {
  cnp: string
  employee_name: string
  restrictions?: string
}) {
  // Encrypt CNP
  const encryptedCnp = await encrypt(data.cnp)

  // Hash CNP for searching
  const cnpHash = await hashForIndex(data.cnp)

  // Optionally encrypt restrictions if they contain sensitive medical info
  const result: any = {
    cnp_encrypted: JSON.stringify(encryptedCnp),
    cnp_hash: cnpHash,
    employee_name: data.employee_name
  }

  if (data.restrictions) {
    const encryptedRestrictions = await encrypt(data.restrictions)
    result.restrictions_encrypted = JSON.stringify(encryptedRestrictions)
  }

  return result
}

/**
 * Decrypts medical data
 */
export async function decryptMedicalData(data: {
  cnp_encrypted?: string
  restrictions_encrypted?: string
  [key: string]: any
}) {
  const result: any = { ...data }

  if (data.cnp_encrypted) {
    const encrypted = JSON.parse(data.cnp_encrypted) as EncryptedData
    result.cnp = await decrypt(encrypted)
    delete result.cnp_encrypted
  }

  if (data.restrictions_encrypted) {
    const encrypted = JSON.parse(data.restrictions_encrypted) as EncryptedData
    result.restrictions = await decrypt(encrypted)
    delete result.restrictions_encrypted
  }

  return result
}
