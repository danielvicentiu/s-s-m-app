/**
 * Quiz PSI (Prevenire și Stingere Incendii)
 * Bază de date cu întrebări pentru testarea cunoștințelor PSI
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const quizQuestions: QuizQuestion[] = [
  // STINGĂTOARE - Easy
  {
    id: 'psi-001',
    question: 'La ce interval maxim trebuie verificate stingătoarele portabile?',
    options: ['3 luni', '6 luni', '12 luni', '24 luni'],
    correctIndex: 1,
    explanation: 'Conform normelor PSI, stingătoarele portabile trebuie verificate la interval de maximum 6 luni și reverificate la maximum 12 luni.',
    difficulty: 'easy'
  },
  {
    id: 'psi-002',
    question: 'Ce clasă de incendiu poate stinge un stingător cu pulbere ABC?',
    options: ['Doar clasa A', 'Doar clasa B', 'Clasele A, B și C', 'Doar clasa C'],
    correctIndex: 2,
    explanation: 'Stingătorul cu pulbere ABC poate stinge incendii de clasele A (solide), B (lichide) și C (gaze).',
    difficulty: 'easy'
  },
  {
    id: 'psi-003',
    question: 'Care este distanța maximă de parcurs pentru a ajunge la un stingător portabil într-un spațiu industrial?',
    options: ['10 metri', '20 metri', '30 metri', '50 metri'],
    correctIndex: 2,
    explanation: 'În spații industriale, distanța maximă de parcurs până la cel mai apropiat stingător este de 30 metri.',
    difficulty: 'medium'
  },
  {
    id: 'psi-004',
    question: 'Ce tip de stingător NU trebuie folosit la incendii cu echipamente electrice sub tensiune?',
    options: ['CO2', 'Pulbere', 'Apă', 'Spumă halocarbon'],
    correctIndex: 2,
    explanation: 'Stingătorul cu apă nu trebuie folosit la incendii cu echipamente electrice sub tensiune deoarece apa conduce curentul electric.',
    difficulty: 'easy'
  },

  // HIDRANTI - Medium/Hard
  {
    id: 'psi-005',
    question: 'Care este presiunea minimă de funcționare a unui hidrant interior?',
    options: ['1 bar', '2 bar', '2.5 bar', '3 bar'],
    correctIndex: 1,
    explanation: 'Presiunea minimă de funcționare a unui hidrant interior este de 2 bar pentru a asigura un jet eficient.',
    difficulty: 'medium'
  },
  {
    id: 'psi-006',
    question: 'La ce interval trebuie verificați funcțional hidranții interiori?',
    options: ['Lunar', 'La 3 luni', 'La 6 luni', 'Anual'],
    correctIndex: 2,
    explanation: 'Hidranții interiori trebuie verificați funcțional la interval de 6 luni conform normelor PSI.',
    difficulty: 'medium'
  },
  {
    id: 'psi-007',
    question: 'Care este debitul minim pentru un hidrant interior în clădiri de risc mare?',
    options: ['1.3 l/s', '2.5 l/s', '5 l/s', '10 l/s'],
    correctIndex: 1,
    explanation: 'Pentru clădiri de risc mare, debitul minim al unui hidrant interior trebuie să fie de 2.5 litri/secundă.',
    difficulty: 'hard'
  },
  {
    id: 'psi-008',
    question: 'Ce culoare trebuie să aibă furtunul hidrantului interior conform normelor?',
    options: ['Negru', 'Roșu', 'Galben', 'Albastru'],
    correctIndex: 1,
    explanation: 'Furtunurile hidranților interiori trebuie să fie de culoare roșie pentru a fi ușor de identificat în caz de urgență.',
    difficulty: 'easy'
  },

  // EVACUARE - Easy/Medium
  {
    id: 'psi-009',
    question: 'Care este lățimea minimă a unei căi de evacuare pentru flux unidirecțional?',
    options: ['0.6 m', '0.9 m', '1.2 m', '1.5 m'],
    correctIndex: 1,
    explanation: 'Lățimea minimă a unei căi de evacuare pentru flux unidirecțional este de 0.9 metri (90 cm).',
    difficulty: 'medium'
  },
  {
    id: 'psi-010',
    question: 'În ce direcție trebuie să se deschidă ușile de evacuare?',
    options: ['În sensul evacuării', 'În sens opus evacuării', 'Ambele sensuri', 'Nu contează'],
    correctIndex: 0,
    explanation: 'Ușile de evacuare trebuie să se deschidă în sensul evacuării pentru a facilita ieșirea rapidă în caz de urgență.',
    difficulty: 'easy'
  },
  {
    id: 'psi-011',
    question: 'Care este distanța maximă de parcurs până la ieșirea de evacuare într-o clădire fără sistem de stingere automată?',
    options: ['25 m', '35 m', '45 m', '60 m'],
    correctIndex: 2,
    explanation: 'Distanța maximă de parcurs până la ieșirea de evacuare este de 45 metri pentru clădiri fără sistem de stingere automată.',
    difficulty: 'hard'
  },
  {
    id: 'psi-012',
    question: 'Cât timp trebuie să funcționeze iluminatul de siguranță pentru evacuare?',
    options: ['15 minute', '30 minute', '1 oră', '2 ore'],
    correctIndex: 2,
    explanation: 'Iluminatul de siguranță pentru evacuare trebuie să funcționeze minimum 1 oră pentru a permite evacuarea completă.',
    difficulty: 'medium'
  },

  // DETECȚIE - Medium/Hard
  {
    id: 'psi-013',
    question: 'Ce tip de detector este cel mai eficient pentru detectarea incendiilor cu flăcări vii?',
    options: ['Detector de fum', 'Detector de căldură', 'Detector de flacără', 'Detector de gaz'],
    correctIndex: 2,
    explanation: 'Detectorul de flacără (UV/IR) este cel mai eficient pentru detectarea rapidă a incendiilor cu flăcări vii.',
    difficulty: 'medium'
  },
  {
    id: 'psi-014',
    question: 'La ce interval trebuie testate detectoarele automate de incendiu?',
    options: ['Lunar', 'La 3 luni', 'La 6 luni', 'Anual'],
    correctIndex: 2,
    explanation: 'Detectoarele automate de incendiu trebuie testate funcțional la interval de 6 luni.',
    difficulty: 'medium'
  },
  {
    id: 'psi-015',
    question: 'Care este aria maximă de acoperire pentru un detector de fum într-o încăpere cu tavan plan?',
    options: ['30 mp', '50 mp', '80 mp', '100 mp'],
    correctIndex: 2,
    explanation: 'Un detector de fum poate acoperi maximum 80 mp într-o încăpere cu tavan plan de înălțime normală.',
    difficulty: 'hard'
  },
  {
    id: 'psi-016',
    question: 'Ce tip de detector NU este recomandat în bucătării sau zonele cu aburi?',
    options: ['Detector de căldură', 'Detector de fum optic', 'Detector de temperatură', 'Detector termic'],
    correctIndex: 1,
    explanation: 'Detectorul de fum optic nu este recomandat în bucătării deoarece poate genera alarme false din cauza aburilor.',
    difficulty: 'medium'
  },

  // CLASE INCENDIU - Easy/Medium
  {
    id: 'psi-017',
    question: 'Ce clasă de incendiu reprezintă arderea metalelor?',
    options: ['Clasa A', 'Clasa C', 'Clasa D', 'Clasa F'],
    correctIndex: 2,
    explanation: 'Clasa D reprezintă incendiile provocate de metale combustibile (magneziu, aluminiu, sodiu etc.).',
    difficulty: 'medium'
  },
  {
    id: 'psi-018',
    question: 'Ce clasă de incendiu reprezintă uleiurile și grăsimile de gătit?',
    options: ['Clasa A', 'Clasa B', 'Clasa D', 'Clasa F'],
    correctIndex: 3,
    explanation: 'Clasa F (sau K) reprezintă incendiile cu uleiuri și grăsimi de gătit din bucătării profesionale.',
    difficulty: 'easy'
  },
  {
    id: 'psi-019',
    question: 'Ce clasă de incendiu reprezintă gazele inflamabile (metan, propan, butan)?',
    options: ['Clasa A', 'Clasa B', 'Clasa C', 'Clasa E'],
    correctIndex: 2,
    explanation: 'Clasa C reprezintă incendiile cu gaze inflamabile precum metanul, propanul și butanul.',
    difficulty: 'easy'
  },
  {
    id: 'psi-020',
    question: 'Care dintre următoarele materiale intră în clasa A de incendiu?',
    options: ['Benzină', 'Lemn', 'Gaz metan', 'Magneziu'],
    correctIndex: 1,
    explanation: 'Lemnul este un material solid combustibil și face parte din clasa A de incendiu.',
    difficulty: 'easy'
  },

  // INTERVENȚIE - Medium/Hard
  {
    id: 'psi-021',
    question: 'Care este ordinea corectă de acțiune la descoperirea unui incendiu?',
    options: [
      'Stinge, anunță, evacuează',
      'Anunță, evacuează, stinge dacă este posibil',
      'Evacuează, stinge, anunță',
      'Stinge, evacuează, anunță'
    ],
    correctIndex: 1,
    explanation: 'Ordinea corectă este: anunță (112/pompieri), evacuează persoanele, apoi încearcă stingerea dacă este posibil și în siguranță.',
    difficulty: 'medium'
  },
  {
    id: 'psi-022',
    question: 'De la ce distanță minimă trebuie să te poziționezi când folosești un stingător?',
    options: ['1 metru', '2 metri', '3 metri', '5 metri'],
    correctIndex: 2,
    explanation: 'Distanța minimă recomandată pentru utilizarea unui stingător este de 3 metri pentru siguranță și eficiență.',
    difficulty: 'medium'
  },
  {
    id: 'psi-023',
    question: 'În ce zonă a flăcării trebuie îndreptat jetul stingătorului?',
    options: ['În vârful flăcării', 'La baza flăcării', 'Deasupra flăcării', 'Sub flacără'],
    correctIndex: 1,
    explanation: 'Jetul trebuie îndreptat la baza flăcării, acolo unde se găsește combustibilul, pentru stingere eficientă.',
    difficulty: 'easy'
  },
  {
    id: 'psi-024',
    question: 'Cât timp aproximativ poate funcționa un stingător de 6 kg cu pulbere?',
    options: ['5-10 secunde', '10-15 secunde', '15-25 secunde', '30-40 secunde'],
    correctIndex: 1,
    explanation: 'Un stingător de 6 kg cu pulbere are o durată de funcționare de aproximativ 10-15 secunde.',
    difficulty: 'hard'
  },

  // LEGISLAȚIE & PROCEDURI - Medium/Hard
  {
    id: 'psi-025',
    question: 'Cât timp trebuie păstrate registrele de instrucție PSI?',
    options: ['1 an', '2 ani', '3 ani', '5 ani'],
    correctIndex: 3,
    explanation: 'Registrele de instrucție PSI trebuie păstrate minimum 5 ani conform normelor în vigoare.',
    difficulty: 'hard'
  },
  {
    id: 'psi-026',
    question: 'La ce interval trebuie efectuată instruirea PSI periodică pentru angajați?',
    options: ['La 3 luni', 'La 6 luni', 'Anual', 'La 2 ani'],
    correctIndex: 2,
    explanation: 'Instruirea PSI periodică pentru angajați trebuie efectuată anual.',
    difficulty: 'medium'
  },
  {
    id: 'psi-027',
    question: 'Care este capacitatea minimă de stingere pentru un stingător în spații de producție?',
    options: ['3 kg', '6 kg', '9 kg', '12 kg'],
    correctIndex: 1,
    explanation: 'În spații de producție, capacitatea minimă recomandată pentru un stingător este de 6 kg.',
    difficulty: 'medium'
  },
  {
    id: 'psi-028',
    question: 'Câte persoane instruite PSI trebuie să existe pentru 50 de angajați?',
    options: ['Minimum 1', 'Minimum 2', 'Minimum 3', 'Minimum 5'],
    correctIndex: 1,
    explanation: 'Pentru 50 de angajați trebuie să existe minimum 2 persoane instruite PSI (aproximativ 1 la 25-30 angajați).',
    difficulty: 'hard'
  },

  // SCENARII PRACTICE - Hard
  {
    id: 'psi-029',
    question: 'Un incendiu electric în tabloul de distribuție. Ce acțiune este corectă?',
    options: [
      'Folosești imediat apă',
      'Deconectezi curentul și folosești CO2 sau pulbere',
      'Folosești spumă',
      'Aștepți pompierii fără să faci nimic'
    ],
    correctIndex: 1,
    explanation: 'La incendii electrice: mai întâi deconectezi curentul dacă este posibil, apoi folosești stingător CO2 sau pulbere, NICIODATĂ apă.',
    difficulty: 'hard'
  },
  {
    id: 'psi-030',
    question: 'Fumul negru și dens indică de obicei arderea a ce tip de material?',
    options: [
      'Lemn și hârtie',
      'Materiale plastice și petroliere',
      'Țesături naturale',
      'Metale'
    ],
    correctIndex: 1,
    explanation: 'Fumul negru și dens este caracteristic arderii materialelor plastice și derivatelor de petrol.',
    difficulty: 'medium'
  }
];

/**
 * Filtrare întrebări după dificultate
 */
export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): QuizQuestion[] => {
  return quizQuestions.filter(q => q.difficulty === difficulty);
};

/**
 * Obține un set aleator de întrebări
 */
export const getRandomQuestions = (count: number): QuizQuestion[] => {
  const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, quizQuestions.length));
};

/**
 * Obține întrebări pentru un quiz balansat
 */
export const getBalancedQuiz = (totalQuestions: number): QuizQuestion[] => {
  const easy = getQuestionsByDifficulty('easy');
  const medium = getQuestionsByDifficulty('medium');
  const hard = getQuestionsByDifficulty('hard');

  const easyCount = Math.floor(totalQuestions * 0.4);
  const mediumCount = Math.floor(totalQuestions * 0.4);
  const hardCount = totalQuestions - easyCount - mediumCount;

  const selectedEasy = easy.sort(() => Math.random() - 0.5).slice(0, easyCount);
  const selectedMedium = medium.sort(() => Math.random() - 0.5).slice(0, mediumCount);
  const selectedHard = hard.sort(() => Math.random() - 0.5).slice(0, hardCount);

  return [...selectedEasy, ...selectedMedium, ...selectedHard].sort(() => Math.random() - 0.5);
};
