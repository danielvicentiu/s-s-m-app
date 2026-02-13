/**
 * Validation utilities for Romanian, Bulgarian, Hungarian, German, and Polish formats
 *
 * Functions:
 * - isValidCUI: Validates Romanian CUI (Cod Unic de Identificare)
 * - isValidCNP: Validates Romanian CNP (Cod Numeric Personal)
 * - isValidEmail: Validates email addresses
 * - isValidPhone: Validates phone numbers for RO/BG/HU/DE/PL
 * - isValidIBAN: Validates IBAN for RO/BG/HU/DE/PL
 */

/**
 * Validates Romanian CUI (Cod Unic de Identificare)
 * CUI format: 2-10 digits, optional RO prefix
 * Includes control digit validation algorithm
 */
export function isValidCUI(cui: string): boolean {
  if (!cui) return false;

  // Remove spaces and RO prefix
  let cleanCUI = cui.trim().toUpperCase().replace(/^RO/, '').replace(/\s/g, '');

  // Check if it's numeric and has 2-10 digits
  if (!/^\d{2,10}$/.test(cleanCUI)) return false;

  // Pad with leading zeros to 10 digits for validation
  cleanCUI = cleanCUI.padStart(10, '0');

  // Control key for CUI validation
  const controlKey = [7, 5, 3, 2, 1, 7, 5, 3, 2];

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCUI[i]) * controlKey[i];
  }

  const controlDigit = sum % 11 === 10 ? 0 : sum % 11;
  const lastDigit = parseInt(cleanCUI[9]);

  return controlDigit === lastDigit;
}

/**
 * Validates Romanian CNP (Cod Numeric Personal)
 * CNP format: 13 digits with specific structure and control digit
 */
export function isValidCNP(cnp: string): boolean {
  if (!cnp) return false;

  // Remove spaces
  const cleanCNP = cnp.trim().replace(/\s/g, '');

  // Must be exactly 13 digits
  if (!/^\d{13}$/.test(cleanCNP)) return false;

  // First digit: sex and century (1-8)
  const sexDigit = parseInt(cleanCNP[0]);
  if (sexDigit < 1 || sexDigit > 8) return false;

  // Digits 2-3: year (00-99)
  const year = parseInt(cleanCNP.substring(1, 3));

  // Digits 4-5: month (01-12)
  const month = parseInt(cleanCNP.substring(3, 5));
  if (month < 1 || month > 12) return false;

  // Digits 6-7: day (01-31)
  const day = parseInt(cleanCNP.substring(5, 7));
  if (day < 1 || day > 31) return false;

  // Validate date consistency
  const century = sexDigit === 1 || sexDigit === 2 ? 1900 :
                  sexDigit === 3 || sexDigit === 4 ? 1800 :
                  sexDigit === 5 || sexDigit === 6 ? 2000 : 2000;

  const fullYear = century + year;
  const date = new Date(fullYear, month - 1, day);

  if (date.getFullYear() !== fullYear ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day) {
    return false;
  }

  // Digits 8-9: county code (01-52)
  const county = parseInt(cleanCNP.substring(7, 9));
  if (county < 1 || county > 52) return false;

  // Control digit validation
  const controlKey = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNP[i]) * controlKey[i];
  }

  const controlDigit = sum % 11 === 10 ? 1 : sum % 11;
  const lastDigit = parseInt(cleanCNP[12]);

  return controlDigit === lastDigit;
}

/**
 * Validates email addresses using RFC 5322 simplified regex
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Basic format check
  if (!emailRegex.test(email.trim())) return false;

  // Additional checks
  const [localPart, domain] = email.trim().split('@');

  // Local part shouldn't start or end with a dot
  if (localPart.startsWith('.') || localPart.endsWith('.')) return false;

  // No consecutive dots
  if (localPart.includes('..')) return false;

  // Domain should have at least one dot and valid TLD
  if (!domain.includes('.')) return false;

  // Domain parts shouldn't be empty
  const domainParts = domain.split('.');
  if (domainParts.some(part => part.length === 0)) return false;

  return true;
}

/**
 * Validates phone numbers for RO, BG, HU, DE, PL
 * Accepts formats: +country code, 00country code, or national format
 */
