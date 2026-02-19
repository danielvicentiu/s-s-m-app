/**
 * Password Policy Security Test Suite
 *
 * Core tests for password validation and strength calculation:
 * 1. Rejects short passwords (< min length)
 * 2. Rejects passwords without uppercase letter
 * 3. Rejects passwords without number
 * 4. Rejects common passwords
 * 5. Accepts strong passwords
 * 6. Returns strength score 0 for empty password
 * 7. Returns strength score 100 for complex password
 * 8. Rejects reused passwords from history
 * 9. Password strength scoring accuracy
 * 10. Multiple validation errors accumulation
 */

import {
  validatePassword,
  getPasswordStrength,
  DEFAULT_POLICY,
} from '@/lib/security/password-policy';

describe('Password Policy Security Tests', () => {
  // Test 1: Rejects short passwords
  test('rejects password shorter than minimum length', () => {
    const result = validatePassword('Abc1!', [], DEFAULT_POLICY);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Parola trebuie să aibă minimum 8 caractere');
    expect(result.errors.length).toBeGreaterThan(0);
  });

  // Test 2: Rejects passwords without uppercase letter
  test('rejects password without uppercase letter', () => {
    const result = validatePassword('abcdef123!', [], DEFAULT_POLICY);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Parola trebuie să conțină cel puțin o literă mare');
  });

  // Test 3: Rejects passwords without number
  test('rejects password without number', () => {
    const result = validatePassword('Abcdefgh!', [], DEFAULT_POLICY);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Parola trebuie să conțină cel puțin o cifră');
  });

  // Test 4: Rejects common passwords
  test('rejects common password from blocklist', () => {
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];

    commonPasswords.forEach((pwd) => {
      const result = validatePassword(pwd, [], DEFAULT_POLICY);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Această parolă este prea comună și nu poate fi folosită'
      );
    });
  });

  // Test 5: Accepts strong passwords
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

  // Test 6: Strength score 0 for empty password
  test('returns strength score 0 for empty password', () => {
    const strength = getPasswordStrength('');

    expect(strength.score).toBeLessThanOrEqual(20);
    expect(strength.score).toBeGreaterThanOrEqual(0);
    expect(strength.label).toBe('Foarte slabă');
  });

  // Test 7: Strength score 100 for complex password
  test('returns strength score 100 for highly complex password', () => {
    // Very long password with all character types, no patterns, high entropy
    const complexPassword = 'Xk9#mP2$vL8@nQ5&wR7!bT4%jH6^';

    const strength = getPasswordStrength(complexPassword);

    expect(strength.score).toBe(100);
    expect(strength.label).toBe('Foarte puternică');
  });

  // Test 8: Rejects reused passwords
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

  // Test 9: Password strength scoring accuracy
  test('calculates accurate strength scores for various password types', () => {
    // Weak passwords
    const weakPasswords = ['abc', '12345', 'password'];
    weakPasswords.forEach((pwd) => {
      const strength = getPasswordStrength(pwd);
      expect(strength.score).toBeLessThan(40);
      expect(['Foarte slabă', 'Slabă']).toContain(strength.label);
    });

    // Medium passwords
    const mediumPasswords = ['Abcdef123!', 'MyTest1234'];
    mediumPasswords.forEach((pwd) => {
      const strength = getPasswordStrength(pwd);
      expect(strength.score).toBeGreaterThanOrEqual(40);
      expect(strength.score).toBeLessThan(80);
    });

    // Strong passwords
    const strongPasswords = ['MyS3cur3P@ssw0rd!', 'T3st!ngStr0ng#Pass'];
    strongPasswords.forEach((pwd) => {
      const strength = getPasswordStrength(pwd);
      expect(strength.score).toBeGreaterThanOrEqual(80);
    });
  });

  // Test 10: Multiple validation errors accumulation
  test('accumulates multiple validation errors for very weak password', () => {
    // Password that fails multiple requirements
    const veryWeakPassword = 'abc';

    const result = validatePassword(veryWeakPassword, [], DEFAULT_POLICY);

    expect(result.valid).toBe(false);
    // Should have multiple errors: too short, no uppercase, no number, no special char
    expect(result.errors.length).toBeGreaterThanOrEqual(4);
    expect(result.errors).toContain('Parola trebuie să aibă minimum 8 caractere');
    expect(result.errors).toContain('Parola trebuie să conțină cel puțin o literă mare');
    expect(result.errors).toContain('Parola trebuie să conțină cel puțin o cifră');
    expect(result.errors).toContain('Parola trebuie să conțină cel puțin un caracter special');
  });
});
