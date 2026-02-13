/**
 * Document Numbering Configuration
 *
 * Configurare pentru generarea automată a numerelor de înregistrare
 * pentru diferite tipuri de documente SSM/PSI.
 *
 * Format general: PREFIX-YYYY-NNN
 * - PREFIX: cod specific tipului de document
 * - YYYY: anul curent
 * - NNN: număr secvențial (resetat anual)
 */

export type DocumentType =
  | 'evaluare'
  | 'decizie'
  | 'proces_verbal'
  | 'fisa_instruire'
  | 'plan_prevenire'
  | 'plan_evacuare'
  | 'raport'
  | 'autorizatie'
  | 'dovada';

export interface DocumentNumberingConfig {
  /** Prefixul pentru tipul de document */
  prefix: string;
  /** Descrierea tipului de document */
  description: string;
  /** Numărul de cifre pentru partea numerică (ex: 3 → 001, 4 → 0001) */
  digits: number;
  /** Dacă se resetează numerotarea la începutul anului */
  resetAnnually: boolean;
  /** Format complet (template) */
  format: string;
  /** Exemple de numerotare */
  examples: string[];
}

/**
 * Configurare numerotare documente
 */
export const DOCUMENT_NUMBERING: Record<DocumentType, DocumentNumberingConfig> = {
  evaluare: {
    prefix: 'EV',
    description: 'Evaluare de risc',
    digits: 3,
    resetAnnually: true,
    format: 'EV-YYYY-NNN',
    examples: ['EV-2026-001', 'EV-2026-002', 'EV-2026-150']
  },
  decizie: {
    prefix: 'DEC',
    description: 'Decizie (numire responsabil SSM, comisii, etc.)',
    digits: 3,
    resetAnnually: true,
    format: 'DEC-YYYY-NNN',
    examples: ['DEC-2026-001', 'DEC-2026-002', 'DEC-2026-050']
  },
  proces_verbal: {
    prefix: 'PV',
    description: 'Proces verbal (instruire, verificare, accident)',
    digits: 3,
    resetAnnually: true,
    format: 'PV-YYYY-NNN',
    examples: ['PV-2026-001', 'PV-2026-002', 'PV-2026-300']
  },
  fisa_instruire: {
    prefix: 'FI',
    description: 'Fișă instruire SSM/PSI',
    digits: 3,
    resetAnnually: true,
    format: 'FI-YYYY-NNN',
    examples: ['FI-2026-001', 'FI-2026-002', 'FI-2026-500']
  },
  plan_prevenire: {
    prefix: 'PP',
    description: 'Plan de prevenire și protecție',
    digits: 3,
    resetAnnually: true,
    format: 'PP-YYYY-NNN',
    examples: ['PP-2026-001', 'PP-2026-002', 'PP-2026-020']
  },
  plan_evacuare: {
    prefix: 'PE',
    description: 'Plan de evacuare',
    digits: 3,
    resetAnnually: true,
    format: 'PE-YYYY-NNN',
    examples: ['PE-2026-001', 'PE-2026-002', 'PE-2026-015']
  },
  raport: {
    prefix: 'RAP',
    description: 'Raport activitate SSM/PSI',
    digits: 3,
    resetAnnually: true,
    format: 'RAP-YYYY-NNN',
    examples: ['RAP-2026-001', 'RAP-2026-002', 'RAP-2026-100']
  },
  autorizatie: {
    prefix: 'AUT',
    description: 'Autorizație (lucru în spații închise, foc deschis, etc.)',
    digits: 3,
    resetAnnually: true,
    format: 'AUT-YYYY-NNN',
    examples: ['AUT-2026-001', 'AUT-2026-002', 'AUT-2026-080']
  },
  dovada: {
    prefix: 'DOV',
    description: 'Dovadă predare-primire EIP',
    digits: 3,
    resetAnnually: true,
    format: 'DOV-YYYY-NNN',
    examples: ['DOV-2026-001', 'DOV-2026-002', 'DOV-2026-200']
  }
};

/**
 * Generează următorul număr de document pentru un tip dat
 *
 * @param type - Tipul de document
 * @param currentNumber - Numărul curent (ultimul număr generat)
 * @param year - Anul pentru care se generează numărul (default: anul curent)
 * @returns Numărul de document formatat (ex: EV-2026-001)
 */
export function generateDocumentNumber(
  type: DocumentType,
  currentNumber: number,
  year?: number
): string {
  const config = DOCUMENT_NUMBERING[type];
  const currentYear = year ?? new Date().getFullYear();
  const nextNumber = currentNumber + 1;
  const paddedNumber = nextNumber.toString().padStart(config.digits, '0');

  return `${config.prefix}-${currentYear}-${paddedNumber}`;
}

/**
 * Parsează un număr de document și extrage componentele
 *
 * @param documentNumber - Numărul complet al documentului (ex: EV-2026-001)
 * @returns Obiect cu componentele: prefix, year, number sau null dacă formatul este invalid
 */
export function parseDocumentNumber(documentNumber: string): {
  prefix: string;
  year: number;
  number: number;
} | null {
  const parts = documentNumber.split('-');

  if (parts.length !== 3) {
    return null;
  }

  const [prefix, yearStr, numberStr] = parts;
  const year = parseInt(yearStr, 10);
  const number = parseInt(numberStr, 10);

  if (isNaN(year) || isNaN(number)) {
    return null;
  }

  return { prefix, year, number };
}

/**
 * Verifică dacă un număr de document este valid pentru tipul specificat
 *
 * @param documentNumber - Numărul documentului de verificat
 * @param type - Tipul de document
 * @returns true dacă numărul este valid, false altfel
 */
export function isValidDocumentNumber(
  documentNumber: string,
  type: DocumentType
): boolean {
  const config = DOCUMENT_NUMBERING[type];
  const parsed = parseDocumentNumber(documentNumber);

  if (!parsed) {
    return false;
  }

  // Verifică dacă prefixul corespunde
  if (parsed.prefix !== config.prefix) {
    return false;
  }

  // Verifică dacă anul este valid (nu în viitor, nu mai vechi de 10 ani)
  const currentYear = new Date().getFullYear();
  if (parsed.year > currentYear || parsed.year < currentYear - 10) {
    return false;
  }

  // Verifică dacă numărul este pozitiv
  if (parsed.number <= 0) {
    return false;
  }

  return true;
}

/**
 * Determină tipul de document pe baza prefixului
 *
 * @param prefix - Prefixul documentului
 * @returns Tipul de document sau null dacă prefixul nu este recunoscut
 */
export function getDocumentTypeFromPrefix(prefix: string): DocumentType | null {
  const entry = Object.entries(DOCUMENT_NUMBERING).find(
    ([, config]) => config.prefix === prefix
  );

  return entry ? (entry[0] as DocumentType) : null;
}
