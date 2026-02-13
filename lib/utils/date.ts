/**
 * Date utility functions with multi-locale support
 * Supports RO (dd.mm.yyyy), EN, BG, HU, DE formats
 */

export type SupportedLocale = 'ro' | 'en' | 'bg' | 'hu' | 'de';

/**
 * Format a date according to the specified locale
 * @param date - Date to format (Date object, ISO string, or timestamp)
 * @param locale - Locale code (default: 'ro')
 * @param options - Intl.DateTimeFormatOptions for custom formatting
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  locale: SupportedLocale = 'ro',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  const formatOptions = options || defaultOptions;

  // For Romanian, we want dd.mm.yyyy format
  if (locale === 'ro' && !options) {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}.${month}.${year}`;
  }

  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
}

/**
 * Format a date relative to now (e.g., "2 days ago", "in 3 hours")
 * @param date - Date to format
 * @param locale - Locale code (default: 'ro')
 * @returns Relative time string
 */
export function formatRelative(
  date: Date | string | number,
  locale: SupportedLocale = 'ro'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  const isPast = diffMs < 0;
  const abs = Math.abs;

  // Translations for relative time
  const translations = {
    ro: {
      now: 'acum',
      seconds: (n: number) => isPast ? `acum ${n} ${n === 1 ? 'secundă' : 'secunde'}` : `în ${n} ${n === 1 ? 'secundă' : 'secunde'}`,
      minutes: (n: number) => isPast ? `acum ${n} ${n === 1 ? 'minut' : 'minute'}` : `în ${n} ${n === 1 ? 'minut' : 'minute'}`,
      hours: (n: number) => isPast ? `acum ${n} ${n === 1 ? 'oră' : 'ore'}` : `în ${n} ${n === 1 ? 'oră' : 'ore'}`,
      days: (n: number) => isPast ? `acum ${n} ${n === 1 ? 'zi' : 'zile'}` : `în ${n} ${n === 1 ? 'zi' : 'zile'}`,
      months: (n: number) => isPast ? `acum ${n} ${n === 1 ? 'lună' : 'luni'}` : `în ${n} ${n === 1 ? 'lună' : 'luni'}`,
      years: (n: number) => isPast ? `acum ${n} ${n === 1 ? 'an' : 'ani'}` : `în ${n} ${n === 1 ? 'an' : 'ani'}`,
    },
    en: {
      now: 'just now',
      seconds: (n: number) => isPast ? `${n} ${n === 1 ? 'second' : 'seconds'} ago` : `in ${n} ${n === 1 ? 'second' : 'seconds'}`,
      minutes: (n: number) => isPast ? `${n} ${n === 1 ? 'minute' : 'minutes'} ago` : `in ${n} ${n === 1 ? 'minute' : 'minutes'}`,
      hours: (n: number) => isPast ? `${n} ${n === 1 ? 'hour' : 'hours'} ago` : `in ${n} ${n === 1 ? 'hour' : 'hours'}`,
      days: (n: number) => isPast ? `${n} ${n === 1 ? 'day' : 'days'} ago` : `in ${n} ${n === 1 ? 'day' : 'days'}`,
      months: (n: number) => isPast ? `${n} ${n === 1 ? 'month' : 'months'} ago` : `in ${n} ${n === 1 ? 'month' : 'months'}`,
      years: (n: number) => isPast ? `${n} ${n === 1 ? 'year' : 'years'} ago` : `in ${n} ${n === 1 ? 'year' : 'years'}`,
    },
    bg: {
      now: 'сега',
      seconds: (n: number) => isPast ? `преди ${n} ${n === 1 ? 'секунда' : 'секунди'}` : `след ${n} ${n === 1 ? 'секунда' : 'секунди'}`,
      minutes: (n: number) => isPast ? `преди ${n} ${n === 1 ? 'минута' : 'минути'}` : `след ${n} ${n === 1 ? 'минута' : 'минути'}`,
      hours: (n: number) => isPast ? `преди ${n} ${n === 1 ? 'час' : 'часа'}` : `след ${n} ${n === 1 ? 'час' : 'часа'}`,
      days: (n: number) => isPast ? `преди ${n} ${n === 1 ? 'ден' : 'дни'}` : `след ${n} ${n === 1 ? 'ден' : 'дни'}`,
      months: (n: number) => isPast ? `преди ${n} ${n === 1 ? 'месец' : 'месеца'}` : `след ${n} ${n === 1 ? 'месец' : 'месеца'}`,
      years: (n: number) => isPast ? `преди ${n} ${n === 1 ? 'година' : 'години'}` : `след ${n} ${n === 1 ? 'година' : 'години'}`,
    },
    hu: {
      now: 'most',
      seconds: (n: number) => isPast ? `${n} másodperce` : `${n} másodperc múlva`,
      minutes: (n: number) => isPast ? `${n} perce` : `${n} perc múlva`,
      hours: (n: number) => isPast ? `${n} órája` : `${n} óra múlva`,
      days: (n: number) => isPast ? `${n} napja` : `${n} nap múlva`,
      months: (n: number) => isPast ? `${n} hónapja` : `${n} hónap múlva`,
      years: (n: number) => isPast ? `${n} éve` : `${n} év múlva`,
    },
    de: {
      now: 'jetzt',
      seconds: (n: number) => isPast ? `vor ${n} ${n === 1 ? 'Sekunde' : 'Sekunden'}` : `in ${n} ${n === 1 ? 'Sekunde' : 'Sekunden'}`,
      minutes: (n: number) => isPast ? `vor ${n} ${n === 1 ? 'Minute' : 'Minuten'}` : `in ${n} ${n === 1 ? 'Minute' : 'Minuten'}`,
      hours: (n: number) => isPast ? `vor ${n} ${n === 1 ? 'Stunde' : 'Stunden'}` : `in ${n} ${n === 1 ? 'Stunde' : 'Stunden'}`,
      days: (n: number) => isPast ? `vor ${n} ${n === 1 ? 'Tag' : 'Tagen'}` : `in ${n} ${n === 1 ? 'Tag' : 'Tagen'}`,
      months: (n: number) => isPast ? `vor ${n} ${n === 1 ? 'Monat' : 'Monaten'}` : `in ${n} ${n === 1 ? 'Monat' : 'Monaten'}`,
      years: (n: number) => isPast ? `vor ${n} ${n === 1 ? 'Jahr' : 'Jahren'}` : `in ${n} ${n === 1 ? 'Jahr' : 'Jahren'}`,
    },
  };

  const t = translations[locale];

  if (abs(diffSeconds) < 30) return t.now;
  if (abs(diffMinutes) < 1) return t.seconds(abs(diffSeconds));
  if (abs(diffHours) < 1) return t.minutes(abs(diffMinutes));
  if (abs(diffDays) < 1) return t.hours(abs(diffHours));
  if (abs(diffMonths) < 1) return t.days(abs(diffDays));
  if (abs(diffYears) < 1) return t.months(abs(diffMonths));
  return t.years(abs(diffYears));
}

