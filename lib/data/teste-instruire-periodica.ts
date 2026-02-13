/**
 * Baza de date cu întrebări pentru teste de instruire periodică SSM/PSI
 * Întrebările acoperă diverse tematici conform legislației SSM din România
 */

export interface TesteInstruirePeriodicaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index-ul răspunsului corect (0-3)
  explanation: string;
  month: number; // luna relevantă (1-12)
  difficulty: 'usor' | 'mediu' | 'dificil';
}

export const testeInstruirePeriodicaQuestions: TesteInstruirePeriodicaQuestion[] = [
  {
    id: 'tip-1',
    question: 'Care este frecvența minimă a instruirilor periodice pentru lucrătorii din producție conform legislației SSM?',
    options: [
      'O dată pe an',
      'O dată la 6 luni',
      'O dată la 3 luni',
      'O dată la 2 ani'
    ],
    correctAnswer: 0,
    explanation: 'Conform Hotărârii 1425/2006, instruirea periodică se efectuează anual pentru majoritatea lucrătorilor din producție.',
    month: 1,
    difficulty: 'usor'
  },
  {
    id: 'tip-2',
    question: 'Ce tip de echipament individual de protecție (EIP) trebuie purtat obligatoriu pe șantierele de construcții?',
    options: [
      'Mănuși de protecție',
      'Casca de protecție',
      'Ochelari de protecție',
      'Centura de siguranță'
    ],
    correctAnswer: 1,
    explanation: 'Casca de protecție este obligatorie pe toate șantierele de construcții pentru a proteja împotriva căderilor de obiecte.',
    month: 1,
    difficulty: 'usor'
  },
  {
    id: 'tip-3',
    question: 'La ce înălțime minimă este obligatorie utilizarea sistemelor de protecție împotriva căderilor?',
    options: [
      '1 metru',
      '1,5 metri',
      '2 metri',
      '3 metri'
    ],
    correctAnswer: 2,
    explanation: 'Conform normelor SSM, lucrul la înălțime necesită protecție împotriva căderilor începând de la 2 metri.',
    month: 2,
    difficulty: 'mediu'
  },
  {
    id: 'tip-4',
    question: 'Care este temperatura minimă admisă la locul de muncă în interior conform legislației?',
    options: [
      '12°C',
      '15°C',
      '18°C',
      '20°C'
    ],
    correctAnswer: 1,
    explanation: 'Temperatura minimă la locul de muncă în interior trebuie să fie de minimum 15°C pentru munca sedentară.',
    month: 2,
    difficulty: 'mediu'
  },
  {
    id: 'tip-5',
    question: 'Ce culoare are semnul de interdicție în semnalizarea de securitate?',
    options: [
      'Albastru',
      'Verde',
      'Roșu',
      'Galben'
    ],
    correctAnswer: 2,
    explanation: 'Semnele de interdicție au fundal alb cu simbol și contur roșu conform standardelor de semnalizare de securitate.',
    month: 3,
    difficulty: 'usor'
  },
  {
    id: 'tip-6',
    question: 'Care este durata maximă de utilizare continuă a unui ecran de vizualizare fără pauză?',
    options: [
      '30 minute',
      '50 minute',
      '2 ore',
      '4 ore'
    ],
    correctAnswer: 1,
    explanation: 'Se recomandă o pauză de minimum 10 minute după fiecare 50 de minute de lucru continuu la calculator.',
    month: 3,
    difficulty: 'mediu'
  },
  {
    id: 'tip-7',
    question: 'Ce clasă de incendiu desemnează litera "A"?',
    options: [
      'Lichide inflamabile',
      'Materiale solide (lemn, hârtie, textile)',
      'Gaze inflamabile',
      'Metale inflamabile'
    ],
    correctAnswer: 1,
    explanation: 'Clasa A de incendiu include materiale solide care produc jar: lemn, hârtie, textile, carton.',
    month: 4,
    difficulty: 'usor'
  },
  {
    id: 'tip-8',
    question: 'Care este principala cauză a accidentelor de muncă în România?',
    options: [
      'Defecțiunea echipamentelor',
      'Factorul uman (nerespectarea procedurilor)',
      'Lipsa echipamentelor de protecție',
      'Condițiile meteorologice'
    ],
    correctAnswer: 1,
    explanation: 'Statistica arată că peste 80% din accidentele de muncă se datorează factorului uman și nerespectării normelor SSM.',
    month: 4,
    difficulty: 'mediu'
  },
  {
    id: 'tip-9',
    question: 'Ce înseamnă acronimul RLS în contextul bazelor de date Supabase?',
    options: [
      'Row Level Security',
      'Remote Login System',
      'Real-time Link Service',
      'Restricted Level Storage'
    ],
    correctAnswer: 0,
    explanation: 'RLS (Row Level Security) este un sistem de securitate care restricționează accesul la rândurile din tabele pe baza politicilor definite.',
    month: 5,
    difficulty: 'dificil'
  },
  {
    id: 'tip-10',
    question: 'Care este scopul principal al evaluării riscurilor de accidentare și îmbolnăvire profesională?',
    options: [
      'Respectarea legislației',
      'Identificarea și eliminarea/reducerea riscurilor',
      'Documentarea pentru inspectorat',
      'Evitarea amenzilor'
    ],
    correctAnswer: 1,
    explanation: 'Scopul principal al evaluării riscurilor este identificarea pericolelor și luarea măsurilor de prevenire și protecție.',
    month: 5,
    difficulty: 'mediu'
  },
  {
    id: 'tip-11',
    question: 'Stingătorul cu pulbere ABC este eficient pentru:',
    options: [
      'Doar incendii de lemn și hârtie',
      'Doar incendii electrice',
      'Incendii clasa A, B și C',
      'Doar incendii de lichide'
    ],
    correctAnswer: 2,
    explanation: 'Stingătorul cu pulbere ABC este universal și poate fi folosit pentru incendii solide (A), lichide (B) și gaze (C).',
    month: 6,
    difficulty: 'usor'
  },
  {
    id: 'tip-12',
    question: 'Ce este EPI-ul de categoria III?',
    options: [
      'Echipament pentru riscuri minime',
      'Echipament pentru riscuri moderate',
      'Echipament pentru riscuri mortale sau leziuni ireversibile',
      'Echipament pentru protecția ochilor'
    ],
    correctAnswer: 2,
    explanation: 'EPI categoria III protejează împotriva riscurilor mortale sau a leziunilor grave și ireversibile (ex: căzături de la înălțime, atmosfere toxice).',
    month: 6,
    difficulty: 'dificil'
  },
  {
    id: 'tip-13',
    question: 'Care este numărul de urgență pentru apelarea serviciilor de salvare în România?',
    options: [
      '112',
      '911',
      '999',
      '113'
    ],
    correctAnswer: 0,
    explanation: '112 este numărul unic european de urgență pentru apelarea pompierilor, ambulanței și poliției în România.',
    month: 7,
    difficulty: 'usor'
  },
  {
    id: 'tip-14',
    question: 'Câte compresiuni toracice se efectuează în cadrul resuscitării cardio-pulmonare (RCP)?',
    options: [
      '15 compresiuni, apoi 2 insufflații',
      '30 compresiuni, apoi 2 insufflații',
      '20 compresiuni, apoi 1 insufflație',
      '10 compresiuni, apoi 2 insufflații'
    ],
    correctAnswer: 1,
    explanation: 'Protocolul RCP actual prevede 30 de compresiuni toracice urmate de 2 insufflații.',
    month: 7,
    difficulty: 'mediu'
  },
  {
    id: 'tip-15',
    question: 'Care este tensiunea electrică considerată periculoasă pentru corpul uman în mediu umed?',
    options: [
      'Peste 12V',
      'Peste 24V',
      'Peste 50V',
      'Peste 220V'
    ],
    correctAnswer: 1,
    explanation: 'În medii umede, tensiunile peste 24V sunt considerate periculoase pentru corpul uman.',
    month: 8,
    difficulty: 'mediu'
  },
  {
    id: 'tip-16',
    question: 'Ce semnifică culoarea GALBEN în semnalizarea de securitate?',
    options: [
      'Interdicție',
      'Obligativitate',
      'Avertizare/atenționare',
      'Salvare/prim ajutor'
    ],
    correctAnswer: 2,
    explanation: 'Culoarea galbenă în semnalizarea de securitate indică avertizare și atenționare asupra unui pericol.',
    month: 8,
    difficulty: 'usor'
  },
  {
    id: 'tip-17',
    question: 'Care este greutatea maximă ce poate fi manipulată manual de către o femeie adult?',
    options: [
      '10 kg',
      '15 kg',
      '20 kg',
      '25 kg'
    ],
    correctAnswer: 1,
    explanation: 'Conform normelor de protecție a muncii, o femeie adult poate manipula manual maximum 15 kg ocazional și 10 kg frecvent.',
    month: 9,
    difficulty: 'mediu'
  },
  {
    id: 'tip-18',
    question: 'Ce este un "aproape accident" (near miss)?',
    options: [
      'Un accident minor fără victime',
      'Un eveniment care ar fi putut duce la accident dar nu a dus',
      'Un accident care a necesitat prim ajutor',
      'Un incident fără consecințe materiale'
    ],
    correctAnswer: 1,
    explanation: '"Aproape accidentul" este un eveniment care ar fi putut produce un accident dar din diferite motive nu a condus la leziuni sau daune.',
    month: 9,
    difficulty: 'dificil'
  },
  {
    id: 'tip-19',
    question: 'La ce interval trebuie verificate periodic stingătoarele portabile?',
    options: [
      'La 3 luni',
      'La 6 luni',
      'Anual',
      'La 2 ani'
    ],
    correctAnswer: 1,
    explanation: 'Stingătoarele portabile trebuie verificate semestrial (la 6 luni) și reverificare anuală completă conform normelor PSI.',
    month: 10,
    difficulty: 'mediu'
  },
  {
    id: 'tip-20',
    question: 'Ce culoare au conductele care transportă oxigen în instalații industriale?',
    options: [
      'Albastră',
      'Verde',
      'Roșie',
      'Galbenă'
    ],
    correctAnswer: 0,
    explanation: 'Conform standardelor, conductele cu oxigen sunt marcate cu culoarea albastră pentru identificare rapidă.',
    month: 10,
    difficulty: 'dificil'
  },
  {
    id: 'tip-21',
    question: 'Care este durata minimă a instruirii inițiale la locul de muncă?',
    options: [
      '2 ore',
      '4 ore',
      '8 ore',
      'Depinde de complexitatea locului de muncă'
    ],
    correctAnswer: 3,
    explanation: 'Durata instruirii inițiale variază în funcție de complexitatea și riscurile locului de muncă, stabilită de responsabilul SSM.',
    month: 11,
    difficulty: 'mediu'
  },
  {
    id: 'tip-22',
    question: 'Ce presupune "ergonomia la locul de muncă"?',
    options: [
      'Doar mobilier confortabil',
      'Adaptarea locului de muncă la caracteristicile omului',
      'Doar iluminat adecvat',
      'Doar echipamente moderne'
    ],
    correctAnswer: 1,
    explanation: 'Ergonomia presupune adaptarea tuturor elementelor locului de muncă (mobilier, echipamente, iluminat, etc.) la caracteristicile fizice și psihice ale omului.',
    month: 11,
    difficulty: 'mediu'
  },
  {
    id: 'tip-23',
    question: 'În cât timp trebuie raportată inspectoratului teritorial o accident de muncă mortal?',
    options: [
      'Imediat',
      'În 24 de ore',
      'În 48 de ore',
      'În 3 zile'
    ],
    correctAnswer: 0,
    explanation: 'Accidentele mortale trebuie raportate IMEDIAT inspectoratului teritorial de muncă și altor autorități competente.',
    month: 12,
    difficulty: 'dificil'
  },
  {
    id: 'tip-24',
    question: 'Care este scopul principal al Comitetului de Securitate și Sănătate în Muncă (CSSM)?',
    options: [
      'Sancționarea angajaților',
      'Consultare și participare la decizii SSM',
      'Înlocuirea serviciului SSM',
      'Controlul activității angajatorului'
    ],
    correctAnswer: 1,
    explanation: 'CSSM este un organism parititar de consultare și participare la toate deciziile referitoare la securitatea și sănătatea în muncă.',
    month: 12,
    difficulty: 'mediu'
  },
  {
    id: 'tip-25',
    question: 'Ce este un DPI (Document de Protecție Internă)?',
    options: [
      'Document de instruire a angajaților',
      'Plan de evacuare și intervenție în caz de urgență',
      'Fișa postului',
      'Contractul de muncă'
    ],
    correctAnswer: 1,
    explanation: 'DPI este documentul care stabilește măsurile de prevenire și intervenție în situații de urgență specifice obiectivului economic.',
    month: 1,
    difficulty: 'dificil'
  },
  {
    id: 'tip-26',
    question: 'Ce factor de risc reprezintă zgomotul continuu peste 85 dB(A) la locul de muncă?',
    options: [
      'Risc ergonomic',
      'Risc fizic',
      'Risc chimic',
      'Risc biologic'
    ],
    correctAnswer: 1,
    explanation: 'Zgomotul este un factor de risc fizic care poate produce leziuni auditive ireversibile la expunere prelungită peste 85 dB(A).',
    month: 2,
    difficulty: 'mediu'
  },
  {
    id: 'tip-27',
    question: 'Care este prima acțiune în cazul unei arsuri termice?',
    options: [
      'Aplicarea de gheață direct pe arsură',
      'Aplicarea de unguente sau creme',
      'Răcirea zonei cu apă rece curentă 10-20 minute',
      'Înfășurarea cu bandaj steril imediat'
    ],
    correctAnswer: 2,
    explanation: 'Prima măsură la arsuri termice este răcirea zonei afectate cu apă rece curentă timp de 10-20 minute pentru a opri propagarea căldurii.',
    month: 3,
    difficulty: 'mediu'
  },
  {
    id: 'tip-28',
    question: 'Ce presupune "lucrul în spațiu confinat"?',
    options: [
      'Lucrul în birouri mici',
      'Lucrul în spații închise cu ventilație limitată și acces restricționat',
      'Lucrul în magazine',
      'Lucrul la subsoluri'
    ],
    correctAnswer: 1,
    explanation: 'Spațiul confinat este un spațiu închis, cu ventilație naturală limitată, acces/ieșire restricționat, unde pot apărea atmosfere periculoase.',
    month: 4,
    difficulty: 'dificil'
  },
  {
    id: 'tip-29',
    question: 'Care este semnificația simbolului "craniu cu oase încrucișate" pe etichetele produselor chimice?',
    options: [
      'Produs coroziv',
      'Produs iritant',
      'Produs toxic/mortal',
      'Produs inflamabil'
    ],
    correctAnswer: 2,
    explanation: 'Simbolul "craniu cu oase încrucișate" indică produse chimice toxice care pot cauza intoxicații severe sau moarte prin inhalare, ingerare sau contact cutanat.',
    month: 5,
    difficulty: 'usor'
  },
  {
    id: 'tip-30',
    question: 'Care este obligația principală a angajatorului conform Legii 319/2006?',
    options: [
      'Plata salariilor la timp',
      'Asigurarea securității și sănătății lucrătorilor',
      'Oferirea de bonusuri',
      'Organizarea de team building-uri'
    ],
    correctAnswer: 1,
    explanation: 'Conform Legii 319/2006 privind SSM, obligația principală a angajatorului este asigurarea securității și sănătății lucrătorilor în toate aspectele legate de muncă.',
    month: 6,
    difficulty: 'mediu'
  }
];

/**
 * Funcție helper pentru filtrare după lună
 */
export function getQuestionsByMonth(month: number): TesteInstruirePeriodicaQuestion[] {
  return testeInstruirePeriodicaQuestions.filter(q => q.month === month);
}

/**
 * Funcție helper pentru filtrare după dificultate
 */
export function getQuestionsByDifficulty(difficulty: 'usor' | 'mediu' | 'dificil'): TesteInstruirePeriodicaQuestion[] {
  return testeInstruirePeriodicaQuestions.filter(q => q.difficulty === difficulty);
}

/**
 * Funcție helper pentru selectare aleatorie de întrebări
 */
export function getRandomQuestions(count: number = 10): TesteInstruirePeriodicaQuestion[] {
  const shuffled = [...testeInstruirePeriodicaQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
