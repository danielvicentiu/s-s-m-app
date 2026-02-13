/**
 * Template Dosar Cercetare Accident de Muncă
 * Conform HG 1425/2006 privind investigarea și raportarea accidentelor de muncă,
 * bolilor profesionale și evenimentelor deosebite
 */

export interface DateAccident {
  // Date generale
  dataOra: string; // Data și ora accidentului
  locAccident: string; // Locul exact al accidentului
  adresaCompleta: string; // Adresa completă a locului accidentului
  tipAccident: 'mortal' | 'grav' | 'ușor' | 'colectiv'; // Tipul accidentului
  descriereScurta: string; // Descriere scurtă a accidentului

  // Date angajator
  numeAngajator: string;
  cuiAngajator: string;
  adresaAngajator: string;
  reprezentantLegal: string;
  telefonAngajator: string;
  emailAngajator: string;

  // Date activitate
  codCAEN: string; // Codul CAEN al activității
  descriereActivitate: string;
  numarTotalAngajati: number;

  // Martori
  martori: Array<{
    nume: string;
    functie: string;
    telefon: string;
    declaratie: string;
  }>;
}

export interface DateVictima {
  // Identificare
  nume: string;
  prenume: string;
  cnp: string;
  varsta: number;
  sex: 'M' | 'F';

  // Contact
  adresa: string;
  telefon: string;
  email?: string;

  // Date profesionale
  functie: string;
  vechimeInFunctie: string; // ex: "2 ani și 3 luni"
  vechimeTotala: string;
  tipContract: 'nedeterminat' | 'determinat' | 'temporar' | 'detașare';
  dataAngajarii: string;

  // Instruire și autorizare
  instruireSSM: {
    data: string;
    tip: 'introductiv-general' | 'la-locul-de-munca' | 'periodica';
    instructor: string;
  }[];
  controlMedical: {
    data: string;
    apt: boolean;
    restrictii?: string;
  };
  autorizari?: string[]; // Autorizații/atestate necesare

  // Leziuni
  natureLeziuni: string; // Descriere leziuni
  partileCorpuluiAfectate: string[];
  gravitateLeziuni: 'ușoare' | 'medii' | 'grave' | 'mortale';

  // Consecințe
  zilePerdute?: number;
  spitalizare?: {
    spital: string;
    sectie: string;
    perioada: string;
  };
  invaliditate?: {
    grad: string;
    permanenta: boolean;
  };
}

export interface DescriereImprejurari {
  // Contextul muncii
  activitateDesfasurata: string; // Ce făcea victima
  locMuncaDescris: string; // Descriere detaliată loc de muncă
  conditiiMeteorlogice?: string; // Dacă e relevant
  iluminare?: string;

  // Echipamente și materiale
  echipamenteFolosite: Array<{
    denumire: string;
    tipEchipament: string;
    stare: string;
    autorizatia?: string;
  }>;
  epiDistribuite?: Array<{
    tipEPI: string;
    dataDistribuirii: string;
    utilizateLaAccident: boolean;
  }>;

  // Desfășurarea accidentului
  cronoLogieEvenimente: string; // Descriere cronologică
  modProducere: string; // Cum s-a produs accidentul
  factoriContribuitori: string[]; // Factori care au contribuit

  // Primele măsuri
  primSocurs: string; // Cine a acordat primul ajutor
  trasportSpital?: string; // Cum a fost transportat
  autorități: string[]; // Ce autorități au fost anunțate
}

export interface Cauze {
  // Cauze tehnice
  cauzeTehnice: Array<{
    cauza: string;
    descriere: string;
    dovezi: string;
  }>;

  // Cauze organizatorice
  cauzeOrganizatorice: Array<{
    cauza: string;
    descriere: string;
    responsabil?: string;
  }>;

  // Cauze umane
  cauzeUmane: Array<{
    cauza: string;
    descriere: string;
    persoana?: string;
  }>;

  // Cauza directă (principală)
  cauzaDirecta: string;

