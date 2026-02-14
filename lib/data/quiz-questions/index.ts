/**
 * Quiz Question Bank for Training Assessments
 *
 * Categories:
 * - introductiv-general: General introductory SSM training (30 questions)
 * - introductiv-loc-munca: Workplace-specific introductory training (20 questions)
 * - periodic: Periodic refresher training (20 questions)
 * - PSI: Fire safety training (20 questions)
 * - prim-ajutor: First aid training (20 questions)
 */

export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export type QuizCategory =
  | 'introductiv-general'
  | 'introductiv-loc-munca'
  | 'periodic'
  | 'PSI'
  | 'prim-ajutor';

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  difficulty: QuizDifficulty;
  category: QuizCategory;
}

// ============================================================================
// INTRODUCTIV-GENERAL (30 întrebări)
// ============================================================================

const introductivGeneralQuestions: QuizQuestion[] = [
  {
    id: 'ig-001',
    question: 'Ce înseamnă SSM?',
    options: [
      'Siguranța și Sănătatea în Muncă',
      'Sistem de Securitate și Management',
      'Servicii de Securitate Medicală',
      'Siguranța la Substanțe Medicale'
    ],
    correctIndex: 0,
    explanation: 'SSM înseamnă Siguranța și Sănătatea în Muncă și reprezintă ansamblul de măsuri tehnice, organizatorice și medicale pentru protejarea angajaților.',
    difficulty: 'easy',
    category: 'introductiv-general'
  },
  {
    id: 'ig-002',
    question: 'Care este scopul principal al legislației SSM?',
    options: [
      'Creșterea productivității',
      'Protejarea vieții și sănătății lucrătorilor',
      'Reducerea costurilor firmei',
      'Îmbunătățirea imaginii companiei'
    ],
    correctIndex: 1,
    explanation: 'Scopul fundamental al legislației SSM este protejarea vieții și sănătății lucrătorilor prin prevenirea accidentelor de muncă și bolilor profesionale.',
    difficulty: 'easy',
    category: 'introductiv-general'
  },
  {
    id: 'ig-003',
    question: 'Cine este responsabil principal pentru asigurarea securității și sănătății lucrătorilor?',
    options: [
      'Angajatul însuși',
      'Sindicatul',
      'Angajatorul',
      'Inspectoratul de Muncă'
    ],
    correctIndex: 2,
    explanation: 'Conform legislației, angajatorul are responsabilitatea principală pentru asigurarea securității și sănătății lucrătorilor la locul de muncă.',
    difficulty: 'easy',
    category: 'introductiv-general'
  },
  {
    id: 'ig-004',
    question: 'Ce obligație are angajatul în domeniul SSM?',
    options: [
      'Să verifice documentația SSM',
      'Să respecte măsurile de securitate și să folosească echipamentul de protecție',
      'Să instruiască alți angajați',
      'Să efectueze controale periodice'
    ],
    correctIndex: 1,
    explanation: 'Angajatul este obligat să respecte măsurile de securitate stabilite de angajator și să utilizeze corect echipamentul individual de protecție.',
    difficulty: 'easy',
    category: 'introductiv-general'
  },
  {
    id: 'ig-005',
    question: 'Ce este un echipament individual de protecție (EIP)?',
    options: [
      'Orice echipament folosit la lucru',
      'Echipament destinat să fie purtat de lucrător pentru protecție împotriva riscurilor',
      'Doar echipamentul medical',
      'Scule și unelte de lucru'
    ],
    correctIndex: 1,
    explanation: 'EIP este orice echipament destinat să fie purtat sau ținut de lucrător pentru protecția sa împotriva unuia sau mai multor riscuri.',
    difficulty: 'easy',
    category: 'introductiv-general'
  },
  {
    id: 'ig-006',
    question: 'Cât durează instruirea introductivă generală?',
    options: [
      'Minim 4 ore',
      'Minim 6 ore',
      'Minim 8 ore',
      'Minim 2 ore'
    ],
    correctIndex: 2,
    explanation: 'Instruirea introductivă generală trebuie să aibă o durată minimă de 8 ore, conform normelor în vigoare.',
    difficulty: 'medium',
    category: 'introductiv-general'
  },
  {
    id: 'ig-007',
    question: 'Ce este un accident de muncă?',
    options: [
      'Orice accidentare în timpul lucrului',
      'Vătămarea violentă a organismului în timpul procesului de muncă',
      'Doar accidente grave',
      'Accidente în deplasare la serviciu'
    ],
    correctIndex: 1,
    explanation: 'Accidentul de muncă este vătămarea violentă a organismului, care are loc în timpul procesului de muncă sau în îndeplinirea îndatoririlor de serviciu.',
    difficulty: 'medium',
    category: 'introductiv-general'
  },
  {
    id: 'ig-008',
    question: 'În cât timp trebuie raportat un accident de muncă la Inspectoratul de Muncă?',
    options: [
      'Imediat',
      'În 24 de ore',
      'În 3 zile lucrătoare',
      'În 7 zile'
    ],
    correctIndex: 1,
    explanation: 'Accidentele de muncă trebuie raportate la Inspectoratul Teritorial de Muncă în termen de 24 de ore de la producere.',
    difficulty: 'medium',
    category: 'introductiv-general'
  },
  {
    id: 'ig-009',
    question: 'Ce reprezintă evaluarea riscurilor?',
    options: [
      'O simplă verificare a locului de muncă',
      'Procesul de identificare și analiză a pericolelor și riscurilor',
      'Doar controlul echipamentelor',
      'Verificarea documentelor SSM'
    ],
    correctIndex: 1,
    explanation: 'Evaluarea riscurilor este procesul de identificare, analiză și evaluare sistematică a tuturor pericolelor și riscurilor de la locul de muncă.',
    difficulty: 'medium',
    category: 'introductiv-general'
  },
  {
    id: 'ig-010',
    question: 'Ce culoare au indicatoarele de obligativitate?',
    options: [
      'Roșu',
      'Verde',
      'Albastru',
      'Galben'
    ],
    correctIndex: 2,
    explanation: 'Indicatoarele de obligativitate (ex: purtarea echipamentului de protecție) sunt de culoare albastru cu simbol alb.',
    difficulty: 'easy',
    category: 'introductiv-general'
  },
  {
    id: 'ig-011',
    question: 'Ce culoare au panourile de interdicție?',
    options: [
      'Roșu și alb',
      'Galben și negru',
      'Verde și alb',
      'Albastru și alb'
    ],
    correctIndex: 0,
    explanation: 'Panourile de interdicție sunt circulare cu fond alb, contur și bandă oblică roșii, cu simbol negru.',
    difficulty: 'easy',
    category: 'introductiv-general'
  },
  {
    id: 'ig-012',
    question: 'Ce semnificație au panourile galbene cu negru?',
    options: [
      'Obligativitate',
      'Interdicție',
      'Avertizare/atenționare',
      'Salvare'
    ],
    correctIndex: 2,
    explanation: 'Panourile de avertizare/atenționare sunt triunghiulare, cu fond galben, contur și simbol negru.',
    difficulty: 'easy',
    category: 'introductiv-general'
  },
  {
    id: 'ig-013',
    question: 'Cât timp este valabilă instruirea periodică?',
    options: [
      '3 luni',
      '6 luni',
      '1 an',
      '2 ani'
    ],
    correctIndex: 2,
    explanation: 'De regulă, instruirea periodică se efectuează anual, cu posibilitatea unor perioade mai scurte pentru activități cu risc crescut.',
    difficulty: 'medium',
    category: 'introductiv-general'
  },
  {
    id: 'ig-014',
    question: 'Ce trebuie făcut dacă un echipament de protecție este deteriorat?',
    options: [
      'Continui să-l folosești',
      'Încerci să-l repari singur',
      'Anunți imediat și înlocuiești echipamentul',
      'Îl dai unui coleg'
    ],
    correctIndex: 2,
    explanation: 'Echipamentul de protecție deteriorat trebuie anunțat imediat, scos din uz și înlocuit pentru a menține nivelul de protecție.',
    difficulty: 'easy',
    category: 'introductiv-general'
  },
  {
    id: 'ig-015',
    question: 'Ce este ergonomia la locul de muncă?',
    options: [
      'Design-ul biroului',
      'Știința adaptării locului de muncă la om',
      'Organizarea documentelor',
      'Curățenia la birou'
    ],
    correctIndex: 1,
    explanation: 'Ergonomia este știința care studiază adaptarea condițiilor de muncă la capacitățile fizice și psihice ale omului.',
    difficulty: 'medium',
    category: 'introductiv-general'
  },
  {
    id: 'ig-016',
    question: 'Care este limita maximă de greutate pentru manipularea manuală ocazională (bărbați)?',
    options: [
      '20 kg',
      '30 kg',
      '50 kg',
      '75 kg'
    ],
    correctIndex: 2,
    explanation: 'Pentru bărbați adulți, limita maximă pentru manipularea manuală ocazională este de 50 kg, conform normelor de ergonomie.',
    difficulty: 'hard',
    category: 'introductiv-general'
  },
  {
    id: 'ig-017',
    question: 'Ce trebuie să facă un lucrător dacă observă o situație periculoasă?',
    options: [
      'Să o ignore dacă nu îl afectează direct',
      'Să aștepte până la sfârșitul programului',
      'Să anunțe imediat conducătorul direct sau responsabilul SSM',
      'Să facă o notă în registru la sfârșitul săptămânii'
    ],
    correctIndex: 2,
    explanation: 'Orice situație periculoasă trebuie anunțată imediat pentru a preveni accidente. Este o obligație legală a angajatului.',
    difficulty: 'easy',
    category: 'introductiv-general'
  },
  {
    id: 'ig-018',
    question: 'Ce înseamnă lucrul la înălțime conform legislației SSM?',
    options: [
      'Lucru peste 1 metru',
      'Lucru peste 2 metri',
      'Lucru peste 3 metri',
      'Lucru peste 5 metri'
    ],
    correctIndex: 1,
    explanation: 'Conform normelor SSM, lucrul la înălțime se consideră a fi activitatea desfășurată la o înălțime de peste 2 metri față de nivelul de referință.',
    difficulty: 'medium',
    category: 'introductiv-general'
  },
  {
    id: 'ig-019',
    question: 'Care este scopul instrucțiunilor proprii de securitate și sănătate în muncă?',
    options: [
      'Să ocupe spațiu în dosar',
      'Să fie afișate pe pereți',
      'Să stabilească reguli concrete pentru fiecare loc de muncă/profesie',
      'Să fie citite o dată pe an'
    ],
    correctIndex: 2,
    explanation: 'Instrucțiunile proprii stabilesc reguli concrete și specifice pentru fiecare loc de muncă sau profesie, adaptate la riscurile identificate.',
    difficulty: 'medium',
    category: 'introductiv-general'
  },
  {
    id: 'ig-020',
    question: 'Cine poate opri lucrul în caz de pericol iminent?',
    options: [
      'Doar directorul',
      'Doar inspectorul de muncă',
      'Orice angajat care constată pericolul',
      'Doar responsabilul SSM'
    ],
    correctIndex: 2,
    explanation: 'În situații de pericol iminent, orice angajat are dreptul și obligația să oprească lucrul și să anunțe conducerea.',
    difficulty: 'medium',
    category: 'introductiv-general'
  },
  {
    id: 'ig-021',
    question: 'Ce este o boală profesională?',
    options: [
      'Orice boală apărută la locul de muncă',
      'Boală cauzată de factorii de risc specifici locului de muncă',
      'Răceala luată la birou',
      'Boli contagioase'
    ],
    correctIndex: 1,
    explanation: 'Boala profesională este afecțiunea produsă de factorii nocivi specifici locului de muncă, recunoscută ca atare de legislație.',
    difficulty: 'medium',
    category: 'introductiv-general'
  },
  {
    id: 'ig-022',
    question: 'La ce interval se face examinarea medicală periodică pentru lucrătorii expuși la zgomot?',
    options: [
      '6 luni',
      '1 an',
      '2 ani',
      '3 ani'
    ],
    correctIndex: 1,
    explanation: 'Pentru lucrătorii expuși la zgomot, examinarea medicală periodică se efectuează, de regulă, anual, conform legislației medicale.',
    difficulty: 'hard',
    category: 'introductiv-general'
  },
  {
    id: 'ig-023',
    question: 'Ce înseamnă DPI?',
    options: [
      'Document de Protecție Individuală',
      'Dispozitiv de Prevenire a Incendiilor',
      'Dispozitiv de Protecție Individuală',
      'Dosar Personal Individual'
    ],
    correctIndex: 2,
    explanation: 'DPI înseamnă Dispozitiv de Protecție Individuală - echipament destinat să fie purtat pentru protecție împotriva riscurilor.',
    difficulty: 'easy',
    category: 'introductiv-general'
  },
  {
    id: 'ig-024',
    question: 'Care este tensiunea electrică considerată periculoasă în mediu uscat?',
    options: [
      'Peste 24V',
      'Peste 50V',
      'Peste 110V',
      'Peste 220V'
    ],
    correctIndex: 1,
    explanation: 'În mediu uscat, tensiunea peste 50V curent alternativ sau 120V curent continuu este considerată periculoasă pentru organismul uman.',
    difficulty: 'hard',
    category: 'introductiv-general'
  },
  {
    id: 'ig-025',
    question: 'Ce trebuie să conțină un loc de muncă organizat ergonomic?',
    options: [
      'Doar un scaun confortabil',
      'Iluminare, climatizare, spațiu adecvat și echipament adaptat',
      'Doar un birou mare',
      'Doar un computer performant'
    ],
    correctIndex: 1,
    explanation: 'Un loc de muncă ergonomic include iluminare corespunzătoare, climatizare adecvată, spațiu suficient și echipament adaptat nevoilor lucrătorului.',
    difficulty: 'medium',
    category: 'introductiv-general'
  },
  {
    id: 'ig-026',
    question: 'Care este rolul Comitetului de Securitate și Sănătate în Muncă?',
    options: [
      'Să aplice sancțiuni',
      'Să consulte și să participe la îmbunătățirea condițiilor de muncă',
      'Să înlocuiască responsabilul SSM',
      'Să verifice pontajele'
    ],
    correctIndex: 1,
    explanation: 'Comitetul de SSM este un organ consultativ care participă la identificarea riscurilor și îmbunătățirea condițiilor de muncă.',
    difficulty: 'medium',
    category: 'introductiv-general'
  },
  {
    id: 'ig-027',
    question: 'Când este obligatorie constituirea Comitetului de SSM?',
    options: [
      'La 10 angajați',
      'La 25 angajați',
      'La 50 angajați',
      'La 100 angajați'
    ],
    correctIndex: 2,
    explanation: 'Angajatorul are obligația de a constitui Comitetul de SSM când are cel puțin 50 de angajați.',
    difficulty: 'hard',
    category: 'introductiv-general'
  },
  {
    id: 'ig-028',
    question: 'Ce semnifică culoarea verde pe panourile de siguranță?',
    options: [
      'Interdicție',
      'Avertizare',
      'Salvare, evacuare, prim ajutor',
      'Obligativitate'
    ],
    correctIndex: 2,
    explanation: 'Culoarea verde cu alb indică căi de evacuare, ieșiri de urgență, locații de prim ajutor și echipamente de salvare.',
    difficulty: 'easy',
    category: 'introductiv-general'
  },
  {
    id: 'ig-029',
    question: 'Cine asigură finanțarea măsurilor de securitate și sănătate în muncă?',
    options: [
      'Angajații',
      'Angajatorul exclusiv',
      'Statul',
      'Sindicatul'
    ],
    correctIndex: 1,
    explanation: 'Angajatorul are obligația exclusivă de a asigura și suporta toate costurile legate de securitatea și sănătatea în muncă.',
    difficulty: 'easy',
    category: 'introductiv-general'
  },
  {
    id: 'ig-030',
    question: 'Ce document trebuie să aibă fiecare angajat la începerea activității?',
    options: [
      'Doar contractul de muncă',
      'Fișa postului și instruirea SSM completată',
      'Doar legitimația de serviciu',
      'Doar adeverința medicală'
    ],
    correctIndex: 1,
    explanation: 'Fiecare angajat trebuie să aibă fișa postului și să fie instruit în domeniul SSM înainte de a începe activitatea, cu dovada instruirii completată.',
    difficulty: 'medium',
    category: 'introductiv-general'
  }
];

