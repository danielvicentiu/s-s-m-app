/**
 * Country Configuration Aggregator
 * Central export point for all country-specific configurations (legislation, training types, penalties)
 *
 * Supported countries: RO, BG, HU, DE, PL
 */

import { legislatiePL } from '../legislatie-pl'
import bulgariaComplete from '../seed-packages/bulgaria-complete'

// ══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ══════════════════════════════════════════════════════════════════════════════

export type CountryCode = 'RO' | 'BG' | 'HU' | 'DE' | 'PL'

export interface LegislativeAct {
  id: string
  title: string
  number: string
  domain: 'ssm' | 'psi' | 'medical' | 'general' | 'SSM' | 'PSI' | 'MEDICAL' | 'LABOR'
  description: string
  // Optional fields for different country structures
  titlePL?: string
  title_bg?: string
  country_code?: CountryCode
  act_date?: string
  official_journal_ref?: string | null
  source_url?: string | null
}

export interface TrainingType {
  id: string
  country_code: CountryCode
  name: string
  description: string
  frequency: 'annual' | 'biannual' | 'once' | 'on_demand'
  duration_hours: number
  is_mandatory: boolean
  category: 'SSM' | 'PSI' | 'FIRST_AID' | 'SPECIALIZED'
  legal_reference: string
  // Optional fields for localized names
  name_bg?: string
}

export interface Penalty {
  id: string
  country_code: CountryCode
  violation_type: string
  description: string
  penalty_min_eur: number
  penalty_max_eur: number
  legal_reference: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  // Optional fields for localized names
  violation_type_bg?: string
}

export interface CountryConfig {
  countryCode: CountryCode
  legislation: LegislativeAct[]
  trainingTypes: TrainingType[]
  penalties: Penalty[]
  isFullyConfigured: boolean
}

// ══════════════════════════════════════════════════════════════════════════════
// COUNTRY DATA IMPORTS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Poland (PL) configuration
 */
const polandConfig: CountryConfig = {
  countryCode: 'PL',
  legislation: legislatiePL.map(act => ({
    ...act,
    country_code: 'PL' as CountryCode
  })),
  trainingTypes: [],
  penalties: [],
  isFullyConfigured: false // Only legislation available
}

/**
 * Bulgaria (BG) configuration
 */
const bulgariaConfig: CountryConfig = {
  countryCode: 'BG',
  legislation: bulgariaComplete.legislation.map(act => ({
    id: act.id,
    title: act.title,
    number: act.act_number,
    domain: act.domain,
    description: act.description,
    title_bg: act.title_bg,
    country_code: 'BG' as CountryCode,
    act_date: act.act_date,
    official_journal_ref: act.official_journal_ref,
    source_url: act.source_url
  })),
  trainingTypes: bulgariaComplete.trainingTypes,
  penalties: bulgariaComplete.penalties,
  isFullyConfigured: true
}

/**
 * Romania (RO) configuration - placeholder
 */
const romaniaConfig: CountryConfig = {
  countryCode: 'RO',
  legislation: [],
  trainingTypes: [],
  penalties: [],
  isFullyConfigured: false
}

/**
 * Hungary (HU) configuration - placeholder
 */
const hungaryConfig: CountryConfig = {
  countryCode: 'HU',
  legislation: [],
  trainingTypes: [],
  penalties: [],
  isFullyConfigured: false
}

/**
 * Germany (DE) configuration - placeholder
 */
const germanyConfig: CountryConfig = {
  countryCode: 'DE',
  legislation: [],
  trainingTypes: [],
  penalties: [],
  isFullyConfigured: false
}

// ══════════════════════════════════════════════════════════════════════════════
// COUNTRY REGISTRY
// ══════════════════════════════════════════════════════════════════════════════

const countryConfigs: Record<CountryCode, CountryConfig> = {
  RO: romaniaConfig,
  BG: bulgariaConfig,
  HU: hungaryConfig,
  DE: germanyConfig,
  PL: polandConfig
}

// ══════════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Get complete configuration for a specific country
 * @param countryCode - Two-letter country code (RO, BG, HU, DE, PL)
 * @returns CountryConfig object with all legislation, training types, and penalties
 *
 * @example
 * const bgConfig = getCountryConfig('BG')
 * console.log(bgConfig.legislation.length) // 8
 * console.log(bgConfig.isFullyConfigured) // true
 */
export function getCountryConfig(countryCode: CountryCode): CountryConfig {
  const config = countryConfigs[countryCode]
  if (!config) {
    throw new Error(`Country configuration not found for: ${countryCode}`)
  }
  return config
}

/**
 * Get list of all supported countries with their configuration status
 * @returns Array of CountryConfig objects
 *
 * @example
 * const countries = getSupportedCountries()
 * const configured = countries.filter(c => c.isFullyConfigured)
 * console.log(configured.map(c => c.countryCode)) // ['BG']
 */
export function getSupportedCountries(): CountryConfig[] {
  return Object.values(countryConfigs)
}

/**
 * Get legislation data for a specific country
 * @param countryCode - Two-letter country code
 * @returns Array of legislative acts
 *
 * @example
 * const plLaws = getCountryLegislation('PL')
 * console.log(plLaws.length) // 10
 * console.log(plLaws[0].titlePL) // "Kodeks pracy"
 */
export function getCountryLegislation(countryCode: CountryCode): LegislativeAct[] {
  return getCountryConfig(countryCode).legislation
}

/**
 * Get training types for a specific country
 * @param countryCode - Two-letter country code
 * @returns Array of training types
 *
 * @example
 * const bgTrainings = getCountryTrainingTypes('BG')
 * console.log(bgTrainings.length) // 8
 * const mandatory = bgTrainings.filter(t => t.is_mandatory)
 */
export function getCountryTrainingTypes(countryCode: CountryCode): TrainingType[] {
  return getCountryConfig(countryCode).trainingTypes
}

/**
 * Get penalties for a specific country
 * @param countryCode - Two-letter country code
 * @returns Array of penalties with min/max amounts in EUR
 *
 * @example
 * const bgPenalties = getCountryPenalties('BG')
 * const critical = bgPenalties.filter(p => p.severity === 'critical')
 * console.log(critical[0].penalty_max_eur) // 2500
 */
export function getCountryPenalties(countryCode: CountryCode): Penalty[] {
  return getCountryConfig(countryCode).penalties
}

/**
 * Check if a country has full configuration data
 * @param countryCode - Two-letter country code
 * @returns Boolean indicating if country has legislation, training types, and penalties
 *
 * @example
 * isCountryFullyConfigured('BG') // true
 * isCountryFullyConfigured('RO') // false
 */
export function isCountryFullyConfigured(countryCode: CountryCode): boolean {
  return getCountryConfig(countryCode).isFullyConfigured
}

/**
 * Get list of country codes that have full configuration
 * @returns Array of CountryCode
 *
 * @example
 * getFullyConfiguredCountries() // ['BG']
 */
export function getFullyConfiguredCountries(): CountryCode[] {
  return Object.values(countryConfigs)
    .filter(config => config.isFullyConfigured)
    .map(config => config.countryCode)
}

// ══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════════════════════

export default countryConfigs

// Named exports for direct access
export {
  romaniaConfig,
  bulgariaConfig,
  hungaryConfig,
  germanyConfig,
  polandConfig
}
