/**
 * Registru de evidență a accidentelor de muncă
 * Conform HG 1425/2006 - Anexa 2
 *
 * Template pentru structura de date a registrului de accidente
 */

export interface AccidentRecord {
  /** Nr. crt. - Număr curent de ordine */
  nrCrt: number;

  /** Data la care s-a produs accidentul */
  dataAccident: string; // ISO format YYYY-MM-DD

  /** Numele și prenumele victimei */
  victima: string;

  /** Funcția victimei */
  functie: string;

  /** Locul unde s-a produs accidentul */
  locAccident: string;

  /** Împrejurările în care s-a produs accidentul (descriere scurtă) */
  imprejurari: string;

  /** Natura leziunilor și localizarea lor */
  leziuni: string;

  /** Numărul de zile de incapacitate temporară de muncă (ITM) */
  zileITM: number;

  /** Măsurile luate pentru evitarea accidentelor similare */
  masuriLuate: string;

  /** Observații suplimentare (opțional) */
  observatii?: string;

  /** Data înregistrării în registru */
  dataInregistrare?: string; // ISO format YYYY-MM-DD

  /** ID-ul organizației (pentru integrare cu Supabase) */
  organizationId?: string;

  /** Gravitatea accidentului (opțional) */
  gravitate?: 'usoara' | 'medie' | 'grava' | 'mortala';
}

/**
 * Structura completă a registrului de accidente
 */
export interface RegistruAccidente {
  /** Anul la care se referă registrul */
  an: number;

  /** Organizația pentru care este registrul */
  organizationId: string;

  /** Lista accidentelor înregistrate */
  accidente: AccidentRecord[];

  /** Data ultimei actualizări */
  updatedAt?: string;
}

/**
 * Template gol pentru un nou accident
 */
export const newAccidentTemplate: Omit<AccidentRecord, 'nrCrt'> = {
  dataAccident: '',
  victima: '',
  functie: '',
  locAccident: '',
  imprejurari: '',
  leziuni: '',
  zileITM: 0,
  masuriLuate: '',
  observatii: '',
  dataInregistrare: new Date().toISOString().split('T')[0],
};

/**
 * Coloane pentru afișare în DataTable
 */
export const registruAccidenteColumns = [
  { key: 'nrCrt', label: 'Nr. crt.' },
  { key: 'dataAccident', label: 'Data accidentului' },
  { key: 'victima', label: 'Victima' },
  { key: 'functie', label: 'Funcția' },
  { key: 'locAccident', label: 'Locul accidentului' },
  { key: 'imprejurari', label: 'Împrejurări' },
  { key: 'leziuni', label: 'Leziuni' },
  { key: 'zileITM', label: 'Zile ITM' },
  { key: 'masuriLuate', label: 'Măsuri luate' },
] as const;

/**
 * Validare date accident
 */
export function validateAccidentRecord(record: Partial<AccidentRecord>): string[] {
  const errors: string[] = [];

  if (!record.dataAccident) {
    errors.push('Data accidentului este obligatorie');
  }

  if (!record.victima?.trim()) {
    errors.push('Numele victimei este obligatoriu');
  }

  if (!record.functie?.trim()) {
    errors.push('Funcția este obligatorie');
  }

  if (!record.locAccident?.trim()) {
    errors.push('Locul accidentului este obligatoriu');
  }

  if (!record.imprejurari?.trim()) {
    errors.push('Împrejurările sunt obligatorii');
  }

  if (!record.leziuni?.trim()) {
    errors.push('Natura leziunilor este obligatorie');
  }

  if (record.zileITM === undefined || record.zileITM < 0) {
    errors.push('Numărul de zile ITM trebuie să fie un număr pozitiv');
  }

  if (!record.masuriLuate?.trim()) {
    errors.push('Măsurile luate sunt obligatorii');
  }

  return errors;
}

/**
 * Exportă registrul în format CSV
 */
export function exportRegistruToCSV(accidente: AccidentRecord[]): string {
  const header = 'Nr. crt.,Data accident,Victima,Funcția,Loc accident,Împrejurări,Leziuni,Zile ITM,Măsuri luate,Observații\n';

  const rows = accidente.map(acc => {
    return [
      acc.nrCrt,
      acc.dataAccident,
      `"${acc.victima}"`,
      `"${acc.functie}"`,
      `"${acc.locAccident}"`,
      `"${acc.imprejurari}"`,
      `"${acc.leziuni}"`,
      acc.zileITM,
      `"${acc.masuriLuate}"`,
      `"${acc.observatii || ''}"`,
    ].join(',');
  });

  return header + rows.join('\n');
}
