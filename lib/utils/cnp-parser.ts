/**
 * CNP (Cod Numeric Personal) Parser for Romanian identification numbers
 *
 * CNP structure: S AA LL ZZ JJ NNN C
 * - S: sex and century (1 digit)
 * - AA: birth year (2 digits)
 * - LL: birth month (2 digits)
 * - ZZ: birth day (2 digits)
 * - JJ: county code (2 digits)
 * - NNN: sequence number (3 digits)
 * - C: check digit (1 digit)
 */

export interface CNPInfo {
  isValid: boolean;
  sex: 'M' | 'F' | null;
  birthDate: Date | null;
  county: string | null;
  countyCode: string | null;
  age: number | null;
  error?: string;
}

/**
 * Romanian county codes mapping
 */
const COUNTY_CODES: Record<string, string> = {
  '01': 'Alba',
  '02': 'Arad',
  '03': 'Argeș',
  '04': 'Bacău',
  '05': 'Bihor',
  '06': 'Bistrița-Năsăud',
  '07': 'Botoșani',
  '08': 'Brașov',
  '09': 'Brăila',
  '10': 'Buzău',
  '11': 'Caraș-Severin',
  '12': 'Cluj',
  '13': 'Constanța',
  '14': 'Covasna',
  '15': 'Dâmbovița',
  '16': 'Dolj',
  '17': 'Galați',
  '18': 'Gorj',
  '19': 'Harghita',
  '20': 'Hunedoara',
  '21': 'Ialomița',
  '22': 'Iași',
  '23': 'Ilfov',
  '24': 'Maramureș',
  '25': 'Mehedinți',
  '26': 'Mureș',
  '27': 'Neamț',
  '28': 'Olt',
  '29': 'Prahova',
  '30': 'Satu Mare',
  '31': 'Sălaj',
  '32': 'Sibiu',
  '33': 'Suceava',
  '34': 'Teleorman',
  '35': 'Timiș',
  '36': 'Tulcea',
  '37': 'Vaslui',
  '38': 'Vâlcea',
  '39': 'Vrancea',
  '40': 'București',
  '41': 'București - Sector 1',
  '42': 'București - Sector 2',
  '43': 'București - Sector 3',
  '44': 'București - Sector 4',
  '45': 'București - Sector 5',
  '46': 'București - Sector 6',
  '47': 'București - Sector 7',
  '48': 'București - Sector 8',
  '51': 'Călărași',
  '52': 'Giurgiu',
};

/**
 * Check digit validation constants
 */
const CHECK_DIGIT_MULTIPLIERS = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];

/**
 * Parse and validate a Romanian CNP
 * @param cnp - The CNP string to parse (13 digits)
 * @returns CNPInfo object with parsed data and validation status
 */
export function parseCNP(cnp: string | null | undefined): CNPInfo {
  const invalidResult: CNPInfo = {
    isValid: false,
    sex: null,
    birthDate: null,
    county: null,
    countyCode: null,
    age: null,
  };

  // Check if CNP is provided
  if (!cnp) {
    return { ...invalidResult, error: 'CNP is required' };
  }

  // Remove any spaces or dashes
  const cleanCNP = cnp.replace(/[\s-]/g, '');

  // Check if CNP has exactly 13 digits
  if (!/^\d{13}$/.test(cleanCNP)) {
    return { ...invalidResult, error: 'CNP must contain exactly 13 digits' };
  }

  // Extract components
  const sexDigit = parseInt(cleanCNP[0], 10);
  const year = parseInt(cleanCNP.substring(1, 3), 10);
  const month = parseInt(cleanCNP.substring(3, 5), 10);
  const day = parseInt(cleanCNP.substring(5, 7), 10);
  const countyCode = cleanCNP.substring(7, 9);
  const checkDigit = parseInt(cleanCNP[12], 10);

  // Validate sex digit (1-9, where 7-9 are for foreign residents)
  if (sexDigit < 1 || sexDigit > 9) {
    return { ...invalidResult, error: 'Invalid sex digit' };
  }

  // Determine sex
  const sex: 'M' | 'F' = [1, 3, 5, 7].includes(sexDigit) ? 'M' : 'F';

  // Determine birth year based on sex digit
  let fullYear: number;
  switch (sexDigit) {
    case 1:
    case 2:
      fullYear = 1900 + year;
      break;
    case 3:
    case 4:
      fullYear = 1800 + year;
      break;
    case 5:
    case 6:
      fullYear = 2000 + year;
      break;
    case 7:
    case 8:
    case 9:
      // Foreign residents - assume 1900s if year > current year's last 2 digits, else 2000s
      const currentYear = new Date().getFullYear();
      const currentYearShort = currentYear % 100;
      fullYear = year > currentYearShort ? 1900 + year : 2000 + year;
      break;
    default:
      return { ...invalidResult, error: 'Invalid sex digit' };
  }

  // Validate month
  if (month < 1 || month > 12) {
    return { ...invalidResult, error: 'Invalid month' };
  }

  // Validate day
  if (day < 1 || day > 31) {
    return { ...invalidResult, error: 'Invalid day' };
  }

  // Create birth date
  const birthDate = new Date(fullYear, month - 1, day);

  // Validate that the date is valid (e.g., not Feb 30)
  if (
    birthDate.getFullYear() !== fullYear ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return { ...invalidResult, error: 'Invalid birth date' };
  }

  // Validate that birth date is not in the future
  if (birthDate > new Date()) {
    return { ...invalidResult, error: 'Birth date cannot be in the future' };
  }

  // Validate county code
  const county = COUNTY_CODES[countyCode];
  if (!county) {
    return { ...invalidResult, error: `Invalid county code: ${countyCode}` };
  }

  // Validate check digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNP[i], 10) * CHECK_DIGIT_MULTIPLIERS[i];
  }
  const calculatedCheckDigit = sum % 11 === 10 ? 1 : sum % 11;

  if (calculatedCheckDigit !== checkDigit) {
    return { ...invalidResult, error: 'Invalid check digit' };
  }

  // Calculate age
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // Return valid CNP info
  return {
    isValid: true,
    sex,
    birthDate,
    county,
    countyCode,
    age,
  };
}

/**
 * Get all Romanian counties
 * @returns Array of county objects with code and name
 */
export function getCounties(): Array<{ code: string; name: string }> {
  return Object.entries(COUNTY_CODES).map(([code, name]) => ({
    code,
    name,
  }));
}

/**
 * Get county name by code
 * @param code - The county code (e.g., '01', '40')
 * @returns County name or null if not found
 */
export function getCountyByCode(code: string): string | null {
  return COUNTY_CODES[code] || null;
}

/**
 * Validate CNP format without full parsing
 * @param cnp - The CNP string to validate
 * @returns true if CNP is valid, false otherwise
 */
export function isValidCNP(cnp: string | null | undefined): boolean {
  return parseCNP(cnp).isValid;
}
