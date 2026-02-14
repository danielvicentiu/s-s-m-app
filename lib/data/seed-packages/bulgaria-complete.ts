/**
 * Complete Bulgaria seed data package
 * Includes: legislation (ZZBBUT/Naredba refs), training types, medical types,
 * penalties (EUR), holidays, document templates
 *
 * Import: seedBulgariaComplete()
 */

import { createSupabaseServer } from '@/lib/supabase/server'

// ══════════════════════════════════════════════════════════════════════════════
// LEGISLATION - Bulgarian SSM/PSI Acts (ZZBBUT, Naredba references)
// ══════════════════════════════════════════════════════════════════════════════

export interface BulgariaLegislation {
  id: string
  country_code: 'BG'
  domain: 'SSM' | 'PSI' | 'MEDICAL' | 'LABOR'
  act_number: string
  act_date: string
  title: string
  title_bg: string
  official_journal_ref: string | null
  source_url: string | null
  description: string
}

export const bulgariaLegislation: BulgariaLegislation[] = [
  {
    id: 'bg-zzbbut',
    country_code: 'BG',
    domain: 'SSM',
    act_number: 'ЗЗБУТ',
    act_date: '1997-01-01',
    title: 'Legea securității și sănătății în muncă',
    title_bg: 'Закон за здравословни и безопасни условия на труд (ЗЗБУТ)',
    official_journal_ref: 'ДВ бр. 124/1997',
    source_url: 'https://www.lex.bg/laws/ldoc/2134673408',
    description: 'Actul normativ fundamental pentru SSM în Bulgaria, stabilește cerințele generale pentru asigurarea condițiilor sigure și sănătoase de muncă.'
  },
  {
    id: 'bg-naredba-7',
    country_code: 'BG',
    domain: 'SSM',
    act_number: 'Наредба № 7',
    act_date: '1999-09-01',
    title: 'Ordonanța nr. 7 - Cerințe minime pentru asigurarea securității și sănătății în muncă',
    title_bg: 'Наредба № 7 за минималните изисквания за здравословни и безопасни условия на труд на работните места и при използване на работното оборудване',
    official_journal_ref: 'ДВ бр. 88/1999',
    source_url: 'https://www.lex.bg/laws/ldoc/2134673408',
    description: 'Reglementează cerințele minime pentru amenajarea locurilor de muncă, utilizarea echipamentelor de lucru și măsurile de protecție necesare.'
  },
  {
    id: 'bg-naredba-5',
    country_code: 'BG',
    domain: 'MEDICAL',
    act_number: 'Наредба № 5',
    act_date: '2006-02-01',
    title: 'Ordonanța nr. 5 - Controale medicale obligatorii',
    title_bg: 'Наредба № 5 за задължителните предварителни и периодични медицински прегледи на работниците',
    official_journal_ref: 'ДВ бр. 13/2006',
    source_url: 'https://www.lex.bg/bg/laws/ldoc/2135544183',
    description: 'Stabilește tipurile de controale medicale obligatorii, frecvența acestora și categoriile de muncitori supuși controlului medical.'
  },
  {
    id: 'bg-naredba-1',
    country_code: 'BG',
    domain: 'SSM',
    act_number: 'Наредба № 1',
    act_date: '2011-01-01',
    title: 'Ordonanța nr. 1 - Instruire în domeniul SSM',
    title_bg: 'Наредба № 1 за обучението и инструктажа на работниците и служителите по правилата за осигуряване на здравословни и безопасни условия на труд',
    official_journal_ref: 'ДВ бр. 7/2011',
    source_url: 'https://www.lex.bg/laws/ldoc/2135736526',
    description: 'Reglementează instruirea și formarea lucrătorilor în domeniul securității și sănătății în muncă - tipuri de instruire, durate și modalități.'
  },
  {
    id: 'bg-zpb',
    country_code: 'BG',
    domain: 'PSI',
    act_number: 'ЗЗО',
    act_date: '1997-06-01',
    title: 'Legea protecției împotriva incendiilor',
    title_bg: 'Закон за защита при бедствия',
    official_journal_ref: 'ДВ бр. 102/2006',
    source_url: 'https://www.lex.bg/laws/ldoc/2135540613',
    description: 'Cadrul legislativ pentru protecția împotriva incendiilor și dezastrelor, stabilește responsabilitățile pentru prevenirea și combaterea incendiilor.'
  },
  {
    id: 'bg-pravila-ppb',
    country_code: 'BG',
    domain: 'PSI',
    act_number: 'Правилник ППБ',
    act_date: '2009-07-01',
    title: 'Regulamentul pentru protecția împotriva incendiilor',
    title_bg: 'Правилник за противопожарната безопасност',
    official_journal_ref: 'ДВ бр. 35/2009',
    source_url: null,
    description: 'Reglementări tehnice detaliate privind măsurile de protecție împotriva incendiilor în clădiri, instalații și teritorii.'
  },
  {
    id: 'bg-kt',
    country_code: 'BG',
    domain: 'LABOR',
    act_number: 'КТ',
    act_date: '1986-01-01',
    title: 'Codul muncii bulgar',
    title_bg: 'Кодекс на труда',
    official_journal_ref: 'ДВ бр. 26-27/1986',
    source_url: 'https://www.lex.bg/laws/ldoc/1594373121',
    description: 'Actul normativ fundamental care reglementează relațiile de muncă în Bulgaria, inclusiv prevederi privind timpul de lucru, concediile și drepturile angajaților.'
  },
  {
    id: 'bg-naredba-3',
    country_code: 'BG',
    domain: 'SSM',
    act_number: 'Наредба № 3',
    act_date: '2001-03-01',
    title: 'Ordonanța nr. 3 - Valori maxime admise pentru factorii nocivi',
    title_bg: 'Наредба № 3 за нормите за допустими концентрации на вредни вещества в работната среда, методите за техният контрол и оценка',
    official_journal_ref: 'ДВ бр. 23/2001',
    source_url: null,
    description: 'Stabilește valorile maxime admise pentru concentrațiile de substanțe nocive, zgomot, vibrații și alți factori de risc în mediul de lucru.'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// TRAINING TYPES - Bulgarian SSM/PSI training categories
// ══════════════════════════════════════════════════════════════════════════════

export interface BulgariaTrainingType {
  id: string
  country_code: 'BG'
  name: string
  name_bg: string
  description: string
  frequency: 'annual' | 'biannual' | 'once' | 'on_demand'
  duration_hours: number
  is_mandatory: boolean
  category: 'SSM' | 'PSI' | 'FIRST_AID' | 'SPECIALIZED'
  legal_reference: string
}

export const bulgariaTrainingTypes: BulgariaTrainingType[] = [
  {
    id: 'bg-training-initial-ssm',
    country_code: 'BG',
    name: 'Instruire inițială SSM',
    name_bg: 'Начален инструктаж по ЗБУТ',
    description: 'Instruire obligatorie pentru toți angajații noi, înainte de începerea activității. Acoperă riscurile generale și specifice postului.',
    frequency: 'once',
    duration_hours: 4,
    is_mandatory: true,
    category: 'SSM',
    legal_reference: 'Наредба № 1/2011 - чл. 6'
  },
  {
    id: 'bg-training-periodic-ssm',
    country_code: 'BG',
    name: 'Instruire periodică SSM',
    name_bg: 'Периодичен инструктаж по ЗБУТ',
    description: 'Instruire de reîmprospătare a cunoștințelor, obligatorie anual pentru toți angajații.',
    frequency: 'annual',
    duration_hours: 2,
    is_mandatory: true,
    category: 'SSM',
    legal_reference: 'Наредба № 1/2011 - чл. 7'
  },
  {
    id: 'bg-training-workplace-ssm',
    country_code: 'BG',
    name: 'Instruire la locul de muncă',
    name_bg: 'Инструктаж на работното място',
    description: 'Instruire specifică pentru riscurile particulare ale locului de muncă și echipamentelor utilizate.',
    frequency: 'once',
    duration_hours: 3,
    is_mandatory: true,
    category: 'SSM',
    legal_reference: 'Наредба № 1/2011 - чл. 8'
  },
  {
    id: 'bg-training-fire-safety',
    country_code: 'BG',
    name: 'Instruire PSI',
    name_bg: 'Инструктаж по пожарна безопасност',
    description: 'Instruire obligatorie pentru protecția împotriva incendiilor, căi de evacuare și utilizarea echipamentelor de stingere.',
    frequency: 'annual',
    duration_hours: 2,
    is_mandatory: true,
    category: 'PSI',
    legal_reference: 'Правилник ППБ - чл. 22'
  },
  {
    id: 'bg-training-first-aid',
    country_code: 'BG',
    name: 'Prim ajutor',
    name_bg: 'Обучение по първа помощ',
    description: 'Formare pentru acordarea primului ajutor în caz de accident de muncă.',
    frequency: 'biannual',
    duration_hours: 8,
    is_mandatory: false,
    category: 'FIRST_AID',
    legal_reference: 'ЗЗБУТ - чл. 23'
  },
  {
    id: 'bg-training-height-work',
    country_code: 'BG',
    name: 'Lucru la înălțime',
    name_bg: 'Работа на височина',
    description: 'Instruire specializată pentru lucrări la înălțime peste 2 metri.',
    frequency: 'annual',
    duration_hours: 6,
    is_mandatory: true,
    category: 'SPECIALIZED',
    legal_reference: 'Наредба № 7/1999 - Приложение 1'
  },
  {
    id: 'bg-training-electrical',
    country_code: 'BG',
    name: 'Lucru cu instalații electrice',
    name_bg: 'Работа с електрически уредби',
    description: 'Instruire specializată pentru lucrul cu instalații și echipamente electrice.',
    frequency: 'annual',
    duration_hours: 8,
    is_mandatory: true,
    category: 'SPECIALIZED',
    legal_reference: 'Наредба № 7/1999'
  },
  {
    id: 'bg-training-hazardous-substances',
    country_code: 'BG',
    name: 'Lucru cu substanțe periculoase',
    name_bg: 'Работа с опасни вещества',
    description: 'Instruire pentru manipularea substanțelor chimice și biologice periculoase.',
    frequency: 'annual',
    duration_hours: 4,
    is_mandatory: true,
    category: 'SPECIALIZED',
    legal_reference: 'Наредба № 3/2001'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// MEDICAL EXAMINATION TYPES - Bulgarian medical check categories
// ══════════════════════════════════════════════════════════════════════════════

export interface BulgariaMedicalType {
  id: string
  country_code: 'BG'
  name: string
  name_bg: string
  description: string
  examination_type: 'preliminary' | 'periodic' | 'extraordinary' | 'final'
  frequency_months: number | null
  is_mandatory: boolean
  legal_reference: string
  applies_to: string
}

export const bulgariaMedicalTypes: BulgariaMedicalType[] = [
  {
    id: 'bg-medical-preliminary',
    country_code: 'BG',
    name: 'Control medical preliminar',
    name_bg: 'Предварителен медицински преглед',
    description: 'Control medical obligatoriu înainte de angajare, pentru verificarea aptitudinii pentru munca ce urmează a fi efectuată.',
    examination_type: 'preliminary',
    frequency_months: null,
    is_mandatory: true,
    legal_reference: 'Наредба № 5/2006 - чл. 4',
    applies_to: 'Toți angajații noi'
  },
  {
    id: 'bg-medical-periodic-annual',
    country_code: 'BG',
    name: 'Control medical periodic anual',
    name_bg: 'Периодичен медицински преглед (годишен)',
    description: 'Control medical periodic anual pentru lucrătorii expuși la factori de risc moderat.',
    examination_type: 'periodic',
    frequency_months: 12,
    is_mandatory: true,
    legal_reference: 'Наредба № 5/2006 - чл. 5',
    applies_to: 'Lucrători expuși la factori de risc moderat'
  },
  {
    id: 'bg-medical-periodic-biannual',
    country_code: 'BG',
    name: 'Control medical periodic semestrial',
    name_bg: 'Периодичен медицински преглед (полугодишен)',
    description: 'Control medical periodic la fiecare 6 luni pentru lucrătorii expuși la factori de risc ridicat.',
    examination_type: 'periodic',
    frequency_months: 6,
    is_mandatory: true,
    legal_reference: 'Наредба № 5/2006 - чл. 5',
    applies_to: 'Lucrători expuși la factori de risc ridicat (substanțe toxice, radiații, zgomot intens)'
  },
  {
    id: 'bg-medical-young-workers',
    country_code: 'BG',
    name: 'Control medical pentru tineri sub 18 ani',
    name_bg: 'Медицински преглед на млади работници под 18 години',
    description: 'Control medical obligatoriu anual pentru lucrătorii cu vârsta sub 18 ani.',
    examination_type: 'periodic',
    frequency_months: 12,
    is_mandatory: true,
    legal_reference: 'КТ - чл. 302',
    applies_to: 'Lucrători sub 18 ani'
  },
  {
    id: 'bg-medical-extraordinary',
    country_code: 'BG',
    name: 'Control medical extraordinar',
    name_bg: 'Извънреден медицински преглед',
    description: 'Control medical efectuat la cererea angajatului sau angajatorului în caz de suspiciune de boală profesională sau pierderea aptitudinii.',
    examination_type: 'extraordinary',
    frequency_months: null,
    is_mandatory: false,
    legal_reference: 'Наредба № 5/2006 - чл. 6',
    applies_to: 'La cerere sau la suspiciune de boală profesională'
  },
  {
    id: 'bg-medical-final',
    country_code: 'BG',
    name: 'Control medical final',
    name_bg: 'Окончателен медицински преглед',
    description: 'Control medical la încetarea raportului de muncă pentru lucrătorii care au fost expuși la factori de risc speciali.',
    examination_type: 'final',
    frequency_months: null,
    is_mandatory: true,
    legal_reference: 'Наредба № 5/2006 - чл. 7',
    applies_to: 'Lucrători expuși la substanțe cancerigene, radiații sau alți factori cu efect întârziat'
  },
  {
    id: 'bg-medical-night-shift',
    country_code: 'BG',
    name: 'Control medical pentru lucrul nocturn',
    name_bg: 'Медицински преглед за нощна работа',
    description: 'Control medical periodic pentru angajații care lucrează în ture de noapte.',
    examination_type: 'periodic',
    frequency_months: 12,
    is_mandatory: true,
    legal_reference: 'КТ - чл. 140',
    applies_to: 'Lucrători în tură de noapte'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// PENALTIES - Bulgarian SSM/PSI fines in EUR
// ══════════════════════════════════════════════════════════════════════════════

export interface BulgariaPenalty {
  id: string
  country_code: 'BG'
  violation_type: string
  violation_type_bg: string
  description: string
  penalty_min_eur: number
  penalty_max_eur: number
  legal_reference: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export const bulgariaPenalties: BulgariaPenalty[] = [
  {
    id: 'bg-penalty-no-risk-assessment',
    country_code: 'BG',
    violation_type: 'Absența evaluării riscurilor',
    violation_type_bg: 'Липса на оценка на риска',
    description: 'Neefectuarea evaluării riscurilor la locul de muncă.',
    penalty_min_eur: 500,
    penalty_max_eur: 1500,
    legal_reference: 'ЗЗБУТ - чл. 60',
    severity: 'high'
  },
  {
    id: 'bg-penalty-no-ssm-training',
    country_code: 'BG',
    violation_type: 'Lipsa instruirii SSM',
    violation_type_bg: 'Липса на инструктаж по ЗБУТ',
    description: 'Angajații nu au primit instruirea obligatorie în domeniul securității și sănătății în muncă.',
    penalty_min_eur: 250,
    penalty_max_eur: 1000,
    legal_reference: 'ЗЗБУТ - чл. 60',
    severity: 'high'
  },
  {
    id: 'bg-penalty-no-medical-exam',
    country_code: 'BG',
    violation_type: 'Lipsa controlului medical',
    violation_type_bg: 'Липса на медицински преглед',
    description: 'Angajații nu au efectuat controalele medicale obligatorii (preliminare sau periodice).',
    penalty_min_eur: 300,
    penalty_max_eur: 1200,
    legal_reference: 'Наредба № 5/2006 - чл. 15',
    severity: 'high'
  },
  {
    id: 'bg-penalty-no-ppe',
    country_code: 'BG',
    violation_type: 'Nepunerea la dispoziție a EIP',
    violation_type_bg: 'Липса на лични предпазни средства',
    description: 'Angajatorul nu a pus la dispoziție echipamente individuale de protecție necesare.',
    penalty_min_eur: 200,
    penalty_max_eur: 800,
    legal_reference: 'ЗЗБУТ - чл. 60',
    severity: 'medium'
  },
  {
    id: 'bg-penalty-no-fire-equipment',
    country_code: 'BG',
    violation_type: 'Absența echipamentelor PSI',
    violation_type_bg: 'Липса на противопожарно оборудване',
    description: 'Lipsesc sau sunt defecte echipamentele de protecție împotriva incendiilor (stingătoare, hidranți, detectori).',
    penalty_min_eur: 300,
    penalty_max_eur: 1500,
    legal_reference: 'Закон за защита при бедствия - чл. 80',
    severity: 'high'
  },
  {
    id: 'bg-penalty-no-evacuation-plan',
    country_code: 'BG',
    violation_type: 'Lipsa planului de evacuare',
    violation_type_bg: 'Липса на план за евакуация',
    description: 'Nu există plan de evacuare în caz de incendiu sau plan inexistent la vedere.',
    penalty_min_eur: 150,
    penalty_max_eur: 600,
    legal_reference: 'Правилник ППБ - чл. 60',
    severity: 'medium'
  },
  {
    id: 'bg-penalty-unsafe-equipment',
    country_code: 'BG',
    violation_type: 'Utilizarea echipamentelor nesigure',
    violation_type_bg: 'Използване на неизправно оборудване',
    description: 'Utilizarea echipamentelor de lucru defecte sau fără verificări periodice.',
    penalty_min_eur: 400,
    penalty_max_eur: 2000,
    legal_reference: 'Наредба № 7/1999 - чл. 30',
    severity: 'critical'
  },
  {
    id: 'bg-penalty-no-accident-report',
    country_code: 'BG',
    violation_type: 'Neraportarea accidentelor de muncă',
    violation_type_bg: 'Неподаване на декларация за трудова злополука',
    description: 'Neraportarea accidentelor de muncă către autoritățile competente.',
    penalty_min_eur: 500,
    penalty_max_eur: 2500,
    legal_reference: 'ЗЗБУТ - чл. 60',
    severity: 'critical'
  },
  {
    id: 'bg-penalty-blocked-exit',
    country_code: 'BG',
    violation_type: 'Blocarea căilor de evacuare',
    violation_type_bg: 'Блокирани аварийни изходи',
    description: 'Căile de evacuare și ieșirile de urgență sunt blocate sau inaccesibile.',
    penalty_min_eur: 250,
    penalty_max_eur: 1000,
    legal_reference: 'Правилник ППБ - чл. 15',
    severity: 'high'
  },
  {
    id: 'bg-penalty-missing-documentation',
    country_code: 'BG',
    violation_type: 'Documentație SSM incompletă',
    violation_type_bg: 'Липсваща документация по ЗБУТ',
    description: 'Documentația SSM obligatorie este incompletă sau nu este actualizată.',
    penalty_min_eur: 150,
    penalty_max_eur: 500,
    legal_reference: 'ЗЗБУТ - чл. 60',
    severity: 'low'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// HOLIDAYS - Bulgarian national and public holidays
// ══════════════════════════════════════════════════════════════════════════════

export interface BulgariaHoliday {
  id: string
  country_code: 'BG'
  name: string
  name_bg: string
  date_pattern: string // Format: MM-DD or special marker for movable holidays
  is_public_holiday: boolean
  is_work_free: boolean
  description: string
}

export const bulgariaHolidays: BulgariaHoliday[] = [
  {
    id: 'bg-holiday-new-year',
    country_code: 'BG',
    name: 'Anul Nou',
    name_bg: 'Нова година',
    date_pattern: '01-01',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Anul Nou - zi liberă oficială.'
  },
  {
    id: 'bg-holiday-liberation-day',
    country_code: 'BG',
    name: 'Ziua Eliberării',
    name_bg: 'Ден на Освобождението на България',
    date_pattern: '03-03',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ziua Națională a Bulgariei - aniversarea eliberării de sub dominația otomană (1878).'
  },
  {
    id: 'bg-holiday-good-friday',
    country_code: 'BG',
    name: 'Vinerea Mare (ortodoxă)',
    name_bg: 'Велики петък',
    date_pattern: 'EASTER-2', // Special: depends on Orthodox Easter
    is_public_holiday: true,
    is_work_free: false,
    description: 'Vinerea Mare conform calendarului ortodox.'
  },
  {
    id: 'bg-holiday-easter-saturday',
    country_code: 'BG',
    name: 'Sâmbăta Mare (ortodoxă)',
    name_bg: 'Велика събота',
    date_pattern: 'EASTER-1',
    is_public_holiday: true,
    is_work_free: false,
    description: 'Sâmbăta Mare conform calendarului ortodox.'
  },
  {
    id: 'bg-holiday-easter',
    country_code: 'BG',
    name: 'Paștele ortodox',
    name_bg: 'Великден',
    date_pattern: 'EASTER',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Paștele conform calendarului ortodox - cea mai importantă sărbătoare creștină ortodoxă.'
  },
  {
    id: 'bg-holiday-easter-monday',
    country_code: 'BG',
    name: 'Lunea Paștelor',
    name_bg: 'Велики понеделник',
    date_pattern: 'EASTER+1',
    is_public_holiday: true,
    is_work_free: true,
    description: 'A doua zi de Paște.'
  },
  {
    id: 'bg-holiday-labour-day',
    country_code: 'BG',
    name: 'Ziua Muncii',
    name_bg: 'Ден на труда',
    date_pattern: '05-01',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ziua Internațională a Muncii.'
  },
  {
    id: 'bg-holiday-st-george-day',
    country_code: 'BG',
    name: 'Ziua Armatei și Ziua Sf. Gheorghe',
    name_bg: 'Гергьовден и Ден на храбростта',
    date_pattern: '05-06',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ziua Forțelor Armate și ziua Sf. Gheorghe - patron al Bulgariei.'
  },
  {
    id: 'bg-holiday-education-culture-day',
    country_code: 'BG',
    name: 'Ziua Educației și Culturii Slave',
    name_bg: 'Ден на българската просвета и култура',
    date_pattern: '05-24',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ziua educației, culturii și alfabetului slav (Sf. Chiril și Metodiu).'
  },
  {
    id: 'bg-holiday-unification-day',
    country_code: 'BG',
    name: 'Ziua Unificării',
    name_bg: 'Ден на Съединението',
    date_pattern: '09-06',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ziua Unificării Bulgariei (1885).'
  },
  {
    id: 'bg-holiday-independence-day',
    country_code: 'BG',
    name: 'Ziua Independenței',
    name_bg: 'Ден на независимостта',
    date_pattern: '09-22',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ziua proclamării independenței Bulgariei (1908).'
  },
  {
    id: 'bg-holiday-national-awakening',
    country_code: 'BG',
    name: 'Ziua Renașterii Naționale',
    name_bg: 'Ден на народните будители',
    date_pattern: '11-01',
    is_public_holiday: true,
    is_work_free: false,
    description: 'Ziua dedicată eroilor renașterii naționale bulgare.'
  },
  {
    id: 'bg-holiday-christmas-eve',
    country_code: 'BG',
    name: 'Ajunul Crăciunului',
    name_bg: 'Бъдни вечер',
    date_pattern: '12-24',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ajunul Crăciunului - zi liberă oficială.'
  },
  {
    id: 'bg-holiday-christmas',
    country_code: 'BG',
    name: 'Crăciunul',
    name_bg: 'Рождество Христово',
    date_pattern: '12-25',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Prima zi de Crăciun.'
  },
  {
    id: 'bg-holiday-christmas-second',
    country_code: 'BG',
    name: 'A doua zi de Crăciun',
    name_bg: 'Втори ден на Рождество Христово',
    date_pattern: '12-26',
    is_public_holiday: true,
    is_work_free: true,
    description: 'A doua zi de Crăciun.'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// DOCUMENT TEMPLATES - Bulgarian SSM/PSI document types
// ══════════════════════════════════════════════════════════════════════════════

export interface BulgariaDocumentTemplate {
  id: string
  country_code: 'BG'
  name: string
  name_bg: string
  description: string
  category: 'SSM' | 'PSI' | 'MEDICAL' | 'TRAINING' | 'COMPLIANCE'
  is_mandatory: boolean
  legal_reference: string
  template_fields: string[]
}

export const bulgariaDocumentTemplates: BulgariaDocumentTemplate[] = [
  {
    id: 'bg-doc-risk-assessment',
    country_code: 'BG',
    name: 'Evaluarea riscurilor',
    name_bg: 'Оценка на риска',
    description: 'Document de evaluare a riscurilor pentru sănătatea și securitatea lucrătorilor la fiecare loc de muncă.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ - чл. 17',
    template_fields: ['workplace_id', 'risk_factors', 'risk_level', 'prevention_measures', 'responsible_person', 'assessment_date']
  },
  {
    id: 'bg-doc-training-record',
    country_code: 'BG',
    name: 'Registrul instruirilor SSM',
    name_bg: 'Протокол за инструктаж по ЗБУТ',
    description: 'Registru obligatoriu pentru evidența instruirilor în domeniul securității și sănătății în muncă.',
    category: 'TRAINING',
    is_mandatory: true,
    legal_reference: 'Наредба № 1/2011 - чл. 10',
    template_fields: ['employee_name', 'training_type', 'training_date', 'duration', 'trainer_name', 'employee_signature', 'trainer_signature']
  },
  {
    id: 'bg-doc-medical-record',
    country_code: 'BG',
    name: 'Fișa medicală',
    name_bg: 'Медицинско свидетелство',
    description: 'Certificat medical pentru aptitudinea la muncă.',
    category: 'MEDICAL',
    is_mandatory: true,
    legal_reference: 'Наредба № 5/2006',
    template_fields: ['employee_name', 'examination_type', 'examination_date', 'result', 'restrictions', 'doctor_name', 'medical_facility']
  },
  {
    id: 'bg-doc-accident-report',
    country_code: 'BG',
    name: 'Raport de accident de muncă',
    name_bg: 'Декларация за трудова злополука',
    description: 'Declarație obligatorie pentru raportarea accidentelor de muncă.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ - чл. 57',
    template_fields: ['employee_name', 'accident_date', 'accident_time', 'location', 'description', 'witnesses', 'injury_type', 'reporting_date']
  },
  {
    id: 'bg-doc-fire-safety-plan',
    country_code: 'BG',
    name: 'Plan de protecție împotriva incendiilor',
    name_bg: 'План за защита при пожар',
    description: 'Plan obligatoriu pentru măsurile de protecție împotriva incendiilor și evacuare.',
    category: 'PSI',
    is_mandatory: true,
    legal_reference: 'Правилник ППБ - чл. 8',
    template_fields: ['building_description', 'evacuation_routes', 'fire_equipment', 'responsible_persons', 'emergency_contacts', 'last_update']
  },
  {
    id: 'bg-doc-fire-equipment-register',
    country_code: 'BG',
    name: 'Registrul echipamentelor PSI',
    name_bg: 'Регистър на противопожарното оборудване',
    description: 'Registru pentru evidența echipamentelor de protecție împotriva incendiilor și verificările periodice.',
    category: 'PSI',
    is_mandatory: true,
    legal_reference: 'Правилник ППБ - чл. 25',
    template_fields: ['equipment_type', 'location', 'serial_number', 'last_inspection', 'next_inspection', 'inspector_name', 'status']
  },
  {
    id: 'bg-doc-ppe-register',
    country_code: 'BG',
    name: 'Registrul EIP',
    name_bg: 'Регистър на личните предпазни средства',
    description: 'Registru pentru evidența echipamentelor individuale de protecție distribuite angajaților.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ - чл. 25',
    template_fields: ['employee_name', 'ppe_type', 'ppe_standard', 'issue_date', 'replacement_date', 'employee_signature']
  },
  {
    id: 'bg-doc-emergency-plan',
    country_code: 'BG',
    name: 'Plan de urgență',
    name_bg: 'План за действие при аварии',
    description: 'Plan de acțiune în caz de situații de urgență (incendii, accidente, dezastre naturale).',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ - чл. 23',
    template_fields: ['emergency_types', 'action_procedures', 'responsible_persons', 'emergency_contacts', 'evacuation_plan', 'last_drill_date']
  },
  {
    id: 'bg-doc-workplace-instructions',
    country_code: 'BG',
    name: 'Instrucțiuni de lucru SSM',
    name_bg: 'Инструкция за безопасна работа',
    description: 'Instrucțiuni detaliate pentru lucrul în siguranță la fiecare loc de muncă sau echipament.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'Наредба № 7/1999 - чл. 12',
    template_fields: ['workplace_equipment', 'safety_procedures', 'required_ppe', 'prohibited_actions', 'emergency_procedures']
  },
  {
    id: 'bg-doc-compliance-report',
    country_code: 'BG',
    name: 'Raport de conformitate SSM',
    name_bg: 'Доклад за състоянието на условията на труд',
    description: 'Raport anual privind starea condițiilor de muncă și măsurile de îmbunătățire.',
    category: 'COMPLIANCE',
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ - чл. 24',
    template_fields: ['reporting_period', 'workplace_conditions', 'accidents_summary', 'training_summary', 'improvement_measures', 'responsible_person']
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// MAIN SEED FUNCTION
// ══════════════════════════════════════════════════════════════════════════════

export async function seedBulgariaComplete() {
  const supabase = await createSupabaseServer()
  const results = {
    legislation: 0,
    trainingTypes: 0,
    medicalTypes: 0,
    penalties: 0,
    holidays: 0,
    documentTemplates: 0,
    errors: [] as string[]
  }

  try {
    // 1. Seed Legislation
    console.log('📚 Seeding Bulgaria legislation...')
    for (const item of bulgariaLegislation) {
      const { error } = await supabase
        .from('legislation_entries')
        .upsert({
          id: item.id,
          country_code: item.country_code,
          domain: item.domain,
          act_number: item.act_number,
          act_date: item.act_date,
          title: item.title,
          official_journal_ref: item.official_journal_ref,
          source_url: item.source_url,
          raw_metadata: {
            title_bg: item.title_bg,
            description: item.description
          },
          scraped_at: new Date().toISOString()
        }, { onConflict: 'id' })

      if (error) {
        results.errors.push(`Legislation ${item.id}: ${error.message}`)
      } else {
        results.legislation++
      }
    }

    // 2. Seed Training Types (as obligation_types)
    console.log('🎓 Seeding Bulgaria training types...')
    for (const item of bulgariaTrainingTypes) {
      const { error } = await supabase
        .from('obligation_types')
        .upsert({
          id: item.id,
          country_code: item.country_code,
          name: item.name,
          description: `${item.description} | БГ: ${item.name_bg}`,
          frequency: item.frequency,
          authority_name: 'Изпълнителна агенция „Главна инспекция по труда"',
          legal_reference: item.legal_reference,
          penalty_min: null,
          penalty_max: null,
          currency: 'BGN',
          is_active: true,
          is_system: true,
          display_order: bulgariaTrainingTypes.indexOf(item) + 1
        }, { onConflict: 'id' })

      if (error) {
        results.errors.push(`Training ${item.id}: ${error.message}`)
      } else {
        results.trainingTypes++
      }
    }

    // 3. Seed Medical Types (as custom metadata - could be extended to separate table)
    console.log('🏥 Seeding Bulgaria medical types...')
    // Store as JSON in a config table or similar - for now, count them
    results.medicalTypes = bulgariaMedicalTypes.length
    console.log(`✅ Prepared ${results.medicalTypes} medical types (metadata only)`)

    // 4. Seed Penalties
    console.log('⚠️ Seeding Bulgaria penalties...')
    for (const item of bulgariaPenalties) {
      const { error } = await supabase
        .from('penalties')
        .upsert({
          id: item.id,
          country_code: item.country_code,
          violation_type: item.violation_type,
          description: `${item.description} | БГ: ${item.violation_type_bg}`,
          penalty_min_amount: item.penalty_min_eur,
          penalty_max_amount: item.penalty_max_eur,
          currency: 'EUR',
          legal_reference: item.legal_reference,
          severity: item.severity,
          is_active: true
        }, { onConflict: 'id' })

      if (error) {
        results.errors.push(`Penalty ${item.id}: ${error.message}`)
      } else {
        results.penalties++
      }
    }

    // 5. Seed Holidays
    console.log('📅 Seeding Bulgaria holidays...')
    for (const item of bulgariaHolidays) {
      const { error } = await supabase
        .from('holidays')
        .upsert({
          id: item.id,
          country_code: item.country_code,
          name: item.name,
          date_pattern: item.date_pattern,
          is_public_holiday: item.is_public_holiday,
          is_work_free: item.is_work_free,
          description: `${item.description} | БГ: ${item.name_bg}`
        }, { onConflict: 'id' })

      if (error) {
        results.errors.push(`Holiday ${item.id}: ${error.message}`)
      } else {
        results.holidays++
      }
    }

    // 6. Seed Document Templates
    console.log('📄 Seeding Bulgaria document templates...')
    for (const item of bulgariaDocumentTemplates) {
      const { error } = await supabase
        .from('document_templates')
        .upsert({
          id: item.id,
          country_code: item.country_code,
          name: item.name,
          description: `${item.description} | БГ: ${item.name_bg}`,
          category: item.category,
          is_mandatory: item.is_mandatory,
          legal_reference: item.legal_reference,
          template_fields: item.template_fields
        }, { onConflict: 'id' })

      if (error) {
        results.errors.push(`Document ${item.id}: ${error.message}`)
      } else {
        results.documentTemplates++
      }
    }

    console.log('\n✅ Bulgaria Complete Seed Summary:')
    console.log(`   📚 Legislation: ${results.legislation}/${bulgariaLegislation.length}`)
    console.log(`   🎓 Training Types: ${results.trainingTypes}/${bulgariaTrainingTypes.length}`)
    console.log(`   🏥 Medical Types: ${results.medicalTypes} (metadata)`)
    console.log(`   ⚠️ Penalties: ${results.penalties}/${bulgariaPenalties.length}`)
    console.log(`   📅 Holidays: ${results.holidays}/${bulgariaHolidays.length}`)
    console.log(`   📄 Document Templates: ${results.documentTemplates}/${bulgariaDocumentTemplates.length}`)

    if (results.errors.length > 0) {
      console.error('\n❌ Errors encountered:')
      results.errors.forEach(err => console.error(`   - ${err}`))
    }

    return results

  } catch (error) {
    console.error('❌ Fatal error during Bulgaria seed:', error)
    throw error
  }
}

// Export all datasets for external use
export default {
  legislation: bulgariaLegislation,
  trainingTypes: bulgariaTrainingTypes,
  medicalTypes: bulgariaMedicalTypes,
  penalties: bulgariaPenalties,
  holidays: bulgariaHolidays,
  documentTemplates: bulgariaDocumentTemplates,
  seedBulgariaComplete
}
