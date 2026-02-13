/**
 * Template pentru Fișa individuală de instruire SSM
 * Conform Anexa 11 la HG 1425/2006
 *
 * Structură completă pentru instruirea angajaților în domeniul
 * securității și sănătății în muncă (SSM)
 */

export interface DatePersonale {
  nume: string;
  prenume: string;
  cnp: string;
  functie: string;
  locMunca: string;
  dataAngajarii?: string;
  numarLegitimatie?: string;
}

export interface InstruireRecord {
  data: string; // ISO format: YYYY-MM-DD
  durata: number; // în ore
  materialFolosit: string;
  tematica: string;
  numePrenumeConductor: string;
  functieInstructor: string;
  semnaturaAngajat?: string;
  semnaturaInstructor?: string;
  observatii?: string;
}

export interface InstruireIntroductivGenerala extends InstruireRecord {
  tipInstruire: 'introductiv-generala';
  // Specifică regulilor generale SSM la nivelul unității
  locDesfasurare?: string;
}

export interface InstruireLaLoculDeMunca extends InstruireRecord {
  tipInstruire: 'la-locul-de-munca';
  // Specifică riscurilor de la locul de muncă concret
  riscuriIdentificate?: string[];
  echipamenteProtectie?: string[];
}

export interface InstruirePeriodica extends InstruireRecord {
  tipInstruire: 'periodica';
  luna: number; // 1-12
  an: number;
  // Repetată conform periodicității stabilite (lunar, trimestrial, anual)
  periodicitate?: 'lunara' | 'trimestriala' | 'semestriala' | 'anuala';
}

export interface InstruireSuplimentara extends InstruireRecord {
  tipInstruire: 'suplimentara';
  motiv: string;
  // La reluarea activității după absență > 30 zile, schimbarea locului de muncă, etc.
}

export interface FisaIndividualaInstruire {
  // Date de identificare
  datePersonale: DatePersonale;

  // Instruire introductiv-generală (obligatorie la angajare)
  instruireIntroductivGenerala?: InstruireIntroductivGenerala;

  // Instruire la locul de muncă (obligatorie la angajare)
  instruireLaLoculDeMunca?: InstruireLaLoculDeMunca;

  // Instruire periodică (12 luni, conform periodicității stabilite)
  instruirePeriodica: InstruirePeriodica[];

  // Instruiri suplimentare (opțional)
  instruiriSuplimentare?: InstruireSuplimentara[];

