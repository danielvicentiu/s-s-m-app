/**
 * String utility functions
 * Provides common string manipulation and formatting utilities
 */

/**
 * Capitalizes the first letter of a string
 * @param str - The string to capitalize
 * @returns The string with first letter capitalized
 * @example capitalize('hello') // 'Hello'
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Converts a string to title case (capitalizes first letter of each word)
 * @param str - The string to convert
 * @returns The string in title case
 * @example titleCase('hello world') // 'Hello World'
 */
export function titleCase(str: string): string {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Converts camelCase string to kebab-case
 * @param str - The camelCase string
 * @returns The kebab-case string
 * @example camelToKebab('helloWorld') // 'hello-world'
 */
export function camelToKebab(str: string): string {
  if (!str) return str;
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Converts kebab-case string to camelCase
 * @param str - The kebab-case string
 * @returns The camelCase string
 * @example kebabToCamel('hello-world') // 'helloWorld'
 */
export function kebabToCamel(str: string): string {
  if (!str) return str;
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Truncates a string to a specified length and adds ellipsis
 * @param str - The string to truncate
 * @param maxLength - Maximum length before truncation
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns The truncated string
 * @example truncate('Hello World', 8) // 'Hello...'
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Returns the correct plural form based on count
 * @param count - The count to check
 * @param singular - Singular form
 * @param plural - Plural form (optional, defaults to singular + 's')
 * @returns The appropriate form with count
 * @example pluralize(1, 'item') // '1 item'
 * @example pluralize(5, 'item') // '5 items'
 * @example pluralize(0, 'person', 'people') // '0 people'
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const form = count === 1 ? singular : (plural || `${singular}s`);
  return `${count} ${form}`;
}

/**
 * Removes diacritics/accents from a string
 * @param str - The string with accents
 * @returns The string without accents
 * @example removeAccents('cafè') // 'cafe'
 * @example removeAccents('șțăîâ') // 'staia'
 */
export function removeAccents(str: string): string {
  if (!str) return str;
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Extracts initials from a name
 * @param name - The full name
 * @param maxInitials - Maximum number of initials (default: 2)
 * @returns The initials in uppercase
 * @example initials('John Doe') // 'JD'
 * @example initials('John Michael Doe', 3) // 'JMD'
 */
export function initials(name: string, maxInitials: number = 2): string {
  if (!name) return '';

  const parts = name.trim().split(/\s+/);
  const initialsArray = parts
    .slice(0, maxInitials)
    .map(part => part.charAt(0).toUpperCase())
    .filter(Boolean);

  return initialsArray.join('');
}

/**
 * Masks an email address for privacy
 * @param email - The email address to mask
 * @returns The masked email
 * @example maskEmail('john.doe@example.com') // 'j***e@example.com'
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;

  const [localPart, domain] = email.split('@');

  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }

  const maskedLocal = `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`;
  return `${maskedLocal}@${domain}`;
}

/**
 * Masks a phone number for privacy
 * @param phone - The phone number to mask
 * @param visibleDigits - Number of visible digits at the end (default: 4)
 * @returns The masked phone number
 * @example maskPhone('+40712345678') // '+4071234****'
 * @example maskPhone('0712345678', 3) // '071234***'
 */
export function maskPhone(phone: string, visibleDigits: number = 4): string {
  if (!phone) return phone;

  // Remove non-digit characters except + at start
  const cleaned = phone.replace(/(?!^\+)\D/g, '');

  if (cleaned.length <= visibleDigits) {
    return '*'.repeat(cleaned.length);
  }

  const visiblePart = cleaned.slice(-visibleDigits);
  const maskedPart = '*'.repeat(cleaned.length - visibleDigits);

  return maskedPart + visiblePart;
}
