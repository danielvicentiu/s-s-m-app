/**
 * Tipuri de instruire SSM conform HG 1425/2006
 *
 * Hotărârea Guvernului nr. 1425/2006 privind organizarea și funcționarea
 * Inspecției Muncii stabilește următoarele categorii de instruire:
 * - Instruire introductiv-generală
 * - Instruire la locul de muncă
 * - Instruire periodică
 */

export interface TipInstruire {
  id: string;
  name: string;
  description: string;
  legalBasis: string;
  durataMinima: number; // ore
  periodicitate?: number; // luni (undefined pentru instruiri one-time)
  continutObligatoriu: string[];
  categoriiAngajati: string[];
  documenteNecesare: string[];
}

export const tipuriInstruire: TipInstruire[] = [
  {
    id: 'introductiv-generala',
    name: 'Instruire introductiv-generală',
    description: 'Instruire obligatorie pentru toți angajații noi, efectuată înainte de începerea activității. Acoperă aspecte generale privind securitatea și sănătatea în muncă la nivelul întregii organizații.',
    legalBasis: 'HG 1425/2006, art. 182, alin. (1), lit. a)',
    durataMinima: 8,
    periodicitate: undefined, // se efectuează o singură dată la angajare
    continutObligatoriu: [
      'Legislația în domeniul securității și sănătății în muncă',
      'Drepturile și obligațiile angajatorului și angajaților',
      'Factorii de risc și măsurile de prevenire specifice unității',
      'Riscurile de accidentare și îmbolnăvire profesională',
      'Măsurile de prim ajutor, PSI și evacuare',
      'Rolul și atribuțiile lucrătorilor desemnați și ale comitetului de securitate',
      'Procedura de raportare a accidentelor de muncă și bolilor profesionale',
      'Echipamente de protecție individuală și colectivă',
      'Măsuri de igienă și sănătate la locul de muncă'
    ],
    categoriiAngajati: [
      'Toți angajații noi',
      'Personal transferat pe alt post',
      'Personal cu schimbarea locului de muncă',
      'Elevi și studenți în practică',
      'Persoane detașate',
      'Lucrători temporari'
    ],
    documenteNecesare: [
      'Program de instruire aprobat',
      'Material didactic (prezentări, documente)',
      'Fișe de instruire individuale semnate',
      'Proces-verbal de instruire',
      'Test de evaluare a cunoștințelor',
      'Registru de instruire SSM'
    ]
  },
  {
    id: 'la-locul-de-munca',
    name: 'Instruire la locul de muncă',
    description: 'Instruire specifică postului de lucru, efectuată după instruirea introductiv-generală. Acoperă riscurile specifice locului de muncă și sarcinilor de lucru concrete.',
    legalBasis: 'HG 1425/2006, art. 182, alin. (1), lit. b)',
    durataMinima: 8,
    periodicitate: undefined, // se efectuează la începerea activității pe postul respectiv
    continutObligatoriu: [
      'Riscurile specifice locului de muncă',
      'Măsurile de prevenire și protecție specifice',
      'Utilizarea corectă a echipamentelor de muncă',
      'Utilizarea EPI specifice postului',
      'Proceduri de lucru în condiții de securitate',
      'Instrucțiuni proprii pentru postul de lucru',
      'Comportament în situații de urgență specifice',
      'Planul de prevenire și protecție - secțiunea specifică',
      'Reguli de igienă personală și colectivă',
      'Semnalizarea de securitate la locul de muncă'
    ],
    categoriiAngajati: [
      'Toți angajații noi pe post',
      'Personal transferat pe alt post',
      'Personal cu schimbarea locului de muncă',
      'Personal cu reluarea activității după absență > 6 luni',
      'Personal înainte de utilizarea unor echipamente noi',
      'Personal la introducerea de noi tehnologii'
    ],
    documenteNecesare: [
      'Program de instruire specific postului',
      'Instrucțiuni proprii SSM pentru postul respectiv',
      'Fișe de instruire individuale semnate',
      'Proces-verbal de instruire',
      'Test de evaluare practică și teoretică',
      'Fișa postului cu riscurile identificate',
      'Registru de instruire SSM'
    ]
  },
  {
    id: 'periodica',
    name: 'Instruire periodică',
    description: 'Instruire de reîmprospătare și actualizare a cunoștințelor SSM, efectuată periodic pentru menținerea unui nivel adecvat de conștientizare a riscurilor.',
    legalBasis: 'HG 1425/2006, art. 182, alin. (1), lit. c)',
    durataMinima: 8,
    periodicitate: 12, // la 12 luni
    continutObligatoriu: [
      'Actualizări legislative în domeniul SSM',
      'Revizuirea riscurilor identificate',
      'Noi măsuri de prevenire și protecție',
      'Analiza accidentelor de muncă și incidentelor',
      'Îmbunătățiri ale procedurilor de lucru',
      'Noi echipamente de muncă și EPI',
      'Lecții învățate din evenimente SSM',
      'Actualizări ale planului de prevenire și protecție',
      'Modificări ale instrucțiunilor proprii',
      'Îmbunătățirea culturii de securitate'
    ],
    categoriiAngajati: [
      'Toți angajații',
      'Personal cu atribuții SSM',
      'Membri ai comitetului de securitate și sănătate în muncă',
      'Lucrători desemnați',
      'Șefi de echipă și supraveghetori'
    ],
    documenteNecesare: [
      'Program de instruire periodică',
      'Material actualizat cu modificări legislative și procedurale',
      'Fișe de instruire individuale semnate',
      'Proces-verbal de instruire',
      'Test de evaluare a cunoștințelor',
      'Registru de instruire SSM',
      'Evidența datei ultimei instruiri pentru fiecare angajat'
    ]
  },
  {
    id: 'periodica-riscuri-grave',
    name: 'Instruire periodică pentru locuri cu riscuri grave',
    description: 'Instruire periodică cu frecvență mărită pentru locurile de muncă cu riscuri deosebite (spații confinate, lucru la înălțime, substanțe periculoase, etc.).',
    legalBasis: 'HG 1425/2006, art. 182, alin. (2)',
    durataMinima: 8,
    periodicitate: 6, // la 6 luni pentru riscuri grave
    continutObligatoriu: [
      'Evaluarea riscurilor grave specifice',
      'Măsuri stricte de prevenire și protecție',
      'Proceduri de lucru detaliate în siguranță',
      'Echipamente speciale de protecție',
      'Planuri de intervenție în situații de urgență',
      'Coordonarea activităților periculoase',
      'Autorizații și permise de lucru',
      'Monitorizarea continuă a condițiilor de lucru',
      'Comunicare și raportare urgentă',
      'Studii de caz și scenarii de risc'
    ],
    categoriiAngajati: [
      'Personal expus la spații confinate',
      'Personal lucru la înălțime > 2m',
      'Personal manipulare substanțe chimice periculoase',
      'Personal în zone ATEX (atmosfere explozive)',
      'Operator echipamente de ridicat',
      'Electricieni înaltă tensiune',
      'Personal în industria chimică/petrochimică',
      'Lucrători în condiții speciale de risc'
    ],
    documenteNecesare: [
      'Program de instruire specific riscurilor grave',
      'Evaluarea riscurilor pentru posturile respective',
      'Proceduri de lucru în condiții speciale',
      'Fișe de instruire individuale semnate',
      'Proces-verbal de instruire',
      'Test de evaluare teoretică și practică riguroasă',
      'Autorizații/avize medicale specifice',
      'Registru special pentru instruiri riscuri grave'
    ]
  },
  {
    id: 'schimbare-tehnologie',
    name: 'Instruire la introducerea de noi tehnologii sau echipamente',
    description: 'Instruire obligatorie înaintea utilizării de noi echipamente de muncă, tehnologii, substanțe sau proceduri de lucru care pot genera riscuri noi sau modificate.',
    legalBasis: 'HG 1425/2006, art. 182, alin. (3)',
    durataMinima: 4,
    periodicitate: undefined, // se efectuează la fiecare schimbare
    continutObligatoriu: [
      'Descrierea noii tehnologii/echipament',
      'Riscuri noi sau modificate generate',
      'Măsuri de prevenire specifice',
      'Instrucțiuni de utilizare sigură',
      'Proceduri de punere în funcțiune și oprire',
      'Întreținere și verificări periodice',
      'EPI noi sau suplimentare necesare',
      'Proceduri de urgență actualizate',
      'Responsabilități și autorizări',
      'Documentație tehnică și manuale'
    ],
    categoriiAngajati: [
      'Personal care va utiliza noile echipamente',
      'Personal care va lucra cu noile tehnologii',
      'Personal de întreținere și service',
      'Supraveghetori și coordonatori',
      'Personal auxiliar expus'
    ],
    documenteNecesare: [
      'Program de instruire pentru noua tehnologie',
      'Manuale de utilizare și documentație tehnică',
      'Evaluarea riscurilor pentru noile condiții',
      'Instrucțiuni proprii actualizate',
      'Fișe de instruire individuale semnate',
      'Proces-verbal de instruire',
      'Test de evaluare specifică',
      'Certificate de competență (unde este cazul)'
    ]
  },
  {
    id: 'post-accident',
    name: 'Instruire suplimentară după accident de muncă',
    description: 'Instruire obligatorie efectuată ca urmare a producerii unui accident de muncă, pentru prevenirea repetiției și consolidarea culturii de securitate.',
    legalBasis: 'HG 1425/2006, art. 182, alin. (4)',
    durataMinima: 4,
    periodicitate: undefined, // se efectuează la fiecare accident
    continutObligatoriu: [
      'Analiza circumstanțelor accidentului produs',
      'Cauzele directe și indirecte identificate',
      'Măsuri corective implementate',
      'Lecții învățate din eveniment',
      'Proceduri actualizate post-accident',
      'Neconformități identificate',
      'Îmbunătățiri ale sistemului SSM',
      'Responsabilități revizuite',
      'Prevenirea repetiției',
      'Raportare și comunicare îmbunătățită'
    ],
    categoriiAngajati: [
      'Toți angajații din sectorul/zona unde s-a produs accidentul',
      'Personal cu activități similare',
      'Supraveghetorii direcți',
      'Membri CSSM',
      'Lucrători desemnați',
      'Personal cu risc similar de accidentare'
    ],
    documenteNecesare: [
      'Raportul de cercetare a accidentului',
      'Program de instruire bazat pe lecții învățate',
      'Măsuri corective documentate',
      'Proceduri actualizate',
      'Fișe de instruire individuale semnate',
      'Proces-verbal de instruire',
      'Test de evaluare',
      'Plan de acțiune post-accident'
    ]
  }
];

/**
 * Helper function pentru găsirea unui tip de instruire după ID
 */
export function getTipInstruireById(id: string): TipInstruire | undefined {
  return tipuriInstruire.find(tip => tip.id === id);
}

/**
 * Helper function pentru filtrarea tipurilor de instruire după periodicitate
 */
export function getTipuriInstruirePeriodice(): TipInstruire[] {
  return tipuriInstruire.filter(tip => tip.periodicitate !== undefined);
}

/**
 * Helper function pentru filtrarea tipurilor de instruire one-time
 */
export function getTipuriInstruireOneTime(): TipInstruire[] {
  return tipuriInstruire.filter(tip => tip.periodicitate === undefined);
}
