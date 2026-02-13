/**
 * Test Prim Ajutor - 20 întrebări
 * Scenarii: arsură, fractură, electrocutare, hemoragie, leșin, stop cardiac, etc.
 */

export interface TestPrimAjutorQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index în array-ul options (0-3)
  explanation: string;
  scenario: 'arsura' | 'fractura' | 'electrocutare' | 'hemoragie' | 'lesin' | 'stop_cardiac' | 'inec' | 'otravire' | 'socul_anafilactic' | 'traumatism_cranian';
}

export const testePrimAjutor: TestPrimAjutorQuestion[] = [
  {
    id: 'pa-001',
    question: 'Un coleg suferă o arsură de gradul 2 la mână (cu bășici). Care este primul pas corect?',
    options: [
      'Sparg bășicile și aplic unguent',
      'Răcesc arsura cu apă rece curentă timp de 10-20 minute',
      'Aplic unt sau pastă de dinți',
      'Acopăr direct cu bandaj strâns'
    ],
    correctAnswer: 1,
    explanation: 'Răcirea cu apă rece curentă (10-20 minute) oprește propagarea căldurii în țesuturi și ameliorează durerea. Nu spargem niciodată bășicile și nu aplicăm substanțe grăsoase.',
    scenario: 'arsura'
  },
  {
    id: 'pa-002',
    question: 'Suspectați o fractură la antebrațul unui angajat. Ce NU trebuie să faceți?',
    options: [
      'Imobilizez membrul în poziția găsită',
      'Încerc să reduc fractura (să pun osul la loc)',
      'Aplic gheață (prin material textil) pentru a reduce umflarea',
      'Chem ambulanța imediat'
    ],
    correctAnswer: 1,
    explanation: 'Nu încercăm niciodată să reducem o fractură - acest lucru poate agrava leziunile (vase, nervi, mușchi). Imobilizăm în poziția găsită și chemăm ajutor medical.',
    scenario: 'fractura'
  },
  {
    id: 'pa-003',
    question: 'O persoană a fost electrocutată și este încă în contact cu sursa electrică. Ce faceți PRIMUL?',
    options: [
      'Încerc să trag victima de haine',
      'Întrerup sursa de curent (siguranțe/întrerupător) sau îndepărtez victima cu un obiect NECONDUCĂTOR',
      'Încep imediat resuscitarea',
      'Arunc apă pe victimă pentru a opri curentul'
    ],
    correctAnswer: 1,
    explanation: 'Siguranța salvatorului este prioritară. Întrerup sursa sau folosesc un obiect neconducător (lemn uscat, plastic) pentru a îndepărta victima. Nu ating direct victima conectată la curent!',
    scenario: 'electrocutare'
  },
  {
    id: 'pa-004',
    question: 'Un angajat are o hemoragie arterială abundentă la antebraț (sânge roșu aprins, pulsatil). Ce faceți?',
    options: [
      'Aplic imediat un garou deasupra rănii',
      'Aplic presiune DIRECTĂ pe rană cu un material curat/steril',
      'Torn alcool pe rană pentru dezinfecție',
      'Aștept ambulanța fără să intervin'
    ],
    correctAnswer: 1,
    explanation: 'Presiunea directă pe rană este metoda primară pentru controlul hemoragiei. Garoul se folosește DOAR în situații extreme (amputație traumatică, hemoragie imposibil de controlat).',
    scenario: 'hemoragie'
  },
  {
    id: 'pa-005',
    question: 'Un coleg leșină brusc. Este conștient, palid și transpirat. Ce poziție îi dați?',
    options: [
      'Poziție șezândă, cu capul între genunchi',
      'Poziție culcat pe spate, picioarele ridicate (15-30 cm)',
      'Poziție laterală de siguranță',
      'Poziție în picioare, sprijinit de perete'
    ],
    correctAnswer: 1,
    explanation: 'Pentru leșin/sincopă (dacă persoana este conștientă), poziția culcat pe spate cu picioarele ridicate îmbunătățește întoarcerea sângelui la creier.',
    scenario: 'lesin'
  },
  {
    id: 'pa-006',
    question: 'Găsiți o persoană inconștientă care NU respiră. După ce chemați ajutorul, ce faceți?',
    options: [
      'Aștept ambulanța lângă victimă',
      'Încep imediat compresiile toracice (resuscitarea cardio-pulmonară - RCP)',
      'Încerc să dau doar ventilații gură-la-gură',
      'Caut pulsul la gât timp de 2 minute'
    ],
    correctAnswer: 1,
    explanation: 'În stop cardiac, TIMPUL este esențial. Începem imediat compresiile toracice (30 compresii : 2 ventilații). Fiecare minut întârziere reduce șansele de supraviețuire cu 10%.',
    scenario: 'stop_cardiac'
  },
  {
    id: 'pa-007',
    question: 'La ce adâncime și frecvență se fac compresiile toracice la un adult?',
    options: [
      '3-4 cm adâncime, 80-100 compresii/minut',
      '5-6 cm adâncime, 100-120 compresii/minut',
      '7-8 cm adâncime, 140-160 compresii/minut',
      '2-3 cm adâncime, 60-80 compresii/minut'
    ],
    correctAnswer: 1,
    explanation: 'Compresiile corecte: 5-6 cm adâncime, ritm 100-120/minut, pe jumătatea inferioară a sternului. Lăsăm toracele să revină complet între compresii.',
    scenario: 'stop_cardiac'
  },
  {
    id: 'pa-008',
    question: 'O persoană s-a înecat cu mâncare și NU poate respira/tusește/vorbește. Ce faceți?',
    options: [
      'Bat pe spate între omoplați (5 lovituri)',
      'Aplic manevrele Heimlich (compresii abdominale) imediat',
      'Încerc să scot mâncarea cu degetul din gură',
      'Dau apă să înghită'
    ],
    correctAnswer: 0,
    explanation: 'Protocol standard: 5 lovituri pe spate (între omoplați), apoi 5 compresii abdominale (Heimlich), alternativ până se eliberează obstrucția. Dacă devine inconștientă - RCP.',
    scenario: 'inec'
  },
  {
    id: 'pa-009',
    question: 'Un angajat a ingerat o substanță chimică necunoscută. Ce NU trebuie să faceți?',
    options: [
      'Chem imediat 112 și Centrul de Informare Toxicologică',
      'Provoc vărsătura pentru a elimina substanța',
      'Păstrez ambalajul/eticheta substanței pentru medici',
      'Monitorizez starea persoanei până vine ambulanța'
    ],
    correctAnswer: 1,
    explanation: 'NU provocăm vărsătură - unele substanțe (corozive, petroliere) fac mai multe daune la întoarcere. Chemăm 112 și păstrăm ambalajul pentru identificare.',
    scenario: 'otravire'
  },
  {
    id: 'pa-010',
    question: 'O persoană prezintă reacție alergică severă (șoc anafilactic): umflare facială, dificultate respiratorie, urticarie. Ce faceți PRIMUL?',
    options: [
      'Dau antihistaminice (Aerius, Claritine)',
      'Chem 112 și administrez autoinjectorul de adrenalină (EpiPen) dacă este disponibil',
      'Aplic comprese reci pe umflătură',
      'Dau apă multă să bea'
    ],
    correctAnswer: 1,
    explanation: 'Șocul anafilactic este urgență vitală. Chemăm 112 imediat și administrăm adrenalină (EpiPen) dacă este disponibilă. Poziționăm persoana culcat cu picioarele ridicate.',
    scenario: 'socul_anafilactic'
  },
  {
    id: 'pa-011',
    question: 'Un angajat a căzut și a suferit un traumatism cranian (lovitură la cap). Este conștient dar confuz. Ce faceți?',
    options: [
      'Îl las să doarmă imediat',
      'Îl mențin treaz, imobilizez capul/gâtul, chem 112',
      'Dau paracetamol pentru durere',
      'Aplic gheață direct pe cap și aștept să treacă'
    ],
    correctAnswer: 1,
    explanation: 'La traumatism cranian: imobilizăm capul/gâtul (posibilă leziune cervicală), menținem persoana trează, monitorizăm conștiența, chemăm 112. NU dăm medicamente fără aprobare medicală.',
    scenario: 'traumatism_cranian'
  },
  {
    id: 'pa-012',
    question: 'Găsiți o persoană inconștientă, dar respiră normal. În ce poziție o puneți?',
    options: [
      'Pe spate, cu capul întors într-o parte',
      'Poziția laterală de siguranță (PLS)',
      'Șezând, cu capul între genunchi',
      'Pe burtă, cu capul la o parte'
    ],
    correctAnswer: 1,
    explanation: 'Poziția laterală de siguranță (PLS) previne înecarea cu limbă sau vărsături la persoanele inconștiente care respiră. Monitorizăm constant respirația.',
    scenario: 'lesin'
  },
  {
    id: 'pa-013',
    question: 'Ce conține trusa de prim ajutor MINIMĂ la locul de muncă (conform legislației SSM)?',
    options: [
      'Doar plasturi și bandaje',
      'Materiale sterile, bandaje, comprese, mănuși, foarfecă, dezinfectant, masca RCP',
      'Medicamente (paracetamol, ibuprofen, antibiotice)',
      'Doar un telefon pentru 112'
    ],
    correctAnswer: 1,
    explanation: 'Trusa minimă: materiale sterile, bandaje/comprese, mănuși de unică folosință, foarfecă, soluție dezinfectantă, mască RCP. NU conține medicamente (acestea se dau doar pe prescripție medicală).',
    scenario: 'arsura'
  },
  {
    id: 'pa-014',
    question: 'Un coleg are o hemoragie nazală abundentă. Ce îi recomandați?',
    options: [
      'Cap înapoi, tampon în nară',
      'Cap înainte (ușor aplecat), strâng nările timp de 10 minute',
      'Cap pe o parte, las să curgă liber',
      'Gheață pe frunte și cap înapoi'
    ],
    correctAnswer: 1,
    explanation: 'Capul înainte (nu înapoi - sângele poate fi înghițit), strângem nările 10 minute continuu, gheață la rădăcina nasului. Dacă nu se oprește în 20 min - medic.',
    scenario: 'hemoragie'
  },
  {
    id: 'pa-015',
    question: 'La o arsură electrică, după ce victima este în siguranță, ce particularitate are aceasta?',
    options: [
      'Are doar leziuni superficiale vizibile',
      'Poate avea leziuni interne grave (cardiac, mușchi) chiar dacă arsura externă pare mică',
      'Se tratează identic cu o arsură termică normală',
      'Nu necesită evaluare medicală dacă victima se simte bine'
    ],
    correctAnswer: 1,
    explanation: 'Arsurile electrice pot cauza leziuni interne grave (stop cardiac, leziuni musculare/nervoase) chiar dacă arsura externă pare minoră. TOATE victimele de electrocutare trebuie evaluate medical!',
    scenario: 'electrocutare'
  },
  {
    id: 'pa-016',
    question: 'Un angajat are o fractură deschisă la picior (osul străpunge pielea). Ce faceți?',
    options: [
      'Încerc să introduc osul înapoi sub piele',
      'Acopăr rana cu un material steril/curat, imobilizez membrul, chem 112',
      'Spăl rana cu apă din robinet',
      'Aplic un garou deasupra fracturii'
    ],
    correctAnswer: 1,
    explanation: 'La fractură deschisă: NU atingem osul, acoperim rana cu material steril, imobilizăm în poziția găsită, chem 112 urgent. Risc mare de infecție și hemoragie.',
    scenario: 'fractura'
  },
  {
    id: 'pa-017',
    question: 'Care este numărul unic de urgență în România pentru situații medicale?',
    options: [
      '961',
      '112',
      '911',
      '0800-URGENTE'
    ],
    correctAnswer: 1,
    explanation: '112 este numărul unic european de urgență (medical, pompieri, poliție, SMURD). Funcționează din orice telefon, chiar fără credit sau SIM.',
    scenario: 'stop_cardiac'
  },
  {
    id: 'pa-018',
    question: 'Un angajat are o arsură chimică cu acid la mână. Ce faceți PRIMUL?',
    options: [
      'Neutralizez cu o bază (sodă caustică)',
      'Spăl abundent cu apă curentă timp de minimum 15-20 minute',
      'Aplic unguent pentru arsuri',
      'Șterg chimic cu un material uscat'
    ],
    correctAnswer: 1,
    explanation: 'La arsuri chimice: spălăm IMEDIAT cu apă curentă abundentă (15-20 min), îndepărtăm hainele contaminate. NU neutralizăm chimic (reacția poate genera căldură suplimentară).',
    scenario: 'arsura'
  },
  {
    id: 'pa-019',
    question: 'Ce verificați ÎNTÂI la orice victimă inconștientă (protocolul ABC)?',
    options: [
      'A - Airway (căi aeriene libere)',
      'B - Breathing (respirație)',
      'C - Circulation (circulație/puls)',
      'D - Disability (stare neurologică)'
    ],
    correctAnswer: 0,
    explanation: 'Protocolul ABC: A-Airway (verificăm/deschidem căile aeriene), B-Breathing (verificăm respirația), C-Circulation (verificăm circulația). Ordinea este esențială!',
    scenario: 'lesin'
  },
  {
    id: 'pa-020',
    question: 'Un coleg diabetic prezintă hipoglicemie (scădere zahăr): tremur, transpirație, confuzie, dar este CONȘTIENT. Ce îi dați?',
    options: [
      'Insulină suplimentară',
      'Apă simplă',
      'Zahăr rapid absorbit (suc, miere, bomboane) urmat de carbohidrați complecși',
      'Nimic, îl duc imediat la spital'
    ],
    correctAnswer: 2,
    explanation: 'La hipoglicemie cu persoana CONȘTIENTĂ: dăm zahăr rapid (15g - suc, 3-4 cuburi zahăr, miere), așteptăm 15 min, apoi carbohidrați complecși (pâine). Dacă este INCONȘTIENTĂ - 112, NU dăm nimic pe gură!',
    scenario: 'lesin'
  }
];