/**
 * Check if a date has expired (is in the past)
 * @param date - Date to check
 * @returns true if date is in the past
 */
export function isExpired(date: Date | string | number): boolean {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) {
    return false;
  }

  return dateObj.getTime() < Date.now();
}

/**
 * Calculate the number of days until a date
 * @param date - Target date
 * @returns Number of days (negative if in the past)
 */
export function daysUntil(date: Date | string | number): number {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) {
    return 0;
  }

  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date is expiring soon
 * @param date - Date to check
 * @param days - Number of days threshold (default: 30)
 * @returns true if date is within the threshold and not expired
 */
export function isExpiringSoon(
  date: Date | string | number,
  days: number = 30
): boolean {
  const daysLeft = daysUntil(date);
  return daysLeft > 0 && daysLeft <= days;
}

/**
 * Get the localized month name
 * @param month - Month number (1-12)
 * @param locale - Locale code (default: 'ro')
 * @param format - 'long' or 'short' (default: 'long')
 * @returns Localized month name
 */
export function getMonthName(
  month: number,
  locale: SupportedLocale = 'ro',
  format: 'long' | 'short' = 'long'
): string {
  if (month < 1 || month > 12) {
    return 'Invalid Month';
  }

  const date = new Date(2000, month - 1, 1);
  return new Intl.DateTimeFormat(locale, { month: format }).format(date);
}

