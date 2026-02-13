/**
 * String utility functions for the SSM platform
 */

/**
 * Convert text to URL-friendly slug
 * @param text - Text to slugify
 * @returns URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Truncate text to a maximum length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 50)
 * @returns Truncated text with ellipsis if needed
 */
export function truncate(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Capitalize first letter of text
 * @param text - Text to capitalize
 * @returns Text with first letter capitalized
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Get initials from full name (max 2 letters)
 * @param fullName - Full name (e.g., "Ion Popescu")
 * @returns Initials (e.g., "IP")
 */
export function getInitials(fullName: string): string {
  if (!fullName) return '';

  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Sanitize HTML by removing script tags and dangerous attributes
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';

  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  return sanitized.trim();
}

/**
 * Remove diacritics/accents from text (useful for Romanian, Bulgarian, Hungarian, German)
 * @param text - Text with accents
 * @returns Text without accents
 */
export function stripAccents(text: string): string {
  if (!text) return '';

  // Normalize to NFD (decomposed form) and remove combining diacritical marks
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Handle special cases for Romanian
    .replace(/ș/g, 's')
    .replace(/Ș/g, 'S')
    .replace(/ț/g, 't')
    .replace(/Ț/g, 'T')
    .replace(/ă/g, 'a')
    .replace(/Ă/g, 'A')
    .replace(/â/g, 'a')
    .replace(/Â/g, 'A')
    .replace(/î/g, 'i')
    .replace(/Î/g, 'I');
}
