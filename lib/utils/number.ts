/**
 * Number utility functions
 */

/**
 * Formats a number according to locale
 * @param n - The number to format
 * @param locale - The locale to use (default: 'ro-RO')
 * @returns Formatted number string
 */
export function formatNumber(n: number, locale: string = 'ro-RO'): string {
  return new Intl.NumberFormat(locale).format(n);
}

/**
 * Formats a number as percentage
 * @param n - The number to format (0.15 = 15%)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 */
export function formatPercent(n: number, decimals: number = 0): string {
  return `${(n * 100).toFixed(decimals)}%`;
}

/**
 * Formats a number as currency
 * @param n - The number to format
 * @param currency - Currency code (default: 'RON')
 * @param locale - The locale to use (default: 'ro-RO')
 * @returns Formatted currency string
 */
export function formatCurrency(
  n: number,
  currency: string = 'RON',
  locale: string = 'ro-RO'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(n);
}

/**
 * Clamps a number between min and max values
 * @param n - The number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped number
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

/**
 * Rounds a number to specified decimal places
 * @param n - The number to round
 * @param decimals - Number of decimal places (default: 2)
 * @returns Rounded number
 */
export function roundTo(n: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
}

/**
 * Generates a random number between min and max (inclusive)
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random number
 */
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Calculates the average of an array of numbers
 * @param arr - Array of numbers
 * @returns Average value or 0 if array is empty
 */
export function average(arr: number[]): number {
  if (arr.length === 0) return 0;
  return sum(arr) / arr.length;
}

/**
 * Calculates the sum of an array of numbers
 * @param arr - Array of numbers
 * @returns Sum of all numbers
 */
export function sum(arr: number[]): number {
  return arr.reduce((acc, val) => acc + val, 0);
}