  // Metadata
  organizationId?: string;
  employeeId?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

/**
 * Template gol pentru o fișă nouă de instruire
 */
export const fisaInstruireTemplate: FisaIndividualaInstruire = {
  datePersonale: {
    nume: '',
    prenume: '',
    cnp: '',
    functie: '',
    locMunca: '',
    dataAngajarii: '',
    numarLegitimatie: '',
  },
  instruirePeriodica: [],
  instruiriSuplimentare: [],
};

/**
 * Template pentru instruire introductiv-generală
 */
export const instruireIntroductivGeneralaTemplate: InstruireIntroductivGenerala = {
  tipInstruire: 'introductiv-generala',
  data: new Date().toISOString().split('T')[0],
  durata: 8, // ore (conform legislației, min. 8 ore)
  materialFolosit: '',
  tematica: 'Legislație SSM, organizarea SSM în unitate, drepturi și obligații, proceduri de urgență',
  numePrenumeConductor: '',
  functieInstructor: 'Conducător instruire SSM',
  locDesfasurare: '',
  observatii: '',
};

/**
 * Template pentru instruire la locul de muncă
 */
export const instruireLaLoculDeMuncaTemplate: InstruireLaLoculDeMunca = {
  tipInstruire: 'la-locul-de-munca',
  data: new Date().toISOString().split('T')[0],
  durata: 8, // ore (conform legislației, min. 8 ore pentru locuri fără risc special)
  materialFolosit: '',
  tematica: 'Riscuri specifice locului de muncă, măsuri de prevenire, echipamente de protecție',
  numePrenumeConductor: '',
  functieInstructor: 'Șef ierarhic / Instructor SSM',
  riscuriIdentificate: [],
  echipamenteProtectie: [],
  observatii: '',
};

/**
 * Template pentru instruire periodică
 */
export const instruirePeriodicaTemplate: Omit<InstruirePeriodica, 'luna' | 'an'> = {
  tipInstruire: 'periodica',
  data: new Date().toISOString().split('T')[0],
  durata: 2, // ore (variază în funcție de periodicitate)
  materialFolosit: '',
  tematica: 'Reîmprospătare cunoștințe SSM, proceduri actualizate, cazuri de accidente',
  numePrenumeConductor: '',
  functieInstructor: 'Șef ierarhic / Instructor SSM',
  periodicitate: 'lunara',
  observatii: '',
};

/**
 * Generează o fișă completă cu date inițiale
 */
export function generateFisaData(
  datePersonale: DatePersonale,
  options?: {
    includeInstruireIntroductiv?: boolean;
    includeInstruireLaLocMunca?: boolean;
    generatePeriodicaPentruAn?: number;
  }
): FisaIndividualaInstruire {
  const fisa: FisaIndividualaInstruire = {
    datePersonale,
    instruirePeriodica: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Adaugă instruire introductiv-generală
  if (options?.includeInstruireIntroductiv) {
    fisa.instruireIntroductivGenerala = {
      ...instruireIntroductivGeneralaTemplate,
      data: datePersonale.dataAngajarii || new Date().toISOString().split('T')[0],
    };
  }

  // Adaugă instruire la locul de muncă
  if (options?.includeInstruireLaLocMunca) {
    const dataInstruire = datePersonale.dataAngajarii
      ? new Date(datePersonale.dataAngajarii)
      : new Date();

    // Instruirea la locul de muncă se face de obicei imediat după cea introductiv-generală
    dataInstruire.setDate(dataInstruire.getDate() + 1);

    fisa.instruireLaLoculDeMunca = {
      ...instruireLaLoculDeMuncaTemplate,
      data: dataInstruire.toISOString().split('T')[0],
    };
  }

  // Generează template-uri pentru instruire periodică (12 luni)
  if (options?.generatePeriodicaPentruAn) {
    const an = options.generatePeriodicaPentruAn;
    fisa.instruirePeriodica = Array.from({ length: 12 }, (_, index) => ({
      ...instruirePeriodicaTemplate,
      luna: index + 1,
      an,
      data: new Date(an, index, 1).toISOString().split('T')[0],
    }));
  }

  return fisa;
}

/**
 * Validează structura unei fișe de instruire
 */
export function validateFisaInstruire(fisa: FisaIndividualaInstruire): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validare date personale obligatorii
  if (!fisa.datePersonale.nume?.trim()) {
    errors.push('Numele este obligatoriu');
  }
  if (!fisa.datePersonale.prenume?.trim()) {
    errors.push('Prenumele este obligatoriu');
  }
  if (!fisa.datePersonale.cnp?.trim()) {
    errors.push('CNP este obligatoriu');
  }
  if (!fisa.datePersonale.functie?.trim()) {
    errors.push('Funcția este obligatorie');
  }
  if (!fisa.datePersonale.locMunca?.trim()) {
    errors.push('Locul de muncă este obligatoriu');
  }

  // Validare CNP (13 caractere)
  if (fisa.datePersonale.cnp && fisa.datePersonale.cnp.length !== 13) {
    errors.push('CNP trebuie să conțină 13 caractere');
  }

  // Avertizare dacă lipsesc instruirile obligatorii
  if (!fisa.instruireIntroductivGenerala) {
    errors.push('Instruirea introductiv-generală este obligatorie la angajare');
  }
  if (!fisa.instruireLaLoculDeMunca) {
    errors.push('Instruirea la locul de muncă este obligatorie la angajare');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Helper pentru adăugarea unei instruiri periodice
 */
export function addInstruirePeriodica(
  fisa: FisaIndividualaInstruire,
  instruire: InstruirePeriodica
): FisaIndividualaInstruire {
  return {
    ...fisa,
    instruirePeriodica: [...fisa.instruirePeriodica, instruire],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Helper pentru verificarea instruirilor la zi
 */
export function checkInstruiriLaZi(
  fisa: FisaIndividualaInstruire,
  dataReferinta?: Date
): {
  laZi: boolean;
  ultimaInstruire?: InstruirePeriodica;
  zileDelaUltimaInstruire?: number;
} {
  const referinta = dataReferinta || new Date();

  if (fisa.instruirePeriodica.length === 0) {
    return { laZi: false };
  }

  // Sortează instruirile după dată
  const instruiriSortate = [...fisa.instruirePeriodica].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  const ultimaInstruire = instruiriSortate[0];
  const dataUltimaInstruire = new Date(ultimaInstruire.data);
  const diferentaZile = Math.floor(
    (referinta.getTime() - dataUltimaInstruire.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Verifică periodicitatea (presupunem lunară = max 35 zile)
  const laZi = diferentaZile <= 35;

  return {
    laZi,
    ultimaInstruire,
    zileDelaUltimaInstruire: diferentaZile,
  };
}

export default fisaInstruireTemplate;
