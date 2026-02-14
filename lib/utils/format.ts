/**
 * Formatting utility functions for the SSM/PSI platform
 * Handles date, currency, phone, CUI, and other common formatting needs
 */

/**
 * Format a date according to locale
 * @param date - Date object, ISO string, or timestamp
 * @param locale - Locale code (ro, en, bg, hu, de)
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date('2024-03-15'), 'ro') // "15.03.2024"
 * formatDate('2024-03-15T10:30:00Z', 'en') // "03/15/2024"
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  locale: string = 'ro'
): string {
  if (!date) return '-';

  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return '-';

  const formats: Record<string, Intl.DateTimeFormatOptions> = {
    ro: { day: '2-digit', month: '2-digit', year: 'numeric' }, // DD.MM.YYYY
    en: { month: '2-digit', day: '2-digit', year: 'numeric' }, // MM/DD/YYYY
    bg: { day: '2-digit', month: '2-digit', year: 'numeric' }, // DD.MM.YYYY
    hu: { year: 'numeric', month: '2-digit', day: '2-digit' }, // YYYY.MM.DD
    de: { day: '2-digit', month: '2-digit', year: 'numeric' }, // DD.MM.YYYY
  };

  const localeMap: Record<string, string> = {
    ro: 'ro-RO',
    en: 'en-US',
    bg: 'bg-BG',
    hu: 'hu-HU',
    de: 'de-DE',
  };

  const format = formats[locale] || formats.ro;
  const localeString = localeMap[locale] || 'ro-RO';

  return new Intl.DateTimeFormat(localeString, format).format(dateObj);
}

/**
 * Format currency with appropriate symbol based on country
 * @param amount - Amount to format
 * @param country - Country code (ro, bg, hu, de, pl)
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1500.50, 'ro') // "1.500,50 RON"
 * formatCurrency(1500.50, 'de') // "1.500,50 €"
 * formatCurrency(1500.50, 'hu') // "1 500,50 Ft"
 */
