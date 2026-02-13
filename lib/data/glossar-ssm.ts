/**
 * Glosar SSM/PSI - Termeni frecvenți în domeniul securității și sănătății în muncă
 * și protecției contra incendiilor
 */

export interface GlossaryTerm {
  id: string;
  term: string;
  acronym?: string;
  definition: string;
  legalReference?: string;
  relatedTerms?: string[];
  translations: {
    en: string;
    bg: string;
    hu: string;
    de: string;
  };
}

export const glossarSSM: GlossaryTerm[] = [
  {
    id: 'ssm',
    term: 'Securitate și Sănătate în Muncă',
    acronym: 'SSM',
    definition: 'Ansamblul de activități instituționalizate având ca scop asigurarea celor mai bune condiții în desfășurarea procesului de muncă, apărarea vieții, integrității fizice și psihice, sănătății lucrătorilor și altor persoane participante la procesul de muncă.',
    legalReference: 'Legea 319/2006',
    relatedTerms: ['eip', 'cssm', 'itm'],
    translations: {
      en: 'Occupational Health and Safety',
      bg: 'Безопасност и здраве при работа',
      hu: 'Munkahelyi egészség és biztonság',
      de: 'Arbeitsschutz und Arbeitssicherheit'
    }
  },
  {
    id: 'psi',
    term: 'Protecție și Stingere Incendii',
    acronym: 'PSI',
    definition: 'Ansamblul de măsuri tehnice, organizatorice și de altă natură, luate în scopul prevenirii și limitării consecințelor incendiilor.',
    legalReference: 'Legea 307/2006',
    relatedTerms: ['su', 'rsvti'],
    translations: {
      en: 'Fire Protection and Prevention',
      bg: 'Противопожарна защита',
      hu: 'Tűzvédelem és tűzoltás',
      de: 'Brandschutz und Feuerlöschung'
    }
  },
  {
    id: 'eip',
    term: 'Echipament Individual de Protecție',
    acronym: 'EIP',
    definition: 'Orice echipament destinat a fi purtat sau mânuit de un lucrător pentru a-l proteja împotriva unuia ori mai multor riscuri care ar putea să îi pună în pericol securitatea și sănătatea la locul de muncă.',
    legalReference: 'HG 1048/2006',
    relatedTerms: ['ssm', 'epc'],
    translations: {
      en: 'Personal Protective Equipment (PPE)',
      bg: 'Лични предпазни средства (ЛПС)',
      hu: 'Egyéni védőfelszerelés',
      de: 'Persönliche Schutzausrüstung (PSA)'
    }
  },
  {
    id: 'itm',
    term: 'Inspecția Muncii',
    acronym: 'ITM',
    definition: 'Organ de specialitate al administrației publice centrale care exercită controlul aplicării legislației în domeniul raporturilor de muncă, securității și sănătății în muncă și supravegherii pieței.',
    legalReference: 'OUG 96/2003',
    relatedTerms: ['ssm', 'cssm'],
    translations: {
      en: 'Labour Inspectorate',
      bg: 'Инспекция по труда',
      hu: 'Munkavédelmi Felügyelőség',
      de: 'Arbeitsinspektion'
    }
  },
  {
    id: 'cssm',
    term: 'Comitet de Securitate și Sănătate în Muncă',
    acronym: 'CSSM',
    definition: 'Organism paritetic, fără personalitate juridică, constituit la nivelul angajatorului care are ca scop principal consultarea personalului în vederea prevenirii riscurilor profesionale și protecției sănătății lucrătorilor.',
    legalReference: 'Legea 319/2006, art. 18',
    relatedTerms: ['ssm', 'itm', 'responsabil-ssm'],
    translations: {
      en: 'Occupational Health and Safety Committee',
      bg: 'Комитет по безопасност и здраве при работа',
      hu: 'Munkavédelmi Bizottság',
      de: 'Ausschuss für Arbeitssicherheit und Gesundheitsschutz'
    }
  },
  {
    id: 'su',
    term: 'Situații de Urgență',
    acronym: 'SU',
    definition: 'Evenimente excepționale, cu caracter nonmilitar, care prin amploarea și intensitatea lor afectează viața, sănătatea populației, mediul înconjurător, bunuri materiale și culturale importante, iar pentru restabilirea stării de normalitate sunt necesare adoptarea de măsuri și acțiuni urgente.',
    legalReference: 'OUG 21/2004',
    relatedTerms: ['psi', 'igsu'],
    translations: {
      en: 'Emergency Situations',
      bg: 'Извънредни ситуации',
      hu: 'Vészhelyzetek',
      de: 'Notfallsituationen'
    }
  },
  {
    id: 'iscir',
    term: 'Inspecția de Stat pentru Controlul Cazanelor, Recipientelor sub Presiune și Instalațiilor de Ridicat',
    acronym: 'ISCIR',
    definition: 'Organ de specialitate al administrației publice centrale cu activitate de verificare, control și supraveghere tehnică a echipamentelor și instalațiilor în conformitate cu reglementările tehnice specifice.',
    legalReference: 'HG 559/2002',
    relatedTerms: ['ssm', 'verificare-periodica'],
    translations: {
      en: 'State Inspectorate for Boilers, Pressure Vessels and Lifting Installations',
      bg: 'Държавна инспекция за контрол на котлите, съдовете под налягане и повдигащите инсталации',
      hu: 'Kazánok, Nyomástartó Edények és Emelőberendezések Állami Felügyelete',
      de: 'Staatliche Inspektion für Kessel, Druckbehälter und Hebeeinrichtungen'
    }
  },
  {
    id: 'rsvti',
    term: 'Regulament de Securitate la Foc',
    acronym: 'RSVTI',
    definition: 'Norme tehnice generale de apărare împotriva incendiilor care stabilesc cerințele minime obligatorii privind prevenirea și stingerea incendiilor.',
    legalReference: 'Ordinul MAI 163/2007',
    relatedTerms: ['psi', 'su'],
    translations: {
      en: 'Fire Safety Regulations',
      bg: 'Правилник за пожарна безопасност',
      hu: 'Tűzvédelmi Biztonsági Szabályzat',
      de: 'Feuerschutzverordnung'
    }
  },
  {
    id: 'evaluare-risc',
    term: 'Evaluarea Riscurilor',
    acronym: undefined,
    definition: 'Procesul de estimare a riscurilor pentru securitatea și sănătatea lucrătorilor, derivate din posibilitatea manifestării unui pericol la locul de muncă.',
    legalReference: 'HG 1425/2006',
    relatedTerms: ['ssm', 'plan-prevenire', 'identificare-pericol'],
    translations: {
      en: 'Risk Assessment',
      bg: 'Оценка на риска',
      hu: 'Kockázatértékelés',
      de: 'Gefährdungsbeurteilung'
    }
  },
  {
    id: 'plan-prevenire',
    term: 'Plan de Prevenire și Protecție',
    acronym: 'PPP',
    definition: 'Document care cuprinde măsurile de prevenire și protecție ce trebuie adoptate de către angajator pentru asigurarea securității și sănătății lucrătorilor.',
    legalReference: 'HG 1425/2006, art. 8',
    relatedTerms: ['evaluare-risc', 'ssm', 'responsabil-ssm'],
    translations: {
      en: 'Prevention and Protection Plan',
      bg: 'План за превенция и защита',
      hu: 'Megelőzési és védelmi terv',
      de: 'Präventions- und Schutzplan'
    }
  },
  {
    id: 'responsabil-ssm',
    term: 'Responsabil cu Protecția Muncii',
    acronym: undefined,
    definition: 'Persoană desemnată de angajator să se ocupe de activitățile de protecție și de activitățile de prevenire a riscurilor profesionale.',
    legalReference: 'Legea 319/2006, art. 16',
    relatedTerms: ['ssm', 'cssm', 'plan-prevenire'],
    translations: {
      en: 'Occupational Safety Officer',
      bg: 'Отговорник по трудова безопасност',
      hu: 'Munkavédelmi felelős',
      de: 'Fachkraft für Arbeitssicherheit'
    }
  },
  {
    id: 'accident-munca',
    term: 'Accident de Muncă',
    acronym: undefined,
    definition: 'Vătămarea violentă a organismului, precum și intoxicația acută profesională, care au loc în timpul procesului de muncă sau în îndeplinirea îndatoririlor de serviciu și care provoacă incapacitate temporară de muncă de cel puțin 3 zile.',
    legalReference: 'Legea 346/2002',
    relatedTerms: ['boala-profesionala', 'declarare-accident', 'cercetare-accident'],
    translations: {
      en: 'Work Accident',
      bg: 'Трудова злополука',
      hu: 'Munkabaleset',
      de: 'Arbeitsunfall'
    }
  },
  {
    id: 'boala-profesionala',
    term: 'Boală Profesională',
    acronym: undefined,
    definition: 'Afecțiune care se produce ca urmare a exercitării unei meserii sau profesii, cauzată de agenți nocivi fizici, chimici sau biologici caracteristici locului de muncă, precum și de suprasolicitarea diferitelor organe sau sisteme ale organismului.',
    legalReference: 'HG 1425/2006, Anexa 1',
    relatedTerms: ['accident-munca', 'medicina-muncii', 'supraveghere-medicala'],
    translations: {
      en: 'Occupational Disease',
      bg: 'Професионално заболяване',
      hu: 'Foglalkozási betegség',
      de: 'Berufskrankheit'
    }
  },
  {
    id: 'medicina-muncii',
    term: 'Medicina Muncii',
    acronym: undefined,
    definition: 'Specialitate medicală care se ocupă cu studiul relațiilor dintre sănătatea omului și mediul de muncă, în vederea prevenirii îmbolnăvirilor profesionale și a promovării sănătății lucrătorilor.',
    legalReference: 'HG 355/2007',
    relatedTerms: ['supraveghere-medicala', 'boala-profesionala', 'control-medical'],
    translations: {
      en: 'Occupational Medicine',
      bg: 'Медицина на труда',
      hu: 'Munkaorvoslás',
      de: 'Arbeitsmedizin'
    }
  },
  {
    id: 'supraveghere-medicala',
    term: 'Supraveghere Medicală',
    acronym: undefined,
    definition: 'Examinarea periodică a lucrătorilor pentru a detecta simptome ale unor afecțiuni medicale legate de expunerea la factori de risc profesional.',
    legalReference: 'HG 355/2007',
    relatedTerms: ['medicina-muncii', 'control-medical', 'aviz-medical'],
    translations: {
      en: 'Medical Surveillance',
      bg: 'Медицински надзор',
      hu: 'Orvosi felügyelet',
      de: 'Arbeitsmedizinische Vorsorge'
    }
  },
  {
    id: 'instructaj-ssm',
    term: 'Instructaj de Securitate și Sănătate în Muncă',
    acronym: undefined,
    definition: 'Activitate de informare și pregătire a lucrătorilor privind riscurile specifice locului de muncă și măsurile de prevenire și protecție.',
    legalReference: 'HG 1425/2006, art. 6',
    relatedTerms: ['instructaj-intro', 'instructaj-periodic', 'fisa-instruire'],
    translations: {
      en: 'Health and Safety Briefing',
      bg: 'Инструктаж по безопасност и здраве',
      hu: 'Munkavédelmi oktatás',
      de: 'Sicherheitsunterweisung'
    }
  },
  {
    id: 'instructaj-intro',
    term: 'Instructaj Introductiv General',
    acronym: undefined,
    definition: 'Instructaj efectuat înaintea începerii activității de către orice lucrător nou angajat, cuprinzând informații generale despre regulile de SSM din unitate.',
    legalReference: 'HG 1425/2006, art. 6',
    relatedTerms: ['instructaj-ssm', 'instructaj-la-post', 'fisa-instruire'],
    translations: {
      en: 'General Introductory Briefing',
      bg: 'Общ въвеждащ инструктаж',
      hu: 'Általános munkavédelmi oktatás',
      de: 'Allgemeine Erstunterweisung'
    }
  },
  {
    id: 'instructaj-la-post',
    term: 'Instructaj la Locul de Muncă',
    acronym: undefined,
    definition: 'Instructaj specific pentru locul de muncă și activitatea ce urmează a fi desfășurată, efectuat de șeful ierarhic direct.',
    legalReference: 'HG 1425/2006, art. 6',
    relatedTerms: ['instructaj-ssm', 'instructaj-intro', 'instructaj-periodic'],
    translations: {
      en: 'Workplace Briefing',
      bg: 'Инструктаж на работното място',
      hu: 'Munkahelyi oktatás',
      de: 'Arbeitsplatzunterweisung'
    }
  },
  {
    id: 'instructaj-periodic',
    term: 'Instructaj Periodic',
    acronym: undefined,
    definition: 'Instructaj de reîmprospătare a cunoștințelor de SSM, efectuat periodic la intervale stabilite în funcție de specificul activității.',
    legalReference: 'HG 1425/2006, art. 6',
    relatedTerms: ['instructaj-ssm', 'instructaj-la-post', 'fisa-instruire'],
    translations: {
      en: 'Periodic Briefing',
      bg: 'Периодичен инструктаж',
      hu: 'Időszakos oktatás',
      de: 'Wiederholungsunterweisung'
    }
  },
  {
    id: 'epc',
    term: 'Echipament de Protecție Colectivă',
    acronym: 'EPC',
    definition: 'Echipament destinat protejării simultane a mai multor lucrători împotriva unuia sau mai multor riscuri.',
    legalReference: 'HG 1425/2006',
    relatedTerms: ['eip', 'ssm', 'masuri-protectie'],
    translations: {
      en: 'Collective Protection Equipment',
      bg: 'Колективни предпазни средства',
      hu: 'Kollektív védőeszközök',
      de: 'Kollektive Schutzausrüstung'
    }
  },
  {
    id: 'marcaj-ce',
    term: 'Marcaj CE',
    acronym: 'CE',
    definition: 'Marcaj obligatoriu pentru echipamentele de protecție care confirmă conformitatea cu cerințele esențiale de securitate și sănătate din legislația europeană.',
    legalReference: 'Regulamentul (UE) 2016/425',
    relatedTerms: ['eip', 'certificare', 'conformitate'],
    translations: {
      en: 'CE Marking',
      bg: 'CE маркировка',
      hu: 'CE jelölés',
      de: 'CE-Kennzeichnung'
    }
  },
  {
    id: 'aviz-psi',
    term: 'Aviz de Securitate la Foc',
    acronym: undefined,
    definition: 'Document emis de serviciile de urgență competente prin care se atestă îndeplinirea condițiilor de securitate la foc pentru o construcție sau activitate.',
    legalReference: 'Legea 307/2006',
    relatedTerms: ['psi', 'autorizatie-psi', 'igsu'],
    translations: {
      en: 'Fire Safety Clearance',
      bg: 'Разрешение за пожарна безопасност',
      hu: 'Tűzvédelmi engedély',
      de: 'Brandschutzgenehmigung'
    }
  },
  {
    id: 'autorizatie-psi',
    term: 'Autorizație de Securitate la Foc',
    acronym: undefined,
    definition: 'Document prin care se autorizează funcționarea construcțiilor și a amenajărilor, organizarea și desfășurarea activităților, din punct de vedere al apărării împotriva incendiilor.',
    legalReference: 'Legea 307/2006, art. 23',
    relatedTerms: ['psi', 'aviz-psi', 'igsu'],
    translations: {
      en: 'Fire Safety Authorization',
      bg: 'Разрешително за пожарна безопасност',
      hu: 'Tűzvédelmi engedély',
      de: 'Brandschutzzulassung'
    }
  },
  {
    id: 'verificare-periodica',
    term: 'Verificare Periodică',
    acronym: undefined,
    definition: 'Control tehnic efectuat la intervale stabilite, în vederea constatării stării tehnice a echipamentelor de muncă și menținerii parametrilor de funcționare în limitele admise.',
    legalReference: 'HG 1146/2006',
    relatedTerms: ['iscir', 'revizie-tehnica', 'echipament-munca'],
    translations: {
      en: 'Periodic Inspection',
      bg: 'Периодична проверка',
      hu: 'Időszakos felülvizsgálat',
      de: 'Wiederkehrende Prüfung'
    }
  },
  {
    id: 'declarare-conformitate',
    term: 'Declarație de Conformitate',
    acronym: 'DoC',
    definition: 'Document prin care producătorul declară că produsul este conform cu cerințele aplicabile din legislația de armonizare a Uniunii Europene.',
    legalReference: 'Regulamentul (CE) 765/2008',
    relatedTerms: ['marcaj-ce', 'certificare', 'echipament-munca'],
    translations: {
      en: 'Declaration of Conformity',
      bg: 'Декларация за съответствие',
      hu: 'Megfelelőségi nyilatkozat',
      de: 'Konformitätserklärung'
    }
  },
  {
    id: 'echipament-munca',
    term: 'Echipament de Muncă',
    acronym: undefined,
    definition: 'Orice mașină, aparat, unealtă sau instalație folosită în muncă.',
    legalReference: 'HG 1146/2006',
    relatedTerms: ['verificare-periodica', 'revizie-tehnica', 'iscir'],
    translations: {
      en: 'Work Equipment',
      bg: 'Работно оборудване',
      hu: 'Munkaeszköz',
      de: 'Arbeitsmittel'
    }
  },
  {
    id: 'loc-munca',
    term: 'Loc de Muncă',
    acronym: undefined,
    definition: 'Locul destinat să cuprindă posturi de lucru, situat în clădirile întreprinderii și/sau unității, inclusiv orice alt loc din aria întreprinderii și/sau unității la care lucrătorul are acces în cadrul desfășurării activității.',
    legalReference: 'HG 1091/2006',
    relatedTerms: ['post-lucru', 'ssm', 'evaluare-risc'],
    translations: {
      en: 'Workplace',
      bg: 'Работно място',
      hu: 'Munkahely',
      de: 'Arbeitsplatz'
    }
  },
  {
    id: 'igsu',
    term: 'Inspectoratul General pentru Situații de Urgență',
    acronym: 'IGSU',
    definition: 'Structură profesionistă cu atribuții de management al situațiilor de urgență, inclusiv prevenire, pregătire, răspuns și refacere.',
    legalReference: 'OUG 21/2004',
    relatedTerms: ['psi', 'su', 'aviz-psi', 'autorizatie-psi'],
    translations: {
      en: 'General Inspectorate for Emergency Situations',
      bg: 'Главна дирекция за извънредни ситуации',
      hu: 'Vészhelyzeti Főfelügyelőség',
      de: 'Generalinspektion für Notfallsituationen'
    }
  },
  {
    id: 'cercetare-accident',
    term: 'Cercetarea Accidentelor de Muncă',
    acronym: undefined,
    definition: 'Procedură de stabilire a împrejurărilor și cauzelor care au dus la producerea accidentului de muncă.',
    legalReference: 'HG 1425/2006, Anexa 4',
    relatedTerms: ['accident-munca', 'declarare-accident', 'registru-accidente'],
    translations: {
      en: 'Work Accident Investigation',
      bg: 'Разследване на трудови злополуки',
      hu: 'Munkabalesetek kivizsgálása',
      de: 'Arbeitsunfalluntersuchung'
    }
  },
  {
    id: 'declarare-accident',
    term: 'Declararea Accidentului de Muncă',
    acronym: undefined,
    definition: 'Obligația angajatorului de a înregistra și comunica accidentul de muncă în termenul și condițiile prevăzute de lege.',
    legalReference: 'HG 1425/2006, art. 18',
    relatedTerms: ['accident-munca', 'cercetare-accident', 'itm'],
    translations: {
      en: 'Work Accident Reporting',
      bg: 'Деклариране на трудова злополука',
      hu: 'Munkabaleset bejelentése',
      de: 'Arbeitsunfallmeldung'
    }
  },
  {
    id: 'registru-accidente',
    term: 'Registrul de Evidență a Accidentelor de Muncă',
    acronym: undefined,
    definition: 'Document obligatoriu în care se înregistrează toate accidentele de muncă produse la nivelul angajatorului.',
    legalReference: 'HG 1425/2006, art. 18',
    relatedTerms: ['accident-munca', 'declarare-accident', 'cercetare-accident'],
    translations: {
      en: 'Work Accident Register',
      bg: 'Регистър на трудовите злополуки',
      hu: 'Munkabaleseti nyilvántartás',
      de: 'Unfallregister'
    }
  },
  {
    id: 'fisa-instruire',
    term: 'Fișa de Instruire',
    acronym: undefined,
    definition: 'Document care atestă efectuarea instructajului de securitate și sănătate în muncă, semnat de instructor și instruit.',
    legalReference: 'HG 1425/2006, art. 6',
    relatedTerms: ['instructaj-ssm', 'instructaj-intro', 'instructaj-periodic'],
    translations: {
      en: 'Training Record',
      bg: 'Протокол за инструктаж',
      hu: 'Oktatási lap',
      de: 'Unterweisungsnachweis'
    }
  },
  {
    id: 'masuri-protectie',
    term: 'Măsuri de Protecție',
    acronym: undefined,
    definition: 'Acțiuni planificate și implementate în vederea eliminării sau reducerii riscurilor profesionale la un nivel acceptabil.',
    legalReference: 'Legea 319/2006',
    relatedTerms: ['evaluare-risc', 'plan-prevenire', 'eip', 'epc'],
    translations: {
      en: 'Protection Measures',
      bg: 'Мерки за защита',
      hu: 'Védelmi intézkedések',
      de: 'Schutzmaßnahmen'
    }
  },
  {
    id: 'identificare-pericol',
    term: 'Identificarea Pericolelor',
    acronym: undefined,
    definition: 'Procesul de recunoaștere a existenței unui pericol și de definire a caracteristicilor acestuia la locul de muncă.',
    legalReference: 'HG 1425/2006',
    relatedTerms: ['evaluare-risc', 'plan-prevenire', 'ssm'],
    translations: {
      en: 'Hazard Identification',
      bg: 'Идентифициране на опасности',
      hu: 'Veszélyek azonosítása',
      de: 'Gefahrenermittlung'
    }
  },
  {
    id: 'control-medical',
    term: 'Control Medical Periodic',
    acronym: undefined,
    definition: 'Examinare medicală obligatorie a lucrătorilor la intervale stabilite, în funcție de factorii de risc la care sunt expuși.',
    legalReference: 'HG 355/2007',
    relatedTerms: ['medicina-muncii', 'supraveghere-medicala', 'aviz-medical'],
    translations: {
      en: 'Periodic Medical Examination',
      bg: 'Периодичен медицински преглед',
      hu: 'Időszakos orvosi vizsgálat',
      de: 'Arbeitsmedizinische Vorsorgeuntersuchung'
    }
  },
  {
    id: 'aviz-medical',
    term: 'Aviz Medical de Aptitudine',
    acronym: undefined,
    definition: 'Document medical prin care se certifică că lucrătorul este apt din punct de vedere medical pentru desfășurarea activității respective.',
    legalReference: 'HG 355/2007',
    relatedTerms: ['medicina-muncii', 'control-medical', 'supraveghere-medicala'],
    translations: {
      en: 'Medical Fitness Certificate',
      bg: 'Медицинско удостоверение за годност',
      hu: 'Orvosi alkalmasság igazolás',
      de: 'Ärztliche Tauglichkeitsbescheinigung'
    }
  },
  {
    id: 'revizie-tehnica',
    term: 'Revizie Tehnică',
    acronym: 'RT',
    definition: 'Ansamblu de operațiuni de verificare și control tehnic al unui echipament pentru menținerea parametrilor funcționali în limitele prescrise.',
    legalReference: 'HG 1146/2006',
    relatedTerms: ['verificare-periodica', 'echipament-munca', 'iscir'],
    translations: {
      en: 'Technical Inspection',
      bg: 'Технически преглед',
      hu: 'Műszaki felülvizsgálat',
      de: 'Technische Überprüfung'
    }
  },
  {
    id: 'post-lucru',
    term: 'Post de Lucru',
    acronym: undefined,
    definition: 'Spațiul delimitat în cadrul locului de muncă în care lucrătorul se află în mod obișnuit sau în care trebuie să meargă pentru a-și îndeplini sarcinile.',
    legalReference: 'HG 1091/2006',
    relatedTerms: ['loc-munca', 'ssm', 'evaluare-risc'],
    translations: {
      en: 'Workstation',
      bg: 'Работно място',
      hu: 'Munkahely',
      de: 'Arbeitsplatz'
    }
  },
  {
    id: 'certificare',
    term: 'Certificare de Conformitate',
    acronym: undefined,
    definition: 'Procedură prin care un organism terț atestă în scris că un produs, proces sau serviciu este conform cu cerințele specificate.',
    legalReference: 'Regulamentul (CE) 765/2008',
    relatedTerms: ['marcaj-ce', 'declarare-conformitate', 'eip'],
    translations: {
      en: 'Conformity Certification',
      bg: 'Сертифициране на съответствие',
      hu: 'Megfelelőség tanúsítás',
      de: 'Konformitätszertifizierung'
    }
  },
  {
    id: 'conformitate',
    term: 'Conformitate',
    acronym: undefined,
    definition: 'Respectarea tuturor cerințelor legale, tehnice și de performanță aplicabile unui produs, serviciu sau proces.',
    legalReference: 'Regulamentul (CE) 765/2008',
    relatedTerms: ['certificare', 'marcaj-ce', 'declarare-conformitate'],
    translations: {
      en: 'Conformity',
      bg: 'Съответствие',
      hu: 'Megfelelőség',
      de: 'Konformität'
    }
  }
];

export default glossarSSM;
