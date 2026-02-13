/**
 * Glosar SSM/PSI - Termeni de securitate și sănătate în muncă și prevenire incendii
 * Pentru consultanți SSM și firme din România, Bulgaria, Ungaria, Germania
 */

export interface GlossaryTerm {
  term: string;
  definition: string;
  abbreviation?: string;
  legalSource: string;
  relatedTerms: string[];
}

export const glossarSSM: GlossaryTerm[] = [
  {
    term: 'Comitet de Securitate și Sănătate în Muncă',
    abbreviation: 'CSSM',
    definition: 'Organism paritetic constituit la nivel de unitate, format din reprezentanți ai angajatorului și ai lucrătorilor, având rol consultativ în domeniul securității și sănătății în muncă.',
    legalSource: 'Legea 319/2006, art. 18-21',
    relatedTerms: ['Lucrator desemnat', 'Reprezentant al lucratorilor', 'Angajator']
  },
  {
    term: 'Evaluarea Riscurilor',
    abbreviation: 'ER',
    definition: 'Procesul de identificare a pericolelor și evaluare a riscurilor pentru securitatea și sănătatea lucrătorilor, în vederea stabilirii măsurilor de prevenire și protecție.',
    legalSource: 'Legea 319/2006, art. 8-12',
    relatedTerms: ['Identificare pericole', 'Masuri de prevenire', 'Plan de prevenire si protectie']
  },
  {
    term: 'Echipament Individual de Protecție',
    abbreviation: 'EIP',
    definition: 'Orice echipament destinat a fi purtat sau mânuit de un lucrător pentru a-l proteja împotriva unuia sau mai multor riscuri care ar putea să îi pună în pericol securitatea și sănătatea la locul de muncă.',
    legalSource: 'HG 1048/2006',
    relatedTerms: ['Echipament de lucru', 'Dotare lucratori', 'Masuri de protectie']
  },
  {
    term: 'Fișa Individuală de Instruire',
    abbreviation: 'FII',
    definition: 'Document care atestă instruirea lucrătorului în domeniul securității și sănătății în muncă, conținând datele de identificare, tipul instruirii, tematica și semnătura participantului.',
    legalSource: 'Legea 319/2006, Anexa 2',
    relatedTerms: ['Instruire periodica', 'Instruire la angajare', 'Instructaj SSM']
  },
  {
    term: 'Lucrător Desemnat',
    abbreviation: 'LD',
    definition: 'Lucrător desemnat de către angajator să se ocupe de activitățile de prevenire a riscurilor profesionale și de protecție.',
    legalSource: 'Legea 319/2006, art. 16',
    relatedTerms: ['CSSM', 'Serviciu intern SSM', 'Serviciu extern SSM']
  },
  {
    term: 'Serviciu Extern de Prevenire și Protecție',
    abbreviation: 'Serviciu extern SSM',
    definition: 'Persoană juridică sau fizică autorizată, externă întreprinderii, care prestează servicii de prevenire și protecție în domeniul securității și sănătății în muncă.',
    legalSource: 'Legea 319/2006, art. 17',
    relatedTerms: ['Consultant SSM', 'Serviciu intern SSM', 'Lucrator desemnat']
  },
  {
    term: 'Plan de Prevenire și Protecție',
    abbreviation: 'PPP',
    definition: 'Document care cuprinde măsurile de prevenire și protecție ce trebuie aplicate, stabilite ca urmare a evaluării riscurilor, cu termene și responsabili.',
    legalSource: 'Legea 319/2006, art. 10',
    relatedTerms: ['Evaluarea riscurilor', 'Masuri de prevenire', 'Program de prevenire']
  },
  {
    term: 'Accident de Muncă',
    abbreviation: 'AM',
    definition: 'Vătămarea violentă a organismului, precum și intoxicația acută profesională, care au loc în timpul procesului de muncă sau în îndeplinirea îndatoririlor de serviciu și care provoacă incapacitate temporară de muncă de cel puțin 3 zile calendaristice, invaliditate ori deces.',
    legalSource: 'Legea 346/2002, art. 3',
    relatedTerms: ['Incapacitate temporara', 'Cercetare accident', 'Registru accidente']
  },
  {
    term: 'Boală Profesională',
    abbreviation: 'BP',
    definition: 'Afecțiunea care se produce ca urmare a exercitării unei meserii sau profesii, cauzată de agenți nocivi fizici, chimici sau biologici caracteristici locului de muncă, precum și de suprasolicitarea diferitelor organe sau sisteme ale organismului, în procesul de muncă.',
    legalSource: 'HG 1425/2006',
    relatedTerms: ['Expunere profesionala', 'Control medical periodic', 'Lista boli profesionale']
  },
  {
    term: 'Instruire la Locul de Muncă',
    abbreviation: 'ILM',
    definition: 'Activitate obligatorie prin care lucrătorul primește informații specifice privind riscurile de accidentare și îmbolnăvire profesională existente la locul de muncă, precum și măsurile de prevenire și protecție aplicabile.',
    legalSource: 'Legea 319/2006, art. 28',
    relatedTerms: ['Fisa individuala de instruire', 'Instructaj SSM', 'Instruire periodica']
  },
  {
    term: 'Instruire Periodică',
    abbreviation: 'IP',
    definition: 'Instruire care se efectuează la intervale regulate (anual sau ori de câte ori este necesar) pentru actualizarea cunoștințelor lucrătorilor în domeniul SSM.',
    legalSource: 'Legea 319/2006, art. 28',
    relatedTerms: ['Instruire la locul de munca', 'Reinstruire', 'Fisa instruire']
  },
  {
    term: 'Control Medical la Angajare',
    abbreviation: 'CMA',
    definition: 'Examinare medicală obligatorie efectuată înainte de începerea activității, pentru a stabili dacă lucrătorul este apt medical pentru postul respectiv.',
    legalSource: 'Legea 319/2006, art. 30',
    relatedTerms: ['Control medical periodic', 'Aviz medical', 'Medicina muncii']
  },
  {
    term: 'Control Medical Periodic',
    abbreviation: 'CMP',
    definition: 'Examinare medicală periodică obligatorie pentru monitorizarea stării de sănătate a lucrătorilor expuși la riscuri profesionale.',
    legalSource: 'HG 355/2007',
    relatedTerms: ['Control medical la angajare', 'Medicina muncii', 'Fisa aptitudini']
  },
  {
    term: 'Reprezentant al Lucrătorilor cu Răspunderi Specifice',
    abbreviation: 'RLRS',
    definition: 'Persoană aleasă sau desemnată de lucrători pentru a-i reprezenta în problemele de securitate și sănătate în muncă.',
    legalSource: 'Legea 319/2006, art. 20',
    relatedTerms: ['CSSM', 'Sindicat', 'Drepturi lucratori']
  },
  {
    term: 'Loc de Muncă',
    abbreviation: '',
    definition: 'Locul destinat să cuprindă posturi de lucru, situat în clădirile întreprinderii și/sau unității, inclusiv orice alt loc din aria întreprinderii și/sau unității la care lucrătorul are acces în cadrul desfășurării activității.',
    legalSource: 'Legea 319/2006, art. 5',
    relatedTerms: ['Post de lucru', 'Spatiu de lucru', 'Mediu de lucru']
  },
  {
    term: 'Echipament de Lucru',
    abbreviation: 'EL',
    definition: 'Orice mașină, aparat, unealtă sau instalație folosită în procesul de muncă.',
    legalSource: 'Legea 319/2006, art. 5',
    relatedTerms: ['Echipament de munca', 'Utilaj', 'Verificare echipamente']
  },
  {
    term: 'Mediu de Lucru',
    abbreviation: '',
    definition: 'Ansamblul factorilor fizici, chimici, biologici, tehnologici și de organizare a procesului de muncă existenți la locul de muncă.',
    legalSource: 'Legea 319/2006, art. 5',
    relatedTerms: ['Conditii de lucru', 'Factori de risc', 'Loc de munca']
  },
  {
    term: 'Prevenire',
    abbreviation: '',
    definition: 'Ansamblul de dispoziții sau măsuri luate ori prevăzute în toate etapele procesului de muncă, în scopul evitării sau diminuării riscurilor profesionale.',
    legalSource: 'Legea 319/2006, art. 5',
    relatedTerms: ['Masuri de prevenire', 'Protectie', 'Evaluarea riscurilor']
  },
  {
    term: 'Risc',
    abbreviation: '',
    definition: 'Probabilitatea ca un anumit pericol să se manifeste în condițiile expunerii lucrătorilor la pericol, combinată cu severitatea consecințelor asupra securității și sănătății lucrătorilor.',
    legalSource: 'Legea 319/2006, art. 5',
    relatedTerms: ['Pericol', 'Evaluarea riscurilor', 'Factori de risc']
  },
  {
    term: 'Pericol',
    abbreviation: '',
    definition: 'Proprietatea intrinsecă a unui material, proces, obiect sau situație de a provoca daune, vătămări sau îmbolnăviri ale lucrătorului.',
    legalSource: 'Legea 319/2006, art. 5',
    relatedTerms: ['Risc', 'Identificare pericole', 'Evaluarea riscurilor']
  },
  {
    term: 'Inspecția Muncii',
    abbreviation: 'ITM',
    definition: 'Organism de stat care exercită controlul aplicării legislației în domeniul relațiilor de muncă, securității și sănătății în muncă.',
    legalSource: 'OUG 96/2003',
    relatedTerms: ['Control ITM', 'Sanctiuni', 'Legislatie SSM']
  },
  {
    term: 'Autorizație de Functionare PSI',
    abbreviation: 'PSI',
    definition: 'Document eliberat de Inspectoratul pentru Situații de Urgență care atestă că un obiectiv respectă normele de prevenire și stingere a incendiilor.',
    legalSource: 'Legea 307/2006',
    relatedTerms: ['ISU', 'Aviz PSI', 'Documentatie PSI']
  },
  {
    term: 'Planul de Evacuare',
    abbreviation: '',
    definition: 'Document care stabilește măsurile și procedurile de evacuare a persoanelor din clădiri în caz de incendiu sau alte situații de urgență.',
    legalSource: 'Legea 307/2006, Ord. 163/2007',
    relatedTerms: ['Cai de evacuare', 'Exercitiu de evacuare', 'Situatii de urgenta']
  },
  {
    term: 'Identificarea Pericolelor',
    abbreviation: '',
    definition: 'Procesul de recunoaștere a existenței unui pericol și de definire a caracteristicilor acestuia.',
    legalSource: 'Legea 319/2006, art. 8',
    relatedTerms: ['Pericol', 'Evaluarea riscurilor', 'Analiza riscurilor']
  },
  {
    term: 'Măsuri de Prevenire',
    abbreviation: '',
    definition: 'Acțiuni tehnice, organizatorice și administrative destinate eliminării sau reducerii riscurilor profesionale.',
    legalSource: 'Legea 319/2006',
    relatedTerms: ['Prevenire', 'Plan de prevenire si protectie', 'Masuri de protectie']
  },
  {
    term: 'Serviciu Intern de Prevenire și Protecție',
    abbreviation: 'Serviciu intern SSM',
    definition: 'Structură organizată în cadrul întreprinderii pentru desfășurarea activităților de prevenire și protecție în domeniul securității și sănătății în muncă.',
    legalSource: 'Legea 319/2006, art. 17',
    relatedTerms: ['Serviciu extern SSM', 'Lucrator desemnat', 'Personal SSM']
  },
  {
    term: 'Registrul de Evidență a Accidentelor de Muncă',
    abbreviation: 'REAM',
    definition: 'Document obligatoriu în care se înregistrează cronologic toate accidentele de muncă produse în unitate.',
    legalSource: 'HG 1425/2006',
    relatedTerms: ['Accident de munca', 'Declarare accident', 'Cercetare accident']
  },
  {
    term: 'Cercetarea Accidentelor de Muncă',
    abbreviation: '',
    definition: 'Procedură obligatorie de investigare a împrejurărilor și cauzelor producerii unui accident de muncă.',
    legalSource: 'HG 1425/2006',
    relatedTerms: ['Accident de munca', 'Proces verbal cercetare', 'Comisie cercetare']
  },
  {
    term: 'Declararea Accidentelor de Muncă',
    abbreviation: '',
    definition: 'Obligația angajatorului de a comunica autorităților competente (ITM, CAS) accidentele de muncă în termenele legale.',
    legalSource: 'HG 1425/2006',
    relatedTranslations: ['Accident de munca', 'ITM', 'Registru accidente']
  },
  {
    term: 'Situații de Urgență',
    abbreviation: '',
    definition: 'Evenimente care pun în pericol viața și sănătatea oamenilor, mediul și bunurile materiale, necesitând intervenție imediată (incendii, explozii, inundații, cutremure).',
    legalSource: 'Legea 307/2006',
    relatedTerms: ['Plan de evacuare', 'ISU', 'Exercitiu de evacuare']
  },
  {
    term: 'Dotarea cu Mijloace de Stingere a Incendiilor',
    abbreviation: '',
    definition: 'Obligația angajatorului de a asigura stingătoare, hidranți și alte mijloace PSI conform normelor în vigoare.',
    legalSource: 'Ord. 163/2007',
    relatedTerms: ['Stingator', 'Hidrant interior', 'Verificare PSI']
  },
  {
    term: 'Instruire PSI',
    abbreviation: '',
    definition: 'Instruirea lucrătorilor în domeniul prevenirii și stingerii incendiilor, obligatorie conform legislației.',
    legalSource: 'Legea 307/2006',
    relatedTerms: ['Instructaj PSI', 'Fisa instruire PSI', 'Evacuare']
  },
  {
    term: 'Aviz ISU',
    abbreviation: '',
    definition: 'Document emis de Inspectoratul pentru Situații de Urgență care atestă conformitatea unui proiect sau obiectiv cu normele de apărare împotriva incendiilor.',
    legalSource: 'Legea 307/2006',
    relatedTerms: ['ISU', 'Autorizatie PSI', 'Expertiza tehnica']
  },
  {
    term: 'Verificare Periodică PSI',
    abbreviation: '',
    definition: 'Control periodic obligatoriu al instalațiilor, echipamentelor și mijloacelor de prevenire și stingere a incendiilor.',
    legalSource: 'Ord. 163/2007',
    relatedTerms: ['Stingator', 'Hidrant interior', 'Raport verificare']
  },
  {
    term: 'Căi de Evacuare',
    abbreviation: '',
    definition: 'Coridoare, scări, ieșiri și trasee special amenajate pentru evacuarea rapidă și în siguranță a persoanelor în caz de incendiu sau situații de urgență.',
    legalSource: 'Ord. 163/2007',
    relatedTerms: ['Plan de evacuare', 'Iesiri de urgenta', 'Semnalizare evacuare']
  },
  {
    term: 'Fișa cu Date de Securitate',
    abbreviation: 'FDS',
    definition: 'Document care conține informații detaliate despre proprietățile unei substanțe chimice, riscurile asociate și măsurile de protecție.',
    legalSource: 'Regulament REACH (CE) 1907/2006',
    relatedTerms: ['Substante chimice', 'Eticheta chimica', 'Manipulare substante']
  },
  {
    term: 'Expunere Profesională',
    abbreviation: '',
    definition: 'Contactul lucrătorului cu factori de risc fizici, chimici sau biologici în timpul procesului de muncă.',
    legalSource: 'Legea 319/2006',
    relatedTerms: ['Factori de risc', 'Monitorizare expunere', 'Valori limita']
  },
  {
    term: 'Valori Limită de Expunere',
    abbreviation: 'VLE',
    definition: 'Concentrații maxime admise de substanțe nocive în aerul locurilor de muncă, la care lucrătorii pot fi expuși fără efecte negative asupra sănătății.',
    legalSource: 'HG 1218/2006',
    relatedTerms: ['Expunere profesionala', 'Masuratori', 'Aer ambiental']
  },
  {
    term: 'Etichetarea Substanțelor Chimice',
    abbreviation: '',
    definition: 'Obligația de a marca recipientele cu substanțe chimice periculoase cu etichete care conțin pictograme, indicații de pericol și măsuri de siguranță.',
    legalSource: 'Regulament CLP (CE) 1272/2008',
    relatedTerms: ['Fisa cu date de securitate', 'Substante chimice', 'Pictograme pericol']
  },
  {
    term: 'Atestat SSM',
    abbreviation: '',
    definition: 'Document care atestă competența profesională a persoanelor care desfășoară activități în domeniul securității și sănătății în muncă.',
    legalSource: 'HG 1425/2006',
    relatedTerms: ['Consultant SSM', 'Pregatire profesionala', 'Certificare']
  },
  {
    term: 'Fișa Postului',
    abbreviation: '',
    definition: 'Document care detaliază atribuțiile, responsabilitățile, condițiile de muncă și cerințele pentru ocuparea unui post.',
    legalSource: 'Codul Muncii, Legea 53/2003',
    relatedTerms: ['Post de lucru', 'Atributii', 'Responsabilitati SSM']
  },
  {
    term: 'Masă de Lucru Ergonomică',
    abbreviation: '',
    definition: 'Suprafața de lucru proiectată conform principiilor ergonomice pentru a reduce oboseala și riscurile de tulburări musculo-scheletice.',
    legalSource: 'HG 1091/2006',
    relatedTerms: ['Ergonomie', 'Monitorizare postura', 'Loc de munca birou']
  },
  {
    term: 'Iluminat la Locul de Muncă',
    abbreviation: '',
    definition: 'Intensitatea luminoasă necesară la locurile de muncă, stabilită prin norme specifice în funcție de tipul activității.',
    legalSource: 'HG 1093/2006',
    relatedTerms: ['Conditii de lucru', 'Mediu de lucru', 'Factori microclimat']
  },
  {
    term: 'Zgomot la Locul de Muncă',
    abbreviation: '',
    definition: 'Factor de risc fizic reprezentat de nivelul sunetelor care poate afecta auzul lucrătorilor dacă depășește valorile limită admise.',
    legalSource: 'HG 493/2006',
    relatedTerms: ['Expunere zgomot', 'Protectie auditiva', 'Masuratori zgomot']
  },
  {
    term: 'Vibrații la Locul de Muncă',
    abbreviation: '',
    definition: 'Oscilații mecanice transmise corpului lucrătorului prin mâini-brațe sau prin întreg corpul, care pot produce efecte nocive.',
    legalSource: 'HG 1876/2005',
    relatedTerms: ['Expunere vibratii', 'Utilaje vibratii', 'Protectie antivibratii']
  },
  {
    term: 'Lucru în Spații Închise',
    abbreviation: '',
    definition: 'Activități desfășurate în spații confinate sau slab ventilate, cu risc de intoxicare, asfixiere sau explozie.',
    legalSource: 'Legea 319/2006, norme specifice',
    relatedTerms: ['Permis de lucru', 'Ventilare', 'Masuratori gaze']
  },
  {
    term: 'Lucru la Înălțime',
    abbreviation: '',
    definition: 'Orice activitate desfășurată la o înălțime de peste 2 metri față de nivelul de referință, cu risc de cădere.',
    legalSource: 'HG 1091/2006',
    relatedTerms: ['Echipament anticadere', 'Schelarie', 'Ham de siguranta']
  },
  {
    term: 'Permis de Lucru',
    abbreviation: '',
    definition: 'Document scris care autorizează efectuarea unor lucrări cu risc ridicat (foc deschis, spații confinate, înălțime) și stabilește măsurile de siguranță.',
    legalSource: 'Proceduri interne conform Legea 319/2006',
    relatedTerms: ['Lucru la inaltime', 'Lucru in spatii inchise', 'Foc deschis']
  },
  {
    term: 'Procedură de Lucru în Siguranță',
    abbreviation: 'PLS',
    definition: 'Document care descrie pas cu pas modul corect și sigur de executare a unei activități, pentru a preveni accidentele.',
    legalSource: 'Legea 319/2006',
    relatedTerms: ['Instructiuni de lucru', 'Prevenire accidente', 'Metoda de lucru']
  },
  {
    term: 'Semnalizare de Securitate',
    abbreviation: '',
    definition: 'Sisteme de indicatoare, culori, simboluri sau semnale sonore folosite pentru a avertiza lucrătorii asupra riscurilor și a indica echipamentele de siguranță.',
    legalSource: 'HG 971/2006',
    relatedTerms: ['Panouri de avertizare', 'Marcaje de siguranta', 'Cai de evacuare']
  },
  {
    term: 'Echipamente Sub Presiune',
    abbreviation: '',
    definition: 'Recipiente, conducte, cazane și alte echipamente care operează sub presiune și necesită verificări periodice și autorizații de funcționare.',
    legalSource: 'HG 1020/2006',
    relatedTerms: ['Verificare ISCIR', 'Cazane', 'Recipiente presiune']
  },
  {
    term: 'ISCIR',
    abbreviation: '',
    definition: 'Inspecția de Stat pentru Controlul Cazanelor, Recipientelor sub Presiune și Instalațiilor de Ridicat - organ care autorizează și controlează aceste echipamente.',
    legalSource: 'OUG 75/2001',
    relatedTerms: ['Echipamente sub presiune', 'Instalatii de ridicat', 'Autorizatie functionare']
  },
  {
    term: 'Instalații de Ridicat',
    abbreviation: '',
    definition: 'Echipamente utilizate pentru ridicarea și deplasarea sarcinilor (macarale, electropalan, lifturi de marfă), care necesită verificări și autorizații ISCIR.',
    legalSource: 'HG 1146/2006',
    relatedTerms: ['ISCIR', 'Verificare instalatii', 'Macara']
  },
  {
    term: 'Operator Utilaj',
    abbreviation: '',
    definition: 'Persoană autorizată să manevreze echipamente de lucru specifice (stivuitor, macara, motostivuitor).',
    legalSource: 'Legea 319/2006',
    relatedTerms: ['Autorizatie operator', 'Pregatire profesionala', 'Echipament de lucru']
  },
  {
    term: 'Protecție Colectivă',
    abbreviation: '',
    definition: 'Măsuri și dispozitive tehnice destinate să protejeze simultan un grup de lucrători împotriva riscurilor (parapete, garduri, ventilație generală).',
    legalSource: 'Legea 319/2006',
    relatedTerms: ['Protectie individuala', 'Masuri de prevenire', 'Dispozitive de protectie']
  },
  {
    term: 'Protecție Individuală',
    abbreviation: '',
    definition: 'Echipamente purtate sau mânuite de lucrător pentru protecție personală împotriva riscurilor (EIP).',
    legalSource: 'HG 1048/2006',
    relatedTerms: ['Echipament individual de protectie', 'Masuri de protectie', 'Dotare lucratori']
  },
  {
    term: 'Consemnarea Echipamentelor',
    abbreviation: '',
    definition: 'Procedură de securizare a unui echipament înainte de intervenții de întreținere sau reparații, pentru a preveni pornirea accidentală.',
    legalSource: 'Legea 319/2006, proceduri specifice',
    relatedTerms: ['LOTO', 'Blocare energii', 'Siguranta interventii']
  },
  {
    term: 'LOTO - Lockout/Tagout',
    abbreviation: 'LOTO',
    definition: 'Procedură de blocare și etichetare a surselor de energie înainte de lucrări de întreținere, pentru prevenirea accidentelor.',
    legalSource: 'Best practice international, Legea 319/2006',
    relatedTerms: ['Consemnare echipamente', 'Izolare energii', 'Mentenanta']
  },
  {
    term: 'Agenți Nocivi Profesionali',
    abbreviation: '',
    definition: 'Factori fizici, chimici sau biologici din mediul de muncă care pot produce efecte negative asupra sănătății lucrătorilor.',
    legalSource: 'HG 1425/2006',
    relatedTerms: ['Expunere profesionala', 'Masuratori', 'Boli profesionale']
  },
  {
    term: 'Monitoring Medical',
    abbreviation: '',
    definition: 'Supravegherea continuă a stării de sănătate a lucrătorilor expuși la riscuri profesionale, prin controale medicale periodice.',
    legalSource: 'HG 355/2007',
    relatedTerms: ['Control medical periodic', 'Medicina muncii', 'Supraveghere sanatate']
  },
  {
    term: 'Aptitudine Medicală',
    abbreviation: '',
    definition: 'Decizia medicului de medicina muncii privind capacitatea unei persoane de a desfășura o anumită activitate, în funcție de starea sa de sănătate.',
    legalSource: 'HG 355/2007',
    relatedTerms: ['Aviz medical', 'Medicina muncii', 'Control medical']
  },
  {
    term: 'Prim Ajutor',
    abbreviation: '',
    definition: 'Îngrijiri și manevre efectuate unei persoane accidentate sau care s-a îmbolnăvit, până la sosirea personalului medical specializat.',
    legalSource: 'Legea 319/2006, art. 29',
    relatedTerms: ['Trusa prim ajutor', 'Personal instruit', 'Urgente medicale']
  },
  {
    term: 'Trusa de Prim Ajutor',
    abbreviation: '',
    definition: 'Cutie sau geantă care conține materiale sanitare și medicamente pentru acordarea primului ajutor, obligatorie la locul de muncă.',
    legalSource: 'Ord. 1002/2006',
    relatedTerms: ['Prim ajutor', 'Dotare locuri munca', 'Urgente']
  },
  {
    term: 'Program de Prevenire',
    abbreviation: '',
    definition: 'Document de planificare a activităților de prevenire pe termen mediu și lung, cu obiective, acțiuni, responsabili și resurse.',
    legalSource: 'Legea 319/2006',
    relatedTerms: ['Plan de prevenire si protectie', 'Evaluarea riscurilor', 'Masuri preventive']
  },
  {
    term: 'Audit SSM',
    abbreviation: '',
    definition: 'Evaluare sistematică, documentată, periodică și obiectivă a modului în care sunt aplicate dispozițiile legale și interne în domeniul SSM.',
    legalSource: 'Legea 319/2006',
    relatedTerms: ['Verificare conformitate', 'Raport audit', 'Imbunatatire continua']
  },
  {
    term: 'Îmbrăcăminte de Lucru',
    abbreviation: '',
    definition: 'Echipament de protecție purtat de lucrător pentru a-și proteja îmbrăcămintea personală și pentru a preveni riscurile la locul de muncă.',
    legalSource: 'Contractul colectiv de muncă, Legea 319/2006',
    relatedTerms: ['Echipament de protectie', 'Dotare lucratori', 'Uniforme']
  },
  {
    term: 'Factori de Microclimat',
    abbreviation: '',
    definition: 'Parametri ai mediului de lucru care influențează confortul termic: temperatura, umiditatea, viteza aerului, radiația termică.',
    legalSource: 'HG 1093/2006',
    relatedTerms: ['Conditii de lucru', 'Mediu de lucru', 'Ventilare']
  },
  {
    term: 'Ergonomie',
    abbreviation: '',
    definition: 'Știința care studiază adaptarea condițiilor de muncă la capacitățile fizice și psihice ale lucrătorului pentru prevenirea oboselii și îmbolnăvirilor.',
    legalSource: 'HG 1091/2006',
    relatedTerms: ['Postura de lucru', 'Tulburari musculo-scheletice', 'Loc de munca ergonomic']
  },
  {
    term: 'Tulburări Musculo-Scheletice',
    abbreviation: 'TMS',
    definition: 'Afecțiuni ale mușchilor, tendoanelor, articulațiilor și nervilor cauzate de efort repetat, posturi vicioase sau manipulare manuală de greutăți.',
    legalSource: 'Boli profesionale, HG 1425/2006',
    relatedTerms: ['Ergonomie', 'Manipulare manuala', 'Postura de lucru']
  },
  {
    term: 'Manipulare Manuală de Sarcini',
    abbreviation: '',
    definition: 'Orice activitate care implică ridicarea, coborârea, împingerea, tragerea sau transportul unei sarcini de către unul sau mai mulți lucrători.',
    legalSource: 'HG 1092/2006',
    relatedTerms: ['Tulburari musculo-scheletice', 'Ergonomie', 'Limite greutate']
  },
  {
    term: 'Stres Profesional',
    abbreviation: '',
    definition: 'Reacție fizică și emoțională nocivă care apare când cerințele muncii nu corespund cu capacitățile, resursele sau nevoile lucrătorului.',
    legalSource: 'Directiva 89/391/CEE, transpusă în Legea 319/2006',
    relatedTerms: ['Risc psihosocial', 'Sanatate mentala', 'Organizarea muncii']
  },
  {
    term: 'Hărțuire la Locul de Muncă',
    abbreviation: '',
    definition: 'Comportament nedorit care se referă la caracteristici personale ale unui lucrător și creează un mediu intimidant, ostil, degradant, umilitor sau ofensator.',
    legalSource: 'OUG 137/2000, Legea 202/2002',
    relatedTerms: ['Discriminare', 'Risc psihosocial', 'Protectia demnitatii']
  },
  {
    term: 'Munca de Noapte',
    abbreviation: '',
    definition: 'Program de lucru desfășurat în intervalul 22:00 - 06:00, cu reglementări speciale privind durata și protecția lucrătorilor.',
    legalSource: 'Codul Muncii, Legea 53/2003, art. 115-119',
    relatedTerms: ['Program de lucru', 'Timp de lucru', 'Control medical specific']
  },
  {
    term: 'Femeile Gravide și Lăuzele',
    abbreviation: '',
    definition: 'Categoria de lucrători care beneficiază de protecție specială prin interzicerea unor activități periculoase sau solicitante.',
    legalSource: 'HG 537/2007',
    relatedTerms: ['Protectie speciala', 'Reevaluare riscuri', 'Adaptare conditii']
  },
  {
    term: 'Tineri Lucrători',
    abbreviation: '',
    definition: 'Persoane cu vârsta sub 18 ani care beneficiază de protecție specială la locul de muncă, cu restricții privind activitățile periculoase.',
    legalSource: 'Legea 319/2006, art. 25; HG 1091/2006',
    relatedTerms: ['Protectie minori', 'Munca interzise', 'Evaluare riscuri specifice']
  },
  {
    term: 'Răspundere Penală în SSM',
    abbreviation: '',
    definition: 'Consecințele juridice penale ale nerespectării normelor de securitate și sănătate în muncă, în special în cazul accidentelor grave sau deceselor.',
    legalSource: 'Legea 319/2006, art. 35-36; Codul Penal',
    relatedTerms: ['Sanctiuni', 'Accident de munca', 'Obligatii angajator']
  },
  {
    term: 'Contravențiile în SSM',
    abbreviation: '',
    definition: 'Încălcări ale normelor de securitate și sănătate în muncă care atrag sancțiuni contravenționale (amenzi).',
    legalSource: 'Legea 319/2006, art. 37-39',
    relatedTerms: ['Sanctiuni', 'ITM', 'Control inspectie']
  },
  {
    term: 'Suspendarea Activității',
    abbreviation: '',
    definition: 'Măsură aplicată de Inspecția Muncii pentru oprirea imediată a lucrului într-o unitate sau la un loc de muncă unde există pericol iminent de accidentare.',
    legalSource: 'OUG 96/2003',
    relatedTerms: ['ITM', 'Pericol iminent', 'Sanctiuni']
  }
];

