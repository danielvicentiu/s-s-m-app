/**
 * SSM (Occupational Health & Safety) Penalties Database
 * Multi-country penalty ranges for workplace safety violations
 *
 * Countries covered: Romania, Bulgaria, Hungary, Germany, Poland
 */

export interface PenaltyRange {
  min: number;
  max: number;
  currency: string;
}

export interface Violation {
  type: string;
  description: string;
  penaltyRange: PenaltyRange;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface CountryPenalties {
  country: string;
  countryCode: string;
  authority: string;
  authorityAbbreviation: string;
  currency: string;
  violations: Violation[];
}

export const penaltiesPerCountry: CountryPenalties[] = [
  {
    country: 'România',
    countryCode: 'RO',
    authority: 'Inspectoratul Teritorial de Muncă',
    authorityAbbreviation: 'ITM',
    currency: 'RON',
    violations: [
      {
        type: 'missing_ssm_documentation',
        description: 'Lipsa documentației SSM obligatorii',
        penaltyRange: { min: 5000, max: 10000, currency: 'RON' },
        severity: 'medium'
      },
      {
        type: 'untrained_employees',
        description: 'Angajați fără instruire SSM',
        penaltyRange: { min: 10000, max: 20000, currency: 'RON' },
        severity: 'high'
      },
      {
        type: 'expired_medical_certificates',
        description: 'Avize medicale expirate sau lipsă',
        penaltyRange: { min: 8000, max: 15000, currency: 'RON' },
        severity: 'high'
      },
      {
        type: 'missing_ppe',
        description: 'Echipament de protecție lipsă sau neadecvat',
        penaltyRange: { min: 7000, max: 12000, currency: 'RON' },
        severity: 'medium'
      },
      {
        type: 'no_risk_assessment',
        description: 'Lipsa evaluării riscurilor profesionale',
        penaltyRange: { min: 15000, max: 30000, currency: 'RON' },
        severity: 'critical'
      },
      {
        type: 'workplace_accident_unreported',
        description: 'Nedeclararea accidentelor de muncă',
        penaltyRange: { min: 20000, max: 50000, currency: 'RON' },
        severity: 'critical'
      },
      {
        type: 'unsafe_working_conditions',
        description: 'Condiții de muncă periculoase',
        penaltyRange: { min: 30000, max: 100000, currency: 'RON' },
        severity: 'critical'
      },
      {
        type: 'no_ssm_responsible',
        description: 'Lipsa responsabilului SSM sau serviciu extern',
        penaltyRange: { min: 10000, max: 25000, currency: 'RON' },
        severity: 'high'
      }
    ]
  },
  {
    country: 'Bulgaria',
    countryCode: 'BG',
    authority: 'Главна инспекция по труда',
    authorityAbbreviation: 'ГИТ (GLI)',
    currency: 'BGN',
    violations: [
      {
        type: 'missing_health_safety_documentation',
        description: 'Липса на здравна и охранителна документация',
        penaltyRange: { min: 1500, max: 3000, currency: 'BGN' },
        severity: 'medium'
      },
      {
        type: 'untrained_workers',
        description: 'Работници без обучение за здраве и безопасност',
        penaltyRange: { min: 2000, max: 5000, currency: 'BGN' },
        severity: 'high'
      },
      {
        type: 'missing_medical_examinations',
        description: 'Липсващи медицински прегледи',
        penaltyRange: { min: 1500, max: 4000, currency: 'BGN' },
        severity: 'high'
      },
      {
        type: 'inadequate_protective_equipment',
        description: 'Неадекватно защитно оборудване',
        penaltyRange: { min: 2000, max: 4500, currency: 'BGN' },
        severity: 'medium'
      },
      {
        type: 'no_risk_evaluation',
        description: 'Липса на оценка на рисковете',
        penaltyRange: { min: 3000, max: 7000, currency: 'BGN' },
        severity: 'critical'
      },
      {
        type: 'unreported_workplace_injury',
        description: 'Недокладвани трудови злополуки',
        penaltyRange: { min: 5000, max: 10000, currency: 'BGN' },
        severity: 'critical'
      },
      {
        type: 'hazardous_work_environment',
        description: 'Опасна работна среда',
        penaltyRange: { min: 7000, max: 15000, currency: 'BGN' },
        severity: 'critical'
      },
      {
        type: 'no_safety_specialist',
        description: 'Липса на специалист по безопасност',
        penaltyRange: { min: 2500, max: 6000, currency: 'BGN' },
        severity: 'high'
      }
    ]
  },
  {
    country: 'Ungaria',
    countryCode: 'HU',
    authority: 'Országos Munkavédelmi és Munkaügyi Főfelügyelőség',
    authorityAbbreviation: 'OMMF',
    currency: 'HUF',
    violations: [
      {
        type: 'missing_safety_documentation',
        description: 'Hiányzó munkavédelmi dokumentáció',
        penaltyRange: { min: 50000, max: 200000, currency: 'HUF' },
        severity: 'medium'
      },
      {
        type: 'insufficient_safety_training',
        description: 'Nem megfelelő munkavédelmi oktatás',
        penaltyRange: { min: 100000, max: 500000, currency: 'HUF' },
        severity: 'high'
      },
      {
        type: 'expired_health_certificates',
        description: 'Lejárt egészségügyi alkalmassági vizsgálatok',
        penaltyRange: { min: 80000, max: 300000, currency: 'HUF' },
        severity: 'high'
      },
      {
        type: 'missing_protective_gear',
        description: 'Hiányzó védőfelszerelés',
        penaltyRange: { min: 100000, max: 400000, currency: 'HUF' },
        severity: 'medium'
      },
      {
        type: 'no_workplace_risk_assessment',
        description: 'Munkahelyi kockázatértékelés hiánya',
        penaltyRange: { min: 200000, max: 1000000, currency: 'HUF' },
        severity: 'critical'
      },
      {
        type: 'unreported_work_accident',
        description: 'Be nem jelentett munkahelyi baleset',
        penaltyRange: { min: 500000, max: 2000000, currency: 'HUF' },
        severity: 'critical'
      },
      {
        type: 'dangerous_workplace_conditions',
        description: 'Veszélyes munkakörülmények',
        penaltyRange: { min: 1000000, max: 10000000, currency: 'HUF' },
        severity: 'critical'
      },
      {
        type: 'no_safety_officer',
        description: 'Munkavédelmi felelős hiánya',
        penaltyRange: { min: 150000, max: 600000, currency: 'HUF' },
        severity: 'high'
      }
    ]
  },
  {
    country: 'Germania',
    countryCode: 'DE',
    authority: 'Gewerbeaufsichtsamt / Berufsgenossenschaft',
    authorityAbbreviation: 'GAA/BG',
    currency: 'EUR',
    violations: [
      {
        type: 'missing_safety_documentation',
        description: 'Fehlende Arbeitsschutzdokumentation',
        penaltyRange: { min: 500, max: 2500, currency: 'EUR' },
        severity: 'medium'
      },
      {
        type: 'inadequate_safety_training',
        description: 'Unzureichende Sicherheitsunterweisung',
        penaltyRange: { min: 1000, max: 5000, currency: 'EUR' },
        severity: 'high'
      },
      {
        type: 'missing_medical_examinations',
        description: 'Fehlende arbeitsmedizinische Untersuchungen',
        penaltyRange: { min: 800, max: 3000, currency: 'EUR' },
        severity: 'high'
      },
      {
        type: 'inadequate_ppe',
        description: 'Unzureichende persönliche Schutzausrüstung',
        penaltyRange: { min: 1000, max: 4000, currency: 'EUR' },
        severity: 'medium'
      },
      {
        type: 'missing_risk_assessment',
        description: 'Fehlende Gefährdungsbeurteilung',
        penaltyRange: { min: 2000, max: 8000, currency: 'EUR' },
        severity: 'critical'
      },
      {
        type: 'unreported_workplace_accident',
        description: 'Nicht gemeldeter Arbeitsunfall',
        penaltyRange: { min: 3000, max: 15000, currency: 'EUR' },
        severity: 'critical'
      },
      {
        type: 'unsafe_working_conditions',
        description: 'Unsichere Arbeitsbedingungen',
        penaltyRange: { min: 5000, max: 25000, currency: 'EUR' },
        severity: 'critical'
      },
      {
        type: 'no_safety_officer',
        description: 'Fehlende Fachkraft für Arbeitssicherheit',
        penaltyRange: { min: 1500, max: 6000, currency: 'EUR' },
        severity: 'high'
      }
    ]
  },
  {
    country: 'Polonia',
    countryCode: 'PL',
    authority: 'Państwowa Inspekcja Pracy',
    authorityAbbreviation: 'PIP',
    currency: 'PLN',
    violations: [
      {
        type: 'missing_safety_documentation',
        description: 'Brak dokumentacji BHP',
        penaltyRange: { min: 1000, max: 5000, currency: 'PLN' },
        severity: 'medium'
      },
      {
        type: 'insufficient_safety_training',
        description: 'Niewystarczające szkolenie BHP',
        penaltyRange: { min: 2000, max: 8000, currency: 'PLN' },
        severity: 'high'
      },
      {
        type: 'expired_medical_certificates',
        description: 'Przeterminowane badania lekarskie',
        penaltyRange: { min: 1500, max: 6000, currency: 'PLN' },
        severity: 'high'
      },
      {
        type: 'missing_protective_equipment',
        description: 'Brak środków ochrony indywidualnej',
        penaltyRange: { min: 2000, max: 7000, currency: 'PLN' },
        severity: 'medium'
      },
      {
        type: 'no_risk_assessment',
        description: 'Brak oceny ryzyka zawodowego',
        penaltyRange: { min: 3000, max: 12000, currency: 'PLN' },
        severity: 'critical'
      },
      {
        type: 'unreported_workplace_accident',
        description: 'Niezgłoszony wypadek przy pracy',
        penaltyRange: { min: 5000, max: 20000, currency: 'PLN' },
        severity: 'critical'
      },
      {
        type: 'hazardous_work_conditions',
        description: 'Niebezpieczne warunki pracy',
        penaltyRange: { min: 8000, max: 30000, currency: 'PLN' },
        severity: 'critical'
      },
      {
        type: 'no_safety_specialist',
        description: 'Brak inspektora BHP',
        penaltyRange: { min: 2500, max: 10000, currency: 'PLN' },
        severity: 'high'
      }
    ]
  }
];

/**
 * Helper function to get penalties by country code
 */
export function getPenaltiesByCountry(countryCode: string): CountryPenalties | undefined {
  return penaltiesPerCountry.find(c => c.countryCode === countryCode);
}

/**
 * Helper function to get all supported countries
 */
export function getSupportedCountries(): string[] {
  return penaltiesPerCountry.map(c => c.countryCode);
}

/**
 * Helper function to format penalty range
 */
export function formatPenaltyRange(penaltyRange: PenaltyRange): string {
  return `${penaltyRange.min.toLocaleString()} - ${penaltyRange.max.toLocaleString()} ${penaltyRange.currency}`;
}