// ============================================================================
// INTRODUCTIV-LOC-MUNCA (20 întrebări)
// ============================================================================

const introductivLocMuncaQuestions: QuizQuestion[] = [
  {
    id: 'ilm-001',
    question: 'Care este scopul instruirii la locul de muncă?',
    options: [
      'Să îndeplinești o formalitate',
      'Să cunoști riscurile specifice postului tău și măsurile de protecție',
      'Să completezi un registru',
      'Să treci un test'
    ],
    correctIndex: 1,
    explanation: 'Instruirea la locul de muncă îți prezintă riscurile specifice postului tău și măsurile concrete de protecție necesare.',
    difficulty: 'easy',
    category: 'introductiv-loc-munca'
  },
  {
    id: 'ilm-002',
    question: 'Cine efectuează instruirea la locul de muncă?',
    options: [
      'Responsabilul SSM',
      'Șeful direct/coordonator',
      'Un coleg',
      'Directorul general'
    ],
    correctIndex: 1,
    explanation: 'Instruirea la locul de muncă este efectuată de șeful direct sau coordonatorul care cunoaște cel mai bine specificul activității.',
    difficulty: 'easy',
    category: 'introductiv-loc-munca'
  },
  {
    id: 'ilm-003',
    question: 'Când trebuie efectuată instruirea la locul de muncă?',
    options: [
      'Într-o lună de la angajare',
      'În prima zi de lucru efectiv',
      'Când ai timp',
      'După 3 luni de probă'
    ],
    correctIndex: 1,
    explanation: 'Instruirea la locul de muncă trebuie efectuată înainte de începerea efectivă a activității, în prima zi de lucru.',
    difficulty: 'medium',
    category: 'introductiv-loc-munca'
  },
  {
    id: 'ilm-004',
    question: 'Ce trebuie să conțină instrucțiunea proprie pentru postul tău?',
    options: [
      'Doar reguli generale',
      'Riscuri specifice, măsuri de protecție și proceduri de urgență',
      'Doar descrierea sarcinilor',
      'Doar obligațiile angajatului'
    ],
    correctIndex: 1,
    explanation: 'Instrucțiunea proprie trebuie să conțină riscurile specifice postului, măsurile de protecție necesare și procedurile de urgență.',
    difficulty: 'medium',
    category: 'introductiv-loc-munca'
  },
  {
    id: 'ilm-005',
    question: 'Ce faci dacă nu ai primit echipamentul de protecție necesar?',
    options: [
      'Începi lucrul oricum',
      'Refuzi să începi lucrul până primești echipamentul',
      'Folosești echipamentul colegului',
      'Improvizezi cu ce ai'
    ],
    correctIndex: 1,
    explanation: 'Ai dreptul și obligația să refuzi să începi lucrul dacă nu ai echipamentul de protecție corespunzător, pentru siguranța ta.',
    difficulty: 'easy',
    category: 'introductiv-loc-munca'
  },
  {
    id: 'ilm-006',
    question: 'Unde trebuie să fie afișate instrucțiunile de securitate?',
    options: [
      'În biroul directorului',
      'La locul de muncă, vizibile și accesibile',
      'În arhivă',
      'Doar în format digital'
    ],
    correctIndex: 1,
    explanation: 'Instrucțiunile de securitate trebuie afișate la locul de muncă, într-un loc vizibil și accesibil tuturor lucrătorilor.',
    difficulty: 'easy',
    category: 'introductiv-loc-munca'
  },
  {
    id: 'ilm-007',
    question: 'Ce faci dacă îți schimbi locul de muncă în cadrul aceleiași companii?',
    options: [
      'Nu trebuie să faci nimic',
      'Trebuie să fii instruit pentru noul loc de muncă',
      'Doar semnezi o hârtie',
      'Aștepți un an pentru instruire'
    ],
    correctIndex: 1,
    explanation: 'La schimbarea locului de muncă trebuie efectuată o nouă instruire specifică pentru noile riscuri și condiții.',
    difficulty: 'medium',
    category: 'introductiv-loc-munca'
  },
  {
    id: 'ilm-008',
    question: 'Cum trebuie să fie îmbrăcat un lucrător la locul de muncă?',
    options: [
      'Cum dorește',
      'Elegant',
      'Conform cerințelor specifice postului și riscurilor',
      'Doar cu echipament de marcă'
    ],
    correctIndex: 2,
    explanation: 'Îmbrăcămintea trebuie să fie adecvată postului, să protejeze împotriva riscurilor identificate și să nu creeze pericole suplimentare.',
    difficulty: 'easy',
    category: 'introductiv-loc-munca'
  },
  {
    id: 'ilm-009',
    question: 'Ce trebuie să faci înainte de a utiliza un echipament de lucru pentru prima dată?',
    options: [
      'Să îl pornești direct',
      'Să verifici dacă funcționează și să primești instruire',
      'Să îl testezi singur',
      'Să citești instrucțiunile după'
    ],
    correctIndex: 1,
    explanation: 'Înainte de prima utilizare trebuie să primești instruire specifică și să verifici starea tehnică a echipamentului.',
    difficulty: 'easy',
    category: 'introductiv-loc-munca'
  },
  {
    id: 'ilm-010',
    question: 'Ce înseamnă "consemnare" la un echipament?',
    options: [
      'Notarea într-un registru',
      'Scoaterea din funcțiune și asigurarea că nu poate fi pornit accidental',
      'Deplasarea în altă locație',
      'Înscrierea în inventar'
    ],
    correctIndex: 1,
    explanation: 'Consemnarea înseamnă scoaterea echipamentului din funcțiune și luarea măsurilor pentru a nu putea fi pornit accidental (ex: pentru întreținere).',
    difficulty: 'medium',
    category: 'introductiv-loc-munca'
  },
  {
    id: 'ilm-011',
    question: 'Ce faci dacă observi o defecțiune la un echipament de lucru?',
    options: [
      'Continui lucrul',
      'Încerci să repari singur',
      'Oprești echipamentul, semnalizezi și anunți',
      'Schimbi echipamentul cu unul de la un coleg'
    ],
    correctIndex: 2,
    explanation: 'Trebuie să oprești imediat echipamentul defect, să îl semnalizezi pentru a nu fi folosit și să anunți șeful direct sau responsabilul SSM.',
    difficulty: 'easy',
    category: 'introductiv-loc-munca'
  },
  {
    id: 'ilm-012',
    question: 'Care este ordinea corectă de acțiune în caz de urgență la locul de muncă?',
    options: [
      'Fugi, salvează, anunță',
      'Protejează-te, salvează, alertează',
      'Alertează, protejează-te, salvează',
      'Salvează, protejează-te, alertează'
    ],
    correctIndex: 1,
    explanation: 'Ordinea corectă: 1. Protejează-te pe tine (oprește sursa de pericol dacă poți), 2. Salvează victimele, 3. Alertează serviciile de urgență.',
    difficulty: 'medium',
    category: 'introductiv-loc-munca'
  },
  {
    id: 'ilm-013',
    question: 'Unde trebuie să fie localizată trusă de prim ajutor?',
    options: [
      'În biroul directorului',
      'Într-un loc cunoscut, accesibil și semnalizat',
      'În mașina directorului',
      'La poartă'
    ],
    correctIndex: 1,
    explanation: 'Trusa de prim ajutor trebuie plasată într-un loc cunoscut de toți, ușor accesibil și marcat cu indicatorul corespunzător (cruce verde).',
    difficulty: 'easy',
    category: 'introductiv-loc-munca'
  },
  {
    id: 'ilm-014',
    question: 'Ce trebuie să cunoască fiecare angajat despre planul de evacuare?',
    options: [
      'Doar că există',
      'Căile de evacuare, punctul de adunare și procedura de alertare',
      'Doar ieșirea principală',
      'Nu e necesar să știe nimic'
    ],
    correctIndex: 1,
    explanation: 'Fiecare angajat trebuie să cunoască căile de evacuare, punctul de adunare exterior și modul de alertare în caz de urgență.',
    difficulty: 'easy',
    category: 'introductiv-loc-munca'
  },
  {
    id: 'ilm-015',
    question: 'Când trebuie refăcută instruirea la locul de muncă?',
    options: [
      'Niciodată',
      'La modificarea procesului tehnologic sau apariția de noi riscuri',
      'Doar la dorința angajatului',
      'La 10 ani'
    ],
    correctIndex: 1,
    explanation: 'Instruirea la locul de muncă se reia la modificarea semnificativă a procesului tehnologic, echipamentelor sau la apariția de noi riscuri.',
    difficulty: 'medium',
    category: 'introductiv-loc-munca'
  },
  {
    id: 'ilm-016',
    question: 'Ce semnificație are un avertizor sonor continuu la locul tău de muncă?',
    options: [
      'Pauză de masă',
      'Începutul programului',
      'De regulă, semnal de evacuare sau alarmă',
      'Sfârșitul programului'
    ],
    correctIndex: 2,
    explanation: 'Semnalele sonore continue sau intermitente specific stabilite semnalează, de regulă, situații de urgență sau necesitatea evacuării.',
    difficulty: 'easy',
    category: 'introductiv-loc-munca'
  },
  {
    id: 'ilm-017',
    question: 'Cum trebuie păstrate materialele și uneltele la locul de muncă?',
    options: [
      'Oricum, dacă ai acces la ele',
      'Organizat, fără a crea obstacole sau pericole',
      'Pe podea pentru acces rapid',
      'În cutii înalte'
    ],
    correctIndex: 1,
    explanation: 'Materialele și uneltele trebuie păstrate organizat, în locuri stabilite, fără a obstrua căile de circulație sau a crea pericole.',
    difficulty: 'easy',
    category: 'introductiv-loc-munca'
  },
  {
    id: 'ilm-018',
    question: 'Ce trebuie să verifici zilnic înainte de a începe lucrul?',
    options: [
      'Nimic special',
      'Doar dacă ai echipamentul de protecție',
      'Starea locului de muncă, echipamentelor și a EIP',
      'Doar emailurile'
    ],
    correctIndex: 2,
    explanation: 'Înainte de începerea lucrului trebuie verificată starea locului de muncă, funcționarea echipamentelor și integritatea echipamentului de protecție.',
    difficulty: 'medium',
    category: 'introductiv-loc-munca'
  },
  {
    id: 'ilm-019',
    question: 'Ce faci dacă ți se cere să efectuezi o sarcină pentru care nu ai fost instruit?',
    options: [
      'Înveți pe parcurs',
      'Întrebi un coleg și o faci',
      'Refuzi politicos și ceri instruire prealabilă',
      'Improvizezi'
    ],
    correctIndex: 2,
    explanation: 'Ai dreptul și obligația de a refuza orice sarcină pentru care nu ai fost instruit corespunzător, cerând instruire prealabilă.',
    difficulty: 'easy',
    category: 'introductiv-loc-munca'
  },
  {
    id: 'ilm-020',
    question: 'Care este regula de bază pentru lucrul în siguranță?',
    options: [
      'Să lucrezi cât mai repede',
      'Să cunoști riscurile, să respecți procedurile și să folosești protecția',
      'Să eviți șeful',
      'Să faci ce știi tu'
    ],
    correctIndex: 1,
    explanation: 'Lucrul în siguranță presupune cunoașterea riscurilor, respectarea procedurilor stabilite și utilizarea corectă a echipamentului de protecție.',
    difficulty: 'easy',
    category: 'introductiv-loc-munca'
  }
];