export function formatCurrency(
  amount: number | null | undefined,
  country: string = 'ro'
): string {
  if (amount === null || amount === undefined) return '-';

  const currencyMap: Record<string, string> = {
    ro: 'RON',
    bg: 'BGN',
    hu: 'HUF',
    de: 'EUR',
    pl: 'PLN',
  };

  const localeMap: Record<string, string> = {
    ro: 'ro-RO',
    bg: 'bg-BG',
    hu: 'hu-HU',
    de: 'de-DE',
    pl: 'pl-PL',
  };

  const currency = currencyMap[country] || 'RON';
  const locale = localeMap[country] || 'ro-RO';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format phone number according to country standards
 * @param phone - Phone number (with or without country code)
 * @param country - Country code (ro, bg, hu, de, pl)
 * @returns Formatted phone number
 *
 * @example
 * formatPhone('0721234567', 'ro') // "+40 721 234 567"
 * formatPhone('+40721234567', 'ro') // "+40 721 234 567"
 * formatPhone('0301234567', 'de') // "+49 30 12345 67"
 */
export function formatPhone(
  phone: string | null | undefined,
  country: string = 'ro'
): string {
  if (!phone) return '-';

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  const countryPrefixes: Record<string, string> = {
    ro: '40',
    bg: '359',
    hu: '36',
    de: '49',
    pl: '48',
  };

  const prefix = countryPrefixes[country] || '40';

  // Remove country prefix if present to normalize
  let normalized = cleaned;
  if (cleaned.startsWith(prefix)) {
    normalized = cleaned.substring(prefix.length);
  } else if (cleaned.startsWith('0')) {
    normalized = cleaned.substring(1);
  }

  // Format based on country
  switch (country) {
    case 'ro':
      // Romanian: +40 7XX XXX XXX
      if (normalized.length === 9) {
        return `+40 ${normalized.substring(0, 3)} ${normalized.substring(3, 6)} ${normalized.substring(6)}`;
      }
      break;
    case 'bg':
      // Bulgarian: +359 XX XXX XXXX
      if (normalized.length === 9) {
        return `+359 ${normalized.substring(0, 2)} ${normalized.substring(2, 5)} ${normalized.substring(5)}`;
      }
      break;
    case 'hu':
      // Hungarian: +36 XX XXX XXXX
      if (normalized.length === 9) {
        return `+36 ${normalized.substring(0, 2)} ${normalized.substring(2, 5)} ${normalized.substring(5)}`;
      }
      break;
    case 'de':
      // German: variable format, simple grouping
      if (normalized.length >= 10) {
        return `+49 ${normalized.substring(0, 2)} ${normalized.substring(2, 7)} ${normalized.substring(7)}`;
      }
      break;
    case 'pl':
      // Polish: +48 XXX XXX XXX
      if (normalized.length === 9) {
        return `+48 ${normalized.substring(0, 3)} ${normalized.substring(3, 6)} ${normalized.substring(6)}`;
      }
      break;
  }

  // Fallback: just add country prefix
  return `+${prefix} ${normalized}`;
}

/**
 * Format Romanian CUI (Company Unique Identifier)
 * @param cui - CUI number (with or without RO prefix)
 * @returns Formatted CUI with RO prefix
 *
 * @example
 * formatCUI('12345678') // "RO12345678"
 * formatCUI('RO12345678') // "RO12345678"
 * formatCUI('RO 12345678') // "RO12345678"
 */
export function formatCUI(cui: string | null | undefined): string {
  if (!cui) return '-';

  // Remove spaces and convert to uppercase
  const cleaned = cui.replace(/\s/g, '').toUpperCase();

  // If already has RO prefix, return cleaned version
  if (cleaned.startsWith('RO')) {
    return cleaned;
  }

  // Add RO prefix
  return `RO${cleaned}`;
}

/**
 * Format employee count with proper pluralization
 * @param count - Number of employees
 * @param locale - Locale code (ro, en, bg, hu, de)
 * @returns Formatted employee count string
 *
 * @example
 * formatEmployeeCount(1, 'ro') // "1 angajat"
 * formatEmployeeCount(5, 'ro') // "5 angajați"
 * formatEmployeeCount(25, 'ro') // "25 angajați"
 * formatEmployeeCount(5, 'en') // "5 employees"
 */
export function formatEmployeeCount(
  count: number | null | undefined,
  locale: string = 'ro'
): string {
  if (count === null || count === undefined) return '-';

  const translations: Record<string, { singular: string; plural: string }> = {
    ro: { singular: 'angajat', plural: 'angajați' },
    en: { singular: 'employee', plural: 'employees' },
    bg: { singular: 'служител', plural: 'служители' },
    hu: { singular: 'alkalmazott', plural: 'alkalmazottak' },
    de: { singular: 'Mitarbeiter', plural: 'Mitarbeiter' },
  };

  const trans = translations[locale] || translations.ro;
  const word = count === 1 ? trans.singular : trans.plural;

  return `${count} ${word}`;
}

/**
 * Format file size in human-readable format
 * @param bytes - Size in bytes
 * @param locale - Locale code (ro, en, etc.)
 * @returns Formatted file size
 *
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1536) // "1.5 KB"
 * formatFileSize(1048576) // "1 MB"
 * formatFileSize(5242880) // "5 MB"
 */
export function formatFileSize(
  bytes: number | null | undefined,
  locale: string = 'ro'
): string {
  if (bytes === null || bytes === undefined || bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);

  // Format number according to locale
  const localeMap: Record<string, string> = {
    ro: 'ro-RO',
    en: 'en-US',
    bg: 'bg-BG',
    hu: 'hu-HU',
    de: 'de-DE',
  };

  const localeString = localeMap[locale] || 'ro-RO';
  const formattedSize = new Intl.NumberFormat(localeString, {
    minimumFractionDigits: 0,
    maximumFractionDigits: i === 0 ? 0 : 1,
  }).format(size);

  return `${formattedSize} ${units[i]}`;
}

/**
 * Format duration in minutes to human-readable format
 * @param minutes - Duration in minutes
 * @param locale - Locale code (ro, en, bg, hu, de)
 * @returns Formatted duration string
 *
 * @example
 * formatDuration(30, 'ro') // "30 min"
 * formatDuration(60, 'ro') // "1 oră"
 * formatDuration(90, 'ro') // "1 oră 30 min"
 * formatDuration(120, 'ro') // "2 ore"
 * formatDuration(1440, 'ro') // "1 zi"
 */
export function formatDuration(
  minutes: number | null | undefined,
  locale: string = 'ro'
): string {
  if (minutes === null || minutes === undefined || minutes === 0) return '-';

  const translations: Record<
    string,
    {
      day: string;
      days: string;
      hour: string;
      hours: string;
      min: string;
    }
  > = {
    ro: { day: 'zi', days: 'zile', hour: 'oră', hours: 'ore', min: 'min' },
    en: { day: 'day', days: 'days', hour: 'hour', hours: 'hours', min: 'min' },
    bg: {
      day: 'ден',
      days: 'дни',
      hour: 'час',
      hours: 'часа',
      min: 'мин',
    },
    hu: {
      day: 'nap',
      days: 'nap',
      hour: 'óra',
      hours: 'óra',
      min: 'perc',
    },
    de: {
      day: 'Tag',
      days: 'Tage',
      hour: 'Stunde',
      hours: 'Stunden',
      min: 'Min',
    },
  };

  const trans = translations[locale] || translations.ro;

  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days} ${days === 1 ? trans.day : trans.days}`);
  }
  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? trans.hour : trans.hours}`);
  }
  if (mins > 0 && days === 0) {
    // Don't show minutes if we're showing days
    parts.push(`${mins} ${trans.min}`);
  }

  return parts.join(' ') || `0 ${trans.min}`;
}

