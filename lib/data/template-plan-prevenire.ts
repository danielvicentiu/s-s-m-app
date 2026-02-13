/**
 * Template pentru Plan de Prevenire si Protectie
 * Conform art. 13 din Legea 319/2006 privind securitatea si sanatatea in munca
 */

export interface DateIdentificare {
  denumireOrganizatie: string;
  cui: string;
  adresa: string;
  telefon: string;
  email: string;
  codCAEN: string;
  activitatePrincipala: string;
  numarAngajati: number;
  numarLocuriMunca: number;
  dataElaborare: string;
  revizie: number;
  dataRevizie?: string;
}

export interface EvaluareRisc {
  id: string;
  codRisc: string;
  denumireRisc: string;
  locatieRisc: string;
  descriereRisc: string;
  probabilitate: 'Redusă' | 'Medie' | 'Mare';
  gravitate: 'Redusă' | 'Medie' | 'Mare' | 'Foarte mare';
  nivelRisc: 'Acceptabil' | 'Moderat' | 'Substanțial' | 'Critic';
  categorieRisc: 'Mecanic' | 'Electric' | 'Chimic' | 'Fizic' | 'Biologic' | 'Ergonomic' | 'Psihosocial';
  posturiAfectate: string[];
  numarPersoneExpuse: number;
  legislatie?: string[];
}

export interface MasuraTehnica {
  id: string;
  codMasura: string;
  denumire: string;
  descriere: string;
  riscuriAsociate: string[]; // ID-uri din evaluareRiscuri
  status: 'Implementată' | 'În curs' | 'Planificată';
  dataImplementare?: string;
  verificare: {
    periodicitate: string;
    ultimaVerificare?: string;
    urmatoareaVerificare?: string;
  };
  responsabil: string;
  observatii?: string;
}

export interface MasuraOrganizatorica {
  id: string;
  codMasura: string;
  denumire: string;
  descriere: string;
  riscuriAsociate: string[];
  tipMasura: 'Procedură' | 'Instrucțiune' | 'Instruire' | 'Verificare' | 'Supraveghere' | 'Altele';
  status: 'Implementată' | 'În curs' | 'Planificată';
  dataImplementare?: string;
  periodicitate?: string;
  responsabil: string;
  documenteAsociate?: string[];
  observatii?: string;
}

export interface MasuraIgienosanitara {
  id: string;
  codMasura: string;
  denumire: string;
  descriere: string;
  categorie: 'Igienă individuală' | 'Igienă colectivă' | 'Climatizare/Ventilație' | 'Iluminat' | 'Altele';
  locatie: string;
  status: 'Implementată' | 'În curs' | 'Planificată';
  verificare: {
    periodicitate: string;
    ultimaVerificare?: string;
    urmatoareaVerificare?: string;
  };
  responsabil: string;
  observatii?: string;
}

export interface MasuriPrimAjutor {
  truseDisponibile: {
    locatie: string;
    tipTrusa: string;
    dataExpirare: string;
    responsabilVerificare: string;
  }[];
  persoanePregatitefirstAid: {
    nume: string;
    post: string;
    certificatNr: string;
    dataExpirare: string;
  }[];
  proceduraAlertare: string;
  puncteMedicale?: {
    locatie: string;
    dotari: string[];
  }[];
  colaborariMedicale: {
    denumireFurnizor: string;
    tipContract: string;
    telefon: string;
  }[];
}

export interface Responsabil {
  functie: string;
  nume?: string;
  responsabilitati: string[];
  periodicitate?: string;
}

export interface Termen {
  id: string;
  activitate: string;
  dataScadenta: string;
  responsabil: string;
  status: 'Finalizat' | 'În curs' | 'Planificat' | 'Întârziat';
  observatii?: string;
}

export interface Resurse {
  financiare: {
    bugetTotal: number;
    bugetAlocat: number;
    bugetCheltuit: number;
    detaliiCheltuieli: {
      categorie: string;
      suma: number;
      descriere: string;
    }[];
  };
  umane: {
    personalSSM: {
      numeResponsabil: string;
      functie: string;
      tipRelatie: 'Intern' | 'Extern' | 'Serviciu extern';
    };
    comitetSSM?: {
      existaComitet: boolean;
      numarMembri?: number;
      ultimaSedinta?: string;
    };
  };
  materiale: {
    echipamenteProtectie: string[];
    mijloaceMasuraPrevenire: string[];
    documentatieSSM: string[];
  };
}

