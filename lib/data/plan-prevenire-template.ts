/**
 * Template pentru Planul de Prevenire și Protecție
 * conform Legii 319/2006 privind securitatea și sănătatea în muncă
 */

export interface PlanPrevenireSection {
  id: string;
  title: string;
  description: string;
  content: string[];
  subsections?: PlanPrevenireSubsection[];
}

export interface PlanPrevenireSubsection {
  id: string;
  title: string;
  content: string[];
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

export const planPrevenireTemplate: PlanPrevenireSection[] = [
  {
    id: 'date-generale',
    title: '1. Date generale privind unitatea',
    description: 'Informații de identificare a organizației și a activității desfășurate',
    content: [
      'Denumirea unității: [Completați]',
      'Adresa sediului social: [Completați]',
      'Cod unic de înregistrare (CUI): [Completați]',
      'Nr. de înregistrare la Registrul Comerțului: [Completați]',
      'Reprezentant legal: [Completați]',
      'Cod CAEN: [Completați]',
      'Activitatea principală: [Completați]',
      'Număr total de salariați: [Completați]',
      'Program de lucru: [Completați]',
    ],
  },
  {
    id: 'evaluare-riscuri',
    title: '2. Evaluarea riscurilor profesionale',
    description: 'Identificarea și evaluarea tuturor riscurilor pentru securitatea și sănătatea lucrătorilor',
    content: [
      'Procesul de evaluare a riscurilor s-a desfășurat conform cerințelor Hotărârii Guvernului nr. 1425/2006.',
      'Au fost identificate și evaluate următoarele categorii de riscuri:',
    ],
    subsections: [
      {
        id: 'riscuri-fizice',
        title: '2.1. Riscuri fizice',
        content: [
          '- Zgomot (expunere la niveluri de zgomot peste 80 dB)',
          '- Vibrații (transmise la mâini sau la corp)',
          '- Iluminat deficient sau excesiv',
          '- Microclimă necorespunzătoare (temperatură, umiditate, curenți de aer)',
          '- Radiații (ionizante sau neionizante)',
          '- Presiune barometrică anormală',
        ],
      },
      {
        id: 'riscuri-chimice',
        title: '2.2. Riscuri chimice',
        content: [
          '- Expunere la substanțe și preparate chimice periculoase',
          '- Pulberi, fum, vapori, gaze',
          '- Agenți cancerigeni și mutageni',
          '- Substanțe iritante, corozive, toxice',
        ],
      },
      {
        id: 'riscuri-biologice',
        title: '2.3. Riscuri biologice',
        content: [
          '- Expunere la agenți biologici (bacterii, viruși, ciuperci)',
          '- Contaminare biologică',
          '- Alergeni biologici',
        ],
      },
      {
        id: 'riscuri-ergonomice',
        title: '2.4. Riscuri ergonomice',
        content: [
          '- Manipulare manuală de sarcini',
          '- Poziții forțate sau prelungite',
          '- Mișcări repetitive',
          '- Efort fizic intens',
          '- Solicitări ale aparatului vizual (lucru la calculator)',
        ],
      },
      {
        id: 'riscuri-psihosociale',
        title: '2.5. Riscuri psihosociale',
        content: [
          '- Stres profesional',
          '- Hărțuire morală (mobbing)',
          '- Hărțuire sexuală',
          '- Violență la locul de muncă',
          '- Program de lucru prelungit',
          '- Lucru în izolare',
        ],
      },
      {
        id: 'riscuri-mecanice',
        title: '2.6. Riscuri mecanice',
        content: [
          '- Accidente prin lovire de obiecte în mișcare',
          '- Accidente prin contact cu organe în mișcare',
          '- Căderi de la înălțime',
          '- Căderi de pe același nivel',
          '- Accidente prin prindere, strivire',
          '- Tăiere, înțepare',
        ],
      },
      {
        id: 'riscuri-electrice',
        title: '2.7. Riscuri electrice',
        content: [
          '- Electrocutare prin contact direct',
          '- Electrocutare prin contact indirect',
          '- Arc electric',
          '- Electricitate statică',
        ],
      },
      {
        id: 'riscuri-incendiu',
        title: '2.8. Riscuri de incendiu și explozie',
        content: [
          '- Incendiu din cauze electrice',
          '- Incendiu provocat de substanțe inflamabile',
          '- Explozie',
          '- Arderi',
        ],
      },
    ],
  },
  {
    id: 'masuri-tehnice',
    title: '3. Măsuri tehnice de prevenire și protecție',
    description: 'Măsuri de natură tehnică pentru eliminarea sau reducerea riscurilor identificate',
    content: [
      'Pentru prevenirea și protecția împotriva riscurilor identificate se implementează următoarele măsuri tehnice:',
    ],
    subsections: [
      {
        id: 'masuri-eliminare',
        title: '3.1. Măsuri de eliminare a riscurilor',
        content: [
          '- Înlocuirea proceselor, utilajelor sau substanțelor periculoase cu altele nepericuloase sau mai puțin periculoase',
          '- Automatizarea operațiilor periculoase',
          '- Eliminarea factorilor de risc la sursă',
        ],
      },
      {
        id: 'masuri-control',
        title: '3.2. Măsuri de control tehnic',
        content: [
          '- Dispozitive de protecție la mașini și utilaje (protecții fixe, mobile, reglabile)',
          '- Sisteme de ventilație și exhaustare',
          '- Sisteme de iluminat adecvat',
          '- Sisteme de protecție împotriva zgomotului și vibrațiilor',
          '- Sisteme de etanșare și izolare',
          '- Dispozitive de blocare și semnalizare',
          '- Dispozitive de oprire de urgență',
        ],
      },
      {
        id: 'masuri-intretinere',
        title: '3.3. Mentenanță și verificări periodice',
        content: [
          '- Program de întreținere preventivă pentru echipamente și instalații',
          '- Verificări tehnice periodice conform normelor în vigoare',
          '- Verificări ISCIR pentru echipamente sub presiune și de ridicat',
          '- Verificări ale instalațiilor electrice',
          '- Înregistrarea și monitorizarea defecțiunilor',
        ],
      },
    ],
  },
  {
    id: 'masuri-organizatorice',
    title: '4. Măsuri organizatorice de prevenire și protecție',
    description: 'Măsuri de natură organizatorică pentru asigurarea securității și sănătății în muncă',
    content: [
      'Măsurile organizatorice stabilite pentru prevenirea accidentelor și îmbolnăvirilor profesionale:',
    ],
    subsections: [
      {
        id: 'organizare-ssm',
        title: '4.1. Organizarea activității de SSM',
        content: [
          '- Desemnarea lucrătorilor responsabili cu activitatea de SSM sau contractarea serviciilor externe',
          '- Constituirea Comitetului de Securitate și Sănătate în Muncă (dacă sunt minimum 50 de salariați)',
          '- Desemnarea lucrătorilor pentru acordarea primului ajutor, stingerea incendiilor și evacuarea lucrătorilor',
          '- Stabilirea atribuțiilor și responsabilităților în domeniul SSM',
        ],
      },
      {
        id: 'proceduri-lucru',
        title: '4.2. Proceduri și instrucțiuni de lucru',
        content: [
          '- Elaborarea și implementarea procedurilor de lucru în siguranță',
          '- Elaborarea instrucțiunilor proprii de securitate și sănătate în muncă pentru fiecare loc de muncă',
          '- Elaborarea planurilor de acțiune în caz de urgență',
          '- Stabilirea unui sistem de permise de lucru pentru activități cu risc ridicat',
        ],
      },
      {
        id: 'organizare-timp',
        title: '4.3. Organizarea timpului de lucru',
        content: [
          '- Respectarea timpului legal de muncă și a perioadelor de odihnă',
          '- Organizarea pauzelor pentru lucrările care solicită efort fizic sau concentrare prelungită',
          '- Limitarea orelor suplimentare',
          '- Rotația lucrătorilor expuși la riscuri profesionale',
        ],
      },
      {
        id: 'acces-spatii',
        title: '4.4. Controlul accesului',
        content: [
          '- Restricționarea accesului în zonele cu riscuri deosebite doar pentru personalul autorizat',
          '- Semnalizarea zonelor periculoase',
          '- Închiderea și/sau supravegherea zonelor cu risc ridicat',
        ],
      },
      {
        id: 'coordonare-activitati',
        title: '4.5. Coordonarea activităților',
        content: [
          '- Coordonarea activităților în cazul prezenței mai multor angajatori în același loc de muncă',
          '- Informarea reciprocă despre riscurile prezente',
          '- Coordonarea măsurilor de prevenire și protecție',
        ],
      },
    ],
  },
  {
    id: 'instruire',
    title: '5. Instruirea lucrătorilor',
    description: 'Programul de instruire și informare a lucrătorilor în domeniul SSM',
    content: [
      'Toate persoanele care desfășoară activitate în unitate primesc instruire adecvată în domeniul securității și sănătății în muncă.',
    ],
    subsections: [
      {
        id: 'tipuri-instruire',
        title: '5.1. Tipuri de instruire',
        content: [
          '- Instruire la angajare (instruire introductiv-generală și la locul de muncă)',
          '- Instruire periodică (conform HG 1425/2006: anual, semestrial, trimestrial sau lunar în funcție de gradul de risc)',
          '- Instruire la schimbarea locului de muncă sau la modificarea tehnologiei',
          '- Instruire în cazul introducerii de noi echipamente de muncă sau substanțe periculoase',
        ],
        tableData: {
          headers: ['Tip instruire', 'Periodicitate', 'Responsabil', 'Documente'],
          rows: [
            ['Introductiv-generală', 'La angajare', 'Responsabil SSM', 'Fișă instruire generală'],
            ['La locul de muncă', 'La angajare', 'Șef direct + SSM', 'Fișă instruire specifică'],
            ['Periodică', 'Conform clasificării', 'Șef direct + SSM', 'Fișă instruire periodică'],
            ['La reluarea activității', 'După >30 zile absență', 'Șef direct', 'Fișă instruire'],
          ],
        },
      },
      {
        id: 'continut-instruire',
        title: '5.2. Conținutul instruirii',
        content: [
          '- Legislația în domeniul securității și sănătății în muncă',
          '- Riscurile profesionale specifice locului de muncă',
          '- Măsuri de prevenire și protecție',
          '- Utilizarea corectă a echipamentelor de muncă',
          '- Utilizarea echipamentelor individuale de protecție',
          '- Proceduri de urgență (incendiu, evacuare, acordare prim ajutor)',
          '- Drepturi și obligații ale lucrătorilor în domeniul SSM',
        ],
      },
      {
        id: 'evaluare-instruire',
        title: '5.3. Evaluarea eficienței instruirii',
        content: [
          '- Verificarea înțelegerii informațiilor primite prin teste scrise sau orale',
          '- Consemnarea instruirii în fișe individuale de instruire',
          '- Semnarea fișelor de către instructor și persoana instruită',
          '- Păstrarea fișelor de instruire în dosarul personal',
        ],
      },
    ],
  },
  {
    id: 'supraveghere-sanatate',
    title: '6. Supravegherea sănătății lucrătorilor',
    description: 'Măsuri pentru monitorizarea stării de sănătate a lucrătorilor',
    content: [
      'Supravegherea sănătății lucrătorilor se realizează în conformitate cu prevederile Legii 319/2006 și HG 355/2007.',
    ],
    subsections: [
      {
        id: 'control-medical',
        title: '6.1. Controlul medical',
        content: [
          '- Control medical la angajare (obligatoriu pentru toți lucrătorii)',
          '- Controlul medical periodic (conform HG 355/2007 și riscurilor identificate)',
          '- Control medical la reluarea activității după o absență > 90 zile',
          '- Examinări medicale suplimentare la solicitarea lucrătorului sau a medicului de medicina muncii',
        ],
      },
      {
        id: 'periodicitate-control',
        title: '6.2. Periodicitatea controalelor medicale',
        content: [
          'Periodicitatea controalelor medicale se stabilește în funcție de:',
          '- Factorii de risc la care este expus lucrătorul',
          '- Vârsta lucrătorului',
          '- Starea de sănătate a lucrătorului',
          '- Recomandările medicului de medicina muncii',
        ],
        tableData: {
          headers: ['Categorie personal', 'Periodicitate', 'Observații'],
          rows: [
            ['Lucrători expuși la riscuri', 'Conform factorului de risc', 'Între 6 luni - 5 ani'],
            ['Lucrători < 18 ani', 'Anual', 'Control obligatoriu'],
            ['Personal administrativ', 'La 2-5 ani', 'Funcție de vârstă și risc'],
            ['Femei gravide', 'La solicitare', 'Evaluare condiții de muncă'],
          ],
        },
      },
      {
        id: 'documente-medicale',
        title: '6.3. Documente medicale',
        content: [
          '- Fișa de aptitudine medicală (eliberată de medicul de medicina muncii)',
          '- Dosar medical individual (păstrat la medicul de medicina muncii)',
          '- Recomandări speciale pentru adaptarea locului de muncă (dacă este cazul)',
          '- Aviz epidemiologic (pentru industria alimentară și domenii similare)',
        ],
      },
      {
        id: 'masuri-sanatate',
        title: '6.4. Măsuri de protecție a sănătății',
        content: [
          '- Adaptarea locului de muncă la recomandările medicului de medicina muncii',
          '- Schimbarea locului de muncă în cazul contraindicațiilor medicale',
          '- Asigurarea pauzelor și a condițiilor de odihnă',
          '- Asigurarea alimentației de protecție (dacă este cazul)',
          '- Monitorizarea stării de sănătate a lucrătorilor expuși la factori de risc',
        ],
      },
    ],
  },
  {
    id: 'echipamente-protectie',
    title: '7. Echipamente individuale de protecție (EIP)',
    description: 'Dotarea lucrătorilor cu echipamente individuale de protecție adecvate',
    content: [
      'Echipamentele individuale de protecție se acordă conform HG 1048/2006 și normelor specifice domeniului de activitate.',
    ],
    subsections: [
      {
        id: 'principii-eip',
        title: '7.1. Principii generale',
        content: [
          '- EIP se acordă gratuit lucrătorilor',
          '- EIP se utilizează doar când riscurile nu pot fi evitate sau reduse suficient prin mijloace tehnice sau organizatorice',
          '- EIP trebuie să fie adecvate riscurilor, să nu genereze riscuri suplimentare și să fie ergonomice',
          '- EIP trebuie să fie certificate conform normelor europene',
        ],
      },
      {
        id: 'tipuri-eip',
        title: '7.2. Categorii de echipamente individuale de protecție',
        content: [
          'Protecția capului: căști de protecție, bonete, berete',
          'Protecția ochilor și feței: ochelari, ecrane faciale, măști de sudură',
          'Protecția auditivă: dopuri antibruit, căști antifonice',
          'Protecția respiratorie: măști, semimăști, aparate de protecție respiratorie',
          'Protecția mâinilor și brațelor: mănuși de protecție (mecanică, chimică, termică)',
          'Protecția picioarelor: încălțăminte de protecție, cizme, bocanci',
          'Protecția corpului: îmbrăcăminte de protecție, șorțuri, combinezoane',
          'Protecția împotriva căderilor: centuri, harnașamente, dispozitive antialunecare',
          'Protecția pielii: creme de protecție',
        ],
      },
      {
        id: 'acordare-eip',
        title: '7.3. Acordarea și evidența EIP',
        content: [
          '- Stabilirea necesarului de EIP pe baza evaluării riscurilor',
          '- Întocmirea normelor de dotare cu EIP pe categorii de personal',
          '- Achiziționarea EIP certificate',
          '- Instruirea lucrătorilor privind utilizarea corectă a EIP',
          '- Evidența acordării EIP în fișe individuale',
          '- Consemnarea în fișe a datei acordării, tipului de EIP, producătorului',
        ],
        tableData: {
          headers: ['Loc de muncă', 'EIP necesare', 'Normă dotare', 'Observații'],
          rows: [
            ['[Exemplu: Electrician]', 'Cască, mănuși dielectrice, încălțăminte', '1 buc/2 ani', 'Conform HG 1048/2006'],
            ['[Exemplu: Operator producție]', 'Cască, ochelari, mănuși, încălțăminte', '1 buc/an', 'Funcție de uzură'],
            ['[Completați]', '[Completați]', '[Completați]', '[Completați]'],
          ],
        },
      },
      {
        id: 'intretinere-eip',
        title: '7.4. Întreținerea și înlocuirea EIP',
        content: [
          '- Curățarea și dezinfectarea periodică a EIP',
          '- Verificarea stării tehnice a EIP înainte de utilizare',
          '- Înlocuirea EIP deteriorate sau uzate',
          '- Depozitarea corespunzătoare a EIP',
          '- Instruirea privind întreținerea EIP',
        ],
      },
    ],
  },
  {
    id: 'semnalizare',
    title: '8. Semnalizarea de securitate și sănătate în muncă',
    description: 'Asigurarea semnalizării adecvate a riscurilor și obligațiilor de securitate',
    content: [
      'Semnalizarea de securitate se realizează conform HG 971/2006 pentru atenționarea și avertizarea lucrătorilor asupra riscurilor.',
    ],
    subsections: [
      {
        id: 'tipuri-semnalizare',
        title: '8.1. Tipuri de semnalizare',
        content: [
          'Indicatoare permanente: panouri de avertizare, interzicere, obligație, salvare, stingere incendii',
          'Semnalizare luminoasă: semnale luminoase intermitente sau continue pentru situații de urgență',
          'Semnalizare acustică: sirene, alarme, semnale sonore',
          'Marcaje de securitate: marcarea căilor de circulație, a zonelor periculoase, a obstacolelor',
          'Semnalizare gestuală: semnale gestuale pentru manevra vehiculelor, utilajelor',
        ],
      },
      {
        id: 'plasare-indicatoare',
        title: '8.2. Plasarea indicatoarelor',
        content: [
          'Indicatoare de interzicere: Acces interzis persoanelor neautorizate, Fumatul interzis, Nu atingeți',
          'Indicatoare de avertizare: Pericol substanțe toxice, Pericol de electrocutare, Pericol de incendiu, Atenție căi de circulație',
          'Indicatoare de obligație: Purtarea obligatorie a căștii, Purtarea obligatorie a ochelarilor, Purtarea obligatorie a mănușilor',
          'Indicatoare de salvare: Ieșire de urgență, Punct de întrunire, Cutie de prim ajutor, Dușuri de siguranță',
          'Indicatoare pentru stingerea incendiilor: Stingător, Hidrант, Telefon de urgență',
        ],
      },
      {
        id: 'planuri-amplasare',
        title: '8.3. Planuri de amplasare',
        content: [
          '- Planuri de amplasare a indicatoarelor de securitate pentru fiecare zonă',
          '- Planuri de evacuare afișate vizibil',
          '- Marcarea căilor de evacuare și a ieșirilor de urgență',
          '- Verificarea periodică a vizibilității și stării indicatoarelor',
        ],
      },
    ],
  },
  {
    id: 'prim-ajutor',
    title: '9. Acordarea primului ajutor',
    description: 'Măsuri organizatorice pentru asigurarea primului ajutor în caz de accidente',
    content: [
      'Organizarea acordării primului ajutor în conformitate cu prevederile Ordinului 1030/2006.',
    ],
    subsections: [
      {
        id: 'personal-prim-ajutor',
        title: '9.1. Personal desemnat',
        content: [
          '- Desemnarea lucrătorilor pentru acordarea primului ajutor (minimum 1 persoană la 50 de lucrători sau 1 persoană pe schimb)',
          '- Pregătirea personalului desemnat prin cursuri de prim ajutor',
          '- Actualizarea cunoștințelor prin cursuri periodice (la 2-3 ani)',
          '- Afișarea nominalizării persoanelor desemnate la locurile vizibile',
        ],
      },
      {
        id: 'dotari-prim-ajutor',
        title: '9.2. Dotări pentru acordarea primului ajutor',
        content: [
          '- Truse de prim ajutor complet echipate',
          '- Amplasarea truselor în locuri accesibile și semnalizate',
          '- Verificarea și completarea periodică a truselor',
          '- Targă de transport victime (dacă este cazul)',
          '- Duș de siguranță și spălător de ochi (pentru expunere la substanțe chimice)',
        ],
        tableData: {
          headers: ['Locație', 'Tip dotare', 'Cantitate', 'Responsabil verificare'],
          rows: [
            ['[Exemplu: Birou]', 'Trusă prim ajutor', '1 buc', '[Nume responsabil]'],
            ['[Exemplu: Atelier]', 'Trusă prim ajutor, spălător ochi', '1+1', '[Nume responsabil]'],
            ['[Completați]', '[Completați]', '[Completați]', '[Completați]'],
          ],
        },
      },
      {
        id: 'procedura-urgenta',
        title: '9.3. Procedura de urgență',
        content: [
          '- Evaluarea situației și asigurarea securității intervenientului',
          '- Anunțarea imediată a persoanelor desemnate pentru prim ajutor',
          '- Anunțarea serviciilor de urgență (112)',
          '- Acordarea primului ajutor până la sosirea echipajului medical',
          '- Înștiințarea conducerii și a responsabilului SSM',
          '- Înregistrarea evenimentului în registrul de evidență',
        ],
      },
      {
        id: 'numere-urgenta',
        title: '9.4. Numere de urgență',
        content: [
          'Număr unic de urgență: 112',
          'Ambulanță: 112',
          'Pompieri: 112',
          'Poliție: 112',
          'Responsabil SSM: [Completați număr telefon]',
          'Manager: [Completați număr telefon]',
          'Persoane desemnate prim ajutor: [Completați numere telefon]',
        ],
      },
    ],
  },
  {
    id: 'situatii-urgenta',
    title: '10. Proceduri în situații de urgență',
    description: 'Măsuri de prevenire și planuri de acțiune pentru situații de urgență',
    content: [
      'Planuri de acțiune stabilite pentru situații de urgență (incendiu, evacuare, accident grav).',
    ],
    subsections: [
      {
        id: 'prevenire-incendiu',
        title: '10.1. Prevenirea și combaterea incendiilor',
        content: [
          '- Desemnarea lucrătorilor pentru prevenirea și stingerea incendiilor',
          '- Instruirea periodică a lucrătorilor desemnați',
          '- Dotarea cu mijloace de stingere a incendiilor (stingătoare, hidranți)',
          '- Verificarea periodică a mijloacelor de stingere',
          '- Menținerea liberă a căilor de evacuare și a ieșirilor de urgență',
          '- Interzicerea fumatului în zonele cu risc de incendiu',
        ],
      },
      {
        id: 'plan-evacuare',
        title: '10.2. Planul de evacuare',
        content: [
          '- Întocmirea planurilor de evacuare pentru toate spațiile',
          '- Stabilirea căilor de evacuare și a punctelor de întrunire',
          '- Afișarea planurilor de evacuare la locuri vizibile',
          '- Organizarea de exerciții de evacuare (minimum anual)',
          '- Desemnarea persoanelor care coordonează evacuarea',
          '- Verificarea existenței și funcționării sistemelor de alarmă',
        ],
      },
      {
        id: 'accidente-grave',
        title: '10.3. Proceduri în caz de accident grav',
        content: [
          '- Oprirea imediată a lucrului și asigurarea zonei',
          '- Anunțarea serviciilor de urgență (112)',
          '- Acordarea primului ajutor victimei',
          '- Anunțarea conducerii și a responsabilului SSM',
          '- Conservarea locului accidentului până la finalizarea cercetării',
          '- Constituirea comisiei de cercetare a accidentului',
          '- Raportarea accidentului către ITM în termen de 24 ore',
        ],
      },
      {
        id: 'deversari-scurgeri',
        title: '10.4. Proceduri în caz de deversări/scurgeri',
        content: [
          '- Oprirea sursei de deversare (dacă este posibil în condiții de siguranță)',
          '- Izolarea zonei și limitarea accesului',
          '- Utilizarea EIP adecvate de către intervenienti',
          '- Ventilarea zonei (pentru vapori/gaze)',
          '- Colectarea și neutralizarea substanței deversate',
          '- Anunțarea autorităților competente (dacă este cazul)',
        ],
      },
    ],
  },
  {
    id: 'monitorizare-revizuire',
    title: '11. Monitorizare și revizuire',
    description: 'Proceduri de monitorizare a implementării și actualizare a planului',
    content: [
      'Planul de Prevenire și Protecție se revizuiește periodic și ori de câte ori apar modificări semnificative.',
    ],
    subsections: [
      {
        id: 'monitorizare',
        title: '11.1. Monitorizarea implementării',
        content: [
          '- Verificări periodice ale implementării măsurilor prevăzute',
          '- Audituri interne de securitate și sănătate în muncă',
          '- Analizarea indicatorilor de performanță SSM',
          '- Raportări periodice către conducere',
        ],
      },
      {
        id: 'revizuire',
        title: '11.2. Revizuirea planului',
        content: [
          'Planul se revizuiește în următoarele situații:',
          '- Anual sau la intervale mai scurte stabilite de angajator',
          '- La modificarea proceselor de producție sau a tehnologiilor',
          '- La introducerea de noi echipamente, substanțe sau materiale',
          '- După producerea unui accident de muncă sau a unei boli profesionale',
          '- La modificări legislative',
          '- La recomandarea inspectorului de muncă sau a medicului de medicina muncii',
        ],
      },
      {
        id: 'responsabilitati',
        title: '11.3. Responsabilități',
        content: [
          'Angajatorul: asigură resursele necesare implementării planului',
          'Responsabil SSM: coordonează implementarea și monitorizarea planului',
          'Șefii de compartiment: aplică măsurile în subordine și supraveghează respectarea lor',
          'Lucrători: respectă măsurile de SSM și utilizează corect EIP',
          'Comitetul de SSM: monitorizează implementarea și propune îmbunătățiri',
        ],
      },
    ],
  },
  {
    id: 'anexe',
    title: '12. Anexe',
    description: 'Documente suport pentru Planul de Prevenire și Protecție',
    content: [
      'Anexa 1: Fișa unității pentru evaluarea riscurilor',
      'Anexa 2: Registrul de evaluare a riscurilor',
      'Anexa 3: Fișele individuale de instruire',
      'Anexa 4: Normele de dotare cu echipamente individuale de protecție',
      'Anexa 5: Fișele de evidență a EIP',
      'Anexa 6: Planurile de evacuare',
      'Anexa 7: Lista persoanelor desemnate (prim ajutor, PSI, evacuare)',
      'Anexa 8: Programul de verificări și controale periodice',
      'Anexa 9: Proceduri operaționale de lucru în siguranță',
      'Anexa 10: Registrul de evidență a controalelor medicale',
    ],
  },
  {
    id: 'aprobare',
    title: 'Aprobare',
    description: 'Semnături și validare document',
    content: [
      'Planul de Prevenire și Protecție a fost întocmit în conformitate cu prevederile Legii 319/2006 și HG 1425/2006.',
      '',
      'Întocmit de:',
      'Nume și prenume: [Completați]',
      'Funcția: Responsabil SSM / Serviciu SSM extern',
      'Semnătura: _________________',
      'Data: [Completați]',
      '',
      'Avizat de către Comitetul de Securitate și Sănătate în Muncă:',
      'Președinte CSSM: _________________',
      'Data: [Completați]',
      '',
      'Aprobat de:',
      'Nume și prenume: [Completați]',
      'Funcția: Director / Reprezentant legal',
      'Semnătura: _________________',
      'Data: [Completați]',
      '',
      'Ștampila unității',
    ],
  },
];

/**
 * Funcție helper pentru export PDF sau generare document
 */
export function getPlanPrevenireFullText(): string {
  let fullText = 'PLAN DE PREVENIRE ȘI PROTECȚIE\n';
  fullText += 'conform Legii 319/2006 privind securitatea și sănătatea în muncă\n\n';
  fullText += '═'.repeat(80) + '\n\n';

  planPrevenireTemplate.forEach((section) => {
    fullText += `${section.title}\n`;
    fullText += '─'.repeat(80) + '\n';
    fullText += `${section.description}\n\n`;

    section.content.forEach((line) => {
      fullText += `${line}\n`;
    });

    if (section.subsections) {
      section.subsections.forEach((subsection) => {
        fullText += `\n${subsection.title}\n`;
        subsection.content.forEach((line) => {
          fullText += `${line}\n`;
        });

        if (subsection.tableData) {
          fullText += '\n';
          // Formatare tabel simplu
          fullText += subsection.tableData.headers.join(' | ') + '\n';
          fullText += '─'.repeat(80) + '\n';
          subsection.tableData.rows.forEach((row) => {
            fullText += row.join(' | ') + '\n';
          });
        }

        fullText += '\n';
      });
    }

    fullText += '\n';
  });

  return fullText;
}

/**
 * Export nume secțiuni pentru navigare
 */
export function getPlanPrevenireSectionTitles(): Array<{ id: string; title: string }> {
  return planPrevenireTemplate.map((section) => ({
    id: section.id,
    title: section.title,
  }));
}
