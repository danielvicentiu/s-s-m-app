/**
 * Obligații GDPR pentru angajatori din România
 *
 * Baze legale:
 * - GDPR (Regulamentul UE 2016/679)
 * - Legea 190/2018 privind măsuri de punere în aplicare a GDPR
 */

export interface ObligatieGDPR {
  id: string;
  title: string;
  description: string;
  legalBasis: string;
  category: 'consent' | 'rights' | 'security' | 'dpo' | 'breach' | 'transfer' | 'documentation' | 'impact';
  deadline?: string;
  penalty: string;
  applicability: string;
}

export const obligatiiGDPR: ObligatieGDPR[] = [
  {
    id: 'gdpr-001',
    title: 'Registrul de evidență al activităților de prelucrare',
    description: 'Angajatorul trebuie să țină un registru detaliat al tuturor operațiunilor de prelucrare a datelor personale ale angajaților (recrutare, administrare salarizare, evaluare performanță, etc.).',
    legalBasis: 'GDPR Art. 30',
    category: 'documentation',
    deadline: 'Permanent actualizat',
    penalty: 'Până la 2% din cifra de afaceri anuală globală',
    applicability: 'Companii cu peste 250 angajați SAU care prelucrează date sensibile'
  },
  {
    id: 'gdpr-002',
    title: 'Desemnarea unui Data Protection Officer (DPO)',
    description: 'Obligația de a desemna un responsabil cu protecția datelor care să monitorizeze conformitatea GDPR și să fie punct de contact cu ANSPDCP.',
    legalBasis: 'GDPR Art. 37, Legea 190/2018 Art. 6',
    category: 'dpo',
    deadline: 'Imediat dacă se aplică criteriile',
    penalty: 'Până la 2% din cifra de afaceri anuală globală',
    applicability: 'Instituții publice SAU organizații care prelucrează sistematic date sensibile la scară largă'
  },
  {
    id: 'gdpr-003',
    title: 'Informarea angajaților la colectarea datelor',
    description: 'La angajare și la orice prelucrare nouă, angajatorul trebuie să informeze transparent angajații despre ce date colectează, de ce, cât timp le păstrează și care sunt drepturile lor.',
    legalBasis: 'GDPR Art. 13-14',
    category: 'rights',
    deadline: 'La momentul colectării datelor',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Toți angajatorii'
  },
  {
    id: 'gdpr-004',
    title: 'Obținerea consimțământului explicit',
    description: 'Pentru prelucrări care depășesc executarea contractului de muncă (ex: publicare poze pe site, monitorizare video cu recunoaștere facială), este necesar consimțământul liber și informat.',
    legalBasis: 'GDPR Art. 6(1)(a), Art. 7',
    category: 'consent',
    deadline: 'Înainte de prelucrare',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Toți angajatorii pentru prelucrări opționale'
  },
  {
    id: 'gdpr-005',
    title: 'Dreptul de acces al angajatului (Art. 15)',
    description: 'Angajatul poate solicita o copie a tuturor datelor personale procesate de angajator. Răspunsul trebuie dat în max. 30 zile, gratuit pentru prima cerere.',
    legalBasis: 'GDPR Art. 15',
    category: 'rights',
    deadline: '30 zile de la solicitare',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Toți angajatorii'
  },
  {
    id: 'gdpr-006',
    title: 'Dreptul la rectificare',
    description: 'Angajatul poate cere corectarea datelor incorecte sau completarea datelor incomplete.',
    legalBasis: 'GDPR Art. 16',
    category: 'rights',
    deadline: '30 zile de la solicitare',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Toți angajatorii'
  },
  {
    id: 'gdpr-007',
    title: 'Dreptul la ștergere ("dreptul de a fi uitat")',
    description: 'În anumite condiții, angajatul poate solicita ștergerea datelor (excepție: obligații legale de arhivare fiscală, salarizare - 50 ani).',
    legalBasis: 'GDPR Art. 17, Codul fiscal Art. 25',
    category: 'rights',
    deadline: '30 zile de la solicitare (dacă aplicabil)',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Toți angajatorii, cu excepții legale'
  },
  {
    id: 'gdpr-008',
    title: 'Dreptul la restricționarea prelucrării',
    description: 'Angajatul poate cere suspendarea temporară a prelucrării datelor în anumite cazuri (ex: contestă acuratețea datelor).',
    legalBasis: 'GDPR Art. 18',
    category: 'rights',
    deadline: '30 zile de la solicitare',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Toți angajatorii'
  },
  {
    id: 'gdpr-009',
    title: 'Dreptul la portabilitatea datelor',
    description: 'Angajatul poate cere datele într-un format structurat și ușor de transferat către alt operator.',
    legalBasis: 'GDPR Art. 20',
    category: 'rights',
    deadline: '30 zile de la solicitare',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Toți angajatorii pentru date bazate pe consimțământ sau contract'
  },
  {
    id: 'gdpr-010',
    title: 'Dreptul de opoziție',
    description: 'Angajatul poate obiecta la prelucrări bazate pe interes legitim (ex: marketing intern, profilare).',
    legalBasis: 'GDPR Art. 21',
    category: 'rights',
    deadline: 'Imediat sau 30 zile',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Toți angajatorii pentru prelucrări bazate pe interes legitim'
  },
  {
    id: 'gdpr-011',
    title: 'Notificarea breșei de securitate către ANSPDCP',
    description: 'În caz de incident de securitate (furt laptop, acces neautorizat, ransomware), angajatorul trebuie să notifice ANSPDCP în max. 72 ore.',
    legalBasis: 'GDPR Art. 33, Legea 190/2018',
    category: 'breach',
    deadline: '72 ore de la descoperire',
    penalty: 'Până la 2% din cifra de afaceri anuală globală',
    applicability: 'Toți angajatorii când există risc pentru drepturile persoanelor'
  },
  {
    id: 'gdpr-012',
    title: 'Notificarea breșei către angajați',
    description: 'Dacă breșa prezintă risc ridicat pentru drepturile angajaților, aceștia trebuie informați direct.',
    legalBasis: 'GDPR Art. 34',
    category: 'breach',
    deadline: 'Fără întârzieri nejustificate',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Toți angajatorii când riscul este ridicat'
  },
  {
    id: 'gdpr-013',
    title: 'Evaluarea impactului asupra protecției datelor (DPIA)',
    description: 'Pentru prelucrări cu risc ridicat (ex: monitorizare video sistematică, profilare extensivă, date biometrice), trebuie realizată o evaluare de impact ÎNAINTE de implementare.',
    legalBasis: 'GDPR Art. 35',
    category: 'impact',
    deadline: 'Înainte de a începe prelucrarea',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Angajatori care implementează sisteme cu risc ridicat'
  },
  {
    id: 'gdpr-014',
    title: 'Privacy by Design și by Default',
    description: 'Sistemele IT și procesele HR trebuie proiectate să protejeze datele din design (ex: criptare, pseudonimizare, minimizarea datelor colectate).',
    legalBasis: 'GDPR Art. 25',
    category: 'security',
    deadline: 'La implementarea oricărui sistem nou',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Toți angajatorii'
  },
  {
    id: 'gdpr-015',
    title: 'Măsuri tehnice și organizatorice de securitate',
    description: 'Implementarea de măsuri adecvate: parole puternice, criptare, backup-uri, acces restricționat, formare personal.',
    legalBasis: 'GDPR Art. 32',
    category: 'security',
    deadline: 'Permanent',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Toți angajatorii'
  },
  {
    id: 'gdpr-016',
    title: 'Contracte cu procesatori de date (externalizări)',
    description: 'Contracte scrise GDPR-compliant cu toți furnizorii care procesează date ale angajaților (ex: software salarizare, cloud storage, firme SSM).',
    legalBasis: 'GDPR Art. 28',
    category: 'documentation',
    deadline: 'Înainte de a transfera date',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Toți angajatorii care externalizează servicii'
  },
  {
    id: 'gdpr-017',
    title: 'Transferul de date în afara UE/SEE',
    description: 'Pentru transferuri internaționale (ex: tool HR cu servere SUA), trebuie garanții adecvate (clauze contractuale standard, certificări).',
    legalBasis: 'GDPR Art. 44-50',
    category: 'transfer',
    deadline: 'Înainte de transfer',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Angajatori care folosesc servicii cu servere în afara UE'
  },
  {
    id: 'gdpr-018',
    title: 'Limitarea perioadei de stocare',
    description: 'Datele nu se păstrează mai mult decât necesar. După încetarea contractului: CV-uri (max. 2 ani), dosare personal (50 ani pentru salarizare, 10-75 ani pentru SSM/medical).',
    legalBasis: 'GDPR Art. 5(1)(e), legislație muncii',
    category: 'documentation',
    deadline: 'Permanent aplicabil',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Toți angajatorii'
  },
  {
    id: 'gdpr-019',
    title: 'Principiul minimizării datelor',
    description: 'Colectarea doar a datelor strict necesare. Interzis: orientare sexuală, apartenență sindicală (fără consimțământ explicit), date rasiale/etnice.',
    legalBasis: 'GDPR Art. 5(1)(c), Art. 9',
    category: 'consent',
    deadline: 'Permanent aplicabil',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Toți angajatorii'
  },
  {
    id: 'gdpr-020',
    title: 'Politica de confidențialitate internă',
    description: 'Document intern care descrie cum sunt protejate datele angajaților, accesibil tuturor angajaților.',
    legalBasis: 'GDPR Art. 13-14',
    category: 'documentation',
    deadline: 'Înainte de colectarea datelor',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Toți angajatorii'
  },
  {
    id: 'gdpr-021',
    title: 'Instruirea angajaților cu acces la date personale',
    description: 'Formarea regulată a personalului HR, IT, management pe tema GDPR și securității datelor.',
    legalBasis: 'GDPR Art. 32(4), Art. 39(1)(b)',
    category: 'security',
    deadline: 'Periodic (anual recomandat)',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Toți angajatorii'
  },
  {
    id: 'gdpr-022',
    title: 'Gestionarea accesului la sisteme (control acces)',
    description: 'Doar personalul autorizat poate accesa datele angajaților. Loguri de acces, dezactivare conturi foști angajați.',
    legalBasis: 'GDPR Art. 32',
    category: 'security',
    deadline: 'Permanent',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Toți angajatorii'
  },
  {
    id: 'gdpr-023',
    title: 'Monitorizarea angajaților (video, email, locație)',
    description: 'Trebuie să fie proporțională, transparentă (informare prealabilă), limitată la scopul legitim (securitate, protejare patrimoniu). DPIA obligatorie.',
    legalBasis: 'GDPR Art. 6, Art. 35, Legea 190/2018',
    category: 'consent',
    deadline: 'Înainte de implementare',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Angajatori care implementează sisteme de monitorizare'
  },
  {
    id: 'gdpr-024',
    title: 'Prelucrarea datelor biometrice',
    description: 'Amprente, recunoaștere facială pentru pontaj = date sensibile. Necesită temei legal specific (consimțământ explicit sau interes public substanțial) și DPIA.',
    legalBasis: 'GDPR Art. 9, Art. 35',
    category: 'consent',
    deadline: 'Înainte de implementare',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Angajatori care folosesc sisteme biometrice'
  },
  {
    id: 'gdpr-025',
    title: 'Răspunsul la cererile autorității (ANSPDCP)',
    description: 'Cooperare deplină cu Autoritatea Națională de Supraveghere (ANSPDCP) în cazul controalelor sau investigațiilor.',
    legalBasis: 'GDPR Art. 31, Legea 190/2018 Art. 16-17',
    category: 'documentation',
    deadline: 'Conform termenului stabilit de ANSPDCP',
    penalty: 'Până la 4% din cifra de afaceri anuală globală',
    applicability: 'Toți angajatorii'
  }
];

/**
 * Utilitare pentru filtrare
 */
export const getObligatiiByCategory = (category: ObligatieGDPR['category']): ObligatieGDPR[] => {
  return obligatiiGDPR.filter(obl => obl.category === category);
};

export const getObligatieById = (id: string): ObligatieGDPR | undefined => {
  return obligatiiGDPR.find(obl => obl.id === id);
};

export const getAllCategories = (): ObligatieGDPR['category'][] => {
  return ['consent', 'rights', 'security', 'dpo', 'breach', 'transfer', 'documentation', 'impact'];
};

export const getCategoryLabel = (category: ObligatieGDPR['category']): string => {
  const labels: Record<ObligatieGDPR['category'], string> = {
    consent: 'Consimțământ & Date Sensibile',
    rights: 'Drepturi Persoane Vizate',
    security: 'Securitate & Protecție',
    dpo: 'DPO & Responsabilități',
    breach: 'Breșe de Securitate',
    transfer: 'Transfer Internațional',
    documentation: 'Documentare & Arhivare',
    impact: 'Evaluare Impact'
  };
  return labels[category];
};