  // Cauze indirecte
  cauzeIndirecte: string[];

  // Concluzii investigație
  concluziiInvestigatie: string;
}

export interface MasuriPropuse {
  // Măsuri tehnice
  masuriTehnice: Array<{
    masura: string;
    termen: string;
    responsabil: string;
    buget?: number;
    prioritate: 'ridicată' | 'medie' | 'scăzută';
  }>;

  // Măsuri organizatorice
  masuriOrganizatorice: Array<{
    masura: string;
    termen: string;
    responsabil: string;
    prioritate: 'ridicată' | 'medie' | 'scăzută';
  }>;

  // Măsuri de instruire
  masuriInstruire: Array<{
    masura: string;
    publicTinta: string;
    termen: string;
    responsabil: string;
  }>;

  // Măsuri medicale
  masuriMedicale?: Array<{
    masura: string;
    termen: string;
    responsabil: string;
  }>;

  // Sancțiuni propuse
  sanctiuni?: Array<{
    persoana: string;
    functie: string;
    abatere: string;
    sanctiunePropusa: string;
  }>;
}

export interface Concluzie {
  // Clasificare accident
  clasificare: {
    tipAccident: 'de muncă' | 'în legătură cu munca' | 'nu este accident de muncă';
    justificare: string;
  };

  // Responsabilități
  responsabilitati: Array<{
    persoana: string;
    functie: string;
    responsabilitate: string;
    procentContributie?: number;
  }>;

  // Evaluare risc
  evaluareRisc: {
    riscIdentificat: boolean;
    masuriPreventiveExistente: string;
    masuriSuplimentareNecesare: string;
  };

  // Concluzie generală
  concluzieGenerala: string;

  // Recomandări generale
  recomandari: string[];
}

export interface Anexe {
  // Listă anexe
  lista: Array<{
    numarAnex: string;
    denumire: string;
    tipDocument: string;
    descriere?: string;
  }>;

  // Anexe comune
  fotografii?: string[];
  schite?: string[];
  procesVerbal?: string;
  declaratiiMartori?: string[];
  avizeMedicale?: string[];
  rapoarteExpertiza?: string[];
  documenteInstruire?: string[];
  fichaPostului?: string;
  evaluareRisciSSM?: string;
  altele?: string[];
}

export interface DosarCercetareAccident {
  dateAccident: DateAccident;
  dateVictima: DateVictima;
  descriereImprejurari: DescriereImprejurari;
  cauze: Cauze;
  masuriPropuse: MasuriPropuse;
  concluzie: Concluzie;
  anexe: Anexe;

  // Metadata dosar
  metadata: {
    numarDosar: string;
    dataIntocmire: string;
    comisie: Array<{
      nume: string;
      functie: string;
      calitate: 'președinte' | 'membru' | 'secretar';
    }>;
    termenFinalizare: string;
    dataFinalizare?: string;
    status: 'în curs' | 'finalizat' | 'transmis ITM';
  };
}

/**
 * Template gol pentru inițializare dosar nou
 */
