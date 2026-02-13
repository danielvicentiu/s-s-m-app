/**
 * Quiz Prim Ajutor - 20 întrebări
 * Acoperă: RCP, poziție laterală de siguranță, arsuri, fracturi, hemoragii, șoc, electrocutare
 */

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const quizPrimAjutor: QuizQuestion[] = [
  {
    id: 1,
    question: "Care este secvența corectă a manevrelor de resuscitare cardio-pulmonară (RCP) la adulți?",
    options: [
      "2 ventilații urmate de 30 compresii toracice",
      "30 compresii toracice urmate de 2 ventilații",
      "15 compresii toracice urmate de 2 ventilații",
      "Doar compresii toracice, fără ventilații"
    ],
    correctIndex: 1,
    explanation: "La adulți, RCP se efectuează în raport 30:2 - 30 de compresii toracice urmate de 2 ventilații artificiale. Această secvență se repetă până la sosirea echipajului medical."
  },
  {
    id: 2,
    question: "Care este frecvența corectă a compresiilor toracice la RCP pentru adulți?",
    options: [
      "60-80 compresii pe minut",
      "80-100 compresii pe minut",
      "100-120 compresii pe minut",
      "120-140 compresii pe minut"
    ],
    correctIndex: 2,
    explanation: "Frecvența optimă pentru compresiile toracice la adulți este de 100-120 compresii pe minut. Acest ritm asigură o circulație sanguină eficientă."
  },
  {
    id: 3,
    question: "La ce adâncime trebuie efectuate compresiile toracice la un adult?",
    options: [
      "2-3 cm",
      "3-4 cm",
      "5-6 cm",
      "7-8 cm"
    ],
    correctIndex: 2,
    explanation: "Compresiile toracice la adulți trebuie să fie de 5-6 cm adâncime pentru a fi eficiente. Compresii prea superficiale nu vor genera circulația sanguină necesară."
  },
  {
    id: 4,
    question: "Când plasăm victima în poziția laterală de siguranță?",
    options: [
      "Când victima este inconștientă dar respiră normal",
      "Când victima nu respiră",
      "Când victima are hemoragie severă",
      "Când victima are fractură la coloană"
    ],
    correctIndex: 0,
    explanation: "Poziția laterală de siguranță se folosește pentru victimele inconștiente care respiră normal. Această poziție previne obstrucția căilor respiratorii și aspirația."
  },
  {
    id: 5,
    question: "Care este primul lucru pe care trebuie să-l verificăm la o victimă inconștientă?",
    options: [
      "Dacă are puls",
      "Dacă respiră",
      "Dacă răspunde la stimuli verbali sau dureroși",
      "Dacă are hemoragii"
    ],
    correctIndex: 2,
    explanation: "Primul pas este verificarea conștienței prin stimuli verbali și dureroși. Dacă victima nu răspunde, se continuă cu verificarea respirației și apelul la 112."
  },
  {
    id: 6,
    question: "Cum tratăm o arsură de gradul I (superficială)?",
    options: [
      "Aplicăm gheață direct pe zonă",
      "Răcim zona cu apă rece (10-15°C) timp de 10-20 minute",
      "Aplicăm unguente sau paste de dinți",
      "Spargem veziculele formate"
    ],
    correctIndex: 1,
    explanation: "Arsurile superficiale se tratează prin răcire cu apă rece (nu gheață) timp de 10-20 minute. Nu se aplică unguente, paste sau alte substanțe pe arsură."
  },
  {
    id: 7,
    question: "Ce NU trebuie să facem la o arsură chimică?",
    options: [
      "Să îndepărtăm hainele contaminate",
      "Să spălăm zona afectată cu apă abundentă",
      "Să neutralizăm substanța chimică cu alte substanțe",
      "Să apelăm serviciile medicale de urgență"
    ],
    correctIndex: 2,
    explanation: "NU încercăm să neutralizăm substanța chimică cu alte substanțe, deoarece reacția poate agrava arsura. Spălăm abundent cu apă și apelăm 112."
  },
  {
    id: 8,
    question: "Care este semnul principal al unei fracturi?",
    options: [
      "Durere ușoară",
      "Deformarea vizibilă și imposibilitatea mișcării membrului",
      "Înroșirea pielii",
      "Căldură locală"
    ],
    correctIndex: 1,
    explanation: "Fractura se manifestă prin deformare vizibilă, umflătură, durere intensă și imposibilitatea mobilizării membrului afectat. Este necesară imobilizarea și transportul la spital."
  },
  {
    id: 9,
    question: "Cum imobilizăm un membru fracturat până la sosirea ambulanței?",
    options: [
      "Încercăm să repoziționăm osul fracturat",
      "Imobilizăm membrul în poziția în care l-am găsit, folosind atele improvizate",
      "Masăm zona afectată pentru a reduce durerea",
      "Aplicăm ghips imediat"
    ],
    correctIndex: 1,
    explanation: "Imobilizăm membrul în poziția găsită, fără a încerca repoziționarea. Folosim atele improvizate (scânduri, bastoane) și fixăm deasupra și dedesubtul fracturii."
  },
  {
    id: 10,
    question: "Cum oprim o hemoragie externă severă?",
    options: [
      "Aplicăm un garou imediat",
      "Presiune directă fermă pe rană cu un pansament curat",
      "Spălăm rana cu apă și săpun",
      "Ridicăm membrul și așteptăm să se oprească singură"
    ],
    correctIndex: 1,
    explanation: "Prima măsură este presiunea directă pe rană cu un pansament curat sau mână. Garourile se folosesc doar ca ultimă soluție la hemoragii masive necontrolabile."
  },
  {
    id: 11,
    question: "Când aplicăm un garou (tornichete) pentru o hemoragie?",
    options: [
      "Întotdeauna, la orice hemoragie",
      "Doar când presiunea directă nu oprește sângerarea și este o hemoragie masivă care pune viața în pericol",
      "Când victima cere acest lucru",
      "Niciodată, este interzis"
    ],
    correctIndex: 1,
    explanation: "Garourile se folosesc doar în situații extreme, când presiunea directă eșuează și hemoragia pune viața în pericol. Se aplică deasupra rănii și se notează ora aplicării."
  },
  {
    id: 12,
    question: "Care sunt semnele șocului hipovolemic (pierdere de sânge)?",
    options: [
      "Piele caldă și roșie, puls lent",
      "Piele palidă, rece, transpirată, puls rapid și slab",
      "Febră mare și delir",
      "Dureri abdominale severe"
    ],
    correctIndex: 1,
    explanation: "Șocul hipovolemic se manifestă prin paloare, transpirații reci, puls rapid și slab, respirație rapidă, anxietate. Este o urgență medicală majoră."
  },
  {
    id: 13,
    question: "Cum poziționăm o victimă în șoc (fără traumatisme)?",
    options: [
      "Poziție șezândă",
      "Poziție culcată pe spate cu picioarele ridicate la 30-45 grade",
      "Poziție laterală de siguranță",
      "Poziție pe burtă"
    ],
    correctIndex: 1,
    explanation: "Victima în șoc se culcă pe spate cu picioarele ridicate (15-30 cm) pentru a favoriza întoarcerea sângelui spre organe vitale. Se menține căldura corporală."
  },
  {
    id: 14,
    question: "Ce trebuie să facem PRIMUL la o victimă electrocutată care este încă în contact cu sursa?",
    options: [
      "Tragem victima imediat departe de sursă",
      "Întrerupem sursa de curent sau îndepărtăm victima cu un obiect NECONDUCTOR",
      "Începem RCP imediat",
      "Turnăm apă pe victimă pentru răcire"
    ],
    correctIndex: 1,
    explanation: "ÎNTOTDEAUNA întrerupem sursa de curent sau folosim un obiect neconductor (lemn uscat, plastic) pentru a separa victima. Contactul direct ne pune în pericol!"
  },
  {
    id: 15,
    question: "Ce complicații poate avea o electrocutare, chiar dacă victima pare conștientă?",
    options: [
      "Nu există complicații dacă victima este conștientă",
      "Arsuri interne, aritmii cardiace, oprirea cardiacă întârziată",
      "Doar dureri musculare ușoare",
      "Doar arsuri superficiale"
    ],
    correctIndex: 1,
    explanation: "Electrocutarea poate cauza arsuri interne severe, leziuni cardiace și aritmii care pot apărea după ore. Toate victimele electrocutării necesită evaluare medicală urgentă!"
  },
  {
    id: 16,
    question: "Ce NU trebuie să facem la o victimă cu sângerare nazală (epistaxis)?",
    options: [
      "Înclinăm capul victimei înainte",
      "Apăsăm partea moale a nasului timp de 10 minute",
      "Înclinăm capul victimei înapoi",
      "Aplicăm comprese reci pe nas"
    ],
    correctIndex: 2,
    explanation: "NU înclinăm capul înapoi - sângele se poate scurge în gât și provoca vărsături. Înclinăm capul înainte și apăsăm partea moale a nasului 10 minute."
  },
  {
    id: 17,
    question: "Cum recunoaștem o hemoragie internă?",
    options: [
      "Se vede întotdeauna sânge la exterior",
      "Semne de șoc fără rană vizibilă: paloare, puls slab rapid, abdomen rigid/dureros",
      "Victima nu prezintă niciun simptom",
      "Doar prin radiografie"
    ],
    correctIndex: 1,
    explanation: "Hemoragia internă se suspectează prin semne de șoc fără sângerare vizibilă: paloare, transpirații, puls slab și rapid, abdomen rigid. Apelăm 112 IMEDIAT!"
  },
  {
    id: 18,
    question: "Care este poziția corectă pentru RCP la sugar (copil sub 1 an)?",
    options: [
      "2 degete pe jumătatea inferioară a sternului",
      "O mână pe jumătatea inferioară a sternului",
      "Ambele mâini suprapuse pe stern",
      "Nu se face RCP la sugari"
    ],
    correctIndex: 0,
    explanation: "La sugari, RCP se face cu 2 degete (index și mijlociu) pe jumătatea inferioară a sternului, la aproximativ 4 cm adâncime, în raport 30:2 sau 15:2 (dacă sunt 2 salvatori)."
  },
  {
    id: 19,
    question: "Ce este manevrra Heimlich și când o aplicăm?",
    options: [
      "Manevră pentru oprirea hemoragiilor",
      "Manevră pentru obstrucția completă a căilor respiratorii (înăbușire)",
      "Manevră pentru fracturi",
      "Manevră pentru arsuri"
    ],
    correctIndex: 1,
    explanation: "Manevrra Heimlich se folosește la obstrucția completă a căilor respiratorii (victima nu poate tuși, vorbi sau respira). Se aplică compresii abdominale rapide spre interior și în sus."
  },
  {
    id: 20,
    question: "Cum verificăm dacă o victimă inconștientă respiră?",
    options: [
      "Punem urechea la gură și ascultăm",
      "Metodă VAS (Văd, Aud, Simt): privim toracele, ascultăm respirația, simțim aerul pe obraz - max 10 secunde",
      "Verificăm doar pulsul",
      "Așteptăm 1 minut să vedem dacă se mișcă"
    ],
    correctIndex: 1,
    explanation: "Folosim metoda VAS timp de maximum 10 secunde: Văd mișcarea toracelui, Aud respirația, Simt aerul expirat pe obraz. Dacă nu respiră normal → apelăm 112 și începem RCP."
  }
];

export default quizPrimAjutor;
