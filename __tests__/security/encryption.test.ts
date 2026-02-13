/**
 * Encryption Security Test Suite
 *
 * Tests comprehensive encryption functionality including:
 * - AES-256-GCM encryption and decryption
 * - Initialization Vector (IV) randomness
 * - Decryption with wrong key fails
 * - Selective field encryption
 * - Empty string handling
 * - Unicode Romanian character support
 */

import crypto from 'crypto'
import {
  encryptCredentials,
  decryptCredentials,
  generateEncryptionKey,
} from '@/lib/reges/encryption'

// Save original environment
const originalEnv = process.env.REGES_ENCRYPTION_KEY

describe('Encryption Security Tests', () => {
  // Test encryption key (32 bytes, base64 encoded)
  const testKey = crypto.randomBytes(32).toString('base64')
  const alternateKey = crypto.randomBytes(32).toString('base64')

  beforeEach(() => {
    // Set test encryption key
    process.env.REGES_ENCRYPTION_KEY = testKey
  })

  afterEach(() => {
    // Restore original environment
    process.env.REGES_ENCRYPTION_KEY = originalEnv
  })

  /**
   * TEST 1: Encrypt then decrypt returns original data
   */
  describe('Encryption - Roundtrip Integrity', () => {
    it('should encrypt and decrypt credentials correctly', () => {
      const credentials = {
        username: 'user_reges_001',
        password: 'parola_secreta_123',
      }

      const encrypted = encryptCredentials(credentials)
      const decrypted = decryptCredentials(encrypted)

      expect(decrypted.username).toBe(credentials.username)
      expect(decrypted.password).toBe(credentials.password)
      expect(encrypted).not.toContain(credentials.username)
      expect(encrypted).not.toContain(credentials.password)
    })

    it('should handle complex passwords with special characters', () => {
      const credentials = {
        username: 'admin@reges.ro',
        password: 'P@ssw0rd!#$%^&*()_+-=[]{}|;:,.<>?',
      }

      const encrypted = encryptCredentials(credentials)
      const decrypted = decryptCredentials(encrypted)

      expect(decrypted.username).toBe(credentials.username)
      expect(decrypted.password).toBe(credentials.password)
    })

    it('should handle long usernames and passwords', () => {
      const credentials = {
        username: 'a'.repeat(100),
        password: 'b'.repeat(200),
      }

      const encrypted = encryptCredentials(credentials)
      const decrypted = decryptCredentials(encrypted)

      expect(decrypted.username).toBe(credentials.username)
      expect(decrypted.password).toBe(credentials.password)
    })
  })

  /**
   * TEST 2: Different ciphertext each time (IV randomness)
   */
  describe('Encryption - IV Randomness', () => {
    it('should produce different ciphertext for same input due to random IV', () => {
      const credentials = {
        username: 'user_test',
        password: 'password_test',
      }

      const encrypted1 = encryptCredentials(credentials)
      const encrypted2 = encryptCredentials(credentials)

      // Ciphertext should be different
      expect(encrypted1).not.toBe(encrypted2)

      // But both should decrypt to same original
      const decrypted1 = decryptCredentials(encrypted1)
      const decrypted2 = decryptCredentials(encrypted2)

      expect(decrypted1).toEqual(credentials)
      expect(decrypted2).toEqual(credentials)
    })

    it('should use different IV for each encryption', () => {
      const credentials = {
        username: 'test_user',
        password: 'test_pass',
      }

      const encrypted1 = encryptCredentials(credentials)
      const encrypted2 = encryptCredentials(credentials)

      // Extract IVs (first part before ':')
      const iv1 = encrypted1.split(':')[0]
      const iv2 = encrypted2.split(':')[0]

      // IVs should be different
      expect(iv1).not.toBe(iv2)
      expect(iv1).toHaveLength(24) // 16 bytes base64 = 24 chars
      expect(iv2).toHaveLength(24)
    })

    it('should produce valid format with three colon-separated parts', () => {
      const credentials = {
        username: 'user',
        password: 'pass',
      }

      const encrypted = encryptCredentials(credentials)
      const parts = encrypted.split(':')

      expect(parts).toHaveLength(3)
      expect(parts[0]).toBeTruthy() // IV
      expect(parts[1]).toBeTruthy() // Auth tag
      expect(parts[2]).toBeTruthy() // Encrypted data
    })
  })

  /**
   * TEST 3: Wrong key fails decrypt
   */
  describe('Decryption - Key Validation', () => {
    it('should fail decryption with wrong key', () => {
      const credentials = {
        username: 'user_correct',
        password: 'password_correct',
      }

      // Encrypt with first key
      const encrypted = encryptCredentials(credentials)

      // Switch to different key
      process.env.REGES_ENCRYPTION_KEY = alternateKey

      // Decryption should fail
      expect(() => {
        decryptCredentials(encrypted)
      }).toThrow(/Failed to decrypt credentials/)
    })

    it('should fail with corrupted ciphertext', () => {
      const credentials = {
        username: 'user',
        password: 'pass',
      }

      const encrypted = encryptCredentials(credentials)

      // Corrupt the ciphertext
      const parts = encrypted.split(':')
      const corrupted = parts[0] + ':' + parts[1] + ':' + 'corrupted_data'

      expect(() => {
        decryptCredentials(corrupted)
      }).toThrow(/Failed to decrypt credentials/)
    })

    it('should fail with invalid format', () => {
      const invalidEncrypted = 'invalid:format'

      expect(() => {
        decryptCredentials(invalidEncrypted)
      }).toThrow(/Invalid encrypted credentials format/)
    })

    it('should fail with missing encryption key', () => {
      delete process.env.REGES_ENCRYPTION_KEY

      const credentials = {
        username: 'user',
        password: 'pass',
      }

      expect(() => {
        encryptCredentials(credentials)
      }).toThrow(/REGES_ENCRYPTION_KEY not set/)
    })
  })

  /**
   * TEST 4: Encrypts sensitive fields selectively
   */
  describe('Encryption - Selective Field Encryption', () => {
    it('should encrypt only username and password fields', () => {
      const credentials = {
        username: 'sensitive_user',
        password: 'sensitive_pass',
      }

      const encrypted = encryptCredentials(credentials)

      // Encrypted string should not contain plaintext values
      expect(encrypted).not.toContain('sensitive_user')
      expect(encrypted).not.toContain('sensitive_pass')

      // Should be base64 format (only alphanumeric, +, /, =, and :)
      expect(encrypted).toMatch(/^[A-Za-z0-9+/=:]+$/)
    })

    it('should preserve exact username and password after decryption', () => {
      const credentials = {
        username: 'user@domain.com',
        password: 'MyP@ssw0rd!2024',
      }

      const encrypted = encryptCredentials(credentials)
      const decrypted = decryptCredentials(encrypted)

      expect(decrypted).toEqual(credentials)
      expect(Object.keys(decrypted)).toHaveLength(2)
      expect(Object.keys(decrypted)).toContain('username')
      expect(Object.keys(decrypted)).toContain('password')
    })
  })

  /**
   * TEST 5: Handles empty string
   */
  describe('Encryption - Empty String Handling', () => {
    it('should reject empty username during decryption validation', () => {
      const credentials = {
        username: '',
        password: 'password123',
      }

      const encrypted = encryptCredentials(credentials)

      // Decryption should fail validation because username is empty
      expect(() => {
        decryptCredentials(encrypted)
      }).toThrow(/Failed to decrypt credentials/)
    })

    it('should reject empty password during decryption validation', () => {
      const credentials = {
        username: 'user123',
        password: '',
      }

      const encrypted = encryptCredentials(credentials)

      // Decryption should fail validation because password is empty
      expect(() => {
        decryptCredentials(encrypted)
      }).toThrow(/Failed to decrypt credentials/)
    })

    it('should reject both empty username and password during decryption validation', () => {
      const credentials = {
        username: '',
        password: '',
      }

      const encrypted = encryptCredentials(credentials)

      // Decryption should fail validation because both are empty
      expect(() => {
        decryptCredentials(encrypted)
      }).toThrow(/Failed to decrypt credentials/)
    })
  })

  /**
   * TEST 6: Handles unicode Romanian characters
   */
  describe('Encryption - Unicode Romanian Characters', () => {
    it('should correctly encrypt and decrypt Romanian diacritics', () => {
      const credentials = {
        username: 'utilizator_român_ăîșțâ',
        password: 'parolă_șîțăâ_2024',
      }

      const encrypted = encryptCredentials(credentials)
      const decrypted = decryptCredentials(encrypted)

      expect(decrypted.username).toBe(credentials.username)
      expect(decrypted.password).toBe(credentials.password)

      // Verify specific Romanian characters are preserved in username
      expect(decrypted.username).toContain('ă')
      expect(decrypted.username).toContain('î')
      expect(decrypted.username).toContain('ș')
      expect(decrypted.username).toContain('ț')
      expect(decrypted.username).toContain('â')

      // Verify specific Romanian characters are preserved in password
      expect(decrypted.password).toContain('ă')
      expect(decrypted.password).toContain('ș')
      expect(decrypted.password).toContain('î')
      expect(decrypted.password).toContain('ț')
      expect(decrypted.password).toContain('â')
    })

    it('should handle all Romanian special characters', () => {
      const credentials = {
        username: 'ĂÎȘȚÂ_ăîșțâ',
        password: 'Șeful_Țării_Întregi_Având_Probleme',
      }

      const encrypted = encryptCredentials(credentials)
      const decrypted = decryptCredentials(encrypted)

      expect(decrypted.username).toBe(credentials.username)
      expect(decrypted.password).toBe(credentials.password)
    })

    it('should handle mixed Unicode characters from multiple languages', () => {
      const credentials = {
        username: 'user_münchen_straße_română_ăîșțâ',
        password: 'паролă_中文_日本語_한글',
      }

      const encrypted = encryptCredentials(credentials)
      const decrypted = decryptCredentials(encrypted)

      expect(decrypted.username).toBe(credentials.username)
      expect(decrypted.password).toBe(credentials.password)
    })

    it('should preserve emoji characters', () => {
      const credentials = {
        username: 'user_🔐_secure',
        password: 'pass_✅_🇷🇴_verified',
      }

      const encrypted = encryptCredentials(credentials)
      const decrypted = decryptCredentials(encrypted)

      expect(decrypted.username).toBe(credentials.username)
      expect(decrypted.password).toBe(credentials.password)
    })
  })

  /**
   * TEST 7: Key generation produces valid keys
   */
  describe('Key Generation', () => {
    it('should generate valid 32-byte base64 keys', () => {
      const key = generateEncryptionKey()

      // Should be base64 string
      expect(key).toMatch(/^[A-Za-z0-9+/=]+$/)

      // Should decode to 32 bytes
      const keyBuffer = Buffer.from(key, 'base64')
      expect(keyBuffer.length).toBe(32)
    })

    it('should generate different keys each time', () => {
      const key1 = generateEncryptionKey()
      const key2 = generateEncryptionKey()
      const key3 = generateEncryptionKey()

      expect(key1).not.toBe(key2)
      expect(key2).not.toBe(key3)
      expect(key1).not.toBe(key3)
    })

    it('generated key should work for encryption', () => {
      const newKey = generateEncryptionKey()
      process.env.REGES_ENCRYPTION_KEY = newKey

      const credentials = {
        username: 'test_user',
        password: 'test_password',
      }

      const encrypted = encryptCredentials(credentials)
      const decrypted = decryptCredentials(encrypted)

      expect(decrypted).toEqual(credentials)
    })
  })

  /**
   * TEST 8: Authentication tag validation
   */
  describe('Encryption - Authentication Tag Validation', () => {
    it('should fail decryption with tampered authentication tag', () => {
      const credentials = {
        username: 'user_auth',
        password: 'pass_auth',
      }

      const encrypted = encryptCredentials(credentials)
      const parts = encrypted.split(':')

      // Tamper with auth tag (second part)
      const tamperedTag = Buffer.from(parts[1], 'base64')
      tamperedTag[0] = tamperedTag[0] ^ 0xff // Flip bits
      const tampered = parts[0] + ':' + tamperedTag.toString('base64') + ':' + parts[2]

      expect(() => {
        decryptCredentials(tampered)
      }).toThrow(/Failed to decrypt credentials/)
    })

    it('should fail decryption with tampered IV', () => {
      const credentials = {
        username: 'user_iv',
        password: 'pass_iv',
      }

      const encrypted = encryptCredentials(credentials)
      const parts = encrypted.split(':')

      // Tamper with IV (first part)
      const tamperedIV = Buffer.from(parts[0], 'base64')
      tamperedIV[0] = tamperedIV[0] ^ 0xff // Flip bits
      const tampered = tamperedIV.toString('base64') + ':' + parts[1] + ':' + parts[2]

      expect(() => {
        decryptCredentials(tampered)
      }).toThrow(/Failed to decrypt credentials/)
    })

    it('should fail decryption with tampered encrypted data', () => {
      const credentials = {
        username: 'user_data',
        password: 'pass_data',
      }

      const encrypted = encryptCredentials(credentials)
      const parts = encrypted.split(':')

      // Tamper with encrypted data (third part)
      const tamperedData = Buffer.from(parts[2], 'base64')
      tamperedData[0] = tamperedData[0] ^ 0xff // Flip bits
      const tampered = parts[0] + ':' + parts[1] + ':' + tamperedData.toString('base64')

      expect(() => {
        decryptCredentials(tampered)
      }).toThrow(/Failed to decrypt credentials/)
    })
  })
})