/**
 * Format relative time (e.g., "acum 2 ore", "în 3 zile")
 * @param date - Date to format
 * @param locale - Locale code (ro, en, bg, hu, de)
 * @returns Relative time string
 *
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000), 'ro') // "acum o oră"
 * formatRelativeTime(new Date(Date.now() - 86400000), 'ro') // "acum o zi"
 * formatRelativeTime(new Date(Date.now() + 86400000), 'ro') // "în o zi"
 */
export function formatRelativeTime(
  date: Date | string | number | null | undefined,
  locale: string = 'ro'
): string {
  if (!date) return '-';

  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return '-';

  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);

  const isPast = diffMs < 0;
  const abs = Math.abs;

  const translations: Record<
    string,
    {
      now: string;
      past: string;
      future: string;
      seconds: (n: number) => string;
      minutes: (n: number) => string;
      hours: (n: number) => string;
      days: (n: number) => string;
      months: (n: number) => string;
      years: (n: number) => string;
    }
  > = {
    ro: {
      now: 'acum',
      past: 'acum',
      future: 'în',
      seconds: (n) => `${n} ${n === 1 ? 'secundă' : 'secunde'}`,
      minutes: (n) => `${n} ${n === 1 ? 'minut' : 'minute'}`,
      hours: (n) => `${n} ${n === 1 ? 'oră' : 'ore'}`,
      days: (n) => `${n} ${n === 1 ? 'zi' : 'zile'}`,
      months: (n) => `${n} ${n === 1 ? 'lună' : 'luni'}`,
      years: (n) => `${n} ${n === 1 ? 'an' : 'ani'}`,
    },
    en: {
      now: 'now',
      past: '',
      future: 'in',
      seconds: (n) => `${n} ${n === 1 ? 'second' : 'seconds'} ago`,
      minutes: (n) => `${n} ${n === 1 ? 'minute' : 'minutes'} ago`,
      hours: (n) => `${n} ${n === 1 ? 'hour' : 'hours'} ago`,
      days: (n) => `${n} ${n === 1 ? 'day' : 'days'} ago`,
      months: (n) => `${n} ${n === 1 ? 'month' : 'months'} ago`,
      years: (n) => `${n} ${n === 1 ? 'year' : 'years'} ago`,
    },
    bg: {
      now: 'сега',
      past: 'преди',
      future: 'след',
      seconds: (n) => `${n} ${n === 1 ? 'секунда' : 'секунди'}`,
      minutes: (n) => `${n} ${n === 1 ? 'минута' : 'минути'}`,
      hours: (n) => `${n} ${n === 1 ? 'час' : 'часа'}`,
      days: (n) => `${n} ${n === 1 ? 'ден' : 'дни'}`,
      months: (n) => `${n} ${n === 1 ? 'месец' : 'месеца'}`,
      years: (n) => `${n} ${n === 1 ? 'година' : 'години'}`,
    },
    hu: {
      now: 'most',
      past: '',
      future: '',
      seconds: (n) => `${n} ${n === 1 ? 'másodperce' : 'másodperce'}`,
      minutes: (n) => `${n} ${n === 1 ? 'perce' : 'perce'}`,
      hours: (n) => `${n} ${n === 1 ? 'órája' : 'órája'}`,
      days: (n) => `${n} ${n === 1 ? 'napja' : 'napja'}`,
      months: (n) => `${n} ${n === 1 ? 'hónapja' : 'hónapja'}`,
      years: (n) => `${n} ${n === 1 ? 'éve' : 'éve'}`,
    },
    de: {
      now: 'jetzt',
      past: 'vor',
      future: 'in',
      seconds: (n) => `${n} ${n === 1 ? 'Sekunde' : 'Sekunden'}`,
      minutes: (n) => `${n} ${n === 1 ? 'Minute' : 'Minuten'}`,
      hours: (n) => `${n} ${n === 1 ? 'Stunde' : 'Stunden'}`,
      days: (n) => `${n} ${n === 1 ? 'Tag' : 'Tagen'}`,
      months: (n) => `${n} ${n === 1 ? 'Monat' : 'Monaten'}`,
      years: (n) => `${n} ${n === 1 ? 'Jahr' : 'Jahren'}`,
    },
  };

  const trans = translations[locale] || translations.ro;

  // Less than a minute
  if (abs(diffMin) < 1) {
    return trans.now;
  }

  let timeStr = '';
  let prefix = isPast ? trans.past : trans.future;

  if (abs(diffYear) >= 1) {
    timeStr = trans.years(abs(diffYear));
  } else if (abs(diffMonth) >= 1) {
    timeStr = trans.months(abs(diffMonth));
  } else if (abs(diffDay) >= 1) {
    timeStr = trans.days(abs(diffDay));
  } else if (abs(diffHour) >= 1) {
    timeStr = trans.hours(abs(diffHour));
  } else {
    timeStr = trans.minutes(abs(diffMin));
  }

  // For English past tense, time string already includes "ago"
  if (locale === 'en' && isPast) {
    return timeStr;
  }

  // For Hungarian, use suffix instead of prefix
  if (locale === 'hu') {
    return timeStr;
  }

  return prefix ? `${prefix} ${timeStr}` : timeStr;
}

