/**
 * Template Fișă de Aptitudine Medicală
 * Conform HG 355/2007 privind supravegherea sănătății lucrătorilor
 */

export type TipExamenMedical =
  | 'initial'
  | 'periodic'
  | 'la_reluarea_activitatii'
  | 'la_schimbarea_locului_munca';

export type RezultatAptitudine =
  | 'apt'
  | 'apt_conditionat'
  | 'inapt_temporar'
  | 'inapt_permanent';

export interface FactorRisc {
  id: string;
  denumire: string;
  expunere: string; // descriere nivel expunere
}

export interface Restrictie {
  id: string;
  descriere: string;
  valabilitate?: string; // ex: "6 luni", "permanent"
}

export interface Recomandare {
  id: string;
  tip: 'monitorizare' | 'protectie' | 'adaptare_post' | 'alte_masuri';
  descriere: string;
}

export interface DatoarMedic {
  nume: string;
  prenume: string;
  specializare: string;
  parafCodParafa: string;
  unitateMedicala: string;
  telefon?: string;
  email?: string;
}

export interface FisaAptitudineMedicala {
  // Date identificare document
  numarFisa: string;
  dataEmitere: Date;

  // Date angajator
  angajator: {
    denumire: string;
    cui: string;
    adresa: string;
    telefon?: string;
    email?: string;
  };

  // Date angajat
  angajat: {
    nume: string;
    prenume: string;
    cnp: string;
    dataNastere: Date;
    adresa: string;
    telefon?: string;
  };

  // Date post de muncă
  postMunca: {
    functie: string;
    locMunca: string;
    departament?: string;
    codCor?: string; // Clasificarea Ocupațiilor din România
    vechimeInFunctie?: number; // ani
    vechimeTotala?: number; // ani
  };

  // Factori de risc profesional
  factoriRisc: FactorRisc[];

  // Tip examen medical
  tipExamen: TipExamenMedical;
  dataExamen: Date;

  // Istoric examene anterioare
  examenAnterior?: {
    data: Date;
    rezultat: RezultatAptitudine;
  };

  // Rezultat examen
  rezultat: RezultatAptitudine;

  // Restrictii (dacă există)
  restrictii?: Restrictie[];

  // Recomandări medicale
  recomandari?: Recomandare[];

  // Observații suplimentare
  observatii?: string;

  // Valabilitate
  valabilitateStart: Date;
  valabilitateEnd: Date;
  urmatoareaEvaluare?: Date;

  // Date medic de medicina muncii
  medic: DatoarMedic;

  // Semnătura și ștampilă (pentru generare PDF)
  semnatura?: {
    tip: 'electronica' | 'digitalizata';
    data: Date;
    hash?: string; // pentru semnătură electronică
  };
}

/**
 * Constante pentru durata de valabilitate conform HG 355/2007
 */
export const DURATA_VALABILITATE_APTITUDINE = {
  // Valabilitate standard pentru personal apt
  APT_NORMAL: 12, // luni

  // Valabilitate redusă pentru anumite categorii
  APT_CONDITIONAT: 6, // luni
  INAPT_TEMPORAR: 3, // luni (reevaluare)

  // Situații speciale
  TINERI_SUB_18_ANI: 6, // luni
  FACTORI_RISC_RIDICAT: 6, // luni
  BOLI_CRONICE: 6, // luni
} as const;

/**
 * Template implicit pentru fișă de aptitudine
 */
export const FISA_APTITUDINE_TEMPLATE: Omit<
  FisaAptitudineMedicala,
  'numarFisa' | 'dataEmitere' | 'valabilitateStart' | 'valabilitateEnd'
> = {
  angajator: {
    denumire: '',
    cui: '',
    adresa: '',
    telefon: '',
    email: '',
  },
  angajat: {
    nume: '',
    prenume: '',
    cnp: '',
    dataNastere: new Date(),
    adresa: '',
    telefon: '',
  },
  postMunca: {
    functie: '',
    locMunca: '',
    departament: '',
    codCor: '',
    vechimeInFunctie: 0,
    vechimeTotala: 0,
  },
  factoriRisc: [],
  tipExamen: 'initial',
  dataExamen: new Date(),
  rezultat: 'apt',
  restrictii: [],
  recomandari: [],
  observatii: '',
  urmatoareaEvaluare: new Date(),
  medic: {
    nume: '',
    prenume: '',
    specializare: 'Medicina Muncii',
    parafCodParafa: '',
    unitateMedicala: '',
    telefon: '',
    email: '',
  },
};

