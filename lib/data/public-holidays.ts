/**
 * Public Holidays Data for 2025-2026
 * Countries: Romania, Bulgaria, Hungary, Germany, Poland
 */

export interface PublicHoliday {
  date: string; // ISO format: YYYY-MM-DD
  name: string; // English name
  nameLocal: string; // Local language name
  country: string; // Country code: RO, BG, HU, DE, PL
  isNational: boolean; // National holiday flag
}

/**
 * Romania - 15 public holidays
 */
const romaniaHolidays: PublicHoliday[] = [
  // 2025
  { date: '2025-01-01', name: 'New Year\'s Day', nameLocal: 'Anul Nou', country: 'RO', isNational: true },
  { date: '2025-01-02', name: 'Day after New Year', nameLocal: 'Anul Nou', country: 'RO', isNational: true },
  { date: '2025-01-24', name: 'Unification Day', nameLocal: 'Ziua Unirii Principatelor Române', country: 'RO', isNational: true },
  { date: '2025-04-18', name: 'Orthodox Good Friday', nameLocal: 'Vinerea Mare', country: 'RO', isNational: true },
  { date: '2025-04-20', name: 'Orthodox Easter', nameLocal: 'Paștele', country: 'RO', isNational: true },
  { date: '2025-04-21', name: 'Orthodox Easter Monday', nameLocal: 'Lunea Paștelor', country: 'RO', isNational: true },
  { date: '2025-05-01', name: 'Labour Day', nameLocal: 'Ziua Muncii', country: 'RO', isNational: true },
  { date: '2025-06-01', name: 'Children\'s Day', nameLocal: 'Ziua Copilului', country: 'RO', isNational: true },
  { date: '2025-06-08', name: 'Orthodox Pentecost', nameLocal: 'Rusaliile', country: 'RO', isNational: true },
  { date: '2025-06-09', name: 'Orthodox Pentecost Monday', nameLocal: 'Lunea Rusaliilor', country: 'RO', isNational: true },
  { date: '2025-08-15', name: 'Assumption of Mary', nameLocal: 'Adormirea Maicii Domnului', country: 'RO', isNational: true },
  { date: '2025-11-30', name: 'St. Andrew\'s Day', nameLocal: 'Sfântul Andrei', country: 'RO', isNational: true },
  { date: '2025-12-01', name: 'National Day', nameLocal: 'Ziua Națională a României', country: 'RO', isNational: true },
  { date: '2025-12-25', name: 'Christmas Day', nameLocal: 'Crăciunul', country: 'RO', isNational: true },
  { date: '2025-12-26', name: 'Second Day of Christmas', nameLocal: 'A doua zi de Crăciun', country: 'RO', isNational: true },

  // 2026
  { date: '2026-01-01', name: 'New Year\'s Day', nameLocal: 'Anul Nou', country: 'RO', isNational: true },
  { date: '2026-01-02', name: 'Day after New Year', nameLocal: 'Anul Nou', country: 'RO', isNational: true },
  { date: '2026-01-24', name: 'Unification Day', nameLocal: 'Ziua Unirii Principatelor Române', country: 'RO', isNational: true },
  { date: '2026-04-10', name: 'Orthodox Good Friday', nameLocal: 'Vinerea Mare', country: 'RO', isNational: true },
  { date: '2026-04-12', name: 'Orthodox Easter', nameLocal: 'Paștele', country: 'RO', isNational: true },
  { date: '2026-04-13', name: 'Orthodox Easter Monday', nameLocal: 'Lunea Paștelor', country: 'RO', isNational: true },
  { date: '2026-05-01', name: 'Labour Day', nameLocal: 'Ziua Muncii', country: 'RO', isNational: true },
  { date: '2026-06-01', name: 'Children\'s Day', nameLocal: 'Ziua Copilului', country: 'RO', isNational: true },
  { date: '2026-05-31', name: 'Orthodox Pentecost', nameLocal: 'Rusaliile', country: 'RO', isNational: true },
  { date: '2026-06-01', name: 'Orthodox Pentecost Monday', nameLocal: 'Lunea Rusaliilor', country: 'RO', isNational: true },
  { date: '2026-08-15', name: 'Assumption of Mary', nameLocal: 'Adormirea Maicii Domnului', country: 'RO', isNational: true },
  { date: '2026-11-30', name: 'St. Andrew\'s Day', nameLocal: 'Sfântul Andrei', country: 'RO', isNational: true },
  { date: '2026-12-01', name: 'National Day', nameLocal: 'Ziua Națională a României', country: 'RO', isNational: true },
  { date: '2026-12-25', name: 'Christmas Day', nameLocal: 'Crăciunul', country: 'RO', isNational: true },
  { date: '2026-12-26', name: 'Second Day of Christmas', nameLocal: 'A doua zi de Crăciun', country: 'RO', isNational: true },
];

