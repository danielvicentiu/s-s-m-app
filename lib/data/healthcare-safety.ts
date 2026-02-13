/**
 * Healthcare Safety Requirements (SSM Sector Medical)
 * Cerințe specifice SSM pentru unitățile sanitare
 *
 * Acoperă: risc biologic (Directiva 2000/54/CE), ace și obiecte ascuțite,
 * radiații ionizante, manipulare pacienți, chimioterapice, stres/burnout,
 * agresiune pacienți, EIP medical specific
 */

export interface HealthcareSafetyRequirement {
  id: string;
  category: 'biological' | 'sharps' | 'radiation' | 'patient_handling' | 'chemical' | 'psychosocial' | 'emergency';
  title: string;
  description: string;
  legalBasis: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  applicableRoles: string[];
  requiredActions: string[];
  inspectionChecklist: string[];
  documentation: string[];
}

export const healthcareSafetyRequirements: HealthcareSafetyRequirement[] = [
  // RISC BIOLOGIC - Directiva 2000/54/CE
  {
    id: 'HC-BIO-001',
    category: 'biological',
    title: 'Evaluarea riscului biologic conform Directiva 2000/54/CE',
    description: 'Identificarea și evaluarea agenților biologici din grupele 2, 3 și 4 la care sunt expuși lucrătorii din domeniul medical',
    legalBasis: 'Directiva 2000/54/CE transpusă prin HG 1092/2006',
    riskLevel: 'critical',
    applicableRoles: ['medici', 'asistente medicale', 'infirmiere', 'laboranți', 'personal curățenie'],
    requiredActions: [
      'Evaluare risc biologic pentru fiecare post de lucru',
      'Clasificare agenți biologici (HIV, hepatită B/C, tuberculoză, etc.)',
      'Măsuri de confinare specifice fiecărui grup de risc',
      'Proceduri scrise pentru manipulare agenți biologici',
      'Monitorizare expunere și supraveghere medicală',
      'Registru lucrători expuși la agenți biologici grupa 3 și 4'
    ],
    inspectionChecklist: [
      'Fișa de evaluare risc biologic completată și actualizată',
      'Lista agenților biologici identificați pe grupe',
      'Proceduri de lucru în condiții de biosecuritate',
      'Registru lucrători expuși (dacă aplicabil)',
      'Protocol vaccinare hepatită B pentru personalul expus',
      'Măsuri de igienă și dezinfecție implementate'
    ],
    documentation: [
      'Evaluare risc biologic',
      'Proceduri biosecuritate',
      'Registru expunere agenți biologici',
      'Protocol vaccinare',
      'Fișe date siguranță dezinfectanți'
    ]
  },

  // ACE ȘI OBIECTE ASCUȚITE
  {
    id: 'HC-SHARPS-001',
    category: 'sharps',
    title: 'Prevenirea accidentelor cu ace și obiecte ascuțite',
    description: 'Implementarea Directivei 2010/32/UE privind prevenirea accidentelor cu obiecte ascuțite în sectorul medical',
    legalBasis: 'Directiva 2010/32/UE, HG 1092/2006',
    riskLevel: 'critical',
    applicableRoles: ['medici', 'asistente medicale', 'laboranți'],
    requiredActions: [
      'Utilizare ace și catere cu dispozitiv de siguranță',
      'Containere rigide pentru colectare obiecte ascuțite',
      'Interdicție recapișonare ace',
      'Protocol post-expunere (PPE) pentru accidente cu ace',
      'Instruire specifică manipulare obiecte ascuțite',
      'Raportare obligatorie accidente cu obiecte ascuțite',
      'Vaccinare hepatită B pentru personalul expus'
    ],
    inspectionChecklist: [
      'Dispozitive medicale cu sistem de siguranță disponibile',
      'Containere rigide pentru ace poziționate corect',
      'Protocol PPE afișat și cunoscut de personal',
      'Registru accidente cu obiecte ascuțite',
      'Dovezi instruire personal (manipulare ace)',
      'Situație vaccinare hepatită B',
      'Proceduri eliminare deșeuri periculoase'
    ],
    documentation: [
      'Procedură manipulare obiecte ascuțite',
      'Protocol post-expunere (PPE)',
      'Registru accidente',
      'Certificat instruire',
      'Dovezi vaccinare hepatită B'
    ]
  },

  {
    id: 'HC-SHARPS-002',
    category: 'sharps',
    title: 'Gestionarea deșeurilor medicale periculoase',
    description: 'Colectare, stocare și eliminare deșeuri infecțioase și obiecte ascuțite conform normelor sanitar',
    legalBasis: 'Ordinul MS 1226/2012, Legea 211/2011',
    riskLevel: 'high',
    applicableRoles: ['asistente medicale', 'infirmiere', 'personal curățenie'],
    requiredActions: [
      'Separare deșeuri pe categorii (infecțioase, ascuțite, chimice)',
      'Recipiente/saci omologați cu marcaj corespunzător',
      'Spațiu dedicat stocare temporară deșeuri',
      'Contract firmă autorizată colectare deșeuri medicale',
      'Registru evidență deșeuri medicale',
      'Instruire personal privind gestionarea deșeurilor'
    ],
    inspectionChecklist: [
      'Recipiente/saci omologați pentru fiecare categorie',
      'Marcaj și etichetare corectă deșeuri',
      'Spațiu stocare deșeuri adecvat (ventilat, securizat)',
      'Contract firmă autorizată deșeuri medicale',
      'Registru deșeuri completat',
      'Certificat instruire personal'
    ],
    documentation: [
      'Procedură gestionare deșeuri medicale',
      'Contract firmă autorizată',
      'Registru deșeuri',
      'Certificat instruire'
    ]
  },

  // RADIAȚII IONIZANTE
  {
    id: 'HC-RAD-001',
    category: 'radiation',
    title: 'Protecția lucrătorilor expuși la radiații ionizante',
    description: 'Măsuri de protecție pentru personalul care lucrează cu echipamente radiologice (RX, CT, mamografie)',
    legalBasis: 'Legea 111/1996, Normele NSR-01/2017',
    riskLevel: 'high',
    applicableRoles: ['medici radiologi', 'asistenți medicali radiologie', 'tehnicieni radiologie'],
    requiredActions: [
      'Autorizare CNCAN pentru utilizare surse radiații',
      'Delimitare zone controlate și zone supravegheate',
      'Echipament protecție (șorțuri plumbate, gulere tiroide)',
      'Dozimetrie individuală obligatorie',
      'Supraveghere medicală specială (examen medical anual)',
      'Instruire în radioprotecție (curs autorizat CNCAN)',
      'Responsabil radioprotecție desemnat'
    ],
    inspectionChecklist: [
      'Autorizație CNCAN valabilă',
      'Marcaj zone controlate/supravegheate conform NSR-01',
      'Echipament protecție disponibil și în stare bună',
      'Dozimetre personale și evidență citiri',
      'Fișe medicale supraveghere specială',
      'Certificat curs radioprotecție pentru personal',
      'Decizie desemnare responsabil radioprotecție'
    ],
    documentation: [
      'Autorizație CNCAN',
      'Plan radioprotecție',
      'Evidență dozimetrică',
      'Fișe supraveghere medicală',
      'Certificat curs radioprotecție'
    ]
  },

  // MANIPULARE PACIENȚI
  {
    id: 'HC-PATIENT-001',
    category: 'patient_handling',
    title: 'Prevenirea tulburărilor musculo-scheletice la manipularea pacienților',
    description: 'Tehnici ergonomice și echipamente de asistență pentru mobilizarea pacienților',
    legalBasis: 'Directiva 90/269/CEE, HG 1028/2006',
    riskLevel: 'high',
    applicableRoles: ['asistente medicale', 'infirmiere', 'kinetoterapeuti'],
    requiredActions: [
      'Evaluare risc manipulare manuală pacienți',
      'Dotare cu echipamente ajutătoare (lifturi, scaune rulante, paturi reglabile)',
      'Instruire în tehnici ergonomice de mobilizare',
      'Proceduri pentru pacienți cu mobilitate redusă',
      'Lucru în echipă (minimum 2 persoane pentru pacienți dependenți)',
      'Pauze de recuperare pentru personalul implicat'
    ],
    inspectionChecklist: [
      'Evaluare risc manipulare manuală',
      'Echipamente ajutătoare disponibile și funcționale',
      'Proceduri scrise mobilizare pacienți',
      'Dovezi instruire în tehnici ergonomice',
      'Evidență accidente/incidente legate de manipulare',
      'Paturi reglabile în înălțime'
    ],
    documentation: [
      'Evaluare risc manipulare manuală',
      'Proceduri mobilizare pacienți',
      'Certificat instruire tehnici ergonomice',
      'Registru accidente/incidente'
    ]
  },

  // CHIMIOTERAPICE
  {
    id: 'HC-CHEMO-001',
    category: 'chemical',
    title: 'Manipulare securizată medicamente citotoxice și chimioterapice',
    description: 'Protecția personalului medical care prepară și administrează medicamente citotoxice',
    legalBasis: 'Ordinul MS 1101/2016, Directiva 98/24/CE',
    riskLevel: 'critical',
    applicableRoles: ['farmacisti', 'asistente medicale oncologie', 'medici oncologi'],
    requiredActions: [
      'Cameră curată/hood cu flux laminar pentru preparare',
      'EIP: mănuși nitril dublu strat, halat impermeabil, ochelari, mască',
      'Proceduri scrise preparare și administrare citotoxice',
      'Containere speciale pentru deșeuri citotoxice',
      'Protocol deranjament (vărsare medicamente citotoxice)',
      'Supraveghere medicală specială',
      'Instruire specifică manipulare citotoxice'
    ],
    inspectionChecklist: [
      'Hood/cameră curată funcțională și verificată',
      'EIP specific citotoxice disponibil',
      'Proceduri manipulare citotoxice',
      'Protocol deranjament afișat',
      'Containere deșeuri citotoxice',
      'Fișe medicale supraveghere specială',
      'Certificat instruire citotoxice'
    ],
    documentation: [
      'Proceduri manipulare citotoxice',
      'Protocol deranjament',
      'Fișe supraveghere medicală',
      'Certificat instruire',
      'Fișe date siguranță medicamente'
    ]
  },

  {
    id: 'HC-CHEM-002',
    category: 'chemical',
    title: 'Utilizare substanțe chimice periculoase (dezinfectanți, sterilizanți)',
    description: 'Manipulare securizată aldehide, clor, etanol și alte substanțe chimice din spitale',
    legalBasis: 'Regulamentul CLP, HG 1218/2006',
    riskLevel: 'medium',
    applicableRoles: ['asistente medicale', 'infirmiere', 'personal curățenie'],
    requiredActions: [
      'Fișe date siguranță (FDS) pentru toate produsele chimice',
      'Etichetare conform CLP',
      'Spațiu stocare ventilat, substanțe incompatibile separate',
      'EIP: mănuși rezistente chimic, ochelari, șorț',
      'Instruire utilizare produse chimice',
      'Proceduri deranjament și prim ajutor'
    ],
    inspectionChecklist: [
      'FDS disponibile și accesibile',
      'Etichete CLP pe toate recipientele',
      'Spațiu stocare adecvat și organizat',
      'EIP disponibil (mănuși chimice, ochelari)',
      'Certificat instruire produse chimice',
      'Kit deranjament disponibil',
      'Duș de urgență/spălător ochi (dacă aplicabil)'
    ],
    documentation: [
      'Fișe date siguranță (FDS)',
      'Proceduri utilizare produse chimice',
      'Certificat instruire',
      'Protocol deranjament'
    ]
  },

  // STRES ȘI BURNOUT
  {
    id: 'HC-PSYCHO-001',
    category: 'psychosocial',
    title: 'Prevenirea burnout-ului și stresului ocupațional',
    description: 'Managementul riscurilor psihosociale în mediul medical (stres, epuizare emoțională, program prelungit)',
    legalBasis: 'Legea 319/2006 art. 11, Acordul European Stres 2004',
    riskLevel: 'high',
    applicableRoles: ['medici', 'asistente medicale', 'personal ATI/urgență'],
    requiredActions: [
      'Evaluare risc psihosocial (chestionar stres ocupațional)',
      'Respectare timp de muncă și pauze legale',
      'Rotație personal în secțiile cu risc crescut (ATI, urgență, oncologie)',
      'Acces suport psihologic/consiliere',
      'Programe wellbeing și prevenție burnout',
      'Climat organizațional pozitiv (comunicare, suport managerial)'
    ],
    inspectionChecklist: [
      'Chestionar evaluare risc psihosocial completat',
      'Pontaj/program respectat (fără ore suplimentare excesive)',
      'Procedură raportare și abordare burnout',
      'Acces servicii suport psihologic (protocoale/telefoane)',
      'Plan acțiune risc psihosocial (dacă evaluarea identifică risc)',
      'Evidență pauze și zile libere'
    ],
    documentation: [
      'Evaluare risc psihosocial',
      'Plan acțiune risc psihosocial',
      'Procedură suport psihologic',
      'Pontaj și evidență program'
    ]
  },

  {
    id: 'HC-PSYCHO-002',
    category: 'psychosocial',
    title: 'Prevenirea și gestionarea agresiunii din partea pacienților',
    description: 'Măsuri de protecție împotriva violenței și agresiunii verbale/fizice din partea pacienților sau însoțitorilor',
    legalBasis: 'Legea 319/2006, Legea 95/2006 (sănătate)',
    riskLevel: 'high',
    applicableRoles: ['medici', 'asistente medicale', 'personal urgență', 'personal psihiatrie'],
    requiredActions: [
      'Procedură gestionare pacienți agresivi',
      'Instruire tehnici dezescaladare și autoapărare',
      'Sistem alarmă/chemare ajutor rapid',
      'Acces securitate/pază în zone risc (urgență, psihiatrie)',
      'Procedură raportare incidente violență',
      'Suport post-incident (consiliere, debriefing)',
      'Amenajare spații siguranță (evacuare rapidă, fără obstacole)'
    ],
    inspectionChecklist: [
      'Procedură pacienți agresivi',
      'Certificat instruire dezescaladare',
      'Sistem alarmă funcțional',
      'Protocol intervenție securitate',
      'Registru incidente violență',
      'Acces suport psihologic post-incident',
      'Camere fără obiecte care pot fi folosite ca arme'
    ],
    documentation: [
      'Procedură gestionare agresiune',
      'Certificat instruire dezescaladare',
      'Registru incidente violență',
      'Protocol suport post-incident'
    ]
  },

  // ECHIPAMENT INDIVIDUAL DE PROTECȚIE MEDICAL
  {
    id: 'HC-EIP-001',
    category: 'biological',
    title: 'Echipament individual de protecție (EIP) pentru risc biologic',
    description: 'Dotare și utilizare corectă EIP în funcție de tipul de expunere (mănuși, măști, halate, ochelari)',
    legalBasis: 'HG 1048/2006, Directiva 89/656/CEE',
    riskLevel: 'critical',
    applicableRoles: ['medici', 'asistente medicale', 'infirmiere', 'personal curățenie'],
    requiredActions: [
      'Evaluare necesități EIP per post/activitate',
      'Dotare EIP conform riscurilor (mănuși, măști FFP2/FFP3, combinezoane, ochelari)',
      'Instruire utilizare corectă, punere și scoatere EIP',
      'Proceduri igienizare/eliminare EIP',
      'Stocuri suficiente (minimum 2 luni)',
      'EIP adecvat mărime (confort și protecție efectivă)'
    ],
    inspectionChecklist: [
      'Fișa dotare EIP per post',
      'EIP disponibil în cantități suficiente',
      'Măști FFP2/FFP3 cu certificare CE',
      'Procedură utilizare EIP (îmbrăcare/dezbrăcare)',
      'Certificat instruire EIP',
      'Cosuri separate EIP contaminat',
      'Verificare periodicitate înlocuire (mănuși, măști)'
    ],
    documentation: [
      'Fișa dotare EIP',
      'Certificat conformitate EIP (CE)',
      'Procedură utilizare EIP',
      'Certificat instruire',
      'Registru distribuire EIP'
    ]
  },

  // ERGONOMIE ȘI CONDIȚII DE MUNCĂ
  {
    id: 'HC-ERGO-001',
    category: 'patient_handling',
    title: 'Ergonomia locului de muncă în sectorul medical',
    description: 'Amenajare ergonomică posturi de lucru (cabinete, laboratoare, spații asistență)',
    legalBasis: 'Legea 319/2006, Directiva 90/270/CEE',
    riskLevel: 'medium',
    applicableRoles: ['medici', 'asistente medicale', 'personal laborator'],
    requiredActions: [
      'Scaune reglabile pentru posturi sedentare',
      'Birouri/mese de lucru înălțime adecvată',
      'Iluminat suficient (natural + artificial, min 500 lux)',
      'Echipamente medicale/IT ergonomice',
      'Spații circulație libere (fără obstacole)',
      'Pauze regulate pentru recuperare'
    ],
    inspectionChecklist: [
      'Scaune ergonomice reglabile',
      'Măsurători iluminat (min 500 lux zone lucru)',
      'Spații circulație >80cm',
      'Ecrane PC reglabile, la distanță adecvată',
      'Fără posturi cu poziții forțate prelungite',
      'Proceduri pauze și recuperare'
    ],
    documentation: [
      'Măsurători iluminat',
      'Plan amplasare mobilier',
      'Procedură pauze'
    ]
  },

  // EVACUARE ȘI SITUAȚII DE URGENȚĂ
  {
    id: 'HC-EMERG-001',
    category: 'emergency',
    title: 'Plan de evacuare și situații de urgență specifice unităților sanitare',
    description: 'Proceduri evacuare pacienți cu mobilitate redusă, pacienți ATI, echipamente vitale',
    legalBasis: 'Legea 307/2006 (PSI), Normativ P118/2',
    riskLevel: 'critical',
    applicableRoles: ['tot personalul medical'],
    requiredActions: [
      'Plan evacuare adaptat pacienților (priorități evacuare, resurse necesare)',
      'Scenarii evacuare pentru secții speciale (ATI, neonatologie, oncologie)',
      'Căi evacuare marcate, iluminate, libere',
      'Exerciții evacuare anuale (simulări cu figuranți)',
      'Eșaloane intervenție formate și instruite',
      'Proceduri pentru echipamente vitale (ventilatoare, perfuzii)',
      'Puncte adunare exterioare dimensionate'
    ],
    inspectionChecklist: [
      'Plan evacuare specific medical aprobat ISU',
      'Scenarii evacuare per secție',
      'Căi evacuare libere și marcate vizibil',
      'Iluminat siguranță funcțional',
      'Dovadă exercițiu evacuare (PV)',
      'Eșaloane intervenție desemnate',
      'Proceduri echipamente vitale',
      'Mijloace evacuare pacienți (tărgi, scaune)'
    ],
    documentation: [
      'Plan evacuare medical',
      'Scenarii evacuare per secție',
      'PV exercițiu evacuare',
      'Proceduri echipamente vitale',
      'Decizie eșaloane intervenție'
    ]
  },

  {
    id: 'HC-EMERG-002',
    category: 'emergency',
    title: 'Stingătoare și hidranți interiori în unități sanitare',
    description: 'Dotare cu mijloace PSI adaptate riscurilor medicale (nu afectează echipamente sensibile)',
    legalBasis: 'Normativ P118/2, Legea 307/2006',
    riskLevel: 'high',
    applicableRoles: ['tot personalul'],
    requiredActions: [
      'Stingătoare CO2/pulbere ABC la maximum 25m distanță',
      'Stingătoare CO2 în spații cu echipamente electrice/electronice',
      'Hidranți interiori funcționali (verificare presiune)',
      'Verificare stingătoare anual + revizii 5 ani',
      'Instruire utilizare stingătoare pentru personal',
      'Sistem detecție/alarmare incendiu funcțional'
    ],
    inspectionChecklist: [
      'Stingătoare verificate anual (etichetă)',
      'Stingătoare CO2 în spații IT/radiologie',
      'Hidranți interiori cu presiune adecvată',
      'Sistem detecție incendiu funcțional',
      'Certificat instruire PSI',
      'Plan încărcări/înlocuiri stingătoare',
      'Panou comenzi SSI accesibil'
    ],
    documentation: [
      'Certificat verificare stingătoare',
      'Proces verbal verificare hidranți',
      'Certificat instruire PSI',
      'Certificat funcționare SSI'
    ]
  },

  // INFECȚII NOSOCOMIALE
  {
    id: 'HC-BIO-002',
    category: 'biological',
    title: 'Prevenirea infecțiilor nosocomiale (asociate asistenței medicale)',
    description: 'Măsuri de igienă și prevenire infecții dobândite în spital pentru protecția personalului',
    legalBasis: 'Ordinul MS 1101/2016, Ordinul MS 916/2006',
    riskLevel: 'high',
    applicableRoles: ['medici', 'asistente medicale', 'infirmiere', 'personal curățenie'],
    requiredActions: [
      'Comitet infecții nosocomiale funcțional',
      'Protocol igiena mâinilor (OMS - 5 momente)',
      'Dozatoare soluții dezinfectante în toate zonele critice',
      'Proceduri izolare pacienți infectați (precauții contact/picături)',
      'Monitorizare infecții nosocomiale (raportare)',
      'Instruire igiena mâinilor și circuite spital',
      'Curățenie și dezinfecție conform protocoale'
    ],
    inspectionChecklist: [
      'Comitet infecții nosocomiale desemnat',
      'Protocol igiena mâinilor afișat',
      'Dozatoare soluții dezinfectante funcționale',
      'Proceduri izolare pacienți',
      'Registru infecții nosocomiale',
      'Certificat instruire igiena mâinilor',
      'Program curățenie și dezinfecție implementat'
    ],
    documentation: [
      'Decizie comitet infecții nosocomiale',
      'Protocol igiena mâinilor',
      'Proceduri izolare',
      'Registru infecții nosocomiale',
      'Program curățenie'
    ]
  },

  // VENTILAȚIE ȘI CALITATE AER
  {
    id: 'HC-VENT-001',
    category: 'biological',
    title: 'Ventilație și calitate aer în spații medicale',
    description: 'Sisteme ventilație adecvate pentru prevenirea transmiterii aerogene (tuberculoză, COVID-19)',
    legalBasis: 'Ordinul MS 1101/2016, Normativ I5/2015',
    riskLevel: 'high',
    applicableRoles: ['tot personalul din spații critice'],
    requiredActions: [
      'Ventilație mecanică cu presiune negativă în camerele izolare',
      'Filtre HEPA în blocuri operatorii și ATI',
      'Verificare/revizie sisteme ventilație (trimestrial/anual)',
      'Măsurători calitate aer (particule, CO2)',
      'Proceduri ventilare naturală (dacă nu există ventilație mecanică)',
      'Întreținere/curățare filtre conform programului'
    ],
    inspectionChecklist: [
      'Cameră izolare cu presiune negativă funcțională',
      'Filtre HEPA în BO și ATI verificate',
      'Buletine verificare ventilație',
      'Măsurători calitate aer la zi',
      'Program întreținere ventilație',
      'Proceduri ventilare naturală (dacă aplicabil)'
    ],
    documentation: [
      'Buletine verificare ventilație',
      'Măsurători calitate aer',
      'Program întreținere',
      'Proceduri ventilare'
    ]
  },

  // UTILAJE MEDICALE
  {
    id: 'HC-EQUIP-001',
    category: 'patient_handling',
    title: 'Verificare și întreținere echipamente medicale',
    description: 'Mentenanță echipamente medicale critice (ventilatoare, defibrilatoare, mese operatorii)',
    legalBasis: 'Ordinul MS 1224/2010, Legea 95/2006',
    riskLevel: 'high',
    applicableRoles: ['ingineri medicali', 'personal tehnic', 'utilizatori echipamente'],
    requiredActions: [
      'Program întreținere preventivă echipamente medicale',
      'Verificări tehnice periodice (conform instrucțiuni producător)',
      'Registru revizie echipamente',
      'Proceduri utilizare sigură echipamente',
      'Raportare defecțiuni și scoatere din uz echipamente neconforme',
      'Instruire utilizare echipamente complexe'
    ],
    inspectionChecklist: [
      'Program întreținere echipamente medical',
      'Registru revizie completat',
      'Buletine verificare tehnică la zi',
      'Etichete verificare pe echipamente',
      'Proceduri utilizare echipamente',
      'Certificat instruire utilizare',
      'Evidență defecțiuni și reparații'
    ],
    documentation: [
      'Program întreținere',
      'Registru revizie echipamente',
      'Buletine verificare tehnică',
      'Proceduri utilizare',
      'Certificat instruire'
    ]
  },

  // PROGRAM DE LUCRU ȘI ODIHNĂ
  {
    id: 'HC-WORK-001',
    category: 'psychosocial',
    title: 'Respectarea timpului de muncă și repaus în sectorul sanitar',
    description: 'Prevenirea oboselii și erorilor medicale prin respectarea timpului de lucru legal',
    legalBasis: 'Codul Muncii, Directiva 2003/88/CE',
    riskLevel: 'medium',
    applicableRoles: ['medici', 'asistente medicale', 'tot personalul'],
    requiredActions: [
      'Respectare program maxim 48h/săptămână (medie 4 luni)',
      'Minimum 11h repaus între ture',
      'Maximum 24h tură continuă în gardă (cu recuperare obligatorie)',
      'Pauze regulate (minimum 30min la 6h lucru)',
      'Evidență pontaj corectă și verificabilă',
      'Monitorizare ore suplimentare (nu permanent)'
    ],
    inspectionChecklist: [
      'Pontaj/program respectat (verificare 3 luni)',
      'Gardă max 24h + recuperare acordată',
      'Evidență pauze',
      'Fără depășiri repetate 48h/săptămână',
      'Procedură gestionare ore suplimentare',
      'Repaus 11h între ture respectat'
    ],
    documentation: [
      'Pontaj 3 luni',
      'Program de lucru',
      'Procedură ore suplimentare',
      'Evidență recuperări post-gardă'
    ]
  },

  // INSTRUIRE SPECIFICĂ MEDICAL
  {
    id: 'HC-TRAIN-001',
    category: 'emergency',
    title: 'Instruire SSM specifică sectorului medical',
    description: 'Instruire obligatorie cuprinzând riscurile specifice medical (biologic, ace, radiații, PSI, ergonomie)',
    legalBasis: 'Legea 319/2006, HG 1425/2006',
    riskLevel: 'medium',
    applicableRoles: ['tot personalul medical'],
    requiredActions: [
      'Instruire inițială SSM + module specifice (risc biologic, ace, PSI medical)',
      'Instruire periodică anual',
      'Instruire la locul de muncă cu evaluare competențe',
      'Module suplimentare: PPE, dezinfectanți, manipulare pacienți',
      'Registru instruire completat și semnat',
      'Materiale instruire actualizate conform legislației'
    ],
    inspectionChecklist: [
      'Registru instruire SSM completat',
      'Tematică instruire acoperă riscuri specifice',
      'Certificat instruire pentru fiecare angajat',
      'Evaluare competențe post-instruire',
      'Instruire periodică la zi (max 12 luni)',
      'Materiale suport (prezentări, proceduri)'
    ],
    documentation: [
      'Registru instruire SSM',
      'Tematică instruire',
      'Certificat instruire',
      'Fișe evaluare competențe',
      'Materiale suport'
    ]
  }
];