export interface PlanPrevenireProtectie {
  dateIdentificare: DateIdentificare;
  evaluareRiscuri: EvaluareRisc[];
  masuriTehnice: MasuraTehnica[];
  masuriOrganizatorice: MasuraOrganizatorica[];
  masuriIgienosanitare: MasuraIgienosanitara[];
  masuriPrimAjutor: MasuriPrimAjutor;
  responsabili: Responsabil[];
  termene: Termen[];
  resurse: Resurse;
}

/**
 * Template gol pentru initializare Plan de Prevenire si Protectie
 */
export const planPrevenireTemplate: PlanPrevenireProtectie = {
  dateIdentificare: {
    denumireOrganizatie: '',
    cui: '',
    adresa: '',
    telefon: '',
    email: '',
    codCAEN: '',
    activitatePrincipala: '',
    numarAngajati: 0,
    numarLocuriMunca: 0,
    dataElaborare: new Date().toISOString().split('T')[0],
    revizie: 1,
  },
  evaluareRiscuri: [],
  masuriTehnice: [],
  masuriOrganizatorice: [],
  masuriIgienosanitare: [],
  masuriPrimAjutor: {
    truseDisponibile: [],
    persoanePregatitefirstAid: [],
    proceduraAlertare: '',
    colaborariMedicale: [],
  },
  responsabili: [
    {
      functie: 'Angajator / Manager general',
      responsabilitati: [
        'Asigură implementarea și respectarea Planului de Prevenire și Protecție',
        'Asigură resursele necesare pentru măsurile de SSM',
        'Asigură instruirea și informarea lucrătorilor',
      ],
    },
    {
      functie: 'Responsabil SSM',
      responsabilitati: [
        'Elaborează și actualizează Planul de Prevenire și Protecție',
        'Efectuează evaluarea riscurilor',
        'Monitorizează implementarea măsurilor de prevenire',
        'Efectuează instructajul de SSM',
      ],
    },
    {
      functie: 'Responsabili de compartimente',
      responsabilitati: [
        'Asigură respectarea măsurilor de SSM în compartimentul propriu',
        'Raportează situațiile de risc identificate',
        'Participă la instruirea lucrătorilor',
      ],
    },
  ],
  termene: [],
  resurse: {
    financiare: {
      bugetTotal: 0,
      bugetAlocat: 0,
      bugetCheltuit: 0,
      detaliiCheltuieli: [],
    },
    umane: {
      personalSSM: {
        numeResponsabil: '',
        functie: '',
        tipRelatie: 'Extern',
      },
    },
    materiale: {
      echipamenteProtectie: [],
      mijloaceMasuraPrevenire: [],
      documentatieSSM: [],
    },
  },
};

/**
 * Exemple de riscuri comune pentru inițializare rapidă
 */
export const riscuriComune: Omit<EvaluareRisc, 'id'>[] = [
  {
    codRisc: 'R-MEC-01',
    denumireRisc: 'Lovire de obiecte în mișcare',
    locatieRisc: 'Zona depozit/producție',
    descriereRisc: 'Risc de accidentare prin lovire de mijloace de transport, echipamente în mișcare',
    probabilitate: 'Medie',
    gravitate: 'Mare',
    nivelRisc: 'Substanțial',
    categorieRisc: 'Mecanic',
    posturiAfectate: [],
    numarPersoneExpuse: 0,
    legislatie: ['Legea 319/2006', 'HG 1091/2006'],
  },
  {
    codRisc: 'R-ELC-01',
    denumireRisc: 'Electrocutare',
    locatieRisc: 'Toate locurile de muncă',
    descriereRisc: 'Risc de electrocutare prin contact direct sau indirect cu părți sub tensiune',
    probabilitate: 'Redusă',
    gravitate: 'Foarte mare',
    nivelRisc: 'Substanțial',
    categorieRisc: 'Electric',
    posturiAfectate: [],
    numarPersoneExpuse: 0,
    legislatie: ['Legea 319/2006', 'I7/2011'],
  },
  {
    codRisc: 'R-ERG-01',
    denumireRisc: 'Poziții forțate',
    locatieRisc: 'Birouri/posturi sedentare',
    descriereRisc: 'Afecțiuni musculo-scheletale datorate poziției prelungite',
    probabilitate: 'Mare',
    gravitate: 'Medie',
    nivelRisc: 'Substanțial',
    categorieRisc: 'Ergonomic',
    posturiAfectate: [],
    numarPersoneExpuse: 0,
    legislatie: ['Legea 319/2006', 'HG 1028/2006'],
  },
  {
    codRisc: 'R-INC-01',
    denumireRisc: 'Incendiu',
    locatieRisc: 'Toate locațiile',
    descriereRisc: 'Risc de incendiu cu potențial de victime și daune materiale',
    probabilitate: 'Redusă',
    gravitate: 'Foarte mare',
    nivelRisc: 'Substanțial',
    categorieRisc: 'Fizic',
    posturiAfectate: [],
    numarPersoneExpuse: 0,
    legislatie: ['Legea 307/2006', 'Legea 319/2006'],
  },
];