/**
 * Bulgaria - 14 public holidays
 */
const bulgariaHolidays: PublicHoliday[] = [
  // 2025
  { date: '2025-01-01', name: 'New Year\'s Day', nameLocal: 'Нова година', country: 'BG', isNational: true },
  { date: '2025-03-03', name: 'Liberation Day', nameLocal: 'Ден на Освобождението', country: 'BG', isNational: true },
  { date: '2025-04-18', name: 'Orthodox Good Friday', nameLocal: 'Велики петък', country: 'BG', isNational: true },
  { date: '2025-04-19', name: 'Orthodox Holy Saturday', nameLocal: 'Велика събота', country: 'BG', isNational: true },
  { date: '2025-04-20', name: 'Orthodox Easter', nameLocal: 'Великден', country: 'BG', isNational: true },
  { date: '2025-04-21', name: 'Orthodox Easter Monday', nameLocal: 'Велики понеделник', country: 'BG', isNational: true },
  { date: '2025-05-01', name: 'Labour Day', nameLocal: 'Ден на труда', country: 'BG', isNational: true },
  { date: '2025-05-06', name: 'St. George\'s Day', nameLocal: 'Гергьовден', country: 'BG', isNational: true },
  { date: '2025-05-24', name: 'Education and Culture Day', nameLocal: 'Ден на българската просвета и култура', country: 'BG', isNational: true },
  { date: '2025-09-06', name: 'Unification Day', nameLocal: 'Ден на Съединението', country: 'BG', isNational: true },
  { date: '2025-09-22', name: 'Independence Day', nameLocal: 'Ден на Независимостта', country: 'BG', isNational: true },
  { date: '2025-12-24', name: 'Christmas Eve', nameLocal: 'Бъдни вечер', country: 'BG', isNational: true },
  { date: '2025-12-25', name: 'Christmas Day', nameLocal: 'Коледа', country: 'BG', isNational: true },
  { date: '2025-12-26', name: 'Second Day of Christmas', nameLocal: 'Втори ден Коледа', country: 'BG', isNational: true },

  // 2026
  { date: '2026-01-01', name: 'New Year\'s Day', nameLocal: 'Нова година', country: 'BG', isNational: true },
  { date: '2026-03-03', name: 'Liberation Day', nameLocal: 'Ден на Освобождението', country: 'BG', isNational: true },
  { date: '2026-04-10', name: 'Orthodox Good Friday', nameLocal: 'Велики петък', country: 'BG', isNational: true },
  { date: '2026-04-11', name: 'Orthodox Holy Saturday', nameLocal: 'Велика събота', country: 'BG', isNational: true },
  { date: '2026-04-12', name: 'Orthodox Easter', nameLocal: 'Великден', country: 'BG', isNational: true },
  { date: '2026-04-13', name: 'Orthodox Easter Monday', nameLocal: 'Велики понеделник', country: 'BG', isNational: true },
  { date: '2026-05-01', name: 'Labour Day', nameLocal: 'Ден на труда', country: 'BG', isNational: true },
  { date: '2026-05-06', name: 'St. George\'s Day', nameLocal: 'Гергьовден', country: 'BG', isNational: true },
  { date: '2026-05-24', name: 'Education and Culture Day', nameLocal: 'Ден на българската просвета и култура', country: 'BG', isNational: true },
  { date: '2026-09-06', name: 'Unification Day', nameLocal: 'Ден на Съединението', country: 'BG', isNational: true },
  { date: '2026-09-22', name: 'Independence Day', nameLocal: 'Ден на Независимостта', country: 'BG', isNational: true },
  { date: '2026-12-24', name: 'Christmas Eve', nameLocal: 'Бъдни вечер', country: 'BG', isNational: true },
  { date: '2026-12-25', name: 'Christmas Day', nameLocal: 'Коледа', country: 'BG', isNational: true },
  { date: '2026-12-26', name: 'Second Day of Christmas', nameLocal: 'Втори ден Коледа', country: 'BG', isNational: true },
];

/**
 * Hungary - 11 public holidays
 */
