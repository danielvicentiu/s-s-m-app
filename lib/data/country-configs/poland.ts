/**
 * Poland (PL) Country Configuration
 * Occupational Safety and Health (BHP - Bezpieczeństwo i Higiena Pracy)
 * Fire Safety (Ochrona przeciwpożarowa)
 *
 * Main legislation: Kodeks pracy Art. 207-237
 * Authority: PIP (Państwowa Inspekcja Pracy)
 * Currency: PLN
 */

import { CountryCode, Currency, ObligationFrequency } from '@/lib/types'

export interface CountryConfig {
  countryCode: CountryCode
  currency: Currency
  legislation: LegislationReference[]
  trainingTypes: TrainingType[]
  medicalRequirements: MedicalRequirement[]
  holidays: PublicHoliday[]
  authority: AuthorityInfo
  penalties: PenaltyRange[]
  documentTemplates: DocumentTemplate[]
}

export interface LegislationReference {
  id: string
  title: string
  titleLocal: string
  number: string
  domain: 'ssm' | 'psi' | 'medical' | 'general'
  description: string
  url?: string
}

export interface TrainingType {
  id: string
  name: string
  nameLocal: string
  category: 'initial' | 'periodic' | 'special'
  duration: string
  frequency: ObligationFrequency
  validityYears?: number
  description: string
  legalBasis: string
}

export interface MedicalRequirement {
  id: string
  name: string
  nameLocal: string
  type: 'initial' | 'periodic' | 'control' | 'on_request'
  frequency: ObligationFrequency
  validityYears?: number
  riskFactors: string[]
  description: string
  legalBasis: string
}

export interface PublicHoliday {
  date: string // MM-DD format
  name: string
  nameLocal: string
  isFixed: boolean
}

export interface AuthorityInfo {
  name: string
  nameLocal: string
  acronym: string
  website: string
  phone: string
  email: string
  description: string
}

export interface PenaltyRange {
  violationType: string
  violationTypeLocal: string
  minAmount: number
  maxAmount: number
  description: string
  legalBasis: string
}

export interface DocumentTemplate {
  id: string
  name: string
  nameLocal: string
  type: 'medical' | 'training' | 'equipment' | 'report' | 'procedure'
  description: string
  requiredFields: string[]
}

