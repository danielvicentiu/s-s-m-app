/**
 * Date formatting utilities with multi-locale support
 * Supports: RO, BG, HU, DE, PL, EN
 */

export type SupportedLocale = 'ro' | 'bg' | 'hu' | 'de' | 'pl' | 'en';
export type DateFormat = 'short' | 'medium' | 'long' | 'full';

/**
 * Locale configuration for date-fns
 * Maps our locale codes to date-fns locale objects
 */
const localeMap: Record<SupportedLocale, string> = {
  ro: 'ro',
  bg: 'bg',
  hu: 'hu',
  de: 'de',
  pl: 'pl',
  en: 'en-US',
};

/**
 * Format options for different formats
 */
const formatOptions: Record<DateFormat, Intl.DateTimeFormatOptions> = {
  short: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },
  medium: {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  },
  long: {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
  full: {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
};

/**
 * Relative time translations
 */
const relativeTimeTranslations = {
  ro: {
    today: 'astăzi',
    yesterday: 'ieri',
    tomorrow: 'mâine',
    daysAgo: (n: number) => `acum ${n} ${n === 1 ? 'zi' : 'zile'}`,
    daysFromNow: (n: number) => `în ${n} ${n === 1 ? 'zi' : 'zile'}`,
    weeksAgo: (n: number) => `acum ${n} ${n === 1 ? 'săptămână' : 'săptămâni'}`,
    weeksFromNow: (n: number) => `în ${n} ${n === 1 ? 'săptămână' : 'săptămâni'}`,
    monthsAgo: (n: number) => `acum ${n} ${n === 1 ? 'lună' : 'luni'}`,
    monthsFromNow: (n: number) => `în ${n} ${n === 1 ? 'lună' : 'luni'}`,
    yearsAgo: (n: number) => `acum ${n} ${n === 1 ? 'an' : 'ani'}`,
    yearsFromNow: (n: number) => `în ${n} ${n === 1 ? 'an' : 'ani'}`,
  },
  bg: {
    today: 'днес',
    yesterday: 'вчера',
    tomorrow: 'утре',
    daysAgo: (n: number) => `преди ${n} ${n === 1 ? 'ден' : 'дни'}`,
    daysFromNow: (n: number) => `след ${n} ${n === 1 ? 'ден' : 'дни'}`,
    weeksAgo: (n: number) => `преди ${n} ${n === 1 ? 'седмица' : 'седмици'}`,
    weeksFromNow: (n: number) => `след ${n} ${n === 1 ? 'седмица' : 'седмици'}`,
    monthsAgo: (n: number) => `преди ${n} ${n === 1 ? 'месец' : 'месеца'}`,
    monthsFromNow: (n: number) => `след ${n} ${n === 1 ? 'месец' : 'месеца'}`,
    yearsAgo: (n: number) => `преди ${n} ${n === 1 ? 'година' : 'години'}`,
    yearsFromNow: (n: number) => `след ${n} ${n === 1 ? 'година' : 'години'}`,
  },
  hu: {
    today: 'ma',
    yesterday: 'tegnap',
    tomorrow: 'holnap',
    daysAgo: (n: number) => `${n} ${n === 1 ? 'napja' : 'napja'}`,
    daysFromNow: (n: number) => `${n} nap múlva`,
    weeksAgo: (n: number) => `${n} ${n === 1 ? 'hete' : 'hete'}`,
    weeksFromNow: (n: number) => `${n} hét múlva`,
    monthsAgo: (n: number) => `${n} ${n === 1 ? 'hónapja' : 'hónapja'}`,
    monthsFromNow: (n: number) => `${n} hónap múlva`,
    yearsAgo: (n: number) => `${n} ${n === 1 ? 'éve' : 'éve'}`,
    yearsFromNow: (n: number) => `${n} év múlva`,
  },
  de: {
    today: 'heute',
    yesterday: 'gestern',
    tomorrow: 'morgen',
    daysAgo: (n: number) => `vor ${n} ${n === 1 ? 'Tag' : 'Tagen'}`,
    daysFromNow: (n: number) => `in ${n} ${n === 1 ? 'Tag' : 'Tagen'}`,
    weeksAgo: (n: number) => `vor ${n} ${n === 1 ? 'Woche' : 'Wochen'}`,
    weeksFromNow: (n: number) => `in ${n} ${n === 1 ? 'Woche' : 'Wochen'}`,
    monthsAgo: (n: number) => `vor ${n} ${n === 1 ? 'Monat' : 'Monaten'}`,
    monthsFromNow: (n: number) => `in ${n} ${n === 1 ? 'Monat' : 'Monaten'}`,
    yearsAgo: (n: number) => `vor ${n} ${n === 1 ? 'Jahr' : 'Jahren'}`,
    yearsFromNow: (n: number) => `in ${n} ${n === 1 ? 'Jahr' : 'Jahren'}`,
  },
  pl: {
    today: 'dzisiaj',
    yesterday: 'wczoraj',
    tomorrow: 'jutro',
    daysAgo: (n: number) => `${n} ${n === 1 ? 'dzień' : n < 5 ? 'dni' : 'dni'} temu`,
    daysFromNow: (n: number) => `za ${n} ${n === 1 ? 'dzień' : n < 5 ? 'dni' : 'dni'}`,
    weeksAgo: (n: number) => `${n} ${n === 1 ? 'tydzień' : n < 5 ? 'tygodnie' : 'tygodni'} temu`,
    weeksFromNow: (n: number) => `za ${n} ${n === 1 ? 'tydzień' : n < 5 ? 'tygodnie' : 'tygodni'}`,
    monthsAgo: (n: number) => `${n} ${n === 1 ? 'miesiąc' : n < 5 ? 'miesiące' : 'miesięcy'} temu`,
    monthsFromNow: (n: number) => `za ${n} ${n === 1 ? 'miesiąc' : n < 5 ? 'miesiące' : 'miesięcy'}`,
    yearsAgo: (n: number) => `${n} ${n === 1 ? 'rok' : n < 5 ? 'lata' : 'lat'} temu`,
    yearsFromNow: (n: number) => `za ${n} ${n === 1 ? 'rok' : n < 5 ? 'lata' : 'lat'}`,
  },
  en: {
    today: 'today',
    yesterday: 'yesterday',
    tomorrow: 'tomorrow',
    daysAgo: (n: number) => `${n} ${n === 1 ? 'day' : 'days'} ago`,
    daysFromNow: (n: number) => `in ${n} ${n === 1 ? 'day' : 'days'}`,
    weeksAgo: (n: number) => `${n} ${n === 1 ? 'week' : 'weeks'} ago`,
    weeksFromNow: (n: number) => `in ${n} ${n === 1 ? 'week' : 'weeks'}`,
    monthsAgo: (n: number) => `${n} ${n === 1 ? 'month' : 'months'} ago`,
    monthsFromNow: (n: number) => `in ${n} ${n === 1 ? 'month' : 'months'}`,
    yearsAgo: (n: number) => `${n} ${n === 1 ? 'year' : 'years'} ago`,
    yearsFromNow: (n: number) => `in ${n} ${n === 1 ? 'year' : 'years'}`,
  },
};

/**
 * Parse date input to Date object
 */
function parseDate(date: Date | string | number): Date {
  if (date instanceof Date) {
    return date;
  }
  return new Date(date);
}

/**
 * Format a date according to locale and format
 *
 * @param date - Date to format (Date object, ISO string, or timestamp)
 * @param locale - Locale code (ro, bg, hu, de, pl, en)
 * @param format - Format type (short, medium, long, full)
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date(), 'ro', 'short') // "13.02.2026"
 * formatDate(new Date(), 'ro', 'medium') // "13 feb. 2026"
 * formatDate(new Date(), 'ro', 'long') // "13 februarie 2026"
 * formatDate(new Date(), 'ro', 'full') // "joi, 13 februarie 2026"
 */
export function formatDate(
  date: Date | string | number,
  locale: SupportedLocale = 'ro',
  format: DateFormat = 'medium'
): string {
  try {
    const dateObj = parseDate(date);
    const localeCode = localeMap[locale];
    const options = formatOptions[format];

    return new Intl.DateTimeFormat(localeCode, options).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
}

/**
 * Format a date relative to now (e.g., "yesterday", "3 days ago")
 *
 * @param date - Date to format
 * @param locale - Locale code
 * @returns Relative time string
 *
 * @example
 * formatRelative(yesterday, 'ro') // "ieri"
 * formatRelative(threeDaysAgo, 'ro') // "acum 3 zile"
 * formatRelative(nextWeek, 'ro') // "în 7 zile"
 */
export function formatRelative(
  date: Date | string | number,
  locale: SupportedLocale = 'ro'
): string {
  try {
    const dateObj = parseDate(date);
    const now = new Date();
    const translations = relativeTimeTranslations[locale];

    // Reset time to midnight for accurate day comparison
    const dateStart = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffMs = dateStart.getTime() - nowStart.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    // Today
    if (diffDays === 0) {
      return translations.today;
    }

    // Yesterday
    if (diffDays === -1) {
      return translations.yesterday;
    }

    // Tomorrow
    if (diffDays === 1) {
      return translations.tomorrow;
    }

    // Days (within 2 weeks)
    if (Math.abs(diffDays) < 14) {
      if (diffDays < 0) {
        return translations.daysAgo(Math.abs(diffDays));
      }
      return translations.daysFromNow(diffDays);
    }

    // Weeks (within 2 months)
    const diffWeeks = Math.round(diffDays / 7);
    if (Math.abs(diffWeeks) < 8) {
      if (diffWeeks < 0) {
        return translations.weeksAgo(Math.abs(diffWeeks));
      }
      return translations.weeksFromNow(diffWeeks);
    }

    // Months (within 1 year)
    const diffMonths = Math.round(diffDays / 30);
    if (Math.abs(diffMonths) < 12) {
      if (diffMonths < 0) {
        return translations.monthsAgo(Math.abs(diffMonths));
      }
      return translations.monthsFromNow(diffMonths);
    }

    // Years
    const diffYears = Math.round(diffDays / 365);
    if (diffYears < 0) {
      return translations.yearsAgo(Math.abs(diffYears));
    }
    return translations.yearsFromNow(diffYears);
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return String(date);
  }
}

/**
 * Format a date range
 *
 * @param start - Start date
 * @param end - End date
 * @param locale - Locale code
 * @returns Formatted date range string
 *
 * @example
 * formatDateRange(start, end, 'ro') // "13 feb. - 20 feb. 2026"
 * formatDateRange(start, end, 'en') // "Feb 13 - Feb 20, 2026"
 */
export function formatDateRange(
  start: Date | string | number,
  end: Date | string | number,
  locale: SupportedLocale = 'ro'
): string {
  try {
    const startDate = parseDate(start);
    const endDate = parseDate(end);
    const localeCode = localeMap[locale];

    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();

    // Same day
    if (
      startDate.getDate() === endDate.getDate() &&
      startMonth === endMonth &&
      startYear === endYear
    ) {
      return formatDate(startDate, locale, 'medium');
    }

    // Same month and year
    if (startMonth === endMonth && startYear === endYear) {
      const dayFormatter = new Intl.DateTimeFormat(localeCode, { day: 'numeric' });
      const monthYearFormatter = new Intl.DateTimeFormat(localeCode, {
        month: 'short',
        year: 'numeric',
      });

      return `${dayFormatter.format(startDate)} - ${dayFormatter.format(endDate)} ${monthYearFormatter.format(endDate)}`;
    }

    // Same year
    if (startYear === endYear) {
      const dayMonthFormatter = new Intl.DateTimeFormat(localeCode, {
        day: 'numeric',
        month: 'short',
      });
      const yearFormatter = new Intl.DateTimeFormat(localeCode, { year: 'numeric' });

      return `${dayMonthFormatter.format(startDate)} - ${dayMonthFormatter.format(endDate)} ${yearFormatter.format(endDate)}`;
    }

    // Different years
    return `${formatDate(startDate, locale, 'medium')} - ${formatDate(endDate, locale, 'medium')}`;
  } catch (error) {
    console.error('Error formatting date range:', error);
    return `${start} - ${end}`;
  }
}

/**
 * Format date with time
 *
 * @param date - Date to format
 * @param locale - Locale code
 * @param includeSeconds - Whether to include seconds
 * @returns Formatted date and time string
 *
 * @example
 * formatDateTime(new Date(), 'ro') // "13 feb. 2026, 14:30"
 * formatDateTime(new Date(), 'ro', true) // "13 feb. 2026, 14:30:45"
 */
export function formatDateTime(
  date: Date | string | number,
  locale: SupportedLocale = 'ro',
  includeSeconds = false
): string {
  try {
    const dateObj = parseDate(date);
    const localeCode = localeMap[locale];

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...(includeSeconds && { second: '2-digit' }),
    };

    return new Intl.DateTimeFormat(localeCode, options).format(dateObj);
  } catch (error) {
    console.error('Error formatting date time:', error);
    return String(date);
  }
}

/**
 * Format time only
 *
 * @param date - Date to extract time from
 * @param locale - Locale code
 * @param includeSeconds - Whether to include seconds
 * @returns Formatted time string
 *
 * @example
 * formatTime(new Date(), 'ro') // "14:30"
 * formatTime(new Date(), 'ro', true) // "14:30:45"
 */
export function formatTime(
  date: Date | string | number,
  locale: SupportedLocale = 'ro',
  includeSeconds = false
): string {
  try {
    const dateObj = parseDate(date);
    const localeCode = localeMap[locale];

    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      ...(includeSeconds && { second: '2-digit' }),
    };

    return new Intl.DateTimeFormat(localeCode, options).format(dateObj);
  } catch (error) {
    console.error('Error formatting time:', error);
    return String(date);
  }
}
