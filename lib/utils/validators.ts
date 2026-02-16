/**
 * lib/utils/validators.ts
 * 
 * Validări CNP + CUI românesc cu algoritm check digit complet.
 * ZERO dependințe — funcții pure, importabile de oriunde.
 * 
 * Folosit de: scan-pipeline, modul medical, angajați, import CSV, onboarding
 */

// ============================================================
// CNP — Cod Numeric Personal (13 cifre)
// ============================================================

export interface ValidationResult {
  valid: boolean;
  error?: string;
  details?: Record<string, string | number>;
}

/**
 * Validare CNP românesc cu check digit.
 * 
 * Structura: S AA LL ZZ JJ NNN C
 *   S = sex + secol (1/2=M/F 1900-1999, 5/6=M/F 2000-2099, 7/8=rezidenți)
 *   AA = an naștere (00-99)
 *   LL = luna (01-12)
 *   ZZ = ziua (01-31)
 *   JJ = județ (01-52 + 51=București, 52=Călărași)
 *   NNN = număr ordine (001-999)
 *   C = cifra de control
 * 
 * Algoritm check digit:
 *   Constanta: 2 7 9 1 4 6 3 5 8 2 7 9
 *   Înmulțești fiecare din primele 12 cifre cu constanta corespunzătoare
 *   Sumezi produsele
 *   rest = sumă % 11
 *   Dacă rest === 10 → cifra de control = 1
 *   Altfel → cifra de control = rest
 * 
 * @example
 * validateCNP('1900101410017') // { valid: true, details: { sex: 'M', year: 1990, ... } }
 * validateCNP('9999999999999') // { valid: false, error: 'Cifra de control invalidă...' }
 * validateCNP('123')           // { valid: false, error: 'CNP trebuie să aibă exact 13 cifre' }
 */
export function validateCNP(cnp: string): ValidationResult {
  // Elimină spații
  const cleaned = cnp.trim();

  // 1. Format: exact 13 cifre
  if (!/^\d{13}$/.test(cleaned)) {
    return { valid: false, error: 'CNP trebuie să aibă exact 13 cifre' };
  }

  const digits = cleaned.split('').map(Number);

  // 2. Sex + secol valid (prima cifră: 1-8, nu 0 sau 9)
  const s = digits[0];
  if (s < 1 || s > 8) {
    return { valid: false, error: `Prima cifră (${s}) invalidă. Valori acceptate: 1-8` };
  }

  // 3. Luna validă (01-12)
  const month = digits[3] * 10 + digits[4];
  if (month < 1 || month > 12) {
    return { valid: false, error: `Luna ${month} invalidă (trebuie 01-12)` };
  }

  // 4. Ziua validă (01-31)
  const day = digits[5] * 10 + digits[6];
  if (day < 1 || day > 31) {
    return { valid: false, error: `Ziua ${day} invalidă (trebuie 01-31)` };
  }

  // 5. Județ valid (01-52)
  const county = digits[7] * 10 + digits[8];
  if (county < 1 || county > 52) {
    return { valid: false, error: `Codul de județ ${county} invalid (trebuie 01-52)` };
  }

  // 6. CHECK DIGIT — algoritmul românesc
  const weights = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
  const sum = weights.reduce((acc, w, i) => acc + w * digits[i], 0);
  const remainder = sum % 11;
  const expectedCheckDigit = remainder === 10 ? 1 : remainder;

  if (expectedCheckDigit !== digits[12]) {
    return {
      valid: false,
      error: `Cifra de control invalidă: așteptat ${expectedCheckDigit}, primit ${digits[12]}. CNP-ul nu este valid.`
    };
  }

  // 7. Extrage detalii
  const yearPrefix = [0, 1900, 1900, 1800, 1800, 2000, 2000, 1900, 1900][s];
  const year = yearPrefix + digits[1] * 10 + digits[2];
  const sex = s % 2 === 1 ? 'M' : 'F';

  return {
    valid: true,
    details: {
      sex,
      year,
      month,
      day,
      county,
      birthDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    }
  };
}


// ============================================================
// CUI — Cod Unic de Înregistrare (2-10 cifre, opțional prefix RO)
// ============================================================

/**
 * Validare CUI românesc cu check digit.
 * 
 * Structura: 2-10 cifre. Ultima cifră = cifra de control.
 * Poate avea prefix "RO" (cod TVA) — se elimină automat.
 * 
 * Algoritm check digit:
 *   Constanta (de la dreapta la stânga): 7 5 3 2 1 7 5 3 2
 *   Se aliniază constanta la DREAPTA (fără ultima cifră — cifra de control)
 *   Înmulțești fiecare cifră cu constanta aliniată
 *   Sumezi produsele
 *   rest = (sumă * 10) % 11
 *   Dacă rest === 10 → cifra de control = 0
 *   Altfel → cifra de control = rest
 * 
 * @example
 * validateCUI('RO12345678')  // { valid: true/false, ... }
 * validateCUI('12345678')     // { valid: true/false, ... }
 * validateCUI('1')            // { valid: false, error: 'CUI trebuie să aibă 2-10 cifre' }
 */
