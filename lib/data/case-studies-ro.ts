export interface CaseStudy {
  slug: string;
  title: string;
  industry: string;
  companySize: string;
  companyName: string;
  location: string;
  challenge: {
    title: string;
    description: string;
    problems: string[];
  };
  solution: {
    title: string;
    description: string;
    features: string[];
    implementation: string;
  };
  results: {
    title: string;
    metrics: {
      label: string;
      value: string;
      description: string;
    }[];
    additionalBenefits: string[];
  };
  testimonial: {
    quote: string;
    author: string;
    role: string;
    companyName: string;
  };
  image: string;
  date: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'constructii-50-angajati',
    title: 'Digitalizare SSM pentru Firmă de Construcții cu 50 Angajați',
    industry: 'Construcții',
    companySize: '50 angajați',
    companyName: 'BuildTech Solutions',
    location: 'București',
    challenge: {
      title: 'Gestionarea Conformității pe Multiple Șantiere',
      description:
        'BuildTech Solutions se confrunta cu provocări majore în gestionarea documentației SSM pe 8 șantiere active simultan. Amenințările de amenzi și lipsa vizibilității centralizate creeau riscuri majore.',
      problems: [
        'Documente SSM pe hârtie pierdute sau incomplete pe șantiere',
        'Imposibilitatea de a verifica în timp real situația instruirilor SSM',
        'Amenzi de 15.000 RON în ultimele 6 luni pentru lipsă documentație',
        'Timp excesiv petrecut de șefi de șantier pentru completare fișe SSM',
        'Absența unui sistem de alertare pentru expirări avize medicale',
        'Dificultăți în pregătirea pentru inspecțiile ITM',
      ],
    },
    solution: {
      title: 'Platformă Digitală Unificată SSM',
      description:
        'Implementarea platformei s-s-m.ro a permis centralizarea întregii documentații SSM și automatizarea proceselor de compliance pentru toate șantierele.',
      features: [
        'Înregistrare digitală a tuturor angajaților cu documentele SSM asociate',
        'Sistem automat de alertare pentru expirări (avize medicale, instruiri)',
        'Aplicație mobilă pentru șefi de șantier - acces la documente pe teren',
        'Module dedicate pentru gestionarea echipamentelor de protecție',
        'Rapoarte automate pentru inspecții ITM',
        'Dashboard central pentru monitorizarea tuturor șantierelor',
      ],
      implementation:
        'Implementare completă realizată în 2 săptămâni: migrare date existente (ziua 1-3), training echipă management (ziua 4-5), pilot pe 2 șantiere (săptămâna 2), extindere pe toate cele 8 șantiere (săptămâna 3).',
    },
    results: {
      title: 'Rezultate Măsurabile după 6 Luni',
      metrics: [
        {
          label: 'Reducere Amenzi',
          value: '100%',
          description: 'Zero amenzi ITM în ultimele 6 luni (vs 15.000 RON anterior)',
        },
        {
          label: 'Timp Salvat',
          value: '80%',
          description: 'Reducere de la 40h/lună la 8h/lună pentru documentație SSM',
        },
        {
          label: 'Conformitate',
          value: '100%',
          description: 'Toate cele 400 documente SSM actualizate și valide',
        },
        {
          label: 'Rate Răspuns Alertare',
          value: '95%',
          description: 'Expirări avize medicale rezolvate cu 30 zile înainte de termen',
        },
      ],
      additionalBenefits: [
        'Inspecții ITM trecute fără nicio observație în ultimele 2 vizite',
        'Creșterea satisfacției angajaților prin acces facil la propriile documente SSM',
        'Reducerea stresului echipei de management legat de conformitate',
        'Capacitate de a răspunde instantaneu la solicitări de documentație de la clienți',
        'Îmbunătățirea imaginii companiei față de parteneri și clienți',
      ],
    },
    testimonial: {
      quote:
        'S-s-m.ro ne-a transformat complet modul în care gestionăm conformitatea SSM. Înainte trăiam cu frica inspecțiilor ITM - acum avem totul sub control, digital și la un click distanță. Investiția s-a recuperat din prima amendă evitată!',
      author: 'Ing. Mihai Popescu',
      role: 'Director Operațiuni',
      companyName: 'BuildTech Solutions',
    },
    image: '/images/case-studies/construction.jpg',
    date: '2025-08-15',
  },
  {
    slug: 'restaurant-15-angajati',
    title: 'Simplificarea Conformității SSM pentru Lanț de Restaurante',
    industry: 'HoReCa',
    companySize: '15 angajați',
    companyName: 'Gusturi Urbane',
    location: 'Cluj-Napoca',
    challenge: {
      title: 'Complexitatea Conformității cu Resurse Limitate',
      description:
        'Gusturi Urbane, cu 3 locații și 15 angajați, se confrunta cu dificultăți în gestionarea conformității SSM și PSI fără o persoană dedicată pentru această responsabilitate.',
      problems: [
        'Proprietarul gestiona personal SSM în afara programului, fără expertiză',
        'Fluturare mare de personal - angajați noi necesitau instruiri SSM urgente',
        'Documente PSI expirate descoperite în timpul unei inspecții (amendă 8.000 RON)',
        'Dificultăți în programarea controalelor medicale pentru personalul în ture',
        'Lipsa unei evidențe centralizate pentru cele 3 locații',
        'Confuzie legată de termenele legale diferite (SSM, PSI, medical)',
      ],
    },
    solution: {
      title: 'Automatizare Completă SSM/PSI',
      description:
        'Implementarea s-s-m.ro a oferit o soluție all-in-one care nu necesită cunoștințe de specialitate, cu automatizări inteligente și consultanță inclusă.',
      features: [
        'Onboarding automat pentru angajați noi cu checklist SSM/PSI',
        'Notificări email/SMS automate pentru expirări (30, 15, 7 zile înainte)',
        'Interfață simplificată - fără jargon tehnic, înțeleasă de orice manager',
        'Module speciale HoReCa: gestionare controale medicale specific alimentație',
        'Suport consultanță SSM inclus în abonament (răspunsuri în 24h)',
        'Rapoarte automate lunare trimise direct la mail',
      ],
      implementation:
        'Setup complet în 3 zile: configurare cont și primul angajat (ziua 1), import date angajați și scanare documente existente (ziua 2), training proprietar și manageri locații - 2h (ziua 3). Prima alertă de expirare utilă primită în ziua 5.',
    },
    results: {
      title: 'Impact în Primele 3 Luni',
      metrics: [
        {
          label: 'Reducere Amenzi',
          value: '100%',
          description: 'De la 8.000 RON amenzi la zero neconformități',
        },
        {
          label: 'Timp Salvat',
          value: '90%',
          description: 'De la 12h/lună la doar 1h/lună pentru administrare SSM',
        },
        {
          label: 'Onboarding Angajați',
          value: '75%',
          description: 'Reducere timp de la angajare la conformitate completă SSM',
        },
        {
          label: 'Zero Stress',
          value: '100%',
          description: 'Proprietarul nu mai pierde nopți cu gândul la inspecții',
        },
      ],
      additionalBenefits: [
        'Control medical organizat eficient pentru 15 angajați în 2 zile (vs 2 săptămâni anterior)',
        'Acces imediat la consultant SSM pentru întrebări și clarificări',
        'Documentație pregătită profesional pentru orice tip de inspecție',
        'Creșterea încrederii angajaților prin transparență (fiecare vede propriile documente)',
        'Posibilitate de extindere ușoară la noi locații fără complicații administrative',
      ],
    },
    testimonial: {
      quote:
        'Ca antreprenor în HoReCa, SSM-ul era un coșmar birocratic. S-s-m.ro mi-a dat libertatea să mă concentrez pe business - platforma se ocupă de tot, iar eu primesc doar notificări când trebuie să acționez. Cel mai bun ROI din toate software-urile pe care le folosesc!',
      author: 'Elena Dumitrescu',
      role: 'Proprietar',
      companyName: 'Gusturi Urbane',
    },
    image: '/images/case-studies/restaurant.jpg',
    date: '2025-10-20',
  },
  {
    slug: 'fabrica-200-angajati',
    title: 'Transformare Digitală SSM pentru Fabrică cu 200 Angajați',
    industry: 'Producție',
    companySize: '200 angajați',
    companyName: 'TechManufacturing Pro',
    location: 'Timișoara',
    challenge: {
      title: 'Complexitate Operațională și Conformitate Multi-Nivel',
      description:
        'TechManufacturing Pro avea nevoie de o soluție enterprise pentru gestionarea conformității SSM la nivel de fabrică, cu cerințe specifice pentru audit și raportare.',
      problems: [
        'Dosare fizice SSM pentru 200 angajați în arhivă - acces lent, risc de pierdere',
        'Echipă SSM internă (2 persoane) copleșită de volum administrativ',
        'Amenzi cumulate de 45.000 RON în ultimul an pentru documentație incompletă',
        'Imposibilitatea de a genera rapid rapoarte pentru audit extern (ISO 45001)',
        'Lipsa integrării între module: medical, instruiri, echipamente protecție, incidente',
        'Dificultăți în urmărirea instruirilor specifice pe posturi (200 angajați, 50 posturi diferite)',
        'Management deficitar al echipamentelor de protecție (stoc, distribuire, evidență)',
        'Raportare neeficientă a incidentelor SSM către conducere',
      ],
    },
    solution: {
      title: 'Platformă Enterprise SSM cu Module Integrate',
      description:
        'Implementarea s-s-m.ro în configurație enterprise cu module dedicate pentru gestionarea completă a ciclului de viață SSM pentru 200 angajați și infrastructură complexă.',
      features: [
        'Arhivă digitală completă: 200 dosare SSM digitizate cu OCR search',
        'Matrice de instruiri pe posturi: 50 posturi, peste 2.000 instruiri individuale urmărite',
        'Modul echipamente protecție: tracking stoc, distribuire, utilizare, întreținere',
        'Sistem de raportare incidente cu workflow de investigație',
        'Dashboard executiv cu KPI-uri SSM în timp real pentru management',
        'Export rapoarte pentru audit ISO 45001 (conforme cu cerințe auditori)',
        'API integrare cu SAP pentru sincronizare angajați',
        'Aplicație mobilă pentru inspectori SSM interni și supervizori linii producție',
        'Modul de planificare: generare automată plan instruiri anual',
      ],
      implementation:
        'Implementare în 6 săptămâni: analiza proceselor existente și configurare (săptămâna 1-2), migrare date și digitizare dosare fizice (săptămâna 3-4), training echipă SSM și pilot departament (săptămâna 5), extindere toate departamentele și go-live (săptămâna 6). Post-implementare: suport dedicat 3 luni.',
    },
    results: {
      title: 'Impact Strategic după 12 Luni',
      metrics: [
        {
          label: 'Reducere Amenzi',
          value: '100%',
          description: 'Zero amenzi ITM și trecerea a 3 inspecții fără observații',
        },
        {
          label: 'Eficiență Echipă SSM',
          value: '70%',
          description: 'Reducere timp administrativ de la 160h/lună la 48h/lună',
        },
        {
          label: 'Certificare ISO',
          value: '100%',
          description: 'Conformitate ISO 45001 - audit trecut fără non-conformități',
        },
        {
          label: 'Reducere Incidente',
          value: '35%',
          description: 'Scădere incidente SSM prin tracking proactiv și instruiri țintite',
        },
      ],
      additionalBenefits: [
        'Echipa SSM redirecționată de la administrație la activități proactive (inspecții, analize risc)',
        'Timpul pentru pregătire audit extern redus de la 2 săptămâni la 2 ore',
        'Eliminarea completă a dosarelor fizice - 200 dosare arhivate digital',
        'Management 3.500+ echipamente protecție cu tracking complet',
        'Raportare executivă lunară automată către CEO și Board',
        'Conformitate completă pentru extinderea fabricii (50 angajați noi onboarded fără probleme)',
        'ROI atins în 4 luni prin evitarea amenzilor și eficientizarea echipei SSM',
        'Premiu intern pentru digitalizare: "Best Digital Transformation Project 2025"',
      ],
    },
    testimonial: {
      quote:
        'S-s-m.ro a fost game changer pentru departamentul nostru SSM. Am trecut de la management haotic pe hârtie la o operațiune profesională, digitală, cu vizibilitate completă. Auditorul ISO ne-a felicitat pentru sistemul de management SSM - ceva de neimaginat acum un an. Recomand cu încredere oricărei fabrici serioase!',
      author: 'Dr. Ing. Adrian Munteanu',
      role: 'Manager SSM',
      companyName: 'TechManufacturing Pro',
    },
    image: '/images/case-studies/factory.jpg',
    date: '2025-12-10',
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

export function getAllCaseStudySlugs(): string[] {
  return caseStudies.map((cs) => cs.slug);
}
