/**
 * Glosar SSM/PSI - Termeni și acronime din domeniul
 * securității și sănătății în muncă și prevenirea incendiilor
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
    id: 'eip',
    term: 'Echipament Individual de Protecție',
    acronym: 'EIP',
    definition: 'Echipament destinat să fie purtat sau ținut de lucrător pentru a-l proteja împotriva unuia sau mai multor riscuri care ar putea să îi pună în pericol securitatea și sănătatea la locul de muncă.',
    legalReference: 'HG 1048/2006',
    relatedTerms: ['epc', 'evaluare-riscuri', 'loc-munca'],
    translations: {
      en: 'Personal Protective Equipment (PPE)',
      bg: 'Лични предпазни средства (ЛПС)',
      hu: 'Egyéni védőeszköz',
      de: 'Persönliche Schutzausrüstung (PSA)'
    }
  },
  {
    id: 'itm',
    term: 'Inspectoratul Teritorial de Muncă',
    acronym: 'ITM',
    definition: 'Instituție publică cu personalitate juridică, în subordinea Ministerului Muncii și Solidarității Sociale, cu atribuții de control și inspecție în domeniul relațiilor de muncă, securității și sănătății în muncă.',
    legalReference: 'Legea 108/1999',
    relatedTerms: ['inspector-itm', 'sanctiuni', 'control-ssm'],
    translations: {
      en: 'Territorial Labor Inspectorate',
      bg: 'Териториална инспекция по труда',
      hu: 'Területi Munkaügyi Felügyelőség',
      de: 'Territoriale Arbeitsinspektion'
    }
  },
  {
    id: 'cssm',
    term: 'Comitet de Securitate și Sănătate în Muncă',
    acronym: 'CSSM',
    definition: 'Organism paritar constituit la nivelul angajatorului cu peste 50 de angajați, având rolul de a asigura consultarea lucrătorilor în problemele de securitate și sănătate în muncă.',
    legalReference: 'Legea 319/2006, Art. 18',
    relatedTerms: ['lucrator-desemnat', 'preventie', 'consultare'],
    translations: {
      en: 'Occupational Safety and Health Committee',
      bg: 'Комитет по безопасност и здраве при работа',
      hu: 'Munkavédelmi Bizottság',
      de: 'Arbeitsschutzausschuss'
    }
  },
  {
    id: 'psi',
    term: 'Prevenirea și Stingerea Incendiilor',
    acronym: 'PSI',
    definition: 'Ansamblul măsurilor de prevenire, limitare și stingere a incendiilor, precum și de protejare a persoanelor, bunurilor și mediului împotriva incendiilor.',
    legalReference: 'Legea 307/2006',
    relatedTerms: ['autorizatie-psi', 'instructaj-psi', 'mijloace-psi'],
    translations: {
      en: 'Fire Prevention and Protection',
      bg: 'Превенция и защита от пожари',
      hu: 'Tűzvédelem',
      de: 'Brandschutz'
    }
  },
  {
    id: 'su',
    term: 'Situații de Urgență',
    acronym: 'SU',
    definition: 'Evenimentele excepționale, cu caracter nonmilitar, care prin amploare și intensitate amenință viața și sănătatea populației, mediul înconjurător, valorile materiale și culturale importante, fiind necesară gestionarea unitară a resurselor umane, materiale și financiare.',
    legalReference: 'OUG 21/2004',
    relatedTerms: ['plan-evacuare', 'echipa-interventie', 'psi'],
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
    definition: 'Instituție publică cu personalitate juridică, organism de supraveghere a pieței pentru echipamente sub presiune și instalații de ridicat, în subordinea Ministerului Economiei.',
    legalReference: 'HG 1021/2007',
    relatedTerms: ['verificare-iscir', 'instalatii-ridicat', 'recipiente-presiune'],
    translations: {
      en: 'State Inspectorate for Boilers, Pressure Vessels and Lifting Installations',
      bg: 'Държавна инспекция за контрол на котлите, съдовете под налягане и повдигащите инсталации',
      hu: 'Kazánfelügyeleti Főfelügyelőség',
      de: 'Staatliche Inspektion für Kessel, Druckbehälter und Hebeeinrichtungen'
    }
  },
  {
    id: 'rsvti',
    term: 'Regulament de Securitate și Sănătate în Muncă pentru Operatorii Economici',
    acronym: 'RSVTI',
    definition: 'Document intern al angajatorului care stabilește regulile și procedurile de securitate și sănătate în muncă specifice activității desfășurate.',
    legalReference: 'Legea 319/2006, Art. 11',
    relatedTerms: ['proceduri-ssm', 'instructiuni-proprii', 'evaluare-riscuri'],
    translations: {
      en: 'Occupational Safety and Health Regulation',
      bg: 'Правилник за безопасност и здраве при работа',
      hu: 'Munkavédelmi Szabályzat',
      de: 'Arbeitsschutzverordnung'
    }
  },
  {
    id: 'evaluare-riscuri',
    term: 'Evaluarea Riscurilor',
    definition: 'Procesul de evaluare a riscurilor pentru securitatea și sănătatea lucrătorilor la locul de muncă, care rezultă din prezența agentului periculos la locul de muncă.',
    legalReference: 'HG 1425/2006',
    relatedTerms: ['identificare-riscuri', 'plan-preventie', 'masuri-control'],
    translations: {
      en: 'Risk Assessment',
      bg: 'Оценка на риска',
      hu: 'Kockázatértékelés',
      de: 'Gefährdungsbeurteilung'
    }
  },
  {
    id: 'loc-munca',
    term: 'Loc de Muncă',
    definition: 'Locul destinat să cuprindă posturi de lucru, situat în clădirile întreprinderii și/sau unității, inclusiv orice alt loc din aria întreprinderii și/sau unității la care lucrătorul are acces în cadrul desfășurării activității.',
    legalReference: 'Legea 319/2006',
    relatedTerms: ['post-lucru', 'amenajare', 'conditii-munca'],
    translations: {
      en: 'Workplace',
      bg: 'Работно място',
      hu: 'Munkahely',
      de: 'Arbeitsplatz'
    }
  },
  {
    id: 'accident-munca',
    term: 'Accident de Muncă',
    definition: 'Vătămarea violentă a organismului, precum și intoxicația acută profesională, care au loc în timpul procesului de muncă sau în îndeplinirea îndatoririlor de serviciu și care provoacă incapacitate temporară de muncă de cel puțin 3 zile calendaristice.',
    legalReference: 'Legea 346/2002',
    relatedTerms: ['cercetare-accident', 'deces', 'invaliditate'],
    translations: {
      en: 'Occupational Accident',
      bg: 'Трудова злополука',
      hu: 'Munkabaleset',
      de: 'Arbeitsunfall'
    }
  },
  {
    id: 'boala-profesionala',
    term: 'Boală Profesională',
    definition: 'Afecțiunea care se produce ca urmare a exercitării unei meserii sau profesii, cauzată de agenți nocivi fizici, chimici sau biologici, caracteristici locului de muncă, precum și de suprasolicitarea diferitelor organe sau sisteme ale organismului.',
    legalReference: 'Legea 346/2002, HG 1424/2006',
    relatedTerms: ['supraveghere-sanatate', 'expunere-profesionala', 'control-medical'],
    translations: {
      en: 'Occupational Disease',
      bg: 'Професионално заболяване',
      hu: 'Foglalkozási megbetegedés',
      de: 'Berufskrankheit'
    }
  },
  {
    id: 'lucrator-desemnat',
    term: 'Lucrător Desemnat',
    definition: 'Persoană desemnată de angajator să se ocupe de activitățile de prevenire și protecție în domeniul securității și sănătății în muncă.',
    legalReference: 'Legea 319/2006, Art. 16',
    relatedTerms: ['cssm', 'consultant-ssm', 'preventie'],
    translations: {
      en: 'Designated Worker',
      bg: 'Определен работник',
      hu: 'Kijelölt munkavállaló',
      de: 'Benannter Arbeitnehmer'
    }
  },
  {
    id: 'consultant-ssm',
    term: 'Consultant de Securitate și Sănătate în Muncă',
    acronym: 'Consultant SSM',
    definition: 'Persoană fizică autorizată sau persoană juridică atestată care prestează servicii de specialitate în domeniul securității și sănătății în muncă.',
    legalReference: 'HG 1112/2010',
    relatedTerms: ['lucrator-desemnat', 'serviciu-extern', 'atestare'],
    translations: {
      en: 'Occupational Safety and Health Consultant',
      bg: 'Консултант по безопасност и здраве при работа',
      hu: 'Munkavédelmi tanácsadó',
      de: 'Arbeitsschutzberater'
    }
  },
  {
    id: 'instructaj-ssm',
    term: 'Instructaj de Securitate și Sănătate în Muncă',
    definition: 'Activitate de informare și instruire a lucrătorilor asupra riscurilor pentru securitate și sănătate în muncă și a măsurilor de prevenire și protecție.',
    legalReference: 'Legea 319/2006, Art. 12',
    relatedTerms: ['instructaj-general', 'instructaj-periodica', 'instructaj-post'],
    translations: {
      en: 'Occupational Safety and Health Briefing',
      bg: 'Инструктаж по безопасност и здраве при работа',
      hu: 'Munkavédelmi oktatás',
      de: 'Arbeitsschutzunterweisung'
    }
  },
  {
    id: 'instructaj-psi',
    term: 'Instructaj de Prevenire și Stingere a Incendiilor',
    definition: 'Activitate de instruire a lucrătorilor cu privire la măsurile de prevenire a incendiilor, conduita în caz de incendiu și utilizarea mijloacelor de stingere.',
    legalReference: 'Legea 307/2006',
    relatedTerms: ['psi', 'evacuare', 'echipa-interventie'],
    translations: {
      en: 'Fire Safety Briefing',
      bg: 'Инструктаж за противопожарна защита',
      hu: 'Tűzvédelmi oktatás',
      de: 'Brandschutzunterweisung'
    }
  },
  {
    id: 'fisa-date-securitate',
    term: 'Fișă cu Date de Securitate',
    acronym: 'FDS',
    definition: 'Document care furnizează informații despre proprietățile substanțelor și amestecurilor chimice, inclusiv aspecte legate de sănătate, securitate și mediu.',
    legalReference: 'Regulamentul REACH (CE) 1907/2006',
    relatedTerms: ['substante-chimice', 'eticheta', 'stocare'],
    translations: {
      en: 'Safety Data Sheet (SDS)',
      bg: 'Информационен лист за безопасност (ИЛБ)',
      hu: 'Biztonsági adatlap',
      de: 'Sicherheitsdatenblatt (SDB)'
    }
  },
  {
    id: 'echipa-interventie',
    term: 'Echipă de Intervenție',
    definition: 'Grupă de lucrători desemnați și pregătiți să intervină în situații de urgență pentru evacuarea persoanelor și limitarea efectelor negative.',
    legalReference: 'Legea 307/2006',
    relatedTerms: ['plan-evacuare', 'psi', 'prim-ajutor'],
    translations: {
      en: 'Emergency Response Team',
      bg: 'Екип за спешно реагиране',
      hu: 'Beavatkozó csoport',
      de: 'Notfallteam'
    }
  },
  {
    id: 'plan-evacuare',
    term: 'Plan de Evacuare',
    definition: 'Document care stabilește măsurile organizatorice și modalitățile de evacuare a persoanelor din clădire în caz de incendiu sau alte situații de urgență.',
    legalReference: 'Legea 307/2006, Normativ P118/2013',
    relatedTerms: ['cai-evacuare', 'iesiri-siguranta', 'exercitiu-evacuare'],
    translations: {
      en: 'Evacuation Plan',
      bg: 'План за евакуация',
      hu: 'Menekülési terv',
      de: 'Evakuierungsplan'
    }
  },
  {
    id: 'autorizatie-psi',
    term: 'Autorizație de Securitate la Incendiu',
    definition: 'Document emis de autoritatea competentă care atestă îndeplinirea cerințelor de prevenire și stingere a incendiilor pentru un obiectiv sau o activitate.',
    legalReference: 'Legea 307/2006',
    relatedTerms: ['aviz-psi', 'verificare-psi', 'igsu'],
    translations: {
      en: 'Fire Safety Authorization',
      bg: 'Разрешение за пожарна безопасност',
      hu: 'Tűzvédelmi engedély',
      de: 'Brandschutzzulassung'
    }
  },
  {
    id: 'control-medical',
    term: 'Control Medical',
    definition: 'Examinare medicală periodică obligatorie a lucrătorilor expuși la riscuri profesionale, efectuată de medicul de medicina muncii.',
    legalReference: 'HG 355/2007',
    relatedTerms: ['medicina-muncii', 'aptitudine', 'supraveghere-sanatate'],
    translations: {
      en: 'Medical Examination',
      bg: 'Медицински преглед',
      hu: 'Orvosi vizsgálat',
      de: 'Ärztliche Untersuchung'
    }
  },
  {
    id: 'medicina-muncii',
    term: 'Medicină del Muncii',
    definition: 'Specialitate medicală care se ocupă cu prevenirea îmbolnăvirilor și a accidentelor de muncă prin supravegherea stării de sănătate a lucrătorilor.',
    legalReference: 'HG 355/2007',
    relatedTerms: ['control-medical', 'aptitudine', 'fisa-aptitudine'],
    translations: {
      en: 'Occupational Medicine',
      bg: 'Медицина на труда',
      hu: 'Foglalkozás-egészségügy',
      de: 'Arbeitsmedizin'
    }
  },
  {
    id: 'aptitudine',
    term: 'Aptitudine Medicală',
    definition: 'Starea de sănătate a lucrătorului care îi permite să îndeplinească sarcinile de muncă fără riscuri pentru sănătatea sa sau a altor persoane.',
    legalReference: 'HG 355/2007',
    relatedTerms: ['control-medical', 'medicina-muncii', 'contraindicatii'],
    translations: {
      en: 'Medical Fitness',
      bg: 'Медицинска годност',
      hu: 'Egészségi alkalmasság',
      de: 'Medizinische Eignung'
    }
  },
  {
    id: 'epc',
    term: 'Echipament de Protecție Colectivă',
    acronym: 'EPC',
    definition: 'Echipament destinat protecției unui grup de lucrători împotriva unuia sau mai multor riscuri.',
    legalReference: 'Legea 319/2006',
    relatedTerms: ['eip', 'ventilatie', 'protectie-colectiva'],
    translations: {
      en: 'Collective Protection Equipment',
      bg: 'Колективни предпазни средства',
      hu: 'Kollektív védőeszköz',
      de: 'Kollektive Schutzausrüstung'
    }
  },
  {
    id: 'munca-inaltime',
    term: 'Muncă la Înălțime',
    definition: 'Orice activitate desfășurată la o diferență de nivel mai mare de 2 metri față de un plan inferior sigur.',
    legalReference: 'HG 1146/2006',
    relatedTerms: ['schelarie', 'ham-siguranta', 'cadere-inaltime'],
    translations: {
      en: 'Work at Height',
      bg: 'Работа на височина',
      hu: 'Magasban végzett munka',
      de: 'Höhenarbeit'
    }
  },
  {
    id: 'spatiu-confinate',
    term: 'Spațiu Confinate',
    definition: 'Spațiu total sau parțial închis, care nu este destinat în mod normal ocupării permanente de către lucrători și în care există riscuri specifice.',
    legalReference: 'HG 1146/2006',
    relatedTerms: ['permis-lucru', 'atmosfera-periculoasa', 'ventilare'],
    translations: {
      en: 'Confined Space',
      bg: 'Ограничено пространство',
      hu: 'Zárt tér',
      de: 'Enger Raum'
    }
  },
  {
    id: 'permis-lucru',
    term: 'Permis de Lucru',
    definition: 'Document scris prin care se autorizează efectuarea unor lucrări cu risc ridicat, după evaluarea riscurilor și stabilirea măsurilor de siguranță.',
    legalReference: 'Proceduri interne',
    relatedTerms: ['lucru-periculoase', 'spatiu-confinate', 'autorizare'],
    translations: {
      en: 'Work Permit',
      bg: 'Разрешително за работа',
      hu: 'Munkavégzési engedély',
      de: 'Arbeitserlaubnis'
    }
  },
  {
    id: 'zgomot',
    term: 'Zgomot Profesional',
    definition: 'Agent fizic nociv reprezentat de sunetele nedorite care pot afecta auzul sau sănătatea lucrătorilor expuși.',
    legalReference: 'HG 493/2006',
    relatedTerms: ['audiograma', 'protectie-auditiva', 'nivel-expunere'],
    translations: {
      en: 'Occupational Noise',
      bg: 'Професионален шум',
      hu: 'Foglalkozási zaj',
      de: 'Lärm am Arbeitsplatz'
    }
  },
  {
    id: 'vibratii',
    term: 'Vibrații',
    definition: 'Mișcări mecanice oscilatorii transmise corpului uman prin contact direct cu echipamentele de muncă sau suprafețe vibrante.',
    legalReference: 'HG 1876/2005',
    relatedTerms: ['vibratii-maini-brate', 'vibratii-corp', 'nivel-expunere'],
    translations: {
      en: 'Vibrations',
      bg: 'Вибрации',
      hu: 'Rezgések',
      de: 'Vibrationen'
    }
  },
  {
    id: 'iluminat',
    term: 'Iluminat la Locul de Muncă',
    definition: 'Nivelul de luminozitate necesar pentru desfășurarea activității în condiții de siguranță și fără afectarea sănătății lucrătorilor.',
    legalReference: 'HG 1091/2006',
    relatedTerms: ['confort-vizual', 'iluminat-artificial', 'iluminat-natural'],
    translations: {
      en: 'Workplace Lighting',
      bg: 'Осветление на работното място',
      hu: 'Munkahely világítása',
      de: 'Arbeitsplatzbeleuchtung'
    }
  },
  {
    id: 'microclima',
    term: 'Microclimat',
    definition: 'Ansamblul parametrilor fizici ai mediului de muncă: temperatura, umiditatea, viteza curenților de aer.',
    legalReference: 'HG 1091/2006',
    relatedTerms: ['temperatura', 'ventilatie', 'confort-termic'],
    translations: {
      en: 'Microclimate',
      bg: 'Микроклимат',
      hu: 'Mikroklíma',
      de: 'Mikroklima'
    }
  },
  {
    id: 'manipulare-manuala',
    term: 'Manipulare Manuală de Sarcini',
    definition: 'Activitate care implică ridicarea, coborârea, transportarea, tragerea sau împingerea unei sarcini de către unul sau mai mulți lucrători.',
    legalReference: 'HG 1051/2006',
    relatedTerms: ['tulburari-musculo-scheletice', 'ergonomie', 'pozitie-lucru'],
    translations: {
      en: 'Manual Handling of Loads',
      bg: 'Ръчно пренасяне на тежести',
      hu: 'Kézi anyagmozgatás',
      de: 'Manuelle Handhabung von Lasten'
    }
  },
  {
    id: 'ergonomie',
    term: 'Ergonomie',
    definition: 'Știința care studiază adaptarea muncii la om prin proiectarea locurilor de muncă, echipamentelor și mediului de lucru.',
    legalReference: 'Legea 319/2006',
    relatedTerms: ['pozitie-lucru', 'manipulare-manuala', 'amenajare'],
    translations: {
      en: 'Ergonomics',
      bg: 'Ергономия',
      hu: 'Ergonómia',
      de: 'Ergonomie'
    }
  },
  {
    id: 'agent-chimic',
    term: 'Agent Chimic Periculos',
    definition: 'Orice element sau compus chimic, singur sau în amestec, în stare naturală sau prelucrat, folosit sau eliminat în cadrul unei activități de muncă.',
    legalReference: 'HG 1218/2006',
    relatedTerms: ['fisa-date-securitate', 'expunere-profesionala', 'substante-chimice'],
    translations: {
      en: 'Hazardous Chemical Agent',
      bg: 'Опасен химичен агент',
      hu: 'Veszélyes vegyi anyag',
      de: 'Gefährlicher chemischer Arbeitsstoff'
    }
  },
  {
    id: 'agent-biologic',
    term: 'Agent Biologic',
    definition: 'Microorganisme, inclusiv cele modificate genetic, culturi celulare și endoparaziți umani susceptibili de a provoca infecții, alergii sau intoxicații.',
    legalReference: 'HG 1092/2006',
    relatedTerms: ['expunere-biologica', 'infectie', 'protectie-biologica'],
    translations: {
      en: 'Biological Agent',
      bg: 'Биологичен агент',
      hu: 'Biológiai ágens',
      de: 'Biologischer Arbeitsstoff'
    }
  },
  {
    id: 'agent-cancerigen',
    term: 'Agent Cancerigen',
    definition: 'Substanță, amestec sau proces de muncă care poate cauza cancer la om.',
    legalReference: 'HG 1093/2006',
    relatedTerms: ['agent-mutagen', 'expunere-profesionala', 'supraveghere-sanatate'],
    translations: {
      en: 'Carcinogenic Agent',
      bg: 'Канцерогенен агент',
      hu: 'Rákkeltő anyag',
      de: 'Krebserzeugender Stoff'
    }
  },
  {
    id: 'registru-evidenta',
    term: 'Registru de Evidență SSM',
    definition: 'Document obligatoriu în care se consemnează activitățile desfășurate în domeniul securității și sănătății în muncă: instructaje, controale, verificări.',
    legalReference: 'Legea 319/2006',
    relatedTerms: ['documente-ssm', 'evidenta', 'audit-ssm'],
    translations: {
      en: 'OSH Record Book',
      bg: 'Регистър за БЗР',
      hu: 'Munkavédelmi nyilvántartás',
      de: 'Arbeitsschutz-Nachweisbuch'
    }
  },
  {
    id: 'santier-temporar',
    term: 'Șantier Temporar sau Mobil',
    definition: 'Orice șantier la care se execută lucrări de construcții sau de geniu civil.',
    legalReference: 'HG 300/2006',
    relatedTerms: ['coordonator-ssm', 'plan-siguranta-sanatate', 'avizare-lucrari'],
    translations: {
      en: 'Temporary or Mobile Construction Site',
      bg: 'Временен или мобилен строителен обект',
      hu: 'Ideiglenes vagy változó építési munkahely',
      de: 'Temporäre oder mobile Baustelle'
    }
  },
  {
    id: 'coordonator-ssm',
    term: 'Coordonator de Securitate și Sănătate',
    definition: 'Persoană fizică sau juridică desemnată de client să coordoneze aplicarea principiilor generale de prevenire la șantierele temporare sau mobile.',
    legalReference: 'HG 300/2006',
    relatedTerms: ['santier-temporar', 'plan-siguranta-sanatate', 'notificare'],
    translations: {
      en: 'Safety and Health Coordinator',
      bg: 'Координатор по безопасност и здраве',
      hu: 'Biztonsági és egészségvédelmi koordinátor',
      de: 'Sicherheits- und Gesundheitsschutzkoordinator'
    }
  },
  {
    id: 'audit-ssm',
    term: 'Audit SSM',
    definition: 'Examinare sistematică pentru a determina dacă activitățile și rezultatele din domeniul SSM sunt conforme cu dispozițiile planificate și dacă acestea sunt implementate eficient.',
    legalReference: 'Legea 319/2006',
    relatedTerms: ['verificare-conformitate', 'control-ssm', 'imbunatatire-continua'],
    translations: {
      en: 'OSH Audit',
      bg: 'Одит на БЗР',
      hu: 'Munkavédelmi audit',
      de: 'Arbeitsschutz-Audit'
    }
  },
  {
    id: 'investigare-accident',
    term: 'Investigarea și Cercetarea Accidentelor de Muncă',
    definition: 'Proces obligatoriu de stabilire a cauzelor și circumstanțelor producerii unui accident de muncă și de stabilire a măsurilor de prevenire.',
    legalReference: 'HG 1425/2006',
    relatedTerms: ['accident-munca', 'proces-verbal-cercetare', 'masuri-preventive'],
    translations: {
      en: 'Occupational Accident Investigation',
      bg: 'Разследване на трудова злополука',
      hu: 'Munkabaleset vizsgálata',
      de: 'Arbeitsunfalluntersuchung'
    }
  }
];

export default glossarSSM;