// ============================================================================
// PERIODIC (20 întrebări)
// ============================================================================

const periodicQuestions: QuizQuestion[] = [
  {
    id: 'per-001',
    question: 'Care este scopul principal al instruirii periodice?',
    options: [
      'Actualizarea și consolidarea cunoștințelor de SSM',
      'Verificarea prezenței angajaților',
      'Îndeplinirea unei formalități',
      'Completarea dosarelor'
    ],
    correctIndex: 0,
    explanation: 'Instruirea periodică servește la actualizarea cunoștințelor, consolidarea comportamentului sigur și informarea despre modificări legislative sau tehnologice.',
    difficulty: 'easy',
    category: 'periodic'
  },
  {
    id: 'per-002',
    question: 'Care sunt principalele cauze ale accidentelor de muncă?',
    options: [
      'Doar factorul uman',
      'Doar echipamentele defecte',
      'Factorul uman, tehnic și organizatoric combinat',
      'Doar nerespectarea procedurilor'
    ],
    correctIndex: 2,
    explanation: 'Accidentele de muncă au cauze multiple: factorul uman (erori, oboseală), factorul tehnic (defecțiuni) și factorul organizatoric (proceduri inadecvate).',
    difficulty: 'medium',
    category: 'periodic'
  },
  {
    id: 'per-003',
    question: 'Ce modificări legislative SSM importante au apărut recent?',
    options: [
      'Nu există modificări',
      'Trebuie verificate periodic - se actualizează normele și procedurile',
      'Doar mărirea amenzilor',
      'Doar proceduri de raportare'
    ],
    correctIndex: 1,
    explanation: 'Legislația SSM se actualizează periodic (ex: noi HG, ordine, norme tehnice), iar angajații trebuie informați despre aceste modificări.',
    difficulty: 'medium',
    category: 'periodic'
  },
  {
    id: 'per-004',
    question: 'Care este frecvența recomandată pentru verificarea stării EIP?',
    options: [
      'Lunar',
      'Înainte de fiecare utilizare',
      'Anual',
      'Când pare necesar'
    ],
    correctIndex: 1,
    explanation: 'Echipamentul individual de protecție trebuie verificat înainte de fiecare utilizare pentru a identifica deteriorări sau uzuri.',
    difficulty: 'easy',
    category: 'periodic'
  },
  {
    id: 'per-005',
    question: 'Ce este un "aproape accident" (near miss)?',
    options: [
      'Un incident fără importanță',
      'Eveniment care putea deveni accident dar nu a avut consecințe',
      'Un accident minor',
      'O simplă greșeală'
    ],
    correctIndex: 1,
    explanation: 'Un "aproape accident" este un eveniment neplanificat care nu a produs vătămări sau daune, dar avea potențialul să o facă. Raportarea lor previne accidente.',
    difficulty: 'medium',
    category: 'periodic'
  },
  {
    id: 'per-006',
    question: 'De ce este important raportarea "aproape accidentelor"?',
    options: [
      'Pentru statistici',
      'Pentru identificarea și eliminarea cauzelor înainte să producă accidente reale',
      'Nu este important',
      'Pentru sancționarea vinovaților'
    ],
    correctIndex: 1,
    explanation: 'Raportarea "aproape accidentelor" permite identificarea deficiențelor și remedierea lor proactivă, înainte de a produce accidente reale.',
    difficulty: 'medium',
    category: 'periodic'
  },
  {
    id: 'per-007',
    question: 'Care sunt factorii de risc psihosociali la locul de muncă?',
    options: [
      'Doar zgomotul',
      'Stres, presiune temporală, hărțuire, monotonie',
      'Doar temperatura',
      'Doar iluminatul'
    ],
    correctIndex: 1,
    explanation: 'Factorii psihosociali includ stresul, presiunea timpului, conflictele, hărțuirea, monotonia - toți pot afecta sănătatea mentală și fizică.',
    difficulty: 'medium',
    category: 'periodic'
  },
  {
    id: 'per-008',
    question: 'Ce este burnout-ul profesional?',
    options: [
      'Oboseala normală',
      'Epuizare fizică și emoțională cauzată de stres prelungit',
      'Lipsa de motivație temporară',
      'O simplă pauză necesară'
    ],
    correctIndex: 1,
    explanation: 'Burnout-ul este starea de epuizare fizică, emoțională și mentală cauzată de expunerea prelungită la stres profesional intens.',
    difficulty: 'medium',
    category: 'periodic'
  },
  {
    id: 'per-009',
    question: 'Care sunt semnele unui mediu de lucru cu risc ergonomic crescut?',
    options: [
      'Birou mare',
      'Posturi forțate, mișcări repetitive, efort fizic susținut',
      'Mulți colegi',
      'Program flexibil'
    ],
    correctIndex: 1,
    explanation: 'Riscurile ergonomice includ posturi forțate prelungite, mișcări repetitive, manipulare manuală frecventă, șezut prelungit.',
    difficulty: 'easy',
    category: 'periodic'
  },
  {
    id: 'per-010',
    question: 'Ce schimbări la locul de muncă necesită actualizarea evaluării de risc?',
    options: [
      'Doar schimbarea directorului',
      'Noi echipamente, procese, materiale sau reorganizări',
      'Doar mutarea biroului',
      'Schimbări minore fără importanță'
    ],
    correctIndex: 1,
    explanation: 'Evaluarea de risc trebuie actualizată la introducerea de noi echipamente, procese tehnologice, materiale sau la reorganizări semnificative.',
    difficulty: 'medium',
    category: 'periodic'
  },
  {
    id: 'per-011',
    question: 'Care este durata maximă recomandată de lucru continuu la calculator?',
    options: [
      '4 ore',
      '2 ore cu pauză de 10-15 minute',
      '8 ore fără pauză',
      '30 minute'
    ],
    correctIndex: 1,
    explanation: 'Pentru lucrul la calculator se recomandă pauze de 10-15 minute la fiecare 2 ore de lucru continuu, pentru protecția vederii și a sistemului muscular.',
    difficulty: 'medium',
    category: 'periodic'
  },
  {
    id: 'per-012',
    question: 'Ce înseamnă "cultura securității" într-o organizație?',
    options: [
      'Existența unui responsabil SSM',
      'Valori, atitudini și comportamente care prioritizează securitatea',
      'Afișarea panourilor',
      'Organizarea instruirilor'
    ],
    correctIndex: 1,
    explanation: 'Cultura securității reprezintă ansamblul de valori, atitudini, percepții și comportamente care fac din securitate o prioritate pentru toți.',
    difficulty: 'medium',
    category: 'periodic'
  },
  {
    id: 'per-013',
    question: 'Ce rol ai tu în menținerea unui mediu de lucru sigur?',
    options: [
      'Niciun rol, e treaba șefului',
      'Rol activ - respectând reguli, raportând pericole, sugerând îmbunătățiri',
      'Doar să nu fac accidente',
      'Să critic colegii'
    ],
    correctIndex: 1,
    explanation: 'Fiecare angajat are rol activ: să respecte regulile, să raporteze pericolele, să folosească corect echipamentele și să sugereze îmbunătățiri.',
    difficulty: 'easy',
    category: 'periodic'
  },
  {
    id: 'per-014',
    question: 'Care sunt principiile generale de prevenire conform legislației?',
    options: [
      'Doar evitarea riscurilor',
      'Evitare, evaluare, combatere la sursă, adaptare la progres',
      'Doar echipament de protecție',
      'Doar instruire'
    ],
    correctIndex: 1,
    explanation: 'Principiile generale: evitarea riscurilor, evaluarea celor inevitabile, combaterea la sursă, adaptarea la progres tehnic, prioritate măsurilor colective.',
    difficulty: 'hard',
    category: 'periodic'
  },
  {
    id: 'per-015',
    question: 'Ce înseamnă ierarhia măsurilor de protecție?',
    options: [
      'Protecția șefilor înainte de subordonați',
      'Eliminare > Măsuri tehnice > Măsuri organizatorice > EIP',
      'Echipament scump înainte de echipament ieftin',
      'Nu există ierarhie'
    ],
    correctIndex: 1,
    explanation: 'Ierarhia protecției: 1.Eliminarea pericolului, 2.Măsuri tehnice colective, 3.Măsuri organizatorice, 4.Echipament individual (ultima opțiune).',
    difficulty: 'hard',
    category: 'periodic'
  },
  {
    id: 'per-016',
    question: 'Ce este "controlul operațional" în SSM?',
    options: [
      'Controlul producției',
      'Verificarea zilnică că procedurile de siguranță sunt aplicate',
      'Controlul pontajului',
      'Controlul calității'
    ],
    correctIndex: 1,
    explanation: 'Controlul operațional înseamnă verificarea zilnică și sistematică că măsurile și procedurile de siguranță sunt aplicate efectiv.',
    difficulty: 'medium',
    category: 'periodic'
  },
  {
    id: 'per-017',
    question: 'Ce factori pot crește riscul de accidente?',
    options: [
      'Doar lipsa de experiență',
      'Oboseală, stres, rutină, presiune timp, neglijență',
      'Doar mediul fizic',
      'Doar echipamentul vechi'
    ],
    correctIndex: 1,
    explanation: 'Factorii care cresc riscul: oboseala, stresul, rutina (automatie), presiunea timpului, neglijența, lipsa de comunicare.',
    difficulty: 'easy',
    category: 'periodic'
  },
  {
    id: 'per-018',
    question: 'Cum contribui la îmbunătățirea continuă a SSM?',
    options: [
      'Nu e treaba mea',
      'Prin raportarea riscurilor, sugestii, participare la analize',
      'Doar prin respectarea regulilor',
      'Prin criticarea sistemului'
    ],
    correctIndex: 1,
    explanation: 'Îmbunătățirea continuă se realizează prin raportarea proactivă a riscurilor, sugestii de îmbunătățire și participare la analize post-incident.',
    difficulty: 'medium',
    category: 'periodic'
  },
  {
    id: 'per-019',
    question: 'Ce reprezintă un "indicator proactiv" în SSM?',
    options: [
      'Numărul de accidente',
      'Măsurători înainte de accidente: rapoarte near-miss, audit completări',
      'Numărul de zile fără accident',
      'Amenzile primite'
    ],
    correctIndex: 1,
    explanation: 'Indicatorii proactivi măsoară acțiunile de prevenire (ex: rapoarte near-miss, audituri efectuate, instruiri completate) înainte de apariția accidentelor.',
    difficulty: 'hard',
    category: 'periodic'
  },
  {
    id: 'per-020',
    question: 'De ce este importantă comunicarea în SSM?',
    options: [
      'Pentru birocratizare',
      'Pentru informarea rapidă despre pericole și schimb de bune practici',
      'Pentru crearea de documente',
      'Nu este importantă'
    ],
    correctIndex: 1,
    explanation: 'Comunicarea eficientă în SSM asigură informarea rapidă despre pericole, schimbul de bune practici și alinierea echipei la aceleași standarde de siguranță.',
    difficulty: 'easy',
    category: 'periodic'
  }
];

