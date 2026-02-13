/**
 * Countries Configuration
 *
 * Centralized configuration for all supported countries in the SSM/PSI platform.
 * Includes regulatory, localization, and operational settings for each country.
 */

export interface CountryConfig {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  nameLocal: string; // Name in local language
  flag: string; // Emoji flag
  locale: string; // BCP 47 locale code
  currency: string; // ISO 4217 currency code
  vatRate: number; // Default VAT rate (percentage)
  ssmAuthority: string; // Main occupational safety authority
  ssmAuthorityAbbr: string; // Authority abbreviation
  mainLaw: string; // Main SSM/PSI legislation
  mainLawYear: number; // Year of main legislation
  timezone: string; // IANA timezone
  phonePrefix: string; // International phone prefix
  dateFormat: string; // Common date format
  emergencyNumber: string; // Emergency phone number
}

export const COUNTRIES: Record<string, CountryConfig> = {
  RO: {
    code: 'RO',
    name: 'Romania',
    nameLocal: 'România',
    flag: '🇷🇴',
    locale: 'ro-RO',
    currency: 'RON',
    vatRate: 19,
    ssmAuthority: 'Inspectoratul Teritorial de Muncă',
    ssmAuthorityAbbr: 'ITM',
    mainLaw: 'Legea 319/2006 privind securitatea și sănătatea în muncă',
    mainLawYear: 2006,
    timezone: 'Europe/Bucharest',
    phonePrefix: '+40',
    dateFormat: 'DD.MM.YYYY',
    emergencyNumber: '112',
  },

  BG: {
    code: 'BG',
    name: 'Bulgaria',
    nameLocal: 'България',
    flag: '🇧🇬',
    locale: 'bg-BG',
    currency: 'BGN',
    vatRate: 20,
    ssmAuthority: 'Главна инспекция по труда',
    ssmAuthorityAbbr: 'ГИТ',
    mainLaw: 'Закон за здравословни и безопасни условия на труд',
    mainLawYear: 1997,
    timezone: 'Europe/Sofia',
    phonePrefix: '+359',
    dateFormat: 'DD.MM.YYYY',
    emergencyNumber: '112',
  },

  HU: {
    code: 'HU',
    name: 'Hungary',
    nameLocal: 'Magyarország',
    flag: '🇭🇺',
    locale: 'hu-HU',
    currency: 'HUF',
    vatRate: 27,
    ssmAuthority: 'Nemzeti Munkaügyi Hivatal',
    ssmAuthorityAbbr: 'NMH',
    mainLaw: 'Munkavédelmi törvény (1993. évi XCIII. törvény)',
    mainLawYear: 1993,
    timezone: 'Europe/Budapest',
    phonePrefix: '+36',
    dateFormat: 'YYYY.MM.DD',
    emergencyNumber: '112',
  },

  DE: {
    code: 'DE',
    name: 'Germany',
    nameLocal: 'Deutschland',
    flag: '🇩🇪',
    locale: 'de-DE',
    currency: 'EUR',
    vatRate: 19,
    ssmAuthority: 'Bundesanstalt für Arbeitsschutz und Arbeitsmedizin',
    ssmAuthorityAbbr: 'BAuA',
    mainLaw: 'Arbeitsschutzgesetz (ArbSchG)',
    mainLawYear: 1996,
    timezone: 'Europe/Berlin',
    phonePrefix: '+49',
    dateFormat: 'DD.MM.YYYY',
    emergencyNumber: '112',
  },

  PL: {
    code: 'PL',
    name: 'Poland',
    nameLocal: 'Polska',
    flag: '🇵🇱',
    locale: 'pl-PL',
    currency: 'PLN',
    vatRate: 23,
    ssmAuthority: 'Państwowa Inspekcja Pracy',
    ssmAuthorityAbbr: 'PIP',
    mainLaw: 'Ustawa z dnia 26 czerwca 1974 r. Kodeks pracy',
    mainLawYear: 1974,
    timezone: 'Europe/Warsaw',
    phonePrefix: '+48',
    dateFormat: 'DD.MM.YYYY',
    emergencyNumber: '112',
  },
};

/**
 * Get country configuration by country code
 */
export function getCountryConfig(countryCode: string): CountryConfig | undefined {
  return COUNTRIES[countryCode.toUpperCase()];
}

/**
 * Get all available country codes
 */
export function getCountryCodes(): string[] {
  return Object.keys(COUNTRIES);
}

/**
 * Get all country configurations as array
 */
export function getAllCountries(): CountryConfig[] {
  return Object.values(COUNTRIES);
}

/**
 * Get countries sorted by name
 */
export function getCountriesSorted(locale: string = 'en'): CountryConfig[] {
  return getAllCountries().sort((a, b) =>
    a.name.localeCompare(b.name, locale)
  );
}

/**
 * Format country display name with flag
 */
export function formatCountryName(countryCode: string, includeFlag: boolean = true): string {
  const config = getCountryConfig(countryCode);
  if (!config) return countryCode;

  return includeFlag ? `${config.flag} ${config.name}` : config.name;
}

/**
 * Get SSM authority display text
 */
export function getAuthorityDisplay(countryCode: string, useAbbr: boolean = false): string {
  const config = getCountryConfig(countryCode);
  if (!config) return '';

  return useAbbr ? config.ssmAuthorityAbbr : config.ssmAuthority;
}

/**
 * Format phone number with country prefix
 */
export function formatPhoneNumber(phoneNumber: string, countryCode: string): string {
  const config = getCountryConfig(countryCode);
  if (!config) return phoneNumber;

  // Remove any existing prefix
  let cleaned = phoneNumber.replace(/^\+?\d{1,3}/, '').trim();

  // Add country prefix
  return `${config.phonePrefix}${cleaned}`;
}

/**
 * Check if country uses Euro
 */
export function usesEuro(countryCode: string): boolean {
  const config = getCountryConfig(countryCode);
  return config?.currency === 'EUR';
}

/**
 * Get localized date format example
 */
export function getDateFormatExample(countryCode: string): string {
  const config = getCountryConfig(countryCode);
  if (!config) return '';

  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  return config.dateFormat
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', String(year));
}
