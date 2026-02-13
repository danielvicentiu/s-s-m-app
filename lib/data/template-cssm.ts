/**
 * Template Comitet SSM conform art. 18 Legea 319/2006
 * Structură pentru Comitetul de Securitate și Sănătate în Muncă
 */

export interface MembruCSSM {
  id: string;
  nume: string;
  functie: string;
  rol: 'angajator' | 'reprezentant_angajati' | 'medic' | 'lucrator_desemnat' | 'membru';
  dataDesemnare: string;
  mandat?: string; // perioada mandatului
}

export interface TematicaSedinta {
  trimestru: 1 | 2 | 3 | 4;
  luna: string;
  teme: string[];
  documenteNecesare: string[];
}

export interface ProcesVerbalSedinta {
  numar: string;
  data: string;
  oraInceput: string;
  oraIncheiere: string;
  participanti: string[];
  ordineDeDzi: string[];
  hotarari: string[];
  responsabili: {
    numeResponsabil: string;
    sarcina: string;
    termen: string;
  }[];
  presedinteSedinta: string;
  secretar: string;
}

export interface AtributiiCSSM {
  categoria: string;
  atributii: string[];
}

export const MEMBRI_CSSM_TEMPLATE: Partial<MembruCSSM>[] = [
  {
    rol: 'angajator',
    functie: 'Reprezentant al angajatorului',
    mandat: 'Permanent',
  },
  {
    rol: 'reprezentant_angajati',
    functie: 'Reprezentant al lucrătorilor',
    mandat: '2 ani',
  },
  {
    rol: 'medic',
    functie: 'Medic de medicina muncii',
    mandat: 'Conform contract',
  },
  {
    rol: 'lucrator_desemnat',
    functie: 'Lucrător desemnat SSM',
    mandat: 'Conform numire',
  },
];

export const ATRIBUTII_CSSM: AtributiiCSSM[] = [
  {
    categoria: 'Analiză și control',
    atributii: [
      'Analizează propunerile lucrătorilor privind prevenirea accidentelor de muncă și îmbolnăvirilor profesionale',
      'Efectuează verificări proprii privind aplicarea instrucțiunilor proprii și a regulamentului intern',
      'Verifică realizarea măsurilor de securitate și sănătate în muncă stabilite',
      'Controlează modul de utilizare și întreținere a echipamentelor individuale de protecție',
      'Monitorizează condițiile de acordare a hranei de protecție și a altor drepturi',
    ],
  },
  {
    categoria: 'Cercetare evenimente',
    atributii: [
      'Efectuează cercetări proprii ale accidentelor de muncă și îmbolnăvirilor profesionale',
      'Analizează cauzele producerii evenimentelor',
      'Propune măsuri de prevenire a accidentelor și îmbolnăvirilor profesionale',
      'Verifică realizarea măsurilor dispuse de Inspectoratul Teritorial de Muncă',
    ],
  },
  {
    categoria: 'Informare și consultare',
    atributii: [
      'Analizează informările și consultările primite de la angajator',
      'Propune măsuri de natură să elimine cauzele care generează riscuri profesionale',
      'Promovează inițiative pentru îmbunătățirea condițiilor de muncă',
      'Informează periodic lucrătorii asupra activității desfășurate',
    ],
  },
  {
    categoria: 'Colaborare',
    atributii: [
      'Colaborează cu serviciul extern de prevenire și protecție',
      'Colaborează cu medicul de medicina muncii',
      'Cooperează cu inspectorii de muncă',
      'Participă la proceduri de consultare privind SSM',
    ],
  },
];

export const REGULAMENT_FUNCTIONARE_CSSM = {
  titlu: 'Regulament de organizare și funcționare al Comitetului de Securitate și Sănătate în Muncă',
  capitole: [
    {
      capitol: 'I. Dispoziții generale',
      articole: [
        {
          art: '1',
          continut: 'Comitetul de securitate și sănătate în muncă este organism paritatar, fără personalitate juridică, constituit la nivelul angajatorului.',
        },
        {
          art: '2',
          continut: 'Comitetul este constituit conform art. 18 din Legea nr. 319/2006 privind securitatea și sănătatea în muncă.',
        },
        {
          art: '3',
          continut: 'Componența, atribuțiile și funcționarea comitetului se stabilesc prin prezentul regulament.',
        },
      ],
    },
    {
      capitol: 'II. Componența comitetului',
      articole: [
        {
          art: '4',
          continut: 'Comitetul este format din reprezentanți ai angajatorului și reprezentanți ai lucrătorilor, în număr egal.',
        },
        {
          art: '5',
          continut: 'Fac parte din comitet lucrătorul desemnat și medicul de medicina muncii.',
        },
        {
          art: '6',
          continut: 'Reprezentanții lucrătorilor sunt aleși de către aceștia conform procedurii stabilite.',
        },
      ],
    },
    {
      capela: 'III. Organizarea ședințelor',
      articole: [
        {
          art: '7',
          continut: 'Comitetul se întrunește trimestrial sau ori de câte ori este necesar, la solicitarea a cel puțin 2 membri.',
        },
        {
          art: '8',
          continut: 'Ședințele sunt convocate de președintele comitetului cu cel puțin 3 zile înainte.',
        },
        {
          art: '9',
          continut: 'Ședința este legal constituită în prezența a cel puțin jumătate plus unu din membrii comitetului.',
        },
        {
          art: '10',
          continut: 'Hotărârile se adoptă cu votul majorității membrilor prezenți.',
        },
      ],
    },
    {
      capitol: 'IV. Documentarea activității',
      articole: [
        {
          art: '11',
          continut: 'Pentru fiecare ședință se întocmește proces-verbal semnat de toți membrii prezenți.',
        },
        {
          art: '12',
          continut: 'Procesele-verbale se înregistrează într-un registru special și se păstrează la sediul angajatorului.',
        },
        {
          art: '13',
          continut: 'Anual, comitetul întocmește un raport de activitate prezentat angajatorului și lucrătorilor.',
        },
      ],
    },
  ],
};