/**
 * Truncate text to maximum length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 100)
 * @returns Truncated text with ellipsis if needed
 *
 * @example
 * truncateText('Short text', 50) // "Short text"
 * truncateText('This is a very long text that needs truncation', 20) // "This is a very lo..."
 */
export function truncateText(
  text: string | null | undefined,
  maxLength: number = 100
): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength - 3) + '...';
}

// ============================================================================
// INLINE TESTS - Run with: ts-node lib/utils/format.ts
// ============================================================================

if (require.main === module) {
  console.log('🧪 Testing format utilities...\n');

  // Test formatDate
  console.log('📅 formatDate:');
  const testDate = new Date('2024-03-15T10:30:00Z');
  console.log('  RO:', formatDate(testDate, 'ro')); // 15.03.2024
  console.log('  EN:', formatDate(testDate, 'en')); // 03/15/2024
  console.log('  HU:', formatDate(testDate, 'hu')); // 2024.03.15
  console.log('  null:', formatDate(null)); // -

  // Test formatCurrency
  console.log('\n💰 formatCurrency:');
  console.log('  RO:', formatCurrency(1500.5, 'ro')); // 1.500,50 RON
  console.log('  DE:', formatCurrency(1500.5, 'de')); // 1.500,50 €
  console.log('  HU:', formatCurrency(150000, 'hu')); // 150 000,00 Ft
  console.log('  null:', formatCurrency(null)); // -

  // Test formatPhone
  console.log('\n📞 formatPhone:');
  console.log('  RO:', formatPhone('0721234567', 'ro')); // +40 721 234 567
  console.log('  RO+:', formatPhone('+40721234567', 'ro')); // +40 721 234 567
  console.log('  BG:', formatPhone('0887654321', 'bg')); // +359 88 765 4321
  console.log('  null:', formatPhone(null)); // -

  // Test formatCUI
  console.log('\n🏢 formatCUI:');
  console.log('  Plain:', formatCUI('12345678')); // RO12345678
  console.log('  WithRO:', formatCUI('RO12345678')); // RO12345678
  console.log('  Spaces:', formatCUI('RO 12345678')); // RO12345678
  console.log('  null:', formatCUI(null)); // -

  // Test formatEmployeeCount
  console.log('\n👥 formatEmployeeCount:');
  console.log('  1:', formatEmployeeCount(1, 'ro')); // 1 angajat
  console.log('  5:', formatEmployeeCount(5, 'ro')); // 5 angajați
  console.log('  25:', formatEmployeeCount(25, 'ro')); // 25 angajați
  console.log('  EN:', formatEmployeeCount(5, 'en')); // 5 employees

  // Test formatFileSize
  console.log('\n📦 formatFileSize:');
  console.log('  1KB:', formatFileSize(1024)); // 1 KB
  console.log('  1.5KB:', formatFileSize(1536)); // 1,5 KB
  console.log('  1MB:', formatFileSize(1048576)); // 1 MB
  console.log('  5.2MB:', formatFileSize(5242880)); // 5,2 MB

  // Test formatDuration
  console.log('\n⏱️ formatDuration:');
  console.log('  30min:', formatDuration(30, 'ro')); // 30 min
  console.log('  1h:', formatDuration(60, 'ro')); // 1 oră
  console.log('  1h30:', formatDuration(90, 'ro')); // 1 oră 30 min
  console.log('  2h:', formatDuration(120, 'ro')); // 2 ore
  console.log('  1day:', formatDuration(1440, 'ro')); // 1 zi

  // Test formatRelativeTime
  console.log('\n🕐 formatRelativeTime:');
  const now = new Date();
  console.log('  1h ago:', formatRelativeTime(new Date(now.getTime() - 3600000), 'ro'));
  console.log('  1 day ago:', formatRelativeTime(new Date(now.getTime() - 86400000), 'ro'));
  console.log('  in 2 days:', formatRelativeTime(new Date(now.getTime() + 172800000), 'ro'));
  console.log('  EN 1h ago:', formatRelativeTime(new Date(now.getTime() - 3600000), 'en'));

  // Test truncateText
  console.log('\n✂️ truncateText:');
  console.log('  Short:', truncateText('Short text', 50)); // Short text
  console.log('  Long:', truncateText('This is a very long text that needs to be truncated', 20));
  // This is a very lo...

  console.log('\n✅ All tests completed!');
}
