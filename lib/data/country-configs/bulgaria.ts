/**
 * Bulgaria Country Configuration
 * SSM (Occupational Safety and Health) and PSI (Fire Safety) compliance
 * Language: Bulgarian (bg)
 * Currency: BGN (Bulgarian Lev)
 * Authority: IA GIT (Изпълнителна агенция „Главна инспекция по труда")
 */

import type { CountryCode, Currency, ObligationFrequency, NotificationChannel } from '../../types'

export interface BulgariaConfig {
  countryCode: CountryCode
  countryName: string
  countryNameBG: string
  language: string
  currency: Currency

  // Legislative framework
  legislation: LegislationReference[]

  // Training types specific to Bulgaria
  trainingTypes: TrainingType[]

  // Medical examination requirements
  medicalExamRequirements: MedicalExamRequirement[]

  // Public holidays
  publicHolidays: PublicHoliday[]

  // Authorities
  authorities: Authority[]

  // Penalty ranges
  penaltyRanges: PenaltyRange[]

  // Document templates
  documentTemplates: DocumentTemplate[]

  // Notification settings
  notificationSettings: NotificationSettings
}

export interface LegislationReference {
  id: string
  title: string
  titleBG: string
  number: string
  domain: 'ssm' | 'psi' | 'medical' | 'general'
  description: string
  descriptionBG: string
  effectiveDate: string | null
  sourceUrl: string | null
}

export interface TrainingType {
  id: string
  name: string
  nameBG: string
  description: string
  descriptionBG: string
  frequency: ObligationFrequency
  durationHours: number
  requiredFor: string[]
  legalBasis: string
  certificateValidityMonths: number | null
}

export interface MedicalExamRequirement {
  id: string
  name: string
  nameBG: string
  jobCategories: string[]
  frequency: ObligationFrequency
  frequencyMonths: number | null
  riskFactors: string[]
  legalBasis: string
  description: string
  descriptionBG: string
}

export interface PublicHoliday {
  id: string
  name: string
  nameBG: string
  date: string // MM-DD format
  isFixedDate: boolean
}

export interface Authority {
  id: string
  name: string
  nameBG: string
  abbreviation: string
  domain: 'ssm' | 'psi' | 'medical' | 'labor' | 'general'
  contactEmail: string | null
  contactPhone: string | null
  website: string | null
  description: string
  descriptionBG: string
}

export interface PenaltyRange {
  id: string
  violationType: string
  violationTypeBG: string
  minAmount: number
  maxAmount: number
  currency: Currency
  appliesTo: 'individual' | 'company' | 'both'
  legalBasis: string
  description: string
  descriptionBG: string
}

export interface DocumentTemplate {
  id: string
  name: string
  nameBG: string
  type: 'medical_record' | 'equipment_inspection' | 'training_certificate' | 'compliance_report' | 'other'
  description: string
  descriptionBG: string
  requiredFields: string[]
  legalBasis: string
}

export interface NotificationSettings {
  defaultChannels: NotificationChannel[]
  warningDaysBefore: number[]
  criticalDaysBefore: number[]
  workingHoursStart: string // HH:MM format
  workingHoursEnd: string // HH:MM format
  timezone: string
}

