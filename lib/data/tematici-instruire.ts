/**
 * Tematici de instruire periodică SSM obligatorii
 * 12 tematici pentru instruirea lunară/periodică conform legislației SSM din România
 */

export interface EvaluationQuestion {
  question: string;
  answers: string[];
  correctAnswer: number; // index-ul răspunsului corect (0-based)
}

export interface InstruirePeriodicaTopic {
  id: string;
  month: string;
  topic: string;
  duration_min: number;
  legalBasis: string;
  targetAudience: string;
  keyPoints: string[];
  evaluationQuestions: EvaluationQuestion[];
}

export const tematiciInstruirePeriodicaSSM: InstruirePeriodicaTopic[] = [
  {
    id: 'ssm-01-ianuarie',
    month: 'ianuarie',
    topic: 'Normele generale de securitate și sănătate în muncă',
    duration_min: 45,
    legalBasis: 'Legea 319/2006, HG 1425/2006',
    targetAudience: 'Toți angajații',
    keyPoints: [
      'Drepturile și obligațiile angajatorului în domeniul SSM',
      'Drepturile și obligațiile angajaților în domeniul SSM',
      'Organizarea activității de SSM în unitate',
      'Rolul comitetului de securitate și sănătate în muncă',
      'Consecințele nerespectării normelor de SSM',
    ],
    evaluationQuestions: [
      {
        question: 'Care este principala legislație în domeniul SSM din România?',
        answers: [
          'Legea 53/2003 - Codul Muncii',
          'Legea 319/2006 privind securitatea și sănătatea în muncă',
          'Legea 307/2006 privind apărarea împotriva incendiilor',
          'HG 955/2010',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Cine răspunde în primul rând pentru asigurarea condițiilor de SSM?',
        answers: [
          'Angajatul',
          'Comitetul de SSM',
          'Angajatorul',
          'Inspectoratul de Muncă',
        ],
        correctAnswer: 2,
      },
      {
        question: 'Care este una dintre obligațiile angajatului în domeniul SSM?',
        answers: [
          'Să întocmească planul de prevenire și protecție',
          'Să desemneze lucrători cu atribuții în domeniul SSM',
          'Să utilizeze corect echipamentul individual de protecție',
          'Să organizeze cursuri de instruire',
        ],
        correctAnswer: 2,
      },
      {
        question: 'Comitetul de securitate și sănătate în muncă se organizează la angajatori cu cel puțin:',
        answers: [
          '20 de angajați',
          '30 de angajați',
          '50 de angajați',
          '100 de angajați',
        ],
        correctAnswer: 2,
      },
      {
        question: 'Nerespectarea normelor de SSM poate duce la:',
        answers: [
          'Avertisment verbal',
          'Sancțiuni contravenționale sau penale',
          'Reducerea salariului',
          'Promovare amânată',
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'ssm-02-februarie',
    month: 'februarie',
    topic: 'Riscurile specifice locului de muncă și măsurile de prevenire',
    duration_min: 60,
    legalBasis: 'Legea 319/2006, art. 16-17, HG 1425/2006',
    targetAudience: 'Toți angajații',
    keyPoints: [
      'Identificarea și evaluarea riscurilor la locul de muncă',
      'Riscuri mecanice, electrice, chimice, biologice',
      'Măsuri tehnice și organizatorice de prevenire',
      'Semnalizarea de securitate',
      'Documentul de evaluare a riscurilor',
    ],
    evaluationQuestions: [
      {
        question: 'Ce reprezintă evaluarea riscurilor?',
        answers: [
          'O procedură de control a angajaților',
          'Procesul de identificare și analiză a pericolelor pentru stabilirea măsurilor de prevenire',
          'O metodă de măsurare a productivității',
          'Un document de asigurare',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Riscurile mecanice pot include:',
        answers: [
          'Expunerea la zgomot',
          'Contactul cu substanțe chimice',
          'Lovirea, tăierea, prinderea',
          'Stresul termic',
        ],
        correctAnswer: 2,
      },
      {
        question: 'Semnalul de securitate de culoare roșie indică:',
        answers: [
          'Obligație',
          'Avertizare',
          'Interzicere sau echipament de stingere',
          'Salvare sau ajutor',
        ],
        correctAnswer: 2,
      },
      {
        question: 'Documentul de evaluare a riscurilor trebuie:',
        answers: [
          'Reînnoit anual obligatoriu',
          'Actualizat ori de câte ori intervin modificări ale procesului de muncă',
          'Completat doar de angajați',
          'Păstrat acasă de către angajator',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Măsurile de prevenire și protecție se stabilesc:',
        answers: [
          'În funcție de bugetul disponibil',
          'În ordinea: eliminare, înlocuire, măsuri tehnice/organizatorice, EIP',
          'Doar prin utilizarea de echipamente de protecție',
          'De către fiecare angajat individual',
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'ssm-03-martie',
    month: 'martie',
    topic: 'Echipamentele individuale de protecție (EIP)',
    duration_min: 45,
    legalBasis: 'HG 1048/2006',
    targetAudience: 'Angajați expuși la riscuri care necesită EIP',
    keyPoints: [
      'Categorii de echipamente individuale de protecție',
      'Criterii de selecție a EIP în funcție de riscuri',
      'Responsabilitatea angajatorului și angajatului privind EIP',
      'Utilizarea, întreținerea și depozitarea corectă',
      'Verificarea și înlocuirea EIP',
    ],
    evaluationQuestions: [
      {
        question: 'EIP trebuie furnizat:',
        answers: [
          'Doar la cererea angajatului',
          'Gratuit de către angajator',
          'Cu plata de către angajat a 50% din cost',
          'Doar pentru lucrările periculoase',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Angajatul are obligația să:',
        answers: [
          'Repare singur EIP defect',
          'Împrumute EIP altor colegi',
          'Utilizeze EIP conform instrucțiunilor primite',
          'Aleagă modelul preferat de EIP',
        ],
        correctAnswer: 2,
      },
      {
        question: 'Casca de protecție se poartă obligatoriu:',
        answers: [
          'Doar la înălțime',
          'În șantiere și zone cu risc de cădere de obiecte',
          'Doar când temperaturile sunt scăzute',
          'Doar de către șefi de șantier',
        ],
        correctAnswer: 1,
      },
      {
        question: 'EIP deteriorat trebuie:',
        answers: [
          'Reparat de către angajat acasă',
          'Folosit până la epuizare',
          'Înlocuit imediat de către angajator',
          'Utilizat doar în situații de urgență',
        ],
        correctAnswer: 2,
      },
      {
        question: 'Mănușile de protecție se aleg în funcție de:',
        answers: [
          'Mărimea mâinii și culoarea preferată',
          'Tipul de risc (mecanic, chimic, termic)',
          'Prețul cel mai mic',
          'Marca producătorului',
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'ssm-04-aprilie',
    month: 'aprilie',
    topic: 'Prevenirea și stingerea incendiilor la locul de muncă',
    duration_min: 60,
    legalBasis: 'Legea 307/2006, Ordinul MAI 163/2007',
    targetAudience: 'Toți angajații',
    keyPoints: [
      'Cauzele principale ale incendiilor',
      'Clasificarea incendiilor și agenții de stingere',
      'Utilizarea stingătoarelor și hidranților',
      'Planul de evacuare și căile de evacuare',
      'Comportament în caz de incendiu',
    ],
    evaluationQuestions: [
      {
        question: 'Clasa de incendiu A se referă la:',
        answers: [
          'Lichide inflamabile',
          'Materiale solide (lemn, hârtie, textile)',
          'Gaze',
          'Metale',
        ],
        correctAnswer: 1,
      },
      {
        question: 'În caz de incendiu, prima acțiune este:',
        answers: [
          'Să salvezi bunurile personale',
          'Să anunți imediat și să evachuezi',
          'Să cauți cauza incendiului',
          'Să aștepți instrucțiuni',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Stingătorul cu pulbere ABC poate fi folosit pentru:',
        answers: [
          'Doar incendii de hârtie',
          'Doar incendii electrice',
          'Incendii de materiale solide, lichide și instalații electrice',
          'Doar incendii de metale',
        ],
        correctAnswer: 2,
      },
      {
        question: 'Căile de evacuare trebuie:',
        answers: [
          'Utilizate pentru depozitare temporară',
          'Menținute libere și semnalizate permanent',
          'Încuiate pentru securitate',
          'Iluminate doar în timpul zilei',
        ],
        correctAnswer: 1,
      },
      {
        question: 'În caz de incendiu, liftul:',
        answers: [
          'Este cel mai sigur mod de evacuare',
          'Poate fi folosit doar de către șefi',
          'Nu trebuie folosit niciodată',
          'Se folosește doar dacă scările sunt blocate',
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 'ssm-05-mai',
    month: 'mai',
    topic: 'Acordarea primului ajutor în caz de accident de muncă',
    duration_min: 90,
    legalBasis: 'Legea 319/2006, HG 1425/2006, art. 23',
    targetAudience: 'Toți angajații, obligatoriu pentru lucrători desemnați',
    keyPoints: [
      'Principiile de bază ale primului ajutor',
      'Evaluarea victimei și apelarea serviciilor de urgență',
      'Tehnici de resuscitare cardio-pulmonară (RCP)',
      'Tratarea hemoragiilor, fracturilor, arsurilor',
      'Conținutul truselor de prim ajutor',
    ],
    evaluationQuestions: [
      {
        question: 'Numărul de urgență în România este:',
        answers: [
          '112',
          '911',
          '999',
          '113',
        ],
        correctAnswer: 0,
      },
      {
        question: 'La evaluarea unei victime inconștiente, primul lucru verificat este:',
        answers: [
          'Pulsul',
          'Respirația',
          'Reacția (conștiența)',
          'Temperatura',
        ],
        correctAnswer: 2,
      },
      {
        question: 'Poziția laterală de siguranță se folosește pentru:',
        answers: [
          'Victime inconștiente care respiră',
          'Victime în stop cardiac',
          'Victime cu fracturi',
          'Victime conștiente',
        ],
        correctAnswer: 0,
      },
      {
        question: 'O hemoragie arterială se caracterizează prin:',
        answers: [
          'Sânge închis la culoare, curgere lentă',
          'Sânge roșu aprins, țâșnire ritmică',
          'Sânge pe suprafață, curgere foarte lentă',
          'Sânge în interiorul țesuturilor',
        ],
        correctAnswer: 1,
      },
      {
        question: 'În caz de arsură termică, prima măsură este:',
        answers: [
          'Aplicarea de gheață direct pe arsură',
          'Aplicarea de ulei sau pastă de dinți',
          'Răcirea cu apă curentă timp de 10-20 minute',
          'Perforarea veziculelor formate',
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 'ssm-06-iunie',
    month: 'iunie',
    topic: 'Munca în condiții de temperatură ridicată și protecția împotriva stresului termic',
    duration_min: 45,
    legalBasis: 'HG 1091/2006, Directiva 89/654/CEE',
    targetAudience: 'Angajați care lucrează în exterior sau în medii cu temperaturi ridicate',
    keyPoints: [
      'Efectele stresului termic asupra organismului',
      'Recunoașterea semnelor de deshidratare și insolație',
      'Măsuri de prevenire: hidratare, pauze, echipament adecvat',
      'Organizarea programului de lucru pe timp de caniculă',
      'Primul ajutor în caz de epuizare termică',
    ],
    evaluationQuestions: [
      {
        question: 'Stresul termic poate duce la:',
        answers: [
          'Creșterea productivității',
          'Deshidratare, epuizare, insolație',
          'Îmbunătățirea concentrării',
          'Reducerea oboselii',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Pentru prevenirea deshidratării, angajații trebuie:',
        answers: [
          'Să consume lichide doar la sfârșitul programului',
          'Să bea multă cafea',
          'Să consume frecvent apă, chiar dacă nu simt sete',
          'Să evite consumul de lichide în timpul lucrului',
        ],
        correctAnswer: 2,
      },
      {
        question: 'Pe timp de caniculă, programul de lucru ar trebui:',
        answers: [
          'Prelungit cu 2 ore',
          'Menținut identic',
          'Adaptat cu evitarea orelor cu căldură maximă (12-16)',
          'Mutat complet în timpul nopții',
        ],
        correctAnswer: 2,
      },
      {
        question: 'Simptomele insolației includ:',
        answers: [
          'Piele rece și umedă',
          'Temperatură corporală foarte crescută, confuzie, pierderea conștiinței',
          'Foame intensă',
          'Tensiune arterială crescută',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Pentru protecție împotriva soarelui, angajații ar trebui:',
        answers: [
          'Să poarte haine înghesuite de culoare închisă',
          'Să evite complet purtarea de accesorii',
          'Să poarte haine ușoare, de culoare deschisă, pălărie/cască cu boruri',
          'Să lucreze descoperit pentru răcorire',
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 'ssm-07-iulie',
    month: 'iulie',
    topic: 'Securitatea în utilizarea uneltelor și echipamentelor de muncă',
    duration_min: 60,
    legalBasis: 'HG 1146/2006, Directiva 2009/104/CE',
    targetAudience: 'Angajați care utilizează unelte manuale și electrice',
    keyPoints: [
      'Verificarea stării tehnice a uneltelor',
      'Utilizarea corectă a uneltelor manuale și electrice',
      'Riscuri specifice: electrocutare, tăiere, lovire',
      'Întreținerea și depozitarea echipamentelor',
      'Autorizarea pentru utilizarea echipamentelor periculoase',
    ],
    evaluationQuestions: [
      {
        question: 'Înainte de utilizare, uneltele trebuie:',
        answers: [
          'Folosite direct fără verificare',
          'Verificate pentru defecțiuni vizibile',
          'Împrumutate colegilor',
          'Depozitate imediat',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Uneltele electrice deteriorate trebuie:',
        answers: [
          'Utilizate cu atenție maximă',
          'Reparate de orice angajat',
          'Scoase din uz și reparate doar de personal autorizat',
          'Folosite doar pentru lucrări ușoare',
        ],
        correctAnswer: 2,
      },
      {
        question: 'La utilizarea uneltelor electrice, se interzice:',
        answers: [
          'Purtarea mănușilor de protecție',
          'Lucrul în zone umede fără protecție adecvată',
          'Verificarea periodică',
          'Utilizarea în echipă',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Uneltele manual-mecanice (flex, polizor) pot fi operate:',
        answers: [
          'De orice angajat',
          'Doar de personal instruit și autorizat',
          'Doar de către șefi',
          'Doar în prezența unui supervizor',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Depozitarea uneltelor se face:',
        answers: [
          'Oriunde, pentru acces rapid',
          'Pe sol, în zone de trecere',
          'În locuri special amenajate, ordonate',
          'În cutii neidentificate',
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 'ssm-08-august',
    month: 'august',
    topic: 'Munca la înălțime și prevenirea căderilor',
    duration_min: 90,
    legalBasis: 'HG 300/2006, Ordinul 508/2002',
    targetAudience: 'Angajați care lucrează la înălțime (peste 2m)',
    keyPoints: [
      'Definiția legală a muncii la înălțime',
      'Echipamente de protecție împotriva căderilor (ham, cablu viață)',
      'Scări, schele, platforme elevatoare - utilizare sigură',
      'Verificarea și asigurarea zonei de lucru',
      'Autorizare și supraveghere',
    ],
    evaluationQuestions: [
      {
        question: 'Munca la înălțime se consideră de la:',
        answers: [
          '1 metru',
          '2 metri',
          '3 metri',
          '5 metri',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Pentru lucrul la înălțime, este obligatoriu:',
        answers: [
          'Doar experiența prealabilă',
          'Instruirea, autorizarea și utilizarea EIP specific',
          'Supraveghere video',
          'Lucrul în perechi mereu',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Scările portabile trebuie:',
        answers: [
          'Susținute de un coleg la bază',
          'Fixate sau asigurate împotriva alunecării',
          'Folosite doar pentru urcări scurte',
          'Păstrate în poziție orizontală când nu sunt folosite',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Hamul de siguranță trebuie:',
        answers: [
          'Purtat liber, fără fixare',
          'Conectat la un punct de ancorare rezistent',
          'Utilizat doar peste 10 metri',
          'Împrumutat între angajați',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Zona de lucru la înălțime trebuie:',
        answers: [
          'Accesibilă tuturor',
          'Delimitată și semnalizată la bază',
          'Lăsată deschisă pentru mobilitate',
          'Marcată doar vizual',
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'ssm-09-septembrie',
    month: 'septembrie',
    topic: 'Ergonomia la locul de muncă și prevenirea tulburărilor musculo-scheletice',
    duration_min: 45,
    legalBasis: 'HG 1028/2006, Directiva 90/270/CEE',
    targetAudience: 'Toți angajații, în special cei cu activități la calculator sau manutenție repetitivă',
    keyPoints: [
      'Principiile ergonomiei la locul de muncă',
      'Amenajarea corectă a postului de lucru cu calculator',
      'Poziții corecte de lucru și pauze active',
      'Riscuri: dureri lombare, tendinite, sindrom de tunel carpian',
      'Manipularea corectă a sarcinilor',
    ],
    evaluationQuestions: [
      {
        question: 'Monitorul calculatorului ar trebui poziționat:',
        answers: [
          'Deasupra nivelului ochilor',
          'La nivelul ochilor sau puțin sub, la distanță de 50-70 cm',
          'Foarte aproape de ochi',
          'În unghi de 45 de grade',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Pentru prevenirea oboselii vizuale, se recomandă:',
        answers: [
          'Lucrul continuu fără pauze',
          'Pauze de 5-10 minute la fiecare oră',
          'Utilizarea luminii foarte intense',
          'Închiderea ochilor în timpul lucrului',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Scaunul de birou ergonomic trebuie să permită:',
        answers: [
          'Doar poziția fixă',
          'Reglarea înălțimii și susținerea lombară',
          'Balansare completă',
          'Rotire la 360 de grade continuu',
        ],
        correctAnswer: 1,
      },
      {
        question: 'La ridicarea unei sarcini grele, este corect să:',
        answers: [
          'Îndoi spatele și ridici cu brațele',
          'Îndoi genunchii, ții spatele drept și ridici cu picioarele',
          'Ridici rapid fără pregătire',
          'Întorci corpul în timpul ridicării',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Tulburările musculo-scheletice pot fi cauzate de:',
        answers: [
          'Poziții vicioase prelungite și mișcări repetitive',
          'Utilizarea echipamentelor moderne',
          'Pauze prea dese',
          'Temperatură ambientală optimă',
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: 'ssm-10-octombrie',
    month: 'octombrie',
    topic: 'Securitatea electrică și prevenirea electrocutării',
    duration_min: 60,
    legalBasis: 'Normativ I7/2011, Legea 319/2006',
    targetAudience: 'Toți angajații, în special cei care utilizează echipamente electrice',
    keyPoints: [
      'Riscurile curentului electric asupra organismului',
      'Reguli de securitate la utilizarea echipamentelor electrice',
      'Recunoașterea instalațiilor defecte',
      'Interzicerea lucrărilor la instalații sub tensiune',
      'Primul ajutor în caz de electrocutare',
    ],
    evaluationQuestions: [
      {
        question: 'Curentul electric este periculos pentru că:',
        answers: [
          'Produce doar arsuri superficiale',
          'Poate cauza stop cardiac, arsuri interne, paralizie respiratorie',
          'Nu afectează organismul uman',
          'Provoacă doar durere temporară',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Înainte de utilizarea unui echipament electric, trebuie verificat:',
        answers: [
          'Doar prețul de achiziție',
          'Starea cablurilor, fișei și carcasei - absența deteriorărilor',
          'Culoarea cablului',
          'Greutatea echipamentului',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Lucrările la instalații electrice sub tensiune:',
        answers: [
          'Pot fi executate de orice angajat',
          'Sunt permise doar cu autorizație și personal calificat',
          'Sunt permise doar noaptea',
          'Nu necesită precauții speciale',
        ],
        correctAnswer: 1,
      },
      {
        question: 'În caz de electrocutare, prima acțiune este:',
        answers: [
          'Atingerea directă a victimei',
          'Întreruperea sursei de curent sau îndepărtarea victimei cu obiecte izolatoare',
          'Turnarea de apă pe victimă',
          'Așteptarea ambulanței fără intervenție',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Apa și curentul electric:',
        answers: [
          'Nu interacționează',
          'Formează un amestec periculos - apa este conductor',
          'Se neutralizează reciproc',
          'Pot fi manipulate împreună fără risc',
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'ssm-11-noiembrie',
    month: 'noiembrie',
    topic: 'Prevenirea accidentelor de circulație în interes de serviciu',
    duration_min: 45,
    legalBasis: 'OUG 195/2002, Legea 319/2006',
    targetAudience: 'Angajați care conduc în interes de serviciu sau utilizează utilaje mobile',
    keyPoints: [
      'Obligații legale pentru conducătorii auto în interes de serviciu',
      'Verificarea zilnică a vehiculului',
      'Conduita preventivă și respectarea normelor de circulație',
      'Riscuri specifice: oboseală, viteză, distragere',
      'Proceduri în caz de accident rutier',
    ],
    evaluationQuestions: [
      {
        question: 'Înainte de deplasarea cu vehiculul de serviciu, șoferul trebuie să:',
        answers: [
          'Pornească imediat motorul',
          'Verifice starea tehnică: anvelope, frâne, lumini, lichide',
          'Verifice doar nivelul de combustibil',
          'Așteapte instrucțiuni de la dispecer',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Oboseala la volan poate fi cauzată de:',
        answers: [
          'Climatizare excesivă',
          'Condus prelungit fără pauze, lipsă de somn',
          'Viteza prea redusă',
          'Pauze prea dese',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Pentru prevenirea accidentelor, se recomandă:',
        answers: [
          'Conducere agresivă pentru eficiență',
          'Utilizarea telefonului în mâini în timpul condusului',
          'Conduită preventivă, anticipare, pauze regulate',
          'Depășirea limitelor de viteza pentru recuperarea timpului',
        ],
        correctAnswer: 2,
      },
      {
        question: 'În caz de accident rutier în interes de serviciu, șoferul trebuie:',
        answers: [
          'Să părăsească locul accidentului imediat',
          'Să asigure zona, să acorde prim ajutor, să anunțe poliția și angajatorul',
          'Să negocieze direct despăgubirile',
          'Să aștepte fără nicio acțiune',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Centura de siguranță:',
        answers: [
          'Este opțională în localități',
          'Trebuie purtată obligatoriu de toți ocupanții',
          'Se poartă doar pe autostradă',
          'Reduce confortul fără beneficii reale',
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'ssm-12-decembrie',
    month: 'decembrie',
    topic: 'Siguranța în sezonul rece și prevenirea accidentelor de muncă pe timp de iarnă',
    duration_min: 45,
    legalBasis: 'Legea 319/2006, HG 1425/2006',
    targetAudience: 'Toți angajații',
    keyPoints: [
      'Riscuri specifice: alunecare, degerături, hipotermie',
      'Echipament de protecție pentru lucrul în frig',
      'Îngrijirea căilor de acces și a locurilor de muncă',
      'Organizarea pauzelor de încălzire',
      'Alimentație și hidratare adecvată',
    ],
    evaluationQuestions: [
      {
        question: 'Pe timp de iarnă, principalul risc de accidentare este:',
        answers: [
          'Deshidratarea',
          'Alunecarea pe suprafețe îngețate sau acoperite cu zăpadă',
          'Insolația',
          'Electrocutarea',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Pentru prevenirea degerăturilor, angajații trebuie:',
        answers: [
          'Să poarte haine ușoară pentru mobilitate',
          'Să poarte haine călduroase, în straturi, mănuși și căciulă',
          'Să consume băuturi alcoolice pentru încălzire',
          'Să evite mișcarea pentru conservarea energiei',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Căile de acces și locurile de muncă în aer liber trebuie:',
        answers: [
          'Lăsate în starea naturală',
          'Curățate de zăpadă, gheață și presărate cu antiderapante',
          'Marcate doar cu panouri',
          'Închise complet pe timpul iernii',
        ],
        correctAnswer: 1,
      },
      {
        question: 'La temperaturi foarte scăzute, programul de lucru ar trebui:',
        answers: [
          'Menținut identic',
          'Adaptat cu pauze de încălzire la intervale regulate',
          'Prelungit pentru recuperarea timpului pierdut',
          'Mutat complet în interior',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Semnele hipotermiei includ:',
        answers: [
          'Transpirație abundentă',
          'Tremur violent, confuzie, slăbiciune extremă',
          'Nervozitate crescută',
          'Senzație de căldură extremă',
        ],
        correctAnswer: 1,
      },
    ],
  },
];
