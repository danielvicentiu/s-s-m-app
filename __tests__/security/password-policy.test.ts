/**
 * Password Policy Test Suite
 *
 * Tests comprehensive password validation and strength calculation including:
 * - Minimum length requirements
 * - Uppercase letter requirements
 * - Number requirements
 * - Common password prevention
 * - Strong password acceptance
 * - Password strength scoring
 * - Password reuse prevention
 */

import {
  validatePassword,
  getPasswordStrength,
  DEFAULT_POLICY,
  type PasswordPolicy,
} from '@/lib/security/password-policy'

describe('Password Policy Security Tests', () => {
  /**
   * TEST 1: Rejects passwords that are too short
   */
  describe('validatePassword - Minimum Length', () => {
    it('should reject passwords shorter than minimum length', () => {
      const shortPassword = 'Abc123!'
      const result = validatePassword(shortPassword)

      expect(result.valid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]).toContain('minimum 8 caractere')
    })

    it('should reject very short passwords', () => {
      const veryShortPassword = 'Ab1!'
      const result = validatePassword(veryShortPassword)

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors.some(e => e.includes('minimum 8 caractere'))).toBe(true)
    })

    it('should accept passwords at minimum length with all requirements', () => {
      const minLengthPassword = 'Abcd123!'
      const result = validatePassword(minLengthPassword)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  /**
   * TEST 2: Rejects passwords without uppercase letters
   */
  describe('validatePassword - Uppercase Requirement', () => {
    it('should reject passwords without uppercase letters', () => {
      const noUppercase = 'abcdefgh123!'
      const result = validatePassword(noUppercase)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Parola trebuie să conțină cel puțin o literă mare')
    })

    it('should accept passwords with uppercase letters', () => {
      const withUppercase = 'Abcdefgh123!'
      const result = validatePassword(withUppercase)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should accept passwords with multiple uppercase letters', () => {
      const multipleUppercase = 'ABCdefgh123!'
      const result = validatePassword(multipleUppercase)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  /**
   * TEST 3: Rejects passwords without numbers
   */
  describe('validatePassword - Number Requirement', () => {
    it('should reject passwords without numbers', () => {
      const noNumber = 'Abcdefgh!'
      const result = validatePassword(noNumber)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Parola trebuie să conțină cel puțin o cifră')
    })

    it('should accept passwords with numbers', () => {
      const withNumber = 'Abcdefgh1!'
      const result = validatePassword(withNumber)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should accept passwords with multiple numbers', () => {
      const multipleNumbers = 'Abcdefgh123!'
      const result = validatePassword(multipleNumbers)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  /**
   * TEST 4: Rejects common passwords
   */
  describe('validatePassword - Common Password Prevention', () => {
    it('should reject common password "password"', () => {
      const commonPassword = 'password'
      const result = validatePassword(commonPassword)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Această parolă este prea comună și nu poate fi folosită')
    })

    it('should reject common password "123456"', () => {
      const commonPassword = '123456'
      const result = validatePassword(commonPassword)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('prea comună'))).toBe(true)
    })

    it('should reject common password "qwerty"', () => {
      const commonPassword = 'qwerty'
      const result = validatePassword(commonPassword)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('prea comună'))).toBe(true)
    })

    it('should reject common password case-insensitively', () => {
      const commonPassword = 'PASSWORD'
      const result = validatePassword(commonPassword)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('prea comună'))).toBe(true)
    })

    it('should reject common password "password123"', () => {
      const commonPassword = 'password123'
      const result = validatePassword(commonPassword)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('prea comună'))).toBe(true)
    })
  })

  /**
   * TEST 5: Accepts strong passwords meeting all requirements
   */
  describe('validatePassword - Strong Password Acceptance', () => {
    it('should accept strong password with all requirements', () => {
      const strongPassword = 'MyP@ssw0rd2024'
      const result = validatePassword(strongPassword)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should accept complex password with special characters', () => {
      const complexPassword = 'C0mpl3x!P@ssw0rd#2024'
      const result = validatePassword(complexPassword)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should accept long password with variety', () => {
      const longPassword = 'ThisIsAVerySecure!Password123WithManyChars'
      const result = validatePassword(longPassword)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should accept password with different special characters', () => {
      const password = 'Secure$Pass123&Word!'
      const result = validatePassword(password)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  /**
   * TEST 6: Returns very low strength score for empty/weak passwords
   */
  describe('getPasswordStrength - Empty Password', () => {
    it('should return very low score for empty password', () => {
      const emptyPassword = ''
      const result = getPasswordStrength(emptyPassword)

      expect(result.score).toBeLessThan(20)
      expect(result.label).toBe('Foarte slabă')
    })

    it('should return very weak label for weak password', () => {
      const weakPassword = '123'
      const result = getPasswordStrength(weakPassword)

      expect(result.score).toBeLessThanOrEqual(20)
      expect(['Foarte slabă', 'Slabă'].includes(result.label)).toBe(true)
    })
  })

  /**
   * TEST 7: Returns high strength score for complex password
   */
  describe('getPasswordStrength - Complex Password', () => {
    it('should return very high score (90+) for very complex password', () => {
      const complexPassword = 'C0mpl3x!P@ssw0rd#2024$Str0ng&S3cur3'
      const result = getPasswordStrength(complexPassword)

      expect(result.score).toBeGreaterThanOrEqual(90)
      expect(result.label).toBe('Foarte puternică')
    })

    it('should return high score (80+) for strong password', () => {
      const strongPassword = 'MyS3cur3!P@ssw0rd2024'
      const result = getPasswordStrength(strongPassword)

      expect(result.score).toBeGreaterThanOrEqual(80)
      expect(result.label).toBe('Foarte puternică')
    })

    it('should assign high strength to complex password', () => {
      const mediumPassword = 'Medium1Pass!'
      const result = getPasswordStrength(mediumPassword)

      expect(result.score).toBeGreaterThanOrEqual(40)
      expect(['Medie', 'Puternică', 'Foarte puternică'].includes(result.label)).toBe(true)
    })

    it('should penalize common passwords in strength score', () => {
      const commonPassword = 'password'
      const result = getPasswordStrength(commonPassword)

      expect(result.score).toBeLessThanOrEqual(20)
      expect(['Foarte slabă', 'Slabă'].includes(result.label)).toBe(true)
    })
  })

  /**
   * TEST 8: Rejects reused passwords
   */
  describe('validatePassword - Password Reuse Prevention', () => {
    it('should reject password that was recently used', () => {
      const newPassword = 'MySecure123!'
      const previousPasswords = ['OldPass1!', 'MySecure123!', 'AnotherOld1!']
      const result = validatePassword(newPassword, previousPasswords)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Parola nu poate fi una din ultimele 5 parole folosite')
    })

    it('should reject password that matches any in history', () => {
      const newPassword = 'OldPassword1!'
      const previousPasswords = [
        'Recent1!',
        'Recent2!',
        'Recent3!',
        'OldPassword1!',
        'Recent5!',
      ]
      const result = validatePassword(newPassword, previousPasswords)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('ultimele 5 parole'))).toBe(true)
    })

    it('should accept password not in reuse history', () => {
      const newPassword = 'NewSecure123!'
      const previousPasswords = ['OldPass1!', 'OldPass2!', 'OldPass3!']
      const result = validatePassword(newPassword, previousPasswords)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should accept password when history is empty', () => {
      const newPassword = 'FirstPassword1!'
      const previousPasswords: string[] = []
      const result = validatePassword(newPassword, previousPasswords)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should only check recent passwords within maxReuseHistory limit', () => {
      const newPassword = 'VeryOldPass1!'
      // Password is at position 6, but policy only checks last 5
      const previousPasswords = [
        'Recent1!',
        'Recent2!',
        'Recent3!',
        'Recent4!',
        'Recent5!',
        'VeryOldPass1!', // This is beyond the 5-password limit
      ]
      const result = validatePassword(newPassword, previousPasswords)

      // Should be valid because only the first 5 (most recent) are checked
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  /**
   * TEST 9: Validates with custom policy
   */
  describe('validatePassword - Custom Policy', () => {
    it('should accept password without special char when policy allows it', () => {
      const password = 'SimplePass123'
      const customPolicy: PasswordPolicy = {
        ...DEFAULT_POLICY,
        requireSpecial: false,
      }
      const result = validatePassword(password, [], customPolicy)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should accept shorter password with custom minimum length', () => {
      const password = 'Pass1!'
      const customPolicy: PasswordPolicy = {
        ...DEFAULT_POLICY,
        minLength: 6,
      }
      const result = validatePassword(password, [], customPolicy)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should allow common passwords when preventCommon is disabled', () => {
      const password = 'password'
      const customPolicy: PasswordPolicy = {
        ...DEFAULT_POLICY,
        preventCommon: false,
        minLength: 8,
        requireUppercase: false,
        requireNumber: false,
        requireSpecial: false,
      }
      const result = validatePassword(password, [], customPolicy)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  /**
   * TEST 10: Validates multiple requirements simultaneously
   */
  describe('validatePassword - Multiple Requirement Failures', () => {
    it('should return all validation errors for weak password', () => {
      const weakPassword = 'abc'
      const result = validatePassword(weakPassword)

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(1)
      expect(result.errors.some(e => e.includes('minimum 8 caractere'))).toBe(true)
      expect(result.errors.some(e => e.includes('literă mare'))).toBe(true)
      expect(result.errors.some(e => e.includes('cifră'))).toBe(true)
      expect(result.errors.some(e => e.includes('caracter special'))).toBe(true)
    })

    it('should list all missing requirements', () => {
      const password = 'short'
      const result = validatePassword(password)

      expect(result.valid).toBe(false)
      // Should have multiple errors
      expect(result.errors.length).toBeGreaterThanOrEqual(4)
    })

    it('should pass when all requirements are met', () => {
      const password = 'Perfect!Pass123'
      const result = validatePassword(password)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate special character requirement independently', () => {
      const password = 'NoSpecialChar123'
      const result = validatePassword(password)

      expect(result.valid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]).toContain('caracter special')
    })
  })
})