// ─────────────────────────────────────────────────────────────────────────────
// BULGARIA CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export const bulgariaConfig: BulgariaConfig = {
  countryCode: 'BG',
  countryName: 'Bulgaria',
  countryNameBG: 'България',
  language: 'bg',
  currency: 'BGN',

  // ─── LEGISLATIVE FRAMEWORK ───
  legislation: [
    {
      id: 'bg-zzbbut',
      title: 'Law on Health and Safety at Work',
      titleBG: 'Закон за здравословни и безопасни условия на труд (ЗЗБУТ)',
      number: 'ДВ бр. 124/1997',
      domain: 'ssm',
      description: 'Main legislative act regulating occupational safety and health in Bulgaria, establishing employer obligations, employee rights, and supervision mechanisms.',
      descriptionBG: 'Основен законодателен акт, регламентиращ здравословните и безопасни условия на труд в България, определящ задълженията на работодателя, правата на работниците и механизмите за контрол.',
      effectiveDate: '1997-12-23',
      sourceUrl: 'https://lex.bg/laws/ldoc/2134673409'
    },
    {
      id: 'bg-naredba-7',
      title: 'Ordinance No. 7 on Minimum Health and Safety Requirements at Workplaces',
      titleBG: 'Наредба № 7 за минималните изисквания за здравословни и безопасни условия на труд на работните места',
      number: 'ДВ бр. 81/1999',
      domain: 'ssm',
      description: 'Establishes minimum requirements for workplace safety, including workspace dimensions, lighting, ventilation, temperature, and emergency exits.',
      descriptionBG: 'Установява минималните изисквания за безопасност на работните места, включително размери на работното пространство, осветление, вентилация, температура и аварийни изходи.',
      effectiveDate: '1999-09-10',
      sourceUrl: 'https://lex.bg/bg/laws/ldoc/2134673409'
    },
    {
      id: 'bg-naredba-5',
      title: 'Ordinance No. 5 on Occupational Health Services',
      titleBG: 'Наредба № 5 за служба по трудова медицина',
      number: 'ДВ бр. 35/1987',
      domain: 'medical',
      description: 'Regulates occupational health services, mandatory medical examinations, periodic check-ups, and health surveillance of workers exposed to occupational hazards.',
      descriptionBG: 'Регламентира служба по трудова медицина, задължителни медицински прегледи, периодични изследвания и здравно наблюдение на работници, изложени на професионални рискове.',
      effectiveDate: '1987-05-05',
      sourceUrl: null
    },
    {
      id: 'bg-naredba-1',
      title: 'Ordinance No. 1 on Safety and Health Training',
      titleBG: 'Наредба № 1 за обучението по безопасност и здраве при работа',
      number: 'ДВ бр. 38/1999',
      domain: 'ssm',
      description: 'Defines mandatory safety and health training programs, including initial training, periodic refresher training, and training for specific hazards.',
      descriptionBG: 'Определя задължителните програми за обучение по безопасност и здраве, включително първоначално обучение, периодично обновяване и обучение за специфични рискове.',
      effectiveDate: '1999-05-07',
      sourceUrl: null
    },
    {
      id: 'bg-zpb',
      title: 'Law on Fire Safety',
      titleBG: 'Закон за защита при бедствия (ЗЗБ)',
      number: 'ДВ бр. 102/2006',
      domain: 'psi',
      description: 'Regulates fire safety and disaster protection, including fire prevention measures, fire-fighting equipment, evacuation procedures, and fire safety inspections.',
      descriptionBG: 'Регламентира пожарната безопасност и защитата при бедствия, включително мерки за предотвратяване на пожари, противопожарно оборудване, процедури за евакуация и пожарни проверки.',
      effectiveDate: '2006-12-19',
      sourceUrl: 'https://lex.bg/laws/ldoc/2135540690'
    },
    {
      id: 'bg-naredba-pожарна-bezopasnost',
      title: 'Ordinance on Fire Safety Rules',
      titleBG: 'Наредба за правилата за пожарна безопасност',
      number: 'ДВ бр. 35/2017',
      domain: 'psi',
      description: 'Technical regulations on fire safety requirements for buildings, fire extinguishing equipment maintenance, alarm systems, and employee fire safety training.',
      descriptionBG: 'Технически разпоредби относно изискванията за пожарна безопасност на сгради, поддръжка на противопожарно оборудване, системи за аларма и обучение на служителите по пожарна безопасност.',
      effectiveDate: '2017-05-05',
      sourceUrl: null
    },
    {
      id: 'bg-kodeks-na-truda',
      title: 'Labor Code',
      titleBG: 'Кодекс на труда (КТ)',
      number: 'ДВ бр. 26/1986',
      domain: 'general',
      description: 'Main labor law regulating employment relationships, working time, rest periods, annual leave, occupational safety obligations, and labor inspections.',
      descriptionBG: 'Основен трудов закон, регламентиращ трудовите отношения, работно време, почивки, годишен отпуск, задължения за безопасност на труда и трудови инспекции.',
      effectiveDate: '1986-04-01',
      sourceUrl: 'https://lex.bg/laws/ldoc/1594373121'
    },
    {
      id: 'bg-naredba-eip',
      title: 'Ordinance on Personal Protective Equipment',
      titleBG: 'Наредба за личните предпазни средства (ЛПС)',
      number: 'ДВ бр. 53/2001',
      domain: 'ssm',
      description: 'Requirements for provision, use, and maintenance of personal protective equipment (PPE), employer obligations to provide suitable PPE based on risk assessment.',
      descriptionBG: 'Изисквания за предоставяне, използване и поддръжка на лични предпазни средства (ЛПС), задължения на работодателя да осигури подходящи ЛПС въз основа на оценка на риска.',
      effectiveDate: '2001-06-26',
      sourceUrl: null
    }
  ],

  // ─── TRAINING TYPES ───
  trainingTypes: [
    {
      id: 'bg-training-initial',
      name: 'Initial Safety and Health Training',
      nameBG: 'Първоначално обучение по безопасност и здраве',
      description: 'Mandatory initial training for all new employees before starting work, covering general workplace safety, emergency procedures, and job-specific hazards.',
      descriptionBG: 'Задължително първоначално обучение за всички нови служители преди започване на работа, обхващащо обща безопасност на работното място, процедури при извънредни ситуации и специфични за работата рискове.',
      frequency: 'once',
      durationHours: 8,
      requiredFor: ['all_employees'],
      legalBasis: 'Наредба № 1/1999, чл. 5',
      certificateValidityMonths: null
    },
    {
      id: 'bg-training-periodic',
      name: 'Periodic Refresher Training',
      nameBG: 'Периодично обучение',
      description: 'Periodic refresher training required every 2 years for all employees to update knowledge on safety procedures, new regulations, and workplace changes.',
      descriptionBG: 'Периодично обучение, необходимо на всеки 2 години за всички служители, за актуализиране на знанията относно процедурите за безопасност, новите разпоредби и промените на работното място.',
      frequency: 'biannual',
      durationHours: 4,
      requiredFor: ['all_employees'],
      legalBasis: 'Наредба № 1/1999, чл. 6',
      certificateValidityMonths: 24
    },
    {
      id: 'bg-training-fire-safety',
      name: 'Fire Safety Training',
      nameBG: 'Обучение по пожарна безопасност',
      description: 'Annual fire safety training covering fire prevention, evacuation procedures, use of fire extinguishers, and emergency response protocols.',
      descriptionBG: 'Годишно обучение по пожарна безопасност, обхващащо превенция на пожари, процедури за евакуация, използване на пожарогасители и протоколи за реагиране при извънредни ситуации.',
      frequency: 'annual',
      durationHours: 3,
      requiredFor: ['all_employees', 'fire_safety_officers'],
      legalBasis: 'Наредба за правилата за пожарна безопасност, чл. 12',
      certificateValidityMonths: 12
    },
    {
      id: 'bg-training-hazardous-work',
      name: 'Hazardous Work Training',
      nameBG: 'Обучение за опасни дейности',
      description: 'Specialized training for employees performing hazardous work (working at heights, with hazardous substances, machinery operation, electrical work, etc.).',
      descriptionBG: 'Специализирано обучение за служители, изпълняващи опасни дейности (работа на височина, с опасни вещества, управление на машини, електрически работи и др.).',
      frequency: 'annual',
      durationHours: 16,
      requiredFor: ['hazardous_work_employees'],
      legalBasis: 'ЗЗБУТ, чл. 22; Наредба № 1/1999',
      certificateValidityMonths: 12
    },
    {
      id: 'bg-training-first-aid',
      name: 'First Aid Training',
      nameBG: 'Обучение по първа помощ',
      description: 'First aid training for designated first-aiders, covering basic emergency medical response, CPR, wound treatment, and emergency care.',
      descriptionBG: 'Обучение по първа помощ за определени служители, обхващащо основно спешно медицинско реагиране, КПР, лечение на рани и спешна помощ.',
      frequency: 'biannual',
      durationHours: 16,
      requiredFor: ['first_aiders'],
      legalBasis: 'Наредба № 7/1999, чл. 18',
      certificateValidityMonths: 24
    },
    {
      id: 'bg-training-manager',
      name: 'Manager and Supervisor Safety Training',
      nameBG: 'Обучение за ръководители и надзорници',
      description: 'Specialized training for managers and supervisors on their legal responsibilities, risk assessment, accident investigation, and safety management systems.',
      descriptionBG: 'Специализирано обучение за мениджъри и надзорници относно техните правни отговорности, оценка на риска, разследване на инциденти и системи за управление на безопасността.',
      frequency: 'biannual',
      durationHours: 12,
      requiredFor: ['managers', 'supervisors'],
      legalBasis: 'ЗЗБУТ, чл. 23; Наредба № 1/1999, чл. 8',
      certificateValidityMonths: 24
    }
  ],

  // ─── MEDICAL EXAMINATION REQUIREMENTS ───
  medicalExamRequirements: [
    {
      id: 'bg-medical-pre-employment',
      name: 'Pre-employment Medical Examination',
      nameBG: 'Предварителен медицински преглед',
      jobCategories: ['all'],
      frequency: 'once',
      frequencyMonths: null,
      riskFactors: [],
      legalBasis: 'Наредба № 5/1987, чл. 3',
      description: 'Mandatory medical examination before starting employment to assess fitness for the specific job and detect any contraindications.',
      descriptionBG: 'Задължителен медицински преглед преди започване на работа за оценка на годността за конкретната работа и откриване на противопоказания.'
    },
    {
      id: 'bg-medical-periodic-normal',
      name: 'Periodic Medical Examination (Normal Conditions)',
      nameBG: 'Периодичен медицински преглед (нормални условия)',
      jobCategories: ['office_workers', 'administrative_staff'],
      frequency: 'annual',
      frequencyMonths: 36,
      riskFactors: ['none'],
      legalBasis: 'Наредба № 5/1987, чл. 4',
      description: 'Periodic medical examination every 3 years for employees working under normal conditions without exposure to occupational hazards.',
      descriptionBG: 'Периодичен медицински преглед на всеки 3 години за служители, работещи при нормални условия, без излагане на професионални рискове.'
    },
    {
      id: 'bg-medical-periodic-hazardous',
      name: 'Periodic Medical Examination (Hazardous Conditions)',
      nameBG: 'Периодичен медицински преглед (опасни условия)',
      jobCategories: ['industrial_workers', 'construction_workers', 'chemical_workers', 'drivers'],
      frequency: 'annual',
      frequencyMonths: 12,
      riskFactors: ['chemical_exposure', 'noise', 'vibration', 'dust', 'radiation', 'biological_agents', 'heavy_lifting'],
      legalBasis: 'Наредба № 5/1987, чл. 4',
      description: 'Annual medical examination for employees exposed to occupational hazards such as chemicals, noise, vibration, dust, or physical strain.',
      descriptionBG: 'Годишен медицински преглед за служители, изложени на професионални рискове като химикали, шум, вибрации, прах или физическо натоварване.'
    },
    {
      id: 'bg-medical-periodic-high-risk',
      name: 'Periodic Medical Examination (High Risk)',
      nameBG: 'Периодичен медицински преглед (висок риск)',
      jobCategories: ['mining_workers', 'asbestos_workers', 'radiation_workers', 'toxic_substance_workers'],
      frequency: 'biannual',
      frequencyMonths: 6,
      riskFactors: ['high_toxicity', 'carcinogens', 'ionizing_radiation', 'extreme_temperatures'],
      legalBasis: 'Наредба № 5/1987, чл. 4',
      description: 'Medical examination every 6 months for employees exposed to high-risk factors such as carcinogens, ionizing radiation, or extreme working conditions.',
      descriptionBG: 'Медицински преглед на всеки 6 месеца за служители, изложени на високорискови фактори като канцерогени, йонизиращо лъчение или екстремни работни условия.'
    },
    {
      id: 'bg-medical-special',
      name: 'Special Medical Examination',
      nameBG: 'Извънреден медицински преглед',
      jobCategories: ['all'],
      frequency: 'on_demand',
      frequencyMonths: null,
      riskFactors: ['illness', 'accident', 'exposure_incident'],
      legalBasis: 'Наредба № 5/1987, чл. 5',
      description: 'Medical examination required after illness, workplace accident, exposure incident, or upon employee request to verify fitness to return to work.',
      descriptionBG: 'Медицински преглед, необходим след болест, трудова злополука, инцидент с излагане или при искане на служителя за проверка на годността за връщане на работа.'
    }
  ],

  // ─── PUBLIC HOLIDAYS ───
  publicHolidays: [
    {
      id: 'bg-new-year',
      name: 'New Year\'s Day',
      nameBG: 'Нова година',
      date: '01-01',
      isFixedDate: true
    },
    {
      id: 'bg-liberation-day',
      name: 'Liberation Day',
      nameBG: 'Ден на Освобождението на България',
      date: '03-03',
      isFixedDate: true
    },
    {
      id: 'bg-labor-day',
      name: 'Labor Day',
      nameBG: 'Ден на труда',
      date: '05-01',
      isFixedDate: true
    },
    {
      id: 'bg-st-georges-day',
      name: 'St. George\'s Day (Bulgarian Army Day)',
      nameBG: 'Гергьовден (Ден на храбростта)',
      date: '05-06',
      isFixedDate: true
    },
    {
      id: 'bg-education-culture-day',
      name: 'Bulgarian Education and Culture Day',
      nameBG: 'Ден на българската просвета и култура',
      date: '05-24',
      isFixedDate: true
    },
    {
      id: 'bg-unification-day',
      name: 'Unification Day',
      nameBG: 'Ден на Съединението',
      date: '09-06',
      isFixedDate: true
    },
    {
      id: 'bg-independence-day',
      name: 'Independence Day',
      nameBG: 'Ден на независимостта',
      date: '09-22',
      isFixedDate: true
    },
    {
      id: 'bg-national-awakening-day',
      name: 'National Awakening Day',
      nameBG: 'Ден на народните будители',
      date: '11-01',
      isFixedDate: true
    },
    {
      id: 'bg-christmas-eve',
      name: 'Christmas Eve',
      nameBG: 'Бъдни вечер',
      date: '12-24',
      isFixedDate: true
    },
    {
      id: 'bg-christmas',
      name: 'Christmas Day',
      nameBG: 'Коледа (Рождество Христово)',
      date: '12-25',
      isFixedDate: true
    },
    {
      id: 'bg-christmas-second-day',
      name: 'Second Day of Christmas',
      nameBG: 'Втори ден на Коледа',
      date: '12-26',
      isFixedDate: true
    },
    {
      id: 'bg-easter',
      name: 'Easter (Orthodox)',
      nameBG: 'Великден (Възкресение Христово)',
      date: 'easter',
      isFixedDate: false
    },
    {
      id: 'bg-easter-monday',
      name: 'Easter Monday',
      nameBG: 'Велики понеделник',
      date: 'easter+1',
      isFixedDate: false
    }
  ],

  // ─── AUTHORITIES ───
  authorities: [
    {
      id: 'bg-ia-git',
      name: 'Executive Agency "General Labor Inspectorate"',
      nameBG: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
      abbreviation: 'IA GIT',
      domain: 'ssm',
      contactEmail: 'git@gli.government.bg',
      contactPhone: '+359 2 8859 595',
      website: 'https://www.gli.government.bg',
      description: 'Main state authority responsible for labor inspection, enforcement of occupational safety and health regulations, investigation of workplace accidents, and imposing penalties for violations.',
      descriptionBG: 'Основен държавен орган, отговорен за трудовата инспекция, прилагане на разпоредбите за безопасност и здраве при работа, разследване на трудови злополуки и налагане на санкции за нарушения.'
    },
    {
      id: 'bg-gd-pbs',
      name: 'General Directorate "Fire Safety and Civil Protection"',
      nameBG: 'Главна дирекция „Пожарна безопасност и защита на населението" (ГД ПБЗН)',
      abbreviation: 'GD PBZN',
      domain: 'psi',
      contactEmail: 'info@fire.bg',
      contactPhone: '+359 2 982 2222',
      website: 'https://www.fire.bg',
      description: 'State authority responsible for fire safety inspections, enforcement of fire protection regulations, fire prevention measures, and emergency response coordination.',
      descriptionBG: 'Държавен орган, отговорен за пожарни инспекции, прилагане на разпоредби за пожарна защита, мерки за превенция на пожари и координация на реагирането при извънредни ситуации.'
    },
    {
      id: 'bg-rzi',
      name: 'Regional Health Inspectorate',
      nameBG: 'Регионална здравна инспекция (РЗИ)',
      abbreviation: 'RZI',
      domain: 'medical',
      contactEmail: null,
      contactPhone: null,
      website: 'https://rzi.mh.government.bg',
      description: 'Regional health authority responsible for public health supervision, occupational health monitoring, hygiene inspections, and health risk assessment at workplaces.',
      descriptionBG: 'Регионален здравен орган, отговорен за надзор на общественото здраве, мониторинг на професионалното здраве, инспекции за хигиена и оценка на здравните рискове на работните места.'
    },
    {
      id: 'bg-noi',
      name: 'National Social Security Institute',
      nameBG: 'Национален осигурителен институт (НОИ)',
      abbreviation: 'NOI',
      domain: 'labor',
      contactEmail: 'info@nssi.bg',
      contactPhone: '+359 2 9265 111',
      website: 'https://www.noi.bg',
      description: 'State authority responsible for social security contributions, workplace accident insurance, disability pensions, and compensation for occupational injuries and diseases.',
      descriptionBG: 'Държавен орган, отговорен за осигурителни вноски, застраховка при трудови злополуки, пенсии за инвалидност и обезщетения за професионални травми и заболявания.'
    }
  ],

  // ─── PENALTY RANGES ───
  penaltyRanges: [
    {
      id: 'bg-penalty-no-training',
      violationType: 'No safety and health training provided',
      violationTypeBG: 'Непровеждане на обучение по безопасност и здраве',
      minAmount: 500,
      maxAmount: 2000,
      currency: 'EUR',
      appliesTo: 'company',
      legalBasis: 'ЗЗБУТ, чл. 54',
      description: 'Penalty for employers who fail to provide mandatory safety and health training to employees.',
      descriptionBG: 'Санкция за работодатели, които не осигуряват задължително обучение по безопасност и здраве на служителите.'
    },
    {
      id: 'bg-penalty-no-medical-exam',
      violationType: 'No mandatory medical examination',
      violationTypeBG: 'Непровеждане на задължителни медицински прегледи',
      minAmount: 300,
      maxAmount: 1500,
      currency: 'EUR',
      appliesTo: 'company',
      legalBasis: 'ЗЗБУТ, чл. 54; Наредба № 5/1987',
      description: 'Penalty for employers who fail to arrange mandatory medical examinations for employees.',
      descriptionBG: 'Санкция за работодатели, които не организират задължителни медицински прегледи за служителите.'
    },
    {
      id: 'bg-penalty-no-ppe',
      violationType: 'No personal protective equipment provided',
      violationTypeBG: 'Неосигуряване на лични предпазни средства',
      minAmount: 250,
      maxAmount: 1000,
      currency: 'EUR',
      appliesTo: 'company',
      legalBasis: 'ЗЗБУТ, чл. 54',
      description: 'Penalty for employers who fail to provide adequate personal protective equipment (PPE) to employees.',
      descriptionBG: 'Санкция за работодатели, които не осигуряват подходящи лични предпазни средства (ЛПС) на служителите.'
    },
    {
      id: 'bg-penalty-unsafe-workplace',
      violationType: 'Unsafe working conditions',
      violationTypeBG: 'Небезопасни условия на труд',
      minAmount: 1000,
      maxAmount: 5000,
      currency: 'EUR',
      appliesTo: 'company',
      legalBasis: 'ЗЗБУТ, чл. 54',
      description: 'Penalty for employers who maintain unsafe working conditions that endanger employee health and safety.',
      descriptionBG: 'Санкция за работодатели, които поддържат небезопасни условия на труд, застрашаващи здравето и безопасността на служителите.'
    },
    {
      id: 'bg-penalty-no-risk-assessment',
      violationType: 'No workplace risk assessment',
      violationTypeBG: 'Липса на оценка на риска на работното място',
      minAmount: 500,
      maxAmount: 2500,
      currency: 'EUR',
      appliesTo: 'company',
      legalBasis: 'ЗЗБУТ, чл. 17, чл. 54',
      description: 'Penalty for employers who fail to conduct mandatory risk assessment of workplace hazards.',
      descriptionBG: 'Санкция за работодатели, които не извършват задължителна оценка на риска на работното място.'
    },
    {
      id: 'bg-penalty-fire-safety-violation',
      violationType: 'Fire safety regulations violation',
      violationTypeBG: 'Нарушение на правилата за пожарна безопасност',
      minAmount: 300,
      maxAmount: 2000,
      currency: 'EUR',
      appliesTo: 'company',
      legalBasis: 'ЗЗБ, чл. 258',
      description: 'Penalty for violations of fire safety regulations, including lack of fire extinguishers, blocked emergency exits, or missing evacuation plans.',
      descriptionBG: 'Санкция за нарушения на разпоредбите за пожарна безопасност, включително липса на пожарогасители, блокирани аварийни изходи или липсващи планове за евакуация.'
    },
    {
      id: 'bg-penalty-accident-not-reported',
      violationType: 'Workplace accident not reported',
      violationTypeBG: 'Непредявена трудова злополука',
      minAmount: 500,
      maxAmount: 3000,
      currency: 'EUR',
      appliesTo: 'company',
      legalBasis: 'ЗЗБУТ, чл. 54',
      description: 'Penalty for employers who fail to report workplace accidents to the labor inspectorate within the required timeframe.',
      descriptionBG: 'Санкция за работодатели, които не докладват трудова злополука на трудовата инспекция в изисквания срок.'
    },
    {
      id: 'bg-penalty-individual-violation',
      violationType: 'Individual violation of safety rules',
      violationTypeBG: 'Индивидуално нарушение на правилата за безопасност',
      minAmount: 50,
      maxAmount: 300,
      currency: 'EUR',
      appliesTo: 'individual',
      legalBasis: 'ЗЗБУТ, чл. 53',
      description: 'Penalty for individual employees who violate safety and health regulations, refuse to use PPE, or endanger themselves or others.',
      descriptionBG: 'Санкция за отделни служители, които нарушават правилата за безопасност и здраве, отказват да използват ЛПС или застрашават себе си или други.'
    },
    {
      id: 'bg-penalty-serious-violation',
      violationType: 'Serious violation causing imminent danger',
      violationTypeBG: 'Тежко нарушение, създаващо непосредствена опасност',
      minAmount: 5000,
      maxAmount: 20000,
      currency: 'EUR',
      appliesTo: 'company',
      legalBasis: 'ЗЗБУТ, чл. 54',
      description: 'Penalty for serious violations that create imminent danger to employee life or health, may result in temporary workplace closure.',
      descriptionBG: 'Санкция за тежки нарушения, които създават непосредствена опасност за живота или здравето на служителите, може да доведе до временно закриване на работното място.'
    }
  ],

  // ─── DOCUMENT TEMPLATES ───
  documentTemplates: [
    {
      id: 'bg-template-medical-record',
      name: 'Occupational Medical Examination Record',
      nameBG: 'Карта за медицински преглед по трудова медицина',
      type: 'medical_record',
      description: 'Template for recording results of mandatory occupational medical examinations, including employee data, examination type, medical findings, and fitness assessment.',
      descriptionBG: 'Шаблон за записване на резултатите от задължителни медицински прегледи по трудова медицина, включително данни за служителя, тип преглед, медицински находки и оценка на годността.',
      requiredFields: ['employee_name', 'cnp_hash', 'job_title', 'examination_type', 'examination_date', 'result', 'doctor_name', 'clinic_name'],
      legalBasis: 'Наредба № 5/1987'
    },
    {
      id: 'bg-template-equipment-inspection',
      name: 'Safety Equipment Inspection Record',
      nameBG: 'Протокол за проверка на оборудване за безопасност',
      type: 'equipment_inspection',
      description: 'Template for documenting periodic inspections of safety and fire equipment, including inspection date, equipment condition, compliance status, and next inspection date.',
      descriptionBG: 'Шаблон за документиране на периодични проверки на оборудване за безопасност и противопожарно оборудване, включително дата на проверката, състояние на оборудването, статус на съответствие и следваща дата на проверка.',
      requiredFields: ['equipment_type', 'location', 'serial_number', 'last_inspection_date', 'expiry_date', 'inspector_name', 'is_compliant'],
      legalBasis: 'Наредба № 7/1999; Наредба за пожарна безопасност'
    },
    {
      id: 'bg-template-training-certificate',
      name: 'Safety and Health Training Certificate',
      nameBG: 'Удостоверение за обучение по безопасност и здраве',
      type: 'training_certificate',
      description: 'Template for issuing certificates upon completion of mandatory safety and health training programs, including training type, duration, date, and trainer information.',
      descriptionBG: 'Шаблон за издаване на удостоверения при завършване на задължителни програми за обучение по безопасност и здраве, включително тип обучение, продължителност, дата и информация за обучителя.',
      requiredFields: ['employee_name', 'training_type', 'training_date', 'duration_hours', 'trainer_name', 'certificate_number'],
      legalBasis: 'Наредба № 1/1999'
    },
    {
      id: 'bg-template-risk-assessment',
      name: 'Workplace Risk Assessment Report',
      nameBG: 'Доклад за оценка на риска на работното място',
      type: 'compliance_report',
      description: 'Template for documenting workplace risk assessment, identifying hazards, evaluating risks, and proposing preventive measures.',
      descriptionBG: 'Шаблон за документиране на оценката на риска на работното място, идентифициране на опасности, оценяване на рисковете и предлагане на превантивни мерки.',
      requiredFields: ['workplace_description', 'identified_hazards', 'risk_level', 'affected_employees', 'preventive_measures', 'assessment_date', 'assessor_name'],
      legalBasis: 'ЗЗБУТ, чл. 17; Наредба № 7/1999'
    },
    {
      id: 'bg-template-accident-report',
      name: 'Workplace Accident Report',
      nameBG: 'Протокол за трудова злополука',
      type: 'compliance_report',
      description: 'Template for reporting workplace accidents to labor inspectorate, including accident details, circumstances, injuries, witnesses, and preventive measures.',
      descriptionBG: 'Шаблон за докладване на трудови злополуки на трудовата инспекция, включително подробности за инцидента, обстоятелства, наранявания, свидетели и превантивни мерки.',
      requiredFields: ['accident_date', 'accident_time', 'location', 'injured_employee', 'injury_description', 'circumstances', 'witnesses', 'preventive_actions'],
      legalBasis: 'ЗЗБУТ, чл. 62; Наредба № 7/1999'
    },
    {
      id: 'bg-template-fire-evacuation-plan',
      name: 'Fire Evacuation Plan',
      nameBG: 'План за евакуация при пожар',
      type: 'other',
      description: 'Template for fire evacuation plan, including building layout, evacuation routes, assembly points, emergency contacts, and fire equipment locations.',
      descriptionBG: 'Шаблон за план за евакуация при пожар, включително оформление на сградата, маршрути за евакуация, точки за събиране, спешни контакти и места на противопожарно оборудване.',
      requiredFields: ['building_address', 'evacuation_routes', 'assembly_point', 'emergency_contacts', 'fire_equipment_locations', 'responsible_person'],
      legalBasis: 'Наредба за пожарна безопасност, чл. 15'
    }
  ],

  // ─── NOTIFICATION SETTINGS ───
  notificationSettings: {
    defaultChannels: ['email', 'whatsapp'],
    warningDaysBefore: [30, 15, 7],
    criticalDaysBefore: [3, 1],
    workingHoursStart: '09:00',
    workingHoursEnd: '18:00',
    timezone: 'Europe/Sofia'
  }
}

export default bulgariaConfig
