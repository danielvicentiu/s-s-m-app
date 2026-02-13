/**
 * SSM/PSI Authorities Data per Country
 *
 * Contains official authorities, reporting obligations, and compliance requirements
 * for Occupational Health & Safety (SSM) and Fire Safety (PSI) across supported countries.
 *
 * Countries: Romania, Bulgaria, Hungary, Germany, Austria
 */

export interface Authority {
  name: string;
  nameLocal?: string; // Name in local language
  acronym: string;
  website: string;
  phone?: string;
  email?: string;
  description?: string;
}

export interface ReportingObligation {
  type: string;
  frequency: string;
  deadline?: string;
  description: string;
  authority: string; // Which authority to report to
  onlineSubmission: boolean;
}

export interface CountryAuthorities {
  countryCode: string;
  countryName: string;
  countryNameLocal: string;
  mainAuthority: Authority;
  secondaryAuthorities: Authority[];
  reportingObligations: ReportingObligation[];
  inspectionFrequency: string;
  onlinePortal?: {
    name: string;
    url: string;
    description: string;
  };
}

export const authoritiesData: CountryAuthorities[] = [
  // ROMANIA
  {
    countryCode: 'RO',
    countryName: 'Romania',
    countryNameLocal: 'România',
    mainAuthority: {
      name: 'Labour Inspection',
      nameLocal: 'Inspecția Muncii',
      acronym: 'ITM',
      website: 'https://www.inspectiamuncii.ro',
      phone: '+40 21 202 68 00',
      email: 'inspectmun@inspectiamuncii.ro',
      description: 'Main authority for occupational health and safety in Romania',
    },
    secondaryAuthorities: [
      {
        name: 'General Inspectorate for Emergency Situations',
        nameLocal: 'Inspectoratul General pentru Situații de Urgență',
        acronym: 'IGSU',
        website: 'https://www.igsu.ro',
        phone: '+40 21 316 30 18',
        email: 'oficiu.relatii.publice@igsu.ro',
        description: 'Fire safety and emergency prevention authority',
      },
      {
        name: 'National Public Health Institute',
        nameLocal: 'Institutul Național de Sănătate Publică',
        acronym: 'INSP',
        website: 'https://www.insp.gov.ro',
        phone: '+40 21 318 36 20',
        email: 'insp@insp.gov.ro',
        description: 'Occupational health and hygiene monitoring',
      },
      {
        name: 'National Authority for Qualifications',
        nameLocal: 'Autoritatea Națională pentru Calificări',
        acronym: 'ANC',
        website: 'https://www.anc.edu.ro',
        phone: '+40 21 405 56 72',
        email: 'office@anc.edu.ro',
        description: 'Certification of SSM trainers and programs',
      },
    ],
    reportingObligations: [
      {
        type: 'Work Accidents',
        frequency: 'Within 24 hours',
        deadline: 'Immediately for severe accidents',
        description: 'Mandatory reporting of all work accidents to ITM',
        authority: 'ITM',
        onlineSubmission: true,
      },
      {
        type: 'Occupational Diseases',
        frequency: 'Within 5 days of diagnosis',
        description: 'Report all confirmed occupational diseases',
        authority: 'ITM',
        onlineSubmission: true,
      },
      {
        type: 'Annual SSM Activity Report',
        frequency: 'Annual',
        deadline: 'January 31st',
        description: 'Annual report on SSM activities and incidents',
        authority: 'ITM',
        onlineSubmission: true,
      },
      {
        type: 'Fire Safety Authorization',
        frequency: 'Periodic renewal',
        deadline: 'Based on activity risk class',
        description: 'Obtain and renew PSI authorization',
        authority: 'IGSU',
        onlineSubmission: false,
      },
      {
        type: 'Occupational Health Monitoring',
        frequency: 'Annual',
        description: 'Medical surveillance results reporting',
        authority: 'INSP',
        onlineSubmission: false,
      },
    ],
    inspectionFrequency: 'Risk-based: High risk annually, medium risk every 2-3 years, low risk every 5 years',
    onlinePortal: {
      name: 'REVISAL - Labour Inspection Online Portal',
      url: 'https://www.revisal.ro',
      description: 'Online platform for labour inspections, work accident reporting, and compliance documentation',
    },
  },

  // BULGARIA
  {
    countryCode: 'BG',
    countryName: 'Bulgaria',
    countryNameLocal: 'България',
    mainAuthority: {
      name: 'Executive Agency "General Labour Inspectorate"',
      nameLocal: 'Изпълнителна агенция "Главна инспекция по труда"',
      acronym: 'EA GLI',
      website: 'https://www.gli.government.bg',
      phone: '+359 2 8139 504',
      email: 'info@gli.government.bg',
      description: 'Main authority for labour and occupational safety inspection',
    },
    secondaryAuthorities: [
      {
        name: 'Main Directorate "Fire Safety and Protection of the Population"',
        nameLocal: 'Главна дирекция "Пожарна безопасност и защита на населението"',
        acronym: 'GDPBZN',
        website: 'https://www.nsgd.government.bg',
        phone: '+359 2 982 2222',
        email: 'press@nsgd.government.bg',
        description: 'Fire safety and civil protection authority',
      },
      {
        name: 'Regional Health Inspectorates',
        nameLocal: 'Регионални здравни инспекции',
        acronym: 'RZI',
        website: 'https://www.rzi.bg',
        phone: '+359 2 805 6310',
        email: 'rzi@rzi.bg',
        description: 'Occupational health and hygiene control',
      },
      {
        name: 'National Agency for Vocational Education and Training',
        nameLocal: 'Национална агенция за професионално образование и обучение',
        acronym: 'NAPOO',
        website: 'https://www.navet.government.bg',
        phone: '+359 2 971 42 22',
        email: 'napoo@navet.government.bg',
        description: 'Licensing of training providers',
      },
    ],
    reportingObligations: [
      {
        type: 'Work Accidents',
        frequency: 'Within 24 hours',
        deadline: 'Immediately for fatal accidents',
        description: 'All work accidents must be reported to GLI',
        authority: 'EA GLI',
        onlineSubmission: true,
      },
      {
        type: 'Occupational Diseases',
        frequency: 'Within 3 days',
        description: 'Report confirmed occupational diseases',
        authority: 'EA GLI',
        onlineSubmission: true,
      },
      {
        type: 'Risk Assessment Updates',
        frequency: 'Annual or when significant changes occur',
        description: 'Updated risk assessments must be documented',
        authority: 'EA GLI',
        onlineSubmission: false,
      },
      {
        type: 'Fire Safety Inspection',
        frequency: 'Annual for high-risk facilities',
        description: 'Fire safety compliance certification',
        authority: 'GDPBZN',
        onlineSubmission: false,
      },
    ],
    inspectionFrequency: 'Risk-based: High risk facilities inspected annually, others every 2-5 years',
    onlinePortal: {
      name: 'GLI Online Portal',
      url: 'https://e-services.gli.government.bg',
      description: 'Electronic services for accident reporting and compliance documentation',
    },
  },

  // HUNGARY
  {
    countryCode: 'HU',
    countryName: 'Hungary',
    countryNameLocal: 'Magyarország',
    mainAuthority: {
      name: 'National Labour Office',
      nameLocal: 'Nemzeti Munkaügyi Hivatal',
      acronym: 'NMH',
      website: 'https://www.munkaugy.gov.hu',
      phone: '+36 1 474 3100',
      email: 'ugyfelszolgalat@nmhh.hu',
      description: 'Central authority for labour inspection and occupational safety',
    },
    secondaryAuthorities: [
      {
        name: 'National Directorate General for Disaster Management',
        nameLocal: 'Országos Katasztrófavédelmi Főigazgatóság',
        acronym: 'OKF',
        website: 'https://www.katasztrofavedelem.hu',
        phone: '+36 1 465 5100',
        email: 'tmf@katasztrofavedelem.hu',
        description: 'Fire protection and disaster prevention authority',
      },
      {
        name: 'National Public Health Center',
        nameLocal: 'Nemzeti Népegészségügyi Központ',
        acronym: 'NNK',
        website: 'https://www.nnk.gov.hu',
        phone: '+36 1 476 1100',
        email: 'nnk@nnk.gov.hu',
        description: 'Occupational health and epidemiology',
      },
      {
        name: 'Hungarian Chamber of Commerce and Industry',
        nameLocal: 'Magyar Kereskedelmi és Iparkamara',
        acronym: 'MKIK',
        website: 'https://www.mkik.hu',
        phone: '+36 1 474 5141',
        email: 'mkik@mkik.hu',
        description: 'Training certification and business compliance support',
      },
    ],
    reportingObligations: [
      {
        type: 'Work Accidents',
        frequency: 'Within 8 hours',
        deadline: 'Immediately for serious accidents',
        description: 'Mandatory reporting of all workplace accidents',
        authority: 'NMH',
        onlineSubmission: true,
      },
      {
        type: 'Occupational Diseases',
        frequency: 'Within 15 days',
        description: 'Report all diagnosed occupational diseases',
        authority: 'NMH',
        onlineSubmission: true,
      },
      {
        type: 'Annual Safety Report',
        frequency: 'Annual',
        deadline: 'February 15th',
        description: 'Yearly summary of safety activities and incidents',
        authority: 'NMH',
        onlineSubmission: true,
      },
      {
        type: 'Fire Protection Documentation',
        frequency: 'Periodic renewal',
        deadline: 'Based on facility classification',
        description: 'Fire safety plans and compliance certificates',
        authority: 'OKF',
        onlineSubmission: false,
      },
    ],
    inspectionFrequency: 'Risk-based inspections: High-risk annually, medium-risk every 2 years, low-risk every 4-5 years',
    onlinePortal: {
      name: 'E-Munkaugy Portal',
      url: 'https://emunkaugy.gov.hu',
      description: 'Electronic platform for labour administration and accident reporting',
    },
  },

  // GERMANY
  {
    countryCode: 'DE',
    countryName: 'Germany',
    countryNameLocal: 'Deutschland',
    mainAuthority: {
      name: 'German Social Accident Insurance',
      nameLocal: 'Deutsche Gesetzliche Unfallversicherung',
      acronym: 'DGUV',
      website: 'https://www.dguv.de',
      phone: '+49 30 13001 0',
      email: 'info@dguv.de',
      description: 'Umbrella organization for statutory accident insurance and prevention',
    },
    secondaryAuthorities: [
      {
        name: 'Federal Institute for Occupational Safety and Health',
        nameLocal: 'Bundesanstalt für Arbeitsschutz und Arbeitsmedizin',
        acronym: 'BAuA',
        website: 'https://www.baua.de',
        phone: '+49 231 9071 0',
        email: 'info@baua.bund.de',
        description: 'Research and policy for occupational safety and health',
      },
      {
        name: 'State Labour Inspectorates',
        nameLocal: 'Länder-Arbeitsschutzbehörden',
        acronym: 'LAS',
        website: 'https://www.stmas.bayern.de/arbeitsschutz',
        description: 'Regional labour inspection authorities (16 states)',
      },
      {
        name: 'Association of German Engineers',
        nameLocal: 'Verein Deutscher Ingenieure',
        acronym: 'VDI',
        website: 'https://www.vdi.de',
        phone: '+49 211 6214 0',
        email: 'vdi@vdi.de',
        description: 'Technical standards and professional certification',
      },
      {
        name: 'Fire Prevention Departments',
        nameLocal: 'Feuerwehr Präventionsabteilungen',
        acronym: 'FW',
        website: 'https://www.feuerwehrverband.de',
        description: 'Municipal fire safety inspection services',
      },
    ],
    reportingObligations: [
      {
        type: 'Work Accidents',
        frequency: 'Within 3 days',
        deadline: 'Immediately for severe injuries',
        description: 'Report accidents requiring more than 3 days of absence',
        authority: 'DGUV',
        onlineSubmission: true,
      },
      {
        type: 'Occupational Diseases',
        frequency: 'Upon diagnosis',
        description: 'Mandatory reporting of suspected occupational diseases',
        authority: 'DGUV',
        onlineSubmission: true,
      },
      {
        type: 'Risk Assessment Documentation',
        frequency: 'Continuous updates',
        description: 'Gefährdungsbeurteilung must be current and accessible',
        authority: 'State Labour Inspectorates',
        onlineSubmission: false,
      },
      {
        type: 'Safety Committee Minutes',
        frequency: 'Quarterly (for companies >20 employees)',
        description: 'Document safety committee meetings',
        authority: 'DGUV',
        onlineSubmission: false,
      },
      {
        type: 'Fire Protection Documentation',
        frequency: 'Annual inspection',
        description: 'Brandschutzordnung and evacuation plans',
        authority: 'Local Fire Department',
        onlineSubmission: false,
      },
    ],
    inspectionFrequency: 'Risk-based and employer-driven prevention system; high-risk facilities inspected annually',
    onlinePortal: {
      name: 'DGUV Portal',
      url: 'https://www.dguv.de/de/ihr_partner/unternehmen/index.jsp',
      description: 'Online services for accident insurance, reporting, and prevention resources',
    },
  },

  // AUSTRIA
  {
    countryCode: 'AT',
    countryName: 'Austria',
    countryNameLocal: 'Österreich',
    mainAuthority: {
      name: 'Labour Inspectorate',
      nameLocal: 'Arbeitsinspektorat',
      acronym: 'AI',
      website: 'https://www.arbeitsinspektion.gv.at',
      phone: '+43 1 71100 0',
      email: 'ai@bmaw.gv.at',
      description: 'Federal labour inspection authority under the Ministry of Labour',
    },
    secondaryAuthorities: [
      {
        name: 'Austrian Workers Compensation Board',
        nameLocal: 'Allgemeine Unfallversicherungsanstalt',
        acronym: 'AUVA',
        website: 'https://www.auva.at',
        phone: '+43 5 93 93',
        email: 'sicherheitsinformation@auva.at',
        description: 'Accident insurance and prevention services',
      },
      {
        name: 'Austrian Standards Institute',
        nameLocal: 'Austrian Standards',
        acronym: 'ASI',
        website: 'https://www.austrian-standards.at',
        phone: '+43 1 213 00',
        email: 'office@austrian-standards.at',
        description: 'Standards development and certification',
      },
      {
        name: 'Fire Protection Associations',
        nameLocal: 'Landesfeuerwehrverbände',
        acronym: 'LFV',
        website: 'https://www.bundesfeuerwehrverband.at',
        phone: '+43 1 531 26',
        email: 'office@bundesfeuerwehrverband.at',
        description: 'Fire safety inspection and certification (state-level)',
      },
      {
        name: 'Public Health Service',
        nameLocal: 'Öffentlicher Gesundheitsdienst',
        acronym: 'ÖGD',
        website: 'https://www.sozialministerium.at',
        phone: '+43 1 711 00',
        email: 'post@sozialministerium.at',
        description: 'Occupational health monitoring',
      },
    ],
    reportingObligations: [
      {
        type: 'Work Accidents',
        frequency: 'Within 5 days',
        deadline: 'Immediately for fatal or severe accidents',
        description: 'Report all accidents requiring medical treatment beyond first aid',
        authority: 'AI',
        onlineSubmission: true,
      },
      {
        type: 'Occupational Diseases',
        frequency: 'Upon suspicion',
        description: 'Doctors must report suspected occupational diseases',
        authority: 'AUVA',
        onlineSubmission: true,
      },
      {
        type: 'Safety and Health Protection Documentation',
        frequency: 'Continuous maintenance',
        description: 'Sicherheits- und Gesundheitsschutzdokumente must be current',
        authority: 'AI',
        onlineSubmission: false,
      },
      {
        type: 'Occupational Health Physician Appointments',
        frequency: 'Based on company size and risk',
        description: 'Document arbeitsmedizinische Betreuung arrangements',
        authority: 'AI',
        onlineSubmission: false,
      },
      {
        type: 'Fire Safety Plan',
        frequency: 'Annual review',
        description: 'Brandschutzplan and evacuation procedures',
        authority: 'Local Fire Department',
        onlineSubmission: false,
      },
    ],
    inspectionFrequency: 'Risk-based inspections: High-risk sites annually, others every 2-4 years based on sector',
    onlinePortal: {
      name: 'Arbeitsinspektion Online Services',
      url: 'https://www.arbeitsinspektion.gv.at/Service',
      description: 'Online accident reporting and compliance information portal',
    },
  },
];

/**
 * Helper function to get authorities data by country code
 */
export function getAuthoritiesByCountry(countryCode: string): CountryAuthorities | undefined {
  return authoritiesData.find(
    (country) => country.countryCode.toLowerCase() === countryCode.toLowerCase()
  );
}

/**
 * Helper function to get all supported country codes
 */
export function getSupportedCountries(): string[] {
  return authoritiesData.map((country) => country.countryCode);
}

/**
 * Helper function to get main authority for a country
 */
export function getMainAuthority(countryCode: string): Authority | undefined {
  const country = getAuthoritiesByCountry(countryCode);
  return country?.mainAuthority;
}

/**
 * Helper function to get all reporting obligations for a country
 */
export function getReportingObligations(countryCode: string): ReportingObligation[] {
  const country = getAuthoritiesByCountry(countryCode);
  return country?.reportingObligations || [];
}