// ============================================================================
// PSI (20 întrebări)
// ============================================================================

const psiQuestions: QuizQuestion[] = [
  {
    id: 'psi-001',
    question: 'Ce înseamnă PSI?',
    options: [
      'Prevenirea și Stingerea Incendiilor',
      'Protecție și Siguranță Industrială',
      'Primul Serviciu de Intervenție',
      'Protecție Specială Internă'
    ],
    correctIndex: 0,
    explanation: 'PSI înseamnă Prevenirea și Stingerea Incendiilor - ansamblul de măsuri pentru prevenirea și combaterea incendiilor.',
    difficulty: 'easy',
    category: 'PSI'
  },
  {
    id: 'psi-002',
    question: 'Care sunt cele trei elemente necesare pentru producerea unui incendiu (triunghiul focului)?',
    options: [
      'Apă, aer, foc',
      'Combustibil, comburant (oxigen), sursă de aprindere',
      'Căldură, fum, flacără',
      'Lemn, hârtie, țigări'
    ],
    correctIndex: 1,
    explanation: 'Triunghiul focului: combustibil (material care arde), comburant (oxigen din aer), sursă de aprindere (căldură, scânteie). Eliminarea unuia oprește focul.',
    difficulty: 'easy',
    category: 'PSI'
  },
  {
    id: 'psi-003',
    question: 'Care sunt clasele principale de incendii?',
    options: [
      'Mici, medii, mari',
      'A (solide), B (lichide), C (gaze), D (metale), F (grăsimi)',
      'Roșii, galbene, albastre',
      'Interioare și exterioare'
    ],
    correctIndex: 1,
    explanation: 'Clasele de incendii: A-materiale solide, B-lichide inflamabile, C-gaze, D-metale, E-echipamente electrice, F-uleiuri/grăsimi alimentare.',
    difficulty: 'medium',
    category: 'PSI'
  },
  {
    id: 'psi-004',
    question: 'Ce tip de stingător folosești pentru un incendiu la tabloul electric?',
    options: [
      'Cu apă',
      'Cu spumă',
      'Cu pulbere/CO2 (dioxid de carbon)',
      'Cu orice tip'
    ],
    correctIndex: 2,
    explanation: 'Pentru incendii la instalații electrice sub tensiune se folosesc stingătoare cu pulbere sau CO2, care nu conduc electricitatea. NU SE FOLOSEȘTE APĂ!',
    difficulty: 'medium',
    category: 'PSI'
  },
  {
    id: 'psi-005',
    question: 'Cum folosești corect un stingător?',
    options: [
      'Îl arunci în foc',
      'Scoți agrafă, îndrepți furtunul spre baza focului, apeși pârghia',
      'Îl agită și îl deschizi',
      'Îl întorci și îl scuturi'
    ],
    correctIndex: 1,
    explanation: 'Tehnica corectă: 1.Scoți agrafă de siguranță, 2.Îndrepți furtunul spre BAZA flăcării, 3.Apeși pârghia, 4.Mișcări în evantai.',
    difficulty: 'easy',
    category: 'PSI'
  },
  {
    id: 'psi-006',
    question: 'La ce distanță de incendiu trebuie să te poziționezi când folosești stingătorul?',
    options: [
      '1 metru',
      '2-3 metri',
      '5-6 metri',
      '10 metri'
    ],
    correctIndex: 1,
    explanation: 'Distanța optimă este 2-3 metri de focar, pentru a fi eficient dar în siguranță. Te deplasezi gradual spre focar pe măsură ce focul scade.',
    difficulty: 'medium',
    category: 'PSI'
  },
  {
    id: 'psi-007',
    question: 'Ce NU trebuie să faci niciodată în caz de incendiu?',
    options: [
      'Să folosești liftul',
      'Să iei hainele',
      'Să alergi',
      'Să urli'
    ],
    correctIndex: 0,
    explanation: 'NU FOLOSI LIFTUL în caz de incendiu! Poate rămâne blocat sau duce în zona cu foc/fum. Folosește doar scările de evacuare.',
    difficulty: 'easy',
    category: 'PSI'
  },
  {
    id: 'psi-008',
    question: 'Ce trebuie să faci dacă îți iau foc hainele?',
    options: [
      'Alergi să cauți ajutor',
      'Stop-Drop-Roll: oprește-te, culcă-te, rostogolește-te',
      'Sari pe fereastră',
      'Încerci să le scoți'
    ],
    correctIndex: 1,
    explanation: 'Tehnica STOP-DROP-ROLL: Oprește-te (nu alerga), culcă-te la pământ, rostogolește-te pentru a sufoca flăcările.',
    difficulty: 'easy',
    category: 'PSI'
  },
  {
    id: 'psi-009',
    question: 'Cum recunoști o ieșire de urgență?',
    options: [
      'Este cea mai mare ușă',
      'Panou verde cu alb cu figură care aleargă și săgeată',
      'Panou roșu',
      'Are lumină puternică'
    ],
    correctIndex: 1,
    explanation: 'Ieșirile de urgență sunt marcate cu panouri verzi cu figură albă în mișcare și săgeată indicând direcția.',
    difficulty: 'easy',
    category: 'PSI'
  },
  {
    id: 'psi-010',
    question: 'Ce faci dacă fumul este dens și coboară?',
    options: [
      'Te ridici în picioare',
      'Te deplasezi aplecat/târându-te, aerul curat e jos',
      'Deschizi ferestrele',
      'Aștepți să se ridice'
    ],
    correctIndex: 1,
    explanation: 'Fumul și gazele fierbinți urcă. Aerul mai curat este la nivelul podelei. Deplasează-te aplecat sau târându-te.',
    difficulty: 'easy',
    category: 'PSI'
  },
  {
    id: 'psi-011',
    question: 'La ce interval trebuie verificat stingătorul?',
    options: [
      'Lunar - verificare vizuală, anual - revizie tehnică',
      'Doar când expiră',
      'La 5 ani',
      'Nu trebuie verificat'
    ],
    correctIndex: 0,
    explanation: 'Stingătoarele necesită verificare vizuală lunară (presiune, sigilii) și revizie tehnică anuală efectuată de personal autorizat.',
    difficulty: 'medium',
    category: 'PSI'
  },
  {
    id: 'psi-012',
    question: 'Care este numărul de urgență pentru pompieri în România?',
    options: [
      '112',
      '911',
      '061',
      '0800'
    ],
    correctIndex: 0,
    explanation: '112 este numărul unic european de urgență pentru pompieri, ambulanță, poliție. Funcționează din orice telefon, chiar și fără credit/SIM.',
    difficulty: 'easy',
    category: 'PSI'
  },
  {
    id: 'psi-013',
    question: 'Unde trebuie poziționat un stingător în clădire?',
    options: [
      'Ascuns în dulap',
      'Vizibil, accesibil, pe trasee de evacuare, marcat',
      'În biroul directorului',
      'În pod'
    ],
    correctIndex: 1,
    explanation: 'Stingătoarele trebuie poziționate vizibil, pe trasee de evacuare, la înălțime accesibilă (max 1,5m), marcate cu indicator.',
    difficulty: 'easy',
    category: 'PSI'
  },
  {
    id: 'psi-014',
    question: 'Ce informații trebuie comunicate când suni la 112 pentru incendiu?',
    options: [
      'Doar numele tău',
      'Ce s-a întâmplat, adresă exactă, victime?, persoana ta contact',
      'Doar adresa',
      'Doar că e foc'
    ],
    correctIndex: 1,
    explanation: 'Comunică: ce s-a întâmplat, adresa exactă (stradă, număr, etaj), dacă sunt victime, datele tale de contact. Rămâi la telefon până ți se confirmă.',
    difficulty: 'medium',
    category: 'PSI'
  },
  {
    id: 'psi-015',
    question: 'Ce reprezintă un "punct de adunare" în planul de evacuare?',
    options: [
      'Locul unde fumăm',
      'Loc sigur exterior unde se adună toți după evacuare',
      'Sala de conferințe',
      'Parcare'
    ],
    correctIndex: 1,
    explanation: 'Punctul de adunare este locația sigură în exterior unde se adună și se numără toți angajații după evacuare pentru a verifica prezența tuturor.',
    difficulty: 'easy',
    category: 'PSI'
  },
  {
    id: 'psi-016',
    question: 'De ce NU folosești apă la un incendiu de lichide inflamabile (benzină, ulei)?',
    options: [
      'Apa e scumpă',
      'Apa răspândește lichidul aprins și agravează incendiul',
      'Nu e suficientă apă',
      'E prea frig'
    ],
    correctIndex: 1,
    explanation: 'Apa este mai grea decât lichidele inflamabile, le face să plutească și să se răspândească, extinzând incendiul. Se folosește spumă sau pulbere.',
    difficulty: 'medium',
    category: 'PSI'
  },
  {
    id: 'psi-017',
    question: 'Când trebuie evacuată o clădire?',
    options: [
      'Doar când vezi flăcări',
      'La semnalul de alarmă sau la ordin, chiar dacă nu vezi pericol evident',
      'Când îți convine',
      'După ce îți salvezi lucrurile'
    ],
    correctIndex: 1,
    explanation: 'Evacuarea se face imediat la semnalul de alarmă sau la ordin, fără întârziere. Nu aștepta să vezi pericolul - poate fi fum/gaz invizibil.',
    difficulty: 'easy',
    category: 'PSI'
  },
  {
    id: 'psi-018',
    question: 'Ce cauze comune produc incendii la locul de muncă?',
    options: [
      'Doar trăsnetul',
      'Instalații electrice defecte, țigări, supraîncălziri, neglijență',
      'Doar scurtcircuite',
      'Doar materiale inflamabile'
    ],
    correctIndex: 1,
    explanation: 'Cauze frecvente: instalații electrice defecte/supraîncărcate, țigări, supraîncălzirea echipamentelor, depozitare necorespunzătoare materiale inflamabile.',
    difficulty: 'medium',
    category: 'PSI'
  },
  {
    id: 'psi-019',
    question: 'Este permis fumatul în spațiile de producție?',
    options: [
      'Da, oriunde',
      'NU, doar în spații special desemnate',
      'Da, dacă ești atent',
      'Da, cu permisiunea șefului'
    ],
    correctIndex: 1,
    explanation: 'Fumatul este strict interzis în spațiile de producție, depozite, zone cu materiale inflamabile. Este permis DOAR în spații special desemnate și marcate.',
    difficulty: 'easy',
    category: 'PSI'
  },
  {
    id: 'psi-020',
    question: 'Ce faci dacă găsești un stingător cu acul în zona roșie (lipsă presiune)?',
    options: [
      'Îl lași acolo',
      'Îl folosești oricum',
      'Raportezi imediat pentru înlocuire/reîncărcare',
      'Încerci să îl repari'
    ],
    correctIndex: 2,
    explanation: 'Un stingător fără presiune (ac în zona roșie) este neoperațional. Trebuie raportat imediat pentru reîncărcare/înlocuire și semnalizat ca inoperabil.',
    difficulty: 'easy',
    category: 'PSI'
  }
];

