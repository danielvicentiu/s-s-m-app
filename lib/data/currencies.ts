/**
 * Currency definitions for the SSM/PSI platform
 * Supports RON, EUR, BGN, HUF, PLN, USD
 */

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
  formatPattern: string;
  exchangeRateToEUR: number; // Approximate exchange rate (1 unit = X EUR)
}

export const CURRENCIES: Currency[] = [
  {
    code: 'RON',
    symbol: 'lei',
    name: 'Leu românesc',
    decimals: 2,
    formatPattern: '{amount} {symbol}',
    exchangeRateToEUR: 0.20, // 1 RON ≈ 0.20 EUR (4.95 RON/EUR)
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    decimals: 2,
    formatPattern: '{symbol}{amount}',
    exchangeRateToEUR: 1.0, // Base currency
  },
  {
    code: 'BGN',
    symbol: 'лв',
    name: 'Lev bulgar',
    decimals: 2,
    formatPattern: '{amount} {symbol}',
    exchangeRateToEUR: 0.51, // 1 BGN ≈ 0.51 EUR (fixed rate 1.95583 BGN/EUR)
  },
  {
    code: 'HUF',
    symbol: 'Ft',
    name: 'Forint maghiar',
    decimals: 0,
    formatPattern: '{amount} {symbol}',
    exchangeRateToEUR: 0.0025, // 1 HUF ≈ 0.0025 EUR (400 HUF/EUR)
  },
  {
    code: 'PLN',
    symbol: 'zł',
    name: 'Zlot polonez',
    decimals: 2,
    formatPattern: '{amount} {symbol}',
    exchangeRateToEUR: 0.23, // 1 PLN ≈ 0.23 EUR (4.30 PLN/EUR)
  },
  {
    code: 'USD',
    symbol: '$',
    name: 'Dolar american',
    decimals: 2,
    formatPattern: '{symbol}{amount}',
    exchangeRateToEUR: 0.92, // 1 USD ≈ 0.92 EUR (1.09 USD/EUR)
  },
];

/**
 * Get currency by code
 */
export function getCurrencyByCode(code: string): Currency | undefined {
  return CURRENCIES.find((currency) => currency.code === code);
}

/**
 * Format amount according to currency rules
 */
export function formatCurrencyAmount(
  amount: number,
  currencyCode: string
): string {
  const currency = getCurrencyByCode(currencyCode);
  if (!currency) {
    return `${amount.toFixed(2)} ${currencyCode}`;
  }

  const formattedAmount = amount.toFixed(currency.decimals);
  return currency.formatPattern
    .replace('{amount}', formattedAmount)
    .replace('{symbol}', currency.symbol);
}

/**
 * Convert amount from one currency to another using EUR as base
 */
export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string
): number {
  const fromCurrency = getCurrencyByCode(fromCode);
  const toCurrency = getCurrencyByCode(toCode);

  if (!fromCurrency || !toCurrency) {
    return amount;
  }

  // Convert to EUR first, then to target currency
  const amountInEUR = amount * fromCurrency.exchangeRateToEUR;
  return amountInEUR / toCurrency.exchangeRateToEUR;
}