/**
 * Funcție de căutare în glosar
 * @param query - Termenul de căutare
 * @returns Array de termeni care corespund criteriilor de căutare
 */
export function searchGlossar(query: string): GlossaryTerm[] {
  if (!query || query.trim() === '') {
    return glossarSSM;
  }

  const searchTerm = query.toLowerCase().trim();

  return glossarSSM.filter(item => {
    // Căutare în termen
    if (item.term.toLowerCase().includes(searchTerm)) {
      return true;
    }

    // Căutare în abreviere
    if (item.abbreviation && item.abbreviation.toLowerCase().includes(searchTerm)) {
      return true;
    }

    // Căutare în definiție
    if (item.definition.toLowerCase().includes(searchTerm)) {
      return true;
    }

    // Căutare în termeni legați
    if (item.relatedTerms.some(term => term.toLowerCase().includes(searchTerm))) {
      return true;
    }

    return false;
  });
}

/**
 * Obține un termen specific după numele exact
 * @param termName - Numele exact al termenului
 * @returns Termenul găsit sau undefined
 */
export function getTermByName(termName: string): GlossaryTerm | undefined {
  return glossarSSM.find(item =>
    item.term.toLowerCase() === termName.toLowerCase() ||
    (item.abbreviation && item.abbreviation.toLowerCase() === termName.toLowerCase())
  );
}

/**
 * Obține termeni legați de un termen dat
 * @param termName - Numele termenului
 * @returns Array de termeni legați
 */
export function getRelatedTerms(termName: string): GlossaryTerm[] {
  const term = getTermByName(termName);
  if (!term) {
    return [];
  }

  return term.relatedTerms
    .map(relatedName => getTermByName(relatedName))
    .filter((t): t is GlossaryTerm => t !== undefined);
}

/**
 * Obține statistici despre glosar
 */
export function getGlossarStats() {
  const totalTerms = glossarSSM.length;
  const termsWithAbbreviation = glossarSSM.filter(t => t.abbreviation).length;
  const uniqueLegalSources = new Set(glossarSSM.map(t => t.legalSource)).size;
  const avgRelatedTerms = glossarSSM.reduce((sum, t) => sum + t.relatedTerms.length, 0) / totalTerms;

  return {
    totalTerms,
    termsWithAbbreviation,
    uniqueLegalSources,
    avgRelatedTerms: Math.round(avgRelatedTerms * 10) / 10
  };
}
