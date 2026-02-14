/**
 * Public Holidays Data for SSM Platform
 *
 * Supported countries: RO, BG, HU, DE, PL
 * Year: 2026 (extendable)
 */

export type Country = 'RO' | 'BG' | 'HU' | 'DE' | 'PL';

export type GermanState =
  | 'BW' // Baden-Württemberg
  | 'BY' // Bavaria
  | 'BE' // Berlin
  | 'BB' // Brandenburg
  | 'HB' // Bremen
  | 'HH' // Hamburg
  | 'HE' // Hesse
  | 'MV' // Mecklenburg-Vorpommern
  | 'NI' // Lower Saxony
  | 'NW' // North Rhine-Westphalia
  | 'RP' // Rhineland-Palatinate
  | 'SL' // Saarland
  | 'SN' // Saxony
  | 'ST' // Saxony-Anhalt
  | 'SH' // Schleswig-Holstein
  | 'TH'; // Thuringia

export interface PublicHoliday {
  date: string; // ISO format YYYY-MM-DD
  nameLocal: string;
  nameEnglish: string;
  states?: GermanState[]; // Only for Germany - if undefined, applies to all states
}

/**
 * Public holidays by country for 2026
 */
const holidays2026: Record<Country, PublicHoliday[]> = {
  // Romania - 15 legal holidays
  RO: [
    { date: '2026-01-01', nameLocal: 'Anul Nou', nameEnglish: "New Year's Day" },
    { date: '2026-01-02', nameLocal: 'Anul Nou', nameEnglish: "New Year's Day (Day 2)" },
    {
      date: '2026-01-24',
      nameLocal: 'Ziua Unirii Principatelor Române',
      nameEnglish: 'Unification Day',
    },
    { date: '2026-04-10', nameLocal: 'Vinerea Mare', nameEnglish: 'Good Friday' },
    { date: '2026-04-12', nameLocal: 'Paștele', nameEnglish: 'Easter Sunday' },
    { date: '2026-04-13', nameLocal: 'Lunea Paștelor', nameEnglish: 'Easter Monday' },
    { date: '2026-05-01', nameLocal: 'Ziua Muncii', nameEnglish: 'Labour Day' },
    { date: '2026-06-01', nameLocal: 'Ziua Copilului', nameEnglish: "Children's Day" },
    { date: '2026-05-31', nameLocal: 'Rusaliile', nameEnglish: 'Pentecost' },
    { date: '2026-06-01', nameLocal: 'Lunea Rusaliilor', nameEnglish: 'Whit Monday' },
    {
      date: '2026-08-15',
      nameLocal: 'Adormirea Maicii Domnului',
      nameEnglish: 'Assumption of Mary',
    },
    { date: '2026-11-30', nameLocal: 'Sfântul Andrei', nameEnglish: "St. Andrew's Day" },
    {
      date: '2026-12-01',
      nameLocal: 'Ziua Națională a României',
      nameEnglish: 'National Day of Romania',
    },
    { date: '2026-12-25', nameLocal: 'Crăciunul', nameEnglish: 'Christmas Day' },
    {
      date: '2026-12-26',
      nameLocal: 'A doua zi de Crăciun',
      nameEnglish: 'Second Day of Christmas',
    },
  ],

  // Bulgaria - 14 legal holidays
  BG: [
    { date: '2026-01-01', nameLocal: 'Нова година', nameEnglish: "New Year's Day" },
    { date: '2026-03-03', nameLocal: 'Ден на Освобождението', nameEnglish: 'Liberation Day' },
    { date: '2026-04-10', nameLocal: 'Велики петък', nameEnglish: 'Good Friday' },
    { date: '2026-04-11', nameLocal: 'Велика събота', nameEnglish: 'Holy Saturday' },
    { date: '2026-04-12', nameLocal: 'Великден', nameEnglish: 'Easter Sunday' },
    { date: '2026-04-13', nameLocal: 'Великденски понеделник', nameEnglish: 'Easter Monday' },
    { date: '2026-05-01', nameLocal: 'Ден на труда', nameEnglish: 'Labour Day' },
    { date: '2026-05-06', nameLocal: 'Гергьовден', nameEnglish: "St. George's Day" },
    {
      date: '2026-05-24',
      nameLocal: 'Ден на българската просвета и култура',
      nameEnglish: 'Bulgarian Education and Culture Day',
    },
    { date: '2026-09-06', nameLocal: 'Ден на Съединението', nameEnglish: 'Unification Day' },
    { date: '2026-09-22', nameLocal: 'Ден на Независимостта', nameEnglish: 'Independence Day' },
    { date: '2026-12-24', nameLocal: 'Бъдни вечер', nameEnglish: 'Christmas Eve' },
    { date: '2026-12-25', nameLocal: 'Коледа', nameEnglish: 'Christmas Day' },
    {
      date: '2026-12-26',
      nameLocal: 'Втори ден на Коледа',
      nameEnglish: 'Second Day of Christmas',
    },
  ],

  // Hungary - 11 legal holidays
  HU: [
    { date: '2026-01-01', nameLocal: 'Újév', nameEnglish: "New Year's Day" },
    {
      date: '2026-03-15',
      nameLocal: '1848-as forradalom ünnepe',
      nameEnglish: 'Revolution Day 1848',
    },
    { date: '2026-04-10', nameLocal: 'Nagypéntek', nameEnglish: 'Good Friday' },
    { date: '2026-04-13', nameLocal: 'Húsvéthétfő', nameEnglish: 'Easter Monday' },
    { date: '2026-05-01', nameLocal: 'A munka ünnepe', nameEnglish: 'Labour Day' },
    { date: '2026-06-01', nameLocal: 'Pünkösdhétfő', nameEnglish: 'Whit Monday' },
    { date: '2026-08-20', nameLocal: 'Szent István ünnepe', nameEnglish: "St. Stephen's Day" },
    {
      date: '2026-10-23',
      nameLocal: '1956-os forradalom ünnepe',
      nameEnglish: 'Revolution Day 1956',
    },
    { date: '2026-11-01', nameLocal: 'Mindenszentek', nameEnglish: "All Saints' Day" },
    { date: '2026-12-25', nameLocal: 'Karácsony', nameEnglish: 'Christmas Day' },
    { date: '2026-12-26', nameLocal: 'Karácsony másnapja', nameEnglish: 'Second Day of Christmas' },
  ],

  // Germany - 9 federal holidays + state-specific
  DE: [
    // Federal holidays (all states)
    { date: '2026-01-01', nameLocal: 'Neujahr', nameEnglish: "New Year's Day" },
    { date: '2026-04-10', nameLocal: 'Karfreitag', nameEnglish: 'Good Friday' },
    { date: '2026-04-13', nameLocal: 'Ostermontag', nameEnglish: 'Easter Monday' },
    { date: '2026-05-01', nameLocal: 'Tag der Arbeit', nameEnglish: 'Labour Day' },
    { date: '2026-05-21', nameLocal: 'Christi Himmelfahrt', nameEnglish: 'Ascension Day' },
    { date: '2026-06-01', nameLocal: 'Pfingstmontag', nameEnglish: 'Whit Monday' },
    { date: '2026-10-03', nameLocal: 'Tag der Deutschen Einheit', nameEnglish: 'German Unity Day' },
    { date: '2026-12-25', nameLocal: 'Erster Weihnachtstag', nameEnglish: 'Christmas Day' },
    {
      date: '2026-12-26',
      nameLocal: 'Zweiter Weihnachtstag',
      nameEnglish: 'Second Day of Christmas',
    },

    // State-specific holidays
    {
      date: '2026-01-06',
      nameLocal: 'Heilige Drei Könige',
      nameEnglish: 'Epiphany',
      states: ['BW', 'BY', 'ST'],
    },
    {
      date: '2026-03-08',
      nameLocal: 'Internationaler Frauentag',
      nameEnglish: "International Women's Day",
      states: ['BE', 'MV'],
    },
    {
      date: '2026-06-11',
      nameLocal: 'Fronleichnam',
      nameEnglish: 'Corpus Christi',
      states: ['BW', 'BY', 'HE', 'NW', 'RP', 'SL'],
    },
    {
      date: '2026-08-15',
      nameLocal: 'Mariä Himmelfahrt',
      nameEnglish: 'Assumption of Mary',
      states: ['BY', 'SL'],
    },
    {
      date: '2026-09-20',
      nameLocal: 'Weltkindertag',
      nameEnglish: "World Children's Day",
      states: ['TH'],
    },
    {
      date: '2026-10-31',
      nameLocal: 'Reformationstag',
      nameEnglish: 'Reformation Day',
      states: ['BB', 'HB', 'HH', 'MV', 'NI', 'SN', 'ST', 'SH', 'TH'],
    },
    {
      date: '2026-11-01',
      nameLocal: 'Allerheiligen',
      nameEnglish: "All Saints' Day",
      states: ['BW', 'BY', 'NW', 'RP', 'SL'],
    },
    {
      date: '2026-11-18',
      nameLocal: 'Buß- und Bettag',
      nameEnglish: 'Day of Repentance',
      states: ['SN'],
    },
  ],

  // Poland - 13 legal holidays
  PL: [
    { date: '2026-01-01', nameLocal: 'Nowy Rok', nameEnglish: "New Year's Day" },
    { date: '2026-01-06', nameLocal: 'Trzech Króli', nameEnglish: 'Epiphany' },
    { date: '2026-04-12', nameLocal: 'Wielkanoc', nameEnglish: 'Easter Sunday' },
    { date: '2026-04-13', nameLocal: 'Poniedziałek Wielkanocny', nameEnglish: 'Easter Monday' },
    { date: '2026-05-01', nameLocal: 'Święto Pracy', nameEnglish: 'Labour Day' },
    { date: '2026-05-03', nameLocal: 'Święto Konstytucji 3 Maja', nameEnglish: 'Constitution Day' },
    { date: '2026-05-31', nameLocal: 'Zielone Świątki', nameEnglish: 'Pentecost' },
    { date: '2026-06-11', nameLocal: 'Boże Ciało', nameEnglish: 'Corpus Christi' },
    {
      date: '2026-08-15',
      nameLocal: 'Wniebowzięcie Najświętszej Maryi Panny',
      nameEnglish: 'Assumption of Mary',
    },
    { date: '2026-11-01', nameLocal: 'Wszystkich Świętych', nameEnglish: "All Saints' Day" },
    {
      date: '2026-11-11',
      nameLocal: 'Narodowe Święto Niepodległości',
      nameEnglish: 'Independence Day',
    },
    { date: '2026-12-25', nameLocal: 'Boże Narodzenie', nameEnglish: 'Christmas Day' },
    {
      date: '2026-12-26',
      nameLocal: 'Drugi dzień Bożego Narodzenia',
      nameEnglish: 'Second Day of Christmas',
    },
  ],
};

