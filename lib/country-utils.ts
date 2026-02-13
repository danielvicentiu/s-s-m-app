// lib/country-utils.ts
// Helpers pentru detecție țară din locale și mapări next-intl ↔ country_code

import { type CountryCode } from './types'

/**
 * Convertește locale next-intl (ro, bg, hu, de, pl) → country_code DB (RO, BG, HU, DE, PL)
 */
export function getCountryFromLocale(locale: string): CountryCode {
  const map: Record<string, CountryCode> = {
    'ro': 'RO',
    'bg': 'BG',
    'hu': 'HU',
    'de': 'DE',
    'pl': 'PL',
  }
  return map[locale.toLowerCase()] || 'RO' // fallback pe RO
}

/**
 * Convertește country_code DB (RO) → locale next-intl (ro)
 */
export function getLocaleFromCountry(countryCode: string): string {
  const map: Record<string, string> = {
    'RO': 'ro',
    'BG': 'bg',
    'HU': 'hu',
    'DE': 'de',
    'PL': 'pl',
  }
  return map[countryCode.toUpperCase()] || 'ro' // fallback pe ro
}

/**
 * Verifică dacă locale e valid (folosit în middleware)
 */
export const SUPPORTED_LOCALES = ['ro', 'bg', 'hu', 'de', 'pl'] as const
export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as any)
}
