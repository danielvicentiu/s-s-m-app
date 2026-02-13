/**
 * Template pentru Proces Verbal de Instruire SSM
 * Conform cerințelor legislative pentru documentarea instruirilor de SSM
 */

export interface ParticipantInstruire {
  nr: number;
  nume: string;
  functie: string;
  semnatura?: string; // Base64 encoded signature image sau text
}

export interface ProcesVerbalInstruireData {
  // Informații generale
  data: string; // ISO date string
  ora: string; // HH:mm format

  // Detalii instruire
  tipInstruire: 'initiala' | 'periodica' | 'la_locul_de_munca' | 'pentru_situatii_de_urgenta' | 'suplimentara';
  tematica: string;
  durata: number; // În minute

  // Responsabili
  instructor: {
    nume: string;
    functie: string;
    atestare?: string; // Număr certificat/atestare
    semnatura?: string;
  };

  // Participanți
  participanti: ParticipantInstruire[];

  // Observații
  observatii?: string;

  // Metadata
  organizationId: string;
  locationId?: string;
}

export interface ProcesVerbalInstruireTemplate {
  data: ProcesVerbalInstruireData;
  generatedAt: string;
  generatedBy: string;
}

/**
 * Tipuri de instruire SSM conform legislației
 */
export const TIPURI_INSTRUIRE = {
  initiala: 'Instruire inițială (generală)',
  periodica: 'Instruire periodică',
  la_locul_de_munca: 'Instruire la locul de muncă',
  pentru_situatii_de_urgenta: 'Instruire pentru situații de urgență',
  suplimentara: 'Instruire suplimentară'
} as const;

/**
 * Tematici standard pentru instruiri SSM
 */
export const TEMATICI_STANDARD = [
  'Legislația în domeniul sănătății și securității în muncă',
  'Riscuri de accidentare și îmbolnăvire profesională specifice locului de muncă',
  'Măsuri de prevenire și protecție',
  'Prevenirea și stingerea incendiilor',
  'Proceduri de prim ajutor',
  'Utilizarea echipamentelor de protecție',
  'Proceduri de evacuare și situații de urgență',
  'Manipularea substanțelor periculoase',
  'Ergonomie și lucru la calculator',
  'Utilizarea în siguranță a utilajelor și echipamentelor de lucru'
];

/**
 * Durată minimă instruiri conform legislației (în minute)
 */
export const DURATA_MINIMA_INSTRUIRE = {
  initiala: 480, // 8 ore (1 zi)
  periodica: 60, // 1 oră
  la_locul_de_munca: 180, // 3 ore
  pentru_situatii_de_urgenta: 120, // 2 ore
  suplimentara: 60 // 1 oră
} as const;

/**
 * Generează un template gol pentru proces verbal de instruire
 */
export function createEmptyProcesVerbalTemplate(
  organizationId: string,
  userId: string
): ProcesVerbalInstruireTemplate {
  const now = new Date();

  return {
    data: {
      data: now.toISOString().split('T')[0],
      ora: now.toTimeString().slice(0, 5),
      tipInstruire: 'periodica',
      tematica: '',
      durata: 60,
      instructor: {
        nume: '',
        functie: 'Consultant SSM',
        atestare: '',
        semnatura: undefined
      },
      participanti: [],
      observatii: '',
      organizationId,
      locationId: undefined
    },
    generatedAt: now.toISOString(),
    generatedBy: userId
  };
}

/**
 * Validează datele procesului verbal
 */
export function validateProcesVerbalData(data: ProcesVerbalInstruireData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validare date obligatorii
  if (!data.data) {
    errors.push('Data instruirii este obligatorie');
  }

  if (!data.ora) {
    errors.push('Ora instruirii este obligatorie');
  }

  if (!data.tematica || data.tematica.trim() === '') {
    errors.push('Tematica instruirii este obligatorie');
  }

  if (!data.instructor.nume || data.instructor.nume.trim() === '') {
    errors.push('Numele instructorului este obligatoriu');
  }

  if (!data.participanti || data.participanti.length === 0) {
    errors.push('Trebuie să existe cel puțin un participant');
  }

  // Validare durată minimă
  const durataMinimaRequirement = DURATA_MINIMA_INSTRUIRE[data.tipInstruire];
  if (data.durata < durataMinimaRequirement) {
    errors.push(
      `Durata minimă pentru ${TIPURI_INSTRUIRE[data.tipInstruire]} este ${durataMinimaRequirement} minute`
    );
  }

  // Validare participanți
  data.participanti.forEach((participant, index) => {
    if (!participant.nume || participant.nume.trim() === '') {
      errors.push(`Participantul ${index + 1}: numele este obligatoriu`);
    }
    if (!participant.functie || participant.functie.trim() === '') {
      errors.push(`Participantul ${index + 1}: funcția este obligatorie`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Formatează datele pentru afișare în PDF/print
 */
export function formatProcesVerbalForPrint(data: ProcesVerbalInstruireData): string {
  const formattedDate = new Date(data.data).toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
PROCES VERBAL DE INSTRUIRE
privind sănătatea și securitatea în muncă

Data: ${formattedDate}
Ora: ${data.ora}

Tipul instruirii: ${TIPURI_INSTRUIRE[data.tipInstruire]}
Tematica: ${data.tematica}
Durata: ${data.durata} minute (${Math.floor(data.durata / 60)}h ${data.durata % 60}min)

INSTRUCTOR:
Nume: ${data.instructor.nume}
Funcție: ${data.instructor.functie}
${data.instructor.atestare ? `Atestare/Certificat: ${data.instructor.atestare}` : ''}

PARTICIPANȚI:

Nr. | Nume și Prenume | Funcție | Semnătură
----|-----------------|---------|----------
${data.participanti.map(p => `${p.nr}   | ${p.nume} | ${p.functie} | ${p.semnatura ? '✓' : '.........'}`).join('\n')}

${data.observatii ? `\nOBSERVAȚII:\n${data.observatii}\n` : ''}

Semnătura instructorului: ${data.instructor.semnatura ? '✓' : '.........................'}
  `.trim();
}
