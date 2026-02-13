/**
 * Validation utilities for SSM platform
 * Includes Romanian-specific validations (CUI, CNP) and general validations
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates Romanian CUI (Cod Unic de Înregistrare)
 * @param cui - CUI to validate (with or without RO prefix)
 * @returns Validation result with error message if invalid
 */
export function validateCUI(cui: string): ValidationResult {
  if (!cui || typeof cui !== 'string') {
    return { valid: false, error: 'CUI este obligatoriu' };
  }

  // Remove spaces and RO prefix
  const cleanCUI = cui.trim().replace(/^RO/i, '').replace(/\s/g, '');

  // Check if it's numeric
  if (!/^\d+$/.test(cleanCUI)) {
    return { valid: false, error: 'CUI trebuie să conțină doar cifre' };
  }

  // CUI length should be between 2 and 10 digits
  if (cleanCUI.length < 2 || cleanCUI.length > 10) {
    return { valid: false, error: 'CUI trebuie să aibă între 2 și 10 cifre' };
  }

  // Validate using control digit algorithm
  const controlKey = '753217532';
  const cuiDigits = cleanCUI.split('').map(Number);
  const checkDigit = cuiDigits.pop();

  if (checkDigit === undefined) {
    return { valid: false, error: 'CUI invalid' };
  }

  // Pad with zeros on the left to make it 9 digits (before check digit)
  while (cuiDigits.length < 9) {
    cuiDigits.unshift(0);
  }

  // Calculate control sum
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += cuiDigits[i] * parseInt(controlKey[i]);
  }

  const calculatedCheck = (sum * 10) % 11;
  const finalCheck = calculatedCheck === 10 ? 0 : calculatedCheck;

  if (finalCheck !== checkDigit) {
    return { valid: false, error: 'CUI invalid - cifra de control nu corespunde' };
  }

  return { valid: true };
}

/**
 * Validates Romanian CNP (Cod Numeric Personal)
 * @param cnp - CNP to validate (13 digits)
 * @returns Validation result with error message if invalid
 */
export function validateCNP(cnp: string): ValidationResult {
  if (!cnp || typeof cnp !== 'string') {
    return { valid: false, error: 'CNP este obligatoriu' };
  }

  const cleanCNP = cnp.trim().replace(/\s/g, '');

  // Check if it's numeric and exactly 13 digits
  if (!/^\d{13}$/.test(cleanCNP)) {
    return { valid: false, error: 'CNP trebuie să conțină exact 13 cifre' };
  }

  const digits = cleanCNP.split('').map(Number);

  // Validate gender digit (first digit: 1-8)
  const gender = digits[0];
  if (gender < 1 || gender > 8) {
    return { valid: false, error: 'CNP invalid - cifra de sex incorectă' };
  }

  // Extract and validate date
  const year = digits[1] * 10 + digits[2];
  const month = digits[3] * 10 + digits[4];
  const day = digits[5] * 10 + digits[6];

  // Determine full year based on gender digit
  let fullYear: number;
  if (gender === 1 || gender === 2) {
    fullYear = 1900 + year;
  } else if (gender === 3 || gender === 4) {
    fullYear = 1800 + year;
  } else if (gender === 5 || gender === 6) {
    fullYear = 2000 + year;
  } else {
    fullYear = 2000 + year; // For foreign residents (7, 8)
  }

  // Validate month
  if (month < 1 || month > 12) {
    return { valid: false, error: 'CNP invalid - luna incorectă' };
  }

  // Validate day
  const daysInMonth = new Date(fullYear, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return { valid: false, error: 'CNP invalid - ziua incorectă' };
  }

  // Validate county code (digits 7-8: 01-52)
  const county = digits[7] * 10 + digits[8];
  if (county < 1 || (county > 52 && county !== 99)) {
    return { valid: false, error: 'CNP invalid - cod județ incorect' };
  }

  // Validate check digit using control key
  const controlKey = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * controlKey[i];
  }

  const calculatedCheck = sum % 11;
  const checkDigit = calculatedCheck === 10 ? 1 : calculatedCheck;

  if (checkDigit !== digits[12]) {
    return { valid: false, error: 'CNP invalid - cifra de control nu corespunde' };
  }

  return { valid: true };
}

/**
 * Validates email address
 * @param email - Email to validate
 * @returns Validation result with error message if invalid
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email este obligatoriu' };
  }

  const cleanEmail = email.trim();

  // RFC 5322 compliant regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(cleanEmail)) {
    return { valid: false, error: 'Format email invalid' };
  }

  // Additional checks
  if (cleanEmail.length > 254) {
    return { valid: false, error: 'Email prea lung (maxim 254 caractere)' };
  }

  const [localPart, domain] = cleanEmail.split('@');

  if (localPart.length > 64) {
    return { valid: false, error: 'Partea locală a email-ului este prea lungă' };
  }

  if (domain.length > 253) {
    return { valid: false, error: 'Domeniul email-ului este prea lung' };
  }

  // Check for consecutive dots
  if (cleanEmail.includes('..')) {
    return { valid: false, error: 'Email-ul nu poate conține puncte consecutive' };
  }

  return { valid: true };
}

/**
 * Validates phone number (international and Romanian formats)
 * @param phone - Phone number to validate
 * @returns Validation result with error message if invalid
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Număr de telefon este obligatoriu' };
  }

  // Remove spaces, dashes, parentheses
  const cleanPhone = phone.trim().replace(/[\s\-().]/g, '');

  // Check if it contains only digits and optional + prefix
  if (!/^\+?\d+$/.test(cleanPhone)) {
    return { valid: false, error: 'Număr de telefon invalid - folosiți doar cifre' };
  }

  // Remove + for length validation
  const digitsOnly = cleanPhone.replace(/^\+/, '');

  // Phone should be between 10 and 15 digits
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return { valid: false, error: 'Număr de telefon trebuie să aibă între 10 și 15 cifre' };
  }

  // Romanian phone validation (if starts with +40 or 40 or 07/02/03)
  if (cleanPhone.startsWith('+40') || cleanPhone.startsWith('40')) {
    const roNumber = cleanPhone.replace(/^\+?40/, '');
    if (roNumber.length !== 9) {
      return { valid: false, error: 'Număr de telefon românesc invalid (9 cifre după +40)' };
    }
    if (!['7', '2', '3'].includes(roNumber[0])) {
      return { valid: false, error: 'Număr de telefon românesc invalid (trebuie să înceapă cu 7, 2 sau 3)' };
    }
  } else if (/^0[7|2|3]/.test(cleanPhone)) {
    if (digitsOnly.length !== 10) {
      return { valid: false, error: 'Număr de telefon românesc invalid (10 cifre)' };
    }
  }

  return { valid: true };
}

/**
 * Validates IBAN (International Bank Account Number)
 * @param iban - IBAN to validate
 * @returns Validation result with error message if invalid
 */