export const PROCES_VERBAL_MODEL: ProcesVerbalSedinta = {
  numar: 'Nr. __/__/__',
  data: 'Data: __.__.____',
  oraInceput: 'Ora de început: __:__',
  oraIncheiere: 'Ora de încheiere: __:__',
  participanti: [
    'D-na/Dl. _____________ - Președinte (reprezentant angajator)',
    'D-na/Dl. _____________ - Secretar (reprezentant lucrători)',
    'D-na/Dl. _____________ - Membru (lucrător desemnat SSM)',
    'D-na/Dl. _____________ - Membru (medic medicina muncii)',
  ],
  ordineDeDzi: [
    '1. Deschiderea ședinței și verificarea cvorum-ului',
    '2. Analiza îndeplinirii hotărârilor din ședința anterioară',
    '3. ___________________ (temă specifică)',
    '4. Diverse și închiderea ședinței',
  ],
  hotarari: [
    'HOTĂRÂRE 1: ___________________',
    'HOTĂRÂRE 2: ___________________',
  ],
  responsabili: [
    {
      numeResponsabil: '_______________',
      sarcina: '___________________',
      termen: '__.__.____',
    },
  ],
  presedinteSedinta: 'Președinte,\n_______________',
  secretar: 'Secretar,\n_______________',
};

export const TEMATICI_SEDINTE_TRIMESTRIALE: TematicaSedinta[] = [
  {
    trimestru: 1,
    luna: 'Martie',
    teme: [
      'Analiza activității comitetului în anul precedent',
      'Prezentarea raportului anual de activitate SSM',
      'Analiza indicatorilor de accidente de muncă și îmbolnăviri profesionale',
      'Evaluarea stării generale a securității și sănătății în muncă',
      'Verificarea existenței și stării echipamentelor de protecție',
      'Planul de măsuri SSM pentru anul curent',
      'Analiza bugetului alocat pentru SSM',
    ],
    documenteNecesare: [
      'Raport anual SSM',
      'Statistici accidente/îmbolnăviri profesionale',
      'Registrul de evidență EIP',
      'Plan de prevenire și protecție',
      'Buget SSM',
    ],
  },
  {
    trimestru: 2,
    luna: 'Iunie',
    teme: [
      'Evaluarea îndeplinirii măsurilor din planul SSM',
      'Analiza evenimentelor (accidente/incidente) din trimestrul I',
      'Verificarea efectuării instructajelor periodice',
      'Controlul efectuării examenelor medicale',
      'Analiza eficienței măsurilor de prevenire implementate',
      'Verificarea condițiilor de muncă pe timp de vară (microclimat)',
      'Propuneri de îmbunătățire a condițiilor de muncă',
    ],
    documenteNecesare: [
      'Raport de implementare măsuri SSM',
      'Fișe cercetare evenimente',
      'Registru instructaje',
      'Fișe aptitudine lucrători',
      'Rapoarte verificări periodice',
    ],
  },
  {
    trimestru: 3,
    luna: 'Septembrie',
    teme: [
      'Analiza evenimentelor din primul semestru',
      'Evaluarea riscurilor în activitățile sezoniere',
      'Verificarea stării mijloacelor de prevenire și stingere incendii',
      'Analiza propunerilor lucrătorilor privind îmbunătățirea SSM',
      'Pregătirea pentru sezonul rece',
      'Verificarea iluminatului la locurile de muncă',
      'Actualizarea procedurilor de urgență',
    ],
    documenteNecesare: [
      'Raport evenimente semestrul I',
      'Evaluări de risc actualizate',
      'Procese-verbale verificări PSI',
      'Propuneri lucrători',
      'Planuri de evacuare',
    ],
  },
  {
    trimestru: 4,
    luna: 'Decembrie',
    teme: [
      'Analiza activității comitetului pe întregul an',
      'Evaluarea îndeplinirii planului de măsuri SSM',
      'Bilanțul evenimentelor (accidente/incidente) pe anul curent',
      'Evaluarea eficienței cheltuielilor pentru SSM',
      'Propuneri pentru planul de măsuri anul următor',
      'Stabilirea tematicii ședințelor pentru anul următor',
      'Pregătirea raportului anual de activitate',
    ],
    documenteNecesare: [
      'Raport activitate CSSM',
      'Situație implementare măsuri SSM',
      'Bilanț anual evenimente',
      'Situație cheltuieli SSM',
      'Proiect plan măsuri anul următor',
    ],
  },
];

