// lib/legislative-import/config.ts
// S-S-M.RO — Legislative Import Pipeline Configuration

import type { CountryCode, AdapterType, ImportConfig, Domain } from './types';

// ============================================================================
// Environment Variables
// ============================================================================

export const env = {
  // DeepL
  deeplApiKey: process.env.DEEPL_API_KEY || '',
  deeplApiUrl: process.env.DEEPL_API_URL || 'https://api-free.deepl.com/v2',

  // Anthropic (pentru structurare)
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929',

  // Pipeline
  batchSize: parseInt(process.env.LEGISLATIVE_IMPORT_BATCH_SIZE || '10'),
  deeplRateLimit: parseInt(process.env.LEGISLATIVE_IMPORT_DEEPL_RATE_LIMIT || '5'),
  scrapeDelayMs: parseInt(process.env.LEGISLATIVE_IMPORT_SCRAPE_DELAY || '2000'),

  // Supabase (from existing env)
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
} as const;

// ============================================================================
// Country Configs
// ============================================================================

export const COUNTRY_CONFIGS: Record<CountryCode, {
  adapterType: AdapterType;
  language: string;
  deeplSourceLang: string;
  requiresTranslation: boolean;
  requiresScraping: boolean;
  rateLimitMs: number;
}> = {
  EU: {
    adapterType: 'eurlex',
    language: 'ro',        // EUR-Lex are texte RO direct
    deeplSourceLang: 'en', // fallback dacă nu e text RO
    requiresTranslation: false,
    requiresScraping: false,
    rateLimitMs: 1000,
  },
  BG: {
    adapterType: 'bg_lex',
    language: 'bg',
    deeplSourceLang: 'bg',
    requiresTranslation: true,
    requiresScraping: true,
    rateLimitMs: 2000,
  },
  HU: {
    adapterType: 'hu_njt',
    language: 'hu',
    deeplSourceLang: 'hu',
    requiresTranslation: true,
    requiresScraping: true,
    rateLimitMs: 2000,
  },
  DE: {
    adapterType: 'de_gesetze',
    language: 'de',
    deeplSourceLang: 'de',
    requiresTranslation: true,
    requiresScraping: false, // XML API
    rateLimitMs: 1000,
  },
  PL: {
    adapterType: 'pl_isap',
    language: 'pl',
    deeplSourceLang: 'pl',
    requiresTranslation: true,
    requiresScraping: false, // REST API
    rateLimitMs: 1000,
  },
  RO: {
    adapterType: 'ro_just',
    language: 'ro',
    deeplSourceLang: 'ro',
    requiresTranslation: false,
    requiresScraping: false, // SOAP API legislatie.just.ro
    rateLimitMs: 1000,
  },
};

// ============================================================================
// EUR-Lex Specific Config
// ============================================================================

export const EURLEX_CONFIG = {
  sparqlEndpoint: 'https://publications.europa.eu/webapi/rdf/sparql',
  cellarBaseUrl: 'https://publications.europa.eu/resource/cellar/',
  cellarContentUrl: 'http://publications.europa.eu/resource/celex/',
  
  // Content negotiation headers for different formats
  headers: {
    html: { Accept: 'text/html' },
    xml: { Accept: 'application/xml' },
    rdf: { Accept: 'application/rdf+xml' },
    formex: { Accept: 'application/xml;notice=object' },
  },

  // Prefixes for SPARQL queries
  sparqlPrefixes: `
    PREFIX cdm: <http://publications.europa.eu/ontology/cdm#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
  `,

  // Language code mapping EUR-Lex
  langMap: {
    ro: 'RON',
    en: 'ENG',
    bg: 'BUL',
    hu: 'HUN',
    de: 'DEU',
    pl: 'POL',
  } as Record<string, string>,
} as const;

// ============================================================================
// BG Lex Config
// ============================================================================

export const BG_LEX_CONFIG = {
  baseUrl: 'https://lex.bg',
  lawsUrl: 'https://lex.bg/laws',
  searchUrl: 'https://lex.bg/bg/laws/ldoc',
  userAgent: 'Mozilla/5.0 (compatible; SSM-Legislative-Bot/1.0; +https://s-s-m.ro/bot)',
  
  // Priority acts for BG initial import (SSM/PSI relevant)
  priorityActs: [
    { id: '2135540866', name: 'Кодекс на труда', actNumber: 'КТ' },
    { id: '2135559070', name: 'Закон за здравословни и безопасни условия на труд', actNumber: 'ЗЗБУТ' },
    { id: '2135511064', name: 'Наредба № 7 за минималните изисквания за ЗБУТ на работните места', actNumber: 'Наредба 7' },
    { id: '2135512048', name: 'Наредба за работното време, почивките и отпуските', actNumber: 'Наредба РВ' },
    { id: '2135510958', name: 'Наредба № 3 за инструктажа на работниците и служителите', actNumber: 'Наредба 3' },
    { id: '2135512399', name: 'Наредба за установяване, разследване, регистриране и отчитане на трудовите злополуки', actNumber: 'Наредба ТЗ' },
    { id: '2135510965', name: 'Наредба № 5 за реда и начина за създаване на КУТ/ГУТ', actNumber: 'Наредба 5 КУТ' },
    { id: '2135511027', name: 'Наредба № 3 за задълженията на работодателите за осигуряване на ЗБУТ', actNumber: 'Наредба 3 РД' },
    { id: '2135536902', name: 'Закон за защита от дискриминация', actNumber: 'ЗЗД' },
    { id: '2135559629', name: 'Наредба за реда за съобщаване, регистриране, потвърждаване, обжалване и отчитане на професионалните болести', actNumber: 'Наредба ПБ' },
  ],
} as const;

