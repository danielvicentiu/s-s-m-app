/**
 * Format utility functions for SSM platform
 * Handles formatting for currency, Romanian identifiers (CNP, CUI), phone numbers, text, and files
 */

/**
 * Format amount as currency with proper locale and symbol
 * @param amount - The numeric amount to format
 * @param currency - ISO currency code (RON, EUR, BGN, HUF, etc.)
 * @returns Formatted currency string
 * @example formatCurrency(1234.56, 'RON') // "1.234,56 RON"
 */
export function formatCurrency(amount: number, currency: string = 'RON'): string {
  const localeMap: Record<string, string> = {
    RON: 'ro-RO',
    EUR: 'de-DE',
    BGN: 'bg-BG',
    HUF: 'hu-HU',
    USD: 'en-US',
  };

  const locale = localeMap[currency.toUpperCase()] || 'ro-RO';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format Romanian CNP (Cod Numeric Personal) with proper spacing
 * @param cnp - The CNP string (13 digits)
 * @returns Formatted CNP or original if invalid
 * @example formatCNP('1234567890123') // "1 234567 890123"
 */
export function formatCNP(cnp: string): string {
  if (!cnp) return '';

  // Remove any existing spaces or non-numeric characters
  const cleaned = cnp.replace(/\D/g, '');

  // Validate CNP length
  if (cleaned.length !== 13) return cnp;

  // Format as: S YYMMDD NNNNNC (1 234567 890123)
  return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 7)} ${cleaned.slice(7)}`;
}

/**
 * Format Romanian CUI (Cod Unic de Identificare) with proper prefix
 * @param cui - The CUI string
 * @returns Formatted CUI with RO prefix if not present
 * @example formatCUI('12345678') // "RO12345678"
 */
export function formatCUI(cui: string): string {
  if (!cui) return '';

  // Remove spaces and convert to uppercase
  const cleaned = cui.trim().toUpperCase().replace(/\s/g, '');

  // Add RO prefix if not present
  if (cleaned.startsWith('RO')) {
    return cleaned;
  }

  // Validate that remaining characters are numeric
  const numericPart = cleaned.replace(/^RO/, '');
  if (!/^\d+$/.test(numericPart)) return cui;

  return `RO${numericPart}`;
}

/**
 * Format phone number with proper spacing
 * Supports Romanian, Bulgarian, Hungarian, German formats
 * @param phone - The phone number string
 * @returns Formatted phone number
 * @example formatPhone('+40721234567') // "+40 721 234 567"
 */
export function formatPhone(phone: string): string {
  if (!phone) return '';

  // Remove all non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Romanian format: +40 7XX XXX XXX
  if (cleaned.startsWith('+40') && cleaned.length === 12) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }

  // Bulgarian format: +359 XXX XXX XXX
  if (cleaned.startsWith('+359') && cleaned.length === 13) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 10)} ${cleaned.slice(10)}`;
  }

  // Hungarian format: +36 XX XXX XXXX
  if (cleaned.startsWith('+36') && cleaned.length === 12) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }

  // German format: +49 XXX XXXXXXX
  if (cleaned.startsWith('+49') && cleaned.length >= 12) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }

  // Generic format: group by 3 digits after country code
  if (cleaned.startsWith('+') && cleaned.length > 7) {
    const countryCode = cleaned.slice(0, cleaned.indexOf(' ') > 0 ? cleaned.indexOf(' ') : 3);
    const remaining = cleaned.slice(countryCode.length);
    return `${countryCode} ${remaining.match(/.{1,3}/g)?.join(' ') || remaining}`;
  }

  return phone;
}

/**
 * Truncate text to specified length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 * @example truncateText('This is a long text', 10) // "This is a..."
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Capitalize first letter of string
 * @param str - The string to capitalize
 * @returns String with first letter capitalized
 * @example capitalizeFirst('hello world') // "Hello world"
 */
export function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert string to URL-friendly slug
 * @param str - The string to slugify
 * @returns URL-friendly slug
 * @example slugify('Hello World! 123') // "hello-world-123"
 */
export function slugify(str: string): string {
  if (!str) return '';

  return str
    .toString()
    .toLowerCase()
    .trim()
    // Remove accents/diacritics (ă, â, î, ș, ț)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace Romanian specific characters
    .replace(/ă/g, 'a')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/ș/g, 's')
    .replace(/ț/g, 't')
    // Replace spaces and special chars with hyphens
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format file size in human-readable format
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string
 * @example formatFileSize(1536) // "1.50 KB"
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  if (!bytes || bytes < 0) return '';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
