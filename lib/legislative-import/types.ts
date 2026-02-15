// lib/legislative-import/types.ts
// Types for legislative import pipeline — maps to legal_acts table

export type CountryCode = 'EU' | 'BG' | 'HU' | 'DE' | 'PL' | 'RO';
export type AdapterType = 'eurlex' | 'bg_lex' | 'hu_njt' | 'de_gesetze' | 'pl_isap' | 'ro_just';
export type RunType = 'initial' | 'update_check' | 'manual' | 'batch';
export type ReferenceType = 'implements' | 'amends' | 'repeals' | 'references' | 'transposes' | 'supplements' | 'cites';
export type Domain = 'ssm' | 'psi' | 'labor' | 'gdpr' | 'environment' | 'fiscal' | 'general';
export type OpLegoModule = 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6';

// --- Adapter output ---

export interface RawLegislation {
  sourceId: string;
  sourceUrl: string;
  titleOriginal: string;
  actType: string;       // maps to legal_acts.act_type
  actNumber: string;     // maps to legal_acts.act_number
  dateAdopted?: string;
  dateInForce?: string;
  dateLastAmended?: string;
  inForce: boolean;
  textOriginal: string;
  languageOriginal: string;
  countryCode: CountryCode;
  contentHash: string;
  sections?: RawSection[];
  metadata?: Record<string, unknown>;
}

export interface RawSection {
  sectionNumber: string;
  sectionTitle?: string;
  textOriginal: string;
  sortOrder: number;
}

// --- Translator output ---

export interface TranslatedLegislation extends RawLegislation {
  titleRo: string;
  textRo: string;
  translationProvider: 'deepl' | 'google' | 'manual' | 'none';
  deeplCharactersUsed: number;
  translationCostEur: number;
  sections?: TranslatedSection[];
}

export interface TranslatedSection extends RawSection {
  textRo: string;
}

// --- Structurer output ---

export interface StructuredLegislation extends TranslatedLegislation {
  domains: Domain[];
  opLegoModules: OpLegoModule[];
  ssmRelevanceScore: number;
  keywords: string[];
  summaryRo: string;
  obligations: Obligation[];
  crossReferences: CrossReference[];
  structurerModel: string;
  structurerTokensUsed: number;
  structurerCostUsd: number;
  sections?: StructuredSection[];
}

export interface StructuredSection extends TranslatedSection {
  relevanceScore: number;
  domains: Domain[];
  obligations: Obligation[];
}

export interface Obligation {
  description: string;
  responsibleEntity: string;
  deadline?: string;
  frequency?: string;
  penalty?: string;
  sourceArticle: string;
}

export interface CrossReference {
  targetReferenceText: string;
  targetCelex?: string;
  referenceType: ReferenceType;
  sourceSection?: string;
  targetSection?: string;
}

// --- Pipeline types ---

export interface ImportConfig {
  countryCode: CountryCode;
  adapterType: AdapterType;
  batchSize: number;
  translateEnabled: boolean;
  structureEnabled: boolean;
  autoPublish: boolean;
  scrapeDelayMs: number;
  deeplRateLimit: number;
}

export interface ImportResult {
  logId: string;
  status: 'completed' | 'failed' | 'partial';
  actsFound: number;
  actsNew: number;
  actsUpdated: number;
  actsTranslated: number;
  actsStructured: number;
  actsSkipped: number;
  deeplCharactersUsed: number;
  claudeTokensUsed: number;
  estimatedCostEur: number;
  errors: ImportError[];
  warnings: string[];
  duration: number;
}

export interface ImportError {
  sourceId: string;
  step: 'fetch' | 'translate' | 'structure' | 'save';
  message: string;
  timestamp: string;
}

export interface SearchParams {
  query?: string;
  actType?: string;
  dateFrom?: string;
  dateTo?: string;
  domain?: Domain;
  limit?: number;
  offset?: number;
}

export interface UpdateCheckResult {
  sourceId: string;
  hasChanged: boolean;
  newHash?: string;
  changeDetails?: string;
}

// --- Adapter interface ---

export interface LegislativeAdapter {
  readonly adapterType: AdapterType;
  readonly countryCode: CountryCode;
  fetchAct(sourceId: string): Promise<RawLegislation>;
  searchActs(params: SearchParams): Promise<RawLegislation[]>;
  checkForUpdates(sourceId: string, lastHash: string): Promise<UpdateCheckResult>;
  getPriorityActs(): Promise<string[]>;
}