/**
 * Exemple de măsuri tehnice comune
 */
export const masuriTehnice: Omit<MasuraTehnica, 'id' | 'riscuriAsociate'>[] = [
  {
    codMasura: 'MT-01',
    denumire: 'Verificare instalații electrice',
    descriere: 'Verificare periodică a instalațiilor electrice conform I7/2011',
    status: 'Implementată',
    verificare: {
      periodicitate: 'Anual',
    },
    responsabil: 'Electrician autorizat',
  },
  {
    codMasura: 'MT-02',
    denumire: 'Întreținere echipamente de lucru',
    descriere: 'Program de întreținere preventivă pentru echipamentele de lucru',
    status: 'Implementată',
    verificare: {
      periodicitate: 'Conform instrucțiunilor producătorului',
    },
    responsabil: 'Responsabil tehnic',
  },
  {
    codMasura: 'MT-03',
    denumire: 'Sisteme de ventilație',
    descriere: 'Asigurare ventilație naturală/mecanică adecvată',
    status: 'Implementată',
    verificare: {
      periodicitate: 'Semestrial',
    },
    responsabil: 'Responsabil SSM',
  },
];

/**
 * Exemple de măsuri organizatorice comune
 */
export const masuriOrganizatorice: Omit<MasuraOrganizatorica, 'id' | 'riscuriAsociate'>[] = [
  {
    codMasura: 'MO-01',
    denumire: 'Instructaj SSM periodic',
    descriere: 'Instructaj de securitate și sănătate în muncă pentru toți lucrătorii',
    tipMasura: 'Instruire',
    status: 'Implementată',
    periodicitate: 'Anual',
    responsabil: 'Responsabil SSM',
  },
  {
    codMasura: 'MO-02',
    denumire: 'Control medical periodic',
    descriere: 'Examinare medicală periodică conform Legii 319/2006',
    tipMasura: 'Verificare',
    status: 'Implementată',
    periodicitate: 'Anual/Conform fișei postului',
    responsabil: 'Responsabil SSM / HR',
  },
  {
    codMasura: 'MO-03',
    denumire: 'Verificare EIP',
    descriere: 'Verificare lunară a echipamentelor individuale de protecție',
    tipMasura: 'Verificare',
    status: 'Implementată',
    periodicitate: 'Lunar',
    responsabil: 'Șefi compartimente',
  },
  {
    codMasura: 'MO-04',
    denumire: 'Instruire PSI',
    descriere: 'Instruire privind apărarea împotriva incendiilor',
    tipMasura: 'Instruire',
    status: 'Implementată',
    periodicitate: 'Anual',
    responsabil: 'Responsabil PSI',
  },
];

/**
 * Exemple de măsuri igienico-sanitare comune
 */
export const masuriIgienosanitare: Omit<MasuraIgienosanitara, 'id'>[] = [
  {
    codMasura: 'MIS-01',
    denumire: 'Spații sanitare',
    descriere: 'Asigurare grupuri sanitare conform normelor în vigoare',
    categorie: 'Igienă colectivă',
    locatie: 'Toate locațiile',
    status: 'Implementată',
    verificare: {
      periodicitate: 'Zilnic',
    },
    responsabil: 'Servicii generale',
  },
  {
    codMasura: 'MIS-02',
    denumire: 'Iluminat natural și artificial',
    descriere: 'Asigurare iluminat conform HG 1028/2006',
    categorie: 'Iluminat',
    locatie: 'Toate locurile de muncă',
    status: 'Implementată',
    verificare: {
      periodicitate: 'Anual',
    },
    responsabil: 'Responsabil SSM',
  },
  {
    codMasura: 'MIS-03',
    denumire: 'Curățenie și dezinfecție',
    descriere: 'Program zilnic de curățenie și dezinfecție',
    categorie: 'Igienă colectivă',
    locatie: 'Toate spațiile',
    status: 'Implementată',
    verificare: {
      periodicitate: 'Zilnic',
    },
    responsabil: 'Servicii generale',
  },
  {
    codMasura: 'MIS-04',
    denumire: 'Climatizare/Încălzire',
    descriere: 'Asigurare temperatură optimă 18-24°C',
    categorie: 'Climatizare/Ventilație',
    locatie: 'Birouri',
    status: 'Implementată',
    verificare: {
      periodicitate: 'Permanent',
    },
    responsabil: 'Servicii generale',
  },
];