const hungaryHolidays: PublicHoliday[] = [
  // 2025
  { date: '2025-01-01', name: 'New Year\'s Day', nameLocal: 'Újév', country: 'HU', isNational: true },
  { date: '2025-03-15', name: 'National Day', nameLocal: 'Nemzeti ünnep', country: 'HU', isNational: true },
  { date: '2025-04-18', name: 'Good Friday', nameLocal: 'Nagypéntek', country: 'HU', isNational: true },
  { date: '2025-04-21', name: 'Easter Monday', nameLocal: 'Húsvét hétfő', country: 'HU', isNational: true },
  { date: '2025-05-01', name: 'Labour Day', nameLocal: 'A munka ünnepe', country: 'HU', isNational: true },
  { date: '2025-06-09', name: 'Whit Monday', nameLocal: 'Pünkösd hétfő', country: 'HU', isNational: true },
  { date: '2025-08-20', name: 'St. Stephen\'s Day', nameLocal: 'Szent István ünnepe', country: 'HU', isNational: true },
  { date: '2025-10-23', name: 'National Day', nameLocal: 'Nemzeti ünnep', country: 'HU', isNational: true },
  { date: '2025-11-01', name: 'All Saints\' Day', nameLocal: 'Mindenszentek', country: 'HU', isNational: true },
  { date: '2025-12-25', name: 'Christmas Day', nameLocal: 'Karácsony', country: 'HU', isNational: true },
  { date: '2025-12-26', name: 'Second Day of Christmas', nameLocal: 'Karácsony másnapja', country: 'HU', isNational: true },

  // 2026
  { date: '2026-01-01', name: 'New Year\'s Day', nameLocal: 'Újév', country: 'HU', isNational: true },
  { date: '2026-03-15', name: 'National Day', nameLocal: 'Nemzeti ünnep', country: 'HU', isNational: true },
  { date: '2026-04-03', name: 'Good Friday', nameLocal: 'Nagypéntek', country: 'HU', isNational: true },
  { date: '2026-04-06', name: 'Easter Monday', nameLocal: 'Húsvét hétfő', country: 'HU', isNational: true },
  { date: '2026-05-01', name: 'Labour Day', nameLocal: 'A munka ünnepe', country: 'HU', isNational: true },
  { date: '2026-05-25', name: 'Whit Monday', nameLocal: 'Pünkösd hétfő', country: 'HU', isNational: true },
  { date: '2026-08-20', name: 'St. Stephen\'s Day', nameLocal: 'Szent István ünnepe', country: 'HU', isNational: true },
  { date: '2026-10-23', name: 'National Day', nameLocal: 'Nemzeti ünnep', country: 'HU', isNational: true },
  { date: '2026-11-01', name: 'All Saints\' Day', nameLocal: 'Mindenszentek', country: 'HU', isNational: true },
  { date: '2026-12-25', name: 'Christmas Day', nameLocal: 'Karácsony', country: 'HU', isNational: true },
  { date: '2026-12-26', name: 'Second Day of Christmas', nameLocal: 'Karácsony másnapja', country: 'HU', isNational: true },
];

/**
 * Germany - 9 federal holidays + Bayern (Bavaria) regional
 */
