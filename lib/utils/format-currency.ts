/**
 * Format currency amounts with proper locale-specific formatting
 *
 * Supports: RON (Romanian Leu), EUR (Euro), HUF (Hungarian Forint), PLN (Polish Zloty)
 *
 * @param amount - The numeric amount to format
 * @param currency - The currency code (RON, EUR, HUF, PLN)
 * @param locale - The locale for formatting (ro-RO, en-US, hu-HU, pl-PL, etc.)
 * @returns Formatted currency string with proper thousand separators and decimal places
 *
 * @example
 * formatCurrency(1234.56, 'RON', 'ro-RO') // "1.234,56 RON"
 * formatCurrency(1234.56, 'EUR', 'en-US') // "€1,234.56"
 * formatCurrency(123456, 'HUF', 'hu-HU') // "123 456 Ft"
 */
export function formatCurrency(
  amount: number,
  currency: 'RON' | 'EUR' | 'HUF' | 'PLN',
  locale: string = 'ro-RO'
): string {
  try {
    // HUF typically doesn't use decimal places
    const minimumFractionDigits = currency === 'HUF' ? 0 : 2;
    const maximumFractionDigits = currency === 'HUF' ? 0 : 2;

    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits,
      maximumFractionDigits,
    });

    return formatter.format(amount);
  } catch (error) {
    // Fallback to simple formatting if locale is not supported
    console.error('Currency formatting error:', error);
    const decimals = currency === 'HUF' ? 0 : 2;
    return `${amount.toFixed(decimals)} ${currency}`;
  }
}