/**
 * Liste predefinite de factori de risc conform legislației SSM
 */
export const FACTORI_RISC_COMUNE = [
  {
    id: 'zgomot',
    denumire: 'Zgomot',
    categorii: ['< 80 dB', '80-85 dB', '85-87 dB', '> 87 dB'],
  },
  {
    id: 'vibratii',
    denumire: 'Vibrații',
    categorii: ['Vibrații locale', 'Vibrații generale'],
  },
  {
    id: 'praf',
    denumire: 'Praf',
    categorii: ['Praf neiritant', 'Praf fibrogenic', 'Praf toxic'],
  },
  {
    id: 'substante_chimice',
    denumire: 'Substanțe chimice',
    categorii: ['Solvenți organici', 'Acizi/baze', 'Metale grele', 'Pesticide'],
  },
  {
    id: 'agenti_biologici',
    denumire: 'Agenți biologici',
    categorii: ['Grupa 1', 'Grupa 2', 'Grupa 3', 'Grupa 4'],
  },
  {
    id: 'radiatii',
    denumire: 'Radiații',
    categorii: ['UV', 'IR', 'Laser', 'Ionizante'],
  },
  {
    id: 'climat',
    denumire: 'Microclim',
    categorii: ['Temperaturi ridicate', 'Temperaturi scăzute', 'Umiditate'],
  },
  {
    id: 'iluminat',
    denumire: 'Iluminat',
    categorii: ['Iluminat insuficient', 'Orbire', 'Strălucire'],
  },
  {
    id: 'efort_fizic',
    denumire: 'Efort fizic',
    categorii: ['Ridicat-coborât sarcini', 'Poziții vicioase', 'Mișcări repetitive'],
  },
  {
    id: 'inaltime',
    denumire: 'Lucru la înălțime',
    categorii: ['> 2m', '> 5m', '> 10m'],
  },
  {
    id: 'ecrane_vizualizare',
    denumire: 'Ecrane de vizualizare',
    categorii: ['< 4h/zi', '4-6h/zi', '> 6h/zi'],
  },
  {
    id: 'stres',
    denumire: 'Stres ocupațional',
    categorii: ['Sarcină de muncă ridicată', 'Presiune timp', 'Responsabilitate'],
  },
] as const;

/**
 * Template de recomandări frecvente
 */
export const RECOMANDARI_TEMPLATE = [
  {
    tip: 'monitorizare' as const,
    descriere: 'Controale medicale periodice conform graficului',
  },
  {
    tip: 'protectie' as const,
    descriere: 'Utilizarea echipamentului individual de protecție conform fișei postului',
  },
  {
    tip: 'monitorizare' as const,
    descriere: 'Examene paraclinice suplimentare (audiogramă, spirometrie, EKG)',
  },
  {
    tip: 'adaptare_post' as const,
    descriere: 'Limitarea timpului de expunere la factorul de risc',
  },
  {
    tip: 'alte_masuri' as const,
    descriere: 'Măsuri de igienă individuală și colectivă',
  },
  {
    tip: 'monitorizare' as const,
    descriere: 'Vaccinări specifice conform legislației în vigoare',
  },
] as const;

/**
 * Generează număr unic pentru fișa de aptitudine
 */
export function genereazaNumarFisa(
  orgId: string,
  an: number = new Date().getFullYear()
): string {
  const timestamp = Date.now().toString().slice(-6);
  return `FA-${orgId.slice(0, 8).toUpperCase()}-${an}-${timestamp}`;
}

/**
 * Calculează data următoarei evaluări pe baza rezultatului și factorilor de risc
 */