export function validateIBAN(iban: string): ValidationResult {
  if (!iban || typeof iban !== 'string') {
    return { valid: false, error: 'IBAN este obligatoriu' };
  }

  // Remove spaces and convert to uppercase
  const cleanIBAN = iban.trim().replace(/\s/g, '').toUpperCase();

  // Check if it contains only alphanumeric characters
  if (!/^[A-Z0-9]+$/.test(cleanIBAN)) {
    return { valid: false, error: 'IBAN trebuie să conțină doar litere și cifre' };
  }

  // IBAN length should be between 15 and 34 characters
  if (cleanIBAN.length < 15 || cleanIBAN.length > 34) {
    return { valid: false, error: 'IBAN trebuie să aibă între 15 și 34 caractere' };
  }

  // Check country code (first 2 letters)
  const countryCode = cleanIBAN.substring(0, 2);
  if (!/^[A-Z]{2}$/.test(countryCode)) {
    return { valid: false, error: 'IBAN invalid - cod țară incorect' };
  }

  // Check digits (next 2 characters)
  const checkDigits = cleanIBAN.substring(2, 4);
  if (!/^\d{2}$/.test(checkDigits)) {
    return { valid: false, error: 'IBAN invalid - cifre de control incorecte' };
  }

  // Validate using MOD-97 algorithm
  const rearranged = cleanIBAN.substring(4) + cleanIBAN.substring(0, 4);

  // Convert letters to numbers (A=10, B=11, ..., Z=35)
  let numericIBAN = '';
  for (const char of rearranged) {
    if (/[A-Z]/.test(char)) {
      numericIBAN += (char.charCodeAt(0) - 55).toString();
    } else {
      numericIBAN += char;
    }
  }

  // Calculate MOD-97
  let remainder = numericIBAN;
  while (remainder.length > 2) {
    const block = remainder.substring(0, 9);
    remainder = (parseInt(block, 10) % 97).toString() + remainder.substring(block.length);
  }

  const checksum = parseInt(remainder, 10) % 97;

  if (checksum !== 1) {
    return { valid: false, error: 'IBAN invalid - cifra de control nu corespunde' };
  }

  // Romanian IBAN specific validation (24 characters)
  if (countryCode === 'RO' && cleanIBAN.length !== 24) {
    return { valid: false, error: 'IBAN românesc trebuie să aibă 24 caractere' };
  }

  return { valid: true };
}

/**
 * Validates password strength
 * @param password - Password to validate
 * @returns Validation result with error message if invalid
 */
export function isStrongPassword(password: string): ValidationResult {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Parola este obligatorie' };
  }

  // Minimum length
  if (password.length < 8) {
    return { valid: false, error: 'Parola trebuie să aibă minim 8 caractere' };
  }

  // Maximum length for security
  if (password.length > 128) {
    return { valid: false, error: 'Parola este prea lungă (maxim 128 caractere)' };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Parola trebuie să conțină cel puțin o literă mică' };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Parola trebuie să conțină cel puțin o literă mare' };
  }

  // Check for at least one digit
  if (!/\d/.test(password)) {
    return { valid: false, error: 'Parola trebuie să conțină cel puțin o cifră' };
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: 'Parola trebuie să conțină cel puțin un caracter special' };
  }

  // Check for common weak passwords
  const commonPasswords = [
    'password', 'password123', '12345678', 'qwerty123', 'abc123',
    'Password1!', 'Admin123!', 'Welcome1!', 'Parola123!'
  ];

  if (commonPasswords.some(weak => password.toLowerCase().includes(weak.toLowerCase()))) {
    return { valid: false, error: 'Parola este prea comună - alegeți o parolă mai sigură' };
  }

  return { valid: true };
}

/**
 * Sanitizes input string to prevent XSS and injection attacks
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    // Remove null bytes
    .replace(/\0/g, '')
    // Encode HTML special characters
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    // Remove control characters except newline and tab
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Batch validation utility
 * @param validations - Object with field names as keys and validation functions as values
 * @returns Object with validation results for each field
 */
export function validateFields(
  validations: Record<string, () => ValidationResult>
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, validate] of Object.entries(validations)) {
    const result = validate();
    if (!result.valid) {
      isValid = false;
      errors[field] = result.error || 'Valoare invalidă';
    }
  }

  return { isValid, errors };
}