// ============================================================================
// EUR-Lex Priority Acts — SSM Directives
// ============================================================================

export const EURLEX_PRIORITY_ACTS = [
  // === Directive cadru ===
  { celex: '31989L0391', title: 'Directiva 89/391/CEE — Directiva-cadru SSM', priority: 1 },

  // === Directive individuale (fiice) ===
  { celex: '31989L0654', title: 'Directiva 89/654/CEE — Locuri de muncă', priority: 2 },
  { celex: '31989L0655', title: 'Directiva 89/655/CEE — Echipamente de muncă', priority: 2 },
  { celex: '31989L0656', title: 'Directiva 89/656/CEE — EIP', priority: 2 },
  { celex: '31990L0269', title: 'Directiva 90/269/CEE — Manipulare manuală sarcini', priority: 2 },
  { celex: '31990L0270', title: 'Directiva 90/270/CEE — Ecran de vizualizare', priority: 2 },
  { celex: '32004L0037', title: 'Directiva 2004/37/CE — Agenți cancerigeni/mutageni', priority: 2 },
  { celex: '32000L0054', title: 'Directiva 2000/54/CE — Agenți biologici', priority: 2 },
  { celex: '31992L0057', title: 'Directiva 92/57/CEE — Șantiere temporare/mobile', priority: 2 },
  { celex: '31992L0058', title: 'Directiva 92/58/CEE — Semnalizare SSM', priority: 2 },
  { celex: '31998L0024', title: 'Directiva 98/24/CE — Agenți chimici', priority: 3 },
  { celex: '32003L0010', title: 'Directiva 2003/10/CE — Zgomot', priority: 3 },
  { celex: '32002L0044', title: 'Directiva 2002/44/CE — Vibrații', priority: 3 },
  { celex: '32006L0025', title: 'Directiva 2006/25/CE — Radiații optice artificiale', priority: 3 },
  { celex: '32013L0035', title: 'Directiva 2013/35/UE — Câmpuri electromagnetice', priority: 3 },

  // === Regulamente importante ===
  { celex: '31989R1907', title: 'Regulamentul REACH', priority: 3 },
  { celex: '32008R1272', title: 'Regulamentul CLP', priority: 3 },
] as const;

// ============================================================================
// Default Import Config
// ============================================================================

export function getDefaultImportConfig(countryCode: CountryCode): ImportConfig {
  const countryConfig = COUNTRY_CONFIGS[countryCode];
  return {
    countryCode,
    adapterType: countryConfig.adapterType,
    batchSize: env.batchSize,
    translateEnabled: countryConfig.requiresTranslation,
    structureEnabled: true,
    autoPublish: false,
    scrapeDelayMs: countryConfig.rateLimitMs,
    deeplRateLimit: env.deeplRateLimit,
  };
}

// ============================================================================
// Cost Estimation
// ============================================================================

export const COST_ESTIMATES = {
  // DeepL Pro: €5.49/lună + €20/1M caractere
  deeplPerCharEur: 0.00002,        // €20 / 1,000,000
  
  // Claude Sonnet: $3/1M input, $15/1M output tokens
  claudeInputPerToken: 0.000003,   // $3 / 1,000,000
  claudeOutputPerToken: 0.000015,  // $15 / 1,000,000
  
  // Average act: ~15,000 characters, ~4,000 tokens input, ~2,000 tokens output
  avgActCharacters: 15000,
  avgActInputTokens: 4000,
  avgActOutputTokens: 2000,
} as const;

export function estimateCost(actsCount: number, requiresTranslation: boolean): {
  deeplCostEur: number;
  claudeCostUsd: number;
  totalEstimateEur: number;
} {
  const deeplCostEur = requiresTranslation
    ? actsCount * COST_ESTIMATES.avgActCharacters * COST_ESTIMATES.deeplPerCharEur
    : 0;

  const claudeCostUsd = actsCount * (
    COST_ESTIMATES.avgActInputTokens * COST_ESTIMATES.claudeInputPerToken +
    COST_ESTIMATES.avgActOutputTokens * COST_ESTIMATES.claudeOutputPerToken
  );

  // Aproximare: 1 USD ≈ 0.92 EUR
  const totalEstimateEur = deeplCostEur + (claudeCostUsd * 0.92);

  return { deeplCostEur, claudeCostUsd, totalEstimateEur };
}