/**
 * Get all public holidays for a specific country and year
 * @param country Country code (RO, BG, HU, DE, PL)
 * @param year Year (currently only 2026 supported)
 * @param germanState Optional German state for state-specific holidays
 * @returns Array of public holidays
 */
export function getHolidays(
  country: Country,
  year: number = 2026,
  germanState?: GermanState
): PublicHoliday[] {
  if (year !== 2026) {
    throw new Error(`Year ${year} not supported. Only 2026 data is available.`);
  }

  const countryHolidays = holidays2026[country];

  if (!countryHolidays) {
    throw new Error(`Country ${country} not supported.`);
  }

  // For Germany, filter by state if provided
  if (country === 'DE' && germanState) {
    return countryHolidays.filter(
      (holiday) => !holiday.states || holiday.states.includes(germanState)
    );
  }

  // For other countries or Germany without state filter, return all
  return countryHolidays.filter((holiday) => !holiday.states);
}

/**
 * Check if a given date is a public holiday
 * @param date Date to check (Date object or ISO string)
 * @param country Country code
 * @param germanState Optional German state
 * @returns True if the date is a public holiday
 */
export function isHoliday(
  date: Date | string,
  country: Country,
  germanState?: GermanState
): boolean {
  const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date.split('T')[0];

  const year = new Date(dateStr).getFullYear();
  const holidays = getHolidays(country, year, germanState);

  return holidays.some((holiday) => holiday.date === dateStr);
}

