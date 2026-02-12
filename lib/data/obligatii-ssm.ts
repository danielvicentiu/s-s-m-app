/**
 * Obligații SSM/PSI pentru angajatori din România
 * Baza legală: Legea 319/2006, HG 1425/2006, HG 259/2022
 */

export interface ObligatieSsm {
  id: string;
  title: string;
  description: string;
  legalBasis: string;
  deadline: string;
  penalty: string;
  category: 'SSM' | 'PSI' | 'SU';
}

export const obligatiiSsm: ObligatieSsm[] = [
  {
    id: 'ssm-001',
    title: 'Organizarea activității de SSM',
    description: 'Angajatorul este obligat să organizeze activitatea de securitate și sănătate în muncă în cadrul unității, prin desemnare lucrator/serviciu intern sau serviciu extern',
    legalBasis: 'Legea 319/2006, art. 10',
    deadline: 'Permanent',
    penalty: 'Amendă de la 10.000 la 20.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-002',
    title: 'Evaluarea riscurilor pentru fiecare loc de muncă',
    description: 'Angajatorul trebuie să realizeze evaluarea riscurilor profesionale și să întocmească planul de prevenire și protecție',
    legalBasis: 'Legea 319/2006, art. 11',
    deadline: 'Înainte de începerea activității și periodic',
    penalty: 'Amendă de la 20.000 la 40.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-003',
    title: 'Instruirea angajaților în domeniul SSM',
    description: 'Angajatorul trebuie să asigure instruirea angajaților: instruire generală (8h), la locul de muncă (8h), periodică (anual)',
    legalBasis: 'HG 1425/2006, cap. II',
    deadline: 'La angajare și anual',
    penalty: 'Amendă de la 5.000 la 10.000 lei/salariat',
    category: 'SSM'
  },
  {
    id: 'ssm-004',
    title: 'Controlul medical la angajare',
    description: 'Angajatorul asigură examinarea medicală a salariaților înainte de angajare pentru stabilirea aptitudinii',
    legalBasis: 'Legea 319/2006, art. 22',
    deadline: 'Înainte de angajare',
    penalty: 'Amendă de la 3.000 la 5.000 lei/salariat',
    category: 'SSM'
  },
  {
    id: 'ssm-005',
    title: 'Controlul medical periodic',
    description: 'Angajatorul asigură supravegherea medicală periodică a lucrătorilor, conform programului stabilit de medicul de medicina muncii',
    legalBasis: 'Legea 319/2006, art. 22',
    deadline: 'Periodic (anual, semestrial sau la interval stabilit)',
    penalty: 'Amendă de la 3.000 la 5.000 lei/salariat',
    category: 'SSM'
  },
  {
    id: 'ssm-006',
    title: 'Dotarea cu echipament individual de protecție (EIP)',
    description: 'Angajatorul furnizează gratuit echipamentul individual de protecție adecvat riscurilor identificate',
    legalBasis: 'HG 1425/2006, art. 104',
    deadline: 'Permanent',
    penalty: 'Amendă de la 5.000 la 10.000 lei/salariat',
    category: 'SSM'
  },
  {
    id: 'ssm-007',
    title: 'Autorizarea funcționării echipamentelor de muncă',
    description: 'Echipamentele de muncă cu risc ridicat trebuie autorizate de ISCIR înainte de punerea în funcțiune',
    legalBasis: 'HG 1146/2006',
    deadline: 'Înainte de punerea în funcțiune și periodic',
    penalty: 'Amendă de la 10.000 la 20.000 lei/echipament',
    category: 'SSM'
  },
  {
    id: 'ssm-008',
    title: 'Verificarea stării de funcționare a echipamentelor',
    description: 'Angajatorul verifică și întreține echipamentele de muncă pentru menținerea lor în stare sigură',
    legalBasis: 'HG 1146/2006, art. 5',
    deadline: 'Periodic conform specificațiilor',
    penalty: 'Amendă de la 5.000 la 10.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-009',
    title: 'Întocmirea fișelor individuale de evaluare a riscurilor',
    description: 'Pentru fiecare angajat se întocmește fișa individuală cu riscurile identificate la locul său de muncă',
    legalBasis: 'Legea 319/2006, art. 11',
    deadline: 'La angajare și actualizare anuală',
    penalty: 'Amendă de la 2.000 la 5.000 lei/salariat',
    category: 'SSM'
  },
  {
    id: 'ssm-010',
    title: 'Raportarea accidentelor de muncă',
    description: 'Angajatorul raportează accidentele de muncă către ITM în termen de 24 ore de la producere',
    legalBasis: 'Legea 319/2006, art. 27',
    deadline: 'În termen de 24 ore',
    penalty: 'Amendă de la 20.000 la 40.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-011',
    title: 'Cercetarea accidentelor de muncă',
    description: 'Angajatorul cercetează accidentele de muncă și întocmește proces-verbal de cercetare',
    legalBasis: 'HG 1425/2006, cap. VI',
    deadline: 'În termen de 15 zile de la producere',
    penalty: 'Amendă de la 15.000 la 30.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-012',
    title: 'Înregistrarea accidentelor în Registrul de evidență',
    description: 'Toate accidentele de muncă se înregistrează în Registrul general de evidență a accidentelor de muncă',
    legalBasis: 'HG 1425/2006, art. 16',
    deadline: 'Imediat după cercetare',
    penalty: 'Amendă de la 5.000 la 10.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-013',
    title: 'Declararea bolilor profesionale',
    description: 'Angajatorul declară cazurile de boli profesionale confirmate către ITM și CNPP',
    legalBasis: 'Legea 319/2006, art. 31',
    deadline: 'În termen de 5 zile de la diagnostic',
    penalty: 'Amendă de la 10.000 la 20.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-014',
    title: 'Monitorizarea factorilor de risc',
    description: 'Angajatorul asigură măsurarea și monitorizarea periodică a factorilor de risc (zgomot, vibrații, substanțe chimice, etc.)',
    legalBasis: 'HG 1425/2006, art. 50-60',
    deadline: 'Periodic (anual sau conform normelor specifice)',
    penalty: 'Amendă de la 10.000 la 20.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-015',
    title: 'Asigurarea primului ajutor',
    description: 'Angajatorul dotează locurile de muncă cu truse de prim ajutor și desemnează persoane instruite',
    legalBasis: 'HG 1425/2006, art. 94',
    deadline: 'Permanent',
    penalty: 'Amendă de la 5.000 la 10.000 lei',
    category: 'SSM'
  },
  {
    id: 'psi-001',
    title: 'Autorizarea de securitate la incendiu',
    description: 'Angajatorul obține autorizația de securitate la incendiu pentru funcționarea clădirii/spațiului',
    legalBasis: 'Legea 307/2006',
    deadline: 'Înainte de începerea activității',
    penalty: 'Amendă de la 10.000 la 20.000 lei',
    category: 'PSI'
  },
  {
    id: 'psi-002',
    title: 'Organizarea serviciului de urgență privat',
    description: 'Angajatorul organizează serviciul privat pentru situații de urgență (1 salariat la 50 angajați)',
    legalBasis: 'Legea 307/2006, art. 19',
    deadline: 'Permanent',
    penalty: 'Amendă de la 5.000 la 10.000 lei',
    category: 'PSI'
  },
  {
    id: 'psi-003',
    title: 'Instruirea angajaților în domeniul PSI',
    description: 'Angajatorul instruiește periodic angajații privind prevenirea și stingerea incendiilor',
    legalBasis: 'Legea 307/2006, art. 20',
    deadline: 'Anual sau când intervin modificări',
    penalty: 'Amendă de la 3.000 la 7.000 lei',
    category: 'PSI'
  },
  {
    id: 'psi-004',
    title: 'Dotarea cu mijloace de stingere a incendiilor',
    description: 'Angajatorul dotează locurile de muncă cu stingătoare și alte mijloace de stingere conform normelor',
    legalBasis: 'HG 1492/2004',
    deadline: 'Permanent',
    penalty: 'Amendă de la 5.000 la 10.000 lei',
    category: 'PSI'
  },
  {
    id: 'psi-005',
    title: 'Verificarea și întreținerea stingătoarelor',
    description: 'Stingătoarele se verifică anual și se reîncarcă conform termenelor din certificat',
    legalBasis: 'HG 1492/2004',
    deadline: 'Anual',
    penalty: 'Amendă de la 3.000 la 5.000 lei',
    category: 'PSI'
  },
  {
    id: 'psi-006',
    title: 'Întocmirea planului de evacuare',
    description: 'Angajatorul întocmește și afișează planul de evacuare în caz de incendiu',
    legalBasis: 'Legea 307/2006',
    deadline: 'Permanent, actualizare la modificări',
    penalty: 'Amendă de la 5.000 la 10.000 lei',
    category: 'PSI'
  },
  {
    id: 'psi-007',
    title: 'Executarea exercițiilor de evacuare',
    description: 'Angajatorul organizează exerciții practice de evacuare cel puțin anual',
    legalBasis: 'Legea 307/2006',
    deadline: 'Anual',
    penalty: 'Amendă de la 5.000 la 10.000 lei',
    category: 'PSI'
  },
  {
    id: 'psi-008',
    title: 'Verificarea instalațiilor electrice',
    description: 'Angajatorul verifică periodic instalațiile electrice pentru prevenirea incendiilor',
    legalBasis: 'Legea 307/2006',
    deadline: 'Periodic conform normativelor',
    penalty: 'Amendă de la 5.000 la 10.000 lei',
    category: 'PSI'
  },
  {
    id: 'ssm-016',
    title: 'Desemnarea lucrătorilor pentru primul ajutor',
    description: 'Angajatorul desemnează și pregătește lucrători pentru acordarea primului ajutor',
    legalBasis: 'HG 1425/2006, art. 94',
    deadline: 'Permanent',
    penalty: 'Amendă de la 3.000 la 5.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-017',
    title: 'Asigurarea de accidente de muncă',
    description: 'Angajatorul contractează asigurare pentru accidente de muncă și boli profesionale',
    legalBasis: 'Legea 346/2002',
    deadline: 'Permanent',
    penalty: 'Amendă de la 10.000 la 20.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-018',
    title: 'Amenajarea locurilor de muncă cu ecrane de vizualizare',
    description: 'Angajatorul asigură condiții ergonomice pentru lucrul la calculator (iluminat, scaun, pauze)',
    legalBasis: 'HG 1425/2006, cap. VIII',
    deadline: 'Permanent',
    penalty: 'Amendă de la 2.000 la 5.000 lei/loc de muncă',
    category: 'SSM'
  },
  {
    id: 'ssm-019',
    title: 'Asigurarea condițiilor microclimatice',
    description: 'Angajatorul asigură temperatura, ventilație și umiditate corespunzătoare în spațiile de lucru',
    legalBasis: 'HG 1425/2006',
    deadline: 'Permanent',
    penalty: 'Amendă de la 5.000 la 10.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-020',
    title: 'Asigurarea iluminatului la locurile de muncă',
    description: 'Angajatorul asigură iluminat natural și artificial adecvat activităților desfășurate',
    legalBasis: 'HG 1425/2006',
    deadline: 'Permanent',
    penalty: 'Amendă de la 3.000 la 7.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-021',
    title: 'Afișarea instrucțiunilor proprii de SSM',
    description: 'Angajatorul afișează instrucțiunile de securitate și sănătate în muncă la locurile de muncă',
    legalBasis: 'HG 1425/2006',
    deadline: 'Permanent',
    penalty: 'Amendă de la 2.000 la 5.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-022',
    title: 'Întocmirea instrucțiunilor proprii de SSM',
    description: 'Angajatorul elaborează instrucțiuni proprii de SSM adaptate specificului activității',
    legalBasis: 'Legea 319/2006, art. 13',
    deadline: 'La începerea activității și actualizare',
    penalty: 'Amendă de la 5.000 la 10.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-023',
    title: 'Accesul la locurile de muncă',
    description: 'Angajatorul asigură căi de acces și circulație sigure către și între locurile de muncă',
    legalBasis: 'HG 1425/2006',
    deadline: 'Permanent',
    penalty: 'Amendă de la 3.000 la 7.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-024',
    title: 'Semnalizarea de securitate și sănătate',
    description: 'Angajatorul instalează panouri și semne de securitate conform riscurilor identificate',
    legalBasis: 'HG 971/2006',
    deadline: 'Permanent',
    penalty: 'Amendă de la 3.000 la 5.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-025',
    title: 'Comunicarea riscurilor către angajați',
    description: 'Angajatorul informează lucrătorii asupra riscurilor la care sunt expuși',
    legalBasis: 'Legea 319/2006, art. 16',
    deadline: 'Permanent și la modificări',
    penalty: 'Amendă de la 3.000 la 5.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-026',
    title: 'Consultarea lucrătorilor în problemele de SSM',
    description: 'Angajatorul consultă lucrătorii în elaborarea măsurilor de prevenire și protecție',
    legalBasis: 'Legea 319/2006, art. 18',
    deadline: 'Periodic',
    penalty: 'Amendă de la 2.000 la 5.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-027',
    title: 'Facilitarea alegerii reprezentanților lucrătorilor cu responsabilități SSM',
    description: 'La peste 50 angajați, se aleg reprezentanți ai lucrătorilor cu atribuții specifice de SSM',
    legalBasis: 'Legea 319/2006, art. 19',
    deadline: 'Permanent',
    penalty: 'Amendă de la 3.000 la 5.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-028',
    title: 'Evidența lucrătorilor expuși la riscuri specifice',
    description: 'Angajatorul ține evidența distinctă a lucrătorilor expuși la substanțe periculoase, zgomot peste limită, etc.',
    legalBasis: 'HG 1425/2006',
    deadline: 'Permanent',
    penalty: 'Amendă de la 5.000 la 10.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-029',
    title: 'Păstrarea documentelor de SSM',
    description: 'Angajatorul păstrează documentele de evaluare, instruire și supraveghere medicală conform termenelor legale',
    legalBasis: 'Legea 319/2006',
    deadline: 'Conform legislației (min. 5 ani sau pe durata contractului)',
    penalty: 'Amendă de la 3.000 la 7.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-030',
    title: 'Raportarea către ITM a organizării activității de SSM',
    description: 'Angajatorul notifică ITM asupra modului de organizare a activității de SSM',
    legalBasis: 'Legea 319/2006, art. 10',
    deadline: 'La începerea activității și la modificări',
    penalty: 'Amendă de la 5.000 la 10.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-031',
    title: 'Instruirea conducătorilor de locuri de muncă',
    description: 'Angajatorul asigură instruirea specifică pentru șefi de echipă, maiștri, manageri',
    legalBasis: 'HG 1425/2006',
    deadline: 'La numire și periodic',
    penalty: 'Amendă de la 3.000 la 7.000 lei',
    category: 'SSM'
  },
  {
    id: 'su-001',
    title: 'Elaborarea planului de analiză și acoperire a riscurilor',
    description: 'Angajatorul analizează riscurile la adresa continuității activității și elaborează planul PAAR',
    legalBasis: 'HG 1490/2004',
    deadline: 'Anual',
    penalty: 'Amendă de la 5.000 la 10.000 lei',
    category: 'SU'
  },
  {
    id: 'su-002',
    title: 'Elaborarea planului de protecție și intervenție',
    description: 'Pentru operatorii economici cu risc ridicat se elaborează planul de protecție și intervenție',
    legalBasis: 'Legea 481/2004',
    deadline: 'La începerea activității și actualizare anuală',
    penalty: 'Amendă de la 10.000 la 20.000 lei',
    category: 'SU'
  },
  {
    id: 'su-003',
    title: 'Notificarea situațiilor de urgență',
    description: 'Angajatorul raportează către autoritățile competente orice situație de urgență produsă',
    legalBasis: 'Legea 481/2004',
    deadline: 'Imediat',
    penalty: 'Amendă de la 10.000 la 20.000 lei',
    category: 'SU'
  },
  {
    id: 'ssm-032',
    title: 'Instruirea pentru lucrul în spații înguste',
    description: 'Angajații care lucrează în spații înguste (cămine, rezervoare) primesc instruire suplimentară',
    legalBasis: 'HG 1425/2006',
    deadline: 'Înainte de prima intrare și periodic',
    penalty: 'Amendă de la 5.000 la 10.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-033',
    title: 'Autorizarea operatorilor pentru echipamente speciale',
    description: 'Angajații care operează echipamente cu risc ridicat (motostivuitoare, macarale, etc.) trebuie autorizați ISCIR',
    legalBasis: 'HG 1146/2006',
    deadline: 'Înainte de operare',
    penalty: 'Amendă de la 10.000 la 20.000 lei/operator',
    category: 'SSM'
  },
  {
    id: 'ssm-034',
    title: 'Verificarea competenței lucrătorilor',
    description: 'Angajatorul verifică periodic competența profesională a angajaților în raport cu atribuțiile de SSM',
    legalBasis: 'Legea 319/2006, art. 13',
    deadline: 'Periodic',
    penalty: 'Amendă de la 3.000 la 5.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-035',
    title: 'Asigurarea echipamentelor de lucru la înălțime',
    description: 'Pentru lucrul la înălțime, angajatorul asigură scări, schele, harnașamente și EIP specific',
    legalBasis: 'HG 1425/2006',
    deadline: 'Permanent',
    penalty: 'Amendă de la 10.000 la 20.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-036',
    title: 'Marcarea zonelor cu acces restricționat',
    description: 'Zonele periculoase se delimitează și se marchează corespunzător (grosime, adâncime, electricitate, etc.)',
    legalBasis: 'HG 1425/2006',
    deadline: 'Permanent',
    penalty: 'Amendă de la 5.000 la 10.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-037',
    title: 'Verificarea instalațiilor de ventilație și captare praf/noxe',
    description: 'Instalațiile de ventilație industrială se verifică periodic pentru menținerea eficienței',
    legalBasis: 'HG 1425/2006',
    deadline: 'Periodic (trimestrial sau semestrial)',
    penalty: 'Amendă de la 5.000 la 10.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-038',
    title: 'Asigurarea grupurilor sanitare și vestiare',
    description: 'Angajatorul asigură grupuri sanitare, vestiare și dușuri în funcție de numărul de angajați',
    legalBasis: 'HG 1425/2006',
    deadline: 'Permanent',
    penalty: 'Amendă de la 5.000 la 10.000 lei',
    category: 'SSM'
  },
  {
    id: 'ssm-039',
    title: 'Menținerea curățeniei la locurile de muncă',
    description: 'Angajatorul asigură curățenia și igiena permanentă a locurilor de muncă și căilor de acces',
    legalBasis: 'HG 1425/2006',
    deadline: 'Permanent',
    penalty: 'Amendă de la 2.000 la 5.000 lei',
    category: 'SSM'
  },
  {
    id: 'psi-009',
    title: 'Asigurarea semnalizării căilor de evacuare',
    description: 'Căile de evacuare trebuie semnalizate cu pictograme luminescente/iluminate',
    legalBasis: 'HG 1492/2004',
    deadline: 'Permanent',
    penalty: 'Amendă de la 3.000 la 5.000 lei',
    category: 'PSI'
  },
  {
    id: 'psi-010',
    title: 'Menținerea liberă a căilor de evacuare',
    description: 'Căile de evacuare și ieșirile de urgență trebuie menținute libere, fără obstacole',
    legalBasis: 'Legea 307/2006',
    deadline: 'Permanent',
    penalty: 'Amendă de la 5.000 la 10.000 lei',
    category: 'PSI'
  },
  {
    id: 'ssm-040',
    title: 'Actualizarea evaluării riscurilor',
    description: 'Evaluarea riscurilor se actualizează ori de câte ori apar modificări ale proceselor de muncă sau echipamentelor',
    legalBasis: 'Legea 319/2006, art. 11',
    deadline: 'La modificări majore',
    penalty: 'Amendă de la 15.000 la 30.000 lei',
    category: 'SSM'
  }
];