// ============================================================================
// PRIM-AJUTOR (20 întrebări)
// ============================================================================

const primAjutorQuestions: QuizQuestion[] = [
  {
    id: 'pa-001',
    question: 'Care sunt pașii corect pentru acordarea primului ajutor?',
    options: [
      'Repede, orice, imediat',
      'Protejează, Alertează, Acordă ajutor (P-A-A)',
      'Sună, așteaptă, pleacă',
      'Mută victima, apoi gândește'
    ],
    correctIndex: 1,
    explanation: 'Protocol corect: 1.PROTEJEAZĂ scena (tine și victima), 2.ALERTEAZĂ serviciile de urgență (112), 3.ACORDĂ prim ajutor.',
    difficulty: 'easy',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-002',
    question: 'Cum verifici starea de conștiență a unei persoane?',
    options: [
      'O lovești',
      'O scuturi puternic',
      'O întrebi tare "Ești bine?" și atingi ușor umerii',
      'Arunci apă pe ea'
    ],
    correctIndex: 2,
    explanation: 'Verifici conștiența întrebând tare "Îmi auziți?, Sunteți bine?" și atingând ușor umerii. NU scutura violent capul/corpul.',
    difficulty: 'easy',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-003',
    question: 'Ce faci dacă o persoană nu respiră și nu are puls?',
    options: [
      'Aștepți ambulanța',
      'Începi imediat RCP (resuscitare cardiopulmonară)',
      'O muți în altă cameră',
      'Îi dai apă'
    ],
    correctIndex: 1,
    explanation: 'Absența respirației și pulsului = STOP CARDIAC. Începi imediat RCP: 30 compresii toracice + 2 respirații, continuu până vine ambulanța.',
    difficulty: 'medium',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-004',
    question: 'Unde plasezi mâinile pentru compresiile toracice (RCP)?',
    options: [
      'Pe stomac',
      'Centrul pieptului, între sâni, pe stern',
      'Pe gât',
      'Sub coaste'
    ],
    correctIndex: 1,
    explanation: 'Compresiile se fac în centrul pieptului, pe jumătatea inferioară a sternului, între sâni, cu brațele întinse și umerii deasupra.',
    difficulty: 'medium',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-005',
    question: 'Cât de adânci trebuie să fie compresiile toracice la un adult?',
    options: [
      '1-2 cm',
      '3-4 cm',
      '5-6 cm',
      '10 cm'
    ],
    correctIndex: 2,
    explanation: 'La adulți, compresiile trebuie să fie 5-6 cm adâncime, ritm 100-120/minut, lăsând pieptul să revină complet între compresii.',
    difficulty: 'hard',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-006',
    question: 'Ce este poziția laterală de siguranță (PLS)?',
    options: [
      'Victima pe spate',
      'Victima pe burtă',
      'Victima pe o parte, cap înclinat, pentru a preveni înecul cu vărsături',
      'Victima șezând'
    ],
    correctIndex: 2,
    explanation: 'PLS: victima pe o parte, capul ușor înclinat înapoi, gura în jos, pentru a preveni înecul cu limbă, salivă sau vărsături. Doar dacă respiră!',
    difficulty: 'medium',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-007',
    question: 'Când pui o victimă în poziția laterală de siguranță?',
    options: [
      'Întotdeauna',
      'Când respiră dar este inconștientă',
      'Când nu respiră',
      'Când are fractură'
    ],
    correctIndex: 1,
    explanation: 'PLS se folosește DOAR când victima respiră dar este inconștientă, pentru a menține căile respiratorii libere. Nu la stop cardiac sau suspiciune de leziune spinală.',
    difficulty: 'medium',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-008',
    question: 'Cum oprești o hemoragie externă severă?',
    options: [
      'Pansament',
      'Presiune directă fermă pe rană cu material curat',
      'Dezinfectant',
      'Aștepți să se oprească singură'
    ],
    correctIndex: 1,
    explanation: 'Hemoragie severă: presiune directă FERMĂ pe rană cu material curat (compresă, cearceaf), menține presiunea, ridică membrul dacă e posibil.',
    difficulty: 'easy',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-009',
    question: 'Ce faci în caz de arsură termică (căldură, foc)?',
    options: [
      'Aplici gheață direct',
      'Pui untură sau pastă de dinți',
      'Răcești imediat cu apă curentă rece 10-20 minute',
      'Sparge veziculele'
    ],
    correctIndex: 2,
    explanation: 'Arsură termică: 1.Răcește 10-20 min cu apă curentă rece (nu gheață!), 2.Acopere cu material curat, 3.NU sparge vezicule, NU pune untură/pastă.',
    difficulty: 'easy',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-010',
    question: 'Cum recunoști un stop cardiac?',
    options: [
      'Victima plânge',
      'Victima nu răspunde, nu respiră normal, nu are puls',
      'Victima tușește',
      'Victima vorbește încet'
    ],
    correctIndex: 1,
    explanation: 'Semne stop cardiac: victima nu răspunde la stimuli, nu respiră sau respirație anormală (gâfâit), absența pulsului carotidian.',
    difficulty: 'medium',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-011',
    question: 'Ce faci dacă o persoană se înecă (înghițire corp străin, nu poate respira)?',
    options: [
      'O lovești în spate',
      'Manevra Heimlich: compresia abdominală rapidă',
      'Îi dai apă',
      'O lași să tuște'
    ],
    correctIndex: 1,
    explanation: 'Înec complet (nu poate respira/vorbi): Manevra Heimlich - compresia abdominală rapidă în sus, sub rebord, până elimină obiectul. La sugari: lovituri în spate.',
    difficulty: 'medium',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-012',
    question: 'Ce NU faci în caz de suspiciune de fractură la membru?',
    options: [
      'Imobilizezi',
      'Miști/redrezi membrul fracturat',
      'Chemi ambulanța',
      'Aplici gheață (prin material)'
    ],
    correctIndex: 1,
    explanation: 'NU mișca, NU încerca să redrezi fractura! Imobilizează în poziția găsită, susține membrul, aplică gheață indirect, cheamă 112.',
    difficulty: 'easy',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-013',
    question: 'Ce conține o trusă de prim ajutor standard?',
    options: [
      'Doar plasturi',
      'Comprese, bandaje, plasturi, mănuși, foarfecă, pansamente sterile',
      'Medicamente diverse',
      'Doar un telefon'
    ],
    correctIndex: 1,
    explanation: 'Trusa standard: comprese sterile, bandaje, plasturi diverse, mănuși unica folosință, foarfecă, pansamente, triunghi material, manual prim ajutor.',
    difficulty: 'easy',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-014',
    question: 'Cum tratezi un șoc (colaps circulatoriu)?',
    options: [
      'Ridici victima în picioare',
      'Culci victima, ridici picioarele, menții căldura',
      'Dai apă rece',
      'Scuturi victima'
    ],
    correctIndex: 1,
    explanation: 'Șoc: culcă victima pe spate, ridică picioarele (dacă nu e fractură), menține temperatura corporală (învelește), liniștește, cheamă 112.',
    difficulty: 'medium',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-015',
    question: 'Ce faci în caz de electrocutare?',
    options: [
      'Atingi victima imediat',
      'ÎNTÂI întrerupe sursa electrică, apoi acordă ajutor',
      'Arunci apă',
      'Tragi de haine'
    ],
    correctIndex: 1,
    explanation: 'Electrocutare: 1.ÎNTRERUPE sursa (siguranțe, fișă) sau îndepărtează victima cu obiect IZOLATOR uscat, 2.Apoi verifici respirația/RCP, 3.112.',
    difficulty: 'easy',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-016',
    question: 'Când oprești RCP (resuscitarea)?',
    options: [
      'După 2 minute',
      'Când: ajung paramedicii, victima își revine, sau ești epuizat complet',
      'După 10 compresii',
      'Când îți convine'
    ],
    correctIndex: 1,
    explanation: 'Oprești RCP doar când: sosesc serviciile medicale și preiau, victima își recapătă respirația/conștiența, sau ești fizic incapabil să continui.',
    difficulty: 'medium',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-017',
    question: 'Ce este un DEA (AED)?',
    options: [
      'Departament de Urgență',
      'Defibrilator Extern Automat - dispozitiv care șochează inima',
      'Ambulanță aeriană',
      'Departament de Ambulanță'
    ],
    correctIndex: 1,
    explanation: 'DEA/AED = Defibrilator Extern Automat. Dispozitiv care analizează ritmul cardiac și administrează șoc electric pentru a reporni inima. Instrucțiuni vocale.',
    difficulty: 'medium',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-018',
    question: 'Cum recunoști semnele unui accident vascular cerebral (AVC/stroke)?',
    options: [
      'Durere de cap ușoară',
      'Asimetrie facială, slăbiciune braț, vorbire neclară (F.A.S.T.)',
      'Oboseală',
      'Tuse'
    ],
    correctIndex: 1,
    explanation: 'Semne AVC (F.A.S.T.): Face-față asimetrică, Arms-un braț cade, Speech-vorbire neclară/confuză, Time-URGENT 112! Fiecare minut contează.',
    difficulty: 'hard',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-019',
    question: 'Ce faci dacă victima varsă sau sângerează din gură în timp ce e inconștientă?',
    options: [
      'O lași pe spate',
      'Poziție laterală de siguranță pentru drenaj',
      'Închizi gura',
      'Îi dai apă'
    ],
    correctIndex: 1,
    explanation: 'Dacă victima inconștientă dar care respiră varsă/sângerează oral, pune-o imediat în poziția laterală de siguranță pentru drenaj și prevenirea înecului.',
    difficulty: 'medium',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-020',
    question: 'De ce sunt importante mănușile de protecție când acorzi prim ajutor?',
    options: [
      'Pentru curățenie',
      'Protecție împotriva infecțiilor transmisibile prin sânge',
      'Pentru eleganță',
      'Nu sunt importante'
    ],
    correctIndex: 1,
    explanation: 'Mănușile protejează pe salvator și victimă de infecții transmisibile prin sânge (HIV, hepatite). Folosește întotdeauna mănuși când există risc de contact cu sânge/fluide.',
    difficulty: 'easy',
    category: 'prim-ajutor'
  }
];

