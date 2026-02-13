/**
 * Documente SSM obligatorii conform legislației românești
 * Lista completă cu documentele necesare pentru conformitatea SSM
 */

export interface DocumentSSM {
  id: string;
  name: string;
  description: string;
  legalBasis: string;
  applicableTo: 'all' | 'specific' | 'conditional';
  templateAvailable: boolean;
  category: 'preventie' | 'medical' | 'instruire' | 'monitorizare' | 'situatii-urgenta' | 'echipamente';
  mandatory: boolean;
}

export const documenteSSM: DocumentSSM[] = [
  // CATEGORIA: PREVENȚIE
  {
    id: 'eval-risc',
    name: 'Evaluarea Riscurilor Profesionale',
    description: 'Document fundamental care identifică și evaluează toate riscurile la locul de muncă și stabilește măsurile de prevenire și protecție',
    legalBasis: 'Legea 319/2006, HG 1425/2006',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'preventie',
    mandatory: true
  },
  {
    id: 'plan-prevenire',
    name: 'Planul de Prevenire și Protecție',
    description: 'Plan anual care stabilește măsurile concrete de prevenire a accidentelor de muncă și bolilor profesionale',
    legalBasis: 'Legea 319/2006, art. 9',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'preventie',
    mandatory: true
  },
  {
    id: 'regulament-intern',
    name: 'Regulamentul Intern SSM',
    description: 'Document care stabilește regulile de securitate și sănătate în muncă specifice unității',
    legalBasis: 'Legea 319/2006, Codul Muncii',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'preventie',
    mandatory: true
  },
  {
    id: 'fisa-post-ssm',
    name: 'Fișa Postului cu Atribuții SSM',
    description: 'Fișa postului care include atribuțiile și responsabilitățile SSM pentru fiecare salariat',
    legalBasis: 'Legea 319/2006, HG 1425/2006',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'preventie',
    mandatory: true
  },
  {
    id: 'fisa-individuala-risc',
    name: 'Fișa Individuală de Risc',
    description: 'Document personalizat pentru fiecare angajat cu riscurile specifice postului său',
    legalBasis: 'HG 1425/2006',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'preventie',
    mandatory: true
  },

  // CATEGORIA: INSTRUIRE
  {
    id: 'fisa-instruire-generala',
    name: 'Fișa de Instruire Generală SSM',
    description: 'Documentare a instruirii generale la angajare și periodice (anual)',
    legalBasis: 'Legea 319/2006, HG 1425/2006',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'instruire',
    mandatory: true
  },
  {
    id: 'fisa-instruire-post',
    name: 'Fișa de Instruire la Locul de Muncă',
    description: 'Instruire specifică pentru riscurile postului de lucru',
    legalBasis: 'HG 1425/2006',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'instruire',
    mandatory: true
  },
  {
    id: 'program-instruire',
    name: 'Programul Anual de Instruire SSM',
    description: 'Planificarea tuturor instruirilor SSM pentru anul curent',
    legalBasis: 'Legea 319/2006',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'instruire',
    mandatory: true
  },
  {
    id: 'tematica-instruire',
    name: 'Tematica de Instruire SSM',
    description: 'Conținutul detaliat al programelor de instruire SSM',
    legalBasis: 'HG 1425/2006',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'instruire',
    mandatory: true
  },

  // CATEGORIA: MONITORIZARE
  {
    id: 'registru-accidente',
    name: 'Registrul de Evidență a Accidentelor de Muncă',
    description: 'Înregistrarea cronologică a tuturor accidentelor de muncă survenite',
    legalBasis: 'HG 1425/2006, Ordinul 508/2002',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'monitorizare',
    mandatory: true
  },
  {
    id: 'registru-instructaj',
    name: 'Registrul de Instructaj SSM',
    description: 'Evidența cronologică a tuturor instruirilor SSM efectuate',
    legalBasis: 'HG 1425/2006',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'monitorizare',
    mandatory: true
  },
  {
    id: 'raport-anual-ssm',
    name: 'Raportul Anual de Securitate și Sănătate în Muncă',
    description: 'Raport complet privind situația SSM din unitate pe anul precedent',
    legalBasis: 'Legea 319/2006',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'monitorizare',
    mandatory: true
  },
  {
    id: 'registru-controale',
    name: 'Registrul de Controale ITM',
    description: 'Evidența tuturor controalelor efectuate de Inspecția Muncii',
    legalBasis: 'Legea 108/1999',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'monitorizare',
    mandatory: true
  },

  // CATEGORIA: MEDICAL
  {
    id: 'fisa-aptitudine',
    name: 'Fișa de Aptitudine Medicală',
    description: 'Document medical pentru fiecare angajat care atestă aptitudinea pentru postul ocupat',
    legalBasis: 'HG 355/2007, Ordinul 1030/2007',
    applicableTo: 'all',
    templateAvailable: false,
    category: 'medical',
    mandatory: true
  },
  {
    id: 'program-control-medical',
    name: 'Programul de Supraveghere a Sănătății',
    description: 'Plan anual cu controalele medicale periodice necesare',
    legalBasis: 'HG 355/2007',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'medical',
    mandatory: true
  },
  {
    id: 'contract-medicina-muncii',
    name: 'Contract cu Serviciul de Medicina Muncii',
    description: 'Contract pentru asigurarea serviciilor de medicină a muncii',
    legalBasis: 'HG 355/2007',
    applicableTo: 'all',
    templateAvailable: false,
    category: 'medical',
    mandatory: true
  },

  // CATEGORIA: SITUAȚII DE URGENȚĂ
  {
    id: 'plan-evacuare',
    name: 'Planul de Evacuare în Caz de Incendiu',
    description: 'Proceduri detaliate pentru evacuarea în siguranță a personalului',
    legalBasis: 'Legea 307/2006 (PSI)',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'situatii-urgenta',
    mandatory: true
  },
  {
    id: 'plan-psi',
    name: 'Planul de Prevenire și Protecție împotriva Incendiilor',
    description: 'Măsuri de prevenire și intervenție în caz de incendiu',
    legalBasis: 'Legea 307/2006, HG 571/2016',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'situatii-urgenta',
    mandatory: true
  },
  {
    id: 'instructiuni-psi',
    name: 'Instrucțiuni de Apărare împotriva Incendiilor',
    description: 'Instrucțiuni specifice pentru prevenirea și stingerea incendiilor',
    legalBasis: 'Legea 307/2006',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'situatii-urgenta',
    mandatory: true
  },
  {
    id: 'plan-interventie',
    name: 'Planul de Intervenție în Situații de Urgență',
    description: 'Proceduri pentru gestionarea diferitelor situații de urgență',
    legalBasis: 'Legea 307/2006',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'situatii-urgenta',
    mandatory: true
  },

  // CATEGORIA: ECHIPAMENTE
  {
    id: 'registru-eip',
    name: 'Registrul de Evidență EIP (Echipamente Individuale de Protecție)',
    description: 'Evidența dotării și înlocuirii echipamentelor de protecție individuală',
    legalBasis: 'HG 1048/2006',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'echipamente',
    mandatory: true
  },
  {
    id: 'fisa-dotare-eip',
    name: 'Fișa de Dotare cu EIP',
    description: 'Norma de dotare cu echipamente de protecție pentru fiecare post',
    legalBasis: 'HG 1048/2006',
    applicableTo: 'all',
    templateAvailable: true,
    category: 'echipamente',
    mandatory: true
  },
  {
    id: 'registru-verificare-echipamente',
    name: 'Registrul de Verificare a Echipamentelor de Muncă',
    description: 'Evidența verificărilor periodice ale echipamentelor de muncă',
    legalBasis: 'HG 1146/2006',
    applicableTo: 'conditional',
    templateAvailable: true,
    category: 'echipamente',
    mandatory: true
  },

  // DOCUMENTE SPECIFICE
  {
    id: 'autorizatie-ssm',
    name: 'Autorizația de Funcționare din Punct de Vedere SSM',
    description: 'Autorizație emisă de ITM pentru anumite categorii de activități',
    legalBasis: 'Legea 319/2006',
    applicableTo: 'conditional',
    templateAvailable: false,
    category: 'preventie',
    mandatory: false
  },
  {
    id: 'permis-lucru',
    name: 'Permisul de Lucru pentru Lucrări Periculoase',
    description: 'Permis pentru executarea lucrărilor cu risc ridicat (înălțime, spații conf., etc.)',
    legalBasis: 'HG 1425/2006',
    applicableTo: 'conditional',
    templateAvailable: true,
    category: 'preventie',
    mandatory: false
  }
];

/**
 * Funcții utilitare pentru lucrul cu documentele SSM
 */
export const getDocumenteByCategory = (category: DocumentSSM['category']): DocumentSSM[] => {
  return documenteSSM.filter(doc => doc.category === category);
};

export const getDocumenteMandatory = (): DocumentSSM[] => {
  return documenteSSM.filter(doc => doc.mandatory);
};

export const getDocumenteWithTemplates = (): DocumentSSM[] => {
  return documenteSSM.filter(doc => doc.templateAvailable);
};

export const getDocumentById = (id: string): DocumentSSM | undefined => {
  return documenteSSM.find(doc => doc.id === id);
};

/**
 * Categorii de documente pentru filtrare și organizare
 */
export const categoriiDocumente = [
  { value: 'preventie', label: 'Prevenție și Protecție' },
  { value: 'medical', label: 'Medicină a Muncii' },
  { value: 'instruire', label: 'Instruire și Formare' },
  { value: 'monitorizare', label: 'Monitorizare și Raportare' },
  { value: 'situatii-urgenta', label: 'Situații de Urgență' },
  { value: 'echipamente', label: 'Echipamente de Protecție' }
] as const;
