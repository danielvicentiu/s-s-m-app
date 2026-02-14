/**
 * SSM (Occupational Safety and Health) obligations database for Bulgaria (BG)
 * Legal basis: Zakon za zdravoslovni i bezopasni uslovia na trud (ZZBUUT)
 * Main regulations: Naredba 5/2006, Naredba 3/2004
 * Authority: Изпълнителна агенция „Главна инспекция по труда" (GIT)
 * Note: Bulgaria adopted EUR in 2025 - penalties in EUR
 */

export interface ObligationSSM {
  id: string;
  category: 'organizare-zbut' | 'evaluare-risc' | 'instruire' | 'echipamente-protectie' | 'control-medical' | 'comitet-zbut';
  obligation: string;
  obligationBG: string;
  legalBasis: string;
  frequency: 'initial' | 'periodic' | 'continuous' | 'as-needed' | 'annual' | 'biennial';
  description: string;
  penaltyMin: number;
  penaltyMax: number;
  currency: 'EUR';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const obligatiiSSMBulgaria: ObligationSSM[] = [
  // ORGANIZARE ZBUT
  {
    id: 'bg-ssm-001',
    category: 'organizare-zbut',
    obligation: 'Organizarea serviciului de securitate și sănătate în muncă',
    obligationBG: 'Организиране на служба по безопасност и здраве при работа',
    legalBasis: 'ЗЗБУТ чл. 24, ал. 1',
    frequency: 'continuous',
    description: 'Angajatorul este obligat să organizeze serviciul ZBUT prin specialiști proprii sau contractați extern, în funcție de numărul de angajați și specificul activității.',
    penaltyMin: 500,
    penaltyMax: 2500,
    currency: 'EUR',
    severity: 'critical'
  },
  {
    id: 'bg-ssm-002',
    category: 'organizare-zbut',
    obligation: 'Numirea persoanei responsabile pentru securitate și sănătate',
    obligationBG: 'Определяне на лице, отговорно за безопасността и здравето',
    legalBasis: 'ЗЗБУТ чл. 24, ал. 2',
    frequency: 'initial',
    description: 'Angajatorul trebuie să desemneze în scris o persoană competentă care să coordoneze activitățile de securitate și sănătate în muncă.',
    penaltyMin: 300,
    penaltyMax: 1500,
    currency: 'EUR',
    severity: 'high'
  },
  {
    id: 'bg-ssm-003',
    category: 'organizare-zbut',
    obligation: 'Elaborarea Regulamentului intern de securitate și sănătate',
    obligationBG: 'Разработване на Правилник за осигуряване на здравословни и безопасни условия на труд',
    legalBasis: 'ЗЗБУТ чл. 25',
    frequency: 'initial',
    description: 'Fiecare angajator cu peste 50 de angajați trebuie să elaboreze un regulament intern care să stabilească măsurile specifice de prevenire a riscurilor profesionale.',
    penaltyMin: 400,
    penaltyMax: 2000,
    currency: 'EUR',
    severity: 'high'
  },
  {
    id: 'bg-ssm-004',
    category: 'organizare-zbut',
    obligation: 'Asigurarea fondurilor pentru măsuri de securitate și sănătate',
    obligationBG: 'Осигуряване на средства за мерки по безопасност и здраве',
    legalBasis: 'ЗЗБУТ чл. 23, ал. 1',
    frequency: 'annual',
    description: 'Angajatorul este obligat să aloce resurse financiare adecvate pentru implementarea măsurilor de securitate și sănătate, inclusiv EIP, instruire și controale medicale.',
    penaltyMin: 250,
    penaltyMax: 1200,
    currency: 'EUR',
    severity: 'medium'
  },
  {
    id: 'bg-ssm-005',
    category: 'organizare-zbut',
    obligation: 'Păstrarea evidenței și documentației ZBUT',
    obligationBG: 'Водене на документация по безопасност и здраве при работа',
    legalBasis: 'Наредба № 3/2004, чл. 12',
    frequency: 'continuous',
    description: 'Angajatorul trebuie să păstreze evidența tuturor documentelor legate de ZBUT: evaluări de risc, protocoale de instruire, avize medicale, certificate EIP.',
    penaltyMin: 150,
    penaltyMax: 800,
    currency: 'EUR',
    severity: 'medium'
  },

  // EVALUARE RISC
  {
    id: 'bg-ssm-006',
    category: 'evaluare-risc',
    obligation: 'Efectuarea evaluării riscurilor profesionale',
    obligationBG: 'Извършване на оценка на професионалните рискове',
    legalBasis: 'ЗЗБУТ чл. 16, ал. 1; Наредба № 5/2006',
    frequency: 'initial',
    description: 'Angajatorul trebuie să identifice toate pericolele la locul de muncă și să evalueze riscurile pentru sănătatea și securitatea lucrătorilor.',
    penaltyMin: 600,
    penaltyMax: 3000,
    currency: 'EUR',
    severity: 'critical'
  },
  {
    id: 'bg-ssm-007',
    category: 'evaluare-risc',
    obligation: 'Actualizarea evaluării riscurilor',
    obligationBG: 'Актуализиране на оценката на рисковете',
    legalBasis: 'Наредба № 5/2006, чл. 8',
    frequency: 'as-needed',
    description: 'Evaluarea riscurilor trebuie actualizată ori de câte ori apar modificări tehnologice, organizaționale sau după producerea unui accident de muncă.',
    penaltyMin: 400,
    penaltyMax: 2000,
    currency: 'EUR',
    severity: 'high'
  },
  {
    id: 'bg-ssm-008',
    category: 'evaluare-risc',
    obligation: 'Întocmirea Planului de măsuri de prevenire',
    obligationBG: 'Изготвяне на План за мерките за превенция на рисковете',
    legalBasis: 'Наредба № 5/2006, чл. 10',
    frequency: 'annual',
    description: 'Pe baza evaluării riscurilor, angajatorul elaborează un plan anual de măsuri concrete pentru eliminarea sau reducerea riscurilor identificate.',
    penaltyMin: 300,
    penaltyMax: 1500,
    currency: 'EUR',
    severity: 'high'
  },
  {
    id: 'bg-ssm-009',
    category: 'evaluare-risc',
    obligation: 'Evaluarea riscurilor pentru lucrătoarele gravide',
    obligationBG: 'Оценка на рисковете за бременни и кърмачки работнички',
    legalBasis: 'ЗЗБУТ чл. 307',
    frequency: 'as-needed',
    description: 'Angajatorul trebuie să efectueze o evaluare specifică a riscurilor pentru femeile gravide sau care alăptează și să adapteze condițiile de muncă.',
    penaltyMin: 350,
    penaltyMax: 1800,
    currency: 'EUR',
    severity: 'high'
  },
  {
    id: 'bg-ssm-010',
    category: 'evaluare-risc',
    obligation: 'Evaluarea factorilor de risc fizici, chimici și biologici',
    obligationBG: 'Измерване на физични, химични и биологични фактори',
    legalBasis: 'Наредба № 13/2003; Наредба № 6/2005',
    frequency: 'periodic',
    description: 'Pentru locurile de muncă cu expunere la zgomot, vibrații, substanțe chimice sau agenți biologici, trebuie efectuate măsurători periodice certificate.',
    penaltyMin: 400,
    penaltyMax: 2000,
    currency: 'EUR',
    severity: 'high'
  },

  // INSTRUIRE
  {
    id: 'bg-ssm-011',
    category: 'instruire',
    obligation: 'Instruirea inițială a lucrătorilor la angajare',
    obligationBG: 'Първоначален инструктаж при постъпване на работа',
    legalBasis: 'ЗЗБУТ чл. 27, ал. 1; Наредба № 3/2004, чл. 14',
    frequency: 'initial',
    description: 'Fiecare angajat trebuie să primească instruire de securitate și sănătate înainte de începerea activității, inclusiv informații despre riscurile specifice postului său.',
    penaltyMin: 300,
    penaltyMax: 1500,
    currency: 'EUR',
    severity: 'high'
  },
  {
    id: 'bg-ssm-012',
    category: 'instruire',
    obligation: 'Instruirea periodică de securitate și sănătate',
    obligationBG: 'Периодичен инструктаж по безопасност и здраве',
    legalBasis: 'Наредба № 3/2004, чл. 15',
    frequency: 'annual',
    description: 'Toți lucrătorii trebuie să participe la instruiri periodice de ZBUT cel puțin o dată pe an, sau mai frecvent pentru activități cu risc ridicat.',
    penaltyMin: 250,
    penaltyMax: 1200,
    currency: 'EUR',
    severity: 'high'
  },
  {
    id: 'bg-ssm-013',
    category: 'instruire',
    obligation: 'Instruirea la schimbarea locului de muncă sau tehnologiei',
    obligationBG: 'Инструктаж при промяна на работното място или технологията',
    legalBasis: 'Наредба № 3/2004, чл. 16',
    frequency: 'as-needed',
    description: 'Ori de câte ori un angajat este transferat pe alt post sau se introduc noi echipamente/tehnologii, trebuie efectuată instruire specifică.',
    penaltyMin: 200,
    penaltyMax: 1000,
    currency: 'EUR',
    severity: 'medium'
  },
  {
    id: 'bg-ssm-014',
    category: 'instruire',
    obligation: 'Instruirea pentru lucrări cu risc deosebit',
    obligationBG: 'Специализиран инструктаж за особено опасни дейности',
    legalBasis: 'Наредба № 3/2004, чл. 17',
    frequency: 'as-needed',
    description: 'Lucrătorii care efectuează lucrări deosebit de periculoase (înălțime, spații înguste, cu substanțe periculoase) trebuie instruiți specific.',
    penaltyMin: 400,
    penaltyMax: 2000,
    currency: 'EUR',
    severity: 'critical'
  },
  {
    id: 'bg-ssm-015',
    category: 'instruire',
    obligation: 'Evidența instruirilor și semnarea protocoalelor',
    obligationBG: 'Документиране на проведените инструктажи',
    legalBasis: 'Наредба № 3/2004, чл. 20',
    frequency: 'continuous',
    description: 'Toate instruirile de ZBUT trebuie consemnate în protocoale/registre și semnate de angajați, cu păstrarea documentației cel puțin 5 ani.',
    penaltyMin: 150,
    penaltyMax: 800,
    currency: 'EUR',
    severity: 'medium'
  },

  // ECHIPAMENTE PROTECȚIE
  {
    id: 'bg-ssm-016',
    category: 'echipamente-protectie',
    obligation: 'Punerea la dispoziție a echipamentelor individuale de protecție',
    obligationBG: 'Осигуряване на лични предпазни средства (ЛПС)',
    legalBasis: 'ЗЗБУТ чл. 28; Наредба № 3/2001',
    frequency: 'continuous',
    description: 'Angajatorul trebuie să furnizeze gratuit EIP-uri certificate CE, adecvate riscurilor identificate (căști, mănuși, ochelari, încălțăminte, etc.).',
    penaltyMin: 300,
    penaltyMax: 1500,
    currency: 'EUR',
    severity: 'high'
  },
  {
    id: 'bg-ssm-017',
    category: 'echipamente-protectie',
    obligation: 'Instruirea privind utilizarea EIP',
    obligationBG: 'Обучение за правилна употреба на ЛПС',
    legalBasis: 'Наредба № 3/2001, чл. 10',
    frequency: 'initial',
    description: 'Lucrătorii trebuie instruiți despre utilizarea corectă, întreținerea și limitările EIP-urilor furnizate pentru activitatea lor.',
    penaltyMin: 200,
    penaltyMax: 1000,
    currency: 'EUR',
    severity: 'medium'
  },
  {
    id: 'bg-ssm-018',
    category: 'echipamente-protectie',
    obligation: 'Înlocuirea EIP uzate sau defecte',
    obligationBG: 'Подмяна на износени или повредени ЛПС',
    legalBasis: 'Наредба № 3/2001, чл. 8',
    frequency: 'as-needed',
    description: 'EIP-urile trebuie înlocuite imediat ce devin uzate, deteriorate sau își pierd proprietățile de protecție, fără costuri pentru angajați.',
    penaltyMin: 150,
    penaltyMax: 800,
    currency: 'EUR',
    severity: 'medium'
  },
  {
    id: 'bg-ssm-019',
    category: 'echipamente-protectie',
    obligation: 'Verificarea conformității echipamentelor de lucru',
    obligationBG: 'Проверка на работното оборудване за съответствие',
    legalBasis: 'ЗЗБУТ чл. 29; Наредба № 1/2011',
    frequency: 'periodic',
    description: 'Toate echipamentele de lucru (utilaje, scule electrice, platforme) trebuie verificate tehnic periodic și să aibă declarații de conformitate CE.',
    penaltyMin: 400,
    penaltyMax: 2000,
    currency: 'EUR',
    severity: 'critical'
  },
  {
    id: 'bg-ssm-020',
    category: 'echipamente-protectie',
    obligation: 'Asigurarea echipamentelor de prim ajutor',
    obligationBG: 'Осигуряване на средства за първа помощ',
    legalBasis: 'ЗЗБУТ чл. 30',
    frequency: 'continuous',
    description: 'La fiecare loc de muncă trebuie să existe truse de prim ajutor complet dotate, accesibile și verificate periodic.',
    penaltyMin: 100,
    penaltyMax: 500,
    currency: 'EUR',
    severity: 'medium'
  },

  // CONTROL MEDICAL
  {
    id: 'bg-ssm-021',
    category: 'control-medical',
    obligation: 'Efectuarea controalelor medicale inițiale',
    obligationBG: 'Извършване на предварителен медицински преглед',
    legalBasis: 'ЗЗБУТ чл. 31, ал. 1; Наредба № 3/2008',
    frequency: 'initial',
    description: 'Înainte de angajare, lucrătorii trebuie să efectueze control medical de medicina muncii pentru a stabili aptitudinea pentru postul respectiv.',
    penaltyMin: 300,
    penaltyMax: 1500,
    currency: 'EUR',
    severity: 'high'
  },
  {
    id: 'bg-ssm-022',
    category: 'control-medical',
    obligation: 'Controale medicale periodice',
    obligationBG: 'Периодични медицински прегледи',
    legalBasis: 'Наредба № 3/2008, чл. 8',
    frequency: 'periodic',
    description: 'Angajații expuși la factori de risc (zgomot, substanțe chimice, munca la înălțime) trebuie să efectueze controale medicale periodice (anual sau o dată la 2-3 ani).',
    penaltyMin: 350,
    penaltyMax: 1800,
    currency: 'EUR',
    severity: 'high'
  },
  {
    id: 'bg-ssm-023',
    category: 'control-medical',
    obligation: 'Respectarea contraindicațiilor medicale',
    obligationBG: 'Спазване на медицинските противопоказания',
    legalBasis: 'ЗЗБУТ чл. 31, ал. 3',
    frequency: 'continuous',
    description: 'Angajatorul nu poate permite angajaților declarați inapți sau cu restricții medicale să efectueze activitățile contraindicate de medicul de medicina muncii.',
    penaltyMin: 400,
    penaltyMax: 2000,
    currency: 'EUR',
    severity: 'critical'
  },
  {
    id: 'bg-ssm-024',
    category: 'control-medical',
    obligation: 'Păstrarea avizelor medicale de medicina muncii',
    obligationBG: 'Съхраняване на здравните досиета',
    legalBasis: 'Наредба № 3/2008, чл. 14',
    frequency: 'continuous',
    description: 'Angajatorul trebuie să păstreze confidențial dosarele medicale de medicina muncii ale angajaților, în condiții de securitate.',
    penaltyMin: 200,
    penaltyMax: 1000,
    currency: 'EUR',
    severity: 'medium'
  },
  {
    id: 'bg-ssm-025',
    category: 'control-medical',
    obligation: 'Asigurarea vaccinărilor obligatorii',
    obligationBG: 'Осигуряване на задължителни имунизации',
    legalBasis: 'Наредба № 15/2005',
    frequency: 'as-needed',
    description: 'Pentru activități cu risc biologic (sănătate, agricultură, laboratoare), angajatorul asigură vaccinările obligatorii stabilite de legislație.',
    penaltyMin: 250,
    penaltyMax: 1200,
    currency: 'EUR',
    severity: 'high'
  },

  // COMITET ZBUT
  {
    id: 'bg-ssm-026',
    category: 'comitet-zbut',
    obligation: 'Constituirea Comitetului de securitate și sănătate',
    obligationBG: 'Създаване на комитет по условия на труд (КУТ)',
    legalBasis: 'ЗЗБУТ чл. 37',
    frequency: 'initial',
    description: 'Angajatorii cu 50 sau mai mulți angajați sunt obligați să constituie un comitet paritetic pentru coordonarea măsurilor de ZBUT.',
    penaltyMin: 400,
    penaltyMax: 2000,
    currency: 'EUR',
    severity: 'high'
  },
  {
    id: 'bg-ssm-027',
    category: 'comitet-zbut',
    obligation: 'Asigurarea funcționării periodice a Comitetului',
    obligationBG: 'Провеждане на редовни заседания на КУТ',
    legalBasis: 'ЗЗБУТ чл. 38, ал. 2',
    frequency: 'periodic',
    description: 'Comitetul de securitate și sănătate trebuie să se întrunească cel puțin trimestrial și să consemneze dezbaterile în procese-verbale.',
    penaltyMin: 200,
    penaltyMax: 1000,
    currency: 'EUR',
    severity: 'medium'
  },
  {
    id: 'bg-ssm-028',
    category: 'comitet-zbut',
    obligation: 'Informarea și consultarea lucrătorilor',
    obligationBG: 'Информиране и консултиране на работниците',
    legalBasis: 'ЗЗБУТ чл. 35',
    frequency: 'continuous',
    description: 'Angajatorul trebuie să informeze și să consulte lucrătorii sau reprezentanții lor asupra tuturor aspectelor legate de securitate și sănătate.',
    penaltyMin: 250,
    penaltyMax: 1200,
    currency: 'EUR',
    severity: 'medium'
  },
  {
    id: 'bg-ssm-029',
    category: 'comitet-zbut',
    obligation: 'Raportarea accidentelor de muncă',
    obligationBG: 'Докладване на трудови злополуки',
    legalBasis: 'ЗЗБУТ чл. 54; Наредба № 2/2008',
    frequency: 'as-needed',
    description: 'Angajatorul trebuie să raporteze în termen de 3 zile către GIT orice accident de muncă care a cauzat incapacitate temporară de cel puțin 3 zile.',
    penaltyMin: 400,
    penaltyMax: 2000,
    currency: 'EUR',
    severity: 'critical'
  },
  {
    id: 'bg-ssm-030',
    category: 'comitet-zbut',
    obligation: 'Asigurarea dreptului de oprire a muncii în caz de pericol iminent',
    obligationBG: 'Спиране на работа при непосредствена опасност',
    legalBasis: 'ЗЗБУТ чл. 34, ал. 1',
    frequency: 'as-needed',
    description: 'Lucrătorii au dreptul să oprească lucrul și să părăsească locul de muncă în cazul unui pericol grav și iminent, fără a suferi prejudicii.',
    penaltyMin: 500,
    penaltyMax: 2500,
    currency: 'EUR',
    severity: 'critical'
  }
];

/**
 * Get all Bulgarian SSM obligations
 * @returns Array of SSM obligations for Bulgaria
 */
export function getObligatiiSSMBulgaria(): ObligationSSM[] {
  return obligatiiSSMBulgaria;
}

/**
 * Get obligation by ID
 * @param id Obligation ID
 * @returns Obligation object or undefined
 */
export function getObligationByIdBG(id: string): ObligationSSM | undefined {
  return obligatiiSSMBulgaria.find(o => o.id === id);
}

/**
 * Get obligations by category
 * @param category Obligation category
 * @returns Array of obligations matching the category
 */
export function getObligationsByCategoryBG(category: ObligationSSM['category']): ObligationSSM[] {
  return obligatiiSSMBulgaria.filter(o => o.category === category);
}

/**
 * Get obligations by severity
 * @param severity Severity level
 * @returns Array of obligations matching the severity
 */
export function getObligationsBySeverityBG(severity: ObligationSSM['severity']): ObligationSSM[] {
  return obligatiiSSMBulgaria.filter(o => o.severity === severity);
}

/**
 * Get obligations by frequency
 * @param frequency Frequency type
 * @returns Array of obligations matching the frequency
 */
export function getObligationsByFrequencyBG(frequency: ObligationSSM['frequency']): ObligationSSM[] {
  return obligatiiSSMBulgaria.filter(o => o.frequency === frequency);
}

export default obligatiiSSMBulgaria;
