/**
 * Teste pentru instruirea introductivă generală SSM
 * 30 întrebări cu 4 variante de răspuns
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation: string;
  legalReference: string;
  difficulty: 'usor' | 'mediu';
}

export const testeInstruireIntroductiv: QuizQuestion[] = [
  {
    id: 'intro-001',
    question: 'Ce înseamnă abrevierea SSM?',
    options: [
      'Siguranța și Sănătatea în Muncă',
      'Securitate și Supraveghere Medicală',
      'Sistem de Siguranță Manuală',
      'Serviciu Special de Monitorizare'
    ],
    correctAnswer: 0,
    explanation: 'SSM înseamnă Siguranța și Sănătatea în Muncă și reprezintă ansamblul de activități și măsuri destinate prevenirii accidentelor de muncă și bolilor profesionale.',
    legalReference: 'Legea 319/2006',
    difficulty: 'usor'
  },
  {
    id: 'intro-002',
    question: 'Cine este responsabil pentru asigurarea securității și sănătății lucrătorilor?',
    options: [
      'Fiecare angajat în parte',
      'Angajatorul',
      'Inspectoratul Teritorial de Muncă',
      'Sindicatul'
    ],
    correctAnswer: 1,
    explanation: 'Angajatorul are obligația de a asigura securitatea și sănătatea lucrătorilor în toate aspectele legate de muncă.',
    legalReference: 'Legea 319/2006, art. 6',
    difficulty: 'usor'
  },
  {
    id: 'intro-003',
    question: 'Ce trebuie să faceți dacă observați un pericol iminent la locul de muncă?',
    options: [
      'Să așteptați să vină șeful',
      'Să anunțați imediat superiorul direct sau responsabilul SSM',
      'Să ignorați dacă nu vă afectează direct',
      'Să încercați să rezolvați singur problema'
    ],
    correctAnswer: 1,
    explanation: 'Orice pericol iminent trebuie anunțat imediat pentru a se putea lua măsuri de prevenire a accidentelor.',
    legalReference: 'Legea 319/2006, art. 16',
    difficulty: 'usor'
  },
  {
    id: 'intro-004',
    question: 'Cu ce frecvență se efectuează instruirea periodică pentru lucrătorii din sectorul administrativ?',
    options: [
      'O dată pe lună',
      'O dată pe an',
      'O dată la 2 ani',
      'O dată la 6 luni'
    ],
    correctAnswer: 1,
    explanation: 'Lucrătorii din sectorul administrativ trebuie instruiți periodic, anual, în domeniul securității și sănătății în muncă.',
    legalReference: 'HG 1425/2006, art. 6',
    difficulty: 'mediu'
  },
  {
    id: 'intro-005',
    question: 'Ce este un accident de muncă?',
    options: [
      'Orice vătămare suferită la locul de muncă',
      'Accident produs în timpul pauzei de masă',
      'Vătămare violentă a organismului produsă în timpul procesului de muncă',
      'Boală contractată la locul de muncă'
    ],
    correctAnswer: 2,
    explanation: 'Accidentul de muncă este o vătămare violentă a organismului, precum și intoxicația acută profesională, care au loc în timpul procesului de muncă sau în îndeplinirea îndatoririlor de serviciu.',
    legalReference: 'Legea 346/2002, art. 3',
    difficulty: 'mediu'
  },
  {
    id: 'intro-006',
    question: 'Care este una dintre obligațiile principale ale angajatului în domeniul SSM?',
    options: [
      'Să efectueze evaluarea riscurilor',
      'Să utilizeze corect echipamentele de muncă și de protecție',
      'Să angajeze personal medical de întreprindere',
      'Să întocmească planul de prevenire și protecție'
    ],
    correctAnswer: 1,
    explanation: 'Angajatul are obligația să utilizeze corect instalațiile, mașinile, echipamentele și substanțele periculoase, precum și echipamentele individuale de protecție.',
    legalReference: 'Legea 319/2006, art. 16',
    difficulty: 'usor'
  },
  {
    id: 'intro-007',
    question: 'Ce semnifică un panou de siguranță cu fundal galben și contur negru?',
    options: [
      'Interzicere',
      'Obligativitate',
      'Avertizare/Atenționare',
      'Salvare/Urgență'
    ],
    correctAnswer: 2,
    explanation: 'Panourile de avertizare au formă triunghiulară, fundal galben și contur negru și indică situații periculoase.',
    legalReference: 'HG 971/2006',
    difficulty: 'usor'
  },
  {
    id: 'intro-008',
    question: 'Ce culoare are semnalizarea de salvare și urgență?',
    options: [
      'Roșu',
      'Galben',
      'Verde',
      'Albastru'
    ],
    correctAnswer: 2,
    explanation: 'Panourile de salvare și urgență (ieșiri de urgență, căi de evacuare, echipamente de prim ajutor) au fundal verde cu simboluri albe.',
    legalReference: 'HG 971/2006',
    difficulty: 'usor'
  },
  {
    id: 'intro-009',
    question: 'Ce reprezintă EIP?',
    options: [
      'Echipament Individual de Producție',
      'Echipament Individual de Protecție',
      'Evaluare Internă de Performanță',
      'Examen Individual de Pregătire'
    ],
    correctAnswer: 1,
    explanation: 'EIP înseamnă Echipament Individual de Protecție și include toate echipamentele destinate să fie purtate sau ținute de lucrător pentru a-l proteja de riscuri.',
    legalReference: 'HG 1048/2006',
    difficulty: 'usor'
  },
  {
    id: 'intro-010',
    question: 'Cine suportă costurile pentru echipamentele individuale de protecție?',
    options: [
      'Angajatul, din salariu',
      'Angajatul și angajatorul, în părți egale',
      'Angajatorul, integral',
      'Statul român'
    ],
    correctAnswer: 2,
    explanation: 'Echipamentele individuale de protecție se asigură gratuit de către angajator și nu pot fi suportate în nicio situație de către angajat.',
    legalReference: 'Legea 319/2006, art. 11',
    difficulty: 'mediu'
  },
  {
    id: 'intro-011',
    question: 'Ce trebuie să faceți înainte de a utiliza un echipament de muncă?',
    options: [
      'Să verificați dacă funcționează corect și nu prezintă defecțiuni',
      'Să cereți voie de la șef',
      'Să citiți instrucțiunile complete de utilizare',
      'Să anunțați responsabilul SSM'
    ],
    correctAnswer: 0,
    explanation: 'Înainte de utilizare, orice echipament de muncă trebuie verificat pentru a nu prezenta defecțiuni care ar putea pune în pericol securitatea lucrătorului.',
    legalReference: 'Legea 319/2006, art. 16',
    difficulty: 'usor'
  },
  {
    id: 'intro-012',
    question: 'În caz de incendiu, care este prima acțiune pe care trebuie să o efectuați?',
    options: [
      'Să luați lucrurile personale',
      'Să anunțați pompierii și să evacuați ordonat',
      'Să încercați să stingeți focul singur',
      'Să ascundeți în toaletă'
    ],
    correctAnswer: 1,
    explanation: 'La declanșarea unui incendiu, prioritatea este anunțarea de urgență și evacuarea ordonată a persoanelor pe căile stabilite.',
    legalReference: 'Legea 307/2006',
    difficulty: 'usor'
  },
  {
    id: 'intro-013',
    question: 'Ce trebuie să facă angajatul dacă echipamentul individual de protecție este deteriorat?',
    options: [
      'Să continue să-l folosească',
      'Să-l repare singur',
      'Să anunțe angajatorul și să solicite înlocuirea',
      'Să-l arunce direct'
    ],
    correctAnswer: 2,
    explanation: 'EIP deteriorat nu mai asigură protecția necesară. Angajatul trebuie să anunțe imediat și să solicite înlocuirea cu unul în stare bună de funcționare.',
    legalReference: 'HG 1048/2006',
    difficulty: 'usor'
  },
  {
    id: 'intro-014',
    question: 'Care este durata maximă legală a timpului de muncă pe săptămână?',
    options: [
      '36 de ore',
      '40 de ore',
      '48 de ore',
      '56 de ore'
    ],
    correctAnswer: 2,
    explanation: 'Durata maximă legală a timpului de muncă este de 48 de ore pe săptămână, inclusiv orele suplimentare.',
    legalReference: 'Codul Muncii, art. 114',
    difficulty: 'mediu'
  },
  {
    id: 'intro-015',
    question: 'Ce reprezintă evaluarea riscurilor?',
    options: [
      'Un proces de identificare și evaluare a pericolelor la locul de muncă',
      'O inspecție anuală de la ITM',
      'Un examen medical periodic',
      'O verificare a echipamentelor'
    ],
    correctAnswer: 0,
    explanation: 'Evaluarea riscurilor este procesul de identificare a pericolelor și de evaluare a riscurilor la locul de muncă în vederea stabilirii măsurilor de prevenire și protecție.',
    legalReference: 'HG 1091/2006',
    difficulty: 'mediu'
  },
  {
    id: 'intro-016',
    question: 'Ce este Planul de Prevenire și Protecție (PPP)?',
    options: [
      'Un document întocmit de angajator cu măsurile de SSM',
      'Un plan de evacuare în caz de incendiu',
      'Un program de instruire a angajaților',
      'O planșă cu reguli de siguranță'
    ],
    correctAnswer: 0,
    explanation: 'PPP este documentul prin care angajatorul stabilește măsurile de prevenire și protecție ce trebuie aplicate pentru asigurarea securității și sănătății lucrătorilor.',
    legalReference: 'HG 1425/2006, art. 7',
    difficulty: 'mediu'
  },
  {
    id: 'intro-017',
    question: 'Ce tip de instruire se efectuează la angajare sau la schimbarea locului de muncă?',
    options: [
      'Instruire periodică',
      'Instruire la locul de muncă',
      'Instruire introductiv-generală',
      'Instruire suplimentară'
    ],
    correctAnswer: 2,
    explanation: 'Instruirea introductiv-generală se efectuează la angajare, la schimbarea locului de muncă sau la reluarea activității după o întrerupere mai mare de 6 luni.',
    legalReference: 'HG 1425/2006, art. 6',
    difficulty: 'mediu'
  },
  {
    id: 'intro-018',
    question: 'Ce trebuie să faceți dacă sunteți martor la un accident de muncă?',
    options: [
      'Să plecați de la locul incidentului',
      'Să acordați primul ajutor și să anunțați imediat conducerea',
      'Să așteptați să vină cineva',
      'Să faceți fotografii'
    ],
    correctAnswer: 1,
    explanation: 'În caz de accident, trebuie acordat primul ajutor victimei și anunțată imediat conducerea pentru luarea măsurilor necesare.',
    legalReference: 'Legea 319/2006',
    difficulty: 'usor'
  },
  {
    id: 'intro-019',
    question: 'Este permis să consumați băuturi alcoolice la locul de muncă?',
    options: [
      'Da, în pauze',
      'Da, în cantități mici',
      'Nu, este strict interzis',
      'Da, dacă permite șeful'
    ],
    correctAnswer: 2,
    explanation: 'Consumul de alcool la locul de muncă este strict interzis, reprezentând un risc major pentru securitatea și sănătatea în muncă.',
    legalReference: 'Legea 319/2006, art. 16',
    difficulty: 'usor'
  },
  {
    id: 'intro-020',
    question: 'Ce semnifică un panou circular cu fundal albastru?',
    options: [
      'Interzicere',
      'Avertizare',
      'Obligativitate',
      'Salvare'
    ],
    correctAnswer: 2,
    explanation: 'Panourile de obligativitate au formă rotundă, fundal albastru și simboluri albe, indicând o acțiune obligatorie (ex: port obligatoriu cască).',
    legalReference: 'HG 971/2006',
    difficulty: 'usor'
  },
  {
    id: 'intro-021',
    question: 'Cât timp trebuie păstrate fișele de instruire SSM?',
    options: [
      '1 an',
      '3 ani',
      '5 ani',
      '10 ani'
    ],
    correctAnswer: 2,
    explanation: 'Fișele de instruire în domeniul SSM trebuie păstrate timp de cel puțin 5 ani de la data efectuării instruirii.',
    legalReference: 'HG 1425/2006',
    difficulty: 'mediu'
  },
  {
    id: 'intro-022',
    question: 'Ce este boala profesională?',
    options: [
      'Orice boală contractată la locul de muncă',
      'Boală produsă de acțiunea factorilor de risc profesional',
      'Răceală sau gripă luată de la colegi',
      'Oboseală cronică de la muncă'
    ],
    correctAnswer: 1,
    explanation: 'Boala profesională este afecțiunea care se produce ca urmare a exercitării unei meserii sau profesii, cauzată de agenți nocivi fizici, chimici sau biologici caracteristici locului de muncă.',
    legalReference: 'HG 1425/2006',
    difficulty: 'mediu'
  },
  {
    id: 'intro-023',
    question: 'Cine poate refuza executarea unei lucrări care prezintă pericol grav și iminent?',
    options: [
      'Nimeni, trebuie executată oricum',
      'Doar șeful de echipă',
      'Orice lucrător care constată pericolul',
      'Doar responsabilul SSM'
    ],
    correctAnswer: 2,
    explanation: 'Orice lucrător poate refuza executarea unei lucrări dacă apreciază că aceasta prezintă un pericol grav și iminent pentru viața și sănătatea sa.',
    legalReference: 'Legea 319/2006, art. 16',
    difficulty: 'mediu'
  },
  {
    id: 'intro-024',
    question: 'La ce temperatură minimă în interior se poate desfășura activitate în sezonul rece?',
    options: [
      '10°C',
      '12°C',
      '15°C',
      '18°C'
    ],
    correctAnswer: 2,
    explanation: 'Temperatura minimă la locul de muncă în spații închise în sezonul rece este de 15°C pentru activități cu efort fizic redus.',
    legalReference: 'Legea 319/2006',
    difficulty: 'mediu'
  },
  {
    id: 'intro-025',
    question: 'Ce trebuie să facă angajatul nou după finalizarea instruirii SSM?',
    options: [
      'Nimic, instruirea este opțională',
      'Să semneze fișa de instruire',
      'Să plătească taxa de instruire',
      'Să dea un examen scris'
    ],
    correctAnswer: 1,
    explanation: 'După finalizarea instruirii, angajatul trebuie să semneze fișa de instruire, confirmând că a înțeles informațiile prezentate.',
    legalReference: 'HG 1425/2006',
    difficulty: 'usor'
  },
  {
    id: 'intro-026',
    question: 'Ce reprezentare are semnul de interzicere?',
    options: [
      'Triunghi galben',
      'Cerc roșu cu linie diagonală',
      'Pătrat verde',
      'Cerc albastru'
    ],
    correctAnswer: 1,
    explanation: 'Semnele de interzicere au formă rotundă cu fundal alb, contur și bandă roșie diagonală și simboluri negre.',
    legalReference: 'HG 971/2006',
    difficulty: 'usor'
  },
  {
    id: 'intro-027',
    question: 'Cine stabilește măsurile de prim ajutor la locul de muncă?',
    options: [
      'Fiecare angajat',
      'Angajatorul, în funcție de activitate',
      'Medicul de familie',
      'Inspectoratul de Muncă'
    ],
    correctAnswer: 1,
    explanation: 'Angajatorul trebuie să stabilească măsurile de prim ajutor, în funcție de natura activităților desfășurate și de riscurile identificate.',
    legalReference: 'Legea 319/2006, art. 11',
    difficulty: 'mediu'
  },
  {
    id: 'intro-028',
    question: 'Cum trebuie să fie iluminatul la locul de muncă?',
    options: [
      'Lumină naturală exclusiv',
      'Adecvat tipului de activitate desfășurate',
      'Cât mai puternică posibil',
      'La alegerea fiecărui angajat'
    ],
    correctAnswer: 1,
    explanation: 'Iluminatul trebuie să fie adecvat naturii activității desfășurate, să nu producă disconfort vizual și să asigure condițiile necesare de securitate.',
    legalReference: 'Legea 319/2006',
    difficulty: 'mediu'
  },
  {
    id: 'intro-029',
    question: 'Ce trebuie să facă angajatul dacă suferă un accident ușor la locul de muncă?',
    options: [
      'Să nu anunțe nimeni dacă nu e grav',
      'Să anunțe conducătorul locului de muncă',
      'Să meargă direct acasă',
      'Să aștepta până la sfârșitul programului'
    ],
    correctAnswer: 1,
    explanation: 'Orice accident de muncă, indiferent de gravitate, trebuie anunțat conducătorului locului de muncă pentru a se putea lua măsurile necesare.',
    legalReference: 'Legea 319/2006',
    difficulty: 'usor'
  },
  {
    id: 'intro-030',
    question: 'Care este scopul principal al activităților de SSM?',
    options: [
      'Creșterea producției',
      'Reducerea costurilor',
      'Prevenirea accidentelor și îmbolnăvirilor profesionale',
      'Respectarea programului de lucru'
    ],
    correctAnswer: 2,
    explanation: 'Scopul principal al SSM este prevenirea accidentelor de muncă și a bolilor profesionale, prin asigurarea unui mediu de lucru sigur și sănătos.',
    legalReference: 'Legea 319/2006, art. 1',
    difficulty: 'usor'
  }
];

export default testeInstruireIntroductiv;
