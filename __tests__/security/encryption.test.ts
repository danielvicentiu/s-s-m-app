/**
 * Encryption Security Test Suite
 *
 * Tests comprehensive encryption functionality including:
 * - Encrypt/decrypt round-trip integrity
 * - IV randomization (different ciphertext each time)
 * - Wrong key rejection
 * - Selective field encryption
 * - Empty string handling
 * - Unicode Romanian character support
 * - Data integrity verification
 * - Authentication tag validation
 */

import crypto from 'crypto'
import {
  encryptCredentials,
  decryptCredentials,
  generateEncryptionKey,
} from '@/lib/reges/encryption'

// Store original env
const originalEnv = process.env.REGES_ENCRYPTION_KEY

describe('Encryption Security Tests', () => {
  // Setup test encryption key before each test
  beforeEach(() => {
    process.env.REGES_ENCRYPTION_KEY = crypto.randomBytes(32).toString('base64')
  })

  // Restore original env after each test
  afterEach(() => {
    process.env.REGES_ENCRYPTION_KEY = originalEnv
  })

  /**
   * TEST 1: Encrypt then decrypt returns original data
   * Validates round-trip encryption integrity
   */
  describe('Round-trip Encryption', () => {
    it('should decrypt encrypted credentials to original values', () => {
      const original = {
        username: 'user_reges_001',
        password: 'parola_secreta_123!',
      }

      const encrypted = encryptCredentials(original)
      const decrypted = decryptCredentials(encrypted)

      expect(decrypted.username).toBe(original.username)
      expect(decrypted.password).toBe(original.password)
    })

    it('should handle complex credentials with special characters', () => {
      const original = {
        username: 'admin@reges.ro',
        password: 'P@ssw0rd!#$%^&*()',
      }

      const encrypted = encryptCredentials(original)
      const decrypted = decryptCredentials(encrypted)

      expect(decrypted).toEqual(original)
    })
  })

  /**
   * TEST 2: Different ciphertext each time (IV randomization)
   * Ensures each encryption uses a unique IV for security
   */
  describe('IV Randomization', () => {
    it('should produce different ciphertext for same plaintext', () => {
      const credentials = {
        username: 'test_user',
        password: 'same_password',
      }

      const encrypted1 = encryptCredentials(credentials)
      const encrypted2 = encryptCredentials(credentials)

      // Ciphertext should be different
      expect(encrypted1).not.toBe(encrypted2)

      // But both should decrypt to same value
      const decrypted1 = decryptCredentials(encrypted1)
      const decrypted2 = decryptCredentials(encrypted2)

      expect(decrypted1).toEqual(credentials)
      expect(decrypted2).toEqual(credentials)
      expect(decrypted1).toEqual(decrypted2)
    })

    it('should use different IVs for multiple encryptions', () => {
      const credentials = { username: 'user', password: 'pass' }

      const encrypted1 = encryptCredentials(credentials)
      const encrypted2 = encryptCredentials(credentials)
      const encrypted3 = encryptCredentials(credentials)

      // Extract IVs (first part before first colon)
      const iv1 = encrypted1.split(':')[0]
      const iv2 = encrypted2.split(':')[0]
      const iv3 = encrypted3.split(':')[0]

      // All IVs should be different
      expect(iv1).not.toBe(iv2)
      expect(iv2).not.toBe(iv3)
      expect(iv1).not.toBe(iv3)
    })
  })

  /**
   * TEST 3: Wrong key fails decrypt
   * Validates authentication and key verification
   */
  describe('Wrong Key Rejection', () => {
    it('should fail to decrypt with wrong encryption key', () => {
      const credentials = {
        username: 'user_test',
        password: 'password_test',
      }

      // Encrypt with first key
      const encrypted = encryptCredentials(credentials)

      // Change encryption key
      process.env.REGES_ENCRYPTION_KEY = crypto.randomBytes(32).toString('base64')

      // Decrypt should fail with wrong key
      expect(() => {
        decryptCredentials(encrypted)
      }).toThrow('Failed to decrypt credentials')
    })

    it('should fail with corrupted authentication tag', () => {
      const credentials = { username: 'user', password: 'pass' }
      const encrypted = encryptCredentials(credentials)

      // Corrupt the auth tag (second part)
      const parts = encrypted.split(':')
      parts[1] = 'corrupted_tag_xxxx'
      const corrupted = parts.join(':')

      expect(() => {
        decryptCredentials(corrupted)
      }).toThrow('Failed to decrypt credentials')
    })

    it('should fail with invalid encryption format', () => {
      const invalidFormats = [
        'invalid',
        'only:two:parts', // technically valid format but will fail decryption
        '',
        'a:b', // only 2 parts
      ]

      invalidFormats.forEach((invalid) => {
        expect(() => {
          decryptCredentials(invalid)
        }).toThrow()
      })
    })
  })

  /**
   * TEST 4: Encrypts sensitive fields selectively
   * Validates that only username and password are encrypted
   */
  describe('Selective Field Encryption', () => {
    it('should only encrypt username and password fields', () => {
      const credentials = {
        username: 'user_selective',
        password: 'pass_selective',
      }

      const encrypted = encryptCredentials(credentials)
      const decrypted = decryptCredentials(encrypted)

      // Should only contain username and password
      expect(Object.keys(decrypted)).toEqual(['username', 'password'])
      expect(decrypted.username).toBe(credentials.username)
      expect(decrypted.password).toBe(credentials.password)
    })

    it('should validate decrypted structure contains required fields', () => {
      const credentials = {
        username: 'user_validation',
        password: 'pass_validation',
      }

      const encrypted = encryptCredentials(credentials)

      // Manually corrupt the encrypted data to remove password field
      const key = Buffer.from(process.env.REGES_ENCRYPTION_KEY!, 'base64')
      const [ivB64, , ] = encrypted.split(':')
      const iv = Buffer.from(ivB64, 'base64')

      // Encrypt invalid data (missing password)
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
      const invalidData = JSON.stringify({ username: 'only_user' })
      const encryptedInvalid = Buffer.concat([
        cipher.update(invalidData, 'utf8'),
        cipher.final(),
      ])
      const tag = cipher.getAuthTag()

      const corruptedEncrypted = [
        iv.toString('base64'),
        tag.toString('base64'),
        encryptedInvalid.toString('base64'),
      ].join(':')

      // Should fail validation
      expect(() => {
        decryptCredentials(corruptedEncrypted)
      }).toThrow('Decrypted data missing username or password')
    })
  })

  /**
   * TEST 5: Handles empty string
   * Validates edge case handling and validation behavior
   */
  describe('Empty String Handling', () => {
    it('should reject empty username and password during validation', () => {
      const credentials = {
        username: '',
        password: '',
      }

      const encrypted = encryptCredentials(credentials)

      // Empty strings should fail validation on decrypt
      expect(() => {
        decryptCredentials(encrypted)
      }).toThrow('Decrypted data missing username or password')
    })

    it('should handle non-empty username with empty password', () => {
      const credentials = {
        username: 'user_with_empty_pass',
        password: '',
      }

      const encrypted = encryptCredentials(credentials)

      // Empty password should fail validation
      expect(() => {
        decryptCredentials(encrypted)
      }).toThrow('Decrypted data missing username or password')
    })

    it('should handle empty username with non-empty password', () => {
      const credentials = {
        username: '',
        password: 'password_with_empty_user',
      }

      const encrypted = encryptCredentials(credentials)

      // Empty username should fail validation
      expect(() => {
        decryptCredentials(encrypted)
      }).toThrow('Decrypted data missing username or password')
    })

    it('should handle whitespace-only credentials as valid', () => {
      const credentials = {
        username: '   ',
        password: '   ',
      }

      const encrypted = encryptCredentials(credentials)
      const decrypted = decryptCredentials(encrypted)

      // Whitespace strings are valid (not empty)
      expect(decrypted.username).toBe('   ')
      expect(decrypted.password).toBe('   ')
    })
  })

  /**
   * TEST 6: Handles Unicode Romanian characters
   * Validates UTF-8 encoding support for Romanian diacritics
   */
  describe('Unicode Romanian Character Support', () => {
    it('should correctly encrypt and decrypt Romanian diacritics', () => {
      const credentials = {
        username: 'utilizator_română',
        password: 'parolă_secretă_șțîâă',
      }

      const encrypted = encryptCredentials(credentials)
      const decrypted = decryptCredentials(encrypted)

      expect(decrypted.username).toBe(credentials.username)
      expect(decrypted.password).toBe(credentials.password)
    })

    it('should handle all Romanian diacritics (ă, â, î, ș, ț)', () => {
      const credentials = {
        username: 'ĂÂÎȘȚ_ăâîșț_test',
        password: 'Țară_Frumoasă_Într-o_Vară',
      }

      const encrypted = encryptCredentials(credentials)
      const decrypted = decryptCredentials(encrypted)

      expect(decrypted).toEqual(credentials)
    })

    it('should handle mixed Romanian and special characters', () => {
      const credentials = {
        username: 'admin@ssm.ro',
        password: 'P@ssw0rd_Română_2024!șțăîâ',
      }

      const encrypted = encryptCredentials(credentials)
      const decrypted = decryptCredentials(encrypted)

      expect(decrypted.username).toBe(credentials.username)
      expect(decrypted.password).toBe(credentials.password)
    })

    it('should handle multi-line Romanian text', () => {
      const credentials = {
        username: 'user\ncu\nmulte\nlinii',
        password: 'parolă\npe\nmulte\nrânduri\ncu\nșțăîâ',
      }

      const encrypted = encryptCredentials(credentials)
      const decrypted = decryptCredentials(encrypted)

      expect(decrypted).toEqual(credentials)
    })
  })

  /**
   * TEST 7: Encryption key generation
   * Validates helper function for key generation
   */
  describe('Encryption Key Generation', () => {
    it('should generate valid base64 encryption key', () => {
      const key = generateEncryptionKey()

      // Should be base64 string
      expect(typeof key).toBe('string')
      expect(key.length).toBeGreaterThan(0)

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

    it('should generate keys that work for encryption', () => {
      const newKey = generateEncryptionKey()
      process.env.REGES_ENCRYPTION_KEY = newKey

      const credentials = { username: 'test', password: 'test123' }
      const encrypted = encryptCredentials(credentials)
      const decrypted = decryptCredentials(encrypted)

      expect(decrypted).toEqual(credentials)
    })
  })

  /**
   * TEST 8: Error handling and edge cases
   * Validates proper error handling
   */
  describe('Error Handling', () => {
    it('should throw error when encryption key is not set', () => {
      delete process.env.REGES_ENCRYPTION_KEY

      const credentials = { username: 'user', password: 'pass' }

      expect(() => {
        encryptCredentials(credentials)
      }).toThrow('REGES_ENCRYPTION_KEY not set in environment')
    })

    it('should throw error when encryption key is invalid length', () => {
      // Invalid key length (not 32 bytes)
      process.env.REGES_ENCRYPTION_KEY = crypto.randomBytes(16).toString('base64')

      const credentials = { username: 'user', password: 'pass' }

      expect(() => {
        encryptCredentials(credentials)
      }).toThrow('REGES_ENCRYPTION_KEY must be 32 bytes')
    })

    it('should throw error when encryption key is not base64', () => {
      process.env.REGES_ENCRYPTION_KEY = 'not-a-valid-base64-key!!!'

      const credentials = { username: 'user', password: 'pass' }

      expect(() => {
        encryptCredentials(credentials)
      }).toThrow('Invalid REGES_ENCRYPTION_KEY format')
    })

    it('should handle very long credentials', () => {
      const credentials = {
        username: 'a'.repeat(1000),
        password: 'b'.repeat(1000),
      }

      const encrypted = encryptCredentials(credentials)
      const decrypted = decryptCredentials(encrypted)

      expect(decrypted).toEqual(credentials)
    })
  })
})
