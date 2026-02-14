/**
 * SSM Inspection Checklist - Romania ITM Standards
 * 50 verification points for occupational safety compliance
 */

export interface ChecklistItem {
  id: string;
  category: string;
  question: string;
  expectedAnswer: string;
  legalBasis: string;
  severity: 'critical' | 'major' | 'minor';
  evidenceRequired: string;
}

export const ssmInspectionChecklist: ChecklistItem[] = [
  // DOCUMENTE
  {
    id: 'DOC-001',
    category: 'documente',
    question: 'Organizația are contract/decizie SSM valabil?',
    expectedAnswer: 'Da, contract cu consultant extern sau decizie pentru consultant intern',
    legalBasis: 'Legea 319/2006, art. 19',
    severity: 'critical',
    evidenceRequired: 'Contract SSM sau decizie numire consultant intern cu vizare ITM'
  },
  {
    id: 'DOC-002',
    category: 'documente',
    question: 'Există registrul general de evidență al salariaților actualizat?',
    expectedAnswer: 'Da, completat și ștampilat de ITM',
    legalBasis: 'OUG 53/2017',
    severity: 'critical',
    evidenceRequired: 'Registrul general cu ștampilă ITM'
  },
  {
    id: 'DOC-003',
    category: 'documente',
    question: 'Există plan de prevenire și protecție (PPP) actualizat?',
    expectedAnswer: 'Da, elaborat și semnat de angajator și consultant SSM',
    legalBasis: 'Legea 319/2006, art. 11',
    severity: 'critical',
    evidenceRequired: 'PPP vizat de consultant SSM și semnat de angajator'
  },
  {
    id: 'DOC-004',
    category: 'documente',
    question: 'Există Regulament Intern de Organizare și Funcționare (RIOF)?',
    expectedAnswer: 'Da, afișat la locul de muncă și comunicat salariaților',
    legalBasis: 'Codul Muncii, art. 241-242',
    severity: 'major',
    evidenceRequired: 'RIOF semnat de reprezentantul legal și afișat'
  },
  {
    id: 'DOC-005',
    category: 'documente',
    question: 'Există Regulament de Securitate și Sănătate în Muncă (RSSM)?',
    expectedAnswer: 'Da, elaborat conform PPP și afișat',
    legalBasis: 'Legea 319/2006, art. 11',
    severity: 'major',
    evidenceRequired: 'RSSM semnat și afișat la locurile de muncă'
  },
  {
    id: 'DOC-006',
    category: 'documente',
    question: 'Există fișe de post pentru toți angajații?',
    expectedAnswer: 'Da, cu atribuții SSM specifice incluse',
    legalBasis: 'Legea 319/2006, art. 7',
    severity: 'major',
    evidenceRequired: 'Fișe de post semnate de angajați'
  },
  {
    id: 'DOC-007',
    category: 'documente',
    question: 'Există identificarea periculelor și evaluarea riscurilor (IPER)?',
    expectedAnswer: 'Da, pentru toate posturile de muncă',
    legalBasis: 'HG 1425/2006, art. 6-8',
    severity: 'critical',
    evidenceRequired: 'Documente IPER semnate de evaluator autorizat'
  },

  // INSTRUIRE
  {
    id: 'INS-001',
    category: 'instruire',
    question: 'Toți angajații au instruire SSM la angajare?',
    expectedAnswer: 'Da, instruire generală și la locul de muncă',
    legalBasis: 'Legea 319/2006, art. 26',
    severity: 'critical',
    evidenceRequired: 'Fișe de instruire semnate de angajați'
  },
  {
    id: 'INS-002',
    category: 'instruire',
    question: 'Există instruire periodică SSM (anual)?',
    expectedAnswer: 'Da, minimum o dată pe an pentru toți angajații',
    legalBasis: 'Legea 319/2006, art. 26',
    severity: 'critical',
    evidenceRequired: 'Fișe instruire periodică cu date și semnături'
  },
  {
    id: 'INS-003',
    category: 'instruire',
    question: 'Există programe de instruire SSM documentate?',
    expectedAnswer: 'Da, programe pentru toate tipurile de instruire',
    legalBasis: 'Legea 319/2006, art. 26',
    severity: 'major',
    evidenceRequired: 'Programe de instruire aprobate de angajator'
  },
  {
    id: 'INS-004',
    category: 'instruire',
    question: 'Angajații cu sarcini speciale au autorizații/atestate?',
    expectedAnswer: 'Da, pentru lucru la înălțime, electricieni, stivuitori etc.',
    legalBasis: 'Ordine specifice ISCIR, ANRE',
    severity: 'critical',
    evidenceRequired: 'Copii autorizații/atestate în termen de valabilitate'
  },
  {
    id: 'INS-005',
    category: 'instruire',
    question: 'Există registru de instruire SSM?',
    expectedAnswer: 'Da, completat corect cu toate instruirile',
    legalBasis: 'Legea 319/2006, art. 26',
    severity: 'major',
    evidenceRequired: 'Registru de instruire actualizat'
  },
  {
    id: 'INS-006',
    category: 'instruire',
    question: 'Lucrătorii tineri (<18 ani) au instruire suplimentară?',
    expectedAnswer: 'Da, conform cerințelor specifice',
    legalBasis: 'HG 1027/2006',
    severity: 'critical',
    evidenceRequired: 'Fișe instruire specifică pentru minori'
  },
  {
    id: 'INS-007',
    category: 'instruire',
    question: 'Există instruire pentru situații de urgență?',
    expectedAnswer: 'Da, pentru evacuare și prim ajutor',
    legalBasis: 'Legea 319/2006, art. 18',
    severity: 'major',
    evidenceRequired: 'Documente instruire situații de urgență'
  },

  // ECHIPAMENT INDIVIDUAL DE PROTECȚIE (EIP)
  {
    id: 'EIP-001',
    category: 'EIP',
    question: 'Angajații primesc EIP conform normelor?',
    expectedAnswer: 'Da, conform HG 1048/2006 și IPER',
    legalBasis: 'HG 1048/2006',
    severity: 'critical',
    evidenceRequired: 'Fișe de dotare EIP semnate'
  },
  {
    id: 'EIP-002',
    category: 'EIP',
    question: 'EIP-urile au certificat de conformitate CE?',
    expectedAnswer: 'Da, toate echipamentele au marcaj CE',
    legalBasis: 'HG 1048/2006, art. 5',
    severity: 'critical',
    evidenceRequired: 'Certificate de conformitate pentru EIP'
  },
  {
    id: 'EIP-003',
    category: 'EIP',
    question: 'Există instrucțiuni de utilizare pentru EIP?',
    expectedAnswer: 'Da, în limba română pentru toate echipamentele',
    legalBasis: 'HG 1048/2006, art. 9',
    severity: 'major',
    evidenceRequired: 'Instrucțiuni producător în limba română'
  },
  {
    id: 'EIP-004',
    category: 'EIP',
    question: 'Se ține evidența distribuirii EIP?',
    expectedAnswer: 'Da, fișe individuale de dotare EIP',
    legalBasis: 'HG 1048/2006',
    severity: 'major',
    evidenceRequired: 'Registru/fișe de evidență EIP'
  },
  {
    id: 'EIP-005',
    category: 'EIP',
    question: 'EIP-urile sunt în stare bună de funcționare?',
    expectedAnswer: 'Da, fără defecțiuni sau uzură excesivă',
    legalBasis: 'HG 1048/2006, art. 10',
    severity: 'major',
    evidenceRequired: 'Verificare vizuală și raport stare EIP'
  },
  {
    id: 'EIP-006',
    category: 'EIP',
    question: 'Se asigură înlocuirea EIP uzat/deteriorat?',
    expectedAnswer: 'Da, la cerere sau la expirare',
    legalBasis: 'HG 1048/2006',
    severity: 'major',
    evidenceRequired: 'Procedură înlocuire EIP și evidență'
  },

  // SEMNALIZARE SSM
  {
    id: 'SGN-001',
    category: 'semnalizare',
    question: 'Există panouri de semnalizare conform HG 971/2006?',
    expectedAnswer: 'Da, pentru toate zonele cu riscuri',
    legalBasis: 'HG 971/2006',
    severity: 'major',
    evidenceRequired: 'Panouri conforme și poziționate corect'
  },
  {
    id: 'SGN-002',
    category: 'semnalizare',
    question: 'Căile de evacuare sunt marcate vizibil?',
    expectedAnswer: 'Da, cu panouri fotoluminiscente sau iluminate',
    legalBasis: 'HG 971/2006 + Normativ P118',
    severity: 'critical',
    evidenceRequired: 'Planșe căi evacuare afișate'
  },
  {
    id: 'SGN-003',
    category: 'semnalizare',
    question: 'Există semnalizare pentru echipamente PSI?',
    expectedAnswer: 'Da, pentru stingătoare, hidranți, alarme',
    legalBasis: 'HG 971/2006',
    severity: 'major',
    evidenceRequired: 'Panouri indicatoare echipamente PSI'
  },
  {
    id: 'SGN-004',
    category: 'semnalizare',
    question: 'Zonele cu pericol special sunt delimitate?',
    expectedAnswer: 'Da, marcaje pe pardoseală și panouri',
    legalBasis: 'HG 971/2006',
    severity: 'major',
    evidenceRequired: 'Delimitări vizibile zone periculoase'
  },
  {
    id: 'SGN-005',
    category: 'semnalizare',
    question: 'Există planuri de evacuare afișate?',
    expectedAnswer: 'Da, la toate ieșirile și zonele comune',
    legalBasis: 'Normativ P118/2013',
    severity: 'critical',
    evidenceRequired: 'Planuri evacuare vizibile și actualizate'
  },

  // INSTALAȚII ȘI ECHIPAMENTE DE MUNCĂ
  {
    id: 'ECH-001',
    category: 'instalatii',
    question: 'Echipamentele de muncă au declarații de conformitate?',
    expectedAnswer: 'Da, pentru toate utilajele și mașinile',
    legalBasis: 'HG 1029/2008',
    severity: 'critical',
    evidenceRequired: 'Declarații conformitate CE'
  },
  {
    id: 'ECH-002',
    category: 'instalatii',
    question: 'Există registre ISCIR pentru instalații sub presiune?',
    expectedAnswer: 'Da, dacă sunt aplicabile',
    legalBasis: 'Reglementări ISCIR',
    severity: 'critical',
    evidenceRequired: 'Registre ISCIR verificate și în termen'
  },
  {
    id: 'ECH-003',
    category: 'instalatii',
    question: 'Instalația electrică are verificare tehnică periodică?',
    expectedAnswer: 'Da, verificare anuală de către autorizat ANRE',
    legalBasis: 'Normativ I7/2011',
    severity: 'critical',
    evidenceRequired: 'Buletin verificare instalație electrică în termen'
  },
  {
    id: 'ECH-004',
    category: 'instalatii',
    question: 'Scările și platformele sunt în siguranță?',
    expectedAnswer: 'Da, fără defecțiuni, cu balustrade conforme',
    legalBasis: 'HG 1091/2006',
    severity: 'major',
    evidenceRequired: 'Verificare vizuală conformitate'
  },
  {
    id: 'ECH-005',
    category: 'instalatii',
    question: 'Echipamentele de lucru la înălțime sunt verificate?',
    expectedAnswer: 'Da, verificări periodice conform producător',
    legalBasis: 'HG 1091/2006',
    severity: 'critical',
    evidenceRequired: 'Fișe verificare scări, schele, platforme'
  },
  {
    id: 'ECH-006',
    category: 'instalatii',
    question: 'Aparatele de ridicat sunt verificate ISCIR?',
    expectedAnswer: 'Da, verificări periodice în termen',
    legalBasis: 'Reglementări ISCIR',
    severity: 'critical',
    evidenceRequired: 'Cărți de identitate ISCIR actualizate'
  },
  {
    id: 'ECH-007',
    category: 'instalatii',
    question: 'Ventilația și climatizarea funcționează corespunzător?',
    expectedAnswer: 'Da, sistem funcțional și întreținut',
    legalBasis: 'Legea 319/2006, art. 13',
    severity: 'major',
    evidenceRequired: 'Documentație revizie tehnică instalații'
  },
  {
    id: 'ECH-008',
    category: 'instalatii',
    question: 'Iluminatul artificial este adecvat?',
    expectedAnswer: 'Da, conform normelor pentru fiecare zonă',
    legalBasis: 'HG 1091/2006, anexa 7',
    severity: 'minor',
    evidenceRequired: 'Măsurători intensitate luminoasă'
  },

  // PRIM AJUTOR
  {
    id: 'PA-001',
    category: 'prim ajutor',
    question: 'Există truse prim ajutor complet echipate?',
    expectedAnswer: 'Da, minimum 1 trusă la 25 angajați',
    legalBasis: 'HG 355/2007',
    severity: 'critical',
    evidenceRequired: 'Truse prim ajutor cu inventar complet'
  },
  {
    id: 'PA-002',
    category: 'prim ajutor',
    question: 'Trusele de prim ajutor sunt ușor accesibile?',
    expectedAnswer: 'Da, semnalizate și în locuri cunoscute',
    legalBasis: 'HG 355/2007',
    severity: 'major',
    evidenceRequired: 'Verificare poziționare și semnalizare'
  },
  {
    id: 'PA-003',
    category: 'prim ajutor',
    question: 'Există personal instruit pentru prim ajutor?',
    expectedAnswer: 'Da, minimum 1 persoană la 25 angajați',
    legalBasis: 'HG 355/2007',
    severity: 'critical',
    evidenceRequired: 'Certificate curs prim ajutor în termen'
  },
  {
    id: 'PA-004',
    category: 'prim ajutor',
    question: 'Există cameră/spațiu pentru acordare prim ajutor?',
    expectedAnswer: 'Da, pentru organizații >50 angajați',
    legalBasis: 'HG 355/2007',
    severity: 'major',
    evidenceRequired: 'Cameră amenajată și dotată corespunzător'
  },
  {
    id: 'PA-005',
    category: 'prim ajutor',
    question: 'Sunt afișate numerele de urgență?',
    expectedAnswer: 'Da, vizibile în toate zonele de muncă',
    legalBasis: 'Legea 319/2006',
    severity: 'major',
    evidenceRequired: 'Panouri cu nr telefon urgență 112, 113'
  },

  // COMITETUL DE SECURITATE ȘI SĂNĂTATE ÎN MUNCĂ
  {
    id: 'CSSM-001',
    category: 'CSSM',
    question: 'Este constituit CSSM pentru >50 angajați?',
    expectedAnswer: 'Da, prin decizie a angajatorului',
    legalBasis: 'Legea 319/2006, art. 31',
    severity: 'critical',
    evidenceRequired: 'Decizie constituire CSSM cu membri nominalizați'
  },
  {
    id: 'CSSM-002',
    category: 'CSSM',
    question: 'CSSM se întrunește trimestrial?',
    expectedAnswer: 'Da, minimum 4 ședințe pe an',
    legalBasis: 'Legea 319/2006, art. 32',
    severity: 'major',
    evidenceRequired: 'Procese verbale ședințe CSSM'
  },
  {
    id: 'CSSM-003',
    category: 'CSSM',
    question: 'Sunt desemnați lucrători cu atribuții SSM?',
    expectedAnswer: 'Da, 1 lucrător la 250 angajați',
    legalBasis: 'Legea 319/2006, art. 20',
    severity: 'major',
    evidenceRequired: 'Decizie desemnare lucrători cu atribuții SSM'
  },
  {
    id: 'CSSM-004',
    category: 'CSSM',
    question: 'Regulamentul de organizare CSSM este afișat?',
    expectedAnswer: 'Da, accesibil tuturor angajaților',
    legalBasis: 'Legea 319/2006, art. 32',
    severity: 'minor',
    evidenceRequired: 'Regulament organizare CSSM'
  },

  // DOCUMENTE MEDICALE
  {
    id: 'MED-001',
    category: 'documente',
    question: 'Toți angajații au aviz medical de angajare?',
    expectedAnswer: 'Da, aviz medicină muncă anterior angajării',
    legalBasis: 'Legea 319/2006, art. 27',
    severity: 'critical',
    evidenceRequired: 'Avize medicale în termen pentru toți angajații'
  },
  {
    id: 'MED-002',
    category: 'documente',
    question: 'Se efectuează controlul medical periodic?',
    expectedAnswer: 'Da, conform periodicității stabilite',
    legalBasis: 'Legea 319/2006, art. 28',
    severity: 'critical',
    evidenceRequired: 'Avize medicale periodice actualizate'
  },
  {
    id: 'MED-003',
    category: 'documente',
    question: 'Există contract cu medicină muncă?',
    expectedAnswer: 'Da, contract valabil cu cabinet autorizat',
    legalBasis: 'Legea 319/2006, art. 27',
    severity: 'critical',
    evidenceRequired: 'Contract medicină muncă în termen'
  },

  // EVIDENȚĂ EVENIMENTE
  {
    id: 'EVT-001',
    category: 'documente',
    question: 'Accidentele de muncă sunt cercetate și înregistrate?',
    expectedAnswer: 'Da, conform procedurii legale',
    legalBasis: 'HG 1425/2006',
    severity: 'critical',
    evidenceRequired: 'Procese verbale cercetare accidente'
  },
  {
    id: 'EVT-002',
    category: 'documente',
    question: 'Există registru de evidență accidente ușoare?',
    expectedAnswer: 'Da, completat la zi',
    legalBasis: 'HG 1425/2006',
    severity: 'major',
    evidenceRequired: 'Registru accidente ușoare'
  },
  {
    id: 'EVT-003',
    category: 'documente',
    question: 'Incidentele periculoase sunt raportate?',
    expectedAnswer: 'Da, conform procedurii interne',
    legalBasis: 'HG 1425/2006',
    severity: 'major',
    evidenceRequired: 'Rapoarte incident periculoase'
  },

  // SITUAȚII SPECIALE
  {
    id: 'SPC-001',
    category: 'documente',
    question: 'Angajatele gravide au condiții adaptate?',
    expectedAnswer: 'Da, conform evaluării riscurilor',
    legalBasis: 'Legea 319/2006, HG 1027/2006',
    severity: 'critical',
    evidenceRequired: 'Evaluări post muncă pentru gravide/lactante'
  },
  {
    id: 'SPC-002',
    category: 'documente',
    question: 'Lucrătorii cu dizabilități au măsuri speciale?',
    expectedAnswer: 'Da, adaptări conform recomandărilor medicale',
    legalBasis: 'Legea 319/2006',
    severity: 'major',
    evidenceRequired: 'Avize medicale cu recomandări și măsuri aplicate'
  }
];

// Helper function to get items by category
export function getChecklistByCategory(category: string): ChecklistItem[] {
  return ssmInspectionChecklist.filter(item => item.category === category);
}

// Helper function to get items by severity
export function getChecklistBySeverity(severity: 'critical' | 'major' | 'minor'): ChecklistItem[] {
  return ssmInspectionChecklist.filter(item => item.severity === severity);
}

// Get all unique categories
export function getCategories(): string[] {
  const categories = new Set(ssmInspectionChecklist.map(item => item.category));
  return Array.from(categories);
}

// Statistics
export const checklistStats = {
  total: ssmInspectionChecklist.length,
  critical: ssmInspectionChecklist.filter(i => i.severity === 'critical').length,
  major: ssmInspectionChecklist.filter(i => i.severity === 'major').length,
  minor: ssmInspectionChecklist.filter(i => i.severity === 'minor').length,
  categories: getCategories().length
};