const germanyHolidays: PublicHoliday[] = [
  // 2025 - Federal
  { date: '2025-01-01', name: 'New Year\'s Day', nameLocal: 'Neujahr', country: 'DE', isNational: true },
  { date: '2025-04-18', name: 'Good Friday', nameLocal: 'Karfreitag', country: 'DE', isNational: true },
  { date: '2025-04-21', name: 'Easter Monday', nameLocal: 'Ostermontag', country: 'DE', isNational: true },
  { date: '2025-05-01', name: 'Labour Day', nameLocal: 'Tag der Arbeit', country: 'DE', isNational: true },
  { date: '2025-05-29', name: 'Ascension Day', nameLocal: 'Christi Himmelfahrt', country: 'DE', isNational: true },
  { date: '2025-06-09', name: 'Whit Monday', nameLocal: 'Pfingstmontag', country: 'DE', isNational: true },
  { date: '2025-10-03', name: 'German Unity Day', nameLocal: 'Tag der Deutschen Einheit', country: 'DE', isNational: true },
  { date: '2025-12-25', name: 'Christmas Day', nameLocal: 'Weihnachten', country: 'DE', isNational: true },
  { date: '2025-12-26', name: 'Second Day of Christmas', nameLocal: 'Zweiter Weihnachtstag', country: 'DE', isNational: true },

  // 2025 - Bayern (Bavaria) regional
  { date: '2025-01-06', name: 'Epiphany', nameLocal: 'Heilige Drei Könige', country: 'DE', isNational: false },
  { date: '2025-06-19', name: 'Corpus Christi', nameLocal: 'Fronleichnam', country: 'DE', isNational: false },
  { date: '2025-08-15', name: 'Assumption of Mary', nameLocal: 'Mariä Himmelfahrt', country: 'DE', isNational: false },
  { date: '2025-11-01', name: 'All Saints\' Day', nameLocal: 'Allerheiligen', country: 'DE', isNational: false },

  // 2026 - Federal
  { date: '2026-01-01', name: 'New Year\'s Day', nameLocal: 'Neujahr', country: 'DE', isNational: true },
  { date: '2026-04-03', name: 'Good Friday', nameLocal: 'Karfreitag', country: 'DE', isNational: true },
  { date: '2026-04-06', name: 'Easter Monday', nameLocal: 'Ostermontag', country: 'DE', isNational: true },
  { date: '2026-05-01', name: 'Labour Day', nameLocal: 'Tag der Arbeit', country: 'DE', isNational: true },
  { date: '2026-05-14', name: 'Ascension Day', nameLocal: 'Christi Himmelfahrt', country: 'DE', isNational: true },
  { date: '2026-05-25', name: 'Whit Monday', nameLocal: 'Pfingstmontag', country: 'DE', isNational: true },
  { date: '2026-10-03', name: 'German Unity Day', nameLocal: 'Tag der Deutschen Einheit', country: 'DE', isNational: true },
  { date: '2026-12-25', name: 'Christmas Day', nameLocal: 'Weihnachten', country: 'DE', isNational: true },
  { date: '2026-12-26', name: 'Second Day of Christmas', nameLocal: 'Zweiter Weihnachtstag', country: 'DE', isNational: true },

  // 2026 - Bayern (Bavaria) regional
  { date: '2026-01-06', name: 'Epiphany', nameLocal: 'Heilige Drei Könige', country: 'DE', isNational: false },
  { date: '2026-06-04', name: 'Corpus Christi', nameLocal: 'Fronleichnam', country: 'DE', isNational: false },
  { date: '2026-08-15', name: 'Assumption of Mary', nameLocal: 'Mariä Himmelfahrt', country: 'DE', isNational: false },
  { date: '2026-11-01', name: 'All Saints\' Day', nameLocal: 'Allerheiligen', country: 'DE', isNational: false },
];

/**
 * Poland - 13 public holidays
 */
const polandHolidays: PublicHoliday[] = [
  // 2025
  { date: '2025-01-01', name: 'New Year\'s Day', nameLocal: 'Nowy Rok', country: 'PL', isNational: true },
  { date: '2025-01-06', name: 'Epiphany', nameLocal: 'Święto Trzech Króli', country: 'PL', isNational: true },
  { date: '2025-04-20', name: 'Easter Sunday', nameLocal: 'Wielkanoc', country: 'PL', isNational: true },
  { date: '2025-04-21', name: 'Easter Monday', nameLocal: 'Poniedziałek Wielkanocny', country: 'PL', isNational: true },
  { date: '2025-05-01', name: 'Labour Day', nameLocal: 'Święto Pracy', country: 'PL', isNational: true },
  { date: '2025-05-03', name: 'Constitution Day', nameLocal: 'Święto Konstytucji 3 Maja', country: 'PL', isNational: true },
  { date: '2025-06-08', name: 'Pentecost', nameLocal: 'Zielone Świątki', country: 'PL', isNational: true },
  { date: '2025-06-19', name: 'Corpus Christi', nameLocal: 'Boże Ciało', country: 'PL', isNational: true },
  { date: '2025-08-15', name: 'Assumption of Mary', nameLocal: 'Wniebowzięcie Najświętszej Maryi Panny', country: 'PL', isNational: true },
  { date: '2025-11-01', name: 'All Saints\' Day', nameLocal: 'Wszystkich Świętych', country: 'PL', isNational: true },
  { date: '2025-11-11', name: 'Independence Day', nameLocal: 'Narodowe Święto Niepodległości', country: 'PL', isNational: true },
  { date: '2025-12-25', name: 'Christmas Day', nameLocal: 'Boże Narodzenie', country: 'PL', isNational: true },
  { date: '2025-12-26', name: 'Second Day of Christmas', nameLocal: 'Drugi dzień Bożego Narodzenia', country: 'PL', isNational: true },

  // 2026
  { date: '2026-01-01', name: 'New Year\'s Day', nameLocal: 'Nowy Rok', country: 'PL', isNational: true },
  { date: '2026-01-06', name: 'Epiphany', nameLocal: 'Święto Trzech Króli', country: 'PL', isNational: true },
  { date: '2026-04-05', name: 'Easter Sunday', nameLocal: 'Wielkanoc', country: 'PL', isNational: true },
  { date: '2026-04-06', name: 'Easter Monday', nameLocal: 'Poniedziałek Wielkanocny', country: 'PL', isNational: true },
  { date: '2026-05-01', name: 'Labour Day', nameLocal: 'Święto Pracy', country: 'PL', isNational: true },
  { date: '2026-05-03', name: 'Constitution Day', nameLocal: 'Święto Konstytucji 3 Maja', country: 'PL', isNational: true },
  { date: '2026-05-24', name: 'Pentecost', nameLocal: 'Zielone Świątki', country: 'PL', isNational: true },
  { date: '2026-06-04', name: 'Corpus Christi', nameLocal: 'Boże Ciało', country: 'PL', isNational: true },
  { date: '2026-08-15', name: 'Assumption of Mary', nameLocal: 'Wniebowzięcie Najświętszej Maryi Panny', country: 'PL', isNational: true },
  { date: '2026-11-01', name: 'All Saints\' Day', nameLocal: 'Wszystkich Świętych', country: 'PL', isNational: true },
  { date: '2026-11-11', name: 'Independence Day', nameLocal: 'Narodowe Święto Niepodległości', country: 'PL', isNational: true },
  { date: '2026-12-25', name: 'Christmas Day', nameLocal: 'Boże Narodzenie', country: 'PL', isNational: true },
  { date: '2026-12-26', name: 'Second Day of Christmas', nameLocal: 'Drugi dzień Bożego Narodzenia', country: 'PL', isNational: true },
];