/**
 * Helper: filtrare cerințe după categorie
 */
export function getRequirementsByCategory(category: HealthcareSafetyRequirement['category']): HealthcareSafetyRequirement[] {
  return healthcareSafetyRequirements.filter(req => req.category === category);
}

/**
 * Helper: filtrare cerințe după nivel risc
 */
export function getRequirementsByRiskLevel(riskLevel: HealthcareSafetyRequirement['riskLevel']): HealthcareSafetyRequirement[] {
  return healthcareSafetyRequirements.filter(req => req.riskLevel === riskLevel);
}

/**
 * Helper: cerințe critice (prioritate maximă)
 */
export function getCriticalRequirements(): HealthcareSafetyRequirement[] {
  return getRequirementsByRiskLevel('critical');
}

/**
 * Helper: statistici generale
 */
export function getHealthcareSafetyStats() {
  return {
    total: healthcareSafetyRequirements.length,
    byCategory: {
      biological: getRequirementsByCategory('biological').length,
      sharps: getRequirementsByCategory('sharps').length,
      radiation: getRequirementsByCategory('radiation').length,
      patient_handling: getRequirementsByCategory('patient_handling').length,
      chemical: getRequirementsByCategory('chemical').length,
      psychosocial: getRequirementsByCategory('psychosocial').length,
      emergency: getRequirementsByCategory('emergency').length,
    },
    byRiskLevel: {
      critical: getRequirementsByRiskLevel('critical').length,
      high: getRequirementsByRiskLevel('high').length,
      medium: getRequirementsByRiskLevel('medium').length,
      low: getRequirementsByRiskLevel('low').length,
    }
  };
}
