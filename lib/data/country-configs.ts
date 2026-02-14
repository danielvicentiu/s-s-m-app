/**
 * Country-specific configurations for SSM/PSI platform
 * Includes labor law, compliance, and regulatory data for 2025
 */

export interface CountryConfig {
  /** ISO 3166-1 alpha-2 country code */
  code: string;
  /** Country name in English */
  name: string;
  /** Country name in local language */
  nameLocal: string;
  /** Currency code (ISO 4217) */
  currency: string;
  /** Currency symbol */
  currencySymbol: string;
  /** Standard VAT rate (%) */
  vatRate: number;
  /** Date format pattern (for display) */
  dateFormat: string;
  /** International phone prefix */
  phonePrefix: string;
  /** Primary language code (ISO 639-1) */
  language: string;
  /** IANA timezone identifier */
  timezone: string;
  /** Names of regulatory inspectorates/authorities */
  inspectorateNames: {
    /** Occupational health & safety authority */
    ssm: string;
    /** Fire safety authority */
    psi: string;
    /** Data protection authority */
    gdpr: string;
    /** Cybersecurity authority (NIS2 directive) */
    nis2: string;
  };
  /** Standard work hours per week */
  workHoursWeek: number;
  /** Minimum gross wage per month (local currency, 2025) */
  minWage: number;
  /** Minimum annual paid holiday days */
  holidaysDays: number;
}

/**
 * Country configurations database
 * Updated for 2025 with real regulatory data
 */
export const COUNTRY_CONFIGS: CountryConfig[] = [
  {
    code: 'RO',
    name: 'Romania',
    nameLocal: 'România',
    currency: 'RON',
    currencySymbol: 'lei',
    vatRate: 19,
    dateFormat: 'DD.MM.YYYY',
    phonePrefix: '+40',
    language: 'ro',
    timezone: 'Europe/Bucharest',
    inspectorateNames: {
      ssm: 'Inspectoratul Teritorial de Muncă (ITM)',
      psi: 'Inspectoratul pentru Situații de Urgență (ISU)',
      gdpr: 'Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)',
      nis2: 'Direcția Națională de Securitate Cibernetică (DNSC)',
    },
    workHoursWeek: 40,
    minWage: 3700, // RON gross/month (2025)
    holidaysDays: 20,
  },
  {
    code: 'BG',
    name: 'Bulgaria',
    nameLocal: 'България',
    currency: 'BGN',
    currencySymbol: 'лв',
    vatRate: 20,
    dateFormat: 'DD.MM.YYYY',
    phonePrefix: '+359',
    language: 'bg',
    timezone: 'Europe/Sofia',
    inspectorateNames: {
      ssm: 'Изпълнителна агенция „Главна инспекция по труда" (ГИТ)',
      psi: 'Главна дирекция „Пожарна безопасност и защита на населението" (ГДПБЗН)',
      gdpr: 'Комисия за защита на личните данни (КЗЛД)',
      nis2: 'Държавна агенция „Електронно управление" (ДАЕУ)',
    },
    workHoursWeek: 40,
    minWage: 933, // BGN gross/month (2025)
    holidaysDays: 20,
  },
  {
    code: 'HU',
    name: 'Hungary',
    nameLocal: 'Magyarország',
    currency: 'HUF',
    currencySymbol: 'Ft',
    vatRate: 27,
    dateFormat: 'YYYY.MM.DD',
    phonePrefix: '+36',
    language: 'hu',
    timezone: 'Europe/Budapest',
    inspectorateNames: {
      ssm: 'Országos Munkavédelmi és Munkaügyi Főfelügyelőség (OMMF)',
      psi: 'Belügyminisztérium Országos Katasztrófavédelmi Főigazgatóság (BM OKF)',
      gdpr: 'Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH)',
      nis2: 'Nemzeti Kibervédelmi Intézet (NKI)',
    },
    workHoursWeek: 40,
    minWage: 290800, // HUF gross/month (2025)
    holidaysDays: 20,
  },
  {
    code: 'DE',
    name: 'Germany',
    nameLocal: 'Deutschland',
    currency: 'EUR',
    currencySymbol: '€',
    vatRate: 19,
    dateFormat: 'DD.MM.YYYY',
    phonePrefix: '+49',
    language: 'de',
    timezone: 'Europe/Berlin',
    inspectorateNames: {
      ssm: 'Bundesanstalt für Arbeitsschutz und Arbeitsmedizin (BAuA)',
      psi: 'Bundesamt für Bevölkerungsschutz und Katastrophenhilfe (BBK)',
      gdpr: 'Der Bundesbeauftragte für den Datenschutz und die Informationsfreiheit (BfDI)',
      nis2: 'Bundesamt für Sicherheit in der Informationstechnik (BSI)',
    },
    workHoursWeek: 40,
    minWage: 2151, // EUR gross/month (12.82 EUR/hour * 167.67 hours, 2025)
    holidaysDays: 20,
  },
  {
    code: 'PL',
    name: 'Poland',
    nameLocal: 'Polska',
    currency: 'PLN',
    currencySymbol: 'zł',
    vatRate: 23,
    dateFormat: 'DD.MM.YYYY',
    phonePrefix: '+48',
    language: 'pl',
    timezone: 'Europe/Warsaw',
    inspectorateNames: {
      ssm: 'Państwowa Inspekcja Pracy (PIP)',
      psi: 'Państwowa Straż Pożarna (PSP)',
      gdpr: 'Urząd Ochrony Danych Osobowych (UODO)',
      nis2: 'Naukowa i Akademicka Sieć Komputerowa (NASK)',
    },
    workHoursWeek: 40,
    minWage: 4666, // PLN gross/month (2025)
    holidaysDays: 20,
  },
];

/**
 * Get country configuration by country code
 * @param code ISO 3166-1 alpha-2 country code (case-insensitive)
 * @returns CountryConfig or undefined if not found
 */
export function getCountryConfig(code: string): CountryConfig | undefined {
  return COUNTRY_CONFIGS.find(
    (config) => config.code.toLowerCase() === code.toLowerCase()
  );
}

/**
 * Get all available country codes
 * @returns Array of country codes
 */
export function getAvailableCountryCodes(): string[] {
  return COUNTRY_CONFIGS.map((config) => config.code);
}

/**
 * Check if a country code is supported
 * @param code ISO 3166-1 alpha-2 country code
 * @returns true if country is configured
 */
export function isCountrySupported(code: string): boolean {
  return getCountryConfig(code) !== undefined;
}

/**
 * Get country name in local language
 * @param code ISO 3166-1 alpha-2 country code
 * @returns Local country name or undefined
 */
export function getCountryNameLocal(code: string): string | undefined {
  return getCountryConfig(code)?.nameLocal;
}

/**
 * Format currency amount for a specific country
 * @param amount Numeric amount
 * @param countryCode ISO 3166-1 alpha-2 country code
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, countryCode: string): string {
  const config = getCountryConfig(countryCode);
  if (!config) return amount.toString();

  const formatted = new Intl.NumberFormat(config.language, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${formatted} ${config.currencySymbol}`;
}