/**
 * All holidays combined
 */
export const publicHolidays: PublicHoliday[] = [
  ...romaniaHolidays,
  ...bulgariaHolidays,
  ...hungaryHolidays,
  ...germanyHolidays,
  ...polandHolidays,
];

/**
 * Get holidays by country
 */
export const getHolidaysByCountry = (country: string): PublicHoliday[] => {
  return publicHolidays.filter(h => h.country === country);
};

/**
 * Get holidays by year
 */
export const getHolidaysByYear = (year: number, country?: string): PublicHoliday[] => {
  let holidays = publicHolidays.filter(h => h.date.startsWith(year.toString()));
  if (country) {
    holidays = holidays.filter(h => h.country === country);
  }
  return holidays;
};

/**
 * Check if a date is a public holiday
 * @param date - Date string in ISO format (YYYY-MM-DD) or Date object
 * @param country - Country code (RO, BG, HU, DE, PL)
 * @param nationalOnly - Check only national holidays (default: true)
 * @returns true if the date is a public holiday
 */
export const isPublicHoliday = (
  date: string | Date,
  country: string,
  nationalOnly: boolean = true
): boolean => {
  const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];

  return publicHolidays.some(
    h => h.date === dateStr &&
         h.country === country &&
         (!nationalOnly || h.isNational)
  );
};

/**
 * Get holiday info for a specific date
 * @param date - Date string in ISO format (YYYY-MM-DD) or Date object
 * @param country - Country code (RO, BG, HU, DE, PL)
 * @returns Holiday object or null if not a holiday
 */
export const getHolidayInfo = (
  date: string | Date,
  country: string
): PublicHoliday | null => {
  const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];

  return publicHolidays.find(
    h => h.date === dateStr && h.country === country
  ) || null;
};

/**
 * Get all holidays for a date range
 * @param startDate - Start date in ISO format (YYYY-MM-DD) or Date object
 * @param endDate - End date in ISO format (YYYY-MM-DD) or Date object
 * @param country - Optional country filter
 * @returns Array of holidays in the date range
 */
export const getHolidaysInRange = (
  startDate: string | Date,
  endDate: string | Date,
  country?: string
): PublicHoliday[] => {
  const startStr = typeof startDate === 'string' ? startDate : startDate.toISOString().split('T')[0];
  const endStr = typeof endDate === 'string' ? endDate : endDate.toISOString().split('T')[0];

  let holidays = publicHolidays.filter(h => h.date >= startStr && h.date <= endStr);

  if (country) {
    holidays = holidays.filter(h => h.country === country);
  }

  return holidays.sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Supported countries
 */
export const supportedCountries = ['RO', 'BG', 'HU', 'DE', 'PL'] as const;
export type SupportedCountry = typeof supportedCountries[number];
