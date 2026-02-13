/**
 * Tipuri de accidente de muncă conform metodologiei de cercetare
 * Clasificare bazată pe legislația SSM din România și statisticile ITM
 */

export interface TipAccidentMunca {
  id: string;
  type: string;
  description: string;
  commonCauses: string[];
  preventionMeasures: string[];
  reportingDeadline: string;
  investigationAuthority: 'angajator' | 'ITM' | 'parchet';
  statisticsRomania: {
    frequency: 'ridicată' | 'medie' | 'scăzută';
    severity: 'ușoară' | 'medie' | 'gravă' | 'mortală';
    vulnerableSectors: string[];
  };
}

export const tipuriAccidenteMunca: TipAccidentMunca[] = [
  {
    id: 'AM001',
    type: 'Cădere de la înălțime',
    description: 'Căderea persoanei de pe suprafețe situate la înălțime (scări, platforme, acoperișuri, schele)',
    commonCauses: [
      'Absența sau defectarea dispozitivelor de protecție colectivă (balustrade, plase)',
      'Nefolosirea echipamentului de protecție individuală (ham, centură)',
      'Suprafețe de lucru instabile sau alunecoase',
      'Iluminare insuficientă',
      'Lipsă de instruire adecvată'
    ],
    preventionMeasures: [
      'Montarea de balustrade și parapeți la minimum 1m înălțime',
      'Utilizarea obligatorie a hamurilor de siguranță',
      'Verificarea stabilității schelelor și platformelor',
      'Instruire specializată pentru lucrul la înălțime',
      'Sistem de permis de lucru pentru lucrări la înălțime peste 2m'
    ],
    reportingDeadline: '24 ore',
    investigationAuthority: 'ITM',
    statisticsRomania: {
      frequency: 'ridicată',
      severity: 'gravă',
      vulnerableSectors: ['Construcții', 'Instalații', 'Mentenanță industrială']
    }
  },
  {
    id: 'AM002',
    type: 'Cădere la același nivel',
    description: 'Căderea persoanei pe suprafața de deplasare (alunecare, împiedicare, dezechilibru)',
    commonCauses: [
      'Suprafețe alunecoase (ulei, apă, gheață)',
      'Pardoseli neregulate sau deteriorate',
      'Obstacole în căile de circulație',
      'Încălțăminte neadecvată',
      'Grabă, neatenție'
    ],
    preventionMeasures: [
      'Menținerea curățeniei și a ordinii la locul de muncă',
      'Marcarea clară a zonelor cu risc de alunecare',
      'Utilizarea încălțămintei de protecție antiderapante',
      'Amenajarea corectă a căilor de circulație',
      'Iluminare adecvată a spațiilor de lucru'
    ],
    reportingDeadline: '24 ore',
    investigationAuthority: 'angajator',
    statisticsRomania: {
      frequency: 'ridicată',
      severity: 'ușoară',
      vulnerableSectors: ['Industrie prelucrătoare', 'Comerț', 'Servicii']
    }
  },
  {
    id: 'AM003',
    type: 'Lovire de obiecte în mișcare',
    description: 'Lovirea lucrătorului de către părți mobile ale echipamentelor sau obiecte în deplasare',
    commonCauses: [
      'Lipsa protecțiilor la mașini și utilaje',
      'Nerespectarea zonelor de siguranță',
      'Defecțiuni ale sistemelor de siguranță',
      'Intervenții în timpul funcționării echipamentelor',
      'Semnalizare insuficientă'
    ],
    preventionMeasures: [
      'Montarea de protecții la toate organele de transmisie',
      'Marcarea și delimitarea zonelor periculoase',
      'Întreținere preventivă regulată',
      'Proceduri de blocare/etichetare (LOTO)',
      'Instruire privind riscurile specifice echipamentului'
    ],
    reportingDeadline: '24 ore',
    investigationAuthority: 'angajator',
    statisticsRomania: {
      frequency: 'medie',
      severity: 'medie',
      vulnerableSectors: ['Industrie prelucrătoare', 'Transport', 'Logistică']
    }
  },
  {
    id: 'AM004',
    type: 'Prindere între obiecte',
    description: 'Prinderea sau strivirea unei părți a corpului între obiecte mobile sau între un obiect mobil și unul fix',
    commonCauses: [
      'Lipsa dispozitivelor de protecție la presă, cilindri, angrenaje',
      'Spații insuficiente între echipamente',
      'Proceduri de lucru necorespunzătoare',
      'Defecțiuni ale comenzilor de urgență',
      'Purtarea îmbrăcămintei largi sau a bijuteriilor'
    ],
    preventionMeasures: [
      'Instalarea de protecții cu interblocare',
      'Menținerea distanțelor de siguranță între echipamente',
      'Utilizarea comenzilor bimanuală la prese',
      'Interzicerea purtării îmbrăcămintei largi și bijuteriilor',
      'Proceduri stricte de întreținere și curățare'
    ],
    reportingDeadline: '24 ore',
    investigationAuthority: 'ITM',
    statisticsRomania: {
      frequency: 'medie',
      severity: 'gravă',
      vulnerableSectors: ['Industrie prelucrătoare', 'Metalurgie', 'Construcții de mașini']
    }
  },
  {
    id: 'AM005',
    type: 'Electrocutare',
    description: 'Trecerea curentului electric prin corpul uman cu efecte potențial mortale',
    commonCauses: [
      'Contact direct cu părți active neprotejate',
      'Contact indirect prin defecte de izolație',
      'Lipsa legării la pământ',
      'Lucrări fără deconectarea instalației',
      'Utilaje cu defecțiuni electrice'
    ],
    preventionMeasures: [
      'Verificarea periodică a instalațiilor electrice',
      'Utilizarea întrerupătoarelor diferențiale (RCD)',
      'Legarea la pământ a tuturor echipamentelor',
      'Permis de lucru pentru intervenții electrice',
      'Utilizarea numai de personal autorizat ANRE'
    ],
    reportingDeadline: '24 ore',
    investigationAuthority: 'ITM',
    statisticsRomania: {
      frequency: 'scăzută',
      severity: 'mortală',
      vulnerableSectors: ['Construcții', 'Industrie', 'Instalații electrice']
    }
  },
  {
    id: 'AM006',
    type: 'Arsuri termice',
    description: 'Leziuni produse de contactul cu suprafețe fierbinți, flăcări, vapori sau lichide fierbinți',
    commonCauses: [
      'Contact cu suprafețe incandescente neprotejate',
      'Scurgeri de lichide sau vapori fierbinți',
      'Explozie sau incendiu',
      'Lipsa echipamentului de protecție termic',
      'Proceduri necorespunzătoare de manipulare'
    ],
    preventionMeasures: [
      'Izolarea termică a suprafețelor fierbinți',
      'Utilizarea echipamentului de protecție termic',
      'Proceduri clare pentru manipularea substanțelor fierbinți',
      'Instruire privind primul ajutor în caz de arsuri',
      'Verificarea instalațiilor sub presiune'
    ],
    reportingDeadline: '24 ore',
    investigationAuthority: 'angajator',
    statisticsRomania: {
      frequency: 'medie',
      severity: 'medie',
      vulnerableSectors: ['Industrie chimică', 'Metalurgie', 'Alimentație publică']
    }
  },
  {
    id: 'AM007',
    type: 'Arsuri chimice',
    description: 'Leziuni produse de contactul cu substanțe corozive (acizi, baze, solvenți)',
    commonCauses: [
      'Manipularea necorespunzătoare a substanțelor chimice',
      'Lipsa echipamentului de protecție',
      'Scurgeri sau revărsări de substanțe',
      'Amestecuri incompatibile de substanțe',
      'Recipiente deteriorate sau neetichetate'
    ],
    preventionMeasures: [
      'Evaluarea riscului chimic conform HG 1218/2006',
      'Utilizarea EPI adecvat (mănuși, ochelari, șorț)',
      'Fișe de securitate accesibile pentru toate substanțele',
      'Dușuri de siguranță și fântâni de spălat ochii',
      'Instruire privind manipularea substanțelor periculoase'
    ],
    reportingDeadline: '24 ore',
    investigationAuthority: 'angajator',
    statisticsRomania: {
      frequency: 'scăzută',
      severity: 'medie',
      vulnerableSectors: ['Industrie chimică', 'Laboratoare', 'Tratarea suprafețelor']
    }
  },
  {
    id: 'AM008',
    type: 'Intoxicație acută',
    description: 'Afectarea organismului prin inhalarea, ingestia sau contactul cu substanțe toxice',
    commonCauses: [
      'Expunere la concentrații ridicate de substanțe toxice',
      'Ventilație insuficientă în spații închise',
      'Lipsa protecției respiratorii adecvate',
      'Scurgeri sau emisii accidentale',
      'Manipulare necorespunzătoare a pesticidelor'
    ],
    preventionMeasures: [
      'Sistem de ventilație corespunzător',
      'Monitorizarea atmosferei în spații închise',
      'Utilizarea măștilor și aparatelor de protecție respiratorie',
      'Proceduri de răspuns la scurgeri',
      'Examinări medicale periodice'
    ],
    reportingDeadline: '24 ore',
    investigationAuthority: 'ITM',
    statisticsRomania: {
      frequency: 'scăzută',
      severity: 'gravă',
      vulnerableSectors: ['Industrie chimică', 'Agricultură', 'Vopsitorii']
    }
  },
  {
    id: 'AM009',
    type: 'Accidente rutiere în timpul programului',
    description: 'Accidente produse cu vehicule în timpul deplasărilor în interes de serviciu',
    commonCauses: [
      'Viteză excesivă sau neadaptată',
      'Oboseală, lipsa concentrării',
      'Vehicule neîntreținute corespunzător',
      'Condiții meteo nefavorabile',
      'Program de lucru prelungit'
    ],
    preventionMeasures: [
      'Evaluarea medicală a conducătorilor auto',
      'Întreținere preventivă a vehiculelor',
      'Limitări privind timpul de conducere continuă',
      'Instruire privind conducerea defensivă',
      'Politici clare privind utilizarea vehiculelor de serviciu'
    ],
    reportingDeadline: '24 ore',
    investigationAuthority: 'angajator',
    statisticsRomania: {
      frequency: 'medie',
      severity: 'gravă',
      vulnerableSectors: ['Transport', 'Comerț', 'Servicii']
    }
  },
  {
    id: 'AM010',
    type: 'Accidente cu utilaje de ridicat',
    description: 'Accidente produse în timpul utilizării macaralelor, stivuitoarelor, podurilor rulante',
    commonCauses: [
      'Sarcină depășită peste capacitatea nominală',
      'Defecțiuni ale sistemului de frânare',
      'Vizibilitate redusă a operatorului',
      'Lipsa coordonării între operator și elerați',
      'Verificări ISCIR neefectuate'
    ],
    preventionMeasures: [
      'Verificări tehnice periodice ISCIR',
      'Autorizarea operatorilor conform ISCIR',
      'Semnalizare clară a capacității de ridicare',
      'Proceduri de comunicare operator-elerați',
      'Delimitarea zonelor de lucru cu utilaje de ridicat'
    ],
    reportingDeadline: '24 ore',
    investigationAuthority: 'ITM',
    statisticsRomania: {
      frequency: 'scăzută',
      severity: 'gravă',
      vulnerableSectors: ['Construcții', 'Industrie', 'Logistică']
    }
  },
  {
    id: 'AM011',
    type: 'Lovire de obiecte căzute sau prăbușite',
    description: 'Lovirea lucrătorului de obiecte aflate în cădere liberă sau prăbușirea unor structuri',
    commonCauses: [
      'Depozitare necorespunzătoare a materialelor',
      'Lipsa dispozitivelor de reținere',
      'Lucrări simultan pe verticală fără protecție',
      'Prăbușirea schelelor sau structurilor',
      'Ruperea sau căderea pieselor de la înălțime'
    ],
    preventionMeasures: [
      'Depozitarea stabilă și corectă a materialelor',
      'Utilizarea dispozitivelor de reținere și margine',
      'Delimitarea și semnalizarea zonelor cu risc de cădere obiecte',
      'Purtarea căștii de protecție',
      'Verificarea stabilității structurilor'
    ],
    reportingDeadline: '24 ore',
    investigationAuthority: 'angajator',
    statisticsRomania: {
      frequency: 'medie',
      severity: 'medie',
      vulnerableSectors: ['Construcții', 'Depozite', 'Industrie']
    }
  },
  {
    id: 'AM012',
    type: 'Tăiere, înțepare cu obiecte ascuțite',
    description: 'Leziuni produse de cuțite, unelte ascuțite, obiecte contondente sau fragmente metalice',
    commonCauses: [
      'Utilizarea de unelte improvizate sau deteriorate',
      'Lipsa mănușilor de protecție',
      'Manipulare necorespunzătoare a obiectelor ascuțite',
      'Depozitare nesigură a uneltelor',
      'Presiunea timpului, grabă'
    ],
    preventionMeasures: [
      'Utilizarea numai a uneltelor adecvate și în bună stare',
      'Purtarea mănușilor de protecție anti-tăiere',
      'Instruire privind manipularea corectă a uneltelor',
      'Depozitarea sigură a obiectelor ascuțite',
      'Menținerea ordinii la locul de muncă'
    ],
    reportingDeadline: '24 ore',
    investigationAuthority: 'angajator',
    statisticsRomania: {
      frequency: 'ridicată',
      severity: 'ușoară',
      vulnerableSectors: ['Industrie prelucrătoare', 'Alimentație', 'Construcții']
    }
  },
  {
    id: 'AM013',
    type: 'Suprasolicitare fizică',
    description: 'Afecțiuni musculo-scheletale cauzate de manipularea manuală a sarcinilor sau poziții forțate',
    commonCauses: [
      'Ridicarea și transportul manual a greutăților excesive',
      'Posturi de lucru ergonomic neadecvate',
      'Mișcări repetitive pe perioade îndelungate',
      'Lipsa perioadelor de pauză',
      'Instruire insuficientă privind manipularea sarcinilor'
    ],
    preventionMeasures: [
      'Evaluarea riscurilor ergonomice',
      'Utilizarea mijloacelor mecanice de manipulare',
      'Limitarea greutății sarcinilor conform Legii 319/2006',
      'Amenajarea ergonomică a posturilor de lucru',
      'Instruire privind tehnicile corecte de ridicare'
    ],
    reportingDeadline: '24 ore',
    investigationAuthority: 'angajator',
    statisticsRomania: {
      frequency: 'ridicată',
      severity: 'ușoară',
      vulnerableSectors: ['Logistică', 'Construcții', 'Sănătate']
    }
  },
  {
    id: 'AM014',
    type: 'Expunere la temperaturi extreme',
    description: 'Afecțiuni cauzate de expunerea la temperaturi foarte ridicate (șoc termic) sau foarte scăzute (hipotermie)',
    commonCauses: [
      'Lucru în condiții de caniculă fără protecție',
      'Expunere prelungită la frig intens',
      'Lipsa sistemelor de climatizare/încălzire',
      'Hidratare insuficientă',
      'Îmbrăcăminte neadecvată'
    ],
    preventionMeasures: [
      'Evaluarea riscurilor legate de microclimă',
      'Asigurarea îmbrăcămintei de protecție termică',
      'Organizarea pauzelor în zone cu temperatură normală',
      'Asigurarea apei potabile și sărurilor minerale',
      'Limitarea timpului de expunere'
    ],
    reportingDeadline: '24 ore',
    investigationAuthority: 'angajator',
    statisticsRomania: {
      frequency: 'medie',
      severity: 'medie',
      vulnerableSectors: ['Construcții', 'Agricultură', 'Industrie']
    }
  },
  {
    id: 'AM015',
    type: 'Explozie',
    description: 'Accidente produse prin combustia rapidă a substanțelor inflamabile sau deflagrația amestecurilor explozive',
    commonCauses: [
      'Acumularea de gaze sau vapori inflamabili',
      'Surse de aprindere în zone ATEX',
      'Manipulare necorespunzătoare a substanțelor explozive',
      'Defecțiuni ale echipamentelor sub presiune',
      'Electricitate statică'
    ],
    preventionMeasures: [
      'Clasificarea zonelor ATEX conform HG 1058/2006',
      'Utilizarea echipamentelor certificate ATEX',
      'Sistem de ventilație și monitorizare a atmosferei',
      'Eliminarea surselor de aprindere',
      'Verificări ISCIR pentru echipamente sub presiune'
    ],
    reportingDeadline: 'Imediat',
    investigationAuthority: 'parchet',
    statisticsRomania: {
      frequency: 'scăzută',
      severity: 'mortală',
      vulnerableSectors: ['Industrie chimică', 'Petrochimie', 'Construcții']
    }
  },
  {
    id: 'AM016',
    type: 'Incendiu',
    description: 'Accidente produse prin arderea necontrolată cu expunerea lucrătorilor la flăcări, fum sau gaze toxice',
    commonCauses: [
      'Surse de aprindere necontrolate',
      'Depozitarea necorespunzătoare a materialelor combustibile',
      'Defecțiuni ale instalațiilor electrice',
      'Lucrări cu foc deschis fără autorizație',
      'Lipsa mijloacelor de stingere'
    ],
    preventionMeasures: [
      'Autorizație PSI emisă de ISU',
      'Mijloace de stingere adecvate și verificate',
      'Evacuare și căi de evacuare marcate și libere',
      'Instruire PSI periodică',
      'Sistem de detectare și alarmare incendiu'
    ],
    reportingDeadline: '24 ore',
    investigationAuthority: 'ITM',
    statisticsRomania: {
      frequency: 'scăzută',
      severity: 'gravă',
      vulnerableSectors: ['Toate sectoarele']
    }
  },
  {
    id: 'AM017',
    type: 'Înec',
    description: 'Accidente produse prin scufundarea sau căderea în apă cu imposibilitatea respirației',
    commonCauses: [
      'Lipsa echipamentului de salvare (veste, colace)',
      'Lucru în proximitatea apelor fără protecție',
      'Cădere de pe platforme sau structuri peste apă',
      'Condiții meteo nefavorabile',
      'Lipsa instruirii în înot/salvare'
    ],
    preventionMeasures: [
      'Utilizarea obligatorie a vestelor de salvare',
      'Balustrade și parapeți la lucrările peste apă',
      'Prezența personalului instruit în salvare',
      'Colace și frânghii de salvare disponibile',
      'Restricții în funcție de condițiile meteo'
    ],
    reportingDeadline: 'Imediat',
    investigationAuthority: 'parchet',
    statisticsRomania: {
      frequency: 'scăzută',
      severity: 'mortală',
      vulnerableSectors: ['Construcții', 'Transport naval', 'Pescuit']
    }
  },
  {
    id: 'AM018',
    type: 'Înțepături biologice',
    description: 'Leziuni produse de ace, instrumente chirurgicale sau contactul cu materiale biologice contaminate',
    commonCauses: [
      'Manipularea necorespunzătoare a acelor și instrumentelor ascuțite',
      'Lipsa containerelor de eliminare sigură',
      'Repunerea capacului pe ace folosite',
      'Grabă, suprasolicitare a personalului',
      'Lipsa vaccinărilor obligatorii'
    ],
    preventionMeasures: [
      'Utilizarea acelor cu dispozitive de siguranță',
      'Containere speciale pentru deșeuri periculoase',
      'Proceduri clare de manipulare a instrumentelor',
      'Vaccinare hepatită B obligatorie',
      'Proceduri post-expunere bine definite'
    ],
    reportingDeadline: '24 ore',
    investigationAuthority: 'angajator',
    statisticsRomania: {
      frequency: 'medie',
      severity: 'medie',
      vulnerableSectors: ['Sănătate', 'Laboratoare', 'Servicii veterinare']
    }
  },
  {
    id: 'AM019',
    type: 'Mușcături, atacuri de animale',
    description: 'Leziuni produse de animale domestice sau sălbatice în timpul activității profesionale',
    commonCauses: [
      'Lipsa echipamentului de protecție',
      'Manipularea necorespunzătoare a animalelor',
      'Pătrunderea în zone cu animale periculoase',
      'Lipsa instruirii în comportamentul animalelor',
      'Animale stresate sau bolnave'
    ],
    preventionMeasures: [
      'Evaluarea riscurilor specifice activității cu animale',
      'Echipament de protecție adecvat (mănuși groase, bocanci)',
      'Instruire specializată pentru manipularea animalelor',
      'Vaccinare antitetanică și antirabică',
      'Proceduri de izolare și carantină'
    ],
    reportingDeadline: '24 ore',
    investigationAuthority: 'angajator',
    statisticsRomania: {
      frequency: 'scăzută',
      severity: 'medie',
      vulnerableSectors: ['Agricultură', 'Veterinară', 'Păduri', 'Securitate']
    }
  },
  {
    id: 'AM020',
    type: 'Agresiune, violență la locul de muncă',
    description: 'Leziuni fizice sau psihice produse prin agresiune de către alte persoane (colegi, clienți, terți)',
    commonCauses: [
      'Lipsa măsurilor de securitate',
      'Lucru izolat, fără supraveghere',
      'Manipularea numerarului sau a bunurilor valoroase',
      'Contact cu persoane agresive sau sub influența substanțelor',
      'Lipsa instruirii în gestionarea conflictelor'
    ],
    preventionMeasures: [
      'Evaluarea riscurilor de agresiune',
      'Sisteme de supraveghere video și alarmă',
      'Lucru în echipă în zonele cu risc ridicat',
      'Instruire în gestionarea conflictelor și dezescaladare',
      'Protocol de raportare și intervenție'
    ],
    reportingDeadline: '24 ore',
    investigationAuthority: 'angajator',
    statisticsRomania: {
      frequency: 'scăzută',
      severity: 'medie',
      vulnerableSectors: ['Sănătate', 'Învățământ', 'Securitate', 'Retail']
    }
  },
  {
    id: 'AM021',
    type: 'Expunere la radiații',
    description: 'Afecțiuni produse prin expunerea la radiații ionizante sau neionizante peste limitele admise',
    commonCauses: [
      'Lipsa ecranării surselor de radiații',
      'Nerespectarea timpilor de expunere maximă',
      'Defecțiuni ale dozimetrelor sau sistemelor de monitorizare',
      'Acces neautorizat în zone cu radiații',
      'Manipulare necorespunzătoare a surselor radioactive'
    ],
    preventionMeasures: [
      'Autorizare CNCAN pentru lucrătorii expuși',
      'Monitorizare dozimetrică individuală',
      'Delimitarea și marcarea zonelor controlate',
      'Examene medicale specifice periodice',
      'Instruire specială privind protecția radiologică'
    ],
    reportingDeadline: '24 ore',
    investigationAuthority: 'ITM',
    statisticsRomania: {
      frequency: 'scăzută',
      severity: 'gravă',
      vulnerableSectors: ['Sănătate', 'Industrie', 'Cercetare']
    }
  },
  {
    id: 'AM022',
    type: 'Asfixie în spații închise',
    description: 'Lipsă de oxigen sau prezența gazelor toxice în spații închise sau confinate',
    commonCauses: [
      'Lipsa ventilației în spații închise',
      'Acumularea de gaze toxice sau asfixiante',
      'Ardere incompletă, consum de oxigen',
      'Pătrunderea fără testarea atmosferei',
      'Lipsa sistemelor de salvare'
    ],
    preventionMeasures: [
      'Permis de lucru obligatoriu pentru spații închise',
      'Testarea atmosferei înainte și în timpul lucrului',
      'Ventilație forțată continuă',
      'Echipament de protecție respiratorie autonomă',
      'Supraveghere permanentă din exterior și sistem de alarmă'
    ],
    reportingDeadline: 'Imediat',
    investigationAuthority: 'ITM',
    statisticsRomania: {
      frequency: 'scăzută',
      severity: 'mortală',
      vulnerableSectors: ['Construcții', 'Industrie chimică', 'Utilități']
    }
  },
  {
    id: 'AM023',
    type: 'Accidente feroviare',
    description: 'Accidente produse în activitatea feroviară sau în timpul traversării căilor ferate',
    commonCauses: [
      'Nerespectarea semnalelor și regulamentelor de circulație',
      'Traversarea neautorizată a căilor ferate',
      'Defecțiuni ale sistemelor de semnalizare',
      'Vizibilitate redusă',
      'Lipsa concentrării personalului'
    ],
    preventionMeasures: [
      'Autorizare specifică pentru personalul din transportul feroviar',
      'Sisteme de semnalizare și avertizare funcționale',
      'Pasaje special amenajate pentru traversarea căilor',
      'Instruire specializată și examene medicale specifice',
      'Respectarea strictă a programului de odihnă'
    ],
    reportingDeadline: 'Imediat',
    investigationAuthority: 'parchet',
    statisticsRomania: {
      frequency: 'scăzută',
      severity: 'mortală',
      vulnerableSectors: ['Transport feroviar', 'Construcții infrastructură']
    }
  },
  {
    id: 'AM024',
    type: 'Prăbușire de teren, avalanșe',
    description: 'Accidente produse prin alunecări de teren, prăbușiri de excavații sau avalanșe',
    commonCauses: [
      'Lipsa sprijinirilor la excavații',
      'Verificări geotehnice insuficiente',
      'Condiții meteo nefavorabile',
      'Supraîncărcarea marginilor excavației',
      'Vibrații puternice în zona excavației'
    ],
    preventionMeasures: [
      'Studii geotehnice prealabile',
      'Sprijinirea corespunzătoare a pereților excavației',
      'Supraveghere tehnică permanentă',
      'Delimitarea zonelor de siguranță',
      'Restricții în funcție de condițiile meteo'
    ],
    reportingDeadline: 'Imediat',
    investigationAuthority: 'parchet',
    statisticsRomania: {
      frequency: 'scăzută',
      severity: 'mortală',
      vulnerableSectors: ['Construcții', 'Minerit', 'Industrie extractivă']
    }
  },
  {
    id: 'AM025',
    type: 'Accidente în minerit',
    description: 'Accidente specifice activității miniere: explozii de metan, prăbușiri de galerii, intoxicații',
    commonCauses: [
      'Acumularea de gaze explozive (metan, pulberi)',
      'Prăbușirea galeriilor și a lucrărilor miniere',
      'Defecțiuni ale sistemelor de ventilație',
      'Utilizarea necorespunzătoare a explozivilor',
      'Lipsa supravegherii geomecanice'
    ],
    preventionMeasures: [
      'Monitorizare continuă a atmosferei miniere',
      'Sistem de ventilație adecvat și redundant',
      'Sprijinire corespunzătoare a lucrărilor miniere',
      'Autorizații NAMR pentru personalul de exploatare',
      'Echipamente certificate pentru atmosfere explozive'
    ],
    reportingDeadline: 'Imediat',
    investigationAuthority: 'parchet',
    statisticsRomania: {
      frequency: 'scăzută',
      severity: 'mortală',
      vulnerableSectors: ['Minerit', 'Industrie extractivă']
    }
  }
];

/**
 * Utility functions pentru lucrul cu tipurile de accidente
 */

export const getAccidentById = (id: string): TipAccidentMunca | undefined => {
  return tipuriAccidenteMunca.find(acc => acc.id === id);
};

export const getAccidentsBySeverity = (severity: 'ușoară' | 'medie' | 'gravă' | 'mortală'): TipAccidentMunca[] => {
  return tipuriAccidenteMunca.filter(acc => acc.statisticsRomania.severity === severity);
};

export const getAccidentsBySector = (sector: string): TipAccidentMunca[] => {
  return tipuriAccidenteMunca.filter(acc =>
    acc.statisticsRomania.vulnerableSectors.some(s =>
      s.toLowerCase().includes(sector.toLowerCase())
    )
  );
};

export const getAccidentsByAuthority = (authority: 'angajator' | 'ITM' | 'parchet'): TipAccidentMunca[] => {
  return tipuriAccidenteMunca.filter(acc => acc.investigationAuthority === authority);
};

export const getAccidentsByFrequency = (frequency: 'ridicată' | 'medie' | 'scăzută'): TipAccidentMunca[] => {
  return tipuriAccidenteMunca.filter(acc => acc.statisticsRomania.frequency === frequency);
};
