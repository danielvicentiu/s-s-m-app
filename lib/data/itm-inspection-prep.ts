/**
 * ITM Inspection Preparation Checklist
 * Checklist complet pentru pregătirea controlului ITM
 * 30+ puncte de verificare grupate pe categorii
 */

export interface ITMChecklistItem {
  id: string;
  documentName: string;
  legalBasis: string;
  whereToFind: string;
  commonDeficiencies: string[];
  category: 'documente' | 'afisaje' | 'registre' | 'evidente' | 'autorizatii';
  isMandatory: boolean;
  applicableFor?: string; // Toate firmele sau condiții specifice
}

export const itmInspectionChecklist: ITMChecklistItem[] = [
  // === CATEGORIA: DOCUMENTE ===
  {
    id: 'doc-001',
    documentName: 'Plan de Prevenire și Protecție (PPP)',
    legalBasis: 'HG 1425/2006, Art. 8',
    whereToFind: 'Dosarul SSM principal, biroul angajatorului',
    commonDeficiencies: [
      'PPP-ul nu este actualizat (trebuie revizuit anual sau la modificări)',
      'Lipsesc anexele: lista EIP, fișele posturilor cu riscuri',
      'Nu este semnat de angajator și responsabil SSM',
      'Nu conține toate elementele obligatorii: evaluarea riscurilor, măsuri de prevenție, resurse alocate'
    ],
    category: 'documente',
    isMandatory: true,
    applicableFor: 'Toate firmele'
  },
  {
    id: 'doc-002',
    documentName: 'Evaluarea Riscurilor Profesionale',
    legalBasis: 'HG 1425/2006, Art. 9-10',
    whereToFind: 'Dosarul SSM, anexă la PPP',
    commonDeficiencies: [
      'Evaluarea nu acoperă toate locurile de muncă și posturi',
      'Nu sunt identificate riscurile specifice (zgomot, chimice, ergonomice)',
      'Lipsesc matricele de risc sau nu sunt calculate corect',
      'Nu este actualizată după modificări tehnologice sau de personal'
    ],
    category: 'documente',
    isMandatory: true,
    applicableFor: 'Toate firmele'
  },
  {
    id: 'doc-003',
    documentName: 'Contractul de muncă pentru fiecare angajat',
    legalBasis: 'Codul Muncii, Art. 16',
    whereToFind: 'Departamentul HR/Resurse Umane',
    commonDeficiencies: [
      'Contracte nesemnate de ambele părți',
      'Lipsesc acte adiționale pentru modificări salariale sau atribuții',
      'Nu este specificat locul de muncă exact',
      'Contracte CIM neînregistrate la ITM în termen de 20 zile'
    ],
    category: 'documente',
    isMandatory: true,
    applicableFor: 'Toate firmele'
  },
  {
    id: 'doc-004',
    documentName: 'Regulament Intern de Organizare și Funcționare (RIOF)',
    legalBasis: 'Codul Muncii, Art. 241-242',
    whereToFind: 'Dosarul juridic, afișat la avizier',
    commonDeficiencies: [
      'RIOF nu este avizat de sindicat (dacă există) sau reprezentanți angajați',
      'Nu este adus la cunoștința angajaților cu semnătură',
      'Nu conține program de lucru, repaus, regulile specifice firmei',
      'Nu este actualizat când se modifică legislația sau structura firmei'
    ],
    category: 'documente',
    isMandatory: true,
    applicableFor: 'Firme cu minim 21 angajați (recomandat pentru toate)'
  },
  {
    id: 'doc-005',
    documentName: 'Fișa postului pentru fiecare angajat',
    legalBasis: 'Codul Muncii, Art. 17',
    whereToFind: 'Departamentul HR, dosarul personal angajat',
    commonDeficiencies: [
      'Fișele postului nu sunt semnate de angajat (pentru luare la cunoștință)',
      'Nu conțin atribuții clare și specifice postului',
      'Lipsesc riscurile profesionale identificate',
      'Nu sunt actualizate când se modifică atribuțiile'
    ],
    category: 'documente',
    isMandatory: true,
    applicableFor: 'Toate firmele'
  },

  // === CATEGORIA: AFIȘAJE ===
  {
    id: 'afi-001',
    documentName: 'Program de lucru',
    legalBasis: 'Codul Muncii, Art. 111-113',
    whereToFind: 'Avizier la intrarea principală',
    commonDeficiencies: [
      'Programul nu este afișat la loc vizibil',
      'Nu corespunde cu realitatea (ore suplimentare nedeclarate)',
      'Lipsește pentru ture sau schimburi',
      'Nu este semnat de angajator'
    ],
    category: 'afisaje',
    isMandatory: true,
    applicableFor: 'Toate firmele'
  },
  {
    id: 'afi-002',
    documentName: 'Instrucțiuni SSM generale și pe posturi',
    legalBasis: 'HG 1425/2006, Art. 17',
    whereToFind: 'Avizier SSM, la fiecare loc de muncă cu risc',
    commonDeficiencies: [
      'Instrucțiuni generale lipsă sau neactualizate',
      'Nu sunt afișate la posturile cu risc (mașini, substanțe chimice)',
      'Textul este ilizibil sau prea tehnic',
      'Nu sunt traduse în limba angajaților străini'
    ],
    category: 'afisaje',
    isMandatory: true,
    applicableFor: 'Toate firmele'
  },
  {
    id: 'afi-003',
    documentName: 'Planuri de evacuare și semnalizări PSI',
    legalBasis: 'Legea 307/2006, HG 571/2016',
    whereToFind: 'Pe fiecare nivel/sectie, trasee evacuare',
    commonDeficiencies: [
      'Planurile sunt învechite (trebuie actualizate anual)',
      'Nu corespund cu configurația reală a clădirii',
      'Lipsesc săgeți de direcționare evacuare',
      'Semnalizările sunt înnegrite, lipite, deteriorate'
    ],
    category: 'afisaje',
    isMandatory: true,
    applicableFor: 'Toate firmele'
  },
  {
    id: 'afi-004',
    documentName: 'Date de contact responsabil SSM și PSI',
    legalBasis: 'HG 1425/2006, Legea 307/2006',
    whereToFind: 'Avizier principal',
    commonDeficiencies: [
      'Datele de contact sunt vechi sau greșite',
      'Nu sunt afișate nume, telefon, email',
      'Lipsește contactul pentru situații urgente',
      'Nu este actualizat când se schimbă responsabilul'
    ],
    category: 'afisaje',
    isMandatory: true,
    applicableFor: 'Toate firmele'
  },
  {
    id: 'afi-005',
    documentName: 'Autorizația sanitară de funcționare',
    legalBasis: 'Legea 95/2006 (sănătate)',
    whereToFind: 'Avizier, recepție',
    commonDeficiencies: [
      'Autorizația este expirată',
      'Nu este afișată la loc vizibil',
      'Activitățile desfășurate nu corespund cu cele autorizate',
      'Nu se solicită reautorizare la modificări ale spațiului'
    ],
    category: 'afisaje',
    isMandatory: true,
    applicableFor: 'Firme cu activități care necesită aviz sanitar (alimentație, servicii medicale, etc.)'
  },

  // === CATEGORIA: REGISTRE ===
  {
    id: 'reg-001',
    documentName: 'Registrul de Evidență a Salariaților (REVISAL)',
    legalBasis: 'HG 500/2011',
    whereToFind: 'Departamentul HR, online pe revisal.ro',
    commonDeficiencies: [
      'Angajații nu sunt înregistrați în termen (anterior începerii activității)',
      'Date incomplete sau eronate (CIM fără număr, fără post)',
      'Nu sunt raportate modificările (promovări, salarii, concedieri)',
      'Lipsesc acte adiționale în sistem'
    ],
    category: 'registre',
    isMandatory: true,
    applicableFor: 'Toate firmele'
  },
  {
    id: 'reg-002',
    documentName: 'Registrul de Instructaj SSM',
    legalBasis: 'HG 1425/2006, Anexa 2',
    whereToFind: 'Dosarul SSM, biroul responsabil SSM',
    commonDeficiencies: [
      'Registrul nu este numerizat, paginat și semnat pe fiecare pagină',
      'Instructaje incomplete: lipsesc semnături, date, durata',
      'Nu sunt înregistrate toate tipurile: introductiv, la locul de muncă, periodic',
      'Nu respectă periodicitatea: anual pentru risc mediu, semestrial pentru risc ridicat'
    ],
    category: 'registre',
    isMandatory: true,
    applicableFor: 'Toate firmele'
  },
  {
    id: 'reg-003',
    documentName: 'Registrul de Evidență Medicală',
    legalBasis: 'HG 355/2007',
    whereToFind: 'Dosarul medical, HR',
    commonDeficiencies: [
      'Nu sunt înregistrate toate avizele medicale',
      'Avize expirate (valabile 12 luni pentru cei sub 18 ani, 24 luni restul)',
      'Nu se verifică înainte de angajare sau reluare muncă',
      'Lipsesc controalele periodice pentru posturi cu risc'
    ],
    category: 'registre',
    isMandatory: true,
    applicableFor: 'Toate firmele'
  },
  {
    id: 'reg-004',
    documentName: 'Registrul de Evidență a Accidentelor de Muncă',
    legalBasis: 'HG 1425/2006, Anexa 4',
    whereToFind: 'Dosarul SSM',
    commonDeficiencies: [
      'Accidentele nu sunt raportate în termen (24h la ITM)',
      'Lipsesc Procesele Verbale de Cercetare (PVCAM)',
      'Nu se completează REVISAL cu accidentele',
      'Nu sunt luate măsuri de prevenire după accident'
    ],
    category: 'registre',
    isMandatory: true,
    applicableFor: 'Firme care au avut accidente (sau registru gol dar existent)'
  },
  {
    id: 'reg-005',
    documentName: 'Registrul de Evidență a EIP (Echipamente Individuale de Protecție)',
    legalBasis: 'HG 1048/2006',
    whereToFind: 'Dosarul SSM, magazie',
    commonDeficiencies: [
      'Nu se evidențiază distribuirea EIP-urilor cu semnătură',
      'EIP-uri expirate sau neconforme',
      'Nu se respectă durata de utilizare (ex: mănuși 3 luni, bocanci 12 luni)',
      'Nu se înlocuiesc la deteriorare'
    ],
    category: 'registre',
    isMandatory: true,
    applicableFor: 'Toate firmele cu posturi care necesită EIP'
  },
  {
    id: 'reg-006',
    documentName: 'Registrul de pontaj (evidență timp de lucru)',
    legalBasis: 'Codul Muncii, Art. 119',
    whereToFind: 'HR, sistem pontaj electronic sau manual',
    commonDeficiencies: [
      'Pontajul nu este ținut zilnic',
      'Lipsesc semnături ale angajaților',
      'Orele suplimentare nu sunt evidențiate',
      'Nu corespunde cu foi de prezență și state de plată'
    ],
    category: 'registre',
    isMandatory: true,
    applicableFor: 'Toate firmele'
  },

  // === CATEGORIA: EVIDENTE ===
  {
    id: 'evi-001',
    documentName: 'Adeverințe medicale de angajare și avize periodice',
    legalBasis: 'HG 355/2007',
    whereToFind: 'Dosarul personal angajat, HR',
    commonDeficiencies: [
      'Adeverințe expirate',
      'Nu sunt semnate de medic autorizat medicina muncii',
      'Nu conțin restricții sau aptitudini clare',
      'Nu se fac controale periodice conform riscurilor'
    ],
    category: 'evidente',
    isMandatory: true,
    applicableFor: 'Toate firmele'
  },
  {
    id: 'evi-002',
    documentName: 'Fișe de Securitate (FDS) pentru substanțe chimice',
    legalBasis: 'Regulament REACH (CE) 1907/2006',
    whereToFind: 'La locul de depozitare substanțe, dosarul SSM',
    commonDeficiencies: [
      'Lipsesc FDS-urile pentru toate substanțele utilizate',
      'FDS-uri neactualizate (trebuie versiunea curentă de la furnizor)',
      'Nu sunt în limba română',
      'Angajații nu au acces la FDS la locul de muncă'
    ],
    category: 'evidente',
    isMandatory: true,
    applicableFor: 'Firme care utilizează substanțe chimice periculoase'
  },
  {
    id: 'evi-003',
    documentName: 'Certificate de atestare formare profesională SSM',
    legalBasis: 'HG 1425/2006, Ordin 730/2002',
    whereToFind: 'Dosarul personal responsabil SSM',
    commonDeficiencies: [
      'Responsabilul SSM nu are certificat de atestare',
      'Certificatul este expirat (valabil 5 ani)',
      'Nu corespunde nivelului de responsabilitate (S, A, B, C)',
      'Nu există contract de prestări servicii SSM extern'
    ],
    category: 'evidente',
    isMandatory: true,
    applicableFor: 'Toate firmele'
  },
  {
    id: 'evi-004',
    documentName: 'Certificate de calificare pentru lucrători autorizați (sudori, electricieni, etc.)',
    legalBasis: 'HG 1146/2006, legislație ISCIR',
    whereToFind: 'Dosarele personale, evidențe tehnice',
    commonDeficiencies: [
      'Lucrători neautorizați efectuează operațiuni cu risc',
      'Certificate expirate',
      'Nu corespund tipului de echipament utilizat',
      'Lipsesc autorizații ISCIR pentru instalații sub presiune'
    ],
    category: 'evidente',
    isMandatory: true,
    applicableFor: 'Firme cu activități care necesită autorizări (sudură, electrice, ISCIR)'
  },
  {
    id: 'evi-005',
    documentName: 'Dovezi de dotare cu trusa medicală și DEFIBRILATOR (dacă este cazul)',
    legalBasis: 'HG 1425/2006, Ordin MS 1030/2009',
    whereToFind: 'Cabinet medical, punct prim ajutor',
    commonDeficiencies: [
      'Trusa medicală lipsă sau incompletă',
      'Medicamente expirate',
      'Nu este verificată periodic',
      'Lipsește personal instruit pentru prim ajutor (minim 1 persoană la 20 angajați)'
    ],
    category: 'evidente',
    isMandatory: true,
    applicableFor: 'Toate firmele'
  },
  {
    id: 'evi-006',
    documentName: 'Declarații de conformitate EIP și echipamente de lucru',
    legalBasis: 'HG 1048/2006, HG 1029/2008',
    whereToFind: 'Dosarul tehnic echipamente',
    commonDeficiencies: [
      'Lipsesc declarații CE pentru mașini și EIP',
      'Echipamente second-hand fără documentație',
      'Nu sunt verificate tehnic periodic (RTI, lift, etc.)',
      'EIP neomologate sau contrafăcute'
    ],
    category: 'evidente',
    isMandatory: true,
    applicableFor: 'Toate firmele cu echipamente de muncă și EIP'
  },

  // === CATEGORIA: AUTORIZAȚII ===
  {
    id: 'aut-001',
    documentName: 'Autorizație de Securitate la Incendiu (ASI)',
    legalBasis: 'Legea 307/2006, HG 571/2016',
    whereToFind: 'Dosarul PSI, biroul angajatorului',
    commonDeficiencies: [
      'ASI expirată (valabilitate: 3 ani clădiri noi, 1 an pentru existente)',
      'Modificări în spațiu fără reautorizare',
      'Nu corespunde cu planul de evacuare',
      'Lipsesc scenariile de incendiu'
    ],
    category: 'autorizatii',
    isMandatory: true,
    applicableFor: 'Toate firmele (obligatoriu pentru spații comerciale, producție, depozitare)'
  },
  {
    id: 'aut-002',
    documentName: 'Autorizație de mediu (dacă este cazul)',
    legalBasis: 'OUG 195/2005',
    whereToFind: 'Dosarul juridic',
    commonDeficiencies: [
      'Autorizația expirată',
      'Activități neautorizate',
      'Nu se respectă condițiile impuse (emisii, deșeuri)',
      'Nu se raportează conform obligațiilor'
    ],
    category: 'autorizatii',
    isMandatory: true,
    applicableFor: 'Firme cu impact asupra mediului (producție, chimice, deșeuri)'
  },
  {
    id: 'aut-003',
    documentName: 'Autorizație ISCIR pentru echipamente sub presiune',
    legalBasis: 'Legea 122/2002, legislație ISCIR',
    whereToFind: 'Dosarul tehnic, lângă echipament',
    commonDeficiencies: [
      'Autorizații expirate',
      'Verificări tehnice neefectuate la termen',
      'Personal neautorizat operează echipamentele',
      'Lipsesc cărți tehnice ale instalațiilor'
    ],
    category: 'autorizatii',
    isMandatory: true,
    applicableFor: 'Firme cu cazane, compresoare, recipiente sub presiune, lifturi'
  },
  {
    id: 'aut-004',
    documentName: 'Verificări tehnice periodice (RTI) pentru instalații electrice',
    legalBasis: 'Ordin 257/2018',
    whereToFind: 'Dosarul tehnic electric',
    commonDeficiencies: [
      'RTI expirat (verificare anuală obligatorie)',
      'Instalații modificate fără reverificare',
      'Lipsesc măsurători de rezistență, izolație',
      'Nu se remediază deficiențele constatate'
    ],
    category: 'autorizatii',
    isMandatory: true,
    applicableFor: 'Toate firmele cu instalații electrice'
  },
  {
    id: 'aut-005',
    documentName: 'Contract servicii PSI (verificare stingătoare, hidranți, sisteme)',
    legalBasis: 'Legea 307/2006',
    whereToFind: 'Dosarul PSI',
    commonDeficiencies: [
      'Contract PSI expirat sau lipsă',
      'Stingătoare nerevizuite (reverificare anuală)',
      'Hidranți nefuncționali',
      'Sisteme automate de detecție/stingere neîntreținute'
    ],
    category: 'autorizatii',
    isMandatory: true,
    applicableFor: 'Toate firmele'
  },
  {
    id: 'aut-006',
    documentName: 'Notificare ANRE pentru instalații electrice',
    legalBasis: 'Ordin ANRE 257/2018',
    whereToFind: 'Dosarul tehnic electric',
    commonDeficiencies: [
      'Instalații noi nenotificate la ANRE',
      'Modificări majore nedeclarate',
      'Lipsă notificare punere în funcțiune',
      'Nu se respectă termenele de notificare (înainte de punere în funcțiune)'
    ],
    category: 'autorizatii',
    isMandatory: true,
    applicableFor: 'Firme cu instalații electrice noi sau modificate'
  },

  // === DOCUMENTE SUPLIMENTARE ===
  {
    id: 'doc-006',
    documentName: 'Contracte cu furnizori servicii SSM și Medicina Muncii',
    legalBasis: 'HG 1425/2006, HG 355/2007',
    whereToFind: 'Dosarul contracte',
    commonDeficiencies: [
      'Contracte expirate',
      'Nu acoperă toate serviciile necesare',
      'Furnizori neautorizați',
      'Lipsă rapoarte lunare/trimestriale de la consultant'
    ],
    category: 'documente',
    isMandatory: true,
    applicableFor: 'Firme care externalizează serviciile SSM sau medicina muncii'
  },
  {
    id: 'doc-007',
    documentName: 'Proceduri operaționale și instrucțiuni de lucru',
    legalBasis: 'HG 1425/2006',
    whereToFind: 'Dosarul SSM, la fiecare loc de muncă',
    commonDeficiencies: [
      'Proceduri inexistente pentru activități cu risc',
      'Nu sunt aduse la cunoștința angajaților',
      'Nu sunt actualizate',
      'Nu sunt respectate în practică'
    ],
    category: 'documente',
    isMandatory: true,
    applicableFor: 'Toate firmele (obligatoriu pentru activități cu risc ridicat)'
  },
  {
    id: 'evi-007',
    documentName: 'Rapoarte de măsurători: zgomot, iluminat, climă, praf, vibrații',
    legalBasis: 'HG 1091/2006, HG 493/2006',
    whereToFind: 'Dosarul SSM',
    commonDeficiencies: [
      'Nu se efectuează măsurători la expuneri peste limită',
      'Măsurători învechite (trebuie la 2-3 ani sau la modificări)',
      'Nu se iau măsuri corective când sunt depășite limitele',
      'Lipsesc rapoarte de la laboratoare autorizate'
    ],
    category: 'evidente',
    isMandatory: true,
    applicableFor: 'Firme cu expunere la zgomot, vibrații, praf, climă nocivă'
  },
  {
    id: 'reg-007',
    documentName: 'Registrul de procese verbale ITM anterioare',
    legalBasis: 'Ordin ITM',
    whereToFind: 'Dosarul ITM/Inspecții',
    commonDeficiencies: [
      'Nu se păstrează procesele verbale anterioare',
      'Măsurile impuse nu sunt remediate în termen',
      'Nu se raportează finalizarea la ITM',
      'Se repetă aceleași deficiențe la controale succesive'
    ],
    category: 'registre',
    isMandatory: false,
    applicableFor: 'Toate firmele (recomandat pentru istoric)'
  }
];