/**
 * Obține întrebări random pentru un test
 * @param count - număr de întrebări (default: 10)
 * @returns array de întrebări random
 */
export function getRandomQuestions(count: number = 10): TestPrimAjutorQuestion[] {
  const shuffled = [...testePrimAjutor].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, testePrimAjutor.length));
}

/**
 * Obține întrebări filtrate după scenariu
 * @param scenario - tipul de scenariu
 * @returns array de întrebări pentru scenariul respectiv
 */
export function getQuestionsByScenario(
  scenario: TestPrimAjutorQuestion['scenario']
): TestPrimAjutorQuestion[] {
  return testePrimAjutor.filter(q => q.scenario === scenario);
}

/**
 * Calculează scorul pentru un test
 * @param answers - map cu id întrebare -> index răspuns selectat
 * @returns obiect cu rezultate (score, total, percentage, details)
 */
export function calculateScore(answers: Record<string, number>) {
  let correct = 0;
  const total = Object.keys(answers).length;
  const details: Array<{
    questionId: string;
    isCorrect: boolean;
    userAnswer: number;
    correctAnswer: number;
  }> = [];

  Object.entries(answers).forEach(([questionId, userAnswer]) => {
    const question = testePrimAjutor.find(q => q.id === questionId);
    if (question) {
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correct++;
      details.push({
        questionId,
        isCorrect,
        userAnswer,
        correctAnswer: question.correctAnswer
      });
    }
  });

  return {
    correct,
    total,
    percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    details
  };
}