export const templateDosarCercetareAccident: Partial<DosarCercetareAccident> = {
  dateAccident: {
    dataOra: '',
    locAccident: '',
    adresaCompleta: '',
    tipAccident: 'ușor',
    descriereScurta: '',
    numeAngajator: '',
    cuiAngajator: '',
    adresaAngajator: '',
    reprezentantLegal: '',
    telefonAngajator: '',
    emailAngajator: '',
    codCAEN: '',
    descriereActivitate: '',
    numarTotalAngajati: 0,
    martori: [],
  },

  dateVictima: {
    nume: '',
    prenume: '',
    cnp: '',
    varsta: 0,
    sex: 'M',
    adresa: '',
    telefon: '',
    functie: '',
    vechimeInFunctie: '',
    vechimeTotala: '',
    tipContract: 'nedeterminat',
    dataAngajarii: '',
    instruireSSM: [],
    controlMedical: {
      data: '',
      apt: false,
    },
    natureLeziuni: '',
    partileCorpuluiAfectate: [],
    gravitateLeziuni: 'ușoare',
  },

  descriereImprejurari: {
    activitateDesfasurata: '',
    locMuncaDescris: '',
    echipamenteFolosite: [],
    cronoLogieEvenimente: '',
    modProducere: '',
    factoriContribuitori: [],
    primSocurs: '',
    autorități: [],
  },

  cauze: {
    cauzeTehnice: [],
    cauzeOrganizatorice: [],
    cauzeUmane: [],
    cauzaDirecta: '',
    cauzeIndirecte: [],
    concluziiInvestigatie: '',
  },

  masuriPropuse: {
    masuriTehnice: [],
    masuriOrganizatorice: [],
    masuriInstruire: [],
  },

  concluzie: {
    clasificare: {
      tipAccident: 'de muncă',
      justificare: '',
    },
    responsabilitati: [],
    evaluareRisc: {
      riscIdentificat: false,
      masuriPreventiveExistente: '',
      masuriSuplimentareNecesare: '',
    },
    concluzieGenerala: '',
    recomandari: [],
  },

  anexe: {
    lista: [],
  },

  metadata: {
    numarDosar: '',
    dataIntocmire: new Date().toISOString().split('T')[0],
    comisie: [],
    termenFinalizare: '',
    status: 'în curs',
  },
};

/**
 * Exemple de cauze comune (pentru autocomplete/suggestions)
 */
export const cauzeComuneAccidente = {
  tehnice: [
    'Lipsa dispozitivelor de protecție pe mașini/utilaje',
    'Defectarea echipamentelor de lucru',
    'Lipsa de întreținere a echipamentelor',
    'Iluminat insuficient',
    'Platforme de lucru nesigure',
    'Scule/unelte defecte',
    'Instalații electrice defecte',
  ],

  organizatorice: [
    'Lipsa instruirii la locul de muncă',
    'Lipsa autorizării pentru lucrări periculoase',
    'Lipsa supravegherii lucrărilor',
    'Nerespectarea procedurilor de lucru',
    'Lipsa evaluării riscurilor',
    'Distribuirea inadecvată a EPI',
    'Organizare defectuoasă a locului de muncă',
  ],

  umane: [
    'Nerespectarea instrucțiunilor de protecția muncii',
    'Nefolosirea echipamentelor de protecție',
    'Oboseală/surmenaj',
    'Lipsă de atenție/concentrare',
    'Grabă excesivă',
    'Improvizație în executarea lucrărilor',
    'Influența alcoolului/substanțelor',
  ],
};

/**
 * Părți ale corpului afectate (listă standard)
 */
export const partiCorpStandard = [
  'Cap',
  'Față',
  'Ochi',
  'Urechi',
  'Gât',
  'Umăr stâng',
  'Umăr drept',
  'Braț stâng',
  'Braț drept',
  'Mână stângă',
  'Mână dreaptă',
  'Degete mână stângă',
  'Degete mână dreaptă',
  'Piept/Torace',
  'Abdomen',
  'Spate',
  'Coloană vertebrală',
  'Bazin',
  'Picior stâng',
  'Picior drept',
  'Genunchi stâng',
  'Genunchi drept',
  'Gleznă stângă',
  'Gleznă dreaptă',
  'Picior stâng (labă)',
  'Picior drept (labă)',
  'Degete picior stâng',
  'Degete picior drept',
  'Membre multiple',
  'Corp întreg',
];

/**
 * Tipuri de leziuni comune
 */
export const tipuriLeziuniComune = [
  'Rană deschisă',
  'Fractură',
  'Luxație',
  'Entorsă',
  'Contuzie',
  'Traumatism cranio-cerebral',
  'Arsură termică',
  'Arsură chimică',
  'Electrocutare',
  'Amputație',
  'Leziuni interne',
  'Intoxicație',
  'Asfixie',
  'Leziuni multiple',
];

export default templateDosarCercetareAccident;
