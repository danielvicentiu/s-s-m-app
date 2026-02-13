/**
 * Șablon pentru Registrul de Instruiri SSM (Securitate și Sănătate în Muncă)
 * Conform Legii nr. 319/2006 și HG 1425/2006
 * Utilizat pentru evidența instruirilor periodice și la angajare
 */

export interface RegistruInstruireEntry {
  nr: number;
  angajat: string;
  functie: string;
  data: string; // Format ISO: YYYY-MM-DD
  tip: TrainingType;
  tematica: string;
  durata: number; // în ore
  instructor: string;
  semnaturaAngajat: string; // Poate fi URL signature pad sau "SEMNAT"
  semnaturaInstructor: string; // Poate fi URL signature pad sau "SEMNAT"
}

export type TrainingType =
  | 'instruire_initiala' // La angajare
  | 'instruire_periodica' // Periodică (anual, semestrial etc.)
  | 'instruire_la_locul_de_munca' // La locul de muncă
  | 'instruire_pentru_lucru' // Pentru lucru (preintrare)
  | 'instruire_suplimentara'; // Suplimentară (schimbare post, echipament nou etc.)

export const TRAINING_TYPE_LABELS: Record<TrainingType, string> = {
  instruire_initiala: 'Instruire inițială (la angajare)',
  instruire_periodica: 'Instruire periodică',
  instruire_la_locul_de_munca: 'Instruire la locul de muncă',
  instruire_pentru_lucru: 'Instruire pentru lucru',
  instruire_suplimentara: 'Instruire suplimentară'
};

/**
 * Tematici standard pentru instruirile SSM
 */
export const TEMATICI_SSM: string[] = [
  'Normele generale de securitate și sănătate în muncă',
  'Riscurile specifice locului de muncă',
  'Măsuri de prevenire a accidentelor de muncă',
  'Utilizarea echipamentelor de protecție individuală (EPI)',
  'Proceduri de urgență și evacuare',
  'Prevenirea și stingerea incendiilor',
  'Acordarea primului ajutor',
  'Manipularea substanțelor periculoase',
  'Ergonomia la locul de muncă',
  'Igiena și sănătatea la locul de muncă',
  'Mașini, utilaje și echipamente de lucru',
  'Lucrul la înălțime',
  'Utilizarea echipamentelor electrice',
  'Transport și manipulare mărfuri',
  'Riscuri psihosociale și stres profesional'
];

/**
 * Durate standard pentru instruiri (în ore)
 */
export const DURATE_STANDARD = {
  instruire_initiala: 8, // 1 zi
  instruire_periodica: 4, // Minim 4 ore/an
  instruire_la_locul_de_munca: 2,
  instruire_pentru_lucru: 1,
  instruire_suplimentara: 2
};

/**
 * Structura coloanelor pentru tabel
 */
export interface RegistruInstruireColumn {
  key: keyof RegistruInstruireEntry;
  label: string;
  width?: string;
  type?: 'text' | 'date' | 'select' | 'number' | 'signature';
}

export const REGISTRU_INSTRUCTAJE_COLUMNS: RegistruInstruireColumn[] = [
  {
    key: 'nr',
    label: 'Nr. crt.',
    width: '60px',
    type: 'number'
  },
  {
    key: 'angajat',
    label: 'Nume și prenume angajat',
    width: '180px',
    type: 'text'
  },
  {
    key: 'functie',
    label: 'Funcția',
    width: '150px',
    type: 'text'
  },
  {
    key: 'data',
    label: 'Data instruirii',
    width: '120px',
    type: 'date'
  },
  {
    key: 'tip',
    label: 'Tipul instruirii',
    width: '180px',
    type: 'select'
  },
  {
    key: 'tematica',
    label: 'Tematica instruirii',
    width: '250px',
    type: 'text'
  },
  {
    key: 'durata',
    label: 'Durata (ore)',
    width: '100px',
    type: 'number'
  },
  {
    key: 'instructor',
    label: 'Instructor SSM',
    width: '150px',
    type: 'text'
  },
  {
    key: 'semnaturaAngajat',
    label: 'Semnătura angajat',
    width: '120px',
    type: 'signature'
  },
  {
    key: 'semnaturaInstructor',
    label: 'Semnătura instructor',
    width: '120px',
    type: 'signature'
  }
];

/**
 * Date exemple pentru registru (pentru testing/demo)
 */
export const REGISTRU_INSTRUCTAJE_SAMPLE: RegistruInstruireEntry[] = [
  {
    nr: 1,
    angajat: 'Popescu Ion',
    functie: 'Electrician',
    data: '2026-01-15',
    tip: 'instruire_initiala',
    tematica: 'Normele generale de securitate și sănătate în muncă, Utilizarea echipamentelor electrice',
    durata: 8,
    instructor: 'Ionescu Maria - Consultant SSM',
    semnaturaAngajat: 'SEMNAT',
    semnaturaInstructor: 'SEMNAT'
  },
  {
    nr: 2,
    angajat: 'Vasilescu Ana',
    functie: 'Contabil',
    data: '2026-01-20',
    tip: 'instruire_periodica',
    tematica: 'Proceduri de urgență și evacuare, Prevenirea și stingerea incendiilor',
    durata: 4,
    instructor: 'Ionescu Maria - Consultant SSM',
    semnaturaAngajat: 'SEMNAT',
    semnaturaInstructor: 'SEMNAT'
  },
  {
    nr: 3,
    angajat: 'Georgescu Mihai',
    functie: 'Sudor',
    data: '2026-01-22',
    tip: 'instruire_la_locul_de_munca',
    tematica: 'Riscurile specifice locului de muncă, Manipularea substanțelor periculoase',
    durata: 2,
    instructor: 'Popa Daniel - Maistru',
    semnaturaAngajat: 'SEMNAT',
    semnaturaInstructor: 'SEMNAT'
  }
];

/**
 * Helper pentru validarea unei înregistrări din registru
 */
export function validateRegistruEntry(entry: Partial<RegistruInstruireEntry>): string[] {
  const errors: string[] = [];

  if (!entry.angajat || entry.angajat.trim() === '') {
    errors.push('Numele angajatului este obligatoriu');
  }

  if (!entry.functie || entry.functie.trim() === '') {
    errors.push('Funcția este obligatorie');
  }

  if (!entry.data) {
    errors.push('Data instruirii este obligatorie');
  }

  if (!entry.tip) {
    errors.push('Tipul instruirii este obligatoriu');
  }

  if (!entry.tematica || entry.tematica.trim() === '') {
    errors.push('Tematica instruirii este obligatorie');
  }

  if (!entry.durata || entry.durata <= 0) {
    errors.push('Durata trebuie să fie mai mare de 0 ore');
  }

  if (!entry.instructor || entry.instructor.trim() === '') {
    errors.push('Instructorul este obligatoriu');
  }

  return errors;
}

/**
 * Helper pentru generarea numărului următor în registru
 */
export function getNextEntryNumber(existingEntries: RegistruInstruireEntry[]): number {
  if (existingEntries.length === 0) return 1;
  const maxNr = Math.max(...existingEntries.map(e => e.nr));
  return maxNr + 1;
}

export default {
  REGISTRU_INSTRUCTAJE_COLUMNS,
  REGISTRU_INSTRUCTAJE_SAMPLE,
  TRAINING_TYPE_LABELS,
  TEMATICI_SSM,
  DURATE_STANDARD,
  validateRegistruEntry,
  getNextEntryNumber
};
