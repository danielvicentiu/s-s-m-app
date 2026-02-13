/**
 * Template pentru Fișa de Aptitudine Medicală
 * Conform HG 355/2007 privind supravegherea sănătății lucrătorilor
 */

export interface FisaAptitudineTemplate {
  // Informații angajator
  angajator: {
    denumire: string;
    cui: string;
    adresa: string;
    telefon: string;
    email: string;
  };

  // Informații angajat
  angajat: {
    nume: string;
    prenume: string;
    cnp: string;
    dataNasterii: string;
    adresa: string;
    telefon: string;
  };

  // Informații post de muncă
  postMunca: {
    functie: string;
    compartiment: string;
    dataAngajarii: string;
    tipContract: 'nedeterminat' | 'determinat' | 'temporar';
  };

  // Factori de risc profesional
  factoriRisc: {
    fizici: string[];
    chimici: string[];
    biologici: string[];
    ergonomici: string[];
    psiho_organizationali: string[];
  };

  // Tip examen medical
  tipExamen: {
    tip: 'initial' | 'periodic' | 'reluare' | 'schimbare_loc_munca' | 'la_cerere';
    data: string;
    numarFisa: string;
  };

  // Rezultat examinare
  rezultat: {
    aptitudine: 'apt' | 'apt_cu_restrictii' | 'inapt_temporar' | 'inapt_permanent';
    motivatie: string;
    restrictii?: string[];
    valabilitateAni?: number;
    dataUrmatorExamen?: string;
  };

  // Restricții și recomandări
  restrictii?: {
    contraindicatii: string[];
    recomandari: string[];
    masuri_protectie: string[];
  };

  // Medic medicina muncii
  medic: {
    nume: string;
    prenume: string;
    parafa: string;
    codParafa: string;
    competentaMM: string;
    telefon: string;
    email: string;
  };

  // Date administrative
  metadate: {
    dataEmitere: string;
    dataExpirare?: string;
    numarInregistrare: string;
    observatii?: string;
  };
}

export const FACTORI_RISC_OPTIONS = {
  fizici: [
    'Zgomot',
    'Vibrații',
    'Iluminat inadecvat',
    'Microclimă inadecvată',
    'Radiații ionizante',
    'Radiații neionizante',
    'Presiune barometrică anormală',
    'Efort fizic',
  ],
  chimici: [
    'Substanțe toxice',
    'Substanțe corozive',
    'Substanțe iritante',
    'Substanțe sensibilizante',
    'Praf',
    'Fum',
    'Vapori',
    'Aerosoli',
  ],
  biologici: [
    'Bacterii',
    'Virusuri',
    'Ciuperci',
    'Paraziți',
    'Alergeni biologici',
  ],
  ergonomici: [
    'Mișcări repetitive',
    'Poziții forțate',
    'Manipulare manuală',
    'Efort static',
    'Lucru la înălțime',
    'Lucru pe ecran',
  ],
  psiho_organizationali: [
    'Stres ocupațional',
    'Lucru în ture',
    'Lucru nocturn',
    'Relații interpersonale',
    'Volum mare de muncă',
    'Responsabilitate crescută',
  ],
} as const;

export const TIP_EXAMEN_OPTIONS = [
  { value: 'initial', label: 'Examen medical la angajare' },
  { value: 'periodic', label: 'Examen medical periodic' },
  { value: 'reluare', label: 'Examen medical la reluarea activității' },
  { value: 'schimbare_loc_munca', label: 'Examen medical la schimbarea locului de muncă' },
  { value: 'la_cerere', label: 'Examen medical la cerere' },
] as const;

export const APTITUDINE_OPTIONS = [
  { value: 'apt', label: 'Apt', color: 'green' },
  { value: 'apt_cu_restrictii', label: 'Apt cu restricții', color: 'yellow' },
  { value: 'inapt_temporar', label: 'Inapt temporar', color: 'orange' },
  { value: 'inapt_permanent', label: 'Inapt permanent', color: 'red' },
] as const;

export const TIP_CONTRACT_OPTIONS = [
  { value: 'nedeterminat', label: 'Nedeterminat' },
  { value: 'determinat', label: 'Determinat' },
  { value: 'temporar', label: 'Temporar' },
] as const;

/**
 * Template gol pentru creare fișă nouă
 */
export const createEmptyFisaAptitudine = (): Partial<FisaAptitudineTemplate> => ({
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
    dataNasterii: '',
    adresa: '',
    telefon: '',
  },
  postMunca: {
    functie: '',
    compartiment: '',
    dataAngajarii: '',
    tipContract: 'nedeterminat',
  },
  factoriRisc: {
    fizici: [],
    chimici: [],
    biologici: [],
    ergonomici: [],
    psiho_organizationali: [],
  },
  tipExamen: {
    tip: 'initial',
    data: new Date().toISOString().split('T')[0],
    numarFisa: '',
  },
  rezultat: {
    aptitudine: 'apt',
    motivatie: '',
    restrictii: [],
  },
  medic: {
    nume: '',
    prenume: '',
    parafa: '',
    codParafa: '',
    competentaMM: '',
    telefon: '',
    email: '',
  },
  metadate: {
    dataEmitere: new Date().toISOString().split('T')[0],
    numarInregistrare: '',
  },
});

/**
 * Validare CNP
 */
export const validateCNP = (cnp: string): boolean => {
  if (!/^\d{13}$/.test(cnp)) return false;

  const controlKey = '279146358279';
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnp[i]) * parseInt(controlKey[i]);
  }

  const remainder = sum % 11;
  const control = remainder === 10 ? 1 : remainder;

  return control === parseInt(cnp[12]);
};

/**
 * Calculare dată următorului examen medical
 */
export const calculateNextExamDate = (
  currentDate: string,
  valabilitateAni: number
): string => {
  const date = new Date(currentDate);
  date.setFullYear(date.getFullYear() + valabilitateAni);
  return date.toISOString().split('T')[0];
};
