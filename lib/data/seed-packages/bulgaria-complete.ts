/**
 * Complete Bulgaria seed data package
 * Includes: legislation (ZZBBUT/Naredba refs), training types BG, medical types BG,
 * penalties (EUR), holidays BG, document templates BG
 *
 * Import: seedBulgariaComplete()
 */

import { createSupabaseServer } from '@/lib/supabase/server'

// ══════════════════════════════════════════════════════════════════════════════
// LEGISLATION - Bulgarian OSH Acts (ZZBBUT, Naredbi, etc.)
// ══════════════════════════════════════════════════════════════════════════════

export interface BulgariaLegislation {
  id: string
  country_code: 'BG'
  domain: 'SSM' | 'PSI' | 'MEDICAL' | 'LABOR'
  act_number: string
  act_date: string
  title: string
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
    act_date: '1997-02-18',
    title: 'Закон за здравословни и безопасни условия на труд',
    official_journal_ref: 'ДВ бр. 124/1997',
    source_url: 'https://www.lex.bg/laws/ldoc/2134673408',
    description: 'Основен закон за здравословни и безопасни условия на труд в България. Определя правата и задълженията на работодатели и работници за осигуряване на безопасна работна среда.'
  },
  {
    id: 'bg-naredba-7',
    country_code: 'BG',
    domain: 'SSM',
    act_number: 'Наредба № 7/1999',
    act_date: '1999-10-28',
    title: 'Минимални изисквания за здравословни и безопасни условия на труд на работните места и при използване на работното оборудване',
    official_journal_ref: 'ДВ бр. 88/1999',
    source_url: 'https://www.lex.bg/laws/ldoc/2134829568',
    description: 'Определя минималните изисквания за безопасност на работните места и използването на оборудване.'
  },
  {
    id: 'bg-naredba-3',
    country_code: 'BG',
    domain: 'SSM',
    act_number: 'Наредба № 3/2001',
    act_date: '2001-03-29',
    title: 'Условията и редът за провеждане на периодично обучение и инструктаж на работниците и служителите',
    official_journal_ref: 'ДВ бр. 30/2001',
    source_url: 'https://www.lex.bg/laws/ldoc/2135526912',
    description: 'Регламентира реда за провеждане на обучения и инструктажи по безопасност на труда.'
  },
  {
    id: 'bg-naredba-5',
    country_code: 'BG',
    domain: 'SSM',
    act_number: 'Наредба № 5/1999',
    act_date: '1999-08-26',
    title: 'Минимални изисквания за здравословни и безопасни условия на труд при работа с видеодисплеи',
    official_journal_ref: 'ДВ бр. 80/1999',
    source_url: null,
    description: 'Изисквания за организиране на работните места с компютри и видеодисплеи.'
  },
  {
    id: 'bg-naredba-1',
    country_code: 'BG',
    domain: 'MEDICAL',
    act_number: 'Наредба № 1/2009',
    act_date: '2009-01-15',
    title: 'Медицински надзор на работещите',
    official_journal_ref: 'ДВ бр. 10/2009',
    source_url: null,
    description: 'Регламентира медицинските прегледи и здравния надзор на работещите в зависимост от рисковите фактори.'
  },
  {
    id: 'bg-kz',
    country_code: 'BG',
    domain: 'LABOR',
    act_number: 'Кодекс на труда',
    act_date: '1986-09-01',
    title: 'Кодекс на труда на Република България',
    official_journal_ref: 'ДВ бр. 26/1986',
    source_url: 'https://www.lex.bg/laws/ldoc/1594373121',
    description: 'Основният законодателен акт, регулиращ трудовите отношения в България - права, задължения, договори.'
  },
  {
    id: 'bg-zakon-pzhi',
    country_code: 'BG',
    domain: 'PSI',
    act_number: 'Закон за защита при бедствия',
    act_date: '2006-12-14',
    title: 'Закон за защита при бедствия',
    official_journal_ref: 'ДВ бр. 102/2006',
    source_url: 'https://www.lex.bg/laws/ldoc/2135540547',
    description: 'Регулира дейностите по защита при пожари, природни бедствия и аварии.'
  },
  {
    id: 'bg-naredba-ppo',
    country_code: 'BG',
    domain: 'SSM',
    act_number: 'Наредба № РД-07-2/2009',
    act_date: '2009-12-15',
    title: 'Условия и ред за провеждане на оценката на риска',
    official_journal_ref: 'ДВ бр. 102/2009',
    source_url: null,
    description: 'Методика и задължения за провеждане на оценка на професионалните рискове.'
  },
  {
    id: 'bg-naredba-8',
    country_code: 'BG',
    domain: 'SSM',
    act_number: 'Наредба № 8/2005',
    act_date: '2005-03-24',
    title: 'Минимални изисквания за здравословни и безопасни условия на труд при работа на височина',
    official_journal_ref: 'ДВ бр. 29/2005',
    source_url: null,
    description: 'Специфични изисквания за безопасност при работа на височина.'
  },
  {
    id: 'bg-naredba-2',
    country_code: 'BG',
    domain: 'SSM',
    act_number: 'Наредба № 2/2004',
    act_date: '2004-03-16',
    title: 'Минимални изисквания за здравословни и безопасни условия на труд при извършване на строителни и монтажни работи',
    official_journal_ref: 'ДВ бр. 37/2004',
    source_url: null,
    description: 'Изисквания за безопасност в строителството и монтажа.'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// TRAINING TYPES - Bulgarian OSH training categories
// ══════════════════════════════════════════════════════════════════════════════

export interface BulgariaTrainingType {
  id: string
  country_code: 'BG'
  name: string
  description: string
  frequency: 'annual' | 'biannual' | 'once' | 'on_demand'
  duration_hours: number
  is_mandatory: boolean
  category: 'SSM' | 'PSI' | 'FIRST_AID' | 'SPECIALIZED'
  legal_reference: string
}

export const bulgariaTrainingTypes: BulgariaTrainingType[] = [
  {
    id: 'bg-training-initial',
    country_code: 'BG',
    name: 'Първоначален инструктаж',
    description: 'Задължителен инструктаж за всички нови работници преди започване на работа. Включва общи правила за безопасност в предприятието.',
    frequency: 'once',
    duration_hours: 4,
    is_mandatory: true,
    category: 'SSM',
    legal_reference: 'ЗЗБУТ, Наредба № 3/2001'
  },
  {
    id: 'bg-training-workplace',
    country_code: 'BG',
    name: 'Инструктаж на работното място',
    description: 'Специфичен инструктаж за конкретното работно място и използваното оборудване.',
    frequency: 'once',
    duration_hours: 2,
    is_mandatory: true,
    category: 'SSM',
    legal_reference: 'ЗЗБУТ, Наредба № 3/2001'
  },
  {
    id: 'bg-training-periodic',
    country_code: 'BG',
    name: 'Периодично обучение по ЗБУТ',
    description: 'Периодично обучение за актуализиране на знанията по безопасност и здраве при работа.',
    frequency: 'annual',
    duration_hours: 6,
    is_mandatory: true,
    category: 'SSM',
    legal_reference: 'ЗЗБУТ чл. 22, Наредба № 3/2001'
  },
  {
    id: 'bg-training-fire-safety',
    country_code: 'BG',
    name: 'Обучение по пожарна безопасност',
    description: 'Задължително обучение за противопожарна защита, използване на пожарогасители и евакуация.',
    frequency: 'annual',
    duration_hours: 2,
    is_mandatory: true,
    category: 'PSI',
    legal_reference: 'Закон за защита при бедствия'
  },
  {
    id: 'bg-training-first-aid',
    country_code: 'BG',
    name: 'Първа долекарска помощ',
    description: 'Обучение за оказване на първа помощ при трудова злополука или спешна медицинска ситуация.',
    frequency: 'biannual',
    duration_hours: 8,
    is_mandatory: false,
    category: 'FIRST_AID',
    legal_reference: 'ЗЗБУТ чл. 16'
  },
  {
    id: 'bg-training-height-work',
    country_code: 'BG',
    name: 'Работа на височина',
    description: 'Специализирано обучение за безопасна работа на височина над 2 метра - предпазни средства, процедури.',
    frequency: 'annual',
    duration_hours: 8,
    is_mandatory: true,
    category: 'SPECIALIZED',
    legal_reference: 'Наредба № 8/2005'
  },
  {
    id: 'bg-training-electrical',
    country_code: 'BG',
    name: 'Работа с електрически инсталации',
    description: 'Обучение за безопасна работа с електрическо оборудване - изисквания за квалификационна група.',
    frequency: 'annual',
    duration_hours: 16,
    is_mandatory: true,
    category: 'SPECIALIZED',
    legal_reference: 'Правилник за устройство на електрическите уредби и мрежи'
  },
  {
    id: 'bg-training-confined-spaces',
    country_code: 'BG',
    name: 'Работа в ограничени пространства',
    description: 'Обучение за работа в затворени помещения с ограничен достъп и вентилация.',
    frequency: 'annual',
    duration_hours: 8,
    is_mandatory: true,
    category: 'SPECIALIZED',
    legal_reference: 'ЗЗБУТ, Наредба № 7/1999'
  },
  {
    id: 'bg-training-hazardous-chemicals',
    country_code: 'BG',
    name: 'Работа с опасни химични вещества',
    description: 'Обучение за безопасно съхранение, манипулиране и използване на опасни химикали.',
    frequency: 'annual',
    duration_hours: 6,
    is_mandatory: true,
    category: 'SPECIALIZED',
    legal_reference: 'ЗЗБУТ, Регламент REACH'
  },
  {
    id: 'bg-training-forklift',
    country_code: 'BG',
    name: 'Управление на мотокар/кран',
    description: 'Обучение и удостоверение за управление на повдигащо-транспортно оборудване.',
    frequency: 'annual',
    duration_hours: 40,
    is_mandatory: true,
    category: 'SPECIALIZED',
    legal_reference: 'Наредба № 7/1999 - Приложение 2'
  },
  {
    id: 'bg-training-manual-handling',
    country_code: 'BG',
    name: 'Ръчно пренасяне на товари',
    description: 'Обучение за правилно и безопасно ръчно пренасяне на тежести за предотвратяване на мускулно-скелетни увреждания.',
    frequency: 'annual',
    duration_hours: 2,
    is_mandatory: false,
    category: 'SSM',
    legal_reference: 'ЗЗБУТ'
  },
  {
    id: 'bg-training-vdu',
    country_code: 'BG',
    name: 'Работа с видеодисплеи',
    description: 'Инструктаж за безопасна работа с компютри - ергономия, почивки, опазване на зрението.',
    frequency: 'once',
    duration_hours: 1,
    is_mandatory: true,
    category: 'SSM',
    legal_reference: 'Наредба № 5/1999'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// MEDICAL EXAMINATION TYPES - Bulgarian medical check categories
// ══════════════════════════════════════════════════════════════════════════════

export interface BulgariaMedicalType {
  id: string
  country_code: 'BG'
  name: string
  description: string
  examination_type: 'predvaritelno' | 'periodichno' | 'pri_vazobnovyavane' | 'izvunredno' | 'zavarshvasht'
  frequency_months: number | null
  is_mandatory: boolean
  legal_reference: string
  applies_to: string
}

export const bulgariaMedicalTypes: BulgariaMedicalType[] = [
  {
    id: 'bg-medical-predvaritelno',
    country_code: 'BG',
    name: 'Предварителен медицински преглед',
    description: 'Задължителен преглед преди назначаване на работа за проверка на здравословното състояние и годността за работа.',
    examination_type: 'predvaritelno',
    frequency_months: null,
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ чл. 18, Наредба № 1/2009',
    applies_to: 'Всички нови работници'
  },
  {
    id: 'bg-medical-periodichno-12',
    country_code: 'BG',
    name: 'Периодичен преглед - годишен',
    description: 'Годишен медицински преглед за работещи, изложени на професионални рискове.',
    examination_type: 'periodichno',
    frequency_months: 12,
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ чл. 18, Наредба № 1/2009',
    applies_to: 'Работници с професионални рискове - шум, вибрации, химикали, прах'
  },
  {
    id: 'bg-medical-periodichno-24',
    country_code: 'BG',
    name: 'Периодичен преглед - на две години',
    description: 'Медицински преглед на всеки 24 месеца за работници с нисък професионален риск.',
    examination_type: 'periodichno',
    frequency_months: 24,
    is_mandatory: true,
    legal_reference: 'Наредба № 1/2009',
    applies_to: 'Работници с нисък професионален риск (административна работа)'
  },
  {
    id: 'bg-medical-periodichno-6',
    country_code: 'BG',
    name: 'Периодичен преглед - шестмесечен',
    description: 'Преглед на всеки 6 месеца за работници в условия с висок риск (канцерогени, радиация).',
    examination_type: 'periodichno',
    frequency_months: 6,
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ чл. 18, Наредба № 1/2009',
    applies_to: 'Работници изложени на азбест, олово, бензен, йонизиращи лъчения'
  },
  {
    id: 'bg-medical-pri-vazobnovyavane',
    country_code: 'BG',
    name: 'Преглед при възобновяване на работа',
    description: 'Медицински преглед при връщане на работа след отсъствие поради болест над 30 дни.',
    examination_type: 'pri_vazobnovyavane',
    frequency_months: null,
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ чл. 18, Наредба № 1/2009',
    applies_to: 'Работници с отсъствие по болест над 30 дни'
  },
  {
    id: 'bg-medical-izvunredno',
    country_code: 'BG',
    name: 'Извънреден медицински преглед',
    description: 'Преглед при съмнение за професионално заболяване или влошаване на здравословното състояние.',
    examination_type: 'izvunredno',
    frequency_months: null,
    is_mandatory: false,
    legal_reference: 'ЗЗБУТ чл. 18, Наредба № 1/2009',
    applies_to: 'При искане на работника или работодателя'
  },
  {
    id: 'bg-medical-zavarshvasht',
    country_code: 'BG',
    name: 'Завършващ медицински преглед',
    description: 'Преглед при прекратяване на трудовото правоотношение за работници с рискови условия.',
    examination_type: 'zavarshvasht',
    frequency_months: null,
    is_mandatory: true,
    legal_reference: 'Наредба № 1/2009',
    applies_to: 'Работници изложени на канцерогени, азбест, радиация при напускане'
  },
  {
    id: 'bg-medical-mladezhi',
    country_code: 'BG',
    name: 'Преглед на младежи под 18 години',
    description: 'Задължителен годишен преглед за работници под 18 години.',
    examination_type: 'periodichno',
    frequency_months: 12,
    is_mandatory: true,
    legal_reference: 'Кодекс на труда чл. 302',
    applies_to: 'Работници под 18 години'
  },
  {
    id: 'bg-medical-night-shift',
    country_code: 'BG',
    name: 'Преглед за нощна работа',
    description: 'Медицински преглед за годност за работа в нощна смяна.',
    examination_type: 'periodichno',
    frequency_months: 12,
    is_mandatory: true,
    legal_reference: 'Кодекс на труда чл. 140',
    applies_to: 'Работници в нощни смени'
  },
  {
    id: 'bg-medical-pregnant',
    country_code: 'BG',
    name: 'Преглед на бременни работнички',
    description: 'Оценка на риска и адаптиране на условията на труд за бременни и кърмачки.',
    examination_type: 'izvunredno',
    frequency_months: null,
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ чл. 17, Кодекс на труда чл. 310',
    applies_to: 'Бременни и кърмещи работнички'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// PENALTIES - Bulgarian OSH fines in EUR
// ══════════════════════════════════════════════════════════════════════════════

export interface BulgariaPenalty {
  id: string
  country_code: 'BG'
  violation_type: string
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
    violation_type: 'Липса на оценка на риска',
    description: 'Неизвършване или неактуализиране на оценката на професионалните рискове.',
    penalty_min_eur: 500,
    penalty_max_eur: 1500,
    legal_reference: 'ЗЗБУТ чл. 58',
    severity: 'critical'
  },
  {
    id: 'bg-penalty-no-osh-service',
    country_code: 'BG',
    violation_type: 'Липса на служба по трудова медицина',
    description: 'Неосигуряване на дейност по трудова медицина в предприятието.',
    penalty_min_eur: 250,
    penalty_max_eur: 750,
    legal_reference: 'ЗЗБУТ чл. 58',
    severity: 'high'
  },
  {
    id: 'bg-penalty-no-training',
    country_code: 'BG',
    violation_type: 'Липса на обучение по ЗБУТ',
    description: 'Допускане на работници без задължително обучение и инструктаж по безопасност.',
    penalty_min_eur: 200,
    penalty_max_eur: 500,
    legal_reference: 'ЗЗБУТ чл. 58',
    severity: 'high'
  },
  {
    id: 'bg-penalty-no-medical-exam',
    country_code: 'BG',
    violation_type: 'Липса на медицински прегледи',
    description: 'Допускане на работници без задължителни предварителни или периодични медицински прегледи.',
    penalty_min_eur: 250,
    penalty_max_eur: 750,
    legal_reference: 'ЗЗБУТ чл. 58',
    severity: 'critical'
  },
  {
    id: 'bg-penalty-no-ppe',
    country_code: 'BG',
    violation_type: 'Неосигуряване на ЛПС',
    description: 'Неосигуряване на лични предпазни средства съобразно оценката на риска.',
    penalty_min_eur: 150,
    penalty_max_eur: 400,
    legal_reference: 'ЗЗБУТ чл. 58',
    severity: 'high'
  },
  {
    id: 'bg-penalty-unsafe-equipment',
    country_code: 'BG',
    violation_type: 'Използване на неизправно оборудване',
    description: 'Използване на работно оборудване, което не отговаря на минималните изисквания за безопасност.',
    penalty_min_eur: 400,
    penalty_max_eur: 1000,
    legal_reference: 'ЗЗБУТ чл. 58',
    severity: 'critical'
  },
  {
    id: 'bg-penalty-no-accident-report',
    country_code: 'BG',
    violation_type: 'Неуведомяване за трудова злополука',
    description: 'Неуведомяване или закъсняло уведомяване на инспекцията по труда при трудова злополука.',
    penalty_min_eur: 500,
    penalty_max_eur: 1500,
    legal_reference: 'ЗЗБУТ чл. 58',
    severity: 'critical'
  },
  {
    id: 'bg-penalty-no-fire-equipment',
    country_code: 'BG',
    violation_type: 'Липса на противопожарни средства',
    description: 'Липса или неизправност на противопожарни средства и системи.',
    penalty_min_eur: 250,
    penalty_max_eur: 750,
    legal_reference: 'Закон за защита при бедствия',
    severity: 'critical'
  },
  {
    id: 'bg-penalty-no-evacuation-plan',
    country_code: 'BG',
    violation_type: 'Липса на план за евакуация',
    description: 'Липса на план за евакуация при пожар или план не е актуализиран и поставен на видно място.',
    penalty_min_eur: 100,
    penalty_max_eur: 300,
    legal_reference: 'Закон за защита при бедствия',
    severity: 'medium'
  },
  {
    id: 'bg-penalty-blocked-exit',
    country_code: 'BG',
    violation_type: 'Блокиране на евакуационни пътища',
    description: 'Препятстване на евакуационните пътища и аварийните изходи.',
    penalty_min_eur: 200,
    penalty_max_eur: 600,
    legal_reference: 'Закон за защита при бедствия',
    severity: 'critical'
  },
  {
    id: 'bg-penalty-missing-documentation',
    country_code: 'BG',
    violation_type: 'Непълна документация по ЗБУТ',
    description: 'Липса или непълна задължителна документация по безопасност и здраве при работа.',
    penalty_min_eur: 100,
    penalty_max_eur: 300,
    legal_reference: 'ЗЗБУТ чл. 58',
    severity: 'medium'
  },
  {
    id: 'bg-penalty-no-safety-signage',
    country_code: 'BG',
    violation_type: 'Липса на предупредителни знаци',
    description: 'Липса или неправилно поставяне на знаци за безопасност и здраве.',
    penalty_min_eur: 75,
    penalty_max_eur: 200,
    legal_reference: 'ЗЗБУТ',
    severity: 'low'
  },
  {
    id: 'bg-penalty-no-work-permit',
    country_code: 'BG',
    violation_type: 'Работа без разрешително',
    description: 'Изпълнение на високорискови дейности (височина, затворени пространства) без писмено разрешително.',
    penalty_min_eur: 300,
    penalty_max_eur: 800,
    legal_reference: 'ЗЗБУТ',
    severity: 'critical'
  },
  {
    id: 'bg-penalty-obstruction-inspection',
    country_code: 'BG',
    violation_type: 'Препятстване на проверка',
    description: 'Отказ за достъп или непредоставяне на документи на инспектора по труда.',
    penalty_min_eur: 400,
    penalty_max_eur: 1200,
    legal_reference: 'ЗЗБУТ чл. 58',
    severity: 'critical'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// HOLIDAYS - Bulgarian national and public holidays
// ══════════════════════════════════════════════════════════════════════════════

export interface BulgariaHoliday {
  id: string
  country_code: 'BG'
  name: string
  date_pattern: string // Format: MM-DD or special marker for movable holidays
  is_public_holiday: boolean
  is_work_free: boolean
  description: string
}

export const bulgariaHolidays: BulgariaHoliday[] = [
  {
    id: 'bg-holiday-new-year',
    country_code: 'BG',
    name: 'Нова година',
    date_pattern: '01-01',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Първи ден на новата година - официален празник.'
  },
  {
    id: 'bg-holiday-liberation-day',
    country_code: 'BG',
    name: 'Ден на Освобождението на България от османско иго',
    date_pattern: '03-03',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Национален празник в памет на Освободителната война от 1878 г.'
  },
  {
    id: 'bg-holiday-good-friday',
    country_code: 'BG',
    name: 'Велики петък',
    date_pattern: 'EASTER-2',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Велики петък - ден преди Православна Великден.'
  },
  {
    id: 'bg-holiday-easter-saturday',
    country_code: 'BG',
    name: 'Велика събота',
    date_pattern: 'EASTER-1',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Велика събота - ден преди Православна Великден.'
  },
  {
    id: 'bg-holiday-easter',
    country_code: 'BG',
    name: 'Великден (Възкресение Христово)',
    date_pattern: 'EASTER',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Православна Великден - най-важният християнски празник.'
  },
  {
    id: 'bg-holiday-easter-monday',
    country_code: 'BG',
    name: 'Велики понеделник',
    date_pattern: 'EASTER+1',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Вторият ден на Великден.'
  },
  {
    id: 'bg-holiday-labour-day',
    country_code: 'BG',
    name: 'Ден на труда',
    date_pattern: '05-01',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Международен ден на труда и на трудещите се.'
  },
  {
    id: 'bg-holiday-st-george-day',
    country_code: 'BG',
    name: 'Гергьовден (Ден на храбростта)',
    date_pattern: '05-06',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ден на Българската армия и на храбростта.'
  },
  {
    id: 'bg-holiday-education-culture-day',
    country_code: 'BG',
    name: 'Ден на българската просвета и култура',
    date_pattern: '05-24',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ден на светите братя Кирил и Методий, на българската азбука и култура.'
  },
  {
    id: 'bg-holiday-unification-day',
    country_code: 'BG',
    name: 'Ден на Съединението',
    date_pattern: '09-06',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ден на Съединението на Княжество България с Източна Румелия от 1885 г.'
  },
  {
    id: 'bg-holiday-independence-day',
    country_code: 'BG',
    name: 'Ден на Независимостта на България',
    date_pattern: '09-22',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ден на провъзгласяването на независимостта на България от 1908 г.'
  },
  {
    id: 'bg-holiday-national-awakening',
    country_code: 'BG',
    name: 'Ден на народните будители',
    date_pattern: '11-01',
    is_public_holiday: true,
    is_work_free: false,
    description: 'Почит към будителите на българския народ. Почивен ден за учебните заведения.'
  },
  {
    id: 'bg-holiday-christmas-eve',
    country_code: 'BG',
    name: 'Бъдни вечер',
    date_pattern: '12-24',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Навечерието на Рождество Христово.'
  },
  {
    id: 'bg-holiday-christmas-1',
    country_code: 'BG',
    name: 'Рождество Христово - първи ден',
    date_pattern: '12-25',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Първи ден на Коледа.'
  },
  {
    id: 'bg-holiday-christmas-2',
    country_code: 'BG',
    name: 'Рождество Христово - втори ден',
    date_pattern: '12-26',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Втори ден на Коледа.'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// DOCUMENT TEMPLATES - Bulgarian OSH document types
// ══════════════════════════════════════════════════════════════════════════════

export interface BulgariaDocumentTemplate {
  id: string
  country_code: 'BG'
  name: string
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
    name: 'Оценка на риска',
    description: 'Задължителен документ за идентифициране и оценяване на професионалните рискове за всяко работно място.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ чл. 16, Наредба РД-07-2/2009',
    template_fields: ['workplace_id', 'job_title', 'identified_risks', 'risk_level', 'probability', 'severity', 'prevention_measures', 'ppe_required', 'responsible_person', 'assessment_date', 'review_date']
  },
  {
    id: 'bg-doc-training-record',
    country_code: 'BG',
    name: 'Протокол за проведено обучение',
    description: 'Документ за проведен инструктаж или обучение по безопасност и здраве при работа.',
    category: 'TRAINING',
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ чл. 22, Наредба № 3/2001',
    template_fields: ['employee_name', 'employee_id', 'job_title', 'training_type', 'training_date', 'duration_hours', 'training_topics', 'trainer_name', 'employee_signature', 'trainer_signature', 'next_training_date']
  },
  {
    id: 'bg-doc-medical-record',
    country_code: 'BG',
    name: 'Здравно удостоверение',
    description: 'Здравно удостоверение за годност за работа, издадено след медицински преглед.',
    category: 'MEDICAL',
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ чл. 18, Наредба № 1/2009',
    template_fields: ['employee_name', 'egn', 'job_title', 'examination_type', 'examination_date', 'result', 'restrictions', 'contraindications', 'next_examination_date', 'doctor_name', 'medical_facility', 'stamp_signature']
  },
  {
    id: 'bg-doc-accident-report',
    country_code: 'BG',
    name: 'Декларация за трудова злополука',
    description: 'Задължителна декларация за уведомяване на инспекцията по труда при трудова злополука.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ чл. 57',
    template_fields: ['victim_name', 'victim_id', 'accident_date', 'accident_time', 'location', 'activity_performed', 'description', 'injury_type', 'body_part', 'witnesses', 'causes', 'prevention_measures', 'employer_signature', 'reporting_date']
  },
  {
    id: 'bg-doc-accident-investigation',
    country_code: 'BG',
    name: 'Протокол за разследване на трудова злополука',
    description: 'Протокол от разследването на трудовата злополука за установяване на причините.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ чл. 57',
    template_fields: ['commission_members', 'victim_info', 'accident_details', 'witness_statements', 'causes_identified', 'responsibilities', 'corrective_actions', 'signatures', 'investigation_date']
  },
  {
    id: 'bg-doc-fire-safety-plan',
    country_code: 'BG',
    name: 'План за пожарна безопасност',
    description: 'План за осигуряване на пожарната безопасност в обекта.',
    category: 'PSI',
    is_mandatory: true,
    legal_reference: 'Закон за защита при бедствия',
    template_fields: ['building_description', 'fire_risk_classification', 'prevention_measures', 'fire_equipment_list', 'evacuation_routes', 'emergency_contacts', 'responsible_persons', 'training_schedule', 'drill_records', 'approval_date']
  },
  {
    id: 'bg-doc-evacuation-plan',
    country_code: 'BG',
    name: 'План за евакуация',
    description: 'Схема с пътища за евакуация, изходи, места за събиране и инструкции при пожар.',
    category: 'PSI',
    is_mandatory: true,
    legal_reference: 'Закон за защита при бедствия',
    template_fields: ['floor_layout', 'evacuation_routes', 'emergency_exits', 'fire_equipment_locations', 'assembly_point', 'emergency_numbers', 'instructions', 'legend', 'approval_date']
  },
  {
    id: 'bg-doc-ppe-register',
    country_code: 'BG',
    name: 'Регистър на ЛПС',
    description: 'Регистър за осигурените и издадени лични предпазни средства на работниците.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ чл. 16',
    template_fields: ['employee_name', 'employee_id', 'job_title', 'ppe_type', 'ppe_standard', 'quantity', 'issue_date', 'lifespan', 'replacement_date', 'employee_signature', 'employer_signature']
  },
  {
    id: 'bg-doc-work-permit',
    country_code: 'BG',
    name: 'Разрешително за работа',
    description: 'Писмено разрешително за извършване на високорискови дейности.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ, Наредба № 7/1999',
    template_fields: ['work_type', 'location', 'work_description', 'start_date', 'end_date', 'workers_list', 'risks_identified', 'safety_measures', 'ppe_required', 'emergency_procedures', 'approver_name', 'approver_signature', 'workers_signatures']
  },
  {
    id: 'bg-doc-emergency-plan',
    country_code: 'BG',
    name: 'План за действие при аварии',
    description: 'План с процедури при аварийни ситуации - пожари, химически инциденти, земетресения.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ чл. 16, Закон за защита при бедствия',
    template_fields: ['emergency_scenarios', 'alarm_procedures', 'evacuation_procedures', 'first_aid_procedures', 'emergency_team', 'external_contacts', 'meeting_point', 'communication_plan', 'last_drill_date']
  },
  {
    id: 'bg-doc-osh-instructions',
    country_code: 'BG',
    name: 'Инструкции за безопасна работа',
    description: 'Писмени инструкции за безопасно изпълнение на работните задачи.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ, Наредба № 7/1999',
    template_fields: ['workplace_equipment', 'job_description', 'preparation_procedures', 'safe_work_procedures', 'ppe_usage', 'prohibited_actions', 'emergency_procedures', 'responsible_person', 'approval_date', 'review_date']
  },
  {
    id: 'bg-doc-annual-report',
    country_code: 'BG',
    name: 'Годишен доклад за дейността по ЗБУТ',
    description: 'Годишен доклад за извършената дейност по здраве и безопасност при работа.',
    category: 'COMPLIANCE',
    is_mandatory: true,
    legal_reference: 'ЗЗБУТ',
    template_fields: ['reporting_period', 'activities_performed', 'risk_assessments', 'training_statistics', 'medical_examinations', 'accidents_incidents', 'inspections', 'improvements_proposed', 'budget_allocated', 'responsible_person', 'submission_date']
  },
  {
    id: 'bg-doc-medical-surveillance',
    country_code: 'BG',
    name: 'Здравна карта на работещия',
    description: 'Лична здравна карта за проследяване на здравословното състояние при експозиция на рискове.',
    category: 'MEDICAL',
    is_mandatory: true,
    legal_reference: 'Наредба № 1/2009',
    template_fields: ['employee_name', 'egn', 'job_title', 'workplace', 'risk_factors', 'exposure_duration', 'exposure_level', 'ppe_used', 'medical_surveillance_frequency', 'doctor_name', 'last_update']
  },
  {
    id: 'bg-doc-fire-register',
    country_code: 'BG',
    name: 'Регистър на противопожарните средства',
    description: 'Регистър за регистрация и проверка на противопожарната техника.',
    category: 'PSI',
    is_mandatory: true,
    legal_reference: 'Закон за защита при бедствия',
    template_fields: ['equipment_type', 'brand_model', 'location', 'serial_number', 'capacity', 'manufacture_date', 'commissioning_date', 'last_inspection', 'next_inspection', 'inspector_name', 'defects', 'status']
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
          description: item.description,
          frequency: item.frequency,
          authority_name: 'Изпълнителна агенция „Главна инспекция по труда"',
          legal_reference: item.legal_reference,
          penalty_min: null,
          penalty_max: null,
          currency: 'EUR',
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

    // 3. Seed Medical Types (as metadata - can be extended to separate table)
    console.log('🏥 Seeding Bulgaria medical types...')
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
          description: item.description,
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
          description: item.description
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
          description: item.description,
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
