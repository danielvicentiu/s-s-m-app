/**
 * Tematici de instruire periodică SSM
 * Conform legislației românești (Legea 319/2006, HG 1425/2006)
 */

export interface TestQuestion {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
}

export interface InstruireTematica {
  id: string;
  title: string;
  description: string;
  applicableSectors: string[];
  duration: number; // în minute
  frequency: 'lunar' | 'trimestrial' | 'semestrial' | 'anual';
  content: string[];
  testQuestions: TestQuestion[];
}

export const tematiciInstruire: InstruireTematica[] = [
  {
    id: 'SSM-001',
    title: 'Introducere în Securitatea și Sănătatea în Muncă',
    description: 'Principii fundamentale SSM, drepturi și obligații, cadrul legislativ',
    applicableSectors: ['toate'],
    duration: 120,
    frequency: 'anual',
    content: [
      'Cadrul legislativ SSM în România - Legea 319/2006',
      'Drepturile și obligațiile angajatorului în domeniul SSM',
      'Drepturile și obligațiile angajatului în domeniul SSM',
      'Structura organizatorică SSM la nivel de firmă',
      'Comitetul de securitate și sănătate în muncă',
      'Reprezentanții lucrătorilor cu răspunderi specifice în domeniul SSM',
    ],
    testQuestions: [
      {
        question: 'Care este actul normativ principal care reglementează SSM în România?',
        answers: ['Codul Muncii', 'Legea 319/2006', 'Legea 53/2003', 'HG 1425/2006'],
        correctAnswerIndex: 1,
      },
      {
        question: 'Angajatul are dreptul să refuze executarea unei sarcini dacă:',
        answers: [
          'Nu îi convine',
          'Consideră că îi pune în pericol viața sau sănătatea',
          'Este obosit',
          'Nu a fost instruit niciodată',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Comitetul de SSM se constituie la angajatori cu cel puțin:',
        answers: ['10 salariați', '20 salariați', '50 salariați', '100 salariați'],
        correctAnswerIndex: 2,
      },
    ],
  },
  {
    id: 'SSM-002',
    title: 'Identificarea și Evaluarea Riscurilor',
    description: 'Metodologii de evaluare a riscurilor profesionale',
    applicableSectors: ['toate'],
    duration: 90,
    frequency: 'anual',
    content: [
      'Conceptul de risc profesional',
      'Identificarea factorilor de risc la locul de muncă',
      'Metode de evaluare a riscurilor',
      'Clasificarea riscurilor: probabil, posibil, improbabil',
      'Planul de prevenire și protecție',
      'Măsuri de eliminare și reducere a riscurilor',
    ],
    testQuestions: [
      {
        question: 'Riscul profesional reprezintă:',
        answers: [
          'Probabilitatea ca un pericol să producă un accident',
          'Orice factor de mediu',
          'Numai riscurile chimice',
          'Echipamentul defect',
        ],
        correctAnswerIndex: 0,
      },
      {
        question: 'Evaluarea riscurilor trebuie făcută:',
        answers: [
          'La cererea angajaților',
          'O dată pe an obligatoriu',
          'La angajare și ori de câte ori apar modificări',
          'Numai după accidente',
        ],
        correctAnswerIndex: 2,
      },
      {
        question: 'Prima măsură în ierarhia prevenției este:',
        answers: [
          'Echipament de protecție',
          'Instruire',
          'Eliminarea riscului',
          'Semnalizare',
        ],
        correctAnswerIndex: 2,
      },
    ],
  },
  {
    id: 'SSM-003',
    title: 'Echipamente Individuale de Protecție (EIP)',
    description: 'Selecție, utilizare și întreținere EIP',
    applicableSectors: ['toate'],
    duration: 60,
    frequency: 'semestrial',
    content: [
      'Categorii de echipamente individuale de protecție',
      'Marcajul CE și certificarea EIP',
      'Criterii de selecție a EIP în funcție de riscuri',
      'Modul corect de utilizare a EIP',
      'Întreținerea și depozitarea EIP',
      'Obligațiile angajatorului și angajatului privind EIP',
    ],
    testQuestions: [
      {
        question: 'EIP se asigură de către:',
        answers: [
          'Angajat, din salariu',
          'Angajator, gratuit',
          'Stat',
          'Sindicat',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Căștile de protecție trebuie înlocuite:',
        answers: [
          'Anual obligatoriu',
          'Când se deteriorează sau după impact',
          'La 5 ani',
          'Niciodată',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Marcajul CE pe un EIP înseamnă:',
        answers: [
          'Este fabricat în Europa',
          'Respectă cerințele de sănătate și securitate',
          'Este gratuit',
          'Este opțional',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-004',
    title: 'Prevenirea Incendiilor la Locul de Muncă',
    description: 'Măsuri de prevenire și stingere incendii, evacuare',
    applicableSectors: ['toate'],
    duration: 90,
    frequency: 'anual',
    content: [
      'Triunghiul focului și condiții de aprindere',
      'Clasificarea claselor de incendiu (A, B, C, D, F)',
      'Mijloace de stingere: tipuri și utilizare',
      'Detectarea și semnalizarea incendiilor',
      'Planuri de evacuare și trasee de evacuare',
      'Comportament în caz de incendiu',
    ],
    testQuestions: [
      {
        question: 'Clasa de incendiu A se referă la:',
        answers: [
          'Lichide inflamabile',
          'Materiale solide (lemn, hârtie, textile)',
          'Gaze',
          'Metale',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Stingătorul cu pulbere ABC se folosește pentru:',
        answers: [
          'Numai incendii electrice',
          'Toate clasele A, B, C',
          'Numai lemn',
          'Numai lichide',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'În caz de incendiu, prima acțiune este:',
        answers: [
          'Salvarea bunurilor',
          'Anunțarea conducerii',
          'Alertarea persoanelor și apelarea 112',
          'Stingerea focului',
        ],
        correctAnswerIndex: 2,
      },
    ],
  },
  {
    id: 'SSM-005',
    title: 'Primul Ajutor în Situații de Urgență',
    description: 'Proceduri de prim ajutor pentru accidente de muncă',
    applicableSectors: ['toate'],
    duration: 120,
    frequency: 'anual',
    content: [
      'Principiile generale ale primului ajutor',
      'Evaluarea victimei: conștiență, respirație, puls',
      'Poziția laterală de siguranță (PLS)',
      'Resuscitarea cardio-respiratorie (RCP)',
      'Oprirea hemoragiilor',
      'Tratamentul arsurilor, fracturilor, electrocutării',
    ],
    testQuestions: [
      {
        question: 'Numărul de urgență unic european este:',
        answers: ['911', '112', '999', '061'],
        correctAnswerIndex: 1,
      },
      {
        question: 'La RCP, raportul compresii/ventilații la adult este:',
        answers: ['15:2', '30:2', '5:1', '10:2'],
        correctAnswerIndex: 1,
      },
      {
        question: 'O arsură de gradul 3 afectează:',
        answers: [
          'Doar epidermul',
          'Epidermul și dermul parțial',
          'Toate straturile pielii',
          'Numai părul',
        ],
        correctAnswerIndex: 2,
      },
    ],
  },
  {
    id: 'SSM-006',
    title: 'Munca la Înălțime',
    description: 'Securitate pentru lucrări peste 2 metri înălțime',
    applicableSectors: ['construcții', 'industrie', 'mentenanță'],
    duration: 120,
    frequency: 'anual',
    content: [
      'Legislație specifică pentru munca la înălțime',
      'Riscuri specifice: cădere, prăbușire, electrocutare',
      'Sisteme de protecție colectivă: parapete, balustrade, plase',
      'Sisteme individuale: ham, frânghii, ancoraj',
      'Schelă, platforme elevatoare, scări',
      'Planificare și autorizare lucrări la înălțime',
    ],
    testQuestions: [
      {
        question: 'Munca la înălțime începe de la:',
        answers: ['1 metru', '2 metri', '3 metri', '5 metri'],
        correctAnswerIndex: 1,
      },
      {
        question: 'Hamul de siguranță trebuie verificat:',
        answers: [
          'Anual',
          'Înainte de fiecare utilizare',
          'La 6 luni',
          'Niciodată',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Punctul de ancoraj trebuie să reziste la:',
        answers: ['500 kg', '1000 kg', '1500 kg', '2000 kg'],
        correctAnswerIndex: 2,
      },
    ],
  },
  {
    id: 'SSM-007',
    title: 'Manipularea Manuală a Sarcinilor',
    description: 'Tehnici ergonomice de ridicare și transport',
    applicableSectors: ['toate'],
    duration: 60,
    frequency: 'anual',
    content: [
      'Anatomia coloanei vertebrale',
      'Riscuri: leziuni musculo-scheletice, hernii',
      'Limite maxime: 25 kg bărbați, 15 kg femei (ocazional)',
      'Tehnici corecte de ridicare: genunchi îndoiți, spate drept',
      'Utilizarea echipamentelor auxiliare: cărucior, transpalet',
      'Organizarea spațiului de lucru',
    ],
    testQuestions: [
      {
        question: 'Limita maximă ocazională pentru femei este:',
        answers: ['10 kg', '15 kg', '20 kg', '25 kg'],
        correctAnswerIndex: 1,
      },
      {
        question: 'La ridicarea unei sarcini, spatele trebuie să fie:',
        answers: ['Îndoit', 'Drept', 'Rotit', 'Într-o parte'],
        correctAnswerIndex: 1,
      },
      {
        question: 'Forța de ridicare provine din:',
        answers: ['Brațe', 'Spate', 'Picioare', 'Umeri'],
        correctAnswerIndex: 2,
      },
    ],
  },
  {
    id: 'SSM-008',
    title: 'Securitatea Mașinilor și Echipamentelor de Lucru',
    description: 'Utilizare și întreținere echipamente',
    applicableSectors: ['industrie', 'construcții', 'agricultură'],
    duration: 90,
    frequency: 'anual',
    content: [
      'Cerințe legale: marcaj CE, declarație de conformitate',
      'Dispozitive de protecție: carcase, garduri, oprire urgență',
      'Proceduri de punere în funcțiune și oprire',
      'Verificări periodice și întreținere',
      'Proceduri LOTO (Lockout-Tagout)',
      'Instrucțiuni de utilizare și autorizare operatori',
    ],
    testQuestions: [
      {
        question: 'Butonul de oprire de urgență trebuie să fie:',
        answers: [
          'Verde',
          'Roșu și ușor accesibil',
          'Albastru',
          'Ascuns',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'LOTO înseamnă:',
        answers: [
          'Loterie',
          'Lockout-Tagout (blocare-etichetare)',
          'Low Temperature',
          'Legal Test Only',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Verificările tehnice periodice se fac:',
        answers: [
          'Când se strică',
          'Conform producătorului și legislației',
          'La 10 ani',
          'Niciodată',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-009',
    title: 'Substanțe Chimice Periculoase',
    description: 'Manipulare, depozitare și protecție substanțe chimice',
    applicableSectors: ['industrie', 'laboratoare', 'curățenie', 'agricultură'],
    duration: 120,
    frequency: 'anual',
    content: [
      'Reglementarea CLP și pictogramele de pericol',
      'Fișa cu date de securitate (FDS)',
      'Categorii: inflamabile, toxice, corozive, nocive',
      'Măsuri de protecție: ventilație, EIP specific',
      'Depozitare: incompatibilități, separare',
      'Proceduri în caz de deversare sau intoxicare',
    ],
    testQuestions: [
      {
        question: 'Pictograma cu craniu și oase simbolizează:',
        answers: [
          'Pericol de incendiu',
          'Toxicitate acută',
          'Coroziv',
          'Pericol pentru mediu',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'FDS trebuie să fie disponibilă:',
        answers: [
          'Doar pentru șef',
          'Pentru toți lucrătorii expuși',
          'La arhivă',
          'Nu este obligatorie',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Substanțele inflamabile se depozitează:',
        answers: [
          'Lângă surse de căldură',
          'În spații ventilate, departe de surse de aprindere',
          'Cu acizii',
          'Oriunde',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-010',
    title: 'Securitatea Electrică',
    description: 'Riscuri electrice și măsuri de protecție',
    applicableSectors: ['toate'],
    duration: 90,
    frequency: 'anual',
    content: [
      'Efectele curentului electric asupra corpului uman',
      'Tensiuni periculoase și clase de tensiune',
      'Măsuri de protecție: izolație, legare la pământ, disjunctoare',
      'Lucrul în apropierea instalațiilor electrice',
      'Autorizare electricieni: ANRE',
      'Primul ajutor în caz de electrocutare',
    ],
    testQuestions: [
      {
        question: 'Tensiunea considerată periculoasă în mediu uscat este:',
        answers: ['12V', '24V', '50V', '230V'],
        correctAnswerIndex: 2,
      },
      {
        question: 'În caz de electrocutare, primul pas este:',
        answers: [
          'Atingerea victimei',
          'Întreruperea sursei de curent',
          'Turnarea de apă',
          'Ridicarea victimei',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Disjunctorul diferențial protejează împotriva:',
        answers: [
          'Supratensiunii',
          'Electrocutării prin curent de defect',
          'Incendiilor',
          'Trăsnetului',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-011',
    title: 'Zgomot și Vibrații la Locul de Muncă',
    description: 'Expunere la zgomot și vibrații, protecție auditivă',
    applicableSectors: ['industrie', 'construcții', 'transport'],
    duration: 60,
    frequency: 'anual',
    content: [
      'Efectele zgomotului asupra sănătății: hipoacuzie, oboseală',
      'Valori limită de expunere: 87 dB(A)',
      'Măsurarea nivelului de zgomot',
      'Protecția auditivă: dopuri, antifoane',
      'Vibrații mână-braț și vibrații corp întreg',
      'Reducerea la sursă și izolare',
    ],
    testQuestions: [
      {
        question: 'Valoarea limită de expunere la zgomot este:',
        answers: ['80 dB(A)', '85 dB(A)', '87 dB(A)', '90 dB(A)'],
        correctAnswerIndex: 2,
      },
      {
        question: 'Protecția auditivă devine obligatorie de la:',
        answers: ['80 dB(A)', '85 dB(A)', '87 dB(A)', '90 dB(A)'],
        correctAnswerIndex: 1,
      },
      {
        question: 'Hipoacuzia profesională este:',
        answers: [
          'Reversibilă',
          'Ireversibilă',
          'Se tratează cu medicamente',
          'Nu există',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-012',
    title: 'Iluminatul la Locul de Muncă',
    description: 'Cerințe de iluminare și efecte asupra sănătății',
    applicableSectors: ['toate'],
    duration: 45,
    frequency: 'anual',
    content: [
      'Importanța iluminatului corespunzător',
      'Niveluri minime de iluminare pe tipuri de activități',
      'Iluminat natural vs artificial',
      'Efecte: oboseală vizuală, greșeli, accidente',
      'Întreținerea sistemelor de iluminat',
      'Ecrane de vizualizare: pauze, poziționare',
    ],
    testQuestions: [
      {
        question: 'Iluminatul insuficient poate cauza:',
        answers: [
          'Oboseală vizuală',
          'Creșterea riscului de accidente',
          'Scăderea productivității',
          'Toate variantele',
        ],
        correctAnswerIndex: 3,
      },
      {
        question: 'Pentru lucrul la calculator, iluminatul recomandat este:',
        answers: ['100 lux', '300 lux', '500 lux', '1000 lux'],
        correctAnswerIndex: 2,
      },
      {
        question: 'Reflexele pe ecrane se reduc prin:',
        answers: [
          'Creșterea luminii',
          'Poziționare corectă și filtre antireflex',
          'Lucrul în întuneric',
          'Mărirea fontului',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-013',
    title: 'Microclimatul la Locul de Muncă',
    description: 'Temperatură, umiditate, ventilație',
    applicableSectors: ['toate'],
    duration: 45,
    frequency: 'anual',
    content: [
      'Parametri microclimatici: temperatură, umiditate, viteză aer',
      'Valori optime pentru diferite tipuri de muncă',
      'Efecte: deshidratare, hipotermie, insolație',
      'Ventilația naturală și mecanică',
      'Echipament de lucru adaptat temperaturii',
      'Măsuri în sezonul cald/rece',
    ],
    testQuestions: [
      {
        question: 'Temperatura optimă pentru muncă de birou este:',
        answers: ['15-18°C', '18-21°C', '20-24°C', '25-30°C'],
        correctAnswerIndex: 2,
      },
      {
        question: 'În sezonul cald, angajatorul trebuie să asigure:',
        answers: [
          'Îngheță',
          'Apă potabilă gratuită',
          'Aer condiționat la 16°C',
          'Program mai lung',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Curenții de aer pot provoca:',
        answers: [
          'Răceli, dureri musculare',
          'Arsuri',
          'Orbire',
          'Nimic',
        ],
        correctAnswerIndex: 0,
      },
    ],
  },
  {
    id: 'SSM-014',
    title: 'Munca cu Ecrane de Vizualizare',
    description: 'Ergonomie pentru utilizatori de calculatoare',
    applicableSectors: ['birouri', 'IT', 'servicii'],
    duration: 60,
    frequency: 'anual',
    content: [
      'Amenajarea postului de lucru: masă, scaun, ecran',
      'Distanță ecran-ochi: 50-70 cm',
      'Înălțimea ecranului: partea superioară la nivelul ochilor',
      'Poziția corectă a corpului: picioare sprijinite, coate 90°',
      'Regula 20-20-20: pauze vizuale',
      'Probleme asociate: sindrom tunel carpian, dureri cervicale',
    ],
    testQuestions: [
      {
        question: 'Distanța optimă ecran-ochi este:',
        answers: ['20-30 cm', '50-70 cm', '80-100 cm', '120 cm'],
        correctAnswerIndex: 1,
      },
      {
        question: 'Regula 20-20-20 înseamnă:',
        answers: [
          'La 20 min privești 20 m distanță 20 sec',
          'Lucrezi 20 ore pe săptămână',
          'Îți faci pauză 20 min la 20 ore',
          'Clipești de 20 ori pe minut',
        ],
        correctAnswerIndex: 0,
      },
      {
        question: 'Scaunul de birou trebuie să fie:',
        answers: [
          'Fix',
          'Reglabil în înălțime și înclinare',
          'Fără spătar',
          'Tare',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-015',
    title: 'Stresul Ocupațional și Sănătatea Mentală',
    description: 'Gestionarea stresului la locul de muncă',
    applicableSectors: ['toate'],
    duration: 60,
    frequency: 'anual',
    content: [
      'Definiția stresului ocupațional',
      'Factori de stres: volum mare muncă, termenă limită, conflict',
      'Efecte: epuizare, burnout, anxietate',
      'Recunoașterea simptomelor',
      'Tehnici de gestionare: prioritizare, pauze, comunicare',
      'Rolul angajatorului în prevenție',
    ],
    testQuestions: [
      {
        question: 'Burnout-ul se caracterizează prin:',
        answers: [
          'Energie crescută',
          'Epuizare emoțională și fizică',
          'Entuziasm',
          'Productivitate mare',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'O măsură de reducere a stresului este:',
        answers: [
          'Creșterea sarcinilor',
          'Eliminarea pauzelor',
          'Comunicare deschisă și suport',
          'Izolare',
        ],
        correctAnswerIndex: 2,
      },
      {
        question: 'Angajatorul are obligația să:',
        answers: [
          'Ignore stresul',
          'Evalueze și reducă riscurile psihosociale',
          'Concedieze angajații stresați',
          'Crească presiunea',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-016',
    title: 'Hărțuire și Discriminare la Locul de Muncă',
    description: 'Prevenirea hărțuirii morale și sexuale',
    applicableSectors: ['toate'],
    duration: 60,
    frequency: 'anual',
    content: [
      'Definiții: hărțuire morală (mobbing), hărțuire sexuală',
      'Forme de discriminare: sex, vârstă, etnie, religie',
      'Legislație: Legea 202/2002',
      'Efecte asupra victimelor',
      'Proceduri de raportare și investigare',
      'Sancțiuni și măsuri corective',
    ],
    testQuestions: [
      {
        question: 'Hărțuirea morală (mobbing) constă în:',
        answers: [
          'Critică constructivă',
          'Comportament abuziv repetat',
          'Evaluare performanță',
          'Delegare sarcini',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Victima hărțuirii poate:',
        answers: [
          'Raporta cazul angajatorului sau ITM',
          'Nu are ce face',
          'Trebuie să accepte',
          'Să demisioneze obligatoriu',
        ],
        correctAnswerIndex: 0,
      },
      {
        question: 'Discriminarea la angajare pe criterii de vârstă este:',
        answers: [
          'Legală',
          'Interzisă',
          'Normală',
          'Recomandată',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-017',
    title: 'Munca în Spații Confinate',
    description: 'Siguranță în rezervoare, fose, tuneluri',
    applicableSectors: ['industrie', 'construcții', 'utilități'],
    duration: 90,
    frequency: 'anual',
    content: [
      'Definiția spațiului confinat',
      'Riscuri: asfixiere, intoxicare, explozie',
      'Măsurarea atmosferei: O2, gaze toxice, explozive',
      'Permis de lucru obligatoriu',
      'Ventilație forțată',
      'Echipament de respirație, salvare, comunicare',
    ],
    testQuestions: [
      {
        question: 'Un spațiu confinat este definit ca:',
        answers: [
          'Orice spațiu mic',
          'Spațiu cu ventilație limitată și acces restrâns',
          'Doar rezervoare',
          'Birouri mici',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Înainte de intrare, se verifică:',
        answers: [
          'Doar temperatura',
          'Concentrația O2, gaze toxice/explozive',
          'Culoarea pereților',
          'Nimic',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'În spații confinate, se lucrează:',
        answers: [
          'Singur',
          'Cu permis de lucru și supraveghere externă',
          'Fără echipament',
          'Noaptea',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-018',
    title: 'Conducerea Autovehiculelor de Serviciu',
    description: 'Securitate rutieră pentru angajați',
    applicableSectors: ['transport', 'logistică', 'servicii'],
    duration: 60,
    frequency: 'anual',
    content: [
      'Obligații legale: permis de conducere valabil, ITP',
      'Verificarea tehnică a vehiculului înainte de plecare',
      'Conduita preventivă',
      'Riscuri: oboseală, viteză, alcool',
      'Utilizarea centurii de siguranță',
      'Proceduri în caz de accident',
    ],
    testQuestions: [
      {
        question: 'Înainte de a pleca cu vehiculul, șoferul verifică:',
        answers: [
          'Numai radioul',
          'Anvelope, frâne, luminile, nivele ulei/apă',
          'Culoarea',
          'Nimic',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Conducerea sub influența alcoolului este:',
        answers: [
          'Permisă sub 0.5 g/l',
          'Interzisă (toleranță zero în România)',
          'Normală',
          'La latitudinea șoferului',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'În caz de accident rutier, șoferul trebuie să:',
        answers: [
          'Fugă de la locul faptei',
          'Anunțe 112, asigure locul, acorde prim ajutor',
          'Mute vehiculul acasă',
          'Nu raporteze',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-019',
    title: 'Utilizarea Scărilor și Platformelor',
    description: 'Siguranță în utilizarea scărilor portabile',
    applicableSectors: ['toate'],
    duration: 45,
    frequency: 'anual',
    content: [
      'Tipuri de scări: simple, duble, transformabile',
      'Verificări înainte de utilizare: trepte, fixări',
      'Așezarea corectă: unghi 75°, bază stabilă',
      'Interzicerea utilizării scărilor deteriorate',
      'Lucrul pe scară: maxim o persoană, nu te întinde',
      'Alternative: platforme mobile, schele',
    ],
    testQuestions: [
      {
        question: 'Unghiul corect de așezare a scării față de sol este:',
        answers: ['45°', '60°', '75°', '90°'],
        correctAnswerIndex: 2,
      },
      {
        question: 'Pe o scară portabilă pot lucra simultan:',
        answers: ['Una persoană', 'Două persoane', 'Trei persoane', 'Oricâte'],
        correctAnswerIndex: 0,
      },
      {
        question: 'O scară cu trepte deteriorate trebuie:',
        answers: [
          'Reparată sau scoasă din uz',
          'Folosită cu grijă',
          'Vopsită',
          'Folosită normal',
        ],
        correctAnswerIndex: 0,
      },
    ],
  },
  {
    id: 'SSM-020',
    title: 'Securitatea în Depozite și Magazine',
    description: 'Manipulare, stocare, circulație în depozite',
    applicableSectors: ['logistică', 'comerț', 'industrie'],
    duration: 60,
    frequency: 'anual',
    content: [
      'Organizarea depozitului: separare categorii, trasee',
      'Stivuirea corectă: greutate, înălțime, stabilitate',
      'Utilizarea rafturilor metalice: verificare, încărcare',
      'Circulația stivuitoarelor: segregare pietoni/utilaje',
      'Semnalizare: culoare, limite viteză, zone periculoase',
      'Prevenirea căderilor de obiecte',
    ],
    testQuestions: [
      {
        question: 'Traseele pietonilor și stivuitoarelor trebuie:',
        answers: [
          'Comune',
          'Separate și marcate vizibil',
          'Aleatorii',
          'Nu contează',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Rafturile metalice se verifică:',
        answers: [
          'O dată pe an',
          'Periodic și după impact/deteriorare',
          'Niciodată',
          'La 10 ani',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Stivuirea paletelor se face:',
        answers: [
          'Cât de sus se poate',
          'Conform limitelor de înălțime și greutate',
          'Haotic',
          'Fără verificare stabilitate',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-021',
    title: 'Securitatea în Industria Alimentară',
    description: 'Igienă, HACCP, riscuri specifice alimentație',
    applicableSectors: ['alimentație', 'HoReCa'],
    duration: 90,
    frequency: 'semestrial',
    content: [
      'Principii HACCP (Hazard Analysis Critical Control Points)',
      'Igiena personală și vestimentație',
      'Contaminare: chimică, fizică, biologică',
      'Temperaturi de depozitare și preparare',
      'Curățare și dezinfecție',
      'Riscuri specifice: tăieturi, arsuri, alunecare',
    ],
    testQuestions: [
      {
        question: 'HACCP este un sistem de:',
        answers: [
          'Marketing',
          'Analiză riscuri și control puncte critice',
          'Vânzări',
          'Contabilitate',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Alimentele perisabile se păstrează la:',
        answers: [
          'Temperatura camerei',
          'Temperaturi controlate (rece ≤4°C sau cald ≥63°C)',
          'Soare',
          'Oriunde',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Mâinile se spală:',
        answers: [
          'Dimineața',
          'Înainte de lucru, după pauze, după toaletă',
          'O dată pe zi',
          'Niciodată',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-022',
    title: 'Munca în Mediu Rece sau Cald',
    description: 'Protecție la temperaturi extreme',
    applicableSectors: ['construcții', 'industrie', 'agricultură'],
    duration: 60,
    frequency: 'anual',
    content: [
      'Efecte temperaturi scăzute: degerături, hipotermie',
      'Efecte temperaturi ridicate: insolație, deshidratare',
      'Echipament de protecție termic',
      'Hidratare adecvată',
      'Regim de muncă-odihnă adaptat',
      'Recunoașterea simptomelor și prim ajutor',
    ],
    testQuestions: [
      {
        question: 'În mediu cald, angajatul trebuie să:',
        answers: [
          'Bea puțină apă',
          'Bea apă frecvent, fără să aștepte setea',
          'Bea doar cafea',
          'Nu bea nimic',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Hipotermia apare când temperatura corpului scade sub:',
        answers: ['37°C', '36°C', '35°C', '30°C'],
        correctAnswerIndex: 2,
      },
      {
        question: 'În mediu rece, echipamentul trebuie să fie:',
        answers: [
          'Strâmt',
          'Stratificat, respirant, impermeabil',
          'De bumbac subțire',
          'Nu contează',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-023',
    title: 'Raportarea și Investigarea Accidentelor',
    description: 'Proceduri de raportare și cercetare evenimente',
    applicableSectors: ['toate'],
    duration: 60,
    frequency: 'anual',
    content: [
      'Definiții: accident de muncă, incident, boală profesională',
      'Obligația raportării: ITM, asigurător',
      'Termene de raportare: 24 ore pentru accidente grave',
      'Comisia de cercetare a accidentelor',
      'Metode de investigare: 5 Why, Fishbone',
      'Măsuri corective și preventive',
    ],
    testQuestions: [
      {
        question: 'Accidentul de muncă se raportează la ITM în termen de:',
        answers: ['24 ore', '48 ore', '3 zile', '1 săptămână'],
        correctAnswerIndex: 0,
      },
      {
        question: 'Scopul cercetării accidentului este:',
        answers: [
          'Găsirea vinovatului',
          'Identificarea cauzelor și prevenirea repetării',
          'Pedeapsă',
          'Ascunderea',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Un incident este:',
        answers: [
          'Un accident cu victime',
          'Eveniment fără consecințe, dar cu potențial',
          'O boală',
          'Un concediu',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-024',
    title: 'Semnalizarea de Securitate',
    description: 'Panouri, culori, semnale acustice',
    applicableSectors: ['toate'],
    duration: 45,
    frequency: 'anual',
    content: [
      'Tipuri: interzicere, avertizare, obligare, salvare, stingere',
      'Forme și culori: roșu (interzicere), galben (avertizare), albastru (obligare), verde (evacuare)',
      'Amplasare corectă: vizibilitate, înălțime',
      'Semnale acustice și luminoase',
      'Menținerea curățeniei și vizibilității',
      'Legislație: HG 971/2006',
    ],
    testQuestions: [
      {
        question: 'Culoarea roșie în semnalizare indică:',
        answers: [
          'Obligare',
          'Interzicere sau pericol',
          'Salvare',
          'Informare',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Panourile verzi arată:',
        answers: [
          'Pericol',
          'Căi de evacuare, ieșiri urgență, echipament prim ajutor',
          'Interzicere',
          'Obligare',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Forma rotundă cu bandă diagonală roșie înseamnă:',
        answers: [
          'Obligare',
          'Interzicere',
          'Avertizare',
          'Salvare',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-025',
    title: 'Securitatea în Construcții',
    description: 'Riscuri și măsuri specifice șantierelor',
    applicableSectors: ['construcții'],
    duration: 120,
    frequency: 'anual',
    content: [
      'Planul de securitate și sănătate (PSS)',
      'Coordonator SSM în faza de proiectare și execuție',
      'Riscuri: cădere, prăbușire, electrocutare, vehicule',
      'Delimitarea și semnalizarea șantierului',
      'Schelă, cofraje, excavații',
      'Autorizări și verificări echipamente',
    ],
    testQuestions: [
      {
        question: 'PSS (Planul de Securitate și Sănătate) este obligatoriu:',
        answers: [
          'Doar pentru construcții mari',
          'Pentru toate șantierele temporare sau mobile',
          'Opțional',
          'Niciodată',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Coordonatorul SSM este desemnat de către:',
        answers: [
          'Muncitori',
          'Beneficiarul investiției',
          'ITM',
          'Arhitect',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Excavațiile peste 1,25m adâncime necesită:',
        answers: [
          'Nimic special',
          'Sprijinire sau taluzare, scări acces',
          'Doar semnalizare',
          'Umplere imediată',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-026',
    title: 'Radiații și Câmpuri Electromagnetice',
    description: 'Protecție la radiații ionizante și neionizante',
    applicableSectors: ['sănătate', 'industrie', 'cercetare'],
    duration: 90,
    frequency: 'anual',
    content: [
      'Tipuri: radiații ionizante (X, gamma) și neionizante (UV, IR, RF)',
      'Efecte biologice: arsuri, cancer, cataractă',
      'Limite de expunere',
      'Măsuri de protecție: ecranare, distanță, timp limitat',
      'Echipament: șorțuri plumbate, dozimetre',
      'Autorizare CNCAN pentru radiații ionizante',
    ],
    testQuestions: [
      {
        question: 'Radiațiile ionizante includ:',
        answers: [
          'Lumina vizibilă',
          'Raze X și gamma',
          'Unde radio',
          'Infra-roșu',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Principalele metode de protecție la radiații sunt:',
        answers: [
          'Timp, distanță, ecranare',
          'Doar ecranare',
          'Nu există',
          'Vitamine',
        ],
        correctAnswerIndex: 0,
      },
      {
        question: 'Dozimetrul personalizat măsoară:',
        answers: [
          'Temperatura',
          'Doza de radiație primită',
          'Umiditatea',
          'Zgomotul',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-027',
    title: 'Munca Izolată și Solitară',
    description: 'Securitate pentru lucrători izolați',
    applicableSectors: ['pază', 'întreținere', 'transport'],
    duration: 60,
    frequency: 'anual',
    content: [
      'Definiția muncii izolate',
      'Riscuri suplimentare: imposibilitate asistență imediată',
      'Evaluarea riscurilor specifice',
      'Sisteme de alertă și comunicare',
      'Proceduri de verificare periodică',
      'Instrucțiuni clare și pregătire pentru urgențe',
    ],
    testQuestions: [
      {
        question: 'Munca izolată înseamnă:',
        answers: [
          'Muncă la distanță de colegi, fără supraveghere directă',
          'Muncă de noapte',
          'Muncă în echipă',
          'Muncă part-time',
        ],
        correctAnswerIndex: 0,
      },
      {
        question: 'Pentru muncitori izolați, angajatorul asigură:',
        answers: [
          'Nimic special',
          'Mijloace de comunicare și proceduri de verificare',
          'Salarii mai mari',
          'Program mai scurt',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'În caz de urgență, lucrătorul izolat trebuie:',
        answers: [
          'Să aștepte',
          'Să aibă acces la mijloace de alertare 112',
          'Să rezolve singur',
          'Să fugă',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-028',
    title: 'Securitatea Alimentării cu Gaze',
    description: 'Instalații gaze naturale, GPL, riscuri',
    applicableSectors: ['HoReCa', 'industrie', 'servicii'],
    duration: 60,
    frequency: 'anual',
    content: [
      'Tipuri de gaze: naturale, GPL (butan, propan)',
      'Riscuri: explozie, incendiu, intoxicare',
      'Instalații: verificare, autorizare ANRE',
      'Detectare scurgeri: miros (odorizant), detectoare',
      'Ventilație obligatorie',
      'Proceduri în caz de scurgere: închide sursa, ventilează, evacuează, nu aprinde',
    ],
    testQuestions: [
      {
        question: 'În caz de miros de gaz, NU trebuie să:',
        answers: [
          'Deschizi ferestrele',
          'Închizi robinetul',
          'Apeși întrerupătoare electrice',
          'Evacuezi zona',
        ],
        correctAnswerIndex: 2,
      },
      {
        question: 'Instalațiile de gaze trebuie verificate:',
        answers: [
          'Niciodată',
          'Periodic de personal autorizat',
          'De oricine',
          'La 20 ani',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'GPL se stochează în:',
        answers: [
          'Recipienți sub presiune verificați',
          'Sticle de plastic',
          'Găleți',
          'Orice recipient',
        ],
        correctAnswerIndex: 0,
      },
    ],
  },
  {
    id: 'SSM-029',
    title: 'Prevenirea Violenței la Locul de Muncă',
    description: 'Agresiune, jaf, conflict cu clienți',
    applicableSectors: ['retail', 'sănătate', 'servicii publice', 'transport'],
    duration: 60,
    frequency: 'anual',
    content: [
      'Forme de violență: verbală, fizică, psihologică',
      'Factori de risc: lucru cu public, bani, izolare, noapte',
      'Măsuri de prevenție: amenajare spațiu, iluminat, camere, proceduri',
      'Instruire în comunicare și dezamorsare conflict',
      'Proceduri de alertare și intervenție',
      'Suport post-incident pentru victime',
    ],
    testQuestions: [
      {
        question: 'Violența la locul de muncă include:',
        answers: [
          'Doar agresiune fizică',
          'Agresiune fizică, amenințări, jigniri, hărțuire',
          'Doar conflictul normal',
          'Nu există',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Măsură de prevenire a violenței în retail:',
        answers: [
          'Reducerea personalului',
          'Camere supraveghere, alarme, proceduri jaf',
          'Eliminarea pazei',
          'Ascunderea numerelor urgență',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'După un incident violent, angajatorul oferă:',
        answers: [
          'Concediere',
          'Suport psihologic și medical',
          'Pedeapsă',
          'Nimic',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'SSM-030',
    title: 'Revizuirea și Actualizarea Cunoștințelor SSM',
    description: 'Sinteză și noutăți legislative',
    applicableSectors: ['toate'],
    duration: 90,
    frequency: 'anual',
    content: [
      'Recapitulare principii SSM',
      'Noutăți legislative și normative',
      'Analiză accidente și incidente din perioadă',
      'Lecții învățate și bune practici',
      'Îmbunătățiri continue în organizație',
      'Feedback și întrebări angajați',
    ],
    testQuestions: [
      {
        question: 'Instruirea SSM este o obligație:',
        answers: [
          'Doar a angajatului',
          'A angajatorului, periodică și documentată',
          'Opțională',
          'Nu există',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'Cultura securității înseamnă:',
        answers: [
          'Doar respectarea regulilor',
          'Implicare proactivă, raportare, îmbunătățire continuă',
          'Ignorarea riscurilor',
          'Doar protecția șefului',
        ],
        correctAnswerIndex: 1,
      },
      {
        question: 'ITM (Inspecția Muncii) poate:',
        answers: [
          'Doar sfătui',
          'Verifica, sancționa, suspenda activitatea',
          'Nu are atribuții',
          'Doar încasa taxe',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
];

export default tematiciInstruire;