export function isValidPhone(phone: string, country: 'RO' | 'BG' | 'HU' | 'DE' | 'PL' = 'RO'): boolean {
  if (!phone) return false;

  // Remove spaces, dashes, parentheses
  const cleanPhone = phone.trim().replace(/[\s\-\(\)\.]/g, '');

  const patterns: Record<string, RegExp[]> = {
    // Romania: +40 or 0 followed by 9 digits (mobile: 7xx, landline: 2xx/3xx)
    RO: [
      /^(\+40|0040|0)[27]\d{8}$/,  // Mobile/landline
    ],
    // Bulgaria: +359 or 0 followed by 8-9 digits
    BG: [
      /^(\+359|00359|0)\d{8,9}$/,
    ],
    // Hungary: +36 or 06 followed by 9 digits (mobile starts with 20/30/70)
    HU: [
      /^(\+36|0036|06)[1-9]\d{7,8}$/,
    ],
    // Germany: +49 or 0 followed by 10-11 digits
    DE: [
      /^(\+49|0049|0)\d{10,11}$/,
    ],
    // Poland: +48 or 0 followed by 9 digits
    PL: [
      /^(\+48|0048|0)\d{9}$/,
    ],
  };

  const countryPatterns = patterns[country];
  if (!countryPatterns) return false;

  return countryPatterns.some(pattern => pattern.test(cleanPhone));
}

/**
 * Validates IBAN for RO, BG, HU, DE, PL
 * Includes country-specific length and format validation
 * Implements IBAN checksum algorithm (mod 97)
 */
export function isValidIBAN(iban: string): boolean {
  if (!iban) return false;

  // Remove spaces and convert to uppercase
  const cleanIBAN = iban.trim().replace(/\s/g, '').toUpperCase();

  // IBAN length by country
  const ibanLengths: Record<string, number> = {
    RO: 24, // RO + 2 check digits + 4 bank code + 16 account
    BG: 22, // BG + 2 check digits + 4 bank code + 6 branch + 8 account
    HU: 28, // HU + 2 check digits + 3 bank + 4 branch + 1 check + 15 account + 1 check
    DE: 22, // DE + 2 check digits + 8 bank code + 10 account
    PL: 28, // PL + 2 check digits + 8 bank + 16 account
  };

  // Check country code
  const countryCode = cleanIBAN.substring(0, 2);
  if (!ibanLengths[countryCode]) return false;

  // Check length
  if (cleanIBAN.length !== ibanLengths[countryCode]) return false;

  // Check format: 2 letters + 2 digits + alphanumeric
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(cleanIBAN)) return false;

  // Validate checksum using mod 97 algorithm
  // Move first 4 characters to end
  const rearranged = cleanIBAN.substring(4) + cleanIBAN.substring(0, 4);

  // Replace letters with numbers (A=10, B=11, ..., Z=35)
  const numericString = rearranged.split('').map(char => {
    const code = char.charCodeAt(0);
    return code >= 65 && code <= 90 ? (code - 55).toString() : char;
  }).join('');

  // Calculate mod 97
  let remainder = numericString;
  while (remainder.length > 2) {
    const block = remainder.substring(0, 9);
    remainder = (parseInt(block) % 97).toString() + remainder.substring(block.length);
  }

  return parseInt(remainder) % 97 === 1;
}

/**
 * Utility type for validation results with error messages
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Enhanced validation functions that return detailed results
 */
export const validate = {
  cui: (cui: string): ValidationResult => {
    if (!cui) return { isValid: false, error: 'CUI este obligatoriu' };
    const isValid = isValidCUI(cui);
    return {
      isValid,
      error: isValid ? undefined : 'CUI invalid. Format acceptat: 2-10 cifre, opțional prefix RO',
    };
  },

  cnp: (cnp: string): ValidationResult => {
    if (!cnp) return { isValid: false, error: 'CNP este obligatoriu' };
    const isValid = isValidCNP(cnp);
    return {
      isValid,
      error: isValid ? undefined : 'CNP invalid. Format acceptat: 13 cifre',
    };
  },

  email: (email: string): ValidationResult => {
    if (!email) return { isValid: false, error: 'Email este obligatoriu' };
    const isValid = isValidEmail(email);
    return {
      isValid,
      error: isValid ? undefined : 'Adresa de email invalidă',
    };
  },

  phone: (phone: string, country: 'RO' | 'BG' | 'HU' | 'DE' | 'PL' = 'RO'): ValidationResult => {
    if (!phone) return { isValid: false, error: 'Telefon este obligatoriu' };
    const isValid = isValidPhone(phone, country);
    return {
      isValid,
      error: isValid ? undefined : `Număr de telefon invalid pentru ${country}`,
    };
  },

  iban: (iban: string): ValidationResult => {
    if (!iban) return { isValid: false, error: 'IBAN este obligatoriu' };
    const isValid = isValidIBAN(iban);
    return {
      isValid,
      error: isValid ? undefined : 'IBAN invalid. Verificați formatul și țara (RO/BG/HU/DE/PL)',
    };
  },
};