/**
 * Statistici checklist
 */
export const itmChecklistStats = {
  totalItems: itmInspectionChecklist.length,
  byCategory: {
    documente: itmInspectionChecklist.filter(item => item.category === 'documente').length,
    afisaje: itmInspectionChecklist.filter(item => item.category === 'afisaje').length,
    registre: itmInspectionChecklist.filter(item => item.category === 'registre').length,
    evidente: itmInspectionChecklist.filter(item => item.category === 'evidente').length,
    autorizatii: itmInspectionChecklist.filter(item => item.category === 'autorizatii').length
  },
  mandatoryItems: itmInspectionChecklist.filter(item => item.isMandatory).length
};

/**
 * Filtrare items pe categorie
 */
export const getItemsByCategory = (category: ITMChecklistItem['category']): ITMChecklistItem[] => {
  return itmInspectionChecklist.filter(item => item.category === category);
};

/**
 * Filtrare items obligatorii
 */
export const getMandatoryItems = (): ITMChecklistItem[] => {
  return itmInspectionChecklist.filter(item => item.isMandatory);
};

/**
 * Căutare item după ID
 */
export const getItemById = (id: string): ITMChecklistItem | undefined => {
  return itmInspectionChecklist.find(item => item.id === id);
};

/**
 * Checklist simplificat pentru export/print
 */
export const getSimplifiedChecklist = () => {
  return itmInspectionChecklist.map(item => ({
    categorie: item.category.toUpperCase(),
    document: item.documentName,
    bazaLegala: item.legalBasis,
    obligatoriu: item.isMandatory ? 'DA' : 'NU'
  }));
};