/**
 * Format a date range
 * @param start - Start date
 * @param end - End date
 * @param locale - Locale code (default: 'ro')
 * @returns Formatted date range string
 */
export function formatDateRange(
  start: Date | string | number,
  end: Date | string | number,
  locale: SupportedLocale = 'ro'
): string {
  const startObj = typeof start === 'string' || typeof start === 'number'
    ? new Date(start)
    : start;
  const endObj = typeof end === 'string' || typeof end === 'number'
    ? new Date(end)
    : end;

  if (isNaN(startObj.getTime()) || isNaN(endObj.getTime())) {
    return 'Invalid Date Range';
  }

  const startFormatted = formatDate(startObj, locale);
  const endFormatted = formatDate(endObj, locale);

  // Check if same day
  if (
    startObj.getDate() === endObj.getDate() &&
    startObj.getMonth() === endObj.getMonth() &&
    startObj.getFullYear() === endObj.getFullYear()
  ) {
    return startFormatted;
  }

  // Check if same month and year
  if (
    startObj.getMonth() === endObj.getMonth() &&
    startObj.getFullYear() === endObj.getFullYear()
  ) {
    if (locale === 'ro') {
      const startDay = String(startObj.getDate()).padStart(2, '0');
      const endDay = String(endObj.getDate()).padStart(2, '0');
      const month = String(endObj.getMonth() + 1).padStart(2, '0');
      const year = endObj.getFullYear();
      return `${startDay}-${endDay}.${month}.${year}`;
    }
  }

  const separator = locale === 'ro' ? ' - ' : ' - ';
  return `${startFormatted}${separator}${endFormatted}`;
}

/**
 * Get all month names for a locale
 * @param locale - Locale code (default: 'ro')
 * @param format - 'long' or 'short' (default: 'long')
 * @returns Array of month names
 */
export function getAllMonthNames(
  locale: SupportedLocale = 'ro',
  format: 'long' | 'short' = 'long'
): string[] {
  return Array.from({ length: 12 }, (_, i) => getMonthName(i + 1, locale, format));
}

/**
 * Parse a Romanian date string (dd.mm.yyyy) to Date object
 * @param dateStr - Date string in dd.mm.yyyy format
 * @returns Date object or null if invalid
 */
export function parseRomanianDate(dateStr: string): Date | null {
  const match = dateStr.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  // Validate the date is valid
  if (
    date.getDate() !== Number(day) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getFullYear() !== Number(year)
  ) {
    return null;
  }

  return date;
}

/**
 * Add days to a date
 * @param date - Starting date
 * @param days - Number of days to add (can be negative)
 * @returns New date
 */
export function addDays(date: Date | string | number, days: number): Date {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : new Date(date);

  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
}

/**
 * Add months to a date
 * @param date - Starting date
 * @param months - Number of months to add (can be negative)
 * @returns New date
 */
export function addMonths(date: Date | string | number, months: number): Date {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : new Date(date);

  dateObj.setMonth(dateObj.getMonth() + months);
  return dateObj;
}

/**
 * Add years to a date
 * @param date - Starting date
 * @param years - Number of years to add (can be negative)
 * @returns New date
 */
export function addYears(date: Date | string | number, years: number): Date {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : new Date(date);

  dateObj.setFullYear(dateObj.getFullYear() + years);
  return dateObj;
}
