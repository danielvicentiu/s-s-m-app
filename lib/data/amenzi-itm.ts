/**
 * Database of ITM (Inspectoratul Teritorial de Muncă) penalties
 * Based on Romanian SSM legislation: Legea 319/2006, HG 1425/2006
 */

export interface ItmPenalty {
  id: string;
  violation: string;
  legalBasis: string;
  minFine: number; // RON
  maxFine: number; // RON
  sanctionType: 'amenda' | 'avertisment' | 'suspendare';
  frequency: 'foarte frecvent' | 'frecvent' | 'mediu' | 'rar';
  avoidanceTips: string[];
}

export const itmPenalties: ItmPenalty[] = [
  {
    id: 'ITM-001',
    violation: 'Lipsa evaluării riscurilor pentru locurile de muncă',
    legalBasis: 'Legea 319/2006 art. 6 alin. 3 lit. b, HG 1425/2006 art. 6',
    minFine: 10000,
    maxFine: 20000,
    sanctionType: 'amenda',
    frequency: 'foarte frecvent',
    avoidanceTips: [
      'Efectuați evaluarea riscurilor pentru toate locurile de muncă',
      'Actualizați evaluarea la minimum anual sau când apar schimbări',
      'Păstrați documentația evaluării în format scris și accesibil'
    ]
  },
  {
    id: 'ITM-002',
    violation: 'Lipsa instruirii personalului în domeniul SSM',
    legalBasis: 'Legea 319/2006 art. 6 alin. 3 lit. f, HG 1425/2006 art. 10',
    minFine: 5000,
    maxFine: 10000,
    sanctionType: 'amenda',
    frequency: 'foarte frecvent',
    avoidanceTips: [
      'Organizați instruire periodică SSM conform art. 10 din HG 1425/2006',
      'Păstrați fișe de instruire semnate de angajați',
      'Instruire la angajare, periodic și la schimbarea locului de muncă'
    ]
  },
  {
    id: 'ITM-003',
    violation: 'Neefectuarea examenului medical la angajare',
    legalBasis: 'Legea 319/2006 art. 6 alin. 3 lit. e, HG 355/2007',
    minFine: 3000,
    maxFine: 6000,
    sanctionType: 'amenda',
    frequency: 'foarte frecvent',
    avoidanceTips: [
      'Organizați examen medical înainte de angajare',
      'Verificați avizul medical de medicina muncii pentru fiecare angajat',
      'Păstrați dosarele medicale actualizate'
    ]
  },
  {
    id: 'ITM-004',
    violation: 'Lipsa echipamentelor individuale de protecție (EIP)',
    legalBasis: 'Legea 319/2006 art. 6 alin. 3 lit. h, HG 1048/2006',
    minFine: 4000,
    maxFine: 8000,
    sanctionType: 'amenda',
    frequency: 'foarte frecvent',
    avoidanceTips: [
      'Asigurați EIP conforme cu riscurile identificate',
      'Emiteți bonuri de consum pentru EIP',
      'Verificați periodic starea și utilizarea EIP'
    ]
  },
  {
    id: 'ITM-005',
    violation: 'Lipsa lucrătorului desemnat pentru SSM',
    legalBasis: 'Legea 319/2006 art. 10, HG 1425/2006 art. 8',
    minFine: 8000,
    maxFine: 16000,
    sanctionType: 'amenda',
    frequency: 'frecvent',
    avoidanceTips: [
      'Desemnați lucrător intern sau angajați serviciu extern SSM',
      'Asigurați-vă că lucrătorul SSM are atestarea necesară',
      'Păstrați contractul/decizia de desemnare în dosarul SSM'
    ]
  },
  {
    id: 'ITM-006',
    violation: 'Neîntocmirea Planului de prevenire și protecție',
    legalBasis: 'Legea 319/2006 art. 6 alin. 3 lit. d, HG 1425/2006 art. 7',
    minFine: 6000,
    maxFine: 12000,
    sanctionType: 'amenda',
    frequency: 'frecvent',
    avoidanceTips: [
      'Elaborați Planul de prevenire și protecție anual',
      'Includeți toate măsurile de SSM specifice activității',
      'Actualizați planul la modificări semnificative'
    ]
  },
  {
    id: 'ITM-007',
    violation: 'Lipsa autorizației de funcționare pentru echipamente de muncă periculoase',
    legalBasis: 'Legea 319/2006 art. 24, HG 1146/2006',
    minFine: 10000,
    maxFine: 20000,
    sanctionType: 'amenda',
    frequency: 'frecvent',
    avoidanceTips: [
      'Obțineți autorizații ISCIR pentru utilaje sub presiune',
      'Verificați periodic starea tehnică a echipamentelor',
      'Păstrați documentația tehnică la zi'
    ]
  },
  {
    id: 'ITM-008',
    violation: 'Nerespectarea normelor de ergonomie la locul de muncă',
    legalBasis: 'Legea 319/2006 art. 6 alin. 3, HG 1091/2006',
    minFine: 2000,
    maxFine: 4000,
    sanctionType: 'amenda',
    frequency: 'mediu',
    avoidanceTips: [
      'Asigurați scaune și birouri ergonomice pentru lucrul la calculator',
      'Respectați pauzele pentru lucrătorii la calculator (5 min/oră)',
      'Evaluați factorii ergonomici din evaluarea de risc'
    ]
  },
  {
    id: 'ITM-009',
    violation: 'Depășirea timpului legal de muncă și neacordarea repausului',
    legalBasis: 'Codul Muncii art. 109-111, Legea 319/2006',
    minFine: 5000,
    maxFine: 10000,
    sanctionType: 'amenda',
    frequency: 'frecvent',
    avoidanceTips: [
      'Respectați limita de 8 ore/zi și 48 ore/săptămână',
      'Acordați repaus de minimum 12 ore între zile de lucru',
      'Monitorizați pontajul și orele suplimentare'
    ]
  },
  {
    id: 'ITM-010',
    violation: 'Lipsa Registrului general de evidență a salariaților',
    legalBasis: 'Legea 53/2003 art. 40, Legea 319/2006',
    minFine: 3000,
    maxFine: 6000,
    sanctionType: 'amenda',
    frequency: 'frecvent',
    avoidanceTips: [
      'Completați REVISAL pentru fiecare angajat înainte de începerea activității',
      'Actualizați registrul la orice modificare contractuală',
      'Păstrați dovezile înregistrărilor REVISAL'
    ]
  },
  {
    id: 'ITM-011',
    violation: 'Nerespectarea condițiilor speciale de muncă pentru femei gravide',
    legalBasis: 'Legea 319/2006 art. 28, Codul Muncii art. 58',
    minFine: 4000,
    maxFine: 8000,
    sanctionType: 'amenda',
    frequency: 'mediu',
    avoidanceTips: [
      'Interziceți munca nocturnă pentru gravide și mame cu copii sub 1 an',
      'Adaptați locul de muncă conform recomandărilor medicale',
      'Nu atribuiți sarcini cu efort fizic sau expunere la riscuri'
    ]
  },
  {
    id: 'ITM-012',
    violation: 'Lipsa măsurilor de protecție împotriva incendiilor',
    legalBasis: 'Legea 307/2006, Legea 319/2006 art. 6',
    minFine: 6000,
    maxFine: 12000,
    sanctionType: 'amenda',
    frequency: 'frecvent',
    avoidanceTips: [
      'Asigurați stingătoare conform normelor PSI',
      'Verificați periodic starea stingătoarelor',
      'Afișați planuri de evacuare și marcaje vizibile'
    ]
  },
  {
    id: 'ITM-013',
    violation: 'Utilizarea lucrătorilor fără contract individual de muncă (muncă la negru)',
    legalBasis: 'Legea 53/2003 art. 16, Legea 319/2006',
    minFine: 20000,
    maxFine: 40000,
    sanctionType: 'amenda',
    frequency: 'mediu',
    avoidanceTips: [
      'Întocmiți CIM înainte de începerea activității',
      'Înregistrați în REVISAL înainte de prima zi de lucru',
      'Păstrați evidența strictă a tuturor angajaților'
    ]
  },
  {
    id: 'ITM-014',
    violation: 'Neorganizarea instruirii privind PSI (prevenire și stingere incendii)',
    legalBasis: 'Legea 307/2006, HG 1492/2004',
    minFine: 3000,
    maxFine: 6000,
    sanctionType: 'amenda',
    frequency: 'frecvent',
    avoidanceTips: [
      'Organizați instruire PSI periodic conform legislației',
      'Desemnați echipă de intervenție în caz de incendiu',
      'Păstrați fișe de instruire semnate'
    ]
  },
  {
    id: 'ITM-015',
    violation: 'Lipsa semnalizării de securitate la locul de muncă',
    legalBasis: 'Legea 319/2006 art. 6, HG 1425/2006 Anexa 1',
    minFine: 2000,
    maxFine: 4000,
    sanctionType: 'amenda',
    frequency: 'frecvent',
    avoidanceTips: [
      'Instalați panouri de avertizare, interdicție, obligație conform HG 1425/2006',
      'Asigurați marcaje vizibile pentru căi de evacuare',
      'Verificați periodic vizibilitatea semnalizărilor'
    ]
  },
  {
    id: 'ITM-016',
    violation: 'Nerespectarea normelor de iluminat la locul de muncă',
    legalBasis: 'Legea 319/2006, HG 1091/2006',
    minFine: 2000,
    maxFine: 4000,
    sanctionType: 'amenda',
    frequency: 'mediu',
    avoidanceTips: [
      'Asigurați iluminat natural și artificial conform normelor',
      'Măsurați nivelul de iluminare în zonele de lucru',
      'Înlocuiți corpurile de iluminat defecte prompt'
    ]
  },
  {
    id: 'ITM-017',
    violation: 'Lipsa autorizației sanitar-veterinare pentru activități specifice',
    legalBasis: 'Legea 319/2006, Legislație ANSVSA',
    minFine: 5000,
    maxFine: 10000,
    sanctionType: 'amenda',
    frequency: 'mediu',
    avoidanceTips: [
      'Obțineți autorizație sanitar-veterinară pentru alimentație publică',
      'Asigurați controale medicale periodice pentru personal',
      'Respectați normele de igienă specifice'
    ]
  },
  {
    id: 'ITM-018',
    violation: 'Nerespectarea normelor de ventilație și climatizare',
    legalBasis: 'Legea 319/2006 art. 6, HG 1091/2006',
    minFine: 3000,
    maxFine: 6000,
    sanctionType: 'amenda',
    frequency: 'mediu',
    avoidanceTips: [
      'Asigurați ventilație naturală sau mecanică corespunzătoare',
      'Verificați și întreținați sistemele de climatizare',
      'Măsurați calitatea aerului în spații închise'
    ]
  },
  {
    id: 'ITM-019',
    violation: 'Lipsa instructiunilor proprii de SSM pentru activități specifice',
    legalBasis: 'Legea 319/2006 art. 6 alin. 3 lit. f, HG 1425/2006',
    minFine: 4000,
    maxFine: 8000,
    sanctionType: 'amenda',
    frequency: 'frecvent',
    avoidanceTips: [
      'Elaborați instrucțiuni proprii pentru fiecare post de lucru',
      'Afișați instrucțiunile la locurile de muncă',
      'Instruiți personalul conform instrucțiunilor specifice'
    ]
  },
  {
    id: 'ITM-020',
    violation: 'Nerespectarea programului de Control Tehnic Periodic (ITP) pentru utilaje',
    legalBasis: 'Legea 319/2006 art. 24, HG 1146/2006',
    minFine: 5000,
    maxFine: 10000,
    sanctionType: 'amenda',
    frequency: 'mediu',
    avoidanceTips: [
      'Respectați termenele de verificare tehnică periodică',
      'Păstrați registre de revizie și rapoarte CTP',
      'Nu utilizați echipamente cu verificare expirată'
    ]
  },
  {
    id: 'ITM-021',
    violation: 'Lipsa dozimetrelor pentru personal expus la radiații',
    legalBasis: 'Legea 319/2006, OUG 95/2002 privind protecția radiologică',
    minFine: 8000,
    maxFine: 16000,
    sanctionType: 'amenda',
    frequency: 'rar',
    avoidanceTips: [
      'Dotați personalul cu dozimetre personale',
      'Monitorizați lunar expunerea la radiații',
      'Respectați limitele de expunere legale'
    ]
  },
  {
    id: 'ITM-022',
    violation: 'Nerespectarea normelor de manipulare a substanțelor chimice periculoase',
    legalBasis: 'Legea 319/2006, Regulamentul REACH, HG 1408/2008',
    minFine: 6000,
    maxFine: 12000,
    sanctionType: 'amenda',
    frequency: 'frecvent',
    avoidanceTips: [
      'Solicitați și afișați Fișele de Securitate (MSDS) pentru chimicale',
      'Instruiți personalul despre manipularea substanțelor',
      'Asigurați depozitare conformă și ventilație adecvată'
    ]
  },
  {
    id: 'ITM-023',
    violation: 'Lipsa echipei de prim ajutor și a truselor medicale',
    legalBasis: 'Legea 319/2006 art. 6 alin. 3 lit. g, HG 1425/2006',
    minFine: 3000,
    maxFine: 6000,
    sanctionType: 'amenda',
    frequency: 'frecvent',
    avoidanceTips: [
      'Desemnați și instruiți echipa de prim ajutor',
      'Dotați locul de muncă cu trusă medicală completă',
      'Verificați și reînnoiți periodic conținutul trusei'
    ]
  },
  {
    id: 'ITM-024',
    violation: 'Utilizarea minorilor pentru muncă periculoasă sau nocivă',
    legalBasis: 'Legea 319/2006 art. 30, Codul Muncii art. 63',
    minFine: 10000,
    maxFine: 20000,
    sanctionType: 'amenda',
    frequency: 'rar',
    avoidanceTips: [
      'Interziceți munca nocturnă pentru persoane sub 18 ani',
      'Nu atribuiți minorilor sarcini periculoase sau grele',
      'Respectați limitele orare pentru tinerii de 15-18 ani'
    ]
  },
  {
    id: 'ITM-025',
    violation: 'Nerespectarea normelor de protecție împotriva zgomotului',
    legalBasis: 'Legea 319/2006, HG 493/2006 privind zgomotul',
    minFine: 4000,
    maxFine: 8000,
    sanctionType: 'amenda',
    frequency: 'mediu',
    avoidanceTips: [
      'Măsurați nivelul de zgomot în zonele de lucru',
      'Asigurați EIP (căști, dopuri) pentru zgomot >85dB',
      'Limitați timpul de expunere la zgomot intens'
    ]
  },
  {
    id: 'ITM-026',
    violation: 'Lipsa Comitetului de Securitate și Sănătate în Muncă (peste 50 angajați)',
    legalBasis: 'Legea 319/2006 art. 18, HG 1425/2006',
    minFine: 5000,
    maxFine: 10000,
    sanctionType: 'amenda',
    frequency: 'mediu',
    avoidanceTips: [
      'Constituiți CSSM dacă aveți minimum 50 angajați',
      'Organizați ședințe trimestriale și păstrați procesele-verbale',
      'Asigurați reprezentanți atât din management cât și din rândul angajaților'
    ]
  },
  {
    id: 'ITM-027',
    violation: 'Nerespectarea normelor de protecție împotriva vibrațiilor',
    legalBasis: 'Legea 319/2006, HG 1876/2005 privind vibrațiile',
    minFine: 3000,
    maxFine: 6000,
    sanctionType: 'amenda',
    frequency: 'rar',
    avoidanceTips: [
      'Măsurați nivelul de vibrații pentru echipamente',
      'Utilizați echipamente cu nivel redus de vibrații',
      'Respectați pauzele pentru operatorii expuși'
    ]
  },
  {
    id: 'ITM-028',
    violation: 'Neefectuarea controalelor medicale periodice',
    legalBasis: 'Legea 319/2006 art. 6 alin. 3 lit. e, HG 355/2007',
    minFine: 4000,
    maxFine: 8000,
    sanctionType: 'amenda',
    frequency: 'foarte frecvent',
    avoidanceTips: [
      'Programați controale medicale periodice conform HG 355/2007',
      'Respectați frecvența controalelor (anual, la 6 luni pentru riscuri)',
      'Nu permiteți lucrul fără aviz medical valabil'
    ]
  },
  {
    id: 'ITM-029',
    violation: 'Lipsa măsurilor de protecție la lucrul la înălțime',
    legalBasis: 'Legea 319/2006, HG 300/2006 privind lucrul la înălțime',
    minFine: 8000,
    maxFine: 16000,
    sanctionType: 'amenda',
    frequency: 'frecvent',
    avoidanceTips: [
      'Asigurați echipamente certificate pentru lucru la înălțime (centuri, harnașamente)',
      'Instruiți personalul specific pentru lucru la înălțime',
      'Verificați schelele și platformele înainte de utilizare'
    ]
  },
  {
    id: 'ITM-030',
    violation: 'Nerespectarea condițiilor de lucru în spații închise/confinate',
    legalBasis: 'Legea 319/2006, normele tehnice specifice',
    minFine: 10000,
    maxFine: 20000,
    sanctionType: 'suspendare',
    frequency: 'rar',
    avoidanceTips: [
      'Evaluați atmosfera înainte de intrare (O2, gaze toxice)',
      'Asigurați supraveghere permanentă din exterior',
      'Dotați personalul cu echipament respirator și hamuri de salvare'
    ]
  },
  {
    id: 'ITM-031',
    violation: 'Lipsa documentației tehnice pentru utilajele de lucru',
    legalBasis: 'Legea 319/2006 art. 24, HG 1146/2006',
    minFine: 3000,
    maxFine: 6000,
    sanctionType: 'amenda',
    frequency: 'frecvent',
    avoidanceTips: [
      'Păstrați manualele de utilizare pentru toate utilajele',
      'Solicitați declarații de conformitate CE',
      'Arhivați certificatele de verificare tehnică'
    ]
  },
  {
    id: 'ITM-032',
    violation: 'Nerespectarea normelor de manipulare manuală a sarcinilor',
    legalBasis: 'Legea 319/2006, HG 1091/2006',
    minFine: 2000,
    maxFine: 4000,
    sanctionType: 'amenda',
    frequency: 'mediu',
    avoidanceTips: [
      'Limitați greutățile manipulate manual (max 30kg bărbați, 20kg femei)',
      'Asigurați mijloace mecanice pentru sarcini grele',
      'Instruiți personalul despre tehnici corecte de ridicare'
    ]
  },
  {
    id: 'ITM-033',
    violation: 'Lipsa planului de evacuare și a exercițiilor de evacuare',
    legalBasis: 'Legea 307/2006, Legea 319/2006',
    minFine: 4000,
    maxFine: 8000,
    sanctionType: 'amenda',
    frequency: 'frecvent',
    avoidanceTips: [
      'Elaborați și afișați planuri de evacuare clare',
      'Organizați exerciții de evacuare semestriale',
      'Desemnați responsabili pentru evacuare pe zone'
    ]
  },
  {
    id: 'ITM-034',
    violation: 'Nerespectarea distanței de securitate la locurile de muncă',
    legalBasis: 'Legea 319/2006, normele ergonomice',
    minFine: 2000,
    maxFine: 4000,
    sanctionType: 'avertisment',
    frequency: 'mediu',
    avoidanceTips: [
      'Asigurați minimum 2m² spațiu liber per lucrător',
      'Marcați zonele de circulație și cele de lucru',
      'Evitați supraaglomerarea spațiilor de lucru'
    ]
  },
  {
    id: 'ITM-035',
    violation: 'Lipsa autorizației de transport pentru mărfuri periculoase (ADR)',
    legalBasis: 'Legea 319/2006, Acordul ADR',
    minFine: 10000,
    maxFine: 20000,
    sanctionType: 'amenda',
    frequency: 'rar',
    avoidanceTips: [
      'Obțineți autorizații ADR pentru vehicule și șoferi',
      'Asigurați instruire ADR pentru conducătorii auto',
      'Respectați normele de etichetare și marcare a mărfurilor'
    ]
  },
  {
    id: 'ITM-036',
    violation: 'Nerespectarea timpului de conducere și repaus pentru șoferi profesioniști',
    legalBasis: 'Regulamentul CE 561/2006, Legea 319/2006',
    minFine: 6000,
    maxFine: 12000,
    sanctionType: 'amenda',
    frequency: 'frecvent',
    avoidanceTips: [
      'Monitorizați timpii de conducere prin tahograf digital',
      'Asigurați repaus de 11 ore între ture',
      'Respectați limita de 9 ore conducere/zi'
    ]
  },
  {
    id: 'ITM-037',
    violation: 'Lipsa măsurilor de protecție împotriva electrocutării',
    legalBasis: 'Legea 319/2006, normele ANRE',
    minFine: 8000,
    maxFine: 16000,
    sanctionType: 'suspendare',
    frequency: 'frecvent',
    avoidanceTips: [
      'Asigurați prize și tablouri electrice conforme',
      'Verificați periodic instalațiile electrice',
      'Permiteți lucrări electrice doar personalului autorizat ANRE'
    ]
  },
  {
    id: 'ITM-038',
    violation: 'Nerespectarea normelor de igienă în sectorul alimentar',
    legalBasis: 'Legea 319/2006, Regulament CE 852/2004 HACCP',
    minFine: 5000,
    maxFine: 10000,
    sanctionType: 'amenda',
    frequency: 'mediu',
    avoidanceTips: [
      'Implementați sistemul HACCP',
      'Asigurați controale medicale pentru personal',
      'Respectați temperatura de depozitare și lanțul de frig'
    ]
  },
  {
    id: 'ITM-039',
    violation: 'Lipsa certificatului de urbanism pentru modificări ale spațiului de lucru',
    legalBasis: 'Legea 50/1991, Legea 319/2006',
    minFine: 4000,
    maxFine: 8000,
    sanctionType: 'amenda',
    frequency: 'rar',
    avoidanceTips: [
      'Obțineți autorizație de construire pentru modificări structurale',
      'Respectați normele de prevenire a incendiilor la amenajări',
      'Consultați un arhitect autorizat'
    ]
  },
  {
    id: 'ITM-040',
    violation: 'Neraportarea accidentelor de muncă în termen legal (24h)',
    legalBasis: 'Legea 319/2006 art. 12-13, HG 1425/2006',
    minFine: 10000,
    maxFine: 20000,
    sanctionType: 'amenda',
    frequency: 'mediu',
    avoidanceTips: [
      'Raportați accidentele în maximum 24h la ITM',
      'Întocmiți proces-verbal de cercetare a accidentului',
      'Luați măsuri imediate de prevenire a repetării'
    ]
  }
];

/**
 * Get penalty by ID
 */
export function getPenaltyById(id: string): ItmPenalty | undefined {
  return itmPenalties.find(penalty => penalty.id === id);
}

/**
 * Filter penalties by frequency
 */
export function getPenaltiesByFrequency(frequency: ItmPenalty['frequency']): ItmPenalty[] {
  return itmPenalties.filter(penalty => penalty.frequency === frequency);
}

/**
 * Filter penalties by sanction type
 */
export function getPenaltiesBySanctionType(sanctionType: ItmPenalty['sanctionType']): ItmPenalty[] {
  return itmPenalties.filter(penalty => penalty.sanctionType === sanctionType);
}

/**
 * Get total penalties count
 */
export function getTotalPenaltiesCount(): number {
  return itmPenalties.length;
}
