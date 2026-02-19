export interface LegalActImport {
  // Country ISO 3166-1 alpha-2 (e.g. "PL", "RO", "DE")
  country: string;

  // Act type in original language (e.g. "ustawa", "lege", "Gesetz")
  act_type: string;

  // Act type in English (e.g. "act", "law", "regulation")
  act_type_en: string;

  // Official act number (e.g. "1465", "98/2015")
  number: string;

  // Year of publication
  year: number;

  // Title in original language
  title_original: string;

  // Title translated to English (may be auto-translated or manual)
  title_en: string;

  // Publication date in ISO 8601 (YYYY-MM-DD)
  publication_date: string;

  // Entry into force date in ISO 8601 (YYYY-MM-DD or null)
  entry_into_force: string | null;

  // URL to the official source page
  source_url: string;

  // Direct URL to full text (HTML or PDF)
  full_text_url: string | null;

  // Full text content (HTML string, may be null if not fetched)
  full_text: string | null;

  // SSM/PSI domain tags (e.g. ["bhp", "psi", "substante_chimice"])
  domains: string[];

  // Status: "in_force", "amended", "repealed", "draft"
  status: string;

  // ELI URI — European Legislation Identifier
  // e.g. "https://eli.gov.pl/eli/DU/2023/1465/ogl"
  eli_uri: string | null;

  // Keywords for search indexing
  keywords: string[];

  // ISO 8601 timestamp of import
  imported_at: string;

  // Adapter version for debugging (e.g. "pl-v1.0")
  adapter_version: string;
}