/**
 * Check if a date is a weekend (Saturday or Sunday)
 * @param date Date to check
 * @returns True if weekend
 */
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

/**
 * Calculate the number of working days between two dates
 * Excludes weekends and public holidays
 * @param startDate Start date
 * @param endDate End date
 * @param country Country code
 * @param germanState Optional German state
 * @returns Number of working days (inclusive)
 */
export function getWorkingDays(
  startDate: Date | string,
  endDate: Date | string,
  country: Country,
  germanState?: GermanState
): number {
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);

  // Ensure start is before or equal to end
  if (start > end) {
    throw new Error('Start date must be before or equal to end date');
  }

  let workingDays = 0;
  const current = new Date(start);

  while (current <= end) {
    // Check if current date is not a weekend and not a holiday
    if (!isWeekend(current) && !isHoliday(current, country, germanState)) {
      workingDays++;
    }

    // Move to next day
    current.setDate(current.getDate() + 1);
  }

  return workingDays;
}

/**
 * Get the next working day after a given date
 * @param date Starting date
 * @param country Country code
 * @param germanState Optional German state
 * @returns Next working day
 */
export function getNextWorkingDay(
  date: Date | string,
  country: Country,
  germanState?: GermanState
): Date {
  const current = date instanceof Date ? new Date(date) : new Date(date);
  current.setDate(current.getDate() + 1);

  while (isWeekend(current) || isHoliday(current, country, germanState)) {
    current.setDate(current.getDate() + 1);
  }

  return current;
}

/**
 * Get all public holidays in a date range
 * @param startDate Start date
 * @param endDate End date
 * @param country Country code
 * @param germanState Optional German state
 * @returns Array of holidays falling within the range
 */
export function getHolidaysInRange(
  startDate: Date | string,
  endDate: Date | string,
  country: Country,
  germanState?: GermanState
): PublicHoliday[] {
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);
  const year = start.getFullYear();

  const holidays = getHolidays(country, year, germanState);

  return holidays.filter((holiday) => {
    const holidayDate = new Date(holiday.date);
    return holidayDate >= start && holidayDate <= end;
  });
}

/**
 * Format holiday name based on locale
 * @param holiday Holiday object
 * @param locale Locale code (ro, bg, hu, de, pl, en)
 * @returns Formatted holiday name
 */
export function formatHolidayName(holiday: PublicHoliday, locale: string = 'en'): string {
  return locale === 'en' ? holiday.nameEnglish : holiday.nameLocal;
}

export default holidays2026;
