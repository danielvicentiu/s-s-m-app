/**
 * Password Policy Security Test Suite
 *
 * Tests comprehensive password validation and strength calculation including:
 * - Minimum length requirement enforcement
 * - Uppercase letter requirement
 * - Number requirement
 * - Common password detection
 * - Strong password acceptance
 * - Strength score calculation (0-100)
 * - Password reuse prevention
 * - Edge cases (empty, special characters)
 */

import {
  validatePassword,
  getPasswordStrength,
  DEFAULT_POLICY,
  type PasswordPolicy,
} from '@/lib/security/password-policy';

describe('Password Policy Security Tests', () => {
  describe('Password Validation', () => {
    test('rejects password shorter than minimum length', () => {
      const result = validatePassword('Abc1!', [], DEFAULT_POLICY);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Parola trebuie să aibă minimum 8 caractere');
    });

    test('rejects password without uppercase letter', () => {
      const result = validatePassword('abcdef123!', [], DEFAULT_POLICY);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Parola trebuie să conțină cel puțin o literă mare');
    });

    test('rejects password without number', () => {
      const result = validatePassword('Abcdefgh!', [], DEFAULT_POLICY);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Parola trebuie să conțină cel puțin o cifră');
    });

    test('rejects common password from blocklist', () => {
      // Test multiple common passwords from the blocklist
      const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];

      commonPasswords.forEach((pwd) => {
        const result = validatePassword(pwd, [], DEFAULT_POLICY);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
          'Această parolă este prea comună și nu poate fi folosită'
        );
      });
    });

    test('accepts strong password meeting all requirements', () => {
      const strongPasswords = [
        'MyS3cur3P@ssw0rd!',
        'T3st!ngStr0ng#Pass',
        'C0mpl3x&S@feP@ss',
        'V3ryG00d!P@ssw0rd',
      ];

      strongPasswords.forEach((pwd) => {
        const result = validatePassword(pwd, [], DEFAULT_POLICY);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    test('rejects reused password from history', () => {
      const password = 'MyS3cur3P@ssw0rd!';
      const previousPasswords = [
        'OldP@ssw0rd1!',
        'OldP@ssw0rd2!',
        password, // Current password in history
        'OldP@ssw0rd3!',
      ];

      const result = validatePassword(password, previousPasswords, DEFAULT_POLICY);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        `Parola nu poate fi una din ultimele ${DEFAULT_POLICY.maxReuseHistory} parole folosite`
      );
    });

    test('accepts password not in reuse history', () => {
      const password = 'NewS3cur3P@ssw0rd!';
      const previousPasswords = [
        'OldP@ssw0rd1!',
        'OldP@ssw0rd2!',
        'OldP@ssw0rd3!',
        'OldP@ssw0rd4!',
      ];

      const result = validatePassword(password, previousPasswords, DEFAULT_POLICY);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Password Strength Calculation', () => {
    test('returns very low strength score for empty password', () => {
      const strength = getPasswordStrength('');

      expect(strength.score).toBeLessThan(20);
      expect(strength.label).toBe('Foarte slabă');
    });

    test('returns strength score 100 for highly complex password', () => {
      // Very long password with all character types, no patterns, high entropy
      const complexPassword = 'Xk9#mP2$vL8@nQ5&wR7!bT4%jH6^';

      const strength = getPasswordStrength(complexPassword);

      expect(strength.score).toBe(100);
      expect(strength.label).toBe('Foarte puternică');
    });

    test('calculates low score for weak password', () => {
      const weakPasswords = [
        'abc',
        '12345',
        'password',
        'qwerty',
      ];

      weakPasswords.forEach((pwd) => {
        const strength = getPasswordStrength(pwd);

        expect(strength.score).toBeLessThan(40);
        expect(['Foarte slabă', 'Slabă']).toContain(strength.label);
      });
    });

    test('calculates medium score for moderate password', () => {
      const moderatePasswords = [
        'Abcdef123!',
        'MyTest1234#',
        'StrongP@ss9',
      ];

      moderatePasswords.forEach((pwd) => {
        const strength = getPasswordStrength(pwd);

        expect(strength.score).toBeGreaterThanOrEqual(40);
        expect(strength.score).toBeLessThan(80);
      });
    });

    test('calculates high score for strong password', () => {
      const strongPasswords = [
        'MyS3cur3P@ssw0rd!',
        'T3st!ngStr0ng#Pass',
        'C0mpl3x&S@feP@ss9',
      ];

      strongPasswords.forEach((pwd) => {
        const strength = getPasswordStrength(pwd);

        expect(strength.score).toBeGreaterThanOrEqual(80);
        expect(['Puternică', 'Foarte puternică']).toContain(strength.label);
      });
    });
  });

  describe('Custom Policy Validation', () => {
    test('validates with relaxed policy', () => {
      const relaxedPolicy: PasswordPolicy = {
        minLength: 6,
        requireUppercase: false,
        requireLowercase: true,
        requireNumber: false,
        requireSpecial: false,
        preventCommon: false,
        preventReuse: false,
        maxReuseHistory: 0,
      };

      const result = validatePassword('abcdef', [], relaxedPolicy);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('validates with strict policy requiring special characters', () => {
      const strictPolicy: PasswordPolicy = {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumber: true,
        requireSpecial: true,
        preventCommon: true,
        preventReuse: true,
        maxReuseHistory: 10,
      };

      // Password without special character
      const result1 = validatePassword('MyPassword123', [], strictPolicy);
      expect(result1.valid).toBe(false);
      expect(result1.errors).toContain(
        'Parola trebuie să conțină cel puțin un caracter special'
      );

      // Password with special character
      const result2 = validatePassword('MyPassword123!', [], strictPolicy);
      expect(result2.valid).toBe(true);
      expect(result2.errors).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    test('handles password with Romanian diacritics', () => {
      const result = validatePassword('P@r0lăȚâșt!', [], DEFAULT_POLICY);

      expect(result.valid).toBe(true);
    });

    test('handles very long password', () => {
      const longPassword = 'A1!' + 'x'.repeat(100);

      const result = validatePassword(longPassword, [], DEFAULT_POLICY);

      expect(result.valid).toBe(true);

      const strength = getPasswordStrength(longPassword);
      expect(strength.score).toBeGreaterThan(60);
    });

    test('detects common password case-insensitive', () => {
      const variations = ['PASSWORD', 'PaSsWoRd', 'password'];

      variations.forEach((pwd) => {
        const result = validatePassword(pwd, [], DEFAULT_POLICY);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
          'Această parolă este prea comună și nu poate fi folosită'
        );
      });
    });
  });
});