// ============================================================================
// ALL QUESTIONS COMBINED
// ============================================================================

const allQuestions: QuizQuestion[] = [
  ...introductivGeneralQuestions,
  ...introductivLocMuncaQuestions,
  ...periodicQuestions,
  ...psiQuestions,
  ...primAjutorQuestions
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Randomly shuffle an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random quiz questions for a specific category
 * @param category - The training category
 * @param count - Number of questions to return (default: 10)
 * @returns Array of randomly selected questions
 */
export function getQuizQuestions(
  category: QuizCategory,
  count: number = 10
): QuizQuestion[] {
  const categoryQuestions = allQuestions.filter(q => q.category === category);

  if (categoryQuestions.length === 0) {
    throw new Error(`No questions found for category: ${category}`);
  }

  if (count > categoryQuestions.length) {
    console.warn(
      `Requested ${count} questions but only ${categoryQuestions.length} available for ${category}. Returning all available.`
    );
    return shuffleArray(categoryQuestions);
  }

  return shuffleArray(categoryQuestions).slice(0, count);
}

/**
 * Get all questions for a specific category (for admin/preview)
 */
export function getAllQuestionsForCategory(category: QuizCategory): QuizQuestion[] {
  return allQuestions.filter(q => q.category === category);
}

/**
 * Get question statistics by category
 */
export function getQuestionStats() {
  return {
    'introductiv-general': introductivGeneralQuestions.length,
    'introductiv-loc-munca': introductivLocMuncaQuestions.length,
    'periodic': periodicQuestions.length,
    'PSI': psiQuestions.length,
    'prim-ajutor': primAjutorQuestions.length,
    total: allQuestions.length
  };
}

/**
 * Validate quiz answer
 */
export function validateAnswer(questionId: string, selectedIndex: number): {
  correct: boolean;
  explanation: string;
  correctIndex: number;
} {
  const question = allQuestions.find(q => q.id === questionId);

  if (!question) {
    throw new Error(`Question not found: ${questionId}`);
  }

  return {
    correct: selectedIndex === question.correctIndex,
    explanation: question.explanation,
    correctIndex: question.correctIndex
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  introductivGeneralQuestions,
  introductivLocMuncaQuestions,
  periodicQuestions,
  psiQuestions,
  primAjutorQuestions,
  allQuestions
};
