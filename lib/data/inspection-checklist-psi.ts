/**
 * Lista de verificare PSI (Prevenire și Stingere Incendii)
 * Conformă cu legislația ISU România
 *
 * Categorii:
 * - autorizatie: Autorizație PSI și documentație de bază
 * - stingatoare: Stingătoare portabile și mobile
 * - hidranti: Hidranți interiori și exteriori
 * - detectie-alarmare: Sisteme de detecție și alarmare incendiu
 * - evacuare: Căi de evacuare și semnalizare
 * - instructiuni: Instrucțiuni și afișe PSI
 * - exercitii: Exerciții și instruire personal
 * - documente: Documente și registre PSI
 */

export interface InspectionChecklistItem {
  id: string;
  category: 'autorizatie' | 'stingatoare' | 'hidranti' | 'detectie-alarmare' | 'evacuare' | 'instructiuni' | 'exercitii' | 'documente';
  question: string;
  expectedAnswer: 'da' | 'nu' | 'nu_se_aplica';
  legalBasis: string;
  severity: 'critica' | 'majora' | 'minora';
}

export const inspectionChecklistPSI: InspectionChecklistItem[] = [
  // AUTORIZATIE PSI (5 puncte)
  {
    id: 'aut-001',
    category: 'autorizatie',
    question: 'Există autorizație de securitate la incendiu în termen de valabilitate?',
    expectedAnswer: 'da',
    legalBasis: 'Legea 307/2006, art. 22',
    severity: 'critica'
  },
  {
    id: 'aut-002',
    category: 'autorizatie',
    question: 'Autorizația PSI este afișată la loc vizibil?',
    expectedAnswer: 'da',
    legalBasis: 'Legea 307/2006, art. 22',
    severity: 'minora'
  },
  {
    id: 'aut-003',
    category: 'autorizatie',
    question: 'Există certificate de urbanism și autorizație de construire valabile?',
    expectedAnswer: 'da',
    legalBasis: 'Legea 50/1991, Legea 307/2006',
    severity: 'majora'
  },
  {
    id: 'aut-004',
    category: 'autorizatie',
    question: 'Plan de amplasare și evacuare este conform cu starea reală?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'majora'
  },
  {
    id: 'aut-005',
    category: 'autorizatie',
    question: 'Există scenarii de securitate la incendiu actualizate?',
    expectedAnswer: 'da',
    legalBasis: 'Legea 307/2006, art. 16',
    severity: 'majora'
  },

  // STINGATOARE (7 puncte)
  {
    id: 'sting-001',
    category: 'stingatoare',
    question: 'Stingătoarele sunt verificate și certificate (în termen)?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015, art. 5.2',
    severity: 'critica'
  },
  {
    id: 'sting-002',
    category: 'stingatoare',
    question: 'Numărul de stingătoare corespunde normelor (1 stingător/200mp)?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'majora'
  },
  {
    id: 'sting-003',
    category: 'stingatoare',
    question: 'Stingătoarele sunt montate la înălțimea reglementară (max 1,5m de la sol)?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'minora'
  },
  {
    id: 'sting-004',
    category: 'stingatoare',
    question: 'Stingătoarele sunt semnalizate cu indicator fosforescent?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'minora'
  },
  {
    id: 'sting-005',
    category: 'stingatoare',
    question: 'Stingătoarele sunt accesibile și fără obstrucții?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'majora'
  },
  {
    id: 'sting-006',
    category: 'stingatoare',
    question: 'Fișele de verificare lunară a stingătoarelor sunt completate?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'minora'
  },
  {
    id: 'sting-007',
    category: 'stingatoare',
    question: 'Tipul stingătoarelor este adecvat riscurilor (ABC/CO2)?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'majora'
  },

  // HIDRANTI (5 puncte)
  {
    id: 'hidr-001',
    category: 'hidranti',
    question: 'Hidranții interiori sunt verificați semestrial (fișe completate)?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015, art. 5.3',
    severity: 'majora'
  },
  {
    id: 'hidr-002',
    category: 'hidranti',
    question: 'Furtunurile hidranților interiori sunt în stare bună (fără fisuri)?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'majora'
  },
  {
    id: 'hidr-003',
    category: 'hidranti',
    question: 'Hidranții interiori sunt semnalizați cu indicator fosforescent?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'minora'
  },
  {
    id: 'hidr-004',
    category: 'hidranti',
    question: 'Hidranții exteriori sunt verificați și funcționali?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'critica'
  },
  {
    id: 'hidr-005',
    category: 'hidranti',
    question: 'Presiunea apei în rețeaua de hidranți este adecvată (min 2 bar)?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'majora'
  },

  // DETECTIE SI ALARMARE (5 puncte)
  {
    id: 'det-001',
    category: 'detectie-alarmare',
    question: 'Sistemul de detecție incendiu este verificat și funcțional?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015, art. 5.4',
    severity: 'critica'
  },
  {
    id: 'det-002',
    category: 'detectie-alarmare',
    question: 'Detectoarele de fum/temperatură sunt în număr suficient?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'majora'
  },
  {
    id: 'det-003',
    category: 'detectie-alarmare',
    question: 'Butoanele de alarmare manuală sunt semnalizate și accesibile?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'majora'
  },
  {
    id: 'det-004',
    category: 'detectie-alarmare',
    question: 'Centrala de detecție incendiu este verificată lunar (fișă)?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'majora'
  },
  {
    id: 'det-005',
    category: 'detectie-alarmare',
    question: 'Sistemul de alarmare sonoră funcționează corect?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'critica'
  },

  // CAI DE EVACUARE (6 puncte)
  {
    id: 'evac-001',
    category: 'evacuare',
    question: 'Căile de evacuare sunt libere și fără obstacole?',
    expectedAnswer: 'da',
    legalBasis: 'Legea 307/2006, art. 17; Normativ P118/3-2015',
    severity: 'critica'
  },
  {
    id: 'evac-002',
    category: 'evacuare',
    question: 'Ușile de evacuare se deschid în sensul de evacuare?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'majora'
  },
  {
    id: 'evac-003',
    category: 'evacuare',
    question: 'Iluminatul de siguranță funcționează pe căile de evacuare?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'critica'
  },
  {
    id: 'evac-004',
    category: 'evacuare',
    question: 'Semnalizarea de evacuare este vizibilă și fosforescenta?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'majora'
  },
  {
    id: 'evac-005',
    category: 'evacuare',
    question: 'Lățimea căilor de evacuare respectă minimul reglementar?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'majora'
  },
  {
    id: 'evac-006',
    category: 'evacuare',
    question: 'Planul de evacuare este afișat la loc vizibil pe fiecare nivel?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'minora'
  },

  // INSTRUCTIUNI SI AFISE (4 puncte)
  {
    id: 'instr-001',
    category: 'instructiuni',
    question: 'Există instrucțiuni PSI afișate la loc vizibil?',
    expectedAnswer: 'da',
    legalBasis: 'Legea 307/2006, art. 18',
    severity: 'majora'
  },
  {
    id: 'instr-002',
    category: 'instructiuni',
    question: 'Instrucțiunile PSI sunt actualizate și specifice activității?',
    expectedAnswer: 'da',
    legalBasis: 'Legea 307/2006, art. 18',
    severity: 'majora'
  },
  {
    id: 'instr-003',
    category: 'instructiuni',
    question: 'Există afișe cu interzicerea fumatului în zonele cu risc?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'minora'
  },
  {
    id: 'instr-004',
    category: 'instructiuni',
    question: 'Numerele de urgență (112, pompieri) sunt afișate vizibil?',
    expectedAnswer: 'da',
    legalBasis: 'Normativ P118/3-2015',
    severity: 'minora'
  },

  // EXERCITII SI INSTRUIRE (4 puncte)
  {
    id: 'exer-001',
    category: 'exercitii',
    question: 'S-au efectuat exerciții de evacuare în ultimele 6 luni?',
    expectedAnswer: 'da',
    legalBasis: 'Legea 307/2006, art. 20; Normativ P118/3-2015',
    severity: 'critica'
  },
  {
    id: 'exer-002',
    category: 'exercitii',
    question: 'Există procese verbale pentru exercițiile de evacuare?',
    expectedAnswer: 'da',
    legalBasis: 'Legea 307/2006, art. 20',
    severity: 'majora'
  },
  {
    id: 'exer-003',
    category: 'exercitii',
    question: 'Toți angajații au fost instruiți PSI la angajare?',
    expectedAnswer: 'da',
    legalBasis: 'Legea 307/2006, art. 19',
    severity: 'critica'
  },
  {
    id: 'exer-004',
    category: 'exercitii',
    question: 'Există fișe de instruire PSI semnate de angajați?',
    expectedAnswer: 'da',
    legalBasis: 'Legea 307/2006, art. 19',
    severity: 'majora'
  },

  // DOCUMENTE SI REGISTRE (4 puncte)
  {
    id: 'doc-001',
    category: 'documente',
    question: 'Există registru de evidență a verificărilor PSI?',
    expectedAnswer: 'da',
    legalBasis: 'Legea 307/2006, art. 21',
    severity: 'majora'
  },
  {
    id: 'doc-002',
    category: 'documente',
    question: 'Documentele de verificare sunt păstrate minimum 2 ani?',
    expectedAnswer: 'da',
    legalBasis: 'Legea 307/2006, art. 21',
    severity: 'minora'
  },
  {
    id: 'doc-003',
    category: 'documente',
    question: 'Există desemnat responsabil cu PSI (decizie scrisă)?',
    expectedAnswer: 'da',
    legalBasis: 'Legea 307/2006, art. 15',
    severity: 'critica'
  },
  {
    id: 'doc-004',
    category: 'documente',
    question: 'Contractele cu firme autorizate PSI sunt în termen de valabilitate?',
    expectedAnswer: 'da',
    legalBasis: 'Legea 307/2006',
    severity: 'majora'
  }
];

