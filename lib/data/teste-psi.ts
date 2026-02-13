/**
 * Baza de date cu întrebări pentru teste PSI (Prevenire și Stingere Incendii)
 * Categorii: prevenire, stingere, evacuare, legislatie
 * Niveluri: beginner, intermediate, advanced
 */

export interface TestePsiQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index-ul răspunsului corect (0-3)
  explanation: string;
  category: 'prevenire' | 'stingere' | 'evacuare' | 'legislatie';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const testePsiQuestions: TestePsiQuestion[] = [
  // PREVENIRE - Beginner
  {
    id: 'psi-prev-001',
    question: 'Care este temperatura de aprindere a lemnului uscat?',
    options: [
      '100-150°C',
      '200-250°C',
      '250-300°C',
      '350-400°C'
    ],
    correctAnswer: 2,
    explanation: 'Lemnul uscat se aprinde la temperaturi cuprinse între 250-300°C. Aceasta este temperatura la care lemnul începe să carbonizeze și să degaje gaze inflamabile.',
    category: 'prevenire',
    difficulty: 'beginner'
  },
  {
    id: 'psi-prev-002',
    question: 'Ce tip de materiale sunt clasificate în clasa A de incendiu?',
    options: [
      'Lichide inflamabile',
      'Materiale solide (lemn, hârtie, textile)',
      'Gaze inflamabile',
      'Metale combustibile'
    ],
    correctAnswer: 1,
    explanation: 'Clasa A include materialele solide care ard cu formarea de jeratic: lemn, hârtie, carton, textile, plastic, cauciuc.',
    category: 'prevenire',
    difficulty: 'beginner'
  },
  {
    id: 'psi-prev-003',
    question: 'Care este distanța minimă de siguranță între un radiator electric și materiale combustibile?',
    options: [
      '10 cm',
      '30 cm',
      '50 cm',
      '100 cm'
    ],
    correctAnswer: 2,
    explanation: 'Distanța minimă de siguranță între aparate de încălzire și materiale combustibile este de minimum 50 cm pentru a preveni aprinderea.',
    category: 'prevenire',
    difficulty: 'beginner'
  },
  {
    id: 'psi-prev-004',
    question: 'Ce reprezintă triunghiul focului?',
    options: [
      'Cele trei etaje ale unei clădiri',
      'Cele trei elemente necesare pentru producerea unui incendiu',
      'Cele trei tipuri de stingătoare',
      'Cele trei faze ale evacuării'
    ],
    correctAnswer: 1,
    explanation: 'Triunghiul focului reprezintă cele trei elemente necesare pentru producerea unui incendiu: material combustibil, comburant (oxigen) și sursă de aprindere (căldură).',
    category: 'prevenire',
    difficulty: 'beginner'
  },
  {
    id: 'psi-prev-005',
    question: 'Depozitarea materialelor inflamabile trebuie să se facă:',
    options: [
      'În birouri, pentru acces rapid',
      'În spații special amenajate, ventilate',
      'Sub scări, pentru economie de spațiu',
      'Lângă surse de căldură, pentru ușurință'
    ],
    correctAnswer: 1,
    explanation: 'Materialele inflamabile trebuie depozitate în spații special amenajate, bine ventilate, departe de surse de căldură și conform reglementărilor PSI.',
    category: 'prevenire',
    difficulty: 'beginner'
  },

  // PREVENIRE - Intermediate
  {
    id: 'psi-prev-006',
    question: 'Care este presiunea de lucru standard a unui hidrant interior?',
    options: [
      '1-2 bar',
      '2-4 bar',
      '4-6 bar',
      '8-10 bar'
    ],
    correctAnswer: 2,
    explanation: 'Presiunea de lucru standard a unui hidrant interior este de 4-6 bar, asigurând debitul și raza de acțiune necesară pentru stingerea incendiilor.',
    category: 'prevenire',
    difficulty: 'intermediate'
  },
  {
    id: 'psi-prev-007',
    question: 'La ce interval trebuie verificate și întreținute stingătoarele portabile?',
    options: [
      'La 3 luni',
      'La 6 luni',
      'Anual',
      'La 2 ani'
    ],
    correctAnswer: 2,
    explanation: 'Stingătoarele portabile trebuie verificate anual de către personal autorizat, cu revizie tehnică completă conform normelor în vigoare.',
    category: 'prevenire',
    difficulty: 'intermediate'
  },
  {
    id: 'psi-prev-008',
    question: 'Care este rezistența la foc minimă pentru o ușă coupe-feu standard?',
    options: [
      'EI 15',
      'EI 30',
      'EI 60',
      'EI 120'
    ],
    correctAnswer: 2,
    explanation: 'O ușă coupe-feu standard are rezistență la foc EI 60 (etanșeitate și izolare termică pentru 60 minute), deși există și alte clase în funcție de destinație.',
    category: 'prevenire',
    difficulty: 'intermediate'
  },
  {
    id: 'psi-prev-009',
    question: 'Ce reprezintă sarcina termică a unui spațiu?',
    options: [
      'Temperatura maximă din încăpere',
      'Cantitatea de căldură degajată la arderea completă a materialelor combustibile',
      'Suprafața încăperii',
      'Numărul de aparate electrice'
    ],
    correctAnswer: 1,
    explanation: 'Sarcina termică reprezintă cantitatea totală de căldură care s-ar degaja la arderea completă a tuturor materialelor combustibile dintr-un spațiu, exprimată în MJ/m².',
    category: 'prevenire',
    difficulty: 'intermediate'
  },
  {
    id: 'psi-prev-010',
    question: 'Care este raza de acțiune minimă a unui hidrant exterior?',
    options: [
      '20 metri',
      '40 metri',
      '60 metri',
      '100 metri'
    ],
    correctAnswer: 1,
    explanation: 'Hidranții exteriori trebuie amplasați astfel încât raza lor de acțiune (40 metri) să acopere întreaga clădire sau zona protejată.',
    category: 'prevenire',
    difficulty: 'intermediate'
  },

  // STINGERE - Beginner
  {
    id: 'psi-sting-001',
    question: 'Ce tip de stingător se folosește pentru incendii la echipamente electrice sub tensiune?',
    options: [
      'Stingător cu apă',
      'Stingător cu spumă',
      'Stingător cu CO2 sau pulbere',
      'Stingător cu orice agent'
    ],
    correctAnswer: 2,
    explanation: 'Pentru echipamente electrice sub tensiune se folosesc stingătoare cu CO2 sau pulbere, deoarece nu sunt conducătoare de electricitate.',
    category: 'stingere',
    difficulty: 'beginner'
  },
  {
    id: 'psi-sting-002',
    question: 'Prima acțiune la descoperirea unui incendiu este:',
    options: [
      'A încerca să stingi singur incendiul',
      'A anunța serviciul de urgență 112',
      'A evacua clădirea',
      'A strânge obiectele personale'
    ],
    correctAnswer: 1,
    explanation: 'Prima acțiune este anunțarea serviciului de urgență 112, apoi evacuarea și, dacă este posibil și sigur, intervenția cu mijloace proprii.',
    category: 'stingere',
    difficulty: 'beginner'
  },
  {
    id: 'psi-sting-003',
    question: 'Cum se folosește corect un stingător portabil?',
    options: [
      'Se îndreaptă jetul spre vârful flăcării',
      'Se îndreaptă jetul spre baza flăcării',
      'Se pulverizează în aer deasupra focului',
      'Se aruncă stingătorul în foc'
    ],
    correctAnswer: 1,
    explanation: 'Jetul trebuie îndreptat spre baza flăcării, mișcându-l în evantai pentru a acoperi întreaga suprafață în flăcări.',
    category: 'stingere',
    difficulty: 'beginner'
  },
  {
    id: 'psi-sting-004',
    question: 'Ce este INTERZIS să folosești pentru stingerea unui incendiu la tigaie cu ulei încins?',
    options: [
      'Capac de tigaie',
      'Prosop umed',
      'Apă',
      'Stingător pentru clasa F'
    ],
    correctAnswer: 2,
    explanation: 'Apa NU trebuie folosită la incendii cu ulei/grăsimi încinse, deoarece produce explozie și împrăștierea flăcărilor. Se acoperă cu capac sau se folosește stingător clasa F.',
    category: 'stingere',
    difficulty: 'beginner'
  },
  {
    id: 'psi-sting-005',
    question: 'Ce înseamnă marcajul ABC pe un stingător?',
    options: [
      'Poate stinge doar incendii mici',
      'Poate stinge incendii de clasa A, B și C',
      'Trebuie folosit de 3 persoane',
      'Are 3 moduri de funcționare'
    ],
    correctAnswer: 1,
    explanation: 'Marcajul ABC indică faptul că stingătorul este eficient pentru incendii de clasa A (solide), B (lichide) și C (gaze).',
    category: 'stingere',
    difficulty: 'beginner'
  },

  // STINGERE - Intermediate
  {
    id: 'psi-sting-006',
    question: 'Care este capacitatea minimă a unui stingător pentru clasa A în spații comerciale?',
    options: [
      '3 kg/l',
      '6 kg/l',
      '9 kg/l',
      '12 kg/l'
    ],
    correctAnswer: 1,
    explanation: 'Pentru spații comerciale, capacitatea minimă standard a unui stingător pentru clasa A este de 6 kg sau 6 litri agent stingător.',
    category: 'stingere',
    difficulty: 'intermediate'
  },
  {
    id: 'psi-sting-007',
    question: 'Ce este un sistem de sprinklere?',
    options: [
      'Sistem de iluminat de siguranță',
      'Sistem automat de stingere cu apă',
      'Sistem de alarmă la incendiu',
      'Sistem de ventilație'
    ],
    correctAnswer: 1,
    explanation: 'Sistemul de sprinklere este un sistem automat de stingere care activează capetele de sprinklere când temperatura atinge un anumit prag, pulverizând apă.',
    category: 'stingere',
    difficulty: 'intermediate'
  },
  {
    id: 'psi-sting-008',
    question: 'La ce temperatură se activează de obicei un cap de sprinkler standard?',
    options: [
      '37-40°C',
      '57-77°C',
      '100-120°C',
      '150-180°C'
    ],
    correctAnswer: 1,
    explanation: 'Capetele de sprinklere standard se activează la temperaturi între 57-77°C (cele mai comune la 68°C), în funcție de rating-ul termic.',
    category: 'stingere',
    difficulty: 'intermediate'
  },
  {
    id: 'psi-sting-009',
    question: 'Care este principiul de funcționare al unui stingător cu CO2?',
    options: [
      'Răcește focul',
      'Înlătură oxigenul (sufocare)',
      'Creează o barieră fizică',
      'Neutralizează combustibilul'
    ],
    correctAnswer: 1,
    explanation: 'Stingătorul cu CO2 funcționează prin sufocare - dioxidul de carbon înlocuiește oxigenul din zona de ardere, oprind combustia.',
    category: 'stingere',
    difficulty: 'intermediate'
  },
  {
    id: 'psi-sting-010',
    question: 'Ce reprezintă un post de incendiu interior echipat (PIE)?',
    options: [
      'Locul unde se depozitează stingătoarele',
      'Hidrant + furtun + robinet de incendiu',
      'Biroul responsabilului PSI',
      'Camera pentru echipamente pompieri'
    ],
    correctAnswer: 1,
    explanation: 'PIE este format din hidrant interior, furtun rola-derulare, robinet de incendiu și țeavă de alimentare cu apă, montat fix în clădire.',
    category: 'stingere',
    difficulty: 'intermediate'
  },

  // EVACUARE - Beginner
  {
    id: 'psi-evac-001',
    question: 'Ce este un plan de evacuare?',
    options: [
      'Planul arhitectural al clădirii',
      'Schema cu căile de ieșire în caz de urgență',
      'Lista angajaților',
      'Programul de lucru'
    ],
    correctAnswer: 1,
    explanation: 'Planul de evacuare este schema afișată vizibil care arată căile de ieșire, locația dumneavoastră, punctul de adunare și mijloacele PSI din zonă.',
    category: 'evacuare',
    difficulty: 'beginner'
  },
  {
    id: 'psi-evac-002',
    question: 'În timpul evacuării, trebuie să:',
    options: [
      'Alergi și împingi pentru a ieși primul',
      'Te deplasezi calm, organizat, ajutând pe alții',
      'Folosești liftul pentru viteză',
      'Te întorci pentru obiecte personale'
    ],
    correctAnswer: 1,
    explanation: 'Evacuarea trebuie făcută calm, organizat, pe căile stabilite, ajutând persoanele cu dizabilități, fără panică și fără întoarcere.',
    category: 'evacuare',
    difficulty: 'beginner'
  },
  {
    id: 'psi-evac-003',
    question: 'Ce înseamnă pictograma verde cu om alergând și săgeată?',
    options: [
      'Zonă de sport',
      'Ieșire de urgență',
      'Intrare principală',
      'Traseu turistic'
    ],
    correctAnswer: 1,
    explanation: 'Pictograma omului alergând pe fundal verde indică o ieșire de urgență sau direcția către aceasta.',
    category: 'evacuare',
    difficulty: 'beginner'
  },
  {
    id: 'psi-evac-004',
    question: 'Este permisă folosirea liftului în timpul evacuării?',
    options: [
      'Da, pentru rapiditate',
      'Da, doar pentru persoane cu dizabilități',
      'Nu, se folosesc exclusiv scările',
      'Da, dacă este gol'
    ],
    correctAnswer: 2,
    explanation: 'În timpul unei evacuări NU se folosește liftul niciodată - acesta poate rămâne blocat. Se folosesc exclusiv scările de evacuare.',
    category: 'evacuare',
    difficulty: 'beginner'
  },
  {
    id: 'psi-evac-005',
    question: 'Ce este punctul de adunare?',
    options: [
      'Locul unde se adună gunoiul',
      'Zona sigură unde se adună persoanele evacuate',
      'Sala de ședințe',
      'Parcarea clădirii'
    ],
    correctAnswer: 1,
    explanation: 'Punctul de adunare este zona sigură, la distanță de clădire, unde se adună toate persoanele evacuate pentru a fi numărate.',
    category: 'evacuare',
    difficulty: 'beginner'
  },

  // EVACUARE - Intermediate
  {
    id: 'psi-evac-006',
    question: 'Care este lățimea minimă liberă a unei căi de evacuare pentru 100 de persoane?',
    options: [
      '0.90 m',
      '1.20 m',
      '1.50 m',
      '2.00 m'
    ],
    correctAnswer: 1,
    explanation: 'Pentru 100 de persoane, lățimea minimă liberă a căii de evacuare este de 1.20 m, calculată conform normativelor PSI (1.20 cm/persoană pentru primele 100).',
    category: 'evacuare',
    difficulty: 'intermediate'
  },
  {
    id: 'psi-evac-007',
    question: 'Ce reprezintă TRVR (Timp de Referință pentru Vulnerabilitate la Risc)?',
    options: [
      'Timpul de ardere a materialelor',
      'Timpul disponibil pentru evacuare în siguranță',
      'Timpul de intervenție al pompierilor',
      'Timpul de funcționare al stingătoarelor'
    ],
    correctAnswer: 1,
    explanation: 'TRVR este timpul maxim disponibil pentru evacuarea completă a persoanelor dintr-un spațiu înainte ca condițiile să devină periculoase pentru viață.',
    category: 'evacuare',
    difficulty: 'intermediate'
  },
  {
    id: 'psi-evac-008',
    question: 'Câte persoane poate coordona un responsabil cu evacuarea?',
    options: [
      'Maximum 10 persoane',
      'Maximum 20 persoane',
      'Maximum 50 persoane',
      'Numărul nu este limitat'
    ],
    correctAnswer: 1,
    explanation: 'Un responsabil cu evacuarea poate coordona eficient maximum 20 de persoane, asigurând o evacuare organizată și rapidă.',
    category: 'evacuare',
    difficulty: 'intermediate'
  },
  {
    id: 'psi-evac-009',
    question: 'Sistemul de iluminat de siguranță trebuie să funcționeze minimum:',
    options: [
      '15 minute',
      '30 minute',
      '1 oră',
      '3 ore'
    ],
    correctAnswer: 2,
    explanation: 'Sistemul de iluminat de siguranță pentru căile de evacuare trebuie să asigure minimum 1 oră de autonomie în caz de întrerupere a alimentării principale.',
    category: 'evacuare',
    difficulty: 'intermediate'
  },
  {
    id: 'psi-evac-010',
    question: 'La ce nivel trebuie menținut sunetul alarmei de incendiu?',
    options: [
      'Minimum 45 dB',
      'Minimum 65 dB',
      'Minimum 85 dB',
      'Minimum 100 dB'
    ],
    correctAnswer: 1,
    explanation: 'Alarma de incendiu trebuie să producă un sunet de minimum 65 dB la distanță de 1 metru, sau cu 5 dB peste nivelul de zgomot ambiental.',
    category: 'evacuare',
    difficulty: 'intermediate'
  },

  // LEGISLAȚIE - Beginner
  {
    id: 'psi-leg-001',
    question: 'Cine este responsabil pentru respectarea măsurilor de prevenire a incendiilor într-o firmă?',
    options: [
      'Doar pompierii',
      'Angajații',
      'Angajatorul/administratorul clădirii',
      'Poliția'
    ],
    correctAnswer: 2,
    explanation: 'Conform legislației, angajatorul/administratorul clădirii este responsabil legal pentru implementarea și respectarea măsurilor de prevenire a incendiilor.',
    category: 'legislatie',
    difficulty: 'beginner'
  },
  {
    id: 'psi-leg-002',
    question: 'La câți angajați este obligatorie desemnarea unui responsabil PSI?',
    options: [
      'De la 1 angajat',
      'De la 10 angajați',
      'De la 50 angajați',
      'De la 100 angajați'
    ],
    correctAnswer: 0,
    explanation: 'Conform Legii 307/2006, orice angajator trebuie să desemneze unul sau mai mulți lucrători pentru a se ocupa de activitățile de prevenire a incendiilor.',
    category: 'legislatie',
    difficulty: 'beginner'
  },
  {
    id: 'psi-leg-003',
    question: 'Care este legea de bază privind apărarea împotriva incendiilor în România?',
    options: [
      'Legea 307/2006',
      'Legea 319/2006',
      'Legea 101/2014',
      'Legea 53/2003'
    ],
    correctAnswer: 0,
    explanation: 'Legea nr. 307/2006 privind apărarea împotriva incendiilor este actul normativ de bază în domeniul PSI din România.',
    category: 'legislatie',
    difficulty: 'beginner'
  }
];

/**
 * Funcții helper pentru filtrarea întrebărilor
 */
export const getQuestionsByCategory = (category: TestePsiQuestion['category']) => {
  return testePsiQuestions.filter(q => q.category === category);
};

export const getQuestionsByDifficulty = (difficulty: TestePsiQuestion['difficulty']) => {
  return testePsiQuestions.filter(q => q.difficulty === difficulty);
};

export const getRandomQuestions = (count: number): TestePsiQuestion[] => {
  const shuffled = [...testePsiQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getQuestionById = (id: string): TestePsiQuestion | undefined => {
  return testePsiQuestions.find(q => q.id === id);
};