export const RAPORT_ANUAL_TEMPLATE = {
  titlu: 'RAPORT ANUAL DE ACTIVITATE\nCOMITET DE SECURITATE ȘI SĂNĂTATE ÎN MUNCĂ',
  an: '____',
  sectiuni: [
    {
      sectiune: '1. DATE DE IDENTIFICARE',
      continut: [
        'Denumire angajator: _____________________',
        'CUI: _____________________',
        'Adresă: _____________________',
        'Număr mediu de salariați: _____',
        'Domeniu de activitate: _____________________',
      ],
    },
    {
      sectiune: '2. COMPONENȚA COMITETULUI',
      continut: [
        'Președinte: _____________________',
        'Secretar: _____________________',
        'Membri: [listă membri cu funcții]',
      ],
    },
    {
      sectiune: '3. ACTIVITATEA DESFĂȘURATĂ',
      continut: [
        'Număr ședințe organizate: _____',
        'Număr hotărâri adoptate: _____',
        'Număr controale efectuate: _____',
        'Număr propuneri de îmbunătățire: _____',
      ],
    },
    {
      sectiune: '4. INDICATORI SECURITATE ȘI SĂNĂTATE ÎN MUNCĂ',
      continut: [
        'Accidente de muncă: _____',
        '  - cu incapacitate temporară: _____',
        '  - fără incapacitate: _____',
        'Îmbolnăviri profesionale: _____',
        'Incidente periculoase: _____',
        'Zile pierdute: _____',
        'Frecvență accidente (Fr): _____',
        'Gravitate accidente (Gr): _____',
      ],
    },
    {
      sectiune: '5. MĂSURI IMPLEMENTATE',
      continut: [
        'Măsuri tehnice: [descriere]',
        'Măsuri organizatorice: [descriere]',
        'Instruire și formare: [descriere]',
        'Echipamente de protecție: [descriere]',
      ],
    },
    {
      sectiune: '6. CONTROALE ȘI VERIFICĂRI',
      continut: [
        'Controale locuri de muncă: [număr și rezultate]',
        'Verificări EIP: [stare și conformitate]',
        'Verificări instalații: [rezultate]',
        'Conformitate instructaje: [situație]',
      ],
    },
    {
      sectiune: '7. PROPUNERI PENTRU ANUL URMĂTOR',
      continut: [
        'Investiții necesare: [listă]',
        'Măsuri de îmbunătățire: [listă]',
        'Programe de instruire: [listă]',
        'Achiziții EIP: [listă]',
      ],
    },
    {
      sectiune: '8. CONCLUZII ȘI RECOMANDĂRI',
      continut: [
        '[Evaluare generală a situației SSM]',
        '[Evoluție comparativ cu anul precedent]',
        '[Recomandări pentru îmbunătățire]',
      ],
    },
  ],
  semnături: {
    presedinte: 'Președinte Comitet SSM,\n_____________________\nData: __.__.____',
    secretar: 'Secretar Comitet SSM,\n_____________________\nData: __.__.____',
    angajator: 'Reprezentant angajator,\n_____________________\nData: __.__.____',
  },
};

/**
 * Funcție helper pentru generarea unui proces-verbal pre-completat
 */
export function genereazaProcesVerbal(
  numar: string,
  data: string,
  membrii: MembruCSSM[],
  teme: string[]
): ProcesVerbalSedinta {
  return {
    numar,
    data,
    oraInceput: '',
    oraIncheiere: '',
    participanti: membrii.map(
      (m) => `D-na/Dl. ${m.nume} - ${m.functie}`
    ),
    ordineDeDzi: [
      '1. Deschiderea ședinței și verificarea cvorum-ului',
      '2. Analiza îndeplinirii hotărârilor din ședința anterioară',
      ...teme.map((tema, idx) => `${idx + 3}. ${tema}`),
      `${teme.length + 3}. Diverse și închiderea ședinței`,
    ],
    hotarari: [],
    responsabili: [],
    presedinteSedinta: membrii.find((m) => m.rol === 'angajator')?.nume || '',
    secretar: membrii.find((m) => m.rol === 'reprezentant_angajati')?.nume || '',
  };
}

/**
 * Funcție helper pentru obținerea tematicii pe trimestru
 */
export function getTematicaTrimestru(trimestru: 1 | 2 | 3 | 4): TematicaSedinta | undefined {
  return TEMATICI_SEDINTE_TRIMESTRIALE.find((t) => t.trimestru === trimestru);
}
