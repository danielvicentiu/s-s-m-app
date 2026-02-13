/**
 * SSM/PSI Penalties Database - Multi-Country
 *
 * Sanctiuni pentru incalcari SSM (Securitate si Sanatate in Munca)
 * si PSI (Prevenire si Stingere Incendii) pentru 5 tari.
 */

export interface PenaltyRange {
  min: number;
  max: number;
  currency: string;
}

export interface CountryPenalty {
  country: string;
  countryCode: string;
  authority: string;
  authorityAbbreviation: string;
  penaltyRange: PenaltyRange;
  description: string;
}

export const PENALTIES_PER_COUNTRY: CountryPenalty[] = [
  {
    country: 'Romania',
    countryCode: 'RO',
    authority: 'Inspectia Muncii',
    authorityAbbreviation: 'ITM',
    penaltyRange: {
      min: 5000,
      max: 100000,
      currency: 'RON'
    },
    description: 'Sanctiuni pentru incalcari ale legislatiei SSM si PSI in Romania'
  },
  {
    country: 'Bulgaria',
    countryCode: 'BG',
    authority: 'General Labour Inspectorate',
    authorityAbbreviation: 'GLI',
    penaltyRange: {
      min: 1500,
      max: 15000,
      currency: 'BGN'
    },
    description: 'Sanctions for violations of OSH and fire safety legislation in Bulgaria'
  },
  {
    country: 'Hungary',
    countryCode: 'HU',
    authority: 'Országos Munkavédelmi és Munkaügyi Főfelügyelőség',
    authorityAbbreviation: 'OMMF',
    penaltyRange: {
      min: 50000,
      max: 10000000,
      currency: 'HUF'
    },
    description: 'Büntetések a munkavédelmi és tűzvédelmi jogszabályok megsértéséért Magyarországon'
  },
  {
    country: 'Germany',
    countryCode: 'DE',
    authority: 'Gewerbeaufsichtsamt',
    authorityAbbreviation: 'GAA',
    penaltyRange: {
      min: 0,
      max: 25000,
      currency: 'EUR'
    },
    description: 'Strafen für Verstöße gegen Arbeitsschutz- und Brandschutzvorschriften in Deutschland'
  },
  {
    country: 'Poland',
    countryCode: 'PL',
    authority: 'Państwowa Inspekcja Pracy',
    authorityAbbreviation: 'PIP',
    penaltyRange: {
      min: 1000,
      max: 30000,
      currency: 'PLN'
    },
    description: 'Kary za naruszenia przepisów BHP i ochrony przeciwpożarowej w Polsce'
  }
];

/**
 * Get penalty information for a specific country
 */
export function getPenaltyByCountryCode(countryCode: string): CountryPenalty | undefined {
  return PENALTIES_PER_COUNTRY.find(p => p.countryCode === countryCode);
}

/**
 * Get penalty information for a specific country by name
 */
export function getPenaltyByCountryName(countryName: string): CountryPenalty | undefined {
  return PENALTIES_PER_COUNTRY.find(
    p => p.country.toLowerCase() === countryName.toLowerCase()
  );
}

/**
 * Get all supported country codes
 */
export function getSupportedCountries(): string[] {
  return PENALTIES_PER_COUNTRY.map(p => p.countryCode);
}

/**
 * Format penalty range as string
 */
export function formatPenaltyRange(penalty: CountryPenalty): string {
  const { min, max, currency } = penalty.penaltyRange;
  return `${min.toLocaleString()} - ${max.toLocaleString()} ${currency}`;
}