export function validateCUI(cui: string): ValidationResult {
  // Elimină spații și prefix RO/ro
  let cleaned = cui.trim().toUpperCase();
  if (cleaned.startsWith('RO')) {
    cleaned = cleaned.substring(2);
  }
  // Elimină spații rămase
  cleaned = cleaned.replace(/\s/g, '');

  // 1. Format: doar cifre, 2-10
  if (!/^\d{2,10}$/.test(cleaned)) {
    return { valid: false, error: 'CUI trebuie să aibă 2-10 cifre (fără prefix RO)' };
  }

  // 2. Nu poate începe cu 0
  if (cleaned.startsWith('0')) {
    return { valid: false, error: 'CUI nu poate începe cu 0' };
  }

  const digits = cleaned.split('').map(Number);
  const len = digits.length;

  // 3. CHECK DIGIT — algoritmul românesc
  // Constanta aliniată de la dreapta: 7 5 3 2 1 7 5 3 2
  const fullWeights = [7, 5, 3, 2, 1, 7, 5, 3, 2];

  // Cifra de control = ultima cifră
  const checkDigit = digits[len - 1];
  // Cifrele de validat = toate FĂRĂ ultima
  const toValidate = digits.slice(0, len - 1);

  // Aliniază constantele de la DREAPTA
  const offset = fullWeights.length - toValidate.length;
  const weights = fullWeights.slice(offset);

  // Calculează suma ponderată
  const sum = toValidate.reduce((acc, d, i) => acc + d * weights[i], 0);

  // rest = (sumă * 10) % 11; dacă rest === 10 → 0
  const remainder = (sum * 10) % 11;
  const expectedCheckDigit = remainder === 10 ? 0 : remainder;

  if (expectedCheckDigit !== checkDigit) {
    return {
      valid: false,
      error: `Cifra de control invalidă: așteptat ${expectedCheckDigit}, primit ${checkDigit}. CUI-ul nu este valid.`
    };
  }

  return {
    valid: true,
    details: {
      cui: cleaned,
      cuiWithRO: `RO${cleaned}`,
      digits: len,
    }
  };
}


// ============================================================
// IBAN — validare format românesc (opțional, de adăugat)
// ============================================================

/**
 * Validare format IBAN românesc (RO + 2 check digits + 4 litere bancă + 16 alfanumerice = 24 caractere)
 * NU face check digit IBAN complet (modulo 97), doar format.
 */
export function validateIBAN_RO(iban: string): ValidationResult {
  const cleaned = iban.trim().toUpperCase().replace(/\s/g, '');

  if (!/^RO\d{2}[A-Z]{4}[A-Z0-9]{16}$/.test(cleaned)) {
    return {
      valid: false,
      error: 'IBAN românesc trebuie să aibă formatul: RO + 2 cifre + 4 litere bancă + 16 caractere = 24 total'
    };
  }

  // Check digit IBAN (ISO 7064 Mod 97-10)
  const rearranged = cleaned.substring(4) + cleaned.substring(0, 4);
  const numericStr = rearranged.split('').map(c => {
    const code = c.charCodeAt(0);
    return code >= 65 ? (code - 55).toString() : c;
  }).join('');

  // BigInt modulo 97
  let remainder = 0n;
  for (const chunk of numericStr.match(/.{1,9}/g) || []) {
    remainder = (remainder * (10n ** BigInt(chunk.length)) + BigInt(chunk)) % 97n;
  }

  if (remainder !== 1n) {
    return { valid: false, error: 'IBAN invalid — cifra de control nu corespunde (modulo 97)' };
  }

  const bankCode = cleaned.substring(4, 8);
  return {
    valid: true,
    details: {
      country: 'RO',
      bankCode,
      fullIBAN: cleaned,
    }
  };
}


// ============================================================
// EMAIL — validare format basic
// ============================================================

export function validateEmail(email: string): ValidationResult {
  const cleaned = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
    return { valid: false, error: 'Format email invalid' };
  }
  return { valid: true };
}


// ============================================================
// TELEFON RO — validare format (fix + mobil)
// ============================================================

export function validatePhoneRO(phone: string): ValidationResult {
  const cleaned = phone.trim().replace(/[\s\-\.\(\)]/g, '');

  // Mobil: 07XX XXX XXX sau +407XX XXX XXX sau 00407XX XXX XXX
  // Fix: 02X XXX XXXX sau 03X XXX XXXX sau +402X... sau +403X...
  const patterns = [
    /^07\d{8}$/,           // 07XX XXX XXX (10 cifre)
    /^\+407\d{8}$/,        // +407XX XXX XXX
    /^00407\d{8}$/,        // 00407XX XXX XXX
    /^0[23]\d{8}$/,        // 02X/03X fix (10 cifre)
    /^\+40[23]\d{8}$/,     // +40 2X/3X fix
  ];

  if (!patterns.some(p => p.test(cleaned))) {
    return { valid: false, error: 'Număr de telefon RO invalid. Formate acceptate: 07XX XXX XXX, +407XX XXX XXX, 02X/03X XXX XXXX' };
  }

  return { valid: true };
}