/**
 * Helper: Filtrare după categorie
 */
export function getChecklistByCategory(category: InspectionChecklistItem['category']): InspectionChecklistItem[] {
  return inspectionChecklistPSI.filter(item => item.category === category);
}

/**
 * Helper: Filtrare după severitate
 */
export function getChecklistBySeverity(severity: InspectionChecklistItem['severity']): InspectionChecklistItem[] {
  return inspectionChecklistPSI.filter(item => item.severity === severity);
}

/**
 * Helper: Statistici generale
 */
export function getChecklistStats() {
  return {
    total: inspectionChecklistPSI.length,
    byCategory: {
      autorizatie: getChecklistByCategory('autorizatie').length,
      stingatoare: getChecklistByCategory('stingatoare').length,
      hidranti: getChecklistByCategory('hidranti').length,
      detectieAlarmare: getChecklistByCategory('detectie-alarmare').length,
      evacuare: getChecklistByCategory('evacuare').length,
      instructiuni: getChecklistByCategory('instructiuni').length,
      exercitii: getChecklistByCategory('exercitii').length,
      documente: getChecklistByCategory('documente').length
    },
    bySeverity: {
      critica: getChecklistBySeverity('critica').length,
      majora: getChecklistBySeverity('majora').length,
      minora: getChecklistBySeverity('minora').length
    }
  };
}