export const polandConfig: CountryConfig = {
  countryCode: 'PL',
  currency: 'PLN',

  legislation: [
    {
      id: 'pl-kodeks-pracy',
      title: 'Labor Code',
      titleLocal: 'Kodeks pracy',
      number: 'Ustawa z dnia 26 czerwca 1974 r. (Dz.U. 2023 poz. 1465)',
      domain: 'general',
      description: 'The fundamental legal act regulating labor relations in Poland, including provisions on occupational safety and health (Articles 207-237), working time, leave, and employee rights.',
      url: 'https://isap.sejm.gov.pl'
    },
    {
      id: 'pl-rozp-bhp',
      title: 'General Regulation on Occupational Safety and Health',
      titleLocal: 'Rozporządzenie w sprawie ogólnych przepisów bezpieczeństwa i higieny pracy',
      number: 'Rozporządzenie z dnia 26 września 1997 r. (Dz.U. 2003 Nr 169 poz. 1650)',
      domain: 'ssm',
      description: 'General regulations on ensuring safety and hygiene at work, organization of workplaces, obligations of employers and workers.'
    },
    {
      id: 'pl-sluzba-bhp',
      title: 'Organization of Occupational Safety and Health Service',
      titleLocal: 'Rozporządzenie w sprawie służby bezpieczeństwa i higieny pracy',
      number: 'Rozporządzenie z dnia 2 września 1997 r. (Dz.U. 1997 Nr 109 poz. 704)',
      domain: 'ssm',
      description: 'Defines the organization of occupational safety and health services, required number of specialists, their qualifications, and areas of responsibility.'
    },
    {
      id: 'pl-szkolenia-bhp',
      title: 'Training in Occupational Safety and Health',
      titleLocal: 'Rozporządzenie w sprawie szkolenia w dziedzinie bezpieczeństwa i higieny pracy',
      number: 'Rozporządzenie z dnia 27 lipca 2004 r. (Dz.U. 2004 Nr 180 poz. 1860)',
      domain: 'ssm',
      description: 'Establishes mandatory types of BHP training (initial, periodic, for supervisors), forms, duration, and content.'
    },
    {
      id: 'pl-wypadki-przy-pracy',
      title: 'Procedure for Investigating Work Accidents',
      titleLocal: 'Rozporządzenie w sprawie ustalania okoliczności i przyczyn wypadków przy pracy',
      number: 'Rozporządzenie z dnia 1 lipca 2009 r. (Dz.U. 2009 Nr 105 poz. 870)',
      domain: 'ssm',
      description: 'Regulates the procedure for determining circumstances and causes of work accidents, notification obligations, investigation deadlines, and required documentation.'
    },
    {
      id: 'pl-badania-lekarskie',
      title: 'Preventive Medical Examinations of Workers',
      titleLocal: 'Rozporządzenie w sprawie profilaktycznych badań lekarskich pracowników',
      number: 'Rozporządzenie z dnia 10 grudnia 2021 r. (Dz.U. 2021 poz. 2314)',
      domain: 'medical',
      description: 'Establishes types of mandatory medical examinations (initial, periodic, control), frequency depending on risk factors, and categories of workers subject to these examinations.'
    },
    {
      id: 'pl-czynniki-szkodliwe',
      title: 'Maximum Permissible Values for Harmful Agents in Work Environment',
      titleLocal: 'Rozporządzenie w sprawie najwyższych dopuszczalnych stężeń i natężeń czynników szkodliwych dla zdrowia w środowisku pracy',
      number: 'Rozporządzenie z dnia 12 czerwca 2018 r. (Dz.U. 2021 poz. 325)',
      domain: 'ssm',
      description: 'Defines maximum permissible values (NDS, NDSCh) for concentrations of chemical substances, noise levels, vibrations, and other harmful factors in the work environment.'
    },
    {
      id: 'pl-ochrona-przeciwpozarowa',
      title: 'Fire Protection of Buildings and Other Structures',
      titleLocal: 'Rozporządzenie w sprawie ochrony przeciwpożarowej budynków, innych obiektów budowlanych i terenów',
      number: 'Rozporządzenie z dnia 7 czerwca 2010 r. (Dz.U. 2023 poz. 822)',
      domain: 'psi',
      description: 'Technical regulations on fire protection: evacuation routes, alarm systems, firefighting equipment, employee training, and evacuation plans.'
    },
    {
      id: 'pl-prace-niebezpieczne',
      title: 'List of Particularly Hazardous Works',
      titleLocal: 'Rozporządzenie w sprawie wykazu prac szczególnie niebezpiecznych',
      number: 'Rozporządzenie z dnia 26 września 1997 r. (Dz.U. 2003 Nr 193 poz. 1881)',
      domain: 'ssm',
      description: 'List of particularly hazardous works requiring special authorization procedures, continuous supervision, and additional protective measures (work at height, in confined spaces, with toxic substances, etc.).'
    },
    {
      id: 'pl-srodki-ochrony-indywidualnej',
      title: 'Personal Protective Equipment',
      titleLocal: 'Rozporządzenie w sprawie minimalnych wymagań dotyczących środków ochrony indywidualnej',
      number: 'Rozporządzenie z dnia 20 grudnia 2022 r. (Dz.U. 2023 poz. 19)',
      domain: 'ssm',
      description: 'Minimum requirements for provision, use, and maintenance of personal protective equipment (PPE), and employer obligations to provide adequate PPE for identified risks.'
    }
  ],

  trainingTypes: [
    {
      id: 'pl-szkolenie-wstepne',
      name: 'Initial BHP Training',
      nameLocal: 'Szkolenie wstępne BHP',
      category: 'initial',
      duration: 'Minimum 3 hours (office work) or 6 hours (production work)',
      frequency: 'once',
      description: 'Mandatory training before starting work, covering general safety rules, workplace hazards, emergency procedures, and worker rights and obligations.',
      legalBasis: 'Rozporządzenie z dnia 27 lipca 2004 r. (Dz.U. 2004 Nr 180 poz. 1860)'
    },
    {
      id: 'pl-szkolenie-okresowe-pracownicy',
      name: 'Periodic BHP Training for Employees',
      nameLocal: 'Szkolenie okresowe BHP dla pracowników',
      category: 'periodic',
      duration: '8 hours (office work) or 16 hours (production work)',
      frequency: 'annual',
      validityYears: 1,
      description: 'Refresher training for employees, conducted at least once a year for production work or once every 3 years for office work.',
      legalBasis: 'Rozporządzenie z dnia 27 lipca 2004 r. (Dz.U. 2004 Nr 180 poz. 1860)'
    },
    {
      id: 'pl-szkolenie-okresowe-kadra',
      name: 'Periodic BHP Training for Supervisors',
      nameLocal: 'Szkolenie okresowe BHP dla kadry kierowniczej',
      category: 'periodic',
      duration: '16 hours',
      frequency: 'annual',
      validityYears: 1,
      description: 'Specialized training for supervisors and managers, covering risk assessment, accident investigation, legal responsibilities, and management of workplace safety.',
      legalBasis: 'Rozporządzenie z dnia 27 lipca 2004 r. (Dz.U. 2004 Nr 180 poz. 1860)'
    },
    {
      id: 'pl-szkolenie-ppoż',
      name: 'Fire Safety Training',
      nameLocal: 'Szkolenie przeciwpożarowe',
      category: 'periodic',
      duration: 'Minimum 4 hours',
      frequency: 'annual',
      validityYears: 1,
      description: 'Training on fire prevention, use of firefighting equipment, evacuation procedures, and emergency response.',
      legalBasis: 'Rozporządzenie z dnia 7 czerwca 2010 r. (Dz.U. 2023 poz. 822)'
    },
    {
      id: 'pl-szkolenie-pierwsza-pomoc',
      name: 'First Aid Training',
      nameLocal: 'Szkolenie z zakresu pierwszej pomocy',
      category: 'special',
      duration: '16 hours',
      frequency: 'biannual',
      validityYears: 2,
      description: 'Training in basic first aid procedures, CPR, wound care, and emergency medical response.',
      legalBasis: 'Rozporządzenie w sprawie ogólnych przepisów BHP (Art. 209)'
    },
    {
      id: 'pl-szkolenie-prace-wysokosci',
      name: 'Work at Height Training',
      nameLocal: 'Szkolenie w zakresie prac na wysokości',
      category: 'special',
      duration: '16-24 hours',
      frequency: 'annual',
      validityYears: 1,
      description: 'Specialized training for employees performing work at height above 1 meter, covering fall protection systems, equipment inspection, and rescue procedures.',
      legalBasis: 'Rozporządzenie w sprawie wykazu prac szczególnie niebezpiecznych'
    }
  ],

  medicalRequirements: [
    {
      id: 'pl-badanie-wstepne',
      name: 'Initial Medical Examination',
      nameLocal: 'Badanie lekarskie wstępne',
      type: 'initial',
      frequency: 'once',
      riskFactors: ['all'],
      description: 'Mandatory medical examination before starting work to determine if the employee is fit for the position.',
      legalBasis: 'Rozporządzenie z dnia 10 grudnia 2021 r. (Dz.U. 2021 poz. 2314)'
    },
    {
      id: 'pl-badanie-okresowe-standard',
      name: 'Periodic Medical Examination - Standard',
      nameLocal: 'Badanie lekarskie okresowe',
      type: 'periodic',
      frequency: 'annual',
      validityYears: 1,
      riskFactors: ['physical_load', 'repetitive_work', 'shift_work'],
      description: 'Regular medical examination to monitor employee health and fitness for work. Frequency depends on risk factors and employee age.',
      legalBasis: 'Rozporządzenie z dnia 10 grudnia 2021 r. (Dz.U. 2021 poz. 2314)'
    },
    {
      id: 'pl-badanie-okresowe-extended',
      name: 'Periodic Medical Examination - Extended',
      nameLocal: 'Badanie lekarskie okresowe z rozszerzonymi badaniami',
      type: 'periodic',
      frequency: 'annual',
      validityYears: 1,
      riskFactors: ['chemical_hazards', 'biological_hazards', 'noise', 'vibration', 'dust', 'radiation'],
      description: 'Extended medical examination for employees exposed to significant occupational hazards, including specialized tests and assessments.',
      legalBasis: 'Rozporządzenie z dnia 10 grudnia 2021 r. (Dz.U. 2021 poz. 2314)'
    },
    {
      id: 'pl-badanie-kontrolne',
      name: 'Control Medical Examination',
      nameLocal: 'Badanie lekarskie kontrolne',
      type: 'control',
      frequency: 'on_demand',
      riskFactors: ['all'],
      description: 'Medical examination conducted after sick leave exceeding 30 days or at employer/employee request to verify fitness for work.',
      legalBasis: 'Rozporządzenie z dnia 10 grudnia 2021 r. (Dz.U. 2021 poz. 2314)'
    },
    {
      id: 'pl-badanie-na-wniosek',
      name: 'Medical Examination on Request',
      nameLocal: 'Badanie lekarskie na wniosek pracownika',
      type: 'on_request',
      frequency: 'on_demand',
      riskFactors: ['all'],
      description: 'Medical examination requested by the employee when they feel their health condition may affect their ability to safely perform work.',
      legalBasis: 'Kodeks pracy Art. 229 § 4'
    }
  ],

  holidays: [
    {
      date: '01-01',
      name: 'New Year\'s Day',
      nameLocal: 'Nowy Rok',
      isFixed: true
    },
    {
      date: '01-06',
      name: 'Epiphany',
      nameLocal: 'Święto Trzech Króli',
      isFixed: true
    },
    {
      date: '04-20',
      name: 'Easter Sunday',
      nameLocal: 'Niedziela Wielkanocna',
      isFixed: false
    },
    {
      date: '04-21',
      name: 'Easter Monday',
      nameLocal: 'Poniedziałek Wielkanocny',
      isFixed: false
    },
    {
      date: '05-01',
      name: 'Labour Day',
      nameLocal: 'Święto Pracy',
      isFixed: true
    },
    {
      date: '05-03',
      name: 'Constitution Day',
      nameLocal: 'Święto Konstytucji 3 Maja',
      isFixed: true
    },
    {
      date: '06-08',
      name: 'Corpus Christi',
      nameLocal: 'Boże Ciało',
      isFixed: false
    },
    {
      date: '08-15',
      name: 'Assumption of Mary',
      nameLocal: 'Wniebowzięcie Najświętszej Maryi Panny',
      isFixed: true
    },
    {
      date: '11-01',
      name: 'All Saints\' Day',
      nameLocal: 'Wszystkich Świętych',
      isFixed: true
    },
    {
      date: '11-11',
      name: 'Independence Day',
      nameLocal: 'Narodowe Święto Niepodległości',
      isFixed: true
    },
    {
      date: '12-25',
      name: 'Christmas Day',
      nameLocal: 'Boże Narodzenie (pierwszy dzień)',
      isFixed: true
    },
    {
      date: '12-26',
      name: 'Second Day of Christmas',
      nameLocal: 'Boże Narodzenie (drugi dzień)',
      isFixed: true
    }
  ],

  authority: {
    name: 'National Labour Inspectorate',
    nameLocal: 'Państwowa Inspekcja Pracy',
    acronym: 'PIP',
    website: 'https://www.pip.gov.pl',
    phone: '+48 22 661 63 00',
    email: 'kancelaria@gip.pip.gov.pl',
    description: 'The National Labour Inspectorate (PIP) is a government agency responsible for supervising and controlling compliance with labor law, including occupational safety and health regulations, in Poland.'
  },

  penalties: [
    {
      violationType: 'Failure to organize occupational safety and health service',
      violationTypeLocal: 'Brak organizacji służby BHP',
      minAmount: 1000,
      maxAmount: 30000,
      description: 'Employer fails to establish required occupational safety service or appoint qualified BHP specialist.',
      legalBasis: 'Kodeks pracy Art. 283 § 1'
    },
    {
      violationType: 'Failure to conduct mandatory BHP training',
      violationTypeLocal: 'Brak przeprowadzenia obowiązkowych szkoleń BHP',
      minAmount: 1000,
      maxAmount: 30000,
      description: 'Employer allows employees to work without completing required initial or periodic BHP training.',
      legalBasis: 'Kodeks pracy Art. 283 § 1'
    },
    {
      violationType: 'Failure to conduct mandatory medical examinations',
      violationTypeLocal: 'Brak przeprowadzenia obowiązkowych badań lekarskich',
      minAmount: 1000,
      maxAmount: 30000,
      description: 'Employer allows employees to work without valid medical examination certificates.',
      legalBasis: 'Kodeks pracy Art. 283 § 1'
    },
    {
      violationType: 'Failure to provide personal protective equipment',
      violationTypeLocal: 'Brak zapewnienia środków ochrony indywidualnej',
      minAmount: 1000,
      maxAmount: 30000,
      description: 'Employer fails to provide required personal protective equipment or ensures inadequate equipment.',
      legalBasis: 'Kodeks pracy Art. 283 § 1'
    },
    {
      violationType: 'Failure to conduct risk assessment',
      violationTypeLocal: 'Brak oceny ryzyka zawodowego',
      minAmount: 1000,
      maxAmount: 30000,
      description: 'Employer fails to conduct mandatory occupational risk assessment for workplaces.',
      legalBasis: 'Kodeks pracy Art. 283 § 1'
    },
    {
      violationType: 'Improper workplace conditions causing health hazards',
      violationTypeLocal: 'Niewłaściwe warunki pracy stanowiące zagrożenie dla zdrowia',
      minAmount: 2000,
      maxAmount: 40000,
      description: 'Employer maintains workplace conditions that exceed permissible exposure limits or pose serious health risks.',
      legalBasis: 'Kodeks pracy Art. 283 § 1'
    },
    {
      violationType: 'Failure to report work accidents',
      violationTypeLocal: 'Nieprawidłowe postępowanie powypadkowe',
      minAmount: 1000,
      maxAmount: 30000,
      description: 'Employer fails to properly investigate, document, or report work accidents to authorities.',
      legalBasis: 'Kodeks pracy Art. 283 § 1'
    },
    {
      violationType: 'Allowing work in particularly hazardous conditions without authorization',
      violationTypeLocal: 'Dopuszczenie do prac szczególnie niebezpiecznych bez uprawnień',
      minAmount: 2000,
      maxAmount: 40000,
      description: 'Employer allows employees to perform particularly hazardous work without required qualifications, training, or supervision.',
      legalBasis: 'Kodeks pracy Art. 283 § 2'
    },
    {
      violationType: 'Lack of fire safety measures',
      violationTypeLocal: 'Brak zabezpieczeń przeciwpożarowych',
      minAmount: 1500,
      maxAmount: 35000,
      description: 'Employer fails to provide adequate fire safety equipment, evacuation routes, or fire safety training.',
      legalBasis: 'Ustawa o ochronie przeciwpożarowej'
    },
    {
      violationType: 'Violation causing serious injury or death',
      violationTypeLocal: 'Naruszenie przepisów powodujące ciężki uszczerbek na zdrowiu lub śmierć',
      minAmount: 5000,
      maxAmount: 100000,
      description: 'Violations of occupational safety regulations that directly result in serious injury or death of an employee.',
      legalBasis: 'Kodeks pracy Art. 283 § 3'
    }
  ],

  documentTemplates: [
    {
      id: 'pl-karta-badań-lekarskich',
      name: 'Medical Examination Card',
      nameLocal: 'Karta badań lekarskich pracownika',
      type: 'medical',
      description: 'Document recording medical examinations conducted for an employee, including examination dates, results, restrictions, and validity periods.',
      requiredFields: ['employee_name', 'cnp', 'job_title', 'examination_type', 'examination_date', 'expiry_date', 'result', 'doctor_name', 'clinic_name']
    },
    {
      id: 'pl-zaświadczenie-lekarskie',
      name: 'Medical Certificate',
      nameLocal: 'Zaświadczenie lekarskie o braku przeciwwskazań do pracy',
      type: 'medical',
      description: 'Official medical certificate stating that the employee has no contraindications to perform specific work.',
      requiredFields: ['employee_name', 'cnp', 'job_title', 'examination_date', 'result', 'restrictions', 'doctor_name', 'doctor_stamp']
    },
    {
      id: 'pl-karta-szkolenia-bhp',
      name: 'BHP Training Card',
      nameLocal: 'Karta szkolenia BHP',
      type: 'training',
      description: 'Document recording BHP training conducted for an employee, including training type, date, duration, trainer, and test results.',
      requiredFields: ['employee_name', 'training_type', 'training_date', 'duration', 'trainer_name', 'test_result', 'expiry_date']
    },
    {
      id: 'pl-protokol-instruktazu',
      name: 'Training Protocol',
      nameLocal: 'Protokół instruktażu stanowiskowego',
      type: 'training',
      description: 'Protocol documenting workplace instruction and initial BHP training for a specific position.',
      requiredFields: ['employee_name', 'job_title', 'instruction_date', 'instructor_name', 'topics_covered', 'employee_signature', 'instructor_signature']
    },
    {
      id: 'pl-karta-ewidencyjna-soi',
      name: 'PPE Inventory Card',
      nameLocal: 'Karta ewidencyjna środków ochrony indywidualnej',
      type: 'equipment',
      description: 'Inventory card tracking personal protective equipment issued to employees.',
      requiredFields: ['employee_name', 'equipment_type', 'issue_date', 'quantity', 'standard', 'replacement_date', 'employee_signature']
    },
    {
      id: 'pl-karta-wyposazenia-ppoż',
      name: 'Fire Safety Equipment Card',
      nameLocal: 'Karta wyposażenia przeciwpożarowego',
      type: 'equipment',
      description: 'Card recording fire safety equipment, including fire extinguishers, hydrants, and emergency lighting.',
      requiredFields: ['equipment_type', 'location', 'serial_number', 'inspection_date', 'expiry_date', 'inspector_name', 'is_compliant']
    },
    {
      id: 'pl-ocena-ryzyka',
      name: 'Occupational Risk Assessment',
      nameLocal: 'Ocena ryzyka zawodowego',
      type: 'report',
      description: 'Comprehensive risk assessment document identifying hazards, evaluating risks, and defining protective measures.',
      requiredFields: ['workplace', 'job_title', 'identified_hazards', 'risk_level', 'protective_measures', 'assessor_name', 'assessment_date']
    },
    {
      id: 'pl-protokol-wypadku',
      name: 'Work Accident Protocol',
      nameLocal: 'Protokół powypadkowy',
      type: 'report',
      description: 'Official protocol documenting work accident investigation, circumstances, causes, and preventive measures.',
      requiredFields: ['employee_name', 'accident_date', 'location', 'circumstances', 'causes', 'witnesses', 'injuries', 'preventive_measures', 'inspector_signature']
    },
    {
      id: 'pl-instrukcja-bhp',
      name: 'BHP Instruction',
      nameLocal: 'Instrukcja BHP na stanowisku pracy',
      type: 'procedure',
      description: 'Detailed BHP instruction for a specific workplace or job position, outlining safety procedures and requirements.',
      requiredFields: ['job_title', 'workplace', 'hazards', 'safety_rules', 'ppe_required', 'emergency_procedures', 'issue_date']
    },
    {
      id: 'pl-plan-ewakuacji',
      name: 'Evacuation Plan',
      nameLocal: 'Plan ewakuacji',
      type: 'procedure',
      description: 'Evacuation plan showing escape routes, assembly points, and emergency procedures.',
      requiredFields: ['building_name', 'floor_plan', 'escape_routes', 'assembly_point', 'emergency_contacts', 'fire_equipment_locations']
    }
  ]
}

export default polandConfig
