/**
 * Tematici de instruire periodică SSM
 * Array cu 30 de tematici comune pentru instruirea periodică în domeniul SSM
 */

export interface TestQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index-ul răspunsului corect (0-based)
}

export interface TrainingTopic {
  id: string;
  title: string;
  description: string;
  applicableSectors: string[]; // sectoare de activitate unde se aplică
  duration: number; // durata în minute
  frequency: string; // frecvența instruirii (ex: "lunar", "trimestrial", "anual")
  content: string[]; // array cu punctele cheie de învățat
  testQuestions: TestQuestion[];
}

export const tematiciInstruire: TrainingTopic[] = [
  {
    id: "ssm-001",
    title: "Utilizarea echipamentelor de protecție individuală (EPI)",
    description: "Instruire privind selectarea, utilizarea corectă și întreținerea echipamentelor de protecție individuală conform legislației SSM.",
    applicableSectors: ["Construcții", "Industrie", "Producție", "Logistică", "Agricultură"],
    duration: 60,
    frequency: "trimestrial",
    content: [
      "Tipuri de EPI: căști, mănuși, ochelari, măști, încălțăminte de protecție",
      "Criteriile de selectare a EPI în funcție de riscuri",
      "Modul corect de utilizare și ajustare a EPI",
      "Verificarea stării tehnice a echipamentelor",
      "Curățarea, dezinfectarea și depozitarea EPI",
      "Obligațiile angajatorului și angajatului referitoare la EPI",
      "Sancțiuni pentru nerespectarea normelor de utilizare EPI"
    ],
    testQuestions: [
      {
        question: "Care este responsabilitatea principală a angajatorului în legătură cu EPI?",
        options: [
          "Angajații trebuie să își cumpere propriile EPI",
          "Angajatorul trebuie să furnizeze gratuit EPI adecvate riscurilor",
          "EPI sunt opționale dacă angajații sunt atenți",
          "Angajatorul plătește jumătate din costul EPI"
        ],
        correctAnswer: 1
      },
      {
        question: "Cât de des trebuie verificată starea tehnică a căștii de protecție?",
        options: [
          "O dată pe an",
          "Doar când se observă deteriorări vizibile",
          "Înainte de fiecare utilizare",
          "Nu este necesară verificarea"
        ],
        correctAnswer: 2
      },
      {
        question: "Ce trebuie să faceți dacă observați că EPI-ul dvs. este deteriorat?",
        options: [
          "Continuați să îl folosiți până la sfârșitul zilei",
          "Încercați să îl reparați singur",
          "Raportați imediat și solicitați înlocuire",
          "Îl aruncați fără să anunțați"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "ssm-002",
    title: "Prevenirea accidentelor de muncă",
    description: "Recunoașterea situațiilor periculoase și măsurile preventive pentru evitarea accidentelor la locul de muncă.",
    applicableSectors: ["Toate sectoarele"],
    duration: 90,
    frequency: "semestrial",
    content: [
      "Definirea și clasificarea accidentelor de muncă",
      "Cauze principale ale accidentelor: tehnică, umană, organizatorică",
      "Identificarea factorilor de risc la locul de muncă",
      "Reguli de comportament sigur în muncă",
      "Proceduri în caz de accident: prim ajutor și raportare",
      "Analiza și investigarea accidentelor",
      "Măsuri preventive și corective"
    ],
    testQuestions: [
      {
        question: "Ce se consideră accident de muncă conform legislației?",
        options: [
          "Doar accidentele cu victime",
          "Orice vătămare produsă în timpul executării obligațiilor de serviciu",
          "Doar accidentele grave",
          "Accidentele care produc incapacitate permanentă"
        ],
        correctAnswer: 1
      },
      {
        question: "Care este primul lucru pe care trebuie să-l faceți dacă asistați la un accident?",
        options: [
          "Să faceți poze pentru dovezi",
          "Să sunați familia victimei",
          "Să acordați prim ajutor și să anunțați conducerea/serviciile de urgență",
          "Să continuați lucrul"
        ],
        correctAnswer: 2
      },
      {
        question: "Cine este responsabil pentru prevenirea accidentelor de muncă?",
        options: [
          "Doar angajatorul",
          "Doar angajatul",
          "Atât angajatorul, cât și angajatul",
          "Inspectoratul de Muncă"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "ssm-003",
    title: "Lucrul la înălțime",
    description: "Măsuri de protecție și proceduri de siguranță pentru lucrările executate la înălțime conform normelor SSM.",
    applicableSectors: ["Construcții", "Instalații", "Mentenanță", "Telecom"],
    duration: 120,
    frequency: "semestrial",
    content: [
      "Definirea lucrului la înălțime (peste 2 metri)",
      "Riscuri specifice: cădere de la înălțime, cădere de obiecte",
      "Echipamente de protecție: centuri, harnașamente, corzi de siguranță",
      "Instalarea și verificarea schelelor și platformelor",
      "Utilizarea scărilor în condiții de siguranță",
      "Sisteme de protecție colectivă: balustrade, plase de siguranță",
      "Permise de lucru pentru activități la înălțime",
      "Proceduri de salvare și evacuare"
    ],
    testQuestions: [
      {
        question: "De la ce înălțime se consideră lucru la înălțime?",
        options: [
          "Peste 1 metru",
          "Peste 2 metri",
          "Peste 3 metri",
          "Peste 5 metri"
        ],
        correctAnswer: 1
      },
      {
        question: "Ce echipament individual este obligatoriu la lucrul la înălțime?",
        options: [
          "Doar cască de protecție",
          "Harnașament complet cu dispozitiv antică­dere",
          "Doar mănuși",
          "Încălțăminte obișnuită"
        ],
        correctAnswer: 1
      },
      {
        question: "Înainte de utilizarea unei scări, ce trebuie verificat?",
        options: [
          "Doar lungimea",
          "Culoarea",
          "Stabilitatea, starea treptelor și a sistemelor de blocare",
          "Nu este nevoie de verificare"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "ssm-004",
    title: "Manipularea substanțelor chimice periculoase",
    description: "Reguli de siguranță pentru manipularea, depozitarea și transportul substanțelor chimice periculoase.",
    applicableSectors: ["Industrie chimică", "Laboratoare", "Producție", "Agricultură", "Curățenie"],
    duration: 90,
    frequency: "semestrial",
    content: [
      "Clasificarea substanțelor chimice: toxice, corozive, inflamabile, explozive",
      "Citirea și interpretarea etichetelor și FDS (Fișa cu Date de Securitate)",
      "Pictogramele de pericol conform CLP",
      "EPI specifice pentru substanțe chimice",
      "Reguli de manipulare și transfer",
      "Depozitarea în siguranță și incompatibilități",
      "Proceduri în caz de scurgeri, vărsări sau expunere",
      "Primul ajutor specific"
    ],
    testQuestions: [
      {
        question: "Ce document conține informații complete despre o substanță chimică?",
        options: [
          "Eticheta produsului",
          "Fișa cu Date de Securitate (FDS)",
          "Factura de achiziție",
          "Instrucțiunile de utilizare generale"
        ],
        correctAnswer: 1
      },
      {
        question: "Ce simbol indică o substanță corozivă?",
        options: [
          "Flacără",
          "Craniu cu oase încrucișate",
          "Probetă care varsă lichid pe mână/metal",
          "Semn de exclamare"
        ],
        correctAnswer: 2
      },
      {
        question: "Ce trebuie făcut în caz de contact al unei substanțe chimice cu pielea?",
        options: [
          "Să așteptați să se usuce",
          "Să clătiți imediat cu apă abundentă timp de cel puțin 15 minute",
          "Să aplicați cremă",
          "Să ștergeți cu un prosop uscat"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-005",
    title: "Prevenirea și stingerea incendiilor (PSI)",
    description: "Măsuri de prevenire a incendiilor, utilizarea mijloacelor de stingere și proceduri de evacuare.",
    applicableSectors: ["Toate sectoarele"],
    duration: 90,
    frequency: "anual",
    content: [
      "Triunghiul focului: combustibil, oxigen, sursă de aprindere",
      "Clasificarea incendiilor: clase A, B, C, D, F",
      "Cauze frecvente de incendiu la locul de muncă",
      "Măsuri preventive: întreținere, ordine și curățenie",
      "Tipuri de stingătoare și utilizarea corectă",
      "Hidranti interiori și exteriori",
      "Căi de evacuare și puncte de adunare",
      "Planuri de evacuare și alarmare",
      "Proceduri în caz de incendiu: anunțare, evacuare, intervenție"
    ],
    testQuestions: [
      {
        question: "Ce clasă de incendiu implică materiale solide (lemn, hârtie, textile)?",
        options: [
          "Clasa A",
          "Clasa B",
          "Clasa C",
          "Clasa D"
        ],
        correctAnswer: 0
      },
      {
        question: "Ce tip de stingător NU trebuie folosit la incendii electrice?",
        options: [
          "Stingător cu CO2",
          "Stingător cu pulbere",
          "Stingător cu apă",
          "Stingător cu spumă rezistentă la alcool"
        ],
        correctAnswer: 2
      },
      {
        question: "În caz de incendiu, ce trebuie să faceți ÎNTÂI?",
        options: [
          "Să încercați să stingeți focul singur",
          "Să salvați bunurile valoroase",
          "Să declanșați alarma și să anunțați pompierii",
          "Să faceți poze"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "ssm-006",
    title: "Ergonomia la locul de muncă",
    description: "Principii de ergonomie pentru prevenirea tulburărilor musculo-scheletice și a oboselii.",
    applicableSectors: ["Birouri", "Producție", "Logistică", "Toate sectoarele"],
    duration: 60,
    frequency: "anual",
    content: [
      "Definirea ergonomiei și importanța acesteia",
      "Postură corectă la birou: scaun, monitor, tastatură",
      "Iluminat adecvat și protecția ochilor",
      "Pauze active și exerciții de relaxare",
      "Manipularea corectă a sarcinilor: tehnici de ridicare",
      "Prevenirea tulburărilor musculo-scheletice (TMS)",
      "Amenajarea locului de muncă ergonomic",
      "Semnale de alarmă: dureri, disconfort, oboseală"
    ],
    testQuestions: [
      {
        question: "Care este înălțimea corectă a monitorului față de privire?",
        options: [
          "Marginea superioară la nivelul sau ușor sub nivelul ochilor",
          "Cât mai sus posibil",
          "La nivelul umerilor",
          "Nu contează"
        ],
        correctAnswer: 0
      },
      {
        question: "Cât de des este recomandat să faceți pauze la lucrul cu calculatorul?",
        options: [
          "O dată pe zi",
          "La 3-4 ore",
          "La fiecare 50-60 minute, pauză de 5-10 minute",
          "Nu sunt necesare pauze"
        ],
        correctAnswer: 2
      },
      {
        question: "Cum trebuie ridicată o sarcină grea de pe podea?",
        options: [
          "Aplecându-vă cu spatele drept și ridicând din genunchi",
          "Aplecându-vă cu picioarele drepte",
          "Cu o singură mână",
          "Cât mai repede posibil"
        ],
        correctAnswer: 0
      }
    ]
  },
  {
    id: "ssm-007",
    title: "Securitate electrică",
    description: "Măsuri de protecție împotriva electrocutării și utilizarea în siguranță a echipamentelor electrice.",
    applicableSectors: ["Toate sectoarele"],
    duration: 90,
    frequency: "anual",
    content: [
      "Riscuri electrice: electrocutare, arsuri, incendii",
      "Efectele curentului electric asupra corpului uman",
      "Reguli de utilizare a aparatelor electrice",
      "Verificarea stării tehnice: prize, cabluri, aparate",
      "Protecție prin legare la pământ și diferențiale",
      "Lucrări electrice - autorizații necesare",
      "Prim ajutor în caz de electrocutare",
      "Semnalizare și interziceri"
    ],
    testQuestions: [
      {
        question: "Ce trebuie să faceți înainte de a utiliza un aparat electric?",
        options: [
          "Să verificați vizual starea cablului și a prizei",
          "Să îl porniți imediat",
          "Nu este nevoie de verificări",
          "Să îl deschideți pentru inspecție internă"
        ],
        correctAnswer: 0
      },
      {
        question: "Cine poate efectua lucrări la instalații electrice?",
        options: [
          "Oricine",
          "Doar personal autorizat și instruit",
          "Orice angajat dacă are unelte",
          "Doar șeful de echipă"
        ],
        correctAnswer: 1
      },
      {
        question: "Ce faceți dacă observați o persoană electrocutată care ține în continuare partea aflată sub tensiune?",
        options: [
          "O trageți imediat de mână",
          "Întrerupeți mai întâi alimentarea electrică sau folosiți un material izolant pentru a o separa",
          "Turnați apă peste ea",
          "Așteptați să se desprindă singură"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-008",
    title: "Munca cu utilaje și echipamente de lucru",
    description: "Utilizarea în siguranță a utilajelor, mașinilor și echipamentelor de lucru industriale.",
    applicableSectors: ["Producție", "Construcții", "Agricultură", "Industrie"],
    duration: 120,
    frequency: "semestrial",
    content: [
      "Verificări înainte de punerea în funcțiune",
      "Dispozitive de protecție și sisteme de siguranță",
      "Proceduri de pornire, oprire și blocare (LOTO)",
      "Mentenanță și reparații - reguli de siguranță",
      "Utilizarea corectă conform instrucțiunilor producătorului",
      "Protecția împotriva pornirii accidentale",
      "Zonele periculoase și semnalizarea acestora",
      "Raportarea defecțiunilor"
    ],
    testQuestions: [
      {
        question: "Ce înseamnă procedura LOTO?",
        options: [
          "Verificarea loteriei angajaților",
          "Lockout-Tagout - blocare și etichetare pentru izolarea energiei",
          "Procedură de lotizare produse",
          "Test de funcționare"
        ],
        correctAnswer: 1
      },
      {
        question: "Când pot fi îndepărtate protecțiile unui utilaj?",
        options: [
          "Oricând, dacă deranjează",
          "Doar când utilajul este oprit, blocat și etichetat",
          "Când lucrăm singuri",
          "Când avem experiență"
        ],
        correctAnswer: 1
      },
      {
        question: "Dacă observați o defecțiune la un utilaj, ce trebuie să faceți?",
        options: [
          "Să continuați lucrul cu atenție sporită",
          "Să opriți utilajul, să îl semnalizați și să raportați defecțiunea",
          "Să reparați singur defecțiunea",
          "Să anunțați la sfârșitul schimbului"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-009",
    title: "Lucrul în spațiiconfinate",
    description: "Proceduri de siguranță pentru accesul și lucrul în spații confinate (rezervoare, canalizări, etc.).",
    applicableSectors: ["Industrie", "Utilități", "Construcții", "Mentenanță"],
    duration: 120,
    frequency: "anual",
    content: [
      "Definirea spațiilor confinate",
      "Riscuri specifice: asfixiere, intoxicare, explozie",
      "Permis de lucru obligatoriu",
      "Măsurarea atmosferei: oxigen, gaze toxice, explozive",
      "Ventilație adecvată",
      "EPI specifice: aparate de respirație autonome",
      "Sistem de supraveghere și comunicare",
      "Proceduri de salvare și intervenție"
    ],
    testQuestions: [
      {
        question: "Ce se înțelege prin spațiu confinat?",
        options: [
          "Orice cameră mică",
          "Spațiu închis, cu acces limitat, neavând ventilație naturală adecvată",
          "Doar rezervoarele subterane",
          "Birourile mici"
        ],
        correctAnswer: 1
      },
      {
        question: "Ce document este obligatoriu înainte de intrarea în spațiu confinat?",
        options: [
          "Permis de conducere",
          "Permis de lucru pentru spații confinate",
          "Contract de muncă",
          "Adeverință medicală"
        ],
        correctAnswer: 1
      },
      {
        question: "Care este concentrația minimă de oxigen permisă într-un spațiu confinat?",
        options: [
          "15%",
          "17%",
          "19.5%",
          "25%"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "ssm-010",
    title: "Sănătatea mintală și gestionarea stresului",
    description: "Identificarea și gestionarea stresului ocupațional pentru menținerea sănătății mintale la locul de muncă.",
    applicableSectors: ["Toate sectoarele"],
    duration: 60,
    frequency: "anual",
    content: [
      "Definirea stresului ocupațional",
      "Cauze de stres: sarcini excesive, presiune timp, conflicte",
      "Simptome fizice și psihice ale stresului",
      "Efectele stresului asupra performanței și sănătății",
      "Tehnici de gestionare: respirație, pauze, prioritizare",
      "Importanța echilibrului muncă-viață personală",
      "Resurse disponibile: consiliere, suport colegial",
      "Prevenirea burnout-ului"
    ],
    testQuestions: [
      {
        question: "Care dintre următoarele este un semn de stres ocupațional?",
        options: [
          "Energie crescută",
          "Oboseală cronică, iritabilitate, dificultăți de concentrare",
          "Entuziasm crescut",
          "Apetit normal"
        ],
        correctAnswer: 1
      },
      {
        question: "Ce tehnică simplă poate reduce stresul imediat?",
        options: [
          "Consumul de cafea",
          "Respirație profundă și conștientă",
          "Lucrul mai intens",
          "Evitarea pauzelor"
        ],
        correctAnswer: 1
      },
      {
        question: "Cine este responsabil pentru prevenirea stresului la locul de muncă?",
        options: [
          "Doar angajatul",
          "Doar angajatorul",
          "Atât angajatorul (prin organizare), cât și angajatul (prin auto-îngrijire)",
          "Nimeni"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "ssm-011",
    title: "Prim ajutor",
    description: "Noțiuni de prim ajutor pentru intervenție imediată în situații de urgență la locul de muncă.",
    applicableSectors: ["Toate sectoarele"],
    duration: 180,
    frequency: "anual",
    content: [
      "Evaluarea victimei și a situației",
      "Apelarea serviciilor de urgență: 112",
      "Resuscitare cardio-pulmonară (RCP)",
      "Tratarea hemoragiilor",
      "Tratarea arsurilor, fracturilor, luxațiilor",
      "Poziția laterală de siguranță",
      "Utilizarea defibrilatorului automat extern (DAE)",
      "Kit-ul de prim ajutor - compoziție și utilizare"
    ],
    testQuestions: [
      {
        question: "Care este numărul de urgență unic european?",
        options: [
          "911",
          "112",
          "999",
          "061"
        ],
        correctAnswer: 1
      },
      {
        question: "În ce secvență se efectuează RCP la un adult?",
        options: [
          "30 compresii toracice : 2 ventilații",
          "15 compresii toracice : 2 ventilații",
          "5 compresii toracice : 1 ventilație",
          "Doar ventilații"
        ],
        correctAnswer: 0
      },
      {
        question: "Ce faceți în cazul unei hemoragii severe?",
        options: [
          "Aplicați un garou imediat",
          "Aplicați presiune directă pe rană cu un material curat",
          "Turnați alcool pe rană",
          "Lăsați sângele să curgă pentru curățare"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-012",
    title: "Transport și depozitare mărfuri",
    description: "Reguli de siguranță pentru transportul intern, manipularea și depozitarea mărfurilor.",
    applicableSectors: ["Logistică", "Depozite", "Producție", "Comerț"],
    duration: 90,
    frequency: "semestrial",
    content: [
      "Manipularea manuală - limite de greutate",
      "Utilizarea transpaletelor și stivuitoarelor",
      "Autorizații necesare pentru operatori",
      "Reguli de circulație în depozit",
      "Sisteme de rafturi - stabilitate și capacitate",
      "Marcarea și etichetarea mărfurilor",
      "Separarea mărfurilor incompatibile",
      "Căi de acces și evacuare libere"
    ],
    testQuestions: [
      {
        question: "Care este greutatea maximă recomandată pentru manipulare manuală ocazională (bărbați)?",
        options: [
          "10 kg",
          "15 kg",
          "25 kg",
          "50 kg"
        ],
        correctAnswer: 2
      },
      {
        question: "Cine poate opera un stivuitor?",
        options: [
          "Orice angajat",
          "Doar personal autorizat și instruit",
          "Orice persoană cu permis de conducere auto",
          "Doar șeful de depozit"
        ],
        correctAnswer: 1
      },
      {
        question: "Cum trebuie depozitate materialele pe rafturi?",
        options: [
          "Cât mai sus posibil",
          "Fără a depăși capacitatea de încărcare, cu cele mai grele jos",
          "În ordine aleatorie",
          "Doar pe un singur nivel"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-013",
    title: "Utilizarea schelelor mobile și fixe",
    description: "Reguli de montaj, utilizare și verificare a schelelor pentru lucrări la înălțime.",
    applicableSectors: ["Construcții", "Mentenanță", "Instalații"],
    duration: 90,
    frequency: "semestrial",
    content: [
      "Tipuri de schele: fixe, mobile, suspendate",
      "Montaj conform instrucțiunilor producătorului",
      "Verificări zilnice înainte de utilizare",
      "Platforme de lucru: dimensiuni, balustrade",
      "Ancorarea schelelor la construcție",
      "Accesul pe schelă - scări incorporate",
      "Stabilitatea schelelor mobile",
      "Interzicerea supraîncărcării"
    ],
    testQuestions: [
      {
        question: "Cine poate monta o schelă?",
        options: [
          "Orice muncitor",
          "Personal instruit și autorizat",
          "Doar inginerul șef",
          "Oricare dintre lucrătorii de pe șantier"
        ],
        correctAnswer: 1
      },
      {
        question: "Înainte de utilizarea unei schele, ce trebuie verificat?",
        options: [
          "Doar culoarea",
          "Stabilitatea, elementele de siguranță, platformele, balustradele",
          "Nu este nevoie de verificare",
          "Doar numărul de seriе"
        ],
        correctAnswer: 1
      },
      {
        question: "Când poate fi deplasată o schelă mobilă?",
        options: [
          "Oricând",
          "Când sunt oameni pe ea",
          "Doar când nu sunt persoane sau materiale pe platformă",
          "Când este parțial încărcată"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "ssm-014",
    title: "Zgomot și vibrații",
    description: "Protecția lucrătorilor împotriva riscurilor datorate expunerii la zgomot și vibrații.",
    applicableSectors: ["Industrie", "Construcții", "Producție", "Transporturi"],
    duration: 60,
    frequency: "anual",
    content: [
      "Efectele zgomotului asupra auzului și sănătății",
      "Niveluri de zgomot: valori limită și de acțiune",
      "Măsurarea nivelului de zgomot",
      "Mijloace de protecție: dopuri, cască antifonică",
      "Vibrații mână-braț și vibrații ale întregului corp",
      "Efectele vibrațiilor: circulatorii, neurologice, musculare",
      "Reducerea expunerii: organizare, pauze, echipamente moderne",
      "Monitorizarea medicală periodică"
    ],
    testQuestions: [
      {
        question: "De la ce nivel de zgomot este obligatorie furnizarea de protecție auditivă?",
        options: [
          "70 dB(A)",
          "80 dB(A)",
          "90 dB(A)",
          "100 dB(A)"
        ],
        correctAnswer: 1
      },
      {
        question: "Ce efecte poate avea expunerea prelungită la zgomot?",
        options: [
          "Îmbunătățirea auzului",
          "Pierderea auzului, oboseală, stres, probleme cardiovasculare",
          "Niciun efect",
          "Doar disconfort temporar"
        ],
        correctAnswer: 1
      },
      {
        question: "Cum se poate reduce expunerea la vibrații?",
        options: [
          "Nu se poate reduce",
          "Utilizarea de echipamente moderne cu vibrații reduse, pauze, rotația personalului",
          "Muncind mai repede",
          "Ignorând simptomele"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-015",
    title: "Lucrul cu echipamente de sudură",
    description: "Măsuri de protecție pentru operațiile de sudură și tăiere cu gaze sau electric.",
    applicableSectors: ["Construcții metalice", "Industrie", "Reparații", "Fabricație"],
    duration: 120,
    frequency: "semestrial",
    content: [
      "Tipuri de sudură: electrică, autogenă, MIG/MAG, TIG",
      "Riscuri: arsuri, electrocutare, radiații UV, gaze nocive",
      "EPI specifice: mască de sudură, mănuși, șorț, jambiere",
      "Ventilație și aspirația fumului de sudură",
      "Verificarea instalațiilor și echipamentelor",
      "Prevenirea incendiilor - curățarea zonei de lucru",
      "Butelii sub presiune - manipulare și depozitare",
      "Permis de lucru cu foc"
    ],
    testQuestions: [
      {
        question: "Ce protecție este obligatorie pentru ochii sudorului?",
        options: [
          "Ochelari de soare",
          "Mască sau ecran de sudură cu filtru adecvat",
          "Nu este necesară protecție",
          "Ochelari normali"
        ],
        correctAnswer: 1
      },
      {
        question: "De ce este periculoasă expunerea la radiațiile UV de la sudură?",
        options: [
          "Nu este periculoasă",
          "Poate cauza arsuri ale corneei (oftalmie) și ale pielii",
          "Doar deranjează",
          "Are efecte doar pe termen lung, nesemnificative"
        ],
        correctAnswer: 1
      },
      {
        question: "Cum trebuie depozitate buteliile cu gaze?",
        options: [
          "Culcate, în soare",
          "Vertical, legate, în locuri ventilate, departe de surse de căldură",
          "Oriunde este spațiu",
          "În apropierea surselor de foc pentru ușurință"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-016",
    title: "Conducerea autovehiculelor în interes de serviciu",
    description: "Reguli de siguranță pentru conducerea în interes de serviciu și prevenirea accidentelor rutiere.",
    applicableSectors: ["Transporturi", "Logistică", "Toate sectoarele cu flote auto"],
    duration: 60,
    frequency: "anual",
    content: [
      "Verificarea tehnică a vehiculului înainte de plecare",
      "Respectarea legislației rutiere",
      "Timpii de conducere și odihnă conform legii",
      "Conduita preventivă și adaptarea vitezei",
      "Utilizarea centurii de siguranță și telefon hands-free",
      "Raportarea defecțiunilor și accidentelor",
      "Influența oboselii, alcoolului și medicamentelor",
      "Proceduri în caz de accident rutier"
    ],
    testQuestions: [
      {
        question: "Înainte de a porni cu vehiculul de serviciu, ce trebuie verificat?",
        options: [
          "Doar nivelul de combustibil",
          "Starea tehnică: anvelope, frâne, luminile, fluide",
          "Doar culorile vehiculului",
          "Nu este nevoie de verificări"
        ],
        correctAnswer: 1
      },
      {
        question: "Este permis să vorbiți la telefon în timpul conducerii?",
        options: [
          "Da, oricând",
          "Nu, niciodată",
          "Da, doar cu sistem hands-free",
          "Da, dacă țineți scurt"
        ],
        correctAnswer: 2
      },
      {
        question: "Ce faceți dacă sunteți implicat într-un accident rutier cu vehiculul de serviciu?",
        options: [
          "Plecați de la fața locului",
          "Asigurați locul accidentului, acordați prim ajutor, anunțați poliția și angajatorul",
          "Anunțați doar dacă sunt victime",
          "Rezolvați pe loc cu cealaltă parte fără a anunța"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-017",
    title: "Lucrul în condiții de temperatură extremă",
    description: "Măsuri de protecție la lucrul în condiții de frig intens sau căldură excesivă.",
    applicableSectors: ["Construcții", "Agricultură", "Industrie alimentară", "Metalurgie"],
    duration: 60,
    frequency: "anual",
    content: [
      "Efectele căldurii: deshidratare, epuizare, șoc termic",
      "Efectele frigului: degerături, hipotermie",
      "Îmbrăcăminte adecvată pentru fiecare condiție",
      "Hidratarea corespunzătoare",
      "Organizarea muncii: pauze frecvente, rotație",
      "Adaptarea și aclimatizarea",
      "Recunoașterea simptomelor de risc",
      "Prim ajutor specific"
    ],
    testQuestions: [
      {
        question: "Care este primul semn al deshidratării la lucrul în căldură?",
        options: [
          "Leșin",
          "Sete, oboseală, dureri de cap",
          "Convulsii",
          "Nu există semne"
        ],
        correctAnswer: 1
      },
      {
        question: "Cum preveniți hipotermia la lucrul în frig?",
        options: [
          "Îmbrăcăminte pe straturi, pauze în încăperi încălzite, băuturi calde",
          "Băuturi alcoolice",
          "Mișcare continuă fără pauze",
          "Ignorarea frigului"
        ],
        correctAnswer: 0
      },
      {
        question: "La ce temperatură exterioară devine obligatorie întreruperea lucrului în aer liber (frig)?",
        options: [
          "0°C",
          "-5°C",
          "-10°C cu vânt sau -20°C fără vânt",
          "-30°C"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "ssm-018",
    title: "Munca de noapte și în schimburi",
    description: "Particularități și măsuri de protecție pentru lucrul în schimburi și programul de noapte.",
    applicableSectors: ["Producție continuă", "Sănătate", "Securitate", "Industrie"],
    duration: 60,
    frequency: "anual",
    content: [
      "Definirea muncii de noapte conform Codului Muncii",
      "Efectele asupra sănătății: somn, metabolism, stres",
      "Drepturile lucrătorilor de noapte",
      "Supravegherea medicală suplimentară",
      "Iluminatul adecvat al locului de muncă",
      "Alimentație și hidratare adecvate",
      "Gestionarea oboselii",
      "Siguranța sporită - risc crescut de accidente"
    ],
    testQuestions: [
      {
        question: "Ce se consideră muncă de noapte?",
        options: [
          "Orice oră după 18:00",
          "Munca prestată între 22:00-06:00",
          "Munca după 20:00",
          "Nu există definiție legală"
        ],
        correctAnswer: 1
      },
      {
        question: "Ce examinare medicală suplimentară au lucrătorii de noapte?",
        options: [
          "Nicio examinare suplimentară",
          "Control medical periodic la intervale mai scurte",
          "Doar la angajare",
          "La cerere"
        ],
        correctAnswer: 1
      },
      {
        question: "De ce crește riscul de accidente la munca de noapte?",
        options: [
          "Nu crește",
          "Din cauza oboselii, somnului și scăderii atenției",
          "Doar din cauza întunericului",
          "Din cauza lipsei de supraveghere"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-019",
    title: "Securitate cibernetică la locul de muncă",
    description: "Protejarea informațiilor și sistemelor informatice împotriva amenințărilor cibernetice.",
    applicableSectors: ["Toate sectoarele cu activitate IT"],
    duration: 60,
    frequency: "anual",
    content: [
      "Tipuri de amenințări: phishing, malware, ransomware",
      "Recunoașterea emailurilor suspecte",
      "Parole sigure și autentificare cu doi factori",
      "Protecția datelor cu caracter personal (GDPR)",
      "Utilizarea dispozitivelor mobile în siguranță",
      "Politica de birou curat (clean desk)",
      "Raportarea incidentelor de securitate",
      "Backup-ul datelor importante"
    ],
    testQuestions: [
      {
        question: "Ce este phishing-ul?",
        options: [
          "Un sport",
          "Încercarea de a obține informații confidențiale prin email-uri false",
          "Un tip de virus",
          "O tehnică de programare"
        ],
        correctAnswer: 1
      },
      {
        question: "Cum arată o parolă sigură?",
        options: [
          "Numele dvs.",
          "123456",
          "Combinație lungă de litere mari/mici, cifre și caractere speciale",
          "Data nașterii"
        ],
        correctAnswer: 2
      },
      {
        question: "Ce faceți dacă primiți un email suspect care vă cere să deschideți un atașament?",
        options: [
          "Deschideți imediat atașamentul",
          "Ștergeți emailul și raportați la departamentul IT",
          "Răspundeți expeditorului",
          "Trimiteți emailul către toți colegii"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-020",
    title: "Siguranța în laboratoare",
    description: "Reguli de siguranță pentru activitățile din laboratoare chimice, biologice și de cercetare.",
    applicableSectors: ["Cercetare", "Industrie farmaceutică", "Educație", "Control calitate"],
    duration: 90,
    frequency: "semestrial",
    content: [
      "Organizarea locului de muncă în laborator",
      "EPI specifice: halat, mănuși, ochelari, mască",
      "Manipularea substanțelor chimice și biologice",
      "Utilizarea dulapurilor de siguranță și a nișelor",
      "Gestionarea deșeurilor periculoase",
      "Proceduri în caz de vărsare sau contaminare",
      "Utilizarea echipamentelor: autoclave, centrifuge, microscoape",
      "Duchas de siguranță și spălătoare pentru ochi"
    ],
    testQuestions: [
      {
        question: "Ce EPI este obligatoriu în laborator?",
        options: [
          "Doar halat",
          "Halat, ochelari de protecție, mănuși adecvate",
          "Doar mănuși",
          "Nu este obligatoriu niciun EPI"
        ],
        correctAnswer: 1
      },
      {
        question: "Unde trebuie manipulate substanțele volatile sau toxice?",
        options: [
          "Oriunde în laborator",
          "Sub nișă cu aspirație",
          "Lângă fereastră deschisă",
          "Pe coridor"
        ],
        correctAnswer: 1
      },
      {
        question: "Ce faceți dacă o substanță chimică intră în contact cu ochii?",
        options: [
          "Frecați ochii",
          "Clătiți imediat la spălătorul de ochi timp de minimum 15 minute",
          "Aplicați un unguent",
          "Așteptați să treacă"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-021",
    title: "Prevenirea violenței și hărțuirii la locul de muncă",
    description: "Identificarea, prevenirea și gestionarea situațiilor de violență, hărțuire și discriminare.",
    applicableSectors: ["Toate sectoarele"],
    duration: 90,
    frequency: "anual",
    content: [
      "Definirea hărțuirii: sexuale, morală (mobbing), discriminare",
      "Forme de violență: fizică, verbală, psihologică",
      "Drepturile angajaților",
      "Recunoașterea comportamentelor abuzive",
      "Proceduri de raportare și sesizare",
      "Confidențialitate și protecție împotriva represaliilor",
      "Rolul conducerii și al colegilor",
      "Resurse de suport: consiliere, juridic"
    ],
    testQuestions: [
      {
        question: "Ce este mobbing-ul?",
        options: [
          "O aplicație mobilă",
          "Hărțuire psihologică repetată la locul de muncă",
          "Un stil de management",
          "O formă de organizare a muncii"
        ],
        correctAnswer: 1
      },
      {
        question: "Dacă sunteți martor la o situație de hărțuire, ce trebuie să faceți?",
        options: [
          "Să ignorați",
          "Să vă implicați direct și violent",
          "Să oferiți suport victimei și să raportați conform procedurii",
          "Să râdeți"
        ],
        correctAnswer: 2
      },
      {
        question: "Este permisă discriminarea pe criteriu de vârstă, sex sau etnie?",
        options: [
          "Da, în anumite situații",
          "Nu, este interzisă prin lege",
          "Depinde de companie",
          "Da, dacă este în regulamentul intern"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-022",
    title: "Utilizarea scărilor portabile",
    description: "Utilizarea în siguranță a scărilor portabile simple și duble pentru lucrări la înălțime mică.",
    applicableSectors: ["Toate sectoarele"],
    duration: 45,
    frequency: "anual",
    content: [
      "Tipuri de scări: simple, duble, transformabile",
      "Verificarea stării tehnice înainte de utilizare",
      "Poziționarea corectă: unghi 75 grade, baza stabilă",
      "Depășirea cu minim 1 metru peste nivelul de acces",
      "Interzicerea utilizării ca platformă de lucru",
      "Regula celor 3 puncte de contact",
      "Asigurarea scării împotriva alunecării",
      "Transport și depozitare corectă"
    ],
    testQuestions: [
      {
        question: "La ce unghi trebuie așezată scara față de perete?",
        options: [
          "90 grade (perpendicular)",
          "45 grade",
          "Aproximativ 75 grade (raport 1:4)",
          "Nu contează"
        ],
        correctAnswer: 2
      },
      {
        question: "Câte persoane pot urca simultan pe o scară portabilă?",
        options: [
          "Câte încap",
          "Două persoane",
          "O singură persoană",
          "Trei persoane"
        ],
        correctAnswer: 2
      },
      {
        question: "Ce verificați înainte de a urca pe scară?",
        options: [
          "Doar înălțimea",
          "Stabilitatea, starea treptelor, dispozitivele antiderapante",
          "Nu este nevoie de verificare",
          "Doar culoarea"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-023",
    title: "Prevenirea accidentelor în bucătării/cantine",
    description: "Siguranța în bucătăriile industriale și cantinele de la locul de muncă.",
    applicableSectors: ["HoReCa", "Cantine", "Industrie alimentară"],
    duration: 60,
    frequency: "semestrial",
    content: [
      "Riscuri: arsuri, tăieturi, alunecări, incendii",
      "Utilizarea corectă a cuțitelor și ustensile­lor",
      "Manipularea în siguranță a vaselor fierbinți",
      "Prevenirea incendiilor - uleiuri fierbinți, aragaz",
      "Igienizare și prevenirea contaminării",
      "Pardoseli antiaderent și menținerea curățeniei",
      "Echipamente de protecție: șorț, mănuși termice",
      "Utilizarea echipamentelor: cuptoare, plite, friteuze"
    ],
    testQuestions: [
      {
        question: "Ce faceți dacă uleiul din friteuză ia foc?",
        options: [
          "Aruncați apă peste el",
          "Acoperiți cu un capac sau utilizați stingător pentru grăsimi (clasa F)",
          "Suflați în el",
          "Îl mutați afară"
        ],
        correctAnswer: 1
      },
      {
        question: "Cum trebuie ținut cuțitul când vă deplasați în bucătărie?",
        options: [
          "Cu vârful în sus",
          "Orizontal",
          "Cu vârful în jos, lângă corp",
          "Nu contează"
        ],
        correctAnswer: 2
      },
      {
        question: "De ce sunt periculoase pardoselile ude în bucătărie?",
        options: [
          "Nu sunt periculoase",
          "Risc major de alunecare și cădere",
          "Doar arată urât",
          "Doar dacă sunt foarte ude"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-024",
    title: "Siguranța în birouri",
    description: "Prevenirea accidentelor și protecția sănătății în mediul de birou.",
    applicableSectors: ["Birouri", "Administrație", "Servicii"],
    duration: 45,
    frequency: "anual",
    content: [
      "Riscuri în birouri: postura incorectă, căderi, electrocutare",
      "Amenajarea ergonomică a biroului",
      "Utilizarea în siguranță a echipamentelor electrice",
      "Prevenirea căderii obiectelor de pe rafturi",
      "Menținerea căilor de circulație libere",
      "Evacuare în caz de incendiu",
      "Calitatea aerului și ventilația",
      "Iluminat adecvat pentru prevenirea oboselii vizuale"
    ],
    testQuestions: [
      {
        question: "Care este o cauză frecventă de accident în birouri?",
        options: [
          "Explozii",
          "Căderi pe suprafețe plane (cabluri, obiecte pe jos)",
          "Accidente cu mașini",
          "Nu există accidente în birouri"
        ],
        correctAnswer: 1
      },
      {
        question: "La ce înălțime trebuie să fie centrul monitorului?",
        options: [
          "Cât mai sus",
          "La nivelul sau ușor sub nivelul ochilor",
          "La nivelul pieptului",
          "Nu contează"
        ],
        correctAnswer: 1
      },
      {
        question: "Este permis să supraîncărcați prelungitoarele electrice?",
        options: [
          "Da, dacă este temporar",
          "Nu, prezintă risc de supraîncălzire și incendiu",
          "Da, dacă sunt de calitate",
          "Nu contează"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-025",
    title: "Lucrul cu displayuri (ecrane de vizualizare)",
    description: "Protecția sănătății lucrătorilor care utilizează intens calculatoare și ecrane.",
    applicableSectors: ["IT", "Birouri", "Telecomunicații", "Design"],
    duration: 60,
    frequency: "anual",
    content: [
      "Riscuri: afecțiuni oculare, TMS, stres",
      "Reglarea corectă a ecranului: distanță, înălțime, luminozitate",
      "Regula 20-20-20: la fiecare 20 minute, privește 20 secunde la 20 feet (6m)",
      "Poziția corectă a scaunului și tastaturii",
      "Pauze active la fiecare oră",
      "Iluminat ambient adecvat - evitarea reflexiilor",
      "Exerciții pentru ochi și gât",
      "Supravegherea medicală oftalmologică"
    ],
    testQuestions: [
      {
        question: "Care este distanța optimă dintre ochi și monitor?",
        options: [
          "20-30 cm",
          "50-70 cm (lungimea brațului)",
          "1 metru",
          "Cât mai aproape"
        ],
        correctAnswer: 1
      },
      {
        question: "Ce înseamnă regula 20-20-20?",
        options: [
          "20 ore de muncă pe săptămână",
          "La fiecare 20 minute, privește 20 secunde la o distanță de 20 feet",
          "20 pauze pe zi de câte 20 minute",
          "Nu există această regulă"
        ],
        correctAnswer: 1
      },
      {
        question: "Cum preveniți oboseala oculară?",
        options: [
          "Munciți fără pauze",
          "Pauze regulate, iluminat adecvat, reglarea contrastului ecranului",
          "Purtați ochelari de soare",
          "Măriți la maximum luminozitatea ecranului"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-026",
    title: "Sănătatea femeilor la locul de muncă",
    description: "Protecția specifică a lucrătoarelor gravide, care alăptează sau au născut recent.",
    applicableSectors: ["Toate sectoarele"],
    duration: 60,
    frequency: "anual",
    content: [
      "Drepturile lucrătoarelor gravide conform Codului Muncii",
      "Evaluarea riscurilor specifice",
      "Activități interzise: substanțe chimice, radiații, manipulări grele",
      "Adaptarea locului de muncă și programului",
      "Pauze suplimentare pentru alăptare",
      "Supravegherea medicală",
      "Protecție împotriva concedierii",
      "Anunțarea sarcinii către angajator"
    ],
    testQuestions: [
      {
        question: "Ce obligație are angajatorul față de o lucrătoare gravidă?",
        options: [
          "Să o concedieze",
          "Să evalueze riscurile și să adapteze munca sau să o mute temporar",
          "Nicio obligație",
          "Să reducă salariul"
        ],
        correctAnswer: 1
      },
      {
        question: "Poate o lucrătoare gravidă fi obligată să lucreze nocturne?",
        options: [
          "Da, ca toți ceilalți",
          "Nu, dacă prezintă certificat medical",
          "Da, dacă este de acord",
          "Depinde de contract"
        ],
        correctAnswer: 1
      },
      {
        question: "Ce pauze suplimentare are o mamă care alăptează?",
        options: [
          "Nicio pauză suplimentară",
          "2 pauze a câte o oră sau o pauză de 2 ore pe zi",
          "Doar dacă solicită",
          "O pauză de 30 minute"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-027",
    title: "Utilizarea echipamentelor de ridicat (macarale, electropalan)",
    description: "Siguranța în operarea și utilizarea echipamentelor de ridicat și transportat.",
    applicableSectors: ["Construcții", "Industrie", "Logistică", "Porturi"],
    duration: 120,
    frequency: "semestrial",
    content: [
      "Tipuri de echipamente: macarale, poduri rulante, electropalane",
      "Autorizare și certificare operatori",
      "Verificări zilnice și periodice",
      "Sarcina maximă admisibilă - respectarea limitelor",
      "Elingaje: curele, lanțuri, cabluri - verificare și utilizare",
      "Zona de lucru - securizare și semnalizare",
      "Comunicare între operator și muncitori",
      "Manevre interzise: ridicarea persoanelor, sarcini diagonale"
    ],
    testQuestions: [
      {
        question: "Cine poate opera o macara?",
        options: [
          "Oricine",
          "Doar personal autorizat, atestat și medical apt",
          "Orice angajat instruit",
          "Doar șeful de șantier"
        ],
        correctAnswer: 1
      },
      {
        question: "Ce verificați la elingajele de ridicare înainte de utilizare?",
        options: [
          "Doar culoarea",
          "Uzuri, rupturi, deformări, marcajele de identificare",
          "Nu este nevoie de verificări",
          "Doar lungimea"
        ],
        correctAnswer: 1
      },
      {
        question: "Este permis să ridicați o sarcină sub care se află persoane?",
        options: [
          "Da, dacă sunt atenți",
          "Nu, este strict interzis",
          "Da, dacă sarcina este ușoară",
          "Depinde de situație"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-028",
    title: "Siguranța în agriculturǎ",
    description: "Măsuri de protecție specifice pentru lucrările agricole și utilizarea echipamentelor agricole.",
    applicableSectors: ["Agricultură", "Zootehnie", "Silvicultură"],
    duration: 90,
    frequency: "semestrial",
    content: [
      "Utilizarea tractorului și mașinilor agricole",
      "Manipularea produselor fitosanitare",
      "Lucrul cu animale - riscuri și protecție",
      "Prevenirea accidentelor cu unelte agricole",
      "Protecție solară și hidratare",
      "Riscuri biologice: zoonoze, alergi",
      "Utilizarea fierăstraielor mecanice",
      "Depozitarea recoltei în siguranță"
    ],
    testQuestions: [
      {
        question: "Ce EPI este obligatoriu la aplicarea produselor fitosanitare?",
        options: [
          "Doar mănuși",
          "Echipament complet: mască/respirator, combinezon, mănuși, boți",
          "Nu este necesar EPI",
          "Doar ochelari"
        ],
        correctAnswer: 1
      },
      {
        question: "Cine poate conduce tractorul?",
        options: [
          "Oricine",
          "Doar persoane cu permis de conducere corespunzător",
          "Orice adult",
          "Doar proprietarul"
        ],
        correctAnswer: 1
      },
      {
        question: "Ce risc prezintă lucrul îndelungat la soare?",
        options: [
          "Niciun risc",
          "Deshidratare, insolație, arsuri solare",
          "Doar bronzare",
          "Doar oboseală ușoară"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-029",
    title: "Protecția împotriva azbestului",
    description: "Identificarea, manipularea și eliminarea în siguranță a materialelor conținând azbest.",
    applicableSectors: ["Construcții", "Demolări", "Renovări"],
    duration: 120,
    frequency: "anual",
    content: [
      "Ce este azbestul și de ce este periculos",
      "Identificarea materialelor cu azbest",
      "Boli asociate: azbestoză, cancer pulmonar, mezoteliom",
      "Evaluarea riscului înainte de lucrări",
      "Proceduri de lucru cu azbest - izolare, umezire",
      "EPI specifice: măști FFP3, combinezoane de unică folosință",
      "Eliminarea deșeurilor cu azbest",
      "Interzicerea utilizării azbest în construcții noi"
    ],
    testQuestions: [
      {
        question: "De ce este periculos azbestul?",
        options: [
          "Nu este periculos",
          "Fibrele inhalate provoacă boli grave ale plămânilor",
          "Doar arată urât",
          "Doar dacă este ingerat"
        ],
        correctAnswer: 1
      },
      {
        question: "Ce măsură este esențială la lucrările cu azbest?",
        options: [
          "Lucrul rapid",
          "Umezirea materialului pentru a preveni dispersia fibrelor",
          "Suflarea cu aer comprimat",
          "Arderea la fața locului"
        ],
        correctAnswer: 1
      },
      {
        question: "Cine poate executa lucrări de dezazbestare?",
        options: [
          "Oricine",
          "Doar firme autorizate cu personal instruit specific",
          "Orice constructor",
          "Proprietarul clădirii"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ssm-030",
    title: "Responsabilități legale SSM",
    description: "Cunoașterea obligațiilor legale ale angajatorului și angajatului în domeniul SSM.",
    applicableSectors: ["Toate sectoarele"],
    duration: 90,
    frequency: "anual",
    content: [
      "Cadrul legislativ: Legea 319/2006, HG 1425/2006",
      "Obligațiile angajatorului: evaluare riscuri, instruire, dotare EPI",
      "Obligațiile angajatului: respectarea normelor, utilizarea EPI",
      "Rolul și atribuțiile lucrătorului desemnat/serviciului SSM",
      "Comitetul de securitate și sănătate în muncă",
      "Sancțiuni pentru nerespectarea normelor",
      "Dreptul de retragere în caz de pericol grav",
      "Inspectoratul de Muncă - controale și verificări"
    ],
    testQuestions: [
      {
        question: "Care este legea principală în domeniul SSM din România?",
        options: [
          "Codul Penal",
          "Legea 319/2006",
          "Legea 53/2003",
          "Legea 95/2006"
        ],
        correctAnswer: 1
      },
      {
        question: "Ce poate face un angajat dacă consideră că există un pericol grav și iminent?",
        options: [
          "Trebuie să continue lucrul",
          "Poate să se retragă din zona de pericol și să anunțe conducerea",
          "Să plece acasă fără anunț",
          "Să aștepte ordinul șefului"
        ],
        correctAnswer: 1
      },
      {
        question: "Cine este responsabil pentru asigurarea unui mediu de muncă sigur?",
        options: [
          "Doar angajații",
          "Inspectoratul de Muncă",
          "Angajatorul, cu participarea angajaților",
          "Nimeni specific"
        ],
        correctAnswer: 2
      }
    ]
  }
];
