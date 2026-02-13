/**
 * Template pentru Proces Verbal de Instruire SSM
 * Utilizat pentru generarea documentelor de instruire în domeniul
 * Securității și Sănătății în Muncă
 */

export interface InstruireParticipant {
  nume: string;
  prenume: string;
  functie: string;
  semnatura?: string;
}

export interface ProcesVerbalInstruireData {
  // Informații generale
  numarPV: string;
  data: string; // format: DD.MM.YYYY
  ora: string; // format: HH:MM

  // Organizație
  denumireOrganizatie: string;
  cuiOrganizatie?: string;
  adresaOrganizatie?: string;

  // Tip instruire
  tipInstruire: 'initial' | 'periodic' | 'la_locul_de_munca' | 'pentru_executie' | 'suplimentar';

  // Tematică
  tematica: string[];

  // Instructor
  instructorNume: string;
  instructorPrenume: string;
  instructorFunctie: string;
  instructorSemnatura?: string;

  // Participanți
  participanti: InstruireParticipant[];

  // Detalii instruire
  durata: number; // în minute
  locDesfasurare?: string;

  // Observații
  observatii?: string;

  // Semnături și validare
  semnaturaInstructor?: string;
  dataValidare?: string;
}

/**
 * Template implicit pentru tematică instruire SSM
 */
export const TEMATICA_INSTRUIRE_TEMPLATES = {
  initial: [
    'Legislația în domeniul securității și sănătății în muncă',
    'Riscurile profesionale specifice locului de muncă',
    'Măsuri de prevenire și protecție',
    'Echipamente individuale de protecție (EIP)',
    'Proceduri de urgență și evacuare',
    'Drepturi și obligații în domeniul SSM',
    'Raportarea incidentelor și accidentelor de muncă'
  ],
  periodic: [
    'Actualizări legislative SSM',
    'Analiza incidentelor din perioada anterioară',
    'Verificarea cunoștințelor despre riscurile profesionale',
    'Reîmprospătarea procedurilor de urgență',
    'Utilizarea corectă a echipamentelor de protecție',
    'Bune practici în domeniul SSM'
  ],
  la_locul_de_munca: [
    'Riscurile specifice postului de lucru',
    'Modul de utilizare a echipamentelor de lucru',
    'Proceduri de lucru în siguranță',
    'Echipamente de protecție necesare',
    'Măsuri de prim ajutor specifice',
    'Situații de urgență la locul de muncă'
  ],
  pentru_executie: [
    'Descrierea lucrării care urmează a fi executată',
    'Riscurile asociate lucrării respective',
    'Măsuri de protecție colectivă și individuală',
    'Succesiunea operațiilor și responsabilități',
    'Proceduri în caz de situații neprevăzute',
    'Verificări înainte, în timpul și după execuție'
  ],
  suplimentar: [
    'Motive care au determinat instruirea suplimentară',
    'Noi riscuri identificate',
    'Modificări ale procesului de muncă',
    'Noi echipamente sau tehnologii',
    'Măsuri corective și preventive',
    'Responsabilități actualizate'
  ]
} as const;

/**
 * Durate recomandate pentru instruiri (în minute)
 */
export const DURATA_RECOMANDATA = {
  initial: 240, // 4 ore
  periodic: 120, // 2 ore
  la_locul_de_munca: 60, // 1 oră
  pentru_executie: 30, // 30 minute
  suplimentar: 60 // 1 oră
} as const;

/**
 * Generează template gol pentru proces verbal de instruire
 */
export function createEmptyProcesVerbalInstruire(
  tipInstruire: ProcesVerbalInstruireData['tipInstruire'] = 'periodic'
): ProcesVerbalInstruireData {
  const now = new Date();
  const dataFormatata = now.toLocaleDateString('ro-RO');
  const oraFormatata = now.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });

  return {
    numarPV: '',
    data: dataFormatata,
    ora: oraFormatata,
    denumireOrganizatie: '',
    tipInstruire,
    tematica: TEMATICA_INSTRUIRE_TEMPLATES[tipInstruire] || [],
    instructorNume: '',
    instructorPrenume: '',
    instructorFunctie: 'Responsabil SSM',
    participanti: [],
    durata: DURATA_RECOMANDATA[tipInstruire] || 60,
    observatii: ''
  };
}

/**
 * Validează datele procesului verbal de instruire
 */
export function validateProcesVerbalInstruire(data: ProcesVerbalInstruireData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.numarPV || data.numarPV.trim() === '') {
    errors.push('Numărul PV este obligatoriu');
  }

  if (!data.data || data.data.trim() === '') {
    errors.push('Data este obligatorie');
  }

  if (!data.ora || data.ora.trim() === '') {
    errors.push('Ora este obligatorie');
  }

  if (!data.denumireOrganizatie || data.denumireOrganizatie.trim() === '') {
    errors.push('Denumirea organizației este obligatorie');
  }

  if (!data.instructorNume || data.instructorNume.trim() === '') {
    errors.push('Numele instructorului este obligatoriu');
  }

  if (!data.instructorPrenume || data.instructorPrenume.trim() === '') {
    errors.push('Prenumele instructorului este obligatoriu');
  }

  if (!data.tematica || data.tematica.length === 0) {
    errors.push('Tematica instruirii este obligatorie');
  }

  if (!data.participanti || data.participanti.length === 0) {
    errors.push('Este necesar cel puțin un participant');
  }

  // Validare participanți
  data.participanti.forEach((participant, index) => {
    if (!participant.nume || participant.nume.trim() === '') {
      errors.push(`Participant ${index + 1}: Numele este obligatoriu`);
    }
    if (!participant.prenume || participant.prenume.trim() === '') {
      errors.push(`Participant ${index + 1}: Prenumele este obligatoriu`);
    }
    if (!participant.functie || participant.functie.trim() === '') {
      errors.push(`Participant ${index + 1}: Funcția este obligatorie`);
    }
  });

  if (data.durata <= 0) {
    errors.push('Durata instruirii trebuie să fie mai mare de 0 minute');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Formatează tipul instruirii pentru afișare
 */
export function formatTipInstruire(tip: ProcesVerbalInstruireData['tipInstruire']): string {
  const mapping = {
    initial: 'Instruire Inițială',
    periodic: 'Instruire Periodică',
    la_locul_de_munca: 'Instruire la Locul de Muncă',
    pentru_executie: 'Instruire pentru Executie',
    suplimentar: 'Instruire Suplimentară'
  };

  return mapping[tip] || tip;
}

/**
 * Calculează data următoarei instruiri în funcție de tip
 */
export function calculeazaDataUrmatoareInstruire(
  dataInstruire: string,
  tipInstruire: ProcesVerbalInstruireData['tipInstruire']
): string | null {
  // Doar instruirea periodică are o dată următoare programată
  if (tipInstruire !== 'periodic') {
    return null;
  }

  // Instruire periodică: la 12 luni (conform legislației SSM din România)
  const dataParts = dataInstruire.split('.');
  if (dataParts.length !== 3) {
    return null;
  }

  const [zi, luna, an] = dataParts;
  const data = new Date(parseInt(an), parseInt(luna) - 1, parseInt(zi));
  data.setFullYear(data.getFullYear() + 1);

  return data.toLocaleDateString('ro-RO');
}