export function calculeazaUrmatoareaEvaluare(
  rezultat: RezultatAptitudine,
  factoriRisc: FactorRisc[],
  varstaAngajat: number
): Date {
  const today = new Date();
  let durata = DURATA_VALABILITATE_APTITUDINE.APT_NORMAL;

  // Ajustări pe baza rezultatului
  if (rezultat === 'apt_conditionat') {
    durata = DURATA_VALABILITATE_APTITUDINE.APT_CONDITIONAT;
  } else if (rezultat === 'inapt_temporar') {
    durata = DURATA_VALABILITATE_APTITUDINE.INAPT_TEMPORAR;
  }

  // Ajustări pe baza vârstei
  if (varstaAngajat < 18) {
    durata = Math.min(durata, DURATA_VALABILITATE_APTITUDINE.TINERI_SUB_18_ANI);
  }

  // Ajustări pe baza factorilor de risc
  const areFactoriRiscRidicat = factoriRisc.some(
    (f) =>
      f.denumire.toLowerCase().includes('toxic') ||
      f.denumire.toLowerCase().includes('cancerigen') ||
      f.expunere.toLowerCase().includes('ridicat')
  );

  if (areFactoriRiscRidicat) {
    durata = Math.min(durata, DURATA_VALABILITATE_APTITUDINE.FACTORI_RISC_RIDICAT);
  }

  const urmatoareaData = new Date(today);
  urmatoareaData.setMonth(urmatoareaData.getMonth() + durata);

  return urmatoareaData;
}

/**
 * Validează completitudinea fișei de aptitudine
 */
export function validateFisaAptitudine(
  fisa: Partial<FisaAptitudineMedicala>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validări câmpuri obligatorii
  if (!fisa.angajator?.denumire) errors.push('Denumirea angajatorului este obligatorie');
  if (!fisa.angajator?.cui) errors.push('CUI angajator este obligatoriu');

  if (!fisa.angajat?.nume) errors.push('Numele angajatului este obligatoriu');
  if (!fisa.angajat?.prenume) errors.push('Prenumele angajatului este obligatoriu');
  if (!fisa.angajat?.cnp) errors.push('CNP angajat este obligatoriu');

  if (!fisa.postMunca?.functie) errors.push('Funcția este obligatorie');
  if (!fisa.postMunca?.locMunca) errors.push('Locul de muncă este obligatoriu');

  if (!fisa.tipExamen) errors.push('Tipul examenului este obligatoriu');
  if (!fisa.rezultat) errors.push('Rezultatul examenului este obligatoriu');

  if (!fisa.medic?.nume) errors.push('Numele medicului este obligatoriu');
  if (!fisa.medic?.parafCodParafa) errors.push('Parafa medicului este obligatorie');

  // Validare CNP
  if (fisa.angajat?.cnp && fisa.angajat.cnp.length !== 13) {
    errors.push('CNP invalid (trebuie să aibă 13 caractere)');
  }

  // Validare factori de risc
  if (!fisa.factoriRisc || fisa.factoriRisc.length === 0) {
    errors.push('Este necesar să fie identificat cel puțin un factor de risc');
  }

  // Validare restrictii pentru apt conditionat
  if (
    fisa.rezultat === 'apt_conditionat' &&
    (!fisa.restrictii || fisa.restrictii.length === 0)
  ) {
    errors.push('Pentru apt condiționat sunt necesare restricții');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculează vârsta pe baza CNP
 */
export function calculeazaVarstadinCNP(cnp: string): number | null {
  if (cnp.length !== 13) return null;

  const sex = parseInt(cnp[0]);
  let an = parseInt(cnp.substring(1, 3));
  const luna = parseInt(cnp.substring(3, 5));
  const zi = parseInt(cnp.substring(5, 7));

  // Determinăm secolul
  if (sex === 1 || sex === 2) {
    an += 1900;
  } else if (sex === 3 || sex === 4) {
    an += 1800;
  } else if (sex === 5 || sex === 6) {
    an += 2000;
  } else if (sex === 7 || sex === 8) {
    an += 2000; // pentru CNP-uri emise după 2000
  } else {
    return null;
  }

  const dataNastere = new Date(an, luna - 1, zi);
  const astazi = new Date();
  let varsta = astazi.getFullYear() - dataNastere.getFullYear();
  const diferentaLuna = astazi.getMonth() - dataNastere.getMonth();

  if (diferentaLuna < 0 || (diferentaLuna === 0 && astazi.getDate() < dataNastere.getDate())) {
    varsta--;
  }

  return varsta;
}
